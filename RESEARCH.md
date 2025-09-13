# 🔌 Electricity Tracker - Research & Analysis

## Project Overview

The Electricity Tracker is a comprehensive React-based dashboard for tracking electricity consumption, meter readings, and energy costs with real-time analytics and interactive visualizations. The project is inspired by [Electricity Bills UK](https://www.electricitybills.uk/) and integrates with the Lewis-Linear Design System.

## Key Requirements Analysis

### Core Functionality
- **Meter Reading Capture**: Right-side slide-in panel for recording meter readings with date/time stamps
- **Real-time Updates**: Live data updates and chart refreshes when new readings are submitted
- **Consumption Analytics**: Interactive charts showing usage patterns across different time periods
- **Cost Tracking**: Monitor electricity costs and identify trends
- **Data Persistence**: Save all previous readings with full history tracking
- **Comparative Analysis**: Compare household usage against UK average data

### Technical Stack Requirements

#### Frontend
- **Framework**: React with TypeScript
- **Design System**: Lewis-Linear Design System integration
- **Styling**: Tailwind CSS with custom design tokens
- **Typography**: OCR A Std monospace font (technical aesthetic)
- **Charts**: Recharts library for data visualization
- **Precision Math**: Decimal.js for accurate financial calculations
- **State Management**: React Context or Zustand
- **Form Handling**: React Hook Form with validation
- **Build Tool**: Vite (recommended over Create React App)
- **Animations**: Framer Motion for smooth panel transitions

#### Backend
- **API**: RESTful API with Express.js or FastAPI
- **Database**: PostgreSQL for structured data storage
- **Real-time Updates**: WebSocket or Server-Sent Events
- **Data Validation**: Comprehensive input validation
- **External Data Integration**: API integration with Electricity Bills UK
- **Authentication**: JWT-based authentication (future enhancement)

### Data Models

#### Meter Reading
```typescript
interface MeterReading {
  id: string;
  meterId: string;
  reading: number;
  date: Date;
  type: 'manual' | 'imported';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Energy Statement
```typescript
interface EnergyStatement {
  id: string;
  supplier: string;
  periodStart: Date;
  periodEnd: Date;
  totalKwh: number;
  totalCost: number;
  unitRate: number;
  standingCharge: number;
  fileUrl?: string;
  importedAt: Date;
}
```

#### Consumption Analytics
```typescript
interface ConsumptionData {
  period: 'daily' | 'weekly' | 'monthly';
  date: Date;
  kwh: number;
  cost: number;
  averageDailyUsage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface WeeklyBreakdown {
  weekNumber: 1 | 2 | 3 | 4;
  startDate: Date;
  endDate: Date;
  totalKwh: number;
  totalCost: number;
  dailyBreakdown: DailyConsumption[];
}

interface LLMInsights {
  summary: string;
  trends: string[];
  recommendations: string[];
  anomalies?: string[];
  generatedAt: Date;
}
```

## UI/UX Design Requirements

### Design System Integration
- Follow Lewis-Linear design system patterns
- Use consistent color palette and typography
- Implement responsive design principles
- Ensure accessibility compliance (WCAG 2.1 AA)

### Key Components

#### 1. Dashboard Overview
- Consumption Summary: Current month usage vs. previous month
- Cost Breakdown: Visual representation of electricity bill components
- Usage Trends: Interactive charts showing consumption patterns
- Quick Actions: Add meter reading, import statement buttons

#### 2. Meter Reading Interface (Right-Side Panel)
- CTA Button: Prominent button on main dashboard
- Slide-in Panel: Right-side panel that slides in from the right edge
- Reading Input Form: Clean, simple form for manual entry
- Date/Time Picker: Intuitive date selection with dropdown
- Input Validation: Real-time validation for reading values
- Submit Button: Prominent CTA button to submit reading and close panel
- Panel Animation: Smooth slide-in/out animations using Framer Motion

#### 3. Monthly Breakdown Visualization
- Month Selector: Navigation between months
- Weekly Pie Chart: Breakdown of monthly consumption by 4 weeks
- Interactive Drill-Down: Click on pie chart segment to view weekly details
- Dual View Toggle: Switch between Money Used (£) and kWh Used
- Daily Breakdown: Graph showing daily consumption within selected week
- LLM Summary: AI-generated insights and analysis

### Visual Design Inspiration
- **Dark Theme**: Modern dark interface with accent colors (purple/pink gradients)
- **Typography**: OCR A Std monospace font for technical, data-focused aesthetic
- **Data Visualization**: Clean, professional charts with good contrast using Recharts
- **Card-Based Layout**: Information organized in digestible cards with subtle noise textures
- **Progressive Disclosure**: Show summary first, details on demand
- **Right-Side Panel**: Slide-in panel design similar to reference site
- **CTA Button Design**: Prominent, gradient-styled buttons following Lewis-Linear patterns
- **Form Styling**: Clean input fields with underlines and validation states
- **Responsive Design**: Mobile-first approach with touch-friendly interactions

## Reference Implementation Analysis

### Electricity Bills UK (https://www.electricitybills.uk/)
- React-based electricity bill breakdown dashboard
- Uses Decimal.js for precise financial calculations
- OCR A Std monospace font for technical aesthetic
- Dark theme with purple/pink gradients
- Interactive charts and data visualization
- Real-time updates and responsive design

### Key Features from Reference
- Meter reading interface with right-side panel
- Interactive consumption charts
- Cost breakdown visualization
- Monthly/weekly/daily views
- Export functionality
- Mobile-responsive design

## Technical Dependencies

### Core Libraries
- **React**: 18+ with TypeScript
- **Recharts**: Data visualization and charting
- **Decimal.js**: Precise financial calculations
- **Framer Motion**: Smooth animations
- **React Hook Form**: Form handling and validation
- **Zustand**: State management
- **Tailwind CSS**: Styling framework

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and development experience
- **ESLint**: Code linting and quality
- **Prettier**: Code formatting
- **Jest**: Testing framework
- **Testing Library**: Component testing

### Backend Dependencies
- **Express.js**: Web framework
- **PostgreSQL**: Database
- **Prisma**: Database ORM
- **Socket.io**: Real-time communication
- **Multer**: File upload handling
- **PDF-parse**: PDF statement parsing
- **CSV-parser**: CSV file processing

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- Project setup and architecture
- Lewis-Linear design system integration
- Basic UI components and layout structure
- Database schema and API endpoints
- Real-time data infrastructure setup

### Phase 2: Core Features (Weeks 3-4)
- Meter reading management with right-side panel
- Basic analytics and charts using Recharts
- Real-time data updates and chart refreshes
- Data validation and error handling
- Decimal.js integration for precise calculations

### Phase 3: Advanced Features (Weeks 5-6)
- PDF statement parsing
- Advanced analytics and insights
- Export functionality
- Mobile optimization

### Phase 4: Polish & Launch (Weeks 7-8)
- Performance optimization
- Comprehensive testing
- Documentation and user guides
- Deployment and monitoring

## Success Metrics

### Technical Metrics
- **Performance**: Page load times < 2 seconds
- **Accessibility**: WCAG 2.1 AA compliance
- **Mobile**: 100% mobile functionality
- **Data Accuracy**: 99%+ parsing accuracy for common statement formats

### User Experience Metrics
- **Usability**: Task completion rate > 95%
- **Efficiency**: Meter reading entry < 30 seconds
- **Satisfaction**: User feedback score > 4.5/5
- **Adoption**: Daily active usage within first month

## Risk Assessment

### Technical Risks
- **Complex State Management**: Real-time updates and chart synchronization
- **Data Validation**: Ensuring accurate meter reading validation
- **Performance**: Large datasets and real-time chart updates
- **Mobile Responsiveness**: Complex UI components on small screens

### Mitigation Strategies
- Use proven state management patterns (Zustand)
- Implement comprehensive validation rules
- Optimize chart rendering and data processing
- Mobile-first design approach with progressive enhancement

## Next Steps

1. **Create Product Requirements Document (PRD)**
2. **Develop Project Plan (PP)**
3. **Set up .cursorrules file**
4. **Initialize project structure**
5. **Begin Phase 1 implementation**

## Resources

- **Reference Site**: [Electricity Bills UK](https://www.electricitybills.uk/)
- **Design System**: Lewis-Linear Design System
- **Chart Libraries**: [Recharts](https://recharts.org/)
- **Precision Math**: [Decimal.js](https://github.com/MikeMcl/decimal.js/)
- **PDF Processing**: [PDF.js](https://mozilla.github.io/pdf.js/)
- **React Build Tools**: [Vite](https://vitejs.dev/)
