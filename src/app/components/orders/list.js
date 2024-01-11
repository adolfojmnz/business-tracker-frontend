import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getOrderList } from "@/app/api/requesters";
import { getCustomerList } from "@/app/api/requesters";

const OrderList = () => {
  const router = useRouter();

  // Orders
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({});
  const [ordersError, setOrdersError] = useState(null);
  const [shoudlFetchOrders, setShouldFetchOrders] = useState(true);

  // Customers
  const [customers, setCustomers] = useState([]);
  const [customersError, setCustomersError] = useState(null);
  const [shoudlFetchCustomers, setShouldFetchCustomers] = useState(true);

  useEffect(() => {
    if (shoudlFetchOrders) {
      fetchOrders(filters);
      setShouldFetchOrders(false);
    }
    if (shoudlFetchCustomers) {
      fetchCustomers({});
      setShouldFetchCustomers(false);
    }
  }, [shoudlFetchOrders, shoudlFetchCustomers]);

  const fetchOrders = async (filters) => {
    try {
      const response = await getOrderList(filters);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        const status = response.status;
        const statusText = response.statusText;
        throw new Error(`Request failed with status: ${status} ${statusText}`);
      }
    } catch (error) {
      setOrdersError(error);
    }
  };

  const fetchCustomers = async (filters) => {
    try {
      const response = await getCustomerList(filters);
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      } else {
        const status = response.status;
        const statusText = response.statusText;
        throw new Error(`Request failed with status: ${status} ${statusText}`);
      }
    } catch (error) {
      setCustomersError(error);
    }
  };

  const handlerowClick = (orderID) => {
    router.push(`/orders/${orderID}`);
  };

  const handleApplyFilters = () => {
    setShouldFetchOrders(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    
    if (value === "--SELECT--") {
      updatedValue = "";
    }

    setFilters((prevFiltersData) => ({
      ...prevFiltersData,
      [name]: updatedValue,
    }));
  };

  const filtersForm = () => {
    return (
      <div className="p-4 border rounded shadow bg-gray-100">
        <h2 className="font-semibold text-lg mb-4">Filters</h2>
        <form className="mb-4" onChange={handleFormChange}>
          <label className="block mb-2 font-medium">Customer</label>
          <select
            name="customer"
            className="w-full p-2 border border-gray-200 mb-2"
          >
            <option>--SELECT--</option>
            {customers ? (
              customers.map((customer, index) => (
                <option key={index} value={customer.id}>
                  {customer.first_name} {customer.last_name}
                </option>
              ))
            ) : (
              customersError ? (
                <option disabled>{customersError}</option>
              ) : (
                <option disabled>Loading...</option>
              )
            )}
          </select>
          <label className="block mb-2 font-medium">Payment Status</label>
          <select
            name="payment_status"
            className="w-full p-2 border rounded focus:outline-none mb-2"
          >
            <option>--SELECT--</option>
            <option value={0}>Pending</option>
            <option value={1}>Processing</option>
            <option value={2}>Successful</option>
            <option value={3}>Failed</option>
            <option value={4}>Canceled</option>
          </select>
          <label className="block mb-2 font-medium">Order Status</label>
          <select
            name="order_status"
            className="w-full p-2 border rounded focus:outline-none mb-2"
          >
            <option>--SELECT--</option>
            <option value={0}>Pending</option>
            <option value={1}>Delivered</option>
            <option value={2}>Picked</option>
            <option value={3}>Canceled</option>
          </select>
        </form>
        <button
          onClick={handleApplyFilters}
          className="bg-[#6e8a85] text-white font-semibold p-2 rounded w-full"
        >
          Apply Filters
        </button>
      </div>
    )
  }

  const ordersTableHead = () => {
    return (
      <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-4 border-b text-center w-1/9">Customer</th>
          <th className="py-2 px-4 border-b text-center w-2/9">Payment Status</th>
          <th className="py-2 px-4 border-b text-center w-1/9">Order Status</th>
          <th className="py-2 px-4 border-b text-center w-1/9">Total (USD)</th>
          <th className="py-2 px-4 border-b text-center w-1/9">DateTime</th>
        </tr>
      </thead>
    );
  };

  const ordersTableBody = () => {
    return (
      <tbody>
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <tr
              key={index}
              className="hover:bg-[#d3d3d3]"
              onClick={() => handlerowClick(order.id)}
            >
              <td className="py-2 px-4 border-b text-center w-1/9">{order.customer_full_name}</td>
              <td className="py-2 px-4 border-b text-center w-1/9">
                {order.payment_status == 0 ? "Pending" : ""}
                {order.payment_status == 1 ? "Processing" : ""}
                {order.payment_status == 2 ? "Successful" : ""}
                {order.payment_status == 3 ? "Failed" : ""}
                {order.payment_status == 4 ? "Cancel" : ""}
              </td>
              <td className="py-2 px-4 border-b text-center w-1/9">
                {order.order_status == 0 ? "Pending" : ""}
                {order.order_status == 1 ? "Delivered" : ""}
                {order.order_status == 2 ? "Picked" : ""}
                {order.order_status == 3 ? "Cancel" : ""}
              </td>
              <td className="py-2 px-4 border-b text-center w-1/9">{order.total}</td>
              <td className="py-2 px-4 border-b text-center w-1/9">{formatDateTime(order.datetime)}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={12} className="py-2 px-4 text-center w-1/9">
              No orders found.
            </td>
          </tr>
        )}
      </tbody>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-center text-2xl font-bold">Orders</h2>
      <br />
      {ordersError ? (
        <div>
          <p className="text-center">{`${ordersError}`}</p>
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-5 border rounded">
            <table className="w-full border-collapse">
              {ordersTableHead()}
              {ordersTableBody()}
            </table>
          </div>
          <div>
            {filtersForm()}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;

const formatDateTime = (datetimeStr) => {
  return datetimeStr.replace("T", " ").slice(0, 19);
};
