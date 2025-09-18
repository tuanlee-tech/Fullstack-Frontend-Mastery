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

### 1. Store + Slice

**Vì sao Redux Toolkit?**

**Redux truyền thống** thường bị:

* Quá nhiều boilerplate (actions, constants, reducers).
* Dễ sai type khi viết action/reducer thủ công.
* Async flow phức tạp (Redux Thunk, Saga).

👉 **RTK** giải quyết bằng:

* `configureStore()` thay cho `createStore`.
* `createSlice()` auto-generate action + reducer.
* `createAsyncThunk()` quản lý async logic.
* Tích hợp tốt với TypeScript.

---

**Cấu hình Store với TypeScript**

```ts
// ./store.ts
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

// Type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

👉 Giữ type `RootState` và `AppDispatch` để dùng trong toàn bộ project.

---
**Tạo Slice với TypeScript**

```ts
// ./features/counterSlice.ts
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
    // Action chỉ dùng để kích hoạt saga (tác vụ bất đồng bộ)
    incrementAsync: (state) => {
      // Logic này không làm gì cả, chỉ là một "signal" để saga lắng nghe
    },
  },
});

export const { increment, decrement, incrementByAmount, incrementAsync } = counterSlice.actions;
export default counterSlice.reducer;
```

---

**Async Actions với `createAsyncThunk`**

```ts
// ./features/todosSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodosState {
  items: Todo[];
  loading: boolean;
}

const initialState: TodosState = {
  items: [],
  loading: false,
};

export const fetchTodos = createAsyncThunk<Todo[]>(
  "todos/fetchTodos",
  async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
    return (await res.json()) as Todo[];
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchTodos.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const selectTodos = (state: RootState) => state.todos.items;
export default todosSlice.reducer;
```

---

**Dùng trong React Component**

```tsx
// ./App.tsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./store";
import { increment } from "./features/counterSlice";
import { fetchTodos, selectTodos } from "./features/todosSlice";

export default function App() {
  const count = useSelector((state: RootState) => state.counter.value);
  const todos = useSelector(selectTodos);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => dispatch(increment())}>+1</button>

      <h2>Todos</h2>
      <ul>
        {todos.map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </div>
  );
}
```


---

### 2. Redux-Saga với TypeScript

👉 Cần middleware:

```bash
npm install redux-saga
```

#### a. Setup Saga Middleware

```ts
// store.ts
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import counterReducer from "./features/counterSlice";
import rootSaga from "./sagas";

// Tạo Saga Middleware
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
  // Thêm saga middleware vào store
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // Tùy chọn: Tắt thunk middleware nếu không dùng
    }).concat(sagaMiddleware),
  /*
  Hoặc dùng : middleware: (getDefault) => getDefault().concat(sagaMiddleware),
  */
});

// Chạy root saga để bắt đầu lắng nghe các actions
sagaMiddleware.run(rootSaga);

// Định nghĩa types cho RootState và AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### b. Tạo Saga

```ts
// sagas/counterSaga.ts
import { takeEvery, put, delay } from "redux-saga/effects";
import { incrementByAmount } from "../features/counterSlice";

// Worker Saga: Xử lý logic khi action 'incrementAsync' được dispatch
function* handleIncrementAsync() {
  try {
    // Giả lập một tác vụ bất đồng bộ, ví dụ: gọi API
    yield delay(1000); // Chờ 1 giây

    // Dispatch một action khác tới reducer để cập nhật state
    yield put(incrementByAmount(5));
  } catch (error) {
    console.log("Error in increment async saga:", error);
  }
}

// Watcher Saga: Lắng nghe các action cụ thể
export default function* counterSaga() {
  // Lắng nghe mọi action 'counter/incrementAsync'
  yield takeEvery("counter/incrementAsync", handleIncrementAsync);
}
```

#### c. Root Saga

```ts
// sagas/index.ts
import { all } from "redux-saga/effects";
import counterSaga from "./counterSaga";

// Gom tất cả các saga lại để chạy đồng thời
export default function* rootSaga() {
  yield all([
    counterSaga(),
    // Nếu có saga khác, bạn sẽ thêm vào đây:
    // otherSaga(),
  ]);
}
```

