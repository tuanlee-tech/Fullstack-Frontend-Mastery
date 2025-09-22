# 🟩 Day 13 – E2E Testing (Cypress + TypeScript, Senior/Enterprise Edition)

## 🎯 Mục tiêu bài học

- **Cơ bản (giữ nguyên)**:
  - Viết **E2E tests** với **Cypress** và TypeScript để kiểm tra luồng người dùng thực tế (navigation, form submission, state updates, offline/PWA scenarios).
  - Sử dụng Cypress commands: `cy.visit`, `cy.get`, `cy.contains`, `cy.type`, `cy.click`.
  - Assertions: `.should('have.text')`, `.should('exist')`, `.should('be.visible')`.
  - Mock API calls với `cy.intercept` và fixtures.
  - Async testing với `cy.wait` và `.then()`.
  - Type-safe với TypeScript cho API responses và fixtures.
- **Nâng cao (bổ sung)**:
  - Test **complex user flows** với **Suspense** (Day 07), **concurrent rendering** (Day 08), **ErrorBoundary** (Day 09), **accessible components** (Day 10), và **virtualization** (Day 06).
  - Mock **API calls** với `cy.intercept` và fixtures để test data fetching, error handling, và pagination.
  - Test **accessibility** (ARIA roles, keyboard navigation, focus management) với Cypress accessibility plugins.
  - Test **PWA offline scenarios** với service worker caching.
  - Đảm bảo **test coverage >80%** với Cypress coverage reports.
  - Setup **CI/CD** với GitHub Actions để tự động chạy E2E tests và báo cáo coverage.
  - Tích hợp **Sentry** để log test failures trong CI/CD pipeline.
  - Tối ưu performance với **React Profiler** và **Web Vitals** logging.
- **Thực hành**: Xây dựng E2E tests cho dashboard với API fetching, virtualization, concurrent rendering, accessibility, và PWA offline support.

---

## 📚 Nội dung chi tiết (Cơ bản + Nâng cao)

### 1️⃣ E2E Testing cho Simple Login Flow (Cơ bản + Nâng cao)
- **Cơ bản**: Test login form với input, submission, và mock API calls.
- **Nâng cao**: Test accessibility, error handling, và conditional rendering.

**LoginForm component**:
```tsx
// components/LoginForm.tsx
import { FC, useState } from "react";
import { AccessibleButton } from "./AccessibleButton";

interface LoginFormProps {
  onSubmit: (username: string, password: string) => Promise<void>;
}

export const LoginForm: FC<LoginFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!username || !password) {
        setError("Username and password are required");
        return;
      }
      await onSubmit(username, password);
      setError(null);
    } catch (err) {
      setError((err as Error).message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} role="form" aria-label="Login form" data-testid="login-form">
      {error && (
        <p role="alert" data-testid="error-message">
          {error}
        </p>
      )}
      <label htmlFor="username-input" className="block mb-2">
        Username
      </label>
      <input
        id="username-input"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        data-testid="username-input"
        aria-required="true"
        disabled={isLoading}
      />
      <label htmlFor="password-input" className="block mb-2">
        Password
      </label>
      <input
        id="password-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        data-testid="password-input"
        aria-required="true"
        disabled={isLoading}
      />
      <AccessibleButton label="Login" onClick={handleSubmit} disabled={isLoading} />
    </form>
  );
};
```

