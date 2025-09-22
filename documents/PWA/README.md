
## **PWA trong React/Next.js**

**Mục tiêu tuần:**

* Biết cách biến ứng dụng React/Next.js thành PWA: offline-first, installable, push notification
* Tối ưu performance & Lighthouse score

| Ngày | Nội dung                 | Kiến thức đạt được                               | Bài tập chính                              |
| ---- | ------------------------ | ------------------------------------------------ | ------------------------------------------ |
| 15   | PWA cơ bản               | Cấu hình manifest.json, icon, splash screen      | Tạo manifest & installable app             |
| 16   | Service Worker cơ bản    | Cache static assets, offline mode                | Cache task app, offline view               |
| 17   | Service Worker nâng cao  | Cache API responses, stale-while-revalidate      | Offline task sync, background fetch        |
| 18   | Push Notification        | Web push API, subscription, notification trigger | Notify khi task mới được thêm              |
| 19   | Background Sync          | Đồng bộ dữ liệu offline → online                 | Sync offline changes lên server khi online |
| 20   | Performance & Lighthouse | Audit performance, accessibility, best practices | Tối ưu bundle, lazy load images/components |
| 21   | Mini-project PWA         | Biến Task App thành offline-first PWA            | Tích hợp caching, push, background sync    |

---

# **PWA trong React/Next.js**

**Mục tiêu tuần:**

* Biến ứng dụng React/Next.js thành **offline-first, installable PWA**
* Thêm **caching, background sync, push notification**
* Tối ưu performance & Lighthouse score

---

## **Ngày 15: PWA cơ bản**

**Lý thuyết:**

* `manifest.json`: tên app, icon, theme color, start\_url
* Installable app: người dùng có thể add app vào home screen

**Ví dụ code:**

