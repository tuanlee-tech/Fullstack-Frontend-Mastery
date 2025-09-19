# 📌 Ngày 39: Recursive Types & JSON Typing trong TypeScript

---

## 1. Giới thiệu về Recursive Types & JSON Typing

**Recursive Types** là các kiểu trong TypeScript được định nghĩa **tham chiếu lại chính nó**, cho phép mô hình hóa dữ liệu có cấu trúc lồng nhau vô hạn. Chúng đặc biệt hữu ích trong các trường hợp như:

- **JSON objects**: Object có thể chứa các object con.
- **Cây thư mục**: Thư mục chứa các thư mục con.
- **Abstract Syntax Tree (AST)**: Cây cú pháp trừu tượng trong trình biên dịch.
- **Form schemas**: Form có các field lồng nhau.

**JSON Typing** liên quan đến việc định nghĩa kiểu chính xác cho dữ liệu JSON, vốn có cấu trúc lồng nhau và hỗ trợ các kiểu cơ bản: `string`, `number`, `boolean`, `null`, `object`, và `array`.

---

## 2. Recursive Types cơ bản

Recursive Types cho phép một kiểu tham chiếu lại chính nó, thường được sử dụng để mô tả cấu trúc dữ liệu lồng nhau.

### Ví dụ: Cây thư mục
```typescript
// Định nghĩa kiểu Folder (thư mục) có thể chứa file (string) hoặc thư mục con
type Folder = {
  name: string;
  children: (Folder | string)[]; // Đệ quy: children có thể chứa Folder
};

// Ví dụ dữ liệu
const project: Folder = {
  name: "src",
  children: [
    "index.ts", // File
    {
      name: "components", // Thư mục con
      children: ["Button.tsx", "Input.tsx"],
    },
  ],
};

console.log(project);
/*
{
  name: "src",
  children: [
    "index.ts",
    { name: "components", children: ["Button.tsx", "Input.tsx"] }
  ]
}
*/
```

**Giải thích**:
- `Folder` được định nghĩa đệ quy vì `children` có thể chứa các `Folder` khác.
- TypeScript đảm bảo dữ liệu tuân thủ cấu trúc này, ví dụ: không thể thêm số vào `children`.

---

## 3. Typing JSON chuẩn xác

JSON hỗ trợ 6 kiểu dữ liệu cơ bản: `string`, `number`, `boolean`, `null`, `object`, và `array`. Chúng ta có thể mô hình hóa JSON bằng một recursive type.

### Định nghĩa kiểu JSON
```typescript
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONObject
  | JSONArray;

interface JSONObject {
  [key: string]: JSONValue; // Đệ quy: mỗi value có thể là JSONValue
}

interface JSONArray extends Array<JSONValue> {} // Đệ quy: mảng chứa JSONValue

// Ví dụ dữ liệu
const data: JSONValue = {
  name: "Alice",
  age: 25,
  hobbies: ["reading", "coding"],
  address: {
    city: "Hà Nội",
    zip: 10000,
  },
};

console.log(data);
/*
{
  name: "Alice",
  age: 25,
  hobbies: ["reading", "coding"],
  address: { city: "Hà Nội", zip: 10000 }
}
*/
```

**Giải thích**:
- `JSONValue` bao gồm tất cả các kiểu JSON hợp lệ, với `JSONObject` và `JSONArray` được định nghĩa đệ quy.
- TypeScript đảm bảo dữ liệu tuân thủ cấu trúc JSON, ví dụ: không cho phép `undefined` hoặc `function`.

---

## 4. Recursive Conditional Types

Kết hợp **recursive types** với **conditional types** cho phép xây dựng các type utility mạnh mẽ, ví dụ: `DeepReadonly` và `DeepPartial`.

### 4.1. DeepReadonly
Tạo một type làm cho tất cả các thuộc tính của object (bao gồm lồng nhau) trở thành `readonly`.

```typescript
type DeepReadonly<T> =
  T extends (...args: any[]) => any
    ? T // Giữ nguyên function
    : T extends Array<infer U>
    ? ReadonlyArray<DeepReadonly<U>> // Xử lý mảng đệ quy
    : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> } // Xử lý object đệ quy
    : T; // Giữ nguyên kiểu nguyên thủy

// Ví dụ
type User = {
  id: number;
  info: {
    name: string;
    skills: string[];
  };
};

type ReadonlyUser = DeepReadonly<User>;

const u: ReadonlyUser = {
  id: 1,
  info: {
    name: "Bob",
    skills: ["TS", "React"],
  },
};

// u.info.name = "Alice"; // ❌ Lỗi: readonly
// u.info.skills.push("Vue"); // ❌ Lỗi: readonly array

console.log(u);
/*
{
  id: 1,
  info: { name: "Bob", skills: ["TS", "React"] }
}
*/
```

**Giải thích**:
- `DeepReadonly` đi qua từng thuộc tính của object/mảng và áp dụng `readonly` đệ quy.
- Nếu gặp function hoặc kiểu nguyên thủy (`string`, `number`, ...), giữ nguyên.

### 4.2. DeepPartial
Tạo một type làm cho tất cả các thuộc tính của object (bao gồm lồng nhau) trở thành tùy chọn (`optional`).

```typescript
type DeepPartial<T> =
  T extends (...args: any[]) => any
    ? T // Giữ nguyên function
    : T extends Array<infer U>
    ? Array<DeepPartial<U>> // Xử lý mảng đệ quy
    : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> } // Xử lý object đệ quy
    : T; // Giữ nguyên kiểu nguyên thủy

// Ví dụ
type Config = {
  server: {
    host: string;
    port: number;
  };
  features: {
    login: boolean;
    signup: boolean;
  };
};

const partialConfig: DeepPartial<Config> = {
  server: {
    port: 8080, // Chỉ override một phần
  },
};

console.log(partialConfig); // { server: { port: 8080 } }
```

