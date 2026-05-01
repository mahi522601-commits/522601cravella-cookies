import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMessageSquare, FiSend, FiX } from "react-icons/fi";
import { useProducts } from "@/hooks/useProducts";
import { useUiStore } from "@/store/uiStore";

const faqPrompts = [
  "What cookies do you have?",
  "How to order?",
  "Delivery time?",
  "Do you ship nationwide?",
  "Payment methods?",
  "Contact us?",
  "Price list?",
];

const ChatBot = () => {
  const siteSettings = useUiStore((state) => state.siteSettings);
  const { products } = useProducts();
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "bot",
      content: "Hi! I’m Cravella’s cookie guide. Tap a question and I’ll help you out.",
    },
  ]);

  useEffect(() => {
    if (!open) {
      setTyping(false);
    }
  }, [open]);

  if (!siteSettings.chatbotEnabled) {
    return null;
  }

  const buildReply = (prompt) => {
    const categoryList = [...new Set(products.map((item) => item.category))]
      .map((item) => item.replace("-", " "))
      .join(", ");

    switch (prompt) {
      case "What cookies do you have?":
        return `We currently offer ${categoryList || "cookies, gift boxes, and seasonal specials"}. Open Shop to see the full range.`;
      case "How to order?":
        return "Browse the shop, add your favourites to cart, fill in delivery details, pay via UPI, upload the payment screenshot, and place the order.";
      case "Delivery time?":
        return "We usually deliver in 3–7 business days across India depending on your location.";
      case "Do you ship nationwide?":
        return "Yes! We deliver all over India from our kitchen in Karimnagar.";
      case "Payment methods?":
        return "UPI payments are supported via PhonePe, Google Pay, and Paytm.";
      case "Contact us?":
        return `You can WhatsApp us directly at +${siteSettings.whatsappNumber}.`;
      case "Price list?":
        return products.length
          ? products
              .slice(0, 4)
              .map((item) => `${item.name} - Rs. ${item.price}`)
              .join(" | ")
          : "Our bestselling cookie packs start at artisan-friendly prices. Open Shop for the latest range.";
      default:
        return "I can help with products, delivery, payments, or how to place an order.";
    }
  };

  const handlePrompt = (prompt) => {
    const userMessage = { id: `${Date.now()}-user`, role: "user", content: prompt };
    setMessages((current) => [...current, userMessage]);
    setTyping(true);

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: `${Date.now()}-bot`, role: "bot", content: buildReply(prompt) },
      ]);
      setTyping(false);
    }, 700);
  };

  return (
    <div className="fixed bottom-24 right-5 z-40">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            className="glass-panel mb-4 flex h-[400px] w-[300px] flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-brand-brown/10 bg-brand-brown px-4 py-3 text-brand-cream">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-beige">
                  Cookie Chat
                </p>
                <p className="font-display text-lg">Need help ordering?</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chatbot">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto bg-brand-white px-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm shadow-soft ${
                    message.role === "user"
                      ? "ml-auto bg-brand-brown text-brand-cream"
                      : "bg-brand-light text-brand-dark"
                  }`}
                >
                  {message.content}
                </div>
              ))}
              {typing ? (
                <div className="flex max-w-[86%] gap-1 rounded-2xl bg-brand-light px-4 py-3 shadow-soft">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand-brown/55 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand-brown/55 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand-brown/55" />
                </div>
              ) : null}
            </div>
            <div className="space-y-3 border-t border-brand-brown/10 bg-brand-cream/55 px-3 py-3">
              <div className="flex flex-wrap gap-2">
                {faqPrompts.slice(0, 4).map((prompt) => (
                  <button
                    key={prompt}
                    className="rounded-full border border-brand-brown/10 bg-white px-3 py-2 text-left text-xs font-semibold text-brand-brown transition hover:bg-brand-light"
                    onClick={() => handlePrompt(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <button
                className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-brown px-4 py-3 text-sm font-bold text-brand-cream"
                onClick={() => handlePrompt(faqPrompts[(messages.length - 1) % faqPrompts.length])}
              >
                <FiSend className="h-4 w-4" />
                Ask another question
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <button
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold text-brand-dark shadow-soft transition hover:scale-105"
        onClick={() => setOpen((value) => !value)}
        aria-label="Open chatbot"
      >
        {open ? <FiX className="h-6 w-6" /> : <FiMessageSquare className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default ChatBot;
