import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req: Request) {
  try {
    const { transcript, prompt, brutalMode, imageData } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
      You are a world-class elite communication coach for "REVIAL". 
      Your task is to provide a deep, high-impact analysis of the user's speech.
      ${imageData ? "I have also provided a snapshot of the user while they were speaking. Analyze their facial expressions, eye contact, and body language based on this image." : ""}
      
      CRITICAL INSTRUCTIONS:
      1. DO NOT use any markdown formatting (like **, _, #) in your strings. Use plain text only.
      2. Use simple, plain, and clear language that anyone can understand. Avoid complex jargon.
      3. Be honest, direct, and elite. 
      4. INTENT & RELEVANCE: Analyze if the user actually answered the prompt.
      5. SPEECH RATE & FLOW: Analyze their implied speaking speed.
      6. EXPRESSIONS: ${imageData ? "Provide a concise analysis of their facial expressions and body language." : "Mention that visual feedback was not available but remind them to maintain eye contact."}
      7. BE EXTREMELY CONCISE. 
      
      ${brutalMode ? "MODE: BRUTAL. Point out every hesitation and weak word choice." : "MODE: ELITE COACH. Be strict but constructive."}

      Transcript: "${transcript}"
      Original Prompt: "${prompt}"

      Return ONLY a valid JSON object with this exact structure:
      {
        "confidence_score": number (0-100),
        "clarity_score": number (0-100),
        "fluency_score": number (0-100),
        "tone_score": number (0-100),
        "feedback_summary": "Plain text summary.",
        "mistakes": ["Point 1", "Point 2"],
        "improvement_tips": ["Tip 1", "Tip 2"],
        "better_version": "High-impact rewrite.",
        "tone_analysis": "e.g., Hesitant, Authoritative",
        "expression_analysis": "Concise analysis of facial expressions and body language.",
        "filler_words_detected": number,
        "pace_feedback": "Short comment.",
        "vocab_words": [
          { "word": "Word 1", "meaning": "Meaning 1" }
        ]
      }
    `;

    let result;
    if (imageData) {
      const parts = [
        { text: systemPrompt },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageData.split(",")[1]
          }
        }
      ];
      result = await model.generateContent({ contents: [{ role: "user", parts }] });
    } else {
      result = await model.generateContent(systemPrompt);
    }

    if (!result?.response) {
      throw new Error("No response from Gemini");
    }

    const text = result.response.text();

    let feedback;

    try {
      const cleaned = text.replace(/```json|```/g, "").trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error("No JSON found in AI response");
      }

      feedback = JSON.parse(jsonMatch[0]);

    } catch (err) {
      console.error("JSON PARSE ERROR:", text);

      return NextResponse.json({
        error: "Invalid AI response",
        raw: text
      }, { status: 500 });
    }

    return NextResponse.json(feedback);

  } catch (error: any) {
    console.error("API ERROR:", error);

    return NextResponse.json({
      error: "Failed to analyze speech",
      message: error.message
    }, { status: 500 });
  }
}
