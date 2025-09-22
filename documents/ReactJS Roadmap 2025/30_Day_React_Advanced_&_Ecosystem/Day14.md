# 🟩 Day 14 – Storybook (TypeScript, Senior/Enterprise Edition)

## 🎯 Mục tiêu bài học

- **Cơ bản (giữ nguyên)**:
  - Xây dựng **component library** với **Storybook** và TypeScript.
  - Document components, tạo interactive playground với `stories.tsx` hoặc `stories.mdx`.
  - Sử dụng **args** và **controls** để simulate props và state.
  - Áp dụng **decorators** để wrap components (e.g., themes, context providers).
  - Sử dụng **addons** (actions, viewport, accessibility, docs) để tăng cường testing và documentation.
  - Type-safe props và autocomplete trong Storybook với TypeScript.
- **Nâng cao (bổ sung)**:
  - Xây dựng **design system** tích hợp **accessible components** (Day 10), **unit-tested components** (Day 11), **component-tested interactions** (Day 12), và **E2E-tested user flows** (Day 13).
  - Tạo stories cho **complex components** với **Suspense** (Day 07), **concurrent rendering** (Day 08), **ErrorBoundary** (Day 09), **virtualization** (Day 06), và **API fetching** (Day 02).
  - Tích hợp **Cypress** và **React Testing Library (RTL)** để test visual regression và accessibility trong Storybook.
  - Sử dụng **Storybook addons** như `@storybook/addon-a11y` và `@storybook/addon-interactions` để kiểm tra accessibility và interactions.
  - Đảm bảo **test coverage >80%** với Storybook coverage reports.
  - Setup **CI/CD** với GitHub Actions để tự động build Storybook, chạy visual regression tests, và báo cáo coverage.
  - Tích hợp **Sentry** để log Storybook build/test failures trong CI/CD pipeline.
  - Tối ưu performance với **React Profiler** và **Web Vitals** logging.
- **Thực hành**: Xây dựng Storybook stories cho dashboard với API fetching, virtualization, concurrent rendering, accessibility, và visual regression testing.

---

## 📚 Nội dung chi tiết (Cơ bản + Nâng cao)

### 1️⃣ Storybook cho Simple Component (Cơ bản + Nâng cao)
- **Cơ bản**: Tạo stories cho `Button` component với args, controls, và actions.
- **Nâng cao**: Tích hợp accessibility testing và decorators cho themes/context.

**Button component**:
```tsx
// components/AccessibleButton.tsx
import { FC } from "react";

interface AccessibleButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  ariaControls?: string;
}

export const AccessibleButton: FC<AccessibleButtonProps> = ({ label, onClick, disabled = false, ariaControls }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!disabled && onClick) onClick();
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

**Button story**:
```tsx
// components/AccessibleButton.stories.tsx
import { Meta, StoryObj } from "@storybook/react";
import { AccessibleButton, AccessibleButtonProps } from "./AccessibleButton";
import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

