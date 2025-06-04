package main

import (
        "context"
        "crypto/rand"
        "database/sql"
        "encoding/base64"
        "encoding/json"
        "fmt"
        "log"
        "net/http"
        "os"
        "strconv"
        "strings"
        "time"

        _ "github.com/lib/pq"
)

// Domain Models
type Voucher struct {
        ID          string     `json:"id"`
        AdvID       int64      `json:"adv_id"`
        UserID      int64      `json:"user_id"`
        Title       string     `json:"title"`
        Description *string    `json:"description"`
        Price       float64    `json:"price"`
        PhotoURL    *string    `json:"photo_url"`
        CreatedAt   time.Time  `json:"created_at"`
}

type VoucherPurchase struct {
        ID         string     `json:"id"`
        VoucherID  string     `json:"voucher_id"`
        BuyerID    int64      `json:"buyer_id"`
        QRCode     string     `json:"qr_code"`
        Status     string     `json:"status"`
        RedeemedAt *time.Time `json:"redeemed_at"`
        CreatedAt  time.Time  `json:"created_at"`
}

type UserVoucherResponse struct {
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

// Request DTOs
type CreateVoucherRequest struct {
        AdvID       int64   `json:"adv_id"`
        UserID      int64   `json:"user_id"`
        Title       string  `json:"title"`
        Description *string `json:"description"`
        Price       float64 `json:"price"`
        Photo       *string `json:"photo"`
}

type PurchaseVoucherRequest struct {
        VoucherID string `json:"voucher_id"`
        BuyerID   int64  `json:"buyer_id"`
}

type RedeemVoucherRequest struct {
        VoucherID  string    `json:"voucher_id"`
        RedeemedAt time.Time `json:"redeemed_at"`
}

// Response DTOs
type APIResponse struct {
        Success bool        `json:"success"`
        Message string      `json:"message"`
        Data    interface{} `json:"data,omitempty"`
        Error   string      `json:"error,omitempty"`
}

// Database connection
var db *sql.DB

// Utility functions
func generateUUID() string {
        b := make([]byte, 16)
        rand.Read(b)
        return fmt.Sprintf("%x-%x-%x-%x-%x", b[0:4], b[4:6], b[6:8], b[8:10], b[10:])
}

func generateQRCode(data string) string {
        // Simple base64 encoded QR data for demonstration
        timestamp := time.Now().Unix()
        qrData := fmt.Sprintf("%s-%d-%s", data, timestamp, generateUUID())
        return base64.StdEncoding.EncodeToString([]byte(qrData))
}

// Database operations
func createVoucher(ctx context.Context, voucher *Voucher) error {
        query := `
                INSERT INTO vouchers (id, adv_id, user_id, title, description, price, photo_url, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`

        _, err := db.ExecContext(ctx, query,
                voucher.ID, voucher.AdvID, voucher.UserID, voucher.Title,
                voucher.Description, voucher.Price, voucher.PhotoURL, voucher.CreatedAt)

        return err
}

func getVoucherByID(ctx context.Context, id string) (*Voucher, error) {
        query := `
                SELECT id, adv_id, user_id, title, description, price, photo_url, created_at
                FROM vouchers WHERE id = $1`

        var voucher Voucher
        err := db.QueryRowContext(ctx, query, id).Scan(
                &voucher.ID, &voucher.AdvID, &voucher.UserID, &voucher.Title,
                &voucher.Description, &voucher.Price, &voucher.PhotoURL, &voucher.CreatedAt)

        if err == sql.ErrNoRows {
                return nil, fmt.Errorf("voucher not found")
        }
        return &voucher, err
}

func createPurchase(ctx context.Context, purchase *VoucherPurchase) error {
        query := `
                INSERT INTO voucher_purchases (id, voucher_id, buyer_id, qr_code, status, redeemed_at, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7)`

        _, err := db.ExecContext(ctx, query,
                purchase.ID, purchase.VoucherID, purchase.BuyerID, purchase.QRCode,
                purchase.Status, purchase.RedeemedAt, purchase.CreatedAt)

        return err
}

func getPurchaseByVoucherID(ctx context.Context, voucherID string) (*VoucherPurchase, error) {
        query := `
                SELECT id, voucher_id, buyer_id, qr_code, status, redeemed_at, created_at
                FROM voucher_purchases WHERE voucher_id = $1`

        var purchase VoucherPurchase
        err := db.QueryRowContext(ctx, query, voucherID).Scan(
                &purchase.ID, &purchase.VoucherID, &purchase.BuyerID, &purchase.QRCode,
                &purchase.Status, &purchase.RedeemedAt, &purchase.CreatedAt)

        if err == sql.ErrNoRows {
                return nil, fmt.Errorf("purchase not found")
        }
        return &purchase, err
}

func updatePurchaseStatus(ctx context.Context, voucherID, status string, redeemedAt *time.Time) error {
        query := `UPDATE voucher_purchases SET status = $1, redeemed_at = $2 WHERE voucher_id = $3`
        result, err := db.ExecContext(ctx, query, status, redeemedAt, voucherID)
        if err != nil {
                return err
        }

        rowsAffected, _ := result.RowsAffected()
        if rowsAffected == 0 {
                return fmt.Errorf("purchase not found")
        }
        return nil
}

func getUserVouchers(ctx context.Context, userID int64) ([]*UserVoucherResponse, error) {
        query := `
                SELECT vp.id, v.title, v.description, vp.status, v.photo_url,
                        CASE WHEN vp.status = 'active' THEN vp.qr_code ELSE NULL END as qr_code,
                        v.price, vp.created_at, vp.redeemed_at
                FROM voucher_purchases vp
                JOIN vouchers v ON vp.voucher_id = v.id
                WHERE vp.buyer_id = $1
                ORDER BY vp.created_at DESC`

        rows, err := db.QueryContext(ctx, query, userID)
        if err != nil {
                return nil, err
        }
        defer rows.Close()

        var vouchers []*UserVoucherResponse
        for rows.Next() {
                var voucher UserVoucherResponse
                err := rows.Scan(&voucher.ID, &voucher.Title, &voucher.Description,
                        &voucher.Status, &voucher.PhotoURL, &voucher.QRCode,
                        &voucher.Price, &voucher.PurchasedAt, &voucher.RedeemedAt)
                if err != nil {
                        return nil, err
                }
                vouchers = append(vouchers, &voucher)
        }
        return vouchers, nil
}

// HTTP Handlers
func writeJSONResponse(w http.ResponseWriter, status int, response APIResponse) {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(status)
        json.NewEncoder(w).Encode(response)
}

func createVoucherHandler(w http.ResponseWriter, r *http.Request) {
        if r.Method != http.MethodPost {
                writeJSONResponse(w, http.StatusMethodNotAllowed, APIResponse{
                        Success: false,
                        Error:   "Method not allowed",
                })
                return
        }

        var req CreateVoucherRequest
        if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
                writeJSONResponse(w, http.StatusBadRequest, APIResponse{
                        Success: false,
                        Error:   "Invalid request body",
                })
                return
        }

        // Validation
        if req.AdvID <= 0 || req.UserID <= 0 || req.Title == "" || req.Price < 0 {
                writeJSONResponse(w, http.StatusBadRequest, APIResponse{
                        Success: false,
                        Error:   "Invalid request data",
                })
                return
        }

        voucher := &Voucher{
                ID:          generateUUID(),
                AdvID:       req.AdvID,
                UserID:      req.UserID,
                Title:       req.Title,
                Description: req.Description,
                Price:       req.Price,
                PhotoURL:    req.Photo,
                CreatedAt:   time.Now(),
        }

        if err := createVoucher(r.Context(), voucher); err != nil {
                log.Printf("Failed to create voucher: %v", err)
                writeJSONResponse(w, http.StatusInternalServerError, APIResponse{
                        Success: false,
                        Error:   "Failed to create voucher",
                })
                return
        }

        log.Printf("Voucher created: ID=%s, AdvID=%d, UserID=%d", voucher.ID, voucher.AdvID, voucher.UserID)

        writeJSONResponse(w, http.StatusOK, APIResponse{
                Success: true,
                Message: "Voucher created successfully",
                Data:    voucher,
        })
}

