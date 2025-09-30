Trong Next.js mới nhất (tính đến tháng 9/2025, phiên bản 15.x), việc sử dụng **Server Components** bọc **Client Components** để fetch API, hiển thị trạng thái loading, và triển khai infinite scroll (load more) có thể được thực hiện một cách hiệu quả nhờ các tính năng như async/await trong Server Components, React Suspense, và Server Actions. Dưới đây là hướng dẫn chi tiết và chuyên sâu, kèm ví dụ code và giải thích cách xử lý từng phần, bao gồm cả cách kết hợp với **TanStack Query** hoặc **Server Actions** cho infinite scroll.

---

## **1. Fetch API trong Server Component bọc Client Component**

### **Khái niệm**
- **Server Components**:
  - Cho phép fetch dữ liệu trực tiếp trên server, giảm tải client-side JavaScript.
  - Sử dụng `async/await` với `fetch` để lấy dữ liệu, kết quả được prerender và cached (mặc định).
  - Dữ liệu có thể truyền xuống Client Component dưới dạng props.
- **Client Components**:
  - Được đánh dấu bằng `"use client"`, thường dùng cho các tác vụ cần state, hooks, hoặc browser APIs (như `useEffect`, `useState`).
  - Có thể nhận dữ liệu từ Server Component qua props hoặc fetch thêm dữ liệu nếu cần (dùng TanStack Query hoặc SWR).

### **Cách fetch API**
- Trong **Server Component**, bạn sử dụng `fetch` trực tiếp trong hàm async và truyền dữ liệu xuống Client Component qua props.
- Để tránh blocking toàn bộ route, sử dụng **React Suspense** để stream dữ liệu, hiển thị fallback UI trong khi chờ fetch.

#### **Ví dụ code: Fetch API trong Server Component**
```jsx
// app/page.jsx (Server Component)
import { Suspense } from 'react';
import ClientComponent from '@/components/ClientComponent';

export default async function Page() {
  // Fetch dữ liệu trong Server Component
  const posts = await fetch('https://api.vercel.app/blog', {
    cache: 'force-cache', // Cache dữ liệu (tương tự getStaticProps)
  }).then((res) => res.json());

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientComponent initialPosts={posts} />
    </Suspense>
  );
}

// components/ClientComponent.jsx (Client Component)
'use client';
import { useState } from 'react';

export default function ClientComponent({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts);

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

#### **Giải thích**
- **Server Component**: Fetch dữ liệu từ API và truyền xuống `ClientComponent` qua props (`initialPosts`).
- **Suspense**: Bọc Client Component để hiển thị fallback (`Loading...`) trong khi dữ liệu đang được fetch (dù trong trường hợp này dữ liệu đã được fetch trên server).
- **Caching**: Next.js tự động cache fetch response (trừ khi dùng `{ cache: 'no-store' }`), cải thiện performance.[](https://nextjs.org/docs/app/getting-started/fetching-data)
- **Lưu ý**: Props truyền từ Server Component sang Client Component phải **serializable** (không truyền function, Promise, hoặc object phức tạp).

#### **Lưu ý khi fetch trong Client Component**
- Nếu cần fetch thêm dữ liệu trong Client Component (ví dụ, load more), sử dụng **TanStack Query** hoặc **SWR** để quản lý server state, cache, và refetch. Tránh fetch trực tiếp trong `useEffect` vì thiếu caching và retry logic.[](https://nextjs.org/docs/pages/building-your-application/data-fetching/client-side)

---

## **2. Hiển thị trạng thái Loading**

### **Khái niệm**
- Next.js khuyến khích sử dụng **Suspense** hoặc file `loading.js` để hiển thị trạng thái loading, giúp stream UI từng phần, cải thiện UX.
- Có hai cách chính:
  1. **loading.js**: File đặc biệt trong App Router, tự động bọc page trong Suspense.
  2. **Suspense**: Bọc component cụ thể để hiển thị fallback UI.

### **Cách hiển thị loading**

#### **Cách 1: Sử dụng file loading.js**
Tạo file `app/loading.js` trong cùng thư mục với `page.js`. File này sẽ tự động bọc page và hiển thị UI loading khi dữ liệu đang fetch.

```jsx
// app/loading.js
export default function Loading() {
  return (
    <div className="loading-skeleton">
      <p>Loading...</p>
    </div>
  );
}
```

```jsx
// app/page.jsx (Server Component)
import { Suspense } from 'react';
import ClientComponent from '@/components/ClientComponent';

