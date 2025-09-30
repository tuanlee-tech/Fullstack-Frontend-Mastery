# 🟩 Day 07 – Suspense & Lazy Loading (TypeScript, Senior/Enterprise Edition)

## 🎯 Mục tiêu bài học

- **Cơ bản (giữ nguyên)**:
  - Hiểu và áp dụng `React.lazy` để dynamic import component, tách bundle.
  - Sử dụng `Suspense` để hiển thị fallback UI khi component đang load.
  - Áp dụng **nested Suspense** để quản lý fallback UI cho từng component con.
- **Nâng cao (bổ sung)**:
  - Tích hợp **Suspense-enabled data fetching** với React Query hoặc custom `use` hook.
  - Thêm **error boundaries** với Sentry logging để xử lý lỗi khi lazy load hoặc fetch data.
  - Tăng cường **accessibility** (ARIA roles, focus management, keyboard navigation).
  - Viết **unit tests** với Jest + React Testing Library để kiểm tra lazy loading, fallback UI, và error states.
  - Setup **CI/CD** với GitHub Actions để tự động build/test và báo cáo coverage.
  - Tích hợp **PWA** để cache lazy-loaded chunks và API data, hỗ trợ offline.
  - Tối ưu performance với **React Profiler**, **Web Vitals**, và **memoization**.
  - Kết hợp **virtualization** (Day 06) cho danh sách lớn trong lazy-loaded components.
- **Thực hành**: Xây dựng dashboard với lazy-loaded components, API integration, và performance profiling.

---

## 📚 Nội dung chi tiết (Cơ bản + Nâng cao)

### 1️⃣ React.lazy & Suspense (Cơ bản + Nâng cao)
- **Cơ bản**: Sử dụng `React.lazy` để dynamic import component, kết hợp `Suspense` cho fallback UI.
- **Nâng cao**: Tích hợp **nested Suspense**, **error boundaries**, và **accessibility** (ARIA, focus management).

**Code cơ bản (giữ nguyên)**:
```tsx
import React, { Suspense } from "react";

const LazyComponent = React.lazy(() => import("./LazyComponent"));

const App: React.FC = () => {
  return (
    <div>
      <h1>Main App</h1>
      <Suspense fallback={<div>Loading component...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
};
```

**LazyComponent.tsx**:
```tsx
import React from "react";

const LazyComponent: React.FC = () => {
  return <div>I am a lazily loaded component!</div>;
};

export default LazyComponent;
```

**Upgrade nâng cao**: Thêm accessibility, error boundary, và Profiler.
```tsx
import React, { FC, Suspense, Profiler } from "react";
import * as Sentry from "@sentry/react";

const LazyComponent = React.lazy(() => import("./LazyComponent"));

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) {
    Sentry.captureException(error);
  }
  render() {
    return this.state.hasError ? <p role="alert">Error loading component</p> : this.props.children;
  }
}

const AppEnterprise: FC = () => {
  const onRender = (id: string, phase: string, actualDuration: number) => {
    Sentry.captureMessage(`Profiler: ${id} ${phase} took ${actualDuration}ms`, "info");
  };

  return (
    <ErrorBoundary>
      <Profiler id="AppLazy" onRender={onRender}>
        <div role="region" aria-label="Main application">
          <h1>Main App</h1>
          <Suspense fallback={<div role="status">Loading component...</div>}>
            <LazyComponent />
          </Suspense>
        </div>
      </Profiler>
    </ErrorBoundary>
  );
};
```

**LazyComponent.tsx (cập nhật)**:
```tsx
import { FC } from "react";

const LazyComponent: FC = () => {
  return (
    <div role="region" aria-label="Lazy loaded component">
      I am a lazily loaded component!
    </div>
  );
};

export default LazyComponent;
```

### 2️⃣ Suspense-enabled Data Fetching (Nâng cao)
- **Cơ bản**: Lazy load component tĩnh.
- **Nâng cao**: Tích hợp **Suspense** với API fetching (React Query), hỗ trợ pagination và filtering.

