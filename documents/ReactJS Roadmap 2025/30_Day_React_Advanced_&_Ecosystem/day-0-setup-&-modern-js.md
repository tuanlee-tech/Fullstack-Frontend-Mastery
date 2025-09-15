## 🔹 Cấu trúc mỗi ngày

1. **Topic / Chủ đề**

   * Giải thích ngắn gọn, mục tiêu học tập.

2. **Key Concepts / Kiến thức chính**

   * Liệt kê các hooks, patterns, thư viện, feature cần nắm.

3. **Example / Ví dụ code**

   * Clean, production-ready, comment đầy đủ.

4. **Exercises / Bài tập**

   * Level 1: Core concept (1–2 tasks)
   * Level 2: Challenge / real-world scenario

5. **Solutions / Giải pháp**

   * Code mẫu, giải thích chi tiết, best practice.

6. **Extra Notes / Ghi chú nâng cao**

   * Performance tip, security, accessibility, optimization.

---

Ví dụ mình viết **Day 00: Setup & Modern JS** như mẫu:

---

# Day 00 – Setup & Modern JS / Cài đặt & ES2023

### Topic / Chủ đề

Prepare your development environment and refresh modern JavaScript features (ES2023).
Chuẩn bị môi trường phát triển và ôn tập các tính năng JS hiện đại.

---

### Key Concepts / Kiến thức chính

* Node.js >= 18, npm/yarn
* Vite or CRA setup
* ES6+ features:

  * `let` / `const`
  * Arrow functions
  * Destructuring
  * Template literals
  * Optional chaining (`?.`)
  * Nullish coalescing (`??`)
  * Modules: `import` / `export`
* VSCode + essential extensions (Prettier, ESLint, React DevTools)

---

### Example / Ví dụ code

```js
// Optional chaining & nullish coalescing
const user = { name: "Alice", address: null };

console.log(user.address?.street ?? "No street info");
// Output: No street info

// Destructuring
const { name } = user;
console.log(name); // Alice

// Arrow function + template literal
const greet = (name) => `Hello, ${name}!`;
console.log(greet("React Learner"));
```

---

### Exercises / Bài tập

**Level 1**

1. Create a simple JS module that exports a function and import it in another file.
2. Practice optional chaining and nullish coalescing with a nested object.

**Level 2**

1. Setup a Vite React project, configure ESLint + Prettier, and ensure the dev server runs.
2. Create a folder structure for your upcoming advanced React project.

---

### Solutions / Giải pháp

**Level 1**

```js
// math.js
export const add = (a, b) => a + b;

// index.js
import { add } from './math.js';
console.log(add(3, 7)); // 10

// Optional chaining
const user = { profile: { email: null } };
console.log(user.profile?.email ?? "No email"); // No email
```

**Level 2**

* Run `npm create vite@latest advanced-react --template react`
* Install ESLint & Prettier:

```bash
npm install -D eslint prettier eslint-plugin-react eslint-config-prettier
```

* Folder structure example:

```
/src
  /components
  /hooks
  /pages
  /services
  /utils
  /styles
```

---

### Extra Notes / Ghi chú nâng cao

* Always use `const` for variables that won’t be reassigned.
* Configure VSCode to auto format on save for clean code.
* Make modular folder structure for large-scale projects.

---