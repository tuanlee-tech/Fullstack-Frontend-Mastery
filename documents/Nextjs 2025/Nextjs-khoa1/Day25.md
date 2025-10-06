# 🟩 Day 25: Feature Implementation 1 – Auth, API, DB Integration

## **Mục tiêu học**

Sau ngày này, bạn sẽ:

1. Cài đặt và triển khai **Authentication** (JWT / NextAuth.js) cho cả Page Router & App Router.
2. Tạo API route CRUD có **DB integration** với Prisma.
3. Tích hợp **typed response & validation** bằng Zod.
4. Triển khai pattern **shared server-side logic** giữa Page Router & App Router.
5. Áp dụng enterprise pattern: session check, role-based access, reusable API utils.

---

## **TL;DR**

* Page Router → API routes + client-side fetch + SSR check auth
* App Router → Server components + middleware check auth
* JWT / NextAuth.js → quản lý session / token
* Prisma → DB integration, typed queries
* Validation → Zod, tránh invalid data

---

## **1️⃣ Authentication Setup**

### **1.1 NextAuth.js (Page Router)**

```bash
npm install next-auth
```

`pages/api/auth/[...nextauth].ts`:

```ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '../../../lib/prisma';
import { compare } from 'bcrypt';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({ where: { email: credentials?.email } });
        if (user && await compare(credentials?.password!, user.password)) {
          return { id: user.id, email: user.email, role: user.role };
        }
        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
});
```

### **1.2 Auth Middleware (App Router)**

`middleware.ts`:

```ts
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token && req.nextUrl.pathname.startsWith('/app')) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }
  return NextResponse.next();
}
```

**Giải thích:**

* Middleware kiểm tra JWT token trên App Router pages
* Page Router sử dụng session check trong `getServerSideProps`

---

## **2️⃣ API Route + DB Integration**

`pages/api/posts.ts`:

```ts
import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { getSession } from 'next-auth/react';

const PostSchema = z.object({ title: z.string(), content: z.string() });

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  if (req.method === 'POST') {
    const parseResult = PostSchema.safeParse(req.body);
    if (!parseResult.success) return res.status(400).json(parseResult.error);
    const post = await prisma.post.create({ data: { ...parseResult.data, authorId: session.user.id } });
    return res.status(201).json(post);
  }

  if (req.method === 'GET') {
    const posts = await prisma.post.findMany({ where: { authorId: session.user.id } });
    return res.status(200).json(posts);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
```

---

## **3️⃣ Mini Real-World Example**

* Page Router: `/api/posts` → authenticated CRUD API
* App Router: `/app/posts` → Server component fetch trực tiếp DB với auth middleware
* Role-based access: user chỉ xem/edit post của mình

```tsx
// app/posts/page.tsx
import { prisma } from '../../lib/prisma';

export default async function Page({ params }: any) {
  // Auth check via middleware
  const posts = await prisma.post.findMany({ where: { authorId: 1 } });
  return <div>{posts.map(p => <div key={p.id}>{p.title}</div>)}</div>;
}
```

---

## **4️⃣ Common Pitfalls**

| Pitfall                               | Note / Solution                            |
| ------------------------------------- | ------------------------------------------ |
| JWT / session không share giữa router | NextAuth session middleware cho App Router |
| Invalid data create post              | Luôn dùng Zod validation                   |
| DB query không type-safe              | Dùng Prisma client + TypeScript types      |
| Role-based check thiếu                | Middleware + API check                     |

---

## **5️⃣ Further Reading**

* [NextAuth.js Docs](https://next-auth.js.org/)
* [Prisma Docs](https://www.prisma.io/docs/)
* [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/middleware)
* [Zod Validation](https://zod.dev/)

---

# **Day 25: Feature Implementation 1 – Giải bài tập**

## **Level 1: Authentication – Session Check**

**Đề:** Triển khai authentication cơ bản với NextAuth.js (Page Router) và middleware (App Router).

### **Giải – Page Router**

```ts
// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '../../../lib/prisma';
import { compare } from 'bcrypt';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({ where: { email: credentials?.email } });
        if (user && await compare(credentials?.password!, user.password)) {
          return { id: user.id, email: user.email, role: user.role };
        }
        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
});
```

**Test:**

* Đăng nhập thử → nhận JWT session.
* Sử dụng `getSession({ req })` để check session trong API route.

### **Giải – App Router Middleware**

```ts
// middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token && req.nextUrl.pathname.startsWith('/app')) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }
  return NextResponse.next();
}
```

---

## **Level 2: API Route CRUD với Auth & DB Integration**

**Đề:** Tạo API route `/api/posts` với:

* GET: lấy posts của user
* POST: tạo post mới
* Auth check bằng session

### **Giải**

```ts
// pages/api/posts.ts
import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { getSession } from 'next-auth/react';

const PostSchema = z.object({ title: z.string(), content: z.string() });

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  if (req.method === 'POST') {
    const parseResult = PostSchema.safeParse(req.body);
    if (!parseResult.success) return res.status(400).json(parseResult.error);
    const post = await prisma.post.create({ data: { ...parseResult.data, authorId: session.user.id } });
    return res.status(201).json(post);
  }

  if (req.method === 'GET') {
    const posts = await prisma.post.findMany({ where: { authorId: session.user.id } });
    return res.status(200).json(posts);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
```

**Test:**

* GET `/api/posts` → trả về posts của user
* POST `/api/posts` với JSON body `{ title, content }` → tạo post

---

## **Level 3: Role-Based Access & Error Handling**

**Đề:** Thêm middleware/API check role “admin” mới được xóa post.

### **Giải**

```ts
// pages/api/posts/[id].ts
import { prisma } from '../../../lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  const { id } = req.query;

  if (req.method === 'DELETE') {
    if (session.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    await prisma.post.delete({ where: { id: Number(id) } });
    return res.status(204).end();
  }

  res.setHeader('Allow', ['DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
```

**Giải thích:**

* Role-based check đảm bảo user không authorized không thể xóa post
* Typed Prisma + session → bảo đảm data consistency

---

## ✅ Common Pitfalls

| Pitfall                             | Note / Solution                            |
| ----------------------------------- | ------------------------------------------ |
| JWT/session không share giữa router | Sử dụng NextAuth middleware cho App Router |
| Invalid post data                   | Zod validation                             |
| Unauthorized access                 | Middleware + API check role                |
| DB errors không catch               | Try/catch + proper response code           |

---

[<< Ngày 24](./Day24.md) | [Ngày 26 >>](./Day26.md)

