<div align="center">
  <h1> 30 Days Of React: Conditional Rendering</h1>
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

[<< Day 8](../08_Day_States/08_states.md) | [Day 10 >>](../10_React_Project_Folder_Structure/10_react_project_folder_structure.md)

![30 Days of React banner](../images/30_days_of_react_banner_day_9.jpg)

# Conditional Rendering

As we can understand from the term, conditional rendering is a way to render different JSX or component at different condition. We can implement conditional rendering using regular if and else statement, ternary operator and &&. Let's implement a different conditional rendering.

## Conditional Rendering using If and Else statement

In the code below, we have an initial state of loggedIn which is false. If the state is false we inform user to log in otherwise we welcome the user.

```js
// index.js
import React from 'react'
import ReactDOM from 'react-dom'

// class based component
class Header extends React.Component {
  render() {
    const {
      welcome,
      title,
      subtitle,
      author: { firstName, lastName },
      date,
    } = this.props.data

    return (
      <header>
        <div className='header-wrapper'>
          <h1>{welcome}</h1>
          <h2>{title}</h2>
          <h3>{subtitle}</h3>
          <p>
            {firstName} {lastName}
          </p>
          <small>{date}</small>
          <p>Select a country for your next holiday</p>
        </div>
      </header>
    )
  }
}

class App extends React.Component {
  state = {
    loggedIn: false,
  }

  render() {
    const data = {
      welcome: '30 Days Of React',
      title: 'Getting Started React',
      subtitle: 'JavaScript Library',
      author: {
        firstName: 'Asabeneh',
        lastName: 'Yetayeh',
      },
      date: 'Oct 9, 2020',
    }

    // conditional rendering using if and else statement

    let status

    if (this.state.loggedIn) {
      status = <h3>Welcome to 30 Days Of React</h3>
    } else {
      status = <h3>Please Login</h3>
    }

    return (
      <div className='app'>
        <Header data={data} />
        {status}
      </div>
    )
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
```

Let's add a method which allow as to toggle the status of the user. We should have a button to handle event for logging in and logging out.

```js
// index.js
import React from 'react'
import ReactDOM from 'react-dom'

// A button component
const Button = ({ text, onClick, style }) => (
  <button style={style} onClick={onClick}>
    {text}
  </button>
)

// CSS styles in JavaScript Object
const buttonStyles = {
  backgroundColor: '#61dbfb',
  padding: 10,
  border: 'none',
  borderRadius: 5,
  margin: '3px auto',
  cursor: 'pointer',
  fontSize: 22,
  color: 'white',
}

// class based component
class Header extends React.Component {
  render() {
    console.log(this.props.data)
    const {
      welcome,
      title,
      subtitle,
      author: { firstName, lastName },
      date,
    } = this.props.data

    return (
      <header>
        <div className='header-wrapper'>
          <h1>{welcome}</h1>
          <h2>{title}</h2>
          <h3>{subtitle}</h3>
          <p>
            {firstName} {lastName}
          </p>
          <small>{date}</small>
        </div>
      </header>
    )
  }
}

class App extends React.Component {
  state = {
    loggedIn: false,
  }
  handleLogin = () => {
    this.setState({
      loggedIn: !this.state.loggedIn,
    })
  }

  render() {
    const data = {
      welcome: '30 Days Of React',
      title: 'Getting Started React',
      subtitle: 'JavaScript Library',
      author: {
        firstName: 'Asabeneh',
        lastName: 'Yetayeh',
      },
      date: 'Oct 9, 2020',
    }

    let status
    let text

    if (this.state.loggedIn) {
      status = <h1>Welcome to 30 Days Of React</h1>
      text = 'Logout'
    } else {
      status = <h3>Please Login</h3>
      text = 'Login'
    }

    return (
      <div className='app'>
        <Header data={data} />
        {status}
        <Button text={text} style={buttonStyles} onClick={this.handleLogin} />
      </div>
    )
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
```

How about if our condition is more than two? Like pure JavaScript we can use if else if statement. In general, conditional rendering is not different from pure JavaScript conditional statement.

## Conditional Rendering using Ternary Operator

Ternary operator is an an alternative for if else statement. However, there is more use cases for ternary operator than if else statement. For example, use can use ternary operator inside styles, className or many places in a component than regular if else statement.

