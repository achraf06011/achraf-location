"use client";

import { useEffect, useState } from "react";

function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  return { h, m, s, remaining };
}

export default function Countdown({ seconds, className }: { seconds: number; className?: string }) {
  const { h, m, s } = useCountdown(seconds);
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className={className}>
      <span className="font-display tabular-nums">
        {pad(h)}:{pad(m)}:{pad(s)}
      </span>
    </div>
  );
}
