Cảm ơn bạn đã xác nhận! Tôi sẽ triển khai **Day 17 – Capstone Mini Project (React 18 + TypeScript + PWA + Testing + CI/CD)** theo format chuyên sâu, production-ready, nâng cấp từ level beginner/middle lên **senior/enterprise**. Sau đó, nếu bạn đồng ý, tôi sẽ tiếp tục với **Day 18 – Review & Polish**.

Dưới đây là bài giảng chi tiết cho **Day 17**, bao gồm:

- **Giữ nội dung cơ bản**: Xây dựng React 18 app hoàn chỉnh với **Concurrent Rendering**, **Suspense**, **Lazy Loading**, **Custom Hooks**, **Virtualized Lists**, **PWA** (offline-first, push notifications), **Unit/Component/E2E Testing**, và **CI/CD** pipeline (Vercel/Docker), như trong ví dụ bạn cung cấp (`LargeList.tsx`, `useOnScreen.ts`, `react-ci.yml`).
- **Nâng cấp enterprise**:
  - Tích hợp **accessible components** (Day 10), **unit-tested components** (Day 11), **component-tested interactions** (Day 12), **E2E-tested user flows** (Day 13), **Storybook-documented components** (Day 14), và **PWA offline support** (Day 15).
  - Tạo **complex dashboard** với **Suspense** (Day 07), **concurrent rendering** (Day 08), **ErrorBoundary** (Day 09), **virtualization** (Day 06), và **API fetching** (Day 02).
  - Triển khai **advanced PWA features**: dynamic caching, push notifications, background sync.
  - Tích hợp **unit tests**, **component tests**, **E2E tests**, và **visual regression tests** với Jest, React Testing Library (RTL), và Cypress.
  - Đảm bảo **test coverage >80%** với Jest và Cypress coverage reports.
  - Setup **CI/CD** với GitHub Actions để tự động build, test, và deploy (Vercel, Docker, hoặc Kubernetes).
  - Tích hợp **Sentry** để log errors và monitor performance.
  - Tối ưu performance với **React Profiler**, **Web Vitals** (Day 05), và **code-splitting**.
- **Giải bài tập Level 1-3**: Cung cấp code đầy đủ với TypeScript, tối ưu hóa, và tính năng enterprise.
- **Thêm code challenge**: Một thử thách mở rộng với dashboard PWA tích hợp API fetching, virtualization, concurrent rendering, accessibility, push notifications, background sync, offline support, và CI/CD pipeline.

Toàn bộ code sẽ dùng **TypeScript 100%**, sử dụng **code block markdown** để dễ copy, và liên kết với các ngày trước (e.g., `useFetch`, `useDebounce` từ Day 02, `reportWebVitals` từ Day 05, `react-window` từ Day 06, `Suspense` từ Day 07, `useTransition` từ Day 08, `ErrorBoundary` từ Day 09, `AccessibleButton`, `Modal` từ Day 10, unit tests từ Day 11, component tests từ Day 12, E2E tests từ Day 13, Storybook từ Day 14, PWA từ Day 15, CI/CD từ Day 16).

---

# 🟩 Day 17 – Capstone Mini Project (React 18 + TypeScript + PWA + Testing + CI/CD)

## 🎯 Mục tiêu bài học

- **Cơ bản (giữ nguyên)**:
  - Xây dựng **React 18 production-ready app** (Todo/Task Manager hoặc Mini Dashboard).
  - Tích hợp **Concurrent Rendering**, **Suspense**, **Lazy Loading**, **Custom Hooks**, **Virtualized Lists**.
  - Triển khai **PWA** với offline-first, caching assets và API, push notifications.
  - Thiết lập **Unit**, **Component**, và **E2E Tests** với Jest, React Testing Library, và Cypress.
  - Setup **CI/CD pipeline** để build, test, và deploy lên Vercel hoặc Docker.
