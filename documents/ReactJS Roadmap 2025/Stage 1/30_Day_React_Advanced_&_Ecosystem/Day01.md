# 🟩 Day 01 – React 18 Overview & Concurrent Rendering (TypeScript, Senior/Enterprise Edition)

## 🎯 Mục tiêu bài học (Nâng cấp)

- **Cơ bản (giữ nguyên)**: Hiểu và áp dụng các tính năng React 18: Concurrent Mode, Suspense, Lazy Loading, useTransition, useDeferredValue, useId. Nắm rendering strategies và tránh re-render thừa.
- **Nâng cao (bổ sung)**: 
  - Xử lý scalability cho ứng dụng enterprise (dữ liệu lớn, non-blocking UI).
  - Tích hợp error handling, accessibility, và performance monitoring (Web Vitals, React Profiler).
  - Áp dụng trong môi trường production: Type-safe code, integration với tools như Sentry (logging errors in concurrent updates), và React Query (cho Suspense-enabled data fetching).
  - Giới thiệu testing cơ bản cho concurrent features (Jest + React Testing Library) và CI/CD frontend (GitHub Actions cho auto-build/test).
- **Thực hành**: Xây dựng mini app với concurrent rendering, fallback UI, và kiểm tra hiệu suất.

---

## 📚 Nội dung chi tiết (Cơ bản + Nâng cao)

### 1️⃣ Concurrent Rendering (Cơ bản + Nâng cao)
- **Cơ bản**: Cho phép React tạm dừng/tiếp tục render để ưu tiên UI quan trọng, tránh block khi update nặng.
- **Nâng cao**: Trong enterprise, sử dụng để xử lý large-scale apps (e.g., dashboard với real-time data). Kết hợp với Web Vitals để monitor CLS (Cumulative Layout Shift) và FID (First Input Delay). Thêm error logging với Sentry để catch errors trong transitions.

**Ví dụ cơ bản (giữ nguyên)**:
```tsx
import { useState, useTransition } from "react";

export const Counter: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      for (let i = 0; i < 10000; i++) {
        setCount(c => c + 1);
      }
    });
  };

  return (
    <div>
      <button onClick={handleClick}>Increment 10k</button>
      {isPending ? <p>Updating...</p> : <p>Count: {count}</p>}
    </div>
  );
};
```

**Upgrade nâng cao**: Thêm error handling và accessibility.
```tsx
import { useState, useTransition } from "react";
import * as Sentry from "@sentry/react"; // Giả định cài Sentry cho enterprise logging

export const CounterEnterprise: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    try {
      startTransition(() => {
        for (let i = 0; i < 10000; i++) {
          setCount(c => c + 1);
        }
      });
    } catch (err) {
      const errorMsg = (err as Error).message;
      setError(errorMsg);
      Sentry.captureException(err); // Log error to Sentry in production
    }
  };

  return (
    <div aria-live="polite"> {/* Accessibility: ARIA cho screen reader */}
      <button onClick={handleClick} aria-label="Increment counter by 10k">Increment 10k</button>
      {isPending ? <p role="status">Updating...</p> : <p>Count: {count}</p>}
      {error && <p role="alert" style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};
```

### 2️⃣ Suspense & Lazy Loading (Cơ bản + Nâng cao)
- **Cơ bản**: Lazy load component để code-splitting, fallback UI khi chờ.
- **Nâng cao**: Kết hợp với React Query cho data fetching enterprise (Suspense-enabled queries). Sử dụng dynamic import với type inference cho scalability.

**Ví dụ cơ bản (giữ nguyên)**:
```tsx
import React, { Suspense, lazy } from "react";

const BigComponent = lazy(() => import("./BigComponent"));

export const App: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BigComponent />
    </Suspense>
  );
};
```

**Upgrade nâng cao**: Thêm type cho lazy component và integration với React Query.
```tsx
import React, { Suspense, lazy, ComponentType } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Enterprise data fetching

const queryClient = new QueryClient();

const BigComponent = lazy<ComponentType>(() => import("./BigComponent")); // Type inference cho lazy

export const AppEnterprise: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div aria-live="polite" role="status">Loading...</div>}>
        <BigComponent />
      </Suspense>
    </QueryClientProvider>
  );
};
```

