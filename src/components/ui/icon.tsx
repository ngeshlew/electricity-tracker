import React from 'react';
import { cn } from '@/lib/utils';
import {
  Plus as AddNewPlus,
  Activity as ActivityGraph,
  ChevronLeft as ArrowChevronLeft,
  ChevronRight as ArrowChevronRight,
  ArrowLeft,
  Calculator as CalculatorComputeMath,
  ChevronUp as ArrowChevronUp,
  ChevronDown as ArrowChevronDown,
  ArrowDown,
  ArrowUp,
  BarChart3 as BarChart,
  TrendingUp as ChartUpArrow,
  Target,
  Home as HomeHouse,
  BookOpen as BookNotePaper,
  Settings as AdjustSettingsHorizontal,
  Bell as NotificationBellAlarm,
  Menu as MenuHambuger,
  User as AccountUserPerson,
  LogOut as LogoutExit,
  Calendar as CalendarDateAppointment,
  LogIn as EnterLogInArrow,
  PieChart,
  HelpCircle as HelpQuestionMark,
  Sun as SunDay,
  Leaf as FlowerPlant,
  Droplets as DropletRainWeather,
  Zap as LightningEnergy,
  Edit as EditWrite,
  Trash2 as TrashDeleteBin3,
  X as XCloseDelete,
  Search,
  Filter,
  Download,
  Check as CheckGood,
  Circle as CircleOval,
  Upload as UploadArrowUp,
  Moon as MoonNight,
  DollarSign as DollarCurrency,
  AlertTriangle as AlertError,
  RefreshCw as ClockRefreshTimeArrow,
  MessageSquare as CommentSquareChatMessage,
  Smartphone as MobilePhone,
  Maximize as MaximizeExpand,
  Monitor as DesktopComputerMac,
  Info,
  MoreHorizontal,
  Eye as EyePassword,
  EyeOff as EyePasswordOff,
  Mail as MailEmailMessageInbox,
  Lock as LockPrivacy,
  Loader2 as LoadingSpinner,
  CheckCircle2,
  Clock as ClockTime,
  CalendarDays as CalendarMonthDate,
  PanelLeft as TablePanelWindowSidebar,
  Save,
  Send as SendMessageDmInbox,
  Zap as BoltIcon,
} from 'lucide-react';

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

// Icon mapping to Lucide React icons
const iconMap: Record<IconName, React.ComponentType<any>> = {
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

interface IconProps {
  name: IconName;
  size?: number | string;
  className?: string;
  color?: string;
  style?: React.CSSProperties;
}

/**
 * Icon Component
 * 
 * Wrapper component for Lucide React icons.
 * 
 * Features:
 * - Supports all mapped icons via name prop
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
      >
        <rect width="24" height="24" fill="currentColor" opacity="0.1" />
      </svg>
    );
  }

  // Convert size to number if it's a string with units
  const iconSize = typeof size === 'string' ? parseInt(size, 10) || 24 : size;

  return (
    <IconComponent
      size={iconSize}
      className={cn('inline-block', className)}
      style={{
        color: color || 'currentColor',
        ...style,
      }}
    />
  );
};
