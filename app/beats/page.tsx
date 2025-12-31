import { auth } from "@/auth";
import { makeMockBeats } from "@/lib/mocks/beats";
import prisma from "@/lib/prisma";
import ClientCatalog from "./_components/client-catalog";

type SearchParams = Record<string, string | string[] | undefined>;

function asString(v: string | string[] | undefined) {
  if (!v) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

function asInt(v: string | string[] | undefined) {
  const s = asString(v);
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? Math.trunc(n) : undefined;
}

function uniqSorted(arr: Array<string | null>) {
  return Array.from(new Set(arr.filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b));
}

export default async function BeatsPage({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const session = await auth();
  const sp = await Promise.resolve(searchParams ?? {});

  const q = asString(sp.q)?.trim() || "";
  const genre = asString(sp.genre) ?? "";
  const type = asString(sp.type) ?? "";
  const instrument = asString(sp.instrument) ?? "";
  const key = asString(sp.key) ?? "";
  const bpmMin = asInt(sp.bpmMin);
  const bpmMax = asInt(sp.bpmMax);
  const sort = asString(sp.sort) ?? "new";

  // ✅ MOCK: /beats?mock=48  (solo dev)
  const mockCountRaw = asInt(sp.mock);
  const useMock = process.env.NODE_ENV !== "production" && !!mockCountRaw && mockCountRaw > 0;

  if (useMock) {
    const count = Math.min(Math.max(mockCountRaw!, 1), 200);
    let beats = makeMockBeats(count);

    // filtros en memoria (para que el UI sea realista)
    const qLower = q.toLowerCase();
    beats = beats.filter((b) => {
      if (q && !`${b.title} ${b.genre ?? ""} ${b.type ?? ""} ${b.instrument ?? ""} ${b.mood ?? ""} ${b.key ?? ""}`.toLowerCase().includes(qLower)) {
        return false;
      }
      if (genre && b.genre !== genre) return false;
      if (type && b.type !== type) return false;
      if (instrument && b.instrument !== instrument) return false;
      if (key && b.key !== key) return false;
      if (bpmMin && (b.bpm ?? 0) < bpmMin) return false;
      if (bpmMax && (b.bpm ?? 0) > bpmMax) return false;
      return true;
    });

    // orden
    if (sort === "bpmAsc") beats.sort((a, b) => (a.bpm ?? 0) - (b.bpm ?? 0));
    if (sort === "bpmDesc") beats.sort((a, b) => (b.bpm ?? 0) - (a.bpm ?? 0));
    // "new" ya viene en orden (creadoAt descend por construcción)

    return (
      <ClientCatalog
        sessionUser={
          session?.user?.id
            ? { email: session.user.email ?? "", subscriptionStatus: session.user.subscriptionStatus }
            : null
        }
        filters={{
          q,
          genre,
          type,
          instrument,
          key,
          bpmMin: bpmMin?.toString() ?? "",
          bpmMax: bpmMax?.toString() ?? "",
          sort,
        }}
        options={{
          genres: uniqSorted(beats.map((b) => b.genre)),
          types: uniqSorted(beats.map((b) => b.type)),
          instruments: uniqSorted(beats.map((b) => b.instrument)),
          keys: uniqSorted(beats.map((b) => b.key)),
        }}
        beats={beats}
      />
    );
  }

  // ---- REAL DATA (tu lógica prisma actual) ----
  // ... deja aquí tus findMany + distinct queries y retorna <CatalogClient />
  const beats = await prisma.beat.findMany({ take: 60 });

  return (
    <ClientCatalog
      sessionUser={
        session?.user?.id
          ? { email: session.user.email ?? "", subscriptionStatus: session.user.subscriptionStatus }
          : null
      }
      filters={{
        q,
        genre,
        type,
        instrument,
        key,
        bpmMin: bpmMin?.toString() ?? "",
        bpmMax: bpmMax?.toString() ?? "",
        sort,
      }}
      options={{ genres: [], types: [], instruments: [], keys: [] }}
      beats={beats.map((b: any) => ({
        id: b.id,
        title: b.title,
        bpm: b.bpm ?? null,
        genre: b.genre ?? null,
        type: b.type ?? null,
        instrument: b.instrument ?? null,
        key: b.key ?? null,
        mood: b.mood ?? null,
        previewUrl: b.previewUrl ?? null,
        createdAtISO: b.createdAt.toISOString(),
      }))}
    />
  );
}
