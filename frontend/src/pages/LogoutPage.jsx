import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { persistStore } from "redux-persist";
import { store } from "../store/store";
import axios from "axios";

const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  useEffect(() => {
    const logoutUser = async () => {
      try {
        if (!accessToken || !refreshToken) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          dispatch(logout());
          persistStore(store).purge();
          navigate("/login");
          return;
        }

        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/users/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "x-refresh-token": refreshToken,
            },
          }
        );
        
      } catch (error) {
        console.log("Logout failed", error);

        if(error.response?.status === 500) {
          console.log("Logout failed", error.response.data.message);
        }
        if (error.response?.status === 401) {
          console.warn("Access token expired.");
        }
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch(logout());
      persistStore(store).purge();
      navigate("/login");
    };

    logoutUser();
  }, []);

  return <div>Logging out...</div>;
};

export default LogoutPage;
