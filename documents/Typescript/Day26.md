# 🟩 Day 26: Form Handling với TypeScript + React Hook Form

---

## 1. Vấn đề thực tế

Form là nơi dữ liệu **từ user → backend**.
Những vấn đề phổ biến:

* Người dùng nhập dữ liệu sai → crash UI.
* Backend nhận dữ liệu không hợp lệ → bug / security issue.
* State form phức tạp: nested fields, nhiều bước, async validation.

👉 Giải pháp:
✅ **React Hook Form (RHF)** → quản lý state form hiệu quả.
✅ **TypeScript** → type-safe, hạn chế bug.
✅ **Schema validation (Zod/Yup)** → chuẩn hóa dữ liệu.

---

## 2. Setup Project

```bash
npm install react-hook-form zod @hookform/resolvers
```

---

## 3. Form cơ bản với TypeScript

```tsx
import React from "react";
import { useForm } from "react-hook-form";

// 1. Định nghĩa type cho dữ liệu form
type LoginForm = {
  email: string;
  password: string;
};

export default function Login() {
  // 2. Khởi tạo React Hook Form với type an toàn
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  // 3. Submit handler
  const onSubmit = (data: LoginForm) => {
    console.log("✅ Form Data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Email */}
      <input
        {...register("email", { required: "Email là bắt buộc" })}
        placeholder="Email"
      />
      {errors.email && <p>{errors.email.message}</p>}

      {/* Password */}
      <input
        type="password"
        {...register("password", { required: "Mật khẩu bắt buộc" })}
        placeholder="Password"
      />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit">Đăng nhập</button>
    </form>
  );
}
```

👉 TypeScript sẽ cảnh báo nếu thiếu field.

---

## 4. Kết hợp với Zod Validation

```tsx
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// 1. Schema validation
const LoginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
});

// 2. Infer type
type LoginForm = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    console.log("✅ Validated Data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} placeholder="Email" />
      {errors.email && <p>{errors.email.message}</p>}

      <input type="password" {...register("password")} placeholder="Password" />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit">Đăng nhập</button>
    </form>
  );
}
```

---

## 5. Enterprise Use Cases

### a) Form phức tạp (nested objects)

```ts
const UserSchema = z.object({
  name: z.string(),
  address: z.object({
    city: z.string(),
    zipcode: z.string(),
  }),
});
type UserForm = z.infer<typeof UserSchema>;
```

### b) Async Validation (check email tồn tại)

```tsx
<input
  {...register("email", {
    validate: async (value) => {
      const exists = await fetch(`/api/check-email?email=${value}`).then((r) =>
        r.json()
      );
      return exists ? "Email đã được đăng ký" : true;
    },
  })}
/>
```

### c) Kết hợp với API Response Type

```ts
type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error"; message: string };

async function submitForm(data: LoginForm): Promise<ApiResponse<LoginForm>> {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return { status: "success", data: await res.json() };
  } catch (e) {
    return { status: "error", message: "Login failed" };
  }
}
```

---

## 6. Advanced Usage — Build Complex & Accessible Forms

### 6.1 Accessibility (A11y)

```tsx
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  aria-invalid={errors.email ? "true" : "false"}
  aria-describedby="email-error"
  {...register("email", { required: "Email là bắt buộc" })}
/>
{errors.email && <span id="email-error">{errors.email.message}</span>}
```

---

### 6.2 Wizard Form / Funnel

```tsx
function WizardForm() {
  const [step, setStep] = useState(1);
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(console.log)}>
      {step === 1 && (
        <>
          <input {...register("name")} placeholder="Name" />
          <button type="button" onClick={() => setStep(2)}>Next</button>
        </>
      )}
      {step === 2 && (
        <>
          <input {...register("email")} placeholder="Email" />
          <button type="submit">Submit</button>
        </>
      )}
    </form>
  );
}
```

---

### 6.3 Smart Form Component

```tsx
function InputField({ label, name, register, error }: any) {
  return (
    <div>
      <label>{label}</label>
      <input {...register(name)} />
      {error && <span>{error.message}</span>}
    </div>
  );
}
```

---

### 6.4 Error Messages + i18n

```tsx
<input {...register("username", { required: "⚠️ Username required" })} />
{errors.username && <p role="alert">{errors.username.message}</p>}
```

