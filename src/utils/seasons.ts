/**
 * Season-year bucketing shared by the electricity, water and fuel trackers.
 * Keep this file identical across the three repos (see docs/design-system/README.md).
 *
 * A season-year groups the four seasons that end in a calendar year, so
 * Winter 2025/26 (Dec 2025 – Feb 2026) belongs to 2026 alongside Spring,
 * Summer and Autumn 2026. Winter is never split across two years.
 */

export type SeasonName = 'Winter' | 'Spring' | 'Summer' | 'Autumn';

/** Chronological order within a season-year. */
export const SEASON_ORDER: SeasonName[] = ['Winter', 'Spring', 'Summer', 'Autumn'];

export interface SeasonPoint {
  /** ISO date (YYYY-MM-DD or full timestamp) or Date. */
  date: string | Date;
  /** Usage attributed to this date: kWh, litres or miles. */
  value: number;
  cost?: number;
}

export interface SeasonBucket {
  season: SeasonName;
  seasonYear: number;
  start: Date;
  end: Date;
  total: number;
  cost: number;
  hasCost: boolean;
  /** Calendar days in the season that fall inside the recorded data range. */
  daysCovered: number;
  daysInSeason: number;
  avgPerDay: number;
  entries: number;
  inProgress: boolean;
  hasData: boolean;
}

const DAY_MS = 86_400_000;

/** Parse to a local calendar date at midnight, ignoring time-of-day and timezone drift. */
export const toLocalDay = (input: string | Date): Date => {
  if (typeof input === 'string') {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(input);
    if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  }
  const d = new Date(input);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const daysBetweenInclusive = (a: Date, b: Date) =>
  Math.round((toLocalDay(b).getTime() - toLocalDay(a).getTime()) / DAY_MS) + 1;

export const getSeasonForDate = (input: string | Date): { season: SeasonName; seasonYear: number } => {
  const d = toLocalDay(input);
  const month = d.getMonth(); // 0-11
  const year = d.getFullYear();
  if (month === 11) return { season: 'Winter', seasonYear: year + 1 };
  if (month <= 1) return { season: 'Winter', seasonYear: year };
  if (month <= 4) return { season: 'Spring', seasonYear: year };
  if (month <= 7) return { season: 'Summer', seasonYear: year };
  return { season: 'Autumn', seasonYear: year };
};

export const getSeasonRange = (season: SeasonName, seasonYear: number): { start: Date; end: Date } => {
  switch (season) {
    case 'Winter':
      // Day 0 of March is the last day of February, so leap years work.
      return { start: new Date(seasonYear - 1, 11, 1), end: new Date(seasonYear, 2, 0) };
    case 'Spring':
      return { start: new Date(seasonYear, 2, 1), end: new Date(seasonYear, 4, 31) };
    case 'Summer':
      return { start: new Date(seasonYear, 5, 1), end: new Date(seasonYear, 7, 31) };
    case 'Autumn':
      return { start: new Date(seasonYear, 8, 1), end: new Date(seasonYear, 10, 30) };
  }
};

/** "2026" for most seasons, "2025/26" for the winter that spans the new year. */
export const formatSeasonYear = (season: SeasonName, seasonYear: number): string =>
  season === 'Winter' ? `${seasonYear - 1}/${String(seasonYear).slice(-2)}` : String(seasonYear);

// Fixed three-letter months: newer ICU data renders September as "Sept" in en-GB.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthYear = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

/** "Dec 2025 – Feb 2026" */
export const formatSeasonRange = (season: SeasonName, seasonYear: number): string => {
  const { start, end } = getSeasonRange(season, seasonYear);
  return `${monthYear(start)} – ${monthYear(end)}`;
};

/**
 * Group points into season-years. Returns every season-year between the first
 * and last data point, each with all four seasons in chronological order.
 */
export const buildSeasonYears = (
  points: SeasonPoint[],
  today: Date = new Date(),
): Map<number, SeasonBucket[]> => {
  const valid = points.filter(p => p && p.date && !Number.isNaN(toLocalDay(p.date).getTime()));
  const result = new Map<number, SeasonBucket[]>();
  if (valid.length === 0) return result;

  const days = valid.map(p => toLocalDay(p.date).getTime());
  const firstDay = new Date(Math.min(...days));
  const lastDay = new Date(Math.max(...days));
  const todayDay = toLocalDay(today);
  const firstYear = getSeasonForDate(firstDay).seasonYear;
  const lastYear = getSeasonForDate(lastDay).seasonYear;

  const sums = new Map<string, { total: number; cost: number; hasCost: boolean; entries: number }>();
  for (const p of valid) {
    const { season, seasonYear } = getSeasonForDate(p.date);
    const key = `${seasonYear}-${season}`;
    const s = sums.get(key) ?? { total: 0, cost: 0, hasCost: false, entries: 0 };
    s.total += Number(p.value) || 0;
    if (p.cost !== undefined && p.cost !== null) {
      s.cost += Number(p.cost) || 0;
      s.hasCost = true;
    }
    s.entries += 1;
    sums.set(key, s);
  }

  for (let year = firstYear; year <= lastYear; year++) {
    result.set(
      year,
      SEASON_ORDER.map(season => {
        const { start, end } = getSeasonRange(season, year);
        const s = sums.get(`${year}-${season}`);
        const coverStart = start > firstDay ? start : firstDay;
        const coverEnd = end < lastDay ? end : lastDay;
        const daysCovered = s && coverEnd >= coverStart ? daysBetweenInclusive(coverStart, coverEnd) : 0;
        return {
          season,
          seasonYear: year,
          start,
          end,
          total: s?.total ?? 0,
          cost: s?.cost ?? 0,
          hasCost: s?.hasCost ?? false,
          daysCovered,
          daysInSeason: daysBetweenInclusive(start, end),
          avgPerDay: daysCovered > 0 ? (s?.total ?? 0) / daysCovered : 0,
          entries: s?.entries ?? 0,
          inProgress: todayDay >= start && todayDay <= end,
          hasData: Boolean(s),
        };
      }),
    );
  }
  return result;
};

/**
 * Change from previous to current, in percent. Returns null when there is
 * nothing fair to compare against.
 */
export const percentChange = (current: number, previous: number): number | null => {
  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous <= 0) return null;
  return ((current - previous) / previous) * 100;
};
