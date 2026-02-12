import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import VendorBenefits from "@/components/home/VendorBenefits";
import SponsorBenefits from "@/components/home/SponsorBenefits";
import FeaturedVendors from "@/components/home/FeaturedVendors";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import RaffleSection from "@/components/home/RaffleSection";
import ContactSection from "@/components/home/ContactSection";

const Index = () => (
  <Layout>
    <HeroSection />
    <VendorBenefits />
    <SponsorBenefits />
    <FeaturedVendors />
    <UpcomingEvents />
    <RaffleSection />
    <ContactSection />
  </Layout>
);

export default Index;
