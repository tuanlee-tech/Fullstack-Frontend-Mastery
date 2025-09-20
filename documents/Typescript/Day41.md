# 📌 Ngày 41: Type-Safe API Design — End-to-End Typing giữa Frontend & Backend

Đây là bài học tập trung vào việc thiết kế API an toàn kiểu (type-safe) từ **backend** đến **frontend**, sử dụng TypeScript để đảm bảo đồng bộ dữ liệu, giảm lỗi runtime, và cải thiện trải nghiệm lập trình viên (**developer experience**). Tài liệu được viết chi tiết, rõ ràng, với các ví dụ thực tế và bài tập, phù hợp cho cả người mới bắt đầu và lập trình viên muốn áp dụng TypeScript ở cấp độ doanh nghiệp.

---

## 1. Mục tiêu học

Sau bài này, bạn sẽ:
1. Hiểu cách thiết kế **API type-safe** từ backend đến frontend.
2. Sử dụng **TypeScript** để định nghĩa **contract types** (DTOs, Request/Response).
3. Áp dụng **Zod** hoặc **io-ts** để validate dữ liệu runtime.
4. Tích hợp type-safe API với **fetch/axios** sử dụng **generics**.
5. Tối ưu hóa **workflow** với types đồng bộ giữa frontend và backend.
6. Phân tích **trade-offs** giữa strict typing và tính linh hoạt trong các dự án doanh nghiệp.

---

## 2. TL;DR (Tóm tắt)

**Type-safe API** giúp:
- **Giảm lỗi runtime** bằng cách validate dữ liệu cả compile-time và runtime.
- Đảm bảo **đồng bộ kiểu** giữa client (frontend) và server (backend).
- Cải thiện **developer experience** thông qua autocomplete và kiểm tra lỗi compile-time.

Mỗi endpoint được mô tả bằng **contract type** (DTO), và được validate runtime bằng schema (ví dụ: **Zod**). Sử dụng generic `ApiResponse<T>` để chuẩn hóa response.

---

## 3. Lý thuyết & Best Practices

### 3.1 Contract Types (DTOs)
**DTO (Data Transfer Object)** là interface hoặc type mô tả chính xác cấu trúc của payload **request** và **response** cho mỗi endpoint.

Ví dụ:
```typescript
// shared/types/user.ts
export type CreateUserRequest = {
  username: string;
  password: string;
  email?: string;
};

export type CreateUserResponse = {
  id: string;
  username: string;
  email?: string;
  createdAt: string;
};
```

**Lợi ích**:
- Frontend biết chính xác dữ liệu backend trả về, tránh sử dụng `any`.
- TypeScript compiler sẽ báo lỗi nếu dữ liệu không khớp với DTO.

### 3.2 Runtime Validation với Zod
TypeScript chỉ kiểm tra kiểu tại **compile-time**. Để đảm bảo dữ liệu hợp lệ tại **runtime**, cần sử dụng thư viện như **Zod** để validate.

Ví dụ:
```typescript
import { z } from "zod";

// Schema cho CreateUserRequest
const CreateUserRequestSchema = z.object({
  username: z.string().min(3, "Tên người dùng phải dài ít nhất 3 ký tự"),
  password: z.string().min(6, "Mật khẩu phải dài ít nhất 6 ký tự"),
  email: z.string().email("Email không hợp lệ").optional(),
});

// Validate dữ liệu
const input = { username: "tuann", password: "123456" };
const parsed = CreateUserRequestSchema.safeParse(input);
if (!parsed.success) {
  console.error(parsed.error.format());
} else {
  console.log("Valid input:", parsed.data);
}
```

**Giải thích**:
- `z.object` định nghĩa cấu trúc và ràng buộc cho payload.
- `safeParse` kiểm tra dữ liệu runtime, trả về lỗi nếu không hợp lệ.

### 3.3 Generic `ApiResponse`
Để chuẩn hóa response API, sử dụng generic type `ApiResponse<T>`:
```typescript
// shared/types/api.ts
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
```

Ví dụ sử dụng với `fetch`:
```typescript
async function createUser(req: CreateUserRequest): Promise<ApiResponse<CreateUserResponse>> {
  const res = await fetch("/api/users", {
    method: "POST",
    body: JSON.stringify(req),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}
```

**Giải thích**:
- `ApiResponse<T>` đảm bảo response luôn có `success`, và tùy chọn `data` hoặc `error`.
- TypeScript suy ra type của `data` dựa trên `T` (ví dụ: `CreateUserResponse`).

### 3.4 Endpoint Type-Safety
- **Tách module chung**: Đặt types (`CreateUserRequest`, `CreateUserResponse`) và schemas vào thư mục `shared` để cả frontend và backend sử dụng.
- **Error handling**: Sử dụng union types hoặc enums cho error codes (ví dụ: `401 | 403 | 500`).
- **Compile-time safety**: Nếu backend thay đổi response, TypeScript sẽ báo lỗi ở frontend, tránh bug runtime.

