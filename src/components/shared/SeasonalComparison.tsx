/**
 * SeasonalComparison
 *
 * Shared across the electricity, water and fuel trackers. Keep this file
 * identical in all three repos (see docs/design-system/README.md); each app
 * passes its own points and units through a thin adapter.
 *
 * - Year stepper: flips between season-years without touching the rest of the dashboard.
 * - Compare switch: pairs each season with the same season a year earlier.
 *   Last year's bar is outlined and this year's is solid, so the two never
 *   rely on color alone.
 * - Deltas compare the daily average, so a season still in progress is
 *   compared fairly with a complete one.
 */
import React, { useEffect, useId, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Icon } from '@/components/ui/icon';
import {
  buildSeasonYears,
  formatSeasonRange,
  formatSeasonYear,
  percentChange,
  type SeasonBucket,
  type SeasonName,
  type SeasonPoint,
} from '@/utils/seasons';

const SEASON_COLOR: Record<SeasonName, string> = {
  Winter: 'var(--color-season-winter)',
  Spring: 'var(--color-season-spring)',
  Summer: 'var(--color-season-summer)',
  Autumn: 'var(--color-season-autumn)',
};

const SEASON_ICON: Record<SeasonName, string> = {
  Winter: 'snowflakes-weather-cold',
  Spring: 'flower-plant',
  Summer: 'sun-day',
  Autumn: 'droplet-rain-weather',
};

export interface SeasonalComparisonProps {
  points: SeasonPoint[];
  title: string;
  description: string;
  /** Short unit shown after values, e.g. "kWh", "L", "miles". */
  unit: string;
  /** Unit for the daily average, e.g. "kWh/day". */
  perDayUnit: string;
  decimals?: number;
  isLoading?: boolean;
  /** Hide the cost row, e.g. for mileage. */
  showCost?: boolean;
  currency?: string;
  emptyMessage?: string;
}

const usePrefersReducedMotion = () => {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia?.(query).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia?.(query);
    if (!mql) return;
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener?.('change', onChange);
    return () => mql.removeEventListener?.('change', onChange);
  }, []);
  return reduced;
};

