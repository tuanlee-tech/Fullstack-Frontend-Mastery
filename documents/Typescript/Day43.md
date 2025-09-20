# 📌 Ngày 43: Clean Code & Architecture với TypeScript

Đây là bài học tập trung vào việc áp dụng **Clean Code** và **Architecture Patterns** trong TypeScript, hướng đến thiết kế các dự án **enterprise-grade** dễ bảo trì, mở rộng, và kiểm thử. Tài liệu được viết chi tiết, rõ ràng, với ví dụ thực tế, bài tập, và giải thích dành cho cả người mới bắt đầu và lập trình viên muốn áp dụng TypeScript ở cấp độ cao.

---

## 1. Mục tiêu học

Sau bài này, bạn sẽ:
1. Hiểu và áp dụng **nguyên tắc Clean Code** trong TypeScript.
2. Thiết kế **architecture** chuẩn doanh nghiệp: modular, layered, type-safe.
3. Sử dụng **SOLID principles**, **DRY**, **KISS**, và **Separation of Concerns**.
4. Xây dựng dự án dễ maintain, scalable, testable, và thân thiện với CI/CD.

---

## 2. Lý thuyết

### 2.1 Clean Code Principles
- **Readable**: Code dễ đọc, tên biến/hàm rõ nghĩa, dễ hiểu.
- **Simple & Minimal**: Tránh over-engineering, giữ code đơn giản.
- **Consistent**: Thống nhất coding style, conventions, và formatting.
- **Type-safe**: Tận dụng TypeScript để giảm lỗi runtime.
- **Testable**: Code được thiết kế để dễ viết unit/integration tests.

### 2.2 Architecture Patterns
#### Layered Architecture (3 Layers)
1. **Presentation Layer**: Chứa UI (React components), REST controllers, hoặc GraphQL resolvers.
2. **Business/Domain Layer**: Chứa services, use cases, và business logic.
3. **Data Layer**: Chứa repositories, DB access, hoặc API clients.

#### Modular Structure
```
src/
├── modules/
│   ├── user/
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   ├── repository.ts
│   │   └── types.ts
│   └── order/
│       ├── controller.ts
│       ├── service.ts
│       ├── repository.ts
│       └── types.ts
├── shared/
│   ├── types/
│   ├── validation/
│   └── utils/
```

**Giải thích**:
- **Modules**: Tách code theo feature (user, order) thay vì loại (controllers, services).
- **Shared**: Chứa types, validation schemas, và utilities dùng chung cho cả frontend và backend.

#### SOLID Principles
1. **S**ingle Responsibility Principle (SRP): Mỗi class/function chỉ làm một việc.
2. **O**pen/Closed Principle (OCP): Mở rộng dễ dàng, không cần sửa code cũ.
3. **L**iskov Substitution Principle (LSP): Subclass có thể thay thế superclass mà không gây lỗi.
4. **I**nterface Segregation Principle (ISP): Interface nhỏ, cụ thể, tránh ép client dùng method không cần.
5. **D**ependency Inversion Principle (DIP): High-level module không phụ thuộc trực tiếp vào low-level module, mà qua abstraction/interface.

### 2.3 TypeScript Specific Tips
- Sử dụng **readonly**, **const assertions**, và **literal types** để tăng an toàn kiểu.
- Tận dụng **utility types** (`Pick`, `Omit`, `Partial`) để giảm lặp code.
- Tránh `any`, ưu tiên `unknown` kết hợp với **type guards** khi xử lý dữ liệu không rõ kiểu.

---

## 3. Ví dụ: Modular Service Layer

### 3.1 Shared Types
```typescript
// src/shared/types/user.ts
export type User = {
  id: string;
  name: string;
  email: string;
};
```

### 3.2 User Module
```typescript
// src/modules/user/repository.ts
import type { User } from '../../shared/types/user';

export class UserRepository {
  private users: User[] = [];

  getById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  create(user: User): void {
    this.users.push(user);
  }
}
```

```typescript
// src/modules/user/service.ts
import { UserRepository } from './repository';
import type { User } from '../../shared/types/user';

export class UserService {
  constructor(private repo: UserRepository) {}

  register(user: User) {
    if (this.repo.getById(user.id)) {
      throw new Error('User already exists');
    }
    this.repo.create(user);
  }

  getUser(id: string): User | undefined {
    return this.repo.getById(id);
  }
}
```