**Giải thích**:
- `DeepPartial` làm cho mọi thuộc tính trong object/mảng trở thành tùy chọn, áp dụng đệ quy.
- Rất hữu ích khi cần cung cấp config chỉ với một phần dữ liệu.

---

## 5. Ứng dụng thực tế

### 5.1. Form Builder
Xây dựng một schema cho form có thể lồng các field.

```typescript
type Field =
  | { type: "text"; label: string }
  | { type: "number"; label: string }
  | { type: "group"; fields: Field[] }; // Đệ quy: group chứa các Field

const form: Field = {
  type: "group",
  fields: [
    { type: "text", label: "Tên người dùng" },
    { type: "number", label: "Tuổi" },
    {
      type: "group",
      fields: [{ type: "text", label: "Trường lồng nhau" }],
    },
  ],
};

console.log(form);
/*
{
  type: "group",
  fields: [
    { type: "text", label: "Tên người dùng" },
    { type: "number", label: "Tuổi" },
    { type: "group", fields: [{ type: "text", label: "Trường lồng nhau" }] }
  ]
}
*/
```

**Giải thích**:
- `Field` là một discriminated union với `type` làm discriminator.
- `group` có thể chứa các `Field` khác, tạo ra cấu trúc lồng nhau vô hạn.

### 5.2. Abstract Syntax Tree (AST)
Mô hình hóa cây cú pháp trừu tượng, thường dùng trong trình biên dịch.

```typescript
type ASTNode =
  | { type: "Literal"; value: string | number }
  | { type: "BinaryExpr"; left: ASTNode; right: ASTNode; operator: "+" | "-" }; // Đệ quy

const ast: ASTNode = {
  type: "BinaryExpr",
  operator: "+",
  left: { type: "Literal", value: 5 },
  right: { type: "Literal", value: 10 },
};

console.log(ast);
/*
{
  type: "BinaryExpr",
  operator: "+",
  left: { type: "Literal", value: 5 },
  right: { type: "Literal", value: 10 }
}
*/
```

**Giải thích**:
- `ASTNode` được định nghĩa đệ quy vì `BinaryExpr` chứa các `ASTNode` trong `left` và `right`.
- Đảm bảo cấu trúc cây hợp lệ tại thời điểm biên dịch.

---

## 6. Mini Project: JSON Schema Validator (Type-Safe)

Xây dựng một hàm kiểm tra JSON hợp lệ sử dụng recursive type.

```typescript
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONObject
  | JSONArray;

interface JSONObject {
  [key: string]: JSONValue; // Đệ quy
}

interface JSONArray extends Array<JSONValue> {} // Đệ quy

function validateJSON(value: JSONValue): boolean {
  if (value === null) return true;
  if (["string", "number", "boolean"].includes(typeof value)) return true;
  if (Array.isArray(value)) return value.every(validateJSON); // Kiểm tra đệ quy mảng
  if (typeof value === "object") return Object.values(value).every(validateJSON); // Kiểm tra đệ quy object
  return false;
}

// Test
console.log(validateJSON({ x: 1, y: [true, null] })); // ✅ true
// console.log(validateJSON({ x: undefined })); // ❌ Lỗi biên dịch
```

**Giải thích**:
- `validateJSON` kiểm tra đệ quy để đảm bảo dữ liệu tuân thủ cấu trúc JSON.
- TypeScript ngăn chặn các giá trị không hợp lệ (như `undefined`) tại thời điểm biên dịch.

---

## 7. Bài tập thực hành

### Cấp độ 1
Tạo type `RecursiveArray<T>` cho phép mảng lồng nhiều cấp, ví dụ: `number | number[] | number[][] | ...`.

### Cấp độ 2
Tạo type `DeepPick<T, Keys>` để chọn các key lồng nhau từ object. Ví dụ:
```typescript
type Obj = { a: { b: { c: number } } };
type R = DeepPick<Obj, "a.b.c">; // { a: { b: { c: number } } }
```

### Cấp độ 3
Viết type `DeepMerge<A, B>` để merge hai object đệ quy:
- Nếu key trùng, merge sâu.
- Nếu key chỉ có ở một object, giữ nguyên.

---

## 8. Lời giải bài tập

### 🟢 Cấp độ 1: RecursiveArray
```typescript
// Định nghĩa type cho mảng lồng nhiều cấp
type RecursiveArray<T> = T | RecursiveArray<T>[];

// Ví dụ
const arr1: RecursiveArray<number> = 5; // Chỉ là số
const arr2: RecursiveArray<number> = [1, 2, 3]; // Mảng 1 chiều
const arr3: RecursiveArray<number> = [[1, 2], [3, 4]]; // Mảng 2 chiều
const arr4: RecursiveArray<number> = [[[1], [2]], [[3]]]; // Mảng 3 chiều

console.log(arr1); // 5
console.log(arr2); // [1, 2, 3]
console.log(arr3); // [[1, 2], [3, 4]]
console.log(arr4); // [[[1], [2]], [[3]]]
```

**Giải thích**:
- `RecursiveArray<T>` cho phép giá trị là `T` (kiểu cơ bản) hoặc một mảng của chính `RecursiveArray<T>`, tạo ra khả năng lồng vô hạn.
- TypeScript đảm bảo mọi phần tử trong mảng tuân thủ kiểu `T`.

