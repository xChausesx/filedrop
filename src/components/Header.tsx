import React from 'react';
import './Header.css';

interface HeaderProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activePage, onNavigate }) => {
  return (
    <header className="header">
      <h1 className="header-title">Cloud File Manager</h1>
      <nav className="header-nav">
        <a href="#" className={`header-link${activePage === 'files' ? ' active' : ''}`} onClick={e => { e.preventDefault(); onNavigate('files'); }}>Files</a>
        <a href="#" className={`header-link${activePage === 'tags' ? ' active' : ''}`} onClick={e => { e.preventDefault(); onNavigate('tags'); }}>Tags</a>
        <a href="#" className={`header-link${activePage === 'audit' ? ' active' : ''}`} onClick={e => { e.preventDefault(); onNavigate('audit'); }}>Audit</a>
        <a href="#" className={`header-link${activePage === 'users' ? ' active' : ''}`} onClick={e => { e.preventDefault(); onNavigate('users'); }}>Users</a>
      </nav>
    </header>
  );
};

export default Header;
