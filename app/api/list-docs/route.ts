import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Your logic here
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
