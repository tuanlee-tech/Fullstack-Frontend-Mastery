# 🟦 Day 31: Mapped Types — `Partial`, `Required`, `Readonly`, `Record`

## 1️⃣ Mục tiêu học

Sau ngày học này, bạn sẽ có khả năng:

1. Hiểu và phân biệt **Mapped Types** cơ bản trong TypeScript (`Partial`, `Required`, `Readonly`, `Record`).
2. Biết **khi nào** dùng `Partial` để update object mà không cần điền tất cả field.
3. Biết dùng `Required` để ép tất cả properties **bắt buộc**.
4. Dùng `Readonly` để **bảo vệ object khỏi mutate** (state immutability).
5. Dùng `Record` để tạo **typed key-value maps** (lookup table, enum mapping).
6. Áp dụng mapped types trong các project **enterprise-ready**, Redux state, config objects, form state.

---

## 2️⃣ TL;DR

Mapped Types cho phép **tạo type mới dựa trên type cũ**, có thể:

* Biến tất cả field thành optional (`Partial<T>`).
* Biến tất cả field thành bắt buộc (`Required<T>`).
* Bảo vệ object khỏi bị mutate (`Readonly<T>`).
* Tạo map kiểu chính xác (`Record<K, T>`).

✅ Ứng dụng: **update state, config objects, API client typing, Redux, form management**.

---

## 3️⃣ Lý thuyết chi tiết

### a. `Partial<T>`

* Biến tất cả thuộc tính của `T` thành **optional** (`?`).
* Dùng khi bạn update object **không cần truyền hết field**.

```ts
interface User {
  id: string;
  name: string;
  email: string;
}

// Partial<User> → { id?: string; name?: string; email?: string }
function updateUser(user: User, updates: Partial<User>): User {
  return { ...user, ...updates };
}
```

**Enterprise note:**

* Dùng khi update object trong **database**, hoặc **Redux reducer**.
* Giúp type-safe, tránh phải truyền tất cả field, IDE autocomplete vẫn đầy đủ.

---

### b. `Required<T>`

* Ngược lại với `Partial<T>`.
* Ép tất cả properties **bắt buộc**.

```ts
interface Config {
  host?: string;
  port?: number;
}

const fullConfig: Required<Config> = { host: 'localhost', port: 8080 }; // ✅ OK
```

**Pitfall:** Không áp dụng được nếu object đang optional từ **API external** → cần validate trước khi ép kiểu.

---

### c. `Readonly<T>`

* Bảo vệ object **không bị mutate**.

```ts
const user: Readonly<User> = { id: 'u1', name: 'Alice', email: 'a@b.com' };
// user.name = 'Bob'; // ❌ Error
```

**Enterprise:**

* Dùng trong **state management** (Redux/Context) để tránh side-effects.
* Lưu ý: `Readonly` chỉ **shallow**, cần recursion để deep freeze.

---

### d. `Record<K, T>`

* Tạo **typed map**: key `K` → value `T`.
* `K` thường là **enum** hoặc **union type**.

```ts
type Roles = 'admin' | 'editor' | 'guest';
const rolePermissions: Record<Roles, string[]> = {
  admin: ['create', 'read', 'update', 'delete'],
  editor: ['read', 'update'],
  guest: ['read'],
};
```

**Use case enterprise:**

* Typing config objects, lookup tables, enum mapping, Redux state maps.

---

## 4️⃣ Ví dụ thực tế / Production-ready

**Scenario:** Cập nhật user profile trong **Redux state**.

```ts
// ./examples/day-31/updateUser.ts
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
}

type UserUpdate = Partial<User>;

const initialUser: Readonly<User> = {
  id: 'u1',
  name: 'Alice',
  email: 'alice@example.com',
  role: 'user',
};

function applyUpdate(user: User, updates: UserUpdate): User {
  return { ...user, ...updates };
}

// Unit Test
const updated = applyUpdate(initialUser as User, { name: 'Bob' });
console.log(updated.name); // Bob
```

**Checklist enterprise:**

* ✅ Không mutate object gốc (`Readonly<User>`).
* ✅ Cập nhật chỉ properties có trong `Partial<User>`.
* ✅ Type-safe, IDE autocomplete đầy đủ.
* ✅ Có unit test cơ bản, dễ mở rộng.

---

## 5️⃣ Bài tập Level 1 → 3

### Level 1

**Đề:** Sử dụng `Partial` để viết hàm update object `Config`.

```ts
interface Config {
  host: string;
  port: number;
  useSSL: boolean;
}
```

* Viết hàm: `updateConfig(current: Config, changes: Partial<Config>): Config`.

**Solution:**

```ts
function updateConfig(current: Config, changes: Partial<Config>): Config {
  return { ...current, ...changes };
}
```

