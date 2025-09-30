# **Redux Thunk vs Redux Saga vs TanStack Query – Guide Enterprise-Ready**

---

<details>
<summary>## **📌 Overview: Chọn đúng công nghệ**</summary>

| Công nghệ          | Khái niệm                                                                            | Vai trò chính                                                                        |
| ------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| **Redux Thunk**    | Middleware cho Redux, cho phép viết async action dưới dạng function                  | Xử lý async đơn giản, fetch API, submit form                                         |
| **Redux Saga**     | Middleware Redux dùng generator function (`function*`) để xử lý side-effect phức tạp | Quản lý workflow nhiều bước, cancel/retry/race/parallel, background tasks, WebSocket |
| **TanStack Query** | Lib chuyên quản lý **server state** (API data)                                       | Cache, retry, refetch, pagination, infinite scroll, background refresh               |

**Logic chọn công nghệ:**

1. CRUD/async đơn giản → **Thunk hoặc RTK Query**
2. Server-state centric app → **TanStack Query**
3. Business logic & side-effect phức tạp → **Saga**
4. App enterprise → **Mix Query + Saga (+ Zustand cho UI state)**

</details>

---

<details>
<summary>## **1️⃣ Redux Thunk – Async đơn giản**</summary>

### **Khái niệm**

* Middleware Redux cho async action dưới dạng function.
* Phù hợp CRUD đơn giản, fetch API, submit form.

### **Trường hợp dùng**

* GET list, POST form, PUT/DELETE item.
* Async đơn giản, không cần cancel, retry, parallel.
* App nhỏ, logic chưa phức tạp.

### **Ví dụ**

* Fetch product list
* Submit login/register form
* Update user profile

### **Ưu/nhược điểm**

* **Ưu**: Dễ học, triển khai nhanh, gọn nhẹ
* **Nhược**: Workflow phức tạp → code rối, khó maintain

### **Lưu ý khi mix**

* Dùng cho task nhỏ, legacy code
* Có thể mix với Saga hoặc Query

</details>

---

<details>
<summary>## **2️⃣ Redux Saga – Async nâng cao & Side-effect**</summary>

### **Khái niệm**

* Middleware Redux dùng generator (`function*`) để quản lý side-effect phức tạp.
* Hỗ trợ cancel/retry/race/parallel, background task, WebSocket.

### **Trường hợp dùng**

* Workflow nhiều bước: checkout, payment
* Async nâng cao: cancel request (`takeLatest`), retry, debounce/throttle
* Race & parallel tasks
* Background task & real-time: WebSocket, polling
* Conditional flow, global error handling, navigation side-effect

### **Ví dụ**

* Multi-step checkout flow
* Chat App realtime với WebSocket
* Retry payment API khi fail 3 lần
* Cancel request cũ khi search realtime

### **Ưu/nhược điểm**

* **Ưu**: Clean, maintainable, phù hợp enterprise app
* **Nhược**: Khó học hơn Thunk, verbose

### **Lưu ý khi mix**

* Mix Query để fetch data, Saga xử lý workflow & side-effect
* Tránh dùng Saga cho CRUD đơn giản hoặc animation/UI logic

</details>

---

<details>
<summary>## **3️⃣ TanStack Query – Server State Management**</summary>

### **Khái niệm**

* Quản lý **server state**: cache, retry, refetch, pagination, infinite scroll, background refresh.
* Giảm boilerplate Redux.

### **Trường hợp dùng**

* Fetch API với cache & stale time
* Pagination / Infinite scroll / Prefetch data
* Auto refresh khi tab/window focus

### **Ví dụ**

* Blog App với pagination + cache
* Product List App với prefetch hover
* Fetch orders với auto refresh

### **Ưu/nhược điểm**

* **Ưu**: Gọn, mạnh cho API-centric app, maintainable
* **Nhược**: Không xử lý multi-step workflow hay side-effect phức tạp

### **Lưu ý khi mix**

* Query + Saga chuẩn enterprise: Query = server state, Saga = business logic & side-effect
* Tránh dùng Query cho UI state nhỏ (dùng Zustand/Context)

