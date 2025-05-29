# Interactive Product Tour Platform

A comprehensive platform for creating, managing, and sharing interactive product tours. Built with Next.js 14, TypeScript, and Tailwind CSS, this application enables users to create engaging product walkthroughs with screen recording, annotations, and rich interactions.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38bdf8)

## 📚 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Technical Architecture](#-technical-architecture)
- [Component Documentation](#-component-documentation)
- [State Management](#-state-management)
- [Getting Started](#-getting-started)
- [Development Guide](#-development-guide)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)

## 🌟 Features

### Core Features
- **Tour Creation & Management**
  - Interactive tour builder with drag-and-drop interface
  - Screen recording with MediaRecorder API
  - Rich text annotations using React Quill
  - Step reordering and organization
  - Tour visibility controls (public/private)

### User Interface
- **Modern Design System**
  - Responsive layouts using Tailwind CSS
  - Dark/Light theme with next-themes
  - Smooth animations via Framer Motion
  - Accessible components with ARIA support
  - Custom UI components built on shadcn/ui

### Analytics & Tracking
- **Performance Metrics**
  - Tour completion rates
  - Step-by-step analytics
  - User engagement tracking
  - Interactive charts with Recharts

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── (auth)/            # Authentication Routes
│   │   │   ├── login/        # Login Page & Components
│   │   │   ├── signup/       # Signup Page & Components
│   │   │   └── layout.tsx    # Auth Layout
│   │   │
│   │   ├── dashboard/         # Dashboard Routes
│   │   │   ├── page.tsx      # Dashboard Home
│   │   │   ├── tours/        # Tour Management
│   │   │   │   ├── page.tsx  # Tours List
│   │   │   │   └── [id]/     # Individual Tour
│   │   │   └── analytics/    # Analytics Dashboard
│   │   │
│   │   ├── tour/             # Public Tour Routes
│   │   │   └── [id]/         # Tour Viewer
│   │   │
│   │   ├── api/              # API Routes
│   │   │   ├── auth/        # Auth Endpoints
│   │   │   └── tours/       # Tour Endpoints
│   │   │
│   │   └── layout.tsx        # Root Layout
│   │
│   ├── components/            # React Components
│   │   ├── ui/               # UI Components
│   │   │   ├── button.tsx   # Button Component
│   │   │   ├── card.tsx     # Card Component
│   │   │   └── ...         # Other UI Components
│   │   │
│   │   ├── tour/            # Tour-specific Components
│   │   │   ├── TourStepsList.tsx    # Tour Steps Manager
│   │   │   ├── SortableItem.tsx     # Draggable Step Item
│   │   │   └── VideoPlayer.tsx      # Video Player
│   │   │
│   │   ├── providers/       # Context Providers
│   │   │   └── theme-provider.tsx   # Theme Provider
│   │   │
│   │   └── theme-toggle.tsx  # Theme Toggle Component
│   │
│   ├── lib/                  # Utilities & Helpers
│   │   ├── store/           # State Management
│   │   │   ├── tours.ts    # Tours Store
│   │   │   └── ...        # Other Stores
│   │   │
│   │   ├── utils.ts         # Utility Functions
│   │   └── hooks/           # Custom React Hooks
│   │
│   └── types/               # TypeScript Types
│       ├── tour.ts         # Tour Types
│       └── ...            # Other Type Definitions
│
├── public/                  # Static Assets
├── styles/                 # Global Styles
│   └── globals.css        # Global CSS
│
└── config/                # Configuration Files
    ├── next.config.js    # Next.js Config
    └── tailwind.config.js # Tailwind Config
```

## 🏗 Technical Architecture

### Component Architecture

#### UI Components (`/components/ui/`)
- Built on shadcn/ui primitives
- Fully typed with TypeScript
- Customizable with Tailwind CSS
- Accessible by default

#### Tour Components (`/components/tour/`)
- **TourStepsList.tsx**
  - Manages tour step organization
  - Implements drag-and-drop with @dnd-kit
  - Handles step reordering and updates

- **VideoPlayer.tsx**
  - Custom video player implementation
  - Supports screen recordings
  - Playback controls and progress tracking

- **SortableItem.tsx**
  - Draggable tour step component
  - Integrates with DND Kit
  - Handles drag events and animations

### State Management

#### Zustand Stores (`/lib/store/`)
- **tours.ts**
  - Manages tour data
  - Handles CRUD operations
  - Implements persistence with zustand/middleware

### Routing Structure

#### Authentication Routes (`/app/(auth)/`)
- Protected routes with middleware
- Session management
- OAuth integration (if implemented)

#### Dashboard Routes (`/app/dashboard/`)
- Tour management interface
- Analytics and statistics
- User settings

#### Public Routes (`/app/tour/`)
- Public tour viewing
- Share functionality
- Embedded tour support

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or later
- npm or yarn
- Git

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/Shivam-knight-owl/product-tour-platform
cd product-tour-platform/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start development server:
```bash
npm run dev
```

## 💻 Development Guide

### Key Technologies

- **Next.js 14**
  - App Router for routing
  - API routes for backend functionality
  - Server Components for optimization

- **State Management**
  - Zustand for global state
  - React Query for server state
  - Local storage persistence

- **UI/UX**
  - Tailwind CSS for styling
  - Framer Motion for animations
  - Shadcn UI for components

### Best Practices

1. **Component Structure**
   - Use TypeScript for type safety
   - Implement proper error boundaries
   - Follow React best practices

2. **State Management**
   - Keep stores atomic and focused
   - Use proper typing for state
   - Implement proper persistence

3. **Performance**
   - Optimize images and assets
   - Implement proper loading states
   - Use proper caching strategies

## 📦 Available Scripts

```bash
# Development
npm run dev         # Start development server
npm run build      # Build for production
npm start         # Start production server

# Quality Assurance
npm run lint      # Run ESLint
npm run format    # Format with Prettier
npm run type-check # Run TypeScript checks

# Testing
npm run test      # Run tests
npm run test:watch # Run tests in watch mode
```

## 🔧 Configuration

### Environment Variables
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_UPLOAD_URL=/api/upload
```

### Build Configuration
```next.config.js``` includes:
- Image optimization settings
- API rewrites
- Build optimizations

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📫 Contact

Name - SHIVAM

Project Link: [https://github.com/Shivam-knight-owl/product-tour-platform](https://github.com/Shivam-knight-owl/product-tour-platform)

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)
- [DND Kit](https://dndkit.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [Framer Motion](https://www.framer.com/motion/)

---

Built with ❤️ using Next.js and TypeScript 
