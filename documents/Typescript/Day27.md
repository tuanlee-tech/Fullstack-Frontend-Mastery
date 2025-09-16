# 🟩 Day 27: Redux Toolkit với TypeScript

1. **Redux-Saga với TypeScript** → phù hợp khi dự án lớn, nhiều side effects phức tạp, dễ test.
2. **RTK Query** → built-in solution của RTK cho **data fetching + caching** (thay Axios thủ công).

---

**Gồm  3 phần lớn:**

* **Redux Toolkit Core + Async Thunk** : Async logic với `createAsyncThunk` (basic → standard)

* **Redux-Saga với TypeScript**: Async logic với **Redux-Saga** (enterprise pattern).

* **RTK Query với TypeScript**:  Async logic với **RTK Query** (modern, giảm boilerplate).
---
## 🎯 Mục tiêu học

* Thành thạo Redux Toolkit (RTK) core (`store`, `slice`, `reducers`).
* Quản lý async logic với **3 patterns**:

  * `createAsyncThunk` (dễ dùng, chuẩn RTK).
  * **Redux-Saga** (control flow, side effects phức tạp).
  * **RTK Query** (data fetching/caching built-in).
* Kết hợp với TypeScript để đảm bảo **type-safety end-to-end**.
* Hiểu trade-off khi chọn giải pháp nào trong enterprise.

---

## ⚡ TL;DR

* Dự án nhỏ → `createAsyncThunk`.
* Dự án lớn, nhiều flow phức tạp → **Redux-Saga**.
* Dự án CRUD-heavy, API-driven → **RTK Query**.

---

## 📚 Nội dung chi tiết

### 1. Store + Slice (như cũ)

Đã có ví dụ `counterSlice`, `todosSlice` với `createAsyncThunk` (Day 27 bản cũ).

---

### 2. Redux-Saga với TypeScript

👉 Cần middleware:

```bash
npm install redux-saga
```

#### a. Setup Saga Middleware

```ts
// store.ts
import createSagaMiddleware from "redux-saga";
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counterSlice";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: { counter: counterReducer },
  middleware: (getDefault) => getDefault().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### b. Tạo Saga

```ts
// sagas/counterSaga.ts
import { takeEvery, put, delay } from "redux-saga/effects";
import { incrementByAmount } from "../features/counterSlice";

function* incrementAsync() {
  yield delay(1000);
  yield put(incrementByAmount(5));
}

export default function* counterSaga() {
  yield takeEvery("counter/incrementAsync", incrementAsync);
}
```

#### c. Root Saga

```ts
// sagas/index.ts
import { all } from "redux-saga/effects";
import counterSaga from "./counterSaga";

export default function* rootSaga() {
  yield all([counterSaga()]);
}
```

👉 Component dispatch:

```ts
dispatch({ type: "counter/incrementAsync" });
```

---

### 3. RTK Query

👉 Tích hợp vào RTK, cực mạnh cho API.

```ts
// services/todosApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export const todosApi = createApi({
  reducerPath: "todosApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://jsonplaceholder.typicode.com/" }),
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => "todos?_limit=5",
    }),
  }),
});

export const { useGetTodosQuery } = todosApi;
```

👉 Add vào store:

```ts
import { todosApi } from "./services/todosApi";

export const store = configureStore({
  reducer: {
    [todosApi.reducerPath]: todosApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(todosApi.middleware),
});
```

👉 Dùng trong Component:

```tsx
const { data: todos, isLoading } = useGetTodosQuery();

return (
  <ul>
    {isLoading ? <p>Loading...</p> : todos?.map((t) => <li key={t.id}>{t.title}</li>)}
  </ul>
);
```

---


## 🔎 So sánh `createAsyncThunk` vs Redux-Saga vs RTK Query

| Feature / Tiêu chí                        | **Async Thunk**                        | **Redux-Saga**                                                    | **RTK Query**                                                       |
| ----------------------------------------- | -------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------- |
| ⚡ Boilerplate                             | Ít, đơn giản                           | Trung bình → nhiều (watcher/worker)                               | Rất ít, hooks auto-gen                                              |
| 🧠 Độ phức tạp                            | Thấp–Trung bình                        | Cao (generator, effect creators)                                  | Thấp                                                                |
| 🔄 Flow Control (retry, cancel, debounce) | Hạn chế, phải code tay                 | Rất mạnh (takeLatest, race, cancel, retry)                        | Một số built-in (polling, refetch), nhưng không linh hoạt bằng saga |
| 🧪 Testability                            | Tương đối dễ test                      | Dễ test nhất (generator → pure function)                          | Test khó hơn (hook-based)                                           |
| 🏗️ Use Case                              | Dự án nhỏ–trung bình, CRUD cơ bản      | Enterprise app, flow phức tạp (auth, background tasks, websocket) | CRUD-heavy apps, API-driven apps                                    |
| 🛠️ TypeScript support                    | Tốt (với `PayloadAction`, `RootState`) | Tốt, nhưng typing effect hơi verbose                              | Rất tốt, auto infer từ endpoint                                     |
| 💾 Caching / Data Sync                    | Manual (extraReducers)                 | Manual (phải viết state)                                          | Built-in (cache, invalidation, polling)                             |
| ⏱️ Learning curve                         | Dễ cho beginner                        | Khó, cần nhiều thời gian                                          | Dễ, rất DX-friendly                                                 |
| 🏢 Ai nên chọn?                           | Teams nhỏ, feature đơn giản            | Teams lớn, cần kiểm soát side effect phức tạp                     | Teams vừa–lớn, app phụ thuộc nhiều API                              |

---

👉 **Enterprise takeaway**:

* Dự án nhỏ/CRUD đơn giản → **Async Thunk**.
* Enterprise phức tạp (auth, socket, background task) → **Redux-Saga**.
* API-heavy app (CMS, e-commerce, admin dashboard) → **RTK Query**.

---


## 📝 Bài tập

### Level 1

Tạo `themeSlice` (dark/light) như trước.

---

### Level 2

Viết `userSaga` xử lý login (fake API: delay 1s → return token).

* Dispatch action `"user/loginRequest"`.
* Saga call API giả, trả `"user/loginSuccess"`.

---

### Level 3

Dùng **RTK Query** tạo service `postsApi`:

* Endpoint `getPosts` (fetch list).
* Component `PostsList` render ra danh sách.
* Hiển thị loading/error.

---

## ⚠️ Common Pitfalls

* Quên `.concat(sagaMiddleware)` khi add saga.
* Với RTK Query: quên add reducer + middleware → hook không hoạt động.
* Saga dễ bị leak nếu quên cancel watcher trong flow phức tạp.

---

## 📖 Further Reading

* [Redux Toolkit Query Docs](https://redux-toolkit.js.org/rtk-query/overview)
* [Redux-Saga Docs](https://redux-saga.js.org/)
* [Redux Advanced Patterns](https://redux.js.org/style-guide/)

---


### 📝 Giải bài tập Day 27 – Overview

---

## ✅ Level 1: `themeSlice` (dark/light)

```ts
// features/themeSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark";

interface ThemeState {
  mode: Theme;
}

const initialState: ThemeState = { mode: "light" };

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.mode = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
```

**Usage in component**:

```tsx
const mode = useSelector((state: RootState) => state.theme.mode);
const dispatch = useDispatch<AppDispatch>();

<button onClick={() => dispatch(toggleTheme())}>
  Current: {mode}
</button>
```

---

## ✅ Level 2: `userSaga` login flow (fake API)

```ts
// features/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  token: string | null;
  loading: boolean;
}

const initialState: UserState = { token: null, loading: false };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.loading = false;
    },
    loginFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure } = userSlice.actions;
export default userSlice.reducer;
```

Saga side effect:

```ts
// sagas/userSaga.ts
import { takeEvery, put, delay } from "redux-saga/effects";
import { loginRequest, loginSuccess, loginFailure } from "../features/userSlice";

function* loginWorker() {
  try {
    yield delay(1000); // fake API call
    yield put(loginSuccess("fake-token-123"));
  } catch {
    yield put(loginFailure());
  }
}

export default function* userSaga() {
  yield takeEvery(loginRequest.type, loginWorker);
}
```

**Usage in component**:

```tsx
const dispatch = useDispatch<AppDispatch>();
const { token, loading } = useSelector((s: RootState) => s.user);

<button onClick={() => dispatch(loginRequest())}>
  {loading ? "Logging in..." : "Login"}
</button>

{token && <p>Token: {token}</p>}
```

---

## ✅ Level 3: RTK Query `postsApi`

```ts
// services/postsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Post {
  id: number;
  title: string;
}

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://jsonplaceholder.typicode.com/" }),
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => "posts?_limit=5",
    }),
  }),
});

export const { useGetPostsQuery } = postsApi;
```

**Add to store**:

```ts
import { postsApi } from "./services/postsApi";

export const store = configureStore({
  reducer: {
    [postsApi.reducerPath]: postsApi.reducer,
  },
  middleware: (gDM) => gDM().concat(postsApi.middleware),
});
```

**Usage in component**:

```tsx
const { data: posts, isLoading, error } = useGetPostsQuery();

if (isLoading) return <p>Loading...</p>;
if (error) return <p>Error fetching posts</p>;

return (
  <ul>
    {posts?.map((p) => (
      <li key={p.id}>{p.title}</li>
    ))}
  </ul>
);
```

---

Bắt đầu đi sâu vào **Redux Toolkit Core + Async Thunk** trước. Đây là nền tảng quan trọng, giúp bạn hiểu rõ cơ chế state, reducer, middleware trước khi nhảy sang **Saga** và **RTK Query**.

---

## 🟩 Redux Toolkit Core + Async Thunk

## 🎯 Mục tiêu học

* Hiểu rõ cách RTK quản lý state với `slice`.
* Biết cách dùng `createAsyncThunk` để xử lý async logic.
* TypeScript hoá toàn bộ flow: `RootState`, `AppDispatch`, `PayloadAction`.
* Thực hành CRUD cơ bản với API (todos).

---

## 1️⃣ Core Concepts

### Store + Slice

RTK gộp các reducer nhỏ (`slice`) thành 1 store duy nhất.

```ts
// store.ts
import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "./features/todosSlice";

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```ts
// features/todosSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodosState {
  list: Todo[];
}

const initialState: TodosState = { list: [] };

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.list.push(action.payload);
    },
  },
});

export const { addTodo } = todosSlice.actions;
export default todosSlice.reducer;
```

