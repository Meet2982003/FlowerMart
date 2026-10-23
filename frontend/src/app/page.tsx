"use client";

import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import FlowerHero from "@/components/FlowerHero";
import PhotoCarousel from "@/components/PhotoCarousel";
import VaseFlowerSection from "@/components/VaseFlowerSection";
import ContactSection from "@/components/ContactSection";
import AboutUs from "@/components/AboutUs";
import AdminPortalView from "@/components/AdminPortalView";
import SmoothScroll from "@/components/SmoothScroll";

export default function HomePage() {
  const [currentView, setCurrentView] = useState<"home" | "about" | "admin">("home");

  const handleOpenAbout = () => {
    setCurrentView("about");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleOpenHome = () => {
    setCurrentView("home");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleOpenAdmin = () => {
    setCurrentView("admin");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <SmoothScroll>
      <Header
        currentView={currentView}
        onAboutClick={handleOpenAbout}
        onHomeClick={handleOpenHome}
        onAdminClick={handleOpenAdmin}
      />

      {currentView === "about" ? (
        <AboutUs onBack={handleOpenHome} />
      ) : currentView === "admin" ? (
        <AdminPortalView onBack={handleOpenHome} />
      ) : (
        <main className="landing-main-wrapper">
          {/* Screen 1: Hero Landing View */}
          <HeroSection />

          {/* Screen 2: Soft Petal Pink Logistics Intro with Hanging Bloom */}
          <IntroSection onAboutClick={handleOpenAbout} />

          {/* Screen 3: Pinned Animated Rotating Flower Section */}
          <FlowerHero />

          {/* Screen 4: Automatic Photo Showcase Carousel */}
          <PhotoCarousel />

          {/* Screen 5: Living Botanical Glass Vase Showcase with Falling Petals */}
          <VaseFlowerSection />

          {/* Screen 6: Interactive Contact Section with Flower Animations */}
          <ContactSection />
        </main>
      )}
    </SmoothScroll>
  );
}
