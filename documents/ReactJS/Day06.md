## 6. React nâng cao

### 6.1 Tìm hiểu Refs và `useRef` trong React

Trong **data flow của React**, props là cách để component cha tương tác với component con. Muốn cập nhật component con, bạn thường cần **re-render** nó với props mới. Tuy nhiên, có những trường hợp cần cập nhật component con **ngoài luồng dữ liệu của React** – khi đó ta dùng **React Refs**.

---

### React Ref là gì?

React Ref (reference) là một **đối tượng tham chiếu** đến một biến hoặc một component, giữ nguyên giá trị giữa các lần render, và truy xuất thông qua thuộc tính `current`.

---

### Cách thêm Ref vào component

Bạn import hook `useRef` từ React:

```javascript
import { useRef } from "react";
```

Trong component, gọi `useRef` và truyền giá trị khởi tạo. Ví dụ:

```javascript
const ref = useRef(0);
```

`useRef` trả về một object:

```javascript
{ current: 0 } // giá trị ban đầu bạn truyền vào
```

Bạn có thể đọc hoặc gán giá trị thông qua `ref.current`.

---

### Truy xuất và cập nhật giá trị của Ref

```jsx
import { useRef, useEffect } from "react";

function MyComponent() {
  const myRef = useRef(null);

  useEffect(() => {
    myRef.current = "Hello world";
  }, []);

  console.log(myRef.current);

  return <div>Demo</div>;
}

// Lần 1: null
// Lần 2: "Hello world"
```

⚠️ **Lưu ý:** thay đổi `ref.current` **không** làm component re-render. Nếu muốn cập nhật giao diện, bạn cần state hoặc cơ chế khác.

---

### Ví dụ sử dụng Ref

```jsx
import { useRef } from "react";

export default function Counter() {
  const ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert("Bạn đã click " + ref.current + " lần!");
  }

  return <button onClick={handleClick}>Nhấp vào tôi!</button>;
}
```

Ref có thể tham chiếu đến bất kỳ kiểu dữ liệu nào: số, chuỗi, object, hoặc hàm. Khác với state, ref chỉ là một **object JS thuần** có key `current`.

---

### So sánh Ref và State

| Refs                                                      | State                                                  |
| --------------------------------------------------------- | ------------------------------------------------------ |
| `useRef(initialValue)` trả về `{ current: initialValue }` | `useState(initialValue)` trả về `[value, setValue]`    |
| Thay đổi ref **không gây re-render**                      | Thay đổi state **gây re-render**                       |
| Giá trị **có thể thay đổi trực tiếp**                     | Phải dùng setter (`setState`) để thay đổi              |
| Không nên đọc/ghi trong lúc render                        | Có thể đọc trong render (mỗi render là snapshot riêng) |

---

### Khi nào nên dùng Ref?

#### 1. Tham chiếu tới **DOM element**

Ví dụ:

```jsx
function MyComp() {
  const inputRef = useRef(null);

  return <input type="text" ref={inputRef} />;
}
```

Sau đó bạn có thể lấy giá trị trực tiếp:

