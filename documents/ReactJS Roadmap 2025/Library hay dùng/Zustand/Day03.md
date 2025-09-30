# 📘 Day 3 – Modal & Dialog Management

## 1. Vấn đề thực tế

* Dùng **prop drilling** để mở/đóng modal → code spaghetti, khó maintain.
* Context API có thể giải quyết, nhưng re-render toàn bộ consumer khi state thay đổi.
* Zustand giúp quản lý modal **gọn nhẹ**, mỗi component chỉ nhận đúng state cần.

---

## 2. Store Modal với Zustand

### store/modalStore.ts

```ts
import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  modalType: string | null; // ví dụ: 'login', 'confirm', 'upload'
  openModal: (type: string) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  modalType: null,
  openModal: (type) => set({ isOpen: true, modalType: type }),
  closeModal: () => set({ isOpen: false, modalType: null }),
}));
```

---

## 3. Sử dụng trong Component

### App.tsx

```tsx
import React from 'react';
import { useModalStore } from './store/modalStore';
import LoginModal from './components/LoginModal';
import ConfirmModal from './components/ConfirmModal';

export default function App() {
  const openModal = useModalStore((s) => s.openModal);

  return (
    <div>
      <h1>Zustand Modal Demo</h1>
      <button onClick={() => openModal('login')}>Open Login</button>
      <button onClick={() => openModal('confirm')}>Open Confirm</button>

      <ModalRenderer />
    </div>
  );
}
```

### ModalRenderer.tsx

```tsx
import React from 'react';
import { useModalStore } from '../store/modalStore';

import LoginModal from './LoginModal';
import ConfirmModal from './ConfirmModal';

export default function ModalRenderer() {
  const { isOpen, modalType, closeModal } = useModalStore((s) => ({
    isOpen: s.isOpen,
    modalType: s.modalType,
    closeModal: s.closeModal,
  }));

  if (!isOpen) return null;

  switch (modalType) {
    case 'login':
      return <LoginModal onClose={closeModal} />;
    case 'confirm':
      return <ConfirmModal onClose={closeModal} />;
    default:
      return null;
  }
}
```

### LoginModal.tsx

```tsx
import React from 'react';

interface Props {
  onClose: () => void;
}

export default function LoginModal({ onClose }: Props) {
  return (
    <div className="modal">
      <h2>Login Form</h2>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

### ConfirmModal.tsx

```tsx
import React from 'react';

interface Props {
  onClose: () => void;
}

export default function ConfirmModal({ onClose }: Props) {
  return (
    <div className="modal">
      <p>Are you sure?</p>
      <button onClick={onClose}>Yes</button>
      <button onClick={onClose}>No</button>
    </div>
  );
}
```

---

## 4. Best Practices trong công ty lớn

* **Tách ModalStore riêng** → không để chung với business state.
* **Quản lý theo `modalType`** thay vì boolean cho từng modal → tránh tạo hàng chục state `isLoginOpen`, `isConfirmOpen`...
* Với dự án lớn: có thể quản lý modal stack (mở nhiều modal cùng lúc).

---

## 5. Câu hỏi phỏng vấn & Trả lời

**Q1: Tại sao không nên dùng Context API cho modal?**
👉 Vì mỗi khi context thay đổi, toàn bộ consumer re-render. Với app nhiều modal, performance sẽ giảm.

**Q2: Nếu có nhiều modal (50+ modal), làm sao quản lý?**
👉 Dùng `modalType` (string/enum) hoặc `modalStack` (array). Không tạo 50 state boolean.

**Q3: Làm sao debug modal đang mở?**
👉 Check state trong Redux DevTools (Zustand có middleware devtools). Ngoài ra có thể log `modalType` khi thay đổi.

**Q4: Trong công ty lớn, modal thường kết hợp với gì?**
👉 - Form handling (React Hook Form + Zustand để mở/đóng form).
👉 - Global confirm (khi delete item).
👉 - Stepper/wizard modal (multi-step forms).

---

📌 Kết thúc Day 3, bạn đã:

* Biết quản lý modal/dialog với Zustand.
* Tránh prop drilling và context re-render thừa.
* Có kiến thức interview liên quan đến UI state management.
---

# 🏆 Code Challenge – Day 3

## Đề bài

Công ty bạn đang xây dựng một **E-commerce Admin Dashboard**. Yêu cầu:

1. Có nhiều loại modal khác nhau:

   * `productDetails` → hiển thị thông tin sản phẩm.
   * `editUser` → form chỉnh sửa thông tin user.
   * `reportIssue` → form báo lỗi.

2. Modal cần truyền **payload động** (ví dụ: `productId`, `userId`).

3. Viết Zustand store và component renderer cho hệ thống modal trên, đảm bảo:

   * Dễ mở rộng thêm modal mới.
   * Không bị trùng state boolean (ví dụ `isProductOpen`, `isUserOpen`...).
   * Có thể truyền data vào modal mà không cần prop drilling.

---

## Lời giải – Best Practices trong công ty lớn

### 1. Store – modalStore.ts

```ts
import { create } from 'zustand';

