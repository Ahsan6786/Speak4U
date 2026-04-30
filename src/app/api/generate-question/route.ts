import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { history } = await req.json(); // Optional: recently used questions to avoid

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are an elite vocal coach. Generate ONE unique, high-impact speaking prompt for a user practicing their English and confidence.
      The prompt should be interesting, professional, or personal, such as a job interview question, a storytelling prompt, or a scenario-based challenge.
      
      CRITICAL:
      1. Keep it under 20 words.
      2. Make it diverse (not just "introduce yourself").
      3. Avoid these recent topics: ${history?.join(", ") || "none"}.
      4. Output ONLY the question text, nothing else. No quotes.
    `;

    const result = await model.generateContent(prompt);
    const question = result.response.text().trim().replace(/^"|"$/g, '');

    return NextResponse.json({ question });
  } catch (error) {
    console.error("Question generation failed:", error);
    return NextResponse.json({ 
      question: "Describe a moment where you had to lead a team through a difficult challenge." 
    });
  }
}
