# Ngày 3: Giao diện trong ReactJS

## 3.1 Ứng dụng đầu tiên với ReactJS

ReactJS là một thư viện JavaScript phổ biến được sử dụng để xây dựng giao diện người dùng (UI) tương tác. Trong phần này, chúng ta sẽ bắt tay vào việc tạo ứng dụng React đầu tiên: **một danh sách công việc (To-Do List)** đơn giản.

---

### **Bước 1: Chuẩn bị môi trường**

Trước hết, hãy chắc chắn rằng bạn đã cài đặt **Node.js**. Sau đó, dùng công cụ **Create React App** để khởi tạo một dự án React mới:

```bash
npx create-react-app my-first-react-app
cd my-first-react-app
npm start
```

Câu lệnh trên sẽ tạo một thư mục dự án mẫu với toàn bộ cấu trúc cần thiết cho một ứng dụng React.

---

### **Bước 2: Hiển thị danh sách công việc**

Mở file `src/App.js` và thay thế nội dung bằng đoạn code sau:

```jsx
import React from 'react';

function App() {
  const tasks = ['Learn React', 'Build an App', 'Enjoy Coding'];

  return (
    <div>
      <h1>My To-Do List</h1>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

👉 Ở đây:

* Chúng ta tạo một mảng `tasks` chứa danh sách công việc.
* Sử dụng phương thức **`.map()`** để lặp qua mảng và render từng phần tử ra một thẻ `<li>`.
* Thuộc tính `key` được thêm vào mỗi `<li>` để React có thể quản lý danh sách hiệu quả hơn.

---

### **Bước 3: Chạy ứng dụng**

Trở lại terminal, chạy lệnh:

```bash
npm start
```

Mở trình duyệt tại **[http://localhost:3000](http://localhost:3000)**, bạn sẽ thấy ứng dụng React hiển thị danh sách công việc.

---

🎉 **Chúc mừng!**
Bạn vừa tạo thành công ứng dụng ReactJS đầu tiên của mình. Đây là bước khởi đầu quan trọng để làm quen với:

* Cấu trúc dự án React.
* Cách render dữ liệu động ra giao diện.
* Nguyên tắc sử dụng `map` và `key` trong React.

---



## 3.1 JSX là gì?

Khi bạn viết code trong React, những đoạn trông giống **HTML** mà bạn thấy thực ra **không phải HTML thuần**. Đó là **JSX (JavaScript XML)** – một cú pháp đặc biệt do đội ngũ React phát triển, giúp mô tả giao diện một cách trực quan và dễ dàng hơn. JSX cũng có thể được áp dụng trong một vài công cụ khác như VueJS, nhưng phổ biến nhất vẫn là trong React.

### Mục đích của JSX

* Tạo **element** một cách rõ ràng, dễ hiểu.
* Giúp lập trình viên viết **HTML-like code** kèm JavaScript động.
* Cho phép chèn trực tiếp biến/giá trị JS vào trong giao diện, giúp ứng dụng trở nên **tương tác**.

---

### React có thể chạy mà không cần JSX

Bạn có thể viết React component mà **không sử dụng JSX**, vì về bản chất JSX sẽ được biên dịch thành `React.createElement()`.

Ví dụ:

```jsx
function App() {
  return (
    <div className="app">
      <h1>Hello, World!</h1>
    </div>
  );
}
```

hoàn toàn tương đương với:

```jsx
import React from "react";

