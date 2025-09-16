# 📘 Day 22 — TypeScript + React Advanced: Context API & Reducer

## 1️⃣ Mục tiêu

* Sử dụng **Context API** để chia sẻ state giữa nhiều component.
* Dùng **useReducer** để quản lý state phức tạp.
* Type-safe toàn bộ: actions, state, dispatch.
* Enterprise-ready: pattern giống Redux nhưng nhẹ hơn.

---

## 2️⃣ Scenario Enterprise

* App quản lý **Todo List**.
* Nhiều component cần đọc/ghi state Todo.
* Mọi action đều type-safe → compile-time check.
* Dễ mở rộng, maintain và test.

---

## 3️⃣ Định nghĩa Types

```ts
// src/types/todo.d.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

// State cho reducer
export interface TodoState {
  todos: Todo[];
}

// Action types
export type TodoAction =
  | { type: "ADD_TODO"; payload: { title: string } }
  | { type: "TOGGLE_TODO"; payload: { id: string } }
  | { type: "REMOVE_TODO"; payload: { id: string } };
```

**Enterprise lessons:**

* Union type cho actions → TS kiểm tra exhaustiveness → tránh bỏ case.

---

## 4️⃣ Reducer

```ts
// src/context/todoReducer.ts
import { TodoState, TodoAction, Todo } from "../types/todo";
import { v4 as uuidv4 } from "uuid";

export function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case "ADD_TODO": {
      const newTodo: Todo = { id: uuidv4(), title: action.payload.title, completed: false };
      return { ...state, todos: [...state.todos, newTodo] };
    }
    case "TOGGLE_TODO": {
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? { ...todo, completed: !todo.completed } : todo
        ),
      };
    }
    case "REMOVE_TODO": {
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.id),
      };
    }
    default: {
      // TS exhaustiveness check
      const _: never = action;
      return state;
    }
  }
}
```

**Enterprise lessons:**

* Reducer type-safe → tất cả action đều phải được định nghĩa trong `TodoAction`.
* `default` với `never` → TS báo nếu thêm action mới mà quên handle.

---

## 5️⃣ Context

```ts
// src/context/TodoContext.tsx
import React, { createContext, useReducer, Dispatch } from "react";
import { TodoState, TodoAction, Todo } from "../types/todo";
import { todoReducer } from "./todoReducer";

interface TodoContextProps {
  state: TodoState;
  dispatch: Dispatch<TodoAction>;
}

const initialState: TodoState = { todos: [] };

export const TodoContext = createContext<TodoContextProps>({
  state: initialState,
  dispatch: () => undefined, // default
});

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};
```

**Enterprise lessons:**

* Context provider bao bọc app → mọi component con truy cập state & dispatch type-safe.
* Dễ mở rộng với nhiều reducer / context khác.

---

## 6️⃣ Sử dụng Context trong Component

```tsx
// src/components/TodoApp.tsx
import React, { useContext, useState } from "react";
import { TodoContext } from "../context/TodoContext";

const TodoApp: React.FC = () => {
  const { state, dispatch } = useContext(TodoContext);
  const [title, setTitle] = useState("");

  const addTodo = () => {
    if (title.trim() === "") return;
    dispatch({ type: "ADD_TODO", payload: { title } });
    setTitle("");
  };

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="New todo"
      />
      <button onClick={addTodo}>Add</button>

      <ul>
        {state.todos.map(todo => (
          <li key={todo.id}>
            <span
              style={{ textDecoration: todo.completed ? "line-through" : "none" }}
              onClick={() => dispatch({ type: "TOGGLE_TODO", payload: { id: todo.id } })}
            >
              {todo.title}
            </span>
            <button onClick={() => dispatch({ type: "REMOVE_TODO", payload: { id: todo.id } })}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
```

---

## 7️⃣ App Wrapper

```tsx
// src/App.tsx
import React from "react";
import { TodoProvider } from "./context/TodoContext";
import TodoApp from "./components/TodoApp";

const App: React.FC = () => {
  return (
    <TodoProvider>
      <TodoApp />
    </TodoProvider>
  );
};

export default App;
```

---

## 8️⃣ Enterprise lessons

1. **Type-safe state management** → giảm lỗi runtime.
2. **Reducer pattern** → giống Redux, dễ maintain, test.
3. **Context API** → chia sẻ state giữa nhiều component.
4. **Exhaustiveness check** → khi thêm action mới, TS báo compile-time nếu quên handle.
5. Có thể mở rộng: async actions (middleware), API fetch, caching, logging.

---

## 9️⃣ Bài tập luyện tập

### Level 1

