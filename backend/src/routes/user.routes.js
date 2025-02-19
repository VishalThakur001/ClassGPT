import express from "express";
import {
    registerUser, 
    loginUser, 
    logoutUser, 
    verifyOtp, 
    refreshAccessToken,
    changePassword,
    getUserNotes,
    getUser,
    newOtp,
    requestForgetPassword,
    resetPassword
} from "../controllers/user.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/new-otp").post(newOtp);
router.route("/verify-otp").post(verifyOtp);
router.route("/login").post(loginUser);
router.route("/logout").post(authUser, logoutUser);
router.route("/user").get(authUser, getUser);
router.route("/user-notes").get(authUser, getUserNotes);
router.route("/change-password").post(authUser, changePassword);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/request-forget-password").post(requestForgetPassword);
router.route("/reset-password").post(resetPassword);

export default router;