```jsx
function MyComp() {
  const inputRef = useRef(null);

  const onSubmitForm = (e) => {
    e.preventDefault();
    console.log(inputRef.current.value);
  };

  return (
    <form onSubmit={onSubmitForm}>
      <input type="text" ref={inputRef} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

Cách này giúp **giảm số lần re-render** so với việc lưu input vào state.

---

#### 2. Kết hợp với **callback ref** khi phần tử render có điều kiện

```jsx
function MyComp() {
  const [isShowingForm, setShowingForm] = useState(false);
  const inputRef = useRef(null);

  const refCallback = useCallback((node) => {
    console.log(node);
  }, []);

  const onSubmitForm = (e) => {
    e.preventDefault();
    console.log(inputRef.current?.value);
  };

  return (
    <>
      <button onClick={() => setShowingForm(!isShowingForm)}>
        {isShowingForm ? "Tắt" : "Bật"}
      </button>

      {isShowingForm && (
        <form onSubmit={onSubmitForm}>
          <input type="text" ref={refCallback} />
          <button type="submit">Submit</button>
        </form>
      )}
    </>
  );
}
```

⚠️ **Lưu ý:** callback ref nên được bọc trong `useCallback` để tránh tạo lại hàm mỗi lần render → đảm bảo tính ổn định.

---
## 6.2 Refs và `forwardRef` trong React

Trong React, việc cập nhật DOM được thực hiện tự động nên hầu hết các component **không cần thao tác trực tiếp với DOM**. Tuy nhiên, có những trường hợp bạn cần **truy cập DOM** (do React quản lý) – ví dụ: cuộn đến một phần tử, đo kích thước, hoặc focus vào input. Lúc này, bạn cần dùng **Refs**.

---

### Khi nào cần sử dụng Refs?

Refs thường hữu ích khi cần làm việc **ngoài luồng render**:

* Quản lý trạng thái **focus**.
* **Cuộn** đến một phần tử.
* Đo **kích thước, vị trí** phần tử.
* Gọi API trình duyệt mà React không hỗ trợ trực tiếp.

---

### Nhận một Ref đến Node

1. Import `useRef`:

```js
import { useRef } from "react";
```

2. Khai báo trong component:

```js
const myRef = useRef(null);
```

3. Gắn vào JSX:

```jsx
<div ref={myRef}></div>
```

👉 Ban đầu, `myRef.current` là `null`. Sau khi render, React gán DOM node tương ứng vào `myRef.current`.

---

### Ví dụ: Focus input bằng Ref

```jsx
import { useRef } from "react";

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>focus vào ô nhập</button>
    </>
  );
}
```

* `ref` được gán vào `<input>`.
* Khi click, `inputRef.current.focus()` gọi thẳng DOM API.

---

### Ref cũng có thể lưu **giá trị ngoài DOM**

Ví dụ: lưu **ID timer** hoặc **biến tạm** → giá trị giữ nguyên qua nhiều lần render mà không gây re-render như state.

---

### Ví dụ: Scroll đến phần tử

```jsx
import { useRef } from "react";

export default function CatFriends() {
  const firstCatRef = useRef(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>Tom</button>
      </nav>
      <ul>
        <li ref={firstCatRef}>🐱 Tom</li>
        <li>🐱 Jerry</li>
        <li>🐱 Leo</li>
      </ul>
    </>
  );
}
```

---

### Truy cập DOM của **component con**

👉 Mặc định, React **không cho phép** cha lấy DOM node của con trực tiếp qua `ref`.
Ví dụ:

```jsx
import { useRef } from "react";

function MyInput(props) {
  return <input {...props} />;
}

export default function MyForm() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus(); // ❌ Lỗi: inputRef.current = null
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>focus vào ô nhập</button>
    </>
  );
}
```

---

### Sử dụng `forwardRef` để mở "lỗ thoát"

Để cho phép component con **nhận ref từ cha** và chuyển nó xuống DOM thật:

```jsx
import { forwardRef, useRef } from "react";

const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>focus vào ô nhập</button>
    </>
  );
}
```

✔️ Giờ đây, `Form` có thể truy cập DOM input thông qua `ref`.

---

### 6.3 Side Effect và `useEffect` trong React

`useEffect` là một trong những **React Hooks quan trọng nhất** vì nó cho phép bạn thực hiện **side effect** trong function component.

---

## 🔹 Side Effect là gì?

* **Component trong React** chủ yếu có nhiệm vụ:
  → Nhận dữ liệu (state, props) → **render UI**.
* Nhưng trong thực tế, component thường phải làm thêm những việc **ngoài luồng render**, ví dụ:

✔ Gửi/nhận dữ liệu qua **API**.
✔ Lưu/đọc dữ liệu trong **localStorage, sessionStorage**.
✔ Sử dụng **setTimeout, setInterval**.
✔ **Subscribes/unsubscribes** đến WebSocket, event bus, hoặc dịch vụ bên ngoài.
✔ Thao tác **trực tiếp với DOM**.

➡️ Những hành động này gọi là **Side Effect** vì chúng xảy ra ngoài phạm vi render UI thuần túy.

---

## 🔹 Cách viết một Effect

Cú pháp cơ bản:

```jsx
useEffect(() => {
  // Code side effect
});
```

### 1. Khai báo Effect

```jsx
import { useEffect } from "react";

