# 🟩 Day 11 – Unit Testing (TypeScript, Senior/Enterprise Edition)

## 🎯 Mục tiêu bài học

- **Cơ bản (giữ nguyên)**:
  - Viết **unit tests** cho pure functions và React components với **Jest** và **React Testing Library**.
  - Sử dụng `describe`, `it/test`, `expect`, và mock functions (`jest.fn()`).
  - Áp dụng **snapshot testing** với `toMatchSnapshot()`.
  - Đảm bảo type-safe với TypeScript (`jest.MockedFunction`, `Partial<T>`).
- **Nâng cao (bổ sung)**:
  - Viết unit tests cho **custom hooks** (`useFetch`, `useDebounce`) và **accessible components** (Day 10).
  - Test **complex components** với `Suspense` (Day 07), `concurrent rendering` (Day 08), `ErrorBoundary` (Day 09), và **virtualization** (Day 06).
  - Mock **API calls** với `msw` hoặc `jest-fetch-mock` để test data fetching.
  - Test **accessibility** (ARIA roles, keyboard navigation, focus management).
  - Đảm bảo **test coverage >80%** với Jest coverage reports.
  - Setup **CI/CD** với GitHub Actions để tự động build/test và báo cáo coverage.
  - Tích hợp **Sentry** để log test failures trong CI/CD pipeline.
  - Tối ưu performance với **React Profiler** và **Web Vitals** logging.
- **Thực hành**: Xây dựng dashboard với unit tests đầy đủ cho pure functions, custom hooks, và components, tích hợp API, virtualization, concurrent rendering, và accessibility.

---

## 📚 Nội dung chi tiết (Cơ bản + Nâng cao)

### 1️⃣ Unit Testing cho Pure Functions (Cơ bản + Nâng cao)
- **Cơ bản**: Test pure functions như `add` và `multiply`.
- **Nâng cao**: Test complex pure functions (e.g., filter logic) và mock dependencies.

**Pure functions**:
```tsx
// utils/math.ts
export const add = (a: number, b: number): number => a + b;
export const multiply = (a: number, b: number): number => a * b;
export const filterTodos = (todos: string[], query: string): string[] =>
  todos.filter(todo => todo.toLowerCase().includes(query.toLowerCase()));
```

**Unit test (math.test.ts)**:
```tsx
import { add, multiply, filterTodos } from "./utils/math";

describe("Math utilities", () => {
  test("add two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  test("multiply two numbers", () => {
    expect(multiply(4, 5)).toBe(20);
  });

  test("filter todos by query", () => {
    const todos = ["Buy milk", "Walk dog", "Clean house"];
    expect(filterTodos(todos, "milk")).toEqual(["Buy milk"]);
    expect(filterTodos(todos, "")).toEqual(todos);
  });
});
```

### 2️⃣ Unit Testing cho React Components và Custom Hooks (Cơ bản + Nâng cao)
- **Cơ bản**: Test React component như `Counter` với render và click events.
- **Nâng cao**: Test custom hooks (`useFetch`), accessible components, và complex dashboard với virtualization, Suspense, concurrent rendering, và ErrorBoundary.

**Counter component**:
```tsx
// components/Counter.tsx
import { FC, useState } from "react";

interface CounterProps {
  initial?: number;
}

export const Counter: FC<CounterProps> = ({ initial = 0 }) => {
  const [count, setCount] = useState(initial);
  return (
    <div role="region" aria-label="Counter">
      <span data-testid="count">{count}</span>
      <button onClick={() => setCount(count + 1)} aria-label="Increment count">
        Increment
      </button>
    </div>
  );
};
```

**Counter test**:
```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Counter } from "./components/Counter";

describe("Counter component", () => {
  test("renders initial count", () => {
    render(<Counter initial={10} />);
    expect(screen.getByTestId("count")).toHaveTextContent("10");
  });

  test("increments count on click", () => {
    render(<Counter initial={0} />);
    fireEvent.click(screen.getByLabelText("Increment count"));
    expect(screen.getByTestId("count")).toHaveTextContent("1");
  });

  test("matches snapshot", () => {
    const { container } = render(<Counter initial={5} />);
    expect(container).toMatchSnapshot();
  });
});
```

