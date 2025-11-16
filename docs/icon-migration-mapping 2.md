# Icon Migration Mapping Document

This document maps all current icons (Lucide React and Heroicons) to their Basicons SVG equivalents.

## Icon Mapping Table

### Dashboard Components

| Current Icon (Library) | Basicons SVG | Notes |
|----------------------|--------------|-------|
| Activity (Lucide) | `activity-graph` | Activity/analytics icon |
| TrendingUp (Lucide) | `chart-up-arrow` | Upward trend |
| TrendingDown (Lucide) | `chart-down-arrow` or `arrow-down` | Downward trend |
| Target (Lucide) | `target` | Target/goal icon |
| Plus (Lucide) | `add-new-plus` | Add/create action |
| LogIn (Lucide) | `enter-log-in-arrow` | Login action |
| ChevronLeftIcon (Heroicons) | `arrow-chevron-left` | Left navigation |
| ChevronRightIcon (Heroicons) | `arrow-chevron-right` | Right navigation |
| HomeIcon (Heroicons) | `home-house` | Home/dashboard |
| ChartBarIcon (Heroicons) | `bar-chart` | Analytics/charts |
| DocumentTextIcon (Heroicons) | `document-text-file` or `book-note-paper` | Documents/text |
| Cog6ToothIcon (Heroicons) | `adjust-settings-horizontal` | Settings |
| BellIcon (Heroicons) | `bell-notification` or `bell-alarm` | Notifications |
| PieChart (Lucide) | `pie-chart` | Pie chart visualization |
| HelpCircle (Lucide) | `help-question-mark` | Help/info |
| Snowflake (Lucide) | `snowflake-weather` or similar | Winter season |
| Sun (Lucide) | `sun-day` | Summer season |
| Leaf (Lucide) | `leaf-plant` or `flower-plant` | Spring season |
| CloudRain (Lucide) | `droplet-rain-weather` | Autumn season |
| Zap (Lucide) | `lightning-energy` | Energy/electricity |

### Meter Reading Components

| Current Icon (Library) | Basicons SVG | Notes |
|----------------------|--------------|-------|
| Eye (Lucide) | `eye-password` | View/eye icon |
| Pencil (Lucide) | `edit-write` | Edit action |
| Trash2 (Lucide) | `trash-delete-bin-3` | Delete action |
| X (Lucide) | `x-close-delete` | Close/cancel |
| MoreHorizontal (Lucide) | `more-horizontal` or `menu-hambuger` | More options |
| Search (Lucide) | `search` | Search functionality |
| Filter (Lucide) | `filter` | Filter options |
| Download (Lucide) | `download` | Download/export |
| CalendarIcon (Lucide) | `calendar-date-appointment` | Calendar/date picker |

### Mobile Components

| Current Icon (Library) | Basicons SVG | Notes |
|----------------------|--------------|-------|
| Bars3Icon (Heroicons) | `menu-hambuger` | Hamburger menu |
| User (Lucide) | `account-user-person` | User profile |
| Settings (Lucide) | `adjust-settings-horizontal` | Settings |
| LogOut (Lucide) | `logout-exit` | Logout action |
| Bell (Lucide) | `bell-notification` | Notifications |
| Shield (Lucide) | `shield-security` or similar | Security |
| Calendar (Lucide) | `calendar-date-appointment` | Calendar |

### UI Components

| Current Icon (Library) | Basicons SVG | Notes |
|----------------------|--------------|-------|
| PanelLeft (Lucide) | `panel-sidebar-left` or similar | Sidebar toggle |
| ChevronDown (Lucide) | `arrow-chevron-down` | Dropdown indicator |
| ChevronUp (Lucide) | `arrow-chevron-up` | Collapse indicator |
| ChevronRight (Lucide) | `arrow-chevron-right` | Right navigation |
| Check (Lucide) | `check-good` | Checkmark |
| Circle (Lucide) | `circle-oval` | Circle/radio button |

### Other Components

| Current Icon (Library) | Basicons SVG | Notes |
|----------------------|--------------|-------|
| Upload (Lucide) | `upload-arrow-up` | Upload action |
| FileText (Lucide) | `document-text-file` or `book-note-paper` | File/document |
| Monitor (Lucide) | `monitor-desktop` or `desktop-computer-mac` | Desktop/monitor |
| Moon (Lucide) | `moon-night` | Dark mode |
| Sun (Lucide) | `sun-day` | Light mode |
| DollarSign (Lucide) | `dollar-currency` | Currency/money |
| ExclamationTriangleIcon (Heroicons) | `alert-triangle-warning` or `alert-error` | Warning/error |
| ArrowPathIcon (Heroicons) | `clock-refresh-time-arrow` | Refresh/reload |
| Brain (Lucide) | `brain-mind` or similar | AI/insights |
| MessageSquare (Lucide) | `comment-square-chat-message` | Chat/message |
| Sparkles (Lucide) | `sparkles-magic` or similar | Magic/sparkles |
| Tablet (Lucide) | `tablet-device` | Tablet device |
| Smartphone (Lucide) | `mobile-phone` | Mobile device |
| Fullscreen (Lucide) | `maximize-expand` | Fullscreen |
| RotateCw (Lucide) | `rotate-refresh` or `clock-refresh-time-arrow` | Rotate/refresh |

## Icon Naming Conventions

- Basicons use kebab-case naming: `add-new-plus.svg`
- All icons are 24x24 viewBox
- Icons use `stroke="black"` by default (needs dynamic color handling)
- Icons use `stroke-width="2"` by default

## Missing Icons

If an icon doesn't have a direct Basicons equivalent, we'll need to:
1. Find the closest alternative
2. Use a generic icon (e.g., `info` for help)
3. Create a custom SVG if absolutely necessary

## Implementation Strategy

1. Create Icon component wrapper that:
   - Accepts icon name as string prop
   - Dynamically imports SVG
   - Handles color via `currentColor` or prop
   - Supports size via className or props

2. Replace all icon imports systematically:
   - Dashboard components first
   - Meter reading components
   - Mobile components
   - UI components
   - Other components

3. Remove old dependencies after verification

