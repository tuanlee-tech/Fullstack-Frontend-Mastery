## Ngày 4. Tương tác trong Reactjs

### 4.1 Sự kiện (event) trong Reactjs

Trong React, bạn có thể thêm các xử lý sự kiện (event handlers) vào JSX của bạn. Các event handlers là các hàm sẽ được kích hoạt khi có sự tương tác như nhấp chuột, di chuột qua,... và nhiều tương tác khác.

---

### Thêm xử lý sự kiện trong Reactjs

Để thêm một xử lý sự kiện, đầu tiên bạn sẽ cần định nghĩa một hàm và sau đó truyền nó như một prop cho thẻ JSX tương ứng.

Ví dụ, một nút không làm gì cả:

```jsx
import React from "react";

export default function Button() {
  return <button>Tôi không làm gì cả</button>;
}
```

Thêm xử lý sự kiện click:

```jsx
import React from "react";

export default function Button() {
  function handleClick() {
    alert("Bạn đã click chuột vào tôi!");
  }

  return <button onClick={handleClick}>Nhấp chuột vào tôi</button>;
}
```

Ngoài ra, có thể định nghĩa trực tiếp trong JSX:

```jsx
<button onClick={function handleClick() {
  alert('Bạn đã nhấp chuột vào tôi!');
}}>
```

Hoặc dùng arrow function:

```jsx
<button onClick={() => {
  alert('Bạn đã nhấp chuột vào tôi!');
}}>
```

---

### Lưu ý quan trọng

* **Đúng**: `<button onClick={handleClick}>` → hàm được truyền, chỉ chạy khi click.
* **Sai**: `<button onClick={handleClick()}>` → hàm chạy ngay khi render, không cần click.

---

### Đọc props trong xử lý sự kiện

Vì sự kiện được định nghĩa trong component, nó có thể truy cập `props`:

```jsx
import React from "react";

function AlertButton({ message, children }) {
  return <button onClick={() => alert(message)}>{children}</button>;
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="Bắt đầu phát!">Phát phim</AlertButton>
      <AlertButton message="Đang tải lên!">Tải lên hình ảnh</AlertButton>
    </div>
  );
}
```

---

### Truyền xử lý sự kiện như props

```jsx
import React from "react";

function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`Bắt đầu phát "${movieName}"!`);
  }

  return <Button onClick={handlePlayClick}>Phát "{movieName}"</Button>;
}

function UploadButton() {
  return (
    <Button onClick={() => alert("Đang tải lên!")}>Tải lên hình ảnh</Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Kiki's Delivery Service" />
      <UploadButton />
    </div>
  );
}
```

---

### Đặt tên props của xử lý sự kiện

```jsx
import React from "react";

function Button({ onSmash, children }) {
  return <button onClick={onSmash}>{children}</button>;
}
```

Hoặc dùng props theo ngữ cảnh:

```jsx
import React from "react";

export default function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>Phát phim</Button>
      <Button onClick={onUploadImage}>Tải lên hình ảnh</Button>
    </div>
  );
}
```

---

### Lan truyền sự kiện trong Reactjs

Sự kiện sẽ lan truyền từ component con lên component cha.

```jsx
import React from "react";

export default function Toolbar() {
  return (
    <div
      className="Toolbar"
      onClick={() => {
        alert("Bạn đã nhấp chuột vào thanh công cụ!");
      }}
    >
      <button onClick={() => alert("Bắt đầu phát!")}>Phát phim</button>
      <button onClick={() => alert("Đang tải lên!")}>Tải lên hình ảnh</button>
    </div>
  );
}
```

Click vào nút → hiển thị 2 alert (từ button + div cha).
Click vào div → hiển thị 1 alert (từ div cha).

---

### Ngừng lan truyền sự kiện trong Reactjs

Dùng `e.stopPropagation()`:

```jsx
import React from "react";

function Button({ onClick, children }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div
      className="Toolbar"
      onClick={() => {
        alert("Bạn đã nhấp chuột vào thanh công cụ!");
      }}
    >
      <Button onClick={() => alert("Bắt đầu phát!")}>Phát phim</Button>
      <Button onClick={() => alert("Đang tải lên!")}>Tải lên hình ảnh</Button>
    </div>
  );
}
```

Khi click vào button:

1. React gọi `onClick` trong `<button>`.
2. Hàm này gọi `e.stopPropagation()`, ngăn sự kiện lan lên `<div>`.
3. Chỉ alert từ button xuất hiện.

---