export const SeasonalComparison: React.FC<SeasonalComparisonProps> = ({
  points,
  title,
  description,
  unit,
  perDayUnit,
  decimals = 1,
  isLoading = false,
  showCost = true,
  currency = 'GBP',
  emptyMessage = 'Add readings to see how your usage changes through the year.',
}) => {
  const headingId = useId();
  const compareId = useId();
  const reducedMotion = usePrefersReducedMotion();

  const seasonYears = useMemo(() => buildSeasonYears(points), [points]);
  const years = useMemo(() => [...seasonYears.keys()].sort((a, b) => a - b), [seasonYears]);
  const latestYear = years[years.length - 1];

  const [selectedYear, setSelectedYear] = useState<number | undefined>(latestYear);
  const [compare, setCompare] = useState(false);

  // Follow the newest year when data first arrives or the selection falls out of range.
  useEffect(() => {
    if (selectedYear === undefined || !seasonYears.has(selectedYear)) setSelectedYear(latestYear);
  }, [latestYear, seasonYears, selectedYear]);

  const year = selectedYear !== undefined && seasonYears.has(selectedYear) ? selectedYear : latestYear;
  const current = year !== undefined ? seasonYears.get(year) ?? [] : [];
  const previous = year !== undefined ? seasonYears.get(year - 1) : undefined;
  const canCompare = Boolean(previous?.some(b => b.hasData));
  const comparing = compare && canCompare;
  const yearIndex = year !== undefined ? years.indexOf(year) : -1;

  const number = useMemo(
    () => new Intl.NumberFormat('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
    [decimals],
  );
  const money = useMemo(
    () => new Intl.NumberFormat('en-GB', { style: 'currency', currency }),
    [currency],
  );
  const percent = useMemo(() => new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }), []);

  const chartData = current.map((bucket, i) => ({
    season: bucket.season,
    current: bucket.hasData ? bucket.total : null,
    previous: previous?.[i]?.hasData ? previous[i].total : null,
    bucket,
    previousBucket: previous?.[i],
  }));

  const header = (
    <CardHeader className="p-0">
      <CardTitle id={headingId} className="text-lg font-normal uppercase tracking-wide">
        {title}
      </CardTitle>
      <CardDescription className="text-xs uppercase tracking-wider text-muted-foreground">
        {description}
      </CardDescription>
    </CardHeader>
  );

  if (isLoading && points.length === 0) {
    return (
      <Card className="bg-transparent border-dotted w-full p-4 sm:p-6" aria-busy="true">
        {header}
        <div className="mt-6 h-64 sm:h-80 bg-muted motion-safe:animate-pulse" />
      </Card>
    );
  }

  if (year === undefined) {
    return (
      <Card className="bg-transparent border-dotted w-full p-4 sm:p-6">
        {header}
        <div className="py-10 text-center space-y-1">
          <p className="text-sm">No seasonal data yet</p>
          <p className="text-xs text-muted-foreground text-pretty max-w-sm mx-auto">{emptyMessage}</p>
        </div>
      </Card>
    );
  }

  const SeasonTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: (typeof chartData)[number] }> }) => {
    if (!active || !payload?.length) return null;
    const row = payload[0].payload;
    const lines: Array<[string, number | null]> = [[formatSeasonYear(row.season, row.bucket.seasonYear), row.current]];
    if (comparing && row.previousBucket) {
      lines.push([formatSeasonYear(row.season, row.previousBucket.seasonYear), row.previous]);
    }
    return (
      <div className="bg-background border border-border p-3 text-xs space-y-1 shadow-sm">
        <p className="uppercase tracking-wider">{row.season}</p>
        {lines.map(([label, value]) => (
          <p key={label} className="text-muted-foreground tabular-nums">
            {label}: {value === null ? 'No readings' : `${number.format(value)} ${unit}`}
          </p>
        ))}
      </div>
    );
  };

  return (
    <section aria-labelledby={headingId} className="space-y-4 w-full">
      <Card className="bg-transparent border-dotted w-full p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {header}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {/* aria-disabled, not disabled: reaching the first or last year must not drop keyboard focus. */}
            <div className="flex items-center gap-1" role="group" aria-label="Season year">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 aria-disabled:opacity-40 aria-disabled:cursor-not-allowed"
                onClick={() => yearIndex > 0 && setSelectedYear(years[yearIndex - 1])}
                aria-disabled={yearIndex <= 0}
                aria-label={yearIndex > 0 ? `Show ${years[yearIndex - 1]}` : 'No earlier year'}
              >
                <Icon name="arrow-chevron-left" className="h-4 w-4" />
              </Button>
              <span className="text-sm min-w-[4ch] text-center tabular-nums" aria-live="polite">
                {year}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 aria-disabled:opacity-40 aria-disabled:cursor-not-allowed"
                onClick={() => yearIndex < years.length - 1 && setSelectedYear(years[yearIndex + 1])}
                aria-disabled={yearIndex >= years.length - 1}
                aria-label={yearIndex < years.length - 1 ? `Show ${years[yearIndex + 1]}` : 'No later year'}
              >
                <Icon name="arrow-chevron-right" className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id={compareId}
                checked={comparing}
                onCheckedChange={setCompare}
                disabled={!canCompare}
                aria-describedby={canCompare ? undefined : `${compareId}-hint`}
              />
              <Label
                htmlFor={compareId}
                className={canCompare ? 'text-sm cursor-pointer' : 'text-sm text-muted-foreground cursor-not-allowed'}
              >
                Compare with {year - 1}
              </Label>
              {!canCompare && (
                <span id={`${compareId}-hint`} className="sr-only">
                  No readings from {year - 1} yet
                </span>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-0 pt-6">
          {comparing && (
            <ul className="flex flex-wrap gap-x-6 gap-y-1 mb-3 text-xs text-muted-foreground" aria-label="Chart key">
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="inline-block h-3 w-3 bg-foreground" />
                {year} (solid)
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="inline-block h-3 w-3 border border-dashed border-foreground" />
                {year - 1} (outlined)
              </li>
            </ul>
          )}
          <div className="h-64 sm:h-80" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                barGap={4}
                margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
                // The cards below carry every value as text, so the chart stays out of the tab order.
                accessibilityLayer={false}
              >
                <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="season"
                  tick={{ fontSize: 12, fontFamily: 'var(--font-mono)', fill: 'hsl(var(--foreground))' }}
                  stroke="hsl(var(--border))"
                  tickLine={false}
                />
                <YAxis
                  width={48}
                  tick={{ fontSize: 12, fontFamily: 'var(--font-mono)', fill: 'hsl(var(--muted-foreground))' }}
                  stroke="hsl(var(--border))"
                  tickLine={false}
                  tickFormatter={(v: number) => new Intl.NumberFormat('en-GB', { notation: 'compact' }).format(v)}
                />
                <Tooltip content={<SeasonTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
                {comparing && (
                  // Foreground outline, not the season color: a yellow outline on white
                  // would fail 3:1 and make last year's Summer bar disappear.
                  <Bar
                    dataKey="previous"
                    isAnimationActive={!reducedMotion}
                    stroke="hsl(var(--foreground))"
                    strokeWidth={1}
                    strokeDasharray="4 3"
                  >
                    {chartData.map(row => (
                      <Cell key={`prev-${row.season}`} fill={SEASON_COLOR[row.season]} fillOpacity={0.2} />
                    ))}
                  </Bar>
                )}
                <Bar dataKey="current" isAnimationActive={!reducedMotion}>
                  {chartData.map(row => (
                    <Cell key={`cur-${row.season}`} fill={SEASON_COLOR[row.season]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <ul className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4" aria-label={`Seasons in ${year}`}>
        {current.map((bucket, i) => (
          <SeasonCard
            key={bucket.season}
            bucket={bucket}
            previous={comparing ? previous?.[i] : undefined}
            unit={unit}
            perDayUnit={perDayUnit}
            showCost={showCost}
            formatNumber={v => number.format(v)}
            formatMoney={v => money.format(v)}
            formatPercent={v => percent.format(v)}
          />
        ))}
      </ul>
    </section>
  );
};

interface SeasonCardProps {
  bucket: SeasonBucket;
  previous?: SeasonBucket;
  unit: string;
  perDayUnit: string;
  showCost: boolean;
  formatNumber: (v: number) => string;
  formatMoney: (v: number) => string;
  formatPercent: (v: number) => string;
}

const SeasonCard: React.FC<SeasonCardProps> = ({
  bucket,
  previous,
  unit,
  perDayUnit,
  showCost,
  formatNumber,
  formatMoney,
  formatPercent,
}) => {
  const color = SEASON_COLOR[bucket.season];
  const yearLabel = formatSeasonYear(bucket.season, bucket.seasonYear);
  const prevLabel = previous ? formatSeasonYear(previous.season, previous.seasonYear) : '';
  const change =
    previous?.hasData && bucket.hasData ? percentChange(bucket.avgPerDay, previous.avgPerDay) : null;
  const direction = change === null ? null : Math.abs(change) < 0.5 ? 'same' : change > 0 ? 'up' : 'down';

  return (
    <li className="relative border border-dotted p-4 space-y-4">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5" style={{ backgroundColor: color }} />
      <div className="space-y-1">
        <h3 className="flex items-center gap-2 text-xs uppercase tracking-wider">
          <Icon name={SEASON_ICON[bucket.season]} className="h-4 w-4 shrink-0" style={{ color }} aria-hidden="true" />
          {bucket.season} <span className="text-muted-foreground tabular-nums">{yearLabel}</span>
        </h3>
        <p className="text-xs text-muted-foreground">
          {formatSeasonRange(bucket.season, bucket.seasonYear)}
          {bucket.inProgress && <span className="text-foreground"> · In progress</span>}
        </p>
      </div>

      {bucket.hasData ? (
        <>
          <div className="space-y-1">
            <p className="text-3xl leading-none tabular-nums">
              {formatNumber(bucket.total)}
              <span className="text-sm text-muted-foreground"> {unit}</span>
            </p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Total</p>
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {showCost && bucket.hasCost && (
              <div className="space-y-0.5">
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Cost</dt>
                <dd className="tabular-nums">{formatMoney(bucket.cost)}</dd>
              </div>
            )}
            <div className="space-y-0.5">
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Daily avg</dt>
              <dd className="tabular-nums whitespace-nowrap">
                {formatNumber(bucket.avgPerDay)} {perDayUnit}
              </dd>
            </div>
            <div className="space-y-0.5">
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Days recorded</dt>
              <dd className="tabular-nums">
                {bucket.daysCovered}
                <span className="text-muted-foreground"> of {bucket.daysInSeason}</span>
              </dd>
            </div>
          </dl>
        </>
      ) : (
        <p className="text-sm text-muted-foreground py-2">No readings for this season</p>
      )}

      {previous && (
        <div className="border-t border-dotted pt-3 space-y-1 text-sm">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {bucket.season} {prevLabel}
          </p>
          {previous.hasData ? (
            <p className="tabular-nums">
              {formatNumber(previous.total)} {unit}
              <span className="text-muted-foreground"> · {formatNumber(previous.avgPerDay)} {perDayUnit}</span>
            </p>
          ) : (
            <p className="text-muted-foreground">No readings</p>
          )}
          {direction && change !== null && (
            <p className="flex items-center gap-1 tabular-nums">
              {direction !== 'same' && (
                <Icon name={direction === 'up' ? 'arrow-up' : 'arrow-down'} className="h-3 w-3" aria-hidden="true" />
              )}
              {direction === 'same'
                ? `Same daily use as ${prevLabel}`
                : `${formatPercent(Math.abs(change))}% ${direction === 'up' ? 'more' : 'less'} per day than ${prevLabel}`}
            </p>
          )}
        </div>
      )}
    </li>
  );
};
