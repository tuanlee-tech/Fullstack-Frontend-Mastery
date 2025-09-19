# 📘 Day 33 — Utility Types nâng cao: `ReturnType`, `InstanceType`, `NonNullable`

## 🎯 Mục tiêu học

* Hiểu rõ cách hoạt động của 3 utility types nâng cao: `ReturnType<T>`, `InstanceType<T>`, `NonNullable<T>`.
* Biết áp dụng để **tự động hoá type inference** thay vì viết type thủ công.
* Thấy rõ **trường hợp thực tế trong enterprise codebase** (service layer, DI container, API response).
* Nhận diện pitfalls khi lạm dụng hoặc sai context.
* Chuẩn bị nền tảng cho Conditional Types (Day 34).

---

## TL;DR

* `ReturnType<T>`: lấy kiểu **giá trị trả về** của một function.
* `InstanceType<T>`: lấy kiểu **instance** khi `new` từ một class.
* `NonNullable<T>`: loại bỏ `null` và `undefined` khỏi union type.

Các utility này giúp code **DRY hơn, ít trùng lặp type hơn**, dễ bảo trì trong hệ thống lớn.

---

## 📖 Nội dung lý thuyết

### 1. `ReturnType<T>`

* Dùng khi bạn muốn biết function trả về kiểu gì, thay vì định nghĩa lại.
* **Cú pháp**:

  ```ts
  type R = ReturnType<typeof fn>;
  ```
* Enterprise use-case:

  * API client functions (`getUser()`, `fetchPosts()`) → dùng để type các selectors hoặc hooks.
  * Middleware system: bắt buộc return đúng dạng contract.

---

### 2. `InstanceType<T>`

* Dùng để lấy kiểu instance từ class constructor.
* **Cú pháp**:

  ```ts
  class User { ... }
  type U = InstanceType<typeof User>; // chính là User
  ```
* Enterprise use-case:

  * Khi bạn có **DI container** (Dependency Injection) lưu các class, bạn có thể infer type instance thay vì ghi tay.
  * Khi viết **factory pattern**.

---

### 3. `NonNullable<T>`

* Loại bỏ `null` và `undefined`.
* **Cú pháp**:

  ```ts
  type NN = NonNullable<string | null | undefined>; // string
  ```
* Enterprise use-case:

  * API trả về dữ liệu có thể `null` → bạn tạo type an toàn hơn cho business logic.
  * Form validation: ép kiểu để chắc chắn dữ liệu đã validated.

---

## 💻 Ví dụ thực tế (Production-ready)

```ts
// ReturnType
function createUser(name: string, age: number) {
  return { id: Date.now(), name, age };
}
type User = ReturnType<typeof createUser>;

const u: User = { id: 1, name: "Alice", age: 25 };

// InstanceType
class Service {
  log(msg: string) {
    console.log(`[Service] ${msg}`);
  }
}
type Svc = InstanceType<typeof Service>;
const svc: Svc = new Service();

// NonNullable
type ApiResponse = { data?: string | null };
function handleResponse(res: ApiResponse) {
  type Data = NonNullable<ApiResponse["data"]>;
  const data: Data = res.data ?? "default"; // luôn string
  return data.toUpperCase();
}
```

---

## 📝 Bài tập

### Level 1

**Đề**: Viết function `getConfig()` trả về object `{ apiUrl: string, timeout?: number }`.
Dùng `ReturnType` để định nghĩa type `Config`.

**Lời giải**:

```ts
function getConfig() {
  return { apiUrl: "https://api.example.com", timeout: 5000 };
}
type Config = ReturnType<typeof getConfig>;

const cfg: Config = { apiUrl: "x", timeout: 2000 };
```

👉 Giúp tránh viết lại type khi function thay đổi.

---

### Level 2

**Đề**: Có class `Database` với method `connect()`.
Dùng `InstanceType` để type biến `db`.

**Lời giải**:

