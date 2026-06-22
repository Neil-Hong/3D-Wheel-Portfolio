"use client";

import Link from "next/link";
import { CSSProperties } from "react";
import { motion } from "framer-motion";
import { Project } from "@/types";
import MagneticButton from "./MagneticButton";

interface ProjectCardProps {
  project: Project;
  index: number;
  isActive: boolean;
  style: CSSProperties;
}

const textEase = [0.22, 1, 0.36, 1] as const;
const SURFACE_SLICES = 34;

export default function ProjectCard({
  project,
  index,
  isActive,
  style,
}: ProjectCardProps) {
  return (
    <section
      id={project.slug}
      data-frame-index={index}
      className="frame-section absolute left-1/2 top-1/2 h-[72vh] min-h-[540px] w-[82vw] max-w-[1460px]"
      style={{
        ...style,
        transformStyle: "preserve-3d",
        transformOrigin: "50% 50%",
        transition:
          "transform 120ms linear, opacity 180ms ease-out, filter 180ms ease-out",
        willChange: "transform, opacity",
      }}
    >
      <article
        className="group relative h-full w-full overflow-hidden bg-[#151515] shadow-[0_32px_110px_rgba(0,0,0,0.38)]"
        style={{ perspective: "980px", transformStyle: "preserve-3d" }}
      >
        <motion.div
          className="absolute inset-[-1.5%] overflow-hidden"
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            scale: isActive ? 1.025 : 1.04,
          }}
          transition={{ duration: 0.9, ease: textEase }}
        >
          {Array.from({ length: SURFACE_SLICES }).map((_, sliceIndex) => {
            const sliceHeight = 100 / SURFACE_SLICES;
            const progress = sliceIndex / (SURFACE_SLICES - 1);
            const center = progress - 0.5;
            const bend = center * 2;
            const edge = Math.abs(bend);

            return (
              <span
                aria-hidden="true"
                key={sliceIndex}
                className="absolute left-[-4%] w-[108%] bg-cover bg-center"
                style={{
                  top: `${sliceIndex * sliceHeight}%`,
                  height: `${sliceHeight + 0.62}%`,
                  backgroundImage: `url(${project.image})`,
                  backgroundSize: `100% ${SURFACE_SLICES * 100}%`,
                  backgroundPosition: `center ${progress * 100}%`,
                  filter: `brightness(${(1 - edge * 0.1).toFixed(3)})`,
                  transform: [
                    `translateZ(${(-edge * 54).toFixed(2)}px)`,
                    `rotateX(${(-bend * 7.4).toFixed(2)}deg)`,
                    "scaleY(1.052)",
                  ].join(" "),
                  transformOrigin: "50% 50%",
                  backfaceVisibility: "hidden",
                  willChange: "transform",
                }}
              />
            );
          })}
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(0,0,0,0.18)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-black/12 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-black/14 to-transparent" />

        <div className="absolute left-1/2 top-[50%] z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center">
          <div style={{ transform: "rotateZ(7deg)" }}>
            <motion.p
              animate={{
                opacity: isActive ? 1 : 0,
                y: isActive ? 0 : 18,
                filter: isActive ? "blur(0px)" : "blur(8px)",
              }}
              transition={{ duration: 0.55, ease: textEase }}
              className="mb-7 text-[clamp(0.92rem,0.98vw,1.28rem)] font-extrabold leading-none text-white"
            >
              {project.category}
            </motion.p>
            <span className="block overflow-hidden pb-[0.05em]">
              <motion.h2
                animate={{
                  y: isActive ? 0 : "112%",
                  opacity: isActive ? 1 : 0.25,
                  filter: isActive ? "blur(0px)" : "blur(8px)",
                }}
                transition={{ duration: 0.78, ease: textEase }}
                className="font-serif text-[clamp(4.7rem,8.6vw,11.8rem)] font-medium leading-[0.72] tracking-[-0.09em] text-white"
              >
                {project.title}
              </motion.h2>
            </span>
          </div>
        </div>

        <motion.div
          animate={{
            opacity: isActive ? 1 : 0,
            y: isActive ? 0 : 28,
            scale: isActive ? 1 : 0.88,
          }}
          transition={{
            duration: 0.62,
            delay: isActive ? 0.08 : 0,
            ease: textEase,
          }}
          className="absolute left-1/2 top-[65%] z-20 -translate-x-1/2 -translate-y-1/2"
        >
          <div style={{ transform: "rotateZ(7deg)" }}>
            <Link href={`/project/${project.slug}`} aria-label={`Open ${project.title}`}>
              <MagneticButton className="h-[clamp(4rem,4.9vw,5.9rem)] w-[clamp(4rem,4.9vw,5.9rem)] rounded-full bg-white text-[clamp(1.6rem,2vw,2.4rem)] leading-none text-black shadow-[0_18px_80px_rgba(0,0,0,0.18)] transition duration-500 group-hover:scale-105 group-hover:bg-black group-hover:text-white">
                {"\u2192"}
              </MagneticButton>
            </Link>
          </div>
        </motion.div>
      </article>
    </section>
  );
}
