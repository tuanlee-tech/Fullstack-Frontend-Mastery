# 🧭 Overview Kiến Thức Toàn Bộ

## 🔹 Ngôn ngữ & Cơ bản

* **JavaScript (ES6+)** → ngôn ngữ nền tảng cho web front-end, hỗ trợ async/await, modules, closures.
* **TypeScript** → JavaScript có type, giúp code an toàn, dễ maintain, được dùng mặc định trong dự án.
* **HTML5 + CSS3 (Flexbox, Grid)** → cấu trúc + trình bày UI web.
* **TailwindCSS** → CSS utility-first, tăng tốc phát triển UI.

---

## 🔹 React & Ecosystem

* **React 18** → thư viện UI component-based, hooks, concurrent rendering.
* **Next.js (App Router, SSR, ISR, SSG, PWA)** → framework full-stack cho React, hỗ trợ server-side render, SEO, caching.
* **React Hook Form** → quản lý form nhẹ, dễ validate.
* **Framer Motion** → thư viện animation cho React.

---

## 🔹 State Management

* **Redux Toolkit (RTK)** → quản lý state phức tạp, code ít boilerplate.
* **Redux Thunk** → middleware cho async logic đơn giản.
* **Redux Saga** → middleware cho luồng async phức tạp (orchestration, retry, cancel).
* **TanStack Query (React Query)** → quản lý server state, caching, sync dữ liệu với API.
* **Zustand** → state management đơn giản cho UI/local state.
* **Context API** → chia sẻ state nhẹ trong app.

---

## 🔹 Backend & API

* **REST API** → giao tiếp client-server qua endpoint.
* **GraphQL (optional)** → query linh hoạt dữ liệu (nếu áp dụng sau).
* **WebSocket** → realtime (chat, cập nhật trạng thái phòng trọ).
* **Authentication (JWT, session)** → xác thực user.
* **Payment Gateway (Stripe/Momo/VNPay)** → tích hợp thanh toán.

---

## 🔹 Database & CMS

* **PostgreSQL / MySQL** → database quan hệ phổ biến.
* **Prisma ORM** → map database sang code dễ thao tác.
* **Headless CMS (Sanity/Strapi)** → quản lý content sản phẩm.

---

## 🔹 Patterns & Architecture

* **Design Patterns**:

  * **Factory** → tạo object phức tạp.
  * **Singleton** → config/log service toàn cục.
  * **Observer** → event-driven (user role, real-time update).
  * **Strategy** → thay đổi thuật toán linh hoạt (payment, sort).
* **Clean Architecture / Separation of Concerns** → code dễ maintain, testable.

---

## 🔹 Data Structures & Algorithms (DSA)

* **Array, String, Hash Map** → nền tảng, search/filter.
* **Sorting, Searching** → tối ưu dữ liệu.
* **Tree, Graph** → cấu trúc phức tạp (ví dụ cây category, network).
* **Recursion, Dynamic Programming** → giải bài toán phỏng vấn.

---

## 🔹 Testing & Quality

* **Jest** → unit test JS/TS.
* **React Testing Library** → test component React.
* **Cypress / Playwright** → test end-to-end UI flow.
* **MSW (Mock Service Worker)** → giả lập API trong test.
* **ESLint + Prettier** → lint + format code chuẩn.

---

## 🔹 Performance & Optimization

* **Code Splitting, Lazy Loading** → giảm bundle size.
* **Image Optimization (Next.js Image)** → tối ưu ảnh.
* **Memoization (React.memo, useMemo, useCallback)** → tránh render thừa.
* **Bundle Analyzer** → kiểm tra size package.

---

## 🔹 Accessibility (A11y)

* **ARIA roles** → hỗ trợ screen reader.
* **Keyboard Navigation** → điều khiển app bằng bàn phím.
* **Color Contrast** → hỗ trợ người mù màu.

---

## 🔹 DevOps & Deployment

* **Git/GitHub** → quản lý version, code collaboration.
* **GitHub Actions** → CI/CD (test + deploy tự động).
* **Vercel** → hosting Next.js web app.
* **Railway/Render** → hosting backend.
* **Docker (optional)** → đóng gói app.
* **Env Management (.env)** → quản lý config.

---

## 🔹 Tools & Productivity

* **VSCode + Extensions (ESLint, Prettier, GitLens)** → dev environment.
* **Postman/Insomnia** → test API.
* **Figma** → thiết kế UI, prototype.
* **Notion/Obsidian** → note technical & blog.

---

