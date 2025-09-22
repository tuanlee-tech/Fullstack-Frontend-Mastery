# 🚀 Hướng Dẫn Toàn Diện Về Immer Middleware Trong Zustand

Immer middleware trong Zustand cho phép mutate state trực tiếp một cách an toàn, thay vì phải tạo bản sao thủ công, giúp code ngắn gọn và dễ đọc hơn, đặc biệt với state phức tạp. Chuyên đề này tập trung vào các trường hợp thực tế, từ auth, cart, chat, đến form đa bước, kết hợp với `persist`, `devtools`, và `subscribeWithSelector` để tạo pattern enterprise. Chúng ta sẽ phân tích các vấn đề thường gặp, nguyên nhân, giải pháp kèm code mẫu, các tùy chọn nâng cao, tình huống thực tế, trade-off, best practices, kịch bản bug, và một demo hoàn chỉnh.

---

## 1. Ý Tưởng Chính

Immer middleware sử dụng thư viện Immer để:
- Cho phép mutate state trực tiếp trong hàm `set` (như `state.x = value`).
- Tự động tạo bản sao state (immutable) bên dưới, đảm bảo tính an toàn.
- Rất hữu ích cho state lồng ghép (nested objects/arrays).

Ví dụ không Immer vs có Immer:
```ts
// Không Immer
set((state) => ({
  items: [...state.items, newItem], // Phải clone thủ công
  user: { ...state.user, name: newName },
}));

// Có Immer
set((state) => {
  state.items.push(newItem); // Mutate trực tiếp
  state.user.name = newName;
});
```

---

## 2. Cú Pháp Cơ Bản

```ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type CounterState = {
  count: number;
  inc: () => void;
};

export const useCounterStore = create<CounterState>()(
  immer((set) => ({
    count: 0,
    inc: () => set((state) => {
      state.count += 1; // Mutate trực tiếp
    }),
  }))
);
```

👉 Wrap middleware `immer` để enable mutation an toàn.

---

## 3. Các Vấn Đề Thường Gặp Và Giải Pháp

Dưới đây là các vấn đề phổ biến khi sử dụng `immer`, kèm phân tích nguyên nhân và cách khắc phục.

### 3.1. Hiệu Suất Với State Lớn
**Vấn đề:** Mutate state lớn (nhiều nested objects/arrays) gây chậm.

**Nguyên nhân:** Immer tạo draft copy toàn bộ state.

**Giải pháp:** Chỉ mutate field cần, tránh chạm vào state không liên quan.

**Code mẫu:**
```ts
set((state) => {
  state.items.push(item); // Chỉ mutate items
  // Tránh: state.unrelatedField = state.unrelatedField
});
```

### 3.2. Sai Lầm Khi Mutate Ngoài Set
**Vấn đề:** Mutate state ngoài `set` (ví dụ: trong async function) không hoạt động.

**Nguyên nhân:** Immer chỉ hoạt động trong `set`.

**Giải pháp:** Luôn mutate trong `set`.

**Code sai:**
```ts
const state = useStore.getState();
state.count += 1; // ❌ Không hoạt động
```

**Code fix:**
```ts
useStore.setState((state) => {
  state.count += 1; // ✅
});
```

### 3.3. Tích Hợp Với Middleware Khác Sai Thứ Tự
**Vấn đề:** State không đúng khi kết hợp persist/devtools.

**Nguyên nhân:** Immer cần ở trong cùng để mutation hoạt động trước khi persist/devtools xử lý.

**Giải pháp:** Wrap immer trong cùng, trước persist/devtools.

**Code mẫu:**
```ts
create(
  devtools(
    persist(
      immer((set) => ({ /* state */ })),
      { name: "store" }
    ),
    { name: "Store" }
  )
);
```

### 3.4. Debug Khó Với Nested State
**Vấn đề:** Nested state phức tạp, khó trace thay đổi.

**Nguyên nhân:** Không có devtools hoặc log không rõ.

**Giải pháp:** Kết hợp devtools và đặt tên action rõ ràng.

