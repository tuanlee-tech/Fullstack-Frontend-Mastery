# 🟩 Day 22: Deployment nâng cao

## **Mục tiêu học**

Sau ngày này, bạn sẽ:

1. Thiết lập **CI/CD pipeline** (GitHub Actions / GitLab CI) cho Next.js.
2. Quản lý **secret & environment variable** an toàn trong pipeline.
3. Triển khai **preview deployments** cho feature branch.
4. Áp dụng best practices: lint, tests, type-check trước merge.
5. Hiểu các chiến lược deployment enterprise (atomic deploy, rollback, monitoring).

---

## **TL;DR**

* CI/CD → tự động build, test, deploy.
* Secrets → lưu trên repo/CI → không commit trực tiếp.
* Preview deployment → test feature branch trước merge.
* Enterprise pattern: PR → CI/CD → lint/tests → deploy → monitor → merge.

---

## **1️⃣ Lý thuyết chi tiết**

### **1.1 GitHub Actions – Workflow cơ bản**

```yaml
# .github/workflows/deploy.yml
name: Deploy Next.js

on:
  push:
    branches:
      - main
      - 'feature/*'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Type check
        run: npm run type-check
      - name: Test
        run: npm run test
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: .
```

* Feature branch → Preview deploy
* Main branch → Production deploy
* Secrets → lưu trên GitHub → không commit.

---

### **1.2 Environment Variables & Secrets**

* `.env.production` → build-time vars
* `.env.local` → local dev vars
* CI/CD secrets → inject trong workflow: `VERCEL_TOKEN`, `SENTRY_DSN`, `NEXT_PUBLIC_API_URL`
* Không commit thông tin nhạy cảm vào Git

---

### **1.3 Preview Deployment**

* Vercel tạo preview deployment cho branch khác `main`.
* Test feature trước merge: `/feature/my-new-page` → deploy riêng, test SSR, API, ISR.
* App Router & Page Router đều hoạt động.

---

### **1.4 Rollback & Enterprise Best Practices**

* Atomic deploy → rollback nhanh nếu build lỗi.
* Monitoring + Analytics → verify production ổn định.
* PR review → lint, tests, type-check, security scan.

---

## **2️⃣ Mini Real-World Example**

* Page Router: `/posts` → CI/CD build + preview deploy
* App Router: `/app/posts` → verify server component, revalidate data
* Environment variable: `NEXT_PUBLIC_API_URL` → fetch data
* Test API route `/api/posts` trong preview deployment

---

## **3️⃣ Common Pitfalls**

| Pitfall                       | Note / Solution                                  |
| ----------------------------- | ------------------------------------------------ |
| Secrets commit vào repo       | Luôn dùng CI/CD secrets                          |
| Preview deployment không test | Kiểm tra SSR & API trên branch trước merge       |
| CI/CD fail do lint/type/test  | Luôn fix trước merge                             |
| Deployment rollback chậm      | Sử dụng Vercel atomic deploy hoặc feature toggle |

---

## **4️⃣ Further Reading / References**

* [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
* [Vercel CI/CD](https://vercel.com/docs/concepts/deployments/overview)
* [GitHub Actions Docs](https://docs.github.com/en/actions)
* [Environment Variables Best Practices](https://nextjs.org/docs/basic-features/environment-variables)

---


# **Day 22: Deployment nâng cao – Giải bài tập**

## **Level 1: CI/CD Build & Test**

**Đề:** Viết GitHub Actions workflow để tự động **lint, type-check, test, build** app mỗi khi push lên branch `main` hoặc `feature/*`.

### **Giải**

```yaml
# .github/workflows/deploy.yml
name: Deploy Next.js

on:
  push:
    branches:
      - main
      - 'feature/*'

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Type check
        run: npm run type-check
      - name: Test
        run: npm run test
      - name: Build
        run: npm run build
```

**Giải thích:**

* Workflow tự động build/test app → phát hiện lỗi sớm.
* Áp dụng cho cả Page Router & App Router.

---

## **Level 2: Preview Deployment**

**Đề:** Triển khai feature branch lên Vercel preview deployment, kiểm tra SSR, API routes, App Router pages.

### **Giải**

1. Tạo branch `feature/new-page`.
2. Push lên GitHub → Vercel tạo preview deployment.
3. Truy cập URL preview, test:

* `/feature/new-page` (App Router)
* `/posts` (Page Router)
* API route `/api/posts` hoạt động

**Tips:**

* Preview deployment giúp test feature mà không ảnh hưởng production.
* Đảm bảo environment variables được inject đúng (SENTRY\_DSN, NEXT\_PUBLIC\_API\_URL).

---

## **Level 3: Secret Management & Rollback**

**Đề:** Sử dụng secrets trong workflow, cấu hình rollback khi deployment lỗi.

### **Giải**

```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v20
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    working-directory: .
```

* Secrets lưu trong GitHub → bảo mật.
* Nếu build/deploy lỗi → Vercel tự rollback → không làm gián đoạn production.

**Kiểm tra rollback:**

* Simulate lỗi trong feature branch → xem production site vẫn hoạt động.
* App Router & Page Router không bị ảnh hưởng.

---

## ✅ Common Pitfalls

| Pitfall                       | Note / Solution                            |
| ----------------------------- | ------------------------------------------ |
| Secrets commit vào repo       | Luôn dùng CI/CD secrets                    |
| Preview deployment không test | Kiểm tra SSR & API trên branch trước merge |
| CI/CD fail do lint/type/test  | Fix trước merge                            |
| Rollback chậm                 | Sử dụng Vercel atomic deploy               |

---

[<< Ngày 21](./Day21.md) | [Ngày 23 >>](./Day23.md)