```ts
class Database {
  connect() { return true; }
}
type DB = InstanceType<typeof Database>;

const db: DB = new Database();
db.connect(); // ok
```

👉 Tránh việc `class` đổi tên/đổi signature → type vẫn đúng.

---

### Level 3

**Đề**: API có thể trả về `string | null | undefined`.
Viết hàm `safeUpperCase(input)` đảm bảo return luôn `string`.

**Lời giải**:

```ts
type Raw = string | null | undefined;
type Clean = NonNullable<Raw>;

function safeUpperCase(input: Raw): Clean {
  return (input ?? "default").toUpperCase();
}

console.log(safeUpperCase(null)); // "DEFAULT"
```

👉 Giúp business logic **an toàn hơn**, tránh runtime error.

---

## ⚠️ Common Pitfalls

* **Overuse**: Không phải lúc nào cũng cần `ReturnType` — đôi khi type thủ công rõ ràng hơn.
* **InstanceType hạn chế**: Chỉ dùng cho class constructors, không dùng cho factory functions.
* **NonNullable không validate runtime**: Chỉ ở type-level → cần code check thêm nếu dữ liệu từ API.

---

## ✅ Checklist Enterprise

* Khi API thay đổi → luôn dùng `ReturnType` cho selectors/hooks.
* Với DI containers → ưu tiên `InstanceType` để đảm bảo đúng instance typing.
* Trước khi deploy: check tất cả union type có thể chứa `null/undefined` → consider `NonNullable`.

---


# 🔥 Day 33 — Mở rộng Advanced Utility Types

## 1. `ReturnType` với `async function` và unwrap `Promise<T>`

### Vấn đề

`ReturnType` lấy kiểu **nguyên gốc** → với `async`, nó sẽ ra `Promise<...>` chứ không unwrap sẵn.
Enterprise thực tế thường cần **lấy giá trị bên trong Promise**.

### Ví dụ

```ts
async function fetchUser(id: number) {
  return { id, name: "Alice" };
}

type UserPromise = ReturnType<typeof fetchUser>; 
// -> Promise<{ id: number; name: string }>

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type User = UnwrapPromise<UserPromise>;
// -> { id: number; name: string }

async function main() {
  const u: User = await fetchUser(1);
  console.log(u.name);
}
```

👉 Kết hợp `ReturnType` + Conditional Types (`infer`) → rất mạnh cho API layer.
Ví dụ: `useQuery` hooks có thể tự động hiểu kiểu dữ liệu fetch về.

---

## 2. Kết hợp `NonNullable` + `ReturnType`

### Vấn đề

API function có thể trả về dữ liệu optional (`null | undefined`).
Bạn muốn type **đã được clean**.

### Ví dụ

```ts
function getProfile(userId: string) {
  return userId ? { id: userId, email: "a@b.com" } : null;
}

type RawProfile = ReturnType<typeof getProfile>; 
// -> { id: string; email: string } | null

type Profile = NonNullable<RawProfile>;
// -> { id: string; email: string }

function handleProfile(p: Profile) {
  console.log(p.email.toUpperCase());
}
```

👉 Giúp đảm bảo function xử lý dữ liệu **sau khi đã validate**, tránh bug khi quên check null.

---

## 3. Mini DI Container với `InstanceType`

### Vấn đề

Trong enterprise app, bạn thường có **Dependency Injection Container** để quản lý services.
Bạn muốn infer type instance tự động.

### Ví dụ

```ts
class Logger {
  log(msg: string) { console.log(`[LOG] ${msg}`); }
}
class UserService {
  getUser() { return { id: 1, name: "Alice" }; }
}

const container = {
  logger: Logger,
  userService: UserService,
};

// Utility type: lấy instance cho mỗi class
type Instances<T> = {
  [K in keyof T]: InstanceType<T[K]>;
};

type Services = Instances<typeof container>;

const services: Services = {
  logger: new Logger(),
  userService: new UserService(),
};

// Usage
services.logger.log("Start app");
console.log(services.userService.getUser());
```

