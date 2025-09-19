# Ngày 29: Mini Project 2 - Dashboard Quản Lý Nhiệm Vụ Fullstack Realtime

Chào bạn! Trong hướng dẫn này, chúng ta sẽ xây dựng một dự án nhỏ (mini project) để thực hành kỹ năng fullstack với công nghệ hiện đại. Dự án gốc từ chuỗi bài học sử dụng ví dụ về **Auth + Posts CRUD**, nhưng để tránh lặp lại và luyện tập các kỹ năng nâng cao hơn (phù hợp cho phỏng vấn senior hoặc sản phẩm thực tế), chúng ta sẽ thay đổi chủ đề thành **Team Tasks Dashboard** - một ứng dụng quản lý nhiệm vụ nhóm với tính năng realtime.

Tôi sẽ viết lại toàn bộ nội dung một cách logic, bắt đầu từ giới thiệu, gợi ý thay đổi, mô tả dự án, công nghệ sử dụng, sau đó là hướng dẫn từng cấp độ (levels) với code chi tiết, giải thích dễ hiểu. Mỗi phần sẽ được giải thích rõ ràng, kèm ví dụ code và lý do sử dụng. Cuối cùng là phần phỏng vấn, thử thách coding và testing.

---

## Lý Do Nên Thay Đổi Chủ Đề Dự Án

Trong các ngày trước (Day 27, Day 28), chúng ta đã dùng ví dụ **Auth + Posts CRUD** nhiều lần, nên nếu giữ nguyên sẽ hơi nhàm chán và lặp lại. Để luyện tập tốt hơn cho phỏng vấn senior hoặc xây dựng sản phẩm thực tế (production-ready), hãy chọn chủ đề phức tạp hơn. Các chủ đề này sẽ bao gồm các patterns thường gặp như: cập nhật optimistic (optimistic update), xử lý realtime, caching, quyền truy cập dựa trên vai trò (RBAC), và nhiều hơn nữa.

### Bảng Gợi Ý Chủ Đề Thay Thế
Dưới đây là một số ý tưởng thay thế, với mức độ phức tạp và lợi ích cho phỏng vấn:

| Chủ đề                                     | Mức độ phức tạp | Lợi ích cho phỏng vấn / Sản phẩm thực tế                                                                 |
| ------------------------------------------ | --------------- | --------------------------------------------------------------------------------------------------------- |
| **Feature Flags + AB Testing**             | Trung bình → Cao | Quản lý tính năng động, bật/tắt theo người dùng, kiểm tra luồng async (thường dùng trong sản phẩm lớn).  |
| **Realtime Chat / Notifications**          | Cao             | Sử dụng WebSocket/Socket.io, cập nhật state Redux, UI optimistic, throttling (giảm tải), caching.        |
| **Shopping Cart + Inventory**              | Trung bình → Cao | Redux + RTK Query + Saga + Optimistic Update + kiểm tra hàng tồn kho, xử lý cập nhật đồng thời.          |
| **Admin Dashboard + Role-based Access**    | Cao             | Auth + RBAC + dữ liệu từ nhiều endpoint + caching + rendering điều kiện.                                 |
| **Complex Form Builder / Multi-step Form** | Trung bình → Cao | Redux Form / React Hook Form + validation async + trường động + undo/redo + lưu draft caching.           |
| **Analytics / Metrics Stream**             | Cao             | Fetch + tổng hợp dữ liệu + cập nhật biểu đồ realtime + debounce + cache + phân trang.                    |

### Lý Do Nên Thay Đổi
- **Luyện patterns phức tạp**: Như optimistic update (cập nhật UI trước khi server xác nhận để UX mượt mà), multi-API (kết hợp nhiều endpoint), concurrent state (xử lý trạng thái đồng thời), realtime (cập nhật thời gian thực), RBAC (quyền truy cập dựa trên vai trò).
- **Phù hợp phỏng vấn senior**: Các chủ đề này giống với coding challenge thực tế, giúp bạn nổi bật khi ứng tuyển vị trí cao cấp.

Trong hướng dẫn này, chúng ta chọn **Team Tasks Dashboard** làm chủ đề chính, vì nó kết hợp nhiều patterns trên.

---

## Mô Tả Dự Án: Team Tasks Dashboard

**Tên dự án tạm thời**: Team Tasks Dashboard.

