import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'
import { products } from '../data/products'
import '../styles/Shop.css'

function Shop() {
  const { isAuthenticated } = useAuth()
  const { items, addItem, removeItem, updateQuantity, getTotal, getItemCount, clearCart, isCartOpen, toggleCart } = useCart()
  const [showModal, setShowModal] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [orderSubmitting, setOrderSubmitting] = useState(false)

  const handleCheckout = () => {
    setOrderError('')
    setShowModal(true)
  }

  const handleConfirmOrder = async () => {
    if (!isAuthenticated) {
      setOrderError('Войдите в систему (раздел A4), чтобы отправить заказ на сервер.')
      return
    }

    setOrderSubmitting(true)
    setOrderError('')
    try {
      await api('/orders', {
        method: 'POST',
        auth: true,
        body: {
          items: items.map((i) => ({
            productId: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          currency: 'KGS',
        },
      })
      setOrderPlaced(true)
      setTimeout(() => {
        clearCart()
        setShowModal(false)
        setOrderPlaced(false)
      }, 3000)
    } catch (e) {
      setOrderError(e.message || 'Не удалось оформить заказ')
    } finally {
      setOrderSubmitting(false)
    }
  }

  return (
    <div className="shop-container">
      <div className="shop-header">
        <div>
          <h1>Интернет-магазин</h1>
          <p>Премиальная техника Apple</p>
        </div>
        <button className="cart-toggle" onClick={toggleCart}>
          🛒
          {getItemCount() > 0 && (
            <span className="cart-badge">{getItemCount()}</span>
          )}
        </button>
      </div>

      <div className="shop-layout">
        <div className="products-section">
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="shop-product-card">
                <div className="shop-product-image">
                  <img src={product.image} alt={product.name} />
                  <span className="product-badge">{product.category}</span>
                </div>
                <div className="shop-product-info">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-footer">
                    <div className="product-price">{product.price.toLocaleString('ru-RU')} сом</div>
                    <button className="btn-add-cart" onClick={() => addItem(product)}>
                      <span>+</span> В корзину
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
          <div className="cart-header">
            <h3>Корзина</h3>
            <button className="cart-close" onClick={toggleCart}>×</button>
          </div>

          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="empty-cart-icon">🛒</div>
              <p>Корзина пуста</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <div className="cart-item-price">{item.price.toLocaleString('ru-RU')} сом</div>
                    </div>
                    <div className="cart-item-controls">
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <button className="btn-remove" onClick={() => removeItem(item.id)}>
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Товаров:</span>
                  <span>{getItemCount()} шт</span>
                </div>
                <div className="summary-row total">
                  <span>Итого:</span>
                  <span>{getTotal().toLocaleString('ru-RU')} сом</span>
                </div>
                <button className="btn-checkout" onClick={handleCheckout}>
                  Оформить заказ
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            {orderPlaced ? (
              <div className="order-success">
                <div className="success-check">✓</div>
                <h2>Заказ оформлен!</h2>
                <p>Спасибо за покупку</p>
              </div>
            ) : (
              <>
                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                <h2>Подтверждение заказа</h2>
                {orderError && (
                  <p style={{ color: '#b91c1c', fontSize: 14, marginBottom: 12 }}>{orderError}</p>
                )}
                <div className="order-details">
                  <h3>Ваш заказ:</h3>
                  <div className="order-items">
                    {items.map(item => (
                      <div key={item.id} className="order-item">
                        <span className="order-item-name">{item.name}</span>
                        <span className="order-item-qty">× {item.quantity}</span>
                        <span className="order-item-price">
                          {(item.price * item.quantity).toLocaleString('ru-RU')} сом
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="order-total">
                    <span>Общая сумма:</span>
                    <span>{getTotal().toLocaleString('ru-RU')} сом</span>
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="btn-cancel" onClick={() => setShowModal(false)}>
                    Отмена
                  </button>
                  <button className="btn-confirm" onClick={handleConfirmOrder} disabled={orderSubmitting}>
                    {orderSubmitting ? 'Отправка…' : 'Подтвердить заказ'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="task-info">
        <h3>Задание B5: Интернет-магазин с корзиной</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>Использованные концепции:</strong>
            <p>React Context API, useContext, сложное управление состоянием</p>
          </div>
          <div className="info-item">
            <strong>Реализованные фичи:</strong>
            <p>• Каталог товаров с добавлением в корзину<br/>
               • Context API для глобального состояния корзины<br/>
               • Оформление: POST /api/orders (нужен вход)<br/>
               • Боковая панель корзины<br/>
               • Модальное окно оформления заказа<br/>
               • Badge с количеством товаров<br/>
               • Подсчёт итоговой суммы</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shop
