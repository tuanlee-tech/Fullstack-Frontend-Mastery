# Next.js Senior-Level Roadmap (Page Router + App Router)

## Thông tin chung

* **Chủ đề:** Next.js Senior-Level – Fullstack Frontend & Enterprise
* **Mục tiêu khóa học:** Frontend/Junior → Senior Fullstack Next.js
* **Độ dài:** 30 ngày + 3 mini-projects + 1 capstone project
* **Đối tượng:** Frontend dev muốn nâng cấp fullstack, new grad, dev muốn triển khai production apps
* **Prerequisites:** JavaScript ES6+, React cơ bản, HTML/CSS, Node.js cơ bản
* **Ngôn ngữ:** Tiếng Việt
* **Phong cách:** Production-ready, clean code, senior-level, enterprise examples

---

## Mục tiêu tổng quát

1. Hiểu sâu cả **Page Router (`pages/`)** và **App Router (`app/`)** Next.js 13+
2. Xây dựng pages, components, dynamic routes, nested routes, catch-all routes
3. Tích hợp API routes / route handlers, auth, forms, file upload
4. State management với Zustand / Redux Toolkit / Jotai
5. Performance, caching, ISR, SEO, analytics, monitoring
6. Unit testing + integration test, deployment (Vercel + CI/CD)
7. Mini-projects & Capstone Project production-ready

---

## Roadmap 30 ngày (song song Page Router + App Router)

| Ngày       | Chủ đề                              | Nội dung & Mục tiêu đạt được                                                                                                                                                   |
| ---------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Day 1**  | Giới thiệu Next.js & môi trường dev | - Hiểu Page Router & App Router<br>- Setup project TS, ESLint, Prettier<br>- Tạo pages, components cơ bản                                                                      |
| **Day 2**  | Routing nâng cao & Dynamic Routes   | - `[param]` & `[[...slug]]` Page Router<br>- `[param]/page.tsx` App Router<br>- Nested routes & Link navigation                                                                |
| **Day 3**  | Data Fetching cơ bản                | - Page Router: `getStaticProps`, `getServerSideProps`, `getStaticPaths`<br>- App Router: Server Components + `fetch`, `generateStaticParams`                                   |
| **Day 4**  | Client-side Data Fetching           | - Fetch trong component<br>- SWR / React Query<br>- Song song 2 router                                                                                                         |
| **Day 5**  | API Routes & Route Handlers         | - Page Router: `pages/api/`<br>- App Router: `app/api/` route handlers<br>- Typed response + validation (Zod)                                                                  |
| **Day 6**  | Middleware & Edge Functions         | - Redirects, logging, auth checks<br>- So sánh cách Page Router vs App Router                                                                                                  |
| **Day 7**  | Authentication cơ bản               | - JWT / Session / NextAuth.js<br>- Implement song song 2 router                                                                                                                |
| **Day 8**  | State Management                    | - Zustand / Redux Toolkit / Jotai<br>- Enterprise patterns, shared state between SSR & CSR                                                                                     |
| **Day 9**  | Styling                             | - CSS Modules, Tailwind CSS, Styled Components<br>- Song song ví dụ Page Router & App Router                                                                                   |
| **Day 10** | Image & Asset Optimization          | - `next/image`, fonts, static assets, caching                                                                                                                                  |
| **Day 11** | SEO & Metadata                      | - Meta tags, Open Graph, next-seo, enterprise SEO patterns                                                                                                                     |
| **Day 12** | Forms & Validation                  | - React Hook Form + Zod/Yup<br>- Reusable form components                                                                                                                      |
| **Day 13** | File Upload & Handling API          | - Multi-part form, cloud storage mock, API validation                                                                                                                          |
| **Day 14** | Error Handling & Fallback UI        | - Error boundaries, 404/500, loading skeletons                                                                                                                                 |
| **Day 15** | Internationalization (i18n)         | - `next-i18next`, locale routing, SEO-friendly i18n                                                                                                                            |
| **Day 16** | Performance Optimization            | - Lazy loading, bundle splitting, caching, prefetching                                                                                                                         |
| **Day 17** | Advanced Routing                    | - Rewrite, redirect, dynamic route protection<br>- So sánh Page Router & App Router                                                                                            |
| **Day 18** | Caching & ISR                       | - ISR, stale-while-revalidate, App Router server components caching                                                                                                            |
| **Day 19** | Testing cơ bản                      | - Jest + React Testing Library, Page Router vs App Router<br>- Unit + integration tests                                                                                        |
| **Day 20** | Analytics & Monitoring              | - Vercel Analytics, Sentry, logging, performance monitoring                                                                                                                    |
| **Day 21** | Deployment cơ bản                   | - Vercel, Netlify, env variables<br>- Test cả 2 router                                                                                                                         |
| **Day 22** | Deployment nâng cao                 | - CI/CD, secrets, preview deployments                                                                                                                                          |
| **Day 23** | Next.js + Database                  | - Prisma / MongoDB / PostgreSQL<br>- Typed queries & migration patterns                                                                                                        |
| **Day 24** | Fullstack Project Setup             | - Skeleton project, folder structure song song Page + App Router                                                                                                               |
| **Day 25** | Feature Implementation 1            | - Auth, API, DB integration (song song 2 router)                                                                                                                               |
| **Day 26** | Feature Implementation 2            | - Dynamic pages, fetch data, client-side integration                                                                                                                           |
| **Day 27** | Feature Implementation 3            | - State management, caching, SWR, performance tuning                                                                                                                           |
| **Day 28** | Optimization & Best Practices       | - Code splitting, SEO, accessibility, security, enterprise tips                                                                                                                |
| **Day 29** | Testing & Deployment Project        | - Unit / integration test, lint, build, deploy mini-projects                                                                                                                   |
| **Day 30** | Capstone Project Kickoff            | - Fullstack e-commerce app<br>- Folder `/pages/` Page Router + `/app/` App Router<br>- Acceptance criteria: Auth, CRUD, Cart, Checkout, SEO, Tests ≥70%, Production deployment |

---

## Mini-Projects

1. **Mini-Project 1 (Day 5–7):** Blog App – Pages, dynamic routes, API, auth cơ bản (Page + App Router).
2. **Mini-Project 2 (Day 12–14):** Form Management & File Upload App.
3. **Mini-Project 3 (Day 18–20):** Analytics Dashboard – Data fetch + ISR + charts.

---

## Capstone Project

* **Day 24–30:** Fullstack e-commerce Next.js app
* **Yêu cầu:**

  1. Auth & authorization
  2. Products CRUD + Orders management
  3. Cart & Checkout flow
  4. Responsive UI + SEO optimized
  5. Unit/Integration tests ≥70% coverage
  6. Folder `/pages/` (Page Router) + `/app/` (App Router)
  7. Deployment: Vercel + CI/CD pipeline
  8. Lint + Prettier + TypeScript strict

---

## Học theo cách song song

* Ví dụ mỗi ngày:

  * **Page Router version** → folder `examples/page-router/day-XX/`
  * **App Router version** → folder `examples/app-router/day-XX/`
  * So sánh code, performance, SEO, maintainability

* Các bài tập Level 1→3 sẽ có **2 phiên bản code** song song để học viên nắm chắc cả 2 cơ chế.

---