<div align="center">
  <h1> 30 Days Of React: Custom Hooks</h1>
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

[<< Day 24](../24_projects/24_projects.md) | [Day 26>>](../26_Context/26_context.md)

![30 Days of React banner](../images/30_days_of_react_banner_day_25.jpg)

# Custom Hooks

It is possible to make a custom hook on top of the available React hooks. For instance, when we fetch data we with use either fetch or axios to send an HTTP request and useEffect hooks to manage the React life cycle. Let's build useFetch custom hook on top of useEffect and useState.

We wrote this snippet of code in the previous section and we use useEffect hooks to fetch data from API. Now, let's convert this code to a custom hook. The naming convention for a custom hook is camelCase and it starts with the word use that is why we called our custom hook, useFetch.

```js
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ReactDOM, { findDOMNode } from 'react-dom'

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

const App = (props) => {
  // setting initial state and method to update state
  const [data, setData] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const url = 'https://restcountries.eu/rest/v2/all'
    try {
      const response = await fetch(url)
      const data = await response.json()
      setData(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='App'>
      <h1>Fetching Data Using Hook</h1>
      <h1>Calling API</h1>
      <div>
        <p>There are {data.length} countries in the api</p>
        <div className='countries-wrapper'>
          {data.map((country) => (
            <Country country={country} />
          ))}
        </div>
      </div>
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
```

Create a file name useFetch.js, and import useState and useEffect. Then transfer the state, useEffect and fetchData function part of the above code to the useFetch.js.

```js
import { useState, useEffect } from 'react'

const useFetch = () => {
  const [data, setData] = useState([])

  const fetchData = async () => {
    const url = 'https://restcountries.eu/rest/v2/all'
    try {
      const response = await fetch(url)
      const data = await response.json()
      setData(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
}
```

Then let's make the useFetch function to take a parameter. When we fetch data the only thing which changes is the API therefore let's pass a URL parameter for the function.

```js
import { useState, useEffect } from 'react'

const useFetch = (url) => {
  const [data, setData] = useState([])

  const fetchData = async () => {
    try {
      const response = await fetch(url)
      const data = await response.json()
      setData(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
}

export default useFetch
```

With the above code, we should manage to fetch the data but it is advisable to put the function in the useEffect and let's move the function code the useEffect.

```js
import { useState, useEffect } from 'react'

export const useFetch = (url) => {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url)
        const data = await response.json()
        setData(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [url])

  return data
}

export default useFetch
```

Now, let's combine everything and make it work.

```js
// index.js

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ReactDOM, { findDOMNode } from 'react-dom'
import useFetch from './useFetch'

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

const App = (props) => {
  const url = 'https://restcountries.eu/rest/v2/all'
  const data = useFetch(url)

  return (
    <div className='App'>
      <h1>Custom Hooks</h1>
      <h1>Calling API</h1>
      <div>
        <p>There are {data.length} countries in the api</p>
        <div className='countries-wrapper'>
          {data.map((country) => (
            <Country country={country} />
          ))}
        </div>
      </div>
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
```

The useState and useEffect hooks are most common React hooks which you use on daily bases. In addition to the basic hook, there are additional hooks which are not used often. You do not have to know how to use all the hooks. The useState, useEffect and useRef are very important hooks and it is recommended to know how to use them.

# Exercises

Note: Continue building the countries application

