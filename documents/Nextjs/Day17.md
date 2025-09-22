# 🟩 Day 17: Advanced Routing

## **Mục tiêu học**

Sau ngày này, bạn sẽ:

1. Hiểu các kỹ thuật routing nâng cao trong Next.js.
2. Triển khai **rewrite, redirect, dynamic route protection**.
3. So sánh cách Page Router & App Router xử lý advanced routing.
4. Áp dụng routing patterns enterprise: SEO-friendly, i18n, access control.
5. Kết hợp routing với middleware, auth checks, và SSR/SSG.

---

## **TL;DR**

* Next.js Page Router: `next.config.js` + `pages` folder → redirect, rewrite.
* App Router: `app` folder + `route.ts` + `redirect/notFound()` → dynamic route handling.
* Dynamic route protection: chỉ cho phép user hợp lệ truy cập page.
* Enterprise pattern: kết hợp middleware + role-based access control, SEO-friendly URLs, canonical links.

---

## **1️⃣ Lý thuyết chi tiết**

### **1.1 Redirect & Rewrite**

**Page Router – next.config.js**

```ts
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true, // 301
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/about-us',
        destination: '/company/about',
      },
    ];
  },
};
```

* **Redirect:** chuyển hướng URL → SEO-friendly.
* **Rewrite:** URL hiển thị khác với route thực tế → flexible routing.

---

**App Router – route.ts hoặc page.tsx**

```ts
import { redirect } from 'next/navigation';

export default function Page() {
  const isLoggedIn = false;
  if (!isLoggedIn) redirect('/login'); // dynamic redirect
  return <h1>Dashboard</h1>;
}
```

* `redirect()` → chỉ định URL mới server-side.
* `notFound()` → render 404 dynamic.

---

### **1.2 Dynamic Route Protection**

* Chỉ cho phép user hợp lệ truy cập các route quan trọng.

**Middleware (cả Page & App Router)**

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken');
  if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}
```

* Middleware chạy trước route → bảo vệ dynamic pages.

---

### **1.3 Nested & Catch-All Routes**

**Page Router**

```ts
// pages/blog/[...slug].tsx
import { useRouter } from 'next/router';

export default function BlogSlug() {
  const router = useRouter();
  const { slug } = router.query; // slug: string[]
  return <div>Path: {slug?.join('/')}</div>;
}
```

**App Router**

```ts
// app/blog/[...slug]/page.tsx
import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams();
  return <div>Path: {params.slug?.join('/')}</div>;
}
```

* Catch-all route `[...slug]` → support nested dynamic pages.

---

### **1.4 SEO & Canonical for Dynamic Routes**

```ts
// App Router example: generateMetadata
export async function generateMetadata({ params }) {
  return {
    title: `Blog - ${params.slug?.join('/')}`,
    alternates: { canonical: `/blog/${params.slug?.join('/')}` },
  };
}
```

* Dynamic title & canonical → SEO chuẩn.

---

## **2️⃣ Mini Real-World Examples**

1. `/dashboard` → protected route → redirect to `/login` nếu không có token.
2. `/blog/[...slug]` → nested dynamic blog pages.
3. Rewrites: `/about-us` → `/company/about`.
4. Redirects: `/old-path` → `/new-path` (301).

---

## **3️⃣ Common Pitfalls & Notes**

| Pitfall                         | Note / Solution                        |
| ------------------------------- | -------------------------------------- |
| Không bảo vệ dynamic routes     | Dùng middleware + redirect server-side |
| Hard-coded redirects            | Dùng config hoặc env variables         |
| SEO bị duplicate content        | Luôn thêm canonical & alternates       |
| Catch-all route quá chung chung | Validate slug, tránh conflict          |
| Middleware chạy quá nặng        | Chỉ check những route cần thiết        |

---

## **4️⃣ Further Reading / References**

* [Next.js Routing Docs](https://nextjs.org/docs/routing/introduction)
* [Next.js Middleware](https://nextjs.org/docs/middleware)
* [Redirect & Rewrites](https://nextjs.org/docs/pages/building-your-application/rewrites-and-redirects)
* [Dynamic Routes & Catch-All](https://nextjs.org/docs/routing/dynamic-routes)

---


# **Day 17: Advanced Routing – Giải bài tập**

## **Level 1: Simple Redirect**

**Đề:** Tạo route `/old-path` redirect đến `/new-path`.

### **Page Router – Giải**

```ts
// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true, // 301
      },
    ];
  },
};
```

**Giải thích:**

* Redirect server-side → SEO-friendly.
* `permanent: true` → 301, `false` → 302 temporary.

---

### **App Router – Giải**

```ts
// app/old-path/page.tsx
import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/new-path');
}
```

* `redirect()` → dynamic server-side redirect.

---

## **Level 2: Protected Dynamic Route**

**Đề:** Tạo `/dashboard` chỉ cho user đăng nhập mới truy cập.

### **Middleware (cả Page + App Router)**

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken');
  if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}
```

**Page Router – Giải**

```tsx
// pages/dashboard.tsx
export default function Dashboard() {
  return <h1>Welcome to Dashboard</h1>;
}
```

**App Router – Giải**

```tsx
// app/dashboard/page.tsx
export default function Page() {
  return <h1>Welcome to Dashboard</h1>;
}
```

**Giải thích:**

* Middleware chạy trước page → bảo vệ route.
* App Router + Page Router đều dùng chung middleware pattern.

---

## **Level 3: Catch-All Nested Route**

**Đề:** Tạo blog route `/blog/[...slug]` hiển thị path đầy đủ.

### **Page Router – Giải**

```tsx
// pages/blog/[...slug].tsx
import { useRouter } from 'next/router';

export default function BlogSlug() {
  const router = useRouter();
  const { slug } = router.query; // slug: string[]
  return <div>Full Path: {slug?.join('/')}</div>;
}
```

### **App Router – Giải**

```tsx
// app/blog/[...slug]/page.tsx
import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams();
  return <div>Full Path: {params.slug?.join('/')}</div>;
}
```

**Giải thích:**

* `[...slug]` → catch-all route.
* Hỗ trợ nested pages, SEO-friendly, dynamic route rendering.

---

## ✅ Common Pitfalls

1. Quên middleware → dynamic routes không bảo vệ.
2. Hard-coded redirect URL → khó maintain, nên dùng env vars.
3. Catch-all route quá chung → dễ conflict với các page khác.
4. Không canonical URL → SEO kém.

---

[<< Ngày 16](./Day16.md) | [Ngày 18 >>](./Day18.md)

