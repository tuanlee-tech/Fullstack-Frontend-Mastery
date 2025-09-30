# 🚀 Hướng Dẫn Toàn Diện Về Persist Middleware Trong Zustand

Zustand là một thư viện quản lý trạng thái nhẹ nhàng cho React, và middleware `persist` cho phép lưu trữ trạng thái vào storage (như localStorage hoặc sessionStorage) để duy trì dữ liệu qua các lần reload trang. Chuyên đề này tập trung vào việc sử dụng `persist` cho các trường hợp thực tế, đặc biệt là auth/session (như token và thông tin người dùng). Chúng ta sẽ phân tích các vấn đề thường gặp, nguyên nhân, giải pháp kèm code mẫu, các tùy chọn nâng cao, tình huống thực tế, so sánh với các phương pháp khác, và các pattern enterprise-level như refresh token và auto-refresh interceptor.

## 1. Các Vấn Đề Thường Gặp Và Giải Pháp

Dưới đây là các vấn đề phổ biến khi sử dụng `persist`, đặc biệt với auth, kèm phân tích nguyên nhân và cách khắc phục.

### 1.1. Flicker State (Hydration Delay)
**Vấn đề:** Khi app khởi động, Zustand tạo state với giá trị ban đầu (`initialState`). Sau đó, `persist` mới rehydrate từ storage, dẫn đến UI có thể "nháy" (ví dụ: hiển thị "chưa login" rồi chuyển sang "login").

**Nguyên nhân:** Quá trình rehydrate diễn ra bất đồng bộ, UI render trước khi hoàn tất.

**Giải pháp:** Sử dụng `onRehydrateStorage` để đánh dấu trạng thái hydrated và chặn UI render đến khi hoàn tất.

**Code mẫu:**
```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  token: string | null;
  hydrated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      hydrated: false,
      login: (token) => set({ token }),
      logout: () => set({ token: null }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true; // Đánh dấu hoàn tất
      },
    }
  )
);
```

**Sử dụng trong UI:**
```tsx
const { hydrated, token } = useAuthStore();
if (!hydrated) return <p>Loading...</p>;
return token ? <Dashboard /> : <Login />;
```

### 1.2. Token Hết Hạn (Expired JWT)
**Vấn đề:** Token được lưu nhưng có thể hết hạn khi reload, dẫn đến gọi API bị lỗi 401.

**Nguyên nhân:** `Persist` chỉ lưu giá trị thô, không tự kiểm tra hạn sử dụng.

**Giải pháp:** Lưu kèm thời hạn hết hạn (`expiry`) và kiểm tra khi rehydrate. Hoặc tự động gọi refresh token.

**Code mẫu:**
```ts
type AuthState = {
  token: string | null;
  expiry: number | null;
  login: (token: string, ttl: number) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      expiry: null,
      login: (token, ttl) => set({ token, expiry: Date.now() + ttl * 1000 }),
      logout: () => set({ token: null, expiry: null }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state?.expiry && Date.now() > state.expiry) {
          state.token = null;
          state.expiry = null;
        }
      },
    }
  )
);
```

### 1.3. Multi-Tab Không Đồng Bộ
**Vấn đề:** Thay đổi state ở tab A (ví dụ: logout) không cập nhật ngay ở tab B.

**Nguyên nhân:** `Persist` chỉ rehydrate một lần khi khởi động.

**Giải pháp:** Bật `storageEvents: true` để lắng nghe sự kiện storage từ browser.

**Code mẫu:**
```ts
persist(
  (set) => ({ /* state */ }),
  {
    name: "auth-storage",
    storageEvents: true, // Đồng bộ giữa các tab
  }
);
```

### 1.4. Rủi Ro Bảo Mật (Token Trong LocalStorage)
**Vấn đề:** Token dễ bị lấy cắp qua XSS attack.

**Nguyên nhân:** LocalStorage dễ truy cập từ JS.

**Giải pháp:** Sử dụng sessionStorage cho session ngắn hạn, hoặc không lưu token mà chỉ lưu refresh token/flag.

