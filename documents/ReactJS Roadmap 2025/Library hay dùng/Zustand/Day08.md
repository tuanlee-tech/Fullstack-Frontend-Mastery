# 🟦 Day 8: Modular Store Architecture với Zustand

## 1. Tại sao cần Modular Architecture?

Khi ứng dụng còn nhỏ, bạn có thể viết toàn bộ state và action trong **một store duy nhất**. Nhưng khi app lớn dần:

* Store trở nên cồng kềnh, khó bảo trì.
* Khó tái sử dụng code (ví dụ auth và cart lại dính chặt vào nhau).
* Khó scale khi nhiều dev cùng tham gia.

👉 Giải pháp: **chia nhỏ store thành nhiều module (slice)**. Mỗi slice quản lý một mảng chức năng độc lập (auth, cart, product, …).

---

## 2. Kiến trúc Slice

### a. Slice là gì?

* Một slice = **state + actions** liên quan đến một domain (phạm vi chức năng).
* Ví dụ: `authSlice` chỉ quản lý login/logout, `cartSlice` chỉ quản lý giỏ hàng.

---

### b. Ví dụ Auth Slice

```ts
// authSlice.ts
import { StateCreator } from "zustand";

export interface AuthSlice {
  user: { id: number; name: string } | null;
  login: (name: string) => void;
  logout: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,
  login: (name) => set({ user: { id: Date.now(), name } }),
  logout: () => set({ user: null }),
});
```

---

### c. Ví dụ Cart Slice

```ts
// cartSlice.ts
import { StateCreator } from "zustand";

export interface CartSlice {
  items: { id: number; name: string; qty: number }[];
  addItem: (item: { id: number; name: string }) => void;
  clearCart: () => void;
}

export const createCartSlice: StateCreator<CartSlice> = (set) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const exists = state.items.find((i) => i.id === item.id);
      return exists
        ? {
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, qty: i.qty + 1 } : i
            ),
          }
        : { items: [...state.items, { ...item, qty: 1 }] };
    }),
  clearCart: () => set({ items: [] }),
});
```

---

### d. Ghép nhiều Slice thành Root Store

```ts
// store.ts
import { create } from "zustand";
import { AuthSlice, createAuthSlice } from "./authSlice";
import { CartSlice, createCartSlice } from "./cartSlice";

// Root type = union của tất cả slice
type StoreState = AuthSlice & CartSlice;

export const useStore = create<StoreState>()((...a) => ({
  ...createAuthSlice(...a),
  ...createCartSlice(...a),
}));
```

---

## 3. Sử dụng trong Component

```tsx
// Navbar.tsx
import { useStore } from "./store";

function Navbar() {
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);

  return (
    <div>
      {user ? (
        <>
          <span>Hello, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <span>Guest</span>
      )}
    </div>
  );
}
```

```tsx
// Cart.tsx
import { useStore } from "./store";

function Cart() {
  const items = useStore((s) => s.items);
  const addItem = useStore((s) => s.addItem);

  return (
    <div>
      <h3>Cart ({items.length})</h3>
      <button onClick={() => addItem({ id: 1, name: "Apple" })}>
        Add Apple
      </button>
    </div>
  );
}
```

---

## 4. Best Practices

* Mỗi slice càng độc lập càng tốt (ít phụ thuộc nhau).
* Chỉ merge slice ở **root store**.
* Dùng **selector** (`useStore(s => s.cart.items)`) để tránh re-render toàn bộ component.
* Với logic async phức tạp, kết hợp thêm **middleware** (như ở Day 7).

---

## 5. Bài tập

**Level 1**

* Tách `auth` và `cart` thành 2 slice.
* Hiển thị username trên Navbar.

**Level 2**

* Thêm action `removeItem(id)` trong cart.
* Xóa item cụ thể và update qty đúng.

**Level 3**

* Tạo `productSlice` chứa danh sách sản phẩm + action `fetchProducts()`.
* Cho phép user chọn sản phẩm để add vào cart.

**Level 4 (Challenge)**

* Làm mini e-commerce app:

  * Auth (login/logout).
  * Product list (fetch từ `/api/products`).
  * Cart (add/remove/clear).
  * Tất cả chia thành slice.

---

# 🟦 Day 8 – Code Challenge Solution

## 📌 Level 1 – Auth + Cart slice cơ bản

```ts
// store/authSlice.ts
import { StateCreator } from "zustand";

export interface AuthSlice {
  user: { id: number; name: string } | null;
  login: (name: string) => void;
  logout: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,
  login: (name) => set({ user: { id: Date.now(), name } }),
  logout: () => set({ user: null }),
});
```

```ts
// store/cartSlice.ts
import { StateCreator } from "zustand";

export interface CartItem {
  id: number;
  name: string;
  qty: number;
}

export interface CartSlice {
  items: CartItem[];
  addItem: (item: { id: number; name: string }) => void;
  clearCart: () => void;
}

export const createCartSlice: StateCreator<CartSlice> = (set) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      return existing
        ? {
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, qty: i.qty + 1 } : i
            ),
          }
        : { items: [...state.items, { ...item, qty: 1 }] };
    }),
  clearCart: () => set({ items: [] }),
});
```

```ts
// store/index.ts
import { create } from "zustand";
import { AuthSlice, createAuthSlice } from "./authSlice";
import { CartSlice, createCartSlice } from "./cartSlice";

type StoreState = AuthSlice & CartSlice;

export const useStore = create<StoreState>()((...a) => ({
  ...createAuthSlice(...a),
  ...createCartSlice(...a),
}));
```

