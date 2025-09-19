
🟧 Day 36: Advanced Generics Patterns — Builders, Factories

1. Tổng quan

Generics không chỉ giúp viết code linh hoạt mà còn giúp thiết kế design patterns có type-safety.
Hai pattern thường gặp trong enterprise khi làm với TypeScript:

1. Builder Pattern — xây dựng object phức tạp theo từng bước, có kiểm tra type.


2. Factory Pattern — khởi tạo object theo điều kiện runtime nhưng vẫn đảm bảo compile-time type.




---

2. Builder Pattern với Generics

Ý tưởng

Dùng class hoặc function chainable để tạo object dần dần.

Dùng generics để track “state” của builder (ví dụ: field nào đã set).


Ví dụ cơ bản

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

// ✅ Type-safe usage
const user = new UserBuilder()
  .setId("u1")
  .setName("Alice")
  .setAge(25)
  .build();

// ❌ Nếu thiếu setName hoặc setAge → compile-time error

Ở đây UserBuilder dùng generic state machine: chỉ khi đủ trường (id, name, age) thì build() mới hợp lệ.


---

3. Factory Pattern với Generics

Ý tưởng

Factory method trả về object dựa trên input.

Dùng conditional types + mapped types để inference kết quả.


Ví dụ cơ bản

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

// ✅ Type inference
const d = createAnimal("dog"); // d: Dog
d.bark();

const c = createAnimal("cat"); // c: Cat
c.meow();

// ❌ d.meow(); // Compile-time error

Ở đây factory function biết chính xác loại trả về nhờ vào Extract + generics.


---

4. Ứng dụng thực tế trong Enterprise

Builder Pattern: config API client (axios, fetch wrapper), form builder, query builder (SQL/Prisma style).

Factory Pattern: chọn strategy (payment method: PayPal, Stripe, VNPay), chọn UI component renderer theo type.



---

5. Bài tập

Level 1

Tạo CarBuilder với các field:

brand: string

model: string

year: number


Yêu cầu: chỉ khi đủ 3 field thì mới gọi được .build().


---

Level 2

Viết createPayment factory:

Input "paypal" → object { kind: "paypal", pay(amount: number): void }

Input "stripe" → object { kind: "stripe", charge(amount: number): void }


Yêu cầu: factory phải type-safe theo kind.


---

Level 3

Tạo ApiClientBuilder:

Có thể set baseUrl, headers, authToken.

.build() trả về object có method request(path: string): Promise<any>.

Phải type-safe (nếu chưa set baseUrl → không build được).



---

6. Lời giải chi tiết

Level 1 — CarBuilder

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

// ✅ Example
const car = new CarBuilder()
  .setBrand("Toyota")
  .setModel("Camry")
  .setYear(2023)
  .build();


---

Level 2 — Payment Factory

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

// ✅ Example
const paypal = createPayment("paypal");
paypal.pay(100);

const stripe = createPayment("stripe");
stripe.charge(200);


---

Level 3 — ApiClientBuilder

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

// ✅ Example
const client = new ApiClientBuilder()
  .setBaseUrl("https://api.example.com")
  .setHeaders({ "Content-Type": "application/json" })
  .setAuthToken("mytoken")
  .build();

client.request("/users").then(console.log);


---

7. Checklist

[x] Hiểu Builder Pattern với generics type-safe.

[x] Hiểu Factory Pattern với conditional types.

[x] Biết ứng dụng vào enterprise (config client, strategy pattern, API layer).

[x] Hoàn thành 3 cấp độ bài tập.
---
# 🔥 Day 36 (Mở rộng) — Advanced Generics Patterns
 
## 1. Builder nâng cao: Optional + Required fields
 
Trong thực tế, không phải field nào cũng **required**. Một số field chỉ **optional**. Chúng ta có thể encode điều đó bằng **generic constraints**.
 `type Product = {   id: string;   name: string;   price: number;   description?: string; // optional };  class ProductBuilder<T extends Partial<Product> = {}> {   private data: Partial<Product> = {};    setId(id: string): ProductBuilder<T & { id: string }> {     this.data.id = id;     return this as any;   }    setName(name: string): ProductBuilder<T & { name: string }> {     this.data.name = name;     return this as any;   }    setPrice(price: number): ProductBuilder<T & { price: number }> {     this.data.price = price;     return this as any;   }    setDescription(desc: string): ProductBuilder<T> {     this.data.description = desc;     return this;   }    build(this: ProductBuilder<{ id: string; name: string; price: number }>): Product {     return this.data as Product;   } }  // ✅ Hợp lệ const p1 = new ProductBuilder()   .setId("p1")   .setName("Laptop")   .setPrice(1200)   .build();  // ✅ Có thể thêm optional const p2 = new ProductBuilder()   .setId("p2")   .setName("Phone")   .setPrice(800)   .setDescription("Latest model")   .build(); ` 
