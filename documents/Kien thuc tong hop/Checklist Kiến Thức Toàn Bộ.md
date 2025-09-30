# ✅ Checklist Kiến Thức Hoàn Hảo – “Fullstack Frontend Mastery”

Checklist này giúp bạn theo dõi tiến độ học và ôn tập các kỹ năng cần thiết để trở thành Senior Frontend Engineer. Mỗi mục được liên kết với ứng dụng thực tế trong các dự án (Foundation Mini Project, Ecommerce Sofa + CMS, Rental Management PWA). Đánh dấu ☑ khi hoàn thành học, thực hành, hoặc áp dụng vào dự án.

---

<details>
<summary>## 1️⃣ JavaScript & TypeScript</summary>

### JavaScript (ES6+)
- [ ] Hiểu closure, scope (block/function/global), hoisting
- [ ] Nắm prototype, inheritance, `this` context (call/apply/bind)
- [ ] Thành thạo async/await, Promises, event loop, call stack
- [ ] Sử dụng modules (import/export), dynamic import
- [ ] Thành thạo array methods: map, filter, reduce, find, sort
- [ ] Áp dụng destructuring, spread/rest operators, template literals
- [ ] Sử dụng optional chaining, nullish coalescing
- [ ] Xử lý lỗi với try/catch, custom errors
- [ ] Best practices: strict mode, tránh global variables, tối ưu performance (ít deep nesting)

### TypeScript
- [ ] Basic types: string, number, boolean, null, undefined, any, void
- [ ] Interface vs Type alias: khi nào dùng cái nào
- [ ] Enum, tuple, literal types, union/intersection types
- [ ] Generics, generic constraints (extends)
- [ ] Utility types: Partial, Required, Pick, Omit, Record
- [ ] Advanced: Conditional types, mapped types, keyof, type inference/guards
- [ ] Type-safe React: props, state, hooks, context
- [ ] Best practices: tránh 'any', bật strict mode, xử lý null/undefined, tổ chức modules
- [ ] Migrate code JS sang TS (dự án thực tế)

</details>

---

<details>
<summary>## 2️⃣ HTML, CSS & UI</summary>

- [ ] Sử dụng semantic HTML5: header, nav, section, article, form
- [ ] CSS Flexbox: flex-direction, justify-content, align-items, flex-wrap, flex-grow/shrink
- [ ] CSS Grid: grid-template-columns/rows, grid-gap, minmax, fr units
- [ ] Responsive design: media queries, mobile-first
- [ ] TailwindCSS: utility classes (bg-, text-, p-, m-), responsive prefixes (sm:, md:), hover/focus
- [ ] Cấu hình Tailwind: tailwind.config.js, JIT mode, dark mode
- [ ] UI libraries: shadcn/ui (button, modal, form components)
- [ ] Animations: Framer Motion (motion.div, variants, gestures, AnimatePresence)
- [ ] Form layout & validation: React Hook Form + Yup/Zod
- [ ] Best practices: semantic HTML cho accessibility, color contrast (WCAG 4.5:1), purge Tailwind classes

</details>

---

<details>
<summary>## 3️⃣ React & Ecosystem</summary>

### React 18
- [ ] Functional components, JSX, props/state
- [ ] Hooks: useState, useEffect, useRef, useContext, useReducer
- [ ] Performance hooks: useMemo, useCallback, React.memo
- [ ] Concurrent rendering: useTransition, useDeferredValue
- [ ] Suspense: data fetching, lazy components
- [ ] Best practices: tránh re-renders thừa, dùng keys trong lists, quản lý side effects

### Next.js (App Router, SSR, ISR, SSG, PWA)
- [ ] App Router: file-based routing, dynamic routes ([slug]), parallel routes
- [ ] Rendering: SSR (async components), SSG (getStaticProps), ISR (revalidate)
- [ ] PWA: manifest.json, service workers (Workbox), offline caching
- [ ] API routes, middleware, next/image (image optimization)
- [ ] Environment variables, error handling (error.js)
- [ ] Best practices: prefetch data, Suspense cho loading, SEO optimization

