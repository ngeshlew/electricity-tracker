import React from 'react';
import { cn } from '@/lib/utils';

// Import all Basicons SVGs as React components
import AddNewPlus from '../../icons/add-new-plus.svg?react';
import ActivityGraph from '../../icons/activity-graph.svg?react';
import ArrowChevronLeft from '../../icons/arrow-chevron-left.svg?react';
import ArrowChevronRight from '../../icons/arrow-chevron-right.svg?react';
import ArrowLeft from '../../icons/arrow-left.svg?react';
import CalculatorComputeMath from '../../icons/calculator-compute-math.svg?react';
import ArrowChevronUp from '../../icons/arrow-chevron-up.svg?react';
import ArrowChevronDown from '../../icons/arrow-chevron-down.svg?react';
import ArrowDown from '../../icons/arrow-down.svg?react';
import ArrowUp from '../../icons/arrow-up.svg?react';
import BarChart from '../../icons/bar-chart.svg?react';
import ChartUpArrow from '../../icons/chart-up-arrow.svg?react';
import Target from '../../icons/target.svg?react';
import HomeHouse from '../../icons/home-house.svg?react';
import BookNotePaper from '../../icons/book-note-paper.svg?react';
import AdjustSettingsHorizontal from '../../icons/adjust-settings-horizontal.svg?react';
import NotificationBellAlarm from '../../icons/notification-bell-alarm.svg?react';
import MenuHambuger from '../../icons/menu-hambuger.svg?react';
import AccountUserPerson from '../../icons/account-user-person.svg?react';
import LogoutExit from '../../icons/logout-exit.svg?react';
import CalendarDateAppointment from '../../icons/calendar-date-appointment.svg?react';
import EnterLogInArrow from '../../icons/enter-log-in-arrow.svg?react';
import PieChart from '../../icons/pie-chart.svg?react';
import HelpQuestionMark from '../../icons/help-question-mark.svg?react';
import SunDay from '../../icons/sun-day.svg?react';
import FlowerPlant from '../../icons/flower-plant.svg?react';
import DropletRainWeather from '../../icons/droplet-rain-weather.svg?react';
import LightningEnergy from '../../icons/lightning-energy.svg?react';
import EditWrite from '../../icons/edit-write.svg?react';
import TrashDeleteBin3 from '../../icons/trash-delete-bin-3.svg?react';
import XCloseDelete from '../../icons/x-close-delete.svg?react';
import Search from '../../icons/search.svg?react';
import Filter from '../../icons/filter.svg?react';
import Download from '../../icons/download.svg?react';
import CheckGood from '../../icons/check-good.svg?react';
import CircleOval from '../../icons/circle-oval.svg?react';
import UploadArrowUp from '../../icons/upload-arrow-up.svg?react';
import MoonNight from '../../icons/moon-night.svg?react';
import DollarCurrency from '../../icons/dollar-currency.svg?react';
import AlertError from '../../icons/alert-error.svg?react';
import ClockRefreshTimeArrow from '../../icons/clock-refresh-time-arrow.svg?react';
import CommentSquareChatMessage from '../../icons/comment-square-chat-message.svg?react';
import MobilePhone from '../../icons/mobile-phone.svg?react';
import MaximizeExpand from '../../icons/maximize-expand.svg?react';
import DesktopComputerMac from '../../icons/desktop-computer-mac.svg?react';
import Info from '../../icons/info.svg?react';
import MoreHorizontal from '../../icons/more-horizontal.svg?react';
import BoltIcon from '../../icons/lightning-energy.svg?react';
import EyePassword from '../../icons/eye-password.svg?react';
import EyePasswordOff from '../../icons/eye-password-off.svg?react';
import MailEmailMessageInbox from '../../icons/mail-email-message-inbox.svg?react';
import LockPrivacy from '../../icons/lock-privacy.svg?react';
import LoadingSpinner from '../../icons/loading-spinner.svg?react';
import CheckCircle2 from '../../icons/check-circle-2.svg?react';
import ClockTime from '../../icons/clock-time.svg?react';
import CalendarMonthDate from '../../icons/calendar-month-date.svg?react';
import TablePanelWindowSidebar from '../../icons/table-panel-window-sidebar.svg?react';
import Save from '../../icons/save.svg?react';
import SendMessageDmInbox from '../../icons/send-message-dm-inbox.svg?react';