---

## 2️⃣ Async Logic với `createAsyncThunk`

### a. Tạo async action

```ts
// features/todosSlice.ts
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
  return (await res.json()) as Todo[];
});
```

### b. Xử lý trong extraReducers

```ts
const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.list.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        console.log("Loading...");
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchTodos.rejected, (state) => {
        console.log("Error fetching todos");
      });
  },
});
```

### c. Component sử dụng

```tsx
const dispatch = useDispatch<AppDispatch>();
const todos = useSelector((s: RootState) => s.todos.list);

useEffect(() => {
  dispatch(fetchTodos());
}, [dispatch]);

return (
  <ul>
    {todos.map((t) => (
      <li key={t.id}>{t.title}</li>
    ))}
  </ul>
);
```

---

## 3️⃣ Enterprise Patterns (Best Practices)

* **Always type RootState + AppDispatch** → tránh nhầm lẫn khi dùng `useSelector`/`useDispatch`.
* **Group async actions trong extraReducers** → giữ reducer gọn gàng.
* **Error handling**: trả về custom error từ `rejectWithValue`.
* **Normalization**: khi dữ liệu lớn, dùng `createEntityAdapter`.

---

## 4️⃣ Bài tập thực hành

### Level 1

Tạo `counterSlice` có:

* state `{ value: number }`
* actions: `increment`, `decrement`
* dispatch từ component.

---

### Level 2

Dùng `createAsyncThunk` fetch `users` từ API:

* `https://jsonplaceholder.typicode.com/users`
* Lưu vào `usersSlice`.

---

### Level 3

Nâng cấp `usersSlice`:

* Thêm state `loading`, `error`.
* Dùng `rejectWithValue` khi API lỗi.
* Component hiển thị 3 trạng thái: Loading / Error / Success.

---

👉 Sau khi bạn làm xong **3 Level này**, mình sẽ gợi ý thêm **Level 4 (Enterprise)**:

* Dùng `createEntityAdapter` để quản lý users dạng normalized state (giống database).

---


### 📝 Giải bài tập Redux Toolkit Core + Async Thunk

---

## ✅ Level 1: `counterSlice`

```ts
// features/counterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
}

const initialState: CounterState = { value: 0 };

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```

**Usage in component**:

```tsx
const value = useSelector((s: RootState) => s.counter.value);
const dispatch = useDispatch<AppDispatch>();

return (
  <div>
    <p>Value: {value}</p>
    <button onClick={() => dispatch(increment())}>+1</button>
    <button onClick={() => dispatch(decrement())}>-1</button>
    <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
  </div>
);
```

---

## ✅ Level 2: Fetch `users` với `createAsyncThunk`

```ts
// features/usersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: number;
  name: string;
  email: string;
}

interface UsersState {
  list: User[];
}

const initialState: UsersState = { list: [] };

// async thunk
export const fetchUsers = createAsyncThunk<User[]>(
  "users/fetchUsers",
  async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    return (await res.json()) as User[];
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
      state.list = action.payload;
    });
  },
});

export default usersSlice.reducer;
```

**Usage in component**:

```tsx
const dispatch = useDispatch<AppDispatch>();
const users = useSelector((s: RootState) => s.users.list);

useEffect(() => {
  dispatch(fetchUsers());
}, [dispatch]);

return (
  <ul>
    {users.map((u) => (
      <li key={u.id}>{u.name} ({u.email})</li>
    ))}
  </ul>
);
```

---

## ✅ Level 3: Loading + Error Handling với `rejectWithValue`

```ts
// features/usersSlice.ts
interface UsersState {
  list: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = { list: [], loading: false, error: null };

export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      if (!res.ok) {
        return rejectWithValue("Failed to fetch users");
      }
      return (await res.json()) as User[];
    } catch {
      return rejectWithValue("Network error");
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});
```

**Usage in component**:

```tsx
const { list, loading, error } = useSelector((s: RootState) => s.users);

useEffect(() => {
  dispatch(fetchUsers());
}, [dispatch]);

if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error}</p>;

return (
  <ul>
    {list.map((u) => (
      <li key={u.id}>{u.name}</li>
    ))}
  </ul>
);
```

---

Mở rộng sang **Level 4: Enterprise State Management với `createEntityAdapter`**. Đây là bước nâng cao trong **Redux Toolkit Core + Async Thunk**.

---

### 📝 Level 4: `createEntityAdapter` (Normalized State)

Trong enterprise app, dữ liệu thường có **nhiều bản ghi (list)** → nếu lưu dạng array thuần (`User[]`) thì:

* Khó update 1 record (phải `map` lại).
* Khó xoá 1 record (phải filter).
* Performance kém khi dataset lớn.

👉 Giải pháp: **Normalized State** (`id → entity`) bằng `createEntityAdapter`.

---

## 1. Setup Slice với `createEntityAdapter`

```ts
// features/usersSlice.ts
import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface User {
  id: number;
  name: string;
  email: string;
}

// Tạo adapter
const usersAdapter = createEntityAdapter<User>({
  selectId: (user) => user.id, // default là `id`, có thể tuỳ chỉnh
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

// State chuẩn hoá
const initialState = usersAdapter.getInitialState({
  loading: false,
  error: null as string | null,
});

// Async thunk fetch users
export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      if (!res.ok) {
        return rejectWithValue("Failed to fetch users");
      }
      return (await res.json()) as User[];
    } catch {
      return rejectWithValue("Network error");
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    userAdded: usersAdapter.addOne,
    userUpdated: usersAdapter.updateOne,
    userRemoved: usersAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        usersAdapter.setAll(state, action.payload); // ✅ fill normalized data
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

// Export action creators
export const { userAdded, userUpdated, userRemoved } = usersSlice.actions;

// Export selectors (memoized)
export const usersSelectors = usersAdapter.getSelectors<RootState>(
  (state) => state.users
);

export default usersSlice.reducer;
```

---

## 2. Store Setup

```ts
// store.ts
import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./features/usersSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 3. Usage trong Component

```tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, usersSelectors, userUpdated, userRemoved } from "../features/usersSlice";
import { AppDispatch, RootState } from "../store";

export default function UsersList() {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector(usersSelectors.selectAll);
  const loading = useSelector((s: RootState) => s.users.loading);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>
          {u.name} ({u.email})
          <button
            onClick={() =>
              dispatch(userUpdated({ id: u.id, changes: { name: "Updated User" } }))
            }
          >
            Update
          </button>
          <button onClick={() => dispatch(userRemoved(u.id))}>Remove</button>
        </li>
      ))}
    </ul>
  );
}
```

---

## 4. Ưu điểm so với Array State

| Array State (cũ)               | Entity Adapter (mới)                 |
| ------------------------------ | ------------------------------------ |
| Update: `map` toàn bộ array    | Update: `updateOne({ id, changes })` |
| Remove: `filter` toàn bộ array | Remove: `removeOne(id)`              |
| Tìm 1 item: `find` → O(n)      | Tìm 1 item: `selectById(id)` → O(1)  |
| Không có sort built-in         | Built-in `sortComparer`              |

---

## 5. Bài tập Level 4

### 🎯 Yêu cầu:

1. Tạo `postsSlice` dùng `createEntityAdapter` + `fetchPosts`.

   * Endpoint: `https://jsonplaceholder.typicode.com/posts?_limit=5`.
2. Component `PostsList`:

   * Render list posts.
   * Nút `Update` (sửa `title`).
   * Nút `Remove`.

**Level 4: PostsSlice + PostsList** với `createEntityAdapter` + `AsyncThunk`.



## 1. postsSlice.ts

```ts
// features/postsSlice.ts
import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

// Adapter
const postsAdapter = createEntityAdapter<Post>({
  selectId: (post) => post.id,
  sortComparer: (a, b) => a.title.localeCompare(b.title),
});

// Initial state
const initialState = postsAdapter.getInitialState({
  loading: false,
  error: null as string | null,
});

// Async thunk
export const fetchPosts = createAsyncThunk<Post[], void, { rejectValue: string }>(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
      if (!res.ok) {
        return rejectWithValue("Failed to fetch posts");
      }
      return (await res.json()) as Post[];
    } catch {
      return rejectWithValue("Network error");
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postUpdated: postsAdapter.updateOne,
    postRemoved: postsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        postsAdapter.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export const { postUpdated, postRemoved } = postsSlice.actions;

// Selectors
export const postsSelectors = postsAdapter.getSelectors<RootState>(
  (state) => state.posts
);

export default postsSlice.reducer;
```

---

## 2. store.ts (update)

```ts
// store.ts
import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./features/usersSlice";
import postsReducer from "./features/postsSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer, // ✅ thêm posts reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 3. PostsList.tsx

```tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  postsSelectors,
  postUpdated,
  postRemoved,
} from "../features/postsSlice";
import { AppDispatch, RootState } from "../store";

