# **TanStack Query – Cú Pháp & Tùy Chọn Dễ Hiểu**

TanStack Query là một thư viện quản lý **server state** mạnh mẽ, giúp xử lý **API calls, caching, refetching, mutations, và hơn thế nữa**, với cú pháp đơn giản và linh hoạt.

---

## **1️⃣ Cài Đặt**

```bash
npm install @tanstack/react-query
```

**Setup trong ứng dụng React**:

```ts
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

export const App: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
```

- **QueryClient**: Quản lý cache, retry, và các cấu hình global.
- **QueryClientProvider**: Wrap ứng dụng để cung cấp `QueryClient`.

---

## **2️⃣ Cú Pháp Cơ Bản**

### **2.1 useQuery – Lấy dữ liệu**

**Cú pháp**:
```ts
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['uniqueKey'], // Key duy nhất để cache
  queryFn: async () => {
    const response = await fetch('/api/data');
    return response.json();
  },
});
```

- **queryKey**: Xác định cache (string hoặc array).
- **queryFn**: Hàm async trả về dữ liệu từ API.

**Trả về**:
- `data`: Dữ liệu từ API (hoặc undefined nếu chưa có).
- `isLoading`: `true` khi đang fetch lần đầu.
- `error`: Lỗi nếu có (hoặc null).
- `refetch`: Hàm để gọi lại API thủ công.
- `isFetching`: `true` khi đang refetch (background).

**Ví dụ thực tế**:
```ts
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: async () => (await fetch('/api/users')).json(),
});

if (isLoading) return <p>Loading...</p>;
if (error) return <p>Error: {(error as any).message}</p>;
return <ul>{data?.map(user => <li key={user.id}>{user.name}</li>)}</ul>;
```

---

### **2.2 useMutation – Cập nhật dữ liệu**

**Cú pháp**:
```ts
import { useMutation } from '@tanstack/react-query';

const { mutate, isPending, isError, error } = useMutation({
  mutationFn: async (newData: any) => {
    const response = await fetch('/api/data', {
      method: 'POST',
      body: JSON.stringify(newData),
    });
    return response.json();
  },
});
```

- **mutationFn**: Hàm async gửi request (POST, PUT, DELETE, v.v.).
- **mutate**: Hàm gọi mutation, nhận dữ liệu đầu vào.

**Trả về**:
- `mutate`: Hàm để trigger mutation.
- `isPending`: `true` khi mutation đang chạy.
- `isError`: `true` nếu có lỗi.
- `error`: Lỗi nếu có (hoặc null).

**Ví dụ thực tế**:
```ts
const { mutate, isPending } = useMutation({
  mutationFn: async (newPost: { title: string }) => {
    const response = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify(newPost),
    });
    return response.json();
  },
});

return (
  <button
    onClick={() => mutate({ title: 'New Post' })}
    disabled={isPending}
  >
    {isPending ? 'Saving...' : 'Add Post'}
  </button>
);
```

---

### **2.3 useInfiniteQuery – Pagination/Infinite Scroll**

**Cú pháp**:
```ts
import { useInfiniteQuery } from '@tanstack/react-query';

const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: async ({ pageParam = 1 }) => {
    const response = await fetch(`/api/posts?page=${pageParam}`);
    return response.json();
  },
  getNextPageParam: (lastPage, pages) => lastPage.nextPage || undefined,
  initialPageParam: 1,
});
```

- **queryKey**: Key để cache.
- **queryFn**: Hàm async nhận `pageParam` để fetch page.
- **getNextPageParam**: Quyết định page tiếp theo (hoặc `undefined` nếu hết).

**Trả về**:
- `data`: Dữ liệu dạng `{ pages: [], pageParams: [] }`.
- `fetchNextPage`: Hàm gọi page tiếp theo.
- `hasNextPage`: `true` nếu còn page để load.
- `isFetchingNextPage`: `true` khi đang load page tiếp theo.

**Ví dụ thực tế**:
```ts
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: async ({ pageParam = 1 }) => (await fetch(`/api/posts?page=${pageParam}`)).json(),
  getNextPageParam: (lastPage) => lastPage.nextPage || undefined,
  initialPageParam: 1,
});

return (
  <div>
    {data?.pages.map((page, i) => (
      <ul key={i}>
        {page.posts.map(post => <li key={post.id}>{post.title}</li>)}
      </ul>
    ))}
    {hasNextPage && (
      <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
        {isFetchingNextPage ? 'Loading...' : 'Load More'}
      </button>
    )}
  </div>
);
```

