package handlers

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/zerolog"
)

// Router handles HTTP routing
type Router struct {
	voucherHandler *VoucherHandler
	logger         zerolog.Logger
}

// NewRouter creates a new router
func NewRouter(voucherHandler *VoucherHandler, logger zerolog.Logger) *Router {
	return &Router{
		voucherHandler: voucherHandler,
		logger:         logger,
	}
}

// SetupRoutes configures all application routes
func (rt *Router) SetupRoutes() *mux.Router {
	r := mux.NewRouter()

	// Apply middleware
	r.Use(rt.loggingMiddleware)
	r.Use(rt.corsMiddleware)

	// Health check endpoint
	r.HandleFunc("/health", rt.healthCheck).Methods("GET")

	// Webhook endpoints
	webhookRouter := r.PathPrefix("/webhook").Subrouter()
	webhookRouter.HandleFunc("/voucher-created", rt.voucherHandler.CreateVoucherWebhook).Methods("POST")
	webhookRouter.HandleFunc("/voucher-purchased", rt.voucherHandler.PurchaseVoucherWebhook).Methods("POST")
	webhookRouter.HandleFunc("/voucher-redeemed", rt.voucherHandler.RedeemVoucherWebhook).Methods("POST")

	// WebView API endpoints
	apiRouter := r.PathPrefix("/vouchers").Subrouter()
	apiRouter.HandleFunc("/{user_id:[0-9]+}", rt.voucherHandler.GetUserVouchers).Methods("GET")

	return r
}

// healthCheck returns the health status of the application
func (rt *Router) healthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status": "healthy", "service": "voucher-api"}`))
}

// loggingMiddleware logs HTTP requests
func (rt *Router) loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		rt.logger.Info().
			Str("method", r.Method).
			Str("path", r.URL.Path).
			Str("remote_addr", r.RemoteAddr).
			Msg("HTTP request")

		next.ServeHTTP(w, r)
	})
}

// corsMiddleware handles CORS headers
func (rt *Router) corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}