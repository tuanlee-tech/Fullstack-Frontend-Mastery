## 🟨 Day 30: Debugging dự án thực tế**.

Mục tiêu là tổng hợp toàn bộ kiến thức từ Day 21 → 29, áp dụng các kỹ thuật **TypeScript + React + Redux Toolkit + Redux-Saga + RTK Query + Jest** để debug dự án phức tạp.

Chủ đề này sẽ bao gồm:

---

## 🎯 Mục tiêu học

* Debug **runtime errors** và **type errors** trong TS + React.
* Sử dụng **Redux DevTools** + **Saga Monitor** + **RTK Query DevTools**.
* Xử lý **async bugs**: thunk, saga, socket, RTK Query.
* Debug **integration test fail** và **optimistic updates rollback issues**.
* Best practices khi debug **enterprise React + Node + TS projects**.

---

## ⚡ TL;DR

1. **TypeScript Errors** → check `tsconfig.json` flags: `strict`, `noImplicitAny`.
2. **Runtime React Errors** → React DevTools, Error Boundaries.
3. **Redux State Errors** → Redux DevTools, logging middleware.
4. **Async Flow Bugs** → Saga monitor, Thunk logs, RTK Query cache inspection.
5. **Testing Failures** → RTL debug: `screen.debug()`, `jest.useFakeTimers()`.

---

## 📚 Nội dung chi tiết

### 1. TypeScript Debugging

* Enable **strict mode** để catch type issues sớm.
* Example:

```ts
// ❌ lỗi type
const add = (a, b) => a + b; // a,b: any
```

```ts
// ✅ fix
const add = (a: number, b: number): number => a + b;
```

* Check **inference vs explicit type**.

---

### 2. React Debugging

* **Error boundaries** để catch runtime errors:

```tsx
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? <h1>Something went wrong.</h1> : this.props.children; }
}
```

* Use **React DevTools** to inspect component tree, props, hooks state.

---

### 3. Redux + Saga + RTK Query Debugging

* **Redux DevTools**: inspect state, action history.

* **Saga Monitor**: see saga effects, cancellations, takeLatest conflicts.

* **RTK Query DevTools / logging**: cache status, queries, invalidations.

* Example: AsyncThunk bug:

```ts
// action không dispatch đúng
store.dispatch(fetchPosts(5)); // forgot payload => saga never triggers
```

---

### 4. Debugging Socket / Realtime

* Log socket events → check order / duplication.
* Use **throttle / debounce** to prevent state race.
* Simulate network lag in MSW to catch edge cases.

---

### 5. Debugging Jest + RTL tests

* `screen.debug()` → inspect rendered DOM.
* `jest.useFakeTimers()` → control async timers.
* Mock API / socket properly, avoid flaky tests.

---

## 📝 Bài tập / Mini Challenges

### Level 1 — TypeScript + Redux

* Tạo một reducer bị lỗi type → debug bằng TS strict mode.

### Level 2 — React Component + Thunk

* Component fetch data nhưng async thunk trả lỗi → debug UI không crash + show error.

### Level 3 — Saga + Socket

* Saga watcher không trigger → debug takeEvery/takeLatest + cancel + fork issues.
* Socket rapid events → UI không render đúng → debug race condition.

### Level 4 — Integration Test Fail

* Test thất bại do cache invalidation chưa đúng → debug RTK Query tags + optimistic update rollback.
* Fix bằng logging / patchResult / waitFor + async act.

---

## ⚠️ Tips / Best Practices

1. Always **check TS errors first**, runtime bug thường bắt nguồn từ type mismatch.
2. Use **console logs strategically**, avoid blanket `console.log`.
3. Leverage **DevTools**: Redux / Saga / React / Network.
4. Simulate **real-world latency** to catch async issues.
5. Debug tests with **mocked network / socket / time**, not real server.

---

