# 📘 Day 9 — Type Narrowing & Type Guards

---

## 🎯 Mục tiêu hôm nay

* Hiểu **tại sao** cần type narrowing trong TypeScript.
* Biết các kỹ thuật thu hẹp kiểu: `typeof`, `instanceof`, `in`, `Array.isArray`, kiểm tra discriminant property, và các **user-defined type guards**.
* Biết các giới hạn (limitations) của control-flow narrowing (mutable vars, closures, callbacks).
* Áp dụng narrow/guards vào **API handling, event handling, middleware** trong môi trường enterprise.
* Viết code an toàn, tránh `any`, xử lý exhaustiveness (kiểm tra đầy đủ các trường hợp).

---

## TL;DR

Khi một biến có thể là nhiều kiểu (union), ta **phải** thu hẹp kiểu trước khi truy cập thuộc tính đặc thù của một nhánh. TypeScript hỗ trợ nhiều công cụ: `typeof`, `instanceof`, `in`, discriminant property (ví dụ `type`/`status`), `Array.isArray`, và **custom type guard** (`function isX(x): x is X`). Hãy luôn xử lý exhaustively (dùng `never` assert) để an toàn khi mở rộng.

---

## 1. Tại sao cần Type Narrowing?

Ví dụ:

```ts
function printLen(x: string | number) {
  // Nếu không check, gọi x.toFixed hoặc x.length có thể lỗi runtime
}
```

TypeScript sẽ không cho phép truy cập thuộc tính chỉ thuộc về một kiểu nếu bạn chưa thu hẹp. Narrowing giúp: ngăn lỗi runtime, cải thiện autocomplete/IDE, và document logic rõ ràng.

---

## 2. Các kỹ thuật narrowing căn bản

### 2.1 `typeof` — cho primitive types

Dùng với `string`, `number`, `boolean`, `symbol`, `bigint`, `undefined`.

```ts
function format(x: string | number) {
  if (typeof x === "string") {
    return x.trim().toUpperCase();
  } else {
    return x.toFixed(2);
  }
}
```

### 2.2 `instanceof` — cho class/constructor

Dùng khi bạn có class hoặc constructor function.

```ts
class Dog { bark() { console.log("woof"); } }
class Cat { meow() { console.log("meow"); } }

function makeSound(a: Dog | Cat) {
  if (a instanceof Dog) a.bark();
  else a.meow();
}
```

Lưu ý: `instanceof` không hoạt động với interface hoặc plain object literal từ JSON.

### 2.3 `in` — kiểm tra property

Dùng khi union là các object có dấu hiệu khác nhau (không phải class).

```ts
type User = { name: string; email: string };
type Admin = { name: string; permissions: string[] };

function greeting(x: User | Admin) {
  if ("permissions" in x) {
    // x là Admin
    console.log(x.permissions);
  } else {
    console.log(x.email);
  }
}
```

### 2.4 Discriminated union (recommended) — dùng property cố định

Khi mỗi variant có một trường chung có giá trị literal (ví dụ `type` hoặc `status`), TypeScript auto-narrow rất tốt.

```ts
type Event =
  | { type: "click"; x: number; y: number }
  | { type: "keypress"; key: string };

function handle(e: Event) {
  if (e.type === "click") {
    console.log(e.x, e.y);
  } else {
    console.log(e.key);
  }
}
```

### 2.5 `Array.isArray` — check mảng

```ts
function process(v: string | string[]) {
  if (Array.isArray(v)) return v.join(", ");
  return v.toUpperCase();
}
```

### 2.6 Truthiness / null checks / optional chaining

```ts
function printName(u?: { name?: string } | null) {
  if (u && u.name) {
    console.log(u.name);
  }
  // or using optional chaining
  console.log(u?.name ?? "No name");
}
```

---

## 3. User-defined Type Guards (hàm guard)

Khi built-in checks không đủ, viết hàm guard:

