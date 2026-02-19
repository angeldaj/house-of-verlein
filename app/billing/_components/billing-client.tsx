"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowLeft, BadgeCheck, CreditCard, ExternalLink, Sparkles } from "lucide-react";
// import { startCheckoutAction, openCustomerPortalAction } from "@/app/actions/billing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SignOutButton } from "@/components/auth/signout-button";

type MembershipStatus = "INACTIVE" | "ACTIVE" | "PAST_DUE" | "CANCELED";

function statusLabel(status: MembershipStatus) {
  switch (status) {
    case "ACTIVE":
      return "Activa";
    case "PAST_DUE":
      return "Pago pendiente";
    case "CANCELED":
      return "Cancelada";
    default:
      return "Inactiva";
  }
}

function badgeVariant(status: MembershipStatus): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "ACTIVE":
      return "default";
    case "PAST_DUE":
      return "destructive";
    case "CANCELED":
      return "outline";
    default:
      return "secondary";
  }
}

export default function BillingClient({
  data,
}: {
  data: {
    name: string | null;
    email: string;
    status: MembershipStatus;
    currentPeriodEndISO: string | null;
  };
}) {
  const isActive = data.status === "ACTIVE";
  const renewDate = data.currentPeriodEndISO ? format(new Date(data.currentPeriodEndISO), "MMM d, yyyy") : null;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/beats" className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Catálogo
              </Link>
            </Button>

            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight">Billing</p>
              <p className="text-xs text-muted-foreground">Membresía y pagos</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={badgeVariant(data.status)} className="rounded-full">
              <span className="inline-flex items-center gap-2">
                <CreditCard className="h-3.5 w-3.5" />
                {statusLabel(data.status)}
              </span>
            </Badge>

            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden">
        <div aria-hidden="true" className="lux-hero-bg" />

        <div className="mx-auto max-w-6xl px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="flex flex-wrap items-end justify-between gap-4"
          >
            <div>
              <p className="text-xs text-muted-foreground">Cuenta</p>
              <h1 className="font-serif mt-2 text-4xl tracking-tight">Membresía</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                {data.name ? data.name : data.email}
                {renewDate ? (
                  <>
                    {" "}
                    • Próxima renovación: <span className="text-foreground">{renewDate}</span>
                  </>
                ) : null}
              </p>
            </div>

            <Badge className="rounded-full shadow-sm p-2 bg-[linear-gradient(135deg,rgb(var(--glow-1)/0.95),rgb(var(--glow-2)/0.80),rgb(var(--glow-3)/0.85))] text-white">
                <Sparkles className="h-4 w-4" />
                Plan mensual
            </Badge>
          </motion.div>

          <Separator className="my-8" />

          <div className="grid gap-4 md:grid-cols-3">
            {/* Plan */}
            <motion.div
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
              className="md:col-span-2"
            >
              <Card className="rounded-3xl border-border bg-card/70 p-7 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">House Plan</p>
                    <p className="font-serif mt-2 text-5xl tracking-tight">
                      $100<span className="ml-2 text-base text-muted-foreground">/mes</span>
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Acceso al catálogo, descargas mientras el plan esté activo y drops semanales por correo.
                    </p>
                  </div>

                  {isActive ? (
                    <Badge className="rounded-full bg-[rgb(var(--glow-1))] text-white shadow-sm">
                      <span className="inline-flex items-center gap-2">
                        <BadgeCheck className="h-4 w-4" />
                        Activo
                      </span>
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="rounded-full">
                      Disponible
                    </Badge>
                  )}
                </div>

                <Separator className="my-6" />

                <ul className="space-y-2 text-sm text-foreground/90">
                  <li>Acceso completo al catálogo</li>
                  <li>Descargas protegidas por suscripción</li>
                  <li>Entrega semanal por email</li>
                  <li>Soporte básico</li>
                </ul>

                <div className="mt-7 flex flex-col gap-2">
                  {!isActive ? (
                    <form action={() => console.log("start")} className="w-full">
                      <Button
                        type="submit"
                        className="w-full rounded-full bg-[linear-gradient(135deg,rgb(var(--glow-1)/0.95),rgb(var(--glow-2)/0.80),rgb(var(--glow-3)/0.85))] text-white hover:opacity-95"
                      >
                        Suscribirme
                      </Button>
                    </form>
                  ) : (
                    <form action={() => console.log("start")} className="w-full">
                      <Button
                        type="submit"
                        className="w-full rounded-full bg-[linear-gradient(135deg,rgb(var(--glow-1)/0.95),rgb(var(--glow-2)/0.80),rgb(var(--glow-3)/0.85))] text-white hover:opacity-95"
                      >
                        Administrar plan
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  )}

                  <Button asChild variant="outline" className="w-full rounded-full">
                    <Link href="/dashboard">Ver dashboard</Link>
                  </Button>
                </div>

                <p className="mt-4 text-xs text-muted-foreground">
                  Por favor, leer terminos y condiciones para su mayor entendimiento y claridad.
                </p>
              </Card>
            </motion.div>

            {/* Resumen */}
            <motion.div
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
            >
              <Card className="rounded-3xl border-border bg-card/70 p-6 shadow-sm">
                <p className="text-sm font-medium">Resumen</p>
                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="rounded-2xl border border-border bg-background/60 p-4">
                    <p className="text-xs text-muted-foreground">Estado</p>
                    <p className="mt-1 text-sm">{statusLabel(data.status)}</p>
                  </div>

                  <div className="rounded-2xl border border-border bg-background/60 p-4">
                    <p className="text-xs text-muted-foreground">Renovación</p>
                    <p className="mt-1 text-sm">{renewDate ?? "No disponible"}</p>
                  </div>

                  <div className="rounded-2xl border border-border bg-background/60 p-4">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="mt-1 text-sm">{data.email}</p>
                  </div>
                </div>

                <Separator className="my-5" />

                <Button asChild variant="outline" className="w-full rounded-full">
                  <Link href="/beats">Volver al catálogo</Link>
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
