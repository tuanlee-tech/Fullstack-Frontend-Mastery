# 🟩 Day 20: Analytics & Monitoring

## **Mục tiêu học**

Sau ngày này, bạn sẽ:

1. Hiểu cách triển khai **analytics** trong Next.js (Vercel Analytics, Google Analytics).
2. Thiết lập **monitoring** cho lỗi runtime (Sentry) và performance metrics.
3. Tích hợp analytics vào cả Page Router & App Router.
4. Sử dụng **custom logging** server-side & client-side cho enterprise app.
5. Áp dụng **alerting & dashboards** để proactive monitoring.

---

## **TL;DR**

* Analytics → đo traffic, conversion, performance.
* Monitoring → phát hiện lỗi runtime, performance degradation.
* Vercel Analytics → native cho Next.js → page views + SSR metrics.
* Sentry → capture lỗi, breadcrumb, release tracking.
* Enterprise pattern: combine analytics + monitoring + logging + CI/CD alert.

---

## **1️⃣ Lý thuyết chi tiết**

### **1.1 Vercel Analytics**

```tsx
// pages/_app.tsx (Page Router)
import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics /> {/* đo page view, performance */}
    </>
  );
}

export default MyApp;
```

**App Router:**

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

* `@vercel/analytics/react` → tự động track page view, SSR metrics.

---

### **1.2 Google Analytics**

```tsx
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX`}
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXX');
          `}
        </Script>
      </body>
    </html>
  );
}
```

* `afterInteractive` → không block render, phù hợp cho App Router & Page Router.

---

### **1.3 Sentry Monitoring**

```ts
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0, // 0-1, theo dõi performance
});
```

* Client + server đều capture lỗi → proactive monitoring.
* Breadcrumbs → ghi lại action dẫn đến lỗi.

**Usage Example:**

```ts
// pages/api/data.ts
import * as Sentry from '@sentry/nextjs';

export default function handler(req, res) {
  try {
    throw new Error('Test Sentry Error');
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ message: 'Error captured' });
  }
}
```

---

### **1.4 Custom Logging**

```ts
// lib/logger.ts
export function logInfo(message: string, meta?: any) {
  if (process.env.NODE_ENV === 'production') {
    // gửi vào log server/CDN
    console.log('[INFO]', message, meta || '');
  } else {
    console.debug('[DEV INFO]', message, meta || '');
  }
}
```

* Enterprise pattern: logging → analytics integration → alert dashboard.

---

### **1.5 Alerts & Dashboards**

* Sentry + Vercel + custom dashboard → alert on error rate spike.
* KPI tracking → page load, API response, user flow.
* CI/CD → fail build if error threshold exceeded.

---

## **2️⃣ Mini Real-World Examples**

1. Track page views + conversion funnel → Vercel Analytics.
2. Capture runtime error → Sentry → email alert.
3. Custom logging user action → database → generate dashboard.

---

## **3️⃣ Common Pitfalls**

| Pitfall                                   | Note / Solution                         |
| ----------------------------------------- | --------------------------------------- |
| Không cấu hình DSN đúng                   | Sentry không capture lỗi                |
| Analytics block render                    | Sử dụng `afterInteractive` cho Script   |
| Quá nhiều logging → ảnh hưởng performance | Log selective, filter dev/prod          |
| Không test integration                    | Luôn test Page Router & App Router view |

---

## **4️⃣ Further Reading / References**

* [Vercel Analytics](https://vercel.com/docs/analytics)
* [Sentry Next.js Integration](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
* [Google Analytics + Next.js](https://developers.google.com/analytics/devguides/collection/gtagjs)

---


# **Day 20: Analytics & Monitoring – Giải bài tập**

## **Level 1: Vercel Analytics Basic**

**Đề:** Cài đặt Vercel Analytics trên trang `/_app.tsx` (Page Router) hoặc `app/layout.tsx` (App Router) để theo dõi page view.

### **Page Router – Giải**

```tsx
// pages/_app.tsx
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

### **App Router – Giải**

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Giải thích:**

* `Analytics` tự động track page view.
* Không cần thêm code JS thủ công.

---

## **Level 2: Google Analytics Integration**

**Đề:** Cài Google Analytics bằng `next/script` trên cả 2 router.

### **Page Router – Giải**

```tsx
// pages/_app.tsx
import Script from 'next/script';
import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXX');
        `}
      </Script>
    </>
  );
}
```

### **App Router – Giải**

```tsx
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXX');
          `}
        </Script>
      </body>
    </html>
  );
}
```

**Giải thích:**

* `afterInteractive` → không block render.
* Tương thích SSR/CSR cả Page Router & App Router.

---

## **Level 3: Sentry Error Monitoring**

**Đề:** Setup Sentry để capture error từ API route và component.

### **Setup**

```ts
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### **API Route Example**

```ts
// pages/api/error-test.ts
import * as Sentry from '@sentry/nextjs';

export default function handler(req, res) {
  try {
    throw new Error('Test Sentry Error');
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ message: 'Error captured' });
  }
}
```

### **Component Example**

```tsx
// components/ErrorButton.tsx
import * as Sentry from '@sentry/nextjs';

export default function ErrorButton() {
  const handleClick = () => {
    try {
      throw new Error('Button Click Error');
    } catch (err) {
      Sentry.captureException(err);
    }
  };

  return <button onClick={handleClick}>Trigger Error</button>;
}
```

**Giải thích:**

* Sentry capture client + server errors.
* Breadcrumbs giúp debug action dẫn tới lỗi.
* Enterprise pattern: alert + dashboard + CI/CD check.

---

## ✅ Common Pitfalls

| Pitfall                     | Note / Solution                             |
| --------------------------- | ------------------------------------------- |
| DSN Sentry sai              | Lỗi không capture                           |
| Script GA load block render | Dùng `afterInteractive`                     |
| Không test trên cả 2 router | Luôn kiểm tra Page Router & App Router      |
| Quá nhiều logging client    | Chỉ log critical, tránh performance degrade |

---

[<< Ngày 19](./Day19.md) | [Ngày 21 >>](./Day21.md)

