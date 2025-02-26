import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
    searchResult
} from "../controllers/search.controller.js";

const router = express.Router();

router.route("/search").post(
    upload.fields([
        {
            name: "book",
            maxCount: 1
        },
        {
            name: "audio",
            maxCount: 1
        }
    ]),
    searchResult
)

export default router;