**Custom hook (useFetch)**:
```tsx
// hooks/useFetch.ts
import { useQuery } from "@tanstack/react-query";

interface FetchResponse<T> {
  data: T;
  total: number;
}

export const useFetch = <T>(url: string, queryKey: (string | number)[]) => {
  return useQuery<FetchResponse<T>>({
    queryKey,
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network error");
      return response.json();
    },
  });
};
```

**useFetch test**:
```tsx
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFetch } from "./hooks/useFetch";

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useFetch hook", () => {
  beforeEach(() => {
    jest.spyOn(global, "fetch").mockImplementation(
      () =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [{ id: 1, title: "Todo 1" }], total: 200 }),
        }) as any
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetches data successfully", async () => {
    const { result } = renderHook(() => useFetch("https://api.example.com/todos", ["todos"]), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ data: [{ id: 1, title: "Todo 1" }], total: 200 });
  });

  test("handles fetch error", async () => {
    jest.spyOn(global, "fetch").mockImplementation(() => Promise.reject(new Error("Network error")));

    const { result } = renderHook(() => useFetch("https://api.example.com/todos", ["todos"]), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("Network error");
  });
});
```

### 3️⃣ Unit Testing cho Enterprise Dashboard (Nâng cao)
- **Cơ bản**: Test pure functions và simple components.
- **Nâng cao**: Test dashboard với API fetching, virtualization, Suspense, concurrent rendering, ErrorBoundary, và accessibility.

**Dashboard component**:
```tsx
import { FC, Suspense, useState, useCallback, useEffect, useTransition, useDeferredValue, Profiler, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import InfiniteLoader from "react-window-infinite-loader";
import { VariableSizeList as List } from "react-window";
import { useFetch, useDebounce } from "./hooks";
import * as Sentry from "@sentry/react";
import reportWebVitals from "./reportWebVitals";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "./ErrorBoundary";
import { AccessibleButton } from "./AccessibleButton";
import { Modal } from "./Modal";

const LazyRow = dynamic(() => import("./LazyRow"), { ssr: false });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
      cacheTime: 5 * 60 * 1000,
      staleTime: 30 * 1000,
    },
  },
});

interface DataItem {
  id: number;
  title: string;
}

interface FetchResponse {
  data: DataItem[];
  total: number;
}

const AccessibleDashboard: FC = () => {
  const [filter, setFilter] = useState<string>("");
  const debouncedFilter = useDebounce(filter, 200);
  const deferredFilter = useDeferredValue(debouncedFilter);
  const [isPending, startTransition] = useTransition();
  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const listRef = useRef<any>(null);
  const scrollPosition = useRef<number>(0);

  const { data, isLoading, error } = useFetch<FetchResponse>(
    `https://jsonplaceholder.typicode.com/todos?_page=${page}&_limit=20${deferredFilter ? `&title_like=${deferredFilter}` : ""}`,
    ["todos", page, deferredFilter]
  );

  useEffect(() => {
    if (data?.data) {
      setAllItems(prev => [...prev, ...data.data]);
    }
  }, [data]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo(scrollPosition.current);
    }
  }, [allItems]);

  const filteredItems = useMemo(() => {
    try {
      return allItems;
    } catch (err) {
      Sentry.captureException(err);
      return [];
    }
  }, [allItems]);

  const loadMoreItems = useCallback(
    (startIndex: number, stopIndex: number) => {
      if (stopIndex >= allItems.length && !isLoading) {
        startTransition(() => {
          setPage(prev => prev + 1);
        });
      }
      return Promise.resolve();
    },
    [allItems.length, isLoading]
  );

  const isItemLoaded = useCallback((index: number) => index < filteredItems.length, [filteredItems.length]);

  const getItemSize = useCallback((index: number) => {
    return filteredItems[index]?.title.length * 2 || 50;
  }, [filteredItems]);

  const onRender = useCallback(
    (id: string, phase: string, actualDuration: number) => {
      Sentry.captureMessage(`Profiler: ${id} ${phase} took ${actualDuration}ms`, "info");
    },
    []
  );

  const onScroll = useCallback(({ scrollOffset }: { scrollOffset: number }) => {
    scrollPosition.current = scrollOffset;
    Sentry.captureMessage(`Scroll position: ${scrollOffset}`, "info");
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(err => Sentry.captureException(err));
    }
  }, []);

  reportWebVitals((metric) => {
    Sentry.captureMessage(`Web Vital: ${metric.name} = ${metric.value}`, "info");
  });

  if (error) throw new Error(error.message); // Để ErrorBoundary xử lý

  return (
    <Suspense fallback={<p role="status" aria-live="polite">Loading dashboard...</p>}>
      <Profiler id="AccessibleDashboard" onRender={onRender}>
        <main role="main" aria-label="Accessible virtualized dashboard">
          <header>
            <h1>Accessible Dashboard</h1>
            <AccessibleButton label="Open Filter Modal" onClick={() => setIsModalOpen(true)} ariaControls="filter-modal" />
          </header>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Filter Todos">
            <form onSubmit={e => e.preventDefault()}>
              <label htmlFor="filter-input" className="block mb-2">
                Filter Todos
              </label>
              <input
                id="filter-input"
                value={filter}
                onChange={e => startTransition(() => setFilter(e.target.value))}
                placeholder="Type to filter..."
                aria-label="Filter todos"
                className="w-full p-2 border rounded"
              />
              <AccessibleButton label="Apply Filter" onClick={() => setIsModalOpen(false)} />
            </form>
          </Modal>
          <section aria-live="polite">
            <p>Items rendered: {filteredItems.length}</p>
            {isPending && <p role="status">Updating list...</p>}
            <Suspense fallback={<p role="status" aria-live="polite">Loading list...</p>}>
              <InfiniteLoader
                isItemLoaded={isItemLoaded}
                itemCount={data?.total || filteredItems.length + 1}
                loadMoreItems={loadMoreItems}
              >
                {({ onItemsRendered, ref }) => (
                  <List
                    ref={(list) => {
                      ref(list);
                      listRef.current = list;
                    }}
                    onItemsRendered={onItemsRendered}
                    height={500}
                    width={300}
                    itemCount={filteredItems.length}
                    itemSize={getItemSize}
                    itemData={filteredItems.map(item => item.title)}
                    overscanCount={10}
                    onScroll={onScroll}
                    role="grid"
                    aria-label="Todo list"
                  >
                    {LazyRow}
                  </List>
                )}
              </InfiniteLoader>
            </Suspense>
          </section>
        </main>
      </Profiler>
    </Suspense>
  );
};

