import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { AlertTriangle } from 'lucide-react';

interface QRCodeViewProps {
  qrData: string;
  size?: number;
  className?: string;
  showWarning?: boolean;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({
  qrData,
  size = 256,
  className = '',
  showWarning = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && qrData) {
      QRCode.toCanvas(canvasRef.current, qrData, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }, (error) => {
        if (error) console.error('QR Code generation error:', error);
      });
    }
  }, [qrData, size]);

  if (!qrData) {
    return (
      <div className={`flex items-center justify-center bg-neutral-100 rounded-lg ${className}`} style={{ width: size, height: size }}>
        <span className="text-neutral-500 text-sm">No QR Code Available</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* QR Code Container */}
      <div className="p-6 bg-white rounded-lg border border-neutral-200 shadow-sm">
        <canvas ref={canvasRef} className="block" />
      </div>

      {/* Warning Message */}
      {showWarning && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 max-w-sm">
          <div className="flex items-start">
            <AlertTriangle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-blue-800 text-sm">
              Do not share this QR code. It can only be used once.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};