✅ Day 30 sẽ giúp bạn kết nối tất cả kiến thức từ **TypeScript → React → Redux → Saga → RTK Query → Jest** để xử lý **bug trong dự án thực tế**, sẵn sàng cho **production / interview**.

---


# 🟢 Level 1 — TypeScript + Redux Debug

**Mục tiêu:** Debug type error + reducer bug.

```ts
// ❌ src/features/counterSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment(state, action) {
      state.value += action.payload; // action.payload: any → TS error
    },
  },
});

export const { increment } = counterSlice.actions;
export default counterSlice.reducer;
```

**Debug / Fix:**

```ts
// ✅ Fix với TypeScript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState { value: number; }

const initialState: CounterState = { value: 0 };

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment(state, action: PayloadAction<number>) {
      state.value += action.payload;
    },
  },
});

export const { increment } = counterSlice.actions;
export default counterSlice.reducer;
```

**Test:**

```ts
import counterReducer, { increment } from './counterSlice';

test('increment works', () => {
  const state = { value: 0 };
  const newState = counterReducer(state, increment(5));
  expect(newState.value).toBe(5);
});
```

---

# 🟢 Level 2 — React Component + AsyncThunk Debug

**Mục tiêu:** Component fetch data nhưng async thunk fail → debug UI crash + show error.

```ts
// features/postsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Post { id: number; title: string; }

export const fetchPosts = createAsyncThunk<Post[]>(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/posts"); // giả lập API
      if (!res.ok) throw new Error("Network error");
      return res.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

interface PostsState { data: Post[]; loading: boolean; error: string | null; }
const initialState: PostsState = { data: [], loading: false, error: null };

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPosts.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => { state.loading = false; state.data = action.payload; })
      .addCase(fetchPosts.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  }
});

export default postsSlice.reducer;
```

```tsx
// components/PostsList.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../features/postsSlice";
import type { RootState, AppDispatch } from "../store";

export const PostsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <ul>
      {data.map(p => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
};
```

**Debug tips:**

* Check network tab → API fail.
* Ensure `rejectWithValue` used → `action.payload` không undefined.
* Add fallback UI.

---

# 🟢 Level 3 — Saga + Socket Debug

**Mục tiêu:** Saga watcher không trigger / socket rapid events → debug race condition.

```ts
// sagas/socketSaga.ts
import { takeEvery, put, delay } from "redux-saga/effects";
import { increment } from "../features/counterSlice";

function* socketListener() {
  while (true) {
    yield delay(1000);
    yield put(increment(1)); // simulate socket event
  }
}

export default function* rootSaga() {
  yield takeEvery("counter/startSocket", socketListener); // ❌ takeEvery với generator infinite loop → không trigger
}
```

**Fix:**

```ts
import { fork } from "redux-saga/effects";

export default function* rootSaga() {
  yield fork(socketListener); // fork → run in background, không block
}
```

**Debug tips:**

* Saga Monitor → xem effect list.
* Use `fork` for background tasks, `takeEvery` cho action → avoid infinite blocking.

---

# 🟢 Level 4 — Integration Test Fail Debug (RTK Query + Optimistic Update)

**Mục tiêu:** Cache invalidation + optimistic rollback fail → debug integration test.

```ts
// services/postsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Post { id: number; title: string; }

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  tagTypes: ["Posts"],
  endpoints: builder => ({
    getPosts: builder.query<Post[], void>({
      query: () => "posts",
      providesTags: ["Posts"]
    }),
    addPost: builder.mutation<Post, Partial<Post>>({
      query: body => ({ url: "posts", method: "POST", body }),
      invalidatesTags: ["Posts"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(postsApi.util.updateQueryData("getPosts", undefined, draft => {
          draft.push({ id: Date.now(), title: arg.title! });
        }));
        try { await queryFulfilled; } catch { patchResult.undo(); }
      }
    })
  })
});

export const { useGetPostsQuery, useAddPostMutation } = postsApi;
```

