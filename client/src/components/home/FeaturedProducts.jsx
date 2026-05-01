import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import ProductGrid from "@/components/shop/ProductGrid";
import ProductModal from "@/components/shop/ProductModal";
import { useProducts } from "@/hooks/useProducts";

const FeaturedProducts = () => {
  const { products, loading } = useProducts({ featured: true });
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <section className="page-shell py-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-kicker">Our Bestsellers</p>
          <h2 className="section-heading mt-3">Warm favourites everyone comes back for.</h2>
          <div className="decorative-underline" />
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-brand-brown"
        >
          View full menu
          <FiArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-10">
        <ProductGrid
          products={products}
          loading={loading}
          visibleCount={Math.min(products.length || 6, 6)}
          onQuickView={setSelectedProduct}
        />
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
};

export default FeaturedProducts;
