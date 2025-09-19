# 🚀 Day 36: Advanced Generics Patterns — Builders & Factories

## 1. Tổng quan

Generics trong TypeScript không chỉ giúp viết code linh hoạt mà còn hỗ trợ thiết kế các design patterns với tính an toàn kiểu (type-safety). Hai pattern phổ biến trong môi trường enterprise khi làm việc với TypeScript là:

- **Builder Pattern**: Xây dựng object phức tạp theo từng bước, với kiểm tra kiểu tại thời điểm biên dịch.
- **Factory Pattern**: Khởi tạo object dựa trên điều kiện runtime, nhưng vẫn đảm bảo an toàn kiểu tại compile-time.

Các pattern này giúp code dễ mở rộng, dễ bảo trì và giảm lỗi runtime.

---

## 2. Builder Pattern với Generics

### Ý tưởng chính
Sử dụng class hoặc function chainable để xây dựng object dần dần. Generics được dùng để theo dõi "trạng thái" của builder (ví dụ: trường nào đã được thiết lập), đảm bảo chỉ khi đủ các trường bắt buộc thì phương thức `build()` mới hợp lệ.

### Ví dụ cơ bản
```typescript
type User = {
  id: string;
  name: string;
  age: number;
};

class UserBuilder<T extends Partial<User> = {}> {
  private data: Partial<User> = {};

  setId(id: string): UserBuilder<T & { id: string }> {
    this.data.id = id;
    return this as any;
  }

  setName(name: string): UserBuilder<T & { name: string }> {
    this.data.name = name;
    return this as any;
  }

  setAge(age: number): UserBuilder<T & { age: number }> {
    this.data.age = age;
    return this as any;
  }

  build(this: UserBuilder<{ id: string; name: string; age: number }>): User {
    return this.data as User;
  }
}

// ✅ Sử dụng an toàn kiểu
const user = new UserBuilder()
  .setId("u1")
  .setName("Alice")
  .setAge(25)
  .build();

// ❌ Nếu thiếu trường, sẽ báo lỗi biên dịch
```

Ở đây, `UserBuilder` hoạt động như một state machine generics: Chỉ khi đủ các trường (`id`, `name`, `age`) thì `build()` mới được phép gọi.

---

## 3. Factory Pattern với Generics

### Ý tưởng chính
Factory method trả về object dựa trên input runtime. Sử dụng conditional types và mapped types để suy luận kiểu kết quả tại compile-time.

### Ví dụ cơ bản
```typescript
interface Dog {
  kind: "dog";
  bark(): void;
}

interface Cat {
  kind: "cat";
  meow(): void;
}

type Animal = Dog | Cat;

function createAnimal<T extends Animal["kind"]>(kind: T): Extract<Animal, { kind: T }> {
  if (kind === "dog") {
    return { kind: "dog", bark: () => console.log("Woof!") } as any;
  }
  if (kind === "cat") {
    return { kind: "cat", meow: () => console.log("Meow!") } as any;
  }
  throw new Error("Unknown animal");
}

// ✅ Suy luận kiểu tự động
const d = createAnimal("dog"); // d: Dog
d.bark();

const c = createAnimal("cat"); // c: Cat
c.meow();

// ❌ d.meow(); // Lỗi biên dịch
```

Factory function sử dụng `Extract` để đảm bảo kiểu trả về chính xác dựa trên input `kind`.

---

## 4. Ứng dụng thực tế trong Enterprise

- **Builder Pattern**: Sử dụng để config API client (axios/fetch wrapper), form builder, hoặc query builder (kiểu SQL/Prisma).
- **Factory Pattern**: Chọn strategy động (ví dụ: phương thức thanh toán như PayPal, Stripe, VNPay) hoặc render UI component dựa trên loại.

Các pattern này giúp hệ thống enterprise dễ tích hợp và mở rộng mà không mất an toàn kiểu.

---

## 5. Bài tập

### Level 1
Tạo `CarBuilder` với các trường:
- `brand: string`
- `model: string`
- `year: number`

Yêu cầu: Chỉ khi đủ 3 trường thì mới gọi được `.build()`.

### Level 2
Viết factory `createPayment`:
- Input `"paypal"` → object `{ kind: "paypal", pay(amount: number): void }`
- Input `"stripe"` → object `{ kind: "stripe", charge(amount: number): void }`

