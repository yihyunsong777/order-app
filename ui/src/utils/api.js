// API 기본 URL (환경 변수 또는 기본값)
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:3000/api';

// 디버깅: API URL 확인
console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🔗 VITE_API_URL:', import.meta.env.VITE_API_URL);

// API 호출 헬퍼 함수
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('📡 API 호출:', url, options.method || 'GET');
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log('📥 응답 상태:', response.status, response.statusText);

    // 응답이 JSON인지 확인
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ JSON이 아닌 응답:', text);
      throw new Error(`서버 응답 오류: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📦 응답 데이터:', data);

    if (!response.ok) {
      throw new Error(data.error || `API 호출 실패: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('❌ API 호출 오류:', {
      url,
      error: error.message,
      stack: error.stack,
    });
    
    // 네트워크 에러인 경우
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('네트워크 연결 실패. 서버가 실행 중인지 확인하세요.');
    }
    
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

