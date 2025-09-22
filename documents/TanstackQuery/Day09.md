# **Day 9: Full CRUD Dashboard**

### **Mục tiêu**

* Xây dựng dashboard **Users + Posts** với full CRUD.
* Áp dụng tất cả kiến thức: **useQuery, useMutation, useInfiniteQuery, Optimistic Updates, Caching, Prefetching, Background Updates, Error Handling**.
* Triển khai code production-ready, dễ maintain.

---

## **Level 1: Read (List) + Caching + Background Updates**

```ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface User { id: number; name: string; }
interface Post { id: number; title: string; userId: number; }

async function fetchUsers() {
  const res = await axios.get<User[]>('https://jsonplaceholder.typicode.com/users');
  return res.data;
}

async function fetchPosts(userId: number) {
  const res = await axios.get<Post[]>(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
  return res.data;
}

function DashboardLevel1() {
  const { data: users } = useQuery(['users'], fetchUsers, {
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const { data: posts } = useQuery(
    ['posts', selectedUserId],
    () => fetchPosts(selectedUserId!),
    { enabled: !!selectedUserId, staleTime: 1000 * 60 }
  );

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users?.map(u => (
          <li key={u.id} onClick={() => setSelectedUserId(u.id)}>{u.name}</li>
        ))}
      </ul>

      {selectedUserId && (
        <div>
          <h2>Posts</h2>
          <ul>
            {posts?.map(p => <li key={p.id}>{p.title}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
```

**Giải thích:**

* Level 1: chỉ **read** data + caching + background updates.

---

## **Level 2: Full CRUD with Optimistic Updates**

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

function usePostsMutations(userId: number) {
  const queryClient = useQueryClient();

  const addPost = useMutation(
    (title: string) => axios.post('https://jsonplaceholder.typicode.com/posts', { title, userId }),
    {
      onMutate: async (title) => {
        await queryClient.cancelQueries(['posts', userId]);
        const previousPosts = queryClient.getQueryData<Post[]>(['posts', userId]);
        queryClient.setQueryData(['posts', userId], old => [...(old || []), { id: Date.now(), title, userId }]);
        return { previousPosts };
      },
      onError: (err, title, context) => queryClient.setQueryData(['posts', userId], context?.previousPosts),
      onSettled: () => queryClient.invalidateQueries(['posts', userId]),
    }
  );

  const deletePost = useMutation(
    (postId: number) => axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`),
    {
      onMutate: async (postId) => {
        await queryClient.cancelQueries(['posts', userId]);
        const previousPosts = queryClient.getQueryData<Post[]>(['posts', userId]);
        queryClient.setQueryData(['posts', userId], old => old?.filter(p => p.id !== postId));
        return { previousPosts };
      },
      onError: (err, postId, context) => queryClient.setQueryData(['posts', userId], context?.previousPosts),
      onSettled: () => queryClient.invalidateQueries(['posts', userId]),
    }
  );

  const editPost = useMutation(
    ({ id, title }: { id: number; title: string }) => axios.put(`https://jsonplaceholder.typicode.com/posts/${id}`, { title }),
    {
      onMutate: async ({ id, title }) => {
        await queryClient.cancelQueries(['posts', userId]);
        const previousPosts = queryClient.getQueryData<Post[]>(['posts', userId]);
        queryClient.setQueryData(['posts', userId], old => old?.map(p => (p.id === id ? { ...p, title } : p)));
        return { previousPosts };
      },
      onError: (err, vars, context) => queryClient.setQueryData(['posts', userId], context?.previousPosts),
      onSettled: () => queryClient.invalidateQueries(['posts', userId]),
    }
  );

  return { addPost, deletePost, editPost };
}
```

**Giải thích:**

* Level 2: full CRUD với **Optimistic Updates + Rollback + cache invalidate**.

---

## **Level 3: Infinite Scroll + Prefetching + Background Updates**

```ts
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

function useInfinitePosts(userId: number) {
  const queryClient = useQueryClient();

  const prefetchPosts = () => {
    queryClient.prefetchInfiniteQuery(['userPosts', userId], ({ pageParam = 1 }) => 
      axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}&_page=${pageParam}&_limit=5`).then(res => res.data)
    );
  };

  const infiniteQuery = useInfiniteQuery(
    ['userPosts', userId],
    ({ pageParam = 1 }) => axios.get<Post[]>(`https://jsonplaceholder.typicode.com/posts?userId=${userId}&_page=${pageParam}&_limit=5`).then(res => res.data),
    {
      getNextPageParam: (lastPage, pages) => (lastPage.length < 5 ? undefined : pages.length + 1),
      enabled: !!userId,
      refetchOnWindowFocus: true,
      refetchInterval: 1000 * 30,
    }
  );

  return { infiniteQuery, prefetchPosts };
}
```

**Giải thích Level 3:**

* Infinite scroll cho posts.
* Prefetch posts trước khi click.
* Background updates mỗi 30s + tab focus.

---

## **Tổng kết**

* Level 1: **Read + Caching + Background Updates**
* Level 2: **Full CRUD + Optimistic Updates**
* Level 3: **Infinite Scroll + Prefetch + Background Updates**

---


## **Level 1: Read + Caching + Background Updates**

```ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

