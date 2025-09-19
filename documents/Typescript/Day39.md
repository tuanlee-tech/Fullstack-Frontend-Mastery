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

Tài liệu này cung cấp nền tảng vững chắc cho người mới bắt đầu và các kiến thức nâng cao cho những ai muốn thành thạo TypeScript với recursive types. Nếu bạn có câu hỏi hoặc cần giải thích thêm, hãy hỏi nhé! 🚀

---
📌 [<< Ngày 38](./Day38.md) | [Ngày 40 >>](./Day40.md)