import Link from "next/link";
import Hero from "./components/user/Hero";
import RoomTypeSection from "./components/user/RoomTypeSection";
import FeaturedRooms from "./components/user/FeaturedRooms";
import AmenitiesSection from "./components/user/AmenitiesSection";
import CTASection from "./components/user/CTASection";
import Footer from "./components/user/Footer";
import Navbar from "./components/user/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <RoomTypeSection />
      <FeaturedRooms />
      <AmenitiesSection />
      <CTASection />
      <Footer />
    </>
  );
}
