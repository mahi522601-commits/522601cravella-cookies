/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          cream: "rgb(var(--brand-cream) / <alpha-value>)",
          beige: "rgb(var(--brand-beige) / <alpha-value>)",
          brown: "rgb(var(--brand-brown) / <alpha-value>)",
          dark: "rgb(var(--brand-dark) / <alpha-value>)",
          gold: "rgb(var(--brand-gold) / <alpha-value>)",
          white: "rgb(var(--brand-white) / <alpha-value>)",
          light: "rgb(var(--brand-light) / <alpha-value>)",
          success: "rgb(var(--brand-success) / <alpha-value>)",
          error: "rgb(var(--brand-error) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        body: ['"Lato"', "sans-serif"],
      },
      boxShadow: {
        warm: "0 18px 45px rgba(107, 58, 42, 0.14)",
        soft: "0 10px 24px rgba(59, 31, 20, 0.12)",
      },
      backgroundImage: {
        parchment:
          "radial-gradient(circle at top, rgba(255, 253, 248, 0.96), rgba(245, 236, 215, 0.92))",
        grain:
          "linear-gradient(135deg, rgba(255,255,255,0.14) 25%, transparent 25%), linear-gradient(225deg, rgba(255,255,255,0.09) 25%, transparent 25%), linear-gradient(45deg, rgba(255,255,255,0.08) 25%, transparent 25%), linear-gradient(315deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.05) 25%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.8" },
          "70%": { transform: "scale(1.25)", opacity: "0" },
          "100%": { transform: "scale(1.3)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.12)" },
          "60%": { transform: "scale(0.95)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseRing: "pulseRing 2s ease-out infinite",
        shimmer: "shimmer 1.8s linear infinite",
        bounceSoft: "bounceSoft 0.5s ease-out",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
