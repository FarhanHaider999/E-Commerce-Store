import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="container mx-auto p-6 mt-8">
      <AdminMenu />
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                <th className="p-4 text-left">ITEMS</th>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">USER</th>
                <th className="p-4 text-left">DATE</th>
                <th className="p-4 text-left">TOTAL</th>
                <th className="p-4 text-left">PAID</th>
                <th className="p-4 text-left">DELIVERED</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <img
                      src={order.orderItems[0]?.image || "/placeholder.jpg"}
                      alt={order._id}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  </td>
                  <td className="p-4">{order._id}</td>
                  <td className="p-4">{order.user?.username || "N/A"}</td>
                  <td className="p-4">{order.createdAt?.substring(0, 10) || "N/A"}</td>
                  <td className="p-4">${order.totalPrice.toFixed(2)}</td>
                  <td className="p-4">
                    <p
                      className={`p-2 text-center rounded-full ${
                        order.isPaid ? "bg-green-400 text-white" : "bg-red-400 text-white"
                      }`}
                    >
                      {order.isPaid ? "Completed" : "Pending"}
                    </p>
                  </td>
                  <td className="p-4">
                    <p
                      className={`p-2 text-center rounded-full ${
                        order.isDelivered ? "bg-green-400 text-white" : "bg-red-400 text-white"
                      }`}
                    >
                      {order.isDelivered ? "Completed" : "Pending"}
                    </p>
                  </td>
                  <td className="p-4">
                    <Link to={`/order/${order._id}`}>
                      <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">
                        More
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderList;
