# **Day 6: Advanced Caching & Optimistic Updates**

### **Mục tiêu**

* Hiểu các **chiến lược caching nâng cao** (`staleTime`, `cacheTime`, `refetchOnWindowFocus`).
* Thực hành **Optimistic Updates**: UI thay đổi ngay trước khi server phản hồi.
* Rollback dữ liệu khi mutation thất bại.
* Sử dụng **queryClient.setQueryData** để cập nhật cache thủ công.

---

## **1️⃣ Advanced Caching**

```ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Post { id: number; title: string; }

async function fetchPosts() {
  const res = await axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts');
  return res.data;
}

function Posts() {
  const { data, isLoading, isError } = useQuery(['posts'], fetchPosts, {
    staleTime: 1000 * 60 * 2,          // 2 phút: dữ liệu tươi
    cacheTime: 1000 * 60 * 10,         // 10 phút: giữ cache khi unmount
    refetchOnWindowFocus: false,       // không tự refetch khi tab focus
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading posts!</p>;

  return (
    <ul>
      {data?.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}
```

**Tips**:

* `staleTime` giúp giảm số lần request không cần thiết.
* `cacheTime` giữ dữ liệu trong bộ nhớ, tránh fetch lại khi component remount.
* `refetchOnWindowFocus` kiểm soát auto-refetch.

---

## **2️⃣ Optimistic Updates – Add Post Example**

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Post { id: number; title: string; }

async function addPost(newPost: { title: string }) {
  const res = await axios.post<Post>('https://jsonplaceholder.typicode.com/posts', newPost);
  return res.data;
}

