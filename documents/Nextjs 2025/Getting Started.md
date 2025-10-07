# 🪄 Chào mừng đến với tài liệu Next.js!

Phần **Bắt đầu nhanh (Getting Started)** này sẽ hướng dẫn bạn **tạo ứng dụng Next.js đầu tiên** và tìm hiểu **các tính năng cốt lõi** mà bạn sẽ sử dụng trong mọi dự án.

---

## 💡 Kiến thức cần có trước

Tài liệu này giả định rằng bạn đã có **một số hiểu biết cơ bản về phát triển web**.
Trước khi bắt đầu, bạn nên cảm thấy thoải mái với các kiến thức sau:

* **HTML**
* **CSS**
* **JavaScript**
* **React**

Nếu bạn **mới học React** hoặc cần ôn lại, hãy bắt đầu với khóa **React Foundations** (Nền tảng React),
và sau đó đến khóa **Next.js Foundations**, nơi bạn sẽ **vừa học vừa xây dựng một ứng dụng thực tế**.

---

## 🚀 Các bước tiếp theo

### 1. Cài đặt (Installation)

Tìm hiểu cách tạo một ứng dụng Next.js mới bằng công cụ dòng lệnh `create-next-app`,
và thiết lập **TypeScript**, **ESLint**, cùng **Module Path Aliases**.

### 2. Cấu trúc dự án (Project Structure)

Hiểu các **quy ước thư mục và tệp tin** trong Next.js,
và cách **tổ chức dự án** của bạn một cách hợp lý.

### 3. Layouts và Pages

Học cách **tạo các trang (pages)** và **bố cục (layouts)** đầu tiên,
và **liên kết giữa chúng** bằng component `Link`.

### 4. Liên kết & Điều hướng (Linking and Navigating)

Tìm hiểu cách **tối ưu hóa điều hướng** bằng các kỹ thuật như **prefetching**, **prerendering**,
và **client-side navigation**, cũng như cách xử lý điều hướng **động** hoặc **mạng chậm**.

### 5. Server và Client Components

Tìm hiểu cách sử dụng **React Server Components** và **Client Components**
để render từng phần ứng dụng trên **server hoặc client** một cách hiệu quả.

### 6. Partial Prerendering

Khám phá **Partial Prerendering** – cách kết hợp ưu điểm của **render tĩnh (static)**
và **render động (dynamic)** để tối ưu hiệu năng.

### 7. Fetching Data

Học cách **lấy dữ liệu (fetch)** và **stream nội dung** phụ thuộc vào dữ liệu đó.

### 8. Updating Data

Tìm hiểu cách **thay đổi dữ liệu** bằng **Server Functions**.

### 9. Caching và Revalidating

Học cách **cache dữ liệu** và **tự động làm mới (revalidate)** trong ứng dụng Next.js.

### 10. Xử lý lỗi (Error Handling)

Học cách **hiển thị lỗi dự kiến** và **xử lý lỗi không mong muốn (uncaught exceptions)**.

### 11. CSS

Khám phá các cách thêm **CSS** vào ứng dụng: **Tailwind CSS**, **CSS Modules**, **Global CSS**, và hơn thế nữa.

### 12. Tối ưu hóa hình ảnh (Image Optimization)

Tìm hiểu cách **tối ưu hóa hình ảnh** trong Next.js để tăng tốc độ tải trang.

### 13. Tối ưu hóa font (Font Optimization)

Học cách **tối ưu hóa phông chữ** nhằm cải thiện trải nghiệm người dùng.

### 14. Metadata & OG Images

Tìm hiểu cách **thêm metadata** cho các trang và tạo **hình ảnh chia sẻ động (Open Graph)**.

### 15. Route Handlers & Middleware

Hiểu cách sử dụng **Route Handlers** và **Middleware** để mở rộng khả năng xử lý của ứng dụng.

### 16. Triển khai (Deploying)

Học cách **triển khai ứng dụng Next.js** của bạn lên môi trường production.

### 17. Nâng cấp (Upgrading)

Tìm hiểu cách **nâng cấp** ứng dụng Next.js lên phiên bản mới nhất hoặc **canary build**.

---

✅ Sau khi hoàn thành phần này, bạn sẽ nắm được:

* Cấu trúc cơ bản của một ứng dụng Next.js
* Quy trình làm việc từ cài đặt → phát triển → triển khai
* Và nền tảng vững chắc để học các phần nâng cao hơn


---


# ⚙️ Phần 1: Cài đặt (Installation)

## 🧩 Yêu cầu hệ thống (System Requirements)

Trước khi bắt đầu, hãy đảm bảo hệ thống của bạn đáp ứng các yêu cầu sau:

* **Node.js** phiên bản **18.18** hoặc mới hơn
* Hệ điều hành: **macOS**, **Windows** (bao gồm **WSL**) hoặc **Linux**

---

## ⚡ Cài đặt tự động (Automatic Installation)

Cách nhanh nhất để khởi tạo một ứng dụng Next.js mới là dùng lệnh `create-next-app`,
nó sẽ tự động thiết lập mọi thứ giúp bạn.

Chạy lệnh sau trong terminal:

```bash
npx create-next-app@latest
```

Khi chạy, bạn sẽ được hỏi một số câu hỏi:

