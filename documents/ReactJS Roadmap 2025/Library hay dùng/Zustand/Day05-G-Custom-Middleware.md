# 🚀 Hướng Dẫn Toàn Diện Về Custom Middleware Trong Zustand

Custom middleware trong Zustand là cách mạnh mẽ để tùy chỉnh logic xử lý state, cho phép thêm các tính năng như logging, analytics, validation, hoặc tích hợp với hệ thống bên ngoài. Trong chuyên đề này, mình sẽ giải thích cách tạo custom middleware, các case thực tế (logging, analytics, async validation), kết hợp với các middleware khác (`immer`, `persist`, `devtools`, `subscribeWithSelector`), và cung cấp pattern enterprise. Chúng ta sẽ phân tích các vấn đề thường gặp, trade-off, best practices, kịch bản bug, và một demo hoàn chỉnh.

---

## 1. Ý Tưởng Chính

Custom middleware trong Zustand là một hàm wrapper quanh store creator, cho phép can thiệp vào `set`, `get`, hoặc API của store. Nó thường được dùng để:

- **Logging:** Ghi lại thay đổi state hoặc action.
- **Analytics:** Gửi event lên server (ví dụ: Firebase, Sentry).
- **Validation:** Kiểm tra state trước khi cập nhật.
- **Side-effects:** Tích hợp với hệ thống bên ngoài (WebSocket, API).

Cú pháp cơ bản:
```ts
const customMiddleware = (config) => (set, get, api) => {
  // Tùy chỉnh logic
  return config(
    (...args) => {
      // Can thiệp vào set
      set(...args);
    },
    get,
    api
  );
};
```

---

## 2. Cú Pháp Tạo Custom Middleware

### 2.1. Middleware Cơ Bản
```ts
import { create } from "zustand";

const loggerMiddleware = (config) => (set, get, api) => {
  return config(
    (...args) => {
      console.log("Before set:", get());
      set(...args);
      console.log("After set:", get());
    },
    get,
    api
  );
};

type CounterState = {
  count: number;
  inc: () => void;
};

export const useCounterStore = create<CounterState>()(
  loggerMiddleware((set) => ({
    count: 0,
    inc: () => set((state) => ({ count: state.count + 1 })),
  }))
);
```

👉 Mỗi lần `set` được gọi, middleware log state trước và sau khi thay đổi.

### 2.2. Kết Hợp Với Middleware Khác
Custom middleware có thể kết hợp với `immer`, `persist`, `devtools`, hoặc `subscribeWithSelector`. Thứ tự quan trọng: custom middleware thường ở ngoài cùng hoặc ngay sau `immer`.

---

## 3. Các Vấn Đề Thường Gặp Và Giải Pháp

### 3.1. Middleware Không Gọi Set
**Vấn đề:** Middleware không forward `set`, làm store không update.

**Nguyên nhân:** Quên gọi `set` trong middleware.

**Giải pháp:** Luôn gọi `set` trong logic.

**Code sai:**
```ts
const brokenMiddleware = (config) => (set, get, api) => config(() => {}, get, api);
```

**Code fix:**
```ts
const fixedMiddleware = (config) => (set, get, api) => config(set, get, api);
```

### 3.2. Hiệu Suất Với State Lớn
**Vấn đề:** Log hoặc xử lý state lớn gây chậm.

**Nguyên nhân:** Middleware chạm vào toàn bộ state.

**Giải pháp:** Chỉ xử lý field cần thiết hoặc dùng selector.

**Code mẫu:**
```ts
const loggerMiddleware = (config) => (set, get, api) => {
  return config(
    (stateUpdate, ...args) => {
      console.log("Updating field:", Object.keys(stateUpdate));
      set(stateUpdate, ...args);
    },
    get,
    api
  );
};
```

### 3.3. Async Middleware Gây Race Condition
**Vấn đề:** Middleware async (như gọi API) không kiểm soát thứ tự.

**Nguyên nhân:** Không dùng AbortController hoặc queue.

**Giải pháp:** Thêm AbortController hoặc debounce.

**Code mẫu:**
```ts
const asyncMiddleware = (config) => (set, get, api) => {
  return config(
    async (stateUpdate, ...args) => {
      const controller = new AbortController();
      try {
        await fetch("/api/log", { signal: controller.signal });
        set(stateUpdate, ...args);
      } catch (e) {
        if (e.name === "AbortError") return;
      }
    },
    get,
    api
  );
};
```

