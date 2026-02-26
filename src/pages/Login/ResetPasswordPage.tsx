// src/pages/Login/ResetPasswordPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { supabase } from "../../lib/supabase";
import { syncPassword } from "../../services/auth.service";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Extract access token from URL hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const token = hashParams.get("access_token");
    const type = hashParams.get("type");

    if (token && type === "recovery") {
      setAccessToken(token);
      console.log("✅ Recovery token found in URL");
    } else {
      toast.error("Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn");
      setTimeout(() => navigate("/forgot-password"), 2000);
    }
  }, [navigate]);

  const validatePassword = (password: string): boolean => {
    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!newPassword || !confirmPassword) {
      toast.warning("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (!validatePassword(newPassword)) {
      return;
    }

    if (!accessToken) {
      toast.error("Phiên làm việc không hợp lệ. Vui lòng thử lại.");
      return;
    }

    try {
      setIsLoading(true);

      // Step 1: Update password in Supabase
      console.log("🔄 Updating Supabase password...");
      const { error: supabaseError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (supabaseError) throw supabaseError;

      console.log("✅ Supabase password updated successfully");

      // Step 2: Sync password with backend
      console.log("🔄 Syncing password with backend...");
      await syncPassword(accessToken, newPassword);

      console.log("✅ Password synced with backend");

      // Step 3: Sign out and redirect to login
      await supabase.auth.signOut();

      toast.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      console.error("Reset password error:", error);

      if (error.response?.status === 400) {
        toast.error("Token không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.");
        setTimeout(() => navigate("/forgot-password"), 2000);
      } else {
        toast.error(
          error.message || "Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string): {
    strength: string;
    color: string;
    bgColor: string;
    width: string;
  } => {
    if (password.length === 0)
      return { strength: "", color: "", bgColor: "", width: "0%" };
    if (password.length < 6)
      return {
        strength: "Yếu",
        color: "#631b1b", // burgundy
        bgColor: "rgba(99, 27, 27, 0.1)",
        width: "33%"
      };
    if (password.length < 10)
      return {
        strength: "Trung bình",
        color: "#d4b483", // gold
        bgColor: "rgba(212, 180, 131, 0.1)",
        width: "66%"
      };
    return {
      strength: "Mạnh",
      color: "#3d4a3e", // green
      bgColor: "rgba(61, 74, 62, 0.1)",
      width: "100%"
    };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#faf9f6", // cream
      display: "flex",
      flexDirection: "column"
    }}>
      <Header />

      {/* Main Content - Centered */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(40px, 8vh, 80px) clamp(16px, 4vw, 40px)",
      }}>
        <div style={{
          width: "100%",
          maxWidth: "440px",
        }}>
          {/* Card */}
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "42px", // --radius-2xl
            boxShadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 8px 10px -6px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}>
            {/* Content */}
            <div style={{
              padding: "clamp(32px, 5vh, 40px) clamp(32px, 5vw, 40px) clamp(24px, 4vh, 32px)"
            }}>
              {/* Icon */}
              <div style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "20px"
              }}>
                <div style={{
                  height: "56px",
                  width: "56px",
                  backgroundColor: "rgba(99, 27, 27, 0.1)", // burgundy-10
                  borderRadius: "9999px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <svg
                    style={{ height: "28px", width: "28px", color: "#631b1b" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h1 style={{
                fontFamily: "'IBM Plex Serif', Georgia, serif",
                fontSize: "clamp(24px, 4vw, 28px)",
                fontWeight: 600,
                color: "#1a2238", // navy
                textAlign: "center",
                marginBottom: "8px",
                lineHeight: 1.3,
              }}>
                Đặt lại mật khẩu
              </h1>

              {/* Description */}
              <p style={{
                fontSize: "clamp(13px, 1.8vw, 14px)",
                color: "rgba(26, 34, 56, 0.6)", // navy-60
                textAlign: "center",
                marginBottom: "28px",
                lineHeight: 1.6,
              }}>
                Nhập mật khẩu mới cho tài khoản của bạn
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* New Password */}
                <div style={{ marginBottom: "20px" }}>
                  <label
                    htmlFor="newPassword"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#1a2238",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Mật khẩu mới
                  </label>
                  <div style={{ position: "relative" }}>
                    <div style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      paddingLeft: "12px",
                      display: "flex",
                      alignItems: "center",
                      pointerEvents: "none",
                    }}>
                      <svg
                        style={{ height: "20px", width: "20px", color: "rgba(26, 34, 56, 0.4)" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        width: "100%",
                        padding: "clamp(10px, 1.8vh, 14px) clamp(10px, 1.8vh, 14px) clamp(10px, 1.8vh, 14px) 40px",
                        paddingRight: "40px",
                        fontSize: "clamp(13px, 1.6vw, 15px)",
                        color: "#1a2238",
                        backgroundColor: "#faf9f6",
                        border: "2px solid transparent",
                        borderRadius: "14px",
                        outline: "none",
                        transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.backgroundColor = "#ffffff";
                        e.currentTarget.style.borderColor = "rgba(26, 34, 56, 0.05)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.backgroundColor = "#faf9f6";
                        e.currentTarget.style.borderColor = "transparent";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "rgba(26, 34, 56, 0.4)",
                        padding: 0,
                      }}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>

                  {/* Password strength indicator */}
                  {newPassword && (
                    <div style={{ marginTop: "12px" }}>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "6px"
                      }}>
                        <span style={{ fontSize: "12px", color: "rgba(26, 34, 56, 0.6)" }}>
                          Độ mạnh mật khẩu:
                        </span>
                        <span style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: passwordStrength.color
                        }}>
                          {passwordStrength.strength}
                        </span>
                      </div>
                      <div style={{
                        width: "100%",
                        height: "6px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "9999px",
                        overflow: "hidden",
                      }}>
                        <div
                          style={{
                            height: "100%",
                            width: passwordStrength.width,
                            backgroundColor: passwordStrength.color,
                            transition: "all 0.3s ease",
                            borderRadius: "9999px",
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div style={{ marginBottom: "24px" }}>
                  <label
                    htmlFor="confirmPassword"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#1a2238",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Xác nhận mật khẩu
                  </label>
                  <div style={{ position: "relative" }}>
                    <div style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      paddingLeft: "12px",
                      display: "flex",
                      alignItems: "center",
                      pointerEvents: "none",
                    }}>
                      <svg
                        style={{ height: "20px", width: "20px", color: "rgba(26, 34, 56, 0.4)" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        width: "100%",
                        padding: "clamp(10px, 1.8vh, 14px) clamp(10px, 1.8vh, 14px) clamp(10px, 1.8vh, 14px) 40px",
                        paddingRight: "40px",
                        fontSize: "clamp(13px, 1.6vw, 15px)",
                        color: "#1a2238",
                        backgroundColor: "#faf9f6",
                        border: "2px solid transparent",
                        borderRadius: "14px",
                        outline: "none",
                        transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.backgroundColor = "#ffffff";
                        e.currentTarget.style.borderColor = "rgba(26, 34, 56, 0.05)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.backgroundColor = "#faf9f6";
                        e.currentTarget.style.borderColor = "transparent";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "rgba(26, 34, 56, 0.4)",
                        padding: 0,
                      }}
                    >
                      {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>

                  {/* Password match indicator */}
                  {confirmPassword && (
                    <div
                      style={{
                        marginTop: "8px",
                        fontSize: "13px",
                        color: newPassword === confirmPassword ? "#3d4a3e" : "#631b1b",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {newPassword === confirmPassword ? (
                        <>
                          <svg
                            style={{ width: "16px", height: "16px", marginRight: "4px" }}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Mật khẩu khớp
                        </>
                      ) : (
                        <>
                          <svg
                            style={{ width: "16px", height: "16px", marginRight: "4px" }}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Mật khẩu không khớp
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    padding: "clamp(10px, 1.8vh, 16px) clamp(16px, 3vw, 24px)",
                    fontSize: "clamp(11px, 1.6vw, 14px)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#ffffff",
                    backgroundColor: isLoading ? "rgba(61, 74, 62, 0.5)" : "#3d4a3e",
                    border: "none",
                    borderRadius: "14px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                    marginBottom: "16px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = "#631b1b";
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(99, 27, 27, 0.25)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = "#3d4a3e";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  {isLoading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg
                        style={{
                          animation: "spin 1s linear infinite",
                          marginLeft: "-4px",
                          marginRight: "12px",
                          height: "20px",
                          width: "20px",
                          color: "#ffffff"
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          style={{ opacity: 0.25 }}
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          style={{ opacity: 0.75 }}
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xử lý...
                    </span>
                  ) : (
                    "Đặt lại mật khẩu"
                  )}
                </button>

                {/* Back to login */}
                <div style={{ textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgba(26, 34, 56, 0.6)",
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#1a2238")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(26, 34, 56, 0.6)")}
                  >
                    <svg
                      style={{ width: "20px", height: "20px", marginRight: "4px" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Quay lại đăng nhập
                  </button>
                </div>
              </form>
            </div>

            {/* Decorative Accent Bar */}
            <div
              style={{
                height: "6px",
                width: "100%",
                background: "linear-gradient(90deg, #631b1b 0%, #3d4a3e 50%, #d4b483 100%)",
              }}
            ></div>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default ResetPasswordPage;
