# 🟩 Day 16: Performance Optimization

## **Mục tiêu học**

Sau ngày này, bạn sẽ:

1. Hiểu cách tối ưu hiệu suất Next.js cho Page Router & App Router.
2. Biết áp dụng **dynamic import** và code splitting.
3. Sử dụng `next/image`, lazy loading, caching, prefetch để cải thiện UX.
4. Triển khai **ISR** (Incremental Static Regeneration) & static generation hợp lý.
5. Áp dụng **enterprise pattern**: đo performance, monitor, lazy-load modules nặng.

---

## **TL;DR**

* Lazy load component nặng với `dynamic import`.
* Tối ưu hình ảnh & static assets với `next/image` + blur placeholder.
* ISR / SSG để tăng tốc page load, đồng thời đảm bảo data up-to-date.
* Prefetch link → preload page khi hover → cải thiện UX.
* Code splitting, Suspense → giảm bundle size.

---

## **1️⃣ Lý thuyết chi tiết**

### **1.1 Dynamic Import / Lazy Loading**

* Giúp **tách bundle** → giảm initial load time.
* Chỉ load module khi cần thiết (e.g., chart, map, heavy component).

```ts
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('../components/HeavyComponent'), {
  ssr: false, // render chỉ trên client
});
```

* `Suspense` + fallback giúp user thấy UI ngay cả khi component chưa load.

---

### **1.2 Image & Asset Optimization**

* Next.js cung cấp `next/image` tự động lazy load, resize, WebP conversion.
* Tối ưu LCP và layout shift.

```tsx
import Image from 'next/image';

<Image
  src="/images/photo.jpg"
  alt="Sample"
  width={600}
  height={400}
  placeholder="blur"
  blurDataURL="/images/placeholder.png"
/>
```

* `placeholder="blur"` → UX tốt hơn khi ảnh load chậm.

---

### **1.3 Incremental Static Regeneration (ISR)**

* Static generation + tự động rebuild theo interval.
* Tối ưu cho page ít thay đổi nhưng cần update.

**Page Router:**

```ts
export async function getStaticProps() {
  const posts = await fetch('https://api.example.com/posts').then(res => res.json());
  return { props: { posts }, revalidate: 60 }; // rebuild every 60s
}
```

**App Router:**

```ts
export const revalidate = 60;

export default async function Page() {
  const posts = await fetch('https://api.example.com/posts').then(res => res.json());
  return <PostsList posts={posts} />;
}
```

---

### **1.4 Prefetching Links**

* Link prefetch khi hover → cải thiện UX → giảm FCP.

```tsx
import Link from 'next/link';

<Link href="/posts/1" prefetch={true}>Post 1</Link>
```

* App Router tự động prefetch mọi internal link.

---

### **1.5 React Suspense & Code Splitting**

* Suspense kết hợp lazy load giúp giảm bundle size cho các module nặng.
* Cân nhắc: quá nhiều lazy load → FID tăng.

```tsx
import { Suspense } from 'react';

<Suspense fallback={<div>Loading...</div>}>
  <HeavyComponent />
</Suspense>
```

---

## **2️⃣ Mini Real-World Example**

* **Scenario:** Trang gallery hiển thị ảnh lớn + chart component.
* **Optimization:**

  1. `next/image` với placeholder.
  2. Chart lazy load.
  3. ISR để update gallery mới.
  4. Prefetch link bài viết liên quan.

---

## **3️⃣ Common Pitfalls & Notes**

| Pitfall                      | Note / Solution                                      |
| ---------------------------- | ---------------------------------------------------- |
| Lazy load quá nhiều          | Tăng FID → chỉ lazy component nặng                   |
| Không optimize hình ảnh      | CLS/LCP thấp → dùng `next/image`, fixed width/height |
| Prefetch URL ngoại           | DNS lookup chậm → chỉ prefetch internal links        |
| ISR interval quá ngắn        | Build server quá tải → chọn phù hợp theo traffic     |
| Client-side render quá nhiều | SSR + SSG khi cần để giảm TTFB                       |

---

## **4️⃣ Further Reading / References**

* [Next.js Performance Docs](https://nextjs.org/docs/advanced-features/measuring-performance)
* [Next.js Image Component](https://nextjs.org/docs/api-reference/next/image)
* [React Lazy & Suspense](https://react.dev/learn/code-splitting)
* [ISR & SSG Patterns](https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration)

---
# **Day 16: Performance Optimization – Giải bài tập**

## **Level 1: Lazy Load Component**

**Đề:** Tạo một component nặng (`HeavyComponent`) và load lazy bằng `dynamic` import.

### **Page Router – Giải**

```tsx
// pages/index.tsx
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const HeavyComponent = dynamic(() => import('../components/HeavyComponent'), { ssr: false });

export default function Home() {
  return (
    <div>
      <h1>Homepage</h1>
      <Suspense fallback={<p>Loading heavy component...</p>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}
```

**HeavyComponent.tsx**

```tsx
export default function HeavyComponent() {
  return <div>🚀 I am heavy!</div>;
}
```

**Giải thích:**

* `dynamic` import → tách bundle, giảm initial load.
* `ssr: false` → chỉ render trên client.
* `Suspense fallback` → hiển thị UI ngay khi component chưa load xong.

---

### **App Router – Giải**

```tsx
// app/page.tsx
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const HeavyComponent = dynamic(() => import('../components/HeavyComponent'), { ssr: false });

export default function Page() {
  return (
    <div>
      <h1>App Router Homepage</h1>
      <Suspense fallback={<p>Loading heavy component...</p>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}
```

---

## **Level 2: Image & Static Asset Optimization**

**Đề:** Sử dụng `next/image` để lazy load và optimize hình ảnh.

### **Page Router & App Router – Giải**

```tsx
import Image from 'next/image';

export default function Gallery() {
  return (
    <div>
      <h2>Gallery</h2>
      <Image
        src="/images/photo1.jpg"
        alt="Photo 1"
        width={600}
        height={400}
        placeholder="blur"
        blurDataURL="/images/placeholder.png"
      />
    </div>
  );
}
```

**Giải thích:**

* `next/image` tự động lazy load, resize, WebP conversion.
* `placeholder="blur"` → UX tốt hơn khi ảnh load chậm.
* Kích thước cố định → tránh layout shift → cải thiện LCP.

---

## **Level 3: Prefetch & ISR (Incremental Static Regeneration)**

**Đề:** Tạo trang danh sách bài viết:

* SSG với ISR → revalidate mỗi 60s.
* Prefetch links bài viết khi hover.

### **Page Router – Giải**

```tsx
// pages/posts.tsx
import Link from 'next/link';

export async function getStaticProps() {
  const posts = await fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json());
  return { props: { posts }, revalidate: 60 }; // ISR 60s
}

export default function Posts({ posts }: { posts: any[] }) {
  return (
    <ul>
      {posts.slice(0, 5).map(post => (
        <li key={post.id}>
          <Link href={`/posts/${post.id}`} prefetch={true}>
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
```

### **App Router – Giải**

```tsx
// app/posts/page.tsx
import Link from 'next/link';

export const revalidate = 60; // ISR

export default async function Page() {
  const posts = await fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json());

  return (
    <ul>
      {posts.slice(0, 5).map((post: any) => (
        <li key={post.id}>
          <Link href={`/posts/${post.id}`} prefetch={true}>
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
```

**Giải thích:**

* `revalidate` → tự động rebuild page theo interval.
* Prefetch link → preload page khi hover → cải thiện UX.
* App Router: ISR native bằng export `revalidate`.

---


[<< Ngày 15](./Day15.md) | [Ngày 17 >>](./Day17.md)

