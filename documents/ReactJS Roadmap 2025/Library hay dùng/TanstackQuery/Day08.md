# **Day 8: Error Handling & Retry Strategies**

### **Mục tiêu**

* Hiểu cách **bắt lỗi** khi fetch/mutation.
* Cấu hình **retry** để tự động thử lại khi request thất bại.
* Xử lý **global error** & hiển thị thông báo phù hợp.
* Sử dụng **onError**, **onSettled**, **queryClient.setQueryData** để rollback hoặc alert user.

---

## **1️⃣ Basic Error Handling – useQuery**

```ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Post { id: number; title: string; }

async function fetchPosts() {
  const res = await axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts');
  return res.data;
}

function PostsWithErrorHandling() {
  const { data, isLoading, isError, error } = useQuery(['posts'], fetchPosts, {
    retry: 2, // thử lại tối đa 2 lần nếu lỗi
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {(error as any)?.message || 'Unknown error'}</p>;

  return (
    <ul>
      {data?.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}
```

**Giải thích:**

* `isError` + `error` cho phép hiển thị thông báo cụ thể.
* `retry: 2` tự động thử lại 2 lần khi request thất bại.

---

## **2️⃣ Error Handling trong useMutation (Rollback)**

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Post { id: number; title: string; }

async function deletePost(postId: number) {
  await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
}

function DeletePostButton({ postId }: { postId: number }) {
  const queryClient = useQueryClient();

  const mutation = useMutation(() => deletePost(postId), {
    onMutate: async () => {
      await queryClient.cancelQueries(['posts']);
      const previousPosts = queryClient.getQueryData<Post[]>(['posts']);
      queryClient.setQueryData(['posts'], old => old?.filter(post => post.id !== postId));
      return { previousPosts };
    },
    onError: (err, variables, context) => {
      alert('Delete failed! Rolling back.');
      queryClient.setQueryData(['posts'], context?.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['posts']);
    },
    retry: 1, // thử lại 1 lần nếu lỗi
  });

  return <button onClick={() => mutation.mutate()}>Delete Post</button>;
}
```

**Giải thích:**

* Optimistic update + rollback nếu mutation thất bại.
* `retry` cho phép thử lại tự động trước khi rollback.
* Alert người dùng khi lỗi.

---

## **3️⃣ Global Error Handling**

```ts
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      onError: (error: unknown) => {
        console.error('Global Query Error:', error);
        alert('Something went wrong!'); // thông báo toàn cục
      },
    },
    mutations: {
      retry: 1,
      onError: (error: unknown) => {
        console.error('Global Mutation Error:', error);
      },
    },
  },
});

export function AppProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

**Giải thích:**

* `defaultOptions` cho phép cấu hình retry và onError global.
* Không cần khai báo riêng lẻ cho từng query/mutation.

---

## **4️⃣ Bài tập**

| Level | Nội dung       | Yêu cầu                                                                       |
| ----- | -------------- | ----------------------------------------------------------------------------- |
| 1     | Query error    | Hiển thị thông báo lỗi khi fetch posts thất bại, cấu hình retry 2 lần         |
| 2     | Mutation error | Delete post với optimistic update + rollback nếu lỗi, retry 1 lần             |
| 3     | Global error   | Cấu hình QueryClient global để bắt lỗi tất cả queries/mutations và alert user |

---

### ✅ **Key Takeaways Day 8**

* Bắt lỗi là bắt buộc để UX mượt mà và tránh crash UI.
* `retry` giúp tự động thử lại request thất bại.
* Optimistic update cần rollback khi mutation lỗi.
* Global error handling giúp quản lý lỗi đồng bộ và dễ maintain.

---


## **Level 1: Query Error – Hiển thị lỗi + retry**

```ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Post { id: number; title: string; }

async function fetchPosts() {
  // Giả lập API có thể fail
  const res = await axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts');
  if (!res.data) throw new Error('Failed to fetch posts');
  return res.data;
}

function PostsQueryError() {
  const { data, isLoading, isError, error } = useQuery(['posts'], fetchPosts, {
    retry: 2, // thử lại 2 lần
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {(error as any)?.message || 'Unknown error'}</p>;

  return (
    <ul>
      {data?.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}
```

**Giải thích:**

* `retry: 2` tự động thử lại 2 lần nếu fetch thất bại.
* `isError` + `error` dùng để hiển thị thông báo lỗi cho user.

---

## **Level 2: Mutation Error – Delete Post với rollback**

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Post { id: number; title: string; }

async function deletePost(postId: number) {
  // Giả lập API delete
  await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
}

function DeletePostButton({ postId }: { postId: number }) {
  const queryClient = useQueryClient();

  const mutation = useMutation(() => deletePost(postId), {
    onMutate: async () => {
      await queryClient.cancelQueries(['posts']);
      const previousPosts = queryClient.getQueryData<Post[]>(['posts']);
      queryClient.setQueryData(['posts'], old => old?.filter(post => post.id !== postId));
      return { previousPosts };
    },
    onError: (err, variables, context) => {
      alert('Delete failed! Rolling back.');
      queryClient.setQueryData(['posts'], context?.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['posts']);
    },
    retry: 1, // thử lại 1 lần
  });

  return <button onClick={() => mutation.mutate()}>Delete Post</button>;
}
```

**Giải thích:**

* Optimistic update: UI xóa post ngay lập tức.
* Rollback nếu lỗi xảy ra.
* `retry: 1` thử lại 1 lần trước khi rollback.

---

## **Level 3: Global Error Handling**

```ts
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      onError: (error: unknown) => {
        console.error('Global Query Error:', error);
        alert('Query failed! Please try again.');
      },
    },
    mutations: {
      retry: 1,
      onError: (error: unknown) => {
        console.error('Global Mutation Error:', error);
        alert('Mutation failed! Please try again.');
      },
    },
  },
});

export function AppProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

// Example component
async function fetchPosts() {
  const res = await axios.get('https://jsonplaceholder.typicode.com/posts');
  if (!res.data) throw new Error('Fetch posts failed');
  return res.data;
}

function PostsGlobalError() {
  const { data, isLoading } = useQuery(['posts'], fetchPosts);

  if (isLoading) return <p>Loading...</p>;
  return (
    <ul>
      {data?.map((post: any) => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}
```

**Giải thích Level 3:**

* Tất cả query/mutation đều dùng **global onError** + **retry**.
* Không cần khai báo riêng từng query/mutation, dễ maintain.
* Alert user và log lỗi console giúp debug nhanh.

---