```ts
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function isFish(a: Fish | Bird): a is Fish {
  return (a as Fish).swim !== undefined;
}

function move(a: Fish | Bird) {
  if (isFish(a)) a.swim();
  else a.fly();
}
```

* `a is Fish` là **type predicate** — thông báo cho TS rằng hàm này thu hẹp kiểu khi trả về `true`.
* Guard phải là boolean, không có side-effect (nên an toàn, idempotent).

---

## 4. Exhaustiveness check (bảo đảm xử lý đầy đủ các nhánh)

Khi dùng discriminated union, nên dùng `never` assert để bắt lỗi compile nếu sau này thêm variant:

```ts
function assertNever(x: never): never {
  throw new Error("Unexpected: " + JSON.stringify(x));
}

function handle(e: Event) {
  switch (e.type) {
    case "click": return /*...*/;
    case "keypress": return /*...*/;
    default:
      return assertNever(e); // nếu có variant mới, TS báo lỗi ở đây
  }
}
```

---

## 5. Hạn chế & pitfalls (quan trọng)

* **Mutable variable**: nếu biến là `let` và có thể bị gán lại, narrowing có thể không kéo dài. Dùng `const` khi có thể.

  ```ts
  let x: string | number = "a";
  if (typeof x === "string") {
    // OK
  }
  x = 10; // sau gán, narrow cũ không còn hợp lệ
  ```
* **Closures / Callbacks**: narrowing tại thời điểm check không được đảm bảo trong callback chạy sau.
* **instanceof với plain JSON**: dữ liệu từ server (object literal) không phải instance của class → `instanceof` không dùng được.
* **`in` kiểm tra prototype chain**: `in` sẽ tìm trên prototype chain; nếu prototype có property, kiểm tra có thể sai lệch.
* **Không dùng `as` để che dấu lỗi**: `as` bỏ qua kiểm tra; dùng khi chắc chắn, kèm comment giải thích.
* **Nullable values**: luôn check `null`/`undefined` trước khi truy cập thuộc tính.

---

## 6. Ứng dụng thực tế trong enterprise

* **API response handling**: discriminated union cho các trạng thái `loading | success | error | unauthorized`. Guard giúp tách logic UI & error handling.
* **Event systems**: action/event trong Redux/Flux dùng discriminated union — giúp reducer an toàn và exhaustiveness check.
* **Middleware & request enrichment**: vd mở rộng `Request` trong Express, kiểm tra presence của `req.user` trước khi truy cập.
* **Form validation**: nhận dữ liệu `unknown`/`any` từ client, dùng guard để validate shape trước khi convert sang domain type.
* **Security**: guard giúp hạn chế trường hợp truy cập thuộc tính nhạy cảm khi type không đúng.

---

## 7. Ví dụ tổng hợp (production-ready, sạch)

### A. Discriminated union + exhaustive check

```ts
type ApiResponse<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string }
  | { status: "unauthorized" };

function handleApi<T>(res: ApiResponse<T>) {
  switch (res.status) {
    case "loading":
      console.log("Loading...");
      break;
    case "success":
      console.log("Data:", res.data);
      break;
    case "error":
      console.error("Error:", res.message);
      break;
    case "unauthorized":
      console.warn("Unauthorized - redirect to login");
      break;
    default:
      // Exhaustiveness check:
      const _exhaustive: never = res;
      throw new Error("Unexpected response: " + JSON.stringify(_exhaustive));
  }
}
```

### B. Custom guard + parsing JSON (runtime validation simple)

```ts
type User = { id: number; name: string };

function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    typeof (obj as any).id === "number" &&
    "name" in obj &&
    typeof (obj as any).name === "string"
  );
}

// parse raw JSON
function parseUser(raw: unknown): User {
  if (isUser(raw)) return raw;
  throw new Error("Invalid user payload");
}

// Usage
const raw = JSON.parse('{"id":1,"name":"Alice"}');
const user = parseUser(raw); // safe
```

