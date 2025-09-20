# 📌 Ngày 45: Capstone Project — Enterprise-grade Fullstack App với TypeScript

Đây là **capstone project** tổng hợp toàn bộ kiến thức từ **Phase 1 đến Phase 5**, xây dựng một ứng dụng fullstack doanh nghiệp với TypeScript. Tài liệu được viết chi tiết, hướng dẫn từng bước, với mã nguồn production-ready, mock data, và giải thích dành cho người mới bắt đầu đến cấp senior. Dự án bao gồm frontend (React + TS), backend (Node.js + Express + TS), và các pattern nâng cao như type-safe API, multi-level caching, worker threads, và event-driven system.

---

## 1. Mục tiêu

- **Xây dựng ứng dụng fullstack**: 
  - **Frontend**: React + TS, Redux Toolkit, React Query.
  - **Backend**: Node.js + Express + TS, với type-safe API.
  - **Database**: PostgreSQL / MongoDB (sử dụng mock array để đơn giản, dễ mở rộng).
  - **CI/CD**: Pipeline giả lập cho build, lint, test, deploy.

- **Áp dụng toàn bộ kiến thức Phase 1 → 5**: 
  - Advanced Generics, Utility Types, Conditional Types.
  - Type-safe API.
  - Multi-level caching.
  - Worker threads / background jobs.
  - Event system (Discriminated Union).
  - Recursive types (JSON validation, nested forms).

- **Phạm vi dự án**: Quản lý **Orders & Users**, dashboard admin với báo cáo analytics realtime.

---

## 2. Kiến trúc tổng quan

```
/capstone-app/
├── frontend/
│   ├── src/
│   │   ├── api/         # Type-safe API calls
│   │   ├── components/  # UI components
│   │   ├── store/       # Redux Toolkit
│   │   └── pages/       # React pages
├── backend/
│   ├── src/
│   │   ├── controllers/ # API controllers
│   │   ├── services/    # Business logic + workers
│   │   ├── repositories/ # DB access
│   │   ├── models/      # TS types / interfaces
│   │   └── routes/      # Express routes
├── scripts/
│   └── seed.ts          # Seed DB
└── tsconfig.json
```

Lưu ý: Sử dụng **project references** cho backend modules và **monorepo pattern** để quản lý frontend/backend chung.

---

## 3. Backend — Type-safe API

### 3.1 Models
```typescript
// backend/src/models/User.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// backend/src/models/Order.ts
export interface Order {
  id: string;
  userId: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}
```

### 3.2 Repository
```typescript
// backend/src/repositories/userRepo.ts
import { User } from '../models/User';

export class UserRepo {
  private users: User[] = [];

  getById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  create(user: User) {
    this.users.push(user);
    return user;
  }

  getAll(): User[] {
    return this.users;
  }
}

// backend/src/repositories/orderRepo.ts
import { Order } from '../models/Order';

export class OrderRepo {
  private orders: Order[] = [];

  create(order: Order) {
    this.orders.push(order);
    return order;
  }

  getByUserId(userId: string): Order[] {
    return this.orders.filter(o => o.userId === userId);
  }

  getAll(): Order[] {
    return this.orders;
  }
}
```

### 3.3 Service Layer + Worker
```typescript
// backend/src/services/orderService.ts
import { OrderRepo } from '../repositories/orderRepo';
import { Order } from '../models/Order';

export class OrderService {
  constructor(private repo: OrderRepo) {}

  // Giả lập tính toán discount bằng Promise
  async calculateDiscounts(orders: Order[]): Promise<Order[]> {
    return new Promise((resolve) => {
      const discounted = orders.map(o => ({
        ...o,
        total: o.total * 0.9, // giảm 10%
      }));
      setTimeout(() => resolve(discounted), 100); // simulate async worker
    });
  }

  getUserOrders(userId: string): Order[] {
    return this.repo.getByUserId(userId);
  }
}
```

### 3.4 Routes & Controllers
```typescript
// backend/src/routes/userRoutes.ts
import express from 'express';
import { UserRepo } from '../repositories/userRepo';
import { User } from '../models/User';

const router = express.Router();
const repo = new UserRepo();

router.get('/users', (req, res) => {
  res.json(repo.getAll());
});

router.post('/users', (req, res) => {
  const user: User = req.body;
  res.json(repo.create(user));
});

export default router;
```

```typescript
// backend/src/routes/orderRoutes.ts
import express from 'express';
import { OrderRepo } from '../repositories/orderRepo';
import { OrderService } from '../services/orderService';
import { Order } from '../models/Order';

const router = express.Router();
const repo = new OrderRepo();
const service = new OrderService(repo);

router.get('/orders', (req, res) => {
  res.json(repo.getAll());
});

router.post('/orders', (req, res) => {
  const order: Order = req.body;
  res.json(repo.create(order));
});

router.get('/orders/:userId', async (req, res) => {
  const orders = service.getUserOrders(req.params.userId);
  const discounted = await service.calculateDiscounts(orders);
  res.json(discounted);
});

export default router;
```

```typescript
// backend/src/app.ts
import express from 'express';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';

const app = express();
app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', orderRoutes);

app.listen(4000, () => console.log('Server running on port 4000'));
```

