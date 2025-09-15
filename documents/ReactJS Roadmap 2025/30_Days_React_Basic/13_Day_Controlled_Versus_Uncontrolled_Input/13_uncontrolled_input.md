<div align="center">
  <h1> 30 Days Of React: Uncontrolled Component</h1>
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

[<< Day 12](../12_Day_Forms/12_forms.md) | [Day 14 >>]()

![30 Days of React banner](../images/30_days_of_react_banner_day_13.jpg)

- [Uncotrolled Components](#uncotrolled-components)
  - [Getting data from an uncontrolled input](#getting-data-from-an-uncontrolled-input)
  - [Getting multiple input data from form](#getting-multiple-input-data-from-form)
- [Exercises](#exercises)
      - [\*\*Exercises: Level 1 – Controlled vs Uncontrolled Inputs\*\*](#exercises-level-1--controlled-vs-uncontrolled-inputs)

# Uncotrolled Components

In the previous day challenge we have covered controlled inputs. In react most of the time we use controlled inputs as recommended on the official [documentation of React](https://reactjs.org/docs/uncontrolled-components.html).

To write an uncontrolled component, instead of writing an event handler for every state update, you can use a ref to get form values from the DOM. In uncontrolled input we get data from input fields like traditional HTML form data handling.

An example of uncontrolled component

## Getting data from an uncontrolled input

```js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class App extends Component {
  firstName = React.createRef()

  handleSubmit = (e) => {
    e.preventDefault()
    console.log(this.firstName.current.value)
  }

  render() {
    return (
      <div className='App'>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor='firstName'>First Name: </label>
          <input
            type='text'
            id='firstName'
            name='firstName'
            placeholder='First Name'
            ref={this.firstName}
          />
          <button type='submit'>Submit</button>
        </form>
      </div>
    )
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
```

## Getting multiple input data from form

We can grab multiple input data from DOM. We are not directly targeting the DOM but React is getting data from DOM using ref.

```js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class App extends Component {
  firstName = React.createRef()
  lastName = React.createRef()
  country = React.createRef()
  title = React.createRef()

  handleSubmit = (e) => {
    // stops the default behavior of form element specifically refreshing of page
    e.preventDefault()

    console.log(this.firstName.current.value)
    console.log(this.lastName.current.value)
    console.log(this.title.current.value)
    console.log(this.country.current.value)

    const data = {
      firstName: this.firstName.current.value,
      lastName: this.lastName.current.value,
      title: this.title.current.value,
      country: this.country.current.value,
    }
    // the is the place we connect backend api to send the data to the database
    console.log(data)
  }

  render() {
    return (
      <div className='App'>
        <h3>Add Student</h3>
        <form onSubmit={this.handleSubmit}>
          <div>
            <input
              type='text'
              name='firstName'
              placeholder='First Name'
              ref={this.firstName}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <input
              type='text'
              name='lastName'
              placeholder='Last Name'
              ref={this.lastName}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <input
              type='text'
              name='country'
              placeholder='Country'
              ref={this.country}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <input
              type='text'
              name='title'
              placeholder='Title'
              ref={this.title}
              onChange={this.handleChange}
            />
          </div>

          <button className='btn btn-success'>Submit</button>
        </form>
      </div>
    )
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
```

Most of the time we use controlled input instead of uncontrolled input. In case if you want to target some element on the DOM you will use ref to get the content of that element. Don't touch directly using pure JavaScript. When you develop a React application do not touch the DOM directly because React has its own way of handling the DOM manipulation.

# Exercises

#### \*\*Exercises: Level 1 – Controlled vs Uncontrolled Inputs**
**Bài tập Level 1 – Input điều khiển và không điều khiển**

---

**1. What is a controlled input? / Input điều khiển là gì?**

* **EN:** A controlled input is an input element whose value is controlled by React state. React state is the single source of truth.
* **VI:** Input điều khiển là một phần tử input mà giá trị của nó được quản lý bởi state của React. State của React là nguồn dữ liệu duy nhất.

```jsx
<input type="text" value={this.state.name} onChange={this.handleChange} />
```

---

**2. What is an uncontrolled input? / Input không điều khiển là gì?**

* **EN:** An uncontrolled input is an input element whose value is handled by the DOM itself, not by React state. You access its value using a ref.
* **VI:** Input không điều khiển là một input mà giá trị được quản lý bởi DOM, không phải React state. Bạn truy cập giá trị này bằng ref.

```jsx
<input type="text" ref={this.inputRef} />
```

---

**3. How do you get the content of a certain HTML element in React? / Làm thế nào để lấy nội dung của một phần tử HTML trong React?**

* **EN:** Use refs in class components.
* **VI:** Dùng ref trong class component.

```jsx
this.myRef = React.createRef();

<div ref={this.myRef}>Hello</div>

// Access
console.log(this.myRef.current.textContent);
```

---

**4. Why it is not a good idea to touch the DOM directly in React? / Tại sao không nên thao tác trực tiếp với DOM trong React?**

* **EN:** React uses a virtual DOM; direct DOM manipulation can break React’s state-driven rendering and cause unexpected behavior.
* **VI:** React sử dụng virtual DOM; thao tác trực tiếp có thể phá vỡ cơ chế render theo state và gây hành vi không mong muốn.

---

**5. What is most frequently used in React? Controlled or Uncontrolled input? / Input nào được dùng nhiều hơn trong React?**

* **EN:** Controlled input – allows better control, validation, and state synchronization.
* **VI:** Input điều khiển – cho phép kiểm soát, validate và đồng bộ state tốt hơn.

---

**6. What do you need to write uncontrolled input? / Cần gì để viết input không điều khiển?**

* **EN:** A ref to access the DOM element.
* **VI:** Một ref để truy cập phần tử DOM.

```jsx
this.inputRef = React.createRef();
<input ref={this.inputRef} />
```

---

**7. Does state require to write uncontrolled input? / Input không điều khiển có cần state không?**

* **EN:** No, uncontrolled inputs don’t need state to store value.
* **VI:** Không, input không điều khiển không cần state để lưu giá trị.

---

**8. When do you use uncontrolled input? / Khi nào nên dùng input không điều khiển?**

* **EN:** When you don’t need to track input changes in React; e.g., quick forms or third-party libraries.
* **VI:** Khi bạn không cần theo dõi thay đổi input trong React; ví dụ: form nhanh hoặc thư viện bên thứ 3.

---

**9. When do you use controlled input? / Khi nào nên dùng input điều khiển?**

* **EN:** When you need to track input changes, validate input, or control form behavior in React.
* **VI:** Khi bạn cần theo dõi thay đổi input, validate hoặc điều khiển hành vi form trong React.

---

**10. Do you use a controlled or uncontrolled input to validate form input fields? / Nên dùng input điều khiển hay không điều khiển để validate form?**

* **EN:** Controlled input – its value is in React state and can be validated in real-time.
* **VI:** Input điều khiển – giá trị được lưu trong state React và có thể validate ngay lập tức.

---

✅ **Logic Notes / Ghi chú logic:**

* Controlled input = state + `onChange`
* Uncontrolled input = DOM value + `ref`
* Controlled input is **recommended for React forms** / Input điều khiển được khuyến nghị sử dụng trong form React.

🎉 CONGRATULATIONS ! 🎉

[<< Day 12](../12_Day_Forms/12_forms.md) | [Day 14 >>]()
