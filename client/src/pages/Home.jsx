import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import HeroSlider from "@/components/home/HeroSlider";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyUs from "@/components/home/WhyUs";
import Testimonials from "@/components/home/Testimonials";
import AboutSection from "@/components/home/AboutSection";

const Home = () => (
  <>
    <Helmet>
      <title>Cravella Cookies | Premium Homemade Cookies from Karimnagar</title>
      <meta
        name="description"
        content="Freshly baked premium cookies, gift boxes, and seasonal treats delivered across India from Karimnagar."
      />
    </Helmet>

    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <HeroSlider />
      <FeaturedProducts />
      <WhyUs />
      <Testimonials />
      <AboutSection />
    </motion.div>
  </>
);

export default Home;