</details>

---

<details>
<summary>## **4️⃣ Khi nào dùng riêng / khi nào mix**</summary>

| Trường hợp                                            | Công nghệ phù hợp            | Lý do                                                                       |
| ----------------------------------------------------- | ---------------------------- | --------------------------------------------------------------------------- |
| App nhỏ CRUD, async đơn giản                          | Redux Thunk (hoặc RTK Query) | CRUD nhanh gọn, không workflow phức tạp                                     |
| App lớn, workflow nhiều bước, side-effect phức tạp    | Redux Saga                   | Quản lý cancel/retry/race/parallel, background task, WebSocket              |
| Chỉ quản lý dữ liệu server (fetch, cache, pagination) | TanStack Query               | Giảm boilerplate, auto retry, cache & refetch                               |
| App lớn enterprise                                    | TanStack Query + Redux Saga  | Query: server state; Saga: business logic & side-effect; combo maintainable |
| State UI tạm thời nhỏ                                 | Zustand / Context            | Tránh Redux nặng, gọn nhẹ                                                   |

> Chú ý: Mix Query + Saga là chuẩn industry cho enterprise app.

</details>

---

<details>
<summary>## **5️⃣ Danh sách case & tag**</summary>

| Case                            | Tag              | Giải thích                               |
| ------------------------------- | ---------------- | ---------------------------------------- |
| Fetch list API                  | 🟢 Thunk đủ      | CRUD cơ bản, async đơn giản              |
| Submit login/register form      | 🟢 Thunk đủ      | Async đơn giản                           |
| Update/delete item              | 🟢 Thunk đủ      | CRUD đơn giản                            |
| Search realtime, cancel request | 🔵 Saga bắt buộc | `takeLatest` cancel request cũ           |
| Debounce/throttle API           | 🔵 Saga bắt buộc | Ngăn spam API                            |
| Retry khi fail                  | 🔵 Saga bắt buộc | Retry nhiều lần, delay giữa các lần      |
| Multi-step workflow             | 🔵 Saga bắt buộc | Checkout flow, payment flow              |
| Race condition                  | 🔵 Saga bắt buộc | Lấy kết quả nhanh nhất giữa nhiều server |
| Parallel API call               | 🔵 Saga bắt buộc | Fetch nhiều resource cùng lúc            |
| WebSocket / Polling             | 🔵 Saga bắt buộc | Background task, real-time               |
| Conditional flow, global error  | 🔵 Saga bắt buộc | Side-effect nâng cao, clean code         |
| Async form validation           | 🟡 Saga optional | Lib khác gọn hơn: React Hook Form/Yup    |
| File upload progress            | 🟡 Saga optional | Custom hook/Axios đủ                     |
| Animation/side-UI logic         | 🟡 Saga optional | Lib chuyên dụng gọn hơn (Framer Motion)  |

</details>

---

<details>
<summary>## **6️⃣ Roadmap Học & Thực Hành**</summary>

### **6.1 Nền tảng**

* JS core: closure, async/await, event loop
* React state & context
* Server state vs client state

### **6.2 Redux Core**

* Store, reducer, action, dispatch, selector
* ⚡ Mini Todo App

### **6.3 Redux Thunk**

* CRUD app nhỏ, async đơn giản
* ⚡ Product CRUD App

### **6.4 Redux Saga**

* Async nâng cao, cancel/retry/race/parallel
* Background tasks, WebSocket, polling
* ⚡ Checkout Flow, Chat App Mock

### **6.5 TanStack Query**

* Server state management: fetch, cache, pagination, infinite scroll
* ⚡ Blog App, Product List App

### **6.6 Mix**

* App lớn enterprise: Query + Saga + Zustand cho UI state
* ⚡ E-commerce App:

  * Query → product list
  * Saga → checkout workflow
  * Zustand → sidebar/filter state

</details>

---

<details>
<summary>## **7️⃣ Thời gian dự kiến**</summary>

| Nội dung           | Thời gian |
| ------------------ | --------- |
| Redux Core + Thunk | 1–2 tuần  |
| Saga               | 3–4 tuần  |
| TanStack Query     | 1–2 tuần  |
| Mix project        | 4–6 tuần  |

