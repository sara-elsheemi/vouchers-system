import React, { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { QrCode, CheckCircle, XCircle, Camera } from 'lucide-react';
import { Button } from '../../components/ui/core/Button/Button';
import { Card } from '../../components/ui/data-display/Card/Card';

type ScanState = 'idle' | 'scanning' | 'processing' | 'success' | 'error';

interface RedemptionResult {
  success: boolean;
  message: string;
  voucherDetails?: {
    title: string;
    value: string;
    merchant: string;
  };
}

interface ScanQRCodePageProps {
  onBack?: () => void;
  isAuthenticated?: boolean;
  userId?: string | undefined;
}

export const ScanQRCodePage: React.FC<ScanQRCodePageProps> = ({
  onBack,
  isAuthenticated = false,
  userId
}) => {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [redemptionResult, setRedemptionResult] = useState<RedemptionResult | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    
    return () => {
      if (codeReader.current) {
        codeReader.current.reset();
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setScanState('scanning');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setCameraPermission('granted');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        if (codeReader.current) {
          codeReader.current.decodeFromVideoDevice(
            null,
            videoRef.current,
            (result, error) => {
              if (result) {
                handleQRCodeScanned(result.getText());
              }
            }
          );
        }
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setCameraPermission('denied');
      setScanState('error');
      setRedemptionResult({
        success: false,
        message: 'Camera access denied. Please enable camera permissions and try again.'
      });
    }
  };

  const handleQRCodeScanned = async (qrData: string) => {
    setScanState('processing');
    
    // Stop the camera
    if (codeReader.current) {
      codeReader.current.reset();
    }
    
    try {
      console.log('Processing QR code:', qrData);
      
      // Call real API to redeem voucher
      const response = await fetch('http://localhost:3001/webhook/voucher-redeemed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voucher_id: qrData,
          redeemed_at: new Date().toISOString()
        })
      });

      if (response.ok) {
        const result = await response.json();
        setScanState('success');
        setRedemptionResult({
          success: true,
          message: result.message || 'Voucher redeemed successfully!',
          voucherDetails: {
            title: 'Voucher Redeemed',
            value: 'Successfully processed',
            merchant: '4Sale Voucher System'
          }
        });
      } else {
        const errorResult = await response.json();
        setScanState('error');
        setRedemptionResult({
          success: false,
          message: errorResult.error || 'This voucher is invalid or has already been redeemed.'
        });
      }
    } catch (error) {
      console.error('Redemption error:', error);
      setScanState('error');
      setRedemptionResult({
        success: false,
        message: 'Failed to process voucher. Please check your connection and try again.'
      });
    }
  };

  const resetScanner = () => {
    setScanState('idle');
    setRedemptionResult(null);
    if (codeReader.current) {
      codeReader.current.reset();
    }
  };

  const renderScannerInterface = () => {
    if (scanState === 'scanning') {
      return (
        <div className="relative w-full max-w-sm mx-auto">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-64 object-cover"
            style={{ borderRadius: '12px' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 border-2 border-blue-500 rounded-lg relative">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
            Position QR code within the frame
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-sm mx-auto">
        <div 
          className="w-full h-64 bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300"
          style={{ borderRadius: '12px' }}
        >
          <div className="text-center">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Camera preview will appear here</p>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (scanState) {
      case 'processing':
        return (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Voucher</h3>
            <p className="text-gray-600 text-base">Please wait while we verify your voucher...</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Voucher Redeemed!</h3>
            <p className="text-gray-600 mb-6 text-base">{redemptionResult?.message}</p>
            
            {redemptionResult?.voucherDetails && (
              <Card className="p-4 mb-6 text-left bg-green-50 border-green-200">
                <h4 className="font-bold text-gray-900 mb-3 text-lg">Voucher Details</h4>
                <div className="space-y-2 text-base">
                  <p><span className="font-semibold">Title:</span> {redemptionResult.voucherDetails.title}</p>
                  <p><span className="font-semibold">Value:</span> {redemptionResult.voucherDetails.value}</p>
                  <p><span className="font-semibold">Merchant:</span> {redemptionResult.voucherDetails.merchant}</p>
                </div>
              </Card>
            )}
            
            <Button 
              onClick={resetScanner} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 text-base"
              size="lg"
              style={{ borderRadius: '8px' }}
            >
              Scan Another Voucher
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-8">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Redemption Failed</h3>
            <p className="text-gray-600 mb-6 text-base">{redemptionResult?.message}</p>
            <Button 
              onClick={resetScanner} 
              variant="outline" 
              className="w-full font-medium py-3 px-4 text-base"
              size="lg"
              style={{ borderRadius: '8px' }}
            >
              Try Again
            </Button>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <QrCode className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Scan to Redeem</h2>
              <p className="text-gray-600 max-w-sm mx-auto text-base">
                Position your voucher's QR code within the camera frame to redeem it instantly.
              </p>
            </div>

            {renderScannerInterface()}

            <div className="space-y-3">
              <Button 
                onClick={startScanning} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 text-base"
                disabled={scanState === 'scanning'}
                size="lg"
                style={{ borderRadius: '8px' }}
              >
                {cameraPermission === 'denied' ? 'Enable Camera' : 'Start Scanning'}
              </Button>
              
              {cameraPermission === 'denied' && (
                <Card className="p-4 bg-orange-50 border-orange-200">
                  <p className="text-sm text-orange-800">
                    Camera access is required to scan QR codes. Please enable camera permissions in your browser settings.
                  </p>
                </Card>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Voucher Redemption</h1>
          <div className="flex items-center">
            {/* 4SALE Logo Image */}
            <div className="h-8 flex items-center">
              <img 
                src="/images/logo4sale.png" 
                alt="4SALE" 
                className="h-8 w-auto"
                onError={(e) => {
                  // Fallback to text if image not found
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.style.display = 'flex';
                  }
                }}
              />
              <div className="bg-blue-600 rounded-lg px-3 py-2 items-center justify-center" style={{display: 'none'}}>
                <span className="text-white font-bold text-lg tracking-wide">4SALE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-10">
        <div className="max-w-md mx-auto">
          {renderContent()}
        </div>
      </div>

      {/* Footer Info - positioned after content, not fixed */}
      <div className="mt-auto px-4 py-6 bg-white border-t border-gray-100">
        <div className="max-w-md mx-auto text-center">
          <p className="text-sm text-gray-500 mb-2">Secure redemption powered by 4Sale</p>
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
            <span>🔒 Encrypted</span>
            <span>⚡ Instant</span>
            <span>✓ Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 