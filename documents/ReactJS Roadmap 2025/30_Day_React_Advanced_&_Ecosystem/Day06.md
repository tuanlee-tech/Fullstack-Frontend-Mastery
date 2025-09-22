# 🟩 Day 06 – Virtualization (TypeScript, Senior/Enterprise Edition)

## 🎯 Mục tiêu bài học

- **Cơ bản (giữ nguyên)**:
  - Hiểu và áp dụng **virtualization** để render danh sách lớn mà không gây lag, giảm DOM nodes và memory usage.
  - Sử dụng **react-window** (`FixedSizeList`) để render chỉ các item trong viewport.
  - Kết hợp **memoization** và **lazy loading** để tối ưu row components.
- **Nâng cao (bổ sung)**:
  - Tích hợp **infinite scrolling** với `react-window-infinite-loader` và API pagination (JSONPlaceholder).
  - Sử dụng **VariableSizeList** để hỗ trợ dynamic item sizes (e.g., rows có chiều cao khác nhau).
  - Thêm **error handling** (error boundaries, Sentry logging) và **accessibility** (ARIA roles, keyboard navigation).
  - Viết **unit tests** với Jest + React Testing Library để kiểm tra virtualization, infinite scrolling, và memoization.
  - Setup **CI/CD** với GitHub Actions để build/test và báo cáo coverage.
  - Tích hợp **PWA** để cache API data và assets, hỗ trợ offline.
  - Tối ưu performance với **React Profiler**, **Web Vitals**, và **memoization** (kết nối Day 05).
- **Thực hành**: Xây dựng virtualized dashboard với danh sách lớn, infinite scrolling, và performance profiling.

---

## 📚 Nội dung chi tiết (Cơ bản + Nâng cao)

### 1️⃣ Virtualization với react-window (Cơ bản + Nâng cao)
- **Cơ bản**: Sử dụng `FixedSizeList` để render danh sách lớn, chỉ render items trong viewport.
- **Nâng cao**: Sử dụng `VariableSizeList` cho dynamic item sizes, tích hợp `InfiniteLoader` cho infinite scrolling, và thêm accessibility.

**Code cơ bản (giữ nguyên)**:
```tsx
import React from "react";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";

type RowProps = { index: number; style: React.CSSProperties };

const Row: React.FC<ListChildComponentProps> = ({ index, style }) => {
  console.log(`Rendering row ${index}`);
  return (
    <div style={{ ...style, padding: 10, borderBottom: "1px solid #ccc" }}>
      Row #{index}
    </div>
  );
};

const VirtualizedList: React.FC = () => {
  const itemCount = 10000;
  const itemSize = 35;

  return (
    <List
      height={500}
      width={300}
      itemCount={itemCount}
      itemSize={itemSize}
    >
      {Row}
    </List>
  );
};
```

**Upgrade nâng cao**: Thêm accessibility, memoization, và dynamic sizes.
```tsx
import React, { FC } from "react";
import { VariableSizeList as List, ListChildComponentProps } from "react-window";
import * as Sentry from "@sentry/react";

type RowProps = { index: number; style: React.CSSProperties; data: string[] };

const Row: FC<RowProps> = React.memo(({ index, style, data }) => {
  console.log(`Rendering row ${index}`);
  try {
    return (
      <div
        role="row"
        aria-label={`Row ${index + 1}`}
        style={{ ...style, padding: 10, borderBottom: "1px solid #ccc" }}
      >
        {data[index]}
      </div>
    );
  } catch (err) {
    Sentry.captureException(err);
    return <div role="alert">Error rendering row</div>;
  }
});

const VirtualizedListEnterprise: FC = () => {
  const items = Array.from({ length: 10000 }, (_, i) => `Row #${i + 1} - ${Math.random().toString(36).substring(7)}`);

  const getItemSize = (index: number) => {
    return items[index]?.length * 2 || 35; // Dynamic size dựa trên độ dài text
  };

  return (
    <List
      height={500}
      width={300}
      itemCount={items.length}
      itemSize={getItemSize}
      itemData={items}
    >
      {Row}
    </List>
  );
};
```

### 2️⃣ Infinite Scrolling với API (Nâng cao)
- **Cơ bản**: Render danh sách tĩnh với virtualization.
- **Nâng cao**: Tích hợp API pagination (JSONPlaceholder) với `InfiniteLoader`, xử lý loading states và errors.

**Code nâng cao**:
```tsx
import { FC, useState, useCallback, useMemo, Suspense, lazy, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import InfiniteLoader from "react-window-infinite-loader";
import { VariableSizeList as List } from "react-window";
import { useFetch } from "./hooks/useFetch";
import * as Sentry from "@sentry/react";
import reportWebVitals from "./reportWebVitals";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      cacheTime: 5 * 60 * 1000,
    },
  },
});

