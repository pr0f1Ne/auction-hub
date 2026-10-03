import { Routes, Route } from "react-router-dom";

// --- LAYOUTS ---
import { MainLayout } from "@/layouts/MainLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";

// --- PAGES ---
import { HomePage } from "@/pages/public/HomePage";
import { NotFoundPage } from "@/pages/public/NotFoundPage";
import { AuthPage } from "@/pages/auth/AuthPage";
import { SearchPage } from "@/pages/buyer/SearchPage";
import {AuctionDetailPage} from "@/pages/buyer/AuctionDetail/AuctionDetailPage";
import SellerDashboardPage from "@/pages/seller/DashboardPage";
import SellerNewAuctionPage from "@/pages/seller/NewAuctionPage";
import { CheckoutLayout } from "@/layouts/CheckoutLayout";
import CheckoutPage from "@/pages/checkout/CheckoutPage";
import OrderDetailPage from "@/pages/buyer/OrderDetailPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import BuyerProfilePage from '@/pages/buyer/ProfilePage';
import WatchlistPage from '@/pages/buyer/WatchlistPage';
import SellerProfilePublicPage from '@/pages/public/SellerProfilePublicPage'; 
export function AppRoutes() {
  return (
    <Routes>
      {/* 1. AUTH ROUTES */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
      </Route>

      {/* 2. PUBLIC & BUYER ROUTES (Có Header/Footer) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/auctions/:id" element={<AuctionDetailPage />} />
      </Route>
      <Route element={<MainLayout />}>
        {/* ... */}
        {/* Thêm route xem hồ sơ public của Seller */}
        <Route path="/seller/:id" element={<SellerProfilePublicPage />} />
      </Route>

      {/* 3. SELLER ROUTES (Có Sidebar Menu bên trái) */}
      <Route path="/seller" element={<DashboardLayout />}>
        <Route path="dashboard" element={<SellerDashboardPage />} />
        <Route path="auctions/new" element={<SellerNewAuctionPage />} />{" "}
        {/* Dòng này */}
      </Route>

      {/* 4. CHECKOUT ROUTES - Giao diện tối giản để tập trung thanh toán */}
      <Route element={<CheckoutLayout />}>
        <Route path="/checkout/:auctionId" element={<CheckoutPage />} />
      </Route>

      {/* BUYER ROUTES */}
      <Route element={<MainLayout />}>
        {/* ... các route cũ (Home, Search, AuctionDetail) */}
        <Route path="/orders/:id" element={<OrderDetailPage />} />{" "}
        {/* Route mới */}
      </Route>
      <Route element={<MainLayout />}>
        {/* ... các route cũ (Home, Search, AuctionDetail, OrdersDetail) */}
        
        {/* Route mới */}
        <Route path="/profile" element={<BuyerProfilePage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route path="dashboard" element={<AdminDashboardPage />} />
      </Route>

      {/* 5. NOT FOUND (Bắt buộc phải nằm ở dòng cuối cùng) */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
