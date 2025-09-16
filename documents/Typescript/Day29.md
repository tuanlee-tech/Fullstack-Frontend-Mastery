# 🔹 Day 29: Mini Project 2 — Fullstack Realtime Dashboard
Day 28, Day 27, và cả phần mini project hiện tại đều dùng **Auth + Posts CRUD** làm ví dụ, nên nếu giữ nguyên, sẽ hơi lặp.

Để **luyện interview senior / production-ready**, mình gợi ý đổi **chủ đề khác phức tạp hơn**, có thể bao gồm những patterns thường gặp trong phỏng vấn thực chiến, ví dụ:

---

## 🔹 Gợi ý chủ đề thay thế / nâng cấp

| Chủ đề                                     | Mức độ phức tạp | Điểm interview / production                                                                  |
| ------------------------------------------ | --------------- | -------------------------------------------------------------------------------------------- |
| **Feature Flags + AB Testing**             | Trung → cao     | Quản lý dynamic feature, bật/tắt theo user, test async flow                                  |
| **Realtime Chat / Notifications**          | Cao             | WebSocket / Socket.io, redux state update, optimistic UI, throttling, caching                |
| **Shopping Cart + Inventory**              | Trung → cao     | Redux + RTK Query + Saga + Optimistic Update + stock validation, concurrent update           |
| **Admin Dashboard + Role-based Access**    | Cao             | Auth + RBAC + multi-endpoint data + caching + conditional rendering                          |
| **Complex Form Builder / Multi-step Form** | Trung → cao     | Redux Form / React Hook Form + Async validation + dynamic fields + undo/redo + caching draft |
| **Analytics / Metrics Stream**             | Cao             | Fetch + aggregate + real-time chart update + debounce + cache + pagination                   |

---

### 🔹 Lý do nên đổi

* Cho phép luyện các **patterns phức tạp**: optimistic update, multi-API, concurrent state, real-time, RBAC.
* Phù hợp **senior-level coding challenge / interview**.

---
## 1️⃣ Concept Project

**Tên tạm:** `Team Tasks Dashboard`

**Mô tả:**
Ứng dụng quản lý **task/project**, bao gồm:

* **Auth + Role-based Access** (Admin / Member)
* **Task CRUD** (create, read, update, delete)
* **Realtime Updates** (WebSocket / Socket.io)
* **Notifications** khi task được tạo / update
* **Optimistic Update** cho UX mượt
* **Caching + Invalidation** với RTK Query
* **Server-side Node + Express + TypeScript**
* **Frontend React + TypeScript + Redux Toolkit + RTK Query + Redux-Saga**

**Features senior-level / interview-ready:**

| Feature                 | Patterns & Skills                                  |
| ----------------------- | -------------------------------------------------- |
| Auth + RBAC             | AsyncThunk, token-based auth, protected routes     |
| Task CRUD               | RTK Query + cache invalidation + optimistic update |
| Realtime updates        | WebSocket / Redux-Saga event handling              |
| Notifications           | Redux slice + Saga / RTK Query subscription        |
| Task filtering / search | Derived state, selector memoization                |
| Error handling          | Global API error interceptor, retry logic          |
| Testing                 | Jest unit + integration, mock WebSocket            |

---

## 2️⃣ Suggested Levels

| Level   | Target                                                                                  |
| ------- | --------------------------------------------------------------------------------------- |
| Level 1 | Auth + simple Task list (fetch & display)                                               |
| Level 2 | Task CRUD + cache invalidation                                                          |
| Level 3 | Realtime updates via WebSocket + optimistic updates                                     |
| Level 4 | Role-based access, notifications, integration testing (Jest + RTL), enterprise patterns |

---

## 3️⃣ Tech Stack

**Backend: Node + Express + TypeScript**

* REST API endpoints
* WebSocket via `socket.io`
* JWT auth
* In-memory DB (mock) hoặc SQLite/JSON file

**Frontend: React + TypeScript**

* Redux Toolkit + RTK Query
* Redux-Saga (optional, for notifications / complex side effects)
* React Hook Form (task creation/edit)
* React Testing Library + Jest

---

## 4️⃣ Advantages

* Cover **fullstack interview scenario**
* Practice **senior patterns**: async handling, caching, optimistic UI, real-time, RBAC
* Enterprise-like flow: auth, multiple endpoints, socket events, UI integration


---


# 🟩 Day 29: Mini Project 2 — REST API + Frontend (React + Node + TS)

## 🎯 Mục tiêu học

* Xây dựng **fullstack mini project** bằng Node + Express + React + TypeScript.
* Áp dụng **Redux Toolkit + RTK Query + Redux-Saga** trong frontend.
* Quản lý **async logic, optimistic update, cache invalidation, WebSocket**.
* Thực hành **unit test & integration test** cho enterprise patterns.
* Tập luyện **interview-style coding challenge**.

