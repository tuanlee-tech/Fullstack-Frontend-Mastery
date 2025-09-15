<div align="center">
  <h1> 30 Days Of React: Fetch and Axios</h1>
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

[<< Day 17](../17_React_Router/17_react_router.md) | [Day 19>>]()

![30 Days of React banner](../images/30_days_of_react_banner_day_18.jpg)

- [Fetch and Axios](#fetch-and-axios)
  - [Fetch](#fetch)
  - [Axios](#axios)
- [Exercises](#exercises)
  - [Exercises: Level 1](#exercises-level-1)
  - [Exercises: Level 2](#exercises-level-2)
    - [React Class Component với Axios](#react-class-component-với-axios)
  - [Exercises: Level 3](#exercises-level-3)

# Fetch and Axios

## Fetch

Currently, JavaScript provides a fetch API to make HTTP requests. Fetch might not be supported by all browsers therefore we have install addition package for browser supports. However, if we use Axios we do not need to use additional package for browser support. Axios code seems neater than fetch. In this section we will see the difference between fetch and axios. May be if you want to know the browser support of fetch you check out on [caniuse](https://caniuse.com/ciu/index) website. As of today, it has 95.62% browser support.

```js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

const Country = ({
  country: { name, capital, flag, languages, population, currency },
}) => {
  const formatedCapital =
    capital.length > 0 ? (
      <>
        <span>Capital: </span>
        {capital}
      </>
    ) : (
      ''
    )
  const formatLanguage = languages.length > 1 ? `Languages` : `Language`
  console.log(languages)
  return (
    <div className='country'>
      <div className='country_flag'>
        <img src={flag} alt={name} />
      </div>
      <h3 className='country_name'>{name.toUpperCase()}</h3>
      <div class='country_text'>
        <p>{formatedCapital}</p>
        <p>
          <span>{formatLanguage}: </span>
          {languages.map((language) => language.name).join(', ')}
        </p>
        <p>
          <span>Population: </span>
          {population.toLocaleString()}
        </p>
        <p>
          <span>Currency: </span>
          {currency}
        </p>
      </div>
    </div>
  )
}

class App extends Component {
  state = {
    data: [],
  }

  componentDidMount() {
    const url = 'https://restcountries.eu/rest/v2/all'
    fetch(url)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        console.log(data)
        this.setState({
          data,
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render() {
    return (
      <div className='App'>
        <h1>React Component Life Cycle</h1>
        <h1>Calling API</h1>
        <div>
          <p>There are {this.state.data.length} countries in the api</p>
          <div className='countries-wrapper'>
            {this.state.data.map((country) => (
              <Country country={country} />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
```

We can implement async and await and make the above code short and clean.

```js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

const Country = ({
  country: { name, capital, flag, languages, population, currency },
}) => {
  const formatedCapital =
    capital.length > 0 ? (
      <>
        <span>Capital: </span>
        {capital}
      </>
    ) : (
      ''
    )
  const formatLanguage = languages.length > 1 ? `Languages` : `Language`
  console.log(languages)
  return (
    <div className='country'>
      <div className='country_flag'>
        <img src={flag} alt={name} />
      </div>
      <h3 className='country_name'>{name.toUpperCase()}</h3>
      <div class='country_text'>
        <p>{formatedCapital}</p>
        <p>
          <span>{formatLanguage}: </span>
          {languages.map((language) => language.name).join(', ')}
        </p>
        <p>
          <span>Population: </span>
          {population.toLocaleString()}
        </p>
        <p>
          <span>Currency: </span>
          {currency}
        </p>
      </div>
    </div>
  )
}

class App extends Component {
  state = {
    data: [],
  }

  componentDidMount() {
    this.fetchCountryData()
  }

  fetchCountryData = async () => {
    const url = 'https://restcountries.eu/rest/v2/all'
    const response = await fetch(url)
    const data = await response.json()
    this.setState({
      data,
    })
  }

  render() {
    return (
      <div className='App'>
        <h1>Fetching API using Fetch</h1>
        <h1>Calling API</h1>
        <div>
          <p>There are {this.state.data.length} countries in the api</p>
          <div className='countries-wrapper'>
            {this.state.data.map((country) => (
              <Country country={country} />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
```

If we use async and await we handle the error using try and catch. Let's apply a try catch block in the above code.

```js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

const Country = ({ country: { name, flag, population } }) => {
  return (
    <div className='country'>
      <div className='country_flag'>
        <img src={flag} alt={name} />
      </div>
      <h3 className='country_name'>{name.toUpperCase()}</h3>
      <div class='country_text'>
        <p>
          <span>Population: </span>
          {population}
        </p>
        <p>
          <span>Currency: </span>
          {currency}
        </p>
      </div>
    </div>
  )
}

class App extends Component {
  state = {
    data: [],
  }

  componentDidMount() {
    this.fetchCountryData()
  }

  fetchCountryData = async () => {
    const url = 'https://restcountries.eu/rest/v2/all'
    try {
      const response = await fetch(url)
      const data = await response.json()
      this.setState({
        data,
      })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <div className='App'>
        <h1>Fetching API using Fetch</h1>
        <h1>Calling API</h1>
        <div>
          <p>There are {this.state.data.length} countries in the api</p>
          <div className='countries-wrapper'>
            {this.state.data.map((country) => (
              <Country country={country} />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
```

Now, let's see how to do the same API call using axios.

How can do fetch if we have multiple API two call ?

## Axios

Axios is a third party package and we need to install it using npm. It is the most popular way to make HTTP requests(GET, POST, PUT, PATCH, DELETE). In this example, we will cover only a get request.

```js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

const Country = ({
  country: { name, capital, flag, languages, population, currency },
}) => {
  return (
    <div className='country'>
      <div className='country_flag'>
        <img src={flag} alt={name} />
      </div>
      <h3 className='country_name'>{name.toUpperCase()}</h3>
      <div class='country_text'>
        <p>
          <span>Population: </span>
          {population}
        </p>
        >
      </div>
    </div>
  )
}

class App extends Component {
  state = {
    data: [],
  }

  componentDidMount() {
    const url = 'https://restcountries.eu/rest/v2/all'
    axios
      .get(url)
      .then((response) => {
        this.setState({
          data: response.data,
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render() {
    return (
      <div className='App'>
        <h1>React Component Life Cycle</h1>
        <h1>Calling API</h1>
        <div>
          <p>There are {this.state.data.length} countries in the api</p>
          <div className='countries-wrapper'>
            {this.state.data.map((country) => (
              <Country country={country} />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
```

Let's also implement the axios fetching using async and await.

```js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

const Country = ({ country: { name, flag, population } }) => {
  return (
    <div className='country'>
      <div className='country_flag'>
        <img src={flag} alt={name} />
      </div>
      <h3 className='country_name'>{name.toUpperCase()}</h3>
      <div class='country_text'>
        <p>
          <span>Population: </span>
          {population}
        </p>
      </div>
    </div>
  )
}

class App extends Component {
  state = {
    data: [],
  }

  componentDidMount() {
    this.fetchCountryData()
  }
  fetchCountryData = async () => {
    const url = 'https://restcountries.eu/rest/v2/all'
    try {
      const response = await axios.get(url)
      const data = await response.data
      this.setState({
        data,
      })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <div className='App'>
        <h1>React Component Life Cycle</h1>
        <h1>Calling API</h1>
        <div>
          <p>There are {this.state.data.length} countries in the api</p>
          <div className='countries-wrapper'>
            {this.state.data.map((country) => (
              <Country country={country} />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
```

As you have seen, there is no much difference between fetch and axios. But I recommend you to use more axios than fetch because of browser support and easy of use.

# Exercises

## Exercises: Level 1

1. **What is HTTP request? / HTTP request là gì?**
   🇺🇸 An HTTP request is a message sent by a client (like a browser or app) to a server asking for data or to perform an action. It usually includes URL, Method, Headers, and Body.
   🇻🇳 HTTP request là một thông điệp được gửi từ client (như trình duyệt hoặc ứng dụng) đến server để yêu cầu dữ liệu hoặc thực hiện một hành động. Nó thường bao gồm URL, Method, Headers, và Body.

---

2. **What are the most common HTTP requests? / Các loại HTTP request phổ biến nhất là gì?**
   🇺🇸 The most common HTTP methods are:

* **GET** – retrieve data
* **POST** – send new data
* **PUT** – update existing data completely
* **PATCH** – update existing data partially
* **DELETE** – remove data

🇻🇳 Các phương thức HTTP phổ biến nhất gồm:

* **GET** – lấy dữ liệu
* **POST** – gửi dữ liệu mới
* **PUT** – cập nhật toàn bộ dữ liệu
* **PATCH** – cập nhật một phần dữ liệu
* **DELETE** – xóa dữ liệu

---

3. **What is fetch? / Fetch là gì?**
   🇺🇸 `fetch` is a built-in JavaScript function to make HTTP requests. It returns a Promise that resolves to the server response.

🇻🇳 `fetch` là một hàm có sẵn trong JavaScript dùng để thực hiện HTTP request. Nó trả về một Promise chứa kết quả phản hồi từ server.

Example / Ví dụ:

```javascript
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data));
```

---

4. **What is axios? / Axios là gì?**
   🇺🇸 `axios` is a popular JavaScript library for making HTTP requests. It works in browsers and Node.js and supports Promises.

🇻🇳 `axios` là một thư viện JavaScript phổ biến dùng để thực hiện HTTP request. Nó hoạt động cả trên trình duyệt và Node.js, hỗ trợ Promises.

Example / Ví dụ:

```javascript
axios.get('https://api.example.com/data')
  .then(response => console.log(response.data));
```

---

5. **What is the difference between fetch and axios? / Sự khác nhau giữa fetch và axios là gì?**

| Feature / Tính năng                                                                     | fetch                                                   | axios |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------- | ----- |
| Syntax / Cú pháp                                                                        | 🇺🇸 Built-in, simpler but requires extra JSON handling |       |
| 🇻🇳 Có sẵn, đơn giản nhưng cần thêm code xử lý JSON                                    | 🇺🇸 Library, easier JSON handling                      |       |
| 🇻🇳 Thư viện, xử lý JSON dễ dàng hơn                                                   |                                                         |       |
| Browser support / Hỗ trợ trình duyệt                                                    | 🇺🇸 Modern browsers only                               |       |
| 🇻🇳 Chỉ trình duyệt hiện đại                                                           | 🇺🇸 All modern browsers + IE                           |       |
| 🇻🇳 Hỗ trợ cả IE và trình duyệt hiện đại                                               |                                                         |       |
| Interceptors / Can intercept requests & responses / Có thể can thiệp request & response | 🇺🇸 No                                                 |       |
| 🇻🇳 Không                                                                              | 🇺🇸 Yes                                                |       |
| 🇻🇳 Có                                                                                 |                                                         |       |
| Cancel request / Hủy request                                                            | 🇺🇸 Hard                                               |       |
| 🇻🇳 Khó                                                                                | 🇺🇸 Easy                                               |       |
| 🇻🇳 Dễ dàng                                                                            |                                                         |       |

---

6. **Do you prefer fetch to axios for making HTTP requests? / Bạn thích dùng fetch hay axios để thực hiện HTTP request?**
   🇺🇸 It depends on the project.

* Use **fetch** for simple requests
* Use **axios** for advanced requests, JSON handling, interceptors, or canceling requests
  Personally, I prefer **axios** because it’s easier to handle JSON and errors.

🇻🇳 Tùy vào dự án.

* Dùng **fetch** cho các request đơn giản
* Dùng **axios** cho request phức tạp, xử lý JSON, interceptors hoặc hủy request dễ dàng
  Cá nhân tôi thích **axios** vì dễ xử lý JSON và quản lý lỗi hơn.

## Exercises: Level 2

1. Find the average metric weight and life span of cats in the following [API](https://api.thecatapi.com/v1/breeds). There are 67 breeds of cats in the API.
  * Tìm cân nặng trung bình (kg) và tuổi thọ trung bình (năm) của mèo từ API

![Average cat weight and age](../images/average_cat_weight_and_age.png)

🇺🇸 **Solution using fetch:**

```javascript
async function getAverageCatData() {
  try {
    const response = await fetch('https://api.thecatapi.com/v1/breeds');
    const breeds = await response.json();

    let totalWeight = 0;
    let totalAge = 0;
    let count = breeds.length;

    breeds.forEach(breed => {
      // weight.metric example: "3 - 5"
      const [minWeight, maxWeight] = breed.weight.metric.split(' - ').map(Number);
      const avgWeight = (minWeight + maxWeight) / 2;
      totalWeight += avgWeight;

      // life_span example: "12 - 16"
      const [minAge, maxAge] = breed.life_span.split(' - ').map(Number);
      const avgAge = (minAge + maxAge) / 2;
      totalAge += avgAge;
    });

    const averageWeight = (totalWeight / count).toFixed(2);
    const averageAge = (totalAge / count).toFixed(2);

    console.log(`Average cat weight: ${averageWeight} Kg`);
    console.log(`Average cat lifespan: ${averageAge} years`);
  } catch (error) {
    console.error('Error fetching cat data:', error);
  }
}

getAverageCatData();
```

🇻🇳 **Giải thích / Explanation:**

* Gọi API `/v1/breeds` để lấy dữ liệu 67 giống mèo.
* `weight.metric` là chuỗi `"min - max"`, tách ra và tính trung bình mỗi giống.
* `life_span` cũng là chuỗi `"min - max"`, tách ra và tính trung bình.
* Cuối cùng, lấy tổng chia số giống để ra **trung bình cân nặng và tuổi thọ**.
* 
### React Class Component với Axios
```js
import React, { Component } from 'react';
import axios from 'axios';

class AverageCatData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      averageWeight: null,
      averageLifespan: null,
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    this.fetchCatData();
  }

  async fetchCatData() {
    try {
      const response = await axios.get('https://api.thecatapi.com/v1/breeds');
      const breeds = response.data;

      let totalWeight = 0;
      let totalAge = 0;
      let count = breeds.length;

      breeds.forEach(breed => {
        // weight.metric example: "3 - 5"
        const [minWeight, maxWeight] = breed.weight.metric.split(' - ').map(Number);
        const avgWeight = (minWeight + maxWeight) / 2;
        totalWeight += avgWeight;

        // life_span example: "12 - 16"
        const [minAge, maxAge] = breed.life_span.split(' - ').map(Number);
        const avgAge = (minAge + maxAge) / 2;
        totalAge += avgAge;
      });

      const averageWeight = (totalWeight / count).toFixed(2);
      const averageLifespan = (totalAge / count).toFixed(2);

      this.setState({ averageWeight, averageLifespan, loading: false });
    } catch (error) {
      this.setState({ error: 'Error fetching cat data', loading: false });
    }
  }

  render() {
    const { averageWeight, averageLifespan, loading, error } = this.state;

    if (loading) return <p>Loading... / Đang tải...</p>;
    if (error) return <p>{error}</p>;

    return (
      <div>
        <h2>Cat Statistics / Thống kê mèo</h2>
        <p>Average weight / Cân nặng trung bình: {averageWeight} Kg</p>
        <p>Average lifespan / Tuổi thọ trung bình: {averageLifespan} years</p>
      </div>
    );
  }
}

export default AverageCatData;

```
## Exercises: Level 3

1. How many countries do have cat breeds?
2. Which country has the highest number of cat breeds?
3. Arrange countries in ascending order based on the number of cat breeds they have?

🎉 CONGRATULATIONS ! 🎉

[<< Day 17](../17_React_Router/17_react_router.md) | [Day 19>>]()
