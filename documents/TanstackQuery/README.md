# **Khóa Học TanStack Query (React Query) – Advanced, Production-ready**

## **Module 1: Giới thiệu và Setup (1 giờ)**

### **Mục tiêu**

* Hiểu tổng quan về TanStack Query (Server State Management).
* Cài đặt và cấu hình môi trường React + TypeScript.
* Thiết lập `QueryClient` và `QueryClientProvider`.

### **Nội dung**

* TanStack Query khác gì so với Axios/Fetch.
* Khái niệm `QueryClient`, `QueryClientProvider`.
* Cấu hình React Query Devtools.

```ts
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MyComponent />
    </QueryClientProvider>
  );
}
```

### **Bài tập**

* **Level 1**: Setup project và fetch danh sách users từ `https://jsonplaceholder.typicode.com/users`.
* **Level 2**: Thêm loading & error UI.
* **Level 3**: Cấu hình global defaults (`staleTime`, `cacheTime`) và Devtools.

---

## **Module 2: Core Concepts – Queries cơ bản (1.5 giờ)**

### **Mục tiêu**

* Sử dụng thành thạo hook `useQuery`.
* Quản lý trạng thái `loading`, `error`, `data`.
* Hiểu caching, refetching, queryKey.

### **Nội dung**

```ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function Users() {
  const { data, error, isLoading } = useQuery(['users'], async () => {
    const res = await axios.get('https://jsonplaceholder.typicode.com/users');
    return res.data;
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return <ul>{data.map((user: any) => <li key={user.id}>{user.name}</li>)}</ul>;
}
```

* **queryKey**: định danh query.
* **staleTime & cacheTime**: tối ưu performance & giảm request.
* Refetching tự động & manual refetch.

### **Bài tập**

* Level 1: Hiển thị danh sách users.
* Level 2: Thêm nút `Refetch` và chỉnh `staleTime`.
* Level 3: Prefetch dữ liệu cho một user trước khi mở chi tiết.

---

## **Module 3: Mutations – Cập nhật dữ liệu (1 giờ)**

### **Mục tiêu**

* Thêm, sửa, xóa dữ liệu với `useMutation`.
* Optimistic updates để UX mượt mà.
* Invalidate query để refresh dữ liệu sau mutation.

```ts
const mutation = useMutation(addUser, {
  onSuccess: () => queryClient.invalidateQueries(['users']),
});
```

### **Bài tập**

* Level 1: Thêm user mới.
* Level 2: Optimistic update với rollback on error.
* Level 3: CRUD đầy đủ (Add/Edit/Delete) với validation.

---

## **Module 4: Advanced Features (2 giờ)**

* Dependent Queries: query phụ thuộc dữ liệu query khác.
* Parallel Queries: fetch nhiều query cùng lúc.
* Pagination & Infinite Queries (`useInfiniteQuery`).
* Polling & Prefetching.
* Suspense integration.

### **Bài tập**

* Level 1: Fetch posts theo userId (dependent query).
* Level 2: Infinite scroll danh sách posts.
* Level 3: Parallel fetch users + todos + posts, hiển thị dashboard.

---

## **Module 5: Tích hợp & Best Practices (1.5 giờ)**

* Global query config: `defaultOptions`, `retry`, `refetchOnWindowFocus`.
* Tích hợp authentication (JWT token).
* Global error handling.
* Testing với MSW & React Testing Library.
* DevTools & performance optimization.

### **Bài tập**

* Level 1: Config global defaults & Devtools.
* Level 2: Tích hợp TanStack Query với Next.js.
* Level 3: Test các queries & mutations, mô phỏng server error.

---

## **Module 6: Dự án thực tế và Kết thúc (1 giờ)**

* Xây dashboard đầy đủ:

  * Users, Posts, CRUD, Infinite scroll.
  * Optimistic updates & error handling.
* Deploy lên Vercel/Netlify.
* Tổng kết & tài nguyên học tập bổ sung.

### **Bài tập cuối khóa**

* Level 1: Hiển thị danh sách users + posts.
* Level 2: Thêm sửa xóa users/posts với optimistic update.
* Level 3: Pagination/infinite scroll + dependent queries + testing.

---

## **Kiến thức đạt được sau khóa học**

* Hiểu và sử dụng TanStack Query trong quản lý server state.
* Thành thạo các hook: `useQuery`, `useMutation`, `useInfiniteQuery`.
* Áp dụng caching, refetching, optimistic update để tối ưu UX.
* Xử lý dependent queries, parallel queries, infinite scroll.
* Tích hợp auth, global error handling, testing.
* Nắm best practices: queryKey, performance optimization, DevTools.
* Xây dựng và deploy ứng dụng thực tế, production-ready.

---
