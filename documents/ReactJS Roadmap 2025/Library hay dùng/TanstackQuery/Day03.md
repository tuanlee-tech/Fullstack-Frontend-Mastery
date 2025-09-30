# **Day 3: useMutation – Thêm/Sửa/Xóa dữ liệu**

### **Mục tiêu**

* Hiểu hook `useMutation` để thao tác dữ liệu (POST/PUT/DELETE).
* Áp dụng **optimistic updates** để UX mượt mà.
* Sử dụng **invalidateQueries** để refresh dữ liệu sau mutation.
* Rollback dữ liệu khi mutation thất bại.

---

### **1️⃣ useMutation cơ bản**

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

async function addUser(newUser: { name: string }) {
  const res = await axios.post('https://jsonplaceholder.typicode.com/users', newUser);
  return res.data;
}

function AddUserButton() {
  const queryClient = useQueryClient();

  const mutation = useMutation(addUser, {
    onSuccess: () => {
      // Refetch users sau khi thêm thành công
      queryClient.invalidateQueries(['users']);
    },
  });

  return (
    <button onClick={() => mutation.mutate({ name: 'New User' })}>
      Add User
    </button>
  );
}

export default AddUserButton;
```

---

### **2️⃣ Optimistic Update**

* Thay đổi UI ngay lập tức trước khi server trả về kết quả.
* Rollback nếu mutation thất bại.

```ts
const mutation = useMutation(addUser, {
  onMutate: async (newUser) => {
    await queryClient.cancelQueries(['users']);
    const previousUsers = queryClient.getQueryData(['users']);

    queryClient.setQueryData(['users'], (old: any) => [...old, newUser]);

    return { previousUsers };
  },
  onError: (err, newUser, context) => {
    queryClient.setQueryData(['users'], context?.previousUsers);
  },
  onSettled: () => {
    queryClient.invalidateQueries(['users']);
  },
});
```

**Tips:**

* `onMutate` chạy ngay trước khi mutation gửi request.
* `onError` dùng để rollback dữ liệu khi server lỗi.
* `onSettled` đảm bảo query luôn được cập nhật, bất kể thành công hay thất bại.

---

### **3️⃣ CRUD ví dụ đầy đủ**

* **Add User**: `POST /users`
* **Edit User**: `PUT /users/:id`
* **Delete User**: `DELETE /users/:id`

```ts
const addUserMutation = useMutation(addUser, {...});
const editUserMutation = useMutation(editUser, {...});
const deleteUserMutation = useMutation(deleteUser, {...});
```

---

### **4️⃣ Bài tập**

| Level | Nội dung          | Yêu cầu                                                                        |
| ----- | ----------------- | ------------------------------------------------------------------------------ |
| 1     | Thêm user mới     | Dùng `useMutation`, sau khi thành công invalidate queries để refresh danh sách |
| 2     | Optimistic update | UI thêm user ngay lập tức, rollback khi mutation lỗi                           |
| 3     | Full CRUD         | Add/Edit/Delete với optimistic update + validation, refresh danh sách tự động  |

**Gợi ý Level 3: Delete User**

```ts
const deleteMutation = useMutation(deleteUser, {
  onMutate: async (userId) => {
    await queryClient.cancelQueries(['users']);
    const previousUsers = queryClient.getQueryData(['users']);
    queryClient.setQueryData(['users'], (old: any) =>
      old.filter((user: any) => user.id !== userId)
    );
    return { previousUsers };
  },
  onError: (err, userId, context) => {
    queryClient.setQueryData(['users'], context?.previousUsers);
  },
  onSettled: () => {
    queryClient.invalidateQueries(['users']);
  },
});
```

---

### ✅ **Key Takeaways Day 3**

* `useMutation` là hook xử lý server state POST/PUT/DELETE.
* Optimistic update giúp UX mượt mà nhưng cần rollback khi lỗi.
* `invalidateQueries` giúp refresh dữ liệu sau mutation.
* Tách rõ logic mutation + UI, tăng maintainability và testability.