export const DashboardChallenge: FC = () => (
  <ErrorBoundary
    fallback={
      <div role="alert" aria-live="assertive">
        <h2>Error occurred</h2>
        <AccessibleButton label="Reload" onClick={() => window.location.reload()} />
      </div>
    }
  >
    <AccessibleDashboard />
  </ErrorBoundary>
);

export const App: FC = () => (
  <QueryClientProvider client={queryClient}>
    <DashboardChallenge />
  </QueryClientProvider>
);
```

**LazyRow.tsx**:
```tsx
import { FC } from "react";
import { ListChildComponentProps } from "react-window";
import * as Sentry from "@sentry/react";

type RowProps = { index: number; style: React.CSSProperties; data: string[] };

export const LazyRow: FC<RowProps> = React.memo(({ index, style, data }) => {
  console.log(`Rendering row ${index}`);
  try {
    if (index === 5) throw new Error("Simulated row error"); // Simulate error
    return (
      <div
        role="row"
        aria-label={`Todo item ${index + 1}`}
        style={{ ...style, padding: 10, borderBottom: "1px solid #ccc" }}
        tabIndex={0}
        onKeyDown={e => e.key === "Enter" && console.log(`Row ${index} clicked`)}
      >
        {data[index]}
      </div>
    );
  } catch (err) {
    Sentry.captureException(err);
    throw err;
  }
});

export default LazyRow;
```

**ErrorBoundary.tsx**:
```tsx
import React, { ReactNode } from "react";
import * as Sentry from "@sentry/react";
import { AccessibleButton } from "./AccessibleButton";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div role="alert" aria-live="assertive">
            <h2>Something went wrong.</h2>
            <p>{this.state.error?.message}</p>
            <AccessibleButton label="Reload" onClick={() => window.location.reload()} />
          </div>
        )
      );
    }
    return this.props.children;
  }
}
```

**AccessibleButton.tsx**:
```tsx
import { FC } from "react";

