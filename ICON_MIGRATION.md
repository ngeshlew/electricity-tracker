# Icon Migration Documentation - Lineicons to Basicons

This document tracks all icons used in the codebase and their Basicons equivalents.

## Icon Usage Inventory

### Authentication & User Interface
- `lightning-energy` → `bsi-bolt` - App logo/brand icon
- `mail-email-message-inbox` → `bsi-envelope` - Email input icon
- `lock-privacy` → `bsi-lock` - Password/lock icon
- `eye-password` → `bsi-eye` - Show password icon
- `eye-password-off` → `bsi-eye-off` - Hide password icon
- `alert-error` → `bsi-alert-circle` - Error alert icon
- `loading-spinner` → `bsi-loader` - Loading spinner icon
- `account-user-person` → `bsi-user` - User account icon
- `logout-exit` → `bsi-log-out` - Logout icon
- `enter-log-in-arrow` → `bsi-log-in` - Login icon

### Navigation & UI Controls
- `home-house` → `bsi-home` - Home/Dashboard icon
- `book-note-paper` → `bsi-file-text` - Statements/Book icon
- `notification-bell-alarm` → `bsi-bell` - Notifications icon
- `adjust-settings-horizontal` → `bsi-settings` - Settings icon
- `menu-hambuger` → `bsi-menu` - Menu/hamburger icon
- `x-close-delete` → `bsi-x` - Close/delete icon
- `arrow-chevron-down` → `bsi-chevron-down` - Chevron down
- `arrow-chevron-up` → `bsi-chevron-up` - Chevron up
- `arrow-chevron-left` → `bsi-chevron-left` - Chevron left
- `arrow-chevron-right` → `bsi-chevron-right` - Chevron right
- `arrow-up` → `bsi-arrow-up` - Arrow up
- `arrow-down` → `bsi-arrow-down` - Arrow down
- `arrow-left` → `bsi-arrow-left` - Arrow left
- `arrow-right` → `bsi-arrow-right` - Arrow right

### Data & Analytics
- `bar-chart` → `bsi-bar-chart` - Bar chart icon
- `pie-chart` → `bsi-pie-chart` - Pie chart icon
- `activity-graph` → `bsi-trending-up` - Activity/trend graph icon
- `target` → `bsi-target` - Target/goal icon
- `trending-up` → `bsi-trending-up` - Trending up icon
- `trending-down` → `bsi-trending-down` - Trending down icon
- `chart-up-arrow` → `bsi-trending-up` - Chart with up arrow

### Actions & Operations
- `add-new-plus` → `bsi-plus` - Add/plus icon
- `edit-write` → `bsi-edit` - Edit icon
- `trash-delete-bin-3` → `bsi-trash` - Delete/trash icon
- `save` → `bsi-save` - Save icon
- `download` → `bsi-download` - Download icon
- `upload-arrow-up` → `bsi-upload` - Upload icon
- `check-circle-2` → `bsi-check-circle` - Check/success icon
- `check-good` → `bsi-check` - Check mark icon

### Calendar & Time
- `calendar-date-appointment` → `bsi-calendar` - Calendar icon
- `calendar-month-date` → `bsi-calendar` - Calendar month icon
- `clock-time` → `bsi-clock` - Clock icon
- `clock-refresh-time-arrow` → `bsi-refresh` - Refresh/time icon

### Information & Help
- `info` → `bsi-info` - Information icon
- `help-question-mark` → `bsi-help-circle` - Help/question icon
- `book-open` → `bsi-book-open` - Book open icon (documentation)

### Devices & Platforms
- `desktop-computer-mac` → `bsi-monitor` - Desktop computer icon
- `mobile-phone` → `bsi-smartphone` - Mobile phone icon

### Other
- `bolt` → `bsi-bolt` - Bolt/energy icon (alias for lightning-energy)
- `maximize-expand` → `bsi-maximize` - Maximize/expand icon
- `more-horizontal` → `bsi-more-horizontal` - More options icon
- `search` → `bsi-search` - Search icon
- `filter` → `bsi-filter` - Filter icon
- `panel-left` → `bsi-sidebar` - Sidebar/panel icon
- `circle-oval` → `bsi-circle` - Circle icon
- `snowflakes-weather-cold` → `bsi-snowflake` - Snowflake icon (winter season)
- `droplet-rain-weather` → `bsi-droplet` - Rain/water icon
- `flower-plant` → `bsi-flower` - Plant/flower icon
- `sun-day` → `bsi-sun` - Sun icon
- `moon-night` → `bsi-moon` - Moon icon
- `calculator-compute-math` → `bsi-calculator` - Calculator icon
- `dollar-currency` → `bsi-dollar-sign` - Dollar currency icon
- `dollar-sign` → `bsi-dollar-sign` - Dollar sign icon
- `comment-square-chat-message` → `bsi-message-square` - Comment/message icon
- `send-message-dm-inbox` → `bsi-send` - Send message icon
- `table-panel-window-sidebar` → `bsi-layout` - Layout/panel icon
- `zap-light-energy` → `bsi-zap` - Zap/energy icon

