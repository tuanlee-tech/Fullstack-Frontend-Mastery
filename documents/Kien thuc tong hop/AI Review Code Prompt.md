
1. **Checklists riêng cho State Management** (Redux, Redux Toolkit, Saga, Thunk, Query, Zustand).
2. **CODE_REVIEW_CHECKLIST**: Dùng như checklist tự review + prompt cho AI review code theo chuẩn Senior.
3. **Hướng dẫn cách hỏi AI khi dự án lớn, nhiều file liên quan** → để AI hiểu toàn cảnh chứ không review “chụp mũ” từng file riêng lẻ.

---

# 🗂 1. State Management Checklist

```md
# 🔄 State Management Review Checklist

## 1. Redux / Redux Toolkit
- [ ] Slice có tách biệt rõ ràng theo **domain** (auth, product, order)?  
- [ ] Reducer có **pure function** không (không side effect)?  
- [ ] Action type đặt tên rõ ràng, mô tả được intent?  
- [ ] Có lạm dụng Redux cho state cục bộ UI không (ví dụ: modal open/close)?  
- [ ] Có dùng **createAsyncThunk / RTK Query** thay cho boilerplate không?  

## 2. Redux Thunk
- [ ] Logic async trong thunk có bị quá phức tạp không?  
- [ ] Có handle đầy đủ các trạng thái **pending / fulfilled / rejected**?  
- [ ] Có retry/fallback khi call API fail không?  

## 3. Redux Saga
- [ ] Saga có tách rõ **watcher vs worker**?  
- [ ] Có case nào bắt buộc dùng (debounce API, cancel task, websocket)?  
- [ ] Có bị overkill ở những case chỉ cần thunk không?  
- [ ] Saga có test unit (dễ test hơn thunk)?  

## 4. React Query / TanStack Query
- [ ] Data fetch có dùng query key rõ ràng, tránh conflict?  
- [ ] Có config **retry, staleTime, cacheTime** hợp lý?  
- [ ] Mutation có **optimistic update + rollback**?  
- [ ] Có kết hợp invalidateQueries khi cần refetch?  

## 5. Zustand
- [ ] Store có nhỏ gọn, clear, chỉ cho UI state?  
- [ ] Có selector để tránh re-render toàn bộ component không?  
- [ ] Có middleware cần thiết (persist, devtools)?  

---

## ⚖️ Rule of Thumb
- **Redux Toolkit + Thunk**: chuẩn cho dự án CRUD trung bình.  
- **Saga**: chỉ dùng khi cần: debounce, cancel, websocket, background task.  
- **TanStack Query**: cho data fetch, cache, retry.  
- **Zustand**: thay Context, quản lý state UI cục bộ.  

> Nếu Query đã quản lý API call retry/cache tốt → Saga chỉ giữ cho side effect “ngoại lệ” → tránh dư thừa.
```

---

# 🗂 2. CODE_REVIEW_CHECKLIST

