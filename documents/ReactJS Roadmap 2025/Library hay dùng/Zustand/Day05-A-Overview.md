# 📅 Day 5: Middleware trong Zustand (từ cơ bản đến nâng cao)


## 1. Middleware là gì?

Trong Zustand, **middleware** là những "plugin" hoặc "lớp bọc" quanh `store` giúp bạn mở rộng chức năng mà không phải viết lại từ đầu.
Nó giống như việc bạn thêm **gia vị vào món ăn**: store gốc chỉ là state đơn giản, middleware giúp thêm:

* Lưu trữ vào `localStorage` (persist)
* Debug (devtools, logging)
* Viết code ngắn gọn (immer)
* Tối ưu performance (subscribeWithSelector)

---

## 2. Các middleware phổ biến và định nghĩa

### 2.1. **devtools**
```ts
import { devtools } from "zustand/middleware";

devtools(
  config: StateCreator<T>, 
  options?: {
    name?: string;                   // 🔹 tên hiển thị trong Redux DevTools
    anonymousActionType?: string;    // 🔹 action type default khi không truyền tên
    enabled?: boolean;               // 🔹 bật/tắt DevTools (default true)
  }
)
```
* **Định nghĩa:** kết nối Zustand với Redux DevTools Extension (trên Chrome/Firefox).
* **Ứng dụng:** debug state thay đổi theo thời gian (timeline).
* **Ví dụ:**

```ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface CounterState {
  count: number
  increment: () => void
}

export const useCounterStore = create<CounterState>()(
  devtools((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
  }))
)
```
✅ **Dùng khi debug state** → xem history, time-travel debugging, log action.
👉 Trong DevTools bạn sẽ thấy log mỗi khi `increment` được gọi.

---

### 2.2. **persist**
```ts
import { persist } from "zustand/middleware";

persist(
  config: StateCreator<T>, 
  options?: {
    name: string;                    // 🔹 key lưu trong localStorage/sessionStorage
    storage?: {                      // 🔹 custom storage (mặc định localStorage)
      getItem: (name: string) => string | null | Promise<string | null>;
      setItem: (name: string, value: string) => void | Promise<void>;
      removeItem: (name: string) => void | Promise<void>;
    };
    partialize?: (state: T) => Partial<T>; // 🔹 chỉ lưu 1 phần state
    version?: number;                // 🔹 version state (phục vụ migrate)
    migrate?: (persistedState: any, version: number) => T | Promise<T>;
    merge?: (persistedState: any, currentState: T) => T;
    skipHydration?: boolean;         // 🔹 skip auto-hydrate khi khởi tạo
  }
)
```
* **Định nghĩa:** lưu state vào `localStorage` hoặc `sessionStorage`.
* **Ứng dụng:** giữ **token đăng nhập**, **giỏ hàng**, hoặc **cài đặt theme** sau khi reload trang.
* **Ví dụ:**

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  theme: 'light' | 'dark'
  toggle: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggle: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    { name: 'theme-storage' } // key trong localStorage
  )
)
```

👉 Dùng case thực tế: User chọn dark mode → reload trang vẫn giữ dark mode.

---

### 2.3. **immer**  (dùng `set` như Redux Toolkit)
```ts
import { immer } from "zustand/middleware";

immer(
  config: StateCreator<T>
)
```
* **Định nghĩa:** cho phép viết code mutate trực tiếp nhưng vẫn giữ tính bất biến (immutable).
* **Ứng dụng:** khi state có **nested object sâu**, bạn không cần viết nhiều `{ ...spread }`.
* **Ví dụ:**

```ts
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface UserState {
  profile: { name: string; age: number }
  updateName: (newName: string) => void
}

export const useUserStore = create<UserState>()(
  immer((set) => ({
    profile: { name: 'Alice', age: 25 },
    updateName: (newName) =>
      set((state) => {
        state.profile.name = newName // mutate trực tiếp
      }),
  }))
)
```

👉 Trường hợp thực tế: Update profile user trong form có nhiều field.

---

### 2.4. **subscribeWithSelector**  (chỉ re-render khi slice thay đổi)
```ts
import { subscribeWithSelector } from "zustand/middleware";

subscribeWithSelector(
  config: StateCreator<T>
)
```
* **Định nghĩa:** cho phép component chỉ "nghe" 1 phần state, không bị ảnh hưởng khi các phần khác thay đổi.
* **Ứng dụng:** tối ưu re-render trong ứng dụng lớn.
* **Ví dụ:**

```ts
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set) => ({
    isAuthenticated: false,
    login: () => set({ isAuthenticated: true }),
    logout: () => set({ isAuthenticated: false }),
  }))
)

// Component chỉ listen isAuthenticated
const AuthStatus = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return <div>{isAuthenticated ? 'Logged in' : 'Guest'}</div>
}
```

👉 Thực tế: `AuthStatus` không bị re-render khi login thay đổi dữ liệu khác ngoài `isAuthenticated`.

---
### 2.5. **combine** (tách state + actions gọn hơn)
```ts
import { combine } from "zustand/middleware";

combine(
  initialState: Partial<T>, 
  create: (set, get, api) => Actions
)
```
**Ví dụ:**

```ts
const useStore = create(
  combine(
    { count: 0 }, // state
    (set) => ({
      inc: () => set((s) => ({ count: s.count + 1 })), // action
    })
  )
);
```
---
### 2.6. **Custom Middleware** (tự viết)
Cú pháp chung:

```ts
import { StateCreator } from "zustand";

