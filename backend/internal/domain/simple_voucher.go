package domain

import (
	"time"
)

// SimpleVoucher represents the core voucher entity using string UUIDs
type SimpleVoucher struct {
	ID          string     `json:"id"`
	AdvID       int64      `json:"adv_id"`
	UserID      int64      `json:"user_id"`
	Title       string     `json:"title"`
	Description *string    `json:"description"`
	Price       float64    `json:"price"`
	PhotoURL    *string    `json:"photo_url"`
	CreatedAt   time.Time  `json:"created_at"`
}

// SimpleVoucherPurchase represents a voucher purchase entity using string UUIDs
type SimpleVoucherPurchase struct {
	ID         string     `json:"id"`
	VoucherID  string     `json:"voucher_id"`
	BuyerID    int64      `json:"buyer_id"`
	QRCode     string     `json:"qr_code"`
	Status     string     `json:"status"`
	RedeemedAt *time.Time `json:"redeemed_at"`
	CreatedAt  time.Time  `json:"created_at"`
}

// SimpleUserVoucherResponse represents the response for user voucher list
type SimpleUserVoucherResponse struct {
	ID          string     `json:"id"`
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
	SimpleStatusActive   = "active"
	SimpleStatusRedeemed = "redeemed"
)

// ValidateSimpleStatus checks if the status is valid
func ValidateSimpleStatus(status string) bool {
	return status == SimpleStatusActive || status == SimpleStatusRedeemed
}