### 🟡 Cấp độ 2: DeepPick
```typescript
// Utility để tách key theo dấu "."
type Split<S extends string, D extends string> =
  S extends `${infer Head}${D}${infer Tail}`
    ? [Head, ...Split<Tail, D>]
    : [S];

// Định nghĩa DeepPick đệ quy
type DeepPick<T, Path extends string> =
  Path extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T
      ? { [K in Key]: DeepPick<T[K], Rest> }
      : never
    : Path extends keyof T
    ? { [K in Path]: T[K] }
    : never;

// Test
type Obj = {
  a: {
    b: {
      c: number;
      d: string;
    };
  };
};

type R1 = DeepPick<Obj, "a.b.c">; // { a: { b: { c: number } } }
type R2 = DeepPick<Obj, "a.b.d">; // { a: { b: { d: string } } }

// Ví dụ giá trị
const result1: R1 = { a: { b: { c: 123 } } };
const result2: R2 = { a: { b: { d: "hello" } } };

console.log(result1); // { a: { b: { c: 123 } } }
console.log(result2); // { a: { b: { d: "hello" } } }
```

**Giải thích**:
- `Split` tách chuỗi key (ví dụ: `"a.b.c"` thành `["a", "b", "c"]`) bằng template literal types.
- `DeepPick` đi sâu vào từng tầng của object theo key, giữ nguyên cấu trúc gốc nhưng chỉ lấy key được chỉ định.
- Nếu key không hợp lệ (không tồn tại), trả về `never`.

### 🔴 Cấp độ 3: DeepMerge
```typescript
// Định nghĩa DeepMerge đệ quy
type DeepMerge<A, B> = {
  [K in keyof A | keyof B]:
    K extends keyof A
      ? K extends keyof B
        ? A[K] extends object
          ? B[K] extends object
            ? DeepMerge<A[K], B[K]> // Merge sâu nếu cả hai là object
            : B[K] // Override với B[K]
          : B[K]
        : A[K] // Chỉ có trong A
      : K extends keyof B
      ? B[K] // Chỉ có trong B
      : never;
};

// Test
type A = {
  id: number;
  info: {
    name: string;
    skills: string[];
  };
};

type B = {
  info: {
    skills: string[];
    age: number;
  };
  active: boolean;
};

type R = DeepMerge<A, B>;

// Ví dụ giá trị
const merged: R = {
  id: 1,
  info: {
    name: "Alice",
    skills: ["TS", "React"],
    age: 25,
  },
  active: true,
};

console.log(merged);
/*
{
  id: 1,
  info: { name: "Alice", skills: ["TS", "React"], age: 25 },
  active: true
}
*/
```

**Giải thích**:
- `DeepMerge` kiểm tra từng key trong `A` và `B`:
  - Nếu key tồn tại ở cả `A` và `B`:
    - Nếu cả hai là object, merge đệ quy.
    - Nếu không, lấy giá trị từ `B` (override).
  - Nếu key chỉ có ở `A`, giữ nguyên `A[K]`.
  - Nếu key chỉ có ở `B`, giữ nguyên `B[K]`.
- Kết quả là một object kết hợp, giữ cấu trúc lồng nhau.

---

## 9. Phần mở rộng cấp cao: JSON Schema Validator với Constraints

Để thể hiện sức mạnh của recursive types ở cấp độ doanh nghiệp, chúng ta sẽ xây dựng một **JSON Schema Validator** với các ràng buộc kiểu (constraints) như kiểm tra giá trị tối thiểu/tối đa cho số hoặc độ dài chuỗi.

### Bước 1: Định nghĩa JSON Schema
```typescript
type JSONSchema =
  | { type: "string"; minLength?: number; maxLength?: number }
  | { type: "number"; minimum?: number; maximum?: number }
  | { type: "boolean" }
  | { type: "null" }
  | { type: "object"; properties: { [key: string]: JSONSchema } } // Đệ quy
  | { type: "array"; items: JSONSchema }; // Đệ quy
```

### Bước 2: Hàm Validate
```typescript
function validateJSONSchema(value: JSONValue, schema: JSONSchema): boolean {
  switch (schema.type) {
    case "string":
      if (typeof value !== "string") return false;
      if (schema.minLength && value.length < schema.minLength) return false;
      if (schema.maxLength && value.length > schema.maxLength) return false;
      return true;

    case "number":
      if (typeof value !== "number") return false;
      if (schema.minimum && value < schema.minimum) return false;
      if (schema.maximum && value > schema.maximum) return false;
      return true;

    case "boolean":
      return typeof value === "boolean";

    case "null":
      return value === null;

    case "array":
      return Array.isArray(value) && value.every((item) => validateJSONSchema(item, schema.items));

    case "object":
      if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
      return Object.entries(schema.properties).every(([key, subSchema]) =>
        validateJSONSchema((value as JSONObject)[key], subSchema)
      );

    default:
      const _never: never = schema;
      return false;
  }
}
```

### Bước 3: Test
```typescript
const schema: JSONSchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 2, maxLength: 50 },
    age: { type: "number", minimum: 18, maximum: 100 },
    hobbies: { type: "array", items: { type: "string" } },
  },
};

const validData: JSONValue = {
  name: "Alice",
  age: 25,
  hobbies: ["reading", "coding"],
};

const invalidData: JSONValue = {
  name: "A", // Quá ngắn
  age: 15, // Dưới tối thiểu
  hobbies: ["reading", 123], // Không phải string
};

console.log(validateJSONSchema(validData, schema)); // ✅ true
console.log(validateJSONSchema(invalidData, schema)); // ❌ false
```

