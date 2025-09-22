# 🟩 Day 29: Testing & Deployment Project

## **Mục tiêu học**

Sau ngày này, bạn sẽ:

1. Viết **unit test** cho React components + API routes.
2. Viết **integration test** cho page / app flows.
3. Triển khai **lint, build, CI/CD** cho Next.js.
4. Hiểu enterprise checklist trước khi merge code: types, tests, docs, performance.
5. Triển khai dự án lên **Vercel / Netlify**, config env variables.

---

## **TL;DR**

* **Testing:** Jest + React Testing Library
* **Lint & Build:** ESLint, Prettier, TypeScript type check
* **Deployment:** Vercel, Netlify, env, CI/CD
* **Enterprise:** check types, tests ≥70%, docs, performance

---

## **1️⃣ Unit Test – React Component**

**Ví dụ:** Test component hiển thị post.

```tsx
// __tests__/PostCard.test.tsx
import { render, screen } from '@testing-library/react';
import PostCard from '../components/PostCard';

const mockPost = { id: 1, title: 'Hello', content: 'World' };

test('renders post title and content', () => {
  render(<PostCard {...mockPost} />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
  expect(screen.getByText('World')).toBeInTheDocument();
});
```

---

## **2️⃣ Integration Test – API Route**

```ts
// __tests__/api/posts.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '../../pages/api/posts';

test('GET /api/posts returns 200', async () => {
  const { req, res } = createMocks({ method: 'GET' });
  await handler(req, res);
  expect(res._getStatusCode()).toBe(200);
  const data = JSON.parse(res._getData());
  expect(Array.isArray(data)).toBe(true);
});
```

---

## **3️⃣ Lint & Build**

```bash
# Lint
npx eslint . --ext .ts,.tsx

# Type check
tsc --noEmit

# Build
next build
```

* Enterprise: luôn chạy **lint + tests + type check** trước merge

---

## **4️⃣ Deployment**

* **Vercel:** connect repo → auto CI/CD
* **Env variables:** `.env.local` cho dev, `.env.production` cho deploy
* **Preview deployment:** test cả 2 router, SSR, client-side fetch

---

## **5️⃣ Mini Real-World Example**

* Page Router: test `[id]` page + API route fetch post
* App Router: test server component fetch + client state hydrate
* Test coverage ≥70% → pass pre-merge
* Lint + build → deploy Vercel

---

## ✅ Common Pitfalls

| Pitfall                      | Note / Solution                                |
| ---------------------------- | ---------------------------------------------- |
| Tests không cover edge cases | Unit + integration test cho cả success & error |
| CI/CD fail                   | Always lint + type check + test before merge   |
| Env variables thiếu          | Set `.env.local` và preview env                |
| SSR fetch lỗi                | Mock DB hoặc fetcher trong test                |

---

## **6️⃣ Further Reading**

* [Next.js Testing](https://nextjs.org/docs/testing)
* [Jest Docs](https://jestjs.io/)
* [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
* [Vercel Deployment](https://vercel.com/docs)

---


# **Day 29: Testing & Deployment Project – Giải bài tập**

## **Level 1: Unit Test – React Component**

**Đề:** Viết unit test cho component `PostCard` hiển thị post title + content.

### **Giải**

```tsx
// __tests__/PostCard.test.tsx
import { render, screen } from '@testing-library/react';
import PostCard from '../components/PostCard';

const mockPost = { id: 1, title: 'Hello', content: 'World' };

test('renders post title and content', () => {
  render(<PostCard {...mockPost} />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
  expect(screen.getByText('World')).toBeInTheDocument();
});
```

**Giải thích:**

* Kiểm tra DOM render đúng props
* Đảm bảo component hiển thị dữ liệu chính xác

---

## **Level 2: Integration Test – API Route**

**Đề:** Viết test cho API route `/api/posts` trả về danh sách posts.

### **Giải**

```ts
// __tests__/api/posts.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '../../pages/api/posts';

test('GET /api/posts returns 200 and array', async () => {
  const { req, res } = createMocks({ method: 'GET' });
  await handler(req, res);

  expect(res._getStatusCode()).toBe(200);
  const data = JSON.parse(res._getData());
  expect(Array.isArray(data)).toBe(true);
});
```

**Giải thích:**

* Mock request + response để test API route
* Kiểm tra status code và kiểu dữ liệu trả về

---

## **Level 3: Deployment & Enterprise Checklist**

**Đề:** Chuẩn bị dự án deploy production, đảm bảo lint, type check, test coverage ≥70%.

### **Giải**

```bash
# 1. Lint code
npx eslint . --ext .ts,.tsx

# 2. Type check
tsc --noEmit

# 3. Run all tests
npm run test

# 4. Build project
next build

# 5. Deploy to Vercel
# - Kết nối repo
# - Set env variables: .env.production
# - Preview deployment → kiểm tra cả Page & App Router
```

**Checklist enterprise pre-merge:**

* [x] Lint ✅
* [x] Type check ✅
* [x] Unit + Integration tests ≥70% coverage ✅
* [x] Docs + README ✅
* [x] Performance check (lazy load, memo) ✅
* [x] Env variables configured ✅

**Giải thích:**

* Tuân thủ enterprise pattern → tránh lỗi production
* Preview deployment test SSR + CSR cả Page Router & App Router

---

## ✅ Common Pitfalls

| Pitfall             | Note / Solution                           |
| ------------------- | ----------------------------------------- |
| Test coverage thấp  | Always cover success + error + edge cases |
| Lint/type errors    | Chạy eslint + tsc trước merge             |
| Env variables thiếu | Check `.env.local` và `.env.production`   |
| SSR fetch lỗi       | Mock fetcher hoặc DB trong test           |

---

[<< Ngày 28](./Day28.md) | [Ngày 30 >>](./Day30.md)

