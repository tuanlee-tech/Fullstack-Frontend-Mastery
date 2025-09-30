# 🟩 Day 15 – PWA & Service Workers (TypeScript, Senior/Enterprise Edition)

## 🎯 Mục tiêu bài học

- **Cơ bản (giữ nguyên)**:
  - Tạo React app hỗ trợ **offline-first** với **Service Worker** và TypeScript.
  - Cache **static assets** và **API responses** để hỗ trợ offline.
  - Triển khai **push notifications** cơ bản.
  - Hiểu cách Service Worker quản lý network requests với các chiến lược caching (cache-first, network-first, stale-while-revalidate).
  - Đăng ký Service Worker với `navigator.serviceWorker.register()`.
- **Nâng cao (bổ sung)**:
  - Tích hợp PWA với **accessible components** (Day 10), **unit-tested components** (Day 11), **component-tested interactions** (Day 12), **E2E-tested user flows** (Day 13), và **Storybook-documented components** (Day 14).
  - Tạo **complex PWA** với **Suspense** (Day 07), **concurrent rendering** (Day 08), **ErrorBoundary** (Day 09), **virtualization** (Day 06), và **API fetching** (Day 02).
  - Triển khai **advanced caching strategies** (cache-first, network-first, stale-while-revalidate) và **dynamic caching** cho API calls.
  - Tích hợp **push notifications** và **background sync** cho real-time updates.
  - Test **PWA offline scenarios** với Cypress và mock API calls.
  - Đảm bảo **test coverage >80%** với Jest và Cypress coverage reports.
  - Setup **CI/CD** với GitHub Actions để tự động build, test PWA offline support, và báo cáo coverage.
  - Tích hợp **Sentry** để log Service Worker errors và test failures trong CI/CD pipeline.
  - Tối ưu performance với **React Profiler** và **Web Vitals** logging.
- **Thực hành**: Xây dựng PWA dashboard với API fetching, virtualization, concurrent rendering, accessibility, push notifications, background sync, và offline support.

---

## 📚 Nội dung chi tiết (Cơ bản + Nâng cao)

### 1️⃣ PWA cho Simple App (Cơ bản + Nâng cao)
- **Cơ bản**: Đăng ký Service Worker, cache static assets, hỗ trợ offline.
- **Nâng cao**: Tích hợp push notifications, background sync, và accessibility.

**Simple PWA App**:
```tsx
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'your-sentry-dsn',
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

**Service Worker Registration**:
```tsx
// src/serviceWorkerRegistration.ts
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
// public/service-worker.ts
const CACHE_NAME = 'my-app-cache-v1';
const DYNAMIC_CACHE = 'my-app-dynamic-v1';
const urlsToCache = ['/', '/index.html', '/favicon.ico'];

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
        cache.match(event.request).then((cachedResponse) =>
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => cachedResponse || new Response(JSON.stringify({ error: 'Offline' }), { status: 503 }))
        )
      )
    );
  } else {
    // Cache-first for static assets
    event.respondWith(
      caches.match(event.request).then((response) => response || fetch(event.request))
    );
  }
});

