import React from 'react';
import { useTranslation } from 'react-i18next';
import { QrCode, Smartphone, CheckCircle, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/core/Button/Button';
import { Card } from '../components/ui/data-display/Card/Card';

interface VoucherLandingPageProps {
  onStartScanning?: () => void;
  isAuthenticated?: boolean;
}

export const VoucherLandingPage: React.FC<VoucherLandingPageProps> = ({
  onStartScanning,
  isAuthenticated = false
}) => {
  const { t } = useTranslation();

  const handleStartScanning = () => {
    if (onStartScanning) {
      onStartScanning();
    } else {
      window.location.href = '/scan-qr';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('app.title', '4Sale Voucher System')}
            </h1>
            <p className="text-gray-600">
              {t('app.subtitle', 'Scan and redeem your vouchers instantly')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="bg-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <QrCode className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('landing.heroTitle', 'Quick & Secure')}
            <br />
            {t('landing.heroSubtitle', 'Voucher Redemption')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            {t('landing.heroDescription', 'Simply scan your QR code to instantly redeem vouchers from your favorite merchants. Fast, secure, and seamless.')}
          </p>
          
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
            onClick={handleStartScanning}
          >
            <QrCode className="w-5 h-5 mr-3" />
            {t('landing.startScanning', 'Start Scanning')}
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('landing.feature1Title', 'Mobile Optimized')}
            </h3>
            <p className="text-gray-600">
              {t('landing.feature1Description', 'Designed specifically for mobile WebView integration within the 4Sale app')}
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('landing.feature2Title', 'Instant Redemption')}
            </h3>
            <p className="text-gray-600">
              {t('landing.feature2Description', 'Real-time voucher processing with immediate confirmation and status updates')}
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('landing.feature3Title', 'Secure & Reliable')}
            </h3>
            <p className="text-gray-600">
              {t('landing.feature3Description', 'Bank-level security with encrypted voucher validation and fraud protection')}
            </p>
          </Card>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            {t('landing.howItWorksTitle', 'How It Works')}
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                1
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {t('landing.step1Title', 'Open Scanner')}
              </h4>
              <p className="text-gray-600 text-sm">
                {t('landing.step1Description', 'Tap "Start Scanning" to open the QR code scanner')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                2
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {t('landing.step2Title', 'Scan QR Code')}
              </h4>
              <p className="text-gray-600 text-sm">
                {t('landing.step2Description', 'Position your voucher\'s QR code within the camera frame')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                3
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {t('landing.step3Title', 'Get Confirmation')}
              </h4>
              <p className="text-gray-600 text-sm">
                {t('landing.step3Description', 'Receive instant confirmation of your voucher redemption')}
              </p>
            </div>
          </div>
        </div>

        {/* Authentication Status */}
        {!isAuthenticated && (
          <div className="mt-8 text-center">
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">
                {t('landing.guestModeTitle', 'Using Guest Mode')}
              </h4>
              <p className="text-blue-800 mb-4">
                {t('landing.guestModeDescription', 'Sign in to access your voucher history and manage your account.')}
              </p>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/?redirect=scan-qr'}
              >
                {t('auth.signIn', 'Sign In')}
              </Button>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-500">
            {t('landing.copyright', '© 2024 4Sale. All rights reserved.')}
          </p>
        </div>
      </div>
    </div>
  );
}; 