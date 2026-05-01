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

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const systemPrompt = `
      You are a live speaking assistant teleprompter. 
      The user is answering this question: "${prompt}"
      So far, they have said: "${transcript}"

      Your task is to guess the next logical few words to help them continue their thought seamlessly.
      Provide EXACTLY 3 different short, punchy continuation fragments. 
      Keep each suggestion between 2 to 4 words maximum.
      Do not output anything else. No quotes, no markdown, no conversational filler.
      Format the output as a valid JSON array of strings. Example:
      ["and then I", "which led to", "so I decided"]
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
