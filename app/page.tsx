
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Reveal, Stagger, Item } from "@/components/motion/reveal";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            {/* Logo con un toque de color controlado */}
            <div
              className="h-9 w-9 rounded-xl border bg-foreground shadow-sm"
              style={{
                boxShadow:
                  "0 0 0 1px color-mix(in oklch, hsl(var(--border)) 70%, transparent), 0 14px 40px rgb(var(--glow-2) / 0.12)",
              }}
              aria-hidden="true"
            />
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight">House of Verlein</p>
              <p className="text-xs text-muted-foreground">Subscription Studio</p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Link href="#catalog" className="hidden px-3 py-2 text-sm text-muted-foreground hover:text-foreground md:block">
              Catálogo
            </Link>
            <Link href="#membership" className="hidden px-3 py-2 text-sm text-muted-foreground hover:text-foreground md:block">
              Membresía
            </Link>
            <Separator orientation="vertical" className="mx-2 hidden h-6 md:block" />
            <Button asChild variant="ghost" className="hidden md:inline-flex">
              <Link href="/login">Iniciar sesión</Link>
            </Button>

            {/* CTA con gradiente discreto */}
            <Button
              asChild
              className="rounded-full border border-border bg-[linear-gradient(135deg,rgb(var(--glow-1)/0.95),rgb(var(--glow-3)/0.85))] text-white shadow-sm hover:opacity-95"
            >
              <Link href="/signup">Crear cuenta</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main>
        <Reveal>
          <section className="relative overflow-hidden">
            {/* textura suave + glows de color */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.9] animated-background"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 18% 12%, rgb(var(--glow-1) / 0.18), transparent 45%), radial-gradient(circle at 82% 28%, rgb(var(--glow-2) / 0.16), transparent 44%), radial-gradient(circle at 46% 92%, rgb(var(--glow-3) / 0.14), transparent 46%)",
              }}
            />

            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:items-center md:py-20">
              <div>
                <Badge variant="secondary" className="rounded-full border border-border bg-secondary/60 px-4 py-1 text-xs">
                  Curated beats. Weekly drops.
                </Badge>

                <h1 className="font-serif mt-5 text-4xl leading-[1.05] tracking-[-0.02em] md:text-6xl">
                  Beats premium, listos para grabar.
                </h1>

                <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                  Suscripción mensual con acceso inmediato a un catálogo organizado y descargable. Cada semana,
                  una selección nueva llega por correo a suscriptores activos.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  {/* Botón principal con gradiente suave */}
                  <Button
                    asChild
                    className="rounded-full px-6 bg-[linear-gradient(135deg,rgb(var(--glow-2)/0.95),rgb(var(--glow-1)/0.85))] text-foreground shadow-sm hover:opacity-95"
                  >
                    <Link href="/billing">Ver membresía</Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full px-6 border-border bg-background/60 backdrop-blur hover:bg-background"
                  >
                    <Link href="#how">Cómo funciona</Link>
                  </Button>
                </div>

                <Stagger className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
                  <MiniStat label="Acceso" value="Instantáneo" />
                  <MiniStat label="Descargas" value="Activas con plan" />
                  <MiniStat label="Catálogo" value="Curado" />
                  <MiniStat label="Email" value="Semanal" />
                </Stagger>

                <p className="mt-6 text-xs text-muted-foreground">
                  Estética y experiencia enfocadas en artistas: pocos pasos, cero ruido.
                </p>
              </div>

              {/* Mock card */}
              <Card className="relative rounded-3xl border-border bg-card/70 p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium tracking-tight">Drop of the Week</p>
                    <p className="mt-1 text-xs text-muted-foreground">El beat que ha roto el mercado de la semana. ¿Que esperas a crear algo nuevo?</p>
                  </div>
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                    142 BPM
                  </span>
                </div>

                <div className="mt-6 rounded-2xl border border-border bg-background p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-serif text-xl tracking-tight">Midnight Drift</p>
                      <p className="mt-1 text-xs text-muted-foreground">Trap • Dark • Key: Fm</p>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs">
                      {/* Dot de “featured” con color joya */}
                      <span className="h-2 w-2 rounded-full bg-[rgb(var(--glow-1))] shadow-[0_0_0_6px_rgb(var(--glow-1)/0.12)]" />
                      Featured
                    </span>
                  </div>

                  <div className="mt-6">
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div className="h-2 w-[38%] rounded-full bg-foreground" />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>0:34</span>
                      <span>2:12</span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button variant="outline" className="rounded-full">
                      Preview
                    </Button>

                    {/* Descargar con acento oro -> esmeralda */}
                    <Button className="rounded-full bg-[linear-gradient(135deg,rgb(var(--glow-2)/0.95),rgb(var(--glow-1)/0.85))] text-foreground hover:opacity-95">
                      Descargar
                    </Button>
                  </div>

                  <p className="mt-4 text-xs text-muted-foreground">
                    Una ida al lado oscuro japones.
                  </p>
                </div>

                {/* detalle “couture”: línea con gradiente */}
                <div
                  className="pointer-events-none absolute inset-x-6 bottom-6 h-px opacity-60"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgb(var(--glow-2) / 0.65), rgb(var(--glow-1) / 0.55), transparent)",
                  }}
                />
              </Card>
            </div>
          </section>
        </Reveal>
        {/* How */}
        <section id="how" className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="font-serif text-3xl tracking-tight">Cómo funciona</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Pensado para convertir rápido: registro, suscripción, exploración, descarga.
                </p>
              </div>

              {/* MVP con tono oro */}
              <Badge className="rounded-full bg-[rgb(var(--glow-2))] text-foreground shadow-sm">
                MVP
              </Badge>
            </div>

            <Stagger className="mt-8 grid gap-4 md:grid-cols-2">
              <StepCard title="Cuenta" desc="Registro e inicio de sesión. Estado de suscripción sincronizado." />
              <StepCard title="Pago" desc="Checkout con Stripe y control por webhooks." />
              <StepCard title="Catálogo" desc="Búsqueda y filtros básicos para encontrar rápido." />
              <StepCard title="Descarga" desc="Enlaces temporales para proteger archivos." />
            </Stagger>
          </div>
        </section>

        {/* Catalog */}
        <section id="catalog" className="border-t border-border bg-secondary/35">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-3xl tracking-tight">Catálogo</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Un catálogo completo de beats listos para su uso. Filtra, busca y empieza a hacer tu verdadero sonido.
                </p>
              </div>

              <Button asChild variant="outline" className="rounded-full">
                <Link href="/beats">Abrir catálogo</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <FeatureCard title="Filtros" value="Género, BPM, mood, fecha" />
              <FeatureCard title="Preview" value="Escucha antes de descargar" />
              <FeatureCard title="Entrega" value="Descarga protegida por plan" />
            </div>
          </div>
        </section>

        {/* Membership */}
        <section id="membership" className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="font-serif text-3xl tracking-tight">Membresía</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Pago mensual, un catálogo completo, acceso a beats personalizado para todas esas nuevas oportunidaes.
            </p>

            <div className="mt-8 grid gap-6 place-content-center">
              <Card className="rounded-3xl border-border bg-card/70 p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Plan mensual</p>
                    <p className="font-serif mt-2 text-5xl tracking-tight">
                      $100<span className="ml-2 text-base text-muted-foreground">/mes</span>
                    </p>
                  </div>

                  {/* Recomendado en esmeralda */}
                  <Badge className="rounded-full bg-[rgb(var(--glow-1))] text-white shadow-sm">
                    Recomendado
                  </Badge>
                </div>

                <Separator className="my-6" />

                <ul className="space-y-2 text-sm text-foreground/90">
                  <li>Acceso completo al catálogo</li>
                  <li>Descargas activas mientras el plan esté vigente</li>
                  <li>Selección semanal por email</li>
                  <li>Soporte básico por correo</li>
                </ul>

                <div className="mt-7 flex gap-3">
                  <Button
                    asChild
                    className="w-full rounded-full bg-[linear-gradient(135deg,rgb(var(--glow-1)/0.95),rgb(var(--glow-3)/0.85))] text-white hover:opacity-95"
                  >
                    <Link href="/billing">Suscribirme</Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl border bg-foreground" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold tracking-tight">House of Verlein</p>
                <p className="text-xs text-muted-foreground">Luxury subscription for beats</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-foreground">Términos</Link>
              <Link href="/privacy" className="hover:text-foreground">Privacidad</Link>
              <Link href="/contact" className="hover:text-foreground">Contacto</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-2xl border border-border bg-background/60 p-4"
      style={{
        boxShadow: "0 10px 40px rgb(var(--glow-3) / 0.06)",
      }}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium tracking-tight">{value}</p>
    </div>
  );
}

function StepCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card className="rounded-3xl border-border bg-card/60 p-6">
      <p className="font-serif text-xl tracking-tight">{title}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </Card>
  );
}

function FeatureCard({ title, value }: { title: string; value: string }) {
  return (
    <Card className="rounded-3xl border-border bg-background/60 p-6">
      <p className="text-sm font-medium">{title}</p>
      <p className="font-serif mt-2 text-2xl tracking-tight">{value}</p>
    </Card>
  );
}

function MiniPanel({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-4">
      <p className="text-sm font-medium tracking-tight">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}
