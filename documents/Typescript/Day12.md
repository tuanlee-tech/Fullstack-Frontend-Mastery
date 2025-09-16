# 📘 Day 12: Generics (Phần 2 — Classes, Interfaces, Utility Functions)

## 🎯 Mục tiêu học

* Sử dụng **generics với class & interface**.
* Tạo **utility function generic** tái sử dụng nhiều domain.
* Hiểu **ứng dụng enterprise**: type-safe repository, CRUD API, reusable service.

---

## 1. Generic Class cơ bản

```ts
class DataStorage<T> {
  private data: T[] = [];

  add(item: T) {
    this.data.push(item);
  }

  remove(item: T) {
    this.data = this.data.filter(i => i !== item);
  }

  getAll(): T[] {
    return [...this.data];
  }
}

// Test
const numberStorage = new DataStorage<number>();
numberStorage.add(1);
numberStorage.add(2);
console.log(numberStorage.getAll()); // [1,2]

const stringStorage = new DataStorage<string>();
stringStorage.add("Alice");
console.log(stringStorage.getAll()); // ["Alice"]
```

✅ **Enterprise use**: tạo các **repository** generic, tái sử dụng cho User, Product, Order mà không duplicate code.

---

## 2. Generic Interface

```ts
interface ApiResponse<T> {
  status: "success" | "error" | "loading";
  data?: T;
  message?: string;
}

// Ví dụ sử dụng
const userResponse: ApiResponse<{id:number,name:string}> = {
  status: "success",
  data: {id:1, name:"Alice"}
};
```

* Interface generic giúp **type-safe contract** giữa frontend & backend.

---

## 3. Generic Utility Function

### a. Map object fields

```ts
function mapObject<T, U>(obj: T, callback: (value: T[keyof T], key: keyof T) => U): Record<keyof T, U> {
  const result = {} as Record<keyof T, U>;
  for (const key in obj) {
    result[key] = callback(obj[key], key);
  }
  return result;
}

// Test
const user = {id:1, name:"Alice"};
const mapped = mapObject(user, (val, key) => typeof val === "number" ? val*10 : val.toUpperCase());
console.log(mapped); // {id:10, name:"ALICE"}
```

✅ **Enterprise use**: data transformation, DTO mapping, API normalization.

---

### b. Generic Constraints nâng cao

```ts
interface Identifiable {
  id: number | string;
}

class Repository<T extends Identifiable> {
  private items: T[] = [];

  add(item: T) {
    this.items.push(item);
  }

  findById(id: T['id']): T | undefined {
    return this.items.find(item => item.id === id);
  }
}

// Test
const userRepo = new Repository<{id:number, name:string}>();
userRepo.add({id:1, name:"Alice"});
console.log(userRepo.findById(1)); // {id:1, name:"Alice"}
```

✅ **Enterprise use**: tạo **CRUD Repository type-safe** cho nhiều entity khác nhau.

---

## 4. Mini Project: Generic Service

```ts
interface Entity {
  id: number;
}

class ApiService<T extends Entity> {
  private store: T[] = [];

  create(item: T) {
    this.store.push(item);
    return item;
  }

  getById(id: number): T | undefined {
    return this.store.find(i => i.id === id);
  }

  getAll(): T[] {
    return [...this.store];
  }
}

// Test với User & Product
interface User extends Entity { name: string }
interface Product extends Entity { price: number }

const userService = new ApiService<User>();
userService.create({id:1,name:"Alice"});
console.log(userService.getById(1)); // {id:1,name:"Alice"}

const productService = new ApiService<Product>();
productService.create({id:101, price:99.99});
console.log(productService.getAll()); // [{id:101, price:99.99}]
```

✅ Enterprise pattern: **service layer reusable, type-safe**, dùng cho backend & frontend.

---

## 5. Bài tập (có lời giải)

### Level 1

* Viết generic class `Stack<T>` với `push`, `pop`, `peek`.

```ts
class Stack<T> {
  private items: T[] = [];
  push(item: T) { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  peek(): T | undefined { return this.items[this.items.length-1]; }
}

const stack = new Stack<number>();
stack.push(1); stack.push(2);
console.log(stack.peek()); // 2
```

---

### Level 2

* Viết generic function `filterBy<T,K extends keyof T>(items: T[], key: K, value: T[K]): T[]`

```ts
function filterBy<T,K extends keyof T>(items: T[], key: K, value: T[K]): T[] {
  return items.filter(item => item[key] === value);
}

const users = [{id:1,name:"Alice"},{id:2,name:"Bob"}];
console.log(filterBy(users,"name","Bob")); // [{id:2,name:"Bob"}]
```

---

### Level 3

* Tạo **generic repository + service** cho `User` và `Product`
* Chức năng: `create`, `findById`, `getAll` + type-safe

```ts
interface Entity { id: number }

class Repository<T extends Entity> {
  private items: T[] = [];
  create(item: T) { this.items.push(item); return item; }
  findById(id: number) { return this.items.find(i => i.id === id); }
  getAll() { return [...this.items]; }
}

const userRepo = new Repository<{id:number,name:string}>();
userRepo.create({id:1,name:"Alice"});
console.log(userRepo.getAll());
```

---

## 🔑 Key Takeaways Day 12

1. Generics với **Class & Interface** giúp **tái sử dụng code** cho nhiều entity.
2. Constraints đảm bảo **type-safe** trong enterprise layer.
3. Utility functions generic giúp **map, filter, transform** dữ liệu an toàn.
4. Enterprise pattern: **Repository, Service Layer, CRUD** → type-safe, maintainable, scalable.

---


[<< Ngày 11](./Day11.md) | [Ngày 13 >>](./Day13.md)