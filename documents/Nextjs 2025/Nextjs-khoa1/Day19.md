Tuyệt! Dưới đây là **Day 19: Testing cơ bản** – bài giảng chi tiết, production-ready, song song **Page Router + App Router**.

---

# 🟩 Day 19: Testing cơ bản

## **Mục tiêu học**

Sau ngày này, bạn sẽ:

1. Hiểu cách viết **unit test** và **integration test** cho Next.js.
2. Áp dụng **Jest** + **React Testing Library** cho Page Router & App Router.
3. Test component React, API route, server-side functions.
4. Viết test có coverage hợp lý, mock fetch / API.
5. Kết hợp testing với CI/CD enterprise pipeline.

---

## **TL;DR**

* Jest + RTL là combo chuẩn để test React/Next.js.
* Page Router & App Router: test logic tương tự, chỉ khác folder structure.
* Unit test → test function/component riêng lẻ.
* Integration test → test page + fetch + component render.
* Mock API / fetch để test độc lập khỏi backend.

---

## **1️⃣ Lý thuyết chi tiết**

### **1.1 Setup Jest & RTL**

**package.json** dependencies:

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "babel-jest": "^29.0.0"
  }
}
```

**jest.config.js**

```ts
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
```

**jest.setup.ts**

```ts
import '@testing-library/jest-dom';
```

---

### **1.2 Unit Test Example – Component**

```tsx
// components/Button.tsx
type Props = { label: string; onClick: () => void };
export default function Button({ label, onClick }: Props) {
  return <button onClick={onClick}>{label}</button>;
}

// __tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/Button';

test('renders button and triggers click', () => {
  const handleClick = jest.fn();
  render(<Button label="Click Me" onClick={handleClick} />);
  const btn = screen.getByText(/Click Me/i);
  fireEvent.click(btn);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

---

### **1.3 Integration Test – Page + Fetch**

**Page Router Example**

```tsx
// pages/posts.tsx
export async function getStaticProps() {
  const posts = await fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json());
  return { props: { posts } };
}

export default function Posts({ posts }: { posts: any[] }) {
  return (
    <ul>
      {posts.slice(0, 3).map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

// __tests__/Posts.test.tsx
import { render, screen } from '@testing-library/react';
import Posts from '../pages/posts';

const mockPosts = [{ id: 1, title: 'A' }, { id: 2, title: 'B' }];

test('renders posts', () => {
  render(<Posts posts={mockPosts} />);
  expect(screen.getByText('A')).toBeInTheDocument();
  expect(screen.getByText('B')).toBeInTheDocument();
});
```

**App Router Example**

```tsx
// app/posts/page.tsx
export const revalidate = 60;

export default async function Page() {
  const posts = await fetch('https://jsonplaceholder.typicode.com/posts', {
    next: { revalidate: 60 },
  }).then(res => res.json());

  return (
    <ul>
      {posts.slice(0, 3).map((post: any) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

* Test logic tương tự Page Router, mock fetch nếu cần.

---

### **1.4 Mock API / fetch**

```ts
global.fetch = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve([{ id: 1, title: 'Mock Post' }]) })
) as jest.Mock;
```

* Giúp unit test không phụ thuộc backend.

---

### **1.5 CI/CD Integration**

* `npm run test` → kiểm tra PR trước merge.
* Fail nếu coverage < 80% hoặc test lỗi.
* Enterprise pattern: kết hợp ESLint + Prettier + Test → merge safe.

---

## **2️⃣ Mini Real-World Example**

* Test component **Card** hiển thị bài viết.
* Test **Posts page** → render đúng số bài, check title hiển thị.
* Mock API response → đảm bảo test luôn pass, độc lập môi trường.

---

## **3️⃣ Common Pitfalls**

| Pitfall                  | Note / Solution                          |
| ------------------------ | ---------------------------------------- |
| Không mock fetch / API   | Test fail khi offline → luôn mock        |
| Test quá nhiều SSR logic | Test component render riêng → unit test  |
| Coverage thấp            | Tập trung test critical component + page |
| Async render không await | Dùng `findBy*` hoặc `waitFor`            |

---

## **4️⃣ Further Reading / References**

* [Jest Docs](https://jestjs.io/)
* [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
* [Next.js Testing](https://nextjs.org/docs/testing)
* [Mock Service Worker (MSW) for API mocking](https://mswjs.io/)

---


# **Day 19: Testing cơ bản – Giải bài tập**

## **Level 1: Unit Test Component**

**Đề:** Viết unit test cho component `Button`:

* Hiển thị label.
* Gọi hàm `onClick` khi click.

### **Button.tsx**

```tsx
type Props = { label: string; onClick: () => void };
export default function Button({ label, onClick }: Props) {
  return <button onClick={onClick}>{label}</button>;
}
```

### **Giải bằng React Testing Library**

```tsx
// __tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/Button';

test('renders button and triggers click', () => {
  const handleClick = jest.fn();
  render(<Button label="Click Me" onClick={handleClick} />);
  const btn = screen.getByText(/Click Me/i);
  fireEvent.click(btn);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

**Giải thích:**

* `render` → mount component.
* `fireEvent.click` → simulate user interaction.
* `expect` → assert callback được gọi đúng.

---

## **Level 2: Integration Test Page + Props**

**Đề:** Kiểm tra Page Router & App Router hiển thị danh sách bài viết.

### **Page Router – Posts Page**

```tsx
// pages/posts.tsx
export default function Posts({ posts }: { posts: any[] }) {
  return (
    <ul>
      {posts.slice(0, 2).map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### **Test**

```tsx
// __tests__/Posts.test.tsx
import { render, screen } from '@testing-library/react';
import Posts from '../pages/posts';

const mockPosts = [
  { id: 1, title: 'Post A' },
  { id: 2, title: 'Post B' },
];

test('renders posts correctly', () => {
  render(<Posts posts={mockPosts} />);
  expect(screen.getByText('Post A')).toBeInTheDocument();
  expect(screen.getByText('Post B')).toBeInTheDocument();
});
```

### **App Router – Posts Page**

```tsx
// app/posts/page.tsx
export default async function Page() {
  const posts = [
    { id: 1, title: 'Post A' },
    { id: 2, title: 'Post B' },
  ];
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

* Test logic tương tự Page Router.

---

## **Level 3: Mock API & Async Fetch**

**Đề:** Test page fetch data từ API nhưng mock dữ liệu.

### **Mock fetch**

```ts
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ id: 1, title: 'Mock Post' }]),
  })
) as jest.Mock;
```

### **Test Page**

```tsx
// __tests__/PostsFetch.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import PostsFetch from '../pages/posts-fetch';

test('renders posts from API', async () => {
  render(<PostsFetch />);
  await waitFor(() => {
    expect(screen.getByText('Mock Post')).toBeInTheDocument();
  });
});
```

**Giải thích:**

* Mock API → test độc lập, không phụ thuộc backend.
* `waitFor` → handle async render.

---

## ✅ Common Pitfalls

1. Quên mock fetch → test fail khi offline.
2. Async render không await → test flacky.
3. Test quá nhiều SSR logic → tách component, unit test riêng.
4. Coverage thấp → test các component critical & page render.

---

[<< Ngày 18](./Day18.md) | [Ngày 20 >>](./Day20.md)

