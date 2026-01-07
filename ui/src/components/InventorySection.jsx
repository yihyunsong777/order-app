import React from 'react';
import './InventorySection.css';

function InventorySection({ inventory, onUpdateInventory }) {
  const getStatusInfo = (quantity) => {
    if (quantity === 0) {
      return { label: '품절', className: 'status-out' };
    } else if (quantity < 5) {
      return { label: '주의', className: 'status-warning' };
    } else {
      return { label: '정상', className: 'status-normal' };
    }
  };

  return (
    <div className="inventory-section">
      <h2 className="section-title">재고 현황</h2>
      <div className="inventory-grid">
        {inventory.map((item) => {
          const status = getStatusInfo(item.quantity);
          return (
            <div key={item.id} className="inventory-card">
              <div className="inventory-header">
                <h3 className="inventory-name">{item.name}</h3>
                <span className={`inventory-status ${status.className}`}>
                  {status.label}
                </span>
              </div>
              <div className="inventory-quantity">
                <span className="quantity-text">{item.quantity}개</span>
              </div>
              <div className="inventory-controls">
                <button
                  className="inventory-btn decrease"
                  onClick={() => onUpdateInventory(item.id, item.quantity - 1)}
                  disabled={item.quantity === 0}
                >
                  −
                </button>
                <button
                  className="inventory-btn increase"
                  onClick={() => onUpdateInventory(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default InventorySection;

