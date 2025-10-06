# 🟩 Day 18: Caching & ISR

## **Mục tiêu học**

Sau ngày này, bạn sẽ:

1. Hiểu các cơ chế caching trong Next.js (SSR, SSG, ISR).
2. Triển khai **Incremental Static Regeneration (ISR)** cho cả Page Router & App Router.
3. Sử dụng `stale-while-revalidate` để cải thiện performance và user experience.
4. Quản lý cache headers, CDN caching, và data freshness trong enterprise app.
5. Kết hợp caching với dynamic route & i18n.

---

## **TL;DR**

* ISR = Static generation + tự động rebuild theo interval → giữ page luôn cập nhật.
* `stale-while-revalidate` → trả page cũ nhanh, đồng thời fetch mới backend.
* Caching headers + CDN → giảm TTFB, cải thiện performance.
* Page Router vs App Router đều hỗ trợ ISR; App Router native hơn.

---

## **1️⃣ Lý thuyết chi tiết**

### **1.1 Incremental Static Regeneration (ISR)**

**Page Router:**

```ts
// pages/posts.tsx
export async function getStaticProps() {
  const posts = await fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json());
  return {
    props: { posts },
    revalidate: 60, // rebuild page mỗi 60s
  };
}
```

**App Router:**

```ts
// app/posts/page.tsx
export const revalidate = 60; // ISR native

export default async function Page() {
  const posts = await fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json());
  return (
    <ul>
      {posts.map((post: any) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

**Giải thích:**

* `revalidate` → thời gian cache tĩnh, page sẽ rebuild sau interval.
* ISR giúp page nhanh, đồng thời cập nhật data định kỳ.

---

### **1.2 Stale-While-Revalidate**

* Cơ chế caching phổ biến cho SSR/SSG.
* Trả dữ liệu cũ ngay lập tức, fetch dữ liệu mới backend background.

```ts
export async function getServerSideProps() {
  const res = await fetch('https://api.example.com/posts', {
    headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=30' },
  });
  const posts = await res.json();
  return { props: { posts } };
}
```

* `s-maxage` → cache trên CDN.
* `stale-while-revalidate` → trả page cũ + rebuild background → user không phải chờ.

---

### **1.3 Caching Headers Enterprise**

* Sử dụng HTTP headers để quản lý cache:

| Header                 | Ý nghĩa                                   |
| ---------------------- | ----------------------------------------- |
| Cache-Control          | Kiểm soát browser & CDN caching           |
| s-maxage               | Cache trên CDN                            |
| stale-while-revalidate | Trả dữ liệu cũ ngay, fetch mới background |
| ETag / Last-Modified   | Conditional requests                      |

* Kết hợp ISR + cache headers → tối ưu page speed, reduce TTFB, SEO tốt.

---

## **2️⃣ Mini Real-World Example**

**Scenario:** Trang danh sách bài viết:

1. Fetch posts từ API.
2. ISR 60s, stale-while-revalidate 30s.
3. Prefetch link bài viết khi hover.

**App Router Solution:**

```ts
// app/posts/page.tsx
export const revalidate = 60;

export default async function Page() {
  const posts = await fetch('https://jsonplaceholder.typicode.com/posts', {
    next: { revalidate: 60 },
  }).then(res => res.json());

  return (
    <ul>
      {posts.map((post: any) => (
        <li key={post.id}>
          <a href={`/posts/${post.id}`}>{post.title}</a>
        </li>
      ))}
    </ul>
  );
}
```

* `next: { revalidate: 60 }` → App Router ISR native.

**Page Router Solution:** dùng `getStaticProps` + `revalidate`.

---

## **3️⃣ Common Pitfalls & Notes**

| Pitfall                            | Note / Solution                             |
| ---------------------------------- | ------------------------------------------- |
| ISR quá ngắn                       | Build server quá tải, chọn interval phù hợp |
| Không set s-maxage                 | CDN không cache, giảm performance           |
| Fetch API không handle errors      | ISR crash khi backend fail, cần try/catch   |
| SSR + stale-while-revalidate trùng | Kiểm tra headers, tránh conflict            |

---

## **4️⃣ Further Reading / References**

* [Next.js ISR Docs](https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration)
* [Stale-While-Revalidate RFC](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
* [Next.js Cache-Control](https://nextjs.org/docs/api-reference/next/headers)

---

# **Day 18: Caching & ISR – Giải bài tập**

## **Level 1: Basic ISR Page**

**Đề:** Tạo trang `/posts` fetch data từ API và rebuild page mỗi 60s (ISR).

### **Page Router – Giải**

```ts
// pages/posts.tsx
export async function getStaticProps() {
  const posts = await fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json());

  return {
    props: { posts },
    revalidate: 60, // ISR 60s
  };
}

