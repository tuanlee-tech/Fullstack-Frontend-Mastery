### 5. Quản lý state trong React

#### 5.1 Sử dụng State trong React sao cho hiệu quả

**Thời lượng: \~8 phút đọc**

Cách bạn cấu trúc **state** trong React ảnh hưởng trực tiếp đến việc **dễ sửa đổi**, **dễ bảo trì**, và **giảm bug** trong ứng dụng. Dưới đây là các nguyên tắc quan trọng cần ghi nhớ.

---

### Nguyên tắc cấu trúc state

1. **Nhóm state có liên quan**
   Nếu nhiều biến state luôn được cập nhật cùng lúc → nên gộp thành một state duy nhất.

   ```jsx
   // Cách 1: tách rời
   const [x, setX] = useState(0);
   const [y, setY] = useState(0);

   // Cách 2: gộp lại
   const [position, setPosition] = useState({ x: 0, y: 0 });
   ```

   👉 Giúp tránh quên đồng bộ hóa giữa các state.

---

2. **Tránh state không thống nhất**
   Khi nhiều biến state có thể mâu thuẫn với nhau → dùng một biến chung có giá trị rõ ràng hơn.

   ```jsx
   // Không tốt
   const [isSending, setIsSending] = useState(false);
   const [isSent, setIsSent] = useState(false);

   // Tốt hơn
   const [status, setStatus] = useState("typing"); // 'typing' | 'sending' | 'sent'
   ```

   👉 State trở nên dễ theo dõi và giảm khả năng lỗi logic.

---

3. **Tránh state dư thừa**
   Nếu một giá trị có thể được **tính toán từ state hoặc props khác**, không cần đưa nó vào state.

   ```jsx
   // Có state dư thừa
   const [firstName, setFirstName] = useState("");
   const [lastName, setLastName] = useState("");
   const [fullName, setFullName] = useState(""); // ❌

   // Loại bỏ state dư thừa
   const fullName = firstName + " " + lastName; // ✅
   ```

   👉 `fullName` luôn chính xác mà không cần đồng bộ thủ công.

---

4. **Tránh trùng lặp dữ liệu trong state**
   Nếu dữ liệu giống nhau được lưu ở nhiều nơi → dễ gây bất đồng bộ khi cập nhật.
   Chỉ nên lưu **nguồn dữ liệu gốc duy nhất**.

---

5. **Tránh state lồng nhau quá sâu**
   State có nhiều cấp độ lồng nhau → khó cập nhật.
   Thay vào đó, nên làm **phẳng dữ liệu**.

   ```jsx
   // Lồng nhau sâu
   const initialTravelPlan = {
     id: 0,
     title: "(Root)",
     childPlaces: [
       {
         id: 1,
         title: "Earth",
         childPlaces: [
           { id: 2, title: "Africa", childPlaces: [] }
         ],
       },
     ],
   };

   // Cấu trúc phẳng
   const initialTravelPlan = {
     0: { id: 0, title: "(Root)", childIds: [1] },
     1: { id: 1, title: "Earth", childIds: [2] },
     2: { id: 2, title: "Africa", childIds: [] },
   };
   ```

   👉 Cập nhật trở nên đơn giản, chỉ cần thao tác trên **id và quan hệ** thay vì chỉnh sửa object lồng nhau.

---

### Kết luận

* **Nhóm state liên quan** để giảm sự phân tán.
* **Tránh mâu thuẫn** bằng cách gom thành state duy nhất.
* **Không lặp lại dữ liệu** có thể tính toán.
* **Hạn chế lồng nhau sâu**, ưu tiên state phẳng để dễ quản lý.

Bằng cách áp dụng những nguyên tắc này, ứng dụng React sẽ trở nên **dễ bảo trì, ít lỗi và dễ mở rộng**.

---

## 5.2 Chia sẻ state giữa các component trong React