* Tạo context `ProductContext` cho state `{ products: Product[] }`.

### Level 2

* Dùng reducer để add/remove product.
* Viết các action type-safe.

### Level 3

* Fetch products từ API trong context, lưu state và handle error/loading type-safe.
* Sử dụng Result Pattern + reducer + context → enterprise pattern hoàn chỉnh.


---


### 🔹 Level 1 — ProductContext

```ts
// src/context/ProductContext.tsx
import React, { createContext, useState, ReactNode } from "react";

// Type cho product
export interface Product {
  id: number;
  name: string;
  price: number;
}

// Type cho context
interface ProductContextProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

// Giá trị mặc định
const defaultValue: ProductContextProps = {
  products: [],
  setProducts: () => undefined, // default noop
};

// Tạo context
export const ProductContext = createContext<ProductContextProps>(defaultValue);

// Provider component
export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  return (
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
};
```

**Enterprise use:**

* Type-safe state & setter.
* Dễ mở rộng với nhiều product attributes.

---

### 🔹 Level 2 — Reducer để add/remove product

```ts
// src/context/productReducer.ts
import { Product } from "./ProductContext";

export type ProductAction =
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "REMOVE_PRODUCT"; payload: { id: number } };

export function productReducer(state: Product[], action: ProductAction): Product[] {
  switch (action.type) {
    case "ADD_PRODUCT":
      return [...state, action.payload];
    case "REMOVE_PRODUCT":
      return state.filter(p => p.id !== action.payload.id);
    default:
      const _: never = action; // exhaustiveness check
      return state;
  }
}
```

**Enterprise lessons:**

* Reducer type-safe → tất cả action phải khai báo trong `ProductAction`.
* Dễ maintain khi app phức tạp.

---

### 🔹 Level 3 — Context + Reducer + API fetch

### 1️⃣ Types

```ts
// src/types/api.ts
export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export interface Product {
  id: number;
  name: string;
  price: number;
}
```

### 2️⃣ Service

```ts
// src/services/productService.ts
import axios, { AxiosResponse } from "axios";
import { Product, Result } from "../types/api";

export async function fetchProducts(): Promise<Result<Product[], string>> {
  try {
    const res: AxiosResponse<Product[]> = await axios.get(
      "https://mockapi.io/products"
    );
    return { ok: true, value: res.data };
  } catch (err) {
    return { ok: false, error: "NETWORK_ERROR" };
  }
}
```

### 3️⃣ Context + Reducer

```ts
// src/context/ProductContextReducer.tsx
import React, { createContext, useReducer, ReactNode, useEffect } from "react";
import { Product, Result } from "../types/api";
import { fetchProducts } from "../services/productService";

type ProductAction =
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "REMOVE_PRODUCT"; payload: { id: number } };

function reducer(state: Product[], action: ProductAction): Product[] {
  switch (action.type) {
    case "SET_PRODUCTS":
      return action.payload;
    case "ADD_PRODUCT":
      return [...state, action.payload];
    case "REMOVE_PRODUCT":
      return state.filter(p => p.id !== action.payload.id);
    default:
      const _: never = action; // exhaustiveness check
      return state;
  }
}

interface ContextProps {
  products: Product[];
  dispatch: React.Dispatch<ProductAction>;
}

export const ProductContext = createContext<ContextProps>({
  products: [],
  dispatch: () => undefined,
});

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, dispatch] = useReducer(reducer, []);

  // Fetch data khi mount
  useEffect(() => {
    const load = async () => {
      const result: Result<Product[], string> = await fetchProducts();
      if (result.ok) {
        dispatch({ type: "SET_PRODUCTS", payload: result.value });
      } else {
        console.error("Error fetching products:", result.error);
      }
    };
    load();
  }, []);

  return (
    <ProductContext.Provider value={{ products, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};
```

**Enterprise lessons:**

* Typed API fetch → safe.
* Reducer + context pattern → scalable.
* Error logging chuẩn enterprise.
* Dễ mở rộng middleware, caching, async actions.

---

### 🔹 Sử dụng trong Component

```tsx
// src/components/ProductList.tsx
import React, { useContext } from "react";
import { ProductContext } from "../context/ProductContextReducer";

const ProductList: React.FC = () => {
  const { products, dispatch } = useContext(ProductContext);

  return (
    <div>
      <h2>Products</h2>
      {products.map(p => (
        <div key={p.id}>
          {p.name} - ${p.price}
          <button onClick={() => dispatch({ type: "REMOVE_PRODUCT", payload: { id: p.id } })}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
```

---
[<< Ngày 21](./Day21.md) | [Ngày 23 >>](./Day23.md)