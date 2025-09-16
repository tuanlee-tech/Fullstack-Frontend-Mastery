# 📘 **Day 2 — Basic Types & Type Annotations**

---

## 🎯 Mục tiêu học hôm nay

* Hiểu và sử dụng các **kiểu dữ liệu cơ bản** trong TypeScript.
* Biết cách **gắn type annotation** cho biến, hàm.
* Hiểu rõ các type đặc biệt: `any`, `unknown`, `never`, `void`.
* Biết chọn type nào cho từng tình huống.

---

## 1. Type Annotations là gì?

👉 **Type Annotation** = khai báo kiểu cho biến, tham số, hàm.
Cú pháp:

```ts
let variableName: type = value;
```

Ví dụ:

```ts
let age: number = 25;
let username: string = "Alice";
let isAdmin: boolean = true;
```

---

## 2. Các kiểu cơ bản

### 🔹 number

```ts
let count: number = 10;
let pi: number = 3.14;
```

### 🔹 string

```ts
let message: string = "Hello TypeScript";
```

### 🔹 boolean

```ts
let isLoggedIn: boolean = false;
```

### 🔹 any (hạn chế dùng ❌)

* Cho phép gán bất kỳ kiểu gì → mất kiểm soát type safety.

```ts
let data: any = 10;
data = "Hello";
data = { name: "Alice" };
```

👉 Chỉ dùng khi migrate JS cũ sang TS hoặc làm prototype.

---

### 🔹 unknown (an toàn hơn `any`)

* Cũng nhận mọi giá trị, nhưng **bắt buộc check trước khi dùng**.

```ts
let input: unknown = "Hello";

if (typeof input === "string") {
  console.log(input.toUpperCase()); // ✅ safe
}
```

---

### 🔹 never

* Biểu thị giá trị **không bao giờ xảy ra**.
* Dùng cho function luôn throw error hoặc loop vô tận.

```ts
function fail(message: string): never {
  throw new Error(message);
}
```

---

### 🔹 void

* Hàm không trả về gì.

```ts
function logMessage(msg: string): void {
  console.log("📢", msg);
}
```

---

## 3. Khai báo nhiều biến

```ts
let id: number, title: string, published: boolean;
id = 1;
title = "TS Guide";
published = true;
```

---

## 4. Type Inference

TS có thể tự đoán kiểu khi gán giá trị.

```ts
let x = 100;   // inferred là number
// x = "hi";   // ❌ error
```

👉 Senior dev thường **chỉ khai báo type khi cần thiết** (ví dụ: API response, function param).

---

## 5. Bài tập (Exercises + Lời giải)

### 🔹 Level 1

1. Tạo biến `title` kiểu `string`, `views` kiểu `number`, `isPublished` kiểu `boolean`.
2. In ra console.

✅ Lời giải:

```ts
let title: string = "My Blog";
let views: number = 100;
let isPublished: boolean = true;

console.log(title, views, isPublished);
```

---

### 🔹 Level 2

Viết hàm `greet` nhận `name: string` và trả về `"Hello, <name>"`.
Nếu name không phải string → báo lỗi compile-time.

✅ Lời giải:

```ts
function greet(name: string): string {
  return `Hello, ${name}`;
}

console.log(greet("Alice"));
// console.log(greet(123)); ❌ compile error
```

---

### 🔹 Level 3

Tạo hàm `parseInput(input: unknown)`:

* Nếu input là `string` → return string length.
* Nếu input là `number` → return bình phương.
* Nếu input là type khác → throw error (never).

✅ Lời giải:

```ts
function parseInput(input: unknown): number {
  if (typeof input === "string") {
    return input.length;
  }
  if (typeof input === "number") {
    return input * input;
  }
  throw new Error("Unsupported type"); // never
}

console.log(parseInput("Hello"));  // 5
console.log(parseInput(4));        // 16
// console.log(parseInput(true));  // runtime error
```

👉 Đây là ví dụ quan trọng: **TS giúp check compile-time**, nhưng runtime validation vẫn cần viết code.

---

## 6. Mini Summary

* Dùng **annotation** để khai báo rõ type.
* Tránh lạm dụng `any`, thay vào đó dùng `unknown`.
* `never` dành cho case không bao giờ xảy ra.
* `void` dành cho hàm không return.
* TS có **type inference** nhưng vẫn nên khai báo type cho input/output của hàm.
---
[<< Ngày 1](./Day01.md) | [Ngày 3 >>](./Day03.md)