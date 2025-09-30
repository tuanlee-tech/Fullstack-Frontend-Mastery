# **Day 10: Testing & Deployment**

### **Mục tiêu**

* Học cách **test queries và mutations** với **MSW** (Mock Service Worker).
* Cấu hình **testing environment** cho TanStack Query.
* Triển khai **dashboard CRUD** lên **Vercel/Netlify**.

---

## **1️⃣ Testing useQuery + useMutation với MSW**

### **Setup MSW**

```ts
// src/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('https://jsonplaceholder.typicode.com/posts', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([{ id: 1, title: 'Test Post', userId: 1 }]));
  }),
  rest.post('https://jsonplaceholder.typicode.com/posts', (req, res, ctx) => {
    const { title, userId } = req.body as any;
    return res(ctx.status(201), ctx.json({ id: Date.now(), title, userId }));
  }),
  rest.delete('https://jsonplaceholder.typicode.com/posts/:id', (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
```

```ts
// src/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

---

### **Test useQuery**

```ts
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { server } from './mocks/server';
import { rest } from 'msw';
import { PostsQuery } from './DashboardLevel1';

// Start MSW server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('fetch posts successfully', async () => {
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <PostsQuery />
    </QueryClientProvider>
  );

  expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByText(/Test Post/i)).toBeInTheDocument();
  });
});
```

---

### **Test useMutation**

```ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AddPostButton } from './PostsMutations';

test('add post successfully', async () => {
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <AddPostButton userId={1} />
    </QueryClientProvider>
  );

  fireEvent.click(screen.getByText(/Add Post/i));
  await waitFor(() => {
    expect(screen.getByText(/New Post/i)).toBeInTheDocument();
  });
});
```

**Giải thích:**

* MSW giúp mock API, không cần server thật.
* Test cả **query** và **mutation** trong isolation.
* Dễ dàng kiểm tra optimistic updates, error handling.

---

## **2️⃣ Deployment lên Vercel / Netlify**

### **Bước 1: Chuẩn bị project**

* Kiểm tra `package.json`:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  }
}
```

* Đảm bảo `.env` không chứa secrets trực tiếp.

### **Bước 2: Deploy**

#### **Vercel**

1. `vercel login` → đăng nhập
2. `vercel --prod` → deploy
3. Vercel tự nhận diện React app, build và host.

#### **Netlify**

1. Tạo repository GitHub.
2. Connect Netlify → chọn repository.
3. Build command: `npm run build`, Publish directory: `build/`.

### **Bước 3: Kiểm tra**

* Truy cập URL do Vercel/Netlify cung cấp.
* Kiểm tra CRUD, background updates, infinite scroll, error handling.

---

## **3️⃣ Key Takeaways Day 10**

* **Testing** với MSW giúp kiểm tra queries/mutations mà không phụ thuộc backend.
* **Optimistic updates + rollback** cũng test được.
* **Deployment** nhanh chóng với Vercel/Netlify, hỗ trợ React + TS + TanStack Query.
* Toàn bộ project giờ **production-ready**, có test, cache, error handling, background updates, infinite scroll.

---


# **TanStack Query 10-Day Cheatsheet**

## **1️⃣ Query Hooks**

| Hook               | Mục đích                        | Key Options                                                                                                         | Notes                                     |
| ------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `useQuery`         | Fetch & cache data              | `queryKey`, `queryFn`, `enabled`, `staleTime`, `cacheTime`, `refetchOnWindowFocus`, `retry`, `onError`, `onSuccess` | Caching + background updates.             |
| `useInfiniteQuery` | Fetch data dạng infinite scroll | `getNextPageParam`, `pageParam`, `enabled`                                                                          | Infinite scroll & pagination.             |
| `useQueries`       | Parallel queries                | Array of query objects                                                                                              | Dùng khi cần fetch nhiều query đồng thời. |

**Tips**:

* `staleTime`: dữ liệu được coi là "fresh" trong thời gian này.
* `cacheTime`: dữ liệu bị loại khỏi cache sau thời gian này nếu không dùng.
* `enabled: boolean`: kiểm soát query có chạy hay không.