</details>

---

<details>
<summary>## **8️⃣ Output sau roadmap**</summary>

* Portfolio side project enterprise-level
* Tự tin trả lời phỏng vấn: chọn **Saga/Thunk/Query/Zustand** vì sao
* Kinh nghiệm thực tế: cancel, retry, WebSocket, polling, multi-step workflow

</details>

---

<details>
<summary>✅ **Tóm tắt logic chọn công nghệ:**</summary>

1. **CRUD/async đơn giản** → Thunk hoặc RTK Query
2. **Server state-centric app** → TanStack Query
3. **Business logic & side-effect phức tạp** → Saga
4. **App enterprise** → Mix: Query + Saga (+ Zustand cho UI)

</details>

---

<details>
<summary>## **📌 Tham khảo ví dụ thực tế cách dùng các loại**</summary>

# **9️⃣ Redux Thunk – Chuyên sâu & Case Thực tế Enterprise**

## **9.1 Khái niệm & vai trò**

* Middleware cho Redux, cho phép viết async action dưới dạng **function** thay vì object.
* Thường dùng cho **CRUD API đơn giản** và các **task async nhẹ**.
* Thích hợp cho app **enterprise nhỏ hoặc micro-feature** trong dự án lớn.

---

## **9.2 Case thực tế**

### **Case 1: Fetch danh sách sản phẩm / user / blog (CRUD cơ bản)** 🟢

* **Mục tiêu**: Lấy dữ liệu từ API, lưu vào Redux store.
* **Dễ, chỉ cần Thunk cơ bản**

```javascript
// actions/productActions.js
export const fetchProducts = () => async (dispatch) => {
  dispatch({ type: 'PRODUCTS_FETCH_START' });
  try {
    const response = await fetch('/api/products');
    const data = await response.json();
    dispatch({ type: 'PRODUCTS_FETCH_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'PRODUCTS_FETCH_ERROR', payload: error.message });
  }
};
```

* **Reducer**:

```javascript
const initialState = { list: [], loading: false, error: null };

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PRODUCTS_FETCH_START':
      return { ...state, loading: true, error: null };
    case 'PRODUCTS_FETCH_SUCCESS':
      return { ...state, loading: false, list: action.payload };
    case 'PRODUCTS_FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
```

* **Notes**: CRUD đơn giản → **Thunk đủ, gọn nhẹ**.

---

### **Case 2: Submit form login / register** 🟢

* **Mục tiêu**: Gửi form login/register → cập nhật auth state.
* **Dễ, chỉ cần Thunk**

```javascript
export const loginUser = (credentials) => async (dispatch) => {
  dispatch({ type: 'AUTH_LOGIN_START' });
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    dispatch({ type: 'AUTH_LOGIN_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'AUTH_LOGIN_ERROR', payload: error.message });
  }
};
```

* **Notes**: Không cần cancel/retry phức tạp, Thunk xử lý đủ.

---

### **Case 3: Update / Delete item** 🟢

* **Mục tiêu**: PUT / DELETE API call.
* **Dễ, chỉ cần Thunk**

```javascript
export const updateProduct = (id, updateData) => async (dispatch) => {
  dispatch({ type: 'PRODUCT_UPDATE_START' });
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    const data = await res.json();
    dispatch({ type: 'PRODUCT_UPDATE_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'PRODUCT_UPDATE_ERROR', payload: error.message });
  }
};
```

* **Notes**: Dùng cho enterprise app: CRUD đơn giản vẫn có thể là Thunk.

---

### **Case 4: Thực hiện workflow nhiều bước nhỏ (ví dụ: add to cart → calculate discount)** 🟡

* **Mục tiêu**: Chạy nhiều step async, nhưng logic đơn giản, không cần cancel/retry global.
* **Khó hơn case CRUD, nhưng vẫn có thể dùng Thunk**

