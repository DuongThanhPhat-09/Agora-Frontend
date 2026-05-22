// ============================================================
// MockDemoBar — thanh demo hiển thị khi VITE_USE_MOCK=true
// Cho phép chuyển nhanh giữa các role để demo flow.
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_USERS, createMockJwt } from './data';

const ROLE_PORTALS: Record<string, string> = {
  Parent: '/parent-portal/dashboard',
  Student: '/student-portal/dashboard',
  Tutor: '/tutor-portal/dashboard',
  Admin: '/admin-portal/dashboard',
};

const ROLE_LABELS: Record<string, string> = {
  Parent: 'Phụ huynh',
  Student: 'Học sinh',
  Tutor: 'Gia sư',
  Admin: 'Admin',
};

const ROLE_COLORS: Record<string, string> = {
  Parent: '#3b82f6',
  Student: '#10b981',
  Tutor: '#8b5cf6',
  Admin: '#ef4444',
};

function getCurrentRole(): string | null {
  try {
    const raw = localStorage.getItem('TUTORA_user_data');
    if (!raw) return null;
    const user = JSON.parse(raw);
    const token = user?.accessToken;
    if (!token) return null;
    const payload = JSON.parse(
      decodeURIComponent(
        atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
          .split('')
          .map((c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
    );
    return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
  } catch {
    return null;
  }
}

function loginAs(role: keyof typeof MOCK_USERS) {
  const user = MOCK_USERS[role];
  const token = createMockJwt(user.role, user.userId, user.email, user.name);
  const userData = { accessToken: token, refreshToken: 'mock-refresh-token' };
  localStorage.setItem('TUTORA_user_data', JSON.stringify(userData));
  // Sync cookie (như storage.adapter.ts)
  document.cookie = `TUTORA_user_data=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=2592000; SameSite=Lax`;
}

export default function MockDemoBar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const currentRole = getCurrentRole();

  useEffect(() => {
    document.body.style.paddingBottom = collapsed ? '' : '52px';
    return () => { document.body.style.paddingBottom = ''; };
  }, [collapsed]);

  const switchRole = (role: string) => {
    loginAs(role as keyof typeof MOCK_USERS);
    navigate(ROLE_PORTALS[role]);
    // Force re-render by reloading (storage cache cần reset)
    window.location.href = ROLE_PORTALS[role];
  };

  if (collapsed) {
    return (
      <div
        onClick={() => setCollapsed(false)}
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 9999,
          background: '#f59e0b',
          color: '#1a1a1a',
          borderRadius: '50%',
          width: 44,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontWeight: 700,
          fontSize: 20,
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        }}
        title="Mở Demo Bar"
      >
        🎭
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: '#1a1a1a',
        borderTop: '2px solid #f59e0b',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
      }}
    >
      {/* Label */}
      <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap' }}>
        🎭 DEMO MODE
      </span>

      {/* Current role */}
      <span style={{ color: '#9ca3af', fontSize: 12 }}>
        Role hiện tại:{' '}
        <strong style={{ color: currentRole ? ROLE_COLORS[currentRole] : '#9ca3af' }}>
          {currentRole ? ROLE_LABELS[currentRole] : '(chưa đăng nhập)'}
        </strong>
      </span>

      {/* Divider */}
      <span style={{ color: '#374151' }}>|</span>

      {/* Role switch buttons */}
      <span style={{ color: '#6b7280', fontSize: 12, whiteSpace: 'nowrap' }}>Chuyển sang:</span>
      {Object.keys(ROLE_PORTALS).map((role) => (
        <button
          key={role}
          onClick={() => switchRole(role)}
          style={{
            padding: '4px 12px',
            borderRadius: 4,
            border: currentRole === role ? '2px solid ' + ROLE_COLORS[role] : '1px solid #374151',
            background: currentRole === role ? ROLE_COLORS[role] + '22' : 'transparent',
            color: ROLE_COLORS[role],
            fontWeight: currentRole === role ? 700 : 500,
            fontSize: 12,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {ROLE_LABELS[role]}
        </button>
      ))}

      {/* Login page shortcut */}
      <button
        onClick={() => {
          localStorage.removeItem('TUTORA_user_data');
          document.cookie = 'TUTORA_user_data=; path=/; max-age=0; SameSite=Lax';
          navigate('/login');
          window.location.href = '/login';
        }}
        style={{
          padding: '4px 12px',
          borderRadius: 4,
          border: '1px solid #374151',
          background: 'transparent',
          color: '#6b7280',
          fontSize: 12,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        Trang Login
      </button>

      {/* Collapse */}
      <button
        onClick={() => setCollapsed(true)}
        style={{
          marginLeft: 'auto',
          background: 'transparent',
          border: 'none',
          color: '#6b7280',
          cursor: 'pointer',
          fontSize: 16,
          padding: '0 4px',
        }}
        title="Thu gọn"
      >
        ✕
      </button>
    </div>
  );
}
