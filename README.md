# FinGuru - Multilingual Financial Advisory Chatbot

A modern, responsive web application that provides personalized financial advice in multiple languages using Google's Gemini AI.

## 🌟 Features

### Core Features

- **Multilingual Support**: Support for 10+ Indian languages including Hindi, Bengali, Telugu, Tamil, and more
- **AI-Powered Advice**: Intelligent financial guidance using Google Gemini AI
- **Interactive Chat Interface**: Modern chat UI with voice and text input support
- **User Profiles**: Track conversations and financial topics explored
- **Onboarding Flow**: Educational slides about financial literacy importance
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Technical Features

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for modern styling
- **Framer Motion** for smooth animations
- **Local Storage** for data persistence
- **RESTful API** with Next.js API routes
- **Real-time Chat** experience

## 🎨 Design Philosophy

- **Soft Color Palette**: Calming blues, purples, and greens for financial trust
- **Fintech-Inspired UI**: Modern cards, gradients, and micro-interactions
- **Accessibility First**: WCAG compliant design with proper contrast ratios
- **Mobile-First**: Responsive design that works on all devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Google Gemini API key

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**
   The `.env.local` file is already configured with:

   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
   NEXT_PUBLIC_APP_NAME=FinGuru
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 App Screens

### 1. Welcome Screen

- **Onboarding slides** explaining financial literacy importance
- **Progressive indicators** showing user progress
- **Skip option** for returning users
- **Smooth animations** with Framer Motion

### 2. Language Selection

- **10+ language options** with native script display
- **Visual language cards** with country flags
- **Popular languages** highlighted
- **Preference persistence** in local storage

### 3. Chat Interface

- **Split-screen layout** with sidebar for conversations
- **Real-time messaging** with typing indicators
- **Quick question suggestions** for easy onboarding
- **Voice input mockup** (UI ready for speech integration)
- **Message history** with timestamps
- **Topic categorization** automatic tagging

### 4. Profile Dashboard

- **User statistics** (conversations, messages, topics)
- **Conversation history** with search and filtering
- **Financial topics tracker** showing learning progress
- **Data export/import** functionality
- **Settings management** including language preferences

## 🛠 Technical Architecture

### Frontend Structure

```
src/
├── app/                  # Next.js App Router
│   ├── api/             # API routes
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main app component
├── components/          # React components
│   ├── WelcomeScreen.tsx
│   ├── LanguageSelection.tsx
│   ├── ChatScreen.tsx
│   ├── ChatInput.tsx
│   ├── ChatMessage.tsx
│   └── ProfileScreen.tsx
├── hooks/               # Custom React hooks
│   ├── useUserProfile.ts
│   └── useChat.ts
├── services/           # Business logic
│   ├── gemini.ts       # AI service integration
│   └── storage.ts      # Local storage management
├── types/              # TypeScript definitions
│   └── index.ts
├── config/             # Configuration files
│   └── languages.ts
└── data/               # Static data
    └── onboarding.ts
```

### Backend API Routes

- **`/api/chat`** - Handle chat messages and AI responses
- **`/api/health`** - Health check endpoint

## 🤖 AI Integration

### Gemini AI Features

- **Financial Advice Generation** with context awareness
- **Topic Categorization** for conversation organization
- **Multilingual Responses** in user's preferred language
- **Safety Filters** for appropriate financial guidance
- **Conversation Context** maintenance across messages

## 🌍 Multilingual Support

### Supported Languages

- **English** (en) - Default
- **Hindi** (hi) - हिंदी
- **Bengali** (bn) - বাংলা
- **Telugu** (te) - తెలుగు
- **Marathi** (mr) - मराठी
- **Tamil** (ta) - தமிழ்
- **Gujarati** (gu) - ગુજરાતી
- **Kannada** (kn) - ಕನ್ನಡ
- **Malayalam** (ml) - മലയാളം
- **Punjabi** (pa) - ਪੰਜਾਬੀ

## 📊 Key Features

### Financial Topics Covered

- Investment strategies and portfolio management
- Savings accounts and interest optimization
- Insurance planning and risk management
- Loan management and credit building
- Tax planning and deductions
- Retirement planning and pension schemes
- Budgeting and expense tracking
- Real estate investment guidance
- Emergency fund strategies
- Mutual funds and SIP guidance

## 🚀 Deployment

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

---

**FinGuru** - Empowering financial literacy through AI-powered guidance 🚀💰
