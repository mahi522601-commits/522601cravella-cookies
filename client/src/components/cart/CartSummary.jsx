import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/utils/formatCurrency";

const CartSummary = ({ subtotal, checkoutLink = "/checkout", compact = false }) => (
  <div className="card-surface p-6 sm:p-7">
    <h2 className="text-2xl font-semibold text-brand-dark">Order Summary</h2>
    <div className="mt-6 space-y-4 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-brand-brown/70">Subtotal</span>
        <span className="font-semibold text-brand-dark">{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-brand-brown/70">Shipping</span>
        <span className="rounded-full bg-brand-success/10 px-3 py-1 font-bold text-brand-success">
          Free Shipping!
        </span>
      </div>
      <div className="border-t border-brand-brown/10 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-black uppercase tracking-[0.18em] text-brand-brown">
            Total
          </span>
          <span className="text-2xl font-black text-brand-brown">{formatCurrency(subtotal)}</span>
        </div>
      </div>
    </div>
    {!compact ? (
      <Link to={checkoutLink} className="mt-6 block">
        <Button fullWidth>Proceed to Checkout</Button>
      </Link>
    ) : null}
  </div>
);

export default CartSummary;