---

## ⚡ TL;DR

* **Level 1:** Auth + Task list
* **Level 2:** Task CRUD + RTK Query + Cache invalidation
* **Level 3:** Realtime update via WebSocket + optimistic UI
* **Level 4:** Role-based access, notifications, integration testing, enterprise patterns

---

## 📚 Level 1 — Auth + Task List (Basic)

### 1. Backend: Node + Express + TS

```ts
// server/src/index.ts
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "SECRET_KEY";

// Mock DB
let users = [{ id: 1, username: "admin", password: "123", role: "admin" }];
let tasks = [{ id: 1, title: "First Task", completed: false }];

// Auth endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Get tasks (protected)
app.get("/tasks", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });
  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, SECRET);
    res.json(tasks);
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

app.listen(4000, () => console.log("Server running on port 4000"));
```

---

### 2. Frontend: React + RTK Query

```ts
// frontend/src/services/authApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface LoginPayload { username: string; password: string; }
interface LoginResponse { token: string; }

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/" }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({ query: (body) => ({ url: "login", method: "POST", body }) }),
  }),
});

export const { useLoginMutation } = authApi;
```

```tsx
// frontend/src/components/Login.tsx
import { useState } from "react";
import { useLoginMutation } from "../services/authApi";

export const Login = () => {
  const [login] = useLoginMutation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = async () => {
    const res = await login({ username, password }).unwrap();
    setToken(res.token);
  };

  return (
    <div>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" />
      <button onClick={handleSubmit}>Login</button>
      {token && <p>Token: {token}</p>}
    </div>
  );
};
```

```tsx
// frontend/src/App.tsx
import React from "react";
import { Login } from "./components/Login";

export const App = () => <Login />;
```

---

✅ **Level 1 hoàn tất:**

* Backend có auth + task GET protected.
* Frontend login cơ bản, hiển thị token.

---

 **Level 2 — Task CRUD + RTK Query + Cache Invalidation** full stack, production-ready.

Mục tiêu **Level 2**:

* Frontend fetch list tasks, add/edit/delete task.
* Dùng **RTK Query** + **tagTypes** để **cache invalidation** tự động.
* Backend REST API tương ứng.

---

# 🟢 Backend — Node + Express + TS (Level 2)

```ts
// server/src/index.ts
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "SECRET_KEY";

// Mock DB
let users = [{ id: 1, username: "admin", password: "123", role: "admin" }];
let tasks = [
  { id: 1, title: "First Task", completed: false },
  { id: 2, title: "Second Task", completed: true },
];

// Auth middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, SECRET);
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// CRUD endpoints
app.get("/tasks", authMiddleware, (req, res) => res.json(tasks));

app.post("/tasks", authMiddleware, (req, res) => {
  const { title } = req.body;
  const newTask = { id: tasks.length + 1, title, completed: false };
  tasks.push(newTask);
  res.json(newTask);
});

app.put("/tasks/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const task = tasks.find(t => t.id === +id);
  if (!task) return res.status(404).json({ message: "Not found" });
  task.title = title ?? task.title;
  task.completed = completed ?? task.completed;
  res.json(task);
});

app.delete("/tasks/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter(t => t.id !== +id);
  res.json({ success: true });
});

app.listen(4000, () => console.log("Server running on port 4000"));
```

---

# 🟢 Frontend — RTK Query (Level 2)

```ts
// frontend/src/services/tasksApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

export interface Task { id: number; title: string; completed: boolean; }

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Tasks"],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => "tasks",
      providesTags: ["Tasks"],
    }),
    addTask: builder.mutation<Task, Partial<Task>>({
      query: (body) => ({ url: "tasks", method: "POST", body }),
      invalidatesTags: ["Tasks"],
    }),
    updateTask: builder.mutation<Task, Partial<Task> & { id: number }>({
      query: ({ id, ...body }) => ({ url: `tasks/${id}`, method: "PUT", body }),
      invalidatesTags: ["Tasks"],
    }),
    deleteTask: builder.mutation<{ success: boolean }, { id: number }>({
      query: ({ id }) => ({ url: `tasks/${id}`, method: "DELETE" }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const { useGetTasksQuery, useAddTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksApi;
```

```ts
// frontend/src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { tasksApi } from "./services/tasksApi";
import authReducer from "./features/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(tasksApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

# 🟢 Frontend Component — TaskList

```tsx
// frontend/src/components/TaskList.tsx
import React, { useState } from "react";
import { useGetTasksQuery, useAddTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } from "../services/tasksApi";

