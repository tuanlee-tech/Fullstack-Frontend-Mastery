# 🟩 Day 28: Optimization & Best Practices

## **Mục tiêu học**

Sau ngày này, bạn sẽ:

1. Hiểu và triển khai **code splitting, lazy loading, dynamic import** để tối ưu bundle.
2. Tối ưu **SEO & accessibility** cho cả Page Router & App Router.
3. Áp dụng **security best practices**: XSS, CSRF, input validation, auth checks.
4. Áp dụng enterprise pattern: lint, tests, code review checklist.
5. Biết cách **refactor code** để maintainable, reusable, scalable.

---

## **TL;DR**

* **Performance:** dynamic import, memo, bundle splitting, caching.
* **SEO:** meta tags, Open Graph, structured data, accessibility.
* **Security:** input validation, auth, sanitization, HTTPS.
* **Enterprise:** code review checklist, linting, unit/integration test.

---

## **1️⃣ Code Splitting & Lazy Loading**

```tsx
import dynamic from 'next/dynamic';
import { memo } from 'react';

const HeavyComponent = dynamic(() => import('../components/HeavyComponent'), { ssr: false });
const MemoizedComponent = memo(HeavyComponent);

export default function Page() {
  return <MemoizedComponent />;
}
```

**Giải thích:**

* Dynamic import → giảm initial JS
* `ssr: false` nếu component chỉ cần client-side
* `memo` tránh re-render

---

## **2️⃣ SEO & Accessibility**

**SEO Example – Next.js Head**

```tsx
import Head from 'next/head';

export default function SEOExample() {
  return (
    <Head>
      <title>Next.js Optimization</title>
      <meta name="description" content="Enterprise-level Next.js app with SEO & performance" />
      <meta property="og:title" content="Next.js Optimization" />
      <meta property="og:type" content="website" />
    </Head>
  );
}
```

**Accessibility Tips:**

* Sử dụng semantic HTML (`<main>`, `<header>`, `<section>`)
* `aria-label` cho interactive elements
* Keyboard navigation

---

## **3️⃣ Security Best Practices**

* **Input validation** → Zod / Yup
* **Auth check** → Middleware / API
* **Escape user content** → avoid XSS
* **HTTPS** → production deployments
* **Rate limiting** → protect APIs

---

## **4️⃣ Enterprise Checklist**

* **Lint & Prettier** → consistent style
* **Unit & Integration Tests** → Jest + React Testing Library
* **Code Review** → check performance, security, readability
* **Types** → TypeScript types everywhere
* **Deployment checks** → env variables, preview deploy

---

## **5️⃣ Mini Real-World Example**

* Page Router: dynamic import heavy component, SEO head, ARIA attributes
* App Router: server component lazy load child components
* Validation: Zod for forms / API input
* Performance: memo + SWR cache

---

## ✅ Common Pitfalls

| Pitfall                | Note / Solution                 |
| ---------------------- | ------------------------------- |
| Bundle size quá lớn    | Dynamic import + code splitting |
| SEO bị thiếu meta      | Always add `<Head>` + OG tags   |
| Accessibility lỗi      | Semantic HTML + ARIA            |
| Input không validate   | Zod / Yup validation            |
| Middleware auth bỏ sót | Always test Page + App Router   |

---

## **6️⃣ Further Reading**

* [Next.js Performance Optimization](https://nextjs.org/docs/advanced-features/measuring-performance)
* [Next.js SEO](https://nextjs.org/docs/advanced-features/seo)
* [Web Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)
* [OWASP Security Practices](https://owasp.org/)

---



# **Day 28: Optimization & Best Practices – Giải bài tập**

## **Level 1: Lazy Load & Code Splitting**

**Đề:** Lazy load một component nặng (`HeavyComponent`) và memo hóa để tránh re-render không cần thiết.

### **Giải**

```tsx
import dynamic from 'next/dynamic';
import { memo } from 'react';

const HeavyComponent = dynamic(() => import('../components/HeavyComponent'), { ssr: false });
const MemoizedComponent = memo(HeavyComponent);

export default function Page() {
  return <MemoizedComponent />;
}
```

**Giải thích:**

* `dynamic` giúp **code splitting** → giảm bundle size
* `ssr: false` nếu component chỉ cần client-side
* `memo` tránh re-render khi props không đổi

---

## **Level 2: SEO & Accessibility Check**

**Đề:** Thêm meta tags, Open Graph, và cải thiện accessibility cho page.

### **Giải**

```tsx
import Head from 'next/head';

export default function SEOPage() {
  return (
    <>
      <Head>
        <title>Next.js Enterprise App</title>
        <meta name="description" content="Optimize SEO & Accessibility in Next.js" />
        <meta property="og:title" content="Next.js Enterprise App" />
        <meta property="og:type" content="website" />
      </Head>
      <main>
        <h1>Welcome to Next.js App</h1>
        <button aria-label="Click to start">Start</button>
      </main>
    </>
  );
}
```

**Giải thích:**

* `<Head>` đảm bảo SEO + Open Graph chuẩn
* Semantic HTML + `aria-label` → accessibility tốt

---

## **Level 3: Security & Enterprise Practices**

**Đề:** Validate input form, apply auth check middleware, prevent XSS.

### **Giải**

```ts
// pages/api/submit.ts
import { z } from 'zod';
import { getSession } from 'next-auth/react';

const InputSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
});

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  const parse = InputSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json(parse.error);

  const sanitizedContent = parse.data.content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // Save to DB...
  res.status(200).json({ message: 'Success', data: { ...parse.data, content: sanitizedContent } });
}
```

**Giải thích:**

* Zod validate input
* Auth check bằng session
* Escape `<` và `>` tránh XSS
* Production-ready → enterprise-safe

---

## ✅ Common Pitfalls

| Pitfall                | Note / Solution                         |
| ---------------------- | --------------------------------------- |
| Bundle size quá lớn    | Sử dụng dynamic import + code splitting |
| Missing SEO tags       | Always `<Head>` + OG                    |
| Accessibility lỗi      | Semantic HTML + ARIA                    |
| Input không validate   | Zod / Yup                               |
| Middleware auth bỏ sót | Test Page + App Router                  |

---

[<< Ngày 27](./Day27.md) | [Ngày 29 >>](./Day29.md)

