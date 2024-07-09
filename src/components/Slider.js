import React, { useState, useEffect } from 'react';
import '../styles/Slider.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Slider = ({ value, onChange, min, max, label, unit, icon }) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      setInputValue(newValue);
      onChange(newValue);
    }
  };

  const handleBlur = () => {
    if (inputValue < min) {
      setInputValue(min);
      onChange(min);
    } else if (inputValue > max) {
      setInputValue(max);
      onChange(max);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div className="slider-content">
      <div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            setInputValue(parseInt(e.target.value, 10));
            onChange(parseInt(e.target.value, 10));
          }}
          className="slider"
        />
      </div>
      <div className="slider-container">
        {icon && <FontAwesomeIcon icon={icon} className="slider-icon" />}
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          className="slider-input"
          min={min}
          max={max}
        />
        <span className="unit-text">{unit}</span>
      </div>
    </div>
  );
};

export default Slider;