Điểm khác biệt:
 
 
- `description` không bắt buộc trước khi `build()`.
 
- Compiler vẫn enforce `id`, `name`, `price` là bắt buộc.
 

  
## 2. Factory nâng cao: Abstract Factory Pattern
 
Factory Pattern chỉ tạo object theo loại, nhưng **Abstract Factory** cho phép tạo **nhóm đối tượng liên quan** mà không cần chỉ định class cụ thể.
 
Ví dụ: UI Theme Factory (Dark vs Light theme).
 `interface Button {   render(): void; } interface Checkbox {   check(): void; }  interface UIThemeFactory {   createButton(): Button;   createCheckbox(): Checkbox; }  // --- Implementations --- class DarkButton implements Button {   render() { console.log("Dark Button"); } } class DarkCheckbox implements Checkbox {   check() { console.log("Dark Checkbox checked"); } }  class LightButton implements Button {   render() { console.log("Light Button"); } } class LightCheckbox implements Checkbox {   check() { console.log("Light Checkbox checked"); } }  // --- Factories --- class DarkThemeFactory implements UIThemeFactory {   createButton() { return new DarkButton(); }   createCheckbox() { return new DarkCheckbox(); } } class LightThemeFactory implements UIThemeFactory {   createButton() { return new LightButton(); }   createCheckbox() { return new LightCheckbox(); } }  // --- Usage --- function renderUI(factory: UIThemeFactory) {   const btn = factory.createButton();   const chk = factory.createCheckbox();   btn.render();   chk.check(); }  renderUI(new DarkThemeFactory());  // Dark Button + Dark Checkbox renderUI(new LightThemeFactory()); // Light Button + Light Checkbox ` 
Ở đây, bạn có thể chọn theme **runtime**, nhưng vẫn đảm bảo **compile-time safety** vì `UIThemeFactory` enforce contract.
  
## 3. Builder + Factory kết hợp
 
Một số trường hợp ta muốn **tạo Builder thông qua Factory**. Ví dụ: API Client cho nhiều môi trường.
 `class ApiClient {   constructor(private baseUrl: string) {}   async get(path: string) {     const res = await fetch(`${this.baseUrl}${path}`);     return res.json();   } }  class ApiClientFactory {   static create(env: "dev" | "prod") {     if (env === "dev") {       return new ApiClient("https://dev.api.com");     }     return new ApiClient("https://prod.api.com");   } }  // ✅ Usage const client = ApiClientFactory.create("dev"); client.get("/users").then(console.log); ` 
Sau đó bạn có thể kết hợp `ApiClientBuilder` (cho config chi tiết) + `ApiClientFactory` (chọn môi trường).
  
## 4. Khi nào chọn Builder vs Factory?
 
  
 
Pattern
 
Khi nào dùng
 
Ưu điểm
 
   
 
**Builder**
 
Khi object phức tạp, nhiều bước setup, có optional/required field.
 
Tạo object **step-by-step**, enforce type ở compile-time.
 
 
 
**Factory**
 
Khi cần tạo object phụ thuộc vào điều kiện runtime (type string, enum).
 
Ẩn chi tiết khởi tạo, chọn strategy runtime.
 
 
 
**Abstract Factory**
 
Khi cần tạo cả **họ đối tượng liên quan** (theme, UI kit).
 
Đảm bảo consistency trong các object được tạo.
 
  
  
## 5. Mini Challenge (Tự luyện)
 
**Bài toán:** Bạn cần xây dựng một hệ thống **Notification** hỗ trợ:
 
 
- `EmailNotification` với method `sendEmail(to: string, content: string)`
 
- `SmsNotification` với method `sendSms(phone: string, content: string)`
 
- `PushNotification` với method `push(userId: string, content: string)`
 

 
Yêu cầu:
 
 
1. Dùng **Factory Pattern** để chọn loại notification.
 
2. Dùng **Builder Pattern** để config notification client (ví dụ: add API key, enable logging, …).
 
3. Đảm bảo type-safety
---
Mini Challenge Notification System với **Factory + Builder** kết hợp.
  
# 📝 Giải chi tiết — Notification System
 
## 1. Xác định interface chung
 
Tất cả notification đều cần một interface chung để Factory có thể return.
 `interface Notification {   send(content: string): void; } `  
