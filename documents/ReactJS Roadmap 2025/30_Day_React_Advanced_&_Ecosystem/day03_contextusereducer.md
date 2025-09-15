
# Day 03 – Context + useReducer / Context + useReducer

## 1️⃣ Overview / Tổng quan

**EN:**
Using **Context + useReducer** provides a **centralized and predictable state management** without needing external libraries for moderate complexity apps. It allows global state sharing, **immutable state updates**, and is highly testable. In Enterprise projects, it is useful for **theme management, user session, modal states, feature flags**, or any state that must be accessible app-wide.

**VN:**
Sử dụng **Context + useReducer** giúp quản lý state **tập trung và dự đoán được** mà không cần thư viện ngoài cho các ứng dụng có độ phức tạp vừa phải. Nó cho phép chia sẻ state toàn cục, **cập nhật state bất biến**, và dễ test. Trong dự án doanh nghiệp, nó phù hợp cho **quản lý theme, session người dùng, modal, feature flags**, hoặc bất kỳ state nào cần dùng toàn app.

**Enterprise Relevance / Ví dụ doanh nghiệp:**

* Modal manager: mở/đóng nhiều modal trong toàn app.
* Auth context: lưu thông tin người dùng, quyền truy cập.
* Feature flags: bật/tắt module theo quyền hoặc môi trường.

---

## 2️⃣ Key Concepts / Kiến thức cần học

| Concept          | Description EN / VN                                             | Code Snippet / Example                                        |
| ---------------- | --------------------------------------------------------------- | ------------------------------------------------------------- |
| Context API      | Share state globally / Chia sẻ state toàn app                   | `const ThemeContext = createContext(defaultValue)`            |
| useReducer       | Predictable state updates / Cập nhật state dự đoán được         | `const [state, dispatch] = useReducer(reducer, initialState)` |
| Actions          | Define state changes / Định nghĩa các thay đổi state            | `{ type: 'TOGGLE_MODAL', payload: 'login' }`                  |
| Provider Pattern | Wrap app to provide state / Bao quanh app để cung cấp state     | `<ModalProvider>{children}</ModalProvider>`                   |
| Performance      | Memoization and selective updates / Memo hóa và update chọn lọc | `useMemo`, `React.memo`, splitting context by slice           |

---

## 3️⃣ Code Example / Ví dụ code

```tsx
// File: context/ModalContext.tsx
import React, { createContext, useReducer, useContext, ReactNode } from 'react';

type ModalState = {
  [key: string]: boolean;
};

type ModalAction = 
  | { type: 'OPEN_MODAL'; payload: string }
  | { type: 'CLOSE_MODAL'; payload: string };

const initialState: ModalState = {};

const ModalContext = createContext<{
  state: ModalState;
  dispatch: React.Dispatch<ModalAction>;
}>({ state: initialState, dispatch: () => null });

const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
  switch (action.type) {
    case 'OPEN_MODAL':
      return { ...state, [action.payload]: true };
    case 'CLOSE_MODAL':
      return { ...state, [action.payload]: false };
    default:
      return state;
  }
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(modalReducer, initialState);
  return (
    <ModalContext.Provider value={{ state, dispatch }}>
      {children}
    </ModalContext.Provider>
  );
};

// Custom hook for easy consumption
export const useModal = (modalName: string) => {
  const { state, dispatch } = useContext(ModalContext);
  return {
    isOpen: !!state[modalName],
    open: () => dispatch({ type: 'OPEN_MODAL', payload: modalName }),
    close: () => dispatch({ type: 'CLOSE_MODAL', payload: modalName }),
  };
};

/*
Enterprise Notes:
- Separation of reducer & context improves testability
- Generic modal management scales across multiple UI modules
- Can combine with useEffect to auto-close on route change or escape key
- Splitting context by feature reduces unnecessary re-renders
*/
```

---

## 4️⃣ Practical Exercises / Bài tập ứng dụng

| Level | Exercise                                                                                                                                      | Learning Objectives / Kỳ vọng                                                                               |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 1     | Build a theme context to toggle light/dark mode                                                                                               | Understand basic context + reducer, state management                                                        |
| 2     | Build a modal context for multiple modals with open/close functionality                                                                       | Combine context + reducer, custom hook abstraction, testable state                                          |
| 3     | Enterprise: implement auth & feature flag context with actions, async effects (e.g., fetch user roles), selective memoization for performance | Enterprise-ready global state, async side-effects, performance-conscious design, clean modular architecture |

---

## 5️⃣ Notes / Ghi chú

* Split **contexts by feature** to reduce unnecessary re-renders.
* Always use **immutable updates** in reducers to maintain predictability.
* Wrap with **custom hooks** for easy consumption and encapsulation.
* For **Enterprise**, combine with TypeScript generics to enforce correct action payloads.
* Avoid overusing Context for frequently changing state (use Zustand/RTK Query instead).

---

## 6️⃣ Summary / Tổng kết

**EN:**

* Built **Context + useReducer** for predictable global state
* Created **custom hooks** for easy consumption
* Scaled for **enterprise-level usage** with modular, memoized, typed design

**VN:**

* Xây dựng **Context + useReducer** cho state toàn app dự đoán được
* Tạo **custom hook** để sử dụng dễ dàng
* Scale cho **dự án doanh nghiệp** với modular, memoized, typed design

**Checklist Skills / Kiểm tra kỹ năng:**

* [ ] Context API + Provider pattern
* [ ] useReducer with immutable state updates
* [ ] Custom hooks for context consumption
* [ ] Performance optimization with selective updates
* [ ] Enterprise pattern: modular, testable, scalable
