import React, { useState } from 'react';
import MenuCard from '../components/MenuCard';
import Cart from '../components/Cart';
import './OrderPage.css';

// 메뉴 데이터
const menuData = [
  {
    id: 1,
    name: '아메리카노(ICE)',
    price: 4000,
    description: '시원하고 깔끔한 아이스 아메리카노',
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500&h=400&fit=crop&q=80',
    options: [
      { name: '샷 추가', price: 500 },
      { name: '시럽 추가', price: 0 },
    ],
  },
  {
    id: 2,
    name: '아메리카노(HOT)',
    price: 4000,
    description: '따뜻하고 진한 아메리카노',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&h=400&fit=crop&q=80',
    options: [
      { name: '샷 추가', price: 500 },
      { name: '시럽 추가', price: 0 },
    ],
  },
  {
    id: 3,
    name: '카페라떼',
    price: 5000,
    description: '부드러운 우유가 가득한 라떼',
    image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=500&h=400&fit=crop&q=80',
    options: [
      { name: '샷 추가', price: 500 },
      { name: '시럽 추가', price: 0 },
    ],
  },
  {
    id: 4,
    name: '카푸치노',
    price: 5000,
    description: '풍부한 거품이 일품인 카푸치노',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&h=400&fit=crop&q=80',
    options: [
      { name: '샷 추가', price: 500 },
      { name: '시럽 추가', price: 0 },
    ],
  },
  {
    id: 5,
    name: '바닐라라떼',
    price: 5500,
    description: '달콤한 바닐라 향이 가득한 라떼',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=400&fit=crop&q=80',
    options: [
      { name: '샷 추가', price: 500 },
      { name: '휘핑 추가', price: 500 },
    ],
  },
  {
    id: 6,
    name: '카라멜 마키아또',
    price: 6000,
    description: '달콤한 카라멜 시럽과 에스프레소의 조화',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500&h=400&fit=crop&q=80',
    options: [
      { name: '샷 추가', price: 500 },
      { name: '휘핑 추가', price: 500 },
    ],
  },
];

function OrderPage() {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (menuWithOptions) => {
    const existingItemIndex = cartItems.findIndex(
      (item) =>
        item.id === menuWithOptions.id &&
        JSON.stringify(item.selectedOptions) ===
          JSON.stringify(menuWithOptions.selectedOptions)
    );

    if (existingItemIndex !== -1) {
      // 이미 같은 메뉴와 옵션이 있으면 수량 증가
      const newCartItems = [...cartItems];
      newCartItems[existingItemIndex].quantity += 1;
      setCartItems(newCartItems);
    } else {
      // 새로운 항목 추가
      setCartItems([...cartItems, { ...menuWithOptions, quantity: 1 }]);
    }
  };

  const handleOrder = () => {
    if (cartItems.length === 0) return;

    alert('주문이 완료되었습니다!');
    setCartItems([]);
  };

  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(index);
      return;
    }

    const newCartItems = [...cartItems];
    newCartItems[index].quantity = newQuantity;
    setCartItems(newCartItems);
  };

  const handleRemoveItem = (index) => {
    const newCartItems = cartItems.filter((_, i) => i !== index);
    setCartItems(newCartItems);
  };

  return (
    <div className="order-page">
      <div className="menu-section-header">
        <h2 className="menu-section-title">메뉴</h2>
        <p className="menu-section-subtitle">이현다방의 특별한 커피를 만나보세요</p>
      </div>
      <div className="menu-grid">
        {menuData.map((menu) => (
          <MenuCard key={menu.id} menu={menu} onAddToCart={handleAddToCart} />
        ))}
      </div>
      <Cart
        cartItems={cartItems}
        onOrder={handleOrder}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}

export default OrderPage;

