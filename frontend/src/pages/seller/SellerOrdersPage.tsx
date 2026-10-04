import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { localDB } from "../../utils/localDB";
import type { OrderStatus } from "../../data/mockData";

type Tab = "paid" | "shipping" | "delivered" | "completed" | "cancelled" | "dispute" | "refunded";
const labels: Record<Tab, string> = { paid: "Chờ giao", shipping: "Đang giao", delivered: "Đã giao", completed: "Hoàn tất", cancelled: "Đã hủy", dispute: "Tranh chấp", refunded: "Hoàn tiền" };
const statusForTab: Record<Tab, OrderStatus[]> = { paid: ["paid"], shipping: ["shipping"], delivered: ["delivered"], completed: ["completed"], cancelled: ["cancelled"], dispute: ["dispute"], refunded: ["refunded"] };

export default function SellerOrdersPage() {
  const seller = localDB.getCurrentUser();
  const [tab, setTab] = useState<Tab>("paid");
  const [orders, setOrders] = useState(() => localDB.getOrders());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [trackingCode, setTrackingCode] = useState("");
  const [notice, setNotice] = useState("");
  const sellerOrders = useMemo(() => orders.filter((order) => order.sellerId === seller?.id), [orders, seller?.id]);
  const list = sellerOrders.filter((order) => statusForTab[tab].includes(order.status));
  const refresh = () => setOrders(localDB.getOrders());
  const update = (id: string, patch: { status?: OrderStatus; trackingCode?: string }) => { localDB.updateOrder(id, patch); refresh(); };
  return <div className="content">
    <div className="page-head"><div><h1>Đơn hàng</h1><p className="sub">Đơn hàng được đồng bộ trực tiếp từ giao dịch buyer.</p></div></div>
    {notice && <p className="form-error" role="status" style={{ color: "var(--success-text)" }}>{notice}</p>}
    <div className="tabs" role="tablist">{(Object.keys(labels) as Tab[]).map((key) => <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)}>{labels[key]}<span className="tcount">{sellerOrders.filter((order) => statusForTab[key].includes(order.status)).length}</span></button>)}</div>
    <section className="card"><div className="tbl-scroll"><table className="tbl"><thead><tr><th>Mã đơn</th><th>Sản phẩm</th><th>Người mua</th><th>Số tiền</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>
      {list.length === 0 ? <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--muted)", padding: 32 }}>Không có đơn hàng trong trạng thái này.</td></tr> : list.map((order) => <tr key={order.id}><td><Link className="od-id" to={`/orders/${order.id}`}>{order.id}</Link></td><td><div className="prod"><span className="thumb"><img src={localDB.getAuction(order.auctionId)?.images[0]} alt="" /></span><span className="pmeta"><b className="pname">{localDB.getAuction(order.auctionId)?.title ?? "Sản phẩm đấu giá"}</b><span className="pid">{order.trackingCode ?? "Chưa có mã vận đơn"}</span></span></div></td><td>{order.buyerId}</td><td className="price-cell">{order.amount.toLocaleString("vi-VN")}đ</td><td><span className="status-pill">{labels[tab]}</span></td><td><div className="row-actions">
        {order.status === "paid" && <button className="act-primary" type="button" onClick={() => { setSelectedId(order.id); setTrackingCode(""); }}>Đánh dấu đã gửi</button>}
        {order.status === "shipping" && <button className="act-primary" type="button" onClick={() => { update(order.id, { status: "delivered" }); setNotice("Đơn đã được đánh dấu giao thành công."); }}>Đã giao</button>}
        {order.status === "dispute" && <button className="act-primary" type="button" onClick={() => { update(order.id, { status: "refunded" }); setNotice("Đã xử lý tranh chấp và hoàn tiền đơn hàng."); }}>Hoàn tiền</button>}
        <Link className="act-plain" to={`/orders/${order.id}`}>Xem chi tiết</Link>
      </div></td></tr>)}
    </tbody></table></div></section>
    {selectedId && <div className="profile-modal-backdrop"><form className="profile-edit-modal" onSubmit={(event) => { event.preventDefault(); if (!trackingCode.trim()) return; update(selectedId, { status: "shipping", trackingCode: trackingCode.trim() }); setSelectedId(null); setNotice("Đã lưu mã vận đơn và thông báo cho người mua."); }}><div className="profile-edit-head"><h2>Gửi hàng</h2><button type="button" aria-label="Đóng" onClick={() => setSelectedId(null)}>×</button></div><label className="field-label">Mã vận đơn<input className="auth-control" value={trackingCode} onChange={(event) => setTrackingCode(event.target.value)} placeholder="VD: GHN928451760" required /></label><div className="profile-edit-actions"><button className="btn btn-ghost" type="button" onClick={() => setSelectedId(null)}>Hủy</button><button className="btn btn-primary" type="submit">Xác nhận gửi</button></div></form></div>}
  </div>;
}