👉 Đây chính là pattern thực tế trong **NestJS, Angular** hoặc bất kỳ DI container nào.
Khi bạn thêm class mới → type `Services` tự cập nhật, không cần sửa tay.

---

## ✅ Checklist mở rộng

* [x] Hiểu `ReturnType` không unwrap Promise → cần conditional + `infer`.
* [x] Kết hợp `ReturnType` + `NonNullable` để làm API types an toàn hơn.
* [x] Biết pattern DI Container với `InstanceType` để quản lý nhiều service class.

---

📌 **Kết thúc mở rộng Day 33**:
Giờ bạn không chỉ nắm cơ bản mà còn biết **combine utility types** cho case thực tế enterprise. Đây là bước chuẩn bị cực tốt trước khi qua **Day 34: Conditional Types & Infer**, vì hầu hết kỹ thuật nâng cao đều xoay quanh **conditional + inference**.

---

### Template Literal Types + keyof + typeof

Trong enterprise project, `keyof` và `typeof` **thường đi kèm** với **Template Literal Types** để sinh ra type động theo **pattern string**. Đây là cách giúp ta type-safe mà vẫn linh hoạt.

---

## 1️⃣ Template Literal Types là gì?

Template Literal Types cho phép kết hợp **string literal types** với `union` và `keyof` để tạo ra **type pattern động**.

```ts
type Event = "click" | "scroll" | "mousemove";

// Kết hợp với prefix
type EventHandlerName = `on${Capitalize<Event>}`;
// "onClick" | "onScroll" | "onMousemove"
```

📌 Ứng dụng: auto-generate function names, API route types, Redux action types…

---

## 2️⃣ Kết hợp với keyof + typeof

Ví dụ một object gốc:

```ts
const endpoints = {
  getUser: "/api/user",
  updateUser: "/api/user/update",
  deleteUser: "/api/user/delete"
} as const;

type EndpointKeys = keyof typeof endpoints;
// "getUser" | "updateUser" | "deleteUser"

type EndpointPaths = typeof endpoints[EndpointKeys];
// "/api/user" | "/api/user/update" | "/api/user/delete"

// Sinh ra type cho action type
type ActionTypes = `${EndpointKeys}_SUCCESS` | `${EndpointKeys}_FAILURE`;
// "getUser_SUCCESS" | "getUser_FAILURE" | ...
```

➡️ Nhờ đó, codebase luôn đồng bộ: đổi tên key trong object → type tự động update, tránh bug hardcode.

---

## 3️⃣ Advanced Pattern: Mapping API responses

```ts
const api = {
  login: { method: "POST", path: "/login" },
  logout: { method: "POST", path: "/logout" },
  getProfile: { method: "GET", path: "/profile" },
} as const;

type ApiRoutes = keyof typeof api;
// "login" | "logout" | "getProfile"

type ApiMethods = typeof api[ApiRoutes]["method"];
// "POST" | "GET"

type ApiPaths = typeof api[ApiRoutes]["path"];
// "/login" | "/logout" | "/profile"

type ApiRequest<T extends ApiRoutes> = {
  route: T;
  method: typeof api[T]["method"];
  path: typeof api[T]["path"];
};

// Ví dụ dùng
const req: ApiRequest<"login"> = {
  route: "login",
  method: "POST",
  path: "/login",
};
```

👉 Nhờ template literal + keyof + typeof, API contract luôn type-safe, giảm bug khi refactor.

---

## 4️⃣ Bài tập mở rộng

### Level 1

Cho object sau:

```ts
const colors = {
  primary: "#3498db",
  secondary: "#2ecc71",
  danger: "#e74c3c",
} as const;
```