```javascript
export const addToCart = (product) => async (dispatch, getState) => {
  dispatch({ type: 'CART_ADD_START' });
  try {
    // Step 1: add product
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const data = await res.json();
    dispatch({ type: 'CART_ADD_SUCCESS', payload: data });

    // Step 2: calculate discount
    const discountRes = await fetch(`/api/discount?cartId=${data.id}`);
    const discount = await discountRes.json();
    dispatch({ type: 'CART_APPLY_DISCOUNT', payload: discount });
  } catch (error) {
    dispatch({ type: 'CART_ADD_ERROR', payload: error.message });
  }
};
```

* **Notes**:

  * Với **workflow nhiều bước, có race, cancel, retry**, Saga sẽ clean hơn.
  * Thunk vẫn xử lý được, nhưng code dài và nested → khó maintain.

---

### **Case 5: Fetch data có pagination / infinite scroll** 🟡

* **Mục tiêu**: Lấy nhiều trang dữ liệu từ API.
* **Thunk xử lý được, nhưng phải tự viết logic cache/retry**
* **Enterprise tip**: TanStack Query mạnh hơn → tự cache, prefetch, stale data.

```javascript
export const fetchProductsPage = (page) => async (dispatch) => {
  dispatch({ type: 'PRODUCTS_PAGE_FETCH_START', payload: page });
  try {
    const res = await fetch(`/api/products?page=${page}`);
    const data = await res.json();
    dispatch({ type: 'PRODUCTS_PAGE_FETCH_SUCCESS', payload: { page, data } });
  } catch (error) {
    dispatch({ type: 'PRODUCTS_PAGE_FETCH_ERROR', payload: error.message });
  }
};
```

* **Notes**: Nếu enterprise app → nên dùng TanStack Query cho pagination / infinite scroll.

---

### **Case 6: Conditional API call dựa vào state / role** 🟡

* **Mục tiêu**: Nếu user là admin → gọi API A, user thường → gọi API B.
* **Thunk xử lý được** nhưng verbose.

```javascript
export const fetchDashboardData = () => async (dispatch, getState) => {
  const { auth } = getState();
  dispatch({ type: 'DASHBOARD_FETCH_START' });

  try {
    const endpoint = auth.user.role === 'admin' ? '/api/admin-dashboard' : '/api/user-dashboard';
    const res = await fetch(endpoint);
    const data = await res.json();
    dispatch({ type: 'DASHBOARD_FETCH_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'DASHBOARD_FETCH_ERROR', payload: error.message });
  }
};
```

* **Notes**:

  * Với workflow phức tạp, race, cancel, Saga sẽ clean hơn.


### **Case 7: Cancel request cũ khi search realtime (takeLatest)** 🟡

* **Mục tiêu**: User nhập search → cancel request cũ, chỉ lấy response mới nhất.
* **Thunk xử lý được nhưng verbose**, phải dùng `abortController`.

```javascript
let controller = null;

export const searchProducts = (query) => async (dispatch) => {
  dispatch({ type: 'SEARCH_START', payload: query });

  // Cancel request cũ
  if (controller) controller.abort();
  controller = new AbortController();

  try {
    const res = await fetch(`/api/products?search=${query}`, { signal: controller.signal });
    const data = await res.json();
    dispatch({ type: 'SEARCH_SUCCESS', payload: data });
  } catch (error) {
    if (error.name === 'AbortError') return; // request bị cancel
    dispatch({ type: 'SEARCH_ERROR', payload: error.message });
  }
};
```

**Notes**:

* Thunk làm được, nhưng cần quản lý `AbortController` thủ công.
* Saga có `takeLatest` built-in, code clean hơn nhiều.

---

### **Case 8: Retry API khi fail nhiều lần** 🟡

* **Mục tiêu**: Gọi API, nếu fail → retry n lần, delay giữa các lần.
* **Thunk làm được nhưng phải tự viết loop / delay**, verbose.

```javascript
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export const fetchWithRetry = (url, retries = 3, delay = 1000) => async (dispatch) => {
  dispatch({ type: 'DATA_FETCH_START' });

  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      dispatch({ type: 'DATA_FETCH_SUCCESS', payload: data });
      return;
    } catch (error) {
      if (i === retries - 1) {
        dispatch({ type: 'DATA_FETCH_ERROR', payload: error.message });
      } else {
        await sleep(delay);
      }
    }
  }
};
```

