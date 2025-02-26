import { findBestMatch } from "string-similarity-js";
import fs from "fs";
import { uploadCloudinary } from "./cloudinary.js";
import { Book } from "../models/book.model.js";

/**
 * Extracts relevant text from a book using transcribed audio text, uploads the book to Cloudinary, 
 * and saves book details to the database.
 * @param {string} bookPath - Local file path of the uploaded book.
 * @param {string} transcribedText - Transcribed text from audio.
 * @param {string} userId - User ID associated with the book.
 * @param {number} threshold - Similarity threshold (default: 0.4).
 * @returns {Promise<Object>} - Saved book document from the database.
 */
export async function extractTextFromBook(bookPath, transcribedText, userId, threshold = 0.4) {
    try {
        if (!bookPath || !transcribedText) throw new Error("Missing required inputs.");

        // Read book text
        const bookText = fs.readFileSync(bookPath, "utf-8");

        // Upload book to Cloudinary
        const cloudinaryResponse = await uploadCloudinary(bookPath);
        if (!cloudinaryResponse.url) throw new Error("Failed to upload book to Cloudinary.");

        // Split book into paragraphs or sentences
        const paragraphs = bookText.split("\n").filter(p => p.trim().length > 20);

        // Compare similarity
        const matches = paragraphs.map(paragraph => ({
            paragraph,
            similarity: findBestMatch(transcribedText, [paragraph]).bestMatch.rating,
        }));

        // Extract relevant text
        const extractedText = matches
            .filter(match => match.similarity > threshold) // Adjust threshold as needed
            .sort((a, b) => b.similarity - a.similarity) // Sort by highest similarity
            .map(match => match.paragraph.trim());

        // Save book details in database
        const newBook = new Book({
            uploadedBy: userId,
            title: cloudinaryResponse.original_filename,
            bookUrl: cloudinaryResponse.url,
            extractedText,
        });

        const savedBook = await newBook.save();
        return savedBook;
    } catch (error) {
        console.error("Error processing book:", error);
        throw new Error("Error processing book");
    }
}