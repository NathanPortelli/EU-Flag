import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaintRoller } from '@fortawesome/free-solid-svg-icons';

const ColourPicker = ({ id, label, value, onChange, labelColor }) => (
  <div className="Colour-container">
    <label
      htmlFor={id}
      className="colour-label"
      style={{color: labelColor}}
    >
      <FontAwesomeIcon 
        icon={faPaintRoller} 
        className="header-icon" 
        style={{ marginRight: '8px' }} 
      />
      {label}
    </label>
    <input
      type="color"
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default ColourPicker;