import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgetPasswordPage = () => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/request-forget-password`, data);
      localStorage.setItem("passwordResetAllowed", "true");
      localStorage.setItem("email", data.email);
      navigate("/reset-password");
    } catch (err) {
      setError("Failed to send request. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="absolute left-4 top-4">
        <h1 className="text-4xl font-semibold text-[#2D333A]">classGPT</h1>
      </div>
      <div className="w-96 p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">Forgot Password</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit(handleEmailSubmit)}>
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#0E9272]"
            placeholder="Enter your email"
          />
          <button
            type="submit"
            className="w-full bg-[#0E9272] text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? "Sending Otp" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;