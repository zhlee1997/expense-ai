import { NextRequest, NextResponse } from "next/server";

import { createOpenAI } from "@ai-sdk/openai";
import { generateText, generateObject } from "ai";
import z from "zod";
import { generateEmbeddings } from "@/lib/ai/embedding";

// TODO: Pass the image URL to the OpenAI API
export async function POST(req: NextRequest) {
  const { image } = await req.json();

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
          {
            type: "text",
            text: "This is a receipt or invoice. Please extract the shop name, total price and transaction date (in standard ISO datetime format is YYYY-MM-DDThh:mm:ss).",
          },
          {
            type: "image",
            image: image,

            // OpenAI specific options - image detail:
            providerOptions: {
              openai: { imageDetail: "low" },
            },
          },
        ],
      },
    ],
  });

  // const embeddingModel = openai.embedding("text-embedding-3-small");

  // const embedResult = await embeddingModel.doEmbed({
  //   values: [text.trim()],
  // });

  // const embedResultList = embedResult.embeddings;

  const embeddings = await generateEmbeddings(text);

  const result = await generateObject({
    model: openai("gpt-4o-mini", {
      structuredOutputs: true,
    }),
    schemaName: "recipe",
    schemaDescription: "This is a schema information of a receipt or invoice.",
    schema: z.object({
      shop_name: z.string(),
      total: z.number(),
      transaction_date: z.string(),
    }),
    prompt: text,
  });

  console.log("result in json: ", JSON.stringify(result.object, null, 2));
  console.log("embedResult: ", embeddings);

  return NextResponse.json({
    data: {
      result: result.object,
      embedResult: embeddings,
    },
  });
}
