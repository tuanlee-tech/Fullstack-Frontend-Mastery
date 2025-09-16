# 📘 Day 19 — Third-Party Libraries & Type Declarations

## 1️⃣ Khái niệm

* Nhiều thư viện JS không có TypeScript type.
* Cần:

  1. Dùng **DefinitelyTyped** (`@types/...`) nếu có.
  2. Tự khai báo **custom `.d.ts`** nếu library không có type.

**Enterprise use:**

* Dự án lớn phải đảm bảo **mọi import đều type-safe**, tránh runtime error.

---

## 2️⃣ Sử dụng thư viện với TypeScript

### Ví dụ: Lodash

```ts
import _ from "lodash";

// TypeScript biết types của _.shuffle vì đã cài @types/lodash
const arr = [1, 2, 3, 4];
const shuffled = _.shuffle(arr);
console.log(shuffled); // random order
```

```bash
npm install lodash
npm install --save-dev @types/lodash
```

* Nếu không có `@types/lodash` → TS không biết type → dùng `any`.

---

## 3️⃣ Tự khai báo type cho thư viện chưa có

Giả sử thư viện `myLib.js`:

```js
// myLib.js
function greet(name) {
  return `Hello ${name}`;
}
module.exports = { greet };
```

Tạo `myLib.d.ts`:

```ts
declare module "myLib" {
  export function greet(name: string): string;
}
```

* Sau đó import như bình thường:

```ts
import { greet } from "myLib";
console.log(greet("Alice")); // Hello Alice
```

**Enterprise:**

* Dự án lớn luôn **maintain `.d.ts`** cho các library JS không type.

---

## 4️⃣ Custom module types

* Khi dùng **JSON**, **image**, hoặc **CSS imports**, TS mặc định không hiểu.

```ts
// custom.d.ts
declare module "*.json" {
  const value: any;
  export default value;
}

declare module "*.png" {
  const value: string;
  export default value;
}
```

* Giúp import trực tiếp `import data from './data.json'`.

---

## 5️⃣ Using TypeScript with NPM packages

```ts
import axios, { AxiosResponse } from "axios";

interface User {
  id: number;
  name: string;
}

async function fetchUsers(): Promise<User[]> {
  const res: AxiosResponse<User[]> = await axios.get("https://api.example.com/users");
  return res.data;
}

fetchUsers().then(users => console.log(users));
```

* TS sẽ check type trả về từ API (nếu bạn khai báo interface).
* **Enterprise benefit:** loại lỗi mismatch data ngay tại compile-time.

---

## 6️⃣ Enterprise mini project

* **Mục tiêu:** dùng **axios** + **custom `.d.ts`** + **Result Pattern** để fetch API an toàn.

```ts
// types/api.d.ts
export interface ApiUser {
  id: number;
  name: string;
}

// services/apiService.ts
import axios from "axios";
import { ApiUser } from "../types/api";

type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export async function getUsers(): Promise<Result<ApiUser[], string>> {
  try {
    const res = await axios.get<ApiUser[]>("https://api.example.com/users");
    return { ok: true, value: res.data };
  } catch (err) {
    return { ok: false, error: "NETWORK_ERROR" };
  }
}

// app.ts
import { getUsers } from "./services/apiService";

async function main() {
  const users = await getUsers();
  if (users.ok) {
    console.log("Fetched users:", users.value);
  } else {
    console.error("Fetch failed:", users.error);
  }
}

main();
```

**Enterprise Lessons:**

* Type-safe external API call.
* Result pattern tránh throw.
* Custom types `.d.ts` giúp tích hợp JS library vào TS dự án lớn.

---

## 7️⃣ Bài tập luyện tập

### Level 1

1. Cài một library JS (ví dụ `uuid`) và import với TS, thử tạo UUID.

### Level 2

2. Tự khai báo `.d.ts` cho một JS file (ví dụ `mathLib.js` có `add(a,b)`).

### Level 3

3. Mở rộng project mini fetch API:

   * Thêm endpoint fetch products.
   * Dùng Result Pattern + custom types.
   * Log thành công hoặc lỗi.


---


# 🔹 Level 1 — Sử dụng thư viện `uuid`

```ts
// Bước 1: cài thư viện
// npm install uuid
// npm install --save-dev @types/uuid

import { v4 as uuidv4 } from "uuid";

// Tạo UUID
const id = uuidv4();
console.log("Generated UUID:", id);
```

**Giải thích / Enterprise use:**

* `uuid` dùng trong project lớn để tạo ID duy nhất cho user, session, order...
* TypeScript type-safe nhờ `@types/uuid` → IDE biết `v4` trả về `string`, tránh bug runtime.

---

# 🔹 Level 2 — Tự khai báo `.d.ts` cho JS library

Giả sử bạn có JS file `mathLib.js`:

```js
// mathLib.js
function add(a, b) {
  return a + b;
}
module.exports = { add };
```

Tạo file `mathLib.d.ts`:

```ts
declare module "mathLib" {
  export function add(a: number, b: number): number;
}
```

Sử dụng trong TS:

```ts
import { add } from "mathLib";

const result = add(5, 7); // 12
console.log(result);
```

**Enterprise use:**

* Khi tích hợp thư viện JS cũ hoặc bên thứ 3, tạo `.d.ts` giúp toàn dự án type-safe.
* Tránh lỗi kiểu dữ liệu và IDE hỗ trợ autocomplete.

---

# 🔹 Level 3 — Mini project: Fetch API với Result Pattern + Custom Types

### 1️⃣ Type định nghĩa

```ts
// types/api.d.ts
export interface ApiUser {
  id: number;
  name: string;
}

export interface ApiProduct {
  id: number;
  name: string;
  price: number;
}

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
```

### 2️⃣ Service: fetch users & products

```ts
import axios, { AxiosResponse } from "axios";
import { ApiUser, ApiProduct, Result } from "../types/api";

// Fetch users
export async function fetchUsers(): Promise<Result<ApiUser[], string>> {
  try {
    const res: AxiosResponse<ApiUser[]> = await axios.get("https://api.example.com/users");
    return { ok: true, value: res.data };
  } catch (err) {
    return { ok: false, error: "NETWORK_ERROR" };
  }
}

// Fetch products
export async function fetchProducts(): Promise<Result<ApiProduct[], string>> {
  try {
    const res: AxiosResponse<ApiProduct[]> = await axios.get("https://api.example.com/products");
    return { ok: true, value: res.data };
  } catch (err) {
    return { ok: false, error: "NETWORK_ERROR" };
  }
}
```

### 3️⃣ Controller / App

```ts
import { fetchUsers, fetchProducts } from "./services/apiService";

async function main() {
  // Users
  const users = await fetchUsers();
  if (users.ok) {
    console.log("✅ Users fetched:", users.value);
  } else {
    console.error("❌ Fetch users failed:", users.error);
  }

  // Products
  const products = await fetchProducts();
  if (products.ok) {
    console.log("✅ Products fetched:", products.value);
  } else {
    console.error("❌ Fetch products failed:", products.error);
  }
}

main();
```

**Enterprise use:**

* Type-safe external API calls, Result Pattern tránh throw.
* Nếu API thay đổi → TS báo type mismatch ngay khi compile.
* Dễ mở rộng: thêm middleware, caching, logging, retry.

---


[<< Ngày 18](./Day18.md) | [Ngày 20 >>](./Day20.md)