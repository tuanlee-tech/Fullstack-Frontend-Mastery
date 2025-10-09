# 🎯 PORTFOLIO MASTER PLAN - REVISED (Đa Dạng Tech Stack)

## 📊 Phân Tích Yêu Cầu Mới

### Mục tiêu:
- ✅ Master multiple frameworks (React, Vue, Svelte, Angular, React Native)
- ✅ Deep dive modern ecosystem (TanStack, React Hook Form, advanced patterns)
- ✅ Both Web & Mobile apps
- ✅ Hot technologies (2022-2025)
- ✅ Production-ready, not just "biết sơ sơ"

---

## 🏗️ 10 Projects - Tech Stack Distribution Strategy

### Nguyên tắc phân bổ:
1. **Mỗi framework ít nhất 1 project để master**
2. **Tăng dần độ phức tạp trong cùng 1 framework**
3. **Mix web & mobile (5 web, 3 mobile, 2 hybrid)**
4. **Mỗi project showcase 1-2 advanced patterns**

---

## 📱 REVISED PROJECT LIST

### **Project 01: Event Helper** ⭐⭐ (2.5/10)
**Platform**: Web  
**Tech Stack**:
```yaml
Frontend: Vue 3 + Composition API + TypeScript
State: Pinia (Vue's official state management)
UI: Vuetify 3 (Material Design)
Forms: VeeValidate + Yup
Backend: Node.js + Express + Prisma + PostgreSQL
Auth: Passport.js + JWT
Deploy: Netlify (frontend) + Railway (backend)
```

**Why Vue First?**
- Easier than React for beginners
- Composition API similar to React Hooks
- Strong TypeScript support
- Learn different reactivity model (ref, reactive)

**Focus Learning**:
- Vue 3 Composition API
- Pinia state management
- VeeValidate advanced form validation
- Vue Router (guards, lazy loading)

---

### **Project 02: Habit Tracker** ⭐⭐⭐ (3/10)
**Platform**: Mobile (iOS + Android)  
**Tech Stack**:
```yaml
Frontend: React Native + TypeScript + Expo
State: Zustand + React Query (TanStack Query)
UI: React Native Paper + Custom components
Navigation: React Navigation v6
Notifications: Expo Notifications + Background Tasks
Local Storage: AsyncStorage + SQLite (expo-sqlite)
Charts: Victory Native
Backend: Same API from Project 01 (reuse)
Deploy: Expo EAS Build
```

**Why React Native?**
- Master mobile development
- Cross-platform (1 codebase = 2 apps)
- Hot in job market
- Learn mobile-specific patterns (gestures, native modules)

**Focus Learning**:
- React Native fundamentals
- React Query (data fetching, caching, mutations)
- Zustand for lightweight state
- Mobile UX patterns (bottom sheets, gestures)
- Push notifications
- Background tasks

---

### **Project 03: Split Bill & Tracking** ⭐⭐⭐ (3.5/10)
**Platform**: Web  
**Tech Stack**:
```yaml
Frontend: Svelte + SvelteKit + TypeScript
State: Svelte Stores (built-in)
UI: Skeleton UI + TailwindCSS
Forms: Superforms (SvelteKit forms)
Backend: SvelteKit API Routes + Prisma + PostgreSQL
Real-time: Socket.io
Charts: Chart.js
Deploy: Vercel
```

**Why Svelte?**
- Fastest framework (no virtual DOM)
- Smallest bundle size
- Learn reactive programming (different from React/Vue)
- SvelteKit = Full-stack framework (like Next.js)

**Focus Learning**:
- Svelte reactivity ($: syntax)
- SvelteKit routing & SSR
- Superforms (form handling)
- Stores (writable, readable, derived)
- Socket.io real-time integration

---

### **Project 04: Money Tracker** ⭐⭐⭐⭐ (4/10)
**Platform**: Mobile (iOS + Android)  
**Tech Stack**:
```yaml
Frontend: Flutter + Dart
State: Riverpod (best Flutter state management)
UI: Material Design 3 + Custom widgets
Local DB: Drift (SQLite ORM for Flutter)
Charts: fl_chart
Backend: Supabase (BaaS - focus on mobile)
Deploy: App Store + Google Play
```

**Why Flutter?**
- Different language (Dart) - expand skillset
- Top mobile framework (Google-backed)
- Beautiful UI out-of-box
- Learn widget composition

