# 📌 Ngày 40: Type-Safe Form Builder (Mini Project)

Đây là một **mini-capstone project** trong **Phase 4**, kết hợp các kiến thức từ **Mapped Types**, **Conditional Types**, **Infer**, **Recursive Types**, và **Template Literal Types** để xây dựng một **Form Builder** an toàn tuyệt đối về kiểu (type-safe) cả ở **compile-time** lẫn **runtime**. Tài liệu được viết chi tiết, dễ hiểu, phù hợp cho cả người mới bắt đầu và lập trình viên muốn áp dụng TypeScript ở cấp độ doanh nghiệp.

---

## 1. Mục tiêu

Xây dựng một **Form Builder** với các tính năng:
- **Khai báo schema form** bằng TypeScript type.
- **Tự động sinh UI** (React components) từ schema.
- **Validate dữ liệu** cả compile-time và runtime.
- **Suy luận type** chính xác cho dữ liệu form khi submit.
- **Hỗ trợ điều kiện động** (conditional fields): ẩn/hiện field dựa trên giá trị của field khác.

👉 Dự án này tương tự cách **React Hook Form** kết hợp với **Zod/Valibot**, nhưng được xây dựng từ đầu để hiểu rõ bản chất.

---

## 2. Thiết kế Schema Form

Chúng ta cần một **DSL (Domain Specific Language)** nhỏ gọn để mô tả form.

### 2.1 Định nghĩa schema
```typescript
// Các loại field
type Field =
  | { type: "text"; label: string; required?: boolean }
  | { type: "number"; label: string; min?: number; max?: number }
  | { type: "checkbox"; label: string }
  | { type: "select"; label: string; options: string[] };

// Schema là một object chứa các field
type FormSchema = {
  [key: string]: Field;
};

// Ví dụ schema cho User Form
const userForm: FormSchema = {
  username: { type: "text", label: "Tên người dùng", required: true },
  age: { type: "number", label: "Tuổi", min: 18, max: 99 },
  newsletter: { type: "checkbox", label: "Đăng ký nhận tin" },
  role: { type: "select", label: "Vai trò", options: ["admin", "user"] },
};
```

**Giải thích**:
- `Field` là một **discriminated union** với `type` làm discriminator, định nghĩa các loại field (`text`, `number`, `checkbox`, `select`).
- `FormSchema` là một object với key là tên field và value là cấu hình field.
- `userForm` là một schema ví dụ, mô tả form nhập thông tin người dùng.

---

## 3. Suy luận Type từ Schema (Type-Level Magic)

Chúng ta cần suy luận type của dữ liệu form từ schema để đảm bảo **type-safe** khi submit.

### 3.1 Type Inference
```typescript
// Suy luận type cho từng field
type InferField<T extends Field> =
  T extends { type: "text" } ? string :
  T extends { type: "number" } ? number :
  T extends { type: "checkbox" } ? boolean :
  T extends { type: "select"; options: (infer O)[] } ? O :
  never;

// Suy luận type cho toàn bộ form
type InferForm<T extends FormSchema> = {
  [K in keyof T]: InferField<T[K]>;
};

// Suy luận type từ userForm
type UserFormData = InferForm<typeof userForm>;
/*
UserFormData = {
  username: string;
  age: number;
  newsletter: boolean;
  role: "admin" | "user";
}
*/
```

**Giải thích**:
- `InferField` ánh xạ từng loại field sang type tương ứng:
  - `text` → `string`
  - `number` → `number`
  - `checkbox` → `boolean`
  - `select` → giá trị trong `options` (ví dụ: `"admin" | "user"`)
- `InferForm` tạo type cho object dữ liệu form, với key là tên field và value là type suy ra từ `InferField`.
- TypeScript đảm bảo dữ liệu khi submit khớp với `UserFormData`.

---

## 4. Render Form (React)

