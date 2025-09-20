# 📌 Ngày 44: Performance Optimization & Scaling trong TypeScript

Đây là bài học tập trung vào việc tối ưu hóa hiệu suất và mở rộng codebase lớn trong TypeScript, dành cho các dự án **enterprise-grade** với hàng trăm nghìn dòng code. Tài liệu được viết chi tiết, rõ ràng, với ví dụ thực tế, mini-project, và benchmark, phù hợp cho cả người mới bắt đầu và lập trình viên muốn áp dụng TypeScript ở cấp độ cao.

---

## 1. Giới thiệu

Khi codebase lớn (từ vài chục nghìn đến hàng trăm nghìn dòng code), TypeScript có thể chậm khi biên dịch, code dễ bị duplicate types, và runtime JS cũng có thể bị chậm nếu không tối ưu. Day 44 tập trung vào:
- **TS compile performance**: Incremental build, project references.
- **Code runtime performance**: Lazy loading, memoization, structural sharing.
- **Codebase scaling patterns**: Module boundaries, dependency inversion, type composition.

---

## 2. Mục tiêu học

Sau bài này, bạn sẽ:
1. Hiểu và áp dụng các kỹ thuật tối ưu hóa compile-time trong TypeScript.
2. Tối ưu hóa runtime performance với memoization, lazy loading, và structural sharing.
3. Thiết kế codebase lớn với module boundaries, DI, và type composition.
4. Xây dựng mini-project mô phỏng codebase lớn để đo lường performance.

---

## 3. Lý thuyết

### 3.1 TypeScript Compile Performance
#### 3.1.1 Sử dụng `incremental` và `tsBuildInfoFile`
Bật incremental build để chỉ biên dịch các file thay đổi.
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./.tsbuildinfo",
    "composite": true,
    "outDir": "./dist",
    "strict": true
  },
  "include": ["src/**/*"]
}
```

**Giải thích**:
- `incremental`: Chỉ build file thay đổi, giảm thời gian compile.
- `tsBuildInfoFile`: Lưu thông tin build để tăng tốc build lần sau.
- `composite`: Cần khi dùng **Project References**.

#### 3.1.2 Project References
Tách codebase lớn thành nhiều module/package với tsconfig riêng.
```
/tsconfig.json          // root
/packages/user/tsconfig.json
/packages/order/tsconfig.json
```

Root `tsconfig.json`:
```typescript
{
  "files": [],
  "references": [
    { "path": "./packages/user" },
    { "path": "./packages/order" }
  ]
}
```

**Lợi ích**:
- Build từng module riêng biệt.
- IDE indexing nhanh hơn.
- CI/CD chỉ build package bị ảnh hưởng, tiết kiệm thời gian.

### 3.2 Runtime Performance Patterns
#### 3.2.1 Memoization
Tối ưu function tính toán nặng bằng cách cache kết quả.
```typescript
function expensiveCalculation(n: number): number {
  console.log("Calculating...");
  return n * n * Math.random();
}

const memo: Record<number, number> = {};
function memoizedCalculation(n: number) {
  if (memo[n] !== undefined) return memo[n];
  const result = expensiveCalculation(n);
  memo[n] = result;
  return result;
}

console.log(memoizedCalculation(5)); // Calculating... (kết quả ngẫu nhiên)
console.log(memoizedCalculation(5)); // Cached, không tính toán lại
```

**Giải thích**:
- Cache kết quả dựa trên input, tránh tính toán lặp lại.

#### 3.2.2 Lazy Loading
Chỉ load module khi cần, giảm thời gian khởi động.
```typescript
async function loadHeavyModule() {
  const { HeavyModule } = await import("./heavy-module");
  const instance = new HeavyModule();
  instance.run();
}
```

**Giải thích**:
- Sử dụng `await import` để load động, phù hợp cho module nặng hoặc ít dùng.

#### 3.2.3 Structural Sharing & Immutability
Khi update object/array, chỉ copy phần thay đổi để tránh clone toàn bộ.
```typescript
const state = { users: [{ id: 'u1', name: 'Alice' }] };
const newState = {
  ...state,
  users: [...state.users, { id: 'u2', name: 'Bob' }] // Chỉ copy array, không deep clone
};
```

**Giải thích**:
- Giảm memory usage và tăng tốc update state trong Redux hoặc state global.

---

## 4. Scaling Codebase Patterns

### 4.1 Module Boundaries
Mỗi module có **API rõ ràng**, chỉ export những gì cần thiết.
```typescript
// user/index.ts
export { UserService } from './service';
export { UserRepository } from './repository';

// Internal helper functions không export → tránh coupling
```

**Giải thích**:
- Giới hạn export để tránh phụ thuộc không cần thiết giữa modules.

### 4.2 Dependency Inversion
Service phụ thuộc vào interface thay vì implementation cụ thể.
```typescript
export interface IUserRepo {
  getById(id: string): User | undefined;
}