```
What is your project named? my-app
Would you like to use TypeScript? No / Yes
Would you like to use ESLint? No / Yes
Would you like to use Tailwind CSS? No / Yes
Would you like your code inside a `src/` directory? No / Yes
Would you like to use App Router? (recommended) No / Yes
Would you like to use Turbopack? (recommended) No / Yes
Would you like to customize the import alias (`@/*` by default)? No / Yes
What import alias would you like configured? @/*
```

Sau khi hoàn tất, `create-next-app` sẽ:

* Tạo thư mục dự án theo tên bạn nhập
* Cài đặt các **dependencies cần thiết**

---

## 🧱 Cài đặt thủ công (Manual Installation)

Nếu bạn muốn tự cấu hình, cài đặt các package cần thiết:

```bash
pnpm i next@latest react@latest react-dom@latest
```

*(hoặc dùng npm / yarn / bun tùy môi trường của bạn)*

> 💡 **Ghi nhớ:**
> App Router của Next.js sử dụng phiên bản **React Canary** — bao gồm toàn bộ thay đổi của React 19 và các tính năng mới đang được thử nghiệm.
> Trong khi đó, **Pages Router** sẽ dùng đúng phiên bản React được khai báo trong `package.json`.

---

### 🧾 Thêm script vào `package.json`

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

Giải thích:

| Lệnh                   | Chức năng                                |
| ---------------------- | ---------------------------------------- |
| `next dev --turbopack` | Chạy server phát triển với **Turbopack** |
| `next build`           | Build ứng dụng để triển khai production  |
| `next start`           | Khởi động server production              |
| `eslint`               | Chạy kiểm tra code với ESLint            |

> ⚠️ **Lưu ý:**
> Turbopack hiện **ổn định cho môi trường dev**, nhưng **chỉ ở trạng thái beta cho production build**.
> Muốn thử, chạy:
>
> ```bash
> next build --turbopack
> ```
>
> Xem thêm tại tài liệu **Turbopack docs**.

---

## 📂 Tạo thư mục ứng dụng (Create the app directory)

Next.js sử dụng **File-System Routing**, nghĩa là **cấu trúc thư mục = cấu trúc routes**.

1. Tạo thư mục `app/`
2. Trong đó, tạo tệp `layout.tsx` — **layout gốc (root layout)**, bắt buộc phải có
   và phải chứa thẻ `<html>` và `<body>`.

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

3. Tạo trang chủ `app/page.tsx` với nội dung ban đầu:

```tsx
// app/page.tsx
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

> ✅ Khi người dùng truy cập `/`, cả **layout.tsx** và **page.tsx** sẽ được render.

---

### 📁 Cấu trúc thư mục app (App Folder Structure)

> 🔹 Nếu bạn quên tạo `layout.tsx`, Next.js sẽ **tự động tạo file này** khi chạy `next dev`.
> 🔹 Bạn **có thể thêm thư mục `src/`** ở root để tách riêng **mã nguồn ứng dụng** và **tệp cấu hình**.

---

## 🖼️ Tạo thư mục `public` (tuỳ chọn)

Tạo thư mục `public/` ở gốc dự án để lưu các **tài nguyên tĩnh (static assets)**
như hình ảnh, font chữ, v.v.

Các file trong `public/` có thể được tham chiếu trực tiếp bằng đường dẫn `/`.

Ví dụ:

```tsx
// app/page.tsx
import Image from 'next/image'

export default function Page() {
  return <Image src="/profile.png" alt="Profile" width={100} height={100} />
}
```

File `public/profile.png` sẽ được truy cập tại URL:

```
/profile.png
```

---

## 🧠 Chạy server phát triển (Run the development server)

```bash
npm run dev
```

Truy cập 👉 [http://localhost:3000](http://localhost:3000)

Bạn có thể chỉnh sửa file `app/page.tsx` và **xem kết quả cập nhật ngay lập tức** trong trình duyệt.

---

## 🧷 Cài đặt TypeScript

* **Phiên bản tối thiểu:** v4.5.2
* Next.js hỗ trợ TypeScript **mặc định**.

Cách kích hoạt:

1. Đổi tên bất kỳ file `.js` thành `.ts` hoặc `.tsx`
2. Chạy lệnh:

   ```bash
   npm run dev
   ```

   Next.js sẽ tự động:

   * Cài đặt dependencies cần thiết
   * Tạo file `tsconfig.json` với cấu hình khuyến nghị

### 💡 Plugin TypeScript cho IDE

Next.js có **plugin TypeScript riêng**, giúp kiểm tra kiểu nâng cao và gợi ý code trong VSCode.

Kích hoạt trong **VSCode**:

1. Mở **Command Palette**: `Ctrl/⌘ + Shift + P`
2. Tìm “**TypeScript: Select TypeScript Version**”
3. Chọn **Use Workspace Version**

---

## 🧹 Cài đặt ESLint

Next.js tích hợp sẵn **ESLint**.

Nếu bạn tạo dự án bằng `create-next-app`, ESLint sẽ được tự động thiết lập.
Nếu bạn **tự tạo dự án**, thêm script vào `package.json`:

```json
{
  "scripts": {
    "lint": "next lint"
  }
}
```

Chạy lệnh:

```bash
npm run lint
```

Bạn sẽ thấy câu hỏi cấu hình:

```
? How would you like to configure ESLint?
❯ Strict (recommended)
  Base
  Cancel
```

### Giải thích các lựa chọn:

* **Strict (khuyến nghị):** Cấu hình chuẩn Next.js + quy tắc nghiêm ngặt cho **Core Web Vitals**
* **Base:** Cấu hình cơ bản của Next.js
* **Cancel:** Bỏ qua, nếu bạn muốn tự cấu hình thủ công

Nếu chọn **Strict** hoặc **Base**, Next.js sẽ:

* Cài đặt `eslint` và `eslint-config-next`
* Tạo file `.eslintrc.json` trong root project

> 🧠 Bạn có thể thay `.eslintrc.json` bằng **eslint.config.mjs** (định dạng mới hơn).
> Tham khảo cấu hình tại trang **ESLint API Reference**.

Sau khi thiết lập, bạn có thể chạy:

```bash
next lint
```

hoặc

```bash
next build
```

→ ESLint sẽ tự chạy và **chặn build nếu có lỗi** (cảnh báo thì không).

---

## 🧭 Cấu hình Absolute Imports & Module Path Aliases

Next.js hỗ trợ sẵn tùy chọn `"baseUrl"` và `"paths"` trong `tsconfig.json` hoặc `jsconfig.json`.

Nhờ đó, bạn có thể import file bằng **đường dẫn ngắn gọn** thay vì đi lên nhiều cấp thư mục.

**Trước:**

```tsx
import { Button } from '../../../components/button'
```

**Sau:**

```tsx
import { Button } from '@/components/button'
```

Cấu hình trong `tsconfig.json` hoặc `jsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": "src/"
  }
}
```

Hoặc thêm **alias** bằng `paths`:

```json
{
  "compilerOptions": {
    "baseUrl": "src/",
    "paths": {
      "@/styles/*": ["styles/*"],
      "@/components/*": ["components/*"]
    }
  }
}
```

> 📘 Mỗi đường dẫn trong `paths` đều **tương đối với `baseUrl`**.

---

✅ **Tổng kết phần này:**

* Biết cách cài đặt Next.js (tự động hoặc thủ công)
* Cấu trúc cơ bản thư mục `app`
* Thiết lập TypeScript, ESLint, và alias đường dẫn
* Chạy ứng dụng đầu tiên trên `localhost:3000`

---


# 🏗️ Phần 2: Cấu trúc và Tổ chức Dự án (Project Structure & Organization)

Trang này cung cấp **tổng quan toàn bộ quy ước thư mục và tệp trong Next.js**,
kèm theo **gợi ý cách tổ chức dự án** sao cho rõ ràng và dễ mở rộng.

---

## 📁 Quy ước thư mục và tệp (Folder and File Conventions)

### 🔹 Thư mục cấp cao nhất (Top-level folders)

| Thư mục  | Mô tả                                                                       |
| -------- | --------------------------------------------------------------------------- |
| `app`    | **App Router** – nơi định nghĩa routing theo cấu trúc thư mục               |
| `pages`  | **Pages Router** (cũ, dành cho backward compatibility)                      |
| `public` | Chứa **tài nguyên tĩnh** (ảnh, font, v.v.)                                  |
| `src`    | (Tuỳ chọn) Thư mục chứa mã nguồn ứng dụng, giúp tách biệt với file cấu hình |

---

### 🔹 Tệp cấp cao nhất (Top-level files)

| Tệp                                                         | Chức năng                                |
| ----------------------------------------------------------- | ---------------------------------------- |
| `next.config.js`                                            | File cấu hình chính của Next.js          |
| `package.json`                                              | Quản lý dependencies và script           |
| `instrumentation.ts`                                        | Cấu hình **OpenTelemetry** và tracking   |
| `middleware.ts`                                             | Định nghĩa **middleware** xử lý request  |
| `.env`, `.env.local`, `.env.development`, `.env.production` | Các biến môi trường theo từng môi trường |
| `.eslintrc.json`                                            | Cấu hình **ESLint**                      |
| `.gitignore`                                                | Quy định file/folder bị bỏ qua bởi Git   |
| `next-env.d.ts`                                             | File khai báo TypeScript cho Next.js     |
| `tsconfig.json` / `jsconfig.json`                           | Cấu hình TypeScript hoặc JavaScript      |

---

## 🧭 Routing Files

| Tên file       | Định dạng             | Chức năng                            |
| -------------- | --------------------- | ------------------------------------ |
| `layout`       | `.js`, `.jsx`, `.tsx` | Layout của route                     |
| `page`         | `.js`, `.jsx`, `.tsx` | Trang hiển thị                       |
| `loading`      | `.js`, `.jsx`, `.tsx` | UI loading (React Suspense boundary) |
| `not-found`    | `.js`, `.jsx`, `.tsx` | Trang 404                            |
| `error`        | `.js`, `.jsx`, `.tsx` | UI xử lý lỗi trong route             |
| `global-error` | `.js`, `.jsx`, `.tsx` | UI xử lý lỗi toàn cục                |
| `route`        | `.js`, `.ts`          | Định nghĩa API endpoint              |
| `template`     | `.js`, `.jsx`, `.tsx` | Layout có thể re-render lại          |
| `default`      | `.js`, `.jsx`, `.tsx` | Trang fallback cho parallel routes   |

---

## 🧱 Nested Routes (Route Lồng Nhau)

| Cấu trúc        | Ý nghĩa                        |
| --------------- | ------------------------------ |
| `folder`        | Route segment                  |
| `folder/folder` | Route lồng nhau (nested route) |

---

## 🔢 Dynamic Routes (Route động)

| Cấu trúc        | Mô tả                                  |
| --------------- | -------------------------------------- |
| `[folder]`      | Route động                             |
| `[...folder]`   | Route động kiểu **catch-all**          |
| `[[...folder]]` | Route động kiểu **optional catch-all** |

---

## 🗂️ Route Groups & Private Folders

| Cấu trúc   | Ý nghĩa                                              |
| ---------- | ---------------------------------------------------- |
| `(folder)` | Nhóm route – **không ảnh hưởng đến URL**             |
| `_folder`  | Thư mục **riêng tư** – bị loại khỏi hệ thống routing |

---

## 🔄 Parallel & Intercepted Routes

| Cấu trúc         | Mô tả                              |
| ---------------- | ---------------------------------- |
| `@folder`        | **Named slot** cho parallel routes |
| `(.)folder`      | Intercept cùng cấp                 |
| `(..)folder`     | Intercept một cấp trên             |
| `(..)(..)folder` | Intercept hai cấp trên             |
| `(...)folder`    | Intercept từ root                  |

---

## 🖼️ Quy ước Metadata Files

### 🧩 App Icons

| Tên          | Định dạng                                                     | Mô tả                               |
| ------------ | ------------------------------------------------------------- | ----------------------------------- |
| `favicon`    | `.ico`                                                        | Biểu tượng trang web                |
| `icon`       | `.ico`, `.jpg`, `.jpeg`, `.png`, `.svg`, `.js`, `.ts`, `.tsx` | Icon ứng dụng (tĩnh hoặc sinh động) |
| `apple-icon` | `.jpg`, `.jpeg`, `.png`, `.js`, `.ts`, `.tsx`                 | Icon dành riêng cho thiết bị Apple  |

### 🌐 Open Graph & Twitter Images

| Tên               | Định dạng                                             | Mô tả                          |
| ----------------- | ----------------------------------------------------- | ------------------------------ |
| `opengraph-image` | `.jpg`, `.jpeg`, `.png`, `.gif`, `.js`, `.ts`, `.tsx` | Ảnh OG cho chia sẻ mạng xã hội |
| `twitter-image`   | `.jpg`, `.jpeg`, `.png`, `.gif`, `.js`, `.ts`, `.tsx` | Ảnh preview trên Twitter/X     |

### 🔍 SEO

| Tên       | Định dạng            | Mô tả                               |
| --------- | -------------------- | ----------------------------------- |
| `sitemap` | `.xml`, `.js`, `.ts` | Sơ đồ website                       |
| `robots`  | `.txt`, `.js`, `.ts` | File robots.txt hoặc phiên bản động |

---

## 🧩 Cách Tổ Chức Dự Án (Organizing Your Project)

Next.js **không áp đặt** cách tổ chức thư mục,
nhưng cung cấp các công cụ giúp bạn **sắp xếp hợp lý, dễ mở rộng**.

---

### 🧱 Thứ tự hierarchy của component trong route

Khi Next.js render, các component đặc biệt sẽ được xếp theo thứ tự sau:

```
layout.js
template.js
error.js (React error boundary)
loading.js (React suspense boundary)
not-found.js (React error boundary)
page.js hoặc layout lồng nhau
```

→ Các route **lồng nhau** sẽ được **render đệ quy**,
tức là layout của route cha bao ngoài layout của route con.

---

### 📦 Colocation (Lưu trữ cục bộ theo route)

Trong thư mục `app`, **mỗi thư mục con là một route segment**.
Cấu trúc folder chính là cấu trúc URL.

Tuy nhiên, route **chưa được public** cho đến khi có file `page.js` hoặc `route.js`.

> ✅ Các file khác (component, utils, lib, v.v.) có thể **đặt cùng** trong route folder mà **không bị public**.

Ví dụ:

```
app/
 └── dashboard/
      ├── page.tsx        ✅ route công khai (/dashboard)
      ├── layout.tsx
      ├── lib/            📦 chứa file nội bộ
      └── component.tsx   📄 không bị router xử lý
```

> 💡 Bạn cũng có thể đặt các file này **ngoài thư mục `app`** nếu muốn.

---

### 🔒 Private Folders

Tạo thư mục **private** bằng cách **đặt dấu gạch dưới đầu tên**:

```
_folderName/
```

→ Các thư mục này **bị loại khỏi routing**
→ Tốt cho việc:

* Tách **logic nội bộ** khỏi logic route
* Dễ quản lý và phân loại code trong editor
* Tránh xung đột tên với quy ước Next.js

> ⚠️ Nếu bạn muốn route thực sự bắt đầu bằng `_`,
> hãy đổi thành `%5FfolderName` (mã hóa `_` theo URL).

---

### 🗃️ Route Groups

Tạo **route group** bằng cách **bọc thư mục trong dấu ngoặc tròn**:

```
(marketing)
(shop)
(admin)
```

→ Route group **không xuất hiện trong URL**,
nhưng giúp **tổ chức route logic**.

**Ví dụ:**

```
app/
 ├── (marketing)/
 │    ├── layout.tsx
 │    └── page.tsx
 └── (shop)/
      ├── layout.tsx
      └── page.tsx
```

➡️ `/` vẫn hiển thị như cũ,
nhưng mỗi nhóm có **layout riêng biệt**.

---

### 🧩 Ứng dụng nâng cao của Route Groups

#### 1. **Opt-in Layout**

Bạn có thể chọn chỉ áp dụng một layout cho một số route cụ thể:

```
app/
 ├── (shop)/
 │    ├── account/
 │    ├── cart/
 └── checkout/
```

→ `account` và `cart` dùng chung layout `(shop)`,
→ `checkout` dùng layout mặc định.

#### 2. **Loading Skeleton cho route riêng**

Tạo nhóm `/(overview)` để áp dụng riêng `loading.tsx`:

```
app/
 └── dashboard/
      └── (overview)/
           ├── loading.tsx
           └── page.tsx
```

→ Skeleton loading chỉ áp dụng cho trang `/dashboard/overview`.

#### 3. **Multiple Root Layouts**

Muốn mỗi phần của site có layout riêng biệt?

Xóa `app/layout.tsx` gốc và thêm layout trong từng nhóm:

```
app/
 ├── (marketing)/layout.tsx
 └── (shop)/layout.tsx
```

→ Mỗi phần có `<html>` và `<body>` riêng —
phù hợp khi bạn cần **UI hoàn toàn khác nhau** (ví dụ: phần bán hàng và phần landing page).

---

## 📦 Thư mục `src` (tuỳ chọn)

Bạn có thể đặt toàn bộ mã nguồn (bao gồm `app/`) trong `src/`
để tách biệt **mã ứng dụng** và **file cấu hình ở root**.

Ví dụ:

```
project/
 ├── src/
 │    ├── app/
 │    ├── components/
 │    └── lib/
 ├── package.json
 ├── next.config.js
 └── tsconfig.json
```

---

## 💡 Chiến lược tổ chức dự án (Examples & Best Practices)

Tùy vào quy mô và đội nhóm, có thể chọn 1 trong 3 chiến lược sau:

### 1. **Lưu file ngoài `app/`**

Tách riêng code chia sẻ (components, lib, hooks...) ở ngoài `app`.

```
project/
 ├── app/
 ├── components/
 ├── lib/
 ├── styles/
 └── utils/
```

### 2. **Lưu file trong `app/`**

Đặt toàn bộ code trong `app`, dùng như monorepo nhỏ.

```
app/
 ├── components/
 ├── hooks/
 ├── lib/
 └── (routes)/
```

### 3. **Chia theo tính năng (feature-based)**

Mỗi route có thư mục riêng chứa tất cả logic liên quan.

```
app/
 ├── dashboard/
 │    ├── page.tsx
 │    ├── chart.tsx
 │    ├── lib/
 │    └── hooks/
 └── settings/
      ├── page.tsx
      └── form.tsx
```

---

✅ **Tổng kết phần này:**

* Hiểu **cấu trúc file & thư mục tiêu chuẩn** trong Next.js
* Biết cách **tổ chức route, layout, group và private folders**
* Nắm **chiến lược tổ chức dự án linh hoạt** theo team hoặc quy mô sản phẩm

---

# 📦 Phần 3: Layouts và Pages



## 🧭 1. Tổng quan về Routing trong Next.js

Next.js sử dụng **file-system based routing** — tức là:

> Cấu trúc folder/file trong thư mục `app/` chính là cấu trúc URL của ứng dụng.

Ví dụ:

```
app/
 ┣ page.tsx              → route "/"
 ┣ about/
 ┃ ┗ page.tsx            → route "/about"
 ┣ blog/
 ┃ ┣ page.tsx            → route "/blog"
 ┃ ┗ [slug]/
 ┃   ┗ page.tsx          → route "/blog/:slug"
```

---

## 🧩 2. Tạo Page cơ bản

👉 Mỗi file `page.tsx` tương ứng với **một route**.
Bắt buộc phải `export default` một React component.

**Ví dụ:**

```tsx
// app/page.tsx
export default function Page() {
  return <h1>Hello Next.js!</h1>
}
```

Khi chạy `npm run dev`, bạn có thể truy cập tại `http://localhost:3000`.

---

## 🧱 3. Layout – Giao diện khung dùng chung

**Layout** là nơi định nghĩa phần UI được **dùng chung giữa nhiều trang**, ví dụ: Header, Footer, Sidebar, Navigation, v.v.

### Cách tạo layout

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header>My Website</header>
        <main>{children}</main>
        <footer>© 2025</footer>
      </body>
    </html>
  )
}
```

* Đây gọi là **Root Layout**, bắt buộc phải có `<html>` và `<body>`.
* Mọi `page.tsx` bên trong `app/` đều nằm trong `children` của layout này.

---

## 🧭 4. Nested Route (Route lồng nhau)

Để tạo route con, chỉ cần **tạo folder con trong `app/`**.

**Ví dụ:**

```
app/
 ┣ layout.tsx
 ┣ blog/
 ┃ ┗ page.tsx
```

`/blog` sẽ được render với UI:

```tsx
<html>
 <body>
   <header>My Website</header>
   <main>
     <ul>Blog content...</ul>
   </main>
   <footer>© 2025</footer>
 </body>
</html>
```

> Root layout luôn **bao quanh toàn bộ route con**.

---

## 🧩 5. Nested Layout (Layout lồng nhau)

Bạn có thể đặt `layout.tsx` trong từng route để thêm “khung riêng” cho từng phần.

**Ví dụ:**

```
app/
 ┣ layout.tsx
 ┣ blog/
 ┃ ┣ layout.tsx
 ┃ ┗ page.tsx
```

```tsx
// app/blog/layout.tsx
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="blog-section">
      <aside>Blog Sidebar</aside>
      <div>{children}</div>
    </section>
  )
}
```

Khi user vào `/blog`, UI sẽ lồng như sau:

```
RootLayout → BlogLayout → Blog Page
```

---

## 🔄 6. Dynamic Routes – Route động

Khi bạn muốn tạo trang theo dữ liệu (ví dụ: `/blog/:slug`), chỉ cần **bọc tên folder trong []**:

```
app/blog/[slug]/page.tsx
```

```tsx
// app/blog/[slug]/page.tsx
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <h1>Blog Post: {slug}</h1>
}
```

Khi truy cập `/blog/hello-world`, Next.js sẽ tự inject `{ slug: 'hello-world' }` vào `params`.

---

## 🔍 7. Search Params (Query String)

Khi cần lấy dữ liệu từ query string (ví dụ `/blog?tag=react`):

```tsx
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const filters = (await searchParams).filters
}
```

> `searchParams` giúp page render **dynamically** (có request thật để lấy query).

Nếu bạn chỉ dùng query trên client (ví dụ filter local list), hãy dùng hook:

```tsx
import { useSearchParams } from 'next/navigation'

const params = useSearchParams()
const tag = params.get('tag')
```

---

## 🔗 8. Liên kết giữa các trang

Dùng `<Link>` thay vì `<a>` để có **client-side navigation** + **prefetching**.

```tsx
import Link from 'next/link'

export default function PostList({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

---

## 🧰 9. Route Props Helpers (Next.js 15+)

Khi chạy `next dev` hoặc `next build`, Next.js tự sinh **type helpers**:

```tsx
// PageProps<'/blog/[slug]'>
// LayoutProps<'/dashboard'>
```

Ví dụ:

```tsx
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  return <h1>Post: {slug}</h1>
}
```

Không cần import — Next.js tự sinh types toàn cục.

---

## 📦 Tổng kết:

| Thành phần     | Mục đích                        | Ghi nhớ                                  |
| -------------- | ------------------------------- | ---------------------------------------- |
| `layout.tsx`   | Giao diện bao quanh nhiều trang | Giữ state, không reload khi chuyển trang |
| `page.tsx`     | Trang giao diện thực tế         | Mỗi route có 1 page                      |
| `[slug]/`      | Route động                      | Tạo trang từ dữ liệu                     |
| `searchParams` | Query string trong URL          | Tự động dynamic render                   |
| `<Link>`       | Navigation client-side          | Tăng tốc + prefetch                      |

---
## 🧭 Phần 4: Liên Kết và Điều Hướng trong Next.js

Trong Next.js, các route được **render trên server theo mặc định**. Điều này có nghĩa là client phải chờ phản hồi từ server trước khi hiển thị route mới. Tuy nhiên, Next.js được trang bị sẵn các tính năng mạnh mẽ như **prefetching**, **streaming**, và **chuyển trang phía client** — giúp việc điều hướng trở nên nhanh chóng và mượt mà.

Tài liệu này giải thích cách **navigation hoạt động trong Next.js**, và cách bạn có thể **tối ưu hoá trải nghiệm chuyển trang**, đặc biệt với **route động** và **mạng chậm**.

---

### ⚙️ Cách Hoạt Động Của Navigation

Để hiểu rõ cơ chế điều hướng trong Next.js, bạn cần nắm các khái niệm sau:

* **Server Rendering**
* **Prefetching**
* **Streaming**
* **Client-side transitions**

---

### 🖥️ Server Rendering

Trong Next.js, **Layouts** và **Pages** là **React Server Components** theo mặc định. Khi người dùng truy cập hoặc chuyển trang, **Server Component Payload** được tạo ra ở phía server rồi mới gửi xuống client.

Có hai loại render trên server:

1. **Static Rendering (Prerendering)** – thực hiện tại thời điểm build hoặc revalidate, và được cache lại.
2. **Dynamic Rendering** – thực hiện ngay khi có request từ client.

Nhược điểm là: client phải **chờ phản hồi server**, khiến trang mới hiển thị chậm.
Next.js khắc phục bằng cách **prefetch trước các route khả năng cao sẽ được truy cập**, và **thực hiện chuyển trang phía client**.

> 💡 Ghi nhớ: HTML cũng được tạo ra sẵn cho lần truy cập đầu tiên.

---

### ⚡ Prefetching

**Prefetching** là quá trình **tải trước dữ liệu route trong nền** trước khi người dùng click vào link.
Khi người dùng nhấn link, dữ liệu đã sẵn sàng → chuyển trang gần như **tức thì**.

Next.js tự động **prefetch** các route được liên kết bằng `<Link>` khi chúng **xuất hiện trong viewport**.

```tsx
import Link from 'next/link'
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <nav>
          {/* Prefetch tự động khi link xuất hiện hoặc được hover */}
          <Link href="/blog">Blog</Link>
          {/* Không prefetch */}
          <a href="/contact">Contact</a>
        </nav>
        {children}
      </body>
    </html>
  )
}
```

**Mức độ prefetch phụ thuộc loại route:**

* 🟢 **Static Route** → prefetch toàn bộ.
* 🟡 **Dynamic Route** → bỏ qua hoặc chỉ prefetch một phần (nếu có `loading.tsx`).

Việc **giới hạn prefetch** cho route động giúp **giảm tải server**, nhưng nếu người dùng phải chờ phản hồi server → có thể cảm giác **ứng dụng bị đơ**.

---

### 🌊 Streaming

**Streaming** cho phép server **gửi từng phần nội dung** của route động xuống client **ngay khi sẵn sàng**, thay vì chờ render toàn bộ.
Nhờ đó, người dùng **nhìn thấy nội dung sớm hơn**, dù một số phần vẫn đang tải.

#### 📄 Ví dụ: sử dụng `loading.tsx`

Tạo file `loading.tsx` trong thư mục route:

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <LoadingSkeleton />
}
```

