# 🚀 Chương Trình “Fullstack Frontend Mastery – TypeScript & Real Projects”

## 🎯 Mục Tiêu Chương Trình

* **Nâng cấp từ Junior → Senior Frontend Engineer** với toàn bộ kỹ năng cần thiết: JavaScript/TypeScript, React/Next.js, state management nâng cao, design patterns, DSA, testing, performance, accessibility, DevOps.
* **Hoàn thiện 2 dự án thực tế** để show portfolio:

  1. **Ecommerce Sofa + CMS**
  2. **Rental Management PWA**
* **Áp dụng kiến thức thực tế**: state management nâng cao, patterns & DSA vào feature thực tế, song song với CI/CD, testing và deploy.
* **Rèn luyện tiếng Anh chuyên ngành & kỹ năng mềm**: documentation, blog, commit chuẩn, code review, mock interview.
* **Tự tin phỏng vấn** tại công ty lớn và làm việc trong môi trường Frontend Senior.

---

<details>
<summary># 🧩 Overview Giai Đoạn Phụ (Foundation – 15~30 ngày, updated)</summary>

## 🎯 Mục tiêu

* Rà soát & làm chắc **JavaScript + React/Next.js**.
* Làm quen & áp dụng **TypeScript cơ bản đến nâng cao vừa đủ** để chuẩn hóa codebase.
* Nắm được cách dùng **Redux Toolkit, Thunk, Saga, TanStack Query, Zustand**.
* Ôn tập **design patterns & DSA basic → medium**.
* Làm quen **testing + CI + docs bằng tiếng Anh**.
* Hoàn thành **mini-project (mini CMS)** để gom hết kiến thức.

---

## 📚 Nội dung chính theo tuần

### 🔹 Week 1 – JS & TypeScript Essentials

* **JavaScript nâng cao**: closure, prototype, async/await, modules.
* **TypeScript basics**: type, interface, enum, generics, utility types.
* **React + TS**: type props, state, custom hook, context.
* Mini-lab: viết lại **Todo App với TS + Context**.

### 🔹 Week 2 – State Management Core

* Redux Toolkit (slice, middleware).
* Redux Thunk (async cơ bản).
* Redux Saga (watcher, worker, retry, cancel).
* **TypeScript + Redux**: type cho store, action, payload.
* Mini-lab: CRUD list (fake API) bằng **Thunk vs Saga** + typing đầy đủ.

### 🔹 Week 3 – Server State & UI State

* TanStack Query (fetching, caching, retry, invalidate).
* RTK Query vs TanStack Query (trade-off).
* Zustand (UI state nhỏ: modal, theme).
* Mini-lab: app nhỏ hiển thị list sản phẩm với **TanStack Query + Zustand**.

### 🔹 Week 4 – Patterns, DSA & TS nâng cao

* **Design Patterns**: Observer, Factory, Strategy, Middleware.
* **TypeScript nâng cao**: advanced generics, conditional types, mapped types.
* **DSA basic → medium**: array, string, recursion, hashmap, sorting, tree traversal.
* Mini-lab: áp dụng **Observer pattern** cho notification system nhỏ (code bằng TS).

### (Optional Week 5 nếu kéo dài)

* Testing cơ bản: Jest + React Testing Library.
* CI/CD mini: GitHub Actions (lint + test).
* Mini-lab: viết test cho hooks + components với typing.

---

## 🛠 Mini-Project Giai Đoạn Phụ

* **Blog / Notes App (mini CMS)**

  * Auth (login giả).
  * CRUD Post (title, content).
  * State mgmt: Redux Toolkit + Saga.
  * Data fetching: TanStack Query.
  * UI state: Zustand (modal add/edit).
  * **Codebase toàn bộ bằng TypeScript**.
  * Testing: vài case unit test + component test.
  * CI: GitHub Actions check lint + test.

👉 Mục đích: gom hết kiến thức vào 1 project nhỏ, scale vừa, dễ review.

---

## ✅ Deliverables cuối giai đoạn phụ

* 1 mini-project public (deploy Vercel) **code bằng TypeScript chuẩn chỉnh**.
* Note/blog tiếng Anh:

  * “Saga vs Thunk: When to Choose?”
  * “TanStack Query vs RTK Query”
  * “Migrating a React App to TypeScript”.
* Checklist kỹ năng:

  * JS + TS
  * State management (Thunk, Saga, Query, Zustand)
  * Patterns + DSA basic/medium
  * Testing + CI cơ bản
* Ready để bước sang **Giai đoạn Chính** (2 dự án lớn).

</details>

---

<details>
<summary># 🚀 Overview Giai Đoạn Chính (Main / 4–5 tháng)</summary>

## 🎯 Mục tiêu

* Xây dựng **2 dự án lớn** với tính năng sát thực tế, toàn bộ dùng **TypeScript**.
* Rèn luyện **state management nâng cao** (Redux Toolkit + Saga, TanStack Query, Zustand khi phù hợp).
* Áp dụng **design patterns + DSA** vào feature thực tế (không chỉ học chay).
* Lồng ghép **Testing, Performance, Accessibility, CI/CD** ngay trong quá trình build.
* Xuất bản portfolio chuyên nghiệp: repo GitHub, demo deploy, docs, blog notes.
* Nâng cao **kỹ năng mềm & tiếng Anh**: viết docs, commit, review code, mock interview.

---

## 🏗 Dự án thực hiện

### 1. **Ecommerce Sofa + CMS** (Web + Admin Panel)

