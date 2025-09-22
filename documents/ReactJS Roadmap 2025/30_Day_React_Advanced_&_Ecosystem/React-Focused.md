Kết hợp README hiện tại với roadmap trước đó, tập trung vào các mảng **React nâng cao, Performance, Hooks nâng cao, Concurrent features, Testing, PWA, Error handling, Accessibility, CI/CD cơ bản liên quan đến frontend**. Đây là phiên bản tinh gọn và chuyên về React:

---

# 📘 Advanced React Mastery 2025 (React-focused)

![React](https://img.shields.io/badge/React-18.2.0-61dafb?logo=react)
![Testing](https://img.shields.io/badge/Testing-Jest%20%7C%20RTL%20%7C%20Cypress-green?logo=testing-library)
![PWA](https://img.shields.io/badge/PWA-ServiceWorkers-blue)

---

## 🚀 Introduction / Giới thiệu

Khóa học này giúp bạn:

* Master **React 18 modern features**: Concurrent Rendering, Suspense, Lazy Loading, useTransition, useDeferredValue, useId.
* Nâng cao **custom hooks, reusable logic, performance optimization**.
* Hiểu **memoization, re-render control, virtualization**.
* Triển khai **testing, error boundaries, accessibility, PWA**.
* Áp dụng **CI/CD frontend**, deploy production-ready React apps.

---

## 🎯 Goals / Mục tiêu

* ✅ Nắm vững React 18 features & rendering strategies.
* ✅ Tối ưu performance, tránh re-render thừa.
* ✅ Xây dựng reusable hooks & component patterns.
* ✅ Viết frontend production-ready, có test coverage.
* ✅ Hiểu các patterns cho PWA & offline-first support.
* ✅ Đảm bảo accessibility & error handling enterprise-ready.

---

## 📅 Daily Roadmap (React core only)

| Day | Topic                   | EN / VN                                                                                                                                         | Key Concepts / Kiến thức cần học                                                                   |
| --- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 00  | Setup & Modern JS       | Node 18+, Vite/CRA, ES2023 modules. / Cài Node 18+, Vite/CRA, ES2023 modules.                                                                   | Node 18+, NPM/Yarn, ES2023, import/export, JS Modules                                              |
| 01  | React 18 Overview       | Concurrent rendering, Suspense, Lazy, useTransition, useDeferredValue, useId. / Concurrent rendering, Suspense, Lazy, useTransition…            | React 18 features, concurrent mode, Suspense, lazy loading, useTransition, useDeferredValue, useId |
| 02  | Advanced Custom Hooks   | usePrevious, useEventListener, useOnScreen, useFetch. / Tạo custom hooks tái sử dụng.                                                           | Custom hooks, reusable logic, state abstraction, encapsulate side effects                          |
| 03  | Context + useReducer    | Optimize context, provider pattern, avoid unnecessary re-renders. / Context nâng cao + useReducer.                                              | Context API, useReducer, provider pattern, memoization, state propagation                          |
| 04  | Component Optimization  | React.memo, useMemo, useCallback, lazy loading. / React.memo, useMemo, useCallback, lazy loading.                                               | Memoization, prevent re-renders, lazy-loaded components, callback optimization                     |
| 05  | Performance Profiling   | React DevTools Profiler, Web Vitals, detect bottlenecks. / React DevTools Profiler, Web Vitals, phát hiện bottleneck.                           | Profiling, measuring FPS, analyzing render time, Web Vitals                                        |
| 06  | Virtualization          | react-window/react-virtualized, optimize long lists. / react-window/react-virtualized, tối ưu danh sách dài.                                    | Windowing, virtualization, large list optimization, memory/performance                             |
| 07  | Suspense & Lazy Loading | Component-level lazy loading, code-splitting. / Suspense, lazy loading, dynamic imports.                                                        | React.lazy, Suspense fallback, dynamic import(), route-based code splitting                        |
| 08  | Concurrent Patterns     | useTransition, startTransition, useDeferredValue, batching updates. / Patterns tránh lag UI.                                                    | Concurrent updates, non-blocking rendering, transition patterns, deferred values                   |
| 09  | Error Boundaries        | Catch errors, fallback UI, logging. / Error boundaries, fallback UI, logging.                                                                   | componentDidCatch, static getDerivedStateFromError, custom error boundary component                |
| 10  | Accessibility           | WCAG, ARIA roles, keyboard navigation, screen reader testing. / WCAG, ARIA, điều hướng keyboard, test screen reader.                            | Accessible components, ARIA roles, semantic HTML, keyboard navigation                              |
| 11  | Unit Testing            | Jest: utils, reducers, pure functions, snapshots. / Jest: utils, reducers, pure functions, snapshots.                                           | Unit tests, snapshot tests, mock functions, test coverage                                          |
| 12  | Component Testing       | RTL: render, fireEvent, queries, assertions. / RTL: render, fireEvent, queries, assertions.                                                     | DOM testing, user interaction, component behavior verification                                     |
| 13  | E2E Testing             | Cypress/Playwright, simulate flows, CI integration. / Cypress/Playwright, simulate user flows, tích hợp CI.                                     | End-to-end testing, real user flows, CI/CD integration                                             |
| 14  | Storybook               | Component library, live playground, documentation. / Storybook: thư viện component, playground, documentation.                                  | Component documentation, live preview, reusable library                                            |
| 15  | PWA & Service Workers   | Offline support, caching, push notifications. / Offline-first, caching, Service Workers, push notifications.                                    | Service Workers, cache strategies, offline-first, push notifications                               |
| 16  | CI/CD for Frontend      | Deploy React app, automated build/test, GitHub Actions, Vercel/Docker. / Deploy React app, CI/CD cơ bản.                                        | Automated build/test/deploy, pipeline setup, monitor deployment                                    |
| 17  | Capstone Mini Project   | Build React 18 production-ready app with Hooks, Suspense, Performance & PWA. / Tạo app React 18 production-ready tích hợp Hooks, Suspense, PWA. | Production-ready structure, Hooks, Suspense, lazy-loading, virtualized lists, PWA, offline support |
| 18  | Review & Polish         | Refactor code, clean structure, document components, portfolio-ready. / Tối ưu code, clean structure, document component, portfolio-ready.      | Refactoring, optimization, documentation, GitHub portfolio showcase                                |

---

## 🎯 Recommended Workflow / Quy trình học

1. Theo **daily roadmap** & hoàn thành mini-project mỗi 3–4 ngày.
2. Luôn viết **clean, maintainable code**, đặt tên rõ ràng, tách logic hợp lý.
3. Sử dụng **version control & GitHub**, commit rõ ràng.
4. Viết **unit & component tests**, tích hợp **E2E** với Cypress/Playwright.
5. Triển khai mini-projects với **Vercel/Docker**, tích hợp **PWA offline-first**.
6. Ghi chú, document mọi component & logic → chuẩn bị portfolio.

---

## 🏆 Capstone Suggestions

* React 18 app production-ready, không cần backend fullstack.
* Features: Concurrent Rendering, Suspense, Lazy Loading, Custom Hooks, Virtualized Lists, PWA, Testing.
* Deploy lên Vercel/Docker, offline support, CI/CD frontend-ready.

---
**Bảng checklist Level 1 → 3 exercises** cho từng ngày **Advanced React core (18 ngày roadmap)**, tập trung vào **Hooks nâng cao, Concurrent features, Performance, Testing, PWA, Accessibility, Error handling**, mà không chồng lên Redux/Next/UI/Form.

Mỗi ngày sẽ có 3 cấp độ:

* **Level 1** – Concept & mini demo.
* **Level 2** – Áp dụng logic + small feature.
* **Level 3** – Production-ready, tối ưu & test đầy đủ.

Dưới đây là bản chi tiết:

---

# 📋 Advanced React Core – Exercises Level 1 → 3

## **Day 01 – React 18 Overview**

| Level | Exercise                                                                                  |
| ----- | ----------------------------------------------------------------------------------------- |
| 1     | Tạo 1 component demo `Counter` với `useState` và console.log state để quan sát re-render. |
| 2     | Thêm `useTransition` khi increment counter > 1000 lần, hiển thị fallback UI khi lag.      |
| 3     | Tạo mini app: list > 1000 items + concurrent rendering + Suspense cho component nested.   |

---

## **Day 02 – Advanced Custom Hooks**

| Level | Exercise                                                                                         |
| ----- | ------------------------------------------------------------------------------------------------ |
| 1     | Tạo hook `usePrevious(value)` lưu giá trị trước đó của state.                                    |
| 2     | Tạo hook `useOnScreen(ref)` kiểm tra element đang hiển thị viewport, hiển thị text khi visible.  |
| 3     | Tích hợp `useFetch(url)` tái sử dụng fetch API, kèm loading + error state, lazy load list items. |

---

## **Day 03 – Context + useReducer**

| Level | Exercise                                                                          |
| ----- | --------------------------------------------------------------------------------- |
| 1     | Tạo Context đơn giản + provider, chia sẻ theme (light/dark) giữa 2 component.     |
| 2     | Sử dụng `useReducer` quản lý state todo list với Context provider.                |
| 3     | Tối ưu: memoize provider value, tránh re-render thừa, test update state bằng RTL. |

---

## **Day 04 – Component Optimization**

| Level | Exercise                                                                                    |
| ----- | ------------------------------------------------------------------------------------------- |
| 1     | Demo `React.memo` với functional component nhận props object.                               |
| 2     | Tối ưu callback với `useCallback` cho event handler + `useMemo` tính toán list filter.      |
| 3     | Mini project: danh sách lớn + filter + memoized components + lazy load + performance check. |

---

## **Day 05 – Performance Profiling**

| Level | Exercise                                                                                         |
| ----- | ------------------------------------------------------------------------------------------------ |
| 1     | Sử dụng React DevTools Profiler, đo render time của 1 component.                                 |
| 2     | Thêm button gây re-render nhiều lần, phân tích bottleneck, tối ưu với memo/useMemo/useCallback.  |
| 3     | Mini project: dashboard UI nhiều widget, profile toàn bộ component, tối ưu performance tổng thể. |

---

## **Day 06 – Virtualization**

| Level | Exercise                                                                           |
| ----- | ---------------------------------------------------------------------------------- |
| 1     | Render list 1000 item bình thường và quan sát lag.                                 |
| 2     | Áp dụng `react-window` để virtualize list.                                         |
| 3     | Mini project: danh sách 10k item + filter + virtualized + lazy load row component. |

---

## **Day 07 – Suspense & Lazy Loading**

| Level | Exercise                                                                                          |
| ----- | ------------------------------------------------------------------------------------------------- |
| 1     | Tạo component lazy load với `React.lazy` + `Suspense fallback`.                                   |
| 2     | Lazy load 2–3 component nested với fallback UI loading spinner.                                   |
| 3     | Tạo mini app: dynamic import nhiều module + nested suspense + concurrent render + error fallback. |

---

## **Day 08 – Concurrent Patterns**

| Level | Exercise                                                                                  |
| ----- | ----------------------------------------------------------------------------------------- |
| 1     | Demo `useTransition` với input filter list >1000 item.                                    |
| 2     | Kết hợp `useDeferredValue` hiển thị preview list khi typing + debounce.                   |
| 3     | Mini project: dashboard large data + concurrent patterns + fallback UI + performance log. |

---

## **Day 09 – Error Boundaries**

| Level | Exercise                                                                                          |
| ----- | ------------------------------------------------------------------------------------------------- |
| 1     | Tạo ErrorBoundary component + hiển thị fallback UI.                                               |
| 2     | Wrap 2–3 nested component, simulate error, logging console.                                       |
| 3     | Tích hợp Sentry (hoặc mock service) + fallback UI, report error, test bằng unit & component test. |

---

## **Day 10 – Accessibility**

| Level | Exercise                                                                               |
| ----- | -------------------------------------------------------------------------------------- |
| 1     | Thêm ARIA roles cho button, input, form.                                               |
| 2     | Keyboard navigation: focus, tab, enter, esc xử lý trong component.                     |
| 3     | Mini project: accessible modal + list + form + screen reader friendly + test bằng RTL. |

---

## **Day 11 – Unit Testing**

| Level | Exercise                                                                              |
| ----- | ------------------------------------------------------------------------------------- |
| 1     | Test function utils, pure component với Jest.                                         |
| 2     | Test reducer & simple component: snapshot + assertion.                                |
| 3     | Mini project: full component + hooks unit test coverage >80%, mocks API call nếu cần. |

---

## **Day 12 – Component Testing**

| Level | Exercise                                                                       |
| ----- | ------------------------------------------------------------------------------ |
| 1     | Render component + check text, DOM elements, events.                           |
| 2     | Test user interaction: click, input, select, keyboard event.                   |
| 3     | Mini project: test complex component tree + state changes + interaction flows. |

---

## **Day 13 – E2E Testing**

| Level | Exercise                                                                          |
| ----- | --------------------------------------------------------------------------------- |
| 1     | Write basic Cypress test: visit page + check elements.                            |
| 2     | Simulate user login & CRUD flows, assert DOM changes.                             |
| 3     | Full workflow test: login, navigation, update state, verify offline PWA scenario. |

---

## **Day 14 – Storybook**

| Level | Exercise                                                                      |
| ----- | ----------------------------------------------------------------------------- |
| 1     | Create story for simple button component.                                     |
| 2     | Add args, actions, different states (hover, active, disabled).                |
| 3     | Build mini component library, document 5+ components, integrate with project. |

---

## **Day 15 – PWA & Service Workers**

| Level | Exercise                                                                                    |
| ----- | ------------------------------------------------------------------------------------------- |
| 1     | Register service worker, cache assets offline.                                              |
| 2     | Add fetch interception, cache dynamic content, offline fallback.                            |
| 3     | Mini project: PWA app with offline-first, push notifications, cache strategies, deployable. |

---

## **Day 16 – CI/CD for Frontend**

| Level | Exercise                                                                                      |
| ----- | --------------------------------------------------------------------------------------------- |
| 1     | Setup GitHub Actions: run build + test on push.                                               |
| 2     | Deploy React app to Vercel/Docker automatically after CI pipeline.                            |
| 3     | Mini project: integrate CI/CD, test coverage report, auto deploy PWA app, logging deployment. |

---

## **Day 17 – Capstone Mini Project**

| Level | Exercise                                                                                                                |
| ----- | ----------------------------------------------------------------------------------------------------------------------- |
| 1     | Tạo app React production-ready với 1 feature list + hooks + lazy load.                                                  |
| 2     | Add performance optimization: memoization, virtualized list, concurrent rendering.                                      |
| 3     | Full production-ready: Suspense, PWA, ErrorBoundary, Accessibility, Unit + Component + E2E tests, deploy Vercel/Docker. |

---

## **Day 18 – Review & Polish**

| Level | Exercise                                                                                 |
| ----- | ---------------------------------------------------------------------------------------- |
| 1     | Refactor code: remove warnings, clean folder structure.                                  |
| 2     | Add documentation & comments cho các component & hooks.                                  |
| 3     | Final polish: portfolio-ready, performance check, offline + online test, CI/CD verified. |

---


