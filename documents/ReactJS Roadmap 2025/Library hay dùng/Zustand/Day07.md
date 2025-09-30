# 📘 Day 7 – Async Actions & API Calls (với Error Logging)

## 1. Khái niệm

Trong ứng dụng thực tế, state không chỉ là boolean hay counter. Ta cần quản lý **dữ liệu bất đồng bộ** như:

* Fetch API từ backend.
* Gửi form data (login, signup).
* Cập nhật DB (CRUD).

Với Zustand, async action chỉ đơn giản là **hàm async trong store**. Nhưng để enterprise-friendly, ta cần:

* Quản lý **loading / error state**.
* Log lỗi (Sentry/metrics).
* Không re-render toàn bộ UI không cần thiết.

---

## 2. Cấu trúc chuẩn trong công ty lớn

### store/userStore.ts

```ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useMetricsStore } from './metricsStore'

interface User {
  id: number
  name: string
  email: string
}

interface UserState {
  users: User[]
  loading: boolean
  error: string | null
  fetchUsers: () => Promise<void>
}

export const useUserStore = create<UserState>()(
  devtools((set) => ({
    users: [],
    loading: false,
    error: null,

    fetchUsers: async () => {
      set({ loading: true, error: null }, false, 'users/fetch/start')

      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users')
        if (!res.ok) throw new Error(`API failed with ${res.status}`)
        const data: User[] = await res.json()

        set({ users: data, loading: false }, false, 'users/fetch/success')
        useMetricsStore.getState().logAction('users/fetch/success')
      } catch (err: any) {
        set({ error: err.message, loading: false }, false, 'users/fetch/error')
        useMetricsStore.getState().logError(`users/fetch/error: ${err.message}`)
      }
    },
  }))
)
```

---

### Component: UserList.tsx

```tsx
import React, { useEffect } from 'react'
import { useUserStore } from '../store/userStore'

export const UserList = () => {
  const { users, loading, error, fetchUsers } = useUserStore()

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  if (loading) return <p>⏳ Loading users...</p>
  if (error) return <p>❌ Error: {error}</p>

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>
          {u.name} ({u.email})
        </li>
      ))}
    </ul>
  )
}
```

---

## 3. Middleware + Logging Flow

1. `fetchUsers()` bắt đầu → log `"users/fetch/start"`.
2. Nếu thành công → log `"users/fetch/success"`.
3. Nếu lỗi → logError `"users/fetch/error: <message>"`.
4. Metrics store sẽ tăng `errors` và có thể trigger cảnh báo.

---

## 4. Best Practices Enterprise

* **Always track `loading/error`** → giúp UI consistent.
* **Log lỗi cả ở state + external tool** → không mất trace.
* **Không để UI re-render toàn bộ**: chỉ subscribe vào slice (`users`, `loading`, `error`).
* **Error category rõ ràng**: `"users/fetch/error"` thay vì chỉ `"error"`.
* **Retry strategy**: cho phép gọi lại API nếu fail.

---

## 5. Mini Coding Challenge

👉 Viết thêm một action `addUser(name: string, email: string)`:

