import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import VendorBenefits from "@/components/home/VendorBenefits";
import SponsorBenefits from "@/components/home/SponsorBenefits";
import FeaturedVendors from "@/components/home/FeaturedVendors";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import GallerySection from "@/components/home/GallerySection";
import RaffleSection from "@/components/home/RaffleSection";
import ContactSection from "@/components/home/ContactSection";

const Index = () => (
  <Layout>
    <HeroSection />
    <AboutSection />
    <VendorBenefits />
    <SponsorBenefits />
    <FeaturedVendors />
    <UpcomingEvents />
    <GallerySection />
    <RaffleSection />
    <ContactSection />
  </Layout>
);

export default Index;
