import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hi");
    console.log("Success with gemini-1.5-flash");
    console.log(result.response.text());
  } catch (e) {
    console.error("Failed with gemini-1.5-flash:", e);
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent("Hi");
      console.log("Success with gemini-pro");
      console.log(result.response.text());
    } catch (e2) {
      console.error("Failed with gemini-pro:", e2);
    }
  }
}

listModels();