export class UserService {
  constructor(private repo: IUserRepo) {}
}
```

**Giải thích**:
- Dễ mock/test, thay đổi implementation mà không sửa service.

### 4.3 Type Composition & Utility Types
Sử dụng `Pick`, `Omit`, `Partial`, `Record` để tránh duplicate types.
```typescript
type UserSummary = Pick<User, 'id' | 'name'>;
type EditableUser = Partial<User>;
```

**Giải thích**:
- Giảm lặp code, tăng tính tái sử dụng types.

### 4.4 Avoid `any` & `unknown`
- Ưu tiên `unknown` + type guards để xử lý dữ liệu không rõ kiểu, tránh `any`.

---

## 5. Best Practices

1. **Tách codebase**: Sử dụng project references và incremental build cho codebase lớn.
2. **Multi-level Caching**: Kết hợp in-memory cache và shared cache (như Redis).
3. **Worker Threads**: Sử dụng cho tính toán nặng để tránh block main thread.
4. **Lazy Loading**: Áp dụng cho modules ít dùng.
5. **Benchmark**: Đo thời gian compile/runtime để tối ưu liên tục.
6. **Type Safety**: Bật `strict`, tránh `any`, sử dụng Zod cho validation.

---

## 6. Mini-Project: Enterprise TS Simulation — Performance & Scaling

### 6.1 Mục tiêu
Mô phỏng codebase lớn (>50k dòng) với:
- Project References cho incremental build.
- DI + interface.
- Memoization.
- Lazy Loading.
- Structural Sharing.
- Đo benchmark compile & runtime.

### 6.2 Cấu trúc Project
```
/enterprise-ts/
├── tsconfig.json
├── packages/
│   ├── user/
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── models/
│   │       │   └── user.ts
│   │       ├── repository/
│   │       │   └── userRepo.ts
│   │       └── service/
│   │           └── userService.ts
│   └── order/
│       ├── tsconfig.json
│       └── src/
│           ├── models/
│           │   └── order.ts
│           ├── repository/
│           │   └── orderRepo.ts
│           └── service/
│               └── orderService.ts
└── scripts/
    ├── run.ts
    └── benchmark.ts
```

### 6.3 Project References
Root `tsconfig.json`:
```typescript
{
  "files": [],
  "references": [
    { "path": "./packages/user" },
    { "path": "./packages/order" }
  ]
}
```

Packages `tsconfig.json`:
```typescript
{
  "compilerOptions": {
    "composite": true,
    "incremental": true,
    "outDir": "dist",
    "strict": true
  },
  "include": ["src/**/*"]
}
```

**Giải thích**: Cho phép build incremental, chỉ rebuild module thay đổi.

### 6.4 Module User (Memoization)
```typescript
// packages/user/src/models/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

// packages/user/src/repository/userRepo.ts
import { User } from '../models/user';

export interface IUserRepo {
  getById(id: string): User | undefined;
  getAll(): User[];
}

export class UserRepo implements IUserRepo {
  private users: User[];

  constructor(size: number = 10000) {
    // Giả lập 10k users
    this.users = Array.from({ length: size }, (_, i) => ({
      id: `u${i + 1}`,
      name: `User${i + 1}`,
      email: `user${i + 1}@example.com`
    }));
  }

  getById(id: string) {
    return this.users.find(u => u.id === id);
  }

  getAll() {
    return this.users;
  }
}

// packages/user/src/service/userService.ts
import { IUserRepo, UserRepo } from '../repository/userRepo';
import { User } from '../models/user';

export class UserService {
  constructor(private repo: IUserRepo) {}

  private cache: Record<string, User> = {};

  getUser(id: string): User | undefined {
    if (this.cache[id]) return this.cache[id]; // Memoization
    const user = this.repo.getById(id);
    if (user) this.cache[id] = user;
    return user;
  }

  listUsers(): User[] {
    return this.repo.getAll();
  }
}

// DI example
const repo = new UserRepo();
export const userService = new UserService(repo);
```

### 6.5 Module Order (Lazy Loading + Structural Sharing)
```typescript
// packages/order/src/models/order.ts
export interface Order {
  id: string;
  userId: string;
  amount: number;
}

// packages/order/src/repository/orderRepo.ts
import { Order } from '../models/order';

export interface IOrderRepo {
  getOrdersByUser(userId: string): Order[];
}

export class OrderRepo implements IOrderRepo {
  private orders: Order[];

  constructor(size: number = 50000) {
    this.orders = Array.from({ length: size }, (_, i) => ({
      id: `o${i + 1}`,
      userId: `u${(i % 10000) + 1}`,
      amount: Math.floor(Math.random() * 1000)
    }));
  }

