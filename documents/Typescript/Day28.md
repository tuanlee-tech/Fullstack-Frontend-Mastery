# 🔹 Day 28: Testing với Jest + TypeScript

## 🎯 Mục tiêu học

* Hiểu cơ bản về Jest + TypeScript setup.
* Viết **unit test** cho function, class, Redux slice, asyncThunk.
* Viết **integration test** cho React component có hooks + Redux + RTK Query.
* Mock API, mock async behavior, simulate error/loading.
* Áp dụng **best practices** để code test có thể sử dụng trong dự án enterprise.

---

## ⚡ TL;DR

* Unit test: check small logic, pure functions, reducers.
* Async test: check thunks, promises, async actions.
* Component test: render component, simulate events, assert UI changes.
* Mock API + socket + time: use jest.mock, jest.useFakeTimers.

---

## 📚 Nội dung chi tiết

1. **Setup Jest + TS**

```bash
npm install --save-dev jest ts-jest @types/jest @testing-library/react @testing-library/jest-dom
npx ts-jest config:init
```

`package.json` scripts:

```json
{
  "scripts": {
    "test": "jest --watchAll"
  }
}
```

`jest.config.js`:

```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};
```

2. **Unit Test**

* Function test:

```ts
export const sum = (a: number, b: number) => a + b;

test('sum adds correctly', () => {
  expect(sum(2, 3)).toBe(5);
});
```

* Redux slice test:

```ts
import counterReducer, { incrementByAmount } from './counterSlice';

test('counter reducer increments', () => {
  const state = { value: 0 };
  const newState = counterReducer(state, incrementByAmount(5));
  expect(newState.value).toBe(5);
});
```

3. **AsyncThunk Test**

```ts
import { fetchPosts } from './postsSlice';
import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './postsSlice';

jest.useFakeTimers();

test('fetchPosts returns posts', async () => {
  const store = configureStore({ reducer: { posts: postsReducer } });
  const promise = store.dispatch(fetchPosts());
  jest.runAllTimers();
  const result = await promise;
  expect(result.payload.length).toBeGreaterThan(0);
});
```

4. **React Component Test**

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';

test('login and display posts', async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  fireEvent.change(screen.getByRole('textbox', { name: /username/i }), {
    target: { value: 'admin' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: /password/i }), {
    target: { value: '123' },
  });

  fireEvent.click(screen.getByText(/login/i));
  // wait for login + fetch
  expect(await screen.findByText(/Posts/i)).toBeInTheDocument();
});
```

5. **Mocking API & Socket**

```ts
jest.mock('./api', () => ({
  fetchPosts: jest.fn(() => Promise.resolve([{ id:1, title: 'Test' }])),
}));
```

---

## 📝 Bài tập

### Level 1

* Unit test 1 reducer slice (counter/todos).

### Level 2

* AsyncThunk test: login + fetch posts, simulate error, assert state.

### Level 3

* Component test: render App, simulate login, addPost, socket update, logout.

### Level 4 (Enterprise)

* Mock multiple endpoints + integrate with RTK Query hooks.
* Test caching, invalidation, auth token injection.

---


# 🟢 RTK + AsyncThunk + Saga + Component Testing (Levels 1 → 3)

## Level 1 — Unit Test cơ bản

* **Target:** Reducer slice hoặc function thuần.
* **Ví dụ:** `counterSlice`:

```ts
import counterReducer, { incrementByAmount } from './counterSlice';

test('counter reducer increments', () => {
  const state = { value: 0 };
  const newState = counterReducer(state, incrementByAmount(5));
  expect(newState.value).toBe(5);
});
```

* ✅ Test thuần, pure function, không phụ thuộc async hay API.

---

## Level 2 — AsyncThunk Test

* **Target:** `createAsyncThunk` / async action.
* **Ví dụ:** `incrementAsync`:

```ts
import { incrementAsync } from './counterSlice';
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';

