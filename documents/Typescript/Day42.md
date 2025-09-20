# 📌 Ngày 42: Monorepo với TypeScript — Nx, Turborepo & Project References

Đây là bài học tập trung vào việc thiết lập và quản lý **monorepo** với TypeScript, sử dụng các công cụ như **Nx**, **Turborepo**, và **Project References** để đảm bảo **type-safety**, tối ưu hóa build, và hỗ trợ các dự án doanh nghiệp. Tài liệu được viết chi tiết, rõ ràng, với ví dụ thực tế và bài tập, phù hợp cho cả người mới bắt đầu và lập trình viên muốn áp dụng TypeScript ở cấp độ **enterprise**.

---

## 1. Mục tiêu học

Sau bài này, bạn sẽ:
1. Hiểu **monorepo** là gì và lợi ích trong các dự án doanh nghiệp.
2. Cài đặt và cấu hình monorepo với **Nx** hoặc **Turborepo** sử dụng TypeScript.
3. Sử dụng **Project References** để tăng tốc build và kiểm tra kiểu (type-check).
4. Quản lý nhiều **package/app** trong cùng một repo nhưng vẫn giữ **type-safe**.
5. Thiết kế **workflow developer** chuẩn với build, lint, test, và CI/CD.

---

## 2. Lý thuyết

### 2.1 Monorepo là gì?
**Monorepo** là một repository chứa nhiều **package** hoặc **ứng dụng** (apps) trong cùng một codebase. Thay vì tách frontend, backend, và các thư viện (libs) thành các repo riêng, monorepo gom tất cả vào một nơi.

**Lợi ích**:
- **Code reuse**: Dễ dàng chia sẻ **types**, **utils**, và **API contracts** giữa các package.
- **Type safety**: Đảm bảo các package sử dụng chung types, tránh lỗi do không đồng bộ.
- **Unified CI/CD**: Một pipeline duy nhất để build, test, và deploy toàn bộ dự án.
- **Developer experience**: Quản lý dễ dàng hơn, IDE hỗ trợ autocomplete tốt hơn.

**Nhược điểm**:
- Có thể phức tạp nếu không cấu hình tốt.
- Build chậm nếu không sử dụng caching hoặc incremental build.

### 2.2 Nx vs Turborepo
Cả **Nx** và **Turborepo** đều là công cụ mạnh mẽ để quản lý monorepo, nhưng có những điểm khác biệt:

| **Feature**                | **Nx**                              | **Turborepo**                      |
|----------------------------|-------------------------------------|------------------------------------|
| **TypeScript support**     | ✅ Excellent (tích hợp sâu)         | ✅ Good (tập trung vào build)      |
| **Dependency graph**       | ✅ Yes (tự động quản lý)           | ✅ Yes (tối ưu cho pipeline)       |
| **Caching & incremental build** | ✅ Yes (rất mạnh)                | ✅ Yes (nhẹ và nhanh)             |
| **CLI & generators**       | ✅ Rich (nhiều lệnh, template)     | ✅ Basic (đơn giản, tập trung build) |
| **Monorepo focus**         | Apps + libs (full-stack)          | Build pipeline (nhẹ hơn)          |
| **Enterprise**             | ✅ Used by large companies         | ✅ Lightweight & fast              |

- **Nx**: Phù hợp cho dự án lớn, phức tạp, cần nhiều tính năng như generators, lint, test.
- **Turborepo**: Nhẹ, nhanh, tập trung vào build và caching, phù hợp cho dự án muốn tối ưu tốc độ.

### 2.3 Project References (TypeScript)
**Project References** là tính năng của TypeScript giúp tách biệt các **tsconfig.json** cho từng package/app trong monorepo, đồng thời xác định thứ tự build dựa trên dependency.

**Cách hoạt động**:
- Mỗi package/app có **tsconfig.json** riêng với `composite: true`.
- File `tsconfig.json` gốc ở root chỉ định **references** đến các package/app.
- TypeScript compiler sử dụng **dependency graph** để build theo thứ tự, chỉ rebuild những package bị thay đổi (**incremental build**).

