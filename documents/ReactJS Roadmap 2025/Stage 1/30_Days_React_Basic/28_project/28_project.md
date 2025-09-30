<div align="center">
  <h1> 30 Days Of React: Project</h1>
  <a class="header-badge" target="_blank" href="https://www.linkedin.com/in/asabeneh/">
  <img src="https://img.shields.io/badge/style--5eba00.svg?label=LinkedIn&logo=linkedin&style=social">
  </a>
  <a class="header-badge" target="_blank" href="https://twitter.com/Asabeneh">
  <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/asabeneh?style=social">
  </a>

<sub>Author:
<a href="https://www.linkedin.com/in/asabeneh/" target="_blank">Asabeneh Yetayeh</a><br>
<small> October, 2020</small>
</sub>

</div>

[<< Day 27](../27_Ref/27_ref.md) | [Day 29>>]()

![30 Days of React banner](../images/30_days_of_react_banner_day_28.jpg)

# Projects

Create Read Delete and Update(CRUD)
Most applications use CRUD operations. For instance, you have been Reading(R) data by fetching from the cat API and countries API. You have been creating(C) when you use input field and item. However, we did not implement updating and deleting functionality so far. Since CRUD is a common operation almost in all big applications it is good to know how to implement it. In this section, we will develop a small application which has creating, reading, updating and deleting functionality.

The todo list is a very common example to learn and master CRUD operations in almost every libraries and frameworks. I would also recommend you to develop a todo list, note taking or a tinny blog application for the sake of mastering CRUD.

In this section, you and I will develop an old version of twitter post.

# Exercises

