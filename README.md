# TaskFlow - AI-Powered SaaS Task Management

A full-stack SaaS task management application with AI integration, Kanban board, Stripe payments, and analytics.

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth v5 (Credentials + OAuth)
- **Payments:** Stripe subscriptions with webhooks
- **UI:** Tailwind CSS + Shadcn/UI + Radix UI
- **Charts:** Chart.js
- **Drag & Drop:** dnd-kit
- **AI:** Google Gemini / Groq

## ✨ Features

- 📊 Dashboard with analytics charts
- 📋 Task management with list/grid views
- 🎯 Kanban board with drag & drop
- 🤖 AI task generator
- 💳 Stripe subscription billing
- 👤 User profile & settings
- 🌙 Dark mode support
- 📱 Responsive design

## 🛠️ Installation

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev