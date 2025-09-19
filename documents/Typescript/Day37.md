# 📌 Ngày 37: Discriminated Unions trong TypeScript (Ứng dụng trong Redux & Hệ thống Sự kiện)

Tài liệu này cung cấp hướng dẫn chi tiết và đầy đủ về **Discriminated Unions** (hay còn gọi là **Tagged Unions** hoặc **Algebraic Data Types**) trong TypeScript. Tài liệu được thiết kế thân thiện với người mới bắt đầu, đồng thời đi sâu vào các ứng dụng nâng cao như xây dựng **Redux-like Store** từ đầu. Nội dung bao gồm giải thích rõ ràng, ví dụ mã, bài tập, lời giải và phần mở rộng cấp độ cao dành cho người muốn hiểu sâu hơn.

---

## 1. Giới thiệu về Discriminated Unions

**Discriminated Union** là một pattern mạnh mẽ trong TypeScript, cho phép kết hợp nhiều kiểu dữ liệu khác nhau thành một **union type** với một thuộc tính chung (gọi là **discriminator** hoặc **tag**) để phân biệt giữa các kiểu. Điều này giúp TypeScript xác định chính xác kiểu đang được sử dụng, đảm bảo **an toàn kiểu** và giảm lỗi.

### Tại sao nên dùng Discriminated Unions?
- **An toàn kiểu**: TypeScript đảm bảo bạn xử lý tất cả các trường hợp, giảm lỗi runtime.
- **Rõ ràng**: Làm cho mã dễ hiểu và dễ bảo trì.
- **Ứng dụng phổ biến**:
  - **Redux Reducers**: Quản lý thay đổi trạng thái với các action an toàn kiểu.
  - **Hệ thống sự kiện**: Xử lý các loại sự kiện khác nhau (ví dụ: đăng nhập, đăng xuất).
  - **Xử lý lỗi**: Quản lý các loại lỗi với các thuộc tính cụ thể.

---

## 2. Cú pháp cơ bản của Discriminated Unions

Discriminated Union là một tập hợp các kiểu đối tượng, mỗi đối tượng có một thuộc tính chung (ví dụ: `kind` hoặc `type`) với giá trị **literal type** (ví dụ: `"circle"`, `"square"`) để phân biệt.

### Ví dụ: Tính diện tích các hình
```typescript
// Định nghĩa union type Shape với discriminator 'kind'
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "rectangle"; width: number; height: number };

// Hàm tính diện tích dựa trên loại hình
function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
    case "rectangle":
      return shape.width * shape.height;
    default:
      // Kiểm tra đầy đủ (exhaustive check): Đảm bảo xử lý tất cả trường hợp
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}

// Test
console.log(area({ kind: "circle", radius: 5 })); // ~78.54
console.log(area({ kind: "square", side: 4 })); // 16
console.log(area({ kind: "rectangle", width: 3, height: 5 })); // 15
```

### Điểm chính:
- Thuộc tính `kind` đóng vai trò là **discriminator**, giúp TypeScript biết kiểu nào đang được sử dụng trong câu lệnh `switch`.
- Trường hợp `default` với kiểu `never` đảm bảo **kiểm tra đầy đủ**. Nếu thêm một hình mới (ví dụ: `triangle`) vào `Shape` mà không xử lý trong `switch`, TypeScript sẽ báo lỗi biên dịch.

### Lợi ích:
- **An toàn kiểu**: TypeScript thu hẹp kiểu trong mỗi `case`, nên bạn chỉ truy cập các thuộc tính hợp lệ (ví dụ: `radius` cho `circle`).
- **Kiểm tra đầy đủ**: Kiểu `never` phát hiện các trường hợp thiếu ở thời điểm biên dịch.
- **Dễ mở rộng**: Thêm kiểu mới vào union rất dễ dàng.

---

## 3. Ứng dụng trong Redux Reducers

Trong **Redux**, các action là các đối tượng mô tả thay đổi trạng thái. Sử dụng discriminated unions cho các action đảm bảo an toàn kiểu và ngăn ngừa lỗi như truy cập thuộc tính không hợp lệ.