---

### 6.5 Connect Form (FormProvider)

```tsx
import { FormProvider, useForm, useFormContext } from "react-hook-form";

function ChildInput({ name }: { name: string }) {
  const { register } = useFormContext();
  return <input {...register(name)} />;
}

export default function ParentForm() {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(console.log)}>
        <ChildInput name="email" />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}
```

---

### 6.6 Performance Optimization

```tsx
const Input = React.memo(({ name }: { name: string }) => {
  const { register } = useFormContext();
  return <input {...register(name)} />;
});
```

---

### 6.7 Controlled + Uncontrolled

```tsx
<Controller
  control={control}
  name="dob"
  render={({ field }) => (
    <DatePicker selected={field.value} onChange={field.onChange} />
  )}
/>
```

---

### 6.8 Custom Hook with Resolver

```tsx
const schema = z.object({ email: z.string().email() });
function useLoginForm() {
  return useForm({ resolver: zodResolver(schema) });
}
```

---

### 6.9 Virtualized Lists

```tsx
import { FixedSizeList } from "react-window";

function BigForm({ fields }: { fields: string[] }) {
  return (
    <FixedSizeList height={400} itemCount={fields.length} itemSize={35}>
      {({ index, style }) => (
        <div style={style}>
          <input type="checkbox" name={fields[index]} />
          {fields[index]}
        </div>
      )}
    </FixedSizeList>
  );
}
```

---

### 6.10 Testing Form

```tsx
test("shows error when email is empty", async () => {
  render(<MyForm />);
  fireEvent.submit(screen.getByRole("button"));
  expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
});
```

---

### 6.11 Transform and Parse

```tsx
const onSubmit = (data: any) => {
  const payload = {
    ...data,
    dob: new Date(data.dob).toISOString(),
  };
  fetch("/api/users", { method: "POST", body: JSON.stringify(payload) });
};
```

---

## 7. Mini Project — Registration Form

Yêu cầu:

* Input: `username`, `email`, `password`, `confirmPassword`.
* Validate với Zod.
* Submit data lên API (fake).
* Show loading + success/error.
* Có A11y, i18n error, performance tối ưu.

---

## 8. Bài tập

### Level 1

* Tạo contact form (name, email, message) có validate required.

### Level 2

* Thêm validation Zod: email hợp lệ, message ≥ 10 ký tự.

### Level 3 (Mini Project Enterprise)

* Registration form đầy đủ:

  * Wizard (multi-step).
  * Smart Input + FormProvider.
  * i18n error messages.
  * Submit lên API giả lập.
  * Test với React Testing Library.
  * Optimize khi có 100+ fields.

---


####  Exercises Solutions

## 🔹 Level 1

### 1. Tạo form đăng ký (register form) với các trường cơ bản

```tsx
import React from "react";
import { useForm } from "react-hook-form";

// Định nghĩa kiểu dữ liệu cho form
type FormData = {
  username: string;
  email: string;
  password: string;
};

export default function RegisterForm() {
  // useForm hook quản lý form
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  // Hàm xử lý khi submit
  const onSubmit = (data: FormData) => {
    console.log("Submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Input username */}
      <input
        placeholder="Username"
        {...register("username", { required: "Username is required" })}
      />
      {errors.username && <p>{errors.username.message}</p>}

      {/* Input email */}
      <input
        placeholder="Email"
        {...register("email", { required: "Email required", pattern: /^\S+@\S+$/i })}
      />
      {errors.email && <p>{errors.email.message}</p>}

      {/* Input password */}
      <input
        type="password"
        placeholder="Password"
        {...register("password", { minLength: { value: 6, message: "At least 6 chars" } })}
      />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit">Register</button>
    </form>
  );
}
```

✅ Đây là form cơ bản, chưa có logic nâng cao.

---

## 🔹 Level 2

### 2. Tạo **multi-step form (Wizard form)**

👉 Yêu cầu: người dùng điền theo từng bước (Step 1 → Step 2 → Review).

