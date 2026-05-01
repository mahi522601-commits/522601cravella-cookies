import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEye, FiShoppingBag } from "react-icons/fi";
import toast from "react-hot-toast";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import LazyImage from "@/components/ui/LazyImage";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { formatCurrency } from "@/utils/formatCurrency";

const ProductCard = ({ product, onQuickView }) => {
  const addItem = useCartStore((state) => state.addItem);
  const bumpCartPulse = useUiStore((state) => state.bumpCartPulse);

  const handleAdd = () => {
    addItem(product, 1);
    bumpCartPulse();
    toast.success(`${product.name} added to cart`);
  };

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      className="card-surface group overflow-hidden"
    >
      <button
        className="relative block h-64 w-full overflow-hidden bg-brand-light text-left"
        onClick={() => onQuickView?.(product)}
      >
        {product.imageUrl ? (
          <LazyImage
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            wrapperClassName="h-full w-full"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(201,136,42,0.25),_transparent_35%),linear-gradient(135deg,_rgba(245,236,215,1),_rgba(237,217,176,0.75))]">
            <span className="font-display text-3xl font-semibold text-brand-brown">
              {product.name}
            </span>
          </div>
        )}
        <div className="absolute left-4 top-4">
          <Badge value={product.badge} />
        </div>
        <div className="absolute right-4 top-4 rounded-full bg-white/85 p-2 text-brand-brown shadow-soft">
          <FiEye className="h-4 w-4" />
        </div>
      </button>
      <div className="space-y-4 p-5">
        <div className="space-y-1">
          <Link to={`/products/${product.id}`} className="block text-xl font-semibold text-brand-dark">
            {product.name}
          </Link>
          <p className="text-sm text-brand-brown/70">{product.weight}</p>
        </div>
        <div className="flex items-end gap-3">
          <p className="text-xl font-black text-brand-brown">{formatCurrency(product.price)}</p>
          {product.originalPrice ? (
            <p className="text-sm text-brand-brown/45 line-through">
              {formatCurrency(product.originalPrice)}
            </p>
          ) : null}
        </div>
        <Button
          fullWidth
          icon={<FiShoppingBag />}
          onClick={handleAdd}
          disabled={product.isActive === false || product.stock === 0}
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </motion.article>
  );
};

export default ProductCard;
