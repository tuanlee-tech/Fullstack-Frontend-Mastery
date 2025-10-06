# Day 6: Middleware & Edge Functions (Page + App Router)

## Mục tiêu học

Sau ngày học này, bạn sẽ:

1. Hiểu cơ chế **Middleware** trong Next.js: chạy trước request, intercept request/response.
2. Áp dụng **Route Protection**, **redirect**, **rewrite** với Middleware.
3. Sử dụng **Edge Functions** để chạy logic gần người dùng hơn (low-latency).
4. Viết Middleware type-safe, reusable, production-ready.
5. Biết khi nào dùng Middleware vs API route.

---

## TL;DR

* **Middleware**: file `middleware.ts` nằm ở root hoặc trong folder route.
* Chạy **trước request**, có thể redirect, rewrite, modify headers.
* **Edge Functions**: serverless, low-latency, có thể deploy global.
* Middleware/App Router có thể kết hợp với auth, logging, i18n.

---

## 1️⃣ Lý thuyết chi tiết

### 1.1 Middleware cơ bản

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  if (!req.cookies.get('token')) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

// Áp dụng cho tất cả route
export const config = { matcher: '/dashboard/:path*' };
```

### 1.2 Middleware với headers

```ts
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set('X-Custom-Header', 'MyApp');
  return res;
}
```

---

### 1.3 Edge Functions (App Router)

```ts
// app/api/hello/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // chạy ở Edge

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Hello from Edge Function' });
}
```

* **Edge** → serverless, global, low-latency.
* **Limitations:** không dùng Node API, chỉ hỗ trợ Web APIs.

---

### 1.4 Best Practices

* Middleware **ngắn gọn, nhanh**, tránh heavy computation.
* Edge Function nên **stateless**, chỉ dùng cho fetch, rewrite, redirect.
* Dùng `matcher` để hạn chế scope Middleware.
* Luôn handle error → tránh block request.

---

## 2️⃣ Bài tập

### Level 1

* **Đề:** Tạo middleware redirect `/admin` → `/login` nếu không có cookie `token`.
* **Giải:**

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  if (!req.cookies.get('token')) url.pathname = '/login';
  return NextResponse.redirect(url);
}
export const config = { matcher: '/admin/:path*' };
```

---

### Level 2

* **Đề:** Middleware thêm header `X-User` với giá trị từ cookie `username`.
* **Giải:**

```ts
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const username = req.cookies.get('username')?.value || 'guest';
  res.headers.set('X-User', username);
  return res;
}
export const config = { matcher: '/dashboard/:path*' };
```

---

### Level 3

* **Đề:** Edge Function `/api/time-edge` trả về `serverTime` và `timezone` dựa vào header `x-timezone`.
* **Giải:**

```ts
// app/api/time-edge/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const tz = req.headers.get('x-timezone') || 'UTC';
  const serverTime = new Date().toLocaleString('en-US', { timeZone: tz });
  return NextResponse.json({ serverTime, timezone: tz });
}
```

---

## 3️⃣ Common Pitfalls

* Middleware heavy computation → block request.
* Forget `matcher` → chạy cho toàn bộ routes, ảnh hưởng performance.
* Edge Function dùng Node API → lỗi runtime.
* Không handle undefined cookie/header → crash.

---

## 4️⃣ Performance / Security Notes

* Middleware chạy **trước request**, ưu tiên ngắn gọn & efficient.
* Edge Functions deploy global → giảm latency cho users.
* Không expose sensitive info trong header.

---

## 5️⃣ Further Reading

* [Next.js Middleware](https://nextjs.org/docs/middleware)
* [Edge Functions](https://nextjs.org/docs/app/building-your-application/routing/edge-functions)

---

[<< Ngày 5](./Day05.md) | [Ngày 7 >>](./Day07.md)

---
