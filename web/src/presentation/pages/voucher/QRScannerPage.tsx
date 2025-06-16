// Full-page QR Scanner interface
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/core/Button/Button';
import { Alert, AlertDescription } from '../../components/ui/feedback/Alert/Alert';
import { QRScannerView } from '../../components/qr/QRScannerView';

interface QRScannerPageProps {
  onBack?: () => void;
  onVoucherRedeemed?: (voucherId: string) => void;
}

export const QRScannerPage: React.FC<QRScannerPageProps> = ({
  onBack,
  onVoucherRedeemed
}) => {
  const { t } = useTranslation();
  const [redemptionStatus, setRedemptionStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    voucherId?: string;
  }>({ type: null, message: '' });

  const handleRedemptionSuccess = (voucherId: string) => {
    setRedemptionStatus({
      type: 'success',
      message: t('qrScanner.redemptionSuccess'),
      voucherId
    });
    onVoucherRedeemed?.(voucherId);
  };

  const handleRedemptionError = (error: string) => {
    setRedemptionStatus({
      type: 'error',
      message: error
    });
  };

  const clearStatus = () => {
    setRedemptionStatus({ type: null, message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onBack && (
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('common.back')}
                </Button>
              )}
              <h1 className="text-2xl font-bold text-foreground">
                {t('qrScanner.pageTitle')}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Status Messages */}
        {redemptionStatus.type && (
          <div className="mb-6">
            <Alert 
              variant={redemptionStatus.type === 'success' ? 'success' : 'destructive'}
            >
              {redemptionStatus.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertDescription>
                {redemptionStatus.message}
                {redemptionStatus.voucherId && (
                  <div className="mt-2 text-sm">
                    <strong>{t('qrScanner.voucherId')}:</strong> {redemptionStatus.voucherId}
                  </div>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearStatus}
                  className="ml-2"
                >
                  {t('common.dismiss')}
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* QR Scanner */}
        <QRScannerView
          onRedemptionSuccess={handleRedemptionSuccess}
          onRedemptionError={handleRedemptionError}
          autoStart={true}
          showDeviceSelector={true}
          className="max-w-4xl mx-auto"
        />

        {/* Help Section */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              {t('qrScanner.helpTitle')}
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <p>{t('qrScanner.helpStep1')}</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <p>{t('qrScanner.helpStep2')}</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <p>{t('qrScanner.helpStep3')}</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  4
                </div>
                <p>{t('qrScanner.helpStep4')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="mt-6 max-w-2xl mx-auto">
          <details className="bg-muted rounded-lg p-6">
            <summary className="text-lg font-semibold cursor-pointer">
              {t('qrScanner.troubleshootingTitle')}
            </summary>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <div>
                <strong>{t('qrScanner.troubleshootingCamera')}:</strong>
                <p>{t('qrScanner.troubleshootingCameraDesc')}</p>
              </div>
              <div>
                <strong>{t('qrScanner.troubleshootingQR')}:</strong>
                <p>{t('qrScanner.troubleshootingQRDesc')}</p>
              </div>
              <div>
                <strong>{t('qrScanner.troubleshootingNetwork')}:</strong>
                <p>{t('qrScanner.troubleshootingNetworkDesc')}</p>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}; 