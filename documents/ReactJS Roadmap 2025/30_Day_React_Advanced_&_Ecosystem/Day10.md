# 🟩 Day 10 – Accessibility (TypeScript, Senior/Enterprise Edition)

## 🎯 Mục tiêu bài học

- **Cơ bản (giữ nguyên)**:
  - Hiểu và áp dụng **WCAG 2.1** và **ARIA roles** (`button`, `alert`, `dialog`, `menu`) để đảm bảo accessibility.
  - Sử dụng **semantic HTML** (`<header>`, `<main>`, `<footer>`) để cải thiện cấu trúc.
  - Xử lý **keyboard events** (`tab`, `enter`, `esc`) và **focus management**.
  - Viết code TypeScript type-safe cho props và events.
- **Nâng cao (bổ sung)**:
  - Tích hợp **Suspense** (Day 07) và **concurrent rendering** (Day 08) trong accessible components.
  - Kết hợp **virtualization** (Day 06) với ARIA roles để xử lý danh sách lớn.
  - Thêm **ErrorBoundary** (Day 09) để xử lý lỗi trong accessible components.
  - Tăng cường **focus trapping** trong modals và **screen reader support** (VoiceOver, NVDA).
  - Viết **unit tests** với Jest + React Testing Library để kiểm tra ARIA roles, keyboard navigation, focus management, và API integration.
  - Setup **CI/CD** với GitHub Actions để tự động build/test và báo cáo coverage.
  - Tích hợp **PWA** để cache API data và lazy chunks, hỗ trợ offline.
  - Tối ưu performance với **React Profiler**, **Web Vitals**, và **memoization**.
- **Thực hành**: Xây dựng dashboard accessible với modal, danh sách lớn, form, API integration, và screen reader support.

---

## 📚 Nội dung chi tiết (Cơ bản + Nâng cao)

### 1️⃣ Accessible Components (Cơ bản + Nâng cao)
- **Cơ bản**: Tạo Accessible Button và Modal với ARIA roles, keyboard navigation, và focus management.
- **Nâng cao**: Tích hợp accessibility vào danh sách lớn, modals với focus trapping, và API fetching.

**Accessible Button (giữ nguyên + nâng cao)**:
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

**Accessible Modal (giữ nguyên + nâng cao với focus trapping)**:
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

### 2️⃣ Accessible Dashboard với Virtualization và API (Nâng cao)
- **Cơ bản**: Tạo button và modal accessible.
- **Nâng cao**: Tích hợp API pagination (JSONPlaceholder), virtualization (Day 06), Suspense (Day 07), concurrent rendering (Day 08), và ErrorBoundary (Day 09) với accessibility.

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
  const [allItems, setAllItems] = useState<DataItem[]>([]);
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

**sw.js (cache API và lazy chunks)**:
```javascript
const CACHE_NAME = "dashboard-cache-v8";
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

### 3️⃣ Testing và CI/CD (Nâng cao)
- **Unit tests**: Test ARIA roles, keyboard navigation, focus management, virtualization, và API integration.
- **CI/CD**: GitHub Actions với coverage report.

**Unit test (dashboard.test.tsx)**:
```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "./App";

describe("AccessibleDashboard", () => {
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
```

---

## 🛠️ Bài tập thực hành (Level 1 → 3, với giải đầy đủ)

### Level 1: Thêm ARIA Roles
**Yêu cầu**: Thêm ARIA roles cho button, input, và form đơn giản.

**Code giải**:
```tsx
import { FC } from "react";
import { AccessibleButton } from "./AccessibleButton";

export const Level1: FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <form onSubmit={handleSubmit} role="form" aria-label="Simple form">
      <label htmlFor="input-field" className="block mb-2">
        Input Field
      </label>
      <input
        id="input-field"
        type="text"
        placeholder="Enter text"
        aria-label="Enter text"
        className="p-2 border rounded"
      />
      <AccessibleButton label="Submit" onClick={() => console.log("Button clicked")} />
    </form>
  );
};
```

**Hướng dẫn**: Kiểm tra với screen reader (VoiceOver/NVDA) để đảm bảo ARIA roles được đọc đúng.

### Level 2: Keyboard Navigation
**Yêu cầu**: Tạo keyboard navigation với focus, tab, enter, esc.

**Code giải**:
```tsx
import { FC, useRef, useEffect } from "react";
import { AccessibleButton } from "./AccessibleButton";