export default function PostsList() {
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector(postsSelectors.selectAll);
  const loading = useSelector((s: RootState) => s.posts.loading);
  const error = useSelector((s: RootState) => s.posts.error);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts.map((p) => (
          <li key={p.id}>
            <strong>{p.title}</strong>
            <p>{p.body}</p>
            <button
              onClick={() =>
                dispatch(postUpdated({ id: p.id, changes: { title: "Updated Title!" } }))
              }
            >
              Update
            </button>
            <button onClick={() => dispatch(postRemoved(p.id))}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 4. Test Flow

1. Load page → `dispatch(fetchPosts())` → lấy 5 posts từ API.
2. `Update` → `postUpdated({ id, changes })` → chỉ update 1 post.
3. `Remove` → `postRemoved(id)` → xoá ngay lập tức khỏi state.

---

## Nâng cao: Todo App với Async Thunk

**Yêu cầu:**

* State:

  ```ts
  {
    todos: [],
    loading: false,
    error: null
  }
  ```
* Thunk `getTodos` → fetch todos
* Thunk `addTodo` → POST todo mới
* Reducer `toggleTodo` → đổi trạng thái `completed`.

```tsx
// store/todosSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodosState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodosState = {
  todos: [],
  loading: false,
  error: null,
};

export const getTodos = createAsyncThunk<Todo[]>(
  "todos/getTodos",
  async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
    if (!res.ok) throw new Error("Không thể tải todos");
    return (await res.json()) as Todo[];
  }
);

export const addTodo = createAsyncThunk<Todo, string>(
  "todos/addTodo",
  async (title: string) => {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      body: JSON.stringify({ title, completed: false }),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Không thể thêm todo");
    return (await res.json()) as Todo;
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.todos.find((t) => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(getTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Lỗi tải todos";
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      });
  },
});

export const { toggleTodo } = todosSlice.actions;
export default todosSlice.reducer;
```

```tsx
// components/Todos.tsx
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { getTodos, addTodo, toggleTodo } from "../store/todosSlice";
import { useState } from "react";

export function Todos() {
  const { todos, loading, error } = useSelector((s: RootState) => s.todos);
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");

  return (
    <div>
      <button onClick={() => dispatch(getTodos())}>Tải Todos</button>
      {loading && <p>Đang tải...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {todos.map((t) => (
          <li
            key={t.id}
            style={{ textDecoration: t.completed ? "line-through" : "none" }}
            onClick={() => dispatch(toggleTodo(t.id))}
          >
            {t.title}
          </li>
        ))}
      </ul>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button onClick={() => dispatch(addTodo(title))}>Thêm Todo</button>
    </div>
  );
}
```

✅ Kết quả mong đợi:

* Bấm **Tải Todos** → fetch danh sách từ API.
* Gõ input → thêm todo mới.
* Click vào todo → toggle completed.


---

### 📌 Tổng kết Redux Toolkit Core + AsyncThunk

---

## 🔹 Level 1 – Cơ bản Slice + Reducer

* Sử dụng `createSlice` để gom action + reducer + state vào một nơi.
* Code ngắn gọn hơn so với Redux cũ (`switch/case`).
* Ví dụ: `counterSlice` (`increment`, `decrement`, `reset`).
* 👉 Bài tập: Counter app.

---

## 🔹 Level 2 – Async Thunk (Side Effects)

* Sử dụng `createAsyncThunk` để gọi API.
* Tự động tạo ra 3 trạng thái: `pending`, `fulfilled`, `rejected`.
* Tích hợp với `extraReducers` để xử lý `loading`, `error`.
* 👉 Bài tập: `usersSlice` fetch từ API `jsonplaceholder`.

---

## 🔹 Level 3 – Typescript + Typed Hooks

* Dùng Generics trong `createAsyncThunk<T, Arg, { rejectValue: string }>` để có typing chặt chẽ.
* Dùng `AppDispatch`, `RootState` để tạo hooks `useAppDispatch`, `useAppSelector`.
* Tránh bug runtime nhờ compile-time check.
* 👉 Bài tập: typed hooks cho Users.

---

## 🔹 Level 4 – Entity Adapter (Normalized State)

* Sử dụng `createEntityAdapter` để quản lý dữ liệu dạng list (users, posts).
* Tự động có selectors: `selectAll`, `selectById`, `selectIds`.
* Ưu điểm:

  | Array thuần             | Entity Adapter             |
  | ----------------------- | -------------------------- |
  | Update: `map` lại array | `updateOne({id, changes})` |
  | Remove: `filter`        | `removeOne(id)`            |
  | Tìm 1 item: O(n)        | Tìm 1 item: O(1)           |
* 👉 Bài tập: `postsSlice` fetch, update, remove.

---

## 🌟 Tổng quan tiến trình

1. **State cục bộ** (counter).
2. **State async** (users, fetch API).
3. **Type-safe hooks** với TypeScript.
4. **Enterprise-ready state** với Entity Adapter.


---

### 🎯 Q\&A Interview – Redux Toolkit Core + Async Thunk

---

### ❓ Q1: Redux Toolkit giải quyết vấn đề gì so với Redux thuần?

**🇺🇸 Answer:**
Redux Toolkit reduces boilerplate by providing `createSlice`, `createAsyncThunk`, and `configureStore`. It enforces good practices (immutability via Immer, default middleware, devtools integration).

**🇻🇳 Trả lời:**
Redux Toolkit giảm boilerplate nhờ `createSlice`, `createAsyncThunk`, `configureStore`. Nó áp dụng best practices (immutability với Immer, middleware mặc định, tích hợp devtools).

---

### ❓ Q2: `createSlice` hoạt động thế nào?

**🇺🇸 Answer:**
`createSlice` generates action creators and reducers from a single definition. It uses Immer under the hood so we can "mutate" state directly, but it stays immutable internally.

**🇻🇳 Trả lời:**
`createSlice` tự động tạo action + reducer từ một định nghĩa duy nhất. Bên trong dùng Immer nên ta viết code "mutate" state, nhưng thực chất state vẫn immutable.

---

### ❓ Q3: Khi nào bạn nên dùng `createAsyncThunk` thay vì gọi API trực tiếp trong component?

**🇺🇸 Answer:**
Use `createAsyncThunk` when you want to centralize async logic in Redux, get pending/fulfilled/rejected lifecycle actions, and keep components simpler. This is ideal for shared state or reusable API calls.

**🇻🇳 Trả lời:**
Dùng `createAsyncThunk` khi muốn quản lý async logic tập trung ở Redux, có lifecycle action (pending/fulfilled/rejected), và giữ component đơn giản. Phù hợp khi state dùng chung hoặc API tái sử dụng.

---

### ❓ Q4: So sánh `createAsyncThunk` với Saga?

**🇺🇸 Answer:**
`createAsyncThunk` is simple and covers most CRUD needs, but lacks advanced flow control. Saga allows orchestration, retry, cancel, debounce, etc. AsyncThunk is best for simple API calls, Saga for enterprise workflows.

**🇻🇳 Trả lời:**
`createAsyncThunk` đơn giản, đủ cho CRUD, nhưng không có flow control nâng cao. Saga cho phép orchestration, retry, cancel, debounce… AsyncThunk hợp cho API đơn giản, Saga cho enterprise workflow.

---

### ❓ Q5: Làm thế nào để type-safe `createAsyncThunk` trong TypeScript?

**🇺🇸 Answer:**
By defining types for `Returned`, `ThunkArg`, and using `RootState`. Example:

```ts
export const fetchUser = createAsyncThunk<User, number, { state: RootState }>(
  "user/fetch",
  async (id, thunkAPI) => {
    const res = await fetch(`/api/users/${id}`);
    return (await res.json()) as User;
  }
);
```

**🇻🇳 Trả lời:**
Khai báo type cho `Returned`, `ThunkArg`, và dùng `RootState`.

```ts
export const fetchUser = createAsyncThunk<User, number, { state: RootState }>(
  "user/fetch",
  async (id, thunkAPI) => {
    const res = await fetch(`/api/users/${id}`);
    return (await res.json()) as User;
  }
);
```

---

### ❓ Q6: Bạn quản lý loading và error trong AsyncThunk thế nào?

**🇺🇸 Answer:**
By using the extraReducers lifecycle actions:

* `pending` → set `loading = true`
* `fulfilled` → update state, `loading = false`
* `rejected` → set `error`, `loading = false`

**🇻🇳 Trả lời:**
Dùng extraReducers trong lifecycle:

* `pending` → `loading = true`
* `fulfilled` → cập nhật state, `loading = false`
* `rejected` → set `error`, `loading = false`

---

### ❓ Q7: Khi nào KHÔNG nên dùng Redux cho state?

**🇺🇸 Answer:**
When state is local to one component (like form inputs or UI toggle), using `useState` or `useReducer` is better. Redux should be reserved for global/shared state.

**🇻🇳 Trả lời:**
Khi state chỉ local trong 1 component (như form input, toggle), nên dùng `useState`/`useReducer`. Redux chỉ nên dùng cho global/shared state.

---

### ❓ Q8 (Bonus): Middleware mặc định trong Redux Toolkit gồm gì?

**🇺🇸 Answer:**
Redux Toolkit includes `redux-thunk`, `serializableCheck`, and `immutableCheck` by default.

**🇻🇳 Trả lời:**
Redux Toolkit mặc định gồm `redux-thunk`, `serializableCheck`, và `immutableCheck`.

---

👉 Bộ này kiểm tra **nền tảng Redux Toolkit + AsyncThunk** trước khi sang enterprise mix.


👉 Tới đây bạn đã làm chủ **Redux Toolkit Core**, sẵn sàng sang **Redux-Saga (Side Effects nâng cao)** và **RTK Query (Data Fetching tối ưu)**.


---

# 🟦 Redux-Saga với TypeScript

## 🎯 Mục tiêu học

* Hiểu **Redux-Saga là gì** và khi nào nên dùng.
* Làm quen với các **effect cơ bản** (`takeEvery`, `takeLatest`, `call`, `put`, `delay`).
* Biết cách setup `sagaMiddleware` trong store.
* Quản lý **side effects phức tạp** (retry, cancel, debounce).
* Viết code **type-safe với TypeScript**.

---

## ⚡ TL;DR

* Redux-Saga = Middleware cho Redux → quản lý side effects bằng **generator functions**.
* Dùng tốt cho enterprise app có nhiều **flow logic phức tạp** (auth, socket, background tasks).
* Khác với `createAsyncThunk`: Saga cho bạn **toàn quyền kiểm soát flow**.

---

## 📚 Nội dung chi tiết

### 1. Setup Store với Saga Middleware

```ts
// store.ts
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import counterReducer from "./features/counterSlice";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: { counter: counterReducer },
  middleware: (getDefault) => getDefault().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

### 2. Tạo Saga đơn giản

```ts
// sagas/counterSaga.ts
import { takeEvery, put, delay } from "redux-saga/effects";
import { incrementByAmount } from "../features/counterSlice";

// Worker saga
function* incrementAsync() {
  yield delay(1000); // fake API call
  yield put(incrementByAmount(5));
}

// Watcher saga
export default function* counterSaga() {
  yield takeEvery("counter/incrementAsync", incrementAsync);
}
```

---

### 3. Root Saga

```ts
// sagas/index.ts
import { all } from "redux-saga/effects";
import counterSaga from "./counterSaga";

export default function* rootSaga() {
  yield all([counterSaga()]);
}
```

---

## 📝 Bài tập

### Level 5 – Hello Saga

* Tạo `counterSaga` (như ví dụ).
* Dispatch action `"counter/incrementAsync"` → sau 1s tăng `+5`.
* 🚀 Kiểm tra UI render.

---

### Level 6 – Login Saga

* Tạo `userSlice` với state: `{ isAuth, token, loading, error }`.
* Tạo `userSaga`:

  * Lắng nghe `"user/loginRequest"`.
  * Call API giả (delay 1s).
  * Nếu ok → dispatch `"user/loginSuccess"`.
  * Nếu fail → dispatch `"user/loginFailure"`.

---

### Level 7 – Advanced Control Flow

* Tạo `searchSaga`:

  * Lắng nghe `"search/queryChanged"`.
  * Dùng `takeLatest` để **debounce** API call (cancel request cũ).
  * Call API giả → trả danh sách gợi ý.

---

## ⚠️ Pitfalls

* Quên `.concat(sagaMiddleware)` trong store → Saga không chạy.
* Dùng `call`/`put` sai → generator không hoạt động.
* Dùng `takeEvery` thay `takeLatest` → bị race condition.


---

### 🟦 Redux-Saga với TypeScript – Bài giải

---

## ✅ Level 5 – Hello Saga

### counterSlice.ts

```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
}

const initialState: CounterState = { value: 0 };

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```

---

### counterSaga.ts

```ts
import { takeEvery, put, delay } from "redux-saga/effects";
import { incrementByAmount } from "../features/counterSlice";

// Worker saga
function* incrementAsync() {
  yield delay(1000); // fake API call
  yield put(incrementByAmount(5)); // dispatch action
}

// Watcher saga
export default function* counterSaga() {
  yield takeEvery("counter/incrementAsync", incrementAsync);
}
```

👉 Sử dụng:

```ts
dispatch({ type: "counter/incrementAsync" });
```

---

## ✅ Level 6 – Login Saga

### userSlice.ts

```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isAuth: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  isAuth: false,
  token: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuth = true;
      state.token = action.payload;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuth = false;
      state.token = null;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } =
  userSlice.actions;
export default userSlice.reducer;
```

---

### userSaga.ts

```ts
import { takeEvery, put, delay } from "redux-saga/effects";
import { loginRequest, loginSuccess, loginFailure } from "../features/userSlice";

// fake API
function* loginWorker(action: ReturnType<typeof loginRequest>) {
  try {
    yield delay(1000);
    // giả sử login thành công với token "fake_token"
    yield put(loginSuccess("fake_token"));
  } catch (err) {
    yield put(loginFailure("Login failed"));
  }
}

export default function* userSaga() {
  yield takeEvery(loginRequest.type, loginWorker);
}
```

👉 Sử dụng:

```ts
dispatch(loginRequest());
```

---

## ✅ Level 7 – Advanced Control Flow (Search with takeLatest)

### searchSlice.ts

```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  query: string;
  results: string[];
  loading: boolean;
}

