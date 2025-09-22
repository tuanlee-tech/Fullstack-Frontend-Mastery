# 🚀 Hướng Dẫn Toàn Diện Về Devtools Middleware Trong Zustand

Devtools middleware trong Zustand tích hợp với Redux DevTools Extension để theo dõi thay đổi state, time-travel debugging, và trace actions mà không cần Redux. Tài liệu này tập trung vào các trường hợp thực tế, từ auth/session đến các module như cart, UI, feature flag, socket, form, và large data. Chúng ta sẽ phân tích các vấn đề thường gặp, nguyên nhân, giải pháp kèm code mẫu, các tùy chọn nâng cao, tình huống thực tế, so sánh với các công cụ khác, và các pattern enterprise-level như conditional logging và custom trace. Ngoài ra, tài liệu bổ sung các kịch bản bug thực tế trong nhiều module khác nhau và cung cấp template code chuẩn với comment giải thích trade-off.

---

## 1. Các Vấn Đề Thường Gặp Và Giải Pháp

Dưới đây là các vấn đề phổ biến khi sử dụng `devtools` trong môi trường phát triển, kèm phân tích nguyên nhân và cách khắc phục.

### 1.1. Không Thấy Store Trong DevTools
**Vấn đề:** Store không xuất hiện trong Redux DevTools Extension.

**Nguyên nhân:** Middleware `devtools` không được wrap đúng hoặc extension chưa cài/enabled.

**Giải pháp:** Wrap store với `devtools` và bật `enabled: true`. Đảm bảo Redux DevTools Extension được cài đặt.

**Code mẫu:**
```ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type CounterState = {
  count: number;
  inc: () => void;
  dec: () => void;
};

export const useCounterStore = create<CounterState>()(
  devtools(
    (set) => ({
      count: 0,
      inc: () => set((s) => ({ count: s.count + 1 }), false, "counter/inc"),
      dec: () => set((s) => ({ count: s.count - 1 }), false, "counter/dec"),
    }),
    { name: "CounterStore", enabled: true }
  )
);
```

👉 **Kiểm tra:** Mở DevTools > Redux tab, store sẽ hiển thị với tên "CounterStore".

### 1.2. Action Names Không Rõ Ràng
**Vấn đề:** Actions hiển thị dưới dạng "setState" hoặc anonymous, khó debug.

**Nguyên nhân:** Zustand không tự động đặt tên action.

**Giải pháp:** Truyền tên action vào `set` hoặc sử dụng `anonymousActionType`.

**Code mẫu:**
```ts
devtools(
  (set) => ({
    count: 0,
    inc: () => set((s) => ({ count: s.count + 1 }), false, "counter/inc"),
  }),
  { name: "CounterStore", anonymousActionType: "unknown" }
);
```

### 1.3. Performance Issues Trong Production
**Vấn đề:** Devtools làm chậm app ở production do logging và tracing.

**Nguyên nhân:** Devtools luôn enabled, gây overhead.

**Giải pháp:** Sử dụng conditional wrap dựa trên môi trường.

**Code mẫu:**
```ts
const useCounterStore = create<CounterState>()(
  devtools(
    (set) => ({ /* state */ }),
    { enabled: process.env.NODE_ENV === "development" }
  )
);
```

### 1.4. Không Trace Được Stacktrace
**Vấn đề:** Không thấy nguồn gốc action (file/line) trong DevTools.

**Nguyên nhân:** Trace không được bật.

**Giải pháp:** Bật `trace: true` hoặc custom trace function.

**Code mẫu:**
```ts
devtools(
  (set) => ({ /* state */ }),
  { name: "CounterStore", trace: true }
);
```

### 1.5. Tích Hợp Với Middleware Khác Sai Thứ Tự
**Vấn đề:** State không đúng khi kết hợp với immer/persist (ví dụ: state mutable không log đúng).

**Nguyên nhân:** Thứ tự middleware sai (devtools nên ở ngoài cùng).

**Giải pháp:** Wrap devtools ngoài cùng.

