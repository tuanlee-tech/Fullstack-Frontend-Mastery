# 🟩 Day 05 – Performance Profiling (TypeScript, Senior/Enterprise Edition)

## 🎯 Mục tiêu bài học

- **Cơ bản (giữ nguyên)**:
  - Hiểu cách sử dụng **React DevTools Profiler** để đo thời gian render và phát hiện re-render thừa.
  - Áp dụng **Web Vitals** (CLS, LCP, FID) để đo performance ngoài UI.
  - Sử dụng **React.memo**, **useMemo**, **useCallback** để tối ưu re-render.
  - Theo dõi re-render với console.log và Profiler.
- **Nâng cao (bổ sung)**:
  - Tích hợp **React Profiler** với logging chi tiết (Sentry) để phân tích bottlenecks trong production.
  - Gửi **Web Vitals** metrics đến analytics (giả lập hoặc Sentry).
  - Thêm **error handling** (error boundaries, try/catch) và **accessibility** (ARIA roles, keyboard navigation).
  - Viết **unit tests** với Jest + React Testing Library để kiểm tra memoization và performance.
  - Setup **CI/CD** với GitHub Actions để tự động build/test và báo cáo coverage.
  - Tích hợp **PWA** để cache assets, cải thiện performance offline.
  - Chuẩn bị cho Day 06 bằng cách giới thiệu **virtualization** với `react-window` cho danh sách lớn.
- **Thực hành**: Xây dựng dashboard với nhiều widget, profiling performance, và tối ưu re-render.

---

## 📚 Nội dung chi tiết (Cơ bản + Nâng cao)

### 1️⃣ React DevTools Profiler (Cơ bản + Nâng cao)
- **Cơ bản**: Sử dụng React DevTools Profiler để đo thời gian render và phát hiện component re-render không cần thiết.
- **Nâng cao**: Log thời gian render với Sentry, tích hợp với production monitoring, và sử dụng Profiler API để tự động hóa profiling.

**Code cơ bản (giữ nguyên)**:
```tsx
import React, { useState, useCallback, useMemo } from "react";

type WidgetProps = { id: number; value: number };
const Widget: React.FC<WidgetProps> = React.memo(({ id, value }) => {
  console.log(`Rendering Widget ${id}`);
  return (
    <div style={{ padding: 10, margin: 5, border: "1px solid #ccc" }}>
      {id}: {value}
    </div>
  );
});

const PerformanceProfiler: React.FC = () => {
  const [count, setCount] = useState(0);
  const [values, setValues] = useState<number[]>(() =>
    Array.from({ length: 100 }, () => Math.floor(Math.random() * 1000))
  );

  const increment = useCallback(() => setCount(c => c + 1), []);

  const computedValues = useMemo(() => {
    return values.map(v => v * 2);
  }, [values]);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={increment}>Increment</button>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {computedValues.map((val, idx) => (
          <Widget key={idx} id={idx} value={val} />
        ))}
      </div>
    </div>
  );
};
```

**Upgrade nâng cao**: Thêm Profiler API, Sentry logging, và Web Vitals.
```tsx
import React, { useState, useCallback, useMemo, Profiler } from "react";
import * as Sentry from "@sentry/react";
import reportWebVitals from "./reportWebVitals";

type WidgetProps = { id: number; value: number };
const Widget: React.FC<WidgetProps> = React.memo(({ id, value }) => {
  console.log(`Rendering Widget ${id}`);
  return (
    <div
      role="region"
      aria-label={`Widget ${id}`}
      style={{ padding: 10, margin: 5, border: "1px solid #ccc" }}
    >
      {id}: {value}
    </div>
  );
});

const PerformanceProfilerEnterprise: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [values, setValues] = useState<number[]>(() =>
    Array.from({ length: 100 }, () => Math.floor(Math.random() * 1000))
  );

  const increment = useCallback(() => setCount(c => c + 1), []);

  const computedValues = useMemo(() => {
    try {
      return values.map(v => v * 2);
    } catch (err) {
      Sentry.captureException(err);
      return [];
    }
  }, [values]);

  // Profiler callback để log render time
  const onRender = useCallback(
    (
      id: string,
      phase: string,
      actualDuration: number,
      baseDuration: number,
      startTime: number,
      commitTime: number
    ) => {
      Sentry.captureMessage(
        `Profiler: ${id} ${phase} took ${actualDuration}ms (base: ${baseDuration}ms)`,
        "info"
      );
    },
    []
  );

  // Monitor Web Vitals
  reportWebVitals((metric) => {
    Sentry.captureMessage(`Web Vital: ${metric.name} = ${metric.value}`, "info");
  });

  return (
    <Profiler id="PerformanceProfiler" onRender={onRender}>
      <div role="region" aria-label="Performance dashboard">
        <h2>Count: {count}</h2>
        <button onClick={increment} aria-label="Increment count">
          Increment
        </button>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {computedValues.map((val, idx) => (
            <Widget key={idx} id={idx} value={val} />
          ))}
        </div>
      </div>
    </Profiler>
  );
};
```

