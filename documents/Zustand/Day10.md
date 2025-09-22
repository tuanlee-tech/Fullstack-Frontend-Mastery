# Day 10 – Mini-Project: Task Manager App

## 🎯 Mục tiêu học

Sau ngày này, bạn sẽ:

1. Hiểu cách thiết kế **enterprise store architecture**: combine, modular slices, persist, asyncAction, subscribeWithSelector.
2. Triển khai **full lifecycle UI state + server state** trong 1 app thực tế.
3. Thực hành **persisted auth, task CRUD, modal, theme toggle**.
4. Áp dụng middleware để **tránh re-render thừa**, quản lý async, và debug dễ dàng.
5. Deploy app lên Vercel, chuẩn production-ready.

---

## TL;DR

Chúng ta sẽ xây dựng **Task Manager App**:

* **Auth**: login giả → persist token/user
* **Tasks**: CRUD tasks với asyncAction gọi mock API
* **UI State**: modal add/edit, theme toggle (dark/light)
* **Store**: combine slices, persist chỉ những state cần, subscribeWithSelector để render tối ưu
* **Deployment**: Vercel, production-ready structure

---

## Lý thuyết

Trong khóa học 10 ngày về Zustand Mastery, chúng ta đã học từ cơ bản đến nâng cao: store creation, selectors, UI state patterns, middleware (persist, subscribeWithSelector, devtools, combine, immer, custom middleware), async patterns, và các best practices enterprise. Day 10 là tổng hợp, áp dụng tất cả vào một mini-project thực tế.

### Key Concepts:
- **Combine:** Tách state và actions rõ ràng, dễ maintain.
- **Persist:** Lưu state vào storage (localStorage/sessionStorage), dùng partialize để chọn field an toàn.
- **SubscribeWithSelector:** Theo dõi state slice cụ thể, tránh re-render toàn bộ.
- **AsyncAction (Custom Middleware):** Quản lý async với cancel (AbortController), tránh race condition, handle loading/error.
- **Modular Slices:** Tách auth, task, ui thành slices, merge vào root store để đồng bộ.
- **Enterprise Patterns:** Partialize persist để bảo mật, selector tối ưu render, tests cho store/component, deploy-ready structure.

Project này sử dụng mock API (có thể thay bằng real backend như Supabase/Firebase). Focus vào Zustand patterns để xử lý UI/server state mượt mà.

---

## Code mẫu

### 1. Custom Middleware asyncAction (middleware/asyncAction.ts)
```ts
import { StateCreator } from "zustand";

export interface AsyncControllerState {
  _reqId: number;
  _controller: AbortController | null;
}

export function withAbortAndRace<T extends object>(
  config: StateCreator<T & AsyncControllerState>
): StateCreator<T> {
  return (set, get, api) =>
    config(
      (args) => set(args),
      () => get() as T & AsyncControllerState,
      api
    ) as any;
}

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

### 2. Root Store (stores/useStore.ts)
```ts
import { create } from "zustand";
import { combine, persist, subscribeWithSelector } from "zustand/middleware";
import { asyncAction, withAbortAndRace, AsyncControllerState } from "../middleware/asyncAction";

// ---------------- Slices ----------------
type AuthSlice = {
  token: string | null;
  user: { id: number; name: string } | null;
  login: (token: string, user: { id: number; name: string }) => void;
  logout: () => void;
};

type Task = { id: number; title: string; completed: boolean };
type TaskSlice = AsyncControllerState & {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (title: string) => Promise<void>;
  toggleTask: (id: number) => void;
};

type UISlice = {
  theme: "light" | "dark";
  showModal: boolean;
  openModal: () => void;
  closeModal: () => void;
};

type RootState = AuthSlice & TaskSlice & UISlice;

export const useStore = create<RootState>()(
  subscribeWithSelector(
    persist(
      withAbortAndRace(
        combine(
          {
            token: null,
            user: null,
            tasks: [],
            loading: false,
            error: null,
            _reqId: 0,
            _controller: null,
            theme: "light",
            showModal: false,
          },
          (set, get) => ({
            // ---- Auth ----
            login: (token, user) => set({ token, user }),
            logout: () => set({ token: null, user: null, tasks: [] }),

            // ---- Tasks ----
            fetchTasks: async () =>
              asyncAction(async (signal) => {
                const res = await fetch("/api/tasks", { signal });
                return res.json();
              })(set, get),
            addTask: async (title) =>
              asyncAction(async (signal) => {
                const res = await fetch("/api/tasks", {
                  method: "POST",
                  body: JSON.stringify({ title }),
                  signal,
                  headers: { "Content-Type": "application/json" },
                });
                return res.json();
              })(set, get),
            toggleTask: (id) =>
              set((state) => ({
                tasks: state.tasks.map((t) =>
                  t.id === id ? { ...t, completed: !t.completed } : t
                ),
              })),

            // ---- UI ----
            openModal: () => set({ showModal: true }),
            closeModal: () => set({ showModal: false }),
          })
        )
      ),
      {
        name: "task-manager",
        partialize: (state) => ({
          token: state.token,
          user: state.user,
          theme: state.theme,
        }),
      }
    )
  )
);
```

### 3. Component sử dụng store (components/TaskApp.tsx)
```tsx
import { useEffect, useState } from "react";
import { useStore } from "../stores/useStore";