### 3.4. Debug Khó
**Vấn đề:** Custom middleware không log rõ hành động.

**Nguyên nhân:** Không tích hợp devtools.

**Giải pháp:** Kết hợp devtools, đặt tên action.

**Code mẫu:**
```ts
import { devtools } from "zustand/middleware";

const loggerMiddleware = (config) => (set, get, api) => {
  return config(
    (stateUpdate, replace, actionName) => {
      console.log(`Action: ${actionName || "unknown"}`);
      set(stateUpdate, replace, actionName);
    },
    get,
    api
  );
};

create(devtools(loggerMiddleware((set) => ({ /* state */ }))));
```

### 3.5. Middleware Không Tái Sử Dụng Được
**Vấn đề:** Middleware chỉ dùng cho một store cụ thể.

**Nguyên nhân:** Hardcode logic.

**Giải pháp:** Thêm config options.

**Code mẫu:**
```ts
const loggerMiddleware = (options: { prefix: string }) => (config) => (set, get, api) => {
  return config(
    (stateUpdate, ...args) => {
      console.log(`${options.prefix}:`, stateUpdate);
      set(stateUpdate, ...args);
    },
    get,
    api
  );
};
```

---

## 4. Tóm Tắt Các Vấn Đề Và Giải Pháp

| Vấn Đề                    | Nguyên Nhân                          | Giải Pháp                                   |
| ------------------------- | ------------------------------------ | ------------------------------------------- |
| Không gọi set             | Quên forward set                     | Gọi set trong middleware                    |
| Hiệu suất state lớn       | Xử lý toàn state                     | Chỉ xử lý field cần, dùng selector          |
| Async race condition      | Không kiểm soát async                | AbortController hoặc debounce               |
| Debug khó                 | Không tích hợp devtools              | Kết hợp devtools, đặt tên action            |
| Không tái sử dụng         | Hardcode logic                       | Thêm config options                         |

---

## 5. Cheatsheet Custom Middleware

Cấu trúc cơ bản:
```ts
const customMiddleware = (options?: any) => (config) => (set, get, api) => {
  return config(
    (...args) => {
      // Logic trước set
      set(...args);
      // Logic sau set
    },
    get,
    api
  );
};
```

### Parameters
- **config:** Hàm cấu hình store (`(set, get, api) => store`).
- **set:** Hàm cập nhật state.
- **get:** Hàm lấy state hiện tại.
- **api:** API mở rộng của store (subscribe, getState, setState).

### Best Practices
1. **Forward Set/Get:** Luôn gọi set/get trong middleware.
2. **Configurable:** Thêm options để tái sử dụng.
3. **Kết Hợp Middleware:** Đặt custom middleware đúng vị trí (thường sau immer).
4. **Debug-Friendly:** Kết hợp devtools, log rõ ràng.
5. **Async Handling:** Dùng AbortController/debounce cho side-effects.

---

## 6. Các Tình Huống Thực Tế

### 6.1. Logging Middleware
Ghi lại state trước/sau mỗi update.

```ts
const loggerMiddleware = (config) => (set, get, api) => {
  return config(
    (stateUpdate, replace, actionName) => {
      console.log(`Action: ${actionName || "unknown"}`, "Before:", get());
      set(stateUpdate, replace, actionName);
      console.log("After:", get());
    },
    get,
    api
  );
};

type CounterState = {
  count: number;
  inc: () => void;
};

export const useCounterStore = create<CounterState>()(
  loggerMiddleware((set) => ({
    count: 0,
    inc: () => set((state) => ({ count: state.count + 1 }), false, "counter/inc"),
  }))
);
```

### 6.2. Analytics Middleware
Gửi event lên server mỗi khi state thay đổi.

```ts
const analyticsMiddleware = (config) => (set, get, api) => {
  return config(
    async (stateUpdate, replace, actionName) => {
      await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({ event: actionName, state: stateUpdate }),
      });
      set(stateUpdate, replace, actionName);
    },
    get,
    api
  );
};

type CartState = {
  items: { id: number; name: string }[];
  addItem: (name: string) => void;
};

export const useCartStore = create<CartState>()(
  analyticsMiddleware((set) => ({
    items: [],
    addItem: (name) => set(
      (state) => ({ items: [...state.items, { id: Date.now(), name }] }),
      false,
      "cart/addItem"
    ),
  }))
);
```

