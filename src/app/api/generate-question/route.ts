import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { history, streak } = await req.json(); // Optional: recently used questions to avoid

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const currentStreak = streak || 0;
    let difficultyContext = "";
    
    if (currentStreak <= 2) {
      difficultyContext = "The user is a beginner (streak 0-2). Ask extremely easy, simple, everyday questions. Example: 'What is your favorite food and why?' or 'Describe a fun weekend you had.' Do not ask complex professional questions.";
    } else if (currentStreak <= 5) {
      difficultyContext = "The user is at an intermediate level (streak 3-5). Ask moderate, standard interview or storytelling questions. Example: 'Tell me about a time you had to work with a team.'";
    } else {
      difficultyContext = "The user is advanced (streak 6+). Ask challenging, complex behavioral or professional questions. Example: 'Describe a situation where you had to make a difficult decision with incomplete information.'";
    }

    const prompt = `
      You are an elite vocal coach. Generate ONE unique, high-impact speaking prompt for a user practicing their English and confidence.
      
      DIFFICULTY LEVEL:
      ${difficultyContext}
      
      CRITICAL:
      1. Keep it under 20 words.
      2. Make it diverse (not just "introduce yourself").
      3. Avoid these recent topics: ${history?.join(", ") || "none"}.
      4. Output ONLY the question text, nothing else. No quotes.
    `;

    const result = await model.generateContent(prompt);
    const question = result.response.text().trim().replace(/^"|"$/g, '');

    return NextResponse.json({ question });
  } catch (error: any) {
    console.error("Question generation failed:", error);
    return NextResponse.json({ 
      error: "Failed to generate question",
      message: error.message,
      question: "Describe a moment where you had to lead a team through a difficult challenge." 
    }, { status: 500 });
  }
}
