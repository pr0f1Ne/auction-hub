// src/pages/buyer/AuctionDetail/BidPanel.tsx
import { useState } from 'react'; // Đã xóa useEffect
import { useAuctionSocket } from '@/hooks/useAuctionSocket';
import { auctionService, type Auction, type Bid } from '@/services/auction.service';

interface Props {
  initialAuction: Auction;
}

export function BidPanel({ initialAuction }: Props) {
  const [currentPrice, setCurrentPrice] = useState(Number(initialAuction.currentPrice));
  const [bids, setBids] = useState<Bid[]>(initialAuction.bids || []);
  const [bidAmount, setBidAmount] = useState<number>(currentPrice + Number(initialAuction.minIncrement));
  const [errorMsg, setErrorMsg] = useState('');
  const [isLeading, setIsLeading] = useState(false);

  // Hook lắng nghe Socket (Real-time)
  useAuctionSocket(initialAuction.id, (newBid) => {
    setBids(prev => [newBid, ...prev]);
    
    const newPrice = Number(newBid.amount);
    setCurrentPrice(newPrice);
    setBidAmount(newPrice + Number(initialAuction.minIncrement));

    if (newBid.bidder.id !== 'user-123') {
      setIsLeading(false);
    }
  });

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      // Đã sửa: Xóa gán biến `const newBid =` chưa sử dụng
      await auctionService.placeBid(initialAuction.id, bidAmount, 'user-123');
      setIsLeading(true); 
    } catch (err: unknown) {
      // Đã sửa: Thay `any` bằng `unknown` và ép kiểu an toàn (Type Assertion)
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      setErrorMsg(error.response?.data?.error || error.message || 'Đã có lỗi xảy ra');
    }
  };

  const formatVND = (price: number) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <div className={`bid-panel ${isLeading ? 'is-leading' : ''}`}>
      <div className="panel-countdown">
        <span className="label">Trạng thái</span>
        <span className="timer">Kết thúc lúc {new Date(initialAuction.endTime).toLocaleString()}</span>
        <span className="panel-meta tnum">Đã có <strong>{bids.length}</strong> lượt trả giá</span>
      </div>

      <hr className="divider" />

      <div className="price-hero">
        <span className="label">Giá hiện tại</span>
        <span className="price-big is-tick">{formatVND(currentPrice)}</span>
        <span className="price-start tnum">Bước giá {formatVND(Number(initialAuction.minIncrement))}</span>
      </div>

      <hr className="divider" />

      <form className="bid-form" onSubmit={handlePlaceBid}>
        <div className="od-stack" style={{ gap: '8px' }}>
          <label className="field-label" htmlFor="bid-input">Giá trả mới</label>
          <div className="stepper">
            <button 
              type="button" 
              className="stepper-btn" 
              onClick={() => setBidAmount(prev => Math.max(currentPrice + Number(initialAuction.minIncrement), prev - Number(initialAuction.minIncrement)))}
            >−</button>
            <input
              type="text"
              id="bid-input"
              className="bid-input tnum"
              value={formatVND(bidAmount)}
              readOnly
            />
            <button 
              type="button" 
              className="stepper-btn"
              onClick={() => setBidAmount(prev => prev + Number(initialAuction.minIncrement))}
            >+</button>
          </div>
          {errorMsg && <p className="bid-error">{errorMsg}</p>}
        </div>

        <button className={`btn btn-primary btn-callout ${isLeading ? 'is-success' : ''}`} type="submit">
          Đặt giá <span>→</span>
        </button>
      </form>

      <section className="history">
        <div className="history-head">
          <span className="label">Lịch sử trả giá gần nhất</span>
        </div>
        <ul className="history-list">
          {bids.slice(0, 5).map((bid, idx) => (
            <li key={bid.id} className={idx === 0 ? 'is-highest' : ''}>
              <span className="bidder-name">{bid.bidder.fullName}</span>
              <span className="bidder-price tnum">{formatVND(Number(bid.amount))}</span>
              <span className="bidder-time">{new Date(bid.bidTime).toLocaleTimeString()}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}