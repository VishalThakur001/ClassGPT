import OpenAI from "openai";
import { Note } from "../models/note.model.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generates a title, structured notes, and a summary using OpenAI's ChatGPT API,
 * then saves them in the database.
 * @param {string} userId - ID of the user requesting the notes.
 * @param {string} transcribedText - Text from the audio.
 * @param {string[]} extractedText - Relevant text extracted from the book.
 * @returns {Promise<Object>} - The saved note document.
 */
export async function generateNotes(userId, transcribedText, extractedText) {
    try {
        if (!userId || !transcribedText || !extractedText.length) {
            throw new Error("Missing required inputs.");
        }

        // Combine transcribed audio and extracted book text for better context
        const combinedText = `
            AUDIO TEXT:\n${transcribedText}\n
            RELEVANT BOOK TEXT:\n${extractedText.join("\n")}
        `;

        // Generate a Title
        const titlePrompt = `Based on the following text, generate a short, informative, and relevant title:\n\n${combinedText}`;
        const titleResponse = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{ role: "system", content: titlePrompt }],
            temperature: 0.7,
        });

        const generatedTitle = titleResponse.choices[0]?.message?.content || "Untitled Notes";

        // Generate Notes
        const notesPrompt = `Based on the following text, generate well-structured notes with key points, explanations, and important takeaways:\n\n${combinedText}`;
        const notesResponse = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{ role: "system", content: notesPrompt }],
            temperature: 0.7,
        });

        const generatedNotes = notesResponse.choices[0]?.message?.content || "Notes could not be generated.";

        // Generate Summary
        const summaryPrompt = `Summarize the following text in a concise and informative way:\n\n${combinedText}`;
        const summaryResponse = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{ role: "system", content: summaryPrompt }],
            temperature: 0.7,
        });

        const generatedSummary = summaryResponse.choices[0]?.message?.content || "Summary could not be generated.";

        // Save to Database
        const newNote = new Note({
            userId,
            title: generatedTitle,
            generatedNotes,
            summary: generatedSummary,
        });

        const savedNote = await newNote.save();
        return savedNote;
    } catch (error) {
        console.error("Error generating notes:", error);
        throw new Error("Error generating notes");
    }
}