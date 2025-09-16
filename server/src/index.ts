import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import meterReadingRoutes from './routes/meterReadings';
import analyticsRoutes from './routes/analytics';
import path from 'path';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env['CLIENT_URL'] || "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

const PORT = process.env['PORT'] || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env['CLIENT_URL'] || "*",
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static serving for uploaded statements
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Database test endpoint
app.get('/test-db', async (_req, res) => {
  try {
    const { prisma } = await import('./utils/database');
    await prisma.$connect();
    res.status(200).json({
      status: 'OK',
      message: 'Database connection successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    });
  }
});

// Temporary restore data endpoint
app.post('/restore-data', async (_req, res) => {
  try {
    const { prisma } = await import('./utils/database');
    
    // Clear existing data
    await prisma.meterReading.deleteMany();
    
    // Restore the meter readings data
    const readings = [
      {
        id: 'reading-1',
        meterId: 'main-meter',
        date: new Date('2025-07-21'),
        reading: 14000.00,
        type: 'MANUAL',
        isFirstReading: true,
        notes: 'Move-in reading',
        createdAt: new Date('2025-07-21T10:00:00Z'),
        updatedAt: new Date('2025-07-21T10:00:00Z')
      },
      {
        id: 'reading-2',
        meterId: 'main-meter',
        date: new Date('2025-08-02'),
        reading: 14044.00,
        type: 'MANUAL',
        isFirstReading: false,
        notes: 'Manual reading',
        createdAt: new Date('2025-08-02T10:00:00Z'),
        updatedAt: new Date('2025-08-02T10:00:00Z')
      },
      {
        id: 'reading-3',
        meterId: 'main-meter',
        date: new Date('2025-08-08'),
        reading: 14049.00,
        type: 'MANUAL',
        isFirstReading: false,
        notes: 'Manual reading',
        createdAt: new Date('2025-08-08T10:00:00Z'),
        updatedAt: new Date('2025-08-08T10:00:00Z')
      },
      {
        id: 'reading-4',
        meterId: 'main-meter',
        date: new Date('2025-09-03'),
        reading: 14113.00,
        type: 'MANUAL',
        isFirstReading: false,
        notes: 'Manual reading',
        createdAt: new Date('2025-09-03T10:00:00Z'),
        updatedAt: new Date('2025-09-03T10:00:00Z')
      },
      {
        id: 'reading-5',
        meterId: 'main-meter',
        date: new Date('2025-09-04'),
        reading: 14114.00,
        type: 'MANUAL',
        isFirstReading: false,
        notes: 'Manual reading',
        createdAt: new Date('2025-09-04T10:00:00Z'),
        updatedAt: new Date('2025-09-04T10:00:00Z')
      },
      {
        id: 'reading-6',
        meterId: 'main-meter',
        date: new Date('2025-09-05'),
        reading: 14115.00,
        type: 'MANUAL',
        isFirstReading: false,
        notes: 'Manual reading',
        createdAt: new Date('2025-09-05T10:00:00Z'),
        updatedAt: new Date('2025-09-05T10:00:00Z')
      },
      {
        id: 'reading-7',
        meterId: 'main-meter',
        date: new Date('2025-09-06'),
        reading: 14116.00,
        type: 'MANUAL',
        isFirstReading: false,
        notes: 'Manual reading',
        createdAt: new Date('2025-09-06T10:00:00Z'),
        updatedAt: new Date('2025-09-06T10:00:00Z')
      },
      {
        id: 'reading-8',
        meterId: 'main-meter',
        date: new Date('2025-09-07'),
        reading: 14117.00,
        type: 'MANUAL',
        isFirstReading: false,
        notes: 'Manual reading',
        createdAt: new Date('2025-09-07T10:00:00Z'),
        updatedAt: new Date('2025-09-07T10:00:00Z')
      },
      {
        id: 'reading-9',
        meterId: 'main-meter',
        date: new Date('2025-09-08'),
        reading: 14118.00,
        type: 'MANUAL',
        isFirstReading: false,
        notes: 'Manual reading',
        createdAt: new Date('2025-09-08T10:00:00Z'),
        updatedAt: new Date('2025-09-08T10:00:00Z')
      },
      {
        id: 'reading-10',
        meterId: 'main-meter',
        date: new Date('2025-09-09'),
        reading: 14119.00,
        type: 'MANUAL',
        isFirstReading: false,
        notes: 'Manual reading',
        createdAt: new Date('2025-09-09T10:00:00Z'),
        updatedAt: new Date('2025-09-09T10:00:00Z')
      },
      {
        id: 'reading-11',
        meterId: 'main-meter',
        date: new Date('2025-09-10'),
        reading: 14120.00,
        type: 'MANUAL',
        isFirstReading: false,
        notes: 'Manual reading',
        createdAt: new Date('2025-09-10T10:00:00Z'),
        updatedAt: new Date('2025-09-10T10:00:00Z')
      },
      {
        id: 'reading-12',
        meterId: 'main-meter',
        date: new Date('2025-09-11'),
        reading: 14121.00,
        type: 'MANUAL',
        isFirstReading: false,
        notes: 'Manual reading',
        createdAt: new Date('2025-09-11T10:00:00Z'),
        updatedAt: new Date('2025-09-11T10:00:00Z')
      },
      {
        id: 'reading-13',
        meterId: 'main-meter',
        date: new Date('2025-09-12'),
        reading: 14122.00,
        type: 'MANUAL',
        isFirstReading: false,
        notes: 'Manual reading',
        createdAt: new Date('2025-09-12T10:00:00Z'),
        updatedAt: new Date('2025-09-12T10:00:00Z')
      },
      {
        id: 'reading-14',
        meterId: 'main-meter',
        date: new Date('2025-09-13'),
        reading: 14123.00,
        type: 'MANUAL',
        isFirstReading: false,
        notes: 'Manual reading',
        createdAt: new Date('2025-09-13T10:00:00Z'),
        updatedAt: new Date('2025-09-13T10:00:00Z')
      },
      {
        id: 'reading-15',
        meterId: 'main-meter',
        date: new Date('2025-09-14'),
        reading: 14124.00,
        type: 'MANUAL',
        isFirstReading: false,
        notes: 'Manual reading',
        createdAt: new Date('2025-09-14T10:00:00Z'),
        updatedAt: new Date('2025-09-14T10:00:00Z')
      },
      {
        id: 'reading-16',
        meterId: 'main-meter',
        date: new Date('2025-09-15'),
        reading: 14157.00,
        type: 'MANUAL',
        isFirstReading: false,
        notes: 'Manual reading',
        createdAt: new Date('2025-09-15T10:00:00Z'),
        updatedAt: new Date('2025-09-15T10:00:00Z')
      }
    ];

    // Insert the readings
    for (const reading of readings) {
      await prisma.meterReading.create({
        data: reading
      });
    }

    const count = await prisma.meterReading.count();
    
    res.status(200).json({
      status: 'OK',
      message: `Successfully restored ${readings.length} meter readings`,
      count: count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to restore data',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    });
  }
});

// API Routes
app.use('/api/meter-readings', meterReadingRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Join meter readings room for real-time updates
  socket.on('join-meter-readings', () => {
    socket.join('meter-readings');
    console.log(`Client ${socket.id} joined meter-readings room`);
  });

  // Handle meter reading updates
  socket.on('meter-reading-added', (data) => {
    socket.to('meter-readings').emit('meter-reading-added', data);
  });

  socket.on('meter-reading-updated', (data) => {
    socket.to('meter-readings').emit('meter-reading-updated', data);
  });

  socket.on('meter-reading-deleted', (data) => {
    socket.to('meter-readings').emit('meter-reading-deleted', data);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Make io available to routes
app.set('io', io);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔌 Socket.io enabled for real-time updates`);
});

export { io };
