import { useState } from 'react'
import './styles/App.css'

// HTML/CSS задания
import ProfileCard from './components/ProfileCard'
import Navigation from './components/Navigation'
import ProductCatalog from './components/ProductCatalog'
import LoginForm from './components/LoginForm'

// React задания
import Counter from './components/Counter'
import TodoApp from './components/TodoApp'
import UserList from './components/UserList'
import RegistrationForm from './components/RegistrationForm'
import Shop from './components/Shop'

// Context
import { CartProvider } from './context/CartContext'
import { AuthProvider, useAuth } from './context/AuthContext'

function AppHeader({ activeSection, setActiveSection, sections }) {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo" onClick={() => setActiveSection('home')}>
          <span className="logo-text">AXOFT</span>
          <span className="logo-subtitle">Solutions</span>
        </div>
        <nav className="header-nav">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`nav-btn ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.name}
            </button>
          ))}
        </nav>
        {isAuthenticated && user && (
          <div className="header-user">
            <span className="header-user-email" title={user.email}>
              {user.email}
            </span>
            <button type="button" className="nav-btn header-logout" onClick={logout}>
              Выйти
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

function AppShell() {
  const [activeSection, setActiveSection] = useState('home')

  const sections = [
    { id: 'home', name: '🏠 Главная', component: null },
    { id: 'profile', name: 'A1: Профиль', component: <ProfileCard /> },
    { id: 'nav', name: 'A2: Навигация', component: <Navigation /> },
    { id: 'catalog', name: 'A3: Каталог', component: <ProductCatalog /> },
    { id: 'login', name: 'A4: Вход', component: <LoginForm /> },
    { id: 'counter', name: 'B1: Счётчик', component: <Counter /> },
    { id: 'todo', name: 'B2: TODO', component: <TodoApp /> },
    { id: 'users', name: 'B3: API', component: <UserList /> },
    { id: 'form', name: 'B4: Форма', component: <RegistrationForm /> },
    { id: 'shop', name: 'B5: Магазин', component: <Shop /> },
  ]

  const renderHome = () => (
    <div className="home-section">
      <div className="hero">
        <h1 className="hero-title">
          <span className="gradient-text">AXOFT</span> IT Solutions
        </h1>
        <p className="hero-subtitle">Практические задания Frontend-разработка</p>
        <div className="hero-stats">
          <div className="stat-card">
            <div className="stat-number">9</div>
            <div className="stat-label">Заданий</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">135</div>
            <div className="stat-label">Макс. баллов</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">100%</div>
            <div className="stat-label">Готовность</div>
          </div>
        </div>
      </div>

      <div className="tasks-grid">
        <div className="task-group">
          <h2 className="group-title">📝 HTML/CSS Задания</h2>
          <div className="task-cards">
            <div className="task-card" onClick={() => setActiveSection('profile')}>
              <div className="task-icon">👤</div>
              <h3>A1: Профиль пользователя</h3>
              <p>Карточка профиля с аватаром и кнопками</p>
              <span className="task-level level-1">Уровень 1</span>
            </div>
            <div className="task-card" onClick={() => setActiveSection('nav')}>
              <div className="task-icon">🧭</div>
              <h3>A2: Адаптивная навигация</h3>
              <p>Responsive меню с гамбургером</p>
              <span className="task-level level-1">Уровень 1</span>
            </div>
            <div className="task-card" onClick={() => setActiveSection('catalog')}>
              <div className="task-icon">🛍️</div>
              <h3>A3: Каталог товаров</h3>
              <p>CSS Grid сетка с карточками</p>
              <span className="task-level level-2">Уровень 2</span>
            </div>
            <div className="task-card" onClick={() => setActiveSection('login')}>
              <div className="task-icon">🔐</div>
              <h3>A4: Форма входа</h3>
              <p>Анимированная форма с валидацией</p>
              <span className="task-level level-2">Уровень 2</span>
            </div>
          </div>
        </div>

        <div className="task-group">
          <h2 className="group-title">⚛️ React Задания</h2>
          <div className="task-cards">
            <div className="task-card" onClick={() => setActiveSection('counter')}>
              <div className="task-icon">🔢</div>
              <h3>B1: Счётчик с историей</h3>
              <p>useState и работа с массивами</p>
              <span className="task-level level-1">Уровень 1</span>
            </div>
            <div className="task-card" onClick={() => setActiveSection('todo')}>
              <div className="task-icon">✅</div>
              <h3>B2: TODO List</h3>
              <p>Список задач с localStorage</p>
              <span className="task-level level-1">Уровень 1</span>
            </div>
            <div className="task-card" onClick={() => setActiveSection('users')}>
              <div className="task-icon">👥</div>
              <h3>B3: Загрузка с API</h3>
              <p>useEffect и работа с fetch</p>
              <span className="task-level level-2">Уровень 2</span>
            </div>
            <div className="task-card" onClick={() => setActiveSection('form')}>
              <div className="task-icon">📋</div>
              <h3>B4: Многошаговая форма</h3>
              <p>Регистрация с валидацией</p>
              <span className="task-level level-2">Уровень 2</span>
            </div>
            <div className="task-card" onClick={() => setActiveSection('shop')}>
              <div className="task-icon">🛒</div>
              <h3>B5: Интернет-магазин</h3>
              <p>Context API и корзина покупок</p>
              <span className="task-level level-3">Уровень 3</span>
            </div>
          </div>
        </div>
      </div>

      <div className="author-card">
        <div className="author-info">
          <div className="author-avatar">P</div>
          <div>
            <h3>Paritet</h3>
            <p>Frontend Developer Intern</p>
          </div>
        </div>
        <div className="author-meta">
          <span>📍 Kyrgyzstan</span>
          <span>🎓 IT College Graduate</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="app">
      <AppHeader activeSection={activeSection} setActiveSection={setActiveSection} sections={sections} />

      <main className="app-main">
        {activeSection === 'home' ? renderHome() : sections.find((s) => s.id === activeSection)?.component}
      </main>

      <footer className="app-footer">
        <p>© 2026 Axoft Solutions — Выполнено Paritet</p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </CartProvider>
  )
}

export default App
