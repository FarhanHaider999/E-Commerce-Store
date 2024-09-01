import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <div className="mb-4 lg:block xl:block md:block bg-white-100 text-gray-900">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider
          {...settings}
          className="xl:w-[50rem] lg:w-[50rem] md:w-[56rem] sm:w-[40rem] sm:block"
        >
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => (
              <div key={_id} className="p-4 bg-white rounded-lg shadow-lg">
                <img
                  src={image}
                  alt={name}
                  className="w-full rounded-lg object-cover h-[30rem]"
                />

                <div className="mt-4 flex flex-col lg:flex-row justify-between">
                  <div className="one lg:w-1/2">
                    <h2 className="text-xl font-bold">{name}</h2>
                    <p className="text-lg font-semibold mt-2">$ {price}</p>
                    <p className="w-full mt-4 text-justify">
                      {description.substring(0, 170)} ...
                    </p>
                  </div>

                  <div className="flex flex-col lg:flex-row justify-between lg:w-1/2 mt-4 lg:mt-0">
                    <div className="one lg:w-1/2 ml-4">
                      <h1 className="flex items-center mb-6">
                        <FaStore className="mr-2 text-indigo-400" /> Brand: {brand}
                      </h1>
                      <h1 className="flex items-center mb-6">
                        <FaClock className="mr-2 text-indigo-400" /> Added:{" "}
                        {moment(createdAt).fromNow()}
                      </h1>
                      <h1 className="flex items-center mb-6">
                        <FaStar className="mr-2 text-indigo-400" /> Reviews: {numReviews}
                      </h1>
                    </div>

                    <div className="two lg:w-1/2">
                      <h1 className="flex items-center mb-6">
                        <FaStar className="mr-2 text-indigo-400" /> Ratings:{" "}
                        {Math.round(rating)}
                      </h1>
                      <h1 className="flex items-center mb-6">
                        <FaShoppingCart className="mr-2 text-indigo-400" /> Quantity:{" "}
                        {quantity}
                      </h1>
                      <h1 className="flex items-center mb-6">
                        <FaBox className="mr-2 text-indigo-400" /> In Stock:{" "}
                        {countInStock}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
