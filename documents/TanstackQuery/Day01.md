# **Day 1: Giới thiệu & Setup TanStack Query (React Query)**

### **Mục tiêu**

* Hiểu TanStack Query là gì và vai trò trong quản lý server state.
* Cài đặt môi trường React + TypeScript + TanStack Query.
* Setup `QueryClient` & `QueryClientProvider`.
* Kết nối DevTools để debug queries.

---

### **1️⃣ Cài đặt**

```bash
# React + TypeScript
npx create-react-app my-app --template typescript
cd my-app

# TanStack Query & Axios
npm install @tanstack/react-query axios @tanstack/react-query-devtools
```

---

### **2️⃣ Setup QueryClient**

```ts
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 phút
      cacheTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
```

**Tips:**

* `staleTime` = thời gian dữ liệu được xem là “fresh”, tránh refetch liên tục.
* `cacheTime` = thời gian query giữ dữ liệu trong cache sau khi component unmount.
* DevTools giúp bạn debug queries & mutations dễ dàng.

---

### **3️⃣ Bài tập**

| Level | Nội dung                                      | Yêu cầu                                                                                             |
| ----- | --------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 1     | Setup project và fetch danh sách users        | Dùng `axios.get('https://jsonplaceholder.typicode.com/users')`, hiển thị tên user trong `<ul>`      |
| 2     | Thêm loading & error UI                       | Hiển thị `Loading...` khi isLoading, hiển thị error message khi có lỗi                              |
| 3     | Cấu hình `staleTime`, `cacheTime` và DevTools | Chỉnh `staleTime = 2 phút`, `cacheTime = 10 phút` và quan sát caching khi unmount/remount component |

**Gợi ý code Level 1**

```ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function Users() {
  const { data } = useQuery(['users'], async () => {
    const res = await axios.get('https://jsonplaceholder.typicode.com/users');
    return res.data;
  });

  return (
    <ul>
      {data?.map((user: any) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

export default Users;
```

**Gợi ý Level 2 (loading + error)**

```ts
const { data, isLoading, isError, error } = useQuery(['users'], fetchUsers);

if (isLoading) return <p>Loading...</p>;
if (isError) return <p>Error: {(error as Error).message}</p>;
```

---

### ✅ **Key Takeaways Day 1**

* TanStack Query giúp quản lý server state dễ dàng hơn React state thông thường.
* `QueryClient` & `QueryClientProvider` là nền tảng mọi query.
* `staleTime` & `cacheTime` là cơ chế caching quan trọng.
* DevTools giúp quan sát queries, mutations & performance.

---