func purchaseVoucherHandler(w http.ResponseWriter, r *http.Request) {
        if r.Method != http.MethodPost {
                writeJSONResponse(w, http.StatusMethodNotAllowed, APIResponse{
                        Success: false,
                        Error:   "Method not allowed",
                })
                return
        }

        var req PurchaseVoucherRequest
        if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
                writeJSONResponse(w, http.StatusBadRequest, APIResponse{
                        Success: false,
                        Error:   "Invalid request body",
                })
                return
        }

        // Validation
        if req.VoucherID == "" || req.BuyerID <= 0 {
                writeJSONResponse(w, http.StatusBadRequest, APIResponse{
                        Success: false,
                        Error:   "Invalid request data",
                })
                return
        }

        // Check if voucher exists
        _, err := getVoucherByID(r.Context(), req.VoucherID)
        if err != nil {
                writeJSONResponse(w, http.StatusNotFound, APIResponse{
                        Success: false,
                        Error:   "Voucher not found",
                })
                return
        }

        // Check if already purchased
        _, err = getPurchaseByVoucherID(r.Context(), req.VoucherID)
        if err == nil {
                writeJSONResponse(w, http.StatusConflict, APIResponse{
                        Success: false,
                        Error:   "Voucher already purchased",
                })
                return
        }

        // Generate QR code
        qrData := fmt.Sprintf("voucher:%s:buyer:%d", req.VoucherID, req.BuyerID)
        qrCode := generateQRCode(qrData)

        purchase := &VoucherPurchase{
                ID:         generateUUID(),
                VoucherID:  req.VoucherID,
                BuyerID:    req.BuyerID,
                QRCode:     qrCode,
                Status:     "active",
                RedeemedAt: nil,
                CreatedAt:  time.Now(),
        }

        if err := createPurchase(r.Context(), purchase); err != nil {
                log.Printf("Failed to create purchase: %v", err)
                writeJSONResponse(w, http.StatusInternalServerError, APIResponse{
                        Success: false,
                        Error:   "Failed to purchase voucher",
                })
                return
        }

        log.Printf("Voucher purchased: ID=%s, VoucherID=%s, BuyerID=%d", purchase.ID, purchase.VoucherID, purchase.BuyerID)

        writeJSONResponse(w, http.StatusOK, APIResponse{
                Success: true,
                Message: "Voucher purchased successfully",
                Data:    purchase,
        })
}

