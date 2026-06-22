"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";

export default function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div className="fixed bottom-8 right-10 z-50 flex items-center gap-4 mix-blend-difference">
      <span className="font-mono text-xs text-white/50">
        {Math.round(progress * 100).toString().padStart(2, "0")}
      </span>
      <div className="h-px w-24 overflow-hidden bg-white/10">
        <div
          className="h-full bg-white transition-none"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
