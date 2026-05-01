import { cn } from "@/utils/cn";

const palette = {
  bestseller: "bg-brand-gold text-brand-dark",
  new: "bg-brand-success/10 text-brand-success",
  limited: "bg-brand-brown text-brand-cream",
  default: "bg-brand-brown/10 text-brand-brown",
};

const labelMap = {
  bestseller: "Bestseller",
  new: "New",
  limited: "Limited",
};

const Badge = ({ value, className }) => {
  if (!value) {
    return null;
  }

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.2em]",
        palette[value] || palette.default,
        className,
      )}
    >
      {labelMap[value] || value}
    </span>
  );
};

export default Badge;
