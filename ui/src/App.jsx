import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import OrderPage from './pages/OrderPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('order');

  return (
    <AppProvider>
      <div className="app">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="main-content">
          {activeTab === 'order' ? <OrderPage /> : <AdminPage />}
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