export default async function Page() {
  const posts = await fetch('https://api.vercel.app/blog').then((res) => res.json());

  return <ClientComponent posts={posts} />;
}
```

- **Giải thích**: Khi `page.jsx` fetch dữ liệu, Next.js tự động hiển thị `loading.js` cho đến khi dữ liệu sẵn sàng. Không cần bọc `<Suspense>` thủ công.[](https://nextjs.org/docs/app/api-reference/file-conventions/loading)

#### **Cách 2: Sử dụng Suspense thủ công**
Nếu chỉ muốn hiển thị loading cho một phần của page, bọc component trong `<Suspense>`.

```jsx
// app/page.jsx
import { Suspense } from 'react';
import ClientComponent from '@/components/ClientComponent';

export default async function Page() {
  const postsPromise = fetch('https://api.vercel.app/blog').then((res) => res.json());

  return (
    <div>
      <h1>Blog</h1>
      <Suspense fallback={<div>Loading posts...</div>}>
        <ClientComponent postsPromise={postsPromise} />
      </Suspense>
    </div>
  );
}

// components/ClientComponent.jsx
'use client';
import { use } from 'react';

export default function ClientComponent({ postsPromise }) {
  const posts = use(postsPromise); // React's use hook to resolve promise
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

- **Giải thích**:
  - `postsPromise` được truyền từ Server Component sang Client Component.
  - React `use` hook giải quyết Promise trong Client Component.
  - Suspense hiển thị fallback (`Loading posts...`) trong khi Promise đang resolve.[](https://nextjs.org/docs/app/getting-started/fetching-data)

#### **Lưu ý**
- **loading.js** phù hợp cho toàn bộ page, còn **Suspense** linh hoạt hơn khi chỉ cần loading một phần cụ thể.
- Trong development, dùng **React Devtools** để kiểm tra trạng thái loading.[](https://nextjs.org/docs/app/getting-started/fetching-data)
- Nếu fetch chậm, Suspense/loading.js giúp tránh blocking toàn bộ page, cải thiện UX.

---

## **3. Infinite Scroll (Load More) trong Next.js**

### **Khái niệm**
- **Infinite Scroll**: Tải thêm dữ liệu khi người dùng cuộn đến cuối danh sách.
- Trong Next.js, có thể triển khai infinite scroll bằng:
  1. **Server Actions** + Intersection Observer (cách native, enterprise-ready).
  2. **TanStack Query** trong Client Component (cách phổ biến, giảm boilerplate).
- Server Component fetch dữ liệu ban đầu, Client Component xử lý load more và state.

### **Cách triển khai Infinite Scroll**

#### **Cách 1: Server Actions + Intersection Observer**
Sử dụng Server Actions để fetch dữ liệu và `react-intersection-observer` để phát hiện khi người dùng cuộn đến cuối danh sách.

```jsx
// actions/getUsers.js
'use server';
export async function getUsers(offset, limit) {
  try {
    const url = `https://api.slingacademy.com/v1/sample-data/users?offset=${offset}&limit=${limit}`;
    const response = await fetch(url, { cache: 'force-cache' });
    const data = await response.json();
    return data.users;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}
```

```jsx
// app/page.jsx (Server Component)
import { Suspense } from 'react';
import UserList from '@/components/UserList';
import { getUsers } from '@/actions/getUsers';

export default async function Page() {
  const initialUsers = await getUsers(0, 10); // Fetch initial data
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserList initialUsers={initialUsers} />
    </Suspense>
  );
}
```

```jsx
// components/UserList.jsx (Client Component)
'use client';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { getUsers } from '@/actions/getUsers';
import UserCard from './UserCard';

const NUMBER_OF_USERS_TO_FETCH = 10;

export default function UserList({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [offset, setOffset] = useState(NUMBER_OF_USERS_TO_FETCH);
  const { ref, inView } = useInView();

  const loadMoreUsers = async () => {
    const newUsers = await getUsers(offset, NUMBER_OF_USERS_TO_FETCH);
    setUsers((prev) => [...prev, ...newUsers]);
    setOffset((prev) => prev + NUMBER_OF_USERS_TO_FETCH);
  };

  useEffect(() => {
    if (inView) {
      loadMoreUsers();
    }
  }, [inView]);

  return (
    <div className="flex flex-col gap-3">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
      <div ref={ref}>Loading more...</div>
    </div>
  );
}
```

#### **Giải thích**
- **Server Component**: Fetch dữ liệu ban đầu (`initialUsers`) và truyền xuống Client Component.
- **Client Component**:
  - Sử dụng `useState` để quản lý danh sách users và offset.
  - `react-intersection-observer` (`useInView`) phát hiện khi `<div ref={ref}>` xuất hiện trong viewport, gọi `loadMoreUsers`.
  - `loadMoreUsers` sử dụng Server Action (`getUsers`) để fetch thêm dữ liệu.
- **Suspense/loading.js**: Hiển thị trạng thái loading ban đầu.
- **Caching**: Server Action sử dụng `fetch` với `{ cache: 'force-cache' }` để tối ưu performance.[](https://medium.com/%40ferlat.simon/infinite-scroll-with-nextjs-server-actions-a-simple-guide-76a894824cfd)

#### **Cách 2: TanStack Query trong Client Component**
Sử dụng **TanStack Query** để quản lý infinite scroll, tận dụng caching và retry logic.

```jsx
// app/page.jsx (Server Component)
import { Suspense } from 'react';
import InfiniteList from '@/components/InfiniteList';

export default async function Page() {
  const initialUsers = await fetch('https://api.slingacademy.com/v1/sample-data/users?offset=0&limit=10').then(
    (res) => res.json()
  );
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InfiniteList initialUsers={initialUsers.users} />
    </Suspense>
  );
}
```

```jsx
// components/InfiniteList.jsx (Client Component)
'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import UserCard from './UserCard';

const fetchUsers = async ({ pageParam = 0 }) => {
  const res = await fetch(`https://api.slingacademy.com/v1/sample-data/users?offset=${pageParam}&limit=10`);
  const data = await res.json();
  return data.users;
};

export default function InfiniteList({ initialUsers }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    initialData: { pages: [initialUsers], pageParams: [0] },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length * 10 : undefined;
    },
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  return (
    <div className="flex flex-col gap-3">
      {data?.pages.flat().map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
      <div ref={ref}>{isFetchingNextPage ? 'Loading more...' : 'Load more'}</div>
    </div>
  );
}
```

#### **Giải thích**
- **Server Component**: Fetch dữ liệu ban đầu và truyền xuống `InfiniteList`.
- **TanStack Query**:
  - `useInfiniteQuery` quản lý infinite scroll, tự động cache và retry.
  - `initialData` sử dụng dữ liệu từ Server Component để tránh fetch lại lần đầu.
  - `getNextPageParam` tính toán offset cho trang tiếp theo.
- **Intersection Observer**: Kích hoạt `fetchNextPage` khi người dùng cuộn đến cuối danh sách.
- **Loading**: `isFetchingNextPage` hiển thị trạng thái loading khi fetch thêm dữ liệu.
- **Ưu điểm**: TanStack Query giảm boilerplate, tự động xử lý cache, retry, và stale data.[](https://swr.vercel.app/docs/with-nextjs)

---

## **4. Enterprise-ready Notes**

### **Khi nào dùng Server Actions vs TanStack Query?**
- **Server Actions**:
  - Phù hợp khi cần tích hợp chặt chẽ với server logic (ví dụ, database query, authentication).
  - Dễ triển khai infinite scroll với App Router, tận dụng cache của `fetch`.
  - Hạn chế: Không có built-in retry/cache logic như TanStack Query, cần tự xử lý.
- **TanStack Query**:
  - Lý tưởng cho server state management (cache, retry, refetch, pagination).
  - Giảm boilerplate, tự động xử lý infinite scroll và UX (stale time, prefetch).
  - Hạn chế: Yêu cầu Client Component, tăng client-side JS so với Server Actions.

### **Best Practices**
- **Server Component**: Fetch dữ liệu ban đầu, truyền props xuống Client Component để giảm client-side fetch.[](https://nextjs.org/docs/14/app/building-your-application/data-fetching/patterns)
- **Suspense/loading.js**: Sử dụng để stream UI, cải thiện UX và tránh blocking.[](https://nextjs.org/docs/app/api-reference/file-conventions/loading)
- **Infinite Scroll**:
  - Dùng `react-intersection-observer` để phát hiện scroll, kết hợp Server Actions hoặc TanStack Query.
  - Với TanStack Query, tận dụng `useInfiniteQuery` để quản lý cache và pagination,.[](https://medium.com/%40ferlat.simon/infinite-scroll-with-nextjs-server-actions-a-simple-guide-76a894824cfd)[](https://blog.logrocket.com/implementing-infinite-scroll-next-js-server-actions/)
- **Mix TanStack Query + Server Actions**:
  - Server Actions cho fetch ban đầu trong Server Component.
  - TanStack Query trong Client Component cho load more, cache, và retry.
- **Error Handling**:
  - Dùng `ErrorBoundary` hoặc `try/catch` trong Server Actions để xử lý lỗi.[](https://dev.to/rashidshamloo/api-data-fetching-in-react-nextjs-289d)
  - TanStack Query có built-in error handling (`error` từ `useQuery`/`useInfiniteQuery`).

### **Lưu ý khi mix Server và Client Components**
- **Serializable Props**: Chỉ truyền dữ liệu serializable từ Server sang Client Component.[](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- **Avoid Waterfalls**: Sử dụng parallel fetching (`Promise.all` hoặc `all` trong Saga) trong Server Component để tránh sequential fetch.[](https://nextjs.org/docs/14/app/building-your-application/data-fetching/patterns)
- **SEO**: Server Components tự động prerender, đảm bảo SEO-friendly ngay cả với infinite scroll.[](https://nextjs.org/docs/app/api-reference/file-conventions/loading)

---

## **5. Ví dụ đầy đủ: E-commerce App với Infinite Scroll**

```jsx
// app/page.jsx (Server Component)
import { Suspense } from 'react';
import ProductList from '@/components/ProductList';

export default async function Page() {
  const initialProducts = await fetch('https://api.example.com/products?offset=0&limit=10').then((res) => res.json());
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <ProductList initialProducts={initialProducts} />
    </Suspense>
  );
}
```

```jsx
// components/ProductList.jsx (Client Component)
'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

