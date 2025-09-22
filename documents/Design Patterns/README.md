## **Design Patterns trong React/Next.js**

**Mục tiêu tuần:**

* Biết khi nào và cách áp dụng **Creational, Structural, Behavioral Patterns** trong dự án
* Tổ chức code module hóa, reusable, maintainable

| Ngày | Nội dung           | Kiến thức đạt được                                                 | Bài tập chính                                      |
| ---- | ------------------ | ------------------------------------------------------------------ | -------------------------------------------------- |
| 8    | Factory Pattern    | Tạo object động, tránh if/else dài, ví dụ tạo nhiều loại component | Tạo dynamic form inputs bằng factory               |
| 9    | Singleton Pattern  | Quản lý global state/service duy nhất, config, logging             | Singleton logger, API service                      |
| 10   | Adapter Pattern    | Bridge API cũ → API mới, maintainable                              | Adapter cho fetch API cũ sang fetch mới            |
| 11   | Decorator Pattern  | Thêm feature cho component mà không sửa core logic                 | Decorator thêm auth/permission check cho component |
| 12   | Observer Pattern   | State update real-time, subscription pattern                       | Implement notification system, live task updates   |
| 13   | Strategy Pattern   | Thay đổi thuật toán động, ví dụ sort/payment method                | Sort strategy, payment calculation strategy        |
| 14   | Middleware Pattern | Xử lý auth, logging, validation trong request/response             | Middleware cho API routes Next.js                  |

---


## **Mini-project tích hợp DSA + Patterns + PWA**

**Mục tiêu tuần:**

* Tạo ứng dụng hoàn chỉnh chuẩn enterprise-level
* Áp dụng DSA, Design Patterns, PWA đồng bộ
* Code sạch, maintainable, production-ready

| Ngày | Nội dung                    | Kiến thức đạt được                                                 | Bài tập chính                                           |
| ---- | --------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------- |
| 22   | Project setup               | Next.js + TypeScript + Tailwind, folder structure chuẩn enterprise | Tạo boilerplate, config TS, ESLint, Prettier            |
| 23   | Core Features (DSA)         | Task CRUD, sort, filter, search, undo/redo                         | Áp dụng Array/Stack/HashMap/LinkedList                  |
| 24   | Design Patterns             | Factory/Observer/Strategy cho task operations                      | Implement dynamic task types, notification system       |
| 25   | PWA Integration             | Service Worker + Cache API + Offline mode                          | Tích hợp offline mode, cache tasks                      |
| 26   | Push Notification           | Real-time notification                                             | Thông báo khi task thay đổi                             |
| 27   | Background Sync             | Offline → online data sync                                         | Sync task updates với server khi online                 |
| 28   | Final Review & Optimization | Code refactor, performance, Lighthouse                             | Tối ưu bundle, lazy load, accessibility                 |
| 29   | Testing & Debugging         | Unit test + Integration test                                       | Test task CRUD, offline, notification                   |
| 30   | Deployment                  | Vercel/Netlify, PWA ready                                          | Deploy hoàn chỉnh, check PWA installable, offline-ready |

---

💡 **Kết quả :**

1. Nắm vững DSA từ cơ bản → trung cấp, áp dụng thực tế.
2. Hiểu và sử dụng Design Patterns trong React/Next.js.
3. Biến ứng dụng React/Next.js thành PWA hoàn chỉnh, offline-first.
4. Mini-project cuối tuần sẵn sàng production, áp dụng tất cả kiến thức trên.


---

# ** Design Patterns trong React/Next.js**

**Mục tiêu tuần:**

* Hiểu và áp dụng **Creational, Structural, Behavioral Patterns** trong dự án React/Next.js
* Tổ chức code chuẩn enterprise, reusable, maintainable

---

## **Ngày 8: Factory Pattern**

**Lý thuyết:**

* Tạo object hoặc component động mà không dùng nhiều if/else
* Khi dùng: cần tạo nhiều loại object cùng interface nhưng khác implementation

**Ví dụ code:**

```ts
// Factory tạo nhiều loại Input Component
interface InputProps { placeholder: string; }

class TextInput {
  render() { return <input type="text" placeholder="Text"/> }
}

class NumberInput {
  render() { return <input type="number" placeholder="Number"/> }
}

function InputFactory(type: "text" | "number") {
  if(type === "text") return new TextInput();
  if(type === "number") return new NumberInput();
}

const input = InputFactory("text");
input.render();
```

**Bài tập:**

* Level 1: Factory tạo Button với type `primary` / `secondary`
* Level 2: Factory tạo Card Component với nhiều layout khác nhau
* Level 3: Factory tạo FormField dynamic dựa trên JSON schema

**Tips:** dùng interface để ép type consistency, tránh hardcode class names.

---

## **Ngày 9: Singleton Pattern**

**Lý thuyết:**

* Đảm bảo chỉ có **1 instance duy nhất**
* Dùng cho: config, logging service, global state

**Ví dụ code:**

