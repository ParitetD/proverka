import { useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import '../styles/RegistrationForm.css'

function RegistrationForm() {
  const { login } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')

  const totalSteps = 4

  const validateStep = (currentStep) => {
    const newErrors = {}

    if (currentStep === 1) {
      if (!formData.firstName || formData.firstName.length < 2) {
        newErrors.firstName = 'Минимум 2 символа'
      }
      if (!/^[а-яА-ЯёЁa-zA-Z\s]+$/.test(formData.firstName)) {
        newErrors.firstName = 'Только буквы'
      }
      if (!formData.lastName || formData.lastName.length < 2) {
        newErrors.lastName = 'Минимум 2 символа'
      }
      if (!/^[а-яА-ЯёЁa-zA-Z\s]+$/.test(formData.lastName)) {
        newErrors.lastName = 'Только буквы'
      }
      if (!formData.birthDate) {
        newErrors.birthDate = 'Дата рождения обязательна'
      }
    }

    if (currentStep === 2) {
      if (!formData.email || !formData.email.includes('@') || !formData.email.includes('.')) {
        newErrors.email = 'Некорректный email'
      }
      if (!formData.phone || !/^\+996\s?\d{3}\s?\d{3}\s?\d{3}$/.test(formData.phone)) {
        newErrors.phone = 'Формат: +996 XXX XXX XXX'
      }
      if (!formData.city || formData.city.length < 2) {
        newErrors.city = 'Укажите город'
      }
    }

    if (currentStep === 3) {
      if (!formData.password || formData.password.length < 8) {
        newErrors.password = 'Минимум 8 символов'
      }
      if (!/\d/.test(formData.password)) {
        newErrors.password = 'Должна быть хотя бы одна цифра'
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Подтвердите пароль'
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    setStep(step - 1)
    setErrors({})
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    setApiError('')
    setSubmitting(true)
    try {
      const data = await api('/auth/register', {
        method: 'POST',
        body: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          birthDate: formData.birthDate,
          email: formData.email.trim(),
          phone: formData.phone,
          city: formData.city.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
      })
      login(data.token, data.user)
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setStep(1)
        setFormData({
          firstName: '',
          lastName: '',
          birthDate: '',
          email: '',
          phone: '',
          city: '',
          password: '',
          confirmPassword: '',
        })
      }, 3000)
    } catch (err) {
      const issues = err.data?.issues
      if (Array.isArray(issues) && issues.length > 0) {
        setApiError(issues.map((i) => i.message).filter(Boolean).join(' · ') || err.message)
      } else {
        setApiError(err.message || 'Ошибка регистрации')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="form-container">
        <div className="success-card">
          <div className="success-animation">✓</div>
          <h2>Регистрация завершена!</h2>
          <p>Добро пожаловать, {formData.firstName} {formData.lastName}!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="form-container">
      <div className="registration-card">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
        </div>

        <div className="form-header">
          <h2>Регистрация</h2>
          <p className="step-indicator">Шаг {step} из {totalSteps}</p>
        </div>

        {step === 1 && (
          <div className="form-step">
            <h3 className="step-title">📝 Личные данные</h3>
            <div className="form-fields">
              <div className="field-group">
                <label>Имя *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? 'error' : ''}
                  placeholder="Иван"
                />
                {errors.firstName && <span className="field-error">{errors.firstName}</span>}
              </div>

              <div className="field-group">
                <label>Фамилия *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? 'error' : ''}
                  placeholder="Иванов"
                />
                {errors.lastName && <span className="field-error">{errors.lastName}</span>}
              </div>

              <div className="field-group">
                <label>Дата рождения *</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className={errors.birthDate ? 'error' : ''}
                />
                {errors.birthDate && <span className="field-error">{errors.birthDate}</span>}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <h3 className="step-title">📞 Контактные данные</h3>
            <div className="form-fields">
              <div className="field-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="example@mail.com"
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="field-group">
                <label>Телефон *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="+996 XXX XXX XXX"
                />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </div>

              <div className="field-group">
                <label>Город *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? 'error' : ''}
                  placeholder="Бишкек"
                />
                {errors.city && <span className="field-error">{errors.city}</span>}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step">
            <h3 className="step-title">🔒 Безопасность</h3>
            <div className="form-fields">
              <div className="field-group">
                <label>Пароль *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  placeholder="Минимум 8 символов"
                />
                {errors.password && <span className="field-error">{errors.password}</span>}
                <div className="password-hints">
                  <span className={formData.password.length >= 8 ? 'valid' : ''}>
                    {formData.password.length >= 8 ? '✓' : '○'} Минимум 8 символов
                  </span>
                  <span className={/\d/.test(formData.password) ? 'valid' : ''}>
                    {/\d/.test(formData.password) ? '✓' : '○'} Содержит цифру
                  </span>
                </div>
              </div>

              <div className="field-group">
                <label>Подтверждение пароля *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  placeholder="Повторите пароль"
                />
                {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
              </div>
            </div>
          </div>
        )}

        {apiError && step === 4 && (
          <div className="field-error" style={{ margin: '0 24px 12px', padding: '12px', background: '#fef2f2', borderRadius: 8 }}>
            {apiError}
          </div>
        )}

        {step === 4 && (
          <div className="form-step">
            <h3 className="step-title">✅ Подтверждение</h3>
            <div className="confirmation-data">
              <div className="data-section">
                <h4>Личные данные</h4>
                <p><strong>Имя:</strong> {formData.firstName}</p>
                <p><strong>Фамилия:</strong> {formData.lastName}</p>
                <p><strong>Дата рождения:</strong> {formData.birthDate}</p>
              </div>

              <div className="data-section">
                <h4>Контакты</h4>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Телефон:</strong> {formData.phone}</p>
                <p><strong>Город:</strong> {formData.city}</p>
              </div>

              <div className="data-section">
                <h4>Безопасность</h4>
                <p><strong>Пароль:</strong> {'•'.repeat(formData.password.length)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
          {step > 1 && (
            <button className="btn-back" onClick={handleBack}>
              ← Назад
            </button>
          )}
          {step < totalSteps ? (
            <button className="btn-next" onClick={handleNext}>
              Далее →
            </button>
          ) : (
            <button className="btn-submit" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Отправка…' : 'Завершить регистрацию'}
            </button>
          )}
        </div>
      </div>

      <div className="task-info">
        <h3>Задание B4: Многошаговая форма регистрации</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>Использованные концепции:</strong>
            <p>Управление сложным состоянием, валидация форм, многошаговая навигация</p>
          </div>
          <div className="info-item">
            <strong>Реализованные фичи:</strong>
            <p>• 4 шага регистрации<br/>
               • POST /api/auth/register<br/>
               • Прогресс-бар<br/>
               • Проверка паролей в реальном времени<br/>
               • Экран подтверждения данных</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegistrationForm
