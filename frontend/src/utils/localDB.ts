import {
  MOCK_AUCTIONS, MOCK_NOTIFICATIONS, MOCK_ORDERS,
  type AuctionBid, type AuctionRecord, type NotificationRecord,
  type OrderRecord, type OrderStatus
} from "../data/mockData";

const KEYS = {
  users: "auctionhub_users_v7", session: "auctionhub_session_v7",
  auctions: "auctionhub_auctions_v7", orders: "auctionhub_orders_v7",
  notifications: "auctionhub_notifications_v7", watchlist: "auctionhub_watchlist_v7"
} as const;

export type UserRole = "buyer" | "seller" | "admin";
export interface SellerRegistrationProfile { phone: string; city: string; businessType: "individual" | "business"; }
export interface LocalUser { id: string; email: string; password?: string; name: string; role: UserRole; phone?: string; city?: string; businessType?: SellerRegistrationProfile["businessType"]; avatarUrl?: string; }
export type UserProfilePatch = Pick<LocalUser, "name"> & Partial<Pick<LocalUser, "phone" | "city" | "avatarUrl">>;
export interface AuthResult { success: boolean; message?: string; user?: LocalUser; }
export interface CreateAuctionInput {
  title: string; brand: string; category: AuctionRecord["category"];
  condition: AuctionRecord["condition"]; description: string; images: string[];
  startingPrice: number; minIncrement: number; endsAt: string;
}

const canUseStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";
function read<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  const value = localStorage.getItem(key);
  if (!value) return fallback;
  try { return JSON.parse(value) as T; } catch { return fallback; }
}
function write<T>(key: string, value: T): void { if (canUseStorage()) localStorage.setItem(key, JSON.stringify(value)); }
function emitChange(): void { if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("auctionhub:change")); }

const seedUsers: LocalUser[] = [
  { id: "buyer-demo", email: "buyer@auctionhub.vn", password: "Auction123", name: "Nguyễn Văn A", role: "buyer", phone: "0901 234 456" },
  { id: "seller-techstore", email: "seller@auctionhub.vn", password: "Auction123", name: "TechStore VN", role: "seller", phone: "0909 888 686" },
  { id: "admin-demo", email: "admin@auctionhub.vn", password: "Auction123", name: "AuctionHub Admin", role: "admin" }
];

export function initMockDB(): void {
  if (!canUseStorage()) return;
  if (!localStorage.getItem(KEYS.auctions)) write(KEYS.auctions, MOCK_AUCTIONS);
  if (!localStorage.getItem(KEYS.orders)) write(KEYS.orders, MOCK_ORDERS);
  if (!localStorage.getItem(KEYS.notifications)) write(KEYS.notifications, MOCK_NOTIFICATIONS);
  if (!localStorage.getItem(KEYS.users)) write(KEYS.users, seedUsers);
  if (!localStorage.getItem(KEYS.watchlist)) write(KEYS.watchlist, ["galaxy-s26-ultra", "sony-wh-1000xm6", "nike-air-max-dn8", "zara-linen-blazer", "laneige-lip-mask-set", "cerave-moisturizing-set", "nike-training-set", "adjustable-dumbbell-set"]);
}

