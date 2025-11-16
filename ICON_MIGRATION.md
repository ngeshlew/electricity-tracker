# Icon Migration Documentation - Basicons HTML Script Implementation

This document tracks all icons used in the codebase and their Basicons equivalents.

## Basicons Implementation

Basicons uses an HTML script embed approach:
- **Script**: `<script async src="https://basicons.xyz/embed.js"></script>` (added to `index.html` `<head>`)
- **Format**: `<i class="bsc-{icon-name}"></i>`
- **Documentation**: https://basicons.xyz/
- **React Package**: https://github.com/PreciousME/react-basicons

## Icon Usage Inventory

### Authentication & User Interface
- `lightning-energy` → `bsc-lightning-energy` - App logo/brand icon
- `bolt` → `bsc-lightning-energy` - Bolt/energy icon (alias)
- `mail-email-message-inbox` → `bsc-mail-email-message-inbox` - Email input icon
- `lock-privacy` → `bsc-lock-privacy` - Password/lock icon
- `eye-password` → `bsc-eye-password` - Show password icon
- `eye-password-off` → `bsc-eye-password-off` - Hide password icon
- `alert-error` → `bsc-alert-error` - Error alert icon
- `loading-spinner` → `bsc-loading-spinner` - Loading spinner icon
- `account-user-person` → `bsc-account-user-person` - User account icon
- `logout-exit` → `bsc-logout-exit` - Logout icon
- `enter-log-in-arrow` → `bsc-enter-log-in-arrow` - Login icon

### Navigation & UI Controls
- `home-house` → `bsc-home-house` - Home/Dashboard icon
- `book-note-paper` → `bsc-book-note-paper` - Statements/Book icon
- `notification-bell-alarm` → `bsc-notification-bell-alarm` - Notifications icon
- `adjust-settings-horizontal` → `bsc-adjust-settings-horizontal` - Settings icon
- `menu-hambuger` → `bsc-menu` - Menu/hamburger icon
- `x-close-delete` → `bsc-x-close-delete` - Close/delete icon
- `arrow-chevron-down` → `bsc-chevron-down` - Chevron down
- `arrow-chevron-up` → `bsc-chevron-up` - Chevron up
- `arrow-chevron-left` → `bsc-arrow-chevron-left` - Chevron left
- `arrow-chevron-right` → `bsc-arrow-chevron-right` - Chevron right
- `arrow-up` → `bsc-arrow-up` - Arrow up
- `arrow-down` → `bsc-arrow-down` - Arrow down
- `arrow-left` → `bsc-arrow-left` - Arrow left
- `arrow-right` → `bsc-arrow-right` - Arrow right
- `arrow-bottom-left` → `bsc-arrow-bottom-left` - Arrow bottom left
- `arrow-bottom-right` → `bsc-arrow-bottom-right` - Arrow bottom right

### Data & Analytics
- `bar-chart` → `bsc-bar-chart` - Bar chart icon
- `pie-chart` → `bsc-pie-chart` - Pie chart icon
- `activity-graph` → `bsc-activity-graph` - Activity/trend graph icon
- `target` → `bsc-target` - Target/goal icon
- `trending-up` → `bsc-trending-up` - Trending up icon
- `trending-down` → `bsc-trending-down` - Trending down icon
- `chart-up-arrow` → `bsc-chart-up-arrow` - Chart with up arrow

### Actions & Operations
- `add-new-plus` → `bsc-add-new-plus` - Add/plus icon
- `edit-write` → `bsc-edit-write` - Edit icon
- `trash-delete-bin-3` → `bsc-trash-delete-bin-3` - Delete/trash icon
- `save` → `bsc-save` - Save icon
- `download` → `bsc-download` - Download icon
- `upload-arrow-up` → `bsc-upload-arrow-up` - Upload icon
- `check-circle-2` → `bsc-check-circle-2` - Check/success icon
- `check-good` → `bsc-check-good` - Check mark icon

