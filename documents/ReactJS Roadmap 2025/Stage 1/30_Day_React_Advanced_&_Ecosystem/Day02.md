Cảm ơn bạn đã xác nhận! Dưới đây là bài giảng chi tiết cho **Day 02 – Advanced Custom Hooks (TypeScript 100%)**, được nâng cấp từ level **beginner/middle** lên **senior/enterprise**. Tôi sẽ:

- **Giữ nội dung cơ bản**: Các custom hooks như `usePrevious`, `useEventListener`, `useOnScreen`, `useFetch` với logic đơn giản, dễ hiểu.
- **Bổ sung nâng cấp enterprise**:
  - Type-safe 100% với generic types, interfaces, và type guards.
  - Thêm error handling (try/catch, Sentry integration), accessibility (ARIA), và performance optimization (debounce/throttle, cleanup side effects).
  - Tích hợp testing (Jest + React Testing Library cho hooks), và CI/CD cơ bản (GitHub Actions).
  - Thêm scalability patterns như memoization trong hooks và integration với enterprise tools (React Query cho `useFetch`).
- **Giải bài tập chưa giải**: Cung cấp code đầy đủ cho Level 1-3 exercises với TypeScript, error handling, và accessibility.
- **Thêm code challenge**: Một thử thách nâng cao để thực hành custom hooks trong ứng dụng enterprise (kết hợp nhiều hooks, virtualization preview, API integration).

Toàn bộ code sẽ dùng **TypeScript 100%**, và tôi sẽ sử dụng **code block markdown** thay vì `<xaiArtifact>` để bạn dễ copy vào file markdown.

---

# 🟩 Day 02 – Advanced Custom Hooks (TypeScript, Senior/Enterprise Edition)

## 🎯 Mục tiêu bài học

- **Cơ bản (giữ nguyên)**:
  - Tạo và sử dụng các custom hooks reusable: `usePrevious`, `useEventListener`, `useOnScreen`, `useFetch`.
  - Hiểu cách tách logic, encapsulate side effects, và viết type-safe code.
  - Áp dụng hooks vào component đơn giản.
- **Nâng cao (bổ sung)**:
  - Đảm bảo **type safety** với generic types, interfaces, và type guards.
  - Tích hợp **error handling** (Sentry logging), **accessibility** (ARIA roles), và **performance optimization** (debounce/throttle, cleanup side effects).
  - Viết **unit tests** cho custom hooks với Jest + React Testing Library.
  - Tích hợp **React Query** cho `useFetch` để hỗ trợ Suspense và caching trong enterprise apps.
  - Setup **CI/CD** cơ bản với GitHub Actions để build/test hooks.
  - Áp dụng trong mini-project production-ready với scalability (xử lý danh sách lớn, lazy loading, virtualization preview).
- **Thực hành**: Xây dựng mini app với custom hooks, tích hợp API, và tối ưu hiệu suất.

---

## 📚 Nội dung chi tiết (Cơ bản + Nâng cao)

### 1️⃣ usePrevious Hook (Cơ bản + Nâng cao)
- **Cơ bản**: Lưu giá trị state trước đó để so sánh.
- **Nâng cao**: Sử dụng generic types, thêm type guards, và log state changes với Sentry cho debugging trong enterprise.

**Code cơ bản (giữ nguyên)**:
```tsx
import { useRef, useEffect } from "react";

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
```

**Usage cơ bản**:
```tsx
import { useState } from "react";
import { usePrevious } from "./hooks/usePrevious";

export const Counter: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const prev = usePrevious(count);

  return (
    <div>
      <p>Current: {count}, Previous: {prev ?? "N/A"}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
};
```

**Upgrade nâng cao**: Thêm type safety và Sentry logging.
```tsx
import { useRef, useEffect } from "react";
import * as Sentry from "@sentry/react";

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    try {
      ref.current = value;
      Sentry.captureMessage(`Previous value updated: ${JSON.stringify(value)}`, "debug"); // Log for debugging
    } catch (err) {
      Sentry.captureException(err);
    }
  }, [value]);
  return ref.current;
}
```

**Usage nâng cao**:
```tsx
import { useState } from "react";
import { usePrevious } from "./hooks/usePrevious";

export const CounterEnterprise: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const prev = usePrevious(count);

  return (
    <div aria-live="polite">
      <p>Current: {count}, Previous: {prev ?? "N/A"}</p>
      <button onClick={() => setCount(c => c + 1)} aria-label="Increment counter">
        Increment
      </button>
    </div>
  );
};
```