### 6.3. Validation Middleware
Kiểm tra state trước khi set.

```ts
const validationMiddleware = (config) => (set, get, api) => {
  return config(
    (stateUpdate, replace, actionName) => {
      if (stateUpdate.count && stateUpdate.count < 0) {
        console.error("Invalid state: count cannot be negative");
        return;
      }
      set(stateUpdate, replace, actionName);
    },
    get,
    api
  );
};

type CounterState = {
  count: number;
  inc: () => void;
  dec: () => void;
};

export const useCounterStore = create<CounterState>()(
  validationMiddleware((set) => ({
    count: 0,
    inc: () => set((state) => ({ count: state.count + 1 }), false, "counter/inc"),
    dec: () => set((state) => ({ count: state.count - 1 }), false, "counter/dec"),
  }))
);
```

---

## 7. Kịch Bản Bug Thường Gặp Với Custom Middleware

### 7.1. Không Forward Set
**Vấn đề:** State không update.

**Code sai:**
```ts
const brokenMiddleware = (config) => (set, get, api) => config(() => {}, get, api);
```

**Code fix:**
```ts
const fixedMiddleware = (config) => (set, get, api) => config(set, get, api);
```

### 7.2. Async Race Condition
**Vấn đề:** Gọi API trong middleware gây race.

**Code fix:**
```ts
const asyncMiddleware = (config) => (set, get, api) => {
  let lastRequestId = 0;
  return config(
    async (stateUpdate, ...args) => {
      const requestId = ++lastRequestId;
      await fetch("/api/log");
      if (requestId === lastRequestId) set(stateUpdate, ...args);
    },
    get,
    api
  );
};
```

### 7.3. Debug Khó
**Vấn đề:** Không biết middleware làm gì.

**Code fix:** Kết hợp devtools.

```ts
import { devtools } from "zustand/middleware";

const loggerMiddleware = (config) => (set, get, api) => {
  return config(
    (stateUpdate, replace, actionName) => {
      console.log(`Action: ${actionName}`);
      set(stateUpdate, replace, actionName);
    },
    get,
    api
  );
};

create(devtools(loggerMiddleware((set) => ({ /* state */ }))));
```

### 7.4. Middleware Không Tái Sử Dụng
**Vấn đề:** Logic hardcode cho một store.

**Code fix:** Thêm options.

```ts
const loggerMiddleware = ({ prefix }: { prefix: string }) => (config) => (set, get, api) => {
  return config(
    (stateUpdate, ...args) => {
      console.log(`${prefix}:`, stateUpdate);
      set(stateUpdate, ...args);
    },
    get,
    api
  );
};
```

---

## 8. Trade-Off & Best Practices Của Custom Middleware

### 8.1. Ưu Điểm
1. **Linh Hoạt:** Thêm logic tùy chỉnh (logging, validation, analytics).
2. **Tái Sử Dụng:** Dùng lại trên nhiều store.
3. **Tích Hợp Tốt:** Với immer, persist, devtools, subscribeWithSelector.

### 8.2. Nhược Điểm
1. **Complex Logic:** Dễ viết sai nếu không hiểu set/get/api.
2. **Hiệu Suất:** Middleware nặng có thể chậm.
3. **Debug Khó:** Nếu không log rõ ràng.

### 8.3. Best Practices
1. **Forward Set/Get:** Luôn gọi set/get gốc.
2. **Configurable:** Thêm options để tái sử dụng.
3. **Async Control:** Dùng AbortController/debounce.
4. **Debug-Friendly:** Kết hợp devtools, log action name.
5. **Keep It Light:** Tránh xử lý nặng trong middleware.

---

## 9. Demo: Root Store Với Custom Middleware (Kết Hợp Immer + Persist + Devtools + SubscribeWithSelector)

