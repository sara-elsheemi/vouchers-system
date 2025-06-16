// Unit tests for QR Scanner Service
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QRScannerService } from '../qrScannerService';

// Mock fetch globally
global.fetch = vi.fn();

describe('QRScannerService', () => {
  let service: QRScannerService;

  beforeEach(() => {
    service = new QRScannerService('http://localhost:3000');
    vi.clearAllMocks();
  });

  describe('validateAndParseQRCode', () => {
    it('should validate a correct voucher QR code', () => {
      const voucherId = '123e4567-e89b-12d3-a456-426614174000';
      const buyerId = 12345;
      const qrData = `voucher:${voucherId}:buyer:${buyerId}`;
      
      const result = service.validateAndParseQRCode(qrData);
      
      expect(result.isValid).toBe(true);
      expect(result.voucherData).toEqual({
        voucherId,
        buyerId,
        format: 'voucher'
      });
    });

    it('should validate a base64 encoded voucher QR code', () => {
      const voucherId = '123e4567-e89b-12d3-a456-426614174000';
      const buyerId = 12345;
      const qrData = `voucher:${voucherId}:buyer:${buyerId}`;
      const base64Data = btoa(qrData);
      
      const result = service.validateAndParseQRCode(base64Data);
      
      expect(result.isValid).toBe(true);
      expect(result.voucherData).toEqual({
        voucherId,
        buyerId,
        format: 'voucher'
      });
    });

    it('should reject invalid QR code format', () => {
      const result = service.validateAndParseQRCode('invalid-qr-code');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid QR code format');
    });

    it('should reject invalid UUID format', () => {
      const qrData = 'voucher:invalid-uuid:buyer:12345';
      
      const result = service.validateAndParseQRCode(qrData);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid voucher ID format');
    });

    it('should reject invalid buyer ID', () => {
      const voucherId = '123e4567-e89b-12d3-a456-426614174000';
      const qrData = `voucher:${voucherId}:buyer:invalid`;
      
      const result = service.validateAndParseQRCode(qrData);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid buyer ID');
    });

    it('should reject negative buyer ID', () => {
      const voucherId = '123e4567-e89b-12d3-a456-426614174000';
      const qrData = `voucher:${voucherId}:buyer:-1`;
      
      const result = service.validateAndParseQRCode(qrData);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid buyer ID');
    });

    it('should handle missing voucher ID', () => {
      const qrData = 'voucher::buyer:12345';
      
      const result = service.validateAndParseQRCode(qrData);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Missing voucher ID or buyer ID');
    });

    it('should handle missing buyer ID', () => {
      const voucherId = '123e4567-e89b-12d3-a456-426614174000';
      const qrData = `voucher:${voucherId}:buyer:`;
      
      const result = service.validateAndParseQRCode(qrData);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Missing voucher ID or buyer ID');
    });
  });

  describe('createScanResult', () => {
    it('should create a scan result with current timestamp', () => {
      const data = 'test-data';
      const isValid = true;
      
      const result = service.createScanResult(data, isValid);
      
      expect(result.data).toBe(data);
      expect(result.isValid).toBe(isValid);
      expect(result.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('redeemVoucher', () => {
    it('should successfully redeem a voucher', async () => {
      const voucherId = '123e4567-e89b-12d3-a456-426614174000';
      const mockResponse = {
        success: true,
        message: 'Voucher redeemed successfully'
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await service.redeemVoucher(voucherId);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Voucher redeemed successfully');
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/webhook/voucher-redeemed',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: expect.stringContaining(voucherId)
        })
      );
    });

    it('should handle redemption failure', async () => {
      const voucherId = '123e4567-e89b-12d3-a456-426614174000';

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Voucher not found'
      });

      const result = await service.redeemVoucher(voucherId);

      expect(result.success).toBe(false);
      expect(result.message).toContain('HTTP 404');
    });

    it('should handle network errors', async () => {
      const voucherId = '123e4567-e89b-12d3-a456-426614174000';

      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const result = await service.redeemVoucher(voucherId);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Network error');
    });
  });

  describe('sanitizeQRData', () => {
    it('should remove HTML tags', () => {
      const data = '<script>alert("xss")</script>voucher:123:buyer:456';
      
      const result = service.sanitizeQRData(data);
      
      expect(result).toBe('scriptalert("xss")/scriptvoucher:123:buyer:456');
    });

    it('should limit data length', () => {
      const longData = 'a'.repeat(2000);
      
      const result = service.sanitizeQRData(longData);
      
      expect(result.length).toBe(1000);
    });
  });

  describe('isVoucherQRCode', () => {
    it('should return true for valid voucher QR code', () => {
      const voucherId = '123e4567-e89b-12d3-a456-426614174000';
      const qrData = `voucher:${voucherId}:buyer:12345`;
      
      const result = service.isVoucherQRCode(qrData);
      
      expect(result).toBe(true);
    });

    it('should return false for invalid QR code', () => {
      const result = service.isVoucherQRCode('invalid-data');
      
      expect(result).toBe(false);
    });
  });

  describe('checkCameraPermission', () => {
    it('should return permission state when available', async () => {
      const mockPermission = { state: 'granted' };
      global.navigator = {
        permissions: {
          query: vi.fn().mockResolvedValue(mockPermission)
        }
      } as any;

      const result = await service.checkCameraPermission();

      expect(result).toBe('granted');
    });

    it('should return prompt when permissions API is not available', async () => {
      global.navigator = {} as any;

      const result = await service.checkCameraPermission();

      expect(result).toBe('prompt');
    });
  });

  describe('getCameraDevices', () => {
    it('should return video input devices', async () => {
      const mockDevices = [
        { kind: 'videoinput', deviceId: 'camera1', label: 'Front Camera' },
        { kind: 'audioinput', deviceId: 'mic1', label: 'Microphone' },
        { kind: 'videoinput', deviceId: 'camera2', label: 'Back Camera' }
      ];

      global.navigator = {
        mediaDevices: {
          enumerateDevices: vi.fn().mockResolvedValue(mockDevices)
        }
      } as any;

      const result = await service.getCameraDevices();

      expect(result).toHaveLength(2);
      expect(result[0].kind).toBe('videoinput');
      expect(result[1].kind).toBe('videoinput');
    });

    it('should handle enumeration errors', async () => {
      global.navigator = {
        mediaDevices: {
          enumerateDevices: vi.fn().mockRejectedValue(new Error('Access denied'))
        }
      } as any;

      const result = await service.getCameraDevices();

      expect(result).toEqual([]);
    });
  });

  describe('requestCameraAccess', () => {
    it('should request camera access with specific device', async () => {
      const mockStream = { id: 'stream1' };
      const deviceId = 'camera1';

      global.navigator = {
        mediaDevices: {
          getUserMedia: vi.fn().mockResolvedValue(mockStream)
        }
      } as any;

      const result = await service.requestCameraAccess(deviceId);

      expect(result).toBe(mockStream);
      expect(global.navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
        video: { deviceId: { exact: deviceId } }
      });
    });

    it('should request camera access with environment facing mode', async () => {
      const mockStream = { id: 'stream1' };

      global.navigator = {
        mediaDevices: {
          getUserMedia: vi.fn().mockResolvedValue(mockStream)
        }
      } as any;

      const result = await service.requestCameraAccess();

      expect(result).toBe(mockStream);
      expect(global.navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
        video: { facingMode: 'environment' }
      });
    });

    it('should handle camera access errors', async () => {
      global.navigator = {
        mediaDevices: {
          getUserMedia: vi.fn().mockRejectedValue(new Error('Permission denied'))
        }
      } as any;

      await expect(service.requestCameraAccess()).rejects.toThrow('Camera access denied');
    });
  });
}); 