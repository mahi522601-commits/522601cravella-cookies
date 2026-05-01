import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import AppRouter from "@/routes/AppRouter";
import CartDrawer from "@/components/cart/CartDrawer";
import ChatBot from "@/components/layout/ChatBot";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import { useAuth } from "@/hooks/useAuth";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

const App = () => {
  useAuth();
  useSiteSettings();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <ErrorBoundary>
      <AppRouter />
      {!isAdminRoute && (
        <>
          <CartDrawer />
          <ChatBot />
          <FloatingWhatsApp />
        </>
      )}
      <Toaster
        position={typeof window !== "undefined" && window.innerWidth < 768 ? "top-center" : "bottom-right"}
        toastOptions={{
          duration: 3500,
          className:
            "rounded-2xl border border-brand-brown/10 bg-brand-white text-brand-dark shadow-warm",
          success: {
            iconTheme: {
              primary: "rgb(var(--brand-success))",
              secondary: "rgb(var(--brand-white))",
            },
          },
          error: {
            iconTheme: {
              primary: "rgb(var(--brand-error))",
              secondary: "rgb(var(--brand-white))",
            },
          },
        }}
      />
    </ErrorBoundary>
  );
};

export default App;
