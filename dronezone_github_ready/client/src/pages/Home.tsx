import { Helmet } from "react-helmet";
import HeroCarousel from "@/components/home/HeroCarousel";
import CategorySection from "@/components/home/CategorySection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import DealOfTheDay from "@/components/home/DealOfTheDay";
import Accessories from "@/components/home/Accessories";
import Testimonials from "@/components/home/Testimonials";
import BlogSection from "@/components/home/BlogSection";
import Newsletter from "@/components/home/Newsletter";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>DroneZone - Your Premier Drone Marketplace</title>
        <meta 
          name="description" 
          content="Shop the latest consumer, professional, and racing drones. Free shipping on orders over $100. Authorized retailer for DJI, Autel, and more."
        />
        <meta property="og:title" content="DroneZone - Your Premier Drone Marketplace" />
        <meta 
          property="og:description" 
          content="Shop the latest consumer, professional, and racing drones with free shipping on orders over $100."
        />
      </Helmet>

      <HeroCarousel />
      <CategorySection />
      <FeaturedProducts />
      <DealOfTheDay />
      <Accessories />
      <Testimonials />
      <BlogSection />
      <Newsletter />
    </>
  );
};

export default Home;
