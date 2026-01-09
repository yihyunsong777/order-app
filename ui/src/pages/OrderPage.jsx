import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import MenuCard from '../components/MenuCard';
import Cart from '../components/Cart';
import './OrderPage.css';

function OrderPage() {
  const { menus, menusLoading, checkInventory, addOrder } = useAppContext();
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (menuWithOptions) => {
    // 재고 확인
    const availableStock = checkInventory(menuWithOptions.name);
    const currentCartQuantity = cartItems
      .filter((item) => item.name === menuWithOptions.name)
      .reduce((sum, item) => sum + item.quantity, 0);

    if (availableStock <= currentCartQuantity) {
      alert(`${menuWithOptions.name}의 재고가 부족합니다. (남은 재고: ${availableStock}개)`);
      return;
    }

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

  const handleOrder = async () => {
    if (cartItems.length === 0) return;

    const result = await addOrder(cartItems);
    
    if (result.success) {
      alert(`${result.message}\n주문번호: ${result.orderId}`);
      setCartItems([]);
    } else {
      alert(result.message);
    }
  };

  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(index);
      return;
    }

    // 재고 확인
    const item = cartItems[index];
    const availableStock = checkInventory(item.name);
    const otherCartQuantity = cartItems
      .filter((_, i) => i !== index && cartItems[i].name === item.name)
      .reduce((sum, item) => sum + item.quantity, 0);

    if (newQuantity + otherCartQuantity > availableStock) {
      alert(`${item.name}의 재고가 부족합니다. (남은 재고: ${availableStock}개)`);
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

  // API에서 가져온 메뉴 데이터를 MenuCard 형식으로 변환
  const formatMenuForCard = (menu) => {
    return {
      id: menu.id,
      name: menu.name,
      price: menu.price,
      description: menu.description,
      image: menu.image_url,
      options: menu.options || [],
    };
  };

  if (menusLoading) {
    return (
      <div className="order-page">
        <div className="menu-section-header">
          <h2 className="menu-section-title">메뉴</h2>
          <p className="menu-section-subtitle">이현다방의 특별한 커피를 만나보세요</p>
        </div>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p>메뉴를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <div className="menu-section-header">
        <h2 className="menu-section-title">메뉴</h2>
        <p className="menu-section-subtitle">이현다방의 특별한 커피를 만나보세요</p>
      </div>
      <div className="menu-grid">
        {menus.map((menu) => {
          const menuCard = formatMenuForCard(menu);
          return (
            <MenuCard
              key={menu.id}
              menu={menuCard}
              onAddToCart={handleAddToCart}
              availableStock={checkInventory(menu.name)}
            />
          );
        })}
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

