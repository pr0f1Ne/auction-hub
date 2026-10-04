export type AuctionCategory = "laptop" | "phone" | "tablet" | "audio" | "camera" | "gaming" | "fashion" | "beauty" | "fitness";
export type AuctionCondition = "new" | "like-new" | "used";
export type AuctionStatus = "pending" | "active" | "ended" | "cancelled";

export interface AuctionBid {
  id: string;
  bidderName: string;
  amount: number;
  createdAt: string;
  automatic?: boolean;
}

export interface AuctionRecord {
  id: string;
  title: string;
  brand: string;
  category: AuctionCategory;
  condition: AuctionCondition;
  status: AuctionStatus;
  description: string;
  highlights: string[];
  images: string[];
  startingPrice: number;
  currentPrice: number;
  minIncrement: number;
  startsAt: string;
  endsAt: string;
  sellerId: string;
  sellerName: string;
  sellerVerified: boolean;
  location: string;
  views: number;
  bids: AuctionBid[];
  createdAt: string;
}

export type OrderStatus = "pending_payment" | "paid" | "shipping" | "delivered" | "completed" | "dispute" | "cancelled" | "refunded";

export interface OrderRecord {
  id: string;
  auctionId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  platformFee: number;
  shippingFee: number;
  status: OrderStatus;
  paymentMethod?: "vnpay" | "momo" | "bank";
  shippingAddress?: string;
  trackingCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  title: string;
  message: string;
  href: string;
  read: boolean;
  createdAt: string;
}

const hoursFromNow = (hours: number) => new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