func redeemVoucherHandler(w http.ResponseWriter, r *http.Request) {
        if r.Method != http.MethodPost {
                writeJSONResponse(w, http.StatusMethodNotAllowed, APIResponse{
                        Success: false,
                        Error:   "Method not allowed",
                })
                return
        }

        var req RedeemVoucherRequest
        if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
                writeJSONResponse(w, http.StatusBadRequest, APIResponse{
                        Success: false,
                        Error:   "Invalid request body",
                })
                return
        }

        // Validation
        if req.VoucherID == "" {
                writeJSONResponse(w, http.StatusBadRequest, APIResponse{
                        Success: false,
                        Error:   "Invalid request data",
                })
                return
        }

        // Check if purchase exists
        purchase, err := getPurchaseByVoucherID(r.Context(), req.VoucherID)
        if err != nil {
                writeJSONResponse(w, http.StatusNotFound, APIResponse{
                        Success: false,
                        Error:   "Purchase not found",
                })
                return
        }

        // Check if already redeemed
        if purchase.Status == "redeemed" {
                writeJSONResponse(w, http.StatusConflict, APIResponse{
                        Success: false,
                        Error:   "Voucher already redeemed",
                })
                return
        }

        // Update status
        redeemedAt := req.RedeemedAt
        if err := updatePurchaseStatus(r.Context(), req.VoucherID, "redeemed", &redeemedAt); err != nil {
                log.Printf("Failed to redeem voucher: %v", err)
                writeJSONResponse(w, http.StatusInternalServerError, APIResponse{
                        Success: false,
                        Error:   "Failed to redeem voucher",
                })
                return
        }

        log.Printf("Voucher redeemed: VoucherID=%s, RedeemedAt=%v", req.VoucherID, req.RedeemedAt)

        writeJSONResponse(w, http.StatusOK, APIResponse{
                Success: true,
                Message: "Voucher redeemed successfully",
        })
}

