import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { answers, brutalMode } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest",
    });

    const modeText = brutalMode
      ? "Be brutally honest. Point out every mistake."
      : "Be a strict but helpful speaking coach.";

    const systemPrompt = `
${modeText}

Analyze these rapid-fire answers:
${answers.map((a: any, i: number) => `Q${i+1}: ${a.q}\nA${i+1}: ${a.a}`).join('\n\n')}

Return ONLY valid JSON. No markdown. No conversational filler.

{
  "confidence_score": number,
  "clarity_score": number,
  "fluency_score": number,
  "tone_score": number,
  "feedback_summary": string,
  "mistakes": string[],
  "improvement_tips": string[],
  "better_version": string,
  "tone_analysis": string,
  "filler_words_detected": number,
  "pace_feedback": string,
  "vocab_words": [{"word": string, "meaning": string}],
  "per_answer_summaries": string[],
  "ideal_answers": string[]
}
`;

    const result = await model.generateContent(systemPrompt);
    const raw = result.response.text();

    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error("RAW AI RESPONSE:", raw);
      return NextResponse.json(
        { error: "Invalid AI JSON", raw: raw },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error("Rapid analyze failed:", error);
    return NextResponse.json(
      {
        error: "Rapid analyze failed",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
