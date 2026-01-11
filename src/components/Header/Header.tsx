import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
// Import Supabase và kiểu dữ liệu User
import { supabase } from "../../lib/supabase";
import { type User } from "@supabase/supabase-js";
import {
  clearUserFromStorage,
  loginToBackend,
} from "../../services/auth.service";
import { Popconfirm } from "antd";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 1. Kiểm tra session hiện tại (Cho trường hợp F5 lại trang)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);

      // SỬA Ở ĐÂY: Kiểm tra cả access_token và email
      if (session?.access_token && session?.user?.email) {
        console.log("Restoring session...");
        // Truyền đủ 2 tham số: Token và Email
        loginToBackend(session.access_token, session.user.email);
      }
    });

    // 2. Lắng nghe sự kiện thay đổi auth (Login/Logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      if (event === "SIGNED_IN" && session && session.user.email) {
        console.log("User signed in via Supabase! Sending token to backend...");
        // Truyền đủ 2 tham số
        await loginToBackend(session.access_token, session.user.email);
      }

      if (event === "SIGNED_OUT") {
        // Logic logout (nếu cần)
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const confirmLogout = async () => {
    await supabase.auth.signOut();
    clearUserFromStorage();
    setUser(null);
    setIsMenuOpen(false);
  };
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo-link">
          <div className="logo-icon">
            <span className="logo-letter">A</span>
          </div>
          <div className="logo-text">
            <span className="logo-name">AGORA</span>
            <span className="logo-tagline">Academic Heritage</span>
          </div>
        </Link>
        <nav className="main-nav">
          <Link to="/tutor-search" className="nav-link">
            TÌM GIA SƯ
          </Link>
          <a href="/#learning-path" className="nav-link">
            LỘ TRÌNH HỌC
          </a>
          <a href="/#lms" className="nav-link">
            LMS ENGINE
          </a>
          <a href="/#about" className="nav-link">
            VỀ CHÚNG TÔI
          </a>
        </nav>

        {/* Auth Buttons - Xử lý điều kiện hiển thị */}
        <div className="auth-buttons">
          {user ? (
            // --- GIAO DIỆN KHI ĐÃ ĐĂNG NHẬP ---
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {/* Avatar User */}
              <img
                src={user.user_metadata.avatar_url}
                alt="User Avatar"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1px solid #ddd",
                }}
              />
              {/* Tên User */}
              <span
                style={{
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: "var(--color-navy)",
                }}
              >
                {user.user_metadata.full_name || "User"}
              </span>
              {/* Nút Đăng xuất */}
              <Popconfirm
                title="Đăng xuất"
                description="Bạn có chắc chắn muốn đăng xuất?"
                onConfirm={confirmLogout} // Gọi hàm logout khi bấm Đồng ý
                okText="Đồng ý"
                cancelText="Hủy"
                placement="bottomRight"
              >
                <button
                  className="btn-login"
                  style={{
                    border: "1px solid #ef4444",
                    color: "#ef4444",
                    padding: "0.5rem 1rem",
                    marginLeft: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  LOG OUT
                </button>
              </Popconfirm>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-login">
                LOG IN
              </Link>
              <Link to="/register" className="btn-signup">
                SIGN UP
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            <Link
              to="/tutor-search"
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              TÌM GIA SƯ
            </Link>
            <a
              href="/#learning-path"
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              LỘ TRÌNH HỌC
            </a>
            <a
              href="/#lms"
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              LMS ENGINE
            </a>
            <a
              href="/#about"
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              VỀ CHÚNG TÔI
            </a>
          </nav>

          {/* Mobile Auth Section */}
          <div className="mobile-auth">
            {user ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                    }}
                  />
                  <span style={{ fontWeight: 600 }}>
                    {user.user_metadata.full_name}
                  </span>
                </div>
                <Popconfirm
                  title="Đăng xuất"
                  description="Bạn có muốn đăng xuất không?"
                  onConfirm={confirmLogout}
                  okText="Có"
                  cancelText="Không"
                >
                  <button
                    className="btn-login"
                    style={{
                      width: "100%",
                      border: "1px solid #ef4444",
                      color: "#ef4444",
                      cursor: "pointer",
                    }}
                  >
                    LOG OUT
                  </button>
                </Popconfirm>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-login"
                  onClick={() => setIsMenuOpen(false)}
                >
                  LOG IN
                </Link>
                <Link
                  to="/register"
                  className="btn-signup"
                  onClick={() => setIsMenuOpen(false)}
                >
                  SIGN UP
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
