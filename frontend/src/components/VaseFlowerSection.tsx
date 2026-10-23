"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

export default function VaseFlowerSection() {
  const [replayKey, setReplayKey] = useState(0);

  // Automatically repeat the bloom and falling petal animation every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setReplayKey((prev) => prev + 1);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="vase-section" id="botanical-art">
      {/* Decorative vertical top connector line */}
      <div className="vase-section-line-top" aria-hidden="true" />

      <div className="vase-section-container">
        {/* Left Column: Story & Botanical Philosophy */}
        <div className="vase-content-col">
          <div className="vase-badge">
            <Sparkles size={14} className="vase-sparkle" />
            <span>Living Botanical Art</span>
          </div>

          <h2 className="vase-main-heading">
            Nature&apos;s Finest Blooms, Captured in Elegance
          </h2>

          <p className="vase-description">
            From auction clock to centerpiece, every stem is curated with
            uncompromising dedication. Watch fresh petals sprout and gently drift,
            celebrating the natural poetry and vibrant colors that define our
            floral creations.
          </p>

          <div className="vase-features-list">
            <div className="vase-feature-pill">
              <span className="vase-feature-dot" />
              <span>Direct Cold-Chain Freshness from Auction</span>
            </div>
            <div className="vase-feature-pill">
              <span className="vase-feature-dot" />
              <span>Masterfully Hydrated & Curated in Water Glass</span>
            </div>
            <div className="vase-feature-pill">
              <span className="vase-feature-dot" />
              <span>Over 10,000 Rare & Exotic Botanical Varieties</span>
            </div>
          </div>
        </div>

        {/* Right Column: The Pure CSS Terrarium & Animated Glass Vase */}
        <div className="vase-stage-card">
          <div className="vase-ambient-glow" aria-hidden="true" />

          <div className="vase-stage">
            <div key={replayKey} className="flower">
              {/* Stem 1: Center Yellow/Coral Flower */}
              <div className="f-wrapper">
                <div className="flower__line"></div>
                <div className="f">
                  <div className="flower__leaf flower__leaf--1"></div>
                  <div className="flower__leaf flower__leaf--2"></div>
                  <div className="flower__leaf flower__leaf--3"></div>
                  <div className="flower__leaf flower__leaf--4"></div>
                  <div className="flower__leaf flower__leaf--5"></div>
                  <div className="flower__leaf flower__leaf--6"></div>
                  <div className="flower__leaf flower__leaf--7"></div>
                  <div className="flower__leaf flower__leaf--8 flower__fall-down--yellow"></div>
                </div>
              </div>

              {/* Stem 2: Right Magenta Flower */}
              <div className="f-wrapper f-wrapper--2">
                <div className="flower__line"></div>
                <div className="f">
                  <div className="flower__leaf flower__leaf--1"></div>
                  <div className="flower__leaf flower__leaf--2"></div>
                  <div className="flower__leaf flower__leaf--3"></div>
                  <div className="flower__leaf flower__leaf--4"></div>
                  <div className="flower__leaf flower__leaf--5"></div>
                  <div className="flower__leaf flower__leaf--6"></div>
                  <div className="flower__leaf flower__leaf--7"></div>
                  <div className="flower__leaf flower__leaf--8 flower__fall-down--pink"></div>
                </div>
              </div>

              {/* Stem 3: Left Purple/Violet Flower */}
              <div className="f-wrapper f-wrapper--3">
                <div className="flower__line"></div>
                <div className="f">
                  <div className="flower__leaf flower__leaf--1"></div>
                  <div className="flower__leaf flower__leaf--2"></div>
                  <div className="flower__leaf flower__leaf--3"></div>
                  <div className="flower__leaf flower__leaf--4"></div>
                  <div className="flower__leaf flower__leaf--5"></div>
                  <div className="flower__leaf flower__leaf--6"></div>
                  <div className="flower__leaf flower__leaf--7"></div>
                  <div className="flower__leaf flower__leaf--8 flower__fall-down--purple"></div>
                </div>
              </div>

              {/* Water Glass Vase */}
              <div className="flower__glass"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
