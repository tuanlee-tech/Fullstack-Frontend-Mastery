# 📘 Day 10: Debugging & Best Practices cho Newbie

## 🎯 Mục tiêu học

* Hiểu các kỹ thuật **debug code TypeScript** (compiler flags, logging, IDE tools).
* Biết cách áp dụng **best practices** để viết code rõ ràng, ít bug.
* Làm **mini project tích hợp** (API + Form + Redux style reducer) để thực hành.

---

## 1. Debugging trong TypeScript

### a. Compiler Flags hữu ích

Trong `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

* `strict`: bật toàn bộ strict mode.
* `noImplicitAny`: không cho phép biến có type `any` ngầm định.
* `strictNullChecks`: bắt buộc check `null`/`undefined`.
* `noUnusedLocals` / `noUnusedParameters`: cảnh báo biến/tham số không dùng.

👉 Đây là **điều kiện bắt buộc trong enterprise**.

---

### b. Debug với Logging

```ts
function debugLog<T>(msg: string, value: T): T {
  console.log(`[DEBUG] ${msg}:`, value);
  return value;
}

const users = debugLog("Fetched users", [{ id: 1, name: "Alice" }]);
```

👉 Kỹ thuật này giúp trace dữ liệu mà vẫn giữ type-safety.

---

### c. Debug trong VSCode

* Hover để xem inferred type.
* Dùng **Ctrl + Click** để đi đến định nghĩa.
* Dùng **TS Server plugin** để highlight type errors sớm.

---

## 2. Best Practices cho Newbie

1. **Luôn annotate public API**

   * Hàm, class, props → nên ghi rõ type.
   * Code nội bộ nhỏ có thể rely vào type inference.

2. **Dùng `unknown` thay vì `any`** khi nhận dữ liệu chưa xác định.

3. **Luôn viết Guard trước khi truy cập dữ liệu từ ngoài**.

4. **Giữ code nhỏ, dễ test** — tránh hàm dài > 30 dòng.

5. **Type trước, code sau** — nghĩ về model dữ liệu rồi mới implement.

---

## 3. Mini Project: API Response + Form Validation + Reducer

Chúng ta sẽ build một flow đơn giản:

* **Frontend** gửi form đăng ký.
* **Backend** giả lập trả về API response (`loading | success | error`).
* Dùng **reducer** để quản lý state form.
* Dùng **type guards** để validate dữ liệu.

---

### a. Types

```ts
// Domain model
interface User {
  id: number;
  username: string;
  age: number;
}

// API response generic
type ApiResponse<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

// Form data
interface RegisterForm {
  username: string;
  password: string;
  age: number;
}
```

---

### b. Guards

```ts
function isRegisterForm(obj: any): obj is RegisterForm {
  return (
    typeof obj.username === "string" &&
    typeof obj.password === "string" &&
    typeof obj.age === "number"
  );
}
```

---

### c. Reducer cho UI state

```ts
type FormAction =
  | { type: "SUBMIT" }
  | { type: "SUCCESS"; payload: User }
  | { type: "ERROR"; payload: string };

interface FormState {
  status: "idle" | "loading" | "success" | "error";
  user?: User;
  error?: string;
}

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SUBMIT":
      return { status: "loading" };
    case "SUCCESS":
      return { status: "success", user: action.payload };
    case "ERROR":
      return { status: "error", error: action.payload };
    default:
      const _exhaustive: never = action;
      return state;
  }
}
```

---

### d. Giả lập API + Flow xử lý

```ts
function fakeApiRegister(form: RegisterForm): ApiResponse<User> {
  if (form.username === "admin") {
    return { status: "error", message: "Username already taken" };
  }
  return {
    status: "success",
    data: { id: Date.now(), username: form.username, age: form.age },
  };
}

// Usage
let state: FormState = { status: "idle" };

// Submit
state = formReducer(state, { type: "SUBMIT" });
console.log(state);

// Validate form
const input: unknown = { username: "alice", password: "123", age: 22 };

if (isRegisterForm(input)) {
  const res = fakeApiRegister(input);

  if (res.status === "success") {
    state = formReducer(state, { type: "SUCCESS", payload: res.data });
  } else if (res.status === "error") {
    state = formReducer(state, { type: "ERROR", payload: res.message });
  }
} else {
  state = formReducer(state, { type: "ERROR", payload: "Invalid form" });
}