**Giải thích**:
- `JSONSchema` là một discriminated union với `type` làm discriminator, hỗ trợ các ràng buộc như `minLength`, `maximum`, v.v.
- Hàm `validateJSONSchema` kiểm tra đệ quy dữ liệu theo schema, đảm bảo an toàn kiểu và đúng ràng buộc.
- TypeScript đảm bảo dữ liệu đầu vào là `JSONValue`, loại bỏ các giá trị không hợp lệ như `undefined`.

---

## 10. Kết luận

- **Recursive Types** cho phép mô hình hóa dữ liệu lồng nhau phức tạp như JSON, cây thư mục, hoặc form schema.
- Kết hợp với **conditional types** tạo ra các utility mạnh như `DeepReadonly`, `DeepPartial`, `DeepPick`, và `DeepMerge`.
- Ứng dụng thực tế bao gồm:
  - **JSON typing**: Đảm bảo dữ liệu tuân thủ cấu trúc JSON.
  - **Form schemas**: Xây dựng form builder an toàn kiểu.
  - **AST**: Mô hình hóa cây cú pháp trong trình biên dịch.
  - **Config systems**: Merge hoặc override config lồng nhau.
- Phần mở rộng JSON Schema Validator cho thấy cách áp dụng recursive types vào các hệ thống doanh nghiệp thực tế.

---

## 11. Bước tiếp theo
- **Thực hành**: Thêm các ràng buộc mới vào `JSONSchema` (ví dụ: regex cho string, enum values).
- **Khám phá**: Kết hợp recursive types với template literal types để tạo schema phức tạp hơn.
- **Mở rộng**: Xây dựng một form builder hoàn chỉnh với validation dựa trên schema.

---
# 📌 Ngày 39: Recursive Types & JSON Typing trong TypeScript (Phiên bản Enterprise)

Tài liệu này mở rộng chủ đề **Recursive Types** và **JSON Typing** trong TypeScript, tập trung vào việc xây dựng một hệ thống **validation** cấp doanh nghiệp, tương tự các thư viện như **Zod**. Tài liệu được thiết kế rõ ràng, chi tiết với comment từng dòng, phù hợp cho cả người mới bắt đầu và lập trình viên muốn hiểu sâu về các pattern enterprise. Nội dung bao gồm lý thuyết, bài tập, lời giải, và các mini project thực tế như **Type-Safe Config System**, **API Validator**, và một **Zod-like Validation Library**.

---

## 1. Mini Project: Type-Safe Config System

### 🎯 Mục tiêu
Xây dựng một hệ thống cấu hình (config system) tương tự cách **Next.js**, **ESLint**, hoặc **Tailwind** xử lý config, với:
- Config mặc định (default config).
- Config người dùng (user config, có thể partial).
- Deep merge để tạo ra config cuối cùng an toàn kiểu.

### 1.1 Định nghĩa Config gốc
```typescript
// Config gốc với cấu trúc lồng nhau
type AppConfig = {
  app: {
    name: string;
    version: string;
  };
  theme: {
    darkMode: boolean;
    colors: {
      primary: string;
      secondary: string;
    };
  };
  features: {
    auth: boolean;
    analytics: boolean;
  };
};
```

**Giải thích**:
- `AppConfig` mô phỏng một cấu trúc config phức tạp, lồng nhiều tầng, thường thấy trong các ứng dụng thực tế.

### 1.2 Utility Types cần dùng

#### DeepPartial
Cho phép người dùng chỉ cần cung cấp một phần config.

```typescript
// Định nghĩa type cho phép tất cả thuộc tính (bao gồm lồng nhau) là tùy chọn
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
```

**Giải thích**:
- `DeepPartial` làm cho mọi thuộc tính trong object (bao gồm lồng sâu) trở thành tùy chọn (`?`).
- Nếu thuộc tính là object, tiếp tục áp dụng `DeepPartial` đệ quy.

#### DeepMerge
Kết hợp hai object, merge sâu nếu key trùng.

```typescript
// Định nghĩa type để merge hai object đệ quy
type DeepMerge<A, B> = {
  [K in keyof A | keyof B]:
    K extends keyof A
      ? K extends keyof B
        ? A[K] extends object
          ? B[K] extends object
            ? DeepMerge<A[K], B[K]> // Merge sâu nếu cả hai là object
            : B[K] // Override với B[K]
          : B[K]
        : A[K] // Chỉ có trong A
      : K extends keyof B
      ? B[K] // Chỉ có trong B
      : never;
};
```

**Giải thích**:
- `DeepMerge` xử lý từng key:
  - Nếu key tồn tại ở cả `A` và `B`, merge đệ quy nếu cả hai là object, nếu không thì lấy giá trị từ `B`.
  - Nếu key chỉ có ở `A` hoặc `B`, giữ nguyên giá trị tương ứng.

### 1.3 Logic Merge tại Runtime
```typescript
// Hàm merge hai object tại runtime
function deepMerge<A, B>(a: A, b: B): DeepMerge<A, B> {
  const result: any = { ...a }; // Sao chép object a
  for (const key in b) {
    if (b[key] && typeof b[key] === "object" && !Array.isArray(b[key])) {
      // Nếu là object, merge đệ quy
      result[key] = deepMerge((a as any)[key] || {}, b[key]);
    } else {
      // Nếu không, override với giá trị từ b
      result[key] = b[key];
    }
  }
  return result;
}
```

**Giải thích**:
- Hàm `deepMerge` thực hiện merge runtime, khớp với type `DeepMerge`.
- Nếu thuộc tính là object, gọi đệ quy `deepMerge`.
- Nếu không, sử dụng giá trị từ `b` để override.

