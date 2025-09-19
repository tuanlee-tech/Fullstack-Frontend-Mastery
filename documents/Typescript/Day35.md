# 🌌 Day 35 — Advanced Infer & Function Overload Types

---

## 1️⃣ Mục tiêu học tập

* Hiểu rõ cơ chế **`infer`** trong conditional types.
* Biết cách trích xuất **return type, parameter type, instance type** bằng `infer`.
* Làm việc với **function overloads** và viết utility để infer đúng overload.
* Ứng dụng trong enterprise: trích xuất type API handler, async thunk, hoặc React event handler.

---

## 2️⃣ Ôn tập nhanh về `infer`

`infer` cho phép **giả định một type tạm thời** để dùng trong conditional.

Ví dụ cơ bản:

```ts
type Return<T> = T extends (...args: any[]) => infer R ? R : never;

type Example = Return<() => string>; // string
```

Ở đây `infer R` giúp ta “trích xuất” type return từ function.

---

## 3️⃣ Infer nâng cao: Parameters & Return

### Trích xuất return type

```ts
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type A = MyReturnType<() => number>;      // number
type B = MyReturnType<(x: string) => any>;// any
```

### Trích xuất parameter type

```ts
type MyParameters<T> = T extends (...args: infer P) => any ? P : never;

type C = MyParameters<(x: string, y: number) => void>; 
// [string, number]
```

### Trích xuất constructor instance type

```ts
type MyInstance<T> = T extends new (...args: any[]) => infer R ? R : never;

class User {
  name: string = "Alice";
}

type D = MyInstance<typeof User>; 
// User
```

---

## 4️⃣ Infer trong Promise & Async

### Lấy type bên trong Promise

```ts
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type E = UnwrapPromise<Promise<number>>; // number
type F = UnwrapPromise<string>;          // string
```

### Lấy return type của async function

```ts
async function fetchUser() {
  return { id: 1, name: "Alice" };
}

type UserReturn = ReturnType<typeof fetchUser>; 
// Promise<{ id: number; name: string }>
type UserResolved = UnwrapPromise<UserReturn>; 
// { id: number; name: string }
```

---

## 5️⃣ Function Overloads & Infer

TypeScript cho phép **overload function**: nhiều signature → một implementation.

Ví dụ:

```ts
function toArray(x: string): string[];
function toArray(x: number): number[];
function toArray(x: any): any[] {
  return [x];
}
```

### Vấn đề

Làm sao để lấy đúng overload signature?

### Giải pháp: Extract overloads

```ts
type Overloaded = {
  (x: string): string[];
  (x: number): number[];
};

type OverloadReturn<T> =
  T extends (...args: any[]) => infer R ? R : never;

type R1 = OverloadReturn<Overloaded>; // string[] | number[]
```

👉 Mặc định TS hợp nhất các overload thành **union**.

---

## 6️⃣ Infer overload cụ thể bằng Indexed Access

Ta có thể lấy từng overload riêng:

```ts
type Overload1 = Overloaded extends {
  (x: string): infer R; 
  (...args: any[]): any;
} ? R : never;

type Overload2 = Overloaded extends {
  (x: number): infer R; 
  (...args: any[]): any;
} ? R : never;

type R1 = Overload1; // string[]
type R2 = Overload2; // number[]
```

---

## 7️⃣ Ứng dụng thực tế

### 1. API Handler Response

```ts
type ApiHandler = {
  (url: "/user"): Promise<{ id: number; name: string }>;
  (url: "/post"): Promise<{ id: number; title: string }>;
};

type ExtractResponse<T, U> =
  T extends (url: U) => Promise<infer R> ? R : never;

type UserRes = ExtractResponse<ApiHandler, "/user">;
// { id: number; name: string }
```

### 2. Redux AsyncThunk

```ts
type AsyncThunk = (...args: any[]) => Promise<any>;

type ThunkReturn<T> =
  T extends (...args: any[]) => Promise<infer R> ? R : never;

// giả sử fetchUser là async thunk
type UserData = ThunkReturn<typeof fetchUser>;
```

### 3. React Event Handler

```ts
type EventHandler<E> = (event: E) => void;

type ExtractEvent<T> =
  T extends (event: infer E) => void ? E : never;

type ClickEvent = ExtractEvent<React.MouseEventHandler<HTMLButtonElement>>;
// React.MouseEvent<HTMLButtonElement>
```

---

## 8️⃣ Bài tập

### Level 1

Tự viết lại utility:

* `MyReturnType<T>`
* `MyParameters<T>`
* `MyInstance<T>`

```ts
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Test
type A = MyReturnType<() => number>;        // number
type B = MyReturnType<(x: string) => void>; // void
```

✅ Giải thích:

* Dùng `infer R` để lấy kiểu return của function.
* Nếu T không phải function → trả về `never`.

```ts
type MyParameters<T> = T extends (...args: infer P) => any ? P : never;

// Test
type C = MyParameters<(x: string, y: number) => void>; 
// [string, number]
```
✅ Giải thích:

* `infer P` trích toàn bộ tuple parameters.
* Ví dụ `(x: string, y: number)` → `[string, number]`.


```ts
type MyInstance<T> = T extends new (...args: any[]) => infer R ? R : never;

// Test
class User {
  name: string = "Alice";
}
type D = MyInstance<typeof User>; 
// User
```

✅ Giải thích:

* `new (...args)` mô tả constructor signature.
* `infer R` lấy instance type của class.

### Level 2

Viết `UnwrapPromise<T>` để lấy type bên trong Promise.
Test với `Promise<number>` và `Promise<{id: number}>`.
```ts
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

// Test
type E = UnwrapPromise<Promise<number>>;          // number
type F = UnwrapPromise<Promise<{ id: number }>>;  // { id: number }
type G = UnwrapPromise<string>;                   // string
```

✅ Giải thích:

* Nếu type là `Promise<...>` → lấy ra bên trong.
* Nếu không phải Promise → giữ nguyên.


### Level 3

Cho API handler overload:

```ts
type Handler = {
  (url: "/user"): Promise<{ id: number; name: string }>;
  (url: "/post"): Promise<{ id: number; title: string }>;
};
```

Viết utility `ResponseOf<T, U>` để lấy response theo URL.

Ví dụ:

```ts
type A = ResponseOf<Handler, "/user">; 
// { id: number; name: string }
```

```ts
type ResponseOf<T, U> =
  T extends (url: U) => Promise<infer R> ? R : never;

// Test
type R1 = ResponseOf<Handler, "/user">;
// { id: number; name: string }

type R2 = ResponseOf<Handler, "/post">;
// { id: number; title: string }

type R3 = ResponseOf<Handler, "/other">;
// never
```

✅ Giải thích:

* `T extends (url: U) => Promise<infer R>`: kiểm tra xem overload có khớp với `url: U` không.
* Nếu có → lấy `R`.
* Nếu không có overload nào khớp → `never`.
---

# ✅ Checklist trước khi qua Day 36

* [ ] Biết cách dùng `infer` để trích xuất type.
* [ ] Thành thạo infer return, parameters, instance.
* [ ] Biết cách unwrap Promise và async return.
* [ ] Hiểu cách TypeScript xử lý overload function và trích xuất đúng overload.
* [ ] Áp dụng vào case thực tế: API handler, async thunk, React event handler.

---


---

📌 [<< Ngày 34](./Day34.md) | [Ngày 36 >>](./Day36.md)