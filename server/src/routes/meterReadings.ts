import express from 'express';
import { prisma } from '../utils/database';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// GET /api/meter-readings - Get all meter readings
router.get('/', async (_req, res, next) => {
  try {
    const readings = await prisma.meterReading.findMany({
      orderBy: { date: 'desc' }
    });

    res.json({
      success: true,
      data: readings
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

    res.json({
      success: true,
      data: reading
    });
  } catch (error) {
    next(createError('Failed to fetch meter reading', 500));
  }
});

// POST /api/meter-readings - Create new meter reading
router.post('/', async (req, res, next) => {
  try {
    const { meterId, reading, date, type, notes } = req.body;

    // Validate required fields
    if (!meterId || reading === undefined || !date) {
      return next(createError('Missing required fields', 400));
    }

    // Validate reading is positive
    if (reading < 0) {
      return next(createError('Reading must be positive', 400));
    }

    const newReading = await prisma.meterReading.create({
      data: {
        meterId: String(meterId),
        // Prisma accepts number or string for Decimal; ensure number
        reading: Number(reading),
        date: new Date(date),
        type: (type === 'MANUAL' || type === 'IMPORTED') ? type : 'MANUAL',
        notes: notes ?? null
      }
    });

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('meter-readings').emit('meter-reading-added', newReading);
    }

    res.status(201).json({
      success: true,
      data: newReading
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
    const { meterId, reading, date, type, notes } = req.body;

    // Check if reading exists
    const existingReading = await prisma.meterReading.findUnique({
      where: { id }
    });

    if (!existingReading) {
      return next(createError('Meter reading not found', 404));
    }

    // Validate reading is positive if provided
    if (reading !== undefined && reading < 0) {
      return next(createError('Reading must be positive', 400));
    }

    const updatedReading = await prisma.meterReading.update({
      where: { id },
      data: {
        ...(meterId && { meterId: String(meterId) }),
        ...(reading !== undefined && { reading: Number(reading) }),
        ...(date && { date: new Date(date) }),
        ...(type && { type }),
        ...(notes !== undefined && { notes })
      }
    });

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('meter-readings').emit('meter-reading-updated', updatedReading);
    }

    res.json({
      success: true,
      data: updatedReading
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
