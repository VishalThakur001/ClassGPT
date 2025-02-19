import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSignupSubmit = (data) => {
    console.log("Sending OTP...");
    setUserData(data);
    setStep(2);
    setValue("otp", "");
  };

  const onOtpSubmit = async (otpData) => {
    setIsVerifying(true);
    setOtpError("");

    setTimeout(() => {
      if (otpData.otp === "123456") {
        console.log("OTP Verified! Redirecting...");
        navigate("/home");
      } else {
        setOtpError("Invalid OTP. Please try again.");
        setIsVerifying(false);
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="absolute left-4 top-4">
        <h1 className="text-3xl font-semibold text-[#2D333A]">classGPT</h1>
      </div>

      <div className="w-full max-w-md bg-white p-6 rounded-lg">
        {step === 1 ? (
          <>
            <h2 className="text-2xl font-semibold text-center mb-6 text-[#2D333A]">Create Account</h2>
            <form onSubmit={handleSubmit(onSignupSubmit)} className="space-y-4">
              <div>
                <label className="block font-medium text-[#2D333A]">Full Name:</label>
                <input
                  type="text"
                  placeholder="Full Name*"
                  {...register("fullName", { required: "Full Name is required" })}
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E9272]"
                />
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block font-medium text-[#2D333A]">Email:</label>
                <input
                  type="email"
                  placeholder="Email*"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
                  })}
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E9272]"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block font-medium text-[#2D333A]">Password:</label>
                <input
                  type="password"
                  placeholder="Password*"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E9272]"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-[#0E9272] text-xl text-white py-3 rounded-md hover:bg-[#5aa27afa] transition"
              >
                Continue
              </button>
            </form>
            <p className="text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Log in
              </Link>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-center mb-4 text-[#2D333A]">Verify OTP</h2>
            <p className="text-center text-gray-600 mb-4">
              Enter the OTP sent to your email: <span className="font-semibold">{userData.email}</span>
            </p>
            <form onSubmit={handleSubmit(onOtpSubmit)} className="space-y-4">
              <div>
                <label className="block font-medium text-[#2D333A]">Enter OTP:</label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  {...register("otp", { required: "OTP is required", minLength: 6, maxLength: 6 })}
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E9272] text-center tracking-widest"
                />
                {errors.otp && <p className="text-red-500 text-sm">{errors.otp.message}</p>}
                {otpError && <p className="text-red-500 text-sm mt-1">{otpError}</p>}
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className={`w-full text-xl text-white py-3 rounded-md transition ${
                  isVerifying ? "bg-gray-400 cursor-not-allowed" : "bg-[#0E9272] hover:bg-[#5aa27afa]"
                }`}
              >
                {isVerifying ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
