# 🟩 Day 04 – Component Optimization (TypeScript, Senior/Enterprise Edition)

## 🎯 Mục tiêu bài học

- **Cơ bản (giữ nguyên)**:
  - Hiểu và áp dụng **React.memo**, **useMemo**, **useCallback**, và **lazy loading** để tránh re-render thừa.
  - Tối ưu danh sách lớn và callback xử lý sự kiện.
  - Áp dụng trong component đơn giản như danh sách lọc (filter list).
- **Nâng cao (bổ sung)**:
  - Tối ưu performance với **React Profiler**, **Web Vitals** (CLS, LCP, FID), và **virtualization** (react-window).
  - Thêm **error handling** (Sentry logging) và **accessibility** (ARIA roles, keyboard navigation).
  - Viết **unit tests** với Jest + React Testing Library để kiểm tra re-render và memoization.
  - Tích hợp **CI/CD** với GitHub Actions để build/test.
  - Áp dụng **PWA** cơ bản (service worker cache cho static assets).
  - Sử dụng TypeScript nâng cao với **generic types**, **strict null checks**, và **type guards**.
- **Thực hành**: Xây dựng mini-project production-ready với danh sách lớn, lazy loading, và performance optimization.

---

## 📚 Nội dung chi tiết (Cơ bản + Nâng cao)

### 1️⃣ React.memo (Cơ bản + Nâng cao)
- **Cơ bản**: Memo hóa component để ngăn re-render khi props không đổi.
- **Nâng cao**: Kết hợp với custom comparison function để kiểm soát props equality, thêm accessibility (ARIA), và test memoization.

**Code cơ bản (giữ nguyên)**:
```tsx
import React from "react";

type ListItemProps = { item: string };
const ListItem: React.FC<ListItemProps> = React.memo(({ item }) => {
  console.log("Rendering:", item);
  return <li>{item}</li>;
});
```

**Upgrade nâng cao**: Thêm ARIA và custom comparison.
```tsx
import React from "react";
import * as Sentry from "@sentry/react";

type ListItemProps = { item: string; onClick?: () => void };

const ListItem: React.FC<ListItemProps> = React.memo(
  ({ item, onClick }) => {
    console.log("Rendering:", item);
    return (
      <li
        role="listitem"
        aria-label={`Item: ${item}`}
        onClick={onClick}
        onKeyDown={e => e.key === "Enter" && onClick?.()}
        tabIndex={0}
        style={{ cursor: "pointer" }}
      >
        {item}
      </li>
    );
  },
  (prevProps, nextProps) => {
    try {
      return prevProps.item === nextProps.item; // Custom comparison
    } catch (err) {
      Sentry.captureException(err);
      return false; // Re-render if error
    }
  }
);
```

### 2️⃣ useMemo & useCallback (Cơ bản + Nâng cao)
- **Cơ bản**: Memo hóa giá trị tính toán nặng (`useMemo`) và callback (`useCallback`).
- **Nâng cao**: Tối ưu danh sách lớn (>1000 items), tích hợp debounce/throttle, và test callback stability.

**Code cơ bản (giữ nguyên)**:
```tsx
import { useState, useCallback, useMemo } from "react";

const ComponentOptimization: React.FC = () => {
  const [count, setCount] = useState(0);
  const [filter, setFilter] = useState("");

  const items = useMemo(() => {
    return Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`).filter(item =>
      item.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter]);

  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={increment}>Increment</button>
      <input
        type="text"
        placeholder="Filter items"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <ul>
        {items.map(item => (
          <ListItem key={item} item={item} />
        ))}
      </ul>
    </div>
  );
};
```

**Upgrade nâng cao**: Thêm debounce, virtualization, và Web Vitals.
```tsx
import { FC, useState, useCallback, useMemo, Suspense, lazy } from "react";
import { FixedSizeList as List } from "react-window";
import { useDebounce } from "./hooks/useDebounce"; // Từ Day 02
import reportWebVitals from "./reportWebVitals";
import * as Sentry from "@sentry/react";

const ItemList = lazy(() => import("./ItemList")); // Lazy load danh sách

