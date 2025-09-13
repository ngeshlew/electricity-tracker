# σ₂: System Patterns
*v1.0 | Created: 2024-12-19 | Updated: 2024-12-19*
*Π: DEVELOPMENT | Ω: RESEARCH*

## 🏛️ Architecture Overview

### Frontend Architecture
- **React 18+ with TypeScript**: Modern React with strict type checking
- **Vite Build System**: Fast development and optimized production builds
- **Component-Based Architecture**: Modular, reusable React components
- **State Management**: Zustand for predictable state management
- **Routing**: React Router for client-side navigation
- **PWA Capabilities**: Service worker for offline functionality

### Backend Architecture
- **Express.js with TypeScript**: RESTful API server with type safety
- **PostgreSQL Database**: Relational database with Prisma ORM
- **Real-time Communication**: Socket.io for live updates
- **File Processing**: Multer for file uploads, PDF-parse for statements
- **Authentication**: JWT-based authentication (future feature)
- **API Design**: RESTful endpoints with comprehensive validation

### Data Flow Architecture
- **Unidirectional Data Flow**: Predictable state updates
- **Real-time Synchronization**: WebSocket connections for live updates
- **Data Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error boundaries and recovery
- **Caching Strategy**: Intelligent caching for performance optimization

## 🧩 Components

### Core Components
- **App Shell**: Main application container with navigation
- **Dashboard**: Real-time consumption overview and summary cards
- **MeterReadingPanel**: Right-side slide-in panel for reading entry
- **AnalyticsCharts**: Interactive consumption and cost visualization
- **MonthlyBreakdown**: Week-by-week pie chart with drill-down
- **DataTable**: Sortable, filterable reading history table

### UI Components (Lewis-Linear Design System)
- **Button**: Primary, secondary, and ghost button variants
- **Input**: Form inputs with validation states
- **Card**: Content containers with consistent styling
- **Modal**: Overlay dialogs and confirmations
- **Toast**: Notification system for user feedback
- **Loading**: Skeleton loaders and spinners
- **Chart**: Recharts integration with custom styling

### Layout Components
- **Header**: Navigation and user controls
- **Sidebar**: Navigation menu and quick actions
- **MainContent**: Primary content area with responsive layout
- **Footer**: Application information and links
- **Grid**: Responsive grid system for content organization

## 📊 Data and Integrations

### Data Models
- **MeterReading**: Core reading data with validation
- **EnergyStatement**: Imported statement data
- **ConsumptionData**: Calculated consumption analytics
- **UserPreferences**: User settings and preferences
- **AuditLog**: Complete change tracking

### External Integrations
- **Electricity Bills UK API**: UK average consumption data
- **PDF Processing**: Statement parsing and data extraction
- **CSV Processing**: Data import and export functionality
- **LLM Services**: AI-powered insights generation
- **Chart Libraries**: Recharts for data visualization

### Data Processing
- **Decimal.js**: Precise financial calculations
- **Date Manipulation**: Moment.js for date handling
- **Data Validation**: Comprehensive input validation
- **Error Recovery**: Graceful error handling and recovery
- **Data Synchronization**: Real-time data updates

## 🔑 Key Decisions

### Primary Design System & Rationale
- **Lewis-Linear Design System**: Custom design system for technical aesthetic
- **Tailwind CSS Foundation**: Utility-first CSS framework for rapid development
- **Headless UI Components**: Accessible, unstyled components for customization
- **OCR A Std Typography**: Monospace font for technical, data-focused interface

### Borrowed Components (Source, Reason)
- **Recharts**: Industry-standard React charting library with excellent performance
- **React Hook Form**: Efficient form handling with minimal re-renders
- **Framer Motion**: Smooth animations and transitions
- **Zustand**: Lightweight state management with TypeScript support
- **Headless UI**: Accessible, unstyled components for custom styling