type ModalType = 'productDetails' | 'editUser' | 'reportIssue' | null;

interface ModalState {
  isOpen: boolean;
  modalType: ModalType;
  payload: any; // production nên dùng generic type
  openModal: (type: ModalType, payload?: any) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  modalType: null,
  payload: null,
  openModal: (type, payload = null) =>
    set({ isOpen: true, modalType: type, payload }),
  closeModal: () => set({ isOpen: false, modalType: null, payload: null }),
}));
```

📌 **Best Practice:**

* `payload` lưu data động → modal nào cũng nhận được (DRY – Don’t Repeat Yourself).
* Dùng `ModalType` union type để **type-safe**, tránh string “magic value”.

---

### 2. Renderer – ModalRenderer.tsx

```tsx
import React from 'react';
import { useModalStore } from '../store/modalStore';
import ProductDetailsModal from './ProductDetailsModal';
import EditUserModal from './EditUserModal';
import ReportIssueModal from './ReportIssueModal';

export default function ModalRenderer() {
  const { isOpen, modalType, payload, closeModal } = useModalStore();

  if (!isOpen || !modalType) return null;

  switch (modalType) {
    case 'productDetails':
      return <ProductDetailsModal productId={payload.id} onClose={closeModal} />;
    case 'editUser':
      return <EditUserModal userId={payload.id} onClose={closeModal} />;
    case 'reportIssue':
      return <ReportIssueModal issueData={payload} onClose={closeModal} />;
    default:
      return null;
  }
}
```

📌 **Best Practice:**

* Renderer tập trung quản lý tất cả modal → dễ maintain khi dự án có **50+ modal**.
* Payload được truyền trực tiếp từ store → tránh prop drilling từ parent component.

---

### 3. Cách sử dụng – Dashboard.tsx

```tsx
import React from 'react';
import { useModalStore } from '../store/modalStore';
import ModalRenderer from './ModalRenderer';

export default function Dashboard() {
  const openModal = useModalStore((s) => s.openModal);

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <button onClick={() => openModal('productDetails', { id: 42 })}>
        View Product #42
      </button>

      <button onClick={() => openModal('editUser', { id: 'user-99' })}>
        Edit User #99
      </button>

      <button
        onClick={() =>
          openModal('reportIssue', { type: 'UI Bug', severity: 'high' })
        }
      >
        Report Issue
      </button>

      <ModalRenderer />
    </div>
  );
}
```

📌 **Best Practice:**

* Mọi nơi trong app có thể gọi `openModal(type, payload)` → không phụ thuộc parent.
* Dễ mở rộng → chỉ cần thêm case mới trong `ModalRenderer`.

---

## 🔑 Bài học Enterprise

* **Scalability:** Khi dự án có hàng chục modal, quản lý bằng `payload` và `modalType` sẽ giúp code sạch, không bị trùng state boolean.
* **Team-friendly:** Dev mới chỉ cần mở `modalStore.ts` và `ModalRenderer.tsx` là hiểu cách modal hoạt động.
* **Type safety:** Dùng `union type` (`'productDetails' | 'editUser' | ...`) giúp tránh bug do typo.
* **Testability:** Dễ viết unit test cho từng modal bằng cách mock `useModalStore`.

---

👉 Challenge này phản ánh **case thực tế trong công ty lớn**:

* Admin Dashboard (quản lý modal động, data payload).
* Phù hợp với app kiểu **Shopify, Jira, Admin CMS**.

---

# 🛠️ Helper Functions cho Modal Store

## 1. Refactor Store thành 2 phần: state + actions

```ts
// store/modalStore.ts
import { create } from 'zustand';
import { ModalPayloads } from './modalTypes';

