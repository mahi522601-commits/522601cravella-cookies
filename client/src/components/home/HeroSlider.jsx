import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { fetchHeroSlides } from "@/services/firestore";
import Button from "@/components/ui/Button";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const fallbackSlides = [
  {
    id: "fallback-1",
    title: "Freshly baked joy from Karimnagar",
    subtitle:
      "Small-batch cookies with premium ingredients, careful hygiene, and a handcrafted finish.",
    ctaLabel: "Shop Cookies",
    ctaLink: "/shop",
  },
  {
    id: "fallback-2",
    title: "Gift-worthy boxes for every sweet moment",
    subtitle:
      "From cozy cravings to celebrations, Cravella delivers warm cookie moments across India.",
    ctaLabel: "Explore Gift Boxes",
    ctaLink: "/shop",
  },
];

const contentVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const HeroSlider = () => {
  const [slides, setSlides] = useState(fallbackSlides);

  useEffect(() => {
    let mounted = true;

    const loadSlides = async () => {
      try {
        const response = await fetchHeroSlides();
        const activeSlides = response.filter((item) => item.isActive !== false).slice(0, 2);

        if (mounted && activeSlides.length) {
          setSlides(activeSlides);
        }
      } catch {
        // Fallback content already rendered.
      }
    };

    loadSlides();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        effect="fade"
        speed={900}
        loop={slides.length > 1}
        pagination={{ clickable: true }}
        className="hero-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative flex min-h-[80vh] items-center lg:min-h-screen">
              <motion.div
                className="absolute inset-0"
                animate={{ scale: [1, 1.08, 1.03] }}
                transition={{ duration: 9, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                style={
                  slide.imageUrl
                    ? {
                        backgroundImage: `url(${slide.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              >
                {!slide.imageUrl ? (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(201,136,42,0.35),_transparent_25%),linear-gradient(135deg,_rgba(59,31,20,0.92),_rgba(107,58,42,0.82)_55%,_rgba(201,136,42,0.62))]" />
                ) : null}
              </motion.div>
              <div className="hero-overlay absolute inset-0" />
              <div className="page-shell relative z-10 py-20">
                <div className="max-w-3xl">
                  <motion.p
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="section-kicker text-brand-beige"
                  >
                    Premium Homemade Cookies
                  </motion.p>
                  <motion.h1
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2, duration: 0.7 }}
                    className="mt-5 text-5xl font-semibold leading-tight text-brand-white sm:text-6xl lg:text-7xl"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.35, duration: 0.7 }}
                    className="mt-6 max-w-2xl text-lg text-brand-cream/85 sm:text-xl"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.div
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.48, duration: 0.7 }}
                    className="mt-10"
                  >
                    <Link to={slide.ctaLink || "/shop"}>
                      <Button size="lg" className="shadow-soft">
                        {slide.ctaLabel || "Shop Now"}
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSlider;
