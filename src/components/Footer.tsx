import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p className="footer-text">&copy; 2026 Cloud File Manager. All rights reserved.</p>
      <nav className="footer-nav">
        <a href="#" className="footer-link">Privacy Policy</a>
        <a href="#" className="footer-link">Terms of Service</a>
      </nav>
    </footer>
  );
};

export default Footer;
