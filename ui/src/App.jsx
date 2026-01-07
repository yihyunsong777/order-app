import { useState } from 'react';
import Header from './components/Header';
import OrderPage from './pages/OrderPage';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('order');

  return (
    <div className="app">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">
        {activeTab === 'order' ? (
          <OrderPage />
        ) : (
          <div className="admin-placeholder">
            <h2>관리자 화면</h2>
            <p>관리자 화면은 추후 개발 예정입니다.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