**Code mẫu:**
```ts
import { createJSONStorage } from "zustand/middleware";

persist(
  (set) => ({ /* state */ }),
  {
    name: "auth-storage",
    storage: createJSONStorage(() => sessionStorage), // Chỉ lưu trong session
  }
);
```

### 1.5. State Bị Lưu Quá Nặng
**Vấn đề:** Lưu toàn bộ state dẫn đến vượt giới hạn storage (khoảng 5MB).

**Nguyên nhân:** `Persist` mặc định lưu hết.

**Giải pháp:** Sử dụng `partialize` để chỉ lưu các field cần thiết.

**Code mẫu:**
```ts
persist(
  (set) => ({
    token: null,
    expiry: null,
    profile: null,
    cart: [],
  }),
  {
    name: "app-storage",
    partialize: (state) => ({ token: state.token, expiry: state.expiry }),
  }
);
```

### 1.6. Format Không Đồng Nhất
**Vấn đề:** Mặc định lưu JSON, khó tùy chỉnh (encrypt, nén).

**Nguyên nhân:** Serializer mặc định đơn giản.

**Giải pháp:** Sử dụng custom serializer trong `createJSONStorage`.

**Code mẫu:**
```ts
const secureStorage = createJSONStorage(() => localStorage, {
  serialize: (state) => btoa(JSON.stringify(state)), // Encrypt base64
  deserialize: (str) => JSON.parse(atob(str)), // Decrypt
});

persist(
  (set) => ({ /* state */ }),
  { name: "auth-storage", storage: secureStorage }
);
```

### 1.7. Migration Khi Thay Đổi Schema
**Vấn đề:** Thay đổi cấu trúc state dẫn đến lỗi khi load dữ liệu cũ.

**Nguyên nhân:** Dữ liệu cũ không khớp schema mới.

**Giải pháp:** Sử dụng `version` và `migrate` để chuyển đổi.

**Code mẫu:**
```ts
persist(
  (set) => ({
    token: null,
    profile: { name: "", email: "" },
  }),
  {
    name: "auth-storage",
    version: 2,
    migrate: (persistedState, version) => {
      if (version === 1) {
        return {
          token: persistedState.token,
          profile: { name: persistedState.userName, email: "" },
        };
      }
      return persistedState;
    },
  }
);
```

## 2. Tóm Tắt Các Vấn Đề Và Giải Pháp

| Vấn đề                  | Nguyên Nhân                          | Giải Pháp                                   |
| ----------------------- | ------------------------------------ | ------------------------------------------- |
| Flicker khi rehydrate   | Rehydrate bất đồng bộ                | `hydrated flag` + `onRehydrateStorage`      |
| Token hết hạn           | Không kiểm tra validity              | Lưu `expiry` + kiểm tra/refresh             |
| Multi-tab không sync    | Không lắng nghe event                | `storageEvents: true`                       |
| Bảo mật                 | Dễ bị XSS                            | `sessionStorage` hoặc encrypt               |
| State quá nặng          | Lưu toàn bộ                          | `partialize` chỉ lưu field cần              |
| Format đặc biệt         | Serializer mặc định                  | Custom serializer/deserializer              |
| Schema thay đổi         | Dữ liệu cũ không khớp                | `version` + `migrate`                       |

## 3. Cheatsheet Các Option Của Persist

Dưới đây là bảng tóm tắt các option chính của `persist`, dành cho developer senior cần tra cứu nhanh.

```ts
persist(
  (set, get) => ({ /* state & actions */ }),
  {
    name: "storage-key",               // Tên key trong storage
    storage: createJSONStorage(...),   // Storage engine (mặc định: localStorage)
    partialize: (state) => ({}),       // Chỉ chọn field persist
    version: 1,                        // Versioning cho migrate
    migrate: (state, version) => state,// Migrate khi version thay đổi
    onRehydrateStorage: () => (state)=>{},
                                       // Hook khi rehydrate
    skipHydration: true,               // Bỏ qua hydrate tự động
    merge: (persisted, current) => {}, // Custom merge state
    storageEvents: true,               // Sync giữa các tab
  }
)
```