### 4.1 Form Builder Component
```typescript
import React, { useState } from "react";

type Props<T extends FormSchema> = {
  schema: T;
  onSubmit: (data: InferForm<T>) => void;
};

function FormBuilder<T extends FormSchema>({ schema, onSubmit }: Props<T>) {
  const [state, setState] = useState<any>({});

  // Cập nhật giá trị field
  function handleChange(name: string, value: any) {
    setState((prev: any) => ({ ...prev, [name]: value }));
  }

  // Xử lý submit
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(state as InferForm<T>);
  }

  return (
    <form onSubmit={handleSubmit}>
      {Object.entries(schema).map(([name, field]) => {
        switch (field.type) {
          case "text":
            return (
              <div key={name}>
                <label>{field.label}</label>
                <input
                  type="text"
                  required={field.required}
                  onChange={(e) => handleChange(name, e.target.value)}
                />
              </div>
            );
          case "number":
            return (
              <div key={name}>
                <label>{field.label}</label>
                <input
                  type="number"
                  min={field.min}
                  max={field.max}
                  onChange={(e) => handleChange(name, Number(e.target.value))}
                />
              </div>
            );
          case "checkbox":
            return (
              <div key={name}>
                <label>
                  <input
                    type="checkbox"
                    onChange={(e) => handleChange(name, e.target.checked)}
                  />
                  {field.label}
                </label>
              </div>
            );
          case "select":
            return (
              <div key={name}>
                <label>{field.label}</label>
                <select onChange={(e) => handleChange(name, e.target.value)}>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            );
          default:
            return null;
        }
      })}
      <button type="submit">Submit</button>
    </form>
  );
}
```

**Giải thích**:
- `FormBuilder` là một generic component, nhận `schema` và `onSubmit` với type `InferForm<T>`.
- `useState` quản lý trạng thái form, sử dụng `any` tạm thời (sẽ được cast thành `InferForm<T>` khi submit).
- Mỗi field được render dựa trên `type`, với các ràng buộc như `required`, `min`, `max` được áp dụng trực tiếp vào input.

### 4.2 Sử dụng FormBuilder
```typescript
import React from "react";

export default function App() {
  return (
    <FormBuilder
      schema={userForm}
      onSubmit={(data) => {
        // data: { username: string; age: number; newsletter: boolean; role: "admin" | "user" }
        console.log("Form submitted:", data);
      }}
    />
  );
}
```

**Kết quả**:
- Form render các field: `username` (text), `age` (number), `newsletter` (checkbox), `role` (select).
- Khi submit, `data` có type chính xác (`UserFormData`), đảm bảo an toàn kiểu.

---

## 5. Mở rộng: Dynamic Conditional Form Builder

Để hỗ trợ các field ẩn/hiện dựa trên giá trị khác, chúng ta mở rộng schema với `visibleIf`.

### 5.1 Mở rộng Schema
```typescript
type FieldType = "text" | "number" | "select";

interface FieldConfig<T extends object> {
  name: keyof T;
  label: string;
  type: FieldType;
  options?: (string | number)[];
  visibleIf?: (formData: T) => boolean; // Điều kiện hiển thị
}

interface FormSchema<T extends object> {
  fields: FieldConfig<T>[];
  initialValues: T;
}
```

**Giải thích**:
- `visibleIf` là một hàm nhận toàn bộ `formData` và trả về `true`/`false` để quyết định field có hiển thị hay không.
- `FormSchema` giờ sử dụng generic `T` để đảm bảo `name` và `initialValues` khớp với type của form data.

### 5.2 Dynamic Form Builder Component
```typescript
import React, { useState } from "react";

export function FormBuilder<T extends object>({
  schema,
  onSubmit,
}: {
  schema: FormSchema<T>;
  onSubmit: (data: T) => void;
}) {
  const [formData, setFormData] = useState<T>(schema.initialValues);

  // Cập nhật giá trị field
  function updateField<K extends keyof T>(key: K, value: T[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  // Xử lý submit
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit}>
      {schema.fields.map((field) => {
        // Kiểm tra điều kiện hiển thị
        if (field.visibleIf && !field.visibleIf(formData)) {
          return null;
        }

        if (field.type === "text") {
          return (
            <div key={field.name as string}>
              <label>{field.label}</label>
              <input
                type="text"
                value={formData[field.name] as string}
                onChange={(e) => updateField(field.name, e.target.value as any)}
              />
            </div>
          );
        }

        if (field.type === "number") {
          return (
            <div key={field.name}>
              <label>{field.label}</label>
              <input
                type="number"
                value={formData[field.name] as number}
                onChange={(e) => updateField(field.name, Number(e.target.value) as any)}
              />
            </div>
          );
        }

        if (field.type === "select") {
          return (
            <div key={field.name}>
              <label>{field.label}</label>
              <select
                value={formData[field.name] as string}
                onChange={(e) => updateField(field.name, e.target.value as any)}
              >
                {field.options?.map((opt) => (
                  <option key={opt.toString()} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        return null;
      })}
      <button type="submit">Submit</button>
    </form>
  );
}
```

**Giải thích**:
- `FormBuilder` giờ nhận `FormSchema<T>` với `initialValues` để khởi tạo `formData`.
- `visibleIf` kiểm tra điều kiện để quyết định render field, đảm bảo UI phản ánh đúng logic động.
- TypeScript đảm bảo `formData` có type khớp với `T`, và `updateField` chỉ chấp nhận các giá trị hợp lệ.

