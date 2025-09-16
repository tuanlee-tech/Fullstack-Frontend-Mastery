# 📘 Day 21 — TypeScript với React: Props, State, Hooks

## 1️⃣ Mục tiêu

* Hiểu cách dùng **interface/type** cho Props và State.
* Dùng **React Hooks** (useState, useEffect) với TypeScript.
* Type-safe toàn bộ component.
* Enterprise-ready: tránh bug runtime khi nhận dữ liệu từ API hoặc từ parent component.

---

## 2️⃣ Setup Project

```bash
npx create-react-app ts-react-app --template typescript
cd ts-react-app
npm start
```

* TS template tự cấu hình `tsconfig.json`.
* File `.tsx` sẽ có type checking.

---

## 3️⃣ Type Props

```tsx
// src/components/UserCard.tsx

import React from "react";

// Interface định nghĩa props
interface UserCardProps {
  id: number;
  name: string;
  email?: string; // optional prop
}

// Function Component với generic type React.FC<UserCardProps>
const UserCard: React.FC<UserCardProps> = ({ id, name, email }) => {
  return (
    <div>
      <h3>{name} (ID: {id})</h3>
      {email && <p>Email: {email}</p>} {/* Hiển thị nếu email tồn tại */}
    </div>
  );
};

export default UserCard;
```

**Enterprise use:**

* Props type-safe → IDE cảnh báo nếu parent component truyền sai kiểu.
* Optional props giúp linh hoạt trong UI.

---

## 4️⃣ Type State với useState

```tsx
import React, { useState } from "react";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

const TodoApp: React.FC = () => {
  // useState với generic type <Todo[]>
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (title: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
    };
    setTodos(prev => [...prev, newTodo]);
  };

  return (
    <div>
      <button onClick={() => addTodo("Learn TS + React")}>Add Todo</button>
      {todos.map(todo => (
        <div key={todo.id}>
          {todo.title} - {todo.completed ? "Done" : "Pending"}
        </div>
      ))}
    </div>
  );
};

export default TodoApp;
```

**Enterprise use:**

* State type-safe → tránh bug khi setState.
* TS giúp autocomplete khi update state.

---

## 5️⃣ useEffect với API

```tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get<User[]>("https://jsonplaceholder.typicode.com/users");
        setUsers(res.data); // TS biết res.data là User[]
      } catch (err) {
        console.error("Error fetching users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};

export default UserList;
```

**Enterprise use:**

* Typed API response → giảm bug runtime.
* Loading state type-safe, chuẩn pattern cho enterprise frontend.

---

## 6️⃣ Mini Enterprise Pattern

1. **Typed Props / State / API response**.
2. **Optional / default props** cho linh hoạt UI.
3. **useEffect** với typed API → đảm bảo dữ liệu hợp lệ trước khi render.
4. **Error handling** ở UI → tránh crash.

---

## 7️⃣ Bài tập luyện tập

### Level 1

* Tạo component `ProductCard` với props: `{ id: number; name: string; price: number }`.

### Level 2

* Tạo component `ShoppingCart` với state `items: Product[]` và phương thức `addItem`.

### Level 3

* Fetch danh sách product từ API (JSONPlaceholder hoặc mock API).
* Lưu state vào `items` và hiển thị trong UI.
* Sử dụng Result Pattern kiểu enterprise: `{ ok: true; value: Product[] } | { ok: false; error: string }`.


---

### 🔹 Level 1 — ProductCard Component

```tsx
// src/components/ProductCard.tsx
import React from "react";

// Props type-safe cho component
interface ProductCardProps {
  id: number;
  name: string;
  price: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price }) => {
  return (
    <div style={{ border: "1px solid #ccc", padding: "8px", margin: "4px" }}>
      <h3>{name} (ID: {id})</h3>
      <p>Price: ${price}</p>
    </div>
  );
};

export default ProductCard;
```

**Enterprise use:**

* Type-safe props → khi parent truyền sai type, TS sẽ cảnh báo compile-time.
* Reusable component, dễ maintain và test.

---

### 🔹 Level 2 — ShoppingCart Component with State

```tsx
// src/components/ShoppingCart.tsx
import React, { useState } from "react";
import { ProductCard } from "./ProductCard";

interface Product {
  id: number;
  name: string;
  price: number;
}

const ShoppingCart: React.FC = () => {
  // State typed Product[]
  const [items, setItems] = useState<Product[]>([]);

  // Thêm sản phẩm
  const addItem = (product: Product) => {
    setItems(prev => [...prev, product]);
  };

  return (
    <div>
      <button
        onClick={() => addItem({ id: 1, name: "Laptop", price: 1200 })}
      >
        Add Laptop
      </button>

      <h2>Shopping Cart</h2>
      {items.map(item => (
        <ProductCard key={item.id} {...item} />
      ))}
    </div>
  );
};

export default ShoppingCart;
```

**Enterprise use:**

* State typed → tránh bug khi thêm/sửa item.
* Component tách biệt → dễ test unit & integration.

---

### 🔹 Level 3 — Fetch Product List from API (Result Pattern)

### 1️⃣ Types

```ts
// src/types/api.d.ts
export interface Product {
  id: number;
  name: string;
  price: number;
}

export type Result<T, E> = 
  | { ok: true; value: T }
  | { ok: false; error: E };
```

### 2️⃣ Service Layer

```ts
// src/services/productService.ts
import axios, { AxiosResponse } from "axios";
import { Product, Result } from "../types/api";

export async function fetchProducts(): Promise<Result<Product[], string>> {
  try {
    const res: AxiosResponse<Product[]> = await axios.get(
      "https://mockapi.io/products"
    );
    return { ok: true, value: res.data }; // trả về data nếu thành công
  } catch (err) {
    return { ok: false, error: "NETWORK_ERROR" }; // lỗi mạng
  }
}
```

### 3️⃣ React Component

```tsx
// src/components/ProductList.tsx
import React, { useEffect, useState } from "react";
import { Product, Result } from "../types/api";
import { fetchProducts } from "../services/productService";
import ProductCard from "./ProductCard";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const result: Result<Product[], string> = await fetchProducts();
      setLoading(false);

      if (result.ok) {
        setProducts(result.value); // lưu data vào state
      } else {
        setError(result.error); // lưu error để hiển thị UI
      }
    };

    loadProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {products.map(p => (
        <ProductCard key={p.id} {...p} />
      ))}
    </div>
  );
};

export default ProductList;
```

**Enterprise lessons:**

1. **Typed API response:** TS tự check type từ service → giảm runtime error.
2. **Result pattern:** tránh throw → dễ handle error UI.
3. **Separation of concerns:** Service layer + UI layer tách biệt → dễ maintain, test, và reuse.
4. **State type-safe:** loading, error, data đều có type → UI predictable.



---
[<< Ngày 20](./Day20.md) | [Ngày 22 >>](./Day22.md)