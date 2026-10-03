// src/pages/buyer/AuctionDetail/ProductGallery.tsx
import { useState } from 'react';

interface Props {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: Props) {
  // Nếu dữ liệu API chưa có ảnh, dùng mảng rỗng để tránh lỗi
  const displayImages = images?.length > 0 ? images : ['/images/laptop.jpg'];
  const [activeImage, setActiveImage] = useState(displayImages[0]);

  return (
    <section className="gallery" id="gallery" aria-label="Thư viện ảnh sản phẩm">
      <figure className="gallery-main">
        <img
          id="main-image"
          src={activeImage}
          alt={title}
          width="800"
          height="800"
        />
      </figure>

      <div className="gallery-actions">
        <span className="gallery-meta tnum">{displayImages.length} ảnh thật của sản phẩm</span>
        <button className="gallery-link" id="lightbox-open" type="button">
          <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.5-3.5a2 2 0 0 0-2.8 0L6 20" />
          </svg>
          Xem tất cả ảnh
        </button>
      </div>

      <ul className="gallery-thumbs" aria-label="Chọn ảnh">
        {displayImages.map((img, index) => (
          <li className="thumb-wrap" key={index}>
            <button
              className={`gallery-thumb ${activeImage === img ? 'is-active' : ''}`}
              type="button"
              onClick={() => setActiveImage(img)}
              aria-label={`Ảnh ${index + 1}`}
            >
              <img
                src={img}
                alt={`${title} ${index + 1}`}
                width="800"
                height="800"
                loading="lazy"
              />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}