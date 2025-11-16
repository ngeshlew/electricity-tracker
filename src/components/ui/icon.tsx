import React from 'react';
import { cn } from '@/lib/utils';

// Heroicons (Outline, 24px) - preferred icon set
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  BoltIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ChartPieIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ClockIcon,
  CloudArrowDownIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  EllipsisHorizontalIcon,
  EnvelopeIcon,
  HomeIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  PencilSquareIcon,
  PlusIcon,
  SunIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Import all SVG icons used in the application
// Using dynamic imports with error handling
import AccountUserPerson from '../../icons/account-user-person.svg?react';
import ActivityGraph from '../../icons/activity-graph.svg?react';
import AddNewPlus from '../../icons/add-new-plus.svg?react';
import AdjustSettingsHorizontal from '../../icons/adjust-settings-horizontal.svg?react';
import AlertError from '../../icons/alert-error.svg?react';
import ArrowChevronDown from '../../icons/arrow-chevron-down.svg?react';
import ArrowChevronLeft from '../../icons/arrow-chevron-left.svg?react';
import ArrowChevronRight from '../../icons/arrow-chevron-right.svg?react';
import ArrowChevronUp from '../../icons/arrow-chevron-up.svg?react';
import ArrowDown from '../../icons/arrow-down.svg?react';
import ArrowLeft from '../../icons/arrow-left.svg?react';
import ArrowUp from '../../icons/arrow-up.svg?react';
import ArrowBottomLeft from '../../icons/arrow-bottom-left.svg?react';
import ArrowBottomRight from '../../icons/arrow-bottom-right.svg?react';
import BarChart from '../../icons/bar-chart.svg?react';
import BookNotePaper from '../../icons/book-note-paper.svg?react';
import CalculatorComputeMath from '../../icons/calculator-compute-math.svg?react';
import CalendarDateAppointment from '../../icons/calendar-date-appointment.svg?react';
import CalendarMonthDate from '../../icons/calendar-month-date.svg?react';
import CheckGood from '../../icons/check-good.svg?react';
import CheckCircle2 from '../../icons/check-circle-2.svg?react';
import CircleOval from '../../icons/circle-oval.svg?react';
import ClockRefreshTimeArrow from '../../icons/clock-refresh-time-arrow.svg?react';
import ClockTime from '../../icons/clock-time.svg?react';
import DesktopComputerMac from '../../icons/desktop-computer-mac.svg?react';
import DollarCurrency from '../../icons/dollar-currency.svg?react';
import DollarSign from '../../icons/dollar-sign.svg?react';
import Download from '../../icons/download.svg?react';
import EditWrite from '../../icons/edit-write.svg?react';
import EnterLogInArrow from '../../icons/enter-log-in-arrow.svg?react';
import EyePassword from '../../icons/eye-password.svg?react';
import EyePasswordOff from '../../icons/eye-password-off.svg?react';
import Filter from '../../icons/filter.svg?react';
import HelpQuestionMark from '../../icons/help-question-mark.svg?react';
import HomeHouse from '../../icons/home-house.svg?react';
import Info from '../../icons/info.svg?react';
import LightningEnergy from '../../icons/lightning-energy.svg?react';
import LoadingSpinner from '../../icons/loading-spinner.svg?react';
import LockPrivacy from '../../icons/lock-privacy.svg?react';
import LogoutExit from '../../icons/logout-exit.svg?react';
import MailEmailMessageInbox from '../../icons/mail-email-message-inbox.svg?react';
import MaximizeExpand from '../../icons/maximize-expand.svg?react';
import MenuHambuger from '../../icons/menu-hambuger.svg?react';
import MobilePhone from '../../icons/mobile-phone.svg?react';
import MoonNight from '../../icons/moon-night.svg?react';
import MoreHorizontal from '../../icons/more-horizontal.svg?react';
import NotificationBellAlarm from '../../icons/notification-bell-alarm.svg?react';
import PanelLeft from '../../icons/panel-left.svg?react';
import PieChart from '../../icons/pie-chart.svg?react';
import Save from '../../icons/save.svg?react';
import Search from '../../icons/search.svg?react';
import SendMessageDmInbox from '../../icons/send-message-dm-inbox.svg?react';
import SunDay from '../../icons/sun-day.svg?react';
import TablePanelWindowSidebar from '../../icons/table-panel-window-sidebar.svg?react';
import Target from '../../icons/target.svg?react';
import TrendingDown from '../../icons/trending-down.svg?react';
import TrendingUp from '../../icons/trending-up.svg?react';
import TrashDeleteBin3 from '../../icons/trash-delete-bin-3.svg?react';
import UploadArrowUp from '../../icons/upload-arrow-up.svg?react';
import XCloseDelete from '../../icons/x-close-delete.svg?react';
import ZapLightEnergy from '../../icons/zap-light-energy.svg?react';
import ChartUpArrow from '../../icons/chart-up-arrow.svg?react';
import CommentSquareChatMessage from '../../icons/comment-square-chat-message.svg?react';
import DropletRainWeather from '../../icons/droplet-rain-weather.svg?react';
import FlowerPlant from '../../icons/flower-plant.svg?react';