Yêu cầu: Factory phải an toàn kiểu dựa trên `kind`.

### Level 3
Tạo `ApiClientBuilder`:
- Có thể set `baseUrl`, `headers`, `authToken`.
- `.build()` trả về object có method `request(path: string): Promise<any>`.
- Phải an toàn kiểu (nếu chưa set `baseUrl` thì không build được).

---

## 6. Lời giải chi tiết

### Level 1 — CarBuilder
```typescript
type Car = {
  brand: string;
  model: string;
  year: number;
};

class CarBuilder<T extends Partial<Car> = {}> {
  private data: Partial<Car> = {};

  setBrand(brand: string): CarBuilder<T & { brand: string }> {
    this.data.brand = brand;
    return this as any;
  }

  setModel(model: string): CarBuilder<T & { model: string }> {
    this.data.model = model;
    return this as any;
  }

  setYear(year: number): CarBuilder<T & { year: number }> {
    this.data.year = year;
    return this as any;
  }

  build(this: CarBuilder<{ brand: string; model: string; year: number }>): Car {
    return this.data as Car;
  }
}

// ✅ Ví dụ
const car = new CarBuilder()
  .setBrand("Toyota")
  .setModel("Camry")
  .setYear(2023)
  .build();
```

### Level 2 — Payment Factory
```typescript
interface Paypal {
  kind: "paypal";
  pay(amount: number): void;
}

interface Stripe {
  kind: "stripe";
  charge(amount: number): void;
}

type Payment = Paypal | Stripe;

function createPayment<T extends Payment["kind"]>(
  kind: T
): Extract<Payment, { kind: T }> {
  if (kind === "paypal") {
    return { kind: "paypal", pay: (a: number) => console.log(`PayPal ${a}`) } as any;
  }
  if (kind === "stripe") {
    return { kind: "stripe", charge: (a: number) => console.log(`Stripe ${a}`) } as any;
  }
  throw new Error("Unknown payment method");
}

// ✅ Ví dụ
const paypal = createPayment("paypal");
paypal.pay(100);

const stripe = createPayment("stripe");
stripe.charge(200);
```

### Level 3 — ApiClientBuilder
```typescript
class ApiClientBuilder<T extends { baseUrl?: string } = {}> {
  private config: Partial<{ baseUrl: string; headers: Record<string, string>; authToken: string }> = {};

  setBaseUrl(url: string): ApiClientBuilder<T & { baseUrl: string }> {
    this.config.baseUrl = url;
    return this as any;
  }

  setHeaders(headers: Record<string, string>): ApiClientBuilder<T> {
    this.config.headers = headers;
    return this;
  }

  setAuthToken(token: string): ApiClientBuilder<T> {
    this.config.authToken = token;
    return this;
  }

  build(this: ApiClientBuilder<{ baseUrl: string }>) {
    const { baseUrl, headers, authToken } = this.config;
    return {
      async request(path: string): Promise<any> {
        const res = await fetch(`${baseUrl}${path}`, {
          headers: {
            ...(headers || {}),
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
        });
        return res.json();
      },
    };
  }
}

// ✅ Ví dụ
const client = new ApiClientBuilder()
  .setBaseUrl("https://api.example.com")
  .setHeaders({ "Content-Type": "application/json" })
  .setAuthToken("mytoken")
  .build();

client.request("/users").then(console.log);
```

---

## 7. Checklist

- [x] Hiểu Builder Pattern với generics type-safe.
- [x] Hiểu Factory Pattern với conditional types.
- [x] Biết ứng dụng vào enterprise (config client, strategy pattern, API layer).
- [x] Hoàn thành 3 cấp độ bài tập.

---

# 🔥 Day 36 (Mở rộng) — Advanced Generics Patterns

## 1. Builder nâng cao: Optional + Required fields

Trong thực tế, không phải tất cả các trường đều bắt buộc. Chúng ta có thể sử dụng generic constraints để encode optional fields.