**Notes**:

* Thunk làm được, nhưng code lặp, khó maintain nếu retry logic phức tạp.
* Saga có effect `retry` → clean hơn.

---

### **Case 9: Parallel API call (fetch nhiều resource cùng lúc)** 🟡

* **Mục tiêu**: Fetch user info + cart + orders cùng lúc, đợi tất cả xong.
* **Thunk làm được** bằng `Promise.all`, nhưng khó handle error từng request riêng.

```javascript
export const fetchDashboardData = () => async (dispatch) => {
  dispatch({ type: 'DASHBOARD_FETCH_START' });

  try {
    const [userRes, cartRes, orderRes] = await Promise.all([
      fetch('/api/user').then((res) => res.json()),
      fetch('/api/cart').then((res) => res.json()),
      fetch('/api/orders').then((res) => res.json()),
    ]);

    dispatch({ type: 'DASHBOARD_FETCH_SUCCESS', payload: { user: userRes, cart: cartRes, orders: orderRes } });
  } catch (error) {
    dispatch({ type: 'DASHBOARD_FETCH_ERROR', payload: error.message });
  }
};
```

**Notes**:

* Thunk làm được, nhưng nếu cần **cancel / retry riêng từng call → code rối**
* Saga `all` + `race` xử lý clean, maintainable.

---

### **Case 10: Polling API liên tục** 🟡

* **Mục tiêu**: Kiểm tra trạng thái payment hoặc job status mỗi n giây.
* **Thunk làm được nhưng cần setInterval / clearInterval thủ công**.

```javascript
let pollingInterval = null;

export const startPollingPayment = (orderId) => (dispatch) => {
  dispatch({ type: 'POLLING_START', payload: orderId });

  pollingInterval = setInterval(async () => {
    try {
      const res = await fetch(`/api/payment-status/${orderId}`);
      const data = await res.json();

      dispatch({ type: 'POLLING_UPDATE', payload: data });

      if (data.status === 'success' || data.status === 'failed') {
        clearInterval(pollingInterval);
        dispatch({ type: 'POLLING_END', payload: data });
      }
    } catch (error) {
      console.error(error);
    }
  }, 5000);
};

export const stopPollingPayment = () => {
  if (pollingInterval) clearInterval(pollingInterval);
};
```

**Notes**:

* Với Thunk, bạn phải quản lý interval thủ công.
* Saga có `while(true)` + `delay()` → clean, dễ test hơn.

---

### **Tóm tắt Thunk nâng cao**

| Case                                  | Thunk có thể làm | Notes / giới hạn                                    |
| ------------------------------------- | ---------------- | --------------------------------------------------- |
| Cancel request cũ khi search realtime | ✅                | Phải dùng AbortController, code verbose             |
| Retry API khi fail nhiều lần          | ✅                | Loop + sleep thủ công, verbose                      |
| Parallel API call                     | ✅                | Promise.all làm được, khó handle cancel/retry riêng |
| Polling API liên tục                  | ✅                | Phải quản lý interval thủ công, khó maintain        |

> **Kết luận**: Thunk vẫn xử lý được mọi case enterprise, nhưng code dài, nested, khó maintain → đây là lý do Redux Saga ra đời để clean code, support cancel/retry/race/parallel dễ dàng.

---

Tiếp theo mình sẽ viết **Redux Saga – chuyên sâu & case thực tế enterprise**, kèm **code minh họa clean**, để bạn thấy rõ **vì sao Saga mạnh hơn Thunk trong các workflow phức tạp**.

</details>

---

<details>
<summary># **10️⃣ Redux Saga – Chuyên sâu & Case Thực tế Enterprise**</summary>

---

## **11.1 Khái niệm & vai trò**

* Middleware Redux dùng **generator function (`function*`)** để xử lý side-effect.
* Thích hợp cho các workflow **nhiều bước, cancel/retry/race/parallel, background task, WebSocket**.
* Giúp code **clean, maintainable, testable**, phù hợp enterprise app.

