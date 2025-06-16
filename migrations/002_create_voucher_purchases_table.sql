-- Migration: 002_create_voucher_purchases_table.sql
-- Description: Create the voucher_purchases table with foreign key to vouchers
-- Date: 2025-01-12

CREATE TABLE IF NOT EXISTS voucher_purchases (
    id VARCHAR(36) PRIMARY KEY,
    voucher_id VARCHAR(36) NOT NULL,
    buyer_id BIGINT NOT NULL,
    qr_code TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    redeemed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE CASCADE,
    
    -- Add indexes for performance
    INDEX idx_voucher_purchases_buyer_id (buyer_id),
    INDEX idx_voucher_purchases_voucher_id (voucher_id),
    INDEX idx_voucher_purchases_status (status),
    INDEX idx_voucher_purchases_created_at (created_at)
); 