**Mô tả tổng quát**: Đây là ứng dụng quản lý nhiệm vụ (tasks) cho nhóm làm việc. Người dùng có thể đăng nhập, tạo/sửa/xóa nhiệm vụ, và thấy cập nhật realtime từ người khác. Dự án bao gồm backend (Node.js) và frontend (React), với tính năng nâng cao để luyện phỏng vấn.

### Các Tính Năng Chính (Features)
- **Auth + Role-based Access (RBAC)**: Đăng nhập và phân quyền (Admin có thể quản lý tất cả, Member chỉ xem/cập nhật nhiệm vụ của mình).
- **Task CRUD**: Tạo (Create), Đọc (Read), Cập nhật (Update), Xóa (Delete) nhiệm vụ.
- **Realtime Updates**: Sử dụng WebSocket/Socket.io để cập nhật nhiệm vụ thời gian thực (khi ai đó thay đổi, tất cả người dùng thấy ngay).
- **Notifications**: Thông báo khi nhiệm vụ được tạo hoặc cập nhật.
- **Optimistic Update**: Cập nhật UI ngay lập tức để UX mượt, rollback nếu server lỗi.
- **Caching + Invalidation**: Sử dụng RTK Query để lưu cache dữ liệu và tự động làm mới khi thay đổi.
- **Server-side**: Node + Express + TypeScript.
- **Frontend**: React + TypeScript + Redux Toolkit + RTK Query + Redux-Saga.

### Bảng Tính Năng Nâng Cao (Senior-level / Interview-ready)
| Tính năng               | Patterns & Kỹ Năng Sử Dụng                           |
| ----------------------- | ---------------------------------------------------- |
| Auth + RBAC             | AsyncThunk, auth dựa trên token, protected routes.   |
| Task CRUD               | RTK Query + cache invalidation + optimistic update.  |
| Realtime updates        | WebSocket / Redux-Saga xử lý sự kiện.                |
| Notifications           | Redux slice + Saga / RTK Query subscription.         |
| Task filtering / search | Derived state, selector memoization (tối ưu hóa).    |
| Error handling          | Global API error interceptor, retry logic.           |
| Testing                 | Jest unit + integration, mock WebSocket.             |

### Lợi Ích Của Dự Án
- **Fullstack interview scenario**: Bao quát từ backend đến frontend, giống phỏng vấn thực tế.
- **Luyện senior patterns**: Xử lý async, caching, optimistic UI, realtime, RBAC.
- **Enterprise-like flow**: Giống hệ thống lớn như CMS hoặc tool quản lý dự án (ví dụ: Trello, Asana).

---

## Các Cấp Độ Gợi Ý (Suggested Levels)
Dự án được chia thành 4 cấp độ, từ cơ bản đến nâng cao. Bạn có thể bắt đầu từ Level 1 và dần dần thêm tính năng.

| Cấp Độ  | Mục Tiêu Chính                                                                     |
| ------- | ---------------------------------------------------------------------------------- |
| Level 1 | Auth cơ bản + Danh sách nhiệm vụ đơn giản (fetch & display).                       |
| Level 2 | Task CRUD + RTK Query + Cache invalidation (làm mới cache tự động).                |
| Level 3 | Realtime updates qua WebSocket + Optimistic updates.                               |
| Level 4 | RBAC, notifications, integration testing (Jest + RTL), patterns enterprise.        |

---

## Công Nghệ Sử Dụng (Tech Stack)
**Backend**: Node.js + Express + TypeScript.
- REST API endpoints.
- WebSocket qua Socket.io.
- JWT cho auth.
- Database mock (in-memory) hoặc SQLite/JSON file đơn giản.

**Frontend**: React + TypeScript.
- Redux Toolkit + RTK Query (quản lý state và API).
- Redux-Saga (tùy chọn, cho side effects phức tạp như notifications).
- React Hook Form (cho form tạo/sửa nhiệm vụ).
- React Testing Library + Jest (cho testing).

---

## Hướng Dẫn Xây Dựng Từng Cấp Độ

Bây giờ, chúng ta đi vào chi tiết code. Tôi sẽ giải thích từng bước, lý do sử dụng, và code mẫu. Giả sử bạn đã cài đặt các package cần thiết (express, socket.io, jsonwebtoken cho backend; react, redux-toolkit, @reduxjs/toolkit/query/react, socket.io-client cho frontend).