self.addEventListener('push', (event: PushEvent) => {
  const data = event.data?.json() || { title: 'Notification', body: 'Hello!' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/favicon.ico',
    })
  );
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/dashboard'));
});
```

**Manifest**:
```json
// public/manifest.json
{
  "name": "My PWA App",
  "short_name": "PWA App",
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

### 2️⃣ PWA cho Enterprise Dashboard (Nâng cao)
- **Cơ bản**: Cache static assets và API responses, hỗ trợ offline.
- **Nâng cao**: Tích hợp push notifications, background sync, virtualization, Suspense, concurrent rendering, ErrorBoundary, và accessibility.

**Dashboard component**:
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
const CACHE_NAME = 'dashboard-cache-v15';
const DYNAMIC_CACHE = 'dashboard-dynamic-v15';
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

**Cypress test for PWA**:
```ts
// cypress/e2e/pwa.spec.ts
/// <reference types="cypress" />

interface TodoResponse {
  data: { id: number; title: string }[];
  total: number;
}

describe("PWA Dashboard", () => {
  beforeEach(() => {
    cy.visit("/dashboard");
    cy.intercept("GET", "https://jsonplaceholder.typicode.com/todos?_page=1&_limit=20", {
      statusCode: 200,
      body: { data: [{ id: 1, title: "Todo 1" }], total: 200 } satisfies TodoResponse,
    }).as("fetchTodos");
  });

  it("renders dashboard with cached data offline", () => {
    cy.wait("@fetchTodos");
    cy.get('[data-testid="todo-list"]').contains("Todo 1").should("be.visible");

    cy.window().then((win) => win.navigator.serviceWorker.controller?.postMessage({ type: 'offline' }));
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
    cy.get('body').then(($body) => {
      cy.window().then((win) => {
        win.Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            cy.contains('New Todo').should('exist');
          }
        });
      });
    });
  });

  it("supports background sync", () => {
    cy.intercept("GET", "https://jsonplaceholder.typicode.com/todos?_page=1&_limit=20", {
      statusCode: 200,
      body: { data: [{ id: 1, title: "Todo 1" }], total: 200 } satisfies TodoResponse,
    }).as("syncTodos");

    cy.window().then((win) => {
      win.navigator.serviceWorker.ready.then((registration) =>
        registration.sync.register('sync-todos')
      );
    });
    cy.wait("@syncTodos");
    cy.get('[data-testid="todo-list"]').contains("Todo 1").should("be.visible");
  });
});
```

**Storybook story for Dashboard**:
```tsx
// src/components/Dashboard.stories.tsx
import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { DashboardChallenge } from "./Dashboard";

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
```

**CI/CD (`.github/workflows/ci.yml`)**:
```yaml
name: PWA CI

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
      - run: npm run test:unit -- --coverage
      - run: npm run test:e2e
      - run: npm run build-storybook
      - name: Upload build
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: build/
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
          -d '{"message":"PWA build/test failed in CI/CD pipeline","level":"error"}'
```

---

## 🛠️ Bài tập thực hành (Level 1 → 3, với giải đầy đủ)

### Level 1: Register Service Worker, Cache Static Assets
**Yêu cầu**: Đăng ký Service Worker, cache static assets, kiểm tra offline.

**Code giải**:
```tsx
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

serviceWorkerRegistration.register();
```

```tsx
// src/serviceWorkerRegistration.ts
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
        .catch((error) => console.error('Service Worker registration failed:', error));
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => registration.unregister())
      .catch((error) => console.error('Service Worker unregistration failed:', error));
  }
}
```

```ts
// public/service-worker.ts
const CACHE_NAME = 'simple-cache-v1';
const urlsToCache = ['/', '/index.html', '/favicon.ico'];

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
```

```tsx
// src/App.tsx
import { FC } from "react";

export const App: FC = () => (
  <div role="region" aria-label="Simple PWA">
    <h1 data-testid="title">Welcome to PWA</h1>
  </div>
);
```

```ts
// cypress/e2e/simple-pwa.spec.ts
/// <reference types="cypress" />

describe("Simple PWA", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("renders offline", () => {
    cy.get('[data-testid="title"]').should("have.text", "Welcome to PWA");
    cy.window().then((win) => win.navigator.serviceWorker.controller?.postMessage({ type: 'offline' }));
    cy.reload();
    cy.get('[data-testid="title"]').should("have.text", "Welcome to PWA");
  });
});
```

**Hướng dẫn**: Chạy `npm run build` và `npx serve -s build` để kiểm tra offline support.

### Level 2: Fetch Interception, Dynamic Caching
**Yêu cầu**: Thêm fetch interception, cache dynamic API requests, offline fallback page.

**Code giải**:
```tsx
// src/App.tsx
import { FC } from "react";
import { useFetch } from "./hooks/useFetch";

interface DataItem {
  id: number;
  title: string;
}

interface FetchResponse {
  data: DataItem[];
  total: number;
}

export const App: FC = () => {
  const { data, isLoading, error } = useFetch<FetchResponse>(
    "https://jsonplaceholder.typicode.com/todos?_page=1&_limit=10",
    ["todos"]
  );

  if (isLoading) return <p role="status" aria-live="polite" data-testid="loading">Loading...</p>;
  if (error) return <p role="alert" data-testid="error-message">Offline</p>;

  return (
    <div role="region" aria-label="Todo app">
      <ul role="list" aria-label="Todo list">
        {data?.data.map((item) => (
          <li key={item.id} role="listitem" data-testid={`todo-${item.id}`}>
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

```ts
// public/service-worker.ts
const CACHE_NAME = 'todo-cache-v1';
const DYNAMIC_CACHE = 'todo-dynamic-v1';
const urlsToCache = ['/', '/index.html', '/favicon.ico'];

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event: FetchEvent) => {
  const url = new URL(event.request.url);
  if (url.pathname.includes('jsonplaceholder.typicode.com')) {
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
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => response || fetch(event.request))
    );
  }
});
```

```ts
// cypress/e2e/todo-pwa.spec.ts
/// <reference types="cypress" />

