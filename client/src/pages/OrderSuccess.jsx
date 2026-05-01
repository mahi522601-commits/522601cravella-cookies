import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { FiCheck, FiMessageCircle, FiShoppingBag } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { useOrder } from "@/hooks/useOrders";
import { useUiStore } from "@/store/uiStore";
import { formatCurrency } from "@/utils/formatCurrency";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");
  const { order, loading } = useOrder(orderId);
  const siteSettings = useUiStore((state) => state.siteSettings);

  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Order Placed | Cravella Cookies</title>
        <meta name="description" content="Your Cravella Cookies order has been placed successfully." />
      </Helmet>

      <section className="page-shell py-16">
        <div className="mx-auto max-w-3xl">
          <div className="card-surface overflow-hidden p-8 text-center sm:p-10">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
              className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brand-success text-white"
            >
              <FiCheck className="h-10 w-10" />
            </motion.div>

            <p className="section-kicker mt-8">Order confirmed in queue</p>
            <h1 className="mt-3 text-4xl font-semibold">Your order has been placed!</h1>
            <p className="mt-4 text-brand-brown/75">
              We will confirm after payment verification and share updates on WhatsApp.
            </p>
            <div className="mt-6 inline-flex rounded-full bg-brand-light px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-brand-brown">
              {orderId}
            </div>

            {loading ? (
              <div className="mt-8 flex justify-center">
                <Spinner className="h-6 w-6 text-brand-brown" />
              </div>
            ) : order ? (
              <div className="mt-8 rounded-[1.75rem] bg-brand-light/70 p-6 text-left">
                <h2 className="text-xl font-semibold">Order recap</h2>
                <div className="mt-4 space-y-3">
                  {order.orderItems?.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-brand-dark">{item.name}</p>
                        <p className="text-sm text-brand-brown/70">Qty {item.qty}</p>
                      </div>
                      <p className="font-bold text-brand-brown">
                        {formatCurrency(item.price * item.qty)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/shop">
                <Button icon={<FiShoppingBag />}>Continue Shopping</Button>
              </Link>
              <a
                href={`https://wa.me/${siteSettings.whatsappNumber}?text=Hi+CravellaCookies!+I+just+placed+Order+${orderId}.+Please+confirm.`}
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="secondary" icon={<FiMessageCircle />}>
                  WhatsApp Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderSuccess;
