import { NextRequest, NextResponse } from "next/server";
import { geminiService } from "@/services/gemini";

export async function POST(request: NextRequest) {
  try {
    const { message, language = "en" } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    // Generate financial advice using Gemini
    const response = await geminiService.generateFinancialAdvice(
      message,
      language
    );
    const category = await geminiService.categorizeFinancialTopic(message);

    return NextResponse.json({
      response,
      category,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in chat API:", error);

    return NextResponse.json(
      {
        error: "Failed to generate response. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "FinGuru Chat API is running",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
}
