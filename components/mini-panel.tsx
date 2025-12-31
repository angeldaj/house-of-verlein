export const MiniPanel = ({ title, desc }: { title: string; desc: string }) => {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-4">
      <p className="text-sm font-medium tracking-tight">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}
