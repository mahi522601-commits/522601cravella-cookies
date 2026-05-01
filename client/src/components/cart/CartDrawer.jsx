import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiShoppingBag, FiX } from "react-icons/fi";
import Button from "@/components/ui/Button";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import { useCartStore } from "@/store/cartStore";

const CartDrawer = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const subtotal = useCartStore((state) => state.getSubtotal());

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[70] bg-brand-dark/45 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCart}
        >
          <motion.aside
            className="ml-auto flex h-full w-full max-w-xl flex-col bg-brand-white shadow-soft"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 180, damping: 24 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-brand-brown/10 px-5 py-5">
              <div>
                <p className="section-kicker">Your Cart</p>
                <h2 className="mt-1 text-2xl font-semibold text-brand-dark">Fresh picks</h2>
              </div>
              <button
                className="rounded-full border border-brand-brown/10 p-2 text-brand-brown"
                onClick={closeCart}
                aria-label="Close cart"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {items.length ? (
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItem key={item.productId} item={item} />
                  ))}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-light text-brand-brown">
                    <FiShoppingBag className="h-8 w-8" />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold">Your cart is empty</h3>
                  <p className="mt-3 max-w-xs text-brand-brown/70">
                    Start shopping and build your first fresh batch of cookies.
                  </p>
                  <Link to="/shop" onClick={closeCart} className="mt-6">
                    <Button>Start Shopping</Button>
                  </Link>
                </div>
              )}
            </div>

            {items.length ? (
              <div className="border-t border-brand-brown/10 px-5 py-5">
                <CartSummary subtotal={subtotal} compact />
                <Button
                  fullWidth
                  className="mt-4"
                  onClick={() => {
                    closeCart();
                    navigate("/checkout");
                  }}
                >
                  Proceed to Checkout
                </Button>
              </div>
            ) : null}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default CartDrawer;