export const ComponentOptimizationEnterprise: FC = () => {
  const [count, setCount] = useState<number>(0);
  const [filter, setFilter] = useState<string>("");
  const debouncedFilter = useDebounce(filter, 200);

  const items = useMemo(() => {
    try {
      return Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`).filter(item =>
        item.toLowerCase().includes(debouncedFilter.toLowerCase())
      );
    } catch (err) {
      Sentry.captureException(err);
      return [];
    }
  }, [debouncedFilter]);

  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  // Monitor performance
  reportWebVitals(console.log);

  return (
    <div role="region" aria-label="Optimization dashboard">
      <h2>Count: {count}</h2>
      <button onClick={increment} aria-label="Increment count">
        Increment
      </button>
      <input
        type="text"
        placeholder="Filter items"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        aria-label="Filter items"
      />
      <Suspense fallback={<p role="status">Loading list...</p>}>
        <List
          height={400}
          itemCount={items.length}
          itemSize={35}
          width={300}
        >
          {({ index, style }) => (
            <div style={style}>
              <ListItem item={items[index]} />
            </div>
          )}
        </List>
      </Suspense>
    </div>
  );
};
```

### 3️⃣ Lazy Loading (Cơ bản + Nâng cao)
- **Cơ bản**: Sử dụng `React.lazy` + `Suspense` để lazy load component.
- **Nâng cao**: Kết hợp với `useOnScreen` (từ Day 02) để chỉ load khi component visible, thêm error boundary.

**Code nâng cao**:
```tsx
// ItemList.tsx
import { FC } from "react";
import { ListItem } from "./ListItem";

export const ItemList: FC<{ items: string[] }> = ({ items }) => {
  return (
    <ul role="list">
      {items.map(item => (
        <ListItem key={item} item={item} />
      ))}
    </ul>
  );
};
```

```tsx
// App.tsx
import { FC, Suspense, lazy } from "react";
import { useOnScreen } from "./hooks/useOnScreen";
import { useRef } from "react";

const ItemList = lazy(() => import("./ItemList"));

export const LazyApp: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);

  return (
    <div ref={ref}>
      <Suspense fallback={<p role="status">Loading...</p>}>
        {isVisible ? <ItemList items={["Item 1", "Item 2"]} /> : <p>List not visible</p>}
      </Suspense>
    </div>
  );
};
```

### 4️⃣ Testing và CI/CD (Nâng cao)
- **Unit tests**: Test memoization, callback stability, và lazy loading.
- **CI/CD**: GitHub Actions để build/test tự động.

**Unit test (optimization.test.tsx)**:
```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { ComponentOptimizationEnterprise } from "./ComponentOptimization";

test("renders without re-rendering memoized items", () => {
  const consoleLog = jest.spyOn(console, "log").mockImplementation();
  render(<ComponentOptimizationEnterprise />);

  const button = screen.getByLabelText("Increment count");
  fireEvent.click(button);

  // Check that ListItem doesn't re-render unnecessarily
  expect(consoleLog).not.toHaveBeenCalledWith("Rendering: Item 1");
  consoleLog.mockRestore();
});

test("filters items correctly", async () => {
  render(<ComponentOptimizationEnterprise />);
  const input = screen.getByLabelText("Filter items");

  fireEvent.change(input, { target: { value: "Item 1" } });
  expect(screen.getByText("Item 1")).toBeInTheDocument();
  expect(screen.queryByText("Item 2")).not.toBeInTheDocument();
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

### Level 1: Quan sát Re-render
**Yêu cầu**: Tạo component hiển thị list 50 items, console.log khi render, quan sát re-render.

**Code giải**:
```tsx
import { FC } from "react";

type ItemProps = { item: string };
const Item: FC<ItemProps> = ({ item }) => {
  console.log(`Rendering: ${item}`);
  return <li>{item}</li>;
};

export const ListLevel1: FC = () => {
  const [count, setCount] = useState<number>(0);
  const items = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <ul>
        {items.map(item => (
          <Item key={item} item={item} />
        ))}
      </ul>
    </div>
  );
};
```

**Hướng dẫn**: Mở console, click button, quan sát log re-render của mỗi `Item`.

### Level 2: Tối ưu với memoization
**Yêu cầu**: Áp dụng `React.memo` cho item, `useMemo` cho filter, `useCallback` cho handler.

**Code giải**:
```tsx
import { FC, useState, useCallback, useMemo } from "react";

type ItemProps = { item: string };
const Item: FC<ItemProps> = React.memo(({ item }) => {
  console.log(`Rendering: ${item}`);
  return <li>{item}</li>;
});

export const ListLevel2: FC = () => {
  const [count, setCount] = useState<number>(0);
  const [filter, setFilter] = useState<string>("");

  const items = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`).filter(item =>
      item.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter]);

  const increment = useCallback(() => setCount(c => c + 1), []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Filter items"
      />
      <ul>
        {items.map(item => (
          <Item key={item} item={item} />
        ))}
      </ul>
    </div>
  );
};
```

**Hướng dẫn**: Click button, quan sát console. `Item` không re-render nếu props không đổi.

### Level 3: Mini Project (Enterprise)
**Yêu cầu**: List 1000+ items + filter + memoized components + lazy load + performance check.

**Code giải**:
```tsx
import { FC, useState, useCallback, useMemo, Suspense, lazy } from "react";
import { FixedSizeList as List } from "react-window";
import reportWebVitals from "./reportWebVitals";
import * as Sentry from "@sentry/react";

const ItemList = lazy(() => import("./ItemList"));

export const MiniProjectLevel3: FC = () => {
  const [count, setCount] = useState<number>(0);
  const [filter, setFilter] = useState<string>("");

  const items = useMemo(() => {
    try {
      return Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`).filter(item =>
        item.toLowerCase().includes(filter.toLowerCase())
      );
    } catch (err) {
      Sentry.captureException(err);
      return [];
    }
  }, [filter]);

  const increment = useCallback(() => setCount(c => c + 1), []);

  reportWebVitals(console.log);

  return (
    <div role="region" aria-label="Large list optimization">
      <p>Count: {count}</p>
      <button onClick={increment} aria-label="Increment count">
        Increment
      </button>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Filter items"
        aria-label="Filter items"
      />
      <Suspense fallback={<p role="status">Loading list...</p>}>
        <List
          height={400}
          itemCount={items.length}
          itemSize={35}
          width={300}
        >
          {({ index, style }) => (
            <div style={style}>
              <ListItem item={items[index]} />
            </div>
          )}
        </List>
      </Suspense>
    </div>
  );
};
```

**ItemList.tsx**:
```tsx
import { FC } from "react";

