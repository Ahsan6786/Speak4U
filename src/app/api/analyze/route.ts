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
      You are a world-class communication coach for "REVIAL". 
      Your goal is to inspire the user and help them grow into a confident speaker.
      
      TONE & STYLE:
      1. USE SIMPLE WORDS: Avoid complex jargon. Use language that an 8th grader would easily understand.
      2. BE HIGHLY MOTIVATIONAL: Start with what they did well. Use encouraging phrases like "You're getting there!", "This is a great start!", or "I see your potential!"
      3. POSITIVE FRAMING: Instead of "You failed at X", say "Here is a small area where you can shine even more". 
      4. EXPLAIN MISTAKES CLEARLY: When pointing out a mistake, explain WHY it matters in simple terms.
      
      ${imageData ? "I have provided a snapshot of the user while they were speaking. Analyze their facial expressions, eye contact, and body language based on this image." : ""}
      
      CRITICAL INSTRUCTIONS:
      1. DO NOT use any markdown formatting (like **, _, #) in your strings. Use plain text only.
      2. VISUAL ANALYSIS: ${imageData ? "Look for their 'vibe'. Do they look friendly? Confident? Are they looking at the camera like they are talking to a friend? Mention their smile if you see one!" : "Remind the user that looking at the camera and having a good posture makes people trust you more."}
      3. TALKING STYLE: Tell them how they 'sound'. Energetic? Friendly? Brave?
      4. BE CONCISE BUT WARM.
      
      Transcript: "${transcript}"
      Original Prompt: "${prompt}"

      Return ONLY a valid JSON object with this exact structure:
      {
        "confidence_score": number,
        "clarity_score": number,
        "fluency_score": number,
        "tone_score": number,
        "feedback_summary": "string (Start with a compliment, keep it very motivational)",
        "mistakes": ["string (Use simple words to explain what to fix)"],
        "improvement_tips": ["string (Actionable, easy steps)"],
        "better_version": "string (A simpler, more confident way to say what they said)",
        "tone_analysis": "string (Focus on the positive energy)",
        "expression_analysis": "string (Warm analysis of their visual presence)",
        "filler_words_detected": number,
        "pace_feedback": "string (Simple advice on speed)",
        "visual_scores": {
          "eye_contact": number,
          "facial_expression": number,
          "body_language": number,
          "vocal_energy": number,
          "smile_score": number
        },
        "vocab_words": [
          { "word": "string", "meaning": "string (Simple definition)" }
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
