Tuyệt 👌 Vậy ta sẽ tiếp tục theo lộ trình.
Lần trước mình dừng ở **Day 6: Interface vs Type** → giờ sẽ sang **Day 7: Enums & Literal Types**.

---

# 📘 Day 7: Enums & Literal Types

## 🎯 Mục tiêu học

* Hiểu **enum** là gì và khi nào dùng.
* So sánh **numeric enum** và **string enum**.
* Dùng **const enum** để tối ưu hiệu năng.
* Hiểu **literal types** (kiểu hằng) và cách kết hợp với union để tạo type an toàn.
* Ứng dụng: tạo state machine đơn giản, phân quyền role, status code chuẩn enterprise.

---

## 📝 Tóm tắt

`enum` dùng để định nghĩa **tập giá trị hữu hạn** có tên rõ ràng (ví dụ: trạng thái đơn hàng, quyền người dùng).
`literal types` dùng để giới hạn giá trị của một biến chỉ thuộc về một số hằng số cho trước.

Trong enterprise, ta thường dùng `enum` hoặc `union literal` để **tránh magic string/number** và **loại bỏ bug do typo**.

---

## 📖 Nội dung chi tiết

### 1. Numeric Enum

```ts
enum OrderStatus {
  Pending,   // 0
  Shipped,   // 1
  Delivered, // 2
  Cancelled  // 3
}

const order = {
  id: 1,
  status: OrderStatus.Pending,
};

console.log(order.status); // 0
```

👉 Dễ sinh bug vì mặc định enum numeric bắt đầu từ 0.

---

### 2. String Enum

```ts
enum UserRole {
  Admin = "admin",
  Editor = "editor",
  Viewer = "viewer",
}

function checkPermission(role: UserRole) {
  if (role === UserRole.Admin) {
    console.log("✅ Full access");
  } else {
    console.log("⚠️ Limited access");
  }
}

checkPermission(UserRole.Editor);
```

👉 Rõ ràng hơn, ít bug, phổ biến hơn trong enterprise.

---

### 3. Const Enum (tối ưu compile)

```ts
const enum LogLevel {
  Info,
  Warn,
  Error,
}

const level: LogLevel = LogLevel.Warn;
console.log(level);
```

👉 Khi compile sang JS, giá trị enum sẽ inline → giảm overhead runtime.

---

### 4. Literal Types

```ts
type Direction = "up" | "down" | "left" | "right";

function move(dir: Direction) {
  console.log("Moving", dir);
}

move("up");    // OK
move("left");  // OK
// move("jump"); // ❌ Error
```

👉 An toàn hơn so với string tự do.

---

### 5. Ứng dụng thực tế

**State machine đơn hàng**

```ts
type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

function canCancel(status: OrderStatus): boolean {
  return status === "pending" || status === "shipped";
}

console.log(canCancel("pending")); // true
console.log(canCancel("delivered")); // false
```

Trong dự án lớn: enum/literal giúp team tránh bug kiểu `"Pendng"` (sai chính tả).

---

## 🧑‍💻 Bài tập

### Level 1

Tạo `enum TrafficLight` với các giá trị `"red"`, `"yellow"`, `"green"`. Viết hàm `canGo(light)` trả về `true/false`.

### Level 2

Tạo type `PaymentMethod = "cash" | "credit" | "paypal"`. Viết hàm `pay(amount, method)` in ra:

* `"Paying {amount} by {method}"`.

### Level 3 (enterprise)

Tạo `enum ApiStatus = "idle" | "loading" | "success" | "error"`.
Viết hàm `renderUI(status)` trả về:

* `"🔄 Loading..."`
* `"✅ Success"`
* `"❌ Error"`
* `"Idle state"`

---

## ✅ Lời giải

### Level 1

```ts
enum TrafficLight {
  Red = "red",
  Yellow = "yellow",
  Green = "green",
}

function canGo(light: TrafficLight): boolean {
  return light === TrafficLight.Green;
}

console.log(canGo(TrafficLight.Red));   // false
console.log(canGo(TrafficLight.Green)); // true
```

---

### Level 2

```ts
type PaymentMethod = "cash" | "credit" | "paypal";

function pay(amount: number, method: PaymentMethod) {
  console.log(`Paying ${amount} by ${method}`);
}

pay(100, "cash");
pay(200, "paypal");
```

---

### Level 3

```ts
enum ApiStatus {
  Idle = "idle",
  Loading = "loading",
  Success = "success",
  Error = "error",
}

function renderUI(status: ApiStatus) {
  switch (status) {
    case ApiStatus.Loading:
      return "🔄 Loading...";
    case ApiStatus.Success:
      return "✅ Success";
    case ApiStatus.Error:
      return "❌ Error";
    case ApiStatus.Idle:
    default:
      return "Idle state";
  }
}

console.log(renderUI(ApiStatus.Loading));
```

---

## ⚠️ Lưu ý enterprise

* Dự án lớn thường ưu tiên **string enum** hoặc **union literal types** thay cho numeric enum → dễ đọc, log/debug dễ.
* Với UI state, status code API → literal union type được ưa chuộng vì dễ kết hợp với discriminated union.
* Đừng lạm dụng enum cho mọi thứ, chỉ dùng khi tập giá trị cố định, ít thay đổi.

---


[<< Ngày 6](./Day06.md) | [Ngày 8 >>](./Day08.md)

