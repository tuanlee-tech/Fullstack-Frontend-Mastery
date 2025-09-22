# Day 1: Giới thiệu Next.js & Môi trường phát triển (Page + App Router)

## Mục tiêu học

Sau ngày học này, bạn sẽ:

1. Hiểu Next.js là gì và phân biệt Page Router vs App Router.
2. Setup môi trường dev chuẩn production-ready với TypeScript.
3. Tạo Pages, Components cơ bản trong cả 2 router.
4. Hiểu cơ chế routing, folder structure.
5. Viết code sạch, reusable, production-ready.
6. Nhận biết pitfalls thường gặp khi bắt đầu Next.js.

---

## TL;DR

* **Next.js** là framework React Fullstack hỗ trợ **SSR, SSG, ISR**.
* **Page Router**: `pages/` folder, dùng `_app.tsx` và `_document.tsx`.
* **App Router**: `app/` folder, dùng `layout.tsx`, nested layouts, server components.
* Components nên tách riêng trong `components/`.
* Sử dụng TypeScript strict ngay từ đầu để chuẩn production.

---

## 1️⃣ Lý thuyết

### 1.1 Page Router (`pages/`)

* Mỗi file `.tsx` trong `pages/` tương ứng với 1 route.
* Subfolder → nested routes.
* API routes: `pages/api/`.
* Data fetching: `getStaticProps`, `getServerSideProps`, `getStaticPaths`.

### 1.2 App Router (`app/`)

* Folder `app/` với `page.tsx` → tương đương route.
* `layout.tsx` → layout nested, chia reusable layout.
* Data fetching trực tiếp trong Server Components (`fetch`) hoặc `generateStaticParams`.
* API route: `app/api/route.ts`.

---

## 2️⃣ Folder Structure ví dụ

**Page Router**

```plaintext
my-next-app/
├─ pages/
│   ├─ index.tsx
│   ├─ about.tsx
│   └─ api/
│       └─ hello.ts
├─ components/
├─ public/
├─ styles/
├─ package.json
├─ tsconfig.json
└─ next.config.js
```

**App Router**

```plaintext
my-next-app/
├─ app/
│   ├─ layout.tsx
│   ├─ page.tsx       # /
│   ├─ about/
│   │   └─ page.tsx  # /about
│   └─ api/
│       └─ hello/
│           └─ route.ts
├─ components/
├─ public/
├─ styles/
├─ package.json
├─ tsconfig.json
└─ next.config.js
```

---

## 3️⃣ Ví dụ Production-Ready

### 3.1 Page Router: Home Page + Button

`pages/index.tsx`

```tsx
import Button from '../components/Button';

export default function Home() {
  return (
    <div>
      <h1>Home Page - Page Router</h1>
      <Button onClick={() => alert('Hello Page Router!')}>Click me</Button>
    </div>
  );
}
```

### 3.2 App Router: Home Page + Button

`app/page.tsx`

```tsx
import Button from '../components/Button';

export default function HomePage() {
  return (
    <div>
      <h1>Home Page - App Router</h1>
      <Button onClick={() => alert('Hello App Router!')}>Click me</Button>
    </div>
  );
}
```

### 3.3 Reusable Button Component

`components/Button.tsx`

```tsx
type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {children}
    </button>
  );
}
```

---

## 4️⃣ Bài tập

### Level 1

* **Đề:** Tạo page `/about` hiển thị “Trang About của bạn” trong cả 2 router.
* **Giải:**

**Page Router**: `pages/about.tsx`

```tsx
export default function AboutPage() {
  return <h1>Trang About của bạn - Page Router</h1>;
}
```

**App Router**: `app/about/page.tsx`

```tsx
export default function AboutPage() {
  return <h1>Trang About của bạn - App Router</h1>;
}
```

---

### Level 2

* **Đề:** Tạo component `Card` có props: `title`, `description`, render 2 card trong `/about`.
* **Giải:**

`components/Card.tsx`

```tsx
type CardProps = {
  title: string;
  description: string;
};

export default function Card({ title, description }: CardProps) {
  return (
    <div className="border p-4 rounded shadow">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
```

`pages/about.tsx` + `app/about/page.tsx`

```tsx
import Card from '../../components/Card'; // App Router path

export default function AboutPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card title="Card 1" description="Mô tả 1" />
      <Card title="Card 2" description="Mô tả 2" />
    </div>
  );
}
```

---

### Level 3

* **Đề:** Tạo `utils/formatDate.ts` để format ngày, hiển thị ngày hôm nay trong Home page.
* **Giải:**

`utils/formatDate.ts`

```ts
export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
```

**Page Router**: `pages/date.tsx`

```tsx
import { formatDate } from '../utils/formatDate';

export default function DatePage() {
  const today = new Date().toISOString();
  return <p>Ngày hôm nay: {formatDate(today)}</p>;
}
```

**App Router**: `app/date/page.tsx`

```tsx
import { formatDate } from '../../../utils/formatDate';

export default function DatePage() {
  const today = new Date().toISOString();
  return <p>Ngày hôm nay: {formatDate(today)}</p>;
}
```

---

## 5️⃣ Common Pitfalls

* Quên tách reusable components → khó maintain.
* Inline CSS quá nhiều → không enterprise-friendly.
* Không dùng TypeScript strict → lỗi runtime khó debug.

---

## 6️⃣ Performance / Security Notes

* Luôn chạy `npm run build` kiểm tra production build.
* Sử dụng ESLint + Prettier để chuẩn hóa code.
* Chú ý khi import relative path trong App Router → có thể khác Page Router.

---

## 7️⃣ Further Reading

* [Next.js Docs](https://nextjs.org/docs)
* [App Router Overview](https://nextjs.org/docs/app/building-your-application/routing)
* [React Docs](https://react.dev)
* [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

[<< Ngày 30](./Day30.md) | [Ngày 2 >>](./Day02.md)

---