export const TaskList = () => {
  const { data: tasks, isLoading } = useGetTasksQuery();
  const [addTask] = useAddTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [newTitle, setNewTitle] = useState("");

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Tasks</h2>
      <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="New task" />
      <button onClick={() => { addTask({ title: newTitle }); setNewTitle(""); }}>Add Task</button>

      <ul>
        {tasks?.map(t => (
          <li key={t.id}>
            <input type="checkbox" checked={t.completed} onChange={() => updateTask({ id: t.id, completed: !t.completed })} />
            {t.title}
            <button onClick={() => deleteTask({ id: t.id })}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

```tsx
// frontend/src/App.tsx
import React from "react";
import { TaskList } from "./components/TaskList";
import { Login } from "./components/Login";

export const App = () => {
  return (
    <div>
      <Login />
      <TaskList />
    </div>
  );
};
```

---

✅ **Level 2 hoàn tất:**

* CRUD tasks hoàn toàn với **RTK Query**.
* **Cache invalidation** tự động qua `tagTypes`.
* Frontend reactively update mà không cần refetch thủ công.

---

 **Level 3 — Realtime WebSocket + Optimistic UI** full stack, interview-style, production-ready.

---

# 🟢 Backend — Node + Express + Socket.IO

```ts
// server/src/index.ts
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "SECRET_KEY";
let tasks = [
  { id: 1, title: "First Task", completed: false },
  { id: 2, title: "Second Task", completed: true },
];

// HTTP Server
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("addTask", (task) => {
    const newTask = { id: tasks.length + 1, ...task };
    tasks.push(newTask);
    io.emit("taskAdded", newTask); // broadcast to all clients
  });

  socket.on("updateTask", (task) => {
    const idx = tasks.findIndex((t) => t.id === task.id);
    if (idx !== -1) {
      tasks[idx] = { ...tasks[idx], ...task };
      io.emit("taskUpdated", tasks[idx]);
    }
  });

  socket.on("deleteTask", (id) => {
    tasks = tasks.filter((t) => t.id !== id);
    io.emit("taskDeleted", id);
  });
});

server.listen(4000, () => console.log("Server + Socket running on 4000"));
```

---

# 🟢 Frontend — Socket + Optimistic Update + RTK Query

```tsx
// frontend/src/hooks/useSocket.ts
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { Task } from "../services/tasksApi";

let socket: Socket;

export const useSocket = (onTaskAdded: (task: Task) => void, onTaskUpdated: (task: Task) => void, onTaskDeleted: (id: number) => void) => {
  useEffect(() => {
    socket = io("http://localhost:4000");

    socket.on("taskAdded", onTaskAdded);
    socket.on("taskUpdated", onTaskUpdated);
    socket.on("taskDeleted", onTaskDeleted);

    return () => {
      socket.disconnect();
    };
  }, [onTaskAdded, onTaskUpdated, onTaskDeleted]);

  const emitAddTask = (task: Partial<Task>) => socket.emit("addTask", task);
  const emitUpdateTask = (task: Partial<Task> & { id: number }) => socket.emit("updateTask", task);
  const emitDeleteTask = (id: number) => socket.emit("deleteTask", id);

  return { emitAddTask, emitUpdateTask, emitDeleteTask };
};
```

```tsx
// frontend/src/components/TaskListRealtime.tsx
import React, { useState, useEffect } from "react";
import { Task, useGetTasksQuery, useAddTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } from "../services/tasksApi";
import { useSocket } from "../hooks/useSocket";
import { useDispatch } from "react-redux";
import { tasksApi } from "../services/tasksApi";

export const TaskListRealtime = () => {
  const { data: tasks = [], isLoading } = useGetTasksQuery();
  const [addTaskMutation] = useAddTaskMutation();
  const [updateTaskMutation] = useUpdateTaskMutation();
  const [deleteTaskMutation] = useDeleteTaskMutation();
  const [newTitle, setNewTitle] = useState("");
  const dispatch = useDispatch();

  // Socket integration
  const { emitAddTask, emitUpdateTask, emitDeleteTask } = useSocket(
    (task: Task) => dispatch(tasksApi.util.updateQueryData("getTasks", undefined, (draft) => { draft.push(task); })),
    (task: Task) => dispatch(tasksApi.util.updateQueryData("getTasks", undefined, (draft) => {
      const idx = draft.findIndex(t => t.id === task.id);
      if(idx !== -1) draft[idx] = task;
    })),
    (id: number) => dispatch(tasksApi.util.updateQueryData("getTasks", undefined, (draft) => {
      return draft.filter(t => t.id !== id);
    }))
  );

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Realtime Tasks</h2>
      <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="New task" />
      <button onClick={() => {
        const optimisticTask = { id: Date.now(), title: newTitle, completed: false };
        dispatch(tasksApi.util.updateQueryData("getTasks", undefined, draft => draft.push(optimisticTask)));
        emitAddTask({ title: newTitle });
        setNewTitle("");
      }}>Add Task</button>

      <ul>
        {tasks.map(t => (
          <li key={t.id}>
            <input type="checkbox" checked={t.completed} onChange={() => emitUpdateTask({ id: t.id, completed: !t.completed })} />
            {t.title}
            <button onClick={() => emitDeleteTask(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

---

# 🟢 Features / Senior Tips

1. **Optimistic UI**: cập nhật UI ngay khi user action, rollback khi server reject (có thể enhance thêm).
2. **Realtime updates**: tất cả clients tự động nhận task changes qua Socket.IO.
3. **RTK Query cache update**: `updateQueryData` giúp sync state giữa local + server + socket.
4. **Enterprise-ready**: mô phỏng dashboard collaborative (CMS, project management).
5. **Interview-style**: testable, mockable, dễ mở rộng thêm auth + roles + error handling.

---

# 🟢 Level 3 — Q\&A Interview-style

**Q1:** Tại sao dùng `updateQueryData` thay vì refetch?
**A1:** Refetch tốn bandwidth + chậm, `updateQueryData` tận dụng cache để update UI nhanh (optimistic).

**Q2:** Cách rollback khi optimistic update fail?
**A2:** Trong `onQueryStarted`, lưu `patchResult` và gọi `patchResult.undo()` nếu server reject.

**Q3:** Socket + RTK Query có xung đột state không?
**A3:** Không, vì ta chỉ **update cache trực tiếp**, RTK Query vẫn quản lý fetch/invalidate riêng.

**Q4:** Khi nào dùng mutation + socket?
**A4:** Mutation để gửi server, socket để broadcast changes đến tất cả clients.

---

**Level 4 — Full Enterprise Integration** cho Mini Project 2: REST API + Frontend (React + Node + TS).

Mục tiêu:

* **Auth token**: login + attach token trong API + Socket.
* **RTK Query + cache invalidation + optimistic update**.
* **Realtime Socket.IO updates**.
* **Redux Toolkit + AsyncThunk**.
* **Jest Integration Test** cho toàn bộ flow.

---

# 🟢 Backend — Node + Express + Socket.IO + Auth

```ts
// server/src/index.ts
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "SECRET_KEY";
let tasks = [
  { id: 1, title: "First Task", completed: false },
  { id: 2, title: "Second Task", completed: true },
];

interface User { username: string; password: string; }
const users: User[] = [{ username: "admin", password: "123" }];

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Auth middleware
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Tasks CRUD
app.get("/tasks", (req, res) => res.json(tasks));
app.post("/tasks", (req, res) => {
  const { title } = req.body;
  const newTask = { id: tasks.length + 1, title, completed: false };
  tasks.push(newTask);
  io.emit("taskAdded", newTask);
  res.json(newTask);
});
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  Object.assign(task, req.body);
  io.emit("taskUpdated", task);
  res.json(task);
});
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  io.emit("taskDeleted", id);
  res.json({ id });
});

