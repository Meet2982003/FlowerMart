"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FLOWER_OPTIONS = [
  { id: "purple", name: "Purple", src: "/assets/purple_flower.png" },
  { id: "images", name: "images.jpeg", src: "/assets/images_flower.png" },
  { id: "gerbera", name: "Pink", src: "/assets/gerbera.png" },
];

export default function FlowerHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const flowerRef = useRef<HTMLImageElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [selectedFlower, setSelectedFlower] = useState(FLOWER_OPTIONS[0]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const words = wordRefs.current.filter(Boolean);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=2000",
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      // 1. Flower stops at center, then rotates smoothly while pinned
      tl.to(
        flowerRef.current,
        {
          rotation: 180,
          scale: 1.05,
          transformOrigin: "50% 50%",
          ease: "none",
          duration: 1.6,
        },
        0
      );

      // 2. WITH rotation of flower, words appear sequentially in parallel
      tl.fromTo(
        words,
        {
          opacity: 0,
          y: 20,
          scale: 0.95,
          filter: "none",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "none",
          stagger: 0.2,
          duration: 0.45,
          ease: "power2.out",
        },
        0.05
      );

      // 3. Buffer period: hold complete statement before smooth unpinning
      tl.to({}, { duration: 0.8 });
    }, heroRef);

    return () => ctx.revert();
  }, [selectedFlower]);

  return (
    <section ref={heroRef} className="flower-animation-section" id="inspiration">
      {/* Centered Flower Stage */}
      <div className="flower-stage">
        <Image
          ref={flowerRef}
          src={selectedFlower.src}
          alt={selectedFlower.name}
          width={500}
          height={500}
          className="animated-flower"
          priority
          unoptimized
        />
      </div>

      {/* Stacked Word Reveal Typography */}
      <div className="flower-typography-stage" aria-label="ONCE IN LIFETIME MAKE IT MEMORABLE">
        <div className="flower-text-line">
          <span
            ref={(el) => { wordRefs.current[0] = el; }}
            className="word-reveal"
          >
            ONCE
          </span>
          <span
            ref={(el) => { wordRefs.current[1] = el; }}
            className="word-reveal"
          >
            IN
          </span>
          <span
            ref={(el) => { wordRefs.current[2] = el; }}
            className="word-reveal"
          >
            LIFETIME
          </span>
        </div>

        <div className="flower-text-line">
          <span
            ref={(el) => { wordRefs.current[3] = el; }}
            className="word-reveal"
          >
            MAKE
          </span>
          <span
            ref={(el) => { wordRefs.current[4] = el; }}
            className="word-reveal"
          >
            IT
          </span>
          <span
            ref={(el) => { wordRefs.current[5] = el; }}
            className="word-reveal"
          >
            MEMORABLE
          </span>
        </div>
      </div>

      {/* Flower Variant Switcher Pill */}
      {/* <div className="flower-switcher-pill" aria-label="Choose flower visual">
        <span className="switcher-label">Flower:</span>
        {FLOWER_OPTIONS.map((flower) => (
          <button
            key={flower.id}
            type="button"
            className={`switcher-btn ${selectedFlower.id === flower.id ? "active" : ""}`}
            onClick={() => setSelectedFlower(flower)}
          >
            {flower.name}
          </button>
        ))}
      </div> */}
    </section>
  );
}
