// React hook for QR scanner state management
import { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { QRScannerService } from '../../domain/services/qrScannerService';
import { 
  QRScannerState, 
  QRScanResult, 
  QRScannerConfig,
  CameraPermissionState 
} from '../../domain/models/qrScanner';

interface UseQRScannerOptions {
  config?: Partial<QRScannerConfig>;
  onScanSuccess?: (result: QRScanResult) => void;
  onScanError?: (error: string) => void;
  onRedemptionSuccess?: (voucherId: string) => void;
  onRedemptionError?: (error: string) => void;
}

const defaultConfig: QRScannerConfig = {
  mode: 'auto',
  autoRedemption: true,
  scanDelay: 1000,
  maxRetries: 3,
  timeout: 30000
};

export const useQRScanner = (options: UseQRScannerOptions = {}) => {
  const {
    config = {},
    onScanSuccess,
    onScanError,
    onRedemptionSuccess,
    onRedemptionError
  } = options;

  const finalConfig = { ...defaultConfig, ...config };
  
  // State
  const [state, setState] = useState<QRScannerState>({
    isScanning: false,
    hasPermission: null,
    error: null,
    lastScanResult: null,
    cameraDevices: [],
    selectedDeviceId: null
  });

  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redemptionHistory, setRedemptionHistory] = useState<string[]>([]);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScanTimeRef = useRef<number>(0);

  // Services
  const qrService = new QRScannerService();

  // Initialize scanner
  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();
    
    return () => {
      stopScanning();
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, []);

  // Load camera devices
  const loadCameraDevices = useCallback(async () => {
    try {
      const devices = await qrService.getCameraDevices();
      setState(prev => ({ ...prev, cameraDevices: devices }));
      
      // Auto-select back camera if available
      const backCamera = devices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear')
      );
      
      if (backCamera && !state.selectedDeviceId) {
        setState(prev => ({ ...prev, selectedDeviceId: backCamera.deviceId }));
      }
    } catch (error) {
      console.error('Failed to load camera devices:', error);
    }
  }, [state.selectedDeviceId]);

  // Check camera permission
  const checkPermission = useCallback(async (): Promise<CameraPermissionState> => {
    try {
      const permission = await qrService.checkCameraPermission();
      setState(prev => ({ 
        ...prev, 
        hasPermission: permission === 'granted' 
      }));
      return permission;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        hasPermission: false,
        error: 'Failed to check camera permission'
      }));
      return 'denied';
    }
  }, []);

  // Start scanning
  const startScanning = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));

      // Check permission first
      const permission = await checkPermission();
      if (permission === 'denied') {
        throw new Error('Camera permission denied');
      }

      // Request camera access
      const stream = await qrService.requestCameraAccess(state.selectedDeviceId || undefined);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setState(prev => ({ 
        ...prev, 
        isScanning: true, 
        hasPermission: true 
      }));

      // Start scanning with ZXing
      if (readerRef.current && videoRef.current) {
        const scanLoop = async () => {
          if (!state.isScanning || !readerRef.current || !videoRef.current) {
            return;
          }

          try {
            // Throttle scanning
            const now = Date.now();
            if (now - lastScanTimeRef.current < finalConfig.scanDelay) {
              scanTimeoutRef.current = setTimeout(scanLoop, 100);
              return;
            }

            const result = await readerRef.current.decodeFromVideoElement(videoRef.current);
            lastScanTimeRef.current = now;

            if (result) {
              await handleScanResult(result.getText());
            }
          } catch (error) {
            // NotFoundException is expected when no QR code is found
            if (!(error instanceof NotFoundException)) {
              console.error('Scan error:', error);
            }
          }

          // Continue scanning
          if (state.isScanning) {
            scanTimeoutRef.current = setTimeout(scanLoop, 100);
          }
        };

        scanLoop();
      }

      // Set timeout
      setTimeout(() => {
        if (state.isScanning) {
          stopScanning();
          setState(prev => ({ 
            ...prev, 
            error: 'Scanning timeout. Please try again.' 
          }));
        }
      }, finalConfig.timeout);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start scanning';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isScanning: false 
      }));
      onScanError?.(errorMessage);
    }
  }, [state.selectedDeviceId, state.isScanning, finalConfig, checkPermission, onScanError]);

  // Stop scanning
  const stopScanning = useCallback(() => {
    setState(prev => ({ ...prev, isScanning: false }));

    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (readerRef.current) {
      readerRef.current.reset();
    }
  }, []);

  // Handle scan result
  const handleScanResult = useCallback(async (data: string) => {
    try {
      const sanitizedData = qrService.sanitizeQRData(data);
      const validation = qrService.validateAndParseQRCode(sanitizedData);
      
      const scanResult = qrService.createScanResult(sanitizedData, validation.isValid);
      
      setState(prev => ({ ...prev, lastScanResult: scanResult }));
      onScanSuccess?.(scanResult);

      if (validation.isValid && validation.voucherData) {
        const { voucherId } = validation.voucherData;

        // Check if already redeemed recently
        if (redemptionHistory.includes(voucherId)) {
          setState(prev => ({ 
            ...prev, 
            error: 'This voucher was already processed recently.' 
          }));
          return;
        }

        // Auto-redeem if enabled
        if (finalConfig.autoRedemption) {
          await redeemVoucher(voucherId);
        }
      } else {
        setState(prev => ({ 
          ...prev, 
          error: validation.error || 'Invalid QR code format' 
        }));
        onScanError?.(validation.error || 'Invalid QR code format');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process scan result';
      setState(prev => ({ ...prev, error: errorMessage }));
      onScanError?.(errorMessage);
    }
  }, [redemptionHistory, finalConfig.autoRedemption, onScanSuccess, onScanError]);

  // Redeem voucher
  const redeemVoucher = useCallback(async (voucherId: string) => {
    if (isRedeeming) return;

    setIsRedeeming(true);
    
    try {
      const response = await qrService.redeemVoucher(voucherId);
      
      if (response.success) {
        setRedemptionHistory(prev => [...prev, voucherId]);
        onRedemptionSuccess?.(voucherId);
        
        // Stop scanning after successful redemption
        if (finalConfig.mode === 'auto') {
          stopScanning();
        }
      } else {
        setState(prev => ({ 
          ...prev, 
          error: response.message 
        }));
        onRedemptionError?.(response.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Redemption failed';
      setState(prev => ({ ...prev, error: errorMessage }));
      onRedemptionError?.(errorMessage);
    } finally {
      setIsRedeeming(false);
    }
  }, [isRedeeming, finalConfig.mode, onRedemptionSuccess, onRedemptionError, stopScanning]);

  // Select camera device
  const selectCameraDevice = useCallback((deviceId: string) => {
    setState(prev => ({ ...prev, selectedDeviceId: deviceId }));
    
    // Restart scanning with new device if currently scanning
    if (state.isScanning) {
      stopScanning();
      setTimeout(() => startScanning(), 500);
    }
  }, [state.isScanning, stopScanning, startScanning]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Initialize
  useEffect(() => {
    loadCameraDevices();
    checkPermission();
  }, [loadCameraDevices, checkPermission]);

  return {
    // State
    ...state,
    isRedeeming,
    redemptionHistory,
    
    // Actions
    startScanning,
    stopScanning,
    redeemVoucher,
    selectCameraDevice,
    clearError,
    checkPermission,
    loadCameraDevices,
    
    // Refs for video element
    videoRef,
    
    // Config
    config: finalConfig
  };
}; 