* **Frontend**: Next.js (App Router, SSR/ISR), React 18, TypeScript, Tailwind.
* **State Management**: Redux Toolkit + Saga cho business logic, TanStack Query cho server state.
* **CMS Admin**: CRUD sản phẩm, upload hình, quản lý đơn hàng, dashboard (chart).
* **Client Web**: Trang sản phẩm, giỏ hàng, checkout, user profile.
* **Tính năng nâng cao**: search filter, realtime (WebSocket) cập nhật tồn kho.
* **Testing**: Jest + React Testing Library, Cypress/Playwright cho e2e.
* **Patterns áp dụng**: Factory (UI components), Observer (real-time stock), Strategy (payment).

---

### 2. **Rental Management PWA** (Mobile-first, Offline-first)

* **Frontend**: Next.js PWA (service worker, offline cache), React 18, TypeScript.
* **State Management**: Redux Toolkit + Saga (workflow phức tạp như role-based, payment), TanStack Query cho dữ liệu server.
* **Chức năng chính**:

  * Chủ app = Super Admin.
  * Chủ trọ (landlord) = user cấp cao, có thể tạo **role tùy chỉnh** bằng check-box quyền (CRUD từng module).
  * Nhân viên = role được phân bổ.
  * Sale = có referral code, nhận hoa hồng khi landlord đăng ký/nâng cấp gói.
* **Realtime**: WebSocket để sync dữ liệu thuê phòng (checkin/checkout).
* **Membership**: gói cơ bản/nâng cấp, tính tiền, tích hợp payment.
* **Testing**: unit, integration, e2e flows (đăng nhập, phân quyền, referral).
* **Patterns áp dụng**: Observer (role events), Strategy (payment), Singleton (config service), Middleware (authorization).

---

## 📚 Nội dung học song song khi làm dự án

### 🔹 State Management

* **Redux Toolkit nâng cao**: middleware custom, entity adapter, normalization.
* **Redux Saga nâng cao**: orchestration, parallel, cancelation, retry policies.
* **TanStack Query**: infinite query, optimistic update, cache invalidation.
* **Zustand**: chỉ dùng cho UI/local state (modal, step wizard).

### 🔹 Design Patterns & DSA

* Patterns được áp dụng trực tiếp vào feature (không học chay).
* DSA medium (tree, graph, search, dynamic programming) luyện tập song song → ứng dụng search/filter, scheduling trong dự án.

### 🔹 Testing & Engineering

* Unit test, integration test, e2e test pipelines.
* Performance: bundle analyzer, lazy loading, caching, code splitting.
* Accessibility: kiểm tra Lighthouse + axe-core.
* CI/CD: GitHub Actions chạy lint, test, deploy → Vercel/Railway.

### 🔹 Communication

* Mỗi tuần viết **1 technical note/blog** bằng tiếng Anh (Saga case study, Next.js ISR, PWA caching).
* Thực hành mock interview với các câu hỏi về **trade-off (Saga vs Thunk vs Query, SSR vs CSR)**.
* Review code bằng AI + tự viết **code review comment chuẩn industry**.

---

## ✅ Deliverables cuối giai đoạn chính

* **2 repo public**: Ecommerce + Rental PWA, codebase chuẩn TypeScript, có test coverage, CI/CD.
* **2 demo deploy online** (Vercel + Railway backend).
* **Docs kiến trúc + trade-off** bằng tiếng Anh.
* **Blog portfolio** (Medium/Dev.to/GitHub Pages) chia sẻ kinh nghiệm.
* **Chuẩn bị phỏng vấn senior**:

  * Kể story 2 dự án như sản phẩm thực tế.
  * Trả lời trade-off design decision.
  * Tự tin coding test + system design cơ bản.

</details>

---

<details>
<summary># 🏁 Tổng Kết Chương Trình</summary>

1. **Kỹ năng kỹ thuật đạt được**

   * Thành thạo JavaScript nâng cao, React 18, Next.js, TypeScript (basic → advanced).
   * State management toàn diện: Redux Toolkit, Thunk, Saga, TanStack Query, Zustand.
   * Design Patterns (Observer, Factory, Strategy, Singleton, Middleware) và DSA (array, string, recursion, tree, hash map, medium-level algorithms) được áp dụng trực tiếp vào feature.
   * Testing unit/integration/e2e, Performance optimization, Accessibility checks, CI/CD pipelines.

2. **Portfolio & dự án thực tế**

   * 2 repo public với code chuẩn TypeScript, test coverage, CI/CD.
   * Demo deploy trực tuyến (Vercel, Railway).
   * Technical note/blog bằng tiếng Anh giải thích trade-offs và kiến trúc.

3. **Kỹ năng mềm & tiếng Anh**

   * Viết docs, commit, blog chuẩn industry.
   * Nghe – nói – đọc – viết trôi chảy trong môi trường IT.
   * Mock interview và code review chuyên nghiệp, bao gồm sử dụng AI hỗ trợ.

4. **Deliverables cuối chương trình**

   * 2 dự án lớn hoàn chỉnh: Ecommerce Sofa + CMS, Rental Management PWA.
   * Technical documentation & trade-offs notes.
   * Portfolio cá nhân, blog chia sẻ kinh nghiệm.
   * Checklist kỹ năng đầy đủ để chuẩn bị phỏng vấn senior.

---

**Kết luận:**
Chương trình “Fullstack Frontend Mastery” gom trọn **Foundation → Main Project → Deliverables**, giúp bạn **hồi phục kiến thức**, **áp dụng vào dự án thực tế**, và **tạo portfolio mạnh mẽ**, đảm bảo sẵn sàng làm việc ở vị trí Frontend Senior và tự tin trong môi trường chuyên nghiệp quốc tế.

</details>