**Code mẫu:**
```ts
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

create(
  devtools(
    persist(
      immer((set) => ({ /* state */ })),
      { name: "store" }
    ),
    { name: "Store" }
  )
);
```

### 1.6. Không Custom Được Store Name Hoặc Serialize
**Vấn đề:** Nhiều store trùng tên hoặc state lớn gây lag DevTools.

**Nguyên nhân:** Sử dụng option mặc định.

**Giải pháp:** Custom `name` và `serialize` để tối ưu.

**Code mẫu:**
```ts
devtools(
  (set) => ({ /* state */ }),
  {
    name: "AppStore-v1",
    serialize: { options: { date: false } }, // Loại bỏ Date objects
  }
);
```

### 1.7. Không Hỗ Trợ Auto Pause Recording
**Vấn đề:** DevTools ghi mọi action, gây đầy log.

**Nguyên nhân:** Không bật autoPause.

**Giải pháp:** Sử dụng `autoPause: true`.

**Code mẫu:**
```ts
devtools(
  (set) => ({ /* state */ }),
  { name: "AppStore", autoPause: true }
);
```

---

## 2. Tóm Tắt Các Vấn Đề Và Giải Pháp

| Vấn Đề                    | Nguyên Nhân                          | Giải Pháp                                   |
| ------------------------- | ------------------------------------ | ------------------------------------------- |
| Không thấy store          | Không wrap/enabled                   | Wrap với `devtools` + `enabled: true`       |
| Action names không rõ     | Anonymous actions                    | Truyền tên vào `set` + `anonymousActionType`|
| Performance ở production  | Luôn enabled                         | Conditional `enabled` dựa env               |
| Không trace stack         | Trace off                            | `trace: true` hoặc custom function          |
| Thứ tự middleware sai     | Devtools không cuối cùng             | Wrap devtools ngoài cùng                    |
| Store name/serialize      | Mặc định                             | Custom `name` + `serialize`                 |
| Auto pause recording      | Không config                         | `autoPause: true`                           |

---

## 3. Cheatsheet Các Option Của Devtools

Dưới đây là bảng tóm tắt các option chính của `devtools`, dành cho developer senior cần tra cứu nhanh.

```ts
devtools(
  (set, get) => ({ /* state & actions */ }),
  {
    name: "store-name",                // Tên store trong DevTools
    enabled: true,                     // Enable/Disable middleware
    store: "custom-store",             // Custom store key nếu cần
    trace: true,                       // Bật trace stacktrace
    traceLimit: 25,                    // Giới hạn stack depth
    autoPause: true,                   // Pause khi tab không focus
    anonymousActionType: "unknown",    // Tên cho anonymous actions
    serialize: { options: {} },        // Custom serialize (JSON)
    log: console.log,                  // Custom logger
  }
)
```

### Chi Tiết Mỗi Option
1. **name**: Tên store trong DevTools. Best practice: Prefix theo module (ví dụ: "auth-store").
2. **enabled**: Bật/tắt middleware. Dùng cho conditional dev/prod.
3. **store**: Custom key nếu nhiều instance.
4. **trace**: Bật trace (boolean) hoặc function custom trace.
5. **traceLimit**: Giới hạn độ sâu stacktrace.
6. **autoPause**: Pause recording khi tab không focus.
7. **anonymousActionType**: Tên mặc định cho actions không tên.
8. **serialize**: Custom serializer cho state phức tạp (dates, symbols).
9. **log**: Custom logger thay vì console.

### Trade-Off Của Các Option

