"use client";

import { useState, useRef, useEffect } from "react";
import { resetScrollToTop, getLenis } from "./SmoothScroll";
import {
  ArrowLeft,
  Sparkles,
  Check,
  Calendar,
  Clock,
  Truck,
  ShieldCheck,
  Heart,
  PhoneCall,
  Send,
  X,
  SlidersHorizontal,
} from "lucide-react";

interface DailyMalaSectionProps {
  onBack: () => void;
}

interface HarOption {
  id: string;
  price: number;
  priceDisplay: string;
  nameHi: string;
  nameEn: string;
  sizeFt: string;
  flowers: string;
  description: string;
  popular?: boolean;
}

const HAR_OPTIONS: HarOption[] = [
  {
    id: "har-30",
    price: 30,
    priceDisplay: "₹30",
    nameHi: "नित्य छोटा हार",
    nameEn: "Nitya Chhota Har",
    sizeFt: "1.25 – 1.5 Ft",
    flowers: "Fresh Yellow & Orange Marigolds (गेंदा)",
    description:
      "Specially prepared for daily morning home altar, photo frames, and deity puja. Strung light and fresh every dawn. (Detailed description will be provided later).",
  },
  {
    id: "har-40",
    price: 40,
    priceDisplay: "₹40",
    nameHi: "शुभ आराधना हार",
    nameEn: "Shubh Aaradhana Har",
    sizeFt: "1.5 – 1.75 Ft",
    flowers: "Marigold with Sacred Tulsi & Bilva Leaves",
    description:
      "Balanced size crafted for home mandir and regular morning prayers. Strung with auspicious basil sprigs. (Detailed description will be provided later).",
  },
  {
    id: "har-50",
    price: 50,
    priceDisplay: "₹50",
    nameHi: "मंदिर सेवा हार",
    nameEn: "Mandir Seva Har",
    sizeFt: "2.0 Ft",
    flowers: "Dual-tone Golden Marigolds with Desi Gulab Border",
    description:
      "Our most sought-after daily size for household idols, Hanumanji & Ganeshji temples across Ahmedabad. (Detailed description will be provided later).",
    popular: true,
  },
  {
    id: "har-60",
    price: 60,
    priceDisplay: "₹60",
    nameHi: "सुगंध गुलाब हार",
    nameEn: "Sugandh Gulab Har",
    sizeFt: "2.25 Ft",
    flowers: "Fragrant Red Roses (देसी गुलाब) & Saffron Marigolds",
    description:
      "Aromatic harmony of morning-cut fresh red roses paired with dense golden petals for festive fragrance. (Detailed description will be provided later).",
  },
  {
    id: "har-70",
    price: 70,
    priceDisplay: "₹70",
    nameHi: "मंगल श्रृंगार हार",
    nameEn: "Mangal Shringar Har",
    sizeFt: "2.5 Ft",
    flowers: "Layered Marigold with White Mogra & Rose Touch",
    description:
      "Enhanced thickness and decorative density, ideal for ceremonial worship and deity adornment. (Detailed description will be provided later).",
  },
  {
    id: "har-80",
    price: 80,
    priceDisplay: "₹80",
    nameHi: "राजवाड़ी उत्सव हार",
    nameEn: "Rajwadi Utsav Har",
    sizeFt: "2.75 – 3.0 Ft",
    flowers: "Dense Double-Braid Saffron Marigold with Rose Pendants",
    description:
      "Substantial royal thickness with lasting morning vibrancy. Perfect for temple murtis and Tuesday/Saturday poojas. (Detailed description will be provided later).",
  },
  {
    id: "har-90",
    price: 90,
    priceDisplay: "₹90",
    nameHi: "दिव्य दर्शन हार",
    nameEn: "Divya Darshan Har",
    sizeFt: "3.0 – 3.25 Ft",
    flowers: "Auction-Fresh Selected Blooms, Rose Centerpiece & Foliage",
    description:
      "Generous length and majestic presentation for prominent temple murtis, home sanctums, and auspicious events. (Detailed description will be provided later).",
  },
  {
    id: "har-100",
    price: 100,
    priceDisplay: "₹100",
    nameHi: "महा मंगल आरती हार",
    nameEn: "Maha Mangal Aarti Har",
    sizeFt: "3.5 Ft",
    flowers: "Royal Dutch Rosebuds, Golden Marigolds & Sacred Accents",
    description:
      "Our premium daily masterpiece. Handcrafted with maximum volume, richness, and spiritual devotion. (Detailed description will be provided later).",
    popular: true,
  },
];

