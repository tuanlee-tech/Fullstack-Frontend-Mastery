# Day 14: Error Handling & Fallback UI

## Mục tiêu học

1. Hiểu cách xử lý **lỗi trong Next.js** (Page Router + App Router).
2. Tạo **custom 404/500 pages** và fallback UI cho SSR/CSR.
3. Sử dụng **Error Boundaries** cho React components.
4. Biết patterns enterprise: logging, reporting, user-friendly messages.
5. Tối ưu trải nghiệm: loading skeletons, retry mechanism.
6. Triển khai **try/catch**, `getStaticProps`/`getServerSideProps` error handling.

---

## TL;DR

* Page Router: `pages/404.tsx`, `pages/_error.tsx`, try/catch trong `getStaticProps`/`getServerSideProps`.
* App Router: `error.tsx`, `not-found.tsx`, Error Boundary client component.
* Fallback UI: skeleton loaders, suspense.
* Enterprise pattern: log lỗi, report Sentry.

---

## 1️⃣ Lý thuyết chi tiết

### 1.1 Page Router – Custom 404 / 500

```tsx
// pages/404.tsx
export default function Custom404() {
  return <h1>404 - Page Not Found</h1>;
}

// pages/_error.tsx
import { NextPageContext } from 'next';

interface Props {
  statusCode?: number;
}

export default function Error({ statusCode }: Props) {
  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : 'An error occurred on client'}
    </p>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
```

* `_error.tsx` handle SSR & CSR errors globally.

---

### 1.2 App Router – error.tsx & not-found.tsx

```tsx
// app/error.tsx
'use client';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}

// app/not-found.tsx
export default function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}
```

* `reset()` → retry mechanism.
* Logging enterprise: console, Sentry, etc.

---

### 1.3 Error Boundaries (React Client Component)

```tsx
'use client';
import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; }

interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError() { return { hasError: true }; }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) return <h2>Something went wrong in this section</h2>;
    return this.props.children;
  }
}
```

* Wrap sensitive UI: `<ErrorBoundary><MyComponent /></ErrorBoundary>`.

---

### 1.4 Fallback UI / Skeleton Loader

```tsx
// components/Skeleton.tsx
export default function Skeleton({ width = '100%', height = '20px' }) {
  return <div style={{ width, height, backgroundColor: '#e0e0e0', borderRadius: '4px' }} />;
}

// Usage
<Skeleton width="200px" height="30px" />
```

* Suspense + fallback → SSR-friendly.

---

## 2️⃣ Bài tập

### Level 1: Custom 404 Page

* **Đề:** Tạo `404.tsx` với message & link back home.
* **Giải:** như ví dụ Page Router / App Router.

### Level 2: Error Boundary

* **Đề:** Tạo ErrorBoundary và wrap component có thể crash (ví dụ: fetch data).
* **Giải:** như ví dụ React ErrorBoundary ở trên.

### Level 3: Fallback + Retry

* **Đề:** Component fetch data async → show skeleton khi loading, show error UI khi fetch fail, có nút retry.
* **Giải:**

```tsx
'use client';
import { useState, useEffect } from 'react';
import Skeleton from '../components/Skeleton';

export default function AsyncData() {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      // simulate fetch
      await new Promise((res, rej) => setTimeout(() => Math.random() > 0.5 ? res('Success') : rej('Fail'), 1000));
      setData('Fetched data!');
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <Skeleton width="300px" height="30px" />;
  if (error) return <div>Error occurred! <button onClick={fetchData}>Retry</button></div>;
  return <div>{data}</div>;
}
```

---

## 3️⃣ Common Pitfalls

1. Quên wrap component crash-prone → app crash.
2. Page Router `_error.tsx` vs App Router `error.tsx` nhầm lẫn.
3. Không handle async fetch error → UI freeze.
4. Skeleton quá static → user nghĩ app bị lỗi.

---

[<< Ngày 13](./Day13.md) | [Ngày 15 >>](./Day15.md)
