import mongoose from "mongoose";

const blacklistRefreshTokenSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 864000 //10 days
    }
})

export const BlacklistRefreshToken = mongoose.model("BlacklistRefreshToken", blacklistRefreshTokenSchema)