### Calendar & Time
- `calendar-date-appointment` → `bsc-calendar-date-appointment` - Calendar icon
- `calendar-month-date` → `bsc-calendar-month-date` - Calendar month icon
- `clock-time` → `bsc-clock-time` - Clock icon
- `clock-refresh-time-arrow` → `bsc-clock-refresh-time-arrow` - Refresh/time icon

### Information & Help
- `info` → `bsc-info` - Information icon
- `help-question-mark` → `bsc-help-question-mark` - Help/question icon
- `book-open` → `bsc-book-open` - Book open icon (documentation)

### Devices & Platforms
- `desktop-computer-mac` → `bsc-desktop-computer-mac` - Desktop computer icon
- `mobile-phone` → `bsc-mobile-phone` - Mobile phone icon

### Other
- `maximize-expand` → `bsc-maximize-expand` - Maximize/expand icon
- `more-horizontal` → `bsc-more-horizontal` - More options icon
- `search` → `bsc-search` - Search icon
- `filter` → `bsc-filter` - Filter icon
- `panel-left` → `bsc-panel-left` - Sidebar/panel icon
- `circle-oval` → `bsc-circle-oval` - Circle icon
- `snowflakes-weather-cold` → `bsc-snowflakes-weather-cold` - Snowflake icon (winter season)
- `droplet-rain-weather` → `bsc-droplet-rain-weather` - Rain/water icon
- `flower-plant` → `bsc-flower-plant` - Plant/flower icon
- `sun-day` → `bsc-sun-day` - Sun icon
- `moon-night` → `bsc-moon-night` - Moon icon
- `calculator-compute-math` → `bsc-calculator-compute-math` - Calculator icon
- `dollar-currency` → `bsc-dollar-currency` - Dollar currency icon
- `dollar-sign` → `bsc-dollar-sign` - Dollar sign icon
- `comment-square-chat-message` → `bsc-comment-square-chat-message` - Comment/message icon
- `send-message-dm-inbox` → `bsc-send-message-dm-inbox` - Send message icon
- `table-panel-window-sidebar` → `bsc-table-panel-window-sidebar` - Layout/panel icon
- `zap-light-energy` → `bsc-zap-light-energy` - Zap/energy icon

## Complete Icon Name Mapping