### React Hook Form
- [ ] Core APIs: useForm (register, handleSubmit, formState), watch, setValue
- [ ] Validation: Yup/Zod resolver, custom validation
- [ ] Advanced: Controller (custom inputs), useFieldArray (dynamic forms)
- [ ] Best practices: tránh uncontrolled inputs, xử lý errors, tối ưu large forms

### Framer Motion
- [ ] Motion components: animate, transition (duration, ease)
- [ ] Variants: orchestration, staggered animations
- [ ] Gestures: whileHover, whileTap, drag
- [ ] Advanced: keyframes, exit animations, layout animations
- [ ] Best practices: dùng initial=false, tránh over-animating

</details>

---

<details>
<summary>## 4️⃣ State Management</summary>

### Redux Toolkit (RTK)
- [ ] CreateSlice: reducers, extraReducers, actions
- [ ] ConfigureStore, dispatch, selectors
- [ ] RTK Query: createApi, endpoints (query/mutation), useQuery/useMutation
- [ ] Entity adapters, state normalization
- [ ] Custom middleware (logging, async handling)
- [ ] Best practices: tránh deep nesting, tối ưu performance

### Redux Thunk
- [ ] Async action creators (return function), dispatch/getState
- [ ] Xử lý API calls, loading/errors
- [ ] Tích hợp với RTK (extraReducers)
- [ ] Best practices: giữ thunks đơn giản, dùng Saga cho flows phức tạp

### Redux Saga
- [ ] Effects: take, put, call, fork, all, race, delay, takeLatest/takeEvery
- [ ] Watcher/worker pattern, orchestration
- [ ] Retry, cancellation, parallel tasks
- [ ] Event channels cho real-time
- [ ] Best practices: test sagas, tránh blocking effects

### TanStack Query (React Query)
- [ ] Core: useQuery, useMutation, queryClient (invalidateQueries, setQueryData)
- [ ] Infinite queries, optimistic updates, prefetch
- [ ] Caching: staleTime, cacheTime, retry
- [ ] Best practices: unique query keys, xử lý errors/loading, tích hợp forms/auth

### Zustand
- [ ] Create store, set/get state, subscribe
- [ ] Middleware: persist, devtools
- [ ] Selectors, actions trong store
- [ ] Best practices: dùng cho UI/local state (modal, drawer), tránh overkill

### Context API
- [ ] CreateContext, Provider/Consumer, useContext
- [ ] Compound components, performance với memoization
- [ ] Best practices: tách contexts, dùng với useReducer, tránh deep nesting

### Trade-offs
- [ ] So sánh Saga vs Thunk vs TanStack Query: khi nào dùng cái nào
- [ ] RTK Query vs TanStack Query: caching, flexibility
- [ ] Zustand vs Context: lightweight vs app-wide state

</details>

---

<details>
<summary>## 5️⃣ Backend & API / Database</summary>

### REST API
- [ ] HTTP methods: GET, POST, PUT, DELETE
- [ ] Stateless, resource-based URIs, status codes
- [ ] Pagination, auth headers (Bearer), versioning
- [ ] Best practices: HATEOAS, HTTPS, error handling

### GraphQL (optional)
- [ ] Schema: types, queries, mutations, subscriptions
- [ ] Resolvers, fragments, variables
- [ ] Cursor-based pagination, Apollo client
- [ ] Best practices: tránh over-fetching, xử lý errors

### WebSocket
- [ ] Protocol: ws/wss, handshake, frames
- [ ] WebSocket API: open, message, close, error
- [ ] Socket.io: reconnection, rooms
- [ ] Best practices: secure WSS, fallback polling

### Authentication (JWT, Session)
- [ ] JWT: header, payload, signature, refresh tokens
- [ ] Sessions: server-side storage, cookies, session IDs
- [ ] Role-based auth: admin, staff, landlord, tenant
- [ ] Best practices: HTTPS, HTTP-only cookies, CSRF/XSS protection

### Payment Gateway (Stripe/Momo/VNPay)
- [ ] API integration: charges, customers, webhooks
- [ ] Stripe: Checkout sessions, PaymentIntents, subscriptions
- [ ] Momo/VNPay: sandbox, QR codes, redirects
- [ ] Best practices: PCI compliance, retry logic, secure keys

