async function listModels() {
  const key = "AIzaSyD1eERrsjBELCjE2Guj93zZ1dChhJVI9-w";
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    const models = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
    console.log("Filtered Models:", models.map(m => m.name));
  } catch (e) {
    console.error("Error:", e.message);
  }
}

listModels();
