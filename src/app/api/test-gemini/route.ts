import { NextResponse } from "next/server";
import { geminiService } from "@/services/gemini";

export async function GET() {
  try {
    // Test the Gemini API connection
    const isConnected = await geminiService.testConnection();

    if (!isConnected) {
      return NextResponse.json(
        {
          status: "error",
          message: "Gemini AI service is not responding",
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }

    // Test a simple financial advice generation
    const testResponse = await geminiService.generateFinancialAdvice(
      "What is the importance of emergency funds?",
      "en"
    );

    return NextResponse.json({
      status: "success",
      message: "Gemini AI service is working correctly",
      testResponse: testResponse.substring(0, 100) + "...", // Show first 100 chars
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Gemini test error:", error);

    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
