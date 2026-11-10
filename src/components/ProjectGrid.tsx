"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { projects } from "@/data/projects";
import { prefersReducedMotion } from "@/lib/motion";
import { createProgressStore } from "@/lib/progress-store";
import WebGLBoundary from "./WebGLBoundary";

const ProjectWheel3D = dynamic(() => import("./ProjectWheel3D"), {
  ssr: false,
});

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function ProjectIntroTitle({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <>
      {words.map((word, wordIndex) => (
        <span
          className="projects-index-title-word"
          key={`${word}-${wordIndex}`}
        >
          {word.split("").map((letter, letterIndex) => (
            <span
              aria-hidden="true"
              className="projects-index-title-letter"
              key={`${letter}-${letterIndex}`}
            >
              {letter}
            </span>
          ))}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </>
  );
}

function AnimatedProjectTitle({
  category,
  slug,
  title,
}: {
  category: string;
  slug: string;
  title: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) {
      return;
    }

    const context = gsap.context(() => {
      const letters = gsap.utils.toArray<HTMLElement>(".project-title-letter");
      const button = root.querySelector<HTMLElement>(".project-open-button");
      const categoryEl = root.querySelector<HTMLElement>(".project-title-category");

      gsap.set([categoryEl, button], { autoAlpha: 0, y: 18 });
      gsap.set(letters, {
        autoAlpha: 0,
        yPercent: 118,
        rotationX: -86,
      });

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      timeline
        .to(categoryEl, { autoAlpha: 1, y: 0, duration: 0.42 }, 0.04)
        .to(
          letters,
          {
            autoAlpha: 1,
            yPercent: 0,
            rotationX: 0,
            duration: 0.78,
            stagger: 0.026,
          },
          0.04
        )
        .to(button, { autoAlpha: 1, y: 0, duration: 0.42 }, 0.46);
    }, root);

    return () => context.revert();
  }, [category, title]);

  const words = title.split(" ");

  return (
    <div
      ref={rootRef}
      className="project-active-overlay pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
    >
      <div className="project-active-heading pointer-events-none -mt-[1.2vh] text-center">
        <p className="project-title-category mb-[clamp(0.72rem,0.92vw,1.22rem)] text-[clamp(0.92rem,1.02vw,1.28rem)] font-extrabold leading-none text-white">
          {category}
        </p>
        <h2
          className="project-active-title text-[clamp(5.35rem,9.4vw,12.9rem)] font-normal leading-[0.7] tracking-[-0.038em] text-white"
          style={{ fontFamily: "Dahlia, Georgia, 'Times New Roman', serif" }}
        >
          {words.map((word, wordIndex) => (
            <span className="project-title-word" key={`${word}-${wordIndex}`}>
              {word.split("").map((letter, letterIndex) => (
                <span
                  aria-hidden="true"
                  className="project-title-letter"
                  key={`${letter}-${letterIndex}`}
                >
                  {letter}
                </span>
              ))}
            </span>
          ))}
          <span className="sr-only">{title}</span>
        </h2>
      </div>
      <Link
        href={`/project/${slug}`}
        aria-label={`Open ${title}`}
        className="project-open-link pointer-events-auto absolute left-1/2 top-[64.2%] z-50 -translate-x-1/2 -translate-y-1/2"
      >
        <span className="project-open-button inline-flex h-[clamp(4rem,4.9vw,5.9rem)] w-[clamp(4rem,4.9vw,5.9rem)] items-center justify-center rounded-full text-[clamp(1.6rem,2vw,2.4rem)] leading-none">
          <span className="project-open-arrow" aria-hidden="true">
            <span className="project-open-arrow-default">{"\u2192"}</span>
            <span className="project-open-arrow-hover">{"\u2192"}</span>
          </span>
        </span>
      </Link>
    </div>
  );
}

export default function ProjectGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  // Scroll progress changes every frame; keep it out of React state so only
  // the active project index triggers a re-render.
  const [progress] = useState(() => createProgressStore(0));
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      return;
    }

    const context = gsap.context(() => {
      const introLetters = section.querySelectorAll(
        ".projects-index-title-letter",
      );
      const introKicker = section.querySelector(".projects-index-kicker");

      gsap.set(introKicker, { autoAlpha: 0, y: 14 });
      gsap.set(introLetters, {
        autoAlpha: 0,
        yPercent: 112,
        rotationX: -70,
      });

      const entrance = gsap.timeline();

      entrance
        .fromTo(
          section,
          { xPercent: 100 },
          {
            xPercent: 0,
            duration: 0.82,
            ease: "power4.inOut",
          },
          0,
        )
        .to(
          introLetters,
          {
            autoAlpha: 1,
            yPercent: 0,
            rotationX: 0,
            duration: 0.78,
            stagger: 0.024,
            ease: "power3.out",
          },
          0.74,
        )
        .to(
          introKicker,
          { autoAlpha: 1, y: 0, duration: 0.36, ease: "power3.out" },
          0.72,
        );
    }, section);

    return () => context.revert();
  }, []);

  useEffect(() => {
    let raf = 0;

    function updateProgress() {
      const section = sectionRef.current;
      if (!section) {
        return;
      }

      const sectionTop = section.offsetTop;
      const scrollable = section.offsetHeight - window.innerHeight;
      const maxProgress = projects.length - 1;
      const localScroll = window.scrollY - sectionTop;
      const nextProgress =
        scrollable > 0 ? (localScroll / scrollable) * maxProgress : 0;
      const clamped = clamp(nextProgress, 0, maxProgress);

      if (Math.abs(progress.get() - clamped) < 0.001) {
        return;
      }

      progress.set(clamped);

      const scrollProgress = clamped;
      const activeIndex = clamp(Math.round(scrollProgress), 0, maxProgress);
      // The overlay title follows the active panel around the wheel.
      const activeOffset = activeIndex - scrollProgress;
      const stage = stageRef.current;
      if (stage) {
        stage.style.setProperty(
          "--project-shift-desktop",
          `${Math.sin(activeOffset * 0.65) * 138}vh`,
        );
        stage.style.setProperty(
          "--project-shift-mobile",
          `${Math.sin(activeOffset * 0.4) * 122}vh`,
        );
      }

      setActiveIndex(activeIndex);
    }

    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateProgress);
    }

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [progress]);

  const activeProject = projects[activeIndex];
  const initialStageStyle = {
    "--project-shift-desktop": "0vh",
    "--project-shift-mobile": "0vh",
  } as CSSProperties;

  function scrollToProject(index: number) {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const scrollable = section.offsetHeight - window.innerHeight;
    const target =
      section.offsetTop +
      (projects.length > 1 ? (index / (projects.length - 1)) * scrollable : 0);

    window.scrollTo({ top: target, behavior: "smooth" });
  }

  return (
    <main
      ref={sectionRef}
      id="projects"
      className="projects-wheel-section relative bg-black text-white"
      style={{ minHeight: `${projects.length * 112}vh` }}
    >
      <div className="projects-index-intro">
        <Link
          className="projects-back-link absolute left-[clamp(1.25rem,3vw,4rem)] top-[clamp(1.25rem,3vw,3rem)] z-50 text-[clamp(0.9rem,0.95vw,1.08rem)] text-white/70 transition-colors hover:text-white"
          href="/?entry=projects"
        >
          Back to Home
        </Link>
        <div className="projects-index-heading">
          <p className="projects-index-kicker">
            Selected Projects
          </p>
          <h1 className="projects-index-title font-dahlia">
            <ProjectIntroTitle text="Interactive work" />
          </h1>
        </div>

        {/* Plain list of every project so crawlers and keyboard / screen reader
            users can reach each page without the WebGL wheel. Visible on focus. */}
        <nav
          aria-label="All projects"
          className="sr-only focus-within:not-sr-only focus-within:fixed focus-within:left-4 focus-within:top-16 focus-within:z-[60] focus-within:rounded focus-within:bg-black focus-within:p-4"
        >
          <ul className="flex flex-col gap-2">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link href={`/project/${project.slug}`}>{project.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <section className="projects-wheel-stage relative sticky top-0 h-[100dvh] overflow-hidden"
        aria-label="Project wheel"
        ref={stageRef}
        style={initialStageStyle}
      >
        <WebGLBoundary
          fallback={
            // Flat cover image when WebGL is unavailable or the scene crashes.
            <div className="project-wheel-canvas absolute inset-0">
              <Image
                key={activeProject.slug}
                alt=""
                className="object-cover opacity-70"
                fill
                loading="eager"
                sizes="100vw"
                src={activeProject.image}
              />
            </div>
          }
        >
          <ProjectWheel3D progress={progress} activeIndex={activeIndex} />
        </WebGLBoundary>

        <div
          role="group"
          aria-label="Choose a project"
          className="absolute bottom-[6.25vh] right-[3.25vw] z-50 flex flex-col items-center gap-[0.34rem]"
        >
          {projects.map((project, index) => (
            <button
              key={project.slug}
              type="button"
              aria-label={`Go to ${project.title}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => scrollToProject(index)}
              className={`block h-[1rem] w-[1rem] rounded-[0.12rem] border transition-all duration-300 ${
                index === activeIndex
                  ? "border-white bg-white/8"
                  : "border-white/22 bg-transparent"
              }`}
            />
          ))}
        </div>

        <AnimatedProjectTitle
          key={activeProject.slug}
          category={activeProject.category}
          slug={activeProject.slug}
          title={activeProject.title}
        />
      </section>
    </main>
  );
}
