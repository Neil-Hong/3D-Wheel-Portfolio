"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import type { Project } from "@/types";
import { projects } from "@/data/projects";

interface ProjectDetailClientProps {
  project: Project;
}

interface SplitTitleProps {
  className?: string;
  title: string;
}

function SplitTitle({ className = "", title }: SplitTitleProps) {
  const words = title.split(" ");

  return (
    <span className={className}>
      {words.map((word, wordIndex) => (
        <span className="project-title-word" key={`${word}-${wordIndex}`}>
          {word.split("").map((letter, letterIndex) => (
            <div
              aria-hidden="true"
              className="project-title-letter"
              key={`${letter}-${letterIndex}`}
            >
              {letter}
            </div>
          ))}
          {wordIndex < words.length - 1 ? "\u00a0" : null}
        </span>
      ))}
      <span className="sr-only">{title}</span>
    </span>
  );
}

function ProjectTitleSection({
  eyebrow,
  meta,
  nextHref,
  title,
}: {
  eyebrow: string;
  meta?: { label: string; value: string; href?: boolean }[];
  nextHref?: string;
  title: string;
}) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const context = gsap.context(() => {
      const letters = gsap.utils.toArray<HTMLElement>(".project-title-letter");
      const support = gsap.utils.toArray<HTMLElement>(".project-detail-rise");

      gsap.set(letters, {
        autoAlpha: 0,
        yPercent: 118,
        rotationX: -86,
      });
      gsap.set(support, { autoAlpha: 0, y: 28 });

      const timeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      timeline
        .to(support, { autoAlpha: 1, y: 0, duration: 0.62, stagger: 0.1 }, 0.1)
        .to(
          letters,
          {
            autoAlpha: 1,
            yPercent: 0,
            rotationX: 0,
            duration: 1.05,
            stagger: 0.03,
          },
          0.16,
        );

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            timeline.restart();
          } else {
            timeline.pause(0);
          }
        },
        { threshold: 0.42 },
      );

      observer.observe(root);

      return () => {
        observer.disconnect();
        timeline.kill();
      };
    }, root);

    return () => context.revert();
  }, [eyebrow, title]);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[70svh] flex-col items-center justify-center px-[3.1vw] py-[16vh]"
    >
      <p className="project-detail-rise mb-[clamp(3.5rem,5.3vw,6.8rem)] text-center text-[clamp(0.98rem,1vw,1.22rem)] font-medium">
        {eyebrow}
      </p>
      <h1
        className="text-center text-[clamp(5.1rem,11vw,14.6rem)] font-normal leading-[0.92] tracking-[-0.045em]"
        style={{ fontFamily: "Dahlia, Georgia, 'Times New Roman', serif" }}
      >
        <SplitTitle title={title} />
      </h1>

      {meta ? (
        <div className="project-detail-meta project-detail-rise !mt-[clamp(8.8rem,12vw,14.5rem)] grid w-full max-w-[42rem] grid-cols-3 gap-11 text-[clamp(0.92rem,0.96vw,1.08rem)] leading-[1.45]">
          {meta.map((item) => (
            <div key={item.label}>
              <p className="mb-1 opacity-45">{item.label}</p>
              {item.href ? (
                <a href={item.value} target="_blank" rel="noopener noreferrer">
                  {item.value}
                  <span className="whitespace-nowrap" aria-hidden="true">
                    {" "}
                    ↗
                  </span>
                </a>
              ) : (
                <span>{item.value}</span>
              )}
            </div>
          ))}
        </div>
      ) : null}

      {nextHref ? (
        <Link
          href={nextHref}
          aria-label={`Open ${title}`}
          className="project-detail-rise detail-next-link !mt-[clamp(1rem,2vw,8rem)]"
        >
          <span className="detail-next-button">
            <span className="detail-next-arrow" aria-hidden="true">
              <span className="detail-next-arrow-default">{"\u2193"}</span>
              <span className="detail-next-arrow-hover">{"\u2193"}</span>
            </span>
          </span>
        </Link>
      ) : null}
    </section>
  );
}

export default function ProjectDetailClient({
  project,
}: ProjectDetailClientProps) {
  const searchParams = useSearchParams();
  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const images = Array.from(
    new Set(project.images.length ? project.images : [project.image]),
  );
  const remainingImages = images.slice(1);
  const enteredFromNext = searchParams.get("from") === "next";
  const detailStyle = {
    "--detail-background": project.detailTheme.background,
    "--detail-foreground": project.detailTheme.foreground,
  } as CSSProperties;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project.slug]);

  return (
    <motion.main
      initial={enteredFromNext ? { y: "100vh" } : { x: "100vw" }}
      animate={{ x: 0, y: 0 }}
      exit={enteredFromNext ? { y: "100vh" } : { x: "100vw" }}
      transition={{ duration: 0.82, ease: [0.76, 0, 0.24, 1] }}
      className="project-detail-page min-h-screen"
      style={detailStyle}
    >
      <header className="project-detail-header fixed left-0 right-0 top-0 z-40 flex items-start justify-between text-[clamp(0.9rem,0.9vw,1.1rem)] font-medium leading-[1.34]">
        <Link href="/" aria-label="Back to index">
          <span className="block">Neil Hong</span>
          <span className="block">Web3 &amp; Full Stack Developer</span>
        </Link>
        <nav className="flex items-center gap-8 opacity-65">
          <Link className="transition-opacity hover:opacity-100" href="/">
            Index
          </Link>
          <a className="transition-opacity hover:opacity-100" href="#about">
            Next Project
          </a>
        </nav>
      </header>

      <ProjectTitleSection
        eyebrow={project.category}
        meta={[
          { label: "Category", value: project.role.slice(0, 2).join(", ") },
          { label: "Completed", value: project.year },
          {
            label: "URL",
            value: `${project.client}`,
            href: true,
          },
        ]}
        title={project.title}
      />

      <section className="project-detail-media">
        <figure className="project-detail-hero-media w-full overflow-hidden">
          <div className="project-detail-hero-image relative h-[100vh] min-h-[648px] w-full">
            <Image
              alt={`${project.title} project cover`}
              className="object-cover"
              fill
              loading="eager"
              quality={90}
              sizes="100vw"
              src={images[0] ?? project.image}
            />
          </div>
        </figure>

        <div
          className={`project-detail-gallery project-detail-gallery--${project.detailTheme.galleryLayout}`}
        >
          {remainingImages.map((image, index) => {
            const alignment =
              project.detailTheme.galleryLayout === "alternating"
                ? index % 2 === 0
                  ? "right"
                  : "left"
                : "center";

            return (
              <motion.figure
                key={`${image}-${index}`}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="project-detail-gallery-item overflow-hidden"
                data-alignment={alignment}
              >
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    alt={`${project.title} project image ${index + 2}`}
                    className="object-cover"
                    fill
                    quality={90}
                    sizes={
                      project.detailTheme.galleryLayout === "alternating"
                        ? "(max-width: 768px) 100vw, 76vw"
                        : "(max-width: 768px) 100vw, 84vw"
                    }
                    src={image}
                  />
                </div>
              </motion.figure>
            );
          })}
        </div>
      </section>

      <div id="about" className="sr-only">
        {project.description}
      </div>

      <ProjectTitleSection
        eyebrow="Next project"
        nextHref={`/project/${nextProject.slug}?from=next`}
        title={nextProject.title}
      />
    </motion.main>
  );
}
