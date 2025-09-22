# 🟩 Day 09 – Error Boundaries (TypeScript, Senior/Enterprise Edition)

## 🎯 Mục tiêu bài học

- **Cơ bản (giữ nguyên)**:
  - Hiểu và áp dụng `ErrorBoundary` với `componentDidCatch` và `getDerivedStateFromError` để bắt lỗi trong component tree.
  - Hiển thị **fallback UI** khi có lỗi.
  - Logging lỗi qua console hoặc service (e.g., Sentry).
- **Nâng cao (bổ sung)**:
  - Tích hợp **Sentry** để log và monitor lỗi trong production.
  - Kết hợp **Suspense** (Day 07) và **concurrent rendering** (Day 08) để xử lý lỗi trong lazy-loaded components và API fetching.
  - Kết hợp **virtualization** (Day 06) để xử lý danh sách lớn trong ErrorBoundary.
  - Tăng cường **accessibility** (ARIA roles, focus management, keyboard navigation) cho fallback UI.
  - Viết **unit tests** với Jest + React Testing Library để kiểm tra ErrorBoundary, fallback UI, và API error handling.
  - Setup **CI/CD** với GitHub Actions để tự động build/test và báo cáo coverage.
  - Tích hợp **PWA** để cache API data và lazy chunks, hỗ trợ offline.
  - Tối ưu performance với **React Profiler**, **Web Vitals**, và **memoization**.
- **Thực hành**: Xây dựng dashboard với ErrorBoundary, lazy loading, virtualization, concurrent rendering, và API integration.

---

## 📚 Nội dung chi tiết (Cơ bản + Nâng cao)

### 1️⃣ ErrorBoundary (Cơ bản + Nâng cao)
- **Cơ bản**: Sử dụng `ErrorBoundary` để bắt lỗi và hiển thị fallback UI.
- **Nâng cao**: Tích hợp Sentry, accessibility, và Profiler cho production-ready error handling.

**Code cơ bản (giữ nguyên)**:
```tsx
import React, { ReactNode } from "react";

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
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h2>Something went wrong.</h2>;
    }
    return this.props.children;
  }
}
```

**Upgrade nâng cao**: Thêm Sentry, accessibility, và Profiler.
```tsx
import React, { ReactNode } from "react";
import * as Sentry from "@sentry/react";

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
            <button onClick={() => window.location.reload()} aria-label="Try again">
              Reload
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
```

**Sử dụng ErrorBoundary**:
```tsx
import { FC } from "react";
import { ErrorBoundary } from "./ErrorBoundary";

const BuggyComponent: FC = () => {
  const handleClick = () => {
    throw new Error("Simulated crash!");
  };
  return (
    <button onClick={handleClick} aria-label="Simulate crash">
      Crash App
    </button>
  );
};

const App: FC = () => {
  return (
    <ErrorBoundary
      fallback={
        <div role="alert" aria-live="assertive">
          <h2>Error occurred</h2>
          <button onClick={() => window.location.reload()} aria-label="Try again">
            Reload
          </button>
        </div>
      }
    >
      <BuggyComponent />
    </ErrorBoundary>
  );
};
```

### 2️⃣ ErrorBoundary với Suspense, Concurrent Rendering, và Virtualization (Nâng cao)
- **Cơ bản**: Bắt lỗi trong component tĩnh.
- **Nâng cao**: Tích hợp API pagination (JSONPlaceholder), virtualization (Day 06), Suspense (Day 07), và concurrent rendering (Day 08) trong ErrorBoundary.

**Code nâng cao**:
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

const ConcurrentDashboard: FC = () => {
  const [filter, setFilter] = useState<string>("");
  const debouncedFilter = useDebounce(filter, 200);
  const deferredFilter = useDeferredValue(debouncedFilter);
  const [isPending, startTransition] = useTransition();
  const [page, setPage] = useState<number>(1);
  const [allItems, setAllItems] = useState<DataItem[]>([]);
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
    <Suspense fallback={<p role="status">Loading dashboard...</p>}>
      <Profiler id="ConcurrentDashboard" onRender={onRender}>
        <div role="region" aria-label="Concurrent virtualized dashboard">
          <p role="status">Items rendered: {filteredItems.length}</p>
          <input
            value={filter}
            onChange={e => startTransition(() => setFilter(e.target.value))}
            placeholder="Filter todos"
            aria-label="Filter todos"
            tabIndex={0}
          />
          {isPending && <p role="status">Updating list...</p>}
          <Suspense fallback={<p role="status">Loading list...</p>}>
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
                >
                  {LazyRow}
                </List>
              )}
            </InfiniteLoader>
          </Suspense>
        </div>
      </Profiler>
    </Suspense>
  );
};

