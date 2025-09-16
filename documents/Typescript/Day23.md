# 📘 Day 23 — TypeScript + Node/Express

## 1️⃣ Mục tiêu

* Type-safe **Request & Response** trong Express.
* Viết **middleware** có type-safe, kiểm tra authentication.
* Enterprise-ready: tránh bug runtime, dễ maintain, dễ mở rộng.

---

## 2️⃣ Setup Project

```bash
mkdir ts-express-app && cd ts-express-app
npm init -y
npm install express @types/express typescript ts-node-dev
npx tsc --init
```

* `tsconfig.json` bật `strict: true` → kiểm tra type chặt chẽ.

---

## 3️⃣ Typed Express Request

```ts
// src/types/express.d.ts
import { Request } from "express";

export interface User {
  id: number;
  name: string;
}

// Mở rộng Request để thêm user
export interface AuthRequest extends Request {
  user?: User;
}
```

**Enterprise lessons:**

* Mở rộng Request → middleware & route handler type-safe.
* Ngăn lỗi runtime khi truy cập `req.user`.

---

## 4️⃣ Middleware Example: Auth Guard

```ts
// src/middleware/auth.ts
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/express";

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Kiểm tra presence của user
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next(); // user tồn tại → đi tiếp
};
```

**Enterprise use:**

* Type-safe guard → tránh crash khi `req.user` undefined.
* Middleware reusable cho tất cả route cần auth.

---

## 5️⃣ Typed Controller / Route

```ts
// src/routes/user.ts
import { Router, Response } from "express";
import { AuthRequest } from "../types/express";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Route có auth
router.get("/profile", authMiddleware, (req: AuthRequest, res: Response) => {
  // req.user chắc chắn tồn tại vì đã check ở middleware
  res.json({ id: req.user!.id, name: req.user!.name });
});

export default router;
```

**Enterprise lessons:**

* Middleware + typed Request → developer không cần check `req.user` nhiều lần.
* Dễ maintain & mở rộng: add role-based access, logging.

---

## 6️⃣ Full Express App Example

```ts
// src/app.ts
import express, { Request, Response } from "express";
import userRoutes from "./routes/user";
import { AuthRequest } from "./types/express";

const app = express();
app.use(express.json());

// Fake auth injection
app.use((req: AuthRequest, res: Response, next) => {
  req.user = { id: 1, name: "Alice" }; // giả lập auth
  next();
});

app.use("/users", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello TypeScript + Express");
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

**Enterprise lessons:**

* Type-safe request/response → tránh bug runtime.
* Middleware pattern → dễ scale khi project lớn.
* Fake auth → thử nghiệm pattern, dễ thay bằng real JWT/OAuth.

---

## 7️⃣ Enterprise Patterns

1. Typed `Request`/`Response` cho tất cả routes.
2. Middleware reusable: auth, logging, validation.
3. Controllers tách biệt: route chỉ định đường dẫn, handler xử lý logic.
4. Error handling kiểu enterprise: typed error objects.

---

## 8️⃣ Bài tập luyện tập

### Level 1

* Tạo route `GET /products` trả về list `Product[]` với typed `Request`/`Response`.

### Level 2

* Viết middleware `adminGuard` → chỉ admin mới truy cập được route.
* Thêm `role?: "user" | "admin"` vào AuthRequest.

### Level 3

* Tích hợp fetch product từ DB (mock hoặc in-memory), dùng typed `Request`, middleware, và Result Pattern:
  `{ ok: true; value: Product[] } | { ok: false; error: string }`.

---



# 🔹 Level 1 — Typed GET /products

```ts
// src/types/product.ts
export interface Product {
  id: number;
  name: string;
  price: number;
}
```

```ts
// src/routes/product.ts
import { Router, Response, Request } from "express";
import { Product } from "../types/product";

const router = Router();

// Fake product data
const products: Product[] = [
  { id: 1, name: "Laptop", price: 1200 },
  { id: 2, name: "Phone", price: 800 },
];

// GET /products — typed Response<Product[]>
router.get("/", (req: Request, res: Response) => {
  res.json(products); // TS tự check type Product[]
});

export default router;
```

**Enterprise lessons:**

* Type-safe Response → compile-time check trả về đúng type.
* Dễ maintain, scale nếu data phức tạp.

---

# 🔹 Level 2 — Middleware adminGuard + Typed Request

```ts
// src/types/express.d.ts
import { Request } from "express";

export interface User {
  id: number;
  name: string;
  role: "user" | "admin";
}

export interface AuthRequest extends Request {
  user?: User;
}
```

```ts
// src/middleware/adminGuard.ts
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/express";

export const adminGuard = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Nếu không có user hoặc không phải admin
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next(); // pass control nếu là admin
};
```

```ts
// src/routes/admin.ts
import { Router, Response } from "express";
import { AuthRequest } from "../types/express";
import { adminGuard } from "../middleware/adminGuard";

const router = Router();

router.get("/dashboard", adminGuard, (req: AuthRequest, res: Response) => {
  // req.user chắc chắn tồn tại và role=admin
  res.json({ message: `Welcome admin ${req.user!.name}` });
});

export default router;
```

**Enterprise lessons:**

* Type-safe middleware → bảo vệ route tránh runtime error.
* Dễ mở rộng: thêm role khác, logging, caching.

---

# 🔹 Level 3 — Fetch Product từ DB (mock) + Result Pattern

```ts
// src/services/productService.ts
import { Product } from "../types/product";

export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// Mock DB
const mockDB: Product[] = [
  { id: 1, name: "Laptop", price: 1200 },
  { id: 2, name: "Phone", price: 800 },
];

export async function getProducts(): Promise<Result<Product[], string>> {
  try {
    // Giả lập async DB fetch
    const data = await new Promise<Product[]>(resolve =>
      setTimeout(() => resolve(mockDB), 500)
    );
    return { ok: true, value: data };
  } catch (err) {
    return { ok: false, error: "DB_ERROR" };
  }
}
```

```ts
// src/routes/productAdvanced.ts
import { Router, Response } from "express";
import { AuthRequest } from "../types/express";
import { getProducts, Result, Product } from "../services/productService";

const router = Router();

// Route typed + result pattern
router.get("/", async (req: AuthRequest, res: Response) => {
  const result: Result<Product[], string> = await getProducts();

  if (result.ok) {
    res.json(result.value); // trả về data
  } else {
    res.status(500).json({ error: result.error }); // trả về lỗi
  }
});

export default router;
```

**Enterprise lessons:**

1. Typed request & response → an toàn.
2. Result Pattern → avoid throw → dễ handle lỗi.
3. Middleware reusable → auth, role-based access.
4. Dễ scale & maintain với nhiều route/service layer.

---

[<< Ngày 22](./Day22.md) | [Ngày 24 >>](./Day24.md)