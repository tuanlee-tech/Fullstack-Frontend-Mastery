# 📘 Day 4 — Functions trong TypeScript

---

## 🎯 Mục tiêu

* Biết cách định nghĩa hàm với **type cho tham số và giá trị trả về**.
* Sử dụng **optional parameter** và **default parameter**.
* Hiểu **function overloads** và ứng dụng thực tế.
* Thực hành với ví dụ clean code.

---

## 1. Khai báo hàm có type

Trong TypeScript, bạn luôn nên chỉ rõ **kiểu của tham số** và **kiểu trả về** để tránh lỗi runtime.

```ts
function add(a: number, b: number): number {
  return a + b;
}

console.log(add(5, 3)); // 8
```

Nếu bạn không viết kiểu trả về (`: number`), TypeScript vẫn suy luận được, nhưng khi viết rõ sẽ giúp code rõ ràng và dễ debug hơn.

---

## 2. Hàm với Optional & Default Parameter

### Optional parameter

Dùng dấu `?`, tham số này có thể truyền hoặc không.

```ts
function greet(name: string, age?: number): string {
  return age ? `Xin chào ${name}, ${age} tuổi` : `Xin chào ${name}`;
}

console.log(greet("Alice"));       // Xin chào Alice
console.log(greet("Bob", 25));     // Xin chào Bob, 25 tuổi
```

### Default parameter

Dùng `=` để gán giá trị mặc định nếu không truyền.

```ts
function greet2(name: string, age: number = 18): string {
  return `Xin chào ${name}, ${age} tuổi`;
}

console.log(greet2("Charlie"));        // Xin chào Charlie, 18 tuổi
console.log(greet2("David", 30));      // Xin chào David, 30 tuổi
```

---

## 3. Hàm trả về `void` và `never`

* `void`: hàm không trả về gì.
* `never`: hàm không bao giờ kết thúc bình thường (luôn throw error hoặc vòng lặp vô tận).

```ts
function logMessage(msg: string): void {
  console.log("📢", msg);
}

function throwError(msg: string): never {
  throw new Error(msg);
}
```

---

## 4. Function Overloads

Overload = nhiều "chữ ký" (signatures) cho cùng 1 hàm.
Dùng khi hàm có thể nhận nhiều kiểu tham số và trả về kết quả khác nhau.

```ts
// Định nghĩa overload signatures
function format(input: number): string;
function format(input: string): string;

// Triển khai thực tế
function format(input: number | string): string {
  if (typeof input === "number") {
    return input.toFixed(2); // số thành chuỗi 2 số thập phân
  }
  return input.trim().toUpperCase(); // chuỗi in hoa
}

console.log(format(12.345));   // "12.35"
console.log(format(" hello ")); // "HELLO"
```

👉 Lợi ích: khi bạn dùng hàm, TypeScript sẽ gợi ý đúng kiểu kết quả cho từng loại tham số.

---

## 5. Function Type (Khai báo type cho hàm)

Bạn có thể định nghĩa **type cho function** bằng `type` hoặc `interface`.

```ts
type MathOperation = (a: number, b: number) => number;

const multiply: MathOperation = (x, y) => x * y;
const divide: MathOperation = (x, y) => x / y;

console.log(multiply(4, 5)); // 20
console.log(divide(20, 4));  // 5
```

---

## 6. Bài tập (kèm lời giải)

### Bài 1 (Level 1)

Viết hàm `square` nhận vào 1 số và trả về bình phương.

✅ Giải:

```ts
function square(n: number): number {
  return n * n;
}
console.log(square(6)); // 36
```

---

### Bài 2 (Level 2)

Viết hàm `isAdult` nhận vào `name: string, age?: number`.
Nếu có tuổi và ≥ 18 thì in `"Alice là người lớn"`, ngược lại `"Alice chưa đủ tuổi"`.
Nếu không truyền tuổi → `"Chưa rõ tuổi của Alice"`.

✅ Giải:

```ts
function isAdult(name: string, age?: number): string {
  if (age === undefined) return `Chưa rõ tuổi của ${name}`;
  return age >= 18 ? `${name} là người lớn` : `${name} chưa đủ tuổi`;
}

console.log(isAdult("Alice", 20)); // Alice là người lớn
console.log(isAdult("Bob", 15));   // Bob chưa đủ tuổi
console.log(isAdult("Charlie"));   // Chưa rõ tuổi của Charlie
```

---

### Bài 3 (Level 3)

Tạo hàm `calculate` overload:

* Nếu truyền vào `(a: number, b: number, op: "add" | "sub")` → trả về kết quả số.
* Nếu truyền vào `(a: string, b: string)` → nối chuỗi.

✅ Giải:

```ts
// Overload signatures
function calculate(a: number, b: number, op: "add" | "sub"): number;
function calculate(a: string, b: string): string;

// Triển khai thực tế
function calculate(a: number | string, b: number | string, op?: "add" | "sub"): number | string {
  if (typeof a === "number" && typeof b === "number") {
    return op === "sub" ? a - b : a + b;
  }
  if (typeof a === "string" && typeof b === "string") {
    return a + b;
  }
  throw new Error("Invalid arguments");
}

console.log(calculate(10, 5, "add")); // 15
console.log(calculate(10, 5, "sub")); // 5
console.log(calculate("Hello, ", "World!")); // Hello, World!
```

---

## 7. Mini Project: Calculator

```ts
type Operation = "add" | "sub" | "mul" | "div";

function calc(a: number, b: number, op: Operation): number {
  switch (op) {
    case "add": return a + b;
    case "sub": return a - b;
    case "mul": return a * b;
    case "div": return b !== 0 ? a / b : NaN;
  }
}

console.log(calc(10, 2, "add")); // 12
console.log(calc(10, 2, "div")); // 5
console.log(calc(10, 0, "div")); // NaN
```

---

## 📌 Kết luận

* Hàm trong TS luôn nên có type cho input và output.
* `?` = optional param, `=` = default param.
* `void` và `never` dùng để mô tả hành vi đặc biệt.
* Overload giúp viết hàm linh hoạt nhưng vẫn type-safe.
* Có thể định nghĩa **function type** riêng để tái sử dụng.

---

[<< Ngày 3](./Day03.md) | [Ngày 5 >>](./Day05.md)