// Socket.IO with auth
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("No token"));
  try {
    jwt.verify(token, SECRET);
    next();
  } catch { next(new Error("Invalid token")); }
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
});

server.listen(4000, () => console.log("Server + Socket running on 4000"));
```

---

# 🟢 Frontend — RTK Query + Redux Toolkit + Socket + Auth

```ts
// services/tasksApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

export interface Task { id: number; title: string; completed: boolean; }

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if(token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Tasks"],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => "/tasks",
      providesTags: ["Tasks"],
    }),
    addTask: builder.mutation<Task, Partial<Task>>({
      query: (body) => ({ url: "/tasks", method: "POST", body }),
      invalidatesTags: ["Tasks"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData("getTasks", undefined, draft => draft.push({ id: Date.now(), title: arg.title!, completed: false }))
        );
        try { await queryFulfilled; } catch { patchResult.undo(); }
      },
    }),
    updateTask: builder.mutation<Task, Partial<Task> & { id: number }>({
      query: ({ id, ...body }) => ({ url: `/tasks/${id}`, method: "PUT", body }),
      invalidatesTags: ["Tasks"],
    }),
    deleteTask: builder.mutation<{ id: number }, number>({
      query: (id) => ({ url: `/tasks/${id}`, method: "DELETE" }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const { useGetTasksQuery, useAddTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksApi;
```

```ts
// features/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface AuthState { token: string | null; loading: boolean; error: string | null; }
const initialState: AuthState = { token: null, loading: false, error: null };

export const login = createAsyncThunk("auth/login", async ({username,password}: {username:string,password:string}) => {
  const res = await fetch("http://localhost:4000/login", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({username,password}) });
  if(!res.ok) throw new Error("Invalid credentials");
  const data = await res.json();
  return data.token;
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
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
```

---

# 🟢 Socket Hook with Auth

```ts
// hooks/useSocket.ts
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { Task } from "../services/tasksApi";
import type { RootState } from "../store";
import { useSelector } from "react-redux";

let socket: Socket;

export const useSocket = (onTaskAdded: (task: Task)=>void, onTaskUpdated: (task: Task)=>void, onTaskDeleted: (id:number)=>void) => {
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if(!token) return;
    socket = io("http://localhost:4000", { auth: { token } });

    socket.on("taskAdded", onTaskAdded);
    socket.on("taskUpdated", onTaskUpdated);
    socket.on("taskDeleted", onTaskDeleted);

    return () => { socket.disconnect(); };
  }, [token]);

  return {
    emitAddTask: (task: Partial<Task>) => socket.emit("addTask", task),
    emitUpdateTask: (task: Partial<Task> & { id: number }) => socket.emit("updateTask", task),
    emitDeleteTask: (id:number) => socket.emit("deleteTask", id),
  };
};
```

---

# 🟢 App Component — Full Enterprise

```tsx
// App.tsx
import React, { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, AppDispatch, RootState } from "./store";
import { login } from "./features/authSlice";
import { TaskListRealtime } from "./components/TaskListRealtime";

const AppInner = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const [username,setUsername] = useState("admin");
  const [password,setPassword] = useState("123");

  useEffect(() => { dispatch(login({username,password})); }, [dispatch]);

  if(auth.loading) return <p>Logging in...</p>;
  if(auth.error) return <p>{auth.error}</p>;
  if(!auth.token) return <p>No token</p>;

  return <TaskListRealtime />;
};

export const App = () => (
  <Provider store={store}>
    <AppInner />
  </Provider>
);
```

---

# 🟢 Jest Integration Test — Enterprise Flow

```ts
// App.enterprise.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { App } from "./App";
import { store } from "./store";
import * as tasksApi from "./services/tasksApi";
import * as authSlice from "./features/authSlice";

jest.mock("./services/tasksApi");
jest.mock("./features/authSlice");

describe("Enterprise Fullstack Test", () => {
  beforeEach(() => {
    (authSlice.login as jest.Mock).mockImplementation(() => ({ type: "auth/login/fulfilled", payload: "FAKE_TOKEN" }));
    (tasksApi.useGetTasksQuery as jest.Mock).mockReturnValue({ data: [{id:1,title:"Task 1",completed:false}], isLoading:false });
    (tasksApi.useAddTaskMutation as jest.Mock).mockReturnValue([jest.fn(() => Promise.resolve({id:2,title:"New Task",completed:false}))]);
  });

  test("login + fetch tasks + add task + socket flow", async () => {
    render(<App />);
    await waitFor(() => expect(screen.queryByText(/Logging in/i)).not.toBeInTheDocument());
    expect(screen.getByText("Task 1")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Add Task"));
    await waitFor(() => expect(tasksApi.useAddTaskMutation).toHaveBeenCalled());
  });
});
```

---

# ✅ Highlights

1. **Full-stack integration**: Auth → API → RTK Query → Socket → UI.
2. **Optimistic update** + rollback.
3. **Cache invalidation** via tagTypes.
4. **Auth token injection** for API & Socket.
5. **Testable enterprise flow**.
6. **Interview-ready**: mô phỏng project management / collaborative dashboard.

---


# 🟢 Coding Challenge: Task Management Enterprise
**Coding Challenge / Interview Simulation** dựa trên Mini Project 2 (React + Node + TS + RTK Query + Socket + Auth) với **full-stack senior-level**.
## 🔹 Scenario

Bạn là **front-end & fullstack engineer** trong dự án quản lý tasks công ty:

* Backend: Node + Express + Socket.IO, REST API + Auth token.
* Frontend: React + TypeScript + Redux Toolkit + RTK Query.
* Realtime: Socket.IO thông báo task mới / update / delete.
* Caching: RTK Query + tagTypes + optimistic update.
* Goal: build **robust, testable, enterprise-grade task dashboard**.

---

## 🔹 Requirements

### Backend

1. **Login endpoint**: `POST /login` → trả token JWT.
2. **Task endpoints**:

   * `GET /tasks` → get all tasks.
   * `POST /tasks` → add task, broadcast socket.
   * `PUT /tasks/:id` → update task, broadcast socket.
   * `DELETE /tasks/:id` → delete task, broadcast socket.
3. **Socket.IO auth**: connect chỉ khi có token.
4. **Socket events**: `taskAdded`, `taskUpdated`, `taskDeleted`.

### Frontend

1. **Auth**: login + store token in Redux slice.
2. **Task CRUD**: RTK Query + mutations + caching + optimistic updates.
3. **Realtime updates**: subscribe socket, update UI automatically.
4. **Integration**: component render → login → fetch tasks → add/update/delete → reflect socket updates.
5. **Error handling**: failed mutation → rollback optimistic UI.

### Testing

1. **Unit test**: auth slice + task slice.
2. **AsyncThunk test**: login + fetch tasks.
3. **Integration test**: component renders + socket updates + mutation + optimistic update.
4. **Enterprise test**: full flow login → fetch → add/update/delete → socket + cache invalidation.

---

## 🔹 Tasks / Deliverables

### Level 1 — Unit Test

* Slice: authSlice → login/logout state updates.
* Slice: tasksSlice → optimistic update reducers.

### Level 2 — AsyncThunk Test

* Dispatch login async → assert token stored.
* Fetch tasks async → assert tasks returned.

### Level 3 — Component Integration Test

* Render `<TaskList />` + simulate login → fetch tasks.
* Click add/update/delete → assert UI + state changes.
* Mock socket → assert UI auto-updates.

### Level 4 — Enterprise Flow

* Full integration: login → fetch → mutations → socket events → cache invalidation → optimistic update → rollback.
* Test auth token injected in headers.
* Test multiple simultaneous mutations + socket updates.

---

## 🔹 Evaluation Criteria

1. **Clean, production-ready code** (TypeScript, types, interfaces).
2. **Proper state management** (Redux Toolkit, RTK Query, AsyncThunk).
3. **Optimistic UI + rollback**.
4. **Socket real-time updates**.
5. **Testing coverage**: unit, async, integration, enterprise.
6. **Error handling** + edge cases (network errors, invalid token).
7. **Scalable structure**: modular folder, clear service layer.

---

## 🔹 Bonus / Extra Challenges

1. Add **filter / sort tasks** + pagination.
2. Add **notifications** when a task is updated by other users via socket.
3. **Mock multi-user scenario** in Jest (simulate multiple socket events simultaneously).
4. Implement **token refresh** + expired token auto-login redirect.
5. Add **optimistic update for delete** + rollback.

---

✅ **Outcome:** Khi hoàn thành, bạn sẽ có **full-stack mini project**, **full-test coverage**, và **enterprise-grade patterns** — y hệt phỏng vấn real-world senior-level.

---



# 🟢 Step 0 — Folder Structure

```bash
task-management/
├─ backend/
│  ├─ server.ts
│  ├─ routes/
│  │  └─ tasks.ts
│  ├─ middleware/
│  │  └─ auth.ts
│  └─ models/
│     └─ Task.ts
├─ frontend/
│  ├─ src/
│  │  ├─ App.tsx
│  │  ├─ store.ts
│  │  ├─ features/
│  │  │  ├─ authSlice.ts
│  │  │  └─ tasksSlice.ts
│  │  └─ services/
│  │     └─ tasksApi.ts
│  └─ tests/
│     └─ ...
└─ package.json
```

* Backend: Node + Express + Socket.IO
* Frontend: React + TS + Redux Toolkit + RTK Query + Socket.IO-client
* Testing: Jest + React Testing Library

---

# 🟢 Step 1 — Backend (Node + Express + Socket.IO + JWT)

```ts
// backend/server.ts
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken";
import taskRoutes from "./routes/tasks";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// JWT secret
const SECRET = "FAKE_SECRET";

// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "123") {
    const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Socket auth middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    if (!token) throw new Error("No token");
    jwt.verify(token, SECRET);
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
});

// Task routes
app.use("/tasks", taskRoutes(io));

server.listen(4000, () => console.log("Server running on port 4000"));
```

```ts
// backend/routes/tasks.ts
import { Router } from "express";
import { Server } from "socket.io";

interface Task { id: number; title: string; completed: boolean; }
let tasks: Task[] = [{ id: 1, title: "Initial Task", completed: false }];

export default (io: Server) => {
  const router = Router();

  // GET /tasks
  router.get("/", (_, res) => res.json(tasks));

  // POST /tasks
  router.post("/", (req, res) => {
    const newTask: Task = { id: Date.now(), ...req.body };
    tasks.push(newTask);
    io.emit("taskAdded", newTask);
    res.json(newTask);
  });

  // PUT /tasks/:id
  router.put("/:id", (req, res) => {
    const id = Number(req.params.id);
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx !== -1) {
      tasks[idx] = { ...tasks[idx], ...req.body };
      io.emit("taskUpdated", tasks[idx]);
      res.json(tasks[idx]);
    } else res.status(404).json({ message: "Task not found" });
  });

  // DELETE /tasks/:id
  router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    tasks = tasks.filter((t) => t.id !== id);
    io.emit("taskDeleted", id);
    res.json({ success: true });
  });

  return router;
};
```

✅ **Backend ready** — REST API + JWT Auth + Socket.IO events.

---

# 🟢 Step 2 — Frontend: Store + Slices + RTK Query

```ts
// frontend/src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import { tasksApi } from "./services/tasksApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(tasksApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```ts
// frontend/src/features/authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface AuthState { token: string | null; loading: boolean; error: string | null; }
const initialState: AuthState = { token: null, loading: false, error: null };

