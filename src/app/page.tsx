import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  getSiteSettings,
  getAudienceGroups,
  getSpecialties,
  getProcessSteps,
  getFaqs,
  getTestimonials,
  getPublishedBlogPosts,
  getAboutContent,
  buildWhatsappUrl,
} from "@/lib/content";
import { Container, SectionHeading, ButtonLink, Card } from "@/components/ui";
import { Icon, type IconName } from "@/components/icon";
import { AnimatedCharacter } from "@/components/animated-character";
import { EmotionPicker } from "@/components/emotion-picker";
import { Pattern } from "@/components/pattern";
import { Reveal } from "@/components/reveal";
import { GiftTeaser } from "@/components/gift-teaser";
import { JsonLd } from "@/components/json-ld";
import { buildHomeJsonLd } from "@/lib/seo";

const AUDIENCE_ICON: IconName[] = ["child", "teen", "adult", "couple", "family"];
const ACCENT_ROTATION = [
  { bg: "bg-purple-100", text: "text-purple-600", dot: "bg-purple-500", border: "border-t-purple-500" },
  { bg: "bg-aqua-100", text: "text-aqua-600", dot: "bg-aqua-500", border: "border-t-aqua-500" },
  { bg: "bg-pink-100", text: "text-pink-500", dot: "bg-pink-500", border: "border-t-pink-500" },
];

export const metadata: Metadata = {
  alternates: { canonical: "/", languages: { es: "/", "x-default": "/" } },
};

