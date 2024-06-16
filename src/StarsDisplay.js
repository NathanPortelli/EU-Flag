import React from 'react';
import './StarsDisplay.css';

const shapeIcons = {
  Star: (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'currentColor',
      clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
    }} />
  ),
  Circle: <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'currentColor' }} />,
  Square: <div style={{ width: '100%', height: '100%', backgroundColor: 'currentColor' }} />,
  Hexagon: (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      background: 'currentColor', 
      clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' 
    }} />
  ),
  Pentagon: (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      background: 'currentColor', 
      clipPath: 'polygon(50% 0%, 100% 38%, 81% 100%, 19% 100%, 0% 38%)' 
    }} />
  ),
  Octagon: (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      background: 'currentColor', 
      clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' 
    }} />
  ),
  Heart: (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      background: 'currentColor', 
      clipPath: 'polygon(50% 15%, 61% 3%, 75% 0, 100% 25%, 100% 60%, 50% 100%, 0 60%, 0 25%, 25% 0, 39% 3%)' 
    }} />
  ),
  Diamond: (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      background: 'currentColor', 
      clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' 
    }} />
  ),
  Crescent: (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      background: 'currentColor', 
      clipPath: 'polygon(50% 0%, 100% 25%, 75% 75%, 50% 100%, 25% 75%, 0% 25%)' 
    }} />
  ),
};

const StarsDisplay = ({ count, size, radius, circleCount, backColour, starColour, rotationAngle, shape }) => {
  const renderShapes = (count, size, radius, keyPrefix) => {
    const shapes = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI - Math.PI / 2 + (rotationAngle * Math.PI / 180);
      const x = 50 + radius * Math.cos(angle);
      const y = 50 + radius * Math.sin(angle);
      shapes.push(
        <div
          key={`${keyPrefix}-${i}`}
          className="shape"
          style={{
            position: 'absolute',
            left: `calc(${x}% - ${size / 2}px)`,
            top: `calc(${y}% - ${size / 2}px)`,
            width: `${size}px`,
            height: `${size}px`,
            color: starColour,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {shapeIcons[shape]}
        </div>
      );
    }
    return shapes;
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
        {renderShapes(newCount, size, currentRadius, `circle-${config.circleIndex}`)}
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
