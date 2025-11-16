/**
 * Seasonal Color Utilities
 * 
 * Provides type-safe access to seasonal color design tokens.
 */

export type Season = 'Winter' | 'Spring' | 'Summer' | 'Autumn';

/**
 * Get the CSS variable name for a season's color
 */
export const getSeasonColorToken = (season: Season): string => {
  switch (season) {
    case 'Winter':
      return 'var(--color-season-winter)';
    case 'Spring':
      return 'var(--color-season-spring)';
    case 'Summer':
      return 'var(--color-season-summer)';
    case 'Autumn':
      return 'var(--color-season-autumn)';
    default:
      return 'var(--muted-foreground)';
  }
};

/**
 * Get the color value for a season
 * Returns the CSS variable reference for use in inline styles
 */
export const getSeasonColor = (season: Season | string): string => {
  const normalizedSeason = season.charAt(0).toUpperCase() + season.slice(1) as Season;
  
  switch (normalizedSeason) {
    case 'Winter':
      return 'var(--color-season-winter)';
    case 'Spring':
      return 'var(--color-season-spring)';
    case 'Summer':
      return 'var(--color-season-summer)';
    case 'Autumn':
      return 'var(--color-season-autumn)';
    default:
      return 'var(--muted-foreground)';
  }
};

/**
 * Season constants for type safety
 */
export const SEASONS = {
  WINTER: 'Winter' as const,
  SPRING: 'Spring' as const,
  SUMMER: 'Summer' as const,
  AUTUMN: 'Autumn' as const,
} as const;

