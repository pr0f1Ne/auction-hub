import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SellerNewAuctionPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // States cho Form
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    // Gọi API lưu dữ liệu ở đây
    alert('Đã gửi duyệt thành công!');
    navigate('/seller/dashboard'); // Quay về dashboard sau khi gửi
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
                  <label htmlFor="category">Danh mục</label>
                  <select className="control" id="category">
                    <option value="laptop">Laptop</option>
                    <option value="dien-thoai">Điện thoại</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="condition">Tình trạng</label>
                  <select className="control" id="condition">
                    <option value="like-new">Like New</option>
                    <option value="moi">Mới</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label>Ảnh sản phẩm</label>
                <div className="upload-zone">
                  <span className="up-title">Kéo thả ảnh hoặc click để chọn</span>
                  <span className="up-sub">Tối đa 5 ảnh, mỗi ảnh ≤ 5MB</span>
                </div>
              </div>

              <div className="field">
                <label htmlFor="desc">Mô tả</label>
                <textarea className="control" id="desc" placeholder="Mô tả tình trạng thật, phụ kiện kèm theo..."></textarea>
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
                <label htmlFor="end-datetime">Thời gian kết thúc</label>
                <input className="control" type="datetime-local" id="end-datetime" />
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
                <input type="checkbox" style={{ width: '18px', height: '18px' }} />
                <span>Tôi cam kết thông tin trên là chính xác và có quyền bán sản phẩm này.</span>
              </label>
            </div>
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