import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

export function useMagnetic<T extends HTMLElement>(intensity = 0.3) {
  const ref = useRef<T>(null);
  const boundsRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const updateBounds = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      boundsRef.current = {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      };
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    updateBounds();
    window.addEventListener("resize", updateBounds);

    function onMouseMove(e: MouseEvent) {
      const { x, y, width, height } = boundsRef.current;
      const dx = (e.clientX - x - width / 2) * intensity;
      const dy = (e.clientY - y - height / 2) * intensity;
      gsap.to(el, { x: dx, y: dy, duration: 0.7, ease: "power2.out" });
    }

    function onMouseLeave() {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.4)",
      });
    }

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", updateBounds);
    };
  }, [intensity, updateBounds]);

  return ref;
}