```ts
class Logger {
  private static instance: Logger;
  private constructor(){}
  static getInstance() {
    if(!Logger.instance) Logger.instance = new Logger();
    return Logger.instance;
  }
  log(msg: string){ console.log(msg); }
}

const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();
logger1.log("Hello"); 
console.log(logger1 === logger2); // true
```

**Bài tập:**

* Level 1: Singleton cho AppConfig (API baseUrl)
* Level 2: Singleton NotificationService (WebSocket connection)
* Level 3: Singleton CacheManager (localStorage wrapper)

---

## **Ngày 10: Adapter Pattern**

**Lý thuyết:**

* Bridge giữa **API cũ → API mới** mà không thay đổi code client
* Khi dùng: legacy API, thay đổi third-party service

**Ví dụ code:**

```ts
// Legacy API
class OldApi {
  fetchData() { return { data: "old" } }
}

// Adapter
class ApiAdapter {
  oldApi: OldApi;
  constructor(oldApi: OldApi){ this.oldApi = oldApi; }
  getData(){ 
    const result = this.oldApi.fetchData();
    return { payload: result.data }; // chuẩn hóa
  }
}

const adapter = new ApiAdapter(new OldApi());
console.log(adapter.getData()); // { payload: "old" }
```

**Bài tập:**

* Level 1: Adapter cho fetch REST → GraphQL
* Level 2: Adapter cho API response format khác nhau
* Level 3: Adapter cho multiple legacy API → single interface

**Tips:** giữ interface client ổn định → dễ maintain khi backend thay đổi.

---

## **Ngày 11: Decorator Pattern**

**Lý thuyết:**

* Thêm chức năng cho **component hoặc class** mà không sửa core logic
* Khi dùng: thêm auth, logging, styling, animation

**Ví dụ code:**

```ts
function withAuth<P>(Component: React.ComponentType<P>) {
  return (props: P) => {
    const user = { loggedIn: true };
    if(!user.loggedIn) return <div>Access Denied</div>
    return <Component {...props}/>
  }
}

const SecretPage = () => <div>Secret Content</div>;
const ProtectedPage = withAuth(SecretPage);
```

**Bài tập:**

* Level 1: Decorator thêm loading spinner cho component
* Level 2: Decorator thêm permission check
* Level 3: Decorator thêm analytics logging cho click events

---

## **Ngày 12: Observer Pattern**

**Lý thuyết:**

* Cho phép **objects subscribe → được notify khi state thay đổi**
* Khi dùng: notification, live update, subscription

**Ví dụ code:**

```ts
type Listener = (data: any) => void;

class Subject {
  listeners: Listener[] = [];
  subscribe(fn: Listener){ this.listeners.push(fn) }
  notify(data: any){ this.listeners.forEach(fn => fn(data)) }
}

const subject = new Subject();
subject.subscribe(data => console.log("Received:", data));
subject.notify({ msg: "Hello" });
```

**Bài tập:**

* Level 1: Live task updates
* Level 2: Notification system for new messages
* Level 3: Implement Redux-like simple store using Observer

---

## **Ngày 13: Strategy Pattern**

**Lý thuyết:**

* Thay đổi thuật toán **động**, không cần rewrite code
* Khi dùng: sort method, payment calculation, discount logic

**Ví dụ code:**

```ts
interface SortStrategy { sort(arr: number[]): number[] }

class AscSort implements SortStrategy {
  sort(arr: number[]) { return [...arr].sort((a,b)=>a-b); }
}
class DescSort implements SortStrategy {
  sort(arr: number[]) { return [...arr].sort((a,b)=>b-a); }
}

class Context {
  strategy: SortStrategy;
  constructor(strategy: SortStrategy){ this.strategy = strategy; }
  sortArray(arr: number[]){ return this.strategy.sort(arr); }
}

const ctx = new Context(new AscSort());
console.log(ctx.sortArray([3,1,2])); // [1,2,3]
ctx.strategy = new DescSort();
console.log(ctx.sortArray([3,1,2])); // [3,2,1]
```

**Bài tập:**

* Level 1: Sort task list theo priority/date
* Level 2: Payment calculation strategy
* Level 3: Discount strategy (Percentage / Fixed / BuyXGetY)

---

## **Ngày 14: Middleware Pattern**

**Lý thuyết:**

* Chèn logic trước/after xử lý request hoặc action
* Khi dùng: auth, validation, logging, analytics

**Ví dụ code (Next.js API Route Middleware):**

```ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  if(!req.headers.get("authorization")) {
    return NextResponse.redirect("/login");
  }
  console.log("Request to:", req.url);
  return NextResponse.next();
}
```

**Bài tập:**

* Level 1: Auth middleware cho API route
* Level 2: Logging middleware (request method + url)
* Level 3: Validation middleware (check body payload)

---

✅ **Kết quả:**

* Nắm vững các Design Patterns quan trọng cho React/Next.js
* Biết khi nào và cách áp dụng từng pattern
* Code được tổ chức module hóa, reusable, maintainable