export const login = createAsyncThunk("auth/login", async ({ username, password }: { username: string; password: string }) => {
  const res = await fetch("http://localhost:4000/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
  if (!res.ok) throw new Error("Login failed");
  const data = await res.json();
  return data.token;
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
// frontend/src/services/tasksApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

export interface Task { id: number; title: string; completed: boolean; }

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    }
  }),
  tagTypes: ["Tasks"],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => "/tasks",
      providesTags: ["Tasks"],
    }),
    addTask: builder.mutation<Task, Partial<Task>>({
      query: (body) => ({ url: "/tasks", method: "POST", body }),
      invalidatesTags: ["Tasks"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData("getTasks", undefined, (draft) => { draft.push({ id: Date.now(), title: arg.title!, completed: false }); })
        );
        try { await queryFulfilled; } catch { patchResult.undo(); }
      },
    }),
    updateTask: builder.mutation<Task, Task>({
      query: ({ id, ...body }) => ({ url: `/tasks/${id}`, method: "PUT", body }),
      invalidatesTags: ["Tasks"],
    }),
    deleteTask: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `/tasks/${id}`, method: "DELETE" }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const { useGetTasksQuery, useAddTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksApi;
```

✅ **Frontend Redux + RTK Query ready**.

---

# 🟢 Step 3 — Frontend Component + Socket Integration

```tsx
// frontend/src/App.tsx
import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, AppDispatch, RootState } from "./store";
import { login } from "./features/authSlice";
import { useGetTasksQuery, useAddTaskMutation } from "./services/tasksApi";
import { io } from "socket.io-client";

