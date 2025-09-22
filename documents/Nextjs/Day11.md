Tuyệt! Đây là phiên bản **Day 11: SEO & Metadata (Page + App Router)** hoàn chỉnh, production-ready, kèm ví dụ, bài tập Level 1→3, common pitfalls, và footer navigation.

---

# Day 11: SEO & Metadata

## Mục tiêu học

Sau ngày học này, bạn sẽ:

1. Hiểu cơ chế SEO trong Next.js cho **Page Router** và **App Router**.
2. Tạo và quản lý **meta tags**, title, description, Open Graph, Twitter cards.
3. Áp dụng **dynamic meta tags** cho các route động.
4. Viết **canonical URLs** và cấu hình robots meta tags.
5. Biết patterns enterprise: SEO-friendly URLs, social previews, accessibility.
6. Viết code maintainable, production-ready, chuẩn SEO.

---

## TL;DR

* Page Router: `<Head>` component.
* App Router: `metadata` export hoặc `head.tsx`.
* Dynamic routes: meta tags dựa trên dữ liệu fetch.
* SEO tốt → tăng organic traffic, social sharing đẹp.

---

## 1️⃣ Lý thuyết chi tiết

### 1.1 Page Router – Basic Head

```tsx
// pages/index.tsx
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>My Next.js Homepage</title>
        <meta name="description" content="Homepage description" />
        <meta property="og:title" content="My Next.js Homepage" />
        <meta property="og:description" content="OG description for homepage" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://example.com" />
      </Head>
      <h1>Welcome</h1>
    </>
  );
}
```

* `<Head>` SSR → SEO-friendly.

---

### 1.2 App Router – Metadata

```ts
// app/page.tsx
export const metadata = {
  title: 'My Next.js Homepage',
  description: 'Homepage description',
  openGraph: {
    title: 'My Next.js Homepage',
    description: 'OG description for homepage',
    url: 'https://example.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Next.js Homepage',
    description: 'Twitter description',
  },
};

export default function Page() {
  return <h1>Welcome</h1>;
}
```

* `metadata` tự render `<head>` → SSR-ready, App Router-friendly.

---

### 1.3 Dynamic Meta Tags (App Router)

```ts
// app/blog/[slug]/page.tsx
import { fetchPost } from '../../../lib/api';

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
    },
  };
}
```

---

### 1.4 Canonical URL & Robots

```tsx
<Head>
  <link rel="canonical" href={`https://example.com${router.asPath}`} />
  <meta name="robots" content="index, follow" />
</Head>
```

* Tránh duplicate content, cải thiện SEO.

---

## 2️⃣ Bài tập

### Level 1

* **Đề:** Tạo homepage với title + description + OG tags.
* **Giải:** Page Router `<Head>` hoặc App Router `metadata`.

### Level 2

* **Đề:** Tạo page `/about` với dynamic title từ API fetch.
* **Giải:**

  * Page Router: fetch trong `getStaticProps` → pass props → render `<Head>`.
  * App Router: `generateMetadata()` function.

### Level 3

* **Đề:** Blog dynamic route `/blog/[slug]`, meta tags dựa trên content, thêm canonical URL và Twitter card.
* **Giải:**

  * App Router: `generateMetadata()` + dynamic fetch.
  * Page Router: `<Head>` trong component với props từ `getStaticProps`.

---


## **Bài tập giải thích chi tiết**

### **Level 1: Homepage Meta Tags**

**Yêu cầu:** Tạo homepage với **title**, **description**, **OG tags**.

#### **Page Router – giải pháp**

```tsx
// pages/index.tsx
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Homepage Next.js</title>
        <meta name="description" content="This is the homepage description" />
        <meta property="og:title" content="Homepage Next.js" />
        <meta property="og:description" content="OG description for homepage" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://example.com" />
      </Head>
      <h1>Welcome to my site</h1>
    </>
  );
}
```

**Giải thích:**

* `<Head>` render meta tags SSR → SEO-friendly.
* OG tags chuẩn cho social sharing.

#### **App Router – giải pháp**

```ts
// app/page.tsx
export const metadata = {
  title: 'Homepage Next.js',
  description: 'This is the homepage description',
  openGraph: {
    title: 'Homepage Next.js',
    description: 'OG description for homepage',
    url: 'https://example.com',
    type: 'website',
  },
};

