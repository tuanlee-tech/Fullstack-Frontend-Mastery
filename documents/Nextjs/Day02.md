# Day 2: Routing nâng cao & Dynamic Routes (Page + App Router)

## Mục tiêu học

Sau ngày học này, bạn sẽ:

1. Hiểu cơ chế **dynamic routes** `[param]` và **catch-all routes** `[[...slug]]` trong cả Page Router & App Router.
2. Sử dụng nested routes và `<Link>` navigation chuẩn SPA.
3. Áp dụng **route protection** với redirect condition.
4. Tạo code routing maintainable, reusable, production-ready.
5. Hiểu khi nào dùng Page Router vs App Router trong dự án enterprise.

---

## TL;DR

* **Page Router**: `[param].tsx` → dynamic route, `[[...slug]].tsx` → catch-all.
* **App Router**: `[param]/page.tsx`, `[[...slug]]/page.tsx`.
* `<Link>` dùng cho SPA navigation, tránh reload toàn bộ.
* Route protection: redirect nếu user chưa login.

---

## 1️⃣ Lý thuyết chi tiết

### 1.1 Dynamic Routes

**Page Router**

```tsx
// pages/blog/[id].tsx
import { useRouter } from 'next/router';

export default function BlogPost() {
  const { id } = useRouter().query;
  return <h1>Bài viết số: {id}</h1>;
}
```

**App Router**

```tsx
// app/blog/[id]/page.tsx
interface BlogPageProps {
  params: { id: string };
}
export default function BlogPost({ params }: BlogPageProps) {
  return <h1>Bài viết số: {params.id}</h1>;
}
```

### 1.2 Catch-All Routes

**Page Router**

```tsx
// pages/docs/[[...slug]].tsx
import { useRouter } from 'next/router';

export default function DocsPage() {
  const { slug } = useRouter().query;
  return <div>Docs path: {JSON.stringify(slug)}</div>;
}
```

**App Router**

```tsx
// app/docs/[[...slug]]/page.tsx
interface DocsPageProps {
  params: { slug?: string[] };
}
export default function DocsPage({ params }: DocsPageProps) {
  return <div>Docs path: {JSON.stringify(params.slug)}</div>;
}
```

### 1.3 Nested Routes & Links

```tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/blog/1">Bài viết 1</Link>
      <Link href="/blog/2">Bài viết 2</Link>
    </div>
  );
}
```

---

### 1.4 Route Protection (Redirect)

**Page Router**

```tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Protected = () => {
  const router = useRouter();
  const isLoggedIn = false;

  useEffect(() => {
    if (!isLoggedIn) router.push('/login');
  }, [isLoggedIn, router]);

  return <div>Chỉ hiển thị khi login</div>;
};

export default Protected;
```

**App Router**

```tsx
import { redirect } from 'next/navigation';

export default function AdminPage() {
  const isLoggedIn = false;
  if (!isLoggedIn) redirect('/login');
  return <h1>Admin Dashboard</h1>;
}
```

---

## 2️⃣ Ví dụ Production-Ready

**Folder structure**

```plaintext
pages/
├─ blog/
│   ├─ index.tsx
│   └─ [id].tsx
app/
├─ blog/
│   ├─ page.tsx
│   └─ [id]/page.tsx
```

* `blog/index` → danh sách bài viết
* `blog/[id]` → chi tiết bài viết

---

## 3️⃣ Bài tập

### Level 1

* **Đề:** Tạo `/products` hiển thị 3 sản phẩm, mỗi sản phẩm link `/products/[id]`.
* **Giải:**

**Page Router**: `pages/products/index.tsx`

```tsx
import Link from 'next/link';
const products = [{id:'1',name:'A'},{id:'2',name:'B'},{id:'3',name:'C'}];
export default function Products() {
  return <ul>{products.map(p=> <li key={p.id}><Link href={`/products/${p.id}`}>{p.name}</Link></li>)}</ul>;
}
```

`pages/products/[id].tsx`

```tsx
import { useRouter } from 'next/router';
export default function ProductDetail() {
  const { id } = useRouter().query;
  return <h1>Chi tiết sản phẩm {id}</h1>;
}
```

**App Router**: `app/products/page.tsx` + `app/products/[id]/page.tsx` tương tự, dùng `params.id`.

---

### Level 2

* **Đề:** Tạo `/docs/[[...slug]]` hiển thị path array.
* **Giải:** `pages/docs/[[...slug]].tsx` + `app/docs/[[...slug]]/page.tsx` như ví dụ lý thuyết.

---

### Level 3

* **Đề:** Route `/admin` chỉ hiển thị nếu login, nếu không redirect `/login`.
* **Giải:** Page Router + App Router như **Route Protection** phần lý thuyết.

---

## 4️⃣ Common Pitfalls

* Quên dùng `<Link>` → reload toàn bộ page.
* Không handle undefined `router.query` trong dynamic/catch-all.
* Redirect trong Page Router cần `useEffect`, App Router dùng `redirect()` server-side.

---

## 5️⃣ Performance / Security Notes

* Dynamic routes quá sâu → ảnh hưởng build time.
* Redirect quá nhiều → SEO & UX bị ảnh hưởng.
* Validate query params → tránh XSS injection.

---

## 6️⃣ Further Reading

* [Next.js Routing](https://nextjs.org/docs/routing/introduction)
* [Dynamic Routes](https://nextjs.org/docs/routing/dynamic-routes)
* [App Router](https://nextjs.org/docs/app/building-your-application/routing)

---

[<< Ngày 1](./Day01.md) | [Ngày 3 >>](./Day03.md)

---

