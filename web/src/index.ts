// Styles
import './presentation/styles/globals.css';

// =============================================================================
// CORE COMPONENTS
// =============================================================================
// Essential building blocks and basic UI elements
export * from './presentation/components/ui/core/Button';
export * from './presentation/components/ui/core/Badge';

// =============================================================================
// FORMS COMPONENTS  
// =============================================================================
// Input controls and form-related elements
export * from './presentation/components/ui/forms/Input';
export * from './presentation/components/ui/forms/Checkbox';
export * from './presentation/components/ui/forms/Radio';
export * from './presentation/components/ui/forms/Switch';
export * from './presentation/components/ui/forms/Select';
export * from './presentation/components/ui/forms/Slider';
export * from './presentation/components/ui/forms/Textarea';

// =============================================================================
// NAVIGATION COMPONENTS
// =============================================================================
// Components for navigation and wayfinding
export * from './presentation/components/ui/navigation/Navigation';
export * from './presentation/components/ui/navigation/Tabs';
export * from './presentation/components/ui/Breadcrumbs';
export * from './presentation/components/ui/navigation/Pagination';
export * from './presentation/components/ui/navigation/Sidebar';

// =============================================================================
// FEEDBACK COMPONENTS
// =============================================================================
// Components for user feedback and notifications
export * from './presentation/components/ui/feedback/Alert';
export * from './presentation/components/ui/feedback/Toast';

// =============================================================================
// DATA DISPLAY COMPONENTS
// =============================================================================
// Components for displaying and organizing content
export * from './presentation/components/ui/data-display/Card';
export * from './presentation/components/ui/data-display/Progress';
export * from './presentation/components/ui/data-display/Accordion';

// =============================================================================
// OVERLAY COMPONENTS
// =============================================================================
// Components that appear above other content
export * from './presentation/components/ui/overlay/Modal';
export * from './presentation/components/ui/overlay/Tooltip';
export * from './presentation/components/ui/overlay/Popover';
export * from './presentation/components/ui/overlay/DropdownMenu';

// =============================================================================
// DESIGN TOKENS
// =============================================================================
export * from './domain/tokens/colors';

// =============================================================================
// UTILITIES
// =============================================================================
export { cn } from './application/utils/cn';
export * from './application/utils/variants'; 