"use client";

import { useState, useEffect } from "react";
import { projects } from "@/data/projects";

export default function ProjectIndicators() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let raf: number;

    function detect() {
      const frames = document.querySelectorAll("[data-frame-index]");
      let closest = 0;
      let minDist = Infinity;
      const vh = window.innerHeight;

      frames.forEach((f) => {
        const rect = f.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - vh / 2);
        if (dist < minDist) {
          minDist = dist;
          closest = Number((f as HTMLElement).dataset.frameIndex) || 0;
        }
      });

      if (closest !== activeIndex) {
        setActiveIndex(closest);
      }
    }

    function loop() {
      detect();
      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [activeIndex]);

  return (
    <div className="pointer-events-none fixed right-8 top-1/2 z-50 -translate-y-1/2 mix-blend-difference">
      <div className="flex flex-col items-end gap-5">
        {projects.map((project, i) => {
          const isActive = i === activeIndex;
          const isNear = Math.abs(i - activeIndex) <= 1;

          return (
            <div
              key={project.slug}
              className="flex items-center gap-3 transition-all duration-500"
              style={{
                opacity: isNear ? 1 : 0.15,
                transform: `translateX(${isActive ? 8 : 0}px)`,
              }}
            >
              <span
                className={`text-xs font-light tracking-[0.15em] transition-all duration-500 ${
                  isActive ? "text-white" : "text-white/40"
                }`}
              >
                {project.title}
              </span>
              <div className="flex gap-[2px]">
                <div
                  className={`h-[2px] rounded-full transition-all duration-500 ${
                    isActive ? "w-8 bg-white" : "w-3 bg-white/25"
                  }`}
                />
                <div
                  className={`h-[2px] rounded-full transition-all duration-500 ${
                    isActive ? "w-4 bg-white/40" : "w-2 bg-white/10"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