➡️ Sinh ra type `"bg-primary" | "bg-secondary" | "bg-danger"`.
```ts
    // Sinh ra type "bg-primary" | "bg-secondary" | "bg-danger"
    type ColorClass = `bg-${keyof typeof colors}`;
```
---

### Level 2

Từ object:

```ts
const events = {
  login: "user logged in",
  logout: "user logged out",
  signup: "user signed up",
} as const;
```

➡️ Sinh ra type `"onLogin" | "onLogout" | "onSignup"` và implement một hàm:

```ts
function handleEvent(event: /* type ở trên */) {
  console.log("Handling", event);
}
```
```ts
// Sinh ra type "onLogin" | "onLogout" | "onSignup"
type EventHandler = `on${Capitalize<keyof typeof events>}`;
// Hàm handleEvent
function handleEvent(event: EventHandler) {
  console.log("Handling", event);
}
```
---

### Level 3

Giả sử có API schema:

```ts
const schema = {
  user: {
    get: "/api/user/get",
    update: "/api/user/update",
  },
  product: {
    list: "/api/product/list",
    detail: "/api/product/detail",
  }
} as const;
```

➡️ Sinh ra union type `"user.get" | "user.update" | "product.list" | "product.detail"`.

Gợi ý: dùng **nested keyof + template literal types**.
```ts

// Sinh ra union type "user.get" | "user.update" | "product.list" | "product.detail"
type ApiEndpoints = `${keyof typeof schema}.${keyof typeof schema[keyof typeof schema]}`;
```
Giải thích:

* `keyof typeof schema` sẽ lấy ra các keys chính là `"user"` và `"product"`.
* `keyof typeof schema[keyof typeof schema]` sẽ lấy ra các keys của các object con, ví dụ `"get"`, `"update"`, `"list"`, `"detail"`.
* Template literal type `${keyof typeof schema}.${keyof typeof schema[keyof typeof schema]}` sẽ kết hợp chúng thành `"user.get"`, `"user.update"`, `"product.list"`, và `"product.detail"`.
---

## 5️⃣ Checklist trước khi qua Day 34

* [ ] Hiểu cách kết hợp `keyof` + `typeof` + **template literal types**.
* [ ] Biết auto-generate type từ object constant.
* [ ] Biết áp dụng vào API schema, Redux action type, CSS utility class.
* [ ] Giải xong Level 3 (nested keys).

---
# 📘 Indexed Access, Key Remapping & Getter Pattern

---

## 1️⃣ Indexed Access Types

Indexed Access cho phép ta **lấy type từ property của object** giống như khi truy cập value.

```ts
type User = {
  id: number;
  profile: {
    name: string;
    age: number;
  };
};

type NameType = User["profile"]["name"]; 
// string
```

👉 Rất hữu ích khi cần “tách” một phần type để tái sử dụng.

---

## 2️⃣ Key Remapping (TS 4.1+)

Key remapping cho phép **đổi tên key** khi dùng mapped type.

```ts
type Prefix<T, P extends string> = {
  [K in keyof T as `${P}${Capitalize<string & K>}`]: T[K];
};

type Original = { id: number; name: string; };
type Prefixed = Prefix<Original, "my">;
// { myId: number; myName: string }
```

📌 Ứng dụng: auto-generate DTO, API request/response types, Redux actions.

---
Trong TypeScript, **`as`** là một từ khóa rất mạnh mẽ, và nó có một số cách sử dụng tùy vào ngữ cảnh. Trong trường hợp bạn đang dùng **`as`** trong **mapped types** (kiểu đối tượng mà bạn đang làm việc), nó được sử dụng để **đổi tên key** trong quá trình xây dựng một đối tượng mới.

### 1. **`as` trong Mapped Types**

Trong kiểu `Prefix` mà bạn cung cấp, **`as`** được sử dụng để thay đổi tên key của một đối tượng.

Dưới đây là cách **`as`** được sử dụng trong context của một mapped type:

```ts
type Prefix<T, P extends string> = {
  [K in keyof T as `${P}${Capitalize<string & K>}`]: T[K];
};
```

