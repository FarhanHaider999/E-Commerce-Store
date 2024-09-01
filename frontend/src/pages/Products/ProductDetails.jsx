import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useGetProductDetailsQuery, useCreateReviewMutation } from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { FaBox, FaClock, FaShoppingCart, FaStar, FaStore } from "react-icons/fa";
import moment from "moment";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);
  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8" style={{ marginLeft: '70px' }}>
      <Link to="/" className="text-blue-600 font-semibold hover:underline mb-6 inline-block">
        &larr; Go Back
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <div className="container bg-white p-6 rounded-lg shadow-lg flex flex-wrap lg:flex-nowrap">
          <div className="w-full lg:w-1/2 pr-6">
            <img src={product.image} alt={product.name} className="w-full rounded-lg shadow-md" />
          </div>

          <div className="w-full lg:w-1/2 pl-6 flex flex-col">
            <h1 className="text-3xl font-semibold text-gray-800 mb-4">{product.name}</h1>
            <p className="text-lg text-gray-600 mb-4">{product.description}</p>
            <p className="text-4xl font-bold text-gray-900 mb-4">$ {product.price}</p>

            <div className="flex flex-wrap mb-6">
              <div className="w-full md:w-1/2 mb-4 md:mb-0">
                <h2 className="flex items-center text-gray-700 mb-2">
                  <FaStore className="mr-2 text-gray-500" /> Brand: {product.brand}
                </h2>
                <h2 className="flex items-center text-gray-700 mb-2">
                  <FaClock className="mr-2 text-gray-500" /> Added: {moment(product.createAt).fromNow()}
                </h2>
                <h2 className="flex items-center text-gray-700 mb-2">
                  <FaStar className="mr-2 text-gray-500" /> Reviews: {product.numReviews}
                </h2>
              </div>

              <div className="w-full md:w-1/2">
                <h2 className="flex items-center text-gray-700 mb-2">
                  <FaStar className="mr-2 text-gray-500" /> Ratings: {rating}
                </h2>
                <h2 className="flex items-center text-gray-700 mb-2">
                  <FaShoppingCart className="mr-2 text-gray-500" /> Quantity: {product.quantity}
                </h2>
                <h2 className="flex items-center text-gray-700 mb-2">
                  <FaBox className="mr-2 text-gray-500" /> In Stock: {product.countInStock}
                </h2>
              </div>
            </div>

            <div className="flex items-center mb-6">
              <Ratings value={product.rating} text={`${product.numReviews} reviews`} />
              {product.countInStock > 0 && (
                <select
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="p-2 border rounded-lg ml-4"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className="bg-indigo-600 text-white py-2 px-6 rounded-lg mt-4 hover:bg-indigo-700 transition duration-200"
            >
              Add To Cart
            </button>

            <ProductTabs
              loadingProductReview={loadingProductReview}
              userInfo={userInfo}
              submitHandler={submitHandler}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              product={product}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
