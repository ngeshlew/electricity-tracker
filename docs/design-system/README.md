# Tracker design system

The electricity, water and fuel trackers are forks of one template. This file is
identical in all three repos and says which files must stay identical, which
tokens they share, and what is still drifting.

## Rule: shared files are copied byte-for-byte

Edit a shared file in one repo, then copy it to the other two in the same change.
Check with:

```sh
md5sum {electricity,water,fuel}-tracker/<path>
```

| File | What it is |
| --- | --- |
| `src/index.css` | Fonts, colour, type, spacing and motion tokens, plus the reduced-motion rules |
| `tailwind.config.js` | Maps tokens to Tailwind utilities |
| `src/components/ui/*.tsx` (except `icon.tsx`, `animated-sidebar.tsx`, `help-popover.tsx`) | shadcn/Radix primitives |
| `src/components/shared/SeasonalComparison.tsx` | Seasonal chart and cards with year stepper and compare switch |
| `src/utils/seasons.ts` + `seasons.test.ts` | Season-year bucketing |
| `docs/design-system/README.md` | This file |

App-specific code stays in thin adapters. For example, each app's `SeasonalTracker.tsx`
only maps its store data to `{ date, value, cost }` points.

## Tokens

All colour tokens are HSL triplets (`24 100% 38%`) because `tailwind.config.js`
wraps them as `hsl(var(--token))`. Never put `oklch()` or hex in these variables:
the result is invalid CSS and the colour silently disappears.

| Role | Token | Notes |
| --- | --- | --- |
| Status: bad / error | `--color-accent-red`, `--color-error` | `#CC0000`, 5.9:1 on white |
| Status: good | `--color-success` | `#007A00`, 5.6:1 |
| Status: warning | `--color-warning` | `#C2410C`, 5.2:1 |
| Seasons | `--color-season-{winter,spring,summer,autumn}` | Fills only. Never use for text or outlines: summer yellow is 1.4:1 on white |
| Type | `--text-xs` … `--text-3xl`, `--font-mono` | IBM Plex Mono throughout |
| Spacing | `--space-xs` (4px) … `--space-4xl` (96px) | |

Themes: `mono` (default), `light`, `dark`. No theme switcher is mounted today,
so `light` and `dark` are only reachable through `localStorage` or `system`.

## Patterns

- **Period stepper.** Use `‹ value ›` with ghost icon buttons labelled "Show 2025" or "Previous month".
  At either end, use `aria-disabled`, not `disabled`, so keyboard focus is not lost.
- **Seasons.** A season-year holds Winter (Dec–Feb, labelled `2025/26`), Spring,
  Summer and Autumn, always in that order. Never sort seasons by value.
- **Year-on-year.** Compare daily averages, so an in-progress season is compared
  fairly. Last year is outlined and this year solid, never colour alone.
- **Status.** Pair every status colour with an arrow, sign or word.
- **Charts.** When the same numbers appear as text nearby, hide the chart from
  assistive tech (`aria-hidden` plus `accessibilityLayer={false}`).
- **Filters.** Every `SelectTrigger` without a visible `<Label>` needs an `aria-label`.
- **Tabs.** Use one `<Tabs>` root around both `TabsList` and `TabsContent`.

## Component inventory (Oct 2026 audit)

| Component | Electricity | Water | Fuel | Status |
| --- | --- | --- | --- | --- |
| UI primitives (`ui/*`) | ✓ | ✓ | ✓ | Identical, except `icon.tsx` maps, `animated-sidebar`, `help-popover` |
| Seasonal comparison | ✓ | ✓ | ✓ (fuel + mileage) | Shared as of this change |
| Summary KPI cards | 1 col mobile | 2 col mobile | 1 col mobile | Diverged: pick one |
| Monthly stepper | `MonthSelector` | inline | `MonthSelector` | Extract to `shared/` |
| Consumption breakdown | Tabs fixed | Tabs fixed | Tabs fixed | Same logic, three copies: extract |
| Trend icon | `arrow-up/down` | `trending-up/down` | `trending-up/down` | Pick one |
| Mobile nav | 4 tabs | 3 tabs + floating AI button | 3 tabs | Diverged: see audit |
| Page title | "Dashboard" | "Water tracker" | "Fuel" | Diverged |
| Header primary action | "Add" | "Bills" | "Add" | Diverged |

## Clean-up backlog

- Delete Finder/iCloud duplicates such as `SeasonalTracker 2.tsx` and `icon 3.tsx`
  (electricity 53 code files, fuel 46, water 8, plus thousands of `src/icons/* N.svg`).
- Water still shows fuel copy, such as "Fuel Consumption Trend" in `ConsumptionChart.tsx`
  and "Fuel Efficiency" in `EfficiencyMetricsCard.tsx`.
- Replace `transition-all` (electricity 13, water 19, fuel 14) with named properties.
- `.font-normal` is forced to weight 300 globally. Below 18px it should be 400.