Trong nhiều tình huống, bạn sẽ muốn **state của hai hoặc nhiều component thay đổi đồng bộ với nhau**. Khi đó, cách tiếp cận chuẩn trong React là **“nâng state lên” (lifting state up)**: đưa state từ các component con lên component cha chung gần nhất, rồi truyền state xuống qua `props`.

Đây là một trong những kỹ thuật quan trọng nhất khi làm việc với React.

---

### Ví dụ: Accordion với nhiều Panel

Giả sử ta có một component cha `Accordion` và hai component con `Panel`. Ban đầu, mỗi `Panel` tự quản lý state riêng để kiểm soát hiển thị:

```jsx
// Panel tự quản lý state riêng (chưa tối ưu)
function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);

  return (
    <section>
      <h3>{title}</h3>
      {isActive ? <p>{children}</p> : null}
      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? "Hide" : "Show"}
      </button>
    </section>
  );
}
```

Trong trường hợp này, khi mở Panel 1 rồi mở Panel 2, cả hai sẽ mở cùng lúc — hoạt động độc lập, không có sự điều phối.

---

### Cách giải quyết: Nâng state lên

#### **Bước 1: Loại bỏ state ở component con**

Thay vì để `Panel` tự nắm `isActive`, ta chuyển trách nhiệm này lên `Accordion`:

```jsx
function Panel({ title, children, isActive, onShow }) {
  return (
    <section>
      <h3>{title}</h3>
      {isActive ? <p>{children}</p> : null}
      <button onClick={onShow}>
        {isActive ? "Hide" : "Show"}
      </button>
    </section>
  );
}
```

---

#### **Bước 2: Truyền state từ component cha**

Ở `Accordion`, ta quản lý state `activeIndex` để biết Panel nào đang mở:

```jsx
export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        Almaty is the largest city in Kazakhstan...
      </Panel>

      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name Almaty comes from...
      </Panel>
    </>
  );
}
```

---

### Kết quả

* `Accordion` giữ quyền kiểm soát state.
* Mỗi `Panel` chỉ nhận props và hành xử theo chỉ dẫn.
* Khi mở một `Panel`, `activeIndex` thay đổi → panel còn lại tự động đóng.

---

✅ **Nguyên tắc rút ra**: Khi nhiều component cần “nói chuyện” với nhau, hãy tìm **component cha chung gần nhất** và đưa state lên đó.

---


## 5.3 Kiểm soát State trong React


State là một khái niệm quan trọng trong React, và nó được quản lý một cách cẩn thận giữa các component. React theo dõi state dựa trên **vị trí của component trong UI Tree (cây giao diện người dùng)**. Điều này có nghĩa là bạn có thể kiểm soát khi nào state được giữ nguyên và khi nào nó bị làm mới giữa các lần render.

---

### Cây giao diện người dùng (UI Tree) là gì?

* Trình duyệt web sử dụng cấu trúc cây để mô hình hóa giao diện:

  * **DOM**: đại diện cho các phần tử HTML.
  * **CSSOM**: đại diện cho cấu trúc CSS.

* React cũng hoạt động tương tự: JSX của bạn được chuyển thành một **UI Tree nội bộ**. Sau đó, React DOM đồng bộ UI Tree này với DOM thật của trình duyệt.

Mỗi component trong cây này sẽ có state **riêng biệt và độc lập**.

Ví dụ: Nếu bạn render hai component `<Counter>` cạnh nhau, mỗi component sẽ có `state` riêng (ví dụ: `score`, `hover`). Khi bạn click vào một cái, chỉ state của nó thay đổi — cái còn lại không bị ảnh hưởng.

---

### Khi nào state được giữ nguyên?

React sẽ giữ state **nếu cùng một component được render lại tại cùng một vị trí trong UI Tree**.

* Nếu bạn xóa component hoặc thay thế nó bằng một component khác tại vị trí đó → state cũ bị hủy bỏ.

