import React from 'react';
import './Slider.css';

const StarSizeSlider = ({ value, onChange }) => {
  return (
    <div class="slider-content">
        <div className="slider-container">
            <input
                type="range"
                min="15"
                max="65"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
                className="slider"
            />
        </div>
        <div>
            <span className="slider-value"><b>{value}</b> px</span>
        </div>
    </div>
  );
};

export default StarSizeSlider;