### 2️⃣ Web Vitals (Cơ bản + Nâng cao)
- **Cơ bản**: Đo CLS (Cumulative Layout Shift), LCP (Largest Contentful Paint), FID (First Input Delay) với `web-vitals` package.
- **Nâng cao**: Gửi metrics đến analytics (Sentry hoặc console.log), tích hợp với CI/CD để monitor performance trends.

**Code Web Vitals**:
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

**Integration trong app**:
```tsx
// index.tsx
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { PerformanceProfilerEnterprise } from "./PerformanceProfiler";
import reportWebVitals from "./reportWebVitals";

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(
  <StrictMode>
    <PerformanceProfilerEnterprise />
  </StrictMode>
);

reportWebVitals(console.log); // Gửi metrics đến analytics
```

### 3️⃣ Virtualization Preview (Chuẩn bị cho Day 06)
- **Cơ bản**: Render danh sách lớn với memoization.
- **Nâng cao**: Sử dụng `react-window` để virtualize danh sách, giảm DOM nodes, và cải thiện performance.

**Code nâng cao với virtualization**:
```tsx
import { FC, useState, useCallback, useMemo, Profiler } from "react";
import { FixedSizeList as List } from "react-window";
import * as Sentry from "@sentry/react";
import reportWebVitals from "./reportWebVitals";

type WidgetProps = { id: number; value: number };
const Widget: React.FC<WidgetProps> = React.memo(({ id, value }) => {
  console.log(`Rendering Widget ${id}`);
  return (
    <div
      role="region"
      aria-label={`Widget ${id}`}
      style={{ padding: 10, margin: 5, border: "1px solid #ccc" }}
    >
      {id}: {value}
    </div>
  );
});

const PerformanceProfilerVirtualized: FC = () => {
  const [count, setCount] = useState<number>(0);
  const [values, setValues] = useState<number[]>(() =>
    Array.from({ length: 1000 }, () => Math.floor(Math.random() * 1000))
  );

  const increment = useCallback(() => setCount(c => c + 1), []);

  const computedValues = useMemo(() => {
    try {
      return values.map(v => v * 2);
    } catch (err) {
      Sentry.captureException(err);
      return [];
    }
  }, [values]);

  const onRender = useCallback(
    (id: string, phase: string, actualDuration: number) => {
      Sentry.captureMessage(`Profiler: ${id} ${phase} took ${actualDuration}ms`, "info");
    },
    []
  );

  reportWebVitals((metric) => {
    Sentry.captureMessage(`Web Vital: ${metric.name} = ${metric.value}`, "info");
  });

  return (
    <Profiler id="PerformanceProfilerVirtualized" onRender={onRender}>
      <div role="region" aria-label="Virtualized performance dashboard">
        <h2>Count: {count}</h2>
        <button onClick={increment} aria-label="Increment count">
          Increment
        </button>
        <List
          height={400}
          itemCount={computedValues.length}
          itemSize={50}
          width={300}
        >
          {({ index, style }) => (
            <div style={style}>
              <Widget id={index} value={computedValues[index]} />
            </div>
          )}
        </List>
      </div>
    </Profiler>
  );
};
```

### 4️⃣ Testing và CI/CD (Nâng cao)
- **Unit tests**: Test memoization, re-render prevention, và Web Vitals logging.
- **CI/CD**: GitHub Actions với coverage report.