👉 Component dispatch:

```ts
dispatch({ type: "counter/incrementAsync" });
```
#### d. Dùng trong React Component

* File `components/Counter.tsx`
  ```ts
  import React from 'react';
  import { useSelector, useDispatch } from 'react-redux';
  import { RootState } from '../store';
  import { increment, incrementAsync } from '../features/counterSlice';

  const Counter = () => {
    // Lấy giá trị 'counter' từ Redux state
    const count = useSelector((state: RootState) => state.counter.value);
    const dispatch = useDispatch();

    return (
      <div>
        <h2>Saga Counter Example</h2>
        <p>Current value: {count}</p>
        
        {/* Nút dispatch action đồng bộ */}
        <button onClick={() => dispatch(increment())}>
          Tăng (+1)
        </button>

        {/* Nút dispatch action bất đồng bộ */}
        <button onClick={() => dispatch(incrementAsync())}>
          Tăng (+5) sau 1 giây
        </button>
        
        <p>
          Nhấn nút "Tăng (+5) sau 1 giây" để kích hoạt saga. Bạn sẽ thấy giá trị 
          của counter tăng lên 5 sau một khoảng trễ.
        </p>
      </div>
    );
  };

  export default Counter;
  ```
---

### 3. RTK Query

👉 Tích hợp vào RTK, cực mạnh cho API.

```ts
// services/todosApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Định nghĩa kiểu dữ liệu (interface) cho đối tượng Todo trả về từ API
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// Khởi tạo một service API bằng createApi
export const todosApi = createApi({
  reducerPath: "todosApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://jsonplaceholder.typicode.com/" }),

  // 'tagTypes' giúp RTK Query quản lý việc cache và tự động cập nhật dữ liệu.
  // Mỗi loại dữ liệu (ví dụ: 'Todo') sẽ có một tag riêng.
  tagTypes: ["Todo"],

  endpoints: (builder) => ({
    // 1. READ: Lấy danh sách todos
    // endpoint này sử dụng `query` để lấy dữ liệu.
    getTodos: builder.query<Todo[], void>({
      query: () => "todos?_limit=5",
      // 'providesTags' cho biết endpoint này cung cấp dữ liệu
      // liên quan đến tag 'Todo'. Điều này giúp các mutation biết
      // cần phải làm mới (re-fetch) dữ liệu nào sau khi thay đổi.
      providesTags: ["Todo"],
    }),

    // 2. CREATE: Thêm một todo mới
    // endpoint này sử dụng `mutation` để gửi yêu cầu POST.
    addTodo: builder.mutation<Todo, Partial<Todo>>({
      // `Partial<Todo>` cho phép gửi một phần của đối tượng Todo.
      query: (newTodo) => ({
        url: "todos", // Endpoint để thêm mới
        method: "POST", // Phương thức HTTP
        body: newTodo, // Dữ liệu gửi đi
      }),
      // 'invalidatesTags' báo hiệu rằng sau khi mutation này thành công,
      // tất cả các endpoint có tag 'Todo' đều không hợp lệ
      // và cần được re-fetch để lấy dữ liệu mới nhất.
      invalidatesTags: ["Todo"],
    }),

    // 3. UPDATE: Cập nhật một todo
    // endpoint này sử dụng `mutation` để gửi yêu cầu PUT.
    updateTodo: builder.mutation<Todo, Todo>({
      // `Todo` là kiểu dữ liệu: cần cả ID để xác định bản ghi cần cập nhật.
      query: (updatedTodo) => ({
        url: `todos/${updatedTodo.id}`, // Endpoint có ID
        method: "PUT",
        body: updatedTodo,
      }),
      invalidatesTags: ["Todo"],
    }),

    // 4. DELETE: Xóa một todo
    // endpoint này sử dụng `mutation` để gửi yêu cầu DELETE.
    deleteTodo: builder.mutation<void, number>({
      // `number` là kiểu dữ liệu: cần ID của todo để xóa.
      query: (id) => ({
        url: `todos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Todo"],
    }),
  }),
});