---

## 📌 Level 2 – Thêm removeItem

```ts
// store/cartSlice.ts (cập nhật)
export interface CartSlice {
  items: CartItem[];
  addItem: (item: { id: number; name: string }) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
}

export const createCartSlice: StateCreator<CartSlice> = (set) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      return existing
        ? {
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, qty: i.qty + 1 } : i
            ),
          }
        : { items: [...state.items, { ...item, qty: 1 }] };
    }),
  removeItem: (id) =>
    set((state) => ({
      items: state.items
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0),
    })),
  clearCart: () => set({ items: [] }),
});
```

---

## 📌 Level 3 – Product slice (fetch API)

```ts
// store/productSlice.ts
import { StateCreator } from "zustand";

export interface Product {
  id: number;
  name: string;
}

export interface ProductSlice {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

export const createProductSlice: StateCreator<ProductSlice> = (set) => ({
  products: [],
  loading: false,
  error: null,
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to load products");
      const data: Product[] = await res.json();
      set({ products: data, loading: false });
    } catch (err) {
      set({ error: "Error fetching products", loading: false });
    }
  },
});
```

```ts
// store/index.ts (cập nhật)
import { ProductSlice, createProductSlice } from "./productSlice";

type StoreState = AuthSlice & CartSlice & ProductSlice;

export const useStore = create<StoreState>()((...a) => ({
  ...createAuthSlice(...a),
  ...createCartSlice(...a),
  ...createProductSlice(...a),
}));
```


---

### 📌 Bối cảnh

Khi bạn dùng `create` của Zustand:

```ts
const useStore = create<MyState>()((set, get, api) => ({
  // state + actions
}));
```

Hàm callback `(set, get, api)` chính là **cái mà Zustand đưa cho bạn** để tạo store.

* `set`: cập nhật state.
* `get`: lấy state hiện tại.
* `api`: chứa các tiện ích khác (subscribe, destroy...).

---

### 📌 Vấn đề modular store

Khi bạn chia store thành nhiều slice (auth, cart, product...), mỗi slice cũng cần `(set, get, api)` để hoạt động.

Ví dụ:

```ts
export const createAuthSlice: StateCreator<AuthSlice> = (set, get, api) => ({
  user: null,
  login: (name) => set({ user: { id: Date.now(), name } }),
  logout: () => set({ user: null }),
});
```

---

### 📌 Vậy `(...a) => ({ ... })` là gì?

Trong `store/index.ts` bạn viết:

```ts
export const useStore = create<StoreState>()((...a) => ({
  ...createAuthSlice(...a),
  ...createCartSlice(...a),
}));
```

* `(...a)` ở đây chính là **cú pháp rest parameter trong JS/TS**.
* Khi Zustand gọi callback, nó truyền vào `(set, get, api)`.
* Nghĩa là `a` = `[set, get, api]`.

👉 Nên `...a` = `set, get, api`.

---

### 📌 Lợi ích

Thay vì viết dài dòng:

```ts
export const useStore = create<StoreState>()((set, get, api) => ({
  ...createAuthSlice(set, get, api),
  ...createCartSlice(set, get, api),
}));
```

Viết gọn lại:

```ts
(...a) => ({
  ...createAuthSlice(...a),
  ...createCartSlice(...a),
})
```

---

### 📌 Tóm tắt

* `a` = mảng `[set, get, api]`.
* `...a` = truyền từng phần tử ra thành tham số.
* Dùng để **forward (chuyển tiếp)** `set, get, api` cho từng slice.
* Đây chỉ là **syntactic sugar** (cách viết ngắn gọn hơn).


---

## 📌 Level 4 – Mini E-commerce App

```tsx
// components/Navbar.tsx
import { useStore } from "../store";

export function Navbar() {
  const user = useStore((s) => s.user);
  const login = useStore((s) => s.login);
  const logout = useStore((s) => s.logout);

  return (
    <nav>
      {user ? (
        <>
          <span>Hello {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login("Alice")}>Login</button>
      )}
    </nav>
  );
}
```

```tsx
// components/ProductList.tsx
import { useEffect } from "react";
import { useStore } from "../store";

export function ProductList() {
  const products = useStore((s) => s.products);
  const fetchProducts = useStore((s) => s.fetchProducts);
  const addItem = useStore((s) => s.addItem);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div>
      <h3>Products</h3>
      {products.map((p) => (
        <div key={p.id}>
          {p.name}
          <button onClick={() => addItem(p)}>Add</button>
        </div>
      ))}
    </div>
  );
}
```

```tsx
// components/Cart.tsx
import { useStore } from "../store";

export function Cart() {
  const items = useStore((s) => s.items);
  const removeItem = useStore((s) => s.removeItem);
  const clearCart = useStore((s) => s.clearCart);

  return (
    <div>
      <h3>Cart</h3>
      {items.map((i) => (
        <div key={i.id}>
          {i.name} x {i.qty}
          <button onClick={() => removeItem(i.id)}>-</button>
        </div>
      ))}
      {items.length > 0 && <button onClick={clearCart}>Clear</button>}
    </div>
  );
}
```

---

✅ Với kiến trúc modular này:

* Store chia nhỏ thành **auth / cart / product** → dễ bảo trì.
* Tất cả action đều **typed** → tránh bug.
* Component chỉ re-render khi selector thay đổi.

---

---

📌 [<< Ngày 07](./Day07.md) | [Ngày 09 >>](./Day09.md)