```typescript
type Product = {
  id: string;
  name: string;
  price: number;
  description?: string; // optional
};

class ProductBuilder<T extends Partial<Product> = {}> {
  private data: Partial<Product> = {};

  setId(id: string): ProductBuilder<T & { id: string }> {
    this.data.id = id;
    return this as any;
  }

  setName(name: string): ProductBuilder<T & { name: string }> {
    this.data.name = name;
    return this as any;
  }

  setPrice(price: number): ProductBuilder<T & { price: number }> {
    this.data.price = price;
    return this as any;
  }

  setDescription(desc: string): ProductBuilder<T> {
    this.data.description = desc;
    return this;
  }

  build(this: ProductBuilder<{ id: string; name: string; price: number }>): Product {
    return this.data as Product;
  }
}

// ✅ Hợp lệ mà không cần description
const p1 = new ProductBuilder()
  .setId("p1")
  .setName("Laptop")
  .setPrice(1200)
  .build();

// ✅ Có thể thêm optional
const p2 = new ProductBuilder()
  .setId("p2")
  .setName("Phone")
  .setPrice(800)
  .setDescription("Latest model")
  .build();
```

Điểm khác biệt: Compiler chỉ enforce các trường required (`id`, `name`, `price`), còn optional như `description` không ảnh hưởng đến `build()`.

## 2. Factory nâng cao: Abstract Factory Pattern

Abstract Factory cho phép tạo nhóm đối tượng liên quan mà không chỉ định class cụ thể, phù hợp cho các hệ thống cần consistency (ví dụ: UI themes).

```typescript
interface Button {
  render(): void;
}

interface Checkbox {
  check(): void;
}

interface UIThemeFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

// --- Implementations ---
class DarkButton implements Button {
  render() { console.log("Dark Button"); }
}

class DarkCheckbox implements Checkbox {
  check() { console.log("Dark Checkbox checked"); }
}

class LightButton implements Button {
  render() { console.log("Light Button"); }
}

class LightCheckbox implements Checkbox {
  check() { console.log("Light Checkbox checked"); }
}

// --- Factories ---
class DarkThemeFactory implements UIThemeFactory {
  createButton() { return new DarkButton(); }
  createCheckbox() { return new DarkCheckbox(); }
}

class LightThemeFactory implements UIThemeFactory {
  createButton() { return new LightButton(); }
  createCheckbox() { return new LightCheckbox(); }
}

// --- Usage ---
function renderUI(factory: UIThemeFactory) {
  const btn = factory.createButton();
  const chk = factory.createCheckbox();
  btn.render();
  chk.check();
}

renderUI(new DarkThemeFactory());  // Dark Button + Dark Checkbox
renderUI(new LightThemeFactory()); // Light Button + Light Checkbox
```

Abstract Factory đảm bảo an toàn kiểu và consistency giữa các object liên quan.

## 3. Builder + Factory kết hợp

Kết hợp để tạo Builder qua Factory, ví dụ: API Client cho nhiều môi trường.

```typescript
class ApiClient {
  constructor(private baseUrl: string) {}
  async get(path: string) {
    const res = await fetch(`${this.baseUrl}${path}`);
    return res.json();
  }
}

class ApiClientFactory {
  static create(env: "dev" | "prod") {
    if (env === "dev") {
      return new ApiClient("https://dev.api.com");
    }
    return new ApiClient("https://prod.api.com");
  }
}

// ✅ Usage
const client = ApiClientFactory.create("dev");
client.get("/users").then(console.log);
```

Có thể kết hợp với `ApiClientBuilder` để config chi tiết hơn.

## 4. Khi nào chọn Builder vs Factory?

| Pattern          | Khi nào dùng                                                                 | Ưu điểm                                                                 |
|------------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------|
| **Builder**      | Object phức tạp, nhiều bước setup, có optional/required fields.             | Xây dựng step-by-step, enforce type tại compile-time.                   |
| **Factory**      | Tạo object phụ thuộc điều kiện runtime (string, enum).                      | Ẩn chi tiết khởi tạo, chọn strategy runtime.                            |
| **Abstract Factory** | Tạo họ đối tượng liên quan (theme, UI kit).                                 | Đảm bảo consistency giữa các object.                                    |

## 5. Mini Challenge (Tự luyện)

**Bài toán:** Xây dựng hệ thống **Notification** hỗ trợ:
- `EmailNotification` với `sendEmail(to: string, content: string)`
- `SmsNotification` với `sendSms(phone: string, content: string)`
- `PushNotification` với `push(userId: string, content: string)`

Yêu cầu:
1. Dùng **Factory Pattern** để chọn loại notification.
2. Dùng **Builder Pattern** để config notification client (add API key, enable logging, ...).
3. Đảm bảo type-safety.