**Giải thích:** Partial giúp bạn chỉ truyền các field cần update.

---

### Level 2

**Đề:** Sử dụng `Record` để tạo map từ enum `Status` → message.

```ts
enum Status {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  PENDING = 'PENDING',
}
```

* Tạo `statusMessages: Record<Status, string>`.

**Solution:**

```ts
const statusMessages: Record<Status, string> = {
  [Status.SUCCESS]: 'Operation succeeded',
  [Status.ERROR]: 'Operation failed',
  [Status.PENDING]: 'Operation is pending',
};
```

**Giải thích:** Record ép kiểu chính xác → tránh typo, IDE autocomplete.

---

### Level 3

**Đề:** Viết `deepFreeze<T>(obj: T): Readonly<T>` để bảo vệ object khỏi mutate (immutable deep).

**Solution:**

```ts
function deepFreeze<T>(obj: T): Readonly<T> {
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as any)[prop];
    if (value && typeof value === 'object') deepFreeze(value);
  });
  return Object.freeze(obj);
}
```

**Enterprise note:**

* Dùng khi muốn **state immutable** hoặc **config object** an toàn.
* Kết hợp với Redux/Context state để tránh side-effects.

---


# 🟦 Day 31 – Mapped Types (Mở rộng)

## 10️⃣ Mở rộng & nâng cao

### a. Kết hợp `Partial` + `Record` + `union types`

Giả sử bạn có các trạng thái form field:

```ts
type Field = 'username' | 'email' | 'password';
interface FormValues {
  username: string;
  email: string;
  password: string;
}

// Mỗi field có thể optional khi validate partial form
type PartialForm = Partial<Record<Field, string>>;

const partialUpdate: PartialForm = {
  username: 'Alice', // chỉ update field username
};
```

**Lợi ích enterprise:**

* Typing chính xác từng field.
* Hỗ trợ incremental updates trong **forms** hoặc **API patch requests**.

---

### b. Deep `Readonly` với mapped types

TypeScript không có sẵn `DeepReadonly`, nhưng bạn có thể custom:

```ts
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

interface Config {
  server: { host: string; port: number };
  db: { user: string; password: string };
}

const frozenConfig: DeepReadonly<Config> = {
  server: { host: 'localhost', port: 8080 },
  db: { user: 'root', password: '123' },
};

// frozenConfig.server.host = '127.0.0.1'; // ❌ Error
```

**Enterprise:**

* Bảo vệ toàn bộ config/state object lồng nhau.
* Ngăn mutate vô tình, rất hữu ích cho **Redux state**.

---

### c. Conditional Mapped Types (tiền đề Day 34)

Bạn có thể **kết hợp mapped types + conditional types**:

```ts
type OnlyStrings<T> = {
  [K in keyof T]: T[K] extends string ? T[K] : never;
};

interface User {
  id: number;
  name: string;
  email: string;
}

type StringPropsOfUser = OnlyStrings<User>; 
// { id: never; name: string; email: string }
```

**Lợi ích enterprise:**

* Dùng để filter type trước khi tạo **API response types**, **form fields**, hoặc **logging typed**.

---

### d. Factory + Mapped Types

Trong enterprise apps, bạn có thể tạo **typed factories**:

```ts
type UserProps = 'id' | 'name' | 'email';
type UserFactory = { [K in UserProps]: () => string };

const createUserFactory: UserFactory = {
  id: () => 'u1',
  name: () => 'Alice',
  email: () => 'alice@example.com',
};

const user = {
  id: createUserFactory.id(),
  name: createUserFactory.name(),
  email: createUserFactory.email(),
};
```

* ✅ Bảo đảm **all fields typed**, IDE autocomplete đầy đủ.
* ✅ Kiểm soát cách object được tạo trong enterprise system.

---

### e. Scenario enterprise – incremental update + immutability

```ts
interface AppState {
  user: { id: string; name: string; role: string };
  settings: { theme: string; language: string };
}

// Partial + DeepReadonly
type PartialState = {
  [K in keyof AppState]?: DeepReadonly<AppState[K]>;
};

function updateState(state: AppState, patch: PartialState): AppState {
  return { ...state, ...patch };
}

// Ví dụ
const newState = updateState(
  { user: { id: '1', name: 'Alice', role: 'admin' }, settings: { theme: 'dark', language: 'en' } },
  { settings: { theme: 'light', language: 'fr' } }
);
```

* ✅ Cho phép **incremental updates** mà vẫn type-safe.
* ✅ Bảo vệ state từ mutation (DeepReadonly).
* ✅ Tiền đề cho Redux / Zustand / React Context.

---

### f. Gợi ý mở rộng trước khi qua Day 32

