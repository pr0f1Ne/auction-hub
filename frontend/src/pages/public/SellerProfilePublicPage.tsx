import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

type SellerTab = 'dangban' | 'daban' | 'danhgia' | 'gioithieu';

export default function SellerProfilePublicPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<SellerTab>('dangban');
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <main id="main">
      <div className="container">
        <nav className="crumbs" aria-label="Chuỗi điều hướng">
          <Link to="/">Trang chủ</Link><span className="sep">/</span>
          <span>Người bán</span><span className="sep">/</span>
          <span>TechStore VN (ID: {id || '123'})</span>
        </nav>

        <section className="profile-section">
          <div className="profile-head">
            <span className="avatar-wrap">
              <span className="avatar-profile">TS</span>
            </span>

            <div className="profile-id">
              <div className="profile-name">
                <h1>TechStore VN</h1>
                <span className="verified-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><path d="M20 6 9 17l-5-5" /></svg>
                  Verified
                </span>
              </div>
              <button className="rating-link" onClick={() => setActiveTab('danhgia')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <span>4.8</span><span className="tnum">★</span><span>(1.240 đánh giá)</span>
              </button>
              <ul className="profile-facts">
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                  Quận 1, TP.HCM
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                  Thành viên từ Tháng 3, 2022
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6a8.5 8.5 0 1 1 16.1-3.9Z" /></svg>
                  Phản hồi trong 15 phút
                </li>
              </ul>
            </div>

            <div className="profile-actions">
              <button className="btn btn-ghost" type="button" onClick={() => alert('Đang mở khung chat')}>Nhắn tin</button>
              <button className={isFollowing ? "btn btn-ghost" : "btn btn-primary"} type="button" onClick={() => setIsFollowing(!isFollowing)}>
                {isFollowing ? 'Đang theo dõi ' : 'Theo dõi '}
                <span className="tnum" style={{ marginLeft: 6 }}>{isFollowing ? '2.342' : '2.341'}</span>
              </button>
            </div>
          </div>
        </section>

        <div className="tabs" role="tablist">
          <button role="tab" aria-selected={activeTab === 'dangban'} onClick={() => setActiveTab('dangban')}>Đang bán<span className="tcount">1</span></button>
          <button role="tab" aria-selected={activeTab === 'daban'} onClick={() => setActiveTab('daban')}>Đã bán<span className="tcount">318</span></button>
          <button role="tab" aria-selected={activeTab === 'danhgia'} onClick={() => setActiveTab('danhgia')}>Đánh giá<span className="tcount">1.240</span></button>
          <button role="tab" aria-selected={activeTab === 'gioithieu'} onClick={() => setActiveTab('gioithieu')}>Giới thiệu</button>
        </div>

        {activeTab === 'dangban' && (
          <section className="tab-panel">
            <p className="tab-note">Hiển thị các phiên đang nhận giá.</p>
            <div className="sale-grid">
              <article className="sale-card">
                <Link className="media" to="/auctions/123">
                  <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800" alt="MacBook Pro" />
                </Link>
                <div className="sale-body">
                  <h3 className="card-title"><Link to="/auctions/123">MacBook Pro 14 M3 2023</Link></h3>
                  <div className="sale-price-row">
                    <span className="price-grid">
                      <span className="price-label">Giá hiện tại</span>
                      <span className="sale-price tnum">38.500.000đ</span>
                    </span>
                  </div>
                  <Link to="/auctions/123" className="btn btn-primary">Đặt giá</Link>
                </div>
              </article>
            </div>
          </section>
        )}

        {activeTab === 'daban' && (
          <section className="tab-panel">
            <p className="tab-note">318 phiên đã kết thúc có người thắng. Dưới đây là 2 phiên gần nhất.</p>
            <ul className="won-list">
              <li className="won-row">
                <img className="won-thumb" src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100" alt="" />
                <span className="won-info">
                  <span className="won-title">MacBook Pro 14 M3 2023</span><span className="won-meta">Bán 19/09</span>
                </span>
                <span className="won-right" style={{ textAlign: 'right' }}>
                  <span className="won-meta">Người thắng: Nguyễn V.***</span>
                  <span className="won-price tnum">37.500.000đ</span>
                </span>
              </li>
              <li className="won-row">
                <img className="won-thumb" src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100" alt="" />
                <span className="won-info">
                  <span className="won-title">iPhone 15 Pro Max</span><span className="won-meta">Bán 18/09</span>
                </span>
                <span className="won-right" style={{ textAlign: 'right' }}>
                  <span className="won-meta">Người thắng: Trần V.***</span>
                  <span className="won-price tnum">24.200.000đ</span>
                </span>
              </li>
            </ul>
          </section>
        )}

        {activeTab === 'danhgia' && (
          <section className="tab-panel">
            <div className="chips">
              <button aria-pressed="true">Tất cả</button><button>5★</button><button>4★</button>
            </div>
            <div className="review-list">
              <article className="review-card">
                <div className="review-head">
                  <span className="review-avatar">NA</span>
                  <span className="review-by">
                    <span className="review-name">Nguyễn Văn A</span><span className="review-meta">19/09/2026 · Phiên “MacBook Pro 14 M3”</span>
                  </span>
                  <span className="review-stars"><span className="r5">★</span><span className="r5">★</span><span className="r5">★</span><span className="r5">★</span><span className="r5">★</span></span>
                </div>
                <p className="review-text">“Máy đúng mô tả, giao nhanh. Đóng gói cẩn thận.”</p>
              </article>
            </div>
          </section>
        )}

        {activeTab === 'gioithieu' && (
          <section className="tab-panel">
            <div className="about">
              <p className="about-desc">Chuyên cung cấp thiết bị Apple cũ Like New tại TP.HCM từ 2022. 300+ đơn thành công, 0 tranh chấp chưa xử lý. Kiểm tra máy trực tiếp tại Quận 1 hoặc ship COD toàn quốc.</p>
              <div>
                <strong className="about-label">Danh mục</strong>
                <div className="about-pills"><span>Laptop</span><span>Điện thoại</span><span>Tablet</span></div>
              </div>
              <div className="policy-card">
                <span className="about-label">Chính sách đổi trả</span>
                <span className="policy-value">7 ngày nếu không đúng mô tả</span>
                <p className="policy-note">Đổi trả trong 7 ngày khi sản phẩm khác với mô tả trong phiên đấu giá.</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}