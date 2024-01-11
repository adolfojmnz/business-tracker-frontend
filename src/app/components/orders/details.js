import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import OrderItemList from '../orderitems/list';
import { getOrderDetails } from '@/app/api/requesters';

const OrderDetails = () => {
  const router = useRouter();
  const [order, setOrder] = useState([]);
  const [orderError, setOrderError] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      fetchOrder(router.query.orderID);
    }
  }, [router.isReady]);

  const fetchOrder = async (orderID) => {
    try {
      const response = await getOrderDetails(orderID);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        const status = response.status;
        const statusText = response.statusText;
        throw new Error(`Request failed with status: ${status} ${statusText}`);
      }
    } catch (error) {
      setOrderError(error);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <div className="border border-gray-300 rounded p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">Order #{order.id}</h2>
        <p className="mb-2">Customer: {order.customer_full_name}</p>
        <p className="mb-2">Total: {order.total} USD</p>
        <p className="mb-2">
          Payment:
          {order.payment_status == 0 ? " Pending" : ""}
          {order.payment_status == 1 ? " Processing" : ""}
          {order.payment_status == 2 ? " Successful" : ""}
          {order.payment_status == 3 ? " Failed" : ""}
          {order.payment_status == 4 ? " Cancel" : ""}
        </p>
        <p className="mb-2">
          Delivery:
          {order.order_status == 0 ? " Pending" : ""}
          {order.order_status == 1 ? " Delivered" : ""}
          {order.order_status == 2 ? " Picked" : ""}
          {order.order_status == 3 ? " Cancel" : ""}
        </p>
      </div>
      <h2 className="text-lg font-semibold mb-2">Order Items</h2>
      <div className="border border-gray-300 rounded p-4">
        <OrderItemList />
      </div>
    </div>
  );
};

export default OrderDetails;