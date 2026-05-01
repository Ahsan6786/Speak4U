import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { answers, brutalMode } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const systemPrompt = `
      You are an elite vocal coach at REVIAL. The user just completed a 'Rapid Fire' speaking drill consisting of 6 consecutive questions.
      
      DATA:
      ${answers.map((a: any, i: number) => `Q${i+1}: ${a.q}\nA${i+1}: ${a.a}`).join('\n\n')}

      Your task is to provide a comprehensive, high-performance analysis of the ENTIRE drill.
      
      ${brutalMode ? "STRICT MODE: Be extremely critical, honest, and direct. Focus on even minor flaws in delivery and logic." : "NORMAL MODE: Be encouraging but professional and constructive."}

      Output EXACTLY in this JSON format:
      {
        "confidence_score": number, (0-100)
        "clarity_score": number, (0-100)
        "fluency_score": number, (0-100)
        "tone_score": number, (0-100)
        "feedback_summary": "High-level summary of their overall communication style across all 6 answers",
        "mistakes": ["specific mistake in answer 1", "structural issue in answer 2", etc],
        "improvement_tips": ["actionable tip 1", "actionable tip 2", "actionable tip 3"],
        "better_version": "A premium, polished version of their best answer from the round",
        "tone_analysis": "Energy level and presence analysis",
        "filler_words_detected": number,
        "pace_feedback": "Analysis of their speaking speed",
        "vocab_words": [{"word": "string", "meaning": "string"}],
        "per_answer_summaries": ["Answer 1 summary", "Answer 2 summary", "Answer 3 summary", "Answer 4 summary", "Answer 5 summary", "Answer 6 summary"],
        "ideal_answers": ["Professional Redelivery for Q1", "Professional Redelivery for Q2", "Professional Redelivery for Q3", "Professional Redelivery for Q4", "Professional Redelivery for Q5", "Professional Redelivery for Q6"]
      }
    `;

    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, "").trim();
    
    return NextResponse.json(JSON.parse(cleaned));
  } catch (error: any) {
    console.error("Rapid analysis failed:", error);
    return NextResponse.json({ error: "Failed to analyze rapid fire" }, { status: 500 });
  }
}
