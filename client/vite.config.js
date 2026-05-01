import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
          motion: ["framer-motion"],
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],
          charts: ["recharts"],
          storefront: ["swiper", "qrcode.react", "canvas-confetti"],
          state: ["zustand", "clsx", "tailwind-merge", "date-fns"],
          icons: ["react-icons"],
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
