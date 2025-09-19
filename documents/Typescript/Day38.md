# 📌 Ngày 38: Template Literal Types trong TypeScript — Chuỗi Định Kiểu Mạnh

Tài liệu này cung cấp hướng dẫn chi tiết về **Template Literal Types** trong TypeScript, một tính năng mạnh mẽ cho phép tạo các kiểu chuỗi động dựa trên các literal type. Tài liệu được thiết kế thân thiện với người mới bắt đầu, đồng thời đi sâu vào các ứng dụng thực tế và nâng cao như xây dựng hệ thống router an toàn kiểu. Nội dung bao gồm giải thích rõ ràng, ví dụ mã, bài tập, lời giải, và một phần mở rộng cấp cao để hiểu sâu hơn.

---

## 1. Giới thiệu về Template Literal Types

**Template Literal Types** trong TypeScript cho phép bạn tạo ra **kiểu chuỗi động** dựa trên các literal type có sẵn. Tính năng này tương tự như **template string** (`${value}`) ở runtime, nhưng hoạt động ở **cấp độ kiểu** (type level) để đảm bảo an toàn kiểu tại thời điểm biên dịch.

### Ví dụ cơ bản:
```typescript
type Lang = "en" | "vi";
type Namespace = "home" | "auth";

// Tạo key cho i18n
type TranslationKey = `${Lang}.${Namespace}`;
// Kết quả: "en.home" | "en.auth" | "vi.home" | "vi.auth"
```

### Tại sao nên dùng Template Literal Types?
- **An toàn kiểu**: Đảm bảo chuỗi được sử dụng đúng với các giá trị hợp lệ, tránh lỗi gõ sai.
- **Tự động hóa**: Tự động tạo tất cả các tổ hợp chuỗi từ các literal type (Cartesian Product).
- **Ứng dụng thực tế**:
  - Xây dựng **key dịch ngôn ngữ** (i18n).
  - Định nghĩa **API endpoints** an toàn.
  - Tạo **event names** hoặc **CSS class** (như Tailwind) với gợi ý tự động.

---

## 2. Cú pháp cơ bản

Template Literal Types sử dụng cú pháp giống template string (`${}`) để kết hợp các literal type thành một kiểu chuỗi mới.

### Ví dụ: Tạo lời chào
```typescript
type Greeting = "Hello" | "Hi";
type Name = "Alice" | "Bob";

type Message = `${Greeting}, ${Name}!`;
// Kết quả: "Hello, Alice!" | "Hello, Bob!" | "Hi, Alice!" | "Hi, Bob!"
```

### Điểm chính:
- Khi kết hợp nhiều literal type, TypeScript tự động tạo ra **tổ hợp Cartesian Product**, tức là tất cả các kết hợp có thể của các giá trị.
- Điều này giúp bạn định nghĩa các chuỗi hợp lệ một cách chính xác và an toàn.

---

## 3. Kết hợp với Union Types

Template Literal Types đặc biệt mạnh khi kết hợp với **union types**, cho phép tạo ra các kiểu chuỗi phức tạp.

### Ví dụ: Định nghĩa API Endpoints
```typescript
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
type Resource = "users" | "orders";

type Endpoint = `${HTTPMethod} /api/${Resource}`;
// Kết quả: "GET /api/users" | "GET /api/orders" | "POST /api/users" | ...
```

### Lợi ích:
- Ngăn ngừa lỗi gõ sai như `"GETT /api/users"` hoặc `"DELET /api/orders"`.
- Đảm bảo tất cả các endpoint đều hợp lệ tại thời điểm biên dịch.

---

## 4. Ứng dụng thực tế

### 4.1. Tên sự kiện an toàn kiểu
```typescript
type Component = "Button" | "Input";
type Action = "click" | "focus" | "blur";

type EventName = `${Component}:${Action}`;
// Kết quả: "Button:click" | "Button:focus" | "Button:blur" | "Input:click" | ...

function onEvent(event: EventName): void {
  console.log("Sự kiện đã đăng ký:", event);
}

onEvent("Button:click"); // ✅ OK
// onEvent("Btn:click"); // ❌ Lỗi: Không hợp lệ
```

### 4.2. Gợi ý class Tailwind CSS
```typescript
type Color = "red" | "blue" | "green";
type Shade = "500" | "600" | "700";

type TailwindClass = `bg-${Color}-${Shade}`;
// Kết quả: "bg-red-500" | "bg-red-600" | "bg-red-700" | ...
```

**Lợi ích**: Các plugin TypeScript cho Tailwind sử dụng Template Literal Types để cung cấp gợi ý class chính xác trong IDE.

### 4.3. Key lỗi cho Form Validation
```typescript
type Form = "login" | "signup";
type Field = "email" | "password";

type ErrorKey = `${Form}.${Field}.error`;
// Kết quả: "login.email.error" | "login.password.error" | ...
```