👉 Xử lý sự kiện là nền tảng để xây dựng ứng dụng React tương tác. Bạn có thể thêm, truyền, đặt tên, kiểm soát lan truyền sự kiện để tạo UI phức tạp và linh hoạt.

---
## 4.2 State trong Reactjs

State về cơ bản là một giá trị biến đặc biệt trong React. Nó là giá trị mà khi thay đổi, React sẽ tiến hành việc tính toán lại kết quả của component, và từ đó cập nhật lại giao diện. Để sử dụng được state, chúng ta cần import một function từ trong thư viện React là **useState**. useState và một số function khác trong thư viện được gọi là các “hooks”.

---

### Ví dụ về việc sử dụng biến thông thường

```jsx
const App = () => {
  let count = 0;

  const handleClick = () => {
    count = count + 1;
    console.log("count: ", count)
  }

  return (
    <div>
      <span>{count}</span>
      <button onClick={handleClick}>Increase</button>
    </div>
  )
}
```

Trong ví dụ trên, khi ta click vào button, giá trị của biến `count` sẽ được thay đổi và được in ra màn hình console. Tuy nhiên, giao diện sẽ **không được cập nhật** vì React không theo dõi sự thay đổi của các biến thông thường.

Khi muốn React tính toán lại giao diện, chúng ta phải sử dụng **State**.

---

### Sử dụng state với React hooks

Cú pháp cơ bản của `useState` như sau:

```jsx
const <tên_biến_state> = useState(<giá_trị_ban_đầu_của_state>)
```

`useState` có các đặc điểm sau:

* Tham số đầu vào: giá trị khởi đầu cho state.
* Giá trị trả về: một **array gồm 2 phần tử**:

  1. Giá trị state hiện tại.
  2. Một function để cập nhật state.

---

### Ví dụ cơ bản với useState

```jsx
import { useState } from 'react'

const App = () => {
  const countState = useState(10)
	
  console.log("count: ", countState[0]);

  return <div>{countState[0]}</div>
}
```

Ở đây, `countState` là một mảng gồm 2 phần tử:

* `countState[0]`: giá trị state hiện tại (ban đầu là `10`).
* `countState[1]`: hàm setter để cập nhật state.

---

### Cập nhật state với setState

```jsx
import { useState } from 'react'

const App = () => {
  const countState = useState(10)
  const count = countState[0]
  const setCount = countState[1]

  const onIncreaseClick = () => {
    setCount(count + 1)
  }	

  return (
    <div>
      <span>{count}</span>
      <button onClick={onIncreaseClick}>Increase</button>
    </div>
  )
}
```

Mỗi khi gọi `setCount`, React sẽ cập nhật giá trị mới của `count` và render lại component để hiển thị giao diện mới.

---

### Cú pháp destructuring khi khai báo state

Thay vì viết dài dòng, ta thường sử dụng cú pháp sau:

```jsx
const [count, setCount] = useState(10)
```

---

### Cấu trúc useState trong Reactjs

```jsx
const [stateVariable, setStateVariable] = useState(initialValue);
```

* `stateVariable`: giá trị state hiện tại.
* `setStateVariable`: hàm setter để cập nhật state.
* `initialValue`: giá trị khởi tạo ban đầu.

React sẽ luôn ghi nhớ giá trị state giữa các lần render và cập nhật giao diện khi setter được gọi.

---

### Sử dụng nhiều biến state trong component

Một component có thể chứa nhiều state khác nhau:

```jsx
import { useState } from 'react'

const App = () => {
  const [index, setIndex] = useState(0)
  const [showMore, setShowMore] = useState(false)

  return (
    <div>
      <p>Index: {index}</p>
      <button onClick={() => setIndex(index + 1)}>Increase Index</button>
      
      <p>{showMore ? "Chi tiết nội dung..." : "..."}</p>
      <button onClick={() => setShowMore(!showMore)}>
        {showMore ? "Ẩn bớt" : "Xem thêm"}
      </button>
    </div>
  )
}
```

Việc sử dụng nhiều state giúp dễ quản lý khi chúng **không liên quan** đến nhau. Nếu hai giá trị luôn thay đổi cùng lúc, có thể gộp chúng lại thành một state duy nhất để thuận tiện hơn.

---
## 4.3 Cơ chế render trong Reactjs

Trước khi các component được hiển thị trên màn hình, chúng phải được **render** bởi React. Hiểu rõ các bước trong quá trình render sẽ giúp nắm bắt cách React hoạt động và lý do tại sao giao diện thay đổi.