```tsx
// components/Posts.tsx
import { useGetPostsQuery, useAddPostMutation } from "../services/postsApi";

export const Posts = () => {
  const { data, isLoading } = useGetPostsQuery();
  const [addPost] = useAddPostMutation();

  if (isLoading) return <p>Loading...</p>;
  return (
    <div>
      {data?.map(p => <p key={p.id}>{p.title}</p>)}
      <button onClick={() => addPost({ title: "Optimistic Post" })}>Add Optimistic</button>
    </div>
  );
};
```

```ts
// Posts.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../store";
import { Posts } from "./Posts";
import * as postsApi from "../services/postsApi";

jest.mock("../services/postsApi");

describe("Optimistic + Cache Debug", () => {
  let mockAddPost: jest.Mock;
  beforeEach(() => {
    (postsApi.useGetPostsQuery as jest.Mock).mockReturnValue({ data: [{id:1,title:"Post 1"}], isLoading:false });
    mockAddPost = jest.fn(() => Promise.resolve({ id: 2, title: "Optimistic Post" }));
    (postsApi.useAddPostMutation as jest.Mock).mockReturnValue([mockAddPost]);
  });

  test("optimistic update + rollback", async () => {
    render(<Provider store={store}><Posts /></Provider>);

    fireEvent.click(screen.getByText("Add Optimistic"));
    expect(screen.getByText("Optimistic Post")).toBeInTheDocument();

    // simulate failure
    mockAddPost.mockImplementationOnce(() => Promise.reject("Error"));
    fireEvent.click(screen.getByText("Add Optimistic"));
    await waitFor(() => expect(mockAddPost).toHaveBeenCalled());
    expect(screen.queryByText("Optimistic Post")).not.toBeInTheDocument();
  });
});
```

**Debug tips:**

* Ensure `patchResult.undo()` được gọi đúng khi query fail.
* Check RTK Query `tagTypes` + `invalidatesTags` → auto refetch.
* Use `waitFor` + mock hooks → avoid test flakiness.

---

# ✅ Kết luận Day 30

* Level 1 → TypeScript + Redux type bug fix ✅
* Level 2 → React component + asyncThunk error handling ✅
* Level 3 → Saga + Socket race condition debug ✅
* Level 4 → Integration test fail debug (RTK Query + optimistic update) ✅

> Đây là **senior-level debugging**, sát thực tế dự án enterprise + interview scenario.


---

# 🟢 Final Project Review — Day 21 → 30

## 1️⃣ Tổng quan Project

**Tên project:** Mini Enterprise App (React + Node + TypeScript)

**Features chính:**

1. **Auth system**

   * Login / Logout / Token handling (Redux Toolkit + AsyncThunk)
2. **CRUD Posts**

   * Frontend: React + Redux Toolkit / RTK Query
   * Backend: Node + Express + TypeScript
3. **Realtime Update**

   * Simulate socket events (increment counter, new post)
4. **Form Handling**

   * Type-safe form validation (React Hook Form + TS)
5. **Async Patterns**

   * AsyncThunk (simple async action)
   * Redux-Saga (complex flow, background tasks)
   * RTK Query (data fetching + caching + optimistic update)
6. **Testing / Debugging**

   * Unit test, Async test, Integration test, Enterprise-level test
   * Mock API + Socket + Cache invalidation

---

## 2️⃣ Tech Stack & Patterns

| Layer         | Tech / Pattern               | Notes                                         |
| ------------- | ---------------------------- | --------------------------------------------- |
| Frontend      | React + TS                   | Functional components, hooks                  |
| State         | Redux Toolkit                | Slice, AsyncThunk, RTK Query                  |
| Side Effects  | Redux-Saga                   | Complex flows, socket simulation              |
| Data Fetching | RTK Query                    | Caching, invalidation, optimistic updates     |
| Forms         | React Hook Form              | Type-safe, validation                         |
| Backend       | Node + Express + TS          | REST API, typed responses                     |
| Testing       | Jest + React Testing Library | Unit, Async, Integration, Enterprise scenario |
| Realtime      | Socket.io (simulated)        | Increment counter, auto-add posts             |