**Cypress test (login.spec.ts)**:
```ts
// cypress/e2e/login.spec.ts
/// <reference types="cypress" />

interface LoginResponse {
  token?: string;
  error?: string;
}

describe("Login flow", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("renders login form", () => {
    cy.get('[data-testid="login-form"]').should("exist");
    cy.get('[data-testid="username-input"]').should("exist");
    cy.get('[data-testid="password-input"]').should("exist");
    cy.contains("Login").should("exist");
  });

  it("accepts input and submits form", () => {
    cy.intercept("POST", "/api/login", {
      statusCode: 200,
      body: { token: "abcd" } satisfies LoginResponse,
    }).as("loginRequest");

    cy.get('[data-testid="username-input"]').type("user1");
    cy.get('[data-testid="password-input"]').type("pass123");
    cy.contains("Login").click();

    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
    cy.url().should("eq", `${Cypress.config().baseUrl}/dashboard`);
  });

  it("shows error message on failed login", () => {
    cy.intercept("POST", "/api/login", {
      statusCode: 401,
      body: { error: "Invalid credentials" } satisfies LoginResponse,
    }).as("loginFail");

    cy.get('[data-testid="username-input"]').type("wronguser");
    cy.get('[data-testid="password-input"]').type("wrongpass");
    cy.contains("Login").click();

    cy.wait("@loginFail");
    cy.get('[data-testid="error-message"]').should("have.text", "Invalid credentials");
  });

  it("shows validation error for empty inputs", () => {
    cy.contains("Login").click();
    cy.get('[data-testid="error-message"]').should("have.text", "Username and password are required");
  });

  it("supports keyboard navigation", () => {
    cy.get('[data-testid="username-input"]').focus().type("user1{enter}");
    cy.get('[data-testid="error-message"]').should("have.text", "Username and password are required");
    cy.get('[data-testid="password-input"]').type("pass123{enter}");
    cy.get('[data-testid="error-message"]').should("not.exist");
  });
});
```

### 2️⃣ E2E Testing cho Enterprise Dashboard (Nâng cao)
- **Cơ bản**: Test login flow với form submission và API mocking.
- **Nâng cao**: Test dashboard với API pagination, virtualization, Suspense, concurrent rendering, ErrorBoundary, accessibility, và PWA offline scenarios.

**Dashboard component**:
```tsx
// components/Dashboard.tsx
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
// components/LazyRow.tsx
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
// components/ErrorBoundary.tsx
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
// components/AccessibleButton.tsx
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
// components/Modal.tsx
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
// hooks/useFetch.ts
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
// hooks/useDebounce.ts
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
// reportWebVitals.ts
import * as Sentry from "@sentry/react";

export default function reportWebVitals(metric: any) {
  Sentry.captureMessage(`Web Vital: ${metric.name} = ${metric.value}`, "info");
}
```