  getOrdersByUser(userId: string) {
    return this.orders.filter(o => o.userId === userId);
  }
}

// packages/order/src/service/orderService.ts
import type { IOrderRepo } from '../repository/orderRepo';
import { Order } from '../models/order';

export class OrderService {
  constructor(private repo: IOrderRepo) {}

  async getUserOrdersWithDiscount(userId: string) {
    const { calculateDiscount } = await import('../utils/discount'); // Lazy loading
    const orders = this.repo.getOrdersByUser(userId);

    return orders.map(o => ({
      ...o, // Structural sharing
      discounted: calculateDiscount(o.amount)
    }));
  }
}

// utils/discount.ts (giả lập tính toán nặng)
export function calculateDiscount(amount: number) {
  let result = amount;
  for (let i = 0; i < 1000; i++) {
    result = result * 0.999 + 0.1;
  }
  return Math.round(result);
}
```

### 6.6 Script Benchmark Runtime
```typescript
// scripts/benchmark.ts
import { userService } from '../packages/user/src/service/userService';
import { OrderRepo } from '../packages/order/src/repository/orderRepo';
import { OrderService } from '../packages/order/src/service/orderService';

async function benchmark() {
  console.time('Fetch user');
  const user = userService.getUser('u5000');
  console.timeEnd('Fetch user');
  console.log(user);

  console.time('Fetch orders with discount');
  const orderRepo = new OrderRepo();
  const orderService = new OrderService(orderRepo);
  const orders = await orderService.getUserOrdersWithDiscount('u5000');
  console.timeEnd('Fetch orders with discount');
  console.log('Orders length:', orders.length);
}

benchmark();
```

**Kết quả dự kiến**:
- Fetch user: <1ms (nhờ memoization).
- Fetch orders with discount: ~50-200ms (nhờ lazy loading và structural sharing).

### 6.7 Build & Run
```bash
# Build incremental
tsc --build

# Run benchmark
ts-node scripts/benchmark.ts
```

**Giải thích**: Nếu thay đổi một file, chỉ module đó được rebuild. Runtime nhanh nhờ caching và lazy loading.

---

## 7. Mini-Project Nâng Cao: Codebase >200k Dòng với Multi-Level Caching & Web Worker

### 7.1 Mục tiêu
Mô phỏng codebase lớn hơn với:
- **Multi-level caching**: L1 (in-memory), L2 (Redis).
- **Worker Threads**: Xử lý tính toán nặng ngoài main thread.
- **Benchmark frontend + backend**.

### 7.2 Cấu trúc Nâng Cao
```
/enterprise-ts-advanced/
├── tsconfig.json
├── packages/
│   ├── user/
│   ├── order/
│   ├── analytics/
│   └── common/
├── scripts/
│   ├── benchmark.ts
│   └── run.ts
└── workers/
    └── discountWorker.ts
```

### 7.3 Multi-Level Caching
#### L1: Service-Level Memoization
```typescript
// packages/user/src/service/userService.ts (đoạn mã)
private cache: Map<string, User> = new Map();

getUser(id: string): User | undefined {
  if (this.cache.has(id)) return this.cache.get(id);
  const user = this.repo.getById(id);
  if (user) this.cache.set(id, user);
  return user;
}
```

#### L2: Redis Cache
```typescript
// packages/user/src/service/userService.ts (mở rộng)
import Redis from 'ioredis';
const redis = new Redis();

async getUserRedis(id: string): Promise<User | null> {
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached) as User;
  const user = this.repo.getById(id);
  if (user) await redis.set(`user:${id}`, JSON.stringify(user), 'EX', 60 * 5); // 5 phút
  return user;
}
```

### 7.4 Worker Threads cho Tính Toán Nặng
```typescript
// workers/discountWorker.ts
import { parentPort } from 'worker_threads';

parentPort?.on('message', (orders: { id: string; amount: number }[]) => {
  const results = orders.map(o => ({
    ...o,
    discounted: Array(1000).fill(o.amount).reduce((a, b) => a * 0.999 + 0.1, o.amount)
  }));
  parentPort?.postMessage(results);
});
```

```typescript
// packages/order/src/service/orderService.ts (mở rộng)
import { Worker } from 'worker_threads';

export class OrderService {
  // ...

  async getUserOrdersAsync(userId: string): Promise<Order[]> {
    const orders = this.repo.getOrdersByUser(userId);

    return new Promise((resolve, reject) => {
      const worker = new Worker('./workers/discountWorker.js');
      worker.postMessage(orders);
      worker.on('message', (result) => resolve(result));
      worker.on('error', reject);
      worker.on('exit', (code) => code !== 0 && reject(new Error(`Worker stopped with ${code}`)));
    });
  }
}
```

**Giải thích**: Worker xử lý tính toán nặng ngoài main thread, tránh block event loop.

### 7.5 Benchmark Script (Frontend + Backend)
```typescript
// scripts/benchmark.ts
import { userService } from '../packages/user/src/service/userService';
import { OrderRepo } from '../packages/order/src/repository/orderRepo';
import { OrderService } from '../packages/order/src/service/orderService';