## 2. Tạo các implementation cụ thể
 `class EmailNotification implements Notification {   constructor(private to: string) {}   send(content: string): void {     console.log(`📧 Sending Email to ${this.to}: ${content}`);   } }  class SmsNotification implements Notification {   constructor(private phone: string) {}   send(content: string): void {     console.log(`📱 Sending SMS to ${this.phone}: ${content}`);   } }  class PushNotification implements Notification {   constructor(private userId: string) {}   send(content: string): void {     console.log(`🔔 Sending Push to user ${this.userId}: ${content}`);   } } `  
## 3. Builder cho config client
 
Chúng ta cần một **NotificationClientBuilder** để add API key, enable logging…
 `class NotificationClient {   constructor(     public apiKey: string,     public enableLogging: boolean   ) {} }  class NotificationClientBuilder {   private apiKey: string = "";   private enableLogging: boolean = false;    setApiKey(key: string): this {     this.apiKey = key;     return this;   }    enableLogs(): this {     this.enableLogging = true;     return this;   }    build(): NotificationClient {     if (!this.apiKey) {       throw new Error("API key is required");     }     return new NotificationClient(this.apiKey, this.enableLogging);   } } `  
## 4. Factory để chọn loại Notification
 
Factory sẽ sử dụng `NotificationClient` để tạo notification phù hợp.
 `class NotificationFactory {   constructor(private client: NotificationClient) {}    create(type: "email", to: string): EmailNotification;   create(type: "sms", phone: string): SmsNotification;   create(type: "push", userId: string): PushNotification;   create(type: "email" | "sms" | "push", target: string): Notification {     if (this.client.enableLogging) {       console.log(`[Factory] Creating ${type} notification with key ${this.client.apiKey}`);     }      switch (type) {       case "email":         return new EmailNotification(target);       case "sms":         return new SmsNotification(target);       case "push":         return new PushNotification(target);     }   } } ` 
👉 Ở đây dùng **function overloads** để giữ **type safety**:
 
 
- Nếu `type = "email"` thì bắt buộc truyền `to: string`.
 
- Nếu `type = "sms"` thì truyền `phone: string`.
 
- Nếu `type = "push"` thì truyền `userId: string`.
 

  
## 5. Sử dụng thực tế
 `// Step 1: Tạo client bằng Builder const client = new NotificationClientBuilder()   .setApiKey("SECRET-123")   .enableLogs()   .build();  // Step 2: Tạo factory từ client const factory = new NotificationFactory(client);  // Step 3: Tạo và dùng các notification khác nhau const email = factory.create("email", "user@example.com"); email.send("Welcome to our system!");  const sms = factory.create("sms", "0987654321"); sms.send("Your OTP is 123456");  const push = factory.create("push", "user-42"); push.send("You have a new message!"); ` 
✅ Output:
 `[Factory] Creating email notification with key SECRET-123 📧 Sending Email to user@example.com: Welcome to our system! [Factory] Creating sms notification with key SECRET-123 📱 Sending SMS to 0987654321: Your OTP is 123456 [Factory] Creating push notification with key SECRET-123 🔔 Sending Push to user user-42: You have a new message! `  
## 6. Giải thích vì sao type-safe
 
 
1. **Builder**: enforce API key phải có trước khi build.
 
2. **Factory**: dùng overloads để compiler biết **exact type** được trả về. 
 
  - `factory.create("email", ...) → EmailNotification`.
 
  - `factory.create("sms", ...) → SmsNotification`.
 

 
 
3. Khi gọi `.send()`, bạn luôn có đầy đủ thuộc tính phù hợp.
 

  
👉 Vậy là Mini Challenge đã được giải xong. Nếu muốn mở rộng thêm: mình có thể viết tiếp một **Enterprise Notification System** có:
 
 
- Queue (RabbitMQ/Kafka)
 
- Retry mechanism
 
- Logging bằng `winston`
 
- Generic `Notification<TPayload>` để type payload tùy loại
---
# 🚀 Enterprise Notification System (Type-Safe + Scalable)
 
## 1. Vấn đề thực tế
 
Trong môi trường enterprise:
 
 
- Có nhiều loại notification (email, sms, push, webhook…).
 
- Message có thể thất bại → cần retry (exponential backoff).
 
- Hệ thống thường push vào **Queue** (Kafka, RabbitMQ, Redis) để xử lý async.
 
- Logging, monitoring là bắt buộc.
 
- Quan trọng nhất: **type safety cho payload** để tránh lỗi runtime.
 

  
## 2. Thiết kế Interface tổng quát
 `// Mỗi Notification có payload riêng interface Notification<TPayload> {   send(payload: TPayload): Promise<void>; } `  