Dưới đây là demo enterprise-style root store cho **Auth + Cart**, sử dụng custom middleware để logging và analytics, kết hợp các middleware khác.
```ts
import { create } from "zustand";
import { combine, persist, devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type User = { id: number; name: string } | null;
type CartItem = { id: number; name: string; price: number; qty: number };

type RootState = {
  token: string | null;
  user: User;
  items: CartItem[];
  total: number;
  login: (token: string, user: { id: number; name: string }) => void;
  logout: () => void;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
};

// Custom logging middleware
const loggerMiddleware = (config) => (set, get, api) => {
  return config(
    (stateUpdate, replace, actionName) => {
      console.log(`[${actionName || "unknown"}] Before:`, get());
      set(stateUpdate, replace, actionName);
      console.log(`[${actionName || "unknown"}] After:`, get());
    },
    get,
    api
  );
};

// Custom analytics middleware
const analyticsMiddleware = (config) => (set, get, api) => {
  return config(
    async (stateUpdate, replace, actionName) => {
      await fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({ event: actionName, state: stateUpdate }),
      });
      set(stateUpdate, replace, actionName);
    },
    get,
    api
  );
};

export const useStore = create<RootState>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer(
          loggerMiddleware(
            analyticsMiddleware(
              combine(
                {
                  token: null,
                  user: null,
                  items: [],
                  total: 0,
                },
                (set, get) => ({
                  login: (token, user) => set((state) => {
                    state.token = token;
                    state.user = user;
                  }, false, "auth/login"),
                  logout: () => set((state) => {
                    state.token = null;
                    state.user = null;
                    state.items = [];
                    state.total = 0;
                  }, false, "auth/logout"),
                  addItem: (item) => set((state) => {
                    const newItem = { ...item, id: Date.now() };
                    state.items.push(newItem);
                    state.total = state.items.reduce((sum, it) => sum + it.price * it.qty, 0);
                  }, false, "cart/addItem"),
                  removeItem: (id) => set((state) => {
                    state.items = state.items.filter((i) => i.id !== id);
                    state.total = state.items.reduce((sum, it) => sum + it.price * it.qty, 0);
                  }, false, "cart/removeItem"),
                  clearCart: () => set((state) => {
                    state.items = [];
                    state.total = 0;
                  }, false, "cart/clearCart"),
                })
              )
            )
          )
        )
      ),
      {
        name: "root-storage",
        partialize: (state) => ({
          token: state.token,
          user: state.user,
          items: state.items,
        }),
      }
    ),
    { name: "RootStore", enabled: process.env.NODE_ENV === "development" }
  )
);

// Auto-sync analytics outside UI
export const initSubscribers = () => {
  const unsubToken = useStore.subscribe(
    (s) => s.token,
    (token, prevToken) => {
      console.log(`Token changed: ${prevToken} → ${token}`);
    }
  );

  return () => unsubToken();
};
```

**Sử dụng:**
```tsx
import { useStore, initSubscribers } from "./stores/rootStore";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    return initSubscribers();
  }, []);

  const { token, user, items, total, login, logout, addItem, removeItem, clearCart } = useStore();

  return (
    <div>
      <h1>Welcome {user?.name ?? "Guest"}</h1>
      {token ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={() => login("token-123", { id: 1, name: "User" })}>
          Login
        </button>
      )}
      <h2>🛒 Cart</h2>
      <ul>
        {items.map((i) => (
          <li key={i.id}>
            {i.name} x {i.qty} (${i.price})
            <button onClick={() => removeItem(i.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total: ${total}</p>
      <button onClick={() => addItem({ name: "Sofa", price: 1000, qty: 1 })}>
        Add Sofa
      </button>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}
```

**Điểm Mạnh:**
- **Combine:** Tách state (token, user, items, total) và actions rõ ràng.
- **Immer:** Mutate nested state dễ dàng (items.push, total = ...).
- **Persist:** Lưu token, user, items vào localStorage.
- **SubscribeWithSelector:** Auto-sync token changes.
- **Devtools:** Trace actions (auth/login, cart/addItem).
- **Custom Middleware:** Logging và analytics tích hợp.

**Nếu Sai:**
- Không combine: State/action lẫn lộn.
- Không immer: Clone thủ công phức tạp.
- Không persist: Mất state khi reload.
- Không devtools: Khó debug.
- Không custom middleware: Thiếu logging/analytics.

---

## 10. Tổng Kết

Custom middleware mở rộng khả năng của Zustand, cho phép thêm logging, analytics, validation, hoặc side-effects. Kết hợp với combine, immer, persist, devtools, và subscribeWithSelector tạo ra pattern enterprise mạnh mẽ, phù hợp cho project lớn.

**Case thực tế:** Logging, analytics, validation, root store (auth + cart).

---

📌 [<< Ngày 05 F Combine](./Day05-F-Combine.md) | [Ngày 06 >>](./Day06.md)