console.log(state);
```

---

## 4. Kết quả

* Nếu form hợp lệ → `success`, state có `user`.
* Nếu sai hoặc API báo lỗi → `error`, state có `error message`.

👉 Đây là **pattern chuẩn enterprise**:

* **API response** type-safe.
* **Reducer** cho UI state.
* **Guard** validate dữ liệu.
* **Exhaustiveness check** đảm bảo không bỏ sót case.

---

## 5. Bài tập

### Level 1

* Thêm trạng thái `unauthorized` vào `ApiResponse`.
* Update reducer để handle.

### Level 2

* Viết guard validate `LoginForm` (username, password).
* Fake API login trả về token.

### Level 3

* Tích hợp cả `RegisterForm` & `LoginForm` vào cùng một reducer.
* Dùng discriminated union cho actions.

---


# 📘 Day 10 — Bài tập & Lời giải

## 🔹 Level 1 — Thêm trạng thái `unauthorized`

Mở rộng `ApiResponse` + reducer:

```ts
type ApiResponse<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string }
  | { status: "unauthorized"; redirectUrl: string };

type FormAction =
  | { type: "SUBMIT" }
  | { type: "SUCCESS"; payload: User }
  | { type: "ERROR"; payload: string }
  | { type: "UNAUTHORIZED"; payload: string };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SUBMIT":
      return { status: "loading" };
    case "SUCCESS":
      return { status: "success", user: action.payload };
    case "ERROR":
      return { status: "error", error: action.payload };
    case "UNAUTHORIZED":
      return { status: "error", error: "Unauthorized, redirect to " + action.payload };
    default:
      const _never: never = action;
      return state;
  }
}
```

Fake API:

```ts
function fakeApiRegister(form: RegisterForm): ApiResponse<User> {
  if (form.username === "hacker") {
    return { status: "unauthorized", redirectUrl: "/login" };
  }
  if (form.username === "admin") {
    return { status: "error", message: "Username already taken" };
  }
  return {
    status: "success",
    data: { id: Date.now(), username: form.username, age: form.age },
  };
}
```

---

## 🔹 Level 2 — Guard cho `LoginForm`

```ts
interface LoginForm {
  username: string;
  password: string;
}

// Guard
function isLoginForm(obj: any): obj is LoginForm {
  return (
    typeof obj.username === "string" &&
    typeof obj.password === "string"
  );
}

// Fake API login
function fakeApiLogin(form: LoginForm): ApiResponse<{ token: string }> {
  if (form.username === "guest") {
    return { status: "unauthorized", redirectUrl: "/login" };
  }
  if (form.password !== "123") {
    return { status: "error", message: "Wrong password" };
  }
  return { status: "success", data: { token: "jwt-token-abc" } };
}
```

---

## 🔹 Level 3 — Hợp nhất `RegisterForm` & `LoginForm` trong Reducer

Định nghĩa **discriminated union** cho actions:

```ts
type AuthAction =
  | { type: "SUBMIT" }
  | { type: "REGISTER_SUCCESS"; payload: User }
  | { type: "LOGIN_SUCCESS"; payload: { token: string } }
  | { type: "ERROR"; payload: string }
  | { type: "UNAUTHORIZED"; payload: string };

interface AuthState {
  status: "idle" | "loading" | "authenticated" | "error";
  user?: User;
  token?: string;
  error?: string;
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SUBMIT":
      return { status: "loading" };
    case "REGISTER_SUCCESS":
      return { status: "authenticated", user: action.payload };
    case "LOGIN_SUCCESS":
      return { status: "authenticated", token: action.payload.token };
    case "ERROR":
      return { status: "error", error: action.payload };
    case "UNAUTHORIZED":
      return { status: "error", error: "Unauthorized, redirect to " + action.payload };
    default:
      const _never: never = action;
      return state;
  }
}
```

---

## 🔹 Flow tổng hợp

```ts
let state: AuthState = { status: "idle" };

// Input giả lập
const loginInput: unknown = { username: "alice", password: "123" };
const registerInput: unknown = { username: "hacker", password: "xxx", age: 20 };

// Xử lý login
state = authReducer(state, { type: "SUBMIT" });
if (isLoginForm(loginInput)) {
  const res = fakeApiLogin(loginInput);
  if (res.status === "success") {
    state = authReducer(state, { type: "LOGIN_SUCCESS", payload: res.data });
  } else if (res.status === "error") {
    state = authReducer(state, { type: "ERROR", payload: res.message });
  } else if (res.status === "unauthorized") {
    state = authReducer(state, { type: "UNAUTHORIZED", payload: res.redirectUrl });
  }
}
console.log("Login state:", state);

