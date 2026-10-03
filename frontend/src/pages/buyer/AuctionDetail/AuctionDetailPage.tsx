import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { localDB, LocalUser } from '../../../utils/localDB';

// ── 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU ĐỂ FIX LỖI "ANY" ──
interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface ProductData {
  id: string;
  title: string;
  price: number;
  views: number;
  bids: number;
  timeLeft: number;
  desc: string[];
  images: ProductImage[];
}

interface BidRecord {
  id: number;
  name: string;
  price: number;
  time: string;
  isAuto: boolean;
  cancelled: boolean;
  isHighest: boolean;
}

// ── 2. DỮ LIỆU MOCK ĐƯỢC CẬP NHẬT PHIÊN BẢN MỚI NHẤT VÀ ĐẦY ĐỦ 4 ẢNH THẬT ──
const MOCK_DB: Record<string, ProductData> = {
  '1': {
    id: '1',
    title: 'MacBook Pro 14 M5 2026',
    price: 38500000,
    views: 428,
    bids: 23,
    timeLeft: 9252,
    desc: [
      'Màn hình Liquid Retina XDR 14,2 inch, độ sáng tối đa 1.800 nit, hỗ trợ HDR và ProMotion 120Hz.',
      'Chip Apple M5 với 10 nhân CPU và 14 nhân GPU, 24 GB RAM hợp nhất, ổ cứng SSD 1 TB siêu tốc.',
      'Pin lên đến 24 giờ xem phim, sạc nhanh qua cổng MagSafe 3 kèm củ sạc 70W.',
      'Wi-Fi 7, Bluetooth 5.4, ba cổng Thunderbolt/USB 4, cổng HDMI 2.1 và khe cắm thẻ SDXC.'
    ],
    images: [
      { src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80", alt: "MacBook Pro M5 trên bàn làm việc", width: 800, height: 800 },
      { src: "https://images.unsplash.com/photo-1537498425277-c283d32ef9db?w=800&q=80", alt: "MacBook Pro nhìn từ trên xuống", width: 800, height: 800 },
      { src: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80", alt: "Cạnh nghiêng MacBook Pro", width: 800, height: 800 },
      { src: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80", alt: "Màn hình và bàn phím", width: 800, height: 800 }
    ]
  },
  '2': {
    id: '2',
    title: 'iPhone 18 Pro Max 256GB',
    price: 29800000,
    views: 842,
    bids: 35,
    timeLeft: 2538,
    desc: [
      'Khung Titan Grade 5 siêu việt, thiết kế mỏng nhẹ hơn 15%.',
      'Chip A20 Bionic mạnh mẽ nhất với công nghệ NPU xử lý AI tạo sinh tức thì.',
      'Hệ thống camera 48MP thế hệ mới với khả năng zoom quang học linh hoạt 10x.',
      'Màn hình viền siêu mỏng, tần số quét 1-120Hz tiết kiệm pin vượt trội.'
    ],
    images: [
      { src: "https://cdn2.fptshop.com.vn/unsafe/512x0/filters:format(webp):quality(75)/iphone_18_pro_max_den_7_96f1a1ebbe.jpg", alt: "iPhone 18 Pro Max mặt trước và sau", width: 800, height: 800 },
      { src: "https://cdn2.fptshop.com.vn/unsafe/800x0/khung_titan_5_cb1568721c.jpg", alt: "Cụm camera iPhone 18", width: 800, height: 800 },
      { src: "https://static-images.vnncdn.net/vps_images_publish/000001/000003/2026/5/27/iphone-18-pro-max-se-dung-khung-nhom-hay-titan-2963.png?width=1200&s=kXQCcBUC86_WAUQyByCjlw", alt: "Khung viền Titan", width: 800, height: 800 },
      { src: "https://images2.thanhnien.vn/528068263637045248/2026/1/3/iphone-18-1767406067623415817992.png", alt: "Cạnh dưới cổng sạc USB-C", width: 800, height: 800 }
    ]
  },
  '3': {
    id: '3',
    title: 'iPad Pro 11 M5 256GB',
    price: 22500000,
    views: 312,
    bids: 18,
    timeLeft: 25865,
    desc: [
      'Màn hình Tandem OLED hiển thị màu sắc sống động và độ tương phản tuyệt đối.',
      'Sức mạnh từ chip Apple M5 biến thiết bị thành cỗ máy đồ họa di động.',
      'Thiết kế siêu mỏng chưa từng có của Apple, độ dày chỉ 5.1mm.',
      'Tương thích hoàn hảo với Apple Pencil Pro thế hệ mới có phản hồi xúc giác.'
    ],
    images: [
      { src: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80", alt: "iPad Pro M5 kèm bút Pencil", width: 800, height: 800 },
      { src: "https://images.unsplash.com/photo-1589739900243-4b52cb5b138c?w=800&q=80", alt: "Màn hình OLED iPad", width: 800, height: 800 },
      { src: "https://images.unsplash.com/photo-1588702545922-b5e0c8bdf9b7?w=800&q=80", alt: "Chi tiết màn hình", width: 800, height: 800 },
      { src: "https://images.unsplash.com/photo-1606822295669-e0921a221fcd?w=800&q=80", alt: "Mặt lưng và Camera iPad", width: 800, height: 800 }
    ]
  },
  '4': {
    id: '4',
    title: 'AirPods Max 2 2026',
    price: 7900000,
    views: 156,
    bids: 12,
    timeLeft: 10820,
    desc: [
      'Chip H3 tăng cường xử lý âm thanh không gian (Spatial Audio) vượt trội.',
      'Khung viền được làm từ chất liệu nhẹ mới giúp đeo êm ái suốt cả ngày.',
      'Thời lượng pin lên tới 30 giờ nghe nhạc liên tục khi bật chống ồn (ANC).',
      'Công nghệ sạc siêu nhanh qua cổng USB-C, 5 phút sạc nghe 3 giờ.'
    ],
    images: [
      { src: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80", alt: "AirPods Max 2 Đỏ nhạt", width: 800, height: 800 },
      { src: "https://images.unsplash.com/photo-1628202926206-c63a34b1618f?w=800&q=80", alt: "AirPods Max 2 Trắng bạc", width: 800, height: 800 },
      { src: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc2?w=800&q=80", alt: "Chi tiết đệm tai nghe", width: 800, height: 800 },
      { src: "https://images.unsplash.com/photo-1599669454699-248893623440?w=800&q=80", alt: "Sử dụng thực tế", width: 800, height: 800 }
    ]
  }
};

// ── 3. WRAPPER COMPONENT (CHÌA KHÓA FIX CASCADING RENDER) ──
export function AuctionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const activeId = id && MOCK_DB[id] ? id : '1';
  
  // Khi `key` thay đổi, React sẽ dọn dẹp Component cũ và khởi tạo Component mới tinh.
  // Qua đó reset toàn bộ `useState` mà không cần dùng `useEffect`, xóa bỏ 100% lỗi linter.
  return <AuctionDetailContent key={activeId} id={activeId} />;
}

// ── 4. COMPONENT NỘI DUNG CHÍNH ──
function AuctionDetailContent({ id }: { id: string }) {
  const [currentUser] = useState<LocalUser | null>(() => localDB.getCurrentUser());
  const productData = MOCK_DB[id];
  const STEP = 500000;

  // Khởi tạo trạng thái gốc
  const [timeLeft, setTimeLeft] = useState<number>(productData.timeLeft);
  const [currentBid, setCurrentBid] = useState<number>(productData.price);
  const [bidInput, setBidInput] = useState<string>((productData.price + STEP).toString());
  const [bidCount, setBidCount] = useState<number>(productData.bids);
  const [bidError, setBidError] = useState<string>("");
  const [isLeading, setIsLeading] = useState<boolean>(false);
  
  const [autoBidOn, setAutoBidOn] = useState<boolean>(false);
  const [autoBidMax, setAutoBidMax] = useState<string>((productData.price + STEP * 3).toString());
  const [historyVisible, setHistoryVisible] = useState<number>(5);
  
  const [activeThumb, setActiveThumb] = useState<ProductImage>(productData.images[0]);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const isEnded = timeLeft <= 0;

  // Cuộn trang khi render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Đếm ngược an toàn không dependency
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (v: number) => (v < 10 ? "0" : "") + v;
  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  const formatVND = (n: number) => n.toLocaleString("vi-VN").replace(/[.,](\d{3})/g, (m, g) => "." + g) + "đ";

  const handleBidInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    setBidInput(digits);
    setBidError("");
  };

  const adjustBid = (amount: number) => {
    const val = parseInt(bidInput || "0", 10);
    const next = isNaN(val) ? currentBid + STEP : Math.max(currentBid + STEP, val + amount);
    setBidInput(next.toString());
    setBidError("");
  };

  // Mảng Lịch sử Mặc định
  const [historyList, setHistoryList] = useState<BidRecord[]>([
    { id: 1, name: "Người dùng ẩn danh", price: productData.price, time: "12 phút trước", isAuto: false, cancelled: false, isHighest: true },
    { id: 2, name: "Người dùng ẩn danh", price: productData.price - STEP, time: "22 phút trước", isAuto: false, cancelled: false, isHighest: false },
    { id: 3, name: "Người dùng ẩn danh", price: productData.price - STEP * 2, time: "28 phút trước", isAuto: false, cancelled: false, isHighest: false },
  ]);

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEnded) return;
    if (!currentUser) { setBidError("Vui lòng đăng nhập để đặt giá."); return; }

    const val = parseInt(bidInput, 10);
    const minBid = currentBid + STEP;

    if (isNaN(val)) { setBidError(`Nhập số tiền, ví dụ ${formatVND(minBid)}.`); return; }
    if (val < minBid) { setBidError(`Giá tối thiểu hiện tại là ${formatVND(minBid)}.`); return; }
    if ((val - minBid) % STEP !== 0) { setBidError(`Giá trả phải là bội số của ${formatVND(STEP)}.`); return; }

    setCurrentBid(val);
    setBidCount((prev: number) => prev + 1);
    setIsLeading(true);
    setBidError("");
    setBidInput((val + STEP).toString());

    const newRecord: BidRecord = { 
      id: Date.now(), name: `${currentUser.name} (Bạn)`, price: val, time: "vừa xong", isAuto: false, cancelled: false, isHighest: true 
    };
    setHistoryList((prev: BidRecord[]) => [newRecord, ...prev.map(p => ({ ...p, isHighest: false }))]);
  };

  // Mảng Gợi ý Sản phẩm (bỏ qua id hiện tại)
  const similarProducts = [
    MOCK_DB['2'], MOCK_DB['3'], MOCK_DB['4'], MOCK_DB['1']
  ].filter(p => p.id !== id).slice(0, 4);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isLightboxOpen) setIsLightboxOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen]);

  return (
    <main id="main" style={{ paddingBottom: '64px' }}>
      <div className="container">
        <nav className="crumbs" aria-label="Chuỗi điều hướng" style={{ paddingBlock: '24px' }}>
          <Link to="/">Trang chủ</Link>
          <span className="sep" aria-hidden="true">/</span>
          <Link to="/search">Phiên đấu giá</Link>
          <span className="sep" aria-hidden="true">/</span>
          <span style={{ color: 'var(--fg)' }}>{productData.title}</span>
        </nav>
        
        <div className="page">
          {/* ÉP KÍCH THƯỚC LƯỚI ĐỂ SIDEBAR CỐ ĐỊNH HOÀN HẢO */}
          <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 420px', gap: '32px', alignItems: 'flex-start' }}>
            
            {/* ═══ CỘT TRÁI (TUÂN THỦ GỐC: GALLERY -> ITEM INFO -> DESC) ═══ */}
            <div className="col-left" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              <section className="gallery" id="gallery" aria-label="Thư viện ảnh sản phẩm">
                <figure className="gallery-main" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', margin: 0 }}>
                  <img id="main-image" src={activeThumb.src} alt={activeThumb.alt} width="800" height="800" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
                </figure>
                <div className="gallery-actions" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                  <span className="gallery-meta tnum" style={{ fontSize: '14px', color: 'var(--muted)' }}>4 ảnh thật của sản phẩm</span>
                  <button className="gallery-link" id="lightbox-open" type="button" onClick={() => setIsLightboxOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                    <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.5-3.5a2 2 0 0 0-2.8 0L6 20" />
                    </svg>
                    Xem tất cả ảnh
                  </button>
                </div>
                <ul className="gallery-thumbs" aria-label="Chọn ảnh" style={{ display: 'flex', gap: '12px', listStyle: 'none', padding: 0, marginTop: '8px' }}>
                  {productData.images.map((t: ProductImage, idx: number) => (
                    <li className="thumb-wrap" key={idx}>
                      <button 
                        className={`gallery-thumb ${activeThumb.src === t.src ? 'is-active' : ''}`} 
                        type="button" 
                        onClick={() => setActiveThumb(t)}
                        aria-pressed={activeThumb.src === t.src}
                        style={{ width: '80px', height: '60px', padding: 0, border: activeThumb.src === t.src ? '2px solid var(--accent)' : '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer' }}
                      >
                        <img src={t.src} alt={t.alt} width={t.width} height={t.height} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="item-info" aria-labelledby="item-title">
                <h1 className="item-title" id="item-title" style={{ fontSize: '32px', marginBottom: '16px', lineHeight: 1.2 }}>
                  {productData.title}
                </h1>
                
                <ul className="item-facts" style={{ display: 'flex', alignItems: 'center', gap: '16px', listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', color: 'var(--fg-2)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="cond-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 10px', background: 'var(--surface-warm)', border: '1px solid var(--border)', borderRadius: '999px', fontWeight: 500, color: 'var(--fg)' }}>
                      <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                      Like New
                    </span>
                    <span className="body-meta">98% pin</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg style={{ width: 16, height: 16, color: 'var(--muted)', flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                    Quận 1, TP.HCM
                  </li>
                  <li className="body-meta tnum" style={{ display: 'flex', alignItems: 'center' }}>
                    {bidCount} lượt trả giá · {productData.views} lượt xem
                  </li>
                </ul>
              </section>

              <section className="block desc" aria-labelledby="desc-title">
                <h2 id="desc-title" style={{ fontSize: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px' }}>Mô tả sản phẩm</h2>
                <ul className="desc-list" style={{ paddingLeft: '20px', color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: '24px' }}>
                  {productData.desc.map((line: string, i: number) => (
                    <li key={i} style={{ marginBottom: '6px' }}>{line}</li>
                  ))}
                </ul>
                <h3 style={{ fontSize: '16px', margin: '20px 0 12px 0' }}>Tình trạng</h3>
                <ul className="desc-list" style={{ paddingLeft: '20px', color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: '24px' }}>
                  <li style={{ marginBottom: '6px' }}>Máy Like New, pin hoàn hảo, không trầy xước, không móp méo.</li>
                  <li style={{ marginBottom: '6px' }}>Sản phẩm nguyên bản, chưa qua sửa chữa hay thay thế linh kiện.</li>
                  <li style={{ marginBottom: '6px' }}>Còn bảo hành Apple Care dài hạn.</li>
                </ul>
                <h3 style={{ fontSize: '16px', margin: '20px 0 12px 0' }}>Phụ kiện kèm theo</h3>
                <ul className="desc-list" style={{ paddingLeft: '20px', color: 'var(--fg-2)', lineHeight: 1.6 }}>
                  <li style={{ marginBottom: '6px' }}>Hộp nguyên bản, cáp sạc và củ sạc nhanh chính hãng.</li>
                  <li style={{ marginBottom: '6px' }}>Hóa đơn mua hàng và đầy đủ sách hướng dẫn.</li>
                </ul>
              </section>

              <section className="seller-outer" aria-label="Thông tin người bán" style={{ padding: '24px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--surface-warm)', marginBottom: '32px' }}>
                <div className="seller-row" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <span className="avatar-lg" aria-hidden="true" style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 600 }}>TS</span>
                  <div className="seller-id" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span className="seller-name" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '18px' }}>
                      TechStore VN
                      <span className="verified-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--blue-text)', background: 'var(--blue-bg)', padding: '2px 8px', borderRadius: '4px' }}>
                        <svg style={{ width: 12, height: 12 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                        Verified
                      </span>
                    </span>
                    <span className="seller-meta" style={{ fontSize: '14px', color: 'var(--muted)' }}>
                      <span aria-hidden="true">4.8</span> <span className="tnum">★</span> <span>· 1.240 đánh giá</span>
                    </span>
                  </div>
                </div>
                
                <ul className="seller-facts" style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', display: 'flex', gap: '20px', fontSize: '14px', color: 'var(--fg-2)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg style={{ width: 16, height: 16, color: 'var(--muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6a8.5 8.5 0 1 1 16.1-3.9Z" /></svg>
                    Phản hồi trong 15 phút
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg style={{ width: 16, height: 16, color: 'var(--muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                    Thành viên từ 2022
                  </li>
                </ul>
                <Link className="btn btn-ghost" to="/seller-profile" style={{ padding: '8px 16px', border: '1px solid var(--border)', borderRadius: '6px', textDecoration: 'none', color: 'var(--fg)', fontSize: '14px', fontWeight: 500 }}>Xem profile</Link>
              </section>

              <section className="similar" id="similar" aria-labelledby="similar-title">
                <div className="block-head" style={{ marginBottom: '24px' }}>
                  <h2 id="similar-title" style={{ fontSize: '20px', margin: '0 0 4px 0' }}>Có thể bạn quan tâm</h2>
                  <p className="body-meta" style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>Các phiên đấu giá thiết bị công nghệ đang diễn ra.</p>
                </div>
                <div className="similar-rail" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                  {similarProducts.map((prod) => (
                    <article className="similar-card demo-card" key={prod.id} style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                      <div className="media">
                        <img src={prod.images[0].src} alt={prod.title} width="600" height="400" loading="lazy" style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />
                      </div>
                      <div className="similar-body" style={{ padding: '16px' }}>
                        <h3 className="card-title" style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 12px 0' }}>{prod.title}</h3>
                        <div className="similar-price-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                          <span className="similar-price tnum" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--fg)' }}>{formatVND(prod.price)}</span>
                        </div>
                        <Link className="btn btn-ghost" to={`/auction/${prod.id}`} style={{ display: 'block', textAlign: 'center', width: '100%', padding: '10px 0', border: '1px solid var(--border)', borderRadius: '6px', textDecoration: 'none', color: 'var(--fg)', fontSize: '14px', fontWeight: 500 }}>
                          Đặt giá
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            {/* ═══ RIGHT COLUMN (SIDEBAR CỐ ĐỊNH) ═══ */}
            <aside className="col-right" aria-label="Bảng điều khiển đấu giá" style={{ position: 'sticky', top: '100px', alignSelf: 'flex-start', height: 'max-content' }}>
              <div className="bid-panel" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--elev-soft)' }}>
                
                {!isEnded ? (
                  <div className="panel-countdown" style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="label" style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '4px' }}>Kết thúc sau</span>
                    <span className={`timer ${timeLeft < 3600 ? 'is-urgent' : ''}`} id="timer" style={{ fontSize: '36px', fontWeight: 600, lineHeight: 1, marginBottom: '8px' }}>
                      {pad(h)}:{pad(m)}:{pad(s)}
                    </span>
                    <span className="panel-meta tnum" style={{ fontSize: '14px', color: 'var(--muted)' }}>
                      Đã có <strong id="bid-count" style={{ color: 'var(--fg)' }}>{bidCount}</strong> lượt trả giá
                    </span>
                    {!isLeading && (
                      <span className="outbid-badge" id="outbid-badge" aria-label="Bạn đã bị vượt giá" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--danger-bg)', color: 'var(--danger-text)', padding: '4px 12px', borderRadius: '99px', fontSize: '13px', fontWeight: 500, marginTop: '12px', width: 'max-content' }}>
                        <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 9v4M12 17h.01" /><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>
                        Bị vượt giá
                      </span>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="panel-status" style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="label" style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '4px' }}>Trạng thái</span>
                      <span className="status-chip" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--surface-warm)', border: '1px solid var(--border)', padding: '4px 12px', borderRadius: '99px', fontSize: '14px', fontWeight: 500, width: 'max-content', marginBottom: '8px' }}><span className="chip-dot" aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--muted)' }} />Đã kết thúc</span>
                      <span className="panel-meta tnum" style={{ fontSize: '13px', color: 'var(--muted)' }}>Kết thúc lúc 12:46 hôm nay · {bidCount} lượt trả giá</span>
                    </div>
                    <div className="ended-banner" role="status" style={{ background: 'var(--surface-warm)', padding: '16px', borderRadius: '8px', display: 'flex', gap: '12px', marginTop: '16px' }}>
                      <svg style={{ color: 'var(--success)', width: 24, height: 24, flex: 'none' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                      <div className="ended-banner-text">
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--fg-2)', lineHeight: 1.5 }}>
                          Phiên đã kết thúc. Người thắng: <strong style={{ color: 'var(--fg)' }}>{historyList[0].name.split(' (')[0]}</strong>, <strong className="tnum" style={{ color: 'var(--fg)' }}>{formatVND(currentBid)}</strong>.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                <hr className="divider" style={{ border: 0, borderTop: '1px solid var(--border)', margin: '24px 0' }} />
                
                <div className="price-hero" style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="label" style={{ fontSize: '13px', color: 'var(--muted)' }}>{isEnded ? "Giá trúng đấu giá" : "Giá hiện tại"}</span>
                  <span className="price-big" id="current-price" style={{ fontSize: '36px', fontWeight: 600, color: 'var(--fg)', margin: '4px 0' }}>{formatVND(currentBid)}</span>
                  <span className="price-start tnum" style={{ fontSize: '13px', color: 'var(--muted)' }}>Giá khởi điểm {formatVND(productData.price - STEP * 5)} · Bước giá {formatVND(STEP)}</span>
                </div>
                
                <hr className="divider" style={{ border: 0, borderTop: '1px solid var(--border)', margin: '24px 0' }} />

                <form className="bid-form" id="bid-form" noValidate onSubmit={handleBidSubmit}>
                  <div className="od-stack" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className="field-label" htmlFor="bid-input" style={{ fontSize: '14px', fontWeight: 500 }}>Giá trả mới</label>
                    <div className="stepper" style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '6px', height: '48px', overflow: 'hidden' }}>
                      <button className="stepper-btn" id="bid-minus" type="button" aria-label="Giảm giá" disabled={isEnded} onClick={() => adjustBid(-STEP)} style={{ width: '48px', background: 'var(--surface-warm)', border: 'none', fontSize: '20px', cursor: isEnded ? 'not-allowed' : 'pointer' }}>−</button>
                      <input 
                        className="bid-input tnum" 
                        id="bid-input" 
                        type="text" 
                        inputMode="numeric" 
                        autoComplete="off" 
                        value={parseInt(bidInput || '0', 10).toLocaleString('vi-VN')}
                        onChange={handleBidInputChange}
                        disabled={isEnded}
                        title={isEnded ? "Phiên đã kết thúc" : ""}
                        style={{ flex: 1, border: 'none', textAlign: 'center', fontSize: '18px', fontWeight: 600, outline: 'none' }}
                      />
                      <button className="stepper-btn" id="bid-plus" type="button" aria-label="Tăng giá" disabled={isEnded} onClick={() => adjustBid(STEP)} style={{ width: '48px', background: 'var(--surface-warm)', border: 'none', fontSize: '20px', cursor: isEnded ? 'not-allowed' : 'pointer' }}>+</button>
                    </div>
                    <p className="bid-hint" id={isEnded ? "bid-ended-hint" : "bid-hint"} style={{ fontSize: '13px', color: 'var(--muted)', margin: 0, lineHeight: 1.4 }}>
                      {isEnded ? "Phiên đã kết thúc. Không thể đặt giá." : "Bước giá 500k. Hệ thống chặn bid cùng mili-giây — không có chuyện 2 người thắng."}
                    </p>
                    {!isEnded && bidError && <p className="bid-error" id="bid-error" role="alert" style={{ fontSize: '13px', color: 'var(--danger-text)', margin: 0 }}>{bidError}</p>}
                  </div>
                  
                  <button className="btn btn-primary btn-callout" id="bid-submit" type="submit" disabled={isEnded} title={isEnded ? "Phiên đã kết thúc" : ""} style={{ width: '100%', height: '48px', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '16px' }}>
                    Đặt giá
                    {isEnded ? (
                      <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    ) : (
                      <span aria-hidden="true">→</span>
                    )}
                  </button>

                  <div className={`bid-success ${isLeading && !isEnded ? 'open' : ''}`} id="bid-success" role="status" style={{ display: isLeading && !isEnded ? 'flex' : 'none', alignItems: 'center', gap: '8px', background: 'var(--success-bg)', color: 'var(--success-text)', padding: '12px', borderRadius: '6px', fontSize: '13px', marginTop: '16px' }}>
                    <svg style={{ width: 16, height: 16, flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                    <span>Bạn đang dẫn đầu phiên. Escrow sẽ giữ tiền đến khi nhận hàng.</span>
                  </div>

                  <div className="auto-field">
                    <div className="switch-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-sky)', padding: '12px 16px', borderRadius: '6px', marginTop: '20px' }}>
                      <label className="switch-label" htmlFor="auto-toggle" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--blue-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3" /></svg>
                        Đặt giá tối đa (Auto-bid)
                      </label>
                      <button 
                        className="switch" 
                        id="auto-toggle" 
                        type="button" 
                        role="switch" 
                        aria-checked={autoBidOn}
                        onClick={() => !isEnded && setAutoBidOn(!autoBidOn)}
                        disabled={isEnded}
                        style={{ width: '40px', height: '24px', borderRadius: '999px', background: autoBidOn ? 'var(--accent)' : 'var(--border)', border: 0, position: 'relative', cursor: isEnded ? 'not-allowed' : 'pointer', transition: '0.2s' }}
                      >
                        <span className="knob" aria-hidden="true" style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px', transition: '0.2s', transform: autoBidOn ? 'translateX(16px)' : 'none' }} />
                      </button>
                    </div>
                    {!isEnded && (
                      <div className="auto-body" id="auto-body" hidden={!autoBidOn} style={{ marginTop: '16px' }}>
                        <label className="field-label" htmlFor="auto-input" style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Giá tối đa bạn chấp nhận</label>
                        <input 
                          className="tnum bid-input" 
                          id="auto-input" 
                          type="text" 
                          inputMode="numeric" 
                          autoComplete="off" 
                          value={parseInt(autoBidMax || '0', 10).toLocaleString('vi-VN')}
                          onChange={(e) => setAutoBidMax(e.target.value.replace(/\D/g, ''))}
                          style={{ width: '100%', height: '48px', border: '1px solid var(--border)', borderRadius: '6px', textAlign: 'center', fontSize: '16px', fontWeight: 600 }}
                        />
                        <p className="bid-hint" id="auto-hint" style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '8px', lineHeight: 1.4 }}>Hệ thống tự động trả giá thay bạn từng bước nhỏ.</p>
                      </div>
                    )}
                  </div>
                </form>

                <hr className="divider" style={{ border: 0, borderTop: '1px solid var(--border)', margin: '24px 0' }} />
                
                <section className="history" aria-labelledby="history-title">
                  <div className="history-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span className="label" id="history-title" style={{ fontWeight: 600, fontSize: '16px' }}>Lịch sử trả giá gần nhất</span>
                    <button 
                      className="history-toggle" 
                      id="history-toggle" 
                      type="button" 
                      aria-expanded={historyVisible > 5}
                      onClick={() => setHistoryVisible((prev: number) => prev === 5 ? bidCount : 5)}
                      style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '14px', fontWeight: 500, cursor: 'pointer', padding: 0 }}
                    >
                      {historyVisible === 5 ? `Xem tất cả ${bidCount} lượt` : 'Thu gọn lịch sử'}
                    </button>
                  </div>
                  <ul className="history-list" id="history-list" aria-label="Lịch sử trả giá của phiên" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {historyList.map((bid: BidRecord, index: number) => {
                      const isCollapsed = index >= historyVisible;
                      if (isCollapsed) return null; 
                      
                      return (
                        <li key={bid.id} className={`${bid.isHighest ? 'is-highest' : ''} ${bid.cancelled ? 'is-cancelled' : ''}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                          <span className="bidder-name" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--fg)', fontWeight: bid.isHighest ? 600 : 400 }}>
                            {bid.name}
                            {bid.isHighest && (
                              <span className="lead-flag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--color-live-bg)', color: 'var(--color-live-text)', border: '1px solid var(--color-live-border)', padding: '2px 6px', borderRadius: '99px', fontSize: '11px' }}>
                                <svg style={{ width: 12, height: 12 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                                {isEnded ? 'Người thắng' : 'Dẫn đầu'}
                              </span>
                            )}
                            {bid.isAuto && !bid.isHighest && <span className="auto-flag" style={{ background: 'var(--surface-warm)', color: 'var(--fg-2)', border: '1px solid var(--border)', padding: '2px 6px', borderRadius: '99px', fontSize: '11px' }}>Tự động</span>}
                          </span>
                          <span className="bidder-price tnum" style={{ fontWeight: bid.isHighest ? 600 : 500 }}>
                            {bid.cancelled ? (
                              <><s>{formatVND(bid.price)}</s><span className="cancelled-note" style={{ color: 'var(--danger-text)', fontSize: '12px', marginLeft: '4px' }}>— đã hủy</span></>
                            ) : formatVND(bid.price)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
                <hr className="divider" style={{ border: 0, borderTop: '1px solid var(--border)', margin: '24px 0' }} />
                
                <ul className="trust-badges" aria-label="Cam kết của AuctionHub" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--fg-2)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><svg style={{ width: 16, height: 16, color: 'var(--muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg> Escrow VNPay</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><svg style={{ width: 16, height: 16, color: 'var(--muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" /></svg> Hoàn tiền trong 7 ngày</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><svg style={{ width: 16, height: 16, color: 'var(--muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 13a8 8 0 0 1 16 0" /><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M3 18h18c0 2-1.5 3-3 3h-4" /><path d="M10 21h4" /></svg> Hotline 1900 6868</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* ═══ LIGHTBOX ═══ */}
      <div className={`lightbox ${isLightboxOpen ? 'open' : ''}`} id="lightbox" role="dialog" aria-modal="true" aria-label="Xem đầy đủ ảnh sản phẩm" hidden={!isLightboxOpen}>
        <button className="lightbox-close" id="lightbox-close" type="button" aria-label="Đóng ảnh" onClick={() => setIsLightboxOpen(false)}>
          <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <div className="lightbox-inner" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#111', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '1000px' }}>
          <div className="lightbox-main" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
            <img id="lightbox-image" src={activeThumb.src} alt={activeThumb.alt} style={{ maxHeight: '70vh', maxWidth: '100%', objectFit: 'contain' }} />
          </div>
          <ul className="lightbox-thumbs" aria-label="Chọn ảnh" style={{ display: 'flex', justifyContent: 'center', gap: '12px', listStyle: 'none', padding: 0 }}>
            {productData.images.map((t: ProductImage, idx: number) => (
              <li key={idx}>
                <button 
                  className={`gallery-thumb ${activeThumb.src === t.src ? 'is-active' : ''}`} 
                  type="button" 
                  onClick={() => setActiveThumb(t)}
                  aria-label={`Ảnh ${idx + 1}`} 
                  aria-pressed={activeThumb.src === t.src}
                  style={{ width: '80px', height: '60px', padding: 0, border: activeThumb.src === t.src ? '2px solid var(--accent)' : '1px solid #333', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer' }}
                >
                  <img src={t.src} alt={t.alt} width={t.width} height={t.height} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}