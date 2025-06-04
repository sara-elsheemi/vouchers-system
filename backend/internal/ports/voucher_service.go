package ports

import (
	"context"

	"4SaleBackendSkeleton/internal/application/dto"
	"4SaleBackendSkeleton/internal/domain"
)

// VoucherService defines the interface for voucher business logic
type VoucherService interface {
	CreateVoucher(ctx context.Context, req *dto.CreateVoucherRequest) (*domain.Voucher, error)
	PurchaseVoucher(ctx context.Context, req *dto.PurchaseVoucherRequest) (*domain.VoucherPurchase, error)
	RedeemVoucher(ctx context.Context, req *dto.RedeemVoucherRequest) error
	GetUserVouchers(ctx context.Context, userID int64) ([]*domain.UserVoucherResponse, error)
}

// QRCodeGenerator defines the interface for QR code generation
type QRCodeGenerator interface {
	GenerateQRCode(data string) (string, error)
}