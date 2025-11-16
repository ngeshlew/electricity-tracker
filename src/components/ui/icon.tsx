import React from 'react';
import { cn } from '@/lib/utils';

// Defensive import wrapper - catches import errors gracefully
// Note: If SVG imports fail, they will be caught by the error handler
let iconImportError: Error | null = null;

// Static imports for most commonly used icons
import HomeHouseIcon from '../../icons/home-house 2.svg?react';
import AccountUserPersonIcon from '../../icons/account-user-person 2.svg?react';
import LightningEnergyIcon from '../../icons/lightning-energy 2.svg?react';
import NotificationBellAlarmIcon from '../../icons/notification-bell-alarm 2.svg?react';
import AdjustSettingsHorizontalIcon from '../../icons/adjust-settings-horizontal 2.svg?react';
import ArrowUpIcon from '../../icons/arrow-up 2.svg?react';
import ArrowDownIcon from '../../icons/arrow-down 2.svg?react';
import ArrowLeftIcon from '../../icons/arrow-left 2.svg?react';
import ArrowRightIcon from '../../icons/arrow-right 2.svg?react';
import ArrowChevronDownIcon from '../../icons/arrow-chevron-down 2.svg?react';
import ArrowChevronUpIcon from '../../icons/arrow-chevron-up 2.svg?react';
import ArrowChevronLeftIcon from '../../icons/arrow-chevron-left 3.svg?react';
import ArrowChevronRightIcon from '../../icons/arrow-chevron-right 2.svg?react';
import XCloseDeleteIcon from '../../icons/x-close-delete.svg?react';
import CalendarDateAppointmentIcon from '../../icons/calendar-date-appointment 2.svg?react';
import CheckCircle2Icon from '../../icons/check-circle-2.svg?react';
import CheckGoodIcon from '../../icons/check-good.svg?react';
import EyePasswordIcon from '../../icons/eye-password.svg?react';
import EyePasswordOffIcon from '../../icons/eye-password-off.svg?react';
import LockPrivacyIcon from '../../icons/lock-privacy.svg?react';
import MailEmailMessageInboxIcon from '../../icons/mail-email-message-inbox.svg?react';
import LogoutExitIcon from '../../icons/logout-exit.svg?react';
import EnterLogInArrowIcon from '../../icons/enter-log-in-arrow.svg?react';
import BookNotePaperIcon from '../../icons/book-note-paper.svg?react';
import ActivityGraphIcon from '../../icons/activity-graph 2.svg?react';
import BarChartIcon from '../../icons/bar-chart.svg?react';
import PieChartIcon from '../../icons/pie-chart.svg?react';
import TargetIcon from '../../icons/target.svg?react';
import TrendingUpIcon from '../../icons/trending-up.svg?react';
import TrendingDownIcon from '../../icons/trending-down.svg?react';
import AddNewPlusIcon from '../../icons/add-new-plus 2.svg?react';
import EditWriteIcon from '../../icons/edit-write.svg?react';
import TrashDeleteBin3Icon from '../../icons/trash-delete-bin-3.svg?react';
import SaveIcon from '../../icons/save.svg?react';
import DownloadIcon from '../../icons/download.svg?react';
import UploadArrowUpIcon from '../../icons/upload-arrow-up.svg?react';
import ClockTimeIcon from '../../icons/clock-time.svg?react';
import ClockRefreshTimeArrowIcon from '../../icons/clock-refresh-time-arrow.svg?react';
import InfoIcon from '../../icons/info.svg?react';
import HelpQuestionMarkIcon from '../../icons/help-question-mark.svg?react';
import BookOpenIcon from '../../icons/book-open.svg?react';
import DesktopComputerMacIcon from '../../icons/desktop-computer-mac.svg?react';
import MobilePhoneIcon from '../../icons/mobile-phone.svg?react';
import MaximizeExpandIcon from '../../icons/maximize-expand.svg?react';
import MoreHorizontalIcon from '../../icons/more-horizontal.svg?react';
import SearchIcon from '../../icons/search.svg?react';
import FilterIcon from '../../icons/filter.svg?react';
import PanelLeftIcon from '../../icons/panel-left.svg?react';
import CircleOvalIcon from '../../icons/circle-oval.svg?react';
import SnowflakesWeatherColdIcon from '../../icons/snowflakes-weather-cold.svg?react';
import DropletRainWeatherIcon from '../../icons/droplet-rain-weather 3.svg?react';
import FlowerPlantIcon from '../../icons/flower-plant.svg?react';
import SunDayIcon from '../../icons/sun-day.svg?react';
import MoonNightIcon from '../../icons/moon-night.svg?react';
import CalculatorComputeMathIcon from '../../icons/calculator-compute-math.svg?react';
import DollarCurrencyIcon from '../../icons/dollar-currency.svg?react';
import DollarSignIcon from '../../icons/dollar-sign.svg?react';
import CommentSquareChatMessageIcon from '../../icons/comment-square-chat-message.svg?react';
import SendMessageDmInboxIcon from '../../icons/send-message-dm-inbox.svg?react';
import TablePanelWindowSidebarIcon from '../../icons/table-panel-window-sidebar.svg?react';
import ZapLightEnergyIcon from '../../icons/zap-light-energy.svg?react';
import AlertErrorIcon from '../../icons/alert-error 2.svg?react';
import LoadingSpinnerIcon from '../../icons/loading-spinner.svg?react';
import MenuHambugerIcon from '../../icons/menu-hambuger.svg?react';
import CalendarMonthDateIcon from '../../icons/calendar-month-date.svg?react';
import ChartUpArrowIcon from '../../icons/chart-up-arrow.svg?react';
import ArrowBottomLeftIcon from '../../icons/arrow-bottom-left.svg?react';
import ArrowBottomRightIcon from '../../icons/arrow-bottom-right.svg?react';