```js
// index.js
import React from 'react'
import ReactDOM from 'react-dom'

// A button component
const Button = ({ text, onClick, style }) => (
  <button style={style} onClick={onClick}>
    {text}
  </button>
)

// CSS styles in JavaScript Object
const buttonStyles = {
  backgroundColor: '#61dbfb',
  padding: 10,
  border: 'none',
  borderRadius: 5,
  margin: '3px auto',
  cursor: 'pointer',
  fontSize: 22,
  color: 'white',
}

// class based component
class Header extends React.Component {
  render() {
    const {
      welcome,
      title,
      subtitle,
      author: { firstName, lastName },
      date,
    } = this.props.data

    return (
      <header>
        <div className='header-wrapper'>
          <h1>{welcome}</h1>
          <h2>{title}</h2>
          <h3>{subtitle}</h3>
          <p>
            {firstName} {lastName}
          </p>
          <small>{date}</small>
        </div>
      </header>
    )
  }
}

class App extends React.Component {
  state = {
    loggedIn: false,
  }
  handleLogin = () => {
    this.setState({
      loggedIn: !this.state.loggedIn,
    })
  }

  render() {
    const data = {
      welcome: '30 Days Of React',
      title: 'Getting Started React',
      subtitle: 'JavaScript Library',
      author: {
        firstName: 'Asabeneh',
        lastName: 'Yetayeh',
      },
      date: 'Oct 9, 2020',
    }

    let status = this.state.loggedIn ? (
      <h1>Welcome to 30 Days Of React</h1>
    ) : (
      <h3>Please Login</h3>
    )

    return (
      <div className='app'>
        <Header data={data} />
        {status}
        <Button
          text={this.state.loggedIn ? 'Logout' : 'Login'}
          style={buttonStyles}
          onClick={this.handleLogin}
        />
      </div>
    )
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
```

In addition to JSX, we can also conditionally render a component. Let's change the above conditional JSX to a component.

```js
// index.js
import React from 'react'
import ReactDOM from 'react-dom'

// A button component
const Button = ({ text, onClick, style }) => (
  <button style={style} onClick={onClick}>
    {text}
  </button>
)

// CSS styles in JavaScript Object
const buttonStyles = {
  backgroundColor: '#61dbfb',
  padding: 10,
  border: 'none',
  borderRadius: 5,
  margin: '3px auto',
  cursor: 'pointer',
  fontSize: 22,
  color: 'white',
}

// class based component
class Header extends React.Component {
  render() {
    const {
      welcome,
      title,
      subtitle,
      author: { firstName, lastName },
      date,
    } = this.props.data

    return (
      <header>
        <div className='header-wrapper'>
          <h1>{welcome}</h1>
          <h2>{title}</h2>
          <h3>{subtitle}</h3>
          <p>
            {firstName} {lastName}
          </p>
          <small>{date}</small>
        </div>
      </header>
    )
  }
}

const Login = () => (
  <div>
    <h3>Please Login</h3>
  </div>
)
const Welcome = (props) => (
  <div>
    <h1>Welcome to 30 Days Of React</h1>
  </div>
)

class App extends React.Component {
  state = {
    loggedIn: false,
  }
  handleLogin = () => {
    this.setState({
      loggedIn: !this.state.loggedIn,
    })
  }

  render() {
    const data = {
      welcome: '30 Days Of React',
      title: 'Getting Started React',
      subtitle: 'JavaScript Library',
      author: {
        firstName: 'Asabeneh',
        lastName: 'Yetayeh',
      },
      date: 'Oct 9, 2020',
    }

    const status = this.state.loggedIn ? <Welcome /> : <Login />

    return (
      <div className='app'>
        <Header data={data} />
        {status}
        <Button
          text={this.state.loggedIn ? 'Logout' : 'Login'}
          style={buttonStyles}
          onClick={this.handleLogin}
        />
      </div>
    )
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
```

## Conditional Rendering using && Operator

The && operator render the right JSX operand if the left operand(expression) is true.

