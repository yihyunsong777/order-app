import React from 'react';
import { useAppContext } from '../context/AppContext';
import AdminDashboard from '../components/AdminDashboard';
import InventorySection from '../components/InventorySection';
import OrderManagement from '../components/OrderManagement';
import './AdminPage.css';

function AdminPage() {
  const {
    inventory,
    orders,
    setInventoryQuantity,
    updateOrderStatus,
    getStats,
  } = useAppContext();

  return (
    <div className="admin-page">
      <AdminDashboard stats={getStats()} />
      <InventorySection
        inventory={inventory}
        onUpdateInventory={setInventoryQuantity}
      />
      <OrderManagement
        orders={orders}
        onUpdateOrderStatus={updateOrderStatus}
      />
    </div>
  );
}

export default AdminPage;

