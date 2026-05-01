import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";

const Cart = () => {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());

  return (
    <>
      <Helmet>
        <title>Your Cart | Cravella Cookies</title>
        <meta name="description" content="Review your cookie cart and proceed to checkout." />
      </Helmet>

      <section className="page-shell py-14">
        <div className="max-w-2xl">
          <p className="section-kicker">Your Selection</p>
          <h1 className="mt-3 text-5xl font-semibold">Cart</h1>
        </div>

        {items.length ? (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
            </div>
            <div className="lg:sticky lg:top-28 lg:self-start">
              <CartSummary subtotal={subtotal} />
            </div>
          </div>
        ) : (
          <div className="card-surface mt-10 px-6 py-16 text-center">
            <h2 className="text-3xl font-semibold">Your cart is still empty.</h2>
            <p className="mt-4 text-brand-brown/70">
              Let’s change that with a fresh batch from the shop.
            </p>
            <Link to="/shop" className="mt-6 inline-block">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        )}
      </section>
    </>
  );
};

export default Cart;
