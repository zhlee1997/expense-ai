import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { receipts } from "../db/schema/resources";

const embeddingModel = openai.embedding("text-embedding-3-small");

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split(".")
    .filter((i) => i !== "");
};

export const generateEmbeddings = async (
  value: string
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\\n", " ");
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
  const client = postgres(process.env.NEXT_PUBLIC_SUPABASE_URL || "");
  const db = drizzle(client);
  console.log(`findRelevantContent called: ${userQuery}`);

  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    receipts.embedding,
    userQueryEmbedded
  )})`;
  console.log(`findRelevantContent similarity: ${similarity}`);

  const similarReceipts = await db
    .select({ name: receipts.chunk_text, similarity })
    .from(receipts)
    .where(gt(similarity, 0.25))
    .orderBy((t) => desc(t.similarity))
    .limit(10);
  console.log(`findRelevantContent similarReceipts: ${similarReceipts}`);

  return similarReceipts;
};