export default function DailyMalaSection({ onBack }: DailyMalaSectionProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const animSectionRef = useRef<HTMLElement>(null);
  const leftJhalarRef = useRef<HTMLDivElement>(null);
  const rightJhalarRef = useRef<HTMLDivElement>(null);

  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(100);
  const [activeFilterPill, setActiveFilterPill] = useState<string>("all");
  const [selectedHar, setSelectedHar] = useState<HarOption | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderFrequency, setOrderFrequency] = useState("daily");
  const [deliverySlot, setDeliverySlot] = useState("6:00 AM – 7:30 AM");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    resetScrollToTop();

    // Side Hanging Flowers (Pattern 3: 5 Separated Strings with Bells & Rose Accents)
    const PITCH = 22;

    function generateFlowerStringSVG(length: number, useBell: boolean, hasRose: boolean) {
      let g = `<line class="th" pathLength="1" x1="15" y1="0" x2="15" y2="${length - 4}" stroke="#8a5a1f" stroke-width="1.4"/>`;
      let c = 0;
      for (let y = 14; y < length - 22; y += PITCH, c++) {
        let grad = c % 2 ? "jfo" : "jfy";
        if (hasRose && c % 3 === 0) grad = "jfr";
        let rot = (c * 23) % 360;
        g += `<g transform="translate(15 ${y})"><use href="#jf" transform="rotate(${rot}) scale(1.02)" fill="url(#${grad})"/></g>`;
      }

      if (useBell) {
        g += `<g transform="translate(0 ${length - 18})"><use href="#ghanti"/></g>`;
      } else {
        g +=
          `<g transform="translate(15 ${length - 8})">` +
          `<circle cx="0" cy="0" r="4.5" fill="#d9a441" stroke="#8a5a1f" stroke-width=".7"/>` +
          `<path d="M-3 4 v12 M0 4 v15 M3 4 v12" stroke="#d9a441" stroke-width="1.3" stroke-linecap="round"/>` +
          `</g>`;
      }

      return `<svg viewBox="0 0 30 ${length + 24}" height="${length + 24}">${g}</svg>`;
    }

    function ring(n: number, off: number, cy: number, rx: number, ry: number) {
      let s = "";
      for (let j = 0; j < n; j++) {
        s += `<ellipse cy="${cy}" rx="${rx}" ry="${ry}" stroke="#8a4a00" stroke-opacity=".35" stroke-width=".5" transform="rotate(${j * (360 / n) + off})"/>`;
      }
      return s;
    }

    const defs = document.getElementById("jdefs");
    if (defs) {
      defs.innerHTML =
        '<linearGradient id="jfy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe680"/><stop offset="1" stop-color="#f0a800"/></linearGradient>' +
        '<linearGradient id="jfo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb25a"/><stop offset="1" stop-color="#e8660f"/></linearGradient>' +
        '<linearGradient id="jfr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff5e62"/><stop offset="1" stop-color="#c9182b"/></linearGradient>' +
        '<radialGradient id="jc"><stop offset="0" stop-color="#7a3500" stop-opacity=".55"/><stop offset="1" stop-color="#7a3500" stop-opacity="0"/></radialGradient>' +
        '<g id="jf">' +
        ring(10, 0, -7, 4.8, 7.5) +
        ring(7, 18, -4.2, 3.6, 5.2) +
        '<circle r="5.5" fill="url(#jc)"/></g>' +
        '<g id="ghanti">' +
        '<path d="M15 0 C 13 4, 9 10, 8 16 C 8 19, 22 19, 22 16 C 21 10, 17 4, 15 0 Z" fill="url(#jfo)" stroke="#8a5a1f" stroke-width="0.8"/>' +
        '<circle cx="15" cy="18" r="2.5" fill="#ffeaa7"/>' +
        '<path d="M12 21 L15 25 L18 21" stroke="#d9a441" stroke-width="1.2" stroke-linecap="round"/>' +
        '</g>';
    }

    function buildJhalar() {
      // Pattern 3: 5 distinct separated strings per side with varied heights & rose accents
      const leftStrings = [
        { left: "4%", height: 420, breeze: "6.5s", angle: "1.3deg", bell: false, rose: true },
        { left: "24%", height: 680, breeze: "5.2s", angle: "1.0deg", bell: false, rose: false },
        { left: "46%", height: 320, breeze: "8.1s", angle: "1.7deg", bell: true, rose: true },
        { left: "68%", height: 600, breeze: "6.0s", angle: "1.2deg", bell: false, rose: false },
        { left: "88%", height: 380, breeze: "7.4s", angle: "1.5deg", bell: true, rose: true },
      ];
      const rightStrings = [
        { left: "4%", height: 380, breeze: "7.4s", angle: "1.5deg", bell: true, rose: true },
        { left: "24%", height: 600, breeze: "6.0s", angle: "1.2deg", bell: false, rose: false },
        { left: "46%", height: 320, breeze: "8.1s", angle: "1.7deg", bell: true, rose: true },
        { left: "68%", height: 680, breeze: "5.2s", angle: "1.0deg", bell: false, rose: false },
        { left: "88%", height: 420, breeze: "6.5s", angle: "1.3deg", bell: false, rose: true },
      ];

      const renderZone = (el: HTMLDivElement | null, stringsList: typeof leftStrings) => {
        if (!el) return;
        let html = "";
        stringsList.forEach((s) => {
          const svg = generateFlowerStringSVG(s.height, s.bell, s.rose);
          html += `<div class="flower-string" style="left:${s.left};--bd:${s.breeze};--angle:${s.angle};">${svg}</div>`;
        });
        el.innerHTML = html;
      };

      renderZone(leftJhalarRef.current, leftStrings);
      renderZone(rightJhalarRef.current, rightStrings);

      // Re-measure Lenis smooth scroller after building SVGs
      try {
        const lenis = getLenis();
        lenis?.resize();
      } catch {}
    }

    buildJhalar();
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        buildJhalar();
        try {
          const lenis = getLenis();
          lenis?.resize();
        } catch {}
      }, 200);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  const handlePillClick = (filter: string) => {
    setActiveFilterPill(filter);
    if (filter === "all") {
      setMaxPriceFilter(100);
    } else if (filter === "30") {
      setMaxPriceFilter(30);
    } else if (filter === "50") {
      setMaxPriceFilter(50);
    } else if (filter === "75") {
      setMaxPriceFilter(75);
    } else if (filter === "100") {
      setMaxPriceFilter(100);
    }
  };

  // Viewport tracking: pause iframe animation when user scrolls to catalog cards
  useEffect(() => {
    const el = animSectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        try {
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
              entry.isIntersecting ? "resume" : "pause",
              "*"
            );
          }
        } catch {}
      },
      { threshold: 0.05, rootMargin: "100px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setMaxPriceFilter(val);
    setActiveFilterPill("custom");
  };

  const filteredHarList = HAR_OPTIONS.filter((item) => {
    if (activeFilterPill === "30") return item.price === 30;
    if (activeFilterPill === "50") return item.price >= 30 && item.price <= 50;
    if (activeFilterPill === "75") return item.price >= 60 && item.price <= 75;
    if (activeFilterPill === "100") return item.price >= 80 && item.price <= 100;
    return item.price <= maxPriceFilter;
  });

  const openBookModal = (har: HarOption) => {
    setSelectedHar(har);
    setIsModalOpen(true);
    setIsSubmitted(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsSubmitted(false);
  };

  const handleWhatsAppBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHar) return;

    const message = `Namaste JNR Florals,
I would like to inquire/book the Daily Mala Service:
*Har Option:* ${selectedHar.nameEn} (${selectedHar.nameHi})
*Price Range:* ${selectedHar.priceDisplay}
*Approx Size:* ${selectedHar.sizeFt}
*Frequency:* ${orderFrequency}
*Preferred Time:* ${deliverySlot}
*Name:* ${customerName || "Customer"}
*Phone:* ${customerPhone || "N/A"}
*Delivery Address in Ahmedabad:* ${customerAddress || "Ahmedabad"}`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/919825000000?text=${encoded}`, "_blank");
    setIsSubmitted(true);
  };

  return (
    <div className="daily-mala-page-wrapper">
      {/* SVG Defs for Side Hanging Flowers */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs id="jdefs"></defs>
      </svg>

      {/* Subtle Ambient Orbs */}
      <div className="daily-mala-ambient-bg" aria-hidden="true">
        <div className="daily-mala-ambient-orb-1" />
        <div className="daily-mala-ambient-orb-2" />
      </div>

      {/* Top Back Navigation Bar */}
      <div className="daily-mala-top-bar">
        <button type="button" onClick={onBack} className="daily-mala-back-btn">
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </button>

        <div className="daily-mala-top-badge">
          <span className="daily-mala-status-pulse" />
          <span>Dawn Delivery Active • Serving Ahmedabad</span>
        </div>
      </div>

      <div className="daily-mala-container">
        {/* Hero Section Header */}
        <header className="daily-mala-hero-header">
          <div className="daily-mala-pill-badge">
            <Sparkles size={14} className="daily-mala-pill-sparkle" />
            <span>NITYA MALA & HAR SERVICE</span>
          </div>

          <h1 className="daily-mala-main-title">
            FRESH DAILY MARIGOLD MALA & HAR
          </h1>

          <p className="daily-mala-lead-text">
            Hand-strung fresh every dawn by master artisans for your morning deity puja, home mandir, and spiritual rituals. Delivered auction-fresh across Ahmedabad every morning.
          </p>
        </header>

        {/* SECTION 1: Mala.html Animation Frame & Side Hanging Flowers */}
        <section
          className="mala-animation-section"
          aria-label="Mala Stringing Simulation"
          ref={animSectionRef}
        >
          {/* Left Side Hanging Flowers (Jhalar) */}
          <div className="jhalar jhalar-left" aria-hidden="true" ref={leftJhalarRef} />

          {/* Center Mala Card */}
          <div className="mala-card-container">
            <div className="mala-card-glow" />

            <div className="mala-card-header">
              <span className="mala-card-subtitle">✨ पवित्र मंदिर श्रृंगार सेवा • SACRED PUJA FLORAL ART</span>
              <h2 className="mala-card-title">DIVINE PUJA MALA & TEMPLE SHRINGAR</h2>
              <p className="mala-card-desc">
                Watch auction-fresh marigolds strung flower by flower, adorning Lord Ganesha in sacred morning temple shringar for deity puja, mandir aarti, and home sanctums.
              </p>
            </div>

            {/* Embedded Mala.html Iframe */}
            <div className="mala-iframe-wrapper">
              <iframe
                ref={iframeRef}
                src="/Mala.html?theme=dark"
                title="Mala Garland Animation"
                className="mala-iframe"
                loading="eager"
              />
            </div>
          </div>

          {/* Right Side Hanging Flowers (Jhalar) */}
          <div className="jhalar jhalar-right" aria-hidden="true" ref={rightJhalarRef} />
        </section>

        {/* SECTION 2: Option of Har with Range Starting from 30 to 100 */}
        <section className="har-catalog-section" aria-label="Har Catalog and Pricing Options">
          <div className="har-catalog-header">
            <span className="har-section-tag">CUSTOMIZABLE SIZES & PRICING</span>
            <h2 className="har-catalog-title">Option of Har (Range Starting from ₹30 to ₹100)</h2>
            <p className="har-catalog-desc">
              Choose the perfect garland length and petal weave for your home altar or temple offerings. All options are handcrafted daily from auction-grade fresh blossoms.
            </p>
          </div>

          {/* Range Slider and Quick Filter Bar */}
          <div className="har-range-filter-box">
            <div className="har-filter-top-row">
              <div className="har-range-label-wrap">
                <span className="har-range-badge">₹30 to ₹100</span>
                <span className="har-range-text">Filter by Maximum Price:</span>
              </div>

              {/* Quick Filter Buttons */}
              <div className="har-filter-pills">
                <button
                  type="button"
                  className={`har-pill-btn ${activeFilterPill === "all" ? "active" : ""}`}
                  onClick={() => handlePillClick("all")}
                >
                  All (₹30 – ₹100)
                </button>
                <button
                  type="button"
                  className={`har-pill-btn ${activeFilterPill === "30" ? "active" : ""}`}
                  onClick={() => handlePillClick("30")}
                >
                  ₹30 (Puja)
                </button>
                <button
                  type="button"
                  className={`har-pill-btn ${activeFilterPill === "50" ? "active" : ""}`}
                  onClick={() => handlePillClick("50")}
                >
                  ₹40 – ₹50 (Mandir)
                </button>
                <button
                  type="button"
                  className={`har-pill-btn ${activeFilterPill === "75" ? "active" : ""}`}
                  onClick={() => handlePillClick("75")}
                >
                  ₹60 – ₹70 (Shringar)
                </button>
                <button
                  type="button"
                  className={`har-pill-btn ${activeFilterPill === "100" ? "active" : ""}`}
                  onClick={() => handlePillClick("100")}
                >
                  ₹80 – ₹100 (Rajwadi)
                </button>
              </div>
            </div>

            {/* Slider Control */}
            <div className="har-slider-row">
              <SlidersHorizontal size={18} color="#F05A22" />
              <input
                type="range"
                min="30"
                max="100"
                step="10"
                value={maxPriceFilter}
                onChange={handleSliderChange}
                className="har-range-slider"
                aria-label="Filter maximum price range"
              />
              <span className="har-slider-val">Up to ₹{maxPriceFilter}</span>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="har-cards-grid">
            {filteredHarList.map((har) => (
              <div
                key={har.id}
                className={`har-card ${har.popular ? "highlighted" : ""}`}
              >
                <div>
                  <div className="har-card-top">
                    <div className="har-price-tag">
                      <span>{har.priceDisplay}</span>
                      <span className="har-price-sub">/ piece</span>
                    </div>

                    <span className="har-badge-size">{har.sizeFt}</span>
                  </div>

                  <div className="har-card-body" style={{ marginTop: "14px" }}>
                    <span className="har-card-title-hi">{har.nameHi}</span>
                    <h3 className="har-card-title-en">{har.nameEn}</h3>

                    <div className="har-card-flower-type">
                      <Sparkles size={13} color="#F05A22" />
                      <span>{har.flowers}</span>
                    </div>

                    <p className="har-card-desc">{har.description}</p>
                  </div>
                </div>

                <div className="har-card-footer">
                  <div className="har-frequency-row">
                    <span>Available as:</span>
                    <strong>Daily / Custom Days</strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => openBookModal(har)}
                    className="har-select-btn"
                  >
                    <span>Select & Inquire {har.priceDisplay}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Buyer Service Guarantees */}
          <div className="daily-mala-benefits-grid">
            <div className="daily-mala-benefit-item">
              <div className="daily-mala-benefit-icon">
                <Truck size={22} />
              </div>
              <div>
                <h4 className="daily-mala-benefit-title">Dawn Morning Delivery</h4>
                <p className="daily-mala-benefit-text">
                  Delivered to your doorstep between 6:00 AM – 7:30 AM before morning puja starts.
                </p>
              </div>
            </div>

            <div className="daily-mala-benefit-item">
              <div className="daily-mala-benefit-icon">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="daily-mala-benefit-title">Pure Flower Guarantee</h4>
                <p className="daily-mala-benefit-text">
                  Fresh auction-sourced marigolds and desi roses. No stale or preserved blossoms.
                </p>
              </div>
            </div>

            <div className="daily-mala-benefit-item">
              <div className="daily-mala-benefit-icon">
                <Calendar size={22} />
              </div>
              <div>
                <h4 className="daily-mala-benefit-title">Flexible Subscription</h4>
                <p className="daily-mala-benefit-text">
                  Order daily, alternate days, or festive occasions. Pause or modify anytime.
                </p>
              </div>
            </div>

            <div className="daily-mala-benefit-item">
              <div className="daily-mala-benefit-icon">
                <Heart size={22} />
              </div>
              <div>
                <h4 className="daily-mala-benefit-title">Sacred Craftsmanship</h4>
                <p className="daily-mala-benefit-text">
                  Strung on natural cotton threads with spiritual devotion by experienced artisans.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Booking / Inquiry Modal */}
      {isModalOpen && selectedHar && (
        <div className="har-modal-overlay" onClick={closeModal}>
          <div
            className="har-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={closeModal}
              className="har-modal-close"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            <div className="har-modal-header">
              <span className="har-modal-badge">DAILY MALA RESERVATION</span>
              <h3 className="har-modal-title">
                {selectedHar.nameEn} ({selectedHar.nameHi})
              </h3>
            </div>

            <div className="har-modal-summary-box">
              <div>
                <span style={{ fontSize: "0.82rem", color: "#6a6661" }}>Tier Range:</span>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#F05A22" }}>
                  {selectedHar.priceDisplay} <span style={{ fontSize: "0.78rem", color: "#444" }}>/ day</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.82rem", color: "#6a6661" }}>Approx Size:</span>
                <div style={{ fontWeight: 600, color: "#171615" }}>{selectedHar.sizeFt}</div>
              </div>
            </div>

            {isSubmitted ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "#10b981",
                    display: "grid",
                    placeItems: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <Check size={28} />
                </div>
                <h4 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>
                  Inquiry Initiated!
                </h4>
                <p style={{ color: "#666", fontSize: "0.9rem", lineHeight: 1.5 }}>
                  Your request for {selectedHar.nameEn} ({selectedHar.priceDisplay}) has been created.
                  Our morning coordinator will contact you directly.
                </p>
                <button
                  type="button"
                  onClick={closeModal}
                  className="har-submit-btn"
                  style={{ marginTop: "18px", width: "100%" }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleWhatsAppBooking} className="har-modal-form">
                <div className="har-form-group">
                  <label className="har-form-label">Delivery Frequency</label>
                  <select
                    className="har-form-select"
                    value={orderFrequency}
                    onChange={(e) => setOrderFrequency(e.target.value)}
                  >
                    <option value="Daily Subscription (Every Morning)">Daily Subscription (Every Morning)</option>
                    <option value="Alternate Days">Alternate Days</option>
                    <option value="Tuesdays & Saturdays Only (Temple/Pooja Days)">Tuesdays & Saturdays Only</option>
                    <option value="One-Time Trial Order">One-Time Trial Order</option>
                  </select>
                </div>

                <div className="har-form-group">
                  <label className="har-form-label">Preferred Morning Delivery Time</label>
                  <select
                    className="har-form-select"
                    value={deliverySlot}
                    onChange={(e) => setDeliverySlot(e.target.value)}
                  >
                    <option value="6:00 AM – 7:30 AM (Brahma Muhurta / Early Pooja)">
                      6:00 AM – 7:30 AM (Early Pooja)
                    </option>
                    <option value="7:30 AM – 9:00 AM (Morning Mandir Hours)">
                      7:30 AM – 9:00 AM (Morning Hours)
                    </option>
                  </select>
                </div>

                <div className="har-form-group">
                  <label className="har-form-label">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className="har-form-input"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="har-form-group">
                  <label className="har-form-label">Contact / WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98XXX XXXXX"
                    className="har-form-input"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>

                <div className="har-form-group">
                  <label className="har-form-label">Delivery Address in Ahmedabad</label>
                  <input
                    type="text"
                    required
                    placeholder="Society/Apartment, Area (e.g. Navrangpura, Bodakdev)"
                    className="har-form-input"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                  />
                </div>

                <button type="submit" className="har-submit-btn">
                  <Send size={16} />
                  <span>Confirm & Send Inquiry on WhatsApp</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