```tsx
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

type FormData = {
  name: string;
  email: string;
  age: number;
};

export default function WizardForm() {
  const methods = useForm<FormData>();
  const [step, setStep] = useState(1);

  const onSubmit = (data: FormData) => {
    console.log("Final Data:", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {step === 1 && (
          <div>
            <input placeholder="Name" {...methods.register("name", { required: true })} />
            <button type="button" onClick={() => setStep(2)}>Next</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <input placeholder="Email" {...methods.register("email", { required: true })} />
            <input type="number" placeholder="Age" {...methods.register("age", { min: 18 })} />
            <button type="button" onClick={() => setStep(1)}>Back</button>
            <button type="submit">Submit</button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
```

✅ Đây là form **multi-step (Wizard form)** với điều hướng giữa các bước.

---

## 🔹 Level 3

### 3. Tạo **Form phức tạp + A11y + Error Handling nâng cao + Performance**

👉 Đây là **Enterprise Use Case**: Form đăng ký sự kiện với nhiều trường, validation, error message, field conditionally rendering, và sử dụng `FormProvider` để tối ưu performance.

```tsx
import React from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";

type EventFormData = {
  fullName: string;
  email: string;
  role: "student" | "developer" | "manager";
  portfolio?: string;
  agree: boolean;
};

// Component input riêng để tái sử dụng
function InputField({ name, label }: { name: keyof EventFormData; label: string }) {
  const { register, formState: { errors } } = useFormContext<EventFormData>();

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input id={name} {...register(name, { required: `${label} is required` })} />
      {errors[name] && <p style={{ color: "red" }}>{errors[name]?.message as string}</p>}
    </div>
  );
}

export default function EventRegisterForm() {
  const methods = useForm<EventFormData>();
  const { watch, handleSubmit } = methods;

  // Lấy giá trị role để hiển thị conditional field
  const role = watch("role");

  const onSubmit = (data: EventFormData) => {
    console.log("Event Registration Data:", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Họ tên */}
        <InputField name="fullName" label="Full Name" />

        {/* Email */}
        <InputField name="email" label="Email" />

        {/* Select role */}
        <label>Role</label>
        <select {...methods.register("role", { required: "Role is required" })}>
          <option value="">Select your role</option>
          <option value="student">Student</option>
          <option value="developer">Developer</option>
          <option value="manager">Manager</option>
        </select>

        {/* Conditional field: Portfolio (chỉ hiện khi chọn developer) */}
        {role === "developer" && (
          <InputField name="portfolio" label="Portfolio URL" />
        )}

        {/* Checkbox đồng ý */}
        <label>
          <input type="checkbox" {...methods.register("agree", { required: "You must agree" })} />
          I agree to terms
        </label>

        <button type="submit">Register</button>
      </form>
    </FormProvider>
  );
}
```

### 🏢 Enterprise Features có trong code:

* **Re-usable input component** (`InputField`)
* **FormProvider** → giảm re-render, tăng performance
* **Conditional rendering** (portfolio chỉ hiện khi role = developer)
* **Accessible labels + error messages** → hỗ trợ screen reader
* **Validation + Error handling** → UX tốt



---


### Testing Complex Form (Enterprise Use Case)

## ✅ Cài đặt (nếu chạy project thật)

```bash
npm install @testing-library/react @testing-library/jest-dom @testing-library/user-event jest
```

---

## 📌 Test Code: `EventRegisterForm.test.tsx`

```tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EventRegisterForm from "./EventRegisterForm";

// Helper function điền input
const fillInput = async (label: string, value: string) => {
  const input = screen.getByLabelText(label);
  await userEvent.type(input, value);
};

describe("EventRegisterForm", () => {
  test("renders all required fields", () => {
    render(<EventRegisterForm />);

    // Kiểm tra label
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();
    expect(screen.getByText(/I agree to terms/i)).toBeInTheDocument();
  });

  test("shows validation errors when submitting empty form", async () => {
    render(<EventRegisterForm />);

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    expect(await screen.findByText(/Full Name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Role is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/You must agree/i)).toBeInTheDocument();
  });

  test("conditionally renders Portfolio field when role is Developer", async () => {
    render(<EventRegisterForm />);

    // Trước khi chọn role Developer
    expect(screen.queryByLabelText(/Portfolio URL/i)).not.toBeInTheDocument();

    // Chọn Developer
    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: "developer" } });

    // Bây giờ phải hiện Portfolio
    expect(await screen.findByLabelText(/Portfolio URL/i)).toBeInTheDocument();
  });

  test("submits form with valid data", async () => {
    render(<EventRegisterForm />);

    await fillInput("Full Name", "Alice Johnson");
    await fillInput("Email", "alice@example.com");
    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: "student" } });
    fireEvent.click(screen.getByRole("checkbox", { name: /I agree to terms/i }));

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    // Vì mình console.log data trong form, nên test chỉ cần check là không có lỗi hiển thị
    expect(screen.queryByText(/is required/i)).not.toBeInTheDocument();
  });
});
```

