// Application service for voucher operations
import { Voucher, VoucherListResponse } from '../../domain/models/voucher';

export class VoucherService {
  private readonly baseUrl: string;

  constructor(baseUrl: string = '/api') {
    // Use relative URL for API calls to avoid CORS issues
    this.baseUrl = baseUrl;
  }

  async getUserVouchers(userId: string): Promise<Voucher[]> {
    try {
      const response = await fetch(`${this.baseUrl}/vouchers/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch vouchers: ${response.status}`);
      }

      const data: VoucherListResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to retrieve vouchers');
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      throw error;
    }
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  }

  isVoucherActive(voucher: Voucher): boolean {
    return voucher.status === 'active' && !voucher.redeemed_at;
  }

  canShowQRCode(voucher: Voucher): boolean {
    return this.isVoucherActive(voucher) && !!voucher.qr_code;
  }
}