function MyComponent() {
  useEffect(() => {
    console.log("Component vừa render hoặc update!");
  });

  return <div>Xin chào React</div>;
}
```

👉 Mặc định, `useEffect` chạy sau **mỗi lần render** (bao gồm lần mount đầu tiên + mỗi lần update).

---

### 2. Xác định điều kiện chạy (dependencies)

Bạn có thể truyền **mảng dependencies** vào `useEffect`:

```jsx
useEffect(() => {
  console.log("Chỉ chạy lại khi userId thay đổi!");
}, [userId]);
```

* `[]` rỗng → chạy **1 lần duy nhất** khi component mount.
* `[userId]` → chạy lại khi **userId thay đổi**.
* Không truyền gì → chạy **sau mỗi render** (thường gây thừa).

📌 Ví dụ: fetch API khi `userId` thay đổi

```jsx
import { useEffect, useState } from "react";

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();
      setUser(data);
    }
    fetchUser();
  }, [userId]); // chỉ fetch khi userId đổi

  return <div>{user ? user.name : "Đang tải..."}</div>;
}
```

---

### 3. Làm sạch Effect (cleanup)

Một số effect cần được **dọn dẹp** để tránh memory leak hoặc lỗi logic (ví dụ: timer, event listener, WebSocket).

👉 Bạn return về một function cleanup:

```jsx
useEffect(() => {
  const id = setInterval(() => {
    console.log("Tick...");
  }, 1000);

  return () => {
    clearInterval(id); // cleanup khi component unmount
  };
}, []);
```

📌 Ví dụ với event listener:

```jsx
useEffect(() => {
  function handleResize() {
    console.log("Kích thước cửa sổ:", window.innerWidth);
  }

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
```

---

## 🔹 Vì sao `useEffect` chạy hai lần trong dev?

Trong **React Strict Mode** (chỉ ở môi trường development):

* React mount + unmount + mount lại component để kiểm tra side effect có được cleanup đúng không.
* Kết quả: bạn sẽ thấy effect chạy **hai lần** (nhưng production thì không).

👉 Đây là **hành vi chủ đích** để phát hiện bug tiềm ẩn.
👉 Nếu không muốn, có thể tắt `StrictMode` trong `main.jsx`/`index.js`, nhưng thường **không nên**.

---

## ✅ Tổng kết

* **Side Effect** = mọi thao tác ngoài render UI thuần túy (API call, DOM, timer, storage, subscriptions).
* Dùng **`useEffect`** để quản lý side effect trong function component.
* Nhớ sử dụng **dependencies array** để tránh chạy thừa.
* **Cleanup** effect khi cần (event listener, timer, subscription).
* Trong dev mode, effect có thể chạy **2 lần** để giúp phát hiện bug.

---
### 6.4 Cách sử dụng `useEffect` hiệu quả trong React

`useEffect` là Hook cực kỳ quan trọng trong React, giúp bạn quản lý **side effect** và đồng bộ dữ liệu với nhiều yếu tố khác của ứng dụng. Tuy nhiên, nếu không dùng đúng cách, `useEffect` có thể gây ra **lỗi logic, vòng lặp vô tận hoặc vấn đề hiệu năng**.

---

## 🔹 Tại sao cần `useEffect`?

* **Xử lý tác vụ bất đồng bộ**: Gọi API, đọc ghi `localStorage`, thao tác DOM, v.v.
* **Đồng bộ với state/props**: Thực hiện hành động khi giá trị nào đó thay đổi.
* **Cleanup**: Dọn dẹp khi component unmount (ngắt kết nối, clear timer, hủy event listener).

---

## 🔹 Ví dụ cơ bản

```jsx
import React, { useEffect, useState } from "react";

function ExampleComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Cập nhật tiêu đề trang mỗi khi count thay đổi
    document.title = `Count: ${count}`;
  }, [count]); // chỉ chạy lại khi count đổi

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Tăng Count</button>
    </div>
  );
}
```

👉 Ở đây `useEffect` giúp đồng bộ tiêu đề tab trình duyệt với state `count`.

---

## 🔹 Nguyên tắc sử dụng `useEffect` hiệu quả

### 1. Xử lý tác vụ bất đồng bộ

Đặt code bất đồng bộ (API call, timer) trong `useEffect` để tránh ảnh hưởng đến render ban đầu.

```jsx
function UserData() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("https://api.example.com/user")
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Lỗi:", err));
  }, []); // chỉ gọi một lần khi mount

  if (!user) return <div>Đang tải...</div>;
  return <h1>{user.name}</h1>;
}
```

---

### 2. Đồng bộ với thay đổi của state/props

Chỉ định rõ **dependencies** để tránh chạy lại không cần thiết.

```jsx
function Example({ data }) {
  const [processed, setProcessed] = useState(null);

  useEffect(() => {
    if (data) {
      const result = processData(data);
      setProcessed(result);
    }
  }, [data]); // chỉ chạy lại khi data thay đổi

  return <div>{processed}</div>;
}
```

---

### 3. Tránh vòng lặp vô tận

❌ Sai: gọi `setState` trong `useEffect` mà không cẩn thận → lặp vô hạn.

```jsx
useEffect(() => {
  setCount(count + 1); // chạy mãi mãi
}, []); 
```

✅ Đúng: chỉ setState khi có điều kiện rõ ràng.

---

### 4. Dọn dẹp (Cleanup)

Trả về một function trong `useEffect` để cleanup khi component unmount hoặc khi dependencies thay đổi.

```jsx
function Example() {
  useEffect(() => {
    const id = setInterval(() => {
      console.log("Tick...");
    }, 1000);

    return () => clearInterval(id); // cleanup
  }, []); 

  return <p>Đang chạy...</p>;
}
```

---

## ✅ Tổng kết cách dùng hiệu quả

1. **Luôn xác định dependencies rõ ràng** → tránh chạy thừa.
2. **Đặt side effect vào `useEffect`** → không ảnh hưởng render ban đầu.
3. **Cleanup khi cần** → tránh rò rỉ bộ nhớ.
4. **Không lạm dụng**: nếu có thể tính toán ngay trong render, hãy làm trong render, không dùng `useEffect`.

---


### 6.5 Vòng đời của `useEffect` trong React

Trong React, các **component** có vòng đời riêng (mount → update → unmount). Tuy nhiên, **effect** lại có vòng đời **độc lập**: nó chỉ có hai giai đoạn:

1. **Bắt đầu đồng bộ hóa (setup)** – khi effect được chạy.
2. **Dừng đồng bộ hóa (cleanup)** – khi effect bị hủy hoặc chạy lại.

👉 Điều này có nghĩa là: một component có thể mount/unmount nhiều lần, nhưng mỗi **effect** sẽ tự quản lý vòng đời của riêng nó, tùy thuộc vào dependencies bạn truyền vào.

---

## 🔹 Vòng đời của Component vs Effect

* **Component lifecycle**:

  * **Mount** → Component được render lần đầu.
  * **Update** → Component render lại khi props hoặc state thay đổi.
  * **Unmount** → Component bị gỡ khỏi DOM.

* **Effect lifecycle**:

  * Khi render xong, React **chạy effect** để đồng bộ hóa dữ liệu với “hệ thống bên ngoài”.
  * Nếu dependencies thay đổi, React **cleanup effect cũ**, rồi **chạy effect mới**.
  * Khi component unmount, React **cleanup effect** lần cuối.

---

## 🔹 Ví dụ 1: Cuộn về đầu trang khi đổi route

```jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]); // chạy lại mỗi khi pathname đổi

  return null;
}