const initialState: SearchState = {
  query: "",
  results: [],
  loading: false,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    queryChanged: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      state.loading = true;
    },
    querySuccess: (state, action: PayloadAction<string[]>) => {
      state.results = action.payload;
      state.loading = false;
    },
  },
});

export const { queryChanged, querySuccess } = searchSlice.actions;
export default searchSlice.reducer;
```

---

### searchSaga.ts

```ts
import { takeLatest, put, delay } from "redux-saga/effects";
import { queryChanged, querySuccess } from "../features/searchSlice";

// Worker saga
function* searchWorker(action: ReturnType<typeof queryChanged>) {
  yield delay(500); // debounce
  // fake API trả kết quả dựa theo query
  const fakeResults = [`${action.payload} 1`, `${action.payload} 2`];
  yield put(querySuccess(fakeResults));
}

// Watcher saga
export default function* searchSaga() {
  yield takeLatest(queryChanged.type, searchWorker);
}
```

👉 Sử dụng:

```ts
dispatch(queryChanged("redux"));
```

---

## 🎯 Tổng kết phần Redux-Saga (Level 5–7)

* **takeEvery**: chạy tất cả các action (counter).
* **takeLatest**: chỉ giữ request mới nhất, cancel cái cũ (search debounce).
* **put**: dispatch action trong saga.
* **delay**: fake API / debounce.
* **Saga hữu ích khi**: có nhiều flow async phức tạp, cần retry/cancel, hoặc test logic side effects tách biệt UI.

---

👉 Vậy là xong 3 level cơ bản cho Saga.
Kế tiếp **Level 8–9 (Enterprise Saga)**:

* **Retry + Error handling** (call API thất bại thử lại 3 lần).
* **Cancel flow (logout cancel request)**
---

### 🟦 Redux-Saga nâng cao với TypeScript

## 🎯 Mục tiêu

* Hiểu cách **retry API call** khi lỗi.
* Biết cách **cancel saga flow** khi có action khác (ví dụ logout).
* Làm quen với `call`, `race`, `cancel`, `take`.

---

## ✅ Level 8 – Retry + Error Handling

📌 Ý tưởng: Khi login thất bại → thử lại tối đa 3 lần, sau đó báo lỗi.

### userSagaRetry.ts

```ts
import { put, delay, call, takeEvery } from "redux-saga/effects";
import { loginRequest, loginSuccess, loginFailure } from "../features/userSlice";

// Fake API (có 50% tỉ lệ fail)
function fakeLoginApi() {
  return new Promise<string>((resolve, reject) => {
    const ok = Math.random() > 0.5;
    setTimeout(() => {
      ok ? resolve("retry_token") : reject("Login failed (random)");
    }, 500);
  });
}

function* loginWorkerRetry() {
  let attempts = 0;
  while (attempts < 3) {
    try {
      const token: string = yield call(fakeLoginApi);
      yield put(loginSuccess(token));
      return; // success → exit
    } catch (err: any) {
      attempts++;
      if (attempts < 3) {
        yield delay(1000); // wait before retry
      } else {
        yield put(loginFailure(err.toString()));
      }
    }
  }
}

export default function* userSagaRetry() {
  yield takeEvery(loginRequest.type, loginWorkerRetry);
}
```

👉 Giờ `dispatch(loginRequest())` có thể retry 3 lần trước khi báo lỗi.

---

## ✅ Level 9 – Cancel Flow (Logout cancels pending request)

📌 Ý tưởng: Nếu user **logout** trong lúc đang login → cancel saga login.

### userSagaCancel.ts

```ts
import { put, delay, race, take, call } from "redux-saga/effects";
import { loginRequest, loginSuccess, loginFailure, logout } from "../features/userSlice";

function* loginWorkerCancelable() {
  try {
    const { token, cancel } = yield race({
      token: call(fakeLoginApi), // login API
      cancel: take(logout.type), // nếu logout → cancel
    });

    if (cancel) {
      yield put(loginFailure("Login cancelled due to logout"));
    } else if (token) {
      yield put(loginSuccess(token));
    }
  } catch (err: any) {
    yield put(loginFailure(err.toString()));
  }
}

// fake API
function fakeLoginApi() {
  return new Promise<string>((resolve) => {
    setTimeout(() => resolve("cancel_token"), 2000);
  });
}

export default function* userSagaCancel() {
  yield take(loginRequest.type); // chỉ demo 1 lần
  yield call(loginWorkerCancelable);
}
```

👉 Demo flow:

1. `dispatch(loginRequest())` → bắt đầu login (API giả mất 2s).
2. Nếu trong lúc đó `dispatch(logout())` → login bị **cancel**.

---

Ta sẽ thiết kế **Mini-Project: Auth Flow với Redux-Saga + TypeScript** như một **checkpoint** trước khi sang RTK Query.


### 🔐 Mini-Project: Auth Flow với Redux-Saga + TypeScript

## 🎯 Yêu cầu

1. Người dùng login bằng username/password.
2. Nếu login thành công → lưu token.
3. Token hết hạn → auto refresh.
4. Nếu user **logout** trong khi đang refresh → huỷ refresh.

👉 Đây là case **real-world enterprise**: cần Saga vì phải quản lý flow & cancel.

---

## 🏗 Cấu trúc

```
src/
 ├─ store/
 │   ├─ authSlice.ts
 │   └─ authSaga.ts
 ├─ api/authApi.ts
 └─ App.tsx
```

---

## 📌 authSlice.ts

```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (state, _action: PayloadAction<{ username: string; password: string }>) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.token = action.payload;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.token = null;
    },
    refreshTokenRequest: (state) => {
      state.loading = true;
    },
    refreshTokenSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.token = action.payload;
    },
    refreshTokenFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  refreshTokenRequest,
  refreshTokenSuccess,
  refreshTokenFailure,
} = authSlice.actions;

export default authSlice.reducer;
```

---

## 📌 api/authApi.ts

```ts
export const authApi = {
  login: async (username: string, password: string) => {
    await new Promise((r) => setTimeout(r, 1000));
    if (username === "admin" && password === "123") {
      return { token: "fake_jwt_token_123" };
    }
    throw new Error("Invalid credentials");
  },

  refreshToken: async () => {
    await new Promise((r) => setTimeout(r, 1000));
    return { token: "refreshed_jwt_token_456" };
  },
};
```

---

## 📌 authSaga.ts

```ts
import { call, put, takeLatest, take, race, delay } from "redux-saga/effects";
import { authApi } from "../api/authApi";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  refreshTokenRequest,
  refreshTokenSuccess,
  refreshTokenFailure,
  logout,
} from "./authSlice";

// Worker Saga: Login
function* loginWorker(action: ReturnType<typeof loginRequest>) {
  try {
    const { username, password } = action.payload;
    const { token } = yield call(authApi.login, username, password);
    yield put(loginSuccess(token));

    // Auto refresh sau 5s (demo ngắn, thực tế 15-30m)
    while (true) {
      yield delay(5000);
      yield put(refreshTokenRequest());
    }
  } catch (e: any) {
    yield put(loginFailure(e.message));
  }
}

// Worker Saga: Refresh
function* refreshWorker() {
  try {
    const { token } = yield call(authApi.refreshToken);
    yield put(refreshTokenSuccess(token));
  } catch (e: any) {
    yield put(refreshTokenFailure(e.message));
  }
}

// Root Saga
function* authSaga() {
  yield takeLatest(loginRequest.type, loginWorker);

  while (true) {
    const { cancel, refresh } = yield race({
      refresh: take(refreshTokenRequest.type),
      cancel: take(logout.type),
    });

    if (refresh) {
      yield call(refreshWorker);
    }

    if (cancel) {
      console.log("Logout detected → cancel refresh flow");
      break;
    }
  }
}