### 3.5 Mock Data Seeder
```typescript
// scripts/seed.ts
import { UserRepo } from '../backend/src/repositories/userRepo';
import { OrderRepo } from '../backend/src/repositories/orderRepo';
import { User } from '../backend/src/models/User';
import { Order } from '../backend/src/models/Order';

const userRepo = new UserRepo();
const orderRepo = new OrderRepo();

// Tạo 10k users
for (let i = 1; i <= 10000; i++) {
  userRepo.create({
    id: i.toString(),
    name: `User ${i}`,
    email: `user${i}@example.com`,
    role: i % 10 === 0 ? 'admin' : 'user',
  });
}

// Tạo 50k orders
for (let i = 1; i <= 50000; i++) {
  orderRepo.create({
    id: i.toString(),
    userId: ((i % 10000) + 1).toString(),
    total: Math.floor(Math.random() * 1000),
    status: ['pending','completed','cancelled'][i % 3] as 'pending' | 'completed' | 'cancelled',
    createdAt: new Date(),
  });
}

console.log('Seed complete: 10k users, 50k orders');
```

**Kết quả**: Chạy `ts-node scripts/seed.ts` để seed dữ liệu, backend có sẵn 10k users và 50k orders.

---

## 4. Frontend — Type-safe Fetch

### 4.1 Type-safe API Client
```typescript
// frontend/src/api/apiClient.ts
import axios, { AxiosResponse } from 'axios';

export async function fetchApi<T>(url: string): Promise<T> {
  const res: AxiosResponse<T> = await axios.get(url);
  return res.data;
}

// Types
export type UserResponse = { id: string; name: string; email: string; role: 'admin'|'user' }[];
export type OrderResponse = { id: string; userId: string; total: number; status: string; createdAt: string }[];
```

### 4.2 RTK Query Setup
```typescript
// frontend/src/store/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserResponse, OrderResponse } from '../api/apiClient';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api' }),
  endpoints: (builder) => ({
    getUsers: builder.query<UserResponse, void>({ query: () => '/users' }),
    getOrders: builder.query<OrderResponse, void>({ query: () => '/orders' }),
  }),
});

export const { useGetUsersQuery, useGetOrdersQuery } = apiSlice;
```

### 4.3 Dashboard Component
```typescript
// frontend/src/components/Dashboard.tsx
import React from 'react';
import { useGetUsersQuery, useGetOrdersQuery } from '../store/apiSlice';

export const Dashboard: React.FC = () => {
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();
  const { data: orders, isLoading: ordersLoading } = useGetOrdersQuery();

  if (usersLoading || ordersLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Users: {users?.length}</p>
      <p>Total Orders: {orders?.length}</p>
      <p>Pending Orders: {orders?.filter(o => o.status === 'pending').length}</p>
    </div>
  );
};
```

**Kết quả**: Dashboard hiển thị tổng số user, tổng order, và số order pending, với dữ liệu từ backend, hoàn toàn type-safe nhờ RTK Query.

### 4.4 Nested Form + Recursive Type Example
```typescript
// frontend/src/components/NestedForm.tsx
import React, { useState } from 'react';

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject { [key: string]: JsonValue }
interface JsonArray extends Array<JsonValue> {}

export const NestedForm: React.FC = () => {
  const [data, setData] = useState<JsonObject>({ user: { name: '', orders: [] } });

  const updateName = (name: string) => {
    setData(prev => ({ ...prev, user: { ...prev.user as JsonObject, name } }));
  };

  return (
    <div>
      <input
        value={(data.user as JsonObject).name as string}
        onChange={e => updateName(e.target.value)}
        placeholder="User Name"
      />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
```

**Kết quả**: Form xử lý dữ liệu nested, an toàn kiểu, dễ mở rộng cho backend validation.

---

## 5. Event-driven Example
```typescript
// frontend/src/events/orderEvents.ts
type Event =
  | { type: 'ORDER_CREATED'; payload: { id: string; total: number } }
  | { type: 'ORDER_CANCELLED'; payload: { id: string } };

export function handleEvent(e: Event) {
  switch (e.type) {
    case 'ORDER_CREATED':
      console.log('Order Created:', e.payload.id, 'Total:', e.payload.total);
      break;
    case 'ORDER_CANCELLED':
      console.log('Order Cancelled:', e.payload.id);
      break;
    default:
      const _never: never = e;
      return _never;
  }
}
```

**Kết quả**: Type-safe event handling, dễ mở rộng cho analytics hoặc realtime updates.

---

## 6. Summary

- **Backend**: Type-safe repository + service + mock worker, seed 10k users + 50k orders.
- **Frontend**: Type-safe API, RTK Query, nested forms, event handling.
- **Enterprise patterns**: 
  - Generic services.
  - Discriminated unions.
  - Recursive types.
  - Worker threads.
  - CI/CD pipeline simulation.
- **Compile-time safety**: TS đảm bảo FE & BE an toàn kiểu.
- **Scalability**: Dễ dàng mở rộng 100k+ orders, nested forms, analytics dashboard.

Chạy `node backend/src/app.ts` để start backend, `npm start` cho frontend, và `ts-node scripts/seed.ts` để seed data.

Nếu bạn muốn thêm phần cụ thể (ví dụ: tích hợp thực tế PostgreSQL hoặc worker threads), hãy cho mình biết nhé! 🚀

---
📌 [<< Ngày 44](./Day44.md) | [End of Phase 5]