---

## 📌 Giải thích từng phần

* `render(<EventRegisterForm />)` → render form để test.
* `screen.getByLabelText("Full Name")` → truy cập input qua label (hỗ trợ **Accessibility A11y**).
* `fireEvent.click(button)` hoặc `userEvent.type(input, value)` → mô phỏng hành vi người dùng.
* `expect(...).toBeInTheDocument()` → assert rằng phần tử có hiển thị.
* Test bao gồm:

  1. **Render field cơ bản**
  2. **Validation error khi submit trống**
  3. **Conditional field Portfolio khi chọn Developer**
  4. **Submit hợp lệ không báo lỗi**

---

👉 Đây là **một bộ test chuẩn enterprise**:

* Kiểm tra **UX** (hiển thị lỗi đúng)
* Kiểm tra **Logic** (conditional field hoạt động)
* Kiểm tra **Form submit** (valid data không lỗi)

---

### Performance Testing with `FormProvider`

## 📌 Tại sao cần?

* Form lớn có nhiều input → nếu không tối ưu thì mỗi lần gõ **1 input → toàn bộ form re-render** 😱.
* `React Hook Form` + `FormProvider` cho phép chia nhỏ input → chỉ input nào thay đổi mới re-render.

---

## 📌 Component Demo – `BigForm.tsx`

```tsx
import React from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
};

let renderCount = { firstName: 0, lastName: 0, email: 0, bio: 0 };

const InputField = ({ name, label }: { name: keyof FormValues; label: string }) => {
  const { register } = useFormContext<FormValues>();
  renderCount[name]++;

  return (
    <div>
      <label>{label}</label>
      <input {...register(name)} />
      <p data-testid={`render-${name}`}>Render count: {renderCount[name]}</p>
    </div>
  );
};

export default function BigForm() {
  const methods = useForm<FormValues>();
  const onSubmit = (data: FormValues) => console.log("✅ Submitted:", data);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <InputField name="firstName" label="First Name" />
        <InputField name="lastName" label="Last Name" />
        <InputField name="email" label="Email" />
        <InputField name="bio" label="Bio" />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}
```

---

## 📌 Test File – `BigForm.test.tsx`

```tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BigForm from "./BigForm";

describe("BigForm Performance", () => {
  test("only re-renders the field that changes", async () => {
    render(<BigForm />);

    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);

    // Gõ vào First Name
    await userEvent.type(firstNameInput, "Alice");

    // Kiểm tra render count
    const firstNameRender = screen.getByTestId("render-firstName");
    const lastNameRender = screen.getByTestId("render-lastName");

    // 👉 First Name render nhiều lần do typing
    expect(parseInt(firstNameRender.textContent!.replace(/\D/g, ""))).toBeGreaterThan(1);

    // 👉 Last Name chưa bị re-render
    expect(lastNameRender).toHaveTextContent("Render count: 1");

    // Gõ vào Last Name
    await userEvent.type(lastNameInput, "Johnson");

    // Bây giờ Last Name phải tăng render
    expect(lastNameRender.textContent).toMatch(/Render count: [2-9]/);
  });
});
```

---

## 📌 Giải thích

* `renderCount` theo dõi số lần mỗi field render.
* Khi gõ vào **First Name** → chỉ `firstName` re-render, các field khác không bị ảnh hưởng.
* Test sẽ **fail** nếu form bị re-render toàn bộ → nghĩa là dev code chưa tối ưu.

---

👉 Đây là cách enterprise đảm bảo **form scale lên hàng trăm field vẫn chạy mượt**, không giật lag.

---


### Virtualized Form with `react-window`

## 📌 Vấn đề

