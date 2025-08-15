import { useState, useRef, useEffect } from "react";

// Simple speech recognition interface
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any)
    | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any)
    | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export interface UseSpeechResult {
  // Speech Recognition
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;

  // Text-to-Speech
  isSpeaking: boolean;
  speak: (text: string) => void;
  stopSpeaking: () => void;

  // Common
  speechSupported: boolean;
  error: string | null;
  clearError: () => void;
}

// Clean text for better speech synthesis
function cleanTextForSpeech(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`/g, "")
    .replace(/#{1,6}\s/g, "")
    .replace(/\s+/g, " ")
    .replace(/[•·]/g, "")
    .replace(/(\d+)\.(\d+)/g, "$1 point $2")
    .replace(/₹/g, "rupees ")
    .replace(/%/g, " percent")
    .trim();
}

// Simple language mapping - only English for speech recognition
function getRecognitionLanguage(): string {
  return "en-US"; // Always use English for maximum compatibility
}

// TTS supports multiple languages
function getSpeechLanguage(languageCode: string): string {
  const languageMap: { [key: string]: string } = {
    en: "en-US",
    hi: "hi-IN",
    bn: "bn-BD",
    te: "te-IN",
    mr: "mr-IN",
    ta: "ta-IN",
    gu: "gu-IN",
    kn: "kn-IN",
    ml: "ml-IN",
    pa: "pa-IN",
  };
  return languageMap[languageCode] || "en-US";
}

export function useSpeech(language: string = "en"): UseSpeechResult {
  // States
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check speech support
  useEffect(() => {
    const hasRecognition =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
    const hasSynthesis = "speechSynthesis" in window;
    setSpeechSupported(hasRecognition && hasSynthesis);

    if (hasSynthesis) {
      synthRef.current = window.speechSynthesis;
    }

    console.log("Speech support:", { hasRecognition, hasSynthesis });
  }, []);

  // Initialize speech recognition - SIMPLE VERSION
  useEffect(() => {
    if (!speechSupported) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    // SIMPLE configuration
    recognition.continuous = false;
    recognition.interimResults = false; // Simplified - no interim results
    recognition.lang = getRecognitionLanguage();

    recognition.onstart = () => {
      console.log("Speech started");
      setIsListening(true);
      setError(null);
    };

    recognition.onend = () => {
      console.log("Speech ended");
      setIsListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (event.results.length > 0) {
        const result = event.results[0];
        if (result.isFinal) {
          const text = result[0].transcript;
          console.log("Speech result:", text);
          setTranscript(text);
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech error:", event.error);
      setIsListening(false);

      // SIMPLE error handling
      switch (event.error) {
        case "not-allowed":
          setError(
            "Microphone permission denied. Please allow microphone access."
          );
          break;
        case "no-speech":
          setError("No speech detected. Please try again.");
          break;
        case "network":
          setError(
            "Speech recognition is not available. Please type your message instead."
          );
          break;
        default:
          setError(
            "Speech recognition failed. Please try typing your message."
          );
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [speechSupported]);

  // SIMPLE start listening
  const startListening = () => {
    if (!speechSupported) {
      setError("Speech recognition not supported. Please type your message.");
      return;
    }

    if (!recognitionRef.current) {
      setError("Speech recognition not initialized. Please refresh the page.");
      return;
    }

    if (isListening) {
      return; // Already listening
    }

    try {
      setTranscript("");
      setError(null);
      recognitionRef.current.start();
    } catch (err) {
      console.error("Start listening error:", err);
      setError("Failed to start listening. Please try again.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const resetTranscript = () => {
    setTranscript("");
  };

  // Text-to-Speech (this works well)
  const speak = (text: string) => {
    if (!synthRef.current || !speechSupported) {
      setError("Text-to-speech not supported");
      return;
    }

    stopSpeaking();
    const cleanText = cleanTextForSpeech(text);

    if (!cleanText.trim()) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

    utterance.lang = getSpeechLanguage(language);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setError("Speech synthesis failed");
    };

    // Find appropriate voice
    const voices = synthRef.current.getVoices();
    const langCode = getSpeechLanguage(language);
    const voice =
      voices.find((v) => v.lang === langCode) ||
      voices.find((v) => v.lang.startsWith(langCode.split("-")[0]));

    if (voice) utterance.voice = voice;

    try {
      synthRef.current.speak(utterance);
    } catch (error) {
      setError("Failed to speak");
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSpeaking,
    speak,
    stopSpeaking,
    speechSupported,
    error,
    clearError,
  };
}