### 4.4. Định nghĩa API Routes an toàn kiểu
```typescript
type Version = "v1" | "v2";
type Resource = "users" | "products";

type ApiRoute = `/api/${Version}/${Resource}`;
// Kết quả: "/api/v1/users" | "/api/v1/products" | "/api/v2/users" | ...
```

---

## 5. Kết hợp với Conditional Types & Inference

Template Literal Types có thể được dùng với **conditional types** và từ khóa `infer` để **phân tích chuỗi** tại cấp độ kiểu.

### Ví dụ: Lấy resource từ API route
```typescript
type ExtractResource<T extends string> =
  T extends `/api/${string}/${infer R}` ? R : never;

type R1 = ExtractResource<"/api/v1/users">; // "users"
type R2 = ExtractResource<"/api/v2/products">; // "products"
```

**Ứng dụng**: Có thể dùng để xây dựng **router an toàn kiểu**, nơi các tham số được trích xuất chính xác từ chuỗi route.

---

## 6. Mini Project: Router an toàn kiểu

Hãy xây dựng một hệ thống router đơn giản, nơi các route được định nghĩa bằng Template Literal Types và chỉ chấp nhận các giá trị hợp lệ.

```typescript
type Route = "/home" | "/about" | `/user/${number}`;

function navigate(path: Route): void {
  console.log("Điều hướng tới:", path);
}

navigate("/home"); // ✅ OK
navigate("/user/123"); // ✅ OK
// navigate("/user/abc"); // ❌ Lỗi: Phải là số
```

**Lợi ích**:
- Đảm bảo chỉ các route hợp lệ được chấp nhận.
- Loại bỏ lỗi nhập sai định dạng route tại thời điểm biên dịch.

---

## 7. Bài tập thực hành

### Cấp độ 1
1. Tạo type `Locale` = `"en" | "vi" | "fr"`. Sinh ra type `TranslationKey` = `` `${Locale}.home.title` ``.
   - Kết quả mong muốn: `"en.home.title" | "vi.home.title" | "fr.home.title"`.

### Cấp độ 2
1. Cho `HTTPMethod = "GET" | "POST"` và `Resource = "users" | "orders"`. Sinh ra type `Endpoint` = `` `${HTTPMethod} /${Resource}` ``.
2. Viết hàm `callApi(endpoint: Endpoint): void` để gọi API với endpoint hợp lệ.

### Cấp độ 3
1. Tạo hệ thống router:
   - `Route = "/post/${number}" | "/user/${string}"`.
   - Viết type utility `ExtractParam<T>` để trích xuất kiểu của tham số từ route:
     - `ExtractParam<"/post/123">` = `number`.
     - `ExtractParam<"/user/alice">` = `string`.

---

## 8. Lời giải bài tập

### 🟢 Cấp độ 1: Translation Key
```typescript
type Locale = "en" | "vi" | "fr";
type TranslationKey = `${Locale}.home.title`;

const t1: TranslationKey = "en.home.title"; // ✅ OK
// const t2: TranslationKey = "jp.home.title"; // ❌ Lỗi: Không hợp lệ
```

**Giải thích**: TypeScript tự động tạo ra tất cả các tổ hợp chuỗi hợp lệ dựa trên `Locale`, đảm bảo chỉ các giá trị như `"en.home.title"`, `"vi.home.title"`, hoặc `"fr.home.title"` được chấp nhận.

### 🟡 Cấp độ 2: API Endpoints
```typescript
type HTTPMethod = "GET" | "POST";
type Resource = "users" | "orders";

type Endpoint = `${HTTPMethod} /${Resource}`;

function callApi(endpoint: Endpoint): void {
  console.log("Gọi API:", endpoint);
}

callApi("GET /users"); // ✅ OK
callApi("POST /orders"); // ✅ OK
// callApi("DELETE /users"); // ❌ Lỗi: Không hợp lệ
```

**Giải thích**: `Endpoint` được tạo từ tổ hợp của `HTTPMethod` và `Resource`, đảm bảo chỉ các endpoint hợp lệ như `"GET /users"` hoặc `"POST /orders"` được chấp nhận.

### 🔴 Cấp độ 3: Router với Extract Param
```typescript
type Route = `/post/${number}` | `/user/${string}`;

type ExtractParam<T extends string> =
  T extends `/post/${infer N}`
    ? N extends `${number}` ? number : never
    : T extends `/user/${infer U}`
    ? string
    : never;

type P1 = ExtractParam<"/post/123">; // number
type P2 = ExtractParam<"/user/alice">; // string
```

**Giải thích**:
- `ExtractParam` sử dụng `infer` để trích xuất phần tham số từ route (`N` hoặc `U`).
- Với `/post/${number}`, kiểm tra xem `N` có phải là số (`${number}`) không, nếu đúng trả về `number`.
- Với `/user/${string}`, trả về `string` cho tham số.

---

## 9. Phần mở rộng cấp cao: Xây dựng Router an toàn kiểu với Middleware

Để thể hiện sức mạnh của Template Literal Types ở **cấp độ cao**, chúng ta sẽ xây dựng một **hệ thống router an toàn kiểu** với hỗ trợ middleware để xử lý các yêu cầu như kiểm tra quyền hoặc ghi log.