### Chi Tiết Mỗi Option
1. **name**: Key lưu trữ. Best practice: Prefix theo app (ví dụ: "myapp-auth").
2. **storage**: Chọn engine (localStorage, sessionStorage, custom). Case nâng cao: AsyncStorage cho React Native.
3. **partialize**: Chỉ persist field cần, tránh lưu dữ liệu nặng.
4. **version + migrate**: Quản lý thay đổi schema, ví dụ: Chuyển từ `userName` sang `profile.name`.
5. **onRehydrateStorage**: Hook cho hydrated flag hoặc xử lý error.
6. **skipHydration**: Không hydrate tự động, gọi thủ công (cho auth sensitive).
7. **merge**: Custom merge persisted và current state, hữu ích cho nested objects.
8. **storageEvents**: Sync multi-tab qua storage event.

### Trade-Off Của Các Option

| Option               | Ưu Điểm                  | Nhược Điểm                      | Khi Dùng                                 |
| -------------------- | ------------------------ | ------------------------------- | ---------------------------------------- |
| `name`               | Dễ debug                 | Dễ trùng key nếu không tổ chức  | Prefix theo app                          |
| `storage`            | Linh hoạt                | Bảo mật phụ thuộc engine        | `sessionStorage` cho sensitive           |
| `partialize`         | Giảm kích thước          | Dễ quên field cần               | Persist auth/settings thôi               |
| `version + migrate`  | Xử lý schema change      | Tăng complexity                 | App dài hạn, nhiều version               |
| `onRehydrateStorage` | Kiểm soát hydration      | Thêm code                       | App có auth/role-based UI                |
| `skipHydration`      | Toàn quyền control       | Phải hydrate thủ công           | Auth-sensitive apps                      |
| `merge`              | Merge custom             | Code phức tạp                   | Nested objects/cart                      |
| `storageEvents`      | Sync đa tab              | Chỉ hoạt động browser           | SaaS web app multi-tab                   |

## 4. Các Tình Huống Thực Tế Với Persist Cho Auth

Dưới đây là các case cụ thể khi lưu auth (token, user info), kèm vấn đề và fix nâng cao.

1. **Token Mất Khi Reload**: Nguyên nhân: Chưa dùng persist. Fix: Thêm `persist` với `name` và `storage`.
2. **Token Bị Clear Khi Logout Nhưng Reload Vẫn Còn**: Nguyên nhân: Chỉ set state, không xoá storage. Fix: Gọi `persist.clearStorage()`.
3. **Nhiều User Đăng Nhập Đè Dữ Liệu**: Nguyên nhân: Key chung. Fix: Dynamic key theo userId.
4. **XSS Lấy Token**: Nguyên nhân: Plain text. Fix: Encrypt hoặc dùng HttpOnly Cookie.
5. **Format Lỗi Khi Parse JSON**: Nguyên nhân: Dữ liệu hỏng. Fix: `partialize` để lưu ít hơn.
6. **Token Cũ Vẫn Còn Khi Refresh**: Nguyên nhân: Không check validity. Fix: Verify trong `onRehydrateStorage`.
7. **Dữ Liệu Nhạy Cảm Bị Leak**: Nguyên nhân: Lưu full state. Fix: `partialize` + encrypt.
8. **Race Condition Multi-Tab**: Nguyên nhân: Không sync. Fix: `storageEvents`.
9. **SSR/Next.js Lỗi `window undefined`**: Nguyên nhân: Gọi storage server-side. Fix: Kiểm tra `typeof window`.
10. **State Quá Lớn**: Nguyên nhân: Giới hạn storage. Fix: `partialize` hoặc sessionStorage.

**Tổng Hợp Fix Nâng Cao**: Sử dụng `partialize`, custom encode/decode, `onRehydrateStorage` để verify, `clearStorage` cho logout.