Quá trình render có thể được hình dung qua 3 bước:

1. **Kích hoạt render lần đầu tiên**
2. **React render các component**
3. **Commit thay đổi vào DOM**

---

### Bước 1: Kích hoạt render lần đầu tiên

Khi ứng dụng được khởi tạo, cần kích hoạt render ban đầu. Điều này được thực hiện bằng cách gọi `createRoot` với một nút DOM mục tiêu, sau đó gọi phương thức `render` để hiển thị component:

```jsx
import Image from "./Image.js";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root"));
root.render(<Image />);
```

---

### Bước 2: React render các component

Khi render được kích hoạt, React sẽ **gọi các component** để xác định nội dung hiển thị.

* Trong lần render đầu tiên: React gọi component gốc và sau đó gọi các component con.
* Trong các lần render tiếp theo: React chỉ gọi lại component khi `setState` hoặc `props` thay đổi.

Ví dụ:

```jsx
export default function Gallery() {
  return (
    <section>
      <h1>Inspiring Sculptures</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

* Lần render đầu tiên: React tạo ra các nút DOM cho `<section>`, `<h1>` và ba thẻ `<img>`.
* Lần render tiếp theo: React tính toán lại state/props, nếu có thay đổi thì component sẽ được render lại.

---

### Bước 3: React áp dụng thay đổi vào DOM

Sau khi hoàn thành quá trình render (gọi component), React sẽ cập nhật DOM:

* **Render lần đầu tiên:** React dùng `appendChild()` để gắn toàn bộ các nút DOM đã tạo vào màn hình.
* **Render tiếp theo:** React chỉ thực hiện các thao tác tối thiểu cần thiết để DOM khớp với kết quả render mới nhất.

Ví dụ:

```jsx
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
  );
}
```

* React sẽ chỉ cập nhật nội dung trong thẻ `<h1>` khi `time` thay đổi.
* Thẻ `<input>` vẫn được giữ nguyên vì nó ở đúng vị trí cũ, nên giá trị người dùng nhập vào **không bị mất** khi component render lại.

👉 Đây chính là sức mạnh của cơ chế **reconciliation** trong React: chỉ thay đổi phần DOM thực sự cần thiết, giúp tối ưu hiệu năng.

---

## 4.4 Cập nhật state hàng loạt trong ReactJS

Khi làm việc với **state**, một điểm quan trọng cần lưu ý:
👉 Mỗi lần gọi `setState` sẽ **không lập tức render lại giao diện**, mà React sẽ **gom nhóm (batching)** các cập nhật, rồi render một lần sau khi toàn bộ xử lý trong event handler kết thúc.

### 1. Batching là gì?

Giả sử bạn có một nút bấm `+3` với code sau:

```jsx
import { useState } from "react";

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button
        onClick={() => {
          setNumber(number + 1);
          setNumber(number + 1);
          setNumber(number + 1);
        }}
      >
        +3
      </button>
    </>
  );
}
```

Có thể bạn kỳ vọng `number` sẽ tăng 3 lần, nhưng thực tế nó chỉ tăng **1 lần**.
Lý do: trong suốt một lần render, giá trị `number` là cố định. Khi bạn gọi nhiều lần `setNumber(number + 1)`, tất cả đều dựa trên giá trị **0 ban đầu** → nên React chỉ nhận “thay thế bằng 1” nhiều lần.

🔑 React sẽ **chờ event handler chạy xong** rồi mới xử lý hàng đợi state update. Đây là batching – tương tự như người phục vụ nhà hàng chờ bạn đặt hết món mới mang đơn xuống bếp.

---

### 2. Cách cập nhật nhiều lần trên cùng một state

Để giải quyết, bạn có thể truyền **hàm cập nhật (updater function)** thay vì giá trị:

```jsx
setNumber(n => n + 1);
```

Ví dụ:

```jsx
import { useState } from "react";

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button
        onClick={() => {
          setNumber((n) => n + 1);
          setNumber((n) => n + 1);
          setNumber((n) => n + 1);
        }}
      >
        +3
      </button>
    </>
  );
}
```

Khi click:

* Lần 1: `n = 0 → 1`
* Lần 2: `n = 1 → 2`
* Lần 3: `n = 2 → 3`

👉 Kết quả cuối cùng: `number = 3`.

---

### 3. Kết hợp “replace” và “update” trong hàng đợi

Ví dụ khác:

```jsx
<button
  onClick={() => {
    setNumber(number + 5);
    setNumber((n) => n + 1);
  }}
