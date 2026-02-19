"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  BadgeCheck,
  Filter,
  Music2,
  Search,
  SlidersHorizontal
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SignOutButton } from "@/components/auth/signout-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Beat, SessionUser } from "@/types";
import { BeatCard } from "./beat-card";

  const schema = z.object({
    q: z.string().optional(),
    genre: z.string().optional(),
    type: z.string().optional(),
    instrument: z.string().optional(),
    key: z.string().optional(),
    bpmMin: z.string().optional(),
    bpmMax: z.string().optional(),
    sort: z.string().optional(),
  });

  type FilterValues = z.infer<typeof schema>;

  function buildQuery(values: FilterValues) {
    const p = new URLSearchParams();

    const set = (k: string, v?: string) => {
      const val = (v ?? "").trim();
      if (val) p.set(k, val);
    };

    set("q", values.q);
    set("genre", values.genre);
    set("type", values.type);
    set("instrument", values.instrument);
    set("key", values.key);
    set("bpmMin", values.bpmMin);
    set("bpmMax", values.bpmMax);
    set("sort", values.sort);

    const s = p.toString();
    return s ? `?${s}` : "";
  }

  function ActiveFilters({ values }: { values: FilterValues }) {
    const items = useMemo(() => {
      const out: Array<{ k: string; v: string }> = [];
      const add = (k: string, v?: string) => {
        const val = (v ?? "").trim();
        if (val) out.push({ k, v: val });
      };
      add("Búsqueda", values.q);
      add("Género", values.genre);
      add("Tipo", values.type);
      add("Instrumento", values.instrument);
      add("Key", values.key);
      add("BPM min", values.bpmMin);
      add("BPM max", values.bpmMax);
      return out;
    }, [values]);

    if (items.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2">
        {items.map((it) => (
          <Badge key={`${it.k}:${it.v}`} variant="secondary" className="rounded-full">
            {it.k}: {it.v}
          </Badge>
        ))}
      </div>
    );
  }

    const ALL = "__all__";
    const EMPTY = "__empty__";

  function FilterPanel({
    form,
    options,
    onApply,
    onReset,
  }: {
    form: ReturnType<typeof useForm<FilterValues>>;
    options: {
      genres: string[];
      types: string[];
      instruments: string[];
      keys: string[];
    };
    onApply: () => void;
    onReset: () => void;
  }) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onApply)} className="space-y-4">
          <FormField
            control={form.control}
            name="q"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-muted-foreground">Buscar</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      placeholder="Título, mood, key..."
                      className="rounded-2xl bg-background/70 pl-9"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid gap-4">
            {/* GENRE */}
            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">Género</FormLabel>
                  <Select
                    value={field.value && field.value.trim() ? field.value : ALL}
                    onValueChange={(v) => field.onChange(v === ALL ? "" : v)}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-2xl bg-background/70">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value={ALL}>Todos</SelectItem>

                      {options.genres.length > 0 ? (
                        options.genres.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value={`${EMPTY}-genre`} disabled>
                          No hay géneros disponibles
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* TYPE */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">Tipo</FormLabel>
                  <Select
                    value={field.value && field.value.trim() ? field.value : ALL}
                    onValueChange={(v) => field.onChange(v === ALL ? "" : v)}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-2xl bg-background/70">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value={ALL}>Todos</SelectItem>

                      {options.types.length > 0 ? (
                        options.types.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value={`${EMPTY}-type`} disabled>
                          No hay tipos disponibles
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* INSTRUMENT */}
            <FormField
              control={form.control}
              name="instrument"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">Instrumento</FormLabel>
                  <Select
                    value={field.value && field.value.trim() ? field.value : ALL}
                    onValueChange={(v) => field.onChange(v === ALL ? "" : v)}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-2xl bg-background/70">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value={ALL}>Todos</SelectItem>

                      {options.instruments.length > 0 ? (
                        options.instruments.map((i) => (
                          <SelectItem key={i} value={i}>
                            {i}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value={`${EMPTY}-instrument`} disabled>
                          No hay instrumentos disponibles
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* KEY */}
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">Key</FormLabel>
                  <Select
                    value={field.value && field.value.trim() ? field.value : ALL}
                    onValueChange={(v) => field.onChange(v === ALL ? "" : v)}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-2xl bg-background/70">
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value={ALL}>Todas</SelectItem>

                      {options.keys.length > 0 ? (
                        options.keys.map((k) => (
                          <SelectItem key={k} value={k}>
                            {k}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value={`${EMPTY}-key`} disabled>
                          No hay keys disponibles
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="bpmMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">BPM min</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      inputMode="numeric"
                      placeholder="80"
                      className="rounded-2xl bg-background/70"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bpmMax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">BPM max</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      inputMode="numeric"
                      placeholder="180"
                      className="rounded-2xl bg-background/70"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="sort"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-muted-foreground">Orden</FormLabel>
                <Select value={field.value ?? "new"} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="rounded-2xl bg-background/70">
                      <SelectValue placeholder="Nuevo primero" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="new">Nuevo primero</SelectItem>
                    <SelectItem value="bpmAsc">BPM asc</SelectItem>
                    <SelectItem value="bpmDesc">BPM desc</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <div className="grid gap-2">
            <Button
              type="submit"
              className="rounded-full bg-[linear-gradient(135deg,rgb(var(--glow-1)/0.95),rgb(var(--glow-2)/0.80),rgb(var(--glow-3)/0.85))] text-white hover:opacity-95"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Aplicar filtros
            </Button>

            <Button type="button" variant="outline" className="rounded-full" onClick={onReset}>
              Limpiar
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  export default function ClientCatalog({
    sessionUser,
    filters,
    options,
    beats,
  }: {
    sessionUser: SessionUser;
    filters: {
      q: string;
      genre: string;
      type: string;
      instrument: string;
      key: string;
      bpmMin: string;
      bpmMax: string;
      sort: string;
    };
    options: {
      genres: string[];
      types: string[];
      instruments: string[];
      keys: string[];
    };
    beats: Beat[];
  }) {
    const router = useRouter();

    const canDownload = sessionUser?.subscriptionStatus === "ACTIVE";

    const form = useForm<FilterValues>({
      resolver: zodResolver(schema),
      defaultValues: filters,
      values: filters, // mantiene sincronizado con URL
    });

    const onApply = () => {
      const values = form.getValues();
      router.push(`/beats${buildQuery(values)}`);
    };

    const onReset = () => {
      form.reset({
        q: "",
        genre: "",
        type: "",
        instrument: "",
        key: "",
        bpmMin: "",
        bpmMax: "",
        sort: "new",
      });
      router.push("/beats");
    };

    const activeValues = form.getValues();

    return (
      <div className="min-h-screen">
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
            <Link href="/dashboard" className="flex items-center gap-3">
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
                <p className="text-xs text-muted-foreground">Catálogo</p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="hidden rounded-full md:inline-flex">
                <Music2 className="mr-2 h-4 w-4" />
                {beats.length} beats
              </Badge>

              {sessionUser ? (
                <Badge className="hidden rounded-full md:inline-flex" variant={canDownload ? "default" : "secondary"}>
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  {canDownload ? "Membresía activa" : "Acceso limitado"}
                </Badge>
              ) : (
                <Button asChild variant="outline" className="rounded-full hidden md:inline-flex">
                  <Link href="/login?next=/beats">Iniciar sesión</Link>
                </Button>
              )}

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="rounded-full md:hidden">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[92vw] sm:w-95 p-0">
                  <SheetHeader className="px-5 py-5">
                    <SheetTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filtros
                    </SheetTitle>
                  </SheetHeader>
                  <Separator />
                  <ScrollArea className="h-[calc(100vh-72px)] px-5 py-5">
                    <FilterPanel form={form} options={options} onApply={onApply} onReset={onReset} />
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              {sessionUser ? <SignOutButton /> : null}
            </div>
          </div>
        </header>

        <main className="relative overflow-hidden">
          <div aria-hidden="true" className="lux-hero-bg" />

          <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
              {/* Sidebar desktop */}
              <aside className="hidden lg:block">
                <div className="sticky top-23">
                  <Card className="rounded-3xl border-border bg-card/70 p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">Filtros</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Encuentra rápido.
                        </p>
                      </div>
                      <Badge variant="secondary" className="rounded-full">
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        {filters.sort === "new" ? "Nuevo" : filters.sort}
                      </Badge>
                    </div>

                    <Separator className="my-5" />

                    <FilterPanel form={form} options={options} onApply={onApply} onReset={onReset} />
                  </Card>
                </div>
              </aside>

              {/* Content */}
              <section>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Explorar</p>
                    <h1 className="font-serif mt-2 text-3xl tracking-tight">Catálogo</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Todos los beats disponibles para ti. ¿Qué mood buscas hoy?
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="rounded-full">
                      <Music2 className="mr-2 h-4 w-4" />
                      {beats.length} resultados
                    </Badge>
                  </div>
                </div>

                <div className="mt-4">
                  <ActiveFilters values={activeValues} />
                </div>

                <Separator className="my-6" />

                {beats.length === 0 ? (
                  <Card className="rounded-3xl border-border bg-card/70 p-8">
                    <p className="text-sm font-medium">Sin resultados</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Ajusta los filtros o limpia para ver más beats.
                    </p>
                    <div className="mt-4">
                      <Button variant="outline" className="rounded-full" onClick={onReset}>
                        Limpiar filtros
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <motion.div
                    layout
                    className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 overflow-y-scroll max-h-175"
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: {},
                      show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
                    }}
                  >
                    {beats.map((beat) => (
                      <BeatCard key={beat.id} beat={beat} canDownload={!!canDownload} />
                    ))}
                  </motion.div>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
    );
  }