**Unit test (performance.test.tsx)**:
```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { PerformanceProfilerEnterprise } from "./PerformanceProfiler";

describe("PerformanceProfilerEnterprise", () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  test("renders initial UI", () => {
    render(<PerformanceProfilerEnterprise />);
    expect(screen.getByLabelText("Increment count")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Performance dashboard" })).toBeInTheDocument();
  });

  test("prevents unnecessary re-renders", () => {
    render(<PerformanceProfilerEnterprise />);
    fireEvent.click(screen.getByLabelText("Increment count"));

    // Widget không re-render khi count thay đổi
    expect(consoleLogSpy).not.toHaveBeenCalledWith("Rendering Widget 0");
  });

  test("logs Web Vitals", () => {
    render(<PerformanceProfilerEnterprise />);
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.objectContaining({ name: expect.any(String) }));
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

### Level 1: Quan sát Re-render
**Yêu cầu**: Render 50 widget component, dùng console.log để đo re-render khi click button.

**Code giải**:
```tsx
import { FC, useState } from "react";

type WidgetProps = { id: number; value: number };
const Widget: FC<WidgetProps> = ({ id, value }) => {
  console.log(`Rendering Widget ${id}`);
  return <div>{id}: {value}</div>;
};

export const ProfilerLevel1: FC = () => {
  const [count, setCount] = useState<number>(0);
  const values = Array.from({ length: 50 }, () => Math.floor(Math.random() * 1000));

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <div>
        {values.map((val, idx) => (
          <Widget key={idx} id={idx} value={val} />
        ))}
      </div>
    </div>
  );
};
```

**Hướng dẫn**: Click button, mở console, quan sát tất cả Widget re-render.

### Level 2: Tối ưu với Memoization
**Yêu cầu**: Áp dụng `React.memo`, `useMemo`, `useCallback` để tối ưu, đo lại performance.

**Code giải**:
```tsx
import { FC, useState, useCallback, useMemo } from "react";

type WidgetProps = { id: number; value: number };
const Widget: FC<WidgetProps> = React.memo(({ id, value }) => {
  console.log(`Rendering Widget ${id}`);
  return <div>{id}: {value}</div>;
});

export const ProfilerLevel2: FC = () => {
  const [count, setCount] = useState<number>(0);
  const values = useMemo(
    () => Array.from({ length: 50 }, () => Math.floor(Math.random() * 1000)),
    []
  );

  const increment = useCallback(() => setCount(c => c + 1), []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <div>
        {values.map((val, idx) => (
          <Widget key={idx} id={idx} value={val} />
        ))}
      </div>
    </div>
  );
};
```

**Hướng dẫn**: Click button, kiểm tra console, Widget không re-render.

### Level 3: Mini Project – Dashboard
**Yêu cầu**: Dashboard 100+ widget, profile với React DevTools, tối ưu performance, log re-render, đo Web Vitals.

**Code giải**:
```tsx
import { FC, useState, useCallback, useMemo, Profiler } from "react";
import { FixedSizeList as List } from "react-window";
import * as Sentry from "@sentry/react";
import reportWebVitals from "./reportWebVitals";

type WidgetProps = { id: number; value: number };
const Widget: FC<WidgetProps> = React.memo(({ id, value }) => {
  console.log(`Rendering Widget ${id}`);
  return (
    <div
      role="region"
      aria-label={`Widget ${id}`}
      style={{ padding: 10, margin: 5, border: "1px solid #ccc" }}
    >
      {id}: {value}
    </div>
  );
});

export const ProfilerLevel3: FC = () => {
  const [count, setCount] = useState<number>(0);
  const [values, setValues] = useState<number[]>(() =>
    Array.from({ length: 1000 }, () => Math.floor(Math.random() * 1000))
  );

  const computedValues = useMemo(() => {
    try {
      return values.map(v => v * 2);
    } catch (err) {
      Sentry.captureException(err);
      return [];
    }
  }, [values]);

  const increment = useCallback(() => setCount(c => c + 1), []);

  const onRender = useCallback(
    (id: string, phase: string, actualDuration: number) => {
      Sentry.captureMessage(`Profiler: ${id} ${phase} took ${actualDuration}ms`, "info");
    },
    []
  );

  reportWebVitals((metric) => {
    Sentry.captureMessage(`Web Vital: ${metric.name} = ${metric.value}`, "info");
  });

  return (
    <Profiler id="Dashboard" onRender={onRender}>
      <div role="region" aria-label="Performance dashboard">
        <h2>Count: {count}</h2>
        <button onClick={increment} aria-label="Increment count">
          Increment
        </button>
        <List
          height={400}
          itemCount={computedValues.length}
          itemSize={50}
          width={300}
        >
          {({ index, style }) => (
            <div style={style}>
              <Widget id={index} value={computedValues[index]} />
            </div>
          )}
        </List>
      </div>
    </Profiler>
  );
};
```

**Hướng dẫn**: Mở React DevTools Profiler, record khi click button, kiểm tra render time. Console log và Sentry sẽ báo cáo Web Vitals.

---

## 🧩 Code Challenge: Enterprise Performance Dashboard

**Yêu cầu**:
- **Cơ bản**: Dashboard với 100+ widget, sử dụng `React.memo`, `useMemo`, `useCallback`, profiling với React DevTools.
- **Nâng cao**:
  - Virtualize danh sách với `react-window`.
  - Tích hợp API (JSONPlaceholder) với `useFetch` (từ Day 02).
  - Error boundary và Sentry logging.
  - Accessibility: ARIA roles, keyboard navigation.
  - Unit tests cho re-render và Web Vitals.
  - PWA: Cache API data với service worker.

**Code mẫu**:
```tsx
import { FC, useState, useCallback, useMemo, Profiler, Suspense, lazy } from "react";
import { FixedSizeList as List } from "react-window";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFetch } from "./hooks/useFetch";
import * as Sentry from "@sentry/react";
import reportWebVitals from "./reportWebVitals";

