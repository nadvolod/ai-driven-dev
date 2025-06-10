# Task Management App

A modern, full-featured task management application built with **Next.js 15**, **TypeScript**, **React 19**, and **Tailwind CSS**. This project demonstrates best practices for building scalable web applications with the latest technologies.

## 🚀 Features

- ✅ **Modern Stack**: Next.js 15 with App Router, TypeScript, React 19
- ✅ **Beautiful UI**: Tailwind CSS with custom design system and dark mode support
- ✅ **Task Management**: Create, edit, delete, and organize tasks with priorities and categories
- ✅ **Filtering & Search**: Advanced filtering by status, priority, and category
- ✅ **Responsive Design**: Mobile-first approach with excellent UX across all devices
- ✅ **Type Safety**: Comprehensive TypeScript setup with strict mode
- ✅ **Code Quality**: ESLint, Prettier, and automated formatting
- ✅ **Performance**: Optimized with Next.js 15 features and React 19 optimizations
- ✅ **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## 🛠️ Tech Stack

### Core Technologies
- **[Next.js 15.3.3](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library with latest features
- **[TypeScript 5.6](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Utility-first CSS framework

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting with Next.js 15 rules
- **[Prettier](https://prettier.io/)** - Code formatting with Tailwind plugin
- **[PostCSS](https://postcss.org/)** - CSS processing
- **[Autoprefixer](https://autoprefixer.github.io/)** - CSS vendor prefixing

## 📋 Prerequisites

- **Node.js** 18.17.0 or higher
- **npm** 8.19.0 or higher (or yarn/pnpm)

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd task-management-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

### 4. Open your browser
Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
task-management-app/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles with Tailwind CSS
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Homepage/Dashboard
├── components/            # Reusable UI components
│   ├── TaskCard.tsx       # Individual task display
│   ├── TaskList.tsx       # Task list with filtering
│   ├── AddTaskForm.tsx    # Task creation form
│   ├── TaskFilter.tsx     # Filter controls
│   └── README.md          # Component documentation
├── lib/                   # Utility functions
│   └── utils.ts           # Common utilities
├── types/                 # TypeScript type definitions
│   └── task.ts            # Task-related types
├── public/                # Static assets
├── .eslintrc.json         # ESLint configuration
├── .prettierrc.json       # Prettier configuration
├── next.config.ts         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies
```

## 🧩 Component Architecture

The application follows a component-based architecture with clear separation of concerns:

### Core Components

1. **TaskCard** - Displays individual tasks with actions
2. **TaskList** - Renders collections of tasks with filtering
3. **AddTaskForm** - Form component for creating new tasks
4. **TaskFilter** - Filter controls for status, priority, and category

Each component is:
- **TypeScript-first** with comprehensive interfaces
- **Fully responsive** with Tailwind CSS
- **Accessible** with proper ARIA labels
- **Testable** with clear prop interfaces

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # TypeScript type checking

# Utilities
npm run clean        # Clean build artifacts
```

## 🎨 Design System

The application uses a comprehensive design system built with Tailwind CSS:

### Color Palette
- **Primary**: Blue shades for main actions
- **Secondary**: Gray shades for secondary elements
- **Success**: Green for completed tasks
- **Warning**: Yellow for medium priority
- **Error**: Red for high priority and errors

### Typography
- **Font Family**: Inter (variable font)
- **Font Sizes**: Responsive scale from xs to 6xl
- **Font Weights**: 400, 500, 600, 700

### Spacing & Layout
- **Container**: Max-width with responsive padding
- **Grid**: CSS Grid and Flexbox for layouts
- **Spacing**: Consistent 4px base unit

## 🔧 Configuration

### TypeScript Configuration
- **Strict mode** enabled for maximum type safety
- **Path mapping** for clean imports (`@/components/*`)
- **Next.js 15** optimizations

### ESLint Configuration
- **Next.js 15** rules
- **TypeScript** integration
- **Prettier** integration
- **Import sorting** and organization

### Tailwind CSS Configuration
- **Custom color palette**
- **Design system tokens**
- **Custom animations**
- **Responsive breakpoints**

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow the existing TypeScript and React patterns
- Use Prettier for formatting
- Follow the component architecture guidelines
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Next.js](https://nextjs.org/)** - The React framework
- **[Tailwind CSS](https://tailwindcss.com/)** - The utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[React](https://react.dev/)** - The UI library

---

Built with ❤️ using Next.js 15, TypeScript, and Tailwind CSS 