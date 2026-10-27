"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import DecorationGalleryModal from "./DecorationGalleryModal";

export interface CarouselImageItem {
  id: string;
  index: number;
  filename: string;
  url: string;
  name: string;
  des: string;
}

export interface CarouselSlideItem {
  id: string | number;
  filename?: string;
  image: string;
  name: string;
  des: string;
  tag?: string;
  link?: string;
  folder?: string;
  isFolder?: boolean;
  photosCount?: number;
  allImages?: CarouselImageItem[];
}

export const CUSTOM_DESCRIPTIONS: Record<
  string,
  { title?: string; description?: string; tag?: string; link?: string }
> = {};

const AUTO_PLAY_INTERVAL = 5000;

export default function PhotoCarousel() {
  const [slides, setSlides] = useState<CarouselSlideItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const slideRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isInViewport, setIsInViewport] = useState(false);

  // Gallery Modal State
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeGalleryItem, setActiveGalleryItem] = useState<CarouselSlideItem | null>(null);

  // Track viewport intersection: Only run auto-play when visible
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { rootMargin: "100px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Dynamic image fetching from public/assets/carousel/ via /api/carousel-images
  const fetchCarouselImages = useCallback(async () => {
    try {
      const res = await fetch("/api/carousel-images", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();

      if (data.slides && Array.isArray(data.slides)) {
        const dynamicItems: CarouselSlideItem[] = data.slides.map(
          (s: {
            id: string | number;
            filename: string;
            image: string;
            title?: string;
            name?: string;
            subtitle?: string;
            des?: string;
            tag?: string;
            link?: string;
            folder?: string;
            isFolder?: boolean;
            photosCount?: number;
            allImages?: CarouselImageItem[];
          }) => {
            const localCustom =
              CUSTOM_DESCRIPTIONS[s.filename] ||
              (s.folder ? CUSTOM_DESCRIPTIONS[s.folder] : {}) ||
              {};

            const photosCount = s.photosCount || (s.allImages ? s.allImages.length : 1);

            return {
              id: s.id,
              filename: s.filename,
              image: s.image,
              name: localCustom.title || s.title || s.name || `Decoration ${s.id}`,
              des:
                localCustom.description ||
                s.subtitle ||
                s.des ||
                "Bespoke floral styling designed with international grade blooms for extraordinary luxury events.",
              tag:
                localCustom.tag ||
                s.tag ||
                (photosCount > 1 ? `${photosCount} PHOTOS` : "FEATURED COLLECTION"),
              link: localCustom.link || s.link || "#gallery",
              folder: s.folder,
              isFolder: s.isFolder,
              photosCount,
              allImages: s.allImages || [],
            };
          }
        );

        // If fewer than 4 items, loop them so the tray has at least 4 cards for expanding animation
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

  // Automatic rotation timer - pauses when modal is open or section is off-screen
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (isGalleryOpen || !isInViewport) return; // Pause timer when off-screen or modal open

    timerRef.current = setInterval(() => {
      handleNext();
    }, AUTO_PLAY_INTERVAL);
  }, [handleNext, isGalleryOpen, isInViewport]);

  useEffect(() => {
    if (slides.length <= 1) return;

    if (isGalleryOpen || !isInViewport) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    resetTimer();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer, slides.length, isGalleryOpen, isInViewport]);

  const onManualNext = () => {
    handleNext();
    resetTimer();
  };

  const onManualPrev = () => {
    handlePrev();
    resetTimer();
  };

  // Open the gallery modal for a specific decoration category/item
  const handleOpenGallery = (item: CarouselSlideItem) => {
    setActiveGalleryItem(item);
    setIsGalleryOpen(true);
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="carousel-section"
        id="gallery"
        aria-label="Expanding Card Photo Carousel"
      >
        {/* Main Expanding Card Carousel Container */}
        <div className="container">
          {slides.length === 0 ? (
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
                Drop your decoration folders into <code>public/assets/carousel/</code>
                <br />
                Each folder (e.g. <code>decorated cars</code>, <code>mundup</code>) will display one cover photo here!
              </p>
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
                      <div className="seeMore">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenGallery(item);
                          }}
                          aria-label={`See more photos of ${item.name}`}
                        >
                          See More →
                        </button>
                      </div>
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

      {/* Exquisite Decoration Gallery Modal with Lightbox */}
      <DecorationGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialItem={activeGalleryItem}
        allItems={slides}
      />
    </>
  );
}
