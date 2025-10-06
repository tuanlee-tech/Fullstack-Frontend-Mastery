# Day 7: Authentication & Authorization (Page + App Router)

## Mục tiêu học

Sau ngày học này, bạn sẽ:

1. Hiểu cơ chế **authentication** trong Next.js: session, JWT, cookies.
2. Áp dụng **route protection** (client & server) trong Page Router và App Router.
3. Tạo **login, logout, protected routes** production-ready.
4. Biết cách validate **JWT token** server-side và client-side.
5. Viết code maintainable, type-safe, tuân best practices enterprise.

---

## TL;DR

* **Page Router**: check auth trong `getServerSideProps` hoặc middleware.
* **App Router**: route protection bằng **Server Components** hoặc Middleware + `redirect()`.
* Sử dụng **JWT** hoặc session, kết hợp **httpOnly cookies** cho security.
* Tách logic auth ra **service functions reusable**.

---

## 1️⃣ Lý thuyết chi tiết

### 1.1 JWT Auth (simplified)

```ts
// services/auth.ts
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'secret';

export function signToken(userId: string) {
  return jwt.sign({ userId }, SECRET, { expiresIn: '1h' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
```

---

### 1.2 Page Router: Route Protection

```ts
// pages/dashboard.tsx
import { GetServerSideProps } from 'next';
import { verifyToken } from '../services/auth';

export default function Dashboard() {
  return <h1>Welcome to Dashboard</h1>;
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies['token'];
  const user = token ? verifyToken(token) : null;

  if (!user) return { redirect: { destination: '/login', permanent: false } };
  return { props: {} };
};
```

---

### 1.3 App Router: Route Protection

```ts
// app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken } from '../../services/auth';

export default function Dashboard() {
  const token = cookies().get('token')?.value;
  const user = token ? verifyToken(token) : null;
  if (!user) redirect('/login');

  return <h1>Welcome to Dashboard</h1>;
}
```

---

### 1.4 Login / Logout Example

```ts
// pages/api/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { signToken } from '../../services/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    if (username === 'admin' && password === '123') {
      const token = signToken('1');
      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/`);
      return res.status(200).json({ message: 'Logged in' });
    }
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.status(405).json({ message: 'Method Not Allowed' });
}
```

```ts
// pages/api/logout.ts
import { NextApiRequest, NextApiResponse } from 'next';
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', `token=deleted; HttpOnly; Path=/; Max-Age=0`);
  res.status(200).json({ message: 'Logged out' });
}
```

---

## 2️⃣ Bài tập

### Level 1

* **Đề:** Tạo `/dashboard` chỉ hiển thị khi login, nếu không redirect `/login`.
* **Giải:** Page Router `getServerSideProps` hoặc App Router `Server Component` + `redirect()`.

---

### Level 2

* **Đề:** Tạo form login `/login`, gọi API `/api/login` và lưu token httpOnly cookie.
* **Giải:** Tạo form React + fetch POST → set-cookie trên server.

---

### Level 3

* **Đề:** Tạo logout button gọi `/api/logout` và redirect về `/login`.
* **Giải:** Call API logout → delete cookie → redirect.

---

## 3️⃣ Common Pitfalls

* Lưu token trong localStorage → nguy cơ XSS.
* Forget to `HttpOnly` cookie → client JS đọc được → security risk.
* SSR/App Router: không check token server-side → user bypass route.

---

## 4️⃣ Performance / Security Notes

* Always validate token server-side.
* Cookies nên set `Secure`, `HttpOnly`, `SameSite`.
* Để refresh token nếu cần session lâu.

---

## 5️⃣ Further Reading

* [Next.js Authentication](https://nextjs.org/docs/authentication)
* [JWT Introduction](https://jwt.io/introduction)
* [NextAuth.js](https://next-auth.js.org/) – production ready auth library

---

[<< Ngày 6](./Day06.md) | [Ngày 8 >>](./Day08.md)

---