// RTK Query tự động tạo hooks cho cả query và mutation.
// query: `use` + `Tên endpoint` + `Query`
// mutation: `use` + `Tên endpoint` + `Mutation`
export const { useGetTodosQuery, useAddTodoMutation, useUpdateTodoMutation, useDeleteTodoMutation } = todosApi;
```

👉 Add vào store:

```ts
import { configureStore } from "@reduxjs/toolkit";
import { todosApi } from "./services/todosApi";

export const store = configureStore({
  reducer: {
    // Thêm reducer của RTK Query vào store.
    // 'reducerPath' mà bạn đã định nghĩa ở trên sẽ trở thành key của slice này.
    [todosApi.reducerPath]: todosApi.reducer,
  },
  middleware: (getDefault) =>
    // Thêm middleware của RTK Query. Điều này là bắt buộc
    // để nó có thể xử lý việc caching, re-fetching, và các tác vụ khác.
    getDefault().concat(todosApi.middleware),
});
```

👉 Dùng trong Component:

```tsx
// Lấy hook được tạo tự động từ RTK Query.
import React from 'react';
import { useGetTodosQuery, useAddTodoMutation, useUpdateTodoMutation, useDeleteTodoMutation, Todo } from '../services/todosApi';

const TodosComponent = () => {
  // Lấy dữ liệu và trạng thái loading từ query hook
  const { data: todos, isLoading } = useGetTodosQuery();
  
  // Lấy các hàm mutation và trạng thái của chúng
  const [addTodo] = useAddTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const handleAddTodo = () => {
    // Gọi hàm addTodo với dữ liệu của todo mới.
    addTodo({ id: 101, title: 'Learn RTK Query', completed: false });
  };

  const handleUpdateTodo = (todo: Todo) => {
    // Gọi hàm updateTodo với dữ liệu đã cập nhật.
    updateTodo({ ...todo, completed: !todo.completed });
  };

  const handleDeleteTodo = (id: number) => {
    // Gọi hàm deleteTodo với id của todo cần xóa.
    deleteTodo(id);
  };

  if (isLoading) {
    return <p>Đang tải...</p>;
  }

  return (
    <div>
      <h2>Danh sách Todos (RTK Query)</h2>
      <button onClick={handleAddTodo}>Thêm Todo Mới</button>
      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleUpdateTodo(todo)}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.title}
            </span>
            <button onClick={() => handleDeleteTodo(todo.id)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodosComponent;
```


### **1. Tại sao `useGetTodosQuery` trả về một đối tượng?**

```js
const { data: todos, isLoading } = useGetTodosQuery();
```

`useGetTodosQuery` là một **query hook** (để đọc dữ liệu). Nhiệm vụ chính của nó là **fetch và quản lý trạng thái của dữ liệu**, vì vậy nó trả về một đối tượng chứa nhiều thông tin hữu ích về trạng thái của yêu cầu:

  * **`data`**: Chứa dữ liệu đã lấy được từ API khi yêu cầu thành công.
  * **`isLoading`**: Một giá trị boolean (`true`/`false`) cho biết yêu cầu đang được gửi và chờ phản hồi.
  * **`isFetching`**: Tương tự như `isLoading`, nhưng có thể vẫn là `true` ngay cả khi dữ liệu đã có sẵn trong cache (ví dụ khi bạn re-fetch).
  * **`error`**: Chứa đối tượng lỗi nếu yêu cầu thất bại.
  * **`isSuccess`**, **`isError`**: Các trạng thái boolean khác nhau để kiểm tra kết quả của yêu cầu.
  * **`refetch`**: Một hàm để kích hoạt lại việc fetch dữ liệu một cách thủ công.

Việc trả về một đối tượng giúp bạn dễ dàng truy cập tất cả các thông tin này bằng cách sử dụng **destructuring** (giải cấu trúc), làm cho code gọn gàng hơn.

-----

### **2. Tại sao `useAddTodoMutation` và các mutation khác trả về một mảng?**

```js
const [addTodo, { isLoading }] = useAddTodoMutation();
```

Các **mutation hooks** (để thay đổi dữ liệu như POST, PUT, DELETE) trả về một mảng vì hai lý do chính:

1.  **Phân biệt rõ chức năng:** Mảng trả về chứa hai phần tử:

      * Phần tử đầu tiên là **hàm trigger** (`addTodo`, `updateTodo`, `deleteTodo`). Đây là hàm bạn gọi để thực thi yêu cầu mutation. Nó có thể được đổi tên tùy ý.
      * Phần tử thứ hai là một **đối tượng trạng thái** (giống với query hook), chứa các thông tin như `isLoading`, `isSuccess`, `error`, v.v.

2.  **Đảm bảo tính nhất quán và dễ sử dụng:** Với cách trả về này, bạn có thể dễ dàng tách biệt hàm gọi API khỏi trạng thái của nó. Điều này đặc biệt hữu ích khi bạn muốn gọi một mutation, ví dụ: trong một hàm `onClick`, và đồng thời truy cập vào trạng thái của nó để hiển thị UI tương ứng (ví dụ: hiển thị spinner khi đang tải).

### **3. Ý nghĩa của `isLoading`**

`isLoading` là một **trạng thái quan trọng** mà cả query và mutation hooks đều cung cấp. Nó cho biết liệu yêu cầu mạng (network request) đang diễn ra hay không.

  * Khi `isLoading` là **`true`**:
      * Nghĩa là yêu cầu đã được gửi và ứng dụng đang chờ phản hồi từ server.
      * Bạn nên sử dụng trạng thái này để hiển thị các UI phản hồi lại người dùng, chẳng hạn như một spinner hoặc dòng chữ "Đang tải...".
  * Khi `isLoading` là **`false`**:
      * Yêu cầu đã hoàn thành, có thể thành công hoặc thất bại.
      * Bạn có thể hiển thị dữ liệu hoặc thông báo lỗi cho người dùng.

Việc sử dụng `isLoading` giúp tạo ra trải nghiệm người dùng tốt hơn, vì họ sẽ biết rằng ứng dụng đang hoạt động thay vì bị treo. Nó cũng ngăn chặn việc hiển thị dữ liệu lỗi thời hoặc không đầy đủ trong khi chờ phản hồi từ API.
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
`createEntityAdapter` là một công cụ mạnh mẽ từ Redux Toolkit giúp bạn quản lý dữ liệu **được chuẩn hóa (normalized data)** trong Redux store một cách dễ dàng. Dữ liệu được chuẩn hóa nghĩa là thay vì lưu trữ một mảng các đối tượng, bạn sẽ lưu trữ các đối tượng trong một object với `id` làm key.

-----

### **1. Tại sao cần chuẩn hóa dữ liệu?**

Thông thường, bạn nhận dữ liệu từ API dưới dạng một mảng các đối tượng: `[{ id: 1, ... }, { id: 2, ... }]`. Khi bạn muốn cập nhật, xóa, hoặc truy cập một đối tượng cụ thể, bạn phải duyệt qua toàn bộ mảng. Điều này rất kém hiệu quả khi số lượng đối tượng lớn.

Dữ liệu được chuẩn hóa sẽ có dạng:

```js
{
  ids: [1, 2, 3], // Mảng các ID để giữ thứ tự ban đầu
  entities: {
    1: { id: 1, ... },
    2: { id: 2, ... },
    3: { id: 3, ... }
  }
}
```

Với cấu trúc này, bạn có thể truy cập bất kỳ đối tượng nào chỉ bằng `O(1)` (hằng số) thay vì phải duyệt qua mảng `O(n)`.

-----

### **2. Giải thích chi tiết các thành phần**

#### **`createEntityAdapter`**

```ts
const usersAdapter = createEntityAdapter<User>({
  selectId: (user) => user.id, // default là `id`, có thể tuỳ chỉnh
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});
```

  * **`createEntityAdapter<User>`**: Dòng này tạo ra một "adapter" chuyên biệt để quản lý dữ liệu kiểu `User`. Nó cung cấp một bộ các **hàm reducer** và **selectors** được tạo sẵn để xử lý dữ liệu đã được chuẩn hóa.
  * **`selectId`**: Tùy chọn này cho phép bạn chỉ định trường nào của đối tượng sẽ được sử dụng làm `id`. Mặc định, nó sẽ tìm trường có tên `id`. Bạn chỉ cần định nghĩa lại khi tên trường là một cái tên khác (ví dụ: `_id`, `userId`).
  * **`sortComparer`**: Tùy chọn này cho phép bạn sắp xếp mảng `ids` sau khi thêm hoặc cập nhật dữ liệu. Trong ví dụ, `usersAdapter` sẽ tự động sắp xếp danh sách người dùng theo tên (`a.name.localeCompare(b.name)`).

#### **`initialState`**

```ts
const initialState = usersAdapter.getInitialState({
  loading: false,
  error: null as string | null,
});
```

  * **`usersAdapter.getInitialState()`**: Đây là một phương thức được cung cấp bởi `createEntityAdapter` để tạo ra một **state ban đầu** đã được chuẩn hóa.
  * Giá trị trả về sẽ có sẵn hai thuộc tính mặc định là `ids` và `entities`.
  * Bạn có thể truyền thêm các thuộc tính tùy chỉnh vào bên trong hàm này (ví dụ: `loading`, `error`) để quản lý các trạng thái khác của slice.

### **3. Lợi ích khi sử dụng `createEntityAdapter`**

  * **Giảm code lặp lại (boilerplate):** Nó cung cấp sẵn các hàm reducer cho các thao tác phổ biến như thêm (`addOne`, `addMany`), cập nhật (`updateOne`, `updateMany`), xóa (`removeOne`, `removeMany`), v.v., giúp bạn không phải tự viết các logic này.
  * **Hiệu suất cao:** Tối ưu hóa việc truy cập và cập nhật dữ liệu bằng `O(1)`.
  * **Đơn giản hóa:** Quản lý state trở nên gọn gàng hơn, dễ đọc và dễ bảo trì hơn rất nhiều.

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
Dòng code này tạo ra một bộ **selectors** (hàm chọn lọc) giúp bạn truy cập dữ liệu đã được chuẩn hóa trong Redux store một cách hiệu quả. Đây là một trong những tính năng mạnh mẽ nhất của `createEntityAdapter`.

---

### **Giải thích chi tiết**

#### **1. `usersAdapter.getSelectors<RootState>(...)`**

* **`getSelectors`**: Đây là một phương thức của `usersAdapter`. Nó tạo ra một đối tượng chứa nhiều hàm selector tiện ích được tạo sẵn.
* **`<RootState>`**: Dòng này chỉ định kiểu dữ liệu của toàn bộ Redux store (RootState) để TypeScript có thể kiểm tra kiểu an toàn.

#### **2. `(state) => state.users`**

* Đây là một **hàm "selector gốc"**. Nó có nhiệm vụ lấy ra đúng **slice** của state mà bạn muốn làm việc, trong trường hợp này là `state.users`.
* `getSelectors` sử dụng hàm này để biết nơi cần tìm dữ liệu đã được chuẩn hóa (`ids` và `entities`) trong state.

#### **3. Các selectors được tạo ra**

Khi bạn gọi `getSelectors`, nó sẽ trả về một đối tượng chứa các hàm sau:

* **`selectAll`**: Lấy tất cả các entity dưới dạng một **mảng**. Hàm này tự động biến đổi dữ liệu từ object `entities` thành một mảng, duy trì thứ tự ban đầu từ `ids`.
* **`selectIds`**: Lấy ra mảng `ids` (ví dụ: `[1, 2, 3]`).
* **`selectEntities`**: Lấy ra object `entities` (ví dụ: `{ 1: {...}, 2: {...} }`).
* **`selectById`**: Lấy ra một entity cụ thể bằng `id`. (ví dụ: `selectById(state, 2)`).
* **`selectTotal`**: Lấy tổng số lượng entity.

#### **4. Tại sao chúng lại là `(memoized)`?**

* **Memoization** là một kỹ thuật tối ưu hóa. Các selectors này sử dụng thư viện **Reselect** bên dưới để ghi nhớ kết quả. 
* Điều này có nghĩa là, nếu slice `users` không thay đổi, khi bạn gọi `usersSelectors.selectAll(state)` lần thứ hai, nó sẽ **trả về cùng một mảng** mà không cần phải thực hiện lại quá trình biến đổi từ `entities` sang mảng.
* Điều này rất quan trọng trong React, vì nó giúp ngăn chặn việc re-render không cần thiết của các component khi state không thay đổi.

**Tóm lại**, `usersAdapter.getSelectors()` là một công cụ giúp bạn truy cập dữ liệu đã được chuẩn hóa một cách **an toàn, hiệu quả và tối ưu hiệu suất**, mà không cần phải tự viết các hàm selector phức tạp.
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

Dưới đây là toàn bộ code được viết lại và sắp xếp theo kiến trúc **Redux Toolkit + Redux-Saga + RTK Query** dành cho các ứng dụng phức tạp, kèm theo giải thích chi tiết cho từng phần.

### Cấu trúc dự án

```
src/
├── features/
│   ├── authSlice.ts
│   └── usersSlice.ts
├── sagas/
│   ├── authSaga.ts
│   └── index.ts
├── services/
│   ├── api.ts
│   └── rtkQueryBase.ts
└── store.ts
```

-----

### **1. Core Logic (Slices & Sagas)**

#### **`features/authSlice.ts`**

Quản lý trạng thái xác thực của người dùng (token, trạng thái loading).

```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  loading: boolean;
}