const Tasks = () => {
  const { data: tasks, isLoading } = useGetTasksQuery();
  const [addTask] = useAddTaskMutation();
  const token = useSelector((state: RootState) => state.auth.token);

  // Socket subscription
  useEffect(() => {
    if (!token) return;
    const socket = io("http://localhost:4000", { auth: { token } });
    socket.on("taskAdded", (task) => console.log("Socket taskAdded", task));
    socket.on("taskUpdated", (task) => console.log("Socket taskUpdated", task));
    socket.on("taskDeleted", (id) => console.log("Socket taskDeleted", id));
    return () => { socket.disconnect(); };
  }, [token]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      {tasks?.map(t => <p key={t.id}>{t.title}</p>)}
      <button onClick={() => addTask({ title: "New Task" })}>Add Task</button>
    </div>
  );
};

export const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => { dispatch(login({ username: "admin", password: "123" })); }, [dispatch]);

  if (auth.loading) return <p>Logging in...</p>;
  if (auth.error) return <p>{auth.error}</p>;

  return <Tasks />;
};

export const RootApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);
```

---

# ✅ Step 4 — Testing Setup

1. **Unit tests**: authSlice + optimistic update reducers.
2. **AsyncThunk tests**: login + fetch tasks.
3. **Integration tests**: component + RTK Query + socket simulation.
4. **Enterprise test**: full auth → fetch → mutation → socket → cache invalidation → rollback.

---
## Full Jest test suite
Chúng ta sẽ viết **full Jest test suite Level 1 → 4** cho **Mini Project 2 — Task Management**. Code sẽ bao gồm **unit test, asyncThunk test, integration test component + RTK Query + Socket + optimistic update**.

---

# 🟢 Step 1 — Level 1: Unit Test Reducer

```ts
// frontend/tests/authSlice.test.ts
import authReducer, { login, logout } from "../features/authSlice";

