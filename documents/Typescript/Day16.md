# 🟧 Day 16 — Decorators

## 1. Decorator là gì?

Decorator trong TypeScript giống như **một cái “tem”** bạn dán lên **class, method, property, tham số…** để:

* Thêm thông tin (metadata).
* Thay đổi hành vi (logic).
* Giúp code gọn hơn, tái sử dụng nhiều lần.

Ví dụ đời thường:

* Nhà hàng dán **tem Halal** → thông tin cho khách biết đồ ăn hợp chuẩn.
* Decorator trong code cũng dán “tem” vào class/hàm để cho compiler/runtime biết: *“À, cái này có thêm chức năng ABC”*.



## 2. Decorator chạy lúc nào?

Không phải lúc bạn gọi hàm, mà **ngay khi class được định nghĩa**.
👉 Nên Decorator thường dùng để setup, cấu hình, logging, hoặc gắn metadata.



## 3. Các tham số của Decorator (params)

Mỗi loại Decorator chạy trong ngữ cảnh khác nhau, vì vậy TypeScript truyền vào **tham số đặc biệt**:

| Loại Decorator | Gắn vào đâu?       | Tham số truyền vào                                                 |
| -------------- | ------------------ | ------------------------------------------------------------------ |
| **Class**      | Class              | `constructor: Function` (hàm tạo của class)                        |
| **Property**   | Thuộc tính (field) | `target: any, propertyKey: string`                                 |
| **Method**     | Phương thức        | `target: any, propertyKey: string, descriptor: PropertyDescriptor` |
| **Accessor**   | Getter/Setter      | Giống Method Decorator                                             |
| **Parameter**  | Tham số hàm        | `target: any, propertyKey: string, parameterIndex: number`         |

📌 Nhớ: bạn **không cần thuộc lòng ngay**, chỉ cần hiểu:

* `target` = object chứa thứ bạn gắn decorator vào.
* `propertyKey` = tên property/method.
* `descriptor` = object mô tả method (có `value`, `writable`, `configurable`, …).



## 4. Ví dụ dễ hiểu từng loại

### 4.1 Class Decorator


### 🟧 Ví dụ:

```ts
// 1. Định nghĩa decorator factory nhận tham số 'path'
function Controller(path: string) {
  // 2. Trả về một hàm decorator thực sự
  return function (constructor: Function) {
    // 3. 'constructor' chính là class được gắn decorator
    //    Ví dụ: UserController
    // 4. In ra console để xác nhận decorator chạy
    console.log(`Controller registered: ${path}`);
  };
}

// 5. Gắn decorator cho class UserController
//    Khi file được load, decorator sẽ chạy NGAY LẬP TỨC
@Controller("/users")
class UserController {}

// ✅ Output khi chạy file:
// "Controller registered: /users"
```

---

### 📌 Tóm tắt cách hoạt động

1. `Controller("/users")` → gọi hàm factory, trả về 1 decorator function.
2. Decorator function nhận `constructor` (UserController).
3. Chạy code trong decorator (ở đây: `console.log(...)`).
4. Kết quả xuất hiện **ngay khi định nghĩa class**, không cần tạo instance.



---

### 4.2 Property Decorator

👉 Dùng để điều chỉnh thuộc tính.

### 🟧 Ví dụ:

```ts
// 1. Định nghĩa một decorator cho property
function MinLength(length: number) {
  // 2. Trả về decorator function thực sự
  return function (target: any, propertyKey: string) {
    // 3. 'target' = prototype của class
    // 4. 'propertyKey' = tên thuộc tính được gắn decorator
    let value: string;

    // 5. Định nghĩa getter & setter cho property
    const getter = () => value;
    const setter = (newVal: string) => {
      // 6. Kiểm tra độ dài của chuỗi
      if (newVal.length < length) {
        throw new Error(
          `❌ Thuộc tính "${propertyKey}" phải có ít nhất ${length} ký tự`
        );
      }
      value = newVal;
    };

    // 7. Gắn lại property với getter & setter tuỳ chỉnh
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}

// 8. Sử dụng decorator trong class
class User {
  @MinLength(6) // yêu cầu password >= 6 ký tự
  password: string;

  constructor(password: string) {
    this.password = password;
  }
}

// 9. Test case
const user1 = new User("abcdef"); // ✅ Hợp lệ
console.log("user1:", user1);

const user2 = new User("123"); // ❌ Lỗi: phải có >= 6 ký tự
```

