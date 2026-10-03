import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function SearchPage() {
  const [timeLeft, setTimeLeft] = useState(48200);

  // Bộ đếm thời gian thực
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatVND = (n: number) => n.toLocaleString("vi-VN").replace(/[.,](\d{3})/g, (m, g) => "." + g) + "đ";
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  // Xử lý bộ lọc bằng Tab Pill (Design System v2)
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'hot' | 'new'>('all');

  // Dữ liệu mô phỏng các phiên đang diễn ra, có gắn nhãn (status)
  const allAuctions = [
    { id: '1', title: 'MacBook Pro 14 M3 2023', price: 38500000, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', status: 'hot', bids: 42, views: 128 },
    { id: '2', title: 'iPhone 15 Pro Max 256GB', price: 27900000, img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800', status: 'live', bids: 18, views: 84 },
    { id: '3', title: 'iPad Pro 11 M2 128GB', price: 19800000, img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800', status: 'new', bids: 2, views: 14 },
    { id: '4', title: 'AirPods Max', price: 10500000, img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800', status: 'live', bids: 9, views: 52 },
    { id: '5', title: 'Sony WH-1000XM5', price: 4900000, img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800', status: 'ending', bids: 0, views: 10 },
  ];

  // Lọc sản phẩm theo Tab
  const displayAuctions = allAuctions.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'live') return item.status === 'live' || item.status === 'hot';
    if (activeTab === 'hot') return item.status === 'hot';
    if (activeTab === 'new') return item.status === 'new';
    return true;
  });

  return (
    <main id="main">
      {/* ═══ Header Section: Sử dụng Tint Bề mặt (Surface Sky) ═══ */}
      <section style={{ background: 'var(--surface-sky, #f0f9ff)', paddingBlock: '64px', borderBottom: '1px solid var(--border)' }}>
        <div className="container rise-in">
          <p className="eyebrow" style={{ color: 'var(--color-new-text, #5b2fd1)' }}>Sàn đấu giá</p>
          <h1 style={{ marginTop: '8px', marginBottom: '16px' }}>Phiên đang diễn ra</h1>
          <p className="lede">Khám phá các sản phẩm công nghệ đang được đấu giá tốt nhất hôm nay. Trả giá an toàn với hệ thống bảo vệ từ AuctionHub.</p>
          
          {/* Surface Tint KPI Cards */}
          <div className="kpi-grid" style={{ marginTop: '32px' }}>
            <article className="kpi-card kpi-mint">
              <p className="kpi-label">Tổng phiên đang mở</p>
              <p className="kpi-value tnum">2,415</p>
            </article>
            <article className="kpi-card kpi-peach">
              <p className="kpi-label">Phiên siêu Hot</p>
              <p className="kpi-value tnum">42</p>
            </article>
            <article className="kpi-card kpi-lavender">
              <p className="kpi-label">Tổng lượt bid hôm nay</p>
              <p className="kpi-value tnum">12,804</p>
            </article>
          </div>
        </div>
      </section>

      {/* ═══ Danh sách sản phẩm (Semantic Color + Interactive Card) ═══ */}
      <section style={{ paddingBlock: '48px', borderTop: 'none' }}>
        <div className="container rise-in" style={{ animationDelay: '100ms' }}>
          
          {/* Pill Tabs (Indicator dùng Gradient) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div className="pill-group" role="tablist" aria-label="Bộ lọc phiên">
              <button className={`pill-tab ${activeTab === 'all' ? 'is-active' : ''}`} onClick={() => setActiveTab('all')} role="tab" type="button">Tất cả</button>
              <button className={`pill-tab ${activeTab === 'live' ? 'is-active' : ''}`} onClick={() => setActiveTab('live')} role="tab" type="button">Đang diễn ra</button>
              <button className={`pill-tab ${activeTab === 'hot' ? 'is-active' : ''}`} onClick={() => setActiveTab('hot')} role="tab" type="button">Sắp kết thúc</button>
              <button className={`pill-tab ${activeTab === 'new' ? 'is-active' : ''}`} onClick={() => setActiveTab('new')} role="tab" type="button">Mới niêm yết</button>
            </div>
            
            <p className="section-note" style={{ margin: 0 }}>Hiển thị <strong>{displayAuctions.length}</strong> phiên phù hợp.</p>
          </div>
          
          {/* Grid hiển thị sản phẩm (Nâng 2px khi hover) */}
          <div className="od-grid" style={{ '--od-cols': '3', '--od-gap': '24px' } as React.CSSProperties}>
            {displayAuctions.map(item => (
              <article key={item.id} className="demo-card mini-auction" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
                {/* Hình ảnh (Zoom nhẹ khi hover) */}
                <Link className="ma-img zoom-media" to={`/auction/${item.id}`} style={{ borderRadius: '8px 8px 0 0' }}>
                  <img src={item.img} alt={item.title} loading="lazy" style={{ aspectRatio: '4/3' }} />
                </Link>
                
                <div className="ma-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Badge Ngữ nghĩa (Semantic Color) */}
                  <div style={{ marginBottom: '12px' }}>
                    {item.status === 'hot' && <span className="status-chip chip-hot">Sắp kết thúc</span>}
                    {item.status === 'live' && <span className="status-chip chip-live">Đang diễn ra</span>}
                    {item.status === 'new' && <span className="status-chip chip-new">Mới niêm yết</span>}
                    {item.status === 'ending' && <span className="status-chip chip-ending">Còn 2 ngày</span>}
                  </div>
                  
                  <h3 className="ma-title" style={{ marginBottom: '16px' }}>
                    <Link to={`/auction/${item.id}`} className="focusable" style={{ textDecoration: 'none', outline: 'none' }}>{item.title}</Link>
                  </h3>
                  
                  <div style={{ marginTop: 'auto' }}>
                    <p className="ma-price-label">Giá hiện tại</p>
                    <p className="ma-price tnum">{formatVND(item.price)}</p>
                  </div>
                  
                  {/* Dòng trạng thái dưới cùng (có đồng hồ đếm ngược với phiên Hot) */}
                  <div className="ma-foot">
                    <span className={`timer-line ${item.status === 'hot' ? 'v2-ending' : ''}`}>
                      {item.status === 'hot' ? (
                        <>
                          <span style={{ color: 'var(--color-hot-text)' }}>{pad(h)}:{pad(m)}:{pad(s)}</span> còn lại
                        </>
                      ) : (
                        `${item.bids} bid · ${item.views} lượt xem`
                      )}
                    </span>
                    <Link className="ma-cta focusable" to={`/auction/${item.id}`} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                      Tham gia
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          {displayAuctions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '64px 20px', background: 'var(--surface-warm)', borderRadius: '12px' }}>
              <p style={{ color: 'var(--muted)', fontSize: '16px' }}>Không tìm thấy phiên đấu giá nào khớp với bộ lọc.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}