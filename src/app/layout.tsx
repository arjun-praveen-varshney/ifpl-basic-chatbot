import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinGuru - Your Personal Financial Advisor",
  description:
    "Get personalized financial advice in multiple languages. FinGuru helps you make informed financial decisions with AI-powered insights.",
  keywords: [
    "financial advice",
    "personal finance",
    "AI chatbot",
    "investment",
    "savings",
    "financial planning",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
