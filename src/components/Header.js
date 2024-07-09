import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareFromSquare, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

const Header = ({ handleShare, handleRefresh }) => (
  <header className="App-header">
    <h1>EU Flag Maker</h1>
    <div className="header-buttons">
      <div>
        <button className="header-button" onClick={handleShare}>
          <FontAwesomeIcon icon={faShareFromSquare} className="header-icon" />
        </button>
      </div>
      <div>
        <button className="header-button" onClick={handleRefresh}>
          <FontAwesomeIcon icon={faArrowsRotate} className="header-icon" />
        </button>
      </div>
      <div>
        <a href="https://github.com/NathanPortelli/EU-Flag" className="github-icon" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-github"></i>
        </a>
      </div>
    </div>
  </header>
);

export default Header;