import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Beat } from "@/types";
import { motion } from "framer-motion";
import { Download, Lock, Play } from "lucide-react";

function Visualizer() {
  // alturas base “visuales” (solo para dar variedad)
  const bars = [0.55, 0.75, 0.95, 0.65, 1.0, 0.8, 0.9, 0.6, 0.85, 0.58, 0.92, 0.78];

  return (
    <div className="h-9 w-27 overflow-hidden rounded-2xl border border-border bg-background/50 px-3 py-2">
      <div className="flex h-full items-end gap-0.75">
        {bars.map((s, i) => (
          <motion.span
            key={i}
            className="w-1 origin-bottom rounded-full bg-foreground/70"
            style={{ height: "100%" }} // la barra ocupa el alto del contenedor
            animate={{ scaleY: [s, Math.max(0.3, s - 0.35), Math.min(1.1, s + 0.25), s] }}
            transition={{
              duration: 1.7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.04,
            }}
          />
        ))}
      </div>
    </div>
  );
}
export const BeatCard = ({ beat, canDownload }: { beat: Beat; canDownload: boolean }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.42, ease: "easeOut" }}
      whileHover={{ y: -1 }}
    >
      <Card className="rounded-3xl border-border bg-card/55 p-4 shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-serif text-[17px] leading-tight tracking-tight truncate">
              {beat.title}
            </p>

            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground truncate">
              {beat.genre ?? "—"}
              {beat.type ? ` • ${beat.type}` : ""}
              {beat.instrument ? ` • ${beat.instrument}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-[11px]">
              {beat.bpm ? `${beat.bpm} BPM` : "BPM —"}
            </Badge>
          </div>
        </div>

        {/* Tags minimal */}
        <div className="mt-3 flex flex-wrap gap-2">
          {beat.mood ? (
            <span className="rounded-full border border-border bg-background/50 px-2.5 py-1 text-[11px] text-muted-foreground">
              {beat.mood}
            </span>
          ) : null}
          {beat.key ? (
            <span className="rounded-full border border-border bg-background/50 px-2.5 py-1 text-[11px] text-muted-foreground">
              {beat.key}
            </span>
          ) : null}
        </div>

        {/* Visualizer */}
        <div className="mt-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] text-muted-foreground">Preview</p>
            <p className="text-[11px] text-muted-foreground">0:34 / 2:12</p>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <Visualizer />
            {/* Progreso sutil */}
            <div className="h-1.5 flex-1 rounded-full bg-secondary">
              <div className="h-1.5 w-[38%] rounded-full bg-foreground/70" />
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="rounded-full text-[12px] h-9">
            <Play className="mr-2 h-4 w-4" />
            Preview
          </Button>

          <Button
            className="rounded-full text-[12px] h-9"
            disabled={!canDownload}
            title={!canDownload ? "Activa tu membresía para descargar" : "Descargar"}
          >
            {canDownload ? (
              <Download className="mr-2 h-4 w-4" />
            ) : (
              <Lock className="mr-2 h-4 w-4" />
            )}
            Descargar
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