### Cấu Trúc Thư Mục Gợi Ý (Folder Structure)
Trước khi code, hãy tổ chức thư mục để dễ quản lý:

```
task-management/
├─ backend/
│  ├─ server.ts (file chính)
│  ├─ routes/
│  │  └─ tasks.ts (routes cho tasks)
│  ├─ middleware/
│  │  └─ auth.ts (middleware auth)
│  └─ models/
│     └─ Task.ts (interface Task)
├─ frontend/
│  ├─ src/
│  │  ├─ App.tsx (component chính)
│  │  ├─ store.ts (Redux store)
│  │  ├─ features/
│  │  │  ├─ authSlice.ts (slice auth)
│  │  │  └─ tasksSlice.ts (slice tasks nếu cần)
│  │  └─ services/
│  │     └─ tasksApi.ts (RTK Query API)
│  └─ tests/
│     └─ ... (các file test)
└─ package.json
```

### Level 1: Auth Cơ Bản + Danh Sách Nhiệm Vụ (Basic)
Mục tiêu: Xây dựng backend với auth đơn giản và endpoint lấy danh sách tasks. Frontend: Form login và hiển thị token.

#### Backend (Node + Express + TS)
Code này tạo server với endpoint login và get tasks (protected bằng token).

```ts
// backend/server.ts
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import http from "http";
import { Server } from "socket.io"; // Chuẩn bị cho realtime sau

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } }); // Socket.io sẵn sàng

app.use(cors());
app.use(express.json());

const SECRET = "SECRET_KEY";

// Mock DB
let users = [{ id: 1, username: "admin", password: "123", role: "admin" }];
let tasks = [{ id: 1, title: "First Task", completed: false }];

// Endpoint login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Middleware auth
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });
  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Endpoint get tasks (protected)
app.get("/tasks", authMiddleware, (req, res) => res.json(tasks));

server.listen(4000, () => console.log("Server running on port 4000"));
```

**Giải thích**: 
- Sử dụng JWT để tạo token khi login thành công.
- Middleware auth kiểm tra token cho các endpoint protected.
- Mock DB (mảng users/tasks) để đơn giản, không cần database thật.

#### Frontend (React + RTK Query)
Tạo API slice cho auth và component Login.

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
    try {
      const res = await login({ username, password }).unwrap();
      setToken(res.token);
    } catch (err) {
      console.error("Login failed", err);
    }
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

**Giải thích**: 
- Sử dụng RTK Query để gọi API login (mutation vì là POST).
- Component Login xử lý form và hiển thị token khi thành công.
- Level 1 hoàn tất: Bạn có thể login và thấy token.

### Level 2: Task CRUD + RTK Query + Cache Invalidation
Mục tiêu: Thêm CRUD cho tasks ở backend. Frontend sử dụng RTK Query để fetch/add/update/delete, với cache tự động làm mới.

#### Backend (Cập Nhật CRUD)
Thêm endpoints POST/PUT/DELETE cho tasks.

```ts
// backend/server.ts (tiếp nối Level 1)
// ... code trước đó ...

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
```

**Giải thích**: 
- Tất cả endpoints CRUD đều protected bằng authMiddleware.
- Khi thêm/sửa/xóa, cập nhật mock DB và trả response.

#### Frontend (RTK Query cho Tasks)
Tạo API slice cho tasks, tích hợp token từ state.

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
// frontend/src/App.tsx (cập nhật)
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

**Giải thích**: 
- RTK Query tự động fetch data với `useGetTasksQuery`.
- Mutation (add/update/delete) sử dụng `invalidatesTags` để tự động làm mới cache (refetch getTasks).
- Component TaskList xử lý form thêm task và hiển thị list với checkbox/update/delete.
- Level 2 hoàn tất: CRUD đầy đủ, UI cập nhật tự động mà không cần reload.

### Level 3: Realtime Updates Qua WebSocket + Optimistic UI
Mục tiêu: Thêm Socket.io để broadcast thay đổi realtime. Frontend cập nhật cache RTK Query qua socket.

#### Backend (Thêm Socket.io)
Cập nhật server để broadcast events khi CRUD.

```ts
// backend/server.ts (tiếp nối)
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("addTask", (task) => {
    const newTask = { id: tasks.length + 1, ...task };
    tasks.push(newTask);
    io.emit("taskAdded", newTask); // Broadcast to all
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
```

