import React, { useState } from 'react';

export default function AdminDashboardPage() {
  const [pendingVisible, setPendingVisible] = useState(true);
  const [disputeResolved, setDisputeResolved] = useState(false);
  const [notice, setNotice] = useState('');
  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1>Tổng quan hệ thống</h1>
          <p className="sub">Thứ Bảy, 19/09/2026. Có <strong className="tnum">5</strong> phiên chờ duyệt và <strong className="tnum">3</strong> tranh chấp đang mở.</p>
        </div>
      </div>
      {notice && <div className="card" role="status" style={{ marginBottom: 16, padding: 14, color: 'var(--accent)' }}>{notice}</div>}

      <div className="kpi-grid">
        <div className="kpi kpi-lavender">
          <div className="label">Doanh thu nền tảng · phí 7%</div>
          <div className="value">8.450.000<span className="unit">đ</span></div>
          <div className="delta"><span style={{ color: 'var(--success-text)', fontWeight: 600 }}>↑ +14%</span> so với tháng trước</div>
        </div>
        <div className="kpi kpi-sky">
          <div className="label">Phiên hoạt động</div>
          <div className="value">156</div>
        </div>
        <div className="kpi kpi-mint">
          <div className="label">Người dùng mới</div>
          <div className="value">234</div>
        </div>
        <div className="kpi kpi-peach" style={{ borderLeft: '3px solid var(--danger)' }}>
          <div className="label">Tranh chấp mở</div>
          <div className="value" style={{ color: 'var(--danger-text)' }}>3</div>
          <div className="delta"><span style={{ color: '#b45309', fontWeight: 500 }}>+1 so với tuần trước</span></div>
        </div>
      </div>

      <section className="card" style={{ marginBottom: '24px' }}>
        <div className="card-head">
          <h2>Phiên chờ duyệt</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr><th>Sản phẩm</th><th>Người bán</th><th>Giá khởi điểm</th><th>Ngày tạo</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              {pendingVisible ? <tr>
                <td>
                  <div className="prod">
                    <span className="thumb"><img src="/images/headphones.jpg" alt="" /></span>
                    <span className="pmeta"><span className="pname">Sony WH-1000XM5</span><span className="pid">#AU-1071</span></span>
                  </div>
                </td>
                <td><strong style={{ fontWeight: 500, color: 'var(--fg)' }}>TechStore VN</strong></td>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>4.500.000đ</span></td>
                <td><span style={{ color: 'var(--muted)' }}>19/09 · 09:12</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => { setPendingVisible(false); setNotice('Đã duyệt phiên Sony WH-1000XM5.'); }} style={{ border: 'none', background: 'none', color: 'var(--success-text)', fontWeight: 600, cursor: 'pointer' }}>Duyệt</button>
                    <button onClick={() => { setPendingVisible(false); setNotice('Đã từ chối phiên Sony WH-1000XM5 và gửi lý do cho người bán.'); }} style={{ border: 'none', background: 'none', color: 'var(--danger-text)', fontWeight: 600, cursor: 'pointer' }}>Từ chối</button>
                  </div>
                </td>
              </tr> : <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)' }}>Không còn phiên chờ duyệt.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <div className="two-col">
        <section className="card">
          <div className="card-head">
            <h2>Tranh chấp gần đây</h2>
          </div>
          <table className="tbl">
            <thead>
              <tr><th>Phiên</th><th>Người mua</th><th>Người bán</th><th>Trạng thái</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              {!disputeResolved ? <tr style={{ borderLeft: '3px solid var(--danger)' }}>
                <td><span className="pname" style={{ fontWeight: 500, color: 'var(--fg)' }}>MacBook Pro 14 M3</span><br/><small style={{ color: 'var(--muted)' }}>#DS-301</small></td>
                <td>Nguyễn Văn A</td>
                <td>TechStore VN</td>
                <td><span className="status-pill st-pay" style={{ padding: '2px 8px', fontSize: '12px' }}><span className="dot"></span>Đang mở</span></td>
                <td><button onClick={() => { setDisputeResolved(true); setNotice('Tranh chấp #DS-301 đã được đánh dấu hoàn tất.'); }} className="btn btn-primary" style={{ height: '32px', fontSize: '12px', padding: '0 12px' }}>Giải quyết</button></td>
              </tr>
              : <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)' }}>Không còn tranh chấp mở.</td></tr>}
            </tbody>
          </table>
        </section>

        <section className="card">
          <div className="card-head">
            <h2>Hoạt động gần đây</h2>
          </div>
          <div style={{ padding: '0 24px 20px' }}>
            <ul className="feed-list">
              <li>
                <span className="feed-dot blue"></span>
                <div className="feed-text">
                  <b>Phiên mới chờ duyệt: Sony WH-1000XM5</b>
                  <span className="hint">TechStore VN · giá khởi điểm 4.500.000đ</span>
                </div>
                <span className="feed-time">09:02</span>
              </li>
              <li>
                <span className="feed-dot amber"></span>
                <div className="feed-text">
                  <b>Người mua mở lại tranh chấp</b>
                  <span className="hint">#DS-301 · MacBook Pro 14 M3 2023</span>
                </div>
                <span className="feed-time">08:30</span>
              </li>
              <li>
                <span className="feed-dot green"></span>
                <div className="feed-text">
                  <b>Thanh toán escrow hoàn tất</b>
                  <span className="hint">iPhone 14 Pro · 18.500.000đ</span>
                </div>
                <span className="feed-time">08:12</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
