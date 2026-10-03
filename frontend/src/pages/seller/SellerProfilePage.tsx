import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ── MOCK DATA ĐỂ QUẢN LÝ DANH SÁCH ──
const ACTIVE_AUCTIONS = [
  { id: 1, title: 'MacBook Pro 14 M3 2023', price: 38500000, timeLeft: 48200, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80' },
  { id: 2, title: 'iPhone 15 Pro Max 256GB', price: 27900000, timeLeft: 130500, img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80' },
  { id: 3, title: 'iPad Pro 11 M2 128GB', price: 19800000, timeLeft: 70200, img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80' },
  { id: 4, title: 'MacBook Pro 16 M3 Max', price: 59900000, timeLeft: 9600, img: 'https://images.unsplash.com/photo-1537498425277-c283d32ef9db?w=1600&q=80' },
  { id: 5, title: 'AirPods Max', price: 11500000, timeLeft: 35600, img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80' },
  { id: 6, title: 'MacBook Air 13 M2 2022', price: 23900000, timeLeft: 173000, img: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=1600&q=80' }
];

const REVIEWS = [
  { id: 1, name: 'Nguyễn Văn A', avatar: 'NA', date: '19/09/2026', item: 'MacBook Pro 14 M3', rating: 5, text: '“Máy đúng mô tả, giao nhanh. Đóng gói cẩn thận.”' },
  { id: 2, name: 'Trần Thị B', avatar: 'TB', date: '15/09/2026', item: 'iPhone 15 Pro Max', rating: 4, text: '“Máy ổn, pin 96% không phải 98% như mô tả. Vẫn chấp nhận được.”' },
  { id: 3, name: 'Lê Văn C', avatar: 'LC', date: '12/09/2026', item: 'iPad Pro 11 M2', rating: 5, text: '“Hàng đặt sáng nay trưa đã có, kiểm tra máy kỹ tại chỗ trước khi giao. 5 sao.”' },
  { id: 4, name: 'Phạm Minh D', avatar: 'PM', date: '08/09/2026', item: 'MacBook Pro 16 M3 Max', rating: 3, text: '“Máy chất lượng nhưng ship lâu hơn hẹn 2 ngày. Nhắn tin shop trả lời hơi muộn.”' },
  { id: 5, name: 'Hoàng Thu E', avatar: 'HT', date: '05/09/2026', item: 'AirPods Max', rating: 2, text: '“Được giao đúng hàng nhưng tem bảo hành không ghi ngày, chỉ tự dán. Chưa hài lòng lắm.”' },
];

export function SellerProfilePage() {
  const [activeTab, setActiveTab] = useState<'ongiong' | 'daban' | 'danhgia' | 'gioithieu'>('ongiong');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followCount, setFollowCount] = useState(2341);
  const [reviewFilter, setReviewFilter] = useState<'all' | '5' | '4' | '3' | 'low'>('all');

  // Đếm ngược cho tab Đang bán
  const [timers, setTimers] = useState<{ id: number, timeLeft: number }[]>(
    ACTIVE_AUCTIONS.map(item => ({ id: item.id, timeLeft: item.timeLeft }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => prev.map(t => ({ ...t, timeLeft: t.timeLeft > 0 ? t.timeLeft - 1 : 0 })));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatVND = (n: number) => n.toLocaleString("vi-VN").replace(/[.,](\d{3})/g, (m, g) => "." + g) + "đ";
  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "Đã kết thúc";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const pad = (v: number) => (v < 10 ? "0" : "") + v;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    setFollowCount(prev => isFollowing ? prev - 1 : prev + 1);
  };

  const filteredReviews = REVIEWS.filter(r => {
    if (reviewFilter === 'all') return true;
    if (reviewFilter === 'low') return r.rating < 3;
    return r.rating === parseInt(reviewFilter);
  });

  return (
    <main id="main">
      <div className="container">
        <nav className="crumbs" aria-label="Chuỗi điều hướng">
          <Link to="/">Trang chủ</Link>
          <span className="sep" aria-hidden="true">/</span>
          <span>Người bán</span>
          <span className="sep" aria-hidden="true">/</span>
          <span style={{ color: 'var(--fg)' }}>TechStore VN</span>
        </nav>

        {/* ═══ PROFILE HEADER ═══ */}
        <section className="profile-section" aria-label="Hồ sơ người bán TechStore VN">
          <div className="profile-head">
            <span className="avatar-profile" aria-hidden="true">TS</span>

            <div className="profile-id">
              <div className="profile-name">
                <h1>TechStore VN</h1>
                <span className="verified-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  Verified
                </span>
              </div>
              <button 
                className="rating-link" 
                onClick={() => setActiveTab('danhgia')}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                aria-label="Xem đánh giá của TechStore VN"
              >
                <span aria-hidden="true">4.8</span>
                <span className="tnum" aria-hidden="true">★</span>
                <span>(1.240 đánh giá)</span>
              </button>
              <ul className="profile-facts">
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                  Quận 1, TP.HCM
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                  Thành viên từ Tháng 3, 2022
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6a8.5 8.5 0 1 1 16.1-3.9Z" /></svg>
                  Phản hồi trong 15 phút
                </li>
              </ul>
            </div>

            <div className="profile-actions">
              <button className="btn btn-ghost" id="btn-message" aria-label="Nhắn tin cho TechStore VN">Nhắn tin</button>
              <button 
                className="btn btn-primary" 
                type="button" 
                id="btn-follow" 
                aria-pressed={isFollowing}
                onClick={handleFollowToggle}
              >
                {isFollowing ? 'Đang theo dõi ' : 'Theo dõi '}
                <span className="follow-count" id="follow-count">{followCount.toLocaleString('vi-VN')}</span>
              </button>
            </div>
          </div>
        </section>

        {/* ═══ TABS ═══ */}
        <div className="tabs" role="tablist" aria-label="Nội dung hồ sơ người bán">
          <button type="button" role="tab" aria-selected={activeTab === 'ongiong'} onClick={() => setActiveTab('ongiong')}>Đang bán<span className="tcount">12</span></button>
          <button type="button" role="tab" aria-selected={activeTab === 'daban'} onClick={() => setActiveTab('daban')}>Đã bán<span className="tcount">318</span></button>
          <button type="button" role="tab" aria-selected={activeTab === 'danhgia'} onClick={() => setActiveTab('danhgia')}>Đánh giá<span className="tcount">1.240</span></button>
          <button type="button" role="tab" aria-selected={activeTab === 'gioithieu'} onClick={() => setActiveTab('gioithieu')}>Giới thiệu</button>
        </div>

        {/* ═══ PANEL: ĐANG BÁN ═══ */}
        {activeTab === 'ongiong' && (
          <section className="tab-panel" id="panel-ongiong" role="tabpanel">
            <p className="tab-note">Hiển thị 12 phiên đang nhận giá trên 3.417 lượt xem.</p>
            <div className="sale-grid">
              {ACTIVE_AUCTIONS.map((item) => {
                const currentTimer = timers.find(t => t.id === item.id)?.timeLeft || 0;
                return (
                  <article className="sale-card" key={item.id}>
                    <Link className="media" to={`/auction/${item.id}`}>
                      <img src={item.img} alt={item.title} width="800" height="800" loading="lazy" />
                    </Link>
                    <div className="sale-body">
                      <h3 className="card-title"><Link to={`/auction/${item.id}`}>{item.title}</Link></h3>
                      <div className="sale-price-row">
                        <span className="price-grid">
                          <span className="price-label">Giá hiện tại</span>
                          <span className="sale-price tnum">{formatVND(item.price)}</span>
                        </span>
                        <span className="countdown-wrap">
                          <span className="price-label">Kết thúc sau</span>
                          <span className="countdown-time">{formatTime(currentTimer)}</span>
                        </span>
                      </div>
                      <Link className="btn btn-primary" to={`/auction/${item.id}`} style={{ textDecoration: 'none' }}>Đặt giá</Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* ═══ PANEL: ĐÃ BÁN ═══ */}
        {activeTab === 'daban' && (
          <section className="tab-panel" id="panel-daban" role="tabpanel">
            <p className="tab-note">318 phiên đã kết thúc có người thắng. Dưới đây là 10 phiên gần nhất.</p>
            <ol className="sold-list">
              <li className="sold-row">
                <img className="sold-thumb" src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&q=80" alt="MacBook Pro 14 M3 2023" loading="lazy" />
                <span className="sold-info">
                  <span className="sold-title">MacBook Pro 14 M3 2023</span>
                  <span className="sold-meta">Bán 19/09</span>
                </span>
                <span className="sold-winner">Người thắng: Nguyễn V.***</span>
                <span className="sold-price tnum">37.500.000đ</span>
              </li>
              <li className="sold-row">
                <img className="sold-thumb" src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200&q=80" alt="iPhone 15 Pro Max" loading="lazy" />
                <span className="sold-info">
                  <span className="sold-title">iPhone 15 Pro Max</span>
                  <span className="sold-meta">Bán 18/09</span>
                </span>
                <span className="sold-winner">Người thắng: Trần V.***</span>
                <span className="sold-price tnum">24.200.000đ</span>
              </li>
              <li className="sold-row">
                <img className="sold-thumb" src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&q=80" alt="iPad Pro 11 M2" loading="lazy" />
                <span className="sold-info">
                  <span className="sold-title">iPad Pro 11 M2</span>
                  <span className="sold-meta">Bán 16/09</span>
                </span>
                <span className="sold-winner">Người thắng: Lê T.***</span>
                <span className="sold-price tnum">18.900.000đ</span>
              </li>
            </ol>
          </section>
        )}

        {/* ═══ PANEL: ĐÁNH GIÁ ═══ */}
        {activeTab === 'danhgia' && (
          <section className="tab-panel" id="panel-danhgia" role="tabpanel">
            <div className="chips" role="group" aria-label="Lọc đánh giá theo số sao">
              <button type="button" onClick={() => setReviewFilter('all')} aria-pressed={reviewFilter === 'all'}>Tất cả</button>
              <button type="button" onClick={() => setReviewFilter('5')} aria-pressed={reviewFilter === '5'}>5★</button>
              <button type="button" onClick={() => setReviewFilter('4')} aria-pressed={reviewFilter === '4'}>4★</button>
              <button type="button" onClick={() => setReviewFilter('3')} aria-pressed={reviewFilter === '3'}>3★</button>
              <button type="button" onClick={() => setReviewFilter('low')} aria-pressed={reviewFilter === 'low'}>Thấp hơn</button>
            </div>

            <div className="review-list">
              {filteredReviews.length > 0 ? (
                filteredReviews.map(review => (
                  <article className="review-card" key={review.id}>
                    <div className="review-head">
                      <span className="review-avatar" aria-hidden="true">{review.avatar}</span>
                      <span className="review-by">
                        <span className="review-name">{review.name}</span>
                        <span className="review-meta">{review.date} · Phiên “{review.item}”</span>
                      </span>
                      <span className="review-stars" aria-label={`${review.rating} trên 5 sao`}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </span>
                    </div>
                    <p className="review-text">{review.text}</p>
                  </article>
                ))
              ) : (
                <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '24px 0' }}>Không có đánh giá nào phù hợp với bộ lọc.</p>
              )}
            </div>
          </section>
        )}

        {/* ═══ PANEL: GIỚI THIỆU ═══ */}
        {activeTab === 'gioithieu' && (
          <section className="tab-panel" id="panel-gioithieu" role="tabpanel">
            <div className="about">
              <p className="about-desc">
                Chuyên cung cấp thiết bị Apple cũ Like New tại TP.HCM từ 2022. 300+ đơn thành công, 0 tranh chấp chưa xử lý. Kiểm tra máy trực tiếp tại Quận 1 hoặc ship COD toàn quốc.
              </p>

              <div>
                <h2 className="about-label">Danh mục</h2>
                <div className="about-pills">
                  <span>Laptop</span>
                  <span>Điện thoại</span>
                  <span>Tablet</span>
                </div>
              </div>

              <div className="policy-card">
                <span className="about-label">Chính sách đổi trả</span>
                <span className="policy-value">7 ngày nếu không đúng mô tả</span>
                <span className="policy-note">Đổi trả trong 7 ngày khi sản phẩm khác với mô tả trong phiên đấu giá.</span>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}