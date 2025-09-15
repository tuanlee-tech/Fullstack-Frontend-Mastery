<div align="center">
  <h1> 30 Days Of React: Projects</h1>
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

[<< Day 23](../23_Fetching_Data_Using_Hooks/23_fetching_data_using_hooks.md) | [Day 25>>](../25_Custom_Hooks/25_custom_hooks.md)

![30 Days of React banner](../images/30_days_of_react_banner_day_24.jpg)

# Project Using React Hooks

# Exercises

1 Build the following application using [countries API](https://restcountries.eu/rest/v2/all).
[DEMO](https://www.30daysofreact.com/day-23/countries-data)


---

### 1️⃣ Version 1 – Basic React Hooks (useState + useEffect)

```javascript
import React, { useState, useEffect } from 'react';

const CountriesApp = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.eu/rest/v2/all');
        if (!response.ok) throw new Error('Cannot fetch countries');
        const data = await response.json();
        setCountries(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  if (loading) return <p>Loading... / Đang tải...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Countries Data / Dữ liệu các quốc gia</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '16px'
      }}>
        {countries.map(country => (
          <div key={country.alpha3Code} style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <img src={country.flag} alt={country.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
            <h3>{country.name}</h3>
            <p>Capital: {country.capital}</p>
            <p>Region: {country.region}</p>
            <p>Population: {country.population.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountriesApp;
```

**🇻🇳 Giải thích:**

1. `useState` dùng để lưu **countries**, trạng thái **loading** và **error**.
2. `useEffect` fetch data khi component mount.
3. `fetch` lấy dữ liệu từ API, nếu có lỗi thì hiển thị message.
4. Dùng **CSS grid** để hiển thị card cho mỗi quốc gia: flag, tên, thủ đô, khu vực, dân số.

---

### 2️⃣ Version 2 – Optimized (Lazy Load + Search Filter)

✅ **Tính năng nâng cao:**

1. **Search**: tìm quốc gia theo tên.
2. **Lazy load flag images** để giảm HTTP load.
3. **Responsive grid**.
4. **Component tách riêng**: `CountryCard`.

---

#### CountryCard.js

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

---

#### CountriesApp.js

```javascript
import React, { useState, useEffect } from 'react';
import CountryCard from './CountryCard';

const CountriesApp = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('https://restcountries.eu/rest/v2/all')
      .then(res => res.json())
      .then(data => { setCountries(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const filteredCountries = countries.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p>Loading... / Đang tải...</p>;
  if (error) return <p>{error}</p>;

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

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '16px'
      }}>
        {filteredCountries.map(country => (
          <CountryCard key={country.alpha3Code} country={country} />
        ))}
      </div>
    </div>
  );
};

export default CountriesApp;
```

---

### ✅ Ưu điểm bản optimized:

1. **Lazy load images** giảm HTTP load → UI mượt.
2. **Search filter** giúp tìm nhanh quốc gia.
3. **Component tách riêng** (CountryCard) → code gọn, dễ maintain.
4. **Responsive grid** tự động co theo màn hình.

🎉 CONGRATULATIONS ! 🎉

[<< Day 23](../23_Fetching_Data_Using_Hooks/23_fetching_data_using_hooks.md) | [Day 25>>](../25_Custom_Hooks/25_custom_hooks.md)