export default authSaga;
```

---

## 📌 App.tsx (demo UI)

```tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { loginRequest, logout } from "./store/authSlice";

function App() {
  const dispatch = useDispatch();
  const { token, loading, error } = useSelector((s: RootState) => s.auth);

  return (
    <div>
      <h1>Auth Flow with Redux-Saga</h1>
      {token ? (
        <>
          <p>✅ Logged in with token: {token}</p>
          <button onClick={() => dispatch(logout())}>Logout</button>
        </>
      ) : (
        <>
          <button onClick={() => dispatch(loginRequest({ username: "admin", password: "123" }))}>
            Login
          </button>
          {loading && <p>⏳ Loading...</p>}
          {error && <p style={{ color: "red" }}>❌ {error}</p>}
        </>
      )}
    </div>
  );
}

export default App;
```

---

## 🎓 Checkpoint

* Bạn vừa xây dựng **Auth flow** với:

  * Saga login → auto refresh.
  * Cancel refresh khi logout.
  * Typed API + Slice.

👉 Đây chính là use case **interview ưa thích về Redux-Saga**.


---
## 🔑 So sánh nhanh

| Pattern           | Dùng khi nào?                                             |
| ----------------- | --------------------------------------------------------- |
| **Retry loop**    | API có thể fail tạm thời (network error, 500).            |
| **Race + Cancel** | Flow có thể bị huỷ (logout, route change, cancel upload). |

---

## 📌 Tổng kết Redux-Saga (Level 5 → 9)

* **Level 5**: Hello Saga (takeEvery).
* **Level 6**: Login Saga (side effects cơ bản).
* **Level 7**: Search Saga (debounce với takeLatest).
* **Level 8**: Retry logic khi API fail.
* **Level 9**: Cancel flow khi logout.

---

### 🎤 Mini Q\&A — Redux-Saga Interview (TypeScript)

---

### ❓ 1. Redux-Saga là gì? Nó giải quyết vấn đề gì so với `createAsyncThunk`?

✅ Redux-Saga là **middleware dựa trên generator functions** dùng để quản lý side effects (async logic, API call, background task).
So với `createAsyncThunk`, saga mạnh hơn ở:

* Control flow (retry, debounce, cancel, sequence).
* Dễ test (generator → step-by-step).
* Quản lý side effects phức tạp (auth flow, websocket).

---

### ❓ 2. Các effect chính (`call`, `put`, `take`, `all`, `race`) có ý nghĩa gì?

* `call(fn, args)`: gọi hàm async → return value.
* `put(action)`: dispatch action.
* `take(actionType)`: "chờ" một action xảy ra.
* `all([effects])`: chạy song song nhiều saga.
* `race({a, b})`: chạy song song, cái nào xong trước thì huỷ cái kia.

---

### ❓ 3. Sự khác biệt giữa `takeEvery` và `takeLatest`?

* `takeEvery`: chạy tất cả worker mỗi lần action dispatch.
* `takeLatest`: chỉ giữ worker cuối cùng, huỷ các worker cũ.
  👉 Dùng `takeLatest` cho search/debounce API.

---

### ❓ 4. Làm sao để cancel một saga đang chạy?

* Dùng `race` với action cancel (ví dụ: logout).
* Hoặc yield `cancel(task)` nếu có tham chiếu task.
  👉 Cancel giúp tránh memory leak & race condition.

---

### ❓ 5. Typing trong Redux-Saga với TypeScript có khó không?

* Generator typing hơi verbose, nhưng thường infer được.
* `PayloadAction<T>` từ RTK giúp typing action payload.
* Có thể dùng `ReturnType<typeof fn>` để type `call`.

---

### ❓ 6. Ưu điểm & nhược điểm của Redux-Saga trong enterprise?

**Ưu điểm**:

* Flow control mạnh (retry, debounce, sequence).
* Rất dễ test.
* Quản lý side effects phức tạp (auth, socket, background jobs).

**Nhược điểm**:

* Learning curve cao.
* Code verbose hơn so với RTK Query.
* Không built-in caching (phải tự làm).

---

### ❓ 7. Cho ví dụ khi nào nên chọn Saga thay vì RTK Query?

* Khi app có **business flow phức tạp**:

  * Auth multi-step (OTP, refresh token, logout cancel).
  * Background task (auto-save, retry upload).
  * Websocket hoặc real-time update.
    👉 Nếu app chỉ CRUD API đơn giản → RTK Query hiệu quả hơn.

---

### ❓ 8. Làm thế nào test Saga với Jest?

* Test generator function step-by-step:

```ts
const gen = loginWorker();
expect(gen.next().value).toEqual(call(api.login));
expect(gen.next("token123").value).toEqual(put(loginSuccess("token123")));
```

👉 Vì Saga là generator → dễ unit test từng step.

---

### ❓ 9. Saga có thay thế được `createAsyncThunk` hoàn toàn không?

* Có thể, nhưng không nên.
* `createAsyncThunk`: đơn giản, boilerplate ít → phù hợp dự án nhỏ.
* Saga: mạnh mẽ, nhưng phức tạp hơn.
  👉 Trong enterprise, có thể **dùng cả hai** tuỳ use case.

---

### ❓ 10. So sánh Saga với Thunk và RTK Query trong context enterprise?

| Tool          | Điểm mạnh                               | Điểm yếu                       |
| ------------- | --------------------------------------- | ------------------------------ |
| **Thunk**     | Dễ học, boilerplate ít                  | Hạn chế side effect flow       |
| **Saga**      | Flow control mạnh, testable, enterprise | Verbose, learning curve        |
| **RTK Query** | Data fetching + caching built-in        | Ít linh hoạt với flow đặc biệt |

👉 Tới đây bạn đã nắm vững **Redux-Saga foundation + enterprise patterns**.

---
Tuyệt vời 🚀. Giờ ta sang **Phần 3: RTK Query với TypeScript** – phần này sẽ là **mảnh ghép cuối** trong hệ sinh thái Redux hiện đại.

---

## 📚 RTK Query với TypeScript

## 1️⃣ Tổng quan

**RTK Query** là công cụ mạnh mẽ để **fetch + cache dữ liệu** tích hợp sẵn trong Redux Toolkit.

👉 Giải quyết các vấn đề phổ biến khi làm việc với API:

* Fetch dữ liệu nhiều lần, lặp code.
* State `loading / error / success` phải tự viết reducer.
* Cache, re-fetch, invalidation phức tạp.

---

## 2️⃣ Cách hoạt động

RTK Query tự động sinh hooks từ service (query/mutation) → gọi API như React Query nhưng tích hợp với Redux.

* **Query** → GET data, auto cache.
* **Mutation** → POST/PUT/DELETE data, auto invalidate cache.

---

## 3️⃣ Setup Cơ bản

### 🔹 apiSlice.ts

```ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
  id: number;
  name: string;
}

export const api = createApi({
  reducerPath: "api", // key trong store
  baseQuery: fetchBaseQuery({ baseUrl: "https://jsonplaceholder.typicode.com" }),
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/users",
    }),
    addUser: builder.mutation<User, Partial<User>>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetUsersQuery, useAddUserMutation } = api;
```

---

### 🔹 store.ts

```ts
import { configureStore } from "@reduxjs/toolkit";
import { api } from "./apiSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

### 🔹 App.tsx

```tsx
import React, { useState } from "react";
import { useGetUsersQuery, useAddUserMutation } from "./apiSlice";

function App() {
  const { data, error, isLoading } = useGetUsersQuery();
  const [addUser] = useAddUserMutation();
  const [name, setName] = useState("");

  const handleAddUser = async () => {
    if (name) {
      await addUser({ name }).unwrap();
      setName("");
    }
  };

  if (isLoading) return <p>⏳ Loading...</p>;
  if (error) return <p>❌ Error fetching users</p>;

  return (
    <div>
      <h1>RTK Query Demo</h1>
      <ul>
        {data?.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New user"
      />
      <button onClick={handleAddUser}>Add User</button>
    </div>
  );
}

export default App;
```

---

## 4️⃣ Ưu điểm chính

* 🚀 Tích hợp sẵn Redux → không cần thêm lib (React Query).
* ✅ Auto caching, re-fetching, invalidation.
* 🛠 Hooks tự sinh → ít boilerplate.
* 🎯 Support TypeScript rất tốt (types infer tự động).

---

## 5️⃣ Bài tập

### Level 1 — Cơ bản

* Tạo `getPosts` query → hiển thị danh sách bài viết.

### Level 2 — Trung cấp

* Thêm `addPost` mutation.
* Sau khi thêm → invalidate cache `posts` → UI tự refresh.

### Level 3 — Nâng cao

* Tạo `getPostById` query.
* Nếu user click 1 post → hiển thị detail (có caching).
* Nếu post detail hết hạn (5s) → auto refetch.

### Level 4 — Enterprise

* Dùng `tagTypes` + `providesTags` + `invalidatesTags` để quản lý cache.
* Ví dụ: `getPosts` → `providesTags: ["Posts"]`; `addPost` → `invalidatesTags: ["Posts"]`.
* Thử kết hợp với **auth token** trong `baseQuery`.

---




## 📝 RTK Query – Giải Bài Tập

## 🔹 Level 1 — Cơ bản

**Yêu cầu:** Tạo `getPosts` query → hiển thị danh sách bài viết.

### apiSlice.ts

```ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Post {
  id: number;
  title: string;
  body: string;
}

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://jsonplaceholder.typicode.com" }),
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => "/posts?_limit=5",
    }),
  }),
});

export const { useGetPostsQuery } = postsApi;
```

### PostsList.tsx

```tsx
import React from "react";
import { useGetPostsQuery } from "./apiSlice";

const PostsList = () => {
  const { data: posts, isLoading, error } = useGetPostsQuery();

  if (isLoading) return <p>⏳ Loading...</p>;
  if (error) return <p>❌ Error loading posts</p>;

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts?.map((p) => (
          <li key={p.id}>
            <strong>{p.title}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsList;
```

---

## 🔹 Level 2 — Trung cấp

**Yêu cầu:** Thêm `addPost` mutation. Sau khi thêm → invalidate cache `posts`.

