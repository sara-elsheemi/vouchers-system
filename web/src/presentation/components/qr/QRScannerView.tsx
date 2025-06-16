// QR Scanner component with camera view and controls
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Camera, 
  CameraOff, 
  CheckCircle, 
  AlertTriangle, 
  RotateCcw, 
  Settings,
  X,
  Loader2
} from 'lucide-react';
import { Button } from '../ui/core/Button/Button';
import { Alert, AlertDescription } from '../ui/feedback/Alert/Alert';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/data-display/Card/Card';
import { Badge } from '../ui/core/Badge/Badge';
import { useQRScanner } from '../../../application/hooks/useQRScanner';

interface QRScannerViewProps {
  onClose?: () => void;
  onRedemptionSuccess?: (voucherId: string) => void;
  onRedemptionError?: (error: string) => void;
  className?: string;
  autoStart?: boolean;
  showDeviceSelector?: boolean;
}

export const QRScannerView: React.FC<QRScannerViewProps> = ({
  onClose,
  onRedemptionSuccess,
  onRedemptionError,
  className = '',
  autoStart = true,
  showDeviceSelector = true
}) => {
  const { t } = useTranslation();
  
  const {
    isScanning,
    hasPermission,
    error,
    lastScanResult,
    cameraDevices,
    selectedDeviceId,
    isRedeeming,
    redemptionHistory,
    startScanning,
    stopScanning,
    redeemVoucher,
    selectCameraDevice,
    clearError,
    checkPermission,
    videoRef
  } = useQRScanner({
    config: {
      autoRedemption: true,
      scanDelay: 1000,
      timeout: 60000
    },
    ...(onRedemptionSuccess && { onRedemptionSuccess }),
    ...(onRedemptionError && { onRedemptionError })
  });

  // Auto-start scanning if enabled
  useEffect(() => {
    if (autoStart && hasPermission === null) {
      checkPermission();
    }
  }, [autoStart, hasPermission, checkPermission]);

  useEffect(() => {
    if (autoStart && hasPermission === true && !isScanning) {
      startScanning();
    }
  }, [autoStart, hasPermission, isScanning, startScanning]);

  // Handle permission request
  const handleRequestPermission = async () => {
    clearError();
    await checkPermission();
    if (hasPermission) {
      startScanning();
    }
  };

  // Handle manual redemption
  const handleManualRedemption = async () => {
    if (lastScanResult?.isValid) {
      // Extract voucher ID from the last scan result
      const qrService = new (await import('../../../domain/services/qrScannerService')).QRScannerService();
      const validation = qrService.validateAndParseQRCode(lastScanResult.data);
      
      if (validation.isValid && validation.voucherData) {
        await redeemVoucher(validation.voucherData.voucherId);
      }
    }
  };

  // Render permission request
  if (hasPermission === false) {
    return (
      <Card className={`w-full max-w-md mx-auto ${className}`}>
        <CardHeader className="text-center">
          <CameraOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle>{t('qrScanner.permissionRequired')}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            {t('qrScanner.permissionDescription')}
          </p>
          <Button onClick={handleRequestPermission} className="w-full">
            <Camera className="w-4 h-4 mr-2" />
            {t('qrScanner.enableCamera')}
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose} className="w-full">
              {t('common.cancel')}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`w-full max-w-2xl mx-auto space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          {t('qrScanner.title')}
        </h2>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Status Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearError}
              className="ml-2"
            >
              {t('common.dismiss')}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {lastScanResult?.isValid && !error && (
        <Alert variant="success">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            {t('qrScanner.scanSuccess')}
          </AlertDescription>
        </Alert>
      )}

      {/* Camera View */}
      <Card>
        <CardContent className="p-0">
          <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
            {/* Video Element */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
              autoPlay
            />
            
            {/* Scanning Overlay */}
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-primary rounded-lg relative">
                  {/* Corner indicators */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
                  
                  {/* Scanning line animation */}
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-primary animate-pulse" />
                </div>
              </div>
            )}

            {/* Loading State */}
            {!isScanning && hasPermission === true && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="text-center text-white">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>{t('qrScanner.initializing')}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 justify-center">
        {!isScanning ? (
          <Button onClick={startScanning} disabled={hasPermission !== true}>
            <Camera className="w-4 h-4 mr-2" />
            {t('qrScanner.startScanning')}
          </Button>
        ) : (
          <Button onClick={stopScanning} variant="outline">
            <CameraOff className="w-4 h-4 mr-2" />
            {t('qrScanner.stopScanning')}
          </Button>
        )}

        {lastScanResult?.isValid && (
          <Button 
            onClick={handleManualRedemption}
            disabled={isRedeeming}
            variant="secondary"
          >
            {isRedeeming ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            {t('qrScanner.redeemVoucher')}
          </Button>
        )}

        <Button onClick={clearError} variant="ghost" size="sm">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t('qrScanner.reset')}
        </Button>
      </div>

      {/* Device Selector */}
      {showDeviceSelector && cameraDevices.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <Settings className="w-4 h-4 mr-2" />
              {t('qrScanner.cameraSettings')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cameraDevices.map((device: MediaDeviceInfo) => (
                <Button
                  key={device.deviceId}
                  variant={selectedDeviceId === device.deviceId ? "primary" : "outline"}
                  size="sm"
                  onClick={() => selectCameraDevice(device.deviceId)}
                  className="w-full justify-start"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {device.label || `Camera ${device.deviceId.slice(0, 8)}...`}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scan History */}
      {redemptionHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {t('qrScanner.recentRedemptions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {redemptionHistory.slice(-5).map((voucherId: string, index: number) => (
                <Badge key={index} variant="success" className="text-xs">
                  {voucherId.slice(0, 8)}...
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card variant="ghost">
        <CardContent className="text-center text-sm text-muted-foreground">
          <p>{t('qrScanner.instructions')}</p>
        </CardContent>
      </Card>
    </div>
  );
}; 