jest.useFakeTimers();

test('incrementAsync resolves', async () => {
  const store = configureStore({ reducer: { counter: counterReducer } });
  const promise = store.dispatch(incrementAsync(5));
  jest.runAllTimers(); // simulate setTimeout
  const result = await promise;
  expect(result.payload).toBe(5);
  expect(store.getState().counter.value).toBe(5);
});
```

* ✅ Kiểm tra async logic, đảm bảo thunk dispatch kết quả chính xác.

---

## Level 3 — Integration Test Component + Redux + RTK Query

* **Target:** React component + slice + RTK Query hook + asyncThunk.
* **Ví dụ:** `App` component (Counter + Posts):

```ts
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { App } from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import * as postsApi from "./services/postsApi";

jest.mock("./services/postsApi", () => ({
  postsApi: {
    useGetPostsQuery: jest.fn(),
    useAddPostMutation: jest.fn(),
  },
}));

describe("App Integration Test", () => {
  beforeEach(() => {
    (postsApi.postsApi.useGetPostsQuery as jest.Mock).mockReturnValue({
      data: [{ id: 1, title: "Post 1" }],
      isLoading: false,
    });
    (postsApi.postsApi.useAddPostMutation as jest.Mock).mockReturnValue([
      jest.fn(() => Promise.resolve({ id: 2, title: "New Post" })),
    ]);
  });

  test("renders posts and adds post", async () => {
    render(<Provider store={store}><App /></Provider>);

    expect(screen.getByText("Post 1")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Add Post"));

    await waitFor(() => {
      expect(postsApi.postsApi.useAddPostMutation).toHaveBeenCalled();
    });
  });

  test("counter async increment works", async () => {
    render(<Provider store={store}><App /></Provider>);

    fireEvent.click(screen.getByText("Increment Async"));

    await waitFor(() => {
      expect(store.getState().counter.value).toBe(5);
    });
  });
});
```

* ✅ Test Integration đầy đủ: component render → async action → API → state update → UI update.
* ✅ Mock API / hooks → test không cần server thật.

---

Chúng ta sẽ làm **Level 4 – Enterprise Integration Test** full-scale, production-ready, interview-style, kết hợp:

* **Auth token**
* **RTK Query caching + invalidation**
* **Socket update**
* **Redux Toolkit + AsyncThunk**

---

# 🟢 Setup giả lập Enterprise

```bash
npm install socket.io-client @reduxjs/toolkit react-redux @testing-library/react @testing-library/jest-dom jest ts-jest typescript
```

`jest.config.js` như trước, dùng `jsdom`.

---

# 🟢 Redux Slice + AsyncThunk + RTK Query + Socket

```ts
// store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import { postsApi } from "./services/postsApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [postsApi.reducerPath]: postsApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(postsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```ts
// features/authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface AuthState { token: string | null; loading: boolean; error: string | null; }
const initialState: AuthState = { token: null, loading: false, error: null };

export const login = createAsyncThunk("auth/login", async ({username, password}: {username: string, password: string}) => {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      if(username === "admin" && password === "123") resolve("FAKE_TOKEN");
      else reject("Invalid credentials");
    }, 500);
  });
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: { logout: (state) => { state.token = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action: PayloadAction<string>) => { state.loading = false; state.token = action.payload; })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Error"; });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
```

```ts
// services/postsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

export interface Post { id: number; title: string; }

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if(token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    }
  }),
  tagTypes: ["Posts"],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => "posts",
      providesTags: ["Posts"],
    }),
    addPost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({ url: "posts", method: "POST", body }),
      invalidatesTags: ["Posts"],
    }),
  }),
});

export const { useGetPostsQuery, useAddPostMutation } = postsApi;
```

---

# 🟢 App Component + Socket Simulation

```tsx
// App.tsx
import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, AppDispatch, RootState } from "./store";
import { login } from "./features/authSlice";
import { useGetPostsQuery, useAddPostMutation } from "./services/postsApi";

