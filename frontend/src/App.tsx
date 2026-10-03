import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Auth
import { MainLayout } from './layouts/MainLayout';
import { AuthPage } from './pages/auth/AuthPage';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { SearchPage } from './pages/public/SearchPage';

// Buyer Pages
import { AuctionDetailPage } from './pages/buyer/AuctionDetail/AuctionDetailPage';
import { BuyerProfilePage } from './pages/buyer/BuyerProfilePage';

// Seller Pages
import { SellerProfilePage } from './pages/seller/SellerProfilePage';

export function App() {
  return (
    <Router>
      <Routes>
        {/* Màn hình Đăng nhập / Đăng ký (Đứng độc lập không có Header) */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        
        {/* Nhóm các màn hình sử dụng Layout chính (Có Header điều hướng thông minh) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="auction/:id" element={<AuctionDetailPage />} />
          
          <Route path="buyer-profile" element={<BuyerProfilePage />} />
          <Route path="seller-profile" element={<SellerProfilePage />} />
        </Route>

        {/* Tự động bắt lỗi URL và đẩy về Trang chủ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}