interface ModalState {
  modal: ModalPayloads;
  isOpen: boolean;
}

interface ModalActions {
  openModal: <T extends ModalPayloads>(modal: T) => void;
  closeModal: () => void;

  // Helpers (được type-safe)
  openProductDetails: (id: string) => void;
  openEditUser: (id: string) => void;
  openReportIssue: (issueData: { id: string; description: string }) => void;
  openDeleteConfirm: (itemName: string) => void;
}

export const useModalStore = create<ModalState & ModalActions>((set) => ({
  modal: { type: null },
  isOpen: false,

  openModal: (modal) => set({ modal, isOpen: true }),
  closeModal: () => set({ modal: { type: null }, isOpen: false }),

  // ✅ Helpers – ngắn gọn, không cần truyền object dài
  openProductDetails: (id) =>
    set({ modal: { type: 'productDetails', payload: { id } }, isOpen: true }),

  openEditUser: (id) =>
    set({ modal: { type: 'editUser', payload: { id } }, isOpen: true }),

  openReportIssue: (issueData) =>
    set({ modal: { type: 'reportIssue', payload: { issueData } }, isOpen: true }),

  openDeleteConfirm: (itemName) =>
    set({ modal: { type: 'deleteConfirm', payload: { itemName } }, isOpen: true }),
}));
```

---

## 2. Sử dụng Helper trong Component

```tsx
import { useModalStore } from '../store/modalStore';

function Example() {
  const openDeleteConfirm = useModalStore((s) => s.openDeleteConfirm);
  const openProductDetails = useModalStore((s) => s.openProductDetails);

  return (
    <>
      <button onClick={() => openDeleteConfirm('User #1234')}>
        Xoá User
      </button>

      <button onClick={() => openProductDetails('P-5678')}>
        Xem sản phẩm
      </button>
    </>
  );
}
```

👉 Nhìn rất clean, tránh nhầm lẫn payload.

---

## 3. Lợi ích trong công ty lớn

* **Code review dễ hơn**: Reviewer chỉ cần thấy `openDeleteConfirm('User')` là hiểu ngay.
* **Giảm bug**: Không ai cần nhớ payload shape (`{ itemName: string }`) thủ công.
* **Scalable**: Nếu sau này payload `deleteConfirm` cần thêm field (`itemId`), ta chỉ sửa helper, toàn bộ codebase được type-check lại.
* **Encapsulation**: Giúp ẩn đi implementation details, chỉ expose API cho dev dùng.

---

## 4. Checklist Enterprise

* ✅ Mỗi modal có **helper action** riêng.
* ✅ Payload type-safe qua discriminated union.
* ✅ Store tách biệt `ModalState` và `ModalActions`.
* ✅ Component không bao giờ tự tạo object `{ type: ..., payload: ... }` thủ công.

---


# 🏗️ Dynamic Modal Registry Pattern với Zustand

## 1. Định nghĩa ModalRegistry

```tsx
// components/modalRegistry.tsx
import ProductDetailsModal from './ProductDetailsModal';
import EditUserModal from './EditUserModal';
import ReportIssueModal from './ReportIssueModal';
import DeleteConfirmModal from './DeleteConfirmModal';

// Registry map: modalType → Component
export const modalRegistry = {
  productDetails: ProductDetailsModal,
  editUser: EditUserModal,
  reportIssue: ReportIssueModal,
  deleteConfirm: DeleteConfirmModal,
} as const;