const Row = lazy(() => import("./Row"));

interface DataItem {
  id: number;
  title: string;
}

interface FetchResponse {
  data: DataItem[];
  total: number;
}

const VirtualizedListWithAPI: FC = () => {
  const [page, setPage] = useState<number>(1);
  const [allItems, setAllItems] = useState<DataItem[]>([]);
  const { data, isLoading, error } = useFetch<FetchResponse>(
    `https://jsonplaceholder.typicode.com/todos?_limit=20&_start=${(page - 1) * 20}`,
    ["todos", page]
  );

  useEffect(() => {
    if (data?.data) {
      setAllItems(prev => [...prev, ...data.data]);
    }
  }, [data]);

  const loadMoreItems = useCallback(
    (startIndex: number, stopIndex: number) => {
      if (stopIndex >= allItems.length && !isLoading) {
        setPage(prev => prev + 1);
      }
      return Promise.resolve();
    },
    [allItems.length, isLoading]
  );

  const isItemLoaded = useCallback((index: number) => index < allItems.length, [allItems.length]);

  const getItemSize = useCallback((index: number) => {
    return allItems[index]?.title.length * 2 || 50;
  }, [allItems]);

  if (error) return <p role="alert">Error: {error.message}</p>;

  return (
    <Suspense fallback={<p role="status">Loading list...</p>}>
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={data?.total || allItems.length + 1}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <List
            ref={ref}
            onItemsRendered={onItemsRendered}
            height={500}
            width={300}
            itemCount={allItems.length}
            itemSize={getItemSize}
            itemData={allItems.map(item => item.title)}
          >
            {Row}
          </List>
        )}
      </InfiniteLoader>
    </Suspense>
  );
};

export const App: FC = () => (
  <QueryClientProvider client={queryClient}>
    <VirtualizedListWithAPI />
  </QueryClientProvider>
);
```

**Row.tsx**:
```tsx
import { FC } from "react";
import { ListChildComponentProps } from "react-window";
import * as Sentry from "@sentry/react";

type RowProps = { index: number; style: React.CSSProperties; data: string[] };

export const Row: FC<RowProps> = React.memo(({ index, style, data }) => {
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
    return <div role="alert">Error rendering row</div>;
  }
});
```

### 3️⃣ Testing và CI/CD (Nâng cao)
- **Unit tests**: Test virtualization, infinite scrolling, và memoization.
- **CI/CD**: GitHub Actions với coverage report.

**Unit test (virtualized.test.tsx)**:
```tsx
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "./VirtualizedListWithAPI";

jest.mock("react-window", () => ({
  VariableSizeList: ({ children, itemCount, itemData }) => (
    <ul>
      {Array.from({ length: itemCount }, (_, index) => children({ index, style: {}, data: itemData }))}
    </ul>
  ),
}));

jest.mock("react-window-infinite-loader", () => ({ children }) => children({ onItemsRendered: jest.fn(), ref: {} }));

