import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <h1 className="header-title">Cloud File Manager</h1>
      <nav className="header-nav">
        <a href="#" className="header-link">Home</a>
        <a href="#" className="header-link">About</a>
        <a href="#" className="header-link">Contact</a>
      </nav>
    </header>
  );
};

export default Header;
