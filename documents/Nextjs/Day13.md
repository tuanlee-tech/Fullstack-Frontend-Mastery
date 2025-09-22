# Day 13: File Upload & Handling API

## Mục tiêu học

1. Hiểu cách xử lý file upload trong Next.js (Page Router + App Router).
2. Tạo API routes / route handlers để nhận và validate file.
3. Sử dụng middleware cho size/type checks.
4. Triển khai mock cloud storage (hoặc local storage) cho enterprise pattern.
5. Kiểm soát error, security (file type, size, path traversal).
6. Tích hợp với frontend: preview, progress bar, async upload.

---

## TL;DR

* **Page Router:** `pages/api/upload.ts` với `multer` hoặc `formidable`.
* **App Router:** `app/api/upload/route.ts` với `formidable` hoặc native multipart parsing.
* Frontend: `<input type="file">` + fetch POST.
* Validation: file size, type, extension.
* Enterprise: mock S3 bucket, secure upload path.

---

## 1️⃣ Lý thuyết chi tiết

### 1.1 Cài đặt packages

```bash
npm install formidable
```

* `formidable`: parse multipart form data, works with Next.js.
* Có thể dùng `multer` cho Page Router nếu muốn.

---

### 1.2 Page Router Example

**API Route:** `pages/api/upload.ts`

```ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';

export const config = { api: { bodyParser: false } };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = formidable({ multiples: false, uploadDir: './public/uploads', keepExtensions: true });
  
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });
    const file = files.file;
    res.status(200).json({ filename: Array.isArray(file) ? file[0].newFilename : file.newFilename });
  });
}
```

**Frontend:** `pages/upload.tsx`

```tsx
'use client';
import { useState } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    setMessage(`Uploaded: ${data.filename}`);
  };

  return (
    <div className="flex flex-col gap-2 max-w-md">
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} className="bg-blue-600 text-white p-2 rounded">Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
}
```

---

### 1.3 App Router Example

**Route Handler:** `app/api/upload/route.ts`

```ts
import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';

export const config = { api: { bodyParser: false } };

export async function POST(req: Request) {
  const form = formidable({ multiples: false, uploadDir: './public/uploads', keepExtensions: true });
  
  return new Promise<NextResponse>((resolve) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) return resolve(NextResponse.json({ error: err.message }, { status: 500 }));
      const file = files.file;
      resolve(NextResponse.json({ filename: Array.isArray(file) ? file[0].newFilename : file.newFilename }));
    });
  });
}
```

* `req as any` vì `formidable` expects Node IncomingMessage.

**Frontend** tương tự Page Router, fetch URL: `/api/upload`.

---

### 1.4 File Validation & Security

```ts
const form = formidable({
  multiples: false,
  uploadDir: './public/uploads',
  keepExtensions: true,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  filter: ({ originalFilename }) => !!originalFilename?.match(/\.(jpg|png|pdf)$/i),
});
```

* Validate **file size**, **extension** → prevent malicious upload.
* Luôn upload vào folder riêng, không overwrite file system quan trọng.

---

## 2️⃣ Bài tập

### Level 1: Simple File Upload

* Upload 1 file → API route nhận, return filename.
* Giải: như ví dụ Page Router hoặc App Router.

### Level 2: File Type & Size Validation

* Chỉ cho phép `jpg/png/pdf`, max 5MB.
* Giải: thêm `maxFileSize` + `filter` trong `formidable`.

### Level 3: Async Upload + Preview + Progress

* Frontend: preview image trước khi upload.
* Progress bar khi upload → sử dụng `XMLHttpRequest` hoặc `fetch + onProgress`.
* Mock cloud storage path (`/uploads/cloud/`) để demo enterprise pattern.

---

## 3️⃣ Common Pitfalls Day 13

1. Quên `bodyParser: false` → multipart data không parse được.
2. Không validate file type → security risk.
3. Folder không tồn tại → upload fail.
4. Quên client component → server component không handle `useState`.

---

[<< Ngày 12](./Day12.md) | [Ngày 14 >>](./Day14.md)