---

## **11.2 Case thực tế**

### **Case 1: Cancel request cũ khi search realtime (`takeLatest`)** 🔵

```javascript
// sagas/searchSaga.js
import { call, put, takeLatest } from 'redux-saga/effects';

function* searchProductsSaga(action) {
  try {
    const data = yield call(fetch, `/api/products?search=${action.payload}`);
    const json = yield data.json();
    yield put({ type: 'SEARCH_SUCCESS', payload: json });
  } catch (error) {
    yield put({ type: 'SEARCH_ERROR', payload: error.message });
  }
}

export function* watchSearch() {
  yield takeLatest('SEARCH_START', searchProductsSaga);
}
```

**Notes**:

* `takeLatest` tự động cancel request cũ → code clean hơn Thunk với AbortController.

---

### **Case 2: Retry API khi fail nhiều lần (`retry`)** 🔵

```javascript
import { call, put, retry } from 'redux-saga/effects';

function* fetchWithRetrySaga(action) {
  try {
    const data = yield retry(3, 1000, fetch, `/api/data`);
    const json = yield data.json();
    yield put({ type: 'DATA_FETCH_SUCCESS', payload: json });
  } catch (error) {
    yield put({ type: 'DATA_FETCH_ERROR', payload: error.message });
  }
}
```

**Notes**:

* Saga có `retry(n, delay, fn, ...)` → clean, maintainable.
* Thunk phải tự viết loop + sleep.

---

### **Case 3: Parallel API call (`all`)** 🔵

```javascript
import { call, put, all } from 'redux-saga/effects';

function* fetchDashboardSaga() {
  try {
    const [userRes, cartRes, orderRes] = yield all([
      call(fetch, '/api/user').then(res => res.json()),
      call(fetch, '/api/cart').then(res => res.json()),
      call(fetch, '/api/orders').then(res => res.json()),
    ]);

    yield put({
      type: 'DASHBOARD_FETCH_SUCCESS',
      payload: { user: userRes, cart: cartRes, orders: orderRes },
    });
  } catch (error) {
    yield put({ type: 'DASHBOARD_FETCH_ERROR', payload: error.message });
  }
}
```

**Notes**:

* Fetch nhiều API cùng lúc, Saga xử lý clean, dễ manage cancel/retry từng task.

---

### **Case 4: Race condition – lấy response nhanh nhất (`race`)** 🔵

```javascript
import { call, put, race, delay } from 'redux-saga/effects';

function* fetchFastestServerSaga() {
  try {
    const { server1, server2, timeout } = yield race({
      server1: call(fetch, '/api/server1').then(res => res.json()),
      server2: call(fetch, '/api/server2').then(res => res.json()),
      timeout: delay(3000),
    });

    if (timeout) throw new Error('Timeout');
    yield put({ type: 'FETCH_FASTEST_SUCCESS', payload: server1 || server2 });
  } catch (error) {
    yield put({ type: 'FETCH_FASTEST_ERROR', payload: error.message });
  }
}
```

**Notes**:

* Saga `race` → chỉ lấy response nhanh nhất, xử lý timeout dễ dàng.
* Thunk làm được nhưng code verbose và nested.

---

### **Case 5: Polling API liên tục** 🔵

```javascript
import { call, put, delay } from 'redux-saga/effects';

function* pollPaymentStatusSaga(action) {
  try {
    let status = '';
    while (status !== 'success' && status !== 'failed') {
      const res = yield call(fetch, `/api/payment-status/${action.payload}`);
      const data = yield res.json();
      status = data.status;
      yield put({ type: 'POLLING_UPDATE', payload: data });
      if (status !== 'success' && status !== 'failed') yield delay(5000);
    }
    yield put({ type: 'POLLING_END', payload: { status } });
  } catch (error) {
    yield put({ type: 'POLLING_ERROR', payload: error.message });
  }
}
```

**Notes**:

* Saga xử lý polling clean, delay built-in, dễ stop/start.
* Thunk phải setInterval/clearInterval thủ công.

---

### **Case 6: WebSocket / Real-time** 🔵

