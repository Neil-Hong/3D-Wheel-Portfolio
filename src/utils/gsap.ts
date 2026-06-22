import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function fadeInUp(
  target: gsap.DOMTarget,
  options?: gsap.TweenVars
): gsap.core.Tween {
  return gsap.fromTo(
    target,
    { y: 80, opacity: 0, scale: 0.95 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: "power3.out",
      ...options,
    }
  );
}

export function fadeIn(
  target: gsap.DOMTarget,
  options?: gsap.TweenVars
): gsap.core.Tween {
  return gsap.fromTo(
    target,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1,
      ease: "power2.out",
      ...options,
    }
  );
}

export function staggerReveal(
  targets: gsap.DOMTarget,
  options?: gsap.TweenVars
): gsap.core.Tween {
  return gsap.fromTo(
    targets,
    { y: 60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.12,
      ease: "power3.out",
      ...options,
    }
  );
}

export function scrollReveal(
  target: gsap.DOMTarget,
  options?: ScrollTrigger.Vars
): ScrollTrigger {
  return ScrollTrigger.create({
    trigger: target as Element,
    start: "top 85%",
    end: "bottom 10%",
    toggleActions: "play none none reverse",
    ...options,
    animation: gsap.fromTo(
      target,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.4,
        ease: "power3.out",
      }
    ),
  });
}

export function parallaxScroll(
  target: gsap.DOMTarget,
  speed: number,
  options?: ScrollTrigger.Vars
): ScrollTrigger {
  return ScrollTrigger.create({
    trigger: target as Element,
    start: "top bottom",
    end: "bottom top",
    scrub: 1,
    ...options,
    animation: gsap.fromTo(
      target,
      { y: () => speed * -100 },
      { y: () => speed * 100, ease: "none" }
    ),
  });
}

export function scaleOnScroll(
  target: gsap.DOMTarget,
  options?: ScrollTrigger.Vars
): ScrollTrigger {
  return ScrollTrigger.create({
    trigger: target as Element,
    start: "top 80%",
    end: "top 30%",
    scrub: 1,
    ...options,
    animation: gsap.fromTo(
      target,
      { scale: 0.85, opacity: 0.6 },
      { scale: 1, opacity: 1, ease: "none" }
    ),
  });
}

export function magneticHover(
  element: HTMLElement,
  options?: { intensity?: number }
): () => void {
  const intensity = options?.intensity ?? 0.3;
  const bounds = element.getBoundingClientRect();

  function onMouseMove(e: MouseEvent) {
    const x = (e.clientX - bounds.left - bounds.width / 2) * intensity;
    const y = (e.clientY - bounds.top - bounds.height / 2) * intensity;
    gsap.to(element, {
      x,
      y,
      duration: 0.8,
      ease: "power2.out",
    });
  }

  function onMouseLeave() {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    });
  }

  element.addEventListener("mousemove", onMouseMove);
  element.addEventListener("mouseleave", onMouseLeave);

  return () => {
    element.removeEventListener("mousemove", onMouseMove);
    element.removeEventListener("mouseleave", onMouseLeave);
  };
}
