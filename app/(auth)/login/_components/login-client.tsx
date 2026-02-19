"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

function getSafeNext(nextParam: string | null) {
  if (!nextParam) return "/dashboard";
  if (!nextParam.startsWith("/")) return "/dashboard";
  return nextParam;
}

const schema = z.object({
  email: z.string(),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
});

type FormValues = z.infer<typeof schema>;

export default function LoginClient() {
  const router = useRouter();
  const params = useSearchParams();
  const next = useMemo(() => getSafeNext(params.get("next")), [params]);

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const errorParam = params.get("error");

  const paramErrorMessage = useMemo(() => {
    if (!errorParam) return null;
    if (errorParam === "CredentialsSignin") return "Email o contraseña incorrectos.";
    return "No pudimos iniciar sesión. Intenta de nuevo.";
  }, [errorParam]);

  const errorMessage = serverError ?? paramErrorMessage;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const pending = form.formState.isSubmitting;


  async function onSubmit(values: FormValues) {
  setServerError(null);

  const res = await signIn("credentials", {
    email: values.email.trim(),
    password: values.password,
    redirect: false,
  });

  if (res?.error) {
    setServerError("Email o contraseña incorrectos.");
    return;
  }

  router.push(next);
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
              <p className="text-xs text-muted-foreground">Sign in</p>
            </div>
          </Link>

          <Button asChild variant="outline" className="rounded-full">
            <Link href="/signup">Crear cuenta</Link>
          </Button>
        </div>
      </header>

      <main className="relative overflow-hidden">
        {/* Fondo animado si ya tienes la utility */}
        <div aria-hidden="true" className="lux-hero-bg" />

        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2 md:items-center md:py-16">
          {/* Copy */}
          <div className="relative">
            <Badge
              variant="secondary"
              className="rounded-full border border-border bg-secondary/60 px-4 py-1 text-xs"
            >
              Welcome back
            </Badge>

            <h1 className="font-serif mt-5 text-4xl leading-[1.05] tracking-[-0.02em] md:text-5xl">
              Inicia sesión.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              Accede a tu cuenta, revisa tu membresía y encuentra tus beats descargados.
            </p>

            <div className="mt-8 rounded-3xl border border-border bg-card/60 p-6">
              <p className="text-sm font-medium">Acceso rápido</p>
              <Separator className="my-4" />
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Dashboard con estado de membresía</li>
                <li>Historial de beats descargados</li>
                <li>Weekly drops por email</li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <Card className="relative rounded-3xl border-border bg-background/70 p-7 shadow-sm backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium tracking-tight">Iniciar sesión</p>
                <p className="mt-1 text-xs text-muted-foreground">Usa tu email y contraseña.</p>
              </div>
              <span
                className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground"
                style={{ boxShadow: "0 12px 40px rgb(var(--glow-1) / 0.10)" }}
              >
                Verlein
              </span>
            </div>

            <Separator className="my-5" />

            {errorMessage ? (
              <div className="mb-4 rounded-2xl border border-border bg-secondary/40 p-4">
                <p className="text-sm">{errorMessage}</p>
              </div>
            ) : null}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="tu@email.com"
                          autoComplete="email"
                          className="rounded-2xl bg-background/70"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Contraseña</FormLabel>
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? "Ocultar" : "Mostrar"}
                        </button>
                      </div>

                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Tu contraseña"
                          autoComplete="current-password"
                          className="rounded-2xl bg-background/70"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={pending}
                  className="w-full rounded-full bg-[linear-gradient(135deg,rgb(var(--glow-1)/0.95),rgb(var(--glow-2)/0.80),rgb(var(--glow-3)/0.85))] text-white hover:opacity-95"
                >
                  {pending ? "Entrando..." : "Iniciar sesión"}
                </Button>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                  <p>
                    ¿No tienes cuenta?{" "}
                    <Link
                      href={`/signup?next=${encodeURIComponent(next)}`}
                      className="underline hover:text-foreground"
                    >
                      Crea una aquí
                    </Link>
                    .
                  </p>
                  <span className="opacity-70">Olvidé mi contraseña</span>
                </div>
              </form>
            </Form>

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
