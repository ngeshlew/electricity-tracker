import {
  buildSeasonYears,
  formatSeasonRange,
  formatSeasonYear,
  getSeasonForDate,
  percentChange,
} from './seasons';

describe('getSeasonForDate', () => {
  it('puts December in the following season-year so winter is never split', () => {
    expect(getSeasonForDate('2025-12-15')).toEqual({ season: 'Winter', seasonYear: 2026 });
    expect(getSeasonForDate('2026-02-28')).toEqual({ season: 'Winter', seasonYear: 2026 });
  });

  it('maps the other months to their calendar year', () => {
    expect(getSeasonForDate('2026-03-01')).toEqual({ season: 'Spring', seasonYear: 2026 });
    expect(getSeasonForDate('2026-08-31')).toEqual({ season: 'Summer', seasonYear: 2026 });
    expect(getSeasonForDate('2026-11-30')).toEqual({ season: 'Autumn', seasonYear: 2026 });
  });

  it('ignores the time of day', () => {
    expect(getSeasonForDate('2026-02-28T23:30:00.000Z').season).toBe('Winter');
  });
});

describe('labels', () => {
  it('labels winter with both years', () => {
    expect(formatSeasonYear('Winter', 2026)).toBe('2025/26');
    expect(formatSeasonYear('Summer', 2026)).toBe('2026');
    expect(formatSeasonRange('Winter', 2026)).toBe('Dec 2025 – Feb 2026');
  });
});

describe('buildSeasonYears', () => {
  const daily = (from: string, to: string, value: number) => {
    const out = [];
    for (let d = new Date(`${from}T00:00:00`); d <= new Date(`${to}T00:00:00`); d.setDate(d.getDate() + 1)) {
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      out.push({ date: iso, value, cost: value * 0.25 });
    }
    return out;
  };

  it('keeps each year separate instead of adding summers together', () => {
    const points = [...daily('2025-06-01', '2025-08-31', 4), ...daily('2026-06-01', '2026-08-31', 5)];
    const years = buildSeasonYears(points, new Date(2026, 9, 26));
    const summer25 = years.get(2025)!.find(b => b.season === 'Summer')!;
    const summer26 = years.get(2026)!.find(b => b.season === 'Summer')!;
    expect(summer25.total).toBe(92 * 4);
    expect(summer26.total).toBe(92 * 5);
    expect(summer26.avgPerDay).toBeCloseTo(5);
  });

  it('returns all four seasons in chronological order for every year in range', () => {
    const years = buildSeasonYears(daily('2025-06-01', '2026-10-25', 3), new Date(2026, 9, 26));
    expect([...years.keys()]).toEqual([2025, 2026]);
    expect(years.get(2026)!.map(b => b.season)).toEqual(['Winter', 'Spring', 'Summer', 'Autumn']);
    expect(years.get(2025)!.find(b => b.season === 'Spring')!.hasData).toBe(false);
  });

  it('averages an in-progress season over the days recorded, not the whole season', () => {
    const years = buildSeasonYears(daily('2026-09-01', '2026-10-25', 2), new Date(2026, 9, 26));
    const autumn = years.get(2026)!.find(b => b.season === 'Autumn')!;
    expect(autumn.inProgress).toBe(true);
    expect(autumn.daysCovered).toBe(55);
    expect(autumn.avgPerDay).toBeCloseTo(2);
  });

  it('averages sparse readings over calendar days, not reading count', () => {
    // One reading every 3 days, each carrying 3 days of usage.
    const points = [
      { date: '2026-06-01', value: 0 },
      { date: '2026-06-04', value: 12 },
      { date: '2026-06-07', value: 12 },
    ];
    const summer = buildSeasonYears(points, new Date(2026, 9, 26)).get(2026)!.find(b => b.season === 'Summer')!;
    expect(summer.daysCovered).toBe(7);
    expect(summer.avgPerDay).toBeCloseTo(24 / 7);
    expect(summer.entries).toBe(3);
  });

  it('reports cost only when points carry it', () => {
    const years = buildSeasonYears([{ date: '2026-06-01', value: 10 }], new Date(2026, 9, 26));
    expect(years.get(2026)!.find(b => b.season === 'Summer')!.hasCost).toBe(false);
  });

  it('returns nothing for no data', () => {
    expect(buildSeasonYears([]).size).toBe(0);
  });
});

describe('percentChange', () => {
  it('returns null when there is no baseline', () => {
    expect(percentChange(5, 0)).toBeNull();
    expect(percentChange(5, 4)).toBeCloseTo(25);
  });
});