**Focus Learning**:
- Dart language
- Flutter widget tree
- Riverpod state management
- Drift ORM (type-safe SQL)
- Platform-specific code (iOS vs Android)

---

### **Project 05: Smart Meal Planner** ⭐⭐⭐⭐ (5/10)
**Platform**: Web  
**Tech Stack**:
```yaml
Frontend: Next.js 14 + React + TypeScript
State: Redux Toolkit + RTK Query
UI: Shadcn/ui + TailwindCSS
Forms: React Hook Form + Zod
Backend: Next.js API Routes + tRPC
Database: PostgreSQL + Drizzle ORM
Search: Meilisearch (open-source Algolia)
Cache: Redis
Charts: Recharts
Deploy: Vercel
```

**Why Next.js + Redux?**
- Industry standard combo
- Redux Toolkit = modern Redux (no boilerplate)
- RTK Query = powerful data fetching
- tRPC = end-to-end type safety
- Drizzle ORM = TypeScript-first SQL

**Focus Learning**:
- Redux Toolkit (createSlice, extraReducers)
- RTK Query (caching, invalidation, optimistic updates)
- tRPC (type-safe APIs)
- Drizzle ORM (SQL builder)
- Meilisearch (full-text search)
- Server Components optimization

---

### **Project 06: Insurance/Finance Assistant** ⭐⭐⭐⭐ (5.5/10)
**Platform**: Web  
**Tech Stack**:
```yaml
Frontend: Angular 17 + TypeScript
State: NgRx (Redux for Angular)
UI: Angular Material + PrimeNG
Forms: Reactive Forms + Custom validators
Backend: NestJS + TypeScript + Prisma
Database: PostgreSQL
Queue: BullMQ
Deploy: Netlify + Railway
```

**Why Angular?**
- Enterprise standard
- Full-featured framework (batteries included)
- RxJS = reactive programming mastery
- NgRx = advanced state management pattern

**Focus Learning**:
- Angular modern features (signals, standalone components)
- NgRx (Effects, Selectors, Entity Adapter)
- RxJS operators (switchMap, mergeMap, combineLatest)
- Reactive Forms (advanced validation)
- NestJS (Angular-like backend)

---

### **Project 07: Local Business Booster** ⭐⭐⭐⭐⭐ (7/10)
**Platform**: Web (PWA) + Mobile  
**Tech Stack**:
```yaml
Frontend Web: Next.js 14 + React + TypeScript (PWA)
Frontend Mobile: React Native + Expo (staff app)
State: Redux Toolkit + Redux Saga (side effects)
UI Web: Shadcn/ui + TailwindCSS
UI Mobile: React Native Paper
Backend: NestJS + Microservices
Database: PostgreSQL + Redis
Real-time: Socket.io
Payment: Stripe + VNPay
Queue: RabbitMQ
Deploy: DigitalOcean + Docker
```

**Why Redux Saga Here?**
- Complex side effects (orders, payments, real-time)
- Better for concurrent operations than Thunk
- Generator functions = advanced JS
- Industry used in large apps

**Focus Learning**:
- Redux Saga (effects: call, put, takeEvery, takeLatest)
- PWA (service workers, offline mode, caching strategies)
- WebSocket management
- Multi-platform codebase sharing
- Microservices architecture
- Docker containerization
- Payment gateway integration

---

### **Project 08: Crypto Investment Tracker** ⭐⭐⭐⭐⭐ (7.5/10)
**Platform**: Mobile (iOS + Android)  
**Tech Stack**:
```yaml
Frontend: React Native + TypeScript + Expo
State: Zustand + TanStack Query v5 + React Hook Form
UI: Tamagui (universal design system)
Charts: Victory Native + Lightweight Charts
Real-time: WebSocket (ws library)
Backend: Bun + Hono (modern runtime + framework)
Database: PostgreSQL + Drizzle ORM
Cache: Upstash Redis
Deploy: Expo EAS + Railway
```

**Why TanStack Ecosystem Focus?**
- TanStack Query v5 = best data fetching (query invalidation, mutations)
- TanStack Table = complex data tables
- TanStack Virtual = virtualization for large lists
- TanStack Form = advanced form handling

**Focus Learning**:
- TanStack Query v5 (advanced features)
  - Infinite queries
  - Optimistic updates
  - Query invalidation strategies
  - Prefetching
