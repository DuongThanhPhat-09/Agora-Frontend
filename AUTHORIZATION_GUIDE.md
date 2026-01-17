# Hướng dẫn sử dụng Role-based Authorization

## 📦 Functions có sẵn trong `auth.service.ts`

### 1. **getCurrentUserRole()** - Lấy role hiện tại
```typescript
import { getCurrentUserRole } from './services/auth.service';

const userRole = getCurrentUserRole(); // "Student" | "Parent" | "Tutor" | "Admin" | null
console.log("User role:", userRole);
```

### 2. **hasRole()** - Kiểm tra role cụ thể
```typescript
import { hasRole } from './services/auth.service';

if (hasRole("Admin")) {
  console.log("User is Admin");
}
```

### 3. **hasAnyRole()** - Kiểm tra một trong nhiều role
```typescript
import { hasAnyRole } from './services/auth.service';

if (hasAnyRole(["Admin", "Tutor"])) {
  console.log("User can access tutor management");
}
```

### 4. **isAuthenticated()** - Kiểm tra đã đăng nhập
```typescript
import { isAuthenticated } from './services/auth.service';

if (!isAuthenticated()) {
  navigate("/login");
}
```

---

## 🛡️ ProtectedRoute Component

### Cách sử dụng trong App.tsx:

```tsx
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected - Chỉ user đã login */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />

      {/* Protected - Chỉ Admin */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Protected - Chỉ Tutor */}
      <Route 
        path="/tutor/onboarding" 
        element={
          <ProtectedRoute allowedRoles={["Tutor"]}>
            <TutorOnboardingPage />
          </ProtectedRoute>
        } 
      />

      {/* Protected - Tutor hoặc Admin */}
      <Route 
        path="/tutor/dashboard" 
        element={
          <ProtectedRoute allowedRoles={["Tutor", "Admin"]}>
            <TutorDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
```

---

## 🎨 Conditional Rendering trong Component

### Ẩn/hiện UI dựa trên role:

```tsx
import { getCurrentUserRole, hasRole } from '../services/auth.service';

function Header() {
  const userRole = getCurrentUserRole();

  return (
    <nav>
      <Link to="/">Home</Link>
      
      {/* Hiện menu cho Admin */}
      {hasRole("Admin") && (
        <Link to="/admin">Admin Panel</Link>
      )}
      
      {/* Hiện menu cho Tutor */}
      {hasRole("Tutor") && (
        <Link to="/tutor/dashboard">My Classes</Link>
      )}
      
      {/* Hiện menu cho Student/Parent */}
      {(userRole === "Student" || userRole === "Parent") && (
        <Link to="/find-tutor">Find Tutor</Link>
      )}
    </nav>
  );
}
```

---

## 🔒 Backend API Calls với Authorization

```tsx
import axios from 'axios';
import { getCurrentUser } from './services/auth.service';

// Tạo axios instance với token tự động
const apiClient = axios.create({
  baseURL: 'http://localhost:5166/api',
});

// Thêm token vào mỗi request
apiClient.interceptors.request.use((config) => {
  const user = getCurrentUser();
  if (user?.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  }
  return config;
});

// Sử dụng
const fetchProtectedData = async () => {
  const response = await apiClient.get('/admin/users');
  return response.data;
};
```

---

## 🎯 Trả lời câu hỏi của bạn

> **"Vậy thì tôi lấy role mà backend response ở đâu để làm authorization đây?"**

### ✅ Trả lời:

**Cách 1: Gọi function trực tiếp**
```typescript
import { getCurrentUserRole } from './services/auth.service';

const role = getCurrentUserRole(); // Lấy từ LocalStorage hoặc decode JWT
```

**Cách 2: Dùng ProtectedRoute component**
```tsx
<ProtectedRoute allowedRoles={["Admin"]}>
  <AdminPage />
</ProtectedRoute>
```

**Flow hoạt động:**
1. User login → Backend trả về `accessToken` (JWT)
2. Frontend lưu vào LocalStorage (kèm `userroles` nếu có)
3. `getCurrentUserRole()` sẽ:
   - Kiểm tra `userroles` array trước
   - Nếu không có, decode JWT token để lấy claim `role`
4. Dùng role này cho authorization

---

## 🧪 Test nhanh trong Console

Mở **DevTools Console** và thử:

```javascript
// Import functions (nếu chưa có global)
const { getCurrentUserRole } = require('./services/auth.service');

// Kiểm tra role
console.log(getCurrentUserRole()); // "Student"

// Kiểm tra token
const user = JSON.parse(localStorage.getItem('agora_user_data'));
console.log(user.accessToken); // eyJ...
```