async function benchmark() {
  console.time('Fetch 1 user (L1 cache)');
  const user1 = userService.getUser('u9999');
  console.timeEnd('Fetch 1 user (L1 cache)');
  console.log(user1);

  console.time('Fetch 1 user (Redis L2)');
  const user2 = await userService.getUserRedis('u9999');
  console.timeEnd('Fetch 1 user (Redis L2)');
  console.log(user2);

  console.time('Fetch orders with worker');
  const orderRepo = new OrderRepo();
  const orderService = new OrderService(orderRepo);
  const orders = await orderService.getUserOrdersAsync('u9999');
  console.timeEnd('Fetch orders with worker');
  console.log('Orders:', orders.slice(0, 5)); // Chỉ hiển thị 5 orders
}

benchmark();
```

**Kết quả dự kiến**:
- L1 cache: <1ms.
- Redis L2: ~1-5ms (tùy network).
- Worker cho 50k orders: ~50-200ms (thay vì >2s nếu tính trên main thread).

---

## 8. Bài tập

### 🟢 Cấp độ 1: Tách Project với Project References
Tách một project TS lớn thành 2 module (`user` + `order`) bằng **project references**. Bật `incremental` và kiểm tra build nhanh hơn.

**Lời giải**: Tham khảo cấu trúc project ở phần 6.2. Sử dụng root `tsconfig.json` với references, và bật `incremental: true` trong các tsconfig package.

**Giải thích**: Chạy `tsc --build` để kiểm tra incremental build. Nếu thay đổi file trong `user`, chỉ module đó được rebuild.

### 🟡 Cấp độ 2: Tối ưu Function với Memoization
Tối ưu function tính toán nặng bằng **memoization**. Tạo fake `orders` 10000 item, dùng spread operator để không deep clone toàn bộ array.

**Lời giải**:
```typescript
function expensiveCalculation(n: number): number {
  console.log("Calculating...");
  return n * n * Math.random();
}

const memo: Record<number, number> = {};
function memoizedCalculation(n: number) {
  if (memo[n] !== undefined) return memo[n];
  const result = expensiveCalculation(n);
  memo[n] = result;
  return result;
}

const orders = Array.from({ length: 10000 }, (_, i) => ({ id: `o${i}`, amount: i }));
const updatedOrders = orders.map(o => ({ ...o, discounted: memoizedCalculation(o.amount) }));

console.log(updatedOrders[0]); // Calculating...
console.log(updatedOrders[0]); // Cached
```

**Giải thích**: Memoization giảm thời gian tính toán lặp, spread operator chỉ copy phần cần thay đổi.

### 🔴 Cấp độ 3: Module Lazy Load & DI
Xây dựng module lazy load cho `analytics` hoặc `report`. Sử dụng DI và interface cho tất cả service. Kiểm tra performance với 50000 item.

**Lời giải**: Tham khảo phần 7 với worker threads và lazy loading. Sử dụng DI trong `container.ts` để inject repositories.

**Giải thích**: Chạy benchmark với 50000 item để đo thời gian. Worker threads giảm block time, DI dễ mock cho testing.

---

## 9. Kết luận

- **Compile Optimization**: Incremental build, project references giúp codebase lớn build nhanh.
- **Runtime Optimization**: Memoization, lazy loading, structural sharing giảm thời gian chạy.
- **Scaling Patterns**: Module boundaries, DI, type composition đảm bảo codebase dễ mở rộng.
- **Type Safety First**: Tránh `any`, dùng Zod để an toàn cả compile-time và runtime.
- **Enterprise-ready**: Codebase lớn vẫn maintainable, dễ onboarding, CI/CD, và test.
- Day 44 là bước kết hợp performance và scaling, chuẩn bị cho các dự án thực tế lớn.

---

## 10. Bước tiếp theo

- **Thực hành**: Tích hợp Redis thực tế vào mini-project và đo benchmark.
- **Khám phá**: Sử dụng **worker_threads** trong Node.js cho backend real-time.
- **Mở rộng**: Thêm **multi-level caching** với Redis và benchmark so sánh với không cache.

Tài liệu này cung cấp một **mini-project** thực tế để mô phỏng codebase lớn, với các pattern enterprise. Nếu bạn muốn viết script đo build time hoặc mở rộng thêm, hãy cho mình biết nhé! 🚀

---
📌 [<< Ngày 43](./Day43.md) | [Ngày 45 >>](./Day45.md)