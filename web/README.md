# 4Sale Web Design System

A comprehensive, production-ready React design system built with TypeScript, Tailwind CSS, and accessibility in mind. **Featuring colors and design tokens extracted from Figma design specifications for 4Sale and Q8car brands.**

[![npm version](https://badge.fury.io/js/%404saletech%2Fweb-design-system.svg)](https://badge.fury.io/js/%404saletech%2Fweb-design-system)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)](https://storybook.js.org/)

## 🎨 Figma Integration

This design system is built based on comprehensive Figma design specifications, featuring:

- **4Sale Brand Colors** - Primary blue palette (#1D8EFF)
- **Q8car Brand Colors** - Secondary teal palette (#0C86AE) 
- **Semantic Colors** - Success (#10B981), Warning (#FFC107), Error (#E53D3D), Energy (#FB8C00)
- **Neutral Palette** - Carefully crafted grayscale with specific use cases:
  - Shade 50 (#f5f6f7): Main background
  - Shade 100 (#EBEDF0): Divider color, secondary buttons
  - Shade 200 (#DCDFE3): Web stroke color, placeholder images
  - Shade 400 (#A6AEBB): Placeholder text
  - Shade 600 (#6B788E): Secondary text
  - Shade 900 (#092B4C): Main text

## ✨ Features

- 🎨 **Figma-Based Design Tokens** - Colors and specifications extracted from actual design files
- 🎯 **TypeScript First** - Full type safety and excellent developer experience
- 🎭 **Tailwind CSS** - Utility-first styling with custom design tokens
- ♿ **Accessibility** - WCAG 2.1 AA compliant components
- 📱 **Responsive** - Mobile-first design approach
- 🌙 **Dark Mode** - Built-in theme switching support
- 📚 **Storybook** - Interactive component documentation with 200+ stories
- 🧪 **Testing** - Comprehensive test coverage with Vitest
- 📦 **Tree Shakeable** - Import only what you need
- ⚡ **ES Modules** - Modern module system support
- 🔧 **Developer Experience** - Hot reload, TypeScript intellisense, and comprehensive documentation

## 📦 Installation

```bash
npm install @4saletech/web-design-system
# or
yarn add @4saletech/web-design-system
# or
pnpm add @4saletech/web-design-system
```

## 🚀 Quick Start

### 1. Import Styles

Import the CSS file in your app's entry point:

```tsx
// In your main.tsx or App.tsx
import '@4saletech/web-design-system/dist/style.css';
```

### 2. Use Components

```tsx
import { Button, Card, Input, Toast, useToast } from '@4saletech/web-design-system';

function App() {
  const { toast } = useToast();

  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to 4Sale Design System</h1>
      <Input 
        label="Email" 
        type="email" 
        placeholder="Enter your email"
        className="mb-4"
      />
      <Button 
        variant="primary" 
        size="lg"
        onClick={() => toast({ title: "Success!", description: "Welcome to our design system" })}
      >
        Get Started
      </Button>
    </Card>
  );
}
```

## 🧩 Components

### Core Components
- **Button** - Versatile button with multiple variants, sizes, and states
- **Badge** - Status indicators and labels with dismissible functionality
- **Alert** - Important messages and notifications with semantic variants

### Form Components
- **Input** - Form input with validation, icons, and helper text
- **Checkbox** - Checkbox with indeterminate state and descriptions
- **Radio** - Radio button groups with validation
- **Switch** - Toggle switches with multiple variants
- **Select** - Dropdown select with search and multi-select
- **Slider** - Range sliders with marks and tooltips
- **Textarea** - Multi-line text input with auto-resize

### Navigation Components
- **Navigation** - Responsive navigation bars with dropdowns
- **Tabs** - Horizontal and vertical tab navigation
- **Breadcrumbs** - Hierarchical navigation with custom separators
- **Pagination** - Page navigation with various configurations
- **Sidebar** - Collapsible sidebar navigation

### Feedback Components
- **Toast** - Non-intrusive notifications with actions
- **Modal** - Dialog overlays with multiple sizes
- **Tooltip** - Contextual help with smart positioning
- **Popover** - Rich content overlays

### Interactive Components
- **Accordion** - Collapsible content sections
- **DropdownMenu** - Context menus with submenus
- **Progress** - Linear, circular, and step progress indicators

### Data Display Components
- **Card** - Container component with header and footer support

## 🎨 Design Tokens

### Brand Colors

```tsx
import { colors } from '@4saletech/web-design-system';

// 4Sale Primary (Blue)
colors.primary[500] // #1D8EFF

// Q8car Secondary (Teal)  
colors.secondary[500] // #0C86AE

// Semantic colors
colors.success[500]  // #10B981
colors.warning[500]  // #FFC107
colors.error[500]    // #E53D3D
colors.energy[500]   // #FB8C00
```

### Neutral Colors

```tsx
// Figma-specified neutral palette
colors.neutral[50]   // #f5f6f7 - Main BG
colors.neutral[100]  // #EBEDF0 - Divider Color
colors.neutral[200]  // #DCDFE3 - Web Stroke Color
colors.neutral[400]  // #A6AEBB - Placeholder text
colors.neutral[600]  // #6B788E - Secondary text
colors.neutral[900]  // #092B4C - Main text
```

## 🎭 Theming

### CSS Custom Properties

The design system uses CSS custom properties based on Figma specifications:

```css
:root {
  --primary: 213 100% 57%;        /* #1D8EFF */
  --secondary: 194 85% 36%;       /* #0C86AE */
  --success: 160 84% 39%;         /* #10B981 */
  --warning: 45 100% 52%;         /* #FFC107 */
  --destructive: 0 73% 57%;       /* #E53D3D */
  --foreground: 210 65% 15%;      /* #092B4C */
  --muted: 210 17% 95%;           /* #f5f6f7 */
  --border: 210 16% 82%;          /* #DCDFE3 */
}

.dark {
  --background: 210 65% 15%;      /* #092B4C */
  --foreground: 0 0% 100%;        /* #ffffff */
  /* ... more dark mode variables */
}
```

### Custom Theme

```tsx
// Create custom theme
const customTheme = {
  colors: {
    primary: {
      50: '#eff6ff',
      500: '#1D8EFF',
      900: '#1e3a8a',
    }
  }
};
```

## 📚 Component Examples

### Button Variants

```tsx
<Button variant="primary">4Sale Primary</Button>
<Button variant="secondary">Q8car Secondary</Button>
<Button variant="destructive">Error Action</Button>
<Button variant="outline">Outlined</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link Style</Button>
```

### Button Sizes

```tsx
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

### Form Components

```tsx
// Input with validation
<Input 
  label="Email"
  type="email"
  placeholder="Enter your email"
  error="Please enter a valid email"
  required
/>

// Select with search
<Select
  label="Country"
  placeholder="Select country"
  searchable
  options={countries}
/>

// Switch with description
<Switch 
  label="Enable notifications"
  description="Receive email notifications about updates"
/>
```

### Feedback Components

```tsx
// Toast notifications
const { toast } = useToast();

toast({
  title: "Success!",
  description: "Your changes have been saved.",
  variant: "success"
});

// Modal dialog
<Modal open={isOpen} onOpenChange={setIsOpen}>
  <ModalHeader>
    <ModalTitle>Confirm Action</ModalTitle>
  </ModalHeader>
  <ModalContent>
    Are you sure you want to delete this item?
  </ModalContent>
  <ModalFooter>
    <Button variant="outline" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button variant="destructive" onClick={handleDelete}>
      Delete
    </Button>
  </ModalFooter>
</Modal>
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/4SaleTech/web-design-system.git
cd web-design-system

# Install dependencies
npm install

# Start development server
npm run dev

# Start Storybook
npm run storybook
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests with Vitest
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run type-check` - Check TypeScript types
- `npm run storybook` - Start Storybook
- `npm run build-storybook` - Build Storybook

## 🧪 Testing

The design system includes comprehensive testing:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📖 Documentation

- **Storybook**: Interactive component documentation with live examples
- **TypeScript**: Full type definitions for excellent IDE support
- **README**: Comprehensive usage guide
- **Deployment Guide**: Instructions for publishing and CI/CD

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Guidelines

- Follow Figma design specifications for colors and spacing
- Maintain consistency with established design tokens
- Include TypeScript types for all props
- Add Storybook stories for new components
- Write comprehensive tests
- Follow accessibility guidelines (WCAG 2.1 AA)

### Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-component`
3. Make your changes following the design specifications
4. Add tests for new functionality
5. Run tests: `npm run test`
6. Update documentation
7. Commit your changes: `git commit -m 'Add new component'`
8. Push to the branch: `git push origin feature/new-component`
9. Submit a pull request

## 📋 Roadmap

- [ ] Additional form components (DatePicker, TimePicker)
- [ ] Data visualization components (Charts, Graphs)
- [ ] Layout components (Grid, Stack, Container)
- [ ] Advanced navigation (Command palette, Mega menu)
- [ ] Animation utilities and presets
- [ ] Theme builder and customization tools

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 📞 Support

- 📖 [Documentation](https://4saletech.github.io/web-design-system)
- 🐛 [Issues](https://github.com/4SaleTech/web-design-system/issues)
- 💬 [Discussions](https://github.com/4SaleTech/web-design-system/discussions)
- 🎨 [Figma Design System](https://www.figma.com/design/2ikSLwMnZaK48zDtz254qT/Web-%7C-Shared-components)

## 🏢 About 4Sale Technology

This design system is built and maintained by the 4Sale Technology team. We're committed to creating consistent, accessible, and beautiful user experiences across all our products.

---

Made with ❤️ by [4Sale Technology](https://4sale.com) 