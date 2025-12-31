"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
  CreditCard,
  Download,
  Music2,
  User2,
  CalendarDays,
  Mail,
  ArrowUpRight,
  Sparkles,
  Settings2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Reveal, Stagger, Item } from "@/components/motion/reveal";

type MembershipStatus = "INACTIVE" | "ACTIVE" | "PAST_DUE" | "CANCELED";

type DashboardData = {
  user: {
    name: string | null;
    email: string;
    createdAtISO: string;
  };
  membership: {
    status: MembershipStatus;
    currentPeriodEndISO: string | null;
  };
  downloads: {
    total: number;
    recent: Array<{
      id: string;
      createdAtISO: string;
      beat: {
        id: string;
        title: string;
        bpm: number | null;
        genre: string | null;
        mood: string | null;
      };
    }>;
  };
};

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

function IconPill({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

function KpiCard({
  title,
  value,
  hint,
  icon: Icon,
  tone = "emerald",
}: {
  title: string;
  value: string;
  hint: string;
  icon: React.ElementType;
  tone?: "emerald" | "wine" | "gold";
}) {
  const glow =
    tone === "emerald"
      ? "rgb(var(--glow-1) / 0.14)"
      : tone === "wine"
      ? "rgb(var(--glow-2) / 0.14)"
      : "rgb(var(--glow-3) / 0.14)";

  return (
    <Card
      className="rounded-3xl border-border bg-card/70 p-6 shadow-sm"
      style={{ boxShadow: `0 22px 60px ${glow}` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="mt-2 font-serif text-4xl tracking-tight">{value}</p>
          <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
        </div>

        <div className="grid place-items-center rounded-2xl border border-border bg-background/60 p-3">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

export default function ClientDashboard({ data }: { data: DashboardData }) {
  const status = data.membership.status;
  const isActive = status === "ACTIVE";

  const renewDate = data.membership.currentPeriodEndISO
    ? format(new Date(data.membership.currentPeriodEndISO), "MMM d, yyyy")
    : null;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl border bg-foreground shadow-sm"
              style={{
                boxShadow:
                  "0 0 0 1px color-mix(in oklch, hsl(var(--border)) 70%, transparent), 0 14px 40px rgb(var(--glow-3) / 0.10)",
              }}
              aria-hidden="true"
            />
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight">House of Verlein</p>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={badgeVariant(status)} className="rounded-full">
              <span className="inline-flex items-center gap-2">
                <CreditCard className="h-3.5 w-3.5" />
                Membresía: {statusLabel(status)}
              </span>
            </Badge>

            <Button asChild variant="outline" className="rounded-full">
              <Link href="/beats" className="inline-flex items-center gap-2">
                <Music2 className="h-4 w-4" />
                Catálogo
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden">
        {/* Fondo animado existente (CSS) */}
        <div aria-hidden="true" className="lux-hero-bg" />

        <div className="mx-auto max-w-6xl px-4 py-10">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Overview</p>
                <h1 className="font-serif mt-2 text-4xl tracking-tight">
                  Hola{data.user.name ? `, ${data.user.name}` : ""}.
                </h1>
                <p className="mt-3 text-sm text-muted-foreground">
                  Cuenta, membresía y actividad reciente en un solo lugar.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <IconPill icon={User2} label={data.user.email} />
                <IconPill
                  icon={CalendarDays}
                  label={`Miembro desde ${format(new Date(data.user.createdAtISO), "MMM d, yyyy")}`}
                />
                <IconPill icon={Mail} label="Weekly drops" />
              </div>
            </div>
          </Reveal>

          <Separator className="my-8" />

          {/* KPIs */}
          <Stagger className="grid gap-4 md:grid-cols-3">
            <Item>
              <KpiCard
                title="Acceso"
                value={isActive ? "Activo" : "Limitado"}
                hint={isActive ? "Tu plan está vigente." : "Activa tu plan para descargar."}
                icon={Sparkles}
                tone="emerald"
              />
            </Item>

            <Item>
              <KpiCard
                title="Descargas"
                value={String(data.downloads.total)}
                hint="Total registrado en tu cuenta."
                icon={Download}
                tone="gold"
              />
            </Item>

            <Item>
              <KpiCard
                title="Renovación"
                value={renewDate ?? "N/A"}
                hint="Fecha estimada del próximo ciclo."
                icon={CalendarDays}
                tone="wine"
              />
            </Item>
          </Stagger>

          {/* Membership + Activity */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Reveal className="md:col-span-1">
              <Card className="rounded-3xl border-border bg-card/70 p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Membresía</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Estado: <span className="text-foreground">{statusLabel(status)}</span>
                      {renewDate ? (
                        <>
                          <br />
                          Próxima renovación: <span className="text-foreground">{renewDate}</span>
                        </>
                      ) : null}
                    </p>
                  </div>

                  <div className="grid place-items-center rounded-2xl border border-border bg-background/60 p-3">
                    <Settings2 className="h-5 w-5" />
                  </div>
                </div>

                <Separator className="my-5" />

                <div className="grid gap-2">
                  <Button
                    asChild
                    className="rounded-full bg-[linear-gradient(135deg,rgb(var(--glow-1)/0.95),rgb(var(--glow-2)/0.80),rgb(var(--glow-3)/0.85))] text-white hover:opacity-95"
                  >
                    <Link href="/billing" className="inline-flex items-center justify-center gap-2">
                      {isActive ? "Administrar plan" : "Activar membresía"}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="rounded-full">
                    <Link href="/beats" className="inline-flex items-center justify-center gap-2">
                      Explorar beats
                      <Music2 className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="mt-5 rounded-2xl border border-border bg-background/60 p-4">
                  <p className="text-xs text-muted-foreground">Nota</p>
                  <p className="mt-1 text-sm">
                    Los beats semanales se envían por correo a suscriptores activos.
                  </p>
                </div>
              </Card>
            </Reveal>

            <Reveal className="md:col-span-2">
              <Card className="rounded-3xl border-border bg-card/70 p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Actividad reciente</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Últimas descargas registradas.
                    </p>
                  </div>
                  <Badge className="rounded-full bg-[rgb(var(--glow-3))] text-foreground shadow-sm">
                    <span className="inline-flex items-center gap-2">
                      <Download className="h-3.5 w-3.5" />
                      {data.downloads.total} total
                    </span>
                  </Badge>
                </div>

                <Separator className="my-4" />

                {data.downloads.recent.length === 0 ? (
                  <div className="rounded-2xl border border-border bg-background/60 p-6">
                    <p className="text-sm">Aún no tienes descargas registradas.</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Cuando habilitemos la descarga real, cada entrega quedará guardada aquí.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-border bg-background/60">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Beat</TableHead>
                          <TableHead className="hidden md:table-cell">Género</TableHead>
                          <TableHead className="hidden md:table-cell">BPM</TableHead>
                          <TableHead className="text-right">Fecha</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.downloads.recent.map((d) => (
                          <TableRow key={d.id}>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{d.beat.title}</span>
                                <span className="text-xs text-muted-foreground">
                                  {d.beat.mood ?? "N/A"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{d.beat.genre ?? "N/A"}</TableCell>
                            <TableCell className="hidden md:table-cell">{d.beat.bpm ?? "N/A"}</TableCell>
                            <TableCell className="text-right text-sm text-muted-foreground">
                              {format(new Date(d.createdAtISO), "MMM d, yyyy")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </Card>
            </Reveal>
          </div>
        </div>
      </main>
    </div>
  );
}