### 1.4 Default Config
```typescript
// Config mặc định
const defaultConfig: AppConfig = {
  app: {
    name: "MyApp",
    version: "1.0.0",
  },
  theme: {
    darkMode: false,
    colors: {
      primary: "#000",
      secondary: "#FFF",
    },
  },
  features: {
    auth: true,
    analytics: false,
  },
};
```

**Giải thích**:
- `defaultConfig` cung cấp các giá trị mặc định cho toàn bộ cấu trúc config.

### 1.5 User Config (Partial)
```typescript
// Config người dùng, chỉ cần cung cấp một phần
const userConfig: DeepPartial<AppConfig> = {
  theme: {
    darkMode: true,
    colors: {
      primary: "#FF0000", // Chỉ override primary
    },
  },
  features: {
    analytics: true,
  },
};
```

**Giải thích**:
- `userConfig` chỉ cần cung cấp các thuộc tính muốn override, nhờ `DeepPartial`.

### 1.6 Kết hợp Config
```typescript
// Merge config mặc định và user config
const finalConfig = deepMerge(defaultConfig, userConfig);

// In kết quả
console.log(finalConfig);
/*
{
  app: { name: "MyApp", version: "1.0.0" },
  theme: { darkMode: true, colors: { primary: "#FF0000", secondary: "#FFF" } },
  features: { auth: true, analytics: true }
}
*/
```

**Giải thích**:
- `finalConfig` là kết quả của việc merge `defaultConfig` và `userConfig`.
- TypeScript đảm bảo `finalConfig` có kiểu `AppConfig` hoàn chỉnh, không thiếu field.

### Lợi ích:
- **An toàn kiểu**: `DeepPartial` cho phép user config linh hoạt, nhưng `finalConfig` luôn đầy đủ.
- **Merge sâu**: Giữ cấu trúc lồng nhau, chỉ override các field được cung cấp.
- **Enterprise pattern**: Được sử dụng trong **Next.js**, **Tailwind.config.js**, **ESLint**.

---

## 2. Mini Project: Type-Safe API Validator (Enterprise)

### 🎯 Mục tiêu
Xây dựng một hệ thống validation giống **tRPC** hoặc **Fastify**, với:
- Schema definition an toàn kiểu tại compile-time.
- Type inference tự động (`InferType`).
- Runtime validation với ràng buộc (constraints).

### 2.1 Định nghĩa Schema nâng cao
```typescript
// Định nghĩa schema với các ràng buộc
type Schema =
  | { type: "string"; minLength?: number; maxLength?: number }
  | { type: "number"; min?: number; max?: number }
  | { type: "boolean" }
  | { type: "array"; items: Schema }
  | { type: "object"; properties: Record<string, Schema> };
```

**Giải thích**:
- Schema là một discriminated union với `type` làm discriminator.
- Hỗ trợ các ràng buộc như `minLength`, `max`, và cấu trúc lồng nhau (`array`, `object`).

### 2.2 Type Inference Utility
```typescript
// Tự động suy ra kiểu từ schema
type InferType<S extends Schema> =
  S extends { type: "string" } ? string :
  S extends { type: "number" } ? number :
  S extends { type: "boolean" } ? boolean :
  S extends { type: "array"; items: infer Item } ? Item extends Schema ? InferType<Item>[] : never :
  S extends { type: "object"; properties: infer P } ? { [K in keyof P]: P[K] extends Schema ? InferType<P[K]> : never } :
  never;
```

**Giải thích**:
- `InferType` suy ra kiểu TypeScript từ schema, ví dụ: `{ type: "string" }` → `string`.
- Hỗ trợ đệ quy cho `array` và `object`.

### 2.3 Runtime Validator
```typescript
// Hàm validate runtime
function validate(schema: Schema, data: unknown): boolean {
  switch (schema.type) {
    case "string":
      if (typeof data !== "string") return false;
      if (schema.minLength && data.length < schema.minLength) return false;
      if (schema.maxLength && data.length > schema.maxLength) return false;
      return true;

    case "number":
      if (typeof data !== "number") return false;
      if (schema.min !== undefined && data < schema.min) return false;
      if (schema.max !== undefined && data > schema.max) return false;
      return true;

    case "boolean":
      return typeof data === "boolean";

    case "array":
      return Array.isArray(data) && data.every(item => validate(schema.items, item));

    case "object":
      if (typeof data !== "object" || data === null) return false;
      return Object.entries(schema.properties).every(([key, subschema]) =>
        validate(subschema, (data as any)[key])
      );

    default:
      const _never: never = schema;
      return false;
  }
}
```

**Giải thích**:
- `validate` kiểm tra dữ liệu runtime theo schema, áp dụng đệ quy cho `array` và `object`.
- Đảm bảo các ràng buộc như `minLength`, `max` được kiểm tra.

### 2.4 Tạo API Schema
```typescript
// Schema cho API User
const userSchema = {
  type: "object",
  properties: {
    id: { type: "number", min: 1 },
    name: { type: "string", minLength: 3, maxLength: 20 },
    active: { type: "boolean" },
    tags: { type: "array", items: { type: "string" } },
  },
} as const;

type User = InferType<typeof userSchema>;
/*
User = {
  id: number;
  name: string;
  active: boolean;
  tags: string[];
}
*/
```

**Giải thích**:
- `userSchema` định nghĩa cấu trúc và ràng buộc cho dữ liệu User.
- `InferType` tự động suy ra kiểu `User` từ schema.

