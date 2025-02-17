import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    sourceAudio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Audio",
    },
    sourceBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    generatedNotes: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
    },
    questions: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  },
  {
    timestamps: true,
  }
);

export const Note = mongoose.model("Note", noteSchema);