### Ví dụ: Reducer đếm
```typescript
// Định nghĩa các kiểu action với discriminator 'type'
type CounterAction =
  | { type: "increment"; amount: number }
  | { type: "decrement"; amount: number }
  | { type: "reset" };

// Hàm reducer quản lý trạng thái đếm
function counterReducer(state: number, action: CounterAction): number {
  switch (action.type) {
    case "increment":
      return state + action.amount; // TypeScript biết 'amount' tồn tại
    case "decrement":
      return state - action.amount; // TypeScript biết 'amount' tồn tại
    case "reset":
      return 0; // Không cần thuộc tính 'amount'
    default:
      const _never: never = action; // Đảm bảo xử lý tất cả trường hợp
      return state;
  }
}

// Test
console.log(counterReducer(10, { type: "increment", amount: 5 })); // 15
console.log(counterReducer(15, { type: "decrement", amount: 3 })); // 12
console.log(counterReducer(12, { type: "reset" })); // 0
```

### Tại sao dùng Discriminated Unions trong Redux?
- **An toàn kiểu**: Thay vì dùng `any` cho action, discriminated unions đảm bảo chỉ truy cập các thuộc tính hợp lệ.
- **Ngăn lỗi**: Quên xử lý một loại action sẽ gây lỗi biên dịch.
- **Dễ mở rộng**: Thêm action mới dễ dàng và TypeScript buộc xử lý chúng.

---

## 4. Ứng dụng trong Hệ thống Sự kiện

Discriminated unions rất phù hợp cho **hệ thống sự kiện**, nơi các sự kiện khác nhau có thuộc tính riêng nhưng chia sẻ cấu trúc chung.

### Ví dụ: Xử lý sự kiện ứng dụng
```typescript
// Định nghĩa các kiểu sự kiện với discriminator 'type'
type AppEvent =
  | { type: "login"; userId: string }
  | { type: "logout" }
  | { type: "error"; message: string };

// Hàm xử lý sự kiện
function handleEvent(event: AppEvent): void {
  switch (event.type) {
    case "login":
      console.log(`👤 Người dùng đăng nhập: ${event.userId}`);
      break;
    case "logout":
      console.log("👋 Người dùng đăng xuất");
      break;
    case "error":
      console.error(`❌ Lỗi: ${event.message}`);
      break;
    default:
      const _never: never = event; // Kiểm tra đầy đủ
      return _never;
  }
}

// Test
handleEvent({ type: "login", userId: "u123" }); // 👤 Người dùng đăng nhập: u123
handleEvent({ type: "logout" }); // 👋 Người dùng đăng xuất
handleEvent({ type: "error", message: "Mạng lỗi" }); // ❌ Lỗi: Mạng lỗi
```

### Lợi ích trong Hệ thống Sự kiện:
- **Cấu trúc rõ ràng**: Mỗi loại sự kiện có thuộc tính cụ thể, giúp mã dễ hiểu.
- **An toàn kiểu**: TypeScript đảm bảo chỉ truy cập các thuộc tính hợp lệ của sự kiện.
- **Kiểm tra đầy đủ**: Kiểu `never` đảm bảo xử lý tất cả loại sự kiện.

---

## 5. Kiểm tra đầy đủ với `never`

Kiểm tra đầy đủ (**exhaustive checking**) đảm bảo xử lý tất cả các trường hợp có thể trong discriminated union. Bằng cách gán trường hợp `default` cho một biến kiểu `never`, TypeScript sẽ báo lỗi biên dịch nếu thiếu bất kỳ trường hợp nào.

### Ví dụ: Kiểm tra đầy đủ
```typescript
function exhaustiveCheck(x: never): never {
  throw new Error(`Trường hợp chưa xử lý: ${JSON.stringify(x)}`);
}

function processEvent(event: AppEvent): void {
  switch (event.type) {
    case "login":
      console.log(`Xử lý đăng nhập cho ${event.userId}`);
      return;
    case "logout":
      console.log("Xử lý đăng xuất");
      return;
    case "error":
      console.log(`Xử lý lỗi: ${event.message}`);
      return;
    default:
      return exhaustiveCheck(event); // Báo lỗi biên dịch nếu thiếu trường hợp
  }
}
```

### Tại sao dùng Kiểm tra đầy đủ?
- **Ngăn lỗi**: Đảm bảo không bỏ sót trường hợp xử lý sự kiện hoặc action.
- **An toàn biên dịch**: Phát hiện lỗi trước khi chạy mã.

---

## 6. Bài tập thực hành

