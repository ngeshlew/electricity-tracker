import React, { Suspense, lazy, ComponentType } from 'react';
import { Skeleton, ChartSkeleton, CardSkeleton } from './ui/skeleton';

interface LazyWrapperProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  fallback = <Skeleton className="h-64 w-full" />, 
  children 
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

// Lazy load heavy components
export const LazyMonthlyOverview = lazy(() => 
  import('./dashboard/MonthlyOverview').then(module => ({ 
    default: module.MonthlyOverview 
  }))
);

export const LazyWeeklyPieChart = lazy(() => 
  import('./dashboard/WeeklyPieChart').then(module => ({ 
    default: module.WeeklyPieChart 
  }))
);

export const LazyDailyBreakdown = lazy(() => 
  import('./dashboard/DailyBreakdown').then(module => ({ 
    default: module.DailyBreakdown 
  }))
);

export const LazyConsumptionChart = lazy(() => 
  import('./dashboard/ConsumptionChart').then(module => ({ 
    default: module.ConsumptionChart 
  }))
);

export const LazyExportOptions = lazy(() => 
  import('./analytics/ExportOptions').then(module => ({ 
    default: module.ExportOptions 
  }))
);

export const LazyStatementUpload = lazy(() => 
  import('./statements/StatementUpload').then(module => ({ 
    default: module.StatementUpload 
  }))
);

// Higher-order component for lazy loading with custom fallback
export function withLazyLoading<T extends Record<string, any>>(
  Component: ComponentType<T>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }));
  
  return function LazyLoadedComponent(props: T) {
    return (
      <Suspense fallback={fallback || <CardSkeleton />}>
        <LazyComponent {...(props as any)} />
      </Suspense>
    );
  };
}

// Lazy load with chart skeleton fallback
export function withChartLazyLoading<T extends Record<string, any>>(Component: ComponentType<T>) {
  return withLazyLoading(Component, <ChartSkeleton />);
}

// Lazy load with card skeleton fallback
export function withCardLazyLoading<T extends Record<string, any>>(Component: ComponentType<T>) {
  return withLazyLoading(Component, <CardSkeleton />);
}
