# 🟦 Day 17 — Modules & Namespaces

TypeScript hỗ trợ **Modules** và **Namespaces** để tổ chức code, tránh xung đột tên, và scale codebase.

---

## 1️⃣ Modules (ES Modules)

* File riêng biệt = Module.
* Sử dụng `export` để xuất, `import` để nhập.

```ts
// user.ts
export interface User {
  id: number;
  name: string;
}

export function createUser(id: number, name: string): User {
  return { id, name };
}

// app.ts
import { User, createUser } from "./user"; // import từ module khác

const u: User = createUser(1, "Alice");
console.log(u); // { id: 1, name: "Alice" }
```

**Enterprise use case:**

* Tách `UserService`, `AuthService`, `ProductService` ra module riêng → dễ maintain, reusable.

---

## 2️⃣ Default Export

```ts
// logger.ts
export default function log(message: string) {
  console.log("[LOG]", message);
}

// app.ts
import log from "./logger";
log("Hello world"); // [LOG] Hello world
```

* Mỗi file chỉ có **1 default export**, nhưng có thể nhiều named export.
* Giúp enterprise phân tách **entry point** & helper functions.

---

## 3️⃣ Namespace (trước ES6, ít dùng)

* Giúp gom code trong **1 file**.
* Khác module: không cần import/export, nhưng **khó scale khi codebase lớn**.

```ts
namespace Utils {
  export function sum(a: number, b: number) {
    return a + b;
  }
}

console.log(Utils.sum(5, 7)); // 12
```

**Enterprise:**

* Thường dùng cho **library nhỏ** hoặc **dạng internal helper**.
* Trong dự án lớn, **module ES6** ưu tiên hơn namespace.

---

## 4️⃣ Re-export

* Cho phép **module tập hợp** nhiều exports từ module khác.

```ts
// index.ts
export * from "./user";
export * from "./logger";

// app.ts
import { createUser } from "./index";
```

**Enterprise use case:**

* `barrel file` pattern → quản lý imports dễ dàng, tránh import dài dòng.

---

## 5️⃣ Dynamic Imports (Code Splitting)

```ts
async function loadModule() {
  const { createUser } = await import("./user"); // load runtime
  const u = createUser(2, "Bob");
  console.log(u);
}

loadModule();
```

* Dùng khi **lazy loading**: React lazy, Node.js dynamic module.
* Giúp enterprise **optimize performance**.

---

## ✅ Mini Enterprise Example

* Giả sử dự án có: `services/user.ts`, `services/product.ts`, `utils/logger.ts`.
* Tất cả export được re-export trong `services/index.ts`.
* Ở `app.ts` chỉ import `services/index.ts` → code sạch, scalable.

```ts
// services/user.ts
export interface User { id: number; name: string }
export function createUser(id: number, name: string): User { return { id, name }; }

// services/product.ts
export interface Product { id: number; name: string }
export function createProduct(id: number, name: string): Product { return { id, name }; }

// services/index.ts
export * from "./user";
export * from "./product";

// app.ts
import { createUser, createProduct } from "./services";

const user = createUser(1, "Alice");
const product = createProduct(1, "Laptop");
console.log(user, product);
```

**Enterprise benefit:**

* Tách module rõ ràng → maintainable.
* Barrel file → chỉ import 1 module, tránh import rối.
* Dễ mở rộng: thêm module mới chỉ cần export trong `index.ts`.

---


# 🚀 Mini Project — Modular API (Users & Products)

## 1️⃣ Cấu trúc thư mục

```
src/
 ┣ models/
 ┃ ┣ user.ts
 ┃ ┣ product.ts
 ┣ services/
 ┃ ┣ userService.ts
 ┃ ┣ productService.ts
 ┃ ┣ index.ts
 ┣ utils/
 ┃ ┣ logger.ts
 ┣ app.ts
```

---

## 2️⃣ Code chi tiết

### `models/user.ts`

```ts
// Định nghĩa User type
export interface User {
  id: number;
  name: string;
  email: string;
}
```

### `models/product.ts`

```ts
// Định nghĩa Product type
export interface Product {
  id: number;
  name: string;
  price: number;
}
```

---

### `services/userService.ts`

```ts
import { User } from "../models/user";

let users: User[] = []; // fake database

export function createUser(id: number, name: string, email: string): User {
  const user: User = { id, name, email };
  users.push(user);
  return user;
}

export function getAllUsers(): User[] {
  return users;
}
```

---

### `services/productService.ts`

```ts
import { Product } from "../models/product";

let products: Product[] = []; // fake database

export function createProduct(id: number, name: string, price: number): Product {
  const product: Product = { id, name, price };
  products.push(product);
  return product;
}

export function getAllProducts(): Product[] {
  return products;
}
```

---

### `services/index.ts` (Barrel File)

```ts
// Gom tất cả service lại để import 1 lần
export * from "./userService";
export * from "./productService";
```

---

### `utils/logger.ts`

```ts
export default function log(message: string) {
  console.log("[LOG]", message);
}
```

---

### `app.ts`

```ts
import log from "./utils/logger";
import { createUser, getAllUsers, createProduct, getAllProducts } from "./services";

log("=== App started ===");

// Tạo user
const u1 = createUser(1, "Alice", "alice@mail.com");
const u2 = createUser(2, "Bob", "bob@mail.com");

// Tạo product
const p1 = createProduct(1, "Laptop", 1500);
const p2 = createProduct(2, "Phone", 800);

log("Users:");
console.log(getAllUsers());

log("Products:");
console.log(getAllProducts());
```

