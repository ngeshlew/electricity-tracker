const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const meterReadings = [
  {
    id: 'reading-1',
    meterId: 'meter-1',
    reading: 13901.00,
    date: new Date('2025-07-21'),
    type: 'MANUAL',
    notes: 'Initial reading',
    isFirstReading: true,
    createdAt: new Date('2025-07-21T10:00:00Z'),
    updatedAt: new Date('2025-07-21T10:00:00Z')
  },
  {
    id: 'reading-2',
    meterId: 'meter-1',
    reading: 13969.00,
    date: new Date('2025-08-02'),
    type: 'MANUAL',
    notes: 'Manual reading',
    isFirstReading: false,
    createdAt: new Date('2025-08-02T10:00:00Z'),
    updatedAt: new Date('2025-08-02T10:00:00Z')
  },
  {
    id: 'reading-3',
    meterId: 'meter-1',
    reading: 14001.00,
    date: new Date('2025-08-08'),
    type: 'MANUAL',
    notes: 'Manual reading',
    isFirstReading: false,
    createdAt: new Date('2025-08-08T10:00:00Z'),
    updatedAt: new Date('2025-08-08T10:00:00Z')
  },
  {
    id: 'reading-4',
    meterId: 'meter-1',
    reading: 14079.00,
    date: new Date('2025-08-25'),
    type: 'MANUAL',
    notes: 'Manual reading',
    isFirstReading: false,
    createdAt: new Date('2025-08-25T10:00:00Z'),
    updatedAt: new Date('2025-08-25T10:00:00Z')
  },
  {
    id: 'reading-5',
    meterId: 'meter-1',
    reading: 14090.00,
    date: new Date('2025-08-28'),
    type: 'MANUAL',
    notes: 'Manual reading',
    isFirstReading: false,
    createdAt: new Date('2025-08-28T10:00:00Z'),
    updatedAt: new Date('2025-08-28T10:00:00Z')
  },
  {
    id: 'reading-6',
    meterId: 'meter-1',
    reading: 14105.00,
    date: new Date('2025-09-01'),
    type: 'MANUAL',
    notes: 'Manual reading',
    isFirstReading: false,
    createdAt: new Date('2025-09-01T10:00:00Z'),
    updatedAt: new Date('2025-09-01T10:00:00Z')
  },
  {
    id: 'reading-7',
    meterId: 'meter-1',
    reading: 14108.00,
    date: new Date('2025-09-02'),
    type: 'MANUAL',
    notes: 'Manual reading',
    isFirstReading: false,
    createdAt: new Date('2025-09-02T10:00:00Z'),
    updatedAt: new Date('2025-09-02T10:00:00Z')
  },
  {
    id: 'reading-8',
    meterId: 'meter-1',
    reading: 14113.00,
    date: new Date('2025-09-03'),
    type: 'MANUAL',
    notes: 'Manual reading',
    isFirstReading: false,
    createdAt: new Date('2025-09-03T10:00:00Z'),
    updatedAt: new Date('2025-09-03T10:00:00Z')
  },
  {
    id: 'reading-9',
    meterId: 'meter-1',
    reading: 14120.00,
    date: new Date('2025-09-05'),
    type: 'MANUAL',
    notes: 'Manual reading',
    isFirstReading: false,
    createdAt: new Date('2025-09-05T10:00:00Z'),
    updatedAt: new Date('2025-09-05T10:00:00Z')
  },
  {
    id: 'reading-10',
    meterId: 'meter-1',
    reading: 14123.00,
    date: new Date('2025-09-06'),
    type: 'MANUAL',
    notes: 'Manual reading',
    isFirstReading: false,
    createdAt: new Date('2025-09-06T10:00:00Z'),
    updatedAt: new Date('2025-09-06T10:00:00Z')
  },
  {
    id: 'reading-11',
    meterId: 'meter-1',
    reading: 14128.00,
    date: new Date('2025-09-07'),
    type: 'MANUAL',
    notes: 'Manual reading',
    isFirstReading: false,
    createdAt: new Date('2025-09-07T10:00:00Z'),
    updatedAt: new Date('2025-09-07T10:00:00Z')
  }
];

async function restoreData() {
  try {
    console.log('Starting data restoration...');
    
    // Clear existing data
    await prisma.meterReading.deleteMany({});
    console.log('Cleared existing meter readings');
    
    // Insert the restored data
    for (const reading of meterReadings) {
      await prisma.meterReading.create({
        data: reading
      });
    }
    
    console.log(`Successfully restored ${meterReadings.length} meter readings`);
    
    // Verify the data
    const count = await prisma.meterReading.count();
    console.log(`Total meter readings in database: ${count}`);
    
  } catch (error) {
    console.error('Error restoring data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreData();
