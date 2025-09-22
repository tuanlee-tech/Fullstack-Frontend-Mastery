# 📑 Mục lục Khoá Học Zustand Mastery (10 ngày)

## Phase 1 – Cơ bản (Day 1–2)

### **Day 1: Giới thiệu Zustand & Store đầu tiên**

* Học được:

  * Khái niệm store, action, state trong Zustand.
  * Tạo counter app đầu tiên.
  * So sánh Zustand với Redux/Context API.
* Trong công ty lớn:

  * Bạn sẽ hiểu vì sao nhiều dự án bỏ Redux Toolkit để dùng Zustand (nhẹ, ít boilerplate).
  * Biết cách tạo state quản lý **UI nhỏ** (modal, filter) mà không tốn Redux slice.

### **Day 2: Selector & Tối ưu hoá hiệu năng**

* Học được:

  * Dùng selector để lấy một phần state.
  * Tránh re-render toàn bộ component tree.
  * Cập nhật state dạng object/array theo best practice.
* Trong công ty lớn:

  * Giúp dự án frontend có hàng nghìn component **render nhanh**, không bị lag.
  * Thành kỹ năng **bắt buộc** để scale UI dashboard/phần mềm enterprise.

---

## Phase 2 – Quản lý UI State (Day 3–4)

### **Day 3: Modal & Dialog Management**

* Học được:

  * Quản lý mở/đóng modal với Zustand.
  * Xử lý nhiều modal/phức tạp.
* Trong công ty lớn:

  * Dùng cho các app có nhiều popup: form, confirm, upload.
  * Tránh spaghetti code khi prop-drilling state modal.

### **Day 4: Theme & Preferences**

* Học được:

  * Tạo global theme store (dark/light).
  * Lưu và restore theme qua localStorage.
* Trong công ty lớn:

  * Enterprise app luôn có **user preferences** (theme, ngôn ngữ, layout).
  * Đây là phần **cốt lõi** để xây dựng trải nghiệm cá nhân hoá (personalization).

---

## Phase 3 – Middleware & Async (Day 5–7)

### **Day 5: Persist Middleware**

* Học được:

  * Dùng middleware `persist` lưu state.
  * Khi nào nên persist (auth token, settings).
* Trong công ty lớn:

  * **Session management**: Giữ user login sau khi reload.
  * Tránh bug mất state khi user refresh tab.

### **Day 6: Devtools & Debugging**

* Học được:

  * Tích hợp Redux DevTools để theo dõi state.
  * Debug actions dễ dàng.
* Trong công ty lớn:

  * Debug là kỹ năng sống còn trong team.
  * DevTools giúp **code review dễ hơn**, ai cũng thấy state thay đổi ra sao.

### **Day 7: Async Actions & API Calls**

* Học được:

  * Gọi API trong store.
  * Quản lý `loading`, `error`, `data`.
  * Khi nào để async trong Zustand, khi nào nên để React Query.
* Trong công ty lớn:

  * Thực tế enterprise **dùng cả React Query + Zustand**.
  * Zustand cho **local/UI state**, React Query cho **server state**.

---

## Phase 4 – Production Patterns (Day 8–10)

### **Day 8: Modular Store Architecture**

* Học được:

  * Tách store thành modules: `useAuthStore`, `useCartStore`, `useUIStore`.
  * Tái sử dụng trong project lớn.
* Trong công ty lớn:

  * Bắt buộc, vì project nhiều team cùng làm → phải **chia module rõ ràng**.
  * Giúp onboard dev mới nhanh hơn.

### **Day 9: Kết hợp với React Query**

* Học được:

  * Hiểu ranh giới giữa Zustand và React Query.
  * Thực hành phối hợp 2 lib.
* Trong công ty lớn:

  * Đây là **pattern chuẩn enterprise**:

    * React Query: gọi API, cache, retry.
    * Zustand: modal, filter, UI state.

### **Day 10: Mini-Project – Task Manager App**