| Option                  | Ưu Điểm                  | Nhược Điểm                      | Khi Dùng                                 |
| ----------------------- | ------------------------ | ------------------------------- | ---------------------------------------- |
| `name`                  | Dễ phân biệt store       | Không ảnh hưởng nếu không set   | Multi-store apps                         |
| `enabled`               | Tiết kiệm perf ở prod    | Phải conditional code           | Production builds                        |
| `store`                 | Custom key               | Hiếm dùng                       | Advanced setups                          |
| `trace`                 | Debug sâu nguồn gốc      | Overhead perf nếu luôn on       | Complex actions                          |
| `traceLimit`            | Giới hạn stack           | Có thể cắt mất info sâu         | Deep call stacks                         |
| `autoPause`             | Giảm log thừa            | Có thể miss actions             | Long-running sessions                    |
| `anonymousActionType`   | Actions rõ ràng          | Không fix nếu quên tên          | Quick prototyping                        |
| `serialize`             | Handle state phức tạp    | Thêm complexity                 | Non-JSON state                           |
| `log`                   | Custom output            | Phải implement logger           | Integrate với monitoring                 |

---

## 4. Các Tình Huống Thực Tế Với Devtools

Dưới đây là các case thực tế khi dùng `devtools` cho debugging, từ auth đến các module khác, kèm vấn đề và fix nâng cao.

### 4.1. Debug Auth (Token, User Info)
**Vấn đề:** Log token nhạy cảm hoặc actions không rõ.

**Giải pháp:** Mask token, đặt tên action rõ ràng.

**Code mẫu:**
```ts
type AuthState = {
  token: string | null;
  login: (token: string) => void;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      token: null,
      login: (token) => set({ token: btoa(token) }, false, "auth/login"),
    }),
    { name: "AuthStore", enabled: process.env.NODE_ENV === "development" }
  )
);
```

### 4.2. Debug Cart Flow (E-commerce)
**Vấn đề:** Mất state phụ (discount, voucher) khi replace.

**Giải pháp:** Merge partial, đặt tên action rõ.

**Code mẫu:**
```ts
type CartItem = { id: number; name: string; price: number };
type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  devtools(
    (set) => ({
      items: [],
      addItem: (item) => set((s) => ({ items: [...s.items, item] }), false, "cart/addItem"),
      clear: () => set({ items: [] }, false, "cart/clear"),
    }),
    { name: "CartStore" }
  )
);
```

### 4.3. Debug API Loading State
**Vấn đề:** Async actions gây khó theo dõi.

**Giải pháp:** Tách state thành loading/success/error.

**Code mẫu:**
```ts
type UserState = {
  users: string[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
};

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      users: [],
      loading: false,
      fetchUsers: async () => {
        set({ loading: true }, false, "users/fetch/start");
        const data = await fetch("https://jsonplaceholder.typicode.com/users").then((res) => res.json());
        set({ users: data, loading: false }, false, "users/fetch/success");
      },
    }),
    { name: "UserStore" }
  )
);
```

### 4.4. Debug Theme Toggle
**Vấn đề:** Toggle spam log "setState".

**Giải pháp:** Đặt tên action rõ ràng.

**Code mẫu:**
```ts
type ThemeState = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>()(
  devtools(
    (set) => ({
      isDarkMode: false,
      toggleTheme: () => set((s) => ({ isDarkMode: !s.isDarkMode }), false, "theme/toggle"),
    }),
    { name: "ThemeStore" }
  )
);
```

### 4.5. Debug Multi-Tab Collaboration State
**Vấn đề:** State sync giữa tabs không log rõ.

**Giải pháp:** Sử dụng `storageEvents` (kết hợp persist) và action names.

**Code mẫu:**
```ts
import { persist } from "zustand/middleware";

type CollabState = {
  doc: string;
  updateDoc: (content: string) => void;
};

export const useCollabStore = create<CollabState>()(
  devtools(
    persist(
      (set) => ({
        doc: "",
        updateDoc: (content) => set({ doc: content }, false, "collab/updateDoc"),
      }),
      { name: "collab-storage", storageEvents: true }
    ),
    { name: "CollabStore" }
  )
);
```

### 4.6. Debug Real-Time Chat Messages
**Vấn đề:** Log large array gây lag.

**Giải pháp:** Log metadata (length, latest message).

**Code mẫu:**
```ts
type ChatState = {
  messages: { id: number; text: string }[];
  addMessage: (msg: { id: number; text: string }) => void;
};

export const useChatStore = create<ChatState>()(
  devtools(
    (set) => ({
      messages: [],
      addMessage: (msg) =>
        set(
          (s) => ({ messages: [...s.messages, msg] }),
          false,
          `chat/addMessage (len=${s.messages.length + 1})`
        ),
    }),
    { name: "ChatStore" }
  )
);
```