function App() {
  return React.createElement(
    "div",
    { className: "app" },
    React.createElement("h1", {}, "Hello, World!")
  );
}
```

👉 Cả hai đều cho ra kết quả giống nhau. Tuy nhiên, rõ ràng cách viết JSX dễ đọc, dễ bảo trì hơn rất nhiều. Vì vậy, gần như tất cả dự án React hiện nay đều sử dụng JSX.

> Thực tế: JSX được biên dịch sang `React.createElement` nhờ Babel. Đó là lý do khi viết code React trên **CodePen**, bạn phải chọn Babel làm pre-processor.

---

### JSX không phải là HTML

Mặc dù trông giống HTML, nhưng JSX có một số khác biệt quan trọng:

* **Phải có 1 thẻ cha bao ngoài** (hoặc sử dụng Fragment `<> </>`).
* **Dùng `className` thay vì `class`**.
* **Thuộc tính `style` là object** chứ không phải string CSS.
* **Tên thuộc tính dùng camelCase**, ví dụ: `onClick`, `tabIndex`.
* **JSX nhiều dòng cần bọc trong ngoặc tròn `( )`**.
* **Component do bạn viết phải đặt tên viết hoa** (`<MyComponent />` thay vì `<myComponent />`).

---

### Render giá trị JS trong JSX

Bạn có thể chèn **biến hoặc biểu thức JS** trực tiếp vào JSX bằng dấu `{}`.

Ví dụ:

```jsx
const App = () => {
  const randomAge = Math.floor(Math.random() * 10);
  const imgSrc =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png";

  return (
    <div>
      Hello, my name is MindX. I'm {randomAge} years old.
      <img src={imgSrc} />
    </div>
  );
};
```

* `{randomAge}` sẽ render ra một số ngẫu nhiên.
* `imgSrc` được dùng làm giá trị cho thuộc tính `src` của thẻ `<img>`.

👉 Không phải mọi kiểu dữ liệu đều render được. Ví dụ: **object** không thể render trực tiếp vì không phải là một "React child".

---

### Ví dụ khác – render array:

```jsx
const weekday = [
  "Sunday", "Monday", "Tuesday",
  "Wednesday", "Thursday", "Friday", "Saturday",
];

const App = () => {
  return <div>Today is {weekday[new Date().getDay()]}</div>;
};
```

Ở đây, `weekday[new Date().getDay()]` trả về một string → React có thể render bình thường.

---

### Styling trong JSX

Có 2 cách phổ biến:

1. **Dùng CSS file ngoài** (className, id)

   ```css
   .App {
     text-align: center;
     font-weight: bold;
   }
   ```

   ```jsx
   import "./App.css";

   const App = () => {
     return <div className="App">Hello, world!</div>;
   };
   ```

2. **Dùng inline-style (object)**

   ```jsx
   const App = () => {
     return (
       <div style={{ backgroundColor: "yellow", fontSize: 18 }}>
         Hello, World!
       </div>
     );
   };
   ```

   * `backgroundColor` dùng camelCase.
   * `fontSize: 18` → hiểu là `18px`. Nếu muốn đơn vị khác (`em`, `%`…), phải viết dạng string: `"2em"`.

---

### Quy tắc quan trọng trong JSX

1. **Trả về 1 root element duy nhất** (hoặc dùng Fragment `<> </>`).
2. **Đóng tất cả thẻ**: `<img />`, `<li></li>`.

Ví dụ với Fragment:

```jsx
<>
  <h1>Todos của Hedy Lamarr</h1>
  <img
    src="https://i.imgur.com/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    className="photo"
  />
  <ul>
    <li>Phát minh đèn giao thông mới</li>
    <li>Luyện tập một cảnh phim</li>
    <li>Cải thiện công nghệ phổ</li>
  </ul>
</>
```

---

✅ Với JSX, bạn có thể viết code vừa giống HTML, vừa tận dụng được toàn bộ sức mạnh của JavaScript. Đây là một trong những lý do khiến React trở nên **dễ học, dễ dùng và mạnh mẽ**.

---

## 3.3 Render các element trong React

Khi làm việc với React, **JSX** cho phép bạn viết markup giống như HTML ngay trong file JavaScript. Điều này giúp bạn giữ **logic hiển thị (UI logic)** và **nội dung** trong cùng một nơi, thay vì phải tách biệt.

Điểm đặc biệt của JSX là: bạn có thể chèn **biến, hàm hoặc đối tượng JavaScript** trực tiếp vào markup bằng cách sử dụng **cặp dấu ngoặc nhọn `{}`**. Đây chính là “cửa sổ” để đưa logic JavaScript vào giao diện.

---

### 1. Truyền biến vào JSX

Nếu bạn truyền một **chuỗi tĩnh**, bạn chỉ cần để trong dấu nháy kép `" "` hoặc nháy đơn `' '`:

```jsx
import React from "react";

export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/7vQD0fPs.jpg"
      alt="Gregorio Y. Zara"
    />
  );
}
```

Trong ví dụ trên:

* `src` nhận một chuỗi URL.
* `alt` nhận một chuỗi mô tả ảnh.

👉 Nhưng khi muốn **truyền giá trị động**, bạn dùng `{}` để lấy từ biến:

```jsx
import React from "react";