```js
// index.js
import React from 'react'
import ReactDOM from 'react-dom'

// A button component
const Button = ({ text, onClick, style }) => (
  <button style={style} onClick={onClick}>
    {text}
  </button>
)

// CSS styles in JavaScript Object
const buttonStyles = {
  backgroundColor: '#61dbfb',
  padding: 10,
  border: 'none',
  borderRadius: 5,
  margin: '3px auto',
  cursor: 'pointer',
  fontSize: 22,
  color: 'white',
}

// class based component
class Header extends React.Component {
  render() {
    console.log(this.props.data)
    const {
      welcome,
      title,
      subtitle,
      author: { firstName, lastName },
      date,
    } = this.props.data

    return (
      <header style={this.props.styles}>
        <div className='header-wrapper'>
          <h1>{welcome}</h1>
          <h2>{title}</h2>
          <h3>{subtitle}</h3>
          <p>
            {firstName} {lastName}
          </p>
          <small>{date}</small>
        </div>
      </header>
    )
  }
}
const Login = () => (
  <div>
    <h3>Please Login</h3>
  </div>
)
const Welcome = (props) => (
  <div>
    <h1>Welcome to 30 Days Of React</h1>
  </div>
)

class App extends React.Component {
  state = {
    loggedIn: false,
    techs: ['HTML', 'CSS', 'JS'],
  }
  handleLogin = () => {
    this.setState({
      loggedIn: !this.state.loggedIn,
    })
  }

  render() {
    const data = {
      welcome: '30 Days Of React',
      title: 'Getting Started React',
      subtitle: 'JavaScript Library',
      author: {
        firstName: 'Asabeneh',
        lastName: 'Yetayeh',
      },
      date: 'Oct 9, 2020',
    }

    // We can destructure state

    const { loggedIn, techs } = this.state

    const status = loggedIn ? <Welcome /> : <Login />

    return (
      <div className='app'>
        <Header data={data} />
        {status}
        <Button
          text={loggedIn ? 'Logout' : 'Login'}
          style={buttonStyles}
          onClick={this.handleLogin}
        />
        {techs.length === 3 && (
          <p>You have all the prerequisite courses to get started React</p>
        )}
        {!loggedIn && (
          <p>
            Please login to access more information about 30 Days Of React
            challenge
          </p>
        )}
      </div>
    )
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
```

In the previous section, we used alert box to greet people and also to display time. Let's render the greeting and time on browser DOM instead of displaying on alert box.

