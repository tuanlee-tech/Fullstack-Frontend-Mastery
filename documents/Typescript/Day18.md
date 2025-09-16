# 📘 Day 18 — Error Handling & `never`, Result/Either Pattern

## 1️⃣ Khái niệm cơ bản

### ❌ Lỗi phổ biến trong TypeScript / JS

* **Runtime error**: ví dụ `Cannot read property 'x' of undefined`.
* **Business error**: quy tắc nghiệp vụ (ví dụ: user không đủ tiền để mua hàng).
* **External error**: API timeout, network down, DB crash.

### Cách xử lý lỗi

1. `try/catch` → truyền thống, dễ hiểu nhưng có thể messy.
2. `throw Error` → nhưng khó track nhiều case.
3. **Result/Either Pattern** → “bọc” kết quả thành type an toàn, thay vì throw.

---

## 2️⃣ Kiểu `never` trong TypeScript

* `never` nghĩa là giá trị **không bao giờ xảy ra**.
* Dùng trong:

  * Hàm **luôn throw error**.
  * Exhaustiveness check trong `switch` (buộc TS check hết case).

```ts
function fail(msg: string): never {
  throw new Error(msg);
}

function exhaustiveCheck(x: never): never {
  throw new Error("Unhandled case: " + x);
}
```

---

## 3️⃣ Xử lý lỗi cơ bản bằng try/catch

```ts
function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}

try {
  console.log(divide(10, 2)); // ✅ 5
  console.log(divide(10, 0)); // ❌ throw
} catch (err) {
  console.error("Error caught:", (err as Error).message);
}
```

---

## 4️⃣ Result/Either Pattern

### Kiểu Result\<T, E>

```ts
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

### Ví dụ: API login

```ts
type LoginSuccess = { token: string; userId: number };
type LoginError = "INVALID_CREDENTIALS" | "SERVER_ERROR";

function login(username: string, password: string): Result<LoginSuccess, LoginError> {
  if (username !== "admin" || password !== "1234") {
    return { ok: false, error: "INVALID_CREDENTIALS" };
  }
  return { ok: true, value: { token: "jwt-abc", userId: 1 } };
}

// Sử dụng
const result = login("admin", "wrongpass");

if (result.ok) {
  console.log("Login success:", result.value.token);
} else {
  console.error("Login failed:", result.error);
}
```

✅ Ưu điểm:

* Không cần `try/catch`.
* Dùng `if (res.ok)` để phân biệt.
* Tất cả lỗi được **typed** → tránh string so sánh lung tung.

---

## 5️⃣ Either Pattern (functional style)

```ts
type Either<L, R> = { kind: "left"; value: L } | { kind: "right"; value: R };

function divideSafe(a: number, b: number): Either<string, number> {
  if (b === 0) return { kind: "left", value: "Division by zero" };
  return { kind: "right", value: a / b };
}

const res = divideSafe(10, 0);

if (res.kind === "right") {
  console.log("✅ Result:", res.value);
} else {
  console.error("❌ Error:", res.value);
}
```

---

## 6️⃣ Ứng dụng thực tế trong enterprise

### 🔹 Middleware xử lý lỗi trong Express

```ts
import { Request, Response, NextFunction } from "express";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error("🔥 Error:", err.message);
  res.status(500).json({ status: "error", message: err.message });
}
```

👉 Sau đó trong `app.ts`:

```ts
import { errorHandler } from "./middleware/errorHandler";
app.use(errorHandler);
```

---

### 🔹 Dùng Result Pattern trong Service

```ts
import { Result } from "../types/result";

type User = { id: number; name: string };

function findUser(id: number): Result<User, "NOT_FOUND"> {
  if (id === 1) return { ok: true, value: { id: 1, name: "Alice" } };
  return { ok: false, error: "NOT_FOUND" };
}

// Trong Controller
const userResult = findUser(2);

if (userResult.ok) {
  console.log("User found:", userResult.value);
} else {
  console.error("Error:", userResult.error);
}
```

---

### 🔹 Exhaustiveness check với `never`

```ts
type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

