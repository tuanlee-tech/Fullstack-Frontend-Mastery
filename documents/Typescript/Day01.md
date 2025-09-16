# 📘 **Day 1 — Giới thiệu TypeScript & Môi trường phát triển**

---

## 🎯 Mục tiêu học hôm nay

* Hiểu **TypeScript là gì** và tại sao quan trọng.
* Cài đặt môi trường, biên dịch file `.ts` → `.js`.
* Phân biệt **Compile-time vs Runtime**.
* Viết chương trình TypeScript đầu tiên.

---

## 1. TypeScript là gì?

* **TypeScript (TS)** = **JavaScript + Types**.
* Được phát triển bởi Microsoft.
* Chạy được ở mọi nơi mà JS chạy (browser, Node.js).

👉 Điểm mạnh:

* **Static Typing** → lỗi được phát hiện ngay khi code, trước khi chạy.
* **Better tooling** → IntelliSense, autocomplete, refactor an toàn.
* **Large scale support** → dễ quản lý dự án enterprise.

Ví dụ:

```ts
// JavaScript
function sum(a, b) {
  return a + b;
}

console.log(sum("1", 2)); // ❌ Bug tiềm ẩn: kết quả "12"
```

```ts
// TypeScript
function sum(a: number, b: number): number {
  return a + b;
}

console.log(sum("1", 2)); 
// ❌ Lỗi compile-time: Argument of type 'string' is not assignable to parameter of type 'number'
```

---

## 2. Compile-time vs Runtime

* **Compile-time (khi build)**: TS kiểm tra type, syntax, flag config.
* **Runtime (khi chạy code thật)**: JS thực sự chạy trong browser/Node.

👉 TS chỉ tồn tại lúc **compile**. Sau khi build → chỉ còn **JS thuần**.

---

## 3. Setup Môi trường

1. Cài Node.js (>= 18).
2. Tạo project:

```bash
mkdir ts-day1 && cd ts-day1
npm init -y
npm install typescript -D
npx tsc --init
```

3. Tạo file `index.ts`:

```ts
function greet(name: string): string {
  return `Hello, ${name}`;
}

console.log(greet("Alice"));
// console.log(greet(123)); ❌ compile-time error
```

4. Compile & run:

```bash
npx tsc index.ts
node index.js
```

---

## 4. Giải thích `tsconfig.json`

File `tsconfig.json` điều khiển cách TS compile. Một số flag quan trọng:

* `"target": "ES2020"` → JS version output.
* `"strict": true` → bật strict type checking.
* `"outDir": "./dist"` → folder chứa JS sau khi build.
* `"noImplicitAny": true` → không cho biến có type `any` mà không khai báo rõ.

---

## 5. Bài tập (Exercises + Lời giải)

### 🔹 Level 1

1. Tạo file `hello.ts`, viết hàm `hello(name: string)` trả về `"Hello, <name>"`.
2. Compile và chạy thử với `node`.

✅ Lời giải:

```ts
function hello(name: string): string {
  return `Hello, ${name}`;
}

console.log(hello("Bob"));
```

---

### 🔹 Level 2

Viết hàm `square` nhận vào một `number` và trả về bình phương. Test với số 5 và "hi".

✅ Lời giải:

```ts
function square(n: number): number {
  return n * n;
}

console.log(square(5));   // ✅ 25
// console.log(square("hi")); ❌ compile-time error
```

---

### 🔹 Level 3

Tạo một hàm `safeDivide(a: number, b: number)` trả về thương số.

* Nếu `b = 0` thì **compile-time** vẫn ok (vì TS không biết giá trị runtime).
* Nhưng phải xử lý lỗi **runtime** bằng `throw`.

✅ Lời giải:

```ts
function safeDivide(a: number, b: number): number {
  if (b === 0) throw new Error("Cannot divide by zero");
  return a / b;
}

console.log(safeDivide(10, 2));  // ✅ 5
console.log(safeDivide(10, 0));  // ❌ runtime error
```

👉 Đây là ví dụ rõ nhất giữa **compile-time check (type)** và **runtime check (logic)**.

---

## 6. Mini Summary

* TS = JS + Types.
* Compile-time vs Runtime khác nhau.
* Dùng `tsconfig.json` để kiểm soát compiler.
* Newbie: hiểu cách setup & chạy file.
* Senior insight: TS chỉ đảm bảo **type safety**, không thay thế được **runtime validation**.
[Ngày 2 >>](./Day02.md)