---

### 📌 Phân tích

* `MinLength(6)` → gọi factory, trả về function decorator.
* Decorator function được gọi với:

  * `target`: prototype của `User`.
  * `propertyKey`: `"password"`.
* Ta override lại setter của `password` để kiểm tra độ dài.
* Khi `this.password = "123"` → setter chạy, thấy length < 6 → throw error.

---

### 🏢 Ứng dụng trong enterprise

* Form validation: `@MinLength`, `@IsEmail`, `@IsPhoneNumber`.
* API validation: đảm bảo dữ liệu client gửi đúng format trước khi lưu DB.
* Giúp **type safety + runtime safety**, tránh bug/SQL injection.


---

### 4.3 Method Decorator

👉 Dùng để chặn / mở rộng logic method.



---

### 🟧 Ví dụ: Method Decorator (Logger)

```ts
// 1. Định nghĩa method decorator
function LogExecutionTime(
  target: any,            // 2. prototype của class
  propertyKey: string,    // 3. tên method
  descriptor: PropertyDescriptor // 4. mô tả method (có value = function gốc)
) {
  // 5. Lưu method gốc
  const originalMethod = descriptor.value;

  // 6. Thay thế method bằng function mới
  descriptor.value = function (...args: any[]) {
    console.log(`🚀 Gọi ${propertyKey} với args:`, args);

    const start = performance.now(); // 7. bắt đầu đo thời gian
    const result = originalMethod.apply(this, args); // 8. gọi method gốc
    const end = performance.now();   // 9. kết thúc đo thời gian

    console.log(`✅ ${propertyKey} hoàn thành sau ${end - start}ms`);
    return result; // 10. trả về kết quả như bình thường
  };

  return descriptor; // 11. trả về descriptor đã chỉnh sửa
}

// 12. Class sử dụng method decorator
class MathService {
  @LogExecutionTime
  sum(a: number, b: number) {
    return a + b;
  }

  @LogExecutionTime
  factorial(n: number): number {
    if (n === 0) return 1;
    return n * this.factorial(n - 1);
  }
}

// 13. Test case
const math = new MathService();
console.log("Kết quả sum:", math.sum(5, 7));       // chạy nhanh
console.log("Kết quả factorial:", math.factorial(5)); // recursive
```

---

### 📌 Phân tích

* `@LogExecutionTime` được áp vào method `sum` và `factorial`.
* Khi gọi method:

  1. Log ra args.
  2. Đo thời gian chạy.
  3. Gọi method gốc.
  4. Log ra thời gian hoàn thành.
* Nhờ decorator, bạn **không phải viết lặp đi lặp lại code đo performance** trong từng method.

---

### 🏢 Ứng dụng enterprise

* **Monitoring**: đo performance API (`@LogExecutionTime` trên controller).
* **Security**: `@RequireAuth` kiểm tra user có quyền trước khi chạy method.
* **Validation**: `@ValidateInput` đảm bảo input hợp lệ.
* **Caching**: `@Cached` lưu kết quả vào Redis/memory cache.




---

### 4.4 Accessor Decorator

👉 Dùng cho getter/setter.