export default function Page() {
  return <h1>Welcome to my site</h1>;
}
```

**Giải thích:**

* `metadata` tự động inject vào `<head>` → SSR + SEO-ready.

---

### **Level 2: Page `/about` với dynamic title từ API**

**Yêu cầu:** Fetch data → dynamic meta tags.

#### **Page Router**

```tsx
// pages/about.tsx
import Head from 'next/head';

export async function getStaticProps() {
  // giả lập fetch từ API
  const data = { title: 'About Us', description: 'Learn more about us' };
  return { props: { data } };
}

export default function About({ data }: { data: { title: string; description: string } }) {
  return (
    <>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.description} />
      </Head>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
    </>
  );
}
```

#### **App Router**

```ts
// app/about/page.tsx
async function fetchAbout() {
  return { title: 'About Us', description: 'Learn more about us' };
}

export default async function Page() {
  const data = await fetchAbout();
  return (
    <>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
    </>
  );
}

export async function generateMetadata() {
  const data = await fetchAbout();
  return {
    title: data.title,
    description: data.description,
  };
}
```

**Giải thích:**

* Page Router: fetch + pass props → `<Head>`.
* App Router: `generateMetadata()` dynamic → SSR-ready.

---

### **Level 3: Blog dynamic `/blog/[slug]` + canonical + Twitter card**

**Yêu cầu:** Dynamic route meta tags + canonical URL + Twitter card.

#### **Page Router**

```tsx
// pages/blog/[slug].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';

const posts = [
  { slug: 'post-1', title: 'Post 1', summary: 'Summary 1' },
  { slug: 'post-2', title: 'Post 2', summary: 'Summary 2' },
];

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: posts.map(post => ({ params: { slug: post.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = posts.find(p => p.slug === params?.slug);
  return { props: { post } };
};

export default function BlogPost({ post }: { post: { title: string; summary: string; slug: string } }) {
  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.summary} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.summary} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={`https://example.com/blog/${post.slug}`} />
      </Head>
      <h1>{post.title}</h1>
      <p>{post.summary}</p>
    </>
  );
}
```

#### **App Router**

```ts
// app/blog/[slug]/page.tsx
async function fetchPost(slug: string) {
  return { slug, title: `Post ${slug}`, summary: `Summary for ${slug}` };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.summary}</p>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);
  return {
    title: post.title,
    description: post.summary,
    openGraph: { title: post.title, description: post.summary },
    twitter: { card: 'summary_large_image', title: post.title, description: post.summary },
    alternates: { canonical: `https://example.com/blog/${post.slug}` },
  };
}
```

**Giải thích:**

* Dynamic route + SSR meta tags → SEO chuẩn.
* Canonical URL → tránh duplicate content.
* Twitter card + OG tags → social sharing đẹp.


## 3️⃣ Common Pitfalls

* Quên OG/Twitter tags → social preview xấu.
* Dynamic content nhưng static meta → duplicate content.
* Forget canonical → duplicate content penalty.

---

## 4️⃣ Performance / SEO Notes

* Luôn SSR meta tags → bots crawl đúng.
* Preload key images → cải thiện LCP.
* Sử dụng proper meta + structured data cho enterprise SEO.

---

## 5️⃣ Further Reading

* [Next.js SEO Docs](https://nextjs.org/docs/advanced-features/seo)
* [Open Graph Protocol](https://ogp.me/)
* [Twitter Card Docs](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

---

[<< Ngày 10](./Day10.md) | [Ngày 12 >>](./Day12.md)