Next.js sẽ **tự động bao bọc** nội dung trong `page.tsx` bằng `<Suspense>`.
Trong lúc tải dữ liệu, `LoadingSkeleton` hiển thị tạm thời, sau đó được thay thế bằng nội dung thật.

> 💡 Bạn có thể dùng `<Suspense>` để hiển thị UI tải cho cả component con.

**Lợi ích của `loading.tsx`:**

* Điều hướng **ngay lập tức**, hiển thị **phản hồi trực quan**.
* **Layout chia sẻ** vẫn tương tác được.
* Cải thiện **Core Web Vitals**: TTFB, FCP, TTI.

---

### 🚀 Client-side Transitions

Bình thường, chuyển route server-side sẽ tải lại toàn bộ trang, **mất state**, **reset scroll**, và **gián đoạn tương tác**.

Next.js khắc phục điều này bằng **chuyển trang phía client** thông qua `<Link>`:

* Giữ nguyên **layouts** và **UI chung**.
* Thay nội dung hiện tại bằng **loading state** hoặc **trang mới đã prefetch**.

Kết hợp **prefetching + streaming + client-side transition**, ta có trải nghiệm **mượt như ứng dụng client render**.

---

### 🧩 Các Nguyên Nhân Khiến Chuyển Trang Chậm

1. **Route động không có `loading.tsx`**
   → Client phải chờ server trả về toàn bộ dữ liệu.
   ✅ Giải pháp: thêm `loading.tsx` để prefetch một phần và hiển thị skeleton.

2. **Thiếu `generateStaticParams`**
   → Route đáng ra có thể prerender nhưng bị render động.
   ✅ Giải pháp: thêm `generateStaticParams` để prerender.

```tsx
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())
  return posts.map((post) => ({ slug: post.slug }))
}
```

3. **Mạng chậm hoặc không ổn định**
   → Prefetch chưa hoàn tất khi người dùng click.
   ✅ Giải pháp: thêm **loading indicator** bằng `useLinkStatus()`.

```tsx
'use client'
import { useLinkStatus } from 'next/link'

export default function LoadingIndicator() {
  const { pending } = useLinkStatus()
  return pending ? <div role="status" aria-label="Loading" className="spinner" /> : null
}
```

4. **Hydration chưa hoàn tất**
   → `<Link>` cần được hydrate trước khi prefetch.
   ✅ Giải pháp:

   * Giảm **bundle size** bằng plugin `@next/bundle-analyzer`.
   * Di chuyển logic sang server.

---

### 🔧 Tắt hoặc Giới Hạn Prefetch

Tắt hoàn toàn:

```tsx
<Link prefetch={false} href="/blog">
  Blog
</Link>
```

Hoặc chỉ **prefetch khi hover** để tiết kiệm tài nguyên:

```tsx
'use client'
import Link from 'next/link'
import { useState } from 'react'

function HoverPrefetchLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [active, setActive] = useState(false)

  return (
    <Link href={href} prefetch={active ? null : false} onMouseEnter={() => setActive(true)}>
      {children}
    </Link>
  )
}
```

---

### 🧭 Sử Dụng Native History API

Next.js hỗ trợ **tích hợp `window.history.pushState` và `replaceState`** mà không reload trang, đồng bộ với **Router của Next.js** (`usePathname`, `useSearchParams`).

#### Ví dụ 1: Sắp xếp sản phẩm (pushState)

```tsx
'use client'
import { useSearchParams } from 'next/navigation'

export default function SortProducts() {
  const searchParams = useSearchParams()

  function updateSorting(sortOrder: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortOrder)
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  return (
    <>
      <button onClick={() => updateSorting('asc')}>Sort Ascending</button>
      <button onClick={() => updateSorting('desc')}>Sort Descending</button>
    </>
  )
}
```

#### Ví dụ 2: Đổi ngôn ngữ (replaceState)

```tsx
'use client'
import { usePathname } from 'next/navigation'

export function LocaleSwitcher() {
  const pathname = usePathname()

  function switchLocale(locale: string) {
    const newPath = `/${locale}${pathname}`
    window.history.replaceState(null, '', newPath)
  }

  return (
    <>
      <button onClick={() => switchLocale('en')}>English</button>
      <button onClick={() => switchLocale('fr')}>French</button>
    </>
  )
}
```

---

### 🔗 Bước Tiếp Theo

* **[Link Component]** – Kích hoạt điều hướng nhanh bằng `next/link`.
* **[loading.js API]** – Tham khảo chi tiết cách hoạt động của `loading.tsx`.
* **[Prefetching Config]** – Cách tùy chỉnh cơ chế prefetch trong Next.js.

---
### 🧩 **Phần 5: Server và Client Components trong Next.js**

Trong Next.js, **Layouts** và **Pages** là **Server Components** mặc định. Điều này cho phép bạn fetch dữ liệu và render một phần UI **trực tiếp trên server**, có thể cache kết quả và stream dần về client.
Khi cần tương tác (interactivity) hoặc truy cập **browser APIs**, bạn sẽ dùng **Client Components** để thêm các chức năng động.

---

## 🎯 Khi nào dùng Server hoặc Client Components?

Hai môi trường **client** và **server** có khả năng khác nhau. Việc tách biệt giúp bạn tận dụng lợi thế từng bên:

### 🔹 **Dùng Client Components khi bạn cần:**

* Quản lý **state** và **event handlers** như `onClick`, `onChange`.
* Sử dụng **lifecycle hooks** (`useEffect`, `useLayoutEffect`...).
* Gọi các **browser APIs** như `localStorage`, `window`, `Navigator.geolocation`.
* Xây dựng **custom hooks** cho logic phía client.

### 🔹 **Dùng Server Components khi bạn cần:**

* Fetch dữ liệu từ database hoặc API **gần nguồn** hơn (nhanh, an toàn hơn).
* Dùng **API keys hoặc token bí mật** mà không để lộ ra client.
* **Giảm kích thước JS bundle** gửi đến trình duyệt.
* **Tăng tốc độ hiển thị đầu tiên (FCP)** và stream nội dung dần ra client.

---

## 🧠 Ví dụ tổng quan

```tsx
// app/[id]/page.tsx – Server Component
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getPost(id)

  return (
    <div>
      <main>
        <h1>{post.title}</h1>
        <LikeButton likes={post.likes} />
      </main>
    </div>
  )
}
```

```tsx
// app/ui/like-button.tsx – Client Component
'use client'
import { useState } from 'react'

export default function LikeButton({ likes }: { likes: number }) {
  const [count, setCount] = useState(likes)
  return <button onClick={() => setCount(count + 1)}>👍 {count}</button>
}
```

📍 `Page` (Server Component) fetch dữ liệu bài viết, sau đó truyền props cho `LikeButton` (Client Component) — giúp tách biệt render dữ liệu (server) và logic tương tác (client).

---

## ⚙️ Cơ chế hoạt động

### 🖥️ **Trên Server:**

* Next.js sử dụng **React Server Component APIs** để tách công việc render theo từng **route segment** (layout/page).
* Kết quả render được đóng gói thành **React Server Component Payload (RSC Payload)** — một định dạng nhị phân nhẹ chứa:

  * Kết quả của Server Components.
  * Vị trí và tham chiếu đến các Client Components.
  * Props được truyền từ server → client.

### 🌐 **Trên Client (lần tải đầu):**

* HTML được render sẵn để hiển thị nhanh (non-interactive).
* React dùng RSC Payload để **đồng bộ cây component** giữa client và server.
* Sau đó, **hydration** diễn ra — gắn các event handlers để biến HTML tĩnh thành ứng dụng tương tác.

> 💡 **Hydration** = quá trình React “thổi hồn” vào HTML để trở nên sống động.

---

## 🔁 **Navigations tiếp theo**

Khi người dùng điều hướng giữa các trang:

* RSC Payload được **prefetch và cache**, giúp điều hướng gần như tức thì.
* Client Components được render hoàn toàn phía client mà không cần server HTML.

---

## 🧩 **Tạo Client Component**

Đặt dòng `'use client'` ở đầu file để đánh dấu đây là component chạy phía client.

```tsx
// app/ui/counter.tsx
'use client'
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>{count} likes</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
```

Mọi component con của file có `'use client'` cũng tự động là **Client Component**, không cần khai báo lại.

---

## 📉 **Giảm kích thước JS bundle**

Hãy chỉ dùng `'use client'` cho **thành phần thật sự cần tương tác**.

Ví dụ:

```tsx
// app/layout.tsx
import Search from './search'   // Client
import Logo from './logo'       // Server

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <nav>
      <Logo />
      <Search />
    </nav>
  )
}
```

---

## 🔗 **Truyền dữ liệu giữa Server → Client**

Props được truyền như bình thường:

```tsx
// Server
return <LikeButton likes={post.likes} />
```

Props phải **serializable** (có thể được React chuyển hóa thành JSON).

---

## 🧱 **Kết hợp Server và Client Components**

Bạn có thể lồng Server Component vào Client Component thông qua `children`:

```tsx
// app/ui/modal.tsx
'use client'
export default function Modal({ children }: { children: React.ReactNode }) {
  return <div className="modal">{children}</div>
}
```

```tsx
// app/page.tsx
import Modal from './ui/modal'
import Cart from './ui/cart'

export default function Page() {
  return (
    <Modal>
      <Cart /> {/* Server Component */}
    </Modal>
  )
}
```

---

## 🌈 **React Context trong Client Components**

Server Components không hỗ trợ React Context.
Bạn cần bọc nó trong một Client Component:

```tsx
// app/theme-provider.tsx
'use client'
import { createContext } from 'react'
export const ThemeContext = createContext({})

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
}
```

```tsx
// app/layout.tsx
import ThemeProvider from './theme-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

📌 *Lưu ý:* Nên đặt Provider **càng sâu càng tốt**, chỉ bao quanh phần cần thiết để tối ưu hiệu suất.

---

## 🧱 **Third-party Components**

Nếu một thư viện UI (như carousel, map, chart, v.v.) yêu cầu logic client mà không khai báo `'use client'`, hãy **bọc nó** trong một component riêng:

```tsx
// app/carousel.tsx
'use client'
import { Carousel } from 'acme-carousel'
export default Carousel
```

Giờ có thể dùng trực tiếp trong Server Component mà không lỗi.

---

## 🛡️ **Tránh rò rỉ biến môi trường (Environment Poisoning)**

Hàm có chứa API_KEY hoặc token **chỉ nên dùng trên server**:

```tsx
// lib/data.ts
import 'server-only'