export type ModalType = keyof typeof modalRegistry;
```

---

## 2. Update Store để type-safe với Registry

```ts
// store/modalTypes.ts
export type ModalPayloads =
  | { type: 'productDetails'; payload: { id: string } }
  | { type: 'editUser'; payload: { id: string } }
  | { type: 'reportIssue'; payload: { issueData: { id: string; description: string } } }
  | { type: 'deleteConfirm'; payload: { itemName: string } }
  | { type: null; payload?: undefined };
```

```ts
// store/modalStore.ts
import { create } from 'zustand';
import { ModalPayloads } from './modalTypes';

interface ModalState {
  modal: ModalPayloads;
  isOpen: boolean;
}

interface ModalActions {
  openModal: <T extends ModalPayloads>(modal: T) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState & ModalActions>((set) => ({
  modal: { type: null },
  isOpen: false,

  openModal: (modal) => set({ modal, isOpen: true }),
  closeModal: () => set({ modal: { type: null }, isOpen: false }),
}));
```

---

## 3. ModalRenderer động

```tsx
// components/ModalRenderer.tsx
import { useModalStore } from '../store/modalStore';
import { modalRegistry } from './modalRegistry';

export default function ModalRenderer() {
  const { modal, isOpen, closeModal } = useModalStore();

  if (!isOpen || modal.type === null) return null;

  const ModalComponent = modalRegistry[modal.type];

  // 🚀 Tự động truyền payload + onClose
  return (
    <ModalComponent
      {...modal.payload}
      onClose={closeModal}
    />
  );
}
```

---

## 4. Ví dụ dùng ModalRegistry

```tsx
import { useModalStore } from '../store/modalStore';

function Example() {
  const openModal = useModalStore((s) => s.openModal);

  return (
    <>
      <button
        onClick={() =>
          openModal({ type: 'deleteConfirm', payload: { itemName: 'User #1234' } })
        }
      >
        Xoá User
      </button>

      <button
        onClick={() =>
          openModal({ type: 'productDetails', payload: { id: 'P-5678' } })
        }
      >
        Xem sản phẩm
      </button>
    </>
  );
}
```

---

## ✅ Ưu điểm Enterprise

* **Không cần switch-case**: Modal mới → chỉ thêm vào `modalRegistry`.
* **Type-safe**: TypeScript check payload khớp với modal component.
* **Scalable**: Hỗ trợ 20–30 modal mà không sợ file `ModalRenderer.tsx` phình to.
* **Pluggable**: Có thể lazy-load modal component theo type → tối ưu bundle size.

---

## 🚀 Mở rộng nâng cao (Enterprise patterns)

* **Code splitting**: Registry có thể async load modal (`import()`), tránh bundle nặng.
* **Testing**: Dễ mock registry để test UI mà không cần render toàn bộ modal.
* **Access Control**: Có thể bọc registry bằng HOC kiểm tra quyền user trước khi mở modal.

---

**Modal Management với Zustand (Enterprise-level)** bằng cách **kết hợp toàn bộ pattern tối ưu**:

* ✅ **Zustand store type-safe** để quản lý modal.
* ✅ **Dynamic Modal Registry** để tránh switch-case.
* ✅ **Payload typing theo modal** để TypeScript check chặt chẽ.
* ✅ **Lazy Loading (Code Splitting)** để tối ưu bundle size.
* ✅ **Access Control hook** để chặn modal nếu user không đủ quyền.
* ✅ **Clean architecture** để dễ mở rộng (plug-in modal mới).

---

# 🚀 Enterprise Modal Management with Zustand

## 1. Định nghĩa Modal Registry + Lazy Import

```tsx
// components/modalRegistry.tsx

import dynamic from 'next/dynamic';

// Lazy load từng modal component
export const modalRegistry = {
  productDetails: dynamic(() => import('./ProductDetailsModal')),
  editUser: dynamic(() => import('./EditUserModal')),
  reportIssue: dynamic(() => import('./ReportIssueModal')),
  deleteConfirm: dynamic(() => import('./DeleteConfirmModal')),
} as const;

export type ModalType = keyof typeof modalRegistry;
```

* `dynamic()` (Next.js) hoặc `React.lazy()` (CRA/Vite) để chỉ load modal khi cần.
* Giúp app lớn không bị phình bundle vì hàng chục modal.

---

## 2. Xác định Payload cho từng Modal (Type-safe)

```ts
// store/modalTypes.ts

export type ModalPayloads =
  | { type: 'productDetails'; payload: { id: string } }
  | { type: 'editUser'; payload: { id: string } }
  | { type: 'reportIssue'; payload: { issueData: { id: string; description: string } } }
  | { type: 'deleteConfirm'; payload: { itemName: string } }
  | { type: null; payload?: undefined };
```

---

## 3. Zustand Store (Core Modal State)

```ts
// store/modalStore.ts
import { create } from 'zustand';
import { ModalPayloads } from './modalTypes';

interface ModalState {
  modal: ModalPayloads;
  isOpen: boolean;
}

interface ModalActions {
  openModal: <T extends ModalPayloads>(modal: T) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState & ModalActions>((set) => ({
  modal: { type: null },
  isOpen: false,

  openModal: (modal) => set({ modal, isOpen: true }),
  closeModal: () => set({ modal: { type: null }, isOpen: false }),
}));
```

---

## 4. Modal Renderer (Dynamic + Suspense)

```tsx
// components/ModalRenderer.tsx
import { Suspense } from 'react';
import { useModalStore } from '../store/modalStore';
import { modalRegistry } from './modalRegistry';

export default function ModalRenderer() {
  const { modal, isOpen, closeModal } = useModalStore();

  if (!isOpen || modal.type === null) return null;

  const ModalComponent = modalRegistry[modal.type];

  return (
    <Suspense fallback={<div className="p-4">Loading modal...</div>}>
      <ModalComponent {...modal.payload} onClose={closeModal} />
    </Suspense>
  );
}
```

* `Suspense` hiển thị loading state trong khi lazy-load modal.

---

## 5. Access Control Wrapper (Optional)

```tsx
// utils/withAccessControl.tsx
import { FC } from 'react';

export function withAccessControl<T extends object>(
  Component: FC<T>,
  checkAccess: () => boolean
) {
  return (props: T) => {
    if (!checkAccess()) {
      return <div className="p-4 text-red-500">🚫 Access Denied</div>;
    }
    return <Component {...props} />;
  };
}
```

👉 Ví dụ: chỉ admin mới được mở `EditUserModal`:

```tsx
import EditUserModal from './EditUserModal';
import { withAccessControl } from '../utils/withAccessControl';

export default withAccessControl(EditUserModal, () => {
  // check quyền từ auth store
  const role = localStorage.getItem('role');
  return role === 'admin';
});
```

---

## 6. Ví dụ sử dụng modal trong UI

```tsx
import { useModalStore } from '../store/modalStore';

function Example() {
  const openModal = useModalStore((s) => s.openModal);

  return (
    <>
      <button
        onClick={() =>
          openModal({ type: 'deleteConfirm', payload: { itemName: 'User #1234' } })
        }
      >
        Xoá User
      </button>

      <button
        onClick={() =>
          openModal({ type: 'productDetails', payload: { id: 'P-5678' } })
        }
      >
        Xem sản phẩm
      </button>
    </>
  );
}
```

---

# ✅ Tóm tắt Pattern Tối Ưu

| Pattern                    | Lợi ích                                           |
| -------------------------- | ------------------------------------------------- |
| **Dynamic Modal Registry** | Không cần switch-case, modal mới chỉ thêm 1 dòng. |
| **Lazy Loading**           | Modal chỉ load khi cần → giảm bundle size.        |
| **Type-safe Payload**      | TS kiểm tra đúng props → không bug runtime.       |
| **Access Control Wrapper** | Ngăn user mở modal trái quyền.                    |
| **Zustand Store**          | Quản lý state đơn giản, nhẹ, không boilerplate.   |
| **Suspense Fallback**      | UX mượt khi load modal lần đầu.                   |

---

# 🔎 So sánh 3 Pattern Quản lý Modal với Zustand

## 1. **Switch-Case Renderer (Cơ bản)**

```tsx
switch (modalType) {
  case 'productDetails':
    return <ProductDetailsModal ... />;
  case 'editUser':
    return <EditUserModal ... />;
  default:
    return null;
}
```

### Ưu điểm

* Dễ hiểu, dễ implement, code ít.
* Học nhanh cho người mới.
* Tốt khi dự án chỉ có 2–3 modal.

### Nhược điểm

* Mỗi lần thêm modal mới → phải sửa `switch-case`.
* Code phình ra khi có 10+ modal.
* Không hỗ trợ lazy loading (trừ khi bọc từng case).

### Khi dùng

* Prototype, side project, startup MVP.
* Team nhỏ, ít modal, muốn nhanh.

---

## 2. **Dynamic Modal Registry (Tối ưu cho dự án tầm trung)**

```tsx
const modalRegistry = {
  productDetails: ProductDetailsModal,
  editUser: EditUserModal,
  reportIssue: ReportIssueModal,
};
```

```tsx
const ModalComponent = modalRegistry[modal.type];
return <ModalComponent {...modal.payload} />;
```

### Ưu điểm

* Không cần sửa `switch-case`, chỉ cần đăng ký modal mới.
* Code clean, dễ mở rộng.
* Dễ kết hợp với `withAccessControl` hoặc `Suspense`.

### Nhược điểm

* Vẫn load tất cả modal vào bundle (nếu không kết hợp lazy loading).
* Với project rất lớn (30–40 modal), vẫn hơi nặng.

### Khi dùng

* App SaaS, e-commerce, dashboard có khoảng 5–15 modal.
* Team trung bình, cần maintainable code.

---

## 3. **Lazy Registry + Access Control (Enterprise-level)**

```tsx
export const modalRegistry = {
  productDetails: dynamic(() => import('./ProductDetailsModal')),
  editUser: withAccessControl(dynamic(() => import('./EditUserModal')), isAdmin),
};
```

### Ưu điểm

* Modal chỉ được load khi thật sự cần → tối ưu bundle size.
* `withAccessControl` chặn modal ngay tại entrypoint.
* TypeScript check payload đúng theo modal.
* Scale tốt cho app có **hàng chục modal**.

### Nhược điểm

* Code phức tạp hơn, cần setup Suspense/loader.
* Dev mới sẽ khó hiểu hơn switch-case.

### Khi dùng

* Enterprise app (CRM, ERP, admin panel, banking app).
* Team lớn, nhiều role & permission.
* Yêu cầu performance (chỉ load modal user được phép mở).

---

# 📊 Bảng Tổng Hợp

| Tiêu chí            | Switch-case    | Dynamic Registry | Lazy Registry + Access Control |
| ------------------- | -------------- | ---------------- | ------------------------------ |
| 🚀 Tốc độ implement | Nhanh nhất     | Trung bình       | Chậm hơn (setup phức tạp)      |
| 📦 Bundle size      | Lớn (load all) | Trung bình       | Nhỏ nhất (lazy load)           |
| 📈 Khả năng mở rộng | Kém            | Tốt              | Rất tốt                        |
| 🛡 Access Control   | Manual check   | Thêm wrapper     | Native với `withAccessControl` |
| 👨‍💻 Dành cho      | MVP nhỏ        | App vừa          | Enterprise / team lớn          |

---

👉 Kết luận:

* **Switch-case**: học nhanh, chỉ nên dùng trong dự án nhỏ.
* **Dynamic registry**: best choice cho dự án trung bình.
* **Lazy registry + Access control**: chuẩn **enterprise**, trade-off là phức tạp hơn nhưng rất đáng cho app lớn.

---

📌 [<< Ngày 02](./Day02.md) | [Ngày 04 >>](./Day04.md)