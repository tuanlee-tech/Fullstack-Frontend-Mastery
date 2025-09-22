# 🚀 Hướng Dẫn Toàn Diện Về Combine Middleware Trong Zustand

Combine middleware trong Zustand là một công cụ ít được nhắc đến nhưng rất hữu ích để cấu trúc store một cách rõ ràng, tách biệt giữa initial state và actions, giúp code dễ đọc và maintain hơn trong dự án lớn. Chuyên đề này tập trung vào các trường hợp thực tế, từ counter đơn giản đến auth/cart kết hợp, và pattern enterprise như module hóa root store. Chúng ta sẽ phân tích các vấn đề thường gặp, nguyên nhân, giải pháp kèm code mẫu, các tùy chọn nâng cao, tình huống thực tế, trade-off, best practices, kịch bản bug, và các demo kết hợp với persist/partialize.

---

## 1. Định Nghĩa Và Ý Tưởng Chính

`Combine` middleware (`import { combine } from 'zustand/middleware'`) giúp tách biệt:
- **Initial state:** Object chứa state ban đầu.
- **Actions:** Hàm trả về object chứa các action (logic cập nhật state).

Công thức cơ bản:
```ts
import { create } from "zustand";
import { combine } from "zustand/middleware";

export const useStore = create(
  combine(
    initialState,  // Object state ban đầu
    (set, get) => actions  // Hàm trả về object actions
  )
);
```

Lợi ích chính: Tránh trộn lẫn state và actions trong một object duy nhất, làm code rõ ràng hơn, dễ scale cho team lớn.

---

## 2. Các Vấn Đề Thường Gặp Và Giải Pháp

Dưới đây là các vấn đề phổ biến khi sử dụng `combine`, kèm phân tích nguyên nhân và cách khắc phục.

### 2.1. Code Lẫn Lộn State/Actions
**Vấn đề:** State và actions trộn lẫn, khó đọc trong store lớn.

**Nguyên nhân:** Cách viết mặc định của Zustand trộn chung.

**Giải pháp:** Sử dụng `combine` để tách biệt.

**Code sai (thường):**
```ts
create((set, get) => ({
  count: 0,  // State lẫn với actions
  inc: () => set({ count: get().count + 1 }),
}));
```

**Code fix:**
```ts
create(
  combine(
    { count: 0 },  // State rõ ràng
    (set, get) => ({
      inc: () => set({ count: get().count + 1 }),
    })
  )
);
```

### 2.2. Khó Maintain Khi Team Lớn
**Vấn đề:** Dev mới khó hiểu cấu trúc store.

**Nguyên nhân:** Không tách rõ state/actions.

**Giải pháp:** `Combine` giúp phân chia, dễ onboard.

### 2.3. Tích Hợp Persist Sai
**Vấn đề:** Persist không hoạt động đúng khi kết hợp.

**Nguyên nhân:** Thứ tự middleware sai hoặc không partialize.

**Giải pháp:** Wrap combine trong persist, dùng partialize để chọn field lưu.

**Code mẫu:**
```ts
create(
  persist(
    combine(
      { user: null, loading: false },
      (set) => ({ login: () => { /* ... */ } })
    ),
    { name: "store", partialize: (state) => ({ user: state.user }) }
  )
);
```

### 2.4. State Transient Không Được Persist
**Vấn đề:** Lưu nhầm state tạm thời (loading, total).

**Nguyên nhân:** Persist mặc định lưu hết.

**Giải pháp:** Partialize để loại bỏ transient fields.

### 2.5. Debug Khó Với Multi-Slice
**Vấn đề:** Root store lớn, khó trace slice nào.

**Nguyên nhân:** Không module hóa.

**Giải pháp:** Kết hợp combine với devtools, đặt tên action theo slice (auth/login).

---

## 3. Tóm Tắt Các Vấn Đề Và Giải Pháp

