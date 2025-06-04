import { useState, useEffect } from 'react';
import { Voucher } from '../../domain/models/voucher';
import { VoucherService } from '../services/voucherService';

export interface UseVouchersReturn {
  vouchers: Voucher[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useVouchers = (userId: string): UseVouchersReturn => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const voucherService = new VoucherService();

  const fetchVouchers = async () => {
    if (!userId) {
      setError('User ID is required');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const fetchedVouchers = await voucherService.getUserVouchers(userId);
      setVouchers(fetchedVouchers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vouchers');
      setVouchers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [userId]);

  return {
    vouchers,
    isLoading,
    error,
    refetch: fetchVouchers,
  };
};