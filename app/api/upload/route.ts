import { NextRequest, NextResponse } from "next/server";

import { nanoid } from "nanoid";
import supabase from "@/config/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const filename = `${nanoid()}.${file.name.split(".").pop()}`;
    const buffer = await file.arrayBuffer();

    const { data, error } = await supabase.storage
      .from("expense-tracker")
      .upload(filename, Buffer.from(buffer));

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: fileDataResponse } = supabase.storage
      .from("expense-tracker")
      .getPublicUrl(data.path);

    // UPLOAD IMAGE URL TO SUPABASE TABLE (id, url, filename, user_id, created_at)
    // if (fileDataResponse?.publicUrl) {
    // TODO: assume direct submit image
    const submitImageUrl = new URL(
      "/api/submit-image",
      req.nextUrl.origin
    ).toString();

    await fetch(submitImageUrl, {
      method: "POST",
      body: JSON.stringify({
        fileDataResponse: fileDataResponse?.publicUrl,
        filename: file.name,
      }),
    });
    // }

    return NextResponse.json({
      url: fileDataResponse?.publicUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}