### 3.5 Enterprise Considerations
1. **Consistency**: Luôn định nghĩa DTO và validate bằng schema cho mọi endpoint.
2. **Versioning**: Sử dụng versioned API (`/v1/users`) và giữ types backward-compatible.
3. **Error Handling**: Luôn trả `ApiResponse<T>` để frontend biết cách xử lý lỗi.
4. **Testing**: Viết unit-test cho schema validation để đảm bảo tính đúng đắn.
5. **Documentation**: Tích hợp với **OpenAPI/Swagger** để tự động sinh types từ API specs.

---

## 4. Ví dụ đầy đủ (Full Example)

### 4.1 Shared Types
```typescript
// shared/types/user.ts
export type CreateUserRequest = {
  username: string;
  password: string;
  email?: string;
};

export type CreateUserResponse = {
  id: string;
  username: string;
  email?: string;
  createdAt: string;
};
```

### 4.2 Schema Validation
```typescript
// shared/schemas/user.ts
import { z } from "zod";

export const CreateUserRequestSchema = z.object({
  username: z.string().min(3, "Tên người dùng phải dài ít nhất 3 ký tự"),
  password: z.string().min(6, "Mật khẩu phải dài ít nhất 6 ký tự"),
  email: z.string().email("Email không hợp lệ").optional(),
});
```

### 4.3 Backend Handler
```typescript
// backend/api/users.ts
import type { CreateUserRequest, CreateUserResponse } from "../shared/types/user";
import { CreateUserRequestSchema } from "../shared/schemas/user";

export async function createUserHandler(reqBody: unknown): Promise<CreateUserResponse> {
  const parseResult = CreateUserRequestSchema.safeParse(reqBody);
  if (!parseResult.success) {
    throw new Error("Invalid payload: " + JSON.stringify(parseResult.error.format()));
  }

  const user: CreateUserResponse = {
    id: "u123",
    username: parseResult.data.username,
    email: parseResult.data.email,
    createdAt: new Date().toISOString(),
  };
  return user;
}
```

### 4.4 Frontend API Client
```typescript
// frontend/apiClient.ts
import type { CreateUserRequest, CreateUserResponse } from "../shared/types/user";
import type { ApiResponse } from "../shared/types/api";

export async function createUser(req: CreateUserRequest): Promise<ApiResponse<CreateUserResponse>> {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  return res.json();
}
```

### 4.5 Frontend Usage
```typescript
// frontend/usage.ts
async function register() {
  const response = await createUser({ username: "tuann", password: "123456" });
  if (response.success) {
    console.log("User ID:", response.data?.id); // Type-safe: response.data is CreateUserResponse
  } else {
    console.error("Error:", response.error);
  }
}
```

**Kết quả**:
- `response.data` được TypeScript suy ra đúng là `CreateUserResponse`, hỗ trợ autocomplete trong IDE.
- Backend validate payload bằng `CreateUserRequestSchema`, tránh crash runtime.
- `ApiResponse<T>` chuẩn hóa response, có thể tái sử dụng cho mọi endpoint.

---

## 5. Bài tập

### 🟢 Cấp độ 1: Tạo endpoint `loginUser`
Tạo type-safe API endpoint cho `loginUser` với:
- Định nghĩa `LoginRequest` và `LoginResponse`.
- Sử dụng Zod để validate input.

**Lời giải**:
```typescript
// shared/types/user.ts
type LoginRequest = {
  username: string;
  password: string;
};

type LoginResponse = {
  token: string;
  expiresAt: string;
};

// shared/schemas/user.ts
import { z } from "zod";

const LoginRequestSchema = z.object({
  username: z.string().min(3, "Tên người dùng phải dài ít nhất 3 ký tự"),
  password: z.string().min(6, "Mật khẩu phải dài ít nhất 6 ký tự"),
});

// backend/api/users.ts
async function loginUserHandler(reqBody: unknown): Promise<LoginResponse> {
  const parseResult = LoginRequestSchema.safeParse(reqBody);
  if (!parseResult.success) {
    throw new Error("Invalid login payload: " + JSON.stringify(parseResult.error.format()));
  }
  return {
    token: "abc123",
    expiresAt: new Date(Date.now() + 3600e3).toISOString(),
  };
}
```

**Giải thích**:
- `LoginRequest` và `LoginResponse` định nghĩa cấu trúc payload.
- `LoginRequestSchema` validate runtime để đảm bảo dữ liệu hợp lệ.
- Backend handler ném lỗi nếu payload không đúng.

### 🟡 Cấp độ 2: Generic `fetchApi` function
Viết hàm generic `fetchApi<T>` để gọi endpoint và parse dữ liệu type-safe.

