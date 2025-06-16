-- Migration: 001_create_vouchers_table.sql
-- Description: Create the vouchers table
-- Date: 2025-01-12

CREATE TABLE IF NOT EXISTS vouchers (
    id VARCHAR(36) PRIMARY KEY,
    adv_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Add indexes for performance
    INDEX idx_vouchers_user_id (user_id),
    INDEX idx_vouchers_adv_id (adv_id),
    INDEX idx_vouchers_created_at (created_at)
); 