```md
# ✅ Code Review Checklist

Dùng checklist này để tự review hoặc nhờ AI review code.  
Tiêu chí được chia thành 7 nhóm, mỗi nhóm có câu hỏi gợi ý.  

---

## 1. Clean Code & Maintainability
- [ ] Code có tuân theo **SOLID, DRY, KISS**?  
- [ ] Biến, hàm, component đặt tên rõ ràng, có nghĩa?  
- [ ] Có logic trùng lặp cần tách ra **helper/hook/service** không?  
- [ ] Component có quá dài (>200 dòng)? Có thể tách nhỏ không?  

---

## 2. React & State Management
- [ ] Có lạm dụng **Redux/Context** ở chỗ chỉ cần local state không?  
- [ ] Side effects được quản lý đúng chỗ (useEffect / Saga / Thunk)?  
- [ ] Component có bị **re-render không cần thiết** (thiếu memoization)?  
- [ ] State shape có rõ ràng và dễ mở rộng không?  

---

## 3. Performance & Scalability
- [ ] Có dùng **useMemo, useCallback, React.memo** hợp lý?  
- [ ] API call có xử lý **loading, error, retry, cancel**?  
- [ ] Data lớn có **pagination, infinite scroll, lazy loading**?  
- [ ] Có tránh **n+1 API call** không?  

---

## 4. Architecture & Patterns
- [ ] Folder structure có dễ mở rộng (feature-based, domain-based)?  
- [ ] Có áp dụng design patterns phù hợp?  
  - Observer → event bus / socket.  
  - Factory → tạo component/service linh hoạt.  
  - Strategy → filter/sort logic.  
- [ ] Logic business tách khỏi component UI (separation of concerns)?  
- [ ] Có sử dụng **service layer** hoặc **repository layer** cho API không?  

---

## 5. Testing & Reliability
- [ ] Có test unit cho reducer, hook, service?  
- [ ] Có test integration cho flow chính (login, CRUD)?  
- [ ] Edge cases được cover chưa (network error, empty state)?  
- [ ] Có CI/CD để chạy test tự động trước merge không?  

---

## 6. Security & UX
- [ ] Input có được validate (Yup, React Hook Form)?  
- [ ] Có nguy cơ **XSS/CSRF** hoặc **SQL Injection**?  
- [ ] Sensitive info (token, secret) có bị log ra console?  
- [ ] UX: Người dùng có thấy **loading/error feedback** rõ ràng?  
- [ ] Flow có bị block nếu API fail (cần fallback)?  

---

## 7. Improvement Suggestions
- [ ] Có thể refactor code nào để ngắn gọn, clean hơn?  
- [ ] Có thư viện/tool nào thay thế tốt hơn?  
- [ ] Có docs/README cho feature chưa?  
- [ ] Code có dễ hiểu cho dev mới join team không?  

---

## 📌 Hướng dẫn dùng với AI
Khi cần AI review code, copy code snippet + checklist này và thêm prompt:

> "Hãy review code theo checklist dưới đây, đóng vai Senior Frontend Engineer.  
> Nêu rõ: ✅ tốt ở đâu, ⚠️ cần cải thiện gì, 💡 gợi ý refactor hoặc lib phù hợp."

```

👉 File này bạn bỏ vào repo → mỗi khi push code chỉ cần copy phần checklist + code lên AI (hoặc đưa link repo kèm checklist) → sẽ được review chuẩn như công ty thật.

---
# 🧑‍💻 3. Cách hỏi AI khi code nhiều file

Khi dự án lớn, nếu bạn đưa từng file riêng lẻ thì AI sẽ **không hiểu mối quan hệ**. Giải pháp là:

### Bước 1: Chuẩn bị bối cảnh

* Viết **README mini** (1-2 đoạn) giải thích:

  * App làm gì
  * Folder structure
  * Công nghệ chính dùng

Ví dụ:

```md
App: Ecommerce bán sofa
- State: Redux Toolkit + Saga + React Query
- API: RESTful, gọi qua RTK Query
- Folder:
  src/
    features/
      products/
        productsSlice.js
        productsSaga.js
      cart/
        cartSlice.js
    services/api.js
    components/
    pages/
```

---

### Bước 2: Prompt AI để review

```md
Bạn là Senior Frontend Engineer. 
Hãy review code theo checklist dưới đây. 
Đặc biệt tập trung vào State Management (Redux, Saga, Query, Zustand). 

📌 Bối cảnh dự án:
[README mini]

📌 Code cần review (liên quan nhiều file):
1. productsSlice.js
2. productsSaga.js
3. api.js

[Paste code cả 3 file]

Checklist review:
[Paste CODE_REVIEW_CHECKLIST.md + State Management Checklist]
```

---

### Bước 3: Khi code quá dài

Nếu code vượt giới hạn, chia thành **block nhỏ**, mỗi lần paste kèm reminder:

> “Đây là phần 1/3 của code. Hãy nhớ bối cảnh trên, đừng review vội, chỉ lưu context. Tôi sẽ paste tiếp.”

Sau khi paste xong toàn bộ, bạn nói:

> “Ok, hãy review toàn bộ code dựa trên context đã đưa, theo checklist ở trên.”

---

👉 Với cách này, AI sẽ hiểu **toàn cảnh project** + **mối quan hệ các file** và review như code reviewer thật.

---
