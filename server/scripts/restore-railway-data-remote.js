const { PrismaClient } = require('@prisma/client');

// Use Railway database URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres:mJrrmOFgOhazlTlfXuvEQzIrIqgULShK@postgres.railway.internal:5432/railway'
    }
  }
});

async function restoreData() {
  try {
    console.log('🔄 Restoring data to Railway database...');
    console.log('Database URL:', process.env.DATABASE_URL ? 'Using env var' : 'Using hardcoded URL');

    // Clear existing data
    await prisma.meterReading.deleteMany();
    console.log('✅ Cleared existing data');

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

    console.log(`✅ Successfully restored ${readings.length} meter readings`);
    
    // Verify the data
    const count = await prisma.meterReading.count();
    console.log(`📊 Total readings in database: ${count}`);

  } catch (error) {
    console.error('❌ Error restoring data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreData();
