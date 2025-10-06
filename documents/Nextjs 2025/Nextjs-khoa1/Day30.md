# 🟩 Day 30: Capstone Project – Fullstack E-commerce App

## **Mục tiêu học**

Sau ngày này, bạn sẽ:

1. Triển khai **fullstack e-commerce app** với Next.js (Page + App Router).
2. Tạo các feature: **Auth, CRUD products, Cart, Checkout, SEO, Testing**.
3. Áp dụng **enterprise practices**: lint, type check, tests ≥70%, CI/CD.
4. Tối ưu performance: code splitting, memo, lazy load, SWR caching.
5. Deploy production: Vercel / Netlify, environment variables, preview deploy.

---

## **TL;DR**

* **Stack:** Next.js 13+, TypeScript, Prisma + PostgreSQL, Zustand / Redux Toolkit, SWR
* **Routing:** `/pages/` Page Router + `/app/` App Router
* **Testing:** Jest + React Testing Library, API routes + Components
* **SEO & Accessibility:** Head, OG tags, semantic HTML, ARIA
* **Deployment:** Vercel CI/CD, env variables, preview

---

## **1️⃣ Capstone Requirements**

### **Core Features**

| Feature          | Requirement                                       |
| ---------------- | ------------------------------------------------- |
| Auth             | SignUp / Login / JWT or NextAuth, protect routes  |
| Products CRUD    | Create, Read, Update, Delete products (admin)     |
| Cart & Checkout  | Add to cart, update qty, remove, checkout flow    |
| SEO              | Meta tags, Open Graph, friendly URLs              |
| Testing          | Unit + integration tests ≥70% coverage            |
| State Management | Shared state between SSR + CSR (Zustand/Redux)    |
| Performance      | Memoized components, dynamic import, lazy loading |
| Deployment       | Vercel / Netlify, env variables, CI/CD            |

---

## **2️⃣ Level 1: Basic Page + API CRUD**

**Đề:**

* Page Router: `/pages/products` list + add product
* API route `/pages/api/products` CRUD

### **Giải – Page Router**

```ts
// pages/api/products.ts
import { prisma } from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const products = await prisma.product.findMany();
    return res.status(200).json(products);
  }
  if (req.method === 'POST') {
    const { name, price } = req.body;
    const product = await prisma.product.create({ data: { name, price } });
    return res.status(201).json(product);
  }
  res.status(405).end();
}
```

---

## **3️⃣ Level 2: App Router + Client-side Features**

**Đề:**

* App Router: `/app/products/page.tsx` server component fetch list
* Client component: add product / update cart, SWR caching

### **Giải – App Router**

```tsx
// app/products/page.tsx
import { prisma } from '../../lib/prisma';
import dynamic from 'next/dynamic';

const ProductList = dynamic(() => import('../../components/ProductList'));

export default async function Page() {
  const products = await prisma.product.findMany();
  return <ProductList products={products} />;
}
```

```tsx
// components/ProductList.tsx
import useSWR from 'swr';
import { fetcher } from '../lib/api';
import ProductCard from './ProductCard';

export default function ProductList({ products }: { products: any[] }) {
  const { data } = useSWR('/api/products', fetcher, { fallbackData: products });
  return <div>{data.map(p => <ProductCard key={p.id} {...p} />)}</div>;
}
```

---

## **4️⃣ Level 3: Capstone – Full Features Integration**

**Đề:**

* Auth protected routes
* Cart + Checkout with client & server state
* SEO + accessibility
* Testing ≥70%
* Deployment CI/CD

**Giải pháp:**

1. **Auth:** NextAuth.js / JWT
2. **Cart State:** Zustand store, persisted in localStorage
3. **Checkout Flow:** Server-side POST to `/api/orders` + confirmation email mock
4. **Testing:** Unit + Integration for API & components
5. **Performance:** Lazy load ProductCard, memoize components, SWR cache

```tsx
// components/Cart.tsx
import { useCartStore } from '../store/useCartStore';
import ProductCard from './ProductCard';

export default function Cart() {
  const cart = useCartStore(state => state.items);
  return <div>{cart.map(item => <ProductCard key={item.id} {...item} />)}</div>;
}
```

---

## ✅ Enterprise Deployment Checklist

* [x] Lint & Prettier ✅
* [x] Type check ✅
* [x] Unit + Integration tests ≥70% ✅
* [x] Docs + README ✅
* [x] Env variables ✅
* [x] Performance ✅
* [x] SEO & Accessibility ✅
* [x] CI/CD ✅

---

## ✅ Common Pitfalls

