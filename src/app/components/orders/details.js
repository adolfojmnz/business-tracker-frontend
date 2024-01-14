import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getOrderDetails } from '@/app/api/requesters';
import { formatDateTime } from "../timeFormatter";
import OrderItemList from '../orderitems/list';

const OrderDetails = () => {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [order, setOrder] = useState([]);

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
      setError(error);
    }
  }

  const orderDetailsTable = (order = {}) => {
    return (
      <table className="w-full border rounded">
        <tbody>
          <tr>
            <td className="py-2 px-4 border-b text-left">Order ID</td>
            <td className="py-2 px-4 border-b text-right">{order.id}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b text-left">Customer</td>
            <td className="py-2 px-4 border-b text-right">{order.customer_full_name}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b text-left">Total</td>
            <td className="py-2 px-4 border-b text-right">$ {order.total}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b text-left">DateTime</td>
            <td className="py-2 px-4 border-b text-right">{formatDateTime(order.datetime)}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b text-left">Payment</td>
            <td className="py-2 px-4 border-b text-right">
              {order.payment_status == 0 ? " Pending" : ""}
              {order.payment_status == 1 ? " Processing" : ""}
              {order.payment_status == 2 ? " Successful" : ""}
              {order.payment_status == 3 ? " Failed" : ""}
              {order.payment_status == 4 ? " Cancel" : ""}
            </td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b text-left">Delivery</td>
            <td className="py-2 px-4 border-b text-right">
              {order.order_status == 0 ? " Pending" : ""}
              {order.order_status == 1 ? " Delivered" : ""}
              {order.order_status == 2 ? " Picked" : ""}
              {order.order_status == 3 ? " Cancel" : ""}
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      {error !== null ? (
        <p className="text-center">{`${error}`}</p>
      ) : (
        order ? (
          <>
            {orderDetailsTable(order)}
            <OrderItemList />
          </>
        ) : (
          <p>Category Not Found!</p>
        )
      )}
    </div>
  );
}

export default OrderDetails;