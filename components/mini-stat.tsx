export const MiniStat = ({ label, value }: { label: string; value: string }) => {
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
