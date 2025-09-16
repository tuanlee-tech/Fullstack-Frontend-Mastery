# 📘 Day 8: Union & Intersection Types

## 🎯 Mục tiêu học

* Hiểu **union types** (`A | B`) để mô tả giá trị có thể thuộc nhiều loại.
* Hiểu **intersection types** (`A & B`) để kết hợp nhiều type thành một.
* Ứng dụng thực tế:

  * Kiểm soát **API response** với union.
  * Mô tả **object phức tạp** với intersection.
* Biết khi nào nên dùng union vs intersection.
* Hiểu cách type narrowing giúp xử lý union an toàn.

---

## 📝 Tóm tắt

* **Union (`|`)**: "hoặc" – biến có thể thuộc **một trong nhiều loại**.
* **Intersection (`&`)**: "và" – biến phải đồng thời thỏa mãn **nhiều loại**.

Trong enterprise:

* Union thường dùng cho **state machine, API response, input validation**.
* Intersection thường dùng cho **composite object**, khi cần kết hợp nhiều vai trò (user + audit log, component + props).

---

## 📖 Nội dung chi tiết

### 1. Union Types

```ts
type ID = string | number;

function printId(id: ID) {
  console.log("ID:", id);
}

printId(101);
printId("abc123");
// printId(true); // ❌ Error
```

👉 An toàn hơn `any`, hạn chế bug.

---

### 2. Intersection Types

```ts
type Audit = { createdAt: Date; createdBy: string };
type User = { id: number; name: string };

type AuditedUser = User & Audit;

const admin: AuditedUser = {
  id: 1,
  name: "Alice",
  createdAt: new Date(),
  createdBy: "system",
};
```

👉 `admin` phải có đầy đủ cả `User` và `Audit`.

---

### 3. Union trong API Response

```ts
type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error"; message: string }
  | { status: "loading" };

function handleResponse<T>(res: ApiResponse<T>) {
  switch (res.status) {
    case "success":
      console.log("✅ Data:", res.data);
      break;
    case "error":
      console.error("❌ Error:", res.message);
      break;
    case "loading":
      console.log("⏳ Loading...");
      break;
  }
}

handleResponse({ status: "loading" });
handleResponse({ status: "success", data: { id: 1, name: "Alice" } });
```

👉 Dùng **discriminated union** để mô tả state API → cực kỳ phổ biến trong frontend.

---

### 4. Intersection cho Props Component

```ts
type WithLoading = { loading: boolean };
type WithData<T> = { data: T };

type ListProps<T> = WithLoading & WithData<T>;

function renderList(props: ListProps<string[]>) {
  if (props.loading) return "⏳ Loading...";
  return props.data.join(", ");
}

console.log(renderList({ loading: false, data: ["A", "B", "C"] }));
```

👉 Component props thường kết hợp từ nhiều nguồn, intersection giúp tái sử dụng.

---

### 5. Type Narrowing (quan trọng khi xử lý union)

```ts
function printValue(val: string | number) {
  if (typeof val === "string") {
    console.log("String length:", val.length);
  } else {
    console.log("Number squared:", val * val);
  }
}

printValue("hello");
printValue(5);
```

👉 Dùng `typeof`, `instanceof`, hoặc check key để thu hẹp type.

---

## 🧑‍💻 Bài tập

### Level 1

Tạo type `Result = "success" | "fail"`. Viết hàm `showResult(r: Result)` in ra:

* `"Operation successful"` nếu success
* `"Operation failed"` nếu fail

### Level 2

Tạo type `Product = { id: string; name: string }` và `Price = { price: number }`.

* Tạo type `PricedProduct = Product & Price`.
* Tạo biến `item` kiểu `PricedProduct` và in ra thông tin.

### Level 3 (enterprise)

Thiết kế `ApiResponse<T>` như ví dụ trên, nhưng thêm trạng thái `"unauthorized"`.

* Viết hàm `handleSecureResponse<T>(res)` xử lý tất cả 4 trạng thái.
* Test với `User` và `Product`.

---

## ✅ Lời giải

### Level 1

```ts
type Result = "success" | "fail";

function showResult(r: Result) {
  if (r === "success") console.log("Operation successful");
  else console.log("Operation failed");
}

showResult("success");
showResult("fail");
```

---

### Level 2

```ts
type Product = { id: string; name: string };
type Price = { price: number };

type PricedProduct = Product & Price;

const item: PricedProduct = { id: "p1", name: "Laptop", price: 1500 };
console.log(item);
```

---

### Level 3

```ts
type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error"; message: string }
  | { status: "loading" }
  | { status: "unauthorized" };

function handleSecureResponse<T>(res: ApiResponse<T>) {
  switch (res.status) {
    case "success":
      console.log("✅ Data:", res.data);
      break;
    case "error":
      console.error("❌ Error:", res.message);
      break;
    case "loading":
      console.log("⏳ Loading...");
      break;
    case "unauthorized":
      console.warn("🚫 Unauthorized, please login again");
      break;
  }
}

// Test với User
handleSecureResponse<{ id: number; name: string }>({
  status: "success",
  data: { id: 1, name: "Alice" },
});

// Test với Product
handleSecureResponse<{ id: string; price: number }>({
  status: "unauthorized",
});
```

