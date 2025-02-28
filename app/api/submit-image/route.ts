import { NextRequest, NextResponse } from "next/server";

import supabase from "@/config/supabase";

// UPLOAD IMAGE URL TO SUPABASE TABLE (id, url, filename, user_id, created_at)
export async function POST(req: NextRequest) {
  try {
    const { fileDataResponse, filename } = await req.json();

    const { data: insertData, error: insertError } = await supabase
      .from("expense_images")
      .insert([
        {
          url: fileDataResponse,
          filename: filename,
          user_id: 9999,
        },
      ])
      .select();

    if (insertError) {
      //   return NextResponse.json({ error: insertError.message }, { status: 500 });
      throw new Error(`Error inserting data: ${insertError.message}`);
    }

    // Absolute URL for server-side fetch (OpenAI Vision Model)
    const queryImageUrl = new URL(
      "/api/query-image",
      req.nextUrl.origin
    ).toString();

    const resultData = await fetch(queryImageUrl, {
      method: "POST",
      body: JSON.stringify({
        image: fileDataResponse,
      }),
    });

    const {
      data: { result, embedResult },
    } = await resultData.json();

    // console.log("insertData: ", insertData[0].id);
    // console.log("insertError: ", insertError);

    // console.log("embedResult: ", embedResult)

    // save the returned result to the database
    const { data: insertReceiptsData, error: insertReceiptsError } =
      await supabase.from("receipts").insert(
        embedResult.map(
          (embedding: { embedding: number[]; content: string }) => ({
            chunk_text: embedding.content,
            embedding: embedding.embedding,
            userid: 9999,
            imageid: insertData[0].id,
            shopname: result["shop_name"],
            transactiondate: result["transaction_date"],
            total: result["total"],
            metadata: {
              source: "uploaded_receipt_docs",
              extracted_at: new Date().toISOString(),
            },
          })
        )
      );

    console.log("insertReceiptsData: ", insertReceiptsData);
    console.log("insertReceiptsError: ", insertReceiptsError);

    return NextResponse.json({ data: "success" });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}
