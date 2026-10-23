"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let globalLenis: Lenis | null = null;

export function getLenis(): Lenis | null {
  return globalLenis;
}

export function scrollToSection(
  target: HTMLElement | string | number,
  options?: { offset?: number; duration?: number }
) {
  if (typeof window === "undefined") return;

  const offset = options?.offset ?? -20;
  const duration = options?.duration ?? 1.25;

  let targetEl: HTMLElement | null = null;
  if (typeof target === "string") {
    const id = target.replace(/^#/, "");
    targetEl = document.getElementById(id);
  } else if (target instanceof HTMLElement) {
    targetEl = target;
  }

  // 1. Try Lenis instance if available and has scrollTo function
  const lenis = globalLenis || (window as any).lenis;
  if (lenis && typeof lenis.scrollTo === "function") {
    try {
      if (typeof target === "number") {
        lenis.scrollTo(target, {
          duration,
          easing: (t: number) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
        });
        return;
      } else if (targetEl) {
        lenis.scrollTo(targetEl, {
          offset,
          duration,
          easing: (t: number) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
        });
        return;
      }
    } catch {
      // Fall through to native smooth scroll
    }
  }

  // 2. Safe fallback: Native smooth scrolling with accurate offset
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
  } else if (targetEl) {
    const targetY = targetEl.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: "smooth",
    });
  }
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Highly optimized buttery-smooth Lenis configuration
    const lenis = new Lenis({
      lerp: 0.09, // Instant, buttery-smooth linear interpolation without sluggish latency
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      infinite: false,
    });

    globalLenis = lenis;
    (window as any).lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);

    // Keep natural lag smoothing so frame drops don't cause sudden jitter
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      globalLenis = null;
      delete (window as any).lenis;
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
