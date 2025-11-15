"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

interface ResponsiveTesterProps {
  className?: string;
}

export const ResponsiveTester: React.FC<ResponsiveTesterProps> = ({ className }) => {
  const [currentViewport, setCurrentViewport] = useState<ViewportSize>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const viewportSizes = {
    desktop: { width: '100%', maxWidth: 'none' },
    tablet: { width: '768px', maxWidth: '768px' },
    mobile: { width: '375px', maxWidth: '375px' }
  };

  const handleViewportChange = (viewport: ViewportSize) => {
    setCurrentViewport(viewport);
    setIsFullscreen(false);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-background border-b shadow-sm",
      className
    )}>
      <div className="h-8 flex items-center gap-1.5 rounded-md border p-1 shadow-none mx-4 my-2">
        <div 
          role="group" 
          dir="ltr" 
          className="group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs gap-1 *:data-[slot=toggle-group-item]:!size-6 *:data-[slot=toggle-group-item]:!rounded-sm"
          tabIndex={0}
          style={{ outline: 'none' }}
        >
          {/* Desktop Button */}
          <Button
            variant={currentViewport === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleViewportChange('desktop')}
            className="inline-flex items-center justify-center gap-2 text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap bg-transparent h-9 px-2 min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l"
            title="Desktop"
          >
            <Icon name="desktop-computer-mac" className="h-4 w-4" />
          </Button>

          {/* Tablet Button */}
          <Button
            variant={currentViewport === 'tablet' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleViewportChange('tablet')}
            className="inline-flex items-center justify-center gap-2 text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap bg-transparent h-9 px-2 min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l"
            title="Tablet"
          >
            <Icon name="mobile-phone" className="h-4 w-4" />
          </Button>

          {/* Mobile Button */}
          <Button
            variant={currentViewport === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleViewportChange('mobile')}
            className="inline-flex items-center justify-center gap-2 text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap bg-transparent h-9 px-2 min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l"
            title="Mobile"
          >
            <Icon name="mobile-phone" className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-4" />

          {/* Fullscreen Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFullscreen}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-6 rounded-sm p-0"
            title="Toggle Fullscreen"
          >
            <Icon name="maximize-expand" className="h-4 w-4" />
            <span className="sr-only">Toggle Fullscreen</span>
          </Button>

          <Separator orientation="vertical" className="h-4" />

          {/* Refresh Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-6 rounded-sm p-0"
            title="Refresh Preview"
          >
            <Icon name="clock-refresh-time-arrow" className="h-4 w-4" />
            <span className="sr-only">Refresh Preview</span>
          </Button>
        </div>
      </div>

      {/* Viewport Container */}
      <div 
        className={cn(
          "mx-auto transition-all duration-300 ease-in-out",
          isFullscreen ? "w-full" : "border-x border-b shadow-lg"
        )}
        style={isFullscreen ? {} : viewportSizes[currentViewport]}
      >
        <div className="min-h-screen">
          {/* This will contain the actual app content */}
        </div>
      </div>
    </div>
  );
};

// Hook to get current viewport settings
export const useResponsiveTester = () => {
  const [currentViewport, setCurrentViewport] = useState<ViewportSize>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const viewportSizes = {
    desktop: { width: '100%', maxWidth: 'none' },
    tablet: { width: '768px', maxWidth: '768px' },
    mobile: { width: '375px', maxWidth: '375px' }
  };

  return {
    currentViewport,
    setCurrentViewport,
    isFullscreen,
    setIsFullscreen,
    viewportSizes
  };
};
