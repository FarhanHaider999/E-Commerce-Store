import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (isError) {
    return <div className="text-center text-red-500">Error loading products</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
        <div className="md:w-3/4 p-6 bg-gray-900 rounded-lg shadow-lg w-full max-w-3xl">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            All Products ({products.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/admin/product/update/${product._id}`}
                className="bg-gray-800 rounded-lg shadow-md overflow-hidden w-full max-w-sm transition-transform transform hover:scale-105"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-white">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {moment(product.createdAt).format("MMMM Do YYYY")}
                  </p>
                  <p className="text-gray-300 text-sm mb-4">
                    {product.description.substring(0, 120)}...
                  </p>
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/admin/product/update/${product._id}`}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Update Product
                      <svg
                        className="w-4 h-4 ml-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </Link>
                    <p className="text-gray-100 font-semibold">${product.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <AdminMenu />
      </div>
    </div>
  );
};

export default AllProducts;
