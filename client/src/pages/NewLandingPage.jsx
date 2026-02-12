import React from "react";
import HeroSection from "../components/sections/HeroSection";
import PopularTripsSection from "../components/sections/PopularTripsSection";
import Footer from "../components/sections/Footer";

export default function NewLandingPage() {
  return (
    <div className="bg-white text-slate-900 scroll-smooth">
      <HeroSection />
      <PopularTripsSection />
      <Footer />
    </div>
  );
}