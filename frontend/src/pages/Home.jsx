import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <>
          <div className="flex justify-between items-center mt-[10rem] sm:mt-[5rem]">
            <h1 className="ml-[20rem] text-[3rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-700 drop-shadow-lg sm:ml-[10rem] sm:text-[2rem] md:text-[2.5rem]">
              Latest Products
            </h1>
            <Link
  to="/shop"
  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold rounded-full py-3 px-12 shadow-lg transform transition duration-300 ease-in-out hover:scale-105 mr-[18rem]"
>
  Shop
</Link>

          </div>

          <div>
            <div className="flex justify-center flex-wrap mt-[2rem]">
              {data.products.map((product) => (
                <div key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
