# 🔌 Electricity Tracker - Backend Server

Express.js backend server with TypeScript, PostgreSQL, and Socket.io for real-time updates.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database configuration
   ```

3. **Set up the database:**
   ```bash
   npm run db:setup
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 📊 Database Setup

The server uses PostgreSQL with Prisma ORM. Make sure you have PostgreSQL running and update the `DATABASE_URL` in your `.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/electricity_tracker?schema=public"
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:setup` - Complete database setup

## 🔌 API Endpoints

### Meter Readings
- `GET /api/meter-readings` - Get all meter readings
- `GET /api/meter-readings/:id` - Get specific meter reading
- `POST /api/meter-readings` - Create new meter reading
- `PUT /api/meter-readings/:id` - Update meter reading
- `DELETE /api/meter-readings/:id` - Delete meter reading
- `GET /api/meter-readings/analytics/consumption` - Get consumption analytics

### Analytics
- `GET /api/analytics/summary` - Get summary analytics
- `GET /api/analytics/trends` - Get trend analysis
- `GET /api/analytics/export` - Export analytics data (JSON/CSV)

### Health Check
- `GET /health` - Server health status

## 🔄 Real-time Updates

The server uses Socket.io for real-time updates. Clients can:

1. **Connect to the server:**
   ```javascript
   const socket = io('http://localhost:3001');
   ```

2. **Join meter readings room:**
   ```javascript
   socket.emit('join-meter-readings');
   ```

3. **Listen for updates:**
   ```javascript
   socket.on('meter-reading-added', (data) => {
     // Handle new meter reading
   });
   
   socket.on('meter-reading-updated', (data) => {
     // Handle updated meter reading
   });
   
   socket.on('meter-reading-deleted', (data) => {
     // Handle deleted meter reading
   });
   ```

## 🗄️ Database Schema

### MeterReading
- `id` - Unique identifier
- `meterId` - Meter identifier
- `reading` - Reading value (decimal)
- `date` - Reading date
- `type` - Reading type (MANUAL/IMPORTED)
- `notes` - Optional notes
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### EnergyStatement
- `id` - Unique identifier
- `supplier` - Energy supplier name
- `periodStart` - Statement period start
- `periodEnd` - Statement period end
- `totalKwh` - Total kWh consumed
- `totalCost` - Total cost
- `unitRate` - Unit rate per kWh
- `standingCharge` - Daily standing charge
- `fileUrl` - Optional file URL
- `importedAt` - Import timestamp

### ConsumptionAnalytics
- `id` - Unique identifier
- `periodType` - Period type (DAILY/WEEKLY/MONTHLY)
- `periodDate` - Period date
- `kwh` - kWh consumed
- `cost` - Cost for period
- `averageDailyUsage` - Average daily usage
- `trend` - Usage trend (INCREASING/DECREASING/STABLE)
- `createdAt` - Creation timestamp

## 🛠️ Development

### Project Structure
```
server/
├── src/
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── index.ts        # Main server file
├── prisma/
│   └── schema.prisma   # Database schema
├── scripts/
│   └── setup-db.js     # Database setup script
└── package.json
```

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/electricity_tracker?schema=public"

# Server Configuration
PORT=3001
NODE_ENV=development

# Client Configuration
CLIENT_URL=http://localhost:5173

# JWT Secret (for future authentication)
JWT_SECRET=your-super-secret-jwt-key-here

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 🚀 Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Set production environment variables**

3. **Start the production server:**
   ```bash
   npm start
   ```

## 📝 API Documentation

### Request/Response Format

All API responses follow this format:
```json
{
  "success": true,
  "data": { ... },
  "error": { ... } // Only present on error
}
```

### Error Handling

Errors are returned with appropriate HTTP status codes:
- `400` - Bad Request (validation errors)
- `404` - Not Found (resource not found)
- `500` - Internal Server Error (server errors)

## 🔧 Troubleshooting

### Common Issues

1. **Database connection failed:**
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env
   - Ensure database exists

2. **Prisma client not generated:**
   ```bash
   npm run db:generate
   ```

3. **Schema changes not applied:**
   ```bash
   npm run db:push
   ```

4. **Port already in use:**
   - Change PORT in .env
   - Kill existing process on port 3001

## 📞 Support

For issues and questions:
- Check the logs for error details
- Verify environment configuration
- Ensure all dependencies are installed
- Check database connectivity
