# 🟩 Day 03 – Context + useReducer (TypeScript, Senior/Enterprise Edition)

## 🎯 Mục tiêu bài học

- **Cơ bản (giữ nguyên)**:
  - Hiểu và áp dụng **Context API** để chia sẻ state global, tránh prop-drilling.
  - Sử dụng **useReducer** để quản lý state phức tạp (multi-field updates).
  - Tạo provider pattern type-safe và ví dụ Todo App đơn giản.
- **Nâng cao (bổ sung)**:
  - Tối ưu re-render với `React.memo`, `useMemo`, và chia nhỏ context để tránh render toàn app.
  - Thêm **error handling** (Sentry logging), **accessibility** (ARIA roles, keyboard navigation), và **persistence** (localStorage/IndexedDB).
  - Viết **unit tests** cho reducer, context, và components với Jest + React Testing Library.
  - Setup **CI/CD** cơ bản với GitHub Actions để build/test.
  - Tích hợp **Web Vitals** để monitor performance và **PWA** cho offline support.
  - Áp dụng trong mini-project production-ready với scalability (xử lý danh sách lớn, lazy loading, virtualization preview).
- **Thực hành**: Xây dựng Todo App với Context + useReducer, tích hợp các tính năng enterprise.

---

## 📚 Nội dung chi tiết (Cơ bản + Nâng cao)

### 1️⃣ Context + useReducer (Cơ bản + Nâng cao)
- **Cơ bản**: Context để chia sẻ state global, useReducer để quản lý state phức tạp.
- **Nâng cao**: 
  - Chia nhỏ context để giảm re-render (e.g., separate state và dispatch context).
  - Tích hợp persistence với localStorage/IndexedDB.
  - Thêm error handling và logging với Sentry.
  - Đảm bảo accessibility (ARIA roles, keyboard navigation).
  - Unit test reducer và context với Jest.

**Code cơ bản (giữ nguyên từ bài giảng)**:
```tsx
// types.ts
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export type Action =
  | { type: "ADD"; payload: string }
  | { type: "TOGGLE"; payload: number }
  | { type: "REMOVE"; payload: number };
```

```tsx
// todoReducer.ts
export const todoReducer = (state: Todo[], action: Action): Todo[] => {
  switch (action.type) {
    case "ADD":
      return [
        ...state,
        { id: Date.now(), text: action.payload, completed: false }
      ];
    case "TOGGLE":
      return state.map(todo =>
        todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
      );
    case "REMOVE":
      return state.filter(todo => todo.id !== action.payload);
    default:
      return state;
  }
};
```

```tsx
// TodoContext.tsx
import React, { createContext, useReducer, useContext, ReactNode } from "react";
import { todoReducer, Todo, Action } from "./types";

interface TodoContextProps {
  todos: Todo[];
  dispatch: React.Dispatch<Action>;
}

const TodoContext = createContext<TodoContextProps | undefined>(undefined);

export const TodoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [todos, dispatch] = useReducer(todoReducer, []);
  return (
    <TodoContext.Provider value={{ todos, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = (): TodoContextProps => {
  const context = useContext(TodoContext);
  if (!context) throw new Error("useTodos must be used within a TodoProvider");
  return context;
};
```

**Upgrade nâng cao**: Chia nhỏ context, thêm persistence, error handling, và accessibility.
```tsx
// TodoContext.tsx (Enterprise)
import React, { createContext, useReducer, useContext, ReactNode, useEffect } from "react";
import * as Sentry from "@sentry/react";
import { todoReducer, Todo, Action } from "./types";

interface TodoStateContextProps {
  todos: Todo[];
}

interface TodoDispatchContextProps {
  dispatch: React.Dispatch<Action>;
}

const TodoStateContext = createContext<TodoStateContextProps | undefined>(undefined);
const TodoDispatchContext = createContext<TodoDispatchContextProps | undefined>(undefined);

export const TodoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [todos, dispatch] = useReducer(todoReducer, [], () => {
    try {
      const saved = localStorage.getItem("todos");
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      Sentry.captureException(err);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("todos", JSON.stringify(todos));
    } catch (err) {
      Sentry.captureException(err);
    }
  }, [todos]);

  return (
    <TodoStateContext.Provider value={{ todos }}>
      <TodoDispatchContext.Provider value={{ dispatch }}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  );
};

export const useTodoState = (): TodoStateContextProps => {
  const context = useContext(TodoStateContext);
  if (!context) throw new Error("useTodoState must be used within a TodoProvider");
  return context;
};

export const useTodoDispatch = (): TodoDispatchContextProps => {
  const context = useContext(TodoDispatchContext);
  if (!context) throw new Error("useTodoDispatch must be used within a TodoProvider");
  return context;
};
```