```ts
function Capitalize(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.get;
  descriptor.get = function () {
    const result = original!.apply(this);
    return result.toUpperCase();
  };
}

class Person {
  constructor(private _name: string) {}
  
  @Capitalize
  get name() {
    return this._name;
  }
}

console.log(new Person("alice").name); // "ALICE"
```
```ts
function Readonly(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  descriptor.writable = false; // ngăn thay đổi setter
}

class Car {
  private _speed = 0;

  @Readonly
  get speed() {
    return this._speed;
  }
}
const car = new Car();
car.speed = 100; // ❌ Error, readonly
```
**Enterprise use case:**

* Chặn sửa đổi thuộc tính nhạy cảm (ví dụ: config, token).
---

### 4.5 Parameter Decorator


Parameter decorator được dùng để **lấy metadata của tham số trong method/class**.
Nó chạy tại **compile time**, không phải khi thực thi code.

---

### 📌 Ví dụ cơ bản có giải thích chi tiết

```ts
// 🟢 Parameter Decorator function
function LogParameter(target: Object, methodName: string, parameterIndex: number) {
  // target: prototype của class chứa method
  // methodName: tên method có tham số được decorate
  // parameterIndex: vị trí của tham số trong danh sách params
  console.log("target:", target);          
  console.log("methodName:", methodName);  
  console.log("parameterIndex:", parameterIndex);
}

class Person {
  greet(@LogParameter message: string, @LogParameter name: string) {
    // method greet có 2 tham số: message, name
    console.log(`${message}, ${name}`);
  }
}

const p = new Person();
p.greet("Hello", "Alice"); 
```

---

### 📝 Giải thích từng dòng

```ts
function LogParameter(target: Object, methodName: string, parameterIndex: number) {
  // Đây là hàm decorator cho tham số.
  // Nó sẽ chạy ngay khi class được "định nghĩa", chứ không phải khi gọi method.

  console.log("target:", target);          
  // target → prototype của class Person

  console.log("methodName:", methodName);  
  // methodName → "greet"

  console.log("parameterIndex:", parameterIndex);
  // parameterIndex → vị trí tham số (0 cho message, 1 cho name)
}
```

```ts
class Person {
  greet(@LogParameter message: string, @LogParameter name: string) {
    // Khi biên dịch, TS sẽ gọi LogParameter 2 lần:
    // 1. cho message (index = 0)
    // 2. cho name (index = 1)
    console.log(`${message}, ${name}`);
  }
}
```

```ts
const p = new Person();
p.greet("Hello", "Alice"); 
// Khi chạy code → chỉ in "Hello, Alice"
// Decorator đã được gọi trước đó (compile time), không ảnh hưởng logic.
```

---

### 🟦 Ứng dụng `.apply` và `.call` trong Parameter Decorator

Bạn có thể kết hợp decorator với `.apply` để **ghi log tham số trước khi gọi method thật sự**.

```ts
function LogParams(target: any, methodName: string, parameterIndex: number) {
  const originalMethod = target[methodName]; // lấy method gốc

  target[methodName] = function (...args: any[]) {
    console.log(`📌 Method: ${methodName}`);
    console.log(`👉 Param[${parameterIndex}] value:`, args[parameterIndex]);

    // Dùng .apply để gọi lại method gốc với context (this) + args
    return originalMethod.apply(this, args);
  };
}

class Calculator {
  add(@LogParams a: number, @LogParams b: number) {
    return a + b;
  }
}

const c = new Calculator();
console.log(c.add(5, 10));
// Output:
// 📌 Method: add
// 👉 Param[0] value: 5
// 📌 Method: add
// 👉 Param[1] value: 10
// 15
```

---

## 📝 Giải thích dòng nào ra dòng đó

```ts
const originalMethod = target[methodName];
// Lưu lại hàm gốc (add) để lát nữa gọi lại

target[methodName] = function (...args: any[]) {
  // Ghi đè method add bằng function mới
  console.log(`📌 Method: ${methodName}`);
  console.log(`👉 Param[${parameterIndex}] value:`, args[parameterIndex]);

  return originalMethod.apply(this, args);
  // Dùng apply để gọi lại hàm gốc add, đảm bảo this + args không bị mất
};
```

