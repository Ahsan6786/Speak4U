const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

// Manually parse .env.local
const envContent = fs.readFileSync(".env.local", "utf8");
const apiKey = envContent.match(/GEMINI_API_KEY=(.*)/)[1].trim();

async function listModels() {
  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    console.log("Testing gemini-1.5-flash...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hi");
    console.log("Success with gemini-1.5-flash");
    console.log(result.response.text());
  } catch (e) {
    console.error("Failed with gemini-1.5-flash:", e.message);
    
    try {
      console.log("Testing gemini-pro...");
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent("Hi");
      console.log("Success with gemini-pro");
      console.log(result.response.text());
    } catch (e2) {
      console.error("Failed with gemini-pro:", e2.message);
      
      try {
        console.log("Testing gemini-1.0-pro...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        const result = await model.generateContent("Hi");
        console.log("Success with gemini-1.0-pro");
        console.log(result.response.text());
      } catch (e3) {
         console.error("Failed with gemini-1.0-pro:", e3.message);
      }
    }
  }
}

listModels();
