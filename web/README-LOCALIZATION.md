# Localization & RTL/LTR Infrastructure

## Overview

This project includes a comprehensive localization system that supports both Arabic (RTL) and English (LTR) languages with automatic direction switching and proper component mirroring.

## Features

- **Runtime Language Switching**: Switch between Arabic and English without page reload
- **Automatic Direction Detection**: HTML attributes (`dir`, `lang`) update automatically
- **Component Mirroring**: All UI components adapt to text direction
- **Visual Consistency**: Maintains design integrity across both directions
- **Production Ready**: Built with performance and accessibility in mind

## File Structure

```
web/src/
├── application/i18n/
│   ├── config.ts                 # i18n configuration
│   ├── LocalizationProvider.tsx  # React context provider
│   ├── rtl-styles.css            # RTL/LTR CSS overrides
│   └── index.ts                  # Exports
├── presentation/
│   ├── components/ui/LanguageSwitcher/
│   │   ├── LanguageSwitcher.tsx  # Language switcher component
│   │   └── index.ts
│   └── pages/
│       └── SimpleLocalizationDemo.tsx  # Demo page
└── public/locales/
    ├── en/common.json            # English translations
    └── ar/common.json            # Arabic translations
```

## Implementation Details

### 1. Language Configuration

The system supports two languages:
- **English (en)**: LTR direction
- **Arabic (ar)**: RTL direction

Configuration is in `src/application/i18n/config.ts`:

```typescript
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  ar: 'العربية'
} as const;

export const RTL_LANGUAGES: SupportedLanguage[] = ['ar'];
```

### 2. Translation Files

Translation files are stored in `public/locales/{language}/common.json`:

**English** (`public/locales/en/common.json`):
```json
{
  "welcome": "Welcome to 4Sale Design System",
  "switchLanguage": "Switch to Arabic"
}
```

**Arabic** (`public/locales/ar/common.json`):
```json
{
  "welcome": "مرحباً بك في نظام تصميم فور سيل",
  "switchLanguage": "التبديل إلى الإنجليزية"
}
```

### 3. RTL/LTR CSS Support

The `rtl-styles.css` file provides comprehensive CSS overrides for proper RTL support:

- Automatic text alignment adjustments
- Flex direction reversals for RTL
- Margin and padding corrections
- Border radius adjustments
- Form element alignment
- Table and navigation mirroring

### 4. HTML Attributes

The system automatically updates HTML attributes:

```html
<!-- English -->
<html dir="ltr" lang="en">
<body class="ltr lang-en">

<!-- Arabic -->
<html dir="rtl" lang="ar">
<body class="rtl lang-ar">
```

## How to Use

### Basic Implementation

1. **Import the demo component**:
```typescript
import { SimpleLocalizationDemo } from './presentation/pages/SimpleLocalizationDemo';
```

2. **Use in your app**:
```typescript
function App() {
  return <SimpleLocalizationDemo />;
}
```

### Adding New Languages

1. **Update language configuration**:
```typescript
// In config.ts
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  ar: 'العربية',
  fr: 'Français' // Add new language
} as const;

// Add to RTL languages if needed
export const RTL_LANGUAGES: SupportedLanguage[] = ['ar', 'ur'];
```

2. **Create translation file**:
```
public/locales/fr/common.json
```

3. **Add translations**:
```json
{
  "welcome": "Bienvenue au système de conception 4Sale",
  "switchLanguage": "Passer à l'anglais"
}
```

### Adding New Translation Keys

1. **Add to English file** (`public/locales/en/common.json`):
```json
{
  "newKey": "English text"
}
```

2. **Add to Arabic file** (`public/locales/ar/common.json`):
```json
{
  "newKey": "النص العربي"
}
```

3. **Use in components**:
```typescript
const t = translations[language];
<p>{t.newKey}</p>
```

## Testing RTL/LTR Components

### Visual Testing Checklist

When adding new components, verify:

- ✅ **Text Alignment**: Text flows correctly in both directions
- ✅ **Button Positioning**: Buttons maintain proper spacing and alignment
- ✅ **Icon Placement**: Icons appear on correct side for each direction
- ✅ **Form Fields**: Input fields align properly with labels
- ✅ **Navigation**: Menu items flow in correct direction
- ✅ **Tables**: Headers and data align consistently
- ✅ **Cards/Layouts**: Content maintains visual hierarchy
- ✅ **Spacing**: Margins and padding work in both directions

### Component Testing Pattern

```typescript
// Test component in both languages
const TestComponent = () => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  
  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <button onClick={() => setLanguage(lang => lang === 'en' ? 'ar' : 'en')}>
        Switch Language
      </button>
      <YourComponent />
    </div>
  );
};
```

## Development Guidelines

### CSS Best Practices

1. **Use logical properties when possible**:
```css
/* Preferred */
margin-inline-start: 1rem;
padding-inline-end: 0.5rem;

/* Instead of */
margin-left: 1rem;
padding-right: 0.5rem;
```

2. **Use text-start/text-end instead of text-left/text-right**:
```css
/* Preferred */
text-align: start;

/* Instead of */
text-align: left;
```

3. **Test with actual Arabic text**:
- Use real Arabic content for testing
- Verify text doesn't overflow containers
- Check line-height for Arabic fonts

### Accessibility Considerations

- HTML `lang` attribute is automatically set
- Text direction (`dir`) is properly configured
- Screen readers work correctly in both languages
- Keyboard navigation follows natural flow

## Troubleshooting

### Common Issues

1. **Text not aligning properly**:
   - Check if RTL CSS overrides are loaded
   - Verify `dir` attribute is set on HTML element

2. **Components not mirroring**:
   - Ensure CSS specificity is correct
   - Check if component has custom styles overriding RTL rules

3. **Layout breaking in RTL**:
   - Review flex-direction overrides
   - Check margin/padding adjustments
   - Verify border-radius corrections

### Debugging Steps

1. **Check HTML attributes**:
```javascript
console.log(document.documentElement.getAttribute('dir'));
console.log(document.documentElement.getAttribute('lang'));
```

2. **Verify CSS classes**:
```javascript
console.log(document.body.className);
// Should include 'rtl' or 'ltr' and 'lang-ar' or 'lang-en'
```

3. **Test component isolation**:
```typescript
// Wrap component with specific direction for testing
<div dir="rtl" className="rtl lang-ar">
  <YourComponent />
</div>
```

## Performance Notes

- Translation files are loaded asynchronously
- CSS overrides are minimal and scoped
- Language switching is instant (no page reload)
- Browser language preferences are respected

## Browser Support

- Modern browsers with CSS logical properties support
- Fallbacks provided for older browsers
- Progressive enhancement approach
- Works with screen readers and assistive technologies

---

For questions or issues with the localization system, refer to the demo page or create an issue in the project repository.