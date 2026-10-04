import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { localDB } from '../utils/localDB';

export function DashboardLayout() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  const currentUser = localDB.getCurrentUser();
  const displayName = isAdmin ? 'Quản trị viên' : (currentUser?.name || 'TechStore VN');
  const initials = displayName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="app">
      {/* ─── Sidebar ─── */}
      <aside className="sidebar" aria-label={isAdmin ? 'Điều hướng quản trị' : 'Điều hướng người bán'}>
        <Link className="side-brand" to="/">
          <span className="mark" aria-hidden="true">A</span>
          AuctionHub
        </Link>

        <nav className="side-nav" aria-label="Menu chính">
          {isAdmin ? (
            <>
              <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
                Trung tâm duyệt
              </NavLink>
              <Link to="/search">
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
                Xem sàn đấu giá
              </Link>
            </>
          ) : <>
          <NavLink to="/seller/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
            Tổng quan
          </NavLink>
          
          <NavLink to="/seller/auctions">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 8H4.5a1.5 1.5 0 0 0-1.1 2.55L12 19l5-5-9-6Z" />
              <path d="m12 19 2.9 2.9a1.5 1.5 0 0 0 2.12 0l1.4-1.4a1.5 1.5 0 0 0 0-2.12L15 15" />
              <path d="M14.5 5.5c-1.5 1-2.5 2.5-2.5 4s1 3.5 2 4.5c2 2 5 1 5 1s1.5-3 0-5c-.9-.9-2-1.5-3-2" />
            </svg>
            Phiên đấu giá
            <span className="count">8</span>
          </NavLink>
          
          <NavLink to="/seller/orders">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 8h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8Z" />
              <path d="M3 8V6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2" />
              <path d="M10 12h4" />
            </svg>
            Đơn hàng
            <span className="count" id="nav-order-count">2</span>
          </NavLink>
          <Link to="/seller-profile">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
            Hồ sơ cửa hàng
          </Link>
          </>}
        </nav>

        <div className="side-user">
          <span className="avatar" aria-hidden="true">{initials}</span>
          <div className="usermeta">
            <b>{displayName}</b>
            <span className="badge">{isAdmin ? 'Admin' : 'Seller'}</span>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="main">
        {/* Nội dung từ DashboardPage, OrdersPage... sẽ được chèn vào đây */}
        <Outlet />
      </main>
    </div>
  );
}