**sw.js (PWA offline support)**:
```javascript
const CACHE_NAME = "dashboard-cache-v11";
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

**Cypress test (dashboard.spec.ts)**:
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

  it("opens and closes filter modal", () => {
    cy.get('[aria-controls="filter-modal"]').click();
    cy.get('[data-testid="modal"]').should("be.visible");
    cy.get('[data-testid="filter-input"]').should("have.focus");
    cy.get('[data-testid="filter-input"]').type("{esc}");
    cy.get('[data-testid="modal"]').should("not.exist");
  });

  it("filters todos with concurrent rendering", () => {
    cy.intercept("GET", "https://jsonplaceholder.typicode.com/todos?_page=1&_limit=20&title_like=Todo", {
      statusCode: 200,
      body: { data: [{ id: 1, title: "Todo 1" }], total: 200 } satisfies TodoResponse,
    }).as("filterTodos");

    cy.get('[aria-controls="filter-modal"]').click();
    cy.get('[data-testid="filter-input"]').type("Todo");
    cy.get('[data-testid="pending-message"]').should("have.text", "Updating list...");
    cy.wait("@filterTodos");
    cy.contains("Todo 1").should("be.visible");
  });

  it("supports infinite scrolling", () => {
    cy.intercept("GET", "https://jsonplaceholder.typicode.com/todos?_page=2&_limit=20", {
      statusCode: 200,
      body: { data: [{ id: 2, title: "Todo 2" }], total: 200 } satisfies TodoResponse,
    }).as("fetchMoreTodos");

    cy.wait("@fetchTodos");
    cy.get('[data-testid="todo-list"]').scrollTo("bottom");
    cy.wait("@fetchMoreTodos");
    cy.contains("Todo 2").should("be.visible");
  });

  it("handles API error with ErrorBoundary", () => {
    cy.intercept("GET", "https://jsonplaceholder.typicode.com/todos?_page=1&_limit=20", {
      statusCode: 500,
      body: { message: "Server error" },
    }).as("fetchError");

    cy.visit("/dashboard");
    cy.wait("@fetchError");
    cy.get('[data-testid="error-boundary"]').should("be.visible");
    cy.contains("Error occurred").should("be.visible");
  });

  it("handles component error with ErrorBoundary", () => {
    cy.intercept("GET", "https://jsonplaceholder.typicode.com/todos?_page=1&_limit=20", {
      statusCode: 200,
      body: { data: Array(6).fill({ id: 1, title: "Todo 1" }), total: 200 } satisfies TodoResponse,
    }).as("fetchTodosError");

    cy.visit("/dashboard");
    cy.wait("@fetchTodosError");
    cy.get('[data-testid="error-boundary"]').should("be.visible");
    cy.contains("Error occurred").should("be.visible");
  });

  it("supports keyboard navigation in list", () => {
    cy.wait("@fetchTodos");
    cy.get('[data-testid="row-0"]').focus().type("{enter}");
    cy.contains("Row 0 clicked").should("exist"); // Note: Requires console.log to be intercepted
  });

  it("supports PWA offline mode", () => {
    cy.intercept("GET", "https://jsonplaceholder.typicode.com/todos?_page=1&_limit=20", {
      statusCode: 200,
      body: { data: [{ id: 1, title: "Todo 1" }], total: 200 } satisfies TodoResponse,
    }).as("fetchTodos");

    cy.visit("/dashboard");
    cy.wait("@fetchTodos");
    cy.contains("Todo 1").should("be.visible");

    cy.window().then(win => win.navigator.serviceWorker.controller.postMessage({ type: "offline" }));
    cy.reload();
    cy.contains("Todo 1").should("be.visible"); // Cached response
  });
});
```

**Cypress config (cypress.config.ts)**:
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

**Cypress support (cypress/support/e2e.ts)**:
```ts
/// <reference types="cypress" />

import * as Sentry from "@sentry/react";

Cypress.on("fail", (error) => {
  Sentry.captureException(error);
  throw error;
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
      - run: npm run test:unit -- --coverage
      - run: npm run test:e2e
      - name: Upload coverage
        uses: actions/upload-artifact@v3
        with:
          name: coverage-report
          path: coverage/
      - name: Notify Sentry on test failure
        if: failure()
        run: |
          curl -X POST https://sentry.io/api/0/projects/your-org/your-project/events/ \
          -H "Authorization: Bearer ${{ secrets.SENTRY_AUTH_TOKEN }}" \
          -H "Content-Type: application/json" \
          -d '{"message":"E2E test suite failed in CI/CD pipeline","level":"error"}'
```

**Jest config (jest.config.js)**:
```javascript
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

---

## 🛠️ Bài tập thực hành (Level 1 → 3, với giải đầy đủ)

### Level 1: E2E Test Cơ Bản
**Yêu cầu**: Viết E2E test để visit page và kiểm tra DOM elements hiển thị.

**Code giải**:
```tsx
// components/SimplePage.tsx
import { FC } from "react";
import { AccessibleButton } from "./AccessibleButton";

export const SimplePage: FC = () => {
  return (
    <div role="region" aria-label="Simple page">
      <h1 data-testid="title">Welcome</h1>
      <AccessibleButton label="Click Me" onClick={() => console.log("Clicked")} />
    </div>
  );
};

// cypress/e2e/simple-page.spec.ts
/// <reference types="cypress" />