```typescript
// src/modules/user/controller.ts
import { UserService } from './service';
import { UserRepository } from './repository';

const repo = new UserRepository();
const service = new UserService(repo);

// Controller usage
try {
  service.register({ id: '1', name: 'Tuân', email: 'tuan@example.com' });
  console.log(service.getUser('1'));
  // Output: { id: '1', name: 'Tuân', email: 'tuan@example.com' }
} catch (err) {
  console.error(err);
}
```

**Kết quả**:
- **SRP**: `UserService` chỉ xử lý logic nghiệp vụ, `UserRepository` chỉ quản lý dữ liệu.
- **OCP**: Có thể thay `UserRepository` bằng DB khác (MongoDB, SQL) mà không sửa `UserService`.
- **Type-safety**: TypeScript đảm bảo `User` được sử dụng đúng kiểu, không cần cast `any`.

---

## 4. Best Practices

1. **Folder by Feature**: Tách code theo module (`user`, `order`) thay vì theo loại (`controllers`, `services`).
2. **Shared Libs**: Đặt types, validation schemas, và utils vào `shared` để tái sử dụng giữa frontend và backend.
3. **Dependency Injection (DI)**: Inject repositories/services qua constructor để dễ test và thay đổi.
4. **Error Handling**: Tạo class `AppError` với format lỗi thống nhất.
5. **Testing**: Mỗi module có unit tests riêng, mock dependencies khi cần.
6. **Type-Safe API Contracts**: Định nghĩa types cho request/response, kết hợp với validation runtime.

```typescript
// src/shared/errors/app-error.ts
export class AppError extends Error {
  constructor(message: string, public statusCode = 400) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
```

---

## 5. Bài tập

### 🟢 Cấp độ 1: Module `product` với CRUD
Tạo module `product` với `repository`, `service`, và `controller`, hỗ trợ CRUD đơn giản.

**Lời giải**:
```typescript
// src/shared/types/product.ts
export type Product = {
  id: string;
  name: string;
  price: number;
};
```

```typescript
// src/modules/product/repository.ts
import type { Product } from '../../shared/types/product';

export class ProductRepository {
  private products: Product[] = [];

  getById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  create(product: Product): void {
    this.products.push(product);
  }

  getAll(): Product[] {
    return [...this.products];
  }

  update(id: string, data: Partial<Product>): boolean {
    const product = this.getById(id);
    if (!product) return false;
    Object.assign(product, data);
    return true;
  }

  delete(id: string): boolean {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }
}
```

```typescript
// src/modules/product/service.ts
import { ProductRepository } from './repository';
import type { Product } from '../../shared/types/product';

export class ProductService {
  constructor(private repo: ProductRepository) {}

  addProduct(product: Product) {
    if (this.repo.getById(product.id)) {
      throw new Error('Product already exists');
    }
    this.repo.create(product);
  }

  getProduct(id: string): Product | undefined {
    return this.repo.getById(id);
  }

  listProducts(): Product[] {
    return this.repo.getAll();
  }

  updateProduct(id: string, data: Partial<Product>) {
    if (!this.repo.update(id, data)) {
      throw new Error('Product not found');
    }
  }

  removeProduct(id: string) {
    if (!this.repo.delete(id)) {
      throw new Error('Product not found');
    }
  }
}
```

```typescript
// src/modules/product/controller.ts
import { ProductService } from './service';
import { ProductRepository } from './repository';

const repo = new ProductRepository();
const service = new ProductService(repo);

// Thêm sản phẩm
service.addProduct({ id: 'p1', name: 'Laptop', price: 1500 });
service.addProduct({ id: 'p2', name: 'Phone', price: 800 });

// Lấy sản phẩm
console.log(service.getProduct('p1'));
// Output: { id: 'p1', name: 'Laptop', price: 1500 }

// Danh sách sản phẩm
console.log(service.listProducts());
// Output: [
//   { id: 'p1', name: 'Laptop', price: 1500 },
//   { id: 'p2', name: 'Phone', price: 800 }
// ]

// Cập nhật sản phẩm
service.updateProduct('p1', { price: 1400 });
console.log(service.getProduct('p1'));
// Output: { id: 'p1', name: 'Laptop', price: 1400 }

// Xóa sản phẩm
service.removeProduct('p2');
console.log(service.listProducts());
// Output: [{ id: 'p1', name: 'Laptop', price: 1400 }]
```

**Kết quả**:
- **SRP**: `ProductRepository` chỉ quản lý dữ liệu, `ProductService` chỉ xử lý logic.
- **OCP**: Có thể thay `ProductRepository` bằng DB khác mà không sửa service.
- **Separation of Concerns**: Controller chỉ gọi service, không thao tác trực tiếp với dữ liệu.

