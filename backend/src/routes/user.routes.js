import express from "express";
import {
    registerUser, 
    loginUser, 
    logoutUser, 
    verifyOtp, 
    refreshAccessToken,
    changePassword,
    getUserNotes,
    getUser
} from "../controllers/user.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/verify-otp").post(verifyOtp);
router.route("/login").post(loginUser);
router.route("/logout").post(authUser, logoutUser);
router.route("/user").get(authUser, getUser);
router.route("/user-data").get(authUser, getUserNotes);
router.route("/change-password").post(authUser, changePassword);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