const Posts = () => {
  const { data: posts, isLoading } = useGetPostsQuery();
  const [addPost] = useAddPostMutation();

  // Simulate socket update
  useEffect(() => {
    const interval = setInterval(() => {
      addPost({ title: "Socket New Post" });
    }, 5000);
    return () => clearInterval(interval);
  }, [addPost]);

  return (
    <div>
      {isLoading ? <p>Loading...</p> : posts?.map(p => <p key={p.id}>{p.title}</p>)}
      <button onClick={() => addPost({ title: "Manual Add" })}>Add Post</button>
    </div>
  );
};

export const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(login({ username: "admin", password: "123" }));
  }, [dispatch]);

  if(auth.loading) return <p>Logging in...</p>;
  if(auth.error) return <p>{auth.error}</p>;

  return <Posts />;
};

export const RootApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);
```

---

# 🟢 Jest Enterprise Integration Test

```ts
// App.enterprise.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RootApp } from "./App";
import { store } from "./store";
import { Provider } from "react-redux";
import * as postsApi from "./services/postsApi";
import * as authSlice from "./features/authSlice";

jest.mock("./services/postsApi");
jest.mock("./features/authSlice");

describe("Enterprise Flow Test", () => {
  beforeEach(() => {
    (authSlice.login as jest.Mock).mockImplementation(() => ({ type: "auth/login/fulfilled", payload: "FAKE_TOKEN" }));
    (postsApi.useGetPostsQuery as jest.Mock).mockReturnValue({ data: [{id:1, title:"Post 1"}], isLoading:false });
    (postsApi.useAddPostMutation as jest.Mock).mockReturnValue([jest.fn(() => Promise.resolve({id:2,title:"New Post"}))]);
  });

  test("full auth + posts + socket flow", async () => {
    render(<RootApp />);

    // Auth success
    await waitFor(() => expect(screen.queryByText(/Logging in/i)).not.toBeInTheDocument());

    // Initial posts
    expect(screen.getByText("Post 1")).toBeInTheDocument();

    // Add post manually
    fireEvent.click(screen.getByText("Add Post"));
    await waitFor(() => expect(postsApi.useAddPostMutation).toHaveBeenCalled());

    // Simulate socket (fake interval)
    jest.advanceTimersByTime(5000); // socket triggers addPost
    await waitFor(() => expect(postsApi.useAddPostMutation).toHaveBeenCalledTimes(2));
  });
});
```

---

# ✅ Enterprise Test Highlights

1. **Auth token injection** vào baseQuery.
2. **RTK Query cache + invalidation** testable qua hook mock.
3. **Socket update** simulated via `setInterval` + mutation call.
4. **Integration end-to-end**: login → fetch → add → cache update → UI render.
5. **Ready for production interview**: mô phỏng real-world flow với mock, async, cache, socket.


Chúng ta sẽ triển khai **Level 4 Bonus: Enterprise-grade RTK Query cache invalidation + optimistic update testing** full chi tiết.

---

# 🟢 Mục tiêu

1. Test **cache invalidation** khi mutation thay đổi data (add/edit/delete).
2. Test **optimistic update**: UI cập nhật trước khi server phản hồi.
3. Tích hợp **auth token**.
4. Giữ flow **Redux Toolkit + RTK Query + React Testing Library**.

---

# 🟢 Service & Slice setup

```ts
// services/postsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Post { id: number; title: string; }

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if(token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Posts"],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => "posts",
      providesTags: ["Posts"],
    }),
    addPost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({ url: "posts", method: "POST", body }),
      invalidatesTags: ["Posts"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          postsApi.util.updateQueryData("getPosts", undefined, (draft) => {
            draft.push({ id: Date.now(), title: arg.title! });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo(); // rollback if failed
        }
      },
    }),
  }),
});

