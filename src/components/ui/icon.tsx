import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Lineicons Icon Name Mapping
 * Maps our internal icon names to Lineicons CSS classes
 */
const lineIconMap: Record<string, string> = {
  // Authentication & User
  'account-user-person': 'lni-user',
  'lightning-energy': 'lni-bolt',
  'bolt': 'lni-bolt',
  'mail-email-message-inbox': 'lni-envelope',
  'lock-privacy': 'lni-lock',
  'eye-password': 'lni-eye',
  'eye-password-off': 'lni-eye-alt',
  'alert-error': 'lni-close-circle',
  'loading-spinner': 'lni-spinner',
  'logout-exit': 'lni-exit',
  'enter-log-in-arrow': 'lni-enter',
  
  // Navigation & UI
  'home-house': 'lni-home',
  'book-note-paper': 'lni-book',
  'notification-bell-alarm': 'lni-bell',
  'adjust-settings-horizontal': 'lni-cog',
  'menu-hambuger': 'lni-menu',
  'x-close-delete': 'lni-close',
  'arrow-chevron-down': 'lni-chevron-down',
  'arrow-chevron-up': 'lni-chevron-up',
  'arrow-chevron-left': 'lni-chevron-left',
  'arrow-chevron-right': 'lni-chevron-right',
  'arrow-up': 'lni-arrow-up',
  'arrow-down': 'lni-arrow-down',
  'arrow-left': 'lni-arrow-left',
  'arrow-right': 'lni-arrow-right',
  'arrow-bottom-left': 'lni-arrow-left',
  'arrow-bottom-right': 'lni-arrow-right',
  
  // Data & Analytics
  'bar-chart': 'lni-bar-chart',
  'pie-chart': 'lni-pie-chart',
  'activity-graph': 'lni-line-chart',
  'target': 'lni-target',
  'trending-up': 'lni-arrow-up-circle',
  'trending-down': 'lni-arrow-down-circle',
  'chart-up-arrow': 'lni-line-chart',
  
  // Actions
  'add-new-plus': 'lni-plus',
  'edit-write': 'lni-pencil',
  'trash-delete-bin-3': 'lni-trash',
  'save': 'lni-save',
  'download': 'lni-download',
  'upload-arrow-up': 'lni-upload',
  'check-circle-2': 'lni-checkmark-circle',
  'check-good': 'lni-checkmark',
  
  // Calendar & Time
  'calendar-date-appointment': 'lni-calendar',
  'calendar-month-date': 'lni-calendar',
  'clock-time': 'lni-clock',
  'clock-refresh-time-arrow': 'lni-reload',
  
  // Information & Help
  'info': 'lni-information',
  'help-question-mark': 'lni-question-circle',
  'book-open': 'lni-book',
  
  // Devices
  'desktop-computer-mac': 'lni-monitor',
  'mobile-phone': 'lni-mobile',
  
  // Other
  'maximize-expand': 'lni-fullscreen',
  'more-horizontal': 'lni-more-alt',
  'search': 'lni-search',
  'filter': 'lni-filter',
  'panel-left': 'lni-layout',
  'circle-oval': 'lni-circle',
  'snowflakes-weather-cold': 'lni-snowflake',
  'droplet-rain-weather': 'lni-drop',
  'flower-plant': 'lni-leaf',
  'sun-day': 'lni-sun',
  'moon-night': 'lni-moon',
  'calculator-compute-math': 'lni-calculator',
  'dollar-currency': 'lni-dollar',
  'dollar-sign': 'lni-dollar',
  'comment-square-chat-message': 'lni-comment',
  'send-message-dm-inbox': 'lni-send',
  'table-panel-window-sidebar': 'lni-layout',
  'zap-light-energy': 'lni-bolt',
};

export type IconName = keyof typeof lineIconMap;

interface IconProps extends React.HTMLAttributes<HTMLElement> {
  name: IconName | string;
  size?: number | string;
  className?: string;
  color?: string;
}

/**
 * Icon Component (Lineicons)
 * 
 * Renders Lineicons using CSS classes. Lineicons are loaded via CDN in index.html.
 * 
 * Features:
 * - Uses Lineicons CSS classes (lni lni-{icon-name})
 * - Handles color via className="text-*" or color prop
 * - Supports size via size prop or className (h-* w-*)
 * - Graceful fallback for missing icons
 * - Production-ready error handling
 * - Development mode validation and warnings
 * 
 * Usage:
 * <Icon name="home-house" className="h-5 w-5 text-primary" />
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  className,
  color,
  style,
  ...props
}) => {
  // Get Lineicons class name from mapping
  const lineIconClass = lineIconMap[name];

  if (!lineIconClass) {
    // In development, log warning with helpful information
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[Icon] Lineicon "${name}" not found in lineIconMap.`,
        `Available icons: ${Object.keys(lineIconMap).slice(0, 20).join(', ')}, ...`
      );
    }
    
    // Fallback: render a placeholder
    if (process.env.NODE_ENV === 'production') {
      return null as unknown as JSX.Element;
    }
    return (
      <i
        className={cn('lni lni-question-circle text-muted-foreground', className)}
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

  // Render Lineicons as <i> tag with CSS classes
  return (
    <i
      className={cn('lni', lineIconClass, className)}
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
