## 2 Cài đặt
### 2.1 Khởi tạo dự án với ReactJS

Trong phần trước, chúng ta đã tìm hiểu về lý do tại sao nên học ReactJS. Bây giờ, hãy bắt đầu bước đầu tiên: **cài đặt và khởi tạo một dự án ReactJS**.

---

#### 1. Thử nghiệm đầu tiên với React Component trên CodePen

Để hiểu cơ bản về cách React hoạt động, ta sẽ thử tạo một ứng dụng đơn giản hiển thị danh sách các thẻ thông tin.

**Cách làm thông thường (HTML + CSS):**

```html
<div id="app">
  <div class="card">
    <div class="name">Name: Alice</div>
    <div class="age">Age: 20</div>
  </div>
  <div class="card">
    <div class="name">Name: Bob</div>
    <div class="age">Age: 20</div>
  </div>
  <div class="card">
    <div class="name">Name: Cris</div>
    <div class="age">Age: 20</div>
  </div>
</div>
```

```css
.card {
  width: 200px;
  border: 1px solid black;
  padding: 20px;
  border-radius: 10px;
  font-family: sans-serif;
  margin: 5px;
}

.name {
  font-size: 20px;
  font-weight: bold;
}

.age {
  font-size: 14px;
  font-style: italic;
}
```

Khi chạy, ta nhận được danh sách 3 thẻ. Tuy nhiên, cách tiếp cận này có một số nhược điểm:

* Muốn thêm một thẻ mới, phải copy lại toàn bộ HTML.
* Nếu thêm trường mới (ví dụ `Address`), cần chỉnh sửa tất cả các thẻ.
* Càng nhiều dữ liệu, việc quản lý càng phức tạp.

**Cách làm với ReactJS:**

```jsx
function NameCard(props) {
  return (
    <div className="card">
      <div className="name">Name: {props.name}</div>
      <div className="age">Age: {props.age}</div>
    </div>
  )
}

ReactDOM.render(
  <div>
    <NameCard name="Alice" age="20" />
    <NameCard name="Bob" age="20" />
    <NameCard name="Cris" age="20" />
  </div>, 
  document.getElementById("app")
)
```

**Điểm cần chú ý:**

* `NameCard` là một **component**, nhận dữ liệu đầu vào qua `props`.
* `class` được thay bằng `className`.
* `{}` dùng để nhúng giá trị JavaScript vào trong JSX.

👉 Để chạy được code trên CodePen:

1. Vào phần **Settings** → **JavaScript Preprocessor** → chọn **Babel**.
2. Thêm 2 thư viện: **react** và **react-dom**.

Với cách này, ta đã có một component có thể tái sử dụng nhiều lần chỉ bằng cách truyền props khác nhau.

---

#### 2. Khởi tạo ứng dụng React trên máy tính

Để phát triển ứng dụng thực tế, ta cần cài đặt ReactJS trên máy tính.

**Yêu cầu:**

* Cài đặt **NodeJS** (kèm theo npm và npx).
* Kiểm tra bằng:

  ```bash
  node --version
  npx --version
  ```

**Các bước khởi tạo dự án:**

1. Tạo thư mục mới.
2. Mở terminal trong thư mục đó.
3. Chạy lệnh:

   ```bash
   npx create-react-app hello-world
   ```
4. Di chuyển vào thư mục dự án:

   ```bash
   cd hello-world
   ```
5. Khởi chạy ứng dụng:

   ```bash
   npm start
   ```

Trình duyệt sẽ tự mở và hiển thị ứng dụng React đầu tiên.

---

#### 3. Cấu trúc dự án React