### 🟡 Cấp độ 2: Thêm Validation Schema & Shared Lib
Thêm validation bằng **Zod** và tách shared lib (`types`, `validation`).

**Lời giải**:
```typescript
// src/shared/validation/product.ts
import { z } from 'zod';
import type { Product } from '../types/product';

export const ProductSchema = z.object({
  id: z.string().min(1, 'ID không được để trống'),
  name: z.string().min(1, 'Tên sản phẩm không được để trống'),
  price: z.number().positive('Giá phải lớn hơn 0'),
});
```

```typescript
// src/modules/product/service.ts
import { ProductRepository } from './repository';
import type { Product } from '../../shared/types/product';
import { ProductSchema } from '../../shared/validation/product';

export class ProductService {
  constructor(private repo: ProductRepository) {}

  addProduct(product: Product) {
    const result = ProductSchema.safeParse(product);
    if (!result.success) {
      throw new Error('Invalid product data: ' + JSON.stringify(result.error.errors));
    }
    if (this.repo.getById(product.id)) {
      throw new Error('Product already exists');
    }
    this.repo.create(product);
  }

  // Các method khác giữ nguyên...
}
```

**Kết quả**:
- **Zod validation**: Đảm bảo dữ liệu hợp lệ cả compile-time (với `Product`) và runtime (với `ProductSchema`).
- **Shared lib**: `validation` và `types` được đặt trong `shared`, có thể dùng cho cả frontend và backend.

### 🔴 Cấp độ 3: Mini-Enterprise App (`user` + `order`)
Xây dựng ứng dụng với 2 module (`user`, `order`), sử dụng DI, shared types, validation, và đảm bảo SOLID principles.

**Cấu trúc thư mục**:
```
src/
├── modules/
│   ├── user/
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   ├── repository.ts
│   │   └── types.ts
│   └── order/
│       ├── controller.ts
│       ├── service.ts
│       ├── repository.ts
│       └── types.ts
├── shared/
│   ├── types/
│   ├── validation/
│   └── errors/
├── container.ts
└── app.ts
```

**Lời giải**:
#### Shared Types & Validation
```typescript
// src/shared/types/user.ts
export type User = {
  id: string;
  name: string;
  email: string;
};

// src/shared/types/order.ts
export type Order = {
  id: string;
  userId: string;
  productIds: string[];
  total: number;
};

// src/shared/validation/user.ts
import { z } from 'zod';
export const UserSchema = z.object({
  id: z.string().min(1, 'ID không được để trống'),
  name: z.string().min(1, 'Tên không được để trống'),
  email: z.string().email('Email không hợp lệ'),
});

// src/shared/validation/order.ts
import { z } from 'zod';
export const OrderSchema = z.object({
  id: z.string().min(1, 'ID không được để trống'),
  userId: z.string().min(1, 'User ID không được để trống'),
  productIds: z.array(z.string().min(1)).nonempty('Danh sách sản phẩm không được rỗng'),
  total: z.number().nonnegative('Tổng tiền phải >= 0'),
});

// src/shared/errors/app-error.ts
export class AppError extends Error {
  constructor(message: string, public statusCode = 400) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
```

#### User Module
```typescript
// src/modules/user/repository.ts
import type { User } from '../../shared/types/user';

export class UserRepository {
  private users: User[] = [];

  getById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  create(user: User): void {
    this.users.push(user);
  }

  getAll(): User[] {
    return [...this.users];
  }
}
```

```typescript
// src/modules/user/service.ts
import { UserRepository } from './repository';
import { UserSchema } from '../../shared/validation/user';
import type { User } from '../../shared/types/user';
import { AppError } from '../../shared/errors/app-error';

export class UserService {
  constructor(private repo: UserRepository) {}

  addUser(user: User) {
    const result = UserSchema.safeParse(user);
    if (!result.success) {
      throw new AppError('Invalid user data: ' + JSON.stringify(result.error.errors));
    }
    if (this.repo.getById(user.id)) {
      throw new AppError('User already exists', 409);
    }
    this.repo.create(user);
  }

  getUser(id: string): User | undefined {
    return this.repo.getById(id);
  }

  listUsers(): User[] {
    return this.repo.getAll();
  }
}
```

#### Order Module
```typescript
// src/modules/order/repository.ts
import type { Order } from '../../shared/types/order';

export class OrderRepository {
  private orders: Order[] = [];

  create(order: Order): void {
    this.orders.push(order);
  }

  getAll(): Order[] {
    return [...this.orders];
  }

  getByUserId(userId: string): Order[] {
    return this.orders.filter(o => o.userId === userId);
  }
}
```

