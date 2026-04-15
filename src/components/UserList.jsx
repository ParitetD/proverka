import { useState, useEffect } from 'react'
import { api } from '../api/client'
import '../styles/UserList.css'

function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await api('/users')
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.company.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="users-container">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Загрузка пользователей...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="users-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Ошибка загрузки</h3>
          <p>{error}</p>
          <button className="btn-retry" onClick={fetchUsers}>
            🔄 Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="users-container">
      <div className="users-header">
        <div>
          <h1>Список пользователей</h1>
          <p>Загружено {users.length} пользователей с локального API (backend)</p>
        </div>
        <button className="btn-refresh" onClick={fetchUsers}>
          🔄 Обновить
        </button>
      </div>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по имени, email или компании..."
          className="search-input"
        />
        {search && (
          <button className="btn-clear-search" onClick={() => setSearch('')}>
            ×
          </button>
        )}
      </div>

      {search && (
        <div className="search-results">
          Найдено: {filteredUsers.length} из {users.length}
        </div>
      )}

      <div className="users-grid">
        {filteredUsers.map(user => (
          <div
            key={user.id}
            className="user-card"
            onClick={() => setSelected(user)}
          >
            <div className="user-avatar">
              {user.name.charAt(0)}
            </div>
            <div className="user-info">
              <h3 className="user-name">{user.name}</h3>
              <p className="user-email">{user.email}</p>
              <div className="user-meta">
                <span>📍 {user.address.city}</span>
                <span>🏢 {user.company.name}</span>
              </div>
            </div>
            <div className="user-arrow">→</div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <p>Ничего не найдено</p>
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>
              ×
            </button>
            
            <div className="modal-header">
              <div className="modal-avatar">
                {selected.name.charAt(0)}
              </div>
              <div>
                <h2>{selected.name}</h2>
                <p className="modal-username">@{selected.username}</p>
              </div>
            </div>

            <div className="modal-body">
              <div className="detail-group">
                <label>📧 Email</label>
                <a href={`mailto:${selected.email}`}>{selected.email}</a>
              </div>
              
              <div className="detail-group">
                <label>📞 Телефон</label>
                <p>{selected.phone}</p>
              </div>
              
              <div className="detail-group">
                <label>🌐 Сайт</label>
                <a href={`https://${selected.website}`} target="_blank" rel="noopener noreferrer">
                  {selected.website}
                </a>
              </div>
              
              <div className="detail-group">
                <label>📍 Адрес</label>
                <p>
                  {selected.address.street}, {selected.address.suite}<br/>
                  {selected.address.city}, {selected.address.zipcode}
                </p>
              </div>
              
              <div className="detail-group">
                <label>🏢 Компания</label>
                <p>
                  <strong>{selected.company.name}</strong><br/>
                  {selected.company.catchPhrase}<br/>
                  <em>{selected.company.bs}</em>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="task-info">
        <h3>Задание B3: Загрузка данных с API</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>Использованные концепции:</strong>
            <p>useEffect, fetch API, состояния loading/error, работа с асинхронностью</p>
          </div>
          <div className="info-item">
            <strong>Реализованные фичи:</strong>
            <p>• Загрузка с GET /api/users (Express)<br/>
               • Спиннер загрузки и обработка ошибок<br/>
               • Поиск в реальном времени<br/>
               • Модальное окно с деталями пользователя<br/>
               • Кнопка повторной загрузки</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserList
