
# 🎯 Day 15: Polymorphism & Composition Patterns

---

## 1. Polymorphism là gì?

* **Polymorphism (đa hình)**: cùng một interface nhưng nhiều class có thể implement theo cách khác nhau.
* Giúp viết code **mở rộng dễ dàng** (Open/Closed Principle trong SOLID).
* Ví dụ: một hàm xử lý `Payment` có thể nhận `CreditCardPayment`, `PaypalPayment`, `CryptoPayment` mà không cần thay đổi logic.

---

## 2. Ví dụ Polymorphism cơ bản

```ts
abstract class Payment {
  abstract pay(amount: number): void;
}

class CreditCardPayment extends Payment {
  pay(amount: number) {
    console.log(`💳 Paid $${amount} via Credit Card`);
  }
}

class PaypalPayment extends Payment {
  pay(amount: number) {
    console.log(`💻 Paid $${amount} via PayPal`);
  }
}

function processPayment(payment: Payment, amount: number) {
  payment.pay(amount);
}

processPayment(new CreditCardPayment(), 100);
processPayment(new PaypalPayment(), 200);
```

👉 `processPayment` không quan tâm cụ thể là loại payment nào, chỉ cần đảm bảo class đó **tuân thủ interface Payment**.

---

## 3. Composition Pattern là gì?

* **Inheritance**: quan hệ *is-a* (Ví dụ: `Dog extends Animal`).
* **Composition**: quan hệ *has-a* (Ví dụ: `Car has-a Engine`).

Composition thường được dùng nhiều trong enterprise vì:

* Tránh “đa kế thừa” phức tạp.
* Dễ tái sử dụng logic nhỏ lẻ.
* Dễ test unit.

---

## 4. Ví dụ Composition

```ts
class Engine {
  start() {
    console.log("🚀 Engine started");
  }
}

class MusicSystem {
  play() {
    console.log("🎵 Playing music");
  }
}

class Car {
  constructor(
    private engine: Engine,
    private musicSystem: MusicSystem
  ) {}

  drive() {
    this.engine.start();
    this.musicSystem.play();
    console.log("🚗 Car is driving");
  }
}

const myCar = new Car(new Engine(), new MusicSystem());
myCar.drive();
```

👉 Ở đây `Car` không kế thừa từ `Engine` hay `MusicSystem`, mà **kết hợp (compose)** chúng. Điều này giúp thay đổi engine hoặc music system dễ dàng mà không ảnh hưởng class Car.

---

## 5. Bài tập

### 🔹 Level 1

Tạo abstract class `Shape` với method `area()`. Implement `Rectangle` và `Circle`. In ra diện tích.

### 🔹 Level 2

Tạo abstract class `Notification`. Implement `EmailNotification` và `SMSNotification`. Viết hàm `sendNotification`.

### 🔹 Level 3

Dùng **Composition**:

* Tạo class `Logger` có method `log(msg: string)`.
* Tạo class `Database` có `save(data: string)`.
* Tạo class `AppService` dùng cả `Logger` và `Database`.
* Khi gọi `saveData("Hello")` → log ra `"Saving data..."` rồi lưu vào DB.

---

## 6. Ứng dụng trong Enterprise

### 6.1 Payment Gateway (Polymorphism)

Trong enterprise e-commerce:

```ts
interface PaymentProvider {
  pay(amount: number): void;
}

class StripePayment implements PaymentProvider {
  pay(amount: number) {
    console.log(`Stripe processed $${amount}`);
  }
}

class PaypalPayment implements PaymentProvider {
  pay(amount: number) {
    console.log(`Paypal processed $${amount}`);
  }
}

class CheckoutService {
  constructor(private provider: PaymentProvider) {}

  checkout(amount: number) {
    this.provider.pay(amount);
  }
}

new CheckoutService(new StripePayment()).checkout(300);
```

👉 Dễ mở rộng thêm `CryptoPayment`, `ApplePay`… mà không sửa CheckoutService.

---

### 6.2 Middleware Composition