**Giải thích**: 
- Khi client emit event (add/update/delete), server cập nhật DB và broadcast đến tất cả client khác qua io.emit.

#### Frontend (Hook Socket + Optimistic Update)
Tạo hook dùng Socket.io, cập nhật cache RTK Query.

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
import React, { useState } from "react";
import { useGetTasksQuery } from "../services/tasksApi";
import { useSocket } from "../hooks/useSocket";
import { useDispatch } from "react-redux";
import { tasksApi } from "../services/tasksApi";

export const TaskListRealtime = () => {
  const { data: tasks = [], isLoading } = useGetTasksQuery();
  const dispatch = useDispatch();
  const [newTitle, setNewTitle] = useState("");

  // Socket integration with optimistic update
  const { emitAddTask, emitUpdateTask, emitDeleteTask } = useSocket(
    (task) => dispatch(tasksApi.util.updateQueryData("getTasks", undefined, (draft) => { draft.push(task); })),
    (task) => dispatch(tasksApi.util.updateQueryData("getTasks", undefined, (draft) => {
      const idx = draft.findIndex(t => t.id === task.id);
      if (idx !== -1) draft[idx] = task;
    })),
    (id) => dispatch(tasksApi.util.updateQueryData("getTasks", undefined, (draft) => draft.filter(t => t.id !== id)))
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

**Giải thích**: 
- Hook useSocket kết nối socket và lắng nghe events từ server, cập nhật cache RTK Query trực tiếp (updateQueryData).
- Optimistic update: Thêm task tạm vào UI trước khi emit, để UX nhanh. Nếu server lỗi, có thể rollback (mở rộng ở Level 4).
- Level 3 hoàn tất: Realtime - Khi một client thay đổi, tất cả thấy ngay.

### Level 4: Full Enterprise Integration (RBAC, Notifications, Testing)
Mục tiêu: Thêm RBAC, auth cho socket, optimistic với rollback, và testing đầy đủ.

#### Backend (Auth Cho Socket + RBAC)
Cập nhật để socket yêu cầu token, và thêm RBAC (ví dụ: chỉ admin delete task).

```ts
// backend/server.ts (cập nhật)
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("No token"));
  try {
    jwt.verify(token, SECRET);
    next();
  } catch { next(new Error("Invalid token")); }
});

// Trong routes, thêm kiểm tra role nếu cần (ví dụ cho delete)
app.delete("/tasks/:id", authMiddleware, (req, res) => {
  const user = (req as any).user;
  if (user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  // ... code delete ...
});
```

**Giải thích**: 
- Socket.io use middleware để kiểm tra token khi connect.
- RBAC: Kiểm tra role từ token để hạn chế quyền (ví dụ: Member không delete).

#### Frontend (Auth Slice + Socket Với Token + Optimistic Rollback)
Thêm authSlice với AsyncThunk cho login, và tích hợp token vào socket.

```ts
// frontend/src/features/authSlice.ts
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

```ts
// frontend/src/hooks/useSocket.ts (cập nhật với token)
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { Task } from "../services/tasksApi";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

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
  }, [token, onTaskAdded, onTaskUpdated, onTaskDeleted]);

  return {
    emitAddTask: (task: Partial<Task>) => socket.emit("addTask", task),
    emitUpdateTask: (task: Partial<Task> & { id: number }) => socket.emit("updateTask", task),
    emitDeleteTask: (id:number) => socket.emit("deleteTask", id),
  };
};
```

```ts
// frontend/src/services/tasksApi.ts (cập nhật optimistic với rollback)
export const tasksApi = createApi({
  // ... endpoints trước ...
  addTask: builder.mutation<Task, Partial<Task>>({
    query: (body) => ({ url: "/tasks", method: "POST", body }),
    invalidatesTags: ["Tasks"],
    async onQueryStarted(arg, { dispatch, queryFulfilled }) {
      const patchResult = dispatch(
        tasksApi.util.updateQueryData("getTasks", undefined, draft => draft.push({ id: Date.now(), title: arg.title!, completed: false }))
      );
      try { await queryFulfilled; } catch { patchResult.undo(); } // Rollback nếu lỗi
    },
  }),
  // ... các mutation khác tương tự nếu cần optimistic
});
```

```tsx
// frontend/src/App.tsx (cập nhật full)
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

  useEffect(() => { dispatch(login({username,password})); }, [dispatch, username, password]);

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

