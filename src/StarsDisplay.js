import React from 'react';
import './StarsDisplay.css';
import { shapePaths } from './ItemLists';

const StarsDisplay = ({ count, size, radius, circleCount, backColours, starColour, rotationAngle, shape, pointAway, outlineOnly, outlineWeight, pattern, amount, starRotation, customImage, backgroundImage }) => {
   
  const renderShapes = (count, size, radius, keyPrefix) => {
    const shapes = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI - Math.PI / 2 + (rotationAngle * Math.PI / 180);
      const x = 50 + radius * Math.cos(angle);
      const y = 50 + radius * Math.sin(angle);
    
      let shapeRotation = pointAway ? angle : 0;
      
      // Quick fix for star/pentagon rotation (https://www.reddit.com/r/InternetIsBeautiful/comments/1dsubkb/comment/lb5n94u/)
      if ((shape === 'Star' || shape === 'Pentagon') && pointAway) {
        shapeRotation += (19 * Math.PI) / 180;
      }
  
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
            transform: `rotate(${shapeRotation}rad) rotate(${starRotation}deg)`,
            overflow: 'visible',
          }}
        >
          {customImage ? (
            <image
              href={customImage}
              x="0"
              y="0"
              width="100"
              height="100"
              preserveAspectRatio="xMidYMid meet"
            />
          ) : (
            <path
              d={shapePaths[shape]}
              fill={outlineOnly ? 'none' : starColour}
              stroke={starColour}
              strokeWidth={outlineOnly ? outlineWeight : '0'}
            />
          )}
        </svg>
      );
    }
    return shapes;
  };

  const generateBackgroundStyle = () => {
    let backgroundStyle = {};
  
    if (backgroundImage) {
      backgroundStyle = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    } else {
      switch (pattern) {
        case 'Single':
          backgroundStyle = { background: backColours[0] };
          break;
        case 'Horizontal':
          switch (amount) {
            case 'Bicolour':
            default:
              backgroundStyle = {
                background: `linear-gradient(to bottom, ${backColours[0]} 50%, ${backColours[1]} 50%)`
              };
              break;
            case 'Thirds':
              backgroundStyle = {
                background: `linear-gradient(to bottom, ${backColours[0]} 33.33%, ${backColours[1]} 33.33%, ${backColours[1]} 66.66%, ${backColours[2]} 66.66%)`
              };
              break;
            case 'Quarters':
              backgroundStyle = {
                background: `linear-gradient(to top, 
                              ${backColours[3]} 0%, ${backColours[3]} 25%, 
                              ${backColours[2]} 25%, ${backColours[2]} 50%, 
                              ${backColours[1]} 50%, ${backColours[1]} 75%, 
                              ${backColours[0]} 75%, ${backColours[0]} 100%)`
              };
              break;
          }
          break;
        case 'Vertical':
          switch (amount) {
            case 'Bicolour':
            default:
              backgroundStyle = {
                background: `linear-gradient(to right, ${backColours[0]} 50%, ${backColours[1]} 50%)`
              };
              break;
            case 'Thirds':
              backgroundStyle = {
                background: `linear-gradient(to right, ${backColours[0]} 33.33%, ${backColours[1]} 33.33%, ${backColours[1]} 66.66%, ${backColours[2]} 66.66%)`
              };
              break;
            case 'Quarters':
              backgroundStyle = {
                background: `linear-gradient(to left, 
                              ${backColours[3]} 0%, ${backColours[3]} 25%, 
                              ${backColours[2]} 25%, ${backColours[2]} 50%, 
                              ${backColours[1]} 50%, ${backColours[1]} 75%, 
                              ${backColours[0]} 75%, ${backColours[0]} 100%)`
              };
              break;
          }
          break;
        case 'Bends':
          switch (amount) {
            case 'Forwards':
            default:
              backgroundStyle = {
                background: `linear-gradient(
                  to bottom right,
                  ${backColours[0]} 0%,
                  ${backColours[0]} 50%,
                  ${backColours[1]} 50%,
                  ${backColours[1]} 100%
                )`
              };
              break;
            case 'Backwards':
              backgroundStyle = {
                background: `linear-gradient(
                  to bottom left,
                  ${backColours[0]} 0%,
                  ${backColours[0]} 50%,
                  ${backColours[1]} 50%,
                  ${backColours[1]} 100%
                )`
              };
              break;
            case 'Both Ways':
              backgroundStyle = {
                background: `conic-gradient(
                  from 45deg at 50% 50%,
                  ${backColours[0]} 0deg,
                  ${backColours[0]} 90deg,
                  ${backColours[1]} 90deg,
                  ${backColours[1]} 180deg,
                  ${backColours[2]} 180deg,
                  ${backColours[2]} 270deg,
                  ${backColours[3]} 270deg,
                  ${backColours[3]} 360deg
                )`
              };
              break;
          }
          break;
        case 'Quadrants':
          backgroundStyle = {
            background: `conic-gradient(
              from 0deg at 50% 50%,
              ${backColours[0]} 0deg,
              ${backColours[0]} 90deg,
              ${backColours[1]} 90deg,
              ${backColours[1]} 180deg,
              ${backColours[2]} 180deg,
              ${backColours[2]} 270deg,
              ${backColours[3]} 270deg,
              ${backColours[3]} 360deg
            )`
          };
          break;
        case 'Cross':
          const crossWidth = '10.9%';
          backgroundStyle = {
            background: `
              linear-gradient(to right, transparent calc(50% - ${crossWidth}/2), ${backColours[0]} calc(50% - ${crossWidth}/2), ${backColours[0]} calc(50% + ${crossWidth}/2), transparent calc(50% + ${crossWidth}/2)),
              linear-gradient(to bottom, transparent calc(50% - ${crossWidth}/2), ${backColours[0]} calc(50% - ${crossWidth}/2), ${backColours[0]} calc(50% + ${crossWidth}/2), transparent calc(50% + ${crossWidth}/2)),
              ${backColours[1]}
            `
          };
          break;
        case 'Saltire':
          const saltireWidth = '10.9%'; 
          const saltireAngle = '33.8deg';
          backgroundStyle = {
            background: `
              linear-gradient(${saltireAngle}, transparent calc(50% - ${saltireWidth}/2), ${backColours[0]} calc(50% - ${saltireWidth}/2), ${backColours[0]} calc(50% + ${saltireWidth}/2), transparent calc(50% + ${saltireWidth}/2)),
              linear-gradient(-${saltireAngle}, transparent calc(50% - ${saltireWidth}/2), ${backColours[0]} calc(50% - ${saltireWidth}/2), ${backColours[0]} calc(50% + ${saltireWidth}/2), transparent calc(50% + ${saltireWidth}/2)),
              ${backColours[1]}
            `
          };
          break;
        default:
          backgroundStyle = { background: backColours[0] };
      }
    }
  
    return backgroundStyle;
  }; 

  if (count === 1) {
    return (
      <div id="stars-container" className="stars-container" style={generateBackgroundStyle()}>
        <svg
          className="shape"
          viewBox="0 0 100 100"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) rotate(${starRotation}deg)`,
            width: `${size}px`,
            height: `${size}px`,
            overflow: 'visible',
          }}
        >
          {customImage ? (
            <image
              href={customImage}
              x="0"
              y="0"
              width="100"
              height="100"
              preserveAspectRatio="xMidYMid meet"
            />
          ) : (
            <path
              d={shapePaths[shape]}
              fill={outlineOnly ? 'none' : starColour}
              stroke={starColour}
              strokeWidth={outlineOnly ? outlineWeight : '0'}
            />
          )}
        </svg>
      </div>
    );
  }

  const circleConfigurations = [
    { circleIndex: 1, countRatio: { 1: 1, 2: 2/3, 3: 4/9 }, radiusFactor: 2 },
    { circleIndex: 2, countRatio: { 2: 1/3, 3: 3/9 }, radiusFactor: 2.5 },
    { circleIndex: 3, countRatio: { 3: 2/9 }, radiusFactor: 4 },
  ];
  
  let remainingStars = count;
  const circles = circleConfigurations.slice(0, circleCount).map((config, index) => {
    let newCount;
    if (index === circleCount - 1) {
      // For the last circle
      newCount = remainingStars;
    } else {
      // For other circles
      newCount = Math.round((config.countRatio[circleCount] || 1) * count);
      remainingStars -= newCount;
    }
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
    <div 
      id="stars-container" 
      className="stars-container" 
      style={generateBackgroundStyle()}
      data-has-background-image={!!backgroundImage}
    >
      <div id="stars-only-container" className="stars-only-container">
        {circles}
      </div>
    </div>
  );
};

export default StarsDisplay;