### Cấp độ 1: Hệ thống thanh toán
1. Tạo union type `Payment` gồm:
   - `{ type: "cash"; amount: number }`
   - `{ type: "credit"; cardNumber: string; amount: number }`
   - `{ type: "paypal"; email: string; amount: number }`
2. Viết hàm `processPayment` để xử lý từng loại thanh toán.

### Cấp độ 2: Reducer công việc (Todo)
1. Tạo union type `TodoAction` gồm:
   - `{ type: "add"; text: string }`
   - `{ type: "toggle"; id: number }`
   - `{ type: "delete"; id: number }`
2. Viết hàm `todoReducer` quản lý mảng các công việc.

### Cấp độ 3: Hệ thống sự kiện chat
1. Tạo union type `ChatEvent` gồm:
   - `{ type: "message"; from: string; text: string }`
   - `{ type: "typing"; from: string }`
   - `{ type: "joined"; user: string }`
   - `{ type: "left"; user: string }`
2. Viết hàm `handleChatEvent` xử lý tất cả trường hợp với kiểm tra đầy đủ.

---

## 7. Lời giải bài tập

### 🟢 Cấp độ 1: Hệ thống thanh toán
```typescript
// Định nghĩa union type Payment
type Payment =
  | { type: "cash"; amount: number }
  | { type: "credit"; cardNumber: string; amount: number }
  | { type: "paypal"; email: string; amount: number };

// Hàm xử lý thanh toán
function processPayment(payment: Payment): void {
  switch (payment.type) {
    case "cash":
      console.log(`💵 Thanh toán ${payment.amount} bằng tiền mặt`);
      break;
    case "credit":
      console.log(`💳 Thanh toán ${payment.amount} bằng thẻ ${payment.cardNumber}`);
      break;
    case "paypal":
      console.log(`🅿️ Gửi ${payment.amount} qua PayPal tới ${payment.email}`);
      break;
    default:
      const _exhaustive: never = payment;
      return _exhaustive;
  }
}

// Test
processPayment({ type: "cash", amount: 100 });
processPayment({ type: "credit", cardNumber: "1234-5678", amount: 200 });
processPayment({ type: "paypal", email: "test@gmail.com", amount: 300 });
```

**Kết quả**:
```
💵 Thanh toán 100 bằng tiền mặt
💳 Thanh toán 200 bằng thẻ 1234-5678
🅿️ Gửi 300 qua PayPal tới test@gmail.com
```

### 🟡 Cấp độ 2: Reducer công việc
```typescript
// Định nghĩa kiểu Todo và TodoAction
type Todo = { id: number; text: string; completed: boolean };

type TodoAction =
  | { type: "add"; text: string }
  | { type: "toggle"; id: number }
  | { type: "delete"; id: number };

// Hàm reducer quản lý công việc
function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case "add":
      const newTodo: Todo = {
        id: state.length + 1,
        text: action.text,
        completed: false,
      };
      return [...state, newTodo];
    case "toggle":
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
      );
    case "delete":
      return state.filter((todo) => todo.id !== action.id);
    default:
      const _never: never = action;
      return state;
  }
}

// Test
let todos: Todo[] = [];
todos = todoReducer(todos, { type: "add", text: "Học TypeScript" });
todos = todoReducer(todos, { type: "add", text: "Xây dựng dự án" });
todos = todoReducer(todos, { type: "toggle", id: 1 });
todos = todoReducer(todos, { type: "delete", id: 2 });
console.log(todos);
```

**Kết quả**:
```json
[{ "id": 1, "text": "Học TypeScript", "completed": true }]
```

### 🔴 Cấp độ 3: Hệ thống sự kiện chat
```typescript
// Định nghĩa union type ChatEvent
type ChatEvent =
  | { type: "message"; from: string; text: string }
  | { type: "typing"; from: string }
  | { type: "joined"; user: string }
  | { type: "left"; user: string };

// Hàm kiểm tra đầy đủ
function exhaustiveCheck(x: never): never {
  throw new Error(`Trường hợp chưa xử lý: ${JSON.stringify(x)}`);
}

// Hàm xử lý sự kiện chat
function handleChatEvent(event: ChatEvent): void {
  switch (event.type) {
    case "message":
      console.log(`💬 ${event.from}: ${event.text}`);
      break;
    case "typing":
      console.log(`✍️ ${event.from} đang nhập...`);
      break;
    case "joined":
      console.log(`👋 ${event.user} đã tham gia chat`);
      break;
    case "left":
      console.log(`🚪 ${event.user} đã rời chat`);
      break;
    default:
      return exhaustiveCheck(event);
  }
}

// Test
handleChatEvent({ type: "joined", user: "Alice" });
handleChatEvent({ type: "message", from: "Alice", text: "Xin chào!" });
handleChatEvent({ type: "typing", from: "Bob" });
handleChatEvent({ type: "left", user: "Alice" });
```

