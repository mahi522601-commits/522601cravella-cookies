import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

const LazyImage = ({ src, alt, className, wrapperClassName, ...props }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", wrapperClassName)}>
      {!loaded ? <div className="skeleton absolute inset-0" /> : null}
      {isVisible ? (
        <img
          src={src}
          alt={alt}
          className={cn(
            "h-full w-full object-cover transition duration-500",
            loaded ? "opacity-100" : "opacity-0",
            className,
          )}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          {...props}
        />
      ) : null}
    </div>
  );
};

export default LazyImage;
