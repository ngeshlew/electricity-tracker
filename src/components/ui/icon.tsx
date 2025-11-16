import React from 'react';
import { cn } from '@/lib/utils';

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
 */
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
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    // Fallback: render a placeholder
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[Icon] Basicons icon "${name}" not found in iconMap.`,
        `Available icons: ${Object.keys(iconMap).slice(0, 20).join(', ')}, ...`
      );
    }
    
    if (process.env.NODE_ENV === 'production') {
      return null as unknown as JSX.Element;
    }
    
    // Render a simple placeholder square
    return (
      <svg
        className={cn('text-muted-foreground', className)}
        width={typeof size === 'number' ? size : size}
        height={typeof size === 'number' ? size : size}
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

  // Render the SVG component
  const sizeValue = typeof size === 'number' ? size : size;
  return (
    <IconComponent
      className={cn(className)}
      width={sizeValue}
      height={sizeValue}
      style={style}
      {...props}
    />
  );
};