// Xử lý register
state = authReducer(state, { type: "SUBMIT" });
if (isRegisterForm(registerInput)) {
  const res = fakeApiRegister(registerInput);
  if (res.status === "success") {
    state = authReducer(state, { type: "REGISTER_SUCCESS", payload: res.data });
  } else if (res.status === "error") {
    state = authReducer(state, { type: "ERROR", payload: res.message });
  } else if (res.status === "unauthorized") {
    state = authReducer(state, { type: "UNAUTHORIZED", payload: res.redirectUrl });
  }
}
console.log("Register state:", state);
```

---

## ✅ Kết quả chạy thử

* Nếu đăng nhập đúng → `LOGIN_SUCCESS` → state có `token`.
* Nếu đăng ký hợp lệ → `REGISTER_SUCCESS` → state có `user`.
* Nếu sai dữ liệu → `ERROR`.
* Nếu bị chặn (username `"hacker"` hoặc `"guest"`) → `UNAUTHORIZED`.

👉 Đây là một mini project hoàn chỉnh cho **Day 10**:

* Có **guards** để validate dữ liệu form.
* Có **API giả lập** trả về discriminated union.
* Có **reducer enterprise** quản lý state.
* Có **exhaustiveness check** tránh thiếu case.

---

# 📦 Day 10 — Project Hoàn Chỉnh

## 1. Cấu trúc file

```
day10/
 ├─ package.json
 ├─ tsconfig.json
 └─ index.ts
```

---

## 2. `package.json`

```json
{
  "name": "day10-project",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "ts-node index.ts"
  },
  "dependencies": {
    "ts-node": "^10.9.2",
    "typescript": "^5.4.0"
  }
}
```

---

## 3. `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

---

## 4. `index.ts`

```ts
// -----------------------------
// Domain Models
// -----------------------------
interface User {
  id: number;
  username: string;
  age: number;
}

interface RegisterForm {
  username: string;
  password: string;
  age: number;
}

interface LoginForm {
  username: string;
  password: string;
}

// -----------------------------
// Type Guards
// -----------------------------
function isRegisterForm(obj: any): obj is RegisterForm {
  return (
    typeof obj.username === "string" &&
    typeof obj.password === "string" &&
    typeof obj.age === "number"
  );
}

function isLoginForm(obj: any): obj is LoginForm {
  return (
    typeof obj.username === "string" &&
    typeof obj.password === "string"
  );
}

// -----------------------------
// API Response (Discriminated Union)
// -----------------------------
type ApiResponse<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string }
  | { status: "unauthorized"; redirectUrl: string };

// -----------------------------
// Fake API Implementations
// -----------------------------
function fakeApiRegister(form: RegisterForm): ApiResponse<User> {
  if (form.username === "hacker") {
    return { status: "unauthorized", redirectUrl: "/login" };
  }
  if (form.username === "admin") {
    return { status: "error", message: "Username already taken" };
  }
  return {
    status: "success",
    data: { id: Date.now(), username: form.username, age: form.age },
  };
}

function fakeApiLogin(form: LoginForm): ApiResponse<{ token: string }> {
  if (form.username === "guest") {
    return { status: "unauthorized", redirectUrl: "/login" };
  }
  if (form.password !== "123") {
    return { status: "error", message: "Wrong password" };
  }
  return { status: "success", data: { token: "jwt-token-abc" } };
}

// -----------------------------
// Reducer & State
// -----------------------------
type AuthAction =
  | { type: "SUBMIT" }
  | { type: "REGISTER_SUCCESS"; payload: User }
  | { type: "LOGIN_SUCCESS"; payload: { token: string } }
  | { type: "ERROR"; payload: string }
  | { type: "UNAUTHORIZED"; payload: string };

interface AuthState {
  status: "idle" | "loading" | "authenticated" | "error";
  user?: User;
  token?: string;
  error?: string;
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SUBMIT":
      return { status: "loading" };
    case "REGISTER_SUCCESS":
      return { status: "authenticated", user: action.payload };
    case "LOGIN_SUCCESS":
      return { status: "authenticated", token: action.payload.token };
    case "ERROR":
      return { status: "error", error: action.payload };
    case "UNAUTHORIZED":
      return { status: "error", error: "Unauthorized, redirect to " + action.payload };
    default:
      const _never: never = action;
      return state;
  }
}

// -----------------------------
// Simulate Flow
// -----------------------------
let state: AuthState = { status: "idle" };

// Test Login
console.log("\n--- LOGIN FLOW ---");
const loginInput: unknown = { username: "alice", password: "123" };
state = authReducer(state, { type: "SUBMIT" });
if (isLoginForm(loginInput)) {
  const res = fakeApiLogin(loginInput);
  if (res.status === "success") {
    state = authReducer(state, { type: "LOGIN_SUCCESS", payload: res.data });
  } else if (res.status === "error") {
    state = authReducer(state, { type: "ERROR", payload: res.message });
  } else if (res.status === "unauthorized") {
    state = authReducer(state, { type: "UNAUTHORIZED", payload: res.redirectUrl });
  }
}
console.log("Login state:", state);

// Test Register
console.log("\n--- REGISTER FLOW ---");
const registerInput: unknown = { username: "hacker", password: "xxx", age: 20 };
state = authReducer(state, { type: "SUBMIT" });
if (isRegisterForm(registerInput)) {
  const res = fakeApiRegister(registerInput);
  if (res.status === "success") {
    state = authReducer(state, { type: "REGISTER_SUCCESS", payload: res.data });
  } else if (res.status === "error") {
    state = authReducer(state, { type: "ERROR", payload: res.message });
  } else if (res.status === "unauthorized") {
    state = authReducer(state, { type: "UNAUTHORIZED", payload: res.redirectUrl });
  }
}
console.log("Register state:", state);
```