* Gửi POST API giả ([https://jsonplaceholder.typicode.com/users](https://jsonplaceholder.typicode.com/users)).
* Nếu thành công → update users state.
* Nếu lỗi → logError vào metrics.

**Solution mẫu cho challenge addUser()** với chuẩn enterprise: có **optimistic update** + **rollback khi fail**.

---

# 🚀 Challenge Solution – `addUser()`

## 1. Store với `addUser`

```ts
// store/userStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useMetricsStore } from './metricsStore'

interface User {
  id: number
  name: string
  email: string
}

interface UserState {
  users: User[]
  loading: boolean
  error: string | null
  fetchUsers: () => Promise<void>
  addUser: (name: string, email: string) => Promise<void>
}

export const useUserStore = create<UserState>()(
  devtools((set, get) => ({
    users: [],
    loading: false,
    error: null,

    fetchUsers: async () => {
      set({ loading: true, error: null }, false, 'users/fetch/start')
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users')
        if (!res.ok) throw new Error(`API failed with ${res.status}`)
        const data: User[] = await res.json()
        set({ users: data, loading: false }, false, 'users/fetch/success')
        useMetricsStore.getState().logAction('users/fetch/success')
      } catch (err: any) {
        set({ error: err.message, loading: false }, false, 'users/fetch/error')
        useMetricsStore.getState().logError(`users/fetch/error: ${err.message}`)
      }
    },

    addUser: async (name, email) => {
      const tempId = Date.now() // fake ID cho optimistic update
      const newUser: User = { id: tempId, name, email }

      // Optimistic update
      set(
        (state) => ({ users: [...state.users, newUser] }),
        false,
        'users/add/optimistic'
      )

      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        })
        if (!res.ok) throw new Error(`POST failed with ${res.status}`)

        const savedUser: User = await res.json()

        // Replace tempId bằng id thật từ API
        set(
          (state) => ({
            users: state.users.map((u) =>
              u.id === tempId ? { ...savedUser, id: savedUser.id } : u
            ),
          }),
          false,
          'users/add/success'
        )
        useMetricsStore.getState().logAction('users/add/success')
      } catch (err: any) {
        // Rollback nếu fail
        set(
          (state) => ({
            users: state.users.filter((u) => u.id !== tempId),
            error: err.message,
          }),
          false,
          'users/add/error'
        )
        useMetricsStore.getState().logError(`users/add/error: ${err.message}`)
      }
    },
  }))
)
```

---

## 2. Component: AddUserForm.tsx

```tsx
import React, { useState } from 'react'
import { useUserStore } from '../store/userStore'

export const AddUserForm = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const addUser = useUserStore((s) => s.addUser)
  const error = useUserStore((s) => s.error)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) return
    await addUser(name, email)
    setName('')
    setEmail('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Add User</button>
      {error && <p style={{ color: 'red' }}>❌ {error}</p>}
    </form>
  )
}
```

---

## 3. Flow chuẩn

1. User submit → UI update ngay với `optimistic state`.
2. Nếu API thành công → replace `tempId` bằng `realId`.
3. Nếu API fail → rollback, remove user vừa thêm, log error.

---

## 4. Best Practices

* **Optimistic UI** giúp UX nhanh, không phải chờ API.
* **Rollback** đảm bảo dữ liệu UI = dữ liệu backend.
* **Action log rõ ràng**: `add/optimistic → add/success → add/error`.
* **Error log** đi kèm rollback → dễ trace khi debug.

---
Nâng cấp `addUser()` với **retry strategy** (tự động thử lại tối đa 3 lần nếu API fail). Đây là pattern rất hay gặp trong **enterprise app** (network không ổn định, API rate limit, server tạm lỗi).

---

# 🚀 `addUser()` với Retry Strategy

## 1. Store với Retry

```ts
// store/userStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useMetricsStore } from './metricsStore'

interface User {
  id: number
  name: string
  email: string
}

interface UserState {
  users: User[]
  loading: boolean
  error: string | null
  fetchUsers: () => Promise<void>
  addUser: (name: string, email: string) => Promise<void>
}

export const useUserStore = create<UserState>()(
  devtools((set, get) => ({
    users: [],
    loading: false,
    error: null,

    fetchUsers: async () => {
      set({ loading: true, error: null }, false, 'users/fetch/start')
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users')
        if (!res.ok) throw new Error(`API failed with ${res.status}`)
        const data: User[] = await res.json()
        set({ users: data, loading: false }, false, 'users/fetch/success')
        useMetricsStore.getState().logAction('users/fetch/success')
      } catch (err: any) {
        set({ error: err.message, loading: false }, false, 'users/fetch/error')
        useMetricsStore.getState().logError(`users/fetch/error: ${err.message}`)
      }
    },

    addUser: async (name, email) => {
      const tempId = Date.now()
      const newUser: User = { id: tempId, name, email }

      // Optimistic update
      set(
        (state) => ({ users: [...state.users, newUser] }),
        false,
        'users/add/optimistic'
      )

      let attempt = 0
      let success = false
      let lastError = null

      while (attempt < 3 && !success) {
        try {
          attempt++
          const res = await fetch('https://jsonplaceholder.typicode.com/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser),
          })

          if (!res.ok) throw new Error(`POST failed: ${res.status}`)
          const savedUser: User = await res.json()

          // Replace tempId bằng realId
          set(
            (state) => ({
              users: state.users.map((u) =>
                u.id === tempId ? { ...savedUser, id: savedUser.id } : u
              ),
            }),
            false,
            'users/add/success'
          )
          useMetricsStore.getState().logAction(`users/add/success (attempt ${attempt})`)
          success = true
        } catch (err: any) {
          lastError = err
          useMetricsStore
            .getState()
            .logError(`users/add/error attempt ${attempt}: ${err.message}`)

          // delay giữa các lần retry (exponential backoff)
          await new Promise((res) => setTimeout(res, attempt * 1000))
        }
      }

      if (!success) {
        // Rollback nếu fail cả 3 lần
        set(
          (state) => ({
            users: state.users.filter((u) => u.id !== tempId),
            error: lastError?.message || 'Unknown error',
          }),
          false,
          'users/add/failed-after-retries'
        )
      }
    },
  }))
)
```

---

## 2. Giải thích cơ chế

* **Optimistic update**: user thấy kết quả ngay.
* **Retry loop (3 lần)**: nếu API fail → thử lại với delay tăng dần (1s → 2s → 3s).
* **Log chi tiết**: `users/add/error attempt X` giúp team dev trace dễ.
* **Rollback cuối cùng**: đảm bảo không giữ state sai.

---

## 3. Lợi ích trong công ty lớn

* Tránh UX tệ do API fail 1 lần → hỏng flow.
* Có **resilience** (khả năng chống chịu) khi API load cao.
* Logging chi tiết giúp **DevOps** phân tích tỷ lệ lỗi.
---

# 📌 Day 7: Async Actions & API Calls trong Zustand

## 🎯 Mục tiêu học

* Biết cách viết **async actions** (hàm bất đồng bộ trong store).
* Quản lý **loading, error, data** theo best practices.
* Hiểu khi nào để async logic trong Zustand, khi nào tách ra (React Query).
* Thực hành CRUD với API giả.
* Biết cách log lỗi và rollback state trong tình huống fail.

---

## 📝 TL;DR

Zustand có thể quản lý **UI state + local async calls** rất tốt. Tuy nhiên với **server state** phức tạp (pagination, caching, sync nhiều tab) → nên kết hợp với **React Query**.

---

## 🔍 Nội dung chi tiết

### 1. Cú pháp cơ bản async trong Zustand

```ts
// ví dụ nhỏ
const useUserStore = create<UserState>((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      set({ users: data, loading: false })
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },
}))
```

> ⚡ Điểm cần nhớ: Zustand không cần `thunk` như Redux. Bạn viết async trực tiếp trong store.

---

### 2. Quản lý `loading` – `error` – `data`

Trong enterprise app, bạn luôn cần **3 state chính** khi gọi API:

* `loading`: để hiển thị spinner/progress.
* `error`: để báo lỗi.
* `data`: state thực tế.

Nếu không quản lý đúng, UI sẽ bị **lag** hoặc **hiển thị sai khi fail**.

---

### 3. Case thực tế: CRUD User

Ví dụ CRUD user với Zustand + API JSONPlaceholder.

```ts
// store/userStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface User {
  id: number
  name: string
  email: string
}

interface UserState {
  users: User[]
  loading: boolean
  error: string | null
  fetchUsers: () => Promise<void>
  addUser: (name: string, email: string) => Promise<void>
  deleteUser: (id: number) => Promise<void>
}

export const useUserStore = create<UserState>()(
  devtools((set, get) => ({
    users: [],
    loading: false,
    error: null,

    fetchUsers: async () => {
      set({ loading: true, error: null }, false, 'users/fetch/start')
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users')
        if (!res.ok) throw new Error(`API failed: ${res.status}`)
        const data: User[] = await res.json()
        set({ users: data, loading: false }, false, 'users/fetch/success')
      } catch (err: any) {
        set({ error: err.message, loading: false }, false, 'users/fetch/error')
      }
    },

    addUser: async (name, email) => {
      const newUser: User = { id: Date.now(), name, email }
      set((state) => ({ users: [...state.users, newUser] }), false, 'users/add/optimistic')

      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        })
        if (!res.ok) throw new Error(`POST failed: ${res.status}`)
        const saved = await res.json()
        set(
          (state) => ({
            users: state.users.map((u) => (u.id === newUser.id ? saved : u)),
          }),
          false,
          'users/add/success'
        )
      } catch (err: any) {
        // rollback
        set(
          (state) => ({
            users: state.users.filter((u) => u.id !== newUser.id),
            error: err.message,
          }),
          false,
          'users/add/error'
        )
      }
    },

    deleteUser: async (id) => {
      const prevUsers = get().users
      set((state) => ({ users: state.users.filter((u) => u.id !== id) }), false, 'users/delete/optimistic')

      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
          method: 'DELETE',
        })
        if (!res.ok) throw new Error(`DELETE failed: ${res.status}`)
      } catch (err: any) {
        // rollback nếu fail
        set({ users: prevUsers, error: err.message }, false, 'users/delete/error')
      }
    },
  }))
)
```

---

### 4. Khi nào dùng Zustand vs React Query

* ✅ Zustand: UI state, modal, filter, form tạm, optimistic update.
* ✅ React Query: server state, caching, pagination, sync nhiều tab, retry, background refresh.

**Enterprise pattern chuẩn:**

* **Zustand cho local state (UI logic).**
* **React Query cho server state (data từ API).**

---

## 💻 Bài tập

### Level 1

Viết một action `updateUser(id, name)` trong store.
👉 Lời giải:

* Optimistic update tên user.
* Gọi API `PUT`.
* Rollback nếu fail.

### Level 2

Thêm flag `retry` vào `fetchUsers()` (tối đa 2 lần).
👉 Lời giải: sử dụng `for loop` với `await fetch`, rollback khi hết retry.

### Level 3

Tạo `searchUsers(query: string)` gọi API `https://jsonplaceholder.typicode.com/users?q=query`.
👉 Lời giải: giữ `searchResults` trong store riêng, không đụng `users` chính.

---

## ⚠️ Pitfalls

* Không reset `error` → UI cứ báo lỗi mãi.
* Không rollback khi fail → user thấy dữ liệu ảo.
* Không log action → khó debug khi nhiều dev cùng làm.

---

## 📚 Further Reading

* Zustand docs: [https://docs.pmnd.rs/zustand](https://docs.pmnd.rs/zustand)
* React Query vs Zustand: [State Management Patterns](https://tkdodo.eu/blog/react-query-as-a-state-manager)
* Optimistic UI tại scale lớn (Facebook/Twitter pattern).
---


# ✅ Giải bài tập Day 7

## Level 1: `updateUser(id, name)`

**Đề**: Viết một action `updateUser(id, name)` trong store.

**Lời giải:**

```ts
updateUser: async (id: number, name: string) => {
  const prevUsers = get().users
  const updatedUsers = prevUsers.map((u) =>
    u.id === id ? { ...u, name } : u
  )

  // Optimistic update
  set({ users: updatedUsers }, false, 'users/update/optimistic')

  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...prevUsers.find((u) => u.id === id), name }),
    })
    if (!res.ok) throw new Error(`PUT failed: ${res.status}`)
    const saved = await res.json()

    // Replace bằng dữ liệu từ API
    set(
      (state) => ({
        users: state.users.map((u) => (u.id === id ? saved : u)),
      }),
      false,
      'users/update/success'
    )
  } catch (err: any) {
    // Rollback nếu fail
    set({ users: prevUsers, error: err.message }, false, 'users/update/error')
  }
}
```

👉 Best practice: luôn rollback nếu API fail, và đặt tên action trong devtools rõ ràng (`users/update/optimistic`, `users/update/success`, `users/update/error`).

---

## Level 2: Retry trong `fetchUsers()`

**Đề**: Thêm retry tối đa 2 lần vào `fetchUsers()`.

**Lời giải:**

```ts
fetchUsers: async () => {
  set({ loading: true, error: null }, false, 'users/fetch/start')
  let attempt = 0
  let success = false
  let lastError: any = null

  while (attempt < 2 && !success) {
    try {
      attempt++
      const res = await fetch('https://jsonplaceholder.typicode.com/users')
      if (!res.ok) throw new Error(`API failed: ${res.status}`)
      const data: User[] = await res.json()
      set({ users: data, loading: false }, false, `users/fetch/success (attempt ${attempt})`)
      success = true
    } catch (err: any) {
      lastError = err
      await new Promise((res) => setTimeout(res, attempt * 1000)) // exponential backoff
    }
  }

  if (!success) {
    set({ error: lastError?.message || 'Unknown error', loading: false }, false, 'users/fetch/error')
  }
}
```

👉 Best practice: exponential backoff giúp giảm tải server, tránh spam request.

---

## Level 3: `searchUsers(query: string)`

**Đề**: Tạo `searchUsers(query)` và giữ kết quả riêng trong `searchResults`.

**Lời giải:**

```ts
interface UserState {
  users: User[]
  searchResults: User[]
  loading: boolean
  error: string | null
  // ...
  searchUsers: (query: string) => Promise<void>
}

searchUsers: async (query: string) => {
  set({ loading: true, error: null }, false, 'users/search/start')
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users?q=${query}`)
    if (!res.ok) throw new Error(`Search failed: ${res.status}`)
    const results: User[] = await res.json()
    set({ searchResults: results, loading: false }, false, 'users/search/success')
  } catch (err: any) {
    set({ error: err.message, loading: false }, false, 'users/search/error')
  }
}
```

👉 Best practice: tách `searchResults` khỏi `users` để tránh làm loạn dữ liệu chính.

---

# 🎯 Code Challenge Cuối Bài (Enterprise)

**Đề:**
Xây dựng một action `bulkDeleteUsers(ids: number[])` xoá nhiều user cùng lúc. Yêu cầu:

1. Optimistic update: xoá ngay trong UI.
2. Thử gọi API `DELETE` cho từng user.
3. Nếu user nào xoá fail → rollback lại chỉ user đó.
4. Log kết quả cho từng user (success/error).

---

## 💡 Gợi ý tư duy

* Sử dụng `Promise.allSettled` để chạy song song.
* Tách state `users` thành 2 nhóm: deleted thành công và rollback.
* Log cụ thể `users/delete/success` hay `users/delete/error` cho từng ID.

---

## 📝 Lời giải

```ts
bulkDeleteUsers: async (ids: number[]) => {
  const prevUsers = get().users

  // Optimistic update: remove all ngay lập tức
  set(
    (state) => ({
      users: state.users.filter((u) => !ids.includes(u.id)),
    }),
    false,
    'users/bulkDelete/optimistic'
  )

  const results = await Promise.allSettled(
    ids.map(async (id) => {
      const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error(`DELETE failed: ${res.status}`)
      return id
    })
  )

  const failedIds = results
    .map((r, i) => (r.status === 'rejected' ? ids[i] : null))
    .filter(Boolean) as number[]

  if (failedIds.length > 0) {
    // Rollback chỉ user bị fail
    set(
      (state) => ({
        users: [...state.users, ...prevUsers.filter((u) => failedIds.includes(u.id))],
        error: `Failed to delete users: ${failedIds.join(', ')}`,
      }),
      false,
      'users/bulkDelete/partialRollback'
    )
  }
}
```

---

## ✅ Enterprise best practices rút ra

* Không rollback cả list nếu chỉ 1–2 user fail → **rollback partial**.
* Log rõ ID nào fail để dễ debug.
* Optimistic update giúp UI mượt, user không thấy delay.
* Với số lượng lớn (1000+ user), cần batch API call (paging, chunked requests).

---


# ✅ Day 7 – Exercises & Code Challenge (Async Actions + API Calls)

## Exercises

### 1. Tạo store quản lý danh sách `users`

* State: `users: User[]`, `loading: boolean`, `error: string | null`.
* Action: `fetchUsers`, `addUser`, `deleteUser`.

**Solution (TypeScript + Zustand + async middleware best practices):**

```tsx
// store/userStore.ts
import { create } from "zustand";

type User = { id: number; name: string };

type UserStore = {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  addUser: (user: User) => void;
  deleteUser: (id: number) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const data: User[] = await res.json();
      set({ users: data, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch users", loading: false });
    }
  },

  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  deleteUser: (id) =>
    set((state) => ({ users: state.users.filter((u) => u.id !== id) })),
}));
```

---

### 2. Sử dụng trong component

```tsx
import React, { useEffect } from "react";
import { useUserStore } from "../store/userStore";