### 2️⃣ useEventListener Hook (Cơ bản + Nâng cao)
- **Cơ bản**: Gắn event listener với cleanup.
- **Nâng cao**: Generic types cho Window/Document/Element events, thêm debounce, và accessibility support.

**Code cơ bản (giữ nguyên)**:
```tsx
import { useEffect } from "react";

export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element: Window = window
) {
  useEffect(() => {
    element.addEventListener(eventName, handler);
    return () => {
      element.removeEventListener(eventName, handler);
    };
  }, [eventName, handler, element]);
}
```

**Upgrade nâng cao**: Thêm debounce và type safety cho Document/Element.
```tsx
import { useEffect } from "react";
import { debounce } from "lodash"; // Giả định dùng lodash để debounce

export function useEventListener<K extends keyof WindowEventMap | keyof DocumentEventMap | keyof HTMLElementEventMap>(
  eventName: K,
  handler: (event: any) => void, // Sử dụng any tạm thời, refine với type guards nếu cần
  element: Window | Document | HTMLElement = window,
  debounceMs: number = 0
) {
  useEffect(() => {
    const debouncedHandler = debounceMs ? debounce(handler, debounceMs) : handler;
    element.addEventListener(eventName as string, debouncedHandler);
    return () => {
      element.removeEventListener(eventName as string, debouncedHandler);
    };
  }, [eventName, handler, element, debounceMs]);
}
```

**Usage nâng cao**:
```tsx
import { useEventListener } from "./hooks/useEventListener";

export const KeyLogger: React.FC = () => {
  useEventListener("keydown", (e: KeyboardEvent) => console.log(e.key), window, 200);

  return (
    <div role="status" aria-live="polite">
      Press any key and check console
    </div>
  );
};
```

### 3️⃣ useOnScreen Hook (Cơ bản + Nâng cao)
- **Cơ bản**: Kiểm tra element có trong viewport.
- **Nâng cao**: Tối ưu với IntersectionObserver options, thêm type guards, và tích hợp với virtualization.

**Code cơ bản (giữ nguyên)**:
```tsx
import { useState, useEffect, RefObject } from "react";

export function useOnScreen<T extends Element>(ref: RefObject<T>): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting)
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return isIntersecting;
}
```

**Upgrade nâng cao**: Thêm options và type safety.
```tsx
import { useState, useEffect, RefObject } from "react";
import * as Sentry from "@sentry/react";

interface UseOnScreenOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useOnScreen<T extends Element>(
  ref: RefObject<T>,
  options: UseOnScreenOptions = { threshold: 0, rootMargin: "0px" }
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      Sentry.captureMessage("useOnScreen: ref.current is null");
      return;
    }
    try {
      const observer = new IntersectionObserver(
        ([entry]) => setIsIntersecting(entry.isIntersecting),
        options
      );
      observer.observe(ref.current);
      return () => observer.disconnect();
    } catch (err) {
      Sentry.captureException(err);
      return;
    }
  }, [ref, options.threshold, options.rootMargin]);

  return isIntersecting;
}
```

**Usage nâng cao**:
```tsx
import { useRef } from "react";
import { useOnScreen } from "./hooks/useOnScreen";

export const Section: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useOnScreen(ref, { threshold: 0.5 });

  return (
    <div ref={ref} role="region" aria-live="polite">
      Section is {visible ? "visible" : "hidden"}
    </div>
  );
};
```

### 4️⃣ useFetch Hook (Cơ bản + Nâng cao)
- **Cơ bản**: Fetch API với loading/error state.
- **Nâng cao**: Tích hợp React Query, thêm Suspense support, error logging, và caching.

**Code cơ bản (giữ nguyên)**:
```tsx
import { useState, useEffect } from "react";

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json() as Promise<T>;
      })
      .then(json => {
        if (mounted) setData(json);
      })
      .catch(err => {
        if (mounted) setError(err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [url]);

  return { data, loading, error };
}
```

**Upgrade nâng cao**: Chuyển sang React Query với Suspense.
```tsx
import { useQuery } from "@tanstack/react-query";
import * as Sentry from "@sentry/react";

export function useFetch<T>(url: string, queryKey: string | string[]) {
  return useQuery<T, Error>({
    queryKey: typeof queryKey === "string" ? [queryKey] : queryKey,
    queryFn: async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.statusText);
        return res.json() as Promise<T>;
      } catch (err) {
        Sentry.captureException(err);
        throw err;
      }
    },
    suspense: true,
    cacheTime: 5 * 60 * 1000, // 5 phút caching
  });
}
```

