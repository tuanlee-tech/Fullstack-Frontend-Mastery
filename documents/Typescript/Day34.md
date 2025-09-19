# 📘 Day 34 — Conditional Types & infer

---

## 1️⃣ Conditional Types là gì?

Cú pháp:

```ts
T extends U ? X : Y
```

Nghĩa:

* Nếu `T` **extends** (tương thích) với `U` → kết quả là `X`.
* Ngược lại → kết quả là `Y`.

Ví dụ:

```ts
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
```

👉 Đây là “if-else” nhưng cho **type system**.

---

## 2️⃣ Ứng dụng cơ bản

### a. Loại bỏ null/undefined

```ts
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>; // string
```

### b. Extract vs Exclude

```ts
type Extract<T, U> = T extends U ? T : never;
type Exclude<T, U> = T extends U ? never : T;

type A = Extract<"a" | "b" | "c", "a" | "c">; // "a" | "c"
type B = Exclude<"a" | "b" | "c", "a">;       // "b" | "c"
```

---

## 3️⃣ infer keyword

`infer` cho phép **trích xuất type** trong conditional type.

### a. Lấy return type của function

```ts
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Fn = (a: number) => string;
type Result = ReturnType<Fn>; // string
```

### b. Lấy tham số function

```ts
type ParamType<T> = T extends (arg: infer P) => any ? P : never;

type Fn = (id: number) => string;
type Arg = ParamType<Fn>; // number
```

### c. Lấy type bên trong Promise

```ts
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type A = UnwrapPromise<Promise<number>>; // number
type B = UnwrapPromise<string>;          // string
```

---

## 4️⃣ Distributive Conditional Types

Conditional type **tự động phân phối** qua union type.

```ts
type ToArray<T> = T extends any ? T[] : never;

type A = ToArray<string | number>; 
// string[] | number[]
```

⚠️ Cẩn thận: đôi khi cần bọc trong `[...]` để tránh phân phối:

```ts
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;

type B = ToArrayNonDist<string | number>;
// (string | number)[]
```

---

## 5️⃣ Ứng dụng thực tế

### a. Type-safe API Response

```ts
type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };

type ExtractData<T> = T extends { success: true; data: infer D } ? D : never;

type UserResp = ApiResponse<{ id: number; name: string }>;
type UserData = ExtractData<UserResp>; 
// { id: number; name: string }
```

### b. Deep Promise Unwrap

```ts
type DeepUnwrap<T> = T extends Promise<infer U> ? DeepUnwrap<U> : T;

type A = DeepUnwrap<Promise<Promise<string>>>; 
// string
```

---

## 6️⃣ Bài tập

### Level 1

Viết type `IsBoolean<T>` trả về `true` nếu `T` là `boolean`, ngược lại `false`.

---

### Level 2

Viết type `First<T>` lấy phần tử đầu tiên của tuple:

```ts
type A = First<[string, number, boolean]>; // string
type B = First<[]>; // never
```

---

### Level 3

Viết type `Flatten<T>`:

* Nếu `T` là `Array<infer U>` → trả về `U`.
* Ngược lại → trả về `T`.

```ts
type A = Flatten<number[]>; // number
type B = Flatten<string>;   // string
```

---

### Level 4 (enterprise)

Viết type `DeepReadonly<T>` biến tất cả property (bao gồm nested object) thành `readonly`.

```ts
type Example = {
  id: number;
  profile: {
    name: string;
    age: number;
  };
};

type Result = DeepReadonly<Example>;
/*
{
  readonly id: number;
  readonly profile: {
    readonly name: string;
    readonly age: number;
  };
}
*/
```

---

## 7️⃣ Checklist trước khi sang Day 35

* [ ] Hiểu conditional types (`T extends U ? X : Y`).
* [ ] Biết dùng `infer` để extract return type, param type, promise value.
* [ ] Hiểu distributive conditional types và cách ngăn chặn.
* [ ] Làm được bài tập Level 3.
* [ ] Thử implement `DeepReadonly` (Level 4).

---
Lời giải chi tiết cho **tất cả bài tập Day 34** (Level 1 → 4).

---

# ✅ Lời giải chi tiết — Day 34 Exercises

---

## 🔹 Level 1: `IsBoolean<T>`

### Đề:

Viết type `IsBoolean<T>` trả về `true` nếu `T` là `boolean`, ngược lại `false`.

