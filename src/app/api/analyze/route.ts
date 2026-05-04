import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is missing from environment" }, { status: 500 });
    }

    const { transcript, prompt, brutalMode, imageData } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const systemPrompt = `
      You are a world-class elite communication coach for "REVIAL". 
      Your task is to provide a deep, high-impact analysis of the user's speech.
      ${imageData ? "I have also provided a snapshot of the user while they were speaking. Analyze their facial expressions, eye contact, and body language based on this image." : ""}
      
      CRITICAL INSTRUCTIONS:
      1. DO NOT use any markdown formatting (like **, _, #) in your strings. Use plain text only.
      2. Use simple, plain, and clear language.
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
        "confidence_score": number,
        "clarity_score": number,
        "fluency_score": number,
        "tone_score": number,
        "feedback_summary": "string",
        "mistakes": ["string"],
        "improvement_tips": ["string"],
        "better_version": "string",
        "tone_analysis": "string",
        "expression_analysis": "string",
        "filler_words_detected": number,
        "pace_feedback": "string",
        "vocab_words": [
          { "word": "string", "meaning": "string" }
        ]
      }
    `;

    let result;
    if (imageData && imageData.includes(",")) {
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
      result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: systemPrompt }] }]
      });
    }

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
    console.error("Gemini Route Error:", error);
    return NextResponse.json({
      error: "Analysis failed",
      message: error.message
    }, { status: 500 });
  }
}
