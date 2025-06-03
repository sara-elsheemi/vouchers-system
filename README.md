# 4Sale Backend Skeleton - Production Ready Go Project

A production-ready Go backend project skeleton with hexagonal architecture structure and minimal setup, featuring a modern React frontend with comprehensive localization and custom font integration.

## 🚀 Quick Start

### Backend (Go)
```bash
cd backend
go run main.go
```

### Frontend (React + TypeScript)
```bash
cd web
npm install
npm run dev
```

The backend runs on port 5000 and frontend on port 3000.

## 📁 Project Structure

```
├── backend/                    # Go backend with hexagonal architecture
├── web/                       # React frontend application
│   ├── src/
│   │   ├── application/       # Application layer (i18n, utils)
│   │   ├── domain/           # Domain layer (tokens, types)
│   │   ├── presentation/     # UI components and pages
│   │   └── app/             # Main app configuration
│   ├── public/
│   │   ├── fonts/           # SakrPro custom font files
│   │   └── locales/         # Translation files (en/ar)
│   └── stories/            # Storybook stories
```

## 🎨 Design System Features

### Custom Font Integration (SakrPro)
- **Exclusive Font Usage**: SakrPro is the ONLY font used throughout the entire system
- **No Fallback Fonts**: Ensures consistent branding and typography
- **Multiple Weights**: Light (300), Regular (400), Medium (500), Bold (700)
- **RTL/LTR Support**: Optimized for both English and Arabic text

**Font Files Location**: `/web/public/fonts/`
- `sakrPro-Light.otf`
- `sakrPro-Regular.otf`
- `sakrPro-Medium.otf`
- `sakrPro-Bold.otf`

**Documentation**: See `/web/README-FONT-INTEGRATION.md` for detailed font setup and customization instructions.

### Internationalization (i18n)
- **Bilingual Support**: English (LTR) and Arabic (RTL)
- **Automatic Direction Detection**: HTML dir attribute management
- **Dynamic Language Switching**: Real-time language toggle
- **RTL Layout Support**: Complete CSS overrides for Arabic layouts

**Documentation**: See `/web/README-LOCALIZATION.md` for localization setup and usage.

### Component Library
- **Tailwind CSS**: Utility-first styling with custom configuration
- **Component Variants**: Using class-variance-authority for consistent styling
- **Storybook Integration**: Interactive component documentation
- **Accessibility**: WCAG compliant components

## 🛠️ Development

### Testing
```bash
cd web
npm run test        # Run unit tests
npm run test:watch  # Run tests in watch mode
```

### Storybook
```bash
cd web
npm run storybook   # Launch Storybook on port 6006
```

### Build
```bash
cd web
npm run build       # Production build
```

## 🔧 Configuration

### Font Customization
To replace SakrPro with another custom font:

1. Replace font files in `/web/public/fonts/`
2. Update `@font-face` declarations in `/web/src/presentation/styles/fonts.css`
3. Update font family in `/web/tailwind.config.js`

### Adding New Languages
1. Add language to `SUPPORTED_LANGUAGES` in `/web/src/application/i18n/config.ts`
2. Create translation file in `/web/public/locales/{language}/common.json`
3. Add RTL support if needed in `RTL_LANGUAGES` array

## 📋 Requirements

- Node.js 18+
- Go 1.21+
- Modern browser with OpenType font support

## 🎯 Key Features

- ✅ Production-ready hexagonal architecture (Go backend)
- ✅ Modern React frontend with TypeScript
- ✅ Custom SakrPro font integration (no fallbacks)
- ✅ Comprehensive RTL/LTR localization
- ✅ TDD methodology with testing setup
- ✅ Security best practices implementation
- ✅ Component library with Storybook
- ✅ Tailwind CSS with custom design tokens

## 📝 Important Notes

**Font Policy**: This project uses SakrPro as the exclusive font family. No fallback or system fonts are used anywhere in the application to ensure consistent branding and typography across all components and pages.

**Localization**: The application fully supports both English and Arabic with proper RTL layout handling, ensuring accessibility and usability for both language speakers.

## 🚀 Deployment

The project is configured for Replit deployment. Both backend and frontend will be automatically built and served through the configured workflows.