## 🔹 Soft Skills & Communication

* **Technical English** → đọc tài liệu, viết docs, commit message, PR review.
* **Presentation** → trình bày kiến trúc, trade-off trong dự án.
* **Mock Interview** → luyện trả lời phỏng vấn (system design, DSA, technical trade-off).

---

<details>
<summary># 📝 Dự Án 0 – Foundation Mini Project</summary>

## 🎯 Mục tiêu dự án

* Rà soát lại toàn bộ kiến thức **JS core, React, state management, TypeScript, DSA, patterns**.
* Thực hành **các luồng async & server state**: thunk, saga, TanStack Query.
* Luyện **form handling, validation, reusable components, basic PWA**.
* Có thể **review code bằng AI** để kiểm tra chất lượng.

---

## 📦 Tính năng chính

### 🔹 Core Features

1. **To-do List / Task Manager**

   * CRUD task (create, read, update, delete).
   * Filter & sort task theo priority, deadline.
   * Tích hợp **undo/redo** bằng observer pattern.

2. **User Authentication (optional)**

   * Đăng ký / login / logout (JWT).
   * Profile cơ bản.

3. **Async Data Handling**

   * Thêm task từ API giả lập (MSW hoặc JSONPlaceholder).
   * Retry logic: Redux Saga.
   * Server state caching: TanStack Query.

4. **Form Handling & Validation**

   * Thêm/Chỉnh sửa task với **React Hook Form + Yup**.

5. **State Management Showcase**

   * Redux Toolkit cho app-wide state (task list, auth).
   * Thunk cho async đơn giản.
   * Saga cho async orchestration & retry.
   * Zustand cho UI state nhẹ (modal, sidebar).

6. **DSA Application**

   * Task list sorting (quick sort, merge sort).
   * Search/filter task (linear search / hash map).

7. **Design Patterns**

   * Observer: task status update, undo/redo.
   * Factory: tạo task object.
   * Strategy: thay đổi sort/filter algorithm.

---

### 🔹 Optional Advanced Features

* Offline support (service worker PWA).
* Local storage sync & cache tasks.
* Simple notification (browser alert) khi task deadline gần.

---

## 🛠 Công nghệ sử dụng

### 🔹 Frontend

* React 18 + TypeScript
* TailwindCSS / shadcn/ui
* React Hook Form + Yup
* Framer Motion (animations nhẹ)

### 🔹 State Management

* Redux Toolkit + Thunk
* Redux Saga
* TanStack Query
* Zustand

### 🔹 Backend & API

* MSW / Next.js API routes (mock API)
* Optional: Express + Prisma + SQLite (local db)

### 🔹 Testing & Quality

* Jest + RTL (unit + component)
* ESLint + Prettier

### 🔹 Patterns & Architecture

* Factory, Observer, Strategy
* Clean component & service separation

### 🔹 Performance & Optimization

* Memoization (useMemo, React.memo)
* Lazy load components

### 🔹 DevOps & Deploy

* GitHub Actions (test)
* Vercel deploy mini project

---

## 🚀 Deliverables

* Repo GitHub: `foundation-mini-project`.
* Demo online (Vercel).
* Blog note: “How I applied Saga, Thunk, Patterns in Mini Project”.
* Code review: bằng AI + checklist quality.

</details>

---

<details>
<summary># 🛋 Dự Án 1 – Ecommerce Sofa + CMS</summary>

## 🎯 Mục tiêu dự án

* Xây dựng **website bán sofa** với đầy đủ tính năng thương mại điện tử.
* Có **Admin CMS riêng** để quản lý sản phẩm, đơn hàng, user.
* Showcase khả năng **state management, server-side rendering, form, testing, performance, devops**.

---

## 📦 Tính năng chính

### 🔹 Phía User (Customer site)

1. **Trang chủ (Home)**

   * Banner, sản phẩm nổi bật.
   * Bộ lọc theo category, price, rating.

2. **Product Listing (Danh sách sản phẩm)**

   * Search, filter, sort (giá, rating, mới nhất).
   * Pagination / Infinite scroll.

3. **Product Detail**

   * Hình ảnh (gallery, zoom).
   * Thông tin chi tiết (mô tả, chất liệu, review).
   * Nút **Add to Cart / Buy Now**.

4. **Cart & Checkout**

   * Cart (add/remove/update số lượng).
   * Checkout form (địa chỉ, shipping, payment).
   * Payment integration (Stripe demo hoặc Momo/VNPay sandbox).

