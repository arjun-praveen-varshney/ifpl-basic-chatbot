"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Globe } from "lucide-react";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "@/config/languages";
import { Language } from "@/types";

interface LanguageSelectionProps {
  currentLanguage?: string;
  onLanguageSelect: (language: Language) => void;
  onContinue: () => void;
}

export default function LanguageSelection({
  currentLanguage = DEFAULT_LANGUAGE.code,
  onLanguageSelect,
  onContinue,
}: LanguageSelectionProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language.code);
    onLanguageSelect(language);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-green-100 to-transparent rounded-bl-full opacity-50" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-100 to-transparent rounded-tr-full opacity-50" />

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Globe className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Choose Your Language
          </h1>
          <p className="text-gray-600 text-lg">
            अपनी भाषा चुनें | Select your preferred language
          </p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {SUPPORTED_LANGUAGES.map((language, index) => (
            <motion.button
              key={language.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleLanguageSelect(language)}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group ${
                selectedLanguage === language.code
                  ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-102"
              }`}
            >
              {/* Selection indicator */}
              {selectedLanguage === language.code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <Check className="text-white" size={14} />
                </motion.div>
              )}

              {/* Flag */}
              <div className="text-2xl mb-2">{language.flag}</div>

              {/* Language names */}
              <div className="font-semibold text-gray-800 text-sm">
                {language.name}
              </div>
              <div className="text-gray-600 text-xs">{language.nativeName}</div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
            </motion.button>
          ))}
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <button
            onClick={onContinue}
            className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 px-8 rounded-2xl font-semibold text-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Continue to FinGuru
          </button>

          <p className="text-gray-500 text-sm mt-4">
            You can change this anytime in settings
          </p>
        </motion.div>

        {/* Popular languages indicator */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Most popular: Hindi, English, Bengali
          </div>
        </div>
      </motion.div>
    </div>
  );
}
