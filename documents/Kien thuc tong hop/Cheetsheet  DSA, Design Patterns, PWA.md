# **Cheatsheet 30 Ngày: Advanced React/Next.js Enterprise**

## **1️⃣ Tuần 1 – DSA cơ bản → trung cấp**

| Ngày | Chủ đề              | Key Points                                 | Code Snippet                                                         | Notes / Tips                            |
| ---- | ------------------- | ------------------------------------------ | -------------------------------------------------------------------- | --------------------------------------- |
| 1    | Array cơ bản        | push/pop, slice/splice, map/filter/reduce  | `const arr = [1,2,3]; arr.push(4); arr.map(x=>x*2);`                 | Test với array rỗng/trùng               |
| 2    | String + HashMap    | count char, Map/Set O(1)                   | `const map = new Map(); map.set('a',1);`                             | Chuỗi palindrome, substring không trùng |
| 3    | Recursion           | Base case + recursive case                 | `function factorial(n){if(n<=1) return 1; return n*factorial(n-1);}` | Memoization khi cần                     |
| 4    | Sorting & Searching | Bubble, Quick, Merge, Binary search        | `arr.sort((a,b)=>a-b);`                                              | Binary search chỉ với array sorted      |
| 5    | Stack & Queue       | LIFO/FIFO, undo/redo                       | `stack.push(1); stack.pop(); queue.shift();`                         | Implement queue bằng 2 stack            |
| 6    | Linked List         | Node, head/tail, traverse                  | `class Node{value; next=null}`                                       | Reverse, detect cycle, merge sorted     |
| 7    | Mini-project DSA    | Task Manager: add/edit/delete, sort/search | Use Array, Stack, LinkedList                                         | Test edge cases: rỗng, undo nhiều bước  |

---

## **2️⃣ Tuần 2 – Design Patterns trong React/Next.js**

| Ngày | Pattern    | Key Points                    | Code Snippet                                                                                          | Notes / Tips                          |
| ---- | ---------- | ----------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------- |
| 8    | Factory    | Tạo object/component dynamic  | `function InputFactory(type){ if(type==="text") return new TextInput(); }`                            | Dùng interface để ép type consistency |
| 9    | Singleton  | Chỉ 1 instance                | `class Logger{ static instance; static getInstance(){...} }`                                          | Use for global config, logging, cache |
| 10   | Adapter    | Bridge legacy API → new API   | `class ApiAdapter{ getData(){ return {payload: oldApi.fetchData().data} } }`                          | Giữ interface client ổn định          |
| 11   | Decorator  | Add feature component/class   | `function withAuth(Component){return props=>user.loggedIn?<Component {...props}/>:<div>Denied</div>}` | Add logging, analytics, spinner       |
| 12   | Observer   | Objects subscribe → notify    | `class Subject{subscribe(fn){...} notify(data){...}}`                                                 | Live update, notification system      |
| 13   | Strategy   | Dynamic algorithm             | `class Context{ strategy; sortArray(arr){ return this.strategy.sort(arr); } }`                        | Sorting, payment, discount logic      |
| 14   | Middleware | Logic pre/post request/action | `export function middleware(req){ if(!auth) return redirect("/login"); }`                             | Auth, validation, logging             |

---

## **3️⃣ Tuần 3 – PWA trong React/Next.js**

| Ngày | Chủ đề                | Key Points                                  | Code Snippet                                                        | Notes / Tips               |
| ---- | --------------------- | ------------------------------------------- | ------------------------------------------------------------------- | -------------------------- |
| 15   | Manifest              | name, icons, start\_url                     | `manifest.json`                                                     | Test installable           |
| 16   | Service Worker cơ bản | Cache static assets                         | `self.addEventListener('fetch', e=>{ caches.match(e.request)... })` | Offline fallback page      |
| 17   | SW nâng cao           | Cache API responses, stale-while-revalidate | `caches.open('api-cache').then(cache=>...)`                         | Offline task list          |
| 18   | Push Notification     | Web push API                                | `swReg.pushManager.subscribe(...)`                                  | Alert user khi task mới    |
| 19   | Background Sync       | Offline → online                            | `self.addEventListener('sync', e=>{...})`                           | Queue nhiều task offline   |
| 20   | Performance           | Lazy load, compress, Lighthouse             | `React.lazy(()=>import('./Comp'))`                                  | Test Lighthouse >90        |
| 21   | Mini-project PWA      | Offline-first task app                      | Integrate SW, push, manifest                                        | Test offline & installable |

---

## **4️⃣ Tuần 4 – Mini-project tích hợp**

| Ngày | Chủ đề                         | Key Points                                        | Code Snippet                         | Notes / Tips                       |
| ---- | ------------------------------ | ------------------------------------------------- | ------------------------------------ | ---------------------------------- |
| 22   | Project setup                  | Next.js + TS + folder structure                   | `lib/api.ts`                         | Modular, reusable structure        |
| 23   | Task CRUD + DSA                | Array, Map, Sorting, Stack                        | `class TaskManager{add/delete/sort}` | Undo/redo using stack              |
| 24   | Design Patterns                | Factory, Strategy, Observer                       | `Context + Observer`                 | Update UI dynamically              |
| 25   | PWA Integration                | Manifest + SW                                     | `next.config.js withPWA`             | Offline fallback                   |
| 26   | Background Sync + Push         | Sync offline tasks, notification                  | `self.addEventListener('push', ...)` | Queue offline tasks                |
| 27   | UI & Accessibility             | Modular components, ARIA                          | `<button aria-label="Add Task">`     | Lazy load heavy components         |
| 28   | Testing & Error Handling       | Jest, ErrorBoundary                               | `ErrorBoundary FallbackComponent`    | Test add/delete/sort               |
| 29   | Performance Optimization       | React.memo, useMemo/useCallback, Virtualized list | `React.memo(TaskItem)`               | Optimize >1000 tasks               |
| 30   | Final Integration & Deployment | Deploy Next.js PWA                                | Vercel/Netlify                       | Check offline mode, Lighthouse >90 |

---

## **✅ Enterprise-level Best Practices**

* **DSA:** dùng cho tối ưu tính năng, sorting/searching, undo/redo
* **Patterns:** reusable, modular, maintainable, decouple logic
* **PWA:** offline-first, caching, push, background sync, installable
* **Performance:** lazy load, memoization, virtualized lists
* **Testing & Error Handling:** unit test, error boundaries, edge case
* **Accessibility:** ARIA labels, keyboard navigation, semantic HTML
* **Deployment:** versioning cache, Lighthouse >90, mobile-ready

---