### 3️⃣ useDeferredValue (Cơ bản + Nâng cao)
- **Cơ bản**: Trì hoãn update để tránh lag.
- **Nâng cao**: Kết hợp với debounce/throttle cho enterprise search (e.g., API calls), và Web Vitals monitoring.

**Ví dụ cơ bản (giữ nguyên)**:
```tsx
import { useState, useDeferredValue } from "react";

interface FilterListProps {
  items: string[];
}

export const FilterList: React.FC<FilterListProps> = ({ items }) => {
  const [query, setQuery] = useState<string>("");
  const deferredQuery = useDeferredValue(query);

  const filtered = items.filter(item =>
    item.toLowerCase().includes(deferredQuery.toLowerCase())
  );

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ul>
        {filtered.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  );
};
```

**Upgrade nâng cao**: Thêm error handling và accessibility.
```tsx
import { useState, useDeferredValue } from "react";
import { reportWebVitals } from "./reportWebVitals"; // Giả định hàm monitor Web Vitals

interface FilterListProps {
  items: string[];
}

export const FilterListEnterprise: React.FC<FilterListProps> = ({ items }) => {
  const [query, setQuery] = useState<string>("");
  const deferredQuery = useDeferredValue(query);
  const [error, setError] = useState<string | null>(null);

  try {
    reportWebVitals(console.log); // Monitor performance metrics
  } catch (err) {
    setError((err as Error).message);
  }

  const filtered = items.filter(item =>
    item.toLowerCase().includes(deferredQuery.toLowerCase())
  );

  return (
    <div aria-live="polite">
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        aria-label="Search items"
      />
      <ul role="list">
        {filtered.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {error && <p role="alert">Error: {error}</p>}
    </div>
  );
};
```

### 4️⃣ useId (Cơ bản + Nâng cao)
- **Cơ bản**: Tạo unique ID cho SSR.
- **Nâng cao**: Sử dụng trong forms enterprise với validation (e.g., Zod integration).

**Ví dụ cơ bản (giữ nguyên)**:
```tsx
import { useId } from "react";

export const Checkbox: React.FC = () => {
  const id = useId();
  return (
    <>
      <input type="checkbox" id={id} />
      <label htmlFor={id}>Accept</label>
    </>
  );
};
```

**Upgrade nâng cao**: Thêm ARIA và type guards.
```tsx
import { useId } from "react";

export const CheckboxEnterprise: React.FC = () => {
  const id = useId();
  return (
    <div role="group" aria-labelledby={`${id}-label`}>
      <input type="checkbox" id={id} aria-describedby={`${id}-desc`} />
      <label id={`${id}-label`} htmlFor={id}>Accept</label>
      <span id={`${id}-desc`}>Description for accessibility</span>
    </div>
  );
};
```

### 5️⃣ Root Render & Rendering Strategies (Cơ bản + Nâng cao)
- **Cơ bản**: Sử dụng `createRoot` cho Concurrent Mode.
- **Nâng cao**: Tích hợp strict mode, performance profiling, và CI/CD (GitHub Actions yaml cho build/test).

**Ví dụ cơ bản (giữ nguyên)**:
```tsx
import { createRoot } from "react-dom/client";
import { App } from "./App";

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
```

**Upgrade nâng cao**: Thêm StrictMode và Web Vitals.
```tsx
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals"; // Function to log vitals

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

reportWebVitals(console.log); // Gửi metrics đến analytics enterprise
```

**Bổ sung CI/CD cơ bản**: File `.github/workflows/ci.yml` cho frontend.
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
      - run: npm run build --if-present
      - run: npm test
```

---

## 🛠️ Bài tập thực hành (Level 1 → 3, với giải đầy đủ)

### Level 1: Cơ bản (Giữ nguyên + TS)
**Yêu cầu**: Tạo `Counter` với `useState<number>`, console.log re-render.

**Code giải**:
```tsx
import { useState, useEffect } from "react";

export const CounterLevel1: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    console.log('Component re-rendered');
  });

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
```

### Level 2: Áp dụng useTransition (Giữ nguyên + error handling)
**Yêu cầu**: Thêm useTransition cho increment >1000, fallback UI.

**Code giải**:
```tsx
import { useState, useTransition } from "react";