export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: { authorization: process.env.API_KEY },
  })
  return res.json()
}
```

Nếu bạn cố import vào Client Component, **Next.js sẽ cảnh báo build-time error**.
Chỉ biến môi trường có prefix `NEXT_PUBLIC_` mới được phép xuất hiện ở client.

Cài đặt gói hỗ trợ:

```bash
pnpm add server-only
```

---

## 🚀 **Tổng kết**

| Tình huống                     | Component nên dùng   |
| ------------------------------ | -------------------- |
| Fetch API, DB, dùng secrets    | **Server Component** |
| onClick, useEffect, window API | **Client Component** |
| Tối ưu tốc độ tải đầu          | **Server Component** |
| Tương tác người dùng           | **Client Component** |

---

## 🔜 **Bước tiếp theo**

* 🔍 [use client](https://nextjs.org/docs/app/building-your-application/rendering/client-components) — cách dùng chỉ thị `use client` trong Next.js.
* 📘 [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components) — hiểu sâu về cách render và stream trên server.
* 🧠 [Hybrid Rendering Patterns] — kết hợp tối ưu giữa hai loại component.

---
## 🧩 Phần 6: **Partial Prerendering (PPR)**

> ⚠️ **Tính năng thử nghiệm (experimental)**: Partial Prerendering hiện vẫn đang trong giai đoạn thử nghiệm và có thể thay đổi. **Không khuyến khích** sử dụng cho môi trường production. Tuy nhiên, bạn có thể thử nghiệm và đóng góp ý kiến trên GitHub của Next.js.

---

### 🔍 Khái niệm

**Partial Prerendering (PPR)** là **chiến lược kết hợp giữa Static Rendering và Dynamic Rendering** trong cùng một route.
Điều này giúp **tăng tốc độ hiển thị ban đầu (initial load)** của trang nhờ phần nội dung tĩnh được prerender sẵn, trong khi vẫn hỗ trợ **dữ liệu động, cá nhân hoá** cho người dùng.

Ví dụ:
Một trang sản phẩm có thể prerender **phần thông tin sản phẩm và thanh điều hướng** (static), còn **giỏ hàng và sản phẩm gợi ý** sẽ được tải động (dynamic) sau khi người dùng mở trang.

---

### ⚙️ Cách hoạt động của PPR

Khi người dùng truy cập một route:

1. **Server gửi xuống một “shell” tĩnh** (layout, khung trang, nội dung không phụ thuộc request).
2. **Shell này có các “lỗ trống” (holes)** — là nơi chứa nội dung động chưa tải.
3. **Phần nội dung động** sẽ được **stream (truyền)** song song và **hiển thị dần** khi sẵn sàng.

Kết quả: Người dùng thấy phần tĩnh gần như **ngay lập tức**, trong khi dữ liệu động vẫn **cập nhật mượt mà** phía sau.

---

### 🧱 So sánh với các chiến lược render khác

#### 🧊 Static Rendering

* HTML được **tạo sẵn từ trước** (build time hoặc revalidation).
* Dữ liệu không thay đổi theo request.
* Kết quả được **cache và chia sẻ** cho nhiều người dùng.

➡️ Trong PPR: phần tĩnh (layout, UI chung, header...) sẽ được prerender theo cơ chế này.

#### 🔥 Dynamic Rendering

* HTML được **tạo mỗi lần request**, phục vụ **nội dung động hoặc cá nhân hóa**.
* Component sẽ bị coi là “dynamic” nếu sử dụng:

  * `cookies`
  * `headers`
  * `connection`
  * `draftMode`
  * `searchParams`
  * `unstable_noStore`
  * `fetch({ cache: 'no-store' })`

➡️ Nếu component sử dụng những API này, Next.js sẽ báo lỗi tại build-time, trừ khi bạn **bọc nó bằng `<Suspense>`** để defer (hoãn render) đến runtime.

---

### ⏳ **Suspense** trong Partial Prerendering

`React.Suspense` giúp **hoãn render** một phần UI cho đến khi điều kiện nào đó thoả mãn (ví dụ: dữ liệu tải xong).
Trong PPR, Suspense được dùng để **đánh dấu ranh giới động** trong cây component.

Ví dụ:

```tsx
import { Suspense } from 'react'
import StaticComponent from './StaticComponent'
import DynamicComponent from './DynamicComponent'
import Fallback from './Fallback'

export const experimental_ppr = true

export default function Page() {
  return (
    <>
      <StaticComponent />
      <Suspense fallback={<Fallback />}>
        <DynamicComponent />
      </Suspense>
    </>
  )
}
```

🧠 **Giải thích:**

* `StaticComponent`: được prerender tĩnh.
* `DynamicComponent`: sẽ chỉ được render khi runtime (request-time).
* `Fallback`: giao diện tạm hiển thị trong lúc `DynamicComponent` đang tải.

---

### 🌊 **Streaming**

Streaming cho phép **chia nhỏ** nội dung route thành nhiều phần và **truyền dần về client** khi sẵn sàng, giúp người dùng **thấy trang nhanh hơn**.

PPR tận dụng cơ chế này để **stream các phần động trong `<Suspense>` song song**, trong khi phần tĩnh đã có sẵn.
Tất cả được gói trong **một yêu cầu HTTP duy nhất**, giúp:
✅ Giảm độ trễ mạng
✅ Cải thiện hiệu suất tổng thể

---

### 🔧 **Kích hoạt Partial Prerendering**

Trong `next.config.ts`, thêm cấu hình:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental',
  },
}

export default nextConfig
```

* `'incremental'`: cho phép bạn bật PPR **từng route cụ thể**.

Ví dụ trong `/app/dashboard/layout.tsx`:

```tsx
export const experimental_ppr = true

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

> 💡 Ghi nhớ:
>
> * `experimental_ppr` áp dụng cho **tất cả các layout và page con** bên trong route đó.
> * Nếu muốn **tắt PPR cho một phần con**, đặt `experimental_ppr = false`.

---

### 🧩 **Ví dụ thực tế**

#### 1. Dynamic APIs

Component sử dụng API động (ví dụ `cookies`) sẽ **bị render động**, trong khi các phần khác vẫn prerender.

```tsx
// app/user.tsx
import { cookies } from 'next/headers'

export async function User() {
  const session = (await cookies()).get('session')?.value
  return '...'
}
```

```tsx
// app/page.tsx
import { Suspense } from 'react'
import { User, AvatarSkeleton } from './user'

export const experimental_ppr = true

export default function Page() {
  return (
    <section>
      <h1>This will be prerendered</h1>
      <Suspense fallback={<AvatarSkeleton />}>
        <User />
      </Suspense>
    </section>
  )
}
```

---

#### 2. Passing dynamic props

Một component chỉ trở nên “dynamic” khi giá trị **được truy cập**, chứ không phải khi **được truyền vào**.

```tsx
// app/page.tsx
import { Table, TableSkeleton } from './table'
import { Suspense } from 'react'

export default function Page({ searchParams }: { searchParams: Promise<{ sort: string }> }) {
  return (
    <section>
      <h1>This will be prerendered</h1>
      <Suspense fallback={<TableSkeleton />}>
        <Table searchParams={searchParams} />
      </Suspense>
    </section>
  )
}
```

```tsx
// app/table.tsx
export async function Table({ searchParams }: { searchParams: Promise<{ sort: string }> }) {
  const sort = (await searchParams).sort === 'true'
  return '...'
}
```

➡️ Ở đây, `<Page>` vẫn prerender tĩnh, còn `<Table>` trở thành động khi `searchParams` được truy cập.

---

### 📘 **Tóm tắt lợi ích của Partial Prerendering**

✅ Kết hợp **hiệu suất cao của static rendering** và **tính linh hoạt của dynamic rendering**
✅ Giúp **First Contentful Paint (FCP)** nhanh hơn
✅ **Giảm thời gian chờ tải toàn trang**
✅ Cho phép **stream nội dung động song song**
✅ Hỗ trợ tốt hơn cho các trang có phần dữ liệu cá nhân hóa

---

### 🚀 **Bước tiếp theo**

Tìm hiểu thêm:

* 🔧 [`ppr`](https://nextjs.org/docs/app/api-reference/next-config-js/ppr): Cấu hình bật Partial Prerendering trong Next.js
* 📺 Xem video giới thiệu: **"Why PPR and how it works" (10 phút trên YouTube)**

---

## 🧩 **Phần 7: Fetching Data (Lấy dữ liệu trong Next.js)**

Trang này sẽ hướng dẫn bạn cách **lấy dữ liệu trong Server Components và Client Components**, cũng như **stream** (truyền dữ liệu theo luồng) các component phụ thuộc vào dữ liệu đó.

---

### 🔹 1. Fetching data trong Server Components

Trong Server Components, bạn có thể lấy dữ liệu bằng:

* **Fetch API**
* **ORM hoặc Database Client (ví dụ: Prisma, Drizzle, Knex, v.v.)**

---

#### 🧠 **Với Fetch API**

Khi dùng Fetch API, hãy biến component thành **hàm async** và dùng `await fetch()` để gọi dữ liệu.

**Ví dụ:**

```tsx
// app/blog/page.tsx

export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts = await data.json()

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

**Lưu ý:**

* Kết quả của `fetch()` **không được cache mặc định**.
  Tuy nhiên, Next.js sẽ **prerender route** và lưu kết quả để tăng hiệu suất.
  Nếu bạn muốn **tắt cache**, dùng:

  ```js
  fetch(url, { cache: 'no-store' })
  ```
* Trong môi trường dev, bạn có thể **log các lệnh fetch** để debug dễ hơn.

---

#### 🧠 **Với ORM hoặc Database**

Vì Server Components chạy trên **server**, bạn có thể gọi trực tiếp **database** hoặc **ORM** một cách an toàn.

**Ví dụ:**

```tsx
// app/blog/page.tsx

import { db, posts } from '@/lib/db'

export default async function Page() {
  const allPosts = await db.select().from(posts)
  
  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

---

### 🔹 2. Fetching data trong Client Components

Có hai cách chính để lấy dữ liệu trong Client Components:

1. **Dùng React’s `use()` hook** (React 19+)
2. **Dùng thư viện bên ngoài** như **SWR** hoặc **React Query**

---

#### 🧠 **Streaming với React’s `use()` hook**

Bạn có thể stream dữ liệu từ server sang client bằng cách:

1. Gọi dữ liệu **ở Server Component**
2. Truyền **Promise** đó xuống Client Component làm prop

**Ví dụ:**

```tsx
// app/blog/page.tsx

import Posts from '@/app/ui/posts'
import { Suspense } from 'react'

export default function Page() {
  const posts = getPosts() // không await ở đây

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Posts posts={posts} />
    </Suspense>
  )
}
```

Client Component:

```tsx
// app/ui/posts.tsx

'use client'
import { use } from 'react'

export default function Posts({ posts }: { posts: Promise<{ id: string; title: string }[]> }) {
  const allPosts = use(posts)

  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

**Giải thích:**

* `<Suspense>` hiển thị UI fallback (“Loading…”) trong khi promise đang chờ.
* Khi dữ liệu sẵn sàng, component thật sẽ được hiển thị.

---

#### 🧠 **Dùng thư viện bên ngoài (SWR / React Query)**

Ví dụ với **SWR**:

```tsx
'use client'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function BlogPage() {
  const { data, error, isLoading } = useSWR('https://api.vercel.app/blog', fetcher)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {data.map((post: { id: string; title: string }) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

SWR và React Query hỗ trợ:

* Caching dữ liệu
* Revalidation (cập nhật lại dữ liệu)
* Streaming

---

### 🔹 3. Deduplicate requests & Cache dữ liệu

Để tránh **gửi trùng nhiều request fetch**, Next.js hỗ trợ **request memoization**:

* Các request `GET` hoặc `HEAD` có **URL và option giống nhau** sẽ tự động được gộp.
* Nếu không muốn gộp, truyền vào **AbortSignal**.

Hoặc bạn có thể dùng **Data Cache** của Next.js:

```js
fetch(url, { cache: 'force-cache' })
```

Nếu bạn không dùng `fetch()` mà truy vấn database trực tiếp, bạn có thể **cache function** bằng React:

```ts
// app/lib/data.ts
import { cache } from 'react'
import { db, posts, eq } from '@/lib/db'

export const getPost = cache(async (id: string) => {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, parseInt(id)),
  })
})
```

---

### 🔹 4. Streaming dữ liệu (Luồng hoá khi render)

Khi bạn dùng `async/await` trong Server Components, Next.js sẽ **render động** cho mỗi request người dùng.
Nếu dữ liệu bị chậm → cả trang bị block.

Giải pháp: **Streaming HTML từng phần** giúp:

* Cải thiện thời gian load ban đầu.
* Tăng UX bằng cách hiển thị nội dung dần.

#### ✅ Có 2 cách triển khai:

1. **Tạo `loading.js` trong thư mục page**

```tsx
// app/blog/loading.tsx
export default function Loading() {
  return <div>Loading...</div>
}
```

Trang sẽ hiển thị layout + loading state trước, sau đó mới render nội dung thật.

2. **Dùng `<Suspense>` thủ công**

```tsx
import { Suspense } from 'react'
import BlogList from '@/components/BlogList'
import BlogListSkeleton from '@/components/BlogListSkeleton'

export default function BlogPage() {
  return (
    <div>
      <header>
        <h1>Welcome to the Blog</h1>
        <p>Read the latest posts below.</p>
      </header>

      <main>
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogList />
        </Suspense>
      </main>
    </div>
  )
}
```

💡 **Tip:**
Thiết kế `Loading UI` sao cho **có ý nghĩa**, giúp người dùng hiểu ứng dụng đang phản hồi.
Ví dụ: dùng **skeleton**, **spinner**, hoặc **ảnh bìa/tên bài viết mẫu**.

---

### 🔹 5. Sequential & Parallel Fetching

#### ⏳ **Sequential fetching** (tuần tự)

Các request phụ thuộc lẫn nhau, gọi nối tiếp (chậm hơn).

```tsx
const artist = await getArtist(username)
const playlists = await getArtistPlaylists(artist.id)
```

Nên bọc `<Suspense>` để không block toàn route.

#### ⚡ **Parallel fetching** (song song)

Các request được khởi tạo cùng lúc → nhanh hơn.

```tsx
const artistData = getArtist(username)
const albumsData = getAlbums(username)

const [artist, albums] = await Promise.all([artistData, albumsData])
```

Nếu một request lỗi, toàn bộ `Promise.all` sẽ fail → dùng `Promise.allSettled` nếu cần tránh crash.

---

### 🔹 6. Preloading Data (Tải trước dữ liệu)

Bạn có thể preload dữ liệu bằng cách gọi hàm trước khi component render.

```tsx
export const preload = (id: string) => {
  void getItem(id)
}
```

Hoặc cache utility bằng React:

```tsx
import { cache } from 'react'
import 'server-only'
import { getItem } from '@/lib/data'

export const getItemCached = cache(async (id: string) => {
  return await getItem(id)
})
```

---

### 📚 **Tài liệu liên quan**

* [fetch() API Reference](https://nextjs.org/docs/app/api-reference/functions/fetch)
* [loading.js Reference](https://nextjs.org/docs/app/api-reference/file-conventions/loading)
* [Logging & Debugging Fetch Calls](https://nextjs.org/docs/app/api-reference/next-config-js/logging)
* [Data Security & Best Practices](https://nextjs.org/docs/app/building-your-application/data-fetching/data-security)

---

👉 **Kết luận:**
Phần *Fetching Data* là nền tảng của Next.js App Router.
Nó giúp bạn:

* Kết hợp sức mạnh **Server Rendering + Client Hydration**
* Tối ưu **hiệu suất và UX**
* Dễ dàng quản lý dữ liệu với **Streaming, Suspense, Cache, Preload**

---
## 🧩 Phần 8: **Updating Data**
Phần này rất quan trọng, vì nó trình bày **cách cập nhật dữ liệu trong Next.js bằng Server Actions** — cơ chế thay thế cho API Routes hoặc client-side mutation truyền thống. Dưới đây là bản tổng hợp chi tiết, chia thành **kiến thức – cơ chế hoạt động – ví dụ thực tế – best practices**.

---


## 📚 Tham khảo API (API Reference)

Tìm hiểu thêm về các tính năng được nhắc đến trong phần này bằng cách đọc tài liệu chi tiết của từng hàm dưới đây.

---

### 🌀 `revalidatePath(path, type?)`

**👉 Mục đích:**
Buộc Next.js **tái tạo lại (revalidate)** cache của một route cụ thể, giúp dữ liệu hiển thị luôn mới nhất sau khi bạn cập nhật (tạo, xoá, chỉnh sửa).

**Cú pháp:**

```ts
import { revalidatePath } from 'next/cache'

