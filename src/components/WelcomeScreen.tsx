"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { ONBOARDING_SLIDES } from "@/data/onboarding";
import { OnboardingSlide } from "@/types";

interface WelcomeScreenProps {
  onComplete: () => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = () => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1);
        setIsTransitioning(false);
      }, 150);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(currentSlide - 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 text-center relative overflow-hidden"
        >
          {/* Background pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full opacity-50" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-100 to-transparent rounded-tr-full opacity-50" />

          {/* Progress indicator */}
          <div className="flex justify-center mb-6">
            {ONBOARDING_SLIDES.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full mx-1 transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-blue-500 w-6"
                    : index < currentSlide
                    ? "bg-blue-300"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              {/* App Logo */}
              {currentSlide === 0 && (
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-white">FG</span>
                  </div>
                </div>
              )}

              {/* Slide content */}
              <div className="text-6xl mb-6">
                {ONBOARDING_SLIDES[currentSlide].image}
              </div>

              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                {ONBOARDING_SLIDES[currentSlide].title}
              </h1>

              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {ONBOARDING_SLIDES[currentSlide].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`p-3 rounded-full transition-all duration-200 ${
                currentSlide === 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={skipOnboarding}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 text-sm font-medium"
            >
              Skip
            </button>

            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 hover:scale-105 transform"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Call to action for last slide */}
          {currentSlide === ONBOARDING_SLIDES.length - 1 && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={onComplete}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Get Started with FinGuru
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