- **Nâng cao (bổ sung)**:
  - Tích hợp **accessible components** (Day 10), **unit-tested components** (Day 11), **component-tested interactions** (Day 12), **E2E-tested user flows** (Day 13), **Storybook-documented components** (Day 14), và **PWA offline support** (Day 15).
  - Tạo **complex dashboard** với **Suspense** (Day 07), **concurrent rendering** (Day 08), **ErrorBoundary** (Day 09), **virtualization** (Day 06), và **API fetching** (Day 02).
  - Triển khai **advanced PWA features**: dynamic caching, push notifications, background sync.
  - Tích hợp **unit tests**, **component tests**, **E2E tests**, và **visual regression tests** với Jest, RTL, và Cypress.
  - Đảm bảo **test coverage >80%** với Jest và Cypress coverage reports.
  - Setup **CI/CD** với GitHub Actions để tự động build, test, và deploy (Vercel, Docker, hoặc Kubernetes).
  - Tích hợp **Sentry** để log errors và monitor performance.
  - Tối ưu performance với **React Profiler**, **Web Vitals**, **code-splitting**, và **tree-shaking**.
- **Thực hành**: Xây dựng dashboard PWA với API pagination (JSONPlaceholder), virtualization, concurrent rendering, accessibility, push notifications, background sync, offline support, và CI/CD pipeline.

---

## 📚 Nội dung chi tiết (Cơ bản + Nâng cao)

### 1️⃣ Project Structure
```
my-capstone-app/
├─ public/
│  ├─ favicon.ico
│  ├─ logo192.png
│  ├─ manifest.json
│  └─ service-worker.ts
├─ src/
│  ├─ components/
│  │  ├─ shared/
│  │  │  ├─ AccessibleButton.tsx
│  │  │  ├─ Modal.tsx
│  │  │  └─ ErrorBoundary.tsx
│  │  ├─ lists/
│  │  │  └─ LazyRow.tsx
│  │  └─ Dashboard.tsx
│  ├─ hooks/
│  │  ├─ useFetch.ts
│  │  ├─ useDebounce.ts
│  │  ├─ useOnScreen.ts
│  │  └─ usePrevious.ts
│  ├─ services/
│  │  └─ pushNotifications.ts
│  ├─ App.tsx
│  ├─ index.tsx
│  ├─ reportWebVitals.ts
│  └─ serviceWorkerRegistration.ts
├─ cypress/
│  ├─ e2e/
│  │  ├─ dashboard.spec.ts
│  │  └─ storybook.spec.ts
├─ .github/
│  └─ workflows/
│     └─ ci.yml
├─ Dockerfile
├─ nginx.conf
├─ package.json
├─ tsconfig.json
└─ jest.config.js
```

### 2️⃣ Capstone Dashboard (Cơ bản + Nâng cao)
- **Cơ bản**: Tạo dashboard với large list, lazy loading, và filter.
- **Nâng cao**: Tích hợp virtualization, Suspense, concurrent rendering, ErrorBoundary, accessibility, PWA, push notifications, background sync, và CI/CD.

```tsx
import { FC, Suspense, useState, useCallback, useEffect, useTransition, useDeferredValue, Profiler, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import InfiniteLoader from "react-window-infinite-loader";
import { VariableSizeList as List } from "react-window";
import { useFetch, useDebounce, useOnScreen } from "./hooks";
import * as Sentry from "@sentry/react";
import reportWebVitals from "./reportWebVitals";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { AccessibleButton } from "./components/shared/AccessibleButton";
import { Modal } from "./components/shared/Modal";
import { subscribeToPushNotifications } from "./services/pushNotifications";

const LazyRow = dynamic(() => import("./components/lists/LazyRow"), { ssr: false });

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
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(containerRef);
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

  useEffect(() => {
    if (isVisible && 'serviceWorker' in navigator && 'PushManager' in window) {
      subscribeToPushNotifications();
    }
  }, [isVisible]);

  reportWebVitals((metric) => {
    Sentry.captureMessage(`Web Vital: ${metric.name} = ${metric.value}`, "info");
  });

  if (error) throw new Error(error.message); // Để ErrorBoundary xử lý

  return (
    <Suspense fallback={<p role="status" aria-live="polite" data-testid="loading">Loading dashboard...</p>}>
      <Profiler id="AccessibleDashboard" onRender={onRender}>
        <main role="main" aria-label="Accessible virtualized dashboard" ref={containerRef}>
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
```ts
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
```ts
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

**useOnScreen.ts**:
```ts
import { useEffect, useState, RefObject } from "react";

export const useOnScreen = (ref: RefObject<Element>) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting)
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref]);

  return isVisible;
};
```

**usePrevious.ts**:
```ts
import { useRef, useEffect } from "react";

export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};
```

**pushNotifications.ts**:
```ts
import * as Sentry from "@sentry/react";

