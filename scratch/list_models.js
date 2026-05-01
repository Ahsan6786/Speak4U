const fs = require("fs");
const envContent = fs.readFileSync(".env.local", "utf8");
const apiKey = envContent.match(/GEMINI_API_KEY=(.*)/)[1].trim();

async function listAllModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Failed to list models:", e.message);
  }
}

listAllModels();
