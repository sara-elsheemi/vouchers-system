// Domain model for voucher entities
export interface Voucher {
  id: string;
  title: string;
  description: string;
  status: VoucherStatus;
  photo_url: string;
  qr_code?: string;
  price: number;
  purchased_at: string;
  redeemed_at: string | null;
}

export type VoucherStatus = 'active' | 'redeemed';

export interface VoucherListResponse {
  success: boolean;
  message: string;
  data: Voucher[];
}

// Domain value objects
export interface VoucherDetails extends Voucher {
  redemption_instructions?: string;
  terms_and_conditions?: string;
}

// Domain events
export interface VoucherRedemptionEvent {
  voucherId: string;
  redeemedAt: Date;
  userId: string;
}