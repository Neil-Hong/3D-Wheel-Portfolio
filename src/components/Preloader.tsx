"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            y: "-100%",
            duration: 1.2,
            ease: "power3.inOut",
            delay: 0.2,
            onComplete: () => {
              onComplete();
            },
          });
        },
      });

      tl.to(counterRef.current, {
        innerText: 100,
        duration: 1.5,
        ease: "power2.in",
        snap: { innerText: 1 },
      });
    });

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
    >
      <div className="flex flex-col items-center gap-8">
        <span
          ref={counterRef}
          className="font-mono text-8xl font-light tracking-tighter text-white"
        >
          0
        </span>
        <div className="h-px w-32 overflow-hidden bg-white/20">
          <div className="h-full w-full origin-left bg-white" />
        </div>
        <span className="text-xs font-light uppercase tracking-[0.5em] text-white/40">
          Loading
        </span>
      </div>
    </div>
  );
}
