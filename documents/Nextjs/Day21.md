# 🟩 Day 21: Deployment cơ bản

## **Mục tiêu học**

Sau ngày này, bạn sẽ:

1. Hiểu các bước triển khai Next.js cơ bản lên **Vercel** và **Netlify**.
2. Cấu hình biến môi trường (Environment Variables) cho cả Page Router & App Router.
3. Kiểm tra production build (`next build`) và chạy local production (`next start`).
4. Test SSR, ISR, API routes và các feature trước khi deploy.
5. Áp dụng checklist enterprise trước merge/deploy: lint, tests, types.

---

## **TL;DR**

* `next build` → build production-ready app.
* `next start` → chạy production server.
* Vercel → seamless deployment, support Page Router & App Router.
* Netlify → static hosting, cần build output directory.
* Environment variables → bảo mật thông tin, config API keys.

---

## **1️⃣ Lý thuyết chi tiết**

### **1.1 Build & Run Local Production**

```bash
# Cài dependencies
npm install

# Build production
npm run build

# Chạy local production
npm run start
```

* Kiểm tra SSR, ISR, API route hoạt động.
* Chạy thử với env variables: `.env.local`

```env
NEXT_PUBLIC_API_URL=https://api.example.com
SENTRY_DSN=xxxxxx
```

---

### **1.2 Deploy lên Vercel**

1. Đăng nhập [Vercel](https://vercel.com/).
2. Import Git repository.
3. Cấu hình project settings:

   * Framework: Next.js
   * Environment variables: thêm biến cần thiết.
4. Push code → Vercel tự build + deploy.
5. Kiểm tra production URL, test tất cả routes.

> Vercel hỗ trợ song song Page Router & App Router.

---

### **1.3 Deploy lên Netlify**

1. Tạo site mới → import repo.
2. Build command: `npm run build`
3. Publish directory: `.next` (hoặc `out` nếu static export)
4. Thêm environment variables trong Netlify UI.
5. Push code → Netlify build → kiểm tra production URL.

---

### **1.4 Checklist Enterprise Trước Deploy**

* ✅ Chạy `npm run lint` → fix lỗi ESLint.
* ✅ Chạy `npm run type-check` → TS type errors.
* ✅ Chạy `npm run test` → unit + integration tests pass.
* ✅ Kiểm tra environment variables đầy đủ.
* ✅ Kiểm tra ISR, API route, Middleware, Auth.
* ✅ Review security headers & CORS.

---

## **2️⃣ Mini Real-World Example**

* Page Router: `/posts` ISR + API routes → kiểm tra deploy trên Vercel.
* App Router: `/app/posts` → verify server components, revalidate data.
* Environment variable: `NEXT_PUBLIC_API_URL` → fetch posts.
* Test logs, error monitoring (Sentry) → alert hoạt động.

---

## **3️⃣ Common Pitfalls**

| Pitfall                           | Note / Solution                        |
| --------------------------------- | -------------------------------------- |
| Env variables thiếu               | Build production fail                  |
| ISR / SSG không hoạt động         | Kiểm tra revalidate, deployment target |
| Middleware redirect lỗi           | Test trên production URL               |
| Netlify static export nhầm folder | Sử dụng correct publish directory      |

---

## **4️⃣ Further Reading / References**

* [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
* [Vercel Docs](https://vercel.com/docs)
* [Netlify Docs](https://docs.netlify.com/)
* [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---


# **Day 21: Deployment cơ bản – Giải bài tập**

## **Level 1: Build & Run Local Production**

**Đề:** Chạy ứng dụng Next.js ở chế độ production trên local và kiểm tra Page Router & App Router.

### **Giải**

```bash
# Cài dependencies
npm install

# Build production
npm run build

# Chạy production server
npm run start
```

* Truy cập `http://localhost:3000`
* Kiểm tra các page: `/`, `/posts` (Page Router) và `/app/posts` (App Router)
* Đảm bảo ISR, API route hoạt động.

**Giải thích:**

* `npm run build` → tạo production build.
* `npm run start` → server SSR & App Router chạy chuẩn production.

---

## **Level 2: Deploy lên Vercel**

**Đề:** Deploy app lên Vercel, bao gồm cả Page Router và App Router, với environment variable.

### **Giải**

1. Tạo project mới trên Vercel, import repo Git.
2. Cấu hình environment variables:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
SENTRY_DSN=xxxxxx
```

3. Vercel tự build & deploy app.
4. Kiểm tra production URL:

* `/posts` (Page Router)
* `/app/posts` (App Router)
* API routes: `/api/posts`
* ISR revalidate hoạt động.

**Giải thích:**

* Vercel native hỗ trợ Next.js → không cần config đặc biệt.
* Environment variables được bảo mật và inject trong build.

---

## **Level 3: Deploy lên Netlify với Static + Server Functions**

**Đề:** Deploy app lên Netlify, bao gồm:

* Static build (Page Router)
* Serverless function (API route)
* Environment variable

### **Giải**

1. Netlify import repo.
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Thêm environment variables trong Netlify UI.

**Test:**

* Truy cập Page Router & App Router pages
* Gọi API routes → kiểm tra response
* Kiểm tra ISR / revalidate nếu có

**Giải thích:**

* Netlify cần serverless function cho API route → Next.js adapter.
* Cần kiểm tra lại publish directory `.next` hoặc `out` nếu static export.

---

## ✅ Common Pitfalls

| Pitfall                           | Note / Solution                        |
| --------------------------------- | -------------------------------------- |
| Env variables thiếu               | Build production fail                  |
| ISR / SSG không hoạt động         | Kiểm tra revalidate, deployment target |
| Middleware redirect lỗi           | Test trên production URL               |
| Netlify static export nhầm folder | Sử dụng correct publish directory      |

---

[<< Ngày 20](./Day20.md) | [Ngày 22 >>](./Day22.md)