---

## **3️⃣ Tùy Chọn (Options) Phổ Biến**

### **3.1 useQuery Options**

| Tùy chọn                  | Mô tả                                                                 | Ví dụ                                  |
|---------------------------|----------------------------------------------------------------------|----------------------------------------|
| `staleTime`               | Thời gian cache dữ liệu (ms) trước khi coi là "cũ".                  | `staleTime: 1000 * 60` (1 phút)        |
| `cacheTime`               | Thời gian giữ cache khi không dùng (default: 5 phút).                | `cacheTime: 1000 * 60 * 10`            |
| `refetchOnWindowFocus`    | Tự động refetch khi tab browser được focus lại (default: true).      | `refetchOnWindowFocus: false`          |
| `retry`                   | Số lần retry khi lỗi (default: 3).                                   | `retry: 2`                             |
| `onError`                 | Hàm xử lý lỗi.                                                      | `onError: (err) => console.error(err)` |
| `enabled`                 | Bật/tắt query (default: true).                                      | `enabled: !!userId`                    |
| `keepPreviousData`        | Giữ dữ liệu cũ khi fetch page mới (dùng cho pagination).             | `keepPreviousData: true`               |

**Ví dụ**:
```ts
useQuery({
  queryKey: ['users', userId],
  queryFn: () => fetch(`/api/users/${userId}`).then(res => res.json()),
  staleTime: 1000 * 60 * 5, // 5 phút
  enabled: !!userId, // Chỉ fetch khi userId tồn tại
  onError: (err) => alert('Error fetching users!'),
});
```

---

### **3.2 useMutation Options**

| Tùy chọn                  | Mô tả                                                                 | Ví dụ                                  |
|---------------------------|----------------------------------------------------------------------|----------------------------------------|
| `onMutate`                | Hàm chạy trước mutation, dùng cho optimistic updates.                | `onMutate: async (data) => {...}`      |
| `onError`                 | Hàm xử lý lỗi, nhận context từ `onMutate`.                          | `onError: (err, vars, context) => {...}`|
| `onSuccess`               | Hàm chạy khi mutation thành công.                                   | `onSuccess: (data) => alert('Saved!')` |
| `onSettled`               | Hàm chạy sau khi mutation hoàn tất (thành công hoặc lỗi).           | `onSettled: () => console.log('Done')` |
| `retry`                   | Số lần retry khi lỗi (default: 0).                                   | `retry: 1`                             |

**Ví dụ (Optimistic Update)**:
```ts
const queryClient = useQueryClient();

useMutation({
  mutationFn: (newPost) => fetch('/api/posts', { method: 'POST', body: JSON.stringify(newPost) }).then(res => res.json()),
  onMutate: async (newPost) => {
    await queryClient.cancelQueries({ queryKey: ['posts'] });
    const previous = queryClient.getQueryData(['posts']);
    queryClient.setQueryData(['posts'], (old: any) => [...old, newPost]);
    return { previous };
  },
  onError: (err, newPost, context) => queryClient.setQueryData(['posts'], context?.previous),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
});
```

---

### **3.3 useInfiniteQuery Options**

| Tùy chọn                  | Mô tả                                                                 | Ví dụ                                  |
|---------------------------|----------------------------------------------------------------------|----------------------------------------|
| `getNextPageParam`        | Quyết định page tiếp theo.                                          | `getNextPageParam: (last) => last.next`|
| `keepPreviousData`        | Giữ dữ liệu cũ khi fetch page mới.                                  | `keepPreviousData: true`               |
| `staleTime`               | Thời gian cache dữ liệu.                                            | `staleTime: 1000 * 60`                |
| `refetchOnWindowFocus`    | Tự động refetch khi focus tab.                                      | `refetchOnWindowFocus: false`          |

**Ví dụ**:
```ts
useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam = 1 }) => fetch(`/api/posts?page=${pageParam}`).then(res => res.json()),
  getNextPageParam: (lastPage) => lastPage.nextPage || undefined,
  initialPageParam: 1,
  keepPreviousData: true,
});
```

---

## **4️⃣ QueryClient Methods**