* Nếu form có **1000+ input**, mỗi lần render sẽ **giật & chậm**.
* Giải pháp: **virtualization** → chỉ render field nằm trong viewport.

---

## 📌 Cài đặt

```bash
npm install react-window
```

---

## 📌 Code Demo – `VirtualizedForm.tsx`

```tsx
import React from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { FixedSizeList as List } from "react-window";

type FormValues = {
  [key: `field_${number}`]: string;
};

const TOTAL_FIELDS = 1000;

// Component input với RHF
const VirtualInput = ({ index, style }: { index: number; style: React.CSSProperties }) => {
  const { register } = useFormContext<FormValues>();
  const name = `field_${index}` as const;

  return (
    <div style={style}>
      <label>{`Field ${index}`}</label>
      <input {...register(name)} placeholder={`Type something for field ${index}`} />
    </div>
  );
};

export default function VirtualizedForm() {
  const methods = useForm<FormValues>();
  const onSubmit = (data: FormValues) => console.log("✅ Submitted:", data);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} style={{ height: 400 }}>
        {/* List ảo hóa */}
        <List
          height={400} // chiều cao container
          itemCount={TOTAL_FIELDS}
          itemSize={50} // chiều cao mỗi item
          width={400}
        >
          {({ index, style }) => <VirtualInput index={index} style={style} />}
        </List>

        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}
```

---

## 📌 Giải thích

* `react-window` chỉ render **các item đang nhìn thấy** (VD: viewport 400px → chỉ render 8–10 field).
* Khi scroll, item cũ bị unmount, item mới mount.
* `register` của RHF vẫn hoạt động vì input mount vào form context.

---

## 📌 Testing Performance

```tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import VirtualizedForm from "./VirtualizedForm";

describe("VirtualizedForm", () => {
  test("renders only visible fields initially", () => {
    render(<VirtualizedForm />);

    // Chỉ thấy các field đầu tiên
    expect(screen.getByLabelText("Field 0")).toBeInTheDocument();
    expect(screen.getByLabelText("Field 5")).toBeInTheDocument();

    // Field 999 chưa render
    expect(screen.queryByLabelText("Field 999")).toBeNull();
  });
});
```

---

## 📌 Enterprise Use Case

* **Data-heavy forms**: onboarding 50+ steps.
* **Dynamic survey builder**: 200–500 câu hỏi.
* **Admin tools**: CRUD với bảng hàng ngàn input editable.

👉 Với `react-window` + `RHF`, form vẫn **mượt** ngay cả khi hàng ngàn field.

---

# 🚀 Custom Hook + Custom Resolver trong React Hook Form

## 📌 Vấn đề

* `react-hook-form` có `resolver` (Zod, Yup, Joi, Vest…) nhưng đôi khi **doanh nghiệp có logic riêng**.
* VD: Password phải **≥ 6 ký tự**, nhưng nếu chứa `admin` thì **bắt buộc ≥ 10 ký tự**.
* Hoặc bạn muốn validate bằng **API call** (VD: check username trùng).

👉 Lúc này ta viết **Custom Resolver**.

---

## 📌 Tạo Custom Resolver

```tsx
import React from "react";
import { useForm, Resolver } from "react-hook-form";

// Kiểu dữ liệu form
type RegisterForm = {
  username: string;
  password: string;
};

// Custom resolver
const customResolver: Resolver<RegisterForm> = async (values) => {
  const errors: any = {};

  // Rule 1: username required
  if (!values.username) {
    errors.username = { type: "required", message: "Username là bắt buộc" };
  } else if (values.username.length < 4) {
    errors.username = { type: "minLength", message: "Username tối thiểu 4 ký tự" };
  }

  // Rule 2: password phức tạp hơn
  if (!values.password) {
    errors.password = { type: "required", message: "Password là bắt buộc" };
  } else if (values.password.includes("admin") && values.password.length < 10) {
    errors.password = { type: "custom", message: "Password chứa 'admin' phải ≥ 10 ký tự" };
  } else if (values.password.length < 6) {
    errors.password = { type: "minLength", message: "Password tối thiểu 6 ký tự" };
  }

  // Trả về kết quả
  return {
    values: Object.keys(errors).length ? {} : values,
    errors,
  };
};

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: customResolver });

  const onSubmit = (data: RegisterForm) => console.log("✅ Valid Data:", data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register("username")} placeholder="Username" />
        {errors.username && <p>{errors.username.message}</p>}
      </div>

      <div>
        <input type="password" {...register("password")} placeholder="Password" />
        {errors.password && <p>{errors.password.message}</p>}
      </div>

      <button type="submit">Đăng ký</button>
    </form>
  );
}
```

