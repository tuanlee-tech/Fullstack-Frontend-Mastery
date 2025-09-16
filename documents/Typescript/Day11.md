🚀 **Day 11: Generics (Phần 1 — Functions, Constraints, Defaults)**. Đây là bước đầu tiên trong Phase 2: Core Mastery.

---

# 📘 Day 11: Generics (Phần 1)

## 🎯 Mục tiêu học

* Hiểu **generic function** và cách tái sử dụng type.
* Sử dụng **constraints** để giới hạn kiểu dữ liệu đầu vào.
* Áp dụng **default types** cho generic.
* Thấy được **ứng dụng trong enterprise** (type-safe API, reusable utility, form validation).

---

## 1. Generic Functions cơ bản

```ts
function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(42);      // num: number
const str = identity<string>("Alice"); // str: string
```

* `T` là **placeholder type**, được gán khi gọi function.
* Giúp **tái sử dụng code** với nhiều kiểu dữ liệu khác nhau.

---

### a. Type Inference

```ts
const inferred = identity("Hello"); // TS tự biết inferred: string
```

---

### b. Multiple Generics

```ts
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const merged = merge({ name: "Alice" }, { age: 22 });
// merged: { name: string; age: number }
```

✅ **Enterprise use**: merge nhiều object state, combine API responses, redux reducers.

---

## 2. Constraints (ràng buộc type)

```ts
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength([1,2,3]);          // ✅ array has length
logLength("hello");           // ✅ string has length
// logLength(42);             // ❌ Error, number không có length
```

* `extends` giúp **bảo đảm generic type có các thuộc tính bắt buộc**.
* Dùng cho **API input validation, collection, form validation**.

---

## 3. Default Generic Type

```ts
function wrap<T = string>(value: T): { value: T } {
  return { value };
}

const wrapped1 = wrap(123);    // T inferred là number
const wrapped2 = wrap();       // T mặc định string
```

* Hữu ích khi **generic function có thể dùng nhiều type nhưng muốn có fallback**.

---

## 4. Mini Project: Generic API Response Handler

### a. Types

```ts
type ApiResponse<T = any> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };
```

---

### b. Generic Function handleResponse

```ts
function handleResponse<T>(res: ApiResponse<T>) {
  switch (res.status) {
    case "success":
      console.log("✅ Data:", res.data);
      break;
    case "error":
      console.error("❌ Error:", res.message);
      break;
    case "loading":
      console.log("⏳ Loading...");
      break;
  }
}
```

---

### c. Test với nhiều type

```ts
handleResponse<{ id: number; name: string }>({
  status: "success",
  data: { id: 1, name: "Alice" },
});

handleResponse<string[]>({
  status: "success",
  data: ["apple", "banana", "cherry"],
});
```

✅ **Enterprise use**:

* Xử lý API response type-safe cho nhiều domain (User, Product, Order).
* Tái sử dụng function `handleResponse` cho nhiều endpoint.

---

## 5. Bài tập (có lời giải luôn)

### Level 1

* Viết generic function `firstElement<T>(arr: T[]): T | undefined` trả về phần tử đầu tiên.

```ts
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

console.log(firstElement([1,2,3]));      // 1
console.log(firstElement(["a","b"]));    // "a"
```

---

### Level 2

* Viết function `pluck<T, K extends keyof T>(items: T[], key: K): T[K][]`
* Lấy ra tất cả giá trị của key trong mảng object

```ts
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map(item => item[key]);
}

const users = [{id:1, name:"Alice"}, {id:2, name:"Bob"}];
console.log(pluck(users, "name")); // ["Alice","Bob"]
```

---

### Level 3

* Viết generic API handler cho `POST /login` và `POST /register`
* Return type là `ApiResponse<T>`
* Test với `User` và `{ token: string }`

```ts
function apiPost<T>(endpoint: string, body: any): ApiResponse<T> {
  if (endpoint === "/login") {
    return { status: "success", data: { token: "jwt-123" } as T };
  }
  if (endpoint === "/register") {
    return { status: "success", data: { id: 1, username: body.username } as T };
  }
  return { status: "error", message: "Unknown endpoint" };
}

console.log(apiPost<{ token: string }>("/login", {username:"alice"}));
console.log(apiPost<User>("/register", {username:"bob"}));
```

✅ Lời giải Level 3 cho phép **sử dụng cùng 1 generic API function cho nhiều endpoint khác nhau**, rất phổ biến trong enterprise TypeScript.

---

## 🔑 Key Takeaways Day 11

1. Generics giúp **tái sử dụng code type-safe**.
2. Constraints giới hạn type input, tăng an toàn.
3. Default generic type hữu ích khi không muốn luôn specify type.
4. Ứng dụng: API handler, utility functions, form validation, redux state, enterprise data flow.

---

[<< Ngày 10](./Day10.md) | [Ngày 12 >>](./Day12.md)