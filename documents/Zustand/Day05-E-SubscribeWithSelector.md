# 🚀 Hướng Dẫn Toàn Diện Về SubscribeWithSelector Middleware Trong Zustand

SubscribeWithSelector middleware trong Zustand cho phép theo dõi thay đổi state một cách chọn lọc (fine-grained), thay vì subscribe toàn bộ state, giúp tối ưu performance và tách biệt logic side-effect. Chuyên đề này tập trung vào các trường hợp thực tế, từ auth/session đến các module phức tạp như network status, multi-tab sync, animation, notifications, và analytics. Chúng ta sẽ phân tích các vấn đề thường gặp, nguyên nhân, giải pháp kèm code mẫu, các tùy chọn nâng cao, tình huống thực tế, trade-off, best practices, kịch bản bug, và pattern enterprise-level như kết hợp với persist và devtools. Ngoài ra, tài liệu bổ sung các case phức tạp và một demo hoàn chỉnh.

## 1. Ý Tưởng Chính

SubscribeWithSelector cho phép:
- Theo dõi **một phần state** qua selector.
- Trigger callback chỉ khi giá trị selector thay đổi.
- Hỗ trợ equalityFn để tùy chỉnh so sánh (ví dụ: shallow equal).

Điều này giúp tránh re-render không cần thiết hoặc side-effect thừa, đặc biệt trong app lớn với state phức tạp.

## 2. Cú Pháp Cơ Bản

```ts
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type CounterState = {
  count: number;
  inc: () => void;
};

export const useCounterStore = create<CounterState>()(
  subscribeWithSelector((set) => ({
    count: 0,
    inc: () => set((s) => ({ count: s.count + 1 })),
  }))
);
```

👉 Wrap middleware để store hỗ trợ subscribe chọn lọc.

## 3. Cách Dùng

### 3.1. Subscribe Toàn Bộ (Ít Dùng, Gây Nhiều Re-Render)
```ts
const unsubscribe = useCounterStore.subscribe(console.log);
```
Kết quả: Log toàn bộ state mỗi thay đổi.

### 3.2. Subscribe Theo Selector (Tốt Hơn)
```ts
const unsubscribe = useCounterStore.subscribe(
  (state) => state.count, // Selector chỉ lấy count
  (count, prevCount) => {
    console.log("Count changed:", prevCount, "→", count);
  }
);
```
👉 Chỉ trigger khi `count` thay đổi.

### 3.3. Subscribe Với Điều Kiện (equalityFn)
```ts
const unsubscribe = useCounterStore.subscribe(
  (s) => s.count,
  (count) => console.log("Even count:", count),
  {
    equalityFn: (a, b) => a % 2 === b % 2, // Chỉ trigger khi parity thay đổi
  }
);
```
👉 Tùy chỉnh so sánh để tránh trigger thừa.

## 4. Các Vấn Đề Thường Gặp Và Giải Pháp

Dưới đây là các vấn đề phổ biến khi sử dụng `subscribeWithSelector`, kèm phân tích nguyên nhân và cách khắc phục.

### 4.1. Memory Leak (Quên Unsubscribe)
**Vấn đề:** Listener không được cleanup, dẫn đến leak trong component.

**Nguyên nhân:** Subscribe trong useEffect mà không return unsubscribe.

**Giải pháp:** Luôn return unsubscribe.

**Code mẫu:**
```ts
import { useEffect } from "react";

useEffect(() => {
  const unsub = useCounterStore.subscribe(
    (s) => s.count,
    (count) => console.log(count)
  );
  return unsub;
}, []);
```

### 4.2. Trigger Quá Nhiều Lần
**Vấn đề:** Selector return object/array, so sánh reference luôn khác.

**Nguyên nhân:** So sánh mặc định là strict (===).

**Giải pháp:** Sử dụng equalityFn hoặc shallow from zustand/shallow.

**Code mẫu:**
```ts
import { shallow } from "zustand/shallow";

useCounterStore.subscribe(
  (s) => [s.count, s.value],
  (newVals) => console.log(newVals),
  { equalityFn: shallow }
);
```