### Giải:

```ts
type IsBoolean<T> = T extends boolean ? true : false;

// Test
type A = IsBoolean<boolean>; // true
type B = IsBoolean<string>;  // false
type C = IsBoolean<number>;  // false
```

### Giải thích:

* Conditional types cho phép so sánh `T` với `boolean`.
* Nếu `T` extends boolean → `true`, ngược lại `false`.
* Đây chính là cách viết "if type == boolean" trong TypeScript.

---

## 🔹 Level 2: `First<T>`

### Đề:

Viết type `First<T>` lấy phần tử đầu tiên của tuple:

```ts
type A = First<[string, number, boolean]>; // string
type B = First<[]>; // never
```

### Giải:

```ts
type First<T extends any[]> = T extends [infer F, ...any[]] ? F : never;

// Test
type A = First<[string, number, boolean]>; // string
type B = First<[]>; // never
```

### Giải thích:

* `infer F` giúp bắt được phần tử đầu tiên trong tuple.
* Nếu tuple rỗng → không match pattern `[infer F, ...any[]]` → kết quả `never`.
* Đây là ứng dụng rất phổ biến của `infer` để “pattern match” trong tuple types.

---

## 🔹 Level 3: `Flatten<T>`

### Đề:

Viết type `Flatten<T>`:

* Nếu `T` là `Array<infer U>` → trả về `U`.
* Ngược lại → trả về `T`.

### Giải:

```ts
type Flatten<T> = T extends (infer U)[] ? U : T;

// Test
type A = Flatten<number[]>;   // number
type B = Flatten<string>;     // string
type C = Flatten<string[][]>; // string[]
```

### Giải thích:

* `(infer U)[]` nghĩa là “một mảng chứa các phần tử type `U`”.
* Nếu `T` đúng là array thì unwrap ra `U`.
* Nếu không phải array thì giữ nguyên `T`.
* Đây là base case để sau này xây dựng `DeepFlatten`.

---

## 🔹 Level 4 (Enterprise): `DeepReadonly<T>`

### Đề:

Viết type `DeepReadonly<T>` biến tất cả property (bao gồm nested object) thành `readonly`.

### Giải:

```ts
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

// Test
type Example = {
  id: number;
  profile: {
    name: string;
    age: number;
  };
};

type Result = DeepReadonly<Example>;
/*
{
  readonly id: number;
  readonly profile: {
    readonly name: string;
    readonly age: number;
  };
}
*/
```

### Giải thích:

1. `[K in keyof T]` — mapped type, lặp qua tất cả key của `T`.
2. `readonly` — thêm modifier để biến property thành bất biến.
3. `T[K] extends object ? DeepReadonly<T[K]> : T[K]` — nếu giá trị là object → gọi đệ quy `DeepReadonly`, ngược lại giữ nguyên.
4. Kết quả là toàn bộ cây object được đóng băng về mặt type (không thể gán lại property).

⚠️ Lưu ý:

* `object` trong TS cũng match `Array` và `Function`. Nếu muốn exclude function thì viết chặt hơn:

  ```ts
  type DeepReadonly<T> = {
    readonly [K in keyof T]: T[K] extends object 
      ? T[K] extends (...args: any[]) => any 
        ? T[K] 
        : DeepReadonly<T[K]> 
      : T[K];
  };
  ```

---

# 🎯 Tóm lại

* **Level 1**: Kiểm tra type đơn giản với conditional types.
* **Level 2**: Dùng `infer` để bắt phần tử đầu tiên trong tuple.
* **Level 3**: Dùng `infer` để unwrap array.
* **Level 4**: Kết hợp mapped types + conditional types + recursion để tạo utility mạnh mẽ (`DeepReadonly`).

---

# 🔍 Mở rộng Day 34 — Deep Utility Types

---

## 1️⃣ DeepPartial<T>

### Ý nghĩa

* Biến tất cả property thành optional (`?`).
* Áp dụng cả cho nested object.

### Code:

```ts
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

// Test
type Example = {
  id: number;
  profile: {
    name: string;
    age: number;
  };
};

type PartialExample = DeepPartial<Example>;
/*
{
  id?: number;
  profile?: {
    name?: string;
    age?: number;
  };
}
*/
```

👉 Thường dùng khi: update object một phần (PATCH API).

---

## 2️⃣ DeepRequired<T>

