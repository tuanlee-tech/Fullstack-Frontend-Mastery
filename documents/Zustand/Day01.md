# 📘 Day 1: Giới thiệu Zustand & Store đầu tiên (TypeScript)

---

## 🎯 Mục tiêu học

1. Hiểu Zustand và cách so sánh với Redux/Context.
2. Cài đặt Zustand + TypeScript setup.
3. Viết store cơ bản bằng `create<T>()`.
4. Dùng `useStore` hook trong React component.
5. Biết cú pháp utility chính: `create`, `set`, `get`.
6. Xây dựng Counter App typed, clean code.

---

## 🔎 Tóm tắt ngắn

Zustand trong TypeScript sử dụng generic `create<T>()` để định nghĩa rõ ràng state và action. Điều này giúp code **an toàn, dễ refactor**, đặc biệt quan trọng trong enterprise project.

---

## 📚 Nội dung lý thuyết chi tiết

### 1. Cài đặt

```bash
npm install zustand
npm install --save-dev typescript @types/react @types/node
```

### 2. Cấu hình `tsconfig.json` (mẫu production-ready)

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "lib": ["DOM", "ES2021"],
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

---

### 3. Định nghĩa Store (Counter Example)

**`src/store/counterStore.ts`**

```ts
import { create } from 'zustand'

// 1️⃣ Khai báo type cho state
interface CounterState {
  count: number
  increase: () => void
  decrease: () => void
  reset: () => void
  double: () => void
}

// 2️⃣ Tạo store
export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  double: () => set((state) => ({ count: state.count * 2 })),
}))
```

---

### 4. Dùng trong Component

**`src/App.tsx`**

```tsx
import React from 'react'
import { useCounterStore } from './store/counterStore'

function App() {
  const { count, increase, decrease, reset, double } = useCounterStore()

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Counter: {count}</h1>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={increase}>+ Increase</button>
        <button onClick={decrease}>- Decrease</button>
        <button onClick={double}>x2 Double</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  )
}

export default App
```

---

## 🛠 Ví dụ thực tế (enterprise-friendly)

Trong hệ thống enterprise:

* `count` có thể là số **notification chưa đọc**.
* `increase` = nhận noti mới từ WebSocket.
* `reset` = user nhấn “Mark all as read”.
* `double` = giả lập event test (ít dùng thực tế, nhưng giúp minh họa mutation).

---

## 📝 Bài tập

### Level 1 – Cơ bản

**Đề:** Thêm action `triple` (nhân 3 count).
**Giải:**

```ts
triple: () => set((state) => ({ count: state.count * 3 })),
```

---

### Level 2 – Trung bình

**Đề:** Tạo thêm store `userStore` quản lý `username: string` và `setUsername(name: string)`.
**Giải:**

```ts
// store/userStore.ts
import { create } from 'zustand'

interface UserState {
  username: string
  setUsername: (name: string) => void
}

export const useUserStore = create<UserState>((set) => ({
  username: 'Guest',
  setUsername: (name) => set({ username: name }),
}))
```

---

### Level 3 – Nâng cao

**Đề:** Kết hợp cả `counterStore` + `userStore`, hiển thị greeting:
👉 “Hello {username}, your count is {count}”.

**Giải:**

```tsx
import { useCounterStore } from './store/counterStore'
import { useUserStore } from './store/userStore'

function Dashboard() {
  const { count, increase } = useCounterStore()
  const { username, setUsername } = useUserStore()

  return (
    <div>
      <h2>Hello {username}, your count is {count}</h2>
      <button onClick={increase}>+ Increase</button>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your name"
      />
    </div>
  )
}
```

---
### Cách Zustand truyền tham số

Một `StateCreator` trong Zustand luôn nhận 3 tham số:

```ts
(set, get, api) => ({ ...state })
```


1. **`set`**
   → Hàm để cập nhật state. Có 2 dạng:

   * `set(partial)` : merge trực tiếp object.
   * `set((prev) => newState)` : dựa trên state cũ (`prev`) để update.

2. **`get`**
   → Trả về state hiện tại (`get().someField`).
   Thường dùng trong action cần đọc state trước khi update.