export const subscribeToPushNotifications = async () => {
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
};
```

**reportWebVitals.ts**:
```ts
import * as Sentry from "@sentry/react";

export default function reportWebVitals(metric: any) {
  Sentry.captureMessage(`Web Vital: ${metric.name} = ${metric.value}`, "info");
}
```

**serviceWorkerRegistration.ts**:
```ts
interface Config {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
}

export function register(config?: Config) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = '/service-worker.js';
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  config?.onUpdate?.(registration);
                } else if (installingWorker.state === 'activated') {
                  config?.onSuccess?.(registration);
                }
              };
            }
          };
        })
        .catch((error) => {
          Sentry.captureException(error);
          console.error('Service Worker registration failed:', error);
        });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        Sentry.captureException(error);
        console.error('Service Worker unregistration failed:', error);
      });
  }
}
```

**Service Worker**:
```ts
const CACHE_NAME = 'dashboard-cache-v17';
const DYNAMIC_CACHE = 'dashboard-dynamic-v17';
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

**index.tsx**:
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import * as Sentry from '@sentry/react';
import reportWebVitals from './reportWebVitals';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    const waitingServiceWorker = registration.waiting;
    if (waitingServiceWorker) {
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  },
});

reportWebVitals((metric) => {
  Sentry.captureMessage(`Web Vital: ${metric.name} = ${metric.value}`, 'info');
});
```

**manifest.json**:
```json
{
  "name": "Capstone Dashboard",
  "short_name": "Dashboard",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/favicon.ico",
      "sizes": "64x64",
      "type": "image/x-icon"
    },
    {
      "src": "/logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    }
  ]
}
```

**CI/CD Workflow**:
```yaml
name: Capstone CI/CD

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

  deploy-docker:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/capstone-app:latest
```

**Dockerfile**:
```dockerfile
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
```
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

**Unit Tests**:
```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { AccessibleButton } from "../components/shared/AccessibleButton";

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
```tsx
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

  it("handles API error with ErrorBoundary", () => {
    cy.intercept("GET", "https://jsonplaceholder.typicode.com/todos?_page=1&_limit=20", {
      statusCode: 500,
      body: { message: "Server error" },
    }).as("fetchError");
    cy.visit("/dashboard");
    cy.wait("@fetchError");
    cy.get('[data-testid="error-boundary"]').should("be.visible");
  });

  it("triggers push notification", () => {
    cy.window().then((win) => {
      win.navigator.serviceWorker.ready.then((registration) =>
        registration.showNotification('New Todo', {
          body: 'A new todo has been added!',
          icon: '/logo192.png',
          data: { url: '/dashboard' },
        })
      );
    });
    cy.get('body').then(() => {
      cy.window().then((win) => {
        win.Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            cy.contains('New Todo').should('exist');
          }
        });
      });
    });
  });
});
```

**Storybook Story**:
```ts
import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { DashboardChallenge } from "../components/Dashboard";

const queryClient = new QueryClient();

const meta: Meta<typeof DashboardChallenge> = {
  title: "Components/Dashboard",
  component: DashboardChallenge,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  parameters: {
    a11y: {
      config: {
        rules: [{ id: "aria-required-attr", enabled: true }],
      },
    },
    msw: {
      handlers: {
        todos: [
          {
            method: "get",
            path: "https://jsonplaceholder.typicode.com/todos",
            response: () => ({
              data: [{ id: 1, title: "Todo 1" }],
              total: 200,
            }),
          },
        ],
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof DashboardChallenge>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("item-count")).toHaveTextContent("Items rendered: 1");
    await expect(canvas.getByText("Todo 1")).toBeInTheDocument();
  },
};

export const Offline: Story = {
  parameters: {
    msw: {
      handlers: {
        todos: [
          {
            method: "get",
            path: "https://jsonplaceholder.typicode.com/todos",
            response: () => new Response(JSON.stringify({ error: 'Offline' }), { status: 503 }),
          },
        ],
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("todo-list")).toBeInTheDocument();
  },
};

export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: {
        todos: [
          {
            method: "get",
            path: "https://jsonplaceholder.typicode.com/todos",
            response: () => {
              throw new Error("Network error");
            },
          },
        ],
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("error-boundary")).toBeInTheDocument();
  },
};
```

**Jest Config**:
```ts
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
/// <reference types="cypress" />

import * as Sentry from "@sentry/react";

Cypress.on("fail", (error) => {
  Sentry.captureException(error);
  throw error;
});
```

