# Day 3: Data Fetching cơ bản (Page Router + App Router)

## Mục tiêu học

Sau ngày học này, bạn sẽ:

1. Hiểu cơ chế **data fetching** trong Next.js: SSG (`getStaticProps`), SSR (`getServerSideProps`) và SSG dynamic (`getStaticPaths`).
2. Áp dụng **fetch dữ liệu server-side** trong App Router (Server Components).
3. Tách logic fetch dữ liệu vào **service functions** reusable.
4. Hiểu khi nào dùng **Page Router vs App Router** trong enterprise.
5. Viết code **production-ready**, có type safety (TypeScript).

---

## TL;DR

* **Page Router**: `getStaticProps`, `getServerSideProps`, `getStaticPaths`.
* **App Router**: Server Components có thể fetch trực tiếp, `generateStaticParams`.
* **Best practice**: Tách fetch logic ra service file, typed response, handle errors.

---

## 1️⃣ Lý thuyết chi tiết

### 1.1 Page Router: Static Generation (SSG)

```tsx
// pages/posts.tsx
import { GetStaticProps } from 'next';

type Post = { id: string; title: string };

export default function Posts({ posts }: { posts: Post[] }) {
  return (
    <ul>
      {posts.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
  const posts: Post[] = await res.json();

  return { props: { posts }, revalidate: 10 }; // ISR
};
```

### 1.2 Page Router: Server-Side Rendering (SSR)

```tsx
// pages/posts-ssr.tsx
import { GetServerSideProps } from 'next';

export default function PostsSSR({ posts }: { posts: { id: string; title: string }[] }) {
  return <ul>{posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
  const posts = await res.json();
  return { props: { posts } };
};
```

### 1.3 Page Router: Dynamic SSG (`getStaticPaths`)

```tsx
// pages/posts/[id].tsx
import { GetStaticPaths, GetStaticProps } from 'next';

type Post = { id: string; title: string };

export default function PostDetail({ post }: { post: Post }) {
  return <h1>{post.title}</h1>;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
  const posts: Post[] = await res.json();

  const paths = posts.map((p) => ({ params: { id: p.id.toString() } }));

  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${params?.id}`);
  const post: Post = await res.json();

  return { props: { post }, revalidate: 10 };
};
```

---

### 1.4 App Router: Server Component + fetch

```tsx
// app/posts/page.tsx
type Post = { id: string; title: string };

async function getPosts(): Promise<Post[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5', { next: { revalidate: 10 } });
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();
  return (
    <ul>
      {posts.map((p) => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}
```

```tsx
// app/posts/[id]/page.tsx
type Post = { id: string; title: string };

async function getPost(id: string): Promise<Post> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  return res.json();
}

interface PostPageProps {
  params: { id: string };
}

export default async function PostDetail({ params }: PostPageProps) {
  const post = await getPost(params.id);
  return <h1>{post.title}</h1>;
}
```

---

## 2️⃣ Bài tập

### Level 1

* **Đề:** Fetch danh sách 5 người dùng từ `https://jsonplaceholder.typicode.com/users` và hiển thị `name`.
* **Giải:**

**Page Router:** `pages/users.tsx`

```tsx
import { GetStaticProps } from 'next';

type User = { id: string; name: string };

export default function Users({ users }: { users: User[] }) {
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users?_limit=5');
  const users: User[] = await res.json();
  return { props: { users } };
};
```

**App Router:** `app/users/page.tsx`

```tsx
type User = { id: string; name: string };

async function getUsers(): Promise<User[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/users?_limit=5');
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

---

### Level 2

* **Đề:** Tạo dynamic route `/users/[id]` hiển thị thông tin chi tiết người dùng (`name`, `email`).
* **Giải:**

**Page Router:** `pages/users/[id].tsx` với `getStaticPaths` + `getStaticProps`.
**App Router:** `app/users/[id]/page.tsx` fetch trực tiếp trong server component.

---

### Level 3

* **Đề:** Implement **ISR**: tự động cập nhật dữ liệu mỗi 10 giây, hiển thị “Last updated at …”.
* **Giải:**

  * Page Router: `revalidate: 10` trong `getStaticProps`
  * App Router: `{ next: { revalidate: 10 } }` trong fetch options

---

## 3️⃣ Common Pitfalls

* Không handle error fetch → crash page.
* Dùng `useEffect` cho data fetch SSR → mất SSR benefit.
* Quên `fallback` trong `getStaticPaths` → lỗi 404.

---

## 4️⃣ Performance / Security Notes

* Limit fetch size (`?_limit=5`) → giảm build time.
* Validate API response type → tránh runtime error.
* Không cache dữ liệu nhạy cảm trên client.

---

## 5️⃣ Further Reading

* [Next.js Data Fetching](https://nextjs.org/docs/basic-features/data-fetching)
* [App Router & Server Components](https://nextjs.org/docs/app/building-your-application/data-fetching)
* [ISR Explained](https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration)

---

[<< Ngày 2](./Day02.md) | [Ngày 4 >>](./Day04.md)