describe("Simple Page", () => {
  beforeEach(() => {
    cy.visit("/simple-page");
  });

  it("renders page elements", () => {
    cy.get('[data-testid="title"]').should("have.text", "Welcome");
    cy.get('[aria-label="Click Me"]').should("be.visible");
  });
});
```

**Hướng dẫn**: Chạy `npx cypress run` để kiểm tra DOM elements hiển thị đúng.

### Level 2: Test Form + Input + Click + API
**Yêu cầu**: Test form với input, click, mock API call, và assert response.

**Code giải**:
```tsx
// components/LoginForm.tsx (reused from above)
import { FC, useState } from "react";
import { AccessibleButton } from "./AccessibleButton";

interface LoginFormProps {
  onSubmit: (username: string, password: string) => Promise<void>;
}

export const LoginForm: FC<LoginFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!username || !password) {
        setError("Username and password are required");
        return;
      }
      await onSubmit(username, password);
      setError(null);
    } catch (err) {
      setError((err as Error).message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} role="form" aria-label="Login form" data-testid="login-form">
      {error && (
        <p role="alert" data-testid="error-message">
          {error}
        </p>
      )}
      <label htmlFor="username-input" className="block mb-2">
        Username
      </label>
      <input
        id="username-input"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        data-testid="username-input"
        aria-required="true"
        disabled={isLoading}
      />
      <label htmlFor="password-input" className="block mb-2">
        Password
      </label>
      <input
        id="password-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        data-testid="password-input"
        aria-required="true"
        disabled={isLoading}
      />
      <AccessibleButton label="Login" onClick={handleSubmit} disabled={isLoading} />
    </form>
  );
};

// cypress/e2e/login-form.spec.ts
/// <reference types="cypress" />

interface LoginResponse {
  token?: string;
  error?: string;
}

