# 📘 Day 6 — Interfaces vs Types

---

## 🎯 Mục tiêu

* Hiểu sự khác nhau giữa **interface** và **type alias**.
* Biết cách **extends interface** và **union type**.
* Thực hành **declaration merging** (tính năng đặc biệt chỉ có ở interface).
* Biết khi nào dùng interface, khi nào dùng type trong enterprise project.

---

## 1. Interface cơ bản

```ts
interface User {
  id: number;
  name: string;
  isAdmin: boolean;
}

const u: User = { id: 1, name: "Alice", isAdmin: true };
```

👉 Interface giống như bản thiết kế của object.

---

## 2. So sánh Type Alias và Interface

```ts
// Type alias
type UserType = {
  id: number;
  name: string;
};

// Interface
interface UserInterface {
  id: number;
  name: string;
}
```

**Điểm chung:**

* Đều có thể mô tả cấu trúc object.
* Đều hỗ trợ `readonly`, `?` (optional).

**Khác biệt:**

* `type` dùng được với **union** và **intersection**.
* `interface` có thể **extends** nhiều interface khác và hỗ trợ **declaration merging**.

---

## 3. Extending Interface

Interface có thể kế thừa từ interface khác:

```ts
interface Person {
  id: number;
  name: string;
}

interface Employee extends Person {
  department: string;
}

const e: Employee = { id: 1, name: "Alice", department: "IT" };
```

👉 Rất giống kế thừa trong class.

---

## 4. Union & Intersection (Type mạnh hơn Interface)

```ts
// Union chỉ có ở type
type Status = "active" | "inactive" | "pending";

// Intersection
type Audit = { createdAt: Date };
type User = { id: number; name: string };

type AuditedUser = User & Audit;
```

👉 Trong enterprise, khi bạn cần tạo **union type phức tạp** (ví dụ API response), thường phải dùng `type`.

---

## 5. Declaration Merging (đặc biệt của Interface)

Interface có thể được định nghĩa nhiều lần, và TypeScript sẽ **gộp chúng lại**.

```ts
interface Product {
  id: string;
  name: string;
}

// Khai báo thêm
interface Product {
  price: number;
}

const p: Product = { id: "p1", name: "Laptop", price: 1200 };
```

👉 Rất hữu ích khi **mở rộng library có sẵn** (vd: thêm field vào Express Request).

---

## 6. Ứng dụng trong enterprise

* **Interface** → thường dùng cho **domain model** (User, Product, Order…), vì có khả năng mở rộng và dễ tích hợp với thư viện khác.
* **Type alias** → dùng khi cần **union / intersection / utility types** để xử lý logic phức tạp (vd: API Response, Redux action, GraphQL types).

Ví dụ thực tế với Express middleware:

```ts
// Mở rộng interface có sẵn
declare module "express" {
  interface Request {
    userId?: string;
  }
}
```

👉 Đây là cách enterprise project thường mở rộng thư viện mà không phải sửa code gốc.

---

## 7. Bài tập (có lời giải)

### Bài 1 (Level 1)

Tạo interface `Book` với `id, title, author`. Tạo một object từ interface này.

✅ Giải:

```ts
interface Book {
  id: number;
  title: string;
  author: string;
}

const b: Book = { id: 1, title: "Clean Code", author: "Robert C. Martin" };
```

---

### Bài 2 (Level 2)

Tạo interface `Person`, rồi tạo interface `Student` extends `Person` thêm `grade: number`.
Tạo object `s1` kiểu `Student`.

✅ Giải:

```ts
interface Person {
  id: number;
  name: string;
}

interface Student extends Person {
  grade: number;
}

const s1: Student = { id: 101, name: "Alice", grade: 9 };
```

---

### Bài 3 (Level 3)

Dùng **declaration merging** mở rộng `Car` interface để thêm field `owner?: string`.

✅ Giải:

```ts
interface Car {
  id: string;
  brand: string;
}

// Mở rộng interface
interface Car {
  owner?: string;
}

const c: Car = { id: "C001", brand: "Toyota", owner: "Bob" };
```

---

## 8. Mini Project: User Management

```ts
interface BaseUser {
  id: number;
  name: string;
}

interface Admin extends BaseUser {
  role: "admin";
  permissions: string[];
}

interface NormalUser extends BaseUser {
  role: "user";
  email: string;
}

type AppUser = Admin | NormalUser;

function printUser(user: AppUser) {
  if (user.role === "admin") {
    console.log(`👑 Admin ${user.name}, quyền: ${user.permissions.join(", ")}`);
  } else {
    console.log(`👤 User ${user.name}, email: ${user.email}`);
  }
}

const u1: Admin = { id: 1, name: "Alice", role: "admin", permissions: ["manage_users", "delete_posts"] };
const u2: NormalUser = { id: 2, name: "Bob", role: "user", email: "bob@mail.com" };

printUser(u1);
printUser(u2);
```

👉 Đây là pattern enterprise thường dùng trong **quản lý user role & permission**.

---

## 📌 Kết luận

* `interface` và `type` đều mô tả object.
* `interface` mạnh ở khả năng **mở rộng & declaration merging** → dùng nhiều trong domain model.
* `type` mạnh ở **union, intersection** → dùng nhiều trong logic và API.
* Trong enterprise:

  * **interface** cho model chính.
  * **type** cho logic phức tạp, API response, utility.

---


[<< Ngày 5](./Day05.md) | [Ngày 7 >>](./Day07.md)

