import React from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main id="main">
      <div className="container">
        <div className="nf-wrap">
          <section className="nf-card">
            <span className="nf-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </span>
            <h1 id="nf-title" style={{ fontFamily: 'var(--font-display)', fontSize: '26px', margin: 0 }}>Phiên không tồn tại</h1>
            <p className="nf-text">
              Trang bạn đang tìm kiếm có thể đã bị xóa, hoặc đường dẫn không chính xác. 
              Nếu bạn chắc chắn link đúng, hãy liên hệ <a href="mailto:support@auctionhub.vn">support@auctionhub.vn</a>
              <span className="err-code">Mã lỗi A404</span>
            </p>
            <div className="nf-actions">
              <Link className="btn btn-primary" to="/">Về trang chủ</Link>
              <Link className="btn btn-ghost" to="/search">Xem phiên đang chạy</Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}