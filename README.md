# ⚡ Electricity Tracker Dashboard

A comprehensive, real-time electricity consumption tracking and analytics dashboard built with React, TypeScript, and modern web technologies. This application provides energy companies with professional-grade tools for monitoring electricity usage, cost analysis, and data visualization.

## 🚀 Features

### Core Functionality
- **Real-time Meter Reading Management**: Add, edit, delete, and track electricity meter readings
- **Advanced Analytics**: Comprehensive consumption analysis with daily, weekly, monthly, and yearly views
- **Cost Tracking**: Automatic cost calculations based on configurable unit rates
- **Estimated Readings**: AI-powered estimated readings for missing data periods
- **PDF Statement Analysis**: Upload and analyze energy company statements
- **Data Export**: Export analytics data in JSON and CSV formats
- **Responsive Design**: Mobile-first design with touch-friendly interactions

### Advanced Features
- **First Reading Management**: Special handling for move-in readings
- **Duplicate Detection**: Prevents duplicate readings for the same date
- **Reading Type Filtering**: Separate manual, estimated, and imported readings
- **Real-time Updates**: Live data synchronization across all components
- **Progressive Web App**: Installable with offline capabilities
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation

## 🏗️ Architecture

### Frontend Stack
- **React 18+** with TypeScript for type safety
- **Vite** for fast development and building
- **Zustand** for state management
- **React Hook Form** with Zod validation
- **Recharts** for data visualization
- **Framer Motion** for animations
- **Tailwind CSS** with custom Lewis-Linear design system
- **Heroicons** for consistent iconography

### Backend Stack
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Prisma ORM** with SQLite database
- **Socket.io** for real-time updates
- **Helmet** for security headers
- **CORS** for cross-origin requests

### Design System
- **Lewis-Linear Design System**: Custom design system with purple/pink gradients
- **Shadcn UI**: Modern component library (selective usage)
- **OCR A Std**: Monospace typography for technical aesthetic
- **Dark Theme**: Primary theme with light mode support

## 📁 Project Structure

```
electricity-tracker/
├── src/
│   ├── components/
│   │   ├── dashboard/           # Main dashboard components
│   │   │   ├── Dashboard.tsx    # Main dashboard container
│   │   │   ├── Header.tsx       # Navigation header
│   │   │   ├── SummaryCards.tsx # Analytics summary cards
│   │   │   ├── ConsumptionChart.tsx # Main consumption chart
│   │   │   ├── MonthlyOverview.tsx # Monthly breakdown view
│   │   │   ├── WeeklyPieChart.tsx # Weekly consumption pie chart
│   │   │   ├── DailyBreakdown.tsx # Daily consumption breakdown
│   │   │   └── ViewToggle.tsx   # kWh/Cost view toggle
│   │   ├── meter-reading/       # Meter reading management
│   │   │   ├── MeterReadingPanel.tsx # Modal for adding readings
│   │   │   ├── MeterReadingForm.tsx # Form for meter readings
│   │   │   └── MeterReadingsLog.tsx # Readings log table
│   │   ├── analytics/           # Analytics components
│   │   │   ├── TimePeriodSelector.tsx # Time period selection
│   │   │   └── ExportOptions.tsx # Data export options
│   │   ├── statements/          # Statement management
│   │   │   └── StatementUpload.tsx # PDF upload component
│   │   ├── help/               # Help and guidance
│   │   │   └── UserGuide.tsx   # User guide component
│   │   └── ui/                 # UI component library
│   │       ├── button.tsx      # Shadcn UI Button component
│   │       ├── button-simple.tsx # Simplified Button component
│   │       ├── card.tsx        # Shadcn UI Card components
│   │       ├── card-simple.tsx # Simplified Card components
│   │       └── skeleton.tsx    # Loading skeleton component
│   ├── store/
│   │   └── useElectricityStore.ts # Zustand state management
│   ├── services/
│   │   └── api.ts             # API service layer
│   ├── utils/
│   │   └── dateFormatters.ts  # Date formatting utilities
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   └── styles/
│       └── index.css          # Global styles and design system
├── server/                    # Backend API
│   ├── src/
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Express middleware
│   │   └── utils/            # Server utilities
│   └── prisma/
│       └── schema.prisma     # Database schema
└── docs/                     # Documentation
    └── design-systems/       # Design system documentation
```

## 🎨 Component Architecture

### Shadcn UI Usage Audit

#### ✅ Components Using Shadcn UI
- **Button Component**: Used in `MeterReadingPanel`, `MeterReadingForm`, `MeterReadingsLog`
- **Card Components**: Used in `MeterReadingPanel`, `MeterReadingsLog`, `SummaryCards`
- **Skeleton Component**: Used for loading states

#### ❌ Components NOT Using Shadcn UI
- **Custom Input Fields**: All form inputs use custom Lewis-Linear styling
- **Tab Navigation**: Custom tab implementation in `Dashboard`
- **Charts**: Recharts library with custom styling
- **Modal Overlays**: Custom modal implementation
- **Loading States**: Custom loading animations
- **Icons**: Heroicons library instead of Shadcn UI icons

### Component Documentation

#### Dashboard Components

**Dashboard.tsx** - Main Application Container
- **Purpose**: Central hub for all dashboard functionality
- **Features**: Tab navigation, responsive layout, state management
- **Shadcn UI**: None (custom implementation)
- **Custom Styling**: Lewis-Linear design system