revalidatePath('/dashboard')
```

**Giải thích:**

* Khi gọi, tất cả dữ liệu hoặc component trong route `/dashboard` sẽ được render lại lần kế tiếp người dùng truy cập.
* Dùng trong **Server Actions** hoặc **Route Handlers**.
* Tuỳ chọn `type` có thể là `'page'` hoặc `'layout'`, mặc định là `'page'`.

**Ví dụ:**

```ts
'use server'

import { revalidatePath } from 'next/cache'

export async function addUser(formData: FormData) {
  const name = formData.get('name')
  await db.user.create({ data: { name } })
  revalidatePath('/users') // làm mới dữ liệu danh sách user
}
```

---

### 🏷️ `revalidateTag(tag)`

**👉 Mục đích:**
Giúp **tái tạo cache dựa theo “tag”** (thẻ), thay vì theo đường dẫn cụ thể.
Điều này cho phép **revalidate nhiều route cùng lúc**, nếu chúng có cùng tag cache.

**Cú pháp:**

```ts
import { revalidateTag } from 'next/cache'

revalidateTag('posts')
```

**Cách hoạt động:**

1. Khi bạn fetch dữ liệu, bạn có thể gắn tag:

   ```ts
   fetch('https://api.example.com/posts', { next: { tags: ['posts'] } })
   ```
2. Sau đó, nếu bạn cập nhật dữ liệu bài viết, chỉ cần gọi:

   ```ts
   revalidateTag('posts')
   ```

   → Toàn bộ các component hoặc route nào cache bằng tag `'posts'` sẽ được render lại với dữ liệu mới.

**Ví dụ thực tế:**

```ts
'use server'
import { revalidateTag } from 'next/cache'

export async function createPost(formData: FormData) {
  await db.post.create({ data: { title: formData.get('title') } })
  revalidateTag('posts') // cập nhật tất cả nơi hiển thị danh sách bài viết
}
```

---

### 🔁 `redirect(url)`

**👉 Mục đích:**
Chuyển hướng người dùng đến một đường dẫn khác từ **Server Action** hoặc **Route Handler**.

**Cú pháp:**

```ts
import { redirect } from 'next/navigation'

redirect('/dashboard')
```

**Giải thích:**

* `redirect()` là **control flow function** — nghĩa là khi được gọi, nó sẽ **ngừng toàn bộ code phía sau**.
* Dùng để chuyển hướng sau khi thao tác xong (ví dụ: tạo user, lưu form, đăng nhập thành công).
* Hoạt động tương tự `return redirect('/path')` trong framework khác, nhưng ở đây là hàm đặc biệt của Next.js.

**Ví dụ:**

```ts
'use server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const username = formData.get('username')
  await db.user.update({ where: { id: 1 }, data: { username } })
  revalidatePath('/profile')
  redirect('/profile/success') // chuyển hướng đến trang thông báo
}
```

---

### 🧠 Tóm tắt nhanh:

| Hàm                       | Mục đích                                   | Khi sử dụng                                             | Ví dụ                                          |
| ------------------------- | ------------------------------------------ | ------------------------------------------------------- | ---------------------------------------------- |
| `revalidatePath('/path')` | Làm mới cache của một route cụ thể         | Khi cập nhật dữ liệu ảnh hưởng đến 1 trang              | Sau khi thêm user → `revalidatePath('/users')` |
| `revalidateTag('tag')`    | Làm mới cache của nhiều route gắn cùng tag | Khi muốn refresh dữ liệu toàn cục (vd: tất cả bài viết) | Sau khi đăng bài → `revalidateTag('posts')`    |
| `redirect('/url')`        | Chuyển hướng người dùng sau thao tác       | Sau khi form submit hoặc login                          | `redirect('/dashboard')`                       |

---

## 🧭 I. Khái niệm cốt lõi: Server Functions / Server Actions

**Server Function** là hàm chạy **trên server**, không bao giờ chạy trên client.
Nó là **hàm async** (bất đồng bộ), và chỉ có thể được gọi qua **POST request**.

➡️ Khi dùng để **thay đổi dữ liệu (update, create, delete)**, ta gọi nó là **Server Action**.

**Cú pháp định nghĩa:**

```ts
'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  const content = formData.get('content')
  // 1️⃣ Cập nhật DB hoặc gọi API
  // 2️⃣ Gọi revalidatePath('/posts') nếu cần refresh dữ liệu cache
}
```

---

## 🧩 II. Cách định nghĩa Server Function

### 1. Trong file riêng (best practice)

```ts
// app/lib/actions.ts
'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  const content = formData.get('content')
  // update DB
}
```

### 2. Inline trong Server Component

```ts
export default function Page() {
  async function createPost(formData: FormData) {
    'use server'
    // update DB
  }

  return <form action={createPost}>...</form>
}
```

👉 Cách này tiện cho demo, nhưng thực tế **nên tách riêng file `actions.ts`** để tái sử dụng và dễ test.

---

## 💡 III. Gọi Server Function từ Client

### 1. Qua `<form>` hoặc `<button>`

```tsx
// app/ui/form.tsx
import { createPost } from '@/app/lib/actions'

export function Form() {
  return (
    <form action={createPost}>
      <input name="title" />
      <input name="content" />
      <button type="submit">Create</button>
    </form>
  )
}
```

* Khi submit, Next.js tự động gửi POST request đến server function.
* `formData` được truyền vào Server Function.

### 2. Gọi từ event handler

```tsx
'use client'
import { incrementLike } from '@/app/lib/actions'
import { useState } from 'react'

export default function LikeButton({ initialLikes }) {
  const [likes, setLikes] = useState(initialLikes)

  return (
    <button
      onClick={async () => {
        const newLikes = await incrementLike()
        setLikes(newLikes)
      }}
    >
      Like ({likes})
    </button>
  )
}
```

---

## 🚀 IV. Quản lý trạng thái tải & phản hồi

### 1. Hiển thị loading/pending state

Dùng **`useActionState` + startTransition**:

```tsx
'use client'
import { useActionState, startTransition } from 'react'
import { createPost } from '@/app/lib/actions'
import { LoadingSpinner } from './LoadingSpinner'

export function Button() {
  const [state, action, pending] = useActionState(createPost, false)

  return (
    <button onClick={() => startTransition(action)}>
      {pending ? <LoadingSpinner /> : 'Create Post'}
    </button>
  )
}
```

### 2. Cập nhật cache & UI sau mutation

```ts
'use server'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  // update DB
  revalidatePath('/posts') // refresh lại route /posts
}
```

---

## 🔀 V. Redirect sau khi cập nhật dữ liệu

Sau khi lưu xong, có thể **chuyển hướng người dùng**:

```ts
'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  // update DB
  revalidatePath('/posts')
  redirect('/posts')
}
```

➡️ Lưu ý: `redirect()` ném ra một control-flow exception → code sau đó **không chạy tiếp**.

---

## 🍪 VI. Làm việc với Cookies trong Server Actions

```ts
'use server'
import { cookies } from 'next/headers'

export async function exampleAction() {
  const cookieStore = await cookies()

  // đọc
  const user = cookieStore.get('user')?.value

  // set
  cookieStore.set('user', 'Tuan')

  // xóa
  cookieStore.delete('user')
}
```

Mỗi khi cookie thay đổi, **Next.js sẽ tự động re-render** lại trang hiện tại và layout liên quan → đảm bảo UI phản ánh dữ liệu mới.

---

## ⚙️ VII. Tự động gọi Server Action trong useEffect

```tsx
'use client'
import { incrementViews } from './actions'
import { useEffect, useState, useTransition } from 'react'

export default function ViewCount({ initialViews }) {
  const [views, setViews] = useState(initialViews)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const updated = await incrementViews()
      setViews(updated)
    })
  }, [])

  return <p>Total Views: {views}</p>
}
```

→ Hữu ích cho auto-tracking: đếm lượt xem, analytics, cập nhật trạng thái khi component mount.

---

## 🧠 VIII. Best Practices

| Tình huống                   | Giải pháp khuyến nghị                                                  |
| ---------------------------- | ---------------------------------------------------------------------- |
| Tạo / xóa / cập nhật dữ liệu | Dùng Server Action (`'use server'`)                                    |
| Cập nhật sau hành động       | Gọi `revalidatePath` hoặc `revalidateTag`                              |
| Cần điều hướng               | Gọi `redirect('/path')`                                                |
| Cập nhật cookie / session    | Dùng API `cookies()`                                                   |
| Gọi từ Client Component      | Import Server Action và gán vào `formAction`, hoặc gọi trong `onClick` |
| Theo dõi loading             | Dùng `useActionState` hoặc `useTransition`                             |

---

## 🧩 IX. Tóm tắt luồng hoạt động

```
Client click → POST request đến Server Action
          ↓
Server chạy hàm async → cập nhật DB
          ↓
Gọi revalidate / redirect / cookies
          ↓
Next.js render lại route → UI cập nhật tức thì
```

---

## 🧠 Phần 9: Caching và Revalidating

### 1️⃣ Khái niệm tổng quan

**Caching (Bộ nhớ đệm)** là kỹ thuật lưu trữ kết quả của việc **fetch dữ liệu hoặc các tính toán phức tạp** để những lần gọi tiếp theo có thể **phản hồi nhanh hơn**, không cần thực hiện lại từ đầu.

**Revalidating (Tái xác thực / Làm mới cache)** cho phép **cập nhật dữ liệu đã cache** mà **không cần rebuild toàn bộ ứng dụng**.

Next.js cung cấp một bộ API mạnh mẽ để quản lý **cache và revalidate**, bao gồm:

* `fetch` (mở rộng của trình duyệt, hỗ trợ caching)
* `unstable_cache`
* `revalidatePath`
* `revalidateTag`

---

### 2️⃣ `fetch`

### 📦 Caching trong `fetch`

Mặc định, **fetch** trong Next.js **không cache dữ liệu**.
Nếu bạn muốn cache kết quả, hãy thêm option:

```ts
const data = await fetch('https://...', { cache: 'force-cache' })
```

Điều này giúp dữ liệu được lưu lại để tái sử dụng cho các request sau → **hiệu suất tốt hơn**.

> 🧩 Lưu ý:
> Dù `fetch` mặc định không cache dữ liệu, Next.js **vẫn prerender và cache HTML** của route đó.
> Nếu bạn muốn route luôn được render động, hãy dùng **`connection()` API** để buộc dynamic behavior.

---

### 🔁 Revalidate dữ liệu fetch

Bạn có thể thiết lập **thời gian tự làm mới cache** bằng option `next.revalidate`:

```ts
const data = await fetch('https://...', { next: { revalidate: 3600 } })
```

→ Dữ liệu sẽ được **làm mới sau mỗi 3600 giây (1 giờ)**, thay vì cố định.

---

📘 **Xem thêm:** [API Reference - fetch](#api-reference)

---

### 3️⃣ `unstable_cache`

### 💡 Công dụng

`unstable_cache` cho phép bạn **cache kết quả của bất kỳ async function nào**, ví dụ như:

* Truy vấn database
* Gọi API tốn chi phí
* Tính toán phức tạp

### 🧱 Cách sử dụng

Giả sử bạn có function query dữ liệu người dùng:

```ts
import { db } from '@/lib/db'

export async function getUserById(id: string) {
  return db.select().from(users).where(eq(users.id, id)).then(res => res[0])
}
```

Bạn có thể **cache** kết quả bằng `unstable_cache`:

```ts
import { unstable_cache } from 'next/cache'
import { getUserById } from '@/app/lib/data'

