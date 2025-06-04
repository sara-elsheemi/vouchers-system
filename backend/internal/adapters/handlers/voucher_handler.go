package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"4SaleBackendSkeleton/internal/application/dto"
	"4SaleBackendSkeleton/internal/ports"
	"github.com/gorilla/mux"
	"github.com/rs/zerolog"
)

// VoucherHandler handles voucher-related HTTP requests
type VoucherHandler struct {
	voucherService ports.VoucherService
	logger         zerolog.Logger
}

// NewVoucherHandler creates a new voucher handler
func NewVoucherHandler(voucherService ports.VoucherService, logger zerolog.Logger) *VoucherHandler {
	return &VoucherHandler{
		voucherService: voucherService,
		logger:         logger,
	}
}

// CreateVoucherWebhook handles the POST /webhook/voucher-created endpoint
func (h *VoucherHandler) CreateVoucherWebhook(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var req dto.CreateVoucherRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.logger.Error().Err(err).Msg("Failed to decode create voucher request")
		h.writeErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	voucher, err := h.voucherService.CreateVoucher(ctx, &req)
	if err != nil {
		h.logger.Error().Err(err).Msg("Failed to create voucher")
		h.writeErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	h.logger.Info().
		Str("voucher_id", voucher.ID.String()).
		Int64("adv_id", voucher.AdvID).
		Int64("user_id", voucher.UserID).
		Msg("Voucher created successfully")

	h.writeSuccessResponse(w, "Voucher created successfully", voucher)
}

// PurchaseVoucherWebhook handles the POST /webhook/voucher-purchased endpoint
func (h *VoucherHandler) PurchaseVoucherWebhook(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var req dto.PurchaseVoucherRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.logger.Error().Err(err).Msg("Failed to decode purchase voucher request")
		h.writeErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	purchase, err := h.voucherService.PurchaseVoucher(ctx, &req)
	if err != nil {
		h.logger.Error().Err(err).Msg("Failed to purchase voucher")
		h.writeErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	h.logger.Info().
		Str("purchase_id", purchase.ID.String()).
		Str("voucher_id", purchase.VoucherID.String()).
		Int64("buyer_id", purchase.BuyerID).
		Msg("Voucher purchased successfully")

	h.writeSuccessResponse(w, "Voucher purchased successfully", purchase)
}

// RedeemVoucherWebhook handles the POST /webhook/voucher-redeemed endpoint
func (h *VoucherHandler) RedeemVoucherWebhook(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var req dto.RedeemVoucherRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.logger.Error().Err(err).Msg("Failed to decode redeem voucher request")
		h.writeErrorResponse(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if err := h.voucherService.RedeemVoucher(ctx, &req); err != nil {
		h.logger.Error().Err(err).Msg("Failed to redeem voucher")
		h.writeErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	h.logger.Info().
		Str("voucher_id", req.VoucherID.String()).
		Time("redeemed_at", req.RedeemedAt).
		Msg("Voucher redeemed successfully")

	h.writeSuccessResponse(w, "Voucher redeemed successfully", nil)
}

// GetUserVouchers handles the GET /vouchers/:user_id endpoint
func (h *VoucherHandler) GetUserVouchers(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	vars := mux.Vars(r)
	userIDStr, exists := vars["user_id"]
	if !exists {
		h.writeErrorResponse(w, "user_id is required", http.StatusBadRequest)
		return
	}

	userID, err := strconv.ParseInt(userIDStr, 10, 64)
	if err != nil {
		h.writeErrorResponse(w, "Invalid user_id", http.StatusBadRequest)
		return
	}

	vouchers, err := h.voucherService.GetUserVouchers(ctx, userID)
	if err != nil {
		h.logger.Error().Err(err).Int64("user_id", userID).Msg("Failed to get user vouchers")
		h.writeErrorResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	h.logger.Info().
		Int64("user_id", userID).
		Int("voucher_count", len(vouchers)).
		Msg("Retrieved user vouchers successfully")

	h.writeSuccessResponse(w, "User vouchers retrieved successfully", vouchers)
}

// writeErrorResponse writes an error response
func (h *VoucherHandler) writeErrorResponse(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	response := dto.ErrorResponse{
		Error:   "error",
		Message: message,
		Code:    statusCode,
	}

	json.NewEncoder(w).Encode(response)
}

// writeSuccessResponse writes a success response
func (h *VoucherHandler) writeSuccessResponse(w http.ResponseWriter, message string, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	response := dto.SuccessResponse{
		Message: message,
		Data:    data,
	}

	json.NewEncoder(w).Encode(response)
}