1. Thực hành **combining mapped types + union types + Partial** trong form validation.
2. Viết **DeepReadonly generic** cho nested object lớn (state/redux).
3. Thử **conditional mapped types**: lọc các property theo type (string, number, boolean).
4. Thử **factory pattern + mapped types** cho tạo config object type-safe.
5. Nếu muốn, có thể **tạo helper type `DeepPartial<T>`** để update deeply nested objects:

```ts
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
```

* Dùng để update deeply nested API response / state object mà không mất type safety.

---

Tuyệt vời! Chúng ta sẽ làm **Day 31 – Mapped Types (Extended Exercises & Solutions)** với các ví dụ **production-ready, enterprise-focused**, kèm **bài tập Level 1 → 3 mở rộng**, liên quan đến:

* `Partial + Record + union types`
* `DeepReadonly` / `DeepPartial`
* Conditional mapped types
* Factory pattern + mapped types
* Incremental updates + immutability

---

# Extended — Exercises & Solutions

## 🔹 Level 1 — Partial + Record

**Đề bài:**
Bạn có enum `Field = 'username' | 'email' | 'password'` và interface `FormValues`.
Viết function `updateForm` nhận **partial form update** và trả về **form mới**, type-safe.

```ts
type Field = 'username' | 'email' | 'password';
interface FormValues {
  username: string;
  email: string;
  password: string;
}
```

**Solution:**

```ts
type PartialForm = Partial<Record<Field, string>>;

function updateForm(current: FormValues, updates: PartialForm): FormValues {
  return { ...current, ...updates };
}

// Example
const form: FormValues = { username: '', email: '', password: '' };
const updatedForm = updateForm(form, { email: 'alice@example.com' });
console.log(updatedForm);
// Output: { username: '', email: 'alice@example.com', password: '' }
```

**Giải thích:**

* `Partial<Record<Field, string>>` cho phép truyền **chỉ field cần update**.
* IDE autocomplete vẫn nhận đủ keys, type-safe.

---

## 🔹 Level 2 — DeepReadonly

**Đề bài:**
Viết `deepFreeze<T>(obj: T): DeepReadonly<T>` cho object nested.
Áp dụng cho state app:

```ts
interface AppState {
  user: { id: string; name: string; role: string };
  settings: { theme: string; language: string };
}
```

**Solution:**

```ts
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

function deepFreeze<T>(obj: T): DeepReadonly<T> {
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as any)[prop];
    if (value && typeof value === 'object') deepFreeze(value);
  });
  return Object.freeze(obj) as DeepReadonly<T>;
}

// Example
const state: AppState = {
  user: { id: '1', name: 'Alice', role: 'admin' },
  settings: { theme: 'dark', language: 'en' },
};

const frozenState = deepFreeze(state);
// frozenState.user.name = 'Bob'; // ❌ Error
```

**Giải thích:**

* `DeepReadonly` recursive → mọi nested property đều immutable.
* Bảo vệ state khỏi mutation → quan trọng trong **Redux / React Context**.

---

## 🔹 Level 3 — Conditional Mapped Types + Factory

**Đề bài:**

1. Lọc các field type `string` từ interface `User`.
2. Tạo `factory` typed cho các field đó, trả về giá trị mặc định.

```ts
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}
```

**Solution:**

```ts
// Conditional Mapped Type
type StringProps<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T]; // union of keys with string type

type UserStringKeys = StringProps<User>; // "name" | "email"

// Factory
type Factory<T extends object, K extends keyof T> = {
  [P in K]: () => T[P];
};

const userFactory: Factory<User, UserStringKeys> = {
  name: () => 'Alice',
  email: () => 'alice@example.com',
};

const user: User = {
  id: 1,
  name: userFactory.name(),
  email: userFactory.email(),
  age: 30,
};

console.log(user);
```

**Giải thích:**

* Conditional mapped type lọc ra **keys có type string**.
* Factory pattern tạo object type-safe → **IDE autocomplete + enterprise-safe**.

---

## 🔹 Bonus: DeepPartial cho incremental update

```ts
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

interface Config {
  server: { host: string; port: number };
  db: { user: string; password: string };
}

function updateConfig<T>(current: T, patch: DeepPartial<T>): T {
  return { ...current, ...patch }; // shallow merge, deep merge cần custom function
}

// Example
const cfg: Config = {
  server: { host: 'localhost', port: 8080 },
  db: { user: 'root', password: '123' },
};

const updatedCfg = updateConfig(cfg, { server: { port: 9090 } });
console.log(updatedCfg.server.port); // 9090
```

**Enterprise note:**

* DeepPartial hữu ích cho **patch API requests** hoặc **nested state updates**.
* Trong thực tế, cần **deep merge** để giữ type safety cho toàn bộ nested object.

---

📌 [<< Ngày 30](./Day30.md) | [Ngày 32 >>](./Day32.md)