export default async function Page({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params

  const getCachedUser = unstable_cache(
    async () => getUserById(userId),
    [userId] // key cache duy nhất
  )

  const user = await getCachedUser()
}
```

---

### ⚙️ Tuỳ chọn nâng cao

`unstable_cache` chấp nhận **tham số thứ ba** — cấu hình cache:

```ts
const getCachedUser = unstable_cache(
  async () => getUserById(userId),
  [userId],
  {
    tags: ['user'],
    revalidate: 3600, // sau 1 tiếng revalidate lại cache
  }
)
```

→ Bạn có thể **định danh cache bằng tag** để revalidate dễ dàng.

📘 **Xem thêm:** [API Reference - unstable_cache](#api-reference)

---

### 4️⃣ `revalidateTag`

### 🏷️ Mục đích

`revalidateTag` giúp **làm mới toàn bộ cache có cùng tag**, thường dùng **sau khi cập nhật dữ liệu**.

### 🔧 Cách dùng với `fetch`

Khi fetch, bạn có thể gắn tag:

```ts
export async function getUserById(id: string) {
  const data = await fetch(`https://...`, {
    next: { tags: ['user'] },
  })
}
```

Hoặc khi cache database query bằng `unstable_cache`:

```ts
export const getUserById = unstable_cache(
  async (id: string) => db.query.users.findFirst({ where: eq(users.id, id) }),
  ['user'],
  { tags: ['user'] }
)
```

### 🔄 Làm mới cache theo tag

Sau khi cập nhật dữ liệu, gọi:

```ts
import { revalidateTag } from 'next/cache'

export async function updateUser(id: string) {
  // Cập nhật dữ liệu
  revalidateTag('user') // làm mới toàn bộ cache gắn tag 'user'
}
```

✅ Ưu điểm:

* Chỉ cần gọi 1 lần → làm mới tất cả nơi có `tag = 'user'`.
* Không cần chỉ rõ route.

📘 **Xem thêm:** [API Reference - revalidateTag](#api-reference)

---

### 5️⃣ `revalidatePath`

### 📍 Mục đích

`revalidatePath` giúp **làm mới cache của một route cụ thể** sau khi có thay đổi dữ liệu.

### 📦 Ví dụ

```ts
import { revalidatePath } from 'next/cache'

export async function updateUser(id: string) {
  // Cập nhật dữ liệu
  revalidatePath('/profile') // làm mới route /profile
}
```

📘 **Xem thêm:** [API Reference - revalidatePath](#api-reference)

---

### 6️⃣ 🧭 Tổng kết so sánh

| API                                    | Mục đích                      | Phạm vi ảnh hưởng          | Khi dùng                         |
| -------------------------------------- | ----------------------------- | -------------------------- | -------------------------------- |
| `fetch(..., { next: { revalidate } })` | Revalidate tự động sau X giây | Một request cụ thể         | Dùng khi fetch API               |
| `unstable_cache()`                     | Cache kết quả function        | Theo key hoặc tag          | Khi truy vấn DB hoặc logic nặng  |
| `revalidateTag('tag')`                 | Làm mới cache theo tag        | Nhiều route dùng chung tag | Sau khi cập nhật dữ liệu         |
| `revalidatePath('/path')`              | Làm mới cache 1 route cụ thể  | Một route tĩnh             | Sau khi mutate data của route đó |

---

### 7️⃣ 📘 API Reference (Tham khảo API)

Tìm hiểu chi tiết hơn về các API được nhắc đến trong chương này:

| API                                                                                    | Mô tả                                                                           |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [`fetch`](https://nextjs.org/docs/app/api-reference/functions/fetch)                   | Tài liệu mở rộng cho hàm fetch trong Next.js, bao gồm cache, revalidate, và tag |
| [`unstable_cache`](https://nextjs.org/docs/app/api-reference/functions/unstable_cache) | Cách cache kết quả function, định nghĩa tag, và revalidate thủ công             |
| [`revalidatePath`](https://nextjs.org/docs/app/api-reference/functions/revalidatePath) | Làm mới cache của route cụ thể                                                  |
| [`revalidateTag`](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)   | Làm mới cache của toàn bộ route/fetch có cùng tag                               |

---
## Phần 10. Xử lý Lỗi (Error Handling)

Trong Next.js, lỗi được chia thành **hai loại chính**:

1. **Expected Errors (Lỗi dự kiến)** – những lỗi có thể xảy ra trong quá trình vận hành bình thường.
2. **Uncaught Exceptions (Lỗi không bắt được)** – những lỗi bất ngờ, thường do bug trong ứng dụng.

Phần này hướng dẫn cách xử lý từng loại lỗi đúng chuẩn trong ứng dụng Next.js.

---

## 🧩 1. Handling Expected Errors (Xử lý lỗi dự kiến)

Đây là những lỗi có thể **dự đoán và xử lý rõ ràng**, chẳng hạn:

* Lỗi form validation phía server.
* Request thất bại do dữ liệu sai hoặc không đủ quyền.

Các lỗi này **không nên throw error**, mà nên **trả về giá trị phản hồi** chứa thông tin lỗi.

### 🧠 Trong Server Functions

Dùng hook `useActionState` để xử lý lỗi dự kiến mà không cần `try/catch`.

**Ví dụ:**

```tsx
'use server'

export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get('title')
  const content = formData.get('content')

  const res = await fetch('https://api.vercel.app/posts', {
    method: 'POST',
    body: { title, content },
  })
  const json = await res.json()

  if (!res.ok) {
    return { message: 'Failed to create post' }
  }
}
```

**Ở phía Client:**

```tsx
'use client'

import { useActionState } from 'react'
import { createPost } from '@/app/actions'

const initialState = { message: '' }

export function Form() {
  const [state, formAction, pending] = useActionState(createPost, initialState)

  return (
    <form action={formAction}>
      <label htmlFor="title">Title</label>
      <input type="text" id="title" name="title" required />

      <label htmlFor="content">Content</label>
      <textarea id="content" name="content" required />

      {state?.message && <p aria-live="polite">{state.message}</p>}
      <button disabled={pending}>Create Post</button>
    </form>
  )
}
```

---

### 🧱 Trong Server Components

Khi gọi `fetch`, bạn có thể xử lý lỗi trực tiếp trong component:

```tsx
export default async function Page() {
  const res = await fetch(`https://...`)
  const data = await res.json()

  if (!res.ok) {
    return 'There was an error.'
  }

  return '...'
}
```

---

### 🚫 Not Found Pages

Khi dữ liệu không tồn tại, dùng `notFound()` để chuyển đến UI 404 tùy chỉnh.

**Ví dụ:**

```tsx
import { getPostBySlug } from '@/lib/posts'

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) notFound()

  return <div>{post.title}</div>
}
```

**File `app/blog/[slug]/not-found.tsx`:**

```tsx
export default function NotFound() {
  return <div>404 - Page Not Found</div>
}
```

---

## ⚠️ 2. Handling Uncaught Exceptions (Xử lý lỗi không bắt được)

Đây là lỗi **không mong đợi**, thường do bug trong code.
Next.js xử lý chúng bằng **Error Boundaries** — UI fallback cho phần bị crash.

### 🧩 Nested Error Boundaries

Tạo file `error.tsx` trong bất kỳ segment nào để định nghĩa error boundary cho segment đó.

```tsx
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

📘 **Lưu ý:**

* Lỗi sẽ **bong bóng lên (bubble up)** đến error boundary gần nhất.
* Có thể đặt nhiều error boundaries cho từng phần của cây component.

---

### ⚡ Lỗi trong Event Handlers

Error boundaries **không bắt lỗi trong event handlers hoặc async code**, vì chúng xảy ra sau khi render.

Cần **tự bắt lỗi bằng `try/catch`** và lưu vào `useState` hoặc `useReducer`.

```tsx
'use client'
import { useState } from 'react'

export function Button() {
  const [error, setError] = useState<Error | null>(null)

  const handleClick = () => {
    try {
      throw new Error('Exception')
    } catch (reason) {
      setError(reason as Error)
    }
  }

  if (error) {
    return <p>{error.message}</p>
  }

  return <button type="button" onClick={handleClick}>Click me</button>
}
```

---

### 🌀 Lỗi trong `useTransition`

Các lỗi trong `startTransition` **sẽ tự động bubble lên error boundary gần nhất**.

```tsx
'use client'
import { useTransition } from 'react'

export function Button() {
  const [pending, startTransition] = useTransition()

  const handleClick = () =>
    startTransition(() => {
      throw new Error('Exception')
    })

  return <button onClick={handleClick}>Click me</button>
}
```

---

## 🌍 3. Global Errors (Lỗi Toàn Cục)

Nếu lỗi xảy ra ở cấp root (ngoài mọi segment), hãy xử lý bằng `app/global-error.tsx`.

**Lưu ý:** File này **phải chứa cả `<html>` và `<body>`** vì nó thay thế layout gốc.

```tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
```

---

## 📚 API Reference

Tìm hiểu thêm về các thành phần được nhắc trong phần này tại API Reference:

| API              | Mô tả                                          |
| ---------------- | ---------------------------------------------- |
| **redirect**     | API Reference cho hàm `redirect()`             |
| **error.js**     | API Reference cho file đặc biệt `error.js`     |
| **notFound**     | API Reference cho hàm `notFound()`             |
| **not-found.js** | API Reference cho file đặc biệt `not-found.js` |

---

👉 **Tóm tắt ngắn:**

| Loại lỗi            | Cách xử lý                                |
| ------------------- | ----------------------------------------- |
| Expected Errors     | Trả về giá trị lỗi (không throw)          |
| Uncaught Exceptions | Dùng `error.tsx` làm error boundary       |
| 404                 | Dùng `notFound()` và file `not-found.tsx` |
| Global Errors       | Dùng `global-error.tsx` ở root app        |

---
## Phần 11. CSS trong Next.js

Next.js hỗ trợ nhiều cách để bạn **tạo và quản lý style** cho ứng dụng — từ Tailwind đến CSS Modules, Global CSS, Sass, hay CSS-in-JS. Dưới đây là hướng dẫn chi tiết từng phương pháp.

---

## 🌈 1. Tailwind CSS

**Tailwind CSS** là framework CSS "utility-first", cung cấp hàng nghìn class nhỏ giúp bạn **xây dựng giao diện nhanh, tùy chỉnh linh hoạt** mà không cần viết CSS thủ công.

### 🚀 Cài đặt

```bash
pnpm add -D tailwindcss @tailwindcss/postcss
```

### ⚙️ Cấu hình PostCSS

**postcss.config.mjs**

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### 📥 Import Tailwind vào global CSS

**app/globals.css**

```css
@import 'tailwindcss';
```

### 🧩 Import vào Root Layout

**app/layout.tsx**

```tsx
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### ✨ Sử dụng class Tailwind

**app/page.tsx**

```tsx
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
    </main>
  )
}
```

> 💡 **Lưu ý:** Nếu cần hỗ trợ trình duyệt cũ hơn, hãy xem hướng dẫn cài Tailwind CSS v3.

---

## 🧩 2. CSS Modules

**CSS Modules** cho phép bạn viết CSS có phạm vi **cục bộ** cho từng component.
Next.js sẽ **tự động tạo tên class duy nhất**, tránh trùng lặp giữa các file.

### Ví dụ

**app/blog/blog.module.css**

```css
.blog {
  padding: 24px;
}
```

**app/blog/page.tsx**

```tsx
import styles from './blog.module.css'

export default function Page() {
  return <main className={styles.blog}></main>
}
```

---

## 🌍 3. Global CSS

Dùng Global CSS cho các style **áp dụng toàn bộ ứng dụng** (như reset, layout tổng thể…).

### Ví dụ

**app/global.css**

```css
body {
  padding: 20px 20px 60px;
  max-width: 680px;
  margin: 0 auto;
}
```

**app/layout.tsx**

```tsx
import './global.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

> 💡 **Khuyến nghị:**
>
> * Chỉ nên dùng Global CSS cho style thật sự toàn cục (reset, typography…).
> * Dùng **Tailwind** cho hầu hết nhu cầu giao diện.
> * Dùng **CSS Modules** khi cần style riêng cho component.

---

## 📦 4. External Stylesheets

Bạn có thể import CSS từ các package ngoài (như Bootstrap, Ant Design, v.v.) ngay trong `app`:

**app/layout.tsx**

```tsx
import 'bootstrap/dist/css/bootstrap.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="container">{children}</body>
    </html>
  )
}
```

> 💡 Trong React 19, bạn cũng có thể dùng thẻ `<link rel="stylesheet" href="...">`.

---

## 🔀 5. Ordering & Merging CSS

Next.js tự động **tối ưu CSS trong production build**:

* Hợp nhất và chia nhỏ CSS theo route.
* Thứ tự import trong file quyết định thứ tự áp dụng style.

**Ví dụ:**

```tsx
// page.tsx
import { BaseButton } from './base-button'
import styles from './page.module.css'

export default function Page() {
  return <BaseButton className={styles.primary} />
}
```

```tsx
// base-button.tsx
import styles from './base-button.module.css'

export function BaseButton() {
  return <button className={styles.primary} />
}
```

→ `base-button.module.css` sẽ được load **trước** `page.module.css`.

---

## ✅ 6. Best Practices

| Khuyến nghị                                              | Giải thích                  |
| -------------------------------------------------------- | --------------------------- |
| 💡 Import global styles và Tailwind ở root layout        | Đảm bảo load nhất quán      |
| 🧱 Dùng Tailwind cho hầu hết nhu cầu                     | Tiện, gọn, responsive       |
| 🎯 CSS Modules cho component riêng biệt                  | Tránh trùng lặp class       |
| 🧩 Dùng quy tắc đặt tên thống nhất (`<name>.module.css`) | Dễ tìm và bảo trì           |
| ♻️ Gom style dùng chung thành component                  | Tránh import trùng lặp      |
| 🚫 Tắt linter tự sắp xếp import                          | Để giữ thứ tự CSS chính xác |
| ⚙️ Dùng `cssChunking` trong `next.config.js` nếu cần     | Kiểm soát cách tách CSS     |

---

## 🧪 7. Development vs Production

| Môi trường                    | Đặc điểm                                                       |
| ----------------------------- | -------------------------------------------------------------- |
| **Development (`next dev`)**  | Fast Refresh cập nhật CSS tức thì                              |
| **Production (`next build`)** | Tự động minify, code-split và chỉ load CSS cần thiết cho route |
| **CSS hoạt động khi JS tắt**  | ✅ Có trong production, ❌ Không trong dev                       |
| **Khác biệt thứ tự CSS**      | Có thể khác giữa dev và build — luôn test lại với `next build` |

---

## 🔗 8. Next Steps (Bước tiếp theo)

| Chủ đề              | Mô tả                                 |
| ------------------- | ------------------------------------- |
| **Tailwind CSS v3** | Dành cho trình duyệt cũ hơn           |
| **Sass**            | Viết style nâng cao với biến, mixin   |
| **CSS-in-JS**       | Dùng styled-components, Emotion, v.v. |

---

## 🧭 Phần 12: Image Optimization trong Next.js

Image Optimization là **tính năng tối ưu hóa hình ảnh tự động** của Next.js thông qua component `<Image>` — giúp website của bạn **tải nhanh hơn, ổn định hơn và dùng ít băng thông hơn**.

---

## 🚀 1. Tổng quan

Component `<Image>` mở rộng thẻ HTML `<img>` truyền thống với các lợi ích:

| Lợi ích                  | Mô tả                                                                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| 🪄 **Size optimization** | Tự động cung cấp hình ảnh đúng kích thước cho từng thiết bị (desktop, tablet, mobile) và dùng định dạng hiện đại như **WebP**. |
| ⚖️ **Visual stability**  | Tự động ngăn “layout shift” (dịch chuyển bố cục khi hình ảnh tải).                                                             |
| ⚡ **Faster loading**     | Hỗ trợ **lazy loading** (chỉ tải ảnh khi người dùng cuộn tới).                                                                 |
| 🧩 **Asset flexibility** | Có thể resize ảnh từ **local hoặc remote server** (VD: S3, CDN).                                                               |

---

## 💻 2. Cách sử dụng cơ bản

```tsx
import Image from 'next/image'

export default function Page() {
  return <Image src="/profile.png" alt="Avatar" width={500} height={500} />
}
```

> ✅ Mọi hình ảnh **phải có `alt`**, và **cần chỉ rõ `width`, `height`** (trừ khi dùng `fill`).

---

## 🗂️ 3. Local Images

Tất cả hình ảnh tĩnh (static) nên lưu trong thư mục `/public`.

**Cấu trúc thư mục:**

```
project-root/
├── app/
│   └── page.tsx
└── public/
    └── profile.png
```

**Ví dụ:**

```tsx
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="/profile.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  )
}
```

---

## 🧠 4. Static Import (tự động nhận kích thước và placeholder)

Nếu bạn `import` ảnh trực tiếp, Next.js sẽ **tự xác định width, height, và blurDataURL**.

```tsx
import Image from 'next/image'
import ProfileImage from './profile.png'

export default function Page() {
  return (
    <Image
      src={ProfileImage}
      alt="Picture of the author"
      placeholder="blur" // tùy chọn: hiển thị hiệu ứng mờ trong khi tải
    />
  )
}
```