### Ý nghĩa

* Ngược lại với `DeepPartial`.
* Tất cả property (kể cả nested) đều **bắt buộc**.

### Code:

```ts
type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K];
};

// Test
type OptionalExample = {
  id?: number;
  profile?: {
    name?: string;
    age?: number;
  };
};

type RequiredExample = DeepRequired<OptionalExample>;
/*
{
  id: number;
  profile: {
    name: string;
    age: number;
  };
}
*/
```

👉 Rất hữu ích khi muốn ép dữ liệu thành "đầy đủ 100%" trước khi xử lý.

---

## 3️⃣ DeepNonNullable<T>

### Ý nghĩa

* Loại bỏ `null | undefined` khỏi mọi property, kể cả nested.

### Code:

```ts
type DeepNonNullable<T> = {
  [K in keyof T]: T[K] extends object
    ? DeepNonNullable<NonNullable<T[K]>>
    : NonNullable<T[K]>;
};

// Test
type Example = {
  id: number | null;
  profile?: {
    name: string | null;
    age?: number | null;
  } | null;
};

type Cleaned = DeepNonNullable<Example>;
/*
{
  id: number;
  profile: {
    name: string;
    age: number;
  };
}
*/
```

👉 Thường dùng khi dữ liệu từ API có nhiều `null` nhưng code logic muốn đảm bảo “sạch”.

---

## 4️⃣ DeepMutable<T>

### Ý nghĩa

* Loại bỏ `readonly` khỏi toàn bộ property (bao gồm nested).

### Code:

```ts
type DeepMutable<T> = {
  -readonly [K in keyof T]: T[K] extends object ? DeepMutable<T[K]> : T[K];
};

// Test
type Example = {
  readonly id: number;
  readonly profile: {
    readonly name: string;
    readonly age: number;
  };
};

type Mutable = DeepMutable<Example>;
/*
{
  id: number;
  profile: {
    name: string;
    age: number;
  };
}
*/
```

👉 Hữu ích khi làm việc với dữ liệu từ lib ngoài vốn bị `readonly`.

---

## 5️⃣ So sánh các “Deep Utility”

| Utility              | Tác dụng                                    | Khi dùng                   |                 |
| -------------------- | ------------------------------------------- | -------------------------- | --------------- |
| `DeepPartial<T>`     | Cho phép thiếu bất kỳ property nào (nested) | PATCH API, config optional |                 |
| `DeepRequired<T>`    | Ép toàn bộ property phải có                 | Validation sau khi merge   |                 |
| `DeepNonNullable<T>` | Bỏ hết \`null                               | undefined\`                | Dọn dữ liệu API |
| `DeepReadonly<T>`    | Đóng băng toàn bộ object, kể cả nested      | State management           |                 |
| `DeepMutable<T>`     | Loại bỏ `readonly`, cho phép sửa đổi        | Clone và mutate object     |                 |

---



# 📝 Bài tập  (Mở rộng)

---

## 1️⃣ DeepPick\<T, K>

### Yêu cầu

Chọn property theo **đường dẫn (path)**, ví dụ `"profile.name"`.

### Ý tưởng

* Tách key bằng dấu `"."`.
* Nếu chỉ là key gốc → pick như bình thường.
* Nếu có `"."` → đi sâu vào nested object.

### Code


### 1. **Split - Tách chuỗi thành mảng**

Trước tiên, chúng ta cần một utility type để tách chuỗi thành một mảng các phần tử, phân tách bởi một dấu phân cách.

```ts
type Split<S extends string, D extends string> =
  S extends `${infer Head}${D}${infer Tail}`
    ? [
        Head, // Lấy phần trước dấu phân cách (D)
        ...Split<Tail, D> // Đệ quy với phần còn lại
      ]
    : [S]; // Khi không còn dấu phân cách, trả về mảng chứa chuỗi ban đầu