* **package.json** → file cấu hình, quản lý dependencies và scripts.
* **node\_modules/** → chứa toàn bộ thư viện cài đặt.
* **public/** → chứa file `index.html` (nơi React render ứng dụng).
* **src/** → chứa toàn bộ source code React (components, logic).

---

#### 4. Các framework phổ biến dựa trên React

Ngoài React “thuần”, bạn có thể sử dụng các framework để mở rộng khả năng:

* **Next.js** → framework toàn diện cho ứng dụng web, hỗ trợ SSR, SSG.

  ```bash
  npx create-next-app
  ```

* **Remix** → framework với định tuyến lồng nhau, tối ưu cho trải nghiệm người dùng.

  ```bash
  npx create-remix
  ```

* **Gatsby** → framework chuyên về static site, tích hợp CMS và GraphQL.

  ```bash
  npx create-gatsby
  ```

* **Expo (React Native)** → framework cho ứng dụng di động Android, iOS.

  ```bash
  npx create-expo-app
  ```

---


### 2.1 Thêm React vào ứng dụng có sẵn

Ở phần trước, chúng ta đã học cách khởi tạo một dự án ReactJS mới hoàn toàn. Tuy nhiên, React vốn chỉ là một **thư viện front-end**, nên bạn cũng có thể tích hợp nó trực tiếp vào một ứng dụng web hiện có, giống như khi dùng Bootstrap hay jQuery.

Điều này đặc biệt hữu ích khi bạn có một dự án lớn (ASP.NET, Java Spring, NodeJS…) và chỉ muốn thêm một tính năng mới bằng React mà không ảnh hưởng đến phần còn lại.

---

#### 1. Chuẩn bị một dự án web có sẵn

Giả sử ta đang có một file `index.html` trong dự án:

```html
<div class="post-container">
  <h1 class="post-header">T-shirt for sale</h1>
  <div class="post-body">
    <img src="t-shirt.jpg" alt="img" width="300px" height="300px" />
  </div>
</div>
```

Đây là một đoạn HTML đơn giản hiển thị thông tin về một bài đăng.

---

#### 2. Thêm vùng chứa React (React Root Node)

Để React quản lý giao diện của một phần cụ thể, bạn cần tạo một thẻ `div` có **id riêng**. Ví dụ:

```html
<div id="post-comments-root">
  <!-- React sẽ render nội dung vào đây -->
</div>
```

---

#### 3. Thêm thư viện React và Babel

Chèn React vào cuối thẻ `<body>` của file HTML.

```html
<script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
```

* **react.development.js** và **react-dom.development.js** → dùng trong môi trường phát triển.
* Khi deploy, thay bằng **react.production.js** để tối ưu hiệu suất.
* **babel.min.js** → cho phép viết JSX trực tiếp trong file HTML (nếu không, bạn phải dùng `React.createElement`).

---

#### 4. Tạo component React

Ví dụ: ta tạo một component để quản lý phần bình luận.

File: `react/components/post-comments.js`

```jsx
function PostComments() {
  return (
    <div>
      <h2>Bình luận</h2>
      <ul>
        <li>Alice: Sản phẩm rất đẹp!</li>
        <li>Bob: Giá cả hợp lý.</li>
      </ul>
    </div>
  );
}
```

Trong `index.html`, import component này:

```html
<script src="react/components/post-comments.js" type="text/babel"></script>
```

---

#### 5. Render component vào DOM

Để React quản lý nội dung, ta cần truy cập `div#post-comments-root` và render component:

```jsx
const domNode = document.getElementById("post-comments-root");
const root = ReactDOM.createRoot(domNode);
root.render(<PostComments />);
```

---

#### 6. Kết quả

Lúc này, trong phần bình luận của bài viết, React sẽ quản lý giao diện. Từ đây bạn có thể thêm logic (form nhập bình luận, lưu trữ dữ liệu, gọi API…) mà không ảnh hưởng đến phần còn lại của dự án.

---

👉 Kết luận: Việc tích hợp React vào ứng dụng có sẵn rất đơn giản. Bạn chỉ cần:

1. Tạo một **vùng chứa** trong HTML (`div` với `id`).
2. Import **React + ReactDOM + Babel**.
3. Tạo **component React** và render nó vào vùng chứa đó.


---


## 2.3 Cài đặt môi trường phát triển React

Để bắt đầu phát triển ứng dụng với **ReactJS**, chúng ta cần chuẩn bị một số công cụ cơ bản:

### 🔹 Công cụ cần thiết

1. **Visual Studio Code (VS Code)**

   * Không bắt buộc nhưng được khuyến nghị sử dụng.
   * Hỗ trợ nhiều ngôn ngữ lập trình, nhiều tiện ích mở rộng (extensions), debugging, Git tích hợp, terminal tích hợp.
   * Miễn phí, mã nguồn mở, chạy trên Windows / macOS / Linux.
   * Link tải: [https://code.visualstudio.com/](https://code.visualstudio.com/).

2. **Node.js**

   * Môi trường runtime cho JavaScript phía server.
   * Bắt buộc phải cài vì React dựa trên Node.js.
   * Khi cài Node.js thì **npm (Node Package Manager)** cũng sẽ được cài theo.
   * Nên chọn bản **LTS (Long-Term Support)** để đảm bảo ổn định.
   * Link tải: [https://nodejs.org/](https://nodejs.org/).

   **Kiểm tra cài đặt:**

   ```bash
   node -v
   npm -v
   ```

   Nếu hiện phiên bản thì việc cài đặt thành công.

3. **npm (Node Package Manager)**

   * Đi kèm Node.js.
   * Quản lý thư viện và package cần thiết khi lập trình React.

---

### 🔹 Thiết lập tiện ích trong VS Code

1. **Kiểm tra lỗi (Linting)**

   * Dùng **ESLint** để bắt lỗi sớm khi code React.
   * Cài đặt:

     ```bash
     npm install eslint --save-dev
     npx eslint --init
     ```
   * Cài extension ESLint trong VS Code để tự động highlight lỗi.
   * Bật quy tắc **eslint-plugin-react-hooks** (giúp phát hiện lỗi nghiêm trọng khi dùng Hook).

2. **Định dạng mã (Formatting)**

   * Dùng **Prettier** để format code đẹp và đồng nhất.
   * Cài extension **Prettier - Code formatter**.
   * Bật chế độ format on save:

     * `Ctrl/Cmd + Shift + P → Settings → format on save`.

---

### 🔹 Sau khi cài xong môi trường

Bạn đã có:
✅ VS Code để code React
✅ Node.js + npm để chạy dự án
✅ ESLint + Prettier để code sạch và đồng nhất

👉 Tiếp theo, bạn có thể khởi tạo ứng dụng React bằng **Create React App (CRA)** hoặc dùng **Vite** (nhanh và hiện đại hơn).

Ví dụ với **CRA**:

```bash
npx create-react-app my-app
cd my-app
npm start
```

Kết quả: mở `http://localhost:3000/` trên trình duyệt và bạn sẽ thấy React App đầu tiên. 🎉

---
Rất tốt 👌
Phần bạn đưa chính là **2.4 – Sử dụng TypeScript cho React**.
Mình sẽ nối nó ngay sau **2.3 Cài đặt môi trường** để giáo án thành mạch liền.

---

## 2.4. Sử dụng TypeScript cho React

### 🔹 Tổng quan về TypeScript

* Được phát triển bởi **Microsoft**, là một ngôn ngữ **mã nguồn mở**.
* Kế thừa hoàn toàn JavaScript, nhưng bổ sung thêm:

  * **Type system (kiểu dữ liệu tĩnh)**
  * **Class, Interface, Generics** → hỗ trợ lập trình hướng đối tượng mạnh mẽ.
* Được cộng đồng và các thư viện/framework lớn khuyến khích dùng.
* Hỗ trợ tuyệt vời trên **Visual Studio Code** (auto-suggest, gợi ý code, báo lỗi real-time).

👉 TypeScript ngày nay đã trở thành **chuẩn mặc định** cho các dự án React hiện đại.

---

### 🔹 Lợi ích khi dùng TypeScript với React

* **Tự động gợi ý code (Autocomplete, IntelliSense):** dễ viết code hơn, hạn chế nhầm lẫn.
* **Đọc và xác thực code dễ hơn:** thay thế PropTypes truyền thống bằng type tĩnh.
* **Bắt lỗi sớm:** báo lỗi ngay khi code, không cần đợi chạy app mới phát hiện.
* **Dễ maintain & refactor:** khi codebase lớn, TypeScript giúp sửa đổi an toàn, tránh bug tiềm ẩn.
* **Tương thích tốt với JS:** TypeScript compile ra JavaScript nên vẫn chạy trên mọi trình duyệt.

---

### 🔹 Tạo dự án React + TypeScript (Create React App)

**Bước 1: Tạo project mới**

```bash
npx create-react-app ten-du-an --template typescript
```

**Bước 2: Di chuyển vào thư mục dự án**

```bash
cd ten-du-an
```

**Bước 3: Chạy app**

```bash
npm start
```

Kết quả: App React với **TypeScript cấu hình sẵn** sẽ chạy ở `http://localhost:3000`.

---

### 🔹 Thêm TypeScript vào dự án React đã có

**Bước 1: Cài dependencies cần thiết**

```bash
npm install --save typescript @types/node @types/react @types/react-dom @types/jest
```

**Bước 2: Tạo file `tsconfig.json`**

```bash
npx tsc --init
```

**Bước 3: Đổi tên file**

* `.js` → `.tsx` (cho component React).

**Bước 4: Cấu hình `tsconfig.json` (ví dụ)**

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "strict": true,
    "jsx": "react",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**Bước 5: Chạy lại dự án**

```bash
npm start
```

---

### 🔹 Ví dụ Component React với TypeScript

```tsx
import React from "react";

type ProfileProps = {
  name: string;
  age: number;
  hobbies: string[];
};

const Profile: React.FC<ProfileProps> = ({ name, age, hobbies }) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>Tuổi: {age}</p>
      <ul>
        {hobbies.map((hobby) => (
          <li key={hobby}>{hobby}</li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
```

👉 Với TypeScript, ta có thể định nghĩa rõ ràng kiểu của `props`, tránh bug runtime.

---

* Hiểu TypeScript là gì.
* Biết cách tạo dự án React + TS mới hoặc chuyển dự án cũ sang TS.
* Code ví dụ với TypeScript.

---
Rất chuẩn 👍 Bạn vừa đưa **2.5 – Cài đặt React Developer Tool**.
Mình sẽ nối tiếp vào sau **2.4** để phần **Ngày 1** hoàn thiện mạch kiến thức.

---


## 2.5. Cài đặt React Developer Tools

**React Developer Tools** là tiện ích cực kỳ hữu ích cho lập trình viên React, cho phép:

* Kiểm tra **cây component** (Component tree).
* Theo dõi **props** và **state** theo thời gian thực.
* Debug ứng dụng nhanh chóng.
* Phát hiện vấn đề về **hiệu suất**.

---

### 🔹 Cách cài đặt React Developer Tools

#### **1. Cài đặt tiện ích mở rộng trên trình duyệt**

Hiện có sẵn cho: **Chrome, Firefox, Edge**.

* **Chrome**:

  1. Truy cập [Chrome Web Store – React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi).
  2. Nhấn **Add to Chrome**.
  3. Sau khi cài đặt, biểu tượng React (⚛️) sẽ xuất hiện ở góc trình duyệt.
  4. Vào Developer Tools → Tab **Components** để kiểm tra React tree.

* **Firefox**:

  1. Vào [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/).
  2. Nhấn **Add to Firefox**.
  3. Mở DevTools → Tab **Components** để sử dụng.

* **Edge**:

  1. Vào [Microsoft Edge Add-ons Store](https://microsoftedge.microsoft.com/addons/).
  2. Tìm **React Developer Tools** → Cài đặt.
  3. Mở DevTools → Tab **Components**.

---

#### **2. Cài đặt qua npm (dành cho mọi trình duyệt hoặc môi trường riêng)**

Nếu bạn không dùng Chrome/Firefox/Edge hoặc muốn debug ngoài trình duyệt, có thể cài đặt qua **npm** hoặc **Yarn**:

```bash
# Yarn
yarn global add react-devtools

# npm
npm install -g react-devtools
```

Chạy công cụ:

```bash
react-devtools
```

Sau đó, chèn script kết nối vào file HTML:

```html
<html>
  <head>
    <script src="http://localhost:8097"></script>
  </head>
  <body>
    <!-- Nội dung trang -->
  </body>
</html>
```

Khi reload trang, React Developer Tools sẽ kết nối với ứng dụng qua cổng **8097**.

---

### 🔹 Lợi ích khi dùng React Developer Tools

* Hiển thị **cấu trúc component** rõ ràng.
* Debug **props & state** trực tiếp.
* Kiểm tra **hiệu suất render** → phát hiện component render lại không cần thiết.
* Rất quan trọng trong team-work để dễ **review code** và **fix bug nhanh**.

---

✅ Đến đây, bạn đã:

* Cài đặt môi trường (Node, npm, VSCode).
* Tích hợp TypeScript cho React.
* Biết cách debug bằng React Developer Tools.