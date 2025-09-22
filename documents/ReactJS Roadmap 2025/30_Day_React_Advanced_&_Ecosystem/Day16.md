# 🟩 Day 16 – CI/CD for Frontend (React + TypeScript, Senior/Enterprise Edition)

## 🎯 Mục tiêu bài học

- **Cơ bản (giữ nguyên)**:
  - Thiết lập **CI/CD pipeline** cho React app với TypeScript.
  - Tự động chạy **lint**, **unit tests**, **build**, và **deploy** lên Vercel hoặc Docker.
  - Kiểm tra **test coverage**, **linting**, và **PWA build** trong pipeline.
  - Hiểu workflow: Dev → Commit → CI → Deploy.
- **Nâng cao (bổ sung)**:
  - Tích hợp CI/CD với **accessible components** (Day 10), **unit-tested components** (Day 11), **component-tested interactions** (Day 12), **E2E-tested user flows** (Day 13), **Storybook-documented components** (Day 14), và **PWA offline support** (Day 15).
  - Tạo **complex CI/CD pipeline** hỗ trợ **Suspense** (Day 07), **concurrent rendering** (Day 08), **ErrorBoundary** (Day 09), và **virtualization** (Day 06).
  - Tự động chạy **unit tests**, **component tests**, **E2E tests**, và **visual regression tests** trong pipeline.
  - Đảm bảo **test coverage >80%** với Jest và Cypress coverage reports.
  - Tích hợp **Sentry** để log build/test failures và monitor production errors.
  - Tối ưu performance với **React Profiler** và **Web Vitals** logging.
  - Triển khai **multi-stage Docker builds** và deploy lên **Vercel**, **Netlify**, hoặc **Kubernetes**.
  - Quản lý **environment variables** và **secrets** an toàn trong CI/CD.
  - Kiểm tra **PWA offline support** và **Service Worker caching** trong pipeline.
- **Thực hành**: Xây dựng CI/CD pipeline cho dashboard PWA với API fetching, virtualization, concurrent rendering, accessibility, push notifications, background sync, và offline testing.

---

## 📚 Nội dung chi tiết (Cơ bản + Nâng cao)

### 1️⃣ CI/CD Pipeline Cơ Bản (Cơ bản + Nâng cao)
- **Cơ bản**: Tạo GitHub Actions workflow để chạy lint, test, và build.
- **Nâng cao**: Tích hợp E2E tests, Storybook visual regression, PWA offline testing, và Sentry logging.

**GitHub Actions Workflow**:
```yaml
# .github/workflows/ci.yml
name: React CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run lint
        run: npm run lint

      - name: Run unit tests
        run: npm run test:unit -- --coverage --watchAll=false

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          CI: true

      - name: Build Storybook
        run: npm run build-storybook

      - name: Build app
        run: npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.REACT_APP_API_URL }}
          REACT_APP_SENTRY_DSN: ${{ secrets.REACT_APP_SENTRY_DSN }}

      - name: Upload build artifact
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: build/

      - name: Upload Storybook artifact
        uses: actions/upload-artifact@v3
        with:
          name: storybook-static
          path: storybook-static/

      - name: Upload coverage
        uses: actions/upload-artifact@v3
        with:
          name: coverage-report
          path: coverage/

      - name: Notify Sentry on failure
        if: failure()
        run: |
          curl -X POST https://sentry.io/api/0/projects/your-org/your-project/events/ \
          -H "Authorization: Bearer ${{ secrets.SENTRY_AUTH_TOKEN }}" \
          -H "Content-Type: application/json" \
          -d '{"message":"CI/CD pipeline failed","level":"error"}'

  deploy-vercel:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Download build artifact
        uses: actions/download-artifact@v3
        with:
          name: build
          path: build/

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./build
```