**Giải thích**: 
- AuthSlice sử dụng AsyncThunk cho login async, quản lý state loading/error.
- Socket tích hợp token để auth.
- Optimistic update với rollback: Thêm task tạm, nếu queryFulfilled lỗi thì undo.
- Notifications: Có thể thêm Redux slice riêng để lưu thông báo (ví dụ: khi socket nhận "taskUpdated", dispatch action show notification).
- Level 4 hoàn tất: Full enterprise với RBAC, realtime an toàn, và xử lý lỗi.

---

## Q&A Phong Cách Phỏng Vấn (Interview-style Q&A)
Dưới đây là một số câu hỏi thường gặp trong phỏng vấn senior, kèm câu trả lời dựa trên dự án.

**Q1: Tại sao dùng updateQueryData thay vì refetch sau mutation?**  
**A1**: Refetch tốn thời gian và bandwidth. updateQueryData cập nhật cache trực tiếp, giúp UI nhanh hơn (optimistic), và vẫn giữ tính nhất quán với server.

**Q2: Làm thế nào rollback khi optimistic update fail?**  
**A2**: Trong onQueryStarted của mutation, lưu patchResult từ updateQueryData, và gọi patchResult.undo() nếu queryFulfilled throw error.

**Q3: Socket và RTK Query có xung đột state không?**  
**A3**: Không, vì chúng ta update cache RTK Query trực tiếp qua socket events, nên state luôn đồng bộ giữa local, server, và realtime.

**Q4: Khi nào dùng mutation RTK Query vs emit socket?**  
**A4**: Mutation để gửi thay đổi đến server (CRUD chính), socket để broadcast thay đổi đến các client khác, đảm bảo realtime.

---

## Thử Thách Coding: Task Management Enterprise
Đây là simulation coding challenge cho phỏng vấn fullstack senior.

### Scenario
Bạn là engineer trong dự án quản lý tasks: Xây dựng dashboard robust, testable với realtime, auth, caching.

### Requirements
- **Backend**: Login JWT, CRUD tasks với broadcast socket, socket auth.
- **Frontend**: Auth Redux, CRUD RTK Query với optimistic/rollback, realtime socket updates.
- **Testing**: Unit (slices), async (thunks), integration (components + API), enterprise (full flow với socket/cache).

### Tasks/Deliverables
- Level 1: Unit test reducers (authSlice).
- Level 2: AsyncThunk test (login/fetch).
- Level 3: Integration test component (render + mutation).
- Level 4: Enterprise test (optimistic + rollback + socket simulation).

### Evaluation Criteria
- Code sạch, production-ready (TS types).
- State management đúng (Redux/RTK).
- Optimistic UI + rollback.
- Realtime socket.
- Testing coverage cao (unit/async/integration/enterprise).
- Error handling + edge cases.

### Bonus Challenges
- Thêm filter/sort/pagination cho tasks.
- Notifications khi task updated bởi user khác.
- Mock multi-user trong Jest (simulate nhiều socket events).
- Token refresh + redirect nếu expired.
- Optimistic cho delete + rollback.

**Outcome**: Hoàn thành sẽ có mini project full-test, enterprise-grade, sẵn sàng cho phỏng vấn.

---

## Full Jest Test Suite
Dưới đây là bộ test đầy đủ từ Level 1-4, sử dụng Jest + React Testing Library. Giải thích từng phần.

Tất nhiên rồi. Dưới đây là giải thích chi tiết cho từng dòng code trong bộ test của bạn, có kèm theo comment để bạn dễ hình dung.

-----

### Level 1: Unit Test Reducer

Đây là bài kiểm tra ở cấp độ đơn vị, chỉ tập trung vào logic của reducer mà không phụ thuộc vào Redux store hay các API.

