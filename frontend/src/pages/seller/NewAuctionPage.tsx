import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { localDB } from '../../utils/localDB';
import type { AuctionCategory, AuctionCondition } from '../../data/mockData';

export default function SellerNewAuctionPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // States cho Form
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('Apple');
  const [category, setCategory] = useState<AuctionCategory>('laptop');
  const [condition, setCondition] = useState<AuctionCondition>('like-new');
  const [description, setDescription] = useState('');
  const [minIncrement, setMinIncrement] = useState('500.000');
  const [endsAt, setEndsAt] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    const startingPrice = Number(price.replace(/\D/g, ''));
    const increment = Number(minIncrement.replace(/\D/g, ''));
    if (!title.trim() || !startingPrice || !increment || !endsAt || !agreed) {
      setError('Vui lòng hoàn tất các trường bắt buộc và xác nhận cam kết.');
      return;
    }
    localDB.createAuction({
      title: title.trim(), brand, category, condition, description: description.trim(),
      images: imagePreviews.length > 0 ? imagePreviews : ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1400&q=90'],
      startingPrice, minIncrement: increment, endsAt: new Date(endsAt).toISOString()
    });
    navigate('/seller/auctions');
  };

  const handleImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, 5);
    imagePreviews.forEach((url) => { if (url.startsWith('blob:')) URL.revokeObjectURL(url); });
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  return (
    <>
      <div className="content">
        <div className="page-head">
          <h1>Tạo phiên đấu giá</h1>
          <p className="sub">Phiên được duyệt trước khi hiển thị. Bạn sẽ nhận email khi có kết quả.</p>
        </div>

        {/* Thanh tiến trình */}
        <ol className="stepper">
          {[
            { id: 1, label: 'Thông tin sản phẩm' },
            { id: 2, label: 'Giá và thời gian' },
            { id: 3, label: 'Xem lại' }
          ].map(step => (
            <li key={step.id} className={`step ${currentStep === step.id ? 'is-active' : ''} ${currentStep > step.id ? 'is-done' : ''}`}>
              <span className="step-dot">
                {currentStep > step.id ? '✓' : step.id}
              </span>
              <span className="step-label">{step.label}</span>
            </li>
          ))}
        </ol>

        {/* Nội dung Bước 1 */}
        {currentStep === 1 && (
          <section className="panel">
            <div className="form-grid">
              <div className="field">
                <div className="field-label-row">
                  <label htmlFor="title">Tiêu đề</label>
                  <span className="char-count">{title.length}/120</span>
                </div>
                <input
                  className="control"
                  id="title"
                  type="text"
                  maxLength={120}
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ví dụ: MacBook Pro 14 M3 2023"
                />
              </div>

              <div className="form-grid-2">
                <div className="field">
                  <label htmlFor="brand">Hãng</label>
                  <input className="control" id="brand" value={brand} onChange={(event) => setBrand(event.target.value)} />
                </div>
                <div className="field">
                  <label htmlFor="category">Danh mục</label>
                  <select className="control" id="category" value={category} onChange={(event) => setCategory(event.target.value as AuctionCategory)}>
                    <option value="laptop">Laptop</option>
                    <option value="phone">Điện thoại</option><option value="tablet">Tablet</option><option value="audio">Âm thanh</option><option value="camera">Máy ảnh / Flycam</option><option value="gaming">Gaming</option><option value="fashion">Thời trang</option><option value="beauty">Mỹ phẩm</option><option value="fitness">Đồ tập gym</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="condition">Tình trạng</label>
                  <select className="control" id="condition" value={condition} onChange={(event) => setCondition(event.target.value as AuctionCondition)}>
                    <option value="like-new">Like New</option>
                    <option value="new">Mới</option><option value="used">Đã qua sử dụng</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label>Ảnh sản phẩm</label>
                <label className="upload-zone" htmlFor="product-images">
                  <span className="up-title">Kéo thả ảnh hoặc click để chọn</span>
                  <span className="up-sub">Tối đa 5 ảnh, mỗi ảnh ≤ 5MB</span>
                  <input id="product-images" type="file" accept="image/*" multiple hidden onChange={handleImages} />
                </label>
                {imagePreviews.length > 0 && <div className="upload-preview">{imagePreviews.map((src, index) => <img key={src} src={src} alt={`Ảnh xem trước ${index + 1}`} />)}</div>}
              </div>

              <div className="field">
                <label htmlFor="desc">Mô tả</label>
                <textarea className="control" id="desc" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Mô tả tình trạng thật, phụ kiện kèm theo..."></textarea>
              </div>
            </div>
          </section>
        )}

        {/* Nội dung Bước 2 */}
        {currentStep === 2 && (
          <section className="panel">
            <div className="form-grid">
              <div className="form-grid-2">
                <div className="field">
                  <label htmlFor="start-price">Giá khởi điểm (VNĐ)</label>
                  <input
                    className="control"
                    id="start-price"
                    type="text"
                    value={price}
                    onChange={e => setPrice(e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, "."))}
                    placeholder="28.000.000"
                  />
                </div>
                <div className="field">
                  <label htmlFor="reserve-price">Giá ẩn (Không bắt buộc)</label>
                  <input className="control" id="reserve-price" type="text" placeholder="30.000.000" />
                </div>
              </div>
              <div className="field">
                <label htmlFor="increment">Bước giá (VNĐ)</label>
                <input className="control" id="increment" value={minIncrement} onChange={(event) => setMinIncrement(event.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.'))} />
              </div>
              <div className="field">
                <label htmlFor="end-datetime">Thời gian kết thúc</label>
                <input className="control" type="datetime-local" id="end-datetime" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} />
              </div>
            </div>
          </section>
        )}

        {/* Nội dung Bước 3 */}
        {currentStep === 3 && (
          <section className="panel">
            <h3 style={{ marginBottom: '16px' }}>Xác nhận thông tin</h3>
            <ul style={{ lineHeight: '2' }}>
              <li><strong>Sản phẩm:</strong> {title || 'Chưa nhập'}</li>
              <li><strong>Giá khởi điểm:</strong> {price ? price + 'đ' : 'Chưa nhập'}</li>
              <li><strong>Phí nền tảng (7%):</strong> Thu khi giao dịch thành công</li>
            </ul>
            <div style={{ marginTop: '24px' }}>
              <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} style={{ width: '18px', height: '18px' }} />
                <span>Tôi cam kết thông tin trên là chính xác và có quyền bán sản phẩm này.</span>
              </label>
            </div>
            {error && <p className="form-error" role="alert">{error}</p>}
          </section>
        )}
      </div>

      {/* Sticky Footer Điều Hướng */}
      <div className="sticky-foot">
        <div className="sticky-foot-inner">
          {currentStep > 1 ? (
            <button type="button" className="btn btn-ghost" onClick={prevStep}>Quay lại</button>
          ) : (
            <button type="button" className="btn btn-ghost">Lưu nháp</button>
          )}

          {currentStep < 3 ? (
            <button type="button" className="btn btn-primary" onClick={nextStep}>Tiếp tục</button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>Gửi duyệt</button>
          )}
        </div>
      </div>
    </>
  );
}