---

## 8. Bài tập (kèm lời giải chi tiết)

### Level 1 — Basic (typeof / Array.isArray)

**Đề bài**: Viết hàm `describeValue(v: string | number | string[])`:

* Nếu `string` → trả về `"String: <v> (len=<length>)"`.
* Nếu `number` → trả về `"Number: <v> (fixed=...)"` (2 chữ số thập phân).
* Nếu `string[]` → trả về `"Array: <joined>"`.

**Lời giải**:

```ts
function describeValue(v: string | number | string[]): string {
  if (typeof v === "string") {
    return `String: ${v} (len=${v.length})`;
  }
  if (typeof v === "number") {
    return `Number: ${v.toFixed(2)}`;
  }
  if (Array.isArray(v)) {
    return `Array: ${v.join(",")}`;
  }
  // không cần default vì mọi trường hợp đã được xử lý
}

console.log(describeValue("hello"));
console.log(describeValue(3.14159));
console.log(describeValue(["a", "b"]));
```

**Giải thích**: `typeof` bắt 2 primitive; `Array.isArray` bắt mảng. Order quan trọng: kiểm tra mảng sau typeof vì `typeof [] === "object"`.

---

### Level 2 — Discriminated Union + Exhaustiveness

**Đề bài**: Định nghĩa type `Shape`:

* `{ kind: "circle"; radius: number }`
* `{ kind: "rect"; width: number; height: number }`
* `{ kind: "triangle"; a:number; b:number; c:number }`

Viết hàm `perimeter(s: Shape): number` xử lý tất cả case và dùng `assertNever` để đảm bảo exhaustiveness.

**Lời giải**:

```ts
type Circle = { kind: "circle"; radius: number };
type Rect = { kind: "rect"; width: number; height: number };
type Tri = { kind: "triangle"; a: number; b: number; c: number };

type Shape = Circle | Rect | Tri;

function assertNever(x: never): never {
  throw new Error("Unexpected shape: " + JSON.stringify(x));
}

function perimeter(s: Shape): number {
  switch (s.kind) {
    case "circle":
      return 2 * Math.PI * s.radius;
    case "rect":
      return 2 * (s.width + s.height);
    case "triangle":
      return s.a + s.b + s.c;
    default:
      return assertNever(s); // nếu có kind mới, compile-time sẽ cảnh báo
  }
}
```

**Giải thích**: discriminant `kind` cho phép narrowing tự động. `assertNever` giúp phát hiện thiếu case khi mở rộng.

---

### Level 3 — Advanced: User-defined guard + parsing unknown

**Đề bài**: Viết `isAdmin(obj: unknown): obj is Admin` với

```ts
type Admin = { id: number; role: "admin"; permissions: string[] };
```

Rồi viết `process(obj: unknown)`:

* Nếu là Admin → log permissions.
* Nếu là object có field `id` & `name` (User) → log name.
* Nếu không → throw error.

**Lời giải**:

```ts
type Admin = { id: number; role: "admin"; permissions: string[] };
type User = { id: number; name: string };

function isAdmin(obj: unknown): obj is Admin {
  return (
    typeof obj === "object" &&
    obj !== null &&
    (obj as any).role === "admin" &&
    Array.isArray((obj as any).permissions) &&
    typeof (obj as any).id === "number"
  );
}

function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as any).name === "string" &&
    typeof (obj as any).id === "number"
  );
}

function process(obj: unknown) {
  if (isAdmin(obj)) {
    console.log("Admin permissions:", obj.permissions.join(", "));
    return;
  }
  if (isUser(obj)) {
    console.log("User name:", obj.name);
    return;
  }
  throw new Error("Unknown object");
}

// Test
process({ id: 1, role: "admin", permissions: ["r", "w"] });
process({ id: 2, name: "Bob" });
```

**Giải thích**: Guards validate shape an toàn trước khi truy cập thuộc tính, tránh cast `as` tùy tiện.

