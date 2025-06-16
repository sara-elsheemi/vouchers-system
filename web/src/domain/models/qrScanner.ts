// Domain models for QR scanner functionality
export interface QRScanResult {
  data: string;
  timestamp: Date;
  isValid: boolean;
}

export interface VoucherQRData {
  voucherId: string;
  buyerId: number;
  format: 'voucher' | 'unknown';
}

export interface QRScannerState {
  isScanning: boolean;
  hasPermission: boolean | null;
  error: string | null;
  lastScanResult: QRScanResult | null;
  cameraDevices: MediaDeviceInfo[];
  selectedDeviceId: string | null;
}

export interface QRRedemptionRequest {
  voucher_id: string;
  redeemed_at: string; // ISO string format
}

export interface QRRedemptionResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Domain events
export interface QRScanEvent {
  type: 'scan_success' | 'scan_error' | 'permission_denied' | 'camera_error';
  data?: any;
  error?: string;
  timestamp: Date;
}

// Validation types
export type QRValidationResult = {
  isValid: boolean;
  voucherData?: VoucherQRData;
  error?: string;
};

// Camera permission states
export type CameraPermissionState = 'granted' | 'denied' | 'prompt' | 'unknown';

// Scanner modes
export type ScannerMode = 'auto' | 'manual';

export interface QRScannerConfig {
  mode: ScannerMode;
  autoRedemption: boolean;
  scanDelay: number; // milliseconds between scans
  maxRetries: number;
  timeout: number; // milliseconds
} 