```js
// index.js
import React from 'react'
import ReactDOM from 'react-dom'

// class based component
class Header extends React.Component {
  render() {
    console.log(this.props.data)
    const {
      welcome,
      title,
      subtitle,
      author: { firstName, lastName },
      date,
    } = this.props.data

    return (
      <header style={this.props.styles}>
        <div className='header-wrapper'>
          <h1>{welcome}</h1>
          <h2>{title}</h2>
          <h3>{subtitle}</h3>
          <p>
            {firstName} {lastName}
          </p>
          <small>{date}</small>
        </div>
      </header>
    )
  }
}

const Message = ({ message }) => (
  <div>
    <h1>{message}</h1>
  </div>
)
const Login = () => (
  <div>
    <h3>Please Login</h3>
  </div>
)
const Welcome = (props) => (
  <div>
    <h1>Welcome to 30 Days Of React</h1>
  </div>
)

// A button component
const Button = ({ text, onClick, style }) => (
  <button style={style} onClick={onClick}>
    {text}
  </button>
)

// TechList Component
// class base component
class TechList extends React.Component {
  render() {
    const { techs } = this.props
    const techsFormatted = techs.map((tech) => <li key={tech}>{tech}</li>)
    return techsFormatted
  }
}

// Main Component
// Class Component
class Main extends React.Component {
  render() {
    const {
      techs,
      greetPeople,
      handleTime,
      loggedIn,
      handleLogin,
      message,
    } = this.props
    console.log(message)

    const status = loggedIn ? <Welcome /> : <Login />
    return (
      <main>
        <div className='main-wrapper'>
          <p>Prerequisite to get started react.js:</p>
          <ul>
            <TechList techs={this.props.techs} />
          </ul>
          {techs.length === 3 && (
            <p>You have all the prerequisite courses to get started React</p>
          )}
          <div>
            <Button
              text='Show Time'
              onClick={handleTime}
              style={buttonStyles}
            />{' '}
            <Button
              text='Greet People'
              onClick={greetPeople}
              style={buttonStyles}
            />
            {!loggedIn && <p>Please login to access more information about 30 Days Of React challenge</p>}
          </div>
          <div style={{ margin: 30 }}>
            <Button
              text={loggedIn ? 'Logout' : 'Login'}
              style={buttonStyles}
              onClick={handleLogin}
            />
            <br />
            {status}
          </div>
          <Message message={message} />
        </div>
      </main>
    )
  }
}

// CSS styles in JavaScript Object
const buttonStyles = {
  backgroundColor: '#61dbfb',
  padding: 10,
  border: 'none',
  borderRadius: 5,
  margin: '3px auto',
  cursor: 'pointer',
  fontSize: 22,
  color: 'white',
}

// Footer Component
// Class component
class Footer extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <footer>
        <div className='footer-wrapper'>
          <p>Copyright {this.props.date.getFullYear()}</p>
        </div>
      </footer>
    )
  }
}

class App extends React.Component {
  state = {
    loggedIn: false,
    techs: ['HTML', 'CSS', 'JS'],
    message: 'Click show time or Greet people to change me',
  }
  handleLogin = () => {
    this.setState({
      loggedIn: !this.state.loggedIn,
    })
  }
  showDate = (time) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    const month = months[time.getMonth()].slice(0, 3)
    const year = time.getFullYear()
    const date = time.getDate()
    return `${month} ${date}, ${year}`
  }
  handleTime = () => {
    let message = this.showDate(new Date())
    this.setState({ message })
  }
  greetPeople = () => {
    let message = 'Welcome to 30 Days Of React Challenge, 2020'
    this.setState({ message })
  }

  render() {
    const data = {
      welcome: '30 Days Of React',
      title: 'Getting Started React',
      subtitle: 'JavaScript Library',
      author: {
        firstName: 'Asabeneh',
        lastName: 'Yetayeh',
      },
      date: 'Oct 9, 2020',
    }

    return (
      <div className='app'>
        <Header data={data} />

        <Main
          techs={techs}
          handleTime={this.handleTime}
          greetPeople={this.greetPeople}
          loggedIn={this.state.loggedIn}
          handleLogin={this.handleLogin}
          message={this.state.message}
        />

        <Footer date={new Date()} />
      </div>
    )
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
```
## Testimony
Now it is time to express your thoughts about the Author and 30DaysOfReact. You can leave your testimonial on this [link](https://www.asabeneh.com/testimonials)

## Exercises



### **Exercises: Level 1 – Conditional Rendering**

**1. What is conditional rendering?**

Conditional rendering là kỹ thuật trong React cho phép **hiển thị UI khác nhau dựa trên điều kiện**.

Ví dụ: nếu người dùng đã đăng nhập thì hiển thị nút “Logout”, nếu chưa thì hiển thị “Login”.

---

**2. How do you implement conditional rendering?**

Có một số cách phổ biến trong React:

* **Sử dụng `if` statements**

```jsx
render() {
  const isLoggedIn = this.state.isLoggedIn;
  if (isLoggedIn) {
    return <h1>Welcome Back!</h1>;
  } else {
    return <h1>Please Login</h1>;
  }
}
```

* **Sử dụng ternary operator (`? :`)**

```jsx
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn ? <h1>Welcome Back!</h1> : <h1>Please Login</h1>}
    </div>
  );
}
```

* **Sử dụng logical AND (`&&`)**

```jsx
render() {
  const showMessage = true;
  return (
    <div>
      {showMessage && <p>This message shows only if showMessage is true.</p>}
    </div>
  );
}
```

* **Sử dụng helper function**

```jsx
renderMessage() {
  const { isLoggedIn } = this.state;
  return isLoggedIn ? <h1>Welcome Back!</h1> : <h1>Please Login</h1>;
}

render() {
  return <div>{this.renderMessage()}</div>;
}
```

---

**3. Which method of conditional rendering do you prefer to use?**

* **Ternary (`? :`)**: ngắn gọn, phổ biến cho 2 lựa chọn.
* **Logical AND (`&&`)**: tiện khi chỉ muốn render nếu điều kiện đúng.
* **If statement**: tốt khi logic phức tạp.
* **Helper function**: dễ maintain khi UI logic nhiều nhánh.

💡 **Tip:** Tránh lồng nhiều ternary vì code sẽ khó đọc.

### **Exercises: Level 2 – Dynamic Backgrounds**

**1. Make a single page application which changes the body of the background based on the season of the year (Autumn, Winter, Spring, Summer)**

**Answer (Class Component Example):**

```jsx
import React, { Component } from "react";

class SeasonalBackground extends Component {
  constructor(props) {
    super(props);
    this.state = {
      season: this.getSeason(),
    };
  }

  getSeason() {
    const month = new Date().getMonth() + 1; // 1 - January, 12 - December
    if (month >= 3 && month <= 5) return "Spring";
    else if (month >= 6 && month <= 8) return "Summer";
    else if (month >= 9 && month <= 11) return "Autumn";
    else return "Winter";
  }

  render() {
    const { season } = this.state;

    const backgroundColors = {
      Spring: "#a8e6cf",
      Summer: "#ffd3b6",
      Autumn: "#ffaaa5",
      Winter: "#dcedc1",
    };

    const style = {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: backgroundColors[season],
      fontSize: "2rem",
      transition: "background-color 1s ease",
    };

    return (
      <div style={style}>
        Current Season: {season}
      </div>
    );
  }
}

export default SeasonalBackground;
```

✅ **Explanation:**

* `getSeason()` dựa vào tháng hiện tại để xác định mùa.
* State `season` dùng để chọn màu nền.
* Màu nền thay đổi **dynamically** theo mùa.

---

**2. Make a single page application which changes the body of the background based on the time of the day (Morning, Noon, Evening, Night)**

**Answer (Class Component Example):**

```jsx
import React, { Component } from "react";

class TimeOfDayBackground extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeOfDay: this.getTimeOfDay(),
    };
  }

  getTimeOfDay() {
    const hour = new Date().getHours(); // 0 - 23
    if (hour >= 5 && hour < 12) return "Morning";
    else if (hour >= 12 && hour < 17) return "Noon";
    else if (hour >= 17 && hour < 20) return "Evening";
    else return "Night";
  }

  render() {
    const { timeOfDay } = this.state;

    const backgroundColors = {
      Morning: "#FFFACD", // LemonChiffon
      Noon: "#87CEEB", // SkyBlue
      Evening: "#FFA07A", // LightSalmon
      Night: "#2F4F4F", // DarkSlateGray
    };

    const style = {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: backgroundColors[timeOfDay],
      fontSize: "2rem",
      color: timeOfDay === "Night" ? "#fff" : "#000",
      transition: "background-color 1s ease",
    };

    return (
      <div style={style}>
        Current Time: {timeOfDay}
      </div>
    );
  }
}

export default TimeOfDayBackground;
```

✅ **Explanation:**

* `getTimeOfDay()` dựa vào giờ hiện tại để xác định thời gian trong ngày.
* State `timeOfDay` dùng để chọn màu nền và màu chữ.
* Nền thay đổi **dynamic** và có hiệu ứng chuyển màu mượt (`transition`).

---

💡 **Tip:** Bạn có thể kết hợp cả mùa và thời gian trong cùng một component để background thay đổi phức tạp hơn.

### **Exercises: Level 3 – Loading State**

**1. Fetching data takes some amount of time. A user has to wait until the data get loaded. Implement a loading functionality if the data is not fetched yet. You can simulate the delay using `setTimeout`.**

**Answer (Class Component Example, logic only):**

```jsx
import React, { Component } from "react";

class DataLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,    // initial data is null
      loading: true, // initial loading state
    };
  }

  componentDidMount() {
    // simulate fetching data with 2 seconds delay
    setTimeout(() => {
      const fetchedData = {
        name: "ReactJS",
        type: "JavaScript Library",
        purpose: "Build UI",
      };
      this.setState({ data: fetchedData, loading: false });
    }, 2000);
  }

  render() {
    const { data, loading } = this.state;

    if (loading) {
      return <div>Loading data, please wait...</div>;
    }

    return (
      <div>
        <h2>Data Loaded:</h2>
        <p>Name: {data.name}</p>
        <p>Type: {data.type}</p>
        <p>Purpose: {data.purpose}</p>
      </div>
    );
  }
}

export default DataLoader;
```

✅ **Logic explanation:**

1. `state.loading` dùng để kiểm tra xem dữ liệu đã được load chưa.
2. `componentDidMount()` mô phỏng **fetching data** bằng `setTimeout`.
3. Khi dữ liệu chưa có (`loading: true`) → render “Loading…”.
4. Khi dữ liệu đã có (`loading: false`) → render dữ liệu thật.

💡 **Tip:** Đây là pattern cơ bản để xử lý **loading state** trong React class component.

🎉 CONGRATULATIONS ! 🎉

[<< Day 8](../08_Day_States/08_states.md) | [Day 10 >>](../10_React_Project_Folder_Structure/10_react_project_folder_structure.md)