export const ItemList: FC<{ items: string[] }> = ({ items }) => {
  return (
    <ul role="list">
      {items.map(item => (
        <ListItem key={item} item={item} />
      ))}
    </ul>
  );
};
```

---

## 🧩 Code Challenge: Enterprise Filterable Dashboard

**Yêu cầu**:
- **Cơ bản**: Dashboard hiển thị danh sách 1000+ items, hỗ trợ filter, sử dụng `React.memo`, `useMemo`, `useCallback`.
- **Nâng cao**:
  - Lazy load danh sách với `Suspense`.
  - Virtualize với `react-window`.
  - Error boundary và Sentry logging.
  - Accessibility: ARIA roles, keyboard navigation.
  - Unit tests cho component và memoization.
  - PWA: Cache assets với service worker.
  - Performance: Monitor với Web Vitals.

**Code mẫu**:
```tsx
import { FC, useState, useCallback, useMemo, Suspense, lazy } from "react";
import { FixedSizeList as List } from "react-window";
import { useDebounce } from "./hooks/useDebounce";
import reportWebVitals from "./reportWebVitals";
import * as Sentry from "@sentry/react";

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

export const DashboardChallenge: FC = () => {
  const [count, setCount] = useState<number>(0);
  const [filter, setFilter] = useState<string>("");
  const debouncedFilter = useDebounce(filter, 200);

  const items = useMemo(() => {
    try {
      return Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`).filter(item =>
        item.toLowerCase().includes(debouncedFilter.toLowerCase())
      );
    } catch (err) {
      Sentry.captureException(err);
      return [];
    }
  }, [debouncedFilter]);

  const increment = useCallback(() => setCount(c => c + 1), []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(err => Sentry.captureException(err));
    }
  }, []);

  reportWebVitals(console.log);

  return (
    <ErrorBoundary>
      <div role="region" aria-label="Filterable dashboard">
        <p>Count: {count}</p>
        <button onClick={increment} aria-label="Increment count">
          Increment
        </button>
        <input
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Filter items"
          aria-label="Filter items"
        />
        <Suspense fallback={<p role="status">Loading list...</p>}>
          <List
            height={400}
            itemCount={items.length}
            itemSize={35}
            width={300}
          >
            {({ index, style }) => (
              <div style={style}>
                <ListItem item={items[index]} />
              </div>
            )}
          </List>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};
```

**sw.js**:
```javascript
const CACHE_NAME = "dashboard-cache-v1";
const urlsToCache = ["/", "/index.html"];

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

**Test (dashboard.test.tsx)**:
```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { DashboardChallenge } from "./DashboardChallenge";

test("prevents unnecessary re-renders", () => {
  const consoleLog = jest.spyOn(console, "log").mockImplementation();
  render(<DashboardChallenge />);

  fireEvent.click(screen.getByLabelText("Increment count"));
  expect(consoleLog).not.toHaveBeenCalledWith("Rendering: Item 1");
  consoleLog.mockRestore();
});

test("filters items with debounce", async () => {
  render(<DashboardChallenge />);
  const input = screen.getByLabelText("Filter items");

  fireEvent.change(input, { target: { value: "Item 1" } });
  await waitFor(() => expect(screen.getByText("Item 1")).toBeInTheDocument(), { timeout: 300 });
  expect(screen.queryByText("Item 2")).not.toBeInTheDocument();
});
```

---

## 🚀 Lưu ý production-ready

- **TypeScript**: Strict mode và type-safe props, state.
- **Accessibility**: ARIA roles và keyboard navigation cho mọi element.
- **Performance**: Virtualization với `react-window`, debounce filter input.
- **Testing**: Coverage >80%, test memoization và interaction.
- **PWA**: Cache assets với service worker.

---
### Mở Rộng Day 04 – Component Optimization (TypeScript, Senior/Enterprise Edition)

**Mở rộng Day 04** bằng cách:
- **Thêm test cases**: Bổ sung các test chi tiết cho code challenge, bao gồm test re-render, filter debounce, lazy loading, và error state với coverage cao (>80%). Sử dụng Jest + React Testing Library, mock console.log và side effects.
- **Virtualization đầy đủ**: Cập nhật code challenge để sử dụng `react-window` chi tiết hơn, bao gồm dynamic item size, infinite scrolling preview (sử dụng `InfiniteLoader`), và integration với lazy loading. Thêm accessibility cho virtualized list (ARIA roles cho items).
- **Bổ sung thêm**: Thêm PWA offline support (service worker cache danh sách items), và CI/CD yaml chi tiết hơn với coverage report.
---

#### 1. Mở Rộng Test Cases cho Code Challenge

Thêm test cases đầy đủ cho `DashboardChallenge`, tập trung vào:
- Memoization và re-render prevention.
- Filter với debounce.
- Lazy loading và Suspense fallback.
- Error handling và virtualization render.
- Mock `console.log` để kiểm tra rendering, và mock `fetch` nếu có API (dù ở đây là data tĩnh).

**Cài đặt test**: Thêm `jest.config.js` để support React và coverage.

**Test code (dashboard.test.tsx – mở rộng)**:
```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DashboardChallenge } from "./DashboardChallenge";
import { act } from "react-dom/test-utils"; // Để test useEffect

// Mock react-window và console.log
jest.mock("react-window", () => ({
  FixedSizeList: ({ children, itemCount }) => (
    <ul>
      {Array.from({ length: itemCount }, (_, index) => children({ index, style: {} }))}
    </ul>
  ),
}));

describe("DashboardChallenge", () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  test("renders initial UI without errors", () => {
    render(<DashboardChallenge />);
    expect(screen.getByLabelText("Increment count")).toBeInTheDocument();
    expect(screen.getByLabelText("Filter items")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Filterable dashboard" })).toBeInTheDocument();
  });

  test("prevents unnecessary re-renders with memoization", () => {
    render(<DashboardChallenge />);
    fireEvent.click(screen.getByLabelText("Increment count"));

    // Check rằng ListItem không re-render (console.log không gọi lại)
    expect(consoleLogSpy).not.toHaveBeenCalledWith("Rendering: Item 1");
  });

  test("filters items with debounce and virtualization", async () => {
    render(<DashboardChallenge />);
    const input = screen.getByLabelText("Filter items");

    fireEvent.change(input, { target: { value: "Item 1" } });

    // Chờ debounce (200ms)
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
    });

    await waitFor(() => {
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.queryByText("Item 500")).not.toBeInTheDocument(); // Virtualization giới hạn render
    });
  });

  test("handles lazy loading and Suspense fallback", async () => {
    render(<DashboardChallenge />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading list...");

    await waitFor(() => {
      expect(screen.getByRole("list")).toBeInTheDocument();
    });
  });

  test("handles error state with boundary", async () => {
    // Mock error trong useMemo (giả lập throw error)
    jest.spyOn(console, "error").mockImplementation(() => {});
    const mockMemo = jest.spyOn(React, "useMemo").mockImplementationOnce(() => {
      throw new Error("Memo error");
    });

    render(<DashboardChallenge />);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Error occurred");
    });

    mockMemo.mockRestore();
  });

  test("registers service worker for PWA", () => {
    const mockRegister = jest.fn().mockResolvedValue({});
    global.navigator.serviceWorker = { register: mockRegister } as any;

    render(<DashboardChallenge />);
    expect(mockRegister).toHaveBeenCalledWith("/sw.js");
  });
});
```

**Hướng dẫn test mở rộng**:
- Chạy `npm test -- --coverage` để xem report (thêm `"collectCoverage": true` trong jest.config.js).
- Coverage: Tập trung test side effects (debounce, virtualization) bằng `waitFor` và `act`.
- Bonus: Thêm integration test với real data fetch nếu tích hợp API.

---

#### 2. Virtualization Đầy Đủ trong Code Challenge

Mình sẽ cập nhật code challenge để virtualization đầy đủ hơn:
- Sử dụng `InfiniteLoader` từ `react-window-infinite-loader` để infinite scrolling (load more items khi scroll).
- Dynamic item size với `VariableSizeList` để hỗ trợ items có kích thước khác nhau (e.g., items dài hơn).
- Tích hợp lazy loading với Suspense cho phần virtualized list.
- Accessibility: Thêm ARIA roles cho virtualized list (e.g., `aria-label` cho rows).

**Cài đặt**: `npm install react-window react-window-infinite-loader`.

**Code challenge cập nhật (mở rộng virtualization)**:
```tsx
import { FC, useState, useCallback, useMemo, Suspense, lazy, useEffect } from "react";
import InfiniteLoader from "react-window-infinite-loader";
import { VariableSizeList as List } from "react-window";
import { useDebounce } from "./hooks/useDebounce";
import reportWebVitals from "./reportWebVitals";
import * as Sentry from "@sentry/react";

