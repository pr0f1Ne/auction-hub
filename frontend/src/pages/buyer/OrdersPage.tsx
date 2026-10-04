import { Link } from "react-router-dom";
import { localDB } from "../../utils/localDB";

export default function OrdersPage() {
  const user = localDB.getCurrentUser();
  const orders = localDB.getOrders().filter((order) => order.buyerId === user?.id);
  return <main id="main"><div className="container"><nav className="crumbs"><Link to="/">Trang chủ</Link><span className="sep">/</span><span>Đơn hàng</span></nav><div className="notification-head"><div><h1>Đơn hàng của tôi</h1><p>Theo dõi thanh toán, vận chuyển và trạng thái escrow.</p></div></div><section className="card"><div className="tbl-scroll"><table className="tbl"><thead><tr><th>Mã đơn</th><th>Sản phẩm</th><th>Tổng tiền</th><th>Trạng thái</th><th></th></tr></thead><tbody>{orders.length === 0 ? <tr><td colSpan={5} style={{ textAlign: "center", padding: 32 }}>Bạn chưa có đơn hàng nào.</td></tr> : orders.map((order) => <tr key={order.id}><td>{order.id}</td><td>{localDB.getAuction(order.auctionId)?.title}</td><td>{(order.amount + order.platformFee + order.shippingFee).toLocaleString("vi-VN")}đ</td><td><span className="status-pill">{order.status}</span></td><td><Link className="act-primary" to={`/orders/${order.id}`}>Xem đơn</Link></td></tr>)}</tbody></table></div></section></div></main>;
}