// Map common app icon names to Heroicons
const heroIconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  // Arrows & Chevrons
  'arrow-up': ArrowUpIcon,
  'arrow-down': ArrowDownIcon,
  'arrow-left': ArrowLeftIcon,
  'arrow-right': ArrowRightIcon,
  'arrow-chevron-left': ChevronLeftIcon,
  'arrow-chevron-right': ChevronRightIcon,
  'arrow-chevron-up': ChevronUpIcon,
  'arrow-chevron-down': ChevronDownIcon,
  'upload-arrow-up': ArrowUpTrayIcon,
  'download': ArrowDownTrayIcon,
  'chart-up-arrow': ArrowTrendingUpIcon,
  'trending-up': ArrowTrendingUpIcon,
  'trending-down': ArrowTrendingDownIcon,
  'enter-log-in-arrow': ArrowRightStartOnRectangleIcon,
  'logout-exit': ArrowLeftStartOnRectangleIcon,

  // Status & Actions
  'x-close-delete': XMarkIcon,
  'check-circle-2': CheckCircleIcon,
  'edit-write': PencilSquareIcon,
  'add-new-plus': PlusIcon,
  'trash-delete-bin-3': TrashIcon,
  'save': CloudArrowDownIcon,
  'upload': CloudArrowUpIcon,
  'loading-spinner': ArrowPathIcon, // will fall back if not imported

  // UI & System
  'menu-hambuger': Bars3Icon,
  'more-horizontal': EllipsisHorizontalIcon,
  'notification-bell-alarm': BellIcon,
  'adjust-settings-horizontal': Cog6ToothIcon,
  'calendar-date-appointment': CalendarDaysIcon,
  'clock-time': ClockIcon,
  'search': MagnifyingGlassIcon,
  'help-question-mark': InformationCircleIcon,
  'info': InformationCircleIcon,

  // Data & Analytics
  'bar-chart': ChartBarIcon,
  'pie-chart': ChartPieIcon,
  'activity-graph': ArrowTrendingUpIcon,
  'target': ChartBarIcon,

  // Theming & Devices
  'sun-day': SunIcon,
  'moon-night': MoonIcon,
  'desktop-computer-mac': ComputerDesktopIcon,
  'mobile-phone': DevicePhoneMobileIcon,

  // App brand-ish
  'lightning-energy': BoltIcon,
  'bolt': BoltIcon,
  'home-house': HomeIcon,
  'mail-email-message-inbox': EnvelopeIcon,
};

// NOTE: ArrowPathIcon is referenced above; import late to avoid unused import prunes
// Keeping import separate to maintain readability
import { ArrowPathIcon } from '@heroicons/react/24/outline';