export const DashboardChallenge: FC = () => (
  <ErrorBoundary
    fallback={
      <div role="alert" aria-live="assertive">
        <h2>Error occurred</h2>
        <button onClick={() => window.location.reload()} aria-label="Try again">
          Reload
        </button>
      </div>
    }
  >
    <ConcurrentDashboard />
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
        aria-label={`Row ${index + 1}`}
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
            <button onClick={() => window.location.reload()} aria-label="Try again">
              Reload
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
```

### 3️⃣ Testing và CI/CD (Nâng cao)
- **Unit tests**: Test ErrorBoundary, Suspense fallback, virtualization, concurrent rendering, và API integration.
- **CI/CD**: GitHub Actions với coverage report.

**Unit test (dashboard.test.tsx)**:
```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "./App";

describe("DashboardChallenge", () => {
  let consoleLogSpy: jest.SpyInstance;
  let queryClient: QueryClient;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    queryClient = new QueryClient();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
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

    const input = await screen.findByLabelText("Filter todos");
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
    fireEvent.scroll(screen.getByRole("list"), { target: { scrollTop: 1000 } });
    await waitFor(() => expect(screen.getByText("Todo 2")).toBeInTheDocument());
  });

  test("supports keyboard navigation", async () => {
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
```

---

## 🛠️ Bài tập thực hành (Level 1 → 3, với giải đầy đủ)

### Level 1: Simple ErrorBoundary
**Yêu cầu**: Tạo một `ErrorBoundary` component đơn giản với fallback UI.

**Code giải**:
```tsx
import React, { ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div role="alert">Something went wrong.</div>;
    }
    return this.props.children;
  }
}

export const Level1: React.FC = () => {
  const BuggyComponent: React.FC = () => {
    throw new Error("Simulated error");
  };

  return (
    <ErrorBoundary fallback={<div role="alert">Error occurred</div>}>
      <BuggyComponent />
    </ErrorBoundary>
  );
};
```

**Hướng dẫn**: Kiểm tra console để thấy lỗi được log, và fallback UI hiển thị.

### Level 2: Nested Components with ErrorBoundary
**Yêu cầu**: Wrap 2-3 nested components, simulate lỗi, log lên console.

**Code giải**:
```tsx
import React, { ReactNode } from "react";
import { ErrorBoundary } from "./ErrorBoundary";

const BuggyChild: React.FC = () => {
  throw new Error("Simulated child error");
};

const SafeChild: React.FC = () => {
  return <div>Safe component</div>;
};

export const Level2: React.FC = () => {
  return (
    <ErrorBoundary fallback={<div role="alert">Error in nested components</div>}>
      <div role="region" aria-label="Nested components">
        <SafeChild />
        <BuggyChild />
      </div>
    </ErrorBoundary>
  );
};
```

**Hướng dẫn**: Kiểm tra console để thấy lỗi được log, và chỉ BuggyChild gây lỗi, SafeChild vẫn an toàn.

### Level 3: ErrorBoundary with Logging Service
**Yêu cầu**: Tích hợp ErrorBoundary với mock Sentry, fallback UI, và unit tests.

**Code giải**:
```tsx
import React, { ReactNode } from "react";
import * as Sentry from "@sentry/react";

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
            <h2>Error occurred</h2>
            <p>{this.state.error?.message}</p>
            <button onClick={() => window.location.reload()} aria-label="Try again">
              Reload
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

const BuggyComponent: React.FC = () => {
  throw new Error("Simulated error");
};

export const Level3: React.FC = () => {
  return (
    <ErrorBoundary
      fallback={
        <div role="alert" aria-live="assertive">
          <h2>Error occurred</h2>
          <button onClick={() => window.location.reload()} aria-label="Try again">
            Reload
          </button>
        </div>
      }
    >
      <BuggyComponent />
    </ErrorBoundary>
  );
};
```

**Unit test (level3.test.tsx)**:
```tsx
import { render, screen } from "@testing-library/react";
import * as Sentry from "@sentry/react";
import { Level3 } from "./Level3";

describe("Level3", () => {
  let captureExceptionSpy: jest.SpyInstance;

  beforeEach(() => {
    captureExceptionSpy = jest.spyOn(Sentry, "captureException").mockImplementation();
  });

  afterEach(() => {
    captureExceptionSpy.mockRestore();
  });

  test("renders ErrorBoundary fallback on error", () => {
    render(<Level3 />);
    expect(screen.getByRole("alert")).toHaveTextContent("Error occurred");
    expect(captureExceptionSpy).toHaveBeenCalled();
  });

  test("reload button works", () => {
    const reloadSpy = jest.spyOn(window.location, "reload").mockImplementation();
    render(<Level3 />);
    const button = screen.getByLabelText("Try again");
    fireEvent.click(button);
    expect(reloadSpy).toHaveBeenCalled();
  });
});
```

---

## 🧩 Code Challenge: Enterprise Error-Handled Dashboard

**Yêu cầu**:
- **Cơ bản**: Sử dụng `ErrorBoundary` để bắt lỗi, hiển thị fallback UI, và log lỗi với Sentry.
- **Nâng cao**:
  - Tích hợp API pagination với React Query (JSONPlaceholder).
  - Virtualized list với `react-window` (Day 06).
  - Lazy loading với `Suspense` (Day 07).
  - Concurrent rendering với `useTransition` (Day 08).
  - Accessibility: ARIA roles, keyboard navigation, focus management.
  - Unit tests cho ErrorBoundary, virtualization, API, và concurrent rendering.
  - PWA: Cache API data và lazy chunks.
  - Performance: Profiler và Web Vitals logging.

**Code mẫu**: Đã cung cấp ở phần nâng cao (DashboardChallenge).

**sw.js (cache API và lazy chunks)**:
```javascript
const CACHE_NAME = "dashboard-cache-v7";
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

- **TypeScript**: Strict mode, generic types (`FetchResponse`), type-safe props.
- **Accessibility**: ARIA roles (`role="alert"`, `aria-live`), keyboard navigation, focus management.
- **Performance**: ErrorBoundary, virtualization, lazy loading, concurrent rendering, debounce filter, API caching.
- **Testing**: Coverage >80%, test ErrorBoundary, virtualization, API, concurrent rendering, và accessibility.
- **PWA**: Cache API data và lazy chunks với stale-while-revalidate.
- **Monitoring**: Profiler, Web Vitals, và error logging gửi đến Sentry.


---
📌 [<< Ngày 08](./Day08.md) | [Ngày 10 >>](./Day10.md)