---

## 5. Kịch Bản Bug Thường Gặp Với Devtools

Dưới đây là các kịch bản dễ gặp bug khi dùng `devtools`, từ auth đến các module khác, kèm cách fix.

### 5.1. Quên Đặt Tên Action
**Vấn đề:** Actions hiển thị "setState", khó debug.

**Code sai:**
```ts
set((s) => ({ count: s.count + 1 }));
```

**Code fix:**
```ts
set((s) => ({ count: s.count + 1 }), false, "counter/inc");
```

### 5.2. Replace Toàn Bộ State Mà Quên Merge
**Vấn đề:** `replace: true` làm mất các key khác.

**Code sai:**
```ts
set({ count: 10 }, true, "reset");
```

**Code fix:**
```ts
set({ count: 10 }, false, "updateCount");
// Hoặc reset đầy đủ
set({ count: 0, user: null, theme: "light" }, true, "reset");
```

### 5.3. Log Thông Tin Nhạy Cảm (Token, Password)
**Vấn đề:** Token/password lộ trong log.

**Code fix:**
```ts
devtools(
  (set) => ({
    token: null,
    setToken: (t: string) => set({ token: btoa(t) }, false, "auth/setToken"),
  }),
  { name: "AuthStore", enabled: process.env.NODE_ENV === "development" }
);
```

### 5.4. Quên Disable DevTools Trên Production
**Vấn đề:** Client thấy state qua DevTools.

**Code fix:**
```ts
devtools(
  (set) => ({ /* state */ }),
  { name: "AppStore", enabled: process.env.NODE_ENV === "development" }
);
```

### 5.5. State Bị Replay Sai Khi Undo/Redo
**Vấn đề:** Async actions chạy lại khi time-travel, gây spam.

**Code fix:**
```ts
set({ loading: true }, false, "fetch/start");
set({ data: result, loading: false }, false, "fetch/success");
```

### 5.6. Cart Store – Mất Item Khi Replace Sai
**Vấn đề:** `replace: true` làm mất discount/voucher.

**Code fix:**
```ts
set((s) => ({ items: [...s.items, item] }), false, "cart/addItem");
```

### 5.7. UI Store – Log Spam Khi Toggle
**Vấn đề:** Spam "setState" khi toggle UI.

**Code fix:**
```ts
set((s) => ({ isSidebarOpen: !s.isSidebarOpen }), false, "ui/toggleSidebar");
```

### 5.8. Feature Flag – Leak Config Nhạy Cảm
**Vấn đề:** Log flag chưa release.

**Code fix:**
```ts
devtools(
  (set) => ({
    flags: {},
    setFlags: (flags) => set({ flags }, false, "feature/setFlags"),
  }),
  { name: "FeatureStore", enabled: process.env.NODE_ENV === "development" }
);
```

### 5.9. Socket/Realtime Store – Replay Gây Reconnect
**Vấn đề:** Replay chạy lại connect/disconnect.

**Code fix:**
```ts
set({ connected: true }, false, "socket/setConnected");
useEffect(() => {
  // Handle WebSocket outside store
}, [useSocketStore((s) => s.connected)]);
```

### 5.10. Form Store – Log Dữ Liệu Nhạy Cảm
**Vấn đề:** Leak email/password.

**Code fix:**
```ts
set({ password: "***" }, false, "form/setPassword");
```

### 5.11. Large Array – DevTools Lag
**Vấn đề:** Log 5k messages gây freeze.

**Code fix:**
```ts
set((s) => ({ messages: [...s.messages, msg] }), false, `chat/addMessage (len=${s.messages.length + 1})`);
```

---

## 6. Code Template Chuẩn Cho Từng Module

Dưới đây là các template code chuẩn cho từng module, có comment giải thích trade-off.

