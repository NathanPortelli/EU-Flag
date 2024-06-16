import React from 'react';
import './Slider.css';

const StarRotatorSlider = ({ value, onChange }) => {
  return (
    <div class="slider-content">
        <div className="slider-container">
            <input
                type="range"
                min="0"
                max="360"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
                className="slider"
            />
        </div>
        <div>
            <span className="slider-value"><b>{value}</b>°</span>
        </div>
    </div>
  );
};

export default StarRotatorSlider;