---

## 9. Debugging tips & tools

* **VSCode hover**: hover vào biến trong từng nhánh để thấy TS inferred type — dùng để xác minh narrowing hoạt động.
* **Tạm log type info**: `console.log(typeof x, Array.isArray(x));` khi cần.
* **Unit test**: viết test cho guards (true/false cases).
* **ESLint rule**: bật rule `no-unreachable`/`no-unsafe-member-access` nếu dùng plugin TS ESLint.

---

## 10. Common pitfalls & how to avoid

* **Quên check `null`/`undefined`** → runtime crash. Always check or use `?.` and `??`.
* **Dùng `instanceof` cho JSON** → false. Use guards or `in`.
* **Mutating variable** invalidates narrow → prefer `const` or re-check after mutation.
* **Using `as` to silence errors** → hides real bugs. Nếu buộc phải dùng, comment rõ lý do.
* **Not handling new variant** → use `assertNever` to catch during compile.

---

## 11. Ứng dụng enterprise — ví dụ cụ thể

* **Reducer pattern (Redux)**: action.type discriminant giúp reducer switch an toàn; `assertNever` bảo đảm khi thêm action mới, compile sẽ bắt lỗi.
* **HTTP client**: khi fetch, parse response (unknown), dùng guards để validate trước khi mapping vào domain model → tránh crash.
* **Middleware**: middleware xác thực token và gắn `req.user` → downstream handlers cần guard `if (req.user) ...` hoặc dùng type-safe `declare module` để mở rộng `Request`.

Ví dụ middleware pattern:

```ts
declare global {
  namespace Express {
    interface Request {
      user?: { id: number; name: string };
    }
  }
}

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (valid(token)) {
    req.user = { id: 1, name: "Alice" }; // app-specific
  }
  next();
}
```

Downstream handlers should still check `if (req.user)` — do not assume existence.

---

## 12. Kết luận & next steps

* Type Narrowing & Guards là **nền tảng thiết yếu** để viết TypeScript an toàn trong codebase lớn.
* Sau khi nắm vững, bạn sẽ dễ tiếp thu **Generics nâng cao, Conditional Types, và Utility Types**.
* Tiếp theo: **Day 10 — Debugging & Best Practices cho newbie** (hay bạn muốn mình sang Day 10 luôn bây giờ?)

---


# 🚀 Day 9 (Mở rộng — Enterprise Use Cases)

## 1. API Response Handling

Trong thực tế API không chỉ trả về `success`/`error`, mà còn có `loading`, `unauthorized`.
Sử dụng **discriminated union** giúp quản lý an toàn.

```ts
type ApiResponse<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string }
  | { status: "unauthorized"; redirectUrl: string };

// Guard
function isSuccess<T>(res: ApiResponse<T>): res is { status: "success"; data: T } {
  return res.status === "success";
}

// Handler
function handleApiResponse<T>(res: ApiResponse<T>) {
  switch (res.status) {
    case "loading":
      console.log("⏳ Loading...");
      break;
    case "success":
      console.log("✅ Data:", res.data);
      break;
    case "error":
      console.error("❌ Error:", res.message);
      break;
    case "unauthorized":
      console.warn("🔒 Redirecting:", res.redirectUrl);
      break;
    default:
      const _exhaustive: never = res; // ép xử lý hết case
      return _exhaustive;
  }
}

// Test
handleApiResponse({ status: "loading" });
handleApiResponse({ status: "success", data: { id: 1, name: "Alice" } });
handleApiResponse({ status: "unauthorized", redirectUrl: "/login" });
```

👉 Giúp frontend code **type-safe** khi viết UI logic: Loading spinner, Error banner, Login redirect.

---

## 2. Event Systems (Redux/Flux)

Trong Redux, reducer thường switch theo `action.type`.
Dùng **discriminated union** để đảm bảo **exhaustiveness check**.