➡️ Điều này có nghĩa: Để state không bị reset, **giữ nguyên cấu trúc cây** giữa các lần render, chỉ thay đổi dữ liệu.

---

### Sử dụng Keys trong React

Khi làm việc với **danh sách component**, React cần một cách để nhận diện mỗi phần tử.

* Thuộc tính **`key`** giúp React biết phần tử nào đã thay đổi, được thêm hoặc bị xóa.
* Keys cần **duy nhất trong danh sách**, thường sử dụng `id` hoặc một giá trị định danh trong dữ liệu.

Ví dụ:

```jsx
const items = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  { id: 3, name: "Item 3" },
];

function ItemList() {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

Nếu không có `key`, React sẽ khó xác định phần tử nào thay đổi → dễ gây reset state ngoài ý muốn.

---

### Sử dụng dữ liệu bất biến (Immutable Data)

Khi làm việc với state, bạn nên tránh thay đổi trực tiếp object hoặc array.

* Thay vào đó, hãy **tạo bản sao mới** khi muốn cập nhật.
* Điều này giúp React dễ dàng phát hiện sự thay đổi và render lại chính xác.

Ví dụ với `useState`:

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    // Tạo state mới thay vì chỉnh sửa trực tiếp
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

---

### Khi nào React reset lại state?

1. **Thay đổi `key`**: Nếu `key` khác nhau, React coi như một component mới → reset state.
2. **Thay đổi kiểu component**: Ví dụ thay `<div>` thành `<span>` hoặc thay `ComponentA` thành `ComponentB`.
3. **Thay đổi props**: Props mới không reset state, nhưng bạn có thể chủ động đồng bộ state dựa trên props (dùng `componentDidUpdate` trong class component, hoặc `useEffect` trong function component).
4. **State cha thay đổi**: Khi state ở cha thay đổi → React sẽ render lại toàn bộ cây con, nhưng state nội bộ của các component con chỉ bị reset nếu **vị trí hoặc key thay đổi**.

Ví dụ với class component:

```jsx
class MyComponent extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.someValue !== prevProps.someValue) {
      // Đồng bộ state với props nếu cần
      this.setState({ syncedValue: this.props.someValue });
    }
  }

  render() {
    return <div>{this.props.someValue}</div>;
  }
}
```

---

👉 Tóm lại:

* **State gắn liền với vị trí của component trong UI Tree.**
* Giữ nguyên cấu trúc, dùng `key` hợp lý, và làm việc với dữ liệu bất biến giúp bạn kiểm soát state tốt hơn.

---
## 5.4 Reducer trong React



Trong React, **state** là khái niệm quan trọng để lưu trữ và quản lý dữ liệu trong component. State giúp giao diện thay đổi dựa trên thao tác người dùng hoặc dữ liệu từ server.

Tuy nhiên, khi ứng dụng ngày càng phức tạp với nhiều logic và tương tác, việc quản lý state bằng `useState` dễ trở nên **rối rắm và khó kiểm soát**. Khi đó, chúng ta có thể sử dụng **Reducer** để tối ưu.

---

### Reducer là gì?

Reducer là một **hàm thuần (pure function)** nhận vào 2 tham số:

* `state` (trạng thái hiện tại)
* `action` (một đối tượng mô tả điều gì đang xảy ra)

Reducer sẽ trả về một **state mới** dựa trên action:

```jsx
function reducer(state, action) {
  // Xử lý action và trả về state mới
  return newState;
}
```

---

### Từ useState → useReducer

#### 1. Trước đây (dùng useState)

```jsx
const [count, setCount] = useState(0);

function increment() {
  setCount(count + 1);
}
```

#### 2. Sau khi chuyển sang useReducer

```jsx
const initialState = 0;

function reducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    default:
      return state;
  }
}

const [count, dispatch] = useReducer(reducer, initialState);

