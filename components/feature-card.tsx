import { Card } from "./ui/card";

export const FeatureCard = ({ title, value }: { title: string; value: string }) => {
  return (
    <Card className="rounded-3xl border-border bg-background/60 p-6">
      <p className="text-sm font-medium">{title}</p>
      <p className="font-serif mt-2 text-2xl tracking-tight">{value}</p>
    </Card>
  );
}
