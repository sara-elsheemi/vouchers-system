# 4Sale Design System Web Application

A comprehensive React frontend application built with the 4Sale Design System, organized using onion architecture principles.

## 🏗️ Architecture Overview

This project follows **Onion Architecture** (Clean Architecture) principles to ensure maintainability, testability, and separation of concerns:

```
web/
├── src/
│   ├── app/                    # Application configuration and entry points
│   │   └── App.tsx            # Main App component with providers and routing
│   ├── presentation/          # UI Layer - Components, pages, styles
│   │   ├── components/        # Design system components (imported from 4Sale DS)
│   │   ├── pages/            # Application pages and layouts
│   │   └── styles/           # Global styles and CSS
│   ├── application/          # Application Layer - Business logic, hooks, use cases
│   │   └── utils/            # Utility functions and helpers
│   ├── domain/               # Domain Layer - Business models, types, validation
│   │   └── tokens/           # Design tokens and theme definitions
│   └── infrastructure/       # Infrastructure Layer - API clients, external services
├── public/                   # Static assets
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## 🎨 Design System Integration

This application is built on top of the **4Sale Design System** (`@4saletech/web-design-system`), which provides:

- **Core Components**: Buttons, Badges, Cards, etc.
- **Form Components**: Inputs, Selects, Checkboxes, etc.
- **Navigation Components**: Breadcrumbs, Tabs, Pagination, etc.
- **Feedback Components**: Alerts, Toasts, Progress indicators
- **Data Display Components**: Tables, Lists, Accordions, etc.
- **Overlay Components**: Modals, Tooltips, Popovers, etc.
- **Design Tokens**: Colors, typography, spacing from Figma specifications

### Brand Support
- **4Sale Brand**: Primary brand colors and styling
- **Q8car Brand**: Secondary brand implementation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone and setup the project:**
   ```bash
   cd web
   npm install
   ```

2. **Development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

3. **Build for production:**
   ```bash
   npm run build
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run storybook` - Start Storybook for component development

## 🔧 Configuration

### Vite Configuration
The project uses Vite for build tooling with:
- React plugin for JSX support
- TypeScript support
- Tailwind CSS integration
- Path aliases (`@/` maps to `./src`)
- Development server on port 3000

### Tailwind CSS
Tailwind is configured with the design system tokens and includes:
- Custom color palette from 4Sale/Q8car brands
- Typography scales
- Spacing system
- Component classes

## 📁 Project Structure Details

### `/src/app/`
Application-level configuration, providers, and routing setup.

### `/src/presentation/`
UI layer containing all visual components and pages:
- **Components**: Design system components organized by category
- **Pages**: Application pages using the design system
- **Styles**: Global CSS and styling

### `/src/application/`
Business logic layer:
- **Utils**: Helper functions and utilities
- **Hooks**: Custom React hooks for business logic
- **Services**: Application services and workflows

### `/src/domain/`
Core business domain:
- **Tokens**: Design tokens and theme definitions
- **Types**: TypeScript type definitions
- **Models**: Business entities and validation

### `/src/infrastructure/`
External dependencies and integrations:
- **API**: HTTP clients and API integrations
- **Services**: External service integrations
- **Gateways**: Data access patterns

## 🎯 Design System Usage

### Importing Components
```typescript
import { Button, Card, Alert } from '@4saletech/web-design-system';

function MyComponent() {
  return (
    <Card>
      <Alert variant="success" title="Success">
        Operation completed successfully!
      </Alert>
      <Button variant="primary">Click me</Button>
    </Card>
  );
}
```

### Using Design Tokens
```typescript
import { colors } from '@4saletech/web-design-system';

const myStyle = {
  backgroundColor: colors.primary[500],
  color: colors.neutral.white
};
```

## 🧪 Testing

The project includes comprehensive testing setup:
- **Unit tests**: Jest + React Testing Library
- **Component tests**: Testing individual components
- **Integration tests**: Testing component interactions
- **E2E tests**: End-to-end testing scenarios

## 📚 Documentation

- **Storybook**: Interactive component documentation at `http://localhost:6006`
- **TypeScript**: Full type safety and IntelliSense support
- **Design System Docs**: Component API documentation

## 🔄 Development Workflow

1. **Component Development**: Use Storybook for isolated component development
2. **Page Development**: Build pages using design system components
3. **Testing**: Write tests for components and business logic
4. **Type Safety**: Maintain TypeScript compliance
5. **Code Quality**: Follow ESLint and Prettier configurations

## 🚀 Deployment

The application is configured for deployment on Replit and can be easily deployed to other platforms:

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy static files** from the `dist/` directory to your hosting platform

## 🤝 Contributing

1. Follow the onion architecture principles
2. Use design system components exclusively
3. Maintain TypeScript type safety
4. Write tests for new functionality
5. Update documentation as needed

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ using 4Sale Design System**