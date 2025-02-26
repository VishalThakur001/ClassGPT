import fs from "fs";
import OpenAI from "openai";
import { Audio } from "../models/audio.model.js";
import { uploadCloudinary } from "./cloudinary.js";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const transcribeAudio = async (audioPath, userId) => {
    try {
        console.log("Starting transcription...");
        const fileStream = fs.createReadStream(audioPath);
        
        console.log("Transcribing audio...");
        const response = await openai.audio.transcriptions.create({
            file: fileStream,
            model: "whisper-1",
            language: "en"
        });

        console.log("Transcription Response:", response);

        const audio = await uploadCloudinary(audioPath);

        if (!audio) {
            console.error("Error uploading audio to Cloudinary");
            return;
        }

        const newAudio = new Audio({
            uploadedBy: userId,
            title: audio.title,
            AudioUrl: audio.AudioUrl,
            transcript: response.text,
            language: audio.language,
            duration: audio.duration
        });
        await newAudio.save();

        return newAudio;
    } catch (error) {
        console.error("Error during transcription:", error);
    }
};

(async () => {
    const transcription = await audioFun();
    if (transcription) console.log("Final Transcription:", transcription.text);
})();

export default transcribeAudio