import { OnboardingSlide } from "@/types";

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 1,
    title: "Welcome to FinGuru",
    description:
      "Your personal financial advisor, available 24/7 to help you make informed financial decisions and build a secure financial future.",
    image: "💰",
  },
  {
    id: 2,
    title: "Why Financial Literacy Matters",
    description:
      "Understanding money management, investments, and financial planning is crucial for achieving your dreams and securing your family's future. Let's learn together!",
    image: "📈",
  },
];

export const FINANCIAL_TOPICS = [
  { id: "investment", name: "Investment", category: "wealth-building" },
  { id: "savings", name: "Savings", category: "basics" },
  { id: "insurance", name: "Insurance", category: "protection" },
  { id: "loans", name: "Loans & Credit", category: "debt" },
  { id: "tax", name: "Tax Planning", category: "planning" },
  { id: "retirement", name: "Retirement Planning", category: "planning" },
  { id: "budgeting", name: "Budgeting", category: "basics" },
  { id: "real-estate", name: "Real Estate", category: "investment" },
  { id: "emergency", name: "Emergency Fund", category: "basics" },
  { id: "mutual-funds", name: "Mutual Funds", category: "investment" },
  { id: "stocks", name: "Stock Market", category: "investment" },
  { id: "crypto", name: "Cryptocurrency", category: "investment" },
];
