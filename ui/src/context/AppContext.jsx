import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { menuAPI, orderAPI } from '../utils/api';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // 메뉴 데이터
  const [menus, setMenus] = useState([]);
  const [menusLoading, setMenusLoading] = useState(true);

  // 재고 관리 (메뉴 데이터에서 추출)
  const [inventory, setInventory] = useState([]);

  // 주문 관리
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // 메뉴 데이터 로드
  useEffect(() => {
    const loadMenus = async () => {
      try {
        setMenusLoading(true);
        const response = await menuAPI.getAllMenus();
        if (response.success) {
          setMenus(response.data);
          // 재고 데이터 추출
          const inv = response.data.map((menu) => ({
            id: menu.id,
            name: menu.name,
            quantity: menu.inventory,
          }));
          setInventory(inv);
        }
      } catch (error) {
        console.error('메뉴 로드 실패:', error);
        alert('메뉴를 불러오는데 실패했습니다.');
      } finally {
        setMenusLoading(false);
      }
    };

    loadMenus();
  }, []);

  // 주문 데이터 로드 - useCallback으로 메모이제이션
  const loadOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      const response = await orderAPI.getAllOrders();
      if (response.success) {
        // API 응답을 프론트엔드 형식으로 변환
        const formattedOrders = response.data.map((order) => ({
          id: order.id,
          timestamp: new Date(order.order_datetime),
          items: order.items.map((item) => {
            // options가 배열인 경우 (문자열 배열 또는 객체 배열)
            let selectedOptions = [];
            if (Array.isArray(item.options)) {
              selectedOptions = item.options.map((opt) => 
                typeof opt === 'string' ? opt : opt.option_name || opt.name
              );
            }
            
            return {
              name: item.menu_name,
              quantity: item.quantity,
              selectedOptions: selectedOptions,
              price: item.unit_price / item.quantity,
              options: [],
            };
          }),
          totalPrice: order.total_price,
          status: order.status,
        }));
        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error('주문 로드 실패:', error);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  // 초기 주문 로드
  useEffect(() => {
    loadOrders();
    // 주기적으로 주문 새로고침 (30초마다)
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  // 재고 직접 설정 (관리자용) - API 호출
  const setInventoryQuantity = async (id, newQuantity) => {
    if (newQuantity < 0) return;

    try {
      const response = await menuAPI.updateInventory(id, newQuantity);
      if (response.success) {
        // 로컬 상태 업데이트
        setInventory((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        );
        // 메뉴 데이터도 업데이트
        setMenus((prev) =>
          prev.map((menu) =>
            menu.id === id ? { ...menu, inventory: newQuantity } : menu
          )
        );
      }
    } catch (error) {
      console.error('재고 업데이트 실패:', error);
      alert('재고 업데이트에 실패했습니다.');
    }
  };

  // 재고 확인
  const checkInventory = (menuName) => {
    const item = inventory.find((i) => i.name === menuName);
    return item ? item.quantity : 0;
  };

  // 주문 추가 - API 호출
  const addOrder = async (orderItems) => {
    try {
      // API 형식으로 변환
      const apiItems = orderItems.map((item) => {
        // 메뉴 ID 찾기
        const menu = menus.find((m) => m.name === item.name);
        if (!menu) {
          throw new Error(`메뉴를 찾을 수 없습니다: ${item.name}`);
        }

        // 옵션 ID 찾기
        const optionIds = [];
        if (item.selectedOptions && item.selectedOptions.length > 0) {
          item.selectedOptions.forEach((optionName) => {
            const option = menu.options.find((o) => o.name === optionName);
            if (option) {
              optionIds.push(option.id);
            }
          });
        }

        return {
          menu_id: menu.id,
          quantity: item.quantity,
          options: optionIds,
        };
      });

      const response = await orderAPI.createOrder(apiItems);

      if (response.success) {
        // 주문 목록 새로고침
        await loadOrders();
        // 메뉴 데이터 새로고침 (재고 업데이트 반영)
        const menuResponse = await menuAPI.getAllMenus();
        if (menuResponse.success) {
          setMenus(menuResponse.data);
          const inv = menuResponse.data.map((menu) => ({
            id: menu.id,
            name: menu.name,
            quantity: menu.inventory,
          }));
          setInventory(inv);
        }

        return {
          success: true,
          orderId: response.data.order_id,
          message: response.message,
        };
      } else {
        return {
          success: false,
          message: response.error || '주문 생성에 실패했습니다.',
        };
      }
    } catch (error) {
      console.error('주문 생성 실패:', error);
      return {
        success: false,
        message: error.message || '주문 생성에 실패했습니다.',
      };
    }
  };

  // 주문 상태 업데이트 - API 호출
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await orderAPI.updateOrderStatus(orderId, newStatus);
      if (response.success) {
        // 주문 목록 새로고침
        await loadOrders();
      } else {
        alert(response.error || '주문 상태 업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('주문 상태 업데이트 실패:', error);
      alert('주문 상태 업데이트에 실패했습니다.');
    }
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
    menus,
    menusLoading,
    inventory,
    orders,
    ordersLoading,
    setInventoryQuantity,
    checkInventory,
    addOrder,
    updateOrderStatus,
    getStats,
    loadOrders, // 수동 새로고침용
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;


