package domain

import (
	"time"

	"github.com/google/uuid"
)

// Voucher represents the core voucher entity
type Voucher struct {
	ID          uuid.UUID `json:"id"`
	AdvID       int64     `json:"adv_id"`
	UserID      int64     `json:"user_id"`
	Title       string    `json:"title"`
	Description *string   `json:"description"`
	Price       float64   `json:"price"`
	PhotoURL    *string   `json:"photo_url"`
	CreatedAt   time.Time `json:"created_at"`
}

// VoucherPurchase represents a voucher purchase entity
type VoucherPurchase struct {
	ID         uuid.UUID  `json:"id"`
	VoucherID  uuid.UUID  `json:"voucher_id"`
	BuyerID    int64      `json:"buyer_id"`
	QRCode     string     `json:"qr_code"`
	Status     string     `json:"status"`
	RedeemedAt *time.Time `json:"redeemed_at"`
	CreatedAt  time.Time  `json:"created_at"`
}

// UserVoucherResponse represents the response for user voucher list
type UserVoucherResponse struct {
	ID          uuid.UUID  `json:"id"`
	Title       string     `json:"title"`
	Description *string    `json:"description"`
	Status      string     `json:"status"`
	PhotoURL    *string    `json:"photo_url"`
	QRCode      *string    `json:"qr_code,omitempty"`
	Price       float64    `json:"price"`
	PurchasedAt time.Time  `json:"purchased_at"`
	RedeemedAt  *time.Time `json:"redeemed_at"`
}

// Validation constants
const (
	StatusActive   = "active"
	StatusRedeemed = "redeemed"
)

// ValidateStatus checks if the status is valid
func ValidateStatus(status string) bool {
	return status == StatusActive || status == StatusRedeemed
}