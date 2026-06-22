import { useState, useRef } from "react";
import { useAnimationFrame } from "./useAnimationFrame";

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const currentRef = useRef(0);

  useAnimationFrame(() => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (h <= 0) return;
    const target =
      window.scrollY / h || window.pageYOffset / h || 0;
    currentRef.current += (target - currentRef.current) * 0.1;
    setProgress(currentRef.current);
  });

  return progress;
}
