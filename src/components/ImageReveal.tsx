"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export default function ImageReveal({
  src,
  alt,
  className = "",
  aspectRatio = "16/9",
}: ImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlayRef.current,
        { scaleX: 1 },
        {
          scaleX: 0,
          transformOrigin: "right",
          duration: 1.4,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            end: "top 40%",
            scrub: 0.8,
          },
        }
      );

      gsap.fromTo(
        imageRef.current,
        { scale: 1.3 },
        {
          scale: 1,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            end: "top 40%",
            scrub: 0.8,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      <div
        ref={imageRef}
        aria-label={alt}
        className="h-full w-full bg-cover bg-center bg-no-repeat"
        role="img"
        style={{ backgroundImage: `url(${src})` }}
      />
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black"
      />
    </div>
  );
}