interface AccessibleButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  ariaControls?: string;
}

export const AccessibleButton: FC<AccessibleButtonProps> = ({ label, onClick, disabled, ariaControls }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!disabled) onClick();
    }
  };

  return (
    <button
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={label}
      aria-controls={ariaControls}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-400"
    >
      {label}
    </button>
  );
};
```

**Modal.tsx**:
```tsx
import { FC, useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      firstFocusableRef.current = modalRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusableRef.current?.focus();
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      ref={modalRef}
    >
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 id="modal-title" className="text-xl font-bold mb-4">
          {title}
        </h2>
        {children}
        <AccessibleButton label="Close" onClick={onClose} />
      </div>
    </div>
  );
};
```

**Unit test (dashboard.test.tsx)**:
```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Sentry from "@sentry/react";
import { App } from "./App";

describe("AccessibleDashboard", () => {
  let consoleLogSpy: jest.SpyInstance;
  let sentrySpy: jest.SpyInstance;
  let queryClient: QueryClient;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    sentrySpy = jest.spyOn(Sentry, "captureException").mockImplementation();
    queryClient = new QueryClient();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    sentrySpy.mockRestore();
    jest.clearAllMocks();
  });

  test("renders Suspense fallback", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );
    expect(screen.getByRole("status")).toHaveTextContent("Loading dashboard...");
  });

  test("renders API data with virtualization", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [{ id: 1, title: "Todo 1" }], total: 200 }),
      })
    ) as jest.Mock;

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText("Todo 1")).toBeInTheDocument());
    expect(consoleLogSpy).toHaveBeenCalledWith("Rendering row 0");
  });

  test("catches API error in ErrorBoundary", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("API Error"))) as jest.Mock;

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Error occurred"));
    expect(sentrySpy).toHaveBeenCalled();
  });

  test("catches component error in ErrorBoundary", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: Array(6).fill({ id: 1, title: "Todo 1" }), total: 200 }),
      })
    ) as jest.Mock;

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Error occurred"));
    expect(sentrySpy).toHaveBeenCalled();
  });

  test("supports concurrent filtering", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [{ id: 1, title: "Todo 1" }], total: 200 }),
      })
    ) as jest.Mock;

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    const button = await screen.findByLabelText("Open Filter Modal");
    fireEvent.click(button);
    const input = screen.getByLabelText("Filter todos");
    fireEvent.change(input, { target: { value: "Todo" } });
    expect(screen.getByRole("status")).toHaveTextContent("Updating list...");
    await waitFor(() => expect(screen.getByText("Todo 1")).toBeInTheDocument());
  });

  test("supports infinite scrolling", async () => {
    global.fetch = jest.fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [{ id: 1, title: "Todo 1" }], total: 200 }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [{ id: 2, title: "Todo 2" }], total: 200 }),
        })
      ) as jest.Mock;

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText("Todo 1")).toBeInTheDocument());
    fireEvent.scroll(screen.getByRole("grid"), { target: { scrollTop: 1000 } });
    await waitFor(() => expect(screen.getByText("Todo 2")).toBeInTheDocument());
  });

  test("supports keyboard navigation in list", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [{ id: 1, title: "Todo 1" }], total: 200 }),
      })
    ) as jest.Mock;

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    const row = await screen.findByText("Todo 1");
    fireEvent.keyDown(row, { key: "Enter" });
    expect(consoleLogSpy).toHaveBeenCalledWith("Row 0 clicked");
  });

  test("supports modal accessibility", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [{ id: 1, title: "Todo 1" }], total: 200 }),
      })
    ) as jest.Mock;

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    const button = await screen.findByLabelText("Open Filter Modal");
    fireEvent.click(button);
    const modalInput = await screen.findByLabelText("Filter todos");
    expect(modalInput).toHaveFocus();

    fireEvent.keyDown(modalInput, { key: "Escape" });
    await waitFor(() => expect(screen.queryByLabelText("Filter todos")).not.toBeInTheDocument());
  });

  test("supports focus trapping in modal", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [{ id: 1, title: "Todo 1" }], total: 200 }),
      })
    ) as jest.Mock;

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    const button = await screen.findByLabelText("Open Filter Modal");
    fireEvent.click(button);
    const modalInput = await screen.findByLabelText("Filter todos");
    const modalButton = screen.getByLabelText("Apply Filter");

    fireEvent.keyDown(modalButton, { key: "Tab" });
    expect(modalInput).toHaveFocus();
  });
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
      - name: Upload coverage
        uses: actions/upload-artifact@v3
        with:
          name: coverage-report
          path: coverage/
      - name: Notify Sentry on test failure
        if: failure()
        run: |
          curl -X POST https://sentry.io/api/0/projects/your-org/your-project/events/ \
          -H "Authorization: Bearer ${{ secrets.SENTRY_AUTH_TOKEN }}" \
          -H "Content-Type: application/json" \
          -d '{"message":"Test suite failed in CI/CD pipeline","level":"error"}'
