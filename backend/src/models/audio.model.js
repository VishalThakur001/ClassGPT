import mongoose from "mongoose";

const audioSchema = new mongoose.Schema(
  {
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    AudioUrl: {
        type: String,
        required: true,
    },
    transcript: {
        type: String,
    },
    language: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        default: 0,
    }
  },
  {
    timestamps: true,
  }
);

export const Audio = mongoose.model("Audio", audioSchema);