export default ScrollToTop;
```

📌 Ở đây:

* Effect phụ thuộc `location.pathname`.
* Mỗi khi path thay đổi → effect chạy → cuộn về đầu trang.
* Khi path không đổi → effect không chạy lại.

---

## 🔹 Ví dụ 2: Đồng bộ state với props

```jsx
import { useEffect, useState } from "react";

function Example({ count }) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (count === 0) {
      setMessage("Count is zero.");
    } else {
      setMessage(`Count is ${count}.`);
    }
  }, [count]); // effect phụ thuộc vào count

  return <p>{message}</p>;
}
```

📌 Nếu `count` thay đổi:

* React cleanup effect cũ → chạy lại effect mới.
* `message` được cập nhật đúng theo `count`.

Nếu bỏ `count` ra khỏi dependencies:

* Effect sẽ không chạy lại khi `count` đổi → UI **không đồng bộ** với dữ liệu.

---

## 🔹 Cách xác định dependencies đúng

Một rule cơ bản: **bất kỳ giá trị nào bạn dùng trong effect phải được liệt kê trong dependencies**.

```jsx
useEffect(() => {
  // đọc giá trị từ `count`
  console.log(count);
}, [count]); 
```

Nếu bỏ `[count]`, bạn sẽ gặp:

* **Lỗi logic**: UI không update.
* **Lỗi performance**: effect chạy không cần thiết (nếu để trống).

---

## 🔹 Ví dụ đặc biệt: Effect luôn chạy lại

```jsx
useEffect(() => {
  console.log("Effect chạy mỗi lần render");
});
```

* Không có mảng dependencies → chạy lại sau **mỗi lần render**.
* Hữu ích khi bạn muốn theo dõi mọi thay đổi, nhưng thường không tối ưu.

---

✅ **Tóm lại**:

* Effect không đi theo “lifecycle của component”, mà có vòng đời riêng: **setup → cleanup → rerun (nếu dependencies đổi)**.
* Luôn xác định dependencies rõ ràng để tránh bug hoặc chạy lại không cần thiết.
* Suy nghĩ effect như: “Đồng bộ state/props của React với thế giới bên ngoài”.

---
### 6.6 Sử dụng **useCallback** trong React

Trong React, mỗi lần component **re-render**, tất cả các hàm được định nghĩa bên trong nó sẽ được tạo lại. Đối với các component đơn giản, điều này không gây ảnh hưởng nhiều. Nhưng trong những ứng dụng phức tạp (đặc biệt khi truyền hàm xuống nhiều component con), việc tạo lại hàm liên tục có thể gây **render thừa** và ảnh hưởng đến hiệu suất.

👉 Đây là lúc **useCallback** phát huy tác dụng.

---

## 1. useCallback là gì?

* **useCallback** là một React Hook cho phép bạn **memoize** (ghi nhớ) các hàm.
* Nghĩa là React sẽ **trả lại cùng một tham chiếu hàm** giữa các lần render nếu các dependencies không thay đổi.

Cú pháp:

```jsx
const memoizedCallback = useCallback(() => {
  // logic của hàm
}, [dependencies]);
```

---

## 2. Vấn đề khi không dùng useCallback

Ví dụ component Counter:

```jsx
import React, { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  const [other, setOther] = useState(0);

  const increase = () => setCount(count + 1);
  const decrease = () => setCount(count - 1);

  const increaseOther = () => setOther(other + 1);
  const decreaseOther = () => setOther(other - 1);

  return (
    <>
      <div>Count: {count}</div>
      <button onClick={increase}>+</button>
      <button onClick={decrease}>-</button>

      <div>Other: {other}</div>
      <button onClick={increaseOther}>+</button>
      <button onClick={decreaseOther}>-</button>
    </>
  );
}
```

📌 Mỗi lần re-render, **4 hàm trên đều được tạo lại**, dù logic không thay đổi. Nếu truyền xuống nhiều component con được memoized bằng `React.memo`, chúng vẫn sẽ re-render vì props là **hàm mới**.

---

## 3. Giải pháp với useCallback

```jsx
import React, { useState, useCallback } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  const [other, setOther] = useState(0);

  const increase = useCallback(() => setCount((c) => c + 1), []);
  const decrease = useCallback(() => setCount((c) => c - 1), []);

  const increaseOther = useCallback(() => setOther((o) => o + 1), []);
  const decreaseOther = useCallback(() => setOther((o) => o - 1), []);

  return (
    <>
      <div>Count: {count}</div>
      <button onClick={increase}>+</button>
      <button onClick={decrease}>-</button>

      <div>Other: {other}</div>
      <button onClick={increaseOther}>+</button>
      <button onClick={decreaseOther}>-</button>
    </>
  );
}
```

📌 Ở đây, các hàm sẽ **giữ cùng một tham chiếu** giữa các lần render, miễn là dependencies không đổi.

---

## 4. Khi nào nên dùng / không nên dùng?

✅ **Nên dùng useCallback khi:**

* Hàm được truyền xuống component con tối ưu bằng `React.memo`.
* Hàm phức tạp, tạo lại nhiều lần gây hao phí.
* Dự án lớn, performance là vấn đề quan trọng.

❌ **Không nên dùng khi:**

* Component đơn giản, ít re-render.
* Hàm chỉ sử dụng trong chính component, không truyền xuống con.
* Việc thêm useCallback làm code rối hơn, không mang lại lợi ích thực sự.

---

## 5. Kết luận

* `useCallback` giúp **ngăn việc tạo lại hàm không cần thiết**, từ đó tránh **render thừa** ở component con.
* Tuy nhiên, đừng lạm dụng! Hãy chỉ dùng khi có bằng chứng rõ ràng về **hiệu suất** bị ảnh hưởng.

---

## 6.7 Sử dụng `useMemo` trong React

Khi ứng dụng của bạn mở rộng, vấn đề về **hiệu suất** trở nên ngày càng quan trọng. Mặc dù React vốn đã nhanh và được tối ưu, việc hiểu và sử dụng thêm các công cụ hỗ trợ có thể giúp mã của bạn chạy mượt hơn. Một trong những công cụ đó chính là **Hook `useMemo`** (và liên quan là `useCallback`).

---

### `useMemo` giải quyết vấn đề gì?

`useMemo` là một Hook giúp **ghi nhớ (memoize) kết quả trả về của một hàm**. Nó nhận 2 tham số:

1. **Callback**: hàm cần được tính toán.
2. **Dependencies**: danh sách các giá trị phụ thuộc.

Khi component render:

* Nếu **dependencies không thay đổi**, `useMemo` sẽ **trả về kết quả đã được lưu trước đó**.
* Nếu **dependencies thay đổi**, callback sẽ được chạy lại để tính toán giá trị mới.

👉 Nói ngắn gọn: `useMemo` giúp tránh việc **tính toán lại không cần thiết**.

---

### Cách dùng `useMemo`

Trước tiên, import nó từ React:

```javascript
import React, { useMemo } from "react";
```

Ví dụ, khi bạn có một hàm tính toán phức tạp:

```javascript
const memoizedValue = useMemo(() => expensiveOperation(param), [param]);
```

* `expensiveOperation(param)` sẽ **chỉ được chạy lại khi `param` thay đổi**.
* Nếu `param` giữ nguyên, `useMemo` sẽ **dùng lại kết quả đã cache**.

---

### Khi nào nên dùng `useMemo`?

Bạn **không nên** đưa `useMemo` vào ngay từ đầu. Hãy viết code bình thường trước, chỉ thêm khi bạn thấy thật sự cần tối ưu.

Ví dụ: Ứng dụng nhập số và liệt kê tất cả số từ `0 → n`. Với `n` nhỏ thì không sao, nhưng nếu `n` rất lớn, việc tính toán này sẽ tốn tài nguyên:

```javascript
function ListedAllNumber({ length }) {
  console.log("Đang tính toán...");

  let numbers = useMemo(() => {
    let results = [];
    for (let i = 0; i < length; i++) {
      results.push(i);
    }
    return results;
  }, [length]);

  return <p>Các số: {numbers.join(",")}</p>;
}
```

Ở ví dụ trên, `useMemo` sẽ chỉ tính toán lại mảng số khi `length` thay đổi, giúp tiết kiệm hiệu suất.

---

### Cẩn thận khi dùng `useMemo`

* **Overhead (chi phí xử lý):** `useMemo` cũng cần tài nguyên để theo dõi dependencies. Nếu tính toán ban đầu không nặng, việc dùng `useMemo` lại có thể khiến code phức tạp và tốn kém hơn.
* **Không có bảo đảm tuyệt đối:** React không đảm bảo 100% rằng giá trị memoized sẽ luôn được giữ lại. App của bạn vẫn cần chạy đúng **ngay cả khi `useMemo` tính toán lại mỗi lần render**.

---

### Kết luận

* Hãy dùng `useMemo` cho những **tác vụ tính toán phức tạp, nặng** (ví dụ: xử lý mảng lớn, tính toán số học phức tạp, filter/sort dữ liệu nhiều phần tử).
* Không nên lạm dụng `useMemo` cho những tác vụ nhỏ.
* Luôn đánh giá xem nó có **thật sự cải thiện hiệu suất** hay chỉ làm code khó đọc hơn.

---

## 6.8 Sử dụng `useSyncExternalStore` trong React

Trong phần này, chúng ta sẽ cùng tìm hiểu về hook **`useSyncExternalStore`**. Đây là một công cụ quan trọng được giới thiệu từ **React 18**, giúp bạn tích hợp những **nguồn dữ liệu trạng thái bên ngoài (external store)** vào trong ứng dụng React một cách chuẩn hóa và an toàn.

---

### `useSyncExternalStore` là gì?

Hook này được thiết kế để:

* **Theo dõi (subscribe)** sự thay đổi từ một dữ liệu bên ngoài React.
* **Đồng bộ hóa (synchronize)** dữ liệu đó với React state.
* **Kích hoạt re-render** các component khi dữ liệu thay đổi.

👉 Nói cách khác, `useSyncExternalStore` là cầu nối để React lắng nghe **state bên ngoài hệ thống React**, ví dụ như:

* **Lịch sử trình duyệt (browser history)**.
* **`localStorage` hoặc `sessionStorage`**.
* **WebSocket hoặc EventEmitter**.
* **Các thư viện quản lý state bên ngoài React**.

---

### Cú pháp

```javascript
const state = useSyncExternalStore(
  subscribe,        // Đăng ký sự kiện thay đổi dữ liệu
  getSnapshot,      // Lấy dữ liệu hiện tại (snapshot)
  getServerSnapshot // (tùy chọn) cho SSR
);
```

* **`subscribe(listener)`**: Định nghĩa cách lắng nghe sự thay đổi dữ liệu và return hàm cleanup để hủy đăng ký.
* **`getSnapshot()`**: Hàm trả về giá trị hiện tại của dữ liệu. Nếu giá trị thay đổi, React sẽ re-render component.
* **`getServerSnapshot()`**: Dùng trong **Server-Side Rendering (SSR)** để trả về snapshot ban đầu.

---

### Ví dụ: Lắng nghe `localStorage`

```javascript
import { useSyncExternalStore } from "react";

