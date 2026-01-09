import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // 재고 관리
  const [inventory, setInventory] = useState([
    { id: 1, name: '아메리카노(ICE)', quantity: 10 },
    { id: 2, name: '아메리카노(HOT)', quantity: 10 },
    { id: 3, name: '카페라떼', quantity: 10 },
    { id: 4, name: '카푸치노', quantity: 10 },
    { id: 5, name: '바닐라라떼', quantity: 10 },
    { id: 6, name: '카라멜 마키아또', quantity: 10 },
  ]);

  // 주문 관리
  const [orders, setOrders] = useState([]);
  const [nextOrderId, setNextOrderId] = useState(1);

  // 재고 업데이트
  const updateInventory = (menuName, change) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.name === menuName) {
          const newQuantity = item.quantity + change;
          return { ...item, quantity: Math.max(0, newQuantity) };
        }
        return item;
      })
    );
  };

  // 재고 직접 설정 (관리자용)
  const setInventoryQuantity = (id, newQuantity) => {
    if (newQuantity < 0) return;
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // 재고 확인
  const checkInventory = (menuName) => {
    const item = inventory.find((i) => i.name === menuName);
    return item ? item.quantity : 0;
  };

  // 주문 추가
  const addOrder = (orderItems) => {
    // 재고 체크
    for (const item of orderItems) {
      const availableStock = checkInventory(item.name);
      if (availableStock < item.quantity) {
        return {
          success: false,
          message: `${item.name}의 재고가 부족합니다. (남은 재고: ${availableStock}개)`,
        };
      }
    }

    // 재고 차감
    orderItems.forEach((item) => {
      updateInventory(item.name, -item.quantity);
    });

    // 주문 추가
    const newOrder = {
      id: nextOrderId,
      timestamp: new Date(),
      items: orderItems,
      totalPrice: orderItems.reduce((total, item) => {
        let itemPrice = item.price;
        if (item.selectedOptions && item.selectedOptions.length > 0) {
          item.selectedOptions.forEach((optionName) => {
            const option = item.options.find((o) => o.name === optionName);
            if (option) {
              itemPrice += option.price;
            }
          });
        }
        return total + itemPrice * item.quantity;
      }, 0),
      status: 'pending', // pending, preparing, completed
    };

    setOrders((prev) => [newOrder, ...prev]);
    setNextOrderId((prev) => prev + 1);

    return {
      success: true,
      orderId: newOrder.id,
      message: '주문이 완료되었습니다!',
    };
  };

  // 주문 상태 업데이트
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // 통계 계산
  const getStats = () => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === 'pending').length;
    const preparing = orders.filter((o) => o.status === 'preparing').length;
    const completed = orders.filter((o) => o.status === 'completed').length;

    return {
      total,
      pending,
      preparing,
      completed,
    };
  };

  const value = {
    inventory,
    orders,
    updateInventory,
    setInventoryQuantity,
    checkInventory,
    addOrder,
    updateOrderStatus,
    getStats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;


