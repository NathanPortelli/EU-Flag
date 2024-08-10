import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faQuestionCircle, faFloppyDisk, faArrowsRotate, faUndo, faRedo, faBars, faFlag } from '@fortawesome/free-solid-svg-icons';

const Header = ({ 
  handleShare, 
  handleRefresh, 
  toggleQuizMode, 
  isQuizMode, 
  toggleFlagMode, 
  isFlagMode, 
  undo, 
  redo, 
  canUndo, 
  canRedo 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleQuizModeClick = () => {
    if (isFlagMode) {
      console.log('Turning off Flag Mode');
      toggleFlagMode(); // Turn off flag mode if it's on
    }
    toggleQuizMode();
  };
  
  const handleFlagModeClick = () => {
    if (isQuizMode) {
      console.log('Turning off Quiz Mode');
      toggleQuizMode(); // Turn off quiz mode if it's on
    }
    toggleFlagMode();
  };

  return (
    <header className="App-header">
      <h1>EU Flag Maker</h1>
      <div className="header-buttons">
        <div ref={dropdownRef} className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
          <button className="header-button" onClick={undo} disabled={!canUndo}>
            <FontAwesomeIcon icon={faUndo} className="header-icon" />
          </button>
          <button className="header-button" onClick={redo} disabled={!canRedo}>
            <FontAwesomeIcon icon={faRedo} className="header-icon" />
          </button>
          <button className="header-button" onClick={handleShare}>
            <FontAwesomeIcon icon={faFloppyDisk} className="header-icon" />
          </button>
          <button className="header-button" onClick={handleRefresh}>
            <FontAwesomeIcon icon={faArrowsRotate} className="header-icon" />
          </button>
          <a href="https://github.com/NathanPortelli/EU-Flag" className="header-button" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github"></i>
          </a>
        </div>
        <button onClick={handleQuizModeClick} className="quiz-mode-button">
          <FontAwesomeIcon icon={isQuizMode ? faPencilAlt : faQuestionCircle} className="quiz-header-icon" />
          {isQuizMode ? 'Exit Quiz' : 'Quiz'}
        </button>
        <button onClick={handleFlagModeClick} className="quiz-mode-button">
          <FontAwesomeIcon icon={isFlagMode ? faFlag : faFlag} className="quiz-header-icon" />
          {isFlagMode ? 'Exit List' : 'Flag List'}
        </button>
        <button className="dropdown-toggle" onClick={toggleDropdown} style={{ marginLeft: 'auto' }}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
    </header>
  );
};

export default Header;
