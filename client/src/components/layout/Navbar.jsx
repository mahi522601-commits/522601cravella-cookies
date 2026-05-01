import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiMessageCircle, FiSearch, FiShoppingBag, FiX } from "react-icons/fi";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import logo from "@/assets/logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const itemCount = useCartStore((state) => state.getItemCount());
  const openCart = useCartStore((state) => state.openCart);
  const mobileNavOpen = useUiStore((state) => state.mobileNavOpen);
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);
  const cartPulseKey = useUiStore((state) => state.cartPulseKey);
  const siteSettings = useUiStore((state) => state.siteSettings);
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = () => setMobileNavOpen(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition duration-300 ${
          scrolled
            ? "border-b border-brand-brown/10 bg-brand-white/80 shadow-soft backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="page-shell flex items-center justify-between gap-4 py-3">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="Cravella Cookies"
              className="h-12 w-12 rounded-full object-cover shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] font-black uppercase tracking-[0.38em] text-brand-brown/70">
                Karimnagar
              </span>
              <span className="font-display text-xl font-semibold text-brand-dark sm:text-2xl">
                cravella cookies
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-bold uppercase tracking-[0.22em] transition-colors ${
                    isActive ? "text-brand-brown" : "text-brand-dark/75 hover:text-brand-brown"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="rounded-full border border-brand-brown/10 bg-white/70 p-3 text-brand-brown transition hover:bg-brand-light"
              aria-label="Search products"
              onClick={() => navigate("/shop")}
            >
              <FiSearch className="h-5 w-5" />
            </button>
            
            <a
              href={`https://wa.me/${siteSettings?.whatsappNumber}?text=Hi+CravellaCookies`}
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-full border border-brand-brown/10 bg-white/70 p-3 text-brand-brown transition hover:bg-brand-light sm:inline-flex"
              aria-label="Open WhatsApp"
            >
              <FiMessageCircle className="h-5 w-5" />
            </a>

            <button
              className="relative rounded-full border border-brand-brown/10 bg-white/70 p-3 text-brand-brown transition hover:bg-brand-light"
              aria-label="Open cart"
              onClick={openCart}
            >
              <FiShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <motion.span
                  key={cartPulseKey}
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] font-black text-brand-dark"
                  initial={{ scale: 0.85 }}
                  animate={{ scale: [1, 1.18, 1] }}
                  transition={{ duration: 0.45 }}
                >
                  {itemCount}
                </motion.span>
              )}
            </button>

            <button
              className="rounded-full border border-brand-brown/10 bg-white/70 p-3 text-brand-brown transition hover:bg-brand-light lg:hidden"
              aria-label="Open menu"
              onClick={() => setMobileNavOpen(true)}
            >
              <FiMenu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileNavOpen && (
          <>
            {/* Backdrop: Clicking the dark area now closes the menu */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[60] bg-brand-dark/50 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-xs flex-col bg-brand-white p-6 shadow-soft lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 180, damping: 24 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={logo} alt="Logo" className="h-11 w-11 rounded-full" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-brand-brown/60">Karimnagar</p>
                    <p className="font-display text-lg font-semibold text-brand-dark">cravella cookies</p>
                  </div>
                </div>

                {/* X Button: Fixed click handler */}
                <button
                  type="button"
                  className="rounded-full border border-brand-brown/15 bg-brand-light p-2.5 text-brand-brown"
                  onClick={closeMenu}
                  aria-label="Close menu"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-8 space-y-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `flex items-center rounded-2xl px-4 py-3 text-base font-semibold transition ${
                        isActive
                          ? "bg-brand-brown text-brand-cream"
                          : "bg-brand-light text-brand-dark hover:bg-brand-beige"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>

              <div className="mt-auto border-t border-brand-brown/10 pt-6">
                <a
                  href={`https://wa.me/${siteSettings?.whatsappNumber}?text=Hi+CravellaCookies`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-700 transition hover:bg-green-100"
                  onClick={closeMenu}
                >
                  <FiMessageCircle className="h-5 w-5" />
                  Chat on WhatsApp
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;