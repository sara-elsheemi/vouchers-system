-- Initialize the voucher system database
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vouchers table
CREATE TABLE IF NOT EXISTS vouchers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    adv_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voucher purchases table
CREATE TABLE IF NOT EXISTS voucher_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    voucher_id UUID NOT NULL REFERENCES vouchers(id),
    buyer_id BIGINT NOT NULL,
    qr_code TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    redeemed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_vouchers_user_id ON vouchers(user_id);
CREATE INDEX IF NOT EXISTS idx_voucher_purchases_buyer_id ON voucher_purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_voucher_purchases_voucher_id ON voucher_purchases(voucher_id);
CREATE INDEX IF NOT EXISTS idx_voucher_purchases_status ON voucher_purchases(status);

-- Insert sample data
INSERT INTO vouchers (id, adv_id, user_id, title, description, price, photo_url, created_at) VALUES 
('a1b2c3d4-e5f6-4890-abcd-ef1234567890', 1001, 98765, '30% Off Electronics', 'Get 30% discount on all electronic items including smartphones, laptops, and accessories. Valid for online and in-store purchases.', 25.00, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop', NOW()),
('b2c3d4e5-f6a7-4901-bcde-f23456789012', 1002, 98765, 'Free Shipping on Orders $50+', 'Enjoy free shipping on all orders over $50. No minimum purchase required for premium members.', 10.00, 'https://images.unsplash.com/photo-1566041515394-cf7c8fe21800?w=400&h=300&fit=crop', NOW()),
('c3d4e5f6-a7b8-4012-cdef-345678901234', 1003, 98765, '$20 Off Fashion Items', 'Save $20 on fashion and clothing items. Perfect for updating your wardrobe with the latest trends.', 20.00, 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop', NOW()),
('d4e5f6a7-b8c9-4123-defa-456789012345', 1004, 98765, 'Buy 2 Get 1 Free Books', 'Special promotion on all books and educational materials. Perfect for students and avid readers.', 15.00, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', NOW());

INSERT INTO voucher_purchases (id, voucher_id, buyer_id, qr_code, status, created_at) 
SELECT 
  uuid_generate_v4(),
  v.id,
  98765,
  'QR_' || v.id::text,
  CASE 
    WHEN v.title = '$20 Off Fashion Items' THEN 'redeemed'
    ELSE 'active'
  END,
  NOW()
FROM vouchers v WHERE v.user_id = 98765;

-- Update redeemed_at for redeemed vouchers
UPDATE voucher_purchases 
SET redeemed_at = NOW() - INTERVAL '2 days'
WHERE status = 'redeemed';