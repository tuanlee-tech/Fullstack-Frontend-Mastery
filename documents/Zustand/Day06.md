# 📘 Day 6 – Devtools & Debugging + Tối ưu Re-render nâng cao

## 🎯 Mục tiêu học

* Hiểu cách tích hợp **Redux DevTools** để debug state.
* Biết cách **theo dõi action, state history** trong DevTools.
* Sử dụng **subscribeWithSelector** để lắng nghe thay đổi có chọn lọc.
* Tránh re-render không cần thiết bằng selector & shallow comparison.
* Biết pattern thường dùng trong công ty lớn khi tối ưu performance.

---

## 📝 Tóm tắt ngắn (TL;DR)

Zustand bản chất rất gọn nhẹ, nhưng nếu dùng sai sẽ bị **re-render thừa** hoặc khó debug khi team scale.
Ngày hôm nay bạn học cách:

* Thêm `devtools` middleware để dễ theo dõi.
* Sử dụng `subscribeWithSelector` & `shallow` để **giảm số lần render**.
* So sánh các kỹ thuật và biết **nên dùng khi nào** trong dự án enterprise.

---

## 📚 Lý thuyết chi tiết

### 1. Redux DevTools với Zustand

* Middleware `devtools` cho phép xem log state, actions trong [Redux DevTools extension](https://github.com/reduxjs/redux-devtools).
* Debug cực hữu ích khi:

  * Review code team.
  * Check lại history state khi test bug.

Cú pháp cơ bản:

```ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface CounterState {
  count: number
  inc: () => void
}

export const useCounterStore = create<CounterState>()(
  devtools((set) => ({
    count: 0,
    inc: () => set((state) => ({ count: state.count + 1 }), false, 'counter/inc'),
  }))
)
```

> Lưu ý: tham số thứ 3 `'counter/inc'` giúp DevTools log rõ ràng action name.

---

### 2. subscribeWithSelector

Cho phép **subscribe có chọn lọc**, thay vì toàn bộ store.
Ví dụ log ra khi **cart length thay đổi**:

```ts
useCartStore.subscribe(
  (state) => state.items.length, // selector
  (length) => {
    console.log(`Cart length: ${length}`)
  }
)
```

Ứng dụng:

* Chỉ theo dõi **loading state** của API.
* Chỉ lắng nghe **auth token** để refresh session.

---

### 3. shallow comparison để giảm render

Zustand có sẵn util `shallow` để so sánh object.

```ts
import shallow from 'zustand/shallow'

const { name, age } = useUserStore(
  (s) => ({ name: s.name, age: s.age }),
  shallow
)
```

Nếu không có `shallow`, mỗi lần state update → object mới → re-render thừa.
`shallow` giúp React chỉ re-render khi **name hoặc age thực sự đổi**.

---

## 💻 Ví dụ thực tế: Notification Store

```ts
import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import shallow from 'zustand/shallow'

interface Notification {
  id: string
  message: string
  type: 'info' | 'error'
}

interface NotificationState {
  list: Notification[]
  add: (msg: string, type?: 'info' | 'error') => void
  remove: (id: string) => void
}

export const useNotificationStore = create<NotificationState>()(
  subscribeWithSelector(
    devtools((set) => ({
      list: [],
      add: (msg, type = 'info') =>
        set(
          (state) => ({
            list: [...state.list, { id: Date.now().toString(), message: msg, type }],
          }),
          false,
          'notification/add'
        ),
      remove: (id) =>
        set(
          (state) => ({
            list: state.list.filter((n) => n.id !== id),
          }),
          false,
          'notification/remove'
        ),
    }))
  )
)
```

Sử dụng trong component:

```tsx
const NotificationList = () => {
  // Dùng shallow để tránh re-render toàn bộ khi list không đổi
  const list = useNotificationStore((s) => s.list, shallow)

  return (
    <ul>
      {list.map((n) => (
        <li key={n.id} style={{ color: n.type === 'error' ? 'red' : 'blue' }}>
          {n.message}
        </li>
      ))}
    </ul>
  )
}
```

---

## ⚠️ Common pitfalls

* **Quên shallow** khi select nhiều field → dễ re-render thừa.
* **Dùng devtools ở production** → log action nhạy cảm (chỉ nên bật trong development).
* **Lạm dụng subscribe** → dễ tạo side-effect khó debug.

---

## ✅ Bài tập

### Level 1

Tạo một **loadingStore** có boolean `isLoading`.

* Dùng DevTools log khi bật/tắt loading.

### Level 2

Tạo **authStore** với `token`.

* Dùng `subscribeWithSelector` để log khi token thay đổi.

### Level 3 (Enterprise case)

Tạo **userPreferencesStore** với object `{ theme, language, showSidebar }`.

* Sử dụng selector + shallow để tránh re-render thừa.
* Log ra DevTools khi đổi theme.

---

## 🏢 Trong công ty lớn

* **DevTools**: review state/action dễ hơn trong code review.
* **shallow + selector**: scale dashboard lớn, hạn chế re-render.
* **subscribeWithSelector**: xử lý side effect (ví dụ refresh token) mà không ảnh hưởng toàn app.

---

# 🧩 Code Challenge – Enterprise Logging & Metrics với Zustand

## 📌 Bài toán

Bạn được yêu cầu xây dựng một hệ thống **logging + metrics** cho app SaaS:

1. Có một `metricsStore` quản lý:

   * `actionCount`: số lần action được gọi.
   * `lastAction`: tên action cuối cùng.
   * `errors`: số lỗi đã ghi nhận.

2. Mỗi khi một store khác (ví dụ `authStore`, `cartStore`, `notificationStore`) chạy action → phải cập nhật `metricsStore`.

3. Log ra **Redux DevTools** để dễ theo dõi.

4. Chỉ re-render component `MetricsDashboard` khi **actionCount hoặc errors thay đổi**, không bị ảnh hưởng bởi field khác.

👉 Đây chính là cách **công ty lớn theo dõi health state** khi debug production.

---

## ✅ Solution (Best Practices)

### 1. metricsStore.ts

```ts
import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

interface MetricsState {
  actionCount: number
  lastAction: string | null
  errors: number
  logAction: (action: string) => void
  logError: (error?: string) => void
}

export const useMetricsStore = create<MetricsState>()(
  subscribeWithSelector(
    devtools((set) => ({
      actionCount: 0,
      lastAction: null,
      errors: 0,
      logAction: (action) =>
        set(
          (state) => ({
            actionCount: state.actionCount + 1,
            lastAction: action,
          }),
          false,
          `metrics/logAction/${action}`
        ),
      logError: (error) =>
        set(
          (state) => ({ errors: state.errors + 1 }),
          false,
          error ? `metrics/logError/${error}` : 'metrics/logError'
        ),
    }))
  )
)

```

---

### 2. authStore.ts (ví dụ store khác tích hợp logging)

```ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useMetricsStore } from './metricsStore'

interface AuthState {
  token: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    token: null,
    login: async (username, password) => {
      try {
        // Fake API call
        if (username === 'admin' && password === '123') {
          set({ token: 'FAKE_TOKEN' }, false, 'auth/login/success')
          useMetricsStore.getState().logAction('auth/login/success')
        } else {
          throw new Error('Invalid credentials')
        }
      } catch (err) {
        set({ token: null }, false, 'auth/login/error')
        useMetricsStore.getState().logError('auth/login/error')
      }
    },
    logout: () => {
      set({ token: null }, false, 'auth/logout')
      useMetricsStore.getState().logAction('auth/logout')
    },
  }))
)

```
---
### 3. Demo component: ErrorLogger.tsx
```ts
import React, { useEffect } from 'react'
import { useMetricsStore } from '../store/metricsStore'

export const ErrorLogger = () => {
  useEffect(() => {
    const unsub = useMetricsStore.subscribe(
      (s) => s.errors,
      (errors) => {
        console.warn(`⚠️ Error count changed: ${errors}`)
      }
    )
    return () => unsub()
  }, [])

  return null
}

```
---

### 4. MetricsDashboard.tsx

```tsx
import React from 'react'
import { useMetricsStore } from '../store/metricsStore'
import shallow from 'zustand/shallow'

export const MetricsDashboard = () => {
  const { actionCount, errors } = useMetricsStore(
    (s) => ({ actionCount: s.actionCount, errors: s.errors }),
    shallow
  )

  return (
    <div>
      <h3>📊 Metrics</h3>
      <p>Action Count: {actionCount}</p>
      <p>Errors: {errors}</p>
    </div>
  )
}
```

---

## 💡 Best Practices áp dụng

1. **DevTools** → tất cả action đều traceable trong Redux DevTools.
2. **logAction/logError** → có prefix rõ ràng (`metrics/logAction/...`).
3. **getState()** → cho phép cross-store update mà không gây re-render.
4. **shallow** → `MetricsDashboard` chỉ render khi **actionCount hoặc errors** thực sự thay đổi.
5. **Separation of Concerns** → logging tách biệt hoàn toàn, dễ mở rộng (thêm Prometheus/Grafana export chẳng hạn).

---

## ⚠️ Pitfalls cần tránh

* **Gọi logAction bên trong render** → gây infinite loop.
* **Không filter selector** → Dashboard sẽ re-render mỗi lần lastAction đổi (không cần thiết).
* **Lạm dụng DevTools ở production** → leak action nhạy cảm.

---

👉 Đây là pattern **monitoring & telemetry** chuẩn trong công ty lớn, thường kết hợp với **analytics + error tracking** (Sentry, Datadog).


---

📌 [<< Ngày 05](./Day05.md) | [Ngày 07 >>](./Day07.md)