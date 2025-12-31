export type Beat = {
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


export type SessionUser = {
  email: string;
  subscriptionStatus: "INACTIVE" | "ACTIVE" | "PAST_DUE" | "CANCELED";
} | null;
