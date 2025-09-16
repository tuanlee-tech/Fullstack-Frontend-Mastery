# 📘 Day 24 — TypeScript Config Deep Dive

## 1️⃣ Mục tiêu

* Hiểu toàn bộ các option trong **tsconfig.json**.
* Cấu hình **strict mode**, `noImplicitAny`, `strictNullChecks`, `forceConsistentCasingInFileNames`.
* Tối ưu compile-time, giảm lỗi runtime.
* Enterprise-ready: build project lớn an toàn, dễ maintain, performance tốt.

---

## 2️⃣ tsconfig.json cơ bản

```json
{
  "compilerOptions": {
    "target": "ES2020",         // JS version compile ra
    "module": "CommonJS",       // Module system (Node)
    "rootDir": "src",           // Thư mục source
    "outDir": "dist",           // Thư mục build
    "strict": true,             // Bật tất cả strict checks
    "noImplicitAny": true,      // Cấm biến không khai báo type
    "strictNullChecks": true,   // Cấm null/undefined trừ khi khai báo
    "forceConsistentCasingInFileNames": true, // Bảo vệ case-sensitive paths
    "esModuleInterop": true,    // Interop với module CommonJS
    "skipLibCheck": true        // Bỏ check type của thư viện bên ngoài
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

**Enterprise lessons:**

* `strict` → bảo vệ toàn bộ codebase tránh lỗi runtime.
* `noImplicitAny` → bắt buộc khai báo type, compile-time error nếu quên.
* `strictNullChecks` → tránh `Cannot read property of undefined`.
* `forceConsistentCasingInFileNames` → giúp CI/CD trên hệ case-sensitive như Linux.

---

## 3️⃣ Ví dụ minh họa `noImplicitAny`

```ts
// Không strict
function add(a, b) {
  return a + b;
}

// a, b là any → có thể runtime error nếu a/b không phải number
add("hello", 5); // runtime: hello5
```

```ts
// Bật strict + noImplicitAny
function addStrict(a: number, b: number): number {
  return a + b;
}

addStrict("hello", 5); // compile-time error
```

**Enterprise lessons:**

* Compile-time check → tránh bug runtime → rất quan trọng với codebase > 1000 file.

---

## 4️⃣ Ví dụ minh họa `strictNullChecks`

```ts
let name: string;
// name = null; // ❌ Error

let nullableName: string | null = null; // ✅ explicit
```

**Enterprise lessons:**

* Bắt buộc developer khai báo `null`/`undefined` → code predictability.
* Giảm crash production.

---

## 5️⃣ Performance flags

* `skipLibCheck: true` → bỏ check type thư viện bên ngoài → tăng tốc compile khi nhiều dependency.
* `incremental: true` → incremental compile → chỉ build file thay đổi → tiết kiệm thời gian.
* `tsBuildInfoFile: "./.tsbuildinfo"` → cache incremental build.

```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./.tsbuildinfo",
    "skipLibCheck": true
  }
}
```

**Enterprise lessons:**

* Project lớn → build > 1000 file → incremental + skipLibCheck giúp CI/CD nhanh, developer experience tốt.

---

## 6️⃣ Ví dụ enterprise: Type-safe Config

```ts
// src/config/index.ts
interface AppConfig {
  port: number;
  dbUrl: string;
  enableCache: boolean;
}

// Typed config object
export const config: AppConfig = {
  port: 3000,
  dbUrl: process.env.DB_URL || "", // ❌ compile-time error nếu thiếu property
  enableCache: true
};
```

* Bất kỳ property thiếu → compile-time error.
* Enterprise pattern → tránh lỗi config production.

---

## 7️⃣ Bài tập luyện tập

### Level 1

* Bật strict mode, noImplicitAny, strictNullChecks trong project TS mới.
* Viết function `sum(a: number, b: number): number`.

### Level 2

* Viết config type-safe cho project Express: `{ port: number; env: "dev"|"prod"; dbUrl: string; }`.
* Thử build với `tsc` → TS báo lỗi nếu thiếu property.

### Level 3

* Project > 100 file: bật incremental + skipLibCheck.
* Thêm env validation function: nhận `process.env`, trả compile-time error nếu thiếu biến bắt buộc.


---


### 🔹 Level 1 — Bật strict mode + noImplicitAny + strictNullChecks

```bash
# Tạo project mới
mkdir ts-config-demo && cd ts-config-demo
npm init -y
npm install typescript ts-node-dev
npx tsc --init
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,             // Bật tất cả strict checks
    "noImplicitAny": true,      // Bắt buộc khai báo type
    "strictNullChecks": true,   // Kiểm tra null/undefined
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### Ví dụ code

```ts
// src/index.ts
function sum(a: number, b: number): number {
  return a + b;
}

const result = sum(5, 10); // ✅ OK
// const wrong = sum("5", 10); // ❌ Compile-time error
```

**Enterprise lessons:**

* `strict` + `noImplicitAny` → tránh lỗi runtime với input không type-safe.
* `strictNullChecks` → loại trừ crash do null/undefined.

---

### 🔹 Level 2 — Type-safe Config Object

```ts
// src/config/index.ts

// Interface cho config
interface AppConfig {
  port: number;
  env: "development" | "production";
  dbUrl: string;
  enableCache: boolean;
}

// Config type-safe
export const config: AppConfig = {
  port: 3000,
  env: process.env.NODE_ENV === "production" ? "production" : "development",
  dbUrl: process.env.DB_URL || "", // ❌ nếu thiếu dbUrl → compile-time error
  enableCache: true
};
```

```ts
// src/app.ts
import { config } from "./config";

console.log(`Server running on port ${config.port} in ${config.env} mode`);
```

**Enterprise lessons:**

* Compile-time check → tránh sai config production.
* Phù hợp cho team lớn: mọi developer đều phải khai báo đầy đủ.

---

### 🔹 Level 3 — Project lớn + Incremental + skipLibCheck

```json
// tsconfig.json (mở rộng)
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "skipLibCheck": true,         // Bỏ check type của thư viện ngoài
    "incremental": true,          // Incremental build
    "tsBuildInfoFile": "./.tsbuildinfo"
  }
}
```

### Enterprise pattern: validate env variables

```ts
// src/config/validateEnv.ts
interface Env {
  DB_URL: string;
  API_KEY: string;
}

export function validateEnv(env: Partial<Env>): Env {
  if (!env.DB_URL) throw new Error("DB_URL is required");
  if (!env.API_KEY) throw new Error("API_KEY is required");
  return env as Env; // type-safe cast
}

// src/config/index.ts
import { validateEnv } from "./validateEnv";

const env = validateEnv({
  DB_URL: process.env.DB_URL,
  API_KEY: process.env.API_KEY
});

export const config = {
  port: 3000,
  env: process.env.NODE_ENV || "development",
  ...env,
  enableCache: true
};
```

**Enterprise lessons:**

* Compile-time + runtime validation → tránh crash khi deploy.
* Incremental + skipLibCheck → compile nhanh cho project > 1000 file.
* Tách validate + config → maintainable & reusable.


---


[<< Ngày 23](./Day23.md) | [Ngày 25 >>](./Day25.md)