function increment() {
  dispatch({ type: "INCREMENT" });
}
```

👉 Thay vì gọi `setCount`, bạn **gửi action** bằng `dispatch`. Reducer sẽ xử lý logic cập nhật.

---

### Các bước chuyển đổi

1. **Thay vì setState trực tiếp** → gửi action bằng `dispatch`.
2. **Viết reducer function** để xử lý action.
3. **Dùng useReducer trong component** để quản lý state tập trung.

---

### Tại sao nên dùng Reducer?

* **Quản lý dễ hơn**: Tất cả logic cập nhật state được gom về reducer → code gọn, rõ ràng.
* **Tập trung & nhất quán**: Giảm rủi ro sai sót khi nhiều state liên quan.
* **Dễ test**: Reducer là hàm thuần, có thể test độc lập với Jest hoặc các framework test khác.
* **Mở rộng**: Khi ứng dụng lớn, chỉ cần thêm case mới trong reducer thay vì rải rác logic ở nhiều nơi.

---

### Ví dụ hoàn chỉnh

```jsx
import { useReducer } from "react";

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    case "RESET":
      return { count: 0 };
    default:
      return state;
  }
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-</button>
      <button onClick={() => dispatch({ type: "RESET" })}>Reset</button>
    </div>
  );
}
```

➡️ Tất cả logic cập nhật state (`INCREMENT`, `DECREMENT`, `RESET`) được gom lại trong **reducer**. Component chỉ việc **dispatch action** khi cần.

---

✅ **Khi nào nên dùng `useReducer`?**

* Khi state phức tạp (nhiều field liên quan).
* Khi nhiều action có thể ảnh hưởng cùng một state.
* Khi bạn muốn dễ dàng mở rộng, tái sử dụng và test logic cập nhật state.

---
### 5.5 Context trong React

Trong React, thông thường bạn sẽ truyền dữ liệu từ **component cha** xuống **component con** thông qua **props**. Tuy nhiên, khi dữ liệu phải đi qua nhiều cấp component trung gian, hoặc khi nhiều component trong ứng dụng cần cùng một dữ liệu, thì props trở nên cồng kềnh. **Context** ra đời để giải quyết vấn đề này: nó cho phép component cha cung cấp dữ liệu trực tiếp cho bất kỳ component nào trong cây con của nó, mà không cần props truyền qua từng lớp.

---

#### Vấn đề với props

Props là cách chuẩn để truyền dữ liệu từ cha → con. Nhưng nếu bạn cần truyền dữ liệu xuống quá nhiều cấp (cha → con → cháu → chắt…), code sẽ trở nên rối rắm và khó bảo trì.

---

#### Context là gì?

**Context** là một cơ chế trong React cho phép một component cha cung cấp dữ liệu cho toàn bộ cây component bên dưới.

Ví dụ: Bạn có component **Heading** với prop `level` để xác định kích thước tiêu đề. Nếu mọi tiêu đề trong một section cần cùng `level`, việc truyền thủ công qua nhiều component là bất tiện. Lúc này, Context giúp đơn giản hóa.

---

#### Cách sử dụng Context

👉 Để sử dụng Context, bạn làm theo 3 bước:

**Bước 1: Tạo Context**

```jsx
import { createContext } from "react";

export const LevelContext = createContext(1);
```

**Bước 2: Sử dụng Context trong component con**
Dùng hook `useContext` để đọc giá trị Context:

```jsx
import { useContext } from "react";
import { LevelContext } from "./LevelContext.js";

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // dùng biến level ở đây
}
```

**Bước 3: Cung cấp Context từ component cha**
Dùng `<Provider>` để truyền giá trị xuống dưới:

```jsx
import { LevelContext } from "./LevelContext.js";

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

---

#### Trường hợp sử dụng Context

* **Theming (giao diện)**: Ví dụ bật tắt Dark mode.
* **Thông tin người dùng đăng nhập**: Tài khoản hiện tại.
* **Routing**: Quản lý đường dẫn hiện tại.
* **Quản lý state toàn cục**: Chia sẻ state giữa nhiều component.

