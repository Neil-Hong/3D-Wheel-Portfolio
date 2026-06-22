import { useRef } from "react";
import { useAnimationFrame } from "./useAnimationFrame";

interface ParallaxOptions {
  speed?: number;
  direction?: "vertical" | "horizontal";
}

export function useParallax<T extends HTMLElement>(
  options: ParallaxOptions = {}
) {
  const { speed = 0.1, direction = "vertical" } = options;
  const ref = useRef<T>(null);
  const currentY = useRef(0);
  const targetY = useRef(0);

  useAnimationFrame(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const viewportCenter = window.innerHeight / 2;
    targetY.current = (center - viewportCenter) * speed;

    currentY.current += (targetY.current - currentY.current) * 0.08;
    const transform =
      direction === "vertical"
        ? `translate3d(0, ${currentY.current}px, 0)`
        : `translate3d(${currentY.current}px, 0, 0)`;
    el.style.transform = transform;
  });

  return ref;
}
