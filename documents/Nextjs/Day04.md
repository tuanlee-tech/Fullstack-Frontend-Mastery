# Day 4: Client-side Data Fetching (Page Router + App Router)

## Mục tiêu học

Sau ngày học này, bạn sẽ:

1. Hiểu cơ chế **client-side data fetching** trong Next.js.
2. Sử dụng **SWR** và **React Query** để fetch, cache và revalidate dữ liệu.
3. Tách fetch logic thành **service functions reusable**.
4. Xử lý loading, error, fallback UI.
5. Hiểu khi nào dùng **client fetch** thay vì SSR/SSG.
6. Viết code **production-ready**, typed, maintainable.

---

## TL;DR

* **Client-side fetching** dùng khi dữ liệu cần **tương tác realtime hoặc user-specific**.
* **SWR**: caching, revalidate on focus, incremental updates.
* **React Query**: mạnh hơn cho complex state, mutation, caching.
* Page Router + App Router đều có thể dùng.

---

## 1️⃣ Lý thuyết chi tiết

### 1.1 Sử dụng SWR

```bash
npm install swr
```

**Service function:** `services/posts.ts`

```ts
export type Post = { id: string; title: string };

export async function fetchPosts(): Promise<Post[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}
```

**Page Router / App Router Component:**

```tsx
import useSWR from 'swr';
import { fetchPosts, Post } from '../../services/posts';

export default function PostsClient() {
  const { data: posts, error, isLoading } = useSWR<Post[]>('posts', fetchPosts);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {posts?.map((p) => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}
```

---

### 1.2 React Query

```bash
npm install @tanstack/react-query
```

```tsx
import { useQuery } from '@tanstack/react-query';
import { fetchPosts, Post } from '../../services/posts';

export default function PostsRQ() {
  const { data: posts, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {posts?.map((p) => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}
```

**Note:** Trong App Router, component này có thể dùng **client component** bằng `use client`:

```tsx
'use client';
```

---

## 2️⃣ Bài tập

### Level 1

* **Đề:** Hiển thị danh sách người dùng từ `https://jsonplaceholder.typicode.com/users` dùng **SWR**.
* **Giải:**

```tsx
'use client';
import useSWR from 'swr';

type User = { id: string; name: string };
const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users?_limit=5');
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export default function UsersSWR() {
  const { data, error, isLoading } = useSWR<User[]>('users', fetchUsers);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <ul>{data?.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

---

### Level 2

* **Đề:** Thêm **refresh button** để refetch dữ liệu SWR khi click.
* **Giải:**

```tsx
'use client';
import useSWR from 'swr';
import { fetchUsers, User } from '../../services/users';

export default function UsersWithRefresh() {
  const { data, error, isLoading, mutate } = useSWR<User[]>('users', fetchUsers);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <button onClick={() => mutate()}>Refresh</button>
      <ul>{data?.map(u => <li key={u.id}>{u.name}</li>)}</ul>
    </div>
  );
}
```

---

### Level 3

* **Đề:** Sử dụng **React Query** với mutation: tạo form thêm người dùng (mock API) và update danh sách.
* **Giải:**

```tsx
'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, User } from '../../services/users';

export default function UsersRQMutation() {
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery<User[], Error>({ queryKey: ['users'], queryFn: fetchUsers });

  const mutation = useMutation({
    mutationFn: async (name: string) => {
      await new Promise((res) => setTimeout(res, 500)); // mock API
      return { id: Date.now().toString(), name };
    },
    onSuccess: () => queryClient.invalidateQueries(['users']),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <button onClick={() => mutation.mutate('Người dùng mới')}>Thêm người dùng</button>
      <ul>{data?.map(u => <li key={u.id}>{u.name}</li>)}</ul>
    </div>
  );
}
```

---

## 3️⃣ Common Pitfalls

* Quên `use client` trong App Router → hooks lỗi runtime.
* Refetch quá nhiều → API throttling, performance.
* Không handle error/fallback UI → UX kém.

---

## 4️⃣ Performance / Security Notes

* Sử dụng **stale-while-revalidate** (SWR default) → cải thiện UX.
* React Query caching giúp giảm request thừa.
* Không expose sensitive API key client-side.

---

## 5️⃣ Further Reading

* [SWR Docs](https://swr.vercel.app/)
* [React Query Docs](https://tanstack.com/query/latest)
* [App Router: Client Component](https://nextjs.org/docs/app/building-your-application/rendering/server-and-client-components)

---

[<< Ngày 3](./Day03.md) | [Ngày 5 >>](./Day05.md)
