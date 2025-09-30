# 🟩 Day 12 – Component Testing (TypeScript, Senior/Enterprise Edition)

## 🎯 Mục tiêu bài học

- **Cơ bản (giữ nguyên)**:
  - Viết **component tests** với **React Testing Library (RTL)** và TypeScript để kiểm tra tương tác người dùng (click, input, select, keyboard).
  - Sử dụng RTL queries (`getByText`, `getByRole`, `findByTestId`) và async testing (`waitFor`, `findBy*`).
  - Kiểm tra **DOM changes**, **state updates**, và **conditional rendering**.
  - Mock functions với `jest.fn()` và đảm bảo type-safe với TypeScript.
- **Nâng cao (bổ sung)**:
  - Test **complex components** với **Suspense** (Day 07), **concurrent rendering** (Day 08), **ErrorBoundary** (Day 09), **accessible components** (Day 10), và **virtualization** (Day 06).
  - Mock **API calls** với `msw` hoặc `jest-fetch-mock` để test async data fetching.
  - Test **accessibility** (ARIA roles, keyboard navigation, focus management).
  - Đảm bảo **test coverage >80%** với Jest coverage reports.
  - Setup **CI/CD** với GitHub Actions để tự động build/test và báo cáo coverage.
  - Tích hợp **Sentry** để log test failures trong CI/CD pipeline.
  - Tối ưu performance với **React Profiler** và **Web Vitals** logging.
- **Thực hành**: Xây dựng dashboard với component tests đầy đủ, tích hợp API, virtualization, concurrent rendering, accessibility, và ErrorBoundary.

---

## 📚 Nội dung chi tiết (Cơ bản + Nâng cao)

### 1️⃣ Component Testing cho Simple Component (Cơ bản + Nâng cao)
- **Cơ bản**: Test `LoginForm` với input changes, form submission, và DOM rendering.
- **Nâng cao**: Test accessibility, mock API calls, và conditional rendering.

**LoginForm component**:
```tsx
// components/LoginForm.tsx
import { FC, useState } from "react";
import { AccessibleButton } from "./AccessibleButton";

interface LoginFormProps {
  onSubmit: (username: string, password: string) => void;
}

export const LoginForm: FC<LoginFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }
    onSubmit(username, password);
  };

  return (
    <form onSubmit={handleSubmit} role="form" aria-label="Login form">
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
      />
      <AccessibleButton label="Login" onClick={handleSubmit} />
    </form>
  );
};
```

**LoginForm test**:
```tsx
// __tests__/LoginForm.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../components/LoginForm";

describe("LoginForm component", () => {
  test("renders inputs and button", () => {
    render(<LoginForm onSubmit={() => {}} />);
    expect(screen.getByTestId("username-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByLabelText("Login")).toBeInTheDocument();
  });

  test("updates input values on change", async () => {
    render(<LoginForm onSubmit={() => {}} />);
    const username = screen.getByTestId("username-input") as HTMLInputElement;
    const password = screen.getByTestId("password-input") as HTMLInputElement;

    await userEvent.type(username, "testuser");
    await userEvent.type(password, "123456");

    expect(username.value).toBe("testuser");
    expect(password.value).toBe("123456");
  });

  test("calls onSubmit with username and password", async () => {
    const handleSubmit = jest.fn();
    render(<LoginForm onSubmit={handleSubmit} />);

    await userEvent.type(screen.getByTestId("username-input"), "user1");
    await userEvent.type(screen.getByTestId("password-input"), "pass1");
    await userEvent.click(screen.getByLabelText("Login"));

    expect(handleSubmit).toHaveBeenCalledWith("user1", "pass1");
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  test("displays error when inputs are empty", async () => {
    render(<LoginForm onSubmit={() => {}} />);
    await userEvent.click(screen.getByLabelText("Login"));
    expect(screen.getByTestId("error-message")).toHaveTextContent("Username and password are required");
  });

  test("matches snapshot", () => {
    const { container } = render(<LoginForm onSubmit={() => {}} />);
    expect(container).toMatchSnapshot();
  });
});
```

### 2️⃣ Component Testing cho Enterprise Dashboard (Nâng cao)
- **Cơ bản**: Test simple component interactions (e.g., `LoginForm`).
- **Nâng cao**: Test dashboard với API fetching, virtualization, Suspense, concurrent rendering, ErrorBoundary, và accessibility.

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
            <p data-testid="item-count">Items rendered: {filteredItems.length}</p>
            {isPending && <p role="status" data-testid="pending-message">Updating list...</p>}
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

