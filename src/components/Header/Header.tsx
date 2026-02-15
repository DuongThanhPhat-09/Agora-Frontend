import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";
// Import Supabase và kiểu dữ liệu User
import { supabase } from "../../lib/supabase";
import { type User } from "@supabase/supabase-js";
import { clearUserFromStorage, getCurrentUser, getCurrentUserRole } from "../../services/auth.service";
import { Popconfirm } from "antd";
import { LogOut, LayoutDashboard } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string>("User");
  const [userAvatar, setUserAvatar] = useState<string>("");

  // Determine portal path based on role
  const getPortalPath = () => {
    const role = getCurrentUserRole();
    if (!role) return "/login";

    switch (role.toLowerCase()) {
      case 'admin': return "/admin/dashboard";
      case 'tutor': return "/tutor-portal";
      case 'parent': return "/parent/dashboard";
      case 'student': return "/student/dashboard";
      default: return "/";
    }
  };

  const portalPath = getPortalPath();

  // Ẩn user info trên trang đăng ký/đăng nhập (vì có thể có OAuth session chưa complete)
  const isAuthPage = location.pathname === "/register" || location.pathname === "/login";

  // Helper function to generate avatar from name
  const generateAvatarFromName = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=631b1b&color=fff&size=128`;
  };

  useEffect(() => {
    // 1. Kiểm tra session hiện tại (Cho trường hợp F5 lại trang)
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        // Lấy thông tin từ localStorage (backend đã lưu)
        const userData = getCurrentUser();

        // Ưu tiên: localStorage > user_metadata > email
        const displayName = userData?.fullname || currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || "User";
        setUserDisplayName(displayName);

        // Avatar: Ưu tiên từ Backend (localStorage) → Supabase OAuth → Generate từ tên
        const avatarUrl = userData?.avatar_url || userData?.imageUrl || currentUser.user_metadata?.avatar_url || generateAvatarFromName(displayName);
        setUserAvatar(avatarUrl);
      }
    });

    // 2. Lắng nghe sự kiện thay đổi auth (Login/Logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const userData = getCurrentUser();
        const displayName = userData?.fullname || currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || "User";
        setUserDisplayName(displayName);

        // Avatar: Ưu tiên từ Backend (localStorage) → Supabase OAuth → Generate từ tên
        const avatarUrl = userData?.avatar_url || userData?.imageUrl || currentUser.user_metadata?.avatar_url || generateAvatarFromName(displayName);
        setUserAvatar(avatarUrl);
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
          {user && !isAuthPage ? (
            // --- GIAO DIỆN TỐI GIẢN KHI ĐÃ ĐĂNG NHẬP ---
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {/* Nút Portal tương ứng theo Role - Icon version */}
              <Link
                to={portalPath}
                className="btn-portal-icon"
                style={{
                  color: "var(--color-navy)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
                title="Go to Portal"
              >
                <LayoutDashboard size={20} />
              </Link>

              {/* Nút Đăng xuất - Icon version */}
              <Popconfirm
                title="Đăng xuất"
                description="Bạn có chắc chắn muốn đăng xuất?"
                onConfirm={confirmLogout}
                okText="Đồng ý"
                cancelText="Hủy"
                placement="bottomRight"
              >
                <button
                  className="btn-logout-icon"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    transition: "background 0.2s ease",
                  }}
                  title="Đăng xuất"
                >
                  <LogOut size={20} />
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
            {user && !isAuthPage ? (
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
                    src={userAvatar}
                    alt="Avatar"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      border: "2px solid #d4b483",
                    }}
                  />
                  <span style={{ fontWeight: 600 }}>
                    {userDisplayName}
                  </span>
                </div>

                <Link
                  to={portalPath}
                  className="btn-signup"
                  style={{ width: "100%", textAlign: "center" }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  TRANG CÁ NHÂN
                </Link>

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
