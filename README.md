# TaskFlow - SaaS Task Management Application

A modern, professional, and responsive frontend UI for a SaaS Task Management Web App built with Next.js 15, TypeScript, Tailwind CSS, and Shadcn/UI.

## Features

- **Dashboard**: Overview of tasks with animated stat cards and recent tasks table
- **My Tasks**: Full task management with filtering, search, and grid/list views
- **Categories**: Organize tasks by categories with progress tracking
- **Settings**: User preferences for profile, notifications, security, and appearance
- **Upgrade Page**: Pricing comparison between Free and Premium plans

## Technical Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS + Shadcn/UI
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Components**: Radix UI primitives

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── categories/
│   │   ├── dashboard/
│   │   ├── settings/
│   │   ├── tasks/
│   │   ├── upgrade/
│   │   └── layout.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── forms/
│   │   └── AddTaskModal.tsx
│   ├── shared/
│   │   ├── DashboardLayout.tsx
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   └── ui/
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── select.tsx
└── lib/
    ├── mock-data.ts
    └── utils.ts
```

## Pages

### Dashboard
- Stat cards with animated count-up effect
- Recent tasks table with hover animations
- Free plan usage indicator

### My Tasks
- Search and filter by status/category
- Grid and list view toggle
- Load more pagination
- Add task modal

### Categories
- Category cards with task statistics
- Progress bars for completion tracking
- Edit and delete actions

### Settings
- Profile management
- Notification preferences
- Security settings
- Appearance customization

### Upgrade
- Free vs Premium pricing comparison
- Feature comparison lists
- FAQ section

## Design System

### Color Palette
- Primary: Indigo-600 (#4F46E5)
- Background: White/Slate-50
- Accent: Purple-600
- Neutral: Slate/Zinc tones

### Typography
- Primary Font: Inter (sans-serif)
- Headings: Bold, tracking-tight
- Body: Regular weight, relaxed leading

### Animations
- Fade-in on page load
- Staggered children animations
- Hover scale effects
- Smooth transitions

## Responsive Design

- Mobile-first approach
- Collapsible sidebar with hamburger menu
- Stacking cards and grids on smaller screens
- Touch-friendly interactions

## Mock Data

The application uses mock data for demonstration purposes:
- 12 sample tasks across 6 categories
- User profile information
- Category statistics

## License

MIT