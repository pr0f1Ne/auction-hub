import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

type TabKey = 'pending' | 'shipping' | 'delivered' | 'cancelled' | 'refunded';

// --- DỮ LIỆU MOCK 100% TỪ BẢN THIẾT KẾ ---
const MOCK_ORDERS = {
  pending: [
    { id: '#ORD-142', product: 'MacBook Pro 14 M3 2023', img: '/images/laptop.jpg', auId: '#AU-1042', buyer: 'Nguyễn Văn A', loc: 'Hà Nội', price: '36.500.000đ', paid: '19/09 15:12', han: 'Còn 18h', overdue: false },
    { id: '#ORD-141', product: 'iPhone 15 Pro Max 256GB', img: '/images/phone.jpg', auId: '#AU-1058', buyer: 'Trần Thị B', loc: 'TP.HCM', price: '24.800.000đ', paid: '19/09 09:40', han: 'Còn 2 ngày', overdue: false },
    { id: '#ORD-140', product: 'iPad Pro 11 M4 256GB', img: '/images/tablet.jpg', auId: '#AU-1066', buyer: 'Phạm Quốc C', loc: 'Đà Nẵng', price: '21.500.000đ', paid: '18/09 22:15', han: 'Trễ 6h', overdue: true },
  ],
  shipping: [
    { id: '#ORD-139', product: 'MacBook Pro 14 M3 Pro 2024', img: '/images/mbp-angle.jpg', auId: '#AU-1050', buyer: 'Lê Minh Tâm', loc: 'Hà Nội', price: '42.900.000đ', paid: '18/09 10:05', carrier: 'GHN', date: 'dự kiến 20/09' },
    { id: '#ORD-138', product: 'AirPods Max 2024', img: '/images/headphones.jpg', auId: '#AU-1061', buyer: 'Hoàng Thu Hà', loc: 'TP.HCM', price: '10.900.000đ', paid: '17/09 18:40', carrier: 'Viettel Post', date: 'dự kiến 19/09' },
  ],
  delivered: [
    { id: '#ORD-137', product: 'MacBook Pro 14 M3 2023', img: '/images/laptop.jpg', auId: '#AU-1042', buyer: 'Nguyễn Văn A', loc: 'Hà Nội', price: '35.500.000đ', paid: '16/09 20:12', carrier: 'GHN', status: 'Đã giao 17/09', time: '14:20' },
    { id: '#ORD-136', product: 'iPhone 15 Pro 128GB', img: '/images/phone.jpg', auId: '#AU-1053', buyer: 'Phạm Quốc C', loc: 'Đà Nẵng', price: '20.800.000đ', paid: '15/09 16:30', carrier: 'GHN', status: 'Đã giao 16/09', time: '10:05' },
    { id: '#ORD-135', product: 'MacBook Pro 14 M3 Pro 2024', img: '/images/mbp-angle.jpg', auId: '#AU-1050', buyer: 'Hoàng Thu Hà', loc: 'TP.HCM', price: '42.900.000đ', paid: '14/09 11:22', carrier: 'Viettel Post', status: 'Đã giao 15/09', time: '09:50' },
    { id: '#ORD-134', product: 'AirPods Pro 2', img: '/images/headphones.jpg', auId: '#AU-1055', buyer: 'Lê Minh Tâm', loc: 'Hà Nội', price: '5.900.000đ', paid: '12/09 09:15', carrier: 'GHN', status: 'Đã giao 13/09', time: '17:20' },
    { id: '#ORD-133', product: 'iPad Pro 11 M4 256GB', img: '/images/tablet.jpg', auId: '#AU-1066', buyer: 'Nguyễn Văn A', loc: 'Hà Nội', price: '21.500.000đ', paid: '10/09 20:48', carrier: 'GHN', status: 'Đã giao 12/09', time: '11:30' },
    { id: '#ORD-132', product: 'MacBook Pro 14 M3 2023', img: '/images/laptop.jpg', auId: '#AU-1041', buyer: 'Trần Thị B', loc: 'TP.HCM', price: '36.500.000đ', paid: '09/09 14:05', carrier: 'Viettel Post', status: 'Đã giao 10/09', time: '16:40' },
    { id: '#ORD-131', product: 'iPhone 14 Pro Max 256GB', img: '/images/phone.jpg', auId: '#AU-1048', buyer: 'Phạm Quốc C', loc: 'Đà Nẵng', price: '23.900.000đ', paid: '07/09 10:33', carrier: 'GHN', status: 'Đã giao 08/09', time: '12:15' },
  ],
  cancelled: [],
  refunded: [
    { id: '#ORD-128', product: 'MacBook Pro 14 M3 Pro 2024', img: '/images/mbp-side.jpg', auId: '#AU-1049', buyer: 'Trần Thị B', loc: 'TP.HCM', price: '42.900.000đ', paid: '06/09 15:12', refundType: 'Hoàn tiền Momo', status: 'Đã hoàn 08/09', time: '09:30' },
  ],
};

