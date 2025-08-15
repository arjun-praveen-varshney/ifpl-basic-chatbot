import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "FinGuru API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    features: [
      "Multilingual financial advice",
      "Gemini AI integration",
      "Conversation management",
      "User profile tracking",
    ],
  });
}