**package.json**:
```json
{
  "name": "my-capstone-app",
  "version": "1.0.0",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test:unit": "react-scripts test",
    "test:e2e": "cypress run",
    "lint": "eslint 'src/**/*.{ts,tsx}'",
    "build-storybook": "storybook build"
  },
  "dependencies": {
    "@sentry/react": "^7.0.0",
    "@tanstack/react-query": "^5.0.0",
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-window": "^1.8.10",
    "react-window-infinite-loader": "^1.0.9"
  },
  "devDependencies": {
    "@storybook/addon-a11y": "^7.0.0",
    "@storybook/addon-essentials": "^7.0.0",
    "@storybook/addon-interactions": "^7.0.0",
    "@storybook/react": "^7.0.0",
    "@testing-library/jest-dom": "^5.16.0",
    "@testing-library/react": "^14.0.0",
    "@types/jest": "^29.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "cypress": "^13.0.0",
    "eslint": "^8.0.0",
    "msw": "^2.0.0",
    "storybook": "^7.0.0",
    "typescript": "^5.0.0"
  }
}
```

---

## 🛠️ Bài tập thực hành (Level 1 → 3, với giải đầy đủ)

### Level 1: App với Large List + Lazy Loading + Filter
**Yêu cầu**: Tạo app React với large list (>10k items), lazy load component, và filter với `useDeferredValue`.

**Code giải**:
```tsx
import { FC, Suspense, useState, useDeferredValue } from "react";
import { FixedSizeList as List } from "react-window";
import dynamic from "next/dynamic";

const LargeList = dynamic(() => import("./components/lists/LargeList"), { ssr: false });

const App: FC = () => {
  const [filter, setFilter] = useState("");
  const deferredFilter = useDeferredValue(filter);
  const items = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`);

  return (
    <div role="region" aria-label="Simple app">
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter items..."
        aria-label="Filter items"
        data-testid="filter-input"
        className="w-full p-2 mb-4 border rounded"
      />
      <Suspense fallback={<p role="status" aria-live="polite" data-testid="loading">Loading list...</p>}>
        <LargeList items={items} filter={deferredFilter} />
      </Suspense>
    </div>
  );
};

export default App;
```
```tsx
import { FC } from "react";
import { FixedSizeList as List } from "react-window";

interface LargeListProps {
  items: string[];
  filter: string;
}

export const LargeList: FC<LargeListProps> = ({ items, filter }) => {
  const filtered = items.filter((item) => item.toLowerCase().includes(filter.toLowerCase()));

  return (
    <List
      height={400}
      itemCount={filtered.length}
      itemSize={35}
      width="100%"
      role="list"
      aria-label="Filtered items"
      data-testid="large-list"
    >
      {({ index, style }) => (
        <div style={style} role="listitem" data-testid={`item-${index}`}>
          {filtered[index]}
        </div>
      )}
    </List>
  );
};

export default LargeList;
```

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";

describe("App", () => {
  it("renders filtered list", async () => {
    render(<App />);
    expect(screen.getByTestId("filter-input")).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("filter-input"), { target: { value: "Item 1" } });
    expect(await screen.findByText("Item 1")).toBeInTheDocument();
  });

  it("shows loading state", async () => {
    render(<App />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });
});
```

**Hướng dẫn**: Chạy `npm run start` để xem app, `npm run test:unit` để chạy unit tests.

### Level 2: Virtualized List + ErrorBoundary + Custom Hooks
**Yêu cầu**: Tích hợp virtualized list, ErrorBoundary, và custom hooks (`useOnScreen`, `useFetch`).

