# Icon Migration Documentation - Hexaicons to Lineicons

This document tracks all icons used in the codebase and their Lineicons equivalents.

## Icon Usage Inventory

### Authentication & User Interface
- `lightning-energy` → `lni-bolt` or `lni-bolt-alt` - App logo/brand icon
- `mail-email-message-inbox` → `lni-envelope` - Email input icon
- `lock-privacy` → `lni-lock` or `lni-lock-alt` - Password/lock icon
- `eye-password` → `lni-eye` - Show password icon
- `eye-password-off` → `lni-eye-alt` - Hide password icon
- `alert-error` → `lni-close-circle` or `lni-warning` - Error alert icon
- `loading-spinner` → `lni-spinner` or `lni-spinner-arrow` - Loading spinner icon
- `account-user-person` → `lni-user` - User account icon
- `logout-exit` → `lni-exit` or `lni-exit-up` - Logout icon
- `enter-log-in-arrow` → `lni-enter` or `lni-arrow-right` - Login icon

### Navigation & UI Controls
- `home-house` → `lni-home` - Home/Dashboard icon
- `book-note-paper` → `lni-book` or `lni-notepad` - Statements/Book icon
- `notification-bell-alarm` → `lni-bell` or `lni-alarm` - Notifications icon
- `adjust-settings-horizontal` → `lni-cog` or `lni-sliders` - Settings icon
- `menu-hambuger` → `lni-menu` - Menu/hamburger icon
- `x-close-delete` → `lni-close` - Close/delete icon
- `arrow-chevron-down` → `lni-chevron-down` - Chevron down
- `arrow-chevron-up` → `lni-chevron-up` - Chevron up
- `arrow-chevron-left` → `lni-chevron-left` - Chevron left
- `arrow-chevron-right` → `lni-chevron-right` - Chevron right
- `arrow-up` → `lni-arrow-up` - Arrow up
- `arrow-down` → `lni-arrow-down` - Arrow down
- `arrow-left` → `lni-arrow-left` - Arrow left
- `arrow-right` → `lni-arrow-right` - Arrow right

### Data & Analytics
- `bar-chart` → `lni-bar-chart` - Bar chart icon
- `pie-chart` → `lni-pie-chart` - Pie chart icon
- `activity-graph` → `lni-line-chart` or `lni-stats-up` - Activity/trend graph icon
- `target` → `lni-target` - Target/goal icon
- `trending-up` → `lni-arrow-up-circle` or `lni-stats-up` - Trending up icon
- `trending-down` → `lni-arrow-down-circle` or `lni-stats-down` - Trending down icon
- `chart-up-arrow` → `lni-line-chart` or `lni-stats-up` - Chart with up arrow

### Actions & Operations
- `add-new-plus` → `lni-plus` - Add/plus icon
- `edit-write` → `lni-pencil` or `lni-pencil-alt` - Edit icon
- `trash-delete-bin-3` → `lni-trash` or `lni-trash-can` - Delete/trash icon
- `save` → `lni-save` - Save icon
- `download` → `lni-download` - Download icon
- `upload-arrow-up` → `lni-upload` - Upload icon
- `check-circle-2` → `lni-checkmark-circle` - Check/success icon
- `check-good` → `lni-checkmark` - Check mark icon

### Calendar & Time
- `calendar-date-appointment` → `lni-calendar` - Calendar icon
- `calendar-month-date` → `lni-calendar` - Calendar month icon
- `clock-time` → `lni-clock` - Clock icon
- `clock-refresh-time-arrow` → `lni-reload` or `lni-spinner-arrow` - Refresh/time icon

### Information & Help
- `info` → `lni-information` or `lni-info` - Information icon
- `help-question-mark` → `lni-question-circle` or `lni-help` - Help/question icon
- `book-open` → `lni-book` - Book open icon (documentation)

### Devices & Platforms
- `desktop-computer-mac` → `lni-monitor` or `lni-desktop` - Desktop computer icon
- `mobile-phone` → `lni-mobile` or `lni-smartphone` - Mobile phone icon

