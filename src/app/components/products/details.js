import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getProductDetails } from "@/app/api/requesters";
import { formatDateTime } from "../timeFormatter";

const ProductDetails = () => {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [productError, setProductError] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      fetchProducts(router.query.productID);
    }
  }, [router.isReady]);

  const fetchProducts = async (productID) => {
    try {
      const response = await getProductDetails(productID);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        const status = response.status;
        const statusText = response.statusText;
        throw new Error(`Request failed with status: ${status} ${statusText}`);
      }
    } catch (error) {
      setProduct(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Details</h1>
      {product ? (
        <div className="border border-gray-300 rounded p-4 mb-4">
          <h2 className="text-2xl font-semibold mb-4">{product.name}</h2>
          <p className="mb-2"><strong>Cost</strong>: {product.cost} USD</p>
          <p className="mb-2"><strong>Sale Price</strong>: {product.price} USD</p>
          <p className="mb-2"><strong>Stock</strong>: {product.stock} {product.unit_symbol}</p>
          <p className="mb-2"><strong>Category</strong>: {product.category_name}</p>
          <p className="mb-2"><strong>Added On</strong>: {formatDateTime(product.added_on)}</p>
          <p className="mb-2"><strong>Last Updated</strong>: {formatDateTime(product.last_updated)}</p>
        </div>
      ) : (
        <p>Product not found.</p>
      )}
    </div>
  );
}

export default ProductDetails;