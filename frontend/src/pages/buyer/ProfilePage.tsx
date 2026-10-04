import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { localDB, type LocalUser } from '../../utils/localDB';

type ProfileTab = 'dounding' | 'dathang' | 'dinding' | 'danhgia';

const profileProducts = [
  { id: '123', code: 'AU-1042', title: 'MacBook Air M4 15 inch 2025', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900', price: '29.900.000đ', bid: '29.900.000đ', status: 'Đang dẫn đầu', statusClass: 'st-lead', specs: ['M4 · 16GB', '512GB SSD', 'Like new 99%'] },
  { id: '124', code: 'AU-1058', title: 'iPhone 16 Pro Max 256GB', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900', price: '28.800.000đ', bid: '28.500.000đ', status: 'Bị vượt', statusClass: 'st-over', specs: ['Titanium đen', '256GB', 'Pin 98%'] },
  { id: '125', code: 'AU-1064', title: 'Samsung Galaxy S25 Ultra 512GB', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900', price: '25.600.000đ', bid: '25.600.000đ', status: 'Đang dẫn đầu', statusClass: 'st-lead', specs: ['Titanium Gray', '512GB', 'Full box'] },
  { id: '126', code: 'AU-1071', title: 'Sony WH-1000XM6', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900', price: '7.800.000đ', bid: '7.600.000đ', status: 'Bị vượt', statusClass: 'st-over', specs: ['Black', 'Chống ồn ANC', 'Mới seal'] },
  { id: '127', code: 'AU-1084', title: 'Canon EOS R50 V Kit 14-30mm', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900', price: '21.400.000đ', bid: '21.400.000đ', status: 'Đang dẫn đầu', statusClass: 'st-lead', specs: ['4K 60p', '24.2MP', 'Mới 100%'] },
  { id: '128', code: 'AU-1089', title: 'iPad Air M3 11 inch Wi‑Fi', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=900', price: '15.900.000đ', bid: '15.700.000đ', status: 'Bị vượt', statusClass: 'st-over', specs: ['Blue', '128GB', 'Full box'] },
  { id: '129', code: 'AU-1096', title: 'Nintendo Switch 2', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=900', price: '13.200.000đ', bid: '13.200.000đ', status: 'Đang dẫn đầu', statusClass: 'st-lead', specs: ['Neon Blue/Red', 'Mới seal', 'Bảo hành 12T'] },
  { id: '130', code: 'AU-1102', title: 'Apple Watch Series 10 GPS 46mm', image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=900', price: '9.200.000đ', bid: '9.000.000đ', status: 'Bị vượt', statusClass: 'st-over', specs: ['Jet Black', 'GPS', 'Mới seal'] },
];

const BUYER_ACTIVE_AUCTIONS = profileProducts.slice(0, 4).map((auction, index) => ({ ...auction, endOffset: [2 * 60 * 60 + 34 * 60 + 12, 42 * 60 + 18, 5 * 60 * 60 + 18 * 60 + 40, 70 * 60 + 8][index] }));

const BUYER_WON_AUCTIONS = Array.from({ length: 12 }, (_, index) => {
  const products = [
    { title: 'MacBook Pro 14 M3 2023', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100', price: '36.500.000đ' },
    { title: 'iPhone 14 Pro', image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100', price: '18.500.000đ' },
    { title: 'iPad Pro M4 11 inch', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100', price: '22.400.000đ' },
  ];
  const product = products[index % products.length];
  return { ...product, orderId: `ORD-${142 - index}`, date: `${18 - index}/09/2026`, pending: index === 0, auctionId: String(123 + index) };
});

const BUYER_REVIEWS = Array.from({ length: 23 }, (_, index) => {
  const ratings = index % 5 === 4 ? 4 : 5;
  const sellers = ['TechStore VN', 'Mobile City', 'Camera House', 'Sound Lab'];
  const messages = ['Người mua uy tín, thanh toán nhanh.', 'Trao đổi rõ ràng, rất dễ làm việc.', 'Đúng hẹn và xác nhận đơn nhanh.', 'Giao dịch suôn sẻ, cảm ơn bạn.'];
  return { id: index + 1, rating: ratings, seller: sellers[index % sellers.length], message: messages[index % messages.length], date: `${String(15 - (index % 14)).padStart(2, '0')}/09/2026`, product: ['MacBook Pro 14 M3 2023', 'iPhone 14 Pro', 'iPad Pro M4'][index % 3] };
});

export default function BuyerProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('dounding');
  const [reviewFilter, setReviewFilter] = useState<'all' | 5 | 4>('all');
  const [watchIds, setWatchIds] = useState<string[]>(() => localDB.getWatchlist());
  const [now, setNow] = useState(() => Date.now());
  const [startedAt] = useState(() => Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  useEffect(() => { const syncWatchlist = () => setWatchIds(localDB.getWatchlist()); window.addEventListener('auctionhub:change', syncWatchlist); return () => window.removeEventListener('auctionhub:change', syncWatchlist); }, []);
  const countdown = (offset: number) => {
    const remaining = Math.max(0, offset - Math.floor((now - startedAt) / 1000));
    const hours = Math.floor(remaining / 3600); const minutes = Math.floor((remaining % 3600) / 60); const seconds = remaining % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };
  const watchedAuctions = watchIds.map((id) => localDB.getAuction(id)).filter((auction): auction is NonNullable<ReturnType<typeof localDB.getAuction>> => Boolean(auction));
  const countdownAt = (endsAt: string) => {
    const remaining = Math.max(0, Math.floor((new Date(endsAt).getTime() - now) / 1000));
    return [Math.floor(remaining / 3600), Math.floor((remaining % 3600) / 60), remaining % 60].map((part) => String(part).padStart(2, '0')).join(':');
  };
  const unwatch = (id: string) => localDB.toggleWatch(id);
  const fallbackUser: LocalUser = localDB.getUser('buyer-demo') ?? { id: 'buyer-demo', email: 'buyer@auctionhub.vn', name: 'Nguyễn Văn A', role: 'buyer', phone: '0901 234 456', city: 'TP.HCM' };
  const [user, setUser] = useState<LocalUser>(() => localDB.getCurrentUser() ?? fallbackUser);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(() => ({ name: user.name, phone: user.phone ?? '', city: user.city ?? 'TP.HCM', avatarUrl: user.avatarUrl ?? '' }));
  const [formError, setFormError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const initials = user.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  const maskedPhone = user.phone ? user.phone.replace(/^(\d{4})\d+(\d{3})$/, '$1 *** $2') : 'Chưa cập nhật';

  const openEdit = () => {
    setForm({ name: user.name, phone: user.phone ?? '', city: user.city ?? 'TP.HCM', avatarUrl: user.avatarUrl ?? '' });
    setFormError(''); setSaveMessage(''); setIsEditing(true);
  };
  const handleSaveProfile = (event: React.FormEvent) => {
    event.preventDefault();
    const phone = form.phone.replace(/\s/g, '');
    if (phone && !/^0\d{9}$/.test(phone)) { setFormError('Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.'); return; }
    if (form.avatarUrl && !/^https?:\/\//i.test(form.avatarUrl)) { setFormError('Ảnh đại diện phải là một đường dẫn http hoặc https hợp lệ.'); return; }
    const result = localDB.getCurrentUser()
      ? localDB.updateCurrentUser({ name: form.name, phone, city: form.city, avatarUrl: form.avatarUrl.trim() })
      : { success: true, user: { ...user, name: form.name.trim(), phone, city: form.city, avatarUrl: form.avatarUrl.trim() } };
    if (!result.success || !result.user) { setFormError(result.message ?? 'Không thể lưu hồ sơ.'); return; }
    setUser(result.user); setIsEditing(false); setSaveMessage('Đã cập nhật hồ sơ thành công.');
  };

  return (
    <main id="main">
      <div className="container">
        <nav className="crumbs" aria-label="Chuỗi điều hướng">
          <Link to="/">Trang chủ</Link>
          <span className="sep" aria-hidden="true">/</span>
          <span>Hồ sơ</span>
        </nav>

        {/* ═══ PROFILE HEADER ═══ */}
        {saveMessage && <div className="profile-save-notice" role="status">{saveMessage}</div>}
        <section className="profile-section" aria-label={`Hồ sơ của ${user.name}`}>
          <div className="profile-head">
            <span className="avatar-wrap">
              <span className="avatar-profile" aria-hidden="true" style={user.avatarUrl ? { backgroundImage: `url(${user.avatarUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent' } : undefined}>{initials}</span>
              <button type="button" className="avatar-edit" aria-label="Đổi ảnh đại diện" onClick={openEdit}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 14, height: 14 }}>
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </button>
            </span>

            <div className="profile-id">
              <div className="profile-name">
                <h1>{user.name}</h1>
                <span className="verified-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 12, height: 12 }}>
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Đã xác minh CCCD
                </span>
              </div>
              <a className="rating-link" href="#danhgia" onClick={() => setActiveTab('danhgia')} aria-label={`Xem ${BUYER_REVIEWS.length} đánh giá`}>
                <span aria-hidden="true">4.8</span>
                <span className="tnum" aria-hidden="true">★</span>
                <span>({BUYER_REVIEWS.length} đánh giá)</span>
              </a>
              
              <ul className="profile-facts">
                <li>
                  <svg style={{ width: 15, height: 15, flexShrink: 0, color: 'var(--muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-10 5L2 7" />
                  </svg>
                  <span style={{ whiteSpace: 'nowrap' }}>{user.email}</span>
                  <span className="verify-tag">
                    <svg style={{ width: 10, height: 10 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> 
                    Đã xác minh
                  </span>
                </li>
                <li>
                  <svg style={{ width: 15, height: 15, flexShrink: 0, color: 'var(--muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
                  </svg>
                  <span style={{ whiteSpace: 'nowrap' }}>{maskedPhone}</span>
                  <span className="verify-tag">
                    <svg style={{ width: 10, height: 10 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> 
                    Đã xác minh
                  </span>
                </li>
                <li>
                  <svg style={{ width: 15, height: 15, flexShrink: 0, color: 'var(--muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  <span style={{ whiteSpace: 'nowrap' }}>Thành viên từ Tháng 3, 2026</span>
                </li>
              </ul>
            </div>

            <div className="profile-actions">
              <button className="btn btn-ghost" type="button" onClick={openEdit}>Chỉnh sửa hồ sơ</button>
            </div>
          </div>
        </section>

        {isEditing && (
          <div className="profile-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsEditing(false); }}>
            <section className="profile-edit-modal" role="dialog" aria-modal="true" aria-labelledby="profile-edit-title">
              <div className="profile-edit-head"><div><h2 id="profile-edit-title">Chỉnh sửa hồ sơ</h2><p>Email tài khoản không thể thay đổi.</p></div><button type="button" aria-label="Đóng" onClick={() => setIsEditing(false)}>×</button></div>
              <form onSubmit={handleSaveProfile} className="profile-edit-form">
                <label>Họ và tên<input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required minLength={2} /></label>
                <label>Email<input value={user.email} disabled /></label>
                <label>Số điện thoại<input value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} inputMode="tel" placeholder="0901234567" /></label>
                <label>Khu vực<select value={form.city} onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}><option>TP.HCM</option><option>Hà Nội</option><option>Đà Nẵng</option><option>Cần Thơ</option><option>Hải Phòng</option></select></label>
                <label className="profile-edit-wide">URL ảnh đại diện<input value={form.avatarUrl} onChange={(e) => setForm((prev) => ({ ...prev, avatarUrl: e.target.value }))} type="url" placeholder="https://..." /></label>
                {formError && <p className="form-error profile-edit-wide" role="alert">{formError}</p>}
                <div className="profile-edit-actions profile-edit-wide"><button type="button" className="btn btn-ghost" onClick={() => setIsEditing(false)}>Hủy</button><button type="submit" className="btn btn-primary">Lưu thay đổi</button></div>
              </form>
            </section>
          </div>
        )}

        {/* ═══ TABS ═══ */}
        <div className="tabs" role="tablist">
          <button type="button" role="tab" aria-selected={activeTab === 'dounding'} onClick={() => setActiveTab('dounding')}>Đang đấu giá<span className="tcount">{BUYER_ACTIVE_AUCTIONS.length}</span></button>
          <button type="button" role="tab" aria-selected={activeTab === 'dathang'} onClick={() => setActiveTab('dathang')}>Đã thắng<span className="tcount">{BUYER_WON_AUCTIONS.length}</span></button>
          <button type="button" role="tab" aria-selected={activeTab === 'dinding'} onClick={() => setActiveTab('dinding')}>Đang theo dõi<span className="tcount">{watchedAuctions.length}</span></button>
          <button type="button" role="tab" aria-selected={activeTab === 'danhgia'} onClick={() => setActiveTab('danhgia')}>Đánh giá<span className="tcount">{BUYER_REVIEWS.length}</span></button>
        </div>

        {/* ═══ PANEL: ĐANG ĐẤU GIÁ ═══ */}
        {activeTab === 'dounding' && (
          <section className="tab-panel">
            <p className="tab-note">{BUYER_ACTIVE_AUCTIONS.length} phiên đang nhận giá. Bấm vào tên sản phẩm để xem chi tiết.</p>
            <div className="profile-product-grid">{BUYER_ACTIVE_AUCTIONS.map((auction) => <article className="profile-product-card" key={auction.code}><Link className="profile-product-media" to={`/auctions/${auction.id}`}><img src={auction.image} alt={auction.title} />{auction.statusClass === 'st-over' && <span className="profile-product-badge">Sắp kết thúc</span>}</Link><div className="profile-product-body"><Link className="profile-product-title" to={`/auctions/${auction.id}`}>{auction.title}</Link><p className="profile-product-code">#{auction.code}</p><div className="profile-product-specs">{auction.specs.map((spec) => <span key={spec}>{spec}</span>)}</div><div className="profile-product-price"><span>Giá hiện tại</span><strong>{auction.price}</strong></div><div className="profile-product-foot"><span className={`status ${auction.statusClass}`}><span className="dot"></span>{auction.status}</span><span className={`countdown ${auction.statusClass === 'st-over' ? 'urgent' : ''}`}>{countdown(auction.endOffset)}</span></div><p className="profile-product-bid">Giá bạn đặt: <strong>{auction.bid}</strong></p></div></article>)}</div>
          </section>
        )}

        {/* ═══ PANEL: ĐÃ THẮNG ═══ */}
        {activeTab === 'dathang' && (
          <section className="tab-panel">
            <p className="tab-note">{BUYER_WON_AUCTIONS.length} đơn đã thắng.</p>
            <ul className="won-list">{BUYER_WON_AUCTIONS.map((auction) => <li className="won-row" key={auction.orderId}><img className="won-thumb" src={auction.image} alt="" /><span className="won-info"><span className="won-title">{auction.title}</span><span className="won-meta">Mã đơn #{auction.orderId} · Thắng {auction.date}</span></span><span className="won-right"><span className="won-price tnum">{auction.price}</span><span className="won-line">{auction.pending ? <><span className="status st-pay"><span className="dot"></span>Chờ thanh toán</span><Link to={`/checkout/${auction.auctionId}`} className="link-btn">Thanh toán</Link></> : <><span className="pay-note">Đã thanh toán</span><span className="status st-ship"><span className="dot"></span>Đang giao</span><Link to={`/orders/${auction.orderId}`} className="link-btn">Xem đơn</Link></>}</span></span></li>)}</ul>
          </section>
        )}

        {/* ═══ PANEL: ĐANG THEO DÕI (Grid view) ═══ */}
        {activeTab === 'dinding' && (
          <section className="tab-panel">
            <p className="tab-note">{watchedAuctions.length} phiên bạn đang theo dõi. Bạn sẽ nhận thông báo 30 phút trước khi phiên kết thúc.</p>
            <div className="profile-product-grid">{watchedAuctions.map((auction) => <article className="profile-product-card" key={auction.id}>
                <button type="button" className="watch-heart" aria-pressed="true" aria-label={`Bỏ theo dõi ${auction.title}`} onClick={() => unwatch(auction.id)}>
                  <svg className="ic-heart" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ width: 16, height: 16 }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" /></svg>
                  <svg className="ic-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{ width: 16, height: 16 }}><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
                <Link className="profile-product-media" to={`/auctions/${auction.id}`}>
                  <img src={auction.image} alt={auction.title} />
                  {new Date(auction.endsAt).getTime() - now < 86400000 && <span className="profile-product-badge">Sắp kết thúc</span>}
                </Link>
                <div className="profile-product-body">
                  <Link className="profile-product-title" to={`/auctions/${auction.id}`}>{auction.title}</Link>
                  <p className="profile-product-code">#{auction.id.toUpperCase()}</p>
                  <div className="profile-product-specs">{auction.highlights.slice(0, 3).map((spec) => <span key={spec}>{spec}</span>)}</div>
                  <div className="profile-product-price"><span>Giá hiện tại</span><strong>{auction.currentPrice.toLocaleString('vi-VN')}đ</strong></div>
                  <div className="profile-product-foot"><span className="status st-lead"><span className="dot"></span>Đang theo dõi</span><span className={`countdown ${new Date(auction.endsAt).getTime() - now < 86400000 ? 'urgent' : ''}`}>{countdownAt(auction.endsAt)}</span></div>
                  <button className="follow-toggle" type="button" aria-pressed="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15, flexShrink: 0, color: 'var(--muted)' }}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                    <span>Thông báo khi sắp kết thúc</span>
                    <span className="switch" aria-hidden="true"></span>
                  </button>
                </div>
              </article>)}</div>
          </section>
        )}

        {/* ═══ PANEL: ĐÁNH GIÁ ═══ */}
        {activeTab === 'danhgia' && (
          <section className="tab-panel">
            <div className="chips" role="group">
              <button type="button" aria-pressed={reviewFilter === 'all'} onClick={() => setReviewFilter('all')}>Tất cả</button>
              <button type="button" aria-pressed={reviewFilter === 5} onClick={() => setReviewFilter(5)}>5★</button>
              <button type="button" aria-pressed={reviewFilter === 4} onClick={() => setReviewFilter(4)}>4★</button>
            </div>
            <div className="review-list">{BUYER_REVIEWS.filter((review) => reviewFilter === 'all' || review.rating === reviewFilter).map((review) => <article className="review-card" key={review.id}><div className="review-head"><span className="review-avatar">{review.seller.slice(0, 2).toUpperCase()}</span><span className="review-by"><span className="review-name">{review.seller}</span><span className="review-meta">{review.date} · Phiên “{review.product}”</span></span><span className="review-stars">{Array.from({ length: 5 }, (_, index) => <span key={index} className={index < review.rating ? 'r5' : ''}>★</span>)}</span></div><p className="review-text">“{review.message}”</p></article>)}</div>
          </section>
        )}
      </div>
    </main>
  );
}