```

#### Giải thích:

* **`S extends `\${infer Head}\${D}\${infer Tail}\`\`**: Đây là cách sử dụng template literal types để tách chuỗi `S` thành 3 phần:

  * `Head`: Phần trước dấu phân cách.
  * `Tail`: Phần còn lại sau dấu phân cách.
* **`[Head, ...Split<Tail, D>]`**: Khi chuỗi có dấu phân cách, ta lấy phần đầu (`Head`) và gọi đệ quy cho phần còn lại (`Tail`).
* **`[S]`**: Khi không còn dấu phân cách, trả về mảng chỉ chứa chính chuỗi `S`.

**Ví dụ:**

```ts
type Result = Split<"a.b.c", ".">;
// Kết quả: ["a", "b", "c"]
```

---

### 2. **UnionToIntersection - Hợp nhất nhiều type thành một**

Để kết hợp các loại trong một **union type** thành một **intersection type**, ta cần một helper type như sau:

```ts
type UnionToIntersection<U> =
  (U extends any ? (x: U) => any : never) extends (x: infer I) => any ? I : never;
```

#### Giải thích:

* **`U extends any ? (x: U) => any : never`**: Dùng để tạo một hàm với tham số là `U`. Điều này giúp tạo ra một **union** của tất cả các loại trong `U`.
* **`(x: infer I) => any`**: Dùng `infer` để trích xuất kiểu của tham số `x`.
* **`I`**: Đây là kiểu cuối cùng mà chúng ta cần, chính là **intersection** của tất cả các loại trong `U`.

**Ví dụ:**

```ts
type A = { a: number };
type B = { b: string };
type Union = A | B;

type Intersection = UnionToIntersection<Union>;
// Kết quả: { a: number } & { b: string }
```

---

### 3. **DeepPickPath - Chọn trường theo đường dẫn**

Đây là phần quan trọng nhất trong code. `DeepPickPath` sẽ chọn một trường con từ đối tượng `T` theo đường dẫn được chỉ định bằng mảng các key.

```ts
type DeepPickPath<T, Parts extends string[]> =
  Parts extends [infer Head, ...infer Rest]
    ? Head extends keyof T // Kiểm tra xem Head có phải là key của T không?
      ? Rest extends string[] // Nếu Rest còn phần tử
        ? { [K in Head]: DeepPickPath<T[Head], Rest> } // Đệ quy với đối tượng con T[Head]
        : { [K in Head]: T[Head] } // Nếu Rest rỗng, trả về kiểu của T[Head]
      : never
    : T; // Nếu Parts rỗng, trả về T
```

#### Giải thích:

* **`Parts extends [infer Head, ...infer Rest]`**: Chia mảng `Parts` thành phần đầu tiên (`Head`) và phần còn lại (`Rest`).
* **`Head extends keyof T`**: Kiểm tra xem `Head` có phải là key của đối tượng `T` không.
* **`Rest extends string[]`**: Nếu vẫn còn phần tử trong `Rest`, tiếp tục đệ quy qua đối tượng con `T[Head]`.
* **`{ [K in Head]: T[Head] }`**: Nếu không còn phần tử nào trong `Rest`, trả về trường tương ứng với key `Head`.
* **`T`**: Nếu `Parts` rỗng, trả về toàn bộ đối tượng `T`.

**Ví dụ:**

```ts
type Example = {
  id: number;
  profile: { name: string; age: number; address: string };
};

type Result = DeepPickPath<Example, ["profile", "name"]>;
// Kết quả: { profile: { name: string } }
```

---

### 4. **DeepPick - Chọn trường theo path**

Cuối cùng, chúng ta cần một type chính để thực hiện **deep pick** từ một object, dựa trên đường dẫn mô tả bởi một chuỗi (string). Đây chính là loại `DeepPick` mà bạn đã yêu cầu.

```ts
type DeepPick<T, K extends string> = UnionToIntersection<
  K extends any ? DeepPickPath<T, Split<K, ".">> : never
>;
```

#### Giải thích:

* **`K extends any`**: Lặp qua tất cả các giá trị trong `K` (đây là một **union type** của các key paths).
* **`Split<K, ".">`**: Tách chuỗi `K` thành một mảng các key bằng cách sử dụng utility type `Split`. Ví dụ: `"profile.name"` sẽ được tách thành `["profile", "name"]`.
* **`DeepPickPath<T, Split<K, ".">>`**: Sử dụng `DeepPickPath` để chọn các trường từ đối tượng `T` theo mảng key đã tách.
* **`UnionToIntersection`**: Chuyển union của các kết quả trả về từ `DeepPickPath` thành intersection, giúp kết hợp tất cả các trường lại với nhau.

**Ví dụ:**

```ts
type Example = {
  id: number;
  profile: { name: string; age: number; address: string };
};

