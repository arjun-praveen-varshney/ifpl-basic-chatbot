import { useState, useEffect } from "react";
import { UserProfile } from "@/types";
import { storageService } from "@/services/storage";

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = () => {
      let userProfile = storageService.getUserProfile();

      if (!userProfile) {
        userProfile = storageService.createDefaultProfile();
      }

      setProfile(userProfile);
      setLoading(false);
    };

    loadProfile();
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
      storageService.saveUserProfile(updatedProfile);
    }
  };

  const updateLanguage = (languageCode: string) => {
    storageService.updatePreferredLanguage(languageCode);
    if (profile) {
      setProfile({ ...profile, preferredLanguage: languageCode });
    }
  };

  const markOnboardingCompleted = () => {
    storageService.markOnboardingCompleted();
    if (profile) {
      setProfile({ ...profile, onboardingCompleted: true });
    }
  };

  const addFinancialTopic = (topic: string) => {
    storageService.addFinancialTopic(topic);
    if (profile && !profile.financialTopics.includes(topic)) {
      setProfile({
        ...profile,
        financialTopics: [...profile.financialTopics, topic],
      });
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    updateLanguage,
    markOnboardingCompleted,
    addFinancialTopic,
  };
}