---

## 3️⃣ Kết quả khi chạy

```
[LOG] === App started ===
[LOG] Users:
[
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
]
[LOG] Products:
[
  { id: 1, name: 'Laptop', price: 1500 },
  { id: 2, name: 'Phone', price: 800 }
]
```

---

## 4️⃣ Enterprise Lessons

✅ **Module hóa code** → dễ quản lý, mở rộng khi dự án lớn.
✅ **Barrel file (`index.ts`)** → giảm import rối rắm.
✅ **Logger riêng** → enterprise code luôn cần logging.
✅ **Models tách biệt** → chuẩn enterprise (clear data contracts).

---


# 🚀 Mini Project: Express API (Users & Products)

## 1️⃣ Cấu trúc thư mục

```
src/
 ┣ models/
 ┃ ┣ user.ts
 ┃ ┣ product.ts
 ┣ services/
 ┃ ┣ userService.ts
 ┃ ┣ productService.ts
 ┃ ┣ index.ts
 ┣ controllers/
 ┃ ┣ userController.ts
 ┃ ┣ productController.ts
 ┣ middleware/
 ┃ ┣ logger.ts
 ┣ decorators/
 ┃ ┣ route.ts
 ┣ app.ts
 ┣ server.ts
```

---

## 2️⃣ Code chi tiết

### `models/user.ts`

```ts
export interface User {
  id: number;
  name: string;
  email: string;
}
```

### `models/product.ts`

```ts
export interface Product {
  id: number;
  name: string;
  price: number;
}
```

---

### `services/userService.ts`

```ts
import { User } from "../models/user";

let users: User[] = [];

export function createUser(id: number, name: string, email: string): User {
  const user: User = { id, name, email };
  users.push(user);
  return user;
}

export function getAllUsers(): User[] {
  return users;
}
```

### `services/productService.ts`

```ts
import { Product } from "../models/product";

let products: Product[] = [];

export function createProduct(id: number, name: string, price: number): Product {
  const product: Product = { id, name, price };
  products.push(product);
  return product;
}

export function getAllProducts(): Product[] {
  return products;
}
```

---

### `middleware/logger.ts`

```ts
import { Request, Response, NextFunction } from "express";

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`[${req.method}] ${req.url}`);
  next();
}
```

---

### `decorators/route.ts`

```ts
import "reflect-metadata";
import { Router } from "express";

const router = Router();

// Method decorator
export function Get(path: string) {
  return function (target: any, propertyKey: string) {
    router.get(path, target[propertyKey]);
  };
}

export function Post(path: string) {
  return function (target: any, propertyKey: string) {
    router.post(path, target[propertyKey]);
  };
}

// Lấy router để app.ts dùng
export function getRouter() {
  return router;
}
```

---

### `controllers/userController.ts`

```ts
import { Request, Response } from "express";
import { createUser, getAllUsers } from "../services/userService";
import { Get, Post } from "../decorators/route";

export class UserController {
  @Get("/users")
  getUsers(req: Request, res: Response) {
    res.json(getAllUsers());
  }

  @Post("/users")
  addUser(req: Request, res: Response) {
    const { id, name, email } = req.body;
    const user = createUser(id, name, email);
    res.json(user);
  }
}
```

---

### `controllers/productController.ts`

```ts
import { Request, Response } from "express";
import { createProduct, getAllProducts } from "../services/productService";
import { Get, Post } from "../decorators/route";

export class ProductController {
  @Get("/products")
  getProducts(req: Request, res: Response) {
    res.json(getAllProducts());
  }

  @Post("/products")
  addProduct(req: Request, res: Response) {
    const { id, name, price } = req.body;
    const product = createProduct(id, name, price);
    res.json(product);
  }
}
```

---

### `app.ts`

```ts
import express from "express";
import bodyParser from "body-parser";
import { logger } from "./middleware/logger";
import { getRouter } from "./decorators/route";

// Import controllers (chỉ cần new để decorator chạy)
import "./controllers/userController";
import "./controllers/productController";

const app = express();

app.use(bodyParser.json());
app.use(logger);

// Gắn router tự sinh từ decorators
app.use(getRouter());

export default app;
```

---

### `server.ts`

```ts
import app from "./app";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
```

---

## 3️⃣ Cách chạy

```bash
npm install express body-parser reflect-metadata
npx ts-node src/server.ts
```

---

## 4️⃣ Test API

* `GET http://localhost:3000/users` → lấy danh sách user
* `POST http://localhost:3000/users` → thêm user

```json
{
  "id": 1,
  "name": "Alice",
  "email": "alice@mail.com"
}
```

* `GET http://localhost:3000/products` → lấy danh sách sản phẩm
* `POST http://localhost:3000/products` → thêm sản phẩm

```json
{
  "id": 101,
  "name": "Laptop",
  "price": 1500
}
```

---

## 5️⃣ Enterprise Lessons

✅ **Decorator** → giúp định nghĩa route clean hơn (giống NestJS).
✅ **Module tách biệt** (controller, service, model) → clean architecture.
✅ **Middleware logger** → có thể mở rộng thành auth, validation.
✅ **Reflect Metadata** → bước đầu xây dựng framework-like pattern.

---


[<< Ngày 16](./Day16.md) | [Ngày 18 >>](./Day18.md)