### Database (PostgreSQL/MySQL)
- [ ] SQL: SELECT, INSERT, UPDATE, DELETE
- [ ] Joins: INNER, LEFT, RIGHT, FULL
- [ ] Aggregates: GROUP BY, HAVING
- [ ] Transactions, indexes, EXPLAIN for optimization
- [ ] Best practices: normalize data, tránh N+1 queries

### Prisma ORM
- [ ] Schema: models, relations, enums, indexes
- [ ] Queries: findMany, findUnique, create/update/delete
- [ ] Include/select cho relations, migrations
- [ ] Advanced: raw queries, transactions, middleware
- [ ] Best practices: type-safe queries, optimize $queryRaw

### Headless CMS (Sanity/Strapi)
- [ ] Sanity: schemas, GROQ queries, real-time
- [ ] Strapi: content types, roles/permissions, plugins
- [ ] REST/GraphQL APIs, internationalization
- [ ] Best practices: secure APIs, caching

</details>

---

<details>
<summary>## 6️⃣ Design Patterns & Architecture</summary>

### Design Patterns
- [ ] Factory: tạo objects (e.g., UI components, tasks, roles)
- [ ] Singleton: global config, logging service
- [ ] Observer: real-time notifications, undo/redo
- [ ] Strategy: dynamic algorithms (payment, sorting)
- [ ] Middleware: authorization checks
- [ ] Best practices: áp dụng đúng context, tránh over-engineering

### Clean Architecture / Separation of Concerns
- [ ] Layers: Entities, Use Cases, Adapters, Frameworks
- [ ] Dependency inversion, testable units
- [ ] Tách UI/logic/data (folders: domain/application/presentation)
- [ ] Mock dependencies, giữ core logic pure

</details>

---

<details>
<summary>## 7️⃣ Data Structures & Algorithms (DSA)</summary>

### Basic → Medium
- [ ] Array: push/pop, map, filter, reduce, sort
- [ ] String: split/join, regex, manipulation
- [ ] Hash Map: object lookup, key-value pairs
- [ ] Sorting: bubble, quick, merge sort (Big O analysis)
- [ ] Searching: linear, binary
- [ ] Recursion: base case, backtracking
- [ ] Tree: DFS, BFS, binary tree traversal
- [ ] Graph: adjacency lists, BFS, DFS, shortest path
- [ ] Dynamic Programming: memoization, DP tables (Fibonacci, knapsack)

### Application in Projects
- [ ] Filter/search: products, rooms, tenants
- [ ] Sorting: lists (price, priority, deadline)
- [ ] Undo/redo: Observer + recursion
- [ ] Tree: category hierarchies, tenant/room structures

</details>

---

<details>
<summary>## 8️⃣ Testing & Quality</summary>

### Jest
- [ ] Describe/it, expect matchers (toBe, toEqual)
- [ ] Setup/teardown: beforeEach/afterEach
- [ ] Mocks (jest.fn), spies, async tests, snapshots
- [ ] Đạt test coverage >80%

### React Testing Library
- [ ] Queries: getByRole/Text/Label, queryBy, findBy
- [ ] Interactions: userEvent (click, type)
- [ ] Test behavior, tránh data-testid
- [ ] Sử dụng act cho updates

### Cypress / Playwright
- [ ] Cypress: cy.visit/get/click, stubs/intercepts
- [ ] Playwright: page.goto/locator/click, traces
- [ ] Chạy headless, parallel tests
- [ ] Mock APIs với MSW, tích hợp CI

### MSW (Mock Service Worker)
- [ ] Handlers: rest.get/post, GraphQL mocks
- [ ] Setup worker/server, use() overrides
- [ ] Response patching, bypass unhandled requests
- [ ] Reset handlers sau tests

### ESLint + Prettier
- [ ] ESLint: rules (react, typescript), plugins
- [ ] Prettier: singleQuote, trailingComma
- [ ] Tích hợp eslint-config-prettier, husky pre-commit
- [ ] Auto-fix trong VSCode

</details>

---

<details>
<summary>## 9️⃣ Performance & Optimization</summary>

- [ ] Memoization: React.memo, useMemo, useCallback
- [ ] Lazy loading: React.lazy, dynamic import
- [ ] Image optimization: next/image, WebP, loading=lazy
- [ ] Bundle analysis: webpack-bundle-analyzer
- [ ] Caching: TanStack Query, service worker
- [ ] Virtualize lists: react-window
- [ ] Profile với React DevTools, Lighthouse (score >90)