const queryClient = new QueryClient();
const Widget = lazy(() => import("./Widget"));

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

export const DashboardChallenge: FC = () => {
  const [count, setCount] = useState<number>(0);
  const { data: items, isLoading, error } = useFetch<DataItem[]>("https://jsonplaceholder.typicode.com/todos", "todos");

  const increment = useCallback(() => setCount(c => c + 1), []);

  const computedItems = useMemo(() => {
    try {
      return (items || []).map(item => ({ id: item.id, value: item.title.length }));
    } catch (err) {
      Sentry.captureException(err);
      return [];
    }
  }, [items]);

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

  if (isLoading) return <p role="status">Loading...</p>;
  if (error) return <p role="alert">Error: {error.message}</p>;

  return (
    <ErrorBoundary>
      <Profiler id="DashboardChallenge" onRender={onRender}>
        <div role="region" aria-label="Performance dashboard">
          <h2>Count: {count}</h2>
          <button onClick={increment} aria-label="Increment count">
            Increment
          </button>
          <Suspense fallback={<p role="status">Loading widgets...</p>}>
            <List
              height={400}
              itemCount={computedItems.length}
              itemSize={50}
              width={300}
            >
              {({ index, style }) => (
                <div style={style}>
                  <Widget id={computedItems[index].id} value={computedItems[index].value} />
                </div>
              )}
            </List>
          </Suspense>
        </div>
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

**Widget.tsx**:
```tsx
import { FC } from "react";

type WidgetProps = { id: number; value: number };
export const Widget: FC<WidgetProps> = React.memo(({ id, value }) => {
  console.log(`Rendering Widget ${id}`);
  return (
    <div
      role="region"
      aria-label={`Widget ${id}`}
      style={{ padding: 10, margin: 5, border: "1px solid #ccc" }}
    >
      {id}: {value}
    </div>
  );
});
```

**sw.js**:
```javascript
const CACHE_NAME = "dashboard-cache-v1";
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

**Test bổ sung (dashboard.test.tsx)**:
```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardChallenge } from "./DashboardChallenge";

const queryClient = new QueryClient();

describe("DashboardChallenge", () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  test("fetches and renders API data", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, title: "Test Todo" }]),
      })
    ) as jest.Mock;

    render(
      <QueryClientProvider client={queryClient}>
        <DashboardChallenge />
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByRole("list")).toBeInTheDocument());
  });

  test("prevents unnecessary re-renders", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DashboardChallenge />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByLabelText("Increment count"));
    expect(consoleLogSpy).not.toHaveBeenCalledWith("Rendering Widget 0");
  });
});
```

---

## 🚀 Lưu ý production-ready

- **TypeScript**: Strict mode, type-safe props/state, generic types.
- **Accessibility**: ARIA roles và keyboard navigation.
- **Performance**: Virtualization với `react-window`, memoization toàn diện.
- **Testing**: Coverage >80%, test memoization và API integration.
- **PWA**: Cache API data và assets với service worker.

---


## 🟩 Day 05 – Performance Profiling (TypeScript, Mở Rộng Enterprise Edition)

### Mở Rộng Test Cases

Mình sẽ thêm các test cases chi tiết cho `DashboardChallenge`, bao gồm:
- Test re-render với empty data và large dataset.
- Test API integration với mock fetch (thành công, lỗi, và timeout).
- Test Web Vitals và Profiler logging.
- Test accessibility (ARIA roles và keyboard navigation).
- Đảm bảo coverage >80% với Jest.

**Cài đặt test**: Cập nhật `jest.config.js` để hỗ trợ React Query và mock `react-window`.

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
};
```

