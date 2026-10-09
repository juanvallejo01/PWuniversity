import type { Metadata } from "next";
import { getServices } from "@/lib/content";
import { AdminHeading, AdminCard, SaveButton, CheckboxField, ImageField } from "@/components/admin/ui";
import { addServiceAction, updateServiceAction, deleteServiceAction } from "./actions";

export const metadata: Metadata = { title: "Servicios" };

export default async function AdminServiciosPage() {
  const services = await getServices(false);

  return (
    <div className="max-w-4xl space-y-6">
      <AdminHeading
        title="Servicios y precios"
        subtitle="Cada servicio tiene dos precios: dólares estadounidenses (USD) y pesos colombianos (COP). Cada precio que cargues muestra su botón de pago en línea; si dejás ambos en blanco, el sitio muestra 'Consultar valores'."
      />

      <AdminCard>
        <div className="space-y-4 mb-6">
          {services.map((s) => (
            <form key={s.id} action={updateServiceAction} className="grid sm:grid-cols-2 gap-2 bg-purple-50 rounded-lg p-4">
              <input type="hidden" name="id" value={s.id} />
              <input name="name" defaultValue={s.name} placeholder="Nombre" className="rounded-lg border border-purple-200 px-2 py-2 text-sm sm:col-span-2" />
              <textarea name="description" defaultValue={s.description} placeholder="Descripción (una línea por párrafo; • para lista, # para etiqueta destacada)" className="rounded-lg border border-purple-200 px-2 py-2 text-sm sm:col-span-2" rows={4} />
              <input name="duration" defaultValue={s.duration} placeholder="Duración (ej: 45 min)" className="rounded-lg border border-purple-200 px-2 py-2 text-sm" />
              <input name="frequency" defaultValue={s.frequency} placeholder="Frecuencia (ej: semanal)" className="rounded-lg border border-purple-200 px-2 py-2 text-sm" />
              <label className="flex items-center gap-2 rounded-lg border border-purple-200 bg-white px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-purple-300">
                <span className="text-xs font-semibold text-purple-700 shrink-0">USD $</span>
                <input name="priceUsd" inputMode="decimal" defaultValue={s.priceUsd ?? ""} placeholder="Precio en dólares (ej: 45)" className="w-full bg-transparent outline-none" />
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-purple-200 bg-white px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-purple-300">
                <span className="text-xs font-semibold text-purple-700 shrink-0">COP $</span>
                <input name="priceCop" inputMode="numeric" defaultValue={s.priceCop ?? ""} placeholder="Precio en pesos colombianos (ej: 250000)" className="w-full bg-transparent outline-none" />
              </label>
              <input name="order" type="number" defaultValue={s.order} placeholder="Orden" className="rounded-lg border border-purple-200 px-2 py-2 text-sm" />
              <div className="sm:col-span-2 rounded-lg border border-dashed border-purple-200 bg-white p-3 space-y-2">
                <ImageField label="Imagen del servicio (opcional: horizontal 16:9, o vertical tipo póster)" name="image" currentUrl={s.imageUrl} />
                {s.imageUrl && <CheckboxField label="Quitar la imagen actual" name="removeImage" />}
              </div>
              <div className="flex items-center justify-between sm:col-span-2 mt-1">
                <CheckboxField label="Activo (visible en el sitio)" name="active" defaultChecked={s.active} />
                <div className="flex gap-3">
                  <button type="submit" className="text-xs text-purple-600 underline">Guardar</button>
                  <button type="submit" formAction={deleteServiceAction} className="text-xs text-pink-500 underline">Eliminar</button>
                </div>
              </div>
            </form>
          ))}
          {services.length === 0 && <p className="text-sm text-ink-500">Aún no agregaste servicios.</p>}
        </div>

        <p className="font-semibold text-ink-900 mb-3 text-sm">Agregar servicio</p>
        <form action={addServiceAction} className="flex gap-2">
          <input name="name" placeholder="Ej: Valoración inicial" required className="flex-1 rounded-lg border border-purple-200 px-2 py-2 text-sm" />
          <SaveButton>Agregar</SaveButton>
        </form>
      </AdminCard>
    </div>
  );
}