Ngoài ra, Context thường kết hợp với state để quản lý dữ liệu ở quy mô ứng dụng.

---

#### Khi nào nên dùng Context?

* Trước tiên, hãy thử dùng **props** nếu dữ liệu chỉ truyền vài cấp. Props rõ ràng và dễ kiểm soát.
* Hãy cân nhắc **tách nhỏ component** thay vì truyền dữ liệu vòng vèo qua nhiều cấp trung gian.
* Chỉ khi cả hai cách trên không phù hợp (props lồng quá sâu, dữ liệu chia sẻ toàn cục) thì mới nên dùng **Context**.

---

👉 Tóm lại: **Context** là giải pháp mạnh mẽ để chia sẻ dữ liệu toàn cục trong cây component, nhưng chỉ nên dùng khi thực sự cần thiết để tránh làm mờ luồng dữ liệu.

---
### 5.6 Kết hợp Reducer và Context trong React

Trong React, **Reducer** là công cụ mạnh để quản lý state phức tạp, còn **Context** giúp truyền dữ liệu qua nhiều cấp component mà không cần props. Khi kết hợp chúng, ta có thể xây dựng hệ thống quản lý state gọn gàng, dễ mở rộng và bảo trì.

---

#### Các bước kết hợp Reducer và Context

**Bước 1: Tạo Context**

```jsx
import { createContext } from "react";

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

Ở đây ta tạo **hai Context**:

* `TasksContext`: cung cấp danh sách công việc.
* `TasksDispatchContext`: cung cấp hàm `dispatch` để thay đổi danh sách.

---

**Bước 2: Đặt state và dispatch vào Context**

```jsx
import { TasksContext, TasksDispatchContext } from "./TasksContext.js";

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {/* Các component con */}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}
```

`TaskApp` bọc toàn bộ cây component bằng hai Provider để chia sẻ state (`tasks`) và `dispatch`.

---

**Bước 3: Sử dụng Context trong component con**

```jsx
export default function TaskList() {
  const tasks = useContext(TasksContext);
  // dùng tasks ở đây
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useContext(TasksDispatchContext);
  // dùng dispatch ở đây
}
```

→ Như vậy, component con có thể **trực tiếp truy cập state và dispatch** mà không cần truyền props lòng vòng.

---

#### Lưu ý tổ chức code

* Thường ta tách Reducer + Context + Provider vào **một file riêng** (ví dụ `TasksContext.js`).
* Code trở nên gọn gàng, dễ quản lý và dễ mở rộng.

---

### ✅ Bài tập

**Bài tập 1: To-Do List với useReducer + useContext**

* Tạo `TodoContext` bằng `createContext`.
* Viết `todoReducer` để xử lý các action: `ADD_TODO`, `TOGGLE_TODO`, `DELETE_TODO`.
* Tạo `TodoProvider` sử dụng `useReducer` và cung cấp state + dispatch.
* Viết các component:

  * `TodoList`: hiển thị danh sách.
  * `TodoItem`: hiển thị từng công việc, có nút hoàn thành/xóa.
  * `AddTodo`: form thêm công việc.
* Dùng `dispatch` trong các component để thay đổi state.

---

**Bài tập 2: Ứng dụng quản lý trạng thái đăng nhập**

* Tạo `AuthContext` và `authReducer` để quản lý: `isAuthenticated`, `user`, `token`.
* Action: `LOGIN`, `LOGOUT`.
* Tạo `AuthProvider` bao bọc toàn app, cung cấp state + dispatch.
* Viết form đăng nhập: khi submit → dispatch `LOGIN`, lưu `user` + `token`.
* Tạo nút đăng xuất: dispatch `LOGOUT` để xóa thông tin.

---

👉 Kết hợp **Reducer + Context** = vừa quản lý state phức tạp, vừa chia sẻ dễ dàng cho nhiều component → code gọn, rõ ràng, dễ bảo trì.

---

### Solution bài tập

---
**1. Solution mẫu đầy đủ code cho Bài tập 1: To-Do List** bằng cách kết hợp `useReducer` + `useContext`. Code được chia file rõ ràng để dễ tái sử dụng và maintain.

---

## 📂 Cấu trúc thư mục

```
src/
 ├─ context/
 │   └─ TodoContext.js
 ├─ components/
 │   ├─ AddTodo.js
 │   ├─ TodoItem.js
 │   └─ TodoList.js
 ├─ App.js
 └─ index.js