// Comprehensive icon mapping with validation
const svgIconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  'account-user-person': AccountUserPerson,
  'activity-graph': ActivityGraph,
  'add-new-plus': AddNewPlus,
  'adjust-settings-horizontal': AdjustSettingsHorizontal,
  'alert-error': AlertError,
  'arrow-chevron-down': ArrowChevronDown,
  'arrow-chevron-left': ArrowChevronLeft,
  'arrow-chevron-right': ArrowChevronRight,
  'arrow-chevron-up': ArrowChevronUp,
  'arrow-down': ArrowDown,
  'arrow-left': ArrowLeft,
  'arrow-up': ArrowUp,
  'arrow-bottom-left': ArrowBottomLeft,
  'arrow-bottom-right': ArrowBottomRight,
  'bar-chart': BarChart,
  'book-note-paper': BookNotePaper,
  'calculator-compute-math': CalculatorComputeMath,
  'calendar-date-appointment': CalendarDateAppointment,
  'calendar-month-date': CalendarMonthDate,
  'chart-up-arrow': ChartUpArrow,
  'check-good': CheckGood,
  'check-circle-2': CheckCircle2,
  'circle-oval': CircleOval,
  'clock-refresh-time-arrow': ClockRefreshTimeArrow,
  'clock-time': ClockTime,
  'comment-square-chat-message': CommentSquareChatMessage,
  'desktop-computer-mac': DesktopComputerMac,
  'dollar-currency': DollarCurrency,
  'dollar-sign': DollarSign,
  'download': Download,
  'droplet-rain-weather': DropletRainWeather,
  'edit-write': EditWrite,
  'enter-log-in-arrow': EnterLogInArrow,
  'eye-password': EyePassword,
  'eye-password-off': EyePasswordOff,
  'filter': Filter,
  'flower-plant': FlowerPlant,
  'help-question-mark': HelpQuestionMark,
  'home-house': HomeHouse,
  'info': Info,
  'lightning-energy': LightningEnergy,
  'bolt': LightningEnergy, // Alias for lightning-energy
  'loading-spinner': LoadingSpinner,
  'lock-privacy': LockPrivacy,
  'logout-exit': LogoutExit,
  'mail-email-message-inbox': MailEmailMessageInbox,
  'maximize-expand': MaximizeExpand,
  'menu-hambuger': MenuHambuger,
  'mobile-phone': MobilePhone,
  'moon-night': MoonNight,
  'more-horizontal': MoreHorizontal,
  'notification-bell-alarm': NotificationBellAlarm,
  'panel-left': PanelLeft,
  'pie-chart': PieChart,
  'save': Save,
  'search': Search,
  'send-message-dm-inbox': SendMessageDmInbox,
  'sun-day': SunDay,
  'table-panel-window-sidebar': TablePanelWindowSidebar,
  'target': Target,
  'trending-down': TrendingDown,
  'trending-up': TrendingUp,
  'trash-delete-bin-3': TrashDeleteBin3,
  'upload-arrow-up': UploadArrowUp,
  'x-close-delete': XCloseDelete,
  'zap-light-energy': ZapLightEnergy,
};

// Validate all imports are valid React components
if (process.env.NODE_ENV === 'development') {
  Object.entries(svgIconMap).forEach(([name, Component]) => {
    if (!Component || (typeof Component !== 'function' && typeof Component !== 'object')) {
      console.error(`[Icon] Invalid import for icon "${name}":`, Component);
    }
  });
}

export type IconName = 
  | 'account-user-person'
  | 'activity-graph'
  | 'add-new-plus'
  | 'adjust-settings-horizontal'
  | 'alert-error'
  | 'arrow-chevron-down'
  | 'arrow-chevron-left'
  | 'arrow-chevron-right'
  | 'arrow-chevron-up'
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-up'
  | 'arrow-bottom-left'
  | 'arrow-bottom-right'
  | 'bar-chart'
  | 'book-note-paper'
  | 'calculator-compute-math'
  | 'calendar-date-appointment'
  | 'calendar-month-date'
  | 'chart-up-arrow'
  | 'check-good'
  | 'check-circle-2'
  | 'circle-oval'
  | 'clock-refresh-time-arrow'
  | 'clock-time'
  | 'comment-square-chat-message'
  | 'desktop-computer-mac'
  | 'dollar-currency'
  | 'dollar-sign'
  | 'download'
  | 'droplet-rain-weather'
  | 'edit-write'
  | 'enter-log-in-arrow'
  | 'eye-password'
  | 'eye-password-off'
  | 'filter'
  | 'flower-plant'
  | 'help-question-mark'
  | 'home-house'
  | 'info'
  | 'lightning-energy'
  | 'bolt'
  | 'loading-spinner'
  | 'lock-privacy'
  | 'logout-exit'
  | 'mail-email-message-inbox'
  | 'maximize-expand'
  | 'menu-hambuger'
  | 'mobile-phone'
  | 'moon-night'
  | 'more-horizontal'
  | 'notification-bell-alarm'
  | 'panel-left'
  | 'pie-chart'
  | 'save'
  | 'search'
  | 'send-message-dm-inbox'
  | 'sun-day'
  | 'table-panel-window-sidebar'
  | 'target'
  | 'trending-down'
  | 'trending-up'
  | 'trash-delete-bin-3'
  | 'upload-arrow-up'
  | 'x-close-delete'
  | 'zap-light-energy';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName | string; // Allow string for dynamic icons
  size?: number | string;
  className?: string;
  color?: string;
}

