import React from 'react';
import './OrderManagement.css';

function OrderManagement({ orders, onUpdateOrderStatus }) {
  const formatDate = (date) => {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${month}월 ${day}일 ${hours}:${minutes}`;
  };

  const getStatusButton = (order) => {
    switch (order.status) {
      case 'pending':
        return {
          text: '제조 시작',
          nextStatus: 'preparing',
          className: 'status-btn-pending',
        };
      case 'preparing':
        return {
          text: '제조 완료',
          nextStatus: 'completed',
          className: 'status-btn-preparing',
        };
      case 'completed':
        return {
          text: '완료됨',
          nextStatus: null,
          className: 'status-btn-completed',
        };
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return '주문 접수';
      case 'preparing':
        return '제조 중';
      case 'completed':
        return '제조 완료';
      default:
        return status;
    }
  };

  return (
    <div className="order-management">
      <h2 className="section-title">주문 현황</h2>
      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="empty-orders">
            <p>접수된 주문이 없습니다</p>
          </div>
        ) : (
          orders.map((order) => {
            const statusButton = getStatusButton(order);
            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-time">{formatDate(order.timestamp)}</div>
                  <div className={`order-status-label status-${order.status}`}>
                    {getStatusLabel(order.status)}
                  </div>
                </div>
                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <span className="item-description">
                        {item.name}
                        {item.selectedOptions && item.selectedOptions.length > 0 && (
                          <span className="item-options">
                            {' '}
                            ({item.selectedOptions.join(', ')})
                          </span>
                        )}
                        {' '}x {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="order-footer">
                  <div className="order-total">
                    <span className="total-label">총 금액:</span>
                    <span className="total-amount">
                      {order.totalPrice.toLocaleString()}원
                    </span>
                  </div>
                  <button
                    className={`order-status-btn ${statusButton.className}`}
                    onClick={() =>
                      statusButton.nextStatus &&
                      onUpdateOrderStatus(order.id, statusButton.nextStatus)
                    }
                    disabled={!statusButton.nextStatus}
                  >
                    {statusButton.text}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default OrderManagement;