**Ví dụ**:
```typescript
// packages/utils/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}

// packages/app/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "references": [{ "path": "../utils" }],
  "include": ["src"]
}
```

**Giải thích**:
- `composite: true` cho phép TypeScript lưu thông tin build để tăng tốc incremental build.
- `references` chỉ định package `app` phụ thuộc vào `utils`, đảm bảo `utils` được build trước.
- Lợi ích: TypeScript biết types từ `utils` khi build `app`, tránh lỗi và tăng tốc build.

---

## 3. Setup Monorepo (Ví dụ với Nx)

### 3.1 Cài đặt Nx
```bash
# Cài Nx CLI
npm install -g nx

# Tạo monorepo mới
npx create-nx-workspace@latest my-enterprise
cd my-enterprise

# Chọn template: empty
```

### 3.2 Tạo Apps và Libs
```bash
# Tạo library utils
nx generate @nrwl/node:lib utils

# Tạo ứng dụng backend
nx generate @nrwl/node:app backend

# Tạo ứng dụng frontend
nx generate @nrwl/react:app frontend
```

**Cấu trúc thư mục**:
```
my-enterprise/
├── apps/
│   ├── backend/
│   └── frontend/
├── libs/
│   └── utils/
├── tsconfig.base.json
└── package.json
```

### 3.3 Chia sẻ Types
Tạo type chung trong `libs/utils` để frontend và backend dùng chung:
```typescript
// libs/utils/src/types/user.ts
export type User = {
  id: string;
  username: string;
  email?: string;
};
```

Sử dụng trong frontend/backend:
```typescript
// apps/frontend/src/index.ts
import type { User } from '@my-enterprise/utils';

// apps/backend/src/index.ts
import type { User } from '@my-enterprise/utils';
```

**Giải thích**:
- `@my-enterprise/utils` là alias do Nx tự động cấu hình, giúp import dễ dàng.
- Types được chia sẻ đảm bảo frontend và backend đồng bộ kiểu.

### 3.4 Cấu hình Turborepo (Tương tự)
```bash
# Khởi tạo Turborepo
npm create turbo@latest

# Cấu hình pipeline trong turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "lint": {},
    "test": {}
  }
}
```

- Turborepo tập trung vào pipeline build, sử dụng **tsconfig.json** và **Project References** để quản lý type-safety.

---

## 4. Project References trong TypeScript

### 4.1 Cấu hình Project References
Tạo `tsconfig.json` gốc ở root:
```typescript
// tsconfig.json
{
  "files": [],
  "references": [
    { "path": "libs/utils" },
    { "path": "apps/backend" },
    { "path": "apps/frontend" }
  ]
}
```

**Giải thích**:
- `references` liệt kê các package/app theo thứ tự phụ thuộc.
- TypeScript sẽ build `libs/utils` trước, sau đó đến `apps/backend` và `apps/frontend`.

### 4.2 Build Incremental
```bash
# Build từng package
tsc -b libs/utils
tsc -b apps/backend
tsc -b apps/frontend

# Hoặc build toàn bộ
tsc -b
```

**Lợi ích**:
- Chỉ rebuild các package có thay đổi, tiết kiệm thời gian.
- TypeScript đảm bảo types từ `utils` được sử dụng đúng trong `backend` và `frontend`.

---

## 5. Best Practices

1. **Shared Types**: Tạo thư viện `@types` hoặc `@shared` để lưu trữ types và schemas dùng chung.
2. **Validation**: Đặt **Zod schemas** trong thư viện chung để cả frontend và backend validate dữ liệu.
3. **Consistent tsconfig**: Sử dụng `tsconfig.base.json` để thống nhất các quy tắc như `strict`, `noImplicitAny`.
4. **Testing & Linting**: Mỗi package có cấu hình test/lint riêng, nhưng chạy tổng thể qua Nx/Turbo pipelines.
5. **CI/CD**: Sử dụng caching và incremental build để tối ưu pipeline CI/CD.
6. **Versioning**: Hỗ trợ independent versioning (mỗi package có version riêng) hoặc unified versioning (toàn repo dùng chung version).

---

## 6. Mini Project: Monorepo Enterprise App

