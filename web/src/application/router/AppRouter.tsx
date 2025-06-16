import React from 'react';
import { VoucherListPage } from '../../presentation/pages/voucher/VoucherListPage';
import { ScanQRCodePage } from '../../presentation/pages/qr/ScanQRCodePage';

interface AppRouterProps {
  userId?: string | undefined;
  isAuthenticated?: boolean;
}

export const AppRouter: React.FC<AppRouterProps> = ({ userId, isAuthenticated = false }) => {
  // Simple routing based on URL path
  const currentPath = window.location.pathname;
  
  // Handle different routes
  switch (currentPath) {
    case '/scan-qr':
    case '/scan-qr-code':
      // QR Scanner works with or without authentication
      return <ScanQRCodePage isAuthenticated={isAuthenticated} userId={userId} />;
    
    case '/':
    case '/vouchers':
    default:
      // Voucher list requires authentication
      if (!isAuthenticated || !userId) {
        // Redirect to QR scanner if no auth and trying to access vouchers
        window.location.pathname = '/scan-qr';
        return <div>Redirecting...</div>;
      }
      return <VoucherListPage userId={userId} />;
  }
}; 