// Lazy load ListItem nếu cần
const ListItem = lazy(() => import("./ListItem"));

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

// Giả lập load more items (infinite scrolling)
const loadMoreItems = (startIndex: number, stopIndex: number) => {
  return new Promise<void>(resolve => {
    setTimeout(resolve, 500); // Giả lập API call
  });
};

const isItemLoaded = (index: number) => true; // Tất cả items loaded ban đầu

export const DashboardChallenge: FC = () => {
  const [count, setCount] = useState<number>(0);
  const [filter, setFilter] = useState<string>("");
  const debouncedFilter = useDebounce(filter, 200);

  const items = useMemo(() => {
    try {
      return Array.from({ length: 1000 }, (_, i) => `Item ${i + 1} - ${Math.random().toString(36).substring(7)}`); // Items với độ dài khác nhau
    } catch (err) {
      Sentry.captureException(err);
      return [];
    }
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(item => item.toLowerCase().includes(debouncedFilter.toLowerCase()));
  }, [items, debouncedFilter]);

  const getItemSize = useCallback((index: number) => {
    return filteredItems[index]?.length * 2 || 35; // Dynamic size dựa trên độ dài text
  }, [filteredItems]);

  const increment = useCallback(() => setCount(c => c + 1), []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(err => Sentry.captureException(err));
    }
  }, []);

  reportWebVitals(console.log);

  return (
    <ErrorBoundary>
      <div role="region" aria-label="Filterable dashboard">
        <p>Count: {count}</p>
        <button onClick={increment} aria-label="Increment count">
          Increment
        </button>
        <input
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Filter items"
          aria-label="Filter items"
        />
        <Suspense fallback={<p role="status">Loading list...</p>}>
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={filteredItems.length + 1} // +1 để trigger load more nếu cần
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (
              <List
                ref={ref}
                onItemsRendered={onItemsRendered}
                height={400}
                itemCount={filteredItems.length}
                itemSize={getItemSize}
                width={300}
              >
                {({ index, style }) => (
                  <div style={style} role="row" aria-label={`Row ${index + 1}`}>
                    <Suspense fallback={<div>Loading item...</div>}>
                      <ListItem item={filteredItems[index]} />
                    </Suspense>
                  </div>
                )}
              </List>
            )}
          </InfiniteLoader>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};
```

**Hướng dẫn virtualization đầy đủ**:
1. Items có độ dài khác nhau → `VariableSizeList` và `getItemSize` để tính size dynamic.
2. InfiniteLoader để load more (giả lập với timeout, có thể tích hợp API real).
3. ARIA roles cho rows để accessibility (screen reader đọc "Row X").
4. Test: Mở console, scroll xuống để xem load more và re-render tối ưu (chỉ render visible items).
5. Bonus: Thêm overscan để preload items ngoài viewport.


---
📌 [<< Ngày 03](./Day03.md) | [Ngày 05 >>](./Day05.md)