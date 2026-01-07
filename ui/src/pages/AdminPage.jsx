import React, { useState } from 'react';
import AdminDashboard from '../components/AdminDashboard';
import InventorySection from '../components/InventorySection';
import OrderManagement from '../components/OrderManagement';
import './AdminPage.css';

function AdminPage() {
  // 재고 관리 상태
  const [inventory, setInventory] = useState([
    { id: 1, name: '아메리카노 (ICE)', quantity: 10 },
    { id: 2, name: '아메리카노 (HOT)', quantity: 3 },
    { id: 3, name: '카페라떼', quantity: 0 },
  ]);

  // 주문 관리 상태 (테스트용 더미 데이터)
  const [orders, setOrders] = useState([
    {
      id: 1,
      timestamp: new Date('2025-01-07T13:00:00'),
      items: [
        {
          name: '아메리카노(ICE)',
          selectedOptions: ['샷 추가'],
          quantity: 1,
        },
      ],
      totalPrice: 4500,
      status: 'pending', // pending, preparing, completed
    },
  ]);

  // 대시보드 통계 계산
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

  // 재고 업데이트
  const handleUpdateInventory = (id, newQuantity) => {
    if (newQuantity < 0) return;

    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // 주문 상태 업데이트
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="admin-page">
      <AdminDashboard stats={getStats()} />
      <InventorySection
        inventory={inventory}
        onUpdateInventory={handleUpdateInventory}
      />
      <OrderManagement
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />
    </div>
  );
}

export default AdminPage;

