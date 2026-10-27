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
import DailyMalaSection from "@/components/DailyMalaSection";
import SmoothScroll, { resetScrollToTop } from "@/components/SmoothScroll";
import { useEffect } from "react";

export default function HomePage() {
  const [currentView, setCurrentView] = useState<"home" | "about" | "admin" | "mala">("home");

  const handleOpenAbout = () => {
    setCurrentView("about");
    resetScrollToTop();
  };

  const handleOpenHome = () => {
    setCurrentView("home");
    resetScrollToTop();
  };

  const handleOpenAdmin = () => {
    setCurrentView("admin");
    resetScrollToTop();
  };

  const handleOpenMala = () => {
    setCurrentView("mala");
    resetScrollToTop();
  };

  return (
    <SmoothScroll>
      <Header
        currentView={currentView}
        onAboutClick={handleOpenAbout}
        onHomeClick={handleOpenHome}
        onAdminClick={handleOpenAdmin}
        onMalaClick={handleOpenMala}
      />

      {currentView === "about" ? (
        <AboutUs onBack={handleOpenHome} />
      ) : currentView === "admin" ? (
        <AdminPortalView onBack={handleOpenHome} />
      ) : currentView === "mala" ? (
        <DailyMalaSection onBack={handleOpenHome} />
      ) : (
        <main className="landing-main-wrapper">
          {/* Screen 1: Hero Landing View */}
          <HeroSection onMalaClick={handleOpenMala} />

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