describe("authSlice unit tests", () => {
  const initialState = { token: null, loading: false, error: null };

  test("should handle initial state", () => {
    expect(authReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  test("logout should clear token", () => {
    const state = { ...initialState, token: "FAKE_TOKEN" };
    const newState = authReducer(state, logout());
    expect(newState.token).toBeNull();
  });
});
```

✅ Test **pure reducer logic**.

---

# 🟢 Step 2 — Level 2: AsyncThunk Test (Login + Fetch Tasks)

```ts
// frontend/tests/authAsync.test.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { login } from "../features/authSlice";

global.fetch = jest.fn();

describe("authSlice asyncThunk", () => {
  const store = configureStore({ reducer: { auth: authReducer } });

  beforeEach(() => { jest.resetAllMocks(); });

  test("login success", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ token: "FAKE_TOKEN" }),
    });

    const result = await store.dispatch(login({ username: "admin", password: "123" }));
    const state = store.getState().auth;

    expect(result.payload).toBe("FAKE_TOKEN");
    expect(state.token).toBe("FAKE_TOKEN");
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  test("login failure", async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: false });
    const result = await store.dispatch(login({ username: "wrong", password: "123" }));
    const state = store.getState().auth;

    expect(result.type).toBe("auth/login/rejected");
    expect(state.token).toBeNull();
    expect(state.error).toBeDefined();
  });
});
```

✅ Test **asyncThunk behavior**, success & failure.

---

# 🟢 Step 3 — Level 3: Component + RTK Query Integration

```ts
// frontend/tests/Tasks.integration.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../store";
import { App } from "../App";
import * as tasksApi from "../services/tasksApi";
import * as authSlice from "../features/authSlice";

