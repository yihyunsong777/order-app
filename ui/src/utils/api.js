// API 기본 URL (환경 변수 또는 기본값)
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:3000/api';

// API 호출 헬퍼 함수
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API 호출 실패');
    }

    return data;
  } catch (error) {
    console.error('API 호출 오류:', error);
    throw error;
  }
};

// 메뉴 관련 API
export const menuAPI = {
  // 전체 메뉴 조회
  getAllMenus: () => apiCall('/menus'),

  // 특정 메뉴 조회
  getMenuById: (id) => apiCall(`/menus/${id}`),

  // 재고 수정
  updateInventory: (id, inventory) =>
    apiCall(`/menus/${id}/inventory`, {
      method: 'PATCH',
      body: JSON.stringify({ inventory }),
    }),
};

// 주문 관련 API
export const orderAPI = {
  // 주문 생성
  createOrder: (items) =>
    apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify({ items }),
    }),

  // 전체 주문 조회
  getAllOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/orders${queryString ? `?${queryString}` : ''}`);
  },

  // 특정 주문 조회
  getOrderById: (id) => apiCall(`/orders/${id}`),

  // 주문 상태 변경
  updateOrderStatus: (id, status) =>
    apiCall(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // 주문 통계 조회
  getOrderStats: () => apiCall('/orders/stats'),
};

export default {
  menuAPI,
  orderAPI,
};

