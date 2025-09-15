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

[<< Day 18](../18_Fetch_And_Axios/18_fetch_axios.md) | [Day 20>>]()

![30 Days of React banner](../images/30_days_of_react_banner_day_19.jpg)

- [Projects](#projects)
- [Exercises](#exercises)
  - [Exercises: Level 1](#exercises-level-1)
    - [🇺🇸 / 🇻🇳 Gợi ý thực hành:](#---gợi-ý-thực-hành)
    - [🇻🇳 Giải thích:](#-giải-thích)
    - [Bản option final, tối ưu:](#bản-option-final-tối-ưu)
  - [CatCard.js (Lazy load + Skeleton)](#catcardjs-lazy-load--skeleton)
  - [CatsGrid.js (Fetch breeds only)](#catsgridjs-fetch-breeds-only)
    - [✅ Ưu điểm bản final:](#-ưu-điểm-bản-final)

# Projects

Congratulations for making it to this far. Now, you have a solid understanding of React. I believe we have covered most important features of React and your are ready to work on projects. What we have covered so far is the old version of React. Starting from Day 20, we will learn React Hooks. In the next three days you will work on projects only.

# Exercises

## Exercises: Level 1

Use the following two APIs, [all cats](https://api.thecatapi.com/v1/breeds) and [a single cat][https://api.thecatapi.com/v1/images/search?breed_id=abys]. In the single cat API, you can get url property which is the image of the cat.
Your result should look like this [demo](https://www.30daysofreact.com/day-19/cats).

**Yêu cầu:**

* Sử dụng hai API:

  1. **All cats:** `https://api.thecatapi.com/v1/breeds` → lấy danh sách tất cả giống mèo.
  2. **Single cat:** `https://api.thecatapi.com/v1/images/search?breed_id=abys` → lấy hình ảnh của một giống mèo cụ thể.

* Kết quả cuối cùng nên hiển thị danh sách mèo **có hình ảnh**, giống như demo: [Cats demo](https://www.30daysofreact.com/day-19/cats).

---

### 🇺🇸 / 🇻🇳 Gợi ý thực hành:

1. **Fetch all cats / Lấy danh sách mèo**

```javascript
import React, { Component } from 'react';
import axios from 'axios';

class CatsGrid extends Component {
  state = {
    cats: [],
    loading: true,
    error: null
  };

  componentDidMount() {
    this.fetchCats();
  }

  async fetchCats() {
    try {
      // 1. Lấy danh sách mèo
      const breedsResponse = await axios.get('https://api.thecatapi.com/v1/breeds');
      const breeds = breedsResponse.data;

      // 2. Lấy hình ảnh cho mỗi mèo (limit 1 image per breed)
      const catsWithImages = await Promise.all(
        breeds.map(async breed => {
          try {
            const imageResponse = await axios.get(
              `https://api.thecatapi.com/v1/images/search?breed_id=${breed.id}`
            );
            return {
              id: breed.id,
              name: breed.name,
              weight: breed.weight.metric,
              lifespan: breed.life_span,
              image: imageResponse.data[0]?.url || ''
            };
          } catch (error) {
            return {
              id: breed.id,
              name: breed.name,
              weight: breed.weight.metric,
              lifespan: breed.life_span,
              image: ''
            };
          }
        })
      );

      this.setState({ cats: catsWithImages, loading: false });
    } catch (error) {
      this.setState({ error: 'Cannot fetch cats', loading: false });
    }
  }

  render() {
    const { cats, loading, error } = this.state;

    if (loading) return <p>Loading... / Đang tải...</p>;
    if (error) return <p>{error}</p>;

    return (
      <div>
        <h2>Cat Breeds / Các giống mèo</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {cats.map(cat => (
            <div key={cat.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
              {cat.image ? <img src={cat.image} alt={cat.name} style={{ width: '100%', borderRadius: '8px' }} /> : <p>No image</p>}
              <h3>{cat.name}</h3>
              <p>Weight: {cat.weight} Kg</p>
              <p>Lifespan: {cat.lifespan} years</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default CatsGrid;

```
---

### 🇻🇳 Giải thích:

1. **Fetch breeds:** Lấy danh sách tất cả giống mèo từ API `/v1/breeds`.
2. **Fetch images:** Với mỗi giống, gọi API `/v1/images/search?breed_id=...` để lấy 1 hình ảnh.
3. **Promise.all:** Chờ tất cả request hình ảnh hoàn thành trước khi set state.
4. **Grid layout:** Dùng `display: grid` và `auto-fill` để hiển thị card mèo đẹp, responsive.
5. **Card content:** Hiển thị hình ảnh, tên, cân nặng, tuổi thọ. Nếu không có ảnh, hiển thị “No image”.
---

### Bản option final, tối ưu:

✅ **Tính năng:**

1. **Lazy load hình ảnh** dùng Intersection Observer.
2. **Skeleton loader** hiển thị card tạm thời khi hình ảnh chưa load → UI mượt.
3. **HTTP nhẹ:** chỉ fetch ảnh khi card hiển thị.
4. **Component tách riêng:** `CatCard` nhẹ.
5. **Grid responsive:** đẹp trên mọi màn hình.

---

## CatCard.js (Lazy load + Skeleton)

```javascript
import React, { Component } from 'react';
import axios from 'axios';

class CatCard extends Component {
  state = {
    image: null,
    loadingImage: true
  };

  componentDidMount() {
    this.createObserver();
  }

  createObserver() {
    if (!this.cardRef) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.state.image) {
            this.fetchImage();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(this.cardRef);
  }

  async fetchImage() {
    const { cat } = this.props;
    try {
      const response = await axios.get(
        `https://api.thecatapi.com/v1/images/search?breed_id=${cat.id}`
      );
      this.setState({ image: response.data[0]?.url || '', loadingImage: false });
    } catch {
      this.setState({ image: '', loadingImage: false });
    }
  }

  render() {
    const { cat } = this.props;
    const { image, loadingImage } = this.state;

    return (
      <div
        ref={ref => (this.cardRef = ref)}
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '8px',
          textAlign: 'center',
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start'
        }}
      >
        {loadingImage ? (
          <div style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#eee',
            borderRadius: '8px',
            marginBottom: '8px'
          }}></div>
        ) : (
          <img src={image} alt={cat.name} style={{ width: '100%', borderRadius: '8px', marginBottom: '8px' }} />
        )}
        <h3>{cat.name}</h3>
        <p>Weight: {cat.weight} Kg</p>
        <p>Lifespan: {cat.lifespan} years</p>
      </div>
    );
  }
}

export default CatCard;
```

---

## CatsGrid.js (Fetch breeds only)

```javascript
import React, { Component } from 'react';
import axios from 'axios';
import CatCard from './CatCard';

class CatsGrid extends Component {
  state = {
    cats: [],
    loading: true,
    error: null
  };

  componentDidMount() {
    this.fetchCats();
  }

  async fetchCats() {
    try {
      const response = await axios.get('https://api.thecatapi.com/v1/breeds');
      const cats = response.data.map(breed => ({
        id: breed.id,
        name: breed.name,
        weight: breed.weight.metric,
        lifespan: breed.life_span
      }));
      this.setState({ cats, loading: false });
    } catch (error) {
      this.setState({ error: 'Cannot fetch cats', loading: false });
    }
  }

  render() {
    const { cats, loading, error } = this.state;

    if (error) return <p>{error}</p>;
    if (loading) return <p>Loading cats... / Đang tải danh sách mèo...</p>;

    return (
      <div>
        <h2>Cat Breeds / Các giống mèo</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {cats.map(cat => <CatCard key={cat.id} cat={cat} />)}
        </div>
      </div>
    );
  }
}

export default CatsGrid;
```

---

### ✅ Ưu điểm bản final:

1. **Skeleton loader**: khi hình ảnh chưa load, card vẫn có placeholder → UI mượt, người dùng thấy layout ngay.
2. **Lazy load ảnh**: chỉ fetch khi card vào viewport → HTTP cực nhẹ.
3. **Responsive grid**: tự co theo màn hình.
4. **Component nhẹ, tách riêng**: CatCard chỉ lo render 1 card, CatsGrid lo fetch danh sách.
5. **Không thêm dependency** ngoài axios.

---
🎉 CONGRATULATIONS ! 🎉

[<< Day 18](../18_Fetch_And_Axios/18_fetch_axios.md) | [Day 20>>]()
