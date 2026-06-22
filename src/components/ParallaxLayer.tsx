"use client";

import { ReactNode } from "react";
import { useParallax } from "@/hooks/useParallax";

interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number;
  direction?: "vertical" | "horizontal";
  className?: string;
}

export default function ParallaxLayer({
  children,
  speed = 0.1,
  direction = "vertical",
  className = "",
}: ParallaxLayerProps) {
  const ref = useParallax<HTMLDivElement>({ speed, direction });

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