const fetchProducts = async ({ pageParam = 0 }) => {
  const res = await fetch(`https://api.example.com/products?offset=${pageParam}&limit=10`);
  return res.json();
};

export default function ProductList({ initialProducts }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    initialData: { pages: [initialProducts], pageParams: [0] },
    getNextPageParam: (lastPage, allPages) => (lastPage.length ? allPages.length * 10 : undefined),
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  return (
    <div>
      {data?.pages.flat().map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
      <div ref={ref}>{isFetchingNextPage ? 'Loading more...' : 'Load more'}</div>
    </div>
  );
}
```

```jsx
// app/loading.js
export default function Loading() {
  return <div>Loading products...</div>;
}
```

#### **Giải thích**
- **Server Component**: Fetch 10 sản phẩm đầu tiên, truyền xuống `ProductList`.
- **Client Component**: Sử dụng `useInfiniteQuery` để load thêm sản phẩm khi cuộn, với `initialData` từ Server Component.
- **Intersection Observer**: Kích hoạt `fetchNextPage` khi `<div ref={ref}>` vào viewport.
- **Loading**: `loading.js` xử lý loading ban đầu, `isFetchingNextPage` hiển thị loading khi load more.

---

## **6. Tóm tắt logic triển khai**

1. **Fetch API**:
   - Server Component: Dùng `async/await` với `fetch`, truyền dữ liệu qua props.
   - Client Component: Dùng TanStack Query hoặc SWR nếu cần fetch thêm.
2. **Hiển thị Loading**:
   - Dùng `loading.js` cho toàn page hoặc `<Suspense>` cho component cụ thể.
   - Tận dụng streaming để cải thiện UX.
3. **Infinite Scroll**:
   - Server Actions + Intersection Observer: Native, tích hợp tốt với App Router.
   - TanStack Query: Gọn nhẹ, tự động cache/retry, lý tưởng cho server state.
4. **Enterprise-ready**:
   - Mix Server Actions (fetch ban đầu) + TanStack Query (load more, cache).
   - Dùng Zustand/Context cho UI state nhỏ, tránh Redux nặng.

---

## **7. Tham khảo**
- Next.js Docs: Data Fetching,,[](https://nextjs.org/docs/app/getting-started/fetching-data)[](https://nextjs.org/docs/pages/building-your-application/data-fetching)[](https://nextjs.org/docs/app/api-reference/functions/fetch)
- TanStack Query: Infinite Queries[](https://swr.vercel.app/docs/with-nextjs)
- Infinite Scroll với Server Actions,[](https://medium.com/%40ferlat.simon/infinite-scroll-with-nextjs-server-actions-a-simple-guide-76a894824cfd)[](https://blog.logrocket.com/implementing-infinite-scroll-next-js-server-actions/)

> **Lưu ý**: Đảm bảo API hỗ trợ pagination (offset/limit hoặc cursor) để infinite scroll hoạt động hiệu quả. Nếu API không hỗ trợ, cần tự xây logic server-side.
