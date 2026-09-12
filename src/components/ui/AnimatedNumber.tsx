"use client";

import { animate, useMotionValue, useTransform, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function AnimatedNumber({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const motionVal = useMotionValue(value);
  const rounded = useTransform(motionVal, (v) => Math.round(v).toLocaleString("fr-FR"));
  const [display, setDisplay] = useState(() => Math.round(value).toLocaleString("fr-FR"));
  const [pulse, setPulse] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    });
    if (value !== prev.current) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 500);
      prev.current = value;
      return () => {
        controls.stop();
        clearTimeout(t);
      };
    }
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => unsub();
  }, [rounded]);

  return (
    <motion.span
      className={className}
      animate={pulse ? { scale: [1, 1.08, 1], color: ["#e8cd8f", "#f7f2e9"] } : {}}
      transition={{ duration: 0.5 }}
    >
      {display}
      {suffix}
    </motion.span>
  );
}
