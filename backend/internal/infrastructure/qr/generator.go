package qr

import (
	"encoding/base64"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/skip2/go-qrcode"
)

// QRGenerator implements QR code generation
type QRGenerator struct{}

// NewQRGenerator creates a new QR code generator
func NewQRGenerator() *QRGenerator {
	return &QRGenerator{}
}

// GenerateQRCode generates a unique QR code for a voucher purchase
func (q *QRGenerator) GenerateQRCode(data string) (string, error) {
	// Create unique QR data with timestamp and UUID
	uniqueData := fmt.Sprintf("%s-%d-%s", data, time.Now().Unix(), uuid.New().String())
	
	// Generate QR code as PNG bytes
	qrBytes, err := qrcode.Encode(uniqueData, qrcode.Medium, 256)
	if err != nil {
		return "", fmt.Errorf("failed to generate QR code: %w", err)
	}

	// Encode to base64
	qrBase64 := base64.StdEncoding.EncodeToString(qrBytes)
	
	return qrBase64, nil
}