export default function Avatar() {
  const avatar = "https://i.imgur.com/7vQD0fPs.jpg";
  const description = "Gregorio Y. Zara";

  return <img className="avatar" src={avatar} alt={description} />;
}
```

Ở đây, `src={avatar}` và `alt={description}` giúp hiển thị giá trị từ biến JavaScript.

---

### 2. Truyền hàm vào JSX

Không chỉ biến, bạn còn có thể chèn **biểu thức hoặc lời gọi hàm** trong `{}`.

Ví dụ:

```jsx
import React from "react";

const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
}

export default function TodoList() {
  return <h1>Danh Sách Công Việc Cho Ngày {formatDate(today)}</h1>;
}
```

* Hàm `formatDate(today)` được gọi trực tiếp trong JSX.
* Kết quả trả về sẽ render ra màn hình.

---

### 3. Truyền đối tượng vào JSX

Đôi khi bạn muốn truyền **object JavaScript** vào JSX. Trong trường hợp này, bạn phải dùng **2 lớp dấu ngoặc nhọn**:

* Lớp ngoài `{ }` → báo hiệu chèn JS vào JSX.
* Lớp trong `{ key: value }` → chính là object JavaScript.

Ví dụ phổ biến nhất là **inline-style**:

```jsx
import React from "react";