---

## 📌 Custom Hook để Reuse Logic

```tsx
import { useForm, Resolver } from "react-hook-form";

type AnyForm = Record<string, any>;

// Tạo hook tái sử dụng
export function useCustomForm<T extends AnyForm>(resolver: Resolver<T>) {
  return useForm<T>({ resolver, mode: "onChange" });
}
```

👉 Giờ ta có thể dùng `useCustomForm` với bất kỳ resolver nào.

---

## 📌 Enterprise Use Case

1. **Password Policy**: công ty yêu cầu password phải match regex riêng.
2. **Dynamic Business Rule**: dựa vào cấu hình DB → rule thay đổi runtime.
3. **External Service Validation**: gọi API validate số CMND / số điện thoại.
4. **Multi-language Error**: resolver có thể trả lỗi theo locale (EN, VN, JP).

---

## 📌 Mini Project: Username Check bằng API (Fake)

```tsx
const usernameResolver: Resolver<{ username: string }> = async (values) => {
  const errors: any = {};
  if (!values.username) {
    errors.username = { type: "required", message: "Username là bắt buộc" };
  } else {
    // Fake API check
    const exists = await new Promise<boolean>((resolve) =>
      setTimeout(() => resolve(values.username === "admin"), 500)
    );
    if (exists) {
      errors.username = { type: "conflict", message: "Username đã tồn tại" };
    }
  }
  return { values: Object.keys(errors).length ? {} : values, errors };
};
```

---

👉 Với cách này, bạn **không bị phụ thuộc** vào Zod/Yup mà vẫn có form type-safe, validation linh hoạt, tích hợp API, đúng chuẩn enterprise.

---

# ⚡ Controlled + Uncontrolled Components trong React Hook Form

## 1. 📌 Vấn đề

* `react-hook-form` mặc định tối ưu với **uncontrolled components** (`<input {...register("name")} />`).
* Nhưng nhiều UI libraries (MUI, AntD, Chakra…) lại cung cấp **controlled components** (`<TextField value={...} onChange={...} />`).
* Nếu ta không xử lý đúng → form không sync state, mất performance, hoặc warning.

👉 Giải pháp: Dùng **Controller** của RHF để bridge controlled ↔ uncontrolled.

---

## 2. 📌 Ví dụ cơ bản với MUI `TextField`

```tsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";

type FormValues = {
  email: string;
};

export default function ControlledExample() {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: { email: "" },
  });

  const onSubmit = (data: FormValues) => console.log("✅ Data:", data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Controlled field */}
      <Controller
        name="email"
        control={control}
        rules={{ required: "Email là bắt buộc" }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Email"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

👉 `Controller` sẽ:

* Giữ value và onChange sync với RHF.
* Truyền error state xuống UI library.

---

## 3. 📌 Kết hợp Controlled + Uncontrolled

Ví dụ:

* `username` dùng uncontrolled input (nhẹ, nhanh).
* `email` dùng controlled `MUI TextField` (cần UI lib).

```tsx
type FormValues = {
  username: string;
  email: string;
};