---

## 5. Chạy thử

```bash
npm install
npm start
```

✅ Kết quả hiển thị:

* `LOGIN FLOW` → thành công → có `token`.
* `REGISTER FLOW` → bị từ chối vì `"hacker"` → Unauthorized → redirect.

---

 **Mini recap Phase 1 (Day 1 → Day 10)** để bạn nhìn tổng quan và chuẩn bị bước sang Phase 2 — Generics.

---

# 📘 Phase 1 Recap: Foundation (Day 1 → Day 10)

| Ngày       | Kiến thức chính                                                       | Code ví dụ / Enterprise Use Case                                                                     | Ghi chú                                                          |                                                   |
| ---------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------- |
| **Day 1**  | Giới thiệu TypeScript, setup, `tsconfig.json`, Compile vs Runtime     | In ra console `"Hello TS"`; bật `strict` mode                                                        | Hiểu compile-time type checking                                  |                                                   |
| **Day 2**  | Basic Types: `string`, `number`, `boolean`, `any`, `unknown`, `never` | `let x: string = "Alice"; let y: unknown = fetchData();`                                             | `unknown` vs `any` quan trọng cho safety                         |                                                   |
| **Day 3**  | Arrays, Tuples, Readonly, Destructuring                               | `const arr: readonly number[] = [1,2,3]; const [a,b] = arr;`                                         | Học cách quản lý collection an toàn                              |                                                   |
| **Day 4**  | Functions: annotation, default, optional, overloads                   | `function sum(a: number, b: number = 0): number {}`                                                  | Biết khai báo type cho params & return                           |                                                   |
| **Day 5**  | Objects & Type Aliases                                                | `type User = { id: number; name: string; }`                                                          | Tái sử dụng type, dễ mở rộng                                     |                                                   |
| **Day 6**  | Interfaces vs Types, Declaration Merging                              | `interface User { id: number }; interface User { name: string; }`                                    | Interface merge giúp mở rộng module                              |                                                   |
| **Day 7**  | Enums & Literal Types                                                 | \`enum Role { Admin, User }; type Status = "active"                                                  | "inactive"\`                                                     | Sử dụng union/literal types để safe switch-case   |
| **Day 8**  | Union & Intersection Types                                            | \`type A = {x\:number}                                                                               | {y\:number}; type B = {x\:number}&{y\:number};\`                 | Áp dụng cho API response, Redux state composition |
| **Day 9**  | Type Narrowing & Guards                                               | `typeof`, `instanceof`, custom guards; Mini use case: API, Redux, Express, Form Validation, Security | Discriminated union + guard giúp code enterprise an toàn         |                                                   |
| **Day 10** | Debugging & Best Practices + Mini Project tích hợp                    | Mini project: Form submit → API response → reducer; guards validate form; exhaustive switch-case     | Tổng hợp tất cả kiến thức foundation, có flow enterprise thực tế |                                                   |

---

## ✅ Key Takeaways Phase 1

1. **Type Safety**: Biết declare types cho mọi biến, hàm, API response → tránh runtime bug.
2. **Discriminated Union + Guards**: Giúp xử lý dữ liệu từ API / form / middleware an toàn.
3. **Reducer Pattern**: Quản lý state UI/UX an toàn, đảm bảo exhaustiveness.
4. **Best Practices**:

   * `strict` mode + `noImplicitAny`
   * Guard dữ liệu từ client
   * Nguyên tắc nhỏ, dễ test, dễ maintain.
5. **Mini Project Integration**: Tập làm quen với flow enterprise: form → validate → API → reducer → UI state.

---

💡 Phase 1 kết thúc, bạn đã đủ **nền tảng để bước sang Phase 2 — Core Mastery**, bắt đầu với **Generics**, đây là kiến thức cực kỳ quan trọng cho việc **tái sử dụng code, type-safe API, builder patterns và enterprise patterns**.

---



[<< Ngày 9](./Day09.md) | [Ngày 11 >>](./Day11.md)