const subscribe = (listener) => {
  // Lắng nghe sự kiện thay đổi localStorage
  window.addEventListener("storage", listener);

  // Cleanup khi component unmount
  return () => {
    window.removeEventListener("storage", listener);
  };
};

const getSnapshot = () => {
  return localStorage.getItem("myItem");
};

function LocalStorageWatcher() {
  const value = useSyncExternalStore(subscribe, getSnapshot);

  return (
    <div>
      <h3>Giá trị từ localStorage:</h3>
      <p>{value ?? "Chưa có dữ liệu"}</p>
    </div>
  );
}

export default LocalStorageWatcher;
```

🔎 Ở ví dụ trên:

* `subscribe` đăng ký sự kiện `"storage"` để biết khi nào `localStorage` thay đổi.
* `getSnapshot` luôn trả về giá trị hiện tại của key `"myItem"`.
* Khi `localStorage.setItem("myItem", ...)` được gọi ở bất cứ tab nào → component sẽ tự động re-render để hiển thị dữ liệu mới.

---

### So sánh với `useEffect` thủ công

Nếu không dùng `useSyncExternalStore`, bạn sẽ phải tự viết logic với `useEffect` + `useState`, điều này dễ gây lỗi re-render dư thừa hoặc **state không đồng bộ**.

`useSyncExternalStore` giải quyết vấn đề này bằng cách:

* Chuẩn hóa cách subscribe / cleanup.
* Đảm bảo dữ liệu luôn nhất quán giữa các render.
* Hỗ trợ cả Client và Server Side Rendering.

---

### Kết luận

* Dùng `useSyncExternalStore` khi bạn cần đồng bộ hóa dữ liệu từ **store bên ngoài React**.
* Nó cực kỳ hữu ích khi làm việc với: `localStorage`, `sessionStorage`, `window.location`, WebSocket, hoặc state từ thư viện khác (Redux, Zustand, v.v.).
* Nếu chỉ quản lý state nội bộ trong React → bạn vẫn dùng `useState`, `useReducer`, `useEffect`.

---
### 6.9 Custom Hooks trong ReactJS

Trong React, ngoài những **Hooks tích hợp sẵn** như `useState`, `useEffect`, `useContext`, … bạn còn có thể **tự tạo Custom Hook** để tái sử dụng logic trong nhiều component khác nhau. Đây là một kỹ thuật quan trọng giúp code **gọn gàng, dễ bảo trì và giảm lặp lại**.

---

## 🔹 Tại sao cần Custom Hook?

* Tránh **trùng lặp logic** (ví dụ: theo dõi trạng thái mạng, fetch dữ liệu API, debounce input, …).
* Giúp code **dễ đọc, dễ bảo trì**.
* Cho phép **chia sẻ logic** giữa nhiều component.

---

## 🔹 Ví dụ: Kiểm tra trạng thái mạng

Giả sử bạn có 2 component cần theo dõi trạng thái mạng:

1. `StatusBar` hiển thị tình trạng kết nối.
2. `SaveButton` cho phép lưu dữ liệu nếu đang online.

Nếu viết trực tiếp trong mỗi component, bạn sẽ phải lặp lại cùng một đoạn code `useEffect` để lắng nghe sự kiện `online` và `offline`.

👉 Thay vì lặp lại, ta sẽ tách thành một **Custom Hook**.

---

## 🔹 Cách tạo Custom Hook

```jsx
import { useState, useEffect } from "react";

