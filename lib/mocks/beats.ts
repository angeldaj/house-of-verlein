export type MockBeat = {
  id: string;
  title: string;
  bpm: number | null;
  genre: string | null;
  type: string | null;
  instrument: string | null;
  key: string | null;
  mood: string | null;
  previewUrl: string | null;
  createdAtISO: string;
};

export function makeMockBeats(count: number) {
  const genres = ["Trap", "Reggaeton", "Drill", "R&B", "Afro", "House"];
  const types = ["Premium", "Exclusive", "Standard"];
  const instruments = ["Piano", "Guitar", "Synth", "Strings", "808", "Pads"];
  const keys = ["Am", "Bm", "Cm", "Dm", "Em", "Fm", "Gm", "A#m"];
  const moods = ["Dark", "Smooth", "Aggressive", "Chill", "Cinematic", "Bounce"];

  const pick = (arr: string[], i: number) => arr[i % arr.length];
  const bpm = (i: number) => 80 + ((i * 7) % 91); // 80..171
  const pad = (n: number) => String(n).padStart(2, "0");

  const now = Date.now();

  return Array.from({ length: count }, (_, i): MockBeat => {
    return {
      id: `mock_${i + 1}`,
      title: `Verlein Drop ${pad(i + 1)}`,
      bpm: bpm(i),
      genre: pick(genres, i),
      type: pick(types, i),
      instrument: pick(instruments, i),
      key: pick(keys, i),
      mood: pick(moods, i),
      previewUrl: null,
      createdAtISO: new Date(now - i * 86_400_000).toISOString(),
    };
  });
}
