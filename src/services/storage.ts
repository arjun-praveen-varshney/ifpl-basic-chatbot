import { UserProfile, Conversation, Message } from "@/types";
import { DEFAULT_LANGUAGE } from "@/config/languages";

class LocalStorageService {
  private readonly USER_PROFILE_KEY = "finguru_user_profile";
  private readonly CONVERSATIONS_KEY = "finguru_conversations";

  // User Profile Management
  getUserProfile(): UserProfile | null {
    if (typeof window === "undefined") return null;

    try {
      const profile = localStorage.getItem(this.USER_PROFILE_KEY);
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error("Error reading user profile:", error);
      return null;
    }
  }

  saveUserProfile(profile: UserProfile): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(this.USER_PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error("Error saving user profile:", error);
    }
  }

  createDefaultProfile(): UserProfile {
    const defaultProfile: UserProfile = {
      id: `user_${Date.now()}`,
      preferredLanguage: DEFAULT_LANGUAGE.code,
      conversations: [],
      financialTopics: [],
      onboardingCompleted: false,
    };

    this.saveUserProfile(defaultProfile);
    return defaultProfile;
  }

  updatePreferredLanguage(languageCode: string): void {
    const profile = this.getUserProfile();
    if (profile) {
      profile.preferredLanguage = languageCode;
      this.saveUserProfile(profile);
    }
  }

  markOnboardingCompleted(): void {
    const profile = this.getUserProfile();
    if (profile) {
      profile.onboardingCompleted = true;
      this.saveUserProfile(profile);
    }
  }

  // Conversation Management
  getConversations(): Conversation[] {
    if (typeof window === "undefined") return [];

    try {
      const conversations = localStorage.getItem(this.CONVERSATIONS_KEY);
      return conversations ? JSON.parse(conversations) : [];
    } catch (error) {
      console.error("Error reading conversations:", error);
      return [];
    }
  }

  saveConversation(conversation: Conversation): void {
    if (typeof window === "undefined") return;

    try {
      const conversations = this.getConversations();
      const existingIndex = conversations.findIndex(
        (c) => c.id === conversation.id
      );

      if (existingIndex >= 0) {
        conversations[existingIndex] = conversation;
      } else {
        conversations.unshift(conversation);
      }

      // Keep only last 50 conversations
      const trimmedConversations = conversations.slice(0, 50);
      localStorage.setItem(
        this.CONVERSATIONS_KEY,
        JSON.stringify(trimmedConversations)
      );

      // Update user profile
      const profile = this.getUserProfile();
      if (profile) {
        profile.conversations = trimmedConversations;
        this.saveUserProfile(profile);
      }
    } catch (error) {
      console.error("Error saving conversation:", error);
    }
  }

  createNewConversation(): Conversation {
    const conversation: Conversation = {
      id: `conv_${Date.now()}`,
      title: "New Conversation",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      topics: [],
    };

    return conversation;
  }

  addMessageToConversation(conversationId: string, message: Message): void {
    const conversations = this.getConversations();
    const conversation = conversations.find((c) => c.id === conversationId);

    if (conversation) {
      conversation.messages.push(message);
      conversation.updatedAt = new Date();

      // Generate title from first user message if it's still "New Conversation"
      if (
        conversation.title === "New Conversation" &&
        message.sender === "user"
      ) {
        conversation.title = this.generateConversationTitle(message.content);
      }

      this.saveConversation(conversation);
    }
  }

  addTopicToConversation(conversationId: string, topic: string): void {
    const conversations = this.getConversations();
    const conversation = conversations.find((c) => c.id === conversationId);

    if (conversation && !conversation.topics.includes(topic)) {
      conversation.topics.push(topic);
      this.saveConversation(conversation);
    }
  }

  private generateConversationTitle(firstMessage: string): string {
    // Take first 30 characters and add ellipsis if longer
    return firstMessage.length > 30
      ? firstMessage.substring(0, 30) + "..."
      : firstMessage;
  }

  // Financial Topics Management
  addFinancialTopic(topic: string): void {
    const profile = this.getUserProfile();
    if (profile && !profile.financialTopics.includes(topic)) {
      profile.financialTopics.push(topic);
      this.saveUserProfile(profile);
    }
  }

  getFinancialTopics(): string[] {
    const profile = this.getUserProfile();
    return profile?.financialTopics || [];
  }

  // Clear all data
  clearAllData(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem(this.USER_PROFILE_KEY);
    localStorage.removeItem(this.CONVERSATIONS_KEY);
  }
}

export const storageService = new LocalStorageService();
