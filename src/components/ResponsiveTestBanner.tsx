"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

interface ResponsiveTestBannerProps {
  className?: string;
}

export const ResponsiveTestBanner: React.FC<ResponsiveTestBannerProps> = ({ className }) => {
  const [currentViewport, setCurrentViewport] = useState<ViewportSize>('desktop');
  const [isVisible, setIsVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Show banner in development mode
  useEffect(() => {
    setIsVisible(import.meta.env.DEV);
  }, []);

  // viewportSizes: inline literals used in handlers

  const handleViewportChange = (viewport: ViewportSize) => {
    setCurrentViewport(viewport);
    setIsFullscreen(false);
    
    // Apply viewport constraints to the main content
    const mainContent = document.querySelector('main');
    if (mainContent) {
      if (viewport === 'desktop') {
        mainContent.style.maxWidth = 'none';
        mainContent.style.width = '100%';
        mainContent.style.margin = '0 auto';
      } else if (viewport === 'tablet') {
        mainContent.style.maxWidth = '768px';
        mainContent.style.width = '768px';
        mainContent.style.margin = '0 auto';
      } else if (viewport === 'mobile') {
        mainContent.style.maxWidth = '375px';
        mainContent.style.width = '375px';
        mainContent.style.margin = '0 auto';
      }
    }
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    const mainContent = document.querySelector('main');
    if (mainContent) {
      if (isFullscreen) {
        // Restore previous viewport
        handleViewportChange(currentViewport);
      } else {
        // Fullscreen
        mainContent.style.maxWidth = 'none';
        mainContent.style.width = '100%';
        mainContent.style.margin = '0';
      }
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (!isVisible) {
    return (
      <Button
        onClick={toggleVisibility}
        className="fixed top-4 right-4 z-50 h-8 w-8 p-0"
        variant="outline"
        size="sm"
      >
        <Icon name="eye-password" className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm",
      className
    )}>
      <div className="h-10 flex items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            Responsive Test
          </Badge>
          <Separator orientation="vertical" className="h-4" />
          
          {/* Viewport Toggle Group */}
          <div className="flex items-center gap-1 rounded-md border p-1">
            <Button
              variant={currentViewport === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewportChange('desktop')}
              className="h-7 px-2"
              title="Desktop (100%)"
            >
              <Icon name="desktop-computer-mac" className="h-3 w-3" />
            </Button>
            
            <Button
              variant={currentViewport === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewportChange('tablet')}
              className="h-7 px-2"
              title="Tablet (768px)"
            >
              <Icon name="mobile-phone" className="h-3 w-3" />
            </Button>
            
            <Button
              variant={currentViewport === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewportChange('mobile')}
              className="h-7 px-2"
              title="Mobile (375px)"
            >
              <Icon name="mobile-phone" className="h-3 w-3" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-4" />

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFullscreen}
              className="h-7 w-7 p-0"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              <Icon name="maximize-expand" className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="h-7 w-7 p-0"
              title="Refresh Page"
            >
              <Icon name="clock-refresh-time-arrow" className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Current Viewport Info */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {currentViewport === 'desktop' && 'Desktop (100%)'}
            {currentViewport === 'tablet' && 'Tablet (768px)'}
            {currentViewport === 'mobile' && 'Mobile (375px)'}
          </Badge>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleVisibility}
            className="h-7 w-7 p-0"
            title="Hide Responsive Tester"
          >
            <Icon name="x-close-delete" className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Hook for responsive testing
export const useResponsiveTest = () => {
  const [currentViewport, setCurrentViewport] = useState<ViewportSize>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const applyViewport = (viewport: ViewportSize) => {
    const mainContent = document.querySelector('main');
    if (!mainContent) return;

    const viewportSizes = {
      desktop: { width: '100%', maxWidth: 'none' },
      tablet: { width: '768px', maxWidth: '768px' },
      mobile: { width: '375px', maxWidth: '375px' }
    };

    const size = viewportSizes[viewport];
    mainContent.style.maxWidth = size.maxWidth;
    mainContent.style.width = size.width;
    mainContent.style.margin = '0 auto';
  };

  return {
    currentViewport,
    setCurrentViewport,
    isFullscreen,
    setIsFullscreen,
    applyViewport
  };
};
