# TanStack Query – Advanced Enterprise Cheatsheet

## 1️⃣ Project Architecture Patterns

**Folder Structure:**

```
src/
  api/
    posts.api.ts         // Encapsulate axios/fetch calls
    users.api.ts
  hooks/
    posts.hooks.ts       // Encapsulate TanStack Query hooks
    users.hooks.ts
  components/
    Posts/
      PostsList.tsx
      PostsForm.tsx
      PostsInfinite.tsx
  providers/
    QueryClientProvider.tsx
  utils/
    queryKeys.ts         // Centralized queryKey constants
    notifications.ts     // Global toast/alert
    errorHandler.ts      // Centralized error handling
  mocks/                 // MSW for testing
  pages/
```

**Enterprise Pattern:**
- Tách biệt **API calls**, **TanStack Query hooks**, và **UI components**.
- Sử dụng **centralized queryKeys** để tránh trùng lặp.
- Cấu trúc dễ maintain, scalable cho app enterprise.

---

## 2️⃣ Query Patterns – Enterprise Ready

### Centralized Query Keys
```ts
export const QUERY_KEYS = {
  USERS: ['users'] as const,
  POSTS: (userId: number) => ['posts', userId] as const,
};
```

### Query Hooks Pattern
```ts
import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '../api/posts.api';
import { QUERY_KEYS } from '../utils/queryKeys';

export const usePosts = (userId: number, options?: any) => {
  return useQuery({
    queryKey: QUERY_KEYS.POSTS(userId),
    queryFn: () => fetchPosts(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    ...options,
  });
};
```

**Enterprise Pattern:**
- Encapsulate `useQuery` trong hook riêng → reusable, configurable.
- Support **options override** để customize per-component.

---

## 3️⃣ Mutation Patterns – Optimistic Updates

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addPost, deletePost } from '../api/posts.api';
import { QUERY_KEYS } from '../utils/queryKeys';

export const usePostsMutations = (userId: number) => {
  const queryClient = useQueryClient();

  const add = useMutation({
    mutationFn: addPost,
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.POSTS(userId) });
      const previous = queryClient.getQueryData(QUERY_KEYS.POSTS(userId));
      queryClient.setQueryData(QUERY_KEYS.POSTS(userId), (old: any) => [...(old || []), newPost]);
      return { previous };
    },
    onError: (err, newPost, context) => queryClient.setQueryData(QUERY_KEYS.POSTS(userId), context?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POSTS(userId) }),
  });

  const remove = useMutation({
    mutationFn: deletePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.POSTS(userId) });
      const previous = queryClient.getQueryData(QUERY_KEYS.POSTS(userId));
      queryClient.setQueryData(QUERY_KEYS.POSTS(userId), (old: any) => old?.filter((p: any) => p.id !== postId));
      return { previous };
    },
    onError: (err, postId, context) => queryClient.setQueryData(QUERY_KEYS.POSTS(userId), context?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POSTS(userId) }),
  });

  return { add, remove };
};
```

**Enterprise Pattern:**
- **Optimistic updates + rollback** chuẩn hóa.
- **Centralized queryKey** → dễ maintain cho nhiều module.

---

## 4️⃣ Infinite Query / Pagination Patterns

```ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPostsPage } from '../api/posts.api';
import { QUERY_KEYS } from '../utils/queryKeys';

export const useInfinitePosts = (userId: number) => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.POSTS(userId),
    queryFn: ({ pageParam = 1 }) => fetchPostsPage(userId, pageParam),
    getNextPageParam: (lastPage, pages) => (lastPage.length < 10 ? undefined : pages.length + 1),
    initialPageParam: 1,
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });
};
```

**Enterprise Pattern:**
- `keepPreviousData` giúp UI mượt, giữ list cũ khi loading page mới.
- `staleTime` + `refetchOnWindowFocus` tối ưu background updates.

---

## 5️⃣ Prefetch / Background Updates Patterns

```ts
import { QueryClient } from '@tanstack/react-query';
import { fetchPosts } from '../api/posts.api';
import { QUERY_KEYS } from '../utils/queryKeys';

