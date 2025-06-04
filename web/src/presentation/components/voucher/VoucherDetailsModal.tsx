import React, { useEffect } from 'react';
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
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-4 py-3 flex items-center">
          <button
            onClick={onClose}
            className="p-2 -m-2 text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="ml-3 text-lg font-semibold text-neutral-900">
            Voucher Details
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
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-xl font-bold text-neutral-900 flex-1 mr-3">
                {voucher.title}
              </h2>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {isActive ? 'Active' : 'Redeemed'}
              </div>
            </div>

            {/* Description */}
            <p className="text-neutral-600 mb-4">
              {voucher.description}
            </p>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-neutral-500 text-sm">Price:</span>
                <p className="text-lg font-bold text-blue-600">
                  {voucherService.formatPrice(voucher.price)}
                </p>
              </div>
              <div>
                <span className="text-neutral-500 text-sm">Purchased:</span>
                <p className="text-neutral-900 font-medium">
                  {voucherService.formatDate(voucher.purchased_at)}
                </p>
              </div>
            </div>

            {/* Redeemed Date (if applicable) */}
            {voucher.redeemed_at && (
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <span className="text-neutral-500 text-sm">Redeemed:</span>
                <p className="text-neutral-900 font-medium">
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
                Redemption Code
              </h3>
              <p className="text-neutral-600 text-center mb-6">
                Show this QR code to redeem your voucher
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
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Voucher Redeemed
              </h3>
              <p className="text-gray-600">
                This voucher has been successfully used and cannot be redeemed again.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};