---

👉 Như vậy bạn thấy:

* **Parameter Decorator** cho biết *vị trí tham số*.
* **`.apply`** giúp gọi lại method gốc mà không mất context.
* Kết hợp lại → có thể log, validate, hoặc biến đổi tham số trước khi chạy logic thật sự.


---

## 5. Tại sao dùng Decorators?

* **Tái sử dụng code**: thay vì viết đi viết lại `console.log` trong mỗi method → chỉ cần `@Log`.
* **Tách biệt logic kỹ thuật** (logging, validation, security) khỏi **logic nghiệp vụ** (business).
* **Enterprise frameworks** (NestJS, Angular) dùng Decorators cực nhiều:

  * `@Controller`, `@Injectable`, `@Get`, `@Post` → dễ đọc, dễ maintain.

---

## 6. Tổng kết

* Decorator = dán “tem” + gắn logic.
* Có 5 loại chính.
* Tham số decorator giúp bạn biết **đang gắn vào đâu**.
* Rất hữu ích trong enterprise để tổ chức code gọn, dễ maintain.
* #### Tổng quan & ghi nhớ

  * **Class** → gắn cho class (controller, service, singleton).
  * **Method** → can thiệp behavior method (log, cache, audit).
  * **Property** → validate, metadata, ORM mapping.
  * **Accessor** → getter/setter protection (readonly, computed).
  * **Parameter** → log, validate, inject dependencies.
---

💡 **Tips khi dùng decorator trong enterprise:**

1. Luôn test kỹ vì decorator chạy **trước instance**, dễ gây side effect.
2. Kết hợp với **metadata reflection** (`reflect-metadata`) để lưu thông tin runtime.
3. Dùng decorator để **tách concerns**: validation, logging, authorization, caching.



---

### 🟦 Day 16 — Exercises + Enterprise Example



### **Level 1 — Basic Class & Method Decorator**

**Bài tập:**

1. Tạo **class `Logger`**.
2. Viết **method decorator `LogCall`** để log ra console mỗi lần method được gọi.

```ts
function LogCall(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  // Lưu method gốc
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Method ${propertyKey} được gọi với args:`, args); // log args
    return originalMethod.apply(this, args); // gọi method gốc
  };

  return descriptor;
}

class Logger {
  @LogCall
  sayHello(name: string) {
    console.log(`Hello, ${name}`);
  }
}

const logger = new Logger();
logger.sayHello("Alice"); 
// Output:
// Method sayHello được gọi với args: ["Alice"]
// Hello, Alice
```

---

### **Level 2 — Property & Accessor Decorator**

**Bài tập:**

1. Tạo **class `User`** với property `password`.
2. Viết **property decorator `MinLength`** để validate password >= 6 ký tự.
3. Tạo **getter `maskedPassword`** và dùng **accessor decorator** để readonly.

```ts
function MinLength(length: number) {
  return function (target: any, propertyKey: string) {
    let value: string;
    const getter = () => value;
    const setter = (newVal: string) => {
      if (newVal.length < length) {
        throw new Error(`${propertyKey} phải >= ${length} ký tự`);
      }
      value = newVal;
    };
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
    });
  };
}

function Readonly(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  descriptor.writable = false;
}

class User {
  @MinLength(6)
  password: string;

  constructor(password: string) {
    this.password = password; // gọi setter validate
  }

  @Readonly
  get maskedPassword() {
    return this.password.replace(/./g, "*");
  }
}