3. **`api`**
   → Ít dùng hơn, nhưng cực quan trọng khi làm middleware hoặc quản lý nhiều store. Nó chứa:

   * `setState(partial, replace?)`: giống `set` nhưng bỏ qua middleware.
   * `getState()`: giống `get`.
   * `subscribe(listener, selector?, equalityFn?)`: đăng ký lắng nghe thay đổi.
   * `destroy()`: cleanup store (ít khi dùng).

---
### Ví dụ dùng `api`

### 1. Tạo unsubscribe handle

```ts
import { create } from "zustand";

type Store = { count: number; inc: () => void };

export const useCounter = create<Store>()((set, get, api) => {
  // ví dụ: auto log khi state thay đổi
  api.subscribe((s) => console.log("State changed:", s));

  return {
    count: 0,
    inc: () => set({ count: get().count + 1 }),
  };
});
```

Ở đây `api.subscribe` = công cụ mạnh để theo dõi state trong **middleware** hoặc để kết nối store với hệ thống khác.

---

### 2. Dùng trong custom middleware

```ts
import { create, StateCreator } from "zustand";

const logger =
  <T extends object>(config: StateCreator<T>): StateCreator<T> =>
  (set, get, api) => {
    api.subscribe((state) => {
      console.log("Changed:", state);
    });

    return config(set, get, api);
  };

type Store = { count: number; inc: () => void };

export const useLoggerStore = create<Store>()(
  logger((set) => ({
    count: 0,
    inc: () => set((s) => ({ count: s.count + 1 })),
  }))
);
```

---
## ⚠️ Common Pitfalls & Notes

* ❌ Không mutate trực tiếp state (`state.count++`).
* ❌ Không gọi `useCounterStore()` ngoài React component.
* ✅ Luôn khai báo type cho state để tránh bug runtime.
* ✅ Đặt store trong `src/store/` để dễ tổ chức khi project lớn.

---

## 📖 Further Reading

