import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is missing from environment" }, { status: 500 });
    }

    const { answers, brutalMode } = await req.json();

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "No answers provided" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const systemPrompt = `
      You are an elite vocal coach at REVIAL. The user just completed a 'Rapid Fire' speaking drill consisting of 6 consecutive questions.
      
      DATA:
      ${answers.map((a: any, i: number) => `Q${i+1}: ${a.q}\nA${i+1}: ${a.a}`).join('\n\n')}

      Your task is to provide a comprehensive, high-performance analysis of the ENTIRE drill.
      
      ${brutalMode ? "STRICT MODE: Be extremely critical, honest, and direct." : "NORMAL MODE: Be professional and constructive."}

      Output EXACTLY in this JSON format:
      {
        "confidence_score": number,
        "clarity_score": number,
        "fluency_score": number,
        "tone_score": number,
        "feedback_summary": "string",
        "mistakes": ["string"],
        "improvement_tips": ["string"],
        "better_version": "string",
        "tone_analysis": "string",
        "filler_words_detected": number,
        "pace_feedback": "string",
        "vocab_words": [{"word": "string", "meaning": "string"}],
        "per_answer_summaries": ["string", "string", "string", "string", "string", "string"],
        "ideal_answers": ["string", "string", "string", "string", "string", "string"]
      }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }]
    });

    const response = await result.response;
    if (!response) {
      throw new Error("Empty response from Gemini API");
    }

    const text = response.text();
    let feedback;

    try {
      const cleaned = text.replace(/```json|```/g, "").trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      feedback = JSON.parse(jsonMatch ? jsonMatch[0] : cleaned);
    } catch (parseError) {
      console.error("Gemini JSON Parse Error:", text);
      return NextResponse.json({
        error: "AI returned invalid response format",
        raw: text.substring(0, 500)
      }, { status: 500 });
    }

    return NextResponse.json(feedback);
  } catch (error: any) {
    console.error("Gemini Analyze-Rapid Error:", error);
    return NextResponse.json({ 
      error: "Rapid analysis failed",
      message: error.message
    }, { status: 500 });
  }
}