</details>

---

<details>
<summary>## 🔟 Accessibility (A11y)</summary>

- [ ] ARIA: role=button/alert, aria-label/live, aria-expanded
- [ ] Keyboard navigation: tabindex, Enter/Space events, skip links
- [ ] Color contrast: WCAG (4.5:1 text, 3:1 large)
- [ ] Semantic HTML, alt text cho images
- [ ] Test với screen readers: NVDA/VoiceOver
- [ ] Kiểm tra với Lighthouse, axe-core (0 errors)

</details>

---

<details>
<summary>## 1️⃣1️⃣ DevOps & Deployment</summary>

### Git/GitHub
- [ ] Commit/push/pull, branching, merge/rebase
- [ ] Cherry-pick, hooks, PR reviews
- [ ] Conventional commits, .gitignore, branch naming

### GitHub Actions
- [ ] Workflows: jobs/steps, triggers (push/pull_request)
- [ ] CI/CD: lint, test, build, deploy
- [ ] Matrix testing, cache dependencies, secure secrets

### Vercel
- [ ] Auto deploys, branch previews
- [ ] Custom domains, env vars, serverless functions
- [ ] Tích hợp GitHub, hỗ trợ monorepos

### Railway/Render
- [ ] Deploy services, databases, logs/monitors
- [ ] Auto-scaling, cron jobs
- [ ] Quản lý env, secure keys

### Docker (optional)
- [ ] Dockerfile: FROM, RUN, CMD
- [ ] Images/containers, docker-compose
- [ ] Volumes/networks, multi-stage builds, .dockerignore

### Env Management (.env)
- [ ] Sử dụng .env, dotenv
- [ ] Tách .env.local/prod, secrets trong CI
- [ ] Không commit .env, tạo .env.example

</details>

---

<details>
<summary>## 1️⃣2️⃣ Tools & Productivity</summary>

### VSCode + Extensions
- [ ] ESLint: auto-fix on save
- [ ] Prettier: format on save/paste
- [ ] GitLens: inline blame, history, compare
- [ ] Settings.json: multi-cursor, debug tools

### Postman/Insomnia
- [ ] Collections, environments, tests/scripts
- [ ] Mock servers, chia sẻ collections
- [ ] Tích hợp API docs

### Figma
- [ ] Frames/pages, auto-layout, components/variants
- [ ] Prototypes, plugins, design systems
- [ ] Collaborate real-time

### Notion/Obsidian
- [ ] Notion: databases, templates, GitHub integration
- [ ] Obsidian: Markdown, graph view, plugins (dataview)
- [ ] Liên kết notes, lưu code snippets, sync devices

</details>

---

<details>
<summary>## 1️⃣3️⃣ Soft Skills & Technical English</summary>

- [ ] Vocabulary: debug, deploy, refactor, API, UI/UX
- [ ] Viết docs, commit messages, PR reviews
- [ ] Technical notes/blogs (Medium/Dev.to/GitHub Pages)
- [ ] Mock interview: DSA, system design, trade-offs
- [ ] Code review: AI + manual, chuẩn industry
- [ ] Trình bày: slides (Figma/Slides), Q&A, technical decisions
- [ ] Luyện tiếng Anh: đọc docs, nghe podcasts, viết blog

</details>

---

<details>
<summary>## 1️⃣4️⃣ Project-Based Learning / Deliverables</summary>

### Mini Project (Foundation: Task Manager / Blog CMS)
- [ ] CRUD tasks/posts, filter/sort, undo/redo
- [ ] Auth giả (login/logout), form validation (React Hook Form + Yup)
- [ ] State management: Redux Toolkit + Saga, TanStack Query, Zustand
- [ ] Design patterns: Observer (undo/redo), Factory (tasks), Strategy (sort)
- [ ] DSA: sorting (quick/merge), search (linear/hash map)
- [ ] Testing: Jest (unit), RTL (components), MSW (mock API)
- [ ] Deploy: Vercel, GitHub Actions (lint/test)
- [ ] Blog note: “Saga vs Thunk”, “TanStack Query vs RTK Query”, “TS Migration”