### Mô tả
Xây dựng một ứng dụng doanh nghiệp trong monorepo với:
- **apps/backend**: REST API với Express và TypeScript.
- **apps/frontend**: Ứng dụng React với TypeScript.
- **libs/utils**: Chứa shared types và validation schemas.
- **libs/ui**: Chứa reusable React components.

### Cấu trúc
```
my-enterprise/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   └── tsconfig.json
│   └── frontend/
│       ├── src/
│       └── tsconfig.json
├── libs/
│   ├── utils/
│   │   ├── src/types/
│   │   └── tsconfig.json
│   └── ui/
│       ├── src/components/
│       └── tsconfig.json
├── tsconfig.base.json
└── package.json
```

### Ví dụ Code
```typescript
// libs/utils/src/types/user.ts
export type User = {
  id: string;
  username: string;
  email?: string;
};

// libs/utils/src/schemas/user.ts
import { z } from "zod";
export const UserSchema = z.object({
  id: z.string(),
  username: z.string().min(3),
  email: z.string().email().optional(),
});

// apps/backend/src/index.ts
import type { User } from "@my-enterprise/utils";
import { UserSchema } from "@my-enterprise/utils";

async function createUserHandler(reqBody: unknown): Promise<User> {
  const parsed = UserSchema.safeParse(reqBody);
  if (!parsed.success) throw new Error("Invalid payload");
  return { id: "u123", username: parsed.data.username, email: parsed.data.email };
}

// apps/frontend/src/App.tsx
import React from "react";
import type { User } from "@my-enterprise/utils";

const App: React.FC = () => {
  const createUser = async () => {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ username: "tuann", password: "123456" }),
      headers: { "Content-Type": "application/json" },
    });
    const user: User = await response.json();
    console.log("User:", user);
  };

  return <button onClick={createUser}>Create User</button>;
};
```

**Giải thích**:
- **libs/utils** chứa types và schemas dùng chung, đảm bảo type-safety.
- **Project References** giúp TypeScript hiểu dependency, tăng tốc build.
- **Nx/Turborepo** quản lý build, lint, và test trong toàn monorepo.

---

## 7. Bài tập

### 🟢 Cấp độ 1: Tạo monorepo cơ bản
- Tạo monorepo mới với **Nx** hoặc **Turborepo**.
- Tạo 1 app (`frontend`) và 1 lib (`utils`).
- Di chuyển type `User` vào `libs/utils` và import vào `frontend`.
- Build và kiểm tra type-safety.

**Lời giải**:
```bash
# Tạo monorepo với Nx
npx create-nx-workspace@latest my-enterprise
cd my-enterprise
nx generate @nrwl/react:app frontend
nx generate @nrwl/node:lib utils
```

```typescript
// libs/utils/src/types/user.ts
export type User = {
  id: string;
  username: string;
  email?: string;
};

// apps/frontend/src/App.tsx
import type { User } from "@my-enterprise/utils";

const user: User = { id: "u123", username: "tuann" }; // Type-safe
console.log(user);
```

```bash
# Build
nx build frontend
```

**Giải thích**:
- `User` được chia sẻ từ `libs/utils`, đảm bảo frontend sử dụng đúng type.
- Nx tự động cấu hình alias `@my-enterprise/utils` cho import.

### 🟡 Cấp độ 2: Cấu hình Project References
- Tạo nhiều lib (`utils`, `types`, `validation`).
- Cấu hình **Project References** trong `tsconfig.json`.
- Thử sửa type trong `libs/types` và kiểm tra lỗi compile trong `frontend`/`backend`.

**Lời giải**:
```typescript
// tsconfig.json (root)
{
  "files": [],
  "references": [
    { "path": "libs/utils" },
    { "path": "libs/types" },
    { "path": "libs/validation" },
    { "path": "apps/frontend" }
  ]
}

// libs/types/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}

// libs/types/src/user.ts
export type User = {
  id: string;
  username: string;
};

// apps/frontend/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "references": [{ "path": "../libs/types" }],
  "include": ["src"]
}

// apps/frontend/src/App.tsx
import type { User } from "@my-enterprise/types";

const user: User = { id: "u123", username: "tuann" }; // Type-safe
// const user: User = { id: "u123" }; // ❌ Lỗi: thiếu username
```

