import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("passwordResetAllowed")) {
      navigate("/forgot-password");
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    console.log(data)
    console.log(localStorage.getItem("email"))
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/reset-password`,
        { 
          email: localStorage.getItem("email"),
          otp: data.otp,
          password: data.password,
        }
      );
      setSuccess("Password reset successfully!");
      localStorage.removeItem("passwordResetAllowed");
      localStorage.removeItem("email");
      navigate("/login");
    } catch (err) {
      setError("Failed to reset password. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="absolute left-4 top-4">
        <h1 className="text-3xl font-semibold text-[#2D333A]">classGPT</h1>
      </div>
      <div className="w-96 p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">Reset Password</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="block mb-2">OTP:</label>
          <input
            type="text"
            {...register("otp", { required: "OTP is required" })}
            className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-[#0E9272]"
            placeholder="Enter OTP"
          />
          {errors.otp && <p className="text-red-500">{errors.otp.message}</p>}

          <label className="block mb-2">New Password:</label>
          <input
            type="password"
            {...register("password", { required: "Password is required", minLength: 6 })}
            className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-[#0E9272]"
            placeholder="Enter new password"
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}

          <label className="block mb-2">Confirm Password:</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) => value === watch("password") || "Passwords do not match"
            })}
            className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#0E9272]"
            placeholder="Confirm password"
          />
          {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}

          <button
            type="submit"
            className="w-full bg-[#0E9272] text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;