> Lúc này bạn **không cần chỉ rõ width/height**, vì Next.js tự xử lý.

---

## 🌐 5. Remote Images

Khi ảnh nằm ở **máy chủ bên ngoài** (VD: S3, Cloudinary...), bạn chỉ cần dùng URL:

```tsx
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="https://s3.amazonaws.com/my-bucket/profile.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  )
}
```

⚠️ **Chú ý:**

* Phải chỉ định `width` và `height` vì Next.js **không thể biết kích thước trước**.
* Hoặc dùng `fill` để ảnh tự chiếm toàn bộ khung cha:

  ```tsx
  <div className="relative w-64 h-64">
    <Image src="..." alt="..." fill style={{ objectFit: 'cover' }} />
  </div>
  ```

---

## 🔒 6. Cấu hình cho ảnh từ server ngoài (`next.config.ts`)

Để bảo mật, bạn cần **khai báo rõ domain nào được phép load ảnh**:

```ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/my-bucket/**',
      },
    ],
  },
}

export default config
```

> 🔐 Điều này giúp tránh bị lạm dụng (ví dụ attacker chèn link ảnh độc hại).

---

## 📸 7. Tổng kết best practices

✅ **Luôn cung cấp `alt`** (hỗ trợ SEO & Accessibility).
✅ **Dùng `placeholder="blur"`** để cải thiện UX.
✅ **Đặt ảnh trong `/public` hoặc dùng CDN an toàn.**
✅ **Tránh ảnh quá lớn** – resize về kích thước phù hợp trước khi deploy.
✅ **Kết hợp với `fill` + Tailwind hoặc CSS để responsive.**

---

## 🧩 8. Demo nâng cao — Responsive Image Gallery

```tsx
import Image from 'next/image'

const images = [
  '/gallery1.jpg',
  '/gallery2.jpg',
  '/gallery3.jpg',
  '/gallery4.jpg',
]

export default function Gallery() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
      {images.map((src, i) => (
        <div key={i} className="relative w-full aspect-square">
          <Image
            src={src}
            alt={`Gallery image ${i + 1}`}
            fill
            className="rounded-xl object-cover"
            placeholder="blur"
            blurDataURL="/blur-placeholder.png"
          />
        </div>
      ))}
    </div>
  )
}
```

> 🔥 Ảnh tự tối ưu theo kích thước thiết bị, tải mờ trước khi rõ nét, không gây nhảy layout.

---

## 📚 API References

* [Image Component Docs](https://nextjs.org/docs/app/api-reference/components/image)
* [next.config.js: images](https://nextjs.org/docs/app/api-reference/next-config-js/images)

---

## 🧭 Phần 13: Font Optimization trong Next.js

Tối ưu font là **bước quan trọng để cải thiện tốc độ tải trang, tránh layout shift, và tăng điểm hiệu năng Lighthouse**.
Next.js hỗ trợ điều này **tự động** thông qua module `next/font` – giúp **tự host font**, **loại bỏ request ra ngoài (Google Fonts)** và **giảm layout shift (FOUT/FOIT)**.

---

## ⚙️ 1. Cơ chế hoạt động

Khi bạn dùng `next/font`, Next.js sẽ:

* **Tự tải và host font** (Google Font hoặc local font) trong chính project.
* **Chèn font-face CSS tự động**, không cần import file `.woff2` thủ công.
* **Tối ưu preload, subset, và display swap** để tải nhanh và không nháy chữ.
* **Không gửi request đến Google** → tăng tính riêng tư (privacy).

---

## 🚀 2. Sử dụng Google Fonts

Import font trực tiếp từ `next/font/google`:

```tsx
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'], // chọn tập ký tự cần dùng (latin, vietnamese,...)
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
```

✅ **Giải thích:**

* `subsets`: Giới hạn bộ ký tự (giúp giảm dung lượng tải).
* `geist.className`: Tự động sinh CSS class gắn font vào `<html>` hoặc `<body>`.
* Font được lưu trong build → không còn request đến fonts.googleapis.com.

---

## 💪 3. Dùng variable fonts (khuyến nghị)

Variable font cho phép **nhiều độ đậm (weight)** và **kiểu dáng (style)** trong 1 file duy nhất → nhẹ hơn, linh hoạt hơn.

Ví dụ với Roboto variable font:

```tsx
import { Roboto_Flex } from 'next/font/google'

const roboto = Roboto_Flex({
  subsets: ['latin'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={roboto.className}>
      <body>{children}</body>
    </html>
  )
}
```

Nếu font không hỗ trợ variable, bạn cần chỉ rõ `weight`:

```tsx
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})
```

---

## 🏠 4. Dùng Local Fonts (font tự lưu trong project)

Khi bạn có file `.woff2`, `.ttf`… riêng (ví dụ tải từ Fontshare, Typekit, hay custom font), dùng `next/font/local`:

```tsx
import localFont from 'next/font/local'

const myFont = localFont({
  src: './my-font.woff2', // đường dẫn tương đối trong app/
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={myFont.className}>
      <body>{children}</body>
    </html>
  )
}
```

---

## 🧩 5. Sử dụng nhiều biến thể (multi-weight & style)

Nếu bạn có nhiều file cho cùng 1 font family:

```tsx
const roboto = localFont({
  src: [
    { path: './Roboto-Regular.woff2', weight: '400', style: 'normal' },
    { path: './Roboto-Italic.woff2', weight: '400', style: 'italic' },
    { path: './Roboto-Bold.woff2', weight: '700', style: 'normal' },
    { path: './Roboto-BoldItalic.woff2', weight: '700', style: 'italic' },
  ],
})
```

> 🔥 Lúc build, Next.js sẽ **tự generate `@font-face`** và preload hợp lý cho từng biến thể.

---

## 🎨 6. Sử dụng trong component riêng lẻ

Font được **scoped theo component**, nên bạn có thể áp dụng font riêng cho từng phần UI:

```tsx
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const playfair = Playfair_Display({ subsets: ['latin'] })

export default function Page() {
  return (
    <main className={inter.className}>
      <h1 className={playfair.className}>Welcome</h1>
      <p>This paragraph uses Inter font.</p>
    </main>
  )
}
```

> ✅ Dễ dàng dùng nhiều font mà không ảnh hưởng toàn bộ trang.

---

## 🧠 7. So sánh hiệu năng

| Cách dùng                   | Ưu điểm                           | Nhược điểm                                |
| --------------------------- | --------------------------------- | ----------------------------------------- |
| Import CSS Google Fonts     | Dễ dùng                           | Có request ra ngoài → chậm, thiếu bảo mật |
| Dùng file `.woff2` thủ công | Kiểm soát tốt                     | Cần tự config preload và font-face        |
| **✅ `next/font` (tự host)** | Hiệu năng cao, tự tối ưu, private | Cần build lại để thêm font mới            |

---

## 💡 8. Best Practices

✅ Dùng **variable fonts** nếu có thể (VD: Inter Variable, Roboto Flex).
✅ Giới hạn `subsets` để giảm dung lượng tải.
✅ Đặt font tại **Root Layout** nếu muốn áp dụng toàn app.
✅ Với ngôn ngữ có ký tự đặc biệt (VD: tiếng Việt), nên thêm `subsets: ['latin', 'vietnamese']`.
✅ Khi dùng local font, ưu tiên định dạng `.woff2` (nhẹ, được hỗ trợ tốt nhất).

---

## 📚 9. Tài liệu tham khảo

* [Next.js Font Optimization Docs](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
* [next/font/google API Reference](https://nextjs.org/docs/app/api-reference/next-font-google)
* [next/font/local API Reference](https://nextjs.org/docs/app/api-reference/next-font-local)

---

## 🧭 Phần 14: Metadata và Ảnh OG trong Next.js

Next.js cung cấp **Metadata API** để giúp bạn định nghĩa **thông tin SEO**, **chia sẻ mạng xã hội (Open Graph, Twitter Cards)**, và **favicon/sitemap/robots.txt** một cách dễ dàng, có thể **tĩnh hoặc động**.
Tất cả được tự động chuyển thành các thẻ `<head>` tương ứng trong HTML của mỗi trang.

---

## 🧩 1. Tổng quan Metadata API

Next.js hỗ trợ ba cách để khai báo metadata:

1. **Đối tượng tĩnh `metadata`** — dùng cho metadata cố định.
2. **Hàm động `generateMetadata()`** — cho metadata phụ thuộc vào dữ liệu.
3. **Các file đặc biệt (special files)** — như `favicon.ico`, `opengraph-image.png`, `sitemap.xml`, v.v.

> ⚙️ Các API này **chỉ hoạt động trong Server Components** (không dùng trong Client Components).

---

## 🧱 2. Thẻ meta mặc định

Ngay cả khi bạn không định nghĩa gì, Next.js vẫn luôn thêm 2 thẻ cơ bản:

```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

Các thẻ khác (title, description, og:image, ...) sẽ được sinh ra dựa trên `metadata` hoặc `generateMetadata`.

---

## 🗂️ 3. Static Metadata (Tĩnh)

Dùng khi thông tin cố định (vd: tiêu đề, mô tả blog chung).

**Ví dụ:**

```tsx
// app/blog/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Blog',
  description: 'Chia sẻ bài viết về công nghệ và lập trình.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>
}
```

✅ Khi build, Next.js sẽ tự động thêm `<title>` và `<meta name="description">` vào `<head>`.

---

## ⚡ 4. Dynamic Metadata (Động)

Dùng khi metadata phụ thuộc dữ liệu (VD: mỗi bài viết có title/description riêng).

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await fetch(`https://api.vercel.app/blog/${params.slug}`).then(res => res.json())

  return {
    title: post.title,
    description: post.description,
  }
}

export default function Page({ params }: { params: { slug: string } }) {
  return <div>{params.slug}</div>
}
```

> 🧠 Lưu ý: `generateMetadata()` chạy **trên server**.
> Metadata được stream riêng nếu trang render động (giúp tải nhanh hơn).

---

## 🔁 5. Streaming Metadata

Khi `generateMetadata()` mất thời gian (do fetch dữ liệu), Next.js **stream metadata riêng** và chèn vào HTML ngay khi sẵn sàng — không chặn việc render giao diện.

Static pages thì metadata được build sẵn nên không dùng cơ chế này.

---

## 🧠 6. Tối ưu request bằng `cache()`

Nếu bạn fetch cùng 1 dữ liệu cho **metadata** và **page content**, hãy cache lại để không fetch 2 lần:

```tsx
// app/lib/data.ts
import { cache } from 'react'
import { db } from '@/app/lib/db'

export const getPost = cache(async (slug: string) => {
  return await db.query.posts.findFirst({ where: { slug } })
})
```

```tsx
// app/blog/[slug]/page.tsx
import { getPost } from '@/app/lib/data'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  return { title: post.title, description: post.description }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  return <div>{post.title}</div>
}
```

---

## 📁 7. File-based Metadata (Metadata qua file đặc biệt)

| File                                        | Mục đích                |
| ------------------------------------------- | ----------------------- |
| `favicon.ico`, `icon.jpg`, `apple-icon.jpg` | Biểu tượng trang        |
| `opengraph-image.jpg`, `twitter-image.jpg`  | Ảnh preview khi chia sẻ |
| `robots.txt`                                | Quy định crawler (SEO)  |
| `sitemap.xml`                               | Sơ đồ trang (SEO)       |

> Bạn có thể tạo tĩnh hoặc **generate bằng code** (VD: sitemap động).

---

## 🧿 8. Favicons

Tạo file `favicon.ico` tại **thư mục gốc của app/**.

```
app/
├── favicon.ico
├── layout.tsx
└── page.tsx
```

Hoặc generate bằng code (xem thêm phần [Favicon Docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons)).

---

## 🌄 9. Static OG Images

OG (Open Graph) images hiển thị khi bạn chia sẻ link trên mạng xã hội (Facebook, Zalo, Twitter...).

Tạo file:

```
app/opengraph-image.png
```

→ áp dụng cho toàn site.

Hoặc:

```
app/blog/opengraph-image.jpg
```

→ chỉ áp dụng cho route `/blog`.

> 📸 Hỗ trợ định dạng `.jpg`, `.jpeg`, `.png`, `.gif`.

---

## 🧬 10. Dynamic OG Images

Dùng **ImageResponse** để sinh OG image động (theo dữ liệu từng trang):

```tsx
// app/blog/[slug]/opengraph-image.ts
import { ImageResponse } from 'next/og'
import { getPost } from '@/app/lib/data'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {post.title}
      </div>
    )
  )
}
```

✅ Hỗ trợ CSS cơ bản: `flexbox`, `absolute`, `text-align`, `background`, `font`.
❌ Không hỗ trợ layout nâng cao (như `grid`).

> Tham khảo thử nghiệm trực tiếp tại [Vercel OG Playground](https://og-playground.vercel.app/).

---

## ⚙️ 11. API Reference

| API                                                                                         | Mô tả                                                              |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [`generateMetadata`](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) | Thêm metadata động (SEO, chia sẻ mạng xã hội)                      |
| [`generateViewport`](https://nextjs.org/docs/app/api-reference/functions/generate-viewport) | Sinh viewport meta tag động                                        |
| [`ImageResponse`](https://nextjs.org/docs/app/api-reference/functions/image-response)       | Sinh ảnh OG động từ JSX                                            |
| **Metadata Files**                                                                          | Quy tắc file đặc biệt (favicon, OG image, robots.txt, sitemap.xml) |
| `favicon`, `apple-icon`, `icon`                                                             | Biểu tượng website                                                 |
| `opengraph-image`, `twitter-image`                                                          | Ảnh chia sẻ mạng xã hội                                            |
| `robots.txt`                                                                                | Điều hướng crawler                                                 |
| `sitemap.xml`                                                                               | Liệt kê cấu trúc trang web cho SEO                                 |

---

## 🧭 Tóm tắt nhanh

✅ Dùng `metadata` (tĩnh) cho layout và page cơ bản.
✅ Dùng `generateMetadata()` khi cần fetch dữ liệu.
✅ Dùng file-based metadata (`opengraph-image.png`, `favicon.ico`) cho OG image & biểu tượng.
✅ Dùng `ImageResponse` để tạo OG image động.
✅ Tối ưu SEO và chia sẻ mạng xã hội dễ dàng mà không cần thủ công chỉnh `<head>`.

---

## 🧩 Phần 15: Route Handlers và Middleware

### 1. Route Handlers

**Route Handlers** cho phép bạn tạo các **custom request handlers** (trình xử lý yêu cầu tuỳ chỉnh) cho từng route, sử dụng **Web Request và Response API** tiêu chuẩn.

---

#### 🗂 Route.js — File đặc biệt

> 💡 **Ghi nhớ:** Route Handlers **chỉ khả dụng trong thư mục `app/`**.
> Chúng tương đương với **API Routes** trong thư mục `pages/`, nghĩa là bạn **không cần dùng API Routes và Route Handlers cùng lúc.**

---

### 🧭 Quy ước sử dụng

Các Route Handler được định nghĩa trong file `route.js` hoặc `route.ts` bên trong thư mục `app/`:

```tsx
// app/api/route.ts
export async function GET(request: Request) {}
```

Route Handlers có thể được đặt lồng sâu trong bất kỳ thư mục con nào của `app/`, tương tự như `page.js` và `layout.js`.

> ⚠️ Tuy nhiên, **không thể có** file `route.js` cùng cấp với `page.js`.

---

### ⚙️ Các phương thức HTTP được hỗ trợ

Các phương thức HTTP mà Next.js hỗ trợ gồm:

```
GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
```

Nếu gọi phương thức không được hỗ trợ, Next.js sẽ trả về **405 Method Not Allowed**.

---

### 🧰 Mở rộng NextRequest và NextResponse

Ngoài việc hỗ trợ **Request** và **Response** mặc định của Web API,
Next.js còn mở rộng thêm các lớp **NextRequest** và **NextResponse** để cung cấp thêm nhiều **helper** hữu ích cho các trường hợp nâng cao.

---

### 🧠 Caching (Bộ nhớ đệm)

Mặc định, **Route Handlers không được cache.**
Bạn có thể **bật cache cho các phương thức GET**, nhưng **các phương thức khác sẽ không được cache.**

Để cache GET, bạn thêm cấu hình sau:

```tsx
// app/items/route.ts
export const dynamic = 'force-static'