func getUserVouchersHandler(w http.ResponseWriter, r *http.Request) {
        if r.Method != http.MethodGet {
                writeJSONResponse(w, http.StatusMethodNotAllowed, APIResponse{
                        Success: false,
                        Error:   "Method not allowed",
                })
                return
        }

        // Extract user_id from URL path
        path := strings.TrimPrefix(r.URL.Path, "/vouchers/")
        userIDStr := strings.Split(path, "/")[0]

        userID, err := strconv.ParseInt(userIDStr, 10, 64)
        if err != nil || userID <= 0 {
                writeJSONResponse(w, http.StatusBadRequest, APIResponse{
                        Success: false,
                        Error:   "Invalid user ID",
                })
                return
        }

        vouchers, err := getUserVouchers(r.Context(), userID)
        if err != nil {
                log.Printf("Failed to get user vouchers: %v", err)
                writeJSONResponse(w, http.StatusInternalServerError, APIResponse{
                        Success: false,
                        Error:   "Failed to get vouchers",
                })
                return
        }

        log.Printf("Retrieved %d vouchers for user %d", len(vouchers), userID)

        writeJSONResponse(w, http.StatusOK, APIResponse{
                Success: true,
                Message: "Vouchers retrieved successfully",
                Data:    vouchers,
        })
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
        writeJSONResponse(w, http.StatusOK, APIResponse{
                Success: true,
                Message: "Voucher system is healthy",
                Data:    map[string]string{"service": "voucher-api", "status": "running"},
        })
}

// CORS middleware
func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
        return func(w http.ResponseWriter, r *http.Request) {
                w.Header().Set("Access-Control-Allow-Origin", "*")
                w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
                w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

                if r.Method == "OPTIONS" {
                        w.WriteHeader(http.StatusOK)
                        return
                }

                next(w, r)
        }
}

// Logging middleware
func loggingMiddleware(next http.HandlerFunc) http.HandlerFunc {
        return func(w http.ResponseWriter, r *http.Request) {
                start := time.Now()
                log.Printf("Started %s %s", r.Method, r.URL.Path)
                next(w, r)
                log.Printf("Completed %s %s in %v", r.Method, r.URL.Path, time.Since(start))
        }
}

func initDatabase() error {
        var connString string
        if dbURL := os.Getenv("DATABASE_URL"); dbURL != "" {
                // For Neon database, ensure proper SSL and endpoint configuration
                if !strings.Contains(dbURL, "sslmode") {
                        if strings.Contains(dbURL, "?") {
                                connString = dbURL + "&sslmode=require"
                        } else {
                                connString = dbURL + "?sslmode=require"
                        }
                } else {
                        connString = dbURL
                }
        } else {
                connString = fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=require",
                        getEnv("PGHOST", "localhost"),
                        getEnv("PGPORT", "5432"),
                        getEnv("PGUSER", "postgres"),
                        getEnv("PGPASSWORD", ""),
                        getEnv("PGDATABASE", "postgres"))
        }

        var err error
        db, err = sql.Open("postgres", connString)
        if err != nil {
                return fmt.Errorf("failed to open database: %w", err)
        }

        if err := db.Ping(); err != nil {
                return fmt.Errorf("failed to ping database: %w", err)
        }

        log.Println("Database connection established")
        return nil
}

func getEnv(key, defaultValue string) string {
        if value := os.Getenv(key); value != "" {
                return value
        }
        return defaultValue
}

func main() {
        log.Println("Starting Voucher System API...")

        // Initialize database
        if err := initDatabase(); err != nil {
                log.Fatalf("Database initialization failed: %v", err)
        }
        defer db.Close()

        // Setup routes
        http.HandleFunc("/health", corsMiddleware(loggingMiddleware(healthHandler)))
        http.HandleFunc("/webhook/voucher-created", corsMiddleware(loggingMiddleware(createVoucherHandler)))
        http.HandleFunc("/webhook/voucher-purchased", corsMiddleware(loggingMiddleware(purchaseVoucherHandler)))
        http.HandleFunc("/webhook/voucher-redeemed", corsMiddleware(loggingMiddleware(redeemVoucherHandler)))
        http.HandleFunc("/vouchers/", corsMiddleware(loggingMiddleware(getUserVouchersHandler)))

        port := getEnv("PORT", "5000")
        host := getEnv("HOST", "0.0.0.0")
        addr := fmt.Sprintf("%s:%s", host, port)

        log.Printf("Voucher System API starting on %s", addr)
        log.Printf("Health check available at: http://%s/health", addr)
        log.Printf("Webhook endpoints:")
        log.Printf("  POST /webhook/voucher-created")
        log.Printf("  POST /webhook/voucher-purchased")
        log.Printf("  POST /webhook/voucher-redeemed")
        log.Printf("WebView API:")
        log.Printf("  GET /vouchers/{user_id}")

        if err := http.ListenAndServe(addr, nil); err != nil {
                log.Fatalf("Server failed to start: %v", err)
        }
}
