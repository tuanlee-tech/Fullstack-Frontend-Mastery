
# Day 02 – Advanced Custom Hooks / Custom Hooks Nâng Cao


## 1️⃣ Overview / Tổng quan

**EN:**
Custom hooks in React allow you to **extract and reuse logic** across multiple components. Advanced hooks help manage **async operations, DOM events, performance optimization**, and state abstraction, making components cleaner and more maintainable. In enterprise apps, this reduces **code duplication**, improves **testability**, and ensures **consistent behavior across modules**.

**VN:**
Custom hook trong React cho phép bạn **tách logic và tái sử dụng** giữa nhiều component. Các hook nâng cao giúp quản lý **async operations, DOM events, tối ưu hiệu năng**, và abstraction state, giúp component sạch hơn và dễ maintain. Trong dự án doanh nghiệp, điều này giảm **trùng lặp code**, tăng **khả năng test**, và đảm bảo **behavior đồng nhất**.

**Enterprise Relevance / Ví dụ doanh nghiệp:**

* `useFetch` để quản lý fetch API chuẩn hóa cho toàn dự án.
* `useOnScreen` cho lazy-loading hoặc animation khi component xuất hiện viewport.
* `useEventListener` để quản lý sự kiện DOM mà tránh leak memory.

---

## 2️⃣ Key Concepts / Kiến thức cần học

| Concept             | Description EN / VN                                                                  | Code Snippet / Example                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Reusable Logic      | Encapsulate logic in hooks / Tách logic vào hook tái sử dụng                         | `function useCounter() { const [count, setCount] = useState(0); return { count, setCount }; }`                                                                     |
| Async Hook          | Handle fetch/data loading / Quản lý fetch hoặc data async                            | `function useFetch(url: string) { const [data, setData] = useState(null); useEffect(() => { fetch(url).then(r=>r.json()).then(setData); }, [url]); return data; }` |
| DOM Events          | Manage events with cleanup / Quản lý event DOM và cleanup                            | `function useEventListener(event: string, handler: Function, element = window)`                                                                                    |
| Performance         | Memoization in hooks / Tối ưu bằng memoization                                       | `useCallback, useMemo`                                                                                                                                             |
| Enterprise Patterns | Hook library, shared utils, abstraction / Library hook dùng chung, abstraction logic | `hooks/useAuth.ts`, `hooks/useDebounce.ts`                                                                                                                         |

---

## 3️⃣ Code Example / Ví dụ code

```tsx
// File: hooks/useFetch.ts
import { useState, useEffect, useCallback } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * ✅ Enterprise-ready fetch hook
 * - Handles loading/error states
 * - Supports cancellation to avoid memory leaks
 * - Fully typed with generics
 */
export function useFetch<T = unknown>(url: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(() => {
    const controller = new AbortController(); // cancelable fetch
    setLoading(true);

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(setData)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort(); // cleanup
  }, [url]);

  useEffect(() => {
    const abortFn = fetchData();
    return () => abortFn && abortFn();
  }, [fetchData]);

  return { data, loading, error };
}

/*
Enterprise Notes:
- Generic typing ensures type safety across project
- AbortController avoids memory leaks for unmounted components
- Can be extended with caching, retry policies, or integration with RTK Query/TanStack Query
*/
```

---

## 4️⃣ Practical Exercises / Bài tập ứng dụng

| Level | Exercise                                                                                                   | Learning Objectives / Kỳ vọng                                            |
| ----- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 1     | Build `useCounter` hook with increment/decrement/reset                                                     | Understand basic reusable hook, typing, state management                 |
| 2     | Build `useDebounce` hook for search input and integrate with `useFetch`                                    | Combine hooks, async logic, and performance optimization                 |
| 3     | Build `useAuth` hook for enterprise login flow with token refresh, error handling, and context integration | Enterprise-ready hook, handles side-effects, async retry, testable logic |

---

## 5️⃣ Notes / Ghi chú

* Always **cleanup subscriptions** (e.g., event listeners, fetch abort) to avoid memory leaks.
* Use **generics for type safety** across enterprise codebase.
* Combine hooks for **composition over inheritance**.
* **Memoize callbacks** to prevent unnecessary re-renders.
* Enterprise trade-offs: balance between hook generality vs specific project needs.

---

## 6️⃣ Summary / Tổng kết

**EN:**

* Learned how to **build reusable, typed, and performant custom hooks**
* Managed **async operations, DOM events, and state abstraction**
* Applied hooks in **enterprise-grade patterns** with proper cleanup and type safety

**VN:**

* Học cách **tạo reusable, typed, hiệu năng cao custom hook**
* Quản lý **async operation, DOM event, abstraction state**
* Áp dụng hook trong **pattern doanh nghiệp** với cleanup và type safety

**Checklist Skills / Kiểm tra kỹ năng:**

* [ ] Reusable hooks: useCounter, useFetch
* [ ] Async handling + AbortController
* [ ] DOM event hooks with cleanup
* [ ] Performance optimization: memoization
* [ ] Enterprise-ready patterns: testable, composable, type-safe

---