import React from 'react';
import { Link } from 'react-router-dom';

export default function SellerDashboardPage() {
  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1>Tổng quan</h1>
          <p className="sub">Thứ Bảy, 19/09/2026. 1 phiên đóng trong 42 phút, 2 đơn chờ xác nhận.</p>
        </div>
        <div className="head-actions">
          <Link to="/seller/auctions/new" className="btn btn-primary" id="btn-create">Tạo phiên đấu giá</Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi kpi-lavender">
          <div className="label">Doanh thu tháng này</div>
          <div className="value">125.400.000<span className="unit">đ</span></div>
          <div className="delta"><span style={{ color: "var(--success-text)", fontWeight: 600 }}>↑ +12%</span> so với tháng trước</div>
        </div>
        <div className="kpi kpi-sky">
          <div className="label">Phiên đang hoạt động</div>
          <div className="value">8</div>
        </div>
        <div className="kpi kpi-mint">
          <div className="label">Tỷ lệ thắng</div>
          <div className="value">78<span style={{ fontSize: "16px", color: "var(--fg-2)" }}>%</span></div>
        </div>
        <div className="kpi kpi-peach">
          <div className="label">Đánh giá trung bình</div>
          <div className="value">4,8<span style={{ fontSize: "18px", color: "var(--fg-2)" }}>★</span></div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="col-left">
          <section className="card">
            <div className="card-head">
              <h2>Phiên đấu giá gần đây</h2>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Giá hiện tại</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100" width="48" height="48" style={{ borderRadius: "6px" }} alt="" />
                      <span>MacBook Pro 14 M3 2023<br/><small style={{ color: "var(--muted)" }}>#AU-1042</small></span>
                    </td>
                    <td><strong style={{ color: "var(--fg)" }}>35.500.000đ</strong></td>
                    <td><span style={{ color: "var(--color-live-text)", background: "var(--surface-mint)", padding: "4px 8px", borderRadius: "999px", fontSize: "12px", fontWeight: 500 }}>Đang hoạt động</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="col-right">
          <section className="card">
            <div className="card-head">
              <h2>Việc cần làm</h2>
            </div>
            <div style={{ padding: "0 24px 20px" }}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                  <b style={{ color: "var(--warn)", display: "block", fontSize: "14px" }}>Khẩn · 1 phiên đóng trong 42 phút</b>
                  <span style={{ color: "var(--muted)", fontSize: "12px" }}>iPhone 15 Pro Max, giá đang đứng ở 24.800.000đ</span>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}