import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { localDB, LocalUser } from '../../utils/localDB';

export function HomePage() {
  const [timeLeft, setTimeLeft] = useState(4 * 60 + 21);
  const isUrgent = timeLeft < 300;
  
  // Khởi tạo state an toàn, tránh gọi hàm liên tục gây Cascading Render
  const [currentUser] = useState<LocalUser | null>(() => localDB.getCurrentUser());

  const [currentBid, setCurrentBid] = useState(18500000);
  const [bidCount, setBidCount] = useState(38);
  const [bidInput, setBidInput] = useState<string>('');
  
  const [bidHistory, setBidHistory] = useState([
    { name: 'ngantran', price: 18500000, time: '12:03' },
    { name: 'hieupm', price: 18300000, time: '12:01' },
    { name: 'minhduc', price: 18100000, time: '11:58' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatVND = (n: number) => n.toLocaleString("vi-VN").replace(/[.,](\d{3})/g, (m, g) => "." + g) + "đ";
  const pad = (v: number) => (v < 10 ? "0" : "") + v;

  // Hàm xử lý đặt giá (Không khai báo Component lồng, Fix cứng Type)
  const handlePlaceBid = () => {
    const bidAmount = parseInt(bidInput, 10);
    if (isNaN(bidAmount) || bidAmount <= currentBid) {
      alert(`Giá bid phải lớn hơn ${formatVND(currentBid)}`);
      return;
    }
    
    setCurrentBid(bidAmount);
    setBidCount(prev => prev + 1);
    setBidHistory(prev => [
      { name: currentUser?.name || 'Bạn', price: bidAmount, time: 'Vừa xong' },
      ...prev
    ]);
    setBidInput(''); // Xóa nội dung ô input sau khi đặt
  };

  return (
    <main id="main">
      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            <div className="hero-copy">
              <span className="eyebrow">Sàn đấu giá thiết bị công nghệ</span>
              <h1 id="hero-title">Người bán không biến mất. Tiền <span className="headline-accent">không mất tích</span></h1>
              <p className="lede">
                Giữ tiền trong escrow đến khi bạn cầm hàng trên tay. Bid real-time,
                auto-bid, và một hàng đợi công bằng cho mọi lượt đặt giá.
                Phí 7% chỉ thu khi phiên thành công.
              </p>
              <div className="hero-actions">
  {/* Đổi thẻ <a> thành <Link> để mở thẳng trang chi tiết đấu giá */}
  <Link className="btn btn-primary btn-lg" to="/auction/1">
    Xem phiên đang chạy <span aria-hidden="true">→</span>
  </Link>
  
  {/* Điều hướng dựa vào trạng thái đăng nhập */}
  {!currentUser ? (
    <Link className="btn btn-ghost btn-lg" to="/register">Tạo tài khoản miễn phí</Link>
  ) : (
    <Link className="btn btn-ghost btn-lg" to="/search">Khám phá sản phẩm</Link>
  )}
</div>
            </div>

            <aside className="auction-card" id="phien-dang-dien-ra">
              <div className="auction-head">
                <span className="live-badge"><span className="live-dot" aria-hidden="true"></span>Phiên đang diễn ra</span>
                <span className="auction-meta tnum">128 lượt xem · <span>{bidCount}</span> lượt trả giá</span>
              </div>
              
              {/* ĐIỀU HƯỚNG BẰNG HÌNH ẢNH */}
              <Link to="/auction/1">
                <img className="auction-img" src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop" alt="MacBook Pro" width="800" height="800" />
              </Link>

              <div className="auction-body">
                <div className="od-row" style={{ '--od-gap': '8px' } as React.CSSProperties}>
                  <h3 className="auction-title od-fill">
                    {/* ĐIỀU HƯỚNG BẰNG TIÊU ĐỀ */}
                    <Link to="/auction/1" style={{ color: 'inherit', textDecoration: 'none' }}>MacBook Pro 14 inch M1 Pro 2021</Link>
                  </h3>
                  <span className="auction-cond">Đã qua sử dụng</span>
                </div>
                <div className="auction-price-row">
                  <div className="price-grid">
                    <span className="price-label">Giá hiện tại</span>
                    <span className="price-value" style={{ color: 'var(--accent)' }}>{formatVND(currentBid)}</span>
                  </div>
                  <div className="countdown-grid">
                    <span className="price-label">Kết thúc sau</span>
                    <span className={`timer ${isUrgent ? 'is-urgent' : ''}`}>
                      {pad(Math.floor(timeLeft / 3600))}:{pad(Math.floor((timeLeft % 3600) / 60))}:{pad(timeLeft % 60)}
                    </span>
                  </div>
                </div>
                
                {currentUser ? (
                  <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                    <div className="input-wrap" style={{ flex: 1, border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                      <input 
                        type="number" 
                        value={bidInput}
                        onChange={(e) => setBidInput(e.target.value)}
                        placeholder={`Tối thiểu ${formatVND(currentBid + 100000)}`}
                        style={{ width: '100%', height: '48px', padding: '0 14px', border: 'none', outline: 'none' }}
                      />
                    </div>
                    <button onClick={handlePlaceBid} className="btn btn-primary" style={{ padding: '0 24px', height: '48px' }}>Bid ngay</button>
                  </div>
                ) : (
                  <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0, textAlign: 'center' }}>Vui lòng đăng nhập để tham gia trả giá.</p>
                    <Link to="/login" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>Đăng nhập để đặt giá</Link>
                  </div>
                )}
              </div>

              <div className="history-head">
                <span className="price-label">Lịch sử trả giá gần nhất</span>
                {/* ĐIỀU HƯỚNG TỪ NÚT XEM TẤT CẢ */}
                <Link to="/auction/1">Xem tất cả</Link>
              </div>
              <ul className="bid-history">
                {/* Cắt mảng lấy 3 kết quả đầu để không làm hỏng giao diện card */}
                {bidHistory.slice(0, 3).map((bid, i) => (
                  <li key={i}>
                    <span className="bidder-name">{bid.name}</span>
                    <span className="bidder-price tnum">{formatVND(bid.price)}</span>
                    <span className="bidder-time">{bid.time}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* GIỮ NGUYÊN HOÀN TOÀN CÁC SECTION BÊN DƯỚI THEO YÊU CẦU */}
      <section className="trust-bar">
        <div className="container">
          <div className="trust-wrap">
            <div className="trust-group">
              <span className="trust-chip">Bảo vệ người mua</span>
              <span className="trust-chip">VNPay</span>
              <span className="trust-chip">MoMo</span>
              <span className="trust-chip">Verified Sellers</span>
            </div>
          </div>
        </div>
      </section>

      <section id="features">
        <div className="container">
          <div className="features-grid">
            <article className="feature-card feature-lead">
              <div className="feature-media">
                <img style={{ width: '100%', height: 'auto', aspectRatio: '16/10', objectFit: 'cover' }} src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop" alt="Real-time" />
                <span className="feature-chip"><span className="tnum">00:58:41</span></span>
              </div>
              <div className="feature-body">
                <h3>Bid trong 200ms</h3>
                <p>Đồng hồ đếm ngược và cập nhật giá tức thì mỗi giây. Bạn luôn biết mình đang đấu với ai.</p>
              </div>
            </article>
            <div className="feature-side">
              <article className="feature-card">
                <div className="feature-body">
                  <h3>Tiền nằm chờ, không nằm mất</h3>
                  <p>Tiền được giữ trong tài khoản trung gian, chỉ chuyển cho người bán sau khi bạn xác nhận đã nhận hàng.</p>
                </div>
              </article>
              <article className="feature-card">
                <div className="feature-body">
                  <h3>Đặt trần, ngủ ngon</h3>
                  <p>Đặt mức giá tối đa một lần. Hệ thống tự động trả giá thay bạn từng bước nhỏ.</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how-section">
        <div className="container">
          <div className="steps">
            <div className="step">
              <span className="step-num">01</span>
              <div className="step-body">
                <h3>Tạo tài khoản</h3><span className="step-micro">Mất 2 phút</span>
                <p>Đăng ký bằng email hoặc số điện thoại trong 2 phút. Xác thực danh tính một lần duy nhất.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-num">02</span>
              <div className="step-body">
                <h3>Tìm sản phẩm</h3><span className="step-micro">Cần CCCD</span>
                <p>Duyệt các phiên đấu giá đang diễn ra, lọc theo ngành hàng và theo dõi món đồ bạn quan tâm.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-num">03</span>
              <div className="step-body">
                <h3>Đặt giá &amp; thanh toán</h3><span className="step-micro">Tiền giữ 24h</span>
                <p>Tham gia đấu giá và chiến thắng. Thanh toán qua escrow, tiền chuyển cho người bán khi hàng đến tay.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews">
        <div className="container">
          <div className="section-head">
            <h2>Người mua và người bán đều tin dùng</h2>
          </div>
          <figure className="quote-card">
            <blockquote className="quote-text">
              "Mình bid con MacBook Pro 14 M3 này hồi tháng 3. Thắng ở 37.2tr. Escrow nhả tiền sau khi mình bấm xác nhận. Trải nghiệm cực kỳ an toàn."
            </blockquote>
            <figcaption className="quote-byline">
              <img className="avatar" src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop" alt="Trần Minh" />
              <div style={{ textAlign: 'left' }}>
                <span className="quote-name">- Trần Minh</span>
                <span className="quote-role">QA Engineer, Đà Nẵng</span>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>
    </main>
  );
}