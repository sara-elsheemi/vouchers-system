import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../src/components/ui/core/Button/Button';
import { Input } from '../src/components/ui/forms/Input/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../src/components/ui/data-display/Card/Card';
import { Badge } from '../src/components/ui/core/Badge/Badge';
import { Alert, AlertTitle, AlertDescription } from '../src/components/ui/feedback/Alert/Alert';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Star, 
  Heart, 
  Share, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  User,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Plus,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  ShoppingCart
} from 'lucide-react';

const meta: Meta = {
  title: 'Design System/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive overview of the design system showcasing all components working together in real-world scenarios. Built with Figma design specifications featuring 4Sale and Q8car brand colors.'
      }
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DesignSystemShowcase: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Design System Overview</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive React design system built with TypeScript, Tailwind CSS, and Figma design specifications. 
            Featuring 4Sale primary colors (#1D8EFF) and Q8car secondary colors (#0C86AE).
          </p>
        </div>

        {/* Color Palette */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Figma Color System</CardTitle>
            <CardDescription>Brand colors and semantic variants extracted from design specifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-2"></div>
                <p className="text-sm font-medium">Primary (4Sale)</p>
                <p className="text-xs text-muted-foreground">#1D8EFF</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-lg mx-auto mb-2"></div>
                <p className="text-sm font-medium">Secondary (Q8car)</p>
                <p className="text-xs text-muted-foreground">#0C86AE</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-success rounded-lg mx-auto mb-2"></div>
                <p className="text-sm font-medium">Success</p>
                <p className="text-xs text-muted-foreground">#10B981</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-warning rounded-lg mx-auto mb-2"></div>
                <p className="text-sm font-medium">Warning</p>
                <p className="text-xs text-muted-foreground">#FFC107</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-destructive rounded-lg mx-auto mb-2"></div>
                <p className="text-sm font-medium">Error</p>
                <p className="text-xs text-muted-foreground">#E53D3D</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-energy rounded-lg mx-auto mb-2"></div>
                <p className="text-sm font-medium">Energy</p>
                <p className="text-xs text-muted-foreground">#FB8C00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts Section */}
        <div className="mb-8 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">System Notifications</h2>
          <Alert variant="success">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Welcome to the Design System!</AlertTitle>
            <AlertDescription>
              All components are working perfectly and ready for production use.
            </AlertDescription>
          </Alert>
          
          <Alert variant="info">
            <Info className="h-4 w-4" />
            <AlertTitle>Design System Features</AlertTitle>
            <AlertDescription>
              TypeScript support, accessibility compliance (WCAG 2.1 AA), dark mode, and comprehensive testing included.
            </AlertDescription>
          </Alert>
        </div>

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Statistics Cards */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,847</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-success">+12.5%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-success">+8.2%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Growth</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+24%</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-success">+4.1%</span> from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                  <Button variant="secondary" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search & Filter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input 
                  placeholder="Search users..."
                  startIcon={<Search className="h-4 w-4" />}
                />
                <Button variant="outline" className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  Advanced Filters
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">New user registered</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">Payment pending</p>
                    <p className="text-xs text-muted-foreground">5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">System update completed</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* User Profile Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">User Profiles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card interactive>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg">
                  JS
                </div>
                <CardTitle className="text-lg">John Smith</CardTitle>
                <CardDescription>Senior Developer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>john@4sale.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Kuwait City</span>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4" />
                </Button>
                <Button className="flex-1 ml-2">View Profile</Button>
              </CardFooter>
            </Card>

            <Card interactive>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-success to-warning rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg">
                  SA
                </div>
                <CardTitle className="text-lg">Sarah Ahmed</CardTitle>
                <CardDescription>UX Designer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>sarah@q8car.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Dubai, UAE</span>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <Badge variant="outline">Figma</Badge>
                  <Badge variant="outline">Design</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4" />
                </Button>
                <Button className="flex-1 ml-2">View Profile</Button>
              </CardFooter>
            </Card>

            <Card interactive>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-destructive to-energy rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg">
                  MK
                </div>
                <CardTitle className="text-lg">Mohammed Khan</CardTitle>
                <CardDescription>Product Manager</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>mohammed@company.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Riyadh, SA</span>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <Badge variant="warning">Strategy</Badge>
                  <Badge variant="warning">Analytics</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4" />
                </Button>
                <Button className="flex-1 ml-2">View Profile</Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Form Example */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contact Form</CardTitle>
            <CardDescription>Example form using all input components with validation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input 
                  label="Full Name"
                  placeholder="Enter your full name"
                  startIcon={<User className="h-4 w-4" />}
                  required
                />
                <Input 
                  label="Email Address"
                  type="email"
                  placeholder="your@email.com"
                  startIcon={<Mail className="h-4 w-4" />}
                  success="Email format is valid"
                  required
                />
                <Input 
                  label="Phone Number"
                  type="tel"
                  placeholder="+965 1234 5678"
                  startIcon={<Phone className="h-4 w-4" />}
                  helperText="Include country code"
                />
              </div>
              <div className="space-y-4">
                <Input 
                  label="Company"
                  placeholder="Your company name"
                  helperText="Optional field"
                />
                <Input 
                  label="Password"
                  type="password"
                  placeholder="Create a secure password"
                  error="Password must be at least 8 characters"
                  required
                />
                <Input 
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full md:w-auto">
              Submit Form
            </Button>
            <Button variant="outline" className="w-full md:w-auto">
              Reset
            </Button>
          </CardFooter>
        </Card>

        {/* Badge Examples */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Status Indicators</CardTitle>
            <CardDescription>Various badge implementations for different use cases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3">User Status</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success" icon={<CheckCircle className="h-3 w-3" />}>Online</Badge>
                  <Badge variant="warning">Away</Badge>
                  <Badge variant="destructive">Offline</Badge>
                  <Badge variant="secondary">Busy</Badge>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-3">Order Status</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Pending</Badge>
                  <Badge variant="warning">Processing</Badge>
                  <Badge variant="success">Shipped</Badge>
                  <Badge>Delivered</Badge>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-3">Dismissible Tags</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge dismissible onDismiss={() => alert('React tag removed')}>React</Badge>
                  <Badge variant="secondary" dismissible onDismiss={() => alert('TypeScript tag removed')}>TypeScript</Badge>
                  <Badge variant="outline" dismissible onDismiss={() => alert('Tailwind tag removed')}>Tailwind CSS</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Component Variants Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Component Variants</CardTitle>
            <CardDescription>All component variants and sizes in one view</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Button Variants */}
              <div>
                <h4 className="text-sm font-medium mb-3">Button Variants</h4>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm">Small Primary</Button>
                  <Button>Medium Primary</Button>
                  <Button size="lg">Large Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>

              {/* Input Variants */}
              <div>
                <h4 className="text-sm font-medium mb-3">Input Variants</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input size="sm" placeholder="Small input" />
                  <Input placeholder="Medium input (default)" />
                  <Input size="lg" placeholder="Large input" />
                </div>
              </div>

              {/* Card Variants */}
              <div>
                <h4 className="text-sm font-medium mb-3">Card Variants</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card variant="default" className="p-4">
                    <p className="text-sm">Default Card</p>
                  </Card>
                  <Card variant="outlined" className="p-4">
                    <p className="text-sm">Outlined Card</p>
                  </Card>
                  <Card variant="elevated" className="p-4">
                    <p className="text-sm">Elevated Card</p>
                  </Card>
                  <Card variant="ghost" className="p-4">
                    <p className="text-sm">Ghost Card</p>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A comprehensive showcase of the entire design system with all components working together in realistic scenarios. This demonstrates the consistency, accessibility, and flexibility of the component library.'
      }
    }
  }
};

