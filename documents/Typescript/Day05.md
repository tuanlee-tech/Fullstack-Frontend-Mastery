# 📘 Day 5 — Objects & Type Aliases

---

## 🎯 Mục tiêu

* Hiểu cách định nghĩa **object type** trong TypeScript.
* Sử dụng **readonly** và **optional property**.
* Biết cách dùng **Type Alias** để tái sử dụng kiểu dữ liệu.
* Thực hành với ví dụ thực tế: quản lý user, product, và mini project todo list.

---

## 1. Định nghĩa Object type cơ bản

```ts
let user: {
  id: number;
  name: string;
  isAdmin: boolean;
};

user = {
  id: 1,
  name: "Alice",
  isAdmin: true,
};
```

👉 Nếu bạn gán sai kiểu hoặc thiếu field thì TS sẽ báo lỗi.

---

## 2. Optional Property (`?`)

Cho phép một thuộc tính có thể có hoặc không.

```ts
type User = {
  id: number;
  name: string;
  email?: string; // optional
};

const u1: User = { id: 1, name: "Alice" };
const u2: User = { id: 2, name: "Bob", email: "bob@mail.com" };
```

---

## 3. Readonly Property

Ngăn không cho sửa giá trị sau khi đã gán.

```ts
type Product = {
  readonly id: string;
  name: string;
  price: number;
};

const p: Product = { id: "p1", name: "Laptop", price: 1000 };

// p.id = "p2"; ❌ Error
p.price = 900; // ✅ OK
```

👉 Dùng `readonly` để bảo vệ **ID, khóa chính, dữ liệu không thay đổi**.

---

## 4. Type Alias

Alias = đặt tên cho một kiểu dữ liệu, giúp code dễ đọc và tái sử dụng.

```ts
type Point = {
  x: number;
  y: number;
};

function printPoint(p: Point) {
  console.log(`(${p.x}, ${p.y})`);
}

printPoint({ x: 10, y: 20 });
```

---

## 5. Type Aliases phức tạp

Type Alias có thể kết hợp **union**, **intersection**, **function type**.

```ts
type ID = string | number;
type Status = "active" | "inactive" | "pending";

type UserProfile = {
  id: ID;
  name: string;
  status: Status;
};
```

---

## 6. Lồng object trong object

```ts
type Address = {
  street: string;
  city: string;
};

type Customer = {
  id: number;
  name: string;
  address: Address;
};

const c: Customer = {
  id: 1,
  name: "Alice",
  address: { street: "123 Main St", city: "Hanoi" },
};
```

---

## 7. Bài tập (có lời giải)

### Bài 1 (Level 1)

Tạo type `Book` gồm `id: number, title: string, author: string`. Tạo 1 biến kiểu `Book`.

✅ Giải:

```ts
type Book = {
  id: number;
  title: string;
  author: string;
};

const b1: Book = { id: 1, title: "Clean Code", author: "Robert C. Martin" };
```

---

### Bài 2 (Level 2)

Tạo type `Car` với `readonly id: string, brand: string, year: number, owner?: string`.
Viết hàm `printCar` in thông tin xe.

✅ Giải:

```ts
type Car = {
  readonly id: string;
  brand: string;
  year: number;
  owner?: string;
};

function printCar(car: Car): void {
  console.log(
    `Car ${car.id}: ${car.brand} (${car.year}) - Owner: ${car.owner ?? "N/A"}`
  );
}

const c1: Car = { id: "C001", brand: "Toyota", year: 2020 };
printCar(c1);
```

---

### Bài 3 (Level 3)

Tạo type `Todo` gồm `id: number, title: string, done: boolean`.
Tạo mảng `todos: Todo[]` và viết hàm `toggleTodo(id)` để đổi trạng thái done.

✅ Giải:

```ts
type Todo = {
  id: number;
  title: string;
  done: boolean;
};

let todos: Todo[] = [
  { id: 1, title: "Học TypeScript", done: false },
  { id: 2, title: "Viết code", done: true },
];

function toggleTodo(id: number): void {
  todos = todos.map((t) =>
    t.id === id ? { ...t, done: !t.done } : t
  );
}

toggleTodo(1);
console.log(todos);
/*
[
  { id: 1, title: "Học TypeScript", done: true },
  { id: 2, title: "Viết code", done: true }
]
*/
```

---

## 8. Mini Project: Todo List

```ts
type Todo = {
  readonly id: number;
  title: string;
  done: boolean;
};

let todos: Todo[] = [];

function addTodo(title: string): void {
  const newTodo: Todo = { id: Date.now(), title, done: false };
  todos.push(newTodo);
}

function toggleTodo(id: number): void {
  todos = todos.map((t) =>
    t.id === id ? { ...t, done: !t.done } : t
  );
}

function listTodos(): void {
  todos.forEach((t) =>
    console.log(`${t.done ? "✅" : "⬜"} ${t.title} (id: ${t.id})`)
  );
}

// Demo
addTodo("Học TypeScript");
addTodo("Làm bài tập");
listTodos();
toggleTodo(todos[0].id);
listTodos();
```

---

## 📌 Kết luận

* Object trong TS phải khai báo rõ type → tránh nhầm lẫn field.
* `?` = optional, `readonly` = không thể sửa.
* Type Alias giúp code gọn gàng, dễ tái sử dụng.
* Object có thể lồng nhau để mô tả cấu trúc phức tạp.

---


[<< Ngày 4](./Day04.md) | [Ngày 6 >>](./Day06.md)