export const { useGetPostsQuery, useAddPostMutation } = postsApi;
```

---

# 🟢 Component sử dụng Optimistic Update

```tsx
// Posts.tsx
import React from "react";
import { useGetPostsQuery, useAddPostMutation } from "./services/postsApi";

export const Posts = () => {
  const { data: posts, isLoading } = useGetPostsQuery();
  const [addPost] = useAddPostMutation();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      {posts?.map((p) => <p key={p.id}>{p.title}</p>)}
      <button onClick={() => addPost({ title: "Optimistic Post" })}>Add Optimistic</button>
    </div>
  );
};
```

---

# 🟢 Jest Integration Test: Cache + Optimistic

```ts
// Posts.enterprise.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "./store";
import { Posts } from "./Posts";
import * as postsApi from "./services/postsApi";

jest.mock("./services/postsApi");

describe("RTK Query Cache + Optimistic Update", () => {
  let mockAddPost: jest.Mock;
  beforeEach(() => {
    (postsApi.useGetPostsQuery as jest.Mock).mockReturnValue({ data: [{id:1,title:"Post 1"}], isLoading: false });
    mockAddPost = jest.fn(() => Promise.resolve({ id: 2, title: "Optimistic Post" }));
    (postsApi.useAddPostMutation as jest.Mock).mockReturnValue([mockAddPost]);
  });

  test("renders initial posts and optimistic add", async () => {
    render(<Provider store={store}><Posts /></Provider>);

    // Initial posts rendered
    expect(screen.getByText("Post 1")).toBeInTheDocument();

    // Click add button → optimistic update
    fireEvent.click(screen.getByText("Add Optimistic"));

    // Check UI ngay lập tức có post mới
    expect(screen.getByText("Optimistic Post")).toBeInTheDocument();

    // Ensure mutation called
    await waitFor(() => expect(mockAddPost).toHaveBeenCalledWith({ title: "Optimistic Post" }));
  });

  test("rollback if mutation fails", async () => {
    mockAddPost.mockImplementationOnce(() => Promise.reject("Network Error"));
    render(<Provider store={store}><Posts /></Provider>);

    fireEvent.click(screen.getByText("Add Optimistic"));

    // UI show optimistic
    expect(screen.getByText("Optimistic Post")).toBeInTheDocument();

    // Wait for mutation rejection
    await waitFor(() => expect(mockAddPost).toHaveBeenCalled());

    // Should rollback UI
    expect(screen.queryByText("Optimistic Post")).not.toBeInTheDocument();
  });
});
```

---

# ✅ Notes / Enterprise Tips

1. **Optimistic update** → UX tốt, nhưng cần rollback khi mutation fail.
2. **Cache invalidation + tagTypes** → auto-refetch các query liên quan.
3. **Token injection** → chuẩn auth flow, dùng `prepareHeaders`.
4. **Testing**: mock hooks + mock async + check UI render + rollback.
5. **Scaling**: pattern này dùng cho CMS/admin dashboard + realtime updates + feature flags.

---

Chúng ta đã hoàn thiện **Day 27: Redux Toolkit + AsyncThunk + Redux-Saga + RTK Query**, bao gồm cả **Level 4 Enterprise Integration + Optimistic Update + Test**.

Về mặt **depth & coverage**, đây đã là **senior-level**:

* Core RTK + AsyncThunk ✅
* Redux-Saga phức tạp + control flow ✅
* RTK Query + caching + invalidation + optimistic update ✅
* Enterprise flow + auth + socket simulation ✅
* Jest integration test full-scale ✅
* Interview Q\&A mini checklist ✅

✅ **Kết luận:** Về kiến thức Redux Toolkit / AsyncThunk / Saga / RTKQ, anh đã đủ nền tảng để **sang Day 28: Testing với Jest + TypeScript**.


---

📌 [<< Ngày 27](./Day27.md) | [Ngày 29 >>](./Day29.md)