const initialState: AuthState = { token: null, loading: false };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true; // Kích hoạt trạng thái loading
    },
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.token = action.payload; // Lưu token
      state.loading = false; // Tắt loading
    },
    loginFailure: (state) => {
      state.loading = false; // Tắt loading và không lưu token
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure } = authSlice.actions;
export default authSlice.reducer;
```

-----

#### **`sagas/authSaga.ts`**

Saga xử lý luồng đăng nhập bất đồng bộ và các side effect.

```ts
import { takeLatest, call, put } from "redux-saga/effects";
import { loginSuccess, loginFailure, loginRequest } from "../features/authSlice";
import { apiLogin } from "../services/api";

function* loginWorker(action: ReturnType<typeof loginRequest>) {
  try {
    // Gọi API login bằng hàm 'call' của Saga
    const token: string = yield call(apiLogin, action.payload);
    // Khi thành công, dispatch action loginSuccess
    yield put(loginSuccess(token));
  } catch (err) {
    // Khi thất bại, dispatch action loginFailure
    yield put(loginFailure());
  }
}

// Watcher Saga: Lắng nghe action loginRequest
export default function* authSaga() {
  // 'takeLatest' đảm bảo chỉ có 1 worker chạy tại một thời điểm
  yield takeLatest(loginRequest.type, loginWorker);
}
```

-----

#### **`sagas/index.ts`**

Tập hợp tất cả các Saga lại thành một root Saga duy nhất.

```ts
import { all } from "redux-saga/effects";
import authSaga from "./authSaga";