**Kết quả**:
```
👋 Alice đã tham gia chat
💬 Alice: Xin chào!
✍️ Bob đang nhập...
🚪 Alice đã rời chat
```

---

## 8. Phần mở rộng cấp cao: Xây dựng Redux-like Store an toàn kiểu

Để thể hiện sức mạnh của discriminated unions ở **cấp độ cao**, chúng ta sẽ xây dựng một **Redux-like Store** từ đầu bằng TypeScript. Store này sẽ hoàn toàn an toàn kiểu, hỗ trợ nhiều reducer và middleware để xử lý các tác vụ như ghi log và action bất đồng bộ.

### Bước 1: Định nghĩa kiểu Action
```typescript
// Action cho counter
type CounterAction =
  | { type: "increment"; value?: number } // value mặc định là 1
  | { type: "decrement"; value?: number }
  | { type: "reset" };

// Action cho auth
type AuthAction =
  | { type: "login"; username: string }
  | { type: "logout" };

// Union action tổng hợp
type AppAction = CounterAction | AuthAction;
```

### Bước 2: Định nghĩa kiểu State
```typescript
// State cho counter
type CounterState = { count: number };

// State cho auth
type AuthState = { user: string | null };

// State tổng hợp
type AppState = {
  counter: CounterState;
  auth: AuthState;
};
```

### Bước 3: Tạo hàm Reducer
```typescript
// Reducer cho counter
function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case "increment":
      return { count: state.count + (action.value ?? 1) };
    case "decrement":
      return { count: state.count - (action.value ?? 1) };
    case "reset":
      return { count: 0 };
    default:
      const _never: never = action;
      return state;
  }
}

// Reducer cho auth
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "login":
      return { user: action.username };
    case "logout":
      return { user: null };
    default:
      const _never: never = action;
      return state;
  }
}

// Root reducer để kết hợp các reducer
function rootReducer(state: AppState, action: AppAction): AppState {
  return {
    counter: counterReducer(state.counter, action as CounterAction),
    auth: authReducer(state.auth, action as AuthAction),
  };
}
```

**Lưu ý**: Chúng ta dùng `action as CounterAction` và `action as AuthAction` vì `AppAction` là union type. Để an toàn hơn, có thể dùng **type predicates** để tinh chỉnh kiểu action.

### Bước 4: Triển khai Store
```typescript
// Kiểu listener cho thay đổi trạng thái
type Listener = () => void;

// Lớp Store
class Store {
  private state: AppState;
  private listeners: Listener[] = [];

  constructor(
    private reducer: (state: AppState, action: AppAction) => AppState,
    initialState: AppState
  ) {
    this.state = initialState;
  }

  // Lấy trạng thái hiện tại
  getState(): AppState {
    return this.state;
  }

  // Gửi action
  dispatch(action: AppAction): void {
    this.state = this.reducer(this.state, action);
    this.listeners.forEach((listener) => listener());
  }

  // Đăng ký theo dõi thay đổi trạng thái
  subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}
```

### Bước 5: Test Store
```typescript
// Trạng thái ban đầu
const initialState: AppState = {
  counter: { count: 0 },
  auth: { user: null },
};

// Tạo store
const store = new Store(rootReducer, initialState);

// Đăng ký theo dõi trạng thái
store.subscribe(() => {
  console.log("📌 Trạng thái cập nhật:", store.getState());
});

// Test các action
store.dispatch({ type: "increment" });
store.dispatch({ type: "increment", value: 5 });
store.dispatch({ type: "decrement", value: 2 });
store.dispatch({ type: "reset" });
store.dispatch({ type: "login", username: "Alice" });
store.dispatch({ type: "logout" });
```