### 4.3. Async Race Condition
**Vấn đề:** Callback gọi API, thay đổi nhanh dẫn đến race.

**Nguyên nhân:** Không kiểm soát async flow.

**Giải pháp:** Sử dụng AbortController hoặc reqId.

**Code mẫu:**
```ts
useCounterStore.subscribe(
  (s) => s.count,
  async (count) => {
    const controller = new AbortController();
    try {
      await fetch("/api/log", { signal: controller.signal });
    } catch (e) {
      if (e.name === "AbortError") return;
    }
  }
);
```

### 4.4. Spam External Sync (Ví Dụ: LocalStorage)
**Vấn đề:** Subscribe sync liên tục, gây tốn CPU.

**Nguyên nhân:** Không debounce/throttle.

**Giải pháp:** Wrap callback với debounce/throttle.

**Code mẫu:**
```ts
import { debounce } from "lodash-es";

useCounterStore.subscribe(
  (s) => s.count,
  debounce((count) => localStorage.setItem("count", count.toString()), 500)
);
```

### 4.5. Debug Khó (Nhiều Subscribe)
**Vấn đề:** Khó trace subscribe nào trigger.

**Nguyên nhân:** Subscribe chạy ngầm.

**Giải pháp:** Kèm log dev mode hoặc kết hợp devtools.

**Code mẫu:**
```ts
useCounterStore.subscribe(
  (s) => s.count,
  (count) => {
    if (process.env.NODE_ENV === "development") console.log("Subscribe triggered for count");
    // Logic
  }
);
```

## 5. Tóm Tắt Các Vấn Đề Và Giải Pháp

| Vấn Đề                  | Nguyên Nhân                          | Giải Pháp                                   |
| ----------------------- | ------------------------------------ | ------------------------------------------- |
| Memory leak             | Quên unsubscribe                     | Return unsub trong useEffect                |
| Trigger quá nhiều       | So sánh reference sai                | equalityFn hoặc shallow                     |
| Async race condition    | Async không kiểm soát                | AbortController hoặc reqId                  |
| Spam external sync      | Không debounce                       | Wrap với debounce/throttle                  |
| Debug khó               | Subscribe ngầm                       | Log dev mode + devtools                     |

## 6. Cheatsheet Các Option Của SubscribeWithSelector

Middleware này không có nhiều option như persist/devtools, nhưng subscribe function hỗ trợ:

```ts
store.subscribe(
  selector: (state) => selectedState, // Selector
  callback: (selected, prevSelected) => void, // Callback
  options: {
    equalityFn?: (a, b) => boolean; // Custom so sánh
    fireImmediately?: boolean; // Trigger ngay lập tức
  }
)
```

### Chi Tiết
1. **selector**: Hàm lấy phần state cần theo dõi.
2. **callback**: Chạy khi selected thay đổi, nhận current & prev.
3. **equalityFn**: So sánh custom (mặc định: ===).
4. **fireImmediately**: Trigger callback ngay khi subscribe (default: false).

### Trade-Off Của Các Option

| Option               | Ưu Điểm                  | Nhược Điểm                      | Khi Dùng                                 |
| -------------------- | ------------------------ | ------------------------------- | ---------------------------------------- |
| `selector`           | Tối ưu performance       | Phải viết chính xác             | Theo dõi field cụ thể                    |
| `callback`           | Linh hoạt side-effect    | Có thể gây race nếu async       | Logging, sync external                   |
| `equalityFn`         | Tránh trigger thừa       | Cần implement đúng              | Objects/arrays (shallow/deep)            |
| `fireImmediately`    | Init ngay lập tức        | Có thể trigger thừa lúc đầu     | Init state sync                          |

## 7. Các Tình Huống Thực Tế

### 7.1. Theo Dõi Auth → Redirect
```ts
useEffect(() => {
  const unsub = useAuthStore.subscribe(
    (s) => s.token,
    (token) => {
      if (!token) window.location.href = "/login";
    }
  );
  return unsub;
}, []);
```