**Header.tsx** - Navigation Header
- **Purpose**: Top navigation with refresh and add reading buttons
- **Features**: Responsive design, action buttons
- **Shadcn UI**: None (custom implementation)
- **Custom Styling**: Lewis-Linear gradients and animations

**SummaryCards.tsx** - Analytics Summary
- **Purpose**: Display key metrics and consumption data
- **Features**: Dynamic data, responsive cards, trend indicators
- **Shadcn UI**: Card components (Card, CardContent, CardHeader, CardTitle)
- **Custom Styling**: Lewis-Linear gradients and animations

#### Meter Reading Components

**MeterReadingPanel.tsx** - Add Reading Modal
- **Purpose**: Modal overlay for adding new meter readings
- **Features**: Form validation, first reading checkbox, responsive design
- **Shadcn UI**: Button, Card, CardContent, CardHeader, CardTitle
- **Custom Styling**: Lewis-Linear animations and gradients

**MeterReadingForm.tsx** - Reading Input Form
- **Purpose**: Form for capturing meter reading data
- **Features**: Validation, first reading checkbox, success feedback
- **Shadcn UI**: Button component
- **Custom Styling**: Lewis-Linear input styling and animations

**MeterReadingsLog.tsx** - Readings Management Table
- **Purpose**: Display and manage all meter readings
- **Features**: Filtering, editing, deletion, first reading toggle
- **Shadcn UI**: Button, Card components
- **Custom Styling**: Lewis-Linear table styling and animations

#### Analytics Components

**ConsumptionChart.tsx** - Main Consumption Chart
- **Purpose**: Visualize consumption trends over time
- **Features**: Interactive charts, date formatting, gap filling
- **Shadcn UI**: None (Recharts library)
- **Custom Styling**: Lewis-Linear chart styling

**MonthlyOverview.tsx** - Monthly Breakdown
- **Purpose**: Weekly breakdown within current month
- **Features**: Week calculations, consumption summaries
- **Shadcn UI**: None (custom implementation)
- **Custom Styling**: Lewis-Linear card styling

## 🔧 Technical Implementation

### State Management
- **Zustand Store**: Centralized state management for all application data
- **Real-time Updates**: Socket.io integration for live data synchronization
- **Local Storage**: Persistent user preferences and settings

### Data Flow
1. **User Input** → Form validation → API call
2. **API Response** → Store update → Component re-render
3. **Real-time Updates** → Socket.io → Store update → UI update

### Performance Optimizations
- **Code Splitting**: Lazy loading for non-critical components
- **Memoization**: React.memo for expensive components
- **Bundle Optimization**: Vite for fast builds and HMR
- **Chart Performance**: Optimized Recharts rendering

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/ngeshlew/electricity-tracker.git
cd electricity-tracker

# Install dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Set up database
cd server && npx prisma generate && npx prisma db push && cd ..

# Start development servers
npm run dev
```

### Environment Setup
Create `.env` file in server directory:
```
DATABASE_URL="file:./dev.db"
```

## 📱 User Flows

### Primary User Flow
1. **Dashboard Access** → View current consumption and costs
2. **Add Reading** → Click "Add Reading" → Fill form → Submit
3. **View Analytics** → Switch to Analytics tab → Select time period
4. **Export Data** → Click export button → Choose format → Download

### Advanced User Flow
1. **First Reading** → Check "first reading" checkbox → Submit
2. **Generate Estimates** → Click "Generate Estimated Readings"
3. **Filter Readings** → Use filter tabs to view specific reading types
4. **Upload Statement** → Switch to Statements tab → Upload PDF

## 🛣️ Future Roadmap

### Phase 1: Core Enhancements (Q1 2024)
- [ ] **PDF Analysis**: AI-powered statement parsing
- [ ] **Smart Notifications**: Consumption alerts and reminders
- [ ] **Multi-meter Support**: Handle multiple electricity meters
- [ ] **Advanced Filtering**: Date range and custom filters

### Phase 2: Analytics & Insights (Q2 2024)
- [ ] **Predictive Analytics**: ML-based consumption forecasting
- [ ] **Energy Efficiency Tips**: Personalized recommendations
- [ ] **Comparative Analysis**: Year-over-year comparisons
- [ ] **Carbon Footprint**: Environmental impact tracking

### Phase 3: Integration & Scale (Q3 2024)
- [ ] **Smart Meter Integration**: Direct meter data collection
- [ ] **Energy Company APIs**: Real-time tariff updates
- [ ] **Mobile App**: Native iOS/Android applications
- [ ] **Multi-tenant Support**: Property management features

### Phase 4: Enterprise Features (Q4 2024)
- [ ] **User Management**: Multi-user access and permissions
- [ ] **Reporting Dashboard**: Executive-level reporting
- [ ] **API Access**: Third-party integrations
- [ ] **White-label Solution**: Customizable branding

## 🤝 Contributing

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Write comprehensive tests
- Document all new components
- Follow the Lewis-Linear design system

### Code Style
- ESLint and Prettier configuration
- Consistent naming conventions
- Comprehensive JSDoc comments
- Component documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shadcn UI** for the component library foundation
- **Recharts** for beautiful data visualization
- **Heroicons** for consistent iconography
- **Tailwind CSS** for utility-first styling
- **Lewis-Linear Design System** for the custom design language

---

**Built with ❤️ for energy efficiency and sustainability**