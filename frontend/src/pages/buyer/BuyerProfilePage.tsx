import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { localDB, LocalUser } from '../../utils/localDB';

export function BuyerProfilePage() {
  const [currentUser] = useState<LocalUser | null>(() => localDB.getCurrentUser());
  const [activeTab, setActiveTab] = useState<'dounding' | 'dathang' | 'dinding' | 'danhgia'>('dounding');

  // Khởi tạo an toàn (Pure function) tránh lỗi Impure Call
  const [, setNow] = useState(() => Date.now());
  
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secondsLeft: number, showHours: boolean = true) => {
    if (secondsLeft <= 0) return 'Đã kết thúc';
    const h = Math.floor(secondsLeft / 3600);
    const m = Math.floor((secondsLeft % 3600) / 60);
    const s = secondsLeft % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return showHours ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  };

  const [watchList, setWatchList] = useState([
    { id: 1, title: 'MacBook Pro 14 M3 2023', price: '38.500.000đ', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', secLeft: 2538 },
    { id: 2, title: 'MacBook Pro 16 M3 Max', price: '63.000.000đ', img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800', secLeft: 68651 },
  ]);

  const handleUnwatch = (id: number) => {
    setWatchList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <main id="main">
      <div className="container">
        <nav className="crumbs" aria-label="Chuỗi điều hướng">
          <Link to="/">Trang chủ</Link>
          <span className="sep" aria-hidden="true">/</span>
          <span>Hồ sơ</span>
        </nav>

        {/* ═══ PROFILE HEADER ═══ */}
        <section className="profile-section" aria-label="Hồ sơ thành viên">
          <div className="profile-head">
            <span className="avatar-wrap">
              <span className="avatar-profile" aria-hidden="true">
                {currentUser?.name.charAt(0).toUpperCase() || 'A'}
              </span>
              <button type="button" className="avatar-edit" aria-label="Đổi ảnh đại diện">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </button>
            </span>

            <div className="profile-id">
              <div className="profile-name">
                <h1>{currentUser?.name || 'Nguyễn Văn A'}</h1>
                <span className="verified-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Đã xác minh CCCD
                </span>
              </div>
              <button className="rating-link" onClick={() => setActiveTab('danhgia')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                <span aria-hidden="true">4.8</span>
                <span className="tnum" aria-hidden="true">★</span>
                <span>(23 đánh giá)</span>
              </button>
              <ul className="profile-facts">
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-10 5L2 7" />
                  </svg>
                  {currentUser?.email || 'nguyen.a@email.com'}
                  <span className="verify-tag">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Đã xác minh
                  </span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  Thành viên từ Tháng 3, 2026
                </li>
              </ul>
            </div>

            <div className="profile-actions">
              <button className="btn btn-ghost" type="button">Chỉnh sửa hồ sơ</button>
            </div>
          </div>
        </section>

        {/* ═══ TABS ═══ */}
        <div className="tabs" role="tablist" aria-label="Nội dung hồ sơ">
          <button type="button" role="tab" aria-selected={activeTab === 'dounding'} onClick={() => setActiveTab('dounding')}>Đang đấu giá<span className="tcount">2</span></button>
          <button type="button" role="tab" aria-selected={activeTab === 'dathang'} onClick={() => setActiveTab('dathang')}>Đã thắng<span className="tcount">2</span></button>
          <button type="button" role="tab" aria-selected={activeTab === 'dinding'} onClick={() => setActiveTab('dinding')}>Đang theo dõi<span className="tcount">{watchList.length}</span></button>
          <button type="button" role="tab" aria-selected={activeTab === 'danhgia'} onClick={() => setActiveTab('danhgia')}>Đánh giá<span className="tcount">3</span></button>
        </div>

        {/* ═══ PANEL: ĐANG ĐẤU GIÁ ═══ */}
        {activeTab === 'dounding' && (
          <section className="tab-panel">
            <p className="tab-note">4 phiên đang nhận giá. Bấm vào tên sản phẩm để xem chi tiết.</p>
            <div className="tbl-scroll">
              <table className="tbl">
                <thead>
                  <tr>
                    <th scope="col">Sản phẩm</th>
                    <th scope="col">Giá hiện tại</th>
                    <th scope="col">Bid của tôi</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col">Kết thúc</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="prod">
                        <span className="thumb"><img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200" alt="MacBook Pro" loading="lazy" /></span>
                        <span className="pmeta">
                          <Link className="pname" to="/auction/1">MacBook Pro 14 M3 2023</Link>
                          <span className="pid">#AU-1042</span>
                        </span>
                      </div>
                    </td>
                    <td className="price-cell">36.500.000đ</td>
                    <td className="bid-cell">36.500.000đ</td>
                    <td><span className="status st-lead"><span className="dot"></span>Đang dẫn đầu</span></td>
                    <td><span className="countdown">{formatTime(9252)}</span></td>
                  </tr>
                  <tr className="row-over">
                    <td>
                      <div className="prod">
                        <span className="thumb"><img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200" alt="iPhone" loading="lazy" /></span>
                        <span className="pmeta">
                          <Link className="pname" to="/auction/2">iPhone 15 Pro Max</Link>
                          <span className="pid">#AU-1058</span>
                        </span>
                      </div>
                    </td>
                    <td className="price-cell">24.800.000đ</td>
                    <td className="bid-cell">24.500.000đ</td>
                    <td><span className="status st-over"><span className="dot"></span>Bị vượt</span></td>
                    <td><span className="countdown urgent">{formatTime(2538)}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ═══ PANEL: ĐÃ THẮNG ═══ */}
        {activeTab === 'dathang' && (
          <section className="tab-panel">
            <p className="tab-note">12 đơn đã thắng. Hiển thị gần nhất.</p>
            <ol className="won-list">
              <li className="won-row">
                <img className="won-thumb" src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200" alt="MacBook" loading="lazy" />
                <span className="won-info">
                  <span className="won-title">MacBook Pro 14 M3 2023</span>
                  <span className="won-meta">Mã đơn #ORD-142 · Thắng 18/09/2026</span>
                </span>
                <span className="won-right">
                  <span className="won-price tnum">36.500.000đ</span>
                  <span className="won-line">
                    <span className="status st-pay"><span className="dot"></span>Chờ thanh toán</span>
                    <span className="pay-note">
                      còn <span className="pay-time">{formatTime(1392, false)}</span>
                    </span>
                    <button type="button" className="link-btn">Thanh toán</button>
                  </span>
                </span>
              </li>
            </ol>
          </section>
        )}

        {/* ═══ PANEL: ĐANG THEO DÕI ═══ */}
        {activeTab === 'dinding' && (
          <section className="tab-panel">
            <p className="tab-note">{watchList.length} phiên bạn đang theo dõi.</p>
            <div className="sale-grid">
              {watchList.map(item => (
                <article key={item.id} className="sale-card watch-card">
                  <button type="button" className="watch-heart" aria-pressed="true" onClick={() => handleUnwatch(item.id)}>
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="16" height="16">
                      <path d="M12 21s-6.7-4.35-9.33-8.11C.9 10.6 1.72 7.34 4.4 6.2c1.74-.74 3.72-.1 4.95 1.5L12 10.4l2.65-2.7c1.23-1.6 3.21-2.24 4.95-1.5 2.7 1.14 3.53 4.4 1.73 6.69C18.7 16.65 12 21 12 21Z" />
                    </svg>
                  </button>
                  <Link className="media zoom-media" to={`/auction/${item.id}`}>
                    <img src={item.img} alt={item.title} loading="lazy" />
                  </Link>
                  <div className="sale-body">
                    <h3 className="card-title"><Link to={`/auction/${item.id}`}>{item.title}</Link></h3>
                    <div className="sale-price-row">
                      <span className="price-grid">
                        <span className="price-label">Giá hiện tại</span>
                        <span className="sale-price tnum">{item.price}</span>
                      </span>
                      <span className="countdown-wrap">
                        <span className="countdown-time">{formatTime(item.secLeft)}</span>
                        <span className="price-label">Kết thúc sau</span>
                      </span>
                    </div>
                    <Link to={`/auction/${item.id}`} className="btn btn-primary" style={{ width: '100%' }}>Đặt giá</Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ═══ PANEL: ĐÁNH GIÁ ═══ */}
        {activeTab === 'danhgia' && (
          <section className="tab-panel">
            <p className="tab-note">23 đánh giá từ các phiên đã thắng.</p>
            <div className="review-list">
              <article className="review-card">
                <div className="review-head">
                  <span className="review-avatar" aria-hidden="true">TS</span>
                  <span className="review-by">
                    <span className="review-name">TechStore VN</span>
                    <span className="review-meta">15/09/2026 · Phiên “MacBook Pro 14 M3 2023”</span>
                  </span>
                  <span className="review-stars" aria-label="5 trên 5 sao">
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