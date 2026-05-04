import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ suggestions: ["Keep going...", "You're doing great!"] }, { status: 500 });
    }

    const { transcript, prompt } = await req.json();

    if (!transcript) {
      return NextResponse.json({ suggestions: ["Start speaking to get suggestions..."] });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const systemPrompt = `
      You are a helpful speaking coach. 
      The user is answering: "${prompt}"
      They said: "${transcript}"

      The user is stuck. Give 3 SHORT and SIMPLE 'Talk Points' in easy English to help them continue.
      
      Rules:
      1. Use ONLY simple, everyday English (no high-level words).
      2. Keep phrases very short (3-5 words).
      3. Make them very easy to understand and speak.
      4. Focus on what they should say next.

      Format: ["Simple Phrase 1", "Simple Phrase 2", "Simple Phrase 3"]
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }]
    });

    const response = await result.response;
    if (!response) {
      throw new Error("Empty response from Gemini API");
    }

    const text = response.text();
    let suggestions = [];

    try {
      const cleaned = text.replace(/```json|```/g, "").trim();
      const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
      suggestions = JSON.parse(jsonMatch ? jsonMatch[0] : cleaned);
    } catch (parseError) {
      console.error("Gemini JSON Parse Error:", text);
      suggestions = ["Keep going...", "Elaborate more...", "What happened next?"];
    }

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error("Gemini Assist Error:", error);
    return NextResponse.json({ suggestions: ["Keep going...", "You're doing great!"] }, { status: 500 });
  }
}