* Học được:

  * Dựng app với login giả, CRUD task, theme toggle, modal.
  * Triển khai lên Vercel.
* Trong công ty lớn:

  * Đây là **case study thực tế**:

    * Task manager = pattern của **Jira, Trello, Asana**.
  * Bạn sẽ nắm full lifecycle: từ auth → UI state → persist → API.

---

# 🎯 Tổng kết: Sau khoá học bạn sẽ

* Hiểu rõ state management hiện đại (Zustand vs Redux vs React Query).
* Viết store **clean, production-ready**.
* Biết tổ chức project state cho team enterprise.
* Tránh lỗi phổ biến (re-render thừa, state mất sau reload, logic async sai).
* Có trong tay 3 demo + 1 project lớn (Task Manager App).

---
# 📝 Cheatsheet Làm Chủ Zustand (10 Ngày)

Cheatsheet này tổng hợp các pattern, hooks và middleware quan trọng của Zustand, bao gồm tạo store, selectors, pattern UI state, middleware (persist, subscribeWithSelector, devtools, combine, immer, asyncAction tùy chỉnh), và các best practice cho ứng dụng enterprise. Lý tưởng để học nhanh và áp dụng vào dự án thực tế.

---

## 1️⃣ Tạo Store Cơ Bản
```ts
import { create } from 'zustand';

type CounterStore = {
  count: number;
  increment: () => void;
};

export const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```
**Mẹo:**
- Dùng `set(state => ...)` để tránh ghi đè state.
- Dùng `get()` để lấy state hiện tại trong action.
- TypeScript: Định nghĩa interface store để đảm bảo type safety.

---

## 2️⃣ Selector & Tối Ưu Re-render
```ts
// Chỉ render lại khi count thay đổi
const count = useCounterStore((state) => state.count);
```
**Dùng subscribeWithSelector:**
```ts
import { subscribeWithSelector } from 'zustand/middleware';

const useStore = create(subscribeWithSelector((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
})));

useStore.subscribe((state) => state.count, (count) => {
  console.log('Count thay đổi:', count);
});
```
**Tại sao?** Ngăn re-render không cần thiết trong ứng dụng lớn bằng cách theo dõi các slice state cụ thể.

---

## 3️⃣ Pattern UI State
- **Modal / Dialog**
```ts
type UIStore = {
  showModal: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const useUIStore = create<UIStore>((set) => ({
  showModal: false,
  openModal: () => set({ showModal: true }),
  closeModal: () => set({ showModal: false }),
}));
```
- **Theme / Tùy chỉnh**
```ts
type ThemeStore = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));
```
**Mẹo Enterprise:** Tách modal, theme, UI state thành các slice riêng để dễ module hóa và maintain.

---

## 4️⃣ Pattern Middleware
| Middleware            | Mục đích                                    | Ví dụ Code                              |
|-----------------------|---------------------------------------------|-----------------------------------------|
| **persist**           | Lưu state qua reload                        | `persist(store, { name: 'auth' })`      |
| **subscribeWithSelector** | Theo dõi state cụ thể, tránh re-render | `subscribeWithSelector(store)`          |
| **devtools**          | Debug dễ dàng trong devtools trình duyệt    | `devtools(store, { name: 'Store' })`    |
| **immer**             | Cập nhật state bất biến dễ dàng             | `immer(store)`                          |
| **combine**           | Tách state và actions                       | `combine({ count: 0 }, (set) => ({...}))` |
| **custom (asyncAction)** | Xử lý async, hủy request                | Xem dưới đây                            |

**Ví dụ asyncAction Middleware Tùy chỉnh:**
```ts
interface AsyncControllerState {
  _reqId: number;
  _controller: AbortController | null;
}

const asyncAction = <T>(fn: (signal: AbortSignal, reqId: number) => Promise<T>) =>
  async (set: any, get: any) => {
    if (get()._controller) get()._controller.abort();
    const controller = new AbortController();
    const reqId = get()._reqId + 1;
    set({ _controller: controller, _reqId: reqId });
    try {
      const data = await fn(controller.signal, reqId);
      if (reqId === get()._reqId) return data;
    } catch (err: any) {
      if (err.name === 'AbortError') return null;
      throw err;
    }
  };
```

