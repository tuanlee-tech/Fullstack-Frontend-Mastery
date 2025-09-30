# 🟩 Day 08 – Concurrent Patterns (TypeScript, Senior/Enterprise Edition)

## 🎯 Mục tiêu bài học

- **Cơ bản (giữ nguyên)**:
  - Hiểu và áp dụng `useTransition` và `startTransition` để đánh dấu state updates là low-priority, tránh block UI.
  - Sử dụng `useDeferredValue` để giữ giá trị cũ, hiển thị UI mượt mà khi xử lý dữ liệu nặng.
  - Kết hợp với danh sách lớn (>1000 items) để kiểm tra performance.
- **Nâng cao (bổ sung)**:
  - Tích hợp **Suspense-enabled data fetching** với React Query và concurrent rendering.
  - Kết hợp **virtualization** (Day 06) để render danh sách lớn hiệu quả.
  - Thêm **error boundaries** với Sentry logging để xử lý lỗi trong concurrent updates.
  - Tăng cường **accessibility** (ARIA roles, focus management, keyboard navigation).
  - Viết **unit tests** với Jest + React Testing Library để kiểm tra concurrent rendering, fallback UI, và API integration.
  - Setup **CI/CD** với GitHub Actions để tự động build/test và báo cáo coverage.
  - Tích hợp **PWA** để cache API data và lazy chunks, hỗ trợ offline.
  - Tối ưu performance với **React Profiler**, **Web Vitals**, **memoization**, và **debounce**.
- **Thực hành**: Xây dựng dashboard với concurrent patterns, lazy loading, virtualization, và API integration.

---

## 📚 Nội dung chi tiết (Cơ bản + Nâng cao)

### 1️⃣ Concurrent Patterns (Cơ bản + Nâng cao)
- **Cơ bản**: Sử dụng `useTransition` và `useDeferredValue` để tối ưu UI khi filter danh sách lớn.
- **Nâng cao**: Tích hợp **Suspense**, **virtualization**, và **API fetching** trong concurrent mode.

**Code cơ bản (giữ nguyên)**:
```tsx
import React, { useState, useTransition, useDeferredValue, useMemo } from "react";

const generateList = (n: number) => Array.from({ length: n }, (_, i) => `Item ${i + 1}`);

const App: React.FC = () => {
  const [filter, setFilter] = useState("");
  const [isPending, startTransition] = useTransition();
  const deferredFilter = useDeferredValue(filter);
  const list = useMemo(() => generateList(10000), []);

  const filteredList = useMemo(() => {
    return list.filter(item => item.toLowerCase().includes(deferredFilter.toLowerCase()));
  }, [list, deferredFilter]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    startTransition(() => {
      setFilter(value);
    });
  };

  return (
    <div>
      <h1>Concurrent List Filter</h1>
      <input type="text" value={filter} onChange={handleChange} placeholder="Type to filter..." />
      {isPending && <div>Updating list...</div>}
      <ul>
        {filteredList.slice(0, 100).map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};
```

**Upgrade nâng cao**: Thêm accessibility, error boundary, và Profiler.
```tsx
import { FC, useState, useTransition, useDeferredValue, useMemo, Profiler } from "react";
import * as Sentry from "@sentry/react";

const generateList = (n: number) => Array.from({ length: n }, (_, i) => `Item ${i + 1}`);

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) {
    Sentry.captureException(error);
  }
  render() {
    return this.state.hasError ? <p role="alert">Error filtering list</p> : this.props.children;
  }
}

const AppEnterprise: FC = () => {
  const [filter, setFilter] = useState("");
  const [isPending, startTransition] = useTransition();
  const deferredFilter = useDeferredValue(filter);
  const list = useMemo(() => generateList(10000), []);

  const filteredList = useMemo(() => {
    try {
      return list.filter(item => item.toLowerCase().includes(deferredFilter.toLowerCase()));
    } catch (err) {
      Sentry.captureException(err);
      return [];
    }
  }, [list, deferredFilter]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setFilter(e.target.value);
    });
  };

  const onRender = (id: string, phase: string, actualDuration: number) => {
    Sentry.captureMessage(`Profiler: ${id} ${phase} took ${actualDuration}ms`, "info");
  };

  return (
    <ErrorBoundary>
      <Profiler id="ConcurrentList" onRender={onRender}>
        <div role="region" aria-label="Concurrent list filter">
          <h1>Concurrent List Filter</h1>
          <input
            type="text"
            value={filter}
            onChange={handleChange}
            placeholder="Type to filter..."
            aria-label="Filter list"
          />
          {isPending && <p role="status">Updating list...</p>}
          <ul role="list">
            {filteredList.slice(0, 100).map(item => (
              <li key={item} role="listitem" aria-label={`Item ${item}`}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Profiler>
    </ErrorBoundary>
  );
};
```