### 7.2. Theo Dõi Cart Total → Cập Nhật Badge
```ts
useEffect(() => {
  const unsub = useCartStore.subscribe(
    (s) => s.items.length,
    (len) => {
      document.title = `🛒 Cart (${len})`;
    }
  );
  return unsub;
}, []);
```

### 7.3. Theo Dõi Real-Time Game State
```ts
useGameStore.subscribe(
  (s) => s.hp,
  (hp) => {
    if (hp <= 0) alert("Game Over!");
  }
);
```

## 8. Các Case Phức Tạp Thực Tế

### 8.1. Network Status (Offline/Online)
```ts
type NetworkState = {
  online: boolean;
  setOnline: (online: boolean) => void;
};

export const useNetworkStore = create<NetworkState>()(
  subscribeWithSelector((set) => ({
    online: navigator.onLine,
    setOnline: (online) => set({ online }),
  }))
);

// Listener browser events
window.addEventListener("online", () => useNetworkStore.getState().setOnline(true));
window.addEventListener("offline", () => useNetworkStore.getState().setOnline(false));

// Subscribe
useNetworkStore.subscribe(
  (s) => s.online,
  (online) => console.log(online ? "🟢 Online" : "🔴 Offline")
);
```

### 8.2. Multi-Tab Sync (LocalStorage Sync)
```ts
type SessionState = {
  token: string | null;
  setToken: (t: string | null) => void;
};

export const useSessionStore = create<SessionState>()(
  subscribeWithSelector((set) => ({
    token: null,
    setToken: (t) => set({ token: t }),
  }))
);

// Sync tabs
window.addEventListener("storage", (e) => {
  if (e.key === "token") useSessionStore.getState().setToken(e.newValue);
});

// Subscribe
useSessionStore.subscribe(
  (s) => s.token,
  (token) => {
    if (!token) console.log("🚪 Logged out (multi-tab sync)");
  }
);
```

### 8.3. Animation Frame / FPS State
```ts
type PerfState = {
  fps: number;
  setFps: (fps: number) => void;
};

export const usePerfStore = create<PerfState>()(
  subscribeWithSelector((set) => ({
    fps: 0,
    setFps: (fps) => set({ fps }),
  }))
);

// Measure FPS
let last = performance.now();
let frames = 0;

function loop() {
  frames++;
  const now = performance.now();
  if (now - last >= 1000) {
    usePerfStore.getState().setFps(frames);
    frames = 0;
    last = now;
  }
  requestAnimationFrame(loop);
}
loop();

// Subscribe
usePerfStore.subscribe(
  (s) => s.fps,
  (fps) => {
    if (fps < 30) console.warn("⚠️ Low FPS:", fps);
  }
);
```

### 8.4. Notifications / Toast Manager
```ts
type Toast = { id: number; message: string };
type ToastState = {
  toasts: Toast[];
  addToast: (msg: string) => void;
  removeToast: (id: number) => void;
};

export const useToastStore = create<ToastState>()(
  subscribeWithSelector((set) => ({
    toasts: [],
    addToast: (msg) => set((s) => ({ toasts: [...s.toasts, { id: Date.now(), message: msg }] })),
    removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  }))
);

// Subscribe auto-dismiss
useToastStore.subscribe(
  (s) => s.toasts,
  (toasts) => {
    const latest = toasts[toasts.length - 1];
    if (latest) {
      setTimeout(() => useToastStore.getState().removeToast(latest.id), 3000);
    }
  }
);
```

### 8.5. Analytics / Logging
```ts
type AnalyticsState = {
  clicks: number;
  addClick: () => void;
};

export const useAnalyticsStore = create<AnalyticsState>()(
  subscribeWithSelector((set) => ({
    clicks: 0,
    addClick: () => set((s) => ({ clicks: s.clicks + 1 })),
  }))
);

// Subscribe log
useAnalyticsStore.subscribe(
  (s) => s.clicks,
  (val, prev) => {
    console.log(`User clicks: ${prev} → ${val}`);
    fetch("/api/log", { method: "POST", body: JSON.stringify({ event: "click", count: val }) });
  }
);
```

