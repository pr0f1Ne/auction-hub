import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MOCK_WATCHLIST = [
  { id: 1, title: 'MacBook Pro 14 M3 2023', price: '38.500.000đ', time: '13:23:20', isEnding: true, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800' },
  { id: 2, title: 'iPhone 15 Pro Max 256GB', price: '27.900.000đ', time: '36:15:00', isEnding: false, img: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800' },
];

export default function WatchlistPage() {
  const [items, setItems] = useState(MOCK_WATCHLIST);

  const handleRemove = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <main className="watch-main" id="main">
      <div className="container">
        <nav className="crumbs">
          <Link to="/">Trang chủ</Link>
          <span className="sep" aria-hidden="true">/</span>
          <span>Theo dõi</span>
        </nav>

        {items.length === 0 ? (
          <section className="watch-empty" style={{ maxWidth: '480px', marginInline: 'auto', paddingBlock: '48px 32px', textAlign: 'center', display: 'grid', justifyItems: 'center', gap: '8px' }}>
            <svg className="empty-icon" style={{ color: 'var(--muted)', marginBottom: '4px' }} width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
            </svg>
            <h1 style={{ fontSize: '22px', fontWeight: 500, letterSpacing: '-0.01em', margin: 0 }}>Chưa theo dõi phiên nào</h1>
            <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0 }}>Nhấn ♡ trên bất kỳ phiên đấu giá nào để thêm vào đây. Bạn sẽ nhận thông báo 30 phút trước khi phiên kết thúc.</p>
            <div style={{ marginTop: '16px' }}>
              <Link className="btn btn-primary" to="/search">Khám phá phiên đang chạy</Link>
            </div>
          </section>
        ) : (
          <>
            <div className="watch-head">
              <h1 className="watch-title">Đang theo dõi (<span className="tnum">{items.length}</span>)</h1>
              <div className="sort-picker">
                <select style={{ padding: '8px 34px 8px 12px', borderRadius: '6px', border: '1px solid var(--border)', appearance: 'none', background: 'var(--surface)' }}>
                  <option value="ending">Sắp kết thúc</option>
                  <option value="newest">Mới thêm</option>
                  <option value="price">Giá</option>
                </select>
                <div style={{ position: 'absolute', right: '14px', top: '50%', width: '8px', height: '8px', borderRight: '1.5px solid var(--muted)', borderBottom: '1.5px solid var(--muted)', transform: 'translateY(-70%) rotate(45deg)', pointerEvents: 'none' }}></div>
              </div>
            </div>

            <p className="watch-note">1 phiên kết thúc trong 24h tới.</p>

            <div className="sale-grid">
              {items.map((item) => (
                <article key={item.id} className="sale-card">
                  <div className="media-frame" style={{ position: 'relative', padding: '12px 12px 0' }}>
                    <button type="button" className="watch-heart" onClick={() => handleRemove(item.id)} aria-label="Bỏ theo dõi">
                      <svg className="ic-heart" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" /></svg>
                      <svg className="ic-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
                    </button>
                    <Link className="media" to={`/auctions/${item.id}`} style={{ display: 'block' }}>
                      <img src={item.img} alt={item.title} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: '6px' }} />
                    </Link>
                    {item.isEnding && <span className="ending-badge">Sắp kết thúc</span>}
                  </div>
                  <div className="sale-body">
                    <h3 className="card-title"><Link to={`/auctions/${item.id}`}>{item.title}</Link></h3>
                    <div className="sale-price-row">
                      <span className="price-grid">
                        <span className="price-label">Giá hiện tại</span>
                        <span className="sale-price tnum">{item.price}</span>
                      </span>
                      <span className="countdown-wrap">
                        <span className="countdown-time">{item.time}</span>
                        <span className="price-label">Kết thúc sau</span>
                      </span>
                    </div>
                    <button className="follow-toggle" type="button" aria-pressed="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                      <span>Thông báo khi sắp kết thúc</span>
                      <span className="switch" aria-hidden="true"></span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}