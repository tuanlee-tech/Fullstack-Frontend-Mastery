# 📘 ReactJS

## Mục lục

- [📘 ReactJS](#-reactjs)
  - [Mục lục](#mục-lục)
  - [1. Giới thiệu React Hooks](#1-giới-thiệu-react-hooks)
  - [2. `useState`](#2-usestate)
  - [3. `useEffect`](#3-useeffect)
    - [3.1 Vòng đời useEffect](#31-vòng-đời-useeffect)
  - [4. `useCallback`](#4-usecallback)
  - [5. `useMemo`](#5-usememo)
  - [6. `useSyncExternalStore`](#6-usesyncexternalstore)
  - [7. Custom Hooks](#7-custom-hooks)
  - [8. `useRef` \& `useImperativeHandle`](#8-useref--useimperativehandle)
    - [8.1 `useRef`](#81-useref)
    - [8.2 `useImperativeHandle`](#82-useimperativehandle)
  - [Lời khuyên tổng quan](#lời-khuyên-tổng-quan)

---

## 1. Giới thiệu React Hooks

* **Hooks** là các hàm đặc biệt trong React (v16.8+) cho phép:

  * Sử dụng state trong functional component (`useState`)
  * Thực hiện side-effect (`useEffect`)
  * Memoization (`useMemo`, `useCallback`)
  * Quản lý ref và expose API tuỳ chỉnh (`useRef`, `useImperativeHandle`)
  * Theo dõi state bên ngoài (`useSyncExternalStore`)
* Lợi ích: **code ngắn gọn, dễ tái sử dụng, tách biệt logic**, giảm phụ thuộc class component.

---

## 2. `useState`

* Quản lý state trong functional component.
* **Cú pháp:**

```jsx
const [state, setState] = useState(initialValue);
```

* **Ví dụ:**

```jsx
const [count, setCount] = useState(0);
<button onClick={() => setCount(count + 1)}>Increase</button>
```

---

## 3. `useEffect`

* Quản lý side-effect: fetch API, DOM manipulation, subscription.
* **Cú pháp cơ bản:**

```jsx
useEffect(() => {
  // Side effect code
  return () => {
    // Cleanup
  };
}, [dependencies]);
```

* **Lưu ý:**

  * Dependencies quyết định khi effect chạy lại.
  * Tránh gọi `setState` không có dependencies → vòng lặp vô hạn.
  * Cleanup function giúp unsubscribe events, clear timers, cancel API.

---

### 3.1 Vòng đời useEffect

* Component Mount → Effect chạy.

* Component Update → Effect chạy lại nếu dependencies thay đổi.

* Component Unmount → Cleanup function chạy.

* **Ví dụ ScrollToTop với React Router:**

```jsx
function ScrollToTop() {
  const location = useLocation();
  useEffect(() => window.scrollTo(0, 0), [location.pathname]);
  return null;
}
```

---

## 4. `useCallback`

* Memoize **function** để tránh tạo lại mỗi lần render.
* **Cú pháp:**

```jsx
const memoizedFn = useCallback(() => { ... }, [dependencies]);
```

* **Ví dụ:**

```jsx
const increase = useCallback(() => setCount(c => c + 1), []);
```

* **Khi nào dùng:** Component phức tạp, truyền function xuống nhiều child.
* **Không nên dùng:** Component đơn giản, không tốn performance.

---

## 5. `useMemo`

* Memoize **giá trị tính toán nặng**.
* **Cú pháp:**

```jsx
const memoizedValue = useMemo(() => expensiveCalc(param), [param]);
```

* **Ví dụ:**

```jsx
const numbers = useMemo(() => {
  let res = [];
  for(let i=0;i<length;i++) res.push(i);
  return res;
}, [length]);
```

* **Lưu ý:** Không lạm dụng, vì useMemo có overhead.

---

## 6. `useSyncExternalStore`

* Theo dõi state bên ngoài React, ví dụ localStorage, browser history.
* **Cú pháp:**

```jsx
const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
```

* **Ví dụ localStorage:**

```jsx
const subscribe = (listener) => {
  window.addEventListener("storage", listener);
  return () => window.removeEventListener("storage", listener);
};
const getSnapshot = () => localStorage.getItem("myItem");
const value = useSyncExternalStore(subscribe, getSnapshot);
```

---

## 7. Custom Hooks

* Tạo hook riêng để **tái sử dụng logic**.
* **Ví dụ trạng thái mạng:**

```jsx
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);
  return isOnline;
}

// Sử dụng
const isOnline = useOnlineStatus();
<button disabled={!isOnline}>Save</button>
```

* **Lợi ích:** tránh trùng lặp, dễ bảo trì, logic tập trung.

---

## 8. `useRef` & `useImperativeHandle`

### 8.1 `useRef`

* Lưu reference đến **DOM hoặc giá trị bất biến**.
* **Ví dụ focus input:**

```jsx
const inputRef = useRef();
<input ref={inputRef} />
<button onClick={() => inputRef.current.focus()}>Focus</button>
```

### 8.2 `useImperativeHandle`

* Tùy chỉnh **giá trị ref nhận được** khi dùng `forwardRef`.
* **Ví dụ:**

```jsx
function CustomInput(props, ref) {
  useImperativeHandle(ref, () => ({
    alertValue: () => alert(props.value)
  }), [props.value]);
  return <input {...props} />;
}
export default React.forwardRef(CustomInput);

// Sử dụng
const inputRef = useRef();
<button onClick={() => inputRef.current.alertValue()}>Alert</button>
```

* **Lợi ích:** kiểm soát API component, bảo vệ DOM nội bộ.

---

## Lời khuyên tổng quan

* **Tối ưu hóa:** chỉ dùng `useMemo`/`useCallback` khi thực sự cần.
* **Custom Hooks:** giúp tái sử dụng logic, tránh trùng lặp.
* **useImperativeHandle:** giới hạn API truy cập component.
* **useSyncExternalStore:** tối ưu cho state bên ngoài React.
* **Dependencies:** luôn kiểm tra để tránh re-render hoặc vòng lặp vô hạn.