```

**Jest config (jest.config.js)**:
```javascript
module.exports = {
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  testEnvironment: "jsdom",
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    "^react-window$": "<rootDir>/__mocks__/react-window.js",
    "^react-window-infinite-loader$": "<rootDir>/__mocks__/react-window-infinite-loader.js",
  },
};
```

**Mock react-window**:
```javascript
// __mocks__/react-window.js
export const VariableSizeList = ({ children, itemCount, itemData }) => (
  <ul>
    {Array.from({ length: itemCount }, (_, index) => children({ index, style: {}, data: itemData }))}
  </ul>
);
```

**Mock react-window-infinite-loader**:
```javascript
// __mocks__/react-window-infinite-loader.js
export default ({ children }) => children({ onItemsRendered: jest.fn(), ref: {} });
```

---

## 🛠️ Bài tập thực hành (Level 1 → 3, với giải đầy đủ)

### Level 1: Unit Test cho Utility Functions
**Yêu cầu**: Viết unit test cho 2 hàm utility (`add`, `multiply`) với Jest + TypeScript.

**Code giải**:
```tsx
// utils/math.ts
export const add = (a: number, b: number): number => a + b;
export const multiply = (a: number, b: number): number => a * b;

// __tests__/math.test.ts
import { add, multiply } from "../utils/math";

describe("Math utilities", () => {
  test("add two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  test("multiply two numbers", () => {
    expect(multiply(4, 5)).toBe(20);
  });
});
```

**Hướng dẫn**: Chạy `npm test` để kiểm tra, đảm bảo coverage 100% cho pure functions.

### Level 2: Unit Test cho Counter Component
**Yêu cầu**: Viết test cho component `Counter` (render, click event, initial state).

**Code giải**:
```tsx
// components/Counter.tsx
import { FC, useState } from "react";

interface CounterProps {
  initial?: number;
}

export const Counter: FC<CounterProps> = ({ initial = 0 }) => {
  const [count, setCount] = useState(initial);
  return (
    <div role="region" aria-label="Counter">
      <span data-testid="count">{count}</span>
      <button onClick={() => setCount(count + 1)} aria-label="Increment count">
        Increment
      </button>
    </div>
  );
};

// __tests__/Counter.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Counter } from "../components/Counter";

describe("Counter component", () => {
  test("renders initial count", () => {
    render(<Counter initial={10} />);
    expect(screen.getByTestId("count")).toHaveTextContent("10");
  });

  test("increments count on click", () => {
    render(<Counter initial={0} />);
    fireEvent.click(screen.getByLabelText("Increment count"));
    expect(screen.getByTestId("count")).toHaveTextContent("1");
  });

  test("matches snapshot", () => {
    const { container } = render(<Counter initial={5} />);
    expect(container).toMatchSnapshot();
  });
});
```

**Hướng dẫn**: Chạy `npm test` để kiểm tra render và click events, đảm bảo snapshot hợp lệ.

### Level 3: Mini Project – Test Components và Custom Hook
**Yêu cầu**: Viết unit tests cho 2-3 components và 1 custom hook, full coverage >80%, mock API call.

**Code giải**:
```tsx
// components/TodoList.tsx
import { FC, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { AccessibleButton } from "../AccessibleButton";

interface DataItem {
  id: number;
  title: string;
}

interface FetchResponse {
  data: DataItem[];
  total: number;
}

export const TodoList: FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useFetch<FetchResponse>(
    `https://jsonplaceholder.typicode.com/todos?_page=${page}&_limit=10`,
    ["todos", page]
  );

  if (isLoading) return <p role="status" aria-live="polite">Loading...</p>;
  if (error) return <p role="alert">{error.message}</p>;

  return (
    <div role="region" aria-label="Todo list">
      <ul role="list">
        {data?.data.map(item => (
          <li key={item.id} role="listitem" aria-label={`Todo ${item.id}`}>
            {item.title}
          </li>
        ))}
      </ul>
      <AccessibleButton label="Load More" onClick={() => setPage(page + 1)} />
    </div>
  );
};

