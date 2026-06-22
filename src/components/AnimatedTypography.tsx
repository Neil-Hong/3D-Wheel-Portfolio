"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface AnimatedTypographyProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  staggerAmount?: number;
}

export default function AnimatedTypography({
  text,
  as: Tag = "h1",
  className = "",
  delay = 0,
  staggerAmount = 0.03,
}: AnimatedTypographyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".animated-char",
        {
          y: 120,
          opacity: 0,
          rotateX: -40,
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          stagger: staggerAmount,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            toggleActions: "play none none reset",
          },
        }
      );
    });

    return () => ctx.revert();
  }, [delay, staggerAmount]);

  const chars = text.split("").map((char, i) => (
    <span
      key={i}
      className="animated-char inline-block"
      style={{ willChange: "transform, opacity" }}
    >
      {char === " " ? " " : char}
    </span>
  ));

  return (
    <Tag ref={containerRef as React.RefObject<HTMLHeadingElement>} className={`overflow-hidden ${className}`}>
      {chars}
    </Tag>
  );
}
