import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Basicons Icon Name Mapping
 * Maps our internal icon names to Basicons CSS classes
 * Basicons uses the format: <i class="bsc-{icon-name}"></i>
 * Documentation: https://basicons.xyz/
 * 
 * The mapping is based on SVG filenames in src/icons/ directory,
 * which match Basicons naming conventions.
 */
const basiconMap: Record<string, string> = {
  // Authentication & User
  'account-user-person': 'bsc-account-user-person',
  'lightning-energy': 'bsc-lightning-energy',
  'bolt': 'bsc-lightning-energy',
  'mail-email-message-inbox': 'bsc-mail-email-message-inbox',
  'lock-privacy': 'bsc-lock-privacy',
  'eye-password': 'bsc-eye-password',
  'eye-password-off': 'bsc-eye-password-off',
  'alert-error': 'bsc-alert-error',
  'loading-spinner': 'bsc-loading-spinner',
  'logout-exit': 'bsc-logout-exit',
  'enter-log-in-arrow': 'bsc-enter-log-in-arrow',
  
  // Navigation & UI
  'home-house': 'bsc-home-house',
  'book-note-paper': 'bsc-book-note-paper',
  'notification-bell-alarm': 'bsc-notification-bell-alarm',
  'adjust-settings-horizontal': 'bsc-adjust-settings-horizontal',
  'menu-hambuger': 'bsc-menu',
  'x-close-delete': 'bsc-x-close-delete',
  'arrow-chevron-down': 'bsc-chevron-down',
  'arrow-chevron-up': 'bsc-chevron-up',
  'arrow-chevron-left': 'bsc-arrow-chevron-left',
  'arrow-chevron-right': 'bsc-arrow-chevron-right',
  'arrow-up': 'bsc-arrow-up',
  'arrow-down': 'bsc-arrow-down',
  'arrow-left': 'bsc-arrow-left',
  'arrow-right': 'bsc-arrow-right',
  'arrow-bottom-left': 'bsc-arrow-bottom-left',
  'arrow-bottom-right': 'bsc-arrow-bottom-right',
  
  // Data & Analytics
  'bar-chart': 'bsc-bar-chart',
  'pie-chart': 'bsc-pie-chart',
  'activity-graph': 'bsc-activity-graph',
  'target': 'bsc-target',
  'trending-up': 'bsc-trending-up',
  'trending-down': 'bsc-trending-down',
  'chart-up-arrow': 'bsc-chart-up-arrow',
  
  // Actions
  'add-new-plus': 'bsc-add-new-plus',
  'edit-write': 'bsc-edit-write',
  'trash-delete-bin-3': 'bsc-trash-delete-bin-3',
  'save': 'bsc-save',
  'download': 'bsc-download',
  'upload-arrow-up': 'bsc-upload-arrow-up',
  'check-circle-2': 'bsc-check-circle-2',
  'check-good': 'bsc-check-good',
  
  // Calendar & Time
  'calendar-date-appointment': 'bsc-calendar-date-appointment',
  'calendar-month-date': 'bsc-calendar-month-date',
  'clock-time': 'bsc-clock-time',
  'clock-refresh-time-arrow': 'bsc-clock-refresh-time-arrow',
  
  // Information & Help
  'info': 'bsc-info',
  'help-question-mark': 'bsc-help-question-mark',
  'book-open': 'bsc-book-open',
  
  // Devices
  'desktop-computer-mac': 'bsc-desktop-computer-mac',
  'mobile-phone': 'bsc-mobile-phone',
  
  // Other
  'maximize-expand': 'bsc-maximize-expand',
  'more-horizontal': 'bsc-more-horizontal',
  'search': 'bsc-search',
  'filter': 'bsc-filter',
  'panel-left': 'bsc-panel-left',
  'circle-oval': 'bsc-circle-oval',
  'snowflakes-weather-cold': 'bsc-snowflakes-weather-cold',
  'droplet-rain-weather': 'bsc-droplet-rain-weather',
  'flower-plant': 'bsc-flower-plant',
  'sun-day': 'bsc-sun-day',
  'moon-night': 'bsc-moon-night',
  'calculator-compute-math': 'bsc-calculator-compute-math',
  'dollar-currency': 'bsc-dollar-currency',
  'dollar-sign': 'bsc-dollar-sign',
  'comment-square-chat-message': 'bsc-comment-square-chat-message',
  'send-message-dm-inbox': 'bsc-send-message-dm-inbox',
  'table-panel-window-sidebar': 'bsc-table-panel-window-sidebar',
  'zap-light-energy': 'bsc-zap-light-energy',
};

export type IconName = keyof typeof basiconMap;

interface IconProps extends React.HTMLAttributes<HTMLElement> {
  name: IconName | string;
  size?: number | string;
  className?: string;
  color?: string;
}

/**
 * Icon Component (Basicons)
 * 
 * Renders Basicons using CSS classes. Basicons are loaded via embed script in index.html.
 * 
 * Features:
 * - Uses Basicons CSS classes (bsc-{icon-name})
 * - Handles color via className="text-*" or color prop
 * - Supports size via size prop or className (h-* w-*)
 * - Graceful fallback for missing icons
 * - Production-ready error handling
 * - Development mode validation and warnings
 * 
 * Usage:
 * <Icon name="home-house" className="h-5 w-5 text-primary" />
 * 
 * Documentation: https://basicons.xyz/
 * React Package: https://github.com/PreciousME/react-basicons
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  className,
  color,
  style,
  ...props
}) => {
  // Get Basicons class name from mapping
  const basiconClass = basiconMap[name];

  if (!basiconClass) {
    // In development, log warning with helpful information
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[Icon] Basicons icon "${name}" not found in basiconMap.`,
        `Available icons: ${Object.keys(basiconMap).slice(0, 20).join(', ')}, ...`
      );
    }
    
    // Fallback: render a placeholder
    if (process.env.NODE_ENV === 'production') {
      return null as unknown as JSX.Element;
    }
    return (
      <i
        className={cn('bsc-help-question-mark text-muted-foreground', className)}
        style={{
          fontSize: typeof size === 'number' ? `${size}px` : size,
          color,
          ...style,
        }}
        aria-hidden="true"
        {...props}
      />
    );
  }

  // Render Basicons as <i> tag with CSS classes
  // Basicons format: <i class="bsc-{icon-name}"></i>
  return (
    <i
      className={cn(basiconClass, className)}
      style={{
        fontSize: typeof size === 'number' ? `${size}px` : size,
        color,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
};
