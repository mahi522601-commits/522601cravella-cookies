import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/utils/formatCurrency";

const CartItem = ({ item }) => {
  const updateQty = useCartStore((state) => state.updateQty);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex gap-4 rounded-[1.5rem] border border-brand-brown/10 bg-white/80 p-4">
      <div className="h-24 w-24 overflow-hidden rounded-2xl bg-brand-light">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center px-2 text-center font-display text-lg text-brand-brown">
            {item.name}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-brand-dark">{item.name}</h3>
            {item.weight ? <p className="text-sm text-brand-brown/70">{item.weight}</p> : null}
          </div>
          <button
            className="rounded-full p-2 text-brand-brown transition hover:bg-brand-light"
            onClick={() => removeItem(item.productId)}
            aria-label={`Remove ${item.name}`}
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="inline-flex items-center rounded-full border border-brand-brown/15 bg-brand-light p-1">
            <button
              className="rounded-full p-2 text-brand-brown"
              onClick={() => updateQty(item.productId, item.qty - 1)}
              aria-label="Decrease quantity"
            >
              <FiMinus />
            </button>
            <span className="min-w-10 text-center font-bold text-brand-dark">{item.qty}</span>
            <button
              className="rounded-full p-2 text-brand-brown"
              onClick={() => updateQty(item.productId, item.qty + 1)}
              aria-label="Increase quantity"
            >
              <FiPlus />
            </button>
          </div>
          <p className="text-lg font-black text-brand-brown">
            {formatCurrency(item.price * item.qty)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