| Pitfall                       | Note / Solution                               |
| ----------------------------- | --------------------------------------------- |
| SSR & CSR state không đồng bộ | Hydrate Zustand / Redux store từ server props |
| Lazy load component lỗi       | `ssr: false` khi cần                          |
| API auth bypassed             | Always check session/JWT in middleware        |
| Test coverage thấp            | Unit + integration test cho success + error   |

---

## **Further Reading**

* [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
* [NextAuth.js Docs](https://next-auth.js.org/)
* [Prisma Docs](https://www.prisma.io/docs/)
* [SWR Docs](https://swr.vercel.app/)
* [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

# **Day 30: Capstone Project – Giải bài tập**

## **Level 1: Basic Page + API CRUD**

**Đề:**

* Tạo page list products (`/pages/products`) với Page Router.
* API route `/pages/api/products` hỗ trợ **GET** và **POST**.

### **Giải**

```ts
// pages/api/products.ts
import { prisma } from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const products = await prisma.product.findMany();
    return res.status(200).json(products);
  }
  if (req.method === 'POST') {
    const { name, price } = req.body;
    const product = await prisma.product.create({ data: { name, price } });
    return res.status(201).json(product);
  }
  res.status(405).end();
}
```

```tsx
// pages/products/index.tsx
import useSWR from 'swr';
import { fetcher } from '../../lib/api';
import ProductCard from '../../components/ProductCard';

export default function ProductsPage() {
  const { data, error } = useSWR('/api/products', fetcher);

  if (error) return <div>Error loading products</div>;
  if (!data) return <div>Loading...</div>;

  return <div>{data.map((p) => <ProductCard key={p.id} {...p} />)}</div>;
}
```

**Giải thích:**

* Page Router + API route cơ bản
* SWR cache tự động fetch & revalidate

---

## **Level 2: App Router + Client-side Features**

**Đề:**

* App Router `/app/products/page.tsx` server component fetch data.
* Client component sử dụng SWR + Zustand để render list & cập nhật cart.

### **Giải**

```tsx
// app/products/page.tsx
import { prisma } from '../../lib/prisma';
import dynamic from 'next/dynamic';

const ProductList = dynamic(() => import('../../components/ProductList'));

export default async function Page() {
  const products = await prisma.product.findMany();
  return <ProductList products={products} />;
}
```

```tsx
// components/ProductList.tsx
import useSWR from 'swr';
import { fetcher } from '../lib/api';
import ProductCard from './ProductCard';

export default function ProductList({ products }: { products: any[] }) {
  const { data } = useSWR('/api/products', fetcher, { fallbackData: products });
  return <div>{data.map((p) => <ProductCard key={p.id} {...p} />)}</div>;
}
```

**Giải thích:**

* Server component fetch + client component hydrate Zustand store
* SWR fallbackData giúp tối ưu performance

---

## **Level 3: Full Features Integration – Auth, Cart, Checkout**

**Đề:**

* Tích hợp **Auth protected routes**.
* Cart & Checkout flow với Zustand state.
* SEO + accessibility.
* Unit + integration tests ≥70%.
* Deploy production (Vercel / Netlify).

### **Giải**

```tsx
// components/Cart.tsx
import { useCartStore } from '../store/useCartStore';
import ProductCard from './ProductCard';

export default function Cart() {
  const cart = useCartStore(state => state.items);
  return <div>{cart.map(item => <ProductCard key={item.id} {...item} />)}</div>;
}
```

```ts
// pages/api/orders.ts
import { getSession } from 'next-auth/react';
import { prisma } from '../../lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  if (req.method === 'POST') {
    const { items, total } = req.body;
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        items: { set: items },
        total,
      },
    });
    return res.status(201).json(order);
  }
  res.status(405).end();
}
```

**Giải thích:**

* Auth check middleware / NextAuth.js
* Cart state với Zustand, persisted localStorage
* Checkout POST → orders table
* SEO & accessibility áp dụng Head, semantic HTML, ARIA

---

## ✅ Enterprise Deployment Checklist

* [x] Lint & Prettier ✅
* [x] Type check ✅
* [x] Unit + Integration tests ≥70% ✅
* [x] Docs + README ✅
* [x] Env variables ✅
* [x] Performance: lazy load, memo ✅
* [x] SEO & Accessibility ✅
* [x] CI/CD ✅

---

## ✅ Common Pitfalls

| Pitfall                       | Note / Solution                               |
| ----------------------------- | --------------------------------------------- |
| SSR & CSR state không đồng bộ | Hydrate Zustand / Redux store từ server props |
| Lazy load component lỗi       | `ssr: false` khi cần                          |
| API auth bypassed             | Kiểm tra session/JWT middleware               |
| Test coverage thấp            | Unit + integration test cho success + error   |

---

[<< Ngày 29](./Day29.md)