---

## 3️⃣ Core Modules & Key Patterns

### a. Redux Toolkit + AsyncThunk

```ts
// features/authSlice.ts
export const login = createAsyncThunk("auth/login", async ({username,password}) => {...});
const authSlice = createSlice({...});
```

**Takeaways:**

* Simple async action → ideal for feature-level CRUD
* Type-safe `PayloadAction`
* Testable via Jest fake timers

---

### b. Redux-Saga

```ts
// sagas/socketSaga.ts
function* socketListener() { while(true){ yield delay(1000); yield put(increment(1)); } }
export default function* rootSaga() { yield fork(socketListener); }
```

**Takeaways:**

* Control flow: `takeEvery`, `takeLatest`, `fork`, `cancel`, `race`
* Background tasks / infinite watchers
* Best for enterprise complex flows

---

### c. RTK Query

```ts
export const postsApi = createApi({
  reducerPath:"postsApi",
  baseQuery:fetchBaseQuery({ baseUrl:"/" }),
  tagTypes:["Posts"],
  endpoints:builder=>({...})
});
```

* Data fetching + caching
* Invalidates tags → auto refetch
* Optimistic update → instant UI response
* Testable via mock hooks

---

### d. React + TS + Forms

```tsx
const { register, handleSubmit } = useForm<FormValues>();
<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register("title")} />
</form>
```

* Type-safe forms
* Validation + async submission
* Integrates with Redux / RTK Query

---

### e. Testing Patterns

* **Unit:** Pure function, slice reducer
* **AsyncThunk:** Promise / dispatch check
* **Component:** Render, event simulation, assert UI
* **Enterprise:** Auth token, RTK Query cache, socket updates, optimistic rollback

---

## 4️⃣ Debugging Patterns

* TypeScript type errors → fix via interface / PayloadAction
* AsyncThunk failure → handle `rejectWithValue`, UI fallback
* Saga race condition → `fork` for background
* RTK Query cache → tagTypes + invalidatesTags
* Optimistic update → patch + rollback

---

## 5️⃣ Sample Flow — Full-stack Integration

1. User visits app → token not present → login form
2. Submit login → AsyncThunk → update authSlice → store token
3. App fetch posts → RTK Query → cache
4. User adds post → optimistic update → mutation → rollback if fail
5. Socket simulation → auto increment counter / add post
6. Redux-Saga background task → monitor events
7. Component integration → render updated UI
8. Testing → Unit + Async + Integration + Enterprise mocks

---

## 6️⃣ Final Testing Checklist (Interview-ready)

| Test Type   | Scope                         | Example                                            |
| ----------- | ----------------------------- | -------------------------------------------------- |
| Unit        | Reducer / Pure function       | counterSlice increment                             |
| Async       | AsyncThunk / API              | fetchPosts / login                                 |
| Component   | UI events                     | PostsList + addPost                                |
| Integration | Slice + RTK Query + Component | login → fetch → addPost → UI                       |
| Enterprise  | Full App Flow                 | Auth token + optimistic update + socket simulation |

---

## 7️⃣ Key Takeaways for Interview / Senior-level

* **Patterns mastery:** AsyncThunk / Redux-Saga / RTK Query → know when dùng gì
* **TypeScript + Redux:** full type safety, end-to-end
* **Testing culture:** Unit → Integration → Enterprise
* **Debugging mindset:** TS errors, async failure, race conditions, optimistic rollback
* **Enterprise flow:** Auth + API caching + optimistic UI + socket events
* **Interview prep:** có thể vẽ diagram flow, giải thích trade-offs, viết pseudo-code nhanh

---

## 8️⃣ Next Steps

* Có thể triển khai **coding challenge full-stack** dựa trên project này:

**Challenge Idea:**

