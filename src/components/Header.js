import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faQuestionCircle, faFloppyDisk, faArrowsRotate, faUndo, faRedo, faBars, faFlag, faShare, faGlobe } from '@fortawesome/free-solid-svg-icons';

const Header = ({ 
  handleShare, 
  handleRefresh, 
  toggleQuizMode, 
  isQuizMode, 
  toggleFlagMode, 
  isFlagMode, 
  togglePublicShareMode,
  isPublicShareMode,
  undo, 
  redo, 
  canUndo, 
  canRedo 
}) => {
  const [isModesDropdownOpen, setIsModesDropdownOpen] = useState(false);
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);
  const modesDropdownRef = useRef(null);
  const actionsDropdownRef = useRef(null);

  const toggleModesDropdown = () => {
    setIsModesDropdownOpen(!isModesDropdownOpen);
  };

  const toggleActionsDropdown = () => {
    setIsActionsDropdownOpen(!isActionsDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (modesDropdownRef.current && !modesDropdownRef.current.contains(event.target)) {
      setIsModesDropdownOpen(false);
    }
    if (actionsDropdownRef.current && !actionsDropdownRef.current.contains(event.target)) {
      setIsActionsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleQuizModeClick = () => {
    if (isPublicShareMode) {
      togglePublicShareMode(); // Turn off quiz mode if it's on
    }
    if (isFlagMode) {
      toggleFlagMode(); // Turn off flag mode if it's on
    }
    toggleQuizMode();
  };
  
  const handleFlagModeClick = () => {
    if (isQuizMode) {
      toggleQuizMode(); // Turn off quiz mode if it's on
    }
    if (isPublicShareMode) {
      togglePublicShareMode(); // Turn off flag mode if it's on
    }
    toggleFlagMode();
  };

  const handlePublicShareModeClick = () => {
    if (isQuizMode) {
      toggleQuizMode(); // Turn off quiz mode if it's on
    }
    if (isFlagMode) {
      toggleFlagMode(); // Turn off flag mode if it's on
    }
    togglePublicShareMode();
  };

  const handleTitleClick = () => {
    // Turn off all modes when the title is clicked
    if (isQuizMode) {
      toggleQuizMode();
    }
    if (isFlagMode) {
      toggleFlagMode();
    }
    if (isPublicShareMode) {
      togglePublicShareMode();
    }
  };

  return (
    <header className="App-header">
      <h1 className="header-title" onClick={handleTitleClick}>EU Flag Maker</h1>
      <div className="header-buttons">
        <div ref={actionsDropdownRef} className={`dropdown-menu actions-dropdown ${isActionsDropdownOpen ? 'show' : ''}`}>
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

        <div ref={modesDropdownRef} className={`dropdown-menu modes-dropdown ${isModesDropdownOpen ? 'show' : ''}`}>
          <button onClick={handleQuizModeClick} className="quiz-mode-button">
            <FontAwesomeIcon icon={isQuizMode ? faPencilAlt : faQuestionCircle} className="dropdown-icon" />
            {isQuizMode ? 'Exit Quiz' : 'Quiz'}
          </button>
          <button onClick={handleFlagModeClick} className="quiz-mode-button">
            <FontAwesomeIcon icon={faFlag} className="dropdown-icon" />
            {isFlagMode ? 'Designer' : 'Flag List'}
          </button>
          <button onClick={handlePublicShareModeClick} className="quiz-mode-button" id="online-mode-btn">
            <FontAwesomeIcon icon={faGlobe} className="dropdown-icon" />
            {isPublicShareMode ? 'Designer' : 'Online'}
          </button>
        </div>

        <button className="dropdown-toggle dropdown-modes" onClick={toggleModesDropdown}>
          Modes
        </button>

        <button className="dropdown-toggle" onClick={toggleActionsDropdown}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
    </header>
  );
};

export default Header;
