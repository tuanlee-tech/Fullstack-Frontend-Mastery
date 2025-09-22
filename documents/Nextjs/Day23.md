# 🟩 Day 23: Next.js + Database

## **Mục tiêu học**

Sau ngày này, bạn sẽ:

1. Kết nối Next.js với **Prisma + PostgreSQL** hoặc **MongoDB**.
2. Thực hiện **typed queries** và migration patterns.
3. Tạo API route để thao tác CRUD với database.
4. Hiểu cách sử dụng database trong **Page Router & App Router**.
5. Áp dụng best-practice: typed response, validation, error handling.

---

## **TL;DR**

* Prisma → ORM type-safe, migration dễ dàng.
* MongoDB → NoSQL, dùng với Mongoose hoặc Prisma MongoDB Connector.
* API routes → backend logic, typed, validate input.
* App Router server components → có thể fetch trực tiếp DB.
* Enterprise pattern: DB client singleton, avoid connection leaks, typed responses.

---

## **1️⃣ Lý thuyết chi tiết**

### **1.1 Prisma + PostgreSQL**

```bash
npm install prisma @prisma/client
npx prisma init
```

`.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
```

`prisma/schema.prisma`:

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  published Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

```bash
npx prisma migrate dev --name init
```

**DB client singleton:**

```ts
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ['query'] });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

### **1.2 MongoDB với Prisma**

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model Post {
  id        String   @id @map("_id") @default(auto()) @db.ObjectId
  title     String
  content   String
  published Boolean  @default(false)
}
```

* MongoDB không có auto-increment → dùng `ObjectId`.
* Prisma + MongoDB connector hỗ trợ type-safe query.

---

### **1.3 CRUD API Route**

**Page Router Example:**

```ts
// pages/api/posts.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';

const PostSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const parseResult = PostSchema.safeParse(req.body);
    if (!parseResult.success) return res.status(400).json(parseResult.error);
    const post = await prisma.post.create({ data: parseResult.data });
    return res.status(201).json(post);
  }
  if (req.method === 'GET') {
    const posts = await prisma.post.findMany();
    return res.status(200).json(posts);
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
```

**App Router Example (Server Component):**

```ts
// app/posts/page.tsx
import { prisma } from '../../lib/prisma';

export default async function Page() {
  const posts = await prisma.post.findMany();
  return (
    <ul>
      {posts.map(p => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  );
}
```

* Server component fetch trực tiếp DB → loại bỏ fetch API overhead.
* Typing đảm bảo compile-time safety.

---

## **2️⃣ Mini Real-World Example**

* Page Router: `/api/posts` → CRUD.
* App Router: `/posts` → render list trực tiếp từ DB.
* Validation bằng Zod → tránh invalid data.
* Prisma client singleton → avoid connection leaks trên hot reload.

---

## **3️⃣ Common Pitfalls**

| Pitfall                             | Note / Solution            |
| ----------------------------------- | -------------------------- |
| DB connection leaks                 | Dùng singleton client      |
| Input không validate                | Luôn dùng Zod / Yup        |
| Async errors không catch            | Try/catch + error response |
| ISR / revalidate fetch DB trực tiếp | Sử dụng caching nếu cần    |

---

## **4️⃣ Further Reading / References**

* [Prisma Docs](https://www.prisma.io/docs/)
* [MongoDB Prisma Connector](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
* [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
* [Server Components](https://nextjs.org/docs/app/building-your-application/server-components)

---


# **Day 23: Next.js + Database – Giải bài tập**

## **Level 1: Connect & Fetch DB**

**Đề:** Kết nối Next.js với PostgreSQL bằng Prisma và fetch tất cả posts trong Page Router và App Router.

### **Giải – Page Router**

```ts
// pages/api/posts.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const posts = await prisma.post.findMany();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err });
  }
}
```

### **Giải – App Router (Server Component)**

```ts
// app/posts/page.tsx
import { prisma } from '../../lib/prisma';

export default async function Page() {
  const posts = await prisma.post.findMany();
  return (
    <ul>
      {posts.map(p => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  );
}
```

**Giải thích:**

* Server component fetch trực tiếp DB → giảm API overhead.
* Typing Prisma → type-safe.

---

## **Level 2: Create Post with Validation**

**Đề:** Tạo API route POST `/api/posts` với validation bằng Zod.

### **Giải**

```ts
// pages/api/posts.ts (POST handler)
import { z } from 'zod';
import { prisma } from '../../lib/prisma';

const PostSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const parseResult = PostSchema.safeParse(req.body);
    if (!parseResult.success) return res.status(400).json(parseResult.error);
    const post = await prisma.post.create({ data: parseResult.data });
    return res.status(201).json(post);
  }
}
```

**Test bằng Postman / curl:**

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Post","content":"Hello world"}'
```

**Giải thích:**

* Zod validate input → tránh invalid data.
* Typed Prisma client đảm bảo DB consistency.

---

## **Level 3: Update & Delete Post**

**Đề:** Thêm API routes PATCH `/api/posts/[id]` và DELETE `/api/posts/[id]`.

### **Giải**

```ts
// pages/api/posts/[id].ts
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';

const UpdateSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PATCH') {
    const parseResult = UpdateSchema.safeParse(req.body);
    if (!parseResult.success) return res.status(400).json(parseResult.error);
    const updated = await prisma.post.update({
      where: { id: Number(id) },
      data: parseResult.data,
    });
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    await prisma.post.delete({ where: { id: Number(id) } });
    return res.status(204).end();
  }

  res.setHeader('Allow', ['PATCH', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
```

**Test:**

* PATCH: cập nhật title/content
* DELETE: xóa post

**Giải thích:**

* Typed Prisma + Zod → đảm bảo data integrity
* Error handling chuẩn cho enterprise app

---

## ✅ Common Pitfalls

| Pitfall                 | Note / Solution                      |
| ----------------------- | ------------------------------------ |
| Không validate input    | Dùng Zod / Yup                       |
| DB connection leak      | Sử dụng singleton client             |
| Async error không catch | Try/catch + proper status code       |
| Id không parse đúng     | Number(id) hoặc ObjectId nếu MongoDB |

---

[<< Ngày 22](./Day22.md) | [Ngày 24 >>](./Day24.md)

