import OpenAI from "openai";
import { Note } from "../models/note.model.js";
import { Question } from "../models/question.model.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Answers user questions based on the notes using ChatGPT and saves them in the database.
 * @param {string} userId - ID of the user.
 * @param {string} noteId - ID of the note to refer to.
 * @param {string} questionText - User's question.
 * @returns {Promise<Object>} - Saved question document.
 */
export async function answerQuestion(userId, noteId, questionText) {
    try {
        if (!userId || !noteId || !questionText) {
            throw new Error("Missing required inputs.");
        }

        // Fetch the related note from the database
        const note = await Note.findById(noteId);
        if (!note) {
            throw new Error("Note not found.");
        }

        // Prepare prompt using the note's content
        const prompt = `
        Given the following notes:
        ---
        ${note.notes}
        ---
        Answer the following question in a clear and concise manner:
        Question: "${questionText}"
        `;

        // Get answer from ChatGPT
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{ role: "system", content: prompt }],
            temperature: 0.7,
        });

        const answerText = response.choices[0]?.message?.content || "Could not generate an answer.";

        // Save the question and answer in the database
        const newQuestion = new Question({
            userId,
            noteId,
            questionText,
            answer: answerText,
        });

        const savedQuestion = await newQuestion.save();
        return savedQuestion;
    } catch (error) {
        console.error("Error answering question:", error);
        throw new Error("Error processing question.");
    }
}