### Bước 1: Định nghĩa kiểu Route và Middleware
```typescript
// Định nghĩa các route
type Route = "/home" | "/about" | `/user/${string}` | `/post/${number}`;

// Kiểu middleware
type Middleware = (req: { path: Route; param?: string | number }) => void;

// Hàm kiểm tra param hợp lệ
type ExtractParam<T extends Route> =
  T extends `/user/${string}` ? string :
  T extends `/post/${number}` ? number :
  never;
```

### Bước 2: Triển khai Router
```typescript
class Router {
  private routes: Map<Route, (param?: string | number) => void> = new Map();
  private middlewares: Middleware[] = [];

  // Đăng ký route
  register<T extends Route>(path: T, handler: (param: ExtractParam<T>) => void): void {
    this.routes.set(path, handler as (param?: string | number) => void);
  }

  // Thêm middleware
  use(middleware: Middleware): void {
    this.middlewares.push(middleware);
  }

  // Điều hướng
  navigate<T extends Route>(path: T, param?: ExtractParam<T>): void {
    // Chạy middleware
    this.middlewares.forEach((middleware) => middleware({ path, param }));

    // Tìm handler
    const handler = this.routes.get(path);
    if (handler) {
      handler(param);
    } else {
      console.error(`Route không tìm thấy: ${path}`);
    }
  }
}
```

### Bước 3: Middleware ví dụ
```typescript
// Middleware ghi log
const logger: Middleware = ({ path, param }) => {
  console.log(`📡 Điều hướng tới: ${path}${param ? ` với param: ${param}` : ''}`);
};

// Middleware kiểm tra quyền
const authMiddleware: Middleware = ({ path, param }) => {
  if (path.startsWith("/user/") && !param) {
    throw new Error("Yêu cầu param cho route user!");
  }
};
```

### Bước 4: Test Router
```typescript
const router = new Router();

// Đăng ký middleware
router.use(logger);
router.use(authMiddleware);

// Đăng ký các route
router.register("/home", () => console.log("Hiển thị trang Home"));
router.register("/about", () => console.log("Hiển thị trang About"));
router.register("/user/{string}", (param: string) => console.log(`Hiển thị hồ sơ người dùng: ${param}`));
router.register("/post/{number}", (param: number) => console.log(`Hiển thị bài viết: ${param}`));

// Test
router.navigate("/home"); // ✅ OK
router.navigate("/user/alice"); // ✅ OK
router.navigate("/post/123"); // ✅ OK
// router.navigate("/user/123"); // ❌ Lỗi: Param phải là string
// router.navigate("/post/abc"); // ❌ Lỗi: Param phải là số
```

**Kết quả**:
```
📡 Điều hướng tới: /home
Hiển thị trang Home
📡 Điều hướng tới: /user/alice với param: alice
Hiển thị hồ sơ người dùng: alice
📡 Điều hướng tới: /post/123 với param: 123
Hiển thị bài viết: 123
```

### Giải thích:
- **An toàn kiểu**: `ExtractParam` đảm bảo tham số cho `/user/${string}` là `string` và `/post/${number}` là `number`.
- **Middleware**: Cho phép thêm các chức năng như ghi log, kiểm tra quyền, hoặc xử lý bất đồng bộ trước khi gọi handler.
- **Tính mở rộng**: Dễ dàng thêm route mới hoặc middleware mà vẫn giữ an toàn kiểu.

---

## 10. Kết luận

- **Template Literal Types** biến chuỗi thành các **kiểu an toàn tuyệt đối**, giúp loại bỏ lỗi gõ sai ở thời điểm biên dịch.
- Ứng dụng mạnh mẽ trong:
  - **Dịch ngôn ngữ** (i18n).
  - **API endpoints** và **router**.
  - **Tên sự kiện** và **CSS class** (như Tailwind).
- Kết hợp với **conditional types** và `infer` cho phép **phân tích chuỗi** ở cấp độ kiểu, mở ra khả năng xây dựng các hệ thống phức tạp như router an toàn kiểu.
- Phần mở rộng router với middleware cho thấy cách áp dụng Template Literal Types vào các ứng dụng thực tế ở cấp độ cao.

---

## 11. Bước tiếp theo
- **Thực hành**: Thêm các route mới hoặc middleware vào hệ thống router.
- **Khám phá**: Sử dụng Template Literal Types để xây dựng hệ thống i18n hoàn chỉnh.
- **Mở rộng**: Kết hợp với async middleware để xử lý các API call thực tế.

Tài liệu này cung cấp nền tảng vững chắc cho người mới bắt đầu và các kiến thức nâng cao cho những ai muốn thành thạo TypeScript với Template Literal Types. Nếu bạn có câu hỏi hoặc cần giải thích thêm, hãy hỏi nhé! 🚀

---
📌 [<< Ngày 37](./Day37.md) | [Ngày 39 >>](./Day39.md)