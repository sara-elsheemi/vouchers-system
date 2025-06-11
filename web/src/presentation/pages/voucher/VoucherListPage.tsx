import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useVouchers } from '../../../application/hooks/useVouchers';
import { VoucherCard } from '../../components/voucher/VoucherCard';
import { VoucherSkeleton } from '../../components/voucher/VoucherSkeleton';
import { EmptyState } from '../../components/voucher/EmptyState';
import { VoucherDetailsModal } from '../../components/voucher';
import { Voucher } from '../../../domain/models/voucher';

interface VoucherListPageProps {
  userId: string;
  className?: string;
}

export const VoucherListPage: React.FC<VoucherListPageProps> = ({
  userId,
  className = '',
}) => {
  const { t, i18n } = useTranslation();
  const { vouchers, isLoading, error, refetch } = useVouchers(userId);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  // Sort vouchers: active first, then inactive
  const sortedVouchers = useMemo(() => {
    return [...vouchers].sort((a, b) => {
      // Active vouchers come first
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      
      // If both have same status, sort by purchased date (newest first)
      return new Date(b.purchased_at).getTime() - new Date(a.purchased_at).getTime();
    });
  }, [vouchers]);

  const handleVoucherClick = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
  };

  const handleCloseModal = () => {
    setSelectedVoucher(null);
  };

  const handleBrowseVouchers = () => {
    // This would typically navigate to the main 4Sale app
    // For WebView, this might call a native bridge function
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ action: 'browse_vouchers' }, '*');
    }
  };

  // Arabic pluralization for voucher count
  const getVoucherCountText = (count: number) => {
    if (i18n.language === 'ar') {
      if (count === 0) return t('vouchers.vouchersAvailable_0');
      if (count === 1) return t('vouchers.vouchersAvailable_1');
      if (count === 2) return t('vouchers.vouchersAvailable_2');
      if (count >= 3 && count <= 10) return t('vouchers.vouchersAvailable_few', { count });
      if (count >= 11) return t('vouchers.vouchersAvailable_many', { count });
      return t('vouchers.vouchersAvailable_other', { count });
    } else {
      // English pluralization
      return t('vouchers.vouchersAvailable', { count });
    }
  };

  if (error) {
    return (
      <div className={`min-h-screen bg-neutral-50 ${className}`}>
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center mb-6 header-with-icon">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center header-icon">
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2Z"/>
                <path d="M13 5v2"/>
                <path d="M13 17v2"/>
                <path d="M13 11v2"/>
              </svg>
            </div>
            <div className="header-text">
              <h1 className="text-2xl font-bold text-neutral-900">{t('vouchers.myVouchers')}</h1>
              <p className="text-neutral-600 text-sm">{t('vouchers.errorLoadingVouchers')}</p>
            </div>
          </div>

          {/* Error Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={refetch}
              className="mt-2 text-red-600 hover:text-red-800 font-medium"
            >
              {t('vouchers.tryAgain')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-neutral-50 ${className}`}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center mb-6 header-with-icon">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center header-icon">
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2Z"/>
              <path d="M13 5v2"/>
              <path d="M13 17v2"/>
              <path d="M13 11v2"/>
            </svg>
          </div>
          <div className="header-text">
            <h1 className="text-2xl font-bold text-neutral-900">{t('vouchers.myVouchers')}</h1>
            <p className="text-neutral-600 text-sm">
              {isLoading 
                ? t('vouchers.loadingVouchers')
                : getVoucherCountText(vouchers.length)
              }
            </p>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            <VoucherSkeleton count={3} />
          </div>
        ) : vouchers.length === 0 ? (
          <EmptyState onBrowseVouchers={handleBrowseVouchers} />
        ) : (
          <div className="space-y-4">
            {sortedVouchers.map((voucher) => (
              <VoucherCard
                key={voucher.id}
                voucher={voucher}
                onClick={handleVoucherClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Voucher Details Modal */}
      {selectedVoucher && (
        <VoucherDetailsModal
          voucher={selectedVoucher}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};