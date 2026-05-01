import { Link } from "react-router-dom";
import { FiTruck } from "react-icons/fi";
import { formatCurrency } from "@/utils/formatCurrency";

const OrderSummary = ({ items, subtotal }) => (
  <section className="card-surface p-6 sm:p-7">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="section-kicker">Step 1</p>
        <h2 className="mt-2 text-2xl font-semibold">Order Summary</h2>
      </div>
      <Link to="/cart" className="text-sm font-bold text-brand-brown">
        Edit Cart
      </Link>
    </div>

    <div className="mt-6 rounded-3xl bg-brand-success/10 px-4 py-3 text-sm font-bold text-brand-success">
      <div className="flex items-center gap-2">
        <FiTruck className="h-4 w-4" />
        FREE SHIPPING! Your order total already includes delivery.
      </div>
    </div>

    <div className="mt-6 space-y-4">
      {items.map((item) => (
        <div key={item.productId} className="flex items-center gap-4 rounded-[1.5rem] bg-brand-light/70 p-4">
          <div className="h-16 w-16 overflow-hidden rounded-2xl bg-white">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs font-bold text-brand-brown">
                {item.name}
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-brand-dark">{item.name}</p>
            <p className="text-sm text-brand-brown/70">Qty {item.qty}</p>
          </div>
          <p className="font-black text-brand-brown">{formatCurrency(item.price * item.qty)}</p>
        </div>
      ))}
    </div>

    <div className="mt-6 border-t border-brand-brown/10 pt-5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-brand-brown/70">Subtotal</span>
        <span className="font-semibold text-brand-dark">{formatCurrency(subtotal)}</span>
      </div>
      <div className="mt-3 flex items-center justify-between text-xl font-black text-brand-brown">
        <span>Total</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
    </div>
  </section>
);

export default OrderSummary;
