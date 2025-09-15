# Day 05 – Redux Saga / Redux Saga


## 1️⃣ Overview / Tổng quan

**EN:**
Redux-Saga is a **middleware library** for Redux to handle **side effects** (async tasks, API calls, complex workflows) using **generator functions**. It provides powerful patterns like **Worker/Watcher, retry, cancelation, debouncing**, enabling **scalable and maintainable async flows** in Enterprise apps.

**VN:**
Redux-Saga là **middleware cho Redux** để xử lý **side effect** (tác vụ bất đồng bộ, API call, workflow phức tạp) bằng **generator function**. Nó cung cấp các pattern mạnh mẽ như **Worker/Watcher, retry, cancel, debouncing**, giúp **flow async dễ mở rộng và maintainable** trong dự án doanh nghiệp.

**Enterprise Relevance / Ví dụ doanh nghiệp:**

* Handling **complex workflows** like order processing, notifications, or background tasks.
* Managing **retry logic** for flaky APIs or batch processes.
* Orchestrating **parallel tasks** (fetch multiple APIs simultaneously) while maintaining cancelation.

---

## 2️⃣ Key Concepts / Kiến thức cần học

| Concept        | Description EN / VN                                           | Code Snippet / Example                                       |
| -------------- | ------------------------------------------------------------- | ------------------------------------------------------------ |
| Saga           | Generator-based async flow / Flow async dựa trên generator    | `function* fetchSaga() { yield call(api.fetch); }`           |
| Worker         | Saga performing a task / Saga thực hiện một tác vụ            | `function* worker(action)`                                   |
| Watcher        | Saga listening for actions / Saga lắng nghe action            | `function* watcher() { yield takeEvery('ACTION', worker); }` |
| Effects        | Redux-Saga helper functions / Helper functions của Saga       | `call, put, takeEvery, takeLatest, fork, cancel`             |
| Retry / Cancel | Retry API call, cancel running task / Thử lại API, hủy tác vụ | `yield retry(3, 1000, apiCall)` / `yield cancel(task)`       |

---

## 3️⃣ Code Example / Ví dụ code

```ts
// File: store/productSaga.ts
import { call, put, takeEvery, takeLatest, delay } from 'redux-saga/effects';
import { fetchProductsSuccess, fetchProductsFailure } from './productSlice';
import axios from 'axios';
import { Product } from '../types';

// Worker saga: handles fetching products
function* fetchProductsWorker() {
  try {
    // Retry logic: try up to 3 times with 1s delay between attempts
    for (let i = 0; i < 3; i++) {
      try {
        const response = yield call(axios.get, '/api/products');
        yield put(fetchProductsSuccess(response.data));
        return;
      } catch (err) {
        if (i < 2) yield delay(1000); // wait 1s before retry
        else throw err;
      }
    }
  } catch (err: any) {
    yield put(fetchProductsFailure(err.message));
  }
}

// Watcher saga: listen for fetch action
function* watchFetchProducts() {
  // takeLatest cancels previous running worker if a new action comes
  yield takeLatest('products/fetchProducts', fetchProductsWorker);
}

export default function* rootSaga() {
  yield watchFetchProducts();
}

/*
Enterprise Notes:
- takeLatest prevents unnecessary API calls if user clicks multiple times
- Retry ensures robustness against flaky APIs
- TypeScript typings ensure payload and response types
- Can fork multiple sagas to handle parallel workflows
- Useful for orchestrating complex business processes like checkout, notifications, background jobs
*/
```

---

## 4️⃣ Practical Exercises / Bài tập ứng dụng

| Level | Exercise                                                                                             | Learning Objectives / Kỳ vọng                                       |
| ----- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1     | Create a worker saga that logs an action payload                                                     | Understand Worker/Watcher pattern                                   |
| 2     | Create a saga that fetches user data from fake API with retry and error handling                     | Async flow, retry, takeLatest, TypeScript safety                    |
| 3     | Enterprise: Implement product fetch + add/remove + notifications with parallel sagas and cancelation | Scalable workflow, robust error handling, enterprise async patterns |

---

## 5️⃣ Notes / Ghi chú

* Always **use takeLatest or takeEvery** carefully depending on business logic.
* Prefer **retry & cancel patterns** for network reliability.
* Saga **runs in background**, keeps UI responsive.
* Enterprise tip: **split sagas by domain** (products, orders, notifications) to avoid large monolithic sagas.
* Combine with **RTK Query** for caching, but use Saga for side-effects that RTK Query cannot cover (e.g., complex workflows, websockets orchestration).

---

## 6️⃣ Summary / Tổng kết

**EN:**

* Learned **Redux-Saga Worker/Watcher pattern**
* Implemented **retry, cancelation, parallel flows**
* Applied **enterprise async workflow patterns** with TypeScript safety

**VN:**

* Thành thạo **Redux-Saga Worker/Watcher pattern**
* Triển khai **retry, cancel, chạy song song các flow**
* Áp dụng **pattern async trong doanh nghiệp** với TypeScript an toàn

**Checklist Skills / Kiểm tra kỹ năng:**

* [ ] Worker/Watcher sagas
* [ ] takeLatest / takeEvery / fork / cancel
* [ ] Retry logic for API calls
* [ ] Type-safe saga effects
* [ ] Parallel and cancelable workflows
* [ ] Integration with Redux slices & RTK

---
