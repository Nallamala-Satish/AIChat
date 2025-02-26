import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;
const genAI = new GoogleGenerativeAI('AIzaSyDeGHle43bJqk9izewpu_M4n8zouTObPB8'); // Load API key from .env

app.use(cors());
app.use(bodyParser.json());

// Initialize Gemini model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    res.json({ response: responseText });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
