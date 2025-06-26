import { anthropic } from "@/Openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const msg = await anthropic.messages.create({
    model: "claude-opus-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: "Hello, Claude" }],
  });
  console.log(msg);
}