### 6.1. Auth Store
```ts
type AuthState = {
  token: string | null;
  user: { id: string; name: string } | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      token: null,
      user: null,
      login: async (username, password) => {
        set({ loading: true }, false, "auth/login/start");
        try {
          const res = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
          });
          const data = await res.json();
          set({ token: btoa(data.token), user: data.user }, false, "auth/login/success");
        } catch (e) {
          set({ error: e.message }, false, "auth/login/error");
        }
      },
      logout: () => set({ token: null, user: null }, false, "auth/logout"),
    }),
    {
      name: "AuthStore",
      enabled: process.env.NODE_ENV === "development", // Không leak ở prod
      trace: true, // Debug sâu
      autoPause: true, // Giảm log thừa
    }
  )
);
```
**Trade-off:** Mask token, conditional devtools, tách async logic.

### 6.2. Cart Store
```ts
type CartItem = { id: number; name: string; price: number };
type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  devtools(
    (set) => ({
      items: [],
      addItem: (item) => set((s) => ({ items: [...s.items, item] }), false, "cart/addItem"),
      clear: () => set({ items: [] }, false, "cart/clear"),
    }),
    { name: "CartStore", enabled: process.env.NODE_ENV === "development" }
  )
);
```
**Trade-off:** Merge partial tránh mất state, conditional devtools.

### 6.3. UI Store
```ts
type UIState = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      isSidebarOpen: false,
      toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen }), false, "ui/toggleSidebar"),
    }),
    { name: "UIStore", enabled: process.env.NODE_ENV === "development" }
  )
);
```
**Trade-off:** Action name rõ, giảm spam log.

### 6.4. Feature Flag Store
```ts
type FeatureState = {
  flags: Record<string, boolean>;
  setFlags: (flags: Record<string, boolean>) => void;
};

export const useFeatureStore = create<FeatureState>()(
  devtools(
    (set) => ({
      flags: {},
      setFlags: (flags) => set({ flags }, false, "feature/setFlags"),
    }),
    { name: "FeatureStore", enabled: process.env.NODE_ENV === "development" }
  )
);
```
**Trade-off:** Conditional devtools tránh leak flag.

### 6.5. Socket Store
```ts
type SocketState = {
  connected: boolean;
  setConnected: (status: boolean) => void;
};

export const useSocketStore = create<SocketState>()(
  devtools(
    (set) => ({
      connected: false,
      setConnected: (status) => set({ connected: status }, false, "socket/setConnected"),
    }),
    { name: "SocketStore", enabled: process.env.NODE_ENV === "development" }
  )
);

// Side-effect ngoài store
useEffect(() => {
  const { connected } = useSocketStore.getState();
  if (connected) {
    // WebSocket connect
  } else {
    // WebSocket disconnect
  }
}, [useSocketStore((s) => s.connected)]);
```
**Trade-off:** Tách side-effect, tránh replay spam.

### 6.6. Form Store
```ts
type FormState = {
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
};

export const useFormStore = create<FormState>()(
  devtools(
    (set) => ({
      email: "",
      password: "",
      setEmail: (v) => set({ email: v }, false, "form/setEmail"),
      setPassword: (v) => set({ password: "***" }, false, "form/setPassword"),
    }),
    { name: "FormStore", enabled: process.env.NODE_ENV === "development" }
  )
);
```
**Trade-off:** Mask sensitive data, conditional devtools.

### 6.7. Chat Store
```ts
type ChatMessage = { id: number; text: string };
type ChatState = {
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
};

export const useChatStore = create<ChatState>()(
  devtools(
    (set) => ({
      messages: [],
      addMessage: (msg) =>
        set(
          (s) => ({ messages: [...s.messages, msg] }),
          false,
          `chat/addMessage (len=${s.messages.length + 1})`
        ),
    }),
    { name: "ChatStore", enabled: process.env.NODE_ENV === "development" }
  )
);
```
**Trade-off:** Log metadata, tránh lag.

---

## 7. So Sánh Devtools Với Không Dùng Hoặc Zukeeper

