import { Link } from "react-router-dom";
import { FiInstagram, FiMapPin, FiMessageCircle } from "react-icons/fi";
import { useUiStore } from "@/store/uiStore";

const Footer = () => {
  const siteSettings = useUiStore((state) => state.siteSettings);

  return (
    <footer className="mt-20 border-t border-brand-brown/10 bg-brand-dark text-brand-cream">
      <div className="page-shell grid gap-10 py-14 md:grid-cols-[1.2fr_0.8fr_1fr]">
        <div>
          <p className="section-kicker text-brand-beige/70">Cravella Cookies</p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-white">
            Warm cookies, crafted with care in Karimnagar.
          </h2>
          <p className="mt-4 max-w-md text-brand-cream/75">
            Made with love in Karimnagar 🍪 Premium homemade cookies for gifting,
            celebrations, and everyday cravings across India.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Explore</h3>
          <div className="mt-4 grid gap-3 text-sm">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Visit & Chat</h3>
          <div className="mt-4 space-y-4 text-sm text-brand-cream/80">
            <p className="flex items-start gap-3">
              <FiMapPin className="mt-0.5 h-5 w-5" />
              Karimnagar, Vavilapally SR Junior College, 10-4-239
            </p>
            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/${siteSettings.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 p-3 text-white transition hover:bg-white/10"
                aria-label="WhatsApp"
              >
                <FiMessageCircle className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 p-3 text-white transition hover:bg-white/10"
                aria-label="Instagram"
              >
                <FiInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
