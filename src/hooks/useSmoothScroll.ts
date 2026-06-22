import { useEffect, useRef, useCallback } from "react";
import Lenis from "@studio-freight/lenis";

export function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }

    rafRef.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
    };
  }, []);

  const scrollTo = useCallback((target: string | number) => {
    if (typeof target === "string") {
      const el = document.querySelector(target);
      if (el) lenisRef.current?.scrollTo(el as HTMLElement);
    } else {
      lenisRef.current?.scrollTo(target);
    }
  }, []);

  return { scrollTo, lenis: lenisRef };
}