// Custom Hook
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}
```

---

## 🔹 Sử dụng Custom Hook

```jsx
function StatusBar() {
  const isOnline = useOnlineStatus();

  return <h1>{isOnline ? "✅ Trực Tuyến" : "❌ Ngắt Kết Nối"}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log("✅ Tiến trình đã được lưu");
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? "Lưu tiến trình" : "Đang kết nối..."}
    </button>
  );
}
```

---

## 🔹 Lợi ích của Custom Hook

* **Tái sử dụng logic**: Viết một lần, dùng nhiều nơi.
* **Giảm trùng lặp code**.
* **Tách biệt logic & UI** → dễ test hơn.
* **Tăng khả năng mở rộng** → khi cần bổ sung logic (ví dụ log sự kiện, thống kê), chỉ cần chỉnh sửa trong Hook.

---

## 🔹 Lưu ý khi viết Custom Hook

* Tên Hook **phải bắt đầu bằng `use`** → để React biết đó là Hook (ví dụ: `useOnlineStatus`, `useFetch`, `useDebounce`).
* Custom Hook **cũng có thể dùng các Hook khác bên trong** (`useState`, `useEffect`, `useMemo`, …).
* Custom Hook chỉ là một **hàm JavaScript**, nhưng phải tuân theo **quy tắc Hooks** (chỉ gọi Hook ở cấp cao nhất, không gọi trong vòng lặp/điều kiện).

---

👉 Với ví dụ trên, bạn đã thấy cách **trích xuất logic chung** ra một Custom Hook. Trong thực tế, Custom Hook thường dùng để:

* Xử lý **fetch API** (`useFetch`).
* Theo dõi **window size** (`useWindowSize`).
* Xử lý **debounce/throttle** (`useDebounce`).
* Quản lý **form** (`useForm`).

---

### 6.10 Sử dụng `useImperativeHandle` trong React

`useImperativeHandle` là một hook **khá đặc biệt và khó hiểu** trong React vì nó đi ngược lại cách khai báo thông thường của React. Nó được dùng để **tùy chỉnh giá trị mà một ref nhận được khi gán vào một component tuỳ chỉnh**.

> Lưu ý: Hook này chỉ nên dùng khi thật sự cần thiết, chẳng hạn khi muốn **ẩn bớt logic nội bộ của component** hoặc **kiểm soát những gì ref có thể truy cập**.

---

## 🔹 Nhắc lại về `forwardRef`

Khi bạn muốn truyền một `ref` tới component tuỳ chỉnh, bạn cần dùng `React.forwardRef`. Ví dụ:

```jsx
function CustomInput(props, ref) {
  return <input ref={ref} {...props} />;
}