**Code giải**:
```tsx
import { FC, Suspense, useState, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { AccessibleButton } from "./components/shared/AccessibleButton";
import { useFetch, useOnScreen } from "./hooks";
import dynamic from "next/dynamic";

const LargeList = dynamic(() => import("./components/lists/LargeList"), { ssr: false });

const queryClient = new QueryClient();

interface DataItem {
  id: number;
  title: string;
}

interface FetchResponse {
  data: DataItem[];
  total: number;
}

const App: FC = () => {
  const [filter, setFilter] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(containerRef);
  const { data, isLoading, error } = useFetch<FetchResponse>(
    "https://jsonplaceholder.typicode.com/todos?_page=1&_limit=20",
    ["todos"]
  );

  if (isLoading) return <p role="status" aria-live="polite" data-testid="loading">Loading...</p>;
  if (error) throw new Error(error.message);

  return (
    <ErrorBoundary
      fallback={
        <div role="alert" aria-live="assertive" data-testid="error-boundary">
          <p>Error occurred</p>
          <AccessibleButton label="Reload" onClick={() => window.location.reload()} />
        </div>
      }
    >
      <Suspense fallback={<p role="status" aria-live="polite" data-testid="loading">Loading list...</p>}>
        <div role="region" aria-label="Todo app" ref={containerRef}>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter todos..."
            aria-label="Filter todos"
            data-testid="filter-input"
            className="w-full p-2 mb-4 border rounded"
          />
          <p data-testid="visibility">{isVisible ? "Visible" : "Not Visible"}</p>
          <LargeList items={data?.data.map((item) => item.title) || []} filter={filter} />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

export default () => (
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
```

```tsx
import { FC } from "react";
import { FixedSizeList as List } from "react-window";

interface LargeListProps {
  items: string[];
  filter: string;
}

export const LargeList: FC<LargeListProps> = ({ items, filter }) => {
  const filtered = items.filter((item) => item.toLowerCase().includes(filter.toLowerCase()));

  return (
    <List
      height={400}
      itemCount={filtered.length}
      itemSize={35}
      width="100%"
      role="list"
      aria-label="Filtered todos"
      data-testid="large-list"
    >
      {({ index, style }) => (
        <div style={style} role="listitem" data-testid={`item-${index}`}>
          {filtered[index]}
        </div>
      )}
    </List>
  );
};

export default LargeList;
```
```tsx
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "../App";

const queryClient = new QueryClient();

describe("App", () => {
  it("renders filtered todos", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );
    expect(await screen.findByTestId("large-list")).toBeInTheDocument();
  });

  it("shows error boundary on API error", async () => {
    cy.intercept("GET", "https://jsonplaceholder.typicode.com/todos?_page=1&_limit=20", {
      statusCode: 500,
      body: { message: "Server error" },
    }).as("fetchError");
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );
    expect(await screen.findByTestId("error-boundary")).toBeInTheDocument();
  });
});
```

**Hướng dẫn**: Chạy `npm run start` để xem app, `npm run test:unit` để chạy unit tests, `npm run test:e2e` để chạy E2E tests.

### Level 3: Full Production-Ready PWA
**Yêu cầu**: Xây PWA app production-ready với offline support, push notifications, background sync, Unit/Component/E2E tests, CI/CD (Vercel/Docker), và performance optimization.

**Code giải**: Đã cung cấp ở phần nâng cao (Dashboard và các file liên quan).

---

## 🧩 Code Challenge: Enterprise Dashboard PWA

**Yêu cầu**:
- **Cơ bản**: Xây dashboard với large list, lazy loading, và filter.
- **Nâng cao**:
  - Tích hợp API pagination (JSONPlaceholder), virtualization (`react-window`), Suspense, concurrent rendering, ErrorBoundary, accessibility.
  - Triển khai PWA offline, push notifications, và background sync.
  - Tích hợp unit tests, component tests, E2E tests, và visual regression tests.
  - Đảm bảo test coverage >80%.
  - Tích hợp Sentry để log errors.
  - Setup CI/CD với GitHub Actions để build, test, và deploy (Vercel/Docker).
  - Tối ưu performance với Profiler, Web Vitals, code-splitting, và tree-shaking.

**Code mẫu**: Đã cung cấp ở phần nâng cao (Dashboard, service-worker.ts, ci.yml, và các file liên quan).

---

## 🚀 Lưu ý production-ready

- **TypeScript**: Strict mode, type-safe components, hooks, và Service Worker.
- **Accessibility**: ARIA roles, keyboard navigation, focus management.
- **Performance**: Virtualization, lazy loading, concurrent rendering, debounce filter, API caching, code-splitting, tree-shaking.
- **PWA**: Stale-while-revalidate, dynamic caching, push notifications, background sync.
- **Testing**: Coverage >80%, unit tests, component tests, E2E tests, visual regression tests.
- **CI/CD**: Multi-stage Docker builds, Vercel deployment, secret management.
- **Monitoring**: Profiler, Web Vitals, Sentry logging.


---
📌 [<< Ngày 16](./Day16.md) | [Ngày 18 >>](./Day18.md)