### 2️⃣ Concurrent Rendering với API và Virtualization (Nâng cao)
- **Cơ bản**: Filter danh sách tĩnh với `useTransition` và `useDeferredValue`.
- **Nâng cao**: Tích hợp API pagination (JSONPlaceholder), virtualization (Day 06), và Suspense (Day 07) trong concurrent mode.

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

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) {
    Sentry.captureException(error);
  }
  render() {
    return this.state.hasError ? <p role="alert">Error occurred. Please try again.</p> : this.props.children;
  }
}

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
  const [isPending, startTransition] = useTransition();
  const deferredFilter = useDeferredValue(debouncedFilter);
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

  if (error) return <p role="alert">Error: {error.message}</p>;

  return (
    <ErrorBoundary>
      <Profiler id="ConcurrentDashboard" onRender={onRender}>
        <Suspense fallback={<p role="status">Loading dashboard...</p>}>
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
        </Suspense>
      </Profiler>
    </ErrorBoundary>
  );
};

export const App: FC = () => (
  <QueryClientProvider client={queryClient}>
    <ConcurrentDashboard />
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

### 3️⃣ Testing và CI/CD (Nâng cao)
- **Unit tests**: Test concurrent rendering, Suspense fallback, virtualization, và API integration.
- **CI/CD**: GitHub Actions với coverage report.

**Unit test (dashboard.test.tsx)**:
```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "./App";

describe("ConcurrentDashboard", () => {
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

  test("handles API error", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("API Error"))) as jest.Mock;

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Error: API Error"));
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

### Level 1: Demo useTransition
**Yêu cầu**: Sử dụng `useTransition` để filter danh sách >1000 items với fallback UI.

**Code giải**:
```tsx
import { FC, useState, useTransition, useMemo } from "react";

const generateList = (n: number) => Array.from({ length: n }, (_, i) => `Item ${i + 1}`);

export const Level1: FC = () => {
  const [filter, setFilter] = useState("");
  const [isPending, startTransition] = useTransition();
  const list = useMemo(() => generateList(1000), []);

  const filteredList = useMemo(() => {
    return list.filter(item => item.toLowerCase().includes(filter.toLowerCase()));
  }, [list, filter]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setFilter(e.target.value);
    });
  };

  return (
    <div role="region" aria-label="Concurrent list filter">
      <input
        type="text"
        value={filter}
        onChange={handleChange}
        placeholder="Type to filter..."
        aria-label="Filter list"
      />
      {isPending && <p role="status">Updating list...</p>}
      <ul role="list">
        {filteredList.slice(0, 100).map(item => (
          <li key={item} role="listitem" aria-label={`Item ${item}`}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

**Hướng dẫn**: Nhập nhanh vào input, quan sát fallback UI và UI vẫn responsive.

### Level 2: useDeferredValue + Debounce
**Yêu cầu**: Kết hợp `useDeferredValue` và `useDebounce` để hiển thị preview list khi typing.

**Code giải**:
```tsx
import { FC, useState, useDeferredValue, useMemo } from "react";
import { useDebounce } from "./hooks";

const generateList = (n: number) => Array.from({ length: n }, (_, i) => `Item ${i + 1}`);

export const Level2: FC = () => {
  const [filter, setFilter] = useState("");
  const debouncedFilter = useDebounce(filter, 200);
  const deferredFilter = useDeferredValue(debouncedFilter);
  const list = useMemo(() => generateList(1000), []);

  const filteredList = useMemo(() => {
    return list.filter(item => item.toLowerCase().includes(deferredFilter.toLowerCase()));
  }, [list, deferredFilter]);

  return (
    <div role="region" aria-label="Deferred list filter">
      <input
        type="text"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Type to filter..."
        aria-label="Filter list"
      />
      <p role="status">Showing results for: {deferredFilter || "all"}</p>
      <ul role="list">
        {filteredList.slice(0, 100).map(item => (
          <li key={item} role="listitem" aria-label={`Item ${item}`}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

**Hướng dẫn**: Nhập nhanh, quan sát deferredFilter giữ giá trị cũ, tránh lag.

### Level 3: Mini Project – Concurrent Dashboard
**Yêu cầu**: Dashboard với large dataset, concurrent patterns, memoization, fallback UI, và performance log.

**Code giải**:
```tsx
import { FC, Suspense, useState, useTransition, useDeferredValue, useMemo, Profiler } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFetch, useDebounce } from "./hooks";
import * as Sentry from "@sentry/react";
import reportWebVitals from "./reportWebVitals";

const queryClient = new QueryClient();

interface DataItem {
  id: number;
  title: string;
}

interface FetchResponse {
  data: DataItem[];
  total: number;
}

export const Level3: FC = () => {
  const [filter, setFilter] = useState("");
  const debouncedFilter = useDebounce(filter, 200);
  const deferredFilter = useDeferredValue(debouncedFilter);
  const [isPending, startTransition] = useTransition();
  const { data, isLoading, error } = useFetch<FetchResponse>(
    `https://jsonplaceholder.typicode.com/todos?_limit=20${deferredFilter ? `&title_like=${deferredFilter}` : ""}`,
    ["todos", deferredFilter]
  );

  const onRender = (id: string, phase: string, actualDuration: number) => {
    Sentry.captureMessage(`Profiler: ${id} ${phase} took ${actualDuration}ms`, "info");
  };

  reportWebVitals(console.log);

  if (isLoading) return <p role="status">Loading data...</p>;
  if (error) return <p role="alert">Error: {error.message}</p>;

  return (
    <Suspense fallback={<p role="status">Loading dashboard...</p>}>
      <Profiler id="ConcurrentMiniDashboard" onRender={onRender}>
        <div role="region" aria-label="Concurrent dashboard">
          <input
            value={filter}
            onChange={e => startTransition(() => setFilter(e.target.value))}
            placeholder="Filter todos"
            aria-label="Filter todos"
          />
          {isPending && <p role="status">Updating list...</p>}
          <ul role="list">
            {data?.data.map(item => (
              <li key={item.id} role="listitem" aria-label={`Todo ${item.id}`}>
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      </Profiler>
    </Suspense>
  );
};

export const App: FC = () => (
  <QueryClientProvider client={queryClient}>
    <Level3 />
  </QueryClientProvider>
);
```

---

## 🧩 Code Challenge: Enterprise Concurrent Dashboard

**Yêu cầu**:
- **Cơ bản**: Sử dụng `useTransition` và `useDeferredValue` để filter danh sách lớn, hiển thị fallback UI.
- **Nâng cao**:
  - Tích hợp API pagination với React Query (JSONPlaceholder).
  - Virtualized list với `react-window` (Day 06).
  - Lazy loading với `Suspense` (Day 07).
  - Error boundary và Sentry logging.
  - Accessibility: ARIA roles, keyboard navigation, focus management.
  - Unit tests cho concurrent rendering, virtualization, API, và accessibility.
  - PWA: Cache API data và lazy chunks.
  - Performance: Profiler và Web Vitals logging.

**Code mẫu**:
```tsx
import { FC, Suspense, useState, useCallback, useEffect, useTransition, useDeferredValue, Profiler, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import InfiniteLoader from "react-window-infinite-loader";
import { VariableSizeList as List } from "react-window";
import { useFetch, useDebounce } from "./hooks";
import * as Sentry from "@sentry/react";
import reportWebVitals from "./reportWebVitals";
import dynamic from "next/dynamic";

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

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) {
    Sentry.captureException(error);
  }
  render() {
    return this.state.hasError ? <p role="alert">Error occurred. Please try again.</p> : this.props.children;
  }
}

interface DataItem {
  id: number;
  title: string;
}

interface FetchResponse {
  data: DataItem[];
  total: number;
}

export const DashboardChallenge: FC = () => {
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

  if (error) return <p role="alert">Error: {error.message}</p>;

  return (
    <ErrorBoundary>
      <Profiler id="ConcurrentDashboard" onRender={onRender}>
        <Suspense fallback={<p role="status">Loading dashboard...</p>}>
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
        </Suspense>
      </Profiler>
    </ErrorBoundary>
  );
};

export const App: FC = () => (
  <QueryClientProvider client={queryClient}>
    <DashboardChallenge />
  </QueryClientProvider>
);
```

**sw.js (cache API và lazy chunks)**:
```javascript
const CACHE_NAME = "dashboard-cache-v6";
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
- **Accessibility**: ARIA roles (`role="row"`, `aria-label`), keyboard navigation, focus management.
- **Performance**: Concurrent rendering, virtualization, lazy loading, infinite scrolling, debounce filter, API caching.
- **Testing**: Coverage >80%, test concurrent rendering, virtualization, API, và accessibility.
- **PWA**: Cache API data và lazy chunks với stale-while-revalidate.
- **Monitoring**: Profiler và Web Vitals logging gửi đến Sentry.

---
📌 [<< Ngày 07](./Day07.md) | [Ngày 09 >>](./Day09.md)