## Basicons Implementation

Basicons uses CSS classes with the format: `<i class="bsi bsi-{icon-name}"></i>`

### Complete Icon Name Mapping

| Internal Name | Basicons Class | Notes |
|--------------|----------------|-------|
| account-user-person | bsi-user | User account |
| activity-graph | bsi-trending-up | Activity/trend |
| add-new-plus | bsi-plus | Add/plus |
| adjust-settings-horizontal | bsi-settings | Settings |
| alert-error | bsi-alert-circle | Error alert |
| arrow-chevron-down | bsi-chevron-down | Chevron down |
| arrow-chevron-left | bsi-chevron-left | Chevron left |
| arrow-chevron-right | bsi-chevron-right | Chevron right |
| arrow-chevron-up | bsi-chevron-up | Chevron up |
| arrow-down | bsi-arrow-down | Arrow down |
| arrow-left | bsi-arrow-left | Arrow left |
| arrow-up | bsi-arrow-up | Arrow up |
| arrow-right | bsi-arrow-right | Arrow right |
| bar-chart | bsi-bar-chart | Bar chart |
| book-note-paper | bsi-file-text | Book/document |
| calendar-date-appointment | bsi-calendar | Calendar |
| check-circle-2 | bsi-check-circle | Success check |
| check-good | bsi-check | Check mark |
| clock-refresh-time-arrow | bsi-refresh | Refresh |
| clock-time | bsi-clock | Clock |
| desktop-computer-mac | bsi-monitor | Desktop |
| download | bsi-download | Download |
| edit-write | bsi-edit | Edit |
| enter-log-in-arrow | bsi-log-in | Login |
| eye-password | bsi-eye | Show password |
| eye-password-off | bsi-eye-off | Hide password |
| help-question-mark | bsi-help-circle | Help |
| home-house | bsi-home | Home |
| info | bsi-info | Info |
| lightning-energy | bsi-bolt | Energy/bolt |
| bolt | bsi-bolt | Bolt (alias) |
| loading-spinner | bsi-loader | Loading |
| lock-privacy | bsi-lock | Lock |
| logout-exit | bsi-log-out | Logout |
| mail-email-message-inbox | bsi-envelope | Email |
| maximize-expand | bsi-maximize | Maximize |
| menu-hambuger | bsi-menu | Menu |
| mobile-phone | bsi-smartphone | Mobile |
| more-horizontal | bsi-more-horizontal | More options |
| notification-bell-alarm | bsi-bell | Notifications |
| pie-chart | bsi-pie-chart | Pie chart |
| search | bsi-search | Search |
| target | bsi-target | Target |
| trending-down | bsi-trending-down | Trend down |
| trending-up | bsi-trending-up | Trend up |
| trash-delete-bin-3 | bsi-trash | Delete |
| upload-arrow-up | bsi-upload | Upload |
| x-close-delete | bsi-x | Close |
| snowflakes-weather-cold | bsi-snowflake | Snowflake |
| droplet-rain-weather | bsi-droplet | Rain/water |
| flower-plant | bsi-flower | Plant |
| sun-day | bsi-sun | Sun |
| moon-night | bsi-moon | Moon |
| calculator-compute-math | bsi-calculator | Calculator |
| dollar-currency | bsi-dollar-sign | Dollar |
| dollar-sign | bsi-dollar-sign | Dollar sign |
| comment-square-chat-message | bsi-message-square | Comment |
| send-message-dm-inbox | bsi-send | Send message |
| table-panel-window-sidebar | bsi-layout | Layout |
| zap-light-energy | bsi-zap | Zap/energy |

## Files Updated
1. `index.html` - Added Basicons CDN link
2. `package.json` - Removed lineicons dependency
3. `src/components/ui/icon.tsx` - Updated to use Basicons
4. All component files using `<Icon name="..." />` - No changes needed (Icon component handles mapping)

## Basicons Resources
- Website: https://www.basicons.com/
- CDN: https://cdn.basicons.com/css/basicons.css
- Format: `<i class="bsi bsi-{icon-name}"></i>`