5. **Authentication**

   * Đăng ký, đăng nhập (JWT / NextAuth).
   * Reset password.
   * Profile (update info, xem đơn hàng).

6. **Order Tracking**

   * Lịch sử đơn hàng.
   * Trạng thái đơn (pending, shipped, delivered).

---

### 🔹 Phía Admin (CMS)

1. **Dashboard**

   * Thống kê doanh thu, số đơn hàng, top sản phẩm.

2. **Quản lý sản phẩm**

   * CRUD sản phẩm (ảnh, mô tả, giá, tồn kho).
   * Upload ảnh (Cloudinary/S3).

3. **Quản lý đơn hàng**

   * Xem danh sách đơn.
   * Cập nhật trạng thái đơn (processing → shipped → delivered).

4. **Quản lý user**

   * Danh sách khách hàng.
   * Khóa/mở tài khoản.

5. **Role & Permission (basic)**

   * Admin full quyền.
   * Staff chỉ được quản lý đơn hàng.

---

## 🛠 Công nghệ sử dụng

### 🔹 Frontend

* **Next.js 14 (App Router)** → SSR/ISR, SEO tốt.
* **React 18 + TypeScript** → UI component-based, type-safe.
* **TailwindCSS + shadcn/ui** → UI nhanh + hiện đại.
* **Framer Motion** → animation mượt.

### 🔹 State Management

* **Redux Toolkit (RTK)** → cart, auth, admin state.
* **Redux Thunk** → logic async đơn giản.
* **TanStack Query** → quản lý server state (products, orders).
* **Zustand** → UI state nhẹ (sidebar, modal).

### 🔹 Backend & API

* **Next.js API Routes** hoặc **Express (nếu muốn tách)**.
* **Prisma ORM** + PostgreSQL → database chính.
* **Stripe/Momo/VNPay sandbox** → payment gateway.
* **NextAuth (JWT)** → authentication.

### 🔹 Patterns & Architecture

* **Factory** (tạo object sản phẩm).
* **Observer** (theo dõi thay đổi order status).
* **Strategy** (thay đổi phương thức thanh toán).
* **Clean Architecture** → phân tầng rõ ràng (UI / Service / Data).

### 🔹 Testing & Quality

* **Jest + React Testing Library** → unit test + component test.
* **Cypress/Playwright** → end-to-end flow (checkout, order).
* **MSW** → mock API trong test.
* **ESLint + Prettier** → format & lint code.

### 🔹 Performance & Optimization

* **Next.js Image** → tối ưu ảnh.
* **Code splitting & lazy load** → giảm bundle.
* **Memoization (useMemo, React.memo)** → tránh render thừa.

### 🔹 DevOps & Deploy

* **GitHub Actions** → CI/CD (test + deploy).
* **Vercel** → deploy frontend + API.
* **Railway/Render** → deploy PostgreSQL database.
* **.env management** → bảo mật config.

---

## 🚀 Deliverables

* **2 repo riêng biệt**:

  * `ecommerce-sofa-web` (customer site).
  * `ecommerce-sofa-cms` (admin site).
* **Demo online (Vercel + Railway)**.
* **Docs & Blog note**: kiến trúc, trade-off (RTK vs Query, SSR vs CSR).
* **Slide** để trình bày phỏng vấn.

</details>

---

<details>
<summary># 🏠 Dự Án 2 – Rental Management PWA</summary>

## 🎯 Mục tiêu dự án

* Xây dựng **ứng dụng quản lý nhà trọ dạng PWA mobile-first**, hỗ trợ **đa vai trò người dùng**.
* Có hệ thống **role & permission động** cho chủ trọ phân quyền nhân viên.
* Có luồng **saler referral** để quảng bá và tính hoa hồng.
* Showcase khả năng **authentication, real-time, state management phức tạp, offline-first**.

---

## 📦 Tính năng chính

### 🔹 Phía Admin (bạn – chủ app)

1. **Dashboard**

   * Thống kê số chủ trọ đăng ký, số phòng trọ, số user hoạt động.
   * Doanh thu từ gói membership.

2. **Membership Plan**

   * Tạo gói membership (Free, Basic, Pro).
   * Theo dõi doanh thu từ nâng cấp gói.

3. **Quản lý Saler**

   * Tạo mã referral cho từng saler.
   * Theo dõi hiệu suất saler (bao nhiêu chủ trọ được giới thiệu, hoa hồng).

---

### 🔹 Phía Chủ Trọ (Landlord)