export default function UserList() {
  const { users, loading, error, fetchUsers } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

---

## Code Challenge – Enterprise-Ready

### Yêu cầu

Viết store quản lý **auth**:

* `user: User | null`
* `token: string | null`
* `loading, error`
* `login(email, password)` → gọi API, lưu token vào `localStorage`
* `logout()` → xoá token + reset state
* **Best practices**:

  * Retry 1 lần nếu API fail tạm thời.
  * Log lỗi ra console.error.
  * Persist token để refresh không bị mất login.

---

### Solution

```tsx
// store/authStore.ts
import { create } from "zustand";

type User = { id: number; name: string; email: string };

type AuthStore = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  restoreSession: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });

    const attempt = async () => {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Login failed");
      return res.json();
    };

    try {
      const data = await attempt();
      set({ user: data.user, token: data.token, loading: false });
      localStorage.setItem("token", data.token);
    } catch (err) {
      console.error("Login error:", err);
      try {
        const data = await attempt();
        set({ user: data.user, token: data.token, loading: false });
        localStorage.setItem("token", data.token);
      } catch (err2) {
        console.error("Retry login failed:", err2);
        set({ error: "Unable to login", loading: false });
      }
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  restoreSession: () => {
    const token = localStorage.getItem("token");
    if (token) set({ token });
  },
}));
```

---

### Enterprise Notes

* **Persist session**: dùng `localStorage`/`cookies` giúp login không bị mất khi reload.
* **Retry pattern**: thử lại 1 lần khi API fail (network drop).
* **Error logging**: luôn log bằng `console.error` hoặc logger service (Sentry, Datadog).
* **Scalability**: có thể thay API `/api/login` bằng Axios instance kèm interceptors.

---

# 📝 Interview Q\&A – Async Actions (Zustand)

### 1. Trong Zustand, async actions được viết như thế nào?

**Trả lời:**

* Async actions chỉ là **hàm async** trong store.
* Không cần middleware như Redux Thunk.
* Ví dụ:

```ts
fetchUsers: async () => {
  set({ loading: true });
  try {
    const res = await fetch("/api/users");
    set({ users: await res.json(), loading: false });
  } catch (err) {
    set({ error: "Failed", loading: false });
  }
}
```

---

### 2. So sánh async actions trong Zustand vs Redux Thunk vs React Query?

**Trả lời:**

* **Zustand**: đơn giản, không cần extra middleware, dễ code, control hoàn toàn logic fetch.
* **Redux Thunk**: cần setup middleware, boilerplate nhiều (actions, reducers, types).
* **React Query**: chuyên cho server state, built-in caching, retry, background refetch.

👉 Trong enterprise:

* Dùng **Zustand** cho **UI/global state** (auth, modal, theme).
* Dùng **React Query** cho **server state** (data list, caching).
* Tránh biến Zustand thành "React Query thứ 2".

---

### 3. Làm sao để tránh race condition khi gọi async nhiều lần?

**Trả lời:**

* Race condition = request A chậm hơn request B nhưng update state sau → dữ liệu sai.
* Cách giải quyết:

  1. Lưu **requestId** hoặc **timestamp** trong store.
  2. Chỉ update state nếu requestId trùng với latest.

```ts
let currentReq = 0;

fetchUsers: async () => {
  const reqId = ++currentReq;
  set({ loading: true });
  const res = await fetch("/api/users");
  if (reqId === currentReq) {
    set({ users: await res.json(), loading: false });
  }
}
```

---

### 4. Trong enterprise app, async actions thường thêm gì ngoài fetch?

**Trả lời:**

* Retry (network drop).
* Logging (console.error hoặc Sentry).
* Rollback (optimistic update fail).
* Persist (localStorage, IndexedDB).
* AbortController (huỷ request khi unmount).

---

### 5. Nếu API fail liên tục, bạn handle thế nào trong Zustand?

**Trả lời:**

* Retry có giới hạn (1–3 lần).
* Luôn set `error` trong store để UI hiển thị fallback.
* Gửi log tới monitoring service (Sentry, Datadog).
* Không retry vô hạn → tránh DDoS chính server của mình.

---


# 🚀 Race Condition + AbortController trong Zustand

## 1. Race Condition Fix

Khi gọi API liên tục (ví dụ search box), request cũ có thể về sau request mới → dữ liệu sai.
Giải pháp: **requestId** (hoặc timestamp) → chỉ update nếu là request mới nhất.

```ts
import { create } from "zustand";

interface UserState {
  users: any[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
}

let currentReq = 0;

export const useUserStore = create<UserState>((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    const reqId = ++currentReq; // tăng id mỗi lần gọi
    set({ loading: true, error: null });

    try {
      const res = await fetch("/api/users");
      const data = await res.json();

      if (reqId === currentReq) {
        // chỉ update state nếu là request mới nhất
        set({ users: data, loading: false });
      }
    } catch (err) {
      if (reqId === currentReq) {
        set({ error: "Failed to fetch users", loading: false });
      }
    }
  },
}));
```

👉 Đây là pattern hay dùng trong enterprise search / typeahead.

---

## 2. AbortController (Huỷ request khi unmount hoặc khi có request mới)

Khi user spam search, ta huỷ request cũ ngay thay vì để server trả về muộn.

```ts
import { create } from "zustand";

interface SearchState {
  results: any[];
  loading: boolean;
  error: string | null;
  search: (query: string) => Promise<void>;
}

let controller: AbortController | null = null;

export const useSearchStore = create<SearchState>((set) => ({
  results: [],
  loading: false,
  error: null,

  search: async (query: string) => {
    // huỷ request cũ nếu có
    if (controller) controller.abort();
    controller = new AbortController();

    set({ loading: true, error: null });

    try {
      const res = await fetch(`/api/search?q=${query}`, {
        signal: controller.signal,
      });
      const data = await res.json();
      set({ results: data, loading: false });
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Request cancelled");
        return;
      }
      set({ error: "Search failed", loading: false });
    }
  },
}));
```

👉 Đây là pattern chuẩn enterprise:

* Kết hợp `AbortController` để cancel request thừa.
* Giảm load server, tránh UI hiển thị kết quả cũ.

---

📌 Tóm lại:

* **Race Condition Fix** = đảm bảo state chỉ update từ request mới nhất.
* **AbortController** = huỷ request thừa, tối ưu UX & server load.

---
Tạo **Custom Zustand middleware** để tái sử dụng cho mọi async action (fetch, search, update).

---

# 🛠️ Middleware: `withAbortAndRace`

## 1. Ý tưởng

* **Race Condition Fix**: mỗi lần gọi async → tăng `requestId`. Chỉ commit state nếu đúng request cuối.
* **AbortController**: tự động abort request cũ khi có request mới.

## 2. Middleware Code

```ts
import { StateCreator } from "zustand";

export interface AsyncControllerState {
  _reqId: number;
  _controller: AbortController | null;
}

export function withAbortAndRace<
  T extends object
>(config: StateCreator<T & AsyncControllerState>): StateCreator<T> {
  return (set, get, api) =>
    config(
      (args) => set(args),
      () => get() as T & AsyncControllerState,
      api
    ) as any;
}

// Utility cho async actions
export const asyncAction =
  <T>(fn: (signal: AbortSignal, reqId: number) => Promise<T>) =>
  async (set: any, get: any) => {
    // hủy request cũ
    if (get()._controller) get()._controller.abort();

    const controller = new AbortController();
    const reqId = get()._reqId + 1;

    set({ _controller: controller, _reqId: reqId });

    try {
      const data = await fn(controller.signal, reqId);
      if (reqId === get()._reqId) return data; // chỉ lấy data từ request cuối
    } catch (err: any) {
      if (err.name === "AbortError") return null;
      throw err;
    }
  };
```
* Override lại `get()` để ép kiểu (`as T & AsyncControllerState`).
* Khi ở trong hàm `asyncAction`, bạn **cần dữ liệu hiện tại** (ví dụ `_reqId`, `_controller`).
* Nếu bạn dùng `set()` ở đó → bạn chỉ cập nhật state.
* Nếu bạn cần đọc state → bạn bắt buộc phải `get().stateKey`.
---

## 3. Áp dụng trong Store

```ts
import { create } from "zustand";
import { withAbortAndRace, asyncAction, AsyncControllerState } from "./middleware";

interface SearchState extends AsyncControllerState {
  results: any[];
  loading: boolean;
  error: string | null;
  search: (query: string) => Promise<void>;
}

export const useSearchStore = create<SearchState>()(
  withAbortAndRace((set, get) => ({
    results: [],
    loading: false,
    error: null,
    _reqId: 0,
    _controller: null,

    search: async (query: string) => {
      set({ loading: true, error: null });

      const run = asyncAction(async (signal) => {
        const res = await fetch(`/api/search?q=${query}`, { signal });
        return await res.json();
      });

      try {
        const data = await run(set, get);
        if (data) set({ results: data, loading: false });
      } catch (err) {
        set({ error: "Search failed", loading: false });
      }
    },
  }))
);
```

---

## 4. Ưu điểm enterprise

* Không lặp code cho từng async action.
* Dùng được cho **search, pagination, filter, API call**.
* An toàn race condition + tiết kiệm băng thông server (abort request thừa).

---

👉 Giờ mỗi khi bạn muốn tạo 1 async action trong store, chỉ cần wrap bằng `asyncAction(...)` thay vì viết lại logic race/abort.

---
Viết lại **2 version side-by-side**:

* **Version 1 (Manual)** → dễ hiểu, code thẳng trong store.
* **Version 2 (Middleware hóa)** → gọn gàng, tái sử dụng được cho nhiều store.

---

# 🔹 Version 1: Manual Store (code thẳng trong store)

```ts
import { create } from "zustand";

interface SearchResult {
  id: string;
  name: string;
}

interface SearchState {
  results: SearchResult[];
  loading: boolean;
  error: string | null;

  _reqId: number;
  _controller: AbortController | null;

  search: (query: string) => Promise<void>;
  clear: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  results: [],
  loading: false,
  error: null,

  _reqId: 0,
  _controller: null,

  search: async (query: string) => {
    if (get()._controller) get()._controller.abort();

    const controller = new AbortController();
    const reqId = get()._reqId + 1;

    set({ _controller: controller, _reqId: reqId, loading: true, error: null });

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      });

      const data: SearchResult[] = await res.json();

      if (reqId === get()._reqId) {
        set({ results: data, loading: false });
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      set({ error: err.message || "Search failed", loading: false });
    }
  },

  clear: () => set({ results: [], error: null }),
}));
```

👉 Ưu điểm: dễ đọc, ai mới học cũng hiểu.
👉 Nhược điểm: code lặp lại nếu có nhiều store cũng cần abort + race.

---

# 🔹 Version 2: Middleware hóa

## middleware.ts

```ts
import { StateCreator } from "zustand";

export interface AsyncControllerState {
  _reqId: number;
  _controller: AbortController | null;
}

// Middleware để thêm _reqId + _controller vào store
export function withAbortAndRace<T extends object>(
  config: StateCreator<T & AsyncControllerState>
): StateCreator<T> {
  return (set, get, api) =>
    config(
      set,
      () => get() as T & AsyncControllerState,
      api
    ) as any;
}

// Utility: giúp viết async action dễ hơn
export const asyncAction =
  <T>(fn: (signal: AbortSignal, reqId: number) => Promise<T>) =>
  async (set: any, get: any) => {
    if (get()._controller) get()._controller.abort();

    const controller = new AbortController();
    const reqId = get()._reqId + 1;

    set({ _controller: controller, _reqId: reqId });

    try {
      const data = await fn(controller.signal, reqId);
      if (reqId === get()._reqId) return data;
    } catch (err: any) {
      if (err.name === "AbortError") return null;
      throw err;
    }
  };
```

## useSearchStore.ts

```ts
import { create } from "zustand";
import {
  withAbortAndRace,
  asyncAction,
  AsyncControllerState,
} from "./middleware";

interface SearchResult {
  id: string;
  name: string;
}

interface SearchState extends AsyncControllerState {
  results: SearchResult[];
  loading: boolean;
  error: string | null;

  search: (query: string) => Promise<void>;
  clear: () => void;
}

export const useSearchStore = create<SearchState>()(
  withAbortAndRace((set, get) => ({
    results: [],
    loading: false,
    error: null,
    _reqId: 0,
    _controller: null,

    search: async (query: string) => {
      set({ loading: true, error: null });

      const run = asyncAction(async (signal) => {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal,
        });
        return await res.json();
      });

      try {
        const data = await run(set, get);
        if (data) set({ results: data, loading: false });
      } catch (err) {
        set({ error: "Search failed", loading: false });
      }
    },

    clear: () => set({ results: [], error: null }),
  }))
);
```

---

# 🔑 So sánh

|                      | Manual Store  | Middleware hóa                 |
| -------------------- | ------------- | ------------------------------ |
| Dễ đọc cho người mới | ✅ Rất dễ      | ❌ Hơi khó hiểu                 |
| Tái sử dụng          | ❌ Không       | ✅ Dễ dàng dùng cho nhiều store |
| Dòng code            | 🚨 Lặp lại    | ✨ Gọn hơn                      |
| Khi debug            | ✅ Dễ thấy lỗi | ❌ Cần hiểu middleware          |

---

👉 Lời khuyên:

* Nếu bạn chỉ có **1-2 store cần abort**, dùng **Manual**.
* Nếu app có nhiều store async (search, fetch, filter, pagination…), thì viết **middleware** để tránh copy-paste.

---
Ví dụ **`useUserStore`** để thấy lợi ích của middleware `withAbortAndRace` + `asyncAction`.

---

# 🔹 useUserStore với Middleware

## 1. Định nghĩa interface

```ts
import { create } from "zustand";
import {
  withAbortAndRace,
  asyncAction,
  AsyncControllerState,
} from "./middleware";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState extends AsyncControllerState {
  user: User | null;
  loading: boolean;
  error: string | null;

  fetchUser: (id: string) => Promise<void>;
  clear: () => void;
}
```

---

## 2. Store sử dụng middleware

```ts
export const useUserStore = create<UserState>()(
  withAbortAndRace((set, get) => ({
    user: null,
    loading: false,
    error: null,
    _reqId: 0,
    _controller: null,

    fetchUser: async (id: string) => {
      set({ loading: true, error: null });

      // Dùng asyncAction cho API call
      const run = asyncAction(async (signal) => {
        const res = await fetch(`/api/users/${id}`, { signal });
        if (!res.ok) throw new Error("User not found");
        return await res.json();
      });

      try {
        const data = await run(set, get);
        if (data) set({ user: data, loading: false });
      } catch (err: any) {
        set({ error: err.message, loading: false });
      }
    },

    clear: () => set({ user: null, error: null }),
  }))
);
```

---

# 🔹 3. Sử dụng trong Component

```tsx
import React, { useEffect } from "react";
import { useUserStore } from "./store/useUserStore";

export default function UserProfile({ userId }: { userId: string }) {
  const { user, loading, error, fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser(userId);
  }, [userId, fetchUser]);

  if (loading) return <p>Loading user...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>No user loaded</p>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

---

# 🔑 Điểm mạnh khi tái sử dụng middleware

* `useUserStore` và `useSearchStore` **không cần viết lại logic AbortController / reqId**, chỉ tập trung vào API riêng của chúng.
* Khi cần thêm store mới (vd: `usePostsStore`, `useCommentsStore`), bạn chỉ copy vài dòng thôi.
* Codebase công ty lớn sẽ **dễ maintain** và **giảm bug race condition** khi nhiều API call chạy cùng lúc.

---
Viết **`usePostsStore`** với hỗ trợ **pagination + abort request cũ + xử lý lỗi**. Đây là một case thực tế trong enterprise app (feed, dashboard, blog, social app).

---

# 🔹 1. Định nghĩa interface

```ts
import { create } from "zustand";
import {
  withAbortAndRace,
  asyncAction,
  AsyncControllerState,
} from "./middleware";

interface Post {
  id: string;
  title: string;
  content: string;
}

interface PostsState extends AsyncControllerState {
  posts: Post[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;

  fetchPosts: (page?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  reset: () => void;
}
```

---

# 🔹 2. Store với Middleware

```ts
export const usePostsStore = create<PostsState>()(
  withAbortAndRace((set, get) => ({
    posts: [],
    page: 1,
    hasMore: true,
    loading: false,
    error: null,
    _reqId: 0,
    _controller: null,

    fetchPosts: async (page = 1) => {
      set({ loading: true, error: null });

      const run = asyncAction(async (signal) => {
        const res = await fetch(`/api/posts?page=${page}`, { signal });
        if (!res.ok) throw new Error("Failed to fetch posts");
        return await res.json(); // giả sử API trả { data: Post[], hasMore: boolean }
      });

      try {
        const data = await run(set, get);
        if (data) {
          set({
            posts: page === 1 ? data.data : [...get().posts, ...data.data],
            page,
            hasMore: data.hasMore,
            loading: false,
          });
        }
      } catch (err: any) {
        set({ error: err.message, loading: false });
      }
    },

    loadMore: async () => {
      const { page, hasMore, fetchPosts } = get();
      if (!hasMore || get().loading) return;
      await fetchPosts(page + 1);
    },

    reset: () => set({ posts: [], page: 1, hasMore: true }),
  }))
);
```

---

# 🔹 3. Sử dụng trong Component (Pagination UI)

```tsx
import React, { useEffect } from "react";
import { usePostsStore } from "./store/usePostsStore";

export default function PostsList() {
  const { posts, loading, error, fetchPosts, loadMore, hasMore } =
    usePostsStore();

  useEffect(() => {
    fetchPosts(1); // load trang đầu
  }, [fetchPosts]);

  return (
    <div>
      <h1>📚 Posts</h1>

      {posts.map((p) => (
        <div key={p.id} className="post">
          <h3>{p.title}</h3>
          <p>{p.content}</p>
        </div>
      ))}

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {hasMore && !loading && (
        <button onClick={loadMore}>Load More</button>
      )}
    </div>
  );
}
```

---

# 🔑 Điểm mạnh

* **Race Condition Safe** → Khi user bấm "Load More" liên tục, request cũ sẽ bị hủy.
* **Reusability** → Không cần viết lại AbortController logic.
* **Scalability** → Dễ mở rộng cho infinite scroll hoặc caching.
* **Production Pattern** → Giống hệt app thật (social feed, news app, ecommerce).

---

👉 **`useCommentsStore`** (nested data, phụ thuộc `postId`, cần reset khi đổi post). Đây sẽ là bài tập nâng cao để hiểu **state gắn với context động** (vd: comments của từng post).

---

# 🔹 1. Định nghĩa interface

```ts
import { create } from "zustand";
import {
  withAbortAndRace,
  asyncAction,
  AsyncControllerState,
} from "./middleware";

interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
}

interface CommentsState extends AsyncControllerState {
  comments: Comment[];
  postId: string | null;
  loading: boolean;
  error: string | null;

  fetchComments: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  reset: () => void;
}
```

---

# 🔹 2. Store với Middleware

```ts
export const useCommentsStore = create<CommentsState>()(
  withAbortAndRace((set, get) => ({
    comments: [],
    postId: null,
    loading: false,
    error: null,
    _reqId: 0,
    _controller: null,

    fetchComments: async (postId: string) => {
      // nếu đổi sang post khác → reset trước
      if (get().postId !== postId) {
        set({ comments: [], postId, error: null });
      }

      set({ loading: true });

      const run = asyncAction(async (signal) => {
        const res = await fetch(`/api/posts/${postId}/comments`, { signal });
        if (!res.ok) throw new Error("Failed to fetch comments");
        return await res.json(); // giả sử trả về Comment[]
      });

      try {
        const data = await run(set, get);
        if (data) set({ comments: data, loading: false });
      } catch (err: any) {
        set({ error: err.message, loading: false });
      }
    },

    addComment: async (postId: string, content: string) => {
      set({ loading: true, error: null });
      try {
        const res = await fetch(`/api/posts/${postId}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
        if (!res.ok) throw new Error("Failed to add comment");
        const newComment = await res.json();
        set({ comments: [...get().comments, newComment], loading: false });
      } catch (err: any) {
        set({ error: err.message, loading: false });
      }
    },

    reset: () => set({ comments: [], postId: null, error: null }),
  }))
);
```

---

# 🔹 3. Sử dụng trong Component

```tsx
import React, { useEffect } from "react";
import { useCommentsStore } from "./store/useCommentsStore";

export default function Comments({ postId }: { postId: string }) {
  const { comments, loading, error, fetchComments, addComment } =
    useCommentsStore();

  useEffect(() => {
    fetchComments(postId);
  }, [postId, fetchComments]);

  return (
    <div>
      <h2>💬 Comments</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {comments.map((c) => (
        <div key={c.id} className="comment">
          <strong>{c.author}</strong>: {c.content}
        </div>
      ))}

      <button onClick={() => addComment(postId, "New comment!")}>
        Add Comment
      </button>
    </div>
  );
}
```

---

# 🔑 Điểm mạnh

* **Gắn với context động (`postId`)** → đổi sang post khác thì comments sẽ reset.
* **Abort request cũ** → nếu user click nhiều bài viết liên tục thì chỉ request cuối cùng được giữ.
* **Có thêm `addComment`** → minh họa CRUD, rất gần thực tế enterprise (blog, social app).

---


# 🚨 Bad vs ✅ Good Practices (Async Store với Zustand)

| Chủ đề                     | 🚨 Bad Practice                                              | ✅ Good Practice                                               | Giải thích                                  |                               |
| -------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------- | ------------------------------------------- | ----------------------------- |
| **Loading state**          | Không có `loading` → UI không biết đang fetch                | Luôn có `loading: boolean` và set đúng lúc                    | Giúp UI feedback ngay lập tức               |                               |
| **Error handling**         | Chỉ `console.error` trong catch                              | Lưu \`error: string                                           | null\` trong store và hiển thị UI           | Enterprise yêu cầu UX rõ ràng |
| **Race condition**         | Không quản lý request → data cũ ghi đè data mới              | Dùng `_reqId` + `AbortController`                             | Tránh bug khi user bấm tìm kiếm liên tục    |                               |
| **Merge state**            | `set({ comments: data })` ghi đè toàn bộ                     | `set({ comments: [...get().comments, newComment] })`          | Giữ state cũ + thêm mới → UI mượt hơn       |                               |
| **Reset state**            | Không reset khi context đổi (`postId`, `userId`)             | Reset `comments: []` trước khi fetch mới                      | Tránh hiển thị dữ liệu nhầm                 |                               |
| **CRUD update**            | Overwrite toàn bộ list khi update/delete                     | Update item bằng `map`/`filter` theo `id`                     | Tránh flick UI và giữ reference ổn định     |                               |
| **Middleware**             | Không log, không persist                                     | Dùng `persist`, `devtools`, `logger` khi cần                  | Hỗ trợ debug & session management           |                               |
| **Module structure**       | Dồn tất cả vào 1 store khổng lồ                              | Chia nhỏ: `useAuthStore`, `useUIStore`, `useCommentsStore`    | Enterprise project cần maintain dễ          |                               |
| **Async handling**         | Gọi API trực tiếp trong component                            | Đặt logic API trong store (action)                            | Giảm lặp code, dễ test & clean architecture |                               |
| **React Query vs Zustand** | Lạm dụng Zustand cho cả server state lớn (pagination, cache) | Dùng React Query cho server state, Zustand cho UI/local state | Pattern chuẩn enterprise                    |                               |

---

# 📌 Kết luận

* **Bad** = code chạy được nhưng dễ bug, khó scale.
* **Good** = code enterprise-ready, dễ maintain, ít bug race condition, phù hợp team lớn.
---
**Tổng hợp 3 cách tiếp cận trong Zustand** để so sánh:

---

# 🔹 1. Cách dùng thường (Basic Store)

👉 **Có 3 style** khi gọi `set`:

* **Object trực tiếp**
* **Callback prev**
* **Kết hợp với `get()`**

```ts
// stores/cart-basic.ts
import { create } from "zustand";

type CartItem = { id: number; name: string; price: number; qty: number };

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id" | "qty">) => void;
  removeItem: (id: number) => void;
  getTotal: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  // 1. Dùng object trực tiếp
  reset: () => set({ items: [] }),

  // 2. Dùng callback prev
  addItem: (item) =>
    set((prev) => ({
      items: [...prev.items, { ...item, id: Date.now(), qty: 1 }],
    })),

  // 3. Dùng get()
  removeItem: (id) => {
    const prev = get().items;
    set({ items: prev.filter((item) => item.id !== id) });
  },

  getTotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
}));
```

✅ **Trade-off**:

* **Ưu điểm**: Đơn giản, nhanh, dễ hiểu → phù hợp dự án nhỏ / MVP.
* **Nhược điểm**:

  * Không có logging, persistence, devtools.
  * Code lặp lại (ví dụ muốn log action thì phải thêm thủ công).
  * Khó mở rộng khi dự án lớn.

---

# 🔹 2. Middleware có sẵn (Built-in)

👉 Zustand cung cấp middleware như: `persist`, `devtools`, `subscribeWithSelector`, `immer`…

Ví dụ với **persist + devtools**:

```ts
// stores/cart-middleware.ts
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

type CartItem = { id: number; name: string; price: number; qty: number };
type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id" | "qty">) => void;
};

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set) => ({
        items: [],
        addItem: (item) =>
          set((prev) => ({
            items: [...prev.items, { ...item, id: Date.now(), qty: 1 }],
          })),
      }),
      { name: "cart-storage" } // save to localStorage
    ),
    { name: "CartStore" }
  )
);
```

✅ **Trade-off**:

* **Ưu điểm**:

  * Có sẵn tính năng quan trọng: devtools, persist, logging.
  * Giảm code lặp.
* **Nhược điểm**:

  * Tăng dependency → nặng hơn 1 chút.
  * Middleware có sẵn chỉ giải quyết common case, không linh hoạt cho yêu cầu đặc biệt.

---

# 🔹 3. Custom Middleware

👉 Tự viết middleware để mở rộng tính năng (logging, abort request, race condition, error handling, analytics, …).

Ví dụ: custom middleware log mọi action:

```ts
// stores/middleware/logger.ts
import { StateCreator } from "zustand";

export const logger =
  <T extends object>(config: StateCreator<T>): StateCreator<T> =>
  (set, get, api) =>
    config(
      (args) => {
        console.log("[ACTION]", args);
        set(args); // vẫn gọi set như bình thường
      },
      get,
      api
    );
```

Dùng trong store:

```ts
// stores/cart-custom.ts
import { create } from "zustand";
import { logger } from "./middleware/logger";

type CartItem = { id: number; name: string; price: number; qty: number };
type CartStore = { items: CartItem[]; addItem: (item: Omit<CartItem, "id" | "qty">) => void };

export const useCartStore = create<CartStore>()(
  logger((set) => ({
    items: [],
    addItem: (item) =>
      set((prev) => ({
        items: [...prev.items, { ...item, id: Date.now(), qty: 1 }],
      })),
  }))
);
```

✅ **Trade-off**:

* **Ưu điểm**:

  * Linh hoạt → custom theo nhu cầu công ty.
  * Có thể kết hợp nhiều middleware (compose).
  * Rất mạnh trong dự án enterprise (abort request, handle cache, retry…).
* **Nhược điểm**:

  * Phức tạp hơn, cần hiểu rõ `set`, `get`, `api`.
  * Dễ sai khi quản lý async hoặc side effect.

---

# 📌 Tổng hợp so sánh

| Cách viết             | Ưu điểm                                                              | Nhược điểm                              | Khi nào dùng                                |
| --------------------- | -------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------- |
| **Thường**            | Đơn giản, nhanh, dễ hiểu                                             | Không có devtools, persistence, logging | Dự án nhỏ, prototype, POC                   |
| **Middleware có sẵn** | Có devtools, persist, subscribe, immer… out-of-the-box               | Giới hạn tính năng, phụ thuộc lib       | Dự án tầm trung, cần devtools & persistence |
| **Custom Middleware** | Linh hoạt, mạnh mẽ, tích hợp business logic (abort, retry, logging…) | Phức tạp, cần hiểu sâu                  | Dự án lớn, enterprise, nhiều logic đặc thù  |

---

👉 Tóm lại:

* **Small app**: Basic đủ.
* **Medium app**: Dùng middleware built-in (`persist`, `devtools`).
* **Large app / Enterprise**: Kết hợp middleware built-in + custom (cho logging, async race, analytics).


---
📌 [<< Ngày 06](./Day06.md) | [Ngày 09 >>](./Day09.md)