export default function* rootSaga() {
  // 'all' cho phép chạy đồng thời nhiều Saga
  yield all([authSaga()]);
}
```

-----

### **2. Services (API & RTK Query)**

#### **`services/api.ts`**

Mô phỏng hàm gọi API bên ngoài (có thể dùng `axios` hoặc `fetch`).

```ts
// services/api.ts
export const apiLogin = async (credentials: any): Promise<string> => {
  console.log("Calling login API with credentials:", credentials);
  // Giả lập độ trễ mạng
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (credentials.username === "test" && credentials.password === "password") {
    return "fake-jwt-token-12345";
  } else {
    throw new Error("Invalid credentials");
  }
};
```

-----

#### **`services/rtkQueryBase.ts`**

Đây là `baseQuery` dùng chung, tự động thêm token vào header `Authorization` cho mọi yêu cầu API.

```ts
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

// baseQueryWithAuth sẽ tự động thêm token xác thực
export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: "https://api.example.com/",
  prepareHeaders: (headers, { getState }) => {
    // Lấy token từ Redux state
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
```

-----

#### **`features/usersSlice.ts`**

Sử dụng RTK Query để quản lý dữ liệu người dùng từ server.

```ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../services/rtkQueryBase";

export interface User {
  id: number;
  name: string;
  email: string;
}

export const usersApi = createApi({
  reducerPath: "usersApi",
  // Sử dụng baseQuery có tích hợp token xác thực
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),
  }),
});

