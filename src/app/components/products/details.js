import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { formatDateTime } from "../timeFormatter";
import { getProductDetails } from "@/app/api/requesters";
import ProductAnalytics from "./analytics";

const ProductDetails = () => {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

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
      setError(error);
    }
  };

  const productDetailsTable = (product) => {
    return (
      <table className="w-full border rounded">
        <tbody>
          <tr>
            <td className="py-2 px-4 border-b text-left">Name</td>
            <td className="py-2 px-4 border-b text-right">{product.name}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b text-left">Cost</td>
            <td className="py-2 px-4 border-b text-right">$ {product.cost}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b text-left">Sale Price</td>
            <td className="py-2 px-4 border-b text-right">$ {product.price}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b text-left">In Stock</td>
            <td className="py-2 px-4 border-b text-right">{product.stock} {product.unit_symbol}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b text-left">Added On</td>
            <td className="py-2 px-4 border-b text-right">{formatDateTime(product.added_on)}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b text-left">Last Updated</td>
            <td className="py-2 px-4 border-b text-right">{formatDateTime(product.last_updated)}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Details</h1>
      {error !== null ? (
        <p className="text-center">{`${error}`}</p>
      ) : (
        product ? (
          <>
            {productDetailsTable(product)}
            <ProductAnalytics />
          </>
        ) : (
          <p>Product not found.</p>
        )
      )}
    </div>
  );
}

export default ProductDetails;