const meta: Meta<typeof AccessibleButton> = {
  title: "Components/AccessibleButton",
  component: AccessibleButton,
  argTypes: {
    label: { control: "text" },
    onClick: { action: "clicked" },
    disabled: { control: "boolean" },
    ariaControls: { control: "text" },
  },
  parameters: {
    a11y: {
      config: {
        rules: [{ id: "button-name", enabled: true }],
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof AccessibleButton>;

const Template: Story = {
  render: (args) => <AccessibleButton {...args} />,
};

export const Primary: Story = {
  ...Template,
  args: {
    label: "Click Me",
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button"));
    await expect(canvas.getByRole("button")).toHaveTextContent("Click Me");
  },
};

export const Disabled: Story = {
  ...Template,
  args: {
    label: "Cannot Click",
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button")).toBeDisabled();
  },
};

export const WithAriaControls: Story = {
  ...Template,
  args: {
    label: "Open Modal",
    ariaControls: "modal-id",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button")).toHaveAttribute("aria-controls", "modal-id");
  },
};
```

### 2️⃣ Storybook cho Enterprise Dashboard (Nâng cao)
- **Cơ bản**: Tạo stories cho simple components (`AccessibleButton`, `Modal`).
- **Nâng cao**: Tạo stories cho dashboard với API fetching, virtualization, Suspense, concurrent rendering, ErrorBoundary, và accessibility testing.

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

**Dashboard story**:
```tsx
// components/Dashboard.stories.tsx
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

export const WithFilter: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open Filter Modal" }));
    await userEvent.type(canvas.getByTestId("filter-input"), "Todo");
    await userEvent.click(canvas.getByRole("button", { name: "Apply Filter" }));
    await expect(canvas.getByTestId("pending-message")).toHaveTextContent("Updating list...");
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

**Storybook config (.storybook/main.ts)**:
```ts
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../components/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: true,
  },
};

export default config;
```

**Storybook preview (.storybook/preview.ts)**:
```ts
import type { Preview } from "@storybook/react";
import { initialize, mswDecorator } from "msw-storybook-addon";
import * as Sentry from "@sentry/react";

initialize();

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [mswDecorator],
};

Sentry.init({
  dsn: "your-sentry-dsn",
});

export default preview;
```

**Cypress test for Storybook (cypress/e2e/storybook.spec.ts)**:
```ts
// cypress/e2e/storybook.spec.ts
/// <reference types="cypress" />

describe("Storybook Visual Regression", () => {
  beforeEach(() => {
    cy.visit("http://localhost:6006");
  });

  it("renders AccessibleButton story", () => {
    cy.visit("http://localhost:6006/iframe.html?id=components-accessiblebutton--primary");
    cy.get("button").should("have.text", "Click Me");
    cy.get("button").click();
    cy.get("button").should("have.class", "bg-blue-500");
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
};
```

**CI/CD (`.github/workflows/ci.yml`)**:
```yaml
name: Storybook CI

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
      - run: npm run build-storybook
      - run: npm run test:unit -- --coverage
      - run: npm run test:e2e
      - name: Upload Storybook
        uses: actions/upload-artifact@v3
        with:
          name: storybook-static
          path: storybook-static/
      - name: Notify Sentry on failure
        if: failure()
        run: |
          curl -X POST https://sentry.io/api/0/projects/your-org/your-project/events/ \
          -H "Authorization: Bearer ${{ secrets.SENTRY_AUTH_TOKEN }}" \
          -H "Content-Type: application/json" \
          -d '{"message":"Storybook build/test failed in CI/CD pipeline","level":"error"}'
```

**sw.js (PWA support)**:
```javascript
const CACHE_NAME = "dashboard-cache-v12";
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

---

## 🛠️ Bài tập thực hành (Level 1 → 3, với giải đầy đủ)

### Level 1: Story Cơ Bản cho Button
**Yêu cầu**: Tạo story cơ bản cho `AccessibleButton`, thử hover và click action.

**Code giải**:
```tsx
// components/AccessibleButton.tsx (reused from above)
import { FC } from "react";

interface AccessibleButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  ariaControls?: string;
}

export const AccessibleButton: FC<AccessibleButtonProps> = ({ label, onClick, disabled = false, ariaControls }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!disabled && onClick) onClick();
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

// components/AccessibleButton.stories.tsx
import { Meta, StoryObj } from "@storybook/react";
import { AccessibleButton, AccessibleButtonProps } from "./AccessibleButton";
import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

const meta: Meta<typeof AccessibleButton> = {
  title: "Components/AccessibleButton",
  component: AccessibleButton,
  argTypes: {
    label: { control: "text" },
    onClick: { action: "clicked" },
    disabled: { control: "boolean" },
    ariaControls: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof AccessibleButton>;

export const Primary: Story = {
  args: {
    label: "Click Me",
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button"));
    await expect(canvas.getByRole("button")).toHaveTextContent("Click Me");
  },
};
```

**Hướng dẫn**: Chạy `npm run storybook` để xem story và test click action.

### Level 2: Args & Controls, State Variants
**Yêu cầu**: Thêm args và controls, tạo 2–3 state variant (primary, disabled, loading).

**Code giải**:
```tsx
// components/AccessibleButton.tsx (reused from above)

// components/AccessibleButton.stories.tsx
import { Meta, StoryObj } from "@storybook/react";
import { AccessibleButton, AccessibleButtonProps } from "./AccessibleButton";
import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

const meta: Meta<typeof AccessibleButton> = {
  title: "Components/AccessibleButton",
  component: AccessibleButton,
  argTypes: {
    label: { control: "text" },
    onClick: { action: "clicked" },
    disabled: { control: "boolean" },
    ariaControls: { control: "text" },
  },
  parameters: {
    a11y: {
      config: {
        rules: [{ id: "button-name", enabled: true }],
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof AccessibleButton>;

export const Primary: Story = {
  args: {
    label: "Click Me",
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button"));
    await expect(canvas.getByRole("button")).toHaveTextContent("Click Me");
  },
};

export const Disabled: Story = {
  args: {
    label: "Cannot Click",
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button")).toBeDisabled();
  },
};

export const Loading: Story = {
  args: {
    label: "Loading...",
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button")).toBeDisabled();
  },
};
```

**Hướng dẫn**: Chạy `npm run storybook` để kiểm tra các variant và accessibility.

### Level 3: Mini Component Library
**Yêu cầu**: Xây mini component library với 5+ reusable components, Storybook docs, decorator theme, tích hợp CI/CD để kiểm tra visual/story regression.

**Code giải**:
```tsx
// components/TodoApp.tsx
import { FC, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { AccessibleButton } from "./AccessibleButton";
import { Modal } from "./Modal";

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

// components/TodoApp.stories.tsx
import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { TodoApp } from "./TodoApp";

const queryClient = new QueryClient();

const meta: Meta<typeof TodoApp> = {
  title: "Components/TodoApp",
  component: TodoApp,
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

type Story = StoryObj<typeof TodoApp>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open Todo Modal" }));
    await expect(canvas.getByTestId("todo-1")).toHaveTextContent("Todo 1");
  },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: {
        todos: [
          {
            method: "get",
            path: "https://jsonplaceholder.typicode.com/todos",
            response: () => new Promise(() => {}), // Simulate loading
          },
        ],
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("loading")).toHaveTextContent("Loading...");
  },
};

export const Error: Story = {
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
    await expect(canvas.getByTestId("error-message")).toHaveTextContent("Network error");
  },
};
```

---

## 🧩 Code Challenge: Enterprise Dashboard Storybook

**Yêu cầu**:
- **Cơ bản**: Tạo stories cho simple components (`AccessibleButton`, `Modal`).
- **Nâng cao**:
  - Tạo stories cho dashboard với API pagination (JSONPlaceholder).
  - Tích hợp virtualization (`react-window`), Suspense, concurrent rendering, ErrorBoundary, và accessibility.
  - Test visual regression với Cypress.
  - Test accessibility với `@storybook/addon-a11y`.
  - Đảm bảo coverage >80%.
  - Tích hợp Sentry để log Storybook build/test failures.
  - Setup CI/CD với GitHub Actions.

**Code mẫu**: Đã cung cấp ở phần nâng cao (Dashboard và Dashboard.stories.tsx).

---

## 🚀 Lưu ý production-ready

- **TypeScript**: Strict mode, type-safe stories (`Meta`, `StoryObj`).
- **Accessibility**: Test ARIA roles, keyboard navigation, và focus management với `@storybook/addon-a11y`.
- **Performance**: Virtualization, lazy loading, concurrent rendering, debounce filter, API caching.
- **Testing**: Coverage >80%, test visual regression, accessibility, và interactions.
- **PWA**: Cache API data và lazy chunks với stale-while-revalidate.
- **Monitoring**: Profiler, Web Vitals, và error logging gửi đến Sentry.

---
📌 [<< Ngày 13](./Day13.md) | [Ngày 15 >>](./Day15.md)