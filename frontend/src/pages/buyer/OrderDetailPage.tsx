import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { localDB } from '../../utils/localDB';

type OrderStatus = 'pending_payment' | 'shipping' | 'delivered' | 'completed' | 'cancelled' | 'dispute';

// 1. ĐƯA COMPONENT NÀY RA NGOÀI ĐỂ TRÁNH LỖI ESLINT
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default function OrderDetailPage() {
  const { id } = useParams();
  const order = localDB.getOrder(id ?? 'ORD-142') ?? localDB.getOrders()[0];
  const auction = localDB.getAuction(order.auctionId) ?? localDB.getAuctions()[0];
  const initialStatus: OrderStatus = order.status === 'pending_payment' ? 'pending_payment' : order.status === 'completed' ? 'completed' : order.status === 'delivered' ? 'delivered' : order.status === 'cancelled' ? 'cancelled' : order.status === 'dispute' ? 'dispute' : 'shipping';
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [actionMessage, setActionMessage] = useState('');
  const total = order.amount + order.platformFee + order.shippingFee;
  const formatMoney = (value: number) => `${value.toLocaleString('vi-VN')}đ`;

  return (
    <main id="main">
      <div className="container">
        {/* Thanh công cụ Dev để bạn test giao diện */}
        <div style={{ background: '#fef3c7', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <strong style={{ color: '#b45309' }}>Test UI Giao diện:</strong>
          <select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db' }}>
            <option value="pending_payment">1. Chờ thanh toán</option>
            <option value="shipping">2. Đang giao hàng</option>
            <option value="delivered">3. Đã giao hàng</option>
            <option value="dispute">4. Có tranh chấp</option>
            <option value="completed">5. Hoàn tất</option>
            <option value="cancelled">6. Đã hủy</option>
          </select>
        </div>

        <nav className="crumbs" aria-label="Chuỗi điều hướng">
          <Link to="/">Trang chủ</Link><span className="sep">/</span>
          <Link to="/orders">Đơn hàng</Link><span className="sep">/</span>
          <span className="mono">#{id || 'ORD-142'}</span>
        </nav>

        <div className="order-layout">
          <section className="col-left">
            <div className="card order-head">
              <div className="order-head-row">
                <h1>Đơn hàng <span className="mono">#{id || 'ORD-142'}</span></h1>
                
                {status === 'pending_payment' && <span className="status-pill st-pay"><span className="dot"></span>Chờ thanh toán</span>}
                {status === 'shipping' && <span className="status-pill st-ship"><span className="dot"></span>Đang giao hàng</span>}
                {status === 'delivered' && <span className="status-pill st-done"><span className="dot"></span>Đã giao</span>}
                {status === 'dispute' && <span className="status-pill st-dispute"><span className="dot"></span>Tranh chấp</span>}
                {status === 'completed' && <span className="status-pill st-done"><span className="dot"></span>Hoàn tất</span>}
                {status === 'cancelled' && <span className="status-pill st-cancelled"><span className="dot"></span>Đã hủy</span>}
              </div>
              <p className="order-sub">Đặt ngày 19/09/2026 {status === 'pending_payment' ? ', chưa thanh toán' : ', thanh toán 19/09/2026'}</p>
            </div>

            {status === 'dispute' && (
              <section className="card notice-card" role="alert">
                <div className="notice-line">
                  <span className="notice-dot"></span>
                  <p><strong>Đang xử lý.</strong> Admin phản hồi trong 24h.</p>
                </div>
              </section>
            )}

            <section className="card">
              <div className="item-row">
                <img className="item-thumb" src={auction.images[0]} alt={auction.title} />
                <div className="item-info">
                  <div className="item-title-line">
                    <h2>{auction.title}</h2>
                    <span className="cond-pill">Like New</span>
                  </div>
                  <p className="item-price">
                    <span className="price-label">Giá thắng</span>
                    <span className="price tnum">{formatMoney(order.amount)}</span>
                  </p>
                </div>
              </div>
              <div className="seller-row" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <a href="#seller" style={{ fontWeight: 600, color: 'var(--fg)', textDecoration: 'none' }}>TechStore VN</a>
                <span style={{ color: 'var(--blue-text)', background: 'var(--blue-bg)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>Đã xác minh</span>
              </div>
            </section>

            <section className="card">
              <h2 className="card-title" style={{ fontSize: '16px', fontWeight: 600 }}>Tiến trình đơn hàng</h2>
              <ol className="timeline">
                <li className="tl-step is-done">
                  <span className="tl-dot"><CheckIcon /></span>
                  <span className="tl-text">
                    <span className="tl-title">Đấu giá kết thúc</span>
                    <span className="tl-meta">— 19/09 14:30</span>
                  </span>
                </li>

                <li className={`tl-step ${status === 'pending_payment' ? 'is-current' : 'is-done'}`}>
                  <span className="tl-dot">{status !== 'pending_payment' && <CheckIcon />}</span>
                  <span className="tl-text">
                    <span className="tl-title">Thanh toán {status !== 'pending_payment' && 'thành công'}</span>
                    <span className="tl-meta">
                      {status === 'pending_payment' ? '— hạn 20/09 15:12' : '— 19/09 15:12 · VNPay'}
                    </span>
                  </span>
                </li>

                <li className={`tl-step ${['shipping', 'delivered', 'dispute'].includes(status) ? 'is-done' : 'is-pending'}`}>
                  <span className="tl-dot">{['shipping', 'delivered', 'dispute'].includes(status) && <CheckIcon />}</span>
                  <span className="tl-text">
                    <span className="tl-title">Người bán xác nhận</span>
                    <span className="tl-meta">{['shipping', 'delivered', 'dispute'].includes(status) ? '— 19/09 16:00' : ''}</span>
                  </span>
                </li>

                <li className={`tl-step ${['delivered', 'dispute'].includes(status) ? 'is-done' : status === 'shipping' ? 'is-current' : 'is-pending'}`}>
                  <span className="tl-dot">{['delivered', 'dispute'].includes(status) && <CheckIcon />}</span>
                  <span className="tl-text">
                    <span className="tl-title">Đang giao hàng</span>
                    <span className="tl-meta">
                      {status === 'pending_payment' ? 'GHN sau khi đơn được đóng gói' : '— 20/09 08:15 · GHN · Mã: GHN123456789'}
                    </span>
                  </span>
                </li>

                {status === 'dispute' ? (
                  <li className="tl-step is-dispute">
                    <span className="tl-dot" style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>!</span>
                    <span className="tl-text">
                      <span className="tl-title">Tranh chấp đang xử lý</span>
                      <span className="tl-meta">— Mở 20/09 18:00 · ID DS-142</span>
                    </span>
                  </li>
                ) : (
                  <li className={`tl-step ${status === 'delivered' ? 'is-current' : 'is-pending'}`}>
                    <span className="tl-dot"></span>
                    <span className="tl-text">
                      <span className="tl-title">Chờ bạn xác nhận nhận hàng</span>
                    </span>
                  </li>
                )}
              </ol>
            </section>

            <section className="card escrow-card">
              <div style={{ display: 'flex', gap: '12px' }}>
                <span className="escrow-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                </span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Tiền của bạn được bảo vệ</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--fg-2)' }}>
                    {status === 'pending_payment' ? 'Tiền sẽ được giữ an toàn sau khi bạn thanh toán.' : 'Tiền đang được giữ an toàn trong Escrow.'}
                  </p>
                </div>
              </div>
            </section>
          </section>

          <aside className="col-right">
            <section className="card">
              <h2 className="card-title" style={{ fontSize: '16px', fontWeight: 600 }}>Tóm tắt đơn hàng</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                <span>Giá thắng</span><strong className="tnum">{formatMoney(order.amount)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                <span>Phí nền tảng (7%)</span><strong className="tnum">{formatMoney(order.platformFee)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                <span>Vận chuyển</span><strong className="tnum">{formatMoney(order.shippingFee)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', fontSize: '18px', fontWeight: 700 }}>
                <span>Tổng</span><span className="tnum">{formatMoney(total)}</span>
              </div>
            </section>

            <section className="card" style={{ gap: '12px' }}>
              {status === 'pending_payment' && (
                <Link to={`/checkout/${order.auctionId}`} className="btn btn-primary btn-lg" style={{ width: '100%' }}>Thanh toán ngay</Link>
              )}
              
              {status === 'shipping' && (
                <button className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled title="Chỉ khả dụng sau khi đơn đã giao">Xác nhận đã nhận hàng</button>
              )}

              {status === 'delivered' && (
                <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => { localDB.updateOrder(order.id, { status: 'completed' }); setStatus('completed'); setActionMessage('Đã xác nhận nhận hàng. Tiền escrow sẽ được giải ngân cho người bán.'); }}>Xác nhận đã nhận hàng</button>
              )}

              {status === 'completed' && <p className="body-sm" style={{ color: 'var(--success-text)' }}>Đơn hàng đã hoàn tất. Cảm ơn bạn đã giao dịch.</p>}
              {status === 'cancelled' && <p className="body-sm" style={{ color: 'var(--muted)' }}>Đơn hàng đã được hủy.</p>}

              {status === 'dispute' && (
                <button className="btn btn-primary btn-lg" style={{ width: '100%' }}>Xem chi tiết tranh chấp</button>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                {!['dispute', 'completed', 'cancelled'].includes(status) && <button className="btn btn-ghost" onClick={() => { const next = status === 'pending_payment' ? 'cancelled' : 'dispute'; localDB.updateOrder(order.id, { status: next }); setStatus(next); setActionMessage(next === 'cancelled' ? 'Đơn hàng đã được hủy.' : 'Đã mở tranh chấp. Admin sẽ phản hồi trong 24 giờ.'); }} style={{ color: 'var(--danger-text)', padding: 0, height: 'auto', minHeight: 'auto' }}>{status === 'pending_payment' ? 'Hủy đơn' : 'Mở tranh chấp'}</button>}
                {status === 'dispute' && <button className="btn btn-ghost" onClick={() => setActionMessage('Khu vực tải bằng chứng đã được mở.')} style={{ color: 'var(--accent)', padding: 0, height: 'auto', minHeight: 'auto' }}>Bổ sung bằng chứng</button>}
                <button className="btn btn-ghost" onClick={() => setActionMessage('Đã gửi yêu cầu liên hệ tới người bán.')} style={{ padding: 0, height: 'auto', minHeight: 'auto' }}>Liên hệ người bán</button>
              </div>
              {actionMessage && <p className="body-sm" role="status" style={{ marginTop: 12, color: 'var(--accent)' }}>{actionMessage}</p>}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
