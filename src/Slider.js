import React from 'react';
import './Slider.css';

const Slider = ({ value, onChange }) => {
  return (
    <div class="slider-content">
        <div className="slider-container">
          <input
              type="range"
              min="12"
              max="50"
              value={value}
              onChange={(e) => onChange(parseInt(e.target.value, 10))}
              className="slider"
          />
        </div>
        <div>
            <span className="slider-value"><b>{value}</b> stars</span>
        </div>
    </div>
  );
};

export default Slider;