type Picked = DeepPick<Example, "id" | "profile.name">;
/*
Kết quả Picked = 
{
  id: number;
  profile: { name: string }
}
*/
```

#### Giải thích:

* **`"id"`** sẽ chọn trường `id` từ đối tượng `Example`, kết quả là `id: number`.
* **`"profile.name"`** sẽ chọn trường `name` từ đối tượng con `profile`, kết quả là `profile: { name: string }`.

---

### **Tóm tắt**

1. **`Split`**: Tách chuỗi path thành mảng các phần tử, ví dụ `"a.b.c"` thành `["a", "b", "c"]`.
2. **`UnionToIntersection`**: Chuyển union type thành intersection type để kết hợp các kết quả.
3. **`DeepPickPath`**: Lựa chọn các trường theo đường dẫn (key path) được mô tả trong mảng.
4. **`DeepPick`**: Dùng để lựa chọn trường từ object theo path, hỗ trợ cả các object lồng nhau.

---

### **Ví dụ hoàn chỉnh:**

```ts
type Example = {
  id: number;
  profile: { name: string; age: number; address: string };
};

type Picked = DeepPick<Example, "id" | "profile.name">;
/*
Kết quả Picked = 
{
  id: number;
  profile: { name: string }
}
*/
```



✅ Giải thích:

* `"profile.name"` → Split thành `["profile", "name"]`.
* Lấy `profile` từ `Example` → đi sâu vào object.
* Lấy tiếp `name` → kết quả `{ profile: { name: string } }`.
* Gộp với `"id"` → thành final type.

---

## 2️⃣ DeepMerge\<A, B>

### Yêu cầu

Merge hai type, nếu cùng key → lấy type từ `B`.
Nếu cả hai đều là object → merge đệ quy.

### Code

```ts
type DeepMerge<A, B> = {
  [K in keyof A | keyof B]:  // Lặp qua tất cả các khóa trong A và B
    K extends keyof B           // Nếu K có trong B
      ? K extends keyof A       // Nếu K cũng có trong A
        ? A[K] extends object   // Nếu A[K] là object
          ? B[K] extends object // Nếu B[K] là object
            ? DeepMerge<A[K], B[K]> // Đệ quy để hợp nhất object con
            : B[K]             // Nếu B[K] không phải object, B ghi đè A
          : B[K]               // Nếu A[K] không phải object, B ghi đè A
        : B[K]                 // Nếu chỉ có B
      : K extends keyof A      // Nếu chỉ có A
        ? A[K]                 // Chỉ lấy giá trị từ A
        : never;               // Nếu không có trong cả A và B, trả về never
};


// Test
type A = { id: number; profile: { name: string } };
type B = { profile: { age: number } };

type Merged = DeepMerge<A, B>;
/*
{
  id: number;
  profile: {
    name: string;
    age: number;
  }
}
*/
```

✅ Giải thích:

* Key nào chỉ có ở `A` → giữ nguyên.
* Key nào chỉ có ở `B` → thêm mới.
* Key trùng → merge nếu là object, còn không thì `B` ghi đè.

---

## 3️⃣ DeepOmit\<T, K>

### Yêu cầu

Loại bỏ property theo **đường dẫn (path)**.

### Ý tưởng

* Tách `K` bằng `"."`.
* Nếu chỉ là key gốc → bỏ hẳn.
* Nếu nested → đi sâu vào object, chỉ bỏ key cuối.

### Code

```ts
type DeepOmit<T, K extends string> =
  K extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T
      ? { [P in keyof T]: P extends Key ? DeepOmit<T[P], Rest> : T[P] }
      : T
    : Omit<T, K>;

// Test
type Example = {
  id: number;
  profile: { name: string; age: number };
};

type Omitted = DeepOmit<Example, "profile.age">;
/*
{
  id: number;
  profile: { name: string }
}
*/
```

✅ Giải thích:

* `"profile.age"` → split thành `"profile"` + `"age"`.
* Đi vào `profile` → gọi tiếp `DeepOmit<T["profile"], "age">`.
* Bỏ `"age"` trong nested object.

---

# 📌 Kết quả đạt được

* `DeepPick` → chọn chính xác property theo path.
* `DeepMerge` → hợp nhất type phức tạp.
* `DeepOmit` → loại bỏ property nested.

---

📌 [<< Ngày 33](./Day33.md) | [Ngày 35 >>](./Day35.md)