>
  Update
</button>
```

* Dòng 1: `setNumber(number + 5)` → thêm “replace bằng 5” vào hàng đợi.
* Dòng 2: `setNumber(n => n + 1)` → thêm hàm cập nhật.

Khi xử lý hàng đợi:

1. Replace: `number = 5`.
2. Update: `5 + 1 = 6`.

👉 Kết quả cuối cùng: `6`.

---

### 4. Quy tắc đặt tên cho hàm cập nhật

Để code dễ đọc, nên đặt tên tham số dựa theo state:

```jsx
setEnabled(prevEnabled => !prevEnabled);
setCount(c => c + 1);
setLastName(prev => prev.toUpperCase());
```

Cách này giúp dễ hiểu và giảm nhầm lẫn khi state phức tạp.

---

✅ **Tóm lại:**

* React gom nhóm (batching) state updates để tránh render thừa.
* Nếu cần cập nhật nhiều lần trên cùng state, hãy dùng **updater function**.
* Các giá trị trực tiếp (`number + 5`) sẽ **replace**, còn updater function (`n => n + 1`) sẽ **update dựa trên giá trị trước đó**.

---

## 4.5 Cập nhật state của Đối tượng (Object) trong ReactJS

Trong React, biến state có thể là **bất kỳ kiểu dữ liệu nào**: số, chuỗi, mảng, hoặc đối tượng (object).
Khi làm việc với **object trong state**, bạn **không được thay đổi trực tiếp** object hiện tại. Thay vào đó, bạn phải luôn **tạo một bản sao mới** và gán lại state, để React nhận biết có sự thay đổi và trigger render lại.

---

### 1. Nhắc lại useState cơ bản

```jsx
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Giá trị hiện tại: {count}</p>
      <button onClick={increment}>Tăng</button>
    </div>
  );
}
```

Ở ví dụ này, `count` là kiểu **number** nên việc cập nhật khá đơn giản. Nhưng với **object**, cần cẩn thận hơn.

---

### 2. Cập nhật object với useState

Sai lầm thường gặp: **chỉnh trực tiếp object**. Ví dụ:

```jsx
user.email = "new@example.com"; // ❌ không nên
setUser(user);
```

Cách này khiến React **không phát hiện thay đổi**, dẫn đến UI không re-render hoặc gây bug khó lường.

✅ Đúng: Luôn tạo **bản sao mới** của object rồi cập nhật:

```jsx
import { useState } from "react";

export default function UserProfile() {
  const [user, setUser] = useState({
    name: "John Doe",
    age: 30,
    email: "johndoe@example.com",
  });

  const updateUserEmail = (newEmail) => {
    const updatedUser = { ...user, email: newEmail };
    setUser(updatedUser);
  };

  return (
    <div>
      <p>Tên: {user.name}</p>
      <p>Tuổi: {user.age}</p>
      <p>Email: {user.email}</p>
      <button onClick={() => updateUserEmail("newemail@example.com")}>
        Đổi Email
      </button>
    </div>
  );
}
```

---

### 3. Sử dụng toán tử Spread `...`

Toán tử Spread giúp sao chép object cũ → tạo object mới.

```jsx
import { useState } from "react";

export default function UpdateObject() {
  const [person, setPerson] = useState({
    firstName: "John",
    lastName: "Doe",
    age: 30,
  });

  const updateFirstName = (newFirstName) => {
    setPerson({ ...person, firstName: newFirstName });
  };

  return (
    <div>
      <p>Họ: {person.lastName}</p>
      <p>Tên: {person.firstName}</p>
      <p>Tuổi: {person.age}</p>
      <button onClick={() => updateFirstName("Alice")}>Đổi tên thành Alice</button>
    </div>
  );
}
```

👉 Spread giúp giữ nguyên các thuộc tính cũ (`lastName`, `age`) và chỉ thay đổi `firstName`.

---

### 4. Xử lý Object lồng nhau (Nested Objects)

Với object lồng nhau, bạn cần sao chép cả **cấp con**. Nếu chỉ spread cấp 1, các cấp con vẫn còn tham chiếu tới object cũ.

Ví dụ:

```jsx
import { useState } from "react";

