import ProductCard from "./ProductCard";
import Button from "@/components/ui/Button";

const ProductGrid = ({ products, loading, onQuickView, visibleCount, onLoadMore }) => {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="card-surface overflow-hidden">
            <div className="skeleton h-64 w-full" />
            <div className="space-y-4 p-5">
              <div className="skeleton h-6 w-2/3 rounded-full" />
              <div className="skeleton h-4 w-1/3 rounded-full" />
              <div className="skeleton h-4 w-1/2 rounded-full" />
              <div className="skeleton h-11 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="card-surface bg-noise px-6 py-16 text-center">
        <p className="section-kicker">Fresh batch loading</p>
        <h3 className="mt-3 text-3xl font-semibold">No products match this filter yet.</h3>
        <p className="mt-3 text-brand-brown/70">
          Try another category or check back after the admin adds a new batch.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {products.slice(0, visibleCount).map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
        ))}
      </div>
      {visibleCount < products.length && onLoadMore ? (
        <div className="flex justify-center">
          <Button variant="secondary" onClick={onLoadMore}>
            Load More
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default ProductGrid;
