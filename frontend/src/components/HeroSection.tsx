"use client";

import Image from "next/image";
import { Sparkles, ArrowRight, Calendar } from "lucide-react";

export default function HeroSection() {
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

        {/* Elegant Editorial Subtitle */}
        <p className="hero-wedding-subtitle">
          Over 20 years of curating magnificent wedding mandaps, royal reception stages,
          and auction-fresh floral creations crafted to perfection.
        </p>

        {/* Action Buttons */}
        <div className="hero-wedding-cta-row">
          <a href="#gallery" className="hero-primary-pill-btn">
            <span>Explore Decor Gallery</span>
            <ArrowRight size={16} />
          </a>

          <a href="#contact" className="hero-secondary-pill-btn">
            <Calendar size={15} />
            <span>Book Consultation</span>
          </a>
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
