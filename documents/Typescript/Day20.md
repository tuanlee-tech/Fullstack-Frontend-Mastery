# 📘 Day 20 — Mini Project 1: Todo App (Node + TypeScript)

## 1️⃣ Mục tiêu

* Tạo backend Todo API với Node + TS.
* Type-safe toàn bộ.
* Sử dụng **Result Pattern**, **custom types**, **middleware**.
* Có thể mở rộng cho enterprise (validation, logging, error handling).

---

## 2️⃣ Cấu trúc dự án

```
/todo-app
  ├─ src/
  │   ├─ types/
  │   │   └─ todo.d.ts
  │   ├─ services/
  │   │   └─ todoService.ts
  │   ├─ controllers/
  │   │   └─ todoController.ts
  │   ├─ middleware/
  │   │   └─ errorHandler.ts
  │   └─ app.ts
  └─ package.json
```

---

## 3️⃣ Type định nghĩa

```ts
// src/types/todo.d.ts
export interface Todo {
  id: string;       // UUID
  title: string;
  completed: boolean;
}

export type Result<T, E> = 
  | { ok: true; value: T }
  | { ok: false; error: E };
```

---

## 4️⃣ Service Layer (business logic)

```ts
// src/services/todoService.ts
import { Todo, Result } from "../types/todo";
import { v4 as uuidv4 } from "uuid";

// In-memory store (demo)
const todos: Todo[] = [];

export function createTodo(title: string): Result<Todo, string> {
  if (!title) return { ok: false, error: "TITLE_REQUIRED" };

  const todo: Todo = { id: uuidv4(), title, completed: false };
  todos.push(todo);

  return { ok: true, value: todo };
}

export function getTodos(): Result<Todo[], string> {
  return { ok: true, value: todos };
}

export function toggleTodo(id: string): Result<Todo, string> {
  const todo = todos.find(t => t.id === id);
  if (!todo) return { ok: false, error: "NOT_FOUND" };

  todo.completed = !todo.completed;
  return { ok: true, value: todo };
}
```

**Enterprise use:**

* Business logic tách riêng → dễ test và maintain.
* Kết quả luôn **typed** → controller xử lý an toàn.

---

## 5️⃣ Controller Layer (API routes)

```ts
// src/controllers/todoController.ts
import { Request, Response, NextFunction } from "express";
import * as todoService from "../services/todoService";

export function createTodoController(req: Request, res: Response, next: NextFunction) {
  try {
    const { title } = req.body;
    const result = todoService.createTodo(title);

    if (result.ok) return res.status(201).json(result.value);
    return res.status(400).json({ error: result.error });
  } catch (err) {
    next(err);
  }
}

export function getTodosController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = todoService.getTodos();
    return res.json(result.value);
  } catch (err) {
    next(err);
  }
}

export function toggleTodoController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const result = todoService.toggleTodo(id);

    if (result.ok) return res.json(result.value);
    return res.status(404).json({ error: result.error });
  } catch (err) {
    next(err);
  }
}
```

---

## 6️⃣ Middleware xử lý lỗi

```ts
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error("🔥 Error:", err.message);
  res.status(500).json({ status: "error", message: err.message });
}
```

---

## 7️⃣ App setup

```ts
// src/app.ts
import express from "express";
import bodyParser from "body-parser";
import { createTodoController, getTodosController, toggleTodoController } from "./controllers/todoController";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
app.use(bodyParser.json());

// Routes
app.post("/todos", createTodoController);
app.get("/todos", getTodosController);
app.patch("/todos/:id/toggle", toggleTodoController);

// Middleware error
app.use(errorHandler);

app.listen(3000, () => console.log("🚀 Todo App running on http://localhost:3000"));
```

---

## 8️⃣ Test bằng Postman / curl

1. **Tạo Todo**

```bash
POST http://localhost:3000/todos
Body: { "title": "Learn TypeScript" }
```

2. **Lấy danh sách Todos**

```bash
GET http://localhost:3000/todos
```

3. **Toggle Todo**

```bash
PATCH http://localhost:3000/todos/<id>/toggle
```

---

## ✅ Enterprise lessons

* **Layered architecture:** Controller → Service → Types.
* **Type-safe everywhere:** sử dụng `Result<T, E>` pattern.
* **Error handling middleware:** global error handling.
* **Testable & maintainable:** logic riêng biệt, dễ unit test.
* **In-memory DB demo → có thể thay bằng MongoDB/Postgres** mà không thay controller/service.

---
[<< Ngày 19](./Day19.md) | [Ngày 21 >>](./Day21.md)