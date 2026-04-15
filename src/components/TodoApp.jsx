import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import '../styles/TodoApp.css'

function formatCreatedAt(value) {
  if (!value) return ''
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString('ru-RU')
}

function TodoApp() {
  const { isAuthenticated } = useAuth()
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')
  const [loadError, setLoadError] = useState(null)
  const [syncBusy, setSyncBusy] = useState(false)

  const loadServerTodos = useCallback(async () => {
    setLoadError(null)
    try {
      const list = await api('/todos', { auth: true })
      const mapped = (Array.isArray(list) ? list : []).map((t) => ({
        id: t.id,
        text: t.text,
        completed: Boolean(t.completed),
        createdAt: formatCreatedAt(t.createdAt),
      }))
      setTodos(mapped)
    } catch (e) {
      setLoadError(e.message || 'Не удалось загрузить задачи')
      setTodos([])
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      const saved = localStorage.getItem('todos')
      setTodos(saved ? JSON.parse(saved) : [])
      setLoadError(null)
      return
    }
    loadServerTodos()
  }, [isAuthenticated, loadServerTodos])

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('todos', JSON.stringify(todos))
    }
  }, [todos, isAuthenticated])

  const addTodo = async (e) => {
    e.preventDefault()
    if (input.trim() === '') return

    if (isAuthenticated) {
      setSyncBusy(true)
      try {
        const data = await api('/todos', {
          method: 'POST',
          body: { text: input.trim() },
          auth: true,
        })
        const t = data.todo
        setTodos([
          {
            id: t.id,
            text: t.text,
            completed: Boolean(t.completed),
            createdAt: formatCreatedAt(t.createdAt),
          },
          ...todos,
        ])
        setInput('')
      } catch (err) {
        setLoadError(err.message || 'Не удалось добавить задачу')
      } finally {
        setSyncBusy(false)
      }
      return
    }

    const newTodo = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
      createdAt: new Date().toLocaleString('ru-RU'),
    }
    setTodos([newTodo, ...todos])
    setInput('')
  }

  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t.id === id)
    if (!todo) return

    if (isAuthenticated) {
      setSyncBusy(true)
      try {
        await api(`/todos/${id}`, {
          method: 'PATCH',
          body: { completed: !todo.completed },
          auth: true,
        })
        setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
      } catch (err) {
        setLoadError(err.message || 'Не удалось обновить задачу')
      } finally {
        setSyncBusy(false)
      }
      return
    }

    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const deleteTodo = async (id) => {
    if (isAuthenticated) {
      setSyncBusy(true)
      try {
        await api(`/todos/${id}`, { method: 'DELETE', auth: true })
        setTodos(todos.filter((t) => t.id !== id))
      } catch (err) {
        setLoadError(err.message || 'Не удалось удалить задачу')
      } finally {
        setSyncBusy(false)
      }
      return
    }

    setTodos(todos.filter((t) => t.id !== id))
  }

  const clearCompleted = async () => {
    const done = todos.filter((t) => t.completed)
    if (done.length === 0) return

    if (isAuthenticated) {
      setSyncBusy(true)
      try {
        await Promise.all(done.map((t) => api(`/todos/${t.id}`, { method: 'DELETE', auth: true })))
        setTodos(todos.filter((t) => !t.completed))
      } catch (err) {
        setLoadError(err.message || 'Не удалось очистить задачи')
      } finally {
        setSyncBusy(false)
      }
      return
    }

    setTodos(todos.filter((t) => !t.completed))
  }

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed)
      case 'completed':
        return todos.filter((todo) => todo.completed)
      default:
        return todos
    }
  }

  const filteredTodos = getFilteredTodos()
  const activeCount = todos.filter((todo) => !todo.completed).length
  const completedCount = todos.filter((todo) => todo.completed).length

  return (
    <div className="todo-container">
      <div className="todo-card">
        <div className="todo-header">
          <h2 className="todo-title">Список задач</h2>
          <div className="todo-stats-header">
            <span className="stat-badge active">{activeCount} активных</span>
            <span className="stat-badge completed">{completedCount} выполнено</span>
          </div>
        </div>

        {isAuthenticated ? (
          <p className="todo-sync-hint" style={{ padding: '0 20px', marginTop: 0, fontSize: 14, color: '#6b7280' }}>
            Задачи сохраняются на сервере (GET/POST/PATCH/DELETE /api/todos).
          </p>
        ) : (
          <p className="todo-sync-hint" style={{ padding: '0 20px', marginTop: 0, fontSize: 14, color: '#6b7280' }}>
            Вы не вошли — задачи хранятся только в этом браузере (localStorage). Войдите (A4) для синхронизации с API.
          </p>
        )}

        {loadError && (
          <div style={{ margin: '12px 20px', padding: 12, background: '#fef2f2', color: '#b91c1c', borderRadius: 8, fontSize: 14 }}>
            {loadError}
          </div>
        )}

        <form onSubmit={addTodo} className="todo-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Что нужно сделать?"
            className="todo-input"
            disabled={syncBusy}
          />
          <button type="submit" className="btn-add" disabled={syncBusy}>
            <span className="btn-icon">+</span>
            Добавить
          </button>
        </form>

        <div className="todo-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
            type="button"
          >
            Все ({todos.length})
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
            type="button"
          >
            Активные ({activeCount})
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
            type="button"
          >
            Выполненные ({completedCount})
          </button>
        </div>

        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{filter === 'completed' ? '🎉' : '📝'}</div>
            <p className="empty-text">
              {filter === 'completed'
                ? 'Нет выполненных задач'
                : filter === 'active'
                  ? 'Все задачи выполнены!'
                  : 'Список задач пуст. Добавьте первую задачу!'}
            </p>
          </div>
        ) : (
          <div className="todo-list">
            {filteredTodos.map((todo) => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <div className="todo-checkbox">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    id={`todo-${todo.id}`}
                    disabled={syncBusy}
                  />
                  <label htmlFor={`todo-${todo.id}`}></label>
                </div>
                <div className="todo-content" onClick={() => !syncBusy && toggleTodo(todo.id)}>
                  <div className="todo-text">{todo.text}</div>
                  <div className="todo-time">{todo.createdAt}</div>
                </div>
                <button
                  className="btn-delete"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label="Удалить"
                  type="button"
                  disabled={syncBusy}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {completedCount > 0 && (
          <div className="todo-footer">
            <button className="btn-clear" onClick={clearCompleted} type="button" disabled={syncBusy}>
              🗑️ Очистить выполненные
            </button>
          </div>
        )}
      </div>

      <div className="task-info">
        <h3>Задание B2: TODO List</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>Использованные концепции:</strong>
            <p>useState, useEffect, localStorage (гость), fetch + JWT (вход)</p>
          </div>
          <div className="info-item">
            <strong>Реализованные фичи:</strong>
            <p>
              • Добавление/удаление задач
              <br />
              • Отметка выполнения
              <br />
              • Фильтры: Все, Активные, Выполненные
              <br />
              • С сервером: CRUD /api/todos
              <br />• Без входа: сохранение в localStorage
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TodoApp
