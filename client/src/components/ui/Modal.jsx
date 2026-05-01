import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { cn } from "@/utils/cn";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  panelClassName,
  showClose = true,
}) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className={cn(
            "fixed inset-0 z-[100] flex items-end justify-center bg-brand-dark/45 p-3 backdrop-blur-md sm:items-center sm:p-6",
            className,
          )}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={cn(
              "glass-panel max-h-[90vh] w-full overflow-hidden rounded-[2rem] sm:max-w-3xl",
              panelClassName,
            )}
            initial={{ opacity: 0, y: 26, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
            onClick={(event) => event.stopPropagation()}
          >
            {(title || showClose) && (
              <div className="flex items-start justify-between gap-3 border-b border-brand-brown/10 px-5 py-4 sm:px-6">
                <div>
                  {title ? (
                    <h3 className="text-xl font-semibold text-brand-dark">{title}</h3>
                  ) : null}
                </div>
                {showClose ? (
                  <button
                    className="rounded-full p-2 text-brand-brown transition hover:bg-brand-brown/5"
                    onClick={onClose}
                    aria-label="Close modal"
                  >
                    <IoClose className="h-5 w-5" />
                  </button>
                ) : null}
              </div>
            )}
            <div className="max-h-[calc(90vh-80px)] overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
};

export default Modal;
