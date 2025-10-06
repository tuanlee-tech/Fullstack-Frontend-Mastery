# Day 8: State Management với Redux & Zustand (Page + App Router)

## Mục tiêu học

Sau ngày học này, bạn sẽ:

1. Hiểu cơ chế **state management** trong Next.js.
2. Sử dụng **Redux Toolkit** cho global state phức tạp.
3. Sử dụng **Zustand** cho state nhẹ, reusable.
4. Kết hợp state management với **SSR/SSG** và **App Router**.
5. Viết code type-safe, production-ready, maintainable.
6. Thực hành patterns enterprise: slice modular, store reusable, testable.

---

## TL;DR

* Redux: cho **complex state**, nhiều slice, nhiều middleware.
* Zustand: cho **lightweight state**, easy API, nhanh chóng.
* Page Router / App Router đều có thể sử dụng.
* Tách store, slices, actions, selectors cho maintainable code.

---

## 1️⃣ Lý thuyết chi tiết

### 1.1 Redux Toolkit Setup

```bash
npm install @reduxjs/toolkit react-redux
```

```ts
// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';

export const store = configureStore({ reducer: { counter: counterReducer } });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```ts
// store/slices/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState { value: number }
const initialState: CounterState = { value: 0 };

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => { state.value += 1 },
    decrement: (state) => { state.value -= 1 },
    incrementByAmount: (state, action: PayloadAction<number>) => { state.value += action.payload },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```

**Provider (Page Router / App Router):**

```tsx
// app/layout.tsx hoặc pages/_app.tsx
import { Provider } from 'react-redux';
import { store } from '../store/store';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
```

---

### 1.2 Zustand Setup

```bash
npm install zustand
```

```ts
// store/useCounterStore.ts
import { create } from 'zustand';

interface CounterState { value: number; increment: () => void; decrement: () => void }

export const useCounterStore = create<CounterState>((set) => ({
  value: 0,
  increment: () => set((state) => ({ value: state.value + 1 })),
  decrement: () => set((state) => ({ value: state.value - 1 })),
}));
```

```tsx
// Usage in Component
'use client';
import { useCounterStore } from '../store/useCounterStore';

export default function Counter() {
  const { value, increment, decrement } = useCounterStore();
  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{value}</span>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

---

## 2️⃣ Bài tập

### Level 1

* **Đề:** Tạo counter dùng **Zustand**, hiển thị tăng/giảm.
* **Giải:** Sử dụng `useCounterStore` như ví dụ trên.

---

### Level 2

* **Đề:** Redux Toolkit counter với `incrementByAmount` và hiển thị value global trong nhiều component.
* **Giải:**

  * Tạo slice `counterSlice.ts`.
  * Provider ở `_app.tsx` hoặc `app/layout.tsx`.
  * Dispatch action từ nhiều component.

---

### Level 3

* **Đề:** Kết hợp **Redux + SSR**: fetch initial value từ server (`getServerSideProps`) và hydrate store.
* **Giải:**

```ts
// pages/counter.tsx
import { GetServerSideProps } from 'next';
import { store } from '../store/store';
import { incrementByAmount } from '../store/slices/counterSlice';

export const getServerSideProps: GetServerSideProps = async () => {
  store.dispatch(incrementByAmount(5)); // initial value from server
  return { props: {} };
};
```

* Component sử dụng Provider bình thường.

---

## 3️⃣ Common Pitfalls

* Không wrap Provider → hook Redux lỗi.
* Zustand + SSR: cần client component (`use client`) để tránh hydration mismatch.
* Redux quá complex cho state nhẹ → overkill.

---

## 4️⃣ Performance / Security Notes

* Redux Toolkit + immer → immutable update, safe, nhưng large state → memory impact.
* Zustand lightweight → rất nhanh, dễ test.
* Hydrate server state cẩn thận → tránh mismatch.

---

## 5️⃣ Further Reading

* [Redux Toolkit Docs](https://redux-toolkit.js.org/)
* [Zustand Docs](https://zustand-demo.pmnd.rs/)
* [Next.js + Redux SSR](https://redux.js.org/usage/usage-with-typescript)

---

[<< Ngày 7](./Day07.md) | [Ngày 9 >>](./Day09.md)