- React Hook Form (complex forms, field arrays)
- WebSocket management (reconnection, heartbeat)
- Bun runtime (faster than Node.js)
- Hono framework (fast, modern)
- Tamagui (universal components)

---

### **Project 09: Freelance Task & Payment Manager** ⭐⭐⭐⭐⭐ (8/10)
**Platform**: Web  
**Tech Stack**:
```yaml
Frontend: React + Vite + TypeScript
State: Jotai + TanStack Query
UI: Mantine UI (feature-rich component library)
Forms: TanStack Form + Zod
Tables: TanStack Table v8
DnD: dnd-kit
Backend: Fastify + TypeScript
Database: PostgreSQL + Kysely (type-safe SQL)
Real-time: Server-Sent Events (SSE)
Payment: Stripe Connect
Deploy: Cloudflare Pages + Workers
```

**Why TanStack Table?**
- Complex data tables (sorting, filtering, pagination)
- Virtual scrolling for performance
- Headless = full control over UI

**Focus Learning**:
- Jotai (atomic state management)
- TanStack Table v8 (advanced features)
  - Column sorting
  - Global filtering
  - Row selection
  - Virtualization
- TanStack Form (field validation, dependent fields)
- Kysely (type-safe SQL builder)
- Fastify (fastest Node.js framework)
- SSE for real-time (simpler than WebSocket)
- Cloudflare Workers (edge computing)

---

### **Project 10: AI Study Assistant** ⭐⭐⭐⭐⭐ (9/10)
**Platform**: Web + Mobile  
**Tech Stack**:
```yaml
Frontend Web: Next.js 14 + React Server Components
Frontend Mobile: React Native + Expo
State: 
  - Web: Jotai + TanStack Query
  - Mobile: Zustand + TanStack Query
Forms: React Hook Form + Zod
UI Web: Radix UI + TailwindCSS
UI Mobile: Tamagui
Backend: Next.js + Python (FastAPI for AI)
AI: OpenAI API + Langchain + LlamaIndex
Vector DB: Pinecone
Database: Supabase (PostgreSQL + Storage)
Queue: Inngest (modern BullMQ alternative)
Real-time: Supabase Realtime
Deploy: Vercel + Modal (Python AI)
```

**Why Hybrid Stack?**
- Next.js RSC = cutting-edge
- Python FastAPI = AI/ML standard
- Shared backend APIs for web & mobile
- TanStack Query = unified data layer

**Focus Learning**:
- React Server Components (async components, streaming)
- Shared code between web & mobile
- AI integration (prompt engineering, streaming)
- Vector databases (embeddings, similarity search)
- Langchain (AI chains, agents)
- FastAPI (Python async framework)
- Inngest (background jobs, retries)
- Monorepo management (Turborepo)

---

## 🎯 Tech Stack Mastery Matrix

### Frameworks Distribution
| Framework | Projects | Mastery Level After |
|-----------|----------|---------------------|
| **React** | 3 (Projects 5, 9, 10 web) | 🔥🔥🔥🔥🔥 Expert |
| **React Native** | 3 (Projects 2, 4, 8, 10 mobile) | 🔥🔥🔥🔥🔥 Expert |
| **Next.js** | 2 (Projects 5, 10) | 🔥🔥🔥🔥 Advanced |
| **Vue 3** | 1 (Project 1) | 🔥🔥🔥 Proficient |
| **Svelte** | 1 (Project 3) | 🔥🔥🔥 Proficient |
| **Angular** | 1 (Project 6) | 🔥🔥🔥 Proficient |
| **Flutter** | 1 (Project 4) | 🔥🔥🔥 Proficient |

### State Management Mastery
| Library | Projects | Complexity |
|---------|----------|------------|
| **Pinia** | Project 1 (Vue) | ⭐⭐ |
| **Zustand** | Projects 2, 8, 10 | ⭐⭐⭐ |
| **Redux Toolkit** | Projects 5, 7 | ⭐⭐⭐⭐ |
| **Redux Saga** | Project 7 | ⭐⭐⭐⭐⭐ |
| **Jotai** | Projects 9, 10 | ⭐⭐⭐⭐ |
| **NgRx** | Project 6 | ⭐⭐⭐⭐⭐ |
| **Riverpod** | Project 4 (Flutter) | ⭐⭐⭐⭐ |
| **Svelte Stores** | Project 3 | ⭐⭐ |

