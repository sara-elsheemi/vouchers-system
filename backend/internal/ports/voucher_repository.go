package ports

import (
        "context"
        "time"

        "4SaleBackendSkeleton/internal/domain"
        "github.com/google/uuid"
)

// VoucherRepository defines the interface for voucher data operations
type VoucherRepository interface {
        CreateVoucher(ctx context.Context, voucher *domain.Voucher) error
        GetVoucherByID(ctx context.Context, id uuid.UUID) (*domain.Voucher, error)
        GetVouchersByUserID(ctx context.Context, userID int64) ([]*domain.Voucher, error)
}

// VoucherPurchaseRepository defines the interface for voucher purchase operations
type VoucherPurchaseRepository interface {
        CreatePurchase(ctx context.Context, purchase *domain.VoucherPurchase) error
        GetPurchaseByVoucherID(ctx context.Context, voucherID uuid.UUID) (*domain.VoucherPurchase, error)
        GetPurchasesByBuyerID(ctx context.Context, buyerID int64) ([]*domain.VoucherPurchase, error)
        UpdatePurchaseStatus(ctx context.Context, voucherID uuid.UUID, status string, redeemedAt *time.Time) error
        GetUserVouchers(ctx context.Context, userID int64) ([]*domain.UserVoucherResponse, error)
}