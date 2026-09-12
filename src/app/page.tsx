import Hero from "@/components/home/Hero";
import OfferBanner from "@/components/home/OfferBanner";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import ExperiencesSection from "@/components/experiences/ExperiencesSection";
import WhyUs from "@/components/home/WhyUs";
import RecommendationTeaser from "@/components/home/RecommendationTeaser";
import LoyaltyTeaser from "@/components/home/LoyaltyTeaser";
import Testimonials from "@/components/home/Testimonials";
import MapMock from "@/components/home/MapMock";

export default function Home() {
  return (
    <>
      <Hero />
      <OfferBanner />
      <FeaturedVehicles />
      <ExperiencesSection />
      <WhyUs />
      <RecommendationTeaser />
      <MapMock />
      <LoyaltyTeaser />
      <Testimonials />
    </>
  );
}
