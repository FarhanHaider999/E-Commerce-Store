import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        // Filter products based on both checked categories and price filter
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            // Check if the product price includes the entered price filter value
            return (
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter, 10)
            );
          }
        );

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  // Add "All Brands" option to uniqueBrands
  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    // Update the price filter state when the user types in the input field
    setPriceFilter(e.target.value);
  };

  return (
    <>
      <div className="container mx-auto">
  <div className="flex md:flex-row gap-6">
    <div className="bg-[#2a2a2a] p-8 mt-4 mb-4 w-full md:w-1/4 space-y-6 ml-16 rounded-lg shadow-lg">
      <h2 className="text-2xl font-extrabold text-white text-center py-4 bg-indigo-400 rounded-full shadow-md">
        Filter by Categories
      </h2>

      <div className="space-y-3">
        {categories?.map((c) => (
          <div key={c._id} className="flex items-center space-x-3">
            <input
              type="checkbox"
              id={`category-${c._id}`}
              onChange={(e) => handleCheck(e.target.checked, c._id)}
              className="w-5 h-5 text-blue-600 bg-gray-800 border-gray-600 rounded-md focus:ring-blue-500 transition-transform transform hover:scale-110 duration-200"
            />
            <label
              htmlFor={`category-${c._id}`}
              className="text-md font-semibold text-gray-300"
            >
              {c.name}
            </label>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-extrabold text-white text-center py-4 bg-indigo-400 rounded-full shadow-md">
        Filter by Brands
      </h2>

      <div className="space-y-3">
        {uniqueBrands?.map((brand) => (
          <div key={brand} className="flex items-center space-x-3">
            <input
              type="radio"
              id={`brand-${brand}`}
              name="brand"
              onChange={() => handleBrandClick(brand)}
              className="w-5 h-5 text-blue-400 bg-gray-800 border-gray-600 focus:ring-blue-500 transition-transform transform hover:scale-110 duration-200"
            />
            <label
              htmlFor={`brand-${brand}`}
              className="text-md font-semibold text-gray-300"
            >
              {brand}
            </label>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-extrabold text-white text-center py-4 bg-indigo-400 rounded-full shadow-md">
        Filter by Price
      </h2>

      <div>
        <input
          type="text"
          placeholder="Enter Price"
          value={priceFilter}
          onChange={handlePriceChange}
          className="w-full px-4 py-3 placeholder-gray-500 border border-gray-600 rounded-lg bg-indigo-100 text-indigo focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform transform hover:scale-105 duration-200"
        />
      </div>

      <div>
        <button
          className="w-full bg-red-700 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-red-800 transition-transform transform hover:scale-105 duration-300"
          onClick={() => window.location.reload()}
        >
          Reset
        </button>
      </div>
    </div>

          <div className="flex-1 p-3">
            <h2 className="ml-[20rem] text-[3rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-700 drop-shadow-lg sm:ml-[10rem] sm:text-[2rem] md:text-[2.5rem]">{products?.length} Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.length === 0 ? (
                <Loader />
              ) : (
                products?.map((p) => (
                  <div className="p-3" key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
