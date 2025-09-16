# 📘 Day 25 — API Layer — Fetch/Axios với Generic `ApiResponse<T>`.

### 🔹 Level 1 — Dùng `fetch` với TypeScript cơ bản

```ts
// src/api/fetchUsers.ts

// Định nghĩa type cho User
interface User {
  id: number;
  name: string;
  email: string;
}

// Hàm fetch danh sách user
export async function fetchUsers(): Promise<User[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const data: User[] = await res.json();
  return data;
}

// test
fetchUsers().then(users => {
  console.log(users[0].name); // ✅ type-safe, có gợi ý từ TS
});
```

👉 Ý nghĩa:

* `Promise<User[]>` đảm bảo kết quả trả về luôn là array user.
* Sai type (vd `data: string[]`) → compile error.

---

### 🔹 Level 2 — Tạo Generic `ApiResponse<T>`

```ts
// src/api/types.ts
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

// src/api/http.ts
export async function httpGet<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return { data: null, error: res.statusText, status: res.status };
    }
    const data: T = await res.json();
    return { data, error: null, status: res.status };
  } catch (err: any) {
    return { data: null, error: err.message, status: 500 };
  }
}
```

### Sử dụng

```ts
// src/api/userService.ts
import { httpGet } from "./http";
import { ApiResponse } from "./types";

interface User {
  id: number;
  name: string;
}

export async function getUsers(): Promise<ApiResponse<User[]>> {
  return httpGet<User[]>("https://jsonplaceholder.typicode.com/users");
}

// test
getUsers().then(res => {
  if (res.error) console.error(res.error);
  else console.log(res.data?.[0].name); // ✅ gợi ý User.name
});
```

👉 Ý nghĩa:

* `ApiResponse<T>` giúp chuẩn hóa kết quả (success / error).
* Code dễ maintain khi project có nhiều API.

---

### 🔹 Level 3 — Enterprise Layer + Axios Wrapper

```bash
npm install axios
```

```ts
// src/api/axiosClient.ts
import axios, { AxiosInstance } from "axios";
import { ApiResponse } from "./types";

// Tạo instance chung
const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.API_URL || "https://jsonplaceholder.typicode.com",
  timeout: 5000
});

// Interceptor cho request
axiosClient.interceptors.request.use(config => {
  console.log("Sending request:", config.url);
  // Thêm token nếu có
  const token = process.env.API_TOKEN;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor cho response
axiosClient.interceptors.response.use(
  res => res,
  err => {
    return Promise.reject(err.response || err);
  }
);

export async function apiGet<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const res = await axiosClient.get<T>(url);
    return { data: res.data, error: null, status: res.status };
  } catch (err: any) {
    return {
      data: null,
      error: err?.statusText || err.message,
      status: err?.status || 500
    };
  }
}
```

### Service example

```ts
// src/api/postService.ts
import { apiGet } from "./axiosClient";
import { ApiResponse } from "./types";

interface Post {
  id: number;
  title: string;
}

export async function getPosts(): Promise<ApiResponse<Post[]>> {
  return apiGet<Post[]>("/posts");
}
```

👉 Enterprise lessons:

* Dùng **Axios instance + interceptor** → dễ quản lý token, logging, error handling.
* `ApiResponse<T>` chuẩn hóa dữ liệu → không cần try/catch ở mọi chỗ.
* Scalable cho microservices (UserService, PostService, AuthService…).

---

📌 Tóm lại:

* **Level 1**: fetch cơ bản.
* **Level 2**: chuẩn hóa response với `ApiResponse<T>`.
* **Level 3**: enterprise-ready axios wrapper + interceptor.

---

**Enterprise Mini Project (User + Post Service, gắn vào Express API layer)** demo cách apply trong backend:


### 🏗 Mini Project: User + Post Service (Express + TypeScript)

## 1. Setup Project

```bash
mkdir ts-enterprise-api
cd ts-enterprise-api
npm init -y
npm install express axios
npm install -D typescript ts-node @types/node @types/express
npx tsc --init
```

