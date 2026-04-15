import { useState } from 'react'
import '../styles/Navigation.css'

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeItem, setActiveItem] = useState('home')

  const menuItems = [
    { id: 'home', name: 'Главная', icon: '🏠' },
    { id: 'about', name: 'О нас', icon: 'ℹ️' },
    { id: 'services', name: 'Услуги', icon: '⚙️' },
    { id: 'portfolio', name: 'Портфолио', icon: '💼' },
    { id: 'contacts', name: 'Контакты', icon: '📞' },
  ]

  const handleItemClick = (id) => {
    setActiveItem(id)
    setMenuOpen(false)
  }

  return (
    <div className="navigation-demo">
      <header className="demo-header">
        <div className="demo-container">
          <div className="demo-logo">
            <span className="demo-logo-text">Axoft</span>
          </div>

          <button 
            className={`hamburger ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`demo-nav ${menuOpen ? 'open' : ''}`}>
            <ul className="nav-list">
              {menuItems.map(item => (
                <li key={item.id} className="nav-item">
                  <a 
                    href={`#${item.id}`}
                    className={`nav-link ${activeItem === item.id ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      handleItemClick(item.id)
                    }}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-text">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <div className="demo-content">
        <div className="content-section">
          <h1>Адаптивная навигация с Flexbox</h1>
          <p>
            Навигационная панель автоматически адаптируется под разные размеры экрана.
            На мобильных устройствах (< 768px) меню скрывается, появляется кнопка-гамбургер.
          </p>

          <div className="demo-features">
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Мобильная адаптация</h3>
              <p>Меню превращается в выдвижную панель на маленьких экранах</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Плавные анимации</h3>
              <p>CSS transitions для открытия/закрытия меню</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Активный пункт</h3>
              <p>Текущий раздел подсвечивается градиентом</p>
            </div>
          </div>
        </div>
      </div>

      <div className="task-info">
        <h3>Задание A2: Адаптивная навигация</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>Использованные технологии:</strong>
            <p>Flexbox, Media Queries, CSS Transitions</p>
          </div>
          <div className="info-item">
            <strong>Реализованные фичи:</strong>
            <p>• Адаптивное меню с гамбургером<br/>
               • Плавная анимация открытия/закрытия<br/>
               • Подсветка активного пункта<br/>
               • Иконки для каждого пункта меню</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navigation
