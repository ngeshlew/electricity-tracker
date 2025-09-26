const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const meterReadings = [
  // July 2025 - First reading (move-in)
  {
    id: 'reading-jul-21',
    meterId: 'meter-1',
    reading: 13901.00,
    date: new Date('2025-07-21'),
    type: 'MANUAL',
    notes: 'Move-in reading',
    isFirstReading: true,
    createdAt: new Date('2025-07-21T10:00:00Z'),
    updatedAt: new Date('2025-07-21T10:00:00Z')
  },
  
  // August 2025
  {
    id: 'reading-aug-02',
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
    id: 'reading-aug-08',
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
    id: 'reading-aug-25',
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
    id: 'reading-aug-28',
    meterId: 'meter-1',
    reading: 14090.00,
    date: new Date('2025-08-28'),
    type: 'MANUAL',
    notes: 'Manual reading',
    isFirstReading: false,
    createdAt: new Date('2025-08-28T10:00:00Z'),
    updatedAt: new Date('2025-08-28T10:00:00Z')
  },
  
  // September 2025
  {
    id: 'reading-sep-01',
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
    id: 'reading-sep-02',
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
    id: 'reading-sep-03',
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
    id: 'reading-sep-05',
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
    id: 'reading-sep-06',
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
    id: 'reading-sep-07',
    meterId: 'meter-1',
    reading: 14128.00,
    date: new Date('2025-09-07'),
    type: 'MANUAL',
    notes: 'Manual reading',
    isFirstReading: false,
    createdAt: new Date('2025-09-07T10:00:00Z'),
    updatedAt: new Date('2025-09-07T10:00:00Z')
  },
  {
    id: 'reading-sep-08',
    meterId: 'meter-1',
    reading: 14134.00,
    date: new Date('2025-09-08'),
    type: 'MANUAL',
    notes: 'Manual reading',
    isFirstReading: false,
    createdAt: new Date('2025-09-08T10:00:00Z'),
    updatedAt: new Date('2025-09-08T10:00:00Z')
  },
  {
    id: 'reading-sep-09',
    meterId: 'meter-1',
    reading: 14136.00,
    date: new Date('2025-09-09'),
    type: 'MANUAL',
    notes: 'Manual reading',
    isFirstReading: false,
    createdAt: new Date('2025-09-09T10:00:00Z'),
    updatedAt: new Date('2025-09-09T10:00:00Z')
  },
  {
    id: 'reading-sep-10',
    meterId: 'meter-1',
    reading: 14139.00,
    date: new Date('2025-09-10'),
    type: 'MANUAL',
    notes: 'Manual reading',
    isFirstReading: false,
    createdAt: new Date('2025-09-10T10:00:00Z'),
    updatedAt: new Date('2025-09-10T10:00:00Z')
  },
  {
    id: 'reading-sep-14',
    meterId: 'meter-1',
    reading: 14156.00,
    date: new Date('2025-09-14'),
    type: 'MANUAL',
    notes: 'Manual reading',
    isFirstReading: false,
    createdAt: new Date('2025-09-14T10:00:00Z'),
    updatedAt: new Date('2025-09-14T10:00:00Z')
  },
  {
    id: 'reading-sep-15',
    meterId: 'meter-1',
    reading: 14157.00,
    date: new Date('2025-09-15'),
    type: 'MANUAL',
    notes: 'Manual reading',
    isFirstReading: false,
    createdAt: new Date('2025-09-15T10:00:00Z'),
    updatedAt: new Date('2025-09-15T10:00:00Z')
  }
];

async function restoreCompleteData() {
  try {
    console.log('Starting complete data restoration...');
    
    // Clear existing data
    await prisma.meterReading.deleteMany({});
    console.log('Cleared existing meter readings');
    
    // Insert the complete data
    for (const reading of meterReadings) {
      await prisma.meterReading.create({
        data: reading
      });
    }
    
    console.log(`Successfully restored ${meterReadings.length} meter readings`);
    
    // Verify the data
    const count = await prisma.meterReading.count();
    console.log(`Total meter readings in database: ${count}`);
    
    // Show the readings in chronological order
    const allReadings = await prisma.meterReading.findMany({
      orderBy: { date: 'asc' }
    });
    
    console.log('\nMeter readings in database:');
    allReadings.forEach(reading => {
      const date = new Date(reading.date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      console.log(`${date}: ${reading.reading} kWh (${reading.type})`);
    });
    
  } catch (error) {
    console.error('Error restoring data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreCompleteData();