Trong `tsconfig.json`, bật `"esModuleInterop": true`.

---

## 2. ApiResponse Type

```ts
// src/types/ApiResponse.ts
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}
```

---

## 3. Axios Client Wrapper

```ts
// src/lib/axiosClient.ts
import axios, { AxiosInstance } from "axios";
import { ApiResponse } from "../types/ApiResponse";

const axiosClient: AxiosInstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 5000,
});

// Interceptor: log request
axiosClient.interceptors.request.use(config => {
  console.log(`[REQ] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Interceptor: handle error
axiosClient.interceptors.response.use(
  res => res,
  err => Promise.reject(err.response || err)
);

export async function apiGet<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const res = await axiosClient.get<T>(url);
    return { data: res.data, error: null, status: res.status };
  } catch (err: any) {
    return {
      data: null,
      error: err?.statusText || err.message,
      status: err?.status || 500,
    };
  }
}
```

---

## 4. Service Layer

```ts
// src/services/userService.ts
import { apiGet } from "../lib/axiosClient";
import { ApiResponse } from "../types/ApiResponse";

export interface User {
  id: number;
  name: string;
  email: string;
}

export async function getUsers(): Promise<ApiResponse<User[]>> {
  return apiGet<User[]>("/users");
}
```

```ts
// src/services/postService.ts
import { apiGet } from "../lib/axiosClient";
import { ApiResponse } from "../types/ApiResponse";

export interface Post {
  id: number;
  title: string;
  body: string;
}

export async function getPosts(): Promise<ApiResponse<Post[]>> {
  return apiGet<Post[]>("/posts");
}
```

---

## 5. Express API Layer

```ts
// src/server.ts
import express, { Request, Response } from "express";
import { getUsers } from "./services/userService";
import { getPosts } from "./services/postService";

const app = express();
const PORT = 4000;

app.get("/users", async (_req: Request, res: Response) => {
  const result = await getUsers();
  res.status(result.status).json(result);
});

