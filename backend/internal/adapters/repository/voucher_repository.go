package repository

import (
	"context"
	"fmt"
	"time"

	"4SaleBackendSkeleton/internal/domain"
	"4SaleBackendSkeleton/internal/infrastructure/database"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

// VoucherRepository implements the voucher repository interface
type VoucherRepository struct {
	db *database.PostgresDB
}

// NewVoucherRepository creates a new voucher repository
func NewVoucherRepository(db *database.PostgresDB) *VoucherRepository {
	return &VoucherRepository{db: db}
}

// CreateVoucher creates a new voucher in the database
func (r *VoucherRepository) CreateVoucher(ctx context.Context, voucher *domain.Voucher) error {
	query := `
		INSERT INTO vouchers (id, adv_id, user_id, title, description, price, photo_url, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`

	_, err := r.db.Pool.Exec(ctx, query,
		voucher.ID,
		voucher.AdvID,
		voucher.UserID,
		voucher.Title,
		voucher.Description,
		voucher.Price,
		voucher.PhotoURL,
		voucher.CreatedAt,
	)

	if err != nil {
		return fmt.Errorf("failed to create voucher: %w", err)
	}

	return nil
}

// GetVoucherByID retrieves a voucher by its ID
func (r *VoucherRepository) GetVoucherByID(ctx context.Context, id uuid.UUID) (*domain.Voucher, error) {
	query := `
		SELECT id, adv_id, user_id, title, description, price, photo_url, created_at
		FROM vouchers
		WHERE id = $1`

	var voucher domain.Voucher
	err := r.db.Pool.QueryRow(ctx, query, id).Scan(
		&voucher.ID,
		&voucher.AdvID,
		&voucher.UserID,
		&voucher.Title,
		&voucher.Description,
		&voucher.Price,
		&voucher.PhotoURL,
		&voucher.CreatedAt,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("voucher not found")
		}
		return nil, fmt.Errorf("failed to get voucher: %w", err)
	}

	return &voucher, nil
}

// GetVouchersByUserID retrieves all vouchers for a specific user
func (r *VoucherRepository) GetVouchersByUserID(ctx context.Context, userID int64) ([]*domain.Voucher, error) {
	query := `
		SELECT id, adv_id, user_id, title, description, price, photo_url, created_at
		FROM vouchers
		WHERE user_id = $1
		ORDER BY created_at DESC`

	rows, err := r.db.Pool.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query vouchers: %w", err)
	}
	defer rows.Close()

	var vouchers []*domain.Voucher
	for rows.Next() {
		var voucher domain.Voucher
		err := rows.Scan(
			&voucher.ID,
			&voucher.AdvID,
			&voucher.UserID,
			&voucher.Title,
			&voucher.Description,
			&voucher.Price,
			&voucher.PhotoURL,
			&voucher.CreatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan voucher: %w", err)
		}
		vouchers = append(vouchers, &voucher)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating vouchers: %w", err)
	}

	return vouchers, nil
}