export const { useGetUsersQuery } = usersApi;
```

-----

### **3. Store và Component**

#### **`store.ts`**

Cấu hình Redux Store để tích hợp tất cả các thành phần.

```ts
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import authReducer from "./features/authSlice";
import rootSaga from "./sagas";
import { usersApi } from "./features/usersSlice";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(sagaMiddleware, usersApi.middleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

-----

#### **`components/AuthAndUsers.tsx`**

Component mẫu để sử dụng cả Saga và RTK Query.

```tsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { loginRequest } from "../features/authSlice";
import { useGetUsersQuery } from "../features/usersSlice";

const AuthAndUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, loading } = useSelector((state: RootState) => state.auth);
  const { data: users, isLoading: usersLoading } = useGetUsersQuery(undefined, {
    skip: !token, // Bỏ qua query nếu chưa có token
  });

  const handleLogin = () => {
    dispatch(loginRequest({ username: "test", password: "password" }));
  };

  return (
    <div>
      <h2>1. Login (Redux-Saga)</h2>
      {!token ? (
        <button onClick={handleLogin}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      ) : (
        <p>Đăng nhập thành công! Token: {token}</p>
      )}

      {token && (
        <>
          <h2>2. Danh sách người dùng (RTK Query)</h2>
          {usersLoading ? (
            <p>Đang tải danh sách người dùng...</p>
          ) : (
            <ul>
              {users?.map((user) => (
                <li key={user.id}>{user.name} ({user.email})</li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default AuthAndUsers;

```
---

Ví dụ về tích hợp **Real-time Data (WebSocket) với Saga và RTK Query**. Dưới đây là toàn bộ code và giải thích chi tiết cho kịch bản này.

-----

### **1. Core Logic (Slices & Sagas)**

#### `features/chatSlice.ts`

Slice này quản lý trạng thái của các tin nhắn trò chuyện, bao gồm danh sách tin nhắn và các action cần thiết.

```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  id: string;
  user: string;
  text: string;
}

interface ChatState {
  messages: Message[];
}

const initialState: ChatState = {
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Action này được Saga dispatch khi nhận được tin nhắn mới từ WebSocket
    messageReceived: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    // Action này chỉ dùng để kích hoạt Saga
    connectWebSocket: (state) => {
      // no-op (không làm gì), chỉ là tín hiệu cho Saga
    },
  },
});

export const { messageReceived, connectWebSocket } = chatSlice.actions;
export default chatSlice.reducer;
```

-----

#### `sagas/chatSaga.ts`

Saga này chuyên trách việc kết nối và lắng nghe dữ liệu từ WebSocket.

```ts
import { eventChannel } from "redux-saga";
import { put, take, call, fork } from "redux-saga/effects";
import { messageReceived, connectWebSocket } from "../features/chatSlice";

// Hàm helper để tạo một kênh sự kiện từ WebSocket
function createWebSocketChannel(socket: WebSocket) {
  // eventChannel là một hàm helper của Saga giúp tạo một kênh
  // để chuyển đổi các sự kiện bên ngoài (như socket.onmessage) thành các action Redux
  return eventChannel((emitter) => {
    socket.onmessage = (event) => {
      // Khi có tin nhắn từ socket, 'emit' một action với dữ liệu
      try {
        const message = JSON.parse(event.data);
        emitter(messageReceived(message));
      } catch (e) {
        console.error("Failed to parse message:", e);
      }
    };

    socket.onclose = () => {
      emitter(messageReceived({ id: 'system', user: 'system', text: 'WebSocket disconnected.' }));
      emitter(eventChannel.END); // Kết thúc kênh
    };
    
    // Hàm này được gọi khi kênh bị đóng (ví dụ: khi component unmount)
    return () => {
      socket.close();
    };
  });
}

// Worker Saga để lắng nghe và dispatch các action từ kênh
function* watchMessages(channel: ReturnType<typeof createWebSocketChannel>) {
  while (true) {
    // 'take' tạm dừng cho đến khi nhận được một action từ kênh
    const action = yield take(channel);
    // 'put' action đó vào store Redux
    yield put(action);
  }
}

// Watcher Saga chính
export default function* chatSaga() {
  // Lắng nghe action 'connectWebSocket' để bắt đầu kết nối
  yield take(connectWebSocket.type);
  const socket = new WebSocket("wss://echo.websocket.org/"); // URL WebSocket
  const channel = yield call(createWebSocketChannel, socket);

  // 'fork' chạy 'watchMessages' trong một tiến trình riêng
  yield fork(watchMessages, channel);
}
```

-----

### **2. Component & Tích hợp**

#### `store.ts`

Thêm `chatSlice` và `chatSaga` vào store.

```ts
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas";
import chatReducer from "./features/chatSlice";
import { todosApi } from "./features/todosSlice"; // Giả sử RTK Query service

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    [todosApi.reducerPath]: todosApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(sagaMiddleware, todosApi.middleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### `sagas/index.ts`

Thêm `chatSaga` vào root Saga.

```ts
import { all } from "redux-saga/effects";
import chatSaga from "./chatSaga";

export default function* rootSaga() {
  yield all([
    chatSaga(),
    // Các sagas khác
  ]);
}
```

#### `components/Chat.tsx`

Component để hiển thị tin nhắn và dispatch action kết nối.

```tsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { connectWebSocket } from '../features/chatSlice';

const ChatComponent = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.chat.messages);

  useEffect(() => {
    // Kích hoạt Saga để kết nối WebSocket khi component mount
    dispatch(connectWebSocket());
  }, [dispatch]);

  return (
    <div>
      <h3>Real-time Chat (Saga + WebSocket)</h3>
      <div style={{ border: '1px solid #ccc', height: '200px', overflowY: 'scroll', padding: '10px' }}>
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.user}:</strong> {msg.text}</p>
        ))}
      </div>
    </div>
  );
};

