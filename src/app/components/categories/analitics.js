import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { formatDateTime } from "../timeFormatter";
import { getCategoryAnalitics } from "@/app/api/requesters";

const CategoryAnalitics = () => {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [categoryAnalitics, setCategoryAnalitics] = useState({});

  useEffect(() => {
    if (router.isReady) {
      fetchCategoryAnalitics(router.query.categoryID);
    }
  }, [router.isReady])

  const fetchCategoryAnalitics = async (categoryID) => {
    try {
      const response = await getCategoryAnalitics(categoryID);
      if (response.ok) {
        const data = await response.json();
        setCategoryAnalitics(data);
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

  const handleProductRowClick = () => {}
  
  const categoryAnaliticsTable = (analitics) => {
    return (
      <table className="w-full border rounded">
        <tbody>
          <tr>
            <td className="py-2 px-4 border-b text-left">Total Products</td>
            <td className="py-2 px-4 border-b text-right">{analitics.total_products}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b text-left">Total Units Sold</td>
            <td className="py-2 px-4 border-b text-right">{analitics.total_sold}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b text-left">Total Revenue</td>
            <td className="py-2 px-4 border-b text-right">{analitics.total_revenue}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b text-left">Total Customers</td>
            <td className="py-2 px-4 border-b text-right">{analitics.total_customers}</td>
          </tr>
        </tbody>
      </table>
    )
  }

  const topCustomersTable = (customers = {}) => {
    return (
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-center">Name</th>
            <th className="py-2 px-4 border-b text-center">Spent (USD)</th>
            <th className="py-2 px-4 border-b text-center">Revenue (USD)</th>
            <th className="py-2 px-4 border-b text-center">Total Units Bought</th>
            <th className="py-2 px-4 border-b text-center">Last Purchase</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer, index) => (
              <tr
                key={index}
                className="hover:gb-[#d3d3d3]"
                onClick={handleCustomerRowClick}
              >
                <td className="py-2 px-4 border-b text-center">
                  {customer.order__customer__first_name} {customer.order__customer__last_name}
                </td>
                <td className="py-2 px-4 border-b text-center">{customer.total_spent}</td>
                <td className="py-2 px-4 border-b text-center">{customer.total_revenue}</td>
                <td className="py-2 px-4 border-b text-center">{customer.total_quantity}</td>
                <td className="py-2 px-4 border-b text-center">{formatDateTime(customer.last_purchase)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="py-2 px-4 border-b text-center">No customers found!</td>
            </tr>
          )}
        </tbody>
      </table>
    )
  }

  const topProductsTable = (products = {}) => {
    return (
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-center">Name</th>
            <th className="py-2 px-4 border-b text-center">Total Units Sold</th>
            <th className="py-2 px-4 border-b text-center">Revenue</th>
            <th className="py-2 px-4 border-b text-center">Last Purchased</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product, index) => (
              <tr
                key={index}
                className="hover:gb-[#d3d3d3]"
                onClick={handleProductRowClick}
              >
                <td className="py-2 px-4 border-b text-center">{product.product__name}</td>
                <td className="py-2 px-4 border-b text-center">{product.total_units_sold}</td>
                <td className="py-2 px-4 border-b text-center">{product.total_revenue}</td>
                <td className="py-2 px-4 border-b text-center">{formatDateTime(product.last_purchased)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="py-2 px-4 border-b text-center">No products found!</td>
            </tr>
          )}
        </tbody>
      </table>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Category Analitics</h1>
      {error !== null ? (
        <p className="text-center">{`${error}`}</p>
      ) : (
        categoryAnalitics ? (
          <>
            {categoryAnaliticsTable(categoryAnalitics)}

            <div className="gap-6">
              <div className="">
                <h1 className="text-2xl py-4 text-left">Top Customers</h1>
                {topCustomersTable(categoryAnalitics.top_customers)}
              </div>
              <div className="">
                <h1 className="text-2xl py-4 text-left">Top Products</h1>
                {topProductsTable(categoryAnalitics.top_products)}
              </div>
            </div>
          </>
        ) : (
          <p className="text-center">No Analitics Found!</p>
        )
      )}
    </div>
  )
}

export default CategoryAnalitics;