1 Build the following application using [countries API](https://restcountries.eu/rest/v2/all).
[DEMO](https://www.30daysofreact.com/day-23/countries-data)

Đây là phiên bản **React functional component sử dụng Custom Hook (`useFetch`)** tương tự bài học về “Custom Hooks” để fetch dữ liệu từ **Countries API**, format song ngữ 🇺🇸 / 🇻🇳 và bao gồm **bản thường** và **bản tối ưu**.

---

## Exercises: Level 1 – Using Custom Hook

**Task / Nhiệm vụ:**
Build an application that fetches all countries from [Countries API](https://restcountries.eu/rest/v2/all) and displays country data.

---

### 1️⃣ Version 1 – Basic Custom Hook

**useFetch.js**

```javascript
import { useState, useEffect } from 'react';

// 🇺🇸 Basic custom hook to fetch data from API
// 🇻🇳 Hook tùy chỉnh cơ bản để fetch dữ liệu từ API
const useFetch = (url) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [url]);

  return data;
};

export default useFetch;
```

**App.js**

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import useFetch from './useFetch';

const Country = ({ country: { name, flag, population, capital, region } }) => (
  <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
    <img src={flag} alt={name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
    <h3>{name}</h3>
    <p>Capital: {capital}</p>
    <p>Region: {region}</p>
    <p>Population: {population.toLocaleString()}</p>
  </div>
);

const App = () => {
  const url = 'https://restcountries.eu/rest/v2/all';
  const countries = useFetch(url);

  return (
    <div style={{ padding: '16px' }}>
      <h2>Countries Data / Dữ liệu các quốc gia</h2>
      <p>There are {countries.length} countries in the API / Có {countries.length} quốc gia trong API</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        {countries.map(country => <Country key={country.alpha3Code} country={country} />)}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
```

---

### 2️⃣ Version 2 – Optimized Custom Hook + Search + Lazy Load

✅ **Tính năng tối ưu:**

1. **Search filter** để tìm quốc gia theo tên.
2. **Lazy load flag images** giảm HTTP load.
3. **Responsive grid**.
4. **Component tách riêng** (`CountryCard`).

**CountryCard.js**

```javascript
import React, { useRef, useState, useEffect } from 'react';

const CountryCard = ({ country }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          imgRef.current.src = country.flag;
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(imgRef.current);
  }, [country.flag]);

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
      <div style={{ width: '100%', height: '150px', backgroundColor: '#eee', marginBottom: '8px' }}>
        <img
          ref={imgRef}
          alt={country.name}
          onLoad={() => setImageLoaded(true)}
          style={{
            width: '100%',
            height: '150px',
            objectFit: 'cover',
            borderRadius: '8px',
            display: imageLoaded ? 'block' : 'none'
          }}
        />
      </div>
      <h3>{country.name}</h3>
      <p>Capital: {country.capital}</p>
      <p>Region: {country.region}</p>
      <p>Population: {country.population.toLocaleString()}</p>
    </div>
  );
};

export default CountryCard;
```

**CountriesApp.js**

```javascript
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import useFetch from './useFetch';
import CountryCard from './CountryCard';

const CountriesApp = () => {
  const url = 'https://restcountries.eu/rest/v2/all';
  const countries = useFetch(url);
  const [search, setSearch] = useState('');

  const filteredCountries = countries.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '16px' }}>
      <h2>Countries Data / Dữ liệu các quốc gia</h2>
      <input
        type="text"
        placeholder="Search country / Tìm quốc gia..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '16px' }}
      />
      <p>Showing {filteredCountries.length} countries / Hiển thị {filteredCountries.length} quốc gia</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '16px'
      }}>
        {filteredCountries.map(country => <CountryCard key={country.alpha3Code} country={country} />)}
      </div>
    </div>
  );
};

ReactDOM.render(<CountriesApp />, document.getElementById('root'));
```

---

### ✅ Ưu điểm bản optimized:

1. **Custom hook** tái sử dụng được cho mọi API chỉ cần truyền `url`.
2. **Lazy load images** giảm HTTP request → UI mượt.
3. **Search filter** tìm quốc gia dễ dàng.
4. **Component tách riêng**: `CountryCard` chỉ render 1 quốc gia, `CountriesApp` quản lý data + search.
5. **Responsive grid**: tự co theo mọi kích thước màn hình.

🎉 CONGRATULATIONS ! 🎉

[<< Day 24](../24_projects/24_projects.md) | [Day 26>>](../26_Context/26_context.md)
