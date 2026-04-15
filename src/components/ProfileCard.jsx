import { useState } from 'react'
import '../styles/ProfileCard.css'

function ProfileCard() {
  const [following, setFollowing] = useState(false)

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-bg"></div>
          <div className="profile-avatar-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" 
              alt="Profile Avatar" 
              className="profile-avatar"
            />
            <div className="profile-status online"></div>
          </div>
        </div>
        
        <div className="profile-body">
          <h2 className="profile-name">Paritet Developer</h2>
          <p className="profile-title">Frontend Developer & Pentester</p>
          
          <div className="profile-stats">
            <div className="stat">
              <div className="stat-value">1.2K</div>
              <div className="stat-label">Подписчики</div>
            </div>
            <div className="stat">
              <div className="stat-value">842</div>
              <div className="stat-label">Подписки</div>
            </div>
            <div className="stat">
              <div className="stat-value">95</div>
              <div className="stat-label">Проектов</div>
            </div>
          </div>

          <p className="profile-bio">
            🚀 Увлекаюсь веб-разработкой и кибербезопасностью. Работаю над проектом SAVI для 
            поиска пропавших людей. Люблю создавать полезные продукты, которые помогают людям.
          </p>

          <div className="profile-tags">
            <span className="tag">React</span>
            <span className="tag">FastAPI</span>
            <span className="tag">Pentesting</span>
            <span className="tag">UI/UX</span>
          </div>

          <div className="profile-actions">
            <button className="btn-profile btn-message">
              <span className="btn-icon">✉️</span>
              Написать
            </button>
            <button 
              className={`btn-profile btn-follow ${following ? 'following' : ''}`}
              onClick={() => setFollowing(!following)}
            >
              <span className="btn-icon">{following ? '✓' : '+'}</span>
              {following ? 'Подписан' : 'Подписаться'}
            </button>
            <button className="btn-profile btn-share">
              <span className="btn-icon">🔗</span>
              Поделиться
            </button>
          </div>
        </div>
      </div>

      <div className="task-info">
        <h3>Задание A1: Профиль пользователя</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>Использованные технологии:</strong>
            <p>Семантические HTML теги, CSS Box Model, Flexbox</p>
          </div>
          <div className="info-item">
            <strong>Реализованные фичи:</strong>
            <p>• Адаптивная карточка профиля<br/>
               • Анимированные кнопки с hover-эффектом<br/>
               • Индикатор онлайн статуса<br/>
               • Интерактивная кнопка подписки</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