export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  })
  const data = await res.json()
  return Response.json({ data })
}
```

> 💡 Các phương thức khác (POST, PUT, v.v.) sẽ **không bị ảnh hưởng bởi cache** dù cùng file với GET.

---

### 🧾 Các Route Handler đặc biệt

Các file đặc biệt như:

* `sitemap.ts`
* `opengraph-image.tsx`
* `icon.tsx`
* và các file metadata khác

→ sẽ **mặc định là static**, trừ khi bạn bật **Dynamic APIs** hoặc config `dynamic`.

---

### 🧩 Cách phân giải Route

Một “route” là **đơn vị routing thấp nhất** trong Next.js.

* Route **không tham gia layout** hay **navigation client-side** như `page`.
* Không thể có `page.js` và `route.js` cùng cấp.

| Page               | Route            | Kết quả    |
| ------------------ | ---------------- | ---------- |
| app/page.js        | app/route.js     | ❌ Conflict |
| app/page.js        | app/api/route.js | ✅ Hợp lệ   |
| app/[user]/page.js | app/api/route.js | ✅ Hợp lệ   |

👉 Mỗi `page.js` hoặc `route.js` chịu trách nhiệm cho **tất cả các HTTP verb** ở route đó.

Ví dụ conflict:

```tsx
// app/page.ts
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}

// ❌ Conflict
// app/route.ts
export async function POST(request: Request) {}
```

---

### 🧩 Route Context Helper (TypeScript)

Khi dùng TypeScript, bạn có thể gán kiểu cho `context` bằng **RouteContext**:

```tsx
import type { NextRequest } from 'next/server'

export async function GET(_req: NextRequest, ctx: RouteContext<'/users/[id]'>) {
  const { id } = await ctx.params
  return Response.json({ id })
}
```

> 💡 Các kiểu này được **tự động sinh ra** trong quá trình chạy `next dev`, `next build`, hoặc `next typegen`.

---

## 2. Middleware

**Middleware** cho phép bạn chạy code **trước khi request hoàn tất**.
Từ đó, bạn có thể **chuyển hướng (redirect)**, **ghi đè (rewrite)**, **chỉnh header**, hoặc **phản hồi ngay lập tức**.

---

### 💡 Trường hợp nên dùng Middleware

✅ Các use case phổ biến:

* Redirect nhanh dựa trên request (ví dụ: user chưa login)
* A/B testing — chuyển hướng giữa 2 phiên bản page
* Thêm header cho tất cả hoặc một số route

❌ Không nên dùng cho:

* Các tác vụ cần **fetch dữ liệu chậm**
* Quản lý **session hoặc authentication phức tạp**
* Gọi `fetch` với `options.cache`, `options.next.revalidate`, hoặc `options.next.tags` (chúng không hoạt động trong Middleware)

---

### 📂 Cấu trúc và vị trí file

Tạo file `middleware.ts` (hoặc `.js`) **ở root project**,
hoặc bên trong thư mục `src/` (nếu có).

> ⚠️ **Chỉ 1 file `middleware.ts` được hỗ trợ cho toàn project.**

Nếu muốn chia nhỏ logic, bạn có thể:

* Tách logic middleware thành nhiều module nhỏ
* Import chúng vào file `middleware.ts` chính để quản lý tập trung

Điều này giúp tránh conflict và tăng hiệu suất.

---

### 🧱 Ví dụ:

```tsx
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

// Cấu hình matcher để áp dụng cho các route cụ thể
export const config = {
  matcher: '/about/:path*',
}
```

---

## 📘 API Reference

Tìm hiểu chi tiết hơn trong phần API Reference:

| Mục                            | Mô tả                                               |
| ------------------------------ | --------------------------------------------------- |
| **route.js**                   | API Reference cho file `route.js` đặc biệt          |
| **middleware.js**              | API Reference cho file `middleware.js`              |
| **Backend for Frontend (BFF)** | Hướng dẫn sử dụng Next.js như **backend framework** |

---


## 🚀 Phần 16: Deploying (Triển khai Next.js)

Next.js có thể được triển khai theo nhiều cách khác nhau:

| Hình thức triển khai | Mức độ hỗ trợ tính năng         |
| -------------------- | ------------------------------- |
| **Node.js server**   | ✅ Hỗ trợ **toàn bộ tính năng**  |
| **Docker container** | ✅ Hỗ trợ **toàn bộ tính năng**  |
| **Static export**    | ⚠️ Hỗ trợ **giới hạn**          |
| **Adapters**         | ⚙️ Tùy theo **nền tảng cụ thể** |

---

## 🧩 1. Node.js Server

Bạn có thể triển khai ứng dụng Next.js trên **bất kỳ nhà cung cấp nào hỗ trợ Node.js** (như Vercel, Render, Railway, DigitalOcean, AWS EC2, v.v.).

### 🔧 Cấu hình bắt buộc trong `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

### ⚙️ Quy trình build & run

1. **Build ứng dụng:**

   ```bash
   npm run build
   ```
2. **Khởi động server Node.js:**

   ```bash
   npm run start
   ```

Server này hỗ trợ **toàn bộ tính năng của Next.js**, bao gồm:

* SSR (Server-Side Rendering)
* ISR (Incremental Static Regeneration)
* API Routes / Route Handlers
* Middleware
* Streaming và Dynamic Rendering

Nếu cần kiểm soát chi tiết hơn, bạn có thể **eject sang custom server** (ví dụ: Express.js, Fastify).

👉 Tham khảo thêm cách **cấu hình Node.js deployment** theo cơ sở hạ tầng của bạn.

### 📦 Template triển khai gợi ý

* [Flightcontrol](https://flightcontrol.dev)
* [Railway](https://railway.app)
* [Replit](https://replit.com)

---

## 🐳 2. Docker Container

Next.js có thể chạy trong **Docker container**, cho phép bạn triển khai lên:

* Kubernetes
* AWS ECS / Fargate
* Google Cloud Run
* Render, DigitalOcean App Platform, v.v.

### 🔍 Ưu điểm:

* **Cô lập môi trường**
* **Dễ nhân bản, di chuyển và mở rộng**
* **Hỗ trợ toàn bộ tính năng Next.js**

### ⚠️ Lưu ý khi phát triển cục bộ:

Mặc dù Docker rất tốt cho **production**,
nhưng trong quá trình **phát triển (development)** — đặc biệt trên **Mac hoặc Windows**,
bạn nên chạy bằng:

```bash
npm run dev
```

thay vì dùng Docker để đạt hiệu năng cao hơn.

👉 Xem thêm tài liệu về **tối ưu hoá hiệu suất khi phát triển cục bộ**.

### 🧱 Template gợi ý:

* Docker cơ bản
* Docker Multi-Environment
* DigitalOcean
* Fly.io
* Google Cloud Run
* Render
* SST

---

## 🪶 3. Static Export

Next.js hỗ trợ **xuất tĩnh (Static Export)** — tức là bạn có thể **build site thành HTML/CSS/JS thuần túy**,
sau đó **triển khai trên bất kỳ web server nào** (AWS S3, Nginx, Apache, GitHub Pages,...).

### 🔧 Lệnh xuất tĩnh:

```bash
next build && next export
```

Ứng dụng lúc này hoạt động như một **Static Site** hoặc **Single-Page Application (SPA)**.

### ⚠️ Giới hạn:

Static Export **không hỗ trợ** các tính năng cần server như:

* SSR
* API Routes
* Middleware
* Dynamic Rendering
* Revalidation (ISR)

👉 Nếu bạn bắt đầu với **Static Site**, bạn vẫn có thể **nâng cấp dần lên SSR hoặc Full-stack** sau này mà không cần viết lại toàn bộ.

### 🧱 Template gợi ý:

* GitHub Pages

---

## ⚙️ 4. Adapters (Bộ chuyển đổi nền tảng)

Next.js có thể **tự động thích ứng với nhiều nền tảng khác nhau**,
thông qua các **Deployment Adapters**, để tận dụng **hạ tầng đặc trưng** của từng nền tảng.

### 🌍 Các nền tảng hỗ trợ:

| Nền tảng                | Ghi chú                                                |
| ----------------------- | ------------------------------------------------------ |
| **AWS Amplify Hosting** | Hỗ trợ build & deploy Next.js toàn phần                |
| **Cloudflare**          | Triển khai dưới dạng Edge Functions (rất nhanh)        |
| **Deno Deploy**         | Chạy serverless trên Deno runtime                      |
| **Netlify**             | Tự động nhận diện Next.js                              |
| **Vercel**              | Nền tảng do đội ngũ Next.js phát triển – hỗ trợ đầy đủ |

> 🧠 **Lưu ý:**
> Đội ngũ Next.js đang phát triển **Deployment Adapters API** giúp cộng đồng có thể viết adapter cho **mọi nền tảng khác**.
> Khi hoàn thiện, tài liệu hướng dẫn chi tiết cách **tự viết adapter của riêng bạn** sẽ được bổ sung.

---

## ✅ Tổng kết phần 16

| Hình thức          | Khi nên dùng                                                   | Ưu điểm                | Nhược điểm             |
| ------------------ | -------------------------------------------------------------- | ---------------------- | ---------------------- |
| **Node.js Server** | Ứng dụng full-stack (SSR, API Routes)                          | Hỗ trợ đầy đủ          | Cần quản lý server     |
| **Docker**         | Triển khai production, CI/CD                                   | Linh hoạt, portable    | Thiết lập phức tạp hơn |
| **Static Export**  | Blog, landing page, SPA                                        | Đơn giản, chi phí thấp | Không hỗ trợ SSR       |
| **Adapters**       | Khi deploy trên platform đặc thù (Vercel, Netlify, Cloudflare) | Tự động tối ưu         | Phụ thuộc hạ tầng      |

---
## 🧱 Phần 17: Nâng cấp (Upgrading)

### 🔹 Phiên bản mới nhất

Để cập nhật **Next.js** lên phiên bản mới nhất, bạn có thể sử dụng **upgrade codemod** được cung cấp sẵn:

```bash
npx @next/codemod@latest upgrade latest
```

Nếu bạn muốn nâng cấp **thủ công**, hãy cài đặt lại phiên bản mới nhất của **Next.js** và **React** (kèm `eslint-config-next`):

#### Cài đặt bằng các trình quản lý gói:

| Công cụ  | Lệnh                                                                           |
| -------- | ------------------------------------------------------------------------------ |
| **pnpm** | `pnpm i next@latest react@latest react-dom@latest eslint-config-next@latest`   |
| **npm**  | `npm i next@latest react@latest react-dom@latest eslint-config-next@latest`    |
| **yarn** | `yarn add next@latest react@latest react-dom@latest eslint-config-next@latest` |
| **bun**  | `bun add next@latest react@latest react-dom@latest eslint-config-next@latest`  |

---

### 🔹 Phiên bản Canary (bản thử nghiệm)

Nếu bạn muốn dùng **phiên bản thử nghiệm (canary)** — nơi các tính năng mới nhất được cập nhật sớm — trước tiên hãy đảm bảo rằng bạn đã ở trên bản ổn định mới nhất và dự án hoạt động bình thường.
Sau đó, chạy lệnh sau để nâng cấp:

```bash
npm i next@canary
```

---

### 🔹 Các tính năng hiện có trong phiên bản Canary

#### 🧠 Caching (Bộ nhớ đệm)

Phiên bản canary hiện hỗ trợ các API và directive mới:

* `"use cache"` — chỉ thị kích hoạt cơ chế cache cho component hoặc hàm.
* `cacheLife` — kiểm soát thời gian sống của cache.
* `cacheTag` — đánh dấu cache bằng tag, giúp dễ dàng revalidate.
* `cacheComponents` — tối ưu hoá và cache các React component.

#### 🔐 Authentication (Xác thực)

Cải thiện khả năng xác thực người dùng với các tính năng mới:

* `forbidden` — xử lý khi người dùng bị cấm truy cập.
* `unauthorized` — xử lý khi người dùng chưa đăng nhập.
* `forbidden.js` / `unauthorized.js` — trang lỗi tuỳ chỉnh cho hai trạng thái trên.
* `authInterrupts` — ngắt hoặc chuyển hướng khi người dùng không đủ quyền truy cập.

---

### 🔹 Hướng dẫn nâng cấp theo phiên bản

| Phiên bản      | Nội dung                                                   |
| -------------- | ---------------------------------------------------------- |
| **Version 15** | Hướng dẫn nâng cấp ứng dụng Next.js từ **Version 14 → 15** |
| **Version 14** | Hướng dẫn nâng cấp ứng dụng Next.js từ **Version 13 → 14** |

---

✅ **Tóm tắt:**

* Sử dụng `@next/codemod` để nâng cấp nhanh chóng và tự động.
* Nếu cần kiểm soát chi tiết hơn, hãy nâng cấp thủ công bằng `pnpm`, `npm`, `yarn`, hoặc `bun`.
* Phiên bản **canary** dành cho lập trình viên muốn trải nghiệm sớm các tính năng mới như **cache directives** và **authentication handlers**.
* Khi nâng cấp giữa các major version (13 → 14, 14 → 15), hãy đọc **Version Guides** để tránh lỗi không tương thích.

---