interface User { id: number; name: string; }
interface Post { id: number; title: string; userId: number; }

async function fetchUsers() {
  const res = await axios.get<User[]>('https://jsonplaceholder.typicode.com/users');
  return res.data;
}

async function fetchPosts(userId: number) {
  const res = await axios.get<Post[]>(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
  return res.data;
}

export function DashboardLevel1() {
  const { data: users } = useQuery(['users'], fetchUsers, {
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { data: posts, isLoading, isError } = useQuery(
    ['posts', selectedUserId],
    () => fetchPosts(selectedUserId!),
    { enabled: !!selectedUserId, staleTime: 1000 * 60 }
  );

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users?.map(u => (
          <li key={u.id} onClick={() => setSelectedUserId(u.id)}>
            {u.name}
          </li>
        ))}
      </ul>

      {selectedUserId && (
        <div>
          <h2>Posts</h2>
          {isLoading ? (
            <p>Loading posts...</p>
          ) : isError ? (
            <p>Error loading posts!</p>
          ) : (
            <ul>
              {posts?.map(p => (
                <li key={p.id}>{p.title}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
```

**Level 1:** Hiển thị danh sách Users và Posts, áp dụng caching và background update.

---

## **Level 2: Full CRUD with Optimistic Updates**

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Post { id: number; title: string; userId: number; }

export function usePostsMutations(userId: number) {
  const queryClient = useQueryClient();

  const addPost = useMutation(
    (title: string) => axios.post('https://jsonplaceholder.typicode.com/posts', { title, userId }),
    {
      onMutate: async (title) => {
        await queryClient.cancelQueries(['posts', userId]);
        const previousPosts = queryClient.getQueryData<Post[]>(['posts', userId]);
        queryClient.setQueryData(['posts', userId], old => [...(old || []), { id: Date.now(), title, userId }]);
        return { previousPosts };
      },
      onError: (err, title, context) => queryClient.setQueryData(['posts', userId], context?.previousPosts),
      onSettled: () => queryClient.invalidateQueries(['posts', userId]),
    }
  );

  const deletePost = useMutation(
    (postId: number) => axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`),
    {
      onMutate: async (postId) => {
        await queryClient.cancelQueries(['posts', userId]);
        const previousPosts = queryClient.getQueryData<Post[]>(['posts', userId]);
        queryClient.setQueryData(['posts', userId], old => old?.filter(p => p.id !== postId));
        return { previousPosts };
      },
      onError: (err, postId, context) => queryClient.setQueryData(['posts', userId], context?.previousPosts),
      onSettled: () => queryClient.invalidateQueries(['posts', userId]),
    }
  );

  const editPost = useMutation(
    ({ id, title }: { id: number; title: string }) =>
      axios.put(`https://jsonplaceholder.typicode.com/posts/${id}`, { title }),
    {
      onMutate: async ({ id, title }) => {
        await queryClient.cancelQueries(['posts', userId]);
        const previousPosts = queryClient.getQueryData<Post[]>(['posts', userId]);
        queryClient.setQueryData(['posts', userId], old => old?.map(p => (p.id === id ? { ...p, title } : p)));
        return { previousPosts };
      },
      onError: (err, variables, context) => queryClient.setQueryData(['posts', userId], context?.previousPosts),
      onSettled: () => queryClient.invalidateQueries(['posts', userId]),
    }
  );

  return { addPost, deletePost, editPost };
}
```

**Level 2:** Thêm, xóa, sửa post với **Optimistic Updates + Rollback + Cache Invalidate**.

---

## **Level 3: Infinite Scroll + Prefetch + Background Updates**

```ts
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Post { id: number; title: string; }

export function useInfinitePosts(userId: number) {
  const queryClient = useQueryClient();

  const prefetchPosts = () => {
    queryClient.prefetchInfiniteQuery(['userPosts', userId], ({ pageParam = 1 }) =>
      axios
        .get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}&_page=${pageParam}&_limit=5`)
        .then(res => res.data)
    );
  };

  const infiniteQuery = useInfiniteQuery(
    ['userPosts', userId],
    ({ pageParam = 1 }) =>
      axios
        .get<Post[]>(`https://jsonplaceholder.typicode.com/posts?userId=${userId}&_page=${pageParam}&_limit=5`)
        .then(res => res.data),
    {
      getNextPageParam: (lastPage, pages) => (lastPage.length < 5 ? undefined : pages.length + 1),
      enabled: !!userId,
      refetchOnWindowFocus: true,
      refetchInterval: 1000 * 30,
    }
  );

  return { infiniteQuery, prefetchPosts };
}
```

**Level 3:**

* Infinite scroll cho posts.
* Prefetch data trước khi click user.
* Background updates mỗi 30s + khi tab focus.

---

### ✅ **Key Takeaways Day 9**

* Kết hợp toàn bộ kiến thức TanStack Query: caching, refetch, optimistic updates, rollback, prefetch, infinite query, error handling.
* Code maintainable, production-ready.
* Level 1 → 3 tương ứng: **Read → Full CRUD → Infinite Scroll + Prefetch + Background Updates**.

---
