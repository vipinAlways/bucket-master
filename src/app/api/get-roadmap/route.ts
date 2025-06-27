// app/api/ask/route.ts
"use server";

import OpenAI from "openai";
import { NextResponse } from "next/server";


const client = new OpenAI({
  baseURL: "https://api.sambanova.ai/v1", 
  apiKey: process.env.SAMBANOVA_API_KEY,  
});

export async function POST(req: Request) {
  try {
    const prompt  = "hii there";

    const chatCompletion = await client.chat.completions.create({
      messages: [
        { role: "system", content: "Answer the question in a couple sentences." },
        { role: "user", content: prompt },
      ],
      model: "Meta-Llama-3.1-8B-Instruct",
      max_tokens: 300,
      temperature: 0.7,
    });



    const answer = chatCompletion && chatCompletion.choices[0].message.content;
    return NextResponse.json({ response: answer ,chatCompletion});

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