```json
// public/manifest.json
{
  "name": "Task Manager",
  "short_name": "Tasks",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4CAF50",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**Bài tập:**

* Level 1: Thêm manifest và icon cho app
* Level 2: Test installable trên Chrome DevTools
* Level 3: Thêm splash screen và theme color

---

## **Ngày 16: Service Worker cơ bản**

**Lý thuyết:**

* SW cache **static assets** → offline mode
* Scope: `/`, `/static/*`, `/api/*`

**Ví dụ code:**

```ts
// public/sw.js
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('static-v1').then(cache => cache.addAll(['/','/index.html','/styles.css']))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
```

**Bài tập:**

* Level 1: Cache HTML, CSS, JS
* Level 2: Cache images
* Level 3: Offline fallback page

---

## **Ngày 17: Service Worker nâng cao**

**Lý thuyết:**

* Cache API responses: stale-while-revalidate
* Khi dùng: offline task list, data sync

**Ví dụ code:**

```ts
self.addEventListener('fetch', (e) => {
  if(e.request.url.includes('/api/tasks')){
    e.respondWith(
      caches.open('api-cache').then(cache =>
        fetch(e.request)
          .then(res => { cache.put(e.request, res.clone()); return res; })
          .catch(() => cache.match(e.request))
      )
    );
  }
});
```

**Bài tập:**

* Level 1: Cache API task list
* Level 2: Stale-while-revalidate
* Level 3: Cache failed API requests để retry

---

## **Ngày 18: Push Notification**

**Lý thuyết:**

* Web push API: user subscribe → server gửi notification
* Khi dùng: alert user khi task mới được thêm

**Ví dụ code (client):**

```ts
navigator.serviceWorker.ready.then(swReg => {
  swReg.pushManager.subscribe({ userVisibleOnly: true })
  .then(sub => console.log("Subscribed:", sub))
});
```

**Bài tập:**

* Level 1: Push notification khi task mới
* Level 2: Tùy chỉnh icon & message
* Level 3: Push notification khi offline → online

---

## **Ngày 19: Background Sync**

**Lý thuyết:**

* Sync offline → online tự động
* Khi dùng: user tạo task offline, tự động push khi có mạng

**Ví dụ code:**

```ts
self.addEventListener('sync', (event) => {
  if(event.tag === 'sync-tasks'){
    event.waitUntil(sendOfflineTasks());
  }
});
```

**Bài tập:**

* Level 1: Sync task offline → online
* Level 2: Retry failed sync
* Level 3: Queue nhiều task offline

---

## **Ngày 20: Performance & Lighthouse**

**Lý thuyết:**

* Audit PWA, accessibility, SEO, performance
* Optimize: lazy load, minimize JS/CSS, compress images

**Bài tập:**

* Level 1: Run Lighthouse audit
* Level 2: Lazy load images & components
* Level 3: Optimize bundle & caching strategies

---

## **Ngày 21: Mini-project PWA**

**Mục tiêu:**

* Biến Task App thành **offline-first PWA**
* Tích hợp: caching, push notification, background sync
* Tối ưu performance & Lighthouse score

**Tips:**

* Test offline mode thật kỹ
* Kiểm tra installable app trên mobile và desktop
* Sử dụng caching versioning (`static-v1 → static-v2`)

---

**Mini-project tích hợp DSA + Design Patterns + PWA**, chi tiết từng ngày với:


# **Mini-project tích hợp DSA + Patterns + PWA**

**Mục tiêu tuần:**

* Tích hợp toàn bộ kiến thức: DSA + Design Patterns + PWA
* Hoàn thiện một **Task Manager Enterprise-ready**
* Áp dụng best practices: modular code, reusable components, offline-first, notification, caching

---

## **Ngày 22: Project setup & architecture**

**Lý thuyết:**

* Next.js + TypeScript + SWR (state management đơn giản)
* Folder structure chuẩn:

```
/components
/pages
/lib       // helper, utils
/services  // api, patterns
/hooks
/public    // manifest, icons
```

**Ví dụ code:**

```ts
// lib/api.ts
export async function fetchTasks() {
  const res = await fetch('/api/tasks');
  if(!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}
```

**Bài tập:**

* Level 1: Tạo project Next.js + TypeScript
* Level 2: Thêm folder structure chuẩn
* Level 3: Tạo API route `/api/tasks`

---

## **Ngày 23: Task CRUD + DSA (Array, Map, Sorting)**

**Lý thuyết:**

* Array/HashMap để lưu task list
* Sorting theo priority/date
* Undo/Redo bằng Stack

**Ví dụ code:**

```ts
// services/taskManager.ts
interface Task { id: string; title: string; priority: number; }

export class TaskManager {
  private tasks: Task[] = [];
  add(task: Task){ this.tasks.push(task); }
  delete(id: string){ this.tasks = this.tasks.filter(t => t.id !== id); }
  sortByPriority(){ this.tasks.sort((a,b)=>b.priority-a.priority); }
  getTasks(){ return this.tasks; }
}
```

**Bài tập:**

* Level 1: Implement add/delete task
* Level 2: Implement sort by priority/date
* Level 3: Implement undo/redo task using stack

---

## **Ngày 24: Apply Design Patterns (Factory + Strategy + Observer)**

**Lý thuyết:**

* Factory: tạo dynamic task component (text/number/date)
* Strategy: sorting algorithm đổi động
* Observer: notify UI khi task list thay đổi

**Ví dụ code:**

```ts
// Strategy for sorting
interface SortStrategy { sort(tasks: Task[]): Task[] }

class PrioritySort implements SortStrategy {
  sort(tasks: Task[]) { return [...tasks].sort((a,b)=>b.priority-a.priority); }
}

class DateSort implements SortStrategy {
  sort(tasks: Task[]) { return [...tasks].sort((a,b)=>a.date.getTime()-b.date.getTime()); }
}

// Observer
type Listener = (tasks: Task[]) => void;
class TaskSubject {
  private listeners: Listener[] = [];
  subscribe(fn: Listener){ this.listeners.push(fn); }
  notify(tasks: Task[]){ this.listeners.forEach(fn => fn(tasks)); }
}
```

**Bài tập:**

* Level 1: Implement Factory tạo task input type
* Level 2: Implement Strategy để sort tasks
* Level 3: Implement Observer pattern để update UI tự động

---

## **Ngày 25: Integrate PWA (Manifest + SW)**

**Lý thuyết:**

* Thêm `manifest.json`
* SW cache static assets & API
* Offline fallback

**Ví dụ code:**

```ts
// next.config.js
const withPWA = require('next-pwa')({ dest: 'public' });
module.exports = withPWA({});
```

**Bài tập:**

* Level 1: Thêm manifest + icon
* Level 2: SW cache HTML/JS/CSS
* Level 3: Offline fallback page

---

## **Ngày 26: Background Sync & Push Notification**

**Lý thuyết:**

* Background Sync: sync offline tasks khi online
* Push Notification: alert khi task mới được thêm

**Ví dụ code:**

```ts
// sw.js
self.addEventListener('sync', e => {
  if(e.tag === 'sync-tasks'){ e.waitUntil(syncOfflineTasks()); }
});

self.addEventListener('push', e => {
  const data = e.data?.json();
  self.registration.showNotification(data.title, { body: data.msg });
});
```

**Bài tập:**

* Level 1: Implement offline → online task sync
* Level 2: Push notification khi task mới
* Level 3: Queue nhiều task offline để sync

---

## **Ngày 27: UI Components & Accessibility**

**Lý thuyết:**

* Modular, reusable components
* Accessibility: aria-label, keyboard navigation
* Lazy load components/images

**Ví dụ code:**

```tsx
<button aria-label="Add Task" onClick={handleAdd}>Add</button>
```

**Bài tập:**

* Level 1: Refactor task list component reusable
* Level 2: Add ARIA attributes
* Level 3: Lazy load heavy components

---

## **Ngày 28: Testing & Error Handling**

**Lý thuyết:**

* Unit test: Jest/React Testing Library
* Error boundary, try/catch, fallback UI

**Ví dụ code:**

```tsx
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({error}: any){
  return <div>Something went wrong: {error.message}</div>;
}

<ErrorBoundary FallbackComponent={ErrorFallback}>
  <TaskList />
</ErrorBoundary>
```

**Bài tập:**

* Level 1: Unit test add/delete task
* Level 2: Test sorting & undo/redo
* Level 3: Implement error boundary for main components

---

## **Ngày 29: Performance Optimization**

**Lý thuyết:**

* React.memo, useMemo, useCallback
* Virtualized list nếu task > 1000
* Lighthouse audit

**Ví dụ code:**

```tsx
const TaskItem = React.memo(({task}: {task: Task}) => <div>{task.title}</div>);
```

**Bài tập:**

* Level 1: Memoize TaskItem
* Level 2: useCallback for handlers
* Level 3: Virtualize task list

---

## **Ngày 30: Final Integration & Deployment**

**Mục tiêu:**

* Tích hợp tất cả: DSA + Patterns + PWA + Offline + Notifications + UI + Testing
* Deploy Next.js PWA (Vercel / Netlify)

**Tips:**

* Test offline mode & push notification thật kỹ
* Check Lighthouse score > 90
* Document code & patterns sử dụng

---

✅ **Kết quả:**

* Ứng dụng **Task Manager enterprise-ready**, production-ready
* Tích hợp: DSA, Design Patterns, PWA, Performance, Testing, Accessibility
* Bạn đã có nền tảng đủ vững để build **dự án React/Next.js lớn**

---
