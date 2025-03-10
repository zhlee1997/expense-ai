import { NextRequest, NextResponse } from "next/server";

import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const body = await req.json();

  const openai = createOpenAI({
    // custom settings, e.g.
    compatibility: "strict", // strict mode, enable when using the OpenAI API
    apiKey: process.env.OPENAI_API_KEY, // your OpenAI API key
  });

  const result = streamText({
    model: openai("o3-mini"),
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    messages: body,
  });

  return result.toTextStreamResponse();

}
