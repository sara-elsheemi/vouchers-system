import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Voucher } from '../../../domain/models/voucher';
import { VoucherService } from '../../../application/services/voucherService';
import { QRCodeView } from './QRCodeView';
import { ArrowLeft, Check } from 'lucide-react';

interface VoucherDetailsModalProps {
  voucher: Voucher;
  onClose: () => void;
  className?: string;
}

export const VoucherDetailsModal: React.FC<VoucherDetailsModalProps> = ({
  voucher,
  onClose,
  className = '',
}) => {
  const { t } = useTranslation();
  const voucherService = new VoucherService();

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const isActive = voucher.status === 'active';
  const isRedeemed = voucher.status === 'redeemed';

  return (
    <div className={`fixed inset-0 z-50 ${className}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full h-full bg-white overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-4 py-3 flex items-center modal-header">
          <button
            onClick={onClose}
            className="p-2 -m-2 text-neutral-600 hover:text-neutral-900 modal-back-button"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="ml-3 text-lg font-semibold text-neutral-900">
            {t('vouchers.voucherDetails')}
          </h1>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Voucher Image */}
          <div className="w-full h-48 bg-neutral-100 rounded-lg overflow-hidden">
            <img
              src={voucher.photo_url}
              alt={voucher.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>

          {/* Voucher Info Card */}
          <div className="bg-white rounded-lg border border-neutral-200 p-4">
            {/* Header with Title and Status */}
            <div className="flex items-start justify-between mb-3 voucher-title-status">
              <h2 className="text-xl font-bold text-neutral-900 flex-1 voucher-title">
                {voucher.title}
              </h2>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium voucher-status-badge ${
                isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {isActive ? t('vouchers.active') : t('vouchers.redeemed')}
              </div>
            </div>

            {/* Description */}
            <p className="text-neutral-600 mb-4">
              {voucher.description}
            </p>

            {/* Details Grid */}
            <div className="flex justify-between gap-4 voucher-details-flex">
              <div className="flex-1 voucher-detail-item">
                <div className="voucher-detail-label text-neutral-500 text-sm mb-1">
                  {t('vouchers.price')}:
                </div>
                <div className="voucher-detail-value text-lg font-bold text-blue-600">
                  {voucherService.formatPrice(voucher.price)}
                </div>
              </div>
              <div className="flex-1 voucher-detail-item">
                <div className="voucher-detail-label text-neutral-500 text-sm mb-1">
                  {t('vouchers.purchased')}:
                </div>
                <div className="voucher-detail-value text-neutral-900 font-medium">
                  {voucherService.formatDate(voucher.purchased_at)}
                </div>
              </div>
            </div>

            {/* Redeemed Date (if applicable) */}
            {voucher.redeemed_at && (
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <span className="text-neutral-500 text-sm voucher-detail-label">{t('vouchers.redeemedAt')}:</span>
                <p className="text-neutral-900 font-medium voucher-detail-value ltr-content">
                  {voucherService.formatDate(voucher.redeemed_at)} at{' '}
                  {new Date(voucher.redeemed_at).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
              </div>
            )}
          </div>

          {/* QR Code Section */}
          {isActive && voucher.qr_code ? (
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 text-center mb-2">
                {t('vouchers.redemptionCode')}
              </h3>
              <p className="text-neutral-600 text-center mb-6">
                {t('vouchers.showQRCode')}
              </p>
              
              <div className="flex justify-center">
                <QRCodeView 
                  qrData={voucher.qr_code} 
                  size={200}
                  showWarning={true}
                />
              </div>
            </div>
          ) : isRedeemed ? (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center empty-state-content">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('vouchers.voucherRedeemed')}
              </h3>
              <p className="text-gray-600">
                {t('vouchers.voucherRedeemedDescription')}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};