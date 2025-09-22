# Day 12: Forms & Validation

## Mục tiêu học

1. Hiểu cách build **form trong Next.js** (Page Router + App Router).
2. Áp dụng **React Hook Form** cho controlled/uncontrolled inputs.
3. Tích hợp **validation** bằng Zod hoặc Yup.
4. Tạo **reusable form components** kiểu TypeScript.
5. Biết patterns enterprise: form state, error handling, async validation.
6. Kiểm soát UX: disabled submit, loading state, real-time validation.

---

## TL;DR

* **React Hook Form**: tối ưu performance, controlled/uncontrolled inputs.
* **Zod/Yup**: schema validation, type-safe.
* Dynamic forms + SSR-ready.
* Page Router + App Router: dùng `useForm` trong client components.

---

## 1️⃣ Lý thuyết chi tiết

### 1.1 Cài đặt

```bash
npm install react-hook-form zod @hookform/resolvers
```

---

### 1.2 Page Router Example

```tsx
// pages/contact.tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Tên ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  message: z.string().min(5, 'Nội dung ít nhất 5 ký tự'),
});

type FormData = z.infer<typeof schema>;

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log('Form data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 max-w-md">
      <input {...register('name')} placeholder="Name" className="border p-2" />
      {errors.name && <span className="text-red-500">{errors.name.message}</span>}

      <input {...register('email')} placeholder="Email" className="border p-2" />
      {errors.email && <span className="text-red-500">{errors.email.message}</span>}

      <textarea {...register('message')} placeholder="Message" className="border p-2" />
      {errors.message && <span className="text-red-500">{errors.message.message}</span>}

      <button type="submit" className="bg-blue-600 text-white p-2 rounded">Submit</button>
    </form>
  );
}
```

---

### 1.3 App Router Example

```tsx
// app/contact/page.tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(5),
});

type FormData = z.infer<typeof schema>;

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log('Submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 max-w-md">
      <input {...register('name')} placeholder="Name" className="border p-2" />
      {errors.name && <span className="text-red-500">{errors.name.message}</span>}

      <input {...register('email')} placeholder="Email" className="border p-2" />
      {errors.email && <span className="text-red-500">{errors.email.message}</span>}

      <textarea {...register('message')} placeholder="Message" className="border p-2" />
      {errors.message && <span className="text-red-500">{errors.message.message}</span>}

      <button type="submit" className="bg-blue-600 text-white p-2 rounded">Submit</button>
    </form>
  );
}
```

**Giải thích:**

* `useForm` quản lý state và validation.
* Zod schema đảm bảo type-safe + realtime errors.
* App Router: client component vì `useForm` chỉ chạy client.

---

## 2️⃣ Bài tập

### **Level 1: Simple Contact Form**

* **Đề:** Tạo form với `name`, `email`, `message`, validation tối thiểu.
* **Giải:** như ví dụ ở trên, sử dụng Zod hoặc Yup.

### **Level 2: Reusable Input Component**

* **Đề:** Tạo component `TextInput` dùng cho nhiều field, props: `label`, `placeholder`, `register`, `error`.
* **Giải:**

```tsx
interface TextInputProps {
  label: string;
  placeholder?: string;
  error?: string;
  register: any;
  name: keyof FormData;
}

export function TextInput({ label, placeholder, error, register, name }: TextInputProps) {
  return (
    <div className="flex flex-col">
      <label>{label}</label>
      <input {...register(name)} placeholder={placeholder} className="border p-2" />
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
}
```

* Sử dụng trong form:

```tsx
<TextInput label="Name" register={register} name="name" error={errors.name?.message} />
```

---

### **Level 3: Async Validation + Submit State**

* **Đề:** Kiểm tra email đã tồn tại qua API giả lập trước khi submit, disable button khi loading.
* **Giải:**

```tsx
const onSubmit = async (data: FormData) => {
  setLoading(true);
  const exists = await fakeApiCheckEmail(data.email);
  if (exists) alert('Email already registered');
  else console.log('Submitted:', data);
  setLoading(false);
};

<button type="submit" disabled={loading} className="bg-blue-600 text-white p-2 rounded">
  {loading ? 'Submitting...' : 'Submit'}
</button>
```

* Fake API:

```ts
async function fakeApiCheckEmail(email: string) {
  return new Promise<boolean>(resolve => setTimeout(() => resolve(email === 'test@example.com'), 1000));
}
```

---

## 3️⃣ Common Pitfalls

1. Quên wrap component bằng `useForm` → errors undefined.
2. Client-only hooks trong Server Component → crash.
3. Async validation không handle loading → UX tệ.
4. Validation schema và form fields không khớp → TS error.

---

[<< Ngày 11](./Day11.md) | [Ngày 13 >>](./Day13.md)