### apiSlice.ts (cập nhật)

```ts
export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://jsonplaceholder.typicode.com" }),
  tagTypes: ["Posts"], // định nghĩa tag
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => "/posts?_limit=5",
      providesTags: ["Posts"], // cung cấp tag cho query
    }),
    addPost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({
        url: "/posts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Posts"], // khi mutation thành công → invalidates cache
    }),
  }),
});

export const { useGetPostsQuery, useAddPostMutation } = postsApi;
```

### PostsList.tsx (cập nhật)

```tsx
import React, { useState } from "react";
import { useGetPostsQuery, useAddPostMutation } from "./apiSlice";

const PostsList = () => {
  const { data: posts, isLoading, error } = useGetPostsQuery();
  const [addPost] = useAddPostMutation();
  const [title, setTitle] = useState("");

  const handleAddPost = async () => {
    if (!title) return;
    try {
      await addPost({ title, body: "New post body" }).unwrap();
      setTitle("");
    } catch (err) {
      console.error("Failed to add post", err);
    }
  };

  if (isLoading) return <p>⏳ Loading...</p>;
  if (error) return <p>❌ Error loading posts</p>;

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts?.map((p) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New post title"
      />
      <button onClick={handleAddPost}>Add Post</button>
    </div>
  );
};

export default PostsList;
```

👉 Khi thêm Post → mutation thành công → `invalidatesTags: ["Posts"]` → cache `getPosts` invalid → RTK Query tự động refetch.

---

## 🔹 Level 3 — Nâng cao

**Yêu cầu:**

* Tạo `getPostById` query.
* Khi click 1 post → hiển thị detail (có caching).
* Cache detail hết hạn (5s) → auto refetch.

### apiSlice.ts (cập nhật)

```ts
export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://jsonplaceholder.typicode.com" }),
  tagTypes: ["Posts"],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => "/posts?_limit=5",
      providesTags: ["Posts"],
    }),
    getPostById: builder.query<Post, number>({
      query: (id) => `/posts/${id}`,
      keepUnusedDataFor: 5, // cache TTL = 5s
    }),
    addPost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({
        url: "/posts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Posts"],
    }),
  }),
});

export const { useGetPostsQuery, useGetPostByIdQuery, useAddPostMutation } =
  postsApi;
```

### PostDetail.tsx

```tsx
import React from "react";
import { useGetPostByIdQuery } from "./apiSlice";

interface Props {
  postId: number;
}

const PostDetail = ({ postId }: Props) => {
  const { data: post, isLoading, error } = useGetPostByIdQuery(postId);

  if (isLoading) return <p>⏳ Loading post...</p>;
  if (error) return <p>❌ Error loading post</p>;

  return (
    <div>
      <h3>{post?.title}</h3>
      <p>{post?.body}</p>
    </div>
  );
};

export default PostDetail;
```

👉 Khi click post → fetch detail. Cache tồn tại 5s, hết hạn → refetch auto.

---

## 🔹 Level 4 — Enterprise

**Yêu cầu:**

* Quản lý cache bằng `tagTypes`, `providesTags`, `invalidatesTags`.
* Thêm Auth Token trong `baseQuery`.

### apiSlice.ts (enterprise-ready)

```ts
export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com",
    prepareHeaders: (headers, { getState }) => {
      // giả sử token lưu trong state.auth.token
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Posts"],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => "/posts?_limit=5",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Posts" as const, id })),
              { type: "Posts", id: "LIST" },
            ]
          : [{ type: "Posts", id: "LIST" }],
    }),
    getPostById: builder.query<Post, number>({
      query: (id) => `/posts/${id}`,
      providesTags: (result, error, id) => [{ type: "Posts", id }],
    }),
    addPost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({
        url: "/posts",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Posts", id: "LIST" }],
    }),
  }),
});
```

👉 Giờ bạn có hệ thống cache **granular**:

* `getPosts` cung cấp tag LIST.
* `getPostById` cung cấp tag từng post.
* `addPost` → invalidate tag LIST → list refetch nhưng detail post cũ vẫn cache.
* Token được inject tự động qua `prepareHeaders`.

---

✅ Với 4 level này bạn đã làm chủ RTK Query:

1. Fetch danh sách.
2. Mutation + cache invalidation.
3. Query detail + TTL caching.
4. Enterprise pattern (tags + auth).

---

## 🌟 Ưu điểm RTK Query

| Truyền thống (Thunk/Saga)              | RTK Query                                  |
| -------------------------------------- | ------------------------------------------ |
| Phải code nhiều: slice, thunk, reducer | Khai báo ngắn gọn, auto hook               |
| Tự quản lý loading/error state         | Auto cung cấp `isLoading`, `error`, `data` |
| Cache thủ công                         | Cache tự động, có TTL                      |
| Khó đồng bộ nhiều query                | Tag-based cache invalidation               |

---


## ⚔️ Redux-Saga vs RTK Query — Trade-offs thực tế

## 1. **Triết lý thiết kế**

* **Redux-Saga** → Xử lý side effects (async logic phức tạp, workflow, orchestration).
* **RTK Query** → Data fetching + caching layer built-in cho Redux.

---

## 2. **Code Complexity (Độ phức tạp code)**

| Tiêu chí    | Redux-Saga                                   | RTK Query                                       |
| ----------- | -------------------------------------------- | ----------------------------------------------- |
| Boilerplate | Cao (actions, sagas, watchers, reducers)     | Thấp (endpoints, hooks auto-gen)                |
| Học curve   | Khá cao (effects, generator function, yield) | Thấp (declarative, hook-based)                  |
| Debugging   | Dễ khó khăn hơn, cần logging tool            | Dễ hơn nhờ hooks `isLoading`, `isError`, `data` |

---

## 3. **Khả năng mở rộng**

| Trường hợp                                                                | Redux-Saga                                       | RTK Query                                         |
| ------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------- |
| Orchestration nhiều step (vd: checkout flow, retry, race condition)       | Mạnh (saga pattern: `takeLatest`, `race`, `all`) | Hạn chế (phải viết ngoài, không built-in)         |
| Đa API phức tạp, nhiều side effect (WebSocket, polling, background tasks) | Rất phù hợp                                      | Có polling, nhưng WebSocket integration thủ công  |
| CRUD + caching list/data                                                  | Nặng tay, phải tự viết logic cache               | Rất mạnh (cache, tag-based invalidation built-in) |

---

## 4. **Performance & DX (Dev Experience)**

| Tiêu chí            | Redux-Saga                          | RTK Query                                    |
| ------------------- | ----------------------------------- | -------------------------------------------- |
| Performance         | Tùy thuộc vào dev implement         | Cache-aware, tối ưu sẵn                      |
| DX (Dev Experience) | Yêu cầu senior, dễ bug nếu kém test | DX tốt, dev junior-mid dùng được ngay        |
| Testability         | Dễ unit test nhờ generator          | Hook testing khó hơn nhưng ít code phải test |

---

## 5. **Use cases thực tế**

* ✅ **Khi dùng Redux-Saga**

  * Multi-step flows (checkout, signup wizard, payment retry).
  * Background jobs, long-polling, WebSocket, push notifications.
  * Complex async orchestration (vd: wait until multiple APIs succeed).

* ✅ **Khi dùng RTK Query**

  * CRUD APIs, list/detail screen, caching server state.
  * Tự động refresh khi thêm/sửa/xóa.
  * Dự án frontend thiên về fetch data từ REST/GraphQL.

---

## 6. **Kết hợp cả 2**

Trong enterprise project:

* **RTK Query** → dùng cho phần lớn API CRUD, caching.
* **Redux-Saga** → dùng cho workflow đặc biệt phức tạp (payment flow, WebSocket).
  👉 Không loại trừ lẫn nhau, có thể **dùng song song**.

---

## 🔑 Kết luận

* Nếu dự án **đa số là fetch API CRUD** → chọn **RTK Query** (ngắn gọn, ít bug, auto cache).
* Nếu dự án có **side effect phức tạp, real-time, orchestration nhiều bước** → dùng **Redux-Saga**.
* Enterprise thường **mix cả 2**:

  * RTKQ quản lý **server cache**.
  * Saga quản lý **business workflows**.

---



### 🎯 Q\&A Interview – Redux-Saga vs RTK Query

---

### ❓ Q1: Khi nào bạn chọn Redux-Saga thay vì RTK Query?

**🇺🇸 Answer:**
I would choose Redux-Saga when the project requires **complex async workflows**, such as orchestrating multiple API calls, handling race conditions, retry logic, or managing real-time features like WebSocket, push notifications, or background tasks. RTK Query is not designed for these scenarios.

**🇻🇳 Trả lời:**
Tôi sẽ chọn Redux-Saga khi dự án có **luồng bất đồng bộ phức tạp**, như điều phối nhiều API, xử lý race condition, retry logic, hoặc quản lý real-time (WebSocket, push notification, background job). RTK Query không sinh ra để xử lý những tình huống này.

---

### ❓ Q2: Khi nào bạn chọn RTK Query thay vì Redux-Saga?

**🇺🇸 Answer:**
I would use RTK Query when the project mainly deals with **CRUD operations and data fetching**. It automatically manages caching, re-fetching, and loading/error states, which reduces boilerplate and improves developer experience.

**🇻🇳 Trả lời:**
Tôi sẽ dùng RTK Query khi dự án chủ yếu liên quan đến **CRUD và fetch dữ liệu**. RTKQ tự động quản lý cache, refetch, state loading/error, giúp giảm code dư thừa và tăng trải nghiệm lập trình.

---

### ❓ Q3: So sánh testability giữa Saga và RTK Query?

**🇺🇸 Answer:**
Redux-Saga is very testable because sagas are generator functions. We can easily step through yields and assert effects. RTK Query reduces the need for testing boilerplate, but testing hooks and cache behavior is more complex.

**🇻🇳 Trả lời:**
Redux-Saga dễ test vì sagas là generator, có thể kiểm soát từng yield và assert effect. RTK Query thì ít phải test boilerplate hơn, nhưng test hooks và cache behavior lại phức tạp hơn.

---

### ❓ Q4: Về performance, Saga và RTK Query khác nhau thế nào?

**🇺🇸 Answer:**
Saga performance depends on developer implementation since you manage state and side effects manually. RTK Query has built-in caching and deduplication, making it generally more performant for data fetching scenarios.

