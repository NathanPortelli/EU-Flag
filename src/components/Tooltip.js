import React from 'react';
import '../styles/Tooltip.css';

const Tooltip = ({ children, text }) => {
  return (
    <div className="tooltip-container">
      {children}
      <span className="tooltiptext">{text}</span>
    </div>
  );
};

export default Tooltip;