---

## **2️⃣ Mutation Hooks**

| Hook          | Mục đích             | Key Options                                                            | Notes                               |
| ------------- | -------------------- | ---------------------------------------------------------------------- | ----------------------------------- |
| `useMutation` | Thêm/sửa/xóa dữ liệu | `mutationFn`, `onMutate`, `onError`, `onSuccess`, `onSettled`, `retry` | Dùng cho CRUD + Optimistic Updates. |

**Patterns**:

* **Optimistic Update + Rollback**:

```ts
onMutate: async (variables) => {
  await queryClient.cancelQueries(['posts']);
  const previous = queryClient.getQueryData(['posts']);
  queryClient.setQueryData(['posts'], old => [...old, newItem]);
  return { previous };
},
onError: (err, variables, context) => queryClient.setQueryData(['posts'], context?.previous),
onSettled: () => queryClient.invalidateQueries(['posts'])
```

---

## **3️⃣ Prefetching & Background Updates**

* `queryClient.prefetchQuery(queryKey, queryFn, options)` → fetch dữ liệu trước khi user cần.
* `refetchOnWindowFocus: true` → tự refetch khi tab focus.
* `refetchInterval: ms` → tự refetch theo interval.
* Kết hợp **prefetch + infinite query + background update** giúp UX mượt.

---

## **4️⃣ QueryClient & Global Config**

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60,
      onError: (err) => console.error(err),
    },
    mutations: {
      retry: 1,
      onError: (err) => console.error(err),
    },
  },
});
```

* Global retry + error handling giúp maintainable.
* Sử dụng `QueryClientProvider` bọc toàn app.

---

## **5️⃣ Infinite Scroll / Pagination**

```ts
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
  ['posts', userId],
  ({ pageParam = 1 }) => fetchPosts(userId, pageParam),
  { getNextPageParam: (lastPage, pages) => lastPage.length ? pages.length + 1 : undefined }
);
```

* `getNextPageParam` quyết định page tiếp theo.
* Kết hợp với prefetch & background update.

---

## **6️⃣ Error Handling & Retry Strategies**

* **Query errors**:

```ts
useQuery(['posts'], fetchPosts, { retry: 2, onError: (err) => alert(err.message) });
```

* **Mutation errors**:

```ts
useMutation(deletePost, {
  onMutate: optimisticUpdate,
  onError: rollback,
  onSettled: invalidateQueries
})
```

* **Global Error Handling**: dùng `defaultOptions` trong `QueryClient`.

---

## **7️⃣ Optimistic Updates Patterns**

* **Add item**: thêm vào cache trước khi server trả về.
* **Edit item**: cập nhật cache ngay khi mutation trigger.
* **Delete item**: remove cache ngay khi mutation trigger.
* **Rollback**: restore cache nếu mutation thất bại.

---

## **8️⃣ Testing với MSW**

* **Setup server**:

```ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';
export const server = setupServer(...handlers);
```

* **Test useQuery**:

```ts
await waitFor(() => expect(screen.getByText(/Test Post/i)).toBeInTheDocument());
```

* **Test useMutation**:

```ts
fireEvent.click(screen.getByText(/Add Post/i));
await waitFor(() => expect(screen.getByText(/New Post/i)).toBeInTheDocument());
```

---

## **9️⃣ Deployment Checklist**

1. Build: `npm run build`
2. Vercel: `vercel --prod`
3. Netlify: Connect GitHub → Build Command: `npm run build` → Publish: `build/`
4. Kiểm tra CRUD, infinite scroll, background updates, error handling.

---

## **🔟 Best Practices**

* Sử dụng **queryKey tường minh**: `['posts', userId]`
* Dùng **staleTime + cacheTime** hợp lý.
* Kết hợp **prefetch + infiniteQuery + background update**.
* Luôn xử lý **errors** và **optimistic updates**.
* **Global config** cho retry & error handling.
* Test queries/mutations với MSW trước khi deploy.

---

✅ **Cheatsheet này đủ để bạn tra cứu nhanh tất cả hook, options, patterns, best practices trong 10 ngày học TanStack Query**.

---