---

# 📝 Giải chi tiết — Notification System

## 1. Interface chung
```typescript
interface Notification {
  send(content: string): void;
}
```

## 2. Implementation cụ thể
```typescript
class EmailNotification implements Notification {
  constructor(private to: string) {}
  send(content: string): void {
    console.log(`📧 Sending Email to ${this.to}: ${content}`);
  }
}

class SmsNotification implements Notification {
  constructor(private phone: string) {}
  send(content: string): void {
    console.log(`📱 Sending SMS to ${this.phone}: ${content}`);
  }
}

class PushNotification implements Notification {
  constructor(private userId: string) {}
  send(content: string): void {
    console.log(`🔔 Sending Push to user ${this.userId}: ${content}`);
  }
}
```

## 3. Builder cho config client
```typescript
class NotificationClient {
  constructor(
    public apiKey: string,
    public enableLogging: boolean
  ) {}
}

class NotificationClientBuilder {
  private apiKey: string = "";
  private enableLogging: boolean = false;

  setApiKey(key: string): this {
    this.apiKey = key;
    return this;
  }

  enableLogs(): this {
    this.enableLogging = true;
    return this;
  }

  build(): NotificationClient {
    if (!this.apiKey) {
      throw new Error("API key is required");
    }
    return new NotificationClient(this.apiKey, this.enableLogging);
  }
}
```

## 4. Factory để chọn loại Notification
```typescript
class NotificationFactory {
  constructor(private client: NotificationClient) {}

  create(type: "email", to: string): EmailNotification;
  create(type: "sms", phone: string): SmsNotification;
  create(type: "push", userId: string): PushNotification;
  create(type: "email" | "sms" | "push", target: string): Notification {
    if (this.client.enableLogging) {
      console.log(`[Factory] Creating ${type} notification with key ${this.client.apiKey}`);
    }

    switch (type) {
      case "email":
        return new EmailNotification(target);
      case "sms":
        return new SmsNotification(target);
      case "push":
        return new PushNotification(target);
    }
  }
}
```

Sử dụng function overloads để đảm bảo type-safety dựa trên `type`.

## 5. Sử dụng thực tế
```typescript
// Step 1: Tạo client bằng Builder
const client = new NotificationClientBuilder()
  .setApiKey("SECRET-123")
  .enableLogs()
  .build();

// Step 2: Tạo factory từ client
const factory = new NotificationFactory(client);

// Step 3: Tạo và dùng notification
const email = factory.create("email", "user@example.com");
email.send("Welcome to our system!");

const sms = factory.create("sms", "0987654321");
sms.send("Your OTP is 123456");

const push = factory.create("push", "user-42");
push.send("You have a new message!");
```

**Output mẫu:**
```
[Factory] Creating email notification with key SECRET-123
📧 Sending Email to user@example.com: Welcome to our system!
[Factory] Creating sms notification with key SECRET-123
📱 Sending SMS to 0987654321: Your OTP is 123456
[Factory] Creating push notification with key SECRET-123
🔔 Sending Push to user user-42: You have a new message!
```

## 6. Giải thích type-safety
- **Builder**: Enforce API key bắt buộc trước khi build.
- **Factory**: Overloads đảm bảo kiểu trả về chính xác (ví dụ: `"email"` → `EmailNotification`).
- Khi gọi `.send()`, kiểu được bảo vệ đầy đủ.

Nếu muốn mở rộng: Thêm queue (RabbitMQ/Kafka), retry, logging (winston), hoặc generic `Notification<TPayload>`.

---

# 🚀 Enterprise Notification System (Type-Safe + Scalable)

## 1. Vấn đề thực tế
Trong enterprise:
- Hỗ trợ nhiều loại notification.
- Xử lý lỗi với retry (exponential backoff).
- Sử dụng queue (Kafka, RabbitMQ, Redis) cho async processing.
- Logging và monitoring bắt buộc.
- Type-safety cho payload để tránh lỗi runtime.

## 2. Interface tổng quát
```typescript
interface Notification<TPayload> {
  send(payload: TPayload): Promise<void>;
}
```

## 3. Payload types
```typescript
type EmailPayload = { to: string; subject: string; body: string };
type SmsPayload = { phone: string; message: string };
type PushPayload = { userId: string; title: string; body: string };
```

