"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import {
  aboutRows,
  aboutTags,
  awards,
  experiences,
  navItems,
} from "@/data/home";

gsap.registerPlugin(ScrollTrigger);

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="section-heading">
      <span className="section-kicker reveal-item" aria-hidden="true" />
      <h2 className="kinetic-title">
        <SplitLetters text={children} />
      </h2>
    </div>
  );
}

function SplitLetters({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, wordIndex) => (
        <span className="kinetic-word" key={`${word}-${wordIndex}`}>
          {word.split("").map((letter, letterIndex) => (
            <span
              aria-hidden="true"
              className="kinetic-letter"
              key={`${letter}-${letterIndex}`}
            >
              {letter}
            </span>
          ))}
          {wordIndex < text.split(" ").length - 1 ? "\u00a0" : null}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </>
  );
}

export default function PortfolioHome() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const context = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const enterFromProjects =
        new URLSearchParams(window.location.search).get("entry") === "projects";

      if (enterFromProjects) {
        gsap.fromTo(
          root,
          { xPercent: reduceMotion ? 0 : -100 },
          {
            xPercent: 0,
            duration: reduceMotion ? 0.01 : 0.82,
            ease: "power4.inOut",
            clearProps: "transform",
            onComplete: () => {
              window.history.replaceState(null, "", "/");
            },
          },
        );
      }

      gsap.set(".hero-line", { autoAlpha: 0, yPercent: 22 });
      gsap.set(".hero-copy, .hero-cta, .navbar", { autoAlpha: 0, y: 20 });

      const heroTl = gsap.timeline({
        defaults: {
          duration: reduceMotion ? 0.01 : 0.9,
          ease: "power3.out",
        },
      });

      heroTl
        .to(".navbar", { autoAlpha: 1, y: 0 }, 0)
        .to(".hero-line", { autoAlpha: 1, yPercent: 0, stagger: 0.08 }, 0.12)
        .to(".hero-copy", { autoAlpha: 1, y: 0 }, 0.48)
        .to(".hero-cta", { autoAlpha: 1, y: 0 }, 0.62);

      gsap.utils.toArray<HTMLElement>(".reveal-item").forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 56 },
          {
            autoAlpha: 1,
            y: 0,
            duration: reduceMotion ? 0.01 : 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 86%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".kinetic-title").forEach((title) => {
        const letters = title.querySelectorAll(".kinetic-letter");
        gsap.fromTo(
          letters,
          {
            autoAlpha: 0,
            yPercent: 112,
            rotationX: -70,
          },
          {
            autoAlpha: 1,
            yPercent: 0,
            rotationX: 0,
            duration: reduceMotion ? 0.01 : 0.86,
            stagger: reduceMotion ? 0 : 0.025,
            ease: "power3.out",
            scrollTrigger: {
              trigger: title,
              start: "top 84%",
              toggleActions: "play none none reset",
            },
          },
        );
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className="portfolio-home">
      <header className="navbar">
        <a className="navbar-brand" href="#home" aria-label="Go to home">
          <span>Neil Hong</span>
          <span>Web3 & Full-stack Developer</span>
        </a>
        <nav aria-label="Primary navigation">
          {navItems.map((item) =>
            item.href.startsWith("/") ? (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ) : (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ),
          )}
        </nav>
      </header>

      <main>
        <section id="home" className="hero-section" aria-label="Hero">
          <video
            aria-hidden="true"
            autoPlay
            className="hero-video"
            loop
            muted
            playsInline
            src="/video/sololeveling.mp4"
          />
          <div className="hero-overlay" aria-hidden="true" />
          <div className="hero-stage">
            <div className="hero-top">
              <h1 className="hero-title" aria-label="I am Web3 Creative Dev">
                <span className="hero-line">I AM</span>
                <span className="hero-line">Neil</span>
              </h1>
              <p className="hero-copy">
                I build Web3 and full-stack products.
                <br />I like taking loose ideas and making them feel clear:
                through code, interface design, and the small decisions that
                make a product make sense.
              </p>
              <Link className="hero-cta" href="/projects">
                View Projects
              </Link>
            </div>
            <div className="hero-bottom">
              <p className="hero-based">Based in Sydney</p>
              <p className="hero-title hero-title-bottom" aria-hidden="true">
                <span className="hero-line">CREATIVE</span>
                <span className="hero-line">DEV</span>
              </p>
            </div>
          </div>
        </section>

        <section id="experience" className="experience-section page-section">
          <SectionTitle>Experience</SectionTitle>
          <div className="experience-stack-layout">
            <div className="experience-stack">
              {experiences.map((experience, index) => (
                <article
                  className="experience-stack-card reveal-item"
                  key={experience.company}
                >
                  <div className="experience-card-meta" aria-hidden="true">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>{experience.company}</span>
                  </div>
                  <div className="experience-card-head">
                    <div>
                      <p className="experience-period">{experience.period}</p>
                      <h3>{experience.role}</h3>
                    </div>
                    <div className="experience-company-block">
                      <span>{experience.company}</span>
                      <p>{experience.location}</p>
                    </div>
                  </div>
                  <p className="experience-tech">
                    Technologies: {experience.technologies}
                  </p>
                  <ul>
                    {experience.highlights.slice(0, 3).map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="about-section page-section">
          <div className="about-intro">
            <p className="about-kicker reveal-item">Nice to meet you</p>
            <h2 className="kinetic-title">
              <SplitLetters text="Beyond the portfolio" />
            </h2>
          </div>
          <div className="about-layout">
            <div className="about-left reveal-item">
              <div className="about-image">
                <Image
                  alt="Portrait"
                  fill
                  sizes="(max-width: 768px) 100vw, 38vw"
                  src="/me.png"
                />
              </div>
              <div className="about-copy">
                <p>
                  I build full-stack and Web3 interfaces with a bias toward
                  working prototypes. The parts I care about most are structure,
                  motion, and whether the final product feels easy to reason
                  about.
                </p>
              </div>
            </div>
            <div className="about-right reveal-item">
              {aboutRows.map(([label, value]) => (
                <div className="about-row" key={label}>
                  <span>{label}</span>
                  <p>{value}</p>
                </div>
              ))}
              <div className="about-tags">
                <span>How colleagues describe me</span>
                <div>
                  {aboutTags.map((tag) => (
                    <p key={tag}>{tag}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="projects-cta-section page-section">
          <div className="projects-cta-inner">
            <p className="reveal-item">Selected Projects</p>
            <h2 className="kinetic-title">
              <SplitLetters text="Explore the 3D project wheel" />
            </h2>
            <Link className="projects-cta-button reveal-item" href="/projects">
              View My Projects
            </Link>
          </div>
        </section>
        <section id="awards" className="awards-section page-section">
          <SectionTitle>Awards & Certificate</SectionTitle>
          <div className="awards-layout">
            <div className="awards-grid">
              {awards.map((award) => (
                <article className="award-card reveal-item" key={award.title}>
                  <div className="award-media">
                    <Image
                      alt={award.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 32vw"
                      src={award.image}
                    />
                  </div>
                  <p className="award-quote">&quot;{award.quote}&quot;</p>
                  <span className="award-rule" aria-hidden="true" />
                  <h3>{award.title}</h3>
                </article>
              ))}
            </div>
            <div className="awards-video-wrap reveal-item">
              <video
                autoPlay
                className="awards-video"
                loop
                muted
                playsInline
                src="/video/turtle.mp4"
              />
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="footer-section">
        <div className="footer-kicker reveal-item">Contact</div>
        <h2 className="footer-title kinetic-title">
          <SplitLetters text="Let's connect" />
        </h2>
        <div className="footer-links">
          <a
            href="https://www.linkedin.com/in/neil-hong-ba89ba1b8/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <FaLinkedin aria-hidden="true" />
            <span>LinkedIn</span>
          </a>
          <a
            href="mailto:neilhong0422@gmail.com"
            aria-label="Email"
            title="Email"
          >
            <Mail aria-hidden="true" />
            <span>Email</span>
          </a>
          <a
            href="https://github.com/Neil-Hong"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            title="GitHub"
          >
            <FaGithub aria-hidden="true" />
            <span>GitHub</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
