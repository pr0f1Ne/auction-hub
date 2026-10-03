import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MOCK_RESULTS = [
  { id: 1, title: 'MacBook Pro 14 M3 2023', price: '38.500.000đ', time: '13:23:20', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800' },
  { id: 2, title: 'MacBook Pro 16 M3 Max', price: '58.900.000đ', time: '02:40:00', img: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800' },
  { id: 3, title: 'MacBook Air 15 M2 2023', price: '28.400.000đ', time: '32:46:40', img: 'https://images.unsplash.com/photo-1516387722522-4a25d81ea199?w=800' },
];

export function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('macbook');
  const [category, setCategory] = useState('laptop');

  return (
    <main id="main">
      <div className="container">
        <nav className="crumbs" style={{ paddingBlock: '20px 0' }}>
          <Link to="/">Trang chủ</Link>
          <span className="sep" aria-hidden="true">/</span>
          <span>Tìm kiếm</span>
          <span className="sep" aria-hidden="true">/</span>
          <span>{searchTerm}</span>
        </nav>

        <div className="results-layout">
          {/* SIDEBAR BỘ LỌC */}
          <aside className="search-sidebar">
            <div className="filter-head">
              <h2>Bộ lọc</h2>
              <button type="button" className="filter-reset">Xóa tất cả</button>
            </div>

            <div className="filter-group">
              <span className="fg-title">Danh mục</span>
              <div className="filter-opts">
                <label className="filter-opt">
                  <input type="radio" name="cat" checked={category === 'all'} onChange={() => setCategory('all')} /> Tất cả
                </label>
                <label className="filter-opt">
                  <input type="radio" name="cat" checked={category === 'phone'} onChange={() => setCategory('phone')} /> Điện thoại
                </label>
                <label className="filter-opt">
                  <input type="radio" name="cat" checked={category === 'laptop'} onChange={() => setCategory('laptop')} /> Laptop
                </label>
              </div>
            </div>

            <div className="filter-group">
              <span className="fg-title">Khoảng giá</span>
              <div className="price-fields">
                <input type="text" placeholder="Từ" />
                <input type="text" placeholder="Đến" />
              </div>
              <button type="button" className="btn-apply">Áp dụng</button>
            </div>

            <div className="filter-group">
              <span className="fg-title">Tình trạng</span>
              <div className="filter-opts">
                <label className="filter-opt"><input type="checkbox" /> Mới</label>
                <label className="filter-opt"><input type="checkbox" /> Like New</label>
                <label className="filter-opt"><input type="checkbox" /> Đã qua sử dụng</label>
              </div>
            </div>
          </aside>

          {/* KẾT QUẢ TÌM KIẾM */}
          <section className="results-main">
            <form className="search-bar" role="search" onSubmit={(e) => e.preventDefault()}>
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input type="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm phiên đấu giá..." />
              {searchTerm && (
                <button type="button" className="search-clear" onClick={() => setSearchTerm('')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ width: 20, height: 20 }}>
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              )}
            </form>

            <div className="results-head">
              <h1 className="results-title">{MOCK_RESULTS.length} phiên cho <span className="term">'{searchTerm}'</span></h1>
              <div className="sort-picker">
                <select>
                  <option value="newest">Mới nhất</option>
                  <option value="ending">Sắp kết thúc</option>
                  <option value="price-asc">Giá thấp-cao</option>
                </select>
              </div>
            </div>

            <p className="result-note">Đang hiển thị {MOCK_RESULTS.length} phiên khớp bộ lọc.</p>

            <div className="chips-row">
              <span className="chip-pill">
                Laptop 
                <button style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ width: 14, height: 14 }}><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
              </span>
            </div>

            {MOCK_RESULTS.length > 0 ? (
              <div className="sale-grid">
                {MOCK_RESULTS.map(item => (
                  <article key={item.id} className="sale-card">
                    <div className="media">
                      <img src={item.img} alt={item.title} />
                    </div>
                    <div className="sale-body">
                      <h3 className="card-title">
                        <Link to={`/auctions/${item.id}`}>{item.title}</Link>
                      </h3>
                      <div className="sale-price-row">
                        <div className="price-grid">
                          <span className="price-label">Giá hiện tại</span>
                          <span className="sale-price tnum">{item.price}</span>
                        </div>
                        <div className="countdown-wrap">
                          <span className="countdown-time">{item.time}</span>
                          <span className="price-label">Kết thúc sau</span>
                        </div>
                      </div>
                      <Link to={`/auctions/${item.id}`} className="btn btn-primary">Đặt giá</Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-panel">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--muted)', marginBottom: 8 }}>
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.35-4.35M8 11h6" />
                </svg>
                <h2 style={{ fontSize: 21, fontWeight: 500, margin: 0 }}>Không có phiên nào khớp với bộ lọc.</h2>
                <p style={{ color: 'var(--muted)', fontSize: 14 }}>Giảm bớt điều kiện hoặc thử khoảng giá khác.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}