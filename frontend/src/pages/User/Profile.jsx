import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-700">
      <div className="md:w-96 w-full bg-gray-800 p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-4 text-center text-white">Update Profile</h1>

        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-400 text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-black text-white leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Enter name"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-400 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-black text-white leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-400 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-black text-white leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-400 text-sm font-medium mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-black text-white leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            disabled={loadingUpdateProfile}
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-full transition duration-300 ease-in-out"
          >
            {loadingUpdateProfile ? "Updating..." : "Update Profile"}
          </button>

          {loadingUpdateProfile && <Loader />}
        </form>

        <div className="mt-4 text-center">
          <Link
            to="/user-orders"
            className="text-indigo-500 hover:underline"
          >
            My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
