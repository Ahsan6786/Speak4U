import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req: Request) {
  try {
    const { transcript, prompt } = await req.json();

    if (!transcript) {
      return NextResponse.json({ suggestions: ["Start speaking to get suggestions..."] });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const systemPrompt = `
      You are an expert vocal coach and debate mentor. 
      The user is answering this question: "${prompt}"
      So far, they have said: "${transcript}"

      Your task is to provide 3 'Topic Hints' or 'Expert Keywords' that the user should mention next to make their answer more sophisticated and complete.
      Do NOT try to guess their next words. Instead, suggest high-value concepts or transition themes.
      
      Example for a 'Challenge' question: ["Quantifiable Impact", "Personal Growth", "Specific Actions"]
      Example for a 'Hobbies' question: ["Emotional Connection", "Time Management", "Future Aspirations"]

      Provide EXACTLY 3 suggestions. 
      Keep each suggestion between 1 to 3 words maximum.
      Do not output anything else. No quotes, no markdown, no conversational filler.
      Format the output as a valid JSON array of strings.
    `;

    const result = await model.generateContent(systemPrompt);

    if (!result?.response) {
      throw new Error("No response from Gemini");
    }

    const text = result.response.text();
    let suggestions = [];

    try {
      const cleaned = text.replace(/```json|```/g, "").trim();
      const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
      } else {
        suggestions = JSON.parse(cleaned);
      }
    } catch (parseError) {
      console.error("Failed to parse assist JSON:", text);
      suggestions = ["Keep going...", "Elaborate more...", "What happened next?"];
    }

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error("Assist generation failed:", error);
    return NextResponse.json({ suggestions: ["Keep going...", "You're doing great!"] }, { status: 500 });
  }
}
