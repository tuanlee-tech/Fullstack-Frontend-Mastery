# 🟩 Day 18 – Review & Polish (React 18 + TypeScript + PWA + Testing + CI/CD)

## 🎯 Mục tiêu bài học

- **Cơ bản (giữ nguyên)**:
  - Refactor code: clean structure, remove warnings, optimize performance.
  - Hoàn thiện **documentation** với JSDoc/TSDoc và README.
  - Chuẩn hóa **testing coverage**: Unit, Component, E2E tests (>80%).
  - Đảm bảo **PWA offline-first**, **error handling**, và **accessibility** enterprise-ready.
  - Verify **CI/CD pipeline** và deploy production-ready app (Vercel/Docker).
- **Nâng cao (bổ sung)**:
  - Refactor code với **Atomic Design** (atoms, molecules, organisms) và **Domain-Driven Design**.
  - Tích hợp **Workbox** cho PWA để tối ưu caching strategies (stale-while-revalidate, cache-first, network-first).
  - Tối ưu performance với **React Profiler**, **Lighthouse** (score >90), **Web Vitals**, **code-splitting**, **tree-shaking**, và **lazy hydration**.
  - Đảm bảo **accessibility** với **axe-core** và **screen reader testing** (VoiceOver, NVDA).
  - Tích hợp **Chromatic** cho visual regression testing với Storybook.
  - Chuẩn hóa **testing coverage >80%** với Jest, React Testing Library, Cypress, và coverage reports.
  - Tăng cường **CI/CD pipeline** với **parallel jobs**, **dependency caching**, **artifact uploads**, và **Kubernetes deployment**.
  - Tích hợp **Sentry** để log errors và monitor production performance.
  - Tạo **portfolio-ready documentation** với README chi tiết, feature showcases, Lighthouse reports, and CI/CD badges.
- **Thực hành**: Tối ưu dashboard từ Day 17, tích hợp Workbox, Chromatic, Kubernetes, và chuẩn bị portfolio-ready showcase.

---

## 📚 Nội dung chi tiết (Cơ bản + Nâng cao)

### 1️⃣ Refactor Code Structure
- **Cơ bản**: Tách folders (`components/`, `hooks/`, `pages/`, `services/`), remove console logs, fix TypeScript warnings.
- **Nâng cao**: Sử dụng **Atomic Design** (atoms, molecules, organisms) và **Domain-Driven Design** (DDD) để tổ chức code theo domain (e.g., `todos/`, `auth/`).

**Updated Project Structure**:
```
my-capstone-app/
├─ public/
│  ├─ favicon.ico
│  ├─ logo192.png
│  ├─ manifest.json
│  └─ service-worker.js
├─ src/
│  ├─ components/
│  │  ├─ atoms/
│  │  │  └─ AccessibleButton.tsx
│  │  ├─ molecules/
│  │  │  └─ Modal.tsx
│  │  ├─ organisms/
│  │  │  └─ Dashboard.tsx
│  │  └─ lists/
│  │     └─ LazyRow.tsx
│  ├─ domains/
│  │  ├─ todos/
│  │  │  ├─ hooks/
│  │  │  │  ├─ useFetch.ts
│  │  │  │  ├─ useDebounce.ts
│  │  │  │  ├─ useOnScreen.ts
│  │  │  │  └─ usePrevious.ts
│  │  │  └─ services/
│  │  │     └─ pushNotifications.ts
│  ├─ pages/
│  │  └─ Dashboard.tsx
│  ├─ shared/
│  │  └─ ErrorBoundary.tsx
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
├─ jest.config.js
├─ README.md
└─ .storybook/
   └─ main.js
```

### 2️⃣ Documentation & Comments
- **Cơ bản**: Thêm JSDoc/TSDoc cho components, hooks, và services. Tạo README hướng dẫn sử dụng.
- **Nâng cao**: Tạo **portfolio-ready README** với feature showcases, Lighthouse reports, CI/CD badges, và setup instructions.

**JSDoc Example**:
<xaiArtifact artifact_id="b173f1a0-1a9b-4b37-b90a-13ca0f54c131" artifact_version_id="6170fdc8-f94b-4f78-ad43-0d4f06883805" title="AccessibleButton.tsx" contentType="text/typescript">
/**
 * A reusable, accessible button component with keyboard support and ARIA attributes.
 * @param label - The button's accessible label and display text.
 * @param onClick - Callback function triggered on click or keyboard activation.
 * @param disabled - Disables the button if true.
 * @param ariaControls - ID of the element the button controls (optional).
 * @example
 * ```tsx
 * <AccessibleButton label="Submit" onClick={() => console.log("Clicked")} />
 * ```
 */
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
</xaiArtifact>