**Usage nâng cao**:
```tsx
// TodoApp.tsx
import { FC, useState, useMemo, useCallback } from "react";
import { useTodoState, useTodoDispatch } from "./TodoContext";
import { Todo } from "./types";

const TodoItem: FC<{ todo: Todo }> = React.memo(({ todo }) => {
  const { dispatch } = useTodoDispatch();

  const toggle = useCallback(() => dispatch({ type: "TOGGLE", payload: todo.id }), [dispatch, todo.id]);
  const remove = useCallback(() => dispatch({ type: "REMOVE", payload: todo.id }), [dispatch, todo.id]);

  return (
    <li role="listitem" aria-label={`Todo: ${todo.text}`}>
      <span
        style={{ textDecoration: todo.completed ? "line-through" : "none", cursor: "pointer" }}
        onClick={toggle}
        onKeyDown={e => e.key === "Enter" && toggle()}
        tabIndex={0}
      >
        {todo.text}
      </span>
      <button onClick={remove} aria-label={`Remove ${todo.text}`}>
        Delete
      </button>
    </li>
  );
});

export const TodoApp: FC = () => {
  const { todos } = useTodoState();
  const { dispatch } = useTodoDispatch();
  const [text, setText] = useState<string>("");

  const addTodo = useCallback(() => {
    if (!text.trim()) {
      alert("Todo cannot be empty");
      return;
    }
    dispatch({ type: "ADD", payload: text });
    setText("");
  }, [text, dispatch]);

  // Memoize sorted todos để tránh re-render
  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
  }, [todos]);

  return (
    <div role="region" aria-label="Todo application">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="New todo"
        aria-label="Add new todo"
      />
      <button onClick={addTodo} aria-label="Add todo">
        Add
      </button>
      <ul role="list">
        {sortedTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};
```

**Nâng cấp enterprise**:
- **Persistence**: Lưu todos vào localStorage với error handling.
- **Accessibility**: Thêm ARIA roles (`role="listitem"`, `aria-label`), và hỗ trợ keyboard navigation (Enter để toggle).
- **Performance**: Sử dụng `React.memo` và `useMemo` để tối ưu re-render, đặc biệt với danh sách lớn.
- **Error handling**: Log errors với Sentry khi lưu/đọc localStorage.

### 2️⃣ Tối ưu Re-render (Cơ bản + Nâng cao)
- **Cơ bản**: Sử dụng `React.memo` cho `TodoItem` và tách dispatch/state context.
- **Nâng cao**: 
  - Sử dụng `useMemo` để memoize danh sách todos đã sắp xếp.
  - Chia nhỏ context (state vs dispatch) để chỉ re-render component cần thiết.
  - Monitor performance với Web Vitals (CLS, LCP) để phát hiện layout shift.

**Ví dụ Web Vitals**:
```tsx
// reportWebVitals.ts
export default function reportWebVitals(onPerfEntry?: (metric: any) => void) {
  if (onPerfEntry) {
    import("web-vitals").then(({ getCLS, getFID, getLCP }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getLCP(onPerfEntry);
    });
  }
}
```

```tsx
// index.tsx
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { TodoProvider } from "./TodoContext";
import { TodoApp } from "./TodoApp";
import reportWebVitals from "./reportWebVitals";

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(
  <StrictMode>
    <TodoProvider>
      <TodoApp />
    </TodoProvider>
  </StrictMode>
);

reportWebVitals(console.log); // Log performance metrics
```

### 3️⃣ Testing và CI/CD (Nâng cao)
- **Unit tests**: Test reducer, context, và components.
- **CI/CD**: GitHub Actions để build/test tự động.

**Unit test (todo.test.tsx)**:
```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { TodoProvider, useTodoState, useTodoDispatch } from "./TodoContext";
import { TodoApp, todoReducer } from "./TodoApp";
import { Todo, Action } from "./types";

test("todoReducer handles ADD action", () => {
  const initialState: Todo[] = [];
  const action: Action = { type: "ADD", payload: "Test Todo" };
  const newState = todoReducer(initialState, action);
  expect(newState).toHaveLength(1);
  expect(newState[0].text).toBe("Test Todo");
});

test("renders TodoApp and adds todo", () => {
  render(
    <TodoProvider>
      <TodoApp />
    </TodoProvider>
  );

  const input = screen.getByLabelText("Add new todo");
  const button = screen.getByLabelText("Add todo");

  fireEvent.change(input, { target: { value: "Test Todo" } });
  fireEvent.click(button);

  expect(screen.getByText("Test Todo")).toBeInTheDocument();
});

test("useTodoState throws error outside provider", () => {
  const TestComponent = () => {
    useTodoState();
    return null;
  };
  expect(() => render(<TestComponent />)).toThrow("useTodoState must be used within a TodoProvider");
});
```

**CI/CD (`.github/workflows/ci.yml`)**:
```yaml
name: React CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test -- --coverage
```

