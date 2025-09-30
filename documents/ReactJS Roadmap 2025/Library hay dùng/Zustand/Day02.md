# 📘 Day 2 – Selector & Performance Optimization

## 1. Tại sao cần Selector?

* Nếu bạn dùng `useStore()` mà không truyền selector, toàn bộ component sẽ **re-render mỗi khi bất kỳ state nào thay đổi** → tốn performance.
* Giải pháp: **selector** → chỉ lắng nghe một phần state cần thiết.

Ví dụ:

```ts
const bears = useBearStore((state) => state.bears);
```

👉 Component chỉ re-render khi `bears` thay đổi, không bị ảnh hưởng nếu state khác thay đổi.

---

## 2. Giới thiệu cú pháp & Utility

### 🟦 Cú pháp cơ bản Selector

```ts
// Lấy 1 phần state
const bears = useBearStore((state) => state.bears);

// Lấy nhiều state → return object
const { bears, increase } = useBearStore((state) => ({
  bears: state.bears,
  increase: state.increase,
}));
```

### 🟦 Utility: `shallow` (so sánh nông)

* Vấn đề: Khi return object/array, mặc định React so sánh bằng **===** → luôn re-render.
* Giải pháp: Dùng `shallow` để so sánh nông (shallow equality).

```ts
import { shallow } from 'zustand/shallow';

const { bears, increase } = useBearStore(
  (state) => ({ bears: state.bears, increase: state.increase }),
  shallow
);
```

👉 Component chỉ re-render khi giá trị thực sự thay đổi.

---

## 3. Code Demo: Bear Store tối ưu

### store/bearStore.ts

```ts
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';

interface BearState {
  bears: number;
  increase: () => void;
  decrease: () => void;
}

export const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increase: () => set((state) => ({ bears: state.bears + 1 })),
  decrease: () => set((state) => ({ bears: state.bears - 1 })),
}));
```

### App.tsx

```tsx
import React from 'react';
import { useBearStore } from './store/bearStore';
import { shallow } from 'zustand/shallow';

export default function App() {
  console.log('App render');

  // Lấy nhiều state nhưng tránh re-render thừa
  const { bears, increase, decrease } = useBearStore(
    (state) => ({
      bears: state.bears,
      increase: state.increase,
      decrease: state.decrease,
    }),
    shallow
  );

  return (
    <div>
      <h1>{bears} 🐻</h1>
      <button onClick={increase}>+1</button>
      <button onClick={decrease}>-1</button>
    </div>
  );
}
```

---

## 4. Best Practices trong công ty lớn

* Luôn **dùng selector** thay vì lấy full store.
* Khi return object → luôn kèm `shallow`.
* Nếu UI có nhiều component con, **chia nhỏ state** và dùng selector riêng.
* Tránh tạo store quá lớn → khó tối ưu re-render.

---

## 5. Câu hỏi phỏng vấn & Trả lời

**Q1: Tại sao cần dùng selector trong Zustand?**
👉 Vì nếu không dùng, component sẽ re-render mỗi khi bất kỳ state nào thay đổi, gây tốn performance. Selector giúp component chỉ lắng nghe phần state cần.

**Q2: Khi nào cần `shallow`?**
👉 Khi selector return object/array. Mặc định React so sánh bằng reference (`===`), dẫn đến re-render thừa. `shallow` giúp so sánh từng key một cách nông.

**Q3: So sánh re-render giữa Zustand, Redux, Context API?**

* Context API: Mọi component subscribe context đều re-render khi value thay đổi.
* Redux: Re-render dựa trên `mapStateToProps` (nếu viết selector tốt thì ổn, nhưng nhiều boilerplate).
* Zustand: Tự nhiên hỗ trợ selector + shallow, re-render ít hơn và code gọn hơn.

**Q4: Làm sao debug được re-render thừa?**
👉 Dùng `console.log` trong component, hoặc React DevTools → check component nào re-render. Nếu quá nhiều → optimize với selector + shallow.

---

📌 Kết thúc Day 2, bạn đã:

* Hiểu cơ chế re-render trong Zustand.
* Biết dùng selector và shallow để tối ưu.
* Có kiến thức interview về performance trong state management.
---

# 📘 Extension – Selector vs Destructuring trong Zustand

## 🎯 Mục tiêu học

* Hiểu sự khác biệt giữa **destructuring toàn bộ store** và **selector-based subscription**.
* Biết cách sử dụng **shallow comparator** để tối ưu hoá.
* Hiểu khi nào chọn cách nào trong dự án nhỏ vs enterprise.
* Tránh lỗi re-render thừa khi payload phức tạp.

