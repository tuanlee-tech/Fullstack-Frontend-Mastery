<div align="center">
  <h1> 30 Days Of React: Context</h1>
  <a class="header-badge" target="_blank" href="https://www.linkedin.com/in/asabeneh/">
  <img src="https://img.shields.io/badge/style--5eba00.svg?label=LinkedIn&logo=linkedin&style=social">
  </a>
  <a class="header-badge" target="_blank" href="https://twitter.com/Asabeneh">
  <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/asabeneh?style=social">
  </a>

<sub>Author:
<a href="https://www.linkedin.com/in/asabeneh/" target="_blank">Asabeneh Yetayeh</a><br>
<small> October, 2020</small>
</sub>

</div>

[<< Day 25](../25_Custom_Hooks/25_custom_hooks.md) | [Day 27>>](../27_Ref/27_ref.md)

![30 Days of React banner](../images/30_days_of_react_banner_day_26.jpg)

# Context

Context allow as to pass data through the component tree without having to pass props down manually to every child component at every level.

In React, data is passed top-down (parent to child) via props, but this can be cumbersome for certain types of props (e.g. locale preference, UI theme) that are required by many components within an application. Context provides a way to share values like these between components without having to explicitly pass a prop through every level of the tree.

## When to Use Context

Context is designed to share data that can be considered “global” for a tree of React components, such as the current authenticated user, theme, or preferred language. For example, in the code below we manually thread through a “theme” prop in order to style the Button component:

The above text has been taken from [react documentation](https://reactjs.org/docs/context.html) without any change.

It seems the react documentation has pretty good information about context, you can go through the [react documentation](https://reactjs.org/docs/context.html).

# Exercises: Level 1 – React Context

**Task / Nhiệm vụ:**
Practice creating and using React Context to share global data like theme and user without prop drilling.

---

## 🇺🇸 / 🇻🇳 Exercise Description

**Requirements / Yêu cầu:**

1. Create a `ThemeContext` that stores `'light'` or `'dark'`.

   * Tạo `ThemeContext` lưu theme `'light'` hoặc `'dark'`.

2. Provide the `ThemeContext` to the component tree.

   * Bao bọc ứng dụng bằng `ThemeContext.Provider`.

3. Make a button component that toggles the theme.

   * Tạo nút bấm toggle theme.

4. Display the current theme in a header component.

   * Hiển thị theme hiện tại trong header.

5. Create a `UserContext` to store user info: name & email.

   * Tạo `UserContext` lưu thông tin user: tên và email.

6. Display user info in a `Profile` component without passing props manually.

   * Hiển thị thông tin user trong `Profile` component mà không dùng prop drilling.

---

## 🇺🇸 / 🇻🇳 Solution – React Context Example

### ThemeContext.js

```javascript
import { createContext } from 'react';

// Default value 'light'
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {}
});

export default ThemeContext;
```

### UserContext.js

```javascript
import { createContext } from 'react';

// Default user
const UserContext = createContext({
  user: { name: 'Guest', email: 'guest@example.com' }
});

export default UserContext;
```

### App.js

```javascript
import React, { useState } from 'react';
import ThemeContext from './ThemeContext';
import UserContext from './UserContext';
import Header from './Header';
import Profile from './Profile';
import ThemeToggleButton from './ThemeToggleButton';

const App = () => {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const user = { name: 'John Doe', email: 'john@example.com' };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <UserContext.Provider value={{ user }}>
        <div
          style={{
            backgroundColor: theme === 'light' ? '#f5f5f5' : '#333',
            color: theme === 'light' ? '#000' : '#fff',
            minHeight: '100vh',
            padding: '16px'
          }}
        >
          <Header />
          <ThemeToggleButton />
          <Profile />
        </div>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;
```

### Header.js

```javascript
import React, { useContext } from 'react';
import ThemeContext from './ThemeContext';

const Header = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <header>
      <h1>Current Theme / Chủ đề hiện tại: {theme.toUpperCase()}</h1>
    </header>
  );
};

export default Header;
```

### ThemeToggleButton.js

```javascript
import React, { useContext } from 'react';
import ThemeContext from './ThemeContext';

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: '8px 16px',
        margin: '16px 0',
        backgroundColor: theme === 'light' ? '#eee' : '#555',
        color: theme === 'light' ? '#000' : '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Toggle Theme
    </button>
  );
};

export default ThemeToggleButton;
```

### Profile.js

```javascript
import React, { useContext } from 'react';
import UserContext from './UserContext';
import ThemeContext from './ThemeContext';

const Profile = () => {
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);

  return (
    <div
      style={{
        border: '1px solid',
        borderColor: theme === 'light' ? '#ccc' : '#888',
        borderRadius: '8px',
        padding: '16px',
        maxWidth: '300px'
      }}
    >
      <h2>Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default Profile;
```

---

### ✅ Key Points / Lưu ý

1. **Provider**: Context giúp chia sẻ giá trị toàn bộ component tree.
2. **useContext**: Functional components dùng để đọc context.
3. **Avoid prop drilling**: Không cần truyền props qua nhiều cấp nữa.
4. **Multiple contexts**: Có thể kết hợp ThemeContext + UserContext.
5. **Dynamic update**: Nút toggle theme update UI toàn app ngay lập tức.

🎉 CONGRATULATIONS ! 🎉
[<< Day 25](../25_Custom_Hooks/25_custom_hooks.md) | [Day 27>>](../27_Ref/27_ref.md)