Trong Node.js/Express, middleware là **composition pattern**:

```ts
type Middleware = (req: any, res: any, next: () => void) => void;

function compose(middlewares: Middleware[]) {
  return (req: any, res: any) => {
    let i = 0;
    function next() {
      const mw = middlewares[i++];
      if (mw) mw(req, res, next);
    }
    next();
  };
}

const logger: Middleware = (req, _, next) => {
  console.log("📌 Request received");
  next();
};

const auth: Middleware = (req, res, next) => {
  if (!req.user) return res.status(401).send("Unauthorized");
  next();
};

const app = compose([logger, auth]);
app({ user: null }, { status: (c: number) => ({ send: (m: string) => console.log(c, m) }) });
```

---

### 6.3 Service Composition

Trong enterprise microservices:

```ts
class AuditService {
  record(action: string) {
    console.log(`📊 Audit: ${action}`);
  }
}

class UserService {
  constructor(private audit: AuditService) {}

  createUser(name: string) {
    this.audit.record(`User ${name} created`);
  }
}

const audit = new AuditService();
const userService = new UserService(audit);
userService.createUser("Alice");
```

---

## 7. Tổng kết

* **Polymorphism**: cùng interface → nhiều cách implement.
* **Composition**: kết hợp nhiều thành phần → dễ mở rộng & test.
* Enterprise codebase **ưu tiên composition** thay vì inheritance, trừ khi domain rõ ràng (vd: Payment, Shape).

---


# ✅ Giải Bài Tập Day 15

---

## 🔹 Level 1 — Shape

**Yêu cầu**:

* Tạo abstract class `Shape` với method `area()`.
* Implement `Rectangle` và `Circle`.
* In ra diện tích.

**Giải**:

```ts
abstract class Shape {
  abstract area(): number;
}

class Rectangle extends Shape {
  constructor(public width: number, public height: number) {
    super();
  }

  area(): number {
    return this.width * this.height;
  }
}

class Circle extends Shape {
  constructor(public radius: number) {
    super();
  }

  area(): number {
    return Math.PI * this.radius * this.radius;
  }
}

const shapes: Shape[] = [
  new Rectangle(10, 5),
  new Circle(7),
];

shapes.forEach(s => console.log("Area:", s.area()));
// Area: 50
// Area: 153.938...
```

👉 Polymorphism: cả `Rectangle` và `Circle` đều dùng chung interface `Shape` nhưng implement khác nhau.

---

## 🔹 Level 2 — Notification

**Yêu cầu**:

* Tạo abstract class `Notification`.
* Implement `EmailNotification` và `SMSNotification`.
* Viết hàm `sendNotification`.

**Giải**:

```ts
abstract class Notification {
  abstract send(message: string): void;
}

class EmailNotification extends Notification {
  send(message: string): void {
    console.log(`📧 Sending Email: ${message}`);
  }
}

class SMSNotification extends Notification {
  send(message: string): void {
    console.log(`📱 Sending SMS: ${message}`);
  }
}

function sendNotification(n: Notification, msg: string) {
  n.send(msg);
}

sendNotification(new EmailNotification(), "Welcome to our service!");
sendNotification(new SMSNotification(), "Your OTP is 123456");
```

👉 Polymorphism: `sendNotification` không cần biết là email hay SMS, chỉ cần class implement `Notification`.

---

## 🔹 Level 3 — AppService (Composition)

**Yêu cầu**:

* Tạo `Logger` có method `log(msg: string)`.
* Tạo `Database` có method `save(data: string)`.
* Tạo `AppService` dùng cả `Logger` và `Database`.
* Khi gọi `saveData("Hello")` → log `"Saving data..."` rồi lưu vào DB.

**Giải**:

```ts
class Logger {
  log(msg: string) {
    console.log("📝 LOG:", msg);
  }
}

class Database {
  save(data: string) {
    console.log(`💾 Saved to DB: ${data}`);
  }
}

class AppService {
  constructor(
    private logger: Logger,
    private db: Database
  ) {}

  saveData(data: string) {
    this.logger.log("Saving data...");
    this.db.save(data);
  }
}

const service = new AppService(new Logger(), new Database());
service.saveData("Hello Composition Pattern");
// 📝 LOG: Saving data...
// 💾 Saved to DB: Hello Composition Pattern
```