**Usage nâng cao**:
```tsx
import { FC } from "react";
import { useFetch } from "./hooks/useFetch";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

interface User {
  id: number;
  name: string;
}

export const Users: FC = () => {
  const { data, isLoading, error } = useFetch<User[]>("https://jsonplaceholder.typicode.com/users", "users");

  if (isLoading) return <p role="status">Loading...</p>;
  if (error) return <p role="alert">Error: {error.message}</p>;

  return (
    <ul role="list">
      {data?.map(u => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
};

export const App: FC = () => (
  <QueryClientProvider client={queryClient}>
    <Users />
  </QueryClientProvider>
);
```

---

## 🛠️ Bài tập thực hành (Level 1 → 3, với giải đầy đủ)

### Level 1: usePrevious
**Yêu cầu**: Tạo `usePrevious` và demo với Counter, hiển thị current vs previous.

**Code giải**:
```tsx
import { useState } from "react";
import { usePrevious } from "./hooks/usePrevious";

export const CounterLevel1: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const prev = usePrevious(count);

  return (
    <div aria-live="polite">
      <p>Current: {count}, Previous: {prev ?? "N/A"}</p>
      <button onClick={() => setCount(c => c + 1)} aria-label="Increment counter">
        Increment
      </button>
    </div>
  );
};
```

### Level 2: useEventListener
**Yêu cầu**: Tạo `useEventListener` cho `keydown` hoặc `resize`, demo với component.

**Code giải**:
```tsx
import { useEventListener } from "./hooks/useEventListener";

export const KeyLoggerLevel2: React.FC = () => {
  useEventListener("keydown", (e: KeyboardEvent) => console.log(`Key pressed: ${e.key}`), window, 200);

  return (
    <div role="status" aria-live="polite">
      Press any key and check console
    </div>
  );
};
```

### Level 3: Mini App (Enterprise)
**Yêu cầu**: Lazy load list 1000+ items + `useOnScreen` + `useFetch` (React Query) từ JSONPlaceholder, type-safe.

**Code giải**:
```tsx
import { FC, Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFetch } from "./hooks/useFetch";
import { useOnScreen } from "./hooks/useOnScreen";
import { useRef } from "react";

const queryClient = new QueryClient();
const ItemList = lazy(() => import("./ItemList")); // Assume ItemList.tsx

interface User {
  id: number;
  name: string;
}

export const MiniAppLevel3: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref, { threshold: 0.1 });
  const { data: users, isLoading, error } = useFetch<User[]>("https://jsonplaceholder.typicode.com/users", "users");

  if (isLoading) return <p role="status">Loading...</p>;
  if (error) return <p role="alert">Error: {error.message}</p>;

  return (
    <div aria-live="polite">
      <Suspense fallback={<p role="status">Loading List...</p>}>
        <div ref={ref}>
          {isVisible ? <ItemList items={users ?? []} /> : <p>List not visible</p>}
        </div>
      </Suspense>
    </div>
  );
};

export const App: FC = () => (
  <QueryClientProvider client={queryClient}>
    <MiniAppLevel3 />
  </QueryClientProvider>
);
```

**ItemList.tsx**:
```tsx
import { FC } from "react";

interface ItemListProps {
  items: { id: number; name: string }[];
}

export const ItemList: FC<ItemListProps> = ({ items }) => {
  return (
    <ul role="list">
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};
```

---

## 🧩 Code Challenge (Thêm để hiểu sâu)

**Tên**: Reusable Data Dashboard với Custom Hooks

**Yêu cầu**:
- Xây dựng dashboard hiển thị danh sách users từ JSONPlaceholder.
- Cơ bản: Sử dụng `useFetch` (React Query), `useOnScreen` để lazy load khi list visible, và `usePrevious` để log thay đổi dữ liệu.
- Nâng cao:
  - Thêm error boundary để catch lỗi từ API.
  - Accessibility: ARIA roles cho list và loading state.
  - Performance: Thêm debounce cho input filter (nếu có).
  - Testing: Viết unit test cho `useFetch` và component.
  - CI/CD: Thêm script test trong package.json và GitHub Actions.