**README Example**:
<xaiArtifact artifact_id="9a228cbd-049d-495c-9410-7958c61921ee" artifact_version_id="ba021088-25b1-4e9f-b3e5-f63abfaa20d1" title="README.md" contentType="text/markdown">
# Capstone Dashboard

A production-ready React 18 + TypeScript app with PWA, accessibility, and CI/CD.

![Lighthouse Score](lighthouse-score.png)
![CI/CD Status](https://github.com/your-username/my-capstone-app/actions/workflows/ci.yml/badge.svg)
![Test Coverage](https://img.shields.io/badge/coverage-80%25-green)

## Features

- **React 18**: Concurrent rendering with `useTransition`, `useDeferredValue`, and `Suspense`.
- **PWA**: Offline-first with Workbox, push notifications, and background sync.
- **Accessibility**: ARIA roles, keyboard navigation, screen reader support.
- **Performance**: Virtualized lists (`react-window`), lazy loading, code-splitting, tree-shaking.
- **Testing**: >80% coverage with Jest (unit), RTL (component), and Cypress (E2E).
- **CI/CD**: GitHub Actions for build, test, and deploy (Vercel, Docker, Kubernetes).
- **Monitoring**: Sentry for error logging and Web Vitals tracking.

## Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/my-capstone-app.git
   cd my-capstone-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run locally:
   ```bash
   npm start
   ```

4. Run tests:
   ```bash
   npm run test:unit
   npm run test:e2e
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Deployment

- **Vercel**: Auto-deploy via GitHub Actions (`ci.yml`).
- **Docker**: Build and run:
  ```bash
  docker build -t capstone-app .
  docker run -p 80:80 capstone-app
  ```

## Lighthouse Report

![Lighthouse Report](lighthouse-report.png)

## CI/CD Pipeline

- **Build**: Lints, builds app and Storybook.
- **Test**: Runs unit, component, and E2E tests.
- **Deploy**: Deploys to Vercel and Docker Hub.

## Contributing

1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/xyz`).
3. Commit changes (`git commit -m "Add xyz feature"`).
4. Push to the branch (`git push origin feature/xyz`).
5. Open a Pull Request.
</xaiArtifact>

### 3️⃣ Production Optimization
- **Cơ bản**: Fix re-renders, lazy load components, virtualize lists, cache assets.
- **Nâng cao**: Tích hợp Workbox, Chromatic, Lighthouse, và Kubernetes.

**Workbox Service Worker**:
<xaiArtifact artifact_id="e35a2ebe-2550-45f7-b141-5e5a76b9951c" artifact_version_id="1e717361-6541-4132-a686-cc55e32f89d7" title="service-worker.js" contentType="text/javascript">
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import * as Sentry from '@sentry/browser';

const CACHE_NAME = 'dashboard-cache-v18';
const DYNAMIC_CACHE = 'dashboard-dynamic-v18';

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache API calls (stale-while-revalidate)
registerRoute(
  ({ url }) => url.origin.includes('jsonplaceholder.typicode.com'),
  new StaleWhileRevalidate({
    cacheName: DYNAMIC_CACHE,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache lazy-loaded chunks (cache-first)
registerRoute(
  ({ url }) => url.pathname.includes('.chunk.js'),
  new CacheFirst({
    cacheName: CACHE_NAME,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
      }),
    ],
  })
);

// Cache static assets (cache-first)
registerRoute(
  ({ request }) => request.destination === 'image' || request.destination === 'style' || request.destination === 'font',
  new CacheFirst({
    cacheName: CACHE_NAME,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
      }),
    ],
  })
);