1. Develop the following application, [twitter tweets](https://www.30daysofreact.com/day-28/twitter-clone). The application has all the CRUD operations. 

**Requirements / Yêu cầu:**

1. Display a list of tweets.

   * Hiển thị danh sách tweet.

2. Add a new tweet with an input field and a button.

   * Thêm tweet mới bằng input + button.

3. Delete a tweet.

   * Xóa tweet khi click button.

4. Update a tweet (edit content inline).

   * Chỉnh sửa tweet inline hoặc qua popup/modal.

5. Optional: persist tweets in `localStorage`.

   * Lưu dữ liệu trong `localStorage` để reload vẫn giữ.

---

## 🇺🇸 / 🇻🇳 Solution – CRUD Twitter Clone (Basic Version)

### App.js

```javascript
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  const [tweets, setTweets] = useState([]);
  const [input, setInput] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editInput, setEditInput] = useState('');

  // Create
  const addTweet = () => {
    if(input.trim() === '') return;
    setTweets([...tweets, input]);
    setInput('');
  };

  // Delete
  const deleteTweet = (index) => {
    setTweets(tweets.filter((_, i) => i !== index));
  };

  // Start Edit
  const startEdit = (index) => {
    setEditingIndex(index);
    setEditInput(tweets[index]);
  };

  // Save Edit
  const saveEdit = () => {
    const newTweets = [...tweets];
    newTweets[editingIndex] = editInput;
    setTweets(newTweets);
    setEditingIndex(null);
    setEditInput('');
  };

  return (
    <div style={{ padding: '16px', fontFamily: 'sans-serif' }}>
      <h1>Twitter Clone / CRUD Tweets</h1>

      {/* Input */}
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          value={input}
          placeholder="Write a tweet..."
          onChange={(e) => setInput(e.target.value)}
          style={{ padding: '8px', width: '250px' }}
        />
        <button onClick={addTweet} style={{ padding: '8px', marginLeft: '8px' }}>Add</button>
      </div>

      {/* Tweets List */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tweets.map((tweet, index) => (
          <li key={index} style={{ marginBottom: '12px', border: '1px solid #ccc', padding: '8px', borderRadius: '8px' }}>
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                  style={{ padding: '6px', width: '200px' }}
                />
                <button onClick={saveEdit} style={{ marginLeft: '8px' }}>Save</button>
              </>
            ) : (
              <>
                <span>{tweet}</span>
                <button onClick={() => startEdit(index)} style={{ marginLeft: '8px' }}>Edit</button>
              </>
            )}
            <button onClick={() => deleteTweet(index)} style={{ marginLeft: '8px', color: 'red' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
```

---

### ✅ Key Points / Lưu ý

1. **useState**: quản lý `tweets`, `input`, `editingIndex`, `editInput`.
2. **CRUD operations**:

   * **Create:** addTweet
   * **Read:** render tweets.map()
   * **Update:** startEdit → editInput → saveEdit
   * **Delete:** deleteTweet
3. **Conditional rendering**: hiển thị input khi edit, hiển thị text khi không edit.
4. **Basic styling**: dùng inline style cho card và button.

---

### 🇺🇸 / 🇻🇳 Optimized Version (with LocalStorage + Reusable TweetCard)

✅ **Features / Tính năng:**

1. Save tweets to `localStorage` → reload giữ dữ liệu.
2. Extract `TweetCard` component → reusable, cleaner.
3. Better UX: auto-focus input when editing.

### TweetCard.js

```javascript
import React, { useRef, useEffect } from 'react';

const TweetCard = ({ tweet, index, onDelete, onEdit, editingIndex, editInput, setEditInput, onSave }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if(editingIndex === index && inputRef.current){
      inputRef.current.focus();
    }
  }, [editingIndex, index]);

  return (
    <li style={{ marginBottom: '12px', border: '1px solid #ccc', padding: '8px', borderRadius: '8px' }}>
      {editingIndex === index ? (
        <>
          <input
            type="text"
            ref={inputRef}
            value={editInput}
            onChange={(e) => setEditInput(e.target.value)}
            style={{ padding: '6px', width: '200px' }}
          />
          <button onClick={onSave} style={{ marginLeft: '8px' }}>Save</button>
        </>
      ) : (
        <>
          <span>{tweet}</span>
          <button onClick={() => onEdit(index)} style={{ marginLeft: '8px' }}>Edit</button>
        </>
      )}
      <button onClick={() => onDelete(index)} style={{ marginLeft: '8px', color: 'red' }}>Delete</button>
    </li>
  );
};

export default TweetCard;
```

---

### App.js (Optimized)

```javascript
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import TweetCard from './TweetCard';

const App = () => {
  const [tweets, setTweets] = useState([]);
  const [input, setInput] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editInput, setEditInput] = useState('');

  useEffect(() => {
    const savedTweets = JSON.parse(localStorage.getItem('tweets')) || [];
    setTweets(savedTweets);
  }, []);

  useEffect(() => {
    localStorage.setItem('tweets', JSON.stringify(tweets));
  }, [tweets]);

  const addTweet = () => {
    if(input.trim() === '') return;
    setTweets([...tweets, input]);
    setInput('');
  };

  const deleteTweet = (index) => {
    setTweets(tweets.filter((_, i) => i !== index));
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditInput(tweets[index]);
  };

  const saveEdit = () => {
    const newTweets = [...tweets];
    newTweets[editingIndex] = editInput;
    setTweets(newTweets);
    setEditingIndex(null);
    setEditInput('');
  };

  return (
    <div style={{ padding: '16px', fontFamily: 'sans-serif' }}>
      <h1>Twitter Clone / CRUD Tweets</h1>

      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          value={input}
          placeholder="Write a tweet..."
          onChange={(e) => setInput(e.target.value)}
          style={{ padding: '8px', width: '250px' }}
        />
        <button onClick={addTweet} style={{ padding: '8px', marginLeft: '8px' }}>Add</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tweets.map((tweet, index) => (
          <TweetCard
            key={index}
            tweet={tweet}
            index={index}
            onDelete={deleteTweet}
            onEdit={startEdit}
            editingIndex={editingIndex}
            editInput={editInput}
            setEditInput={setEditInput}
            onSave={saveEdit}
          />
        ))}
      </ul>
    </div>
  );
};

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
```

---

### ✅ Key Advantages of Optimized Version

1. **Persisted data**: Reload vẫn giữ tweet nhờ `localStorage`.
2. **Reusable component**: `TweetCard` tách riêng → clean, maintainable.
3. **Focus UX**: Input tự focus khi edit → cải thiện trải nghiệm.
4. **All CRUD operations** implemented efficiently.
---


#### Chúng ta có thể **tách logic CRUD ra thành một custom hook** để UI component chỉ tập trung render và tương tác với người dùng =>  **Bản tối ưu, có localStorage** + custom hook `useTweets`.
#### 🇺🇸 / 🇻🇳 Custom Hook Version – Twitter Clone CRUD

---

## 1️⃣ useTweets.js (Custom Hook)

```javascript
import { useState, useEffect } from 'react';

const useTweets = () => {
  const [tweets, setTweets] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedTweets = JSON.parse(localStorage.getItem('tweets')) || [];
    setTweets(savedTweets);
  }, []);

  // Save to localStorage whenever tweets change
  useEffect(() => {
    localStorage.setItem('tweets', JSON.stringify(tweets));
  }, [tweets]);

  // Create
  const addTweet = (text) => {
    if (text.trim() === '') return;
    setTweets([...tweets, text]);
  };

  // Update
  const updateTweet = (index, text) => {
    const newTweets = [...tweets];
    newTweets[index] = text;
    setTweets(newTweets);
  };

  // Delete
  const deleteTweet = (index) => {
    setTweets(tweets.filter((_, i) => i !== index));
  };

  return { tweets, addTweet, updateTweet, deleteTweet };
};

export default useTweets;
```

---

## 2️⃣ TweetCard.js (Reusable UI Component)

```javascript
import React, { useRef, useEffect } from 'react';

const TweetCard = ({ tweet, index, onDelete, onEdit, editingIndex, editInput, setEditInput, onSave }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingIndex === index && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingIndex, index]);

  return (
    <li style={{ marginBottom: '12px', border: '1px solid #ccc', padding: '8px', borderRadius: '8px' }}>
      {editingIndex === index ? (
        <>
          <input
            type="text"
            ref={inputRef}
            value={editInput}
            onChange={(e) => setEditInput(e.target.value)}
            style={{ padding: '6px', width: '200px' }}
          />
          <button onClick={onSave} style={{ marginLeft: '8px' }}>Save</button>
        </>
      ) : (
        <>
          <span>{tweet}</span>
          <button onClick={() => onEdit(index)} style={{ marginLeft: '8px' }}>Edit</button>
        </>
      )}
      <button onClick={() => onDelete(index)} style={{ marginLeft: '8px', color: 'red' }}>Delete</button>
    </li>
  );
};

export default TweetCard;
```

---

## 3️⃣ App.js (UI + Custom Hook)

```javascript
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import useTweets from './useTweets';
import TweetCard from './TweetCard';

const App = () => {
  const { tweets, addTweet, updateTweet, deleteTweet } = useTweets();
  const [input, setInput] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editInput, setEditInput] = useState('');

  const handleAdd = () => {
    addTweet(input);
    setInput('');
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditInput(tweets[index]);
  };

  const handleSave = () => {
    updateTweet(editingIndex, editInput);
    setEditingIndex(null);
    setEditInput('');
  };

  return (
    <div style={{ padding: '16px', fontFamily: 'sans-serif' }}>
      <h1>Twitter Clone / CRUD Tweets (Custom Hook)</h1>

      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          value={input}
          placeholder="Write a tweet..."
          onChange={(e) => setInput(e.target.value)}
          style={{ padding: '8px', width: '250px' }}
        />
        <button onClick={handleAdd} style={{ padding: '8px', marginLeft: '8px' }}>Add</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tweets.map((tweet, index) => (
          <TweetCard
            key={index}
            tweet={tweet}
            index={index}
            onDelete={deleteTweet}
            onEdit={handleEdit}
            editingIndex={editingIndex}
            editInput={editInput}
            setEditInput={setEditInput}
            onSave={handleSave}
          />
        ))}
      </ul>
    </div>
  );
};

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
```

---

## ✅ Advantages of Custom Hook Version

1. **Logic & UI separation**: `useTweets` chỉ quản lý state và CRUD logic → App chỉ render UI.
2. **Reusable logic**: Custom hook có thể dùng cho app khác chỉ cần import.
3. **Persist data**: Dữ liệu tự động lưu và load từ `localStorage`.
4. **Clean and maintainable**: App component gọn, dễ đọc.
5. **Expandable**: Dễ thêm tính năng khác như likes, timestamps…

---
🎉 CONGRATULATIONS ! 🎉

[<< Day 27](../27_Ref/27_ref.md) | [Day 29>>]()