👉 Đây là **Composition Pattern**:

* `AppService` không kế thừa từ `Logger` hay `Database`, mà **kết hợp** chúng.
* Nếu cần thay thế Database (MongoDB, PostgreSQL, Redis) → chỉ cần inject class mới mà không sửa AppService.

---

# 🎯 Tổng kết

* **Level 1**: Polymorphism với Shape.
* **Level 2**: Polymorphism với Notification.
* **Level 3**: Composition với AppService.

👉 Trong enterprise:

* Polymorphism hay dùng ở **domain model** (User, Payment, Shape...).
* Composition hay dùng ở **service layer** (kết hợp Logger, Cache, DB, EventBus...).

---

# 🚀 Enterprise Version — Composition in Large System

Trong hệ thống lớn, `AppService` thường không chỉ làm việc với **Logger** và **Database**, mà còn có:

* **CacheService** → để tránh query DB quá nhiều.
* **AuditService** → để ghi lại lịch sử thay đổi (audit trail).
* **Notifier** → để gửi email/SMS sau khi lưu thành công.

---

## 📌 Code minh hoạ

```ts
// 1. Logger
class Logger {
  log(msg: string) {
    console.log("📝 LOG:", msg);
  }
}

// 2. Database
class Database {
  save(data: string) {
    console.log(`💾 Saved to DB: ${data}`);
  }
}

// 3. Cache
class CacheService {
  private cache: Record<string, string> = {};

  set(key: string, value: string) {
    this.cache[key] = value;
    console.log(`⚡ Cache set: { ${key}: ${value} }`);
  }

  get(key: string): string | undefined {
    return this.cache[key];
  }
}

// 4. Audit
class AuditService {
  record(action: string, data: string) {
    console.log(`📜 Audit -> ${action}: ${data}`);
  }
}

// 5. Notification
abstract class Notifier {
  abstract notify(message: string): void;
}

class EmailNotifier extends Notifier {
  notify(message: string): void {
    console.log(`📧 Email sent: ${message}`);
  }
}

// 6. AppService (Composition)
class AppService {
  constructor(
    private logger: Logger,
    private db: Database,
    private cache: CacheService,
    private audit: AuditService,
    private notifier: Notifier
  ) {}

  saveData(key: string, data: string) {
    this.logger.log("Saving data...");
    this.cache.set(key, data);
    this.db.save(data);
    this.audit.record("SAVE", data);
    this.notifier.notify(`Data [${key}] saved successfully.`);
  }
}

// 7. Run
const service = new AppService(
  new Logger(),
  new Database(),
  new CacheService(),
  new AuditService(),
  new EmailNotifier()
);

service.saveData("user:1", "John Doe");

/*
📝 LOG: Saving data...
⚡ Cache set: { user:1: John Doe }
💾 Saved to DB: John Doe
📜 Audit -> SAVE: John Doe
📧 Email sent: Data [user:1] saved successfully.
*/
```

---

## 🔎 Enterprise Use-case

* **Logger**: dùng để trace logs (dùng Winston, Pino trong NodeJS thực tế).
* **Database**: có thể thay bằng MongoDB, PostgreSQL, DynamoDB… → chỉ cần implement class tương ứng.
* **CacheService**: thường dùng Redis hoặc Memcached.
* **AuditService**: ghi lại log bảo mật, giúp compliance (SOX, GDPR...).
* **Notifier**: có thể thay Email bằng SMS, Slack, hoặc Push notification.

👉 Đây chính là **Dependency Injection + Composition Pattern**.

* `AppService` không cần biết *cách* cache hoạt động, hay *cách* gửi email.
* Nó chỉ **dùng interface**, còn implementation có thể thay thế.



---


[<< Ngày 14](./Day14.md) | [Ngày 16 >>](./Day16.md)