### 5.3 Áp dụng cho Product Form
```typescript
type Category = "book" | "clothes" | "tech";

interface Product {
  name: string;
  price: number;
  category: Category;
  warrantyMonths?: number;
}

const productSchema: FormSchema<Product> = {
  fields: [
    { name: "name", label: "Tên sản phẩm", type: "text" },
    { name: "price", label: "Giá", type: "number" },
    {
      name: "category",
      label: "Loại sản phẩm",
      type: "select",
      options: ["book", "clothes", "tech"],
    },
    {
      name: "warrantyMonths",
      label: "Bảo hành (tháng)",
      type: "number",
      visibleIf: (form) => form.category === "tech",
    },
  ],
  initialValues: {
    name: "",
    price: 0,
    category: "book",
    warrantyMonths: undefined,
  },
};

export default function ProductPage() {
  return (
    <FormBuilder
      schema={productSchema}
      onSubmit={(data) => {
        console.log("Product Data:", data);
      }}
    />
  );
}
```

**Kết quả**:
- Khi chọn `category` là `"book"` hoặc `"clothes"`, field `warrantyMonths` không hiển thị.
- Khi chọn `category` là `"tech"`, field `warrantyMonths` xuất hiện.
- Dữ liệu submit (`data`) có type chính xác:
  - Nếu `category` là `"tech"`, `warrantyMonths` là `number`.
  - Nếu không, `warrantyMonths` là `undefined`.

---

## 6. Bài tập

### 🟢 Cấp độ 1
Tạo schema cho form **Product** với các field:
- `name`: text, required.
- `price`: number, min 1.
- `category`: select, `["book", "clothes", "tech"]`.

Suy luận type `ProductFormData`.

**Lời giải**:
```typescript
const productSchema: FormSchema = {
  name: { type: "text", label: "Tên sản phẩm", required: true },
  price: { type: "number", label: "Giá", min: 1 },
  category: { type: "select", label: "Loại sản phẩm", options: ["book", "clothes", "tech"] },
};

type ProductFormData = InferForm<typeof productSchema>;
/*
ProductFormData = {
  name: string;
  price: number;
  category: "book" | "clothes" | "tech";
}
*/
```

**Giải thích**:
- `InferForm` suy ra type chính xác từ schema.
- `name` là `string`, `price` là `number`, `category` chỉ nhận các giá trị trong `options`.

### 🟡 Cấp độ 2
Thêm field `tags`: mảng text (`string[]`).

**Lời giải**:
```typescript
// Mở rộng Field để hỗ trợ array
type Field =
  | { type: "text"; label: string; required?: boolean }
  | { type: "number"; label: string; min?: number; max?: number }
  | { type: "checkbox"; label: string }
  | { type: "select"; label: string; options: string[] }
  | { type: "textArray"; label: string }; // Thêm type mới

// Cập nhật InferField
type InferField<T extends Field> =
  T extends { type: "text" } ? string :
  T extends { type: "number" } ? number :
  T extends { type: "checkbox" } ? boolean :
  T extends { type: "select"; options: (infer O)[] } ? O :
  T extends { type: "textArray" } ? string[] :
  never;

const productSchema: FormSchema = {
  name: { type: "text", label: "Tên sản phẩm", required: true },
  price: { type: "number", label: "Giá", min: 1 },
  category: { type: "select", label: "Loại sản phẩm", options: ["book", "clothes", "tech"] },
  tags: { type: "textArray", label: "Tags" },
};

type ProductWithTagsData = InferForm<typeof productSchema>;
/*
ProductWithTagsData = {
  name: string;
  price: number;
  category: "book" | "clothes" | "tech";
  tags: string[];
}
*/
```

**Giải thích**:
- Thêm `textArray` vào `Field` để hỗ trợ mảng text.
- Cập nhật `InferField` để suy ra `string[]` cho `textArray`.

### 🔴 Cấp độ 3
Thêm tính năng **conditional field**: Nếu `category` là `"tech"`, hiển thị field `warrantyMonths` (number).

**Lời giải**:
```typescript
type Category = "book" | "clothes" | "tech";

interface Product {
  name: string;
  price: number;
  category: Category;
  warrantyMonths?: number;
}

const productSchema: FormSchema<Product> = {
  fields: [
    { name: "name", label: "Tên sản phẩm", type: "text" },
    { name: "price", label: "Giá", type: "number" },
    {
      name: "category",
      label: "Loại sản phẩm",
      type: "select",
      options: ["book", "clothes", "tech"],
    },
    {
      name: "warrantyMonths",
      label: "Bảo hành (tháng)",
      type: "number",
      visibleIf: (form) => form.category === "tech",
    },
  ],
  initialValues: {
    name: "",
    price: 0,
    category: "book",
    warrantyMonths: undefined,
  },
};

type ProductConditionalData = Product;
/*
ProductConditionalData = {
  name: string;
  price: number;
  category: "book" | "clothes" | "tech";
  warrantyMonths?: number;
}
*/
```

