import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { BlacklistAccessToken } from "../models/blacklistAccessToken.model.js"
import { User } from "../models/user.model.js";

export const authUser = asyncHandler( async(req, _, next) => {
    const accessToken = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
    
    if(!accessToken){
        throw new ApiError(401, "Unauthorized request")
    }

    const isBlacklisted = await BlacklistAccessToken.findOne({ accessToken })

    if(isBlacklisted){
        throw new ApiError(401, "Unauthorized request - Token is blacklisted")
    }

    try {
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

        if(!decodedToken || !decodedToken._id){
            throw new ApiError(401, "Invalid or expired token")
        }

        const user = await User.findById(decodedToken._id)
        
        if(!user){
            throw new ApiError(401, "User not found");
        }

        req.user = user;

        return next();
    } catch (error) {
        throw new ApiError(401, error.message || "Invalid or expired token")
    }
})