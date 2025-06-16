// Domain service for QR scanner business logic
import { 
  QRScanResult, 
  QRValidationResult, 
  QRRedemptionRequest,
  QRRedemptionResponse 
} from '../models/qrScanner';

export class QRScannerService {
  private readonly baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Validates and parses QR code data for voucher format
   * Expected format: Base64(voucher:{UUID}:buyer:{number})
   */
  validateAndParseQRCode(qrData: string): QRValidationResult {
    try {
      // First try to decode if it's base64
      let decodedData: string;
      try {
        decodedData = atob(qrData);
      } catch {
        // If not base64, use as is
        decodedData = qrData;
      }

      // Parse voucher format: voucher:{UUID}:buyer:{number}
      const voucherRegex = /^voucher:([a-f0-9-]{36}):buyer:(\d+)$/i;
      const match = decodedData.match(voucherRegex);

      if (!match) {
        return {
          isValid: false,
          error: 'Invalid QR code format. Expected voucher format.'
        };
      }

      const [, voucherId, buyerIdStr] = match;
      
      if (!voucherId || !buyerIdStr) {
        return {
          isValid: false,
          error: 'Missing voucher ID or buyer ID in QR code.'
        };
      }

      const buyerId = parseInt(buyerIdStr, 10);

      if (isNaN(buyerId) || buyerId <= 0) {
        return {
          isValid: false,
          error: 'Invalid buyer ID in QR code.'
        };
      }

      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(voucherId)) {
        return {
          isValid: false,
          error: 'Invalid voucher ID format.'
        };
      }

      return {
        isValid: true,
        voucherData: {
          voucherId,
          buyerId,
          format: 'voucher'
        }
      };
    } catch (error) {
      return {
        isValid: false,
        error: `QR code parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Creates a scan result object
   */
  createScanResult(data: string, isValid: boolean): QRScanResult {
    return {
      data,
      timestamp: new Date(),
      isValid
    };
  }

  /**
   * Redeems a voucher via the webhook endpoint
   */
  async redeemVoucher(voucherId: string): Promise<QRRedemptionResponse> {
    try {
      const request: QRRedemptionRequest = {
        voucher_id: voucherId,
        redeemed_at: new Date().toISOString()
      };

      const response = await fetch(`${this.baseUrl}/webhook/voucher-redeemed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      return {
        success: data.success || true,
        message: data.message || 'Voucher redeemed successfully',
        data: data.data
      };
    } catch (error) {
      console.error('Voucher redemption error:', error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to redeem voucher',
      };
    }
  }

  /**
   * Validates camera permissions
   */
  async checkCameraPermission(): Promise<PermissionState> {
    try {
      if (!navigator.permissions) {
        return 'prompt';
      }

      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      return permission.state;
    } catch (error) {
      console.warn('Permission check failed:', error);
      return 'prompt';
    }
  }

  /**
   * Gets available camera devices
   */
  async getCameraDevices(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'videoinput');
    } catch (error) {
      console.error('Failed to enumerate camera devices:', error);
      return [];
    }
  }

  /**
   * Requests camera access
   */
  async requestCameraAccess(deviceId?: string): Promise<MediaStream> {
    try {
      const constraints: MediaStreamConstraints = {
        video: deviceId 
          ? { deviceId: { exact: deviceId } }
          : { facingMode: 'environment' } // Prefer back camera for QR scanning
      };

      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
      console.error('Camera access failed:', error);
      throw new Error(`Camera access denied: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Sanitizes QR data to prevent XSS
   */
  sanitizeQRData(data: string): string {
    return data
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .substring(0, 1000); // Limit length
  }

  /**
   * Validates if the scanned data looks like a voucher QR code
   */
  isVoucherQRCode(data: string): boolean {
    try {
      const validation = this.validateAndParseQRCode(data);
      return validation.isValid && validation.voucherData?.format === 'voucher';
    } catch {
      return false;
    }
  }
} 