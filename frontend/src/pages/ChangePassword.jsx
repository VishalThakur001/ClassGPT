import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const ChangePassword = () => {
  const { 
    register,
    handleSubmit,
    formState: { errors } 
  } = useForm();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    if (data.newPassword !== data.confirmNewPassword) {
      alert("New password and confirm password do not match");
      setLoading(false);
      return;
    }
    
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/change-password`,
        {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
          confirmNewPassword: data.confirmNewPassword
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      alert("Password changed successfully");
      navigate('/home');
    } catch (error) {
      alert("Error changing password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100 px-4'>
      <div className="absolute left-4 top-4">
        <h1 className="text-3xl font-semibold text-[#2D333A]">classGPT</h1>
      </div>
      <div className="p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4">Change Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <div>
            <label className='block text-sm font-medium'>Old Password:</label>
            <input 
              type="password" 
              {...register("oldPassword", { required: "Old password is required" })} 
              className='w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0E9272]' 
              placeholder="Enter old password" 
            />
            {errors.oldPassword && <p className='text-red-500 text-sm'>{errors.oldPassword.message}</p>}
          </div>
          
          <div>
            <label className='block text-sm font-medium'>New Password:</label>
            <input 
              type="password" 
              {...register("newPassword", { required: "New password is required" })} 
              className='w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0E9272]' 
              placeholder="Enter new password" 
            />
            {errors.newPassword && <p className='text-red-500 text-sm'>{errors.newPassword.message}</p>}
          </div>
          
          <div>
            <label className='block text-sm font-medium'>Confirm New Password:</label>
            <input 
              type="password" 
              {...register("confirmNewPassword", { required: "Please confirm your new password" })} 
              className='w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0E9272]' 
              placeholder="Confirm new password" 
            />
            {errors.confirmPassword && <p className='text-red-500 text-sm'>{errors.confirmPassword.message}</p>}
          </div>
          
          <button disabled={loading} type="submit" className='w-full bg-[#0E9272] text-white py-2 rounded'>
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
