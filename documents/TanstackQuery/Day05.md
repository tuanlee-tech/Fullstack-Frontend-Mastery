# **Day 5: Pagination & Infinite Queries**

### **Mục tiêu**

* Hiểu cách implement **Pagination** (fetch theo trang).
* Hiểu **Infinite Queries** (`useInfiniteQuery`) để scroll/load dữ liệu liên tục.
* Quản lý **queryKey**, **getNextPageParam**, **fetchNextPage**, **hasNextPage**.

---

## **1️⃣ Pagination cơ bản với useQuery**

```ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

interface Post { id: number; title: string; }

async function fetchPosts(page: number) {
  const res = await axios.get<Post[]>(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`);
  return res.data;
}

function PaginatedPosts() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery(['posts', page], () => fetchPosts(page), {
    keepPreviousData: true, // Giữ dữ liệu cũ khi page thay đổi
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching posts!</p>;

  return (
    <div>
      <ul>
        {data?.map(post => <li key={post.id}>{post.title}</li>)}
      </ul>
      <button onClick={() => setPage(old => old - 1)} disabled={page === 1}>Prev</button>
      <button onClick={() => setPage(old => old + 1)}>Next</button>
      <p>Page: {page}</p>
    </div>
  );
}
```

**Tips Pagination**:

* `keepPreviousData: true` tránh UI nhấp nháy khi chuyển trang.
* QueryKey phải bao gồm page: `['posts', page]`.

---

## **2️⃣ Infinite Query (Scroll vô hạn)**

```ts
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Post { id: number; title: string; }

async function fetchPosts({ pageParam = 1 }) {
  const res = await axios.get<Post[]>(`https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=10`);
  return res.data;
}

function InfinitePosts() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery(['posts'], fetchPosts, {
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 10) return undefined; // hết dữ liệu
      return allPages.length + 1; // next page
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error!</p>;

  return (
    <div>
      {data?.pages.map((page, i) => (
        <ul key={i}>
          {page.map(post => <li key={post.id}>{post.title}</li>)}
        </ul>
      ))}
      <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
        {isFetchingNextPage ? 'Loading...' : hasNextPage ? 'Load More' : 'No More'}
      </button>
    </div>
  );
}
```

**Tips Infinite Queries**:

* `getNextPageParam` xác định page tiếp theo.
* `data.pages` lưu từng page fetch thành mảng.
* Tối ưu UI: thêm skeleton/loading indicator.

---

## **3️⃣ Bài tập**

| Level | Nội dung          | Yêu cầu                                                                           |
| ----- | ----------------- | --------------------------------------------------------------------------------- |
| 1     | Pagination cơ bản | Fetch posts theo page, hiển thị Prev/Next button, giữ dữ liệu cũ khi đổi page     |
| 2     | Infinite Scroll   | Dùng `useInfiniteQuery` + Load More button, hiển thị tất cả posts                 |
| 3     | Kết hợp           | Infinite scroll + scroll to top khi đổi user (dependent query) + skeleton loading |

---

### ✅ **Key Takeaways Day 5**

* **Pagination**: dùng queryKey có page, `keepPreviousData` để UI mượt.
* **Infinite Queries**: `useInfiniteQuery` + `getNextPageParam` + `fetchNextPage`.
* Quản lý loading/error cho từng page.
* Dữ liệu phân trang/scroll vô hạn phù hợp với danh sách lớn, tối ưu performance.

---


## **Level 1: Pagination cơ bản**

```ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

interface Post {
  id: number;
  title: string;
}

async function fetchPosts(page: number) {
  const res = await axios.get<Post[]>(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`);
  return res.data;
}

function PaginatedPosts() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery(['posts', page], () => fetchPosts(page), {
    keepPreviousData: true, // Giữ dữ liệu cũ khi đổi page
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching posts!</p>;

  return (
    <div>
      <ul>
        {data?.map(post => <li key={post.id}>{post.title}</li>)}
      </ul>
      <button onClick={() => setPage(old => Math.max(old - 1, 1))} disabled={page === 1}>Prev</button>
      <button onClick={() => setPage(old => old + 1)}>Next</button>
      <p>Page: {page}</p>
    </div>
  );
}
```

**Giải thích**:

* `keepPreviousData` giúp tránh nhấp nháy khi đổi page.
* QueryKey `['posts', page]` cache dữ liệu riêng cho từng page.

---

## **Level 2: Infinite Query (Load More / Scroll vô hạn)**

```ts
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Post { id: number; title: string; }

async function fetchPosts({ pageParam = 1 }) {
  const res = await axios.get<Post[]>(`https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=10`);
  return res.data;
}

function InfinitePosts() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery(
    ['posts'],
    fetchPosts,
    {
      getNextPageParam: (lastPage, allPages) => lastPage.length < 10 ? undefined : allPages.length + 1,
    }
  );

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error!</p>;

  return (
    <div>
      {data?.pages.map((page, i) => (
        <ul key={i}>
          {page.map(post => <li key={post.id}>{post.title}</li>)}
        </ul>
      ))}
      <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
        {isFetchingNextPage ? 'Loading...' : hasNextPage ? 'Load More' : 'No More'}
      </button>
    </div>
  );
}
```

**Giải thích**:

* `getNextPageParam` quyết định page tiếp theo.
* `data.pages` lưu từng page fetch.
* `fetchNextPage` để fetch page tiếp theo khi click/load more.

---

## **Level 3: Kết hợp Infinite Query + Dependent Query**

```ts
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Post { id: number; title: string; }
interface User { id: number; name: string; }

async function fetchUser(userId: number) {
  const res = await axios.get<User>(`https://jsonplaceholder.typicode.com/users/${userId}`);
  return res.data;
}

async function fetchPostsByUser({ pageParam = 1, userId }: { pageParam?: number; userId: number }) {
  const res = await axios.get<Post[]>(`https://jsonplaceholder.typicode.com/posts?userId=${userId}&_page=${pageParam}&_limit=5`);
  return res.data;
}

function UserInfinitePosts({ userId }: { userId: number }) {
  const { data: user } = useQuery(['user', userId], () => fetchUser(userId));

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery(
    ['userPosts', userId],
    ({ pageParam = 1 }) => fetchPostsByUser({ pageParam, userId }),
    {
      enabled: !!userId,
      getNextPageParam: (lastPage, allPages) => lastPage.length < 5 ? undefined : allPages.length + 1,
    }
  );

  if (isLoading || !user) return <p>Loading...</p>;
  if (isError) return <p>Error loading posts!</p>;

  return (
    <div>
      <h2>{user.name}'s Posts</h2>
      {data?.pages.map((page, i) => (
        <ul key={i}>
          {page.map(post => <li key={post.id}>{post.title}</li>)}
        </ul>
      ))}
      <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
        {isFetchingNextPage ? 'Loading...' : hasNextPage ? 'Load More' : 'No More'}
      </button>
    </div>
  );
}
```

**Giải thích**:

* **Dependent query**: fetch user trước khi fetch posts.
* **Infinite query**: phân trang posts của user.
* `enabled: !!userId` để đảm bảo query posts chỉ chạy khi userId hợp lệ.
* `getNextPageParam` xác định khi nào còn page tiếp theo.

