import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../features/authSlice";
import axios from "axios";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/login`, data);
      const user = response.data.data.user;
      dispatch(login({user}));
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      navigate("/home");
    } catch (error) {
      if (error.response) {
        console.error("Error Response:", error.response.data);
        setLoginError(error.response.data.message);
      } else if (error.request) {
        console.error("No Response from Server:", error.request);
        setLoginError("No response from server. Please try again.");
      } else {
        console.error("Axios Error:", error.message);
        setLoginError("Something went wrong. Try again.");
        }
      } finally {
        setIsLoggingIn(false);
      }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="absolute left-4 top-4">
        <h1 className="text-3xl font-semibold text-[#2D333A]">classGPT</h1>
      </div>

      <div className="w-full max-w-md bg-white p-6 rounded-lg">
        <h2 className="text-3xl font-semibold text-center mb-6 text-[#2D333A]">Welcome back</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-medium text-[#2D333A]">Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[a-zA-Z]+\d*@gmail\.com$/, message: "Invalid email address" },
              })}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E9272]"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block font-medium text-[#2D333A]">Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E9272]"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}

          <button
            type="submit"
            disabled={isLoggingIn}
            className={`w-full text-xl text-white py-3 rounded-md transition ${
              isLoggingIn ? "bg-gray-400 cursor-not-allowed" : "bg-[#0E9272] hover:bg-[#5aa27afa]"
            }`}
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex flex-col items-center mt-6 text-sm text-gray-600">
          <Link to="/forgot-password" className="text-blue-500 hover:underline mb-2">
            Forgot password?
          </Link>
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