---

## 🛠️ Bài tập thực hành (Level 1 → 3, với giải đầy đủ)

### Level 1: Counter với Context + useReducer
**Yêu cầu**: Tạo Context + useReducer cho counter (increment, decrement, reset).

**Code giải**:
```tsx
// counter.types.ts
export type CounterAction =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "RESET" };
```

```tsx
// counterReducer.ts
export const counterReducer = (state: number, action: CounterAction): number => {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    case "RESET":
      return 0;
    default:
      return state;
  }
};
```

```tsx
// CounterContext.tsx
import { createContext, useReducer, useContext, ReactNode } from "react";
import { counterReducer, CounterAction } from "./counterReducer";

interface CounterContextProps {
  count: number;
  dispatch: React.Dispatch<CounterAction>;
}

const CounterContext = createContext<CounterContextProps | undefined>(undefined);

export const CounterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [count, dispatch] = useReducer(counterReducer, 0);
  return (
    <CounterContext.Provider value={{ count, dispatch }}>
      {children}
    </CounterContext.Provider>
  );
};

export const useCounter = (): CounterContextProps => {
  const context = useContext(CounterContext);
  if (!context) throw new Error("useCounter must be used within a CounterProvider");
  return context;
};
```

```tsx
// CounterApp.tsx
import { FC } from "react";
import { useCounter } from "./CounterContext";

export const CounterApp: FC = () => {
  const { count, dispatch } = useCounter();

  return (
    <div role="region" aria-label="Counter application">
      <p>Count: {count}</p>
      <button onClick={() => dispatch({ type: "INCREMENT" })} aria-label="Increment count">
        +
      </button>
      <button onClick={() => dispatch({ type: "DECREMENT" })} aria-label="Decrement count">
        -
      </button>
      <button onClick={() => dispatch({ type: "RESET" })} aria-label="Reset count">
        Reset
      </button>
    </div>
  );
};
```

### Level 2: TodoApp đơn giản
**Yêu cầu**: Tạo TodoApp với Context + useReducer, hỗ trợ add, toggle, remove.

**Code giải**: Dùng code từ `TodoApp.tsx` ở trên, nhưng thêm validation và test.

**Test bổ sung**:
```tsx
test("toggles and removes todo", () => {
  render(
    <TodoProvider>
      <TodoApp />
    </TodoProvider>
  );

  const input = screen.getByLabelText("Add new todo");
  const addButton = screen.getByLabelText("Add todo");

  // Add
  fireEvent.change(input, { target: { value: "Test Todo" } });
  fireEvent.click(addButton);
  expect(screen.getByText("Test Todo")).toBeInTheDocument();

  // Toggle
  fireEvent.click(screen.getByText("Test Todo"));
  expect(screen.getByText("Test Todo")).toHaveStyle({ textDecoration: "line-through" });

  // Remove
  fireEvent.click(screen.getByLabelText("Remove Test Todo"));
  expect(screen.queryByText("Test Todo")).not.toBeInTheDocument();
});
```

### Level 3: Mini Project (Enterprise)
**Yêu cầu**: TodoApp với Context + useReducer, type-safe, React.memo, lazy load list >1000 items, tối ưu re-render.

**Code giải**:
```tsx
// ItemList.tsx (Lazy loaded)
import { FC, lazy } from "react";
import { Todo } from "./types";

export const TodoItem: FC<{ todo: Todo }> = React.memo(({ todo }) => {
  const { dispatch } = useTodoDispatch();

  const toggle = useCallback(() => dispatch({ type: "TOGGLE", payload: todo.id }), [dispatch, todo.id]);
  const remove = useCallback(() => dispatch({ type: "REMOVE", payload: todo.id }), [dispatch, todo.id]);

  return (
    <li role="listitem" aria-label={`Todo: ${todo.text}`}>
      <span
        style={{ textDecoration: todo.completed ? "line-through" : "none", cursor: "pointer" }}
        onClick={toggle}
        onKeyDown={e => e.key === "Enter" && toggle()}
        tabIndex={0}
      >
        {todo.text}
      </span>
      <button onClick={remove} aria-label={`Remove ${todo.text}`}>
        Delete
      </button>
    </li>
  );
});

export const ItemList = lazy(() => Promise.resolve({ default: ({ todos }: { todos: Todo[] }) => (
  <ul role="list">
    {todos.map(todo => (
      <TodoItem key={todo.id} todo={todo} />
    ))}
  </ul>
) }));
```