export default function Posts({ posts }: { posts: any[] }) {
  return (
    <ul>
      {posts.slice(0, 5).map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### **App Router – Giải**

```ts
// app/posts/page.tsx
export const revalidate = 60;

export default async function Page() {
  const posts = await fetch('https://jsonplaceholder.typicode.com/posts', {
    next: { revalidate: 60 },
  }).then(res => res.json());

  return (
    <ul>
      {posts.slice(0, 5).map((post: any) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

**Giải thích:**

* `revalidate` → tự động rebuild page sau interval.
* ISR giảm TTFB, vẫn giữ data gần nhất.

---

## **Level 2: Stale-While-Revalidate**

**Đề:** Fetch dữ liệu SSR + cache header `stale-while-revalidate`.

### **Page Router – Giải**

```ts
// pages/posts-swrr.tsx
export async function getServerSideProps() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    headers: {
      'Cache-Control': 's-maxage=60, stale-while-revalidate=30',
    },
  });
  const posts = await res.json();

  return { props: { posts } };
}

export default function PostsSW({ posts }: { posts: any[] }) {
  return (
    <ul>
      {posts.slice(0, 5).map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### **App Router – Giải**

```ts
// app/posts-swrr/page.tsx
export default async function Page() {
  const posts = await fetch('https://jsonplaceholder.typicode.com/posts', {
    next: { revalidate: 60, tags: ['posts'] },
  }).then(res => res.json());

  return (
    <ul>
      {posts.slice(0, 5).map((post: any) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

**Giải thích:**

* `s-maxage` → cache trên CDN.
* `stale-while-revalidate` → trả page cũ + fetch mới background.
* App Router native `revalidate` + `tags` → caching & ISR hiệu quả.

---

## **Level 3: Prefetch & ISR Combined**

**Đề:** Trang `/posts` với:

1. ISR (revalidate 60s).
2. Prefetch link khi hover.
3. Lazy load ảnh trong bài viết.

### **Page Router – Giải**

```tsx
// pages/posts-prefetch.tsx
import Link from 'next/link';
import Image from 'next/image';

export async function getStaticProps() {
  const posts = await fetch('https://jsonplaceholder.typicode.com/photos').then(res => res.json());
  return { props: { posts: posts.slice(0, 5) }, revalidate: 60 };
}

export default function PostsPrefetch({ posts }: { posts: any[] }) {
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          <Link href={`/posts/${post.id}`} prefetch={true}>
            <Image src={post.thumbnailUrl} alt={post.title} width={100} height={100} />
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
// app/posts-prefetch/page.tsx
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60;

export default async function Page() {
  const posts = await fetch('https://jsonplaceholder.typicode.com/photos', {
    next: { revalidate: 60 },
  }).then(res => res.json());

  return (
    <ul>
      {posts.slice(0, 5).map((post: any) => (
        <li key={post.id}>
          <Link href={`/posts/${post.id}`} prefetch={true}>
            <Image src={post.thumbnailUrl} alt={post.title} width={100} height={100} />
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
```

**Giải thích:**

* Kết hợp ISR + prefetch + lazy load image → tối ưu UX + performance.
* Page Router & App Router đều có pattern tương tự, App Router dễ quản lý ISR native.

---

## ✅ Common Pitfalls

1. ISR quá ngắn → build server quá tải.
2. Quên `s-maxage` → CDN không cache.
3. Fetch API không handle lỗi → ISR crash.
4. Prefetch URL ngoại → DNS lookup chậm.

---

[<< Ngày 17](./Day17.md) | [Ngày 19 >>](./Day19.md)