// Product names are based on current 2026 manufacturer line-ups. Images are direct,
// product-specific catalogue photographs rather than generic category placeholders.
export const MOCK_AUCTIONS: AuctionRecord[] = [
  {
    id: "macbook-pro-m5-pro",
    title: "MacBook Pro 14 inch M5 Pro 2026",
    brand: "Apple",
    category: "laptop",
    condition: "like-new",
    status: "active",
    description: "Máy màu Đen Không Gian, cấu hình 48GB/2TB. Ngoại hình gần như mới, đầy đủ hộp và cáp MagSafe 3.",
    highlights: ["Chip Apple M5 Pro", "Màn hình Liquid Retina XDR 14,2 inch", "48GB unified memory · SSD 2TB", "Pin 98%, bảo hành đến 08/2027"],
    images: [
      "https://hozyaingorbushki.ru/upload/iblock/d99/9cxe3et3ssx8wtjjsnwtf5nrh9hmprat.webp",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=90",
      "https://images.unsplash.com/photo-1537498425277-c283d32ef9db?auto=format&fit=crop&w=1400&q=90",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1400&q=90"
    ],
    startingPrice: 42000000,
    currentPrice: 48600000,
    minIncrement: 500000,
    startsAt: daysAgo(2),
    endsAt: hoursFromNow(4.4),
    sellerId: "seller-techstore",
    sellerName: "TechStore VN",
    sellerVerified: true,
    location: "Quận 1, TP.HCM",
    views: 428,
    bids: [
      { id: "bid-mac-3", bidderName: "ngantran", amount: 48600000, createdAt: daysAgo(0), automatic: true },
      { id: "bid-mac-2", bidderName: "hieupm", amount: 48100000, createdAt: daysAgo(0) },
      { id: "bid-mac-1", bidderName: "minhduc", amount: 47600000, createdAt: daysAgo(0) }
    ],
    createdAt: daysAgo(3)
  },
  {
    id: "galaxy-s26-ultra",
    title: "Samsung Galaxy S26 Ultra 512GB",
    brand: "Samsung",
    category: "phone",
    condition: "new",
    status: "active",
    description: "Máy mới nguyên seal, màu Tím Cobalt, bản chính hãng Việt Nam kèm S Pen.",
    highlights: ["Màn hình Dynamic AMOLED 2X 6,9 inch", "Camera chính 200MP", "RAM 12GB · bộ nhớ 512GB", "Galaxy AI · S Pen tích hợp"],
    images: [
      "https://images.samsung.com/is/image/samsung/p6pim/us/s2602/gallery/us-galaxy-s26-ultra-s948-sm-s948uzvexau-550994120",
      "https://img.uswitch.com/s3/uswitch-assets-eu/mobiles-core/production/handset-variant/samsung-galaxy-s26-ultra/cobalt-violet-combo-1771952942993.png",
      "https://www.videotron.com/sites/default/files/styles/original_large/public/mobility_product/samsung_s26_ultra_violet_vue_face_et_dos.webp?itok=bEDnDOCs"
    ],
    startingPrice: 28500000,
    currentPrice: 32700000,
    minIncrement: 300000,
    startsAt: daysAgo(1),
    endsAt: hoursFromNow(0.8),
    sellerId: "seller-techstore",
    sellerName: "TechStore VN",
    sellerVerified: true,
    location: "Quận 3, TP.HCM",
    views: 842,
    bids: [{ id: "bid-s26-1", bidderName: "phamkhoa", amount: 32700000, createdAt: daysAgo(0) }],
    createdAt: daysAgo(2)
  },
  {
    id: "rog-zephyrus-g14-2026",
    title: "ROG Zephyrus G14 2026 GA403",
    brand: "ASUS ROG",
    category: "laptop",
    condition: "new",
    status: "active",
    description: "Máy mới chính hãng, cấu hình Ryzen AI 9 465 và RTX 5060, màn hình OLED 3K 120Hz.",
    highlights: ["AMD Ryzen AI 9 465", "GeForce RTX 5060 Laptop GPU", "OLED 3K 120Hz", "1,5kg · dày 1,59cm"],
    images: [
      "https://phucanhcdn.com/media/product/62883_laptop_asus_gaming_rog_zephyrus_g14_ga403gm_sy004w_1.jpg",
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1400&q=90"
    ],
    startingPrice: 55900000,
    currentPrice: 61200000,
    minIncrement: 500000,
    startsAt: daysAgo(1),
    endsAt: hoursFromNow(19),
    sellerId: "seller-gaming",
    sellerName: "ROG Corner",
    sellerVerified: true,
    location: "Cầu Giấy, Hà Nội",
    views: 517,
    bids: [{ id: "bid-rog-1", bidderName: "longvu", amount: 61200000, createdAt: daysAgo(0), automatic: true }],
    createdAt: daysAgo(1)
  },
  {
    id: "sony-wh-1000xm6",
    title: "Sony WH-1000XM6 Black",
    brand: "Sony",
    category: "audio",
    condition: "like-new",
    status: "active",
    description: "Tai nghe màu đen, đủ hộp và dây cáp. Đã dùng thử dưới 10 giờ, không trầy xước.",
    highlights: ["Chống ồn chủ động thế hệ mới", "Âm thanh Hi-Res · LDAC", "Pin đến 30 giờ", "Thiết kế gập gọn"],
    images: [
      "https://image.shinsegaev.com/upload/C00001/s3/goods/org/243/250717100213243.jpg",
      "https://cdn.shopify.com/s/files/1/0946/8677/3536/files/Sony_WH-1000XM6_black.jpg?v=1772098903"
    ],
    startingPrice: 6500000,
    currentPrice: 7200000,
    minIncrement: 100000,
    startsAt: daysAgo(1),
    endsAt: hoursFromNow(7.2),
    sellerId: "seller-audio",
    sellerName: "SoundLab Hà Nội",
    sellerVerified: true,
    location: "Ba Đình, Hà Nội",
    views: 276,
    bids: [{ id: "bid-sony-1", bidderName: "thao.le", amount: 7200000, createdAt: daysAgo(0) }],
    createdAt: daysAgo(1)
  },
  {
    id: "ipad-pro-m5",
    title: "iPad Pro 13 inch M5 Wi‑Fi 512GB",
    brand: "Apple",
    category: "tablet",
    condition: "like-new",
    status: "active",
    description: "Bản màu Đen Không Gian, kèm Apple Pencil Pro và bao da. Máy đẹp, pin 100%.",
    highlights: ["Chip Apple M5", "Màn hình Ultra Retina XDR 13 inch", "Bộ nhớ 512GB", "Kèm Apple Pencil Pro"],
    images: [
      "https://www.digicape.co.za/image/cache/catalog/_products/2025/iPad/iPad_Pro_M5/iPad_Pro_13-inch_M5_WiFi_Space_Black/iPad_Pro_13-inch_M5_WiFi_Space_Black_1-1000x1000.jpg",
      "https://images.unsplash.com/photo-1589739900243-4b52cb5b138c?auto=format&fit=crop&w=1400&q=90"
    ],
    startingPrice: 30500000,
    currentPrice: 33800000,
    minIncrement: 300000,
    startsAt: daysAgo(2),
    endsAt: hoursFromNow(27),
    sellerId: "seller-techstore",
    sellerName: "TechStore VN",
    sellerVerified: true,
    location: "Quận 1, TP.HCM",
    views: 312,
    bids: [{ id: "bid-ipad-1", bidderName: "thuha", amount: 33800000, createdAt: daysAgo(0) }],
    createdAt: daysAgo(4)
  },
  {
    id: "dji-mavic-4-pro",
    title: "DJI Mavic 4 Pro Fly More Combo",
    brand: "DJI",
    category: "camera",
    condition: "like-new",
    status: "active",
    description: "Fly More Combo đầy đủ 3 pin, hub sạc và túi. Drone chưa va chạm, tổng thời gian bay 4 giờ.",
    highlights: ["Hệ thống ba camera", "Camera Hasselblad 100MP", "Bay tối đa 51 phút", "Bộ Fly More Combo"],
    images: [
      "https://dji-retail.co.uk/cdn/shop/files/mavic-4-pro-rc2-fmc_grande.webp?v=1746786400",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1400&q=90"
    ],
    startingPrice: 52000000,
    currentPrice: 56400000,
    minIncrement: 500000,
    startsAt: daysAgo(2),
    endsAt: hoursFromNow(31),
    sellerId: "seller-camera",
    sellerName: "FlyCam Saigon",
    sellerVerified: true,
    location: "Thủ Đức, TP.HCM",
    views: 641,
    bids: [{ id: "bid-dji-1", bidderName: "kienphoto", amount: 56400000, createdAt: daysAgo(0) }],
    createdAt: daysAgo(3)
  },
  {
    id: "nike-air-max-dn8",
    title: "Nike Air Max Dn8 Black / Hyper Crimson",
    brand: "Nike",
    category: "fashion",
    condition: "new",
    status: "active",
    description: "Giày mới nguyên hộp, size EU 42.5, tem nhãn đầy đủ. Phối màu Black / Hyper Crimson đúng phiên bản phát hành.",
    highlights: ["Size EU 42.5", "Mới nguyên hộp", "Đế Dynamic Air", "Hoá đơn cửa hàng"],
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=90"],
    startingPrice: 2900000, currentPrice: 3350000, minIncrement: 50000, startsAt: daysAgo(1), endsAt: hoursFromNow(3.5),
    sellerId: "seller-techstore", sellerName: "TechStore VN", sellerVerified: true, location: "Quận 1, TP.HCM", views: 389,
    bids: [{ id: "bid-nike-1", bidderName: "linhpham", amount: 3350000, createdAt: daysAgo(0) }], createdAt: daysAgo(2)
  },
  {
    id: "zara-linen-blazer",
    title: "Zara Linen Blend Blazer Beige",
    brand: "Zara",
    category: "fashion",
    condition: "like-new",
    status: "active",
    description: "Blazer linen màu beige, size M, mặc hai lần, không xù lông hay ố màu.",
    highlights: ["Size M", "Linen blend", "Màu beige", "Like New 98%"],
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=90"],
    startingPrice: 650000, currentPrice: 820000, minIncrement: 20000, startsAt: daysAgo(1), endsAt: hoursFromNow(14),
    sellerId: "seller-techstore", sellerName: "TechStore VN", sellerVerified: true, location: "Quận 1, TP.HCM", views: 245,
    bids: [{ id: "bid-zara-1", bidderName: "ngocanh", amount: 820000, createdAt: daysAgo(0) }], createdAt: daysAgo(2)
  },
  {
    id: "laneige-lip-mask-set",
    title: "Laneige Lip Sleeping Mask Berry Set",
    brand: "Laneige",
    category: "beauty",
    condition: "new",
    status: "active",
    description: "Set mặt nạ ngủ môi Laneige hương Berry, hàng mới chưa mở, còn hạn dùng 2028.",
    highlights: ["Set 3 hũ 8g", "Mới nguyên seal", "HSD 2028", "Hương Berry"],
    images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1400&q=90"],
    startingPrice: 420000, currentPrice: 510000, minIncrement: 10000, startsAt: daysAgo(0), endsAt: hoursFromNow(6.5),
    sellerId: "seller-techstore", sellerName: "TechStore VN", sellerVerified: true, location: "Quận 1, TP.HCM", views: 172,
    bids: [{ id: "bid-laneige-1", bidderName: "minhthu", amount: 510000, createdAt: daysAgo(0) }], createdAt: daysAgo(1)
  },
  {
    id: "cerave-moisturizing-set",
    title: "CeraVe Moisturizing Skincare Set",
    brand: "CeraVe",
    category: "beauty",
    condition: "new",
    status: "active",
    description: "Bộ chăm sóc da gồm sữa rửa mặt và kem dưỡng CeraVe, nhập Mỹ, còn seal.",
    highlights: ["Da thường đến khô", "2 sản phẩm", "Mới nguyên seal", "HSD 2028"],
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1400&q=90"],
    startingPrice: 480000, currentPrice: 560000, minIncrement: 10000, startsAt: daysAgo(0), endsAt: hoursFromNow(22),
    sellerId: "seller-techstore", sellerName: "TechStore VN", sellerVerified: true, location: "Quận 1, TP.HCM", views: 138,
    bids: [{ id: "bid-cerave-1", bidderName: "thuyduong", amount: 560000, createdAt: daysAgo(0) }], createdAt: daysAgo(1)
  },
  {
    id: "nike-training-set",
    title: "Nike Dri-FIT Training Set Navy",
    brand: "Nike",
    category: "fitness",
    condition: "new",
    status: "active",
    description: "Set áo và quần tập Nike Dri-FIT màu navy, size L, mới nguyên tag.",
    highlights: ["Size L", "Dri-FIT thoáng khí", "Áo + quần", "Mới nguyên tag"],
    images: ["https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=90"],
    startingPrice: 880000, currentPrice: 1080000, minIncrement: 20000, startsAt: daysAgo(1), endsAt: hoursFromNow(10),
    sellerId: "seller-techstore", sellerName: "TechStore VN", sellerVerified: true, location: "Quận 1, TP.HCM", views: 204,
    bids: [{ id: "bid-nike-train-1", bidderName: "quangminh", amount: 1080000, createdAt: daysAgo(0) }], createdAt: daysAgo(2)
  },
  {
    id: "adjustable-dumbbell-set",
    title: "Adjustable Dumbbell Set 20kg",
    brand: "Bowflex",
    category: "fitness",
    condition: "like-new",
    status: "active",
    description: "Bộ tạ tay điều chỉnh tổng 20kg, khoá chắc chắn, phù hợp tập tại nhà.",
    highlights: ["Tổng 20kg", "Tạ điều chỉnh", "Kèm khoá", "Like New 95%"],
    images: ["https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1400&q=90"],
    startingPrice: 1200000, currentPrice: 1460000, minIncrement: 20000, startsAt: daysAgo(1), endsAt: hoursFromNow(28),
    sellerId: "seller-techstore", sellerName: "TechStore VN", sellerVerified: true, location: "Quận 1, TP.HCM", views: 221,
    bids: [{ id: "bid-dumbbell-1", bidderName: "hoangnam", amount: 1460000, createdAt: daysAgo(0) }], createdAt: daysAgo(2)
  }
];