export default ChatComponent;
```

-----

### **3. Tại sao đây là sự kết hợp tối ưu?**

  * **Tách biệt trách nhiệm:** `chatSlice` chỉ quản lý dữ liệu (state) của các tin nhắn. `chatSaga` chuyên trách toàn bộ logic bất đồng bộ và phức tạp của WebSocket. Điều này giúp mỗi phần của code tập trung vào một nhiệm vụ duy nhất.
  * **Quản lý luồng phức tạp:** Saga rất phù hợp cho các luồng dữ liệu liên tục như WebSocket. Nó có thể dễ dàng xử lý các sự kiện `onmessage`, `onclose`, `onerror` và tự động dispatch action tới Redux store.
  * **Tích hợp dễ dàng:** Khi có dữ liệu mới từ WebSocket, Saga chỉ cần `put` một action (ví dụ: `messageReceived`). Reducer của `chatSlice` sẽ nhận action này và cập nhật state một cách đồng bộ. Giao diện người dùng sẽ tự động re-render khi state thay đổi.
  * **RTK Query vẫn có thể hoạt động:** Trong kịch bản thực tế, bạn có thể dùng một `query` của RTK Query để lấy **lịch sử tin nhắn ban đầu**, trong khi Saga đảm nhận việc **cập nhật tin nhắn mới theo thời gian thực**. Cả hai sẽ cùng tồn tại và hoạt động hiệu quả.
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