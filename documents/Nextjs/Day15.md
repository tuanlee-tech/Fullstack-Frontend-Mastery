Tuyệt! Mình sẽ giải **Day 15: Internationalization (i18n)** đầy đủ, song song **Page Router + App Router**, kèm bài tập Level 1 → 3, giải thích chi tiết, production-ready.

---

# Day 15: Internationalization (i18n)

## Mục tiêu học

1. Hiểu cơ chế i18n trong Next.js cho Page Router & App Router.
2. Cấu hình **locale routing**, domain-based hoặc path-based.
3. Dùng `next-i18next` hoặc `next-intl` cho multi-language.
4. Tạo **dynamic translations** từ JSON hoặc API.
5. Áp dụng patterns enterprise: SEO-friendly i18n URLs, fallback language.
6. Hiểu cách render **Server-Side + Client-Side translations**.

---

## TL;DR

* Next.js hỗ trợ **i18n routing** → path-based: `/en`, `/vi`.
* `next-i18next` giúp manage translation JSON + hooks.
* App Router: dùng `generateMetadata` + `params.locale` để SEO-friendly.
* Always provide **fallback locale** để tránh 404.

---

## 1️⃣ Lý thuyết chi tiết

### 1.1 Cài đặt

```bash
npm install next-i18next react-i18next i18next
```

* `next-i18next`: tích hợp React i18next với Next.js.

---

### 1.2 Page Router – cấu hình i18n

**next.config.js**

```ts
module.exports = {
  i18n: {
    locales: ['en', 'vi'],
    defaultLocale: 'en',
  },
};
```

**i18n.js**

```ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import vi from './locales/vi.json';

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, vi: { translation: vi } },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
```

**Page Example:**

```tsx
// pages/index.tsx
'use client';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t, i18n } = useTranslation();
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button onClick={() => i18n.changeLanguage('vi')}>VI</button>
      <button onClick={() => i18n.changeLanguage('en')}>EN</button>
    </div>
  );
}
```

* `t('welcome')` → lookup translation key.
* `changeLanguage` → switch locale client-side.

---

### 1.3 App Router – i18n

**app/\[locale]/page.tsx**

```ts
import { notFound } from 'next/navigation';
import en from '../../locales/en.json';
import vi from '../../locales/vi.json';

type Props = { params: { locale: string } };

export default function Page({ params }: Props) {
  const translations = params.locale === 'vi' ? vi : params.locale === 'en' ? en : null;
  if (!translations) return notFound();
  
  return <h1>{translations.welcome}</h1>;
}
```

**next.config.js**

```ts
module.exports = {
  i18n: {
    locales: ['en', 'vi'],
    defaultLocale: 'en',
  },
};
```

* `[locale]` dynamic segment → SEO-friendly path `/en` or `/vi`.
* `notFound()` → fallback khi locale không hợp lệ.

---

### 1.4 SEO & Metadata cho i18n

```ts
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const translations = params.locale === 'vi' ? vi : en;
  return {
    title: translations.title,
    description: translations.description,
    alternates: {
      canonical: `https://example.com/${params.locale}`,
      languages: {
        en: '/en',
        vi: '/vi',
      },
    },
  };
}
```

* Dynamic metadata dựa trên locale → SEO chuẩn.

---

## 2️⃣ Bài tập

### **Level 1: Simple Translation**

* **Đề:** Tạo homepage hiển thị "welcome" bằng EN & VI, toggle button.
* **Giải:** Page Router hoặc App Router như ví dụ trên.

### **Level 2: Dynamic Locale Routing**

* **Đề:** `/en` & `/vi` routes, invalid locale → show 404.
* **Giải:** App Router `[locale]/page.tsx` + `notFound()` fallback.

### **Level 3: Metadata + SEO i18n**

* **Đề:** Generate dynamic meta title/description dựa trên locale, canonical + hreflang links.
* **Giải:** `generateMetadata` ví dụ phía trên.

---

# **Day 15: i18n – Giải bài tập**

## **Level 1: Simple Translation Toggle**

**Đề:** Tạo homepage hiển thị "welcome" bằng EN & VI, có toggle button đổi ngôn ngữ.

### **Page Router – Giải**

```tsx
// pages/index.tsx
'use client';
import { useState } from 'react';

const translations = {
  en: { welcome: 'Welcome!' },
  vi: { welcome: 'Chào mừng!' },
};