```ts
// Action types
type Action =
  | { type: "ADD_TODO"; payload: { id: number; text: string } }
  | { type: "REMOVE_TODO"; payload: { id: number } }
  | { type: "CLEAR_ALL" };

interface State {
  todos: { id: number; text: string }[];
}

// Reducer
function todoReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TODO":
      return { todos: [...state.todos, action.payload] };
    case "REMOVE_TODO":
      return { todos: state.todos.filter((t) => t.id !== action.payload.id) };
    case "CLEAR_ALL":
      return { todos: [] };
    default:
      const _never: never = action;
      return state;
  }
}
```

👉 Nếu bạn quên case `"CLEAR_ALL"`, compiler sẽ báo lỗi ở `_never`.

---

## 3. Middleware & Request Enrichment (Express)

Trong backend enterprise, ta thường mở rộng `Request` với field mới (`req.user`).
Guard giúp **check trước khi dùng**, tránh lỗi `undefined`.

```ts
import express, { Request, Response, NextFunction } from "express";

interface User {
  id: number;
  role: "user" | "admin";
}

interface AuthenticatedRequest extends Request {
  user?: User;
}

// Guard
function hasUser(req: AuthenticatedRequest): req is Request & { user: User } {
  return req.user !== undefined;
}

const app = express();

app.use((req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  // Giả lập gán user
  req.user = { id: 1, role: "admin" };
  next();
});

app.get("/dashboard", (req: AuthenticatedRequest, res: Response) => {
  if (hasUser(req)) {
    res.send(`Hello ${req.user.role}, id = ${req.user.id}`);
  } else {
    res.status(401).send("Unauthorized");
  }
});
```

👉 Guard `hasUser` đảm bảo chỉ khi có `req.user`, ta mới truy cập field an toàn.

---

## 4. Form Validation

Client gửi dữ liệu **unknown**.
Ta cần **guard validate** trước khi convert sang domain type.

```ts
// Domain type
interface RegisterForm {
  username: string;
  password: string;
  age: number;
}

// Guard
function isRegisterForm(obj: any): obj is RegisterForm {
  return (
    typeof obj.username === "string" &&
    typeof obj.password === "string" &&
    typeof obj.age === "number"
  );
}

// Handler
function handleForm(input: unknown) {
  if (isRegisterForm(input)) {
    console.log("✅ Valid form:", input.username, input.age);
  } else {
    console.error("❌ Invalid form data");
  }
}

// Test
handleForm({ username: "alice", password: "123", age: 20 }); // hợp lệ
handleForm({ username: "bob", age: "20" }); // sai vì age không phải number
```

👉 Thực tế giúp chống injection, crash do dữ liệu không hợp lệ.

---

## 5. Security Guards

Trong hệ thống bảo mật, guard giúp chặn truy cập **field nhạy cảm** nếu type không đúng.

```ts
interface PublicUser {
  id: number;
  name: string;
}

interface PrivateUser extends PublicUser {
  email: string;
  phone: string;
}

type User = PublicUser | PrivateUser;

// Guard
function isPrivateUser(u: User): u is PrivateUser {
  return (u as PrivateUser).email !== undefined;
}

// Usage
function getUserInfo(u: User) {
  if (isPrivateUser(u)) {
    console.log("🔒 Sensitive info:", u.email, u.phone);
  } else {
    console.log("👤 Public info:", u.name);
  }
}

getUserInfo({ id: 1, name: "Alice" });
getUserInfo({ id: 2, name: "Bob", email: "bob@mail.com", phone: "12345" });
```

👉 Trong enterprise, tránh expose `email/phone` cho public API.

---

✅ Như vậy bạn đã có **code minh họa** cho từng case trong enterprise:

* API Response
* Redux Actions
* Express Middleware
* Form Validation
* Security

---

[<< Ngày 8](./Day08.md) | [Ngày 10 >>](./Day10.md)