**Code mẫu:**
```ts
import { devtools } from "zustand/middleware";

create(
  devtools(
    immer((set) => ({
      nested: { a: { b: 0 } },
      update: () => set((state) => {
        state.nested.a.b += 1;
      }, false, "nested/update"),
    })),
    { name: "NestedStore" }
  )
);
```

### 3.5. Lỗi Với Non-Serializable Data
**Vấn đề:** State chứa Date/Function, gây lỗi khi kết hợp persist.

**Nguyên nhân:** Immer không xử lý tốt non-serializable types.

**Giải pháp:** Loại bỏ non-serializable fields hoặc dùng partialize.

**Code mẫu:**
```ts
import { persist } from "zustand/middleware";

create(
  persist(
    immer((set) => ({
      date: new Date(), // ❌ Gây lỗi
      value: 0,
      inc: () => set((state) => { state.value += 1; }),
    })),
    { name: "store", partialize: (state) => ({ value: state.value }) }
  )
);
```

---

## 4. Tóm Tắt Các Vấn Đề Và Giải Pháp

| Vấn Đề                    | Nguyên Nhân                          | Giải Pháp                                   |
| ------------------------- | ------------------------------------ | ------------------------------------------- |
| Hiệu suất với state lớn   | Draft copy toàn state                | Chỉ mutate field cần                        |
| Mutate ngoài set          | Immer chỉ hoạt động trong set        | Luôn mutate trong set                       |
| Middleware sai thứ tự     | Immer không ở trong cùng             | Wrap immer trước persist/devtools           |
| Debug khó với nested      | Không log/trace rõ                   | Kết hợp devtools, đặt tên action            |
| Non-serializable data     | Date/Function trong state            | partialize để loại bỏ                       |

---

## 5. Cheatsheet Immer Middleware

Immer không có nhiều option cấu hình, nhưng cách sử dụng cần chú ý:

```ts
create(
  immer((set, get) => ({
    state: {},
    action: () => set((state) => {
      state.field = newValue; // Mutate trực tiếp
    }),
  }))
);
```

### Best Practices
1. **Chỉ Mutate Cần Thiết:** Tránh chạm vào state không liên quan.
2. **Kết Hợp Middleware Đúng Thứ Tự:** Immer trong cùng, trước persist/devtools.
3. **Dùng Với Devtools:** Đặt tên action rõ ràng để debug.
4. **Tránh Non-Serializable:** Loại bỏ Date/Function khi persist.
5. **Sử Dụng Lodash Cho Path:** Với nested state, dùng `lodash.set` để update động.

---

## 6. Các Tình Huống Thực Tế

### 6.1. Shopping Cart (Level 1)
```ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
}

export const useCartStore = create<CartState>()(
  immer((set) => ({
    items: [],
    addItem: (item) => set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        existing.qty += item.qty;
      } else {
        state.items.push(item);
      }
    }),
    removeItem: (id) => set((state) => {
      state.items = state.items.filter((i) => i.id !== id);
    }),
    updateQty: (id, qty) => set((state) => {
      const item = state.items.find((i) => i.id === id);
      if (item) item.qty = qty;
    }),
  }))
);
```

**Trade-off:** Mutate trực tiếp (qty += item.qty), gọn gàng hơn clone thủ công. Phù hợp cho CRUD đơn giản.

### 6.2. Chat Store (Level 2)
```ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface Message {
  id: string;
  user: string;
  text: string;
}

interface Room {
  id: string;
  name: string;
  messages: Message[];
}

interface ChatState {
  rooms: Room[];
  addMessage: (roomId: string, msg: Message) => void;
  removeMessage: (roomId: string, msgId: string) => void;
  renameRoom: (roomId: string, newName: string) => void;
}

export const useChatStore = create<ChatState>()(
  immer((set) => ({
    rooms: [],
    addMessage: (roomId, msg) => set((state) => {
      const room = state.rooms.find((r) => r.id === roomId);
      if (room) room.messages.push(msg);
    }),
    removeMessage: (roomId, msgId) => set((state) => {
      const room = state.rooms.find((r) => r.id === roomId);
      if (room) {
        room.messages = room.messages.filter((m) => m.id !== msgId);
      }
    }),
    renameRoom: (roomId, newName) => set((state) => {
      const room = state.rooms.find((r) => r.id === roomId);
      if (room) room.name = newName;
    }),
  }))
);
```

