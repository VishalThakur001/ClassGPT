import mongoose from "mongoose";
import { deleteCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateNotes } from "../utils/generateNotes.js";
import { extractTextFromBook } from "../utils/extractTextFromBook.js";
import { transcribeAudio } from "../utils/transcribeAudio.js";
import { answerQuestion } from "../utils/answerQuestion.js";
import { Book } from "../models/book.model.js";
import { Audio } from "../models/audio.model.js";
import { Note } from "../models/note.model.js";
import { Question } from "../models/question.model.js";

const searchResult = asyncHandler(async (req, res) => {
    let audioPath;
    if(req.files && Array.isArray(req.files.audio) && req.files.audio.length > 0){
        audioPath = req.files.audio[0];
    }

    let bookPath;
    if(req.files && Array.isArray(req.files.book) && req.files.book.length > 0){
        bookPath = req.files.book[0];
    }

    if(!audioPath){
        return next(new ApiError(400, "Audio file is required!"));
    }

    const transcribedText = await transcribeAudio(audioPath, req.user._id);
    const extractedText = await extractTextFromBook(bookPath, transcribedText, req.user._id);
    const notes = await generateNotes(transcribedText, extractedText, req.user._id);

    if(!notes){
        return next(new ApiError(400, "Failed to generate notes!"));
    }   
    
    return res
        .status(200)
        .json(new ApiResponse(200, "Notes generated successfully!", notes));
});

const findAnswer = asyncHandler(async (req, res) => {
    const question = req.question;
    if(!question){
        return next(new ApiError(400, "Question not found!"));
    }

    const answer = await answerQuestion(req.user._id, question.noteId, question.questionText);
    
    if(!answer){
        return next(new ApiError(400, "Failed to answer question!"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Question answered successfully!", answer));
});

export {
    searchResult,
    findAnswer
};