function AddPostButton() {
  const queryClient = useQueryClient();

  const mutation = useMutation(addPost, {
    onMutate: async (newPost) => {
      await queryClient.cancelQueries(['posts']);

      const previousPosts = queryClient.getQueryData<Post[]>(['posts']);

      // Optimistic update: thêm mới vào cache
      queryClient.setQueryData(['posts'], old => [...(old || []), { id: Date.now(), ...newPost }]);

      return { previousPosts };
    },
    onError: (err, newPost, context) => {
      // Rollback nếu lỗi
      queryClient.setQueryData(['posts'], context?.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['posts']);
    },
  });

  return <button onClick={() => mutation.mutate({ title: 'New Post' })}>Add Post</button>;
}
```

**Giải thích**:

* `onMutate`: chạy trước khi request gửi đi, cập nhật UI ngay.
* `onError`: rollback nếu mutation thất bại.
* `onSettled`: refresh query sau khi mutation xong.

---

## **3️⃣ Optimistic Update – Delete Post Example**

```ts
function DeletePostButton({ postId }: { postId: number }) {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async () => axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`),
    {
      onMutate: async () => {
        await queryClient.cancelQueries(['posts']);
        const previousPosts = queryClient.getQueryData<Post[]>(['posts']);
        queryClient.setQueryData(['posts'], old => old?.filter(post => post.id !== postId));
        return { previousPosts };
      },
      onError: (err, variables, context) => {
        queryClient.setQueryData(['posts'], context?.previousPosts);
      },
      onSettled: () => {
        queryClient.invalidateQueries(['posts']);
      },
    }
  );

  return <button onClick={() => mutation.mutate()}>Delete Post</button>;
}
```

---

## **4️⃣ Bài tập**

| Level | Nội dung                  | Yêu cầu                                                                      |
| ----- | ------------------------- | ---------------------------------------------------------------------------- |
| 1     | Cấu hình advanced caching | Sử dụng `staleTime`, `cacheTime`, `refetchOnWindowFocus` cho posts           |
| 2     | Optimistic Add            | Thêm post mới ngay lập tức vào UI, rollback khi lỗi                          |
| 3     | Full Optimistic CRUD      | Add/Edit/Delete posts, rollback khi mutation lỗi, refresh cache sau mutation |

---

### ✅ **Key Takeaways Day 6**

* Cấu hình caching nâng cao giúp giảm request, tăng performance.
* Optimistic Updates giúp UX mượt mà, cần rollback khi lỗi.
* `queryClient.setQueryData` là cách trực tiếp cập nhật cache.
* `invalidateQueries` đảm bảo dữ liệu luôn đồng bộ với server.

---



## **Level 1: Advanced Caching – Configuring `staleTime`, `cacheTime`**

```ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Post { id: number; title: string; }

async function fetchPosts() {
  const res = await axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts');
  return res.data;
}

function CachedPosts() {
  const { data, isLoading, isError } = useQuery(['posts'], fetchPosts, {
    staleTime: 1000 * 60 * 2,          // 2 phút dữ liệu tươi
    cacheTime: 1000 * 60 * 10,         // 10 phút giữ cache
    refetchOnWindowFocus: false,       // không auto refetch
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching posts!</p>;

  return (
    <ul>
      {data?.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}
```

**Giải thích:**

* `staleTime` giảm fetch thừa khi dữ liệu còn “tươi”.
* `cacheTime` giữ dữ liệu trong cache khi component unmount.
* `refetchOnWindowFocus` kiểm soát auto-refetch khi tab focus.

---

## **Level 2: Optimistic Add Post**

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Post { id: number; title: string; }

async function addPost(newPost: { title: string }) {
  const res = await axios.post<Post>('https://jsonplaceholder.typicode.com/posts', newPost);
  return res.data;
}

function AddPost() {
  const queryClient = useQueryClient();

  const mutation = useMutation(addPost, {
    onMutate: async (newPost) => {
      await queryClient.cancelQueries(['posts']);
      const previousPosts = queryClient.getQueryData<Post[]>(['posts']);

      // Optimistic update: thêm ngay vào cache
      queryClient.setQueryData(['posts'], old => [...(old || []), { id: Date.now(), ...newPost }]);
      return { previousPosts };
    },
    onError: (err, newPost, context) => {
      queryClient.setQueryData(['posts'], context?.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['posts']);
    },
  });

  return <button onClick={() => mutation.mutate({ title: 'New Post' })}>Add Post</button>;
}
```

**Giải thích:**

* UI cập nhật ngay khi click Add.
* Nếu server lỗi, rollback về dữ liệu cũ.
* Cache tự động refresh sau mutation.

---

## **Level 3: Full Optimistic CRUD (Add/Edit/Delete)**

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Post { id: number; title: string; }

const queryKey = ['posts'];

function usePostsMutations() {
  const queryClient = useQueryClient();

  const addPostMutation = useMutation(
    (newPost: { title: string }) => axios.post<Post>('https://jsonplaceholder.typicode.com/posts', newPost).then(r => r.data),
    {
      onMutate: async (newPost) => {
        await queryClient.cancelQueries(queryKey);
        const previousPosts = queryClient.getQueryData<Post[]>(queryKey);
        queryClient.setQueryData(queryKey, old => [...(old || []), { id: Date.now(), ...newPost }]);
        return { previousPosts };
      },
      onError: (err, newPost, context) => {
        queryClient.setQueryData(queryKey, context?.previousPosts);
      },
      onSettled: () => {
        queryClient.invalidateQueries(queryKey);
      },
    }
  );

  const deletePostMutation = useMutation(
    (postId: number) => axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`),
    {
      onMutate: async (postId) => {
        await queryClient.cancelQueries(queryKey);
        const previousPosts = queryClient.getQueryData<Post[]>(queryKey);
        queryClient.setQueryData(queryKey, old => old?.filter(post => post.id !== postId));
        return { previousPosts };
      },
      onError: (err, postId, context) => {
        queryClient.setQueryData(queryKey, context?.previousPosts);
      },
      onSettled: () => queryClient.invalidateQueries(queryKey),
    }
  );

  const editPostMutation = useMutation(
    ({ id, title }: { id: number; title: string }) =>
      axios.put<Post>(`https://jsonplaceholder.typicode.com/posts/${id}`, { title }).then(r => r.data),
    {
      onMutate: async ({ id, title }) => {
        await queryClient.cancelQueries(queryKey);
        const previousPosts = queryClient.getQueryData<Post[]>(queryKey);
        queryClient.setQueryData(queryKey, old =>
          old?.map(post => (post.id === id ? { ...post, title } : post))
        );
        return { previousPosts };
      },
      onError: (err, variables, context) => {
        queryClient.setQueryData(queryKey, context?.previousPosts);
      },
      onSettled: () => queryClient.invalidateQueries(queryKey),
    }
  );

  return { addPostMutation, deletePostMutation, editPostMutation };
}
```

**Giải thích Level 3:**

* Add/Edit/Delete đều sử dụng **optimistic update** + rollback.
* `onSettled` luôn invalidate queries để dữ liệu đồng bộ với server.
* Tách mutations ra hook riêng giúp **maintainability** và **reuse**.

---
