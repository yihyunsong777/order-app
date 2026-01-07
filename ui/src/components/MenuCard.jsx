import React, { useState } from 'react';
import './MenuCard.css';

function MenuCard({ menu, onAddToCart }) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionChange = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleAddToCart = () => {
    onAddToCart({
      ...menu,
      selectedOptions: [...selectedOptions],
    });
    // 옵션 초기화
    setSelectedOptions([]);
  };

  const getTotalPrice = () => {
    let total = menu.price;
    selectedOptions.forEach((option) => {
      const opt = menu.options.find((o) => o.name === option);
      if (opt) {
        total += opt.price;
      }
    });
    return total;
  };

  return (
    <div className="menu-card">
      <div className="menu-image">
        {menu.image ? (
          <img src={menu.image} alt={menu.name} />
        ) : (
          <div className="image-placeholder">
            <span>×</span>
          </div>
        )}
      </div>
      <div className="menu-info">
        <h3 className="menu-name">{menu.name}</h3>
        <p className="menu-price">{menu.price.toLocaleString()}원</p>
        <p className="menu-description">{menu.description}</p>
      </div>
      <div className="menu-options">
        {menu.options.map((option) => (
          <label key={option.name} className="option-label">
            <input
              type="checkbox"
              checked={selectedOptions.includes(option.name)}
              onChange={() => handleOptionChange(option.name)}
            />
            <span>
              {option.name} (+{option.price}원)
            </span>
          </label>
        ))}
      </div>
      <button className="add-button" onClick={handleAddToCart}>
        담기
      </button>
    </div>
  );
}

export default MenuCard;

