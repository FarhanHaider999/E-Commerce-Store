import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-64 h-80 m-4 p-3 border border-gray-200 rounded-lg shadow-sm bg-white transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <div className="relative h-2/3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded-t-lg transform transition-transform duration-300 hover:scale-110"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-2 h-1/3 flex flex-col justify-between">
        <Link to={`/product/${product._id}`} className="block">
          <h2 className="text-sm font-semibold mb-1 text-gray-900 transform transition-transform duration-300 hover:text-indigo-600">
            {product.name}
          </h2>
          <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full">
            ${product.price}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
