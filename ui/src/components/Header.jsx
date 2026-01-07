import React from 'react';
import './Header.css';

function Header({ activeTab, onTabChange }) {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">이현다방</h1>
        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'order' ? 'active' : ''}`}
            onClick={() => onTabChange('order')}
          >
            주문하기
          </button>
          <button
            className={`nav-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => onTabChange('admin')}
          >
            관리자
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;