export default async function HomePage() {
  const [settings, about, audience, specialties, steps, faqs, testimonials, posts] = await Promise.all([
    getSiteSettings(),
    getAboutContent(),
    getAudienceGroups(true),
    getSpecialties(true),
    getProcessSteps(),
    getFaqs(true),
    getTestimonials(true),
    getPublishedBlogPosts(),
  ]);

  const whatsappHref = buildWhatsappUrl(settings.whatsappNumber, settings.whatsappMessageTemplate);
  const primaryHref = settings.bookingMode === "whatsapp" ? whatsappHref ?? "/contacto" : "/servicios#agenda";
  const isWhatsapp = settings.bookingMode === "whatsapp";
  const aboutIntro = about.bioHtml.match(/<p>([\s\S]*?)<\/p>/)?.[1].replace(/<[^>]+>/g, "").trim();

  const jsonLd = await buildHomeJsonLd();

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-lilac-100 via-purple-50 to-background [mask-image:linear-gradient(to_bottom,#000_88%,transparent)]">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-aqua-100 blur-3xl opacity-60 animate-float-slow" />
        <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-pink-100 blur-3xl opacity-60 animate-float-slow [animation-delay:2s]" />
        <Pattern />
        <Container className="relative pt-5 pb-12 sm:py-20 grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-6 lg:gap-12 items-center">
          <div className="animate-fade-up text-center lg:text-left">
            <div className="inline-flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5 rounded-full bg-white/80 border border-purple-200 shadow-sm px-4 py-1.5 mb-4 sm:mb-6">
              <span className="w-2 h-2 rounded-full bg-aqua-500" />
              <span className="text-sm font-semibold text-purple-700">{settings.siteName}</span>
              <span className="text-sm text-ink-500">· {about.title}</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.8rem] font-semibold text-ink-900 leading-[1.15]">
              {settings.heroTitle}
            </h1>
            <p className="mt-5 text-lg text-ink-700 leading-relaxed max-w-xl mx-auto lg:mx-0">{settings.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
              <ButtonLink href={primaryHref} external={isWhatsapp} variant="primary">
                {settings.heroCtaPrimaryText}
                <Icon name="arrow-right" className="w-4 h-4" />
              </ButtonLink>
              <ButtonLink href="/como-trabajo" variant="ghost">
                {settings.heroCtaSecondaryText}
              </ButtonLink>
            </div>
            <ul className="mt-8 flex flex-wrap justify-center lg:justify-start gap-2.5 text-sm font-medium text-purple-700">
              {[
                { icon: "compass", label: "100% online" },
                { icon: "heart", label: "En español" },
                { icon: "leaf", label: "A tu ritmo" },
              ].map((chip) => (
                <li key={chip.label} className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-purple-100 px-3.5 py-1.5">
                  <Icon name={chip.icon as IconName} className="w-4 h-4 text-aqua-600" />
                  {chip.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Foto de Bertha */}
          <div className="relative order-first lg:order-none mx-auto w-full mt-8 sm:mt-6 lg:mt-0 max-w-[15rem] sm:max-w-[18rem] lg:max-w-[22rem] animate-fade-up [animation-delay:150ms]">
            <div className="absolute -inset-3 -rotate-3 rounded-[2rem] bg-gradient-to-br from-purple-200 via-lilac-100 to-aqua-100" />
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border-4 border-white shadow-xl shadow-purple-200/60">
              <Image
                src="/bertha/bertha-11.jpg"
                alt={`${settings.siteName}, ${about.title.toLowerCase()}`}
                fill
                preload
                className="object-cover"
                sizes="(min-width: 1024px) 352px, (min-width: 640px) 288px, 240px"
              />
            </div>
            <div className="bubble absolute -left-[6%] -top-[9%] sm:-left-[2%] sm:top-[4%] whitespace-nowrap rounded-2xl rounded-bl-sm bg-white px-3 py-1.5 sm:px-4 sm:py-2 shadow-lg shadow-purple-200/60 border border-purple-100">
              <p className="font-display text-sm sm:text-base font-semibold text-purple-700">¡Hola! Qué bueno verte</p>
            </div>
            {about.yearsExperience > 0 && (
              <div className="absolute -bottom-3 right-0 sm:-right-3 rounded-2xl bg-white shadow-lg shadow-purple-200/60 border border-purple-100 px-5 py-3.5">
                <p className="font-display text-2xl font-bold text-purple-600 leading-none">
                  {about.yearsExperience}+
                </p>
                <p className="text-xs text-ink-500 mt-1 whitespace-nowrap">años de experiencia</p>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ¿CÓMO TE SIENTES HOY? */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <Pattern />
        <Container className="relative">
          <EmotionPicker ctaHref={primaryHref} ctaExternal={isWhatsapp} />
        </Container>
      </section>

      {/* CONOCE A BERTHA */}
      <section className="relative overflow-hidden py-16 sm:py-24 section-tint">
        <Pattern />
        <Container className="relative grid lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] gap-10 lg:gap-16 items-center">
          <Reveal className="relative mx-auto w-full max-w-[18rem] lg:max-w-none aspect-[1/1.05]">
            <div className="absolute inset-[4%] rounded-full bg-gradient-to-br from-white via-purple-100 to-aqua-100 shadow-xl shadow-purple-200/50" />
            <div className="absolute inset-0 flex items-end justify-center pb-[4%]">
              <AnimatedCharacter
                character="wave"
                inline
                shadow
                position={{ width: 280 }}
                entranceAnimation="rise"
                scrollAnimation="hop"
                interaction={["hover", "cursor-tilt"]}
                visibleFrom="always"
              />
            </div>
          </Reveal>
          <Reveal delay={120} className="text-center lg:text-left">
            <SectionHeading eyebrow="Sobre mí" title={`Hola, soy ${settings.siteName}`} />
            <p className="-mt-6 mb-4 font-medium text-purple-600">{about.title}</p>
            {aboutIntro && <p className="text-ink-700 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">{aboutIntro}</p>}
            <div className="mt-8">
              <ButtonLink href="/sobre-mi" variant="ghost">
                Conocer mi historia
                <Icon name="arrow-right" className="w-4 h-4" />
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* A QUIÉN ATIENDO */}
      {audience.length > 0 && (
        <section className="relative overflow-hidden py-16 sm:py-20 section-tint">
          <Pattern />
          <Container className="relative">
            <SectionHeading eyebrow="A quién atiendo" title="Un espacio para cada etapa de la vida" center />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 max-sm:[&>*:last-child:nth-child(odd)]:col-span-2 max-sm:[&>*:last-child:nth-child(odd)]:w-[calc(50%-0.5rem)] max-sm:[&>*:last-child:nth-child(odd)]:justify-self-center">
              {audience.map((group, i) => {
                const accent = ACCENT_ROTATION[i % ACCENT_ROTATION.length];
                return (
                  <Reveal key={group.id} delay={i * 70} className="h-full">
                    <Card className="h-full text-center !p-5">
                      <div
                        className={`w-14 h-14 mx-auto rounded-full ${accent.bg} ${accent.text} flex items-center justify-center mb-3`}
                      >
                        <Icon name={AUDIENCE_ICON[i % AUDIENCE_ICON.length]} className="w-7 h-7" />
                      </div>
                      <p className="font-semibold text-ink-900">{group.name}</p>
                      {group.description && (
                        <p className="text-sm text-ink-500 mt-1 line-clamp-2">{group.description}</p>
                      )}
                    </Card>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* TEMAS Y ESPECIALIDADES */}
      {specialties.length > 0 && (
        <section className="relative overflow-hidden py-16 sm:py-24">
          <Pattern />
          <AnimatedCharacter
            character="scared"
            position={{ top: "3rem", right: "clamp(1rem, 5vw, 6rem)", width: 118 }}
            entranceAnimation="from-right"
            scrollAnimation="shiver"
            interaction={["cursor-tilt"]}
            visibleFrom="lg"
          />
          <Container className="relative">
            <SectionHeading eyebrow="Temas y especialidades" title="En qué puedo acompañarte" center />
            <div className="flex flex-wrap justify-center gap-3">
              {specialties.map((s, i) => {
                const accent = ACCENT_ROTATION[i % ACCENT_ROTATION.length];
                return (
                  <Reveal key={s.id} delay={(i % 6) * 60}>
                    <span className="inline-flex items-center gap-2.5 rounded-full bg-white border border-purple-100 px-5 py-3 text-sm text-ink-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-purple-100 hover:border-purple-200">
                      <span className={`w-2.5 h-2.5 rounded-full ${accent.dot} shrink-0`} />
                      {s.title}
                    </span>
                  </Reveal>
                );
              })}
            </div>
            <p className="mt-10 mx-auto max-w-xl flex items-start gap-3 rounded-2xl bg-aqua-100/70 px-5 py-4 text-sm text-ink-700">
              <Icon name="heart" className="w-5 h-5 text-aqua-600 shrink-0 mt-0.5" />
              Si tu proceso lo requiere, te acompaño derivándote con un profesional médico.
            </p>
          </Container>
        </section>
      )}

      {/* CÓMO TRABAJO (teaser) */}
      {steps.length > 0 && (
        <section className="relative overflow-hidden py-16 sm:py-24 section-tint">
          <Pattern />
          <Container className="relative grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <SectionHeading eyebrow="Cómo trabajo" title="Cada proceso es diferente" />
              <div className="relative mx-auto lg:mx-0 w-52 mb-8 hidden sm:block">
                <div className="absolute inset-x-2 bottom-0 top-8 rounded-full bg-gradient-to-br from-purple-100 to-aqua-100" />
                <AnimatedCharacter
                  character="think"
                  inline
                  shadow
                  position={{ width: 150 }}
                  entranceAnimation="rise"
                  scrollAnimation="tilt"
                  interaction={["hover", "cursor-tilt"]}
                  visibleFrom="always"
                />
              </div>
              <ButtonLink href="/como-trabajo" variant="ghost">
                Conocer el proceso completo
                <Icon name="arrow-right" className="w-4 h-4" />
              </ButtonLink>
            </div>
            <ol className="relative space-y-4">
              <span
                aria-hidden
                className="absolute left-[1.35rem] top-6 bottom-6 w-px bg-gradient-to-b from-aqua-300 via-purple-200 to-transparent"
              />
              {steps.slice(0, 5).map((step, i) => (
                <Reveal key={step.id} delay={i * 90}>
                  <li className="relative flex gap-4 items-center rounded-2xl bg-white border border-purple-100 px-4 py-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-purple-100">
                    <span className="w-11 h-11 shrink-0 rounded-full bg-gradient-to-br from-aqua-400 to-aqua-600 text-white text-base font-semibold flex items-center justify-center shadow-sm shadow-aqua-300/50">
                      {i + 1}
                    </span>
                    <p className="font-semibold text-ink-900">{step.title}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </Container>
        </section>
      )}

      {/* REGALO: DIARIO DE LA GRATITUD */}
      <section className="relative py-12 sm:py-16">
        <Container className="max-w-3xl">
          <Reveal>
            <GiftTeaser />
          </Reveal>
        </Container>
      </section>

      {/* CTA banda */}
      <section className="relative overflow-hidden py-20 sm:py-24 section-band">
        <Pattern tone="white" />
        <div className="absolute -top-16 -right-10 w-64 h-64 rounded-full bg-white/10 blur-2xl animate-float-slow" />
        <div className="absolute -bottom-20 left-10 w-64 h-64 rounded-full bg-white/10 blur-2xl animate-float-slow [animation-delay:2.5s]" />
        <AnimatedCharacter
          character="wave"
          position={{ right: "clamp(0.5rem, 5vw, 7rem)", bottom: "0", width: 170 }}
          entranceAnimation="from-right"
          scrollAnimation="hop"
          interaction={["hover", "cursor-tilt"]}
          delay={150}
          visibleFrom="lg"
        />
        <Container className="relative text-center lg:pr-40">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
            Dar el primer paso también es parte del proceso
          </h2>
          <div className="mt-7">
            <ButtonLink
              href={primaryHref}
              external={isWhatsapp}
              variant="ghost"
              className="!bg-white !text-purple-700 !border-transparent"
            >
              {settings.heroCtaPrimaryText}
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* TESTIMONIOS */}
      {testimonials.length > 0 && (
        <section className="relative overflow-hidden py-16 sm:py-24">
          <Pattern />
          <Container className="relative">
            <SectionHeading eyebrow="Testimonios" title="Lo que dicen quienes ya hicieron su proceso" center />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, i) => {
                const accent = ACCENT_ROTATION[i % ACCENT_ROTATION.length];
                return (
                  <Reveal key={t.id} delay={i * 90} className="h-full">
                    <Card className={`h-full border-t-4 ${accent.border}`}>
                      <Icon name="quote" className={`w-7 h-7 ${accent.text} mb-3`} />
                      <p className="text-ink-700 italic leading-relaxed line-clamp-6">&ldquo;{t.quote}&rdquo;</p>
                      <p className="text-sm text-ink-500 mt-4 font-medium">— {t.authorInitials}</p>
                    </Card>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* BLOG preview */}
      {posts.length > 0 && (
        <section className="relative overflow-hidden py-16 sm:py-20 section-tint">
          <Pattern />
          <Container className="relative">
            <SectionHeading eyebrow="Blog" title="Reflexiones recientes" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(0, 3).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                  <Card className="h-full flex flex-col">
                    {post.coverImageUrl && (
                      <div className="relative aspect-video rounded-xl overflow-hidden mb-4 -mt-2">
                        <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" sizes="360px" />
                      </div>
                    )}
                    <p className="font-semibold text-ink-900 group-hover:text-purple-600 transition-colors">
                      {post.title}
                    </p>
                    {post.excerpt && <p className="text-sm text-ink-500 mt-2 line-clamp-3">{post.excerpt}</p>}
                  </Card>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* FAQ preview */}
      {faqs.length > 0 && (
        <section className="relative overflow-hidden py-16 sm:py-24">
          <Pattern />
          <Container className="relative max-w-3xl">
            <SectionHeading eyebrow="Preguntas frecuentes" title="Resolvemos tus dudas" center />
            <div className="space-y-3">
              {faqs.slice(0, 5).map((faq) => (
                <details key={faq.id} className="group rounded-xl bg-white border border-purple-100 p-5">
                  <summary className="cursor-pointer -m-5 p-5 font-medium text-ink-900 flex items-center justify-between gap-3">
                    {faq.question}
                    <Icon name="arrow-right" className="w-4 h-4 text-purple-400 group-open:rotate-90 transition-transform shrink-0" />
                  </summary>
                  <p className="text-ink-500 text-sm mt-3 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
            <div className="text-center mt-8">
              <ButtonLink href="/contacto" variant="ghost">
                Ver todas las preguntas
              </ButtonLink>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
