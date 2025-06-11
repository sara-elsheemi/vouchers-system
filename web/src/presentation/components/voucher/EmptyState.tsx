import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/core/Button/Button';

interface EmptyStateProps {
  onBrowseVouchers?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onBrowseVouchers,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
      {/* Icon */}
      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-8 h-8 text-neutral-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-neutral-900 mb-2">
        {t('vouchers.noVouchersYet')}
      </h3>

      {/* Description */}
      <p className="text-neutral-600 mb-6 max-w-xs">
        {t('vouchers.noVouchersDescription')}
      </p>

      {/* Action Button */}
      {onBrowseVouchers && (
        <Button
          onClick={onBrowseVouchers}
          className="px-6 py-3"
        >
          {t('vouchers.browseVouchers')}
        </Button>
      )}
    </div>
  );
};