import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineUpload, AiFillDelete, AiFillSave } from "react-icons/ai";

const AdminProductUpdate = () => {
  const params = useParams();
  const { data: productData } = useGetProductByIdQuery(params._id);

  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(productData?.description || "");
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category?._id || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock || "");

  const navigate = useNavigate();
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
      setStock(productData.countInStock);
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      setImage(res.image);
    } catch (err) {
      toast.error("Image upload failed. Try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const validateForm = () => {
    console.log("Name:", name);
    console.log("Description:", description);
    console.log("Price:", price);
    console.log("Category:", category);
    console.log("Quantity:", quantity);
    console.log("Brand:", brand);
    console.log("Stock:", stock);
  
    if (!name || !description || !price || !category || !quantity || !brand || !stock) {
      toast.error("Please fill out all fields", {
        position: "top-right",
        autoClose: 2000,
      });
      return false;
    }
    if (isNaN(price) || isNaN(quantity) || isNaN(stock)) {
      toast.error("Price, Quantity, and Stock must be numbers", {
        position: "top-right",
        autoClose: 2000,
      });
      return false;
    }
    return true;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      // Logging the form data for debugging
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Update product using the RTK Query mutation
      const { data, error } = await updateProduct({ productId: params._id, formData });

      if (!error) {
        toast.success(`Product successfully updated`, {
          position: "top-right",
          autoClose: 2000,
        });
        navigate("/admin/allproductslist");
      } else {
        toast.error(error || "Product update failed. Try again.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("Product update failed. Try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm("Are you sure you want to delete this product?");
      if (!answer) return;

      const { data } = await deleteProduct(params._id);
      toast.success(`"${data.name}" is deleted`, {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/admin/allproductslist");
    } catch (err) {
      toast.error("Delete failed. Try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-900 text-white">
      <div className="flex flex-col md:flex-row justify-center">
        <AdminMenu />
        <div className="md:w-3/4 p-6 bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-4 text-center">Update / Delete Product</h2>

          {image && (
            <div className="text-center mb-4">
              <img
                src={image}
                alt="product"
                className="block mx-auto max-w-full h-auto object-contain rounded-lg shadow-lg"
              />
            </div>
          )}

          <div className="mb-6">
            <label className="block w-full text-center py-2 px-4 bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700">
              <AiOutlineUpload className="inline-block mr-2" />
              {image ? "Change Image" : "Upload Image"}
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
                <label htmlFor="name" className="block font-semibold mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-3 border rounded-lg bg-gray-700 text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="price" className="block font-semibold mb-2">Price</label>
                <input
                  type="number"
                  id="price"
                  className="w-full p-3 border rounded-lg bg-gray-700 text-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="quantity" className="block font-semibold mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  id="quantity"
                  className="w-full p-3 border rounded-lg bg-gray-700 text-white"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="brand" className="block font-semibold mb-2">Brand</label>
                <input
                  type="text"
                  id="brand"
                  className="w-full p-3 border rounded-lg bg-gray-700 text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block font-semibold mb-2">Description</label>
              <textarea
                id="description"
                className="w-full p-3 border rounded-lg bg-gray-700 text-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="stock" className="block font-semibold mb-2">Count In Stock</label>
                <input
                  type="text"
                  id="stock"
                  className="w-full p-3 border rounded-lg bg-gray-700 text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="category" className="block font-semibold mb-2">Category</label>
                <select
                  id="category"
                  className="w-full p-3 border rounded-lg bg-gray-700 text-white"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                >
                  <option value="" disabled>Choose Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="flex items-center bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              >
                <AiFillSave className="mr-2" />
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center bg-red-500 text-white py-2 px-4 ml-4 rounded-lg hover:bg-red-600"
              >
                <AiFillDelete className="mr-2" />
                Delete Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;