export default function NestedObject() {
  const [person, setPerson] = useState({
    name: "John Doe",
    age: 30,
    address: {
      city: "Hanoi",
      country: "Vietnam",
    },
  });

  const updateCity = (newCity) => {
    setPerson({
      ...person,
      address: { ...person.address, city: newCity }, // copy cả address
    });
  };

  return (
    <div>
      <p>Tên: {person.name}</p>
      <p>Thành phố: {person.address.city}</p>
      <p>Quốc gia: {person.address.country}</p>
      <button onClick={() => updateCity("Ho Chi Minh")}>
        Đổi thành phố
      </button>
    </div>
  );
}
```

👉 Ở đây, `address` được copy riêng bằng `{ ...person.address }` để tránh mutate object cũ.

---

✅ **Tóm tắt quy tắc khi dùng object trong state:**

1. Không bao giờ mutate trực tiếp object.
2. Luôn tạo bản sao mới bằng **spread (`...`) hoặc các cách copy khác**.
3. Với nested objects, cần copy từng cấp bạn muốn thay đổi.

---
## 4.6 Cập nhật state của Mảng (Array) trong ReactJS

Trong JavaScript, mảng là một cấu trúc dữ liệu **mutable** (có thể thay đổi). Tuy nhiên, trong React, khi một mảng được lưu trong state, ta phải coi nó là **immutable** (bất biến). Điều này đồng nghĩa với việc không được thay đổi trực tiếp mảng gốc, mà cần tạo một mảng mới và set lại state.

---

### 1. Cập nhật mảng mà không thay đổi trực tiếp

Trong React, bạn **không nên**:

```js
arr[0] = "bird";        // ❌ thay đổi trực tiếp
arr.push("cat");        // ❌ thay đổi trực tiếp
arr.pop();              // ❌ thay đổi trực tiếp
```

Thay vào đó, hãy sử dụng các phương thức **không biến đổi** (`map`, `filter`, `slice`, `concat`, spread operator `...`).

| Tránh sử dụng (gây thay đổi)   | Khuyến khích sử dụng (immutable)                |
| ------------------------------ | ----------------------------------------------- |
| `push()`, `unshift()`          | `concat()`, `[...arr, newItem]`                 |
| `pop()`, `shift()`, `splice()` | `filter()`, `slice()`                           |
| `splice()`, `arr[i] = ...`     | `map()`                                         |
| `reverse()`, `sort()`          | Sao chép mảng trước, rồi `reverse()` / `sort()` |

---

### 2. Thêm phần tử vào mảng

Sai cách:

```js
artists.push(newArtist); // ❌
setArtists(artists);     // Không trigger re-render
```

Đúng cách:

```jsx
setArtists([...artists, { id: nextId++, name: name }]);
```

---

### 3. Xóa phần tử khỏi mảng

Dùng `filter()` để tạo mảng mới không chứa phần tử bị xóa:

```jsx
setArtists(artists.filter((a) => a.id !== artist.id));
```

---

### 4. Biến đổi phần tử trong mảng

Dùng `map()` để tạo mảng mới, thay đổi phần tử cần thiết:

```jsx
setShapes(
  shapes.map((shape) =>
    shape.type === "circle"
      ? { ...shape, y: shape.y + 50 }
      : shape
  )
);
```

---

### 5. Thay thế phần tử trong mảng

Không dùng:

```js
arr[0] = "bird"; // ❌ mutate
```

Đúng cách:

```jsx
setList(
  list.map((item, i) => (i === 0 ? "bird" : item))
);
```

---

### 6. Chèn phần tử vào giữa mảng

Dùng spread + `slice()`:

```jsx
setList([
  ...list.slice(0, 1),
  "new item",
  ...list.slice(1),
]);
```

---

### 7. Đảo ngược và sắp xếp mảng

`reverse()` và `sort()` là **mutable**, vì vậy cần sao chép mảng trước khi gọi:

```jsx
const nextList = [...list];
nextList.reverse();
setList(nextList);
```

Hoặc:

```jsx
const nextList = [...list].sort();
setList(nextList);
```

---

### 8. Cảnh báo khi sao chép mảng có object bên trong

Sao chép mảng chỉ là **shallow copy** (sao chép nông). Nghĩa là object bên trong vẫn tham chiếu chung.

Ví dụ:

```js
const nextList = [...list];
nextList[0].seen = true; // ❌ mutate object gốc
setList(nextList);
```

`nextList[0]` và `list[0]` trỏ cùng một object, nên sửa `nextList[0]` cũng làm thay đổi `list[0]`.

👉 Cần **copy sâu (deep copy)** nếu muốn thay đổi object trong mảng:

```jsx
setList(
  list.map((item, i) =>
    i === 0 ? { ...item, seen: true } : item
  )
);
```
