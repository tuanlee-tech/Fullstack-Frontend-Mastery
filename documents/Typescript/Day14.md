# 🚀 Day 14 – Classes & Inheritance trong TypeScript

---

## 1. Mục tiêu

* Hiểu **OOP trong TypeScript**.
* Làm quen **Class, Constructor, Property, Method**.
* Nắm **Kế thừa (Inheritance)** và **Access Modifiers** (`public`, `private`, `protected`).
* Biết khi nào nên dùng **Abstract Class** trong enterprise.

---

## 2. Kiến thức chi tiết

### 2.1 Khởi tạo Class

```ts
class User {
  // property
  public id: number;
  public name: string;

  // constructor
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  // method
  greet() {
    return `Hello, I am ${this.name}`;
  }
}

const u = new User(1, "Alice");
console.log(u.greet()); // Hello, I am Alice
```

---

### 2.2 Access Modifiers

* `public` → truy cập mọi nơi.
* `private` → chỉ trong class.
* `protected` → trong class và subclass.

```ts
class BankAccount {
  private balance: number;

  constructor(initial: number) {
    this.balance = initial;
  }

  deposit(amount: number) {
    this.balance += amount;
  }

  getBalance() {
    return this.balance;
  }
}

const acc = new BankAccount(100);
acc.deposit(50);
console.log(acc.getBalance()); // 150
// acc.balance ❌ Error vì private
```

---

### 2.3 Inheritance (Kế thừa)

```ts
class Animal {
  constructor(public name: string) {}
  move() {
    console.log(`${this.name} is moving`);
  }
}

class Dog extends Animal {
  bark() {
    console.log("Woof! Woof!");
  }
}

const dog = new Dog("Buddy");
dog.move(); // Buddy is moving
dog.bark(); // Woof! Woof!
```

---

### 2.4 Abstract Class

```ts
abstract class Shape {
  abstract area(): number; // method bắt buộc phải implement
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }
  area() {
    return Math.PI * this.radius ** 2;
  }
}

const c = new Circle(5);
console.log(c.area()); // 78.5
```

---


## 3. Bài tập

### 🔹 Level 1

1. Tạo class `Person` với `name`, `age`, method `introduce()`.
2. Tạo object từ class đó và in ra lời giới thiệu.

✅ Giải:

```ts
class Person {
  constructor(public name: string, public age: number) {}

  introduce() {
    return `Hi, my name is ${this.name}, and I am ${this.age} years old.`;
  }
}

const p1 = new Person("Alice", 25);
console.log(p1.introduce());
// Hi, my name is Alice, and I am 25 years old.
```

---

### 🔹 Level 2

1. Tạo class `Employee` kế thừa từ `Person`, thêm `role`.
2. Override method `introduce()` để in thêm chức vụ.

✅ Giải:

```ts
class Employee extends Person {
  constructor(name: string, age: number, public role: string) {
    super(name, age);
  }

  introduce() {
    return `${super.introduce()} I work as a ${this.role}.`;
  }
}

const e1 = new Employee("Bob", 30, "Software Engineer");
console.log(e1.introduce());
// Hi, my name is Bob, and I am 30 years old. I work as a Software Engineer.
```

---

### 🔹 Level 3

1. Tạo `abstract class Vehicle` có method `drive()`.
2. Tạo 2 class `Car` và `Motorbike` implement `drive()`.
3. Viết hàm `startJourney(vehicle: Vehicle)` nhận vào Car/Motorbike và chạy `drive()`.

✅ Giải:

```ts
abstract class Vehicle {
  constructor(public brand: string) {}
  abstract drive(): void;
}

class Car extends Vehicle {
  drive() {
    console.log(`${this.brand} car is driving 🚗`);
  }
}

class Motorbike extends Vehicle {
  drive() {
    console.log(`${this.brand} motorbike is zooming 🏍️`);
  }
}

function startJourney(vehicle: Vehicle) {
  vehicle.drive();
}

startJourney(new Car("Toyota"));     // Toyota car is driving 🚗
startJourney(new Motorbike("Honda")); // Honda motorbike is zooming 🏍️
```

---

## 4. Ứng dụng Enterprise

### 4.1 Domain Model cho User & Admin

Trong enterprise app, ta thường model user theo vai trò (role).

```ts
class BaseUser {
  constructor(public id: number, public name: string) {}
  abstract role(): string;
}

class NormalUser extends BaseUser {
  role() {
    return "USER";
  }
}

class AdminUser extends BaseUser {
  role() {
    return "ADMIN";
  }

  deleteUser(user: BaseUser) {
    console.log(`Deleting user ${user.name}`);
  }
}

const u = new NormalUser(1, "Alice");
const admin = new AdminUser(2, "Bob");

console.log(u.role());      // USER
console.log(admin.role());  // ADMIN
admin.deleteUser(u);        // Deleting user Alice
```

---

### 4.2 Express Middleware Pattern

```ts
abstract class Middleware {
  abstract handle(req: any, res: any, next: () => void): void;
}

class AuthMiddleware extends Middleware {
  handle(req: any, res: any, next: () => void) {
    if (!req.user) {
      res.status(401).send("Unauthorized");
      return;
    }
    next();
  }
}

class LoggerMiddleware extends Middleware {
  handle(req: any, res: any, next: () => void) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  }
}
```

👉 Đây là pattern thường thấy trong **enterprise Node.js backend**: mỗi middleware là một class, dễ mở rộng, test, tái sử dụng.

---

### 4.3 Abstract Service trong Enterprise

```ts
abstract class BaseService<T> {
  abstract findById(id: string): Promise<T | null>;
  abstract create(data: T): Promise<T>;
}

interface User {
  id: string;
  name: string;
}

class UserService extends BaseService<User> {
  private users: User[] = [];

  async findById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }

  async create(data: User): Promise<User> {
    this.users.push(data);
    return data;
  }
}
```

👉 Enterprise thường viết service theo abstract class → dễ thay thế DB (MySQL, Mongo, in-memory) mà không thay đổi logic ở tầng trên.

---

📌 Như vậy, **Day 14** đã cover đầy đủ: Class cơ bản, Inheritance, Abstract, Bài tập, và Enterprise Patterns (domain, middleware, service).

Bạn có muốn mình làm tiếp **Day 15: Polymorphism & Composition Patterns** luôn không, hay muốn dừng lại để bạn thử code trước?

---


[<< Ngày 13](./Day13.md) | [Ngày 16 >>](./Day16.md)