function handlePayment(status: PaymentStatus) {
  switch (status) {
    case "PENDING":
      console.log("⏳ Waiting...");
      break;
    case "SUCCESS":
      console.log("✅ Paid");
      break;
    case "FAILED":
      console.log("❌ Failed");
      break;
    default:
      // Nếu thiếu case nào → TS báo lỗi
      const exhaustive: never = status;
      throw new Error(`Unhandled status: ${exhaustive}`);
  }
}
```

---

## 7️⃣ Bài tập luyện tập

### Level 1

1. Tạo hàm `parseJson(str: string): Result<any, string>`

   * Nếu parse thành công → trả về `ok: true`.
   * Nếu lỗi → trả về `ok: false, error: "INVALID_JSON"`.

### Level 2

2. Viết hàm `safeFetch(url: string): Result<string, "NETWORK_ERROR">`

   * Nếu `url === "api/data"` → trả về `ok: true, value: "data..."`.
   * Ngược lại → `ok: false, error: "NETWORK_ERROR"`.

### Level 3 (mini enterprise)

3. Mô phỏng login API:

   * Input: username, password.
   * Nếu đúng → return `Result<{ token: string }, "INVALID_CREDENTIALS">`.
   * Nếu sai → return error.
   * Viết controller Express sử dụng service này + middleware `errorHandler`.

---


# 🔹 Level 1: `parseJson` với Result Pattern

```ts
// Định nghĩa kiểu Result
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// Hàm parse JSON an toàn
function parseJson(str: string): Result<any, string> {
  try {
    const parsed = JSON.parse(str); // Thử parse string
    return { ok: true, value: parsed }; // Nếu thành công, trả về ok
  } catch (err) {
    return { ok: false, error: "INVALID_JSON" }; // Nếu lỗi, trả về error
  }
}

// Test
console.log(parseJson('{"a":1}')); // { ok: true, value: { a: 1 } }
console.log(parseJson("{a:1}"));   // { ok: false, error: 'INVALID_JSON' }
```

**Enterprise use:**

* Khi nhận payload từ client, API không throw mà trả Result → controller dễ xử lý, an toàn hơn.

---

# 🔹 Level 2: `safeFetch` mô phỏng network call

```ts
function safeFetch(url: string): Result<string, "NETWORK_ERROR"> {
  if (url === "api/data") {
    return { ok: true, value: "data..." }; // giả lập fetch thành công
  } else {
    return { ok: false, error: "NETWORK_ERROR" }; // fetch lỗi
  }
}

// Test
const res1 = safeFetch("api/data");
if (res1.ok) {
  console.log("Fetch success:", res1.value);
} else {
  console.error("Fetch error:", res1.error);
}

const res2 = safeFetch("api/invalid");
if (res2.ok) {
  console.log("Fetch success:", res2.value);
} else {
  console.error("Fetch error:", res2.error);
}
```

**Enterprise use:**

* Dùng khi gọi external API → tránh crash app, dễ log và retry.

---

# 🔹 Level 3: Mini Enterprise Login API

### 1️⃣ Service

```ts
type LoginResult = Result<{ token: string }, "INVALID_CREDENTIALS">;

function loginService(username: string, password: string): LoginResult {
  if (username === "admin" && password === "1234") {
    return { ok: true, value: { token: "jwt-abc-123" } }; // login thành công
  } else {
    return { ok: false, error: "INVALID_CREDENTIALS" }; // login thất bại
  }
}
```

### 2️⃣ Controller (Express)

```ts
import express, { Request, Response, NextFunction } from "express";

const app = express();
app.use(express.json());

// Middleware xử lý lỗi (enterprise pattern)
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error("🔥 Error:", err.message);
  res.status(500).json({ status: "error", message: err.message });
}

// Route login
app.post("/login", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const result = loginService(username, password);

    if (result.ok) {
      res.json({ status: "success", token: result.value.token });
    } else {
      res.status(401).json({ status: "fail", error: result.error });
    }
  } catch (err) {
    next(err); // Gửi lỗi cho middleware xử lý
  }
});

app.use(errorHandler);

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
```

### 3️⃣ Test

* `POST /login` với body:

```json
{ "username": "admin", "password": "1234" }
```

→ Response:

```json
{ "status": "success", "token": "jwt-abc-123" }
```

* `POST /login` với sai password:

```json
{ "username": "admin", "password": "wrong" }
```

→ Response:

```json
{ "status": "fail", "error": "INVALID_CREDENTIALS" }
```

---

## ✅ Enterprise Lessons

1. **Service trả Result**, không throw → controller type-safe, dễ test.
2. **Middleware errorHandler** → xử lý toàn cục, không lặp code.
3. **Typed error** → giảm bug runtime, IDE hỗ trợ autocomplete.
4. **Exhaustiveness + never** có thể dùng cho switch các error type để TS cảnh báo case chưa handle.

---



[<< Ngày 17](./Day17.md) | [Ngày 19 >>](./Day19.md)