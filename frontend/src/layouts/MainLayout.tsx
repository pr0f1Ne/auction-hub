import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { localDB, LocalUser } from '../utils/localDB'; // Đảm bảo đường dẫn import đúng vị trí utils của bạn

export function MainLayout() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<LocalUser | null>(() => localDB.getCurrentUser());

  // Cập nhật thông tin user mỗi khi chuyển trang
 useEffect(() => {
    const user = localDB.getCurrentUser();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentUser(prevUser => {
      // Nếu user không đổi (cùng ID) thì bỏ qua, không render lại
      if (prevUser?.id === user?.id) return prevUser;
      return user;
    });
  }, [pathname]);

  // Xử lý tự động cuộn đến phần tử khi URL có Hash (#)
  useEffect(() => {
    if (hash) {
      // Đợi DOM render xong mới cuộn
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  // Điều hướng đến trang Profile
 const handleGoToProfile = () => {
  if (currentUser?.role === 'seller') {
    navigate('/seller-profile');
  } else {
    navigate('/buyer-profile'); // Bạn có thể tạo sau
  }
};
  // Đăng xuất
  const handleLogout = () => {
    localDB.logout();
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <>
      <div id="scroll-progress" aria-hidden="true"></div>
      <a className="skip-link" href="#main">Bỏ qua điều hướng</a>

      {/* ═══ HEADER ═══ */}
      <header className="site-header">
        <div className="container">
          <Link className="brand" to="/" aria-label="AuctionHub trang chủ">
            AuctionHub<span className="brand-dot">.</span>
          </Link>

          <nav className="nav" aria-label="Điều hướng chính">
            <Link className="nav-link" to="/#features">Tính năng</Link>
            <Link className="nav-link" to="/#how-it-works">Cách hoạt động</Link>
            <Link className="nav-link" to="/#reviews">Đánh giá</Link>
          </nav>

          <div className="nav-actions">
            <button 
              className="nav-toggle" 
              type="button" 
              aria-expanded={isMobileMenuOpen} 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
            >
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div 
                  onClick={handleGoToProfile}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    transition: 'background 0.2s'
                  }}
                  title="Đi đến trang cá nhân"
                >
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: 'var(--accent, #0066ff)', 
                    color: '#fff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 600,
                    fontSize: '14px'
                  }}>
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-main)' }}>
                    {currentUser.name}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--danger, #ff4d4f)', padding: '0 8px' }}
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <>
                <Link className="btn btn-ghost btn-sm" to="/login">Đăng nhập</Link>
                <Link className="btn btn-primary btn-sm" to="/register">Đăng ký</Link>
              </>
            )}
          </div>
        </div>

        {/* Menu Mobile */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`} id="mobile-menu" hidden={!isMobileMenuOpen}>
          <Link className="nav-link" to="/#features" onClick={() => setIsMobileMenuOpen(false)}>Tính năng</Link>
          <Link className="nav-link" to="/#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>Cách hoạt động</Link>
          <Link className="nav-link" to="/#reviews" onClick={() => setIsMobileMenuOpen(false)}>Đánh giá</Link>
          
          {currentUser ? (
            <>
              <Link className="nav-link" to="/buyer-profile" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--accent)' }}>Tài khoản của tôi</Link>
              <button className="nav-link" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} style={{ color: 'var(--danger)', textAlign: 'left', border: 'none', background: 'none', font: 'inherit', padding: 0 }}>Đăng xuất</button>
            </>
          ) : (
            <Link className="nav-link" to="/login" onClick={() => setIsMobileMenuOpen(false)}>Đăng nhập</Link>
          )}
        </div>
      </header>

      {/* ═══ MAIN CONTENT ═══ */}
      <Outlet />

      {/* ═══ FOOTER ═══ */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link className="brand" to="/" aria-label="AuctionHub trang chủ">
                AuctionHub<span className="brand-dot">.</span>
              </Link>
              <p className="footer-blurb">
                Nền tảng đấu giá thiết bị công nghệ cho người Việt, với escrow
                bảo vệ cả người mua lẫn người bán.
              </p>
            </div>
            <nav className="footer-col" aria-label="Sàn đấu giá">
              <h3>Sàn đấu giá</h3>
              <ul>
                <li><Link to="/search">Phiên đang diễn ra</Link></li>
                <li><Link to="/search">Đã kết thúc</Link></li>
              </ul>
            </nav>
            <nav className="footer-col" aria-label="Công ty">
              <h3>Công ty</h3>
              <ul>
                <li><a href="#void">Giới thiệu</a></li>
                <li><a href="#void">Liên hệ</a></li>
              </ul>
            </nav>
          </div>
          <div className="footer-legal">
            <span>© 2026 AuctionHub JSC. Bảo lưu mọi quyền.</span>
          </div>
        </div>
      </footer>
    </>
  );
}