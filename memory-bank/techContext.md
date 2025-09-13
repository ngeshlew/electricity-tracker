# σ₃: Technical Context
*v1.0 | Created: 2025-09-13 | Updated: 2025-09-13*
*Π: DEVELOPMENT | Ω: RESEARCH*

## 🛠️ Technology Stack

### Frontend Technologies
- **React 18+**: Modern React with concurrent features and hooks
- **TypeScript**: Strict type checking for type safety and developer experience
- **Vite**: Fast build tool with HMR and optimized production builds
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Recharts**: React charting library for data visualization
- **Framer Motion**: Animation library for smooth transitions
- **React Hook Form**: Efficient form handling with validation
- **Zustand**: Lightweight state management library
- **React Router**: Client-side routing for SPA navigation

### Backend Technologies
- **Express.js**: Node.js web framework with TypeScript
- **PostgreSQL**: Relational database with ACID compliance
- **Prisma ORM**: Type-safe database access and migrations
- **Socket.io**: Real-time bidirectional communication
- **Multer**: File upload handling middleware
- **PDF-parse**: PDF document parsing and data extraction
- **CSV-parser**: CSV file processing and data import
- **JWT**: JSON Web Tokens for authentication (future)

### Development Tools
- **ESLint**: Code linting and quality enforcement
- **Prettier**: Code formatting and style consistency
- **TypeScript**: Static type checking and IntelliSense
- **Vite**: Development server and build optimization
- **Git**: Version control and collaboration
- **VS Code**: Primary development environment

### Testing Framework
- **Jest**: JavaScript testing framework
- **React Testing Library**: React component testing utilities
- **Playwright**: End-to-end testing framework
- **MSW**: API mocking for testing
- **Testing Library**: User-centric testing utilities

## 🌐 Environment

### Target Browsers
- **Chrome**: Latest 2 versions with full feature support
- **Firefox**: Latest 2 versions with full feature support
- **Safari**: Latest 2 versions with full feature support
- **Edge**: Latest 2 versions with full feature support
- **Mobile Browsers**: iOS Safari 12+, Chrome Mobile 80+

### Device Profiles
- **Desktop**: 1920x1080 and above with keyboard/mouse interaction
- **Tablet**: 768x1024 with touch interaction
- **Mobile**: 375x667 and above with touch interaction
- **Mid-tier Mobile**: 360x640 for performance testing and budgets

### Development Environment
- **Node.js**: Version 18+ for development and build processes
- **npm/yarn**: Package management and dependency resolution
- **Git**: Version control with feature branch workflow
- **VS Code**: IDE with TypeScript and React extensions
- **Docker**: Containerization for consistent development environment

## 📦 Dependencies / Libraries

### Core Dependencies
- **react**: ^18.2.0 - React library for UI components
- **react-dom**: ^18.2.0 - React DOM rendering
- **typescript**: ^5.0.0 - TypeScript compiler and language
- **vite**: ^4.4.0 - Build tool and development server
- **@vitejs/plugin-react**: ^4.0.0 - Vite React plugin

### UI and Styling
- **tailwindcss**: ^3.3.0 - Utility-first CSS framework
- **@tailwindcss/forms**: ^0.5.0 - Form styling plugin
- **@tailwindcss/typography**: ^0.5.0 - Typography plugin
- **framer-motion**: ^10.16.0 - Animation library
- **@headlessui/react**: ^1.7.0 - Accessible UI components

### Data Visualization
- **recharts**: ^2.8.0 - React charting library
- **d3-scale**: ^4.0.0 - Data scaling utilities
- **d3-time**: ^3.1.0 - Time formatting utilities

### State Management
- **zustand**: ^4.4.0 - State management library
- **immer**: ^10.0.0 - Immutable state updates

### Forms and Validation
- **react-hook-form**: ^7.45.0 - Form handling library
- **@hookform/resolvers**: ^3.3.0 - Form validation resolvers
- **zod**: ^3.22.0 - Schema validation library

### Data Processing
- **decimal.js**: ^10.4.0 - Precise decimal arithmetic
- **date-fns**: ^2.30.0 - Date manipulation utilities
- **lodash-es**: ^4.17.0 - Utility functions

### Backend Dependencies
- **express**: ^4.18.0 - Web framework
- **@types/express**: ^4.17.0 - Express TypeScript types
- **prisma**: ^5.0.0 - Database ORM
- **@prisma/client**: ^5.0.0 - Prisma client
- **socket.io**: ^4.7.0 - Real-time communication
- **multer**: ^1.4.0 - File upload handling
- **pdf-parse**: ^1.1.0 - PDF parsing
- **csv-parser**: ^3.0.0 - CSV parsing

### Development Dependencies
- **@types/react**: ^18.2.0 - React TypeScript types
- **@types/react-dom**: ^18.2.0 - React DOM TypeScript types
- **@types/node**: ^20.0.0 - Node.js TypeScript types
- **eslint**: ^8.45.0 - Code linting
- **@typescript-eslint/eslint-plugin**: ^6.0.0 - TypeScript ESLint plugin
- **@typescript-eslint/parser**: ^6.0.0 - TypeScript ESLint parser
- **prettier**: ^3.0.0 - Code formatting
- **jest**: ^29.6.0 - Testing framework
- **@testing-library/react**: ^13.4.0 - React testing utilities
- **@testing-library/jest-dom**: ^6.0.0 - Jest DOM matchers
- **playwright**: ^1.36.0 - End-to-end testing