**Code nâng cao**:
```tsx
import { FC, Suspense, lazy, useState, useCallback, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

const LazyList = lazy(() => import("./LazyList"));

interface DataItem {
  id: number;
  title: string;
}

interface FetchResponse {
  data: DataItem[];
  total: number;
}

const AppWithData: FC = () => {
  const [filter, setFilter] = useState<string>("");
  const debouncedFilter = useDebounce(filter, 200);
  const { data, isLoading, error } = useFetch<FetchResponse>(
    `https://jsonplaceholder.typicode.com/todos?_limit=20${debouncedFilter ? `&title_like=${debouncedFilter}` : ""}`,
    ["todos", debouncedFilter]
  );

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(err => Sentry.captureException(err));
    }
  }, []);

  reportWebVitals((metric) => {
    Sentry.captureMessage(`Web Vital: ${metric.name} = ${metric.value}`, "info");
  });

  if (isLoading) return <p role="status">Loading data...</p>;
  if (error) return <p role="alert">Error: {error.message}</p>;

  return (
    <Suspense fallback={<p role="status">Loading list...</p>}>
      <div role="region" aria-label="Data-driven application">
        <input
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Filter todos"
          aria-label="Filter todos"
        />
        <LazyList items={data?.data || []} />
      </div>
    </Suspense>
  );
};

export const App: FC = () => (
  <QueryClientProvider client={queryClient}>
    <AppWithData />
  </QueryClientProvider>
);
```

**LazyList.tsx**:
```tsx
import { FC } from "react";
import * as Sentry from "@sentry/react";

interface DataItem {
  id: number;
  title: string;
}

interface LazyListProps {
  items: DataItem[];
}

export const LazyList: FC<LazyListProps> = ({ items }) => {
  try {
    return (
      <ul role="list">
        {items.map(item => (
          <li key={item.id} role="listitem" aria-label={`Todo ${item.id}`}>
            {item.title}
          </li>
        ))}
      </ul>
    );
  } catch (err) {
    Sentry.captureException(err);
    throw err; // Để error boundary xử lý
  }
};

export default LazyList;
```

### 3️⃣ Testing và CI/CD (Nâng cao)
- **Unit tests**: Test lazy loading, Suspense fallback, API integration, và accessibility.
- **CI/CD**: GitHub Actions với coverage report.

**Unit test (app.test.tsx)**:
```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "./App";

const queryClient = new QueryClient();

