import multer from "multer";
import path from "path";

// Define Storage Engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Check file type
        if (file.mimetype.startsWith("audio/")) {
            cb(null, "./public/audio/"); // Save audio files in "public/audio"
        } else if (file.mimetype === "application/pdf") {
            cb(null, "./public/book/"); // Save PDF files in "public/book"
        } else {
            return cb(new Error("Invalid file type. Only PDFs and audio files are allowed."), false);
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
});

// Define File Filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("audio/") || file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only PDFs and audio files are allowed."), false);
    }
};

// Initialize Multer Upload Middleware
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // Limit file size to 50MB
});