export const prefetchPosts = async (queryClient: QueryClient, userId: number) => {
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.POSTS(userId),
    queryFn: () => fetchPosts(userId),
  });
};
```

**Enterprise Pattern:**
- Prefetch trước khi user click → UX mượt.
- Background updates: dùng `refetchInterval` kết hợp `refetchOnWindowFocus`.

---

## 6️⃣ Global Error Handling & Notifications

```ts
import { QueryClient } from '@tanstack/react-query';
import { notifyError } from '../utils/notifications';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      onError: notifyError,
    },
    mutations: {
      retry: 1,
      onError: notifyError,
    },
  },
});

export const notifyError = (error: unknown) => {
  // Integration với Toast/Notification system
  console.error(error);
  alert(`Error: ${(error as any)?.message || 'Unknown error'}`);
};
```

**Enterprise Pattern:**
- Centralized error handling, tích hợp **toast/notification system**.
- Consistent UX across modules.

---

## 7️⃣ UI Components – Production-Ready Examples

### Users List + Select + Prefetch Posts
```ts
import { useUsers } from '../hooks/users.hooks';
import { useInfinitePosts } from '../hooks/posts.hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { PostsInfiniteList } from './PostsInfiniteList';

export const UsersSidebar: React.FC = () => {
  const { data: users, isLoading } = useUsers();
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const infiniteQuery = useInfinitePosts(selectedUserId || 0);

  if (isLoading) return <p>Loading users...</p>;

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <ul>
        {users?.map(user => (
          <li
            key={user.id}
            onMouseEnter={() => prefetchPosts(queryClient, user.id)} // Prefetch
            onClick={() => setSelectedUserId(user.id)}
            style={{ cursor: 'pointer', fontWeight: user.id === selectedUserId ? 'bold' : 'normal' }}
          >
            {user.name}
          </li>
        ))}
      </ul>
      <div>
        {selectedUserId && <PostsInfiniteList userId={selectedUserId} infiniteQuery={infiniteQuery} />}
      </div>
    </div>
  );
};
```

### Infinite Scroll Posts Component
```ts
import { useInfinitePosts } from '../hooks/posts.hooks';

interface Props {
  userId: number;
  infiniteQuery: ReturnType<typeof useInfinitePosts>;
}

export const PostsInfiniteList: React.FC<Props> = ({ userId, infiniteQuery }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = infiniteQuery;

  if (isLoading) return <p>Loading posts...</p>;

  return (
    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
      {data?.pages.map((page, i) => (
        <ul key={i}>
          {page.map(post => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      ))}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading more...' : 'Load more'}
        </button>
      )}
    </div>
  );
};
```

### CRUD Form with Optimistic Update
```ts
import { usePostsMutations } from '../hooks/posts.hooks';
import { useState } from 'react';

export const PostsForm: React.FC<{ userId: number }> = ({ userId }) => {
  const [title, setTitle] = useState('');
  const { add } = usePostsMutations(userId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    add.mutate({ title, userId }); // Optimistic update
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="New post title"
      />
      <button type="submit">Add Post</button>
      {add.isLoading && <span>Saving...</span>}
      {add.isError && <span style={{ color: 'red' }}>Error saving post!</span>}
    </form>
  );
};
```

### Delete & Edit Buttons with Optimistic Update
```ts
import { usePostsMutations } from '../hooks/posts.hooks';
import { useState } from 'react';

export const PostItem: React.FC<{ post: { id: number; title: string }; userId: number }> = ({ post, userId }) => {
  const { remove, edit } = usePostsMutations(userId);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(post.title);

  const handleEdit = () => {
    edit.mutate({ id: post.id, title: newTitle });
    setIsEditing(false);
  };

  return (
    <li>
      {isEditing ? (
        <>
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} />
          <button onClick={handleEdit}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <span>{post.title}</span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => remove.mutate(post.id)}>Delete</button>
        </>
      )}
    </li>
  );
};
```

### Global QueryClient Provider
```ts
import { QueryClient, QueryClientProvider as Provider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { notifyError } from '../utils/notifications';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      onError: notifyError,
    },
    mutations: {
      retry: 1,
      onError: notifyError,
    },
  },
});

