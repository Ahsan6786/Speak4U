import { NextResponse } from "next/server";
import { QUESTIONS } from "@/lib/questions";

export async function POST(req: Request) {
  try {
    const { history, streak } = await req.json();
    const currentStreak = streak || 0;
    
    let category: "beginner" | "intermediate" | "advanced" = "beginner";
    if (currentStreak >= 3 && currentStreak <= 5) {
      category = "intermediate";
    } else if (currentStreak >= 6) {
      category = "advanced";
    }

    const levelQuestions = QUESTIONS[category];
    
    // Filter out recently used questions
    const availableQuestions = levelQuestions.filter(q => !history?.includes(q));
    
    // Fallback if all questions have been used recently (unlikely)
    const finalPool = availableQuestions.length > 0 ? availableQuestions : levelQuestions;
    
    // Pick a random question
    const question = finalPool[Math.floor(Math.random() * finalPool.length)];

    return NextResponse.json({ question });
  } catch (error: any) {
    console.error("Question retrieval failed:", error);
    return NextResponse.json({ 
      error: "Failed to retrieve question",
      question: "What is your favorite food and why?" 
    }, { status: 500 });
  }
}