## 5. Code Mẫu Full AuthStore Với Persist Nâng Cao

Đây là store production-ready, kết hợp partialize, encode/decode, clearStorage, verify, refresh.

```ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const encode = (state: any) => btoa(JSON.stringify(state));
const decode = (str: string) => JSON.parse(atob(str));

type AuthState = {
  token: string | null;
  user: { id: string; name: string } | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  setToken: (t: string | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      loading: false,
      error: null,
      login: async (username, password) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
          });
          const data = await res.json();
          set({ token: data.token, user: data.user, loading: false });
        } catch (e: any) {
          set({ error: e.message, loading: false });
        }
      },
      logout: () => {
        set({ token: null, user: null });
        useAuthStore.persist.clearStorage();
      },
      refreshToken: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const res = await fetch("/api/refresh", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          set({ token: data.token });
        } catch {
          set({ token: null, user: null });
          useAuthStore.persist.clearStorage();
        }
      },
      setToken: (t) => set({ token: t }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
      encode,
      decode,
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          fetch("/api/verify", {
            headers: { Authorization: `Bearer ${state.token}` },
          }).catch(() => {
            state?.setToken(null);
            useAuthStore.persist.clearStorage();
          });
        }
      },
    }
  )
);
```

**Điểm Nổi Bật**: Chỉ lưu cần thiết, encrypt, verify khi reload, clear khi logout.

## 6. So Sánh Persist Với LocalStorage Vs Cookie (HttpOnly + SameSite)

### LocalStorage (Với Persist)
**Ưu điểm:** Dễ dùng, lưu nhiều field, truy cập nhanh.
**Nhược điểm:** Dễ XSS, không tự gửi kèm request, không expiration tự động.

### Cookie (HttpOnly + SameSite)
**Ưu điểm:** Chống XSS/CSRF, tự gửi kèm API, có expiration.
**Nhược điểm:** Cần backend set, không dễ integrate với persist, phải call API để đọc state.

**Trade-Off:**

| Tiêu Chí            | LocalStorage Persist | Cookie HttpOnly |
| ------------------- | -------------------- | --------------- |
| Dễ dùng frontend    | ✅                    | ❌              |
| Bảo mật chống XSS   | ❌                    | ✅              |
| Chống CSRF          | ❌                    | ✅              |
| Tự động gửi API     | ❌                    | ✅              |
| Dễ debug            | ✅                    | ❌              |
| Expiration control  | ❌                    | ✅              |

**Kết Luận:** LocalStorage cho frontend-only; Cookie cho enterprise với backend.

## 7. Refresh Token Pattern (JWT + Cookie HttpOnly)

Pattern chuẩn cho an toàn: Access token ngắn hạn (memory), refresh token dài hạn (cookie HttpOnly).

### Backend (Next.js Example)
- `/api/login`: Trả access token, set cookie refresh.
- `/api/refresh`: Check refresh, trả access token mới.

### Frontend (Zustand)
Lưu access token, gọi refresh khi cần.

**Trade-Off:** An toàn cao nhưng phức tạp hơn.

## 8. Auto Refresh Token Với Interceptor

Tự động xử lý 401 bằng axios interceptor hoặc fetch wrapper: Refresh, retry request.

**Code Axios Interceptor:** Xử lý queue để tránh race condition.

**Trade-Off:** Axios: Tự động đầy đủ; Fetch: Native nhưng phải wrap thủ công.

## 9. Case Study End-To-End

Minh họa flow login → API → auto refresh → logout với hooks và component.

## 10. Test Kịch Bản Mô Phỏng

Sử dụng axios-mock-adapter để test token expired → refresh → retry thành công/fail.

---

Tài liệu này cung cấp cái nhìn toàn diện từ cơ bản đến nâng cao, giúp bạn áp dụng persist hiệu quả trong dự án enterprise.

---

📌 [<< Ngày 05 A - Overview](./Day05-A-Overview.md) | [Ngày 05 C - Devtools >>](./Day05-C-Devtools.md)
