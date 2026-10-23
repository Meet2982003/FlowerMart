"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface CarouselSlideItem {
  id: string | number;
  filename?: string;
  image: string;
  name: string;
  des: string;
  tag?: string;
  link?: string;
}

// ============================================================================
// HOW TO ADD CUSTOM DESCRIPTIONS (Two easy ways):
//
// OPTION A (Recommended - File based):
//   Edit `public/assets/carousel/metadata.json`. You can map any image filename
//   to its custom title, description, and tag without writing TypeScript code!
//
// OPTION B (Code based):
//   Add entries to CUSTOM_DESCRIPTIONS below using the image filename:
// ============================================================================
export const CUSTOM_DESCRIPTIONS: Record<
  string,
  { title?: string; description?: string; tag?: string; link?: string }
> = {
  // Examples:
  // "my_flower.jpg": {
  //   title: "Red Velvet Rose",
  //   description: "Hand-picked Colombian roses with rich velvety petals, perfect for luxury bouquets.",
  //   tag: "PREMIUM ROSES",
  // },
};

const AUTO_PLAY_INTERVAL = 5000; // Auto-play every 7 seconds

export default function PhotoCarousel() {
  const [slides, setSlides] = useState<CarouselSlideItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const slideRef = useRef<HTMLDivElement>(null);

  // Dynamic image fetching from public/assets/carousel/ via /api/carousel-images
  const fetchCarouselImages = useCallback(async () => {
    try {
      const res = await fetch("/api/carousel-images", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();

      if (data.slides && Array.isArray(data.slides)) {
        const dynamicItems: CarouselSlideItem[] = data.slides.map(
          (s: { id: number; filename: string; image: string; title?: string; subtitle?: string; tag?: string; link?: string }) => {
            // Check code-based custom overrides if provided
            const localCustom = CUSTOM_DESCRIPTIONS[s.filename] || CUSTOM_DESCRIPTIONS[String(s.id)] || {};

            return {
              id: `dyn-${s.id}`,
              filename: s.filename,
              image: s.image,
              name: localCustom.title || s.title || `Collection ${s.id}`,
              des: localCustom.description || s.subtitle || "Premium floral selection delivered fresh from our international growers.",
              tag: localCustom.tag || s.tag || `COLLECTION ${String(s.id).padStart(2, "0")}`,
              link: localCustom.link || s.link || "#inspiration",
            };
          }
        );

        // If user added 1, 2, or 3 images, loop them so the tray has at least 4 cards for the expanding animation
        let populatedSlides: CarouselSlideItem[] = [];
        if (dynamicItems.length > 0) {
          if (dynamicItems.length < 4) {
            populatedSlides = [...dynamicItems, ...dynamicItems, ...dynamicItems]
              .slice(0, 5)
              .map((item, idx) => ({ ...item, id: `${item.id}-loop-${idx}` }));
          } else {
            populatedSlides = dynamicItems;
          }
        }

        setSlides(populatedSlides);
      }
    } catch (err) {
      console.error("Failed to fetch carousel images:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCarouselImages();
  }, [fetchCarouselImages]);

  // Next slide handler (appends first item to end of slide container)
  const handleNext = useCallback(() => {
    if (!slideRef.current) return;
    const items = slideRef.current.querySelectorAll<HTMLDivElement>(".item");
    if (items.length > 0) {
      slideRef.current.appendChild(items[0]);
    }
  }, []);

  // Prev slide handler (prepends last item to start of slide container)
  const handlePrev = useCallback(() => {
    if (!slideRef.current) return;
    const items = slideRef.current.querySelectorAll<HTMLDivElement>(".item");
    if (items.length > 0) {
      slideRef.current.prepend(items[items.length - 1]);
    }
  }, []);

  // Reliable 10-second automatic rotation timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      handleNext();
    }, AUTO_PLAY_INTERVAL);
  }, [handleNext]);

  useEffect(() => {
    if (slides.length <= 1) return;

    resetTimer();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer, slides.length]);

  const onManualNext = () => {
    handleNext();
    resetTimer();
  };

  const onManualPrev = () => {
    handlePrev();
    resetTimer();
  };

  return (
    <section
      className="carousel-section"
      id="gallery"
      aria-label="Expanding Card Photo Carousel"
    >
      {/* Main Expanding Card Carousel Container */}
      <div className="container">
        {slides.length === 0 ? (
          // Empty State Prompt
          <div className="carousel-empty-prompt">
            <div className="empty-prompt-icon">
              <svg
                width="42"
                height="42"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                <line x1="12" y1="11" x2="12" y2="17" />
                <line x1="9" y1="14" x2="15" y2="14" />
              </svg>
            </div>
            <h3>No Photos in Carousel Folder Yet</h3>
            <p>
              Drop your images into <code>public/assets/carousel/</code>
              <br />
              They will automatically expand and rotate here!
            </p>
            <div className="empty-hint-tag">
              Tip: Add custom descriptions in <code>public/assets/carousel/metadata.json</code>
            </div>
          </div>
        ) : (
          <>
            <div className="slide" ref={slideRef}>
              {slides.map((item, idx) => (
                <div
                  key={item.id}
                  className="item"
                  style={{ backgroundImage: `url('${item.image}')` }}
                  onClick={() => {
                    // Click preview tray card to advance
                    if (idx >= 2) onManualNext();
                  }}
                >
                  <div className="content">
                    {item.tag && <div className="tag">{item.tag}</div>}
                    <div className="name">{item.name}</div>
                    <div className="des">{item.des}</div>
                    <a className="seeMore" href={item.link || "#inspiration"}>
                      <button type="button">See More →</button>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            {slides.length > 1 && (
              <div className="button">
                <button
                  type="button"
                  className="prev"
                  onClick={onManualPrev}
                  aria-label="Previous slide"
                >
                  ◁
                </button>
                <button
                  type="button"
                  className="next"
                  onClick={onManualNext}
                  aria-label="Next slide"
                >
                  ▷
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