**QueryClient** cung cấp các phương thức để tương tác với cache:

```ts
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();
```

| Phương thức                     | Mô tả                                                                 |
|---------------------------------|----------------------------------------------------------------------|
| `queryClient.invalidateQueries` | Làm mới cache cho queryKey cụ thể.                                   |
| `queryClient.setQueryData`      | Cập nhật cache thủ công (dùng cho optimistic updates).               |
| `queryClient.getQueryData`      | Lấy dữ liệu từ cache.                                               |
| `queryClient.prefetchQuery`     | Fetch trước dữ liệu để cải thiện UX.                                 |
| `queryClient.cancelQueries`     | Hủy query đang chạy.                                                |

**Ví dụ**:
```ts
// Prefetch dữ liệu
queryClient.prefetchQuery({
  queryKey: ['posts', userId],
  queryFn: () => fetch(`/api/posts/${userId}`).then(res => res.json()),
});

// Cập nhật cache
queryClient.setQueryData(['posts', userId], (old: any) => [...old, newPost]);

// Làm mới cache
queryClient.invalidateQueries({ queryKey: ['posts'] });
```

---

## **5️⃣ Cấu Hình Global (QueryClient)**

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 phút
      retry: 2,
      refetchOnWindowFocus: false,
      onError: (err) => console.error('Query error:', err),
    },
    mutations: {
      retry: 1,
      onError: (err) => console.error('Mutation error:', err),
    },
  },
});
```

**Lợi ích**:
- Cấu hình mặc định cho tất cả queries/mutations.
- Đảm bảo UX nhất quán, giảm boilerplate code.

---

## **6️⃣ Mẹo & Best Practices**

1. **Centralized Query Keys**:
   ```ts
   export const QUERY_KEYS = {
     USERS: ['users'] as const,
     POSTS: (userId: number) => ['posts', userId] as const,
   };
   ```

2. **Encapsulated Hooks**:
   ```ts
   export const usePosts = (userId: number) => {
     return useQuery({
       queryKey: QUERY_KEYS.POSTS(userId),
       queryFn: () => fetch(`/api/posts/${userId}`).then(res => res.json()),
     });
   };
   ```

3. **Optimistic Updates**:
   - Dùng `onMutate` để cập nhật UI trước, `onError` để rollback.
   - Ví dụ ở phần `useMutation` bên trên.

4. **Error Handling**:
   - Tích hợp toast/notification (e.g., `react-toastify`).
   - Dùng `onError` global trong `QueryClient`.

5. **Testing**:
   - Dùng **MSW** để mock API.
   - Test hooks riêng lẻ với `@testing-library/react`.

---

## **7️⃣ Ví Dụ Tổng Hợp (Mini Dashboard)**

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const App: React.FC = () => {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState(1);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetch(`/api/posts/${userId}`).then(res => res.json()),
    staleTime: 1000 * 60 * 5,
  });

  const { mutate } = useMutation({
    mutationFn: (newPost: { title: string }) =>
      fetch('/api/posts', { method: 'POST', body: JSON.stringify(newPost) }).then(res => res.json()),
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ['posts', userId] });
      const previous = queryClient.getQueryData(['posts', userId]);
      queryClient.setQueryData(['posts', userId], (old: any) => [...old, newPost]);
      return { previous };
    },
    onError: (err, newPost, context) => queryClient.setQueryData(['posts', userId], context?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['posts', userId] }),
  });

  const handleAddPost = () => mutate({ title: 'New Post' });

  return (
    <div>
      <h1>Posts for User {userId}</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {posts?.map(post => <li key={post.id}>{post.title}</li>)}
        </ul>
      )}
      <button onClick={handleAddPost}>Add Post</button>
      <button onClick={() => setUserId(userId + 1)}>Next User</button>
    </div>
  );
};
```

---

## **✅ Tổng Kết**

- **Cú pháp đơn giản**: `useQuery`, `useMutation`, `useInfiniteQuery`.
- **Tùy chọn linh hoạt**: `staleTime`, `retry`, `onError`, v.v.
- **Enterprise-ready**: Dễ tích hợp vào dự án lớn với patterns như centralized query keys, encapsulated hooks, optimistic updates, và global error handling.
- **Testing**: Kết hợp với MSW để mock API.
- **Monitoring**: Tích hợp Sentry/LogRocket cho production.