### Other
- `bolt` → `lni-bolt` or `lni-bolt-alt` - Bolt/energy icon (alias for lightning-energy)
- `maximize-expand` → `lni-fullscreen` or `lni-arrows` - Maximize/expand icon
- `more-horizontal` → `lni-more-alt` or `lni-more` - More options icon
- `search` → `lni-search` or `lni-search-alt` - Search icon
- `filter` → `lni-filter` - Filter icon
- `panel-left` → `lni-panel` or `lni-layout` - Sidebar/panel icon
- `circle-oval` → `lni-circle` - Circle icon
- `snowflakes-weather-cold` → `lni-snowflake` - Snowflake icon (winter season)
- `droplet-rain-weather` → `lni-drop` or `lni-rain` - Rain/water icon
- `flower-plant` → `lni-flower` or `lni-leaf` - Plant/flower icon

## Lineicons Implementation

Lineicons uses CSS classes with the format: `<i class="lni lni-{icon-name}"></i>`

### Complete Icon Name Mapping

| Hexaicon Name | Lineicons Class | Notes |
|--------------|-----------------|-------|
| account-user-person | lni-user | User account |
| activity-graph | lni-line-chart | Activity/trend |
| add-new-plus | lni-plus | Add/plus |
| adjust-settings-horizontal | lni-cog | Settings |
| alert-error | lni-close-circle | Error alert |
| arrow-chevron-down | lni-chevron-down | Chevron down |
| arrow-chevron-left | lni-chevron-left | Chevron left |
| arrow-chevron-right | lni-chevron-right | Chevron right |
| arrow-chevron-up | lni-chevron-up | Chevron up |
| arrow-down | lni-arrow-down | Arrow down |
| arrow-left | lni-arrow-left | Arrow left |
| arrow-up | lni-arrow-up | Arrow up |
| arrow-right | lni-arrow-right | Arrow right |
| bar-chart | lni-bar-chart | Bar chart |
| book-note-paper | lni-book | Book/document |
| calendar-date-appointment | lni-calendar | Calendar |
| check-circle-2 | lni-checkmark-circle | Success check |
| check-good | lni-checkmark | Check mark |
| clock-refresh-time-arrow | lni-reload | Refresh |
| clock-time | lni-clock | Clock |
| desktop-computer-mac | lni-monitor | Desktop |
| download | lni-download | Download |
| edit-write | lni-pencil | Edit |
| enter-log-in-arrow | lni-enter | Login |
| eye-password | lni-eye | Show password |
| eye-password-off | lni-eye-alt | Hide password |
| help-question-mark | lni-question-circle | Help |
| home-house | lni-home | Home |
| info | lni-information | Info |
| lightning-energy | lni-bolt | Energy/bolt |
| bolt | lni-bolt | Bolt (alias) |
| loading-spinner | lni-spinner | Loading |
| lock-privacy | lni-lock | Lock |
| logout-exit | lni-exit | Logout |
| mail-email-message-inbox | lni-envelope | Email |
| maximize-expand | lni-fullscreen | Maximize |
| menu-hambuger | lni-menu | Menu |
| mobile-phone | lni-mobile | Mobile |
| more-horizontal | lni-more-alt | More options |
| notification-bell-alarm | lni-bell | Notifications |
| pie-chart | lni-pie-chart | Pie chart |
| search | lni-search | Search |
| target | lni-target | Target |
| trending-down | lni-arrow-down-circle | Trend down |
| trending-up | lni-arrow-up-circle | Trend up |
| trash-delete-bin-3 | lni-trash | Delete |
| upload-arrow-up | lni-upload | Upload |
| x-close-delete | lni-close | Close |
| snowflakes-weather-cold | lni-snowflake | Snowflake |
| droplet-rain-weather | lni-drop | Rain/water |
| flower-plant | lni-leaf | Plant |
| sun-day | lni-sun | Sun |
| moon-night | lni-moon | Moon |
| calculator-compute-math | lni-calculator | Calculator |
| comment-square-chat-message | lni-comment | Comment |
| send-message-dm-inbox | lni-send | Send message |
| zap-light-energy | lni-bolt | Zap/energy |

## Files Updated
1. `index.html` - Added Lineicons CDN link
2. `package.json` - Added lineicons dependency
3. `src/components/ui/icon.tsx` - Updated to use Lineicons
4. All component files using `<Icon name="..." />` - No changes needed (Icon component handles mapping)
