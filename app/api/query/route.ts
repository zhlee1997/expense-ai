import { NextRequest, NextResponse } from "next/server";

import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const openai = createOpenAI({
    // custom settings, e.g.
    compatibility: "strict", // strict mode, enable when using the OpenAI API
    apiKey: process.env.OPENAI_API_KEY, // your OpenAI API key
  });

  const { text } = await generateText({
    model: openai("gpt-4-turbo"),
    prompt: body,
  });

  return NextResponse.json({
    data: text,
  });
}