export default React.forwardRef(CustomInput);
```

Bây giờ, khi sử dụng:

```jsx
function App() {
  const inputRef = useRef();

  return (
    <>
      <CustomInput ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
    </>
  );
}
```

`ref` sẽ trỏ đến input bên trong `CustomInput`.

---

## 🔹 `useImperativeHandle` là gì?

* Hook này cho phép **tùy chỉnh giá trị mà ref nhận được**.
* Khi dùng `ref` với component tuỳ chỉnh, bạn không cần để ref trỏ trực tiếp đến DOM element, mà có thể **trả về object tuỳ chỉnh** với những hàm bạn muốn expose.
* Cú pháp:

```jsx
useImperativeHandle(ref, () => value, [dependencies])
```

* `ref`: ref nhận từ `forwardRef`.
* `value`: giá trị bạn muốn ref nhận, thường là một object chứa các phương thức.
* `[dependencies]`: mảng tương tự `useEffect` để cập nhật giá trị khi props thay đổi.

---

## 🔹 Ví dụ cơ bản

```jsx
function CustomInput(props, ref) {
  useImperativeHandle(ref, () => ({
    alertHi: () => alert("Hi")
  }));

  return <input style={{ backgroundColor: "red" }} {...props} />;
}

export default React.forwardRef(CustomInput);
```

Sử dụng trong App:

```jsx
function App() {
  const inputRef = useRef();

  return (
    <>
      <CustomInput ref={inputRef} />
      <button onClick={() => inputRef.current.alertHi()}>Alert</button>
    </>
  );
}
```

* Khi click nút, `alertHi` được gọi thông qua `ref.current.alertHi()`.
* Không cần truy cập trực tiếp đến DOM element.

---

## 🔹 Ví dụ nâng cao với props

Bạn có thể expose các phương thức phụ thuộc vào `props`:

```jsx
function CustomInput(props, ref) {
  useImperativeHandle(
    ref,
    () => ({
      alertValue: () => alert(props.value)
    }),
    [props.value]
  );

  return <input ref={ref} style={{ backgroundColor: "red" }} {...props} />;
}

export default React.forwardRef(CustomInput);
```

* `alertValue` luôn cập nhật giá trị mới của `props.value`.
* Dependency `[props.value]` đảm bảo `useImperativeHandle` chạy lại khi props thay đổi.

---

## 🔹 Khi nào dùng `useImperativeHandle`

* Khi muốn **ẩn chi tiết DOM hoặc logic nội bộ của component**.
* Khi muốn **giới hạn những gì ref có thể truy cập** từ bên ngoài, thay vì expose toàn bộ element.
* Thường dùng kết hợp với **forwardRef** để component tuỳ chỉnh vẫn có thể được điều khiển từ ngoài.

---

## 🔹 Lợi ích

* **Bảo mật và kiểm soát tốt hơn**: chỉ expose những gì cần thiết.
* **Tách biệt UI và API của component**: ref chỉ có thể dùng các phương thức mà bạn cung cấp.
* **Ứng dụng thực tế**: custom input, modal, form, player, …

---
