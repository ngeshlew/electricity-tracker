import type { MeterReading } from '@/types';

export interface DailyConsumptionPoint {
  date: string;
  consumption: number;
  cost: number;
}

interface BuildSeriesOptions {
  fillMissingDays?: boolean;
}

/**
 * Build a daily consumption series directly from meter readings.
 * Ensures parity with Reading History by deriving deltas between consecutive readings.
 */
const getLocalDateKey = (date: Date): string => {
  const local = new Date(date);
  local.setHours(0, 0, 0, 0);
  return `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, '0')}-${String(local.getDate()).padStart(2, '0')}`;
};

export const buildDailyConsumptionSeries = (
  readings: MeterReading[],
  calculateCost: (kwh: number, date?: Date) => number,
  options: BuildSeriesOptions = { fillMissingDays: true }
): DailyConsumptionPoint[] => {
  if (!readings || readings.length === 0) return [];

  const sorted = [...readings].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const dailyBestReading = new Map<string, MeterReading>();
  sorted.forEach((reading) => {
    const dateKey = getLocalDateKey(new Date(reading.date));
    const existing = dailyBestReading.get(dateKey);
    if (!existing) {
      dailyBestReading.set(dateKey, reading);
      return;
    }
    if (reading.type === 'MANUAL' && existing.type !== 'MANUAL') {
      dailyBestReading.set(dateKey, reading);
      return;
    }
    if (new Date(reading.date).getTime() > new Date(existing.date).getTime()) {
      dailyBestReading.set(dateKey, reading);
    }
  });

  const normalizedReadings = Array.from(dailyBestReading.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const dailyMap = new Map<string, DailyConsumptionPoint>();

  for (let i = 1; i < normalizedReadings.length; i++) {
    const previous = normalizedReadings[i - 1];
    const current = normalizedReadings[i];

    if (!previous || !current) continue;
    if (current.isFirstReading) continue;

    const previousDate = new Date(previous.date);
    const currentDate = new Date(current.date);

    if (options.fillMissingDays) {
      const gapDate = new Date(previousDate);
      gapDate.setDate(gapDate.getDate() + 1);
      while (gapDate < currentDate) {
        const gapIso = gapDate.toISOString().split('T')[0];
        if (!dailyMap.has(gapIso)) {
          dailyMap.set(gapIso, {
            date: gapIso,
            consumption: 0,
            cost: 0,
          });
        }
        gapDate.setDate(gapDate.getDate() + 1);
      }
    }

    const consumption = Math.max(0, Number(current.reading) - Number(previous.reading));
    const isoDate = getLocalDateKey(currentDate);

    const cost = consumption > 0 ? calculateCost(consumption, currentDate) : 0;

    if (dailyMap.has(isoDate)) {
      const existing = dailyMap.get(isoDate)!;
      dailyMap.set(isoDate, {
        date: isoDate,
        consumption: existing.consumption + consumption,
        cost: existing.cost + cost,
      });
    } else {
      dailyMap.set(isoDate, {
        date: isoDate,
        consumption,
        cost,
      });
    }
  }

  if (dailyMap.size === 0) return [];

  return Array.from(dailyMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};


