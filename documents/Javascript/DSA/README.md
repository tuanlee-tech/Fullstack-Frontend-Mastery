## **DSA cơ bản → trung cấp**

**Mục tiêu tuần:**

* Nắm vững các cấu trúc dữ liệu cơ bản (Array, String, HashMap, Stack/Queue, Linked List)
* Hiểu recursion, sorting, searching
* Áp dụng DSA vào mini-project quản lý task

| Ngày | Nội dung                | Kiến thức đạt được                                               | Bài tập chính                                               |
| ---- | ----------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------- |
| 1    | Array cơ bản + thao tác | Truy cập, thêm/xóa, map/filter/reduce, trade-off performance     | Đảo ngược mảng, tìm phần tử lớn thứ 2, merge 2 mảng đã sort |
| 2    | String + HashMap        | Manipulate string, đếm tần suất ký tự, Map/Set, key-value lookup | Đếm ký tự, palindrome check, substring dài nhất không lặp   |
| 3    | Recursion cơ bản        | Hiểu base case, recursive case, khi nào dùng recursion           | Factorial, Fibonacci (memoization), tìm tất cả subsets      |
| 4    | Sorting & Searching     | Bubble/Quick/Merge sort, Binary search, complexity O(n log n)    | Bubble sort, Quicksort, Binary search 2D                    |
| 5    | Stack & Queue           | LIFO/FIFO, implement stack/queue, ứng dụng undo/redo             | Kiểm tra ngoặc toán học, queue bằng 2 stack, circular queue |
| 6    | Linked List cơ bản      | Node, head/tail, traverse, insert/delete                         | Reverse linked list, detect cycle, merge sorted lists       |
| 7    | Mini-project DSA        | Task Manager App: add/edit/delete, sort, search, undo/redo       | Áp dụng tất cả DSA trên cho Task App                        |

---
Hoàn toàn được! Chúng ta sẽ quay lại **Tuần 1 – DSA cơ bản → trung cấp**, viết **chi tiết từng ngày từ ngày 1**, với:

* **Lý thuyết ngắn gọn**
* **Ví dụ code production-ready (TypeScript)**
* **Bài tập Level 1 → 3**
* **Tips/Best Practices**

---

# **Tuần 1: DSA cơ bản → trung cấp**

**Mục tiêu tuần:**

* Nắm vững các cấu trúc dữ liệu cơ bản: Array, String, HashMap, Stack/Queue, LinkedList
* Hiểu Recursion, Sorting, Searching
* Áp dụng DSA vào mini-project quản lý task

---

## **Ngày 1: Array cơ bản + thao tác với mảng**

**Lý thuyết:**

* Mảng là cấu trúc lưu nhiều giá trị cùng loại
* Thao tác: truy cập, push/pop, shift/unshift, slice/splice, map/filter/reduce
* Truy cập O(1), tìm kiếm O(n)

**Ví dụ code:**

```ts
const products: string[] = ["Apple", "Orange", "Banana"];

// Thêm/xóa
products.push("Mango"); 
products.pop(); 

// Map/filter/reduce
const upperProducts = products.map(p => p.toUpperCase());
const bananaCount = products.filter(p => p === "Banana").length;

console.log(upperProducts); // ["APPLE","ORANGE","BANANA"]
console.log(bananaCount);   // 1
```

**Bài tập:**

* **Level 1:** Viết function đảo ngược mảng.
* **Level 2:** Tìm phần tử lớn thứ 2 trong mảng số.
* **Level 3:** Merge 2 mảng đã sắp xếp thành 1 mảng mới tăng dần.

**Tips:** Luôn test với mảng rỗng, mảng có trùng phần tử.

---

## **Ngày 2: String + HashMap cơ bản**

**Lý thuyết:**

* String: `length`, `indexOf`, `substring`, `split`, `join`, `replace`
* HashMap (Map/Set): lưu key-value, tìm kiếm nhanh O(1)

**Ví dụ code:**

```ts
const str = "hello world";
const words = str.split(" "); // ["hello","world"]

// Count frequency of each character
const countMap = new Map<string, number>();
for(const char of str.replace(/\s/g,"")){
    countMap.set(char, (countMap.get(char)||0)+1);
}

console.log(countMap); // Map { 'h'=>1, 'e'=>1, 'l'=>3, 'o'=>2, 'w'=>1, 'r'=>1, 'd'=>1 }
```

**Bài tập:**

* **Level 1:** Đếm số lần xuất hiện mỗi ký tự.
* **Level 2:** Kiểm tra chuỗi có phải palindrome không.
* **Level 3:** Tìm substring dài nhất không chứa ký tự lặp.

---

## **Ngày 3: Recursion cơ bản**

**Lý thuyết:**

* Recursion: function gọi chính nó
* Base case + recursive case
* Dùng cho: factorial, Fibonacci, tree traversal

**Ví dụ code:**

```ts
function factorial(n: number): number {
    if(n <= 1) return 1;
    return n * factorial(n-1);
}

console.log(factorial(5)); // 120
```

**Bài tập:**

* **Level 1:** Tính giai thừa
* **Level 2:** Fibonacci (recursive + memoization)
* **Level 3:** Tìm tất cả subsets của mảng

---

## **Ngày 4: Sorting & Searching**

**Lý thuyết:**

* Sorting: Bubble, Quick, Merge
* Searching: Linear O(n), Binary O(log n) trên mảng sorted

**Ví dụ code:**

```ts
function binarySearch(arr: number[], target: number): number {
    let left = 0, right = arr.length - 1;
    while(left <= right){
        const mid = Math.floor((left + right)/2);
        if(arr[mid] === target) return mid;
        else if(arr[mid] < target) left = mid + 1;
        else right = mid -1;
    }
    return -1;
}

console.log(binarySearch([1,3,5,7,9], 5)); // 2
```

**Bài tập:**

* **Level 1:** Bubble sort
* **Level 2:** Quick sort
* **Level 3:** Binary search trong mảng 2D đã sắp xếp

---

## **Ngày 5: Stack & Queue**

**Lý thuyết:**

* Stack: LIFO → push/pop, ứng dụng undo/redo
* Queue: FIFO → enqueue/dequeue

**Ví dụ code:**

```ts
const stack: number[] = [];
stack.push(1); stack.push(2);
console.log(stack.pop()); // 2

const queue: number[] = [];
queue.push(1); queue.push(2);
console.log(queue.shift()); // 1
```

**Bài tập:**

* **Level 1:** Kiểm tra dấu ngoặc trong biểu thức
* **Level 2:** Implement queue bằng 2 stack
* **Level 3:** Implement circular queue

---

## **Ngày 6: Linked List cơ bản**

**Lý thuyết:**

* Node, head/tail, traverse, insert/delete

**Ví dụ code:**

```ts
class Node {
    value: number;
    next: Node|null = null;
    constructor(value: number){ this.value = value; }
}

class LinkedList {
    head: Node|null = null;
    insert(value: number){
        const node = new Node(value);
        if(!this.head) this.head = node;
        else {
            let curr = this.head;
            while(curr.next) curr = curr.next;
            curr.next = node;
        }
    }
}
```

**Bài tập:**

* **Level 1:** Reverse linked list
* **Level 2:** Detect cycle
* **Level 3:** Merge 2 sorted linked lists

---

## **Ngày 7: Mini-project DSA**

**Mục tiêu:**

* Tạo **Task Manager App mini**
* Áp dụng: Array, HashMap, Stack, LinkedList, Sorting
* Tính năng: add/edit/delete tasks, sort, search, undo/redo

**Tips:**

* Structure code modular, test edge cases: rỗng, trùng, undo nhiều bước

---
