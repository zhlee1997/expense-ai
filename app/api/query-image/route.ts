import { NextResponse } from "next/server";

import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

// TODO: Pass the image URL to the OpenAI API
export async function POST() {
  //   const body = await req.json();

  const openai = createOpenAI({
    // custom settings, e.g.
    compatibility: "strict", // strict mode, enable when using the OpenAI API
    apiKey: process.env.OPENAI_API_KEY, // your OpenAI API key
  });

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Describe the image in detail." },
          {
            type: "image",
            image:
              "https://github.com/vercel/ai/blob/main/examples/ai-core/data/comic-cat.png?raw=true",

            // OpenAI specific options - image detail:
            providerOptions: {
              openai: { imageDetail: "low" },
            },
          },
        ],
      },
    ],
  });

  console.log("text: ", text);

  return NextResponse.json({
    data: text,
  });
}
