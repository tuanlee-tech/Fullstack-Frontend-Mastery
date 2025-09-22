Tuyệt! Dưới đây là **Day 27: Feature Implementation 3** – bài giảng chi tiết + giải bài tập Level 1 → 3, production-ready, song song **Page Router + App Router**.

---

# 🟩 Day 27: Feature Implementation 3 – State Management, Caching & Performance

## **Mục tiêu học**

Sau ngày này, bạn sẽ:

1. Triển khai **state management** với **Zustand / Redux Toolkit / Jotai**.
2. Tối ưu **client-side caching** với SWR / React Query.
3. Áp dụng **performance tuning**: memoization, lazy loading, code splitting.
4. Triển khai enterprise pattern: shared state giữa SSR & CSR, server + client sync.
5. Hiểu cách tối ưu **Page Router + App Router** trong Next.js.

---

## **TL;DR**

* **State Management:** Zustand nhẹ, Redux Toolkit cho enterprise scale, Jotai cho atomic state.
* **Caching:** SWR / React Query → stale-while-revalidate, caching data tự động.
* **Performance:** memoization, lazy load, dynamic import, avoid re-renders unnecessary.
* **Page Router:** client + SSR sync state.
* **App Router:** server components + client components state share.

---

## **1️⃣ State Management – Zustand Example**

```ts
// store/usePostStore.ts
import { create } from 'zustand';

interface PostState {
  posts: any[];
  addPost: (post: any) => void;
  setPosts: (posts: any[]) => void;
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  addPost: (post) => set((state) => ({ posts: [...state.posts, post] })),
  setPosts: (posts) => set({ posts }),
}));
```

**Usage in component:**

```tsx
import { usePostStore } from '../store/usePostStore';
import PostCard from '../components/PostCard';

export default function PostsList() {
  const posts = usePostStore((state) => state.posts);

  return (
    <div>
      {posts.map((p) => <PostCard key={p.id} {...p} />)}
    </div>
  );
}
```

**Giải thích:**

* Zustand nhẹ, dễ share giữa Page & App Router
* Server-side fetch → hydrate store client-side

---

## **2️⃣ Client-Side Caching – SWR**

```tsx
import useSWR from 'swr';
import { fetcher } from '../lib/api';
import { usePostStore } from '../store/usePostStore';

export default function PostsList() {
  const { data, error } = useSWR('/api/posts', fetcher);
  const setPosts = usePostStore((state) => state.setPosts);

  if (data) setPosts(data);

  if (error) return <div>Error loading posts</div>;
  if (!data) return <div>Loading...</div>;

  return <div>{data.map((p) => <PostCard key={p.id} {...p} />)}</div>;
}
```

**Giải thích:**

* SWR tự động cache & revalidate → performance tốt
* Kết hợp với Zustand → state global client-side

---

## **3️⃣ Performance Tuning**

### **3.1 Memoization**

```tsx
import { memo } from 'react';

const PostCardMemo = memo(PostCard);
```

### **3.2 Lazy Loading Components**

```tsx
import dynamic from 'next/dynamic';

const PostCard = dynamic(() => import('../components/PostCard'), { ssr: false });
```

### **3.3 Code Splitting**

* Dynamic import modules
* Tối ưu bundle size
* Reduce initial JS payload

---

## **4️⃣ Mini Real-World Example**

* Page Router: client fetch posts + Zustand store + SWR cache
* App Router: server components fetch posts, client component updates Zustand store
* Performance: memoized PostCard + lazy load images / components

```tsx
// app/posts/page.tsx
import { prisma } from '../../lib/prisma';
import dynamic from 'next/dynamic';

const PostCard = dynamic(() => import('../../components/PostCard'));

export default async function PostsPage() {
  const posts = await prisma.post.findMany();
  return (
    <div>
      {posts.map((p) => <PostCard key={p.id} {...p} />)}
    </div>
  );
}
```

---

## ✅ Common Pitfalls

| Pitfall                             | Note / Solution                      |
| ----------------------------------- | ------------------------------------ |
| Re-render quá nhiều component       | Use memo, avoid inline functions     |
| Client-side state không sync server | Hydrate Zustand store from SSR props |
| SWR stale data lỗi                  | key unique + revalidateInterval      |
| Lazy loading / dynamic import sai   | check ssr: false nếu cần             |

---

## **5️⃣ Further Reading**

* [Zustand Docs](https://zustand-demo.pmnd.rs/)
* [Redux Toolkit](https://redux-toolkit.js.org/)
* [SWR Docs](https://swr.vercel.app/)
* [Next.js Performance Optimization](https://nextjs.org/docs/advanced-features/measuring-performance)

---

# **Day 27: Feature Implementation 3 – Giải bài tập**

## **Level 1: Zustand State – Basic Store**

**Đề:** Tạo store lưu posts, thêm post mới và đọc posts.

### **Giải**

```ts
// store/usePostStore.ts
import { create } from 'zustand';

interface PostState {
  posts: any[];
  addPost: (post: any) => void;
  setPosts: (posts: any[]) => void;
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  addPost: (post) => set((state) => ({ posts: [...state.posts, post] })),
  setPosts: (posts) => set({ posts }),
}));
```

**Test:**

```tsx
import { usePostStore } from '../store/usePostStore';
const posts = usePostStore(state => state.posts);
const addPost = usePostStore(state => state.addPost);
addPost({ id: 1, title: 'Hello', content: 'World' });
console.log(posts);
```

---

## **Level 2: Client-Side Caching – SWR Integration**

**Đề:** Fetch posts list từ `/api/posts` dùng SWR, lưu vào Zustand store, xử lý loading/error state.

### **Giải**

```tsx
import useSWR from 'swr';
import { fetcher } from '../lib/api';
import { usePostStore } from '../store/usePostStore';
import PostCard from '../components/PostCard';

export default function PostsList() {
  const { data, error } = useSWR('/api/posts', fetcher);
  const setPosts = usePostStore((state) => state.setPosts);

  if (data) setPosts(data);

  if (error) return <div>Error loading posts</div>;
  if (!data) return <div>Loading...</div>;

  return <div>{data.map((p) => <PostCard key={p.id} {...p} />)}</div>;
}
```

**Giải thích:**

* SWR tự cache, revalidate dữ liệu
* Zustand giữ state toàn cục client-side

---

## **Level 3: Performance Optimization – Memoization & Lazy Loading**

**Đề:** Tối ưu PostCard component bằng memo + lazy load.

### **Giải**

```tsx
import { memo } from 'react';
import dynamic from 'next/dynamic';

const PostCard = dynamic(() => import('../components/PostCard'), { ssr: false });

const PostCardMemo = memo(PostCard);

export default function OptimizedPosts({ posts }: { posts: any[] }) {
  return (
    <div>
      {posts.map((p) => <PostCardMemo key={p.id} {...p} />)}
    </div>
  );
}
```

**Giải thích:**

* `memo` tránh re-render không cần thiết
* `dynamic` lazy load component, giảm initial JS bundle
* Áp dụng cho Page Router & App Router

---

## ✅ Common Pitfalls

| Pitfall                       | Note / Solution                    |
| ----------------------------- | ---------------------------------- |
| Re-render quá nhiều component | Dùng memo + avoid inline functions |
| Zustand state không sync SSR  | Hydrate store từ props server-side |
| SWR stale data                | Revalidate interval + unique key   |
| Dynamic import SSR sai        | ssr: false khi cần                 |

---

[<< Ngày 26](./Day26.md) | [Ngày 28 >>](./Day28.md)