```

---

## 📌 1. Tạo Context và Reducer

**`context/TodoContext.js`**

```jsx
import { createContext, useReducer } from "react";

// Tạo Context
export const TodoContext = createContext(null);
export const TodoDispatchContext = createContext(null);

// State ban đầu
const initialTodos = [
  { id: 1, text: "Học React", completed: false },
  { id: 2, text: "Đọc tài liệu về Reducer", completed: true }
];

// Reducer
function todoReducer(todos, action) {
  switch (action.type) {
    case "ADD_TODO":
      return [
        ...todos,
        { id: Date.now(), text: action.text, completed: false }
      ];
    case "TOGGLE_TODO":
      return todos.map((todo) =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
      );
    case "DELETE_TODO":
      return todos.filter((todo) => todo.id !== action.id);
    default:
      return todos;
  }
}

// Provider
export function TodoProvider({ children }) {
  const [todos, dispatch] = useReducer(todoReducer, initialTodos);

  return (
    <TodoContext.Provider value={todos}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoContext.Provider>
  );
}
```

---

## 📌 2. Component AddTodo

**`components/AddTodo.js`**

```jsx
import { useState, useContext } from "react";
import { TodoDispatchContext } from "../context/TodoContext";

export default function AddTodo() {
  const [text, setText] = useState("");
  const dispatch = useContext(TodoDispatchContext);

  function handleSubmit(e) {
    e.preventDefault();
    if (text.trim() === "") return;
    dispatch({ type: "ADD_TODO", text });
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="add-todo">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nhập công việc mới..."
      />
      <button type="submit">Thêm</button>
    </form>
  );
}
```

---

## 📌 3. Component TodoItem

**`components/TodoItem.js`**

```jsx
import { useContext } from "react";
import { TodoDispatchContext } from "../context/TodoContext";

export default function TodoItem({ todo }) {
  const dispatch = useContext(TodoDispatchContext);

  return (
    <li className="todo-item">
      <span
        style={{
          textDecoration: todo.completed ? "line-through" : "none",
          cursor: "pointer"
        }}
        onClick={() => dispatch({ type: "TOGGLE_TODO", id: todo.id })}
      >
        {todo.text}
      </span>
      <button onClick={() => dispatch({ type: "DELETE_TODO", id: todo.id })}>
        ❌
      </button>
    </li>
  );
}
```

---

## 📌 4. Component TodoList

**`components/TodoList.js`**

```jsx
import { useContext } from "react";
import { TodoContext } from "../context/TodoContext";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const todos = useContext(TodoContext);

  if (todos.length === 0) return <p>Không có công việc nào</p>;

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
```

---

## 📌 5. App.js

**`App.js`**

```jsx
import { TodoProvider } from "./context/TodoContext";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";

export default function App() {
  return (
    <TodoProvider>
      <h1>📝 To-Do List</h1>
      <AddTodo />
      <TodoList />
    </TodoProvider>
  );
}
```

---

## 📌 6. index.js

**`index.js`**

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css"; // optional

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
```

---

## 🎯 Kết quả:

* Có thể **thêm công việc mới**.
* **Click vào text** để toggle hoàn thành.
* **Bấm ❌** để xóa công việc.
* Toàn bộ state được quản lý **qua Reducer** và chia sẻ bằng **Context**.

