import { useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import '../styles/LoginForm.css'

function LoginForm() {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email обязателен'
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Email должен содержать @'
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть минимум 6 символов'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setApiError('')
    setLoading(true)

    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: { email: formData.email.trim(), password: formData.password },
      })
      login(data.token, data.user)
      setSuccess(true)
      setFormData({ email: '', password: '' })
      setTimeout(() => setSuccess(false), 2500)
    } catch (err) {
      setApiError(err.message || 'Не удалось войти')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Убираем ошибку при вводе
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Вход в систему</h2>
          <p>Введите свои данные для продолжения</p>
        </div>

        {success && (
          <div className="success-message">
            <span className="success-icon">✓</span>
            Вход выполнен успешно!
          </div>
        )}

        {apiError && (
          <div className="success-message" style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}>
            <span className="success-icon">!</span>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className={`form-group ${formData.email ? 'has-value' : ''} ${errors.email ? 'has-error' : ''}`}>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              autoComplete="off"
            />
            <label htmlFor="email" className="form-label">
              Email
            </label>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className={`form-group ${formData.password ? 'has-value' : ''} ${errors.password ? 'has-error' : ''}`}>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              autoComplete="off"
            />
            <label htmlFor="password" className="form-label">
              Пароль
            </label>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Запомнить меня</span>
            </label>
            <a href="#forgot" className="forgot-link">Забыли пароль?</a>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Вход...
              </>
            ) : (
              'Войти'
            )}
          </button>

          <div className="divider">
            <span>или</span>
          </div>

          <div className="social-login">
            <button type="button" className="btn-social google">
              <span className="social-icon">G</span>
              Google
            </button>
            <button type="button" className="btn-social github">
              <span className="social-icon">⌘</span>
              GitHub
            </button>
          </div>

          <p className="signup-text">
            Нет аккаунта? <a href="#signup">Зарегистрироваться</a>
          </p>
        </form>
      </div>

      <div className="task-info">
        <h3>Задание A4: Анимированная форма входа</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>Использованные технологии:</strong>
            <p>CSS Animations (@keyframes), Floating Labels, Form Validation</p>
          </div>
          <div className="info-item">
            <strong>Реализованные фичи:</strong>
            <p>• Floating label эффект при фокусе<br/>
               • Валидация email и пароля<br/>
               • POST /api/auth/login, JWT в localStorage<br/>
               • Анимированный градиентный фон<br/>
               • Адаптивный дизайн</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