| Internal Name | Basicons Class | Notes |
|--------------|----------------|-------|
| account-user-person | bsc-account-user-person | User account |
| activity-graph | bsc-activity-graph | Activity/trend |
| add-new-plus | bsc-add-new-plus | Add/plus |
| adjust-settings-horizontal | bsc-adjust-settings-horizontal | Settings |
| alert-error | bsc-alert-error | Error alert |
| arrow-chevron-down | bsc-chevron-down | Chevron down |
| arrow-chevron-left | bsc-arrow-chevron-left | Chevron left |
| arrow-chevron-right | bsc-arrow-chevron-right | Chevron right |
| arrow-chevron-up | bsc-chevron-up | Chevron up |
| arrow-down | bsc-arrow-down | Arrow down |
| arrow-left | bsc-arrow-left | Arrow left |
| arrow-up | bsc-arrow-up | Arrow up |
| arrow-right | bsc-arrow-right | Arrow right |
| arrow-bottom-left | bsc-arrow-bottom-left | Arrow bottom left |
| arrow-bottom-right | bsc-arrow-bottom-right | Arrow bottom right |
| bar-chart | bsc-bar-chart | Bar chart |
| book-note-paper | bsc-book-note-paper | Book/document |
| book-open | bsc-book-open | Book open |
| bolt | bsc-lightning-energy | Bolt (alias) |
| calendar-date-appointment | bsc-calendar-date-appointment | Calendar |
| calendar-month-date | bsc-calendar-month-date | Calendar month |
| calculator-compute-math | bsc-calculator-compute-math | Calculator |
| chart-up-arrow | bsc-chart-up-arrow | Chart with up arrow |
| check-circle-2 | bsc-check-circle-2 | Success check |
| check-good | bsc-check-good | Check mark |
| circle-oval | bsc-circle-oval | Circle |
| clock-refresh-time-arrow | bsc-clock-refresh-time-arrow | Refresh |
| clock-time | bsc-clock-time | Clock |
| comment-square-chat-message | bsc-comment-square-chat-message | Comment |
| desktop-computer-mac | bsc-desktop-computer-mac | Desktop |
| dollar-currency | bsc-dollar-currency | Dollar |
| dollar-sign | bsc-dollar-sign | Dollar sign |
| download | bsc-download | Download |
| droplet-rain-weather | bsc-droplet-rain-weather | Rain/water |
| edit-write | bsc-edit-write | Edit |
| enter-log-in-arrow | bsc-enter-log-in-arrow | Login |
| eye-password | bsc-eye-password | Show password |
| eye-password-off | bsc-eye-password-off | Hide password |
| filter | bsc-filter | Filter |
| flower-plant | bsc-flower-plant | Plant |
| help-question-mark | bsc-help-question-mark | Help |
| home-house | bsc-home-house | Home |
| info | bsc-info | Info |
| lightning-energy | bsc-lightning-energy | Energy/bolt |
| loading-spinner | bsc-loading-spinner | Loading |
| lock-privacy | bsc-lock-privacy | Lock |
| logout-exit | bsc-logout-exit | Logout |
| mail-email-message-inbox | bsc-mail-email-message-inbox | Email |
| maximize-expand | bsc-maximize-expand | Maximize |
| menu-hambuger | bsc-menu | Menu |
| mobile-phone | bsc-mobile-phone | Mobile |
| moon-night | bsc-moon-night | Moon |
| more-horizontal | bsc-more-horizontal | More options |
| notification-bell-alarm | bsc-notification-bell-alarm | Notifications |
| panel-left | bsc-panel-left | Sidebar |
| pie-chart | bsc-pie-chart | Pie chart |
| save | bsc-save | Save |
| search | bsc-search | Search |
| send-message-dm-inbox | bsc-send-message-dm-inbox | Send message |
| snowflakes-weather-cold | bsc-snowflakes-weather-cold | Snowflake |
| sun-day | bsc-sun-day | Sun |
| table-panel-window-sidebar | bsc-table-panel-window-sidebar | Layout |
| target | bsc-target | Target |
| trash-delete-bin-3 | bsc-trash-delete-bin-3 | Delete |
| trending-down | bsc-trending-down | Trend down |
| trending-up | bsc-trending-up | Trend up |
| upload-arrow-up | bsc-upload-arrow-up | Upload |
| x-close-delete | bsc-x-close-delete | Close |
| zap-light-energy | bsc-zap-light-energy | Zap/energy |

## Files Updated
1. `index.html` - Added Basicons embed script
2. `src/components/ui/icon.tsx` - Updated to use Basicons CSS classes
3. All component files using `<Icon name="..." />` - No changes needed (Icon component handles mapping)

## Basicons Resources
- Website: https://basicons.xyz/
- Embed Script: `https://basicons.xyz/embed.js`
- React Package: https://github.com/PreciousME/react-basicons
- Format: `<i class="bsc-{icon-name}"></i>`

## Implementation Notes

1. **Async Script Loading**: The embed script loads asynchronously, so icons may not render immediately on first page load. The script will load in the background.

2. **Icon Name Mapping**: All internal icon names are mapped to Basicons class names using the `bsc-` prefix followed by the icon name in kebab-case.

3. **Fallback Strategy**: The Icon component includes a fallback mechanism for unmapped icons to prevent broken UI. In development mode, it shows a help icon; in production, it returns null.

4. **Local SVG Files**: The `src/icons/` directory contains Basicons SVG files that match the naming conventions used in the mapping.
