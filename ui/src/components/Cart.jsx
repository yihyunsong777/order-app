import React from 'react';
import './Cart.css';

function Cart({ cartItems, onOrder, onUpdateQuantity, onRemoveItem }) {
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      let itemTotal = item.price * item.quantity;
      if (item.selectedOptions && item.selectedOptions.length > 0) {
        item.selectedOptions.forEach((optionName) => {
          const option = item.options.find((o) => o.name === optionName);
          if (option) {
            itemTotal += option.price * item.quantity;
          }
        });
      }
      return total + itemTotal;
    }, 0);
  };

  const getItemPrice = (item) => {
    let price = item.price;
    if (item.selectedOptions && item.selectedOptions.length > 0) {
      item.selectedOptions.forEach((optionName) => {
        const option = item.options.find((o) => o.name === optionName);
        if (option) {
          price += option.price;
        }
      });
    }
    return price * item.quantity;
  };

  const getItemDescription = (item) => {
    let description = item.name;
    if (item.selectedOptions && item.selectedOptions.length > 0) {
      description += ` (${item.selectedOptions.join(', ')})`;
    }
    return description;
  };

  return (
    <div className="cart">
      <h2 className="cart-title">장바구니</h2>
      <div className="cart-content">
        <div className="cart-items-section">
          {cartItems.length === 0 ? (
            <p className="empty-cart">장바구니가 비어있습니다</p>
          ) : (
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="cart-item-info">
                    <span className="cart-item-name">
                      {getItemDescription(item)}
                    </span>
                    <div className="cart-item-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        className="remove-btn"
                        onClick={() => onRemoveItem(index)}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <span className="cart-item-price">
                    {getItemPrice(item).toLocaleString()}원
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="cart-summary">
          <div className="cart-total">
            <span className="total-label">총 금액</span>
            <span className="total-price">{getTotalPrice().toLocaleString()}원</span>
          </div>
          <button
            className="order-button"
            onClick={onOrder}
            disabled={cartItems.length === 0}
          >
            주문하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;