### TanStack Ecosystem
| Library | Projects | Focus |
|---------|----------|-------|
| **TanStack Query** | Projects 2, 5, 8, 9, 10 | Data fetching, caching, mutations |
| **TanStack Table** | Project 9 | Complex tables, virtualization |
| **TanStack Form** | Project 9 | Advanced form handling |
| **TanStack Virtual** | Project 8 | Performance (large lists) |

### Form Management
| Library | Projects | Use Case |
|---------|----------|----------|
| **React Hook Form** | Projects 5, 8, 10 | Complex forms, validation |
| **VeeValidate** | Project 1 (Vue) | Vue forms |
| **Superforms** | Project 3 (Svelte) | SvelteKit forms |
| **Reactive Forms** | Project 6 (Angular) | Angular forms |
| **TanStack Form** | Project 9 | Type-safe forms |

### Backend Diversity
| Framework | Projects | Reason |
|-----------|----------|--------|
| **Express** | Project 1 | Simple, standard |
| **Fastify** | Project 9 | Fast, modern |
| **NestJS** | Projects 6, 7 | Enterprise, TypeScript |
| **Next.js API** | Projects 5, 10 | Full-stack monolith |
| **SvelteKit** | Project 3 | Svelte full-stack |
| **Hono** | Project 8 | Ultra-fast, edge-ready |
| **FastAPI** | Project 10 | Python AI/ML |

### Database & ORM
| Tech | Projects | Learning |
|------|----------|----------|
| **Prisma** | Projects 1, 5, 6, 7 | Type-safe, migrations |
| **Drizzle** | Projects 5, 8 | SQL-first, lightweight |
| **Kysely** | Project 9 | Type-safe SQL builder |
| **TypeORM** | Project 6 | Angular/NestJS standard |
| **Drift** | Project 4 | Flutter SQLite |

---

## 🎓 Hot Technologies Coverage (2022-2025)

### ✅ Covered in Portfolio

**Frontend Frameworks:**
- ✅ Next.js 14 (App Router, RSC) - Projects 5, 10
- ✅ React 18 (Concurrent features) - All React projects
- ✅ Vue 3 (Composition API) - Project 1
- ✅ Svelte/SvelteKit - Project 3
- ✅ Angular 17 (Signals) - Project 6

**Mobile:**
- ✅ React Native (Expo) - Projects 2, 8, 10
- ✅ Flutter - Project 4

**State Management:**
- ✅ Zustand - Projects 2, 8, 10
- ✅ Redux Toolkit + Saga - Projects 5, 7
- ✅ Jotai - Projects 9, 10
- ✅ TanStack Query - Projects 2, 5, 8, 9, 10
- ✅ NgRx - Project 6
- ✅ Pinia - Project 1

**UI Libraries:**
- ✅ Shadcn/ui - Projects 5, 7, 10
- ✅ Radix UI - Project 10
- ✅ TailwindCSS - Projects 3, 5, 7, 10
- ✅ Mantine - Project 9
- ✅ Tamagui - Projects 8, 10 (universal)
- ✅ Angular Material - Project 6

**Backend:**
- ✅ tRPC - Project 5
- ✅ Hono - Project 8
- ✅ Fastify - Project 9
- ✅ NestJS - Projects 6, 7
- ✅ Bun runtime - Project 8

**Database:**
- ✅ Drizzle ORM - Projects 5, 8
- ✅ Prisma - Projects 1, 6, 7
- ✅ Kysely - Project 9

**Advanced:**
- ✅ React Server Components - Project 10
- ✅ Server-Sent Events - Project 9
- ✅ WebSocket - Projects 7, 8
- ✅ PWA - Project 7
- ✅ Microservices - Project 7
- ✅ Edge Computing (Cloudflare Workers) - Project 9
- ✅ AI Integration (OpenAI, Langchain) - Project 10
- ✅ Vector Databases (Pinecone) - Project 10

---

## 🗓️ Revised Roadmap (8 months)

### Month 1: Foundation
**Week 1-2: Project 1 (Vue + Event Helper)**
- Learn Vue 3 ecosystem
- Pinia state management
- Basic CRUD patterns

**Week 3-4: Project 2 (React Native + Habit Tracker)**
- Mobile development basics
- React Query fundamentals
- Push notifications

### Month 2: Diversify
**Week 5-6: Project 3 (Svelte + Split Bill)**
- Svelte reactivity
- Algorithm implementation
- Real-time features