### 2.5 Middleware API (Express/Fastify Style)
```typescript
// Middleware để validate body
function validateBody<S extends Schema>(schema: S, body: unknown): InferType<S> {
  if (!validate(schema, body)) {
    throw new Error("Invalid request body");
  }
  return body as InferType<S>;
}

// Ví dụ handler Express
function createUserHandler(req: { body: unknown }) {
  const user = validateBody(userSchema, req.body); // user: User (type-safe)
  console.log(user.name.toUpperCase()); // ✅ OK, chắc chắn là string
}
```

### 2.6 Test API Layer
```typescript
// Dữ liệu hợp lệ
createUserHandler({
  body: {
    id: 1,
    name: "Alice",
    active: true,
    tags: ["admin", "editor"],
  },
});

// Dữ liệu không hợp lệ
createUserHandler({
  body: {
    id: 0, // min: 1 -> fail
    name: "Al", // minLength: 3 -> fail
    active: "yes", // boolean expected -> fail
    tags: ["ok"],
  },
}); // ❌ Error: Invalid request body
```

**Giải thích**:
- `validateBody` đảm bảo body request khớp với schema tại runtime.
- TypeScript suy ra kiểu `User` chính xác, đảm bảo an toàn kiểu tại compile-time.

### Lợi ích:
- **Frontend ↔ Backend**: Schema dùng chung cho cả FE (validate form) và BE (validate request).
- **Documentation**: Có thể sinh **OpenAPI docs** từ schema.
- **Security**: Ngăn chặn dữ liệu không hợp lệ gây lỗi hoặc crash.

---

## 3. Mini Project: Zod-like Validation Library (Pro Max)

### 🎯 Mục tiêu
Xây dựng một thư viện validation giống **Zod**, hỗ trợ:
- Chainable API (`z.string().min(3).max(20)`).
- Optional, nullable, default values.
- Union types.
- Error collector thay vì throw ngay.
- Type inference an toàn tại compile-time.

### 3.1 Base Schema & Error Collector
```typescript
// Định nghĩa kiểu validator
type Validator<T> = (val: unknown) => T;

// Lớp lỗi để gom nhiều lỗi
class ValidationError extends Error {
  errors: string[];
  constructor(errors: string[]) {
    super("Validation failed");
    this.errors = errors;
  }
}

// Lớp cơ bản cho schema
class BaseSchema<T> {
  private rules: Validator<T>[] = [];
  private isOptional = false;
  private isNullable = false;
  private defaultValue?: T;

  constructor(private baseCheck: Validator<T>) {
    this.rules.push(baseCheck);
  }

  // Thêm rule validate
  protected refine(check: Validator<T>): this {
    this.rules.push(check);
    return this;
  }

  // Đánh dấu optional
  optional(): this {
    this.isOptional = true;
    return this;
  }

  // Đánh dấu nullable
  nullable(): this {
    this.isNullable = true;
    return this;
  }

  // Thiết lập giá trị mặc định
  default(value: T): this {
    this.defaultValue = value;
    return this;
  }

  // Parse và validate
  parse(val: unknown): T {
    const errors: string[] = [];
    if (val === undefined) {
      if (this.isOptional && this.defaultValue !== undefined) {
        return this.defaultValue;
      }
      if (this.isOptional) return val as T;
      errors.push("Value is required but missing");
    }
    if (val === null) {
      if (this.isNullable) return val as T;
      errors.push("Value cannot be null");
    }
    let result: any = val;
    for (const rule of this.rules) {
      try {
        result = rule(result);
      } catch (e) {
        errors.push((e as Error).message);
      }
    }
    if (errors.length > 0) throw new ValidationError(errors);
    return result;
  }
}
```

**Giải thích**:
- `BaseSchema` cung cấp nền tảng cho các schema, với hỗ trợ `optional`, `nullable`, và `default`.
- `ValidationError` gom tất cả lỗi thay vì throw ngay, giúp báo lỗi chi tiết.

### 3.2 Primitive Schemas
```typescript
// Schema cho string
class StringSchema extends BaseSchema<string> {
  constructor() {
    super((val: unknown) => {
      if (typeof val !== "string") throw new Error("Expected string");
      return val;
    });
  }

  min(len: number) {
    return this.refine((val: unknown) => {
      if (typeof val !== "string" || val.length < len) {
        throw new Error(`String must have min length ${len}`);
      }
      return val;
    });
  }

  max(len: number) {
    return this.refine((val: unknown) => {
      if (typeof val !== "string" || val.length > len) {
        throw new Error(`String must have max length ${len}`);
      }
      return val;
    });
  }

  regex(pattern: RegExp) {
    return this.refine((val: unknown) => {
      if (typeof val !== "string" || !pattern.test(val)) {
        throw new Error(`String does not match ${pattern}`);
      }
      return val;
    });
  }
}

// Schema cho number
class NumberSchema extends BaseSchema<number> {
  constructor() {
    super((val: unknown) => {
      if (typeof val !== "number") throw new Error("Expected number");
      return val;
    });
  }

  min(min: number) {
    return this.refine((val: unknown) => {
      if (typeof val !== "number" || val < min) {
        throw new Error(`Number must be >= ${min}`);
      }
      return val;
    });
  }

  max(max: number) {
    return this.refine((val: unknown) => {
      if (typeof val !== "number" || val > max) {
        throw new Error(`Number must be <= ${max}`);
      }
      return val;
    });
  }
}

// Schema cho boolean
class BooleanSchema extends BaseSchema<boolean> {
  constructor() {
    super((val: unknown) => {
      if (typeof val !== "boolean") throw new Error("Expected boolean");
      return val;
    });
  }
}
```

