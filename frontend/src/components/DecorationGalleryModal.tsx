"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Maximize2,
  Calendar,
  Layers,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { scrollToSection } from "./SmoothScroll";
import type { CarouselSlideItem } from "./PhotoCarousel";

interface DecorationGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem: CarouselSlideItem | null;
  allItems: CarouselSlideItem[];
}

export default function DecorationGalleryModal({
  isOpen,
  onClose,
  initialItem,
  allItems,
}: DecorationGalleryModalProps) {
  // Current active category
  const [selectedItem, setSelectedItem] = useState<CarouselSlideItem | null>(initialItem);

  // Lightbox state: null when closed, photo index number (0-based) when open
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Sync selectedItem when initialItem changes
  useEffect(() => {
    if (initialItem) {
      setSelectedItem(initialItem);
      setLightboxIndex(null);
    }
  }, [initialItem]);

  // Lock body scroll and handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

    // Save previous overflow style
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxIndex !== null) {
          setLightboxIndex(null); // Close lightbox first
        } else {
          onClose(); // Close modal
        }
      } else if (lightboxIndex !== null && selectedItem?.allImages) {
        const total = selectedItem.allImages.length;
        if (e.key === "ArrowRight") {
          setLightboxIndex((prev) => (prev !== null ? (prev + 1) % total : 0));
        } else if (e.key === "ArrowLeft") {
          setLightboxIndex((prev) => (prev !== null ? (prev - 1 + total) % total : 0));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, lightboxIndex, onClose, selectedItem?.allImages]);

  // Categories list with folders first
  const categoryItems = allItems.filter(
    (item) => item.allImages && item.allImages.length > 0
  );

  const images = selectedItem?.allImages || [];
  const currentPhoto = lightboxIndex !== null && images[lightboxIndex] ? images[lightboxIndex] : null;

  const handleNextPhoto = useCallback(() => {
    if (images.length <= 1) return;
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : 0));
  }, [images.length]);

  const handlePrevPhoto = useCallback(() => {
    if (images.length <= 1) return;
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : 0));
  }, [images.length]);

  const handleInquireClick = () => {
    onClose();
    setTimeout(() => {
      scrollToSection("contact");
    }, 250);
  };

  if (!isOpen || !selectedItem) return null;

  return (
    <div
      className="gallery-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-modal-title"
      data-lenis-prevent
    >
      {/* Background Dim & Ambient Blur Glows */}
      <div className="gallery-modal-backdrop" onClick={onClose} />
      <div className="gallery-modal-glow top-left" />
      <div className="gallery-modal-glow bottom-right" />

      {/* Main Modal Card */}
      <div className="gallery-modal-container" data-lenis-prevent>
        {/* Sticky Header */}
        <header className="gallery-modal-header">
          <div className="gallery-header-left">
            <button
              type="button"
              className="gallery-back-btn"
              onClick={onClose}
              aria-label="Back to carousel"
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>

            <div className="gallery-header-meta">
              <span className="gallery-header-tag">
                <Sparkles size={13} className="sparkle-icon" />
                {selectedItem.tag || "DECORATION SHOWCASE"}
              </span>
              <h2 id="gallery-modal-title" className="gallery-header-title">
                {selectedItem.name}
              </h2>
            </div>
          </div>

          <div className="gallery-header-actions">
            <button
              type="button"
              className="gallery-inquire-btn"
              onClick={handleInquireClick}
            >
              <Calendar size={15} />
              <span>Book This Decor</span>
            </button>

            <button
              type="button"
              className="gallery-close-btn"
              onClick={onClose}
              aria-label="Close gallery"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Category Tabs Bar */}
        {categoryItems.length > 1 && (
          <nav className="gallery-category-nav" aria-label="Decoration categories">
            <div className="gallery-category-tabs">
              {categoryItems.map((cat) => {
                const isActive = cat.id === selectedItem.id || cat.folder === selectedItem.folder;
                const count = cat.photosCount || cat.allImages?.length || 1;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`gallery-category-pill ${isActive ? "is-active" : ""}`}
                    onClick={() => {
                      setSelectedItem(cat);
                      setLightboxIndex(null);
                    }}
                  >
                    <Layers size={14} className="cat-icon" />
                    <span className="cat-title">{cat.name}</span>
                    <span className="cat-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}

        {/* Collection Story Description & Count Stats */}
        <div className="gallery-collection-intro">
          <p className="gallery-collection-des">{selectedItem.des}</p>
          <div className="gallery-count-pill">
            Showing all <strong>{images.length}</strong> high-resolution photographs
          </div>
        </div>

        {/* Photo Grid Showcase */}
        <div className="gallery-grid-wrapper" data-lenis-prevent>
          <div className="gallery-photos-grid">
            {images.map((img, idx) => (
              <div
                key={img.id || `${img.filename}-${idx}`}
                className="gallery-card"
                onClick={() => setLightboxIndex(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setLightboxIndex(idx);
                  }
                }}
                aria-label={`View photo ${idx + 1} of ${images.length}`}
              >
                <div className="gallery-card-image-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={`${selectedItem.name} photo ${idx + 1}`}
                    loading="lazy"
                    className="gallery-card-img"
                  />
                  <div className="gallery-card-overlay">
                    <span className="card-badge">#{String(idx + 1).padStart(2, "0")}</span>
                    <div className="card-view-indicator">
                      <Maximize2 size={16} />
                      <span>View</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer Call To Action */}
        <footer className="gallery-modal-footer">
          <div className="footer-left">
            <span className="footer-lead">Need custom floral styling for your special occasion?</span>
            <span className="footer-sub">We handcraft every design fresh to your event specifications.</span>
          </div>
          <button
            type="button"
            className="footer-cta-btn"
            onClick={handleInquireClick}
          >
            <span>Inquire About This Theme</span>
            <ArrowRight size={16} />
          </button>
        </footer>
      </div>

      {/* ====================================================================
          Full-Screen High-Resolution Lightbox Viewer
          ==================================================================== */}
      {lightboxIndex !== null && currentPhoto && (
        <div
          className="lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Photo full size viewer"
          onClick={() => setLightboxIndex(null)}
          data-lenis-prevent
        >
          {/* Lightbox Top Bar */}
          <div className="lightbox-top-bar" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-photo-info">
              <span className="lightbox-category-name">{selectedItem.name}</span>
              <span className="lightbox-counter">
                {lightboxIndex + 1} / {images.length}
              </span>
            </div>

            <div className="lightbox-top-actions">
              <button
                type="button"
                className="lightbox-btn"
                onClick={() => setLightboxIndex(null)}
                aria-label="Close viewer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Centered Main Image */}
          <div className="lightbox-stage" onClick={(e) => e.stopPropagation()}>
            {images.length > 1 && (
              <button
                type="button"
                className="lightbox-nav-btn prev"
                onClick={handlePrevPhoto}
                aria-label="Previous photo (Left arrow)"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            <div className="lightbox-img-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={currentPhoto.url}
                src={currentPhoto.url}
                alt={`${selectedItem.name} - Photo ${lightboxIndex + 1}`}
                className="lightbox-main-img"
              />
            </div>

            {images.length > 1 && (
              <button
                type="button"
                className="lightbox-nav-btn next"
                onClick={handleNextPhoto}
                aria-label="Next photo (Right arrow)"
              >
                <ChevronRight size={28} />
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Strip */}
          {images.length > 1 && (
            <div className="lightbox-filmstrip-bar" onClick={(e) => e.stopPropagation()}>
              <div className="lightbox-filmstrip">
                {images.map((thumb, tIdx) => {
                  const isCurrent = tIdx === lightboxIndex;
                  return (
                    <button
                      key={thumb.id || `${thumb.filename}-${tIdx}`}
                      type="button"
                      className={`filmstrip-thumb ${isCurrent ? "is-active" : ""}`}
                      onClick={() => setLightboxIndex(tIdx)}
                      aria-label={`Jump to photo ${tIdx + 1}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={thumb.url} alt="" loading="lazy" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
