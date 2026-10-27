"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface IntroSectionProps {
  onAboutClick?: () => void;
}

export default function IntroSection({ onAboutClick }: IntroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const flowerGroupRef = useRef<SVGGElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const path = pathRef.current;
    const flowerGroup = flowerGroupRef.current;
    const dot = dotRef.current;
    if (!path || !flowerGroup || !dot) return;

    const totalLength = path.getTotalLength();

    // Pre-sample 100 points along the path once on mount for instant O(1) lookups
    const SAMPLES = 100;
    const sampledPoints: DOMPoint[] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      sampledPoints.push(path.getPointAtLength((i / SAMPLES) * totalLength));
    }

    // Set stroke dasharray & dashoffset to animate line drawing
    path.style.strokeDasharray = `${totalLength}`;
    path.style.strokeDashoffset = `${totalLength}`;

    // Place flower at initial position (progress = 0)
    const initialPt = sampledPoints[0];
    flowerGroup.setAttribute(
      "transform",
      `translate(${initialPt.x}, ${initialPt.y}) rotate(0)`
    );
    dot.setAttribute("cx", `${initialPt.x}`);
    dot.setAttribute("cy", `${initialPt.y}`);

    const ctx = gsap.context(() => {
      const tracker = { progress: 0 };

      gsap.to(tracker, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "center 28%",
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            const currentDist = p * totalLength;
            const idx = Math.min(SAMPLES, Math.max(0, Math.round(p * SAMPLES)));
            const pt = sampledPoints[idx];

            // 1. Draw line following the motion
            path.style.strokeDashoffset = `${totalLength - currentDist}`;

            // 2. Position the orange tip dot directly on the line
            dot.setAttribute("cx", `${pt.x}`);
            dot.setAttribute("cy", `${pt.y}`);
            dot.style.opacity = p > 0.005 ? "1" : "0";

            // 3. Move flower directly ON the line and rotate gently
            const angle = p * 160;
            flowerGroup.setAttribute(
              "transform",
              `translate(${pt.x}, ${pt.y}) rotate(${angle})`
            );
          },
        },
      });
    }, sectionRef);

    // Refresh to guarantee sync with other ScrollTrigger instances
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="intro-section" id="about">
      <div className="intro-container">
        {/* Left: Stem Path with Moving and Rotating Yellow Flower locked ON line */}
        <div className="hanging-flower-container">
          <svg
            className="stem-svg"
            viewBox="0 0 320 360"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background guide track */}
            <path
              d="M 0 40 L 190 40 A 50 50 0 0 1 240 90 L 240 270"
              stroke="rgba(27, 26, 24, 0.15)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Active animated stroke drawn along with flower */}
            <path
              ref={pathRef}
              d="M 0 40 L 190 40 A 50 50 0 0 1 240 90 L 240 270"
              stroke="#1b1a18"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Orange connection dot at current path tip */}
            <circle ref={dotRef} r="4.5" fill="#f05a22" />

            {/* Yellow Flower locked directly ON the line path */}
            <g
              ref={flowerGroupRef}
              style={{
                transformOrigin: "0px 0px",
              }}
            >
              <ellipse cx="0" cy="8" rx="44" ry="44" fill="rgba(215, 160, 20, 0.28)" />
              <image
                href="/assets/yellow_flower.png"
                width="120"
                height="120"
                x="-60"
                y="-60"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          </svg>
        </div>

        {/* Right: Editorial Narrative Content */}
        <div className="intro-text-column">
          <p className="intro-lead">
With over 20 years of experience operating in Ahmedabad, we specialize in creating the finest, freshest flower decorations at highly competitive prices. Thanks to our efficient team and seamless setup process, we deliver stunning, timely decoration work executed to perfection for your special occasions.          </p>

          <button
            type="button"
            className="intro-pill-btn"
            onClick={onAboutClick}
          >
            <span>More about us</span>
            <span className="pill-dot-icon">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f05a22"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