```ts
// frontend/tests/authSlice.test.ts
import authReducer, { login, logout } from "../features/authSlice"; // Import reducer và các action creator cần test

describe("authSlice unit tests", () => { // Bắt đầu một bộ test cho authSlice
  const initialState = { token: null, loading: false, error: null }; // Định nghĩa trạng thái khởi tạo dự kiến

  test("should handle initial state", () => { // Tên của bài test
    // Gọi reducer với trạng thái không xác định (undefined) và một action không liên quan.
    // Reducer phải trả về trạng thái khởi tạo mặc định.
    expect(authReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  test("logout should clear token", () => { // Tên bài test
    // Định nghĩa một trạng thái giả (mock state) có token.
    const state = { ...initialState, token: "FAKE_TOKEN" };
    // Gọi reducer với trạng thái giả và action logout().
    const newState = authReducer(state, logout());
    // Kiểm tra xem token trong trạng thái mới có phải là null không.
    expect(newState.token).toBeNull();
  });
});
```

-----

### Level 2: AsyncThunk Test (Login + Fetch)

Bài test này kiểm tra các tác vụ bất đồng bộ (async) như gọi API và cách reducer xử lý các trạng thái `pending`, `fulfilled`, `rejected`.

```ts
// frontend/tests/authAsync.test.ts
import { configureStore } from "@reduxjs/toolkit"; // Dùng để tạo Redux store giả
import authReducer, { login } from "../features/authSlice";

global.fetch = jest.fn(); // Giả lập (mock) hàm fetch toàn cục để không gọi API thật

describe("authSlice asyncThunk", () => {
  // Tạo một Redux store giả để có thể dispatch asyncThunk
  const store = configureStore({ reducer: { auth: authReducer } });

  beforeEach(() => { jest.resetAllMocks(); }); // Xóa trạng thái của tất cả các mock trước mỗi test

  test("login success", async () => {
    // Giả lập fetch trả về một Promise thành công với dữ liệu token
    (fetch as jest.Mock).mockResolvedValue({
      ok: true, // Phản hồi thành công
      json: async () => ({ token: "FAKE_TOKEN" }), // Dữ liệu trả về
    });

    // Dispatch action login và chờ nó hoàn thành
    const result = await store.dispatch(login({ username: "admin", password: "123" }));
    // Lấy trạng thái mới nhất từ store
    const state = store.getState().auth;

    // Kiểm tra payload của kết quả dispatch có đúng không
    expect(result.payload).toBe("FAKE_TOKEN");
    // Kiểm tra trạng thái trong store đã được cập nhật đúng chưa
    expect(state.token).toBe("FAKE_TOKEN");
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  test("login failure", async () => {
    // Giả lập fetch trả về một Promise thất bại
    (fetch as jest.Mock).mockResolvedValue({ ok: false });
    // Dispatch action login và chờ nó hoàn thành
    const result = await store.dispatch(login({ username: "wrong", password: "123" }));
    // Lấy trạng thái mới nhất
    const state = store.getState().auth;

    // Kiểm tra loại action có phải là "rejected" không
    expect(result.type).toBe("auth/login/rejected");
    // Kiểm tra trạng thái trong store đã được cập nhật đúng chưa
    expect(state.token).toBeNull();
    expect(state.error).toBeDefined();
  });
});
```

-----

### Level 3: Component + RTK Query Integration

Đây là bài test tích hợp, kiểm tra cách một component hoạt động với các hooks của RTK Query.

```ts
// frontend/tests/Tasks.integration.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react"; // Các hàm để render và tương tác với component
import { Provider } from "react-redux"; // Dùng để cung cấp Redux store cho component
import { store } from "../store";
import { App } from "../App";
import * as tasksApi from "../services/tasksApi"; // Import các service API để mock
import * as authSlice from "../features/authSlice";

jest.mock("../services/tasksApi"); // Giả lập toàn bộ module tasksApi
jest.mock("../features/authSlice"); // Giả lập toàn bộ module authSlice

describe("Tasks Component Integration", () => {
  beforeEach(() => {
    // Giả lập hook login để không cần chạy asyncThunk thật
    (authSlice.login as jest.Mock).mockImplementation(() => ({ type: "auth/login/fulfilled", payload: "FAKE_TOKEN" }));
    // Giả lập hook useGetTasksQuery để cung cấp dữ liệu giả
    (tasksApi.useGetTasksQuery as jest.Mock).mockReturnValue({ data: [{ id: 1, title: "Task 1", completed: false }], isLoading: false });
    // Giả lập hook useAddTaskMutation để không gọi API thật
    (tasksApi.useAddTaskMutation as jest.Mock).mockReturnValue([jest.fn(() => Promise.resolve({ id: 2, title: "New Task", completed: false }))]);
  });

  test("renders tasks and add new task", async () => {
    // Render component App với Provider và store
    render(<Provider store={store}><App /></Provider>);

    // Chờ cho Task 1 được render trên màn hình
    expect(await screen.findByText("Task 1")).toBeInTheDocument();

    // Mô phỏng hành động click vào nút "Add Task"
    fireEvent.click(screen.getByText("Add Task"));

    // Chờ cho mock function được gọi
    await waitFor(() => {
      // Kiểm tra xem mock function của mutation có được gọi với đúng tham số không
      expect(tasksApi.useAddTaskMutation()[0]).toHaveBeenCalledWith({ title: "New Task" });
    });
  });
});
```