## 4. Triển khai Channels
```typescript
class EmailNotification implements Notification<EmailPayload> {
  async send(payload: EmailPayload): Promise<void> {
    console.log(`📧 Email to ${payload.to}: ${payload.subject}`);
  }
}

class SmsNotification implements Notification<SmsPayload> {
  async send(payload: SmsPayload): Promise<void> {
    console.log(`📱 SMS to ${payload.phone}: ${payload.message}`);
  }
}

class PushNotification implements Notification<PushPayload> {
  async send(payload: PushPayload): Promise<void> {
    console.log(`🔔 Push to ${payload.userId}: ${payload.title}`);
  }
}
```

## 5. Queue + Retry Mechanism
```typescript
interface QueueMessage<T> {
  type: "email" | "sms" | "push";
  payload: T;
  retryCount?: number;
}

class NotificationQueue {
  private queue: QueueMessage<any>[] = [];

  enqueue<T>(msg: QueueMessage<T>): void {
    this.queue.push({ ...msg, retryCount: msg.retryCount ?? 0 });
  }

  dequeue(): QueueMessage<any> | undefined {
    return this.queue.shift();
  }

  size(): number {
    return this.queue.length;
  }
}
```

## 6. Factory cho Channels
```typescript
class NotificationFactory {
  static create(type: "email"): Notification<EmailPayload>;
  static create(type: "sms"): Notification<SmsPayload>;
  static create(type: "push"): Notification<PushPayload>;
  static create(type: "email" | "sms" | "push"): Notification<any> {
    switch (type) {
      case "email": return new EmailNotification();
      case "sms": return new SmsNotification();
      case "push": return new PushNotification();
    }
  }
}
```

## 7. Worker xử lý Queue
```typescript
class NotificationWorker {
  constructor(private queue: NotificationQueue, private maxRetries = 3) {}

  async process(): Promise<void> {
    while (this.queue.size() > 0) {
      const msg = this.queue.dequeue();
      if (!msg) continue;

      const channel = NotificationFactory.create(msg.type);

      try {
        await channel.send(msg.payload);
        console.log(`✅ Sent ${msg.type} successfully`);
      } catch (err) {
        console.error(`❌ Failed to send ${msg.type}`, err);

        if ((msg.retryCount ?? 0) < this.maxRetries) {
          console.log(`🔄 Retrying ${msg.type}, attempt ${msg.retryCount! + 1}`);
          this.queue.enqueue({
            ...msg,
            retryCount: (msg.retryCount ?? 0) + 1,
          });
        } else {
          console.error(`💀 Max retries reached for ${msg.type}`);
        }
      }
    }
  }
}
```

## 8. Sử dụng thực tế
```typescript
// Tạo Queue
const queue = new NotificationQueue();

// Enqueue messages
queue.enqueue<EmailPayload>({
  type: "email",
  payload: { to: "user@example.com", subject: "Welcome", body: "Hello!" }
});

queue.enqueue<SmsPayload>({
  type: "sms",
  payload: { phone: "0987654321", message: "Your OTP is 123456" }
});

queue.enqueue<PushPayload>({
  type: "push",
  payload: { userId: "user-42", title: "New Message", body: "You got mail!" }
});

// Tạo Worker
const worker = new NotificationWorker(queue);
worker.process();
```

**Output mẫu:**
```
📧 Email to user@example.com: Welcome
✅ Sent email successfully
📱 SMS to 0987654321: Your OTP is 123456
✅ Sent sms successfully
🔔 Push to user-42: New Message
✅ Sent push successfully
```

## 9. Enterprise Features mở rộng
- **Retry với Exponential Backoff**: Delay tăng dần (1s → 2s → 4s).
- **Persist Queue**: Sử dụng Redis/RabbitMQ thay array in-memory.
- **Metrics & Monitoring**: Theo dõi success/failure qua Prometheus/Grafana.
- **Security**: Encrypt payload trước khi enqueue.
- **Parallel Processing**: Worker pool xử lý nhiều message đồng thời.

## 10. Final Perfect Edition
Hệ thống này đã đạt mức enterprise-grade: Type-safe, scalable, với Builder + Factory + Queue + Retry. Có thể tích hợp thêm logging chuyên nghiệp (winston) hoặc generic payload tùy loại.

---

📌 [<< Ngày 35](./Day35.md) | [Ngày 37 >>](./Day37.md)