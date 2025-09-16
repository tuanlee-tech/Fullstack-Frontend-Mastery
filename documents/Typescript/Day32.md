# 🟦 Day 32: Advanced Utility Types — `Pick`, `Omit`, `Extract`, `Exclude`

## 1️⃣ Mục tiêu học

Sau ngày học này, bạn sẽ:

1. Hiểu rõ **Pick** & **Omit**: chọn hoặc loại bỏ properties từ type.
2. Hiểu rõ **Extract** & **Exclude**: lọc union types.
3. Áp dụng các utility types trong **API response typing**, **Redux state**, **form handling**.
4. Biết **tạo type-safe partials hoặc subsets** cho enterprise apps.
5. Thực hành **combining utility types + mapped types** để tạo các loại type nâng cao.

---

## 2️⃣ TL;DR

| Utility Type    | Chức năng                                | Ví dụ nhanh              |           |         |              |       |
| --------------- | ---------------------------------------- | ------------------------ | --------- | ------- | ------------ | ----- |
| `Pick<T, K>`    | Chọn một tập con keys từ T               | \`Pick\<User, 'id'       | 'name'>\` |         |              |       |
| `Omit<T, K>`    | Loại bỏ một tập keys khỏi T              | `Omit<User, 'password'>` |           |         |              |       |
| `Extract<T, U>` | Lấy union type có thể assign được sang U | \`Extract<'a'            | 'b'       | 'c','a' | 'c'> → 'a'   | 'c'\` |
| `Exclude<T, U>` | Loại bỏ union type có thể assign sang U  | \`Exclude<'a'            | 'b'       | 'c','a' | 'c'> → 'b'\` |       |

✅ Ứng dụng enterprise: subset data, remove sensitive fields, API response shaping, form validation.

---

## 3️⃣ Lý thuyết chi tiết

### a. `Pick<T, K>`

* Lấy một tập keys K từ type T, tạo type mới chỉ chứa các keys đó.

```ts
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// Lấy id + name
type UserSummary = Pick<User, 'id' | 'name'>;

const summary: UserSummary = { id: 'u1', name: 'Alice' };
// summary.email = 'a@b.com'; // ❌ Error
```

**Enterprise use case:**

* Trả về **public API response**, hide sensitive fields (`password`).
* Tạo **form initial values** chỉ với subset properties.

---

### b. `Omit<T, K>`

* Ngược lại với Pick: loại bỏ keys K khỏi T.

```ts
type UserWithoutPassword = Omit<User, 'password'>;
const user: UserWithoutPassword = { id: 'u1', name: 'Alice', email: 'a@b.com' };
// user.password = '123'; // ❌ Error
```

* ✅ Dùng để **sanitize API responses**, **remove confidential info**.

---

### c. `Extract<T, U>`

* Lấy union type từ T có thể assign sang U.

```ts
type Letters = 'a' | 'b' | 'c';
type Allowed = 'a' | 'c';

type Result = Extract<Letters, Allowed>; // 'a' | 'c'
```

* ✅ Dùng để filter union type, ví dụ **event types** được subscribe.

---

### d. `Exclude<T, U>`

* Ngược lại với Extract: loại bỏ union type assignable sang U.

```ts
type Result2 = Exclude<Letters, Allowed>; // 'b'
```

* ✅ Dùng để loại bỏ **deprecated statuses**, **restricted values**.

---

### e. Kết hợp với mapped types

```ts
type UserKeys = keyof User; // 'id' | 'name' | 'email' | 'password'
type StringKeys = Extract<UserKeys, 'id' | 'name' | 'email'>;

type StringUserProps = Pick<User, StringKeys>;
```

* Kết hợp **Pick + Extract** → subset type chuẩn enterprise.

---

## 4️⃣ Ví dụ thực tế / Production-ready

**Scenario:** API response, hide sensitive info.

```ts
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

function sanitizeUser(user: User): Omit<User, 'password'> {
  const { password, ...rest } = user;
  return rest;
}

const user: User = { id: 'u1', name: 'Alice', email: 'alice@x.com', password: '123' };
const safeUser = sanitizeUser(user);
console.log(safeUser);
// Output: { id: 'u1', name: 'Alice', email: 'alice@x.com' }
```

**Enterprise tip:**

* Type-safe, IDE autocomplete vẫn nhận đủ fields.
* Hạn chế leak sensitive data, chuẩn cho REST/GraphQL API.

---

## 5️⃣ Bài tập Level 1 → 3

### Level 1 — Pick & Omit

**Đề bài:**

* Dùng `Pick` lấy `{id, name}` từ User.
* Dùng `Omit` loại bỏ `password`.

**Solution:**

```ts
type UserSummary = Pick<User, 'id' | 'name'>;
type UserSafe = Omit<User, 'password'>;
```

**Giải thích:** Pick để chọn subset, Omit để loại bỏ sensitive field.

---

### Level 2 — Extract & Exclude

**Đề bài:**

* `type Roles = 'admin' | 'editor' | 'guest' | 'banned'`
* Lấy `AllowedRoles` chỉ là `'admin' | 'editor' | 'guest'`
* Lấy `DisallowedRoles` = `'banned'`

**Solution:**

```ts
type Roles = 'admin' | 'editor' | 'guest' | 'banned';
type AllowedRoles = Extract<Roles, 'admin' | 'editor' | 'guest'>;
type DisallowedRoles = Exclude<Roles, AllowedRoles>;
```

**Giải thích:**

* Extract lấy những union hợp lệ.
* Exclude loại bỏ những giá trị không cho phép.

---

### Level 3 — Combined Utility + Mapped Types

**Đề bài:**

* Lấy các field string từ User (`Pick + Extract`) để tạo **form initial values**.

```ts
type StringKeys<T> = Extract<{
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T], string>;