| Vấn Đề                    | Nguyên Nhân                          | Giải Pháp                                   |
| ------------------------- | ------------------------------------ | ------------------------------------------- |
| Code lẫn lộn state/actions| Cách viết mặc định                   | Sử dụng combine để tách                     |
| Khó maintain team lớn     | Không cấu trúc rõ                    | Tách state/actions, module hóa              |
| Persist sai               | Thứ tự middleware hoặc lưu hết       | Wrap đúng, partialize field cần             |
| Lưu transient state       | Persist mặc định                     | Partialize loại bỏ loading/total            |
| Debug multi-slice         | Store lớn không trace rõ             | Kết hợp devtools, tên action slice/action   |

---

## 4. Cheatsheet Combine Middleware

Combine không có option phức tạp, chỉ cần:

```ts
combine(
  initialState: Object,  // State ban đầu
  actionsCreator: (set, get) => Object  // Actions
)
```

### Chi Tiết
- **initialState:** Object plain, không chứa functions (actions).
- **actionsCreator:** Hàm nhận set/get, trả về object actions (có thể async).

### Trade-Off Của Combine

| Tiêu Chí         | Cách Thường | Combine            |
| ---------------- | ----------- | ------------------ |
| Cú pháp          | Ngắn hơn    | Dài hơn một chút   |
| Đọc state/action | Lẫn nhau    | Rõ ràng, tách bạch |
| Team lớn         | Dễ nhầm lẫn | Dễ đọc, dễ scale   |
| Debug            | Bình thường | Clear phân chia    |

---

## 5. Các Tình Huống Thực Tế

### 5.1. Counter Store
**Vấn đề:** State/actions lẫn lộn.

**Code mẫu:**
```ts
create(
  combine(
    { count: 0 },
    (set, get) => ({
      inc: () => set({ count: get().count + 1 }),
      dec: () => set({ count: get().count - 1 }),
    })
  )
);
```

### 5.2. Auth Store
```ts
type User = { id: number; name: string } | null;

create(
  combine(
    { user: null as User, loading: false },
    (set) => ({
      login: async (name: string) => {
        set({ loading: true });
        await new Promise((r) => setTimeout(r, 1000));
        set({ user: { id: Date.now(), name }, loading: false });
      },
      logout: () => set({ user: null }),
    })
  )
);
```

### 5.3. Cart Store
**Vấn đề:** Persist lưu nhầm total/discount.

**Code mẫu:**
```ts
type CartItem = { id: number; name: string; price: number; qty: number };

create(
  persist(
    combine(
      { items: [] as CartItem[], total: 0, discount: 0 },
      (set, get) => ({
        addItem: (item: Omit<CartItem, "id">) => {
          const newItem = { ...item, id: Date.now() };
          set((state) => {
            const updatedItems = [...state.items, newItem];
            return {
              items: updatedItems,
              total: updatedItems.reduce((sum, it) => sum + it.price * it.qty, 0),
            };
          });
        },
        removeItem: (id: number) => {
          set((state) => {
            const updatedItems = state.items.filter((i) => i.id !== id);
            return {
              items: updatedItems,
              total: updatedItems.reduce((sum, it) => sum + it.price * it.qty, 0),
            };
          });
        },
        clearCart: () => set({ items: [], total: 0, discount: 0 }),
        applyDiscount: (percent: number) => {
          set((state) => ({
            discount: state.total * (percent / 100),
          });
        },
      })
    ),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),  // Chỉ lưu items
    }
  )
);
```

**Sử dụng:**
```tsx
const { items, total, discount, addItem, removeItem, clearCart, applyDiscount } = useCartStore();

<button onClick={() => addItem({ name: "Sofa", price: 1000, qty: 1 })}>Add</button>
<p>Total: ${total - discount}</p>
```

---

## 6. Kịch Bản Bug Thường Gặp Với Combine

### 6.1. Actions Không Được Export
**Vấn đề:** Quên export actions trong actionsCreator.

**Code sai:**
```ts
combine(
  { count: 0 },
  (set) => { inc: () => {} }  // Sai: không return object
);
```