1. **Quản lý Nhà Trọ**

   * CRUD nhà trọ, phòng trọ.
   * Quản lý trạng thái phòng (còn trống / đã thuê).

2. **Quản lý Người Thuê (Tenant)**

   * Thông tin tenant (hợp đồng, tiền cọc).
   * Ghi nhận thanh toán, nợ tiền.

3. **Quản lý Role & Permission**

   * Chủ trọ tạo **role bất kỳ** (ví dụ: “Lễ tân”, “Kế toán”).
   * Chọn **checkbox permission (CRUD)** cho từng role.
   * Assign nhân viên vào role để phân việc.

4. **Quản lý Nhân Viên**

   * Thêm/xóa nhân viên.
   * Phân quyền role đã tạo.

---

### 🔹 Phía Nhân Viên (Staff)

* Đăng nhập vào app theo role được phân.
* Chỉ thấy menu & chức năng theo permission (ví dụ lễ tân chỉ xem phòng, không xóa).

---

### 🔹 Phía Saler

1. **Referral Flow**

   * Saler có mã referral duy nhất.
   * Khi chủ trọ đăng ký app → điền mã referral.
   * Saler nhận hoa hồng khi chủ trọ nâng cấp membership.

2. **Dashboard Saler**

   * Xem số chủ trọ được giới thiệu.
   * Xem tổng hoa hồng đã tích lũy.

---

### 🔹 Phía Tenant (người thuê) – optional

* Đăng nhập để xem hợp đồng, tiền thuê, lịch thanh toán.
* Nhận thông báo (web push / email).

---

## 🛠 Công nghệ sử dụng

### 🔹 Frontend

* **Next.js 14 (App Router, PWA)** → mobile-first + offline-first.
* **React 18 + TypeScript** → type-safe + maintainable.
* **TailwindCSS + shadcn/ui** → UI nhanh & đẹp.
* **Service Worker + Workbox** → PWA offline.

### 🔹 State Management

* **Redux Toolkit** → auth, role/permission, landlord data.
* **Redux Saga** → handle side effect phức tạp (role dynamic, retry khi offline).
* **TanStack Query** → server state (rooms, tenants, payments).
* **Zustand** → UI state nhỏ (drawer, modal).

### 🔹 Backend & API

* **Next.js API Routes** hoặc **NestJS** nếu muốn backend mạnh.
* **PostgreSQL + Prisma ORM** → quan hệ (user, landlord, staff, tenant, saler, referral, payments).
* **WebSocket (Socket.io / WS)** → real-time (cập nhật trạng thái phòng, thông báo).
* **NextAuth (JWT)** → auth đa vai trò.
* **Payment Gateway** → Momo/VNPay cho landlord nâng cấp gói.

### 🔹 Patterns & Architecture

* **Observer** → real-time notification cho landlord/staff.
* **Strategy** → thay đổi logic thanh toán (gói Free, Basic, Pro).
* **Factory** → tạo role/permission object.
* **Middleware pattern** → xử lý quyền hạn theo request.

### 🔹 Testing & Quality

* **Jest + RTL** → test UI + hooks.
* **Cypress** → e2e (luồng landlord tạo role & assign staff).
* **MSW** → mock API trong test.
* **ESLint + Prettier** → coding convention.

### 🔹 Performance & Optimization

* **Code splitting** theo vai trò user (admin, landlord, staff, saler).
* **React.memo / useMemo** để tối ưu list phòng & tenant.
* **Next.js Image & caching** để giảm tải.

### 🔹 DevOps & Deploy

* **GitHub Actions** → CI/CD test + build.
* **Vercel** → deploy frontend + API.
* **Railway/Render** → database Postgres.
* **.env management** → tách key payment, JWT secret.

---

## 🚀 Deliverables

* Repo GitHub public: `rental-management-pwa`.
* Demo deploy online (Vercel + Railway).
* Docs: luồng saler referral, role & permission design.
* Blog note: “Building a Dynamic Role & Permission System with Redux Saga”.
* Slide kiến trúc: real-time, role-based access control, offline-first.

</details>

---

<details>
<summary># 🗂 Bảng So Sánh 3 Dự Án</summary>