**Trade-off:** Xử lý nested state (room.messages) dễ dàng, không cần map/clone phức tạp.

### 6.3. Multi-Step Form (Level 3)
```ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { set as lodashSet } from "lodash";

interface FormData {
  user: { name: string; email: string };
  address: { street: string; city: string };
  preferences: { newsletter: boolean; theme: "light" | "dark" };
}

interface FormState {
  formData: FormData;
  updateField: (path: string, value: any) => void;
  resetForm: () => void;
}

const initialData: FormData = {
  user: { name: "", email: "" },
  address: { street: "", city: "" },
  preferences: { newsletter: false, theme: "light" },
};

export const useFormStore = create<FormState>()(
  immer((set) => ({
    formData: initialData,
    updateField: (path, value) => set((state) => {
      lodashSet(state.formData, path, value); // Update động
    }),
    resetForm: () => set((state) => {
      state.formData = initialData;
    }),
  }))
);
```

**Sử dụng:**
```tsx
const { formData, updateField } = useFormStore();

<input
  value={formData.user.name}
  onChange={(e) => updateField("user.name", e.target.value)}
/>
<select
  value={formData.preferences.theme}
  onChange={(e) => updateField("preferences.theme", e.target.value as "light" | "dark")}
>
  <option value="light">Light</option>
  <option value="dark">Dark</option>
</select>
```

**Trade-off:** Linh hoạt với nested state, update động bằng path, gọn gàng hơn clone thủ công.

---

## 7. Kịch Bản Bug Thường Gặp Với Immer

### 7.1. Hiệu Suất Với State Lớn
**Vấn đề:** Mutate nhiều field gây chậm.

**Code sai:**
```ts
set((state) => {
  state.largeArray.forEach((item) => item.value += 1); // Mutate toàn bộ
});
```

**Code fix:**
```ts
set((state) => {
  const item = state.largeArray.find((i) => i.id === targetId);
  if (item) item.value += 1; // Chỉ mutate item cần
});
```

### 7.2. Mutate Ngoài Set
**Vấn đề:** Mutate trực tiếp state không hoạt động.

**Code sai:**
```ts
const state = useStore.getState();
state.items.push(item); // ❌ Không trigger update
```

**Code fix:**
```ts
useStore.setState((state) => {
  state.items.push(item); // ✅
});
```

### 7.3. Middleware Sai Thứ Tự
**Vấn đề:** Immer không hoạt động khi ở ngoài persist/devtools.

**Code sai:**
```ts
create(
  immer(
    persist(
      (set) => ({ /* state */ }),
      { name: "store" }
    )
  )
);
```

**Code fix:**
```ts
create(
  devtools(
    persist(
      immer((set) => ({ /* state */ })),
      { name: "store" }
    ),
    { name: "Store" }
  )
);
```

### 7.4. Debug Khó
**Vấn đề:** Nested state khó trace thay đổi.

**Code fix:**
```ts
create(
  devtools(
    immer((set) => ({
      nested: { a: { b: 0 } },
      update: () => set((state) => {
        state.nested.a.b += 1;
      }, false, "nested/update"),
    })),
    { name: "NestedStore" }
  )
);
```

### 7.5. Non-Serializable Data
**Vấn đề:** Lỗi khi persist Date/Function.

**Code fix:**
```ts
create(
  persist(
    immer((set) => ({
      value: 0,
      inc: () => set((state) => { state.value += 1; }),
    })),
    { name: "store", partialize: (state) => ({ value: state.value }) }
  )
);
```

---

## 8. Trade-Off & Best Practices Của Immer

### 8.1. Ưu Điểm
1. **Code Ngắn Gọn:** Mutate trực tiếp, không cần clone thủ công.
2. **Dễ Xử Lý Nested State:** Lý tưởng cho form, chat, cart phức tạp.
3. **Tích Hợp Tốt:** Với persist, devtools, subscribeWithSelector.

### 8.2. Nhược Điểm
1. **Hiệu Suất Với State Lớn:** Copy draft tốn CPU nếu state lớn.
2. **Dễ Lạm Dụng:** Mutate ngoài set không hoạt động.
3. **Non-Serializable Issues:** Cần partialize khi persist.

