Prompt này đã bao gồm *mọi yêu cầu về cấu trúc, đầu ra, chất lượng code, bài tập, đánh giá, output file, tiêu chuẩn enterprise* — dùng trực tiếp sẽ giúp mình tạo ra khoá học theo đúng tiêu chí của bạn (newbie → senior, production-ready, ví dụ thực tế, bài tập kèm lời giải).

> **Hướng dẫn dùng**: Khi bạn muốn tạo khoá mới, paste toàn bộ prompt này và chỉ thay những phần trong ngoặc nhọn `{...}` (ví dụ: `{TOPIC}`, `{DURATION_DAYS}`, `{TARGET_AUDIENCE}`, ...). Nếu muốn, có thể kèm thêm ràng buộc đặc biệt (ví dụ: “chỉ React, không Next”, “bao gồm TypeScript + Redux”, “chỉ backend”, v.v.).

---

# 🚀 Prompt Chuẩn — Tạo khoá học lập trình chuyên sâu (copy/paste)

```
Tôi muốn bạn tạo một khoá học lập trình chuyên sâu theo format và tiêu chuẩn sau. Viết hoàn toàn bằng tiếng Việt (chỉ giữ từ khoá code bằng tiếng Anh). Trả về kết quả dạng Markdown và kèm file code mẫu (nếu có). Không hỏi thêm, cứ tạo theo thông tin dưới — nếu cần chỗ nào mơ hồ, hãy chọn phương án “senior-friendly” và giải thích lý do trong output.

1) Thông tin chung:
- Chủ đề khoá học (Topic): {TOPIC}
- Mục tiêu học (Goal): từ {STARTING_LEVEL} → {TARGET_LEVEL} (ví dụ: newbie → senior)
- Độ dài khoá: {DURATION_DAYS} ngày (hoặc modules). Nếu cần, đề xuất kéo dài/ổn định.
- Đối tượng mục tiêu: {TARGET_AUDIENCE} (ví dụ: Frontend dev muốn chuyển sang fullstack, new grad, ...).
- Yêu cầu đầu vào (Prerequisites): {PREREQS} (ví dụ: JS cơ bản, HTML/CSS, Node cơ bản)
- Ngôn ngữ giảng dạy: Tiếng Việt, giữ keyword code bằng tiếng Anh.
- Phong cách: production-ready, clean code, senior-level depth, có enterprise/practical use-cases.

2) Định dạng đầu ra (bắt buộc):
- Toàn bộ khoá: Mục lục chi tiết theo ngày/module (danh sách tóm tắt).
- Mỗi **ngày/module** gồm (cụ thể, theo thứ tự):
  a. Tiêu đề ngày/module.
  b. Mục tiêu học (3–6 mục tiêu cụ thể, measurable).
  c. Tóm tắt ngắn (TL;DR 1 đoạn).
  d. Nội dung lý thuyết chi tiết (có giải thích, khi nào/ở đâu dùng trong enterprise).
  e. Ví dụ thực tế, code sạch (production-ready), có chú thích.
  f. Bài tập theo 3 cấp độ (Level 1 → 3), mỗi level kèm **đề + lời giải giải thích từng bước**.
  g. Common pitfalls & performance/security notes.
  h. Further reading / references (sách, docs, pattern names).
- Kèm 3 mini-projects được dàn trải trong khoá, và 1 capstone project (chi tiết yêu cầu, acceptance criteria).
- Kèm checklist “Điều phải làm” trước khi merge code (lint, tests, types, docs).
- Xuất ra: tập hợp file Markdown cho mỗi ngày (`day-01.md`, ...), thư mục `examples/day-xx/` chứa mã nguồn mẫu, và `capstone/` với spec.

3) Chất lượng code & tiêu chuẩn kỹ thuật:
- Mã nguồn phải sạch, production-ready, tuân theo best-practices (clear naming, small functions, single-responsibility).
- Nếu ngôn ngữ là JS/TS: include `package.json` mẫu, `tsconfig.json` (nếu TS), cấu hình ESLint + Prettier (mẫu).
- Kèm unit tests cơ bản (Jest hoặc tương đương) cho mỗi mini-project (ít nhất 3 test case).
- Nếu có API: định nghĩa contract types (OpenAPI mock hoặc typed `ApiResponse<T>`), bao gồm input validation example (zod/io-ts hoặc runtime check).
- Nếu có phần React: ví dụ component phải typed (props/state/hooks), kèm ví dụ test (react-testing-library).
- Nêu rõ phiên bản công cụ/libraries đề xuất (ví dụ Node 18+, TypeScript 5.x, React 18+) và lưu ý nếu cần cập nhật.

4) Giảng dạy & pedagogical:
- Mỗi ngày luận giải từ cơ bản → nâng cao, kèm ví dụ “mini real-world” (ví dụ: form validation, API client, state management, performance).
- Mỗi bài tập có **độ khó tăng dần**, có hướng dẫn, lời giải chi tiết và tips debugging.
- Mỗi phần quan trọng có checklist “ứng dụng enterprise” (ví dụ: khi triển khai feature này trong team, lưu ý code review, backwards-compatibility, migration).
- Cung cấp **các câu hỏi phỏng vấn (10–15 câu)** liên quan từng module (kèm gợi ý đáp án tóm tắt).

5) Đầu ra bổ trợ (optional nhưng mong muốn):
- Slide summary one-pager cho mỗi module (bullet points).
- Cheatsheet (tập hợp các snippets quan trọng).
- Git repo structure suggestion (folders, naming).
- Sample README cho project & deployment notes.
- Rubric đánh giá bài tập / project (pass/fail criteria, scoring).

6) Yêu cầu về ngôn ngữ & style:
- Viết bằng tiếng Việt, rõ ràng, ngắn gọn nhưng đầy đủ. Giữ tone chuyên nghiệp, thân thiện.
- Tránh tả lặp, dùng bullets, code blocks, tables khi cần.
- Nêu rõ **khi nào nội dung có thể lỗi thời** (ví dụ: API, phiên bản libs)—khuyến cáo kiểm tra version.

7) Output example expectation:
- Trả về: `course-outline.md` (mục lục toàn khoá), và `day-01.md` như mẫu (chi tiết), cộng `examples/day-01/*` code files.
- Trong reply đầu tiên, hãy: (A) show toàn bộ course outline (từ day 1 → day N), (B) render **Day 1 full** (giống Day 1 mẫu), (C) cung cấp link/zip path giả định cho code examples (ví dụ `./examples/day-01/hello.ts`) — file thực tế có thể attach nếu platform hỗ trợ.

8) Yêu cầu bổ sung & checklist trước khi hoàn thành:
- Đảm bảo các code ví dụ compile/run locally với commands kèm theo (vd `npm i && npm run build && npm test`). Nếu không thể chạy trực tiếp, ghi rõ lý do và cách kiểm tra thủ công.
- Tất cả ví dụ phải follow strict typing (nếu là TS), avoid `any` trừ khi minh hoạ nguyên do.
- Trong phần lời giải bài tập, nêu rõ **tại sao** chọn cách giải này (trade-offs).
- Nếu có lựa chọn thiết kế (ví dụ: dùng Redux hay Zustand), liệt kê pros/cons và khuyến nghị cho project size.

9) Khi nhận prompt này, nếu bạn cần rút gọn (ngắn) output, chỉ khi tôi yêu cầu “gói gọn” — mặc định hãy output đầy đủ.

---

**Ví dụ (filling mẫu nhanh):**
{  
  TOPIC: "TypeScript — From Zero to Senior (45 days)",  
  STARTING_LEVEL: "newbie (JS cơ bản)",  
  TARGET_LEVEL: "Senior Frontend/Fullstack Engineer (TypeScript-first)",  
  DURATION_DAYS: 45,  
  TARGET_AUDIENCE: "Frontend developers, backend devs muốn chuyển sang TS",  
  PREREQS: "Hiểu cơ bản JavaScript (ES6), Node/npm, HTML/CSS"  
}

```

---

# 🔁 Ví dụ đã điền (mẫu bạn có thể dùng ngay)

Mình cũng chuẩn hoá một **ví dụ prompt đã hoàn chỉnh** (dùng cho khoá TypeScript 45 ngày) — paste prompt này mỗi khi bạn muốn mình tạo lại khoá theo bản final:

```
Tôi muốn một khoá học: "TypeScript — From Zero to Senior (45 days)". Mục tiêu: newbie (JS cơ bản) → senior TS-first engineer. Duration: 45 days. Target: Frontend devs and backend devs. Prereqs: JS ES6, Node/npm. Language: Vietnamese. Format: full daily lessons, each day includes objectives, TL;DR, theory, real-world examples, production-ready code, exercises Level1-3 with solutions, mini-projects, capstone. Include ESLint/Prettier config, tsconfig, package.json examples, unit tests (Jest), and Git repo structure. Ensure code compiles, avoid 'any', use strict typing. Provide course-outline.md and full day-01.md plus code samples in ./examples/day-01/.
```

---

# ✅ Ghi chú cuối cùng (lưu ý khi bạn dùng prompt)

* Dán nguyên prompt vào chat khi cần khoá mới — đừng cắt bớt thông tin quan trọng nếu bạn muốn kết quả đầy đủ.
* Nếu muốn phiên bản rút gọn/ngắn gọn (ví dụ: chỉ summary), thêm dòng `Output length: SHORT` phía cuối prompt.
* Mình đã ghi nhớ yêu cầu style/giao diện khoá học này và sẽ áp dụng cho mọi khóa bạn yêu cầu sau này (NextJS, ReactJS, v.v.).

---