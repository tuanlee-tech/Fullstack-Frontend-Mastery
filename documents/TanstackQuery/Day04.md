# **Day 4: Dependent & Parallel Queries**

### **Mục tiêu**

* Hiểu **Dependent Queries**: fetch dữ liệu phụ thuộc dữ liệu của query khác.
* Hiểu **Parallel Queries**: fetch nhiều query cùng lúc.
* Thực hành **best practices**: `enabled`, queryKey rõ ràng, cache reuse.

---

## **1️⃣ Dependent Queries**

* Một query chỉ chạy khi dữ liệu phụ thuộc đã có.
* Sử dụng option `enabled: boolean` để kiểm soát.

```ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

async function fetchUser(userId: number) {
  const res = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`);
  return res.data;
}

async function fetchPostsByUser(userId: number) {
  const res = await axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
  return res.data;
}

function UserPosts({ userId }: { userId: number }) {
  const { data: user } = useQuery(['user', userId], () => fetchUser(userId));

  const { data: posts, isLoading: postsLoading } = useQuery(
    ['posts', userId],
    () => fetchPostsByUser(userId),
    { enabled: !!userId } // chỉ chạy khi userId tồn tại
  );

  if (!user) return <p>Loading user...</p>;
  if (postsLoading) return <p>Loading posts...</p>;

  return (
    <div>
      <h2>{user.name}'s Posts:</h2>
      <ul>
        {posts.map((post: any) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

**Tips Dependent Queries**:

* Dữ liệu phụ thuộc nên sử dụng `enabled` để tránh query lỗi khi param undefined.
* QueryKey phải unique & rõ ràng (`['posts', userId]`) để caching đúng.

---

## **2️⃣ Parallel Queries**

* Fetch nhiều query đồng thời.
* Dùng `useQueries` (mới trong v5) với mảng queries.

```ts
import { useQueries } from '@tanstack/react-query';

function Dashboard() {
  const results = useQueries({
    queries: [
      { queryKey: ['users'], queryFn: () => axios.get('https://jsonplaceholder.typicode.com/users').then(r => r.data) },
      { queryKey: ['todos'], queryFn: () => axios.get('https://jsonplaceholder.typicode.com/todos').then(r => r.data) },
      { queryKey: ['posts'], queryFn: () => axios.get('https://jsonplaceholder.typicode.com/posts').then(r => r.data) },
    ],
  });

  const [users, todos, posts] = results.map(r => r.data);

  if (results.some(r => r.isLoading)) return <p>Loading...</p>;
  if (results.some(r => r.isError)) return <p>Error fetching data!</p>;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Users: {users.length}</p>
      <p>Todos: {todos.length}</p>
      <p>Posts: {posts.length}</p>
    </div>
  );
}
```

**Tips Parallel Queries**:

* Parallel queries chạy cùng lúc, giảm tổng thời gian fetch.
* QueryKey phải unique để cache riêng từng query.
* `isLoading` / `isError` nên kiểm tra cho tất cả query.

---

## **3️⃣ Bài tập**

| Level | Nội dung        | Yêu cầu                                                                                              |
| ----- | --------------- | ---------------------------------------------------------------------------------------------------- |
| 1     | Dependent Query | Fetch posts theo `userId` (userId từ prop). Chỉ fetch khi userId tồn tại.                            |
| 2     | Parallel Query  | Fetch users + todos + posts song song, hiển thị tổng số lượng mỗi loại.                              |
| 3     | Kết hợp         | Xây dashboard: chọn user → hiển thị posts + todos của user, + fetch tổng quan tất cả data song song. |

---

### ✅ **Key Takeaways Day 4**

* **Dependent Query**: fetch dữ liệu có phụ thuộc, dùng `enabled`.
* **Parallel Query**: fetch nhiều query cùng lúc, tăng hiệu năng.
* **QueryKey**: luôn rõ ràng, tránh trùng lặp.
* Quản lý loading/error tốt giúp UX ổn định.

---


## **Level 1: Dependent Query – Fetch posts theo userId**

```ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface User {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
}

async function fetchUser(userId: number) {
  const res = await axios.get<User>(`https://jsonplaceholder.typicode.com/users/${userId}`);
  return res.data;
}

async function fetchPostsByUser(userId: number) {
  const res = await axios.get<Post[]>(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
  return res.data;
}

function UserPosts({ userId }: { userId: number }) {
  const { data: user, isLoading: userLoading } = useQuery(['user', userId], () => fetchUser(userId));

  const { data: posts, isLoading: postsLoading } = useQuery(
    ['posts', userId],
    () => fetchPostsByUser(userId),
    { enabled: !!userId } // chỉ chạy khi userId tồn tại
  );

  if (userLoading) return <p>Loading user...</p>;
  if (postsLoading) return <p>Loading posts...</p>;

  return (
    <div>
      <h2>{user?.name}'s Posts</h2>
      <ul>
        {posts?.map(post => <li key={post.id}>{post.title}</li>)}
      </ul>
    </div>
  );
}
```

**✅ Giải thích**:

* `enabled: !!userId` đảm bảo posts query không chạy khi userId chưa có.
* QueryKey `['posts', userId]` giúp cache posts theo từng user riêng biệt.

---

## **Level 2: Parallel Query – Fetch users + todos + posts**

```ts
import { useQueries } from '@tanstack/react-query';
import axios from 'axios';

interface User { id: number; name: string; }
interface Todo { id: number; title: string; completed: boolean; }
interface Post { id: number; title: string; }

function Dashboard() {
  const results = useQueries({
    queries: [
      { queryKey: ['users'], queryFn: () => axios.get<User[]>('https://jsonplaceholder.typicode.com/users').then(r => r.data) },
      { queryKey: ['todos'], queryFn: () => axios.get<Todo[]>('https://jsonplaceholder.typicode.com/todos').then(r => r.data) },
      { queryKey: ['posts'], queryFn: () => axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts').then(r => r.data) },
    ],
  });

  const [users, todos, posts] = results.map(r => r.data);

  if (results.some(r => r.isLoading)) return <p>Loading...</p>;
  if (results.some(r => r.isError)) return <p>Error fetching data!</p>;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Users: {users?.length}</p>
      <p>Todos: {todos?.length}</p>
      <p>Posts: {posts?.length}</p>
    </div>
  );
}
```

**✅ Giải thích**:

* `useQueries` nhận mảng queries để chạy song song.
* `results.map(r => r.data)` lấy dữ liệu từng query.
* Kiểm tra `isLoading` / `isError` cho tất cả query trước khi render.

---

## **Level 3: Kết hợp Dependent + Parallel – Dashboard nâng cao**

```ts
import { useQuery, useQueries, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface User { id: number; name: string; }
interface Todo { id: number; title: string; completed: boolean; }
interface Post { id: number; title: string; }

function AdvancedDashboard({ selectedUserId }: { selectedUserId: number }) {
  const queryClient = useQueryClient();

  // Parallel fetch tổng quan
  const overviewResults = useQueries({
    queries: [
      { queryKey: ['users'], queryFn: () => axios.get<User[]>('https://jsonplaceholder.typicode.com/users').then(r => r.data) },
      { queryKey: ['todos'], queryFn: () => axios.get<Todo[]>('https://jsonplaceholder.typicode.com/todos').then(r => r.data) },
      { queryKey: ['posts'], queryFn: () => axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts').then(r => r.data) },
    ],
  });

  // Dependent queries cho user detail
  const { data: user } = useQuery(['user', selectedUserId], () => axios.get<User>(`https://jsonplaceholder.typicode.com/users/${selectedUserId}`).then(r => r.data));

  const { data: userPosts } = useQuery(
    ['posts', selectedUserId],
    () => axios.get<Post[]>(`https://jsonplaceholder.typicode.com/posts?userId=${selectedUserId}`).then(r => r.data),
    { enabled: !!selectedUserId }
  );

  const [users, todos, posts] = overviewResults.map(r => r.data);

  if (overviewResults.some(r => r.isLoading) || !user) return <p>Loading...</p>;
  if (overviewResults.some(r => r.isError)) return <p>Error fetching overview!</p>;

  return (
    <div>
      <h2>Overview Dashboard</h2>
      <p>Total Users: {users?.length}</p>
      <p>Total Todos: {todos?.length}</p>
      <p>Total Posts: {posts?.length}</p>

      <h3>{user.name}'s Posts</h3>
      <ul>
        {userPosts?.map(post => <li key={post.id}>{post.title}</li>)}
      </ul>
    </div>
  );
}
```

**✅ Giải thích**:

* **Parallel**: fetch overview tổng quan.
* **Dependent**: fetch posts của user đã chọn.
* QueryKey rõ ràng: `['posts', selectedUserId]` + `['user', selectedUserId]`.
* Kiểm soát loading/error cho cả 2 loại query.

---
