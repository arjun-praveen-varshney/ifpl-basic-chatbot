import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("Gemini API key is not configured");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export class FinGeminiService {
  private model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  private fallbackModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-8b",
  });

  async generateFinancialAdvice(
    query: string,
    language: string = "en"
  ): Promise<string> {
    // Try primary model first, then fallback
    let lastError: Error | null = null;

    for (const model of [this.model, this.fallbackModel]) {
      try {
        const prompt = this.buildFinancialPrompt(query, language);
        const result = await model.generateContent(prompt);
        const response = await result.response;

        // Check if response is blocked or empty
        if (!response.text()) {
          throw new Error(
            "No response generated - content may have been blocked"
          );
        }

        return response.text();
      } catch (error) {
        console.error("Error with model:", error);
        lastError = error instanceof Error ? error : new Error("Unknown error");

        // If it's a 503 (overloaded), try the fallback model
        if (error instanceof Error && error.message.includes("503")) {
          continue;
        }

        // For other errors, break early
        break;
      }
    }

    // Handle the final error
    if (lastError) {
      if (lastError.message.includes("404")) {
        throw new Error(
          "AI service temporarily unavailable. Please try again later."
        );
      } else if (lastError.message.includes("API key")) {
        throw new Error("Configuration error. Please contact support.");
      } else if (lastError.message.includes("quota")) {
        throw new Error("Service limit reached. Please try again later.");
      } else if (
        lastError.message.includes("503") ||
        lastError.message.includes("overloaded")
      ) {
        throw new Error(
          "AI service is currently busy. Please try again in a few moments."
        );
      }
    }

    throw new Error(
      "Unable to generate financial advice right now. Please try again."
    );
  }

  private buildFinancialPrompt(query: string, language: string): string {
    const languageInstruction =
      language !== "en"
        ? `Please respond in ${this.getLanguageName(language)} language.`
        : "";

    return `You are FinGuru, a knowledgeable and friendly financial advisor chatbot. 
    Your role is to provide helpful, accurate, and easy-to-understand financial advice.
    
    Guidelines:
    1. Provide practical, actionable financial advice
    2. Use simple language that anyone can understand
    3. Include relevant examples when helpful
    4. Always encourage responsible financial behavior
    5. If the question is not finance-related, politely redirect to financial topics
    6. Consider Indian financial context and regulations when relevant
    7. Suggest consulting with certified financial advisors for complex matters
    
    ${languageInstruction}
    
    User Query: ${query}
    
    Please provide a helpful and informative response:`;
  }

  private getLanguageName(code: string): string {
    const languageMap: { [key: string]: string } = {
      hi: "Hindi",
      bn: "Bengali",
      te: "Telugu",
      mr: "Marathi",
      ta: "Tamil",
      gu: "Gujarati",
      kn: "Kannada",
      ml: "Malayalam",
      pa: "Punjabi",
    };
    return languageMap[code] || "English";
  }

  async categorizeFinancialTopic(query: string): Promise<string> {
    try {
      const prompt = `Categorize this financial query into one of these categories:
      - Investment
      - Savings
      - Insurance
      - Loans & Credit
      - Tax Planning
      - Retirement Planning
      - Budgeting
      - Real Estate
      - Emergency Fund
      - General Finance
      
      Query: ${query}
      
      Respond with only the category name:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;

      if (!response.text()) {
        return "General Finance";
      }

      return response.text().trim();
    } catch (error) {
      console.error("Error categorizing topic:", error);
      return "General Finance";
    }
  }

  // Test method to verify API connectivity
  async testConnection(): Promise<boolean> {
    try {
      // Use a simple prompt that's less likely to be overloaded
      const result = await this.model.generateContent("Hi");
      const response = await result.response;
      return !!response.text();
    } catch (error) {
      console.error("API connection test failed:", error);

      // Try fallback model if primary fails
      try {
        const result = await this.fallbackModel.generateContent("Hi");
        const response = await result.response;
        return !!response.text();
      } catch (fallbackError) {
        console.error("Fallback API test also failed:", fallbackError);
        return false;
      }
    }
  }
}

export const geminiService = new FinGeminiService();