export function TaskApp() {
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    toggleTask,
    showModal,
    openModal,
    closeModal,
    theme,
  } = useStore();

  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className={theme}>
      <button onClick={openModal}>Add Task</button>
      {showModal && (
        <div className="modal">
          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <button
            onClick={async () => {
              await addTask(newTitle);
              setNewTitle("");
              closeModal();
            }}
          >
            Submit
          </button>
        </div>
      )}

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => toggleTask(t.id)}
            />
            {t.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 4. Folder Structure (Enterprise-ready)
```
task-manager-app/
│
├─ public/
│   └─ index.html
│
├─ src/
│   ├─ components/
│   │   ├─ TaskApp.tsx
│   │   └─ Modal.tsx
│   │
│   ├─ stores/
│   │   ├─ useStore.ts
│   │   └─ middleware/asyncAction.ts
│   │
│   ├─ api/
│   │   └─ taskApi.ts
│   │
│   ├─ utils/
│   │   └─ format.ts
│   │
│   ├─ styles/
│   │   └─ theme.css
│   │
│   └─ main.tsx
│
├─ tests/
│   ├─ TaskApp.test.tsx
│   └─ store.test.ts
│
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
└─ README.md
```

**Giải thích**:
- `stores/` → Zustand store + middleware
- `components/` → UI components
- `api/` → wrapper cho fetch/axios calls
- `utils/` → helper functions
- `tests/` → unit tests (Jest + RTL)
- `styles/` → global theme, dark/light
- `main.tsx` → entrypoint React app

---

### 5. README.md (Sample)
```markdown
# Task Manager App – Zustand Enterprise Example

## Features
- Auth with token persist
- Task CRUD with asyncAction + cancelable request
- UI state: modal, theme toggle
- Enterprise-ready store: combine slices + subscribeWithSelector
- Partial persist: only auth + theme

## Tech Stack
- React 18 + TypeScript 5
- Zustand + middlewares (persist, subscribeWithSelector)
- Jest + React Testing Library
- Vercel deployment ready

## Run Locally
```bash
npm install
npm run dev
```

## Test
```bash
npm run test
```

## Deployment
* Connect repo to Vercel
* Build command: `npm run build`
* Output directory: `dist`
```

---

### 6. Vercel Config (vercel.json)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "vite.config.ts",
      "use": "@vercel/static-build"
    }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

---

### 7. Unit Tests

#### 7.1 Test store (async + sync)
```ts
// tests/store.test.ts
import { act } from '@testing-library/react';
import { useStore } from '../src/stores/useStore';

describe('Task Store', () => {
  beforeEach(() => {
    useStore.setState({
      token: null,
      user: null,
      tasks: [],
      loading: false,
      error: null,
      _reqId: 0,
      _controller: null,
      theme: 'light',
      showModal: false,
    });
  });

  it('login sets token and user', () => {
    act(() => useStore.getState().login('abc', { id: 1, name: 'John' }));
    const state = useStore.getState();
    expect(state.token).toBe('abc');
    expect(state.user?.name).toBe('John');
  });

  it('toggleTask flips completed', () => {
    act(() =>
      useStore.setState({ tasks: [{ id: 1, title: 'T1', completed: false }] })
    );
    act(() => useStore.getState().toggleTask(1));
    expect(useStore.getState().tasks[0].completed).toBe(true);
  });
});
```

#### 7.2 Test component
```tsx
// tests/TaskApp.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskApp } from '../src/components/TaskApp';
import { useStore } from '../src/stores/useStore';

describe('TaskApp Component', () => {
  beforeEach(() => {
    useStore.setState({ tasks: [], showModal: false });
  });

  it('renders add button', () => {
    render(<TaskApp />);
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  it('opens modal when click add', () => {
    render(<TaskApp />);
    fireEvent.click(screen.getByText('Add Task'));
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
```

---

## 3. Key Patterns & Middleware

| Middleware / Pattern      | Mục đích                                               |
| ------------------------- | ------------------------------------------------------ |
| **persist**               | Lưu auth token, theme → reload không mất               |
| **subscribeWithSelector** | Render chỉ component quan tâm, tránh re-render thừa    |
| **combine**               | Tách slice nhưng merge thành root store                |
| **asyncAction**           | Quản lý async, cancel request cũ, tránh race condition |

---

## 4. Bài tập

**Level 1** – CRUD task đơn giản, không persist.
**Level 2** – Thêm persist cho theme + token.
**Level 3** – Thêm cancelable asyncAction + subscribeWithSelector để tối ưu render khi toggle task.

---

## 5. Common Pitfalls

* Không partialize persist → lưu quá nhiều state không cần, gây lỗi dữ liệu.
* Async không cancel → race condition, dữ liệu sai.
* Lạm dụng combine → re-render nhiều nếu không dùng selector.
* Thêm nhiều modal state vào root → spaghetti state.

---

## 6. Interview Questions