app.get("/posts", async (_req: Request, res: Response) => {
  const result = await getPosts();
  res.status(result.status).json(result);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
```

---

## 6. Chạy thử

```bash
npx ts-node src/server.ts
```

Truy cập:

* `http://localhost:4000/users` → trả về danh sách user
* `http://localhost:4000/posts` → trả về danh sách post

Ví dụ response:

```json
{
  "data": [
    { "id": 1, "name": "Leanne Graham", "email": "Sincere@april.biz" }
  ],
  "error": null,
  "status": 200
}
```

---

## 📌 Bài học Enterprise

* **Tách ApiResponse<T>** → đồng bộ response cho FE/BE.
* **Axios wrapper** → dễ mở rộng retry, logging, auth token.
* **Service layer** → phân tầng rõ ràng (controller → service → external API).
* **Scalable** → khi project có hàng chục API, chỉ cần mở rộng service.

---

# 🔒 Middleware Enterprise với TypeScript

Mục tiêu:

* Chuẩn hóa **error handling**
* Thêm **Auth Guard** kiểm tra token
* Tất cả response đều tuân theo `ApiResponse<T>`

---

## 1. Error Middleware

```ts
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types/ApiResponse";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response<ApiResponse<null>>,
  _next: NextFunction
) {
  console.error("❌ Error:", err.message);

  res.status(err.status || 500).json({
    data: null,
    error: err.message || "Internal Server Error",
    status: err.status || 500,
  });
}
```

---

## 2. Auth Middleware (Guard)

```ts
// src/middleware/authGuard.ts
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types/ApiResponse";

export function authGuard(
  req: Request,
  res: Response<ApiResponse<null>>,
  next: NextFunction
) {
  const token = req.headers["authorization"];

  if (!token || token !== "Bearer my-secret-token") {
    return res.status(401).json({
      data: null,
      error: "Unauthorized",
      status: 401,
    });
  }

  next(); // ✅ hợp lệ → sang controller
}
```

---

## 3. Update Server để dùng Middleware

```ts
// src/server.ts
import express, { Request, Response } from "express";
import { getUsers } from "./services/userService";
import { getPosts } from "./services/postService";
import { authGuard } from "./middleware/authGuard";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = 4000;

app.use(express.json());

// ✅ Route không cần auth
app.get("/users", async (_req: Request, res: Response) => {
  const result = await getUsers();
  res.status(result.status).json(result);
});

// ✅ Route cần auth
app.get("/posts", authGuard, async (_req: Request, res: Response) => {
  const result = await getPosts();
  res.status(result.status).json(result);
});

// Middleware xử lý error cuối cùng
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
```

---

## 4. Test thực tế

### Không có token:

```bash
curl http://localhost:4000/posts
```

👉 Response:

```json
{
  "data": null,
  "error": "Unauthorized",
  "status": 401
}
```

### Có token:

```bash
curl -H "Authorization: Bearer my-secret-token" http://localhost:4000/posts
```

👉 Response:

```json
{
  "data": [
    { "id": 1, "title": "Post 1", "body": "Lorem ipsum" }
  ],
  "error": null,
  "status": 200
}
```

---

## 📌 Ý nghĩa Enterprise

* **Auth Guard**: bảo vệ route quan trọng (posts, profile, orders...).
* **Error Middleware**: toàn bộ lỗi đều trả về 1 format thống nhất.
* **ApiResponse<T>**: frontend dễ dàng xử lý `status, data, error`.

---

# 🛡️ Request Validation trong Enterprise App

Chúng ta cần validate dữ liệu client gửi lên trước khi xử lý.
Cách phổ biến trong enterprise:

1. **Schema validation** (Zod, Yup, Joi)
2. **Custom Type Guard** trong TypeScript

---

## 1. Validation với **Zod**

Cài đặt:

```bash
npm install zod
```

### User Validation

```ts
// src/validation/userValidation.ts
import { z } from "zod";

// Định nghĩa schema cho user
export const UserSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(3),
  email: z.string().email(),
});

// Tạo type từ schema
export type UserInput = z.infer<typeof UserSchema>;
```

---

## 2. Middleware Validate Body

```ts
// src/middleware/validate.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiResponse } from "../types/ApiResponse";

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response<ApiResponse<null>>, next: NextFunction) => {
    try {
      schema.parse(req.body); // ✅ validate
      next();
    } catch (err: any) {
      return res.status(400).json({
        data: null,
        error: err.errors || "Validation failed",
        status: 400,
      });
    }
  };
}
```

---

## 3. Apply vào Route

```ts
// src/server.ts
import { UserSchema } from "./validation/userValidation";
import { validateBody } from "./middleware/validate";

app.post("/users", validateBody(UserSchema), (req, res) => {
  res.json({
    data: req.body,
    error: null,
    status: 201,
  });
});
```

---

## 4. Test thực tế

### ✅ Gửi hợp lệ:

```bash
curl -X POST http://localhost:4000/users \
-H "Content-Type: application/json" \
-d '{"id":1,"name":"Alice","email":"alice@mail.com"}'
```

👉 Response:

```json
{
  "data": { "id": 1, "name": "Alice", "email": "alice@mail.com" },
  "error": null,
  "status": 201
}
```

### ❌ Gửi sai:

```bash
-d '{"id":-1,"name":"A","email":"not-email"}'
```

👉 Response:

```json
{
  "data": null,
  "error": [
    { "message": "Number must be greater than 0", "path": ["id"] },
    { "message": "String must contain at least 3 character(s)", "path": ["name"] },
    { "message": "Invalid email", "path": ["email"] }
  ],
  "status": 400
}
```

---

## 📌 Ý nghĩa Enterprise

* Mỗi **route** có thể attach schema validation riêng → giảm bug từ dữ liệu sai.
* **Zod** sinh type tự động (`z.infer`) → backend + frontend đồng bộ.
* Đây là bước **tiền đề** cho **Form Handling** ở Day 26 (client form data → backend validation → safe domain object).



---
[<< Ngày 24](./Day24.md) | [Ngày 26 >>](./Day26.md)