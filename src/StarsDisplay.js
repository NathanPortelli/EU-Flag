import React from 'react';
import { MdOutlineStar } from 'react-icons/md';
import './StarsDisplay.css';

const StarsDisplay = ({ count, size, radius, circleCount, backColour, starColour }) => {
  const renderStars = (count, size, radius, keyPrefix) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI;
      const x = 50 + radius * Math.cos(angle);
      const y = 50 + radius * Math.sin(angle);
      stars.push(
        <div
          key={`${keyPrefix}-${i}`}
          className="star"
          style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            fontSize: `${size}px`,
            color: starColour,
          }}
        >
          <MdOutlineStar />
        </div>
      );
    }
    return stars;
  };

  const circleConfigurations = [
    { circleIndex: 1, countRatio: { 1: 1, 2: 2/3, 3: 4/9 }, radiusFactor: 2 },
    { circleIndex: 2, countRatio: { 2: 1/3, 3: 3/9 }, radiusFactor: 2.5 },
    { circleIndex: 3, countRatio: { 3: 2/9 }, radiusFactor: 4 },
  ];

  const circles = circleConfigurations.slice(0, circleCount).map(config => {
    const newCount = Math.round((config.countRatio[circleCount] || 1) * count);
    const currentRadius = radius / config.radiusFactor;

    return (
      <div
        key={`circle-${config.circleIndex}`}
        className="circle"
        style={{
          position: 'absolute',
          width: `${currentRadius * 2}%`,
          height: `${currentRadius * 2}%`,
          top: `calc(50% - ${currentRadius}%)`,
          left: `calc(50% - ${currentRadius}%)`
        }}
      >
        {renderStars(newCount, size, currentRadius, `circle-${config.circleIndex}`)}
      </div>
    );
  });

  return (
    <div id="stars-container" className="stars-container" style={{ backgroundColor: backColour }}>
      {circles}
    </div>
  );
};

export default StarsDisplay;