* Build CMS admin mini-app
* Features: auth, CRUD posts, optimistic updates, socket notifications
* Patterns: Redux Toolkit + Saga + RTK Query + Form Handling + Jest Testing
* Deliver: Production-ready code + interview-ready test suite

---


Mình chia thành **Frontend / Backend / Tests**, mỗi phần có **code mẫu production-ready**, có comment giải thích.

---

# 🟢 Mini Enterprise App — Coding Challenge

**Project Scope:**

* Auth system (login/logout + token)
* Posts CRUD (get/add/edit/delete)
* Optimistic UI updates + RTK Query caching
* Socket simulation (auto-add posts every 5s)
* Full TS type safety
* Jest Integration Tests

---

## 1️⃣ Backend — Node + Express + TypeScript

### a. Setup

```bash
mkdir backend && cd backend
npm init -y
npm install express cors typescript ts-node-dev @types/express @types/node
npx tsc --init
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

### b. Server + Routes

```ts
// src/server.ts
import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

interface User { username: string; password: string; token: string; }
const FAKE_USER: User = { username: "admin", password: "123", token: "FAKE_TOKEN" };

interface Post { id: number; title: string; }
let posts: Post[] = [{ id: 1, title: "Hello World" }];

app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  if(username === FAKE_USER.username && password === FAKE_USER.password) {
    res.json({ token: FAKE_USER.token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.get("/posts", (req, res) => res.json(posts));
app.post("/posts", (req, res) => {
  const newPost: Post = { id: Date.now(), title: req.body.title };
  posts.push(newPost);
  res.json(newPost);
});

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
```

✅ Backend có login + posts CRUD, TS type-safe, chạy được bằng `ts-node-dev src/server.ts`.

---

## 2️⃣ Frontend — React + Redux Toolkit + TS

### a. Setup

```bash
npx create-react-app frontend --template typescript
cd frontend
npm install @reduxjs/toolkit react-redux @reduxjs/toolkit/query react-hook-form redux-saga socket.io-client
npm install -D @testing-library/react @testing-library/jest-dom jest ts-jest
```

---

### b. Store + Saga

```ts
// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import authReducer from "./features/authSlice";
import { postsApi } from "./services/postsApi";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [postsApi.reducerPath]: postsApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(postsApi.middleware, sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

### c. Auth Slice + AsyncThunk

```ts
// src/features/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState { token: string | null; loading: boolean; error: string | null; }
const initialState: AuthState = { token: null, loading: false, error: null };

export const login = createAsyncThunk("auth/login", async ({username,password}:{username:string,password:string}) => {
  const res = await axios.post("http://localhost:4000/login",{username,password});
  return res.data.token;
});

const authSlice = createSlice({
  name:"auth",
  initialState,
  reducers:{ logout:(state)=>{state.token=null;} },
  extraReducers:(builder)=>{
    builder
      .addCase(login.pending,(state)=>{state.loading=true;state.error=null;})
      .addCase(login.fulfilled,(state,action:PayloadAction<string>)=>{state.loading=false;state.token=action.payload;})
      .addCase(login.rejected,(state,action)=>{state.loading=false;state.error=action.error.message || "Error";});
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
```

---

### d. RTK Query Posts API

```ts
// src/services/postsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

export interface Post { id:number; title:string; }

export const postsApi = createApi({
  reducerPath:"postsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000",
    prepareHeaders: (headers,{getState})=>{
      const token = (getState() as RootState).auth.token;
      if(token) headers.set("Authorization",`Bearer ${token}`);
      return headers;
    }
  }),
  tagTypes:["Posts"],
  endpoints:(builder)=>({
    getPosts: builder.query<Post[],void>({
      query:()=>"/posts",
      providesTags:["Posts"]
    }),
    addPost: builder.mutation<Post,{title:string}>({
      query:(body)=>({url:"/posts",method:"POST",body}),
      invalidatesTags:["Posts"],
      async onQueryStarted(arg,{dispatch,queryFulfilled}){
        const patchResult = dispatch(postsApi.util.updateQueryData("getPosts",undefined,draft=>{draft.push({id:Date.now(),title:arg.title});}));
        try{ await queryFulfilled; } catch { patchResult.undo(); }
      }
    })
  })
});

export const { useGetPostsQuery,useAddPostMutation } = postsApi;
```

---

### e. Saga — Socket Simulation

```ts
// src/sagas/index.ts
import { all, delay, put, fork } from "redux-saga/effects";
import { postsApi } from "../services/postsApi";

function* socketSimulation() {
  const [, addPost] = postsApi.endpoints.addPost.initiate({ title: "Socket Post" });
  while(true){
    yield delay(5000);
    yield put(addPost);
  }
}

export default function* rootSaga(){ yield all([fork(socketSimulation)]);}
```

---

### f. App Component + Posts

```tsx
// src/App.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./store";
import { login } from "./features/authSlice";
import { useGetPostsQuery, useAddPostMutation } from "./services/postsApi";

export const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state:RootState)=>state.auth);

  useEffect(()=>{ dispatch(login({username:"admin",password:"123"})); },[dispatch]);

  const { data:posts, isLoading } = useGetPostsQuery();
  const [addPost] = useAddPostMutation();

  if(auth.loading) return <p>Logging in...</p>;
  if(auth.error) return <p>{auth.error}</p>;

  return (
    <div>
      <h1>Posts</h1>
      {isLoading ? <p>Loading...</p> : posts?.map(p=><p key={p.id}>{p.title}</p>)}
      <button onClick={()=>addPost({title:"Manual Post"})}>Add Post</button>
    </div>
  );
};
```

---

## 3️⃣ Jest Integration Test — Enterprise Flow

```ts
// src/App.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "./store";
import { App } from "./App";
import * as postsApi from "./services/postsApi";
import * as authSlice from "./features/authSlice";

jest.mock("./services/postsApi");
jest.mock("./features/authSlice");

describe("Enterprise Flow Test",()=>{
  beforeEach(()=>{
    (authSlice.login as jest.Mock).mockImplementation(()=>({type:"auth/login/fulfilled",payload:"FAKE_TOKEN"}));
    (postsApi.useGetPostsQuery as jest.Mock).mockReturnValue({data:[{id:1,title:"Post 1"}],isLoading:false});
    (postsApi.useAddPostMutation as jest.Mock).mockReturnValue([jest.fn(()=>Promise.resolve({id:2,title:"New Post"}))]);
  });

  test("full auth + posts flow", async ()=>{
    render(<Provider store={store}><App/></Provider>);

    await waitFor(()=>expect(screen.queryByText(/Logging in/i)).not.toBeInTheDocument());
    expect(screen.getByText("Post 1")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Add Post"));
    await waitFor(()=>expect(postsApi.useAddPostMutation).toHaveBeenCalled());
  });
});
```

✅ Full integration: Auth → Fetch Posts → Add Post → Optimistic Update → Testable.

---

## 4️⃣ Key Takeaways — Interview Ready

* Async patterns: AsyncThunk, Saga, RTK Query
* Enterprise patterns: Cache invalidation, optimistic update
* Auth token handling + prepareHeaders
* Socket / background tasks
* Full-stack TS typing
* Jest Integration Test — real-world flow

---

Tóm tắt hiện tại:

* **Day 21→28**: TypeScript, React, Node, Form, Redux Toolkit, Saga, RTK Query, Testing ✅
* **Day 29**: Mini Project REST API + Frontend ✅
* **Day 30**: Debugging, Enterprise Integration Test, Optimistic Updates ✅

Điểm mấu chốt: Bạn đã có **nền tảng full-stack senior-level**:

* Redux Toolkit Core + AsyncThunk
* Redux-Saga flow + side effects
* RTK Query + caching + optimistic update
* React + TypeScript + Node/Express API
* Jest Unit + Async + Integration Tests

---

📌 [<< Ngày 29](./Day29.md) | [Ngày 31 >>](./Day31.md)