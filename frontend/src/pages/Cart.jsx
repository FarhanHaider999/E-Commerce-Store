import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8" style={{ marginLeft: '70px' }}>
      <Link to="/" className="text-blue-600 font-semibold hover:underline mb-6 inline-block">
        &larr; Go Back
      </Link>

      {cartItems.length === 0 ? (
        <div className="text-center mt-8">
          Your cart is empty <Link to="/shop" className="text-indigo-600 font-semibold hover:underline">Go To Shop</Link>
        </div>
      ) : (
        <div className="container bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>

          {cartItems.map((item) => (
            <div key={item._id} className="flex items-center mb-4 pb-2 border-b border-gray-300">
              <div className="w-24 h-24">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              <div className="flex-1 ml-4">
                <Link to={`/product/${item._id}`} className="text-blue-600 font-semibold hover:underline">
                  {item.name}
                </Link>

                <div className="mt-2 text-gray-600">{item.brand}</div>
                <div className="mt-2 text-gray-900 font-bold">
                  $ {item.price}
                </div>
              </div>

              <div className="w-24">
                <select
                  className="w-full p-2 border rounded-lg text-gray-900"
                  value={item.qty}
                  onChange={(e) =>
                    addToCartHandler(item, Number(e.target.value))
                  }
                >
                  {[...Array(item.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ml-4">
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeFromCartHandler(item._id)}
                >
                  <FaTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          <div className="mt-8 p-4 bg-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">
              Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
            </h2>

            <div className="text-2xl font-bold mb-4">
              $ {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
            </div>

            <button
              className="bg-indigo-600 text-white py-2 px-4 rounded-lg w-full hover:bg-indigo-700 transition duration-200"
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
