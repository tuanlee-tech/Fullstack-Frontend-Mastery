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

[<< Day 19](../19_projects/19_projects.md) | [Day 21>>]()

![30 Days of React banner](../images/30_days_of_react_banner_day_20.jpg)

- [Projects](#projects)
- [Exercises](#exercises)
  - [Exercises: Level 1](#exercises-level-1)
    - [1️⃣ Bản thường (fetch tất cả ảnh cùng lúc)](#1️⃣-bản-thường-fetch-tất-cả-ảnh-cùng-lúc)
    - [2️⃣ Bản tối ưu (Lazy load ảnh + Skeleton loader)](#2️⃣-bản-tối-ưu-lazy-load-ảnh--skeleton-loader)
      - [CatCard.js](#catcardjs)
      - [CatsGrid.js](#catsgridjs)
    - [✅ Ưu điểm bản Hooks final:](#-ưu-điểm-bản-hooks-final)

# Projects

Congratulations for making it to this far. Now, you have a solid understanding of React. I believe we have covered most important features of React and your are ready to work on projects. What we have covered so far is the old version of React. Starting from Day 20, we will learn React Hooks. In the next three days you will work on projects only.

# Exercises

## Exercises: Level 1

Use the following two APIs, [all cats](https://api.thecatapi.com/v1/breeds) and [a single cat][https://api.thecatapi.com/v1/images/search?breed_id=abys]. In the single cat API, you can get url property which is the image of the cat.
Your result should look like this [demo](https://www.30daysofreact.com/day-20/cats).

Dưới đây là phiên bản **React Hooks** (functional component) cho bài tập Day 20, viết theo cùng format như bản class component trước, gồm **phiên bản thường** và **phiên bản tối ưu lazy load + skeleton**:

**Yêu cầu:**

* Sử dụng hai API:

  1. **All cats:** `https://api.thecatapi.com/v1/breeds` → lấy danh sách tất cả giống mèo.
  2. **Single cat:** `https://api.thecatapi.com/v1/images/search?breed_id=abys` → lấy hình ảnh của một giống mèo cụ thể.

* Kết quả cuối cùng nên hiển thị danh sách mèo **có hình ảnh**, giống như demo.

---

### 1️⃣ Bản thường (fetch tất cả ảnh cùng lúc)

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CatsGrid = () => {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCats = async () => {
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
            } catch {
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

        setCats(catsWithImages);
        setLoading(false);
      } catch (err) {
        setError('Cannot fetch cats');
        setLoading(false);
      }
    };

    fetchCats();
  }, []);

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
};

export default CatsGrid;
```

---

### 2️⃣ Bản tối ưu (Lazy load ảnh + Skeleton loader)

#### CatCard.js

```javascript
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const CatCard = ({ cat }) => {
  const [image, setImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !image) {
            fetchImage();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(cardRef.current);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchImage = async () => {
    try {
      const response = await axios.get(
        `https://api.thecatapi.com/v1/images/search?breed_id=${cat.id}`
      );
      setImage(response.data[0]?.url || '');
      setLoadingImage(false);
    } catch {
      setImage('');
      setLoadingImage(false);
    }
  };

  return (
    <div
      ref={cardRef}
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
        <div
          style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#eee',
            borderRadius: '8px',
            marginBottom: '8px'
          }}
        ></div>
      ) : (
        <img
          src={image}
          alt={cat.name}
          style={{ width: '100%', borderRadius: '8px', marginBottom: '8px' }}
        />
      )}
      <h3>{cat.name}</h3>
      <p>Weight: {cat.weight} Kg</p>
      <p>Lifespan: {cat.lifespan} years</p>
    </div>
  );
};

export default CatCard;
```

#### CatsGrid.js

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CatCard from './CatCard';

const CatsGrid = () => {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await axios.get('https://api.thecatapi.com/v1/breeds');
        const catsData = response.data.map(breed => ({
          id: breed.id,
          name: breed.name,
          weight: breed.weight.metric,
          lifespan: breed.life_span
        }));
        setCats(catsData);
        setLoading(false);
      } catch {
        setError('Cannot fetch cats');
        setLoading(false);
      }
    };

    fetchCats();
  }, []);

  if (loading) return <p>Loading cats... / Đang tải danh sách mèo...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Cat Breeds / Các giống mèo</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {cats.map(cat => <CatCard key={cat.id} cat={cat} />)}
      </div>
    </div>
  );
};

export default CatsGrid;
```

---

### ✅ Ưu điểm bản Hooks final:

1. **Phiên bản thường:** dễ hiểu, fetch tất cả ảnh trước khi render.
2. **Phiên bản tối ưu:** lazy load ảnh + skeleton → HTTP nhẹ, UI mượt, responsive.
3. **Không cần dependency ngoài axios.**
4. **Component tách riêng:** dễ maintain, mở rộng.
5. **Responsive grid** đẹp trên mọi màn hình.


🎉 CONGRATULATIONS ! 🎉

[<< Day 19](../19_projects/19_projects.md) | [Day 21>>]()
