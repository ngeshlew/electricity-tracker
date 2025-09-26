import express from 'express';
import { prisma } from '../utils/database';
import { createError } from '../middleware/errorHandler';
import { z } from 'zod';

const router = express.Router();

// GET /api/meter-readings - Get all meter readings
router.get('/', async (_req, res, next) => {
  try {
    const readings = await prisma.meterReading.findMany({
      orderBy: { date: 'desc' }
    });

    // Convert Decimal fields to numbers for JSON response
    const formattedReadings = readings.map(reading => ({
      ...reading,
      reading: Number(reading.reading),
    }));

    res.json({
      success: true,
      data: formattedReadings
    });
  } catch (error) {
    next(createError('Failed to fetch meter readings', 500));
  }
});

// GET /api/meter-readings/:id - Get specific meter reading
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const reading = await prisma.meterReading.findUnique({
      where: { id }
    });

    if (!reading) {
      return next(createError('Meter reading not found', 404));
    }

    // Convert Decimal fields to numbers for JSON response
    const formattedReading = {
      ...reading,
      reading: Number(reading.reading),
    };

    res.json({
      success: true,
      data: formattedReading
    });
  } catch (error) {
    next(createError('Failed to fetch meter reading', 500));
  }
});

// POST /api/meter-readings - Create new meter reading
router.post('/', async (req, res, next) => {
  try {
    const schema = z.object({
      meterId: z.string().min(1),
      reading: z.number().nonnegative(),
      date: z.string().refine((s) => !Number.isNaN(Date.parse(s)), 'Invalid date'),
      type: z.enum(['MANUAL', 'IMPORTED', 'ESTIMATED']).optional(),
      notes: z.string().optional(),
      isFirstReading: z.boolean().optional()
    });
    const parsed = schema.parse(req.body);

    const newReading = await prisma.meterReading.create({
      data: {
        meterId: String(parsed.meterId),
        // Prisma accepts number or string for Decimal; ensure number
        reading: Number(parsed.reading),
        date: new Date(parsed.date),
        type: parsed.type ?? 'MANUAL',
        notes: parsed.notes ?? null,
        isFirstReading: parsed.isFirstReading ?? false
      }
    });

    // Convert Decimal fields to numbers for JSON response
    const formattedReading = {
      ...newReading,
      reading: Number(newReading.reading),
    };

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('meter-readings').emit('meter-reading-added', formattedReading);
    }

    res.status(201).json({
      success: true,
      data: formattedReading
    });
  } catch (error) {
    // Log underlying error for debugging during development
    console.error('Create meter reading failed:', error);
    next(error as any);
  }
});

// PUT /api/meter-readings/:id - Update meter reading
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if reading exists
    const existingReading = await prisma.meterReading.findUnique({
      where: { id }
    });

    if (!existingReading) {
      return next(createError('Meter reading not found', 404));
    }

    const schema = z.object({
      meterId: z.string().min(1).optional(),
      reading: z.number().nonnegative().optional(),
      date: z.string().refine((s) => !Number.isNaN(Date.parse(s)), 'Invalid date').optional(),
      type: z.enum(['MANUAL', 'IMPORTED', 'ESTIMATED']).optional(),
      notes: z.string().optional(),
      isFirstReading: z.boolean().optional()
    });
    const parsed = schema.parse(req.body);

    const updatedReading = await prisma.meterReading.update({
      where: { id },
      data: {
        ...(parsed.meterId && { meterId: String(parsed.meterId) }),
        ...(parsed.reading !== undefined && { reading: Number(parsed.reading) }),
        ...(parsed.date && { date: new Date(parsed.date) }),
        ...(parsed.type && { type: parsed.type }),
        ...(parsed.notes !== undefined && { notes: parsed.notes }),
        ...(parsed.isFirstReading !== undefined && { isFirstReading: Boolean(parsed.isFirstReading) })
      }
    });

    // Convert Decimal fields to numbers for JSON response
    const formattedReading = {
      ...updatedReading,
      reading: Number(updatedReading.reading),
    };

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('meter-readings').emit('meter-reading-updated', formattedReading);
    }

    res.json({
      success: true,
      data: formattedReading
    });
  } catch (error) {
    next(createError('Failed to update meter reading', 500));
  }
});

// DELETE /api/meter-readings/:id - Delete meter reading
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if reading exists
    const existingReading = await prisma.meterReading.findUnique({
      where: { id }
    });

    if (!existingReading) {
      return next(createError('Meter reading not found', 404));
    }

    await prisma.meterReading.delete({
      where: { id }
    });

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('meter-readings').emit('meter-reading-deleted', { id });
    }

    res.json({
      success: true,
      message: 'Meter reading deleted successfully'
    });
  } catch (error) {
    next(createError('Failed to delete meter reading', 500));
  }
});

// GET /api/meter-readings/analytics/consumption - Get consumption analytics
router.get('/analytics/consumption', async (req, res, next) => {
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

    // Calculate consumption between consecutive readings
    const consumptionData: Array<{ date: string; kwh: number; cost: number; readingId: string }> = [];
    for (let i = 1; i < readings.length; i++) {
      const prevReading = readings[i - 1];
      const currentReading = readings[i];

      if (!prevReading || !currentReading) {
        continue;
      }

      const prevValue = typeof (prevReading.reading as any).toNumber === 'function'
        ? (prevReading.reading as any).toNumber()
        : Number(prevReading.reading as unknown as number);
      const currentValue = typeof (currentReading!.reading as any).toNumber === 'function'
        ? (currentReading!.reading as any).toNumber()
        : Number(currentReading!.reading as unknown as number);

      const consumption = currentValue - prevValue;

      if (consumption > 0) {
        const isoString = currentReading!.date.toISOString();
        const dateParts = isoString.split('T');
        const dateOnly = dateParts[0] ?? isoString;

        consumptionData.push({
          date: dateOnly,
          kwh: consumption,
          cost: consumption * 0.30, // Default unit rate
          readingId: currentReading!.id
        });
      }
    }

    res.json({
      success: true,
      data: consumptionData
    });
  } catch (error) {
    next(createError('Failed to fetch consumption analytics', 500));
  }
});

export default router;