```javascript
import { eventChannel } from 'redux-saga';
import { take, call, put, fork } from 'redux-saga/effects';

function createSocketChannel(socket) {
  return eventChannel((emit) => {
    socket.on('message', (msg) => emit({ type: 'NEW_MESSAGE', payload: msg }));
    return () => socket.off('message');
  });
}

function* watchSocket() {
  const socket = new WebSocket('wss://example.com/socket');
  const channel = yield call(createSocketChannel, socket);
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}

export function* rootSaga() {
  yield fork(watchSocket);
}
```

**Notes**:

* Saga `eventChannel` → perfect cho real-time & background task.
* Thunk gần như bất lực với WebSocket hoặc long-running task.

---

### **Tóm tắt Saga – Enterprise Case**

| Case                          | Saga có ưu thế | Lý do                                          |
| ----------------------------- | -------------- | ---------------------------------------------- |
| Cancel request (`takeLatest`) | ✅              | Built-in, code clean                           |
| Retry API                     | ✅              | `retry(n, delay, fn)`                          |
| Parallel API call (`all`)     | ✅              | Fetch nhiều resource cùng lúc, dễ cancel/retry |
| Race condition (`race`)       | ✅              | Chỉ lấy response nhanh nhất, handle timeout    |
| Polling API                   | ✅              | `delay` + while loop clean                     |
| WebSocket / Real-time         | ✅              | `eventChannel` quản lý background task         |
| Workflow nhiều bước           | ✅              | Saga dễ chain, maintainable                    |

> **Kết luận**:
>
> * Saga vượt trội ở **workflow phức tạp & side-effect dài hạn**.
> * Thunk vẫn xử lý được, nhưng code verbose, nested → khó maintain trong enterprise app.

Tuyệt, giờ mình sẽ viết **so sánh trực tiếp Thunk vs Saga vs TanStack Query trên các case enterprise**, kèm **bảng tiêu chí chọn công nghệ + code minh họa**, để hoàn thiện README “enterprise-ready”.

</details>

---

<details>
<summary># **11 So sánh Redux Thunk vs Redux Saga vs TanStack Query – Enterprise Case**</summary>

---

## **11.1 Logic chọn công nghệ theo case**

| Case / Scenario                                     | Thunk                   | Saga                     | TanStack Query                    | Ghi chú / Khi nào dùng mix                   |
| --------------------------------------------------- | ----------------------- | ------------------------ | --------------------------------- | -------------------------------------------- |
| CRUD cơ bản (GET/POST/PUT/DELETE)                   | ✅ đủ gọn                | ✅ làm được nhưng verbose | ✅ RTK Query / TanStack Query đủ   | Thunk nhanh, Query gọn hơn nếu chỉ fetch API |
| Search realtime, cancel request (`takeLatest`)      | ✅ nhưng code verbose    | ✅ clean (`takeLatest`)   | ❌ không hỗ trợ cancel             | Saga thích hợp cho enterprise real-time      |
| Debounce / throttle API                             | ✅ thủ công              | ✅ clean                  | ❌                                 | Saga clean hơn, tránh nested code            |
| Retry API khi fail                                  | ✅ loop + sleep          | ✅ `retry(n, delay)`      | ✅ auto retry nhưng logic giới hạn | Saga nếu cần workflow kết hợp nhiều API      |
| Multi-step workflow (checkout, payment)             | ✅ nested & verbose      | ✅ clean, maintainable    | ❌                                 | Saga bắt buộc cho workflow nhiều bước        |
| Race condition (lấy response nhanh nhất)            | ✅ nested & verbose      | ✅ `race()`               | ❌                                 | Saga clean, Thunk code rối                   |
| Parallel API call                                   | ✅ `Promise.all`         | ✅ `all()`                | ❌                                 | Saga dễ cancel / retry từng task             |
| Polling API / Background task                       | ✅ setInterval           | ✅ while+delay            | ❌                                 | Saga clean hơn, dễ stop/start                |
| WebSocket / Real-time                               | ❌ khó                   | ✅ `eventChannel`         | ❌                                 | Saga bắt buộc                                |
| Server state (cache, pagination, infinite scroll)   | ✅ làm được nhưng custom | ✅ làm được nhưng verbose | ✅ mạnh nhất                       | Query chuyên dụng, giảm boilerplate          |
| UI state tạm thời (modal, filter, theme)            | ✅                       | ✅ verbose                | ❌                                 | Zustand / Context gọn nhẹ hơn                |
| Async form validation / Upload progress / Animation | ✅ verbose               | ✅ làm được               | ❌                                 | Lib chuyên dụng + Saga optional              |

