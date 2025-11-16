# Icon Migration: Move to Heroicons

We are standardizing on Heroicons for all icons across the app.

- Library: `@heroicons/react` (Outline, 24px)
- Source: https://heroicons.com/
- License: MIT

## Current Approach

- The shared `Icon` component now prefers Heroicons when a name is recognized, and falls back to existing local SVGs to avoid breaking changes during migration.
- Over time, we will map remaining names to Heroicons equivalents and remove local SVGs.

## Common Name Mappings (App → Heroicons)

| App name | Heroicons component |
|---|---|
| `arrow-up` | `ArrowUpIcon` |
| `arrow-down` | `ArrowDownIcon` |
| `arrow-left` | `ArrowLeftIcon` |
| `arrow-right` | `ArrowRightIcon` |
| `arrow-chevron-left` | `ChevronLeftIcon` |
| `arrow-chevron-right` | `ChevronRightIcon` |
| `arrow-chevron-up` | `ChevronUpIcon` |
| `arrow-chevron-down` | `ChevronDownIcon` |
| `upload-arrow-up` | `ArrowUpTrayIcon` |
| `download` | `ArrowDownTrayIcon` |
| `chart-up-arrow` | `ArrowTrendingUpIcon` |
| `trending-up` | `ArrowTrendingUpIcon` |
| `trending-down` | `ArrowTrendingDownIcon` |
| `enter-log-in-arrow` | `ArrowRightStartOnRectangleIcon` |
| `logout-exit` | `ArrowLeftStartOnRectangleIcon` |
| `x-close-delete` | `XMarkIcon` |
| `check-circle-2` | `CheckCircleIcon` |
| `edit-write` | `PencilSquareIcon` |
| `add-new-plus` | `PlusIcon` |
| `trash-delete-bin-3` | `TrashIcon` |
| `save` | `CloudArrowDownIcon` |
| `menu-hambuger` | `Bars3Icon` |
| `more-horizontal` | `EllipsisHorizontalIcon` |
| `notification-bell-alarm` | `BellIcon` |
| `adjust-settings-horizontal` | `Cog6ToothIcon` |
| `calendar-date-appointment` | `CalendarDaysIcon` |
| `clock-time` | `ClockIcon` |
| `search` | `MagnifyingGlassIcon` |
| `help-question-mark` / `info` | `InformationCircleIcon` |
| `bar-chart` | `ChartBarIcon` |
| `pie-chart` | `ChartPieIcon` |
| `activity-graph` | `ArrowTrendingUpIcon` |
| `target` | `TargetIcon` |
| `sun-day` | `SunIcon` |
| `moon-night` | `MoonIcon` |
| `desktop-computer-mac` | `ComputerDesktopIcon` |
| `mobile-phone` | `DevicePhoneMobileIcon` |
| `lightning-energy` / `bolt` | `BoltIcon` |
| `home-house` | `HomeIcon` |
| `mail-email-message-inbox` | `EnvelopeIcon` |

If a name is not yet mapped to a Heroicon, it will temporarily fall back to our local SVG until we map it.

## Migration Steps

1. Use `<Icon name="..." />` everywhere to keep usage consistent.
2. Add new names to `heroIconMap` in `src/components/ui/icon.tsx`.
3. Gradually remove legacy SVG imports after confirming visual parity.
4. Prefer outline set (`@heroicons/react/24/outline`) for consistency.

## References

- Heroicons site: https://heroicons.com/
- NPM package: `@heroicons/react`

