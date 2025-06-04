import React, { useState } from 'react';
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
  const { vouchers, isLoading, error, refetch } = useVouchers(userId);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

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

  if (error) {
    return (
      <div className={`min-h-screen bg-neutral-50 ${className}`}>
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mr-3">
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
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">My Vouchers</h1>
              <p className="text-neutral-600 text-sm">Error loading vouchers</p>
            </div>
          </div>

          {/* Error Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={refetch}
              className="mt-2 text-red-600 hover:text-red-800 font-medium"
            >
              Try Again
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
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mr-3">
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
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">My Vouchers</h1>
            <p className="text-neutral-600 text-sm">
              {isLoading 
                ? 'Loading vouchers...' 
                : `${vouchers.length} voucher${vouchers.length !== 1 ? 's' : ''} available`
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
            {vouchers.map((voucher) => (
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