**Code mẫu khởi đầu**:
```tsx
import { FC, Suspense, lazy, useState, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFetch, useOnScreen, usePrevious } from "./hooks";
import * as Sentry from "@sentry/react";

const queryClient = new QueryClient();
const ItemList = lazy(() => import("./ItemList"));

interface User {
  id: number;
  name: string;
}

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
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);
  const [query, setQuery] = useState<string>("");
  const { data: users, isLoading, error } = useFetch<User[]>("https://jsonplaceholder.typicode.com/users", "users");
  const prevUsers = usePrevious(users);

  if (isLoading) return <p role="status">Loading...</p>;
  if (error) return <p role="alert">Error: {error.message}</p>;

  const filteredUsers = users?.filter(u => u.name.toLowerCase().includes(query.toLowerCase())) ?? [];

  return (
    <ErrorBoundary>
      <div aria-live="polite">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Filter users"
        />
        <Suspense fallback={<p role="status">Loading List...</p>}>
          <div ref={ref}>
            {isVisible ? <ItemList items={filteredUsers} /> : <p>List not visible</p>}
          </div>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export const App: FC = () => (
  <QueryClientProvider client={queryClient}>
    <DashboardChallenge />
  </QueryClientProvider>
);
```

**Unit test** (DashboardChallenge.test.tsx):
```tsx
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardChallenge } from "./DashboardChallenge";

const queryClient = new QueryClient();

test("renders input", () => {
  render(
    <QueryClientProvider client={queryClient}>
      <DashboardChallenge />
    </QueryClientProvider>
  );
  expect(screen.getByLabelText("Filter users")).toBeInTheDocument();
});
```

**package.json scripts**:
```json
{
  "scripts": {
    "test": "jest",
    "build": "tsc && vite build"
  }
}
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
      - run: npm test
```

---

## 🚀 Lưu ý production-ready

- **TypeScript**: Luôn dùng generic types và interfaces cho hooks.
- **Error handling**: Tích hợp Sentry và try/catch trong hooks.
- **Accessibility**: Thêm ARIA roles và keyboard navigation.
- **Testing**: Đảm bảo test coverage >80% cho hooks và components.
- **Performance**: Sử dụng debounce/throttle và React Query caching.

---

**Mở rộng code challenge cho Day 02 – Advanced Custom Hooks**. Cụ thể:

- **Mở rộng challenge**: Thêm tính năng filter với debounce (sử dụng lodash hoặc custom debounce), tích hợp `useEventListener` để xử lý keyboard shortcut (e.g., Ctrl+F để focus input), và thêm PWA offline support cơ bản (sử dụng service worker để cache API data). Điều này làm cho app enterprise-ready hơn, với scalability cho dữ liệu lớn và offline-first.
- **Thêm test cases**: Thêm các unit/integration tests chi tiết với Jest + React Testing Library, bao gồm test cho custom hooks (`useFetch`, `useOnScreen`, `usePrevious`), component `DashboardChallenge`, và mock API calls. Mục tiêu coverage >80%.

---

## 🧩 Code Challenge Mở Rộng: Reusable Data Dashboard với Custom Hooks (Enterprise Edition)

**Mô tả mở rộng**:
- **Cơ bản (giữ nguyên)**: Dashboard hiển thị users từ JSONPlaceholder, sử dụng `useFetch` (React Query), `useOnScreen` để lazy load khi visible, `usePrevious` để log thay đổi dữ liệu.
- **Mở rộng mới**:
  - Thêm input filter với debounce (200ms) để tránh call filter liên tục.
  - Tích hợp `useEventListener` để keyboard shortcut (Ctrl+F focus input).
  - Thêm PWA support: Register service worker để cache data offline (sử dụng Workbox hoặc basic SW).
  - Error boundary với fallback UI và Sentry logging.
  - Virtualization preview: Nếu danh sách lớn, thêm `react-window` để virtualize list (bổ sung như một bonus).

**Yêu cầu thực hiện**:
- Cài thêm dependencies nếu cần: `lodash` (cho debounce), `@sentry/react`, `react-window` (cho virtualization).
- Sử dụng Vite hoặc CRA để build, và thêm `index.html` với manifest cho PWA.

**Code mẫu đầy đủ (mở rộng)**:

