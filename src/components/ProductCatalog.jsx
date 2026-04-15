import { useState } from 'react'
import '../styles/ProductCatalog.css'

function ProductCatalog() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'MacBook Pro 16"',
      price: '135 000',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
      category: 'Ноутбуки',
      inCart: false
    },
    {
      id: 2,
      name: 'iPhone 15 Pro Max',
      price: '85 000',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop',
      category: 'Смартфоны',
      inCart: false
    },
    {
      id: 3,
      name: 'AirPods Pro',
      price: '18 500',
      image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=300&fit=crop',
      category: 'Аудио',
      inCart: false
    },
    {
      id: 4,
      name: 'iPad Air',
      price: '45 000',
      image: 'https://images.unsplash.com/photo-1585790050230-5dd28404f3e1?w=400&h=300&fit=crop',
      category: 'Планшеты',
      inCart: false
    },
    {
      id: 5,
      name: 'Apple Watch Series 9',
      price: '32 000',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=300&fit=crop',
      category: 'Смарт-часы',
      inCart: false
    },
    {
      id: 6,
      name: 'Magic Keyboard',
      price: '12 500',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
      category: 'Аксессуары',
      inCart: false
    },
    {
      id: 7,
      name: 'Mac Studio',
      price: '155 000',
      image: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=400&h=300&fit=crop',
      category: 'Компьютеры',
      inCart: false
    },
    {
      id: 8,
      name: 'Studio Display',
      price: '125 000',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
      category: 'Мониторы',
      inCart: false
    }
  ])

  const toggleCart = (id) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, inCart: !p.inCart } : p
    ))
  }

  const cartCount = products.filter(p => p.inCart).length

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <div>
          <h1>Каталог товаров</h1>
          <p>Премиальная техника Apple для профессионалов</p>
        </div>
        <div className="cart-badge">
          🛒 <span className="badge-count">{cartCount}</span>
        </div>
      </div>

      <div className="catalog-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image-wrapper">
              <img src={product.image} alt={product.name} className="product-image" />
              <span className="product-category">{product.category}</span>
            </div>
            <div className="card-body">
              <h3 className="card-title">{product.name}</h3>
              <div className="card-price">{product.price} сом</div>
              <button 
                className={`btn-cart ${product.inCart ? 'added' : ''}`}
                onClick={() => toggleCart(product.id)}
              >
                {product.inCart ? (
                  <>
                    <span className="btn-icon">✓</span>
                    Добавлено
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🛒</span>
                    В корзину
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="task-info">
        <h3>Задание A3: Сетка карточек товаров</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>Использованные технологии:</strong>
            <p>CSS Grid, Responsive Design, Transform Animations</p>
          </div>
          <div className="info-item">
            <strong>Адаптивность:</strong>
            <p>• Большие экраны: 4 колонки<br/>
               • Планшет (&lt; 1024px): 2 колонки<br/>
               • Мобильные (&lt; 600px): 1 колонка<br/>
               • Hover-эффект с увеличением карточки</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCatalog
