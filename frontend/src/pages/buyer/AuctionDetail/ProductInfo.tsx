// src/pages/buyer/AuctionDetail/ProductInfo.tsx
import { type Auction } from '@/services/auction.service';

interface Props {
  auction: Auction;
}

export function ProductInfo({ auction }: Props) {
  return (
    <>
      <section className="item-info" aria-labelledby="item-title">
        <h1 className="item-title" id="item-title">{auction.item.title}</h1>

        <ul className="item-facts">
          <li>
            <span className="cond-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {/* Giả sử condition được trả về từ API */}
              Like New
            </span>
            <span className="body-meta">98% pin</span>
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Quận 1, TP.HCM
          </li>
          <li className="body-meta tnum">{auction.bids?.length || 0} lượt trả giá · 428 lượt xem</li>
        </ul>
      </section>

      <section className="block desc" aria-labelledby="desc-title">
        <h2 id="desc-title">Mô tả sản phẩm</h2>
        {/* Tạm thời hiển thị text cứng, sau này bạn có thể render từ auction.item.description */}
        <ul className="desc-list">
          <li>Màn hình Liquid Retina XDR 14,2 inch, độ sáng tối đa 1.600 nit, hỗ trợ HDR và ProMotion 120Hz.</li>
          <li>Chip Apple M3 với 8 nhân CPU và 10 nhân GPU, 16 GB RAM hợp nhất, ổ cứng SSD 1 TB.</li>
        </ul>
      </section>

      <section className="seller-outer" aria-label="Thông tin người bán">
        <div className="seller-row">
          <span className="avatar-lg" aria-hidden="true">
            {auction.seller.fullName.charAt(0).toUpperCase()}
          </span>
          <div className="seller-id">
            <span className="seller-name">
              {auction.seller.fullName}
              <span className="verified-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Verified
              </span>
            </span>
            <span className="seller-meta">
              <span aria-hidden="true">4.8</span>
              <span className="tnum">★</span>
              <span> · 1.240 đánh giá</span>
            </span>
          </div>
        </div>
      </section>
    </>
  );
}