**Lời giải**:
```typescript
// frontend/apiClient.ts
import type { ApiResponse } from "../shared/types/api";

async function fetchApi<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

// Sử dụng
async function example() {
  const response = await fetchApi<CreateUserResponse>("/api/users", {
    username: "tuann",
    password: "123456",
  });
  if (response.success) {
    console.log("User ID:", response.data?.id); // Type-safe
  }
}
```

**Giải thích**:
- `fetchApi<T>` là hàm generic, suy ra type `T` cho response data.
- Đảm bảo dữ liệu trả về khớp với type được chỉ định (ví dụ: `CreateUserResponse`).

### 🔴 Cấp độ 3: Shared Types Module & Unit Tests
- Tạo **shared types module** cho các entity (`user`, `post`, `comment`).
- Viết unit-test cho schema validation với Jest.
- Mô phỏng scenario frontend gửi dữ liệu xấu, backend reject, frontend hiển thị lỗi type-safe.

**Lời giải**:
```typescript
// shared/types/index.ts
export type User = {
  id: string;
  username: string;
  email?: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
};

export type Comment = {
  id: string;
  content: string;
  postId: string;
  authorId: string;
};

// shared/schemas/user.ts
import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  username: z.string().min(3),
  email: z.string().email().optional(),
});

// tests/userSchema.test.ts
import { describe, expect, it } from "@jest/globals";
import { UserSchema } from "../shared/schemas/user";

describe("UserSchema", () => {
  it("should validate valid user", () => {
    const result = UserSchema.safeParse({ id: "u123", username: "tuann" });
    expect(result.success).toBe(true);
  });

  it("should reject invalid user", () => {
    const result = UserSchema.safeParse({ id: "u123", username: "t" });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe("Tên người dùng phải dài ít nhất 3 ký tự");
  });
});

// frontend/usage.ts
async function registerBadData() {
  try {
    const response = await createUser({ username: "t", password: "123" }); // Dữ liệu xấu
    if (response.success) {
      console.log("User ID:", response.data?.id);
    } else {
      console.error("Error:", response.error); // Type-safe error handling
    }
  } catch (e) {
    console.error("Request failed:", (e as Error).message);
  }
}
```

**Giải thích**:
- **Shared types module** chứa các type `User`, `Post`, `Comment`, được dùng chung cho cả frontend và backend.
- **Unit tests** kiểm tra schema validation với Jest, đảm bảo dữ liệu hợp lệ được chấp nhận và dữ liệu xấu bị reject.
- **Error handling** ở frontend sử dụng `ApiResponse` để xử lý lỗi type-safe.

---

## 6. Common Pitfalls & Notes

- **Không validate runtime**: Dữ liệu xấu (bad payload) có thể gây crash nếu chỉ dựa vào TypeScript (compile-time).
- **Không share types**: Nếu frontend và backend không dùng chung types, frontend thường phải cast `any`, dẫn đến lỗi runtime.
- **Overfetching/Underfetching**: Sử dụng `ApiResponse<T>` để chuẩn hóa response, tránh thiếu hoặc dư dữ liệu.
- **Trade-offs**:
  - **Quá strict**: Types quá chặt chẽ dẫn đến phải đồng bộ liên tục giữa FE/BE.
  - **Quá lỏng**: Mất an toàn kiểu, dễ gây bug runtime.

---

## 7. Kết luận

- **Type-Safe API Design** đảm bảo đồng bộ kiểu giữa frontend và backend, giảm lỗi và cải thiện developer experience.
- **DTOs** và **Zod** cung cấp kiểm tra kiểu cả compile-time và runtime.
- **Generic `ApiResponse<T>`** chuẩn hóa response, dễ tái sử dụng.
- **Enterprise Practices** như versioning, error handling, và testing giúp xây dựng hệ thống robust.
- Day 41 là bước chuyển từ **senior TypeScript** sang **enterprise-grade FE/BE integration**, chuẩn bị cho các hệ thống lớn như monorepo hoặc microservices.

---

## 8. Bước tiếp theo

- **Thực hành**: Tích hợp API với **tRPC** hoặc **GraphQL** để tăng cường type-safety.
- **Khám phá**: Sử dụng **OpenAPI/Swagger** để tự động sinh types từ API specs.
- **Mở rộng**: Thêm **async validation** cho API (ví dụ: kiểm tra username trùng lặp qua DB).

Tài liệu này cung cấp nền tảng để thiết kế API type-safe, kết hợp lý thuyết, ví dụ thực tế, và bài tập để áp dụng vào các dự án doanh nghiệp. Nếu bạn muốn mở rộng thêm (ví dụ: tích hợp tRPC hoặc thêm async validation), hãy cho mình biết nhé! 🚀

---
📌 [<< Ngày 40](./Day40.md) | [Ngày 42 >>](./Day42.md)