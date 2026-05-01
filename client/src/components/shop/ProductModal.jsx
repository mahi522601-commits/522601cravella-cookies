import { useEffect, useState } from "react";
import { FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { formatCurrency } from "@/utils/formatCurrency";

const ProductModal = ({ product, isOpen, onClose }) => {
  const addItem = useCartStore((state) => state.addItem);
  const bumpCartPulse = useUiStore((state) => state.bumpCartPulse);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
  }, [product?.id, isOpen]);

  if (!product) {
    return null;
  }

  const handleAdd = () => {
    addItem(product, qty);
    bumpCartPulse();
    toast.success(`${qty} ${product.name} added to cart`);
    onClose?.();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name} panelClassName="sm:max-w-5xl">
      <div className="grid gap-8 p-5 sm:p-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="overflow-hidden rounded-[1.75rem] bg-brand-light">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex min-h-[360px] items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(201,136,42,0.28),_transparent_35%),linear-gradient(135deg,_rgba(245,236,215,1),_rgba(237,217,176,0.8))]">
              <span className="font-display text-3xl font-semibold text-brand-brown">
                {product.name}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <Badge value={product.badge} className="self-start" />
          <p className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-brand-brown/65">
            {product.category}
          </p>
          <div className="mt-3 flex items-end gap-3">
            <p className="text-3xl font-black text-brand-brown">{formatCurrency(product.price)}</p>
            {product.originalPrice ? (
              <p className="pb-1 text-sm text-brand-brown/45 line-through">
                {formatCurrency(product.originalPrice)}
              </p>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-brand-brown/70">{product.weight}</p>
          <p className="mt-6 text-base leading-7 text-brand-dark/80">{product.description}</p>

          <div className="mt-6">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-brown/65">
              Ingredients
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.ingredients?.map((ingredient) => (
                <span
                  key={ingredient}
                  className="rounded-full bg-brand-light px-3 py-2 text-sm font-semibold text-brand-brown"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="inline-flex items-center self-start rounded-full border border-brand-brown/15 bg-brand-light p-1">
              <button
                className="rounded-full p-3 text-brand-brown"
                onClick={() => setQty((value) => Math.max(1, value - 1))}
                aria-label="Decrease quantity"
              >
                <FiMinus />
              </button>
              <span className="min-w-12 text-center text-lg font-bold text-brand-dark">{qty}</span>
              <button
                className="rounded-full p-3 text-brand-brown"
                onClick={() => setQty((value) => Math.min(product.stock || 20, value + 1))}
                aria-label="Increase quantity"
              >
                <FiPlus />
              </button>
            </div>
            <Button
              icon={<FiShoppingBag />}
              size="lg"
              onClick={handleAdd}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductModal;
