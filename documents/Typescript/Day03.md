# 📘 **Day 3 — Arrays & Tuples trong TypeScript**

---

## 🎯 Mục tiêu hôm nay

* Biết cách khai báo **array** với type.
* Hiểu sự khác nhau giữa **array thông thường** và **tuple**.
* Làm quen với `readonly array`.
* Thực hành với ví dụ thực tế: quản lý danh sách users, tọa độ GPS, màu RGB.

---

## 1. Array trong TypeScript

### 🔹 Khai báo

Có 2 cách chính:

```ts
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ["a", "b", "c"];
```

👉 Hai cách tương đương, nhưng `T[]` ngắn gọn hơn, `Array<T>` hay dùng khi kết hợp với generics.

---

### 🔹 Mảng nhiều loại (union type)

```ts
let mixed: (string | number)[] = ["Alice", 25, "Bob", 30];
```

---

### 🔹 Readonly Array

Không cho phép thay đổi phần tử.

```ts
const ids: readonly number[] = [1, 2, 3];
// ids.push(4); ❌ Error
```

👉 Dùng khi bạn muốn dữ liệu **immutable** (không thay đổi được).

---

## 2. Tuple trong TypeScript

### 🔹 Định nghĩa

Tuple = array có số lượng phần tử cố định và mỗi phần tử có **type xác định**.

```ts
let user: [number, string];
user = [1, "Alice"]; // ✅
user = ["Alice", 1]; // ❌ sai thứ tự
```

---

### 🔹 Ứng dụng thực tế

1. **Tọa độ GPS**

```ts
let location: [number, number] = [21.0285, 105.8542]; // Hà Nội
```

2. **Màu RGB**

```ts
let red: [number, number, number] = [255, 0, 0];
```

3. **User Info**

```ts
let employee: [number, string, boolean] = [1, "Alice", true];
```

---

### 🔹 Tuple + optional

Có thể cho phép phần tử cuối cùng optional.

```ts
let person: [string, number?];
person = ["Alice"];      // OK
person = ["Bob", 25];    // OK
```

---

### 🔹 Tuple readonly

```ts
const rgb: readonly [number, number, number] = [255, 255, 255];
// rgb[0] = 100; ❌ Error
```

---

## 3. Bài tập (Exercises + Lời giải)

### 🔹 Level 1

Tạo một mảng `fruits` kiểu `string[]`, thêm vài tên trái cây và in ra console.

✅ Lời giải:

```ts
let fruits: string[] = ["apple", "banana", "mango"];
console.log(fruits);
```

---

### 🔹 Level 2

Tạo mảng `scores` kiểu `number[]`, viết hàm `averageScore` tính điểm trung bình.

✅ Lời giải:

```ts
let scores: number[] = [80, 90, 100];

function averageScore(scores: number[]): number {
  let total = scores.reduce((sum, s) => sum + s, 0);
  return total / scores.length;
}

console.log(averageScore(scores)); // 90
```

---

### 🔹 Level 3

Tạo **tuple** `UserProfile` gồm `[id: number, username: string, isAdmin: boolean]`.
Viết hàm `printUser` để in thông tin user từ tuple.

✅ Lời giải:

```ts
type UserProfile = [number, string, boolean];

function printUser(user: UserProfile): void {
  const [id, name, isAdmin] = user;
  console.log(
    `ID: ${id}, Name: ${name}, Admin: ${isAdmin ? "Yes" : "No"}`
  );
}

printUser([1, "Alice", true]);
printUser([2, "Bob", false]);
```

---

## 4. Mini Project: Danh sách Users

```ts
type User = [id: number, name: string, isOnline: boolean];

let users: User[] = [
  [1, "Alice", true],
  [2, "Bob", false],
  [3, "Charlie", true],
];

function showOnline(users: User[]): void {
  users.forEach(([id, name, isOnline]) => {
    if (isOnline) console.log(`🟢 ${name} (ID: ${id}) is online`);
  });
}

showOnline(users);
// 🟢 Alice (ID: 1) is online
// 🟢 Charlie (ID: 3) is online
```

---

## 5. Mini Summary

* Array: `T[]` hoặc `Array<T>`.
* Readonly array ngăn thay đổi dữ liệu.
* Tuple: mảng cố định số phần tử và type → dùng nhiều trong **toạ độ, màu sắc, record cố định**.
* `readonly tuple` rất hữu ích khi dữ liệu không được thay đổi.

---

[<< Ngày 2](./Day02.md) | [Ngày 4 >>](./Day04.md)