export default function TodoList() {
  return (
    <ul
      style={{
        backgroundColor: "black",
        color: "pink",
      }}
    >
      <li>Cải thiện videophone</li>
      <li>Chuẩn bị bài giảng về aeronautics</li>
      <li>Làm việc trên động cơ chạy bằng cồn</li>
    </ul>
  );
}
```

👉 Ở đây, thuộc tính `style` nhận vào một **object CSS**, trong đó key viết theo camelCase (`backgroundColor`, `fontSize`…), value thường là string hoặc number.

Nếu viết rõ ràng hơn, bạn sẽ thấy cú pháp `{{ }}` thực chất chỉ là một object nằm trong `{}`:

```jsx
<ul style={
  {
    backgroundColor: "black",
    color: "pink"
  }
}>
```

---

### 4. Tổng kết

Qua phần này, bạn đã nắm được cách render dữ liệu với JSX:

1. **Chuỗi tĩnh** → `" "` hoặc `' '`.
2. **Biểu thức JS / biến / hàm** → `{ }`.
3. **Object (ví dụ inline-style)** → `{{ }}` (object JS bên trong JSX).

⚡ Như vậy, JSX mang đến sức mạnh kết hợp giữa **markup** và **JavaScript logic**, giúp bạn dễ dàng xây dựng UI động và có tính tương tác cao.

---
# 3.4 Component trong React là gì?

**Component** (thành phần) là một trong những khái niệm cốt lõi của React — chúng là nền tảng để xây dựng giao diện người dùng (UI). Về bản chất, component là những **hàm JavaScript** độc lập, có thể tái sử dụng, nhận đầu vào (props) và trả về các React element mô tả phần UI cần hiển thị.

---

## Ví dụ và ý tưởng chính

Giao diện của một trang thường được chia nhỏ thành nhiều component: thanh điều hướng, thanh bên, danh sách bài viết, ô tìm kiếm, v.v. Mỗi phần có thể là một component riêng, và bằng cách kết hợp các component này ta tạo thành giao diện hoàn chỉnh của trang chủ.

Khi dự án phát triển, nhiều phần thiết kế có thể tái sử dụng component bạn đã viết — điều này giúp tăng tốc phát triển và dễ bảo trì.

---

## Component là gì (định nghĩa ngắn)

Component là hàm JavaScript nhận **props** (đầu vào) và trả về **React elements** (JSX) mô tả UI. Việc chia nhỏ ứng dụng thành component giúp mã rõ ràng, dễ test, dễ tái sử dụng và dễ bảo trì.

---

## Các bước tạo một component (ví dụ `Profile`)

```javascript
export default function Profile() {
  return <img src="https://i.imgur.com/MK3eW3Am.jpg" alt="Katherine Johnson" />;
}
```

1. **Xuất component**: `export default` là cú pháp JS tiêu chuẩn để xuất hàm/giá trị từ file, cho phép import ở file khác.
2. **Định nghĩa hàm**: `function Profile() { }` — đây đơn giản là một hàm JS.

   * **Lưu ý**: Tên component **phải** bắt đầu bằng chữ cái viết hoa; nếu không React sẽ hiểu đó là thẻ HTML thông thường và component sẽ không hoạt động.
3. **Trả về markup (JSX)**: component trả về JSX (ở đây là `<img />`). Nếu JSX không nằm trên cùng dòng với `return`, phải bọc trong ngoặc đơn `()` để tránh bị JavaScript bỏ qua phần sau `return`.

Ví dụ với nhiều dòng JSX:

```javascript
return (
  <div>
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

---

## Sử dụng component trong component khác

Sau khi định nghĩa `Profile`, ta có thể tái sử dụng nó nhiều lần trong một component cha, ví dụ `Gallery`:

```javascript
function Profile() {
  return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
}

export default function Gallery() {
  return (
    <section>
      <h1>Các nhà khoa học tuyệt vời</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

* Thẻ HTML (ví dụ `<section>`) viết thường → React hiểu đó là phần tử HTML.
* Thẻ custom (`<Profile />`) viết hoa → React hiểu đó là component do bạn định nghĩa.
* Khi render, mỗi `<Profile />` sẽ được thay bằng nội dung JSX bên trong `Profile`.

Kết quả trong DOM:

```html
<section>
  <h1>Các nhà khoa học tuyệt vời</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

---

## Lồng và tổ chức component

* Bạn có thể đặt nhiều component trong cùng một file — tiện khi các component nhỏ, liên quan chặt chẽ.
* Component cha có thể render nhiều component con.
* **Không** nên định nghĩa một component **bên trong** component khác (không khai báo component con *trong thân* component cha). Ví dụ **không nên** làm:

```javascript
export default function Gallery() {
  // 🔴 Không nên định nghĩa component ở đây
  function Profile() {
    // ...
  }
  // ...
}
```

* Việc định nghĩa component bên trong hàm component khác sẽ gây **tổn hao hiệu năng** (component được tái tạo mỗi lần render) và có thể dẫn tới lỗi. Thay vào đó, luôn **khai báo mọi component ở cấp độ cao nhất**:

```javascript
export default function Gallery() {
  // ...
}

function Profile() {
  // ...
}
```

---

## Kết luận ngắn gọn

* Component = hàm JS trả về JSX; tên phải viết hoa.
* Component giúp chia nhỏ UI, tái sử dụng và dễ bảo trì.
* Định nghĩa component ở cấp file (không lồng định nghĩa), và sử dụng props để truyền dữ liệu giữa các component.

---
# 3.5 Props và cách truyền props vào component trong React

Trong React, **props** (viết tắt của *properties*) là **tham số đầu vào** của component, cho phép truyền dữ liệu từ component cha xuống component con. Đây là cơ chế chính giúp các component có thể **tái sử dụng, cấu hình khác nhau** mà không cần viết lại logic.

---

## 🔹 Props là gì?

* Props tương tự như **thuộc tính HTML**, nhưng bạn có thể **tự định nghĩa**.
* Props có thể nhận **mọi giá trị JavaScript**: chuỗi, số, boolean, object, array, function, JSX...
* Props trong React là **read-only**: bạn không thể thay đổi giá trị của chúng bên trong component con.

👉 Nói cách khác: props là “cầu nối” truyền dữ liệu giữa các component.

Ví dụ:

```jsx
const App = () => {
  const x = 1;
  const y = 2;
  return (
    <div>
      <Sum a={x} b={y} />
    </div>
  )
}

const Sum = (props) => {
  console.log(props); // {a: 1, b: 2}
  return <div>The value is: {props.a + props.b}</div>;
}
```

---

## 🔹 Cách truyền props

### Bước 1: Truyền props từ component cha

```jsx
export default function Profile() {
  return (
    <Avatar person={{ name: "Lin Lanying", imageId: "1bX5QH6" }} size={100} />
  );
}
```

### Bước 2: Nhận props trong component con

```jsx
function Avatar({ person, size }) {
  return (
    <img
      src={`https://i.imgur.com/${person.imageId}.jpg`}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}
```

📌 Ở đây:

* `person` và `size` được lấy trực tiếp từ object props nhờ cú pháp destructuring.
* `size` cho phép Avatar hiển thị với kích thước khác nhau tùy mỗi lần gọi.

---

## 🔹 Giá trị mặc định cho props

Đặt mặc định ngay trong destructuring:

```jsx
function Avatar({ person, size = 100 }) {
  return <img src={`https://i.imgur.com/${person.imageId}.jpg`} width={size} />;
}
```

* `size` mặc định là `100` nếu không truyền vào hoặc nếu truyền `undefined`.
* Nhưng nếu truyền `size={0}` hoặc `size={null}`, React sẽ dùng giá trị đó, **không dùng mặc định**.

---

## 🔹 Chuyển tiếp toàn bộ props

Để tránh lặp lại khi truyền nhiều props:

```jsx
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

`{...props}` sẽ trải toàn bộ object `props` sang Avatar.

---

## 🔹 Children props

Ngoài props bình thường, React còn có **children** – props đặc biệt để “lồng nội dung” giữa thẻ mở và thẻ đóng.

Ví dụ:

```jsx
// Card.js
const Card = (props) => {
  return <div className="card">{props.children}</div>
}
```

```jsx
// App.js
<Card>
  <div>Inside a card</div>
</Card>
```

👉 `children` lúc này chính là `<div>Inside a card</div>`.
Điều này giúp ta dễ dàng **compose component** và tái sử dụng layout.

---

## 🔹 Smart vs Dump Components

### Smart Component (có logic bên trong)

```jsx
const Sum = () => {
  const x = 1;
  const y = 2;
  return <div>{x + y}</div>;
}
```

* Không thể tái sử dụng, vì luôn trả về `3`.

### Dump Component (nhận dữ liệu qua props)

```jsx
const Sum = ({ x, y }) => {
  return <div>{x + y}</div>;
}

// Có thể tái sử dụng với dữ liệu khác nhau
<Sum x={1} y={2} />
<Sum x={2} y={3} />
<Sum x={7} y={5} />
```

📌 Trong thực tế:

* Viết **nhiều dump component** → code dễ tái sử dụng, dễ test.
* Viết smart component khi cần chứa logic đặc thù.
* Tránh truyền quá nhiều props vào một component → gây khó đọc và khó maintain.

---

✅ **Tóm lại**:

* Props là cách để truyền dữ liệu từ cha → con.
* Dùng destructuring để code gọn gàng.
* Có thể đặt giá trị mặc định, chuyển tiếp toàn bộ props, hoặc dùng children để “compose” UI.
* Dump component + props giúp component **tái sử dụng tối đa**.

---

## 3.6 Rendering có điều kiện trong React

Trong khi phát triển ứng dụng React, bạn sẽ thường xuyên gặp trường hợp cần hiển thị giao diện khác nhau tùy theo điều kiện. React cho phép bạn viết **logic điều kiện ngay trong JSX** bằng cách sử dụng:

* Câu lệnh `if`
* Toán tử ba ngôi `? :`
* Toán tử logic `&&`

### 1. Trả về JSX dựa trên điều kiện

Ví dụ: một component `Item` hiển thị tên hàng hóa và dấu check nếu đã được đóng gói:

```jsx
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✔</li>;
  }
  return <li className="item">{name}</li>;
}
```

👉 Nếu `isPacked = true` → thêm dấu check ✔.
👉 Nếu `false` → chỉ hiện tên.

---

### 2. Dùng `null` để không hiển thị gì

Bạn có thể trả về `null` khi không muốn render gì cả:

```jsx
function Item({ name, isPacked }) {
  if (isPacked) {
    return null; // không hiển thị item đã đóng gói
  }
  return <li className="item">{name}</li>;
}
```

Trong React, `null` nghĩa là "không render gì". Tuy nhiên, cách này nên dùng cẩn thận vì có thể gây khó hiểu cho người đọc code.

---

### 3. Toán tử điều kiện (Ternary Operator)

Viết ngắn gọn hơn bằng cú pháp `? :` của JavaScript:

```jsx
<li className="item">{isPacked ? name + " ✔" : name}</li>
```

👉 Nếu `isPacked = true` → `name ✔`
👉 Nếu `false` → chỉ hiện `name`

---

### 4. Toán tử logic AND (`&&`)

Thường dùng khi muốn hiển thị gì đó **chỉ khi điều kiện đúng**:

```jsx
<li className="item">
  {name} {isPacked && "✔"}
</li>
```

👉 Nếu `isPacked = true` → render thêm dấu ✔
👉 Nếu `false` → không hiển thị gì thêm

⚠️ Lưu ý: tránh viết `messageCount && "Tin nhắn mới"`. Nếu `messageCount = 0` → sẽ render số `0`, gây khó hiểu.

---

### 5. Sử dụng biến trung gian với `if - else`

Cách viết dài hơn nhưng dễ đọc, linh hoạt:

```jsx
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✔";
  }

  return <li className="item">{itemContent}</li>;
}
```

---

### ✅ Tóm tắt

* Dùng `if` để gán JSX vào biến → linh hoạt, dễ đọc.
* Dùng `? :` để viết ngắn gọn trong JSX.
* Dùng `&&` để hiển thị JSX khi điều kiện đúng.
* `null` có thể dùng để ẩn component.

---
## 3.7: Rendering list trong React

Trong React, khi bạn muốn hiển thị **nhiều component giống nhau nhưng dữ liệu khác nhau**, bạn sẽ cần thao tác trên **mảng dữ liệu** bằng các phương thức JavaScript như `map()` và `filter()`.

Ví dụ: danh sách người nổi tiếng trong nhiều lĩnh vực.

---

## 1. Hiển thị dữ liệu từ mảng cơ bản

HTML tĩnh:

```html
<ul>
  <li>Creola Katherine Johnson: nhà toán học</li>
  <li>Mario José Molina-Pasquel Henríquez: nhà hóa học</li>
  <li>Mohammad Abdus Salam: nhà vật lý</li>
  <li>Percy Lavon Julian: nhà hóa học</li>
  <li>Subrahmanyan Chandrasekhar: nhà thiên văn học</li>
</ul>
```

Trong React, ta không viết thủ công từng `<li>`. Thay vào đó:

### Bước 1: Đưa dữ liệu vào mảng

```javascript
const people = [
  "Creola Katherine Johnson: nhà toán học",
  "Mario José Molina-Pasquel Henríquez: nhà hóa học",
  "Mohammad Abdus Salam: nhà vật lý",
  "Percy Lavon Julian: nhà hóa học",
  "Subrahmanyan Chandrasekhar: nhà thiên văn học",
];
```

### Bước 2: Dùng `map()` để tạo JSX

```javascript
const listItems = people.map((person) => <li>{person}</li>);
```

### Bước 3: Render ra giao diện

```jsx
return <ul>{listItems}</ul>;
```

👉 Kết quả là danh sách giống HTML tĩnh, nhưng code gọn gàng, có thể dễ dàng thay đổi dữ liệu.

---

## 2. Lọc dữ liệu với `filter()`

Dữ liệu thường nên tổ chức **dưới dạng object**:

```javascript
const people = [
  { id: 0, name: "Creola Katherine Johnson", profession: "nhà toán học" },
  { id: 1, name: "Mario José Molina-Pasquel Henríquez", profession: "nhà hóa học" },
  { id: 2, name: "Mohammad Abdus Salam", profession: "nhà vật lý" },
  { id: 3, name: "Percy Lavon Julian", profession: "nhà hóa học" },
  { id: 4, name: "Subrahmanyan Chandrasekhar", profession: "nhà thiên văn học" },
];
```

Ví dụ: chỉ hiển thị những người **nhà hóa học**.

### Bước 1: Lọc mảng bằng `filter()`

```javascript
const chemists = people.filter((person) => person.profession === "nhà hóa học");
```

### Bước 2: Map dữ liệu ra JSX

```javascript
const listItems = chemists.map((person) => (
  <li key={person.id}>
    <p>
      <b>{person.name}:</b> {person.profession}
    </p>
  </li>
));
```

### Bước 3: Render danh sách

```jsx
return <ul>{listItems}</ul>;
```

👉 Kết quả: chỉ hiển thị 2 nhà hóa học.

---

## 3. Key trong React là gì?

Khi render list, React cần một **key** duy nhất cho từng phần tử.

Ví dụ cảnh báo thường gặp:

```
Warning: Each child in a list should have a unique "key" prop.
```

Key giúp React:

* Biết được phần tử nào thêm, xóa, hay thay đổi.
* Cập nhật DOM hiệu quả hơn.

✅ Cách đúng: dùng `id` có sẵn trong dữ liệu.

```jsx
<li key={person.id}>{person.name}</li>
```

❌ Sai lầm phổ biến: dùng index của mảng (`key={index}`), vì khi sắp xếp lại list, React có thể render sai.

---

## ✅ Tóm tắt

* Sử dụng `map()` để biến mảng dữ liệu → danh sách JSX.
* Sử dụng `filter()` để chọn dữ liệu theo điều kiện.
* Luôn dùng **key duy nhất** khi render list.

👉 Đây là cách chuẩn để hiển thị danh sách trong React, cực kỳ quan trọng trong các ứng dụng thực tế (danh sách sản phẩm, bình luận, tin nhắn, người dùng…).

---
## 3.8 Giới thiệu Pure Component trong Reactjs
React.js là một thư viện JavaScript mạnh mẽ được sử dụng rộng rãi để phát triển ứng dụng web hiệu suất cao và dễ bảo trì. Trong React, sự hiểu biết về Pure Component là một phần quan trọng để tạo ra mã nguồn sạch sẽ và tránh được nhiều lỗi khó hiểu. Trong bài viết này, chúng ta sẽ tìm hiểu về Pure Component, tại sao chúng quan trọng, và cách sử dụng chúng trong ứng dụng React.

### Tính "Pure" là gì?

Trong khoa học máy tính và đặc biệt là trong thế giới của lập trình hàm, một hàm "pure" là một hàm có các đặc điểm sau:

* **Tự lực tự cường**: nó không thay đổi bất kỳ đối tượng hoặc biến nào tồn tại trước khi nó được gọi.
* **Cùng đầu vào, cùng đầu ra**: với cùng một đầu vào, một hàm "pure" luôn trả về cùng một kết quả.

Ví dụ: hàm toán học y = 2x.

* Nếu x = 2 → y luôn luôn = 4.
* Nếu x = 3 → y luôn luôn = 6.

Hàm JavaScript tương ứng:

```javascript
function double(number) {
  return 2 * number;
}
```

Hàm `double` là "pure": với cùng một input, output luôn giống nhau.

React được thiết kế xoay quanh khái niệm này: mọi component bạn viết phải được coi là "pure", nghĩa là với cùng props đầu vào, chúng luôn trả về cùng một JSX.

---

### Sử dụng Pure Component trong React

Ví dụ component `Recipe`:

```javascript
function Recipe({ drinkers }) {
  return (
    <ol>
      <li>Boil {drinkers} cups of water.</li>
      <li>
        Add {drinkers} spoons of tea and {0.5 * drinkers} spoons of spice.
      </li>
      <li>Add {0.5 * drinkers} cups of milk to boil and sugar to taste.</li>
    </ol>
  );
}
```

* Truyền `drinkers={2}` → luôn render công thức với 2 cốc nước.
* Truyền `drinkers={4}` → luôn render công thức với 4 cốc nước.

Component này là **pure** vì kết quả chỉ phụ thuộc vào props.

---

### Ví dụ sử dụng Pure Component không đúng cách

```javascript
let guest = 0;

function Cup() {
  // ❌ Bad: thay đổi biến bên ngoài
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}
```

Ở đây component **không pure** vì nó thay đổi biến toàn cục `guest`. Kết quả render sẽ khác nhau mỗi lần gọi, gây khó dự đoán.

👉 Cách sửa: truyền `guest` dưới dạng prop.

```javascript
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}
```

Giờ đây `Cup` trở thành pure, vì JSX chỉ phụ thuộc vào props.

---

### Nhận biết Pure Component với Strict Mode

React cung cấp **Strict Mode** để giúp phát hiện lỗi liên quan đến tính "pure".

* Strict Mode cảnh báo hoặc báo lỗi khi gặp hành vi không mong muốn.
* Giúp bạn sửa sớm, giữ code predictable và dễ bảo trì.

---

### Kết luận

* Component "pure" trong React luôn trả về cùng JSX với cùng props.
* Tránh thay đổi biến hoặc đối tượng bên ngoài quá trình render.
* Dùng **Strict Mode** để phát hiện và sửa các lỗi vi phạm tính "pure".
