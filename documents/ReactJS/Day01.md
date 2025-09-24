# 📅 Ngày 1: Giới thiệu về ReactJS

## ReactJS là gì?

ReactJS là một **thư viện JavaScript** do Facebook phát triển, được sử dụng rộng rãi để xây dựng **giao diện người dùng (UI)** động và tương tác trong các ứng dụng web.
Với hiệu suất cao, khả năng tái sử dụng thành phần và dễ bảo trì, ReactJS đã nhanh chóng trở thành công cụ quen thuộc của các lập trình viên web hiện nay.

Trong bài học này, chúng ta sẽ tìm hiểu:

* Lý do nên dùng ReactJS.
* Các khái niệm cơ bản trong React.
* Cách bắt đầu một ứng dụng React đơn giản.

---

## 🚀 Lợi ích khi sử dụng ReactJS

### 1. Hiệu suất cao

React sử dụng cơ chế **Virtual DOM**. Thay vì cập nhật toàn bộ giao diện khi có thay đổi, React chỉ cập nhật **những phần tử bị ảnh hưởng**.
👉 Điều này giúp trình duyệt xử lý nhanh hơn và ứng dụng mượt mà hơn.

### 2. Hệ sinh thái phong phú

React có cộng đồng cực kỳ lớn cùng vô số **thư viện mở rộng**. Bạn có thể dễ dàng tích hợp với các công cụ khác (Redux, React Router, TailwindCSS, v.v.) để xây dựng ứng dụng phức tạp.

### 3. Quản lý trạng thái tốt

React cung cấp cách quản lý **state** rõ ràng, dễ theo dõi và dễ bảo trì. Điều này đặc biệt quan trọng khi ứng dụng ngày càng lớn.

---

## 🧩 Các khái niệm cơ bản

* **Components (Thành phần):**
  Giao diện trong React được chia nhỏ thành các thành phần (component). Mỗi component có thể tái sử dụng, và chứa logic + giao diện riêng.

* **Virtual DOM:**
  Là bản sao “ảo” của DOM thực tế. React so sánh Virtual DOM với DOM thật, rồi chỉ cập nhật phần cần thiết.

* **Props và State:**

  * **Props**: dữ liệu truyền từ component cha sang con.
  * **State**: dữ liệu bên trong một component, có thể thay đổi trong quá trình hoạt động.

👉 Props và state là hai cơ chế chính để React quản lý và truyền dữ liệu.

---

## 🛠️ Bắt đầu với ReactJS

### 1. Cài đặt môi trường

* Cài **Node.js** và **npm** từ [trang chủ Node.js](https://nodejs.org/).

### 2. Tạo ứng dụng React mới

Sử dụng công cụ `create-react-app`:

```bash
npx create-react-app my-app
cd my-app
npm start
```

### 3. Viết ứng dụng React đầu tiên

Trong file `App.js`:

```jsx
import React from "react";

function App() {
  return (
    <div>
      <h1>Hello, React!</h1>
      <p>Ứng dụng React đầu tiên 🚀</p>
    </div>
  );
}

export default App;
```

Chạy `npm start` → Mở trình duyệt tại [http://localhost:3000](http://localhost:3000) để thấy kết quả.

---

## ✅ Tóm lại

* ReactJS là thư viện UI mạnh mẽ, hiệu suất cao nhờ Virtual DOM.
* Cung cấp khả năng tái sử dụng component, quản lý state rõ ràng.
* Dễ dàng khởi tạo dự án với `create-react-app`.


---
### Tại sao nên học ReactJS

ReactJS là một thư viện JavaScript do Facebook phát triển và hiện nay đã trở thành công cụ xây dựng giao diện người dùng phổ biến hàng đầu. Việc học ReactJS không chỉ giúp bạn tạo ra các ứng dụng web hiện đại mà còn mở ra nhiều cơ hội nghề nghiệp.

---

#### 1. Sứ mệnh của ReactJS

* **Tạo giao diện tương tác:** Với Virtual DOM và cơ chế cập nhật tối ưu, ReactJS cho phép xây dựng các ứng dụng có giao diện mượt mà, phản hồi nhanh mà không lo vấn đề hiệu suất.
* **Dễ dàng tích hợp:** ReactJS hoạt động tốt cùng nhiều công nghệ khác như Redux (quản lý trạng thái), React Router (quản lý định tuyến), hay nhiều thư viện hỗ trợ tối ưu hiệu quả phát triển.
* **Cộng đồng lớn:** Người học ReactJS luôn có lợi thế vì cộng đồng đông đảo, tài liệu phong phú, và sự hỗ trợ từ các nhà phát triển khắp thế giới.

---

#### 2. Lợi ích khi học ReactJS

* **Cơ hội việc làm rộng mở:** Với độ phổ biến cao, ReactJS xuất hiện trong rất nhiều tin tuyển dụng về phát triển web. Thành thạo React giúp bạn dễ dàng tiếp cận các vị trí tốt trong ngành.
* **Hiệu suất cao:** ReactJS được thiết kế với khả năng cập nhật và render hiệu quả, nhờ đó các ứng dụng web vận hành trơn tru, nâng cao trải nghiệm người dùng.
* **Tái sử dụng thành phần:** React khuyến khích xây dựng ứng dụng theo các thành phần nhỏ có thể tái sử dụng, giúp tiết kiệm công sức khi phát triển ứng dụng lớn và phức tạp.
* **Phát triển đa nền tảng:** Không chỉ web, React còn mở rộng ra mobile (React Native) và thậm chí cả desktop, tạo sự linh hoạt cho lập trình viên.

---

#### 3. Kết luận

ReactJS mang đến một hệ sinh thái mạnh mẽ với khả năng tạo ứng dụng web tương tác, hiệu suất cao, dễ bảo trì và dễ mở rộng. Học ReactJS không chỉ giúp bạn phát triển kỹ năng mà còn nâng cao giá trị nghề nghiệp.

👉 Trong bài học tiếp theo, chúng ta sẽ cùng tìm hiểu **cách khởi tạo một dự án ReactJS** để bắt đầu hành trình xây dựng ứng dụng thực tế.

---
