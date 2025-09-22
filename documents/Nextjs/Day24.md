# 🟩 Day 24: Fullstack Project Setup

## **Mục tiêu học**

Sau ngày này, bạn sẽ:

1. Thiết lập skeleton project cho **Fullstack app** Next.js với **Page Router + App Router song song**.
2. Xây dựng folder structure chuẩn production.
3. Cài đặt environment variables, ESLint, Prettier, TypeScript config.
4. Chuẩn bị database connection, API routes, server/client components.
5. Áp dụng enterprise patterns: modular folder, reusable utils, typed API responses.

---

## **TL;DR**

* Folder `/pages` → Page Router
* Folder `/app` → App Router
* `/lib` → DB clients, utils
* `/components` → shared components
* `/api` → typed API routes
* CI/CD ready + lint/type/tests check

---

## **1️⃣ Folder Structure đề xuất**

```
my-fullstack-app/
├─ app/                 # App Router pages & server components
│  ├─ posts/
│  │  └─ page.tsx
│  └─ layout.tsx
├─ pages/               # Page Router pages
│  ├─ index.tsx
│  ├─ posts.tsx
│  └─ api/
│      └─ posts.ts
├─ components/          # Shared UI components
│  └─ PostCard.tsx
├─ lib/                 # DB clients, helpers
│  └─ prisma.ts
├─ prisma/              # Prisma schema & migrations
│  └─ schema.prisma
├─ public/              # Static assets
├─ styles/              # Tailwind / CSS Modules
├─ .env.local
├─ tsconfig.json
├─ package.json
├─ next.config.js
├─ .eslintrc.js
└─ .prettierrc
```

---

## **2️⃣ Setup Base Project**

```bash
npx create-next-app@latest my-fullstack-app --typescript
cd my-fullstack-app
npm install prisma @prisma/client zod tailwindcss postcss autoprefixer
npx prisma init
npx tailwindcss init -p
```

* Cấu hình ESLint + Prettier chuẩn production.
* Thêm scripts trong `package.json`:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "type-check": "tsc --noEmit",
  "test": "jest"
}
```

---

## **3️⃣ Base Components & Utils**

* `/lib/prisma.ts` → Prisma singleton client
* `/components/PostCard.tsx` → reusable UI

```tsx
export default function PostCard({ title, content }: { title: string; content: string }) {
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="font-bold">{title}</h2>
      <p>{content}</p>
    </div>
  );
}
```

* `/lib/api.ts` → typed fetch wrapper:

```ts
export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
```

---

## **4️⃣ Page Router + App Router Skeleton**

**Page Router Example:**

```tsx
// pages/posts.tsx
import { fetcher } from '../lib/api';
import PostCard from '../components/PostCard';

export default function PostsPage() {
  const [posts, setPosts] = React.useState([]);
  React.useEffect(() => {
    fetcher('/api/posts').then(setPosts);
  }, []);

  return (
    <div>
      {posts.map((p: any) => <PostCard key={p.id} {...p} />)}
    </div>
  );
}
```

**App Router Example:**

```tsx
// app/posts/page.tsx
import { prisma } from '../../lib/prisma';
import PostCard from '../../components/PostCard';

export default async function PostsPage() {
  const posts = await prisma.post.findMany();
  return (
    <div>
      {posts.map(p => <PostCard key={p.id} {...p} />)}
    </div>
  );
}
```

---

## **5️⃣ Checklist Enterprise Setup**

* ✅ Lint & Prettier config
* ✅ TypeScript check
* ✅ Folder modular, reusable components
* ✅ DB client singleton, typed responses
* ✅ Base API route structure
* ✅ Tailwind / CSS Modules ready
* ✅ Scripts for dev, build, test, type-check

---

## **6️⃣ Common Pitfalls**

| Pitfall                            | Note / Solution                  |
| ---------------------------------- | -------------------------------- |
| Mix Page Router & App Router logic | Tách rõ folder `/pages` & `/app` |
| DB connection leak                 | Prisma singleton client          |
| Component duplication              | Shared components folder         |
| Missing environment variables      | `.env.local` + CI/CD secrets     |

---


# **Day 24: Fullstack Project Setup – Giải bài tập**

## **Level 1: Skeleton Project Setup**

**Đề:** Tạo project Next.js với TypeScript, Tailwind, Prisma, folder structure chuẩn production (Page Router + App Router).

### **Giải**

```bash
npx create-next-app@latest my-fullstack-app --typescript
cd my-fullstack-app
npm install prisma @prisma/client zod tailwindcss postcss autoprefixer
npx prisma init
npx tailwindcss init -p
```

**Folder structure:**

```
my-fullstack-app/
├─ app/
├─ pages/
├─ components/
├─ lib/
├─ prisma/
├─ public/
├─ styles/
```

**Giải thích:**

* `/app` → App Router
* `/pages` → Page Router
* `/lib` → DB client, utils
* `/components` → shared components

---

## **Level 2: Base Component & API Util**

**Đề:** Tạo reusable component và typed API fetch wrapper.

### **Giải – PostCard Component**

```tsx
export default function PostCard({ title, content }: { title: string; content: string }) {
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="font-bold">{title}</h2>
      <p>{content}</p>
    </div>
  );
}
```

### **Giải – Typed fetcher**

```ts
export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
```

**Giải thích:**

* Component reusable → App Router + Page Router đều dùng được
* Typed fetcher giúp đảm bảo type-safe data

---

## **Level 3: Page Router & App Router Skeleton**

**Đề:** Tạo Page Router và App Router pages hiển thị posts từ DB.

### **Page Router – pages/posts.tsx**

```tsx
import { fetcher } from '../lib/api';
import PostCard from '../components/PostCard';
import React from 'react';

export default function PostsPage() {
  const [posts, setPosts] = React.useState([]);
  React.useEffect(() => {
    fetcher('/api/posts').then(setPosts);
  }, []);

  return (
    <div>
      {posts.map((p: any) => <PostCard key={p.id} {...p} />)}
    </div>
  );
}
```

### **App Router – app/posts/page.tsx**

```tsx
import { prisma } from '../../lib/prisma';
import PostCard from '../../components/PostCard';

export default async function PostsPage() {
  const posts = await prisma.post.findMany();
  return (
    <div>
      {posts.map(p => <PostCard key={p.id} {...p} />)}
    </div>
  );
}
```

**Giải thích:**

* Page Router fetch API route → client-side rendering
* App Router fetch trực tiếp DB → server-side rendering
* Typing Prisma đảm bảo data consistency

---

## ✅ Common Pitfalls

| Pitfall                  | Note / Solution                      |
| ------------------------ | ------------------------------------ |
| Folder structure lộn xộn | Tách rõ `/pages` & `/app`            |
| DB connection leak       | Dùng singleton Prisma client         |
| Component duplication    | Dùng `/components` shared folder     |
| fetch data type unsafe   | Sử dụng typed fetcher + Prisma types |

---

[<< Ngày 23](./Day23.md) | [Ngày 25 >>](./Day25.md)