export const localDB = {
  register(email: string, password: string, name: string, role: "buyer" | "seller", sellerProfile?: SellerRegistrationProfile): AuthResult {
    const users = read<LocalUser[]>(KEYS.users, seedUsers);
    const cleanEmail = email.toLowerCase().trim();
    if (users.some((user) => user.email === cleanEmail)) return { success: false, message: "Email này đã được sử dụng." };
    const user: LocalUser = { id: `user-${Date.now()}`, email: cleanEmail, password, name: name.trim(), role, ...(role === "seller" && sellerProfile ? sellerProfile : {}) };
    write(KEYS.users, [...users, user]); write(KEYS.session, user); emitChange();
    return { success: true, user };
  },
  login(email: string, password: string): AuthResult {
    const cleanEmail = email.toLowerCase().trim();
    const user = read<LocalUser[]>(KEYS.users, seedUsers).find((item) => item.email === cleanEmail && item.password === password);
    if (!user) return { success: false, message: "Sai email hoặc mật khẩu." };
    write(KEYS.session, user); emitChange(); return { success: true, user };
  },
  logout(): void { if (canUseStorage()) localStorage.removeItem(KEYS.session); emitChange(); },
  getCurrentUser(): LocalUser | null { return read<LocalUser | null>(KEYS.session, null); },
  getUser(id: string): LocalUser | undefined { return read<LocalUser[]>(KEYS.users, seedUsers).find((user) => user.id === id); },
  updateCurrentUser(patch: UserProfilePatch): AuthResult {
    const session = this.getCurrentUser();
    if (!session) return { success: false, message: "Bạn cần đăng nhập để sửa hồ sơ." };
    const cleanName = patch.name.trim();
    if (cleanName.length < 2) return { success: false, message: "Tên hiển thị cần ít nhất 2 ký tự." };
    const users = read<LocalUser[]>(KEYS.users, seedUsers);
    const index = users.findIndex((user) => user.id === session.id);
    if (index < 0) return { success: false, message: "Không tìm thấy tài khoản." };
    const updated: LocalUser = { ...users[index], ...patch, name: cleanName };
    users[index] = updated;
    write(KEYS.users, users); write(KEYS.session, updated); emitChange();
    return { success: true, user: updated };
  },
  getAuctions(): AuctionRecord[] { return read<AuctionRecord[]>(KEYS.auctions, MOCK_AUCTIONS); },
  getAuction(id: string): AuctionRecord | undefined { return this.getAuctions().find((auction) => auction.id === id); },
  createAuction(input: CreateAuctionInput): AuctionRecord {
    const currentUser = this.getCurrentUser();
    const auction: AuctionRecord = {
      id: `auction-${Date.now()}`, ...input, status: "pending", currentPrice: input.startingPrice,
      startsAt: new Date().toISOString(), sellerId: currentUser?.id ?? "seller-techstore",
      sellerName: currentUser?.name ?? "TechStore VN", sellerVerified: true, location: "TP.HCM",
      views: 0, bids: [], highlights: [], createdAt: new Date().toISOString()
    };
    write(KEYS.auctions, [auction, ...this.getAuctions()]); emitChange(); return auction;
  },
  placeBid(auctionId: string, amount: number): { success: boolean; message?: string; auction?: AuctionRecord } {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false, message: "Vui lòng đăng nhập để đặt giá." };
    const auctions = this.getAuctions(); const index = auctions.findIndex((item) => item.id === auctionId);
    if (index < 0) return { success: false, message: "Phiên đấu giá không tồn tại." };
    const target = auctions[index]; const minimum = target.currentPrice + target.minIncrement;
    if (amount < minimum) return { success: false, message: `Giá tối thiểu là ${minimum.toLocaleString("vi-VN")}đ.` };
    const bid: AuctionBid = { id: `bid-${Date.now()}`, bidderName: currentUser.name, amount, createdAt: new Date().toISOString() };
    const updated = { ...target, currentPrice: amount, bids: [bid, ...target.bids] };
    auctions[index] = updated; write(KEYS.auctions, auctions); emitChange(); return { success: true, auction: updated };
  },
  getWatchlist(): string[] { return read<string[]>(KEYS.watchlist, []); },
  isWatched(auctionId: string): boolean { return this.getWatchlist().includes(auctionId); },
  toggleWatch(auctionId: string): boolean {
    const list = this.getWatchlist();
    const next = list.includes(auctionId) ? list.filter((id) => id !== auctionId) : [...list, auctionId];
    write(KEYS.watchlist, next); emitChange(); return next.includes(auctionId);
  },
  getOrders(): OrderRecord[] { return read<OrderRecord[]>(KEYS.orders, MOCK_ORDERS); },
  getOrder(id: string): OrderRecord | undefined { return this.getOrders().find((order) => order.id.toLowerCase() === id.toLowerCase()); },
  createOrder(auctionId: string): OrderRecord {
    const user = this.getCurrentUser(); const auction = this.getAuction(auctionId) ?? this.getAuctions()[0];
    const found = this.getOrders().find((o) => o.auctionId === auction.id && o.buyerId === (user?.id ?? "buyer-demo"));
    if (found) return found;
    const order: OrderRecord = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`, auctionId: auction.id,
      buyerId: user?.id ?? "buyer-demo", sellerId: auction.sellerId, amount: auction.currentPrice,
      platformFee: Math.round(auction.currentPrice * .07), shippingFee: 50000, status: "pending_payment",
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    write(KEYS.orders, [order, ...this.getOrders()]); emitChange(); return order;
  },
  updateOrder(id: string, patch: Partial<Pick<OrderRecord, "paymentMethod" | "shippingAddress" | "trackingCode">> & { status?: OrderStatus }): OrderRecord | undefined {
    const orders = this.getOrders(); const index = orders.findIndex((order) => order.id.toLowerCase() === id.toLowerCase());
    if (index < 0) return undefined;
    orders[index] = { ...orders[index], ...patch, updatedAt: new Date().toISOString() };
    write(KEYS.orders, orders); emitChange(); return orders[index];
  },
  getNotifications(userId?: string): NotificationRecord[] {
    const all = read<NotificationRecord[]>(KEYS.notifications, MOCK_NOTIFICATIONS);
    return userId ? all.filter((item) => item.userId === userId) : all;
  },
  markNotificationRead(id: string): void {
    write(KEYS.notifications, read<NotificationRecord[]>(KEYS.notifications, MOCK_NOTIFICATIONS).map((item) => item.id === id ? { ...item, read: true } : item)); emitChange();
  },
  markAllNotificationsRead(userId: string): void {
    write(KEYS.notifications, read<NotificationRecord[]>(KEYS.notifications, MOCK_NOTIFICATIONS).map((item) => item.userId === userId ? { ...item, read: true } : item)); emitChange();
  },
  resetDemoData(): void {
    if (!canUseStorage()) return;
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key)); initMockDB(); emitChange();
  }
};

initMockDB();