const u = new User("123456"); // ✅ hợp lệ
console.log(u.maskedPassword); // ******
// u.maskedPassword = "abc"; // ❌ Error: readonly
```

---

### **Level 3 — Parameter Decorator + Enterprise Example**

**Bài tập Enterprise-style:**

* Tạo **API class `AuthService`**.
* Method `login(username, password)`.
* Dùng **parameter decorator `Validate`** để validate param kiểu string không rỗng.
* Dùng **method decorator `LogExecutionTime`** để log performance.

```ts
// Parameter decorator
function Validate(target: Object, methodName: string, parameterIndex: number) {
  const metadataKey = `__validate_${methodName}`;
  if (!Array.isArray((target as any)[metadataKey])) {
    (target as any)[metadataKey] = [];
  }
  (target as any)[metadataKey].push(parameterIndex);
}

// Method decorator
function LogExecutionTime(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Method ${propertyKey} gọi với args:`, args);
    const start = performance.now();
    const result = originalMethod.apply(this, args);
    const end = performance.now();
    console.log(`Method ${propertyKey} hoàn thành sau ${end - start}ms`);
    return result;
  };
  return descriptor;
}

class AuthService {
  @LogExecutionTime
  login(@Validate username: string, @Validate password: string) {
    // validate parameters
    const paramIndexes = (this as any)["__validate_login"];
    paramIndexes.forEach((index: number) => {
      if (typeof arguments[index] !== "string" || arguments[index].trim() === "") {
        throw new Error(`Param ${index} không hợp lệ`);
      }
    });
    // simulate login
    return { token: "abc123", user: username };
  }
}

const auth = new AuthService();
console.log(auth.login("alice", "password123")); 
// Output:
// Method login gọi với args: ["alice","password123"]
// Method login hoàn thành sau Xms
// { token: "abc123", user: "alice" }

// auth.login("", "pass"); // ❌ Error: Param 0 không hợp lệ
```

---

### ✅ Enterprise Use Case Giải thích

* **Method Decorator** `LogExecutionTime` → đo performance API, logging audit.
* **Parameter Decorator** `Validate` → đảm bảo dữ liệu đầu vào đúng format trước khi chạy logic.
* **Kết hợp cả 2** → giúp code **sạch, maintainable, an toàn runtime**.
* Có thể mở rộng: cache result, role-based access control, input sanitization.


---




# 🟦 Mini Project: Enterprise-style API với Decorators

**Mục tiêu:**

* Class `UserController` là API controller.
* Property `password` có validation (`Property Decorator`).
* Method `login` log performance (`Method Decorator`) và validate param (`Parameter Decorator`).
* Getter `maskedPassword` readonly (`Accessor Decorator`).
* Class decorator dùng để đăng ký route (`Class Decorator`).

---

## 📌 Code đầy đủ

```ts
// 1️⃣ Class Decorator — đăng ký route
function Controller(path: string) {
  return function (constructor: Function) {
    console.log(`Controller registered for route: ${path}`);
  };
}

// 2️⃣ Method Decorator — log execution time
function LogExecutionTime(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value; // lưu method gốc
  descriptor.value = function (...args: any[]) {
    console.log(`Method ${propertyKey} gọi với args:`, args);
    const start = performance.now();
    const result = originalMethod.apply(this, args); // dùng .apply để giữ context
    const end = performance.now();
    console.log(`Method ${propertyKey} hoàn thành sau ${end - start}ms`);
    return result;
  };
  return descriptor;
}

// 3️⃣ Property Decorator — validate min length
function MinLength(length: number) {
  return function (target: any, propertyKey: string) {
    let value: string;
    const getter = () => value;
    const setter = (newVal: string) => {
      if (newVal.length < length) {
        throw new Error(`${propertyKey} phải >= ${length} ký tự`);
      }
      value = newVal;
    };
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
    });
  };
}

// 4️⃣ Accessor Decorator — readonly getter
function Readonly(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  descriptor.writable = false; // chặn setter
}

// 5️⃣ Parameter Decorator — validate param non-empty string
function Validate(target: Object, methodName: string, parameterIndex: number) {
  const metadataKey = `__validate_${methodName}`;
  if (!Array.isArray((target as any)[metadataKey])) {
    (target as any)[metadataKey] = [];
  }
  (target as any)[metadataKey].push(parameterIndex);
}

// 📌 Controller class
@Controller("/users")
class UserController {
  @MinLength(6)
  password: string; // property decorator

  constructor(password: string) {
    this.password = password; // gọi setter validate
  }

  @Readonly
  get maskedPassword() { // accessor decorator
    return this.password.replace(/./g, "*");
  }

  @LogExecutionTime
  login(@Validate username: string, @Validate password: string) { // method + parameter decorator
    // validate parameters
    const paramIndexes = (this as any)["__validate_login"];
    paramIndexes.forEach((index: number) => {
      if (typeof arguments[index] !== "string" || arguments[index].trim() === "") {
        throw new Error(`Param ${index} không hợp lệ`);
      }
    });

    // simulate authentication logic
    if (this.password !== password) {
      throw new Error("Password incorrect");
    }

    return {
      token: "token-xyz",
      user: username,
      maskedPassword: this.maskedPassword,
    };
  }
}

// 📌 Test
const userCtrl = new UserController("123456");
console.log(userCtrl.login("alice", "123456"));
// Output:
// Controller registered for route: /users
// Method login gọi với args: ["alice","123456"]
// Method login hoàn thành sau Xms
// { token: "token-xyz", user: "alice", maskedPassword: "******" }

// userCtrl.login("", "123456"); // ❌ Error: Param 0 không hợp lệ
// userCtrl.password = "123";     // ❌ Error: password phải >= 6 ký tự
// userCtrl.maskedPassword = "abc"; // ❌ Error: readonly
```

---

## 🟦 Giải thích chi tiết

1. **Class Decorator `@Controller`**

   * Đăng ký route khi class được định nghĩa.
   * Dùng trong framework enterprise như NestJS để map route controller.

2. **Property Decorator `@MinLength`**

   * Validate password >= 6 ký tự.
   * Khi constructor set password, setter được gọi → validate.

3. **Accessor Decorator `@Readonly`**

   * Getter `maskedPassword` không thể set ngoài class.

4. **Parameter Decorator `@Validate`**

   * Lưu metadata index tham số cần validate.
   * Khi method `login` gọi, kiểm tra các param này hợp lệ trước khi chạy logic.

5. **Method Decorator `@LogExecutionTime`**

   * Log args, đo thời gian thực thi method.
   * `.apply(this, args)` đảm bảo context method không mất.

---

## 🟦 Enterprise Use Case

* **Controller Decorator** → map route API.
* **Property Decorator** → enforce domain rules (password, email, config).
* **Accessor Decorator** → bảo vệ thuộc tính nhạy cảm.
* **Parameter Decorator** → validate dữ liệu input trước khi chạy logic, log/audit.
* **Method Decorator** → performance monitoring, logging, caching, transaction.


---


## 🟦 Mini Project Enterprise: Full API với Decorators & Inheritance

**Mục tiêu:**

1. Base controller `BaseController` chứa logic chung.
2. Các controller con (`UserController`, `ProductController`) kế thừa.
3. Sử dụng **tất cả loại decorator**: Class, Method, Property, Accessor, Parameter.
4. Endpoint có validation, logging, performance monitoring.

---

## 📌 Base Decorators

```ts
// Class decorator: đăng ký route
function Controller(path: string) {
  return function (constructor: Function) {
    console.log(`Controller registered for route: ${path}`);
  };
}

// Method decorator: log execution time
function LogExecutionTime(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Method ${propertyKey} gọi với args:`, args);
    const start = performance.now();
    const result = original.apply(this, args);
    const end = performance.now();
    console.log(`Method ${propertyKey} hoàn thành sau ${end - start}ms`);
    return result;
  };
}