**Dockerfile**:
```dockerfile
# Dockerfile
# Stage 1: Build
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Nginx Config**:
```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg)$ {
        expires 365d;
        access_log off;
        add_header Cache-Control "public";
    }
}
```

**Environment Variables**:
```env
# .env
REACT_APP_API_URL=https://jsonplaceholder.typicode.com
REACT_APP_SENTRY_DSN=your-sentry-dsn
```

**Secrets Setup**:
- Trong GitHub repo → Settings → Secrets and variables → Actions:
  - Thêm `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `SENTRY_AUTH_TOKEN`, `REACT_APP_API_URL`, `REACT_APP_SENTRY_DSN`.

### 2️⃣ CI/CD Pipeline cho Enterprise Dashboard (Nâng cao)
- **Cơ bản**: Chạy lint, unit tests, build, và deploy.
- **Nâng cao**: Tích hợp E2E tests, Storybook visual regression, PWA offline testing, và Kubernetes deployment.

**Dashboard Component**:
```tsx
// src/components/Dashboard.tsx
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
    `${process.env.REACT_APP_API_URL}/todos?_page=${page}&_limit=20${deferredFilter ? `&title_like=${deferredFilter}` : ""}`,
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

  const subscribeToPush = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'your-vapid-public-key',
      });
      await fetch('/api/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: { 'Content-Type': 'application/json' },
      });
      Sentry.captureMessage('Push subscription successful', 'info');
    } catch (err) {
      Sentry.captureException(err);
    }
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      subscribeToPush();
    }
  }, [subscribeToPush]);

  reportWebVitals((metric) => {
    Sentry.captureMessage(`Web Vital: ${metric.name} = ${metric.value}`, "info");
  });

  if (error) throw new Error(error.message); // Để ErrorBoundary xử lý

  return (
    <Suspense fallback={<p role="status" aria-live="polite" data-testid="loading">Loading dashboard...</p>}>
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
                data-testid="filter-input"
              />
              <AccessibleButton label="Apply Filter" onClick={() => setIsModalOpen(false)} />
            </form>
          </Modal>
          <section aria-live="polite">
            <p data-testid="item-count">Items rendered: {filteredItems.length}</p>
            {isPending && <p role="status" data-testid="pending-message">Updating list...</p>}
            <Suspense fallback={<p role="status" aria-live="polite" data-testid="list-loading">Loading list...</p>}>
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
                    data-testid="todo-list"
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
      <div role="alert" aria-live="assertive" data-testid="error-boundary">
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
// src/components/LazyRow.tsx
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
        data-testid={`row-${index}`}
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
// src/components/ErrorBoundary.tsx
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
          <div role="alert" aria-live="assertive" data-testid="error-boundary">
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
// src/components/AccessibleButton.tsx
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
// src/components/Modal.tsx
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
      data-testid="modal"
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

**useFetch.ts**:
```tsx
// src/hooks/useFetch.ts
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

**useDebounce.ts**:
```tsx
// src/hooks/useDebounce.ts
import { useState, useEffect } from "react";

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
```

**reportWebVitals.ts**:
```tsx
// src/reportWebVitals.ts
import * as Sentry from "@sentry/react";

export default function reportWebVitals(metric: any) {
  Sentry.captureMessage(`Web Vital: ${metric.name} = ${metric.value}`, "info");
}
```

