import { NextResponse } from "next/server";

import supabase from "@/config/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("expense_images")
      .select("url, filename, created_at");

    return NextResponse.json({ data });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching docs:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
