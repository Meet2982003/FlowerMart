"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, Award, Sparkles, Truck, ShieldCheck, Heart } from "lucide-react";

interface AboutUsProps {
  onBack: () => void;
}

export default function AboutUs({ onBack }: AboutUsProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const stats = [
    { label: "Floral Varieties", value: "10,000+" },
    { label: "Auction Years", value: "35+" },
    { label: "Daily Deliveries", value: "100%" },
    { label: "Global Growers", value: "250+" },
  ];

  const values = [
    {
      icon: Award,
      title: "Direct From Auction",
      description:
        "Located right at the heart of the flower auction in Naaldwijk, we select the finest flowers directly at the clock each morning.",
    },
    {
      icon: Truck,
      title: "Rapid Cold-Chain Logistics",
      description:
        "Our temperature-controlled distribution network ensures that delicate blooms arrive as fresh as the moment they were cut.",
    },
    {
      icon: ShieldCheck,
      title: "Uncompromising Quality",
      description:
        "Every stem is hand-inspected by experienced floral specialists to guarantee unmatched vase life and vibrant colors.",
    },
    {
      icon: Heart,
      title: "Personal Partnership",
      description:
        "We build dedicated, long-term relationships with growers and retailers, offering guidance and multilingual support every day.",
    },
  ];

  return (
    <div className="about-page-wrapper">
      {/* Top Banner Navigation / Back button */}
      <div className="about-back-bar">
        <button type="button" onClick={onBack} className="about-back-btn">
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="about-container">
        {/* Hero Section */}
        <header className="about-hero-header">
          <div className="about-badge">
            <Sparkles size={14} className="badge-sparkle" />
            <span>ABOUT OUR PASSION</span>
          </div>

          <h1 className="about-main-title">
            ROOTED IN TRADITION, BLOOMING BEYOND LIMITS
          </h1>

          <p className="about-lead-text">
            From our headquarters at the world-renowned Naaldwijk flower auction, we bridge the gap between world-class growers and passionate florists. We are driven by a simple promise: delivering nature&apos;s finest creations in peak perfection.
          </p>
        </header>

        {/* Story Split Section */}
        <section className="about-story-grid">
          <div className="about-story-media">
            <Image
              src="/assets/warehouse_story.jpg"
              alt="Our flower specialists in Naaldwijk warehouse"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="about-story-img"
              priority
            />
            <div className="about-media-overlay" />
            <div className="about-media-tag">
              <span>Naaldwijk Auction Hub</span>
            </div>
          </div>

          <div className="about-story-content">
            <span className="story-subhead">OUR HERITAGE</span>
            <h2 className="story-heading">Where Every Morning Starts With Fresh Blooms</h2>
            <p className="story-p">
              Before the sun rises over the Dutch polders, our team of seasoned floral connoisseurs is already active on the trading floor. We inspect thousands of lots, selecting only the strongest stems, richest hues, and most aromatic varieties.
            </p>
            <p className="story-p">
              With over three decades of market expertise and direct integration into European grower networks, we combine traditional craftsmanship with state-of-the-art logistics to guarantee same-day turnaround for our partners.
            </p>

            {/* Quick Stats Grid */}
            <div className="about-stats-grid">
              {stats.map((stat, i) => (
                <div key={i} className="about-stat-card">
                  <span className="stat-number">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pillars / Values Section */}
        <section className="about-values-section">
          <div className="values-header">
            <span className="values-tag">HOW WE OPERATE</span>
            <h2 className="values-main-heading">Craftsmanship in Every Delivery</h2>
          </div>

          <div className="about-values-grid">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="about-value-card">
                  <div className="value-icon-circle">
                    <Icon size={22} />
                  </div>
                  <h3 className="value-title">{val.title}</h3>
                  <p className="value-desc">{val.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA to return or contact */}
        <section className="about-bottom-cta">
          <h2>Ready to experience nature&apos;s finest?</h2>
          <p>Explore our seasonal collections or connect directly with our specialists.</p>
          <div className="cta-actions">
            <button type="button" onClick={onBack} className="about-primary-btn">
              <span>Explore Collection</span>
              <span className="arrow-icon">→</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onBack();
                setTimeout(() => {
                  const el = document.getElementById("contact");
                  el?.scrollIntoView({ behavior: "smooth" });
                }, 80);
              }}
              className="about-secondary-btn"
            >
              <span>Contact Us</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
