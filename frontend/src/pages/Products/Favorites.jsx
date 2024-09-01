import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="flex justify-between items-center mt-[10rem] sm:mt-[5rem]">
      <h1 className="ml-[20rem] text-[3rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-white-600 to-indigo-700 drop-shadow-lg sm:ml-[10rem] sm:text-[2rem] md:text-[2.5rem]">
        Favorite Products
      </h1>

      <div className="flex flex-wrap p-6 rounded-lg">
        {favorites.map((product) => (
          <div key={product._id} className="m-4 p-4 bg-white rounded-lg shadow-md">
            <Product product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
