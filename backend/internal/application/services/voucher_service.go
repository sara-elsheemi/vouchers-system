package services

import (
	"context"
	"fmt"
	"time"

	"4SaleBackendSkeleton/internal/application/dto"
	"4SaleBackendSkeleton/internal/domain"
	"4SaleBackendSkeleton/internal/ports"
	"github.com/google/uuid"
)

// VoucherService implements the voucher business logic
type VoucherService struct {
	voucherRepo         ports.VoucherRepository
	voucherPurchaseRepo ports.VoucherPurchaseRepository
	qrGenerator         ports.QRCodeGenerator
}

// NewVoucherService creates a new voucher service
func NewVoucherService(
	voucherRepo ports.VoucherRepository,
	voucherPurchaseRepo ports.VoucherPurchaseRepository,
	qrGenerator ports.QRCodeGenerator,
) *VoucherService {
	return &VoucherService{
		voucherRepo:         voucherRepo,
		voucherPurchaseRepo: voucherPurchaseRepo,
		qrGenerator:         qrGenerator,
	}
}

// CreateVoucher creates a new voucher
func (s *VoucherService) CreateVoucher(ctx context.Context, req *dto.CreateVoucherRequest) (*domain.Voucher, error) {
	// Validate request
	if req.AdvID <= 0 {
		return nil, fmt.Errorf("invalid adv_id")
	}
	if req.UserID <= 0 {
		return nil, fmt.Errorf("invalid user_id")
	}
	if req.Title == "" {
		return nil, fmt.Errorf("title is required")
	}
	if req.Price < 0 {
		return nil, fmt.Errorf("price must be non-negative")
	}

	// Create voucher entity
	voucher := &domain.Voucher{
		ID:          uuid.New(),
		AdvID:       req.AdvID,
		UserID:      req.UserID,
		Title:       req.Title,
		Description: req.Description,
		Price:       req.Price,
		PhotoURL:    req.Photo,
		CreatedAt:   time.Now(),
	}

	// Save to repository
	if err := s.voucherRepo.CreateVoucher(ctx, voucher); err != nil {
		return nil, fmt.Errorf("failed to create voucher: %w", err)
	}

	return voucher, nil
}

// PurchaseVoucher creates a new voucher purchase
func (s *VoucherService) PurchaseVoucher(ctx context.Context, req *dto.PurchaseVoucherRequest) (*domain.VoucherPurchase, error) {
	// Validate request
	if req.VoucherID == uuid.Nil {
		return nil, fmt.Errorf("invalid voucher_id")
	}
	if req.BuyerID <= 0 {
		return nil, fmt.Errorf("invalid buyer_id")
	}

	// Check if voucher exists
	voucher, err := s.voucherRepo.GetVoucherByID(ctx, req.VoucherID)
	if err != nil {
		return nil, fmt.Errorf("voucher not found: %w", err)
	}

	// Check if voucher is already purchased
	existingPurchase, err := s.voucherPurchaseRepo.GetPurchaseByVoucherID(ctx, req.VoucherID)
	if err == nil && existingPurchase != nil {
		return nil, fmt.Errorf("voucher already purchased")
	}

	// Generate QR code
	qrData := fmt.Sprintf("voucher:%s:buyer:%d", req.VoucherID.String(), req.BuyerID)
	qrCode, err := s.qrGenerator.GenerateQRCode(qrData)
	if err != nil {
		return nil, fmt.Errorf("failed to generate QR code: %w", err)
	}

	// Create purchase entity
	purchase := &domain.VoucherPurchase{
		ID:         uuid.New(),
		VoucherID:  req.VoucherID,
		BuyerID:    req.BuyerID,
		QRCode:     qrCode,
		Status:     domain.StatusActive,
		RedeemedAt: nil,
		CreatedAt:  time.Now(),
	}

	// Save to repository
	if err := s.voucherPurchaseRepo.CreatePurchase(ctx, purchase); err != nil {
		return nil, fmt.Errorf("failed to create voucher purchase: %w", err)
	}

	return purchase, nil
}

// RedeemVoucher redeems a voucher purchase
func (s *VoucherService) RedeemVoucher(ctx context.Context, req *dto.RedeemVoucherRequest) error {
	// Validate request
	if req.VoucherID == uuid.Nil {
		return fmt.Errorf("invalid voucher_id")
	}

	// Check if purchase exists
	purchase, err := s.voucherPurchaseRepo.GetPurchaseByVoucherID(ctx, req.VoucherID)
	if err != nil {
		return fmt.Errorf("voucher purchase not found: %w", err)
	}

	// Check if already redeemed
	if purchase.Status == domain.StatusRedeemed {
		return fmt.Errorf("voucher already redeemed")
	}

	// Update status to redeemed
	redeemedAt := req.RedeemedAt
	if err := s.voucherPurchaseRepo.UpdatePurchaseStatus(ctx, req.VoucherID, domain.StatusRedeemed, &redeemedAt); err != nil {
		return fmt.Errorf("failed to redeem voucher: %w", err)
	}

	return nil
}

// GetUserVouchers retrieves all vouchers purchased by a user
func (s *VoucherService) GetUserVouchers(ctx context.Context, userID int64) ([]*domain.UserVoucherResponse, error) {
	if userID <= 0 {
		return nil, fmt.Errorf("invalid user_id")
	}

	vouchers, err := s.voucherPurchaseRepo.GetUserVouchers(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user vouchers: %w", err)
	}

	return vouchers, nil
}