package repository

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"4SaleBackendSkeleton/internal/domain"
	"4SaleBackendSkeleton/internal/infrastructure/database"
	"github.com/google/uuid"
)

// VoucherPurchaseRepositorySQL implements the voucher purchase repository interface with SQL
type VoucherPurchaseRepositorySQL struct {
	db *database.PostgresDB
}

// NewVoucherPurchaseRepositorySQL creates a new voucher purchase repository
func NewVoucherPurchaseRepositorySQL(db *database.PostgresDB) *VoucherPurchaseRepositorySQL {
	return &VoucherPurchaseRepositorySQL{db: db}
}

// CreatePurchase creates a new voucher purchase in the database
func (r *VoucherPurchaseRepositorySQL) CreatePurchase(ctx context.Context, purchase *domain.VoucherPurchase) error {
	query := `
		INSERT INTO voucher_purchases (id, voucher_id, buyer_id, qr_code, status, redeemed_at, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)`

	_, err := r.db.DB.ExecContext(ctx, query,
		purchase.ID,
		purchase.VoucherID,
		purchase.BuyerID,
		purchase.QRCode,
		purchase.Status,
		purchase.RedeemedAt,
		purchase.CreatedAt,
	)

	if err != nil {
		return fmt.Errorf("failed to create voucher purchase: %w", err)
	}

	return nil
}

// GetPurchaseByVoucherID retrieves a purchase by voucher ID
func (r *VoucherPurchaseRepositorySQL) GetPurchaseByVoucherID(ctx context.Context, voucherID uuid.UUID) (*domain.VoucherPurchase, error) {
	query := `
		SELECT id, voucher_id, buyer_id, qr_code, status, redeemed_at, created_at
		FROM voucher_purchases
		WHERE voucher_id = $1`

	var purchase domain.VoucherPurchase
	err := r.db.DB.QueryRowContext(ctx, query, voucherID).Scan(
		&purchase.ID,
		&purchase.VoucherID,
		&purchase.BuyerID,
		&purchase.QRCode,
		&purchase.Status,
		&purchase.RedeemedAt,
		&purchase.CreatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("voucher purchase not found")
		}
		return nil, fmt.Errorf("failed to get voucher purchase: %w", err)
	}

	return &purchase, nil
}

// GetPurchasesByBuyerID retrieves all purchases for a specific buyer
func (r *VoucherPurchaseRepositorySQL) GetPurchasesByBuyerID(ctx context.Context, buyerID int64) ([]*domain.VoucherPurchase, error) {
	query := `
		SELECT id, voucher_id, buyer_id, qr_code, status, redeemed_at, created_at
		FROM voucher_purchases
		WHERE buyer_id = $1
		ORDER BY created_at DESC`

	rows, err := r.db.DB.QueryContext(ctx, query, buyerID)
	if err != nil {
		return nil, fmt.Errorf("failed to query voucher purchases: %w", err)
	}
	defer rows.Close()

	var purchases []*domain.VoucherPurchase
	for rows.Next() {
		var purchase domain.VoucherPurchase
		err := rows.Scan(
			&purchase.ID,
			&purchase.VoucherID,
			&purchase.BuyerID,
			&purchase.QRCode,
			&purchase.Status,
			&purchase.RedeemedAt,
			&purchase.CreatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan voucher purchase: %w", err)
		}
		purchases = append(purchases, &purchase)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating voucher purchases: %w", err)
	}

	return purchases, nil
}

// UpdatePurchaseStatus updates the status and redeemed_at of a voucher purchase
func (r *VoucherPurchaseRepositorySQL) UpdatePurchaseStatus(ctx context.Context, voucherID uuid.UUID, status string, redeemedAt *time.Time) error {
	query := `
		UPDATE voucher_purchases
		SET status = $1, redeemed_at = $2
		WHERE voucher_id = $3`

	result, err := r.db.DB.ExecContext(ctx, query, status, redeemedAt, voucherID)
	if err != nil {
		return fmt.Errorf("failed to update voucher purchase status: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("voucher purchase not found")
	}

	return nil
}

// GetUserVouchers retrieves all vouchers purchased by a user with detailed information
func (r *VoucherPurchaseRepositorySQL) GetUserVouchers(ctx context.Context, userID int64) ([]*domain.UserVoucherResponse, error) {
	query := `
		SELECT 
			vp.id,
			v.title,
			v.description,
			vp.status,
			v.photo_url,
			CASE WHEN vp.status = 'active' THEN vp.qr_code ELSE NULL END as qr_code,
			v.price,
			vp.created_at,
			vp.redeemed_at
		FROM voucher_purchases vp
		JOIN vouchers v ON vp.voucher_id = v.id
		WHERE vp.buyer_id = $1
		ORDER BY vp.created_at DESC`

	rows, err := r.db.DB.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query user vouchers: %w", err)
	}
	defer rows.Close()

	var userVouchers []*domain.UserVoucherResponse
	for rows.Next() {
		var voucher domain.UserVoucherResponse
		err := rows.Scan(
			&voucher.ID,
			&voucher.Title,
			&voucher.Description,
			&voucher.Status,
			&voucher.PhotoURL,
			&voucher.QRCode,
			&voucher.Price,
			&voucher.PurchasedAt,
			&voucher.RedeemedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan user voucher: %w", err)
		}
		userVouchers = append(userVouchers, &voucher)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating user vouchers: %w", err)
	}

	return userVouchers, nil
}