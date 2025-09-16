# 📘 Day 13: Advanced Functions

## 🎯 Mục tiêu học

* Hiểu **Higher-Order Functions (HOF)** trong TypeScript.
* Biết cách viết **Curried Functions** và **Callback Functions** type-safe.
* Áp dụng **enterprise pattern**: middleware, hooks, logging, API pipeline.

---

## 1. Higher-Order Functions (HOF)

> HOF = function nhận function làm argument hoặc return function

```ts
function withLogging<T extends (...args: any[]) => any>(fn: T): T {
  return ((...args: Parameters<T>) => {
    console.log("Calling function with args:", args);
    const result = fn(...args);
    console.log("Function returned:", result);
    return result;
  }) as T;
}

// Test
function sum(a: number, b: number): number {
  return a + b;
}

const loggedSum = withLogging(sum);
loggedSum(2,3);
// Console:
// Calling function with args: [2,3]
// Function returned: 5
```

✅ **Enterprise use**: Logging, monitoring, debugging function calls, wrapper reusable cho nhiều service.

---

## 2. Callback Functions type-safe

```ts
function fetchData<T>(url: string, callback: (data: T) => void) {
  // Giả lập async
  const fakeData = { id: 1, name: "Alice" } as unknown as T;
  setTimeout(() => callback(fakeData), 500);
}

// Test
fetchData<{id:number,name:string}>("/api/user", (user) => {
  console.log("User fetched:", user.name);
});
```

* Generics giúp callback **biết chính xác type dữ liệu**, tránh casting kiểu `any`.

✅ **Enterprise use**: API client, event handlers, middleware.

---

## 3. Currying Functions

> Currying = chuyển hàm nhiều tham số thành chuỗi các hàm một tham số

```ts
function multiply(a: number): (b: number) => number {
  return (b: number) => a * b;
}

const double = multiply(2);
console.log(double(5)); // 10
```

* Tối ưu cho **reusable function** với các tham số cố định trước.

✅ **Enterprise use**: middleware composition, pipeline processing, partial application.

---

## 4. Mini Project: Middleware Pipeline

```ts
type Request = { userId?: number; body?: any };
type Response = { status: number; data?: any };

type Middleware = (req: Request, res: Response, next: () => void) => void;

function runMiddlewares(req: Request, res: Response, middlewares: Middleware[]) {
  let index = 0;
  const next = () => {
    const middleware = middlewares[index++];
    if (middleware) middleware(req, res, next);
  };
  next();
}

// Example middlewares
const auth: Middleware = (req, res, next) => {
  if (!req.userId) {
    res.status = 401;
    return;
  }
  console.log("User authorized:", req.userId);
  next();
};

const logger: Middleware = (req, res, next) => {
  console.log("Request body:", req.body);
  next();
};

const handler: Middleware = (req, res) => {
  res.status = 200;
  res.data = { message: "Success" };
};

// Run
const req: Request = { userId: 1, body: { key: "value" } };
const res: Response = { status: 0 };

runMiddlewares(req, res, [logger, auth, handler]);
console.log("Final response:", res);
```

✅ **Enterprise use**: HOF + middleware cho API, request pipeline, authorization, logging.

---

## 5. Bài tập (có lời giải)

### Level 1

* Viết HOF `retry<T>(fn: ()=>T, times:number): T`
* Thử lại function nếu throw error

```ts
function retry<T>(fn: () => T, times: number): T {
  for (let i = 0; i < times; i++) {
    try { return fn(); } catch {}
  }
  throw new Error("Failed after retries");
}
```

---

### Level 2

* Viết curried function `add(a:number)(b:number)(c:number): number`
* Sử dụng đầy đủ currying

```ts
const add = (a:number) => (b:number) => (c:number) => a + b + c;
console.log(add(1)(2)(3)); // 6
```

---

### Level 3

* Tạo mini middleware pipeline type-safe
* Middleware có thể enrich `Request` và `Response`
* Kết hợp HOF + Callback + Generics

```ts
type Middleware<TReq,TRes> = (req:TReq,res:TRes,next:()=>void)=>void;

// Bạn có thể mở rộng runMiddlewares với generic Request/Response
```

✅ Level 3 giúp bạn làm **API pipeline enterprise thực tế**, type-safe tuyệt đối, dễ maintain.

---

## 🔑 Key Takeaways Day 13

1. **Higher-Order Functions**: reusable, logging, decorators, API pipeline.
2. **Callbacks + Generics**: type-safe event & API handling.
3. **Currying**: reusable, partial application, middleware composition.
4. **Enterprise pattern**: middleware pipeline, logging, request handling, functional composition.

---


# 🧩 Level 3 – Middleware Pipeline Type-Safe

## 1. Mục tiêu

* Middleware pipeline **type-safe** cho Request/Response.
* Có thể **mở rộng** Request và Response trong từng bước.
* Dùng **Generics** để kiểm soát type ở compile-time.

---

## 2. Code giải

```ts
// Generic Middleware type
type Middleware<TReq, TRes> = (
  req: TReq,
  res: TRes,
  next: () => void
) => void;

// Middleware runner
function runMiddlewares<TReq, TRes>(
  req: TReq,
  res: TRes,
  middlewares: Middleware<TReq, TRes>[]
) {
  let index = 0;
  const next = () => {
    const mw = middlewares[index++];
    if (mw) mw(req, res, next);
  };
  next();
}

// --- Request & Response định nghĩa ---
interface Request {
  userId?: number;
  body?: any;
}

interface Response {
  status: number;
  data?: any;
  error?: string;
}

// --- Middleware examples ---
// Logger
const logger: Middleware<Request, Response> = (req, res, next) => {
  console.log("📥 Incoming Request:", req.body);
  next();
};

// Auth check
const auth: Middleware<Request, Response> = (req, res, next) => {
  if (!req.userId) {
    res.status = 401;
    res.error = "Unauthorized";
    return; // không gọi next nữa
  }
  console.log("✅ Authorized user:", req.userId);
  next();
};

// Business logic handler
const handler: Middleware<Request, Response> = (req, res, next) => {
  res.status = 200;
  res.data = { message: "Hello User " + req.userId };
  next();
};

// Error handler (sẽ chạy cuối cùng)
const errorHandler: Middleware<Request, Response> = (req, res, next) => {
  if (res.error) {
    console.error("❌ Error:", res.error);
  } else {
    console.log("✅ Success response:", res.data);
  }
  next();
};

// --- Thử chạy ---
const req: Request = { userId: 1, body: { action: "login" } };
const res: Response = { status: 0 };

runMiddlewares(req, res, [logger, auth, handler, errorHandler]);
```

---

## 3. Output

```
📥 Incoming Request: { action: 'login' }
✅ Authorized user: 1
✅ Success response: { message: 'Hello User 1' }
```

Nếu bạn đổi `req.userId = undefined;` thì sẽ ra:

```
📥 Incoming Request: { action: 'login' }
❌ Error: Unauthorized
```

---

## 4. Enterprise ứng dụng

* **Express.js** request/response pipeline.
* **Koa / NestJS** middleware system.
* **Security & Logging**: tách logic xác thực, logging, error-handling.
* **Reusability**: middleware có thể tái sử dụng ở nhiều service.

---


[<< Ngày 12](./Day12.md) | [Ngày 14 >>](./Day14.md)