**Dashboard test**:
```tsx
// __tests__/Dashboard.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Sentry from "@sentry/react";
import { App } from "../components/Dashboard";

describe("AccessibleDashboard", () => {
  let consoleLogSpy: jest.SpyInstance;
  let sentrySpy: jest.SpyInstance;
  let queryClient: QueryClient;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    sentrySpy = jest.spyOn(Sentry, "captureException").mockImplementation();
    queryClient = new QueryClient();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    sentrySpy.mockRestore();
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
    expect(sentrySpy).toHaveBeenCalled();
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
    expect(sentrySpy).toHaveBeenCalled();
  });

  test("supports concurrent filtering", async () => {
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
    await userEvent.click(button);
    const input = screen.getByLabelText("Filter todos");
    await userEvent.type(input, "Todo");
    expect(screen.getByTestId("pending-message")).toHaveTextContent("Updating list...");
    await waitFor(() => expect(screen.getByText("Todo 1")).toBeInTheDocument());
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
        <App />
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText("Todo 1")).toBeInTheDocument());
    fireEvent.scroll(screen.getByRole("grid"), { target: { scrollTop: 1000 } });
    await waitFor(() => expect(screen.getByText("Todo 2")).toBeInTheDocument());
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

    const row = await screen.findByTestId("row-0");
    await userEvent.type(row, "{enter}");
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
    await userEvent.click(button);
    const modalInput = await screen.findByLabelText("Filter todos");
    expect(modalInput).toHaveFocus();

    await userEvent.type(modalInput, "{esc}");
    await waitFor(() => expect(screen.queryByTestId("modal")).not.toBeInTheDocument());
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
    await userEvent.click(button);
    const modalInput = await screen.findByLabelText("Filter todos");
    const modalButton = screen.getByLabelText("Apply Filter");

    await userEvent.tab();
    expect(modalInput).toHaveFocus();
  });

  test("matches snapshot", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [{ id: 1, title: "Todo 1" }], total: 200 }),
      })
    ) as jest.Mock;

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText("Todo 1")).toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });
});
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

**sw.js (cache API và lazy chunks)**:
```javascript
const CACHE_NAME = "dashboard-cache-v10";
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
      - name: Notify Sentry on test failure
        if: failure()
        run: |
          curl -X POST https://sentry.io/api/0/projects/your-org/your-project/events/ \
          -H "Authorization: Bearer ${{ secrets.SENTRY_AUTH_TOKEN }}" \
          -H "Content-Type: application/json" \
          -d '{"message":"Test suite failed in CI/CD pipeline","level":"error"}'
```

---

## 🛠️ Bài tập thực hành (Level 1 → 3, với giải đầy đủ)

### Level 1: Render Component Đơn Giản
**Yêu cầu**: Render component đơn giản (`Button`/`Input`), kiểm tra DOM elements có hiển thị.

**Code giải**:
```tsx
// components/SimpleButton.tsx
import { FC } from "react";
import { AccessibleButton } from "./AccessibleButton";

export const SimpleButton: FC = () => {
  return (
    <div role="region" aria-label="Simple button">
      <AccessibleButton label="Click Me" onClick={() => console.log("Clicked")} />
    </div>
  );
};

// __tests__/SimpleButton.test.tsx
import { render, screen } from "@testing-library/react";
import { SimpleButton } from "../components/SimpleButton";

describe("SimpleButton component", () => {
  test("renders button", () => {
    render(<SimpleButton />);
    expect(screen.getByLabelText("Click Me")).toBeInTheDocument();
  });

  test("matches snapshot", () => {
    const { container } = render(<SimpleButton />);
    expect(container).toMatchSnapshot();
  });
});
```

**Hướng dẫn**: Chạy `npm test` để kiểm tra button hiển thị đúng và snapshot hợp lệ.

### Level 2: Test Interaction
**Yêu cầu**: Test input change, click button, và conditional rendering.

**Code giải**:
```tsx
// components/CounterForm.tsx
import { FC, useState } from "react";
import { AccessibleButton } from "./AccessibleButton";

export const CounterForm: FC = () => {
  const [count, setCount] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  return (
    <div role="region" aria-label="Counter form">
      <input
        type="number"
        value={count}
        onChange={e => setCount(Number(e.target.value))}
        data-testid="count-input"
        aria-label="Counter value"
      />
      <AccessibleButton label="Toggle Message" onClick={() => setShowMessage(!showMessage)} />
      {showMessage && <p data-testid="message">Count is {count}</p>}
    </div>
  );
};