interface TodoResponse {
  data: { id: number; title: string }[];
  total: number;
}

describe("Todo PWA", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.intercept("GET", "https://jsonplaceholder.typicode.com/todos?_page=1&_limit=10", {
      statusCode: 200,
      body: { data: [{ id: 1, title: "Todo 1" }], total: 200 } satisfies TodoResponse,
    }).as("fetchTodos");
  });

  it("renders todos offline", () => {
    cy.wait("@fetchTodos");
    cy.get('[data-testid="todo-1"]').should("have.text", "Todo 1");
    cy.window().then((win) => win.navigator.serviceWorker.controller?.postMessage({ type: 'offline' }));
    cy.reload();
    cy.get('[data-testid="todo-1"]').should("have.text", "Todo 1");
  });

  it("shows offline fallback", () => {
    cy.intercept("GET", "https://jsonplaceholder.typicode.com/todos?_page=1&_limit=10", {
      statusCode: 503,
      body: { error: "Offline" },
    }).as("fetchError");
    cy.visit("/");
    cy.wait("@fetchError");
    cy.get('[data-testid="error-message"]').should("have.text", "Offline");
  });
});
```

**Hướng dẫn**: Chạy `npm run build` và `npx serve -s build` để kiểm tra offline API caching.

### Level 3: Mini Project – Production-Ready PWA
**Yêu cầu**: Xây PWA app production-ready, offline-first, push notifications, background sync, deployable, tích hợp CI/CD.

**Code giải**: Đã cung cấp ở phần nâng cao (Dashboard và service-worker.ts).

---

## 🧩 Code Challenge: Enterprise Dashboard PWA

**Yêu cầu**:
- **Cơ bản**: Cache static assets và API responses, hỗ trợ offline.
- **Nâng cao**:
  - Tích hợp API pagination (JSONPlaceholder), virtualization (`react-window`), Suspense, concurrent rendering, ErrorBoundary, accessibility.
  - Triển khai push notifications và background sync.
  - Test offline scenarios với Cypress.
  - Đảm bảo coverage >80%.
  - Tích hợp Sentry để log Service Worker errors.
  - Setup CI/CD với GitHub Actions.

**Code mẫu**: Đã cung cấp ở phần nâng cao (Dashboard, service-worker.ts, và pwa.spec.ts).

---

## 🚀 Lưu ý production-ready

- **TypeScript**: Strict mode, type-safe Service Worker (`ExtendableEvent`, `FetchEvent`).
- **Accessibility**: ARIA roles, keyboard navigation, focus management.
- **Performance**: Virtualization, lazy loading, concurrent rendering, debounce filter, API caching.
- **PWA**: Stale-while-revalidate, dynamic caching, push notifications, background sync.
- **Testing**: Coverage >80%, test offline scenarios, accessibility, and interactions.
- **Monitoring**: Profiler, Web Vitals, and error logging gửi đến Sentry.


---
📌 [<< Ngày 14](./Day14.md) | [Ngày 16 >>](./Day16.md)