import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ProductModal from "@/components/shop/ProductModal";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { getProductById } from "@/services/firestore";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getProductById(productId)
      .then((response) => {
        if (mounted) {
          setProduct(response);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-8 w-8 text-brand-brown" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-shell py-20 text-center">
        <h1 className="text-4xl font-semibold">Product not found</h1>
        <p className="mt-4 text-brand-brown/70">
          This cookie may have sold out or been removed from the menu.
        </p>
        <div className="mt-6">
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.name} | Cravella Cookies</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="page-shell py-14">
        <ProductModal product={product} isOpen onClose={() => window.history.back()} />
      </div>
    </>
  );
};

export default ProductDetail;