type UserFormFields = Pick<User, StringKeys<User>>;

const formValues: UserFormFields = {
  id: 'u1',
  name: 'Alice',
  email: 'alice@x.com',
};
```

**Giải thích:**

* Mapped type + conditional type lọc string fields.
* Pick subset type → tạo **form hoặc API subset**, type-safe.

---

## 6️⃣ Common pitfalls & enterprise notes

* Pick & Omit **chỉ shallow**, nested object cần dùng **DeepPick / DeepOmit custom**.
* Extract & Exclude **union types** → tránh typo, IDE autocomplete giúp.
* Dùng trong **API response shaping**, **Redux state typing**, **form initial values**.
* Kết hợp mapped types + utility types → **subset / filtered types** mạnh mẽ.

---

## 7️⃣ Gợi ý mở rộng trước khi sang Day 33

1. Tạo **DeepOmit / DeepPick** cho nested objects (API response hoặc state).
2. Kết hợp `Pick + Partial + Record` cho **form updates incremental**.
3. Thử **Exclude deprecated statuses / Extract allowed values** trong Redux action types.
4. Thực hành **type-safe API layer**: server trả subset data → client dùng Pick/Omit để type-safe.

---
Hoàn toàn hiểu! Từ giờ trở đi, trước khi chuyển sang ngày mới, mình sẽ **mở rộng tối đa chủ đề của ngày hiện tại**, bao gồm:

* **Các ứng dụng nâng cao trong enterprise**
* **Các pattern production-ready**
* **Bài tập Level 1 → 3 mở rộng + giải chi tiết**
* **Kết hợp nhiều utility/mapped/conditional types**
* **Scenario thực tế: Redux, API, forms, config, state management**
* **Checklist type-safety, immutability, IDE autocomplete**

Sau khi tất cả các mở rộng có thể, mới chuyển sang ngày tiếp theo.


---

### 🔹 Day 32 Extended — Mở rộng

### a. DeepPick & DeepOmit cho nested objects

```ts
type DeepOmit<T, K extends PropertyKey> = {
  [P in keyof T as P extends K ? never : P]: T[P] extends object ? DeepOmit<T[P], K> : T[P];
};

interface ApiResponse {
  user: { id: string; name: string; password: string };
  settings: { theme: string; language: string };
}

// Omit password deeply
type SanitizedResponse = DeepOmit<ApiResponse, 'password'>;
// Result: { user: { id: string; name: string }; settings: { theme: string; language: string } }
```

**Enterprise use case:**

* Xử lý **API response**, loại bỏ sensitive field nested mà vẫn type-safe.

---

### b. Kết hợp Pick + Partial + Record cho incremental form update

```ts
interface FormValues {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'guest';
}

type FormUpdate = Partial<Pick<FormValues, 'username' | 'email'>>;

function updateFormValues(current: FormValues, changes: FormUpdate): FormValues {
  return { ...current, ...changes };
}
```

* ✅ Chỉ update subset fields, type-safe.
* ✅ Sẵn sàng áp dụng trong **React forms / Redux reducers**.

---

### c. Exclude deprecated / Extract allowed values trong Redux actions

```ts
type ActionTypes = 'CREATE' | 'UPDATE' | 'DELETE' | 'ARCHIVE' | 'DEPRECATED';

// Lấy chỉ các action active
type ActiveActions = Exclude<ActionTypes, 'DEPRECATED' | 'ARCHIVE'>; 
```

* ✅ Giúp **type-safe dispatch**, tránh dùng action bị deprecate.

---

### d. Scenario thực tế — API Layer Type-safe

```ts
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'guest';
}

type PublicUser = Omit<User, 'password'>;

function fetchUser(): Promise<PublicUser> {
  // giả lập call API
  return Promise.resolve({ id: 'u1', name: 'Alice', email: 'a@b.com', role: 'admin' });
}
```

* ✅ Server trả object full, client chỉ nhận **subset safe type**.
* ✅ Dễ maintain, IDE autocomplete đầy đủ.

---

### e. Bonus Exercise — Combined Advanced Types

**Đề bài:**

* Từ nested config object, loại bỏ sensitive field, chỉ lấy string keys, tạo incremental patch type-safe.

```ts
interface AppConfig {
  server: { host: string; port: number; token: string };
  db: { user: string; password: string; port: number };
}

// 1. DeepOmit sensitive fields
type SafeConfig = DeepOmit<AppConfig, 'password' | 'token'>;

