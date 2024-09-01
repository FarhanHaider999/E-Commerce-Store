import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Failed to create a product. Try Again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create a product. Try Again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
        <AdminMenu />
        <div className="md:w-3/4 p-6 bg-gray-900 rounded-lg shadow-lg w-full max-w-3xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Product</h2>

          {imageUrl && (
            <div className="text-center mb-6">
              <img
                src={imageUrl}
                alt="product"
                className="mx-auto max-h-48 object-cover rounded-lg shadow-md"
              />
            </div>
          )}

          <div className="mb-6">
            <label className="block text-center py-4 px-6 border border-dashed border-gray-500 rounded-lg cursor-pointer text-white bg-gray-800 hover:bg-gray-700">
              {image ? image.name : "Upload Image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
              />
            </label>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full p-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-300">Price</label>
                <input
                  type="number"
                  id="price"
                  className="mt-1 block w-full p-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-300">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  className="mt-1 block w-full p-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-300">Brand</label>
                <input
                  type="text"
                  id="brand"
                  className="mt-1 block w-full p-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-300">Count In Stock</label>
                <input
                  type="number"
                  id="stock"
                  className="mt-1 block w-full p-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
                <select
                  id="category"
                  className="mt-1 block w-full p-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
              <textarea
                id="description"
                className="mt-1 block w-full p-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 font-semibold text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
