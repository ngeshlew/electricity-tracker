import express from 'express';
import { prisma } from '../utils/database';
import { createError } from '../middleware/errorHandler';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// File storage setup for statement uploads
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `${base}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Unsupported file type'));
  }
});

// Serve uploads statically
router.use('/uploads', express.static(uploadsDir));

// GET /api/analytics/summary - Get summary analytics
router.get('/summary', async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    let whereClause: any = {};
    
    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    const readings = await prisma.meterReading.findMany({
      where: whereClause,
      orderBy: { date: 'asc' }
    });

    // Calculate total consumption
    let totalConsumption = 0;
    let totalCost = 0;
    const unitRate = 0.30; // Default unit rate

    for (let i = 1; i < readings.length; i++) {
      const prev = readings[i - 1];
      const curr = readings[i];
      if (!prev || !curr) continue;

      const prevVal = typeof (prev.reading as any).toNumber === 'function'
        ? (prev.reading as any).toNumber()
        : Number(prev.reading as unknown as number);
      const currVal = typeof (curr.reading as any).toNumber === 'function'
        ? (curr.reading as any).toNumber()
        : Number(curr.reading as unknown as number);

      const consumption = currVal - prevVal;
      if (consumption > 0) {
        totalConsumption += consumption;
        totalCost += consumption * unitRate;
      }
    }

    // Calculate daily average
    let days = 0;
    if (readings.length > 1) {
      const first = readings[0];
      const last = readings[readings.length - 1];
      if (first && last) {
        days = Math.ceil((last.date.getTime() - first.date.getTime()) / (1000 * 60 * 60 * 24));
      }
    }
    const dailyAverage = days > 0 ? totalConsumption / days : 0;

    // Determine trend
    let trend = 'stable';
    if (readings.length >= 4) {
      const firstHalf = readings.slice(0, Math.floor(readings.length / 2));
      const secondHalf = readings.slice(Math.floor(readings.length / 2));
      
      const computeAvg = (arr: any[]): number => {
        let sum = 0;
        let count = 0;
        for (let i = 1; i < arr.length; i++) {
          const prev = arr[i - 1];
          const curr = arr[i];
          if (!prev || !curr) continue;
          const prevVal = typeof (prev.reading as any).toNumber === 'function'
            ? (prev.reading as any).toNumber()
            : Number(prev.reading as unknown as number);
          const currVal = typeof (curr.reading as any).toNumber === 'function'
            ? (curr.reading as any).toNumber()
            : Number(curr.reading as unknown as number);
          const diff = currVal - prevVal;
          if (diff > 0) {
            sum += diff;
          }
          count++;
        }
        return count > 0 ? sum / count : 0;
      };

      const firstHalfAvg = computeAvg(firstHalf);
      const secondHalfAvg = computeAvg(secondHalf);
      
      const difference = secondHalfAvg - firstHalfAvg;
      const threshold = firstHalfAvg * 0.05; // 5% threshold
      
      if (difference > threshold) trend = 'increasing';
      else if (difference < -threshold) trend = 'decreasing';
    }

    res.json({
      success: true,
      data: {
        totalConsumption: Math.round(totalConsumption * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
        dailyAverage: Math.round(dailyAverage * 100) / 100,
        trend,
        readingCount: readings.length,
        period: {
          start: readings[0]?.date || null,
          end: readings[readings.length - 1]?.date || null
        }
      }
    });
  } catch (error) {
    next(createError('Failed to fetch summary analytics', 500));
  }
});

// GET /api/analytics/trends - Get trend analysis
router.get('/trends', async (req, res, next) => {
  try {
    const { period = 'monthly' } = req.query;

    const readings = await prisma.meterReading.findMany({
      orderBy: { date: 'asc' }
    });

    // Group readings by period
    const groupedData = new Map<string, any[]>();
    
    readings.forEach((reading: any, index: number) => {
      if (index === 0) return;
      const prevReading = readings[index - 1];
      if (!prevReading || !reading) return;

      const prevVal = typeof (prevReading.reading as any).toNumber === 'function'
        ? (prevReading.reading as any).toNumber()
        : Number(prevReading.reading as unknown as number);
      const currVal = typeof (reading.reading as any).toNumber === 'function'
        ? (reading.reading as any).toNumber()
        : Number(reading.reading as unknown as number);
      const consumption = currVal - prevVal;
      
      if (consumption > 0) {
        let key: string;
        const date = new Date(reading.date);
        
        const toDateOnly = (d: Date): string => {
          const iso = d.toISOString();
          const parts = iso.split('T');
          return parts[0] ?? iso;
        };

        switch (String(period)) {
          case 'daily':
            key = toDateOnly(date);
            break;
          case 'weekly':
            {
              const weekStart = new Date(date);
              weekStart.setDate(date.getDate() - date.getDay());
              key = toDateOnly(weekStart);
            }
            break;
          case 'monthly':
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            break;
          default:
            key = toDateOnly(date);
        }
        
        const list = groupedData.get(key) ?? [];
        list.push({
          date: reading.date,
          consumption,
          cost: consumption * 0.30
        });
        groupedData.set(key, list);
      }
    });

    // Calculate aggregated data for each period
    const trendData = Array.from(groupedData.entries()).map(([period, data]) => {
      const totalKwh = data.reduce((sum, item) => sum + item.consumption, 0);
      const totalCost = data.reduce((sum, item) => sum + item.cost, 0);
      const averageDaily = totalKwh / data.length;
      
      return {
        period,
        totalKwh: Math.round(totalKwh * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
        averageDaily: Math.round(averageDaily * 100) / 100,
        dataCount: data.length
      };
    });

    res.json({
      success: true,
      data: trendData
    });
  } catch (error) {
    next(createError('Failed to fetch trend analytics', 500));
  }
});

// GET /api/analytics/export - Export analytics data
router.get('/export', async (req, res, next) => {
  try {
    const { format = 'json', startDate, endDate } = req.query;

    let whereClause: any = {};
    
    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    const readings = await prisma.meterReading.findMany({
      where: whereClause,
      orderBy: { date: 'asc' }
    });

    // Calculate consumption data
    const consumptionData: Array<{ date: string; kwh: number; cost: number; readingId: string }> = [];
    for (let i = 1; i < readings.length; i++) {
      const prev = readings[i - 1];
      const curr = readings[i];
      if (!prev || !curr) continue;

      const prevVal = typeof (prev.reading as any).toNumber === 'function'
        ? (prev.reading as any).toNumber()
        : Number(prev.reading as unknown as number);
      const currVal = typeof (curr.reading as any).toNumber === 'function'
        ? (curr.reading as any).toNumber()
        : Number(curr.reading as unknown as number);
      const consumption = currVal - prevVal;
      if (consumption > 0) {
        const iso = curr.date.toISOString();
        const parts = iso.split('T');
        const dateOnly = parts[0] ?? iso;
        consumptionData.push({
          date: dateOnly,
          kwh: Math.round(consumption * 100) / 100,
          cost: Math.round(consumption * 0.30 * 100) / 100,
          readingId: curr.id
        });
      }
    }

    if (format === 'csv') {
      // Convert to CSV format
      const csvHeader = 'Date,kWh,Cost,Reading ID\n';
      const csvData = consumptionData.map(item => 
        `${item.date},${item.kwh},${item.cost},${item.readingId}`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=consumption-data.csv');
      res.send(csvHeader + csvData);
    } else {
      res.json({
        success: true,
        data: consumptionData,
        metadata: {
          totalRecords: consumptionData.length,
          exportDate: new Date().toISOString(),
          format: 'json'
        }
      });
    }
  } catch (error) {
    next(createError('Failed to export analytics data', 500));
  }
});

export default router;

// Statements API
// POST /api/analytics/statements/upload - Upload statement files
router.post('/statements/upload', upload.array('files', 5), async (req, res, next) => {
  try {
    const files = (req as any).files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return next(createError('No files uploaded', 400));
    }

    const created = await Promise.all(files.map(async (file) => {
      const statement = await prisma.energyStatement.create({
        data: {
          supplier: 'Unknown',
          periodStart: new Date(),
          periodEnd: new Date(),
          totalKwh: 0,
          totalCost: 0,
          unitRate: 0,
          standingCharge: 0,
          fileUrl: `/uploads/${path.basename(file.path)}`,
        }
      });
      return statement;
    }));

    res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(createError('Failed to upload statements', 500));
  }
});

// GET /api/analytics/statements - List statements
router.get('/statements', async (_req, res, next) => {
  try {
    const statements = await prisma.energyStatement.findMany({ orderBy: { importedAt: 'desc' } });
    res.json({ success: true, data: statements });
  } catch (error) {
    next(createError('Failed to fetch statements', 500));
  }
});

// DELETE /api/analytics/statements/:id - Delete statement
router.delete('/statements/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const statement = await prisma.energyStatement.findUnique({ where: { id } });
    if (!statement) return next(createError('Statement not found', 404));

    // Best-effort file deletion
    if (statement.fileUrl) {
      const filePath = path.resolve(process.cwd(), statement.fileUrl.replace(/^\//, ''));
      fs.unlink(filePath, () => {});
    }

    await prisma.energyStatement.delete({ where: { id } });
    res.json({ success: true, message: 'Statement deleted' });
  } catch (error) {
    next(createError('Failed to delete statement', 500));
  }
});
