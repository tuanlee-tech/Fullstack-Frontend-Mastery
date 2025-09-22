# 📘 Day 4 – Theme & Preferences (Dark/Light Mode, User Settings)

## 🎯 Learning Goals

* Quản lý **theme (dark/light)** bằng Zustand.
* Lưu & restore user preferences (theme, language, layout) từ `localStorage`.
* Hiểu khi nào nên dùng **persist middleware** vs custom localStorage.
* Tổ chức store theo **enterprise pattern** (module tách biệt).

---

## 🔑 Core Concepts

### 1. Store cơ bản cho Theme

```ts
// store/themeStore.ts
import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setTheme: (theme) => set({ theme }),
}));
```

### 2. Dùng trong Component

```tsx
import { useThemeStore } from '../store/themeStore';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? '🌞 Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}
```

---

## ⚡️ Persist Middleware

Trong enterprise app, theme phải **giữ nguyên sau khi reload**. Ta dùng `persist`:

```ts
// store/themeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage', // key lưu trong localStorage
    }
  )
);
```

---

## 🏢 Enterprise Best Practices

1. **Tách store thành module**: `useThemeStore`, `useLanguageStore`, `useLayoutStore`.
   → Team dễ maintain, mỗi feature team quản lý store riêng.

2. **Namespace rõ ràng trong persist**:

   * `theme-storage`, `lang-storage`, `layout-storage`
     → Tránh key conflict trong localStorage.

3. **Sync với system preference (OS theme)**:

   * Lúc init app, check `window.matchMedia('(prefers-color-scheme: dark)')`.

4. **Avoid flash of wrong theme (FOUC)**:

   * Hydrate theme sớm trong SSR (Next.js → `_document.tsx`).

---

## 💡 Interview Q\&A

**Q1: Khác biệt giữa quản lý theme bằng Context API vs Zustand?**

* Context: đơn giản, phù hợp khi chỉ có 1–2 global state.
* Zustand: tốt hơn khi có nhiều global preferences (theme, language, layout) + cần persist.

**Q2: Làm sao tránh FOUC (Flash of Unstyled Content) khi load theme?**

* Dùng SSR để inject `data-theme` ngay từ server.
* Hoặc thêm inline script trong `<head>` đọc từ localStorage trước khi hydrate React.

**Q3: Khi nào nên persist state, khi nào không?**

* Nên persist: theme, language, user preferences, auth token.
* Không nên persist: modal state, ephemeral UI (chỉ sống trong session).

---

## 🧩 Mini Challenge

**Yêu cầu**:

* Tạo `usePreferencesStore` lưu **theme + language**.
* Persist vào localStorage.
* Có 2 nút: `Toggle Theme`, `Switch Language (en/vi)`.
* Khi reload browser → vẫn giữ state cũ.

---

# ✅ Giải pháp mẫu – Preferences Store (Theme + Language)

## 1. Store Module (`usePreferencesStore`)

```ts
// store/preferencesStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';
type Language = 'en' | 'vi';

interface PreferencesState {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  switchLanguage: () => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'en',

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      switchLanguage: () =>
        set((state) => ({
          language: state.language === 'en' ? 'vi' : 'en',
        })),

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'preferences-storage', // namespace tránh conflict
    }
  )
);
```

---

## 2. Component UI (Preferences Panel)

```tsx
// components/PreferencesPanel.tsx
import { usePreferencesStore } from '../store/preferencesStore';

export default function PreferencesPanel() {
  const { theme, language, toggleTheme, switchLanguage } =
    usePreferencesStore();

  return (
    <div style={{ padding: '1rem' }}>
      <h2>User Preferences</h2>
      <p>
        Current Theme: <strong>{theme}</strong>
      </p>
      <button onClick={toggleTheme}>
        Toggle Theme ({theme === 'light' ? '🌞' : '🌙'})
      </button>

      <p style={{ marginTop: '1rem' }}>
        Current Language: <strong>{language}</strong>
      </p>
      <button onClick={switchLanguage}>
        Switch Language ({language === 'en' ? '🇻🇳' : '🇬🇧'})
      </button>
    </div>
  );
}
```

---

## 3. Enterprise Best Practices

* **Module hoá**: Preferences tách riêng `usePreferencesStore` → dễ test, dễ mở rộng.
* **Persist namespace rõ ràng**: `preferences-storage` → không conflict với các store khác.
* **SSR/FOUC**: Khi dùng Next.js, inject theme ngay từ server bằng `<html data-theme="...">`.
* **Scalability**: Có thể thêm preferences khác (timezone, currency, layoutDensity) mà không phá vỡ API.

---

## 4. Checklist trước khi merge code

* [x] Đã viết unit test cho toggle/switch.
* [x] Đặt tên key localStorage theo module.
* [x] Code typed với TypeScript (`Theme`, `Language`).
* [x] Dễ mở rộng thêm preferences khác.
* [x] Không persist state tạm (ví dụ: modal).

---

## 5. Unit Test Mẫu (Jest)

```ts
import { act } from '@testing-library/react';
import { usePreferencesStore } from '../store/preferencesStore';

describe('Preferences Store', () => {
  beforeEach(() => {
    usePreferencesStore.setState({ theme: 'light', language: 'en' });
  });

  it('toggles theme correctly', () => {
    act(() => {
      usePreferencesStore.getState().toggleTheme();
    });
    expect(usePreferencesStore.getState().theme).toBe('dark');
  });

  it('switches language correctly', () => {
    act(() => {
      usePreferencesStore.getState().switchLanguage();
    });
    expect(usePreferencesStore.getState().language).toBe('vi');
  });
});
```




---

📌 [<< Ngày 03](./Day03.md) | [Ngày 05 A - Overview >>](./Day05-A-Overview.md)