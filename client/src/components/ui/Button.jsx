import Spinner from "./Spinner";
import { cn } from "@/utils/cn";

const variants = {
  primary:
    "bg-brand-brown text-brand-cream hover:bg-brand-dark focus:ring-brand-gold/40",
  secondary:
    "border border-brand-brown/20 bg-white text-brand-brown hover:bg-brand-light focus:ring-brand-gold/30",
  ghost:
    "bg-transparent text-brand-brown hover:bg-brand-brown/5 focus:ring-brand-gold/30",
  success:
    "bg-brand-success text-white hover:brightness-95 focus:ring-brand-success/30",
  danger: "bg-brand-error text-white hover:brightness-95 focus:ring-brand-error/30",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-sm sm:text-base",
  lg: "px-6 py-3.5 text-base",
};

const Button = ({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  type = "button",
  ...props
}) => (
  <button
    type={type}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-full font-bold transition duration-200 focus:ring-4 disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.97]",
      variants[variant],
      sizes[size],
      fullWidth && "w-full",
      className,
    )}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading ? <Spinner className="h-4 w-4" /> : icon}
    <span>{children}</span>
    {!loading ? iconRight : null}
  </button>
);

export default Button;