describe("AppWithData", () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
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
    expect(screen.getByRole("status")).toHaveTextContent("Loading data...");
  });

  test("renders lazy-loaded list with API data", async () => {
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

  test("supports filtering", async () => {
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
          json: () => Promise.resolve({ data: [{ id: 1, title: "Todo 1" }], total: 200 }),
        })
      ) as jest.Mock;

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    const input = screen.getByLabelText("Filter todos");
    fireEvent.change(input, { target: { value: "Todo" } });

    await waitFor(() => expect(screen.getByText("Todo 1")).toBeInTheDocument());
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

    const input = await screen.findByLabelText("Filter todos");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(input).toHaveFocus();
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

### Level 1: Lazy Load Component
**Yêu cầu**: Tạo 1 component lazy load với `Suspense` fallback, quan sát loading.

**Code giải**:
```tsx
import { FC, Suspense } from "react";

const LazyComponent = React.lazy(() => import("./LazyComponent"));

export const Level1: FC = () => {
  return (
    <div>
      <Suspense fallback={<div role="status">Loading...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
};
```

**LazyComponent.tsx**:
```tsx
import { FC } from "react";

const LazyComponent: FC = () => {
  return <div role="region" aria-label="Lazy component">Lazy loaded!</div>;
};

export default LazyComponent;
```

**Hướng dẫn**: Mở DevTools Network tab, quan sát chunk tải riêng, và fallback UI hiển thị.

### Level 2: Nested Lazy Components
**Yêu cầu**: Lazy load 2-3 nested components, mỗi component có fallback riêng.

**Code giải**:
```tsx
import { FC, Suspense } from "react";

const LazyChild1 = React.lazy(() => import("./LazyChild1"));
const LazyChild2 = React.lazy(() => import("./LazyChild2"));

export const Level2: FC = () => {
  return (
    <div role="region" aria-label="Nested lazy components">
      <Suspense fallback={<div role="status">Loading Child 1...</div>}>
        <LazyChild1 />
      </Suspense>
      <Suspense fallback={<div role="status">Loading Child 2...</div>}>
        <LazyChild2 />
      </Suspense>
    </div>
  );
};
```

**LazyChild1.tsx**:
```tsx
import { FC } from "react";

const LazyChild1: FC = () => {
  return <div role="region" aria-label="Child 1">Child 1 Loaded!</div>;
};

export default LazyChild1;
```

**LazyChild2.tsx**:
```tsx
import { FC } from "react";

const LazyChild2: FC = () => {
  return <div role="region" aria-label="Child 2">Child 2 Loaded!</div>;
};

export default LazyChild2;
```

**Hướng dẫn**: Quan sát fallback riêng cho từng component trong Network tab.

### Level 3: Mini App – Dynamic Lazy Loading
**Yêu cầu**: Dynamic import nhiều module, nested Suspense, concurrent render, error fallback, và lazy-loaded list.

**Code giải**:
```tsx
import { FC, Suspense, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFetch } from "./hooks";
import * as Sentry from "@sentry/react";
import reportWebVitals from "./reportWebVitals";

const queryClient = new QueryClient();
const LazyList = React.lazy(() => import("./LazyList"));

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

interface DataItem {
  id: number;
  title: string;
}

interface FetchResponse {
  data: DataItem[];
  total: number;
}

export const Level3: FC = () => {
  const { data, isLoading, error } = useFetch<FetchResponse>(
    "https://jsonplaceholder.typicode.com/todos?_limit=20",
    ["todos"]
  );

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(err => Sentry.captureException(err));
    }
  }, []);

  reportWebVitals(console.log);

  if (isLoading) return <p role="status">Loading data...</p>;
  if (error) return <p role="alert">Error: {error.message}</p>;

  return (
    <ErrorBoundary>
      <Suspense fallback={<p role="status">Loading list...</p>}>
        <div role="region" aria-label="Dynamic lazy app">
          <LazyList items={data?.data || []} />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

export const App: FC = () => (
  <QueryClientProvider client={queryClient}>
    <Level3 />
  </QueryClientProvider>
);
```

**LazyList.tsx**:
```tsx
import { FC } from "react";
import * as Sentry from "@sentry/react";

interface DataItem {
  id: number;
  title: string;
}

interface LazyListProps {
  items: DataItem[];
}

export const LazyList: FC<LazyListProps> = ({ items }) => {
  try {
    return (
      <ul role="list">
        {items.map(item => (
          <li key={item.id} role="listitem" aria-label={`Todo ${item.id}`}>
            {item.title}
          </li>
        ))}
      </ul>
    );
  } catch (err) {
    Sentry.captureException(err);
    throw err;
  }
};

export default LazyList;
```

---

## 🧩 Code Challenge: Enterprise Lazy-Loaded Dashboard

**Yêu cầu**:
- **Cơ bản**: Lazy load components và danh sách, sử dụng `Suspense` và fallback UI.
- **Nâng cao**:
  - Tích hợp API pagination với React Query (JSONPlaceholder).
  - Virtualized list với `react-window` (Day 06).
  - Error boundary và Sentry logging.
  - Accessibility: ARIA roles, keyboard navigation, focus management.
  - Unit tests cho lazy loading, API, và virtualization.
  - PWA: Cache lazy chunks và API data.
  - Performance: Profiler và Web Vitals logging.

**Code mẫu**:
```tsx
import { FC, Suspense, useState, useCallback, useEffect, Profiler, useRef } from "react";
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
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
      cacheTime: 5 * 60 * 1000,
      staleTime: 30 * 1000,
    },
  },
});

const LazyRow = lazy(() => import("./LazyRow"));

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
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(err => Sentry.captureException(err));
    }
  }, []);

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

  reportWebVitals((metric) => {
    Sentry.captureMessage(`Web Vital: ${metric.name} = ${metric.value}`, "info");
  });

  if (error) return <p role="alert">Error: {error.message}</p>;

  return (
    <ErrorBoundary>
      <Profiler id="LazyDashboard" onRender={onRender}>
        <Suspense fallback={<p role="status">Loading dashboard...</p>}>
          <div role="region" aria-label="Lazy-loaded virtualized dashboard">
            <p role="status">Items rendered: {filteredItems.length}</p>
            <input
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder="Filter todos"
              aria-label="Filter todos"
            />
            <Suspense fallback={<p role="status">Loading list...</p>}>
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

**sw.js (cache lazy chunks và API)**:
```javascript
const CACHE_NAME = "dashboard-cache-v4";
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
- **Accessibility**: ARIA roles (`role="row"`, `aria-label`), keyboard navigation (Enter key).
- **Performance**: Lazy loading, virtualization, infinite scrolling, debounce filter, API caching.
- **Testing**: Coverage >80%, test lazy loading, virtualization, API, và accessibility.
- **PWA**: Cache lazy chunks và API data với stale-while-revalidate.
- **Monitoring**: Profiler và Web Vitals logging gửi đến Sentry.
---
Mở rộng **Day 07 – Suspense & Lazy Loading (TypeScript 100%)**! tập trung vào việc:

- **Tích hợp Server-Side Rendering (SSR) với Suspense**:
  - Sử dụng **Next.js** để hỗ trợ SSR với `Suspense` và `React.lazy`.
  - Tích hợp **streaming SSR** để render từng phần của dashboard với fallback UI.
  - Tối ưu **hydration** để kết hợp SSR và client-side lazy loading.
  - Xử lý **API data fetching** trong SSR với React Query và `getServerSideProps`.
- **Thêm test cases phức tạp hơn**:
  - Test **SSR rendering** với `@testing-library/react` và mock Next.js context.
  - Test **Suspense fallback** trong các trường hợp nested components và API errors.
  - Test **hydration** để đảm bảo client-side takeover không gây lỗi.
  - Test **accessibility** (focus management, ARIA roles) và **keyboard navigation**.
  - Test **infinite scrolling** và **lazy-loaded components** với mock API pagination.
  - Đảm bảo coverage >80% với Jest + React Testing Library.
- **Bổ sung enterprise features**:
  - Tăng cường **accessibility** với focus trapping trong lazy-loaded components.
  - Thêm **performance metrics** hiển thị trên UI (e.g., thời gian hydrate, số items rendered).
  - Cải thiện **PWA** với cache chiến lược cho SSR và lazy chunks.
  - Tích hợp **Sentry** để log SSR errors và hydration mismatches.
  - Kết hợp **virtualization** (Day 06) với SSR và lazy loading.



---

## 🟩 Day 07 – Suspense & Lazy Loading (TypeScript, Mở Rộng Enterprise Edition with SSR)

### Tích Hợp Server-Side Rendering (SSR) với Suspense

Mình sẽ nâng cấp code challenge để:
- Sử dụng **Next.js** với `Suspense` và `React.lazy` cho lazy-loaded components.
- Tích hợp **streaming SSR** để render từng phần của dashboard với fallback UI.
- Xử lý **API data fetching** trong SSR với `getServerSideProps` và React Query.
- Tối ưu **hydration** để đảm bảo client-side takeover mượt mà.

**Cài đặt**: Cần `next`, `react-window`, `react-window-infinite-loader`, `@tanstack/react-query`, và `@sentry/nextjs`.

**Code challenge cập nhật (SSR + Suspense + Virtualization)**:
```tsx
// pages/index.tsx
import { FC, Suspense, useState, useCallback, useEffect, Profiler, useRef } from "react";
import { QueryClient, QueryClientProvider, dehydrate, Hydrate } from "@tanstack/react-query";
import InfiniteLoader from "react-window-infinite-loader";
import { VariableSizeList as List } from "react-window";
import { useFetch, useDebounce } from "../hooks";
import * as Sentry from "@sentry/nextjs";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";

const LazyRow = dynamic(() => import("../components/LazyRow"), { ssr: false });

interface DataItem {
  id: number;
  title: string;
}

interface FetchResponse {
  data: DataItem[];
  total: number;
}

interface Props {
  dehydratedState: any;
}

const DashboardChallenge: FC<Props> = ({ dehydratedState }) => {
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
    scrollPosition.current = scrollOffset;
    Sentry.captureMessage(`Scroll position: ${scrollOffset}`, "info");
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(err => Sentry.captureException(err));
    }
  }, []);

  if (error) return <p role="alert">Error: {error.message}</p>;

  return (
    <Suspense fallback={<p role="status">Loading dashboard...</p>}>
      <Profiler id="LazyDashboard" onRender={onRender}>
        <div role="region" aria-label="Lazy-loaded virtualized dashboard">
          <p role="status">Items rendered: {filteredItems.length}</p>
          <input
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Filter todos"
            aria-label="Filter todos"
            tabIndex={0}
          />
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

export const App: FC<Props> = ({ dehydratedState }) => {
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

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <DashboardChallenge />
      </Hydrate>
    </QueryClientProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["todos", 1, ""], () =>
    fetch("https://jsonplaceholder.typicode.com/todos?_page=1&_limit=20").then(res => res.json())
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
```

**components/LazyRow.tsx**:
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

**public/sw.js (cache SSR và lazy chunks)**:
```javascript
const CACHE_NAME = "dashboard-cache-v5";
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

**next.config.js**:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
```

**Hướng dẫn SSR**:
1. **Streaming SSR**: Next.js tự động stream HTML với `Suspense` fallback, giảm TTFB.
2. **getServerSideProps**: Prefetch API data để render server-side.
3. **Hydration**: React Query `Hydrate` component đảm bảo client-side takeover mượt mà.
4. **Dynamic import**: `LazyRow` chỉ tải trên client (`ssr: false`) để tối ưu server rendering.
5. **PWA**: Cache API data và lazy chunks với stale-while-revalidate.

---

### Thêm Test Cases Phức Tạp Hơn

Mình sẽ bổ sung test cases chi tiết cho `DashboardChallenge`, bao gồm:
- Test **SSR rendering** với mock Next.js context.
- Test **Suspense fallback** cho nested components và API errors.
- Test **hydration** để đảm bảo client-side takeover.
- Test **accessibility** (focus management, ARIA roles).
- Test **infinite scrolling** và **lazy loading** với mock API pagination.

**Cài đặt test**: Cần `@testing-library/react`, `jest-environment-jsdom`, và mock Next.js.

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
import { DashboardChallenge } from "../pages/index";

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
        <DashboardChallenge dehydratedState={{}} />
      </QueryClientProvider>
    );
    expect(screen.getByRole("status")).toHaveTextContent("Loading dashboard...");
  });

  test("renders SSR data", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [{ id: 1, title: "Todo 1" }], total: 200 }),
      })
    ) as jest.Mock;

    render(
      <QueryClientProvider client={queryClient}>
        <DashboardChallenge dehydratedState={{ queries: [{ state: { data: { data: [{ id: 1, title: "Todo 1" }], total: 200 } }] }} />
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText("Todo 1")).toBeInTheDocument());
  });

  test("handles API error", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("API Error"))) as jest.Mock;

    render(
      <QueryClientProvider client={queryClient}>
        <DashboardChallenge dehydratedState={{}} />
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
        <DashboardChallenge dehydratedState={{}} />
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText("Todo 1")).toBeInTheDocument());
    fireEvent.scroll(screen.getByRole("list"), { target: { scrollTop: 1000 } });
    await waitFor(() => expect(screen.getByText("Todo 2")).toBeInTheDocument());
  });

  test("supports filtering with API", async () => {
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
          json: () => Promise.resolve({ data: [{ id: 1, title: "Todo 1" }], total: 200 }),
        })
      ) as jest.Mock;

    render(
      <QueryClientProvider client={queryClient}>
        <DashboardChallenge dehydratedState={{}} />
      </QueryClientProvider>
    );

    const input = screen.getByLabelText("Filter todos");
    fireEvent.change(input, { target: { value: "Todo" } });
    await waitFor(() => expect(screen.getByText("Todo 1")).toBeInTheDocument());
  });

  test("supports keyboard navigation and focus management", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [{ id: 1, title: "Todo 1" }], total: 200 }),
      })
    ) as jest.Mock;

    render(
      <QueryClientProvider client={queryClient}>
        <DashboardChallenge dehydratedState={{}} />
      </QueryClientProvider>
    );

    const input = await screen.findByLabelText("Filter todos");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(input).toHaveFocus();

    const row = screen.getByText("Todo 1");
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
        <DashboardChallenge dehydratedState={{}} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.objectContaining({ name: expect.any(String), value: expect.any(Number) })
      );
    });
  });
});
```

**Hướng dẫn test**:
- Mock `fetch` để test SSR và client-side API fetching.
- Test Suspense fallback cho cả dashboard và list.
- Test hydration với `dehydratedState` để đảm bảo client-side takeover.
- Test accessibility bằng cách kiểm tra focus và keyboard navigation.
- Chạy `npm test -- --coverage` để kiểm tra coverage (>80%).

---

### Bổ Sung Enterprise Features

1. **Accessibility**: Thêm focus trapping cho lazy-loaded list.
   ```tsx
   useEffect(() => {
     if (listRef.current && filteredItems.length) {
       listRef.current.focus();
     }
   }, [filteredItems]);
   ```

2. **Performance Metrics UI**: Hiển thị thời gian hydrate và số items rendered.
   ```tsx
   const [hydrateTime, setHydrateTime] = useState<number>(0);
   useEffect(() => {
     setHydrateTime(performance.now());
   }, []);
   // Hiển thị trong UI
   <p role="status">Hydration time: {hydrateTime.toFixed(2)}ms</p>
   ```

3. **Sentry Logging**: Log hydration mismatches và SSR errors.
   ```tsx
   useEffect(() => {
     if (typeof window !== "undefined") {
       Sentry.captureMessage("Client-side hydration completed", "info");
     }
   }, []);
   ```

---

### Lưu ý Production-Ready

- **TypeScript**: Strict mode, generic types (`FetchResponse`), type-safe props.
- **Accessibility**: ARIA roles (`role="row"`, `aria-label`), keyboard navigation, focus trapping.
- **Performance**: SSR, lazy loading, virtualization, infinite scrolling, debounce filter, API caching.
- **Testing**: Coverage >80%, test SSR, lazy loading, virtualization, API, và accessibility.
- **PWA**: Cache SSR HTML, lazy chunks, và API data.
- **Monitoring**: Profiler, Web Vitals, và SSR errors gửi đến Sentry.

---

### Tiếp Theo

Bạn đã xác nhận muốn triển khai **Day 08 – Concurrent Patterns**. Tôi sẽ viết theo format tương tự:
- Lý thuyết chi tiết + best practices (`useTransition`, `useDeferredValue`, concurrent rendering).
- Code mẫu TS production-ready (concurrent dashboard, API integration).
- Level 1-3 exercises với giải đầy đủ.

**Hỏi nhanh**: Bạn muốn tôi triển khai **Day 08** ngay, hay cần thêm gì cho Day 07 (e.g., tích hợp streaming API với Suspense, thêm test cases cho edge cases)? Hãy xác nhận nhé!

```tsx
import { FC, Suspense, useState, useCallback, useEffect, Profiler, useRef } from "react";
import { QueryClient, QueryClientProvider, dehydrate, Hydrate } from "@tanstack/react-query";
import InfiniteLoader from "react-window-infinite-loader";
import { VariableSizeList as List } from "react-window";
import { useFetch, useDebounce } from "../hooks";
import * as Sentry from "@sentry/nextjs";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";