export type IconName = 
  | 'add-new-plus'
  | 'activity-graph'
  | 'arrow-chevron-left'
  | 'arrow-chevron-right'
  | 'arrow-left'
  | 'arrow-chevron-up'
  | 'arrow-chevron-down'
  | 'arrow-down'
  | 'arrow-up'
  | 'bar-chart'
  | 'chart-up-arrow'
  | 'target'
  | 'home-house'
  | 'book-note-paper'
  | 'adjust-settings-horizontal'
  | 'notification-bell-alarm'
  | 'menu-hambuger'
  | 'account-user-person'
  | 'logout-exit'
  | 'calendar-date-appointment'
  | 'enter-log-in-arrow'
  | 'pie-chart'
  | 'help-question-mark'
  | 'sun-day'
  | 'flower-plant'
  | 'droplet-rain-weather'
  | 'lightning-energy'
  | 'eye-password'
  | 'edit-write'
  | 'trash-delete-bin-3'
  | 'x-close-delete'
  | 'search'
  | 'filter'
  | 'download'
  | 'check-good'
  | 'circle-oval'
  | 'upload-arrow-up'
  | 'moon-night'
  | 'dollar-currency'
  | 'alert-error'
  | 'clock-refresh-time-arrow'
  | 'comment-square-chat-message'
  | 'mobile-phone'
  | 'maximize-expand'
  | 'desktop-computer-mac'
  | 'info'
  | 'more-horizontal'
  | 'bolt'
  | 'eye-password'
  | 'eye-password-off'
  | 'mail-email-message-inbox'
  | 'lock-privacy'
  | 'loading-spinner'
  | 'check-circle-2'
  | 'clock-time'
  | 'calendar-month-date'
  | 'table-panel-window-sidebar'
  | 'save'
  | 'send-message-dm-inbox'
  | 'calculator-compute-math';

// Icon mapping
const iconMap: Record<IconName, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  'add-new-plus': AddNewPlus,
  'activity-graph': ActivityGraph,
  'arrow-chevron-left': ArrowChevronLeft,
  'arrow-chevron-right': ArrowChevronRight,
  'arrow-left': ArrowLeft,
  'arrow-chevron-up': ArrowChevronUp,
  'arrow-chevron-down': ArrowChevronDown,
  'arrow-down': ArrowDown,
  'arrow-up': ArrowUp,
  'bar-chart': BarChart,
  'chart-up-arrow': ChartUpArrow,
  'target': Target,
  'home-house': HomeHouse,
  'book-note-paper': BookNotePaper,
  'adjust-settings-horizontal': AdjustSettingsHorizontal,
  'notification-bell-alarm': NotificationBellAlarm,
  'menu-hambuger': MenuHambuger,
  'account-user-person': AccountUserPerson,
  'logout-exit': LogoutExit,
  'calendar-date-appointment': CalendarDateAppointment,
  'enter-log-in-arrow': EnterLogInArrow,
  'pie-chart': PieChart,
  'help-question-mark': HelpQuestionMark,
  'sun-day': SunDay,
  'flower-plant': FlowerPlant,
  'droplet-rain-weather': DropletRainWeather,
  'lightning-energy': LightningEnergy,
  'eye-password': EyePassword,
  'edit-write': EditWrite,
  'trash-delete-bin-3': TrashDeleteBin3,
  'x-close-delete': XCloseDelete,
  'search': Search,
  'filter': Filter,
  'download': Download,
  'check-good': CheckGood,
  'circle-oval': CircleOval,
  'upload-arrow-up': UploadArrowUp,
  'moon-night': MoonNight,
  'dollar-currency': DollarCurrency,
  'alert-error': AlertError,
  'clock-refresh-time-arrow': ClockRefreshTimeArrow,
  'comment-square-chat-message': CommentSquareChatMessage,
  'mobile-phone': MobilePhone,
  'maximize-expand': MaximizeExpand,
  'desktop-computer-mac': DesktopComputerMac,
  'info': Info,
  'more-horizontal': MoreHorizontal,
  'bolt': BoltIcon,
  'eye-password-off': EyePasswordOff,
  'mail-email-message-inbox': MailEmailMessageInbox,
  'lock-privacy': LockPrivacy,
  'loading-spinner': LoadingSpinner,
  'check-circle-2': CheckCircle2,
  'clock-time': ClockTime,
  'calendar-month-date': CalendarMonthDate,
  'table-panel-window-sidebar': TablePanelWindowSidebar,
  'save': Save,
  'send-message-dm-inbox': SendMessageDmInbox,
  'calculator-compute-math': CalculatorComputeMath,
};

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  className?: string;
  color?: string;
}

/**
 * Icon Component
 * 
 * Wrapper component for Basicons SVG icons.
 * 
 * Features:
 * - Supports all Basicons icons via name prop
 * - Handles color via currentColor (use className="text-*" for colors)
 * - Supports size via size prop or className (h-* w-*)
 * - Maintains SVG viewBox for proper scaling
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  className,
  color,
  style,
  ...props
}) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`);
    // Fallback: render a placeholder square
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={cn('text-muted-foreground', className)}
        style={style}
        {...props}
      >
        <rect width="24" height="24" fill="currentColor" opacity="0.1" />
      </svg>
    );
  }

  return (
    <IconComponent
      width={size}
      height={size}
      className={cn('inline-block', className)}
      style={{
        color: color || 'currentColor',
        ...style,
      }}
      {...props}
    />
  );
};

