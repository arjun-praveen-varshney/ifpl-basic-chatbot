export interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  language?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  topics: string[];
}

export interface UserProfile {
  id: string;
  name?: string;
  preferredLanguage: string;
  conversations: Conversation[];
  financialTopics: string[];
  onboardingCompleted: boolean;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  image: string;
}

export type ChatInputMode = "text" | "voice";

export interface FinancialTopic {
  id: string;
  name: string;
  category: string;
  description: string;
}