// Property decorator: validate min length
function MinLength(length: number) {
  return function (target: any, propertyKey: string) {
    let value: string;
    Object.defineProperty(target, propertyKey, {
      get: () => value,
      set: (newVal: string) => {
        if (newVal.length < length) throw new Error(`${propertyKey} phải >= ${length} ký tự`);
        value = newVal;
      },
    });
  };
}

// Accessor decorator: readonly
function Readonly(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  descriptor.writable = false;
}

// Parameter decorator: validate param non-empty string
function Validate(target: Object, methodName: string, paramIndex: number) {
  const key = `__validate_${methodName}`;
  if (!Array.isArray((target as any)[key])) (target as any)[key] = [];
  (target as any)[key].push(paramIndex);
}
```

---

## 📌 BaseController

```ts
class BaseController {
  protected validateParams(methodName: string, args: any[]) {
    const paramIndexes = (this as any)[`__validate_${methodName}`] || [];
    paramIndexes.forEach((index: number) => {
      if (typeof args[index] !== "string" || args[index].trim() === "") {
        throw new Error(`Param ${index} không hợp lệ`);
      }
    });
  }
}
```

* `BaseController` cung cấp method `validateParams` để reuse logic validation cho tất cả controller con.

---

## 📌 UserController

```ts
@Controller("/users")
class UserController extends BaseController {
  @MinLength(6)
  password: string;

