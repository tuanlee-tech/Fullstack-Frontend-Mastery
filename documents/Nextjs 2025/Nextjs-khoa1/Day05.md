# Day 5: API Routes & Route Handlers (Page + App Router)

## Mục tiêu học

Sau ngày học này, bạn sẽ:

1. Hiểu **API routes** trong Page Router (`pages/api`) và App Router (`app/api/route.ts`).
2. Tạo các route GET, POST, PUT, DELETE cơ bản.
3. Áp dụng **type-safe responses** với TypeScript.
4. Thực hành **input validation** (Zod).
5. Viết code **production-ready**, reusable, maintainable.
6. Biết cách test API cơ bản (Postman / curl).

---

## TL;DR

* **Page Router:** `pages/api/hello.ts`
* **App Router:** `app/api/hello/route.ts`
* TypeScript giúp **typed request/response**.
* Validate input luôn quan trọng để tránh lỗi runtime hoặc security issues.

---

## 1️⃣ Lý thuyết chi tiết

### 1.1 Page Router API

```ts
// pages/api/hello.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = { message: string };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'Hello from Page Router API' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
```

### 1.2 App Router API (Next.js 13+)

```ts
// app/api/hello/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Hello from App Router API' });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({ message: `Received: ${body.name}` });
}
```

### 1.3 Input Validation với Zod

```bash
npm install zod
```

```ts
// app/api/users/route.ts
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = userSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  return NextResponse.json({ message: `User ${parsed.data.name} created` });
}
```

---

## 2️⃣ Bài tập

### Level 1

* **Đề:** Tạo API `/api/time` trả về thời gian hiện tại.
* **Giải:**

**Page Router:** `pages/api/time.ts`

```ts
import type { NextApiRequest, NextApiResponse } from 'next';
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ now: new Date().toISOString() });
}
```

**App Router:** `app/api/time/route.ts`

```ts
import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ now: new Date().toISOString() });
}
```

---

### Level 2

* **Đề:** Tạo API POST `/api/echo` nhận `{ message }` trả về `{ message, length }`.
* **Giải:**

**Page Router:** `pages/api/echo.ts`

```ts
import type { NextApiRequest, NextApiResponse } from 'next';
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { message } = req.body;
    res.status(200).json({ message, length: message?.length || 0 });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
```

**App Router:** `app/api/echo/route.ts`

```ts
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  const { message } = await req.json();
  return NextResponse.json({ message, length: message?.length || 0 });
}
```

---

### Level 3

* **Đề:** Tích hợp **Zod** validate input POST `{ name, email }`. Nếu invalid → trả status 400.
* **Giải:**

```ts
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

const schema = z.object({ name: z.string().min(2), email: z.string().email() });

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = schema.safeParse(body);
  if (!result.success) return NextResponse.json({ error: result.error.format() }, { status: 400 });
  return NextResponse.json({ message: `User ${result.data.name} created` });
}
```

---

## 3️⃣ Common Pitfalls

* Quên check `req.method` trong Page Router → lỗi Method Not Allowed.
* Không validate input → security issue, crash app.
* App Router luôn async function.

---

## 4️⃣ Performance / Security Notes

* Thêm **rate limit / auth middleware** cho API production.
* Xử lý error và trả status code chuẩn.
* Cache GET request nếu cần giảm load server.

---

## 5️⃣ Further Reading

* [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
* [App Router Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
* [Zod Docs](https://zod.dev/)

---

[<< Ngày 4](./Day04.md) | [Ngày 6 >>](./Day06.md)

---
