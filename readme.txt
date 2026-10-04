# CONTEXT DỰ ÁN: AUCTIONHUB - SÀN ĐẤU GIÁ THIẾT BỊ CÔNG NGHỆ

## 1. Tổng quan Dự án (Project Overview)
- **Tên dự án:** AuctionHub
- **Mô tả:** Nền tảng đấu giá thiết bị công nghệ cũ/mới dành cho người Việt, tích hợp cơ chế thanh toán tạm giữ (Escrow) để bảo vệ cả người mua và người bán.
- **Tech Stack:** React 18, TypeScript, React Router DOM v6, Vite.
- **Quản lý State & Database:** Sử dụng file `src/utils/localDB.ts` (Custom Local Storage DB) để lưu trữ session đăng nhập và dữ liệu giả lập (mock data) ở phía client. 
- **Styling:** CSS thuần (Raw CSS) sử dụng CSS Variables và các hàm layout hiện đại (`@layer`, `grid`, `flex`). **TUYỆT ĐỐI KHÔNG** sử dụng Tailwind CSS hay thư viện UI như Material UI/Ant Design.

## 2. Nguyên tắc Lập trình (Strict Guidelines)
1. **Fidelity 100%:** Khi được cung cấp file HTML/CSS design, phải chuyển đổi sang React Component giữ nguyên 100% cấu trúc class, thẻ HTML và CSS gốc. Không tự ý thêm inline-styles hay thẻ bọc (wrapper) làm hỏng Design System.
2. **TypeScript Strict Mode:** Định nghĩa đầy đủ `interface` và `type`. Không sử dụng `any`.
3. **Tránh Cascading Render:** Cẩn thận khi sử dụng `useEffect`. Bất kỳ state `loading` nào cũng phải được kích hoạt từ Event Handler (như `onClick`, `onSubmit`), chỉ dùng `useEffect` để tắt loading khi Component mount.
4. **Kiến trúc Layout:** Các trang chính phải được bọc trong `<MainLayout />` (chứa Header và Footer). Các trang đặc thù như Đăng nhập/Đăng ký (`AuthPage`) thì đứng độc lập.

## 3. Cấu trúc Thư mục (Project Structure)
Dự án được tổ chức theo cấu trúc sau:
/src
 ├── /assets           # Chứa hình ảnh, file CSS toàn cục (index.css)
 ├── /components       # Component dùng chung (nếu có)
 ├── /layouts
 │    └── MainLayout.tsx        # Layout bọc Header, Footer tự nhận diện Role User
 ├── /pages
 │    ├── /public
 │    │    ├── HomePage.tsx     # Trang chủ (Hero, Phiên đang live, Lịch sử)
 │    │    └── SearchPage.tsx   # Trang tìm kiếm & Lọc (gồm 4 trạng thái UI)
 │    ├── /auth
 │    │    └── AuthPage.tsx     # Trang Đăng nhập / Đăng ký (chia role Buyer/Seller)
 │    ├── /buyer
 │    │    ├── BuyerProfilePage.tsx  # Dashboard quản lý của người mua
 │    │    └── AuctionDetailPage.tsx # Trang chi tiết 1 phiên đấu giá (đếm ngược, bid)
 │    └── /seller
 │         └── SellerProfilePage.tsx # Dashboard quản lý của người bán
 ├── /utils
 │    └── localDB.ts            # Xử lý Logic Database tạm & Auth
 ├── App.tsx                    # Định tuyến (React Router)
 └── main.tsx
## 4. Các luồng nghiệp vụ (Workflows)
Dự án được chia thành 5 luồng chính. 3 luồng đầu tiên ĐÃ HOÀN THIỆN, 2 luồng cuối CẦN PHÁT TRIỂN TIẾP:

### ✅ Luồng 1: Khám phá & Tương tác (Public Flow)
- **Trang chủ (`HomePage`):** Hiển thị các phiên đấu giá nổi bật, đếm ngược realtime.
- **Tìm kiếm (`SearchPage`):** Tìm kiếm từ khóa, lọc theo danh mục, mức giá, tình trạng. Xử lý tốt các trạng thái Loading, Empty State, Không tìm thấy.
- **Chi tiết (`AuctionDetailPage`):** Xem chi tiết sản phẩm, lịch sử bid, form nhập giá bid.

### ✅ Luồng 2: Xác thực & Phân quyền (Auth Flow)
- **Đăng ký / Đăng nhập (`AuthPage`):** Người dùng có thể chọn vai trò (Role: `buyer` hoặc `seller`) khi đăng ký.
- **Điều hướng Header (`MainLayout`):** Header tự động hiển thị Avatar và dẫn link tới đúng trang Dashboard dựa theo Role của user (`localDB.getCurrentUser`).

### ✅ Luồng 3: Quản lý Hồ sơ (Profile Flow)
- **Người mua (`BuyerProfilePage`):** Quản lý phiên đang theo dõi, đơn hàng đã thắng, chờ thanh toán.
- **Người bán (`SellerProfilePage`):** Quản lý các phiên đang nhận giá, các đơn đã bán, và xem đánh giá từ người mua.

### ⏳ Luồng 4: Thanh toán Escrow 
- **Mục tiêu:** Xử lý khi người mua thắng đấu giá.
- **Trang đích:** `CheckoutPage.tsx` và `PaymentSuccessPage.tsx`
- **Nghiệp vụ:** Điền địa chỉ giao hàng -> Xem hóa đơn (Giá thắng + 7% phí nền tảng) -> Chọn cổng thanh toán giả lập (VNPay/MoMo) -> Chuyển trạng thái đơn sang "Đã thanh toán (Tiền giữ trong Escrow)".

### ⏳ Luồng 5: Đăng bán sản phẩm 
- **Mục tiêu:** Cho phép Người bán tạo phiên đấu giá mới.
- **Trang đích:** `CreateAuctionPage.tsx` (truy cập từ SellerProfile).
- **Nghiệp vụ:** Form nhập liệu: Tên SP, Danh mục, Tình trạng máy, Upload ảnh (UI giả lập), Đặt giá khởi điểm, Bước giá, Thời gian kết thúc -> Lưu vào `localDB` -> Chuyển hướng về SellerProfile hoặc trang Chi tiết.