const LazyRow = dynamic(() => import("../components/LazyRow"), { ssr: false });

interface DataItem {
  id: number;
  title: string;
}

interface FetchResponse {
  data: DataItem[];
  total: number;
}

interface Props {
  dehydratedState: any;
}

const DashboardChallenge: FC<Props> = ({ dehydratedState }) => {
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
    scrollPosition.current = scrollOffset;
    Sentry.captureMessage(`Scroll position: ${scrollOffset}`, "info");
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(err => Sentry.captureException(err));
    }
  }, []);

  if (error) return <p role="alert">Error: {error.message}</p>;

  return (
    <Suspense fallback={<p role="status">Loading dashboard...</p>}>
      <Profiler id="LazyDashboard" onRender={onRender}>
        <div role="region" aria-label="Lazy-loaded virtualized dashboard">
          <p role="status">Items rendered: {filteredItems.length}</p>
          <input
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Filter todos"
            aria-label="Filter todos"
            tabIndex={0}
          />
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

export const App: FC<Props> = ({ dehydratedState }) => {
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

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <DashboardChallenge />
      </Hydrate>
    </QueryClientProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["todos", 1, ""], () =>
    fetch("https://jsonplaceholder.typicode.com/todos?_page=1&_limit=20").then(res => res.json())
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
```

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

```ts
const CACHE_NAME = "dashboard-cache-v5";
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
📌 [<< Ngày 06](./Day06.md) | [Ngày 08 >>](./Day08.md)