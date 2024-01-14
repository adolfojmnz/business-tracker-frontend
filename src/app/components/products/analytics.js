import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { formatDateTime } from "../timeFormatter";
import { getProductAnalytics } from "@/app/api/requesters";

const ProductAnalytics = () => {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [productAnalytics, setProductAnalytics] = useState({})

  useEffect(() => {
    if (router.isReady) {
      fetchProductAnalytics(router.query.productID);
    }
  }, [router.isReady])

  const fetchProductAnalytics = async(productID) => {
    try {
      const response = await getProductAnalytics(productID);
      if (response.ok) {
        const data = await response.json();
        setProductAnalytics(data);
      } else {
        const status = response.status;
        const statusText = response.statusText;
        throw new Error(`Request failed with status: ${status} ${statusText}`);
      }
    } catch (error) {
      setError(error);
    }
  }

  const handleCustomerRowClick = () => {}

  const handlePurchaseRowClick = () => {}

  const productAnalyticsTable = (analytics) => {
    return (
      <table className="w-full border rounded">
        <tbody>
          <tr>
            <td className="py-2 px-4 border-b text-left">Total Sold</td>
            <td className="py-2 px-4 border-b text-right">{analytics.total_sold} {analytics.unit_symbol}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b text-left">Total Revenue</td>
            <td className="py-2 px-4 border-b text-right">$ {analytics.total_revenue}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b text-left">Total Buyers</td>
            <td className="py-2 px-4 border-b text-right">{analytics.total_customers}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b text-left">Avg Order</td>
            <td className="py-2 px-4 border-b text-right">{analytics.avg_order_quantity} {analytics.unit_symbol}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b text-left">Min Order</td>
            <td className="py-2 px-4 border-b text-right">{analytics.min_order_quantity} {analytics.unit_symbol}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b text-left">Max Order</td>
            <td className="py-2 px-4 border-b text-right">{analytics.max_order_quantity} {analytics.unit_symbol}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  const topCustomersTable = (customers = {}) => {
    return (
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-center w-1/8">First Name</th>
            <th className="py-2 px-4 border-b text-center w-1/8">Last Name</th>
            <th className="py-2 px-4 border-b text-center w-1/8">Total Purchased</th>
            <th className="py-2 px-4 border-b text-center w-1/8">Last Purchased</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer, index) => (
              <tr
                key={index}
                className="hover:bg-[#d3d3d3]"
                onClick={handleCustomerRowClick}
              >
                <td className="py-2 px-4 border-b text-center w-1/8">{customer.order__customer__first_name}</td>
                <td className="py-2 px-4 border-b text-center w-1/8">{customer.order__customer__last_name}</td>
                <td className="py-2 px-4 border-b text-center w-1/8">{customer.total_quantity}</td>
                <td className="py-2 px-4 border-b text-center w-1/8">{formatDateTime(customer.last_purchased)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="py-2 px-4 text-center w-8/8">No customers found!</td>
            </tr>
          )}  
        </tbody>
      </table>
    )
  }

  const latestPurchases = (purchases = {}) => {
    return (
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-center w-1/8">First Name</th>
            <th className="py-2 px-4 border-b text-center w-1/8">Last Name</th>
            <th className="py-2 px-4 border-b text-center w-1/8">Quantity</th>
            <th className="py-2 px-4 border-b text-center w-1/8">Last Purchased</th>
          </tr>
        </thead>
        <tbody>
          {purchases.length > 0 ? (
            purchases.map((purchase, index) => (
              <tr
                key={index}
                className="hover:bg-[#d3d3d3]"
                onClick={handlePurchaseRowClick}
              >
                <td className="py-2 px-4 border-b text-center w-1/8">{purchase.order__customer__first_name}</td>
                <td className="py-2 px-4 border-b text-center w-1/8">{purchase.order__customer__last_name}</td>
                <td className="py-2 px-4 border-b text-center w-1/8">{purchase.quantity}</td>
                <td className="py-2 px-4 border-b text-center w-1/8">{formatDateTime(purchase.datetime)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="py-2 px-4 text-center w-8/8">No purchases found!</td>
            </tr>
          )}  
        </tbody>
      </table>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Product Analytics</h1>
      {error !== null ? (
        <p className="text-center">{`${error}`}</p>
      ) : (
        productAnalytics ? (
          <>
            {productAnalyticsTable(productAnalytics)}

            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-1">
                <h1 className="text-2xl py-4 text-center">Top Customers</h1>
                {topCustomersTable(productAnalytics.top_customers)}
              </div>
              <div className="col-span-1">
                <h1 className="text-2xl py-4 text-center">Latest Purchases</h1>
                {latestPurchases(productAnalytics.latest_purchases)}
              </div>
            </div>
          </>
        ) : (
          <p className="text-center">No Analytics Found!</p>
        )
      )}
    </div>
  )
}

export default ProductAnalytics;