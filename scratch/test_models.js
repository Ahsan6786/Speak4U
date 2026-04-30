const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    // This is just a placeholder, the actual way to list models is via a specific API call
    // But since I don't want to overcomplicate, I'll try 'gemini-1.0-pro'
    console.log("Testing with gemini-1.0-pro...");
    const result = await genAI.getGenerativeModel({ model: "gemini-1.0-pro" }).generateContent("Hi");
    console.log("Success with gemini-1.0-pro");
  } catch (e) {
    console.error("Error:", e.message);
  }
}

listModels();