1. Khi nào dùng Zustand thay vì Redux?

   * Answer: Khi cần UI/local state nhẹ, ít boilerplate, hoặc kết hợp React Query.

2. partialize có tác dụng gì trong persist?

   * Answer: Chỉ lưu một phần state, tránh lưu state tạm thời, bảo mật.

3. asyncAction giúp gì trong enterprise app?

   * Answer: Cancel request cũ, tránh race condition, manage loading/error.

4. subscribeWithSelector khác gì so với subscribe thông thường?

   * Answer: Chỉ trigger render component khi state slice quan tâm thay đổi.

5. combine + slice: khi nào nên tách slice riêng, khi nào nên combine?

   * Answer: Tách slice khi module độc lập, combine khi cần root store dễ persist.

---

## 7. References

* Zustand Docs: [https://github.com/pmndrs/zustand](https://github.com/pmndrs/zustand)
* Middleware: persist, subscribeWithSelector, combine
* Async patterns: abortController, cancelable fetch

---

## 8. Cheatsheet & Patterns – Zustand Mastery (10 Days)

### 8.1 Store Cơ Bản
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

**Tips:**
- `set(state => ...)` → luôn lấy state cũ để tránh overwrite.
- `get()` → dùng khi cần state hiện tại, đặc biệt trong async/middleware.
- Selector → chỉ lấy phần state cần render, tránh re-render toàn component tree.

### 8.2 Selector & Re-render Tối Ưu
```ts
const count = useCounterStore(state => state.count); // ✅ chỉ render khi count thay đổi
```

- **subscribeWithSelector** → dùng khi muốn nhiều listener riêng lẻ, tránh render không cần thiết.
- **Tradeoff:** thêm middleware nhưng cải thiện performance lớn cho dashboard/enterprise app.

### 8.3 UI State Patterns
- Modal / Dialog
```ts
type UIStore = {
  showModal: boolean;
  openModal: () => void;
  closeModal: () => void;
};
```

- Theme / Preferences
```ts
type ThemeStore = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};
```

**Tips Enterprise:**
- Tách riêng modal, theme, UI state → dễ combine, dễ maintain, avoid prop drilling.

### 8.4 Middleware Patterns
| Middleware            | Purpose                                 | Example                                  |
| --------------------- | --------------------------------------- | ---------------------------------------- |
| persist               | Lưu state qua reload                    | `persist(store, { name: 'auth' })`       |
| subscribeWithSelector | Lắng nghe state cụ thể, tránh re-render | `useStore.subscribe(selector, callback)` |
| devtools              | Debug dễ dàng                           | `devtools(store)`                        |
| custom middleware     | Xử lý async/cancel, logging             | `asyncAction`, `withAbortAndRace`        |

**Custom AsyncAction Example:**
```ts
const asyncAction = (fn) => async (set, get) => {
  const controller = new AbortController();
  get()._controller?.abort(); // cancel old request
  set({ _controller: controller });
  const data = await fn(controller.signal);
  set({ data });
};
```

### 8.5 Combine Store / Slice
```ts
export const useStore = create<AuthSlice & CartSlice>((...a) => ({
  ...createAuthSlice(...a),
  ...createCartSlice(...a),
}));
```

- **Benefit:** maintainable, team dễ collaborate, dễ test từng slice.
- **Tradeoff:** phải thiết kế slice rõ ràng, tránh tight coupling.

### 8.6 Async / API Pattern
- Async + abortable requests → tránh race condition
```ts
const run = asyncAction(async (signal) => fetch('/api/data', { signal }).then(r => r.json()));
await run(set, get);
```

- Khi kết hợp React Query: Zustand chỉ quản lý UI/local state, React Query quản lý server state + cache.

### 8.7 Persist Best Practices
- **Slices persist**: auth token, theme, user preferences
- **Never persist sensitive data in localStorage without encoding** → prefer HttpOnly cookies.
- **Version state** → migrate khi thay đổi store.

### 8.8 Common Pitfalls
- Re-render toàn tree → dùng selector / subscribeWithSelector
- State overwrite → luôn dùng `set(state => ...)`
- Race condition → luôn dùng asyncAction + AbortController
- Persist leak → encode token hoặc dùng cookie HttpOnly
- Prop drilling → combine slice + UI store

### 8.9 Enterprise Checklist – Before Merge
1. ✅ Lint code + Prettier applied
2. ✅ TypeScript types accurate, avoid `any`
3. ✅ Store: selectors + subscribeWithSelector dùng đúng
4. ✅ Async actions: abort old requests, handle error/loading
5. ✅ Persist: chỉ lưu cần thiết, encode token
6. ✅ Tests: unit test for store & components
7. ✅ DevTools: enabled for debugging (remove for prod)
8. ✅ Modular slice: combineSlice correct, single responsibility
9. ✅ Code review: check re-render / performance
10. ✅ Documentation: README / inline comments for complex middleware

### 8.10 References
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [React Query Docs](https://react-query.tanstack.com/)
- [Enterprise React Patterns](https://kentcdodds.com/blog)
- [Async + AbortController patterns](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)



---

📌 [<< Ngày 09](./Day09.md) | [Ngày 10 >>](./Day10.md)