export const AppQueryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <Provider client={queryClient}>{children}</Provider>;
};
```

**Enterprise UI Patterns:**
- **UsersSidebar**: Select user + prefetch posts on hover.
- **PostsInfiniteList**: Infinite scroll, keep previous data, background refetch.
- **PostsForm**: Add new post, optimistic update, UI feedback.
- **PostItem**: Edit/delete, rollback on error, reusable.
- **AppQueryProvider**: Centralized error handling, consistent UX.

---

## 8️⃣ Testing Patterns (MSW + React Testing Library)

- **Isolate tests per hook** → không phụ thuộc backend.
- **Example**: Test optimistic updates
```ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { usePostsMutations } from '../hooks/posts.hooks';
import { PostsForm } from '../components/Posts/PostsForm';

const server = setupServer(
  rest.post('/api/posts', (req, res, ctx) => res(ctx.json({ id: 1, title: 'New Post' })))
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('adds post optimistically', async () => {
  render(<PostsForm userId={1} />);
  fireEvent.change(screen.getByPlaceholderText(/New post title/i), { target: { value: 'New Post' } });
  fireEvent.click(screen.getByText(/Add Post/i));
  await waitFor(() => {
    expect(screen.getByText(/New Post/i)).toBeInTheDocument();
  });
});
```

**Enterprise Pattern:**
- Mock API với MSW → test isolation.
- Test optimistic updates, rollback, UI feedback.

---

## 9️⃣ Deployment & Monitoring

- **Build**: `npm run build`
- **Deploy**: Vercel / Netlify
- **Enterprise Pattern**:
  - Setup **environment variables** cho API URLs.
  - Enable **Sentry / LogRocket / Datadog** để monitor TanStack Query errors.
  - Configure **background refetch + cache** để tối ưu UX.

---

## 🔟 Advanced Best Practices (Enterprise Patterns)

| Pattern                              | Description                                                  |
|--------------------------------------|-------------------------------------------------------------|
| **Centralized Query Keys**           | Tránh duplicate, dễ maintain multiple modules.              |
| **Encapsulated Hooks**               | Tách logic TanStack Query ra hook → reusable & configurable.|
| **Optimistic Updates + Rollback**    | Standard pattern cho mutation.                              |
| **InfiniteQuery + keepPreviousData** | Mượt UI cho list dài.                                       |
| **Prefetch / Background Updates**    | UX mượt, reduce latency perception.                         |
| **Global Error Handling**            | Tích hợp toast, logging, alert user.                        |
| **Testing Hooks in Isolation**       | MSW + React Testing Library, mock API.                      |
| **Deployment Pipeline**              | Env variables, CI/CD, monitoring, alerting.                 |

---

## 1️⃣1️⃣ Summary Diagram (Advanced Enterprise Flow)

**Flow:**

```
UI Component
   │
   ▼
Encapsulated Hook (useQuery/useMutation)
   │
   ▼
QueryClient (cache, retry, onError)
   │
   ▼
API Layer (axios/fetch)
   │
   ▼
Server / Mock Server (MSW in testing)
```

**Patterns Applied:**
- Optimistic update → rollback
- Infinite scroll → keepPreviousData
- Prefetch → UX
- Global error → notifications/logs
- Testing isolation → MSW + hooks

---

## ✅ Summary

- Cheatsheet này là **phiên bản enterprise-level**, phù hợp cho **senior/lead dev**.
- Bao quát toàn bộ **patterns chuyên nghiệp**: architecture, hooks, queries, mutations, caching, prefetch, infinite scroll, optimistic updates, error handling, testing, deployment, monitoring.
- **UI examples** production-ready, sử dụng TypeScript, React functional components.