describe("VirtualizedListWithAPI", () => {
  let consoleLogSpy: jest.SpyInstance;
  const queryClient = new QueryClient();

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  test("renders initial UI", async () => {
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

  test("prevents unnecessary row re-renders", async () => {
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

    await waitFor(() => expect(consoleLogSpy).toHaveBeenCalledWith("Rendering row 0"));
    consoleLogSpy.mockClear();
    fireEvent.keyDown(screen.getByText("Todo 1"), { key: "Enter" });
    expect(consoleLogSpy).not.toHaveBeenCalledWith("Rendering row 0");
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

### Level 1: Quan sát Lag
**Yêu cầu**: Render danh sách 1000 item bình thường, quan sát lag và console.log render.

**Code giải**:
```tsx
import { FC } from "react";

type RowProps = { index: number; text: string };
const Row: FC<RowProps> = ({ index, text }) => {
  console.log(`Rendering row ${index}`);
  return <div style={{ padding: 10, borderBottom: "1px solid #ccc" }}>{text}</div>;
};

export const ListLevel1: FC = () => {
  const items = Array.from({ length: 1000 }, (_, i) => `Row #${i + 1}`);

  return (
    <div>
      {items.map((item, index) => (
        <Row key={index} index={index} text={item} />
      ))}
    </div>
  );
};
```

**Hướng dẫn**: Mở console, quan sát log và lag khi scroll. Tất cả 1000 rows render cùng lúc.

### Level 2: Virtualization với react-window
**Yêu cầu**: Dùng `react-window` để virtualize danh sách, so sánh số render với Level 1.

**Code giải**:
```tsx
import { FC } from "react";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";

type RowProps = { index: number; style: React.CSSProperties; data: string[] };

const Row: FC<RowProps> = React.memo(({ index, style, data }) => {
  console.log(`Rendering row ${index}`);
  return (
    <div style={{ ...style, padding: 10, borderBottom: "1px solid #ccc" }}>
      {data[index]}
    </div>
  );
});

export const ListLevel2: FC = () => {
  const items = Array.from({ length: 1000 }, (_, i) => `Row #${i + 1}`);

  return (
    <List
      height={500}
      width={300}
      itemCount={items.length}
      itemSize={35}
      itemData={items}
    >
      {Row}
    </List>
  );
};
```

**Hướng dẫn**: Scroll danh sách, kiểm tra console. Chỉ ~10-20 rows render tùy viewport.

### Level 3: Mini Project – Virtualized Dashboard
**Yêu cầu**: Danh sách 10k item + filter + memoized row + lazy load + virtualized + performance profiling.

**Code giải**:
```tsx
import { FC, useState, useCallback, useMemo, Suspense, lazy } from "react";
import { FixedSizeList as List } from "react-window";
import { useDebounce } from "./hooks/useDebounce";
import * as Sentry from "@sentry/react";
import reportWebVitals from "./reportWebVitals";

const Row = lazy(() => import("./Row"));

export const ListLevel3: FC = () => {
  const [filter, setFilter] = useState<string>("");
  const debouncedFilter = useDebounce(filter, 200);
  const items = useMemo(
    () => Array.from({ length: 10000 }, (_, i) => `Row #${i + 1} - ${Math.random().toString(36).substring(7)}`),
    []
  );

  const filteredItems = useMemo(() => {
    try {
      return items.filter(item => item.toLowerCase().includes(debouncedFilter.toLowerCase()));
    } catch (err) {
      Sentry.captureException(err);
      return [];
    }
  }, [items, debouncedFilter]);

  reportWebVitals(console.log);

  return (
    <Suspense fallback={<p role="status">Loading list...</p>}>
      <div role="region" aria-label="Virtualized dashboard">
        <input
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Filter rows"
          aria-label="Filter rows"
        />
        <List
          height={500}
          width={300}
          itemCount={filteredItems.length}
          itemSize={35}
          itemData={filteredItems}
        >
          {Row}
        </List>
      </div>
    </Suspense>
  );
};
```

---

## 🧩 Code Challenge: Enterprise Virtualized Dashboard

**Yêu cầu**:
- **Cơ bản**: Virtualized danh sách 10k item, hỗ trợ filter, sử dụng `react-window`, memoized rows.
- **Nâng cao**:
  - Infinite scrolling với API pagination (JSONPlaceholder).
  - Dynamic item sizes với `VariableSizeList`.
  - Error boundary và Sentry logging.
  - Accessibility: ARIA roles, keyboard navigation.
  - Unit tests cho virtualization, infinite scrolling, và filter.
  - PWA: Cache API data với stale-while-revalidate.
  - Performance: Profiler và Web Vitals logging.

**Code mẫu**:
```tsx
import { FC, useState, useCallback, useMemo, Suspense, lazy, useEffect, Profiler } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import InfiniteLoader from "react-window-infinite-loader";
import { VariableSizeList as List } from "react-window";
import { useFetch, useDebounce } from "./hooks";
import * as Sentry from "@sentry/react";
import reportWebVitals from "./reportWebVitals";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      cacheTime: 5 * 60 * 1000,
    },
  },
});

const Row = lazy(() => import("./Row"));

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
  const [page, setPage] = useState<number>(1);
  const [allItems, setAllItems] = useState<DataItem[]>([]);
  const { data, isLoading, error } = useFetch<FetchResponse>(
    `https://jsonplaceholder.typicode.com/todos?_limit=20&_start=${(page - 1) * 20}`,
    ["todos", page]
  );

  useEffect(() => {
    if (data?.data) {
      setAllItems(prev => [...prev, ...data.data]);
    }
  }, [data]);

  const filteredItems = useMemo(() => {
    try {
      return allItems.filter(item => item.title.toLowerCase().includes(debouncedFilter.toLowerCase()));
    } catch (err) {
      Sentry.captureException(err);
      return [];
    }
  }, [allItems, debouncedFilter]);

  const loadMoreItems = useCallback(
    (startIndex: number, stopIndex: number) => {
      if (stopIndex >= allItems.length && !isLoading) {
        setPage(prev => prev + 1);
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
      <Profiler id="VirtualizedDashboard" onRender={onRender}>
        <Suspense fallback={<p role="status">Loading list...</p>}>
          <div role="region" aria-label="Virtualized dashboard">
            <input
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder="Filter rows"
              aria-label="Filter rows"
            />
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={data?.total || filteredItems.length + 1}
              loadMoreItems={loadMoreItems}
            >
              {({ onItemsRendered, ref }) => (
                <List
                  ref={ref}
                  onItemsRendered={onItemsRendered}
                  height={500}
                  width={300}
                  itemCount={filteredItems.length}
                  itemSize={getItemSize}
                  itemData={filteredItems.map(item => item.title)}
                >
                  {Row}
                </List>
              )}
            </InfiniteLoader>
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

**sw.js (stale-while-revalidate)**:
```javascript
const CACHE_NAME = "dashboard-cache-v3";
const urlsToCache = ["/", "/index.html", "https://jsonplaceholder.typicode.com/todos"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const cache = caches.open(CACHE_NAME);
          cache.then(c => c.put(event.request, networkResponse.clone()));
        }
        return networkResponse;
      });
      return cachedResponse || fetchPromise;
    })
  );
});
```

---

## 🚀 Lưu ý production-ready

- **TypeScript**: Strict mode, generic types cho API response (`FetchResponse`).
- **Accessibility**: ARIA roles (`role="row"`, `aria-label`) và keyboard navigation (Enter key).
- **Performance**: Virtualization với `react-window`, infinite scrolling, debounce filter.
- **Testing**: Coverage >80%, test virtualization, infinite scrolling, và API integration.
- **PWA**: Stale-while-revalidate caching cho API và assets.
- **Monitoring**: Profiler và Web Vitals logging gửi đến Sentry.
---


## 🟩 Day 06 – Virtualization (TypeScript, Mở Rộng Enterprise Edition)

### Mở Rộng Test Cases

Mình sẽ bổ sung test cases chi tiết cho `DashboardChallenge`, bao gồm:
- Test virtualization (chỉ render items trong viewport).
- Test infinite scrolling với mock API (success, error, empty).
- Test dynamic item sizes và accessibility.
- Test error handling và performance logging.

**Cài đặt test**: Cập nhật `jest.config.js` để hỗ trợ `react-window`, `react-window-infinite-loader`, và React Query.

```javascript
// jest.config.js
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

**Test code mở rộng (dashboard.test.tsx)**:
```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardChallenge } from "./DashboardChallenge";
import { act } from "react-dom/test-utils";

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

  test("renders initial UI with empty data", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [], total: 0 }),
      })
    ) as jest.Mock;

    render(
      <QueryClientProvider client={queryClient}>
        <DashboardChallenge />
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByRole("list")).toBeInTheDocument());
    expect(screen.queryByText(/Row #\d+/)).not.toBeInTheDocument();
  });

  test("handles API success with pagination", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [{ id: 1, title: "Todo 1" }, { id: 2, title: "Todo 2" }],
            total: 200,
          }),
      })
    ) as jest.Mock;

    render(
      <QueryClientProvider client={queryClient}>
        <DashboardChallenge />
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText("Todo 1")).toBeInTheDocument());
    expect(screen.getByText("Todo 2")).toBeInTheDocument();
  });

  test("handles API error", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("API Error"))) as jest.Mock;

    render(
      <QueryClientProvider client={queryClient}>
        <DashboardChallenge />
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Error: API Error"));
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
        <DashboardChallenge />
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText("Todo 1")).toBeInTheDocument());

    // Simulate scroll to trigger load more
    fireEvent.scroll(screen.getByRole("list"), { target: { scrollTop: 1000 } });
    await waitFor(() => expect(screen.getByText("Todo 2")).toBeInTheDocument());
  });

  test("handles dynamic item sizes", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [{ id: 1, title: "Short" }, { id: 2, title: "Very long title here" }],
            total: 200,
          }),
      })
    ) as jest.Mock;

    render(
      <QueryClientProvider client={queryClient}>
        <DashboardChallenge />
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText("Short")).toBeInTheDocument());
    expect(screen.getByText("Very long title here")).toBeInTheDocument();
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
        <DashboardChallenge />
      </QueryClientProvider>
    );

    const row = await screen.findByText("Todo 1");
    fireEvent.keyDown(row, { key: "Enter" });
    expect(consoleLogSpy).toHaveBeenCalledWith("Row 0 clicked");
  });

  test("logs Profiler and Web Vitals", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [{ id: 1, title: "Todo 1" }], total: 200 }),
      })
    ) as jest.Mock;

    render(
      <QueryClientProvider client={queryClient}>
        <DashboardChallenge />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.objectContaining({ name: expect.any(String), value: expect.any(Number) })
      ); // Web Vitals
    });
  });
});
```

**Hướng dẫn test**:
- Mock `react-window` và `react-window-infinite-loader` để test virtualization và infinite scrolling.
- Mock `fetch` với các trường hợp: empty data, success, error.
- Test dynamic item sizes bằng cách so sánh render output với title length.
- Test accessibility bằng cách kiểm tra keyboard navigation (Enter key).
- Chạy `npm test -- --coverage` để kiểm tra coverage (>80%).

---

### Tích Hợp API Phức Tạp Hơn

Mình sẽ nâng cấp code challenge để:
- Sử dụng **pagination** với `_page` và `_limit` từ JSONPlaceholder, kèm metadata tổng số items.
- Thêm **retry with backoff** logic với React Query.
- Tích hợp **real-time filtering** bằng API search (giả lập với `title_like` query).
- Tăng cường **caching** với stale-while-revalidate.

**Code challenge cập nhật (mở rộng API và dynamic virtualization)**:
```tsx
import { FC, useState, useCallback, useMemo, Suspense, lazy, useEffect, Profiler, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import InfiniteLoader from "react-window-infinite-loader";
import { VariableSizeList as List } from "react-window";
import { useFetch, useDebounce } from "./hooks";
import * as Sentry from "@sentry/react";
import reportWebVitals from "./reportWebVitals";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000), // Exponential backoff
      cacheTime: 5 * 60 * 1000,
      staleTime: 30 * 1000, // Stale-while-revalidate
    },
  },
});