---

## 5️⃣ Combine Store / Slices
```ts
import { create } from 'zustand';
import { combine } from 'zustand/middleware';

type AuthSlice = {
  token: string | null;
  login: (token: string) => void;
};

type CartSlice = {
  items: { id: number }[];
  addItem: (item: { id: number }) => void;
};

export const useStore = create<AuthSlice & CartSlice>()(
  combine(
    { token: null, items: [] },
    (set) => ({
      login: (token) => set({ token }),
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
    })
  )
);
```
**Tại sao?** Tách state và actions giúp code rõ ràng, dễ scale cho ứng dụng enterprise.

---

## 6️⃣ Async / API Patterns
```ts
const fetchTasks = asyncAction(async (signal) => {
  const res = await fetch('/api/tasks', { signal });
  return res.json();
});
```
**Mẹo:**
- Dùng `asyncAction` để hủy request (với AbortController).
- Kết hợp React Query cho server state, Zustand cho UI state.

---

## 7️⃣ Best Practices Persist
```ts
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      token: null,
      login: (token) => set({ token }),
    }),
    {
      name: 'auth',
      partialize: (state) => ({ token: state.token }), // Chỉ lưu token
    }
  )
);
```
**Quy tắc:**
- Chỉ persist các field cần (auth token, theme).
- Không lưu dữ liệu nhạy cảm trong localStorage; dùng HttpOnly cookies.
- Dùng `version` để migrate state khi store thay đổi.

---

## 8️⃣ Pitfalls & Fixes Thường Gặp
| Vấn đề                     | Giải pháp                              |
|----------------------------|----------------------------------------|
| Re-render toàn cây component | Dùng selector / subscribeWithSelector |
| Ghi đè state               | Dùng `set(state => ...)`              |
| Race condition async       | Dùng asyncAction + AbortController     |
| Lưu dữ liệu nhạy cảm       | Mã hóa dữ liệu hoặc dùng HttpOnly cookies |
| Slice kết nối chặt chẽ     | Slice độc lập, single responsibility    |

---

## 9️⃣ Checklist Enterprise – Trước Khi Merge
1. ✅ **Lint/Prettier**: Code được format.
2. ✅ **TypeScript**: Type chính xác, tránh `any`.
3. ✅ **Selector**: Tối ưu render với selector.
4. ✅ **Async**: Hủy request cũ, xử lý loading/error.
5. ✅ **Persist**: Chỉ lưu dữ liệu cần, mã hóa token.
6. ✅ **Tests**: Unit test cho store và component.
7. ✅ **DevTools**: Bật để debug, tắt ở production.
8. ✅ **Slice**: Module hóa, single responsibility.
9. ✅ **Code Review**: Kiểm tra performance, re-render.
10. ✅ **Tài liệu**: README, comment inline cho middleware phức tạp.

---

## 10️⃣ Ví dụ Mini-Project (Task Manager)
```ts
import { create } from 'zustand';
import { combine, persist, subscribeWithSelector } from 'zustand/middleware';
import { asyncAction, withAbortAndRace } from './middleware/asyncAction';

type RootState = {
  token: string | null;
  tasks: { id: number; title: string; completed: boolean }[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
};

export const useStore = create<RootState>()(
  subscribeWithSelector(
    persist(
      withAbortAndRace(
        combine(
          { token: null, tasks: [], loading: false, _reqId: 0, _controller: null },
          (set, get) => ({
            login: (token) => set({ token }),
            fetchTasks: async () =>
              asyncAction(async (signal) => {
                const res = await fetch('/api/tasks', { signal });
                return res.json();
              })(set, get),
          })
        )
      ),
      { name: 'task-manager', partialize: (state) => ({ token: state.token }) }
    )
  )
);
```
