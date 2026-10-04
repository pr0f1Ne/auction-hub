import { useState } from "react";
import { Link } from "react-router-dom";
import { localDB } from "../../utils/localDB";

export default function NotificationsPage() {
  const user = localDB.getCurrentUser();
  const [items, setItems] = useState(() => localDB.getNotifications(user?.id ?? "buyer-demo"));

  const markAllRead = () => {
    localDB.markAllNotificationsRead(user?.id ?? "buyer-demo");
    setItems(localDB.getNotifications(user?.id ?? "buyer-demo"));
  };

  const openNotification = (id: string) => {
    localDB.markNotificationRead(id);
    setItems((current) => current.map((item) => item.id === id ? { ...item, read: true } : item));
  };

  return (
    <main id="main" className="notifications-main">
      <div className="container">
        <nav className="crumbs" aria-label="Chuỗi điều hướng">
          <Link to="/">Trang chủ</Link><span className="sep">/</span><span>Thông báo</span>
        </nav>
        {items.length === 0 ? (
          <section className="empty-panel notification-empty">
            <span className="empty-icon" aria-hidden="true">✓</span>
            <h1>Không có thông báo mới</h1>
            <p>Khi có thay đổi về phiên đấu giá hoặc đơn hàng, bạn sẽ thấy ở đây.</p>
            <Link className="btn btn-primary" to="/search">Khám phá phiên đấu giá</Link>
          </section>
        ) : (
          <section className="notification-shell" aria-labelledby="notification-title">
            <div className="notification-head">
              <div><h1 id="notification-title">Thông báo</h1><p>{items.filter((item) => !item.read).length} thông báo chưa đọc</p></div>
              <button className="btn btn-ghost" type="button" onClick={markAllRead}>Đánh dấu tất cả đã đọc</button>
            </div>
            <div className="notification-list">
              {items.map((item) => (
                <Link className={`notification-item ${item.read ? "" : "is-unread"}`} to={item.href} key={item.id} onClick={() => openNotification(item.id)}>
                  <span className="notification-dot" aria-hidden="true" />
                  <span className="notification-copy"><strong>{item.title}</strong><span>{item.message}</span></span>
                  <time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleDateString("vi-VN")}</time>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