### Project 1 (Ecommerce Sofa + CMS)
- [ ] Customer site: product listing, cart, checkout, order tracking
- [ ] CMS admin: CRUD products, manage orders, dashboard (charts)
- [ ] Auth: JWT/NextAuth, role-based (admin/staff)
- [ ] State: RTK + Saga (business logic), TanStack Query (server state), Zustand (UI)
- [ ] Patterns: Factory (components), Observer (order status), Strategy (payment)
- [ ] DSA: sorting/filtering products, search
- [ ] Testing: Jest + RTL (unit/components), Cypress/Playwright (e2e)
- [ ] Performance: next/image, lazy loading, memoization
- [ ] Deploy: 2 repos (web + CMS), Vercel + Railway
- [ ] Docs: architecture, trade-offs (SSR vs CSR, RTK vs Query)
- [ ] Slide: trình bày phỏng vấn

### Project 2 (Rental Management PWA)
- [ ] Multi-role: admin, landlord, staff, saler, tenant (optional)
- [ ] Features: house/room CRUD, tenant management, role/permission, saler referral
- [ ] Real-time: WebSocket (room status, notifications)
- [ ] Offline-first: PWA, service worker, caching
- [ ] Payment: membership plans (Momo/VNPay sandbox)
- [ ] State: RTK + Saga (role, payment), TanStack Query (data), Zustand (UI)
- [ ] Patterns: Observer (real-time), Strategy (payment), Factory (roles), Middleware (auth)
- [ ] DSA: sorting/filtering rooms/tenants, tree (hierarchies)
- [ ] Testing: Jest + RTL, Cypress (role-based flows), MSW
- [ ] Performance: code splitting (roles), memoization, caching
- [ ] Deploy: Vercel + Railway, GitHub Actions
- [ ] Docs: role/permission design, saler referral flow
- [ ] Blog: “Dynamic Role System with Saga”, “PWA Offline-First”
- [ ] Slide: real-time, role-based, offline architecture

</details>

---

## 💡 Hướng Dẫn Sử Dụng Checklist

1. **Theo dõi tiến độ**: Đánh dấu ☑ khi hoàn thành học lý thuyết, thực hành code, hoặc áp dụng vào dự án.
2. **Ưu tiên thực hành**: Mỗi kiến thức nên được áp dụng vào ít nhất một dự án (Mini Project, Ecommerce, Rental PWA) để hiểu sâu.
3. **Tài liệu tham khảo**:
   - **Official Docs**: React, Next.js, TypeScript Handbook, Redux Toolkit, TanStack Query
   - **DSA**: LeetCode, NeetCode, “Grokking Algorithms”
   - **Blogs/Tutorials**: Medium, Dev.to, freeCodeCamp
   - **Tools**: Lighthouse, axe-core (A11y), webpack-bundle-analyzer
4. **Kiểm tra định kỳ**: Cuối mỗi tuần, review checklist để đảm bảo không bỏ sót. Ghi note các trade-offs (e.g., Saga vs Thunk, SSR vs CSR).
5. **Mock Interview**: Chuẩn bị câu trả lời cho:
   - Trade-offs (state management, rendering modes)
   - Kiến trúc dự án (Ecommerce, Rental PWA)
   - DSA coding (array, string, tree, graph)
6. **Portfolio**: Đảm bảo hoàn thành deliverables:
   - 3 repos public: Foundation, Ecommerce (web + CMS), Rental PWA
   - Demo online: Vercel + Railway
   - Blog/notes tiếng Anh: Medium/Dev.to
   - Slide trình bày dự án cho phỏng vấn

---

## 📝 Ghi Chú Thêm

- **Trade-offs**: Ghi lại lý do chọn công nghệ (e.g., TanStack Query cho server state, Saga cho orchestration) để trả lời phỏng vấn.
- **Code Review**: Sử dụng AI (như GitHub Copilot) và tự review code để đạt chuẩn industry (clean code, comments, structure).
- **Tiếng Anh**: Viết ít nhất 1 blog/tuần (e.g., “How I Built a PWA with Next.js”, “Optimizing React Performance”).
- **Lịch trình**: Ưu tiên Foundation Mini Project (15-30 ngày) trước, sau đó chia đều thời gian cho 2 dự án lớn (2-2.5 tháng/dự án).

---