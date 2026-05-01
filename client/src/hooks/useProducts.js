import { useEffect, useState } from "react";
import { fetchFeaturedProducts, fetchProducts } from "@/services/firestore";

export const useProducts = ({ featured = false } = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const data = featured ? await fetchFeaturedProducts() : await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [featured]);

  return {
    products,
    loading,
    error,
    refresh: loadProducts,
  };
};
