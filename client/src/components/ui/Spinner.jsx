import { cn } from "@/utils/cn";

const Spinner = ({ className = "" }) => (
  <span
    className={cn(
      "inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-r-transparent",
      className,
    )}
    aria-hidden="true"
  />
);

export default Spinner;