**🇻🇳 Trả lời:**
Hiệu năng Saga phụ thuộc vào cách dev implement, vì phải tự quản lý state và side effect. RTK Query có cache + deduplication built-in, nên thường tối ưu hơn trong các case fetch dữ liệu.

---

### ❓ Q5: Có thể kết hợp Redux-Saga và RTK Query trong cùng một dự án không?

**🇺🇸 Answer:**
Yes. RTK Query can handle server-side state (CRUD, caching), while Redux-Saga handles business workflows, background tasks, or WebSocket events. This hybrid approach is common in enterprise applications.

**🇻🇳 Trả lời:**
Có. RTK Query dùng để quản lý server state (CRUD, cache), còn Redux-Saga dùng cho business workflow, background job, hoặc WebSocket. Cách mix này khá phổ biến trong enterprise.

---

### ❓ Q6 (Bonus): Nếu team junior-mid, bạn khuyên dùng cái nào?

**🇺🇸 Answer:**
I would recommend **RTK Query** because of its simplicity and reduced boilerplate. Saga requires a steeper learning curve and may lead to bugs if not well tested.

**🇻🇳 Trả lời:**
Tôi sẽ khuyên dùng **RTK Query** vì đơn giản, ít boilerplate. Saga thì học khó hơn và dễ bug nếu không test kỹ.

---
 **Phần 4 – Advanced Integration Patterns (Saga + RTK Query + Toolkit)**, tức là cách **dùng chung** trong enterprise project. Đây là nơi nhiều công ty lớn đang áp dụng.

---

### 🏢  Part 4: Advanced Integration (Saga + RTK Query + Toolkit)

## 🔎 Tại sao cần kết hợp?

* **RTK Query**: quản lý server state (fetch, cache, sync) → rất mạnh cho CRUD.
* **Redux-Saga**: quản lý business workflow (auth, socket, background jobs, retry, debounce).
* **Redux Toolkit core slices**: quản lý UI state (dark mode, modal, filter, form input, local flags).

👉 Trong enterprise, gần như không thể chỉ dùng **một giải pháp** duy nhất. Thường sẽ mix:

* RTK Query cho **server-driven data**.
* Saga cho **event-driven logic**.
* Slice cho **UI state**.

---

## ⚡ Ví dụ Integration

### 1. Auth Flow với Saga + RTKQ

* Saga xử lý **login** (call API, lưu token, refresh token loop).
* RTK Query sử dụng `baseQuery` inject token → fetch data.

```ts
// authSaga.ts
import { takeLatest, call, put, delay } from "redux-saga/effects";
import { loginSuccess, loginFailure } from "../features/authSlice";
import { apiLogin } from "../services/api";

function* loginWorker(action: { type: string; payload: { username: string; password: string } }) {
  try {
    const token: string = yield call(apiLogin, action.payload);
    yield put(loginSuccess(token));
    // Optionally: start refresh token loop
  } catch (err) {
    yield put(loginFailure());
  }
}

export function* authSaga() {
  yield takeLatest("auth/loginRequest", loginWorker);
}
```

```ts
// rtkQueryBase.ts
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: "https://api.example.com",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});
```

---

### 2. Real-time Data (WebSocket) với Saga + RTKQ

* Saga listen socket → dispatch action update store.
* RTKQ fetch initial list, nhưng update theo real-time bằng Saga.

```ts
// socketSaga.ts
import { eventChannel } from "redux-saga";
import { put, take, call } from "redux-saga/effects";
import { messageReceived } from "../features/chatSlice";

function createSocketChannel(socket: WebSocket) {
  return eventChannel((emit) => {
    socket.onmessage = (e) => emit(messageReceived(JSON.parse(e.data)));
    return () => socket.close();
  });
}

export function* chatSaga() {
  const socket = new WebSocket("wss://example.com/chat");
  const channel = yield call(createSocketChannel, socket);

  while (true) {
    const msg = yield take(channel);
    yield put(msg);
  }
}
```

→ RTK Query `getMessages` fetch initial messages, còn Saga push thêm message mới từ socket.

---

### 3. Enterprise Data Cache Strategy

* RTK Query: dùng `tagTypes` → invalidate cache khi cần.
* Saga: trigger invalidate bằng `dispatch(api.util.invalidateTags(...))`.

```ts
// postsSaga.ts
import { put, takeEvery } from "redux-saga/effects";
import { postsApi } from "../services/postsApi";

function* onNewPostAdded() {
  yield put(postsApi.util.invalidateTags(["Posts"]));
}

export function* postsSaga() {
  yield takeEvery("post/addSuccess", onNewPostAdded);
}
```

👉 Như vậy: Saga xử lý flow add post (e.g. track analytics, log), nhưng RTKQ đảm nhận cache update.

---

## 📊 Trade-offs trong Enterprise

| Use Case                         | Nên dùng Saga  | Nên dùng RTKQ |
| -------------------------------- | -------------- | ------------- |
| Auth + Refresh token loop        | ✅              | ❌             |
| CRUD-heavy API (CMS, E-commerce) | ❌              | ✅             |
| Background task, retry, debounce | ✅              | ❌             |
| WebSocket + real-time events     | ✅              | ❌             |
| Cache invalidation, auto-refetch | ❌              | ✅             |
| UI orchestration (modal, theme)  | ✅ (hoặc slice) | ❌             |

---

## 📝 Enterprise Checklist

1. **State phân 3 loại rõ ràng**:

   * UI state → Slice
   * Server state → RTKQ
   * Workflow state → Saga

2. **Auth chuẩn**:

   * Saga quản lý login + refresh
   * RTKQ fetch data có token

3. **Cache chiến lược**:

   * Luôn define `tagTypes`
   * Invalidate ở mutation hoặc Saga

4. **Test coverage**:

   * Saga → unit test dễ (generator)
   * RTKQ → integration test (React Testing Library)

---

👉 Đây là **Full Integration Enterprise Pattern**.


---
### 🎯 Q\&A Interview – Integration Saga + RTK Query + Toolkit

---

### ❓ Q1: Tại sao không chỉ dùng RTK Query, mà vẫn cần Saga?

**🇺🇸 Answer:**
RTK Query is excellent for CRUD and caching, but it doesn’t handle complex workflows like authentication with refresh tokens, WebSocket events, debouncing, retries, or background jobs. Saga provides full control over side effects, which complements RTK Query.

**🇻🇳 Trả lời:**
RTK Query rất mạnh cho CRUD + caching, nhưng không xử lý được workflow phức tạp như auth với refresh token, WebSocket, debounce, retry, hoặc background job. Saga cho phép kiểm soát side effect chi tiết, nên bổ sung tốt cho RTKQ.

---

### ❓ Q2: Bạn chia state trong enterprise project như thế nào giữa Slice, Saga, và RTK Query?

**🇺🇸 Answer:**

* **UI/local state** → Redux slice (e.g., theme, modal, filters).
* **Server state** → RTK Query (fetching, caching, invalidation).
* **Workflow state** → Saga (auth flows, socket events, orchestration).

**🇻🇳 Trả lời:**

* **UI/local state** → slice (theme, modal, filter).
* **Server state** → RTK Query (fetch, cache, invalidate).
* **Workflow state** → Saga (auth, socket, orchestration).

---

### ❓ Q3: Làm thế nào để kết hợp Saga và RTK Query trong Auth flow?

**🇺🇸 Answer:**
Saga manages login, logout, and token refresh. Once the token is stored in Redux, RTK Query uses a `baseQuery` with `prepareHeaders` to inject the token automatically for API requests.

**🇻🇳 Trả lời:**
Saga xử lý login/logout và refresh token. Sau khi token lưu trong Redux, RTK Query dùng `baseQuery` với `prepareHeaders` để tự động inject token cho API.

---

### ❓ Q4: Bạn dùng Saga để trigger cache invalidation của RTK Query như thế nào?

**🇺🇸 Answer:**
By dispatching `api.util.invalidateTags(["TagName"])` inside a saga. For example, after a background job or WebSocket event, Saga can invalidate RTK Query cache to force a refetch.

**🇻🇳 Trả lời:**
Dùng `dispatch(api.util.invalidateTags(["TagName"]))` trong saga. Ví dụ: sau background job hoặc sự kiện từ WebSocket, Saga có thể invalidate cache của RTK Query để refetch.

---

### ❓ Q5: Khi nào bạn test Saga và khi nào test RTK Query?

**🇺🇸 Answer:**

* Saga: unit test workflows because sagas are generators, very testable.
* RTK Query: integration test with React Testing Library, focusing on components and caching behavior.

**🇻🇳 Trả lời:**

* Saga: unit test workflow vì generator dễ kiểm soát từng bước.
* RTK Query: integration test (React Testing Library) → tập trung vào component + cache behavior.

---

### ❓ Q6: Nếu app có WebSocket chat, bạn dùng RTK Query hay Saga?

**🇺🇸 Answer:**
I’d use Saga for real-time socket messages because RTK Query doesn’t handle streaming. However, RTK Query can fetch the initial chat history, and Saga keeps updating the store with new messages.

**🇻🇳 Trả lời:**
Tôi sẽ dùng Saga cho socket real-time, vì RTKQ không hỗ trợ streaming. Nhưng RTKQ fetch được chat history ban đầu, còn Saga update thêm message mới vào store.

---

### ❓ Q7: Có thể thay thế Saga bằng RTK Query trong mọi trường hợp không?

**🇺🇸 Answer:**
No. RTK Query is not a replacement for Saga. It’s optimized for server state, but cannot handle complex orchestration or background workflows. Saga and RTK Query solve different problems.

**🇻🇳 Trả lời:**
Không. RTKQ không thay thế Saga. RTKQ tối ưu cho server state, nhưng không xử lý orchestration hay background workflow. Saga và RTKQ giải quyết 2 vấn đề khác nhau.

---

👉 Đây là bộ Q\&A dành riêng cho **Integration Enterprise Patterns**.

---

## ⚡ Coding Challenge — Integration Mini Project với Redux Toolkit + Async Thunk

## 🎯 Yêu cầu

Xây dựng một ứng dụng mini quản lý **bài viết (posts)** với các tính năng sau:

