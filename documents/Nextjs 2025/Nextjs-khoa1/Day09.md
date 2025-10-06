## **Day 9: Styling (Page + App Router)**

### Mục tiêu học

1. Hiểu cơ chế CSS Modules, Tailwind CSS và Styled Components.
2. Áp dụng CSS Modules cho component Page Router và App Router.
3. Tích hợp Tailwind CSS vào project song song 2 router.
4. Viết Styled Components với TypeScript, props typed.
5. Biết patterns enterprise: theme, design tokens, global styles, class naming conventions.

### TL;DR

* CSS Modules: scoped CSS, filename.module.css.
* Tailwind CSS: utility-first, responsive, hover/focus variants.
* Styled Components: component-level styles, dynamic props, theme support.

### Ví dụ code

**Page Router CSS Module**

```tsx
// pages/index.tsx
import styles from '../styles/Home.module.css';

export default function Home() {
  return <h1 className={styles.title}>Hello Next.js</h1>;
}
```

```css
/* styles/Home.module.css */
.title {
  color: #1a202c;
  font-size: 2rem;
  font-weight: bold;
}
```

**App Router Styled Components**

```tsx
// app/page.tsx
'use client';
import styled from 'styled-components';

const Title = styled.h1<{ color?: string }>`
  color: ${({ color }) => color || '#1a202c'};
  font-size: 2rem;
  font-weight: bold;
`;

export default function Page() {
  return <Title color="#2b6cb0">Hello App Router</Title>;
}
```

**Tailwind CSS Example**

```tsx
export default function TailwindExample() {
  return <h2 className="text-2xl font-bold text-blue-700 hover:text-blue-900">Tailwind Styling</h2>;
}
```

### Bài tập

* **Level 1:** Tạo component `Button` với CSS Modules (Page Router) và Styled Component (App Router).
* **Level 2:** Tích hợp Tailwind CSS, tạo responsive card component.
* **Level 3:** Viết theme toggle (dark/light) với Styled Components + Tailwind + TypeScript.

---
## **Bài tập giải thích chi tiết**

### **Level 1: Button component**

**Yêu cầu:** Tạo component `Button` sử dụng CSS Modules (Page Router) và Styled Components (App Router).

#### **Page Router - CSS Modules**

**File:** `components/Button.tsx`

```tsx
import styles from './Button.module.css';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export default function Button({ label, onClick }: ButtonProps) {
  return <button className={styles.btn} onClick={onClick}>{label}</button>;
}
```

**File:** `components/Button.module.css`

```css
.btn {
  background-color: #2b6cb0;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: bold;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: #2c5282;
}
```

**Giải thích:**

* `styles.btn` → scoped class, tránh conflict.
* Hover effect cải thiện UX.

---

#### **App Router - Styled Components**

**File:** `app/components/Button.tsx`

```tsx
'use client';
import styled from 'styled-components';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

const StyledButton = styled.button`
  background-color: #2b6cb0;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: bold;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2c5282;
  }
`;

export default function Button({ label, onClick }: ButtonProps) {
  return <StyledButton onClick={onClick}>{label}</StyledButton>;
}
```

**Giải thích:**

* Styled Component encapsulates style trong JS.
* Props có thể typed cho dynamic styles.

---

### **Level 2: Responsive Card Component với Tailwind**

**Yêu cầu:** Tạo card responsive (mobile → desktop), hover shadow effect.

```tsx
export default function Card() {
  return (
    <div className="max-w-sm p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
      <h3 className="text-xl font-bold mb-2">Card Title</h3>
      <p className="text-gray-700">This is a responsive card example using Tailwind CSS.</p>
    </div>
  );
}
```

**Giải thích:**

* `max-w-sm` → giới hạn chiều rộng card.
* `shadow` + `hover:shadow-lg` → hover effect.
* Responsive tự động theo container width.

---

### **Level 3: Theme Toggle (Dark/Light) với Styled Components + Tailwind + TS**

**Yêu cầu:**

* Dark/light toggle button.
* Component styled với dynamic props.
* Tailwind for global colors.

```tsx
'use client';
import { useState } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }: any) => theme.bg};
    color: ${({ theme }: any) => theme.text};
    transition: background-color 0.3s, color 0.3s;
  }
`;

const themes = {
  light: { bg: '#ffffff', text: '#1a202c' },
  dark: { bg: '#1a202c', text: '#f7fafc' },
};

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #2b6cb0;
  color: white;
  border-radius: 0.375rem;
  font-weight: bold;
  margin-top: 1rem;
`;

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <ThemeProvider theme={themes[theme]}>
      <GlobalStyle />
      <div className="p-4">
        <h1 className="text-2xl font-bold">Current theme: {theme}</h1>
        <Button onClick={toggleTheme}>Toggle Theme</Button>
      </div>
    </ThemeProvider>
  );
}
```

**Giải thích:**

* `ThemeProvider` + `GlobalStyle` → dynamic theme for app.
* Tailwind chỉ dùng cho padding, text sizes, giúp hybrid styling.
* TypeScript đảm bảo `theme` đúng type `'light' | 'dark'`.

---
### Common Pitfalls

* Forget importing CSS Module → className undefined.
* Styled Components: missing props type → runtime error.
* Tailwind: purgeCSS không cấu hình → bundle to lớn.

### Performance/Security Notes

* Avoid inline styles for large projects.
* Use className composition carefully để tránh specificity conflicts.
* Minify CSS + purge unused classes.

[<< Ngày 8](./Day08.md) | [Ngày 10 >>](./Day10.md)

---