-----

### Level 4: Enterprise Integration (Socket + Optimistic + Rollback)

Đây là bài kiểm tra phức tạp nhất, mô phỏng một luồng làm việc đầy đủ với cập nhật lạc quan (optimistic updates) và đồng bộ hóa qua Socket.IO.

```ts
// frontend/tests/Tasks.enterprise.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../store";
import { App } from "../App";
import * as tasksApi from "../services/tasksApi";
import { io } from "socket.io-client";

jest.mock("../services/tasksApi"); // Giả lập RTK Query API
jest.mock("socket.io-client"); // Giả lập thư viện Socket.IO

describe("Enterprise Tasks Flow", () => {
  let mockAddTask: jest.Mock; // Biến để giữ tham chiếu đến mock function
  let mockSocketOn: jest.Mock; // Biến để giữ tham chiếu đến mock function 'on'

  beforeEach(() => {
    // Giả lập mutation trả về thành công với dữ liệu
    mockAddTask = jest.fn(() => Promise.resolve({ id: 2, title: "Optimistic Task", completed: false }));
    (tasksApi.useAddTaskMutation as jest.Mock).mockReturnValue([mockAddTask]);
    // Giả lập query ban đầu
    (tasksApi.useGetTasksQuery as jest.Mock).mockReturnValue({ data: [{ id: 1, title: "Task 1", completed: false }], isLoading: false });

    mockSocketOn = jest.fn();
    // Giả lập kết nối socket
    (io as jest.Mock).mockReturnValue({ on: mockSocketOn, disconnect: jest.fn() });
  });

  test("optimistic update + rollback + socket", async () => {
    render(<Provider store={store}><App /></Provider>);

    // Kiểm tra giao diện ban đầu
    expect(screen.getByText("Task 1")).toBeInTheDocument();

    // Kích hoạt hành động thêm task
    fireEvent.click(screen.getByText("Add Task"));
    // Kiểm tra UI đã được cập nhật ngay lập tức với dữ liệu lạc quan
    expect(screen.getByText("Optimistic Task")).toBeInTheDocument();

    // Chờ cho mutation được gọi
    await waitFor(() => expect(mockAddTask).toHaveBeenCalled());

    // Tìm callback của sự kiện "taskAdded" đã được đăng ký trên mock socket
    const socketCallback = mockSocketOn.mock.calls.find(c => c[0] === "taskAdded")[1];
    // Giả lập việc server phát sự kiện với dữ liệu mới
    socketCallback({ id: 3, title: "Socket Task", completed: false });

    // Kiểm tra xem UI đã cập nhật với dữ liệu từ socket hay chưa
    expect(await screen.findByText("Socket Task")).toBeInTheDocument();
  });

  test("rollback on mutation failure", async () => {
    // Giả lập mutation thất bại với lỗi
    mockAddTask.mockImplementationOnce(() => Promise.reject("Network Error"));

    render(<Provider store={store}><App /></Provider>);

    // Kích hoạt thêm task và kiểm tra cập nhật lạc quan
    fireEvent.click(screen.getByText("Add Task"));
    expect(screen.getByText("Optimistic Task")).toBeInTheDocument();

    // Chờ cho mock function được gọi
    await waitFor(() => expect(mockAddTask).toHaveBeenCalled());
    // Chờ cho UI rollback (phần lạc quan biến mất)
    await waitFor(() => expect(screen.queryByText("Optimistic Task")).not.toBeInTheDocument());
  });
});
```
**Giải thích**: Mock socket và mutation, test optimistic (thêm tạm UI), rollback (xóa nếu lỗi), và socket update.

---