// __tests__/TodoList.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TodoList } from "../components/TodoList";

const queryClient = new QueryClient();

describe("TodoList component", () => {
  beforeEach(() => {
    jest.spyOn(global, "fetch").mockImplementation(
      () =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [{ id: 1, title: "Todo 1" }], total: 200 }),
        }) as any
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TodoList />
      </QueryClientProvider>
    );
    expect(screen.getByRole("status")).toHaveTextContent("Loading...");
  });

  test("renders todo list", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TodoList />
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText("Todo 1")).toBeInTheDocument());
  });

  test("handles error state", async () => {
    jest.spyOn(global, "fetch").mockImplementation(() => Promise.reject(new Error("API Error")));

    render(
      <QueryClientProvider client={queryClient}>
        <TodoList />
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("API Error"));
  });

  test("loads more todos on click", async () => {
    jest.spyOn(global, "fetch")
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [{ id: 1, title: "Todo 1" }], total: 200 }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [{ id: 2, title: "Todo 2" }], total: 200 }),
        })
      );

    render(
      <QueryClientProvider client={queryClient}>
        <TodoList />
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText("Todo 1")).toBeInTheDocument());
    fireEvent.click(screen.getByLabelText("Load More"));
    await waitFor(() => expect(screen.getByText("Todo 2")).toBeInTheDocument());
  });
});
```

---

## 🧩 Code Challenge: Enterprise Dashboard Unit Testing

**Yêu cầu**:
- **Cơ bản**: Viết unit tests cho pure functions, custom hooks, và simple components.
- **Nâng cao**:
  - Test dashboard với API pagination (JSONPlaceholder).
  - Test virtualization (`react-window`) và accessibility (Day 10).
  - Test Suspense (Day 07), concurrent rendering (Day 08), và ErrorBoundary (Day 09).
  - Mock API calls với `jest-fetch-mock`.
  - Đảm bảo coverage >80%.
  - Tích hợp Sentry để log test failures.
  - Setup CI/CD với GitHub Actions.

**Code mẫu**: Đã cung cấp ở phần nâng cao (AccessibleDashboard và dashboard.test.tsx).

**sw.js (cache API và lazy chunks)**:
```javascript
const CACHE_NAME = "dashboard-cache-v9";
const urlsToCache = ["/", "/index.html"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (url.pathname.includes("jsonplaceholder.typicode.com") || url.pathname.includes(".chunk.js")) {
    event.respondWith(
      caches.open(`${CACHE_NAME}-dynamic`).then(cache =>
        cache.match(event.request).then(cachedResponse => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        })
      )
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => cachedResponse || fetch(event.request))
    );
  }
});
```

---

## 🚀 Lưu ý production-ready

- **TypeScript**: Strict mode, type-safe tests (`jest.MockedFunction`, `Partial<T>`).
- **Accessibility**: Test ARIA roles, keyboard navigation, và focus management.
- **Performance**: Virtualization, lazy loading, concurrent rendering, debounce filter, API caching.
- **Testing**: Coverage >80%, test pure functions, hooks, components, virtualization, API, và accessibility.
- **PWA**: Cache API data và lazy chunks với stale-while-revalidate.
- **Monitoring**: Profiler, Web Vitals, và error logging gửi đến Sentry.


---
📌 [<< Ngày 10](./Day10.md) | [Ngày 12 >>](./Day12.md)