package dto

import (
	"time"

	"github.com/google/uuid"
)

// CreateVoucherRequest represents the webhook payload for voucher creation
type CreateVoucherRequest struct {
	AdvID       int64   `json:"adv_id" validate:"required"`
	UserID      int64   `json:"user_id" validate:"required"`
	Title       string  `json:"title" validate:"required"`
	Description *string `json:"description"`
	Price       float64 `json:"price" validate:"required,min=0"`
	Photo       *string `json:"photo"`
}

// PurchaseVoucherRequest represents the webhook payload for voucher purchase
type PurchaseVoucherRequest struct {
	VoucherID uuid.UUID `json:"voucher_id" validate:"required"`
	BuyerID   int64     `json:"buyer_id" validate:"required"`
}

// RedeemVoucherRequest represents the webhook payload for voucher redemption
type RedeemVoucherRequest struct {
	VoucherID  uuid.UUID `json:"voucher_id" validate:"required"`
	RedeemedAt time.Time `json:"redeemed_at" validate:"required"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
	Code    int    `json:"code"`
}

// SuccessResponse represents a success response
type SuccessResponse struct {
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}