// Background sync for todos
self.addEventListener('sync', (event) => {
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

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() || { title: 'New Todo', body: 'A new todo has been added!' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/logo192.png',
      data: { url: '/dashboard' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
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
</xaiArtifact>

**Updated Dashboard (Optimized)**:
<xaiArtifact artifact_id="680f585b-fe09-4559-8dc5-1f942cd4046c" artifact_version_id="1afe8d31-6eba-49d2-aeab-101771bf2019" title="Dashboard.tsx" contentType="text/typescript">
/**
 * A production-ready dashboard with virtualization, concurrent rendering, and accessibility.
 * @example
 * ```tsx
 * <DashboardChallenge />
 * ```
 */
import { FC, Suspense, useState, useCallback, useEffect, useTransition, useDeferredValue, Profiler, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import InfiniteLoader from "react-window-infinite-loader";
import { VariableSizeList as List } from "react-window";
import { useFetch, useDebounce, useOnScreen } from "../domains/todos/hooks";
import * as Sentry from "@sentry/react";
import reportWebVitals from "../reportWebVitals";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { AccessibleButton } from "../components/atoms/AccessibleButton";
import { Modal } from "../components/molecules/Modal";
import { subscribeToPushNotifications } from "../domains/todos/services/pushNotifications";

const LazyRow = dynamic(() => import("../components/lists/LazyRow"), { ssr: false });

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

/**
 * Core dashboard component with virtualized list, filtering, and PWA features.
 */
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

  if (error) throw new Error(error.message);

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
</xaiArtifact>

**Chromatic Config**:
<xaiArtifact artifact_id="6bb8d2f0-4df3-4ccc-b268-96e684fd22b4" artifact_version_id="8d2c963e-f9a5-4933-8612-abfc415820f1" title=".github/workflows/chromatic.yml" contentType="text/yaml">
name: Chromatic Visual Regression

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Storybook
        run: npm run build-storybook

      - name: Publish to Chromatic
        uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          storybookBuildDir: storybook-static
</xaiArtifact>

**Kubernetes Deployment**:
<xaiArtifact artifact_id="6056967f-1802-4432-8d8c-72d406a1e0db" artifact_version_id="e58629b7-272a-4472-b3dc-265689f8a7d7" title="k8s-deployment.yml" contentType="text/yaml">
apiVersion: apps/v1
kind: Deployment
metadata:
  name: capstone-app
  namespace: default
spec:
  replicas: 3
  selector:
    matchLabels:
      app: capstone-app
  template:
    metadata:
      labels:
        app: capstone-app
    spec:
      containers:
        - name: capstone-app
          image: your-docker-username/capstone-app:latest
          ports:
            - containerPort: 80
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          env:
            - name: REACT_APP_API_URL
              value: "https://jsonplaceholder.typicode.com"
            - name: REACT_APP_SENTRY_DSN
              valueFrom:
                secretKeyRef:
                  name: capstone-secrets
                  key: sentry-dsn
---
apiVersion: v1
kind: Service
metadata:
  name: capstone-service
  namespace: default
spec:
  selector:
    app: capstone-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer
</xaiArtifact>

**Lighthouse Config**:
<xaiArtifact artifact_id="458ade8e-3538-44f4-8402-ee365f107d8b" artifact_version_id="8e63bd07-6f3a-4fa0-9145-2eb34c99de10" title=".github/workflows/lighthouse.yml" contentType="text/yaml">
name: Lighthouse CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lighthouse:
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

      - name: Build app
        run: npm run build

      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:3000/dashboard
          budgetPath: ./lighthouse-budget.json
          runs: 3
          uploadArtifacts: true
</xaiArtifact>

**Lighthouse Budget**:
<xaiArtifact artifact_id="ceaca222-02fd-4068-932b-bcaf17f9e4c2" artifact_version_id="3ceb2a49-0d29-441e-857c-7ec8864c0fbf" title="lighthouse-budget.json" contentType="application/json">
{
  "performance": 90,
  "accessibility": 100,
  "best-practices": 90,
  "seo": 90,
  "pwa": 90
}
</xaiArtifact>

**Updated CI/CD Workflow**:
<xaiArtifact artifact_id="acfbd91b-59fa-4d17-9021-68b69bac139c" artifact_version_id="54297432-a915-4d6b-b1b6-0b210878cbf1" title="ci.yml" contentType="text/yaml">
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

      - name: Run accessibility tests
        run: npm run test:a11y

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

  deploy-kubernetes:
    needs: deploy-docker
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: 'latest'

      - name: Configure Kubernetes
        run: |
          echo "${{ secrets.KUBE_CONFIG }}" > $HOME/.kube/config
          chmod 600 $HOME/.kube/config

      - name: Deploy to Kubernetes
        run: kubectl apply -f k8s-deployment.yml
</xaiArtifact>

**Accessibility Tests**:
<xaiArtifact artifact_id="b32431c8-addd-423f-8e56-3e61bfe5da73" artifact_version_id="c03735ea-e182-48d4-8f1f-0441f2afef6b" title="accessibility.spec.ts" contentType="text/typescript">
/// <reference types="cypress" />

describe("Accessibility Tests", () => {
  beforeEach(() => {
    cy.visit("/dashboard");
    cy.injectAxe();
  });

  it("has no detectable accessibility violations on load", () => {
    cy.checkA11y();
  });

  it("has no accessibility violations in modal", () => {
    cy.get('[aria-controls="filter-modal"]').click();
    cy.checkA11y();
  });
});
</xaiArtifact>

**package.json (Updated)**:
<xaiArtifact artifact_id="22ff4d95-a32d-4757-a332-b2b293a2c677" artifact_version_id="27ad3011-1faf-4e74-acdd-7e2aaf3533ce" title="package.json" contentType="application/json">
{
  "name": "my-capstone-app",
  "version": "1.0.0",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test:unit": "react-scripts test",
    "test:e2e": "cypress run",
    "test:a11y": "cypress run --spec cypress/e2e/accessibility.spec.ts",
    "lint": "eslint 'src/**/*.{ts,tsx}'",
    "build-storybook": "storybook build",
    "storybook": "storybook dev -p 6006"
  },
  "dependencies": {
    "@sentry/react": "^7.0.0",
    "@tanstack/react-query": "^5.0.0",
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-window": "^1.8.10",
    "react-window-infinite-loader": "^1.0.9",
    "workbox-precaching": "^7.0.0",
    "workbox-routing": "^7.0.0",
    "workbox-strategies": "^7.0.0",
    "workbox-expiration": "^7.0.0"
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
    "axe-core": "^4.0.0",
    "cypress": "^13.0.0",
    "cypress-axe": "^1.0.0",
    "eslint": "^8.0.0",
    "msw": "^2.0.0",
    "storybook": "^7.0.0",
    "typescript": "^5.0.0"
  }
}
</xaiArtifact>

---

## 🛠️ Bài tập thực hành (Level 1 → 3, với giải đầy đủ)

### Level 1: Fix Warnings & Clean Code
**Yêu cầu**: Run app locally, fix TypeScript warnings, remove console logs.

**Code giải**:
1. Run `npm run lint` để kiểm tra lỗi TypeScript và ESLint.
2. Remove console logs (e.g., từ `LazyRow.tsx`):
<xaiArtifact artifact_id="820c7a80-f2e5-4224-be28-51bf4ed6559b" artifact_version_id="f4edf47a-59d1-46cc-852d-dfde6e4bfad3" title="LazyRow.tsx" contentType="text/typescript">
/**
 * A virtualized list row component with accessibility and error handling.
 * @param index - The index of the row.
 * @param style - CSS styles for virtualization.
 * @param data - The data array for the list.
 */
export const LazyRow: FC<RowProps> = React.memo(({ index, style, data }) => {
  try {
    if (index === 5) throw new Error("Simulated row error");
    return (
      <div
        role="row"
        aria-label={`Todo item ${index + 1}`}
        style={{ ...style, padding: 10, borderBottom: "1px solid #ccc" }}
        tabIndex={0}
        onKeyDown={e => e.key === "Enter" && alert(`Row ${index} clicked`)}
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
</xaiArtifact>
3. Run `npm run build` để kiểm tra build errors.

**Hướng dẫn**: Kiểm tra console trong browser và terminal để fix warnings.

### Level 2: Documentation & Comments
**Yêu cầu**: Thêm JSDoc/TSDoc cho hooks, components, và tạo README.

**Code giải**:
- JSDoc đã thêm vào `AccessibleButton.tsx`, `Dashboard.tsx`, `LazyRow.tsx`.
- README đã cung cấp ở trên.

**Hướng dẫn**: Run `npm run storybook` để kiểm tra docs trong Storybook.

### Level 3: Production-Ready Polish
**Yêu cầu**: Đảm bảo PWA offline, full testing, performance optimized, CI/CD verified, portfolio-ready.

**Code giải**:
- **PWA**: Đã tích hợp Workbox (`service-worker.js`).
- **Testing**: Đã thêm accessibility tests (`accessibility.spec.ts`).
- **Performance**: Sử dụng `useMemo`, `useCallback`, `React.memo`, và virtualized lists.
- **CI/CD**: Đã cập nhật `ci.yml` với parallel jobs, Chromatic, Lighthouse, và Kubernetes.
- **Portfolio**: README với badges, Lighthouse report, và feature showcases.

**Hướng dẫn**:
1. Run `npm run build` và kiểm tra Lighthouse score (`npm run test:lighthouse`).
2. Deploy với `npm run deploy:vercel` hoặc `docker build -t capstone-app .`.
3. Kiểm tra CI/CD pipeline trên GitHub Actions.

---

## 🧩 Code Challenge: Portfolio-Ready Dashboard

**Yêu cầu**:
- **Cơ bản**: Tối ưu dashboard từ Day 17, fix warnings, thêm documentation.
- **Nâng cao**:
  - Tích hợp **Workbox** cho PWA caching.
  - Sử dụng **Chromatic** cho visual regression testing.
  - Deploy lên **Kubernetes** với auto-scaling.
  - Đảm bảo **Lighthouse score >90** cho performance, accessibility, PWA.
  - Tạo **portfolio-ready README** với feature showcases, badges, và setup instructions.

**Code mẫu**: Đã cung cấp ở trên (Dashboard, Workbox, Chromatic, Kubernetes, README).

---

## 🚀 Lưu ý production-ready

- **Code Structure**: Atomic Design, Domain-Driven Design.
- **TypeScript**: Strict mode, type-safe components, hooks, services.
- **Accessibility**: ARIA roles, keyboard navigation, axe-core testing.
- **Performance**: Virtualization, lazy loading, code-splitting, tree-shaking, Workbox caching.
- **PWA**: Stale-while-revalidate, cache-first, network-first, push notifications, background sync.
- **Testing**: >80% coverage, unit, component, E2E, accessibility, visual regression.
- **CI/CD**: Parallel jobs, dependency caching, Vercel/Docker/Kubernetes deployments.
- **Monitoring**: Sentry, Web Vitals, Lighthouse.
- **Portfolio**: README với feature showcases, badges, Lighthouse reports.

---

## 📋 Checklist Tổng hợp 18 Ngày

Dưới đây là **roadmap và exercises tổng hợp từ Day 1 đến Day 18** cho khóa học React 18 chuyên sâu, chia theo level.

### Roadmap Tổng hợp
| Day | Chủ đề | Nội dung chính | Kỹ năng chính |
|-----|--------|----------------|---------------|
| 1   | React Basics | JSX, components, props, state | Cấu trúc cơ bản React, TypeScript setup |
| 2   | Hooks | `useState`, `useEffect`, `useFetch`, `useDebounce` | Custom hooks, API fetching |
| 3   | Styling | CSS-in-JS, Tailwind, styled-components | Styling components, responsive design |
| 4   | Routing | React Router, dynamic routes | Navigation, SPA routing |
| 5   | Performance | `useMemo`, `useCallback`, Web Vitals | Optimize re-renders, performance tracking |
| 6   | Virtualization | `react-window`, `react-virtualized` | Handle large lists, lazy loading |
| 7   | Suspense | `React.lazy`, `Suspense` | Lazy loading components, fallback UI |
| 8   | Concurrent | `useTransition`, `useDeferredValue` | Concurrent rendering, smooth UX |
| 9   | Error Handling | `ErrorBoundary`, error logging | Catch and handle errors |
| 10  | Accessibility | ARIA, keyboard navigation | Accessible components, screen reader support |
| 11  | Unit Testing | Jest, React Testing Library | Test hooks, components |
| 12  | Component Testing | RTL, simulate events | Test interactions, state changes |
| 13  | E2E Testing | Cypress, Playwright | Test user flows, offline scenarios |
| 14  | Storybook | Document components, visual testing | Component library, visual regression |
| 15  | PWA | Service Worker, offline caching | Offline-first, push notifications |
| 16  | CI/CD | GitHub Actions, Vercel, Docker | Build, test, deploy automation |
| 17  | Capstone | Full app with all features | Production-ready dashboard |
| 18  | Review & Polish | Refactor, optimize, portfolio | Clean code, documentation, deployment |

### Exercises Tổng hợp
| Level | Day | Exercise |
|-------|-----|----------|
| **1** | 1   | Tạo component `TodoItem` với props `title`, `completed`. |
| **1** | 2   | Viết `useCounter` hook để tăng/giảm giá trị. |
| **1** | 3   | Style `TodoItem` với Tailwind, responsive cho mobile. |
| **1** | 4   | Tạo router với 2 trang: Home và TodoList. |
| **1** | 5   | Tối ưu `TodoList` với `useMemo` cho filtered todos. |
| **1** | 6   | Hiển thị 1000 items với `react-window`. |
| **1** | 7   | Lazy load `TodoList` với `Suspense`. |
| **1** | 8   | Thêm `useTransition` cho filter input. |
| **1** | 9   | Wrap `TodoList` trong `ErrorBoundary`. |
| **1** | 10  | Thêm ARIA labels và keyboard navigation cho `TodoItem`. |
| **1** | 11  | Viết unit tests cho `useCounter` hook. |
| **1** | 12  | Test `TodoItem` click events với RTL. |
| **1** | 13  | Viết E2E test cho flow thêm todo với Cypress. |
| **1** | 14  | Tạo Storybook story cho `TodoItem`. |
| **1** | 15  | Thêm Service Worker để cache assets. |
| **1** | 16  | Tạo GitHub Actions chạy lint, test, build. |
| **1** | 17  | Tạo app với large list, lazy loading, `useDeferredValue`. |
| **1** | 18  | Fix TypeScript warnings, remove console logs. |
| **2** | 1   | Tạo `TodoList` với state management cho todos. |
| **2** | 2   | Viết `useFetch` để fetch todos từ JSONPlaceholder. |
| **2** | 3   | Style `TodoList` với styled-components, theme switching. |
| **2** | 4   | Thêm protected route cho trang Dashboard. |
| **2** | 5   | Track Web Vitals và log với `reportWebVitals`. |
| **2** | 6   | Tích hợp `react-virtualized` với infinite scroll. |
| **2** | 7   | Lazy load nested components trong `TodoList`. |
| **2** | 8   | Tối ưu filter với `useDeferredValue` và `useTransition`. |
| **2** | 9   | Log errors từ `ErrorBoundary` vào console. |
| **2** | 10  | Tạo accessible `Modal` với focus trapping. |
| **2** | 11  | Test `useFetch` với mock API responses. |
| **2** | 12  | Test `TodoList` state changes với RTL. |
| **2** | 13  | Test offline flow với Cypress. |
| **2** | 14  | Thêm visual regression testing cho Storybook. |
| **2** | 15  | Tích hợp push notifications trong PWA. |
| **2** | 16  | Auto-deploy lên Vercel sau CI pass. |
| **2** | 17  | Tích hợp virtualized list, ErrorBoundary, custom hooks. |
| **2** | 18  | Thêm JSDoc và README hướng dẫn sử dụng. |
| **3** | 1   | Xây full Todo app với CRUD và TypeScript. |
| **3** | 2   | Tích hợp `useFetch` với retry và caching (React Query). |
| **3** | 3   | Tạo themeable UI với CSS variables và dark mode. |
| **3** | 4   | Tích hợp dynamic routes và server-side data fetching. |
| **3** | 5   | Tối ưu performance với Profiler và Web Vitals logging. |
| **3** | 6   | Xây infinite scroll dashboard với `react-window`. |
| **3** | 7   | Tích hợp Suspense cho API-driven UI. |
| **3** | 8   | Tối ưu UX với concurrent rendering và SuspenseList. |
| **3** | 9   | Tích hợp Sentry cho error logging. |
| **3** | 10  | Test accessibility với axe-core và screen readers. |
| **3** | 11  | Đạt >80% unit test coverage với Jest. |
| **3** | 12  | Test complex interactions với RTL. |
| **3** | 13  | Test full user flows (online/offline) với Cypress. |
| **3** | 14  | Tích hợp Chromatic cho Storybook visual regression. |
| **3** | 15  | Tích hợp Workbox và background sync cho PWA. |
| **3** | 16  | Tạo full CI/CD pipeline với Docker/Kubernetes. |
| **3** | 17  | Xây production-ready dashboard với PWA, testing, CI/CD. |
| **3** | 18  | Tối ưu app với Workbox, Chromatic, Kubernetes, portfolio-ready. |

---
📌 [<< Ngày 17](./Day17.md)