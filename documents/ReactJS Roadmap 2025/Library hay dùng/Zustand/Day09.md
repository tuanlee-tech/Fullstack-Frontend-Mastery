# 🟩 Day 9: Zustand + React Query Integration

---

## 1. Why Combine Zustand & React Query?

### Tại sao cần kết hợp Zustand & React Query?

* **Zustand**: Local/UI state → modal, theme, sidebar, filter, cart.
* **React Query**: Server state → fetch API, caching, retry, sync with backend.

🎯 Rule of Thumb:

* **Server state → React Query**
* **UI/Local state → Zustand**

Trong dự án enterprise, hầu hết team đều dùng pattern này vì nó:

* Giúp state **phân lớp rõ ràng** (UI vs Server).
* Tránh việc Zustand phải gánh cả API caching.
* Dev mới dễ hiểu boundaries hơn → onboard nhanh.

---

## 2. Example: Todo App with Zustand + React Query

```tsx
// api/todos.ts
export const fetchTodos = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
};
```

```tsx
// stores/uiStore.ts (UI State with Zustand)
import { create } from "zustand";

type UIState = {
  selectedTodo: number | null;
  setSelectedTodo: (id: number | null) => void;
};

export const useUIStore = create<UIState>((set) => ({
  selectedTodo: null,
  setSelectedTodo: (id) => set({ selectedTodo: id }),
}));
```

```tsx
// App.tsx
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { fetchTodos } from "./api/todos";
import { useUIStore } from "./stores/uiStore";

const queryClient = new QueryClient();

function TodoList() {
  const { data, isLoading, error } = useQuery({ queryKey: ["todos"], queryFn: fetchTodos });
  const selectedTodo = useUIStore((s) => s.selectedTodo);
  const setSelectedTodo = useUIStore((s) => s.setSelectedTodo);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <ul>
      {data.map((todo: any) => (
        <li
          key={todo.id}
          style={{ fontWeight: selectedTodo === todo.id ? "bold" : "normal", cursor: "pointer" }}
          onClick={() => setSelectedTodo(todo.id)}
        >
          {todo.title}
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoList />
    </QueryClientProvider>
  );
}
```

---

## 3. Tradeoffs & Patterns

| Case                      | Store in Zustand | Store in React Query | Lý do                        |
| ------------------------- | ---------------- | -------------------- | ---------------------------- |
| Modal open/close          | ✅                | ❌                    | Chỉ liên quan UI             |
| Theme / Language          | ✅                | ❌                    | Không cần fetch API          |
| Auth token                | ✅ (persist)      | ❌                    | Persist ở localStorage       |
| Fetch todos (server data) | ❌                | ✅                    | React Query có cache, retry  |
| Infinite scroll list      | ❌                | ✅                    | Query có pagination, refetch |

---

## 4. Pitfalls 🚨

* **Sai lầm 1**: Đưa cả server state vào Zustand → mất hết caching, refetch.
* **Sai lầm 2**: Dùng React Query cho UI state (modal, theme) → overkill.
* **Sai lầm 3**: Không phân ranh giới rõ ràng → codebase dễ loạn.

---

## 5. Interview Questions

1. Why not just use Zustand for API data?
2. How does React Query handle caching differently from Zustand?
3. In what cases should you persist Zustand state but not React Query state?
4. What’s the tradeoff between colocating UI state in React components vs global Zustand store?


---

📌 [<< Ngày 08](./Day08.md) | [Ngày 10 >>](./Day10.md)