```tsx
// hooks/useDebounce.ts (Custom debounce hook nếu không dùng lodash)
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

```tsx
// DashboardChallenge.tsx (Mở rộng component chính)
import { FC, Suspense, lazy, useState, useRef, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFetch, useOnScreen, usePrevious, useEventListener } from "./hooks"; // Assume all hooks imported
import * as Sentry from "@sentry/react";
import { useDebounce } from "./hooks/useDebounce";
import React from "react";

const queryClient = new QueryClient();
const ItemList = lazy(() => import("./ItemList")); // Assume virtualized ItemList

interface User {
  id: number;
  name: string;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) {
    Sentry.captureException(error);
  }
  render() {
    return this.state.hasError ? <p role="alert">Error occurred. Please refresh.</p> : this.props.children;
  }
}

export const DashboardChallenge: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null); // For focus shortcut
  const isVisible = useOnScreen(ref);
  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce(query, 200); // Debounce filter input
  const { data: users, isLoading, error } = useFetch<User[]>("https://jsonplaceholder.typicode.com/users", "users");
  const prevUsers = usePrevious(users); // Log thay đổi dữ liệu

  // Keyboard shortcut: Ctrl+F focus input
  useEventListener("keydown", (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === "f") {
      e.preventDefault();
      listRef.current?.focus();
    }
  });

  // Log thay đổi với previous
  useEffect(() => {
    if (prevUsers && users && prevUsers.length !== users.length) {
      console.log("Users changed:", { prev: prevUsers.length, current: users?.length });
    }
  }, [users, prevUsers]);

  if (isLoading) return <p role="status">Loading...</p>;
  if (error) return <p role="alert">Error: {error.message}</p>;

  const filteredUsers = users?.filter(u => u.name.toLowerCase().includes(debouncedQuery.toLowerCase())) ?? [];

  // PWA: Register service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(reg => {
        console.log("Service Worker registered", reg);
      }).catch(err => {
        console.error("Service Worker registration failed", err);
      });
    }
  }, []);

  return (
    <ErrorBoundary>
      <div aria-live="polite">
        <input
          ref={listRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Filter users by name"
          placeholder="Filter users..."
        />
        <Suspense fallback={<p role="status">Loading List...</p>}>
          <div ref={ref}>
            {isVisible ? <ItemList items={filteredUsers} /> : <p>List not visible yet (scroll to view)</p>}
          </div>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export const App: FC = () => (
  <QueryClientProvider client={queryClient}>
    <DashboardChallenge />
  </QueryClientProvider>
);
```

**sw.js (Service Worker cho PWA offline cache)**:
```javascript
// sw.js (Đặt ở root project)
const CACHE_NAME = "dashboard-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "https://jsonplaceholder.typicode.com/users" // Cache API nếu có thể (nhưng cần xử lý dynamic)
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchResponse => {
        if (!fetchResponse || fetchResponse.status !== 200) return fetchResponse;
        const responseToCache = fetchResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return fetchResponse;
      });
    })
  );
});
```

**ItemList.tsx (Với virtualization preview sử dụng react-window)**:
```tsx
import { FC } from "react";
import { FixedSizeList as List } from "react-window";

interface ItemListProps {
  items: { id: number; name: string }[];
}

export const ItemList: FC<ItemListProps> = ({ items }) => {
  return (
    <List
      height={400} // Viewport height
      itemCount={items.length}
      itemSize={35} // Row height
      width={300}
    >
      {({ index, style }) => (
        <div style={style}>
          {items[index].name}
        </div>
      )}
    </List>
  );
};
```

**Hướng dẫn thực hiện mở rộng**:
1. Cài `react-window`: `npm install react-window`.
2. Thêm manifest.json và sw.js vào root để PWA (cập nhật index.html với link manifest).
3. Test offline: Build app, serve với HTTP server, và kiểm tra Network tab (offline mode).
4. Bonus: Thêm virtualization đầy đủ nếu items >1000 (tạo fake data lớn).

---

## 🧪 Thêm Test Cases (Với Jest + React Testing Library)

Mình sẽ thêm các test cases chi tiết cho:
- **Custom hooks**: `useFetch`, `useOnScreen`, `usePrevious`, `useDebounce`.
- **Component**: `DashboardChallenge` (render, interaction, error state).
- **Integration**: Mock API và check virtualization.

**Cài đặt**: Thêm `jest`, `@testing-library/react`, `@testing-library/jest-dom`, `@tanstack/react-query` mock nếu cần.

**package.json**:
```json
{
  "scripts": {
    "test": "jest --coverage"
  },
  "jest": {
    "setupFilesAfterEnv": ["@testing-library/jest-dom/extend-expect"]
  }
}
```

**Test code (hooks.test.tsx)**:
```tsx
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFetch, useOnScreen, usePrevious, useDebounce } from "./hooks";
import { RefObject } from "react";

