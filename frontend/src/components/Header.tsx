"use client";

import { useState, useEffect } from "react";
import { scrollToSection } from "./SmoothScroll";

interface HeaderProps {
  currentView?: "home" | "about";
  onAboutClick?: () => void;
  onHomeClick?: () => void;
}

export default function Header({
  currentView = "home",
  onAboutClick,
  onHomeClick,
}: HeaderProps) {
  const [lang, setLang] = useState<"NL" | "EN">("EN");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId?: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (sectionId === "about") {
      onAboutClick?.();
      return;
    }

    if (currentView === "about") {
      onHomeClick?.();
    }

    if (sectionId) {
      if (currentView === "about") {
        setTimeout(() => scrollToSection(sectionId), 200);
      } else {
        scrollToSection(sectionId);
      }
    }
  };

  return (
    <header className={`top-header ${isScrolled ? "is-scrolled" : ""}`}>
      {/* Brand Logo */}
      <a
        href="#"
        className="header-logo"
        aria-label="Home"
        onClick={(e) => {
          e.preventDefault();
          onHomeClick?.();
          scrollToSection(0);
        }}
      >
        <img
          src="/assets/jnr_logo.png"
          alt="JNR"
          className="header-brand-img"
        />
      </a>

      {/* Navigation Links */}
      <nav aria-label="Main navigation">
        <ul className="header-nav">
          <li>
            <a href="#gallery" onClick={handleNavClick("gallery")}>
              Categories
            </a>
          </li>
          <li>
            <a href="#inspiration" onClick={handleNavClick("inspiration")}>
              Inspiration
            </a>
          </li>
          <li>
            <button
              type="button"
              className={`nav-text-btn ${currentView === "about" ? "active" : ""}`}
              onClick={handleNavClick("about")}
            >
              About us
            </button>
          </li>
          <li>
            <a href="#contact" onClick={handleNavClick("contact")}>
              Contact
            </a>
          </li>
        </ul>
      </nav>

      {/* Language Switcher & Webshop Button */}
      <div className="header-actions">
        <div className="lang-switcher">
          <button
            type="button"
            className={`lang-btn ${lang === "NL" ? "active" : ""}`}
            onClick={() => setLang("NL")}
          >
            HN
          </button>
          <span className="lang-divider">|</span>
          <button
            type="button"
            className={`lang-btn ${lang === "EN" ? "active" : ""}`}
            onClick={() => setLang("EN")}
          >
            EN
          </button>
        </div>

        <a href="#webshop" className="header-btn">
          Webshop
          <span className="btn-icon">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </span>
        </a>
      </div>
    </header>
  );
}