// __tests__/CounterForm.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CounterForm } from "../components/CounterForm";

describe("CounterForm component", () => {
  test("renders input and button", () => {
    render(<CounterForm />);
    expect(screen.getByTestId("count-input")).toBeInTheDocument();
    expect(screen.getByLabelText("Toggle Message")).toBeInTheDocument();
  });

  test("updates input value", async () => {
    render(<CounterForm />);
    const input = screen.getByTestId("count-input") as HTMLInputElement;
    await userEvent.type(input, "5");
    expect(input.value).toBe("5");
  });

  test("toggles message on button click", async () => {
    render(<CounterForm />);
    const input = screen.getByTestId("count-input") as HTMLInputElement;
    await userEvent.type(input, "5");
    await userEvent.click(screen.getByLabelText("Toggle Message"));
    expect(screen.getByTestId("message")).toHaveTextContent("Count is 5");
    await userEvent.click(screen.getByLabelText("Toggle Message"));
    expect(screen.queryByTestId("message")).not.toBeInTheDocument();
  });

  test("matches snapshot", () => {
    const { container } = render(<CounterForm />);
    expect(container).toMatchSnapshot();
  });
});
```

**Hướng dẫn**: Chạy `npm test` để kiểm tra input updates, conditional rendering, và snapshot.

### Level 3: Mini Project – Test Component Tree + Custom Hook
**Yêu cầu**: Test component tree với custom hook, async state update, mock API call, coverage >80%.

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

  if (isLoading) return <p role="status" aria-live="polite">Loading...</p>;
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

// __tests__/TodoApp.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TodoApp } from "../components/TodoApp";

const queryClient = new QueryClient();

describe("TodoApp component", () => {
  beforeEach(() => {
    jest.spyOn(global, "fetch").mockImplementation(
      () =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [{ id: 1, title: "Todo 1" }], total: 200 }),
        }) as any
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TodoApp />
      </QueryClientProvider>
    );
    expect(screen.getByRole("status")).toHaveTextContent("Loading...");
  });

  test("renders todo list in modal", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TodoApp />
      </QueryClientProvider>
    );

    await userEvent.click(screen.getByLabelText("Open Todo Modal"));
    await waitFor(() => expect(screen.getByTestId("todo-1")).toHaveTextContent("Todo 1"));
  });

  test("handles error state", async () => {
    jest.spyOn(global, "fetch").mockImplementation(() => Promise.reject(new Error("API Error")));

    render(
      <QueryClientProvider client={queryClient}>
        <TodoApp />
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByTestId("error-message")).toHaveTextContent("API Error"));
  });

  test("matches snapshot", async () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <TodoApp />
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByLabelText("Open Todo Modal")).toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });
});
```

---

## 🧩 Code Challenge: Enterprise Dashboard Component Testing

**Yêu cầu**:
- **Cơ bản**: Test simple component interactions (render, input change, button click, conditional rendering).
- **Nâng cao**:
  - Test dashboard với API pagination (JSONPlaceholder).
  - Test virtualization (`react-window`), Suspense, concurrent rendering, ErrorBoundary, và accessibility.
  - Mock API calls với `jest-fetch-mock`.
  - Test ARIA roles, keyboard navigation, và focus management.
  - Đảm bảo coverage >80%.
  - Tích hợp Sentry để log test failures.
  - Setup CI/CD với GitHub Actions.

**Code mẫu**: Đã cung cấp ở phần nâng cao (AccessibleDashboard và Dashboard.test.tsx).

---

## 🚀 Lưu ý production-ready

- **TypeScript**: Strict mode, type-safe tests (`jest.MockedFunction`, `Partial<T>`).
- **Accessibility**: Test ARIA roles, keyboard navigation, và focus management.
- **Performance**: Virtualization, lazy loading, concurrent rendering, debounce filter, API caching.
- **Testing**: Coverage >80%, test component interactions, virtualization, API, accessibility, và async state updates.
- **PWA**: Cache API data và lazy chunks với stale-while-revalidate.
- **Monitoring**: Profiler, Web Vitals, và error logging gửi đến Sentry.

---
📌 [<< Ngày 11](./Day11.md) | [Ngày 13 >>](./Day13.md)