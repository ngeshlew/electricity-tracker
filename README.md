# ⚡ Electricity Tracker Dashboard

A comprehensive, AI-powered electricity consumption tracking and analytics dashboard built with React, TypeScript, and modern web technologies. This application provides users with professional-grade tools for monitoring electricity usage, cost analysis, and intelligent insights powered by artificial intelligence.

## 🌟 Key Features

### 🔐 Complete Authentication System
- **User Registration & Login**: Secure authentication with email/password
- **Enhanced UI**: Following [shadcn/ui authentication patterns](https://ui.shadcn.com/blocks/authentication)
- **Two-Column Login**: Professional design with cover image
- **User Profiles**: Manage personal information and preferences
- **Protected Routes**: Secure access to all features
- **Demo Credentials**: `demo@electricitytracker.com` / `demo123`

### 🤖 AI-Powered Intelligence
- **AI Energy Assistant**: Interactive chatbot for energy queries
- **Smart Insights**: Personalized recommendations based on usage patterns
- **Pattern Analysis**: AI detects unusual consumption patterns
- **Cost Optimization**: AI suggests ways to reduce electricity bills
- **Predictive Analytics**: Forecast future consumption trends
- **Natural Language Queries**: Ask questions about your energy usage

### 📊 Advanced Analytics & Visualization
- **Real-time Dashboard**: Live consumption monitoring and cost tracking
- **Interactive Charts**: Area charts, bar charts, and pie charts with Recharts
- **Seasonal Analysis**: Compare Winter vs Autumn vs Summer vs Spring usage
- **UK Electricity API Integration**: Real-time pricing data and tariff management
- **Annual Comparisons**: Track against 1180.1 kWh target and £458.69 cost target
- **Tariff Management**: Multiple energy providers and transition tracking
- **Account & Meter Tracking**: Manage account numbers and meter identifiers

### 📱 Mobile & PWA Features
- **Progressive Web App**: Installable with offline capabilities
- **Mobile Navigation**: Touch-optimized bottom navigation
- **Swipe Gestures**: Navigate charts with swipe gestures
- **Responsive Design**: Perfect on desktop, tablet, and mobile
- **Touch Optimization**: Mobile-specific meter reading forms
- **Offline Support**: Basic offline functionality for meter readings

### 🔔 Smart Notification System
- **Intelligent Alerts**: Consumption and cost threshold notifications
- **Customizable Settings**: Granular notification preferences
- **Push Notifications**: Browser push notification support
- **Reminder System**: Configurable frequency reminders
- **Quiet Hours**: Customizable do-not-disturb periods
- **Email Integration**: Optional email notifications

### 📈 Comprehensive Data Management
- **Meter Reading Management**: Add, edit, delete, and track readings
- **Estimated Readings**: AI-powered estimated readings for missing data
- **PDF Statement Analysis**: Upload and analyze energy company statements
- **Data Export**: Export analytics data in JSON and CSV formats
- **Bulk Operations**: Manage multiple readings efficiently
- **Data Validation**: Comprehensive input validation and error handling

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18+** with TypeScript for type safety
- **Vite** for fast development and building
- **Zustand** for state management with persistence
- **React Hook Form** with Zod validation
- **Recharts** for data visualization
- **Framer Motion** for smooth animations
- **Tailwind CSS** with OKLCH color system
- **Shadcn/ui** for modern component library
- **AI SDK** for AI-powered features
- **Heroicons** for consistent iconography

### Backend Stack
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Prisma ORM** with PostgreSQL database
- **Socket.io** for real-time updates
- **Helmet** for security headers
- **CORS** for cross-origin requests
- **Railway** for deployment

### Design System
- **Lewis-Linear Design System**: Custom design system with purple/pink gradients
- **OKLCH Color Space**: Modern CSS color format for better color consistency
- **Shadcn/ui Components**: Professional UI components
- **OCR A Std**: Monospace typography for technical aesthetic
- **Dark Theme**: Primary theme with light mode support

## 📁 Project Structure

```
electricity-tracker/
├── src/
│   ├── components/
│   │   ├── dashboard/           # Main dashboard components
│   │   ├── auth/               # Authentication components
│   │   │   ├── AuthModal.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   ├── UserProfile.tsx
│   │   │   └── UserMenu.tsx
│   │   ├── ai/                 # AI-powered components
│   │   │   ├── AIChatbot.tsx
│   │   │   ├── AIInsights.tsx
│   │   │   └── AIPromptInput.tsx
│   │   ├── analytics/          # Advanced analytics
│   │   │   ├── AnalyticsPage.tsx
│   │   │   ├── SeasonalAnalytics.tsx
│   │   │   └── TariffAnalytics.tsx
│   │   ├── notifications/      # Notification system
│   │   │   ├── NotificationCenter.tsx
│   │   │   ├── NotificationSettings.tsx
│   │   │   └── NotificationBell.tsx
│   │   ├── mobile/            # Mobile-specific components
│   │   │   ├── MobileDashboard.tsx
│   │   │   ├── MobileNavigation.tsx
│   │   │   └── MobileMeterReadingForm.tsx
│   │   ├── meter-reading/     # Meter reading management
│   │   ├── statements/        # Statement management
│   │   ├── settings/          # Settings and preferences
│   │   └── ui/               # UI component library
│   ├── store/
│   │   ├── useElectricityStore.ts
│   │   ├── useAuthStore.ts
│   │   ├── useNotificationStore.ts
│   │   └── useTariffStore.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── socketService.ts
│   │   └── ukElectricityApi.ts
│   ├── api/
│   │   └── ai/
│   │       └── chat.ts
│   ├── hooks/
│   │   └── useSwipeGestures.ts
│   └── types/
│       └── index.ts
├── server/                    # Backend API
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   └── prisma/
│       └── schema.prisma
└── public/
    ├── manifest.json          # PWA manifest
    └── sw.js                  # Service worker
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- PostgreSQL database (for production)

### Installation
```bash
# Clone the repository
git clone https://github.com/ngeshlew/electricity-tracker.git
cd electricity-tracker

# Install dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and other settings

# Set up database
cd server && npx prisma generate && npx prisma db push && cd ..

# Start development servers
npm run dev
```

### Environment Variables
Create `.env` file in the root directory:
```env
VITE_SERVER_URL=http://localhost:3001
CLIENT_URL=http://localhost:5173
```

Create `.env` file in server directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/electricity_tracker"
NODE_ENV=development
PORT=3001
```

## 🎯 User Flows

### Authentication Flow
1. **Landing Page** → Click "Sign In" → Login form
2. **Registration** → Click "Sign Up" → Fill registration form
3. **Profile Management** → Settings → User Profile tab
4. **Password Reset** → Forgot Password → Email reset link

### Dashboard Flow
1. **Dashboard Access** → View current consumption and costs
2. **Add Reading** → Click "Add Reading" → Fill form → Submit
3. **AI Insights** → Click "Insights" → View AI recommendations
4. **Analytics** → Click "Analytics" → Select time period and view charts
5. **Notifications** → Click bell icon → Manage notification preferences

### Mobile Flow
1. **Mobile Dashboard** → Swipe through charts
2. **Add Reading** → Tap "Add Reading" → Mobile-optimized form
3. **Navigation** → Bottom navigation tabs
4. **AI Chat** → Tap floating chat button → Ask questions

## 🤖 AI Features

### AI Energy Assistant
- **Natural Language Queries**: Ask questions about your energy usage
- **Contextual Responses**: AI analyzes your actual meter data
- **Quick Questions**: Pre-defined prompts for common queries
- **Real-time Analysis**: Instant insights based on current data

### Smart Insights
- **Pattern Recognition**: Identifies consumption patterns and anomalies
- **Cost Optimization**: Suggests ways to reduce electricity bills
- **Efficiency Recommendations**: Personalized energy-saving tips
- **Predictive Analytics**: Forecast future consumption trends

### AI Prompt System
- **Categorized Suggestions**: Analytics, cost, tips, patterns, comparison
- **Interactive Interface**: Easy-to-use prompt system
- **Contextual Help**: AI provides specific guidance based on data
- **Smart Categories**: Organized by functionality and use case

## 📱 Mobile & PWA Features

### Progressive Web App
- **Installable**: Add to home screen on mobile devices
- **Offline Support**: Basic functionality without internet
- **Service Worker**: Caches resources for offline use
- **App-like Experience**: Full-screen, native app feel

### Mobile Optimization
- **Touch Gestures**: Swipe to navigate charts
- **Mobile Navigation**: Bottom tab navigation
- **Responsive Design**: Perfect on all screen sizes
- **Touch-friendly Forms**: Optimized for mobile input

## 🔔 Notification System

### Smart Alerts
- **Consumption Alerts**: Notify when usage exceeds thresholds
- **Cost Alerts**: Alert when daily costs are too high
- **System Alerts**: App updates and maintenance notifications
- **Reminder Alerts**: Regular meter reading reminders

### Customization
- **Granular Settings**: Control each type of notification
- **Quiet Hours**: Set do-not-disturb periods
- **Frequency Control**: Daily, weekly, or monthly reminders
- **Channel Selection**: Email, push, or in-app notifications

## 🎨 Design System

### Lewis-Linear Design System
- **Purple/Pink Gradients**: Modern, energy-themed color palette
- **OKLCH Color Space**: Better color consistency and accessibility
- **Monospace Typography**: OCR A Std for technical aesthetic
- **Smooth Animations**: Framer Motion for delightful interactions

### Shadcn/ui Integration
- **Modern Components**: Professional UI components
- **Accessibility**: WCAG 2.1 AA compliant
- **Consistent Design**: Unified design language
- **Customizable**: Easy to theme and modify

## 🚀 Deployment

### Frontend (Netlify)
- **Automatic Deployments**: Git-based deployment
- **Environment Variables**: Configured in Netlify dashboard
- **Custom Domain**: Optional custom domain setup
- **HTTPS**: Automatic SSL certificate

### Backend (Railway)
- **PostgreSQL Database**: Managed database service
- **Environment Variables**: Secure configuration
- **Automatic Scaling**: Handles traffic spikes
- **Health Monitoring**: Built-in monitoring and logging

## 🛣️ Roadmap

### ✅ Completed Features
- [x] **Complete Authentication System** with enhanced UI
- [x] **AI-Powered Insights** and recommendations
- [x] **Interactive AI Chatbot** for user queries
- [x] **Advanced Analytics** with seasonal comparisons
- [x] **Mobile Optimization** and PWA features
- [x] **Notification System** with smart alerts
- [x] **Professional UI/UX** following shadcn/ui patterns
- [x] **UK Electricity API Integration** for real-time pricing
- [x] **Tariff Management** for multiple energy providers

### 🔄 In Progress
- [ ] **Data Import/Export**: CSV/Excel functionality for bulk data management
- [ ] **Bulk Upload**: API integrations for meter reading uploads

### 📋 Future Features
- [ ] **Smart Meter Integration**: Direct meter data collection
- [ ] **Energy Company APIs**: Real-time tariff updates
- [ ] **Mobile App**: Native iOS/Android applications
- [ ] **Multi-tenant Support**: Property management features
- [ ] **Advanced Reporting**: Executive-level reporting
- [ ] **API Access**: Third-party integrations

## 🤝 Contributing

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Write comprehensive tests
- Document all new components
- Follow the Lewis-Linear design system
- Use shadcn/ui components where appropriate

### Code Style
- ESLint and Prettier configuration
- Consistent naming conventions
- Comprehensive JSDoc comments
- Component documentation
- AI-powered code suggestions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Shadcn/ui](https://ui.shadcn.com/)** for the component library foundation
- **[AI SDK](https://ai-sdk.dev/)** for AI-powered features
- **[Recharts](https://recharts.org/)** for beautiful data visualization
- **[Heroicons](https://heroicons.com/)** for consistent iconography
- **[Tailwind CSS](https://tailwindcss.com/)** for utility-first styling
- **[Lewis-Linear Design System](https://lewis-linear.com/)** for the custom design language

---

**Built with ❤️ for energy efficiency, sustainability, and AI-powered insights**

*Track your electricity usage, optimize your consumption, and save money with intelligent analytics and personalized recommendations.*