**Service Worker**:
```ts
// public/service-worker.ts
const CACHE_NAME = 'dashboard-cache-v16';
const DYNAMIC_CACHE = 'dashboard-dynamic-v16';
const urlsToCache = ['/', '/index.html', '/favicon.ico', '/logo192.png'];

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  const cacheWhitelist = [CACHE_NAME, DYNAMIC_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event: FetchEvent) => {
  const url = new URL(event.request.url);
  if (url.pathname.includes('jsonplaceholder.typicode.com')) {
    // Stale-while-revalidate for API calls
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then((cache) =>
        cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => cachedResponse || new Response(JSON.stringify({ error: 'Offline' }), { status: 503 }));
          return cachedResponse || fetchPromise;
        })
      )
    );
  } else if (url.pathname.includes('.chunk.js')) {
    // Cache-first for lazy-loaded chunks
    event.respondWith(
      caches.match(event.request).then((response) => response || fetch(event.request))
    );
  } else {
    // Cache-first for static assets
    event.respondWith(
      caches.match(event.request).then((response) => response || fetch(event.request))
    );
  }
});

self.addEventListener('push', (event: PushEvent) => {
  const data = event.data?.json() || { title: 'New Todo', body: 'A new todo has been added!' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/logo192.png',
      data: { url: '/dashboard' },
    })
  );
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/dashboard') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});

self.addEventListener('sync', (event: SyncEvent) => {
  if (event.tag === 'sync-todos') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then((cache) =>
        fetch('https://jsonplaceholder.typicode.com/todos?_page=1&_limit=20')
          .then((response) => cache.put('https://jsonplaceholder.typicode.com/todos?_page=1&_limit=20', response))
          .catch((err) => Sentry.captureException(err))
      )
    );
  }
});
```

**Unit Tests**:
```tsx
// src/components/__tests__/AccessibleButton.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { AccessibleButton } from "../AccessibleButton";

describe("AccessibleButton", () => {
  it("renders with correct label", () => {
    render(<AccessibleButton label="Click Me" onClick={() => {}} />);
    expect(screen.getByRole("button", { name: "Click Me" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<AccessibleButton label="Click Me" onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<AccessibleButton label="Click Me" onClick={() => {}} disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

**E2E Tests**:
```ts
// cypress/e2e/dashboard.spec.ts
/// <reference types="cypress" />

interface TodoResponse {
  data: { id: number; title: string }[];
  total: number;
}

describe("Accessible Dashboard", () => {
  beforeEach(() => {
    cy.visit("/dashboard");
    cy.intercept("GET", "https://jsonplaceholder.typicode.com/todos?_page=1&_limit=20", {
      statusCode: 200,
      body: { data: [{ id: 1, title: "Todo 1" }], total: 200 } satisfies TodoResponse,
    }).as("fetchTodos");
  });

  it("renders dashboard with initial data", () => {
    cy.wait("@fetchTodos");
    cy.get('[data-testid="todo-list"]').should("exist");
    cy.contains("Todo 1").should("be.visible");
    cy.get('[data-testid="item-count"]').should("have.text", "Items rendered: 1");
  });

  it("supports PWA offline mode", () => {
    cy.wait("@fetchTodos");
    cy.get('[data-testid="todo-list"]').contains("Todo 1").should("be.visible");
    cy.window().then((win) => win.navigator.serviceWorker.controller?.postMessage({ type: "offline" }));
    cy.reload();
    cy.get('[data-testid="todo-list"]').contains("Todo 1").should("be.visible");
  });
});
```

**Storybook Tests**:
```ts
// cypress/e2e/storybook.spec.ts
/// <reference types="cypress" />

describe("Storybook Visual Regression", () => {
  beforeEach(() => {
    cy.visit("http://localhost:6006");
  });

  it("renders Dashboard story", () => {
    cy.visit("http://localhost:6006/iframe.html?id=components-dashboard--default");
    cy.get('[data-testid="item-count"]').should("have.text", "Items rendered: 1");
    cy.get('[data-testid="todo-list"]').contains("Todo 1").should("be.visible");
  });

  it("tests accessibility in Dashboard story", () => {
    cy.visit("http://localhost:6006/iframe.html?id=components-dashboard--default");
    cy.injectAxe();
    cy.checkA11y();
  });
});
```

**Jest Config**:
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

**Cypress Config**:
```ts
// cypress.config.ts
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.spec.ts",
    supportFile: "cypress/support/e2e.ts",
  },
  env: {
    coverage: true,
  },
});
```

**Cypress Support**:
```ts
// cypress/support/e2e.ts
/// <reference types="cypress" />

