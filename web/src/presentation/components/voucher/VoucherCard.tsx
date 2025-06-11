import React from 'react';
import { useTranslation } from 'react-i18next';
import { Voucher } from '../../../domain/models/voucher';
import { VoucherService } from '../../../application/services/voucherService';
import { Clock } from 'lucide-react';

interface VoucherCardProps {
  voucher: Voucher;
  onClick?: (voucher: Voucher) => void;
  className?: string;
}

export const VoucherCard: React.FC<VoucherCardProps> = ({
  voucher,
  onClick,
  className = '',
}) => {
  const { t } = useTranslation();
  const voucherService = new VoucherService();

  const handleClick = () => {
    if (onClick) {
      onClick(voucher);
    }
  };

  const getStatusText = () => {
    return voucher.status === 'active' ? t('vouchers.active') : t('vouchers.used');
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-neutral-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200 ${className}`}
      onClick={handleClick}
    >
      {/* Voucher Image */}
      <div className="relative w-full h-32 bg-neutral-100">
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

      {/* Voucher Content */}
      <div className="p-4">
        {/* Header with Title and Status */}
        <div className="flex items-start justify-between mb-2 voucher-title-status">
          <h3 className="text-lg font-semibold text-neutral-900 leading-tight flex-1 voucher-title">
            {voucher.title}
          </h3>
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 voucher-status-badge ${
            voucher.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {getStatusText()}
          </div>
        </div>

        {/* Description */}
        <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
          {voucher.description}
        </p>

        {/* Footer with Price and Date */}
        <div className="flex items-center justify-between voucher-footer-content">
          <div className="text-blue-600 text-lg font-bold voucher-price ltr-content">
            {voucherService.formatPrice(voucher.price)}
          </div>
          <div className="flex items-center text-neutral-500 text-sm voucher-date">
            <Clock className="w-3 h-3 mr-1" />
            <span className="ltr-content">{voucherService.formatDate(voucher.purchased_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};