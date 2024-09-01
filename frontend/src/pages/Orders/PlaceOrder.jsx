import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = cart;

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err.data?.message || err.error);
    }
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />

      <div className="container mx-auto mt-8" style={{ marginLeft: '70px' }}>
        {cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-1 py-2 text-left align-top">Image</th>
                  <th className="px-1 py-2 text-left">Product</th>
                  <th className="px-1 py-2 text-left">Quantity</th>
                  <th className="px-1 py-2 text-left">Price</th>
                  <th className="px-1 py-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    </td>
                    <td className="p-2">
                      <Link to={`/product/${item.product}`} className="text-blue-600 font-semibold hover:underline">{item.name}</Link>
                    </td>
                    <td className="p-2">{item.qty}</td>
                    <td className="p-2">${item.price.toFixed(2)}</td>
                    <td className="p-2">${(item.qty * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-5">Order Summary</h2>
          <div className="flex justify-between flex-wrap p-4 bg-gray-200 rounded-lg">
            <ul className="text-lg">
              <li className="mb-2">
                <span className="font-semibold">Items:</span> ${itemsPrice}
              </li>
              <li className="mb-2">
                <span className="font-semibold">Shipping:</span> ${shippingPrice}
              </li>
              <li className="mb-2">
                <span className="font-semibold">Tax:</span> ${taxPrice}
              </li>
              <li className="mb-2">
                <span className="font-semibold">Total:</span> ${totalPrice}
              </li>
            </ul>

            <div className="mt-4">
              <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
              <p>
                <strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city} {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
            </div>

            <div className="mt-4">
              <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
              <strong>Method:</strong> {paymentMethod}
            </div>
          </div>

          {error && <Message variant="danger">{error.data.message}</Message>}

          <button
            type="button"
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg w-full mt-4 hover:bg-indigo-700 transition duration-200"
            disabled={cartItems.length === 0}
            onClick={placeOrderHandler}
          >
            Place Order
          </button>

          {isLoading && <Loader />}
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