**Giải thích**:
- `references` trong `tsconfig.json` đảm bảo `types` được build trước `frontend`.
- Nếu sửa `User` (ví dụ: thêm field bắt buộc), TypeScript sẽ báo lỗi trong `frontend`.

### 🔴 Cấp độ 3: Mini-Enterprise App
- Tạo monorepo với `frontend`, `backend`, và 2 lib (`utils`, `ui`).
- Cấu hình incremental build và CI/CD.
- Thêm validation runtime từ `libs/utils`.

**Lời giải**:
```typescript
// libs/utils/src/types/user.ts
export type User = {
  id: string;
  username: string;
  email?: string;
};

// libs/utils/src/schemas/user.ts
import { z } from "zod";
export const UserSchema = z.object({
  id: z.string(),
  username: z.string().min(3),
  email: z.string().email().optional(),
});

// apps/backend/src/index.ts
import type { User } from "@my-enterprise/utils";
import { UserSchema } from "@my-enterprise/utils";

async function createUserHandler(reqBody: unknown): Promise<User> {
  const parsed = UserSchema.safeParse(reqBody);
  if (!parsed.success) throw new Error("Invalid payload");
  return { id: "u123", username: parsed.data.username, email: parsed.data.email };
}

// apps/frontend/src/App.tsx
import React from "react";
import type { User } from "@my-enterprise/utils";
import { UserSchema } from "@my-enterprise/utils";

const App: React.FC = () => {
  const createUser = async () => {
    const input = { username: "tuann", email: "tuann@example.com" };
    const parsed = UserSchema.safeParse(input);
    if (!parsed.success) {
      console.error(parsed.error.format());
      return;
    }
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(parsed.data),
      headers: { "Content-Type": "application/json" },
    });
    const user: User = await response.json();
    console.log("User:", user);
  };

  return <button onClick={createUser}>Create User</button>;
};
```

```bash
# Build incremental
nx build utils
nx build backend
nx build frontend

# CI/CD pipeline (ví dụ với GitHub Actions)
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: nx affected --target=build
```

**Giải thích**:
- **Mini-app**: Frontend gọi API backend, sử dụng shared types và schemas từ `libs/utils`.
- **Incremental build**: Nx/Turborepo chỉ build package bị thay đổi.
- **Validation**: Zod schemas trong `libs/utils` đảm bảo type-safety cả compile-time và runtime.
- **CI/CD**: Pipeline chạy `nx affected` để chỉ build/test các package bị ảnh hưởng.

---

## 8. Kết luận

- **Monorepo** giúp quản lý nhiều package/app trong một repo, cải thiện code reuse và type-safety.
- **Nx** và **Turborepo** cung cấp các công cụ mạnh mẽ để quản lý build, test, và lint.
- **Project References** tăng tốc build bằng incremental compilation và đảm bảo type-safety giữa các package.
- **Enterprise Practices** như shared types, validation schemas, và CI/CD tối ưu hóa workflow cho các dự án lớn.
- Day 42 là nền tảng cho **clean architecture**, **type-safe**, và **scalable monorepo**, chuẩn bị cho các hệ thống phức tạp như microservices hoặc full-stack apps.

---

## 9. Bước tiếp theo

- **Thực hành**: Tích hợp **OpenAPI/Swagger** để sinh types tự động từ API specs.
- **Khám phá**: Sử dụng **Nx plugins** hoặc **Turborepo pipelines** để thêm lint/test automation.
- **Mở rộng**: Thêm **monorepo versioning** (independent hoặc unified) và deploy lên Vercel/Netlify.

Tài liệu này cung cấp nền tảng để thiết lập và quản lý monorepo với TypeScript, kết hợp lý thuyết, ví dụ thực tế, và bài tập để áp dụng vào các dự án doanh nghiệp. Nếu bạn muốn mở rộng thêm (ví dụ: tích hợp OpenAPI hoặc thêm versioning), hãy cho mình biết nhé! 🚀

---
📌 [<< Ngày 41](./Day41.md) | [Ngày 43 >>](./Day43.md)