export default function Home() {
  const [locale, setLocale] = useState<'en' | 'vi'>('en');

  return (
    <div className="flex flex-col gap-2">
      <h1>{translations[locale].welcome}</h1>
      <div>
        <button onClick={() => setLocale('en')} className="mr-2">EN</button>
        <button onClick={() => setLocale('vi')}>VI</button>
      </div>
    </div>
  );
}
```

**Giải thích:**

* `useState` quản lý locale client-side.
* `translations` object chứa key → text mapping.
* Toggle button thay đổi ngôn ngữ → update UI realtime.

---

### **App Router – Giải**

```ts
// app/[locale]/page.tsx
import { notFound } from 'next/navigation';

type Props = { params: { locale: string } };

const translations = {
  en: { welcome: 'Welcome!' },
  vi: { welcome: 'Chào mừng!' },
};

export default function Page({ params }: Props) {
  const t = translations[params.locale as 'en' | 'vi'];
  if (!t) return notFound(); // fallback 404 nếu locale không hợp lệ
  return <h1>{t.welcome}</h1>;
}
```

**Giải thích:**

* `[locale]` dynamic route → path-based i18n.
* `notFound()` → fallback cho invalid locale.

---

## **Level 2: Dynamic Locale Routing**

**Đề:** Hỗ trợ URL `/en` và `/vi`, bất hợp lệ show 404.

### **Page Router**

* Không cần dynamic segment → dùng query param hoặc switch language client-side.
* Ví dụ `/index.tsx?lang=vi` → parse `router.query.lang` để chọn translation.

```tsx
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const locale = (router.query.lang as 'en' | 'vi') || 'en';
  const t = { en: 'Welcome!', vi: 'Chào mừng!' }[locale];
  return <h1>{t}</h1>;
}
```

* Invalid query → fallback `en`.

### **App Router**

* Như Level 1 App Router ví dụ `[locale]/page.tsx`.
* Invalid locale → `notFound()` → 404.
* Đây là cách enterprise làm locale routing chuẩn SEO.

---

## **Level 3: Metadata + SEO i18n**

**Đề:** Generate dynamic meta title/description dựa trên locale, canonical + hreflang links.

### **App Router Solution**

```ts
// app/[locale]/page.tsx
import { notFound } from 'next/navigation';
import en from '../../locales/en.json';
import vi from '../../locales/vi.json';

type Props = { params: { locale: string } };

export default function Page({ params }: Props) {
  const translations = params.locale === 'vi' ? vi : params.locale === 'en' ? en : null;
  if (!translations) return notFound();
  return <h1>{translations.welcome}</h1>;
}

export async function generateMetadata({ params }: Props) {
  const translations = params.locale === 'vi' ? vi : en;
  return {
    title: translations.title,
    description: translations.description,
    alternates: {
      canonical: `https://example.com/${params.locale}`,
      languages: { en: '/en', vi: '/vi' },
    },
  };
}
```

### **Page Router Solution**

```tsx
// pages/index.tsx
import Head from 'next/head';
import { useRouter } from 'next/router';

const translations = {
  en: { welcome: 'Welcome!', title: 'Home', description: 'Homepage EN' },
  vi: { welcome: 'Chào mừng!', title: 'Trang chủ', description: 'Homepage VI' },
};

export default function Home() {
  const router = useRouter();
  const locale = (router.query.lang as 'en' | 'vi') || 'en';
  const t = translations[locale];

  return (
    <>
      <Head>
        <title>{t.title}</title>
        <meta name="description" content={t.description} />
        <link rel="canonical" href={`https://example.com/${locale}`} />
        <link rel="alternate" href={`https://example.com/en`} hrefLang="en" />
        <link rel="alternate" href={`https://example.com/vi`} hrefLang="vi" />
      </Head>
      <h1>{t.welcome}</h1>
    </>
  );
}
```

**Giải thích:**

* Dynamic meta tags → SEO chuẩn cho mỗi locale.
* `canonical` + `hreflang` → tránh duplicate content penalty.

---

## ✅ Common Pitfalls

1. Quên fallback locale → crash app.
2. Metadata không dynamic → SEO kém.
3. Mixing App Router `[locale]` + Page Router query param → duplicate paths.
4. Không preload translation JSON → client render chậm.

---

[<< Ngày 14](./Day14.md) | [Ngày 16 >>](./Day16.md)