## 📊 Performance & Metrics

### Core Web Vitals (Field, p75)
- **LCP (Largest Contentful Paint)**: ≤ 2.5 seconds
- **INP (Interaction to Next Paint)**: ≤ 200 milliseconds
- **CLS (Cumulative Layout Shift)**: ≤ 0.1

### Performance Guardrails
- **TTFB (Time to First Byte)**: p75 ≤ 800 milliseconds
- **TBT (Total Blocking Time)**: Lab ≤ 200 milliseconds
- **FCP (First Contentful Paint)**: ≤ 1.8 seconds
- **LCP (Largest Contentful Paint)**: ≤ 2.5 seconds

### Measurement Strategy
- **Field RUM**: Real user monitoring with 1-10% sampling
- **Attribution Enabled**: Detailed performance attribution data
- **Lab Testing**: Lighthouse CI with throttling
- **Performance Budgets**: Automated performance monitoring

### Performance Optimization
- **Code Splitting**: Dynamic imports for route-based splitting
- **Bundle Optimization**: Tree shaking and dead code elimination
- **Image Optimization**: WebP format with fallbacks
- **Caching Strategy**: Service worker for offline functionality
- **CDN Integration**: Global content delivery for static assets

## 🔧 Environment & Tooling

### Development Environment
- **Node.js**: Version 18+ with npm/yarn package manager
- **VS Code**: Primary IDE with TypeScript and React extensions
- **Git**: Version control with conventional commit messages
- **Docker**: Containerization for consistent development environment

### Build & CI Pipeline
- **Vite**: Development server with HMR and optimized builds
- **TypeScript**: Compile-time type checking and error detection
- **ESLint**: Code quality enforcement and style consistency
- **Prettier**: Automated code formatting
- **Jest**: Unit and integration testing
- **Playwright**: End-to-end testing
- **Lighthouse CI**: Performance monitoring and budgets

### Deployment Environment
- **Frontend**: Vercel or Netlify for static site hosting
- **Backend**: Railway or Heroku for API hosting
- **Database**: PostgreSQL with connection pooling
- **CDN**: Global content delivery for optimal performance
- **Monitoring**: Application performance monitoring and error tracking

## 🔒 Security & Secrets

### API Security
- **JWT Authentication**: Secure token-based authentication
- **CORS Configuration**: Proper cross-origin resource sharing
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Prevention**: Parameterized queries with Prisma

### Data Protection
- **Environment Variables**: Secure secret management
- **API Keys**: Encrypted storage and rotation
- **Database Security**: Encrypted connections and access control
- **File Upload Security**: File type validation and size limits
- **GDPR Compliance**: Data privacy and user rights

### Secret Management
- **Environment Variables**: `.env` files for local development
- **Secret Storage**: Encrypted secret storage for production
- **API Keys**: Secure API key management and rotation
- **Database Credentials**: Encrypted database connection strings
- **JWT Secrets**: Secure JWT signing secrets

## 🎨 Design System Implementation

### Lewis-Linear Design System
- **Custom Design System**: Tailored for technical, data-focused interface
- **Design Tokens**: CSS custom properties for consistent theming
- **Component Library**: Reusable React components with TypeScript
- **Typography**: OCR A Std monospace font for technical aesthetic
- **Color Palette**: Dark theme with purple/pink gradients

### Styling Architecture
- **Tailwind CSS**: Utility-first CSS framework
- **CSS-in-JS**: Styled-components for component styling
- **Design Tokens**: Centralized design token management
- **Responsive Design**: Mobile-first with progressive enhancement
- **Theme System**: Dark/light theme support

### Component Development
- **Atomic Design**: Atoms, molecules, organisms, templates, pages
- **Composition Pattern**: Flexible component composition
- **Props Interface**: Consistent prop naming and typing
- **Accessibility**: Built-in accessibility features
- **Documentation**: Storybook for component documentation

## 📱 PWA Capabilities

### Service Worker
- **Offline Support**: Basic offline functionality for viewing data
- **Caching Strategy**: Intelligent caching for performance
- **Update Flow**: Seamless app updates and version management
- **Background Sync**: Data synchronization when connection restored

### Web App Manifest
- **App Icons**: Multiple icon sizes for different devices
- **Display Mode**: Standalone app experience
- **Start URL**: Proper app launch configuration
- **Theme Colors**: Consistent branding and theming
- **Shortcuts**: Quick actions and app shortcuts

### PWA Features
- **Installability**: Add to home screen functionality
- **Offline Support**: Basic offline data viewing
- **Push Notifications**: Future feature for alerts and updates
- **Background Sync**: Data synchronization capabilities
- **App Shortcuts**: Quick access to common features

---

*This technical context document defines the complete technology stack, development environment, and implementation details for the Electricity Tracker project.*