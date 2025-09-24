# 📘 `useFetch` Hook

Một custom React hook để gọi API với các tính năng hiện đại: **AbortController, Debounce, Cache, Refetch** — gọn nhẹ, dễ dùng, thay thế cho axios hoặc TanStack Query trong các trường hợp vừa và nhỏ.

---

## ✨ Tính năng

* ✅ Gọi API tự động khi component mount
* ✅ Hủy request cũ khi có request mới (tránh race condition)
* ✅ Hỗ trợ cache theo URL + body
* ✅ Debounce khi gọi API (ví dụ search input)
* ✅ Hỗ trợ refetch thủ công và force refresh
* ✅ Thêm header Authorization (Bearer token) khi cần
* ✅ Trạng thái rõ ràng: `idle | loading | success | error`

---
## ⚙️ API chi tiết

```ts
useFetch({
  endpoint: string;        // Bắt buộc - endpoint API (VD: "/salon/search")
  params?: object;         // Query string params
  method?: string;         // HTTP method, mặc định "GET"
  body?: object;           // Request body (cho POST/PUT)
  auth?: boolean;          // Nếu true, tự động thêm Bearer token
  enabled?: boolean;       // Nếu false, không auto fetch khi mount
  debounce?: number;       // Thời gian delay trước khi gọi (ms)
  cache?: boolean;         // Bật cache theo URL + body
  onSuccess?: (data) => void; // Callback khi thành công
  onError?: (err) => void;    // Callback khi lỗi
})
```

### Return

```ts
{
  data: any;                   // Kết quả trả về
  error: string | null;        // Lỗi nếu có
  status: "idle" | "loading" | "success" | "error"; // Trạng thái
  loading: boolean;            // true khi đang tải
  refetch: (opt?: { skipCache?: boolean }) => void; // Gọi lại API
  abort: () => void;           // Hủy request hiện tại
}
```
---
## 🚀 Cách dùng

### 1. Import & Setup

```jsx
import { useFetch } from "./hooks/useFetch";
```

### 2. Ví dụ cơ bản

```jsx
function MyComponent() {
  const { data, loading, error } = useFetch({
    endpoint: "/salon/search",
    params: {
      s: "GetSalonCalendarWalkinCheckin",
      salonid: "123",
      day: "9/22/2025",
    },
    auth: true,   // tự động thêm Bearer token
    cache: true,  // bật cache
  });

  if (loading) return <p>⏳ Đang tải...</p>;
  if (error) return <p>❌ Lỗi: {error}</p>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

---

### 3. Refetch thủ công

```jsx
function Refreshable() {
  const { data, loading, error, refetch } = useFetch({
    endpoint: "/salon/search",
    params: { s: "GetSalonInfo", salonid: "123" },
    auth: true,
    enabled: false, // tắt auto fetch
  });

  return (
    <div>
      <button onClick={() => refetch()}>🔄 Tải lại</button>
      {loading && <p>Loading...</p>}
      {error && <p>Lỗi: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

---

### 4. Debounce (search input)

```jsx
function SearchSalon() {
  const [keyword, setKeyword] = useState("");

  const { data, loading } = useFetch({
    endpoint: "/salon/search",
    params: { s: "SearchSalon", q: keyword },
    debounce: 500, // chờ 500ms sau khi nhập mới gọi
    auth: true,
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Nhập tên salon..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      {loading && <p>Đang tìm...</p>}
      {data && <ul>{data.map((d) => <li key={d.id}>{d.name}</li>)}</ul>}
    </div>
  );
}
```

---

### 5. Hủy request

```jsx
function CancelExample() {
  const { data, loading, abort } = useFetch({
    endpoint: "/slow-api",
    auth: true,
  });

  return (
    <div>
      <button onClick={abort}>⛔ Hủy request</button>
      {loading && <p>Đang tải...</p>}
      {data && <p>{JSON.stringify(data)}</p>}
    </div>
  );
}
```

---

## 📌 Khi nào dùng `useFetch`

* Khi cần gọi API nhanh gọn, không setup nặng như axios + interceptor
* Khi muốn có cache tạm thời nhưng không phức tạp như TanStack Query
* Khi cần **hủy request cũ** (search input, auto refresh dashboard)

---