1. **Đăng nhập (Auth flow)**

   * API giả: `POST /login` → trả về `{ token: string }`.
   * Lưu token vào Redux state.
   * Mỗi request API khác phải kèm `Authorization: Bearer <token>`.

2. **Lấy danh sách posts (Fetch data)**

   * API giả: `GET /posts` → trả về danh sách bài viết.
   * Hiển thị trên UI.
   * Có trạng thái loading + error.

3. **Thêm post mới (Mutation + Cache Invalidate)**

   * API giả: `POST /posts` với `{ title, content }`.
   * Sau khi thêm → tự động gọi lại `fetchPosts` để refresh list.

4. **Socket update (Realtime)**

   * Giả lập 1 socket (setInterval 5s) → server “push” thêm post mới.
   * Redux nhận event qua `extraReducer` hoặc middleware custom → UI update ngay.

5. **Logout**

   * Xóa token, reset toàn bộ state về mặc định.

---

## 🛠️ Gợi ý kiến trúc

* **Slices**:

  * `authSlice`: login/logout, lưu token.
  * `postsSlice`: fetchPosts, addPost, socketPush.
* **Thunk**:

  * `loginUser`
  * `fetchPosts`
  * `addPost`
* **Middleware**:

  * `socketMiddleware`: connect tới socket, dispatch action `postReceived`.

---

## 🔑 Điểm cần luyện (Interview style)

* Quản lý **async logic** bằng `createAsyncThunk`.
* Truyền **token động** vào `fetch` từ state (`getState`).
* Dùng **middleware custom** để xử lý side-effect ngoài async thunk (socket).
* **Invalidate cache** (ở RTK Core thì ta gọi lại `fetchPosts` sau khi `addPost.fulfilled`).
* Quản lý **reset state khi logout**.

---

## 🚀 Đề cho bạn code

👉 Hãy implement project mini sau với Redux Toolkit + Async Thunk:

1. Tạo `authSlice` với `loginUser` thunk (fake API: delay 1s → trả token `"fake-token-123"`).
2. Tạo `postsSlice` với:

   * `fetchPosts` (fake API: trả list mock posts).
   * `addPost` (POST API giả). Sau khi success → gọi lại `fetchPosts`.
   * Reducer `postReceived` (nhận post mới từ socket).
3. Tạo `socketMiddleware` → mỗi 5s dispatch 1 `postReceived` với random post.
4. Component flow:

   * Nếu chưa login → show form login.
   * Sau khi login → show list posts + form thêm post.
   * Khi socket gửi post → UI auto update.
   * Logout → clear state.

---

📌 Đây là **đề full** như kiểu phỏng vấn thực chiến.
Lời giải full code mẫu cho **Mini Project: Auth + Posts + Socket với Redux Toolkit + Async Thunk**.
Code viết bằng **TypeScript + React + Redux Toolkit**, có đầy đủ **auth, fetch, add, socket, logout**.

---

# 🟩 1. Setup Store + Middleware

```tsx
// store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import postsReducer from "./postsSlice";
import { socketMiddleware } from "./socketMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
  },
  middleware: (getDefault) => getDefault().concat(socketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

# 🟩 2. Auth Slice

```tsx
// authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
};

// fake API login
export const loginUser = createAsyncThunk<
  string, // return type
  { username: string; password: string } // args type
>("auth/loginUser", async (credentials) => {
  await new Promise((res) => setTimeout(res, 1000)); // simulate delay
  if (credentials.username === "admin" && credentials.password === "123") {
    return "fake-token-123";
  }
  throw new Error("Invalid credentials");
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
```

---

# 🟩 3. Posts Slice

```tsx
// postsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface Post {
  id: number;
  title: string;
  content: string;
}

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
};

// fake API fetch
export const fetchPosts = createAsyncThunk<Post[], void, { state: RootState }>(
  "posts/fetchPosts",
  async (_, { getState }) => {
    const token = getState().auth.token;
    if (!token) throw new Error("Not authorized");

    await new Promise((res) => setTimeout(res, 800)); // simulate delay
    return [
      { id: 1, title: "Hello World", content: "This is the first post" },
      { id: 2, title: "Redux Toolkit", content: "State management made easy" },
    ];
  }
);

// fake API add
export const addPost = createAsyncThunk<
  Post,
  { title: string; content: string },
  { state: RootState }
>("posts/addPost", async (newPost, { getState }) => {
  const token = getState().auth.token;
  if (!token) throw new Error("Not authorized");

  await new Promise((res) => setTimeout(res, 500)); // simulate delay
  return { id: Date.now(), ...newPost };
});

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postReceived: (state, action: PayloadAction<Post>) => {
      state.posts.push(action.payload);
    },
    resetPosts: (state) => {
      state.posts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load posts";
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.posts.push(action.payload); // add directly
      });
  },
});

export const { postReceived, resetPosts } = postsSlice.actions;
export default postsSlice.reducer;
```

---

# 🟩 4. Socket Middleware

```tsx
// socketMiddleware.ts
import { Middleware } from "@reduxjs/toolkit";
import { postReceived } from "./postsSlice";

let interval: NodeJS.Timeout;

export const socketMiddleware: Middleware = (store) => (next) => (action) => {
  if (action.type === "auth/loginUser/fulfilled") {
    // start fake socket after login
    interval = setInterval(() => {
      store.dispatch(
        postReceived({
          id: Date.now(),
          title: "Realtime Post",
          content: "New post received from socket",
        })
      );
    }, 5000);
  }

  if (action.type === "auth/logout") {
    clearInterval(interval);
  }

  return next(action);
};
```

---

# 🟩 5. Components

```tsx
// App.tsx
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./store";
import { loginUser, logout } from "./authSlice";
import { fetchPosts, addPost } from "./postsSlice";
import { useState } from "react";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const posts = useSelector((state: RootState) => state.posts);

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("123");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  if (!auth.token) {
    return (
      <div>
        <h2>Login</h2>
        {auth.error && <p style={{ color: "red" }}>{auth.error}</p>}
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <button onClick={() => dispatch(loginUser({ username, password }))}>
          {auth.loading ? "Logging in..." : "Login"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Posts</h2>
      <button onClick={() => dispatch(fetchPosts())}>Load Posts</button>
      <button onClick={() => dispatch(logout())}>Logout</button>

      {posts.loading && <p>Loading...</p>}
      {posts.error && <p style={{ color: "red" }}>{posts.error}</p>}

      <ul>
        {posts.posts.map((p) => (
          <li key={p.id}>
            <b>{p.title}</b>: {p.content}
          </li>
        ))}
      </ul>

      <h3>Add Post</h3>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={() => {
          dispatch(addPost({ title, content }));
          setTitle("");
          setContent("");
        }}
      >
        Add Post
      </button>
    </div>
  );
}
```

---

# ✅ Kết quả mong đợi

1. Login thành công với `admin/123`.
2. Bấm **Load Posts** → fetch danh sách bài viết.
3. Thêm post mới → UI tự refresh (push thêm).
4. Cứ mỗi 5s sẽ có 1 post mới từ “socket”.
5. Logout → clear token + reset state + stop socket.

---

Tổng hợp lại để đánh giá mức độ "deep dive senior" của nội dung Redux Toolkit + Redux-Saga + RTK Query mà mình và anh vừa đi qua nhé:

---

## ✅ Những gì đã cover (mức senior-ready)

### 1. **Redux Toolkit Core + Async Thunk**

* Hiểu rõ `configureStore`, `createSlice`, `createAsyncThunk`.
* Xây dựng **flow bất đồng bộ** với loading/error state.
* Làm bài tập từ cơ bản (counter, todo) → trung cấp (fetch API, CRUD) → nâng cao (pagination, cache tạm) → enterprise (multi-slice, cross-slice action).
* Q\&A + Coding Challenge: check kỹ năng giải thích trade-offs, performance, enterprise scaling.

### 2. **Redux-Saga với TypeScript**

* Giải thích khái niệm Saga (effect, watcher, worker, middleware).
* Thực hành `takeEvery`, `takeLatest`, `call`, `put`, `all`.
* Làm mini-project (auth, fetch data, retry, cancel).
* Q\&A interview để test hiểu về Saga vs Thunk.
* So sánh **trade-offs** (Saga phù hợp business logic phức tạp, orchestration).

### 3. **RTK Query với TypeScript**

* Tạo API slice với `createApi`, `fetchBaseQuery`.
* Query cơ bản (`getPosts`), Mutation (`addPost`).
* Cache invalidation (`providesTags`, `invalidatesTags`).
* Auto-refetch khi data hết hạn (5s TTL).
* Enterprise use case: tích hợp auth token vào `baseQuery`, kết hợp tagTypes.
* So sánh thực tế **RTK Query vs Saga** (state-driven caching vs side-effect orchestration).

### 4. **Coding Challenge: Integration Mini Project**

* Auth + Fetch Data + Cache + Socket update.
* Giải luôn full code mẫu (slice, saga, RTK Query integration).
* Giống interview thực chiến (khiến dev phải phối hợp nhiều công nghệ cùng lúc).

---

## 🔍 Độ sâu đã đạt

* **Foundation → Advanced**: Đã đủ để 1 mid-level có thể scale lên senior.
* **Senior-level**: Có trade-offs, coding challenge, enterprise patterns (cache invalidate, token inject, socket).
* **Interview-ready**: Đủ Q\&A + coding test để qua vòng technical phỏng vấn senior front-end.

---

## 🚀 Còn có thể đào sâu thêm (nếu muốn full "expert")

1. **Performance Optimization**

   * Memoization selectors (Reselect).
   * Normalization dữ liệu (normalizr).
   * Lazy loading slice (code splitting).

2. **Testing**

   * Unit test cho reducers, thunks.
   * Test Saga (mock API + effect test).
   * Integration test RTK Query.

3. **Enterprise Patterns**

   * Multi-tenant store (nhiều user login cùng lúc).
   * Dynamic module loading (micro-frontend).
   * Error boundary + retry strategy cho Saga + RTK Query.

---

👉 Tóm lại: **Nội dung hiện tại đã đủ để gọi là deep dive senior cho Redux Toolkit + Saga + RTKQ**.
Nếu muốn lên **expert** (dùng trong hệ thống enterprise cực lớn), mình nên đào thêm về **performance, testing, enterprise patterns**.

---


📌 [<< Ngày 26](./Day26.md) | [Ngày 28 >>](./Day28.md)