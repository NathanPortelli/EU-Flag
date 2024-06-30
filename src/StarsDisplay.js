import React from 'react';
import './StarsDisplay.css';

const shapePaths = {
  Star: "M50,0 L61,35 H98 L68,57 L79,91 L50,70 L21,91 L32,57 L2,35 H39 Z",
  Circle: "M50,50m-50,0a50,50 0 1,0 100,0a50,50 0 1,0 -100,0",
  Square: "M0,0 H100 V100 H0 Z",
  Hexagon: "M25,0 L75,0 L100,50 L75,100 L25,100 L0,50 Z",
  Pentagon: "M50,0 L100,38 L81,100 L19,100 L0,38 Z",
  Octagon: "M30,0 H70 L100,30 V70 L70,100 H30 L0,70 V30 Z",
  Diamond: "M50,0 L100,50 L50,100 L0,50 Z",
  Crescent: "M50,0 A50,50 0 0,0 50,100 A25,50 0 1,1 50,0 Z",
  Triangle: "M50,0 L100,100 H0 Z",
  Cross: "M50,0 V30 H80 V50 H50 V80 H30 V50 H0 V30 H30 V0 Z",
};

const StarsDisplay = ({ count, size, radius, circleCount, backColours, starColour, rotationAngle, shape, pointAway, outlineOnly, outlineWeight, pattern }) => {
  
  const renderShapes = (count, size, radius, keyPrefix) => {
    const shapes = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI - Math.PI / 2 + (rotationAngle * Math.PI / 180);
      const x = 50 + radius * Math.cos(angle);
      const y = 50 + radius * Math.sin(angle);
      const shapeRotation = pointAway ? angle : 0;
      shapes.push(
        <svg
          key={`${keyPrefix}-${i}`}
          className="shape"
          viewBox="0 0 100 100"
          style={{
            position: 'absolute',
            left: `calc(${x}% - ${size / 2}px)`,
            top: `calc(${y}% - ${size / 2}px)`,
            width: `${size}px`,
            height: `${size}px`,
            transform: `rotate(${shapeRotation}rad)`,
            fill: outlineOnly ? 'none' : starColour,
            stroke: starColour,
            strokeWidth: outlineOnly ? outlineWeight : '0'
          }}
        >
          <path d={shapePaths[shape]} />
        </svg>
      );
    }
    return shapes;
  };

  const generateBackgroundStyle = () => {
    let backgroundStyle = {};
  
    switch (pattern) {
      case 'Single':
        backgroundStyle = { background: backColours[0] };
        break;
      case 'Vertical Bicolour':
        backgroundStyle = {
          background: `linear-gradient(to right, ${backColours[0]} 50%, ${backColours[1]} 50%)`
        };
        break;
      case 'Horizontal Bicolour':
        backgroundStyle = {
          background: `linear-gradient(to bottom, ${backColours[0]} 50%, ${backColours[1]} 50%)`
        };
        break;
      case 'Vertical Thirds':
        backgroundStyle = {
          background: `linear-gradient(to right, ${backColours[0]} 33.33%, ${backColours[1]} 33.33%, ${backColours[1]} 66.66%, ${backColours[2]} 66.66%)`
        };
        break;
      case 'Horizontal Thirds':
        backgroundStyle = {
          background: `linear-gradient(to bottom, ${backColours[0]} 33.33%, ${backColours[1]} 33.33%, ${backColours[1]} 66.66%, ${backColours[2]} 66.66%)`
        };
        break;
        case 'Horizontal Quadrants':
          backgroundStyle = {
            background: `linear-gradient(to top, 
                          ${backColours[0]} 0%, ${backColours[0]} 25%, 
                          ${backColours[1]} 25%, ${backColours[1]} 50%, 
                          ${backColours[2]} 50%, ${backColours[2]} 75%, 
                          ${backColours[3]} 75%, ${backColours[3]} 100%)`
          };
          break;
        case 'Vertical Quadrants':
          backgroundStyle = {
            background: `linear-gradient(to left, 
                          ${backColours[0]} 0%, ${backColours[0]} 25%, 
                          ${backColours[1]} 25%, ${backColours[1]} 50%, 
                          ${backColours[2]} 50%, ${backColours[2]} 75%, 
                          ${backColours[3]} 75%, ${backColours[3]} 100%)`
          };
          break;
      default:
        backgroundStyle = { background: backColours[0] };
    }
  
    return backgroundStyle;
  };
  

  if (count === 1) {
    return (
      <div id="stars-container" className="stars-container" >
        <svg
          className="shape"
          viewBox="0 0 100 100"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${size}px`,
            height: `${size}px`,
            fill: outlineOnly ? 'none' : starColour,
            stroke: starColour,
            strokeWidth: outlineOnly ? outlineWeight : '0' 
          }}
        >
          <path d={shapePaths[shape]} />
        </svg>
      </div>
    );
  }

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
    <div id="stars-container" className="stars-container" style={generateBackgroundStyle()}>
      {circles}
    </div>
  );
};

export default StarsDisplay;