  constructor(password: string) {
    super();
    this.password = password;
  }

  @Readonly
  get maskedPassword() {
    return this.password.replace(/./g, "*");
  }

  @LogExecutionTime
  login(@Validate username: string, @Validate password: string) {
    this.validateParams("login", arguments); // reuse BaseController
    if (password !== this.password) throw new Error("Password incorrect");
    return { token: "user-token", user: username, maskedPassword: this.maskedPassword };
  }

  @LogExecutionTime
  updatePassword(@Validate newPassword: string) {
    this.validateParams("updatePassword", arguments);
    this.password = newPassword; // setter sẽ validate
    return { success: true };
  }
}
```

---

## 📌 ProductController

```ts
@Controller("/products")
class ProductController extends BaseController {
  private products: { id: number; name: string }[] = [];

  @LogExecutionTime
  addProduct(@Validate name: string) {
    this.validateParams("addProduct", arguments);
    const id = this.products.length + 1;
    this.products.push({ id, name });
    return { id, name };
  }

  @LogExecutionTime
  listProducts() {
    return this.products;
  }
}
```

---

## 📌 Test Mini Project

```ts
const userCtrl = new UserController("123456");
console.log(userCtrl.login("alice", "123456")); 
// { token: "user-token", user: "alice", maskedPassword: "******" }

console.log(userCtrl.updatePassword("abcdef")); 
// { success: true }

const productCtrl = new ProductController();
console.log(productCtrl.addProduct("Laptop")); 
// { id: 1, name: "Laptop" }
console.log(productCtrl.listProducts()); 
// [{ id: 1, name: "Laptop" }]
```

---

## 🟦 Giải thích Enterprise Pattern

1. **Inheritance**

   * `BaseController` cung cấp logic dùng chung: validation, error handling.
   * Controller con chỉ cần focus business logic.

2. **Class Decorator**

   * Đăng ký route API tự động, log khi class được định nghĩa.

3. **Method Decorator**

   * Log args & performance → audit, monitoring.

4. **Property & Accessor Decorator**

   * Bảo vệ dữ liệu nhạy cảm, enforce domain rules.

5. **Parameter Decorator**

   * Validate input trước khi chạy logic → đảm bảo runtime safety.

6. **Reusable & Scalable**

   * Thêm controller mới chỉ cần extends `BaseController` + decorate các method/property → pattern có thể scale trong dự án enterprise.

---

💡 **Next Step Suggestion:**

* Có thể kết hợp **Generics + Decorators** để viết API “type-safe” hoàn toàn giữa FE & BE.
* Dùng **decorator factory** để config rules runtime (ex: role-based access, caching, transaction).

---


[<< Ngày 15](./Day15.md) | [Ngày 17 >>](./Day17.md)