```typescript
// src/modules/order/service.ts
import { OrderRepository } from './repository';
import { OrderSchema } from '../../shared/validation/order';
import type { Order } from '../../shared/types/order';
import type { UserService } from '../user/service';
import { AppError } from '../../shared/errors/app-error';

export class OrderService {
  constructor(private repo: OrderRepository, private userService: UserService) {}

  placeOrder(order: Order) {
    const result = OrderSchema.safeParse(order);
    if (!result.success) {
      throw new AppError('Invalid order data: ' + JSON.stringify(result.error.errors));
    }

    const user = this.userService.getUser(order.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    this.repo.create(order);
  }

  listOrders(): Order[] {
    return this.repo.getAll();
  }

  listOrdersByUser(userId: string): Order[] {
    return this.repo.getByUserId(userId);
  }
}
```

#### DI Container
```typescript
// src/container.ts
import { UserRepository } from './modules/user/repository';
import { UserService } from './modules/user/service';
import { OrderRepository } from './modules/order/repository';
import { OrderService } from './modules/order/service';

export const userRepo = new UserRepository();
export const userService = new UserService(userRepo);

export const orderRepo = new OrderRepository();
export const orderService = new OrderService(orderRepo, userService);
```

#### App Simulation
```typescript
// src/app.ts
import { userService, orderService } from './container';

// Thêm users
userService.addUser({ id: 'u1', name: 'Alice', email: 'alice@example.com' });
userService.addUser({ id: 'u2', name: 'Bob', email: 'bob@example.com' });

// Danh sách users
console.log(userService.listUsers());
/*
Output: [
  { id: 'u1', name: 'Alice', email: 'alice@example.com' },
  { id: 'u2', name: 'Bob', email: 'bob@example.com' }
]
*/

// Đặt order
orderService.placeOrder({ id: 'o1', userId: 'u1', productIds: ['p1', 'p2'], total: 200 });
orderService.placeOrder({ id: 'o2', userId: 'u2', productIds: ['p3'], total: 50 });

// Danh sách orders
console.log(orderService.listOrders());
/*
Output: [
  { id: 'o1', userId: 'u1', productIds: ['p1', 'p2'], total: 200 },
  { id: 'o2', userId: 'u2', productIds: ['p3'], total: 50 }
]
*/

// Orders theo user
console.log(orderService.listOrdersByUser('u1'));
// Output: [{ id: 'o1', userId: 'u1', productIds: ['p1', 'p2'], total: 200 }]
```

**Kết quả**:
- **SRP**: Mỗi class chỉ làm một việc (repository quản lý data, service xử lý logic).
- **OCP**: Có thể thay repository (ví dụ: dùng MongoDB) mà không sửa service.
- **DIP**: `OrderService` phụ thuộc vào abstraction của `UserService` qua DI.
- **Type-safety**: Types và Zod schemas đảm bảo an toàn cả compile-time và runtime.
- **Modular**: Dễ mở rộng thêm module (`payment`, `shipping`) mà không ảnh hưởng code hiện tại.

---

## 6. Kết luận

- **Clean Code** trong TypeScript giúp code dễ đọc, dễ bảo trì, và giảm lỗi.
- **Layered Architecture** và **Modular Structure** đảm bảo dự án dễ mở rộng và testable.
- **SOLID Principles** giúp thiết kế hệ thống robust, phù hợp cho enterprise.
- **Dependency Injection** và **Shared Libs** tăng tính tái sử dụng và type-safety.
- Day 43 là bước cuối trong **Phase 4**, chuẩn bị cho **Phase 5**: Production-grade systems với API, monorepo, và advanced testing.

---

## 7. Bước tiếp theo

- **Thực hành**: Tích hợp module `user` và `order` vào monorepo (Day 42) với Nx/Turborepo.
- **Khám phá**: Thêm unit tests cho `UserService` và `OrderService` bằng Jest, mock dependencies.
- **Mở rộng**: Tích hợp với **Type-Safe API** (Day 41) để tạo REST endpoints cho `user` và `order`.

Tài liệu này cung cấp một **mini-enterprise app** đầy đủ, áp dụng Clean Code, SOLID, và architecture patterns trong TypeScript. Nếu bạn muốn mở rộng thêm (ví dụ: thêm unit tests hoặc tích hợp với API), hãy cho mình biết nhé! 🚀

---
📌 [<< Ngày 42](./Day42.md) | [Ngày 44 >>](./Day44.md)