const myMiddleware = <T extends object>(
  config: StateCreator<T>
): StateCreator<T> =>
  (set, get, api) =>
    config(
      (args) => {
        // before set
        console.log("State update:", args);
        set(args); // gọi set bình thường
        // after set
      },
      get,
      api
    );
```
✅ **Tham số trong middleware**:

* `set`: cập nhật state (như bình thường).
* `get`: đọc state hiện tại.
* `api`: chứa thêm method `subscribe`, `destroy`, `setState`, `getState`.
---
# 📌 Tổng hợp khi khai báo store với middleware

```ts
import { create } from "zustand";
import { devtools, persist, subscribeWithSelector, immer } from "zustand/middleware";
import { myMiddleware } from "./logger";

type Store = { count: number; inc: () => void };

export const useStore = create<Store>()(
  myMiddleware(                        // custom logger
    devtools(                          // Redux DevTools
      persist(                         // localStorage
        subscribeWithSelector(         // sub 1 slice
          immer(                       // mutate style
            (set) => ({
              count: 0,
              inc: () => set((s) => { s.count += 1 }),
            })
          )
        ),
        { name: "app-storage" }
      )
    )
  )
);
```

👉 Middleware có thể **lồng nhau** theo thứ tự.

---
## 3. Tổng hợp ứng dụng thực tế trong công ty lớn

* **devtools**: Debug bug production khó tìm → QA/Testers check lại state timeline.
* **persist**: Giỏ hàng, session user, theme setting.
* **immer**: Quản lý form profile với nhiều nested object (address, preferences, etc.).
* **subscribeWithSelector**: Dashboard phức tạp, chỉ một widget cần listen một phần nhỏ state.

---

## 4. Best Practices trong dự án lớn

1. **Không persist toàn bộ store** → chỉ lưu những gì cần (auth, theme, cart).
2. **Luôn bật devtools trong development** → tắt ở production nếu ảnh hưởng performance.
3. **Immer chỉ dùng khi state phức tạp** → nếu state phẳng thì không cần.
4. **Dùng subscribeWithSelector để tối ưu** → đặc biệt khi có nhiều component nhỏ.

---

## 5. Câu hỏi phỏng vấn & trả lời

**Q1: Middleware trong Zustand là gì?**
👉 Là lớp bọc mở rộng store, giúp thêm tính năng (persist, debug, immutable, optimize).

**Q2: Khi nào dùng persist?**
👉 Khi bạn cần giữ state sau reload, ví dụ auth token, giỏ hàng.

**Q3: Immer giúp ích gì?**
👉 Viết code dễ đọc hơn khi update nested state, vẫn đảm bảo bất biến.

**Q4: Tại sao subscribeWithSelector quan trọng?**
👉 Nó giúp component chỉ re-render khi phần state cần thiết thay đổi → tránh lãng phí.

---


# 🧩 Code Challenge: Quản lý Giỏ Hàng với Middleware

### Bài toán

Bạn cần xây dựng **cartStore** với các yêu cầu sau:

1. **Persist** giỏ hàng vào `localStorage` (khi reload vẫn giữ sản phẩm).
2. **Devtools** để debug khi thêm/xóa sản phẩm.
3. **Immer** để quản lý state nested:

   * `cart.items` là mảng object `{ id, name, price, quantity }`.
4. **subscribeWithSelector** để component `CartBadge` chỉ re-render khi `cart.items.length` thay đổi.

👉 Đây là yêu cầu phổ biến trong e-commerce app tại công ty lớn.

---

### Gợi ý interface TypeScript

```ts
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}
```

---

### ✅ Solution (Best Practices)

```ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { subscribeWithSelector } from 'zustand/middleware'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartState>()(
  subscribeWithSelector(
    devtools(
      persist(
        immer((set, get) => ({
          items: [],
          addItem: (item) =>
            set((state) => {
              const existing = state.items.find((i) => i.id === item.id)
              if (existing) {
                existing.quantity += item.quantity
              } else {
                state.items.push(item)
              }
            }),
          removeItem: (id) =>
            set((state) => {
              state.items = state.items.filter((i) => i.id !== id)
            }),
          clearCart: () =>
            set((state) => {
              state.items = []
            }),
          totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
          totalPrice: () =>
            get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        })),
        { name: 'cart-storage' }
      )
    )
  )
)
```

---

### 🎯 Cách dùng trong component

```tsx
import React, { useEffect } from 'react'
import { useCartStore } from '../store/cartStore'

// Component hiển thị badge số lượng item
export const CartBadge = () => {
  const total = useCartStore((s) => s.totalItems())

  return <span>🛒 {total}</span>
}

// Component log thay đổi
export const CartLogger = () => {
  useEffect(() => {
    const unsub = useCartStore.subscribe(
      (state) => state.items.length, // chỉ nghe length
      (length) => {
        console.log(`Cart length changed: ${length}`)
      }
    )
    return () => unsub()
  }, [])

  return null
}
```

---

### 💡 Best Practices áp dụng

1. **Immer** → code update nested state (items) ngắn gọn.
2. **Persist** → giỏ hàng không mất khi reload.
3. **Devtools** → dễ debug trong development.
4. **subscribeWithSelector** → `CartBadge` không bị re-render khi giá trị khác ngoài `items.length` thay đổi.

---

📌 [<< Ngày 04](./Day04.md) | [Ngày 05 B - Persist >>](./Day05-B-Persist.md)
