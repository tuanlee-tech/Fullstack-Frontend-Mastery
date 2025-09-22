# **Day 7: Prefetching & Background Updates**

### **Mục tiêu**

* Hiểu cách **Prefetching**: tải dữ liệu trước khi user cần.
* Hiểu **Background Updates**: refresh dữ liệu tự động khi tab focus hoặc refetch interval.
* Tối ưu UX & performance cho app với nhiều query.

---

## **1️⃣ Prefetching**

* Prefetch dữ liệu giúp UI hiển thị gần như ngay lập tức khi user điều hướng.

```ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';

interface User { id: number; name: string; }

async function fetchUser(userId: number) {
  const res = await axios.get<User>(`https://jsonplaceholder.typicode.com/users/${userId}`);
  return res.data;
}

function UsersList({ users }: { users: User[] }) {
  const queryClient = useQueryClient();

  // Prefetch data khi hover vào tên user
  const prefetchUser = (userId: number) => {
    queryClient.prefetchQuery(['user', userId], () => fetchUser(userId), {
      staleTime: 1000 * 60 * 5, // 5 phút cache
    });
  };

  return (
    <ul>
      {users.map(user => (
        <li key={user.id} onMouseEnter={() => prefetchUser(user.id)}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}
```

**Giải thích**:

* `prefetchQuery` tải dữ liệu trước khi user click.
* `staleTime` giúp cache dữ liệu sẵn sàng.

---

## **2️⃣ Background Updates (Refetching tự động)**

```ts
function UserProfile({ userId }: { userId: number }) {
  const { data, isLoading, isError } = useQuery(['user', userId], () => fetchUser(userId), {
    refetchOnWindowFocus: true,   // tự refetch khi tab active
    refetchInterval: 1000 * 60,   // tự refetch mỗi 1 phút
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error!</p>;

  return (
    <div>
      <h2>{data?.name}</h2>
    </div>
  );
}
```

**Tips**:

* `refetchOnWindowFocus: true` giúp dữ liệu luôn tươi khi user trở lại tab.
* `refetchInterval` thích hợp với dashboard cần cập nhật realtime.

---

## **3️⃣ Kết hợp Prefetch + Background Updates**

* Prefetch khi hover/hover + refetch interval: combo tối ưu UX.
* Ví dụ: dashboard load nhanh khi chuyển tab + tự refresh dữ liệu.

---

## **4️⃣ Bài tập**

| Level | Nội dung           | Yêu cầu                                                                    |
| ----- | ------------------ | -------------------------------------------------------------------------- |
| 1     | Prefetch           | Prefetch data user khi hover vào tên, hiển thị ngay khi click              |
| 2     | Background Updates | Refetch dữ liệu user khi tab focus hoặc mỗi 30s                            |
| 3     | Kết hợp            | Prefetch + Infinite Scroll + Background Updates, data luôn tươi và UX mượt |

---

### ✅ **Key Takeaways Day 7**

* **Prefetching**: giảm latency, dữ liệu có sẵn trước khi user cần.
* **Background Updates**: giữ dữ liệu luôn tươi, tự động refetch khi tab focus hoặc interval.
* Kết hợp cả 2 giúp UX nhanh, mượt, app responsive hơn.

---

## **Level 1: Prefetching – Fetch user khi hover**

```ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';

interface User { id: number; name: string; }

async function fetchUser(userId: number) {
  const res = await axios.get<User>(`https://jsonplaceholder.typicode.com/users/${userId}`);
  return res.data;
}

function UsersList({ users }: { users: User[] }) {
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Prefetch user khi hover
  const prefetchUser = (userId: number) => {
    queryClient.prefetchQuery(['user', userId], () => fetchUser(userId), {
      staleTime: 1000 * 60 * 5, // 5 phút
    });
  };

  return (
    <div>
      <ul>
        {users.map(user => (
          <li
            key={user.id}
            onMouseEnter={() => prefetchUser(user.id)}
            onClick={() => setSelectedUserId(user.id)}
          >
            {user.name}
          </li>
        ))}
      </ul>

      {selectedUserId && <UserProfile userId={selectedUserId} />}
    </div>
  );
}

function UserProfile({ userId }: { userId: number }) {
  const { data, isLoading, isError } = useQuery(['user', userId], () => fetchUser(userId));

  if (isLoading) return <p>Loading user...</p>;
  if (isError) return <p>Error fetching user!</p>;

  return <p>User Name: {data?.name}</p>;
}
```

**Giải thích**:

* Prefetch giúp dữ liệu hiển thị gần như ngay lập tức khi click vào tên user.
* QueryKey `['user', userId]` cache riêng từng user.

---

## **Level 2: Background Updates – Refetch tự động**

```ts
function UserProfileBackground({ userId }: { userId: number }) {
  const { data, isLoading, isError } = useQuery(
    ['user', userId],
    () => fetchUser(userId),
    {
      refetchOnWindowFocus: true,       // tự refetch khi tab active
      refetchInterval: 1000 * 30,       // tự refetch mỗi 30s
      staleTime: 1000 * 60,             // 1 phút dữ liệu tươi
    }
  );

  if (isLoading) return <p>Loading user...</p>;
  if (isError) return <p>Error fetching user!</p>;

  return <p>User Name: {data?.name}</p>;
}
```

**Giải thích**:

* Dữ liệu tự động refresh khi user focus tab.
* Interval 30s đảm bảo dữ liệu luôn tươi trên dashboard.

---

## **Level 3: Kết hợp Prefetch + Infinite Scroll + Background Updates**

```ts
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

interface Post { id: number; title: string; }
interface User { id: number; name: string; }

async function fetchUser(userId: number) {
  const res = await axios.get<User>(`https://jsonplaceholder.typicode.com/users/${userId}`);
  return res.data;
}

async function fetchPosts({ pageParam = 1, userId }: { pageParam?: number; userId: number }) {
  const res = await axios.get<Post[]>(`https://jsonplaceholder.typicode.com/posts?userId=${userId}&_page=${pageParam}&_limit=5`);
  return res.data;
}

function PrefetchInfiniteUserPosts({ users }: { users: User[] }) {
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const prefetchUser = (userId: number) => {
    queryClient.prefetchQuery(['user', userId], () => fetchUser(userId), { staleTime: 1000 * 60 * 5 });
    queryClient.prefetchInfiniteQuery(['userPosts', userId], ({ pageParam = 1 }) => fetchPosts({ pageParam, userId }));
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery(
    ['userPosts', selectedUserId],
    ({ pageParam = 1 }) => fetchPosts({ pageParam, userId: selectedUserId! }),
    {
      enabled: !!selectedUserId,
      getNextPageParam: (lastPage, allPages) => (lastPage.length < 5 ? undefined : allPages.length + 1),
      refetchOnWindowFocus: true,
      refetchInterval: 1000 * 30,
    }
  );

  return (
    <div>
      <ul>
        {users.map(user => (
          <li
            key={user.id}
            onMouseEnter={() => prefetchUser(user.id)}
            onClick={() => setSelectedUserId(user.id)}
          >
            {user.name}
          </li>
        ))}
      </ul>

      {selectedUserId && (
        <div>
          {isLoading ? (
            <p>Loading posts...</p>
          ) : isError ? (
            <p>Error loading posts!</p>
          ) : (
            <>
              {data?.pages.map((page, i) => (
                <ul key={i}>
                  {page.map(post => (
                    <li key={post.id}>{post.title}</li>
                  ))}
                </ul>
              ))}
              <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
                {isFetchingNextPage ? 'Loading...' : hasNextPage ? 'Load More' : 'No More'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
```

**Giải thích Level 3**:

* Prefetch data user + posts khi hover → UI cực nhanh.
* Infinite scroll: load posts page tiếp theo.
* Background updates: refetch khi tab focus + interval 30s.
* `enabled: !!selectedUserId` đảm bảo query chạy khi user được chọn.

---