const queryClient = new QueryClient();

// Test usePrevious
test("usePrevious should return previous value", () => {
  const { result, rerender } = renderHook(({ value }) => usePrevious(value), { initialProps: { value: 0 } });
  expect(result.current).toBeUndefined();

  rerender({ value: 1 });
  expect(result.current).toBe(0);

  rerender({ value: 2 });
  expect(result.current).toBe(1);
});

// Test useDebounce
test("useDebounce should debounce value", async () => {
  const { result, rerender } = renderHook(({ value }) => useDebounce(value, 100), { initialProps: { value: "initial" } });
  expect(result.current).toBe("initial");

  rerender({ value: "debounced" });
  expect(result.current).toBe("initial"); // Chưa debounce

  await waitFor(() => expect(result.current).toBe("debounced"), { timeout: 200 });
});

// Test useOnScreen (Mock IntersectionObserver)
test("useOnScreen should detect visibility", () => {
  const mockObserver = jest.fn();
  global.IntersectionObserver = jest.fn().mockImplementation((callback) => {
    mockObserver.mockImplementation(callback);
    return { observe: jest.fn(), disconnect: jest.fn() };
  });

  const ref = { current: document.createElement("div") } as RefObject<Element>;
  const { result } = renderHook(() => useOnScreen(ref));

  act(() => {
    mockObserver([{ isIntersecting: true }]);
  });
  expect(result.current).toBe(true);
});

// Test useFetch (Mock API)
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ id: 1, name: "Test User" }]),
  })
) as jest.Mock;

test("useFetch should fetch data", async () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const { result } = renderHook(() => useFetch("https://example.com", "test"), { wrapper });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toEqual([{ id: 1, name: "Test User" }]);
});

test("useFetch should handle error", async () => {
  global.fetch = jest.fn(() => Promise.reject(new Error("API Error"))) as jest.Mock;
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const { result } = renderHook(() => useFetch("https://error.com", "error"), { wrapper });
  await waitFor(() => expect(result.current.isError).toBe(true));
  expect(result.current.error?.message).toBe("API Error");
});
```

**Test code (DashboardChallenge.test.tsx)**:
```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardChallenge } from "./DashboardChallenge";

const queryClient = new QueryClient();

test("renders filter input and list", async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <DashboardChallenge />
    </QueryClientProvider>
  );

  expect(screen.getByLabelText("Filter users by name")).toBeInTheDocument();

  // Mock data loaded
  await waitFor(() => expect(screen.getByRole("list")).toBeInTheDocument());
});

test("filters users on input change (debounced)", async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <DashboardChallenge />
    </QueryClientProvider>
  );

  const input = screen.getByLabelText("Filter users by name");
  fireEvent.change(input, { target: { value: "Test" } });

  await waitFor(() => {
    // Assume filtered list renders (mock data if needed)
    expect(screen.queryByText("Non-matching user")).not.toBeInTheDocument();
  }, { timeout: 300 });
});

test("handles error state", async () => {
  // Mock error in useFetch
  jest.spyOn(console, "error").mockImplementation(() => {});
  global.fetch = jest.fn(() => Promise.reject(new Error("Fetch Error"))) as jest.Mock;

  render(
    <QueryClientProvider client={queryClient}>
      <DashboardChallenge />
    </QueryClientProvider>
  );

  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Error: Fetch Error"));
});

test("keyboard shortcut focuses input", () => {
  render(
    <QueryClientProvider client={queryClient}>
      <DashboardChallenge />
    </QueryClientProvider>
  );

  const input = screen.getByLabelText("Filter users by name");
  fireEvent.keyDown(window, { key: "f", ctrlKey: true });

  expect(document.activeElement).toBe(input);
});
```

**Hướng dẫn test**:
1. Chạy `npm test` để xem coverage (thêm `--coverage` để report).
2. Mock global objects như `fetch`, `IntersectionObserver` để test side effects.
3. Bonus: Thêm snapshot test cho component: `expect(screen.getByRole("list")).toMatchSnapshot();`.


---
📌 [<< Ngày 01](./Day01.md) | [Ngày 03 >>](./Day03.md)