### Token Strategy (Source of Truth, Pipeline)
- **Design Tokens**: CSS custom properties for consistent theming
- **Color Palette**: Dark theme with purple/pink gradients
- **Typography Scale**: Monospace font with consistent sizing
- **Spacing System**: 8px grid system for consistent spacing
- **Component Tokens**: Component-specific design tokens

### Motion & Density Defaults
- **Animation Duration**: 200ms for micro-interactions, 300ms for transitions
- **Easing Functions**: Ease-in-out for natural motion
- **Density**: Comfortable spacing for touch interfaces
- **Responsive Breakpoints**: Mobile-first with desktop enhancements
- **Touch Targets**: Minimum 44px for accessibility

## ⚖️ Tradeoffs

### Performance vs. Features
- **Bundle Size**: Optimize for fast loading while maintaining functionality
- **Chart Performance**: Balance interactivity with rendering performance
- **Real-time Updates**: Efficient WebSocket usage without overwhelming clients
- **Data Processing**: Client-side calculations vs. server-side processing

### Accessibility vs. Design
- **Visual Design**: Maintain aesthetic while ensuring accessibility
- **Keyboard Navigation**: Full keyboard support without compromising UX
- **Screen Reader Support**: Proper ARIA labels without cluttering interface
- **Color Contrast**: Sufficient contrast while maintaining design integrity

### Development Speed vs. Quality
- **TypeScript Strict Mode**: Type safety vs. development speed
- **Testing Coverage**: Comprehensive testing vs. rapid iteration
- **Code Quality**: ESLint/Prettier enforcement vs. development flexibility
- **Documentation**: Complete documentation vs. feature development

### User Experience vs. Technical Constraints
- **Real-time Updates**: Live data vs. performance considerations
- **Mobile Optimization**: Touch-friendly interface vs. desktop functionality
- **Offline Support**: PWA capabilities vs. complexity
- **Data Validation**: Comprehensive validation vs. user friction

## 🔄 State Management Patterns

### Zustand Store Structure
- **MeterReadingsStore**: Reading data and CRUD operations
- **AnalyticsStore**: Chart data and calculations
- **UISStore**: UI state and user preferences
- **AuthStore**: Authentication state (future)
- **ErrorStore**: Error handling and user feedback

### Data Flow Patterns
- **Optimistic Updates**: Immediate UI updates with rollback on error
- **Real-time Sync**: WebSocket updates for live data
- **Caching Strategy**: Intelligent data caching for performance
- **Error Boundaries**: Graceful error handling and recovery
- **Loading States**: Consistent loading indicators

## 🎨 Design System Implementation

### Component Architecture
- **Atomic Design**: Atoms, molecules, organisms, templates, pages
- **Composition Pattern**: Flexible component composition
- **Props Interface**: Consistent prop naming and typing
- **Theme Integration**: Design token integration
- **Accessibility**: Built-in accessibility features

### Styling Strategy
- **CSS-in-JS**: Styled-components or emotion for component styling
- **Design Tokens**: CSS custom properties for theming
- **Responsive Design**: Mobile-first with progressive enhancement
- **Dark Theme**: Primary theme with light theme support
- **Animation**: Framer Motion for smooth transitions

## 🔧 Development Patterns

### Code Organization
- **Feature-Based Structure**: Components organized by feature
- **Barrel Exports**: Clean import/export patterns
- **Custom Hooks**: Reusable logic extraction
- **Utility Functions**: Pure functions for data processing
- **Type Definitions**: Comprehensive TypeScript types

### Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: User workflow testing
- **E2E Tests**: Complete user journey testing
- **Accessibility Tests**: WCAG compliance verification
- **Performance Tests**: Core Web Vitals monitoring

### Error Handling
- **Error Boundaries**: React error boundaries for component errors
- **API Error Handling**: Consistent error response handling
- **User Feedback**: Toast notifications for user actions
- **Logging**: Comprehensive error logging and monitoring
- **Recovery**: Graceful error recovery and user guidance

---

*This system patterns document defines the architectural decisions, component structure, and development patterns for the Electricity Tracker project.*