jest.mock("../services/tasksApi");
jest.mock("../features/authSlice");

describe("Tasks Component Integration", () => {
  beforeEach(() => {
    (authSlice.login as jest.Mock).mockImplementation(() => ({ type: "auth/login/fulfilled", payload: "FAKE_TOKEN" }));
    (tasksApi.useGetTasksQuery as jest.Mock).mockReturnValue({ data: [{ id: 1, title: "Task 1", completed: false }], isLoading: false });
    (tasksApi.useAddTaskMutation as jest.Mock).mockReturnValue([jest.fn(() => Promise.resolve({ id: 2, title: "New Task", completed: false }))]);
  });

  test("renders tasks and add new task", async () => {
    render(<Provider store={store}><App /></Provider>);

    expect(await screen.findByText("Task 1")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Add Task"));

    await waitFor(() => {
      expect(tasksApi.useAddTaskMutation()[0]).toHaveBeenCalledWith({ title: "New Task" });
    });
  });
});
```

✅ Test **component + async mutation + RTK Query integration**.

---

# 🟢 Step 4 — Level 4: Enterprise Integration (Socket + Optimistic Update + Cache Invalidation)

```ts
// frontend/tests/Tasks.enterprise.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../store";
import { App } from "../App";
import * as tasksApi from "../services/tasksApi";
import { io } from "socket.io-client";

jest.mock("../services/tasksApi");
jest.mock("socket.io-client");

describe("Enterprise Tasks Flow", () => {
  let mockAddTask: jest.Mock;
  let mockSocketOn: jest.Mock;

  beforeEach(() => {
    mockAddTask = jest.fn(() => Promise.resolve({ id: 2, title: "Optimistic Task", completed: false }));
    (tasksApi.useAddTaskMutation as jest.Mock).mockReturnValue([mockAddTask]);
    (tasksApi.useGetTasksQuery as jest.Mock).mockReturnValue({ data: [{ id: 1, title: "Task 1", completed: false }], isLoading: false });

    mockSocketOn = jest.fn();
    (io as jest.Mock).mockReturnValue({ on: mockSocketOn, disconnect: jest.fn() });
  });

  test("optimistic update + rollback + socket", async () => {
    render(<Provider store={store}><App /></Provider>);

    // Initial render
    expect(screen.getByText("Task 1")).toBeInTheDocument();

    // Add task optimistically
    fireEvent.click(screen.getByText("Add Task"));
    expect(screen.getByText("Optimistic Task")).toBeInTheDocument();

    await waitFor(() => expect(mockAddTask).toHaveBeenCalled());

    // Simulate socket update
    const socketCallback = mockSocketOn.mock.calls.find(c => c[0] === "taskAdded")[1];
    socketCallback({ id: 3, title: "Socket Task", completed: false });

    // New socket task rendered
    expect(await screen.findByText("Socket Task")).toBeInTheDocument();
  });

  test("rollback on mutation failure", async () => {
    mockAddTask.mockImplementationOnce(() => Promise.reject("Network Error"));

    render(<Provider store={store}><App /></Provider>);

    fireEvent.click(screen.getByText("Add Task"));
    expect(screen.getByText("Optimistic Task")).toBeInTheDocument();

    await waitFor(() => expect(mockAddTask).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByText("Optimistic Task")).not.toBeInTheDocument());
  });
});
```

✅ Enterprise test includes:

1. **Optimistic UI update**
2. **Rollback if mutation fails**
3. **Socket events** simulation
4. **Cache invalidation** via RTK Query

---

# ✅ Summary

* **Level 1:** Unit test reducer slice
* **Level 2:** AsyncThunk login + fetch tasks
* **Level 3:** Component integration with RTK Query mutation
* **Level 4:** Enterprise-grade integration including optimistic update, rollback, socket, cache invalidation

---

📌 [<< Ngày 28](./Day28.md) | [Ngày 30 >>](./Day30.md)