* **`[K in keyof T]`**: Đây là phần chỉ ra rằng chúng ta đang lặp qua tất cả các **keys** trong type `T`.
* **`as`**: Dùng để **đổi tên key** từ `K` thành một kiểu mới (ở đây là `\`\${P}\${Capitalize\<string & K>}\`\`).

**Giải thích cách sử dụng `as`:**

* **`keyof T`**: Trả về các **keys** của object `T`. Nếu `T` có các keys là `id`, `name`, thì `keyof T` sẽ là `"id" | "name"`.
* **`as `\${P}\${Capitalize\<string & K>}\`\`**: Chuyển đổi các keys này thành một chuỗi mới.

  * Chúng ta nối **prefix `P`** vào trước tên key.
  * Dùng `Capitalize<string & K>` để **chuyển chữ cái đầu tiên** của `K` thành chữ hoa.
  * Điều này tạo ra kiểu mới cho keys, ví dụ từ `"id"` thành `"MyId"` (với prefix `"my"`).

### 2. **Tại sao cần `as` trong mapped type?**

Nếu không có `as`, bạn sẽ không thể thay đổi key trong quá trình mapped types. **`as`** là một cú pháp để **áp dụng các transformation** lên tên key trong quá trình xây dựng object mới.

### 3. **Ví dụ cụ thể:**

Giả sử có type `Original`:

```ts
type Original = { id: number; name: string; };
```

Khi áp dụng `Prefix<Original, "my">` với template literal type:

```ts
type Prefixed = Prefix<Original, "my">;
```

Sẽ tạo ra kiểu mới:

```ts
type Prefixed = {
  myId: number;
  myName: string;
};
```

Trong trường hợp này:

* **`id`** trở thành **`myId`** vì prefix `"my"` được thêm vào và chữ cái đầu tiên được viết hoa.
* **`name`** trở thành **`myName`**.

### 4. **Một ví dụ khác với `as`**:

Giả sử bạn muốn tạo ra một type mới từ một object mà các keys của nó sẽ được chuyển thành các chữ hoa hoàn toàn. Bạn có thể sử dụng `as` để thực hiện điều này:

```ts
type UppercaseKeys<T> = {
  [K in keyof T as Uppercase<string & K>]: T[K];
};

type Original = { id: number; name: string; };
type Uppercased = UppercaseKeys<Original>;
// { ID: number; NAME: string; }
```

Ở đây:

* **`Uppercase<string & K>`** sẽ chuyển `"id"` thành `"ID"` và `"name"` thành `"NAME"`.
* Sử dụng **`as`** để áp dụng việc chuyển đổi tên key trong quá trình map các keys.

### Tóm tắt:

* **`as`** trong mapped types giúp bạn **đổi tên** hoặc **chỉnh sửa** các keys của một type trong quá trình lặp qua các keys của object.
* Đây là một cú pháp rất hữu ích để **biến đổi** các key, ví dụ như thêm prefix, chuyển thành chữ hoa, hoặc thay đổi theo những quy tắc khác.
---

## 3️⃣ Getter Pattern với Template Literal Types

```ts
type Getter<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type User = { id: number; name: string };
type UserGetters = Getter<User>;
// { getId: () => number; getName: () => string }
```

👉 Dùng trong **ORM, builder pattern, service layer** để tạo function signatures đồng bộ với model.

---

## 4️⃣ keyof với Generic Constraints

```ts
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Alice" };

const id = getValue(user, "id");   // number
const name = getValue(user, "name"); // string
```

📌 Đây là pattern **type-safe getter**, cực kỳ phổ biến trong code enterprise.

---

## 5️⃣ typeof với Function & Class

```ts
class Person {
  constructor(public name: string, public age: number) {}
}

type PersonClass = typeof Person;
// type là constructor của Person

const Another: PersonClass = Person;
const p = new Another("Bob", 30); // Person instance
```

👉 Dùng khi viết **factory function** hoặc test utilities.

---

## 6️⃣ Bài tập

### Level 1

Cho type:

```ts
type Car = {
  brand: string;
  year: number;
};
```

➡️ Tạo type:

* `CarKeys` → `"brand" | "year"`
* `CarValues` → `string | number`

---

### Level 2

Cho object:

```ts
const statusMap = {
  200: "success",
  400: "bad request",
  500: "server error"
} as const;
```

➡️ Sinh ra type:

* `StatusCode` = `200 | 400 | 500`
* `StatusMessage` = `"success" | "bad request" | "server error"`

---

### Level 3

Cho type:

```ts
type Product = {
  id: number;
  name: string;
  price: number;
};
```

➡️ Sinh ra type getter:

```ts
type ProductGetters = {
  getId: () => number;
  getName: () => string;
  getPrice: () => number;
};
```

⚡ Gợi ý: dùng **mapped type + key remapping**.

---
**Lời giải chi tiết cho bài tập Day 33 — Phần 3** 


# ✅ Day 33 — Bài tập + Giải chi tiết

---

## 🔹 Level 1

### Đề

Cho type:

```ts
type Car = {
  brand: string;
  year: number;
};
```

➡️ Tạo type:

* `CarKeys` → `"brand" | "year"`
* `CarValues` → `string | number`

### Giải

```ts
type CarKeys = keyof Car;
// "brand" | "year"

type CarValues = Car[keyof Car];
// string | number
```

👉 Ở đây:

* `keyof Car` lấy ra tên property dưới dạng union.
* `Car[keyof Car]` lấy ra type value tương ứng → `string | number`.

---

## 🔹 Level 2

### Đề

Cho object:

```ts
const statusMap = {
  200: "success",
  400: "bad request",
  500: "server error"
} as const;
```

➡️ Sinh ra type:

* `StatusCode` = `200 | 400 | 500`
* `StatusMessage` = `"success" | "bad request" | "server error"`

### Giải

```ts
type StatusCode = keyof typeof statusMap;
// 200 | 400 | 500

type StatusMessage = typeof statusMap[StatusCode];
// "success" | "bad request" | "server error"
```

👉 Ở đây:

* `typeof statusMap` → lấy type từ object value.
* `keyof typeof statusMap` → union các key (200 | 400 | 500).
* `typeof statusMap[StatusCode]` → union các value.

---

## 🔹 Level 3

### Đề

Cho type:

```ts
type Product = {
  id: number;
  name: string;
  price: number;
};
```

➡️ Sinh ra type getter:

```ts
type ProductGetters = {
  getId: () => number;
  getName: () => string;
  getPrice: () => number;
};
```

### Giải

```ts
type ProductGetters = {
  [K in keyof Product as `get${Capitalize<string & K>}`]: () => Product[K];
};
```

👉 Phân tích:

* `keyof Product` → `"id" | "name" | "price"`.
* `Capitalize<string & K>` → viết hoa chữ cái đầu của key.
* `as \`get\${...}\`\` → đổi tên key thành getter.
* `() => Product[K]` → return type đúng với value gốc.

---

## ✨ Tổng kết

* Level 1: Hiểu `keyof` + indexed access.
* Level 2: Kết hợp `typeof` + `keyof` + indexed access.
* Level 3: Thêm **key remapping + template literal types** để generate getter pattern.



## 7️⃣ Checklist trước khi sang Day 34

* [ ] Hiểu và dùng được **Indexed Access Types**.
* [ ] Biết **key remapping** trong mapped type.
* [ ] Sinh ra dynamic getter/setter bằng template literal types.
* [ ] Sử dụng `keyof` với generic constraints trong hàm.
* [ ] Áp dụng `typeof` với class và function.

---

📌 [<< Ngày 32](./Day32.md) | [Ngày 34 >>](./Day34.md)