---

## 🔍 1. Destructuring toàn bộ store

```tsx
const { isOpen, modalType, payload, closeModal } = useModalStore();
```

### ✔️ Ưu điểm:

* Ngắn gọn, dễ viết.
* Thích hợp cho **demo, prototype, project nhỏ**.

### ❌ Nhược điểm:

* Mỗi lần **bất kỳ field nào đổi**, component sẽ re-render.
* Trong project lớn, nếu `payload` chứa object phức tạp (user profile, product detail), UI sẽ render lại liên tục.

---

## 🔍 2. Selector-based subscription

```tsx
const isOpen = useModalStore((s) => s.isOpen);
const modalType = useModalStore((s) => s.modalType);
const payload = useModalStore((s) => s.payload);
const closeModal = useModalStore((s) => s.closeModal);
```

### ✔️ Ưu điểm:

* Component chỉ re-render khi field đó thay đổi.
* Giúp tối ưu hiệu năng, đặc biệt khi state lớn.

### ❌ Nhược điểm:

* Code verbose hơn (nhiều dòng).
* Có thể hơi “rườm rà” với state nhỏ.

---

## 🔍 3. Selector + shallow comparator

```tsx
import { shallow } from 'zustand/shallow';

const { isOpen, modalType, closeModal } = useModalStore(
  (s) => ({
    isOpen: s.isOpen,
    modalType: s.modalType,
    closeModal: s.closeModal,
  }),
  shallow
);
```

### ✔️ Ưu điểm:

* Tránh re-render khi object wrapper không đổi.
* Ngắn gọn hơn viết từng selector riêng lẻ.
* Chuẩn **enterprise** khi cần group nhiều field.

### ❌ Nhược điểm:

* Developer mới dễ nhầm rằng `shallow` = deep compare (thực tế chỉ là shallow).
* Nếu state lồng nhau (nested object), vẫn có thể re-render không mong muốn.

---

## 🏢 Case Study – ModalRenderer chuẩn enterprise

### ❌ Cách naive (dễ gây re-render thừa)

```tsx
const { isOpen, modalType, payload, closeModal } = useModalStore();
```

* `payload` đổi → toàn bộ `ModalRenderer` render lại, dù `modalType` không đổi.

---

### ✅ Cách tối ưu (chia nhỏ subscription)

```tsx
import { shallow } from 'zustand/shallow';
import { useModalStore } from '../store/modalStore';

export default function ModalRenderer() {
  const { isOpen, modalType, closeModal } = useModalStore(
    (s) => ({ isOpen: s.isOpen, modalType: s.modalType, closeModal: s.closeModal }),
    shallow
  );

  if (!isOpen || !modalType) return null;

  switch (modalType) {
    case 'productDetails':
      return <ProductDetailsModal onClose={closeModal} />;
    case 'editUser':
      return <EditUserModal onClose={closeModal} />;
    case 'reportIssue':
      return <ReportIssueModal onClose={closeModal} />;
    default:
      return null;
  }
}
```

👉 `payload` được subscribe trực tiếp trong từng modal:

```tsx
const productId = useModalStore((s) => s.payload?.id);
```

* Giúp `ModalRenderer` **không bị render lại khi payload đổi**, chỉ modal con bị ảnh hưởng.

---

## 📌 Khi nào dùng cách nào?

| Cách                            | Khi nào dùng                                | Ưu tiên                  |
| ------------------------------- | ------------------------------------------- | ------------------------ |
| **Destructuring toàn bộ store** | Demo, app nhỏ, state ít thay đổi            | Nhanh, tiện              |
| **Selector-based**              | App lớn, nhiều component, tránh render thừa | Default trong enterprise |
| **Selector + shallow**          | Khi cần group nhiều field nhưng vẫn tối ưu  | Chuẩn nhất cho team lớn  |

---

## ⚠️ Common Pitfalls

* **Nhầm shallow là deep compare** → dẫn đến bug khi state nested.
* **Quá lạm dụng selector** cho từng field nhỏ → code verbose, khó maintain.
* **Không tách payload ra modal con** → gây re-render cả ModalRenderer.

---

## ✅ Checklist Enterprise

* [ ] Component subscribe state **theo field, không toàn bộ store**.
* [ ] Với group nhiều field → dùng `shallow`.
* [ ] Với payload phức tạp → subscribe trực tiếp ở modal con.
* [ ] Review code: nếu thấy `useStore()` không có selector → hỏi dev tại sao.



---

📌 [<< Ngày 01](./Day01.md) | [Ngày 03 >>](./Day03.md)