| Tiêu chí                       | Dự án 0 – Foundation Mini Project                                            | Dự án 1 – Ecommerce Sofa + CMS                                                   | Dự án 2 – Rental Management PWA                                                                                       |
| ------------------------------ | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Mục tiêu**                   | Rà soát & ôn lại JS core, TS, React, DSA, patterns, state management         | Website bán sofa + CMS admin                                                     | Mobile-first PWA quản lý nhà trọ, role dynamic, saler referral                                                        |
| **Người dùng**                 | 1 user (cá nhân)                                                             | Customer + Admin                                                                 | Admin (bạn) + Landlord (chủ trọ) + Staff + Saler + Tenant                                                             |
| **Quy mô & Complexity**        | Nhỏ – basic → medium                                                         | Trung bình → lớn                                                                 | Lớn – nhiều vai trò + real-time + offline + complex logic                                                             |
| **Core Features**              | Task CRUD, filter/sort, undo/redo, form validation                           | Product listing, product detail, cart/checkout, order tracking, auth             | House CRUD, room CRUD, tenant mgmt, role & permission, saler referral, payment & membership                           |
| **Async / Server State**       | Redux Thunk, Redux Saga, TanStack Query (mock API)                           | RTK + Thunk, Saga (retry), TanStack Query (products/orders)                      | RTK + Saga (role, retry, real-time), TanStack Query (rooms/tenants/payments), WebSocket                               |
| **State Management**           | Redux Toolkit, Thunk, Saga, TanStack Query, Zustand                          | Redux Toolkit, Thunk, Saga, TanStack Query, Zustand                              | Redux Toolkit, Thunk, Saga, TanStack Query, Zustand                                                                   |
| **TypeScript**                 | Có                                                                           | Có                                                                               | Có                                                                                                                    |
| **Patterns áp dụng**           | Observer, Factory, Strategy                                                  | Observer, Factory, Strategy (order status, payment), Singleton                   | Observer (real-time), Factory (role/task), Strategy (sort/payment), Middleware pattern (permission check)             |
| **DSA áp dụng**                | Array, string, sorting, recursion, hash map                                  | Sorting, filtering (arrays/objects), search, basic trees                         | Sorting/filtering (rooms/tenants), search, hash map, optional trees (tenants/rooms structure)                         |
| **Frontend Tech**              | React 18, TypeScript, TailwindCSS, shadcn/ui, React Hook Form, Framer Motion | Next.js 14, React 18, TypeScript, TailwindCSS, shadcn/ui, Framer Motion          | Next.js 14 (PWA), React 18, TypeScript, TailwindCSS, shadcn/ui, Framer Motion, Service Worker                         |
| **Backend / API**              | Mock API (MSW / Next.js API routes), optional Express+SQLite                 | Next.js API routes / Express, Prisma + PostgreSQL, payment sandbox               | Next.js API / NestJS optional, Prisma + PostgreSQL, WebSocket, payment sandbox                                        |
| **Testing**                    | Jest + RTL, optional Cypress                                                 | Jest + RTL, Cypress/Playwright                                                   | Jest + RTL, Cypress, MSW                                                                                              |
| **Performance & Optimization** | Memoization, lazy load                                                       | Next.js Image, lazy load, memoization                                            | Code splitting theo vai trò, memoization, caching, lazy load                                                          |
| **DevOps & Deploy**            | GitHub Actions (test), Vercel                                                | GitHub Actions, Vercel (frontend + API), Railway (DB)                            | GitHub Actions, Vercel (frontend + API), Railway/Render (DB)                                                          |
| **Offline / Real-time**        | Không                                                                        | Không                                                                            | PWA offline-first, WebSocket real-time                                                                                |
| **Deliverables**               | Repo GitHub, demo Vercel, blog note patterns + saga/thunk                    | 2 repo (web + CMS), demo online, docs, slide kiến trúc                           | Repo GitHub, demo online, docs role/referral/payment, slide kiến trúc                                                 |
| **Học được / áp dụng**         | Ôn tập TS, JS core, React, patterns, DSA, saga/thunk, query                  | Ecommerce flows, checkout logic, RTK/Query, patterns, testing, SSR/CSR trade-off | Complex roles & permissions, real-time, offline, referral flow, advanced state mgmt, saga orchestration, PWA patterns |

</details>

---

<details>
<summary>💡 **Nhận xét:**</summary>

* Dự án 0 → nhỏ nhưng **bao phủ toàn bộ kiến thức nền tảng**, là “sandbox” để thử tất cả patterns, DSA, state management.
* Dự án 1 → thực tế **ecommerce**, dễ hình dung với nhiều feature business, tập trung **frontend & CMS admin**.
* Dự án 2 → phức tạp nhất, **role dynamic, multi-user, referral, real-time, offline**, gần với trải nghiệm công ty lớn, là “showcase senior”.

</details>