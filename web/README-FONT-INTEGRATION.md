# SakrPro Font Integration Guide

## Overview

This project uses **SakrPro** as the exclusive custom web font across the entire system. No fallback fonts are used to ensure consistent typography and branding.

## Font Assets

The SakrPro font family includes four weights:
- **Light (300)**: `sakrPro-Light.otf`
- **Regular (400)**: `sakrPro-Regular.otf`
- **Medium (500)**: `sakrPro-Medium.otf`
- **Bold (700)**: `sakrPro-Bold.otf`

All font files are located in: `/web/public/fonts/`

## Implementation Details

### 1. Font Loading
- Font files are loaded via `@font-face` declarations in `/web/src/presentation/styles/fonts.css`
- Font display is set to `swap` for optimal loading performance
- All fonts use OpenType format (.otf)

### 2. Global Font Application
- SakrPro is applied globally through CSS reset in `/web/src/presentation/styles/global.css`
- Tailwind configuration updated to use only SakrPro for all font families
- All HTML elements, form elements, and components inherit SakrPro

### 3. Tailwind Configuration
```javascript
fontFamily: {
  sans: ["SakrPro"],
  mono: ["SakrPro"],
  serif: ["SakrPro"],
  display: ["SakrPro"],
  body: ["SakrPro"],
}
```

### 4. Font Weights
- `.font-light` → 300 (Light)
- `.font-normal` → 400 (Regular)
- `.font-medium` → 500 (Medium)
- `.font-bold` → 700 (Bold)

## RTL/LTR Support

SakrPro supports both English (LTR) and Arabic (RTL) text rendering:
- Proper character shaping for Arabic text
- Correct text direction handling
- Consistent appearance across both languages

## Adding/Updating Fonts

### To Replace SakrPro with Another Font:

1. **Replace font files** in `/web/public/fonts/`:
   ```bash
   # Remove existing fonts
   rm web/public/fonts/*.otf
   
   # Add new font files
   cp your-new-fonts/* web/public/fonts/
   ```

2. **Update font declarations** in `/web/src/presentation/styles/fonts.css`:
   ```css
   @font-face {
     font-family: 'YourNewFont';
     src: url('/fonts/your-font-regular.otf') format('opentype');
     font-weight: 400;
     font-style: normal;
     font-display: swap;
   }
   ```

3. **Update global CSS** in `/web/src/presentation/styles/fonts.css`:
   ```css
   * {
     font-family: 'YourNewFont';
   }
   ```

4. **Update Tailwind config** in `/web/tailwind.config.js`:
   ```javascript
   fontFamily: {
     sans: ["YourNewFont"],
     mono: ["YourNewFont"],
     // ... other variants
   }
   ```

### To Add Additional Font Weights:

1. Add new font files to `/web/public/fonts/`
2. Add corresponding `@font-face` declarations with appropriate `font-weight` values
3. Add utility classes in global CSS if needed

## Font Loading Optimization

- **Preload critical fonts** (optional):
  ```html
  <link rel="preload" href="/fonts/sakrPro-Regular.otf" as="font" type="font/otf" crossorigin>
  ```

- **Font display strategy**: Uses `swap` for better loading performance
- **Format optimization**: Consider converting to WOFF2 for smaller file sizes

## Browser Support

- OpenType (.otf) format is supported in all modern browsers
- Fallback handling: None (as per requirements)
- Font loading: Progressive enhancement with `font-display: swap`

## Testing

Visit `/font-demo` to see:
- All font weights in English and Arabic
- Typography scale demonstration
- UI components using SakrPro
- Form elements with custom font

## Important Notes

⚠️ **NO FALLBACK FONTS**: This project intentionally uses NO fallback fonts. SakrPro is the only font used throughout the entire system.

⚠️ **Font Override Prevention**: All CSS includes `!important` declarations to prevent any component from overriding the font family.

⚠️ **Consistent Usage**: Every HTML element, component, and form element uses SakrPro exclusively.

## Troubleshooting

### Font Not Loading
1. Check font file paths in browser DevTools
2. Verify font files exist in `/web/public/fonts/`
3. Check browser console for 404 errors
4. Ensure proper MIME type for .otf files

### Font Not Applying
1. Check CSS specificity and `!important` rules
2. Verify global CSS import order
3. Clear browser cache and hard refresh
4. Check for conflicting CSS rules

### Performance Issues
1. Consider converting to WOFF2 format
2. Implement font preloading for critical fonts
3. Use font-display: swap (already implemented)
4. Optimize font file sizes