const Row = lazy(() => import("./Row"));

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
  const [page, setPage] = useState<number>(1);
  const [allItems, setAllItems] = useState<DataItem[]>([]);
  const listRef = useRef<any>(null);
  const scrollPosition = useRef<number>(0);

  const { data, isLoading, error } = useFetch<FetchResponse>(
    `https://jsonplaceholder.typicode.com/todos?_page=${page}&_limit=20${debouncedFilter ? `&title_like=${debouncedFilter}` : ""}`,
    ["todos", page, debouncedFilter]
  );

  useEffect(() => {
    if (data?.data) {
      setAllItems(prev => [...prev, ...data.data]);
    }
  }, [data]);

  useEffect(() => {
    // Restore scroll position sau khi filter
    if (listRef.current) {
      listRef.current.scrollTo(scrollPosition.current);
    }
  }, [filteredItems]);

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
        setPage(prev => prev + 1);
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
    scrollPosition.current = scrollOffset; // Lưu vị trí scroll
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
      <Profiler id="VirtualizedDashboard" onRender={onRender}>
        <Suspense fallback={<p role="status">Loading list...</p>}>
          <div role="region" aria-label="Virtualized dashboard">
            <p role="status">Items rendered: {filteredItems.length}</p>
            <input
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder="Filter rows"
              aria-label="Filter rows"
            />
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
                  overscanCount={10} // Preload 10 items ngoài viewport
                  onScroll={onScroll}
                >
                  {Row}
                </List>
              )}
            </InfiniteLoader>
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

