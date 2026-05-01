import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import ProductGrid from "@/components/shop/ProductGrid";
import ProductModal from "@/components/shop/ProductModal";
import { useProducts } from "@/hooks/useProducts";

const categories = [
  { value: "all", label: "All" },
  { value: "cookies", label: "Cookies" },
  { value: "gift-boxes", label: "Gift Boxes" },
  { value: "seasonal", label: "Seasonal" },
];

const Shop = () => {
  const { products, loading } = useProducts();
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = useMemo(
    () =>
      products.filter((item) => {
        const matchesCategory = category === "all" ? true : item.category === category;
        const term = search.trim().toLowerCase();
        const matchesSearch = term
          ? `${item.name} ${item.description} ${item.weight}`
              .toLowerCase()
              .includes(term)
          : true;
        return item.isActive !== false && matchesCategory && matchesSearch;
      }),
    [products, category, search],
  );

  return (
    <>
      <Helmet>
        <title>Shop | Cravella Cookies</title>
        <meta
          name="description"
          content="Browse Cravella Cookies bestsellers, gift boxes, and seasonal bakes."
        />
      </Helmet>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="page-shell py-14"
      >
        <div className="max-w-3xl">
          <p className="section-kicker">Cookie Menu</p>
          <h1 className="mt-3 text-5xl font-semibold">Browse every fresh batch.</h1>
          <p className="mt-4 text-lg text-brand-brown/75">
            Discover handmade cookies, gifting boxes, and seasonal specials baked in Karimnagar.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 rounded-[2rem] border border-brand-brown/10 bg-white/85 p-5 shadow-soft lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-lg">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-brown/45" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setVisibleCount(12);
              }}
              placeholder="Search flavours, packs, or keywords"
              className="input-field pl-12"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((item) => (
              <button
                key={item.value}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  category === item.value
                    ? "bg-brand-brown text-brand-cream"
                    : "bg-brand-light text-brand-brown"
                }`}
                onClick={() => {
                  setCategory(item.value);
                  setVisibleCount(12);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <ProductGrid
            products={filteredProducts}
            loading={loading}
            visibleCount={visibleCount}
            onLoadMore={() => setVisibleCount((count) => count + 12)}
            onQuickView={setSelectedProduct}
          />
        </div>
      </motion.section>

      <ProductModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
};

export default Shop;
