import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { localDB } from '../../utils/localDB';

type SellerTab = 'dangban' | 'daban' | 'danhgia' | 'gioithieu';

const SELLER_ACTIVE_AUCTIONS = [
  { id: 'macbook-pro-m5-pro', code: 'AU-1042', title: 'MacBook Pro 14 inch M5 Pro 2026', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900', price: '48.600.000đ', specs: ['M5 Pro · 48GB', 'SSD 2TB', 'Like New 98%'], seller: 'TechStore VN' },
  { id: 'galaxy-s26-ultra', code: 'AU-1058', title: 'Samsung Galaxy S26 Ultra 512GB', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900', price: '32.700.000đ', specs: ['Tím Cobalt', '512GB', 'Mới nguyên seal'], seller: 'TechStore VN' },
  { id: 'nike-air-max-dn8', code: 'AU-1115', title: 'Nike Air Max Dn8 Black / Hyper Crimson', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900', price: '3.350.000đ', specs: ['Size EU 42.5', 'Mới nguyên hộp', 'Dynamic Air'], seller: 'TechStore VN' },
  { id: 'zara-linen-blazer', code: 'AU-1118', title: 'Zara Linen Blend Blazer Beige', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900', price: '820.000đ', specs: ['Size M', 'Linen blend', 'Like New 98%'], seller: 'TechStore VN' },
  { id: 'laneige-lip-mask-set', code: 'AU-1122', title: 'Laneige Lip Sleeping Mask Berry Set', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900', price: '510.000đ', specs: ['Set 3 hũ 8g', 'Mới nguyên seal', 'HSD 2028'], seller: 'TechStore VN' },
  { id: 'adjustable-dumbbell-set', code: 'AU-1126', title: 'Adjustable Dumbbell Set 20kg', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900', price: '1.460.000đ', specs: ['Tổng 20kg', 'Tạ điều chỉnh', 'Like New 95%'], seller: 'TechStore VN' },
];

const SELLER_SOLD_AUCTIONS = Array.from({ length: 318 }, (_, index) => {
  const products = [
    { title: 'MacBook Pro 14 M4 Pro 2025', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100', price: '42.100.000đ' },
    { title: 'iPhone 16 Pro Max 256GB', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100', price: '28.200.000đ' },
    { title: 'Canon EOS R50 V Kit 14-30mm', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100', price: '20.900.000đ' },
    { title: 'Samsung Galaxy S26 Ultra 512GB', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100', price: '31.500.000đ' },
    { title: 'Nike Air Max Dn8 Black / Hyper Crimson', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100', price: '3.100.000đ' },
    { title: 'Laneige Lip Sleeping Mask Berry Set', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100', price: '490.000đ' },
    { title: 'Nike Dri-FIT Training Set Navy', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=100', price: '1.020.000đ' },
    { title: 'Adjustable Dumbbell Set 20kg', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=100', price: '1.400.000đ' },
  ];
  return { ...products[index % products.length], id: index + 1, winner: ['Nguyễn V.***', 'Trần V.***', 'Lê N.***'][index % 3], date: `${String(19 - (index % 19)).padStart(2, '0')}/09` };
});

const SELLER_REVIEWS = Array.from({ length: 1240 }, (_, index) => {
  const rating = index % 8 === 7 ? 4 : 5;
  return { id: index + 1, rating, name: ['Nguyễn Văn A', 'Trần Minh K.', 'Hoàng Anh', 'Bảo Ngọc'][index % 4], initials: ['NA', 'TK', 'HA', 'BN'][index % 4], date: `${String(19 - (index % 19)).padStart(2, '0')}/09/2026`, product: ['MacBook Pro 14 M3', 'iPhone 15 Pro Max', 'iPad Pro M4'][index % 3], text: ['Máy đúng mô tả, giao nhanh. Đóng gói cẩn thận.', 'Tư vấn rất kỹ, sản phẩm đẹp như cam kết.', 'Giao dịch nhanh gọn, sẽ tiếp tục ủng hộ.'][index % 3] };
});

export default function SellerProfilePublicPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<SellerTab>('dangban');
  const [isFollowing, setIsFollowing] = useState(false);
  const [soldVisible, setSoldVisible] = useState(10);
  const [reviewsVisible, setReviewsVisible] = useState(10);
  const [reviewFilter, setReviewFilter] = useState<'all' | 5 | 4>('all');
  const [watchIds, setWatchIds] = useState<string[]>(() => localDB.getWatchlist());
  const visibleReviews = SELLER_REVIEWS.filter((review) => reviewFilter === 'all' || review.rating === reviewFilter).slice(0, reviewsVisible);
  const toggleWatch = (auctionId: string) => { localDB.toggleWatch(auctionId); setWatchIds(localDB.getWatchlist()); };

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
                <span>4.8</span><span className="tnum">★</span><span>({SELLER_REVIEWS.length.toLocaleString('vi-VN')} đánh giá)</span>
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
          <button role="tab" aria-selected={activeTab === 'dangban'} onClick={() => setActiveTab('dangban')}>Đang bán<span className="tcount">{SELLER_ACTIVE_AUCTIONS.length}</span></button>
          <button role="tab" aria-selected={activeTab === 'daban'} onClick={() => setActiveTab('daban')}>Đã bán<span className="tcount">{SELLER_SOLD_AUCTIONS.length}</span></button>
          <button role="tab" aria-selected={activeTab === 'danhgia'} onClick={() => setActiveTab('danhgia')}>Đánh giá<span className="tcount">{SELLER_REVIEWS.length.toLocaleString('vi-VN')}</span></button>
          <button role="tab" aria-selected={activeTab === 'gioithieu'} onClick={() => setActiveTab('gioithieu')}>Giới thiệu</button>
        </div>

        {activeTab === 'dangban' && (
          <section className="tab-panel">
            <p className="tab-note">Hiển thị các phiên đang nhận giá.</p>
            <div className="profile-product-grid">{SELLER_ACTIVE_AUCTIONS.map((auction) => <article className="profile-product-card" key={auction.id}>
                <button type="button" className="watch-heart" aria-pressed={watchIds.includes(auction.id)} aria-label={watchIds.includes(auction.id) ? `Bỏ theo dõi ${auction.title}` : `Thêm ${auction.title} vào theo dõi`} onClick={() => toggleWatch(auction.id)}><svg className="ic-heart" viewBox="0 0 24 24" fill={watchIds.includes(auction.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" /></svg><svg className="ic-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
                <Link className="profile-product-media" to={`/auctions/${auction.id}`}>
                  <img src={auction.image} alt={auction.title} />
                </Link>
                <div className="profile-product-body">
                  <Link className="profile-product-title" to={`/auctions/${auction.id}`}>{auction.title}</Link>
                  <p className="profile-product-code">#{auction.code} · {auction.seller}</p>
                  <div className="profile-product-specs">{auction.specs.map((spec) => <span key={spec}>{spec}</span>)}</div>
                  <div className="profile-product-price"><span>Giá hiện tại</span><strong>{auction.price}</strong></div>
                  <Link to={`/auctions/${auction.id}`} className="btn btn-primary">Đặt giá</Link>
                </div>
              </article>)}</div>
          </section>
        )}

        {activeTab === 'daban' && (
          <section className="tab-panel">
            <p className="tab-note">{SELLER_SOLD_AUCTIONS.length} phiên đã kết thúc có người thắng. Hiển thị {Math.min(soldVisible, SELLER_SOLD_AUCTIONS.length)} phiên gần nhất.</p>
            <div className="profile-product-grid">{SELLER_SOLD_AUCTIONS.slice(0, soldVisible).map((auction) => <article className="profile-product-card profile-product-card--sold" key={auction.id}><div className="profile-product-media"><img src={auction.image} alt={auction.title} /><span className="profile-product-badge">Đã bán</span></div><div className="profile-product-body"><span className="profile-product-title">{auction.title}</span><p className="profile-product-code">Bán {auction.date} · {auction.winner}</p><div className="profile-product-specs"><span>Đã giao dịch</span><span>Người mua xác thực</span></div><div className="profile-product-price"><span>Giá chốt</span><strong>{auction.price}</strong></div></div></article>)}</div>
            {soldVisible < SELLER_SOLD_AUCTIONS.length && <div className="load-more"><button className="btn btn-ghost" type="button" onClick={() => setSoldVisible((count) => Math.min(count + 10, SELLER_SOLD_AUCTIONS.length))}>Xem thêm</button></div>}
          </section>
        )}

        {activeTab === 'danhgia' && (
          <section className="tab-panel">
            <div className="chips">
              <button type="button" aria-pressed={reviewFilter === 'all'} onClick={() => { setReviewFilter('all'); setReviewsVisible(10); }}>Tất cả</button><button type="button" aria-pressed={reviewFilter === 5} onClick={() => { setReviewFilter(5); setReviewsVisible(10); }}>5★</button><button type="button" aria-pressed={reviewFilter === 4} onClick={() => { setReviewFilter(4); setReviewsVisible(10); }}>4★</button>
            </div>
            <div className="review-list">{visibleReviews.map((review) => <article className="review-card" key={review.id}><div className="review-head"><span className="review-avatar">{review.initials}</span><span className="review-by"><span className="review-name">{review.name}</span><span className="review-meta">{review.date} · Phiên “{review.product}”</span></span><span className="review-stars">{Array.from({ length: 5 }, (_, index) => <span key={index} className={index < review.rating ? 'r5' : ''}>★</span>)}</span></div><p className="review-text">“{review.text}”</p></article>)}</div>
            {reviewsVisible < SELLER_REVIEWS.filter((review) => reviewFilter === 'all' || review.rating === reviewFilter).length && <div className="load-more"><button className="btn btn-ghost" type="button" onClick={() => setReviewsVisible((count) => count + 10)}>Xem thêm</button></div>}
          </section>
        )}

        {activeTab === 'gioithieu' && (
          <section className="tab-panel">
            <div className="about">
              <p className="about-desc">Cửa hàng tổng hợp sản phẩm công nghệ, thời trang, mỹ phẩm và dụng cụ tập luyện tại TP.HCM. 300+ đơn thành công, 0 tranh chấp chưa xử lý. Kiểm tra trực tiếp tại Quận 1 hoặc ship COD toàn quốc.</p>
              <div>
                <strong className="about-label">Danh mục</strong>
                <div className="about-pills"><span>Công nghệ</span><span>Thời trang</span><span>Mỹ phẩm</span><span>Đồ tập gym</span></div>
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
