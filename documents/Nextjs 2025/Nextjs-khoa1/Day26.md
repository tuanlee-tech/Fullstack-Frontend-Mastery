# 🟩 Day 26: Feature Implementation 2 – Dynamic Pages & Client-Side Integration

## **Mục tiêu học**

Sau ngày này, bạn sẽ:

1. Tạo **dynamic routes** cho posts, users hoặc products.
2. Fetch dữ liệu **client-side** với SWR / React Query.
3. Kết hợp **server-side + client-side fetching** trong Page Router & App Router.
4. Triển khai **type-safe API response** và error handling.
5. Áp dụng enterprise pattern: caching, loading states, fallback UI.

---

## **TL;DR**

* Dynamic routes `[id]` Page Router / `[id]/page.tsx` App Router.
* SWR / React Query giúp **client-side data fetching** với cache + revalidation.
* Server components trong App Router fetch DB trực tiếp → SSR / ISR tối ưu.
* Typing Prisma + Zod → đảm bảo type-safe và validation.

---

## **1️⃣ Dynamic Routes – Page Router**

**pages/posts/\[id].tsx**

```tsx
import { GetServerSideProps } from 'next';
import { prisma } from '../../lib/prisma';
import PostCard from '../../components/PostCard';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = Number(context.params?.id);
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) return { notFound: true };
  return { props: { post } };
};

export default function PostPage({ post }: any) {
  return <PostCard {...post} />;
}
```

**Giải thích:**

* Server-side render từng post bằng `[id]`.
* NotFound handling chuẩn enterprise.

---

## **2️⃣ Dynamic Routes – App Router**

**app/posts/\[id]/page.tsx**

```tsx
import { prisma } from '../../../lib/prisma';
import PostCard from '../../../components/PostCard';

interface PageProps { params: { id: string } }

export default async function Page({ params }: PageProps) {
  const post = await prisma.post.findUnique({ where: { id: Number(params.id) } });
  if (!post) return <div>Post not found</div>;
  return <PostCard {...post} />;
}
```

**Giải thích:**

* Server component fetch DB trực tiếp → SSR / ISR.
* Fallback UI nếu post không tồn tại.

---

## **3️⃣ Client-Side Data Fetching (SWR)**

**Example: fetch list of posts dynamically**

```tsx
import useSWR from 'swr';
import { fetcher } from '../../lib/api';
import PostCard from '../../components/PostCard';

export default function PostsList() {
  const { data, error } = useSWR('/api/posts', fetcher);

  if (error) return <div>Failed to load posts</div>;
  if (!data) return <div>Loading...</div>;

  return <div>{data.map((p: any) => <PostCard key={p.id} {...p} />)}</div>;
}
```

**Giải thích:**

* SWR cache + revalidation tự động → enterprise-friendly
* Loading / error state chuẩn UX

---

## **4️⃣ Mini Real-World Example**

* Page Router: `/posts/[id]` → SSR từng post
* App Router: `/app/posts/[id]` → Server Component fetch trực tiếp DB
* SWR: client-side fetch list of posts, auto revalidate

```tsx
// app/posts/page.tsx (Server Component)
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

## **5️⃣ Common Pitfalls**

| Pitfall                    | Note / Solution                |
| -------------------------- | ------------------------------ |
| Missing dynamic param type | Always parse Number(params.id) |
| Client fetch data null     | Handle loading/error states    |
| Fallback UI thiếu          | Always provide 404 / not found |
| Over-fetching              | SWR cache + revalidation       |

---

## **6️⃣ Further Reading**

* [Next.js Dynamic Routes](https://nextjs.org/docs/routing/dynamic-routes)
* [SWR Docs](https://swr.vercel.app/)
* [Prisma Docs](https://www.prisma.io/docs/)

---

# **Day 26: Feature Implementation 2 – Giải bài tập**

## **Level 1: Dynamic Route – Display Single Post**

**Đề:** Tạo trang dynamic route `[id]` hiển thị post theo ID với:

* Page Router: `getServerSideProps`
* App Router: server component

### **Giải – Page Router**

```ts
// pages/posts/[id].tsx
import { GetServerSideProps } from 'next';
import { prisma } from '../../lib/prisma';
import PostCard from '../../components/PostCard';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = Number(context.params?.id);
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) return { notFound: true };
  return { props: { post } };
};

export default function PostPage({ post }: any) {
  return <PostCard {...post} />;
}
```

### **Giải – App Router**

```ts
// app/posts/[id]/page.tsx
import { prisma } from '../../../lib/prisma';
import PostCard from '../../../components/PostCard';

interface PageProps { params: { id: string } }

export default async function Page({ params }: PageProps) {
  const post = await prisma.post.findUnique({ where: { id: Number(params.id) } });
  if (!post) return <div>Post not found</div>;
  return <PostCard {...post} />;
}
```

---

## **Level 2: Client-Side Fetch List of Posts (SWR)**

**Đề:** Fetch posts list bằng SWR, hiển thị loading & error states.

```tsx
// components/PostsList.tsx
import useSWR from 'swr';
import { fetcher } from '../lib/api';
import PostCard from './PostCard';

export default function PostsList() {
  const { data, error } = useSWR('/api/posts', fetcher);

  if (error) return <div>Failed to load posts</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      {data.map((p: any) => <PostCard key={p.id} {...p} />)}
    </div>
  );
}
```

**Test:**

* GET `/api/posts`
* Kiểm tra loading & error UI

---

## **Level 3: Dynamic Page + Client Fetch Integration**

**Đề:** Kết hợp server-side fetch single post + client-side fetch related posts.

```tsx
// pages/posts/[id].tsx
import { GetServerSideProps } from 'next';
import { prisma } from '../../lib/prisma';
import PostCard from '../../components/PostCard';
import useSWR from 'swr';
import { fetcher } from '../../lib/api';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = Number(context.params?.id);
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return { notFound: true };
  return { props: { post } };
};

export default function PostPage({ post }: any) {
  const { data: related } = useSWR('/api/posts?related=true', fetcher);

  return (
    <div>
      <h1>Post Detail</h1>
      <PostCard {...post} />
      <h2>Related Posts</h2>
      {related?.map((p: any) => <PostCard key={p.id} {...p} />)}
    </div>
  );
}
```

**Giải thích:**

* Server-side fetch → nhanh, SEO-friendly
* Client-side fetch → dynamic, revalidate data

---

## ✅ Common Pitfalls

| Pitfall                   | Note / Solution               |
| ------------------------- | ----------------------------- |
| params.id không parse số  | Always Number(params.id)      |
| SWR data null / undefined | Handle loading/error UI       |
| Missing 404 fallback      | Return notFound / fallback UI |
| Overfetching              | Use SWR cache + revalidation  |

---

[<< Ngày 25](./Day25.md) | [Ngày 27 >>](./Day27.md)

