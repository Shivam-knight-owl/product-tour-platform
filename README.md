# Interactive Product Tour Platform

A modern, full-stack application for creating and managing interactive product tours. Built with Next.js 14, TypeScript, and Tailwind CSS.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38bdf8)

## 🌟 Features

- **Interactive Tour Creation**
  - Screen recording functionality
  - Image upload support
  - Rich text annotations
  - Drag-and-drop step reordering
  - Public/Private tour settings

- **Modern UI/UX**
  - Responsive design
  - Dark/Light theme support
  - Smooth animations
  - Intuitive navigation

- **Advanced Functionality**
  - Real-time tour statistics
  - Completion rate tracking
  - Step-by-step navigation
  - Progress tracking

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn
- A modern web browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Shivam-knight-owl/product-tour-platform
cd product-tour-platform
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Frontend Framework**
  - Next.js 14 (App Router)
  - TypeScript
  - React 18

- **Styling**
  - Tailwind CSS
  - Shadcn UI Components
  - Framer Motion

- **State Management**
  - Zustand
  - Zustand/persist for persistence

- **Key Libraries**
  - @dnd-kit/core - Drag and drop functionality
  - react-quill - Rich text editing
  - next-themes - Theme management
  - MediaRecorder API - Screen recording

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── dashboard/         # Dashboard views
│   │   │   ├── tours/        # Tour management
│   │   │   └── analytics/    # Analytics views
│   │   └── tour/             # Public tour views
│   ├── components/            # React components
│   │   ├── ui/               # UI components
│   │   └── tour/             # Tour components
│   └── lib/                  # Utilities & stores
```

## 🎯 Core Functionality

### Tour Creation
1. Navigate to Dashboard
2. Click "Create New Tour"
3. Set tour name and visibility
4. Add steps through:
   - Screen recording
   - Image upload
5. Add annotations for each step
6. Reorder steps as needed
7. Save tour

### Tour Viewing
1. Access tour via unique URL
2. Navigate through steps
3. View annotations
4. Track progress
5. Mark completion

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Build Configuration
The `next.config.js` includes:
- Image domain configuration
- Build optimizations

## 📦 Available Scripts

```bash
# Development
npm run dev       # Start development server

# Production
npm run build    # Create production build
npm start        # Start production server

# Utilities
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)
- [DND Kit](https://dndkit.com)

## 📫 Contact

Your Name - [SHIVAM]

Project Link: [https://github.com/Shivam-knight-owl/product-tour-platform](https://github.com/Shivam-knight-owl/product-tour-platform)

---

Built with ❤️ using Next.js and TypeScript 