/**
 * Basicons Icon Name Mapping
 * Maps our internal icon names to React SVG components
 * 
 * IMPORTANT: If icons are showing as data URIs, check vite-plugin-svgr configuration.
 * SVGs should be imported as React components, not strings.
 */

// Runtime validation: Check if imports are working correctly
const validateIconImports = () => {
  if (process.env.NODE_ENV === 'development') {
    const sampleIcons = [ArrowUpIcon, ArrowDownIcon, ActivityGraphIcon, TargetIcon];
    const invalidImports = sampleIcons.filter(icon => typeof icon === 'string');
    if (invalidImports.length > 0) {
      console.error(
        '[Icon] CRITICAL: Some SVG imports are returning strings (data URIs) instead of React components. ' +
        'This indicates vite-plugin-svgr is not processing SVGs correctly. ' +
        `Found ${invalidImports.length} invalid imports.`
      );
    }
  }
};

// Run validation on module load
validateIconImports();

const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  // Authentication & User
  'account-user-person': AccountUserPersonIcon,
  'lightning-energy': LightningEnergyIcon,
  'bolt': LightningEnergyIcon,
  'mail-email-message-inbox': MailEmailMessageInboxIcon,
  'lock-privacy': LockPrivacyIcon,
  'eye-password': EyePasswordIcon,
  'eye-password-off': EyePasswordOffIcon,
  'alert-error': AlertErrorIcon,
  'loading-spinner': LoadingSpinnerIcon,
  'logout-exit': LogoutExitIcon,
  'enter-log-in-arrow': EnterLogInArrowIcon,
  
  // Navigation & UI
  'home-house': HomeHouseIcon,
  'book-note-paper': BookNotePaperIcon,
  'notification-bell-alarm': NotificationBellAlarmIcon,
  'adjust-settings-horizontal': AdjustSettingsHorizontalIcon,
  'menu-hambuger': MenuHambugerIcon,
  'x-close-delete': XCloseDeleteIcon,
  'arrow-chevron-down': ArrowChevronDownIcon,
  'arrow-chevron-up': ArrowChevronUpIcon,
  'arrow-chevron-left': ArrowChevronLeftIcon,
  'arrow-chevron-right': ArrowChevronRightIcon,
  'arrow-up': ArrowUpIcon,
  'arrow-down': ArrowDownIcon,
  'arrow-left': ArrowLeftIcon,
  'arrow-right': ArrowRightIcon,
  'arrow-bottom-left': ArrowBottomLeftIcon,
  'arrow-bottom-right': ArrowBottomRightIcon,
  
  // Data & Analytics
  'bar-chart': BarChartIcon,
  'pie-chart': PieChartIcon,
  'activity-graph': ActivityGraphIcon,
  'target': TargetIcon,
  'trending-up': TrendingUpIcon,
  'trending-down': TrendingDownIcon,
  'chart-up-arrow': ChartUpArrowIcon,
  
  // Actions
  'add-new-plus': AddNewPlusIcon,
  'edit-write': EditWriteIcon,
  'trash-delete-bin-3': TrashDeleteBin3Icon,
  'save': SaveIcon,
  'download': DownloadIcon,
  'upload-arrow-up': UploadArrowUpIcon,
  'check-circle-2': CheckCircle2Icon,
  'check-good': CheckGoodIcon,
  
  // Calendar & Time
  'calendar-date-appointment': CalendarDateAppointmentIcon,
  'calendar-month-date': CalendarMonthDateIcon,
  'clock-time': ClockTimeIcon,
  'clock-refresh-time-arrow': ClockRefreshTimeArrowIcon,
  
  // Information & Help
  'info': InfoIcon,
  'help-question-mark': HelpQuestionMarkIcon,
  'book-open': BookOpenIcon,
  
  // Devices
  'desktop-computer-mac': DesktopComputerMacIcon,
  'mobile-phone': MobilePhoneIcon,
  
  // Other
  'maximize-expand': MaximizeExpandIcon,
  'more-horizontal': MoreHorizontalIcon,
  'search': SearchIcon,
  'filter': FilterIcon,
  'panel-left': PanelLeftIcon,
  'circle-oval': CircleOvalIcon,
  'snowflakes-weather-cold': SnowflakesWeatherColdIcon,
  'droplet-rain-weather': DropletRainWeatherIcon,
  'flower-plant': FlowerPlantIcon,
  'sun-day': SunDayIcon,
  'moon-night': MoonNightIcon,
  'calculator-compute-math': CalculatorComputeMathIcon,
  'dollar-currency': DollarCurrencyIcon,
  'dollar-sign': DollarSignIcon,
  'comment-square-chat-message': CommentSquareChatMessageIcon,
  'send-message-dm-inbox': SendMessageDmInboxIcon,
  'table-panel-window-sidebar': TablePanelWindowSidebarIcon,
  'zap-light-energy': ZapLightEnergyIcon,
};

