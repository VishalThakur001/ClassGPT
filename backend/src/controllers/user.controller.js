import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Note } from "../models/note.model.js";
import { generateOtp, sendOtpMail } from "../utils/verifySignup.js"
import { Otp } from "../models/otp.model.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and referesh token")
    }
}

const registerUser = asyncHandler(async (req, res) => {

    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return next(new ApiError(400, "All fields are required!"));
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new ApiError(400, "User already exists!"));
    }

    const otp = generateOtp()

    try {
        await sendOtpMail(email, otp);
    } catch (error) {
        return new ApiError(500, "Error sending OTP email");
    }

    const otpData = await Otp.create({
        email,
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, "OTP sent to your email"));
})

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
  
    const otpData = await Otp.findOne({ email });
  
    if (!otpData) {
      return new ApiError(400, "Otp not found");
    }

    if (otpData.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (otpData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
  
    const newUser = await User.create({
        fullName: req.body.fullName,
        email,
        password: req.body.password,
    });

    await Otp.deleteOne({ email });

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(newUser._id);

    const options = {    
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: newUser, accessToken, refreshToken }));
};

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ApiError(400, "All fields are required!"));
    }

    const user = await User.findOne({ email });
    if (!user) {
        return next(new ApiError(400, "User not found!"));
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        return next(new ApiError(400, "Password is incorrect!"));
    }

    if (user.refreshToken) {
        await BlacklistRefreshToken.create({ refreshToken: user.refreshToken });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user, accessToken, refreshToken }));
})

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
        return next(new ApiError(400, "All fields are required!"));
    }

    if (newPassword !== confirmNewPassword) {
        return next(new ApiError(400, "Passwords do not match!"));
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
        return next(new ApiError(404, "User not found!"));
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        return next(new ApiError(400, "Old password is incorrect!"));
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json(new ApiResponse(200, "Password changed successfully!"));
});

const logoutUser = asyncHandler( async (req, res) => {
    
    const accessToken = req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];
    const refreshToken = req.cookies?.refreshToken || req.headers["x-refresh-token"];

    if (!refreshToken){
        throw new ApiError(400, "Refresh token required")
    }
    if(!accessToken){
        throw new ApiError(400, "Access token required")
    }
    
    try {
        await BlacklistAccessToken.create({ accessToken });
        await BlacklistRefreshToken.create({ refreshToken });

        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1
                }
            },
            {
                new: true
            }
        )
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
    } catch (error) {
        return new ApiError(500, error?.message || "Something went wrong at servers end while logging out")
    }
})

const refreshAccessToken = asyncHandler( async (req, res) => {

    const incomingRefreshToken = req.cookies?.refreshToken || req.headers.authorization?.split(" ")[1];

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized Request")
    }

    const checkBlacklisted = await BlacklistRefreshToken.findOne({refreshToken: incomingRefreshToken})

    if(checkBlacklisted){
        throw new ApiError(401, "Unauthorized Request - Token is blacklisted")
    }

    try {
        const decodedToken  = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken._id)
    
        if(!user){
            throw new ApiError(401, "Refresh Token Expired")
        }

        const oldAccessToken = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
        if (oldAccessToken) {
            await BlacklistAccessToken.create({ accessToken: oldAccessToken });
        }

        await BlacklistRefreshToken({ refreshToken: incomingRefreshToken })
    
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(decodedToken._id)
    
        const options = {
            httpOnly: true,
            secure: true
        }

        res.clearCookie("accessToken", options);
        res.clearCookie("refreshToken", options);
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken},
                "Access Token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const getUser = asyncHandler( async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user))
})

const getUserNotes = asyncHandler( async (req, res) => { 

    let userId;
    if (req.user?._id) {
        try {
            userId = new mongoose.Types.ObjectId(String(req.user._id));
        } catch (error) {
            throw new ApiError(400, "Invalid User ID");
        }
    }

    const notes = await Note.aggregate([
        {
            $match: {
                userId,
            }
        },
        {
            $lookup: {
                from: "audios", 
                localField: "sourceAudio",
                foreignField: "_id",
                as: "audioDetails",
            }
        },
        {
            $lookup: {
                from: "books",
                localField: "sourceBook",
                foreignField: "_id",
                as: "bookDetails",
            }
        },
        {
            $unwind: { path: "$audioDetails", preserveNullAndEmptyArrays: true }
        },
        {
            $unwind: { path: "$bookDetails", preserveNullAndEmptyArrays: true }
        },
        {
            $project: {
                title: 1,
                generatedNotes: 1,
                summary: 1,
                createdAt: 1,
                updatedAt: 1,
                "audioDetails.title": 1,
                "audioDetails.AudioUrl": 1,
                "audioDetails.language": 1,
                "bookDetails.title": 1,
                "bookDetails.bookUrl": 1,
            }
        }
    ]);
})

export { 
    registerUser,
    loginUser,
    logoutUser,
    verifyOtp,
    refreshAccessToken,
    changePassword,
    getUserNotes,
    getUser
}