import { NextResponse } from "next/server";

export async function GET() {
  try {
  } catch (error: any) {
    console.error("Error fetching docs:", error.response);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
