import { Outlet, Link } from 'react-router-dom';

export function CheckoutLayout() {
  return (
    <>
      <header className="site-header">
        <div className="container">
          <Link className="brand" to="/" aria-label="AuctionHub trang chủ">
            AuctionHub<span className="brand-dot">.</span>
          </Link>
          {/* Header rút gọn, chỉ hiển thị Logo để người dùng tập trung thanh toán */}
        </div>
      </header>

      {/* Main Content (Trang Checkout sẽ nằm ở đây) */}
      <Outlet />

      <footer className="site-footer">
        <div className="container">
          <span>© 2026 AuctionHub JSC. Bảo mật và an toàn.</span>
        </div>
      </footer>
    </>
  );
}