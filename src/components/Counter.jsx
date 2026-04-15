import { useState } from 'react'
import '../styles/Counter.css'

function Counter() {
  const [count, setCount] = useState(0)
  const [history, setHistory] = useState([])

  const addToHistory = (action, newValue) => {
    const timestamp = new Date().toLocaleTimeString('ru-RU')
    const entry = { action, value: newValue, timestamp }
    setHistory(prev => [entry, ...prev].slice(0, 5))
  }

  const increment = () => {
    const newValue = count + 1
    setCount(newValue)
    addToHistory('Увеличение', newValue)
  }

  const decrement = () => {
    if (count > 0) {
      const newValue = count - 1
      setCount(newValue)
      addToHistory('Уменьшение', newValue)
    }
  }

  const reset = () => {
    setCount(0)
    addToHistory('Сброс', 0)
  }

  const getCountColor = () => {
    if (count > 0) return '#10b981'
    return '#6b7280'
  }

  return (
    <div className="counter-container">
      <div className="counter-card">
        <h2 className="counter-title">Счётчик с историей</h2>
        
        <div className="counter-display" style={{ color: getCountColor() }}>
          {count}
        </div>

        <div className="counter-controls">
          <button 
            className="counter-btn btn-decrement" 
            onClick={decrement}
            disabled={count === 0}
          >
            <span className="btn-icon">−</span>
          </button>
          <button className="counter-btn btn-reset" onClick={reset}>
            <span className="btn-icon">↻</span>
            Сброс
          </button>
          <button className="counter-btn btn-increment" onClick={increment}>
            <span className="btn-icon">+</span>
          </button>
        </div>

        <div className="counter-stats">
          <div className="stat-item">
            <div className="stat-label">Текущее значение</div>
            <div className="stat-value">{count}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Всего операций</div>
            <div className="stat-value">{history.length}</div>
          </div>
        </div>

        {history.length > 0 && (
          <div className="history-section">
            <h3 className="history-title">
              История изменений
              <span className="history-badge">{history.length}/5</span>
            </h3>
            <div className="history-list">
              {history.map((entry, index) => (
                <div key={index} className="history-item">
                  <div className="history-icon">
                    {entry.action === 'Увеличение' ? '↑' : 
                     entry.action === 'Уменьшение' ? '↓' : '↻'}
                  </div>
                  <div className="history-content">
                    <div className="history-action">{entry.action}</div>
                    <div className="history-time">{entry.timestamp}</div>
                  </div>
                  <div className="history-value">{entry.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="task-info">
        <h3>Задание B1: Счётчик с историей</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>Использованные концепции:</strong>
            <p>useState, иммутабельность state, работа с массивами</p>
          </div>
          <div className="info-item">
            <strong>Реализованные фичи:</strong>
            <p>• Счётчик не уходит ниже 0<br/>
               • История последних 5 операций<br/>
               • Цвет меняется в зависимости от значения<br/>
               • Timestamp для каждой операции</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Counter
