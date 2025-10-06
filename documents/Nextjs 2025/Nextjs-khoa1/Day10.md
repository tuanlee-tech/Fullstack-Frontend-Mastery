## **Day 10 **

### **Level 1: Sử dụng `next/image` cơ bản**

**Yêu cầu:** Hiển thị ảnh tối ưu với width/height và alt text.

#### **Page Router**

```tsx
// pages/index.tsx
import Image from 'next/image';

export default function Home() {
  return (
    <div>
      <h1>Next.js Image Optimization</h1>
      <Image
        src="/images/sample.jpg"
        width={600}
        height={400}
        alt="Sample Image"
      />
    </div>
  );
}
```

**Giải thích:**

* `next/image` tự động resize, lazy load.
* SSR + optimized image format.

#### **App Router**

```tsx
// app/page.tsx
import Image from 'next/image';

export default function Page() {
  return (
    <div>
      <h1>Next.js App Router Image</h1>
      <Image
        src="/images/sample.jpg"
        width={600}
        height={400}
        alt="Sample Image"
        placeholder="blur"
      />
    </div>
  );
}
```

* `placeholder="blur"` → UX tốt, giảm layout shift.

---

### **Level 2: Responsive Image với `sizes` và layout**

**Yêu cầu:** Tối ưu cho mobile → desktop.

```tsx
<Image
  src="/images/responsive.jpg"
  alt="Responsive Image"
  width={1200}
  height={800}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

**Giải thích:**

* `sizes` cho browser chọn ảnh đúng resolution.
* Giảm tải băng thông, cải thiện LCP.

---

### **Level 3: Asset Optimization + Cloud/Static Hosting**

**Yêu cầu:**

* Tải fonts, static JSON, images, cache hiệu quả.
* Page Router + App Router.

#### **Page Router: public folder + caching**

```ts
// next.config.js
module.exports = {
  images: { domains: ['example.com'] },
  async headers() {
    return [
      {
        source: '/(.*).(jpg|png|svg|webp)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};
```

* Static assets public folder: `/public/images/...`
* Cache headers lâu dài → CDN-friendly.

#### **App Router: Cloud storage + fetch**

```tsx
// app/page.tsx
import Image from 'next/image';

export default async function Page() {
  const imageUrl = 'https://example-bucket.s3.amazonaws.com/photo.jpg';

  return <Image src={imageUrl} width={800} height={600} alt="Cloud Image" />;
}
```

* Next.js tối ưu remote images (cần khai báo domain trong `next.config.js`).

---

### ✅ Common Pitfalls Day 10

1. Quên width/height → layout shift, CLS cao.
2. Không khai báo domain → remote image không hiển thị.
3. Quá nhiều ảnh high-res → ảnh hưởng LCP.
4. Cache headers không set → assets load chậm, không tận dụng CDN.

---

[<< Ngày 9](./Day09.md) | [Ngày 11 >>](./Day11.md)
