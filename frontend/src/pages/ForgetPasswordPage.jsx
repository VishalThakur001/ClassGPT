import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const ForgetPasswordPage = () => {
  const { register, handleSubmit } = useForm();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStep(2);
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    }
    setLoading(false);
  };

  const handleOtpSubmit = async (data) => {
    console.log(data)
    setLoading(true);
    setError("");
    try {
      const isOtpValid = data.otp === "123456";
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (isOtpValid) {
        navigate("/reset-password");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Verification failed. Try again.");
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setError("A new OTP has been sent to your email.");
    } catch (err) {
      setError("Failed to resend OTP. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="absolute left-4 top-4">
        <h1 className="text-4xl font-semibold text-[#2D333A]">classGPT</h1>
      </div>
      <div className="w-96 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {step === 1 ? "Forgot Password" : "Enter OTP"}
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        {step === 1 && (
          <form onSubmit={handleSubmit(handleEmailSubmit)}>
            <label className="block mb-2">Email:</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="w-full px-3 py-2 border rounded mb-4"
              placeholder="Enter your email"
            />
            <button
              type="submit"
              className="w-full bg-[#0E9272] text-white py-2 rounded"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Continue"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit(handleOtpSubmit)}>
            <input
              type="text"
              {...register("otp", { required: true })}
              className="w-full px-3 py-2 border rounded mb-4"
              placeholder="Enter OTP"
            />
            <button
              type="submit"
              className="w-full bg-[#0E9272] text-white py-2 rounded"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Submit"}
            </button>
            <button
              type="button"
              className="w-full bg-gray-400 text-white py-2 rounded mt-2"
              onClick={handleResendOtp}
              disabled={loading}
            >
              Resend OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