export default function MixedForm() {
  const { register, handleSubmit, control } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => console.log("✅ Mixed Data:", data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Uncontrolled */}
      <input {...register("username", { required: "Username là bắt buộc" })} placeholder="Username" />

      {/* Controlled */}
      <Controller
        name="email"
        control={control}
        render={({ field }) => <TextField {...field} label="Email" />}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

👉 Đây là mô hình **enterprise thực tế**:

* Một số input dùng controlled vì UI lib bắt buộc.
* Các input đơn giản (text, checkbox) giữ uncontrolled để tối ưu hiệu năng.

---

## 4. 📌 Enterprise Use Cases

1. **MUI / Ant Design Forms**

   * Dùng `Controller` để wrap `Select`, `DatePicker`, `Autocomplete`.

2. **Performance Optimization**

   * Chỉ controlled những field thật sự cần (`react-select`, `rich text editor`).
   * Các trường text cơ bản dùng uncontrolled.

3. **Dynamic Forms**

   * Một số field được render runtime (API → config form).
   * Dùng controlled để inject logic phức tạp (validation async, dependent fields).

---

## 5. 📌 Mini Project: Mixed Form (Login + Options)

```tsx
type LoginForm = {
  username: string;
  email: string;
  remember: boolean;
};

export default function MixedLoginForm() {
  const { register, handleSubmit, control } = useForm<LoginForm>();

  const onSubmit = (data: LoginForm) => console.log("✅ Mixed Form:", data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Uncontrolled */}
      <input {...register("username")} placeholder="Username" />

      {/* Controlled (MUI) */}
      <Controller
        name="email"
        control={control}
        render={({ field }) => <TextField {...field} label="Email" />}
      />

      {/* Checkbox uncontrolled */}
      <label>
        <input type="checkbox" {...register("remember")} /> Remember Me
      </label>

      <button type="submit">Login</button>
    </form>
  );
}
```

---

👉 Tóm lại:

* Dùng **uncontrolled** cho tốc độ.
* Dùng **Controller** khi cần controlled UI components.
* Có thể mix cả hai trong cùng form → linh hoạt + tối ưu.

---


# ⚡ Wizard Form / Funnel Form với React Hook Form

## 1. 📌 Vấn đề

* Form dài → UX kém, dễ bỏ cuộc.
* Cần chia thành nhiều **step (wizard)**: thông tin cá nhân → địa chỉ → thanh toán.
* Nhưng:

  * Làm sao giữ dữ liệu khi chuyển bước?
  * Validation từng bước như thế nào?
  * Hiệu năng khi có nhiều field?

👉 Giải pháp: **FormProvider** + custom Wizard logic.

---

## 2. 📌 Cấu trúc Wizard Form

### `Wizard.tsx` (logic tổng)

```tsx
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

type FormValues = {
  name: string;
  email: string;
  address: string;
  payment: string;
};

const steps = ["Info", "Address", "Payment"];

export default function Wizard() {
  const methods = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      address: "",
      payment: ""
    }
  });

  const [step, setStep] = useState(0);

  const nextStep = async () => {
    const valid = await methods.trigger(); // validate current step
    if (valid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = (data: FormValues) => {
    console.log("✅ Final Submit:", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <h2>Step {step + 1}: {steps[step]}</h2>

        {step === 0 && <InfoStep />}
        {step === 1 && <AddressStep />}
        {step === 2 && <PaymentStep />}

        <div style={{ marginTop: 20 }}>
          {step > 0 && <button type="button" onClick={prevStep}>Back</button>}
          {step < steps.length - 1 && <button type="button" onClick={nextStep}>Next</button>}
          {step === steps.length - 1 && <button type="submit">Submit</button>}
        </div>
      </form>
    </FormProvider>
  );
}
```

---

### Các Step Components

📍 Step 1: **InfoStep.tsx**

```tsx
import { useFormContext } from "react-hook-form";

export function InfoStep() {
  const { register } = useFormContext();
  return (
    <div>
      <input {...register("name", { required: "Name required" })} placeholder="Name" />
      <input {...register("email", { required: "Email required" })} placeholder="Email" />
    </div>
  );
}
```

📍 Step 2: **AddressStep.tsx**

```tsx
import { useFormContext } from "react-hook-form";

export function AddressStep() {
  const { register } = useFormContext();
  return (
    <div>
      <input {...register("address", { required: "Address required" })} placeholder="Address" />
    </div>
  );
}
```

📍 Step 3: **PaymentStep.tsx**

```tsx
import { useFormContext } from "react-hook-form";

export function PaymentStep() {
  const { register } = useFormContext();
  return (
    <div>
      <select {...register("payment", { required: "Payment required" })}>
        <option value="">Select payment</option>
        <option value="credit">Credit Card</option>
        <option value="paypal">Paypal</option>
      </select>
    </div>
  );
}
```

---

## 3. 📌 Ưu điểm

* **FormProvider**: share state cho tất cả steps.
* **trigger()**: chỉ validate fields trong step hiện tại.
* **handleSubmit**: gom toàn bộ data cuối cùng.

---

## 4. 📌 Enterprise Use Cases

1. **Checkout Funnel** (Cart → Address → Payment → Confirm).
2. **Job Application** (Profile → Skills → Upload CV → Review).
3. **Onboarding** (Account Info → Preferences → Finish).

---

## 5. 📌 Mini Challenge

* Thêm **progress bar** (ví dụ: Step 2/3).
* Lưu form tạm thời vào **localStorage** → user reload không mất dữ liệu.
* Cho phép **skip step** nếu optional.

---

Mở rộng sang **Smart Form Component** (Dynamic Form / Config-driven Form) – đây là bước **senior-level** của Day 26.


# 🧠 Smart Form Component (Dynamic / Config-driven)

## 1. 📌 Vấn đề

* Enterprise apps có **hàng chục form khác nhau**: login, register, checkout, survey…
* Nếu mỗi form viết 1 component riêng → **duplicate code** rất nhiều.
* Cần 1 cách **tái sử dụng**: config bằng JSON/Schema, auto-render form.

👉 Giải pháp: **Smart Form Component**

* Input: 1 array `fields` định nghĩa form.
* Output: 1 form auto render với validation.

---

## 2. 📌 Interface định nghĩa Field

```ts
type FieldType = "text" | "email" | "password" | "textarea" | "select";

type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { label: string; value: string }[]; // cho select
  rules?: any; // validation rules cho RHF
};
```

---

## 3. 📌 SmartForm.tsx

```tsx
import React from "react";
import { useForm, FormProvider } from "react-hook-form";

type FieldType = "text" | "email" | "password" | "textarea" | "select";

type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { label: string; value: string }[];
  rules?: any;
};

type SmartFormProps = {
  fields: FieldConfig[];
  onSubmit: (data: any) => void;
};

export default function SmartForm({ fields, onSubmit }: SmartFormProps) {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {fields.map((field) => {
          const { name, label, type, placeholder, options, rules } = field;

          switch (type) {
            case "select":
              return (
                <div key={name}>
                  <label>{label}</label>
                  <select {...methods.register(name, rules)}>
                    <option value="">-- Select --</option>
                    {options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            case "textarea":
              return (
                <div key={name}>
                  <label>{label}</label>
                  <textarea
                    {...methods.register(name, rules)}
                    placeholder={placeholder}
                  />
                </div>
              );
            default:
              return (
                <div key={name}>
                  <label>{label}</label>
                  <input
                    type={type}
                    {...methods.register(name, rules)}
                    placeholder={placeholder}
                  />
                </div>
              );
          }
        })}

        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}
```

---

## 4. 📌 Demo sử dụng

```tsx
import React from "react";
import SmartForm from "./SmartForm";

const fields = [
  { name: "username", label: "Username", type: "text", rules: { required: "Required" } },
  { name: "email", label: "Email", type: "email", rules: { required: "Required" } },
  { name: "password", label: "Password", type: "password", rules: { required: "Required", minLength: 6 } },
  { name: "gender", label: "Gender", type: "select", options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
    ], rules: { required: "Required" } },
  { name: "bio", label: "Bio", type: "textarea" }
];

export default function RegisterPage() {
  const handleSubmit = (data: any) => {
    console.log("✅ SmartForm Submit:", data);
  };

  return <SmartForm fields={fields} onSubmit={handleSubmit} />;
}
```

---

## 5. 📌 Enterprise Use Case

* **Admin Dashboard**: form tạo/sửa user, product, category… (dùng chung 1 SmartForm).
* **Survey/Questionnaire**: load từ JSON config trả về từ backend.
* **CMS Editor**: backend gửi schema → frontend render form auto.

---

## 6. 📌 Challenge

1. Thêm **validation bằng Zod** vào SmartForm (resolver).
2. Tích hợp với **Wizard Form** (SmartForm chạy từng bước từ config).
3. Cho phép backend gửi config JSON → frontend auto render.

---

👉 Đây là **foundation cho Form Engine** (rất nhiều hệ thống lớn dùng).


📌 [<< Ngày 25](./Day25.md) | [Ngày 27 >>](./Day27.md)