**Kết quả**:
```
📌 Trạng thái cập nhật: { counter: { count: 1 }, auth: { user: null } }
📌 Trạng thái cập nhật: { counter: { count: 6 }, auth: { user: null } }
📌 Trạng thái cập nhật: { counter: { count: 4 }, auth: { user: null } }
📌 Trạng thái cập nhật: { counter: { count: 0 }, auth: { user: null } }
📌 Trạng thái cập nhật: { counter: { count: 0 }, auth: { user: "Alice" } }
📌 Trạng thái cập nhật: { counter: { count: 0 }, auth: { user: null } }
```

### Bước 6: Thêm Middleware cho Ghi log và Action bất đồng bộ
Để làm cho store mạnh hơn, chúng ta thêm **hệ thống middleware** để xử lý ghi log và các action bất đồng bộ.

```typescript
// Kiểu middleware
type Middleware = (
  store: Store,
  next: (action: AppAction) => void,
  action: AppAction
) => void;

// Store hỗ trợ middleware
class StoreWithMiddleware extends Store {
  private middlewares: Middleware[];

  constructor(
    reducer: (state: AppState, action: AppAction) => AppState,
    initialState: AppState,
    middlewares: Middleware[] = []
  ) {
    super(reducer, initialState);
    this.middlewares = middlewares;
  }

  dispatch(action: AppAction): void {
    const invoke = (index: number, act: AppAction) => {
      if (index < this.middlewares.length) {
        this.middlewares[index](this, (a) => invoke(index + 1, a), act);
      } else {
        super.dispatch(act);
      }
    };
    invoke(0, action);
  }
}

// Middleware ghi log
const logger: Middleware = (store, next, action) => {
  console.log("🚀 Đang gửi:", action);
  next(action);
};

// Middleware xử lý action bất đồng bộ (mô phỏng API call)
const asyncAction: Middleware = (store, next, action) => {
  if (action.type === "login" && action.username === "delay") {
    console.log("⏳ Mô phỏng đăng nhập bất đồng bộ...");
    setTimeout(() => {
      next({ type: "login", username: "AsyncUser" });
    }, 1000);
  } else {
    next(action);
  }
};

// Test store với middleware
const store2 = new StoreWithMiddleware(rootReducer, initialState, [logger, asyncAction]);

store2.subscribe(() => {
  console.log("📌 Trạng thái mới:", store2.getState());
});

store2.dispatch({ type: "increment" });
store2.dispatch({ type: "login", username: "delay" });
```

**Kết quả**:
```
🚀 Đang gửi: { type: "increment" }
📌 Trạng thái mới: { counter: { count: 1 }, auth: { user: null } }
🚀 Đang gửi: { type: "login", username: "delay" }
⏳ Mô phỏng đăng nhập bất đồng bộ...
🚀 Đang gửi: { type: "login", username: "AsyncUser" }
📌 Trạng thái mới: { counter: { count: 1 }, auth: { user: "AsyncUser" } }
```

---

## 9. Kết luận

- **Discriminated Unions** đảm bảo xử lý an toàn kiểu cho nhiều kiểu dữ liệu với một thuộc tính phân biệt chung.
- Chúng được sử dụng rộng rãi trong **Redux reducers**, **hệ thống sự kiện**, và **xử lý lỗi** để đảm bảo an toàn và dễ mở rộng.
- **Kiểm tra đầy đủ** với kiểu `never` ngăn ngừa thiếu sót trường hợp ở thời điểm biên dịch.
- Xây dựng **Redux-like Store** với discriminated unions thể hiện cách tạo hệ thống quản lý trạng thái an toàn kiểu và dễ mở rộng.
- **Middleware** bổ sung các chức năng nâng cao như ghi log và xử lý action bất đồng bộ, giúp store sẵn sàng cho ứng dụng thực tế.

---

## 10. Bước tiếp theo
- **Thực hành**: Thêm nhiều loại action hoặc trạng thái vào Redux-like Store.
- **Khám phá**: Sử dụng **type predicates** để tinh chỉnh kiểu action thay vì ép kiểu.
- **Mở rộng**: Triển khai pattern giống saga để xử lý các luồng bất đồng bộ phức tạp.

Tài liệu này cung cấp nền tảng vững chắc cho người mới bắt đầu và các kiến thức nâng cao cho những ai muốn thành thạo TypeScript và quản lý trạng thái. Nếu bạn có câu hỏi hoặc cần giải thích thêm, hãy hỏi nhé! 🚀

---
📌 [<< Ngày 36](./Day36.md) | [Ngày 38 >>](./Day38.md)