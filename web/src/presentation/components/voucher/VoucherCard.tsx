import React from 'react';
import { Voucher } from '../../../domain/models/voucher';
import { VoucherService } from '../../../application/services/voucherService';
import { Badge } from '../ui/core/Badge/Badge';
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
  const voucherService = new VoucherService();

  const handleClick = () => {
    if (onClick) {
      onClick(voucher);
    }
  };

  const getStatusBadgeVariant = () => {
    switch (voucher.status) {
      case 'active':
        return 'success';
      case 'redeemed':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusText = () => {
    return voucher.status === 'active' ? 'Active' : 'Used';
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
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-neutral-900 leading-tight flex-1 mr-2">
            {voucher.title}
          </h3>
          <Badge 
            variant={getStatusBadgeVariant()} 
            size="sm"
            className="flex-shrink-0"
          >
            {getStatusText()}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
          {voucher.description}
        </p>

        {/* Footer with Price and Date */}
        <div className="flex items-center justify-between">
          <div className="text-blue-600 text-lg font-bold">
            {voucherService.formatPrice(voucher.price)}
          </div>
          <div className="flex items-center text-neutral-500 text-sm">
            <Clock className="w-3 h-3 mr-1" />
            {voucherService.formatDate(voucher.purchased_at)}
          </div>
        </div>
      </div>
    </div>
  );
};