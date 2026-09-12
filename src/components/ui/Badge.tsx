import { cn } from "@/lib/cn";

export default function Badge({
  children,
  tone = "gold",
  className,
}: {
  children: React.ReactNode;
  tone?: "gold" | "clay" | "paper" | "green";
  className?: string;
}) {
  const tones = {
    gold: "bg-gold/15 text-gold-light border-gold/30",
    clay: "bg-clay/20 text-clay-light border-clay/40",
    paper: "bg-paper/10 text-paper border-paper/20",
    green: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