export const CounterLevel2: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      for (let i = 0; i < 1000; i++) {
        setCount(c => c + 1);
      }
    });
  };

  return (
    <div>
      <button onClick={handleClick}>Increment 1k</button>
      {isPending ? <p>Updating...</p> : <p>Count: {count}</p>}
    </div>
  );
};
```

### Level 3: Mini App (Nâng cấp enterprise)
**Yêu cầu**: List 1000+ items (string[]), concurrent + Suspense, type-safe.

**Code giải (với upgrade: thêm error boundary, accessibility, Web Vitals)**:
```tsx
import { useState, useTransition, Suspense, lazy } from "react";

// Giả lập list lớn
const items: string[] = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`);

// Lazy component với type
const ItemList = lazy(() => import("./ItemList")); // Assume ItemList.tsx exports ItemList: React.FC<{ items: string[] }>

export const MiniAppLevel3: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      startTransition(() => {
        setQuery(e.target.value);
      });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div aria-live="polite">
      <input
        value={query}
        onChange={handleFilter}
        placeholder="Filter items..."
        aria-label="Filter list"
      />
      {isPending && <p role="status">Filtering...</p>}
      <Suspense fallback={<div role="status">Loading List...</div>}>
        <ItemList items={filteredItems} />
      </Suspense>
      {error && <p role="alert">Error: {error}</p>}
    </div>
  );
};
```

**ItemList.tsx** (riêng file):
```tsx
import { FC } from "react";

interface ItemListProps {
  items: string[];
}

export const ItemList: FC<ItemListProps> = ({ items }) => {
  return (
    <ul role="list">
      {items.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
};
```

---

## 🧩 Code Challenge (Thêm để hiểu sâu)

**Tên**: Enterprise Search Dashboard với Concurrent Features

**Yêu cầu** (Cơ bản + Nâng cao):
- Xây dựng dashboard tìm kiếm items (từ array lớn hoặc fake API).
- Cơ bản: Sử dụng useTransition cho filter, Suspense cho lazy load list component.
- Nâng cao: 
  - Tích hợp React Query cho fetching data (Suspense-enabled).
  - Thêm error boundary (custom ErrorBoundary component).
  - Accessibility: ARIA roles cho input/list.
  - Performance: Thêm useDeferredValue cho preview kết quả, và console.log Web Vitals.
  - Testing: Viết unit test cơ bản với Jest/RTL cho component.
  - CI/CD: Thêm script test trong package.json.

**Code mẫu khởi đầu**:
```tsx
import { useState, useTransition, Suspense, lazy } from "react";
import { useQuery } from "@tanstack/react-query";

// Fake API fetch
const fetchItems = async (): Promise<string[]> => {
  return new Promise(resolve => setTimeout(() => resolve(Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`)), 1000));
};

const ItemList = lazy(() => import("./ItemList"));

class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    return this.state.hasError ? <p>Error occurred</p> : this.props.children;
  }
}

export const DashboardChallenge: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const { data: items = [] } = useQuery<string[]>({
    queryKey: ['items'],
    queryFn: fetchItems,
    suspense: true,
  });

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setQuery(e.target.value);
    });
  };

  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <ErrorBoundary>
      <div>
        <input value={query} onChange={handleFilter} aria-label="Search dashboard" />
        {isPending && <p>Filtering...</p>}
        <Suspense fallback={<p>Loading Items...</p>}>
          <ItemList items={filteredItems} />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};
```

**Hướng dẫn**:
1. Cài dependencies: `@tanstack/react-query`, `@sentry/react` (nếu dùng logging).
2. Thêm test (DashboardChallenge.test.tsx):
```tsx
import { render, screen } from "@testing-library/react";
import { DashboardChallenge } from "./DashboardChallenge";

test("renders input", () => {
  render(<DashboardChallenge />);
  expect(screen.getByLabelText("Search dashboard")).toBeInTheDocument();
});
```
3. Chạy test: `npm test`.
4. Bonus: Tích hợp Sentry và reportWebVitals cho enterprise monitoring.

---

✅ **Tip enterprise**: Sử dụng ESLint + TypeScript cho code quality, và Dockerize app cho deploy (e.g., Dockerfile đơn giản).

---
📌 [<< README React-Focused](./React-Focused.md) | [Ngày 02 >>](./Day02.md)