### 8.3. Best Practices
1. **Chỉ Mutate Cần Thiết:** Tránh chạm vào field không liên quan.
2. **Đúng Thứ Tự Middleware:** Immer trong cùng.
3. **Kết Hợp Devtools:** Đặt tên action rõ để trace.
4. **Partialize Với Persist:** Loại bỏ non-serializable fields.
5. **Dùng Lodash Path:** Cho update động nested state.

---

## 9. Demo: User Preferences Store (Kết Hợp Immer + Persist + SubscribeWithSelector + Devtools)

```ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, devtools, subscribeWithSelector } from "zustand/middleware";

type PreferencesState = {
  theme: "light" | "dark";
  language: "en" | "vi";
  settings: {
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
  setTheme: (theme: "light" | "dark") => void;
  setLanguage: (lang: "en" | "vi") => void;
  toggleNotification: (type: "email" | "push") => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set) => ({
          theme: "light",
          language: "en",
          settings: {
            notifications: {
              email: false,
              push: false,
            },
          },
          setTheme: (theme) => set((state) => {
            state.theme = theme;
          }, false, "preferences/setTheme"),
          setLanguage: (lang) => set((state) => {
            state.language = lang;
          }, false, "preferences/setLanguage"),
          toggleNotification: (type) => set((state) => {
            state.settings.notifications[type] = !state.settings.notifications[type];
          }, false, `preferences/toggleNotification/${type}`),
        }))
      ),
      {
        name: "preferences-storage",
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
          settings: state.settings,
        }),
      }
    ),
    { name: "PreferencesStore", enabled: process.env.NODE_ENV === "development" }
  )
);

// Auto-sync analytics
export const initPreferencesSubscribers = () => {
  const unsubTheme = usePreferencesStore.subscribe(
    (s) => s.theme,
    (theme, prevTheme) => {
      console.log(`Theme changed: ${prevTheme} → ${theme}`);
      fetch("/api/analytics", { method: "POST", body: JSON.stringify({ event: "theme_change", value: theme }) });
    }
  );

  const unsubNotifications = usePreferencesStore.subscribe(
    (s) => s.settings.notifications,
    (notifications, prev) => {
      console.log("Notifications updated:", notifications);
    },
    { equalityFn: shallow }
  );

  return () => {
    unsubTheme();
    unsubNotifications();
  };
};
```

**Sử dụng:**
```tsx
import { usePreferencesStore, initPreferencesSubscribers } from "./stores/preferences";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    return initPreferencesSubscribers();
  }, []);

  const { theme, setTheme, settings, toggleNotification } = usePreferencesStore();

  return (
    <div>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle Theme: {theme}
      </button>
      <label>
        <input
          type="checkbox"
          checked={settings.notifications.email}
          onChange={() => toggleNotification("email")}
        />
        Email Notifications
      </label>
    </div>
  );
}
```

**Điểm Mạnh:**
- **Immer:** Mutate nested state (settings.notifications.email) dễ dàng.
- **Persist:** Lưu theme/language/notifications qua reload.
- **SubscribeWithSelector:** Auto-sync analytics ngoài UI.
- **Devtools:** Debug action (preferences/setTheme) rõ ràng.

**Nếu Sai:**
- Không Immer: Clone thủ công phức tạp.
- Không Persist: Mất state khi reload.
- Không SubscribeWithSelector: Logic sync lẫn vào UI.
- Không Devtools: Khó trace thay đổi.

---

## 10. Tổng Kết

Immer middleware giúp viết code ngắn gọn, dễ xử lý nested state, nhưng cần cẩn thận:
- **Hiệu suất:** Chỉ mutate field cần.
- **Middleware thứ tự:** Immer trong cùng.
- **Debug:** Kết hợp devtools.
- **Persist:** Loại bỏ non-serializable.

**Case thực tế:** Cart, chat, form đa bước, preferences đều hưởng lợi từ Immer.


---

📌 [<< Ngày 05 C - Devtools](./Day05-C-Devtools.md) | [Ngày 05 E - subscribeWithSelector >>](./Day05-E-SubscribeWithSelector.md)