**Giải thích**:
- Mỗi schema (`StringSchema`, `NumberSchema`, `BooleanSchema`) kế thừa `BaseSchema` và thêm các ràng buộc như `min`, `max`, `regex`.

### 3.3 Array & Object Schema
```typescript
// Schema cho array
class ArraySchema<T> extends BaseSchema<T[]> {
  constructor(private schema: BaseSchema<T>) {
    super((val: unknown) => {
      if (!Array.isArray(val)) throw new Error("Expected array");
      return val.map((item, i) => {
        try {
          return schema.parse(item);
        } catch (e) {
          throw new Error(`Array item ${i}: ${(e as Error).message}`);
        }
      });
    });
  }
}

// Schema cho object
class ObjectSchema<S extends Record<string, BaseSchema<any>>> extends BaseSchema<{
  [K in keyof S]: ReturnType<S[K]["parse"]>;
}> {
  constructor(private shape: S) {
    super((val: unknown) => {
      if (typeof val !== "object" || val === null) throw new Error("Expected object");
      const result: any = {};
      const errors: string[] = [];
      for (const key in shape) {
        try {
          result[key] = shape[key].parse((val as any)[key]);
        } catch (e) {
          errors.push(`${key}: ${(e as Error).message}`);
        }
      }
      if (errors.length > 0) throw new ValidationError(errors);
      return result;
    });
  }
}
```

**Giải thích**:
- `ArraySchema` validate từng phần tử của mảng theo schema con.
- `ObjectSchema` validate từng thuộc tính của object theo schema con, với type inference chính xác.

### 3.4 Union Schema
```typescript
// Schema cho union
class UnionSchema<T> extends BaseSchema<T> {
  constructor(private schemas: BaseSchema<any>[]) {
    super((val: unknown) => {
      const errors: string[] = [];
      for (const s of schemas) {
        try {
          return s.parse(val);
        } catch (e) {
          errors.push((e as Error).message);
        }
      }
      throw new ValidationError(errors);
    });
  }
}
```

**Giải thích**:
- `UnionSchema` thử validate giá trị với từng schema trong danh sách, trả về giá trị hợp lệ đầu tiên hoặc ném lỗi với tất cả thông báo.

### 3.5 Factory API (z)
```typescript
const z = {
  string: () => new StringSchema(),
  number: () => new NumberSchema(),
  boolean: () => new BooleanSchema(),
  array: <T>(schema: BaseSchema<T>) => new ArraySchema(schema),
  object: <S extends Record<string, BaseSchema<any>>>(shape: S) => new ObjectSchema(shape),
  union: <T extends BaseSchema<any>[]>(schemas: [...T]) => new UnionSchema<Infer<T[number]>>(schemas),
};
```

**Giải thích**:
- `z` cung cấp API giống Zod, với các phương thức để tạo schema cho string, number, boolean, array, object, và union.

### 3.6 Inference Utility
```typescript
type Infer<T> = T extends BaseSchema<infer R> ? R : never;
```

**Giải thích**:
- `Infer` suy ra kiểu TypeScript từ schema, đảm bảo type-safe tại compile-time.

### 3.7 Ví dụ sử dụng
```typescript
// Định nghĩa schema
const userSchema = z.object({
  id: z.number().min(1).default(100),
  name: z.string().min(3).max(20).regex(/^[A-Za-z]+$/),
  email: z.string().optional(),
  active: z.boolean().nullable(),
  role: z.union([z.string().regex(/^(admin|user)$/), z.number().min(0).max(1)]),
  tags: z.array(z.string().min(2)).optional(),
});

// Suy ra kiểu
type User = Infer<typeof userSchema>;
/*
User = {
  id: number;
  name: string;
  email?: string;
  active: boolean | null;
  role: string | number;
  tags?: string[];
}
*/

// Dữ liệu hợp lệ
const goodUser = userSchema.parse({
  name: "Alice",
  active: null,
  role: "admin",
});
console.log("Valid user:", goodUser); // { id: 100, name: "Alice", active: null, role: "admin" }

// Dữ liệu không hợp lệ
try {
  userSchema.parse({
    id: 0, // min: 1
    name: "Al", // minLength: 3
    role: "super", // Không khớp admin|user
    active: "yes", // Không phải boolean
  });
} catch (e) {
  console.error("Validation errors:", (e as ValidationError).errors);
  // ["id: Number must be >= 1", "name: String must have min length 3", "role: ...", "active: Expected boolean"]
}
```

**Giải thích**:
- `userSchema` định nghĩa cấu trúc và ràng buộc phức tạp, với hỗ trợ `optional`, `nullable`, `default`, và `union`.
- `parse` kiểm tra runtime và ném `ValidationError` nếu dữ liệu không hợp lệ, với danh sách lỗi chi tiết.

### Lợi ích:
- **Chainable API**: Hỗ trợ gọi liên tiếp như `z.string().min(3).max(20)`.
- **Type inference**: Tự động suy ra kiểu TypeScript chính xác.
- **Error reporting**: Gom lỗi thay vì throw ngay, giúp hiển thị thông báo thân thiện.

---

## 4. Mini Project: Recursive JSON Schema Validator

### 🎯 Mục tiêu
Xây dựng một schema validator cho dữ liệu JSON, đảm bảo cả compile-time và runtime safety.

### 4.1 Định nghĩa JSON Value Type
```typescript
// Kiểu compile-time cho JSON
type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };
```

**Giải thích**:
- `JsonValue` là một recursive type mô tả cấu trúc JSON hợp lệ.

