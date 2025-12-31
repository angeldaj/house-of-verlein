"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { signIn } from "next-auth/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SignupPayload = {
  name?: string;
  email: string;
  password: string;
};

function normalizeError(message: unknown) {
  if (typeof message === "string" && message.trim()) return message;
  return "No pudimos crear tu cuenta. Intenta de nuevo.";
}

export default function SignupPage() {
  const router = useRouter();
  const params = useSearchParams();

  const next = useMemo(() => {
    const n = params.get("next");
    return n && n.startsWith("/") ? n : "/dashboard";
  }, [params]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    try {
      const payload: SignupPayload = {
        name: name.trim() ? name.trim() : undefined,
        email: email.trim(),
        password,
      };

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(normalizeError(data?.error));
        setPending(false);
        return;
      }

      // Auto-login con credenciales
      const signInRes = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });

      if (signInRes?.error) {
        // Cuenta creada, pero login falló: manda a login
        router.push(`/login?next=${encodeURIComponent(next)}`);
        return;
      }

      router.push(next);
    } catch (err: any) {
      setError(normalizeError(err?.message));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <Link href="/" className="flex items-center gap-3">
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
              <p className="text-xs text-muted-foreground">Create account</p>
            </div>
          </Link>

          <Button asChild variant="outline" className="rounded-full">
            <Link href="/login">Iniciar sesión</Link>
          </Button>
        </div>
      </header>

      <main className="relative overflow-hidden">
        {/* Fondo animado si ya agregaste la utility */}
        <div aria-hidden="true" className="lux-hero-bg" />

        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2 md:items-center md:py-16">
          {/* Columna izquierda: copy */}
          <div className="relative">
            <Badge
              variant="secondary"
              className="rounded-full border border-border bg-secondary/60 px-4 py-1 text-xs"
            >
              Membership Program
            </Badge>

            <h1 className="font-serif mt-5 text-4xl leading-[1.05] tracking-[-0.02em] md:text-5xl">
              Crea tu cuenta.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              Acceso a catálogo curado, descargas habilitadas con plan activo y drops semanales por correo.
            </p>

            <div className="mt-8 rounded-3xl border border-border bg-card/60 p-6">
              <p className="text-sm font-medium">Lo que desbloqueas</p>
              <Separator className="my-4" />
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Catálogo organizado por género, BPM y mood</li>
                <li>Descargas protegidas con membresía activa</li>
                <li>Selección semanal enviada por correo</li>
              </ul>
            </div>
          </div>

          {/* Columna derecha: form */}
          <Card className="relative rounded-3xl border-border bg-background/70 p-7 shadow-sm backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium tracking-tight">Crear cuenta</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Toma menos de un minuto.
                </p>
              </div>
              <span
                className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground"
                style={{
                  boxShadow: "0 12px 40px rgb(var(--glow-1) / 0.10)",
                }}
              >
                Verlein
              </span>
            </div>

            <Separator className="my-5" />

            {error ? (
              <div className="mb-4 rounded-2xl border border-border bg-secondary/40 p-4">
                <p className="text-sm">{error}</p>
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre (opcional)</Label>
                <Input
                  id="name"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className="rounded-2xl bg-background/70"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="rounded-2xl bg-background/70"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>

                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="rounded-2xl bg-background/70"
                />
              </div>

              <Button
                type="submit"
                disabled={pending}
                className="w-full rounded-full bg-[linear-gradient(135deg,rgb(var(--glow-1)/0.95),rgb(var(--glow-2)/0.80),rgb(var(--glow-3)/0.85))] text-white hover:opacity-95"
              >
                {pending ? "Creando..." : "Crear cuenta"}
              </Button>

              <p className="text-xs text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Link
                  href={`/login?next=${encodeURIComponent(next)}`}
                  className="underline hover:text-foreground"
                >
                  Inicia sesión
                </Link>
                .
              </p>
            </form>

            {/* línea couture */}
            <div
              className="pointer-events-none absolute inset-x-7 bottom-6 h-px opacity-60"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgb(var(--glow-3) / 0.65), rgb(var(--glow-1) / 0.55), transparent)",
              }}
            />
          </Card>
        </div>
      </main>
    </div>
  );
}
