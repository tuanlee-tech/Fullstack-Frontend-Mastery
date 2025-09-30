# **Day 2: useQuery – Fetch dữ liệu cơ bản**

### **Mục tiêu**

* Hiểu hook `useQuery` và cách fetch dữ liệu từ server.
* Quản lý trạng thái `loading`, `error`, `data`.
* Hiểu cơ chế caching, refetching, queryKey.

---

### **1️⃣ useQuery cơ bản**

```ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

async function fetchUsers() {
  const res = await axios.get('https://jsonplaceholder.typicode.com/users');
  return res.data;
}

function Users() {
  const { data, isLoading, isError, error, refetch } = useQuery(['users'], fetchUsers);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error instanceof Error ? error.message : 'Unknown'}</p>;

  return (
    <div>
      <button onClick={() => refetch()}>Refetch Users</button>
      <ul>
        {data.map((user: any) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
```

**Tips:**

* `queryKey` giúp TanStack Query xác định dữ liệu trong cache.
* `refetch()` cho phép fetch lại dữ liệu thủ công.
* `isLoading` = true khi lần fetch đầu tiên.
* `isFetching` = true khi đang fetch lại dữ liệu (ví dụ refetch hoặc background update).

---

### **2️⃣ Cấu hình nâng cao**

```ts
const { data } = useQuery(['users'], fetchUsers, {
  staleTime: 60000, // 1 phút
  cacheTime: 300000, // 5 phút
  refetchOnWindowFocus: false, // không tự refetch khi focus window
});
```

* `staleTime` = dữ liệu còn “tươi” → tránh fetch liên tục.
* `cacheTime` = dữ liệu giữ trong cache khi component unmount.
* `refetchOnWindowFocus` = kiểm soát behavior khi tab browser active.

---

### **3️⃣ Bài tập**

| Level | Nội dung                            | Yêu cầu                                                                          |
| ----- | ----------------------------------- | -------------------------------------------------------------------------------- |
| 1     | Hiển thị danh sách users            | Fetch dữ liệu từ API và render `<ul>`                                            |
| 2     | Thêm nút Refetch & loading/error UI | Khi click nút, fetch lại dữ liệu; hiển thị loading/error                         |
| 3     | Prefetch user detail                | Khi hover vào user name, prefetch chi tiết user bằng `queryClient.prefetchQuery` |

**Gợi ý Level 3: Prefetch**

```ts
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

const handleHover = (userId: number) => {
  queryClient.prefetchQuery(['user', userId], () => fetchUserById(userId));
};
```

---

### ✅ **Key Takeaways Day 2**

* `useQuery` là hook fetch dữ liệu mạnh mẽ, quản lý trạng thái loading, error, data.
* Caching & staleTime giúp giảm request không cần thiết.
* `refetch` & `prefetchQuery` tăng UX, giúp dữ liệu luôn sẵn sàng.
* queryKey quan trọng để cache và invalidate dữ liệu.

---