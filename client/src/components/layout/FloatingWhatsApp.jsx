import { FiMessageCircle } from "react-icons/fi";
import { useUiStore } from "@/store/uiStore";

const FloatingWhatsApp = () => {
  const siteSettings = useUiStore((state) => state.siteSettings);

  return (
    <a
      href={`https://wa.me/${siteSettings.whatsappNumber}?text=Hi+CravellaCookies`}
      target="_blank"
      rel="noreferrer"
      className="group fixed bottom-5 right-5 z-40"
      aria-label="Chat with us on WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-70 animate-pulseRing" />
      <span className="absolute right-16 top-1/2 hidden -translate-y-1/2 rounded-full bg-brand-dark px-3 py-2 text-xs font-bold text-brand-cream shadow-soft group-hover:block">
        Chat with us on WhatsApp
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition group-hover:scale-105">
        <FiMessageCircle className="h-7 w-7" />
      </span>
    </a>
  );
};

export default FloatingWhatsApp;