**Week 7-8: Project 4 (Flutter + Money Tracker)**
- Dart language
- Flutter widgets
- Riverpod state

### Month 3-4: React Mastery
**Week 9-12: Project 5 (Next.js + Redux + Meal Planner)**
- Redux Toolkit + RTK Query
- tRPC integration
- Complex algorithms
- Drizzle ORM

**Week 13-14: Buffer / Polish Projects 1-5**

### Month 5: Enterprise
**Week 15-18: Project 6 (Angular + Insurance)**
- Angular ecosystem
- NgRx + RxJS
- NestJS backend
- Complex forms

### Month 6-7: Advanced
**Week 19-22: Project 7 (PWA + Redux Saga + Business Booster)**
- Redux Saga side effects
- PWA implementation
- Microservices
- Multi-platform

**Week 23-26: Project 8 (React Native + TanStack + Crypto Tracker)**
- TanStack ecosystem deep dive
- WebSocket real-time
- Bun + Hono
- Complex data handling

### Month 8: Capstone
**Week 27-32: Project 9 (TanStack Table + Freelance Manager)**
- TanStack Table mastery
- Jotai state
- Fastify backend
- Stripe integration

**Week 33-36: Project 10 (AI + Full-Stack + Study Assistant)**
- React Server Components
- AI integration
- Python FastAPI
- Monorepo management
- Vector databases

---

## 🎤 Interview Advantages

### "Tell me about your experience with..."

**React Ecosystem:**
> "I've built 5 production apps with React, including 3 mobile apps with React Native. I'm proficient with modern patterns like Server Components, Suspense, and hooks. I've used Redux Toolkit with Saga for complex side effects, Zustand for lightweight state, and Jotai for atomic state management. I'm also experienced with TanStack Query for data fetching across multiple projects."

**State Management:**
> "I've worked with 7 different state management solutions across my projects. For simple state, I use Zustand. For enterprise apps with complex side effects, I use Redux Toolkit with Saga. For atomic updates, I prefer Jotai. I've also implemented NgRx with RxJS in Angular, and Pinia in Vue. Each choice was based on the specific requirements of the project."

**Modern Tools:**
> "I'm deeply familiar with the TanStack ecosystem - I've used Query in 5 projects for data fetching and caching, Table for complex data grids with virtualization, and Form for type-safe form handling. I also extensively use React Hook Form with Zod for validation across multiple projects."

**Mobile Development:**
> "I've built apps with both React Native and Flutter. With React Native, I've published 3 apps using Expo, implementing features like push notifications, background tasks, and WebSocket real-time updates. With Flutter, I've built a full financial app using Riverpod and Drift for local database management."

**Full-Stack:**
> "I'm comfortable with multiple backend frameworks. I've used Express for simple APIs, Fastify for high-performance needs, NestJS for enterprise applications with dependency injection, and even built APIs with Hono on Bun for edge computing. I've also worked with tRPC for end-to-end type safety and FastAPI for AI/ML endpoints."

---

## 📊 Skill Level After 10 Projects

```
Frontend Frameworks:
React:         ████████████████████ 10/10 Expert
React Native:  ██████████████████   9/10 Expert
Vue:           ████████████         6/10 Proficient
Svelte:        ████████████         6/10 Proficient
Angular:       ████████████         6/10 Proficient
Flutter:       ██████████           5/10 Proficient

State Management:
Redux + Saga:  ██████████████████   9/10 Expert
TanStack Query:████████████████████ 10/10 Expert
Zustand:       ████████████████████ 10/10 Expert
Jotai:         ██████████████████   9/10 Expert
NgRx:          ████████████         6/10 Proficient

Modern Ecosystem:
TanStack:      ████████████████████ 10/10 Expert
React Hook Form██████████████████   9/10 Expert
tRPC:          ██████████████       7/10 Advanced
Drizzle:       ██████████████       7/10 Advanced
```

---

## 💼 Job Titles After This Portfolio

✅ **Senior Full-Stack Engineer** (React/Vue/Angular)

✅ **Senior Mobile Engineer** (React Native/Flutter)

✅ **Tech Lead** (Frontend/Mobile)

✅ **Staff Engineer** (IC path)

✅ **Solutions Architect** (Frontend focused)

✅ **Principal Mobile Engineer**

✅ **Cross-Platform Specialist**

**Salary Range**: $130k-$200k (US), 80-150M VND/month (VN)

---
