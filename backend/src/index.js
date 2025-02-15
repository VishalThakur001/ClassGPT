import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import connectDB from "./db/index.js";
import { app } from "./app.js";

const startServer = async () => {
    try {
        await connectDB();
        console.log(" MongoDB connected successfully!");

        app.on("error", (error) => {
            console.error(" Server Error:", error);
        });

        const PORT = process.env.PORT || 4000;

        app.listen(PORT, () => {
            console.log(` Server is running at port: ${PORT}`);
        });
    } catch (error) {
        console.error(" MongoDB connection failed!", error);
        process.exit(1);
    }
};

startServer();