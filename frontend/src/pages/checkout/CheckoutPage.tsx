import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { localDB } from '../../utils/localDB';

export default function CheckoutPage() {
  const { auctionId = '' } = useParams();
  const auction = localDB.getAuction(auctionId) ?? localDB.getAuctions()[0];
  const order = localDB.getOrders().find((item) => item.auctionId === auction.id) ?? localDB.createOrder(auction.id);
  const total = order.amount + order.platformFee + order.shippingFee;
  const formatMoney = (value: number) => `${value.toLocaleString('vi-VN')}đ`;
  
  // States điều khiển giao diện
  const [addressType, setAddressType] = useState<'saved' | 'new'>('saved');
  const [paymentMethod, setPaymentMethod] = useState<'vnpay' | 'momo' | 'bank'>('momo');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [timeLeft, setTimeLeft] = useState(85512); // Tương đương ~23h:45m
  const [newAddress, setNewAddress] = useState({ name: '', phone: '', city: '', district: '', detail: '' });
  const [addressError, setAddressError] = useState('');

  // Xử lý đếm ngược thanh toán
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Đã sao chép: ${text}`); // Có thể thay bằng thư viện Toast thực tế
  };

  // Giả lập quá trình thanh toán (Gọi API)
  const handlePaymentSubmit = () => {
    if (addressType === 'new') {
      const valid = newAddress.name.trim() && /^0\d{9}$/.test(newAddress.phone.replace(/\s/g, '')) && newAddress.city.trim() && newAddress.district.trim() && newAddress.detail.trim();
      if (!valid) { setAddressError('Vui lòng điền đủ họ tên, số điện thoại 10 chữ số và địa chỉ giao hàng.'); return; }
    }
    setAddressError('');
    setStatus('processing');
    
    // Mô phỏng cổng thanh toán ở client và ghi trạng thái escrow vào localStorage.
    setTimeout(() => {
      const address = addressType === 'saved' ? '123 Lê Lợi, Phường Sài Gòn, TP.HCM' : `${newAddress.name.trim()} · ${newAddress.phone.trim()} · ${newAddress.detail.trim()}, ${newAddress.district.trim()}, ${newAddress.city.trim()}`;
      localDB.updateOrder(order.id, { status: 'paid', paymentMethod, shippingAddress: address });
      setStatus('success');
    }, 900);
  };

  // 1. MÀN HÌNH THÀNH CÔNG (Tách từ order-success.html)
  if (status === 'success') {
    return (
      <main id="main" className="container">
        <nav className="crumbs" style={{ paddingBlock: 'var(--space-5) 0' }}>
          <Link to="/">Trang chủ</Link><span className="sep">/</span>
          <Link to={`/auctions/${auctionId}`}>Phiên {auctionId}</Link><span className="sep">/</span>
          <span>Thanh toán thành công</span>
        </nav>

        <div style={{ maxWidth: '640px', marginInline: 'auto', paddingBlock: '32px 48px', display: 'grid', gap: '20px' }}>
          <section className="card" style={{ textAlign: 'center', padding: '32px' }}>
            <span style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginInline: 'auto' }}>
              <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
                <path d="M5 12.5 10 17.5 19 6.5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div style={{ marginTop: '16px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 500 }}>Thanh toán thành công</h1>
              <p style={{ marginTop: '8px', color: 'var(--muted)' }}>Đơn hàng #{order.id} · {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
            </div>

            <div style={{ textAlign: 'left', display: 'grid', gap: '16px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', paddingBlock: '20px', marginTop: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: '16px', alignItems: 'center' }}>
                <img src={auction.images[0]} alt={auction.title} style={{ width: '64px', height: '64px', borderRadius: '6px', objectFit: 'cover' }} />
                <h2 style={{ fontSize: '18px', fontWeight: 500 }}>{auction.title}</h2>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: 'var(--fg-2)' }}>Người bán</span><strong>TechStore VN</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: 'var(--fg-2)' }}>Phương thức</span><strong>{paymentMethod.toUpperCase()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 700 }}>
                <span>Tổng</span><span>{formatMoney(total)}</span>
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link className="btn btn-primary" to={`/orders/${order.id}`}>Xem đơn hàng</Link>
              <Link to="/" className="btn btn-ghost">Về trang chủ</Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // 2. MÀN HÌNH THANH TOÁN CHÍNH (Gồm cả trạng thái Lỗi hoặc Đang xử lý)
  return (
    <main id="main">
      <div className="container">
        <nav className="crumbs">
          <Link to="/">Trang chủ</Link><span className="sep">/</span>
          <Link to={`/auctions/${auctionId}`}>Phiên {auctionId}</Link><span className="sep">/</span>
          <span>Thanh toán</span>
        </nav>

        {/* Cảnh báo khi thanh toán thất bại */}
        {status === 'failed' && (
          <div style={{ display: 'flex', gap: '12px', padding: '14px 16px', marginBottom: '24px', background: 'var(--danger-bg)', borderLeft: '4px solid var(--danger)', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--fg-2)' }}>
              <strong style={{ color: 'var(--danger-text)' }}>Thanh toán không thành công.</strong> Vui lòng thử lại hoặc chọn phương thức khác.
            </p>
          </div>
        )}

        <div className="checkout-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 60fr) minmax(0, 40fr)', gap: '24px', paddingBottom: '48px' }}>
          {/* CỘT TRÁI: Thông tin và Phương thức */}
          <section className="col-left" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card" style={{ padding: '20px', background: '#fff', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 500, margin: 0 }}>Thanh toán đơn hàng</h1>
              <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '8px' }}>
                Đơn hàng <strong>#{order.id}</strong> · Vui lòng thanh toán trong <strong style={{ color: 'var(--urgent)' }}>{formatTime(timeLeft)}</strong>
              </p>
            </div>

            {/* Khối Địa chỉ */}
            <section className="card" style={{ padding: '20px', background: '#fff', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Địa chỉ giao hàng</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', gap: '12px', padding: '14px', border: `1px solid ${addressType === 'saved' ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '6px', cursor: 'pointer' }}>
                  <input type="radio" name="addr" checked={addressType === 'saved'} onChange={() => setAddressType('saved')} style={{ accentColor: 'var(--accent)' }} />
                  <div>
                    <span style={{ display: 'block', fontWeight: 600 }}>Địa chỉ đã lưu</span>
                    <span style={{ fontSize: '14px', color: 'var(--muted)' }}>Nguyễn Văn A · 0901 *** 456 · 123 Lê Lợi, Quận 1, TP.HCM</span>
                  </div>
                </label>
                
                <label style={{ display: 'flex', gap: '12px', padding: '14px', border: `1px solid ${addressType === 'new' ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '6px', cursor: 'pointer' }}>
                  <input type="radio" name="addr" checked={addressType === 'new'} onChange={() => setAddressType('new')} style={{ accentColor: 'var(--accent)' }} />
                  <div>
                    <span style={{ display: 'block', fontWeight: 600 }}>Địa chỉ mới</span>
                    <span style={{ fontSize: '14px', color: 'var(--muted)' }}>Thêm địa chỉ nhận hàng khác</span>
                  </div>
                </label>
              </div>

              {/* Form địa chỉ mới (Ẩn/Hiện dựa vào state) */}
              {addressType === 'new' && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input value={newAddress.name} onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} type="text" placeholder="Họ và tên" style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} />
                  <input value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} type="tel" placeholder="Số điện thoại" style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} />
                  <input value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} type="text" placeholder="Tỉnh/Thành phố" style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} />
                  <input value={newAddress.district} onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })} type="text" placeholder="Quận/Huyện" style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} />
                  <input value={newAddress.detail} onChange={(e) => setNewAddress({ ...newAddress, detail: e.target.value })} type="text" placeholder="Địa chỉ cụ thể" style={{ gridColumn: '1 / -1', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} />
                </div>
              )}
              {addressError && <p className="form-error" role="alert">{addressError}</p>}
            </section>

            {/* Khối Thanh toán */}
            <section className="card" style={{ padding: '20px', background: '#fff', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Phương thức thanh toán</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', gap: '12px', padding: '14px', border: `1px solid ${paymentMethod === 'vnpay' ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '6px', cursor: 'pointer' }}>
                  <input type="radio" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} style={{ accentColor: 'var(--accent)' }} />
                  <div>
                    <span style={{ display: 'block', fontWeight: 600 }}>VNPay</span>
                    <span style={{ fontSize: '14px', color: 'var(--muted)' }}>Thanh toán qua cổng VNPay. Hỗ trợ thẻ ATM, Visa, Mastercard.</span>
                  </div>
                </label>
                
                <label style={{ display: 'flex', gap: '12px', padding: '14px', border: `1px solid ${paymentMethod === 'momo' ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '6px', cursor: 'pointer' }}>
                  <input type="radio" checked={paymentMethod === 'momo'} onChange={() => setPaymentMethod('momo')} style={{ accentColor: 'var(--accent)' }} />
                  <div>
                    <span style={{ display: 'block', fontWeight: 600 }}>MoMo</span>
                    <span style={{ fontSize: '14px', color: 'var(--muted)' }}>Thanh toán qua ví MoMo.</span>
                  </div>
                </label>

                <label style={{ display: 'flex', gap: '12px', padding: '14px', border: `1px solid ${paymentMethod === 'bank' ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '6px', cursor: 'pointer' }}>
                  <input type="radio" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} style={{ accentColor: 'var(--accent)' }} />
                  <div>
                    <span style={{ display: 'block', fontWeight: 600 }}>Chuyển khoản ngân hàng</span>
                    <span style={{ fontSize: '14px', color: 'var(--muted)' }}>Chuyển khoản trực tiếp tới tài khoản của AuctionHub.</span>
                  </div>
                </label>
              </div>

              {/* Panel hiển thị tương ứng với phương thức thanh toán */}
              {paymentMethod === 'momo' && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '120px', height: '120px', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', borderRadius: '8px' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>[QR CODE]</p>
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, margin: '0 0 4px' }}>Mở app MoMo để quét</p>
                    <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0 }}>Quét mã này trong ứng dụng MoMo rồi xác nhận thanh toán.</p>
                  </div>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)', fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed var(--border)' }}>
                    <span>Ngân hàng: <strong>Vietcombank</strong></span>
                    <button className="link-btn" style={{ color: 'var(--accent)', cursor: 'pointer', border: 'none', background: 'none' }} onClick={() => copyToClipboard('Vietcombank')}>Sao chép</button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed var(--border)' }}>
                    <span>Số tài khoản: <strong>1234 5678 9012</strong></span>
                    <button className="link-btn" style={{ color: 'var(--accent)', cursor: 'pointer', border: 'none', background: 'none' }} onClick={() => copyToClipboard('123456789012')}>Sao chép</button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span>Nội dung: <strong>{order.id}</strong></span>
                    <button className="link-btn" style={{ color: 'var(--accent)', cursor: 'pointer', border: 'none', background: 'none' }} onClick={() => copyToClipboard(order.id)}>Sao chép</button>
                  </div>
                </div>
              )}
            </section>
          </section>

          {/* CỘT PHẢI: Tóm tắt Đơn hàng & Nút Thanh toán */}
          <aside className="col-right" style={{ position: 'sticky', top: '88px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <section className="card" style={{ padding: '20px', background: '#fff', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontWeight: 600 }}>
                <span>Tổng thanh toán</span>
                <span style={{ fontSize: '24px' }}>{formatMoney(total)}</span>
              </div>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', height: '48px', fontSize: '16px' }}
                onClick={handlePaymentSubmit}
                disabled={status === 'processing'}
              >
                {status === 'processing' ? 'Đang xử lý...' : 'Thanh toán ngay'}
              </button>
            </section>
            
            <section className="card" style={{ padding: '20px', background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '8px' }}>Vui lòng thanh toán trong</p>
              <p style={{ fontSize: '32px', fontWeight: 600, color: timeLeft < 3600 ? 'var(--urgent)' : 'var(--fg)', margin: 0 }}>
                {formatTime(timeLeft)}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>Đơn hàng sẽ bị hủy nếu quá hạn.</p>
            </section>
          </aside>
        </div>

        {/* OVERLAY LOADING (Khi nhấn nút Thanh toán) */}
        {status === 'processing' && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'grid', placeItems: 'center', background: 'rgba(17, 17, 19, 0.56)' }}>
            <div style={{ background: '#fff', padding: '32px', borderRadius: '8px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <p style={{ fontWeight: 600, marginTop: '16px' }}>Đang xử lý thanh toán...</p>
              <p style={{ fontSize: '14px', color: 'var(--muted)' }}>Vui lòng không đóng trang này.</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