describe("Login Form", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("renders form elements", () => {
    cy.get('[data-testid="login-form"]').should("exist");
    cy.get('[data-testid="username-input"]').should("exist");
    cy.get('[data-testid="password-input"]').should("exist");
    cy.contains("Login").should("exist");
  });

  it("submits form with valid credentials", () => {
    cy.intercept("POST", "/api/login", {
      statusCode: 200,
      body: { token: "abcd" } satisfies LoginResponse,
    }).as("loginRequest");

    cy.get('[data-testid="username-input"]').type("user1");
    cy.get('[data-testid="password-input"]').type("pass123");
    cy.contains("Login").click();

    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
    cy.url().should("eq", `${Cypress.config().baseUrl}/dashboard`);
  });

  it("shows error for invalid credentials", () => {
    cy.intercept("POST", "/api/login", {
      statusCode: 401,
      body: { error: "Invalid credentials" } satisfies LoginResponse,
    }).as("loginFail");

    cy.get('[data-testid="username-input"]').type("wronguser");
    cy.get('[data-testid="password-input"]').type("wrongpass");
    cy.contains("Login").click();

    cy.wait("@loginFail");
    cy.get('[data-testid="error-message"]').should("have.text", "Invalid credentials");
  });

  it("shows validation error for empty inputs", () => {
    cy.contains("Login").click();
    cy.get('[data-testid="error-message"]').should("have.text", "Username and password are required");
  });
});
```

**Hướng dẫn**: Chạy `npx cypress run` để kiểm tra form submission, API mocking, và error handling.

### Level 3: Mini Project – Test User Flow
**Yêu cầu**: Test toàn bộ luồng user flow, navigation, offline PWA, concurrent component, state update, CI/CD integration, coverage đầy đủ.

**Code giải**:
```tsx
// components/TodoApp.tsx
import { FC, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { AccessibleButton } from "../AccessibleButton";
import { Modal } from "../Modal";

interface DataItem {
  id: number;
  title: string;
}

interface FetchResponse {
  data: DataItem[];
  total: number;
}

export const TodoApp: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, error } = useFetch<FetchResponse>(
    "https://jsonplaceholder.typicode.com/todos?_page=1&_limit=10",
    ["todos"]
  );

  if (isLoading) return <p role="status" aria-live="polite" data-testid="loading">Loading...</p>;
  if (error) return <p role="alert" data-testid="error-message">{error.message}</p>;

  return (
    <div role="region" aria-label="Todo app">
      <AccessibleButton label="Open Todo Modal" onClick={() => setIsModalOpen(true)} ariaControls="todo-modal" />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Todo List">
        <ul role="list" aria-label="Todo list">
          {data?.data.map(item => (
            <li key={item.id} role="listitem" data-testid={`todo-${item.id}`}>
              {item.title}
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
};

// cypress/e2e/todo-app.spec.ts
/// <reference types="cypress" />

interface TodoResponse {
  data: { id: number; title: string }[];
  total: number;
}

describe("Todo App", () => {
  beforeEach(() => {
    cy.visit("/todos");
    cy.intercept("GET", "https://jsonplaceholder.typicode.com/todos?_page=1&_limit=10", {
      statusCode: 200,
      body: { data: [{ id: 1, title: "Todo 1" }], total: 200 } satisfies TodoResponse,
    }).as("fetchTodos");
  });

  it("renders loading state", () => {
    cy.get('[data-testid="loading"]').should("have.text", "Loading...");
  });

  it("renders todo list in modal", () => {
    cy.wait("@fetchTodos");
    cy.get('[aria-controls="todo-modal"]').click();
    cy.get('[data-testid="modal"]').should("be.visible");
    cy.get('[data-testid="todo-1"]').should("have.text", "Todo 1");
  });

  it("handles error state", () => {
    cy.intercept("GET", "https://jsonplaceholder.typicode.com/todos?_page=1&_limit=10", {
      statusCode: 500,
      body: { message: "Server error" },
    }).as("fetchError");

    cy.visit("/todos");
    cy.wait("@fetchError");
    cy.get('[data-testid="error-message"]').should("have.text", "Server error");
  });

  it("supports keyboard navigation", () => {
    cy.wait("@fetchTodos");
    cy.get('[aria-controls="todo-modal"]').focus().type("{enter}");
    cy.get('[data-testid="modal"]').should("be.visible");
    cy.get('[aria-label="Close"]').type("{enter}");
    cy.get('[data-testid="modal"]').should("not.exist");
  });
});
```

---

## 🧩 Code Challenge: Enterprise Dashboard E2E Testing

**Yêu cầu**:
- **Cơ bản**: Test simple user flows (navigation, form submission, API mocking).
- **Nâng cao**:
  - Test dashboard với API pagination (JSONPlaceholder).
  - Test virtualization (`react-window`), Suspense, concurrent rendering, ErrorBoundary, và accessibility.
  - Test PWA offline scenarios.
  - Mock API calls với `cy.intercept` và fixtures.
  - Test ARIA roles, keyboard navigation, và focus management.
  - Đảm bảo coverage >80%.
  - Tích hợp Sentry để log test failures.
  - Setup CI/CD với GitHub Actions.

**Code mẫu**: Đã cung cấp ở phần nâng cao (AccessibleDashboard và dashboard.spec.ts).

---

## 🚀 Lưu ý production-ready

- **TypeScript**: Strict mode, type-safe Cypress tests (`satisfies` cho API responses).
- **Accessibility**: Test ARIA roles, keyboard navigation, và focus management.
- **Performance**: Virtualization, lazy loading, concurrent rendering, debounce filter, API caching.
- **Testing**: Coverage >80%, test user flows, virtualization, API, accessibility, và PWA offline.
- **PWA**: Cache API data và lazy chunks với stale-while-revalidate.
- **Monitoring**: Profiler, Web Vitals, và error logging gửi đến Sentry.


---
📌 [<< Ngày 12](./Day12.md) | [Ngày 14 >>](./Day14.md)