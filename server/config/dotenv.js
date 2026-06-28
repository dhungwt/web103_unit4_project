import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This explicitly finds the .env file in your root folder, no matter where you run the command from!
dotenv.config({ path: path.resolve(__dirname, "../.env") });
