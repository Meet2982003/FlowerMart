"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";

interface BlossomingFlowersProps {
  className?: string;
  isVisible?: boolean;
}

export default function BlossomingFlowers({
  className = "",
  isVisible = false,
}: BlossomingFlowersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [localBloomed, setLocalBloomed] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const [rebloomCount, setRebloomCount] = useState(0);

  // Viewport tracking: Mount on first intersection, pause animations when scrolled out
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
        if (entry.isIntersecting) {
          setLocalBloomed(true);
        }
      },
      { threshold: 0.1, rootMargin: "150px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hasBloomed = isVisible || localBloomed;
  const isCurrentlyActive = isVisible || isInViewport;

  const handleRebloom = () => {
    setRebloomCount((prev) => prev + 1);
  };

  return (
    <div
      ref={containerRef}
      className={`blossom-garden-card ${className} ${
        !isCurrentlyActive ? "is-paused" : "is-active"
      }`}
    >
      {/* Top Header */}
      <div className="blossom-card-header">
        <div className="blossom-badge">
          <Sparkles size={12} className="blossom-sparkle-icon" />
          <span>LIVING BOTANICAL SANCTUARY</span>
        </div>
        <button
          type="button"
          onClick={handleRebloom}
          className="rebloom-btn"
          title="Watch flowers sprout & bloom again"
        >
          <RefreshCw size={12} />
          <span>Re-bloom</span>
        </button>
      </div>

      {/* The Animated CSS Blossoming Flowers Terrarium */}
      <div className="blossom-terrarium-stage">
        {/* Soft Ambient Night Glow */}
        <div className="blossom-ambient-glow" aria-hidden="true" />

        {/* The Flower System: Mounts & Blooms ONLY when scrolled into view */}
        {hasBloomed ? (
          <div key={rebloomCount} className="flowers">
            {/* Flower 1: Center (Vibrant Coral Orange - Brand Accent) */}
            <div className="flower flower--1">
              <div className="flower__leafs flower__leafs--1">
                <div className="flower__leaf flower__leaf--1"></div>
                <div className="flower__leaf flower__leaf--2"></div>
                <div className="flower__leaf flower__leaf--3"></div>
                <div className="flower__leaf flower__leaf--4"></div>
                <div className="flower__white-circle"></div>

                <div className="flower__light flower__light--1"></div>
                <div className="flower__light flower__light--2"></div>
                <div className="flower__light flower__light--3"></div>
                <div className="flower__light flower__light--4"></div>
                <div className="flower__light flower__light--5"></div>
                <div className="flower__light flower__light--6"></div>
                <div className="flower__light flower__light--7"></div>
                <div className="flower__light flower__light--8"></div>
              </div>
              <div className="flower__line">
                <div className="flower__line__leaf flower__line__leaf--1"></div>
                <div className="flower__line__leaf flower__line__leaf--2"></div>
                <div className="flower__line__leaf flower__line__leaf--3"></div>
                <div className="flower__line__leaf flower__line__leaf--4"></div>
                <div className="flower__line__leaf flower__line__leaf--5"></div>
                <div className="flower__line__leaf flower__line__leaf--6"></div>
              </div>
            </div>

            {/* Flower 2: Left (Golden Amber Marigold) */}
            <div className="flower flower--2">
              <div className="flower__leafs flower__leafs--2">
                <div className="flower__leaf flower__leaf--1"></div>
                <div className="flower__leaf flower__leaf--2"></div>
                <div className="flower__leaf flower__leaf--3"></div>
                <div className="flower__leaf flower__leaf--4"></div>
                <div className="flower__white-circle"></div>

                <div className="flower__light flower__light--1"></div>
                <div className="flower__light flower__light--2"></div>
                <div className="flower__light flower__light--3"></div>
                <div className="flower__light flower__light--4"></div>
                <div className="flower__light flower__light--5"></div>
                <div className="flower__light flower__light--6"></div>
                <div className="flower__light flower__light--7"></div>
                <div className="flower__light flower__light--8"></div>
              </div>
              <div className="flower__line">
                <div className="flower__line__leaf flower__line__leaf--1"></div>
                <div className="flower__line__leaf flower__line__leaf--2"></div>
                <div className="flower__line__leaf flower__line__leaf--3"></div>
                <div className="flower__line__leaf flower__line__leaf--4"></div>
              </div>
            </div>

            {/* Flower 3: Right (Blush Peony / Lilac Purple) */}
            <div className="flower flower--3">
              <div className="flower__leafs flower__leafs--3">
                <div className="flower__leaf flower__leaf--1"></div>
                <div className="flower__leaf flower__leaf--2"></div>
                <div className="flower__leaf flower__leaf--3"></div>
                <div className="flower__leaf flower__leaf--4"></div>
                <div className="flower__white-circle"></div>

                <div className="flower__light flower__light--1"></div>
                <div className="flower__light flower__light--2"></div>
                <div className="flower__light flower__light--3"></div>
                <div className="flower__light flower__light--4"></div>
                <div className="flower__light flower__light--5"></div>
                <div className="flower__light flower__light--6"></div>
                <div className="flower__light flower__light--7"></div>
                <div className="flower__light flower__light--8"></div>
              </div>
              <div className="flower__line">
                <div className="flower__line__leaf flower__line__leaf--1"></div>
                <div className="flower__line__leaf flower__line__leaf--2"></div>
                <div className="flower__line__leaf flower__line__leaf--3"></div>
                <div className="flower__line__leaf flower__line__leaf--4"></div>
              </div>
            </div>

            {/* Sprouting Botanical Leaves & Grass */}
            <div className="grow-ans" style={{ "--d": "1.2s" } as React.CSSProperties}>
              <div className="flower__g-long">
                <div className="flower__g-long__top"></div>
                <div className="flower__g-long__bottom"></div>
              </div>
            </div>

            <div className="growing-grass">
              <div className="flower__grass flower__grass--1">
                <div className="flower__grass--top"></div>
                <div className="flower__grass--bottom"></div>
                <div className="flower__grass__leaf flower__grass__leaf--1"></div>
                <div className="flower__grass__leaf flower__grass__leaf--2"></div>
                <div className="flower__grass__leaf flower__grass__leaf--3"></div>
                <div className="flower__grass__leaf flower__grass__leaf--4"></div>
                <div className="flower__grass__leaf flower__grass__leaf--5"></div>
                <div className="flower__grass__leaf flower__grass__leaf--6"></div>
                <div className="flower__grass__leaf flower__grass__leaf--7"></div>
                <div className="flower__grass__leaf flower__grass__leaf--8"></div>
                <div className="flower__grass__overlay"></div>
              </div>
            </div>

            <div className="growing-grass">
              <div className="flower__grass flower__grass--2">
                <div className="flower__grass--top"></div>
                <div className="flower__grass--bottom"></div>
                <div className="flower__grass__leaf flower__grass__leaf--1"></div>
                <div className="flower__grass__leaf flower__grass__leaf--2"></div>
                <div className="flower__grass__leaf flower__grass__leaf--3"></div>
                <div className="flower__grass__leaf flower__grass__leaf--4"></div>
                <div className="flower__grass__leaf flower__grass__leaf--5"></div>
                <div className="flower__grass__leaf flower__grass__leaf--6"></div>
                <div className="flower__grass__leaf flower__grass__leaf--7"></div>
                <div className="flower__grass__leaf flower__grass__leaf--8"></div>
                <div className="flower__grass__overlay"></div>
              </div>
            </div>

            <div className="grow-ans" style={{ "--d": "2.4s" } as React.CSSProperties}>
              <div className="flower__g-right flower__g-right--1">
                <div className="leaf"></div>
              </div>
            </div>

            <div className="grow-ans" style={{ "--d": "2.8s" } as React.CSSProperties}>
              <div className="flower__g-right flower__g-right--2">
                <div className="leaf"></div>
              </div>
            </div>

            <div className="grow-ans" style={{ "--d": "2.8s" } as React.CSSProperties}>
              <div className="flower__g-front">
                <div className="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--1">
                  <div className="flower__g-front__leaf"></div>
                </div>
                <div className="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--2">
                  <div className="flower__g-front__leaf"></div>
                </div>
                <div className="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--3">
                  <div className="flower__g-front__leaf"></div>
                </div>
                <div className="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--4">
                  <div className="flower__g-front__leaf"></div>
                </div>
                <div className="flower__g-front__line"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="blossom-waiting-soil">
            <span className="soil-hint">Night garden awakens as you arrive...</span>
          </div>
        )}
      </div>

      <div className="blossom-footer-caption">
        <span>Handcrafted Floral Artistry • Grown from Nature in Ahmedabad</span>
      </div>
    </div>
  );
}
