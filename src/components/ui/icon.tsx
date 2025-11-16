import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Basicons Icon Name Mapping
 * Maps our internal icon names to Basicons CSS classes
 * Basicons uses the format: <i class="bsi bsi-{icon-name}"></i>
 * Documentation: https://www.basicons.com/
 */
const basiconMap: Record<string, string> = {
  // Authentication & User
  'account-user-person': 'bsi-user',
  'lightning-energy': 'bsi-bolt',
  'bolt': 'bsi-bolt',
  'mail-email-message-inbox': 'bsi-envelope',
  'lock-privacy': 'bsi-lock',
  'eye-password': 'bsi-eye',
  'eye-password-off': 'bsi-eye-off',
  'alert-error': 'bsi-alert-circle',
  'loading-spinner': 'bsi-loader',
  'logout-exit': 'bsi-log-out',
  'enter-log-in-arrow': 'bsi-log-in',
  
  // Navigation & UI
  'home-house': 'bsi-home',
  'book-note-paper': 'bsi-file-text',
  'notification-bell-alarm': 'bsi-bell',
  'adjust-settings-horizontal': 'bsi-settings',
  'menu-hambuger': 'bsi-menu',
  'x-close-delete': 'bsi-x',
  'arrow-chevron-down': 'bsi-chevron-down',
  'arrow-chevron-up': 'bsi-chevron-up',
  'arrow-chevron-left': 'bsi-chevron-left',
  'arrow-chevron-right': 'bsi-chevron-right',
  'arrow-up': 'bsi-arrow-up',
  'arrow-down': 'bsi-arrow-down',
  'arrow-left': 'bsi-arrow-left',
  'arrow-right': 'bsi-arrow-right',
  'arrow-bottom-left': 'bsi-arrow-left',
  'arrow-bottom-right': 'bsi-arrow-right',
  
  // Data & Analytics
  'bar-chart': 'bsi-bar-chart',
  'pie-chart': 'bsi-pie-chart',
  'activity-graph': 'bsi-trending-up',
  'target': 'bsi-target',
  'trending-up': 'bsi-trending-up',
  'trending-down': 'bsi-trending-down',
  'chart-up-arrow': 'bsi-trending-up',
  
  // Actions
  'add-new-plus': 'bsi-plus',
  'edit-write': 'bsi-edit',
  'trash-delete-bin-3': 'bsi-trash',
  'save': 'bsi-save',
  'download': 'bsi-download',
  'upload-arrow-up': 'bsi-upload',
  'check-circle-2': 'bsi-check-circle',
  'check-good': 'bsi-check',
  
  // Calendar & Time
  'calendar-date-appointment': 'bsi-calendar',
  'calendar-month-date': 'bsi-calendar',
  'clock-time': 'bsi-clock',
  'clock-refresh-time-arrow': 'bsi-refresh',
  
  // Information & Help
  'info': 'bsi-info',
  'help-question-mark': 'bsi-help-circle',
  'book-open': 'bsi-book-open',
  
  // Devices
  'desktop-computer-mac': 'bsi-monitor',
  'mobile-phone': 'bsi-smartphone',
  
  // Other
  'maximize-expand': 'bsi-maximize',
  'more-horizontal': 'bsi-more-horizontal',
  'search': 'bsi-search',
  'filter': 'bsi-filter',
  'panel-left': 'bsi-sidebar',
  'circle-oval': 'bsi-circle',
  'snowflakes-weather-cold': 'bsi-snowflake',
  'droplet-rain-weather': 'bsi-droplet',
  'flower-plant': 'bsi-flower',
  'sun-day': 'bsi-sun',
  'moon-night': 'bsi-moon',
  'calculator-compute-math': 'bsi-calculator',
  'dollar-currency': 'bsi-dollar-sign',
  'dollar-sign': 'bsi-dollar-sign',
  'comment-square-chat-message': 'bsi-message-square',
  'send-message-dm-inbox': 'bsi-send',
  'table-panel-window-sidebar': 'bsi-layout',
  'zap-light-energy': 'bsi-zap',
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
 * Renders Basicons using CSS classes. Basicons are loaded via CDN in index.html.
 * 
 * Features:
 * - Uses Basicons CSS classes (bsi bsi-{icon-name})
 * - Handles color via className="text-*" or color prop
 * - Supports size via size prop or className (h-* w-*)
 * - Graceful fallback for missing icons
 * - Production-ready error handling
 * - Development mode validation and warnings
 * 
 * Usage:
 * <Icon name="home-house" className="h-5 w-5 text-primary" />
 * 
 * Documentation: https://www.basicons.com/
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
        className={cn('bsi bsi-help-circle text-muted-foreground', className)}
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
  return (
    <i
      className={cn('bsi', basiconClass, className)}
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
