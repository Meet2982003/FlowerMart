"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, ArrowRight, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { scrollToSection } from "./SmoothScroll";

interface HeroSectionProps {
  onMalaClick?: () => void;
}

export default function HeroSection({ onMalaClick }: HeroSectionProps) {
  const [flipIndex, setFlipIndex] = useState(0);

  const flipItems = [
    {
      id: "mala",
      label: "Daily Mala (हार ₹30–₹100)",
      icon: <Sparkles size={15} color="#F05A22" />,
      action: () => onMalaClick?.(),
    },
    {
      id: "consultation",
      label: "Book Consultation",
      icon: <Calendar size={15} color="#ffffff" />,
      action: () => scrollToSection("contact"),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFlipIndex((prev) => (prev + 1) % flipItems.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [flipItems.length]);

  const currentItem = flipItems[flipIndex];

  return (
    <section className="hero-landing-section">
      {/* Background Wedding Mandap & Floral Stage Image */}
      <div className="hero-bg-media">
        <Image
          src="/assets/wedding_mandap_hero_bg.jpg"
          alt="Bespoke Wedding Floral Mandap Decoration by JNR Ahmedabad"
          fill
          priority
          sizes="100vw"
          className="hero-bg-img"
        />
        <div className="hero-overlay" />
      </div>

      {/* Center Hero Content */}
      <div className="hero-content">
        {/* Theme Badge */}
        <div className="hero-wedding-badge">
          <Sparkles size={14} className="hero-badge-sparkle" />
          <span>AHMEDABAD&apos;S PREMIER FLORAL ARTISANS</span>
        </div>

        {/* Refined Luxury Headline */}
        <h1 className="hero-wedding-title">
          GRAND FLORAL ARTISTRY FOR UNFORGETTABLE MOMENTS
        </h1>

        {/* Action Buttons */}
        <div className="hero-wedding-cta-row">
          <a href="#gallery" className="hero-primary-pill-btn">
            <span>Explore Decor Gallery</span>
            <ArrowRight size={16} />
          </a>

          {/* Unified Flipping Action Button: Daily Mala & Book Consultation */}
          <button
            type="button"
            onClick={currentItem.action}
            className="hero-secondary-pill-btn"
            style={{ cursor: "pointer", fontFamily: "inherit" }}
            aria-label={currentItem.label}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={currentItem.id}
                initial={{ y: -18, opacity: 0, scale: 0.96 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 18, opacity: 0, scale: 0.96 }}
                transition={{
                  duration: 0.32,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ willChange: "transform, opacity" }}
                className="inline-flex items-center gap-2 whitespace-nowrap"
              >
                {currentItem.icon}
                <span>{currentItem.label}</span>
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Floating scroll indicator */}
      <div className="scroll-indicator" aria-hidden="true">
        <span className="mouse-wheel"></span>
        <span className="scroll-label">Scroll to explore</span>
      </div>
    </section>
  );
}
