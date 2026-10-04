import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { localDB } from "../../utils/localDB"; // Nhớ kiểm tra đường dẫn import này cho đúng

const SLIDE_IMAGES = [
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop",
];

export function AuthPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [isSuccess, setIsSuccess] = useState(false);
  const view = isSuccess
    ? "success"
    : pathname.includes("forgot-password")
      ? "forgot"
    : pathname.includes("register")
      ? "register"
      : "login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [emailStatus, setEmailStatus] = useState<"idle" | "ok" | "error">(
    "idle",
  );
  const [emailMsg, setEmailMsg] = useState("");
  const [nameError, setNameError] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [slideIndex, setSlideIndex] = useState(0);
  const [role, setRole] = useState<"buyer" | "seller">(() => pathname.includes("seller") ? "seller" : "buyer");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("TP.HCM");
  const [businessType, setBusinessType] = useState<"individual" | "business">("individual");

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % SLIDE_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const pwdScore = (() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(4, score);
  })();

  const handleEmailCheck = () => {
    if (!email) return setEmailStatus("idle");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setEmailStatus("error");
      setEmailMsg("Email không hợp lệ.");
      return;
    }
    setEmailStatus("ok");
    setEmailMsg("Email hợp lệ");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(false);
    setTermsError(false);
    setSubmitError("");
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    if (!terms) {
      setTermsError(true);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setEmailStatus("error");
      setEmailMsg("Email không hợp lệ.");
      return;
    }
    if (pwdScore < 2) {
      setSubmitError("Mật khẩu cần ít nhất 8 ký tự và kết hợp chữ hoa, chữ thường hoặc số.");
      return;
    }
    if (role === "seller" && (!/^0\d{9}$/.test(phone.replace(/\s/g, "")) || !city)) {
      setSubmitError("Vui lòng nhập số điện thoại 10 chữ số và khu vực hoạt động của cửa hàng.");
      return;
    }

    setIsSubmitting(true);

    // Truyền thêm role vào DB
    const res = localDB.register(email, password, name, role, role === "seller" ? { phone: phone.replace(/\s/g, ""), city, businessType } : undefined);

    setTimeout(() => {
      setIsSubmitting(false);
      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate(role === "seller" ? "/seller/dashboard" : "/profile", { replace: true });
        }, 1500);
      } else {
        setEmailStatus("error");
        setEmailMsg(res.message || "Lỗi hệ thống");
      }
    }, 800);
  };
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setLoginError(true);
      return;
    }

    const res = localDB.login(email, password);
    if (res.success) {
      setLoginError(false);
      setIsSuccess(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } else {
      setLoginError(true);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setSubmitError("Vui lòng nhập email hợp lệ.");
      return;
    }
    setIsSuccess(true);
  };

  return (
    <div className="auth-shell">
      <main className="form-panel">
        <div className="form-card">
          <div
            className="form-top"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 32,
            }}
          >
            <Link
              className="brand"
              to="/"
              style={{ fontWeight: 600, fontSize: 19 }}
            >
              AuctionHub
              <span className="brand-dot" style={{ color: "var(--accent)" }}>
                .
              </span>
            </Link>
            <Link
              className="back-link"
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "var(--muted)",
                textDecoration: "none",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Quay về trang chủ
            </Link>
          </div>

          {view === "register" && (
            <form onSubmit={handleRegister}>
              <div className="form-head" style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 32, fontWeight: 300, margin: 0 }}>
                  Tạo tài khoản{" "}
                  <span style={{ color: "var(--accent)" }}>miễn phí</span>
                </h1>
                <p style={{ color: "var(--muted)", marginTop: 8 }}>
                  Bắt đầu đấu giá trong 2 phút. Không cần thẻ tín dụng.
                </p>
              </div>

              <div
                className="verified"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "5px 12px",
                  background: "var(--surface-sky)",
                  color: "var(--color-new-text)",
                  borderRadius: 99,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span>1.240 người bán đã xác minh</span>
              </div>

              <fieldset className="account-type" disabled={isSubmitting}>
                <legend>Loại tài khoản</legend>
                <label className={role === "buyer" ? "is-selected" : ""}>
                  <input type="radio" name="role" value="buyer" checked={role === "buyer"} onChange={() => setRole("buyer")} />
                  <span className="account-type-icon" aria-hidden="true">◎</span>
                  <span><strong>Người mua</strong><small>Tham gia đấu giá và theo dõi sản phẩm</small></span>
                </label>
                <label className={role === "seller" ? "is-selected" : ""}>
                  <input type="radio" name="role" value="seller" checked={role === "seller"} onChange={() => setRole("seller")} />
                  <span className="account-type-icon" aria-hidden="true">▣</span>
                  <span><strong>Người bán</strong><small>Đăng sản phẩm và quản lý đơn hàng</small></span>
                </label>
              </fieldset>

              <div
                className="social-row"
                style={{ display: "flex", gap: 12, marginTop: 24 }}
              >
                <button
                  className="btn-social"
                  type="button"
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Google
                </button>
                <button
                  className="btn-social"
                  type="button"
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Facebook
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  margin: "24px 0",
                  color: "var(--muted)",
                  fontSize: 13,
                }}
              >
                <span
                  style={{ flex: 1, height: 1, background: "var(--border)" }}
                ></span>
                hoặc đăng ký bằng email
                <span
                  style={{ flex: 1, height: 1, background: "var(--border)" }}
                ></span>
              </div>

              <div className="field" style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  Email
                </label>
                <div
                  className={`input-wrap has-lead ${emailStatus === "error" ? "has-error" : emailStatus === "ok" ? "is-ok" : ""}`}
                  style={{ position: "relative" }}
                >
                  <span
                    className="lead"
                    style={{ position: "absolute", left: 14, top: 14 }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                  </span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleEmailCheck}
                    type="email"
                    placeholder="ban@email.com"
                    disabled={isSubmitting}
                    style={{
                      width: "100%",
                      height: 48,
                      paddingLeft: 44,
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                      outline: "none",
                    }}
                  />
                </div>
                {emailStatus !== "idle" && (
                  <p
                    style={{
                      margin: "6px 0 0",
                      fontSize: 13,
                      color:
                        emailStatus === "error"
                          ? "var(--danger-text)"
                          : "var(--color-live-text)",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {emailStatus === "error" ? "⚠️ " : "✓ "}
                    {emailMsg}
                  </p>
                )}
              </div>

              <div className="field" style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  Mật khẩu
                </label>
                <div
                  className={`input-wrap has-lead has-trail ${password && pwdScore < 2 ? "has-error" : ""}`}
                  style={{ position: "relative" }}
                >
                  <span
                    className="lead"
                    style={{ position: "absolute", left: 14, top: 14 }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Tối thiểu 8 ký tự"
                    disabled={isSubmitting}
                    style={{
                      width: "100%",
                      height: 48,
                      paddingLeft: 44,
                      paddingRight: 44,
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                    style={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      height: 32,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--muted)",
                    }}
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>

                {password && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                      {[1, 2, 3, 4].map((i) => (
                        <i
                          key={i}
                          style={{
                            flex: 1,
                            height: 4,
                            borderRadius: 2,
                            background:
                              i <= pwdScore
                                ? pwdScore < 2
                                  ? "var(--danger)"
                                  : pwdScore < 4
                                    ? "var(--color-live)"
                                    : "var(--accent)"
                                : "var(--border)",
                          }}
                        ></i>
                      ))}
                    </div>
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 8,
                        fontSize: 12,
                      }}
                    >
                      <li
                        style={{
                          color:
                            password.length >= 8
                              ? "var(--color-live-text)"
                              : "var(--muted)",
                        }}
                      >
                        ✓ Ít nhất 8 ký tự
                      </li>
                      <li
                        style={{
                          color:
                            /[a-z]/.test(password) && /[A-Z]/.test(password)
                              ? "var(--color-live-text)"
                              : "var(--muted)",
                        }}
                      >
                        ✓ Hoa & thường
                      </li>
                      <li
                        style={{
                          color: /\d/.test(password)
                            ? "var(--color-live-text)"
                            : "var(--muted)",
                        }}
                      >
                        ✓ Có số
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="field" style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  {role === "seller" ? "Tên cửa hàng" : "Họ và tên"}
                </label>
                <div
                  className={`input-wrap has-lead ${nameError ? "has-error" : ""}`}
                  style={{ position: "relative" }}
                >
                  <span
                    className="lead"
                    style={{ position: "absolute", left: 14, top: 14 }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setNameError(false);
                    }}
                    type="text"
                    placeholder={role === "seller" ? "Ví dụ: TechStore VN" : "Nguyễn Văn A"}
                    disabled={isSubmitting}
                    style={{
                      width: "100%",
                      height: 48,
                      paddingLeft: 44,
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                      outline: "none",
                    }}
                  />
                </div>
                {nameError && (
                  <p
                    style={{
                      color: "var(--danger-text)",
                      fontSize: 13,
                      marginTop: 4,
                    }}
                  >
                    Vui lòng nhập họ và tên của bạn.
                  </p>
                )}
              </div>

              {role === "seller" && (
                <div className="seller-register-fields">
                  <div className="field">
                    <label htmlFor="seller-phone">Số điện thoại</label>
                    <input className="auth-control" id="seller-phone" type="tel" inputMode="numeric" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="0901 234 567" disabled={isSubmitting} />
                  </div>
                  <div className="field">
                    <label htmlFor="seller-city">Khu vực hoạt động</label>
                    <select className="auth-control" id="seller-city" value={city} onChange={(event) => setCity(event.target.value)} disabled={isSubmitting}>
                      <option>TP.HCM</option><option>Hà Nội</option><option>Đà Nẵng</option><option>Cần Thơ</option><option>Hải Phòng</option>
                    </select>
                  </div>
                  <div className="field seller-business-type">
                    <span>Hình thức kinh doanh</span>
                    <label><input type="radio" name="businessType" checked={businessType === "individual"} onChange={() => setBusinessType("individual")} /> Cá nhân</label>
                    <label><input type="radio" name="businessType" checked={businessType === "business"} onChange={() => setBusinessType("business")} /> Doanh nghiệp</label>
                  </div>
                </div>
              )}

              <div className="field" style={{ marginBottom: 24 }}>
                <label
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    cursor: "pointer",
                    fontWeight: 400,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={terms}
                    onChange={(e) => {
                      setTerms(e.target.checked);
                      setTermsError(false);
                    }}
                    disabled={isSubmitting}
                    style={{
                      width: 16,
                      height: 16,
                      accentColor: "var(--accent)",
                    }}
                  />
                  <span style={{ fontSize: 14 }}>
                    Tôi đồng ý với Điều khoản sử dụng
                  </span>
                </label>
                {termsError && (
                  <p
                    style={{
                      color: "var(--danger-text)",
                      fontSize: 13,
                      marginTop: 4,
                    }}
                  >
                    Bạn cần đồng ý với Điều khoản để tiếp tục.
                  </p>
                )}
              </div>

              <button
                className={`btn-primary btn-lg ${isSubmitting ? "is-loading" : ""}`}
                id="reg-submit"
                type="submit"
                disabled={isSubmitting}
              >
                <span className="cta-default">Tạo tài khoản</span>
                {isSubmitting && (
                  <span className="cta-loading" style={{ marginLeft: 10 }}>
                    ...
                  </span>
                )}
              </button>

              {submitError && <p className="auth-submit-error" role="alert">{submitError}</p>}

              <p className="switch-line">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="switch-btn"
                  style={{ marginLeft: 6 }}
                >
                  Đăng nhập
                </Link>
              </p>
            </form>
          )}

          {view === "forgot" && (
            <form onSubmit={handleForgotPassword}>
              <div className="form-head" style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 32, fontWeight: 300, margin: 0 }}>Khôi phục mật khẩu</h1>
                <p style={{ color: "var(--muted)", marginTop: 8 }}>Nhập email tài khoản. Trong bản frontend, yêu cầu sẽ được xác nhận ngay trên thiết bị này.</p>
              </div>
              <div className="field" style={{ marginBottom: 20 }}>
                <label htmlFor="forgot-email" style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 }}>Email</label>
                <input id="forgot-email" className="auth-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ban@email.com" />
              </div>
              <button className="btn-primary btn-lg" type="submit" style={{ width: "100%" }}>Gửi yêu cầu khôi phục</button>
              {submitError && <p className="auth-submit-error" role="alert">{submitError}</p>}
              <p className="switch-line"><Link className="switch-btn" to="/login">Quay lại đăng nhập</Link></p>
            </form>
          )}

          {view === "login" && (
            <form id="auth-login" onSubmit={handleLogin}>
              <div className="form-head" style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 32, fontWeight: 300, margin: 0 }}>
                  Chào mừng trở lại
                </h1>
                <p style={{ color: "var(--muted)", marginTop: 8 }}>
                  Phiên của bạn vẫn đang chạy. Đăng nhập để tiếp tục bid.
                </p>
              </div>

              {loginError && (
                <div
                  className="field-status is-error"
                  style={{
                    marginBottom: 16,
                    background: "var(--danger-bg)",
                    padding: "12px",
                    borderRadius: "6px",
                    borderLeft: "4px solid var(--danger)",
                  }}
                >
                  ⚠️ Email hoặc mật khẩu không đúng.
                </div>
              )}

              <div className="field" style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  Email
                </label>
                <div
                  className={`input-wrap has-lead ${loginError ? "has-error" : ""}`}
                  style={{ position: "relative" }}
                >
                  <span
                    className="lead"
                    style={{ position: "absolute", left: 14, top: 14 }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    style={{
                      width: "100%",
                      height: 48,
                      paddingLeft: 44,
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div className="field" style={{ marginBottom: 24 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <label style={{ fontSize: 14, fontWeight: 500 }}>
                    Mật khẩu
                  </label>
                  <Link
                    to="/forgot-password"
                    style={{
                      fontSize: 13,
                      color: "var(--accent)",
                      textDecoration: "none",
                    }}
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div
                  className={`input-wrap has-lead has-toggle ${loginError ? "has-error" : ""}`}
                  style={{ position: "relative" }}
                >
                  <span
                    className="lead"
                    style={{ position: "absolute", left: 14, top: 14 }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="5" y="11" width="14" height="9" rx="2" />
                      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    style={{
                      width: "100%",
                      height: 48,
                      paddingLeft: 44,
                      paddingRight: 44,
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      height: 32,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--muted)",
                    }}
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>
              </div>

              <button
                className="btn-primary btn-lg"
                type="submit"
                style={{ width: "100%", marginTop: "16px" }}
              >
                Đăng nhập
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  margin: "24px 0",
                  color: "var(--muted)",
                  fontSize: 13,
                }}
              >
                <span
                  style={{ flex: 1, height: 1, background: "var(--border)" }}
                ></span>
                hoặc
                <span
                  style={{ flex: 1, height: 1, background: "var(--border)" }}
                ></span>
              </div>

              <div className="social-row" style={{ display: "flex", gap: 12 }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Google
                </button>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Facebook
                </button>
              </div>

              <p className="switch-line">
                Chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="switch-btn"
                  style={{ marginLeft: 6 }}
                >
                  Đăng ký ngay
                </Link>
              </p>
            </form>
          )}

          {view === "success" && (
            <div style={{ textAlign: "center", paddingBlock: "40px" }}>
              <span
                className="success-ring"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "var(--gradient-primary)",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="32"
                  height="32"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <h1
                style={{
                  fontSize: 28,
                  marginBottom: 8,
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                {pathname.includes("register")
                  ? "Tài khoản đã được tạo"
                  : pathname.includes("forgot-password")
                    ? "Đã ghi nhận yêu cầu"
                  : "Đăng nhập thành công"}
              </h1>
              <p style={{ color: "var(--muted)" }}>
                {pathname.includes("forgot-password") ? "Bạn có thể quay lại đăng nhập và tiếp tục sử dụng tài khoản." : "Đang chuyển bạn đến trang phù hợp..."}
              </p>
            </div>
          )}
        </div>
      </main>

      <aside
        className="brand-panel"
        style={{
          background: "var(--surface-warm)",
          padding: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {SLIDE_IMAGES.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Minh họa"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              inset: 0,
              opacity: slideIndex === index ? 1 : 0,
              transition: "opacity 1s ease-in-out",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(17,17,19,0.1) 0%, rgba(17,17,19,0.85) 100%)",
            zIndex: 1,
          }}
        ></div>

        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            height: "100%",
            padding: "64px 40px",
          }}
        >
          <div style={{ maxWidth: 460 }}>
            <span
              style={{
                background: "var(--accent)",
                color: "#fff",
                padding: "6px 14px",
                borderRadius: 99,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Trải nghiệm mượt mà
            </span>
            <h2
              style={{
                fontSize: "clamp(28px, 3vw, 36px)",
                fontWeight: 500,
                lineHeight: 1.2,
                color: "#fff",
                marginTop: 20,
                marginBottom: 0,
              }}
            >
              Đấu giá an toàn,
              <br />
              giao dịch tin cậy.
            </h2>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: 16,
                marginTop: 12,
                lineHeight: 1.6,
              }}
            >
              Tham gia cùng 50.247 người dùng đã tin tưởng AuctionHub. Trả giá
              real-time, thanh toán qua Escrow và theo dõi đơn hàng mọi lúc mọi
              nơi.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