---

## **11.2 So sánh trực quan về code & maintainability**

| Aspect                   | Redux Thunk                 | Redux Saga                          | TanStack Query             |
| ------------------------ | --------------------------- | ----------------------------------- | -------------------------- |
| Async đơn giản           | ✅ nhanh, dễ học             | ✅ làm được, verbose                 | ✅ auto fetch, retry, cache |
| Workflow nhiều bước      | ❌ nested, khó maintain      | ✅ clean, dễ test                    | ❌                          |
| Cancel / Debounce / Race | ❌ phải tự viết code verbose | ✅ built-in effects                  | ❌                          |
| Parallel / Retry         | ✅ `Promise.all` + loop      | ✅ `all` / `retry`                   | ✅ retry auto (limit)       |
| Background / WebSocket   | ❌ khó                       | ✅ `eventChannel`, long-running task | ❌                          |
| Cache & Pagination       | ❌ custom                    | ❌ verbose                           | ✅ mạnh, auto invalidation  |
| Maintainability          | ❌ code nested khi complex   | ✅ clean, readable                   | ✅ gọn cho server state     |

---

## **11.3 Khi nào dùng riêng, khi nào mix**

| Scenario                                              | Recommended Tech Stack                  | Notes / Lý do                                                |
| ----------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------ |
| App CRUD nhỏ, async đơn giản                          | Redux Thunk / RTK Query                 | Quick setup, dễ maintain                                     |
| Server state-centric app (fetch / cache / pagination) | TanStack Query                          | Auto retry, cache, prefetch                                  |
| Workflow phức tạp (checkout, multi-step)              | Redux Saga                              | Cancel, retry, race, parallel, polling                       |
| Enterprise app full-stack                             | TanStack Query + Redux Saga (+ Zustand) | Query: server state, Saga: business logic, Zustand: UI state |

---

## **11.4 Ví dụ kết hợp – Enterprise E-commerce App**

**Product List** – **TanStack Query**

```javascript
import { useQuery } from '@tanstack/react-query';

export const useProducts = (page) => {
  return useQuery(['products', page], () =>
    fetch(`/api/products?page=${page}`).then((res) => res.json()),
    { staleTime: 5000, keepPreviousData: true }
  );
};
```

**Checkout Workflow** – **Redux Saga**

```javascript
function* checkoutSaga(action) {
  try {
    const stock = yield call(fetch, `/api/check-stock/${action.payload}`).then(res => res.json());
    if (!stock.available) throw new Error('Out of stock');

    const order = yield call(fetch, `/api/create-order`, { method: 'POST', body: JSON.stringify(action.payload) }).then(res => res.json());
    yield put({ type: 'CHECKOUT_SUCCESS', payload: order });
  } catch (error) {
    yield put({ type: 'CHECKOUT_ERROR', payload: error.message });
  }
}
```

**UI Filter / Sidebar State** – **Zustand**

```javascript
import create from 'zustand';

export const useUIStore = create((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
```

**Notes**:

* TanStack Query → server state, auto retry/cache
* Saga → business logic workflow, cancel/retry
* Zustand → local UI state nhẹ, tránh Redux nặng

---

✅ **Tóm tắt Enterprise-ready Logic:**

1. **CRUD / async đơn giản** → Thunk hoặc RTK Query
2. **Server state-centric app** → TanStack Query
3. **Workflow phức tạp / multi-step / cancel/retry/race/parallel** → Saga
4. **UI state tạm thời nhỏ** → Zustand / Context
5. **Enterprise app** → Mix Query + Saga + Zustand → clean, maintainable, scalable

</details>

---