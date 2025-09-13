# PostCSS Configuration Guide

## Overview

This project uses PostCSS with Tailwind CSS v3+ and requires the `@tailwindcss/postcss` plugin for proper functionality.

## Quick Fix

If you encounter PostCSS errors, run:

```bash
npm run fix:postcss
```

## Manual Setup

### 1. Install Dependencies

```bash
npm install @tailwindcss/postcss tailwindcss postcss autoprefixer
```

### 2. Configure PostCSS

Create or update `postcss.config.js`:

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

### 3. Validate Configuration

```bash
npm run validate:postcss
```

## Troubleshooting

### Common Issues

1. **"PostCSS plugin has moved to a separate package"**
   - Solution: Install `@tailwindcss/postcss` and update PostCSS config

2. **"Cannot resolve @tailwindcss/postcss"**
   - Solution: Run `npm install @tailwindcss/postcss`

3. **CSS not being processed**
   - Solution: Clear Vite cache with `npm run clean`

### Validation Scripts

- `npm run validate:postcss` - Check PostCSS configuration
- `npm run validate:all` - Run all validations
- `npm run fix:postcss` - Auto-fix common issues

## Configuration Files

- `postcss.config.js` - PostCSS configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `vite.config.ts` - Vite configuration with path aliases

## Testing

Run the PostCSS tests:

```bash
npm test -- postcss.test.js
```

## Edge Cases Handled

1. **Missing Dependencies**: Auto-install required packages
2. **Incorrect Configuration**: Auto-fix PostCSS config
3. **Cache Issues**: Clear Vite cache automatically
4. **Version Conflicts**: Validate package versions
5. **Path Resolution**: Ensure proper module resolution

## Production Considerations

- All configurations are production-ready
- Error handling prevents build failures
- Comprehensive validation ensures reliability
- Fallback configurations available

