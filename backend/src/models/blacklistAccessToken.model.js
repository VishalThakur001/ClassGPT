import mongoose from "mongoose";

const blacklistAccessTokenSchema = new mongoose.Schema({
    accessToken: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // 1 day
    }
})

export const BlacklistAccessToken = mongoose.model("BlacklistAccessToken", blacklistAccessTokenSchema)