export const ColorPalette: Story = {
  render: () => (
    <div className="p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Figma Color Palette</h1>
        <p className="text-muted-foreground">Complete color system extracted from Figma design specifications</p>
      </div>

      <div className="space-y-8">
        {/* Primary Colors */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Primary (4Sale Brand)</h2>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {[25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
              <div key={shade} className="text-center">
                <div 
                  className={`w-16 h-16 rounded-lg mb-2 bg-primary-${shade}`}
                  style={{ backgroundColor: `hsl(var(--primary-${shade}))` }}
                ></div>
                <p className="text-xs font-medium">{shade}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Colors */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Secondary (Q8car Brand)</h2>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {[25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
              <div key={shade} className="text-center">
                <div 
                  className={`w-16 h-16 rounded-lg mb-2 bg-secondary-${shade}`}
                  style={{ backgroundColor: `hsl(var(--secondary-${shade}))` }}
                ></div>
                <p className="text-xs font-medium">{shade}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Semantic Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Success</h3>
            <div className="space-y-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div key={shade} className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: `hsl(var(--success-${shade}))` }}
                  ></div>
                  <span className="text-sm">{shade}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Warning</h3>
            <div className="space-y-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div key={shade} className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: `hsl(var(--warning-${shade}))` }}
                  ></div>
                  <span className="text-sm">{shade}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Error</h3>
            <div className="space-y-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div key={shade} className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: `hsl(var(--destructive-${shade}))` }}
                  ></div>
                  <span className="text-sm">{shade}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Neutral</h3>
            <div className="space-y-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div key={shade} className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: `hsl(var(--neutral-${shade}))` }}
                  ></div>
                  <span className="text-sm">{shade}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete color palette showing all available colors and their shades from the Figma design system.'
      }
    }
  }
}; 