// 2. Chỉ lấy string fields
type StringKeys<T> = Extract<{
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T], string>;

// 3. Tạo patch type-safe
type ConfigPatch = Partial<Pick<SafeConfig['server'], StringKeys<SafeConfig['server']>>>;
```

* ✅ Cho phép **update incremental**, **type-safe**, **production-ready**.

---


### 🟦 Day 32 Extended Exercises — Level 1 → 3

## 🔹 Level 1 — Pick & Omit (nested shallow)

**Đề bài:**

* Dùng `Pick` để tạo type `UserSummary` chỉ gồm `{id, name}` từ interface `User`.
* Dùng `Omit` để tạo type `UserSafe` loại bỏ field `password`.
* Viết function `sanitizeUser(user: User): UserSafe`.

```ts
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}
```

**Solution:**

```ts
type UserSummary = Pick<User, 'id' | 'name'>;
type UserSafe = Omit<User, 'password'>;

function sanitizeUser(user: User): UserSafe {
  const { password, ...rest } = user;
  return rest;
}

// Example
const user: User = { id: 'u1', name: 'Alice', email: 'a@b.com', password: '123' };
const safeUser = sanitizeUser(user);
console.log(safeUser); 
// Output: { id: 'u1', name: 'Alice', email: 'a@b.com' }
```

**Giải thích:**

* Pick để lấy subset field, Omit để loại bỏ sensitive field.
* ✅ Shallow type-safe, IDE autocomplete đầy đủ.

---

## 🔹 Level 2 — Extract & Exclude (union types)

**Đề bài:**

* `type Roles = 'admin' | 'editor' | 'guest' | 'banned'`
* Lấy `AllowedRoles` chỉ gồm `'admin' | 'editor' | 'guest'`
* Lấy `DisallowedRoles` = `'banned'`
* Viết function `isAllowed(role: Roles): role is AllowedRoles`

**Solution:**

```ts
type Roles = 'admin' | 'editor' | 'guest' | 'banned';
type AllowedRoles = Extract<Roles, 'admin' | 'editor' | 'guest'>;
type DisallowedRoles = Exclude<Roles, AllowedRoles>;

function isAllowed(role: Roles): role is AllowedRoles {
  return ['admin', 'editor', 'guest'].includes(role);
}

// Example
const role: Roles = 'banned';
console.log(isAllowed(role)); // false
```

**Giải thích:**

* Extract lọc những union hợp lệ.
* Exclude loại bỏ deprecated/unallowed values.
* `role is AllowedRoles` → **type guard**, hữu ích trong enterprise.

---

## 🔹 Level 3 — Combined Utility + Mapped Types + DeepOmit

**Đề bài:**

1. Dùng `DeepOmit` loại bỏ `password` và `token` từ nested object `AppConfig`.
2. Lọc các field string trong `server` để tạo incremental patch type-safe.
3. Viết function `updateConfig(current: AppConfig, patch: ConfigPatch): AppConfig`.

```ts
interface AppConfig {
  server: { host: string; port: number; token: string };
  db: { user: string; password: string; port: number };
}

// Types
type DeepOmit<T, K extends PropertyKey> = {
  [P in keyof T as P extends K ? never : P]: T[P] extends object ? DeepOmit<T[P], K> : T[P];
};

type SafeConfig = DeepOmit<AppConfig, 'password' | 'token'>;
type StringKeys<T> = Extract<{
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T], string>;

type ConfigPatch = Partial<Pick<SafeConfig['server'], StringKeys<SafeConfig['server']>>>;

function updateConfig(current: AppConfig, patch: ConfigPatch): AppConfig {
  return {
    ...current,
    server: { ...current.server, ...patch },
  };
}

// Example
const config: AppConfig = {
  server: { host: 'localhost', port: 8080, token: 'abcd' },
  db: { user: 'root', password: '123', port: 3306 },
};

const newConfig = updateConfig(config, { host: '127.0.0.1' });
console.log(newConfig.server.host); // 127.0.0.1
```

**Giải thích:**

* `DeepOmit` loại bỏ sensitive fields nested.
* `StringKeys` + Pick + Partial → tạo **incremental patch type-safe**.
* `updateConfig` áp dụng patch mà vẫn type-safe, không mutate nested state.
* ✅ Pattern này dùng trong **enterprise configs**, **Redux reducers**, hoặc **form updates**.

---

## 🔹 Checklist mở rộng trước khi sang Day 33

* [x] Hiểu & thực hành `Pick`, `Omit` (shallow & nested).
* [x] Hiểu & thực hành `Extract`, `Exclude` + type guard.
* [x] Kết hợp **utility + mapped + conditional types** cho enterprise patterns.
* [x] Incremental update + immutability (DeepOmit, Partial, Pick).
* [x] IDE autocomplete, type-safe API responses, Redux state, forms.

---

✅ Với các bài tập và giải pháp mở rộng này, bạn đã **thực sự làm chủ Advanced Utility Types**, có thể áp dụng trực tiếp cho **production-grade code**, **API design**, **state management**, trước khi chuyển sang Day 33: **Advanced Functions — Higher-order, Currying, Callbacks**.

---