**Code fix:**
```ts
combine(
  { count: 0 },
  (set) => ({ inc: () => {} })
);
```

### 6.2. Persist Lưu Actions
**Vấn đề:** Persist lưu nhầm actions (functions).

**Giải pháp:** Partialize loại bỏ functions.

### 6.3. Second Order Middleware Sai
**Vấn đề:** Combine trong persist sai thứ tự.

**Code fix:** Combine trong persist.

### 6.4. State Không Update
**Vấn đề:** Mutate state không đúng trong actions.

**Giải pháp:** Kết hợp immer nếu nested state.

### 6.5. Multi-Slice Trùng Tên
**Vấn đề:** Slice tên trùng trong root store.

**Giải pháp:** Prefix slice (auth_token, cart_items).

---

## 7. Trade-Off & Best Practices Của Combine

### 7.1. Ưu Điểm
1. **Rõ Ràng:** Tách state/actions, dễ đọc.
2. **Dễ Scale:** Phù hợp team lớn, multi-slice.
3. **Kết Hợp Tốt:** Với persist (lưu state), devtools (trace actions).

### 7.2. Nhược Điểm
1. **Cú Pháp Dài Hơn:** Thêm vài dòng so với cách thường.
2. **Không Linh Hoạt Với Non-Object State:** Initial state phải object.
3. **Partialize Cần Cẩn Thận:** Khi persist, dễ quên loại transient fields.

### 7.3. Best Practices
1. **Tách Slice Rõ:** Prefix state/actions theo module (auth_, cart_).
2. **Partialize Khi Persist:** Chỉ lưu persistent data.
3. **Kết Hợp Immer:** Nếu nested state, wrap immer trong combine.
4. **Devtools:** Đặt tên action slice/action (auth/login).
5. **Root Store Cho Multi-Slice:** Merge slices vào một store cho đồng bộ.

---

## 8. Demo: Root Store (Auth + Cart Với Combine + Persist + Partialize)

```ts
import { create } from "zustand";
import { combine, persist } from "zustand/middleware";

type User = { id: number; name: string } | null;

type CartItem = { id: number; name: string; price: number; qty: number };

type RootState = {
  token: string | null;
  user: User;
  items: CartItem[];
  login: (token: string, user: { id: number; name: string }) => void;
  logout: () => void;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
};

export const useStore = create<RootState>()(
  persist(
    combine(
      {
        token: null,
        user: null,
        items: [],
      },
      (set, get) => ({
        login: (token, user) => set({ token, user }),
        logout: () => set({ token: null, user: null, items: [] }),
        addItem: (item) => {
          const newItem = { ...item, id: Date.now() };
          set({ items: [...get().items, newItem] });
        },
        removeItem: (id) => {
          set({ items: get().items.filter((i) => i.id !== id) });
        },
        clearCart: () => set({ items: [] }),
      })
    ),
    {
      name: "root-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        items: state.items,
      }),
    }
  )
);
```

**Sử dụng:**
```tsx
const { token, user, login, logout, items, addItem, removeItem, clearCart } = useStore();

<button onClick={() => login("token-123", { id: 1, name: "User" })}>Login</button>
<ul>{items.map((i) => <li>{i.name} <button onClick={() => removeItem(i.id)}>Remove</button></li>)}</ul>
```

**Điểm Mạnh:** Multi-slice trong root store, persist selective, dễ mở rộng.

**Trade-Off:** Root store tiện đồng bộ nhưng có thể re-render thừa nếu không selector.

---

## 9. Tổng Kết

`Combine` giúp cấu trúc store rõ ràng, dễ maintain, đặc biệt khi kết hợp persist/partialize cho auth/cart. Trade-off: Cú pháp dài hơn nhưng đáng giá cho project lớn.

**Case thực tế:** Counter, auth, cart, root store đều hưởng lợi từ combine.

---

📌 [<< Ngày 05 E SubscribeWithSelector](./Day05-E-SubscribeWithSelector.md) | [Ngày 05 G Custom-Middleware >>](./Day05-G-Custom-Middleware.md)