* [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)
* [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
* Pattern: **Typed Global State Management**

---

# 🎤 10 Câu hỏi phỏng vấn & Trả lời (Day 1 – Zustand cơ bản, TypeScript)

---

### 1. **Lợi ích của dùng Zustand so với Redux/Context API?**

✅ Trả lời:

* **So với Redux**: ít boilerplate, không cần action type, reducer dài dòng. Code ngắn gọn, dễ maintain.
* **So với Context API**: tránh re-render toàn bộ cây component khi state thay đổi.

---

### 2. **`create<T>()` trong TypeScript để làm gì?**

✅ Trả lời:

* `create<T>()` cho phép định nghĩa rõ ràng **shape** (hình dạng) của state và actions.
* Giúp code an toàn hơn, IDE auto-complete, refactor không vỡ.

---

### 3. **Tại sao phải khai báo interface cho store?**

✅ Trả lời:

* Giúp store **typed rõ ràng**, dễ scale.
* Enterprise project có hàng chục store → interface bắt buộc để team review dễ dàng.

---

### 4. **`set` có thể dùng callback hoặc object, khác nhau thế nào?**

✅ Trả lời:

* `set({ count: 5 })` → set trực tiếp.
* `set((state) => ({ count: state.count + 1 }))` → update dựa trên state hiện tại (an toàn hơn khi nhiều action cùng chạy).

---

### 5. **Khi nào cần `get` thay vì `useStore`?**

✅ Trả lời:

* `useStore` → dùng trong React component (hook).
* `get` → dùng ngoài component (ví dụ trong API service, event listener), khi không cần trigger re-render.

---

### 6. **Làm thế nào để quản lý nhiều store trong cùng project?**

✅ Trả lời:

* Tạo nhiều file: `authStore.ts`, `cartStore.ts`, `uiStore.ts`.
* Mỗi store quản lý một domain (theo **DDD – Domain Driven Design**).

---

### 7. **Ưu/nhược điểm của việc giữ nhiều logic trong cùng một store?**

✅ Trả lời:

* Ưu: dễ code nhanh cho prototype, mọi state ở 1 chỗ.
* Nhược: khó scale, khó test, dễ conflict khi nhiều dev cùng sửa.
* Best practice: **chia store theo domain**.

---

### 8. **Nếu mutate state trực tiếp (`state.count++`), có bug gì?**

✅ Trả lời:

* Zustand sẽ không detect được thay đổi, component không re-render.
* Có thể gây bug silent (state thay đổi nhưng UI không update).

---

### 9. **Zustand có thể dùng ngoài React không?**

✅ Trả lời:

* Có. Zustand chỉ là một state container.
* Có thể dùng với **vanilla JS, Vue, Node.js** để quản lý state mà không phụ thuộc vào React.

---

### 10. **Cách tốt nhất để tổ chức store trong dự án enterprise?**

✅ Trả lời:

* Tách store theo domain (`authStore`, `cartStore`, `uiStore`).
* Viết type rõ ràng (interface).
* Dùng middleware (`persist`, `devtools`) cho debug & session.
* Đặt store trong `src/store/` để toàn team dễ tìm.

---

# ⚡ So sánh cơ chế re-render: Context API vs Redux vs Zustand

## 1. **React Context API**

* **Cơ chế**: Khi `value` trong `<Context.Provider>` thay đổi → tất cả component con **dùng `useContext`** đều re-render.
* **Hệ quả**:

  * Nếu context chứa object lớn (state phức tạp) → thay đổi 1 field nhỏ cũng khiến toàn bộ consumer re-render.
  * Có thể tối ưu bằng `memo` hoặc tách context nhỏ, nhưng code dễ phức tạp.
* **Ví dụ**:

  ```tsx
  const ThemeContext = createContext({ dark: false });

  const Comp = () => {
    const { dark } = useContext(ThemeContext); // bất cứ khi nào dark thay đổi → re-render
    return <div>{dark ? "Dark" : "Light"}</div>;
  };
  ```

---

## 2. **Redux (Redux Toolkit + React-Redux)**

* **Cơ chế**:

  * Store thay đổi → `Provider` thông báo cho tất cả subscribers.
  * `useSelector` sẽ **so sánh shallow** state slice mà bạn select → chỉ re-render nếu slice đó thay đổi.
* **Hệ quả**:

  * Tốt hơn Context vì không bắt toàn bộ consumer re-render, chỉ re-render component nào **thật sự dùng slice bị đổi**.
  * Nhưng nếu selector trả về object mới mỗi lần (không memoize) → re-render không cần thiết.
* **Ví dụ**:

  ```tsx
  const count = useSelector((state) => state.counter.value);
  // chỉ re-render khi counter.value đổi
  ```

---

## 3. **Zustand**

* **Cơ chế**:

  * Component dùng `useStore(selector)` → Zustand theo dõi slice cụ thể đó.
  * Mặc định so sánh bằng **Object.is** (chính xác hơn shallow).
  * Re-render chỉ khi giá trị return của selector thay đổi.
* **Hệ quả**:

  * Granular re-render (rất mịn, chính xác).
  * Không bị context blasting (toàn bộ re-render).
  * Không cần nhiều boilerplate như Redux.
* **Ví dụ**:

  ```tsx
  const count = useStore((s) => s.count);
  // chỉ re-render khi s.count thay đổi, các field khác không ảnh hưởng
  ```

---

# 📊 Bảng so sánh tóm gọn

| Công cụ         | Khi nào re-render?                                                                   | So sánh performance             | Ưu / Nhược                                                |
| --------------- | ------------------------------------------------------------------------------------ | ------------------------------- | --------------------------------------------------------- |
| **Context API** | Bất cứ khi `value` thay đổi → tất cả consumer re-render                              | Kém nhất khi state lớn/phức tạp | Đơn giản, built-in, nhưng dễ lãng phí render              |
| **Redux**       | Component nào dùng `useSelector(slice)` sẽ re-render khi slice đổi (shallow compare) | Trung bình, khá tối ưu          | Enterprise-friendly, có devtools, nhưng nhiều boilerplate |
| **Zustand**     | Component chỉ re-render nếu **selector value thay đổi** (Object.is)                  | Tốt nhất, granular updates      | Gọn nhẹ, dễ dùng, nhưng ít convention hơn Redux           |

---

# 🎤 Câu hỏi phỏng vấn kèm trả lời

**Q: Tại sao nhiều công ty lớn vẫn chọn Redux thay vì Zustand?**
✅ Trả lời: Redux có **ecosystem lớn, convention rõ ràng, middleware mạnh (Saga/Thunk)**. Với team nhiều dev → dễ kiểm soát code. Zustand thì nhanh và tiện, nhưng thiếu opinionated structure, có thể gây hỗn loạn nếu team không thống nhất cách viết.

---

📌 [<< README](./README.md) | [Ngày 02 >>](./Day02.md)