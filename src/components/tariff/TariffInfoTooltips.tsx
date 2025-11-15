import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Icon } from '@/components/ui/icon';

interface TariffTooltipProps {
  children: React.ReactNode;
  content: string;
}

export const TariffTooltip: React.FC<TariffTooltipProps> = ({ children, content }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const UnitRateTooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TariffTooltip
      content="This is how much you pay for every kWh of energy you use. A kWh (kilowatt hour) is how energy is measured. It is the amount of energy you would use if you kept a 1,000 watt appliance (such as a small hairdryer) on for an hour."
    >
      {children}
    </TariffTooltip>
  );
};

export const StandingChargeTooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TariffTooltip
      content="A standing charge is a fixed daily amount you need to pay no matter how much energy you use. It pays for things like maintenance work and getting gas and electricity to your home."
    >
      {children}
    </TariffTooltip>
  );
};

export const VATTooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TariffTooltip
      content="VAT (Value Added Tax) is a type of sales tax which is added to your energy bill and paid to the government."
    >
      {children}
    </TariffTooltip>
  );
};

export const TariffInfoTooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TariffTooltip
      content="Your tariff is the package you have signed up to with your energy company. It is how much an energy company charges you for your gas and/or electricity."
    >
      {children}
    </TariffTooltip>
  );
};

export const InfoIcon: React.FC<{ tooltip: string }> = ({ tooltip }) => {
  return (
    <TariffTooltip content={tooltip}>
      <Icon name="help-question-mark" className="h-3 w-3 inline ml-1 cursor-help" />
    </TariffTooltip>
  );
};

