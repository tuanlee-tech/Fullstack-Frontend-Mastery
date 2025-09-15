# Day 04 – Redux Toolkit / Redux Toolkit


## 1️⃣ Overview / Tổng quan

**EN:**
Redux Toolkit (RTK) is the **official, opinionated way to write Redux logic**. It simplifies store setup, slices, reducers, and middleware, reducing boilerplate while keeping **predictable state management**. RTK is widely used in Enterprise applications to **manage complex app state, async actions, caching strategies**, and maintain **scalable architecture**.

**VN:**
Redux Toolkit (RTK) là cách **chính thức, chuẩn hóa để viết Redux**. Nó đơn giản hóa việc tạo store, slices, reducers và middleware, giảm boilerplate nhưng vẫn giữ **quản lý state dự đoán được**. RTK được sử dụng rộng rãi trong dự án doanh nghiệp để **quản lý state phức tạp, async actions, caching**, và duy trì **kiến trúc có thể mở rộng**.

**Enterprise Relevance / Ví dụ doanh nghiệp:**

* Managing product catalogs, shopping carts, filters.
* Handling async operations with **createAsyncThunk** (API calls, optimistic updates).
* Implementing caching & invalidation with **RTK Query**.

---

## 2️⃣ Key Concepts / Kiến thức cần học

| Concept          | Description EN / VN                                           | Code Snippet / Example                                   |
| ---------------- | ------------------------------------------------------------- | -------------------------------------------------------- |
| `configureStore` | Simplified store setup / Tạo store đơn giản                   | `const store = configureStore({ reducer: rootReducer })` |
| Slice            | Reducer + actions in one / Reducer + actions gộp trong 1 file | `createSlice({ name, initialState, reducers })`          |
| createAsyncThunk | Async actions / Thunks bất đồng bộ                            | `export const fetchProducts = createAsyncThunk(...)`     |
| Middleware       | Extend behavior / Mở rộng chức năng                           | `getDefaultMiddleware().concat(logger)`                  |
| RTK Query        | Server state management / Quản lý state server                | `createApi({ baseQuery, endpoints })`                    |

---

## 3️⃣ Code Example / Ví dụ code

```tsx
// File: store/productSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from '../types';
import axios from 'axios';

// Async action (Enterprise: handle retry/caching)
export const fetchProducts = createAsyncThunk<Product[]>(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/products');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Fetch failed');
    }
  }
);

type ProductState = {
  items: Product[];
  loading: boolean;
  error: string | null;
};

const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { addProduct, removeProduct } = productSlice.actions;
export default productSlice.reducer;

/*
Enterprise Notes:
- Using createAsyncThunk ensures predictable async flow
- Builder syntax for extraReducers scales for multiple async actions
- TypeScript enforces correct payloads, reducing runtime errors
- Can combine with RTK Query for caching server state
*/
```

---

## 4️⃣ Practical Exercises / Bài tập ứng dụng

| Level | Exercise                                                                                  | Learning Objectives / Kỳ vọng                                          |
| ----- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 1     | Create a slice to manage a simple counter with increment/decrement                        | Understand slice, actions, state updates                               |
| 2     | Create a slice to fetch products from fake API using createAsyncThunk                     | Async actions, loading/error states, TypeScript payload                |
| 3     | Enterprise: Implement product slice with RTK Query + caching + retry + middleware logging | Scalable state, server caching, enterprise patterns, Type-safe actions |

---

## 5️⃣ Notes / Ghi chú

* Always define **type-safe state & actions** with TypeScript.
* Prefer **createSlice + createAsyncThunk** over manually writing reducers and action creators.
* Middleware can handle **logging, retry, caching strategies**.
* Combine **RTK Query** for server state; use slices for client/local state.
* Enterprise tip: split slices by domain (products, cart, auth) to reduce merge conflicts.

---

## 6️⃣ Summary / Tổng kết

**EN:**

* Mastered **Redux Toolkit slices, async thunks, and middleware**
* Scaled state management for **Enterprise apps**
* Learned **type-safe, predictable, modular state architecture**

**VN:**

* Thành thạo **Redux Toolkit slices, async thunks, middleware**
* Scale state management cho **dự án doanh nghiệp**
* Hiểu **state type-safe, dự đoán được, modular**

**Checklist Skills / Kiểm tra kỹ năng:**

* [ ] `createSlice` + actions
* [ ] `createAsyncThunk` + async state
* [ ] Middleware integration
* [ ] Type-safe reducers & payloads
* [ ] RTK Query for server state management