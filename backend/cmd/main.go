package main

import (
        "bytes"
        "context"
        "crypto/rand"
        "database/sql"
        "encoding/base64"
        "encoding/json"
        "fmt"
        "io/ioutil"
        "log"
        "net/http"
        "os"
        "path/filepath"
        "strconv"
        "strings"
        "time"

        _ "github.com/go-sql-driver/mysql"
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

// Authentication DTOs
type LoginRequest struct {
        Phone    string `json:"phone"`
        Password string `json:"password"`
}

type TokenInfo struct {
        AccessToken string      `json:"access_token"`
        ExpiresAt   *time.Time  `json:"expires_at"`
        Type        string      `json:"type"`
}

type UserType struct {
        UserTypeName          string   `json:"user_type_name"`
        UserTypeID            int      `json:"user_type_id"`
        TargetCatID           *int     `json:"target_cat_id"`
        AllowPostListing      bool     `json:"allow_post_listing"`
        NotAllowedCategories  []int    `json:"not_allowed_categories"`
        Permissions           []string `json:"permissions"`
}

type UserInfo struct {
        UserID              int64     `json:"user_id"`
        ParentUserID        *int64    `json:"parent_user_id"`
        AllowFollow         int       `json:"allow_follow"`
        Email               string    `json:"email"`
        FirstName           string    `json:"first_name"`
        FreeAds             string    `json:"free_ads"`
        PremiumAds          string    `json:"premium_ads"`
        Image               *string   `json:"image"`
        IsEmailVerified     int       `json:"is_email_verified"`
        NumberOfFollowers   int       `json:"number_of_followers"`
        NumberOfFollowing   int       `json:"number_of_following"`
        Phone               string    `json:"phone"`
        Language            string    `json:"language"`
        MemberSince         string    `json:"member_since"`
        RegionID            int       `json:"region_id"`
        IsFresh             int       `json:"is_fresh"`
        IsBlock             int       `json:"is_block"`
        UserType            *UserType `json:"user_type,omitempty"`
        HasListings         bool      `json:"has_listings"`
}

type LoginData struct {
        Token TokenInfo `json:"token"`
        User  UserInfo  `json:"user"`
}

type LoginResponse struct {
        Data    LoginData `json:"data"`
        Message string    `json:"message"`
}

type TokenValidationData struct {
        User UserInfo `json:"user"`
}

type TokenValidationResponse struct {
        Data    TokenValidationData `json:"data"`
        Message *string             `json:"message"`
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

// Authentication utility functions
func generateToken(userID int64) string {
        // Simple token generation - in production, use JWT or proper token generation
        timestamp := time.Now().Unix()
        tokenData := fmt.Sprintf("user:%d:timestamp:%d:uuid:%s", userID, timestamp, generateUUID())
        return base64.StdEncoding.EncodeToString([]byte(tokenData))
}

func validatePhoneNumber(phone string) bool {
        // Basic phone validation - add more sophisticated validation as needed
        return len(phone) >= 8 && len(phone) <= 15
}

func extractBearerToken(authHeader string) string {
        if authHeader == "" {
                return ""
        }
        parts := strings.Split(authHeader, " ")
        if len(parts) != 2 || parts[0] != "Bearer" {
                return ""
        }
        return parts[1]
}

// Database operations
func createVoucher(ctx context.Context, voucher *Voucher) error {
        query := `
                INSERT INTO vouchers (id, adv_id, user_id, title, description, price, photo_url, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

        _, err := db.ExecContext(ctx, query,
                voucher.ID, voucher.AdvID, voucher.UserID, voucher.Title,
                voucher.Description, voucher.Price, voucher.PhotoURL, voucher.CreatedAt)

        return err
}

func getVoucherByID(ctx context.Context, id string) (*Voucher, error) {
        query := `
                SELECT id, adv_id, user_id, title, description, price, photo_url, created_at
                FROM vouchers WHERE id = ?`

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
                VALUES (?, ?, ?, ?, ?, ?, ?)`

        _, err := db.ExecContext(ctx, query,
                purchase.ID, purchase.VoucherID, purchase.BuyerID, purchase.QRCode,
                purchase.Status, purchase.RedeemedAt, purchase.CreatedAt)

        return err
}

func getPurchaseByVoucherID(ctx context.Context, voucherID string) (*VoucherPurchase, error) {
        query := `
                SELECT id, voucher_id, buyer_id, qr_code, status, redeemed_at, created_at
                FROM voucher_purchases WHERE voucher_id = ?`

        var purchase VoucherPurchase
        err := db.QueryRowContext(ctx, query, voucherID).Scan(
                &purchase.ID, &purchase.VoucherID, &purchase.BuyerID, &purchase.QRCode,
                &purchase.Status, &purchase.RedeemedAt, &purchase.CreatedAt)

        if err == sql.ErrNoRows {
                return nil, fmt.Errorf("purchase not found")
        }
        return &purchase, err
}

func getPurchaseByQRCode(ctx context.Context, qrCode string) (*VoucherPurchase, error) {
        query := `
                SELECT id, voucher_id, buyer_id, qr_code, status, redeemed_at, created_at
                FROM voucher_purchases WHERE qr_code = ?`

        var purchase VoucherPurchase
        err := db.QueryRowContext(ctx, query, qrCode).Scan(
                &purchase.ID, &purchase.VoucherID, &purchase.BuyerID, &purchase.QRCode,
                &purchase.Status, &purchase.RedeemedAt, &purchase.CreatedAt)

        if err == sql.ErrNoRows {
                return nil, fmt.Errorf("purchase not found")
        }
        return &purchase, err
}

func updatePurchaseStatus(ctx context.Context, voucherID, status string, redeemedAt *time.Time) error {
        query := `UPDATE voucher_purchases SET status = ?, redeemed_at = ? WHERE voucher_id = ?`
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
                WHERE vp.buyer_id = ?
                ORDER BY vp.created_at DESC`

        rows, err := db.QueryContext(ctx, query, userID)
        if err != nil {
                return nil, err
        }
        defer rows.Close()

        // Initialize with empty slice to ensure JSON returns [] instead of null
        vouchers := make([]*UserVoucherResponse, 0)
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

// Authentication database operations (mock implementation)
func authenticateUser(ctx context.Context, phone, password string) (*UserInfo, error) {
        // Real 4Sale API integration
        apiURL := "https://staging-services.q84sale.com/api/v1/users/auth/login"
        
        // Prepare request body
        requestBody := map[string]string{
                "phone":    phone,
                "password": password,
        }
        
        jsonBody, err := json.Marshal(requestBody)
        if err != nil {
                return nil, fmt.Errorf("failed to marshal request body: %v", err)
        }
        
        // Create HTTP request
        req, err := http.NewRequestWithContext(ctx, "POST", apiURL, bytes.NewBuffer(jsonBody))
        if err != nil {
                return nil, fmt.Errorf("failed to create request: %v", err)
        }
        
        // Set required headers
        req.Header.Set("Accept", "application/json")
        req.Header.Set("Version-Number", "26.0.0")
        req.Header.Set("Device-Id", "voucher-system-device-001")
        req.Header.Set("Accept-Language", "en")
        req.Header.Set("Content-Type", "application/json")
        
        // Make HTTP request
        client := &http.Client{Timeout: 30 * time.Second}
        resp, err := client.Do(req)
        if err != nil {
                return nil, fmt.Errorf("failed to make request: %v", err)
        }
        defer resp.Body.Close()
        
        // Read response body
        body, err := ioutil.ReadAll(resp.Body)
        if err != nil {
                return nil, fmt.Errorf("failed to read response body: %v", err)
        }
        
        // Check if request was successful
        if resp.StatusCode != http.StatusOK {
                log.Printf("4Sale API error: Status %d, Body: %s", resp.StatusCode, string(body))
                return nil, fmt.Errorf("authentication failed with status %d", resp.StatusCode)
        }
        
        // Parse response
        var loginResponse LoginResponse
        if err := json.Unmarshal(body, &loginResponse); err != nil {
                return nil, fmt.Errorf("failed to parse response: %v", err)
        }
        
        log.Printf("4Sale API login successful for user: %s", loginResponse.Data.User.FirstName)
        return &loginResponse.Data.User, nil
}

func validateToken(ctx context.Context, token string) (*UserInfo, time.Time, error) {
	// Real 4Sale API token validation
	apiURL := "https://staging-services.q84sale.com/api/v1/users/auth/validate"
	
	// Create HTTP request
	req, err := http.NewRequestWithContext(ctx, "GET", apiURL, nil)
	if err != nil {
		return nil, time.Time{}, fmt.Errorf("failed to create request: %v", err)
	}
	
	// Set required headers
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/json")
	
	// Make HTTP request
	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, time.Time{}, fmt.Errorf("failed to make request: %v", err)
	}
	defer resp.Body.Close()
	
	// Read response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, time.Time{}, fmt.Errorf("failed to read response body: %v", err)
	}
	
	// Check if request was successful
	if resp.StatusCode != http.StatusOK {
		log.Printf("4Sale token validation error: Status %d, Body: %s", resp.StatusCode, string(body))
		return nil, time.Time{}, fmt.Errorf("token validation failed with status %d", resp.StatusCode)
	}
	
	// Parse response
	var validationResponse TokenValidationResponse
	if err := json.Unmarshal(body, &validationResponse); err != nil {
		return nil, time.Time{}, fmt.Errorf("failed to parse response: %v", err)
	}
	
	log.Printf("4Sale token validation successful for user: %s", validationResponse.Data.User.FirstName)
	
	// Return user info and current time as expiry (since 4Sale doesn't provide expiry)
	return &validationResponse.Data.User, time.Now().Add(24 * time.Hour), nil
}

// HTTP Handlers
func writeJSONResponse(w http.ResponseWriter, status int, response APIResponse) {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(status)
        json.NewEncoder(w).Encode(response)
}

// Authentication handlers
func loginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSONResponse(w, http.StatusMethodNotAllowed, APIResponse{
			Success: false,
			Error:   "Method not allowed",
		})
		return
	}

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSONResponse(w, http.StatusBadRequest, APIResponse{
			Success: false,
			Error:   "Invalid request body",
		})
		return
	}

	// Validation
	if req.Phone == "" || req.Password == "" {
		writeJSONResponse(w, http.StatusBadRequest, APIResponse{
			Success: false,
			Error:   "Phone and password are required",
		})
		return
	}

	if !validatePhoneNumber(req.Phone) {
		writeJSONResponse(w, http.StatusBadRequest, APIResponse{
			Success: false,
			Error:   "Invalid phone number format",
		})
		return
	}

	// Call real 4Sale API for authentication
	apiURL := "https://staging-services.q84sale.com/api/v1/users/auth/login"
	
	// Prepare request body
	requestBody := map[string]string{
		"phone":    req.Phone,
		"password": req.Password,
	}
	
	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		log.Printf("Failed to marshal request body: %v", err)
		writeJSONResponse(w, http.StatusInternalServerError, APIResponse{
			Success: false,
			Error:   "Internal server error",
		})
		return
	}
	
	// Create HTTP request
	httpReq, err := http.NewRequestWithContext(r.Context(), "POST", apiURL, bytes.NewBuffer(jsonBody))
	if err != nil {
		log.Printf("Failed to create request: %v", err)
		writeJSONResponse(w, http.StatusInternalServerError, APIResponse{
			Success: false,
			Error:   "Internal server error",
		})
		return
	}
	
	// Set required headers
	httpReq.Header.Set("Accept", "application/json")
	httpReq.Header.Set("Version-Number", "26.0.0")
	httpReq.Header.Set("Device-Id", "voucher-system-device-001")
	httpReq.Header.Set("Accept-Language", "en")
	httpReq.Header.Set("Content-Type", "application/json")
	
	// Make HTTP request
	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(httpReq)
	if err != nil {
		log.Printf("Failed to make request to 4Sale API: %v", err)
		writeJSONResponse(w, http.StatusInternalServerError, APIResponse{
			Success: false,
			Error:   "Authentication service unavailable",
		})
		return
	}
	defer resp.Body.Close()
	
	// Read response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Failed to read response body: %v", err)
		writeJSONResponse(w, http.StatusInternalServerError, APIResponse{
			Success: false,
			Error:   "Internal server error",
		})
		return
	}
	
	// Check if request was successful
	if resp.StatusCode != http.StatusOK {
		log.Printf("4Sale API authentication failed: Status %d, Body: %s", resp.StatusCode, string(body))
		writeJSONResponse(w, http.StatusUnauthorized, APIResponse{
			Success: false,
			Error:   "Invalid credentials",
		})
		return
	}
	
	// Parse response
	var loginResponse LoginResponse
	if err := json.Unmarshal(body, &loginResponse); err != nil {
		log.Printf("Failed to parse 4Sale API response: %v", err)
		writeJSONResponse(w, http.StatusInternalServerError, APIResponse{
			Success: false,
			Error:   "Internal server error",
		})
		return
	}

	log.Printf("User authenticated successfully via 4Sale API: UserID=%d, Phone=%s", 
		loginResponse.Data.User.UserID, loginResponse.Data.User.Phone)

	// Return the response directly from 4Sale API
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(loginResponse)
}

func validateTokenHandler(w http.ResponseWriter, r *http.Request) {
        if r.Method != http.MethodGet {
                writeJSONResponse(w, http.StatusMethodNotAllowed, APIResponse{
                        Success: false,
                        Error:   "Method not allowed",
                })
                return
        }

        // Extract token from Authorization header
        authHeader := r.Header.Get("Authorization")
        token := extractBearerToken(authHeader)
        
        if token == "" {
                writeJSONResponse(w, http.StatusUnauthorized, APIResponse{
                        Success: false,
                        Error:   "Authorization token required",
                })
                return
        }

        // Validate token
        user, _, err := validateToken(r.Context(), token)
        if err != nil {
                log.Printf("Token validation failed: %v", err)
                writeJSONResponse(w, http.StatusUnauthorized, APIResponse{
                        Success: false,
                        Error:   "Invalid or expired token",
                })
                return
        }

        validationData := TokenValidationData{
                User: *user,
        }

        response := TokenValidationResponse{
                Data:    validationData,
                Message: nil, // null as per your example
        }

        log.Printf("Token validated successfully: UserID=%d", user.UserID)

        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusOK)
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
        if req.AdvID <= 0 || req.UserID <= 0 || req.Title == "" || req.Price <= 0 {
                writeJSONResponse(w, http.StatusBadRequest, APIResponse{
                        Success: false,
                        Error:   "Invalid request data",
                })
                return
        }

        // Create voucher
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

        log.Printf("Voucher created: ID=%s, Title=%s, UserID=%d", voucher.ID, voucher.Title, voucher.UserID)

        writeJSONResponse(w, http.StatusCreated, APIResponse{
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
        voucher, err := getVoucherByID(r.Context(), req.VoucherID)
        if err != nil {
                writeJSONResponse(w, http.StatusNotFound, APIResponse{
                        Success: false,
                        Error:   "Voucher not found",
                })
                return
        }

        // Create purchase
        purchase := &VoucherPurchase{
                ID:         generateUUID(),
                VoucherID:  req.VoucherID,
                BuyerID:    req.BuyerID,
                QRCode:     generateQRCode(req.VoucherID),
                Status:     "active",
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

        log.Printf("Voucher purchased: VoucherID=%s, BuyerID=%d, PurchaseID=%s", 
                req.VoucherID, req.BuyerID, purchase.ID)

        writeJSONResponse(w, http.StatusCreated, APIResponse{
                Success: true,
                Message: "Voucher purchased successfully",
                Data:    map[string]interface{}{
                        "purchase": purchase,
                        "voucher":  voucher,
                },
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

        // Check if purchase exists by QR code (since QR scanner sends the actual QR code data)
        purchase, err := getPurchaseByQRCode(r.Context(), req.VoucherID)
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

        // Update status using the actual voucher ID from the purchase record
        redeemedAt := req.RedeemedAt
        if err := updatePurchaseStatus(r.Context(), purchase.VoucherID, "redeemed", &redeemedAt); err != nil {
                log.Printf("Failed to redeem voucher: %v", err)
                writeJSONResponse(w, http.StatusInternalServerError, APIResponse{
                        Success: false,
                        Error:   "Failed to redeem voucher",
                })
                return
        }

        log.Printf("Voucher redeemed: VoucherID=%s, QRCode=%s, RedeemedAt=%v", purchase.VoucherID, req.VoucherID, req.RedeemedAt)

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

// Static file serving handler
func staticFileHandler(w http.ResponseWriter, r *http.Request) {
        // Remove leading slash and serve from static directory
        path := strings.TrimPrefix(r.URL.Path, "/")
        if path == "" {
                path = "index.html"
        }
        
        staticDir := "./static"
        fullPath := filepath.Join(staticDir, path)
        
        // Check if file exists
        if _, err := os.Stat(fullPath); os.IsNotExist(err) {
                // If file doesn't exist, serve index.html (for SPA routing)
                fullPath = filepath.Join(staticDir, "index.html")
        }
        
        http.ServeFile(w, r, fullPath)
}

// CORS middleware
func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
        return func(w http.ResponseWriter, r *http.Request) {
                w.Header().Set("Access-Control-Allow-Origin", "*")
                w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
                w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, Version-Number, Device-Id, Accept-Language")

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
                connString = dbURL
        } else {
                // MySQL connection string format: user:password@tcp(host:port)/dbname
                connString = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
                        getEnv("DB_USER", "sc_voucher_dbuser"),
                        getEnv("DB_PASSWORD", "fOGYrE$TEND!uNcen^dIVeN"),
                        getEnv("DB_HOST", "staging-jan-4-2023-cluster.cluster-cylpew54lkmg.eu-west-1.rds.amazonaws.com"),
                        getEnv("DB_PORT", "3306"),
                        getEnv("DB_NAME", "sc_voucher"))
        }

        var err error
        db, err = sql.Open("mysql", connString)
        if err != nil {
                return fmt.Errorf("failed to open database: %w", err)
        }

        if err := db.Ping(); err != nil {
                return fmt.Errorf("failed to ping database: %w", err)
        }

        log.Printf("MySQL database connection established to: %s", getEnv("DB_HOST", "staging-jan-4-2023-cluster.cluster-cylpew54lkmg.eu-west-1.rds.amazonaws.com"))
        return nil
}

func getEnv(key, defaultValue string) string {
        if value := os.Getenv(key); value != "" {
                return value
        }
        return defaultValue
}

func main() {
        log.Println("Starting Combined Voucher System (Frontend + Backend)...")

        // Initialize database
        if err := initDatabase(); err != nil {
                log.Fatalf("Database initialization failed: %v", err)
        }
        defer db.Close()

        // Setup API routes
        http.HandleFunc("/health", corsMiddleware(loggingMiddleware(healthHandler)))
        
        // Authentication routes
        http.HandleFunc("/api/v1/users/auth/login", corsMiddleware(loggingMiddleware(loginHandler)))
        http.HandleFunc("/api/v1/users/auth/validate", corsMiddleware(loggingMiddleware(validateTokenHandler)))
        
        // Voucher webhook routes
        http.HandleFunc("/webhook/voucher-created", corsMiddleware(loggingMiddleware(createVoucherHandler)))
        http.HandleFunc("/webhook/voucher-purchased", corsMiddleware(loggingMiddleware(purchaseVoucherHandler)))
        http.HandleFunc("/webhook/voucher-redeemed", corsMiddleware(loggingMiddleware(redeemVoucherHandler)))
        http.HandleFunc("/vouchers/", corsMiddleware(loggingMiddleware(getUserVouchersHandler)))
        
        // Setup static file serving for frontend (all other routes)
        http.HandleFunc("/", loggingMiddleware(staticFileHandler))

        port := getEnv("PORT", "3001")
        host := getEnv("HOST", "0.0.0.0")
        addr := fmt.Sprintf("%s:%s", host, port)

        log.Printf("Combined Voucher System starting on %s", addr)
        log.Printf("Frontend available at: http://%s/", addr)
        log.Printf("Health check available at: http://%s/health", addr)
        log.Printf("API endpoints:")
        log.Printf("  POST /api/v1/users/auth/login")
        log.Printf("  GET /api/v1/users/auth/validate")
        log.Printf("  POST /webhook/voucher-created")
        log.Printf("  POST /webhook/voucher-purchased")
        log.Printf("  POST /webhook/voucher-redeemed")
        log.Printf("  GET /vouchers/{user_id}")

        if err := http.ListenAndServe(addr, nil); err != nil {
                log.Fatalf("Server failed to start: %v", err)
        }
} 