import * as Sentry from "@sentry/react";

Cypress.on("fail", (error) => {
  Sentry.captureException(error);
  throw error;
});
```

---

## 🛠️ Bài tập thực hành (Level 1 → 3, với giải đầy đủ)

### Level 1: GitHub Actions Cơ Bản
**Yêu cầu**: Tạo GitHub Actions chạy lint, test, và build khi push code.

**Code giải**:
```yaml
# .github/workflows/ci.yml
name: React CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run lint
        run: npm run lint

      - name: Run unit tests
        run: npm run test:unit -- --coverage --watchAll=false

      - name: Build app
        run: npm run build
```

```tsx
// src/App.tsx
import { FC } from "react";

export const App: FC = () => (
  <div role="region" aria-label="Simple app">
    <h1 data-testid="title">Welcome</h1>
  </div>
);
```

```tsx
// src/__tests__/App.test.tsx
import { render, screen } from "@testing-library/react";
import { App } from "../App";

describe("App", () => {
  it("renders title", () => {
    render(<App />);
    expect(screen.getByTestId("title")).toHaveTextContent("Welcome");
  });
});
```

**Hướng dẫn**: Đẩy code lên GitHub, kiểm tra Actions tab để xem pipeline.

### Level 2: Auto-Deploy lên Vercel
**Yêu cầu**: Tự động deploy lên Vercel sau khi CI pass; verify app hoạt động.

**Code giải**:
```yaml
# .github/workflows/ci.yml
name: React CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run lint
        run: npm run lint

      - name: Run unit tests
        run: npm run test:unit -- --coverage --watchAll=false

      - name: Build app
        run: npm run build

      - name: Upload build artifact
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: build/

  deploy-vercel:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Download build artifact
        uses: actions/download-artifact@v3
        with:
          name: build
          path: build/

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./build
```

**Hướng dẫn**: 
1. Tạo project trên Vercel, lấy `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
2. Thêm secrets vào GitHub repo.
3. Đẩy code lên `main`, kiểm tra Vercel dashboard để verify deployment.

### Level 3: Full CI/CD Pipeline cho PWA
**Yêu cầu**: Xây full CI/CD pipeline cho PWA React app (lint, test, build, deploy Docker/Vercel), check offline + coverage report.

**Code giải**: Đã cung cấp ở phần nâng cao (Dashboard, ci.yml, Dockerfile).

---

## 🧩 Code Challenge: Enterprise Dashboard CI/CD

**Yêu cầu**:
- **Cơ bản**: Chạy lint, unit tests, build, và deploy.
- **Nâng cao**:
  - Tích hợp API pagination (JSONPlaceholder), virtualization, Suspense, concurrent rendering, ErrorBoundary, accessibility.
  - Chạy E2E tests, Storybook visual regression, và PWA offline tests.
  - Đảm bảo coverage >80%.
  - Tích hợp Sentry để log errors.
  - Deploy lên Vercel và Docker/Kubernetes.

**Code mẫu**: Đã cung cấp ở phần nâng cao (Dashboard, ci.yml, Dockerfile).

---

## 🚀 Lưu ý production-ready

- **TypeScript**: Strict mode, type-safe components, hooks, và Service Worker.
- **Accessibility**: ARIA roles, keyboard navigation, focus management.
- **Performance**: Virtualization, lazy loading, concurrent rendering, debounce filter, API caching.
- **Testing**: Coverage >80%, unit tests, component tests, E2E tests, visual regression tests.
- **PWA**: Stale-while-revalidate, dynamic caching, push notifications, background sync.
- **CI/CD**: Multi-stage Docker builds, Vercel deployment, secret management.
- **Monitoring**: Profiler, Web Vitals, Sentry logging.


---
📌 [<< Ngày 15](./Day15.md) | [Ngày 17 >>](./Day17.md)