export type IconName = keyof typeof iconMap;

interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  name: IconName | string;
  size?: number | string;
  className?: string;
}

/**
 * Render an appropriate fallback icon based on the icon name
 * This provides better UX than showing the same plus icon for everything
 */
function renderIconFallback(
  name: string,
  size: number | string,
  className?: string,
  style?: React.CSSProperties,
  props?: any
): JSX.Element {
  const sizeValue = typeof size === 'number' ? size : size;
  
  // Create semantic fallback icons based on icon name patterns
  let fallbackPath = '';
  
  if (name.includes('arrow-up') || name.includes('trending-up') || name.includes('up')) {
    fallbackPath = 'M12 19V5M5 12l7-7 7 7';
  } else if (name.includes('arrow-down') || name.includes('trending-down') || name.includes('down')) {
    fallbackPath = 'M12 5v14M19 12l-7 7-7-7';
  } else if (name.includes('arrow-left') || name.includes('chevron-left')) {
    fallbackPath = 'M19 12H5M12 19l-7-7 7-7';
  } else if (name.includes('arrow-right') || name.includes('chevron-right')) {
    fallbackPath = 'M5 12h14M12 5l7 7-7 7';
  } else if (name.includes('target') || name.includes('goal')) {
    fallbackPath = 'M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83';
  } else if (name.includes('chart') || name.includes('graph') || name.includes('activity')) {
    fallbackPath = 'M3 12h4M7 8h4M11 16h4M15 12h4M19 6h4';
  } else if (name.includes('lightning') || name.includes('bolt') || name.includes('energy')) {
    fallbackPath = 'M13 2L3 14h8l-1 8 10-12h-8l1-8z';
  } else if (name.includes('info') || name.includes('help') || name.includes('question')) {
    fallbackPath = 'M12 16v-4M12 8h.01';
  } else if (name.includes('close') || name.includes('delete') || name.includes('x')) {
    fallbackPath = 'M18 6L6 18M6 6l12 12';
  } else if (name.includes('add') || name.includes('plus')) {
    fallbackPath = 'M12 5v14M5 12h14';
  } else if (name.includes('book') || name.includes('note') || name.includes('paper')) {
    fallbackPath = 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V4.5A2.5 2.5 0 0 1 6.5 2H20v17.5';
  } else if (name.includes('settings') || name.includes('adjust')) {
    fallbackPath = 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z';
  } else {
    // Default fallback - simple square with question mark
    fallbackPath = 'M12 8v4M12 16h.01';
  }
  
  return (
    <svg
      className={cn('text-muted-foreground', className)}
      width={sizeValue}
      height={sizeValue}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      aria-hidden="true"
      {...props}
    >
      <path
        d={fallbackPath}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Icon Component (Basicons - Local SVG)
 * 
 * Renders Basicons using local SVG files from src/icons/ directory.
 * SVGs are imported via vite-plugin-svgr and rendered as React components.
 * 
 * Features:
 * - Uses local Basicons SVG files
 * - Handles color via className="text-*" or color prop
 * - Supports size via size prop or className (h-* w-*)
 * - Graceful fallback for missing icons
 * 
 * Usage:
 * <Icon name="home-house" className="h-5 w-5 text-primary" />
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  className,
  style,
  ...props
}) => {
  // Check if icon imports failed
  if (iconImportError) {
    console.warn(`[Icon] Icon imports failed, using fallback for "${name}":`, iconImportError);
    const sizeValue = typeof size === 'number' ? size : size;
    return (
      <svg
        className={cn('text-muted-foreground', className)}
        width={sizeValue}
        height={sizeValue}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={style}
        aria-hidden="true"
        {...props}
      >
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  try {
    const IconComponent = iconMap[name];

    if (!IconComponent) {
      // Fallback: render a placeholder
      console.warn(
        `[Icon] Icon "${name}" not found in iconMap. ` +
        `Available: ${Object.keys(iconMap).slice(0, 10).join(', ')}... ` +
        `Total icons: ${Object.keys(iconMap).length}`
      );
      
      // Use semantic fallback based on icon name
      const sizeValue = typeof size === 'number' ? size : size;
      return renderIconFallback(name, sizeValue, className, style, props);
    }

    // Validate that IconComponent is actually a React component, not a string (data URI)
    // This can happen if vite-plugin-svgr fails to process the SVG correctly
    if (typeof IconComponent === 'string') {
      const iconValue = IconComponent as string;
      console.error(
        `[Icon] Icon "${name}" was imported as a string (data URI) instead of a React component. ` +
        `This indicates a problem with vite-plugin-svgr processing. ` +
        `IconComponent value: ${iconValue.substring(0, 100)}... ` +
        `This is a vite-plugin-svgr configuration issue.`
      );
      // Return a more appropriate fallback based on icon name
      const sizeValue = typeof size === 'number' ? size : size;
      return renderIconFallback(name, sizeValue, className, style, props);
    }

    // Validate it's a function (React component)
    // Note: React components can be functions or classes
    const iconType = typeof IconComponent;
    if (iconType !== 'function' && iconType !== 'object') {
      console.error(
        `[Icon] Icon "${name}" is not a valid React component. Type: ${iconType}, ` +
        `Is React element: ${React.isValidElement(IconComponent)}, Value:`,
        IconComponent
      );
      // Return fallback
      const sizeValue = typeof size === 'number' ? size : size;
      return renderIconFallback(name, sizeValue, className, style, props);
    }

    // Render the SVG component
    const sizeValue = typeof size === 'number' ? size : size;
    return React.createElement(IconComponent, {
      className: cn(className),
      width: sizeValue,
      height: sizeValue,
      style,
      ...props,
    });
  } catch (error) {
    // Catch any errors during icon rendering and log them
    console.error(`[Icon] Error rendering icon "${name}":`, error);
    
    // Return semantic fallback
    const sizeValue = typeof size === 'number' ? size : size;
    return renderIconFallback(name, sizeValue, className, style, props);
  }
};
