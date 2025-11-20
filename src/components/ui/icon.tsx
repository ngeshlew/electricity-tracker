import React from 'react';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

/**
 * Lucide Icon Name Mapping
 * Maps our internal icon names to Lucide React icon components
 * 
 * Uses Lucide icons from lucide-react package.
 * All icons support proper sizing via size prop or className.
 * 
 * Reference: https://www.shadcn.io/icons/lucide
 */

// Map internal icon names to Lucide icon component names
const lucideIconMap: Record<string, keyof typeof LucideIcons> = {
  // Authentication & User
  'account-user-person': 'User',
  'lightning-energy': 'Zap',
  bolt: 'Zap',
  'mail-email-message-inbox': 'Mail',
  'lock-privacy': 'Lock',
  'eye-password': 'Eye',
  'eye-password-off': 'EyeOff',
  'alert-error': 'AlertCircle',
  'loading-spinner': 'Loader2',
  'logout-exit': 'LogOut',
  'enter-log-in-arrow': 'LogIn',

  // Navigation & UI
  'home-house': 'Home',
  'book-note-paper': 'Book',
  'notification-bell-alarm': 'Bell',
  'adjust-settings-horizontal': 'Settings',
  'menu-hambuger': 'Menu',
  'x-close-delete': 'X',
  'arrow-chevron-down': 'ChevronDown',
  'arrow-chevron-up': 'ChevronUp',
  'arrow-chevron-left': 'ChevronLeft',
  'arrow-chevron-right': 'ChevronRight',
  'arrow-up': 'ArrowUp',
  'arrow-down': 'ArrowDown',
  'arrow-left': 'ArrowLeft',
  'arrow-right': 'ArrowRight',
  'arrow-bottom-left': 'ArrowDownLeft',
  'arrow-bottom-right': 'ArrowDownRight',

  // Data & Analytics
  'bar-chart': 'BarChart3',
  'pie-chart': 'PieChart',
  'activity-graph': 'Activity',
  target: 'Target',
  'trending-up': 'TrendingUp',
  'trending-down': 'TrendingDown',
  'chart-up-arrow': 'ArrowUp',

  // Actions
  'add-new-plus': 'Plus',
  'edit-write': 'Edit',
  'trash-delete-bin-3': 'Trash2',
  save: 'Save',
  download: 'Download',
  'upload-arrow-up': 'Upload',
  'check-circle-2': 'CheckCircle2',
  'check-good': 'Check',

  // Calendar & Time
  'calendar-date-appointment': 'Calendar',
  'calendar-month-date': 'Calendar',
  'clock-time': 'Clock',
  'clock-refresh-time-arrow': 'Clock',

  // Information & Help
  info: 'Info',
  'help-question-mark': 'HelpCircle',
  'book-open': 'BookOpen',

  // Devices
  'desktop-computer-mac': 'Monitor',
  'mobile-phone': 'Smartphone',

  // Other
  'maximize-expand': 'Maximize',
  'more-horizontal': 'MoreHorizontal',
  search: 'Search',
  filter: 'Filter',
  'panel-left': 'PanelLeft',
  'circle-oval': 'Circle',
  'snowflakes-weather-cold': 'Snowflake',
  'droplet-rain-weather': 'Droplet',
  'flower-plant': 'Flower2',
  'sun-day': 'Sun',
  'moon-night': 'Moon',
  'calculator-compute-math': 'Calculator',
  'dollar-currency': 'DollarSign',
  'dollar-sign': 'DollarSign',
  'comment-square-chat-message': 'MessageSquare',
  'send-message-dm-inbox': 'Send',
  'table-panel-window-sidebar': 'Layout',
  'zap-light-energy': 'Zap',
};

export type IconName = keyof typeof lucideIconMap;

interface IconProps extends React.HTMLAttributes<HTMLElement> {
  name: IconName | string;
  size?: number | string;
  className?: string;
}

/**
 * Icon Component (Lucide)
 * 
 * Renders Lucide icons from the lucide-react package.
 * 
 * Features:
 * - Uses Lucide icons (https://lucide.dev)
 * - Handles color via className="text-*" or color prop
 * - Supports size via size prop (number in pixels) or className (h-* w-*)
 * - Graceful fallback for missing icons
 * 
 * Usage:
 * <Icon name="home-house" size={20} className="text-primary" />
 * <Icon name="arrow-up" className="h-5 w-5 text-muted-foreground" />
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size,
  className,
  style,
  ...props
}) => {
  const lucideIconName = lucideIconMap[name];

  if (!lucideIconName) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[Icon] Icon "${name}" not found in Lucide map. ` +
          `Available: ${Object.keys(lucideIconMap).slice(0, 10).join(', ')}... ` +
          `Total icons: ${Object.keys(lucideIconMap).length}`
      );
    }

    // Fallback to a generic icon
    const HelpCircle = LucideIcons.HelpCircle;
    const sizeValue = typeof size === 'number' ? size : size || 24;
    return (
      <HelpCircle
        className={cn('text-muted-foreground', className)}
        size={sizeValue}
        style={style}
        aria-hidden="true"
        {...(props as React.SVGProps<SVGSVGElement>)}
      />
    );
  }

  // Get the Lucide icon component
  const LucideIcon = LucideIcons[lucideIconName] as React.ComponentType<
    React.SVGProps<SVGSVGElement> & { size?: number | string }
  >;

  if (!LucideIcon) {
    // Fallback if icon component doesn't exist
    const HelpCircle = LucideIcons.HelpCircle;
    const sizeValue = typeof size === 'number' ? size : size || 24;
    return (
      <HelpCircle
        className={cn('text-muted-foreground', className)}
        size={sizeValue}
        style={style}
        aria-hidden="true"
        {...(props as React.SVGProps<SVGSVGElement>)}
      />
    );
  }

  // Determine size value
  // If size is provided as a number, use it directly
  // If size is a string (like "24px"), extract the number
  // If className has size classes (h-* w-*), let those handle it
  let sizeValue: number | undefined = undefined;
  
  if (size !== undefined) {
    if (typeof size === 'number') {
      sizeValue = size;
    } else if (typeof size === 'string') {
      // Extract number from string like "24px" or "1.5rem"
      const match = size.match(/(\d+\.?\d*)/);
      if (match) {
        sizeValue = parseFloat(match[1]);
        // Convert rem to px (assuming 1rem = 16px)
        if (size.includes('rem')) {
          sizeValue = sizeValue * 16;
        }
      }
    }
  }

  // If className has size classes, don't set size prop (let Tailwind handle it)
  const hasSizeClass = className && /[hw]-\d+/.test(className);
  const finalSize = hasSizeClass ? undefined : (sizeValue || 24);

  return (
    <LucideIcon
      className={cn(className)}
      size={finalSize}
      style={style}
      aria-hidden="true"
      {...(props as React.SVGProps<SVGSVGElement>)}
    />
  );
};