### Không Dùng Devtools
**Ưu điểm:** Nhẹ, không overhead.
**Nhược điểm:** Không time travel, trace, visualize state changes.

### Zukeeper (Công Cụ Thay Thế)
**Ưu điểm:** Dành riêng cho Zustand, UI tốt hơn cho bear stores.
**Nhược điểm:** Không tích hợp Redux DevTools, ít features standard.

**Trade-Off:**

| Tiêu Chí            | Zustand Devtools     | Không Dùng           | Zukeeper             |
| ------------------- | -------------------- | -------------------- | -------------------- |
| Dễ integrate        | ✅ (middleware)       | ✅ (không cần)        | ❌ (riêng tool)       |
| Time travel         | ✅                    | ❌                    | ✅                    |
| Trace stack         | ✅                    | ❌                    | ❌                    |
| Perf overhead       | Trung bình           | Thấp                 | Trung bình           |
| UI/Visualize        | ✅ (Redux Extension)  | ❌                    | ✅ (custom)           |
| Enterprise adoption | ✅ (Redux standard)   | ❌                    | ❌ (niche)            |

**Kết Luận:** Devtools cho teams quen Redux; Zukeeper cho pure Zustand; Không dùng cho simple apps.

---

## 8. Pattern Nâng Cao: Conditional Devtools Với Logging

Pattern chuẩn enterprise: Enable devtools chỉ ở dev, tích hợp logging chi tiết.

**Code Mẫu Custom Trace:**
```ts
devtools(
  (set) => ({ /* state */ }),
  {
    name: "AppStore",
    enabled: process.env.NODE_ENV === "development",
    trace: (action) => {
      console.group(`Trace: ${action.type}`);
      console.trace();
      console.groupEnd();
      return "custom-trace";
    },
  }
);
```

**Trade-off:** Logging chi tiết nhưng tăng overhead, chỉ dùng ở dev.

---

## 9. Case Study End-To-End: Debug Flow

**Mô tả:** Minh họa flow debug auth:
- Login → trace action (`auth/login/start`, `auth/login/success`).
- Time travel undo logout → kiểm tra state.
- Inspect state trong DevTools.

**Code mẫu:**
```ts
type AuthState = {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      token: null,
      login: async (username, password) => {
        set({ token: null }, false, "auth/login/start");
        const res = await fetch("/api/login", {
          method: "POST",
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        set({ token: data.token }, false, "auth/login/success");
      },
    }),
    { name: "AuthStore", trace: true, autoPause: true }
  )
);
```

---

## 10. Test Kịch Bản Mô Phỏng

Sử dụng Jest để mock console/trace, kiểm tra action names.

**Code mẫu:**
```ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

describe("Devtools action logging", () => {
  const consoleSpy = jest.spyOn(console, "log").mockImplementation();

  const useStore = create(
    devtools(
      (set) => ({
        count: 0,
        inc: () => set((s) => ({ count: s.count + 1 }), false, "counter/inc"),
      }),
      { name: "TestStore" }
    )
  );

  test("should log action name", () => {
    useStore.getState().inc();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("counter/inc"));
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });
});
```

---

## 11. Tổng Kết

`Devtools` là công cụ mạnh mẽ để debug Zustand, nhưng dễ gặp vấn đề nếu không cấu hình đúng:
- **Auth:** Leak token, actions không rõ.
- **Cart:** Mất state khi replace.
- **UI:** Spam log.
- **Feature Flag:** Leak config nhạy cảm.
- **Socket:** Replay gây reconnect.
- **Form:** Leak dữ liệu nhạy cảm.
- **Chat:** Lag do large array.

**Best Practice Enterprise:**
1. Luôn đặt tên action rõ ràng (domain/action).
2. Chỉ bật devtools ở development.
3. Mask dữ liệu nhạy cảm.
4. Tách side-effect (API, WebSocket) khỏi store.
5. Log metadata thay vì full state cho large data.


---

📌 [<< Ngày 05 B - Persist](./Day05-B-Persist.md) | [Ngày 05 D - Immer >>](./Day05-C-Immer.md)
