# QR Code Redemption via WebView - Feature Documentation

## Overview

This document describes the implementation of the QR Code Redemption via WebView feature for the 4Sale Voucher System. The feature allows users to scan QR codes associated with vouchers and automatically redeem them through a secure webhook integration.

## Architecture

The implementation follows the existing onion architecture pattern with clear separation of concerns:

### Domain Layer (`src/domain/`)
- **Models** (`models/qrScanner.ts`): Core data structures and types
- **Services** (`services/qrScannerService.ts`): Business logic for QR parsing and redemption

### Application Layer (`src/application/`)
- **Hooks** (`hooks/useQRScanner.ts`): React hook for state management and camera integration

### Presentation Layer (`src/presentation/`)
- **Components** (`components/qr/QRScannerView.tsx`): Reusable QR scanner component
- **Pages** (`pages/voucher/QRScannerPage.tsx`): Full-page scanner interface

## Key Features

### 1. QR Code Scanning
- Real-time camera-based QR code detection using ZXing library
- Support for both front and back cameras
- Automatic device selection (prefers back camera for better scanning)
- Throttled scanning to prevent performance issues

### 2. Voucher Format Validation
- Secure parsing of QR codes with expected format: `Base64(voucher:{UUID}:buyer:{number})`
- UUID format validation
- Buyer ID validation
- Input sanitization to prevent XSS attacks

### 3. Webhook Integration
- Integration with existing `/webhook/voucher-redeemed` endpoint
- Automatic redemption after successful QR scan
- Manual redemption option for user control
- Comprehensive error handling

### 4. User Experience
- Auto and manual redemption flows
- Camera permission management with graceful fallbacks
- Real-time feedback and status updates
- Mobile-first responsive design
- Accessibility features (ARIA labels, keyboard navigation)

### 5. Internationalization
- Full i18n support with English and Arabic translations
- RTL layout support for Arabic
- Contextual help and troubleshooting guides

## Security Features

### Input Validation
- QR code format validation
- UUID format verification
- Buyer ID range validation
- Data length limits (max 1000 characters)

### XSS Prevention
- HTML tag removal from QR data
- Input sanitization before processing
- Safe rendering of user-provided content

### Secure Communication
- HTTPS-only webhook communication
- Proper error handling without exposing sensitive data
- Request/response validation

## Dependencies

### Production Dependencies
- `@zxing/library`: QR code detection engine
- `@zxing/browser`: Browser-specific QR code utilities
- `uuid`: UUID generation and validation
- `react-i18next`: Internationalization
- `lucide-react`: Icons

### Development Dependencies
- `@types/uuid`: TypeScript types for UUID
- `vitest`: Testing framework
- `@testing-library/react`: React component testing
- `@testing-library/jest-dom`: DOM testing utilities
- `@testing-library/user-event`: User interaction testing
- `jsdom`: DOM environment for testing

## API Integration

### Webhook Endpoint
- **URL**: `/webhook/voucher-redeemed`
- **Method**: POST
- **Content-Type**: application/json

### Request Format
```json
{
  "voucher_id": "123e4567-e89b-12d3-a456-426614174000",
  "redeemed_at": "2024-01-15T10:30:00.000Z"
}
```

### Response Format
```json
{
  "success": true,
  "message": "Voucher redeemed successfully",
  "data": {}
}
```

## Component Usage

### QRScannerView Component
```tsx
import { QRScannerView } from '../components/qr/QRScannerView';

<QRScannerView
  onRedemptionSuccess={(voucherId) => console.log('Redeemed:', voucherId)}
  onRedemptionError={(error) => console.error('Error:', error)}
  autoStart={true}
  showDeviceSelector={true}
/>
```

### QRScannerPage Component
```tsx
import { QRScannerPage } from '../pages/voucher/QRScannerPage';

<QRScannerPage
  onBack={() => navigate('/vouchers')}
  onVoucherRedeemed={(voucherId) => refreshVouchers()}
/>
```

### useQRScanner Hook
```tsx
import { useQRScanner } from '../hooks/useQRScanner';

const {
  isScanning,
  hasPermission,
  error,
  startScanning,
  stopScanning,
  videoRef
} = useQRScanner({
  config: {
    autoRedemption: true,
    scanDelay: 1000
  },
  onRedemptionSuccess: (voucherId) => console.log('Success:', voucherId)
});
```

## Testing Strategy

### Unit Tests
- QR code validation logic
- Webhook communication
- Error handling scenarios
- Input sanitization
- Camera permission handling

### Integration Tests
- Component rendering
- User interactions
- Camera integration
- State management
- Error boundaries

### Test Coverage
- Domain services: 95%+ coverage
- React components: 90%+ coverage
- Hooks: 90%+ coverage
- Error scenarios: 100% coverage

## Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Required APIs
- MediaDevices.getUserMedia()
- MediaDevices.enumerateDevices()
- Permissions API (optional)
- Canvas API
- WebRTC

### Fallbacks
- Graceful degradation for unsupported browsers
- Permission request fallbacks
- Error messaging for missing APIs

## Mobile Considerations

### Camera Access
- Automatic back camera selection for better QR scanning
- Support for device rotation
- Optimized for mobile viewports

### Performance
- Throttled scanning to preserve battery
- Efficient memory management
- Automatic cleanup of camera resources

### UX Optimizations
- Touch-friendly interface
- Large tap targets
- Clear visual feedback
- Minimal data usage

## Configuration Options

### QRScannerConfig
```typescript
interface QRScannerConfig {
  mode: 'auto' | 'manual';           // Scanning mode
  autoRedemption: boolean;           // Auto-redeem after scan
  scanDelay: number;                 // Delay between scans (ms)
  maxRetries: number;                // Max retry attempts
  timeout: number;                   // Scanning timeout (ms)
}
```

### Default Configuration
```typescript
const defaultConfig = {
  mode: 'auto',
  autoRedemption: true,
  scanDelay: 1000,
  maxRetries: 3,
  timeout: 30000
};
```

## Troubleshooting

### Common Issues

#### Camera Not Working
- Check browser permissions
- Ensure no other app is using the camera
- Try refreshing the page
- Check for HTTPS requirement

#### QR Code Not Scanning
- Ensure good lighting conditions
- Hold camera steady
- Check QR code quality
- Verify QR code format

#### Redemption Failing
- Check internet connection
- Verify webhook endpoint availability
- Check voucher validity
- Review error messages

### Debug Mode
Enable debug logging by setting:
```typescript
const qrService = new QRScannerService(baseUrl, { debug: true });
```

## Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] TypeScript compilation successful
- [ ] Linting issues resolved
- [ ] Security review completed
- [ ] Performance testing done

### Configuration
- [ ] Webhook endpoint configured
- [ ] HTTPS enabled
- [ ] Camera permissions documented
- [ ] Error monitoring setup

### Post-deployment
- [ ] Functionality testing on target devices
- [ ] Performance monitoring
- [ ] Error rate monitoring
- [ ] User feedback collection

## Future Enhancements

### Planned Features
- Batch QR code scanning
- Offline mode support
- Advanced camera controls
- QR code generation
- Analytics integration

### Performance Optimizations
- WebAssembly QR detection
- Service Worker caching
- Progressive loading
- Image optimization

## Support and Maintenance

### Monitoring
- Error rate tracking
- Performance metrics
- User adoption metrics
- Camera permission rates

### Updates
- Regular dependency updates
- Security patches
- Browser compatibility updates
- Feature enhancements based on user feedback

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Author**: 4Sale Technology Team 