import "server-only";
import { SITE_URL } from "@/lib/site";
import { toMinorUnits, type Currency } from "@/lib/prices";

/**
 * Pagos con Stripe Checkout, sin SDK: solo la API REST (fetch).
 *
 * Para activarlo basta con definir en el hosting (y en .env para desarrollo):
 *   STRIPE_SECRET_KEY=sk_live_...   (o sk_test_... para pruebas)
 * Hasta entonces los botones "Pagar" avisan que el pago en línea llega pronto.
 *
 * Importante en la cuenta de Stripe: habilitar el cobro en USD y en COP.
 */
const API = "https://api.stripe.com/v1";

export const isStripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY);

async function stripeRequest<T>(path: string, init?: { method?: "GET" | "POST"; body?: URLSearchParams }): Promise<T> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY no está configurada");
  const res = await fetch(`${API}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Bearer ${key}`,
      ...(init?.body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: init?.body,
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Stripe ${res.status}: ${json?.error?.message ?? "error desconocido"}`);
  return json as T;
}

export interface CheckoutInput {
  serviceId: string;
  serviceName: string;
  /** Precio ya validado contra la base de datos (solo el número, ej. "45"). */
  price: string;
  currency: Currency;
}

/** Crea una sesión de Stripe Checkout y devuelve la URL a la que enviar al cliente. */
export async function createCheckoutSession({ serviceId, serviceName, price, currency }: CheckoutInput): Promise<string> {
  const metadata = { serviceId, serviceName, currency };
  const body = new URLSearchParams({
    mode: "payment",
    locale: "es-419",
    submit_type: "pay",
    // La cuenta trae Managed Payments activo por defecto y exige un tax code por producto; se cobra como pago normal.
    "managed_payments[enabled]": "false",
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": currency.toLowerCase(),
    "line_items[0][price_data][unit_amount]": String(toMinorUnits(price)),
    "line_items[0][price_data][product_data][name]": serviceName,
    // Stripe le pide al cliente su teléfono para que Bertha pueda coordinar la sesión.
    "phone_number_collection[enabled]": "true",
    "payment_intent_data[description]": serviceName,
    // Pasa por /api/regalo/activar, que confirma el pago, desbloquea el regalo y muestra la página de éxito.
    success_url: `${SITE_URL}/api/regalo/activar?session_id={CHECKOUT_SESSION_ID}&destino=exito`,
    cancel_url: `${SITE_URL}/servicios?pago=cancelado`,
  });
  for (const [k, v] of Object.entries(metadata)) {
    body.set(`metadata[${k}]`, v);
    body.set(`payment_intent_data[metadata][${k}]`, v);
  }
  const session = await stripeRequest<{ url: string | null }>("/checkout/sessions", { method: "POST", body });
  if (!session.url) throw new Error("Stripe no devolvió la URL de pago");
  return session.url;
}

export interface CheckoutSummary {
  paid: boolean;
  serviceName: string | null;
  amount: string | null;
  currency: Currency | null;
}

/** Consulta una sesión para confirmar el pago en la página de éxito. Devuelve null si no existe. */
export async function getCheckoutSummary(sessionId: string): Promise<CheckoutSummary | null> {
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return null;
  try {
    const s = await stripeRequest<{
      payment_status: string;
      amount_total: number | null;
      currency: string | null;
      metadata?: Record<string, string>;
    }>(`/checkout/sessions/${sessionId}`);
    const currency = s.currency?.toUpperCase() === "COP" ? "COP" : s.currency?.toUpperCase() === "USD" ? "USD" : null;
    return {
      paid: s.payment_status === "paid",
      serviceName: s.metadata?.serviceName ?? null,
      amount: s.amount_total != null ? String(s.amount_total / 100) : null,
      currency,
    };
  } catch (err) {
    console.error("[stripe] no se pudo consultar la sesión", err);
    return null;
  }
}

/** Busca un pago confirmado hecho con ese correo (para recuperar el regalo en otro dispositivo). */
export async function findPaidSessionIdByEmail(email: string): Promise<string | null> {
  const params = new URLSearchParams({ "customer_details[email]": email.trim().toLowerCase(), limit: "20" });
  try {
    const res = await stripeRequest<{ data: { id: string; payment_status: string }[] }>(`/checkout/sessions?${params}`);
    return res.data.find((s) => s.payment_status === "paid")?.id ?? null;
  } catch (err) {
    console.error("[stripe] no se pudo buscar el pago por correo", err);
    return null;
  }
}