---

## ⚠️ Lưu ý enterprise

* **Union** dùng khi giá trị chỉ thuộc một trong vài loại → đặc biệt hợp với UI state và API status.
* **Intersection** dùng khi object cần thỏa nhiều “vai trò” → thường trong domain model hoặc props component.
* Với API lớn: luôn ưu tiên **discriminated union** (có `status` hoặc `type` key) để code dễ maintain, tránh if-else lộn xộn.

---
### 🔥 Mở rộng Mini Project Day 8: **Quản lý kho hàng (Inventory Management)**

> Mục tiêu: Ứng dụng **Type Aliases + Interface + Union/Intersection** trong 1 tình huống thực tế (enterprise style).
> Tập trung vào việc tái sử dụng type, giảm lặp code, và dễ mở rộng khi hệ thống phát triển.

---

## 1. Yêu cầu dự án

* Xây dựng hệ thống quản lý kho hàng cơ bản.
* Có nhiều loại sản phẩm: `Book`, `Clothing`, `Electronic`.
* Mỗi loại sản phẩm có thuộc tính riêng, nhưng đều phải có **id, name, quantity**.
* Hệ thống cần:

  * Thêm sản phẩm mới.
  * Cập nhật số lượng.
  * In danh sách sản phẩm.
  * Tìm sản phẩm theo id.

---

## 2. Thiết kế type

```ts
// Base Product - các thuộc tính chung
interface BaseProduct {
  id: string;
  name: string;
  quantity: number;
}

// Các loại sản phẩm cụ thể
interface Book extends BaseProduct {
  type: "book";
  author: string;
  pages: number;
}

interface Clothing extends BaseProduct {
  type: "clothing";
  size: "S" | "M" | "L" | "XL";
  material: string;
}

interface Electronic extends BaseProduct {
  type: "electronic";
  warranty: number; // tháng
  power: string; // ví dụ: "220V"
}

// Union type cho tất cả sản phẩm
type Product = Book | Clothing | Electronic;
```

---

## 3. Viết hàm quản lý

```ts
// Danh sách sản phẩm trong kho
let inventory: Product[] = [];

// Thêm sản phẩm
function addProduct(p: Product): void {
  inventory.push(p);
}

// Cập nhật số lượng
function updateQuantity(id: string, qty: number): void {
  const product = inventory.find((p) => p.id === id);
  if (product) {
    product.quantity = qty;
    console.log(`✅ Đã cập nhật số lượng cho ${product.name}`);
  } else {
    console.error("❌ Không tìm thấy sản phẩm");
  }
}

// Tìm sản phẩm theo id
function findProduct(id: string): Product | undefined {
  return inventory.find((p) => p.id === id);
}

// In danh sách sản phẩm
function printInventory(): void {
  console.log("📦 Danh sách sản phẩm trong kho:");
  inventory.forEach((p) => {
    switch (p.type) {
      case "book":
        console.log(`📚 [Sách] ${p.name} - Tác giả: ${p.author}`);
        break;
      case "clothing":
        console.log(`👕 [Quần áo] ${p.name} - Size: ${p.size}`);
        break;
      case "electronic":
        console.log(`🔌 [Điện tử] ${p.name} - Bảo hành: ${p.warranty} tháng`);
        break;
    }
  });
}
```

---

## 4. Demo sử dụng

```ts
// Thêm sản phẩm
addProduct({
  id: "b1",
  name: "Clean Code",
  quantity: 10,
  type: "book",
  author: "Robert C. Martin",
  pages: 464,
});

addProduct({
  id: "c1",
  name: "Áo thun",
  quantity: 50,
  type: "clothing",
  size: "L",
  material: "Cotton",
});

addProduct({
  id: "e1",
  name: "Laptop Dell",
  quantity: 5,
  type: "electronic",
  warranty: 24,
  power: "220V",
});

// In sản phẩm
printInventory();

// Update
updateQuantity("c1", 45);

// Tìm sản phẩm
console.log("🔍 Tìm sản phẩm:", findProduct("e1"));
```

---

## 5. Bài học rút ra

* **Union type + Discriminated Union** (`type: "book" | "clothing" | "electronic"`) giúp code an toàn, tránh nhầm lẫn.
* **Interface kế thừa** (`BaseProduct`) để giảm lặp lại code.
* Khi mở rộng hệ thống (thêm `Food`, `Furniture`…), chỉ cần thêm interface mới và cập nhật union `Product`.
* Đây là cách **enterprise** thiết kế hệ thống domain model cho e-commerce, ERP, hoặc quản lý kho.

---
[<< Ngày 7](./Day07.md) | [Ngày 9 >>](./Day09.md)