## 3. Định nghĩa payload types
 `type EmailPayload = { to: string; subject: string; body: string }; type SmsPayload = { phone: string; message: string }; type PushPayload = { userId: string; title: string; body: string }; `  
## 4. Triển khai Notification Channels
 `class EmailNotification implements Notification<EmailPayload> {   async send(payload: EmailPayload): Promise<void> {     console.log(`📧 Email to ${payload.to}: ${payload.subject}`);   } }  class SmsNotification implements Notification<SmsPayload> {   async send(payload: SmsPayload): Promise<void> {     console.log(`📱 SMS to ${payload.phone}: ${payload.message}`);   } }  class PushNotification implements Notification<PushPayload> {   async send(payload: PushPayload): Promise<void> {     console.log(`🔔 Push to ${payload.userId}: ${payload.title}`);   } } `  
## 5. Queue + Retry Mechanism
 `interface QueueMessage<T> {   type: "email" | "sms" | "push";   payload: T;   retryCount?: number; }  class NotificationQueue {   private queue: QueueMessage<any>[] = [];    enqueue<T>(msg: QueueMessage<T>): void {     this.queue.push({ ...msg, retryCount: msg.retryCount ?? 0 });   }    dequeue(): QueueMessage<any> | undefined {     return this.queue.shift();   }    size(): number {     return this.queue.length;   } } `  
## 6. Factory để chọn channel phù hợp
 `class NotificationFactory {   static create(type: "email"): Notification<EmailPayload>;   static create(type: "sms"): Notification<SmsPayload>;   static create(type: "push"): Notification<PushPayload>;   static create(type: "email" | "sms" | "push"): Notification<any> {     switch (type) {       case "email": return new EmailNotification();       case "sms": return new SmsNotification();       case "push": return new PushNotification();     }   } } `  
## 7. Worker xử lý Queue với Retry + Logging
 `class NotificationWorker {   constructor(private queue: NotificationQueue, private maxRetries = 3) {}    async process(): Promise<void> {     while (this.queue.size() > 0) {       const msg = this.queue.dequeue();       if (!msg) continue;        const channel = NotificationFactory.create(msg.type);        try {         await channel.send(msg.payload);         console.log(`✅ Sent ${msg.type} successfully`);       } catch (err) {         console.error(`❌ Failed to send ${msg.type}`, err);          if ((msg.retryCount ?? 0) < this.maxRetries) {           console.log(`🔄 Retrying ${msg.type}, attempt ${msg.retryCount! + 1}`);           this.queue.enqueue({             ...msg,             retryCount: (msg.retryCount ?? 0) + 1,           });         } else {           console.error(`💀 Max retries reached for ${msg.type}`);         }       }     }   } } `  
## 8. Sử dụng thực tế
 `// Tạo Queue const queue = new NotificationQueue();  // Enqueue messages queue.enqueue<EmailPayload>({   type: "email",   payload: { to: "user@example.com", subject: "Welcome", body: "Hello!" } });  queue.enqueue<SmsPayload>({   type: "sms",   payload: { phone: "0987654321", message: "Your OTP is 123456" } });  queue.enqueue<PushPayload>({   type: "push",   payload: { userId: "user-42", title: "New Message", body: "You got mail!" } });  // Tạo Worker const worker = new NotificationWorker(queue); worker.process(); `  
## 9. Output (ví dụ)
 `📧 Email to user@example.com: Welcome ✅ Sent email successfully 📱 SMS to 0987654321: Your OTP is 123456 ✅ Sent sms successfully 🔔 Push to user-42: New Message ✅ Sent push successfully `  
## 10. Enterprise Features mở rộng
 
 
- 🔄 **Retry với Exponential Backoff**: delay 1s → 2s → 4s → 8s.
 
- 🗄️ **Persist Queue**: dùng Redis/RabbitMQ thay vì array in-memory.
 
- 📊 **Metrics & Monitoring**: log số lượng success/failure, gửi Prometheus/Grafana.
 
- 🔐 **Security**: encrypt payload trước khi push vào queue.
 
- ⚡ **Parallel Processing**: worker pool xử lý cùng lúc nhiều message.
 

  
👉 Vậy là mình đã mở rộng từ **mini notification** thành **enterprise-grade notification system** type-safe với Builder + Factory + Queue + Retry.
---

  
# 🚀 Enterprise Notification System — Final Perfect Edition
 
## 1. Mục tiêu
 
 
- **Type-safe** toàn bộ (không có `any` lung tung).
 
- **Retry + Exponential Backoff** khi lỗi.
 
---
📌 [<< Ngày 35](./Day35.md) | [Ngày 37 >>](./Day37.md)