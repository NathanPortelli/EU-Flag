import React, { useState } from 'react';
import './Slider.css';

const Slider = ({ value, onChange, min, max, label, unit }) => {
  const [inputValue, setInputValue] = useState(value);

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
