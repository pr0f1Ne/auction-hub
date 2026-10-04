import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { localDB } from "../../utils/localDB";

// ── ĐỊNH NGHĨA KIỂU DỮ LIỆU (STRICT TYPES) ──
type CategoryType = "all" | "laptop" | "phone" | "tablet" | "accessory" | "fashion" | "beauty" | "fitness";
type ConditionType = "new" | "like" | "used";
type StatusType = "all" | "running" | "ending" | "upcoming";

interface AuctionItem {
  id: string;
  title: string;
  price: number;
  timeLeft: number;
  img: string;
  cat: CategoryType;
  cond: ConditionType;
  status: StatusType;
  verified: boolean;
  createdAt: string;
}

interface FilterState {
  cat: CategoryType;
  status: StatusType;
  cond: ConditionType[];
  verified: boolean;
  priceFrom: string;
  priceTo: string;
}

// ── BỘ DỮ LIỆU MẪU ──
const MOCK_POOL: AuctionItem[] = localDB.getAuctions().map((auction) => {
  const timeLeft = Math.max(
    0,
    Math.floor((new Date(auction.endsAt).getTime() - Date.now()) / 1000),
  );
  const cat: CategoryType =
    auction.category === "phone" ||
    auction.category === "laptop" ||
    auction.category === "tablet" ||
    auction.category === "fashion" ||
    auction.category === "beauty" ||
    auction.category === "fitness"
      ? auction.category
      : "accessory";
  const cond: ConditionType =
    auction.condition === "like-new" ? "like" : auction.condition;
  return {
    id: auction.id,
    title: auction.title,
    price: auction.currentPrice,
    timeLeft,
    img: auction.images[0],
    cat,
    cond,
    status:
      timeLeft < 3600
        ? "ending"
        : auction.status === "pending"
          ? "upcoming"
          : "running",
    verified: auction.sellerVerified,
    createdAt: auction.createdAt,
  };
});

const CAT_LABELS: Record<CategoryType, string> = {
  all: "Tất cả",
  laptop: "Laptop",
  phone: "Điện thoại",
  tablet: "Tablet",
  accessory: "Phụ kiện",
  fashion: "Thời trang",
  beauty: "Mỹ phẩm",
  fitness: "Đồ tập gym",
};
const COND_LABELS: Record<ConditionType, string> = {
  new: "Mới",
  like: "Like New",
  used: "Đã qua sử dụng",
};