**Test code mở rộng (dashboard.test.tsx)**:
```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardChallenge } from "./DashboardChallenge";
import { act } from "react-dom/test-utils";

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
    // Mock API trả về empty array
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    ) as jest.Mock;

    render(
      <QueryClientProvider client={queryClient}>
        <DashboardChallenge />
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByRole("list")).toBeInTheDocument());
    expect(screen.queryByText(/Widget \d+/)).not.toBeInTheDocument();
  });

  test("handles API success with large dataset", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve(
            Array.from({ length: 100 }, (_, i) => ({ id: i + 1, title: `Todo ${i + 1}` }))
          ),
      })
    ) as jest.Mock;

    render(
      <QueryClientProvider client={queryClient}>
        <DashboardChallenge />
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText("Widget 1")).toBeInTheDocument());
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

  test("prevents unnecessary re-renders", () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, title: "Test Todo" }]),
      })
    ) as jest.Mock;

    render(
      <QueryClientProvider client={queryClient}>
        <DashboardChallenge />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByLabelText("Increment count"));
    expect(consoleLogSpy).not.toHaveBeenCalledWith("Rendering Widget 0");
  });

  test("logs Profiler and Web Vitals", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, title: "Test Todo" }]),
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

  test("supports keyboard navigation", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, title: "Test Todo" }]),
      })
    ) as jest.Mock;

    render(
      <QueryClientProvider client={queryClient}>
        <DashboardChallenge />
      </QueryClientProvider>
    );

    const button = screen.getByLabelText("Increment count");
    fireEvent.keyDown(button, { key: "Enter" });
    expect(screen.getByText("Count: 1")).toBeInTheDocument();
  });
});
```

**Hướng dẫn test**:
- Chạy `npm test -- --coverage` để kiểm tra coverage.
- Mock `react-window` để test virtualization không phụ thuộc DOM thực.
- Mock `fetch` để test API success/error cases.
- Test accessibility bằng cách kiểm tra keyboard navigation (Enter key).

---

### Tích Hợp API Phức Tạp Hơn

Mình sẽ nâng cấp code challenge để:
- Tích hợp **pagination** với JSONPlaceholder (`_limit` và `_start`).
- Sử dụng **React Query** với retry logic và caching.
- Thêm **infinite scrolling** với `react-window-infinite-loader`.
- Cải thiện **error handling** với Sentry và fallback UI.

**Cài đặt**: Cần `react-window`, `react-window-infinite-loader`, `@tanstack/react-query`.

**Code challenge cập nhật (mở rộng API và infinite scrolling)**:
```tsx
import { FC, useState, useCallback, useMemo, Profiler, Suspense, lazy, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import InfiniteLoader from "react-window-infinite-loader";
import { VariableSizeList as List } from "react-window";
import { useFetch } from "./hooks/useFetch";
import * as Sentry from "@sentry/react";
import reportWebVitals from "./reportWebVitals";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // Retry 3 lần nếu API thất bại
      cacheTime: 5 * 60 * 1000, // Cache 5 phút
    },
  },
});

const Widget = lazy(() => import("./Widget"));

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
  const [count, setCount] = useState<number>(0);
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

  const increment = useCallback(() => setCount(c => c + 1), []);

  const computedItems = useMemo(() => {
    try {
      return allItems.map(item => ({ id: item.id, value: item.title.length }));
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

  const isItemLoaded = useCallback((index: number) => index < allItems.length, [allItems.length]);

  const getItemSize = useCallback((index: number) => {
    return computedItems[index]?.value * 2 || 50; // Dynamic size dựa trên độ dài title
  }, [computedItems]);

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
      <Profiler id="DashboardChallenge" onRender={onRender}>
        <div role="region" aria-label="Performance dashboard">
          <h2>Count: {count}</h2>
          <p role="status">Render time: {useMemo(() => performance.now().toFixed(2), [count])}ms</p>
          <button onClick={increment} aria-label="Increment count">
            Increment
          </button>
          <Suspense fallback={<p role="status">Loading widgets...</p>}>
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={data?.total || computedItems.length + 1}
              loadMoreItems={loadMoreItems}
            >
              {({ onItemsRendered, ref }) => (
                <List
                  ref={ref}
                  onItemsRendered={onItemsRendered}
                  height={400}
                  itemCount={computedItems.length}
                  itemSize={getItemSize}
                  width={300}
                >
                  {({ index, style }) => (
                    <div style={style} role="row" aria-label={`Row ${index + 1}`}>
                      {isItemLoaded(index) ? (
                        <Suspense fallback={<div>Loading item...</div>}>
                          <Widget id={computedItems[index].id} value={computedItems[index].value} />
                        </Suspense>
                      ) : (
                        <div>Loading...</div>
                      )}
                    </div>
                  )}
                </List>
              )}
            </InfiniteLoader>
          </Suspense>
        </div>
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

**Widget.tsx (không đổi)**:
```tsx
import { FC } from "react";