## 9. Trade-Off & Best Practices Của SubscribeWithSelector

### 9.1. Ưu Điểm
1. **Fine-Grained Reactivity:** Chỉ trigger khi phần state thay đổi, tối ưu performance.
2. **Tách Biệt Logic & UI:** Subscribe cho side-effect ngoài React tree (logging, sync).
3. **Prev & Next Values:** Dễ check diff, sync external systems.

### 9.2. Nhược Điểm / Pitfalls
1. **Memory Leak:** Quên unsubscribe.
2. **Over-Subscribe:** Quá nhiều listener tốn CPU.
3. **Async Race Condition:** API calls race khi thay đổi nhanh.
4. **External Sync Spam:** Ghi liên tục (localStorage, API).
5. **Debug Khó:** Listener ngầm khó trace.

### 9.3. Best Practices
1. **Luôn Cleanup:** Return unsubscribe trong useEffect.
2. **Narrow Selector:** Chỉ theo dõi field cần thiết.
3. **Tách Side-Effect:** Không lẫn với UI render.
4. **Kết Hợp Middleware:** Với persist (auto-save), devtools (trace).
5. **Debounce/Throttle:** Cho sync external.

### 9.4. Ví Dụ Bug & Fix
**Bug: Toast Spam**
```ts
useToastStore.subscribe(
  (s) => s.toasts,
  (toasts) => fetch("/api/log", { body: JSON.stringify(toasts) })
);
```
**Fix: Debounce**
```ts
import { debounce } from "lodash-es";

useToastStore.subscribe(
  (s) => s.toasts,
  debounce((toasts) => fetch("/api/log", { body: JSON.stringify(toasts) }), 500)
);
```

## 10. Demo: User Preferences Store (Kết Hợp Persist + SubscribeWithSelector + Devtools)

```ts
import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";

type PreferencesState = {
  theme: "light" | "dark";
  language: "en" | "vi";
  setTheme: (theme: "light" | "dark") => void;
  setLanguage: (lang: "en" | "vi") => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  devtools(
    persist(
      subscribeWithSelector((set) => ({
        theme: "light",
        language: "en",
        setTheme: (theme) => set({ theme }, false, "preferences/setTheme"),
        setLanguage: (language) => set({ language }, false, "preferences/setLanguage"),
      })),
      {
        name: "preferences-storage",
        partialize: (state) => ({ theme: state.theme, language: state.language }),
      }
    ),
    { name: "PreferencesStore", enabled: process.env.NODE_ENV === "development" }
  )
);
```

### Tích Hợp Subscribe Auto-Sync
```ts
// setupPreferences.ts
import { usePreferencesStore } from "./stores/preferences";

export const initPreferencesSubscribers = () => {
  const unsubTheme = usePreferencesStore.subscribe(
    (s) => s.theme,
    (theme, prevTheme) => {
      console.log(`Theme changed: ${prevTheme} → ${theme}`);
      fetch("/api/analytics", { method: "POST", body: JSON.stringify({ event: "theme_change", value: theme }) });
    }
  );

  const unsubLang = usePreferencesStore.subscribe(
    (s) => s.language,
    (lang) => console.log("Language updated:", lang)
  );

  return () => {
    unsubTheme();
    unsubLang();
  };
};
```
👉 Gọi `initPreferencesSubscribers()` ở App root.

**Điểm Mạnh:** Persist giữ state, subscribe xử lý side-effect, devtools debug.

**Nếu Không Làm Đúng:** Mất state reload, logic sync lẫn UI, khó debug.

## 11. Tổng Kết

`SubscribeWithSelector` tối ưu cho side-effect và performance, nhưng cần cẩn thận leak/spam/debug. Kết hợp với persist/devtools tạo pattern enterprise mạnh mẽ. Nếu bạn muốn repo demo GitHub hoặc middleware tiếp theo (ví dụ: immer), cho mình biết! 😊
---

📌 [<< Ngày 05 D Immer](./Day05-D-Immer.md) | [Ngày 05 F - Combine >>](./Day05-F-Combine.md)
