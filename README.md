# ⚡ Electricity Tracker

A modern, AI-powered electricity consumption tracking dashboard built with React, TypeScript, and real-time analytics. Monitor your energy usage, analyze consumption patterns, and optimize your electricity costs with an intuitive, mobile-first interface.

![Electricity Tracker Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![React](https://img.shields.io/badge/React-18+-61dafb)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 📊 **Real-time Analytics**
- **Live Dashboard**: Real-time consumption monitoring with instant updates
- **Interactive Charts**: Advanced visualizations using Recharts
- **Trend Analysis**: AI-powered consumption pattern detection
- **Multi-period Views**: Daily, weekly, monthly, and yearly breakdowns

### 📱 **Mobile-First Design**
- **Progressive Web App**: Install on any device for offline access
- **Responsive Layout**: Optimized for all screen sizes
- **Touch Interactions**: Intuitive mobile-friendly interface
- **Lewis-Linear Design**: Custom design system with smooth animations

### 🔄 **Real-time Features**
- **Live Updates**: WebSocket-powered real-time data synchronization
- **Instant Notifications**: Real-time alerts and updates
- **Background Sync**: Offline data synchronization
- **Auto-refresh**: Automatic data updates

### 📈 **Advanced Analytics**
- **Consumption Tracking**: Detailed kWh and cost analysis
- **Trend Detection**: Automatic trend identification
- **Export Options**: CSV and JSON data export
- **Historical Analysis**: Long-term consumption insights

### 📁 **Statement Management**
- **File Upload**: Drag-and-drop PDF, CSV, and Excel support
- **Auto-parsing**: Intelligent bill data extraction
- **Import/Export**: Seamless data migration
- **File Management**: Organized statement storage

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL 14+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ngeshlew/electricity-tracker.git
   cd electricity-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd server && npm install
   ```

3. **Set up environment variables**
   ```bash
   # Frontend (.env)
   VITE_API_URL=http://localhost:3001
   VITE_SOCKET_URL=http://localhost:3001
   
   # Backend (server/.env)
   DATABASE_URL="postgresql://username:password@localhost:5432/electricity_tracker"
   PORT=3001
   CLIENT_URL=http://localhost:5173
   ```

4. **Set up the database**
   ```bash
   cd server
   npm run db:setup
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Architecture

### Frontend Stack
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling and validation
- **Recharts** - Data visualization
- **Socket.io** - Real-time communication

### Backend Stack
- **Express.js** - Web framework
- **TypeScript** - Type-safe backend
- **PostgreSQL** - Relational database
- **Prisma ORM** - Database toolkit
- **Socket.io** - Real-time server
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Design System
- **Lewis-Linear** - Custom design system
- **OCR A Std** - Monospace typography
- **Electric Color Palette** - Purple/pink gradients
- **Smooth Animations** - Framer Motion integration
- **Dark Theme** - Modern dark interface

## 📱 PWA Features

### Offline Support
- **Service Worker**: Caches essential files for offline access
- **Background Sync**: Syncs data when connection is restored
- **Offline Indicators**: Clear feedback when offline
- **Cached API Responses**: Serves cached data when offline

### Mobile Installation
- **Add to Home Screen**: Install as native app
- **App Shortcuts**: Quick actions from home screen
- **Splash Screen**: Custom loading screen
- **App Icons**: High-quality icons for all devices

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test MonthlyOverview.test.tsx
```

### Test Coverage
- **Unit Tests**: Component and utility testing
- **Integration Tests**: API and state management testing
- **E2E Tests**: Full user workflow testing
- **Accessibility Tests**: WCAG 2.1 AA compliance

## 📦 Deployment

### Production Build
```bash
# Build frontend
npm run build

# Build backend
cd server && npm run build
```

### Environment Setup
1. **Database**: Set up PostgreSQL production database
2. **Environment Variables**: Configure production environment
3. **SSL Certificate**: Set up HTTPS for security
4. **Domain**: Configure custom domain
5. **CDN**: Set up content delivery network

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=https://api.electricity-tracker.com
VITE_SOCKET_URL=https://api.electricity-tracker.com
VITE_APP_NAME=Electricity Tracker
VITE_APP_VERSION=1.0.0
```

#### Backend (server/.env)
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/electricity_tracker"
PORT=3001
CLIENT_URL=https://electricity-tracker.com
NODE_ENV=production
JWT_SECRET=your-jwt-secret
```

### Database Configuration
```sql
-- Create database
CREATE DATABASE electricity_tracker;

-- Create user
CREATE USER elec_user WITH PASSWORD 'secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE electricity_tracker TO elec_user;
```

## 📊 API Documentation

### Meter Readings
```typescript
// Get all readings
GET /api/meter-readings

// Get reading by ID
GET /api/meter-readings/:id

// Create new reading
POST /api/meter-readings
{
  "meterId": "default-meter",
  "reading": 1500,
  "date": "2024-01-15T10:30:00Z",
  "type": "MANUAL",
  "notes": "Monthly reading"
}

// Update reading
PUT /api/meter-readings/:id

// Delete reading
DELETE /api/meter-readings/:id
```

### Analytics
```typescript
// Get consumption trends
GET /api/analytics/trends?period=monthly

// Get chart data
GET /api/analytics/chart?period=weekly

// Get consumption data
GET /api/analytics/consumption?start=2024-01-01&end=2024-01-31
```

## 🎨 Design System

### Colors
```css
/* Electric Purple */
--electric-purple: 139 92 246;

/* Electric Pink */
--electric-pink: 236 72 153;

/* Electric Blue */
--electric-blue: 59 130 246;

/* Electric Green */
--electric-green: 34 197 94;

/* Electric Orange */
--electric-orange: 249 115 22;

/* Electric Red */
--electric-red: 239 68 68;
```

### Typography
```css
/* Primary Font */
font-family: 'OCR A Std', monospace;

/* Headings */
.lewis-text-gradient {
  background: linear-gradient(135deg, var(--electric-purple), var(--electric-pink));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Components
- **Cards**: `lewis-card` with glow effects
- **Buttons**: `lewis-button-primary` with animations
- **Animations**: `lewis-animation-fade-in` for smooth transitions
- **Shadows**: `lewis-shadow-glow` for depth

## 🔒 Security

### Data Protection
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Prevention**: Prisma ORM protection
- **XSS Protection**: React's built-in XSS prevention
- **CSRF Protection**: Token-based CSRF protection

### Privacy
- **Local Storage**: Sensitive data stored locally
- **No Tracking**: No analytics or tracking scripts
- **Data Encryption**: All data encrypted in transit
- **GDPR Compliant**: Privacy-first data handling

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for React and TypeScript
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

### Commit Convention
```
feat: add new feature
fix: bug fix
docs: documentation update
style: code formatting
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Vite Team** - For the fast build tool
- **Tailwind CSS** - For the utility-first CSS framework
- **Recharts** - For the beautiful chart library
- **Prisma** - For the excellent database toolkit

## 📞 Support

- **Documentation**: [Full Documentation](https://electricity-tracker.com/docs)
- **Issues**: [GitHub Issues](https://github.com/ngeshlew/electricity-tracker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ngeshlew/electricity-tracker/discussions)
- **Email**: support@electricity-tracker.com

---

**Built with ❤️ by the Electricity Tracker Team**

*Empowering users to take control of their energy consumption through intelligent analytics and beautiful design.*