const CATEGORY_LIST: CategoryType[] = [
  "all",
  "phone",
  "laptop",
  "tablet",
  "accessory",
  "fashion",
  "beauty",
  "fitness",
];
const CONDITION_LIST: ConditionType[] = ["new", "like", "used"];
const STATUS_LABELS: Record<StatusType, string> = {
  all: "Tất cả",
  running: "Đang chạy",
  ending: "Sắp kết thúc (<1h)",
  upcoming: "Sắp diễn ra",
};
const STATUS_LIST: StatusType[] = ["all", "running", "ending", "upcoming"];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  // ── STATES ──
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>(queryParam);
  const [activeSearch, setActiveSearch] = useState<string>(queryParam);
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [shownCount, setShownCount] = useState<number>(6);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [watchIds, setWatchIds] = useState<string[]>(() => localDB.getWatchlist());

  const [filters, setFilters] = useState<FilterState>({
    cat: "all",
    status: "all",
    cond: [],
    verified: false,
    priceFrom: "",
    priceTo: "",
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterState>(filters);
  const [timeTicker, setTimeTicker] = useState<number>(0);

  // ── TICKER ĐẾM NGƯỢC THỜI GIAN ──
  useEffect(() => {
    const timer = setInterval(() => setTimeTicker((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // ── FIX CASCADING RENDER: TẮT LOADING SAU KHI MOUNT ──
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const triggerLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };
  const toggleWatch = (auctionId: string) => {
    localDB.toggleWatch(auctionId);
    setWatchIds(localDB.getWatchlist());
  };

  // ── HÀM XỬ LÝ SỰ KIỆN ──
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanSearch = searchInput.trim();
    setActiveSearch(cleanSearch);
    if (cleanSearch) {
      setSearchParams({ q: cleanSearch });
    } else {
      setSearchParams({});
    }
    triggerLoading();
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setActiveSearch("");
    setSearchParams({});
    triggerLoading();
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    setShownCount(6);
    triggerLoading();
  };

  const applyFilterSelection = (next: FilterState) => {
    setFilters(next);
    setAppliedFilters(next);
    setShownCount(6);
    triggerLoading();
  };

  const handleCondChange = (val: ConditionType | "all") => {
    applyFilterSelection({ ...filters, cond: val === "all" ? [] : [val] });
  };

  const clearAllFilters = () => {
    const empty: FilterState = {
      cat: "all",
      status: "all",
      cond: [],
      verified: false,
      priceFrom: "",
      priceTo: "",
    };
    setFilters(empty);
    setAppliedFilters(empty);
    triggerLoading();
  };

  const removeChip = (key: string) => {
    const newFilters: FilterState = { ...appliedFilters };
    if (key === "cat") newFilters.cat = "all";
    else if (key === "status") newFilters.status = "all";
    else if (key === "verified") newFilters.verified = false;
    else if (key === "price") {
      newFilters.priceFrom = "";
      newFilters.priceTo = "";
    } else if (key.startsWith("cond-")) {
      const condVal = key.replace("cond-", "") as ConditionType;
      newFilters.cond = newFilters.cond.filter((c) => c !== condVal);
    }
    setFilters(newFilters);
    setAppliedFilters(newFilters);
    triggerLoading();
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
    triggerLoading();
  };

  // ── COMPUTE KẾT QUẢ HIỂN THỊ ──
  const filteredResults = useMemo(() => {
    let result: AuctionItem[] = [...MOCK_POOL];

    if (activeSearch) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(activeSearch.toLowerCase()),
      );
    }

    const keywordFoundNothing = activeSearch.length > 0 && result.length === 0;

    if (!keywordFoundNothing) {
      if (appliedFilters.cat !== "all")
        result = result.filter((i) => i.cat === appliedFilters.cat);
      if (appliedFilters.status !== "all")
        result = result.filter((i) => i.status === appliedFilters.status);
      if (appliedFilters.verified) result = result.filter((i) => i.verified);
      if (appliedFilters.cond.length > 0)
        result = result.filter((i) => appliedFilters.cond.includes(i.cond));

      const pFrom = parseInt(appliedFilters.priceFrom.replace(/\D/g, ""), 10);
      const pTo = parseInt(appliedFilters.priceTo.replace(/\D/g, ""), 10);
      if (!isNaN(pFrom)) result = result.filter((i) => i.price >= pFrom);
      if (!isNaN(pTo)) result = result.filter((i) => i.price <= pTo);
    }

    if (sortOrder === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortOrder === "price-desc")
      result.sort((a, b) => b.price - a.price);
    else if (sortOrder === "ending")
      result.sort((a, b) => a.timeLeft - b.timeLeft);
    else if (sortOrder === "newest")
      result.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

    return { list: result, keywordFoundNothing };
  }, [activeSearch, appliedFilters, sortOrder]);

  const { list, keywordFoundNothing } = filteredResults;
  const visibleList = list.slice(0, shownCount);

  // Check if we need to show chips
  const hasActiveFilters =
    appliedFilters.cat !== "all" ||
    appliedFilters.status !== "all" ||
    appliedFilters.verified ||
    appliedFilters.cond.length > 0 ||
    appliedFilters.priceFrom !== "" ||
    appliedFilters.priceTo !== "";

  // ── FORMATTER ──
  const formatVND = (n: number) =>
    n.toLocaleString("vi-VN").replace(/[.,](\d{3})/g, (m, g) => "." + g) + "đ";

  const formatTime = (totalSec: number) => {
    const sec = Math.max(0, totalSec - timeTicker);
    if (sec <= 0) return "Đã kết thúc";

    if (sec > 86400) {
      const days = Math.floor(sec / 86400);
      return "Còn " + days + " ngày";
    }

    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    const pad = (v: number) => (v < 10 ? "0" + v : v.toString());
    return pad(h) + ":" + pad(m) + ":" + pad(s);
  };

  return (
    <main id="main">
      <div className="container">
        <nav className="crumbs" aria-label="Chuỗi điều hướng">
          <Link to="/">Trang chủ</Link>
          <span className="sep" aria-hidden="true">
            /
          </span>
          <Link to="/search">Tìm kiếm</Link>
          {activeSearch ? (
            <React.Fragment>
              <span className="sep" aria-hidden="true">
                /
              </span>
              <span>{activeSearch}</span>
            </React.Fragment>
          ) : null}
        </nav>

        <div className="results-layout">
          <button
            type="button"
            className="filter-mobile-toggle"
            aria-expanded={filtersOpen}
            aria-controls="search-filters"
            onClick={() => setFiltersOpen((open) => !open)}
          >
            <span>Bộ lọc</span>
            <span aria-hidden="true">{filtersOpen ? "Thu gọn" : "Mở"}</span>
          </button>
          {/* ═══ BỘ LỌC SIDEBAR ═══ */}
          <aside id="search-filters" className={`search-sidebar ${filtersOpen ? "is-open" : ""}`} aria-label="Bộ lọc tìm kiếm">
            <div className="filter-head">
              <h2>Bộ lọc</h2>
              <button
                type="button"
                className="filter-reset"
                id="reset-all"
                onClick={clearAllFilters}
              >
                Xóa tất cả
              </button>
            </div>

            <div className="filter-group">
              <span className="fg-title" id="fg-cat">
                Danh mục
              </span>
              <div
                className="filter-opts"
                role="radiogroup"
                aria-labelledby="fg-cat"
              >
                {CATEGORY_LIST.map((cat) => (
                  <label className="filter-opt" key={cat}>
                    <input
                      type="radio"
                      name="f-cat"
                      checked={filters.cat === cat}
                      onChange={() => applyFilterSelection({ ...filters, cat })}
                    />
                    {CAT_LABELS[cat]}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <span className="fg-title" id="fg-price">
                Khoảng giá
              </span>
              <div className="price-fields" aria-labelledby="fg-price">
                <input
                  type="text"
                  inputMode="numeric"
                  id="price-from"
                  placeholder="Từ"
                  aria-label="Giá từ"
                  value={filters.priceFrom}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, priceFrom: e.target.value }))
                  }
                />
                <input
                  type="text"
                  inputMode="numeric"
                  id="price-to"
                  placeholder="Đến"
                  aria-label="Giá đến"
                  value={filters.priceTo}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, priceTo: e.target.value }))
                  }
                />
              </div>
              <button
                type="button"
                className="btn-apply"
                id="apply-price"
                onClick={applyFilters}
              >
                Áp dụng
              </button>
            </div>

            <div className="filter-group">
              <span className="fg-title" id="fg-cond">
                Tình trạng
              </span>
              <div
                className="filter-opts"
                role="radiogroup"
                aria-labelledby="fg-cond"
              >
                <label className="filter-opt">
                  <input type="radio" name="f-cond" checked={filters.cond.length === 0} onChange={() => handleCondChange("all")} />
                  Tất cả
                </label>
                {CONDITION_LIST.map((cond) => (
                  <label className="filter-opt" key={cond}>
                    <input
                      type="radio"
                      name="f-cond"
                      checked={filters.cond.includes(cond)}
                      onChange={() => handleCondChange(cond)}
                    />
                    {COND_LABELS[cond]}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <span className="fg-title" id="fg-status">
                Trạng thái
              </span>
              <div
                className="filter-opts"
                role="radiogroup"
                aria-labelledby="fg-status"
              >
                {STATUS_LIST.map((status) => (
                  <label className="filter-opt" key={status}>
                    <input type="radio" name="f-status" checked={filters.status === status} onChange={() => applyFilterSelection({ ...filters, status })} />
                    {STATUS_LABELS[status]}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <span className="fg-title" id="fg-seller">
                Người bán
              </span>
              <div
                className="filter-opts"
                role="group"
                aria-labelledby="fg-seller"
              >
                <label className="filter-opt">
                  <input
                    type="checkbox"
                    name="f-verified"
                    checked={filters.verified}
                    onChange={(e) => applyFilterSelection({ ...filters, verified: e.target.checked })}
                  />{" "}
                  Đã xác minh
                </label>
              </div>
            </div>
          </aside>

          {/* ═══ KẾT QUẢ TÌM KIẾM ═══ */}
          <section
            className="results-main"
            aria-label="Kết quả tìm kiếm"
            aria-busy={isLoading}
          >
            {/* TRẠNG THÁI 1: SEARCH BAR LOADING */}
            {isLoading ? (
              <div className="search-bar">
                <span className="sk sk" aria-hidden="true"></span>
              </div>
            ) : (
              <form
                className="search-bar"
                id="search-form"
                role="search"
                onSubmit={handleSearchSubmit}
              >
                <svg
                  className="search-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <label
                  className="sr-only"
                  htmlFor="search-input"
                  style={{
                    position: "absolute",
                    width: 1,
                    height: 1,
                    overflow: "hidden",
                    clip: "rect(0 0 0 0)",
                  }}
                >
                  Tìm kiếm phiên đấu giá
                </label>
                <input
                  id="search-input"
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  autoComplete="off"
                  aria-label="Tìm kiếm phiên đấu giá"
                  placeholder="Tìm phiên đấu giá..."
                />
                <button
                  type="button"
                  className="search-clear"
                  id="search-clear"
                  aria-label="Xóa từ khóa"
                  onClick={handleClearSearch}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </form>
            )}

            {/* Render Chips only if not loading and has filters */}
            {!isLoading && hasActiveFilters && (
              <div className="chips" aria-label="Bộ lọc đang áp dụng">
                {appliedFilters.cat !== "all" && (
                  <span className="chip">
                    {CAT_LABELS[appliedFilters.cat]}
                    <button
                      type="button"
                      aria-label="Bỏ bộ lọc Danh mục"
                      onClick={() => removeChip("cat")}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        aria-hidden="true"
                      >
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                  </span>
                )}
                {appliedFilters.status !== "all" && (
                  <span className="chip">
                    {STATUS_LABELS[appliedFilters.status]}
                    <button type="button" aria-label="Bỏ bộ lọc Trạng thái" onClick={() => removeChip("status")}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
                    </button>
                  </span>
                )}
                {appliedFilters.verified && (
                  <span className="chip">
                    Đã xác minh
                    <button
                      type="button"
                      aria-label="Bỏ bộ lọc Đã xác minh"
                      onClick={() => removeChip("verified")}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        aria-hidden="true"
                      >
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                  </span>
                )}
                {appliedFilters.cond.map((c) => (
                  <span className="chip" key={c}>
                    {COND_LABELS[c]}
                    <button
                      type="button"
                      aria-label="Bỏ bộ lọc Tình trạng"
                      onClick={() => removeChip("cond-" + c)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        aria-hidden="true"
                      >
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                  </span>
                ))}
                {(appliedFilters.priceFrom || appliedFilters.priceTo) && (
                  <span className="chip">
                    Giá {appliedFilters.priceFrom || "0"} -{" "}
                    {appliedFilters.priceTo || "∞"}
                    <button
                      type="button"
                      aria-label="Bỏ bộ lọc Khoảng giá"
                      onClick={() => removeChip("price")}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        aria-hidden="true"
                      >
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  className="chip-clear"
                  id="clear-filters"
                  onClick={clearAllFilters}
                >
                  Xóa tất cả
                </button>
              </div>
            )}

            {/* TRẠNG THÁI 1: ĐANG TẢI KẾT QUẢ (SKELETON) */}
            {isLoading ? (
              <React.Fragment>
                <div className="results-head">
                  <h1 className="results-title">
                    <span className="sk" aria-hidden="true"></span>
                    <span
                      className="sr-only"
                      style={{
                        position: "absolute",
                        width: 1,
                        height: 1,
                        overflow: "hidden",
                        clip: "rect(0 0 0 0)",
                      }}
                    >
                      Đang tải kết quả tìm kiếm
                    </span>
                  </h1>
                  <div className="sort-picker">
                    <select id="sort-select" disabled>
                      <option>Mới nhất</option>
                    </select>
                  </div>
                </div>
                <p className="result-note">
                  <span className="sk" aria-hidden="true"></span>
                </p>

                <div className="sale-grid" aria-hidden="true">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <article className="sale-card" key={i}>
                      <span className="sk sk-media"></span>
                      <div className="sale-body">
                        <span className="sk sk-line w60"></span>
                        <span className="sk sk-line w40"></span>
                        <span className="sk sk-price w50"></span>
                        <span className="sk sk-count"></span>
                        <span className="sk sk-btn"></span>
                      </div>
                    </article>
                  ))}
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {/* KẾT QUẢ ĐÃ TẢI */}
                <div className="results-head">
                  <h1 className="results-title">
                    {list.length} phiên{" "}
                    {activeSearch ? (
                      <React.Fragment>
                        cho <span className="term">'{activeSearch}'</span>
                      </React.Fragment>
                    ) : null}
                  </h1>
                  <div className="sort-picker">
                    <label
                      htmlFor="sort-select"
                      className="sr-only"
                      style={{
                        position: "absolute",
                        width: 1,
                        height: 1,
                        overflow: "hidden",
                        clip: "rect(0 0 0 0)",
                      }}
                    >
                      Sắp xếp kết quả
                    </label>
                    <select
                      id="sort-select"
                      value={sortOrder}
                      onChange={handleSortChange}
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="ending">Sắp kết thúc</option>
                      <option value="price-asc">Giá thấp-cao</option>
                      <option value="price-desc">Giá cao-thấp</option>
                    </select>
                  </div>
                </div>

                <p className="result-note" id="result-note">
                  {list.length > 0
                    ? "Đang hiển thị " +
                      visibleList.length +
                      " phiên khớp bộ lọc."
                    : ""}
                </p>

                <div id="results-holder">
                  {/* TRẠNG THÁI 3: TÌM KHÔNG RA TỪ KHÓA (NO RESULTS) */}
                  {keywordFoundNothing ? (
                    <React.Fragment>
                      <div className="empty-panel">
                        <svg
                          className="empty-icon"
                          width="44"
                          height="44"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <circle cx="11" cy="11" r="7" />
                          <path d="m21 21-4.35-4.35M8 11h6" />
                        </svg>
                        <h2>Không tìm thấy phiên nào cho '{activeSearch}'</h2>
                        <p>
                          Thử từ khóa ngắn hơn, hoặc xem các phiên tương tự bên
                          dưới.
                        </p>
                      </div>

                      <h2 className="related-head">Phiên tương tự</h2>
                      <div className="sale-grid">
                        {MOCK_POOL.slice(0, 3).map((item) => (
                          <article className="sale-card search-product-card" data-status={item.status} key={item.id}>
                            <button type="button" className="watch-heart" aria-pressed={watchIds.includes(item.id)} aria-label={watchIds.includes(item.id) ? 'Bỏ theo dõi' : 'Thêm vào theo dõi'} onClick={() => toggleWatch(item.id)}>
                              <svg className="ic-heart" viewBox="0 0 24 24" fill={watchIds.includes(item.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" /></svg>
                              <svg className="ic-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
                            </button>
                            <Link className="media" to={"/auction/" + item.id}>
                              <img
                                src={item.img}
                                alt={item.title}
                                width="800"
                                height="800"
                                loading="lazy"
                              />
                              <span className="search-card-condition">{COND_LABELS[item.cond]}</span>
                              {item.status === "ending" && <span className="search-card-urgent">Sắp kết thúc</span>}
                            </Link>
                            <div className="sale-body">
                              <h3 className="card-title">
                                <Link to={"/auction/" + item.id}>
                                  {item.title}
                                </Link>
                              </h3>
                              <div className="sale-price-row">
                                <span className="price-grid">
                                  <span className="price-label">
                                    Giá hiện tại
                                  </span>
                                  <span className="sale-price tnum">
                                    {formatVND(item.price)}
                                  </span>
                                </span>
                                <span className="countdown-wrap">
                                  <span className="countdown-time">
                                    {formatTime(item.timeLeft)}
                                  </span>
                                  <span className="price-label">
                                    Kết thúc sau
                                  </span>
                                </span>
                              </div>
                              <span className="search-card-seller">{item.verified ? "✓ Người bán đã xác minh" : "Người bán mới"}</span>
                              <Link
                                to={"/auction/" + item.id}
                                className="btn btn-primary"
                                type="button"
                              >
                                Đặt giá
                              </Link>
                            </div>
                          </article>
                        ))}
                      </div>
                    </React.Fragment>
                  ) : list.length === 0 ? (
                    /* TRẠNG THÁI 4: LỌC QUÁ GẮT (EMPTY FILTER) */
                    <div className="empty-panel" id="empty-panel">
                      <svg
                        className="empty-icon"
                        width="44"
                        height="44"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.64 5.64l1.42 1.42M16.94 16.94l1.42 1.42M18.36 5.64l-1.42 1.42M7.06 16.94l-1.42 1.42" />
                        <circle cx="12" cy="12" r="4" />
                      </svg>
                      <p>Không có phiên nào khớp với bộ lọc.</p>
                      <button
                        type="button"
                        className="btn btn-primary"
                        id="reset-filters"
                        onClick={clearAllFilters}
                      >
                        Xóa filter
                      </button>
                    </div>
                  ) : (
                    /* KẾT QUẢ CÓ DATA CHUẨN (GIỐNG DESIGN) */
                    <React.Fragment>
                      <div
                        className="sale-grid"
                        id="sale-grid"
                        aria-live="polite"
                      >
                        {visibleList.map((item) => (
                          <article className="sale-card search-product-card" data-status={item.status} key={item.id}>
                            <button type="button" className="watch-heart" aria-pressed={watchIds.includes(item.id)} aria-label={watchIds.includes(item.id) ? 'Bỏ theo dõi' : 'Thêm vào theo dõi'} onClick={() => toggleWatch(item.id)}>
                              <svg className="ic-heart" viewBox="0 0 24 24" fill={watchIds.includes(item.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" /></svg>
                              <svg className="ic-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
                            </button>
                            <Link className="media" to={"/auction/" + item.id}>
                              <img
                                src={item.img}
                                alt={item.title}
                                width="800"
                                height="800"
                                loading="lazy"
                              />
                              <span className="search-card-condition">{COND_LABELS[item.cond]}</span>
                              {item.status === "ending" && <span className="search-card-urgent">Sắp kết thúc</span>}
                            </Link>
                            <div className="sale-body">
                              <h3 className="card-title">
                                <Link to={"/auction/" + item.id}>
                                  {item.title}
                                </Link>
                              </h3>
                              <div className="sale-price-row">
                                <span className="price-grid">
                                  <span className="price-label">
                                    Giá hiện tại
                                  </span>
                                  <span className="sale-price tnum">
                                    {formatVND(item.price)}
                                  </span>
                                </span>
                                <span className="countdown-wrap">
                                  <span className="countdown-time">
                                    {formatTime(item.timeLeft)}
                                  </span>
                                  <span className="price-label">
                                    {item.status === "ending"
                                      ? "Sắp kết thúc sau"
                                      : item.status === "upcoming"
                                        ? "Bắt đầu sau"
                                        : "Kết thúc sau"}
                                  </span>
                                </span>
                              </div>
                              <span className="search-card-seller">{item.verified ? "✓ Người bán đã xác minh" : "Người bán mới"}</span>
                              <Link
                                to={"/auction/" + item.id}
                                className="btn btn-primary"
                                type="button"
                              >
                                Đặt giá
                              </Link>
                            </div>
                          </article>
                        ))}
                      </div>

                      {shownCount < list.length && (
                        <div className="load-more" id="load-more-wrap">
                          <button
                            type="button"
                            className="btn btn-ghost"
                            id="load-more"
                            onClick={() => setShownCount((p) => p + 6)}
                          >
                            Tải thêm
                          </button>
                        </div>
                      )}
                    </React.Fragment>
                  )}
                </div>
              </React.Fragment>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