type WidgetProps = { id: number; value: number };
export const Widget: FC<WidgetProps> = React.memo(({ id, value }) => {
  console.log(`Rendering Widget ${id}`);
  return (
    <div
      role="region"
      aria-label={`Widget ${id}`}
      style={{ padding: 10, margin: 5, border: "1px solid #ccc" }}
    >
      {id}: {value}
    </div>
  );
});
```

**sw.js (cải thiện với stale-while-revalidate)**:
```javascript
const CACHE_NAME = "dashboard-cache-v2";
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
      return cachedResponse || fetchPromise; // Stale-while-revalidate
    })
  );
});
```

**Hướng dẫn API và infinite scrolling**:
1. **Pagination**: JSONPlaceholder hỗ trợ `_limit` và `_start` để chia trang (20 items/trang).
2. **Infinite scrolling**: `InfiniteLoader` trigger `loadMoreItems` khi scroll gần cuối, tăng `page` để fetch thêm.
3. **Dynamic size**: `getItemSize` tính kích thước item dựa trên độ dài title.
4. **Retry logic**: React Query tự retry 3 lần nếu API thất bại.
5. **Performance metrics**: Hiển thị render time trên UI (`performance.now()`).
6. **PWA**: Cache API với stale-while-revalidate để cải thiện tốc độ load.

---

### Bổ Sung Enterprise Features

1. **Dynamic Web Vitals**: Thay vì chỉ console.log, gửi metrics đến Sentry hoặc analytics endpoint.
   ```tsx
   reportWebVitals((metric) => {
     Sentry.captureMessage(`Web Vital: ${metric.name} = ${metric.value}`, "info");
     // Gửi đến analytics endpoint (giả lập)
     fetch("/api/analytics", {
       method: "POST",
       body: JSON.stringify(metric),
     }).catch(err => Sentry.captureException(err));
   });
   ```

2. **Accessibility**: Thêm focus management cho infinite list.
   ```tsx
   const listRef = useRef<any>(null);
   useEffect(() => {
     if (listRef.current) {
       listRef.current.focus();
     }
   }, []);
   // Thêm ref={listRef} vào List component
   ```

3. **Performance Metrics UI**: Hiển thị render time và Web Vitals trên dashboard.
   ```tsx
   const [renderTime, setRenderTime] = useState<number>(0);
   const onRender = useCallback(
     (id: string, phase: string, actualDuration: number) => {
       setRenderTime(actualDuration);
       Sentry.captureMessage(`Profiler: ${id} ${phase} took ${actualDuration}ms`, "info");
     },
     []
   );
   // Hiển thị trong UI
   <p role="status">Render time: {renderTime.toFixed(2)}ms</p>
   ```

---

### Lưu ý Production-Ready

- **TypeScript**: Strict mode, generic types cho API response (`FetchResponse`).
- **Accessibility**: ARIA roles (`role="row"`, `aria-label`) và keyboard navigation (Enter key).
- **Performance**: Virtualization với `react-window`, infinite scrolling, và debounce API calls.
- **Testing**: Coverage >80%, test API, memoization, và accessibility.
- **PWA**: Stale-while-revalidate caching cho API và assets.
- **Monitoring**: Web Vitals và Profiler logging gửi đến Sentry.


---
📌 [<< Ngày 04](./Day04.md) | [Ngày 06 >>](./Day06.md)