export const Level2: FC = () => {
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstButtonRef.current?.focus();
  }, []);

  return (
    <div role="region" aria-label="Keyboard navigation">
      <AccessibleButton ref={firstButtonRef} label="Button 1" onClick={() => console.log("Button 1 clicked")} />
      <AccessibleButton label="Button 2" onClick={() => console.log("Button 2 clicked")} />
      <AccessibleButton label="Button 3" onClick={() => console.log("Button 3 clicked")} />
    </div>
  );
};
```

**Hướng dẫn**: Nhấn `Tab` để di chuyển giữa các button, `Enter` hoặc `Space` để kích hoạt.

### Level 3: Mini Project – Accessible Modal + List + Form
**Yêu cầu**: Tạo modal, danh sách, và form với screen reader support, test với RTL keyboard events.

**Code giải**:
```tsx
import { FC, useState } from "react";
import { Modal } from "./Modal";
import { AccessibleButton } from "./AccessibleButton";

export const Level3: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const items = ["Item 1", "Item 2", "Item 3"];

  return (
    <main role="main" aria-label="Accessible mini project">
      <header>
        <h1>Mini Project</h1>
        <AccessibleButton label="Open Modal" onClick={() => setIsModalOpen(true)} ariaControls="project-modal" />
      </header>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Project Modal">
        <form onSubmit={e => e.preventDefault()}>
          <label htmlFor="modal-input" className="block mb-2">
            Enter Text
          </label>
          <input
            id="modal-input"
            type="text"
            placeholder="Type here"
            aria-label="Enter text"
            className="w-full p-2 border rounded"
          />
          <AccessibleButton label="Submit" onClick={() => setIsModalOpen(false)} />
        </form>
      </Modal>
      <ul role="list" aria-label="Item list">
        {items.map((item, index) => (
          <li key={index} role="listitem" aria-label={`Item ${index + 1}`}>
            {item}
          </li>
        ))}
      </ul>
    </main>
  );
};
```

**Unit test (level3.test.tsx)**:
```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Level3 } from "./Level3";

describe("Level3", () => {
  test("renders accessible modal", async () => {
    render(<Level3 />);
    const button = screen.getByLabelText("Open Modal");
    fireEvent.click(button);
    const modalInput = await screen.findByLabelText("Enter text");
    expect(modalInput).toHaveFocus();
    fireEvent.keyDown(modalInput, { key: "Escape" });
    await waitFor(() => expect(screen.queryByLabelText("Enter text")).not.toBeInTheDocument());
  });

  test("supports keyboard navigation in list", () => {
    render(<Level3 />);
    const item = screen.getByText("Item 1");
    expect(item).toHaveAttribute("role", "listitem");
    expect(item).toHaveAttribute("aria-label", "Item 1");
  });
});
```

---

## 🧩 Code Challenge: Enterprise Accessible Dashboard

**Yêu cầu**:
- **Cơ bản**: Tạo modal, danh sách, và form accessible với ARIA roles, keyboard navigation, và focus management.
- **Nâng cao**:
  - Tích hợp API pagination với React Query (JSONPlaceholder).
  - Virtualized list với `react-window` (Day 06).
  - Lazy loading với `Suspense` (Day 07).
  - Concurrent rendering với `useTransition` (Day 08).
  - Error handling với `ErrorBoundary` (Day 09).
  - Accessibility: ARIA roles, focus trapping, screen reader support.
  - Unit tests cho accessibility, virtualization, API, và concurrent rendering.
  - PWA: Cache API data và lazy chunks.
  - Performance: Profiler và Web Vitals logging.

**Code mẫu**: Đã cung cấp ở phần nâng cao (AccessibleDashboard).

---

## 🚀 Lưu ý production-ready

- **TypeScript**: Strict mode, generic types (`FetchResponse`), type-safe props.
- **Accessibility**: ARIA roles (`role="grid"`, `aria-label`, `aria-live`), focus trapping, keyboard navigation.
- **Performance**: Virtualization, lazy loading, concurrent rendering, debounce filter, API caching.
- **Testing**: Coverage >80%, test ARIA roles, keyboard navigation, focus management, virtualization, và API.
- **PWA**: Cache API data và lazy chunks với stale-while-revalidate.
- **Monitoring**: Profiler, Web Vitals, và error logging gửi đến Sentry.


---
📌 [<< Ngày 09](./Day09.md) | [Ngày 11 >>](./Day11.md)