---

**Bài tập 2: Ứng dụng quản lý trạng thái đăng nhập** bằng cách kết hợp **`useReducer` + `useContext`**.
Ứng dụng này sẽ có: **LoginForm, UserProfile, LogoutButton** và quản lý state đăng nhập trong `AuthContext`.

---

## 📂 Cấu trúc thư mục

```
src/
 ├─ context/
 │   └─ AuthContext.js
 ├─ components/
 │   ├─ LoginForm.js
 │   ├─ UserProfile.js
 │   └─ LogoutButton.js
 ├─ App.js
 └─ index.js
```

---

## 📌 1. AuthContext và Reducer

**`context/AuthContext.js`**

```jsx
import { createContext, useReducer } from "react";

// Tạo Context
export const AuthContext = createContext(null);
export const AuthDispatchContext = createContext(null);

// State ban đầu
const initialAuth = {
  isAuthenticated: false,
  user: null,
  token: null
};

// Reducer
function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token
      };
    case "LOGOUT":
      return { ...initialAuth };
    default:
      return state;
  }
}

// Provider
export function AuthProvider({ children }) {
  const [auth, dispatch] = useReducer(authReducer, initialAuth);

  return (
    <AuthContext.Provider value={auth}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
}
```

---

## 📌 2. Form đăng nhập

**`components/LoginForm.js`**

```jsx
import { useState, useContext } from "react";
import { AuthDispatchContext } from "../context/AuthContext";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useContext(AuthDispatchContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    // ⚡ Demo giả lập login
    if (username && password) {
      dispatch({
        type: "LOGIN",
        payload: {
          user: { name: username },
          token: "fake-jwt-token-" + Date.now()
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>🔐 Đăng nhập</h2>
      <input
        type="text"
        placeholder="Tên đăng nhập"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Đăng nhập</button>
    </form>
  );
}
```

---

## 📌 3. Hiển thị thông tin người dùng

**`components/UserProfile.js`**

```jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function UserProfile() {
  const auth = useContext(AuthContext);

  if (!auth.isAuthenticated) return null;

  return (
    <div className="user-profile">
      <h2>👤 Xin chào, {auth.user.name}</h2>
      <p>Token: {auth.token}</p>
    </div>
  );
}
```

---

## 📌 4. Nút đăng xuất

**`components/LogoutButton.js`**

```jsx
import { useContext } from "react";
import { AuthDispatchContext, AuthContext } from "../context/AuthContext";

export default function LogoutButton() {
  const dispatch = useContext(AuthDispatchContext);
  const auth = useContext(AuthContext);

  if (!auth.isAuthenticated) return null;

  return (
    <button
      onClick={() => dispatch({ type: "LOGOUT" })}
      className="logout-btn"
    >
      🚪 Đăng xuất
    </button>
  );
}
```

---

## 📌 5. App.js

**`App.js`**

```jsx
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import LoginForm from "./components/LoginForm";
import UserProfile from "./components/UserProfile";
import LogoutButton from "./components/LogoutButton";

function AppContent() {
  const auth = useContext(AuthContext);

  return (
    <div className="app">
      <h1>⚡ Ứng dụng Quản lý Đăng nhập</h1>
      {auth.isAuthenticated ? (
        <>
          <UserProfile />
          <LogoutButton />
        </>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
```

---

## 📌 6. index.js

**`index.js`**

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css"; // optional

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
```

---

## 🎯 Kết quả

* Khi **chưa đăng nhập** → hiển thị `LoginForm`.
* Nhập username/password → `dispatch LOGIN` → cập nhật `AuthContext`.
* Khi **đăng nhập thành công** → hiển thị `UserProfile` + nút `Đăng xuất`.
* Bấm nút `Đăng xuất` → gọi `dispatch LOGOUT` → trở lại `LoginForm`.

---