/**
 * Icon Component
 * 
 * Pure SVG-based icon component that imports all icons directly from SVG files.
 * 
 * Features:
 * - All icons imported directly from SVG files for reliability
 * - Handles color via currentColor (use className="text-*" for colors)
 * - Supports size via size prop or className (h-* w-*)
 * - Graceful fallback for missing icons
 * - Production-ready error handling
 * - Development mode validation and warnings
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  className,
  color,
  style,
  ...props
}) => {
  // Prefer Heroicons when available
  const PreferredIconComponent =
    heroIconMap[name] as React.ComponentType<React.SVGProps<SVGSVGElement>> | undefined;
  const FallbackIconComponent = svgIconMap[name];
  const IconComponent = PreferredIconComponent || FallbackIconComponent;

  if (!IconComponent) {
    // In development, log warning with helpful information
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[Icon] Icon "${name}" not found in heroIconMap or svgIconMap.`,
        `Heroicons keys: ${Object.keys(heroIconMap).slice(0, 10).join(', ')}, ...`,
        `SVG keys: ${Object.keys(svgIconMap).slice(0, 10).join(', ')}, ...`
      );
    }
    
    // Fallback:
    // - Production: render nothing to avoid visual placeholder artifacts
    // - Development: render a subtle placeholder square to surface issues
    if (process.env.NODE_ENV === 'production') {
      return null as unknown as JSX.Element;
    }
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={cn('text-muted-foreground', className)}
        style={style}
        {...props}
        aria-hidden="true"
      >
        <rect width="24" height="24" fill="currentColor" opacity="0.1" />
      </svg>
    );
  }

  // Validate that IconComponent is a valid React component
  if (typeof IconComponent !== 'function' && typeof IconComponent !== 'object') {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[Icon] Icon "${name}" is not a valid React component:`, IconComponent);
    }
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={cn('text-muted-foreground', className)}
        style={style}
        {...props}
        aria-hidden="true"
      >
        <rect width="24" height="24" fill="currentColor" opacity="0.1" />
      </svg>
    );
  }

  // Render the icon component
  // Handle both function components and object components (from vite-plugin-svgr)
  try {
    // Check if it's a valid React component
    if (React.isValidElement(IconComponent)) {
      return IconComponent;
    }
    
    // Try rendering as a component
    if (typeof IconComponent === 'function') {
      return React.createElement(IconComponent, {
        width: size,
        height: size,
        className: cn('inline-block', className),
        style: {
          color: color || 'currentColor',
          ...style,
        },
        ...props,
      });
    }
    
    // If it's an object with a default export (some SVGR configurations)
    if (IconComponent && typeof IconComponent === 'object' && 'default' in IconComponent) {
      const DefaultComponent = (IconComponent as any).default;
      if (typeof DefaultComponent === 'function') {
        return React.createElement(DefaultComponent, {
          width: size,
          height: size,
          className: cn('inline-block', className),
          style: {
            color: color || 'currentColor',
            ...style,
          },
          ...props,
        });
      }
    }
    
    // Standard JSX rendering
    return React.createElement(IconComponent as React.ComponentType<React.SVGProps<SVGSVGElement>>, {
      width: size,
      height: size,
      className: cn('inline-block', className),
      style: {
        color: color || 'currentColor',
        ...style,
      },
      ...props,
    });
  } catch (error) {
    // Catch any rendering errors
    if (process.env.NODE_ENV === 'development') {
      console.error(`[Icon] Error rendering icon "${name}":`, error);
      console.error(`[Icon] IconComponent type:`, typeof IconComponent);
      console.error(`[Icon] IconComponent value:`, IconComponent);
    }
    // Fallback to placeholder
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={cn('text-muted-foreground', className)}
        style={style}
        {...props}
        aria-hidden="true"
      >
        <rect width="24" height="24" fill="currentColor" opacity="0.1" />
      </svg>
    );
  }
};
