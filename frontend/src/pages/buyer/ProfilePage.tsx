import React, { useState } from 'react';
import { Link } from 'react-router-dom';

type ProfileTab = 'dounding' | 'dathang' | 'dinding' | 'danhgia';

export default function BuyerProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('dounding');

  return (
    <main id="main">
      <div className="container">
        <nav className="crumbs" aria-label="Chuỗi điều hướng">
          <Link to="/">Trang chủ</Link>
          <span className="sep" aria-hidden="true">/</span>
          <span>Hồ sơ</span>
        </nav>

        {/* ═══ PROFILE HEADER ═══ */}
        <section className="profile-section" aria-label="Hồ sơ của Nguyễn Văn A">
          <div className="profile-head">
            <span className="avatar-wrap">
              <span className="avatar-profile" aria-hidden="true">NA</span>
              <button type="button" className="avatar-edit" aria-label="Đổi ảnh đại diện">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 14, height: 14 }}>
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </button>
            </span>

            <div className="profile-id">
              <div className="profile-name">
                <h1>Nguyễn Văn A</h1>
                <span className="verified-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 12, height: 12 }}>
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Đã xác minh CCCD
                </span>
              </div>
              <a className="rating-link" href="#danhgia" onClick={() => setActiveTab('danhgia')} aria-label="Xem 23 đánh giá">
                <span aria-hidden="true">4.8</span>
                <span className="tnum" aria-hidden="true">★</span>
                <span>(23 đánh giá)</span>
              </a>
              
              <ul className="profile-facts">
                <li>
                  <svg style={{ width: 15, height: 15, flexShrink: 0, color: 'var(--muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-10 5L2 7" />
                  </svg>
                  <span style={{ whiteSpace: 'nowrap' }}>nguyen.a@email.com</span>
                  <span className="verify-tag">
                    <svg style={{ width: 10, height: 10 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> 
                    Đã xác minh
                  </span>
                </li>
                <li>
                  <svg style={{ width: 15, height: 15, flexShrink: 0, color: 'var(--muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
                  </svg>
                  <span style={{ whiteSpace: 'nowrap' }}>0901 *** 456</span>
                  <span className="verify-tag">
                    <svg style={{ width: 10, height: 10 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> 
                    Đã xác minh
                  </span>
                </li>
                <li>
                  <svg style={{ width: 15, height: 15, flexShrink: 0, color: 'var(--muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  <span style={{ whiteSpace: 'nowrap' }}>Thành viên từ Tháng 3, 2026</span>
                </li>
              </ul>
            </div>

            <div className="profile-actions">
              <button className="btn btn-ghost" type="button">Chỉnh sửa hồ sơ</button>
            </div>
          </div>
        </section>

        {/* ═══ TABS ═══ */}
        <div className="tabs" role="tablist">
          <button type="button" role="tab" aria-selected={activeTab === 'dounding'} onClick={() => setActiveTab('dounding')}>Đang đấu giá<span className="tcount">4</span></button>
          <button type="button" role="tab" aria-selected={activeTab === 'dathang'} onClick={() => setActiveTab('dathang')}>Đã thắng<span className="tcount">12</span></button>
          <button type="button" role="tab" aria-selected={activeTab === 'dinding'} onClick={() => setActiveTab('dinding')}>Đang theo dõi<span className="tcount">8</span></button>
          <button type="button" role="tab" aria-selected={activeTab === 'danhgia'} onClick={() => setActiveTab('danhgia')}>Đánh giá<span className="tcount">23</span></button>
        </div>

        {/* ═══ PANEL: ĐANG ĐẤU GIÁ ═══ */}
        {activeTab === 'dounding' && (
          <section className="tab-panel">
            <p className="tab-note">4 phiên đang nhận giá. Bấm vào tên sản phẩm để xem chi tiết.</p>
            <div className="tbl-scroll">
              <table className="tbl">
                <thead>
                  <tr><th>Sản phẩm</th><th>Giá hiện tại</th><th>Bid của tôi</th><th>Trạng thái</th><th>Kết thúc</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="prod">
                        <span className="thumb"><img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100" alt="" /></span>
                        <span className="pmeta">
                          <Link className="pname" to="/auctions/123">MacBook Pro 14 M3 2023</Link>
                          <span className="pid">#AU-1042</span>
                        </span>
                      </div>
                    </td>
                    <td className="price-cell">36.500.000đ</td>
                    <td className="bid-cell">36.500.000đ</td>
                    <td><span className="status st-lead"><span className="dot"></span>Đang dẫn đầu</span></td>
                    <td><span className="countdown">02:34:12</span></td>
                  </tr>
                  <tr className="row-over">
                    <td>
                      <div className="prod">
                        <span className="thumb"><img src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100" alt="" /></span>
                        <span className="pmeta">
                          <Link className="pname" to="/auctions/124">iPhone 15 Pro Max</Link>
                          <span className="pid">#AU-1058</span>
                        </span>
                      </div>
                    </td>
                    <td className="price-cell">24.800.000đ</td>
                    <td className="bid-cell">24.500.000đ</td>
                    <td><span className="status st-over"><span className="dot"></span>Bị vượt</span></td>
                    <td><span className="countdown urgent">00:42:18</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ═══ PANEL: ĐÃ THẮNG ═══ */}
        {activeTab === 'dathang' && (
          <section className="tab-panel">
            <p className="tab-note">12 đơn đã thắng. Hiển thị 2 gần nhất.</p>
            <ul className="won-list">
              <li className="won-row">
                <img className="won-thumb" src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100" alt="" />
                <span className="won-info">
                  <span className="won-title">MacBook Pro 14 M3 2023</span>
                  <span className="won-meta">Mã đơn #ORD-142 · Thắng 18/09/2026</span>
                </span>
                <span className="won-right">
                  <span className="won-price tnum">36.500.000đ</span>
                  <span className="won-line">
                    <span className="status st-pay"><span className="dot"></span>Chờ thanh toán</span>
                    <Link to="/checkout/ORD-142" className="link-btn">Thanh toán</Link>
                  </span>
                </span>
              </li>
              <li className="won-row">
                <img className="won-thumb" src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100" alt="" />
                <span className="won-info">
                  <span className="won-title">iPhone 14 Pro</span>
                  <span className="won-meta">Mã đơn #ORD-138 · Thắng 15/09/2026</span>
                </span>
                <span className="won-right">
                  <span className="won-price tnum">18.500.000đ</span>
                  <span className="won-line">
                    <span className="pay-note">Đã thanh toán</span>
                    <span className="status st-ship"><span className="dot"></span>Đang giao</span>
                    <Link to="/orders/ORD-138" className="link-btn">Xem đơn</Link>
                  </span>
                </span>
              </li>
            </ul>
          </section>
        )}

        {/* ═══ PANEL: ĐANG THEO DÕI (Grid view) ═══ */}
        {activeTab === 'dinding' && (
          <section className="tab-panel">
            <p className="tab-note">8 phiên bạn đang theo dõi. Bạn sẽ nhận thông báo 30 phút trước khi phiên kết thúc.</p>
            <div className="sale-grid">
              <article className="sale-card">
                <button type="button" className="watch-heart" aria-pressed="true">
                  <svg className="ic-heart" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ width: 16, height: 16 }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" /></svg>
                  <svg className="ic-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{ width: 16, height: 16 }}><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
                <Link className="media-frame" to="/auctions/123" style={{ display: 'block' }}>
                  <img className="media" src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800" alt="" />
                  <span className="ending-badge">Sắp kết thúc</span>
                </Link>
                <div className="sale-body">
                  <h3 className="card-title"><Link to="/auctions/123">MacBook Pro 14 M3 2023</Link></h3>
                  <div className="sale-price-row">
                    <span className="price-grid">
                      <span className="price-label">Giá hiện tại</span>
                      <span className="sale-price tnum">38.500.000đ</span>
                    </span>
                    <span className="countdown-wrap">
                      <span className="countdown-time">13:23:20</span>
                      <span className="price-label">Kết thúc sau</span>
                    </span>
                  </div>
                  <button className="follow-toggle" type="button" aria-pressed="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15, flexShrink: 0, color: 'var(--muted)' }}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                    <span>Thông báo khi sắp kết thúc</span>
                    <span className="switch" aria-hidden="true"></span>
                  </button>
                </div>
              </article>
            </div>
          </section>
        )}

        {/* ═══ PANEL: ĐÁNH GIÁ ═══ */}
        {activeTab === 'danhgia' && (
          <section className="tab-panel">
            <div className="chips" role="group">
              <button type="button" aria-pressed="true">Tất cả</button>
              <button type="button" aria-pressed="false">5★</button>
              <button type="button" aria-pressed="false">4★</button>
            </div>
            <div className="review-list">
              <article className="review-card">
                <div className="review-head">
                  <span className="review-avatar">TS</span>
                  <span className="review-by">
                    <span className="review-name">TechStore VN</span>
                    <span className="review-meta">15/09/2026 · Phiên “MacBook Pro 14 M3 2023”</span>
                  </span>
                  <span className="review-stars">
                    <span className="r5">★</span><span className="r5">★</span><span className="r5">★</span><span className="r5">★</span><span className="r5">★</span>
                  </span>
                </div>
                <p className="review-text">“Người mua uy tín, thanh toán nhanh.”</p>
              </article>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}