export const MOCK_ORDERS: OrderRecord[] = [
  {
    id: "ORD-142",
    auctionId: "macbook-pro-m5-pro",
    buyerId: "buyer-demo",
    sellerId: "seller-techstore",
    amount: 48600000,
    platformFee: 3402000,
    shippingFee: 50000,
    status: "shipping",
    paymentMethod: "momo",
    shippingAddress: "123 Lê Lợi, Phường Sài Gòn, TP.HCM",
    trackingCode: "GHN928451760",
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1)
  },
  {
    id: "ORD-143", auctionId: "nike-air-max-dn8", buyerId: "buyer-demo", sellerId: "seller-techstore", amount: 3350000, platformFee: 234500, shippingFee: 35000, status: "delivered", paymentMethod: "vnpay", shippingAddress: "123 Lê Lợi, Phường Sài Gòn, TP.HCM", trackingCode: "GHN928451761", createdAt: daysAgo(5), updatedAt: daysAgo(2)
  },
  {
    id: "ORD-144", auctionId: "laneige-lip-mask-set", buyerId: "buyer-demo", sellerId: "seller-techstore", amount: 510000, platformFee: 35700, shippingFee: 30000, status: "completed", paymentMethod: "momo", shippingAddress: "123 Lê Lợi, Phường Sài Gòn, TP.HCM", trackingCode: "GHTK928451762", createdAt: daysAgo(8), updatedAt: daysAgo(4)
  },
  {
    id: "ORD-145", auctionId: "nike-training-set", buyerId: "buyer-demo", sellerId: "seller-techstore", amount: 1080000, platformFee: 75600, shippingFee: 35000, status: "shipping", paymentMethod: "bank", shippingAddress: "123 Lê Lợi, Phường Sài Gòn, TP.HCM", trackingCode: "JNT928451763", createdAt: daysAgo(2), updatedAt: daysAgo(0)
  },
  {
    id: "ORD-146", auctionId: "cerave-moisturizing-set", buyerId: "buyer-demo", sellerId: "seller-techstore", amount: 560000, platformFee: 39200, shippingFee: 30000, status: "paid", paymentMethod: "vnpay", shippingAddress: "123 Lê Lợi, Phường Sài Gòn, TP.HCM", createdAt: daysAgo(1), updatedAt: daysAgo(0)
  },
  {
    id: "ORD-147", auctionId: "adjustable-dumbbell-set", buyerId: "buyer-demo", sellerId: "seller-techstore", amount: 1460000, platformFee: 102200, shippingFee: 65000, status: "pending_payment", shippingAddress: "123 Lê Lợi, Phường Sài Gòn, TP.HCM", createdAt: daysAgo(0), updatedAt: daysAgo(0)
  }
];

export const MOCK_NOTIFICATIONS: NotificationRecord[] = [
  { id: "noti-1", userId: "buyer-demo", title: "Bạn đang dẫn đầu", message: "Giá của bạn đang cao nhất ở phiên MacBook Pro 14 inch M5 Pro.", href: "/auctions/macbook-pro-m5-pro", read: false, createdAt: daysAgo(0) },
  { id: "noti-2", userId: "buyer-demo", title: "Đơn hàng đang được giao", message: "TechStore VN đã gửi đơn ORD-142 qua GHN.", href: "/orders/ORD-142", read: false, createdAt: daysAgo(1) },
  { id: "noti-3", userId: "buyer-demo", title: "Phiên sắp kết thúc", message: "Galaxy S26 Ultra sẽ kết thúc trong chưa đầy 1 giờ.", href: "/auctions/galaxy-s26-ultra", read: true, createdAt: daysAgo(1) }
];