export default function SellerOrdersPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('pending');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [range, setRange] = useState('30 ngày qua');

  // --- Handlers ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOpenDrawer = (e: React.MouseEvent, order: any) => {
    e.preventDefault();
    setSelectedOrder(order);
    setIsDrawerOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedOrder(null), 300);
    document.body.style.overflow = '';
  };

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Đã cập nhật vận đơn cho đơn ${selectedOrder?.id}`);
    handleCloseDrawer();
  };

  const showToast = (msg: string) => {
    alert(msg); // Tạm thay toast bằng alert để test
  };

  const renderEmptyState = (type: TabKey) => {
    if (type === 'pending') return (
      <div className="empty-panel">
        <div className="empty-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8Z"/><path d="M3 8V6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2"/><path d="M10 12h4"/></svg></div>
        <h3>Không còn đơn chờ giao</h3><p>Mọi đơn đã được xác nhận gửi. Đơn mới sẽ xuất hiện tại tab này.</p>
      </div>
    );
    if (type === 'shipping') return (
      <div className="empty-panel">
        <div className="empty-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8Z"/><path d="M3 8V6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2"/><path d="M10 12h4"/></svg></div>
        <h3>Không có đơn đang vận chuyển</h3><p>Các đơn bạn xác nhận gửi sẽ hiển thị tại đây kèm mã vận đơn.</p>
      </div>
    );
    if (type === 'delivered') return (
      <div className="empty-panel">
        <div className="empty-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3h16v18H4z"/><path d="m8 13 3 3 5-6"/></svg></div>
        <h3>Chưa có đơn giao xong</h3><p>Đơn giao thành công và được người mua nhận sẽ hiển thị tại đây.</p>
      </div>
    );
    if (type === 'cancelled') return (
      <div className="empty-panel">
        <div className="empty-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8.5 8.5 7 7"/><path d="m15.5 8.5-7 7"/></svg></div>
        <h3>Không có đơn hủy</h3><p>Khách hàng của bạn đang giữ tỷ lệ hủy ở mức 0%.</p>
      </div>
    );
    if (type === 'refunded') return (
      <div className="empty-panel">
        <div className="empty-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19h16"/><path d="M4 5h16"/><circle cx="12" cy="12" r="3"/></svg></div>
        <h3>Chưa có khoản hoàn tiền</h3><p>Hoàn tiền cho người mua sẽ xuất hiện tại đây kèm trạng thái xử lý.</p>
      </div>
    );
  };

  return (
    <>
      <div className="content">
        <div className="page-head">
          <div>
            <h1>Đơn hàng</h1>
            <p className="sub" id="head-sub">
              {MOCK_ORDERS.pending.length} đơn chờ giao, {MOCK_ORDERS.shipping.length} đơn đang vận chuyển, {MOCK_ORDERS.delivered.length} đơn hoàn thành tháng này.
            </p>
          </div>
          <div className="head-actions">
            <div className="range-picker">
              <select value={range} onChange={(e) => setRange(e.target.value)}>
                <option value="7 ngày qua">7 ngày qua</option>
                <option value="30 ngày qua">30 ngày qua</option>
                <option value="90 ngày qua">90 ngày qua</option>
              </select>
            </div>
            <button type="button" className="btn btn-ghost" onClick={() => showToast('Đang tạo CSV...')}>Xuất CSV</button>
          </div>
        </div>

        <div className="tabs" role="tablist">
          {[
            { id: 'pending', label: 'Chờ giao' },
            { id: 'shipping', label: 'Đang giao' },
            { id: 'delivered', label: 'Đã giao' },
            { id: 'cancelled', label: 'Đã hủy' },
            { id: 'refunded', label: 'Hoàn tiền' }
          ].map(tab => (
            <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id as TabKey)}>
              {tab.label}<span className="tcount">{MOCK_ORDERS[tab.id as TabKey].length}</span>
            </button>
          ))}
        </div>

        <p className="order-note">Hiển thị {MOCK_ORDERS[activeTab].length} đơn trong {range}.</p>

        <div className="card">
          {/* TAB: CHỜ GIAO */}
          {activeTab === 'pending' && (
            <section className="tab-panel">
              {MOCK_ORDERS.pending.length > 0 ? (
                <div className="tbl-scroll">
                  <table className="tbl">
                    <thead>
                      <tr><th>Mã đơn</th><th>Sản phẩm</th><th>Người mua</th><th>Số tiền</th><th>Ngày thanh toán</th><th>Hạn giao</th><th>Thao tác</th></tr>
                    </thead>
                    <tbody>
                      {MOCK_ORDERS.pending.map((o) => (
                        <tr key={o.id} className={o.overdue ? "row-overdue" : ""}>
                          <td><span className="od-id">{o.id}</span></td>
                          <td>
                            <div className="prod">
                              <span className="thumb"><img src={o.img} alt="" /></span>
                              <span className="pmeta"><span className="pname">{o.product}</span><span className="pid">{o.auId} · Đã thanh toán</span></span>
                            </div>
                          </td>
                          <td><div className="buyer"><b>{o.buyer}</b><span className="loc">{o.loc}</span></div></td>
                          <td><span className="price-cell">{o.price}</span></td>
                          <td><span className="paid">{o.paid}</span></td>
                          <td>
                            <span className={`han ${o.overdue ? 'overdue' : ''}`}>
                              {o.overdue && <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>}
                              {o.han}
                            </span>
                          </td>
                          <td>
                            <div className="row-actions">
                              <a href="#void" className="act-plain" onClick={(e) => { e.preventDefault(); showToast(`Liên hệ ${o.buyer}`); }}>Liên hệ</a>
                              <a href="#void" className="act-primary" onClick={(e) => handleOpenDrawer(e, o)}>Đánh dấu đã gửi</a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : renderEmptyState('pending')}
            </section>
          )}

          {/* TAB: ĐANG GIAO */}
          {activeTab === 'shipping' && (
            <section className="tab-panel">
              {MOCK_ORDERS.shipping.length > 0 ? (
                <div className="tbl-scroll">
                  <table className="tbl">
                    <thead>
                      <tr><th>Mã đơn</th><th>Sản phẩm</th><th>Người mua</th><th>Số tiền</th><th>Ngày thanh toán</th><th>Hạn giao</th><th>Thao tác</th></tr>
                    </thead>
                    <tbody>
                      {MOCK_ORDERS.shipping.map((o) => (
                        <tr key={o.id}>
                          <td><span className="od-id">{o.id}</span></td>
                          <td>
                            <div className="prod">
                              <span className="thumb"><img src={o.img} alt="" /></span>
                              <span className="pmeta"><span className="pname">{o.product}</span><span className="pid">{o.auId} · {o.carrier}</span></span>
                            </div>
                          </td>
                          <td><div className="buyer"><b>{o.buyer}</b><span className="loc">{o.loc}</span></div></td>
                          <td><span className="price-cell">{o.price}</span></td>
                          <td><span className="paid">{o.paid}</span></td>
                          <td><span className="han"><span className="carrier">{o.carrier}</span> · {o.date}</span></td>
                          <td><div className="row-actions"><a href="#void" className="act-plain" onClick={(e) => { e.preventDefault(); showToast('Mở vận đơn theo dõi'); }}>Theo dõi</a></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : renderEmptyState('shipping')}
            </section>
          )}

          {/* TAB: ĐÃ GIAO */}
          {activeTab === 'delivered' && (
            <section className="tab-panel">
              {MOCK_ORDERS.delivered.length > 0 ? (
                <div className="tbl-scroll">
                  <table className="tbl">
                    <thead>
                      <tr><th>Mã đơn</th><th>Sản phẩm</th><th>Người mua</th><th>Số tiền</th><th>Ngày thanh toán</th><th>Hạn giao</th><th>Thao tác</th></tr>
                    </thead>
                    <tbody>
                      {MOCK_ORDERS.delivered.map((o) => (
                        <tr key={o.id}>
                          <td><span className="od-id">{o.id}</span></td>
                          <td>
                            <div className="prod">
                              <span className="thumb"><img src={o.img} alt="" /></span>
                              <span className="pmeta"><span className="pname">{o.product}</span><span className="pid">{o.auId} · {o.carrier}</span></span>
                            </div>
                          </td>
                          <td><div className="buyer"><b>{o.buyer}</b><span className="loc">{o.loc}</span></div></td>
                          <td><span className="price-cell">{o.price}</span></td>
                          <td><span className="paid">{o.paid}</span></td>
                          <td><span className="han"><span className="carrier">{o.status}</span> · {o.time}</span></td>
                          <td><div className="row-actions"><a href="#void" className="act-plain">Xem vận đơn</a></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : renderEmptyState('delivered')}
            </section>
          )}

          {/* TAB: ĐÃ HỦY */}
          {activeTab === 'cancelled' && <section className="tab-panel">{renderEmptyState('cancelled')}</section>}

          {/* TAB: HOÀN TIỀN */}
          {activeTab === 'refunded' && (
            <section className="tab-panel">
              {MOCK_ORDERS.refunded.length > 0 ? (
                <div className="tbl-scroll">
                  <table className="tbl">
                    <thead>
                      <tr><th>Mã đơn</th><th>Sản phẩm</th><th>Người mua</th><th>Số tiền</th><th>Ngày thanh toán</th><th>Hạn giao</th><th>Thao tác</th></tr>
                    </thead>
                    <tbody>
                      {MOCK_ORDERS.refunded.map((o) => (
                        <tr key={o.id}>
                          <td><span className="od-id">{o.id}</span></td>
                          <td>
                            <div className="prod">
                              <span className="thumb"><img src={o.img} alt="" /></span>
                              <span className="pmeta"><span className="pname">{o.product}</span><span className="pid">{o.auId} · {o.refundType}</span></span>
                            </div>
                          </td>
                          <td><div className="buyer"><b>{o.buyer}</b><span className="loc">{o.loc}</span></div></td>
                          <td><span className="price-cell">{o.price}</span></td>
                          <td><span className="paid">{o.paid}</span></td>
                          <td><span className="han"><span className="carrier">{o.status}</span> · {o.time}</span></td>
                          <td><div className="row-actions"><a href="#void" className="act-plain">Xem chi tiết</a></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : renderEmptyState('refunded')}
            </section>
          )}
        </div>
      </div>

      {/* DRAWER: ĐÁNH DẤU ĐÃ GỬI */}
      <div className={`scrim ${isDrawerOpen ? 'show' : ''}`} onClick={handleCloseDrawer}></div>
      <aside className={`drawer ${isDrawerOpen ? 'show' : ''}`} aria-hidden={!isDrawerOpen}>
        <div className="drawer-head">
          <h2>Đánh dấu đã gửi</h2>
          <button type="button" className="drawer-close" onClick={handleCloseDrawer}>×</button>
        </div>
        <div className="drawer-body">
          {selectedOrder && (
            <p className="drawer-sub">Đơn <span className="od-id">{selectedOrder.id}</span> · {selectedOrder.buyer} · {selectedOrder.product}</p>
          )}
          <form id="ship-form" onSubmit={handleSubmitShipping}>
            <div className="field">
              <label>Nhà vận chuyển <span className="req">*</span></label>
              <select required>
                <option value="GHN">GHN (Giao Hàng Nhanh)</option>
                <option value="Viettel Post">Viettel Post</option>
                <option value="GHTK">GHTK</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div className="field">
              <label>Mã vận đơn <span className="req">*</span></label>
              <input type="text" placeholder="Ví dụ: VN93211847" required />
            </div>
            <div className="field">
              <label>Ghi chú cho người mua</label>
              <textarea rows={3} placeholder="Tùy chọn. Hiển thị trong thông báo kèm mã vận đơn."></textarea>
              <p className="help">Chỉ người mua của đơn này nhìn thấy ghi chú.</p>
            </div>
          </form>
        </div>
        <div className="drawer-foot">
          <button type="button" className="btn btn-ghost" onClick={handleCloseDrawer}>Hủy</button>
          <button type="button" className="btn btn-primary" onClick={handleSubmitShipping}>Xác nhận gửi hàng</button>
        </div>
      </aside>
    </>
  );
}