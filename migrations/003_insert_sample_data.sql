-- Migration: 003_insert_sample_data.sql
-- Description: Insert sample vouchers and purchases for testing
-- Date: 2025-01-12

-- Insert sample vouchers
INSERT INTO vouchers (id, adv_id, user_id, title, description, price, photo_url, created_at) VALUES 
('a1b2c3d4-e5f6-4890-abcd-ef1234567890', 1001, 98765, '30% Off Electronics', 'Get 30% discount on all electronic items including smartphones, laptops, and accessories. Valid for online and in-store purchases.', 25.00, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop', NOW()),
('b2c3d4e5-f6a7-4901-bcde-f23456789012', 1002, 98765, 'Free Shipping on Orders $50+', 'Enjoy free shipping on all orders over $50. No minimum purchase required for premium members.', 10.00, 'https://images.unsplash.com/photo-1566041515394-cf7c8fe21800?w=400&h=300&fit=crop', NOW()),
('c3d4e5f6-a7b8-4012-cdef-345678901234', 1003, 98765, '$20 Off Fashion Items', 'Save $20 on fashion and clothing items. Perfect for updating your wardrobe with the latest trends.', 20.00, 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop', NOW()),
('d4e5f6a7-b8c9-4123-defa-456789012345', 1004, 98765, 'Buy 2 Get 1 Free Books', 'Special promotion on all books and educational materials. Perfect for students and avid readers.', 15.00, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', NOW())
ON DUPLICATE KEY UPDATE id=id;

-- Insert sample purchases
INSERT INTO voucher_purchases (id, voucher_id, buyer_id, qr_code, status, created_at, redeemed_at) VALUES
('p1b2c3d4-e5f6-4890-abcd-ef1234567890', 'a1b2c3d4-e5f6-4890-abcd-ef1234567890', 98765, 'QR_a1b2c3d4-e5f6-4890-abcd-ef1234567890', 'active', NOW(), NULL),
('p2c3d4e5-f6a7-4901-bcde-f23456789012', 'b2c3d4e5-f6a7-4901-bcde-f23456789012', 98765, 'QR_b2c3d4e5-f6a7-4901-bcde-f23456789012', 'active', NOW(), NULL),
('p3d4e5f6-a7b8-4012-cdef-345678901234', 'c3d4e5f6-a7b8-4012-cdef-345678901234', 98765, 'QR_c3d4e5f6-a7b8-4012-cdef-345678901234', 'redeemed', NOW(), DATE_SUB(NOW(), INTERVAL 2 DAY)),
('p4e5f6a7-b8c9-4123-defa-456789012345', 'd4e5f6a7-b8c9-4123-defa-456789012345', 98765, 'QR_d4e5f6a7-b8c9-4123-defa-456789012345', 'active', NOW(), NULL)
ON DUPLICATE KEY UPDATE id=id; 