```tsx
// TodoAppEnterprise.tsx
import { FC, useState, useMemo, Suspense } from "react";
import { useTodoState, useTodoDispatch } from "./TodoContext";
import { ItemList } from "./ItemList";
import reportWebVitals from "./reportWebVitals";

// Fake large data
const initialTodos: Todo[] = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  text: `Todo ${i + 1}`,
  completed: false,
}));

export const TodoAppEnterprise: FC = () => {
  const { todos } = useTodoState();
  const { dispatch } = useTodoDispatch();
  const [text, setText] = useState<string>("");

  const addTodo = useCallback(() => {
    if (!text.trim()) {
      alert("Todo cannot be empty");
      return;
    }
    dispatch({ type: "ADD", payload: text });
    setText("");
  }, [text, dispatch]);

  // Memoize sorted todos
  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
  }, [todos]);

  reportWebVitals(console.log); // Monitor performance

  return (
    <div role="region" aria-label="Todo application">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="New todo"
        aria-label="Add new todo"
      />
      <button onClick={addTodo} aria-label="Add todo">
        Add
      </button>
      <Suspense fallback={<p role="status">Loading todos...</p>}>
        <ItemList todos={sortedTodos} />
      </Suspense>
    </div>
  );
};
```

---

## 🧩 Code Challenge: Enterprise Todo Dashboard

**Yêu cầu**:
- **Cơ bản**: Todo App với Context + useReducer, hỗ trợ add, toggle, remove.
- **Nâng cao**:
  - Lazy load danh sách với Suspense.
  - Tích hợp `useFetch` (React Query) để fetch todos từ API (JSONPlaceholder).
  - Virtualization với `react-window` cho danh sách lớn (>1000 items).
  - Error boundary và Sentry logging.
  - Accessibility: ARIA roles, keyboard navigation.
  - Unit tests cho reducer, context, và component.
  - PWA: Cache API data với service worker.

**Code mẫu**:
```tsx
// TodoDashboard.tsx
import { FC, useState, useMemo, Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFetch } from "./hooks/useFetch";
import { useTodoState, useTodoDispatch } from "./TodoContext";
import { Todo } from "./types";
import * as Sentry from "@sentry/react";
import { FixedSizeList as List } from "react-window";

const queryClient = new QueryClient();
const ItemList = lazy(() => import("./ItemList"));

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) {
    Sentry.captureException(error);
  }
  render() {
    return this.state.hasError ? <p role="alert">Error occurred</p> : this.props.children;
  }
}

export const TodoDashboard: FC = () => {
  const { todos } = useTodoState();
  const { dispatch } = useTodoDispatch();
  const [text, setText] = useState<string>("");
  const { data: apiTodos, isLoading, error } = useFetch<Todo[]>("https://jsonplaceholder.typicode.com/todos", "todos");

  const addTodo = useCallback(() => {
    if (!text.trim()) {
      alert("Todo cannot be empty");
      return;
    }
    dispatch({ type: "ADD", payload: text });
    setText("");
  }, [text, dispatch]);

  const allTodos = useMemo(() => [...(apiTodos ?? []), ...todos], [apiTodos, todos]);

  if (isLoading) return <p role="status">Loading...</p>;
  if (error) return <p role="alert">Error: {error.message}</p>;

  return (
    <ErrorBoundary>
      <div role="region" aria-label="Todo dashboard">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="New todo"
          aria-label="Add new todo"
        />
        <button onClick={addTodo} aria-label="Add todo">
          Add
        </button>
        <Suspense fallback={<p role="status">Loading todos...</p>}>
          <List
            height={400}
            itemCount={allTodos.length}
            itemSize={35}
            width={300}
          >
            {({ index, style }) => (
              <div style={style}>
                <TodoItem todo={allTodos[index]} />
              </div>
            )}
          </List>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export const App: FC = () => (
  <QueryClientProvider client={queryClient}>
    <TodoProvider>
      <TodoDashboard />
    </TodoProvider>
  </QueryClientProvider>
);
```

**Service Worker (sw.js)**:
```javascript
const CACHE_NAME = "todo-cache-v1";
const urlsToCache = ["/", "/index.html", "https://jsonplaceholder.typicode.com/todos"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
```

**Test bổ sung**:
```tsx
test("TodoDashboard fetches and renders todos", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ id: 1, title: "Test Todo", completed: false }]),
    })
  ) as jest.Mock;

  render(
    <QueryClientProvider client={queryClient}>
      <TodoProvider>
        <TodoDashboard />
      </TodoProvider>
    </QueryClientProvider>
  );

  await waitFor(() => expect(screen.getByText("Test Todo")).toBeInTheDocument());
});
```

---

## 🚀 Lưu ý production-ready

- **TypeScript**: Sử dụng strict mode (`"strict": true`) trong tsconfig.json.
- **Accessibility**: ARIA roles và keyboard navigation cho mọi component.
- **Performance**: Virtualization với `react-window` cho danh sách lớn.
- **Testing**: Coverage >80%, test cả reducer và component.
- **PWA**: Cache API và static assets cho offline support.

---
📌 [<< Ngày 02](./Day02.md) | [Ngày 04 >>](./Day04.md)