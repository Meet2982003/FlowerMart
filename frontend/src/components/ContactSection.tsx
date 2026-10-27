"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Send,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import BlossomingFlowers from "./BlossomingFlowers";

const SERVICE_OPTIONS = [
  "Wedding & Mandap Decor",
  "Corporate Galas & Events",
  "Fresh Cut Flower Supply",
  "Custom Floral Sculptures",
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const flowerPathRef = useRef<SVGPathElement>(null);
  const flowerGroupRef = useRef<SVGGElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  const [isGardenInView, setIsGardenInView] = useState(false);
  const [selectedService, setSelectedService] = useState<string>(SERVICE_OPTIONS[0]);

  // Form State
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({
        name: "",
        email: "",
        phone: "",
        date: "",
        message: "",
      });
    }, 850);
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    // Trigger the blooming garden animation ONLY when the user scrolls to the contact section
    const stGarden = ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      onEnter: () => {
        setIsGardenInView(true);
      },
    });

    // Hanging Yellow Flower on Curved Stem animation
    const path = flowerPathRef.current;
    const flowerGroup = flowerGroupRef.current;
    const dot = dotRef.current;
    let pathScrollTween: gsap.core.Tween | null = null;

    if (path && flowerGroup && dot) {
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
      dot.style.opacity = "0";

      const tracker = { progress: 0 };

      pathScrollTween = gsap.to(tracker, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 92%",
          end: "top 12%",
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            const currentDist = p * totalLength;
            const idx = Math.min(SAMPLES, Math.max(0, Math.round(p * SAMPLES)));
            const pt = sampledPoints[idx];

            // 1. Draw line following the motion
            path.style.strokeDashoffset = `${totalLength - currentDist}`;

            // 2. Position the rose-pink tip dot directly on the line
            dot.setAttribute("cx", `${pt.x}`);
            dot.setAttribute("cy", `${pt.y}`);
            dot.style.opacity = p > 0.005 ? "1" : "0";

            // 3. Move flower directly ON the line with gentle, graceful rotation (reduced spin speed)
            const angle = p * 150;
            flowerGroup.setAttribute(
              "transform",
              `translate(${pt.x}, ${pt.y}) rotate(${angle})`
            );
          },
        },
      });
    }

    ScrollTrigger.refresh();

    return () => {
      stGarden.kill();
      if (pathScrollTween?.scrollTrigger) {
        pathScrollTween.scrollTrigger.kill();
      }
      pathScrollTween?.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="contact-section">
      {/* Decorative vertical top connector line */}
      <div className="contact-line-top" aria-hidden="true" />

      <div className="contact-container">
        {/* Section Header Row with Hanging Yellow Flower on the Right */}
        <div className="contact-header-row">
          <div className="contact-header">
            <div className="contact-badge">
              <Sparkles size={14} className="badge-sparkle" />
              <span>LET&apos;S TALK BLOOMS</span>
            </div>

            <h2 className="contact-main-heading">
              CRAFTING UNFORGETTABLE MOMENTS WITH FRESH FLORALS
            </h2>

            <p className="contact-subheading">
              Whether planning an exquisite grand wedding in Ahmedabad or sourcing
              premium auction varieties globally, our floral artisans are here to
              bring your vision into vibrant reality.
            </p>
          </div>

          {/* Right: Stem Path with Moving and Rotating Yellow Flower locked ON line */}
          <div className="contact-hanging-flower-container" aria-hidden="true">
            <svg
              className="contact-stem-svg"
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
                ref={flowerPathRef}
                d="M 0 40 L 190 40 A 50 50 0 0 1 240 90 L 240 270"
                stroke="#1b1a18"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Rose-pink connection dot at current path tip */}
              <circle ref={dotRef} r="4.5" fill="#e24a84" />

              {/* Pink Peony Flower locked directly ON the line path */}
              <g
                ref={flowerGroupRef}
                style={{
                  transformOrigin: "0px 0px",
                }}
              >
                <ellipse cx="0" cy="8" rx="44" ry="44" fill="rgba(225, 90, 140, 0.28)" />
                <image
                  href="/assets/pink_peony.png"
                  width="120"
                  height="120"
                  x="-60"
                  y="-60"
                  preserveAspectRatio="xMidYMid meet"
                />
              </g>
            </svg>
          </div>
        </div>

        {/* Content Flow: Form First, Contact Details Below */}
        <div className="contact-content-grid">
          {/* 1. High-End Contact Form */}
          <div className="contact-form-card">
            <div className="form-card-header">
              <span className="form-tag">CUSTOM INQUIRY</span>
              <h3 className="form-heading">Send Us a Floral Request</h3>
              <p className="form-desc">
                Tell us about your event, decoration needs, or bulk orders. We’ll
                prepare tailored mood boards and transparent pricing.
              </p>
            </div>

            {/* Service Select Pills */}
            <div className="service-selection-group">
              <label className="input-group-label">Select Service Required</label>
              <div className="service-pills-wrap">
                {SERVICE_OPTIONS.map((srv) => (
                  <button
                    key={srv}
                    type="button"
                    className={`service-pill ${
                      selectedService === srv ? "active" : ""
                    }`}
                    onClick={() => setSelectedService(srv)}
                  >
                    {srv}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            {isSubmitted ? (
              <div className="form-success-state">
                <div className="success-icon-wrap">
                  <CheckCircle2 size={54} />
                </div>
                <h4 className="success-title">Floral Inquiry Received!</h4>
                <p className="success-message">
                  Thank you for reaching out. Our head floral designer will contact
                  you shortly to curate your bespoke floral experience.
                </p>
                <button
                  type="button"
                  className="success-reset-btn"
                  onClick={() => setIsSubmitted(false)}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-actual-form">
                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="contact-name" className="form-label">
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. Radhika Patel"
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      className="form-input"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-email" className="form-label">
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="e.g. radhika@example.com"
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="contact-phone" className="form-label">
                      Phone Number *
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formState.phone}
                      onChange={(e) =>
                        setFormState({ ...formState, phone: e.target.value })
                      }
                      className="form-input"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-date" className="form-label">
                      Event / Delivery Date
                    </label>
                    <input
                      id="contact-date"
                      type="date"
                      value={formState.date}
                      onChange={(e) =>
                        setFormState({ ...formState, date: e.target.value })
                      }
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="contact-message" className="form-label">
                    Floral Requirements & Notes
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder="Describe your venue, flower preferences (e.g. roses, marigolds, lilies, orchids), or color theme..."
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                    className="form-textarea"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="contact-submit-btn"
                >
                  {isSubmitting ? (
                    <span className="submit-loading-text">
                      <span className="loading-spinner" /> Sending Inquiry...
                    </span>
                  ) : (
                    <>
                      <span>Send Floral Inquiry</span>
                      <span className="submit-icon-circle">
                        <Send size={15} />
                      </span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* 2. Dark Card with Living Blossoming Night Garden & Contact Details */}
          <div className="contact-info-card">
            {/* Left Pane: Blossoming Garden & Quick WhatsApp */}
            <div className="contact-info-left-pane">
              <BlossomingFlowers isVisible={isGardenInView} />
              <a
                href="https://wa.me/918401239344?text=Hello%20JNR%20Flowers,%20I%20would%20like%20to%20inquire%20about%20floral%20decorations."
                target="_blank"
                rel="noopener noreferrer"
                className="contact-whatsapp-btn"
              >
                <MessageSquare size={17} />
                <span>Instant Chat on WhatsApp</span>
                <ArrowRight size={16} />
              </a>
            </div>

            {/* Right Pane: Direct Contact Stack */}
            <div className="contact-info-right-pane">
              <div className="contact-details-stack">
                <div className="detail-item">
                  <div className="detail-icon-box">
                    <Phone size={18} />
                  </div>
                  <div className="detail-text">
                    <span className="detail-label">Direct Line / WhatsApp</span>
                    <a href="tel:+918401239344" className="detail-value-link">
                      +91 8401239344
                    </a>
                    <span className="detail-sub">Ahmedabad & Gandhinagar</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon-box">
                    <Mail size={18} />
                  </div>
                  <div className="detail-text">
                    <span className="detail-label">Email Correspondence</span>
                    <a
                      href="mailto:meetrami905@gmail.com"
                      className="detail-value-link"
                    >
                      meetrami905@gmail.com
                    </a>
                    <span className="detail-sub">Guaranteed response within 4 hours</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon-box">
                    <MapPin size={18} />
                  </div>
                  <div className="detail-text">
                    <span className="detail-label">Studio & Auction Hubs</span>
                    <span className="detail-value">Ahmedabad, Gujarat, India</span>
                    <span className="detail-sub">
                      Direct Logistics via Naaldwijk Auction, Netherlands
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon-box">
                    <Clock size={18} />
                  </div>
                  <div className="detail-text">
                    <span className="detail-label">Operating Schedule</span>
                    <span className="detail-value">Open 7 Days a Week</span>
                    <span className="detail-sub">24/7 Cold-Chain & Event Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
