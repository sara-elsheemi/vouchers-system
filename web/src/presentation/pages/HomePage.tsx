import React from 'react';
import { Button } from '../components/Button/Button';
import { Card } from '../components/ui/data-display/Card/Card';
import { Badge } from '../components/ui/data-display/Badge/Badge';
import { Input } from '../components/ui/forms/Input/Input';
import { Select } from '../components/ui/forms/Select/Select';
import { Breadcrumbs } from '../components/ui/Breadcrumbs/Breadcrumbs';
import { Alert } from '../components/ui/feedback/Alert/Alert';
import { Progress } from '../components/ui/feedback/Progress/Progress';

export const HomePage: React.FC = () => {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Components', href: '/components' },
    { label: 'Showcase', href: '/showcase' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            4Sale Design System
          </h1>
          <p className="text-lg text-gray-600">
            A comprehensive React design system with TypeScript and Tailwind CSS
          </p>
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Alerts Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Alerts & Feedback</h2>
          <div className="space-y-4">
            <Alert variant="success" title="Success">
              Design system imported and configured successfully!
            </Alert>
            <Alert variant="warning" title="Warning">
              This is a test page showcasing the design system components.
            </Alert>
            <Alert variant="error" title="Error">
              This is an example error alert component.
            </Alert>
          </div>
        </Card>

        {/* Buttons Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="destructive">Destructive Button</Button>
          </div>
        </Card>

        {/* Forms Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Form Components</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Field
              </label>
              <Input placeholder="Enter your text here..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Dropdown
              </label>
              <Select placeholder="Select an option">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
            </div>
          </div>
        </Card>

        {/* Data Display Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Data Display</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progress Bar
              </label>
              <Progress value={75} />
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-500">
          <p>Powered by 4Sale Design System • Built with React + TypeScript + Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
};