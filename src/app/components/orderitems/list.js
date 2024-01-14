import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getOrderItemList } from "@/app/api/requesters";

const OrderItemList = () => {
  const router = useRouter();
  const [orderItems, setOrderItems] = useState([]);
  const [orderItemsError, setOrderItemsError] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      fetchOrderItems({order: router.query.orderID});
    }
  }, [router.isReady]);

  const fetchOrderItems = async (filters) => {
    try {
      const response = await getOrderItemList(filters);
      if (response.ok) {
        const data = await response.json();
        setOrderItems(data);
      } else {
        const status = response.status;
        const statusText = response.statusText;
        throw new Error(`Request failed with status: ${status} ${statusText}`);
      }
    } catch (error) {
      setOrderItemsError(error);
    }
  };

  const handlerowClick = (orderItemID) => {
    router.push(`/order-items/${orderItemID}`);
  };

  const orderItemsTableHead = () => {
    return (
      <thead>
        <tr className="bg-gray-100 border">
          <th className="py-2 px-4 text-center w-1/9">Product</th>
          <th className="py-2 px-4 text-center w-1/9">Quantity</th>
          <th className="py-2 px-4 text-center w-1/9">Price (USD)</th>
          <th className="py-2 px-4 text-center w-1/9">Sub Total (USD)</th>
        </tr>
      </thead>
    );
  };

  const orderItemsTableBody = () => {
    return (
      <tbody>
        {orderItems.length > 0 ? (
          orderItems.map((orderItem, index) => (
            <tr
              key={index}
              className="hover:bg-[#d3d3d3] border-l border-r"
              onClick={() => handlerowClick(orderItem.id)}
            >
              <td className="py-2 px-4 border-b text-center w-1/9">{orderItem.product_name}</td>
              <td className="py-2 px-4 border-b text-center w-1/9">{orderItem.quantity} {orderItem.product_unit}</td>
              <td className="py-2 px-4 border-b text-center w-1/9">{orderItem.product_price}</td>
              <td className="py-2 px-4 border-b text-center w-1/9">{orderItem.subtotal}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={12} className="py-2 px-4 text-center w-1/9">
              No items found.
            </td>
          </tr>
        )}
      </tbody>
    );
  };

  return (
    <>
      {orderItemsError ? (
        <div>
          <p className="text-center">{`${orderItemsError}`}</p>
        </div>
      ) : (
        <>
          <h1 className="text-2xl mt-6">Order Items</h1>
          <table className="w-full bOrderItem-collapse mt-2">
            {orderItemsTableHead()}
            {orderItemsTableBody()}
          </table>
        </>
      )}
    </>
  );
};

export default OrderItemList;