### 4.2 Schema để Validate JSON
```typescript
// Schema cho JSON
class JsonSchema extends BaseSchema<JsonValue> {
  constructor() {
    super((val: unknown) => {
      if (
        typeof val === "string" ||
        typeof val === "number" ||
        typeof val === "boolean" ||
        val === null
      ) {
        return val;
      }
      if (Array.isArray(val)) {
        return val.map((v, i) => {
          try {
            return new JsonSchema().parse(v);
          } catch (e) {
            throw new Error(`Array[${i}] ${(e as Error).message}`);
          }
        });
      }
      if (typeof val === "object" && val !== null) {
        const result: Record<string, JsonValue> = {};
        for (const [k, v] of Object.entries(val)) {
          result[k] = new JsonSchema().parse(v);
        }
        return result;
      }
      throw new Error("Invalid JSON value");
    });
  }
}
```

**Giải thích**:
- `JsonSchema` kế thừa `BaseSchema` và validate dữ liệu JSON đệ quy.
- Hỗ trợ tất cả kiểu JSON hợp lệ, ném lỗi nếu gặp giá trị không thuộc JSON (như `Date`).

### 4.3 Factory API
```typescript
const z = {
  json: () => new JsonSchema(),
  // Các phương thức khác từ phần Zod-like...
};
```

### 4.4 Dùng thử
```typescript
const jsonSchema = z.json();

// Dữ liệu JSON hợp lệ
const goodJson = {
  id: 1,
  name: "Alice",
  active: true,
  profile: {
    hobbies: ["coding", "reading"],
    age: 25,
  },
};
console.log(jsonSchema.parse(goodJson)); // ✅ OK, giữ nguyên object

// Dữ liệu không hợp lệ
try {
  jsonSchema.parse({
    id: 1,
    invalid: new Date(), // ❌ Date không phải JSON
  });
} catch (e) {
  console.error("Validation error:", (e as ValidationError).message);
  // Validation error: Invalid JSON value
}
```

**Giải thích**:
- `jsonSchema` đảm bảo dữ liệu là JSON hợp lệ cả tại compile-time (qua `JsonValue`) và runtime (qua `parse`).
- Ngăn chặn các giá trị không hợp lệ như `Date`, `function`, hoặc `undefined`.

### Lợi ích:
- **Frontend ↔ Backend**: Đảm bảo payload API chỉ chứa các kiểu JSON hợp lệ.
- **Microservices**: Validate message trước khi publish vào Kafka/RabbitMQ.
- **Security**: Chặn các payload bất thường gây crash hoặc leak dữ liệu.

---

## 5. Mini Demo: Validate API Payload với JsonSchema

### 🎯 Mục tiêu
Áp dụng `JsonSchema` vào một API handler để validate payload.

### 5.1 Fake API Handler
```typescript
// Handler giả lập API
function handleApiRequest(payload: unknown) {
  const schema = new JsonSchema();
  try {
    const validData = schema.parse(payload);
    console.log("✅ API received valid JSON:", validData);
  } catch (err) {
    console.error("❌ Invalid JSON payload:", (err as Error).message);
  }
}
```

### 5.2 Client gửi dữ liệu hợp lệ
```typescript
handleApiRequest({
  id: 123,
  name: "Alice",
  active: true,
  profile: {
    hobbies: ["coding", "reading"],
  },
});
```

**Kết quả**:
```
✅ API received valid JSON: { id: 123, name: "Alice", active: true, profile: { hobbies: ["coding", "reading"] } }
```

### 5.3 Client gửi dữ liệu không hợp lệ
```typescript
handleApiRequest({
  id: 123,
  createdAt: new Date(), // ❌ Date không thuộc JSON
});
```

**Kết quả**:
```
❌ Invalid JSON payload: Invalid JSON value
```

### Lợi ích:
- **Type Safety**: Compile-time đảm bảo payload là `JsonValue`.
- **Runtime Safety**: Validate runtime chặn các giá trị không hợp lệ.
- **Enterprise Hardening**: Được sử dụng trong API Gateway hoặc service logic để bảo vệ hệ thống.

---

## 6. Kết luận

- **Recursive Types** cho phép mô hình hóa dữ liệu lồng nhau phức tạp, như JSON, config, hoặc schema.
- **Type-Safe Config System** sử dụng `DeepPartial` và `DeepMerge` để tạo config linh hoạt, an toàn kiểu, giống các framework lớn như Next.js.
- **Type-Safe API Validator** kết hợp recursive types và runtime validation, đảm bảo đồng bộ kiểu giữa FE và BE.
- **Zod-like Validation Library** cung cấp API chainable, hỗ trợ optional, nullable, union, và error collector, gần giống Zod bản gốc.
- **JSON Schema Validator** đảm bảo dữ liệu JSON hợp lệ cả compile-time và runtime, phù hợp cho API và microservices.
- Các pattern này là nền tảng của các thư viện enterprise như **Zod**, **tRPC**, **Fastify**, và **NestJS**.

---

## 7. Bước tiếp theo
- **Thực hành**: Thêm hỗ trợ async validation (`refineAsync`) cho các schema.
- **Khám phá**: Sinh **OpenAPI specs** tự động từ schema.
- **Mở rộng**: Kết hợp với **branded types** (ví dụ: `UserId = string & { __brand: "UserId" }`) để tăng tính an toàn kiểu.

Tài liệu này cung cấp nền tảng vững chắc cho người mới và các kiến thức cấp doanh nghiệp cho lập trình viên muốn thành thạo TypeScript. Nếu bạn có câu hỏi hoặc cần giải thích thêm, hãy hỏi nhé! 🚀

---
📌 [<< Ngày 38](./Day38.md) | [Ngày 40 >>](./Day40.md)