**Row.tsx (cập nhật)**:
```tsx
import { FC } from "react";
import { ListChildComponentProps } from "react-window";
import * as Sentry from "@sentry/react";

type RowProps = { index: number; style: React.CSSProperties; data: string[] };

export const Row: FC<RowProps> = React.memo(({ index, style, data }) => {
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
    return <div role="alert">Error rendering row</div>;
  }
});
```

**sw.js (cải thiện cache per page)**:
```javascript
const CACHE_NAME = "dashboard-cache-v3";
const urlsToCache = ["/", "/index.html"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (url.pathname.includes("jsonplaceholder.typicode.com")) {
    // Cache per page cho API
    event.respondWith(
      caches.open(`${CACHE_NAME}-api-page-${url.searchParams.get("_page")}`).then(cache =>
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

**Hướng dẫn API và dynamic virtualization**:
1. **Complex pagination**: Sử dụng `_page` và `_limit`, kèm `title_like` cho filtering qua API.
2. **Retry with backoff**: React Query retry với exponential backoff (tối đa 30s).
3. **Dynamic item sizes**: `getItemSize` tính chiều cao dựa trên độ dài title.
4. **Overscan**: Preload 10 items ngoài viewport để scroll mượt hơn.
5. **Scroll restoration**: Lưu và khôi phục `scrollPosition` khi filter.
6. **Performance metrics**: Hiển thị số items rendered trên UI.
7. **PWA**: Cache riêng cho mỗi API page để tối ưu offline.

---

### Bổ Sung Enterprise Features

1. **Accessibility**: Thêm focus management cho virtualized list.
   ```tsx
   useEffect(() => {
     if (listRef.current && filteredItems.length) {
       listRef.current.focus();
     }
   }, [filteredItems]);
   ```

2. **Performance Metrics UI**: Hiển thị số items rendered và thời gian load.
   ```tsx
   <p role="status">Items rendered: {filteredItems.length}</p>
   <p role="status">Load time: {performance.now().toFixed(2)}ms</p>
   ```

3. **Sentry Logging**: Log thêm scroll performance.
   ```tsx
   const onScroll = useCallback(({ scrollOffset }: { scrollOffset: number }) => {
     scrollPosition.current = scrollOffset;
     Sentry.captureMessage(`Scroll position: ${scrollOffset}`, "info");
   }, []);
   ```

---

### Lưu ý Production-Ready

- **TypeScript**: Strict mode, generic types (`FetchResponse`), type-safe props.
- **Accessibility**: ARIA roles (`role="row"`, `aria-label`), keyboard navigation (Enter key).
- **Performance**: Virtualization với overscan, infinite scrolling, debounce filter, và API caching.
- **Testing**: Coverage >80%, test virtualization, infinite scrolling, API, và accessibility.
- **PWA**: Cache per page với stale-while-revalidate.
- **Monitoring**: Profiler và Web Vitals logging gửi đến Sentry.

---
📌 [<< Ngày 05](./Day05.md) | [Ngày 07 >>](./Day07.md)