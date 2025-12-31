import { Card } from "./ui/card";

export const StepCard = ({ title, desc }: { title: string; desc: string }) => {
  return (
    <Card className="rounded-3xl border-border bg-card/60 p-6">
      <p className="font-serif text-xl tracking-tight">{title}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </Card>
  );
}
