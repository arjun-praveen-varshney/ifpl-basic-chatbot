import { useState, useEffect } from "react";
import { Conversation, Message } from "@/types";
import { storageService } from "@/services/storage";
import { geminiService } from "@/services/gemini";

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConversations = () => {
      const saved = storageService.getConversations();
      setConversations(saved);
    };

    loadConversations();
  }, []);

  const startNewConversation = () => {
    const newConversation = storageService.createNewConversation();
    setCurrentConversation(newConversation);
    return newConversation;
  };

  const selectConversation = (conversationId: string) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  };

  const sendMessage = async (content: string, language: string = "en") => {
    if (!currentConversation) {
      const newConversation = startNewConversation();
      setCurrentConversation(newConversation);
    }

    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      content,
      sender: "user",
      timestamp: new Date(),
      language,
    };

    setLoading(true);
    setError(null);

    try {
      // Add user message
      if (currentConversation) {
        storageService.addMessageToConversation(
          currentConversation.id,
          userMessage
        );

        // Update local state
        const updatedConversation = {
          ...currentConversation,
          messages: [...currentConversation.messages, userMessage],
        };
        setCurrentConversation(updatedConversation);

        // Generate bot response
        let botResponse: string;
        let category: string;

        try {
          botResponse = await geminiService.generateFinancialAdvice(
            content,
            language
          );
          category = await geminiService.categorizeFinancialTopic(content);
        } catch (apiError) {
          console.error("API Error:", apiError);

          // Fallback response when AI is unavailable
          botResponse = getFallbackResponse(content, language);
          category = "General Finance";
        }

        const botMessage: Message = {
          id: `msg_${Date.now()}_bot`,
          content: botResponse,
          sender: "bot",
          timestamp: new Date(),
          language,
        };

        // Add bot message
        storageService.addMessageToConversation(
          currentConversation.id,
          botMessage
        );
        storageService.addTopicToConversation(currentConversation.id, category);

        // Update local state
        const finalConversation = {
          ...updatedConversation,
          messages: [...updatedConversation.messages, botMessage],
          topics: [...(updatedConversation.topics || []), category].filter(
            (topic, index, arr) => arr.indexOf(topic) === index
          ),
        };
        setCurrentConversation(finalConversation);

        // Update conversations list
        const updatedConversations = storageService.getConversations();
        setConversations(updatedConversations);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = (conversationId: string) => {
    const updatedConversations = conversations.filter(
      (c) => c.id !== conversationId
    );
    setConversations(updatedConversations);

    // Update storage
    localStorage.setItem(
      "finguru_conversations",
      JSON.stringify(updatedConversations)
    );

    // If current conversation is deleted, clear it
    if (currentConversation?.id === conversationId) {
      setCurrentConversation(null);
    }
  };

  const clearError = () => setError(null);

  return {
    conversations,
    currentConversation,
    loading,
    error,
    startNewConversation,
    selectConversation,
    sendMessage,
    deleteConversation,
    clearError,
  };
}

// Fallback response when AI service is unavailable
function getFallbackResponse(query: string, language: string): string {
  const responses = {
    en: {
      greeting:
        "Thank you for your question about financial planning. I'm currently experiencing some technical difficulties, but I'd be happy to provide some general guidance.",
      investment:
        "For investment advice, I recommend consulting with a certified financial advisor who can provide personalized guidance based on your specific situation.",
      savings:
        "Building a savings habit is crucial for financial health. Consider starting with a goal to save at least 20% of your income.",
      general:
        "I apologize, but I'm currently unable to provide detailed financial advice due to technical issues. Please try again later or consult with a financial professional.",
    },
    hi: {
      greeting:
        "आपके वित्तीय योजना के बारे में प्रश्न के लिए धन्यवाद। मुझे वर्तमान में कुछ तकनीकी कठिनाइयां हो रही हैं।",
      investment:
        "निवेश सलाह के लिए, मैं एक प्रमाणित वित्तीय सलाहकार से सलाह लेने की सिफारिश करता हूं।",
      savings: "बचत की आदत बनाना वित्तीय स्वास्थ्य के लिए महत्वपूर्ण है।",
      general:
        "मुझे खुशी होगी कि मैं आपकी सहायता कर सकूं, लेकिन वर्तमान में तकनीकी समस्याएं हैं।",
    },
  };

  const lang = language === "hi" ? "hi" : "en";
  const langResponses = responses[lang];

  // Simple keyword matching for fallback responses
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes("invest") || lowerQuery.includes("निवेश")) {
    return langResponses.investment;
  } else if (lowerQuery.includes("save") || lowerQuery.includes("बचत")) {
    return langResponses.savings;
  } else if (
    lowerQuery.includes("hello") ||
    lowerQuery.includes("hi") ||
    lowerQuery.includes("नमस्ते")
  ) {
    return langResponses.greeting;
  }

  return langResponses.general;
}