**Giải thích**:
- `visibleIf` đảm bảo `warrantyMonths` chỉ hiển thị khi `category` là `"tech"`.
- Type `Product` phản ánh đúng rằng `warrantyMonths` là tùy chọn (`?`).

---

## 7. Ví dụ thực tế: Product Form với Conditional Field

### 7.1 Định nghĩa Schema
```typescript
type Category = "book" | "clothes" | "tech";

interface Product {
  name: string;
  price: number;
  category: Category;
  warrantyMonths?: number;
}

const productSchema: FormSchema<Product> = {
  fields: [
    { name: "name", label: "Tên sản phẩm", type: "text" },
    { name: "price", label: "Giá", type: "number" },
    {
      name: "category",
      label: "Loại sản phẩm",
      type: "select",
      options: ["book", "clothes", "tech"],
    },
    {
      name: "warrantyMonths",
      label: "Bảo hành (tháng)",
      type: "number",
      visibleIf: (form) => form.category === "tech",
    },
  ],
  initialValues: {
    name: "",
    price: 0,
    category: "book",
    warrantyMonths: undefined,
  },
};
```

### 7.2 React Component
```typescript
import React from "react";

export default function ProductPage() {
  return (
    <FormBuilder
      schema={productSchema}
      onSubmit={(data) => {
        console.log("Product Data:", data);
      }}
    />
  );
}
```

**Kết quả**:
- Form render các field: `name`, `price`, `category`.
- Field `warrantyMonths` chỉ xuất hiện khi `category` là `"tech"`.
- Khi submit, `data` có type `Product`, với `warrantyMonths` là `number` nếu `category` là `"tech"`, hoặc `undefined` nếu không.

---

## 8. Mở rộng (Advanced)

### 8.1 Validation Rules
Thêm hỗ trợ validation sử dụng **Zod** hoặc thư viện tương tự:
- `pattern` cho text (ví dụ: regex cho email).
- `customValidator` để validate logic phức tạp.

### 8.2 Async Fields
- Hỗ trợ `select` với options lấy từ API (fetch async).
- **Cascading dropdowns**: Ví dụ, chọn quốc gia → load danh sách thành phố.

### 8.3 Dynamic Form
- Cho phép người dùng thêm field tại runtime, tự động cập nhật schema và type.
- Ví dụ: thêm tag mới vào `tags` array.

### 8.4 Enterprise Use Case
- **Admin Panel**: Sử dụng Form Builder để sinh form từ JSON Schema, hỗ trợ quản trị viên tạo form động.
- **TypeScript + JSON**: Kết hợp compile-time type safety với runtime JSON validation.
- **Monorepo**: Dùng schema chung cho cả FE và BE, đảm bảo đồng bộ dữ liệu.

---

## 9. Kết luận

- **Dynamic Form Builder** sử dụng **Mapped Types**, **Conditional Types**, **Infer**, và **Recursive Types** để tạo form an toàn kiểu.
- **Conditional Fields** (`visibleIf`) cho phép ẩn/hiện field dựa trên dữ liệu, tăng tính linh hoạt.
- **Type Inference** đảm bảo dữ liệu submit có type chính xác, loại bỏ lỗi tại compile-time.
- **Enterprise Pattern**: Pattern này được sử dụng trong **React Hook Form**, **Zod**, và các hệ thống form động trong admin panel.
- Dự án này là bước chuẩn bị cho **Phase 5**: Production-grade typing (API, Monorepo, Clean Architecture).

---

## 10. Bước tiếp theo
- **Thực hành**: Thêm validation runtime sử dụng Zod hoặc thư viện tự xây từ Day 39.
- **Khám phá**: Kết hợp với API để load options động cho `select`.
- **Mở rộng**: Xây dựng form builder hỗ trợ nested fields (form lồng nhau) sử dụng recursive types.

Tài liệu này cung cấp một **mini-capstone project** thực tế, kết hợp tất cả kiến thức TypeScript nâng cao để xây dựng một **Form Builder** cấp doanh nghiệp. Nếu bạn muốn mở rộng thêm (ví dụ: thêm async validation hoặc nested fields), hãy cho mình biết nhé! 🚀

---
📌 [<< Ngày 39](./Day39.md) | [Ngày 41 >>](./Day41.md)