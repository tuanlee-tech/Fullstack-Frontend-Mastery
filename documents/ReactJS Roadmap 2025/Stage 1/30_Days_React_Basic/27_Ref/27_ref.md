<div align="center">
  <h1> 30 Days Of React: useRef</h1>
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

[<< Day 25](../25_Custom_Hooks/25_custom_hooks.md) | [Day 27>>]()

![30 Days of React banner](../images/30_days_of_react_banner_day_27.jpg)

# useRef

In this challenge we have covered, how to handle uncontrolled input data. In this section, we will use the useRef hooks to get input data or to access any DOM element in your React application.

The useRef returns a mutable ref object whose .current property is initialized to the passed argument (initialValue). The returned object will persist for the full lifetime of the component.

In the following example, we see how to get data from input and access elements from the DOM tree using useRef hook.

## Getting Data from input

Let's get data from uncontrolled input element.

```js
import React, { useRef } from 'react'
import ReactDOM from 'react-dom'

const App = (props) => {
  const ref = useRef(null)
  const onClick = () => {
    let value = ref.current.value
    alert(value)
  }
  return (
    <div className='App'>
      <h1>How to use data from uncontrolled input using useRef</h1>
      <input type='text' ref={ref} />
      <br />
      <button onClick={onClick}>Get Input Data</button>
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
```

## Focus

Using the useRef we can trigger the focus event on input.

```js
import React, { useRef } from 'react'
import ReactDOM from 'react-dom'

const App = (props) => {
  const ref = useRef(null)
  const onClick = () => {
    ref.current.focus()
  }
  return (
    <div className='App'>
      <h1>How to focus on input element useRef</h1>
      <input type='text' ref={ref} />
      <br />
      <button onClick={onClick}>Click to Focus on input</button>
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
```

## Getting Content from DOM tree

Don't touch the DOM when you develop a React application because React has its own way to manipulate the DOM using the virtual DOM. In case, we get interested to get some content from the DOM tree we can use the useRef hook. See the example:

```js
import React, { useRef } from 'react'
import ReactDOM from 'react-dom'

const App = (props) => {
  const ref = useRef(null)
  const onClick = () => {
    let content = ref.current.textContent
    alert(content)
    console.log(content)
  }
  return (
    <div className='App'>
      <h1 ref={ref}>How to getting content from the DOM tree</h1>
      <button onClick={onClick}>Getting Content</button>
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
```

## Accessing and Styling a DOM element

We can access and style an element from the DOM tree. See the example below:

```js
import React, { useRef } from 'react'
import ReactDOM from 'react-dom'

const App = (props) => {
  const ref = useRef(null)
  const onClick = () => {
    ref.current.style.backgroundColor = '#61dbfb'
    ref.current.style.padding = '50px'
    ref.current.style.textAlign = 'center'
  }
  return (
    <div className='App'>
      <h1 ref={ref}>How to style HTML from the DOM tree using useRef</h1>
      <button onClick={onClick}>Style it</button>
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement
```

# Exercises

1. Develop the following [application](https://www.30daysofreact.com/day-27/hexadecimal-colors). The application generates 27 hexadecimal colors by default. If the generate button get clicked it will generate another new 27 hexadecimal colors.


**Requirements / Yêu cầu:**

1. Generate **27 random hexadecimal colors** initially.

   * Khởi tạo 27 màu ngẫu nhiên (hex).

2. Display each color as a **box with the color code**.

   * Hiển thị mỗi màu dưới dạng box kèm mã màu.

3. Clicking **“Generate” button** generates a new set of 27 colors.

   * Khi bấm nút “Generate”, tạo 27 màu mới.

4. Use `useRef` to **focus on the Generate button** when app loads.

   * Dùng `useRef` để focus nút “Generate” khi render.

5. Optional: copy hex code to clipboard when box is clicked.

   * Tùy chọn: copy màu vào clipboard khi click box.

---

## 🇺🇸 / 🇻🇳 Solution – Hexadecimal Colors Generator

### App.js

```javascript
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

// Function to generate a random hex color
const getRandomHexColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for(let i=0; i<6; i++){
    color += letters[Math.floor(Math.random()*16)];
  }
  return color;
}

const App = () => {
  const [colors, setColors] = useState([]);
  const buttonRef = useRef(null);

  // Generate 27 colors
  const generateColors = () => {
    const newColors = Array.from({ length: 27 }, () => getRandomHexColor());
    setColors(newColors);
  }

  // Focus on button when component mounts
  useEffect(() => {
    if(buttonRef.current){
      buttonRef.current.focus();
    }
    generateColors(); // generate initial colors
  }, []);

  // Optional: copy to clipboard
  const copyToClipboard = (hex) => {
    navigator.clipboard.writeText(hex);
    alert(`${hex} copied to clipboard!`);
  }

  return (
    <div style={{ padding: '16px', fontFamily: 'sans-serif' }}>
      <h1>Hexadecimal Colors Generator / Tạo màu Hex</h1>
      <button 
        ref={buttonRef}
        onClick={generateColors}
        style={{ padding: '8px 16px', marginBottom: '16px', cursor: 'pointer' }}
      >
        Generate / Tạo mới
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: '12px'
      }}>
        {colors.map((hex, idx) => (
          <div
            key={idx}
            onClick={() => copyToClipboard(hex)}
            style={{
              backgroundColor: hex,
              height: '100px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff',
              fontWeight: 'bold',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              textShadow: '1px 1px 2px rgba(0,0,0,0.6)'
            }}
          >
            {hex}
          </div>
        ))}
      </div>
    </div>
  )
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
```

---

### ✅ Key Points / Lưu ý

1. **useRef**: Focus nút khi render lần đầu (`buttonRef.current.focus()`).
2. **useState**: Quản lý state mảng 27 màu.
3. **useEffect**: Thực hiện generate màu và focus nút khi component mount.
4. **Grid responsive**: Mỗi box màu tự co theo màn hình.
5. **Copy to clipboard**: Dùng `navigator.clipboard.writeText(hex)`.
6. **Reusable color generator**: Hàm `getRandomHexColor()` tái sử dụng.
🎉 CONGRATULATIONS ! 🎉

[<< Day 25](../25_Custom_Hooks/25_custom_hooks.md) | [Day 27>>]()
