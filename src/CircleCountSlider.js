// CircleCountSlider.js
import React from 'react';
import './Slider.css';

const CircleCountSlider = ({ value, onChange }) => {
  return (
    <div class="slider-content">
      <div className="slider-container">
        <input
          type="range"
          min="1"
          max="3"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="slider"
        />
      </div>
      <div>
          <span className="slider-value">{value} circles</span>
      </div>
    </div>
  );
};


export default CircleCountSlider;
