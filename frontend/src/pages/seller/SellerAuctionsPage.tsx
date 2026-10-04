import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { localDB } from "../../utils/localDB";
import type { AuctionStatus } from "../../data/mockData";

const statusLabel: Record<AuctionStatus, string> = { pending: "Chờ duyệt", active: "Đang hoạt động", ended: "Đã kết thúc", cancelled: "Đã hủy" };

export default function SellerAuctionsPage() {
  const user = localDB.getCurrentUser();
  const [filter, setFilter] = useState<"all" | AuctionStatus>("all");
  const auctions = useMemo(() => localDB.getAuctions().filter((item) => !user || user.role !== "seller" || item.sellerId === user.id || item.sellerId === "seller-techstore"), [user]);
  const visible = filter === "all" ? auctions : auctions.filter((item) => item.status === filter);

  return (
    <div className="content">
      <div className="page-head">
        <div><h1>Phiên đấu giá</h1><p className="sub">Quản lý phiên đã tạo, trạng thái duyệt và lượt trả giá.</p></div>
        <Link className="btn btn-primary" to="/seller/auctions/new">Tạo phiên đấu giá</Link>
      </div>
      <div className="tabs" role="tablist" aria-label="Lọc phiên">
        {(["all", "pending", "active", "ended"] as const).map((key) => <button type="button" role="tab" aria-selected={filter === key} className={filter === key ? "active" : ""} key={key} onClick={() => setFilter(key)}>{key === "all" ? "Tất cả" : statusLabel[key]}</button>)}
      </div>
      <section className="card">
        {visible.length === 0 ? <div className="empty-panel"><h2>Chưa có phiên nào</h2><p>Tạo phiên đầu tiên để bắt đầu nhận giá.</p></div> : (
          <div className="tbl-scroll"><table className="tbl"><thead><tr><th>Sản phẩm</th><th>Giá hiện tại</th><th>Lượt bid</th><th>Kết thúc</th><th>Trạng thái</th></tr></thead><tbody>
            {visible.map((auction) => <tr key={auction.id}><td><span className="prod"><img className="thumb" src={auction.images[0]} alt="" /><span className="pmeta"><Link className="pname" to={`/auctions/${auction.id}`}>{auction.title}</Link><span className="pid">#{auction.id}</span></span></span></td><td><strong>{auction.currentPrice.toLocaleString("vi-VN")}đ</strong></td><td>{auction.bids.length}</td><td>{new Date(auction.endsAt).toLocaleString("vi-VN")}</td><td><span className={`status-pill st-${auction.status}`}>{statusLabel[auction.status]}</span></td></tr>)}
          </tbody></table></div>
        )}
      </section>
    </div>
  );
}
